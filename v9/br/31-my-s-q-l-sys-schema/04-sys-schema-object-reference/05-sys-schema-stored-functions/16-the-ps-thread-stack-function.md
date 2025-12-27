#### 30.4.5.16 A função ps\_thread\_stack()

Retorna uma pilha formatada em JSON de todas as instruções, estágios e eventos dentro do Schema de Desempenho para um ID de thread dado.

##### Parâmetros

* `in_thread_id BIGINT`: O ID do thread a ser rastreado. O valor deve corresponder à coluna `THREAD_ID` de alguma linha da tabela `threads` do Schema de Desempenho.

* `in_verbose BOOLEAN`: Se incluir as informações `file:lineno` nos eventos.

##### Valor de retorno

Um valor de `LONGTEXT CHARACTER SET latin1`.

##### Exemplo

```
mysql> SELECT sys.ps_thread_stack(37, FALSE) AS thread_stack\G
*************************** 1. row ***************************
thread_stack: {"rankdir": "LR","nodesep": "0.10",
"stack_created": "2014-02-19 13:39:03", "mysql_version": "8.4.0-tr",
"mysql_user": "root@localhost","events": [{"nesting_event_id": "0",
"event_id": "10", "timer_wait": 256.35, "event_info": "sql/select",
"wait_info": "select @@version_comment limit 1\nerrors: 0\nwarnings: 0\nlock time:
...
```