#### 13.7.5.23 Instrução SHOW MASTER STATUS

```sql
SHOW MASTER STATUS
```

Esta instrução fornece informações de status sobre os arquivos do **binary log** da origem. Ela exige o privilégio [`SUPER`](privileges-provided.html#priv_super) ou [`REPLICATION CLIENT`](privileges-provided.html#priv_replication-client).

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

Quando **global transaction IDs** (**GTIDs**) estão em uso, `Executed_Gtid_Set` exibe o conjunto de **GTIDs** para transações que foram executadas na origem. Este valor é o mesmo que o valor para a variável de sistema [`gtid_executed`](replication-options-gtids.html#sysvar_gtid_executed) neste servidor, bem como o valor para `Executed_Gtid_Set` na saída de [`SHOW SLAVE STATUS`](show-slave-status.html "13.7.5.34 SHOW SLAVE STATUS Statement") neste servidor.