import { base, number, metric, finding, report, round } from './validation.js';
export function validate(s) {
  base(s, [
    'speedMps',
    'reactionMs',
    'reactionUncertaintyMs',
    'decelerationMps2',
    'decelerationUncertaintyPct',
    'marginM',
    'availableM',
  ]);
  number(s.speedMps, 'speedMps', 0, 10);
  number(s.reactionMs, 'reactionMs', 0, 10000);
  number(s.reactionUncertaintyMs, 'reactionUncertaintyMs', 0, 10000);
  number(s.decelerationMps2, 'decelerationMps2', 0.01, 20);
  number(s.decelerationUncertaintyPct, 'decelerationUncertaintyPct', 0, 95);
  number(s.marginM, 'marginM', 0, 20);
  number(s.availableM, 'availableM', 0, 1000);
  return s;
}
export function stoppingDistance(speedMps, reactionS, decelerationMps2, marginM = 0) {
  return speedMps * reactionS + speedMps ** 2 / (2 * decelerationMps2) + marginM;
}
/** Positive quadratic root in a rationalized form, including zero usable distance. */
export function modelSpeedLimit(usableM, reactionS, decelerationMps2) {
  if (usableM <= 0) return 0;
  return (
    (2 * decelerationMps2 * usableM) /
    (Math.sqrt((decelerationMps2 * reactionS) ** 2 + 2 * decelerationMps2 * usableM) +
      decelerationMps2 * reactionS)
  );
}
export function run(s) {
  validate(s);
  const reactionS = s.reactionMs / 1000,
    worstReactionS = (s.reactionMs + s.reactionUncertaintyMs) / 1000,
    worstDeceleration = s.decelerationMps2 * (1 - s.decelerationUncertaintyPct / 100);
  const nominalM = stoppingDistance(s.speedMps, reactionS, s.decelerationMps2, s.marginM),
    worstM = stoppingDistance(s.speedMps, worstReactionS, worstDeceleration, s.marginM),
    remainingM = s.availableM - worstM;
  const maximumSpeed = modelSpeedLimit(s.availableM - s.marginM, worstReactionS, worstDeceleration),
    findings = [];
  if (remainingM < 0)
    findings.push(
      finding(
        'error',
        'DISTANCE_DEFICIT',
        'The supplied distance is shorter than the upper modeled envelope.',
        'A distância informada é menor que o envoltório superior do modelo.',
      ),
    );
  const records = Array.from({ length: 41 }, (_, i) => {
    const v = (i / 40) * 10;
    return {
      speedMps: round(v),
      nominalM: round(stoppingDistance(v, reactionS, s.decelerationMps2, s.marginM)),
      upperM: round(stoppingDistance(v, worstReactionS, worstDeceleration, s.marginM)),
    };
  });
  return report(
    s,
    'go2-pro-stop-envelope',
    [
      metric('nominalM', 'Nominal envelope', 'Envoltório nominal', round(nominalM), 'm'),
      metric('upperM', 'Upper envelope', 'Envoltório superior', round(worstM), 'm'),
      metric('remainingM', 'Distance margin', 'Margem de distância', round(remainingM), 'm'),
      metric(
        'modelSpeedMps',
        'Model speed bound',
        'Limite de velocidade do modelo',
        round(maximumSpeed),
        'm/s',
      ),
    ],
    findings,
    records,
    {
      selectedSpeedMps: s.speedMps,
      availableM: s.availableM,
      components: {
        reactionM: round(s.speedMps * worstReactionS),
        brakingM: round(s.speedMps ** 2 / (2 * worstDeceleration)),
        marginM: s.marginM,
      },
      worstReactionS,
      worstDecelerationMps2: round(worstDeceleration),
      nominalStopTimeS: round(reactionS + s.speedMps / s.decelerationMps2),
      upperStopTimeS: round(worstReactionS + s.speedMps / worstDeceleration),
    },
  );
}
