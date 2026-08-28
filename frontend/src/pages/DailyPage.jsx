import { useState } from 'react'
import { Markdown, useJson } from '../App.jsx'

export default function DailyPage() {
  const { data, error } = useJson('/data/questions.json')
  const [selectedDate, setSelectedDate] = useState(null)

  if (error) return <div className="page-error">数据加载失败：{error}（请先运行 node scripts/build-data.js）</div>
  if (!data) return <div className="page-loading">加载中…</div>

  const daily = (data.daily || []).slice().sort((a, b) => (a.date < b.date ? 1 : -1))
  const current = daily.find((d) => d.date === selectedDate) || daily[0] || null

  return (
    <div className="two-pane">
      {/* 左侧：日期列表 */}
      <aside className="sidebar">
        <div className="sidebar-title">每日十题</div>
        {daily.length === 0 && <div className="empty-hint">暂无题目</div>}
        {daily.map((d) => (
          <button
            key={d.date}
            className={`tree-file ${current && current.date === d.date ? 'active' : ''}`}
            onClick={() => setSelectedDate(d.date)}
          >
            {d.date}
          </button>
        ))}
      </aside>

      {/* 右侧：题目内容 */}
      <section className="content-pane">
        {current ? (
          <>
            <div className="content-title">
              {current.date} · 每日十题
              <span className="content-path">答案已隐藏，点击题目下方「查看答案」展开</span>
            </div>
            <Markdown content={current.content} />
          </>
        ) : (
          <div className="empty-hint">暂无题目，等待生成</div>
        )}
      </section>
    </div>
  )
}
