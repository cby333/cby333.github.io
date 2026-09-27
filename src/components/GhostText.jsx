import './GhostText.css';

/**
 * 区块背景里的超大描边字。
 * 与首屏 .hero__ghost 是同一套语言，让"巨型 outline 排版"贯穿全站。
 * text 用英文，align 控制左右，pos 控制贴顶还是贴底。
 */
export default function GhostText({ text, align = 'left', pos = 'bottom' }) {
  return (
    <div className={`ghost-text ghost-text--${align} ghost-text--${pos}`} aria-hidden="true">
      <span>{text}</span>
    </div>
  );
}
