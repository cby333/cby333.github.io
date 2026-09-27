import { useCallback, useEffect, useRef, useState } from 'react';
import SectionHead from './SectionHead';
import Reveal from './Reveal';
import GhostText from './GhostText';
import { bdInternship, campusPhotos, sideBusiness } from '../data/site';
import './Life.css';

/**
 * 「产品之外」#life
 * 三段式：校园生活（横向画廊）/ 副业实战（电商数据卡）/ 量潮科技商务 BD 实习（文字 + 凭证）。
 *
 * 性能约定：
 *  - 本区块零新增循环动画，入场统一复用现有 Reveal；
 *  - 图片全部 loading="lazy" + 明确 width/height，避免布局抖动；
 *  - Lightbox 只在点击时挂载，关闭即卸载，不引第三方依赖。
 */

/* ---------- 图片放大层：只在 shot 非空时挂载 ---------- */
function Lightbox({ shot, onClose }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    /* 打开期间锁住页面滚动，关闭时还原 */
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      className="life__lb"
      role="dialog"
      aria-modal="true"
      aria-label={shot.cap}
      onClick={onClose}
    >
      <button className="life__lbClose mono" type="button" onClick={onClose} aria-label="关闭">
        CLOSE ✕
      </button>
      <figure className="life__lbFig" onClick={(e) => e.stopPropagation()}>
        <img className="life__lbImg" src={shot.src} alt={shot.cap} />
        <figcaption className="life__lbCap mono">{shot.cap}</figcaption>
      </figure>
    </div>
  );
}

/* ---------- 横向滚动画廊：指针拖拽 + 左右按钮，无第三方库 ---------- */
function CampusGallery() {
  const railRef = useRef(null);
  const drag = useRef({ down: false, startX: 0, startLeft: 0 });
  const [dragging, setDragging] = useState(false);

  const onPointerDown = (e) => {
    const el = railRef.current;
    if (!el || e.pointerType === 'touch') return; // 触屏交给原生滚动
    drag.current = { down: true, startX: e.clientX, startLeft: el.scrollLeft };
    setDragging(true);
  };

  const onPointerMove = (e) => {
    const el = railRef.current;
    if (!el || !drag.current.down) return;
    el.scrollLeft = drag.current.startLeft - (e.clientX - drag.current.startX);
  };

  const endDrag = () => {
    if (!drag.current.down) return;
    drag.current.down = false;
    setDragging(false);
  };

  const step = (dir) => {
    const el = railRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.max(260, el.clientWidth * 0.6), behavior: 'smooth' });
  };

  return (
    <div className="life__gallery">
      <div
        ref={railRef}
        className={`life__rail${dragging ? ' is-drag' : ''}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onPointerCancel={endDrag}
      >
        {campusPhotos.map((p) => (
          <figure className="life__shot" key={p.src}>
            <img
              src={p.src}
              alt={p.cap}
              width={p.w}
              height={p.h}
              loading="lazy"
              decoding="async"
              draggable="false"
            />
            <figcaption className="life__cap mono">{p.cap}</figcaption>
          </figure>
        ))}
      </div>

      <div className="life__railCtrl">
        <span className="life__hint mono">拖动查看 · DRAG</span>
        <span className="life__arrows">
          <button type="button" className="life__arrow" onClick={() => step(-1)} aria-label="上一张">
            ←
          </button>
          <button type="button" className="life__arrow" onClick={() => step(1)} aria-label="下一张">
            →
          </button>
        </span>
      </div>
    </div>
  );
}

export default function Life() {
  const [shot, setShot] = useState(null);
  const open = useCallback((s) => setShot(s), []);
  const close = useCallback(() => setShot(null), []);

  return (
    <section id="life" className="life">
      <div className="container">
        <SectionHead
          index="08"
          en="BEYOND PRODUCT"
          title="产品之外"
          serif="Campus · Side business · BD internship"
          desc="产品是我的主业，但不是我的全部。课表之外的日子，我在跑电商、跑商务、跑真实交易——这些数字没有一个是包装出来的，都是后台截图。"
        />

        {/* ① 校园生活 */}
        <Reveal className="life__sub">
          <div className="life__subHead">
            <span className="life__subEn mono">CAMPUS LIFE</span>
            <strong className="life__subCn">校园生活</strong>
            <span className="life__subNote">长江大学 · 2023 — 2027</span>
          </div>
          <CampusGallery />
        </Reveal>

        {/* ② 副业实战 */}
        <Reveal className="life__sub">
          <div className="life__subHead">
            <span className="life__subEn mono">SIDE BUSINESS</span>
            <strong className="life__subCn">副业实战</strong>
            <span className="life__subNote">数字与后台截图一致，未做四舍五入</span>
          </div>

          <div className="life__cards">
            {sideBusiness.map((b, i) => (
              <div className="life__card" key={b.key}>
                <div className="life__cardTop">
                  <span className="life__plat mono">{b.en}</span>
                  <strong className="life__platCn">{b.cn}</strong>
                </div>

                <div className="life__big mono">
                  <em>¥</em>
                  {b.big}
                  <span className="life__bigUnit">{b.unit}</span>
                </div>
                <span className="life__bigLabel">{b.bigLabel}</span>

                <ul className="life__rows">
                  {b.rows.map((r) => (
                    <li className="life__row" key={r.k}>
                      <span>{r.k}</span>
                      <strong className="mono">{r.v}</strong>
                    </li>
                  ))}
                </ul>

                {/* 截图缩略：点击放大。auto-fit 让只有 1 张的拼多多卡自动占满一行 */}
                <div className="life__thumbs">
                  {b.shots.map((s) => (
                    <button
                      type="button"
                      className="life__thumb"
                      key={s.src}
                      onClick={() => open(s)}
                      aria-label={`放大查看 ${s.cap}`}
                    >
                      <img src={s.src} alt={s.cap} width={s.w} height={s.h} loading="lazy" decoding="async" />
                      <span className="life__zoom mono">点击放大 ⤢</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* ③ 量潮科技 · 商务 BD 实习 */}
        <Reveal className="life__sub">
          <div className="life__subHead">
            <span className="life__subEn mono">INTERNSHIP</span>
            <strong className="life__subCn">商务 BD 实习</strong>
            <span className="life__subNote">{bdInternship.period}</span>
          </div>

          <div className="life__bd">
            <div className="life__bdText">
              <span className="life__bdPeriod mono">
                {bdInternship.period} · {bdInternship.org}
              </span>
              <h3 className="life__bdTitle">{bdInternship.title}</h3>
              <p className="life__bdDesc">{bdInternship.desc}</p>
            </div>

            <div className="life__bdShots">
              {bdInternship.shots.map((s) => (
                <button
                  type="button"
                  className="life__thumb life__thumb--bd"
                  key={s.src}
                  onClick={() => open(s)}
                  aria-label={`放大查看 ${s.cap}`}
                >
                  <img src={s.src} alt={s.cap} width={s.w} height={s.h} loading="lazy" decoding="async" />
                  <span className="life__zoom mono">点击放大 ⤢</span>
                </button>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      <GhostText text="BEYOND" align="right" pos="bottom" />

      {shot ? <Lightbox shot={shot} onClose={close} /> : null}
    </section>
  );
}
