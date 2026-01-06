#### 26.4.4.21 O procedimento ps\_statement\_avg\_latency\_histogram()

Exibe um gráfico de histograma textual dos valores médios de latência em todas as declarações normalizadas rastreadas na tabela do Schema de Desempenho `eventos_declarações_resumo_por_digest`.

Esse procedimento pode ser usado para exibir uma imagem de alto nível da distribuição de latência das declarações que estão sendo executadas nessa instância do MySQL.

##### Parâmetros

Nenhum.

##### Exemplo

A saída do histograma em unidades de declaração. Por exemplo, `* = 2 unidades` na legenda do histograma significa que cada caractere `*` representa 2 declarações.

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
