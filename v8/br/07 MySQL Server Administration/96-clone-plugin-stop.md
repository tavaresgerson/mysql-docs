#### 7.6.7.11 Parando uma Operação de Clonagem

Se necessário, você pode parar uma operação de clonagem com uma declaração `KILL QUERY processlist_id`.

No servidor MySQL do destinatário, você pode recuperar o identificador do processo (PID) de uma operação de clonagem da coluna `PID` da tabela `clone_status`.

```
mysql> SELECT * FROM performance_schema.clone_status\G
*************************** 1. row ***************************
             ID: 1
            PID: 8
          STATE: In Progress
     BEGIN_TIME: 2019-07-15 11:58:36.767
       END_TIME: NULL
         SOURCE: LOCAL INSTANCE
    DESTINATION: /path/to/clone_dir/
       ERROR_NO: 0
  ERROR_MESSAGE:
    BINLOG_FILE:
BINLOG_POSITION: 0
  GTID_EXECUTED:
```

Você também pode recuperar o identificador do processo do campo `ID` da tabela `PROCESSLIST` do `INFORMATION_SCHEMA`, da saída do comando `SHOW PROCESSLIST` ou do campo `PROCESSLIST_ID` da tabela `threads` do Gerenciador de Desempenho. Esses métodos de obtenção da informação do PID podem ser usados no servidor MySQL do doador ou do destinatário.