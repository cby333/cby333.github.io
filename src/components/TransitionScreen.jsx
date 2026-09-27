import { useEffect, useRef, useState } from 'react';
import './TransitionScreen.css';

/**
 * 全屏转折屏：在「关于我」与「精选项目」之间，用一个反色满屏的巨字宣言打破节奏。
 * 进入视口时，两行大字逐行从下方裁切升起，下方说明与滚动提示随后淡入。
 */
const LINES = [
  { text: '研究是起点，', accent: false },
  { text: '结果才是答案。', accent: true },
];

export default function TransitionScreen() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  /* tsShimmer 动的是 background-position（每帧重绘约 21 万 px），
     且它所在的第二行大字是 accent 渐变文字。离屏时暂停它的动画。 */
  const [offscreen, setOffscreen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          setOffscreen(!e.isIntersecting);
          if (e.isIntersecting) setInView(true);
        });
      },
      { threshold: [0, 0.35] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="turn"
      ref={ref}
      className={`tscreen ${inView ? 'is-in' : ''}${offscreen ? ' is-offscreen' : ''}`}
      aria-label="转折：从研究到结果"
    >
      <div className="grid-lines" aria-hidden="true" />

      <div className="tscreen__inner">
        <span className="tscreen__eyebrow mono">
          <em>THE TURN</em>
          <span>· 从「我是谁」到「我做了什么」</span>
        </span>

        <h2 className="tscreen__statement">
          {LINES.map((l, i) => (
            <span className="ts__line" key={i}>
              <span className={`ts__lineInner ${l.accent ? 'is-accent' : ''}`}>{l.text}</span>
            </span>
          ))}
        </h2>

        <p className="tscreen__sub">
          七个项目，覆盖产品定义、研究、AI 工具搭建与视觉表达。下面每一个，都标了能验证的产出——不做无法证明的东西。
        </p>
      </div>

      <div className="tscreen__scroll" aria-hidden="true">
        <span className="mono">向下滚动 · 看作品</span>
        <span className="tscreen__scrollLine" />
      </div>
    </section>
  );
}
