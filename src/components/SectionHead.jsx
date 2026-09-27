import Reveal from './Reveal';
import './SectionHead.css';

/**
 * 区块统一表头：序号 / 标题 / 右侧说明。
 */
export default function SectionHead({ index, en, title, serif, desc, align = 'split' }) {
  return (
    <Reveal className={`sec-head sec-head--${align}`}>
      <div className="sec-head__left">
        <span className="sec-head__index">
          <em>{index}</em>
          <span>{en}</span>
        </span>
        <h2 className="section-title">{title}</h2>
        {serif ? <p className="sec-head__serif">{serif}</p> : null}
      </div>
      {desc ? <p className="sec-head__desc">{desc}</p> : null}
    </Reveal>
  );
}
