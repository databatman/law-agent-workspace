# 法考知识库（Law Agent Workspace）

辅助司法考试（国家统一法律职业资格考试）学习的个人知识库。

## 项目结构

```
law-agent-workspace/
├── raw/               # 待整理的原始资料（PDF/Word等，不纳入git）
├── knowledge/          # ★核心知识库：8大部门法 Markdown 知识体系
│   ├── 00_总纲/        # 考试框架、分值分布、备考策略
│   ├── 01_民法/        # 民法典七编
│   ├── 02_刑法/
│   ├── 03_民诉/
│   ├── 04_刑诉/
│   ├── 05_行政法/
│   ├── 06_商经知/
│   ├── 07_理论法/
│   └── 08_三国法/
├── questions/          # 题库
│   └── daily/          # 每日10题（YYYY-MM-DD.md）
├── conversations/      # 对话记录（问题 + 知识点 + 要点总结）
├── frontend/           # React + Vite 前端展示（3个页面）
├── scripts/            # Markdown → JSON 数据构建脚本
├── README.md
└── agent.md            # AI 工作规范
```

## 功能

1. **知识问答**：在对话中提问，AI 检索知识库后回答，并标注引用知识点
2. **对话归档**：每次交流后自动生成对话记录（问题 + 知识点 + 要点）
3. **前端展示**（`frontend/`，`npm run dev` 启动）：
   - 对话记录页：按日期浏览所有历史问题与知识点总结
   - 每日十题页：每天 10 个不同领域法考题目，答案默认隐藏，点击展开
   - 知识点页：8 大部门法核心知识点梳理与浏览

## 快速开始

```bash
# 前端
cd frontend
npm install
npm run dev        # 开发预览 http://localhost:5173

# 重新构建数据（知识库/题目/记录变更后执行）
node scripts/build-data.js
```

## 原始资料（raw）说明

- `raw/` 用于存放待整理的原始资料（PDF 讲义、真题等），**不纳入 git**（见 .gitignore）
- AI 整理后，提炼总结写入 `knowledge/` 对应部门法目录，原始文件保留在 `raw/` 备查
- 也可直接在对话中提供资料，由 AI 直接整理入库

## 知识库维护规范

详见 [agent.md](agent.md)。
