#### 15.7.7.1 Declaração de STATUS do LOG BINÁRIO

```
SHOW BINARY LOG STATUS
```

Esta declaração fornece informações de status sobre os arquivos de log binário no servidor de origem e requer o privilégio `REPLICATION CLIENT` (ou o privilégio desatualizado `SUPER`).

Exemplo:

```
mysql> SHOW BINARY LOG STATUS\G
*************************** 1. row ***************************
             File: source-bin.000002
         Position: 1307
     Binlog_Do_DB: test
 Binlog_Ignore_DB: manual, mysql
Executed_Gtid_Set: 3E11FA47-71CA-11E1-9E33-C80AA9429562:1-5
1 row in set (0.00 sec)
```

Quando IDs de transações globais estão em uso, `Executed_Gtid_Set` mostra o conjunto de GTIDs para as transações que foram executadas na origem. Isso é o mesmo valor para a variável de sistema `gtid_executed` neste servidor, bem como o valor para `Executed_Gtid_Set` na saída de `SHOW REPLICA STATUS` neste servidor.