import { useEffect, useRef, useState } from 'react';
import Reveal from './Reveal';
import SectionHead from './SectionHead';
import GhostText from './GhostText';
import {
  contacts,
  interests,
  metrics,
  profile,
  timeline,
} from '../data/site';
import './About.css';

/**
 * 数字滚动：进入视口时从 0 缓动到目标值（easeOutCubic），保留原始位数（如 05）。
 * 用于「关于我」的项目数据条，让它"活"起来。
 */
function CountUp({ value, duration = 1400 }) {
  const ref = useRef(null);
  const [n, setN] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    const target = parseInt(value, 10);
    if (!el || started.current) return;
    if (Number.isNaN(target)) {
      setN(target);
      return;
    }
    if (
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setN(target);
      return;
    }
    let raf = 0;
    let start = 0;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !started.current) {
            started.current = true;
            start = performance.now();
            const step = (now) => {
              const t = Math.min(1, (now - start) / duration);
              const eased = 1 - Math.pow(1 - t, 3);
              setN(Math.round(eased * target));
              if (t < 1) raf = requestAnimationFrame(step);
            };
            raf = requestAnimationFrame(step);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, duration]);

  const pad = String(value).length;
  const raw = String(n).padStart(pad, '0');
  /* 四位数以上加千分位（3,993），与案例深读板块口径一致；其余保持补零位数 */
  const shown = parseInt(value, 10) >= 1000 ? Number(raw).toLocaleString('en-US') : raw;
  return <strong ref={ref}>{shown}</strong>;
}

/* 锚点平滑滚动：尊重系统「减少动效」设置，保留 Ctrl / 中键开新标签的习惯 */
function smoothTo(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
}

export default function About() {
  /* 复制反馈：点击后显示「已复制」，1.8s 后复原 */
  const [copied, setCopied] = useState('');
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);

  const goCase = (e) => {
    /* 让快捷键开新标签页照常工作 */
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    smoothTo('case-homa');
  };

  const copy = async (value) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      /* 剪贴板不可用时静默降级：用户仍可手动选中 */
    }
    setCopied(value);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(''), 1800);
  };

  return (
    <section id="about" className="about">
      <div className="grid-lines" aria-hidden="true" />

      <div className="container">
        <SectionHead
          index="01"
          en="ABOUT / 关于我"
          title={
            <>
              先理解用户，
              <br />
              再定义产品。
            </>
          }
          serif={
            <>
              <em>Understand users first,</em> then define the product.
            </>
          }
          desc={
            <>
              两段 AI 产品与运营实习，一套从 0 搭起来的产品分析方法。我的长处不是想法多，
              而是能把模糊的问题拆到可以动手的那一层——
              <br />
              从用户研究拿到真实输入，做结构化拆解与优先级判断，再落成能验收的 PRD、原型与指标，
              最后用 AI Agent 把重复环节自动化。
            </>
          }
        />

        {/* HR 引导条：给只有三分钟的招聘方一条直达深度案例的路 */}
        <Reveal className="about__hrbar">
          <a className="about__hrLink" href="#case-homa" onClick={goCase}>
            <span className="about__hrTag mono">
              <i className="about__hrDot" aria-hidden="true" />
              HR 快速通道 · 三分钟看懂一个人
            </span>

            <span className="about__hrMain">
              <strong>想看我怎么从一份 JD 做出一整套方案？</strong>
              <span className="about__hrSub">
                看「AI 营销素材工厂」：需求洞察 → 10 章 PRD → 8 页可交互原型，全在站内打开
              </span>
            </span>

            <span className="about__hrGo">
              直接看这个案例
              <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
                <path
                  d="M8 3v9M4.5 8.5 8 12l3.5-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </a>
        </Reveal>

        <GhostText text="ABOUT ME" align="right" pos="bottom" />

        {/* 角色序列「3D 角色序列」已整体搬入中部新栏目 #lab（AI 自制形象），此处不再保留空壳 */}

        {/* 自我介绍 */}
        <div className="about__grid">
          <div className="about__content">
            <Reveal delay={80}>
              <p className="about__lede">
                <span className="about__ledeLine">
                  我是{profile.name}，{profile.school} 2027 届本科应届毕业生，方向是 AI 产品经理。
                </span>
                <span className="about__ledeLine">
                  我能独立跑完一条链路：用户研究 → 需求拆解与优先级 → PRD 与原型 → 指标复盘。
                </span>
                <span className="about__ledeLine">
                  用户说不清的感受，我能拆到具体痛点和可验收的方案；设计是我的加分项，不是我的全部。
                </span>
              </p>
            </Reveal>

            <Reveal delay={140}>
              <p className="about__text">
                我的工作方式从用户研究开始，到可验收的方案结束。做 AI 社交产品研究时，
                我把多款海外产品从注册引导一路拆到付费转化；把 470 份问卷与 1000+
                条应用商店评论逐条编码归类，收敛出 3 个核心痛点。用户嘴里的「感觉不对」，
                只有拆到具体的一句话、一个按钮、一个指标，才能变成可以动手改的东西。
              </p>
            </Reveal>

            <Reveal delay={200}>
              <p className="about__text">
                我同时把 AI 当成生产力工具。不想让重复劳动吃掉时间，我用 Coze
                搭了两个已跑通的工作流：评论分析 Agent（自动分类 + 主题归因 +
                结论生成）与电商日报 Agent（12 项指标自动计算 + 异常告警 +
                每日定时推送）；用 Dify 搭过行业资讯聚合 Agent；也用 WorkBuddy
                做过简历优化与投递自动化。人工一小时的活压到几分钟，而且每个判断都留了可复核的数据口径。
              </p>
            </Reveal>

            <Reveal delay={250}>
              <blockquote className="about__quote">
                <span className="about__quoteLine">好的设计不是加装饰，而是把混乱整理成秩序。</span>
                <span className="about__quoteLine">好的需求不是功能清单，而是能被验证的取舍。</span>
                <span className="about__quoteLine about__quoteLine--sub">
                  好的增长不是碰运气，而是把漏斗上的每一层都算清楚。
                </span>
              </blockquote>
            </Reveal>
          </div>

          <aside className="about__side">
            <Reveal delay={300}>
              <span className="eyebrow">CONTACT / 联系方式</span>
            </Reveal>
            <Reveal delay={340} className="about__contacts about__contacts--stack">
              {contacts.map((c) => (
                <div
                  className={`about__contact${c.wide ? ' about__contact--wide' : ''}`}
                  key={c.label}
                >
                  <span className="mono">{c.label}</span>

                  <div className="about__contactRow">
                    {c.href ? (
                      <a href={c.href}>{c.value}</a>
                    ) : (
                      <span className="about__contactPlain">{c.value}</span>
                    )}

                    {c.copyable ? (
                      <button
                        className="about__copy mono"
                        type="button"
                        onClick={() => copy(c.value)}
                        aria-live="polite"
                      >
                        {copied === c.value ? '已复制 ✓' : '复制'}
                      </button>
                    ) : null}
                  </div>
                </div>
              ))}
            </Reveal>

            {/* 兴趣：与联系方式同级的次级信息 */}
            <Reveal delay={380} className="about__interests">
              <span className="eyebrow">INTERESTS / 兴趣</span>
              <ul className="about__interestList">
                {interests.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </Reveal>

            {/* 简历下载：占位 PDF 只有 824 字节（损坏占位），拿到真简历前先隐藏，避免 HR 下载到打不开的文件
            <Reveal delay={420}>
              <a className="about__resume" href={resumeFile} target="_blank" rel="noopener noreferrer">
                下载简历 PDF
                <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
                  <path
                    d="M8 3v8M4.5 7.5 8 11l3.5-3.5M3.5 13h9"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </Reveal>
            */}
          </aside>
        </div>

        {/* 项目数据 */}
        <Reveal className="about__metrics">
          <ul>
            {metrics.map((m) => (
              <li key={m.label}>
                <span className="about__metricEn mono">{m.en}</span>
                <div className="about__metricValue">
                  <CountUp value={m.value} />
                  <em>{m.unit}</em>
                </div>
                <span className="about__metricLabel">{m.label}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        {/* 经历轨迹 */}
        <div className="about__timeline">
          <Reveal className="about__timelineHead">
            <span className="eyebrow">EXPERIENCE / 经历轨迹</span>
          </Reveal>

          <ul>
            {timeline.map((t, i) => (
              <Reveal as="li" key={t.org} delay={i * 90} className="about__row">
                <span className="about__rowPeriod mono">{t.period}</span>
                <div className="about__rowMain">
                  <h3>{t.title}</h3>
                  <span className="about__rowOrg">{t.org}</span>
                </div>
                <p className="about__rowDesc">{t.desc}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
