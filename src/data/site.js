/**
 * 全站文案与数据源。
 * 后续要改文字、换项目、调数据，只动这个文件即可，不用碰组件。
 */

export const profile = {
  name: '曹斌颖',
  nameEn: 'CAO BINYING',
  role: 'AI 产品设计师',
  roleAlt: '视觉 / 品牌 / 体验',
  email: '2503113318@qq.com',
  phone: '17386641219',
  wechat: 'Cy3968639803',
  qq: '2503113318',
  location: '湖北 · 荆州',
  school: '长江大学',
  degree: '本科 · 2027 届',
  availability: '可实习 6 个月 · 每周到岗 5 天 · 可立即到岗',
};

export const nav = [
  { id: 'about', label: '关于我', en: 'ABOUT' },
  { id: 'work', label: '精选项目', en: 'WORK' },
  { id: 'capability', label: '个人优势', en: 'CAPABILITY' },
  { id: 'contact', label: '联系', en: 'CONTACT' },
];

export const hero = {
  eyebrow: 'PORTFOLIO 2026',
  line1: '研究在前，',
  line2: '设计在后。',
  en: 'RESEARCH FIRST, DESIGN SECOND',
  /* 三行排版：用 \n 断行，Hero.css 的 white-space: pre-line 保证稳定落在三行 */
  desc: '我做的事情只有一件：把用户说不清的感受，变成能落地的需求——拆解过多款海外 AI 产品、\n470+ 份问卷与 1000+ 条真实评论，做结构化归因与优先级判断，落成能验收的 PRD、原型与指标，\n并用 AI Agent 把重复环节自动化；视觉上，我把结论收进统一的版式、色彩与信息层级，让判断在一秒内被看见。',
  ctaPrimary: '聊聊合作',
  ctaSecondary: '查看作品',
  ticker: [
    'PRODUCT RESEARCH',
    'COMPETITIVE ANALYSIS',
    'USER INSIGHT',
    'AI AGENT WORKFLOW',
    'VISUAL SYSTEM',
    'BRAND IDENTITY',
    'PROTOTYPING',
    'DATA STORYTELLING',
  ],
};

/** 关于我：项目数据（用真实简历数字，不虚构） */
export const metrics = [
  { value: '05', unit: '款', label: '海外 AI 产品深度拆解', en: 'PRODUCTS' },
  { value: '470', unit: '+ 份', label: '有效用户问卷回收', en: 'SURVEYS' },
  { value: '3993', unit: ' 条', label: '真实用户评论逐条分析', en: 'REVIEWS' },
  { value: '6000', unit: '字', label: '标准化产品分析报告', en: 'REPORT' },
  { value: '50', unit: '+ 款', label: 'AI 产品体验与笔记', en: 'AI TOOLS' },
  { value: '39826', unit: ' 元', label: '副业实战累计营收（闲鱼）', en: 'REVENUE' },
];

/** 经历轨迹 */
export const timeline = [
  {
    period: '2026.06 — 2026.09',
    org: '量潮科技',
    title: '商务 BD 实习生',
    desc: '参与数据服务产品「量潮商务云」商务闭环，完成议事决议数据服务报价 v1→v3 三轮议价（1.0 万 → 0.8 万成交），合同签署归档并进入履约跟踪。',
  },
  {
    period: '2026.04 — 2026.06',
    org: '猴子说话（武汉）科技有限公司',
    title: '出海 AI 产品实习生',
    desc: '搭建 AI 社交产品分析框架，拆解 5 款海外产品的注册引导、首次对话、角色创建、付费转化全流程；输出 6000 字分析报告，2 条功能建议被产品团队采纳。',
  },
  {
    period: '2025.07 — 2025.09',
    org: '武汉启盛云电子商务有限公司',
    title: '产品运营实习生',
    desc: '以客服记录、问卷、差评复盘三条线收集 20+ 条用户痛点，推动详情页与选品优化，店铺月销售额 6 万 → 9 万，复购率 15% → 28%。',
  },
  {
    period: '2024.09 — 至今',
    org: '校园 AI 产品体验社',
    title: 'AI 产品体验官',
    desc: '每周体验 1—2 款 AI 产品，累计 50+ 款、笔记 30+ 篇；组织 3 场产品拆解分享会，每场 30+ 人。',
  },
];

/** 精选项目 */
export const projects = [
  {
    id: 'p0',
    index: '01',
    title: 'AI 营销素材工厂',
    subtitle: '需求洞察 → PRD → 可交互原型，一条完整产品线',
    image: '/media/case-homa/homa-05-screenflow.png',
    tags: ['需求洞察', 'PRD', '可交互原型', '岗位定向'],
    year: '2026',
    role: '产品经理（独立完成）',
    metric: '8 页可交互原型',
    desc: '从一份市场经理 JD 出发，做行业与竞品案头研究，定位营销素材的产能与投放断点；输出需求洞察、10 章 PRD 与 8 页可交互原型，把素材生产、审核、投放、数据回流串成一条可运转的闭环。',
    extLink: { label: '查看完整案例', href: '#case-homa' },
  },
  {
    id: 'p1',
    index: '02',
    title: 'AI 社交产品竞品分析体系',
    subtitle: '从零搭一套可复用的分析框架',
    image: '/media/project-01.png',
    tags: ['竞品研究', '分析框架', '产品策略'],
    year: '2026',
    role: '产品研究',
    metric: '5 款产品 · 5 个维度',
    desc: '从产品定位、核心功能、交互设计、用户体验、商业模式 5 个维度拆解 Character.AI、Pi、Talkie 等海外产品，输出 5 份标准化报告，让团队第一次有统一的对比语言。',
    extLink: { label: '查看完整案例', href: '#case-review' },
    briefs: [
      { name: 'Character.AI', desc: '角色扮演式 AI 对话平台，可与海量虚拟角色聊天，也能自建角色' },
      { name: 'Pi', desc: 'Inflection AI 的共情式个人助手，主打温暖的日常陪伴对话' },
      { name: 'Talkie', desc: '出海 AI 角色陪伴 App，以语音与卡牌式角色互动为核心' },
      { name: 'Kajiwoto', desc: '用户自建 AI 角色、长期养成的 AI 陪伴平台' },
      { name: 'Kindroid', desc: '强调人设真实与记忆连贯的拟真 AI 伴侣' },
    ],
    featured: true,
  },
  {
    id: 'p2',
    index: '03',
    title: '用户需求翻译',
    subtitle: '3,993 条真实评论 · 5 款产品',
    image: '/media/cards/card-03-user-insight.png',
    tags: ['用户研究', '问卷设计', '数据交叉分析'],
    year: '2026',
    role: '用户研究',
    metric: '关注度 60%+',
    desc: '设计覆盖使用动机、付费意愿、功能偏好、痛点的问卷，基于 App Store 8 个地区商店抓取的 3,993 条真实评论做主题分类与交叉分析，提炼出「角色人设真实感」「对话记忆连贯性」两项核心需求。',
  },
  {
    id: 'p3',
    index: '04',
    title: 'AI 评论分析 Agent',
    subtitle: '把半天的活压到 10 分钟',
    image: '/media/case-review/review-01-canvas.png',
    tags: ['Coze', 'AI Agent', '效率工具'],
    year: '2026',
    role: '工具搭建',
    metric: '10 分钟出报告',
    desc: '人工逐条分类 1000+ 条评论要半天。用 Coze 搭建评论分析 Agent，自动按好评/差评/功能建议/BUG 分类并提取关键词，产出的 3 个用户痛点直接进入产品迭代清单。',
    extLink: { label: '查看完整案例', href: '#case-review-canvas' },
  },
  {
    id: 'p4',
    index: '05',
    title: '电商数据复盘 Agent',
    subtitle: '每天早上 8 点的自动日报',
    image: '/media/cards/card-05-ecom-cover.png',
    tags: ['Coze', '数据可视化', '自动化'],
    year: '2025',
    role: '工具搭建 / 数据',
    metric: 'GMV +41.3%',
    desc: '每天 1 小时的人工数据整理压缩到 5 分钟：12 项经营指标自动计算，早 8 点生成日报并自动标记异常。基于双月复盘把 +41.3% 的增长拆解到访客、转化率、客单价三因子，定位到客单价零变化这一未开发增长引擎。',
    extLink: { label: '查看完整案例', href: '#case-ecom' },
  },
  {
    id: 'p5',
    index: '06',
    title: 'AI 行业资讯聚合与知识库',
    subtitle: '让信息自己找上门',
    image: '/media/cards/card-06-digest-cover.png',
    tags: ['AI 工作流', '信息架构', '知识沉淀'],
    year: '2024 — 至今',
    role: '信息设计',
    metric: '每周 1 份简报',
    desc: '用 AI 工具抓取 ProductHunt、Twitter、Reddit 上的 AI 动态，按产品发布/技术突破/融资动态/用户讨论四类归档，每周生成简报沉淀进社团知识库，成为社团的共用信息底座。',
    extLink: { label: '查看完整案例', href: '#case-digest' },
  },
  {
    id: 'p6',
    index: '07',
    title: '视觉与信息图形系统',
    subtitle: '把复杂数据讲成人话',
    image: '/media/case-homa/homa-15-compare.jpg',
    tags: ['视觉设计', '信息设计', '品牌表达'],
    year: '2025 — 至今',
    role: '视觉 / 品牌',
    metric: '一页看懂结论',
    desc: '为研究报告建立统一的版式、色彩与图表规范，把多维对比数据压进单页信息图，让「结论在一秒内被看见」——这是我一直坚持的设计立场：先让信息被读懂，再谈美。',
  },
];

/** 个人优势 */
export const capabilities = [
  {
    index: 'A',
    title: '案头研究与竞品分析',
    en: 'RESEARCH',
    desc: '能独立搭建产品分析框架，从定位、功能、交互、体验、商业模式多维度做深度案头研究，输出标准化分析报告。做过 5 款海外 AI 产品深度拆解与 20+ 电商竞品跟踪。',
    tags: ['分析框架', '竞品拆解', '报告撰写'],
  },
  {
    index: 'B',
    title: '用户研究与需求翻译',
    en: 'USER INSIGHT',
    desc: '会设计问卷、会读评论、会做交叉分析，把用户模糊的感受转成具体可执行的产品需求。累计有效问卷 470+ 份，分析用户评论 1000+ 条，复购率优化从 15% 提升到 28%。',
    tags: ['问卷设计', '访谈标注', '需求文档'],
  },
  {
    index: 'C',
    title: 'AI Agent 与工具流搭建',
    en: 'AI WORKFLOW',
    desc: '熟练使用 Coze、Dify 搭建 AI Agent，做过数据自动复盘、评论智能分类、信息聚合三类真实应用，把重复劳动自动化，让时间回到判断和设计上。',
    tags: ['Coze', 'Dify', '自动化流程'],
  },
  {
    index: 'D',
    title: '信息整合与结构化表达',
    en: 'STRUCTURE',
    desc: '逻辑清晰，能把分散的行业资讯与用户反馈筛选、归类、重组成有观点的结构。写过 6000 字产品分析报告与多份竞品简报，擅长用版式和图表让结论一眼可见。',
    tags: ['信息架构', '视觉叙事', '文档'],
  },
  {
    index: 'E',
    title: '数据分析与可视化',
    en: 'DATA',
    desc: '熟练使用 Excel 数据透视表与 VLOOKUP 做多维交叉分析，配置过 12 项业务指标看板；能把数字翻译成决策依据，而不是堆成一张表。',
    tags: ['Excel', '指标看板', '交叉分析'],
  },
  {
    index: 'F',
    title: '审美与视觉执行',
    en: 'VISUAL',
    desc: '长期做版式、图表与品牌视觉的自我训练，审美取向是「克制、干净、有秩序」。相信好的设计不是加装饰，而是把混乱整理成秩序。',
    tags: ['版式', '信息图', '品牌调性'],
  },
];

export const contacts = [
  {
    label: '邮箱 EMAIL',
    value: profile.email,
    href: `mailto:${profile.email}`,
    copyable: true,
    wide: true,
  },
  {
    label: '微信 WECHAT',
    value: profile.wechat,
    href: null,
    copyable: true,
    wide: true,
  },
  { label: '电话 PHONE', value: profile.phone, href: `tel:${profile.phone}`, copyable: false },
  { label: 'QQ', value: profile.qq, href: null, copyable: true },
  { label: '所在地 LOCATION', value: profile.location, href: null, copyable: false },
];

/** 兴趣：与联系方式同级的次级信息 */
export const interests = ['音乐', '视觉设计', '体验新 AI 产品'];

/** 关于我 · 能力标签（3D 立绘徽章下方那片空白） */
export const skillChips = [
  '需求洞察',
  '竞品分析',
  '用户研究',
  'PRD 撰写',
  '可交互原型',
  'AI Agent 工作流（Coze · Dify）',
  '数据分析与归因',
  '信息架构与视觉规范',
];

/** 简历 PDF（文件放到 public/media/ 下即可生效） */
export const resumeFile = '/media/resume-caobinying.pdf';

/* ==========================================================================
   「产品之外」#life —— 产品能力之外，我是一个什么样的人
   数据口径：电商数字与后台截图一字不差，未做四舍五入；实习措辞用"参与/完成"，不用"主导/赋能"。
   ========================================================================== */

/** ① 校园生活：7 张，横向滚动画廊 */
export const campusPhotos = [
  { src: '/media/life/life-01-campus-dusk.jpg', cap: '校园黄昏', w: 1600, h: 716 },
  { src: '/media/life/life-02-river-sunset.jpg', cap: '江边落日', w: 1164, h: 871 },
  { src: '/media/life/life-03-suzhou-gate.jpg', cap: '苏州东方之门', w: 1202, h: 1451 },
  { src: '/media/life/life-04-campus-lawn.jpg', cap: '校园草坪', w: 1280, h: 1300 },
  { src: '/media/life/life-05-campus-gate.jpg', cap: '校门', w: 1255, h: 1068 },
  { src: '/media/life/life-06-dorm.jpg', cap: '宿舍', w: 1262, h: 924 },
  { src: '/media/life/life-07-teaching-bldg.jpg', cap: '教学楼', w: 1263, h: 783 },
  { src: '/media/life/life-08-suit-portrait.jpg', cap: '正装肖像', w: 948, h: 1138 },
];

/** ② 副业实战：三个平台，数字与后台截图一致 */
export const sideBusiness = [
  {
    key: 'xianyu',
    en: 'XIANYU',
    cn: '闲鱼',
    big: '39,826.38',
    unit: '元',
    bigLabel: '累计营收',
    rows: [
      { k: '店铺等级', v: '鱼小铺 L3' },
      { k: '近 30 日曝光', v: '3,617 次' },
      { k: '近 30 日访客', v: '262 人' },
      { k: '近 30 日支付', v: '¥4,411.90' },
    ],
    shots: [
      { src: '/media/life/data-xianyu-01-total.jpg', cap: '闲鱼 · 营收分析', w: 727, h: 1600 },
      { src: '/media/life/data-xianyu-02-shop.jpg', cap: '闲鱼 · 鱼小铺店铺', w: 727, h: 1600 },
    ],
  },
  {
    key: 'dewu',
    en: 'DEWU',
    cn: '得物',
    big: '33,814.62',
    unit: '元',
    bigLabel: '2026.06 总收入',
    rows: [
      { k: '2026.03 总收入', v: '¥16,130.06' },
      { k: '2026.06 总收入', v: '¥33,814.62' },
    ],
    shots: [
      { src: '/media/life/data-dewu-2026-03.jpg', cap: '得物 · 2026.03 收入', w: 727, h: 1600 },
      { src: '/media/life/data-dewu-2026-06.jpg', cap: '得物 · 2026.06 收入', w: 727, h: 1600 },
    ],
  },
  {
    key: 'pdd',
    en: 'PDD',
    cn: '拼多多',
    big: '957.04',
    unit: '元',
    bigLabel: '成交额',
    rows: [
      { k: '成交额', v: '¥957.04' },
      { k: '订单', v: '34 单' },
      { k: '访客', v: '333 人' },
    ],
    shots: [{ src: '/media/life/data-pdd-2026.jpg', cap: '拼多多 · 2026 经营数据', w: 984, h: 1258 }],
  },
];

/** ③ 量潮科技 · 商务 BD 实习 */
export const bdInternship = {
  period: '2026.06 — 2026.09',
  org: '量潮科技',
  title: '商务 BD 实习生',
  desc: '参与数据服务产品「量潮商务云」的商务闭环：独立完成议事决议数据服务的报价方案（v1→v3 三轮议价，1.0 万 → 0.8 万成交），合同已签署归档、进入履约跟踪。',
  shots: [
    /* ★ 上线脱敏：引用的是像素级涂黑后的 -m 副本，未打码原图已从 public 移除，
       只在本地素材包（D:\PM-Workspace\作品集交付包-个人生活与数据\）留档。 */
    { src: '/media/life/bd-quote-v3-m.jpg', cap: '报价单 v3 · 关键金额已脱敏', w: 727, h: 1600 },
    { src: '/media/life/bd-contract-signed-m.jpg', cap: '数据服务合同 · 已签署 2026-07-25', w: 727, h: 1600 },
  ],
};
