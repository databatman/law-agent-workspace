import { useState } from 'react'
import { Markdown, useJson } from '../App.jsx'

function Tags({ tags }) {
  if (!tags || tags.length === 0) return null
  return (
    <div className="record-tags">
      {tags.map((t) => (
        <span key={t} className="tag">{t}</span>
      ))}
    </div>
  )
}

export default function RecordsPage() {
  const { data, error } = useJson('/data/conversations.json')
  const [selected, setSelected] = useState(null)

  if (error) return <div className="page-error">数据加载失败：{error}（请先运行 node scripts/build-data.js）</div>
  if (!data) return <div className="page-loading">加载中…</div>

  // 按日期分组，最新在前
  const records = (data.records || []).slice().sort((a, b) => (a.date < b.date ? 1 : -1))
  const groups = {}
  records.forEach((r) => {
    if (!groups[r.date]) groups[r.date] = []
    groups[r.date].push(r)
  })
  const dates = Object.keys(groups).sort((a, b) => (a < b ? 1 : -1))

  return (
    <div className="two-pane">
      {/* 左侧：记录列表（按日期分组） */}
      <aside className="sidebar">
        <div className="sidebar-title">历史对话记录</div>
        {dates.length === 0 && <div className="empty-hint">暂无记录</div>}
        {dates.map((d) => (
          <div key={d} className="tree-category">
            <div className="tree-cat-name">{d}</div>
            {groups[d].map((r) => (
              <button
                key={r.file}
                className={`tree-file ${selected && selected.file === r.file ? 'active' : ''}`}
                onClick={() => setSelected(r)}
              >
                {r.topic}
              </button>
            ))}
          </div>
        ))}
      </aside>

      {/* 右侧：记录详情 */}
      <section className="content-pane">
        {selected ? (
          <>
            <div className="content-title">
              {selected.topic}
              <span className="content-path">{selected.date} · {selected.file}</span>
            </div>
            <Tags tags={selected.tags} />
            <Markdown content={selected.content} />
          </>
        ) : (
          <div className="empty-hint">👈 选择一条对话记录查看问题与知识点总结</div>
        )}
      </section>
    </div>
  )
}
