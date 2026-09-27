import { useCallback, useEffect, useRef, useState } from 'react';
import { hero, profile } from '../data/site';
import './Hero.css';

/* 首屏 4 个场景。同一时刻只装载/播放当前这一个，其余连 src 都没有（单路解码）。 */
const SCENES = [
  {
    key: 'golden',
    cn: '金色时刻',
    src: '/media/hero/hero-scene1-golden-hour.mp4',
    /* 首帧静态图：iOS 低电量模式会禁掉自动播放，此时页面不能是一片空白，
       poster 保证"不播也成立"。用 ffmpeg 抽首帧、压到 640 宽、≤60KB。 */
    poster: '/media/hero/poster-scene1.jpg',
    /* scene1/2 是明亮的自然光 → 用站点墨色；scene3/4 是冷调电影画面 → 文字转纸白 */
    tone: 'ink',
  },
  {
    key: 'water',
    cn: '静水',
    src: '/media/hero/hero-scene2-still-water.mp4',
    poster: '/media/hero/poster-scene2.jpg',
    tone: 'ink',
  },
  {
    key: 'snow',
    cn: '雪山剑客',
    src: '/media/hero/hero-scene3-snow-swordsman.mp4',
    poster: '/media/hero/poster-scene3.jpg',
    tone: 'paper',
  },
  {
    key: 'bamboo',
    cn: '竹林剑客',
    src: '/media/hero/hero-scene4-bamboo-swordsman.mp4',
    poster: '/media/hero/poster-scene4.jpg',
    tone: 'paper',
  },
];

const FADE_MS = 1000;

export default function Hero() {
  const [ready, setReady] = useState(false);
  const spotRef = useRef(null);
  const mediaRef = useRef(null);
  const videoRefs = useRef([]);
  /* 每个场景当前的 src：只有第 1 个一上来就有，其余为空 —— 单路解码的开关。
     用 React 的 state 管理（而不是手动 setAttribute），src 变化即自动触发加载。 */
  const [srcs, setSrcs] = useState(() => {
    const a = ['', '', '', ''];
    a[0] = SCENES[0].src;
    return a;
  });
  const [active, setActive] = useState(0);
  const [pending, setPending] = useState(-1); // >=0 表示正在淡入（冷却中）
  const [inView, setInView] = useState(true);
  /* 冷却锁与当前索引必须用 ref 记：
     React 的 state 更新是异步的，同一 tick 内的连点（或脚本连点）会读到旧的 switching，
     导致一次装载多个场景 —— 直接违反"同一时刻只允许 1 路解码"。ref 是同步的，能挡住。 */
  const lockRef = useRef(false);
  const activeRef = useRef(0);
  /* 性能自适应兜底：帧时间 > 22ms（≈低于 45 FPS）就降级，场景视频不播，只留墨色底 */
  const [perfLite, setPerfLite] = useState(false);
  /* 鼠标纵向 → 手部伸展/收回：hand 0=顶部(伸展) 1=底部(收回) */
  const handTarget = useRef(0.5);
  const handCur = useRef(0.5);

  /* 首屏入场 */
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 120);
    return () => clearTimeout(t);
  }, []);

  /* rAF 缓动：把目标手部状态平滑插值到 --hand。
     只在数值真的变化时才写样式，避免每帧触发一次样式重算。 */
  useEffect(() => {
    let raf = 0;
    let last = -1;
    const tick = () => {
      handCur.current += (handTarget.current - handCur.current) * 0.1;
      const v = handCur.current;
      if (Math.abs(v - last) > 0.0005) {
        last = v;
        if (mediaRef.current) mediaRef.current.style.setProperty('--hand', v.toFixed(4));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  /* 性能自适应兜底：挂载后采样 1.5 秒帧时间。
     ★ 阈值定在 40ms（≈25 FPS）而不是 22ms：
       用户在 2560×1440 实测中位帧时间 31.6ms，若沿用 22ms 会一上来就触发降级，
       把首屏场景视频停掉 —— 而"首屏可见必须处于播放态"是本项目的硬验收项。
       所以降级只做一件事：停掉光束扫掠动画（.perf-lite .hero__media::after），
       视频一律照常播放，避免用户误以为"视频坏了"。 */
  useEffect(() => {
    let raf = 0;
    let frames = 0;
    const start = performance.now();
    const tick = (now) => {
      frames += 1;
      const elapsed = now - start;
      if (elapsed < 1500) {
        raf = requestAnimationFrame(tick);
        return;
      }
      if (elapsed / frames > 40) {
        setPerfLite(true);
        document.documentElement.classList.add('perf-lite');
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  /* 首屏滚出视口 → 当前视频暂停；滚回 → 恢复 */
  useEffect(() => {
    const el = mediaRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* React 不保证把 muted 真正写进 DOM 属性（React 的已知坑），
     而 muted 是浏览器允许自动播放的前提。这里挂载时强制写一次。
     之前视频 readyState=0 / networkState=0 一直不播，根因之一就是自动播放被拦。 */
  useEffect(() => {
    videoRefs.current.forEach((el) => {
      if (!el) return;
      el.defaultMuted = true;
      el.muted = true;
    });
  }, []);

  /* 某场景数据就绪后显式 play()（autoplay 被拦截时静默吞掉，不报错） */
  const tryPlay = useCallback((el) => {
    if (!el) return;
    const p = el.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
  }, []);

  /* 统一播放控制：只要首屏还在视口里，当前场景就必须处于播放态；
     只有滚出视口才暂停（降级不再停视频，理由见上面的兜底注释）。 */
  useEffect(() => {
    const el = videoRefs.current[active];
    if (!el) return;
    if (!inView) {
      el.pause();
    } else {
      tryPlay(el);
    }
  }, [active, inView, srcs, tryPlay]);

  /* 彻底释放：src 被清空的那些场景，显式 pause + 摘 src + load()。
     只靠 React 把 src prop 设为 undefined 是不够的 —— React 只是移除属性，
     浏览器不一定会跑媒体元素的 load 算法，解码器就一直占着。
     实测：不显式 load() 时切 4 次会累积 4 路视频都挂着 src。 */
  useEffect(() => {
    SCENES.forEach((_, i) => {
      const el = videoRefs.current[i];
      if (!el) return;
      if (!srcs[i] && el.getAttribute('src')) {
        el.pause();
        el.removeAttribute('src');
        el.load();
      }
    });
  }, [srcs]);

  /* 切换场景：冷却 = 淡入时长；按钮立即高亮，不等视频就绪。
     赋 src 交给 React（setSrcs），src 一变浏览器自动开始加载，不必手动 load()。 */
  const switchTo = (i) => {
    if (lockRef.current || i === activeRef.current) return;
    const prev = activeRef.current;
    lockRef.current = true;
    activeRef.current = i;
    setPending(i);
    setSrcs((p) => {
      const n = [...p];
      n[i] = SCENES[i].src;
      return n;
    });
    setActive(i);
    /* 淡入完成后把旧场景的 src 清空 → React 会把 DOM 上的 src 摘掉，
       浏览器随之释放解码器，保证同一时刻只有 1 路视频。 */
    window.setTimeout(() => {
      lockRef.current = false;
      setPending(-1);
      setSrcs((p) => {
        const n = [...p];
        n[prev] = '';
        return n;
      });
    }, FADE_MS);
  };

  /* 鼠标柔光 + 纵向驱动手部。位移/缩放量刻意压小，只做"呼吸感"，不晃眼 */
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5;
    const ny = (e.clientY - r.top) / r.height - 0.5;

    if (spotRef.current) {
      /* 柔光层已改为 transform 驱动，这里传像素值而不是百分比 */
      spotRef.current.style.setProperty('--mx', `${((nx + 0.5) * r.width).toFixed(1)}px`);
      spotRef.current.style.setProperty('--my', `${((ny + 0.5) * r.height).toFixed(1)}px`);
    }
    /* 鼠标越靠上 → hand 越趋近 0（伸展）；越靠下 → 趋近 1（收回） */
    handTarget.current = Math.min(1, Math.max(0, ny + 0.5));
  };

  const go = (e, id) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section
      id="top"
      className={`hero grain ${ready ? 'is-ready' : ''} hero--tone-${SCENES[active].tone}`}
      onMouseMove={onMove}
    >
      {/* 4 个场景视频叠满同一区域，只有当前那个 opacity:1。
          单路解码：切到谁才给谁 src，上一个淡入完成后立刻摘 src 彻底释放。 */}
      <div className="hero__media" ref={mediaRef} aria-hidden="true">
        <div className="hero__scenes">
          {SCENES.map((s, i) => (
            <video
              key={s.key}
              ref={(el) => {
                videoRefs.current[i] = el;
              }}
              className={`hero__video${i === active ? ' is-on' : ''}`}
              src={srcs[i] || undefined}
              poster={s.poster}
              autoPlay
              muted
              loop
              playsInline
              /* 微信 X5 内核（安卓）会劫持 <video> 用自带全屏播放器接管，
                 playsInline 只管 iOS Safari 管不了 X5。下面三个是 X5 私有属性：
                 h5-page = 强制页面内嵌播放；fullscreen=false = 不自动全屏；
                 orientation=portrait = 竖屏。改完视频才回到页面里当背景动效。 */
              webkit-playsinline="true"
              x5-video-player-type="h5-page"
              x5-video-player-fullscreen="false"
              x5-video-orientation="portrait"
              /* 弱网优化：'metadata' 只取元信息，不急着把整段视频拉完，
                 避免跟页面其他资源抢带宽；autoPlay + play() 仍会正常起播。
                 preload 只是提示值，不影响"能播"。 */
              preload={srcs[i] ? 'metadata' : 'none'}
              onLoadedData={(e) => tryPlay(e.currentTarget)}
            />
          ))}
        </div>
        {/* ★ v3 复刻要求：画面按素材原色播放，不许贴任何主题色蒙层。
            原先的 .hero__duotone（暖阳薄雾）和 .hero__glow（暖光提亮）是往站点
            暖橙/纸色上调的蒙层，会把 4 个场景的原色调淡、整体发白，已停用。
            文字可读性改由 .hero__content 后方的局部 scrim 解决（见 CSS）。 */}
        <div className="hero__spot" ref={spotRef} />
      </div>

      {/* 超大描边背景字 */}
      <div className="hero__ghost" aria-hidden="true">
        <span>AI DESIGNER</span>
        <span>AI DESIGNER</span>
      </div>

      <div className="grid-lines" />

      <div className="hero__inner container">
        <div className="hero__meta">
            <span className="eyebrow">{hero.eyebrow}</span>
            <div className="hero__metaRight mono">
              <span>{profile.roleAlt}</span>
              <span className="hero__metaSep" />
              <span>BASED IN {profile.location.replace('湖北 · ', '')}</span>
            </div>
          </div>

          <div className="hero__body">
            {/* heroBob 只挂在文字内容块上（受 max-width 860px 约束），
                不再包住整条通栏 —— 2K 下动画面积从约 205 万 px 降到约 90 万 px。 */}
            <div className="hero__content hero__bob">
              <h1 className="hero__title">
                <span className="hero__line" style={{ '--d': '0ms' }}>
                  {hero.line1}
                </span>
                <span className="hero__line" style={{ '--d': '90ms' }}>
                  {hero.line2}
                </span>
              </h1>

              {/* 衬线斜体英文行：借鉴参考站 "Hi, I'm Ayush" 的字体混排对比 */}
              <p className="hero__serif" style={{ '--d': '180ms' }}>
                <em>Research first,</em> <span>design second.</span>
              </p>

              <p className="hero__desc" style={{ '--d': '260ms' }}>
                {hero.desc}
              </p>

              <div className="hero__actions" style={{ '--d': '360ms' }}>
                <a className="btn btn--dark" href={`mailto:${profile.email}`}>
                  {hero.ctaPrimary}
                  <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
                    <path
                      d="M3 8h9M8.5 4.5 12 8l-3.5 3.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
                <a className="btn btn--ghost" href="#work" onClick={(e) => go(e, 'work')}>
                  {hero.ctaSecondary}
                </a>
              </div>

            </div>
          </div>

          <div className="hero__foot">
            <a className="hero__scroll" href="#about" onClick={(e) => go(e, 'about')}>
              <span className="mono">SCROLL</span>
              <i className="hero__scrollLine" />
            </a>

            <ul className="hero__facts">
              <li>
                <strong>{profile.school}</strong>
                <span>{profile.degree}</span>
              </li>
              <li>
                <strong>2 段</strong>
                <span>AI 产品 / 运营实习</span>
              </li>
              <li>
                <strong>6 个月</strong>
                <span>可实习周期</span>
              </li>
            </ul>
          </div>
      </div>

      {/* 场景切换器 · Lumora 形态：画面底部居中的深色胶囊条，
          激活项是白色实心 pill 在条内平滑滑动（transform 300ms） */}
      <div
        className="hero__switch"
        role="group"
        aria-label="首屏场景切换"
        style={{ '--i': active }}
      >
        <span className="hero__switchPill" aria-hidden="true" />
        {SCENES.map((s, i) => (
          <button
            key={s.key}
            type="button"
            className={`hero__sceneBtn mono${i === active ? ' is-on' : ''}`}
            aria-pressed={i === active}
            onClick={() => switchTo(i)}
          >
            {s.cn}
          </button>
        ))}
      </div>

      {/* 底部滚动字幕 */}
      <div className="hero__ticker" aria-hidden="true">
        <div className="hero__tickerTrack">
          {[0, 1].map((k) => (
            <div className="hero__tickerGroup" key={k}>
              {hero.ticker.map((t) => (
                <span key={`${k}-${t}`}>{t}</span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
