import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Reveal from './Reveal';
import SectionHead from './SectionHead';
import './CommentAnalysisCase.css';

/* 完整分析报告：同站内浮层打开，点暗处 / 按钮 / ESC 均可返回作品集 */
const REPORT_URL = '/media/case-review/report.html';

/* 方法组：工作流画布 + 提示词 + 循环节点（截图均为 Coze 平台真实产物） */
const methodShots = [
  {
    img: '/media/case-review/review-01-canvas.png',
    cap: '01 · 工作流画布全景',
    note: '整体链路：采集 → 分类 → 聚类 → 统计 → 验证，一条工作流跑通，不再靠人工逐条打标。',
  },
  {
    img: '/media/case-review/review-02a-prompt-system.png',
    cap: '02a · 系统提示词',
    note: '定义分类体系与角色设定：好评 / 差评 / 功能建议 / BUG 反馈 / 情感陪伴诉求五类。',
  },
  {
    img: '/media/case-review/review-02b-prompt-user.png',
    cap: '02b · 用户提示词',
    note: '约定单条评论的输入输出格式，保证结构化字段能被循环节点稳定消费。',
  },
  {
    img: '/media/case-review/review-04-loop-config.png',
    cap: '04 · 循环节点配置',
    note: '批量循环：对每一条评论调用分类节点，输出标准化字段，单批 10 分钟出报告。',
  },
];

/* 产出组：痛点清单 + 分类统计 */
const outputShots = [
  {
    img: '/media/case-review/review-03a-output-pain.png',
    cap: '03a · 痛点与优化方向',
    note: '试运行输出：3 个核心用户痛点 + 5 个产品优化方向，直接进入迭代清单。',
  },
  {
    img: '/media/case-review/review-03b-output-stats.png',
    cap: '03b · 分类统计',
    note: '按主题与情感维度统计分布，定位高负面率主题，让结论一眼可见。',
  },
];

/* 数字卡片（关键结论） */
const numbers = [
  { value: '3,993', unit: '条', label: '真实评论 · 全量样本', en: 'REVIEWS' },
  { value: '5', unit: '款', label: '海外 AI 陪伴产品', en: 'PRODUCTS' },
  { value: '8', unit: '个', label: 'App Store 地区商店', en: 'STORES' },
  { value: '52.1', unit: '%', label: '1–2 星占比', en: 'LOW RATING', footnote: '1–3 星合计 63.1%' },
  { value: '76.7', unit: '%', label: '年龄验证主题负面率 · 全站最高', en: 'NEG RATE' },
];

export default function CommentAnalysisCase() {
  const [reportOpen, setReportOpen] = useState(false);
  const closeReport = () => setReportOpen(false);

  /* 浮层期间锁滚动，ESC 直接返回 */
  useEffect(() => {
    if (!reportOpen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') setReportOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [reportOpen]);

  return (
    <>
      <section id="case-review" className="cr">
      <div className="grid-lines" aria-hidden="true" />

      <div className="container">
        {/* 头部锚点：备用落点（本期未使用，后续错开落点可直接引用） */}
        <div id="case-review-research">
          <SectionHead
            index="04"
            en="DEEP DIVE / 案例深读"
            title="3,993 条真实评论：AI 陪伴产品洞察与自动化分析 Agent"
            serif={
              <>
                <em>From 3,993 raw reviews</em> to product insight.
              </>
            }
            desc="人工逐条分类海外 AI 陪伴产品评论要花半天，且做完一次就废。我用 Coze 工作流把「采集—分类—聚类—验证」跑成一条自动化链路，从 3,993 条真实评论里挖出能落地的产品机会。"
          />
        </div>

        {/* 角色 / 方法 / 样本 / 产出 元信息行 */}
        <Reveal className="cr__meta">
          <div className="cr__metaItem">
            <span className="mono">ROLE 角色</span>
            <p>产品研究 / AI 工具搭建</p>
          </div>
          <div className="cr__metaItem">
            <span className="mono">METHOD 方法</span>
            <p>Coze 工作流 · 循环节点 · 提示词工程</p>
          </div>
          <div className="cr__metaItem">
            <span className="mono">SCOPE 样本</span>
            <p>App Store 8 地区商店 · 5 款产品</p>
          </div>
          <div className="cr__metaItem">
            <span className="mono">OUTPUT 产出</span>
            <p>分类报告 · 痛点清单 · 优化方向</p>
          </div>
        </Reveal>

        {/* 数字卡片 */}
        <Reveal className="cr__numbers">
          {numbers.map((n) => (
            <div className="cr__num" key={n.en}>
              <span className="cr__numVal">
                {n.value}
                <i>{n.unit}</i>
              </span>
              <span className="cr__numLabel">{n.label}</span>
              <span className="mono cr__numEn">{n.en}</span>
              {n.footnote ? <span className="cr__numFoot">{n.footnote}</span> : null}
            </div>
          ))}
        </Reveal>

        {/* 流程：问题 → 做了什么 → 方法 → 产出 → 验证 */}
        <div className="cr__flow">
          <Reveal className="cr__step">
            <div className="cr__stepHead">
              <span className="mono">STEP 01 · 问题</span>
              <h3>人工分类半天，慢且不可复用</h3>
            </div>
            <p className="cr__stepBody">
              评论散落在多个地区商店，口径不统一；逐条人工打标 1000+ 条要花半天，做完一次就废，无法沉淀为可复用的分析能力。
            </p>
          </Reveal>

          <Reveal className="cr__step">
            <div className="cr__stepHead">
              <span className="mono">STEP 02 · 做了什么</span>
              <h3>搭一条自动化评论分析工作流</h3>
            </div>
            <p className="cr__stepBody">
              用 Coze 把「采集 → 分类 → 聚类 → 统计 → 验证」串成一条链路，单批 10 分钟出结构化报告，把时间还给人去做判断与设计。
            </p>
          </Reveal>

          {/* 画布证据区锚点：站位 4「查看完整案例」的落点，与站位 2 错开 */}
          <Reveal id="case-review-canvas" className="cr__step cr__step--media">
            <div className="cr__stepHead">
              <span className="mono">STEP 03 · 方法</span>
              <h3>工作流 + 提示词 + 循环节点</h3>
            </div>
            <div className="cr__gallery">
              {methodShots.map((m) => (
                <figure className="cr__shot" key={m.img}>
                  <div className="cr__shotMedia">
                    <img src={m.img} alt={m.cap} loading="lazy" />
                  </div>
                  <figcaption>
                    <span className="mono">{m.cap}</span>
                    <p>{m.note}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </Reveal>

          <Reveal className="cr__step cr__step--media">
            <div className="cr__stepHead">
              <span className="mono">STEP 04 · 产出与结论</span>
              <h3>痛点清单 + 分类统计</h3>
            </div>
            <div className="cr__gallery cr__gallery--2">
              {outputShots.map((o) => (
                <figure className="cr__shot" key={o.img}>
                  <div className="cr__shotMedia">
                    <img src={o.img} alt={o.cap} loading="lazy" />
                  </div>
                  <figcaption>
                    <span className="mono">{o.cap}</span>
                    <p>{o.note}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </Reveal>

          <Reveal className="cr__step cr__step--verify">
            <div className="cr__stepHead">
              <span className="mono">STEP 05 · 验证</span>
              <h3>100 条人工抽检对照</h3>
            </div>
            <div className="cr__placeholder">
              <span className="mono">VERIFICATION · 待替换</span>
              <p>
                100 条人工抽检对照 · 填完后替换此图；判定标准：准确率 85%+ 优秀，70–85% 正常，低于 70% 则回改提示词并补充 few-shot 示例。
              </p>
            </div>
          </Reveal>
        </div>

        {/* 数据真实性说明 + 强制口径 */}
        <Reveal className="cr__note">
          <span className="mono">DATA AUTHENTICITY · 数据真实性</span>
          <p className="cr__noteLine">
            所有截图均为本人在 Coze 平台搭建与试运行时的真实产物，未做美化或虚构；过程日志 / DAG 等中间产物不对外展示。
          </p>
          <p className="cr__noteCaliber">
            本工作流试运行验证跑 8 条、准确率抽检跑 100 条；3,993 条全量样本由本地采集脚本与分类口径完成，Agent 用于把这条流程自动化并做验证。简历中「1000+ 条」为实习期间累计概数，与本项目 3,993 条专项采集口径不同。
          </p>
        </Reveal>

        {/* 主产出物入口 */}
        <Reveal className="cr__cta">
          <button className="btn btn--dark" type="button" onClick={() => setReportOpen(true)}>
            查看完整分析报告
            <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
              <path
                d="M3 8h9M8.5 4.5 12 8l-3.5 3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <span className="cr__ctaHint mono">REPORT · 站内打开，点暗处即可返回</span>
        </Reveal>
      </div>
      </section>

      {/* portal 到 body：避开 .cr 的 overflow:hidden，浮层永远盖在全站之上 */}
      {createPortal(
        reportOpen ? (
          <div className="rm" role="dialog" aria-modal="true" aria-label="完整分析报告">
            <div className="rm__backdrop" onClick={closeReport} />

            <div className="rm__panel">
              <header className="rm__bar">
                <div className="rm__barLeft">
                  <span className="mono">FULL REPORT · 完整分析报告</span>
                  <strong>3,993 条真实评论 · AI 陪伴产品洞察</strong>
                </div>

                <div className="rm__barRight">
                  <a
                    className="rm__newwin mono"
                    href={REPORT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    新窗口打开
                  </a>
                  <button className="rm__close" type="button" onClick={closeReport}>
                    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
                      <path
                        d="M13 8H4M7.5 4.5 4 8l3.5 3.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    返回作品集
                  </button>
                </div>
              </header>

              <div className="rm__frame">
                <iframe className="rm__iframe" src={REPORT_URL} title="完整分析报告" />
              </div>
            </div>

            <span className="rm__hint mono" aria-hidden="true">
              点击任意暗处 / ESC 返回作品集
            </span>
          </div>
        ) : null,
        document.body
      )}
    </>
  );
}
