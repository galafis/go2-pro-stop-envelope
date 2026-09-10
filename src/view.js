import { svg, label, esc, fmt, text } from './ui.js';
export const interpretation = {
  en: 'This is a constant-deceleration teaching model, not a measured Go2 PRO braking specification or a safety controller. Reaction, deceleration and uncertainty must be established independently for a controlled experiment. Surface, gait, slope and actuator dynamics are not represented.',
  pt: 'Este é um modelo didático de desaceleração constante, não uma especificação medida de frenagem do Go2 PRO nem um controlador de segurança. Reação, desaceleração e incerteza exigem avaliação própria em um experimento controlado. Superfície, marcha, inclinação e dinâmica dos atuadores não são representadas.',
};
export const cursorMax = (r) => r.records.length - 1;
export function render(r, lang, cursor) {
  const max = Math.max(1, r.records.at(-1).upperM, r.availableM),
    x = (v) => 65 + (v / 10) * 650,
    y = (d) => 255 - (d / max) * 205;
  let c = label(
    20,
    24,
    text(
      'Envelope distance (m) against speed (m/s)',
      'Distância do envoltório (m) por velocidade (m/s)',
      lang,
    ),
  );
  for (const [key, color] of [
    ['nominalM', '#2367a1'],
    ['upperM', '#a34465'],
  ])
    c += `<polyline points="${r.records.map((v) => `${x(v.speedMps)},${y(v[key])}`).join(' ')}" fill="none" stroke="${color}" stroke-width="3"/>`;
  c += `<line x1="65" x2="715" y1="${y(r.availableM)}" y2="${y(r.availableM)}" stroke="#966013" stroke-dasharray="5 5"/>`;
  const p = r.records[cursor];
  c += `<circle cx="${x(p.speedMps)}" cy="${y(p.upperM)}" r="6" fill="#a34465"/><line x1="${x(r.selectedSpeedMps)}" x2="${x(r.selectedSpeedMps)}" y1="45" y2="255" stroke="#64748b" stroke-dasharray="3 5"/>`;
  c +=
    label(65, 278, '0') +
    label(715, 278, '10 m/s', 'text-anchor="end"') +
    label(65, 43, fmt(max, lang) + ' m');
  return (
    svg(
      c,
      text(
        'Nominal and upper stopping envelopes',
        'Envoltórios de parada nominal e superior',
        lang,
      ),
    ) +
    `<p class="visual-note">${esc(text('Blue: nominal. Rose: upper case. Dashed horizontal: available distance.', 'Azul: nominal. Rosa: caso superior. Tracejado horizontal: distância disponível.', lang))}<br>${fmt(p.speedMps, lang)} m/s → ${fmt(p.upperM, lang)} m. ${esc(text('Cursor explores the sweep; it does not change the selected scenario speed.', 'O cursor explora a varredura; não altera a velocidade do cenário.', lang))}</p>`
  );
}
