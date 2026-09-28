// Limiti sugli input numerici: valori fuori scala tornano nel range invece di rompere la grafica.
(function(){function c(e,full){var i=e.target;if(!i||i.type!=='number'&&i.type!=='range')return;var v=parseFloat(i.value),lo=parseFloat(i.min),hi=parseFloat(i.max);if(isNaN(v)){if(full&&!isNaN(lo))i.value=lo;return}if(!isNaN(hi)&&v>hi)i.value=hi;else if(full&&!isNaN(lo)&&v<lo)i.value=lo}document.addEventListener('input',function(e){c(e,false)},true);document.addEventListener('change',function(e){c(e,true)},true);document.addEventListener('focusout',function(e){var i=e.target;if(i&&i.type==='number'){c(e,true);i.dispatchEvent(new Event('input',{bubbles:true}))}},true)})();
(() => {
  const G = window.GABBIE, $ = s => document.querySelector(s);
  const svg = $('#disegno'), lista = $('#lista'), q = $('#q'), qta = $('#qta');
  const fmt = n => n == null ? '—' : String(n).replace('.', ',');
  const num = s => parseFloat(String(s).replace(',', '.'));
  let mat = '', sel = G.find(g => g.c.includes('6204')) || G[0];

  function serie(g) { const m = g.c.match(/\((\d+)\)/); return m ? m[1] : ''; }

  function disegna(g) {
    const de = g.de || 50, di = g.di || de * .82, cs = g.cs || (de + di) / 2, ds = g.ds || (de - di) * 1.1;
    const R = 150, k = R / (de / 2), cx = 200, cy = 175;
    const ro = de / 2 * k, ri = di / 2 * k, rc = cs / 2 * k, rb = Math.min(ds / 2 * k, (ro - ri) * 1.6, rc * Math.sin(Math.PI / g.ns) * .92);
    let tasche = '';
    for (let i = 0; i < g.ns; i++) {
      const a = -Math.PI / 2 + i * 2 * Math.PI / g.ns;
      tasche += `<circle cx="${(cx + rc * Math.cos(a)).toFixed(1)}" cy="${(cy + rc * Math.sin(a)).toFixed(1)}" r="${rb.toFixed(1)}"/>`;
    }
    const a0 = -Math.PI / 2;
    const h = g.h ? g.h * k : ro * .12, yb = 392;
    const nyl = g.m === 'Nylon 66' ? ' nylon' : '', hh = Math.max(h, 10);
    let tacche = '';
    for (let i = 0; i < g.ns; i++) {
      const a = -Math.PI / 2 + i * 2 * Math.PI / g.ns, y = Math.sin(a);
      if (y > 0) tacche += `<circle cx="${(cx + rc * Math.cos(a)).toFixed(1)}" cy="${yb}" r="${Math.min(rb * .9, hh * .75).toFixed(1)}"/>`;
    }
    svg.innerHTML = `<title id="dis-t">Gabbia ${g.c}: ${g.ns} alveoli, diametro esterno ${fmt(g.de)} mm</title>
      <defs><clipPath id="anello"><path clip-rule="evenodd" d="M${cx - ro},${cy}a${ro},${ro} 0 1,0 ${2 * ro},0a${ro},${ro} 0 1,0 ${-2 * ro},0ZM${cx - ri},${cy}a${ri},${ri} 0 1,0 ${2 * ri},0a${ri},${ri} 0 1,0 ${-2 * ri},0Z"/></clipPath>
      <mask id="corona"><rect width="400" height="470" fill="#fff"/><g fill="#000">${tacche}</g></mask></defs>
      <g class="asse"><line x1="${cx - ro - 22}" y1="${cy}" x2="${cx + ro + 22}" y2="${cy}"/><line x1="${cx}" y1="${cy - ro - 22}" x2="${cx}" y2="${cy + ro + 12}"/></g>
      <path class="corpo${nyl}" fill-rule="evenodd" d="M${cx - ro},${cy}a${ro},${ro} 0 1,0 ${2 * ro},0a${ro},${ro} 0 1,0 ${-2 * ro},0ZM${cx - ri},${cy}a${ri},${ri} 0 1,0 ${2 * ri},0a${ri},${ri} 0 1,0 ${-2 * ri},0Z"/>
      <g class="tasca${nyl}" clip-path="url(#anello)">${tasche}</g>
      <circle class="centro" cx="${cx}" cy="${cy}" r="${rc}"/>
      <circle class="sfera" cx="${(cx + rc * Math.cos(a0)).toFixed(1)}" cy="${(cy + rc * Math.sin(a0)).toFixed(1)}" r="${(rb * .95).toFixed(1)}"/>
      <g class="quota"><line x1="${cx - ro}" y1="${yb - 34}" x2="${cx + ro}" y2="${yb - 34}"/><line x1="${cx - ro}" y1="${yb - 42}" x2="${cx - ro}" y2="${yb - 26}"/><line x1="${cx + ro}" y1="${yb - 42}" x2="${cx + ro}" y2="${yb - 26}"/>
      <text x="${cx}" y="${yb - 40}">Ø ${fmt(g.de)}</text></g>
      <rect class="corpo${nyl}" x="${cx - ro}" y="${yb}" width="${2 * ro}" height="${hh}" mask="url(#corona)"/>
      <g class="quota"><line x1="${cx + ro + 12}" y1="${yb}" x2="${cx + ro + 12}" y2="${yb + hh}"/><text x="${cx + ro + 18}" y="${yb + hh / 2 + 6}" text-anchor="start">${fmt(g.h)}</text></g>`;
    $('#sel-codice').innerHTML = `<b>${g.c}</b> ${g.m ? g.m : 'materiale su richiesta'}${g.m === 'Acetalica' ? ' (H2320 Basf)' : g.m === 'Nylon 66' ? ' (A3K Basf)' : ''}`;
    $('#quote').innerHTML = [['Ø esterno', fmt(g.de) + ' mm'], ['Ø interno', fmt(g.di) + ' mm'], ['Centro sfera', fmt(g.cs) + ' mm'], ['Altezza', fmt(g.h) + ' mm'], ['Sfere', g.ns + ' × Ø ' + fmt(g.ds) + (g.pol ? ` (${g.pol})` : '')]]
      .map(([t, v]) => `<div><dt>${t}</dt><dd>${v}</dd></div>`).join('');
    link();
  }

  function link() {
    const g = sel, s = serie(g);
    const body = `Buongiorno,\nvorrei un preventivo per:\n\nGabbia ${g.c}${s ? ` (cuscinetto serie ${s})` : ''}\nMateriale: ${g.m || 'da definire'}\nQuantità: ${qta.value || '—'} pezzi\n\nAzienda:\nReferente:\nTelefono:\n`;
    $('#prev-link').href = `mailto:info@caldart.it?subject=${encodeURIComponent('Richiesta preventivo gabbia ' + g.c)}&body=${encodeURIComponent(body)}`;
  }

  function filtra() {
    const t = q.value.trim().toLowerCase(), n = num(t);
    const r = G.filter(g => (!mat || g.m === mat) && (!t || g.c.toLowerCase().includes(t) || (!isNaN(n) && g.de && Math.abs(g.de - n) <= Math.max(1, n * .03))));
    lista.innerHTML = r.map(g => `<li role="option" tabindex="0" aria-selected="${g === sel}" data-i="${G.indexOf(g)}"><b>${g.c}</b><span>${fmt(g.de)} × ${fmt(g.di)} × ${fmt(g.h)}</span><span class="m">${g.m === 'Nylon 66' ? 'PA66' : g.m ? 'POM' : '—'}</span><span class="s">${g.ns} sfere</span></li>`).join('');
    $('#conta').textContent = r.length === G.length ? `${G.length} gabbie a catalogo` : `${r.length} di ${G.length} gabbie`;
    $('#vuoto').hidden = r.length > 0;
    if (r.length && t && !r.includes(sel)) scegli(r[0], false);
  }

  function scegli(g, scroll) {
    sel = g; disegna(g);
    lista.querySelectorAll('li').forEach(li => li.setAttribute('aria-selected', G[li.dataset.i] === g));
    if (scroll && innerWidth < 900) $('.tavola').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  }

  lista.addEventListener('click', e => { const li = e.target.closest('li'); if (li) scegli(G[li.dataset.i], true); });
  lista.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.dataset.i) { e.preventDefault(); scegli(G[e.target.dataset.i], true); } });
  q.addEventListener('input', filtra);
  qta.addEventListener('input', link);
  document.querySelectorAll('.filtri button').forEach(b => b.addEventListener('click', () => {
    mat = b.dataset.m; document.querySelectorAll('.filtri button').forEach(x => x.setAttribute('aria-pressed', x === b)); filtra();
  }));
  $('#prev').addEventListener('submit', e => e.preventDefault());
  disegna(sel); filtra();
})();
