import { useEffect, useRef } from 'react';

/**
 * 视频只在视口内播放。
 *
 * 背景：站点里有 4 个循环视频（首屏角色动效、About 角色舞台、#case-homa 种草视频、
 * 页尾 outro）。浏览器对视口外的 <video> 依然会持续解码，GPU / 内存被白吃掉，
 * 整页帧率会从 55-60 掉到 10 几帧。
 *
 * 策略：进入视口 → play()（play() 返回 Promise，失败静默吞掉，不报错、不打断渲染）；
 * 离开视口 → pause()；组件卸载 → disconnect observer。
 *
 * @param {object}   options
 * @param {number}   options.threshold  触发阈值，默认 0.12
 * @param {string}   options.rootMargin 观察边距
 * @param {boolean}  options.pauseOnly  true = 只负责"离开视口暂停"，不抢播放权
 *                                      （给自带播放时序的组件用，例如角色舞台）
 * @param {object}   options.ref        复用外部 ref（组件自己还要拿这个 video 做别的事时）
 * @param {boolean}  options.forceMuted  挂载时强制静音（静音是自动播放的前提），默认 true
 * @returns {React.RefObject} 挂到 <video> 上的 ref
 */
export default function useInViewVideo(options = {}) {
  const {
    threshold = 0.12,
    rootMargin = '0px',
    pauseOnly = false,
    ref: externalRef,
    forceMuted = true,
  } = options;

  const ownRef = useRef(null);
  const ref = externalRef || ownRef;

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    /* React 不保证把 muted 写进 DOM 属性，这里兜底，避免自动播放被浏览器拦下 */
    if (forceMuted) {
      el.defaultMuted = true;
      el.muted = true;
    }

    if (typeof IntersectionObserver === 'undefined') {
      if (!pauseOnly) {
        const p = el.play();
        if (p && typeof p.catch === 'function') p.catch(() => {});
      }
      return undefined;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (pauseOnly) return;
            if (!el.paused) return;
            const p = el.play();
            if (p && typeof p.catch === 'function') p.catch(() => {});
          } else {
            /* 离开视口一律 pause()。不要判断 !el.paused ——
               首次回调时 autoplay 可能还没启动（paused 仍为 true），
               一旦跳过这次，画面外的视频就再也停不下来了。
               pause() 对已暂停的元素是空操作，重复调用没有代价。 */
            el.pause();
          }
        });
      },
      { threshold, rootMargin },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold, rootMargin, pauseOnly, forceMuted]);

  return ref;
}
