'use strict';
/* =====================================================================
   SHARE — imagem de resumo do mandato para compartilhar (formato retrato
   1080×1350, o mesmo do feed do Instagram) com botão de compartilhar.
   Desenha tudo em <canvas>; não usa bibliotecas nem imagens externas.
   Depende de game.js: S, IND, LBL, DIFF, fmt, show, toast, adv,
   mandateScore, mandateScoreLabel.
   ===================================================================== */
const SHARE_W = 1080, SHARE_H = 1350;
let shareBlob = null, shareUrl = null;

/* Texto que acompanha a imagem (e o link do jogo, quando estiver publicado). */
function shareText() {
  const sc = mandateScore();
  const link = /^https?:/.test(location.href) ? ' ' + location.href.split('#')[0] : '';
  return `Governei Sertânia por 4 anos e fechei o mandato com nota ${sc.toFixed(1)}/10 (${mandateScoreLabel(sc)}) no Desafio de Gestão. Consegue fazer melhor?${link}`;
}

const shareMoney = v => (v < 0 ? '−' : '') + 'R$ ' + (Math.abs(v) / 1000).toFixed(1).replace('.', ',') + ' mi';

/* Desenha o resumo e devolve o <canvas>. */
function buildShareCanvas() {
  const cv = document.createElement('canvas'); cv.width = SHARE_W; cv.height = SHARE_H;
  const c = cv.getContext('2d'), W = SHARE_W, H = SHARE_H;
  const score = mandateScore(), label = mandateScoreLabel(score);
  const col = score >= 7 ? '#2f8a5f' : score >= 5 ? '#c8902f' : '#b23a2e';
  const serif = 'Georgia, "Times New Roman", serif', sans = '"Segoe UI", system-ui, -apple-system, sans-serif';
  const spacing = px => { if ('letterSpacing' in c) c.letterSpacing = px + 'px'; };
  /* texto; se max for informado, reduz a fonte até caber */
  const txt = (t, x, y, size, color, o) => {
    o = o || {}; let s = size;
    const set = () => { c.font = `${o.i ? 'italic ' : ''}${o.w || 'normal'} ${s}px ${o.f || sans}`; };
    set(); if (o.max) while (c.measureText(t).width > o.max && s > 12) { s -= 1; set(); }
    c.fillStyle = color; c.textAlign = o.a || 'center'; c.textBaseline = 'alphabetic'; c.fillText(t, x, y);
  };
  const box = (x, y, w, h, r, fill) => { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); c.fillStyle = fill; c.fill(); };

  /* fundo e cabeçalho */
  c.fillStyle = '#f1e6cb'; c.fillRect(0, 0, W, H);
  const g = c.createLinearGradient(0, 0, 0, 360); g.addColorStop(0, '#1f5d43'); g.addColorStop(1, '#2f8a5f');
  c.fillStyle = g; c.fillRect(0, 0, W, 360);
  c.fillStyle = '#f7c85a'; c.beginPath(); c.arc(930, 95, 46, 0, Math.PI * 2); c.fill();
  c.fillStyle = '#b98a4a'; c.beginPath(); c.moveTo(0, 360); c.lineTo(0, 312); c.lineTo(200, 286); c.lineTo(420, 326); c.lineTo(650, 282); c.lineTo(880, 322); c.lineTo(1080, 292); c.lineTo(1080, 360); c.closePath(); c.fill();
  spacing(8); txt('FIM DO MANDATO', W / 2, 70, 26, 'rgba(255,255,255,.75)', { w: 'bold' });
  spacing(4); txt('SERTÂNIA', W / 2, 190, 118, '#ffffff', { f: serif, w: 'bold' });
  spacing(10); txt('DESAFIO DE GESTÃO', W / 2, 238, 30, '#ffffff', { w: 'bold' }); spacing(0);

  /* nota */
  const cx = W / 2, cy = 500, R = 135;
  c.beginPath(); c.arc(cx, cy, R + 14, 0, Math.PI * 2); c.fillStyle = '#fbf6e8'; c.fill();
  c.lineWidth = 20; c.lineCap = 'round';
  c.beginPath(); c.arc(cx, cy, R, 0, Math.PI * 2); c.strokeStyle = '#e4d3aa'; c.stroke();
  c.beginPath(); c.arc(cx, cy, R, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * Math.max(.02, score / 10)); c.strokeStyle = col; c.stroke();
  txt(score.toFixed(1), cx, cy + 36, 112, '#2a2118', { f: serif, w: 'bold' });
  txt('/10', cx, cy + 82, 32, '#6d5d47');
  txt(label, cx, 700, 54, col, { f: serif, w: 'bold', max: 900 });
  txt(`Governei Sertânia por 4 anos · Dificuldade ${DIFF[S.diff] ? DIFF[S.diff].n : ''}`, cx, 745, 27, '#5b3e29', { max: 940 });
  txt(`Conselheiro: ${adv().n}`, cx, 782, 25, '#6d5d47', { max: 940 });

  /* indicadores em duas colunas */
  box(60, 810, 960, 310, 24, '#fbf6e8');
  const order = IND.filter(x => x[0] !== 'p').concat(IND.filter(x => x[0] === 'p'));
  order.forEach((x, i) => {
    const left = i < 5, row = left ? i : i - 5, X = left ? 100 : 570, Y = 858 + row * 56, w = 410;
    const v = Math.round(S.ind[x[0]] || 0);
    txt(`${x[2]} ${x[1]}`, X, Y, 24, '#2a2118', { a: 'left', max: 320 });
    txt(x[0] === 'p' ? v + '%' : String(v), X + w, Y, 24, '#2a2118', { a: 'right', w: 'bold' });
    box(X, Y + 12, w, 14, 7, '#e4d3aa');
    if (v > 0) box(X, Y + 12, Math.max(14, w * v / 100), 14, 7, v < 35 ? '#b23a2e' : v < 60 ? '#c8902f' : '#2f8a5f');
  });

  /* números do mandato */
  const delivered = (S.projects || []).filter(p => p.st === 'entregue').length;
  const stats = [['ORÇAMENTO FINAL', shareMoney(S.b)], ['DECISÕES', String(S.dec)], ['CRISES', String(S.crises)], ['OBRAS ENTREGUES', String(delivered)]];
  stats.forEach((s, i) => {
    const X = 60 + i * 245;
    box(X, 1145, 225, 112, 18, '#ffffff');
    txt(s[1], X + 112, 1202, 38, '#1f5d43', { f: serif, w: 'bold', max: 200 });
    txt(s[0], X + 112, 1238, 15, '#6d5d47', { w: 'bold', max: 200 });
  });

  /* rodapé */
  txt('Administrar uma cidade é decidir o que fazer quando não dá para fazer tudo.', W / 2, 1296, 24, '#5b3e29', { i: true, max: 940 });
  const host = /^https?:/.test(location.href) ? ' · ' + location.host : '';
  txt('Simulação educativa fictícia' + host, W / 2, 1330, 18, '#8a7a62', { max: 940 });
  return cv;
}

const shareCanvasToBlob = cv => new Promise(res => cv.toBlob(b => res(b), 'image/png'));

/* Baixa a imagem (funciona em qualquer navegador). */
function downloadShareImage() {
  if (!shareUrl) return;
  const a = document.createElement('a'); a.href = shareUrl; a.download = 'sertania-meu-mandato.png';
  document.body.appendChild(a); a.click(); a.remove();
  toast('g', 'IMAGEM SALVA', 'A imagem foi baixada. É só postar onde quiser.');
}

/* Compartilha pelo menu do celular (Instagram, WhatsApp...). Sem suporte, baixa a imagem. */
async function shareResult() {
  if (!shareBlob) return;
  try {
    const file = new File([shareBlob], 'sertania-meu-mandato.png', { type: 'image/png' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], title: 'Sertânia: Desafio de Gestão', text: shareText() });
      return;
    }
  } catch (e) { if (e && e.name === 'AbortError') return; }
  downloadShareImage();
}

/* Abre a prévia com os botões Compartilhar / Baixar / Fechar. */
async function openSharePreview() {
  const blob = await shareCanvasToBlob(buildShareCanvas());
  if (!blob) { toast('r', 'ERRO', 'Não foi possível gerar a imagem neste navegador.'); return; }
  if (shareUrl) URL.revokeObjectURL(shareUrl);
  shareBlob = blob; shareUrl = URL.createObjectURL(blob);
  show(`<h3>Seu resumo do mandato</h3>
    <img class="share-img" src="${shareUrl}" alt="Resumo do mandato em Sertânia: nota, indicadores e números do governo">
    <div class="btns" style="justify-content:center">
      <button class="btn main" id="shShare">📤 COMPARTILHAR</button>
      <button class="btn" id="shDown">⬇️ BAIXAR IMAGEM</button>
      <button class="btn ghost" id="shClose">Fechar</button>
    </div>`, 0);
  $('#shShare').onclick = shareResult; $('#shDown').onclick = downloadShareImage; $('#shClose').onclick = closeModal;
}
