import { useEffect, useRef, useState } from 'react';

/**
 * 离屏动画门禁：区块滚出视口后，把它的大面积无限动画整体暂停。
 *
 * 背景：2K 下实测掉帧率 24%，元凶不是视频而是 CSS 无限动画 ——
 * 页面最底部的 Contact 区里 ctDrift（430 万 px）和 bloomPulse（106 万 px）
 * 在首屏完全不可见却一直在跑，白白吃掉合成与绘制预算。
 *
 * 做法：IntersectionObserver 监听容器，离屏时返回 true，
 * 由组件给容器加 class，CSS 里用 `animation-play-state: paused` 停掉动画。
 * 元素与样式都保留在原位，只是不再运动，回到视口立即恢复。
 *
 * @param {object} options
 * @param {string} options.rootMargin 提前量，默认给 200px 缓冲，避免滚动边缘反复切换
 * @returns {[React.RefObject, boolean]} [挂到容器上的 ref, 是否离屏]
 */
export default function useOffscreenAnim(options = {}) {
  const { rootMargin = '200px', threshold = 0 } = options;

  const ref = useRef(null);
  const [offscreen, setOffscreen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;

    const io = new IntersectionObserver(([entry]) => setOffscreen(!entry.isIntersecting), {
      threshold,
      rootMargin,
    });
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin, threshold]);

  return [ref, offscreen];
}
