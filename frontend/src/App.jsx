import { useEffect, useMemo, useState } from 'react'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import KnowledgePage from './pages/KnowledgePage.jsx'
import DailyPage from './pages/DailyPage.jsx'
import RecordsPage from './pages/RecordsPage.jsx'

marked.setOptions({
  gfm: true,
  breaks: true,
})

export function Markdown({ content }) {
  const html = useMemo(() => {
    const raw = marked.parse(content || '')
    return DOMPurify.sanitize(raw)
  }, [content])
  return <div className="markdown-body" dangerouslySetInnerHTML={{ __html: html }} />
}

export function useJson(path) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  useEffect(() => {
    let cancelled = false
    fetch(path)
      .then((res) => {
        if (!res.ok) throw new Error(`加载 ${path} 失败 (${res.status})`)
        return res.json()
      })
      .then((d) => { if (!cancelled) setData(d) })
      .catch((e) => { if (!cancelled) setError(e.message) })
    return () => { cancelled = true }
  }, [path])
  return { data, error }
}

const TABS = [
  { key: 'knowledge', label: '📚 知识点' },
  { key: 'daily', label: '📝 每日十题' },
  { key: 'records', label: '💬 对话记录' },
]

export default function App() {
  const [tab, setTab] = useState('knowledge')

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-title">
          <span className="app-logo">⚖️</span>
          <div>
            <h1>法考知识库</h1>
            <p className="app-sub">国家统一法律职业资格考试 · 学习助手</p>
          </div>
        </div>
        <nav className="app-nav">
          {TABS.map((t) => (
            <button
              key={t.key}
              className={`nav-btn ${tab === t.key ? 'active' : ''}`}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </header>
      <main className="app-main">
        {tab === 'knowledge' && <KnowledgePage />}
        {tab === 'daily' && <DailyPage />}
        {tab === 'records' && <RecordsPage />}
      </main>
    </div>
  )
}
