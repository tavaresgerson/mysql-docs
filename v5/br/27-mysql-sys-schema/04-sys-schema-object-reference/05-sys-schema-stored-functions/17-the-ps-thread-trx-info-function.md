#### 26.4.5.17 A Função ps_thread_trx_info()

Retorna um objeto JSON contendo informações sobre um determinado Thread. As informações incluem a Transaction atual e os Statements que ele já executou, derivadas das tabelas `events_transactions_current` e `events_statements_history` do Performance Schema. (Os *consumers* dessas tabelas devem estar habilitados para obter dados completos no objeto JSON.)

Se a saída exceder o comprimento de truncamento (65535 por padrão), um objeto de erro JSON é retornado, como:

```sql
{ "error": "Trx info truncated: Row 6 was cut by GROUP_CONCAT()" }
```

Objetos de erro semelhantes são retornados para outros *warnings* e exceções gerados durante a execução da função.

##### Parâmetros

* `in_thread_id BIGINT UNSIGNED`: O ID do Thread para o qual retornar informações da Transaction. O valor deve corresponder à coluna `THREAD_ID` de alguma linha da tabela `threads` do Performance Schema.

##### Opções de Configuração

A operação da Função `ps_thread_trx_info()` pode ser modificada usando as seguintes opções de configuração ou suas variáveis definidas pelo usuário correspondentes (consulte a Seção 26.4.2.1, “The sys_config Table”):

* `ps_thread_trx_info.max_length`, `@sys.ps_thread_trx_info.max_length`

  O comprimento máximo da saída. O padrão é 65535.

##### Valor de Retorno

Um valor `LONGTEXT`.

##### Exemplo

```sql
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