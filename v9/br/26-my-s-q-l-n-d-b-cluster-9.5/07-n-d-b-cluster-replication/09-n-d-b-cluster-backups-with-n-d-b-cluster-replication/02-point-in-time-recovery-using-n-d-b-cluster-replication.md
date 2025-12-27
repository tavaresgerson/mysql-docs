#### 25.7.9.2 Recuperação em Ponto no Tempo Usando a Replicação do NDB Cluster

A recuperação em ponto no tempo — ou seja, a recuperação das alterações de dados feitas desde um determinado ponto no tempo — é realizada após a restauração de um backup completo que retorna o servidor ao seu estado quando o backup foi feito. A realização da recuperação em ponto no tempo das tabelas do NDB Cluster com o NDB Cluster e a Replicação do NDB Cluster pode ser realizada usando um backup de dados nativo do `NDB` (feito emitindo `CREATE BACKUP` no cliente **ndb\_mgm**) e restaurando a tabela `ndb_binlog_index` (de um dump feito usando **mysqldump**).

Para realizar a recuperação em ponto no tempo do NDB Cluster, é necessário seguir os passos mostrados aqui:

1. Faça backup de todas as bases de dados `NDB` no cluster, usando o comando `START BACKUP` no cliente **ndb\_mgm** (veja a Seção 25.6.8, “Backup Online do NDB Cluster”).

2. Em algum momento posterior, antes de restaurar o cluster, faça um backup da tabela `mysql.ndb_binlog_index`. Provavelmente, é mais simples usar **mysqldump** para essa tarefa. Também faça backup dos arquivos de log do log binário nesse momento.

   Este backup deve ser atualizado regularmente — talvez até a cada hora — dependendo das suas necessidades.

3. (*Falha catastrófica ou erro ocorre*.)
4. Localize o último backup conhecido como bom.
5. Limpe os sistemas de arquivos do nó de dados (usando **ndbd** `--initial` ou **ndbmtd`") `--initial`).

   Nota

   O espaço de dados do disco e os arquivos de log também são removidos por `--initial`.

6. Use `DROP TABLE` ou `TRUNCATE TABLE` com a tabela `mysql.ndb_binlog_index`.

7. Execute **ndb\_restore**, restaurando todos os dados. Você deve incluir a opção `--restore-epoch` ao executar **ndb\_restore**, para que a tabela `ndb_apply_status` seja preenchida corretamente. (Veja a Seção 25.5.23, “ndb\_restore — Restaurar um Backup do NDB Cluster”, para mais informações.)

8. Restaure a tabela `ndb_binlog_index` a partir da saída do **mysqldump** e, se necessário, restaure os arquivos de log binário de backup.

9. Encontre o epoc aplicado mais recentemente — ou seja, o valor máximo da coluna `epoch` na tabela `ndb_apply_status` — como a variável de usuário `@LATEST_EPOCH` (destacada):

   ```
   SELECT @LATEST_EPOCH:=MAX(epoch)
       FROM mysql.ndb_apply_status;
   ```

10. Encontre o arquivo de log binário mais recente (`@FIRST_FILE`) e a posição (`Position` valor da coluna) dentro deste arquivo que correspondam a `@LATEST_EPOCH` na tabela `ndb_binlog_index`:

    ```
    SELECT Position, @FIRST_FILE:=File
        FROM mysql.ndb_binlog_index
        WHERE epoch > @LATEST_EPOCH ORDER BY epoch ASC LIMIT 1;
    ```

11. Use o **mysqlbinlog**, replique os eventos de log binário a partir do arquivo e posição fornecidos até o ponto da falha. (Veja a Seção 6.6.9, “mysqlbinlog — Ferramenta para Processamento de Arquivos de Log Binário”.)

Consulte também a Seção 9.5, “Recuperação Ponto no Tempo (Incremental)” (Recuperação”), para obter mais informações sobre o log binário, replicação e recuperação incremental.