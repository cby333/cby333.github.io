import Reveal from './Reveal';
import SectionHead from './SectionHead';
import GhostText from './GhostText';
import { projects } from '../data/site';
import './Work.css';

/* 卡片跟随鼠标的轻微 3D 倾斜 + 光标聚光坐标。角度刻意很小，只做"有厚度"的暗示 */
function tilt(e) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const nx = (e.clientX - r.left) / r.width - 0.5;
  const ny = (e.clientY - r.top) / r.height - 0.5;
  el.style.setProperty('--rx', `${-ny * 4.5}deg`);
  el.style.setProperty('--ry', `${nx * 6}deg`);
  el.style.setProperty('--mx', `${(nx + 0.5) * 100}%`);
  el.style.setProperty('--my', `${(ny + 0.5) * 100}%`);
}

function flatten(e) {
  e.currentTarget.style.setProperty('--rx', '0deg');
  e.currentTarget.style.setProperty('--ry', '0deg');
}

function TagList({ items }) {
  return (
    <ul className="wk__tags">
      {items.map((t) => (
        <li key={t}>{t}</li>
      ))}
    </ul>
  );
}

function FeaturedCard({ p, flip = false }) {
  return (
    <Reveal className={`wk wk--featured ${flip ? 'is-flip' : ''}`}>
      <div
        className="wk__media"
        aria-label={p.title}
        onMouseMove={tilt}
        onMouseLeave={flatten}
      >
        <img src={p.image} alt={p.title} loading="lazy" />
        <span className="wk__index mono">{p.index}</span>
        <span className="wk__year mono">{p.year}</span>
      </div>

      <div className="wk__body">
        <span className="wk__role mono">{p.role}</span>
        <h3 className="wk__title">{p.title}</h3>
        <p className="wk__sub">{p.subtitle}</p>
        <p className="wk__desc">{p.desc}</p>
        <TagList items={p.tags} />
        <div className="wk__metric">
          <span className="mono">RESULT</span>
          <strong>{p.metric}</strong>
        </div>
        {p.briefs ? (
          <div className="wk__briefs">
            <span className="wk__briefsHead mono">PRODUCTS / 竞品速览</span>
            <ul>
              {p.briefs.map((b) => (
                <li key={b.name}>
                  <strong>{b.name}</strong>
                  <span>{b.desc}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {p.extLink ? (
          <a className="wk__caseLink" href={p.extLink.href}>
            {p.extLink.label}
            <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
              <path
                d="M3 8h9M8.5 4.5 12 8l-3.5 3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        ) : null}
      </div>
    </Reveal>
  );
}

function GridCard({ p, delay }) {
  return (
    <Reveal as="article" className="wk wk--grid" delay={delay}>
      <div
        className="wk__media"
        aria-label={p.title}
        onMouseMove={tilt}
        onMouseLeave={flatten}
      >
        <img src={p.image} alt={p.title} loading="lazy" />
        <span className="wk__index mono">{p.index}</span>
      </div>

      <div className="wk__body">
        <div className="wk__gridHead">
          <h3 className="wk__title">{p.title}</h3>
          <span className="wk__yearInline mono">{p.year}</span>
        </div>
        <p className="wk__sub">{p.subtitle}</p>
        <p className="wk__desc">{p.desc}</p>
        <TagList items={p.tags} />
        <div className="wk__metric">
          <span className="mono">RESULT</span>
          <strong>{p.metric}</strong>
        </div>
        {p.extLink ? (
          <a className="wk__caseLink" href={p.extLink.href}>
            {p.extLink.label}
            <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
              <path
                d="M3 8h9M8.5 4.5 12 8l-3.5 3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        ) : null}
      </div>
    </Reveal>
  );
}

export default function Work() {
  const [first, ...rest] = projects;
  const last = rest[rest.length - 1];
  const middle = rest.slice(0, -1);

  return (
    <section id="work" className="work">
      <div className="grid-lines" aria-hidden="true" />

      <div className="container">
        <SectionHead
          index="02"
          en="SELECTED WORK / 精选项目"
          title={
            <>
              做过的事，
              <br />
              和做出来的结果。
            </>
          }
          serif={
            <>
              <em>Things I made,</em> and what came out of them.
            </>
          }
          desc="七个项目，覆盖产品定义、研究、用户洞察、AI 工具搭建与视觉表达。每个都标了真实产出，不放无法验证的东西。"
        />

        <GhostText text="SELECTED WORK" align="right" pos="bottom" />

        <div className="work__list">
          <FeaturedCard p={first} />

          <div className="work__grid">
            {middle.map((p, i) => (
              <GridCard key={p.id} p={p} delay={(i % 2) * 90} />
            ))}
          </div>

          <FeaturedCard p={last} flip />
        </div>
      </div>
    </section>
  );
}
