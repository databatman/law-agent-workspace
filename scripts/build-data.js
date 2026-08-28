/**
 * build-data.js — 将 knowledge/ questions/ conversations/ 的 Markdown 构建为前端 JSON 数据
 * 用法：node scripts/build-data.js
 * 输出：frontend/public/data/{knowledge,questions,conversations}.json
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const OUT_DIR = path.join(ROOT, 'frontend', 'public', 'data')

/** 读取目录下所有 md 文件（递归），返回 { abs, rel } 列表 */
function walkMd(dir, base) {
  const result = []
  if (!fs.existsSync(dir)) return result
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name)
    const rel = path.relative(base, abs)
    if (entry.isDirectory()) {
      result.push(...walkMd(abs, base))
    } else if (entry.name.endsWith('.md')) {
      result.push({ abs, rel })
    }
  }
  return result.sort((a, b) => a.rel.localeCompare(b.rel, 'zh-CN'))
}

/** 去除文件名/目录名的数字序号前缀：'01_民法' -> '民法'，'00_核心考点总览.md' -> '核心考点总览' */
function stripPrefix(name) {
  return name.replace(/^\d+_/, '').replace(/\.md$/, '')
}

/** 解析 frontmatter（--- 包裹的 YAML 子集：date/topic/tags） */
function parseFrontmatter(content) {
  const meta = {}
  const m = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n?/)
  if (!m) return { meta, body: content }
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^([A-Za-z_]+):\s*(.*)$/)
    if (!kv) continue
    const [, key, val] = kv
    if (key === 'tags') {
      meta.tags = val
        .replace(/^\[|\]$/g, '')
        .split(',')
        .map((s) => s.trim().replace(/^['"]|['"]$/g, ''))
        .filter(Boolean)
    } else {
      meta[key] = val.trim().replace(/^['"]|['"]$/g, '')
    }
  }
  return { meta, body: content.slice(m[0].length) }
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true })
}

/** 构建 knowledge.json */
function buildKnowledge() {
  const kbDir = path.join(ROOT, 'knowledge')
  const categories = []
  if (fs.existsSync(kbDir)) {
    for (const catDir of fs.readdirSync(kbDir, { withFileTypes: true })) {
      if (!catDir.isDirectory()) continue
      const abs = path.join(kbDir, catDir.name)
      const files = walkMd(abs, abs).map(({ abs: fAbs, rel }) => ({
        name: path.basename(fAbs),
        title: stripPrefix(path.basename(fAbs)),
        path: rel,
        content: fs.readFileSync(fAbs, 'utf-8'),
      }))
      categories.push({
        name: catDir.name,
        title: stripPrefix(catDir.name),
        files,
      })
    }
  }
  return { categories }
}

/** 构建 questions.json */
function buildQuestions() {
  const qDir = path.join(ROOT, 'questions', 'daily')
  const daily = walkMd(qDir, qDir).map(({ abs, rel }) => ({
    date: path.basename(rel, '.md'),
    file: rel,
    content: fs.readFileSync(abs, 'utf-8'),
  }))
  return { daily }
}

/** 构建 conversations.json */
function buildConversations() {
  const convDir = path.join(ROOT, 'conversations')
  const records = walkMd(convDir, convDir).map(({ abs, rel }) => {
    const raw = fs.readFileSync(abs, 'utf-8')
    const { meta, body } = parseFrontmatter(raw)
    return {
      date: meta.date || '',
      topic: meta.topic || stripPrefix(path.basename(abs)),
      tags: meta.tags || [],
      file: rel,
      content: body.trim(),
    }
  })
  return { records }
}

// ===== 主流程 =====
ensureDir(OUT_DIR)

const tasks = [
  ['knowledge.json', buildKnowledge()],
  ['questions.json', buildQuestions()],
  ['conversations.json', buildConversations()],
]

for (const [name, data] of tasks) {
  const out = path.join(OUT_DIR, name)
  fs.writeFileSync(out, JSON.stringify(data, null, 2), 'utf-8')
  const size = (fs.statSync(out).size / 1024).toFixed(1)
  console.log(`✓ ${name} (${size} KB)`)
}

console.log('\n数据构建完成 → frontend/public/data/')
