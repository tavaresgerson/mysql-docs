#### 21.7.9.2 Point-In-Time Recovery Usando NDB Cluster Replication

Point-in-Time Recovery — ou seja, a recuperação de alterações de dados feitas desde um determinado ponto no tempo — é realizada após o restore de um full backup que retorna o servidor ao seu estado no momento em que o backup foi feito. A execução de Point-in-Time Recovery de tabelas do NDB Cluster com NDB Cluster e NDB Cluster Replication pode ser realizada usando um backup de dados nativo \`NDB\` (obtido emitindo \`CREATE BACKUP\` no cliente **ndb_mgm**) e fazendo o restore da tabela \`ndb_binlog_index\` (a partir de um dump feito usando **mysqldump**).

Para executar o Point-in-Time Recovery do NDB Cluster, é necessário seguir os passos mostrados aqui:

1. Faça o Backup de todos os Databases \`NDB\` no Cluster, usando o comando \`START BACKUP\` no cliente **ndb_mgm** (consulte Section 21.6.8, “Online Backup of NDB Cluster”).

2. Em algum momento posterior, antes de fazer o restore do Cluster, faça um backup da tabela \`mysql.ndb_binlog_index\`. É provavelmente mais simples usar o **mysqldump** para esta tarefa. Também faça backup dos arquivos Binary Log neste momento.

   Este backup deve ser atualizado regularmente — talvez até mesmo de hora em hora — dependendo de suas necessidades.

3. (*Ocorre falha catastrófica ou erro*.)
4. Localize o último backup bom conhecido.
5. Limpe os sistemas de arquivos dos data nodes (usando **ndbd** \`--initial\` ou **ndbmtd**") \`--initial\`).

   Note

   O tablespace Disk Data do NDB Cluster e os arquivos de log não são removidos por \`--initial\`. Você deve excluí-los manualmente.

6. Use \`DROP TABLE\` ou \`TRUNCATE TABLE\` com a tabela \`mysql.ndb_binlog_index\`.

7. Execute **ndb_restore**, fazendo o restore de todos os dados. Você deve incluir a opção \`--restore-epoch\` ao executar **ndb_restore**, para que a tabela \`ndb_apply_status\` seja populada corretamente. (Consulte Section 21.5.24, “ndb_restore — Restore an NDB Cluster Backup”, para mais informações.)

8. Faça o restore da tabela \`ndb_binlog_index\` a partir da saída do **mysqldump** e faça o restore dos arquivos Binary Log a partir do backup, se necessário.

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

11. Usando **mysqlbinlog**, faça o replay dos eventos Binary Log a partir do arquivo e da Position fornecidos até o ponto da falha. (Consulte Section 4.6.7, “mysqlbinlog — Utility for Processing Binary Log Files”.)

Consulte também Section 7.5, “Point-in-Time (Incremental) Recovery” Recovery"), para mais informações sobre o Binary Log, Replication e recuperação incremental.