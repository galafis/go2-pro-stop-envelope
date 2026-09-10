# Data contract · Contrato de dados

[README](../README.md) · [JSON Schema](../schemas/scenario.schema.json)

## Envelope

| Field · Campo   | Contract · Contrato                                                                                                                                                           |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `schemaVersion` | Exactly 1 / Exatamente 1                                                                                                                                                      |
| `scenarioId`    | 1–64 lowercase letters, digits, dashes or underscores; first character alphanumeric / 1–64 letras minúsculas, dígitos, hífens ou sublinhados; primeiro caractere alfanumérico |
| `source`        | `synthetic` or `manual`; manual is not verified measurement provenance / `synthetic` ou `manual`; manual não comprova origem medida                                           |

## Domain fields · Campos do domínio

| Field · Campo                | English                                                                                       | Português                                                                                             |
| ---------------------------- | --------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `speedMps`                   | Selected initial speed, 0–10 m/s; the sweep range is a software limit, not a platform rating. | Velocidade inicial selecionada, 0–10 m/s; a faixa é limite do software, não capacidade da plataforma. |
| `reactionMs`                 | Nominal response delay in milliseconds, including whatever stages the experiment defines.     | Atraso nominal de resposta em milissegundos, incluindo as etapas definidas pelo experimento.          |
| `reactionUncertaintyMs`      | Additional delay in the deterministic upper scenario.                                         | Atraso adicional no cenário superior determinístico.                                                  |
| `decelerationMps2`           | Positive assumed constant deceleration, 0.01–20 m/s².                                         | Desaceleração constante positiva assumida, 0,01–20 m/s².                                              |
| `decelerationUncertaintyPct` | Reduction of assumed deceleration, from 0 to 95%.                                             | Redução da desaceleração assumida, de 0 a 95%.                                                        |
| `marginM`                    | Additional geometric distance kept separate from motion terms.                                | Distância geométrica adicional mantida separada dos termos de movimento.                              |
| `availableM`                 | Distance supplied for comparison with the modeled envelope.                                   | Distância fornecida para comparar com o envoltório do modelo.                                         |

## Nested fields and bounds · Campos aninhados e limites

| Path · Caminho               | Type / bounds · Tipo / limites |
| ---------------------------- | ------------------------------ |
| `schemaVersion`              | constant 1                     |
| `scenarioId`                 | string                         |
| `source`                     | synthetic / manual             |
| `speedMps`                   | number [0, 10]                 |
| `reactionMs`                 | number [0, 10000]              |
| `reactionUncertaintyMs`      | number [0, 10000]              |
| `decelerationMps2`           | number [0.01, 20]              |
| `decelerationUncertaintyPct` | number [0, 95]                 |
| `marginM`                    | number [0, 20]                 |
| `availableM`                 | number [0, 1000]               |

## Semantic checks · Verificações semânticas

English: The schema checks shape and scalar bounds. The engine additionally checks relationships such as unique identities, references, geometry consistency, non-overlapping windows or non-degenerate fits, as applicable. Unknown fields are rejected at object boundaries. Numbers must be finite. Validation occurs before analysis and imported inputs are limited to 1 MB in both interfaces.

Português: O esquema verifica estrutura e limites escalares. O mecanismo também verifica relações como identidades únicas, referências, consistência geométrica, janelas sem sobreposição ou ajustes não degenerados, conforme o domínio. Campos desconhecidos são rejeitados nos objetos. Números devem ser finitos. A validação ocorre antes da análise e entradas importadas são limitadas a 1 MB em ambas as interfaces.

## Report · Relatório

`schemaVersion`, `analysisVersion`, `projectId`, `scenarioId`, `source`, `status`, `metrics`, `findings` and `records` form the shared envelope. Project-specific fields retain the detailed calculation. Numeric results are exported as numbers; localization affects only display. Many presentation values are rounded to six decimal places; a rounded zero does not establish exact physical agreement.

`schemaVersion`, `analysisVersion`, `projectId`, `scenarioId`, `source`, `status`, `metrics`, `findings` e `records` formam o envelope comum. Campos específicos preservam o cálculo detalhado. Resultados numéricos são exportados como números; localização afeta apenas a exibição. Muitos valores de apresentação são arredondados a seis casas decimais; zero arredondado não comprova concordância física exata.

| Status                           | Meaning · Significado                                               | CLI exit · Saída |
| -------------------------------- | ------------------------------------------------------------------- | ---------------- |
| `complete`                       | No model findings / Sem achados no modelo                           | 0                |
| `review-notes`                   | Informational or warning findings / Informações ou avisos           | 0                |
| `review-required`                | At least one error-level finding / Ao menos um achado de nível erro | 2                |
| Invalid input / Entrada inválida | No new report / Sem novo relatório                                  | 1                |
