# Worked experiments · Experimentos comentados

[README](../README.md)

## English

The exact-boundary example uses 2 m/s, 0.5 s reaction delay, 2 m/s² deceleration and a 0.25 m margin. Reaction travel is 1 m, braking travel is 1 m and the envelope totals 2.25 m. Supplying exactly 2.25 m leaves zero modeled margin. Reducing available distance to 1 m preserves a −1.25 m deficit.

For each experiment below, run the command and compare the JSON with the committed expected report. Change one assumption at a time; keep the original input as a separate file. Status is an interpretation of this model, not physical approval.

## Português

O exemplo de limite exato usa 2 m/s, atraso de reação de 0,5 s, desaceleração de 2 m/s² e margem de 0,25 m. O deslocamento na reação é 1 m, a frenagem é 1 m e o envoltório totaliza 2,25 m. Informar exatamente 2,25 m deixa margem zero no modelo. Reduzir a distância disponível para 1 m preserva déficit de −1,25 m.

Em cada experimento abaixo, execute o comando e compare o JSON com o relatório esperado versionado. Altere uma hipótese por vez e preserve a entrada original em arquivo separado. O estado é uma interpretação deste modelo, não aprovação física.

## Baseline assumptions · Hipóteses de referência

```sh
node scripts/analyze.mjs examples/nominal.json experiment.report.json
```

[Input / Entrada](../examples/nominal.json) · [Expected / Esperado](../examples/nominal.report.json) · `complete`

| Metric · Métrica                                   | Expected value · Valor esperado |
| -------------------------------------------------- | ------------------------------- |
| Nominal envelope / Envoltório nominal              | 0.95 m                          |
| Upper envelope / Envoltório superior               | 1.175 m                         |
| Distance margin / Margem de distância              | 0.825 m                         |
| Model speed bound / Limite de velocidade do modelo | 1.44 m/s                        |

## Longer response delay · Maior atraso de resposta

```sh
node scripts/analyze.mjs examples/latency.json experiment.report.json
```

[Input / Entrada](../examples/latency.json) · [Expected / Esperado](../examples/latency.report.json) · `review-required`

| Metric · Métrica                                   | Expected value · Valor esperado |
| -------------------------------------------------- | ------------------------------- |
| Nominal envelope / Envoltório nominal              | 0.95 m                          |
| Upper envelope / Envoltório superior               | 2.075 m                         |
| Distance margin / Margem de distância              | -0.075 m                        |
| Model speed bound / Limite de velocidade do modelo | 0.969772 m/s                    |

- `DISTANCE_DEFICIT`: The supplied distance is shorter than the upper modeled envelope. / A distância informada é menor que o envoltório superior do modelo.

## Distance deficit · Déficit de distância

```sh
node scripts/analyze.mjs examples/deficit.json experiment.report.json
```

[Input / Entrada](../examples/deficit.json) · [Expected / Esperado](../examples/deficit.report.json) · `review-required`

| Metric · Métrica                                   | Expected value · Valor esperado |
| -------------------------------------------------- | ------------------------------- |
| Nominal envelope / Envoltório nominal              | 2.7 m                           |
| Upper envelope / Envoltório superior               | 3.4 m                           |
| Distance margin / Margem de distância              | -2.4 m                          |
| Model speed bound / Limite de velocidade do modelo | 0.885504 m/s                    |

- `DISTANCE_DEFICIT`: The supplied distance is shorter than the upper modeled envelope. / A distância informada é menor que o envoltório superior do modelo.

## Zero initial speed · Velocidade inicial zero

```sh
node scripts/analyze.mjs examples/stationary.json experiment.report.json
```

[Input / Entrada](../examples/stationary.json) · [Expected / Esperado](../examples/stationary.report.json) · `complete`

| Metric · Métrica                                   | Expected value · Valor esperado |
| -------------------------------------------------- | ------------------------------- |
| Nominal envelope / Envoltório nominal              | 0.2 m                           |
| Upper envelope / Envoltório superior               | 0.2 m                           |
| Distance margin / Margem de distância              | 1.8 m                           |
| Model speed bound / Limite de velocidade do modelo | 1.44 m/s                        |

## Exact analytical boundary · Limite analítico exato

```sh
node scripts/analyze.mjs examples/exact.json experiment.report.json
```

[Input / Entrada](../examples/exact.json) · [Expected / Esperado](../examples/exact.report.json) · `complete`

| Metric · Métrica                                   | Expected value · Valor esperado |
| -------------------------------------------------- | ------------------------------- |
| Nominal envelope / Envoltório nominal              | 2.25 m                          |
| Upper envelope / Envoltório superior               | 2.25 m                          |
| Distance margin / Margem de distância              | 0 m                             |
| Model speed bound / Limite de velocidade do modelo | 2 m/s                           |
