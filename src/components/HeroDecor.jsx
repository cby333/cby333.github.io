/**
 * Hero 右侧装饰：等距 3D 场景（加重版）
 * 构图 = 等距地台轮廓 + 展示台（台面上放一颗球）+ 右后方细高柱（景深弱化）+ 上方悬浮 UI 面板 + 环境光晕。
 * 全 SVG 绘制，银白 + 电光蓝。为保证"明亮克制"，体量靠形体与光，不靠加颜色。
 */
export default function HeroDecor() {
  return (
    <svg
      className="decor"
      viewBox="90 30 460 475"
      role="img"
      aria-label="等距三维展示台装饰场景"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="dglow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#2b4cff" stopOpacity="0.13" />
          <stop offset="0.45" stopColor="#2b4cff" stopOpacity="0.05" />
          <stop offset="1" stopColor="#2b4cff" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="dtop" x1="0.1" y1="0" x2="0.7" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#ecf0fb" />
        </linearGradient>
        <linearGradient id="dleft" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e7e9e4" />
          <stop offset="1" stopColor="#d3d4d1" />
        </linearGradient>
        <linearGradient id="dright" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c9cac6" />
          <stop offset="1" stopColor="#b6b7b3" />
        </linearGradient>

        {/* 细高柱的景深版本：明度对比更小，视觉上退到后方 */}
        <linearGradient id="fleft" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#edeeeb" />
          <stop offset="1" stopColor="#e0e1de" />
        </linearGradient>
        <linearGradient id="fright" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#dcddd9" />
          <stop offset="1" stopColor="#cdceca" />
        </linearGradient>

        <linearGradient id="dpanel" x1="0.1" y1="0" x2="0.5" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#f9fbff" />
        </linearGradient>
        <radialGradient id="dball" cx="0.34" cy="0.28" r="0.78">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.55" stopColor="#e4e7f3" />
          <stop offset="1" stopColor="#c2c6d5" />
        </radialGradient>
      </defs>

      {/* 环境光晕：给整个场景垫一层极淡的蓝，制造体量感 */}
      <ellipse cx="300" cy="300" rx="235" ry="205" fill="url(#dglow)" />

      {/* 等距地台轮廓：极淡，只露边缘，暗示"这是个空间" */}
      <polygon
        points="290,220 463.2,320 290,420 116.8,320"
        fill="none"
        stroke="rgba(12,12,14,0.07)"
        strokeWidth="0.9"
      />

      {/* 地面投影 */}
      <g className="decor__shadow">
        <ellipse cx="290" cy="479" rx="152" ry="25" fill="#0c0c0e" opacity="0.06" />
        <ellipse cx="470" cy="492" rx="70" ry="14" fill="#0c0c0e" opacity="0.035" />
      </g>

      {/* 右后方细高柱 —— 景深弱化 */}
      <g className="decor__iso decor__iso--c" opacity="0.92">
        <polygon
          points="425,285 470,259 515,285 470,311"
          fill="url(#dtop)"
          stroke="rgba(12,12,14,0.085)"
          strokeWidth="0.8"
        />
        <polygon
          points="425,285 470,311 470,486 425,460"
          fill="url(#fleft)"
          stroke="rgba(12,12,14,0.085)"
          strokeWidth="0.8"
        />
        <polygon
          points="515,285 470,311 470,486 515,460"
          fill="url(#fright)"
          stroke="rgba(12,12,14,0.085)"
          strokeWidth="0.8"
        />
        {/* 柱面刻度：暗示"数据条" */}
        <g stroke="rgba(217,119,43,0.34)" strokeWidth="1.4" strokeLinecap="round">
          <line x1="439" y1="384" x2="457" y2="394" />
          <line x1="439" y1="414" x2="457" y2="424" />
          <line x1="439" y1="444" x2="457" y2="454" />
        </g>
      </g>

      {/* 展示台（主体） */}
      <g className="decor__iso decor__iso--a">
        <polygon
          points="181.75,292 290,229.5 398.25,292 290,354.5"
          fill="url(#dtop)"
          stroke="rgba(12,12,14,0.11)"
          strokeWidth="0.8"
        />
        <polygon
          points="181.75,292 290,354.5 290,474.5 181.75,412"
          fill="url(#dleft)"
          stroke="rgba(12,12,14,0.11)"
          strokeWidth="0.8"
        />
        <polygon
          points="398.25,292 290,354.5 290,474.5 398.25,412"
          fill="url(#dright)"
          stroke="rgba(12,12,14,0.11)"
          strokeWidth="0.8"
        />

        {/* 台面浅刻线 */}
        <g stroke="rgba(12,12,14,0.07)" strokeWidth="0.8">
          <line x1="225.9" y1="267" x2="324.1" y2="324" />
          <line x1="354.1" y1="267" x2="255.9" y2="324" />
        </g>

        {/* 发光棱：顶面左前棱压一道电光蓝，给立体感一个"光边" */}
        <line
          x1="181.75"
          y1="292"
          x2="290"
          y2="229.5"
          stroke="var(--accent)"
          strokeWidth="1.7"
          opacity="0.38"
        />
        {/* 左面顶部高光 */}
        <line
          x1="181.75"
          y1="292"
          x2="290"
          y2="354.5"
          stroke="#ffffff"
          strokeWidth="1.4"
          opacity="0.55"
        />
      </g>

      {/* 台面上的小球 + 接触投影 */}
      <g className="decor__ball">
        <ellipse cx="320" cy="296" rx="19" ry="8.5" fill="#0c0c0e" opacity="0.075" />
        <circle
          cx="320"
          cy="275"
          r="17"
          fill="url(#dball)"
          stroke="rgba(12,12,14,0.10)"
          strokeWidth="0.8"
        />
      </g>

      {/* 悬浮 UI 面板（放大版） */}
      <g className="decor__panel">
        {/* 阴影层 */}
        <rect x="152" y="70" width="286" height="140" rx="13" fill="#0c0c0e" opacity="0.045" />
        <rect
          x="145"
          y="60"
          width="290"
          height="140"
          rx="12"
          fill="url(#dpanel)"
          stroke="rgba(12,12,14,0.10)"
          strokeWidth="0.9"
        />
        <circle cx="165" cy="79" r="3.4" fill="#ced1db" />
        <circle cx="179" cy="79" r="3.4" fill="#ced1db" />
        <circle cx="193" cy="79" r="3.4" fill="var(--accent)" opacity="0.7" />
        <line x1="145" y1="94" x2="435" y2="94" stroke="rgba(12,12,14,0.07)" strokeWidth="0.9" />

        {/* 抽象内容 */}
        <rect x="165" y="108" width="138" height="10" rx="5" fill="#0c0c0e" opacity="0.78" />
        <rect x="165" y="130" width="214" height="6.5" rx="3.2" fill="#0c0c0e" opacity="0.15" />
        <rect x="165" y="147" width="182" height="6.5" rx="3.2" fill="#0c0c0e" opacity="0.15" />
        <rect x="165" y="164" width="118" height="6.5" rx="3.2" fill="#0c0c0e" opacity="0.09" />

        {/* 右下角抽象折线图 */}
        <polyline
          points="330,186 352,156 372,170 394,136 414,150"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.72"
        />
        <circle cx="414" cy="150" r="2.8" fill="var(--accent)" opacity="0.85" />
      </g>
    </svg>
  );
}
