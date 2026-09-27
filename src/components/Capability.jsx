import Reveal from './Reveal';
import SectionHead from './SectionHead';
import GhostText from './GhostText';
import { capabilities } from '../data/site';
import './Capability.css';

export default function Capability() {
  return (
    <section id="capability" className="cap">
      <div className="grid-lines" aria-hidden="true" />

      <div className="container">
        <SectionHead
          index="07"
          en="CAPABILITY / 个人优势"
          title={
            <>
              六件我
              <br />
              确实会做的事。
            </>
          }
          serif={
            <>
              <em>Six things</em> I can actually do.
            </>
          }
          desc="不写「学习能力强、抗压」这类谁都能填的词。下面每一条后面，都跟着一个具体的产出或数字。"
        />

        <GhostText text="CAPABILITY" align="left" pos="bottom" />

        <div className="cap__grid">
          {capabilities.map((c, i) => (
            <Reveal as="article" key={c.index} className="cap__card" delay={(i % 3) * 90}>
              <div className="cap__top">
                <span className="cap__index">{c.index}</span>
                <span className="cap__en mono">{c.en}</span>
              </div>
              <h3 className="cap__title">{c.title}</h3>
              <p className="cap__desc">{c.desc}</p>
              <ul className="cap__tags">
                {c.tags.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <span className="cap__line" aria-hidden="true" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
