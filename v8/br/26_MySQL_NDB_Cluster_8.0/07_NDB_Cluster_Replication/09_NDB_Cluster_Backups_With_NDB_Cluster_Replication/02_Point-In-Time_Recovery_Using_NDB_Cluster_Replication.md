#### 25.7.9.2 Recuperação em Ponto de Tempo Usando a Replicação do NDB Cluster

A recuperação em um ponto no tempo, ou seja, a recuperação de alterações de dados feitas desde um determinado ponto no tempo, é realizada após a restauração de um backup completo que retorna o servidor ao estado em que estava quando o backup foi feito. A realização da recuperação em um ponto no tempo de tabelas do NDB Cluster com o NDB Cluster e a Replicação do NDB Cluster pode ser realizada usando um backup de dados nativo `NDB` (feito emitindo `CREATE BACKUP` no cliente **ndb\_mgm**) e restaurando a tabela `ndb_binlog_index` (de um dump feito usando **mysqldump**).

Para realizar a recuperação em um ponto no tempo do NDB Cluster, é necessário seguir os passos mostrados aqui:

1. Faça backup de todos os bancos de dados `NDB` no cluster, usando o comando `START BACKUP` no cliente **ndb\_mgm** (consulte a Seção 25.6.8, “Backup Online do NDB Cluster”).

2. Em um momento posterior, antes de restaurar o grupo, faça um backup da tabela \[\[`mysql.ndb_binlog_index`]. É provavelmente mais simples usar o **mysqldump** para essa tarefa. Além disso, faça um backup dos arquivos de log binário nesse momento.

   Esse backup deve ser atualizado regularmente — talvez até a cada hora — dependendo das suas necessidades.

3. (*Falha ou erro catastrófico ocorre.*)

4. Localize o último backup conhecido e bom.

5. Limpe os sistemas de arquivos do nó de dados (usando **ndbd** `--initial` ou \*\*ndbmtd" `--initial`).

   Nota

   A partir da versão NDB 8.0.21, o espaço de dados de tabela Disk Data e os arquivos de log são removidos pelo `--initial`. Anteriormente, era necessário excluí-los manualmente.

6. Use `DROP TABLE` ou `TRUNCATE TABLE` com a tabela `mysql.ndb_binlog_index`.

7. Execute **ndb\_restore**, restaurando todos os dados. Você deve incluir a opção `--restore-epoch` ao executar **ndb\_restore**, para que a tabela `ndb_apply_status` seja preenchida corretamente. (Consulte a Seção 25.5.23, “ndb\_restore — Restaurar um backup de um cluster NDB”, para obter mais informações.)

8. Restaure a tabela `ndb_binlog_index` a partir da saída do **mysqldump** e, se necessário, restaure os arquivos de log binário a partir do backup.

9. Encontre a época aplicada mais recentemente, ou seja, o valor máximo da coluna `epoch` na tabela `ndb_apply_status` como a variável de usuário `@LATEST_EPOCH` (destacada):

   ```
   SELECT @LATEST_EPOCH:=MAX(epoch)
       FROM mysql.ndb_apply_status;
   ```

10. Encontre o arquivo de log binário mais recente (`@FIRST_FILE`) e a posição (valor da coluna `Position`) dentro deste arquivo que correspondam a `@LATEST_EPOCH` na tabela `ndb_binlog_index`:

    ```
    SELECT Position, @FIRST_FILE:=File
        FROM mysql.ndb_binlog_index
        WHERE epoch > @LATEST_EPOCH ORDER BY epoch ASC LIMIT 1;
    ```

11. Usando o **mysqlbinlog**, repita os eventos do log binário do arquivo fornecido e posicione-se até o ponto do erro. (Consulte a Seção 6.6.9, “mysqlbinlog — Ferramenta para Processamento de Arquivos de Log Binário”.)

Consulte também a Seção 9.5, “Recuperação Ponto no Tempo (Incremental) (Recuperação Incremental)”, para obter mais informações sobre o log binário, replicação e recuperação incremental.
