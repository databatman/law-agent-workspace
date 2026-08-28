import { useState } from 'react'
import { Markdown, useJson } from '../App.jsx'

export default function KnowledgePage() {
  const { data, error } = useJson('/data/knowledge.json')
  const [selected, setSelected] = useState(null)

  if (error) return <div className="page-error">数据加载失败：{error}（请先运行 node scripts/build-data.js）</div>
  if (!data) return <div className="page-loading">加载中…</div>

  const categories = data.categories || []

  return (
    <div className="two-pane">
      {/* 左侧：部门法目录树 */}
      <aside className="sidebar">
        <div className="sidebar-title">部门法导航</div>
        <div className="tree">
          {categories.map((cat) => (
            <div key={cat.name} className="tree-category">
              <div className="tree-cat-name">{cat.title}</div>
              {cat.files.map((f) => (
                <button
                  key={f.name}
                  className={`tree-file ${selected && selected.name === f.name && selected.cat === cat.name ? 'active' : ''}`}
                  onClick={() => setSelected({ cat: cat.name, name: f.name, title: f.title, content: f.content })}
                >
                  {f.title}
                </button>
              ))}
            </div>
          ))}
        </div>
      </aside>

      {/* 右侧：知识点内容 */}
      <section className="content-pane">
        {selected ? (
          <>
            <div className="content-title">
              {selected.title}
              <span className="content-path">{selected.cat}/{selected.name}</span>
            </div>
            <Markdown content={selected.content} />
          </>
        ) : (
          <div className="empty-hint">👈 从左侧选择一个知识点开始浏览</div>
        )}
      </section>
    </div>
  )
}
