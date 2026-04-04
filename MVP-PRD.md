# GMM 工具站 MVP 需求文档

**项目名称：** GMM Episode Hub  
**需求词：** good mythical morning  
**文档版本：** v1.0  
**日期：** 2026-04-05  

---

## 一、项目背景

Good Mythical Morning（GMM）是 YouTube 上的超人气节目，由 Rhett & Link 主持，已累积超过 3500 期视频。核心痛点：YouTube 自带搜索对历史内容检索能力极弱，大量优质内容无法被粉丝有效找到。

本站以 SEO 工具站形式切入，通过结构化数据解决"找内容"的核心需求，长期构建 GMM 粉丝的垂直流量入口。

---

## 二、目标用户

| 用户类型 | 场景描述 |
|---|---|
| 老粉丝 | 想找某期记得内容但名字不记得的视频 |
| 新粉丝 | 想按主题入坑，不知道从哪期开始看 |
| 内容创作者 | 需要 GMM 食物挑战数据做二次创作参考 |
| 搜索流量用户 | 通过 Google 搜索 "will it taco gmm" 等长尾词进入 |

---

## 三、MVP 功能范围

### 3.1 核心工具（第一版上线）

#### 🔍 Tool 1: Episode 搜索器（主打功能）
- 全文搜索 Episode 标题 + 描述关键词
- 筛选条件：发布年份、系列标签、时长范围
- 搜索结果展示：缩略图 + 标题 + 日期 + 标签 + YouTube 跳转链接
- 支持按相关度 / 日期排序

#### 🍔 Tool 2: 食物挑战记录追踪（数据层同步打标，专题页后续上线）
- 数据字段：食物名称、挑战结论（好吃/难吃/意外）、对应 Episode、日期
- MVP 阶段：数据库打标，不单独做页面

#### ❓ Tool 3: "Will It?" 系列大全（数据层同步打标，专题页后续上线）
- 识别 "Will It?" 命名模式的 Episode 自动归入该系列
- MVP 阶段：数据库打标 + 一个简单的系列列表页

### 3.2 不做（MVP 范围外）
- 用户注册 / 登录 / 收藏
- 评论 / 社区功能
- 复杂推荐算法
- 移动 App

---

## 四、页面结构

```
/                    首页（搜索框 + 最新/热门 Episode 卡片）
/search?q=xxx        搜索结果页
/episode/[id]        Episode 详情页（标题、日期、YouTube 嵌入、标签）
/series/will-it      Will It? 系列列表页
/about               关于本站
```

---

## 五、技术架构

| 层 | 选型 | 说明 |
|---|---|---|
| 前端框架 | Astro 或 Next.js | Cloudflare Pages 兼容，SSG/SSR 混合 |
| 部署 | Cloudflare Pages | 免费，全球 CDN |
| 数据库 | Cloudflare D1 | SQLite，免费额度，生态内闭环 |
| 数据来源 | YouTube Data API v3 | 拉取 GMM 频道全量视频元数据 |
| 定时同步 | Cloudflare Workers Cron Trigger | 每日自动拉取新 Episode |
| 样式 | Tailwind CSS | 快速开发，轻量 |

### 数据流
```
YouTube Data API v3
    ↓ Cloudflare Workers Cron（每日触发）
Cloudflare D1（episodes 表）
    ↓ Workers API / D1 直查
Cloudflare Pages 前端
```

---

## 六、数据库 Schema（核心表）

```sql
-- Episode 主表
CREATE TABLE episodes (
  id          TEXT PRIMARY KEY,      -- YouTube video ID
  title       TEXT NOT NULL,
  description TEXT,
  published_at DATETIME,
  thumbnail   TEXT,                  -- 缩略图 URL
  duration    INTEGER,               -- 秒
  view_count  INTEGER,
  tags        TEXT,                  -- JSON 数组，系列标签
  series      TEXT,                  -- 'will_it' | 'food_test' | 'vs' | null
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 标签索引（后续扩展用）
CREATE TABLE episode_tags (
  episode_id  TEXT REFERENCES episodes(id),
  tag         TEXT,
  PRIMARY KEY (episode_id, tag)
);
```

---

## 七、SEO 策略

| 关键词类型 | 示例 | 对应页面 |
|---|---|---|
| 品牌词 | good mythical morning episodes | 首页 |
| 系列词 | will it taco gmm | /series/will-it |
| 内容词 | gmm food challenge list | 食物挑战专题页（后续）|
| 长尾词 | good mythical morning season 2019 | 搜索结果页 |

- 每个 Episode 详情页独立 URL，静态生成，利于 Google 收录
- Title / Meta Description 模板化自动生成
- Sitemap 自动生成

---

## 八、上线里程碑

| 阶段 | 目标 | 预计完成 |
|---|---|---|
| M1 | 数据库 Schema + YouTube API 拉数据脚本跑通 | 开工后 3 天 |
| M2 | 首页 + 搜索功能上线 Cloudflare Pages | M1 后 5 天 |
| M3 | Episode 详情页 + Will It? 列表页 | M2 后 3 天 |
| M4 | SEO 优化 + Sitemap + Google Search Console 提交 | M3 后 2 天 |

---

## 九、成功指标（上线后 30 天）

- Google 收录 Episode 详情页 > 500 条
- 自然搜索日均 UV > 100
- 核心关键词 "good mythical morning episodes" 进入 Google 前 20

---

*文档维护：妙妙 | 项目负责人：峰姐姐*
