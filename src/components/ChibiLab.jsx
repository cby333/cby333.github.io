import { useEffect, useRef, useState } from 'react';
import SectionHead from './SectionHead';
import CharacterStage from './CharacterStage';
import { profile, skillChips } from '../data/site';
import Reveal from './Reveal';
import GhostText from './GhostText';
import './ChibiLab.css';

/**
 * AI 自制形象 · 中部栏目
 * 展示"照片 → AI 3D Chibi 静图 → 图生视频"的自制流程，
 * 并把原本挂在 About 里的 3D 角色序列舞台整体搬进本栏目。
 */
const STEPS = [
  {
    key: 'photo',
    kind: 'image',
    src: '/media/chibi/chibi-00-photo.jpg',
    tag: '原始照片',
    en: 'SOURCE',
    note: '一张普通的生活照，作为形象生成的输入',
    w: 960,
    h: 1200,
  },
  {
    key: 'still',
    kind: 'image',
    src: '/media/chibi/chibi-01-still.jpg',
    tag: 'AI 生成 3D Chibi',
    en: '3D CHIBI',
    note: '生图工具出图，保留本人的脸型与神态特征',
    w: 960,
    h: 1200,
  },
  {
    key: 'motion',
    kind: 'video',
    src: '/media/chibi/chibi-02-motion.mp4',
    tag: '图生视频',
    en: 'IMAGE TO VIDEO',
    note: '静图驱动成 5 秒动态片段，音画一起产出',
    w: 960,
    h: 600,
  },
];

export default function ChibiLab() {
  const videoRef = useRef(null);
  const [inView, setInView] = useState(false);

  /* 动态视频：进视口才播，离屏即停。preload="none" 保证不占用首屏带宽。
     这里自己管 IO 而不是用 useInViewVideo —— 需要拿到 inView 做按钮提示。 */
  useEffect(() => {
    const el = videoRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(
      ([e]) => setInView(e.isIntersecting && e.intersectionRatio > 0.35),
      { threshold: [0, 0.35, 0.7] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (inView) {
      const p = el.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
    } else {
      el.pause();
    }
  }, [inView]);

  return (
    <section id="lab" className="lab">
      <div className="container">
        <SectionHead
          index="06"
          en="AI CHARACTER LAB"
          title="3D 的个人形象"
          serif="Photo → 3D Chibi → Motion"
          desc="用自己的照片生成 3D Chibi 形象，再让形象动起来——生图、图生视频全流程自制"
        />

        {/* 三步流程 */}
        <ol className="lab__steps">
          {STEPS.map((s, i) => (
            <Reveal key={s.key} delay={i * 90}>
              <li className="lab__step">
                <div className={`lab__media lab__media--${s.kind}`}>
                  {s.kind === 'video' ? (
                    <video
                      ref={videoRef}
                      className="lab__motion"
                      src={s.src}
                      muted
                      loop
                      playsInline
                      /* 微信 X5 内核私有属性：强制页面内嵌播放，不被自带全屏播放器接管 */
                      webkit-playsinline="true"
                      x5-video-player-type="h5-page"
                      x5-video-player-fullscreen="false"
                      x5-video-orientation="portrait"
                      preload="none"
                      width={s.w}
                      height={s.h}
                    />
                  ) : (
                    <img
                      className="lab__img"
                      src={s.src}
                      alt={s.note}
                      width={s.w}
                      height={s.h}
                      loading="lazy"
                      decoding="async"
                    />
                  )}
                  <span className="lab__num mono">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <div className="lab__meta">
                  <span className="lab__tag mono">{s.en}</span>
                  <strong className="lab__tagCn">{s.tag}</strong>
                  <p className="lab__note">{s.note}</p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>

        {/* 3D 角色序列（整体从 About 搬入，组件与 tab 逻辑保持原样） */}
        <div className="lab__stageBlock">
          <Reveal>
            <CharacterStage variant="side">
              <span className="mono">
                AVATAR / 3D CHARACTER
                <br />
                {profile.nameEn} · 2026
              </span>
              <div className="about__badge">
                <span className="about__badgeDot" />
                <div>
                  <strong>2027 届 · AI 产品经理方向</strong>
                  <span>{profile.availability}</span>
                </div>
              </div>

              {/* 能力标签：填补徽章下方空白，设计能力只作为其中一项 */}
              <ul className="about__chips">
                {skillChips.map((s) => (
                  <li className="about__chip mono" key={s}>
                    {s}
                  </li>
                ))}
              </ul>
            </CharacterStage>
          </Reveal>
        </div>
      </div>

      <GhostText text="AI LAB" align="right" pos="bottom" />
    </section>
  );
}
