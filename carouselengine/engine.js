// Gendaris carousel slide engine: builds one animated 5 second slide (1080 x 1350) from a data object.
const W = 1080, H = 1350, T = 5;

const THEMES = {
  light: { ink: '#0A0F0A', accent: '#006400', sub: 'rgba(10,15,10,.58)', card: 'rgba(255,255,255,.88)', border: 'rgba(0,40,0,.06)', shadow: '0 1px 2px rgba(0,40,0,.06), 0 24px 60px rgba(0,60,0,.10)', chip: 'rgba(255,255,255,.9)', logo: 'logo_green.png', line: 'rgba(0,100,0,.22)' },
  dark: { ink: '#F4FBF3', accent: '#C2EABD', sub: 'rgba(244,251,243,.62)', card: 'rgba(255,255,255,.065)', border: 'rgba(255,255,255,.10)', shadow: '0 30px 80px rgba(0,0,0,.45)', chip: 'rgba(255,255,255,.08)', logo: 'logo_white.png', line: 'rgba(194,234,189,.30)' },
  green: { ink: '#FFFFFF', accent: '#C2EABD', sub: 'rgba(255,255,255,.76)', card: 'rgba(255,255,255,.12)', border: 'rgba(255,255,255,.20)', shadow: '0 30px 80px rgba(0,30,0,.30)', chip: 'rgba(255,255,255,.14)', logo: 'logo_white.png', line: 'rgba(255,255,255,.35)' },
};

// Apple style gradient fields: base linear gradient plus large soft colour fields that drift slowly.
// Old background codes map onto these so slide data stays the same.
const BG = {
  b2: { base: ['#F4FBF3', '#D9EFD4'], ang: 180, blobs: [['#C2EABD', 1, .95, .05, .80], ['#006400', .48, .0, 1.12, .80], ['#FFFFFF', .85, .25, .35, .45]] },
  b3: { base: ['#FFFFFF', '#E0F2DC'], ang: 160, blobs: [['#C2EABD', 1, .0, .95, .90], ['#006400', .45, 1.05, 1.08, .72], ['#FFFFFF', .7, .75, .15, .50]] },
  b5: { base: ['#F4FBF3', '#DCF0D7'], ang: 200, blobs: [['#C2EABD', 1, .55, 1.15, .85], ['#006400', .40, .5, 1.2, .70], ['#FFFFFF', .8, .2, .2, .50]] },
  b6: { base: ['#FFFFFF', '#D8EED3'], ang: 135, blobs: [['#C2EABD', 1, 1.0, 1.0, .80], ['#C2EABD', .85, .0, .1, .60], ['#006400', .46, .4, 1.18, .72]] },
  b10: { base: ['#FFFFFF', '#E2F3DE'], ang: 180, blobs: [['#C2EABD', 1, .1, .95, .75], ['#006400', .46, 1.0, 1.1, .72], ['#FFFFFF', .9, .7, .2, .45]] },
  b4: { base: ['#000000', '#030F04'], ang: 180, blobs: [['#006400', .95, .5, 1.18, .78], ['#C2EABD', .12, .5, 1.05, .32], ['#003A00', .5, .0, .0, .50]] },
  b7: { base: ['#020502', '#000000'], ang: 160, blobs: [['#006400', .80, 1.05, .0, .80], ['#003A00', .70, .0, 1.0, .70], ['#C2EABD', .07, .8, .25, .40]] },
  b9: { base: ['#000000', '#021003'], ang: 200, blobs: [['#006400', .65, .0, .45, .70], ['#006400', .45, 1.0, 1.0, .65], ['#C2EABD', .08, .2, .2, .35]] },
  b1: { base: ['#003F00', '#006400'], ang: 170, blobs: [['#C2EABD', .38, .9, 1.0, .70], ['#000000', .40, .0, .0, .75], ['#0B7A0B', .9, .7, .45, .55]] },
  b8: { base: ['#006400', '#004500'], ang: 200, blobs: [['#C2EABD', .32, .05, .1, .65], ['#000000', .45, 1.0, 1.0, .80], ['#0B7A0B', .8, .35, .7, .55]] },
};



BG.sky = { base: ['#1C7A33', '#BFE6BC'], ang: 180, blobs: [['#0B5A1E', .75, .4, -.05, .6], ['#FFFFFF', .85, .05, .92, .32], ['#FFFFFF', .8, .35, 1.08, .36], ['#FFFFFF', .85, .78, .98, .34], ['#FFFFFF', .6, 1.05, .7, .26], ['#F4FFF0', .5, .55, .82, .22]] };
BG.vivid = { base: ['#002A00', '#006400'], ang: 150, blobs: [['#C2EABD', .95, .88, .12, .52], ['#1FA03A', .95, .08, .62, .52], ['#000000', .75, .95, .98, .62], ['#E4F8C8', .55, .3, .02, .36], ['#006400', .9, .55, .45, .4]] };
BG.dots = { base: ['#F3F6F2', '#E4EBE3'], ang: 180, blobs: [['#FFFFFF', .95, .5, .32, .62], ['#C2EABD', .38, .92, 1.02, .5], ['#C2EABD', .2, .0, .0, .4]] };
// LOOKS: one per TikTok reference. jay = sky, bold serif, pixel halftone keyword. duncan = vivid blur, words in outline pills, big italic script keyword. dots = dot grid board, clean sans, italic serif keyword.
const LOOKS = {
  jay: { theme: 'green', bg: 'sky', storeBg: 'sky', f: "'Fraunces'", w: 700, sc: 1.02, lh: 1.0, ls: '-.028em', grp: 'hft', kc: 'rgba(255,255,255,.85)' },
  duncan: { theme: 'green', bg: 'vivid', storeBg: 'vivid', f: "'Inter Display'", w: 700, sc: 0.8, lh: 1.3, ls: '-.03em', grp: 'scr', wrap: 'pw', kc: 'rgba(255,255,255,.85)' },
  dots: { theme: 'light', bg: 'dots', storeBg: 'b8', f: "'Inter Display'", w: 700, sc: 1, lh: 1.04, ls: '-.034em', grp: '', kc: 'rgba(0,100,0,.75)' },
};
const TYPES = {
  inter: { name: 'Inter Display (now)', hf: "'Inter Display'", hw: 700, lh: 1.04, ls: '-.032em', scale: 1, bf: 'Inter' },
  jakarta: { name: 'Plus Jakarta Sans', hf: "'Jakarta'", hw: 800, lh: 1.04, ls: '-.04em', scale: 1.04, bf: "'Jakarta'" },
  serifAccent: { name: 'Inter plus serif accent', hf: "'Inter Display'", hw: 600, lh: 1.04, ls: '-.03em', scale: 1.04, bf: 'Inter', acc: "font-family:'Instrument Serif';font-style:italic;font-weight:400;font-size:1.16em;letter-spacing:-.01em" },
  editorial: { name: 'Instrument Serif editorial', hf: "'Instrument Serif'", hw: 400, lh: 0.98, ls: '-.015em', scale: 1.3, bf: 'Inter', acc: 'font-style:italic' },
  light: { name: 'Geist medium, smaller', hf: "'Geist'", hw: 500, lh: 1.06, ls: '-.035em', scale: 0.86, bf: "'Geist'" },
  bricolage: { name: 'Bricolage Grotesque', hf: "'Bricolage'", hw: 800, lh: 0.98, ls: '-.04em', scale: 1.08, bf: "'Manrope'" },
  sizePlay: { name: 'Size play, Inter heavy with big accent words', hf: "'Inter Display'", hw: 800, lh: 1.0, ls: '-.04em', scale: 0.92, cover: 1.18, bf: 'Inter', acc: 'font-size:1.3em;letter-spacing:-.05em' },
  mix: { name: 'Mixed fonts in one carousel', hf: "'Inter Display'", hw: 700, lh: 1.04, ls: '-.032em', scale: 1, bf: 'Inter', mix: true },
  montserrat: { name: 'Montserrat', hf: "'Montserrat'", hw: 800, lh: 1.06, ls: '-.03em', scale: 0.92, bf: "'Montserrat'" },
};
const FONTFACE = `@font-face{font-family:'Bricolage';font-weight:200;font-style:normal;src:url(assets/fonts/bricolage-grotesque-latin-200-normal.woff2) format("woff2")}@font-face{font-family:'Bricolage';font-weight:300;font-style:normal;src:url(assets/fonts/bricolage-grotesque-latin-300-normal.woff2) format("woff2")}@font-face{font-family:'Bricolage';font-weight:400;font-style:normal;src:url(assets/fonts/bricolage-grotesque-latin-400-normal.woff2) format("woff2")}@font-face{font-family:'Bricolage';font-weight:500;font-style:normal;src:url(assets/fonts/bricolage-grotesque-latin-500-normal.woff2) format("woff2")}@font-face{font-family:'Bricolage';font-weight:600;font-style:normal;src:url(assets/fonts/bricolage-grotesque-latin-600-normal.woff2) format("woff2")}@font-face{font-family:'Bricolage';font-weight:700;font-style:normal;src:url(assets/fonts/bricolage-grotesque-latin-700-normal.woff2) format("woff2")}@font-face{font-family:'Bricolage';font-weight:800;font-style:normal;src:url(assets/fonts/bricolage-grotesque-latin-800-normal.woff2) format("woff2")}@font-face{font-family:'DM Serif';font-weight:400;font-style:normal;src:url(assets/fonts/dm-serif-display-latin-400-normal.woff2) format("woff2")}@font-face{font-family:'Geist';font-weight:100;font-style:normal;src:url(assets/fonts/geist-sans-latin-100-normal.woff2) format("woff2")}@font-face{font-family:'Geist';font-weight:200;font-style:normal;src:url(assets/fonts/geist-sans-latin-200-normal.woff2) format("woff2")}@font-face{font-family:'Geist';font-weight:300;font-style:normal;src:url(assets/fonts/geist-sans-latin-300-normal.woff2) format("woff2")}@font-face{font-family:'Geist';font-weight:400;font-style:normal;src:url(assets/fonts/geist-sans-latin-400-normal.woff2) format("woff2")}@font-face{font-family:'Geist';font-weight:500;font-style:normal;src:url(assets/fonts/geist-sans-latin-500-normal.woff2) format("woff2")}@font-face{font-family:'Geist';font-weight:600;font-style:normal;src:url(assets/fonts/geist-sans-latin-600-normal.woff2) format("woff2")}@font-face{font-family:'Geist';font-weight:700;font-style:normal;src:url(assets/fonts/geist-sans-latin-700-normal.woff2) format("woff2")}@font-face{font-family:'Geist';font-weight:800;font-style:normal;src:url(assets/fonts/geist-sans-latin-800-normal.woff2) format("woff2")}@font-face{font-family:'Geist';font-weight:900;font-style:normal;src:url(assets/fonts/geist-sans-latin-900-normal.woff2) format("woff2")}@font-face{font-family:'Instrument Serif';font-weight:400;font-style:italic;src:url(assets/fonts/instrument-serif-latin-400-italic.woff2) format("woff2")}@font-face{font-family:'Instrument Serif';font-weight:400;font-style:normal;src:url(assets/fonts/instrument-serif-latin-400-normal.woff2) format("woff2")}@font-face{font-family:'Manrope';font-weight:200;font-style:normal;src:url(assets/fonts/manrope-latin-200-normal.woff2) format("woff2")}@font-face{font-family:'Manrope';font-weight:300;font-style:normal;src:url(assets/fonts/manrope-latin-300-normal.woff2) format("woff2")}@font-face{font-family:'Manrope';font-weight:400;font-style:normal;src:url(assets/fonts/manrope-latin-400-normal.woff2) format("woff2")}@font-face{font-family:'Manrope';font-weight:500;font-style:normal;src:url(assets/fonts/manrope-latin-500-normal.woff2) format("woff2")}@font-face{font-family:'Manrope';font-weight:600;font-style:normal;src:url(assets/fonts/manrope-latin-600-normal.woff2) format("woff2")}@font-face{font-family:'Manrope';font-weight:700;font-style:normal;src:url(assets/fonts/manrope-latin-700-normal.woff2) format("woff2")}@font-face{font-family:'Manrope';font-weight:800;font-style:normal;src:url(assets/fonts/manrope-latin-800-normal.woff2) format("woff2")}@font-face{font-family:'Montserrat';font-weight:100;font-style:normal;src:url(assets/fonts/montserrat-latin-100-normal.woff2) format("woff2")}@font-face{font-family:'Montserrat';font-weight:200;font-style:normal;src:url(assets/fonts/montserrat-latin-200-normal.woff2) format("woff2")}@font-face{font-family:'Montserrat';font-weight:300;font-style:normal;src:url(assets/fonts/montserrat-latin-300-normal.woff2) format("woff2")}@font-face{font-family:'Montserrat';font-weight:400;font-style:normal;src:url(assets/fonts/montserrat-latin-400-normal.woff2) format("woff2")}@font-face{font-family:'Montserrat';font-weight:500;font-style:normal;src:url(assets/fonts/montserrat-latin-500-normal.woff2) format("woff2")}@font-face{font-family:'Montserrat';font-weight:600;font-style:normal;src:url(assets/fonts/montserrat-latin-600-normal.woff2) format("woff2")}@font-face{font-family:'Montserrat';font-weight:700;font-style:normal;src:url(assets/fonts/montserrat-latin-700-normal.woff2) format("woff2")}@font-face{font-family:'Montserrat';font-weight:800;font-style:normal;src:url(assets/fonts/montserrat-latin-800-normal.woff2) format("woff2")}@font-face{font-family:'Montserrat';font-weight:900;font-style:normal;src:url(assets/fonts/montserrat-latin-900-normal.woff2) format("woff2")}@font-face{font-family:'Jakarta';font-weight:200;font-style:normal;src:url(assets/fonts/plus-jakarta-sans-latin-200-normal.woff2) format("woff2")}@font-face{font-family:'Jakarta';font-weight:300;font-style:normal;src:url(assets/fonts/plus-jakarta-sans-latin-300-normal.woff2) format("woff2")}@font-face{font-family:'Jakarta';font-weight:400;font-style:normal;src:url(assets/fonts/plus-jakarta-sans-latin-400-normal.woff2) format("woff2")}@font-face{font-family:'Jakarta';font-weight:500;font-style:normal;src:url(assets/fonts/plus-jakarta-sans-latin-500-normal.woff2) format("woff2")}@font-face{font-family:'Jakarta';font-weight:600;font-style:normal;src:url(assets/fonts/plus-jakarta-sans-latin-600-normal.woff2) format("woff2")}@font-face{font-family:'Jakarta';font-weight:700;font-style:normal;src:url(assets/fonts/plus-jakarta-sans-latin-700-normal.woff2) format("woff2")}@font-face{font-family:'Jakarta';font-weight:800;font-style:normal;src:url(assets/fonts/plus-jakarta-sans-latin-800-normal.woff2) format("woff2")}@font-face{font-family:'Space Grotesk';font-weight:300;font-style:normal;src:url(assets/fonts/space-grotesk-latin-300-normal.woff2) format("woff2")}@font-face{font-family:'Space Grotesk';font-weight:400;font-style:normal;src:url(assets/fonts/space-grotesk-latin-400-normal.woff2) format("woff2")}@font-face{font-family:'Space Grotesk';font-weight:500;font-style:normal;src:url(assets/fonts/space-grotesk-latin-500-normal.woff2) format("woff2")}@font-face{font-family:'Space Grotesk';font-weight:600;font-style:normal;src:url(assets/fonts/space-grotesk-latin-600-normal.woff2) format("woff2")}@font-face{font-family:'Space Grotesk';font-weight:700;font-style:normal;src:url(assets/fonts/space-grotesk-latin-700-normal.woff2) format("woff2")}`;

let seq = 0;
// animated element wrapper
function A(d, k, s, inner, style = '', cls = '') {
  return `<div class="a ${cls}" data-d="${d.toFixed(2)}" data-k="${k}" ${s ? `data-s="${s}"` : ''} style="${style}">${inner}</div>`;
}
function words(str, d0, step, extraCls = '', group = '', wrap = '') {
  // *accent* markers, \n line breaks
  const out = []; let i = 0;
  str.split('\n').forEach((line, li) => {
    if (li > 0) out.push('<br>');
    line.split(/(\*[^*]+\*)/).forEach(seg => {
      if (!seg) return;
      const acc = seg.startsWith('*');
      const txt = acc ? seg.slice(1, -1) : seg;
      if (acc && group) { out.push(`<span class="a w ac grp ${extraCls}" data-d="${(d0 + i * step).toFixed(2)}" data-k="up" data-s="w"><span class="${group}">${txt}</span></span> `); i++; return; }
      txt.split(' ').filter(Boolean).forEach(w => {
        out.push(`<span class="a w ${acc ? 'ac' : ''} ${extraCls}" data-d="${(d0 + i * step).toFixed(2)}" data-k="up" data-s="w">${wrap && !acc ? `<span class="${wrap}">${w}</span>` : w}</span> `);
        i++;
      });
    });
  });
  return { html: out.join(''), n: i, end: d0 + i * step };
}

const STORE_LOOK = {
  jay: `<div style="font:700 130px/1.04 'Fraunces';letter-spacing:-.03em;text-align:center;color:#fff;text-shadow:0 6px 34px rgba(0,30,0,.35)">Rekam. Kirim.<br><span class="hft" style="font-size:120px;margin-top:20px">Kerja.</span></div>`,
  duncan: `<div style="font:700 104px/1.3 'Inter Display';letter-spacing:-.03em;text-align:center;color:#fff"><span class="pw">Rekam.</span> <span class="pw">Kirim.</span><br><span class="scr" style="font-size:210px;line-height:1">Kerja.</span></div>`,
  dots: `<div style="font:700 132px/1.02 'Inter Display';letter-spacing:-.04em;text-align:center;color:#fff">Rekam. Kirim.<br><span style="font:italic 400 196px/1 'Instrument Serif';letter-spacing:-.01em;color:#C2EABD">Kerja.</span></div>`,
};
// Official badge files win: put google.png or google.svg and apple.png or apple.svg in assets/badges. The drawn SVGs below are only previews.
const fsB = require('fs'), pathB = require('path');
function badgeFile(name) {
  for (const ext of ['svg', 'png']) { const f = pathB.join(__dirname, 'assets', 'badges', name + '.' + ext); if (fsB.existsSync(f)) return 'assets/badges/' + name + '.' + ext; }
  return null;
}
function officialBadge(name) { const f = badgeFile(name); return f ? `<img src="${f}" style="height:126px;width:auto;display:block">` : null; }
function badgeGoogle() {
  const o = officialBadge('google'); if (o) return o;
  return `<svg width="420" height="126" viewBox="0 0 420 126"><rect x="1.5" y="1.5" width="417" height="123" rx="22" fill="#000" stroke="#A6A6A6" stroke-width="3"/>
  <g transform="translate(34,26)"><polygon points="0,0 0,74 40,37" fill="#00C3FF"/><polygon points="0,0 40,37 56,21 12,-4" fill="#00E67A" transform="translate(0,2)"/><polygon points="0,74 40,37 56,53 12,78" fill="#FF3A44" transform="translate(0,-4)"/><polygon points="40,37 56,21 74,37 56,53" fill="#FFC800"/></g>
  <text x="124" y="52" font-family="Inter" font-size="20" fill="#fff" letter-spacing="1">GET IT ON</text>
  <text x="124" y="92" font-family="Inter" font-weight="600" font-size="40" fill="#fff">Google Play</text></svg>`;
}
function badgeApple() {
  const o = officialBadge('apple'); if (o) return o;
  return `<svg width="420" height="126" viewBox="0 0 420 126"><rect x="1.5" y="1.5" width="417" height="123" rx="22" fill="#000" stroke="#A6A6A6" stroke-width="3"/>
  <g transform="translate(40,26)" fill="#fff"><path d="M36 22c-6-2-10 3-15 3s-9-5-15-3C-3 27-3 50 8 66c4 6 8 12 14 12 5 0 7-3 14-3s9 3 14 3c6 0 10-6 14-12 3-4 5-8 6-11-12-5-13-22-1-29-4-6-10-9-16-9-6 0-9 3-17 5z" transform="scale(.9)"/><path d="M36 4c1-5 7-10 13-11 1 6-3 12-8 15-4 2-6 1-5-4z" transform="scale(.9)"/></g>
  <text x="122" y="48" font-family="Inter" font-size="20" fill="#fff">Download on the</text>
  <text x="122" y="94" font-family="Inter" font-weight="600" font-size="46" fill="#fff">App Store</text></svg>`;
}

// ---------- graphic builders (return html, positioned in the lower area) ----------
const G = {
  typo(s, t, d) { return ''; },

  bignum(s, th, d) {
    return A(d, 'pop', 'card', `<div class="card" style="width:560px;height:560px;border-radius:120px;display:flex;align-items:center;justify-content:center;margin:0 auto"><span style="font:700 420px/1 var(--hf);letter-spacing:-.05em;color:${th.accent}">${s.num}</span></div>`, `position:absolute;left:0;right:0;top:640px;text-align:center`);
  },

  notice(s, th, d) {
    return A(d, 'pop', 'card', `
      <div style="position:relative;width:640px;margin:0 auto;padding:54px 52px 48px;background:#F4FBF3;border-radius:14px;box-shadow:0 1px 2px rgba(0,0,0,.08),0 30px 70px rgba(0,50,0,.18);transform:rotate(-1.5deg);">
        <div style="font:600 26px var(--bf);letter-spacing:.22em;color:#006400">${s.k}</div>
        <div style="font:700 74px/1 var(--hf);letter-spacing:-.03em;margin:14px 0 24px;color:#000">${s.title}</div>
        <div style="font:500 34px/1.5 var(--bf);color:rgba(0,0,0,.65)">${s.lines.join('<br>')}</div>
        <div style="margin-top:30px;display:inline-block;padding:10px 24px;border-radius:999px;background:#C2EABD;font:600 24px var(--bf);color:#006400">Contoh rekaan</div>
      </div>`, `position:absolute;left:0;right:0;top:${s.top || 600}px;--r:0deg`);
  },

  timeline(s, th, d) {
    const rows = s.rows.map((r, i) => {
      const last = i === s.rows.length - 1;
      return A(d + 0.15 + i * 0.22, 'left', 'tick', `<div style="display:flex;align-items:center;gap:30px"><div style="width:24px;height:24px;margin-left:4px;border-radius:50%;background:${last ? th.accent : th.ink};opacity:${last ? 1 : .35};flex:none"></div><div class="card" style="padding:26px 40px;font:600 42px var(--hf);letter-spacing:-.01em;border-radius:28px;${last ? `background:${th.accent};color:${th.accent === '#006400' ? '#fff' : '#000'};border-color:transparent` : ''}">${r}</div></div>`, 'margin-bottom:34px');
    }).join('');
    const tile = ''; const _unused = ( `<div class="card" style="width:230px;height:230px;border-radius:44px;background:rgba(0,0,0,.55);display:flex;flex-direction:column;align-items:center;justify-content:center"><span style="font:600 24px var(--bf);letter-spacing:.16em;opacity:.65">${s.tileK}</span><span style="font:700 130px/1 var(--hf);color:${th.accent}">?</span></div>`, '');
    return `<div style="position:absolute;left:72px;right:72px;top:${s.top || 640}px;height:560px"><div style="position:absolute;left:14px;top:30px;width:2px;height:${s.rows.length * 118}px;background:${th.line}"></div>${rows}${tile}</div>`;
  },

  gap(s, th, d) {
    const c = (txt, x, k) => A(d + k, 'pop', 'card', `<div class="card" style="width:380px;height:380px;border-radius:50%;display:flex;align-items:center;justify-content:center;text-align:center;font:700 46px/1.15 var(--hf);padding:50px">${txt}</div>`, `position:absolute;${x}:0;top:0`);
    return `<div style="position:absolute;left:72px;right:72px;top:${s.top || 700}px;height:420px">${c(s.a, 'left', 0)}${c(s.b, 'right', 0.2)}
      ${A(d + 0.5, 'wipe', 'tick', `<div style="position:absolute;left:400px;right:400px;top:189px;height:2px;background:${th.line}"></div>`)}
      ${A(d + 1.0, 'fade', '', `<div style="position:absolute;left:0;right:0;top:430px;text-align:center;font:500 36px var(--bf);color:${th.sub}">${s.note}</div>`)}</div>`;
  },

  map(s, th, d) {
    return `<div style="position:absolute;left:72px;right:72px;top:${s.top || 760}px;height:560px">
      ${A(d, 'pop', 'card', `<div class="card" style="position:absolute;inset:0;border-radius:48px;overflow:hidden;background:rgba(255,255,255,.88)">
        <div style="position:absolute;inset:0;background-image:linear-gradient(rgba(0,100,0,.09) 2px,transparent 2px),linear-gradient(90deg,rgba(0,100,0,.09) 2px,transparent 2px);background-size:90px 90px"></div>
        <div style="position:absolute;left:120px;top:60px;width:700px;height:12px;background:rgba(0,100,0,.12);border-radius:6px;transform:rotate(12deg)"></div>
        <div style="position:absolute;left:260px;top:10px;width:12px;height:560px;background:rgba(0,100,0,.10);border-radius:6px"></div>
        <div style="position:absolute;left:218px;top:90px;width:500px;height:400px;border-radius:50%;border:2px solid rgba(0,100,0,.35);background:rgba(194,234,189,.38)"></div></div>`, 'position:absolute;inset:0')}
      ${A(d + 0.45, 'pop', 'tick', `<div style="position:absolute;left:442px;top:265px;width:40px;height:40px;border-radius:50%;background:#006400;box-shadow:0 0 0 14px rgba(0,100,0,.2)"></div>`)}
      ${A(d + 0.7, 'pop', 'tick', `<div style="position:absolute;left:300px;top:150px;padding:16px 28px;border-radius:999px;background:#000;color:#fff;font:600 32px var(--bf)">${s.p1}</div>`)}
      ${A(d + 0.95, 'pop', 'tick', `<div style="position:absolute;left:520px;top:360px;padding:16px 28px;border-radius:999px;background:#006400;color:#fff;font:600 32px var(--bf)">${s.p2}</div>`)}
      ${A(d + 1.25, 'pop', 'tick', `<div style="position:absolute;left:34px;top:480px;padding:14px 28px;border-radius:999px;background:#C2EABD;color:#006400;font:600 28px var(--bf)">${s.tag}</div>`)}
    </div>`;
  },

  word(s, th, d) {
    return A(d, 'pop', 'card', `<div style="margin:0 auto;display:inline-block;padding:0;font:700 ${s.size || 200}px/1 var(--hf);letter-spacing:-.04em;color:${th.ink}">${s.word}</div>`, `position:absolute;left:0;right:0;top:${s.top || 780}px;text-align:center`);
  },

  clock(s, th, d) {
    return `<div style="position:absolute;left:72px;right:72px;top:${s.top || 640}px">
      ${A(d, 'up', 'tick', `<div style="font:600 36px var(--bf);letter-spacing:.06em;opacity:.65">${s.day}</div>`)}
      ${A(d + 0.15, 'pop', 'card', `<div style="font:700 330px/1 var(--hf);letter-spacing:-.06em;margin:10px 0 40px;color:${th.accent}">${s.time}</div>`)}
      ${A(d + 0.6, 'up', 'card', `<div class="card" style="padding:30px 38px;border-radius:34px;display:flex;align-items:center;gap:28px"><div style="width:70px;height:70px;border-radius:50%;background:#006400;display:flex;align-items:center;justify-content:center"><svg width="38" height="38" viewBox="0 0 38 38"><path d="M7 20l8 8 16-17" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></div><div><div style="font:600 36px var(--hf)">${s.msg}</div><div style="font:500 28px var(--bf);opacity:.6">${s.msg2}</div></div></div>`)}
    </div>`;
  },

  inbox(s, th, d) {
    const rows = s.rows.map((r, i) => {
      const me = r.me;
      return A(d + 0.2 + i * 0.16, 'up', 'tick', `<div style="display:flex;align-items:center;gap:26px;padding:24px 8px;border-bottom:2px solid ${th.line.replace('.35', '.15').replace('.45', '.12')};${me ? `background:${th.accent === '#006400' ? 'rgba(194,234,189,.6)' : 'rgba(194,234,189,.18)'};border-radius:22px;padding:24px 24px` : ''}"><div style="width:62px;height:62px;border-radius:50%;background:${me ? '#006400' : 'rgba(128,128,128,.28)'};flex:none;color:#fff;display:flex;align-items:center;justify-content:center;font:700 28px var(--bf)">${me ? 'K' : ''}</div><div style="flex:1"><div style="font:600 36px var(--hf)">${r.t}</div><div style="font:500 26px var(--bf);opacity:.55">${r.s}</div></div><div style="font:600 24px var(--bf);padding:8px 20px;border-radius:999px;background:${me ? '#006400' : 'rgba(128,128,128,.2)'};color:${me ? '#fff' : 'inherit'}">${r.st}</div></div>`);
    }).join('');
    return `<div style="position:absolute;left:72px;right:72px;top:${s.top || 640}px">${A(d, 'pop', 'card', `<div class="card" style="padding:26px 30px;border-radius:48px"><div style="font:600 26px var(--bf);letter-spacing:.14em;opacity:.55;padding:8px 8px 14px">${s.head}</div>${rows}</div>`)}</div>`;
  },

  cvpaper(s, th, d) {
    const line = (lab, w, hi, i) => A(d + 0.3 + i * 0.2, 'up', 'tick', `<div style="margin:18px 0"><div style="font:600 24px var(--bf);letter-spacing:.14em;color:${hi ? '#006400' : 'rgba(0,0,0,.35)'}">${lab}</div><div style="margin-top:10px;height:22px;width:${w}%;border-radius:11px;background:${hi ? '#C2EABD' : 'rgba(0,0,0,.08)'}"></div><div style="margin-top:10px;height:22px;width:${w - 22}%;border-radius:11px;background:${hi ? '#C2EABD' : 'rgba(0,0,0,.08)'}"></div></div>`);
    return `<div style="position:absolute;left:72px;right:72px;top:${s.top || 640}px">
      ${A(d, 'pop', 'card', `<div style="width:640px;margin:0 auto;padding:48px 56px 40px;background:#fff;border-radius:22px;box-shadow:0 40px 80px rgba(0,60,0,.2);transform:rotate(2deg)">
        <div style="display:flex;gap:26px;align-items:center"><div style="width:96px;height:96px;border-radius:50%;background:rgba(0,0,0,.1)"></div><div><div style="height:30px;width:260px;border-radius:15px;background:#000"></div><div style="height:20px;width:180px;margin-top:14px;border-radius:10px;background:rgba(0,0,0,.14)"></div></div></div>
        ${line('PENDIDIKAN', 88, true, 0)}${line('PENGALAMAN', 76, true, 1)}${line('KEAHLIAN', 90, false, 2)}</div>`)}
      ${A(d + 1.3, 'up', 'card', `<div style="position:absolute;right:20px;top:-10px;padding:14px 26px;border-radius:999px;background:#006400;color:#fff;font:600 28px var(--bf);transform:rotate(4deg)">${s.stamp}</div>`)}
    </div>`;
  },

  chips(s, th, d) {
    const chips = s.chips.map((c, i) => {
      const ghost = c.g;
      return A(d + i * 0.2, 'pop', 'tick', `<div style="display:inline-block;margin:0 18px 22px 0;padding:26px 44px;border-radius:999px;font:600 44px var(--hf);letter-spacing:-.01em;${ghost ? `border:2px solid ${th.line};color:${th.ink};background:transparent` : `background:${th.chip};border:2px solid ${th.border};box-shadow:${th.shadow}`}">${c.t}</div>`);
    }).join('');
    return `<div style="position:absolute;left:72px;right:72px;top:${s.top || 700}px">${chips}${s.note ? A(d + s.chips.length * 0.2 + 0.2, 'fade', '', `<div style="margin-top:30px;font:500 36px var(--bf);color:${th.sub}">${s.note}</div>`) : ''}</div>`;
  },

  phone(s, th, d) {
    return `<div style="position:absolute;left:0;right:0;top:${s.top || 600}px;text-align:center">${A(d, 'pop', 'card', `
      <div style="display:inline-block;position:relative;width:380px;height:630px;border-radius:64px;background:#06140a;padding:16px;box-shadow:0 50px 90px rgba(0,50,0,.4),0 0 0 3px rgba(255,255,255,.12) inset;">
        <div style="width:100%;height:100%;border-radius:56px;background:linear-gradient(#0a7a0a,#003d00);position:relative;overflow:hidden">
          <div style="position:absolute;left:50%;top:18px;width:130px;height:36px;margin-left:-65px;border-radius:20px;background:#000"></div>
          <div style="position:absolute;left:50%;top:150px;width:260px;height:260px;margin-left:-130px;border-radius:50%;border:12px solid rgba(255,255,255,.2)"></div>
          <svg style="position:absolute;left:50%;top:150px;margin-left:-130px" width="260" height="260" viewBox="0 0 260 260"><circle cx="130" cy="130" r="124" fill="none" stroke="#C2EABD" stroke-width="12" stroke-linecap="round" stroke-dasharray="560 780" transform="rotate(-90 130 130)"/></svg>
          <div style="position:absolute;left:0;right:0;top:230px;text-align:center;font:700 80px var(--hf);color:#fff">0:42</div>
          <div style="position:absolute;left:0;right:0;bottom:150px;text-align:center;font:600 24px var(--bf);color:#C2EABD">${s.cap}</div>
          <div style="position:absolute;left:50%;bottom:50px;width:86px;height:86px;margin-left:-43px;border-radius:50%;border:6px solid #fff;display:flex;align-items:center;justify-content:center"><div style="width:44px;height:44px;border-radius:50%;background:#ff3b30"></div></div>
        </div></div>`)}</div>`;
  },

  alur(s, th, d) {
    return `<div style="position:absolute;left:72px;right:72px;top:${s.top || 640}px">
      ${A(d, 'up', 'card', `<div class="card" style="padding:44px 52px;border-radius:44px"><div style="font:600 26px var(--bf);letter-spacing:.16em;opacity:.55">${s.k1}</div><div style="font:600 48px/1.2 var(--hf);margin-top:12px;opacity:.85">${s.t1}</div></div>`)}
      ${A(d + 0.4, 'up', 'tick', `<div style="text-align:center;margin:18px 0"><svg width="70" height="90" viewBox="0 0 70 90"><path d="M35 6v62M12 48l23 24 23-24" stroke="${th.accent}" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></div>`)}
      ${A(d + 0.8, 'up', 'card', `<div style="padding:44px 52px;border-radius:44px;background:#006400;box-shadow:0 30px 60px rgba(0,70,0,.35)"><div style="font:600 26px var(--bf);letter-spacing:.16em;color:#C2EABD">${s.k2}</div><div style="font:700 52px/1.2 var(--hf);margin-top:12px;color:#fff">${s.t2}</div></div>`)}
    </div>`;
  },

  table(s, th, d) {
    const x = `<svg width="64" height="64" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="rgba(200,60,60,.9)"/><path d="M21 21l22 22M43 21L21 43" stroke="#fff" stroke-width="6" stroke-linecap="round"/></svg>`;
    const ok = `<svg width="64" height="64" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#C2EABD"/><path d="M17 33l10 10 20-22" stroke="#006400" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    const col = (lab, mark, txt, delay, good) => A(d + delay, 'up', 'card', `<div class="card" style="width:440px;padding:46px 40px;border-radius:40px;min-height:420px;${good ? 'background:#006400;border-color:#006400;color:#fff' : ''}"><div style="font:600 24px var(--bf);letter-spacing:.14em;opacity:.7">${lab}</div><div style="margin-top:120px;font:600 48px/1.15 var(--hf);letter-spacing:-.015em;${good ? '' : 'opacity:.45;text-decoration:line-through;text-decoration-thickness:3px'}">${txt}</div></div>`);
    return `<div style="position:absolute;left:72px;right:72px;top:${s.top || 680}px;display:flex;gap:56px;justify-content:space-between">${col(s.k1, x, s.t1, 0, false)}${col(s.k2, ok, s.t2, 0.35, true)}</div>
      ${A(d + 1.1, 'fade', '', `<div style="position:absolute;left:72px;right:72px;top:${(s.top || 680) + 520}px;font:500 36px var(--bf);color:${th.sub}">${s.note}</div>`)}`;
  },

  strike(s, th, d) {
    return `<div style="position:absolute;left:72px;right:72px;top:${s.top || 680}px">
      ${A(d, 'up', 'card', `<div class="card" style="position:relative;padding:60px 56px;border-radius:50px;font:600 62px/1.15 var(--hf)">${s.t}${A(d + 0.9, 'wipe', 'tick', `<div style="position:absolute;left:30px;right:30px;top:50%;height:10px;margin-top:-5px;background:${th.ink};opacity:.8;border-radius:5px"></div>`, 'position:absolute;inset:0')}</div>`)}
      ${A(d + 1.7, 'pop', 'card', `<div style="margin-top:56px;font:700 150px/1 var(--hf);letter-spacing:-.04em;color:${th.accent}">${s.big}</div>`)}
    </div>`;
  },

  equation(s, th, d) {
    const pill = (t, delay, bg, fg) => A(d + delay, 'pop', 'card', `<div style="padding:30px 32px;border-radius:36px;background:${bg};color:${fg};font:700 44px var(--hf);letter-spacing:-.01em;box-shadow:${th.shadow}">${t}</div>`);
    return `<div style="position:absolute;left:72px;right:72px;top:${s.top || 780}px;display:flex;align-items:center;justify-content:center;gap:30px">${pill(s.a, 0, th.accent === '#006400' ? '#fff' : 'rgba(255,255,255,.1)', th.ink)}${A(d + 0.3, 'pop', 'tick', `<div style="font:700 76px var(--hf);color:${th.accent}">=</div>`)}${pill(s.b, 0.5, '#006400', '#fff')}</div>`;
  },

  split(s, th, d) {
    const rain = false ? Array.from({ length: 16 }, (_, i) => `<div style="position:absolute;left:${40 + i * 56}px;top:${(i * 37) % 90}px;width:4px;height:48px;border-radius:2px;background:rgba(194,234,189,.55);transform:rotate(14deg)"></div>`).join('') : '';
    return `<div style="position:absolute;left:72px;right:72px;top:${s.top || 640}px">
      ${A(d, 'up', 'card', `<div class="card" style="padding:48px 52px;border-radius:44px"><div style="font:600 26px var(--bf);letter-spacing:.16em;opacity:.6">${s.k1}</div><div style="font:700 54px/1.15 var(--hf);margin-top:12px">${s.t1}</div></div>`)}
      ${A(d + 0.55, 'up', 'card', `<div style="position:relative;overflow:hidden;margin-top:30px;padding:48px 52px;border-radius:44px;background:#000;color:#F4FBF3;box-shadow:0 34px 70px rgba(0,0,0,.4)">${rain}<div style="position:relative;font:600 26px var(--bf);letter-spacing:.16em;color:#C2EABD">${s.k2}</div><div style="position:relative;font:700 54px/1.15 var(--hf);margin-top:12px">${s.t2}</div></div>`)}
    </div>`;
  },

  p2v(s, th, d) {
    return `<div style="position:absolute;left:72px;right:72px;top:${s.top || 720}px;display:flex;align-items:center;justify-content:space-between">
      ${A(d, 'left', 'card', `<div style="width:330px;height:420px;background:#fff;border-radius:22px;padding:34px;box-shadow:0 34px 60px rgba(0,60,0,.22);transform:rotate(-4deg)"><div style="height:22px;width:60%;background:#000;border-radius:11px"></div>${[90, 80, 86, 70, 84].map(w => `<div style="height:16px;width:${w}%;margin-top:22px;background:rgba(0,0,0,.1);border-radius:8px"></div>`).join('')}<div style="margin-top:34px;font:600 22px var(--bf);letter-spacing:.14em;color:rgba(0,0,0,.4)">${s.k1}</div></div>`)}
      ${A(d + 0.5, 'pop', 'tick', `<svg width="110" height="70" viewBox="0 0 110 70"><path d="M8 35h84M64 10l28 25-28 25" stroke="${th.accent}" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`)}
      ${A(d + 0.9, 'right', 'card', `<div style="width:380px;height:440px;border-radius:44px;background:linear-gradient(#0a7a0a,#003d00);position:relative;box-shadow:0 40px 70px rgba(0,50,0,.45)"><div style="position:absolute;left:50%;top:50%;width:150px;height:150px;margin:-95px 0 0 -75px;border-radius:50%;background:rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center"><svg width="60" height="64" viewBox="0 0 60 64"><polygon points="8,4 56,32 8,60" fill="#fff"/></svg></div><div style="position:absolute;left:0;right:0;bottom:48px;text-align:center;font:600 24px var(--bf);letter-spacing:.14em;color:#C2EABD">${s.k2}</div></div>`)}
    </div>`;
  },

  chat(s, th, d) {
    const b = (m, i) => A(d + 0.2 + i * 0.5, 'up', 'tick', `<div style="display:flex;justify-content:${m.me ? 'flex-end' : 'flex-start'};margin-bottom:26px"><div style="max-width:700px;padding:30px 40px;border-radius:${m.me ? '44px 44px 12px 44px' : '44px 44px 44px 12px'};font:600 44px/1.2 var(--hf);${m.me ? 'background:#006400;color:#fff' : `background:${th.chip};border:2px solid ${th.border};box-shadow:${th.shadow}`}">${m.t}</div></div>`);
    return `<div style="position:absolute;left:72px;right:72px;top:${s.top || 660}px">${A(d, 'pop', 'tick', `<div style="display:inline-block;margin-bottom:34px;padding:12px 26px;border-radius:999px;background:${th.chip};border:2px solid ${th.border};font:600 26px var(--bf);letter-spacing:.06em">Contoh percakapan</div>`)}${s.msgs.map(b).join('')}</div>`;
  },

  venn(s, th, d) {
    const c = (x, txt, delay) => A(d + delay, 'pop', 'card', `<div style="position:absolute;${x}:0;top:0;width:520px;height:520px;border-radius:50%;background:${th.card};border:2px solid ${th.border};box-shadow:${th.shadow};display:flex;align-items:center;${x === 'left' ? 'justify-content:flex-start;padding-left:60px' : 'justify-content:flex-end;padding-right:60px'};"><div style="width:210px;font:700 40px/1.15 var(--hf);text-align:center">${txt}</div></div>`);
    return `<div style="position:absolute;left:72px;right:72px;top:${s.top || 740}px;height:520px">${c('left', s.a, 0)}${c('right', s.b, 0.3)}
      ${A(d + 0.9, 'pop', 'card', `<div style="position:absolute;left:50%;top:50%;width:230px;margin:-110px 0 0 -115px;height:220px;border-radius:50%;background:#006400;display:flex;align-items:center;justify-content:center;text-align:center;padding:0 20px;font:700 34px/1.15 var(--hf);color:#fff;box-shadow:0 30px 60px rgba(0,40,0,.4)">${s.mid}</div>`)}</div>`;
  },

  vs(s, th, d) {
    const col = (k, t, x, delay, dark) => A(d + delay, 'up', 'card', `<div style="position:absolute;${x}:0;top:0;width:430px;height:480px;border-radius:44px;padding:50px 40px;${dark ? 'background:#000;color:#F4FBF3;box-shadow:0 34px 70px rgba(0,0,0,.4)' : `background:${th.card};border:2px solid ${th.border};box-shadow:${th.shadow}`}"><div style="font:600 28px var(--bf);letter-spacing:.16em;${dark ? 'color:#C2EABD' : `color:${th.accent}`}">${k}</div><div style="font:700 56px/1.12 var(--hf);margin-top:26px">${t}</div></div>`);
    return `<div style="position:absolute;left:72px;right:72px;top:${s.top || 700}px;height:560px">${col(s.k1, s.t1, 'left', 0, false)}${col(s.k2, s.t2, 'right', 0.35, true)}
      ${A(d + 0.9, 'pop', 'card', `<div style="position:absolute;left:50%;top:50%;margin:-56px 0 0 -56px;width:112px;height:112px;border-radius:50%;background:#C2EABD;color:#006400;display:flex;align-items:center;justify-content:center;font:700 44px var(--hf);box-shadow:0 14px 30px rgba(0,60,0,.3)">vs</div>`)}</div>`;
  },

  store(s, th, d) {
    return `
      ${A(d, 'up', 'tick', `<img src="assets/logo_white.png" style="width:640px;display:block;margin:0 auto">`, 'position:absolute;left:0;right:0;top:170px')}
      ${A(d + 0.3, 'up', 'w', `${s.look ? STORE_LOOK[s.look] : s.mix ? `<div style="font:700 132px/1.02 'Inter Display';letter-spacing:-.04em;text-align:center;color:#fff">Rekam.<br><span style="font:italic 400 158px/0.95 'Instrument Serif';letter-spacing:-.01em">Kirim.</span><br><span style="display:inline-block;margin-top:10px;font:800 112px/1 'Bricolage';letter-spacing:-.04em;padding:0 .2em .08em;border-radius:.18em;background:#C2EABD;color:#003A00;transform:rotate(-2.5deg)">Kerja.</span></div>` : `<div style="font:700 150px/1.02 var(--hf);letter-spacing:-.04em;text-align:center;color:#fff">Rekam.<br>Kirim.<br><span style="color:#C2EABD">Kerja.</span></div>`}`, 'position:absolute;left:0;right:0;top:384px')}
      ${A(d + 0.9, 'fade', '', `<div style="font:500 42px/1.3 var(--bf);color:rgba(255,255,255,.9);text-align:center;padding:0 90px">${s.promo}</div>`, 'position:absolute;left:0;right:0;top:880px')}
      ${A(d + 1.3, 'pop', 'card', badgeGoogle(), 'position:absolute;left:64px;top:1070px')}
      ${A(d + 1.55, 'pop', 'card', badgeApple(), 'position:absolute;right:64px;top:1070px')}
      ${A(d + 1.9, 'up', 'chime', `<div style="display:inline-block;padding:20px 56px;border-radius:999px;background:rgba(255,255,255,.18);border:2px solid rgba(255,255,255,.4);font:600 44px var(--hf);color:#fff">gendaris.com</div>`, 'position:absolute;left:0;right:0;top:1235px;text-align:center')}`;
  },
};

function build(slide, idx, total) {
  const LK = LOOKS[process.env.LOOK || ''];
  if (LK) slide = Object.assign({}, slide, { theme: slide.g === 'store' ? 'green' : LK.theme, bg: slide.g === 'store' ? LK.storeBg : LK.bg });
  const TY = TYPES[slide.type || process.env.TYPE || 'mix'];
  const th = THEMES[slide.theme];
  const role = !TY.mix ? '' : idx === 1 ? 'cover' : (idx % 2 === 0 ? 'pill' : 'serif');
  const grp = LK ? LK.grp : role === 'cover' ? 'stk' : role === 'pill' ? 'pil' : '';
  const hl = slide.headline ? words(slide.headline, 0.3, 0.07, '', grp, LK && LK.wrap && slide.headline.replace(/\*[^*]+\*/g, '').split(' ').filter(Boolean).length <= 7 ? LK.wrap : '') : { html: '', end: 0.3 };
  const wrapOn = LK && LK.wrap && slide.headline && slide.headline.replace(/\*[^*]+\*/g, '').split(' ').filter(Boolean).length <= 7;
  const RS = LK ? (LK.wrap && !wrapOn ? Object.assign({}, LK, { sc: 0.98, lh: 1.08 }) : LK) : role === 'cover' ? { f: "'Instrument Serif'", w: 400, sc: 1.28, lh: 0.96, ls: '-.012em' } : null;
  const KCOL = LK ? LK.kc : slide.theme === 'light' ? 'rgba(0,100,0,.75)' : 'rgba(194,234,189,.8)';
  const kicker = (TY.mix || LK) && slide.k ? A(0.15, 'fade', '', `<div style="font:500 24px 'JetBrains Mono';letter-spacing:.16em;text-transform:uppercase;color:${KCOL}">${slide.k}</div>`, `position:absolute;left:74px;top:${(slide.ht || 200) - 52}px`) : '';
  const gd = Math.max(hl.end + 0.25, 0.6);
  const hs = slide.hs || 84;
  const isStore = slide.g === 'store';
  const head = isStore ? '' : `<div class="hl" style="position:absolute;left:72px;right:72px;top:${slide.ht || 200}px;font:${RS ? RS.w : 'var(--hw)'} ${Math.round(hs*TY.scale*(idx===1&&TY.cover?TY.cover:1)*(RS ? RS.sc : 1))}px/${RS ? RS.lh : 'var(--hlh)'} ${RS ? RS.f : 'var(--hf)'};letter-spacing:${RS ? RS.ls : 'var(--hls)'};color:${th.ink}">${hl.html}</div>`;
  const sub = slide.sub ? A(gd - 0.1, 'fade', '', slide.sub, `position:absolute;left:72px;right:72px;top:${slide.st || 640}px;font:500 38px/1.35 var(--bf);color:${th.sub}`) : '';
  const gfx = G[slide.g](Object.assign({ mix: !!TY.mix, look: process.env.LOOK || '' }, slide.d || {}), th, gd + (slide.sub ? 0.2 : 0));
  const logo = A(0.05, 'fade', '', `<img src="assets/${th.logo}" style="height:52px;display:block">`, 'position:absolute;left:72px;top:76px');
  const pill = A(0.1, 'fade', '', `<div style="font:500 26px var(--bf);letter-spacing:.04em;color:${th.ink};opacity:.45;font-variant-numeric:tabular-nums">${idx}/${total}</div>`, 'position:absolute;right:72px;top:86px');
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  *{box-sizing:border-box;margin:0;padding:0}
  html,body{width:${W}px;height:${H}px;overflow:hidden;background:#000;-webkit-font-smoothing:antialiased}
  body{position:relative;font-family:var(--bf);color:${th.ink}}
  #bg{position:absolute;left:0;top:0;width:${W}px;height:${H}px;filter:blur(6px);transform:scale(1.03)}
  #grain{position:absolute;inset:0;background:url(assets/grain.png);opacity:${slide.theme === 'light' ? .045 : .07};mix-blend-mode:overlay;pointer-events:none}
  .a{opacity:0;will-change:transform,opacity}
  .w{display:inline-block}
  .ac{color:${th.accent};${TY.acc||''}${role === 'serif' ? "font-family:'Instrument Serif';font-style:italic;font-weight:400;font-size:1.2em;letter-spacing:-.01em;" : ''}}
  .stk{display:inline-block;font-family:'Bricolage';font-weight:800;font-size:.86em;letter-spacing:-.035em;padding:.02em .24em .1em;border-radius:.2em;transform:rotate(-2.5deg);background:${slide.theme === 'light' ? '#006400' : '#C2EABD'};color:${slide.theme === 'light' ? '#F4FBF3' : '#003A00'};box-shadow:0 10px 30px rgba(0,40,0,.25)}
  .pil{display:inline-block;border:3px solid ${th.accent};border-radius:999px;padding:0 .32em .04em;line-height:1.08}
  .hft{display:inline-block;font-family:'Silkscreen';font-weight:700;font-size:.8em;letter-spacing:-.03em;transform:rotate(-3deg);color:#F2FFE8;filter:drop-shadow(6px 6px 0 #003A00) drop-shadow(0 16px 30px rgba(0,30,0,.4));padding:.06em .06em;font-size:.86em}
  .pw{display:inline-block;border:3px solid rgba(255,255,255,.92);border-radius:999px;padding:.0em .3em .06em;line-height:1.06}
  .scr{display:inline-block;position:relative;z-index:2;font-family:'Instrument Serif';font-style:italic;font-weight:400;font-size:1.62em;letter-spacing:-.02em;line-height:.8;color:#D9F5C2;transform:rotate(-4deg);margin:.04em .02em;color:#E4F8B8;text-shadow:0 8px 28px rgba(0,20,0,.5)}
  ${process.env.LOOK === 'dots' ? `.ac{font-family:'Instrument Serif';font-style:italic;font-weight:400;font-size:1.24em;letter-spacing:-.01em}` : ''}
  ${process.env.LOOK === 'jay' ? `.hl{text-shadow:0 6px 34px rgba(0,30,0,.35)}` : ''}
  #dots{position:absolute;inset:0;background-image:radial-gradient(${slide.theme === 'light' ? 'rgba(0,60,0,.24)' : 'rgba(255,255,255,.13)'} 1.7px,transparent 2px);background-size:30px 30px;pointer-events:none}
  @font-face{font-family:'Silkscreen';font-weight:700;src:url(assets/fonts/silkscreen-latin-700-normal.woff2) format("woff2")}
  @font-face{font-family:'Fraunces';font-weight:700;src:url(assets/fonts/fraunces-latin-700-normal.woff2) format("woff2")}
  @font-face{font-family:'Fraunces';font-weight:600;src:url(assets/fonts/fraunces-latin-600-normal.woff2) format("woff2")}
  :root{--hf:${TY.hf};--hw:${TY.hw};--hlh:${TY.lh};--hls:${TY.ls};--bf:${TY.bf}}
  ${FONTFACE}
  .card{background:${th.card};border:1px solid ${th.border};box-shadow:${th.shadow};backdrop-filter:blur(30px) saturate(140%);-webkit-backdrop-filter:blur(30px) saturate(140%)}
  </style></head><body><canvas id="bg" width="270" height="338"></canvas><div id="grain"></div>${process.env.LOOK === 'dots' ? '<div id="dots"></div>' : ''}${logo}${pill}${kicker}${head}${sub}${gfx}
  <script>
  const T=${T};
  const ease=x=>{x=Math.min(1,Math.max(0,x));return 1-Math.pow(1-x,3)};
  const easeIn=x=>{x=Math.min(1,Math.max(0,x));return x*x*x};
  const els=[...document.querySelectorAll('.a')];
  const bg=document.getElementById('bg');const cx=bg.getContext('2d');
  const BGD=${JSON.stringify(BG[slide.bg])};
  const drawBg=t=>{const w=270,h=338;const a=BGD.ang*Math.PI/180;const g=cx.createLinearGradient(w/2-Math.sin(a)*w/2,h/2+Math.cos(a)*h/2*-1,w/2+Math.sin(a)*w/2,h/2+Math.cos(a)*h/2);
    g.addColorStop(0,BGD.base[0]);g.addColorStop(1,BGD.base[1]);cx.globalAlpha=1;cx.fillStyle=g;cx.fillRect(0,0,w,h);
    BGD.blobs.forEach((b,i)=>{const [c,al,x,y,r]=b;const ph=i*1.7;const px=(x+0.035*Math.sin(t*0.55+ph))*w,py=(y+0.03*Math.cos(t*0.45+ph))*h,rr=r*Math.max(w,h)*(1+0.03*Math.sin(t*0.4+ph));
      const rg=cx.createRadialGradient(px,py,0,px,py,rr);const hex=c.replace('#','');const R=parseInt(hex.slice(0,2),16),G=parseInt(hex.slice(2,4),16),B=parseInt(hex.slice(4,6),16);
      for(let s=0;s<=6;s++){const q=s/6;const f=Math.pow(1-q,2.2);rg.addColorStop(q,'rgba('+R+','+G+','+B+','+(al*f)+')');}
      cx.fillStyle=rg;cx.fillRect(0,0,w,h);});};
  window.events=els.filter(e=>e.dataset.s).map(e=>({t:+e.dataset.d,s:e.dataset.s}));
  window.setT=t=>{
    drawBg(t);
    els.forEach((e,i)=>{
      const d=+e.dataset.d,k=e.dataset.k;
      const pi=ease((t-d)/0.7);
      const os=T-0.62+(i/els.length)*0.16;
      const po=easeIn((t-os)/0.34);
      const o=pi*(1-po);
      e.style.opacity=o;
      let tr='',f='';
      const bl=(1-pi)*7+po*7;
      if(k==='up'){tr='translateY('+((1-pi)*44-po*26)+'px)';f='blur('+bl+'px)';}
      else if(k==='pop'){tr='translateY('+((1-pi)*24+po*10)+'px) scale('+(0.92+0.08*pi-0.05*po)+')';f='blur('+bl+'px)';}
      else if(k==='left'){tr='translateX('+(-(1-pi)*70-po*30)+'px)';f='blur('+bl+'px)';}
      else if(k==='right'){tr='translateX('+((1-pi)*70+po*30)+'px)';f='blur('+bl+'px)';}
      else if(k==='wipe'){e.style.clipPath='inset(0 '+(100-100*pi)+'% 0 0)';e.style.opacity=1-po;}
      else if(k==='fade'){f='blur('+bl*0.4+'px)';}
      e.style.transform=tr;e.style.filter=f;
    });
  };
  window.setT(0);
  </script></body></html>`;
}

module.exports = { build, W, H, T };
