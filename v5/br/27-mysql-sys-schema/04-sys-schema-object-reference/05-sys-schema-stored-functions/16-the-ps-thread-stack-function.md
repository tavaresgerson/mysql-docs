#### 26.4.5.16 A Função ps_thread_stack()

Retorna um `stack` formatado em JSON de todos os `statements`, `stages` e `events` dentro do Performance Schema para um determinado `thread ID`.

##### Parâmetros

* `in_thread_id BIGINT`: O ID do `thread` a ser rastreado. O valor deve corresponder à coluna `THREAD_ID` de alguma linha da tabela `threads` do Performance Schema.

* `in_verbose BOOLEAN`: Indica se a informação `file:lineno` deve ser incluída nos `events`.

##### Valor de Retorno

Um valor `LONGTEXT CHARACTER SET latin1`.

##### Exemplo

```sql
mysql> SELECT sys.ps_thread_stack(37, FALSE) AS thread_stack\G
*************************** 1. row ***************************
thread_stack: {"rankdir": "LR","nodesep": "0.10",
"stack_created": "2014-02-19 13:39:03", "mysql_version": "5.7.3-m13",
"mysql_user": "root@localhost","events": [{"nesting_event_id": "0",
"event_id": "10", "timer_wait": 256.35, "event_info": "sql/select",
"wait_info": "select @@version_comment limit 1\nerrors: 0\nwarnings: 0\nlock time:
...
```