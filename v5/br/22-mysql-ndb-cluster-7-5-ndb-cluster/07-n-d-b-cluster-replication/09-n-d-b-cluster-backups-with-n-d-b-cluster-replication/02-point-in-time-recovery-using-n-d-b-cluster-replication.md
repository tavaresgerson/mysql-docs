#### 21.7.9.2 Recuperação em Ponto de Tempo Usando a Replicação do NDB Cluster

A recuperação em um ponto específico, ou seja, a recuperação de alterações de dados feitas desde um determinado ponto no tempo, é realizada após a restauração de um backup completo que retorna o servidor ao seu estado quando o backup foi feito. A realização da recuperação em um ponto específico das tabelas do NDB Cluster com o NDB Cluster e a Replicação do NDB Cluster pode ser realizada usando um backup de dados nativo do `NDB` (feito emitindo `CREATE BACKUP` no cliente **ndb\_mgm**) e restaurando a tabela `ndb_binlog_index` (de um dump feito usando **mysqldump**).

Para realizar a recuperação em um ponto no tempo do NDB Cluster, é necessário seguir os passos mostrados aqui:

1. Faça backup de todos os bancos de dados `NDB` no clúster, usando o comando `START BACKUP` no cliente **ndb\_mgm** (consulte Seção 21.6.8, “Backup Online do Clúster NDB”).

2. Em um momento posterior, antes de restaurar o grupo, faça um backup da tabela `mysql.ndb_binlog_index`. Provavelmente, o mais simples é usar **mysqldump** para essa tarefa. Também faça um backup dos arquivos de log binário nesse momento.

   Esse backup deve ser atualizado regularmente — talvez até a cada hora — dependendo das suas necessidades.

3. (*Falha ou erro catastrófico ocorre.*)

4. Localize o último backup conhecido e bom.

5. Limpe os sistemas de arquivos do nó de dados (usando **ndbd** `--initial` ou **ndbmtd** `--initial`).

   Nota

   Os espaços de dados de disco do NDB Cluster e os arquivos de log não são removidos pela opção `--initial` (mysql-cluster-programs-ndbd.html#option\_ndbd\_initial). Você deve excluí-los manualmente.

6. Use `DROP TABLE` ou `TRUNCATE TABLE` com a tabela `mysql.ndb_binlog_index`.

7. Execute **ndb\_restore**, restaurando todos os dados. Você deve incluir a opção `--restore-epoch` ao executar **ndb\_restore**, para que a tabela `ndb_apply_status` seja preenchida corretamente. (Veja Seção 21.5.24, “ndb\_restore — Restaurar um backup do NDB Cluster”, para mais informações.)

8. Restaure a tabela `ndb_binlog_index` a partir da saída do **mysqldump** e, se necessário, restaure os arquivos de log binário a partir do backup.

9. Encontre a época aplicada mais recentemente, ou seja, o valor máximo da coluna `epoch` na tabela `ndb_apply_status` — como variável de usuário `@LATEST_EPOCH` (destacada):

   ```sql
   SELECT @LATEST_EPOCH:=MAX(epoch)
       FROM mysql.ndb_apply_status;
   ```

10. Encontre o arquivo de log binário mais recente (`@FIRST_FILE`) e a posição (`Position` coluna valor) dentro deste arquivo que correspondam a `@LATEST_EPOCH` na tabela `ndb_binlog_index`:

    ```sql
    SELECT Position, @FIRST_FILE:=File
        FROM mysql.ndb_binlog_index
        WHERE epoch > @LATEST_EPOCH ORDER BY epoch ASC LIMIT 1;
    ```

11. Usando **mysqlbinlog**, repita os eventos do log binário do arquivo fornecido e posicione-se até o ponto do erro. (Veja Seção 4.6.7, “mysqlbinlog — Ferramenta para Processamento de Arquivos de Log Binário”.)

Consulte também Seção 7.5, “Recuperação Ponto no Tempo (Incremental)”,, para obter mais informações sobre o log binário, replicação e recuperação incremental.
