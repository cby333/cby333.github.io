import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Reveal from './Reveal';
import SectionHead from './SectionHead';
import './CommentAnalysisCase.css';
import './CaseHoma.css';
import './CaseDigest.css';

/* 第 13 期简报全文：站内全屏抽屉打开（与 #case-homa 同款） */
const BRIEF_URL = '/media/case-digest/digest-01-brief.html';

/* 数字卡：3 张 */
const numbers = [
  { value: '13', unit: '期', label: '已持续产出', en: 'ISSUES' },
  { value: '16', unit: '条', label: '本期归档条目', en: 'ITEMS' },
  { value: '4', unit: '类', label: '固定归档框架', en: 'CATEGORIES' },
];

/* 方法四段：来源 → 归档 → 节奏 → 沉淀 */
const method = [
  {
    label: 'SOURCE 来源',
    text: 'ProductHunt / 实验室官方公告 / 行业媒体，只收公开可溯源的条目。',
  },
  {
    label: 'ARCHIVE 归档',
    text: '四类固定框架：产品发布 / 技术突破 / 生态动向 / 数据观察。',
  },
  {
    label: 'CADENCE 节奏',
    text: '每周一期，定时产出，不断更。',
  },
  {
    label: 'SINK 沉淀',
    text: '归档进社团知识库，成为大家共用的信息底座。',
  },
];

/* 素材区：简报首屏 + 尾部判断，点击放大 */
const shots = [
  {
    img: '/media/case-digest/digest-02-preview.png',
    cap: '第 13 期简报 · 首屏',
  },
  {
    img: '/media/case-digest/digest-03-insight.png',
    cap: '数据观察与本期判断',
  },
];

export default function CaseDigest() {
  const [zoom, setZoom] = useState(null);
  const [doc, setDoc] = useState(null);
  const [closing, setClosing] = useState(false);
  const closeTimer = useRef(null);
  const scrollY = useRef(0);

  /* 抽屉：打开时记住滚动位置，关闭动画结束后再卸载（与 CaseHoma 同款） */
  const openDoc = () => {
    clearTimeout(closeTimer.current);
    scrollY.current = window.scrollY;
    setClosing(false);
    setDoc(true);
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

  /* 抽屉 / 放大期间锁滚动 + ESC 关闭 */
  useEffect(() => {
    if (!doc && !zoom) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') {
        closeDoc();
        setZoom(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doc, zoom]);

  return (
    <>
      <section id="case-digest" className="cr">
        <div className="grid-lines" aria-hidden="true" />

        <div className="container">
          <SectionHead
            index="06"
            en="DEEP DIVE / 案例深读"
            title="AI 行业资讯聚合与每周简报"
            serif={
              <>
                <em>From information overload</em> to a 10-minute weekly read.
              </>
            }
            desc="每周把公开渠道的 AI 动态抓取、清洗、按四类归档成一份可读的简报，沉淀为社团的共用信息底座——把「信息过载」变成「每周 10 分钟读完」。"
          />

          {/* 角色与动作 */}
          <Reveal className="hm__meta">
            <div className="hm__metaItem">
              <span className="mono">ROLE 角色</span>
              <p>信息设计 · 独立完成</p>
            </div>
            <div className="hm__metaItem">
              <span className="mono">WHAT I DID 我的动作</span>
              <p>来源抓取与筛选、四类归档框架设计、简报版式设计、每周定时产出与归档。</p>
            </div>
          </Reveal>

          {/* 数字卡：3 张 */}
          <Reveal className="cr__numbers cd__numbers">
            {numbers.map((n) => (
              <div className="cr__num" key={n.en}>
                <span className="cr__numVal">
                  {n.value}
                  <i>{n.unit}</i>
                </span>
                <span className="cr__numLabel">{n.label}</span>
                <span className="mono cr__numEn">{n.en}</span>
              </div>
            ))}
          </Reveal>

          {/* 方法：来源 → 归档 → 节奏 → 沉淀 */}
          <Reveal className="cr__meta">
            {method.map((m) => (
              <div className="cr__metaItem" key={m.label}>
                <span className="mono">{m.label}</span>
                <p>{m.text}</p>
              </div>
            ))}
          </Reveal>

          {/* 素材区：首屏 + 尾部判断，点击放大 */}
          <Reveal className="hm__gallery">
            {shots.map((s) => (
              <figure className="hm__shot" key={s.img}>
                <button
                  className="hm__shotMedia"
                  type="button"
                  onClick={() => setZoom({ img: s.img, name: s.cap })}
                >
                  <img src={s.img} alt={s.cap} loading="lazy" />
                  <span className="hm__zoomTip mono">点击放大</span>
                </button>
                <figcaption>
                  <span className="mono">{s.cap}</span>
                </figcaption>
              </figure>
            ))}
          </Reveal>

          {/* 入口：站内全屏抽屉读全文 */}
          <Reveal className="cr__cta">
            <button className="btn btn--dark" type="button" onClick={openDoc}>
              阅读本期简报全文
              <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
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
            <span className="cr__ctaHint mono">BRIEF · 站内打开，返回按钮或 ESC 即可回到作品集</span>
          </Reveal>

          {/* 口径说明（原样保留） */}
          <Reveal className="cr__note">
            <span className="mono">DATA AUTHENTICITY · 数据真实性</span>
            <p className="cr__noteLine">
              简报全部条目来自公开可溯源来源（ProductHunt、实验室官方公告、CNBC / 光明网 /
              科学网等），每条均在文内标注出处与日期；数据观察类数字为第三方机构调研结果（麦肯锡 /
              MIT NANDA / Gartner），非本人采集。
            </p>
          </Reveal>
        </div>
      </section>

      {/* 站内全屏抽屉：顶部返回栏 + iframe（与 #case-homa 完全同款） */}
      {createPortal(
        doc ? (
          <div
            className={`hmd${closing ? ' is-closing' : ''}`}
            role="dialog"
            aria-modal="true"
            aria-label="AI 行业周简报"
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

              <span className="hmd__title mono">第 13 期 · AI 行业周简报</span>

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
              <iframe className="hmd__iframe" src={BRIEF_URL} title="第 13 期 · AI 行业周简报" />
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
    </>
  );
}
