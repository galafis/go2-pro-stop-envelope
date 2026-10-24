# Guided evidence tour · Visita guiada às evidências

[README](../README.md) · [Validation / Validação](../docs/VALIDATION.md)

## The question · A pergunta

**EN:** What distance follows from the supplied stopping assumptions?

**PT:** Qual distância resulta das hipóteses de parada informadas?

## First result · Primeiro resultado

Nominal envelope / EnvoltÃ³rio nominal: **2.7 m**; Upper envelope / EnvoltÃ³rio superior: **3.4 m**; Distance margin / Margem de distÃ¢ncia: **-2.4 m**

**EN:** These are committed examples of software behavior. Follow the installation and execution commands in the [README](../README.md#english); the source inputs and expected outputs below allow inspection before installation.

**PT:** São exemplos versionados do comportamento do software. Siga a instalação e os comandos do [README](../README.md#portugues); as entradas e saídas abaixo permitem inspecionar o resultado antes de instalar.

## Compare one assumption · Compare uma premissa

**EN:** Compare the exact boundary with the distance deficit; change reaction delay and inspect the speed sweep. Keep the original input, change a copy, rerun the implementation and compare the complete output, including warnings and excluded records.

**PT:** Compare limite exato e distância insuficiente; altere o atraso de reação e inspecione a varredura de velocidades. Preserve a entrada original, altere uma cópia, execute novamente e compare a saída completa, incluindo avisos e registros excluídos.

## Inputs and expected outputs · Entradas e saídas esperadas

| Input · Entrada | Expected output · Saída esperada | Inspect · Inspecione |
| --- | --- | --- |
| [deficit.json](../examples/deficit.json) | [deficit.report.json](../examples/deficit.report.json) | Nominal envelope / EnvoltÃ³rio nominal: **2.7 m**; Upper envelope / EnvoltÃ³rio superior: **3.4 m**; Distance margin / Margem de distÃ¢ncia: **-2.4 m** |
| [exact.json](../examples/exact.json) | [exact.report.json](../examples/exact.report.json) | Nominal envelope / EnvoltÃ³rio nominal: **2.25 m**; Upper envelope / EnvoltÃ³rio superior: **2.25 m**; Distance margin / Margem de distÃ¢ncia: **0 m** |
| [latency.json](../examples/latency.json) | [latency.report.json](../examples/latency.report.json) | Nominal envelope / EnvoltÃ³rio nominal: **0.95 m**; Upper envelope / EnvoltÃ³rio superior: **2.075 m**; Distance margin / Margem de distÃ¢ncia: **-0.075 m** |
| [nominal.json](../examples/nominal.json) | [nominal.report.json](../examples/nominal.report.json) | Nominal envelope / EnvoltÃ³rio nominal: **0.95 m**; Upper envelope / EnvoltÃ³rio superior: **1.175 m**; Distance margin / Margem de distÃ¢ncia: **0.825 m** |
| [stationary.json](../examples/stationary.json) | [stationary.report.json](../examples/stationary.report.json) | Nominal envelope / EnvoltÃ³rio nominal: **0.2 m**; Upper envelope / EnvoltÃ³rio superior: **0.2 m**; Distance margin / Margem de distÃ¢ncia: **1.8 m** |

## Review the evidence · Revise as evidências

1. **Input / Entrada:** identify units, identifiers and assumptions before interpreting a result. / Identifique unidades, identificadores e premissas antes de interpretar o resultado.
2. **Implementation / Implementação:** follow the domain code linked in the README. / Acompanhe o código de domínio indicado no README.
3. **Output / Saída:** compare both the headline and the complete record. / Compare o destaque e o registro completo.
4. **Checks / Verificações:** read [validation notes](../docs/VALIDATION.md) and the current workflow result. / Leia as [notas de validação](../docs/VALIDATION.md) e o resultado atual da automação.

**EN:** The banner illustrates the workflow; it is not a screenshot. Example values describe the supplied scenarios. They do not establish physical performance, institutional endorsement or an outcome beyond the documented software scope. Domain-specific assumptions and limitations remain in the README and method documents.

**PT:** O banner ilustra o fluxo; não é uma captura de tela. Os valores descrevem os cenários fornecidos. Não estabelecem desempenho físico, endosso institucional ou resultado além do escopo documentado do software. Premissas e limites do domínio permanecem no README e nos documentos de método.
