import { useEffect, useRef, useState } from 'react';
import './ScrollMask.css';

/**
 * ScrollMask — 滚动遮罩揭示（自研，纯 CSS + rAF 滚动进度，零依赖）
 * 六向揭示：iris 圆孔 / wipe 擦除 / curtain 幕布 / slats 百叶 / grid 网格 / type 镂字
 * 滚动进度写入 CSS 变量 --p（0→1），各变体用纯 CSS 消费它。
 */
const VARIANTS = [
  { id: 'iris', en: 'IRIS', cn: '圆孔' },
  { id: 'wipe', en: 'WIPE', cn: '擦除' },
  { id: 'curtain', en: 'CURTAIN', cn: '幕布' },
  { id: 'slats', en: 'SLATS', cn: '百叶' },
  { id: 'grid', en: 'GRID', cn: '网格' },
  { id: 'type', en: 'TYPE', cn: '镂字' },
];

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

export default function ScrollMask({
  src,
  alt = '',
  variant = 'iris',
  word = 'REVEAL',
  columns = 8,
  rows = 6,
  scrollLength = 0.95,
  label = 'SCROLL MASK',
  hint = '向下滚动 · 揭晓海报',
  className = '',
}) {
  const rootRef = useRef(null);
  const pRef = useRef(0);
  const manualRef = useRef(0);
  const replayRef = useRef(null);
  const rafRef = useRef(0);
  const firstRun = useRef(true);
  const [active, setActive] = useState(variant);

  /* 切换变体时，重播一次「由闭到开」，让每种遮罩都看得见 */
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    replayRef.current = { start: performance.now(), dur: 1150 };
  }, [active]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const reduce =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      el.style.setProperty('--p', '1');
      return;
    }

    const tick = () => {
      const vh = window.innerHeight || 1;
      const scrollP = Math.min(Math.max((window.scrollY || 0) / (vh * scrollLength), 0), 1);
      let target;
      const rp = replayRef.current;
      if (rp) {
        const t = (performance.now() - rp.start) / rp.dur;
        if (t >= 1) {
          replayRef.current = null;
          manualRef.current = 1;
          target = Math.max(scrollP, 1);
        } else {
          target = easeOutCubic(t);
        }
      } else {
        target = Math.max(scrollP, manualRef.current);
      }
      // 平滑插值：制造 GSAP 那味儿的阻尼跟随
      pRef.current += (target - pRef.current) * 0.16;
      if (Math.abs(target - pRef.current) < 0.0006) pRef.current = target;
      el.style.setProperty('--p', pRef.current.toFixed(4));
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [scrollLength]);

  const cells = columns * rows;

  return (
    <div
      ref={rootRef}
      className={`smask ${className}`}
      style={{ '--p': '0', '--cols': String(columns), '--rows': String(rows) }}
    >
      <div className="smask__frame">
        <img className="smask__img" src={src} alt={alt} loading="lazy" />

        <div className={`smask__mask smask__mask--${active}`} aria-hidden="true">
          {active === 'slats' &&
            Array.from({ length: columns }, (_, i) => (
              <span key={i} className="smask__slat" style={{ '--i': i }} />
            ))}
          {active === 'grid' &&
            Array.from({ length: cells }, (_, i) => (
              <span
                key={i}
                className="smask__cell"
                style={{ '--i': i, '--cx': i % columns, '--cy': Math.floor(i / columns) }}
              />
            ))}
          {active === 'type' && (
            <span
              className="smask__type"
              style={{ backgroundImage: `url(${src})` }}
            >
              {word}
            </span>
          )}
        </div>

        <div className="smask__note" aria-hidden="true">
          <span className="mono">{label}</span>
          <span className="smask__hint">{hint}</span>
          <i className="smask__noteLine" />
        </div>
      </div>

      <div className="smask__bar" role="group" aria-label="遮罩变体">
        {VARIANTS.map((v) => (
          <button
            key={v.id}
            type="button"
            title={`${v.en} · ${v.cn}`}
            className={`smask__tab ${active === v.id ? 'is-on' : ''}`}
            onClick={() => setActive(v.id)}
          >
            <span className="smask__tabEn mono">{v.en}</span>
            <span className="smask__tabCn">{v.cn}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
