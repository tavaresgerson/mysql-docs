#### 13.7.5.23 Declaração de status do mestre

```sql
SHOW MASTER STATUS
```

Esta declaração fornece informações de status sobre os arquivos de log binário da fonte. Ela requer o privilégio `SUPER` ou `REPLICATION CLIENT`.

Exemplo:

```sql
mysql> SHOW MASTER STATUS\G
*************************** 1. row ***************************
             File: source-bin.000002
         Position: 1307
     Binlog_Do_DB: test
 Binlog_Ignore_DB: manual, mysql
Executed_Gtid_Set: 3E11FA47-71CA-11E1-9E33-C80AA9429562:1-5
1 row in set (0.00 sec)
```

Quando os IDs de transações globais estão em uso, o `Executed_Gtid_Set` mostra o conjunto de GTIDs para as transações que foram executadas na fonte. Isso é o mesmo que o valor da variável de sistema `gtid_executed` neste servidor, bem como o valor de `Executed_Gtid_Set` na saída de `SHOW SLAVE STATUS` neste servidor.
