import { useEffect } from 'react';
import Nav from './components/Nav';
import ScrollProgress from './components/ScrollProgress';
import Hero from './components/Hero';
import About from './components/About';
import TransitionScreen from './components/TransitionScreen';
import Work from './components/Work';
import CaseHoma from './components/CaseHoma';
import CommentAnalysisCase from './components/CommentAnalysisCase';
import CaseEcom from './components/CaseEcom';
import CaseDigest from './components/CaseDigest';
import ChibiLab from './components/ChibiLab';
import Capability from './components/Capability';
import Life from './components/Life';
import Contact from './components/Contact';
import BackToTop from './components/BackToTop';

export default function App() {
  /* 全局锚点委托：所有 a[href^="#"] 一律走 JS 平滑滚动，
     替代浏览器原生锚点跳转（原生跳转快到像"没反应"，还会被固定导航压住标题）。
     目标不存在时不拦截，保留浏览器默认行为。 */
  useEffect(() => {
    const onClick = (e) => {
      const a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a) return;
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const el = document.querySelector(href);
      if (!el) return;
      e.preventDefault();
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      history.replaceState(null, '', href);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return (
    <>
      <ScrollProgress />
      <div className="ambient" aria-hidden="true" />
      <BackToTop />
      <Nav />
      <main>
        <Hero />
        <About />
        <TransitionScreen />
        <Work />
        <CaseHoma />
        <CommentAnalysisCase />
        <CaseEcom />
        <CaseDigest />
        <ChibiLab />
        <Capability />
        <Life />
        <Contact />
      </main>
    </>
  );
}
