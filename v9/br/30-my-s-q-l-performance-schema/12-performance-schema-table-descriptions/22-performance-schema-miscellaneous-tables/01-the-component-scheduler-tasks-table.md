#### 29.12.22.1 A tabela `component_scheduler_tasks`

A tabela `component_scheduler_tasks` contém uma linha para cada tarefa agendada. Cada linha contém informações sobre o progresso em andamento de uma tarefa que aplicativos, componentes e plugins podem implementar, opcionalmente, usando o componente `scheduler` (veja a Seção 7.5.5, “Componente Scheduler”). Por exemplo, o plugin de servidor `audit_log` utiliza o componente `scheduler` para executar um esvaziamento regular e recorrente de seu cache de memória:

```
mysql> select * from performance_schema.component_scheduler_tasks\G
*************************** 1. row ***************************
            NAME: plugin_audit_log_flush_scheduler
          STATUS: WAITING
         COMMENT: Registered by the audit log plugin. Does a periodic refresh of the audit log
                  in-memory rules cache by calling audit_log_flush
INTERVAL_SECONDS: 100
       TIMES_RUN: 5
    TIMES_FAILED: 0
1 row in set (0.02 sec)
```

A tabela `component_scheduler_tasks` tem as seguintes colunas:

* `NAME`

  O nome fornecido durante o registro.

* `STATUS`

  Os valores são:

  + `RUNNING` se a tarefa estiver ativa e sendo executada.

  + `WAITING` se a tarefa estiver parada e esperando que o thread de segundo plano a pegue ou esperando que a próxima execução seja concluída.

* `COMMENT`

  Um comentário de tempo de compilação fornecido por um aplicativo, componente ou plugin. No exemplo anterior, o MySQL Enterprise Audit fornece o comentário usando um plugin de servidor chamado `audit_log`.

* `INTERVAL_SECONDS`

  O tempo em segundos para executar uma tarefa, que um aplicativo, componente ou plugin fornece. O MySQL Enterprise Audit permite que você especifique esse valor usando a variável de sistema `audit_log_flush_interval_seconds`.

* `TIMES_RUN`

  Um contador que incrementa em um a cada vez que a tarefa é executada com sucesso. Ele volta ao zero.

* `TIMES_FAILED`

  Um contador que incrementa em um a cada vez que a execução da tarefa falha. Ele volta ao zero.