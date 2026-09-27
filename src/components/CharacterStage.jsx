import { useEffect, useRef, useState } from 'react';
import useInViewVideo from '../hooks/useInViewVideo';
import './CharacterStage.css';

/**
 * 角色序列舞台
 * 立绘 → 动画视频 → 邀请 → 期待 → 呈现，五段在同一舞台里叠化过渡。
 * 五段素材自带同一套暖米色底，舞台底色与之对齐，所以过渡时不会出现色块跳变。
 * 只在进入视口时播放，离开即暂停（省内存 / CPU）。
 */
const FRAMES = [
  {
    key: 'still',
    kind: 'image',
    src: '/media/character.png',
    cn: '立绘',
    en: 'STILL',
    dur: 2800,
    alt: '曹斌颖的 3D 角色形象：正面站姿',
  },
  {
    key: 'motion',
    kind: 'video',
    src: '/media/character-motion.mp4',
    cn: '动画',
    en: 'MOTION',
    dur: 5100,
    alt: '3D 角色动画：比耶与点赞',
  },
  {
    key: 'invite',
    kind: 'image',
    src: '/media/character-invite.jpg',
    cn: '邀请',
    en: 'INVITE',
    dur: 3000,
    alt: '3D 角色侧身相邀',
  },
  {
    key: 'expect',
    kind: 'image',
    src: '/media/character-expect.jpg',
    cn: '期待',
    en: 'EXPECT',
    dur: 3000,
    alt: '3D 角色竖起食指轻触嘴唇，像在说「先别急，有惊喜」',
  },
  {
    key: 'present',
    kind: 'image',
    src: '/media/character-present.jpg',
    cn: '呈现',
    en: 'PRESENT',
    dur: 3000,
    alt: '3D 角色双手递出',
  },
];

export default function CharacterStage({ variant = 'side', children }) {
  const [idx, setIdx] = useState(0);
  const [live, setLive] = useState(false);
  const wrapRef = useRef(null);
  const videoRef = useRef(null);

  /* 统一视口策略：离开视口一定暂停。
     这里用 pauseOnly —— 舞台的播放时序由下面的 idx/live 逻辑掌管
     （视频播完要 onEnded 推进到下一帧），不能被外部的 play() 抢走控制权。 */
  useInViewVideo({ ref: videoRef, pauseOnly: true, threshold: 0.25 });

  /* 进出视口：只有看得见才跑 */
  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setLive(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      ([entry]) => setLive(entry.isIntersecting && entry.intersectionRatio > 0.3),
      { threshold: [0, 0.3, 0.65] }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* 自动推进。视频那段由 onEnded 提前接上，这里只做兜底 */
  useEffect(() => {
    if (!live) return undefined;
    const timer = setTimeout(() => setIdx((i) => (i + 1) % FRAMES.length), FRAMES[idx].dur);
    return () => clearTimeout(timer);
  }, [idx, live]);

  /* 视频播放 / 暂停 */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (FRAMES[idx].kind === 'video' && live) {
      try {
        v.currentTime = 0;
      } catch (e) {
        /* 某些浏览器在元数据未就绪时抛错，忽略 */
      }
      const p = v.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
    } else {
      v.pause();
    }
  }, [idx, live]);

  return (
    <figure className={`cs cs--${variant}`} ref={wrapRef} aria-label="曹斌颖的 3D 角色序列">
      <div className={`cs__stage${live ? ' is-live' : ''}`}>
        {FRAMES.map((f, i) => (
          <div
            key={f.key}
            className={`cs__frame cs__frame--${f.kind} cs__frame--${f.key}${
              i === idx ? ' is-on' : ''
            }`}
            aria-hidden={i !== idx}
          >
            {f.kind === 'video' ? (
              <video
                ref={videoRef}
                className="cs__media"
                src={f.src}
                muted
                playsInline
                preload="metadata"
                onEnded={() => setIdx((n) => (n + 1) % FRAMES.length)}
              />
            ) : (
              <img className="cs__media" src={f.src} alt={f.alt} draggable="false" />
            )}
          </div>
        ))}

        {/* 落地投影：只在立绘那段出现，与后面两张照片的地面阴影对齐 */}
        <span
          className={`cs__floor${FRAMES[idx].key === 'still' ? ' is-on' : ''}`}
          aria-hidden="true"
        />
        <span className="cs__vignette" aria-hidden="true" />
        <span className="cs__corner mono" aria-hidden="true">
          {String(idx + 1).padStart(2, '0')} / {String(FRAMES.length).padStart(2, '0')}
        </span>
      </div>

      <figcaption className="cs__bar">
        <ol className="cs__tabs">
          {FRAMES.map((f, i) => (
            <li key={f.key}>
              <button
                type="button"
                className={`cs__tab${i === idx ? ' is-on' : ''}`}
                onClick={() => setIdx(i)}
                aria-current={i === idx ? 'true' : undefined}
              >
                <span className="cs__tabNum mono">{String(i + 1).padStart(2, '0')}</span>
                <span className="cs__tabCn">{f.cn}</span>
                <span className="cs__tabEn mono">{f.en}</span>
                <span className="cs__tabLine" style={{ '--dur': `${f.dur}ms` }} />
              </button>
            </li>
          ))}
        </ol>

        {children ? <div className="cs__meta">{children}</div> : null}
      </figcaption>
    </figure>
  );
}
