#### 21.7.9.2 Point-In-Time Recovery Usando NDB Cluster Replication

Point-in-Time Recovery — ou seja, a recuperação de alterações de dados feitas desde um determinado ponto no tempo — é realizada após o restore de um full backup que retorna o servidor ao seu estado no momento em que o backup foi feito. A execução de Point-in-Time Recovery de tabelas do NDB Cluster com NDB Cluster e NDB Cluster Replication pode ser realizada usando um backup de dados nativo [\`NDB\`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") (obtido emitindo [\`CREATE BACKUP\`](mysql-cluster-mgm-client-commands.html#ndbclient-create-nodegroup) no cliente [**ndb_mgm**](mysql-cluster-programs-ndb-mgm.html "21.5.5 ndb_mgm — The NDB Cluster Management Client")) e fazendo o restore da tabela \`ndb_binlog_index\` (a partir de um dump feito usando [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program")).

Para executar o Point-in-Time Recovery do NDB Cluster, é necessário seguir os passos mostrados aqui:

1. Faça o Backup de todos os Databases \`NDB\` no Cluster, usando o comando [\`START BACKUP\`](mysql-cluster-backup-using-management-client.html "21.6.8.2 Using The NDB Cluster Management Client to Create a Backup") no cliente [**ndb_mgm**](mysql-cluster-programs-ndb-mgm.html "21.5.5 ndb_mgm — The NDB Cluster Management Client") (consulte [Section 21.6.8, “Online Backup of NDB Cluster”](mysql-cluster-backup.html "21.6.8 Online Backup of NDB Cluster")).

2. Em algum momento posterior, antes de fazer o restore do Cluster, faça um backup da tabela \`mysql.ndb_binlog_index\`. É provavelmente mais simples usar o [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program") para esta tarefa. Também faça backup dos arquivos Binary Log neste momento.

   Este backup deve ser atualizado regularmente — talvez até mesmo de hora em hora — dependendo de suas necessidades.

3. (*Ocorre falha catastrófica ou erro*.)
4. Localize o último backup bom conhecido.
5. Limpe os sistemas de arquivos dos data nodes (usando [**ndbd**](mysql-cluster-programs-ndbd.html "21.5.1 ndbd — The NDB Cluster Data Node Daemon") [\`--initial\`](mysql-cluster-programs-ndbd.html#option_ndbd_initial) ou [**ndbmtd**](mysql-cluster-programs-ndbmtd.html "21.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)") [\`--initial\`](mysql-cluster-programs-ndbd.html#option_ndbd_initial)).

   Note

   O tablespace Disk Data do NDB Cluster e os arquivos de log não são removidos por [\`--initial\`](mysql-cluster-programs-ndbd.html#option_ndbd_initial). Você deve excluí-los manualmente.

6. Use [\`DROP TABLE\`](drop-table.html "13.1.29 DROP TABLE Statement") ou [\`TRUNCATE TABLE\`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") com a tabela \`mysql.ndb_binlog_index\`.

7. Execute [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup"), fazendo o restore de todos os dados. Você deve incluir a opção [\`--restore-epoch\`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_restore-epoch) ao executar [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup"), para que a tabela \`ndb_apply_status\` seja populada corretamente. (Consulte [Section 21.5.24, “ndb_restore — Restore an NDB Cluster Backup”](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup"), para mais informações.)

8. Faça o restore da tabela \`ndb_binlog_index\` a partir da saída do [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program") e faça o restore dos arquivos Binary Log a partir do backup, se necessário.

9. Encontre o epoch aplicado mais recentemente — ou seja, o valor máximo da column \`epoch\` na tabela \`ndb_apply_status\` — como a user variable \`@LATEST_EPOCH\` (em destaque):

   ```sql
   SELECT @LATEST_EPOCH:=MAX(epoch)
       FROM mysql.ndb_apply_status;
   ```

10. Encontre o último arquivo Binary Log (\`@FIRST_FILE\`) e a Position (valor da column \`Position\`) dentro deste arquivo que corresponde a \`@LATEST_EPOCH\` na tabela \`ndb_binlog_index\:`

    ```sql
    SELECT Position, @FIRST_FILE:=File
        FROM mysql.ndb_binlog_index
        WHERE epoch > @LATEST_EPOCH ORDER BY epoch ASC LIMIT 1;
    ```

11. Usando [**mysqlbinlog**](mysqlbinlog.html "4.6.7 mysqlbinlog — Utility for Processing Binary Log Files"), faça o replay dos eventos Binary Log a partir do arquivo e da Position fornecidos até o ponto da falha. (Consulte [Section 4.6.7, “mysqlbinlog — Utility for Processing Binary Log Files”](mysqlbinlog.html "4.6.7 mysqlbinlog — Utility for Processing Binary Log Files").)

Consulte também [Section 7.5, “Point-in-Time (Incremental) Recovery”](point-in-time-recovery.html "7.5 Point-in-Time (Incremental) Recovery"), para mais informações sobre o Binary Log, Replication e recuperação incremental.