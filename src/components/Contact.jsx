import { useEffect, useRef, useState } from 'react';
import Reveal from './Reveal';
import useInViewVideo from '../hooks/useInViewVideo';
import useOffscreenAnim from '../hooks/useOffscreenAnim';
import { contacts, profile } from '../data/site';
import './Contact.css';

export default function Contact() {
  const [copied, setCopied] = useState('');
  const timer = useRef(null);
  /* 页尾动效视频：只在视口内播放（这货在页面最底部，不进视口就不该解码） */
  const outroRef = useInViewVideo({ threshold: 0.1 });
  /* 离屏动画门禁：ctDrift / bloomPulse 是本站面积最大的两个无限动画
     （2K 下约 430 万 + 106 万 px），首屏时完全不可见却一直在跑。
     滚出视口就用 is-offscreen 把它们的动画暂停，滚回再恢复。 */
  const [ctRef, ctOffscreen] = useOffscreenAnim();

  /* 鼠标跟随暖橙柔光：与首屏 hero__spot 同一套交互语言——鼠标在哪，哪里就亮起来 */
  const spotRef = useRef(null);
  const onSpotMove = (e) => {
    const el = spotRef.current;
    if (!el) return;
    const r = e.currentTarget.getBoundingClientRect();
    const mx = ((e.clientX - r.left) / r.width) * 100;
    const my = ((e.clientY - r.top) / r.height) * 100;
    el.style.setProperty('--mx', `${mx.toFixed(2)}%`);
    el.style.setProperty('--my', `${my.toFixed(2)}%`);
  };

  useEffect(() => () => clearTimeout(timer.current), []);

  /* 磁吸按钮：鼠标在按钮内时，按钮朝光标方向轻微偏移（带过渡，天然平滑） */
  const magnetRef = useRef(null);
  const onMagnet = (e) => {
    const el = magnetRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    const tx = Math.max(-12, Math.min(12, x * 0.32));
    const ty = Math.max(-12, Math.min(12, y * 0.32));
    el.style.transform = `translate(${tx}px, ${ty}px)`;
  };
  const offMagnet = () => {
    if (magnetRef.current) magnetRef.current.style.transform = 'translate(0, 0)';
  };

  const copy = async (value) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // 剪贴板不可用时静默降级：用户仍可手动选中
    }
    setCopied(value);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(''), 1800);
  };

  return (
    <section
      id="contact"
      className={`ct grain${ctOffscreen ? ' is-offscreen' : ''}`}
      ref={ctRef}
      onMouseMove={onSpotMove}
    >
      <div className="grid-lines" aria-hidden="true" />

      {/* 结尾背景视频：与首屏形成"冷暖 / 动静"反差——冷调青蓝、自动缓慢漂移 */}
      <div className="ct__media" aria-hidden="true">
        <video
          ref={outroRef}
          className="ct__video"
          src="/media/outro.mp4"
          autoPlay
          muted
          loop
          playsInline
          /* 微信 X5 内核私有属性：强制页面内嵌播放，不被自带全屏播放器接管 */
          webkit-playsinline="true"
          x5-video-player-type="h5-page"
          x5-video-player-fullscreen="false"
          x5-video-orientation="portrait"
          preload="metadata"
        />
        <div className="ct__duotone" />
        <div className="ct__scrim" />
        <div className="ct__spot" ref={spotRef} />
      </div>

      <div className="ct__bloom" aria-hidden="true" />

      <div className="container ct__inner">
        <Reveal className="ct__top">
          <span className="eyebrow">CONTACT / 联系我</span>
          <span className="mono ct__end">08 — END</span>
        </Reveal>

        <div className="ct__main">
          <Reveal delay={60}>
            <h2 className="ct__title">
              一起做点
              <br />
              有意思的东西。
            </h2>
          </Reveal>

          <Reveal delay={140}>
            <p className="ct__desc">
              如果你在找一个能把用户研究、AI 工具和视觉表达串起来的人，
              或者只是想聊聊某个 AI 产品的设计——随时写信给我，我会认真回。
            </p>
          </Reveal>

          <Reveal delay={210} className="ct__actions">
            <a
              ref={magnetRef}
              className="btn btn--dark"
              href={`mailto:${profile.email}`}
              onMouseMove={onMagnet}
              onMouseLeave={offMagnet}
            >
              {profile.email}
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
            <button
              className="btn btn--ghost"
              type="button"
              onClick={() => copy(profile.email)}
              aria-live="polite"
            >
              {copied === profile.email ? '已复制 ✓' : '复制邮箱'}
            </button>
          </Reveal>
        </div>

        <Reveal delay={120} className="ct__info">
          {contacts.map((c) => (
            <div className="ct__infoItem" key={c.label}>
              <span className="mono">{c.label}</span>
              {c.href ? (
                <a href={c.href}>{c.value}</a>
              ) : (
                <span className="ct__infoPlain">{c.value}</span>
              )}
            </div>
          ))}
          <div className="ct__infoItem">
            <span className="mono">STATUS / 状态</span>
            <span className="ct__infoPlain">
              {profile.school} · {profile.degree}
            </span>
            <span className="ct__infoNote">{profile.availability}</span>
          </div>
        </Reveal>

        <div className="ct__footer">
          <span className="mono">© 2026 {profile.nameEn} · 保留所有权利</span>
          <span className="mono ct__footerMid">DESIGNED &amp; BUILT BY {profile.nameEn}</span>
          <a
            className="ct__top-link"
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('top')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            回到顶部
            <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
              <path
                d="M8 12.5v-9M4.5 7 8 3.5 11.5 7"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
