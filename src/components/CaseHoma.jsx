import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Reveal from './Reveal';
import SectionHead from './SectionHead';
import useInViewVideo from '../hooks/useInViewVideo';
import './CaseHoma.css';

/* 入口文档：站内全屏抽屉打开，不再新开窗口 */
const DOCS = [
  {
    key: 'insight',
    href: '/media/case-homa/homa-01-insight.html',
    label: '查看需求洞察报告',
    title: '需求洞察报告',
    cap: '先研究再定义产品——行业、竞品与痛点聚类',
  },
  {
    key: 'prd',
    href: '/media/case-homa/homa-02-prd.html',
    label: '查看完整 PRD',
    title: '完整 PRD',
    cap: '10 章规则设计，含跨页规则表与边界穷举',
  },
  {
    key: 'proto',
    href: '/media/case-homa/homa-03-prototype.html',
    label: '打开可交互原型',
    title: '可交互原型',
    cap: '8 页真实可点的高保真原型',
    primary: true,
  },
];

/* 流程两张图 */
const FLOWS = [
  {
    img: '/media/case-homa/homa-04-flow.png',
    cap: '业务流程图',
    note: '从需求到投放回流的完整链路',
  },
  {
    img: '/media/case-homa/homa-05-screenflow.png',
    cap: '页面流程图',
    note: '8 个页面之间的跳转关系',
  },
];

/* 8 页原型截图 */
const PAGES = [
  { img: '/media/case-homa/homa-06-pages.png', name: '工作台' },
  { img: '/media/case-homa/homa-07-pages.png', name: '新建任务' },
  { img: '/media/case-homa/homa-08-pages.png', name: '生成中' },
  { img: '/media/case-homa/homa-09-pages.png', name: '生成结果' },
  { img: '/media/case-homa/homa-10-pages.png', name: '精修入库' },
  { img: '/media/case-homa/homa-11-pages.png', name: '素材库' },
  { img: '/media/case-homa/homa-12-pages.png', name: '模板库' },
  { img: '/media/case-homa/homa-13-pages.png', name: '数据看板' },
];

/* 附：我自己产出的物料 —— 场景图三张 */
const SCENES = [
  { img: '/media/case-homa/homa-16-scene-cream.jpg', tag: '奶油原木' },
  { img: '/media/case-homa/homa-17-scene-kitchen-a.jpg', tag: '现代厨房' },
  { img: '/media/case-homa/homa-18-scene-kitchen-b.jpg', tag: '现代厨房' },
];

/* 数字卡片：公开可溯源事实 + 本项目真实产出 */
const numbers = [
  { value: '17', unit: ' 年', label: '连续冰箱出口冠军', en: 'NO.1 EXPORT' },
  { value: '150', unit: '+ 国家和地区', label: '出口覆盖', en: 'COVERAGE' },
  { value: '1.5', unit: ' 亿台', label: '累计出口量', en: 'TOTAL EXPORT' },
  { value: '8', unit: ' 家工厂 / 1600 万台', label: '年产能', en: 'CAPACITY' },
  { value: '8', unit: ' 页', label: '可交互原型', en: 'PROTOTYPE' },
];

/* 九步流程：3 列 × 3 行，刚好满格 */
const steps = [
  {
    no: 'STEP 01',
    tag: '问题定义',
    title: '从 JD 拆出业务命题',
    body: '从市场经理 JD 拆出业务命题：营销素材产能、审核链路与投放效果之间缺少可衡量的闭环。',
  },
  {
    no: 'STEP 02',
    tag: '案头研究',
    title: '公开资料建立事实底座',
    body: '围绕奥马 17 年出口冠军、150+ 国家地区、母婴 / 嵌入式赛道与竞品打法做公开资料研究，建立事实底座。',
  },
  {
    no: 'STEP 03',
    tag: '用户与场景',
    title: '人群与内容触点',
    body: '定义目标人群（年轻家庭 / 母婴人群 / 装修用户）与内容触点（抖音、小红书、电梯屏、电商详情）。',
  },
  {
    no: 'STEP 04',
    tag: '痛点聚类',
    title: '收敛为 6 类痛点',
    body: '把素材生产到投放的问题收敛为 6 类痛点，标注出现频次与影响环节。',
  },
  {
    no: 'STEP 05',
    tag: '机会点定义',
    title: '4 个机会点并排序',
    body: '从痛点推导 4 个机会点并排序：素材工厂化、模板资产化、投放回流、审核前置。',
  },
  {
    no: 'STEP 06',
    tag: '方案与规则',
    title: '写成可验收的规则表',
    body: '信息架构、任务状态机、配额与优先级规则、权限边界——写成可验收的规则表与边界穷举。',
  },
  {
    no: 'STEP 07',
    tag: '原型与流程',
    title: '8 页原型覆盖全链路',
    body: '8 页高保真原型覆盖生产全链路，配套业务流程图与页面流程图各一张。',
  },
  {
    no: 'STEP 08',
    tag: '度量设计',
    title: '每个环节都可被衡量',
    body: '定义采纳率、产出时效、投放转化等指标口径与埋点位置，让每个环节都可被衡量。',
  },
  {
    no: 'STEP 09',
    tag: '验证与边界',
    title: '不虚构任何业务基线',
    body: 'PRD 通过结构化校验；目标值全部标注「待基线确认」——没有一个数字是编出来的业务基线。',
  },
];

export default function CaseHoma() {
  const [zoom, setZoom] = useState(null);
  const [doc, setDoc] = useState(null);
  const [closing, setClosing] = useState(false);
  const closeTimer = useRef(null);
  const scrollY = useRef(0);

  /* 种草视频：只在视口内播放 + 不预加载（有 poster 顶着，进视口再拉数据） */
  const promoRef = useInViewVideo({ threshold: 0.15 });

  /* 抽屉：打开时记住滚动位置，关闭动画结束后再卸载 */
  const openDoc = (d) => {
    clearTimeout(closeTimer.current);
    scrollY.current = window.scrollY;
    setClosing(false);
    setDoc(d);
  };

  const closeDoc = () => {
    if (!doc) return;
    setClosing(true);
    closeTimer.current = setTimeout(() => {
      setDoc(null);
      setClosing(false);
      /* 兜底：万一锁定期间位置丢了，回到打开时的位置（瞬间，不做动画） */
      if (Math.abs(window.scrollY - scrollY.current) > 2) {
        try {
          window.scrollTo({ top: scrollY.current, left: 0, behavior: 'instant' });
        } catch {
          window.scrollTo(0, scrollY.current);
        }
      }
    }, 280);
  };

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  /* 抽屉期间锁滚动 + ESC 关闭 */
  useEffect(() => {
    if (!doc) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') closeDoc();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doc]);

  /* 图廊放大：ESC 关闭 + 锁滚动 */
  useEffect(() => {
    if (!zoom) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') setZoom(null);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [zoom]);

  return (
    <section id="case-homa" className="hm">
      <div className="grid-lines" aria-hidden="true" />

      <div className="container">
        <SectionHead
          index="03"
          en="SPEC WORK / 岗位定向预演"
          title="AI 营销素材工厂"
          serif={
            <>
              <em>From one JD</em> to a full product line.
            </>
          }
          desc="从一份市场经理 JD 出发，用公开资料完成行业与竞品研究，定位营销素材的产能与投放断点，输出需求洞察、10 章 PRD 与 8 页可交互原型，把素材从「人肉排期」变成「生产—审核—投放—回流」的闭环系统。"
        />

        {/* 眉标：进来了就把性质说清楚 */}
        <Reveal className="hm__note">
          <span className="mono">SPEC WORK · 岗位定向预演</span>
          <p>本方案为针对目标岗位提前完成的独立预演。</p>
        </Reveal>

        {/* 我的角色与动作 */}
        <Reveal className="hm__meta">
          <div className="hm__metaItem">
            <span className="mono">ROLE 角色</span>
            <p>产品经理 · 独立完成</p>
          </div>
          <div className="hm__metaItem">
            <span className="mono">WHAT I DID 我的动作</span>
            <p>
              JD 拆解、公开资料案头研究、需求洞察、PRD 撰写（含跨页规则表与边界穷举）、
              信息架构与交互设计、8 页高保真原型、业务流程图与页面流程图。
            </p>
          </div>
        </Reveal>

        {/* 数字卡片 */}
        <Reveal className="hm__numbers">
          {numbers.map((n) => (
            <div className="hm__num" key={n.en}>
              <span className="hm__numVal">
                {n.value}
                <i>{n.unit}</i>
              </span>
              <span className="hm__numLabel">{n.label}</span>
              <span className="mono hm__numEn">{n.en}</span>
            </div>
          ))}
        </Reveal>

        {/* 九步流程：3 × 3 满格 */}
        <div className="hm__flow">
          {steps.map((s) => (
            <Reveal className="hm__step" key={s.no}>
              <div className="hm__stepHead">
                <span className="mono">{s.no}</span>
                <em>{s.tag}</em>
                <h3>{s.title}</h3>
              </div>
              <p className="hm__stepBody">{s.body}</p>
            </Reveal>
          ))}
        </div>

        {/* 流程图两张 */}
        <Reveal className="hm__gallery">
          {FLOWS.map((f) => (
            <figure className="hm__shot" key={f.img}>
              <button
                className="hm__shotMedia"
                type="button"
                onClick={() => setZoom({ img: f.img, name: f.cap })}
              >
                <img src={f.img} alt={f.cap} loading="lazy" />
                <span className="hm__zoomTip mono">点击放大</span>
              </button>
              <figcaption>
                <span className="mono">{f.cap}</span>
                <p>{f.note}</p>
              </figcaption>
            </figure>
          ))}
        </Reveal>

        {/* 8 页原型图廊 */}
        <Reveal className="hm__pagesHead">
          <span className="eyebrow">PROTOTYPE / 8 页可交互原型</span>
          <span className="hm__pagesHint mono">点击任意一页放大</span>
        </Reveal>

        <Reveal className="hm__pages">
          {PAGES.map((p) => (
            <button
              className="hm__page"
              type="button"
              key={p.img}
              onClick={() => setZoom({ img: p.img, name: p.name })}
            >
              <span className="hm__pageMedia">
                <img src={p.img} alt={p.name} loading="lazy" />
              </span>
              <span className="hm__pageName">{p.name}</span>
            </button>
          ))}
        </Reveal>

        {/* 三个入口：一行三列等宽居中 */}
        <Reveal className="hm__cta">
          {DOCS.map((d) => (
            <button
              className={`hm__ctaBtn${d.primary ? ' hm__ctaBtn--primary' : ''}`}
              type="button"
              key={d.key}
              onClick={() => openDoc(d)}
            >
              <span>{d.label}</span>
              <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true">
                <path
                  d="M3 8h9M8.5 4.5 12 8l-3.5 3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          ))}
        </Reveal>

        <Reveal className="hm__ctaCaps">
          {DOCS.map((d) => (
            <span className="mono" key={d.key}>
              {d.cap}
            </span>
          ))}
        </Reveal>

        {/* 数据口径说明 */}
        <Reveal className="hm__note hm__note--caliber">
          <span className="mono">DATA CALIBER · 数据口径说明</span>
          <p className="hm__noteLine">
            本方案为针对目标岗位提前完成的独立预演。全部行业与公司事实（连续 17 年冰箱出口冠军、150+
            国家地区、累计 1.5 亿台、TCL 智慧家电旗下、中山南头 8 家工厂、年产能 1600
            万台、竞品打法）均来自公开可溯源资料；洞察、PRD 与原型由本人独立产出。
          </p>
          <p className="hm__noteLine">
            PRD 与原型中的素材产出量、采用率、算力额度、并发通道数等运营数值，是为验证交互完整性而设的演示示例值，
            非企业真实经营数据；需求目标表中的目标值全部标注「待基线确认」，未虚构任何业务基线。
          </p>
        </Reveal>

        {/* ========== 附：我自己产出的物料 ========== */}
        <div className="hm__mat">
          <Reveal className="hm__matHead">
            <span className="eyebrow">MATERIALS / 附：我自己产出的物料</span>
            <h3 className="hm__matTitle">我把这套流水线，先在自己身上跑了一遍</h3>
            <p className="hm__matIntro">
              规划 AI 素材工厂的人，自己也得能出活。下面是我在做这份方案时，顺手用 AI 生成 +
              人工后期做出来的真实物料。
            </p>
          </Reveal>

          {/* ① 种草视频：区块主视觉，静音自动播放 + 循环 + 原生控件 */}
          <Reveal className="hm__matVideo">
            <figure className="hm__shot">
              <div className="hm__shotMedia hm__shotMedia--video">
                <video
                  ref={promoRef}
                  src="/media/case-homa/homa-19-promo.mp4"
                  poster="/media/case-homa/homa-19-poster.jpg"
                  muted
                  autoPlay
                  loop
                  playsInline
                  /* 微信 X5 内核私有属性：这个视频本来带 controls（人要主动看），
                     同样补上，避免在微信里被弹成全屏播放器；controls 保留不动。 */
                  webkit-playsinline="true"
                  x5-video-player-type="h5-page"
                  x5-video-player-fullscreen="false"
                  x5-video-orientation="portrait"
                  controls
                  preload="none"
                />
              </div>
              <figcaption>
                <span className="mono">① 种草视频</span>
                <p>
                  30 秒讲三件事——平嵌零缝隙、除菌 99.99%、深冷速冻。素材全部由 AI
                  生成，剪映完成后期。
                </p>
              </figcaption>
            </figure>
          </Reveal>

          {/* ② 主图改稿 + ③ before/after 对照：双列，点击走站内放大浮层 */}
          <Reveal className="hm__matPair">
            <figure className="hm__shot">
              <button
                className="hm__shotMedia"
                type="button"
                onClick={() => setZoom({ img: '/media/case-homa/homa-14-mainvisual-after.jpg', name: '电商主图 · 改稿' })}
              >
                <img
                  src="/media/case-homa/homa-14-mainvisual-after.jpg"
                  alt="电商主图 · 改稿"
                  loading="lazy"
                />
                <span className="hm__zoomTip mono">点击放大</span>
              </button>
              <figcaption>
                <span className="mono">② 电商主图 · 改稿</span>
                <p>
                  主视觉不写容量，写「除菌 99.99%」。容量是筛选条件，健康才是购买理由——这是这张图唯一但最重要的一个判断。
                </p>
              </figcaption>
            </figure>

            <figure className="hm__shot">
              <button
                className="hm__shotMedia"
                type="button"
                onClick={() => setZoom({ img: '/media/case-homa/homa-15-compare.jpg', name: 'Before / After 三组对照' })}
              >
                <img
                  src="/media/case-homa/homa-15-compare.jpg"
                  alt="Before / After 三组对照"
                  loading="lazy"
                />
                <span className="hm__zoomTip mono">点击放大</span>
              </button>
              <figcaption>
                <span className="mono">③ Before / After 对照</span>
                <p>
                  商品图对商品图、场景图对场景图、大促款对大促款。每组只讲一件事：改了什么，为什么。
                </p>
              </figcaption>
            </figure>
          </Reveal>

          {/* ④ 场景图三张横排：复用原型图廊的卡片与放大交互 */}
          <Reveal className="hm__matScenesWrap">
            <div className="hm__pagesHead">
              <span className="eyebrow">④ 场景图 × 3</span>
              <span className="hm__pagesHint mono">点击任意一张放大</span>
            </div>

            <div className="hm__matScenes">
              {SCENES.map((s) => (
                <button
                  className="hm__page"
                  type="button"
                  key={s.img}
                  onClick={() => setZoom({ img: s.img, name: s.tag })}
                >
                  <span className="hm__pageMedia">
                    <img src={s.img} alt={s.tag} loading="lazy" />
                  </span>
                  <span className="hm__pageName">{s.tag}</span>
                </button>
              ))}
            </div>

            <p className="hm__matScenesNote">同一条产品线，三种不同的生活语境。</p>
          </Reveal>

          {/* ⑤ 底部诚实标注 */}
          <Reveal className="hm__matLegal">
            <span className="mono">HONESTY NOTE · 诚实标注</span>
            <p>· 物料为本人 AI 生成 + 人工后期，示意机型，非奥马官方物料；</p>
            <p>· before 图来源：奥马官方旗舰店公开页面截图，仅用于视觉改进对比演示；</p>
            <p>
              · 卖点数据引自奥马官方公开口径（AG+ 蓝晶除菌 99.99%、PS6
              奶瓶级内胆、连续 17 年中国冰箱出口第一等）。
            </p>
          </Reveal>
        </div>
      </div>

      {/* 站内全屏抽屉：顶部返回栏 + iframe */}
      {createPortal(
        doc ? (
          <div
            className={`hmd${closing ? ' is-closing' : ''}`}
            role="dialog"
            aria-modal="true"
            aria-label={doc.title}
          >
            <div className="hmd__bar">
              <button className="hmd__back" type="button" onClick={closeDoc}>
                <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
                  <path
                    d="M13 8H4M7.5 4.5 4 8l3.5 3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                返回作品集
              </button>

              <span className="hmd__title mono">{doc.title}</span>

              <button className="hmd__close" type="button" onClick={closeDoc} aria-label="关闭">
                <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true">
                  <path
                    d="M4 4l8 8M12 4l-8 8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            <div className="hmd__frame">
              <iframe className="hmd__iframe" src={doc.href} title={doc.title} />
            </div>
          </div>
        ) : null,
        document.body
      )}

      {/* 图片放大浮层：点暗处 / ESC 关闭 */}
      {createPortal(
        zoom ? (
          <div className="hmz" role="dialog" aria-modal="true" aria-label={zoom.name}>
            <div className="hmz__backdrop" onClick={() => setZoom(null)} />
            <figure className="hmz__panel">
              <img src={zoom.img} alt={zoom.name} />
              <figcaption>
                <span className="mono">{zoom.name}</span>
              </figcaption>
            </figure>
            <button className="hmz__close" type="button" onClick={() => setZoom(null)}>
              关闭
            </button>
          </div>
        ) : null,
        document.body
      )}
    </section>
  );
}
