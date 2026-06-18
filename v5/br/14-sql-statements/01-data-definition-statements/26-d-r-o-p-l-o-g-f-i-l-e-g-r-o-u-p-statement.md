### 13.1.26 Instrução DROP LOGFILE GROUP

```sql
DROP LOGFILE GROUP logfile_group
    ENGINE [=] engine_name
```

Esta instrução remove (drops) o LOGFILE GROUP nomeado *`logfile_group`*. O LOGFILE GROUP deve existir previamente, caso contrário, um erro é retornado. (Para informações sobre a criação de LOGFILE GROUPs, consulte Seção 13.1.15, “Instrução CREATE LOGFILE GROUP”.)

Importante

Antes de remover (dropping) um LOGFILE GROUP, você deve remover todos os tablespaces que utilizam esse LOGFILE GROUP para logging de `UNDO`.

A cláusula `ENGINE` obrigatória fornece o nome do Storage Engine usado pelo LOGFILE GROUP a ser removido. Atualmente, os únicos valores permitidos para *`engine_name`* são `NDB` e `NDBCLUSTER`.

A instrução `DROP LOGFILE GROUP` é útil apenas com o armazenamento Disk Data para NDB Cluster. Consulte Seção 21.6.11, “Tabelas Disk Data do NDB Cluster”.