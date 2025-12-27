#### 30.4.5.17 A função `ps\_thread\_trx\_info()`

Retorna um objeto JSON contendo informações sobre um determinado thread. As informações incluem a transação atual e as instruções que ele já executou, derivadas das tabelas `events_transactions_current` e `events_statements_history` do Schema de Desempenho. (Os consumidores dessas tabelas devem estar habilitados para obter dados completos no objeto JSON.)

Se a saída exceder o comprimento de truncação (65535 por padrão), um objeto de erro JSON é retornado, como:

```
{ "error": "Trx info truncated: Row 6 was cut by GROUP_CONCAT()" }
```

Objetos de erro semelhantes são retornados para outras advertências e exceções levantadas durante a execução da função.

##### Parâmetros

* `in_thread_id BIGINT UNSIGNED`: O ID do thread para o qual retornar as informações da transação. O valor deve corresponder à coluna `THREAD_ID` de alguma linha da tabela `threads` do Schema de Desempenho.

##### Opções de configuração

A operação `ps_thread_trx_info()` pode ser modificada usando as seguintes opções de configuração ou suas variáveis definidas pelo usuário correspondentes (consulte a Seção 30.4.2.1, “A tabela sys\_config”):

* `ps_thread_trx_info.max_length`, `@sys.ps_thread_trx_info.max_length`

  O comprimento máximo da saída. O padrão é 65535.

##### Valor de retorno

Um valor `LONGTEXT`.

##### Exemplo

```
mysql> SELECT sys.ps_thread_trx_info(48)\G
*************************** 1. row ***************************
sys.ps_thread_trx_info(48): [
  {
    "time": "790.70 us",
    "state": "COMMITTED",
    "mode": "READ WRITE",
    "autocommitted": "NO",
    "gtid": "AUTOMATIC",
    "isolation": "REPEATABLE READ",
    "statements_executed": [
      {
        "sql_text": "INSERT INTO info VALUES (1, \'foo\')",
        "time": "471.02 us",
        "schema": "trx",
        "rows_examined": 0,
        "rows_affected": 1,
        "rows_sent": 0,
        "tmp_tables": 0,
        "tmp_disk_tables": 0,
        "sort_rows": 0,
        "sort_merge_passes": 0
      },
      {
        "sql_text": "COMMIT",
        "time": "254.42 us",
        "schema": "trx",
        "rows_examined": 0,
        "rows_affected": 0,
        "rows_sent": 0,
        "tmp_tables": 0,
        "tmp_disk_tables": 0,
        "sort_rows": 0,
        "sort_merge_passes": 0
      }
    ]
  },
  {
    "time": "426.20 us",
    "state": "COMMITTED",
    "mode": "READ WRITE",
    "autocommitted": "NO",
    "gtid": "AUTOMATIC",
    "isolation": "REPEATABLE READ",
    "statements_executed": [
      {
        "sql_text": "INSERT INTO info VALUES (2, \'bar\')",
        "time": "107.33 us",
        "schema": "trx",
        "rows_examined": 0,
        "rows_affected": 1,
        "rows_sent": 0,
        "tmp_tables": 0,
        "tmp_disk_tables": 0,
        "sort_rows": 0,
        "sort_merge_passes": 0
      },
      {
        "sql_text": "COMMIT",
        "time": "213.23 us",
        "schema": "trx",
        "rows_examined": 0,
        "rows_affected": 0,
        "rows_sent": 0,
        "tmp_tables": 0,
        "tmp_disk_tables": 0,
        "sort_rows": 0,
        "sort_merge_passes": 0
      }
    ]
  }
]
```