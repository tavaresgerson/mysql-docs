#### 26.4.4.21 O Procedure ps_statement_avg_latency_histogram()

Exibe um gráfico de `histogram` textual dos valores de `latency` média em todos os `statements` normalizados rastreados na tabela `events_statements_summary_by_digest` do `Performance Schema`.

Este `Procedure` pode ser usado para exibir uma visão de altíssimo nível da distribuição de `latency` dos `statements` em execução nesta `MySQL instance`.

##### Parâmetros

Nenhuns.

##### Exemplo

A saída do `histogram` em unidades de `statement`. Por exemplo, `* = 2 units` na legenda do `histogram` significa que cada caractere `*` representa 2 `statements`.

```sql
mysql> CALL sys.ps_statement_avg_latency_histogram()\G
*************************** 1. row ***************************
Performance Schema Statement Digest Average Latency Histogram:

  . = 1 unit
  * = 2 units
  # = 3 units

(0 - 66ms)     88  | #############################
(66 - 133ms)   14  | ..............
(133 - 199ms)  4   | ....
(199 - 265ms)  5   | **
(265 - 332ms)  1   | .
(332 - 398ms)  0   |
(398 - 464ms)  1   | .
(464 - 531ms)  0   |
(531 - 597ms)  0   |
(597 - 663ms)  0   |
(663 - 730ms)  0   |
(730 - 796ms)  0   |
(796 - 863ms)  0   |
(863 - 929ms)  0   |
(929 - 995ms)  0   |
(995 - 1062ms) 0   |

  Total Statements: 114; Buckets: 16; Bucket Size: 66 ms;
```