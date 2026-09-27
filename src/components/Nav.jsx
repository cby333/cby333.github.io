import { useEffect, useState } from 'react';
import { nav, profile } from '../data/site';
import './Nav.css';

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState('');
  const [open, setOpen] = useState(false);

  /* 滚动状态 + 阅读进度（rAF 节流：滚动事件一次一帧，避免每帧多次重渲染） */
  useEffect(() => {
    let raf = 0;
    let max = 0;
    const run = () => {
      raf = 0;
      const y = window.scrollY;
      if (!max) max = document.documentElement.scrollHeight - window.innerHeight;
      const next = max > 0 ? Math.min(1, y / max) : 0;
      const nextScrolled = y > 24;
      setScrolled((prev) => (prev === nextScrolled ? prev : nextScrolled));
      setProgress((prev) => (Math.abs(prev - next) < 0.004 ? prev : next));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(run);
    };
    run();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  /* 当前所在区块高亮 */
  useEffect(() => {
    const sections = nav
      .map((n) => document.getElementById(n.id))
      .filter(Boolean);
    if (!sections.length || typeof IntersectionObserver === 'undefined') return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.2, 0.6, 1] },
    );

    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  const go = (e, id) => {
    e.preventDefault();
    setOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <header className={`nav ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="nav__inner container">
        <a className="nav__brand" href="#top" onClick={(e) => go(e, 'top')}>
          <span className="nav__mark" aria-hidden="true" />
          <span className="nav__brandText">
            <strong>{profile.name}</strong>
            <em>{profile.nameEn}</em>
          </span>
        </a>

        <nav className={`nav__links ${open ? 'is-open' : ''}`}>
          {nav.map((item, i) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => go(e, item.id)}
              className={active === item.id ? 'is-active' : ''}
            >
              <i className="nav__num">{String(i + 1).padStart(2, '0')}</i>
              <span>{item.label}</span>
            </a>
          ))}
        </nav>

        <div className="nav__right">
          <span className="nav__status">
            <i className="nav__dot" aria-hidden="true" />
            开放机会
          </span>
          <a className="nav__cta" href={`mailto:${profile.email}`}>
            联系我
            <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
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
          <button
            className="nav__burger"
            aria-label="打开菜单"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      <div className="nav__progress" style={{ transform: `scaleX(${progress})` }} />
    </header>
  );
}
