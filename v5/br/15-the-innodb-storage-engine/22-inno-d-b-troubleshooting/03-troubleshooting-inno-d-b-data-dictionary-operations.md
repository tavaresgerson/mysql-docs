### 14.22.3 Solução de Problemas em Operações do Data Dictionary do InnoDB

As informações sobre definições de tabela são armazenadas tanto nos arquivos `.frm` quanto no data dictionary do InnoDB. Se você mover arquivos `.frm` ou se o servidor falhar no meio de uma operação do data dictionary, essas fontes de informação podem se tornar inconsistentes.

Se uma corrupção do data dictionary ou um problema de consistência impedir o início do `InnoDB`, consulte a Seção 14.22.2, “Forçando a Recuperação do InnoDB” para obter informações sobre recuperação manual.

#### Falha no CREATE TABLE Devido a Tabela Órfã

Um sintoma de um data dictionary dessincronizado é a falha de uma instrução `CREATE TABLE`. Se isso ocorrer, verifique o log de erros do servidor. Se o log indicar que a tabela já existe dentro do data dictionary interno do `InnoDB`, você tem uma tabela órfã dentro dos arquivos de tablespace do `InnoDB` que não possui um arquivo `.frm` correspondente. A mensagem de erro se parece com isto:

```sql
InnoDB: Error: table test/parent already exists in InnoDB internal
InnoDB: data dictionary. Have you deleted the .frm file
InnoDB: and not used DROP TABLE? Have you used DROP DATABASE
InnoDB: for InnoDB tables in MySQL version <= 3.23.43?
InnoDB: See the Restrictions section of the InnoDB manual.
InnoDB: You can drop the orphaned table inside InnoDB by
InnoDB: creating an InnoDB table with the same name in another
InnoDB: database and moving the .frm file to the current database.
InnoDB: Then MySQL thinks the table exists, and DROP TABLE will
InnoDB: succeed.
```

Você pode remover (drop) a tabela órfã seguindo as instruções fornecidas na mensagem de erro. Se você ainda não conseguir usar `DROP TABLE` com sucesso, o problema pode ser devido à conclusão de nomes (name completion) no cliente **mysql**. Para contornar esse problema, inicie o cliente **mysql** com a opção `--skip-auto-rehash` e tente o `DROP TABLE` novamente. (Com a conclusão de nomes ativada, o **mysql** tenta construir uma lista de nomes de tabelas, o que falha quando existe um problema como o que acabamos de descrever.)

#### Não é Possível Abrir o Datafile

Com `innodb_file_per_table` habilitado (o padrão), as seguintes mensagens podem aparecer na inicialização se um arquivo de tablespace file-per-table (arquivo `.ibd`) estiver ausente:

```sql
[ERROR] InnoDB: Operating system error number 2 in a file operation.
[ERROR] InnoDB: The error means the system cannot find the path specified.
[ERROR] InnoDB: Cannot open datafile for read-only: './test/t1.ibd' OS error: 71
[Warning] InnoDB: Ignoring tablespace `test/t1` because it could not be opened.
```

Para resolver estas mensagens, execute uma instrução `DROP TABLE` para remover os dados sobre a tabela ausente do data dictionary.

#### Erro de Não é Possível Abrir o Arquivo

Outro sintoma de um data dictionary dessincronizado é o MySQL imprimir um erro indicando que não pode abrir um arquivo `InnoDB`:

```sql
ERROR 1016: Can't open file: 'child2.ibd'. (errno: 1)
```

No log de erros você pode encontrar uma mensagem como esta:

```sql
InnoDB: Cannot find table test/child2 from the internal data dictionary
InnoDB: of InnoDB though the .frm file for the table exists. Maybe you
InnoDB: have deleted and recreated InnoDB data files but have forgotten
InnoDB: to delete the corresponding .frm files of InnoDB tables?
```

Isso significa que existe um arquivo `.frm` órfão sem uma tabela correspondente dentro do `InnoDB`. Você pode remover (drop) o arquivo `.frm` órfão excluindo-o manualmente.

#### Tabelas Intermediárias Órfãs

Se o MySQL encerrar no meio de uma operação `ALTER TABLE` in-place (`ALGORITHM=INPLACE`), você pode ficar com uma tabela intermediária órfã que ocupa espaço em seu sistema. Além disso, uma tabela intermediária órfã em um general tablespace vazio impede que você remova o general tablespace. Esta seção descreve como identificar e remover tabelas intermediárias órfãs.

Os nomes das tabelas intermediárias começam com um prefixo `#sql-ib` (por exemplo, `#sql-ib87-856498050`). O arquivo `.frm` que o acompanha tem um prefixo `#sql-*` e é nomeado de forma diferente (por exemplo, `#sql-36ab_2.frm`).

Para identificar tabelas intermediárias órfãs em seu sistema, você pode consultar a tabela `INNODB_SYS_TABLES` do Information Schema. Procure nomes de tabelas que comecem com `#sql`. Se a tabela original residir em um tablespace file-per-table, o arquivo de tablespace (o arquivo `#sql-*.ibd`) para a tabela intermediária órfã deve estar visível no diretório do database.

```sql
SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_TABLES WHERE NAME LIKE '%#sql%';
```

Para remover uma tabela intermediária órfã, execute os seguintes passos:

1. No diretório do database, renomeie o arquivo `#sql-*.frm` para corresponder ao nome base da tabela intermediária órfã:

   ```sql
   $> mv #sql-36ab_2.frm #sql-ib87-856498050.frm
   ```

   Nota

   Se não houver um arquivo `.frm`, você pode recriá-lo. O arquivo `.frm` deve ter o mesmo table schema da tabela intermediária órfã (deve ter as mesmas columns e indexes) e deve ser colocado no diretório do database da tabela intermediária órfã.

2. Remova (drop) a tabela intermediária órfã executando uma instrução `DROP TABLE`, prefixando o nome da tabela com `#mysql50#` e envolvendo o nome da tabela em backticks (apóstrofos invertidos). Por exemplo:

   ```sql
   mysql> DROP TABLE `#mysql50##sql-ib87-856498050`;
   ```

   O prefixo `#mysql50#` instrui o MySQL a ignorar a `file name safe encoding` (codificação de nome de arquivo segura) introduzida no MySQL 5.1. Envolver o nome da tabela em backticks é necessário para executar instruções SQL em nomes de tabela com caracteres especiais como “#”.

Nota

Se ocorrer um encerramento inesperado durante uma operação `ALTER TABLE` in-place que estava movendo uma tabela para um tablespace diferente, o processo de recuperação restaura a tabela para sua localização original, mas deixa uma tabela intermediária órfã no tablespace de destino.

Nota

Se o MySQL encerrar no meio de uma operação `ALTER TABLE` in-place em uma tabela particionada, você pode ficar com múltiplas tabelas intermediárias órfãs, uma por partition. Neste caso, use o seguinte procedimento para remover as tabelas intermediárias órfãs:

1. Em uma instância separada da mesma versão do MySQL, crie uma tabela não particionada com o mesmo schema name e columns da tabela particionada.

2. Copie o arquivo `.frm` da tabela não particionada para o diretório do database contendo as tabelas intermediárias órfãs.

3. Crie uma cópia do arquivo `.frm` para cada tabela e renomeie os arquivos `.frm` para corresponder aos nomes das tabelas intermediárias órfãs (conforme descrito acima).

4. Execute uma operação `DROP TABLE` (conforme descrito acima) para cada tabela.

#### Tabelas Temporárias Órfãs

Se o MySQL encerrar no meio de uma operação `ALTER TABLE` de cópia de tabela (`ALGORITHM=COPY`), você pode ficar com uma tabela temporária órfã que ocupa espaço em seu sistema. Além disso, uma tabela temporária órfã em um general tablespace vazio impede que você remova o general tablespace. Esta seção descreve como identificar e remover tabelas temporárias órfãs.

Os nomes das tabelas temporárias órfãs começam com um prefixo `#sql-` (por exemplo, `#sql-540_3`). O arquivo `.frm` que o acompanha tem o mesmo nome base da tabela temporária órfã.

Nota

Se não houver um arquivo `.frm`, você pode recriá-lo. O arquivo `.frm` deve ter o mesmo table schema da tabela temporária órfã (deve ter as mesmas columns e indexes) e deve ser colocado no diretório do database da tabela temporária órfã.

Para identificar tabelas temporárias órfãs em seu sistema, você pode consultar a tabela `INNODB_SYS_TABLES` do Information Schema. Procure nomes de tabelas que comecem com `#sql`. Se a tabela original residir em um tablespace file-per-table, o arquivo de tablespace (o arquivo `#sql-*.ibd`) para a tabela temporária órfã deve estar visível no diretório do database.

```sql
SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_TABLES WHERE NAME LIKE '%#sql%';
```

Para remover uma tabela temporária órfã, remova a tabela executando uma instrução `DROP TABLE`, prefixando o nome da tabela com `#mysql50#` e envolvendo o nome da tabela em backticks. Por exemplo:

```sql
mysql> DROP TABLE `#mysql50##sql-540_3`;
```

O prefixo `#mysql50#` instrui o MySQL a ignorar a `file name safe encoding` introduzida no MySQL 5.1. Envolver o nome da tabela em backticks é necessário para executar instruções SQL em nomes de tabela com caracteres especiais como “#”.

Nota

Se o MySQL encerrar no meio de uma operação `ALTER TABLE` de cópia de tabela em uma tabela particionada, você pode ficar com múltiplas tabelas temporárias órfãs, uma por partition. Neste caso, use o seguinte procedimento para remover as tabelas temporárias órfãs:

1. Em uma instância separada da mesma versão do MySQL, crie uma tabela não particionada com o mesmo schema name e columns da tabela particionada.

2. Copie o arquivo `.frm` da tabela não particionada para o diretório do database contendo as tabelas temporárias órfãs.

3. Crie uma cópia do arquivo `.frm` para cada tabela e renomeie os arquivos `.frm` para corresponder aos nomes das tabelas temporárias órfãs (conforme descrito acima).

4. Execute uma operação `DROP TABLE` (conforme descrito acima) para cada tabela.

#### Tablespace Não Existe

Com `innodb_file_per_table` habilitado, a seguinte mensagem pode ocorrer se os arquivos `.frm` ou `.ibd` (ou ambos) estiverem faltando:

```sql
InnoDB: in InnoDB data dictionary has tablespace id N,
InnoDB: but tablespace with that id or name does not exist. Have
InnoDB: you deleted or moved .ibd files?
InnoDB: This may also be a table created with CREATE TEMPORARY TABLE
InnoDB: whose .ibd and .frm files MySQL automatically removed, but the
InnoDB: table still exists in the InnoDB internal data dictionary.
```

Se isso ocorrer, tente o seguinte procedimento para resolver o problema:

1. Crie um arquivo `.frm` correspondente em algum outro diretório de database e copie-o para o diretório de database onde a tabela órfã está localizada.

2. Execute `DROP TABLE` para a tabela original. Isso deve remover a tabela com sucesso e o `InnoDB` deve imprimir um aviso no log de erros indicando que o arquivo `.ibd` estava faltando.

#### Restaurando Arquivos ibd Órfãos File-Per-Table

Este procedimento descreve como restaurar arquivos `.ibd` órfãos file-per-table em outra instância do MySQL. Você pode usar este procedimento se o system tablespace for perdido ou irrecuperável e você desejar restaurar backups de arquivos `.ibd` em uma nova instância do MySQL.

O procedimento não é suportado para arquivos `.ibd` de general tablespace.

O procedimento assume que você tem apenas backups de arquivos `.ibd`, que está se recuperando para a mesma versão do MySQL que criou inicialmente os arquivos `.ibd` órfãos e que os backups dos arquivos `.ibd` estão "clean" (limpos). Consulte a Seção 14.6.1.4, “Movendo ou Copiando Tabelas InnoDB” para obter informações sobre a criação de backups limpos.

As limitações de importação de tabela descritas na Seção 14.6.1.3, “Importando Tabelas InnoDB”, são aplicáveis a este procedimento.

1. Na nova instância do MySQL, recrie a tabela em um database com o mesmo nome.

   ```sql
   mysql> CREATE DATABASE sakila;

   mysql> USE sakila;

   mysql> CREATE TABLE actor (
            actor_id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
            first_name VARCHAR(45) NOT NULL,
            last_name VARCHAR(45) NOT NULL,
            last_update TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY  (actor_id),
            KEY idx_actor_last_name (last_name)
          )ENGINE=InnoDB DEFAULT CHARSET=utf8;
   ```

2. Descarte o tablespace da tabela recém-criada.

   ```sql
   mysql> ALTER TABLE sakila.actor DISCARD TABLESPACE;
   ```

3. Copie o arquivo `.ibd` órfão do seu diretório de backup para o novo diretório do database.

   ```sql
   $> cp /backup_directory/actor.ibd path/to/mysql-5.7/data/sakila/
   ```

4. Certifique-se de que o arquivo `.ibd` tenha as permissões de arquivo necessárias.

5. Importe o arquivo `.ibd` órfão. Um aviso é emitido indicando que o `InnoDB` tentará importar o arquivo sem verificação de schema.

   ```sql
   mysql> ALTER TABLE sakila.actor IMPORT TABLESPACE; SHOW WARNINGS;
   Query OK, 0 rows affected, 1 warning (0.15 sec)

   Warning | 1810 | InnoDB: IO Read error: (2, No such file or directory)
   Error opening './sakila/actor.cfg', will attempt to import
   without schema verification
   ```

6. Consulte a tabela (Query) para verificar se o arquivo `.ibd` foi restaurado com sucesso.

   ```sql
   mysql> SELECT COUNT(*) FROM sakila.actor;
   +----------+
   | count(*) |
   +----------+
   |      200 |
   +----------+
   ```