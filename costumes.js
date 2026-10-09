// 社長を探せ！ — 民族衣装・歴史衣装の社長（合成）、ランドマーク、海の生き物
// 衣装は SVG で描き、元イラストの社長の顔 (chars/head.webp) と重ねて 1 枚のスプライトにする。
window.SYX = (() => {
"use strict";

const INK = "#3a2a20", SKIN = "#f7cba4";
const S = `stroke="${INK}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"`;
const S2 = `stroke="${INK}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"`;

// figure units: head at x 28..132, y 22..137; feet bottom at y 326 (person ≈ 304 units tall)
const VB = { x: -10, y: -50, w: 180, h: 390 }, PX = 2;
const HEAD = { x: 28, y: 22, w: 104, h: 115 };
const PERSON_UNITS = 304;

function figure(o) {
  const top = o.top || "#fff", sleeve = o.sleeve || top, pants = o.pants || "#3a3a4a", shoes = o.shoes || "#4a3020";
  const hl = o.hl || [30, 228], hr = o.hr || [130, 228];
  const tl = o.topLen || 240, fl = o.flare || 0;
  let u = o.back || "";
  u += `<rect x="52" y="228" width="26" height="88" rx="7" fill="${pants}" ${S}/><rect x="82" y="228" width="26" height="88" rx="7" fill="${pants}" ${S}/>`;
  u += `<path d="M42,326 Q42,306 62,306 Q80,306 80,326 Z" fill="${shoes}" ${S}/><path d="M80,326 Q80,306 98,306 Q118,306 118,326 Z" fill="${shoes}" ${S}/>`;
  u += o.legs || "";
  u += `<rect x="68" y="118" width="24" height="26" fill="${SKIN}" ${S}/>`;
  const hem = tl > 250 ? `Q80,${tl + 8} ${40 - fl},${tl}` : `L${40 - fl},${tl}`;
  u += `<path d="M42,152 Q44,138 64,135 L96,135 Q116,138 118,152 L${120 + fl},${tl} ${hem} Z" fill="${top}" ${S}/>`;
  u += o.detail || "";
  const arm = (x1, y1, [x2, y2]) =>
    `<path d="M${x1},${y1} L${x2},${y2}" stroke="${INK}" stroke-width="28" stroke-linecap="round"/>` +
    `<path d="M${x1},${y1} L${x2},${y2}" stroke="${sleeve}" stroke-width="22" stroke-linecap="round"/>`;
  u += arm(50, 150, hl) + arm(110, 150, hr);
  u += o.overArms || "";
  u += `<circle cx="${hl[0]}" cy="${hl[1]}" r="11" fill="${SKIN}" ${S}/><circle cx="${hr[0]}" cy="${hr[1]}" r="11" fill="${SKIN}" ${S}/>`;
  u += o.front || "";
  return { under: u, over: (o.neck || "") + (o.hat || "") + (o.item || ""), defs: o.defs || "" };
}

const pat = (body, w, h) => `<pattern id="p" width="${w}" height="${h}" patternUnits="userSpaceOnUse">${body}</pattern>`;
const P = {
  tartan: pat(`<rect width="24" height="24" fill="#b02a2a"/><rect y="8" width="24" height="8" fill="#1f4d2b" opacity=".85"/><rect x="8" width="8" height="24" fill="#1f4d2b" opacity=".6"/><path d="M0,12 H24 M12,0 V24" stroke="#f2d04a" stroke-width="1.5"/>`, 24, 24),
  ghutra: pat(`<rect width="10" height="10" fill="#fff"/><path d="M0,5 H10 M5,0 V10" stroke="#d23c3c" stroke-width="2.5"/>`, 10, 10),
  shuka: pat(`<rect width="20" height="20" fill="#d42f2f"/><path d="M0,10 H20 M10,0 V20" stroke="#2a2a6a" stroke-width="3"/>`, 20, 20),
  kente: pat(`<rect width="12" height="24" fill="#f2c230"/><rect x="12" width="12" height="24" fill="#2f9e5b"/><rect x="24" width="12" height="24" fill="#d42f2f"/><path d="M0,12 H36" stroke="#111" stroke-width="3"/><path d="M0,4 H36 M0,20 H36" stroke="#111" stroke-width="1"/>`, 36, 24),
  sarape: pat(`<rect width="10" height="7" fill="#d42f2f"/><rect y="7" width="10" height="7" fill="#f28c28"/><rect y="14" width="10" height="7" fill="#f2c230"/><rect y="21" width="10" height="7" fill="#2f9e5b"/><rect y="28" width="10" height="7" fill="#2f6db5"/><rect y="35" width="10" height="7" fill="#7a3fa0"/>`, 10, 42),
  nemes: pat(`<rect width="10" height="6" fill="#e9b73b"/><rect y="6" width="10" height="6" fill="#2f5fb5"/>`, 10, 12),
  plaid: pat(`<rect width="16" height="16" fill="#d43b3b"/><path d="M0,8 H16 M8,0 V16" stroke="#fff" stroke-width="2.5" opacity=".7"/><path d="M0,0 H16 M0,0 V16" stroke="#7a1a1a" stroke-width="3"/>`, 16, 16),
  andes: pat(`<rect width="24" height="24" fill="#c0262d"/><path d="M0,12 L6,6 L12,12 L18,6 L24,12" stroke="#f2c230" stroke-width="3" fill="none"/><path d="M0,20 H24" stroke="#1f6d8a" stroke-width="3"/>`, 24, 24)
};
const poncho = fill => `<path d="M62,134 L98,134 L140,252 Q80,264 20,252 Z" fill="${fill}" ${S}/>`;
const laurel = color => {
  let s = `<path d="M30,62 Q80,26 130,62" stroke="${color}" stroke-width="4" fill="none"/>`;
  for (let i = 0; i < 6; i++) {
    const t = i / 5, x = 34 + t * 40, y = 58 - Math.sin(t * Math.PI / 2) * 20;
    s += `<ellipse cx="${x}" cy="${y - 6}" rx="8" ry="4" transform="rotate(${-40 + t * 30} ${x} ${y - 6})" fill="${color}" ${S2}/>`;
    s += `<ellipse cx="${160 - x}" cy="${y - 6}" rx="8" ry="4" transform="rotate(${40 - t * 30} ${160 - x} ${y - 6})" fill="${color}" ${S2}/>`;
  }
  return s;
};
const onion = (x, y, r, fill, stripe) =>
  `<path d="M${x - r},${y} Q${x - r - 4},${y - r} ${x},${y - 2 * r - 8} Q${x + r + 4},${y - r} ${x + r},${y} Z" fill="${fill}" ${S}/>` +
  (stripe ? `<path d="M${x - r * 0.5},${y - 2} Q${x - r * 0.3},${y - r} ${x},${y - 2 * r - 6} M${x + r * 0.5},${y - 2} Q${x + r * 0.3},${y - r} ${x},${y - 2 * r - 6}" stroke="${stripe}" stroke-width="3" fill="none"/>` : "") +
  `<line x1="${x}" y1="${y - 2 * r - 8}" x2="${x}" y2="${y - 2 * r - 18}" stroke="${INK}" stroke-width="2"/>`;

// ---- 衣装の社長 (lon/lat = 自国の固定位置) -----------------------------
const COSTUMES = [
  { id: "c_jp", name: "殿様", country: "日本", lon: 135.6, lat: 34.9, fig: figure({
    top: "#34497a", topLen: 240, pants: "#8c8f99", shoes: "#f4f1e6",
    detail: `<path d="M38,228 L122,228 L130,316 L30,316 Z" fill="#8c8f99" ${S}/><path d="M60,232 L56,314 M80,232 L80,314 M100,232 L104,314" stroke="${INK}" stroke-width="2"/>` +
      `<path d="M64,135 L14,138 L22,158 L56,162 L66,232 L94,232 L104,162 L138,158 L146,138 L96,135 Z" fill="#a9bfdc" ${S}/>` +
      `<circle cx="38" cy="148" r="5" fill="#fff" ${S2}/><circle cx="122" cy="148" r="5" fill="#fff" ${S2}/><path d="M70,136 L80,166 L90,136" fill="none" stroke="#fff" stroke-width="5"/>`,
    hat: `<rect x="73" y="2" width="14" height="26" rx="6" fill="#c4c4c4" ${S} transform="rotate(-8 80 16)"/>`,
    item: `<path d="M130,228 L112,194 Q130,182 150,192 Z" fill="#f4d35e" ${S}/><path d="M130,228 L120,190 M130,228 L132,186 M130,228 L142,189" stroke="${INK}" stroke-width="1.5"/>`
  }) },
  { id: "c_kr", name: "韓服", country: "韓国", lon: 127.6, lat: 36.6, fig: figure({
    top: "#eef3f7", topLen: 312, flare: 8, pants: "#eef3f7", shoes: "#222",
    detail: `<path d="M64,135 L84,176 L96,135" fill="none" stroke="#2a3a6a" stroke-width="7"/><path d="M84,166 Q98,178 94,206 M84,166 Q74,182 78,204" stroke="#d64545" stroke-width="5" fill="none"/>`,
    hat: `<path d="M56,-6 L60,46 L100,46 L104,-6 Q80,-12 56,-6 Z" fill="#222" fill-opacity=".85" ${S}/><ellipse cx="80" cy="48" rx="66" ry="11" fill="#222" fill-opacity=".8" ${S}/><path d="M24,54 Q26,112 46,140 M136,54 Q134,112 114,140" stroke="#6a3a9a" stroke-width="3" stroke-dasharray="3 4" fill="none"/>`
  }) },
  { id: "c_cn", name: "中国皇帝", country: "中国", lon: 116.4, lat: 39.9, fig: figure({
    top: "#f2c230", topLen: 312, flare: 8, shoes: "#222",
    detail: `<path d="M34,296 Q46,286 58,296 T82,296 T106,296 T130,296" fill="none" stroke="#2f6db5" stroke-width="5"/><path d="M64,136 Q80,152 96,136" fill="none" stroke="#2f6db5" stroke-width="6"/>` +
      `<circle cx="80" cy="190" r="16" fill="#e24a3b" ${S}/><path d="M72,190 Q80,178 88,190 Q80,202 72,190" fill="none" stroke="#f2c230" stroke-width="3"/><rect x="40" y="228" width="80" height="10" fill="#c0392b" ${S}/>`,
    hat: `<path d="M44,42 Q80,12 116,42 L116,50 L44,50 Z" fill="#222" ${S}/><rect x="74" y="12" width="12" height="18" fill="#222"/><rect x="20" y="4" width="120" height="10" rx="2" fill="#222" ${S}/>` +
      [26, 38, 50, 110, 122, 134].map((x, i) => `<line x1="${x}" y1="14" x2="${x}" y2="40" stroke="#555" stroke-width="1.5"/><circle cx="${x}" cy="42" r="3.5" fill="${i % 2 ? "#e24a3b" : "#f2c230"}"/>`).join("")
  }) },
  { id: "c_mn", name: "モンゴルのデール", country: "モンゴル", lon: 104.0, lat: 46.8, fig: figure({
    top: "#2e6fb5", topLen: 306, flare: 6, shoes: "#7a3a1a",
    detail: `<path d="M64,136 Q92,150 114,172" fill="none" stroke="#f2c230" stroke-width="7"/><rect x="40" y="216" width="80" height="16" fill="#f08a24" ${S}/><path d="M33,300 Q80,310 127,300" fill="none" stroke="#f2c230" stroke-width="6"/>`,
    hat: `<path d="M42,52 L80,-14 L118,52 Z" fill="#d23c3c" ${S}/><path d="M30,56 Q80,30 130,56 Q130,66 120,66 Q80,48 40,66 Q30,66 30,56 Z" fill="#7a4a2a" ${S}/><circle cx="80" cy="-16" r="6" fill="#f2c230" ${S}/>`
  }) },
  { id: "c_in", name: "インドのターバン", country: "インド", lon: 74.5, lat: 20.0, fig: figure({
    top: "#f4e7c8", topLen: 282, flare: 4, pants: "#fafafa", shoes: "#c9a227",
    detail: `<path d="M80,140 L80,196" stroke="#c9a227" stroke-width="3"/>` + [152, 166, 180, 194].map(y => `<circle cx="86" cy="${y}" r="2.5" fill="#c9a227"/>`).join(""),
    hat: `<path d="M24,60 Q18,2 80,-2 Q142,2 136,60 Q80,40 24,60 Z" fill="#f08a24" ${S}/><path d="M32,40 Q80,10 128,44 M28,52 Q80,24 132,52" fill="none" stroke="#c4621a" stroke-width="3"/><circle cx="80" cy="30" r="7" fill="#e0457b" ${S}/><path d="M80,24 Q94,0 86,-18" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/>`
  }) },
  { id: "c_vn", name: "ベトナムのアオザイ", country: "ベトナム", lon: 105.8, lat: 19.5, fig: figure({
    top: "#2a7bbf", topLen: 300, flare: 10, pants: "#fafafa", shoes: "#222",
    detail: `<rect x="66" y="130" width="28" height="12" rx="3" fill="#2a7bbf" ${S}/>` + [170, 200, 230, 260].map(y => `<circle cx="80" cy="${y}" r="5" fill="#f2c230" ${S2}/>`).join(""),
    hat: `<path d="M4,62 L80,-22 L156,62 Q80,74 4,62 Z" fill="#e8d29a" ${S}/><path d="M28,54 L80,-16 M54,60 L80,-16 M106,60 L80,-16 M132,54 L80,-16" stroke="#c7ac68" stroke-width="2"/>`
  }) },
  { id: "c_sa", name: "アラブのトーブ", country: "サウジアラビア", lon: 45.0, lat: 24.0, fig: figure({
    top: "#fafafa", topLen: 312, flare: 4, shoes: "#8a6a4a", defs: P.ghutra,
    neck: `<path d="M14,176 L18,60 Q20,2 80,2 Q140,2 142,60 L146,176 L122,170 L126,72 Q122,42 80,40 Q38,42 34,72 L38,170 Z" fill="url(#p)" ${S}/>`,
    hat: `<ellipse cx="80" cy="30" rx="52" ry="11" fill="none" stroke="#111" stroke-width="7"/>`
  }) },
  { id: "c_eg", name: "ファラオ", country: "エジプト", lon: 32.6, lat: 25.7, fig: figure({
    top: SKIN, sleeve: SKIN, topLen: 236, pants: SKIN, shoes: "#c9a227", defs: P.nemes,
    detail: `<path d="M38,224 L122,224 L128,282 Q80,290 32,282 Z" fill="#fbf8ee" ${S}/><path d="M66,226 L94,226 L90,284 L70,284 Z" fill="#fbf8ee" ${S}/><rect x="38" y="220" width="84" height="12" fill="#e9b73b" ${S}/>` +
      `<path d="M46,142 Q80,198 114,142" fill="none" stroke="#2f6db5" stroke-width="9"/><path d="M50,140 Q80,184 110,140" fill="none" stroke="#e9b73b" stroke-width="8"/><path d="M55,138 Q80,170 105,138" fill="none" stroke="#2f6db5" stroke-width="6"/>`,
    front: `<rect x="20" y="208" width="20" height="8" fill="#e9b73b" ${S2}/><rect x="120" y="208" width="20" height="8" fill="#e9b73b" ${S2}/>`,
    hat: `<path d="M26,64 Q22,6 80,4 Q138,6 134,64 L150,172 L124,172 L122,72 Q80,48 38,72 L36,172 L10,172 Z" fill="url(#p)" ${S}/><path d="M34,66 Q80,46 126,66" stroke="#e9b73b" stroke-width="7" fill="none"/><path d="M76,52 Q80,36 86,44 Q84,52 80,54 Z" fill="#e9b73b" ${S2}/>`,
    item: `<path d="M30,232 L30,150 Q30,128 46,132 Q58,138 50,150" fill="none" stroke="#2f5fb5" stroke-width="7" stroke-linecap="round"/><path d="M30,170 L30,178 M30,196 L30,204" stroke="#e9b73b" stroke-width="7"/>`
  }) },
  { id: "c_ke", name: "マサイの戦士", country: "ケニア", lon: 36.3, lat: 0.5, fig: figure({
    top: "url(#p)", sleeve: SKIN, topLen: 298, flare: 4, pants: SKIN, shoes: "#6a4a2a", defs: P.shuka,
    detail: `<path d="M96,135 L126,166" stroke="#a51f1f" stroke-width="10"/>`,
    neck: `<path d="M52,140 Q80,176 108,140" stroke="#f2c230" stroke-width="7" fill="none"/><path d="M48,144 Q80,186 112,144" stroke="#2f9e5b" stroke-width="6" stroke-dasharray="5 4" fill="none"/><path d="M46,148 Q80,194 114,148" stroke="#fff" stroke-width="5" stroke-dasharray="4 5" fill="none"/>`,
    item: `<path d="M130,120 L130,324" stroke="#6a4a2a" stroke-width="6" stroke-linecap="round"/>`
  }) },
  { id: "c_gh", name: "ケンテ布", country: "ガーナ", lon: -1.5, lat: 7.6, fig: figure({
    top: "url(#p)", topLen: 312, flare: 6, shoes: "#6a4a2a", defs: P.kente,
    detail: `<path d="M44,150 L66,136 L124,300 L104,306 Z" fill="url(#p)" ${S}/>`,
    hat: `<path d="M36,46 Q80,2 124,46 Z" fill="url(#p)" ${S}/>`,
    neck: `<path d="M56,140 Q80,172 104,140" stroke="#e9b73b" stroke-width="5" fill="none"/>`
  }) },
  { id: "c_it", name: "ローマ皇帝", country: "イタリア", lon: 15.6, lat: 40.6, fig: figure({
    top: "#f8f6ef", topLen: 312, flare: 6, shoes: "#8a5a2a",
    detail: `<path d="M48,140 L66,136 L126,292 L108,302 Z" fill="#6b2a7a" ${S}/><path d="M44,200 Q80,214 116,196 M40,250 Q80,266 120,244" stroke="#d8d2c0" stroke-width="3" fill="none"/>`,
    hat: laurel("#d4a92a")
  }) },
  { id: "c_gb", name: "イギリスの近衛兵", country: "イギリス", lon: -1.6, lat: 52.6, fig: figure({
    top: "#d42a2a", topLen: 246, pants: "#1d2333", shoes: "#111",
    legs: `<path d="M65,236 L65,312 M95,236 L95,312" stroke="#d42a2a" stroke-width="4"/>`,
    detail: `<rect x="40" y="222" width="80" height="12" fill="#fff" ${S}/><rect x="74" y="221" width="12" height="14" fill="#e3b33b" ${S2}/>` + [150, 172, 194, 212].map(y => `<circle cx="80" cy="${y}" r="3.5" fill="#e3b33b" ${S2}/>`).join("") + `<rect x="62" y="132" width="36" height="10" fill="#1d2333" ${S}/>`,
    hat: `<path d="M28,64 Q20,-62 80,-64 Q140,-62 132,64 Q80,54 28,64 Z" fill="#1a1a1a" ${S}/><path d="M50,-30 Q60,-50 72,-40 M92,-48 Q104,-38 110,-20 M40,10 Q46,-6 56,4 M104,0 Q114,-10 120,10" stroke="#3a3a3a" stroke-width="3" fill="none"/><path d="M30,64 Q32,120 58,138 M130,64 Q128,120 102,138" stroke="#d4a92a" stroke-width="4" fill="none"/>`
  }) },
  { id: "c_sc", name: "スコットランドのキルト", country: "スコットランド", lon: -4.3, lat: 57.0, fig: figure({
    top: "#1f3d2b", topLen: 236, pants: "#f2f2f2", shoes: "#111", defs: P.tartan,
    detail: `<path d="M40,226 L120,226 L128,282 Q80,290 32,282 Z" fill="url(#p)" ${S}/><path d="M70,236 L90,236 L94,266 Q80,274 66,266 Z" fill="#6a4a2a" ${S}/><path d="M74,268 L74,280 M86,268 L86,280" stroke="#eee" stroke-width="3"/><path d="M68,136 L80,160 L92,136" fill="#fff" ${S}/>`,
    hat: `<path d="M24,40 Q30,14 80,16 Q132,18 136,38 Q120,52 80,50 Q34,52 24,40 Z" fill="#2a3f8f" ${S}/><rect x="38" y="42" width="84" height="10" rx="4" fill="url(#p)" ${S}/><circle cx="84" cy="12" r="9" fill="#d42a2a" ${S}/>`,
    front: `<path d="M40,184 L18,108 M40,184 L32,96 M40,184 L52,104" stroke="#111" stroke-width="6" stroke-linecap="round"/><ellipse cx="40" cy="194" rx="22" ry="15" fill="url(#p)" ${S}/>`
  }) },
  { id: "c_fr", name: "ナポレオン", country: "フランス", lon: 0.8, lat: 45.6, fig: figure({
    top: "#23356b", topLen: 256, pants: "#f4f1e6", shoes: "#111", hr: [88, 196],
    legs: `<rect x="50" y="268" width="30" height="48" rx="6" fill="#111" ${S}/><rect x="80" y="268" width="30" height="48" rx="6" fill="#111" ${S}/>`,
    detail: `<path d="M68,138 L92,138 L96,232 L64,232 Z" fill="#f4f1e6" ${S}/><path d="M62,134 L98,134 L96,144 L64,144 Z" fill="#d42a2a" ${S2}/>`,
    overArms: `<ellipse cx="44" cy="146" rx="15" ry="8" fill="#e3b33b" ${S}/><ellipse cx="116" cy="146" rx="15" ry="8" fill="#e3b33b" ${S}/>`,
    hat: `<path d="M6,52 Q80,-34 154,52 Q80,32 6,52 Z" fill="#111" ${S}/><circle cx="104" cy="26" r="9" fill="#23356b" ${S2}/><circle cx="104" cy="26" r="6" fill="#fff"/><circle cx="104" cy="26" r="3" fill="#d42a2a"/>`
  }) },
  { id: "c_de", name: "レーダーホーゼン", country: "ドイツ", lon: 11.3, lat: 48.2, fig: figure({
    top: "#fbfbf5", topLen: 228, pants: SKIN, shoes: "#4a3020",
    legs: `<rect x="52" y="280" width="26" height="34" rx="5" fill="#9aa3a8" ${S}/><rect x="82" y="280" width="26" height="34" rx="5" fill="#9aa3a8" ${S}/>`,
    detail: `<path d="M40,220 L120,220 L124,262 L84,262 L80,248 L76,262 L36,262 Z" fill="#7a5230" ${S}/><path d="M60,138 L64,222 M100,138 L96,222" stroke="#7a5230" stroke-width="9"/><rect x="58" y="174" width="44" height="12" rx="3" fill="#7a5230" ${S}/><circle cx="80" cy="180" r="4" fill="#fff"/>`,
    hat: `<path d="M34,52 Q38,12 80,8 Q122,12 126,52 Z" fill="#3e6b3a" ${S}/><ellipse cx="80" cy="52" rx="58" ry="8" fill="#3e6b3a" ${S}/><rect x="38" y="38" width="84" height="7" fill="#7a5230"/><path d="M112,40 Q142,8 124,-16" stroke="#666" stroke-width="5" fill="none" stroke-linecap="round"/>`,
    item: `<path d="M120,224 q-8,-14 4,-18 q10,-2 10,8 q0,-10 10,-8 q12,4 4,18 q-6,10 -14,0 q-8,10 -14,0 Z" fill="none" stroke="#b46a2a" stroke-width="5"/>`
  }) },
  { id: "c_nl", name: "オランダの木靴", country: "オランダ", lon: 5.6, lat: 52.4, fig: figure({
    top: "#1d1d1d", topLen: 232, pants: "#1d1d1d", shoes: "#f2c230",
    legs: `<path d="M40,236 Q30,290 52,312 L78,312 L80,250 L82,312 L108,312 Q130,290 120,236 Z" fill="#1d1d1d" ${S}/><path d="M36,328 Q34,308 60,306 Q82,306 80,328 Z M80,328 Q80,306 100,306 Q126,308 124,328 Z" fill="#f2c230" ${S}/>`,
    detail: [156, 176, 196].map(y => `<circle cx="70" cy="${y}" r="3.5" fill="#ccc" ${S2}/><circle cx="90" cy="${y}" r="3.5" fill="#ccc" ${S2}/>`).join(""),
    neck: `<path d="M60,134 L100,134 L80,156 Z" fill="#d42a2a" ${S}/>`,
    hat: `<path d="M34,52 Q34,10 80,8 Q126,10 126,52 Z" fill="#1d1d1d" ${S}/><path d="M30,52 Q80,44 130,52 Q132,60 80,58 Q28,60 30,52 Z" fill="#1d1d1d" ${S}/>`,
    item: `<path d="M130,228 L130,180" stroke="#2f9e5b" stroke-width="4"/><path d="M120,182 Q118,160 124,156 L130,166 L136,156 Q142,160 140,182 Q130,188 120,182 Z" fill="#e2483d" ${S}/>`
  }) },
  { id: "c_es", name: "闘牛士", country: "スペイン", lon: -4.5, lat: 39.4, fig: figure({
    top: "#c22e63", topLen: 214, pants: "#c22e63", shoes: "#111",
    legs: `<rect x="52" y="282" width="26" height="30" rx="5" fill="#f4a6c0" ${S}/><rect x="82" y="282" width="26" height="30" rx="5" fill="#f4a6c0" ${S}/>`,
    detail: `<path d="M70,138 L90,138 L88,214 L72,214 Z" fill="#fff" ${S}/><path d="M80,140 L80,170" stroke="#d42a2a" stroke-width="4"/><rect x="40" y="212" width="80" height="16" fill="#d42a2a" ${S}/><path d="M46,160 Q60,190 50,212 M114,160 Q100,190 110,212" stroke="#f2c230" stroke-width="5" fill="none"/>`,
    overArms: `<path d="M34,140 Q48,132 60,140 L56,162 Q44,170 34,160 Z M126,140 Q112,132 100,140 L104,162 Q116,170 126,160 Z" fill="#f2c230" ${S}/>`,
    hat: `<path d="M30,50 Q30,22 56,24 Q80,6 104,24 Q130,22 130,50 Q80,38 30,50 Z" fill="#111" ${S}/><circle cx="32" cy="46" r="10" fill="#111" ${S}/><circle cx="128" cy="46" r="10" fill="#111" ${S}/>`,
    item: `<path d="M130,206 L156,206 Q164,272 136,302 Q114,292 122,214 Z" fill="#d42a2a" ${S}/><path d="M124,206 L160,206" stroke="#7a5230" stroke-width="5" stroke-linecap="round"/>`
  }) },
  { id: "c_no", name: "バイキング", country: "ノルウェー", lon: 9.0, lat: 61.0, fig: figure({
    top: "#4f6b8a", topLen: 252, pants: "#8a8a74", shoes: "#5a3a1a",
    back: `<path d="M28,150 Q80,122 132,150 L140,286 L20,286 Z" fill="#6b4e33" ${S}/>`,
    legs: `<path d="M52,250 L78,270 M52,272 L78,292 M78,250 L52,270 M78,272 L52,292 M82,250 L108,270 M82,272 L108,292 M108,250 L82,270 M108,272 L82,292" stroke="#5a3a1a" stroke-width="3"/>`,
    detail: `<rect x="40" y="216" width="80" height="12" fill="#6b4e33" ${S}/><rect x="74" y="215" width="12" height="14" fill="#c9c9c9" ${S2}/>`,
    overArms: `<path d="M38,150 Q80,122 122,150 Q120,166 102,162 Q80,174 58,162 Q40,166 38,150 Z" fill="#9a7a58" ${S}/>`,
    hat: `<path d="M34,40 Q4,30 6,-6 Q22,20 40,26 Z" fill="#f2ead8" ${S}/><path d="M126,40 Q156,30 154,-6 Q138,20 120,26 Z" fill="#f2ead8" ${S}/><path d="M32,58 Q32,8 80,6 Q128,8 128,58 Z" fill="#9aa3ad" ${S}/><rect x="30" y="50" width="100" height="11" rx="3" fill="#7d858f" ${S}/>`,
    item: `<circle cx="34" cy="226" r="32" fill="#c8963e" ${S}/><path d="M10,212 L58,212 M6,228 L62,228 M10,244 L58,244" stroke="#9a6a2a" stroke-width="2"/><circle cx="34" cy="226" r="9" fill="#9aa3ad" ${S}/>`
  }) },
  { id: "c_ru", name: "ロシアのウシャンカ", country: "ロシア", lon: 84.0, lat: 58.0, fig: figure({
    top: "#7a2b2b", topLen: 298, flare: 4, pants: "#222", shoes: "#111", hl: [30, 232], hr: [130, 232],
    detail: `<path d="M80,140 L80,300" stroke="#d8c39a" stroke-width="10"/><path d="M34,294 Q80,306 126,294" stroke="#d8c39a" stroke-width="10" fill="none"/><rect x="40" y="214" width="80" height="10" fill="#3a1a1a"/>`,
    front: `<rect x="18" y="214" width="24" height="12" rx="5" fill="#d8c39a" ${S2}/><rect x="118" y="214" width="24" height="12" rx="5" fill="#d8c39a" ${S2}/>`,
    hat: `<path d="M22,58 L20,116 Q30,122 40,114 L40,62 Z M138,58 L140,116 Q130,122 120,114 L120,62 Z" fill="#6e4a2e" ${S}/><path d="M26,62 Q22,4 80,2 Q138,4 134,62 Z" fill="#6e4a2e" ${S}/><path d="M34,52 Q80,28 126,52 L126,66 Q80,48 34,66 Z" fill="#8a6440" ${S}/>`
  }) },
  { id: "c_tr", name: "トルコのフェズ", country: "トルコ", lon: 33.0, lat: 39.3, fig: figure({
    top: "#fbfbf5", topLen: 236, pants: "#2a4f8f", shoes: "#c0392b",
    legs: `<path d="M40,236 Q30,290 52,312 L78,312 L80,250 L82,312 L108,312 Q130,290 120,236 Z" fill="#2a4f8f" ${S}/>`,
    detail: `<path d="M44,150 Q46,138 62,136 L74,140 L72,224 L42,224 Z M116,150 Q114,138 98,136 L86,140 L88,224 L118,224 Z" fill="#7a1f2b" ${S}/><path d="M48,150 Q60,180 50,220 M112,150 Q100,180 110,220" stroke="#f2c230" stroke-width="3" fill="none"/><rect x="40" y="220" width="80" height="16" fill="#c0392b" ${S}/>`,
    hat: `<path d="M48,46 L56,2 L104,2 L112,46 Q80,52 48,46 Z" fill="#c0392b" ${S}/><path d="M80,2 Q98,6 102,32" stroke="#111" stroke-width="4" fill="none"/>`
  }) },
  { id: "c_us", name: "カウボーイ", country: "アメリカ", lon: -100.0, lat: 32.5, fig: figure({
    top: "url(#p)", topLen: 236, pants: "#3d5f99", shoes: "#7a4a22", defs: P.plaid,
    legs: `<rect x="50" y="276" width="30" height="40" rx="6" fill="#7a4a22" ${S}/><rect x="80" y="276" width="30" height="40" rx="6" fill="#7a4a22" ${S}/>`,
    detail: `<path d="M44,150 Q46,138 62,136 L72,140 L70,228 L42,228 Z M116,150 Q114,138 98,136 L88,140 L90,228 L118,228 Z" fill="#8a5a2e" ${S}/><rect x="40" y="226" width="80" height="12" fill="#5a3a1a" ${S}/><rect x="70" y="224" width="20" height="16" rx="3" fill="#d9d9d9" ${S2}/>`,
    neck: `<path d="M58,134 L102,134 L80,162 Z" fill="#d42a2a" ${S}/>`,
    hat: `<path d="M44,46 Q42,4 62,2 Q80,12 98,2 Q118,4 116,46 Z" fill="#9a6a3a" ${S}/><rect x="44" y="34" width="72" height="8" fill="#5a3a1a"/><path d="M6,40 Q20,58 80,54 Q140,58 154,40 Q152,62 80,68 Q8,62 6,40 Z" fill="#9a6a3a" ${S}/>`,
    item: `<ellipse cx="136" cy="236" rx="16" ry="20" fill="none" stroke="#c9a46a" stroke-width="5"/><ellipse cx="136" cy="236" rx="10" ry="14" fill="none" stroke="#c9a46a" stroke-width="4"/>`
  }) },
  { id: "c_mx", name: "メキシコのソンブレロ", country: "メキシコ", lon: -102.5, lat: 23.0, fig: figure({
    top: "#fafafa", topLen: 236, pants: "#fafafa", shoes: "#7a4a22", hl: [28, 250], hr: [132, 250], defs: P.sarape,
    overArms: poncho("url(#p)"),
    hat: `<ellipse cx="80" cy="52" rx="84" ry="17" fill="#e8c46a" ${S}/><path d="M50,52 Q48,-14 80,-16 Q112,-14 110,52 Z" fill="#e8c46a" ${S}/><path d="M50,30 L58,22 L66,30 L74,22 L82,30 L90,22 L98,30 L106,22 L110,30" stroke="#d42f2f" stroke-width="4" fill="none"/><path d="M14,56 Q80,74 146,56" stroke="#2f9e5b" stroke-width="4" fill="none"/>`,
    item: `<path d="M22,256 L12,280 M138,256 L148,280" stroke="#7a4a22" stroke-width="5" stroke-linecap="round"/><ellipse cx="20" cy="242" rx="12" ry="14" fill="#2f9e5b" ${S}/><ellipse cx="140" cy="242" rx="12" ry="14" fill="#d42f2f" ${S}/>`
  }) },
  { id: "c_pe", name: "アンデスのポンチョ", country: "ペルー", lon: -72.5, lat: -12.5, fig: figure({
    top: "#c0262d", topLen: 236, pants: "#3a3a4a", shoes: "#6a4a2a", hl: [28, 252], hr: [132, 252], defs: P.andes,
    overArms: poncho("url(#p)"),
    hat: `<path d="M24,56 L26,112 L40,104 L40,58 Z M136,56 L134,112 L120,104 L120,58 Z" fill="#c0262d" ${S}/><path d="M28,60 Q28,2 80,0 Q132,2 132,60 Z" fill="#c0262d" ${S}/><path d="M32,44 L44,34 L56,44 L68,34 L80,44 L92,34 L104,44 L116,34 L128,44" stroke="#f2c230" stroke-width="4" fill="none"/><path d="M32,26 H128" stroke="#1f6d8a" stroke-width="5"/><circle cx="80" cy="-4" r="9" fill="#f2c230" ${S}/><path d="M32,112 L32,132 M128,112 L128,132" stroke="#f2c230" stroke-width="4"/><circle cx="32" cy="136" r="5" fill="#2f9e5b" ${S2}/><circle cx="128" cy="136" r="5" fill="#2f9e5b" ${S2}/>`
  }) },
  { id: "c_br", name: "サンバカーニバル", country: "ブラジル", lon: -46.5, lat: -16.5, fig: figure({
    top: "#f2c230", topLen: 236, pants: "#fafafa", shoes: "#fafafa", hl: [24, 150], hr: [136, 150],
    back: Array.from({ length: 11 }, (_, i) => {
      const a = -160 + i * 14, c = ["#2f9e5b", "#f2c230", "#2f6db5", "#e0457b"][i % 4];
      return `<ellipse cx="80" cy="-24" rx="14" ry="58" fill="${c}" ${S} transform="rotate(${a + 90} 80 46)"/>`;
    }).join(""),
    detail: `<path d="M44,150 L120,226" stroke="#2f9e5b" stroke-width="12"/>` + [160, 184, 208].map(y => `<circle cx="60" cy="${y}" r="3" fill="#fff"/><circle cx="100" cy="${y - 10}" r="3" fill="#fff"/>`).join(""),
    hat: `<path d="M28,54 Q80,30 132,54" stroke="#f2c230" stroke-width="12" fill="none"/><circle cx="80" cy="40" r="7" fill="#e0457b" ${S}/><circle cx="54" cy="46" r="5" fill="#2f6db5" ${S2}/><circle cx="106" cy="46" r="5" fill="#2f6db5" ${S2}/>`
  }) },
  { id: "c_ca", name: "カナダ騎馬警察", country: "カナダ", lon: -105.5, lat: 51.5, fig: figure({
    top: "#c8202a", topLen: 240, pants: "#1d2a4a", shoes: "#5a3a1a",
    legs: `<path d="M65,234 L65,268 M95,234 L95,268" stroke="#f2c230" stroke-width="4"/><rect x="50" y="266" width="30" height="50" rx="6" fill="#6b3e1e" ${S}/><rect x="80" y="266" width="30" height="50" rx="6" fill="#6b3e1e" ${S}/>`,
    detail: `<path d="M52,140 L112,226" stroke="#6b3e1e" stroke-width="7"/><rect x="40" y="222" width="80" height="12" fill="#6b3e1e" ${S}/>` + [156, 178, 200].map(y => `<circle cx="80" cy="${y}" r="3.5" fill="#e3b33b" ${S2}/>`).join(""),
    hat: `<ellipse cx="80" cy="48" rx="68" ry="10" fill="#a0723c" ${S}/><path d="M48,46 L64,0 L80,10 L96,0 L112,46 Z" fill="#a0723c" ${S}/><rect x="48" y="36" width="64" height="7" fill="#5a3a1a"/>`
  }) },
  { id: "c_au", name: "オーストラリアの探検家", country: "オーストラリア", lon: 142.5, lat: -21.5, fig: figure({
    top: "#c8b48a", topLen: 232, pants: SKIN, shoes: "#6a4a2a",
    legs: `<rect x="52" y="276" width="26" height="38" rx="5" fill="#c8b48a" ${S}/><rect x="82" y="276" width="26" height="38" rx="5" fill="#c8b48a" ${S}/>`,
    detail: `<path d="M40,224 L120,224 L124,262 L84,262 L80,248 L76,262 L36,262 Z" fill="#a8946a" ${S}/><rect x="50" y="164" width="20" height="18" rx="2" fill="#b5a078" ${S2}/><rect x="90" y="164" width="20" height="18" rx="2" fill="#b5a078" ${S2}/>`,
    hat: `<path d="M42,50 Q44,10 80,8 Q116,10 118,50 Z" fill="#8a6a3a" ${S}/><path d="M12,50 Q80,36 148,50 Q148,60 80,58 Q12,60 12,50 Z" fill="#8a6a3a" ${S}/>` +
      [22, 38, 122, 138].map(x => `<line x1="${x}" y1="56" x2="${x}" y2="${x < 80 ? 82 : 82}" stroke="#555" stroke-width="1.5"/><rect x="${x - 3}" y="80" width="6" height="10" rx="2" fill="#d9b06a" ${S2}/>`).join("")
  }) },
  { id: "c_gl", name: "北極のパーカー", country: "グリーンランド", lon: -45.0, lat: 70.0, fig: figure({
    top: "#c9a27a", topLen: 282, flare: 6, pants: "#4a3a2a", shoes: "#efe6d4", hl: [30, 232], hr: [130, 232],
    back: `<ellipse cx="80" cy="82" rx="70" ry="76" fill="#c9a27a" ${S}/>`,
    detail: `<path d="M36,270 Q80,282 124,270" stroke="#7a3a2a" stroke-width="8" fill="none" stroke-dasharray="8 4"/><path d="M42,200 H118" stroke="#7a3a2a" stroke-width="6" stroke-dasharray="6 4"/>`,
    front: `<rect x="16" y="220" width="28" height="22" rx="8" fill="#efe6d4" ${S}/><rect x="116" y="220" width="28" height="22" rx="8" fill="#efe6d4" ${S}/>`,
    hat: `<path fill-rule="evenodd" d="M80,4 C122,4 150,40 150,84 C150,130 120,156 80,156 C40,156 10,130 10,84 C10,40 38,4 80,4 Z M80,34 C52,34 32,58 32,86 C32,116 54,138 80,138 C106,138 128,116 128,86 C128,58 108,34 80,34 Z" fill="#efe6d4" ${S}/>`
  }) }
];

function svgDoc(inner, defs) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VB.x} ${VB.y} ${VB.w} ${VB.h}" width="${VB.w * PX}" height="${VB.h * PX}"><defs>${defs}</defs>${inner}</svg>`;
}
function loadSvg(svg) {
  return new Promise(res => {
    const im = new Image();
    im.onload = () => res(im);
    im.onerror = () => res(null);
    im.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  });
}
// crop a canvas to its visible pixels
function trim(cv) {
  const x = cv.getContext("2d");
  const d = x.getImageData(0, 0, cv.width, cv.height).data;
  let x0 = cv.width, y0 = cv.height, x1 = -1, y1 = -1;
  for (let y = 0; y < cv.height; y++) for (let i = 0; i < cv.width; i++) {
    if (d[(y * cv.width + i) * 4 + 3] > 10) { if (i < x0) x0 = i; if (i > x1) x1 = i; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  }
  if (x1 < 0) return cv;
  const out = document.createElement("canvas");
  out.width = x1 - x0 + 1; out.height = y1 - y0 + 1;
  out.getContext("2d").drawImage(cv, -x0, -y0);
  return out;
}

async function buildCostume(c, headImg) {
  const f = c.fig;
  const [u, o] = await Promise.all([loadSvg(svgDoc(f.under, f.defs)), loadSvg(svgDoc(f.over, f.defs))]);
  const cv = document.createElement("canvas");
  cv.width = VB.w * PX; cv.height = VB.h * PX;
  const x = cv.getContext("2d");
  if (u) x.drawImage(u, 0, 0);
  if (headImg) x.drawImage(headImg, (HEAD.x - VB.x) * PX, (HEAD.y - VB.y) * PX, HEAD.w * PX, HEAD.h * PX);
  if (o) x.drawImage(o, 0, 0);
  const t = trim(cv);
  // nominal height: a plain 社長 is 200
  return { canvas: t, nom: (t.height / PX) * 200 / PERSON_UNITS };
}

// ---- ランドマーク --------------------------------------------------------
const svgIcon = (w, h, body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-3 -3 ${w + 6} ${h + 6}" width="${(w + 6) * 3}" height="${(h + 6) * 3}">${body}</svg>`;
const LM_SVG = {
  eiffel: svgIcon(70, 120, `<path d="M35,2 L39,34 L45,62 L62,118 L48,118 Q35,88 22,118 L8,118 L25,62 L31,34 Z" fill="#9a7a56" ${S}/><rect x="27" y="32" width="16" height="6" fill="#7a5a3a" ${S2}/><rect x="20" y="60" width="30" height="7" fill="#7a5a3a" ${S2}/><path d="M31,40 L39,58 M39,40 L31,58 M27,72 L43,100 M43,72 L27,100" stroke="#6a4a2a" stroke-width="1.5"/>`),
  bigben: svgIcon(50, 130, `<path d="M10,36 L25,2 L40,36 Z" fill="#4a5f6a" ${S}/><rect x="12" y="34" width="26" height="94" fill="#d9b46a" ${S}/><rect x="12" y="34" width="26" height="26" fill="#c9a45a" ${S2}/><circle cx="25" cy="47" r="9" fill="#fff" ${S2}/><path d="M25,47 L25,41 M25,47 L29,49" stroke="${INK}" stroke-width="1.5"/><path d="M18,70 V122 M25,70 V122 M32,70 V122" stroke="#a9843a" stroke-width="2"/>`),
  pyramid: svgIcon(130, 80, `<path d="M8,78 L60,8 L112,78 Z" fill="#e8c46a" ${S}/><path d="M60,8 L112,78 L74,78 Z" fill="#c9a24f" ${S2}/><path d="M84,78 L106,46 L128,78 Z" fill="#e8c46a" ${S}/><path d="M106,46 L128,78 L112,78 Z" fill="#c9a24f" ${S2}/>`),
  greatwall: svgIcon(140, 80, `<path d="M0,80 L0,60 Q30,30 60,50 Q90,70 110,30 Q125,10 140,30 L140,80 Z" fill="#7cbf5a" ${S}/><path d="M0,62 Q30,22 60,42 Q90,62 110,24 Q125,4 140,22" stroke="${INK}" stroke-width="16" fill="none"/><path d="M0,62 Q30,22 60,42 Q90,62 110,24 Q125,4 140,22" stroke="#d6c39a" stroke-width="12" fill="none"/><path d="M0,56 Q30,16 60,36 Q90,56 110,18 Q125,-2 140,16" stroke="#b8a37a" stroke-width="5" stroke-dasharray="4 4" fill="none"/><rect x="52" y="22" width="16" height="22" fill="#d6c39a" ${S}/><rect x="102" y="4" width="16" height="22" fill="#d6c39a" ${S}/><rect x="57" y="28" width="6" height="8" fill="${INK}"/><rect x="107" y="10" width="6" height="8" fill="${INK}"/>`),
  taj: svgIcon(120, 100, `<rect x="6" y="28" width="8" height="70" fill="#f5f2ea" ${S2}/><rect x="106" y="28" width="8" height="70" fill="#f5f2ea" ${S2}/><circle cx="10" cy="26" r="5" fill="#f5f2ea" ${S2}/><circle cx="110" cy="26" r="5" fill="#f5f2ea" ${S2}/><rect x="18" y="74" width="84" height="24" fill="#f5f2ea" ${S}/><rect x="30" y="46" width="60" height="30" fill="#f5f2ea" ${S}/><path d="M52,76 L52,58 Q60,48 68,58 L68,76 Z" fill="#cfc8b8" ${S2}/><path d="M40,48 Q38,18 60,6 Q82,18 80,48 Z" fill="#f5f2ea" ${S}/><line x1="60" y1="6" x2="60" y2="-2" stroke="#d4a92a" stroke-width="2"/><path d="M28,46 Q30,34 36,32 Q42,34 44,46 Z M76,46 Q78,34 84,32 Q90,34 92,46 Z" fill="#f5f2ea" ${S2}/>`),
  opera: svgIcon(140, 70, `<rect x="0" y="54" width="140" height="12" fill="#d9c8a8" ${S}/><path d="M18,56 Q28,14 60,10 Q48,30 52,56 Z" fill="#fff" ${S}/><path d="M50,56 Q62,4 98,2 Q84,28 86,56 Z" fill="#fff" ${S}/><path d="M86,56 Q96,20 122,18 Q112,38 116,56 Z" fill="#fff" ${S}/><path d="M30,54 Q40,30 52,20 M64,54 Q72,26 88,10 M98,54 Q104,36 116,26" stroke="#d8d8d8" stroke-width="2" fill="none"/>`),
  colosseum: svgIcon(130, 80, `<path d="M6,76 L6,28 Q60,8 124,22 L124,40 L106,44 L106,76 Z" fill="#d9b98a" ${S}/>` +
    [0, 1, 2].map(r => Array.from({ length: 7 }, (_, i) => `<path d="M${12 + i * 13},${70 - r * 16} v-8 q4,-5 8,0 v8 Z" fill="#8a6a44"/>`).join("")).join("")),
  christ: svgIcon(120, 120, `<path d="M0,120 L42,72 L60,64 L78,72 L120,120 Z" fill="#5f9a4a" ${S}/><rect x="55" y="22" width="10" height="44" fill="#f2f2f2" ${S2}/><rect x="28" y="26" width="64" height="7" rx="2" fill="#f2f2f2" ${S2}/><circle cx="60" cy="16" r="6" fill="#f2f2f2" ${S2}/>`),
  basil: svgIcon(120, 110, `<rect x="12" y="70" width="96" height="38" fill="#c0533b" ${S}/><path d="M52,72 L60,10 L68,72 Z" fill="#3f8a5a" ${S}/><rect x="22" y="52" width="16" height="20" fill="#e8d8b8" ${S2}/><rect x="82" y="52" width="16" height="20" fill="#e8d8b8" ${S2}/><rect x="46" y="58" width="28" height="14" fill="#e8d8b8" ${S2}/>` +
    onion(30, 54, 10, "#d64545", "#fff") + onion(90, 54, 10, "#2f9e5b", "#f2c230") + onion(60, 60, 8, "#2f6db5", "#fff") +
    [24, 44, 64, 84].map(x => `<path d="M${x},106 v-14 q6,-8 12,0 v14 Z" fill="#7a2f22"/>`).join("")),
  sagrada: svgIcon(100, 130, `<rect x="8" y="90" width="84" height="38" fill="#c9a77a" ${S}/>` +
    [[18, 30], [38, 6], [62, 6], [82, 30]].map(([x, t]) => `<path d="M${x - 9},92 L${x - 7},${t + 30} Q${x},${t} ${x + 7},${t + 30} L${x + 9},92 Z" fill="#d6b78a" ${S}/><circle cx="${x}" cy="${t + 4}" r="4" fill="#e2483d" ${S2}/>`).join("") +
    `<path d="M44,128 v-20 q6,-10 12,0 v20 Z" fill="#7a5a3a"/>`),
  igloo: svgIcon(80, 50, `<path d="M4,48 Q4,4 40,4 Q76,4 76,48 Z" fill="#eef6fb" ${S}/><path d="M8,34 Q40,26 72,34 M14,20 Q40,12 66,20 M28,8 L26,20 M52,8 L54,20 M18,22 L16,34 M40,14 L40,28 M62,22 L64,34" stroke="#b9cfdc" stroke-width="2" fill="none"/><path d="M28,48 L28,36 Q40,24 52,36 L52,48 Z" fill="#c9dce8" ${S2}/><path d="M33,48 L33,38 Q40,31 47,38 L47,48 Z" fill="#33414d"/>`),
  cabin: svgIcon(80, 64, `<rect x="66" y="6" width="8" height="18" fill="#7a5a4a" ${S2}/><rect x="8" y="28" width="64" height="34" fill="#a0673a" ${S}/><path d="M8,36 H72 M8,44 H72 M8,52 H72" stroke="#7a4a26" stroke-width="2"/><path d="M2,30 L40,4 L78,30 Z" fill="#6b4226" ${S}/><path d="M10,25 L40,6 L70,25 Q60,22 54,26 Q46,20 40,24 Q32,20 26,26 Q18,22 10,25 Z" fill="#fff"/><rect x="18" y="38" width="14" height="12" fill="#ffd54a" ${S2}/><rect x="46" y="40" width="14" height="22" fill="#5a3418" ${S2}/>`),
  windmill: svgIcon(60, 100, `<path d="M18,98 L23,42 L37,42 L42,98 Z" fill="#e9dcc0" ${S}/><path d="M21,44 Q30,28 39,44 Z" fill="#b5523b" ${S}/><rect x="26" y="80" width="8" height="18" fill="#7a5a3a" ${S2}/>` +
    [20, 110, 200, 290].map(a => `<g transform="rotate(${a} 30 38)"><rect x="27" y="4" width="7" height="32" fill="#f5f0e6" ${S2}/><path d="M27,12 H34 M27,20 H34 M27,28 H34" stroke="#b8a888" stroke-width="1.2"/></g>`).join("") +
    `<circle cx="30" cy="38" r="3.5" fill="#6a4a2a" ${S2}/>`),
  pagoda: svgIcon(60, 104, `<line x1="30" y1="2" x2="30" y2="20" stroke="#c9a227" stroke-width="3"/>` +
    [[22, 14], [46, 18], [72, 22]].map(([y, w]) => `<rect x="${30 - w / 2 + 4}" y="${y}" width="${w - 8}" height="${y === 72 ? 30 : 24}" fill="#e9dcc0" ${S2}/><path d="M${30 - w - 6},${y + 4} Q30,${y - 10} ${30 + w + 6},${y + 4} L${30 + w},${y + 8} Q30,${y - 2} ${30 - w},${y + 8} Z" fill="#8a2f22" ${S}/>`).join("") +
    `<rect x="25" y="88" width="10" height="14" fill="#8a2f22" ${S2}/>`),
  volcano: svgIcon(90, 64, `<path d="M4,62 L32,14 Q45,6 58,14 L86,62 Z" fill="#7a5a44" ${S}/><path d="M32,14 Q45,6 58,14 L54,22 Q45,16 36,22 Z" fill="#5a3e2e"/><ellipse cx="45" cy="13" rx="12" ry="4" fill="#ff5a1f" ${S2}/><path d="M38,16 Q35,30 40,42 M50,16 Q53,28 49,36 M44,16 Q44,24 45,30" stroke="#ff7a1f" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M14,56 Q30,48 40,58 M54,58 Q66,48 78,56" stroke="#5a3e2e" stroke-width="2" fill="none"/>`),
  uluru: svgIcon(140, 50, `<path d="M4,48 Q8,14 40,10 Q90,4 128,16 Q140,30 136,48 Z" fill="#c8552e" ${S}/><path d="M40,14 Q44,30 40,46 M70,10 Q76,28 72,46 M100,12 Q106,30 102,46" stroke="#9a3a1e" stroke-width="2" fill="none"/>`)
};

// fixed decorations: [kind, key, name, lon, lat, nominal height]
const LANDMARKS = [
  ["emoji", "🗽", "自由の女神（ニューヨーク）", -74.0, 40.7, 250],
  ["emoji", "🗼", "東京タワー（東京）", 139.75, 35.66, 250],
  ["svg", "greatwall", "万里の長城（中国）", 111.5, 40.6, 120],
  ["emoji", "🐼", "パンダ（四川・成都）", 104.06, 30.66, 110],
  ["emoji", "🗿", "モアイ像（イースター島）", -109.35, -27.11, 150],
  ["svg", "eiffel", "エッフェル塔（パリ）", 2.29, 48.86, 270],
  ["svg", "bigben", "ビッグ・ベン（ロンドン）", -0.12, 51.5, 270],
  ["svg", "pyramid", "ピラミッド（ギザ）", 31.13, 29.98, 130],
  ["svg", "taj", "タージ・マハル（アグラ）", 78.04, 27.17, 170],
  ["svg", "opera", "オペラハウス（シドニー）", 151.21, -33.86, 100],
  ["svg", "colosseum", "コロッセオ（ローマ）", 12.49, 41.89, 120],
  ["svg", "christ", "キリスト像（リオデジャネイロ）", -43.21, -22.95, 190],
  ["svg", "basil", "聖ワシリイ大聖堂（モスクワ）", 37.62, 55.75, 190],
  ["svg", "sagrada", "サグラダ・ファミリア（バルセロナ）", 2.17, 41.4, 240],
  ["svg", "uluru", "ウルル（オーストラリア）", 131.04, -25.34, 60],
  ["emoji", "🦘", "カンガルー（オーストラリア）", 135.5, -30.5, 110],
  ["emoji", "🐨", "コアラ（オーストラリア）", 147.0, -30.0, 90],
  ["emoji", "🦒", "キリン（タンザニア）", 34.8, -6.0, 140],
  ["emoji", "🦁", "ライオン（南アフリカ）", 30.5, -24.0, 100],
  ["emoji", "🐘", "ゾウ（ボツワナ）", 23.5, -19.5, 120],
  ["emoji", "🐪", "ラクダ（サハラ砂漠）", 8.0, 24.0, 120],
  ["emoji", "🦙", "リャマ（ボリビア）", -67.5, -19.5, 100],
  ["emoji", "🦜", "オウム（アマゾン）", -62.0, -4.0, 80],
  ["emoji", "🐧", "ペンギン（南極）", 10.0, -72.0, 90],
  ["emoji", "🐧", "ペンギン（南極）", 110.0, -70.0, 90],
  ["emoji", "🐧", "ペンギン（南極）", -60.0, -66.5, 90]
];

// ---- 海の生き物（海域ごとにランダム配置） --------------------------------
const SEA_NAMES = { "🐋": "クジラ", "🐳": "クジラ", "🦈": "サメ", "🐟": "魚", "🐠": "熱帯魚", "🐡": "フグ", "🐙": "タコ", "🦑": "イカ", "🐢": "ウミガメ", "🐬": "イルカ", "🦭": "アザラシ", "🦀": "カニ" };
const SEA_SIZE = { "🐋": 120, "🐳": 110, "🦈": 100, "🐬": 90, "🦭": 80, "🐢": 75, "🐙": 75, "🦑": 75, "🐟": 60, "🐠": 60, "🐡": 60, "🦀": 55 };
const SEA = [
  { name: "北太平洋", lon: -160, lat: 30, r: 18, list: ["🐋", "🐳", "🦈", "🐟", "🐟"] },
  { name: "南太平洋", lon: -130, lat: -25, r: 20, list: ["🐋", "🐬", "🐟", "🦑"] },
  { name: "北大西洋", lon: -40, lat: 38, r: 14, list: ["🐋", "🦈", "🐟"] },
  { name: "南大西洋", lon: -15, lat: -30, r: 14, list: ["🐳", "🐢", "🐟"] },
  { name: "インド洋", lon: 75, lat: -20, r: 18, list: ["🐋", "🦈", "🐠", "🐬"] },
  { name: "カリブ海", lon: -75, lat: 15, r: 5, list: ["🐠", "🐢", "🐡"] },
  { name: "地中海", lon: 18, lat: 34.5, r: 3, list: ["🐬", "🐙"] },
  { name: "日本近海", lon: 145, lat: 30, r: 6, list: ["🐟", "🐙", "🐡"] },
  { name: "サンゴ海", lon: 156, lat: -16, r: 6, list: ["🐠", "🐢", "🦈"] },
  { name: "アラスカ湾", lon: -145, lat: 55, r: 4, list: ["🐋", "🦀"] },
  { name: "グリーンランド海", lon: -5, lat: 74, r: 5, list: ["🦭", "🐳"] },
  { name: "南極海", lon: 60, lat: -58, r: 10, list: ["🐋", "🐳"] }
];

// ---- 船・飛行機（海の上にランダム配置） ----------------------------------
// fly: 空中に浮かせて描く（影だけ海面に落とす）
const VEHICLES = [
  { e: "🚢", name: "客船", n: 3, nom: 90 },
  { e: "⛴️", name: "フェリー", n: 2, nom: 80 },
  { e: "⛵", name: "ヨット", n: 3, nom: 70 },
  { e: "🚤", name: "モーターボート", n: 2, nom: 55 },
  { e: "✈️", name: "飛行機", n: 3, nom: 70, fly: true },
  { e: "🛩️", name: "小型飛行機", n: 2, nom: 60, fly: true },
  { e: "🚁", name: "ヘリコプター", n: 1, nom: 60, fly: true }
];

// ---- 気候帯（陸の色分け）と、そこに生える植物 ----------------------------
// circles: [lon, lat, radius°]。後ろのものほど優先（上に塗る）
const BIOMES = [
  { key: "savanna", name: "サバンナ", color: "#cfd98a",
    circles: [[0, 13, 7], [15, 12, 7], [30, 10, 6], [35, -5, 7], [25, -15, 7], [-48, -13, 7], [133, -16, 6], [78, 17, 6]],
    plants: [["🌳", "アカシアの木", 70], ["🌾", "草原", 50]] },
  { key: "desert", name: "砂漠", color: "#ecd9a0",
    circles: [[-5, 22, 9], [8, 24, 10], [20, 23, 9], [30, 22, 7], [45, 23, 8], [52, 20, 5], [57, 30, 5], [72, 26, 4.5], [105, 42, 6], [95, 41, 5], [83, 39, 5], [128, -24, 9], [138, -26, 7], [122, -25, 5], [20, -23, 6], [15, -22, 4], [-70, -23, 3], [-113, 34, 5]],
    plants: [["🌵", "サボテン", 65], ["🌵", "サボテン", 65], ["🌴", "オアシスのヤシ", 70]] },
  { key: "rain", name: "熱帯雨林", color: "#4fa556",
    circles: [[-62, -4, 10], [-70, -2, 7], [-55, -6, 7], [-85, 12, 3], [20, 0, 7], [12, 2, 4], [114, 0, 4], [101, 0, 3], [142, -5, 4], [104, 14, 4], [123, 10, 3]],
    plants: [["🌴", "ヤシの木", 70], ["🌿", "シダ", 50], ["🌺", "ハイビスカス", 45], ["🌳", "ジャングルの木", 70]] },
  { key: "taiga", name: "針葉樹林", color: "#6fa58a",
    circles: [[-100, 57, 10], [-75, 52, 6], [-125, 57, 6], [90, 60, 14], [120, 59, 12], [60, 60, 9], [20, 63, 5], [140, 55, 6]],
    plants: [["🌲", "モミの木", 70], ["🌲", "モミの木", 70], ["🍄", "きのこ", 40]] },
  { key: "mount", name: "高山", color: "#c8bea6",
    circles: [[85, 30, 5], [90, 33, 6], [78, 34, 4], [-68, -20, 4], [-71, -33, 3], [-75, -8, 3], [-110, 42, 4], [8, 46, 2.2]],
    plants: [["🏔️", "雪山", 80], ["⛰️", "山", 70]] },
  { key: "tundra", name: "ツンドラ", color: "#d3ddd0",
    circles: [[-100, 69, 10], [-80, 66, 6], [-130, 68, 6], [-155, 66, 6], [100, 72, 14], [140, 70, 12], [70, 69, 8], [170, 66, 6]],
    plants: [["🦌", "トナカイ", 70], ["⛄", "雪だるま", 60], ["🌲", "モミの木", 60]] },
  { key: "ice", name: "氷原", color: "#f2f7fa",
    circles: [[-42, 72, 12], [-40, 79, 8], [20, 79, 4], [100, 79, 4], [-80, 78, 8], [0, -90, 28]],
    plants: [["⛄", "雪だるま", 60], ["🏔️", "氷山", 80]] }
];
const TEMPERATE_PLANTS = [["🌳", "広葉樹", 70], ["🌳", "広葉樹", 70], ["🌷", "チューリップ", 45], ["🌻", "ひまわり", 55]];

// 建物: 寒い・暑い気候ならその土地向け、それ以外は地域らしい建物
const BUILD_BY_BIOME = {
  ice: [["l:igloo", "イグルー", 60]], tundra: [["l:igloo", "イグルー", 60], ["l:cabin", "ログハウス", 70]],
  taiga: [["l:cabin", "ログハウス", 70]], desert: [["e:⛺", "テント", 60], ["e:🕌", "モスク", 85]],
  rain: [["e:🛖", "小屋", 65]], savanna: [["e:🛖", "小屋", 65]], mount: [["l:cabin", "山小屋", 65]]
};
const BUILD_BY_REGION = {
  "ヨーロッパ": [["e:🏰", "お城", 90], ["e:⛪", "教会", 85], ["l:windmill", "風車", 90], ["e:🏡", "家", 65]],
  "北米": [["e:🏡", "家", 65], ["e:🏠", "家", 65], ["e:⛪", "教会", 85]],
  "東アジア": [["e:🏯", "お城", 90], ["e:⛩️", "鳥居", 70], ["l:pagoda", "五重塔", 100]],
  "南アジア": [["e:🛕", "寺院", 85]], "東南アジア": [["e:🛕", "寺院", 85], ["e:🛖", "小屋", 65]],
  "中東": [["e:🕌", "モスク", 85]], "中央アジア": [["e:⛺", "ゲル", 60]], "アフリカ": [["e:🛖", "小屋", 65]],
  "ロシア・北アジア": [["l:cabin", "ログハウス", 70], ["e:⛪", "教会", 85]],
  "中米・カリブ": [["e:⛪", "教会", 85], ["e:🏠", "家", 65]], "南米": [["e:⛪", "教会", 85], ["e:🏠", "家", 65]],
  "オセアニア": [["e:🏡", "家", 65]]
};

return { COSTUMES, LANDMARKS, LM_SVG, SEA, SEA_NAMES, SEA_SIZE, VEHICLES, BIOMES, TEMPERATE_PLANTS, BUILD_BY_BIOME, BUILD_BY_REGION, buildCostume, loadSvg, trim };
})();
