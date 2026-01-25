#### 14.6.1.1 Criando Tabelas InnoDB

Tabelas `InnoDB` são criadas usando a instrução `CREATE TABLE`; por exemplo:

```sql
CREATE TABLE t1 (a INT, b CHAR (20), PRIMARY KEY (a)) ENGINE=InnoDB;
```

A cláusula `ENGINE=InnoDB` não é obrigatória quando o `InnoDB` é definido como o *default storage engine*, o que acontece por default. No entanto, a cláusula `ENGINE` é útil caso a instrução `CREATE TABLE` precise ser reexecutada em uma instância diferente do MySQL Server onde o *default storage engine* não é `InnoDB` ou é desconhecido. Você pode determinar o *default storage engine* em uma instância do MySQL Server emitindo a seguinte instrução:

```sql
mysql> SELECT @@default_storage_engine;
+--------------------------+
| @@default_storage_engine |
+--------------------------+
| InnoDB                   |
+--------------------------+
```

Tabelas `InnoDB` são criadas em *tablespaces* `file-per-table` por default. Para criar uma tabela `InnoDB` no *system tablespace* do `InnoDB`, desabilite a variável `innodb_file_per_table` antes de criar a tabela. Para criar uma tabela `InnoDB` em um *general tablespace*, use a sintaxe `CREATE TABLE ... TABLESPACE`. Para mais informações, consulte a Seção 14.6.3, “Tablespaces”.

##### Arquivos .frm

O MySQL armazena informações do *data dictionary* para tabelas em arquivos `.frm` nos diretórios do Database. Diferentemente de outros *storage engines* do MySQL, o `InnoDB` também codifica informações sobre a tabela em seu próprio *data dictionary* interno, dentro do *system tablespace*. Quando o MySQL descarta (drop) uma tabela ou um Database, ele exclui um ou mais arquivos `.frm`, bem como as entradas correspondentes dentro do *data dictionary* do `InnoDB`. Você não pode mover tabelas `InnoDB` entre Databases simplesmente movendo os arquivos `.frm`. Para obter informações sobre como mover tabelas `InnoDB`, consulte a Seção 14.6.1.4, “Movendo ou Copiando Tabelas InnoDB”.

##### Formatos de Linha (Row Formats)

O *Row Format* de uma tabela `InnoDB` determina como suas linhas são armazenadas fisicamente no disco. O `InnoDB` suporta quatro *Row Formats*, cada um com características de armazenamento diferentes. Os *Row Formats* suportados incluem `REDUNDANT`, `COMPACT`, `DYNAMIC` e `COMPRESSED`. O *Row Format* `DYNAMIC` é o default. Para obter informações sobre as características de *Row Format*, consulte a Seção 14.11, “InnoDB Row Formats”.

A variável `innodb_default_row_format` define o *default Row Format*. O *Row Format* de uma tabela também pode ser definido explicitamente usando a opção de tabela `ROW_FORMAT` em uma instrução `CREATE TABLE` ou `ALTER TABLE`. Consulte Definindo o Row Format de uma Tabela.

##### Chaves Primárias (Primary Keys)

É recomendado que você defina uma *Primary Key* para cada tabela que criar. Ao selecionar colunas para a *Primary Key*, escolha colunas com as seguintes características:

*   Colunas que são referenciadas pelas *Queries* mais importantes.
*   Colunas que nunca são deixadas em branco.
*   Colunas que nunca têm valores duplicados.
*   Colunas que raramente, ou nunca, mudam de valor após serem inseridas.

Por exemplo, em uma tabela contendo informações sobre pessoas, você não criaria uma *Primary Key* em `(firstname, lastname)` porque mais de uma pessoa pode ter o mesmo nome, uma coluna de nome pode ser deixada em branco e, às vezes, as pessoas mudam seus nomes. Com tantas restrições, muitas vezes não há um conjunto óbvio de colunas para usar como *Primary Key*, então você cria uma nova coluna com um ID numérico para servir como a *Primary Key* completa ou parcial. Você pode declarar uma coluna *auto-increment* para que valores crescentes sejam preenchidos automaticamente conforme as linhas são inseridas:

```sql
# The value of ID can act like a pointer between related items in different tables.
CREATE TABLE t5 (id INT AUTO_INCREMENT, b CHAR (20), PRIMARY KEY (id));

# The primary key can consist of more than one column. Any autoinc column must come first.
CREATE TABLE t6 (id INT AUTO_INCREMENT, a INT, b CHAR (20), PRIMARY KEY (id,a));
```

Para mais informações sobre colunas *auto-increment*, consulte a Seção 14.6.1.6, “AUTO_INCREMENT Handling in InnoDB”.

Embora uma tabela funcione corretamente sem definir uma *Primary Key*, a *Primary Key* está envolvida em muitos aspectos de performance e é um aspecto de design crucial para qualquer tabela grande ou frequentemente usada. É recomendado que você sempre especifique uma *Primary Key* na instrução `CREATE TABLE`. Se você criar a tabela, carregar dados e depois executar `ALTER TABLE` para adicionar uma *Primary Key* posteriormente, essa operação é muito mais lenta do que definir a *Primary Key* ao criar a tabela. Para mais informações sobre *Primary Keys*, consulte a Seção 14.6.2.1, “Clustered and Secondary Indexes”.

##### Visualizando Propriedades de Tabelas InnoDB

Para visualizar as propriedades de uma tabela `InnoDB`, emita uma instrução `SHOW TABLE STATUS`:

```sql
mysql> SHOW TABLE STATUS FROM test LIKE 't%' \G;
*************************** 1. row ***************************
           Name: t1
         Engine: InnoDB
        Version: 10
     Row_format: Dynamic
           Rows: 0
 Avg_row_length: 0
    Data_length: 16384
Max_data_length: 0
   Index_length: 0
      Data_free: 0
 Auto_increment: NULL
    Create_time: 2021-02-18 12:18:28
    Update_time: NULL
     Check_time: NULL
      Collation: utf8mb4_0900_ai_ci
       Checksum: NULL
 Create_options:
        Comment:
```

Para informações sobre a saída de `SHOW TABLE STATUS`, consulte a Seção 13.7.5.36, “SHOW TABLE STATUS Statement”.

Você também pode acessar as propriedades de tabelas `InnoDB` consultando as tabelas de sistema do *Information Schema* do `InnoDB`:

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_TABLES WHERE NAME='test/t1' \G
*************************** 1. row ***************************
     TABLE_ID: 45
         NAME: test/t1
         FLAG: 1
       N_COLS: 5
        SPACE: 35
  FILE_FORMAT: Barracuda
   ROW_FORMAT: Dynamic
ZIP_PAGE_SIZE: 0
   SPACE_TYPE: Single
```

Para mais informações, consulte a Seção 14.16.3, “InnoDB INFORMATION_SCHEMA System Tables”.