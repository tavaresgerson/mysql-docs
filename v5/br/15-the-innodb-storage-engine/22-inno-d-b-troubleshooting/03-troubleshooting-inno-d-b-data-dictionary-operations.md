### 14.22.3 Solução de problemas nas operações do Dicionário de Dados InnoDB

As informações sobre as definições da tabela são armazenadas tanto nos arquivos `.frm` quanto no dicionário de dados do InnoDB. Se você mover os arquivos `.frm` ou se o servidor falhar durante uma operação no dicionário de dados, essas fontes de informações podem se tornar inconsistentes.

Se uma corrupção do dicionário de dados ou um problema de consistência impedir que você inicie o `InnoDB`, consulte a Seção 14.22.2, “Forçando a Recuperação do InnoDB” para obter informações sobre a recuperação manual.

#### Crie uma tabela de falha devido à tabela órfã

Um sintoma de um dicionário de dados desatualizado é que uma instrução `CREATE TABLE` falha. Se isso ocorrer, verifique o log de erro do servidor. Se o log indicar que a tabela já existe no dicionário de dados interno `InnoDB`, você tem uma tabela órfã dentro dos arquivos do espaço de tabelas `InnoDB` que não tem o arquivo `.frm` correspondente. A mensagem de erro parece assim:

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

Você pode excluir a tabela órfã seguindo as instruções fornecidas na mensagem de erro. Se você ainda não conseguir usar o `DROP TABLE` com sucesso, o problema pode estar relacionado à complementação de nomes no cliente **mysql**. Para contornar esse problema, inicie o cliente **mysql** com a opção `--skip-auto-rehash` e tente usar `DROP TABLE` novamente. (Com a complementação de nomes ativada, o **mysql** tenta construir uma lista de nomes de tabelas, o que falha quando existe um problema como o descrito.)

#### Não é possível abrir o arquivo de dados

Com `innodb_file_per_table` ativado (o padrão), as seguintes mensagens podem aparecer durante o início se um arquivo do espaço de tabelas por arquivo (arquivo `.ibd`) estiver faltando:

```sql
[ERROR] InnoDB: Operating system error number 2 in a file operation.
[ERROR] InnoDB: The error means the system cannot find the path specified.
[ERROR] InnoDB: Cannot open datafile for read-only: './test/t1.ibd' OS error: 71
[Warning] InnoDB: Ignoring tablespace `test/t1` because it could not be opened.
```

Para lidar com essas mensagens, execute a instrução `DROP TABLE` para remover os dados sobre a tabela ausente do dicionário de dados.

#### Erro de não conseguir abrir o arquivo

Outro sintoma de um dicionário de dados desatualizado é que o MySQL exibe um erro indicando que não consegue abrir um arquivo `InnoDB`:

```sql
ERROR 1016: Can't open file: 'child2.ibd'. (errno: 1)
```

No log de erros, você pode encontrar uma mensagem como esta:

```sql
InnoDB: Cannot find table test/child2 from the internal data dictionary
InnoDB: of InnoDB though the .frm file for the table exists. Maybe you
InnoDB: have deleted and recreated InnoDB data files but have forgotten
InnoDB: to delete the corresponding .frm files of InnoDB tables?
```

Isso significa que há um arquivo `.frm` órfão sem uma tabela correspondente dentro do `InnoDB`. Você pode descartar o arquivo `.frm` órfão excluindo-o manualmente.

#### Tabelas intermediárias de órfãos

Se o MySQL sair durante uma operação de alteração de tabela no local (`ALGORITHM=INPLACE`), você pode ficar com uma tabela intermediária órfã que ocupa espaço no seu sistema. Além disso, uma tabela intermediária órfã em um espaço de tabelas geral vazio impede que você elimine o espaço de tabelas geral. Esta seção descreve como identificar e remover tabelas intermediárias órfãs.

Os nomes das tabelas intermediárias começam com o prefixo `#sql-ib` (por exemplo, `#sql-ib87-856498050`). O arquivo `.frm` que as acompanha tem o prefixo `#sql-*` e tem um nome diferente (por exemplo, `#sql-36ab_2.frm`).

Para identificar tabelas intermediárias órfãs no seu sistema, você pode consultar a tabela do esquema de informações `INNODB_SYS_TABLES`. Procure por nomes de tabelas que comecem com `#sql`. Se a tabela original estiver em um espaço de tabelas por arquivo, o arquivo do espaço de tabelas (o arquivo `#sql-*.ibd`) da tabela intermediária órfã deve ser visível no diretório do banco de dados.

```sql
SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_TABLES WHERE NAME LIKE '%#sql%';
```

Para remover uma tabela intermediária órfã, siga os passos abaixo:

1. No diretório do banco de dados, renomeie o arquivo `#sql-*.frm` para corresponder ao nome base da tabela intermediária órfã:

   ```sql
   $> mv #sql-36ab_2.frm #sql-ib87-856498050.frm
   ```

   Nota

   Se não houver um arquivo `.frm`, você pode recriá-lo. O arquivo `.frm` deve ter o mesmo esquema de tabela que a tabela intermediária órfã (deve ter as mesmas colunas e índices) e deve estar localizado no diretório do banco de dados da tabela intermediária órfã.

2. Remova a tabela intermediária órfã emitindo uma declaração `DROP TABLE`, prefixando o nome da tabela com `#mysql50#` e envolvendo o nome da tabela em aspas duplas. Por exemplo:

   ```sql
   mysql> DROP TABLE `#mysql50##sql-ib87-856498050`;
   ```

   O prefixo `#mysql50#` indica ao MySQL que ignore a codificação segura de nomes de arquivos introduzida no MySQL 5.1. É necessário envolver o nome da tabela em aspas duplas para executar instruções SQL em nomes de tabelas com caracteres especiais, como “#”.

Nota

Se ocorrer uma saída inesperada durante uma operação de `ALTER TABLE` in-place que estava movendo uma tabela para um espaço de tabelas diferente, o processo de recuperação restaura a tabela à sua localização original, mas deixa uma tabela intermediária órfã no espaço de tabelas de destino.

Nota

Se o MySQL sair durante uma operação de alteração de tabela `ALTER TABLE` em uma tabela particionada, você pode ficar com várias tabelas intermediárias órfãs, uma por partição. Nesse caso, use o procedimento a seguir para remover as tabelas intermediárias órfãs:

1. Em uma instância separada da mesma versão do MySQL, crie uma tabela não particionada com o mesmo nome de esquema e colunas que a tabela particionada.

2. Copie o arquivo `.frm` da tabela não particionada para o diretório do banco de dados com as tabelas intermediárias órfãs.

3. Faça uma cópia do arquivo `.frm` para cada tabela e renomeie os arquivos `.frm` para corresponder aos nomes das tabelas intermediárias órfãs (como descrito acima).

4. Realize uma operação `DROP TABLE` (como descrito acima) para cada tabela.

#### Tabelas temporárias órfãs

Se o MySQL for encerrado durante uma operação de cópia de tabela `ALTER TABLE` (`ALGORITHM=COPY`), você pode ficar com uma tabela temporária órfã que ocupa espaço no seu sistema. Além disso, uma tabela temporária órfã em um espaço de tabelas geral vazio impede que você elimine o espaço de tabelas geral. Esta seção descreve como identificar e remover tabelas temporárias órfãs.

Os nomes de tabelas temporárias órfãs começam com o prefixo `#sql-` (por exemplo, `#sql-540_3`). O arquivo `.frm` que as acompanha tem o mesmo nome de base que a tabela temporária órfã.

Nota

Se não houver um arquivo `.frm`, você pode recriá-lo. O arquivo `.frm` deve ter o mesmo esquema de tabela que a tabela temporária órfã (deve ter as mesmas colunas e índices) e deve estar localizado no diretório do banco de dados da tabela temporária órfã.

Para identificar tabelas temporárias órfãs no seu sistema, você pode consultar a tabela do esquema de informações `INNODB_SYS_TABLES`. Procure por nomes de tabelas que comecem com `#sql`. Se a tabela original estiver em um espaço de tabelas por arquivo, o arquivo do espaço de tabelas (o arquivo `#sql-*.ibd`) da tabela temporária órfã deve ser visível no diretório do banco de dados.

```sql
SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_TABLES WHERE NAME LIKE '%#sql%';
```

Para remover uma tabela temporária órfã, elimine a tabela emitindo uma instrução `DROP TABLE`, prefixando o nome da tabela com `#mysql50#` e envolvendo o nome da tabela em aspas duplas. Por exemplo:

```sql
mysql> DROP TABLE `#mysql50##sql-540_3`;
```

O prefixo `#mysql50#` indica ao MySQL que ignore a codificação segura de nomes de arquivos introduzida no MySQL 5.1. É necessário envolver o nome da tabela em aspas duplas para executar instruções SQL em nomes de tabelas com caracteres especiais, como “#”.

Nota

Se o MySQL sair durante uma operação de cópia de tabela `ALTER TABLE` em uma tabela particionada, você pode ficar com várias tabelas temporárias órfãs, uma por partição. Nesse caso, use o procedimento a seguir para remover as tabelas temporárias órfãs:

1. Em uma instância separada da mesma versão do MySQL, crie uma tabela não particionada com o mesmo nome de esquema e colunas que a tabela particionada.

2. Copie o arquivo `.frm` da tabela não particionada para o diretório do banco de dados com as tabelas temporárias órfãs.

3. Faça uma cópia do arquivo `.frm` para cada tabela e renomeie os arquivos `.frm` para corresponder aos nomes das tabelas temporárias órfãs (como descrito acima).

4. Realize uma operação `DROP TABLE` (como descrito acima) para cada tabela.

#### Espaço de tabela não existe

Com `innodb_file_per_table` ativado, a seguinte mensagem pode ocorrer se os arquivos `.frm` ou `.ibd` (ou ambos) estiverem ausentes:

```sql
InnoDB: in InnoDB data dictionary has tablespace id N,
InnoDB: but tablespace with that id or name does not exist. Have
InnoDB: you deleted or moved .ibd files?
InnoDB: This may also be a table created with CREATE TEMPORARY TABLE
InnoDB: whose .ibd and .frm files MySQL automatically removed, but the
InnoDB: table still exists in the InnoDB internal data dictionary.
```

Se isso ocorrer, tente o procedimento a seguir para resolver o problema:

1. Crie um arquivo `.frm` correspondente em algum outro diretório de banco de dados e copie-o para o diretório do banco de dados onde a tabela órfã está localizada.

2. Emita a instrução `DROP TABLE` para a tabela original. Isso deve excluir com sucesso a tabela e o `InnoDB` deve imprimir um aviso no log de erro de que o arquivo `.ibd` estava ausente.

#### Restauração de arquivos órfãos - Arquivos ibd por tabela

Este procedimento descreve como restaurar arquivos `ibd` órfãos por tabela para outra instância do MySQL. Você pode usar este procedimento se o espaço de tabela do sistema for perdido ou irrecuperável e você quiser restaurar backups de arquivos `ibd` em uma nova instância do MySQL.

O procedimento não é suportado para arquivos gerais de espaço de tabela `.ibd`.

O procedimento pressupõe que você só tem backups de arquivos `.ibd`, que está recuperando para a mesma versão do MySQL que inicialmente criou os arquivos `.ibd` órfãos e que os backups de arquivos `.ibd` estão limpos. Consulte a Seção 14.6.1.4, “Movendo ou Copiando Tabelas InnoDB”, para obter informações sobre como criar backups limpos.

As limitações de importação de tabelas descritas na Seção 14.6.1.3, “Importação de Tabelas InnoDB”, são aplicáveis a este procedimento.

1. Na nova instância do MySQL, crie a tabela novamente em um banco de dados com o mesmo nome.

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

2. Descarte o espaço de tabela da tabela recém-criada.

   ```sql
   mysql> ALTER TABLE sakila.actor DISCARD TABLESPACE;
   ```

3. Copie o arquivo `ibd` órfão do seu diretório de backup para o novo diretório do banco de dados.

   ```sql
   $> cp /backup_directory/actor.ibd path/to/mysql-5.7/data/sakila/
   ```

4. Certifique-se de que o arquivo `.ibd` tenha as permissões de arquivo necessárias.

5. Importe o arquivo `.ibd` órfão. Um aviso é emitido indicando que o `InnoDB` tenta importar o arquivo sem verificação de esquema.

   ```sql
   mysql> ALTER TABLE sakila.actor IMPORT TABLESPACE; SHOW WARNINGS;
   Query OK, 0 rows affected, 1 warning (0.15 sec)

   Warning | 1810 | InnoDB: IO Read error: (2, No such file or directory)
   Error opening './sakila/actor.cfg', will attempt to import
   without schema verification
   ```

6. Verifique a tabela para confirmar se o arquivo `.ibd` foi restaurado com sucesso.

   ```sql
   mysql> SELECT COUNT(*) FROM sakila.actor;
   +----------+
   | count(*) |
   +----------+
   |      200 |
   +----------+
   ```
