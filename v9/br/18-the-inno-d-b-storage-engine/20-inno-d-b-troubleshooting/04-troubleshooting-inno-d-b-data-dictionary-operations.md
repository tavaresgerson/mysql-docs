### 17.20.4 Solução de problemas nas operações do dicionário de dados do InnoDB

As informações sobre as definições das tabelas são armazenadas no dicionário de dados do InnoDB. Se você mover os arquivos de dados, os dados do dicionário podem se tornar inconsistentes.

Se uma corrupção ou problema de consistência no dicionário de dados impedir que você inicie o `InnoDB`, consulte a Seção 17.20.3, “Forçar a recuperação do InnoDB”, para obter informações sobre a recuperação manual.

#### Não é possível abrir o arquivo de dados

Com `innodb_file_per_table` habilitado (o padrão), as seguintes mensagens podem aparecer ao inicializar se um arquivo de espaço de tabelas por arquivo (arquivo `.ibd`) estiver ausente:

```
[ERROR] InnoDB: Operating system error number 2 in a file operation.
[ERROR] InnoDB: The error means the system cannot find the path specified.
[ERROR] InnoDB: Cannot open datafile for read-only: './test/t1.ibd' OS error: 71
[Warning] InnoDB: Ignoring tablespace `test/t1` because it could not be opened.
```

Para resolver essas mensagens, execute a instrução `DROP TABLE` para remover os dados sobre a tabela ausente do dicionário de dados.

#### Restaurando arquivos órfãos de ibd de tabelas por arquivo

Este procedimento descreve como restaurar arquivos `.ibd` de tabelas por arquivo órfãos para outra instância do MySQL. Você pode usar este procedimento se o espaço de tabelas do sistema for perdido ou irrecuperável e você quiser restaurar backups de arquivos `.ibd` em uma nova instância do MySQL.

O procedimento não é suportado para arquivos `.ibd` de espaço de tabelas gerais.

O procedimento assume que você tem apenas backups de arquivos `.ibd`, que está recuperando para a mesma versão do MySQL que inicialmente criou os arquivos `.ibd` órfãos e que os backups de arquivos `.ibd` estão limpos. Consulte a Seção 17.6.1.4, “Mover ou copiar tabelas InnoDB” para obter informações sobre a criação de backups limpos.

As limitações de importação de tabelas descritas na Seção 17.6.1.3, “Importar tabelas InnoDB” são aplicáveis a este procedimento.

1. Na nova instância do MySQL, recrie a tabela em um banco de dados com o mesmo nome.

   ```
   mysql> CREATE DATABASE sakila;

   mysql> USE sakila;

   mysql> CREATE TABLE actor (
       ->     actor_id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
       ->     first_name VARCHAR(45) NOT NULL,
       ->     last_name VARCHAR(45) NOT NULL,
       ->     last_update TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
       ->     PRIMARY KEY  (actor_id),
       ->     KEY idx_actor_last_name (last_name)
       -> )ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
   ```

2. Descarte o espaço de tabelas da tabela recém-criada.

   ```
   mysql> ALTER TABLE sakila.actor DISCARD TABLESPACE;
   ```

3. Copie o arquivo `.ibd` órfão do seu diretório de backup para o diretório do banco de dados novo.

   ```
   $> cp /backup_directory/actor.ibd path/to/mysql-5.7/data/sakila/
   ```

4. Certifique-se de que o arquivo `.ibd` tenha as permissões de arquivo necessárias.

5. Importe o arquivo `.ibd` órfão. Um aviso é emitido indicando que o `InnoDB` está tentando importar o arquivo sem verificação de esquema.

   ```
   mysql> ALTER TABLE sakila.actor IMPORT TABLESPACE; SHOW WARNINGS;
   Query OK, 0 rows affected, 1 warning (0.15 sec)

   Warning | 1810 | InnoDB: IO Read error: (2, No such file or directory)
   Error opening './sakila/actor.cfg', will attempt to import
   without schema verification
   ```

6. Faça uma consulta à tabela para verificar se o arquivo `.ibd` foi restaurado com sucesso.

   ```
   mysql> SELECT COUNT(*) FROM sakila.actor;
   +----------+
   | count(*) |
   +----------+
   |      200 |
   +----------+
   ```