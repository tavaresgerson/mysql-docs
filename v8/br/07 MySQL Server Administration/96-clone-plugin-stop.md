#### 7.6.7.11 Parar uma operação de clonagem

Se necessário, você pode parar uma operação de clonagem com uma instrução `KILL QUERY processlist_id`.

Na instância do servidor MySQL destinatário, você pode recuperar o identificador de lista de processos (PID) para uma operação de clonagem da coluna `PID` da tabela `clone_status`.

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

Você também pode recuperar o identificador da lista de processos da coluna `ID` da tabela `INFORMATION_SCHEMA` `PROCESSLIST`, da coluna `Id` da saída `SHOW PROCESSLIST` ou da coluna `PROCESSLIST_ID` da tabela `threads` do esquema de desempenho. Esses métodos de obtenção das informações PID podem ser usados na instância do servidor MySQL doador ou receptor.
