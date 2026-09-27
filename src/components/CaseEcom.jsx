import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Reveal from './Reveal';
import SectionHead from './SectionHead';
import './CommentAnalysisCase.css';
import './CaseHoma.css';
import './CaseEcom.css';

/* 完整复盘报告：站内浮层打开（同 #case-review 规格），另留新窗口入口 */
const REPORT_URL = '/media/case-ecom/ecom-03-report.html';

/* 数字卡片：全部取自店铺后台真实双月数据，不用自己挑的数 */
const numbers = [
  { value: '+41.3', unit: '%', label: 'GMV · 63,900 → 90,300 元', en: 'GMV' },
  { value: '+29.8', unit: '%', label: '商品访客 · 1.68万 → 2.18万', en: 'VISITORS' },
  { value: '+8.7', unit: '%', label: '成交转化率 · 8.46% → 9.20%（相对提升）', en: 'CONV RATE' },
  { value: '0.0', unit: '%', label: '客单价零贡献 · 45.01 → 45.01 元', en: 'AOV' },
  { value: '10.9', unit: '%', label: '退款率持平 · 10.8% → 10.9%', en: 'REFUND' },
];

/* 三因子归因：访客 +29.8% / 转化率 +8.7%（相对提升）/ 客单价 0.0%。
   条形长度按 29.8 : 8.7 : 0 等比换算；客单价零增长是本次复盘的核心发现。 */
const factorBars = [
  { label: '访客数', value: '+29.8%', width: '100%', zero: false },
  { label: '转化率', value: '+8.7%', width: '29%', zero: false },
  { label: '客单价', value: '0.0%', width: '0%', zero: true },
];

/* 归因瀑布图：看绝对值贡献，与条形图的相对变化互为补充 */
const WATERFALL = {
  img: '/media/case-ecom/ecom-04-attribution.png',
  cap: '03 · 逐项替换归因（瀑布图）',
  note: '逐项替换归因：63,900 → +19,042（访客）→ +7,294（转化率）→ 0（客单价）→ 90,300。增长的七成来自访客量，客单价零贡献。',
};

/* 证据图：抖音电商罗盘后台两个月同口径截图 */
const dashboards = [
  {
    img: '/media/case-ecom/ecom-01-dashboard-jul.jpg',
    cap: '01 · 数据源头：店铺后台真实经营数据（7 月）',
    note: '抖音电商罗盘后台 7 月交易概况：成交 6.39 万 / 订单 1,420 / 转化率 8.46%。',
  },
  {
    img: '/media/case-ecom/ecom-02-dashboard-sep.jpg',
    cap: '02 · 同口径对照：9 月经营数据',
    note: '同口径 9 月截图：成交 9.03 万 / 订单 2,006 / 转化率 9.20%，两月口径一致、可比。',
  },
];

export default function CaseEcom() {
  const [reportOpen, setReportOpen] = useState(false);
  const [zoom, setZoom] = useState(null);
  const closeReport = () => setReportOpen(false);

  /* 报告浮层 / 图片放大期间锁滚动，ESC 直接返回 */
  useEffect(() => {
    if (!reportOpen && !zoom) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setReportOpen(false);
        setZoom(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [reportOpen, zoom]);

  return (
    <>
      <section id="case-ecom" className="cr">
        <div className="grid-lines" aria-hidden="true" />

        <div className="container">
          <SectionHead
            index="05"
            en="DEEP DIVE / 案例深读"
            title="抖音电商店铺数据复盘与自动化日报 Agent"
            serif={
              <>
                <em>From two-month data</em> to a daily agent.
              </>
            }
            desc="以店铺后台真实的双月经营数据为基础，用 GMV 三因子模型定位增长来源，发现客单价零贡献这一关键机会点，并把整套复盘流程做成每天自动跑的日报 Agent。"
          />

          {/* 角色 / 动作 / 样本 / 产出 元信息行 */}
          <Reveal className="cr__meta">
            <div className="cr__metaItem">
              <span className="mono">ROLE 角色</span>
              <p>电商产品运营 · 独立完成</p>
            </div>
            <div className="cr__metaItem">
              <span className="mono">WHAT I DID 我的动作</span>
              <p>
                数据口径梳理、三因子归因建模、复盘报告撰写、Coze
                日报工作流的节点设计与指标计算逻辑、异常告警规则定义。
              </p>
            </div>
            <div className="cr__metaItem">
              <span className="mono">SCOPE 样本</span>
              <p>抖音电商罗盘后台 · 双月（7 月 vs 9 月）</p>
            </div>
            <div className="cr__metaItem">
              <span className="mono">OUTPUT 产出</span>
              <p>双月复盘报告 · 12 项指标自动日报 Agent</p>
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
              </div>
            ))}
          </Reveal>

          {/* 流程：问题 → 做了什么 → 方法 → 产出 → 验证 */}
          <div className="cr__flow">
            <Reveal className="cr__step">
              <div className="cr__stepHead">
                <span className="mono">STEP 01 · 问题</span>
                <h3>每天 1 小时人工日报，异常滞后一天才知道</h3>
              </div>
              <p className="cr__stepBody">
                每天 1 小时人工导数据、算环比、写日报，且异常发现滞后一天——等问题被看到，损失已经发生。
              </p>
            </Reveal>

            <Reveal className="cr__step">
              <div className="cr__stepHead">
                <span className="mono">STEP 02 · 做了什么</span>
                <h3>先做一次双月深度复盘，找到增长的真实来源</h3>
              </div>
              <p className="cr__stepBody">
                先做一次双月深度复盘，找到增长的真实来源，再把这套复盘流程固化成每天自动跑的日报
                Agent。
              </p>
            </Reveal>

            <Reveal className="cr__step cr__step--media">
              <div className="cr__stepHead">
                <span className="mono">STEP 03 · 方法</span>
                <h3>GMV 三因子乘法拆解 + 12 项指标监控体系</h3>
              </div>
              <p className="cr__stepBody">
                GMV = 访客数 × 转化率 × 客单价。三因子乘法拆解让每一分增长都能归因到具体因子。
              </p>
              <div
                className="ce__bars"
                role="img"
                aria-label="GMV 三因子归因条形图：访客数 +29.8%，转化率 +8.7%，客单价 0.0%"
              >
                {factorBars.map((b) => (
                  <div className="ce__barRow" key={b.label}>
                    <span className="ce__barLabel">{b.label}</span>
                    <span className="ce__barTrack">
                      <span
                        className={`ce__barFill${b.zero ? ' ce__barFill--zero' : ''}`}
                        style={{ width: b.width }}
                      />
                    </span>
                    <span className="ce__barVal">{b.value}</span>
                  </div>
                ))}
              </div>
              <p className="ce__barsCap">GMV 三因子归因：增长的七成来自访客量，客单价零贡献。</p>

              {/* 归因瀑布图：条形图看相对变化，这张看绝对值的逐项贡献 */}
              <figure className="hm__shot ce__waterfall">
                <button
                  className="hm__shotMedia"
                  type="button"
                  onClick={() => setZoom({ img: WATERFALL.img, name: WATERFALL.cap })}
                >
                  <img src={WATERFALL.img} alt={WATERFALL.cap} loading="lazy" />
                  <span className="hm__zoomTip mono">点击放大</span>
                </button>
                <figcaption>
                  <span className="mono">{WATERFALL.cap}</span>
                  <p>{WATERFALL.note}</p>
                </figcaption>
              </figure>
            </Reveal>

            <Reveal className="cr__step cr__step--media">
              <div className="cr__stepHead">
                <span className="mono">STEP 04 · 产出</span>
                <h3>复盘报告 + 每日自动日报 Agent</h3>
              </div>
              <div className="cr__gallery">
                {dashboards.map((d) => (
                  <figure className="cr__shot" key={d.img}>
                    <div className="cr__shotMedia">
                      <img src={d.img} alt={d.cap} loading="lazy" />
                    </div>
                    <figcaption>
                      <span className="mono">{d.cap}</span>
                      <p>{d.note}</p>
                    </figcaption>
                  </figure>
                ))}
              </div>
              {/* Coze 日报 Agent 截图尚未产出，先占位 */}
              <div className="cr__placeholder">
                <span className="mono">AUTOMATION · 待替换</span>
                <p>
                  自动化日报 Agent 正在搭建中 · 搭完后替换此位
                  （工作流：开始 → 12 项指标计算 → 异常判断 → 日报生成 → 定时触发 每天 8:00）
                </p>
              </div>
            </Reveal>

            <Reveal className="cr__step">
              <div className="cr__stepHead">
                <span className="mono">STEP 05 · 验证</span>
                <h3>模型对账误差 &lt; 0.2%，增长质量健康</h3>
              </div>
              <p className="cr__stepBody">
                三因子模型对账误差 &lt; 0.2%；退款率持平证明增长质量健康，不是靠促销透支换来的。
              </p>
            </Reveal>
          </div>

          {/* 数据真实性说明（口径必须原样保留） */}
          <Reveal className="cr__note">
            <span className="mono">DATA AUTHENTICITY · 数据真实性</span>
            <p className="cr__noteLine">
              所有绝对值取自抖音电商罗盘后台「交易概况」月度累计数据，未做任何平滑或估算；派生指标（增长率、三因子归因、退款率）由我基于原始值计算，过程公开可复核。
            </p>
            <p className="cr__noteLine">
              访客 +29.8% × 转化率 +8.7% × 客单价 0%，三因子相乘 +41.1%，与实际 +41.3%
              残差 0.2pp。
            </p>
            <p className="cr__noteCaliber">
              口径提示：后台截图的「较前 1 月」是平台自带的环比标记（9 月 vs 8
              月），本报告的 +41.3% 是 7 月 → 9 月的跨期对比，两者口径不同。简历中的「转化率提升
              12%」对应后台 9 月环比标记 +11.84%，为相对提升而非 12 个百分点。
            </p>
          </Reveal>

          {/* 主产出物入口 */}
          <Reveal className="cr__cta">
            <button className="btn btn--dark" type="button" onClick={() => setReportOpen(true)}>
              查看完整复盘报告
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

      {/* portal 到 body：与 #case-review 同款报告浮层 */}
      {createPortal(
        reportOpen ? (
          <div className="rm" role="dialog" aria-modal="true" aria-label="完整复盘报告">
            <div className="rm__backdrop" onClick={closeReport} />

            <div className="rm__panel">
              <header className="rm__bar">
                <div className="rm__barLeft">
                  <span className="mono">FULL REPORT · 完整复盘报告</span>
                  <strong>抖音电商店铺双月复盘 · GMV 三因子归因</strong>
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
                <iframe className="rm__iframe" src={REPORT_URL} title="完整复盘报告" />
              </div>
            </div>

            <span className="rm__hint mono" aria-hidden="true">
              点击任意暗处 / ESC 返回作品集
            </span>
          </div>
        ) : null,
        document.body
      )}

      {/* 图片放大浮层：点暗处 / ESC 关闭 */}
      {createPortal(
        zoom ? (
          <div className="hmz" role="dialog" aria-modal="true" aria-label={zoom.name}>
            <div className="hmz__backdrop" onClick={() => setZoom(null)} />
            <figure className="hmz__panel">
              <img src={zoom.img} alt={zoom.name} />
              <figcaption>
                <span className="mono">{zoom.name}</span>
              </figcaption>
            </figure>
            <button className="hmz__close" type="button" onClick={() => setZoom(null)}>
              关闭
            </button>
          </div>
        ) : null,
        document.body
      )}
    </>
  );
}
