import { useEffect, useState } from 'react';
import './BackToTop.css';

/**
 * 回到顶部：滚过一屏后出现，点击平滑回到顶部。
 * 尊重系统「减少动效」设置；不使用任何第三方动画库。
 */
export default function BackToTop() {
  const [show, setShow] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    const run = () => {
      raf = 0;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, y / max) : 0;
      const nextShow = y > window.innerHeight * 0.85;
      /* 只在真正需要时更新状态：滚动过程中每个事件都 setState 会让 React 每帧重渲染 */
      setShow((prev) => (prev === nextShow ? prev : nextShow));
      setProgress((prev) => (Math.abs(prev - p) < 0.005 ? prev : p));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(run);
    };
    run();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const toTop = () => {
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, left: 0, behavior: reduce ? 'auto' : 'smooth' });
  };

  /* 圆周长：r=19 → 119.38，用 dashoffset 做一圈进度环 */
  const C = 2 * Math.PI * 19;

  return (
    <button
      className={`totop${show ? ' is-show' : ''}`}
      type="button"
      onClick={toTop}
      aria-label="回到顶部"
      title="回到顶部"
      tabIndex={show ? 0 : -1}
    >
      <svg viewBox="0 0 44 44" width="44" height="44" aria-hidden="true">
        <circle className="totop__track" cx="22" cy="22" r="19" />
        <circle
          className="totop__ring"
          cx="22"
          cy="22"
          r="19"
          strokeDasharray={C}
          strokeDashoffset={C * (1 - progress)}
        />
      </svg>
      <span className="totop__arrow" aria-hidden="true">
        <svg viewBox="0 0 16 16" width="15" height="15">
          <path
            d="M8 13V4M4.5 7.5 8 4l3.5 3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </button>
  );
}
