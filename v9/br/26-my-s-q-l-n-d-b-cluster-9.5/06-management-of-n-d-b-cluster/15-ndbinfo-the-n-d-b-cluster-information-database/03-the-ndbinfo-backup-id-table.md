#### 25.6.15.3 A tabela ndbinfo backup_id

Esta tabela fornece uma maneira de encontrar o ID do backup iniciado mais recentemente para este clúster.

A tabela `backup_id` contém uma única coluna `id`, que corresponde a um ID de backup obtido usando o comando **ndb\_mgm** `START BACKUP`. Esta tabela contém uma única linha.

*Exemplo*: Suponha a seguinte sequência de comandos `START BACKUP` emitidos no cliente de gerenciamento NDB, sem que outros backups tenham sido feitos desde que o clúster foi iniciado pela primeira vez:

```
ndb_mgm> START BACKUP
Waiting for completed, this may take several minutes
Node 5: Backup 1 started from node 50
Node 5: Backup 1 started from node 50 completed
 StartGCP: 27894 StopGCP: 27897
 #Records: 2057 #LogRecords: 0
 Data: 51580 bytes Log: 0 bytes
ndb_mgm> START BACKUP 5
Waiting for completed, this may take several minutes
Node 5: Backup 5 started from node 50
Node 5: Backup 5 started from node 50 completed
 StartGCP: 27905 StopGCP: 27908
 #Records: 2057 #LogRecords: 0
 Data: 51580 bytes Log: 0 bytes
ndb_mgm> START BACKUP
Waiting for completed, this may take several minutes
Node 5: Backup 6 started from node 50
Node 5: Backup 6 started from node 50 completed
 StartGCP: 27912 StopGCP: 27915
 #Records: 2057 #LogRecords: 0
 Data: 51580 bytes Log: 0 bytes
ndb_mgm> START BACKUP 3
Connected to Management Server at: localhost:1186 (using cleartext)
Waiting for completed, this may take several minutes
Node 5: Backup 3 started from node 50
Node 5: Backup 3 started from node 50 completed
 StartGCP: 28149 StopGCP: 28152
 #Records: 2057 #LogRecords: 0
 Data: 51580 bytes Log: 0 bytes
ndb_mgm>
```

Após isso, a tabela `backup_id` contém a única linha mostrada aqui, usando o cliente **mysql**:

```
mysql> USE ndbinfo;

Database changed
mysql> SELECT * FROM backup_id;
+------+
| id   |
+------+
|    3 |
+------+
1 row in set (0.00 sec)
```

Se não forem encontrados backups, a tabela contém uma única linha com `0` como o valor do `id`.