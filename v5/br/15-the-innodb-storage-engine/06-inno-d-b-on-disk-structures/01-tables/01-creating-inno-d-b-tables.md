#### 14.6.1.1 Criando tabelas InnoDB

As tabelas do `InnoDB` são criadas usando a instrução `CREATE TABLE`; por exemplo:

```sql
CREATE TABLE t1 (a INT, b CHAR (20), PRIMARY KEY (a)) ENGINE=InnoDB;
```

A cláusula `ENGINE=InnoDB` não é necessária quando `InnoDB` é definido como o motor de armazenamento padrão, o que é o caso por padrão. No entanto, a cláusula `ENGINE` é útil se a instrução `CREATE TABLE` for reexecutada em uma instância diferente do servidor MySQL, onde o motor de armazenamento padrão não for `InnoDB` ou não seja conhecido. Você pode determinar o motor de armazenamento padrão em uma instância do servidor MySQL executando a seguinte instrução:

```sql
mysql> SELECT @@default_storage_engine;
+--------------------------+
| @@default_storage_engine |
+--------------------------+
| InnoDB                   |
+--------------------------+
```

As tabelas `InnoDB` são criadas por padrão em espaços de tabelas por arquivo. Para criar uma tabela `InnoDB` no espaço de tabelas `InnoDB`, desative a variável `innodb_file_per_table` antes de criar a tabela. Para criar uma tabela `InnoDB` em um espaço de tabelas geral, use a sintaxe `CREATE TABLE ... TABLESPACE`. Para obter mais informações, consulte a Seção 14.6.3, “Espaços de tabelas”.

##### Arquivos .frm

O MySQL armazena informações do dicionário de dados para tabelas em arquivos .frm nos diretórios do banco de dados. Ao contrário de outros motores de armazenamento do MySQL, o `InnoDB` também codifica informações sobre a tabela em seu próprio dicionário de dados interno dentro do espaço de tabela do sistema. Quando o MySQL exclui uma tabela ou um banco de dados, ele exclui um ou mais arquivos .frm, bem como as entradas correspondentes dentro do dicionário de dados do `InnoDB`. Você não pode mover tabelas `InnoDB` entre bancos simplesmente movendo os arquivos .frm. Para obter informações sobre como mover tabelas `InnoDB`, consulte a Seção 14.6.1.4, “Movendo ou Copiando Tabelas \`InnoDB’”.

##### Formatos de linhas

O formato de linha de uma tabela `InnoDB` determina como suas linhas são armazenadas fisicamente no disco. O `InnoDB` suporta quatro formatos de linha, cada um com características de armazenamento diferentes. Os formatos de linha suportados incluem `REDUNDANT`, `COMPACT`, `DYNAMIC` e `COMPRESSED`. O formato de linha `DYNAMIC` é o padrão. Para informações sobre as características dos formatos de linha, consulte a Seção 14.11, “Formatos de Linha do InnoDB”.

A variável `innodb_default_row_format` define o formato de linha padrão. O formato de linha de uma tabela também pode ser definido explicitamente usando a opção `ROW_FORMAT` da tabela em uma declaração `CREATE TABLE` ou `ALTER TABLE`. Veja Definindo o Formato de Linha de uma Tabela.

##### Chaves Primárias

Recomenda-se que você defina uma chave primária para cada tabela que você criar. Ao selecionar as colunas da chave primária, escolha colunas com as seguintes características:

- Colunas que são referenciadas pelas consultas mais importantes.
- Colunas que nunca ficam em branco.
- Colunas que nunca têm valores duplicados.
- Colunas que raramente, ou nunca, mudam de valor uma vez inseridas.

Por exemplo, em uma tabela que contém informações sobre pessoas, você não criaria uma chave primária em `(nome_de_sobrenome, nome_de_primeiro_nome)` porque mais de uma pessoa pode ter o mesmo nome, uma coluna de nome pode ficar em branco e, às vezes, as pessoas mudam seus nomes. Com tantas restrições, muitas vezes não há um conjunto óbvio de colunas para usar como chave primária, então você cria uma nova coluna com um ID numérico para servir como toda ou parte da chave primária. Você pode declarar uma coluna de autoincremento para que os valores crescentes sejam preenchidos automaticamente à medida que as linhas são inseridas:

```sql
# The value of ID can act like a pointer between related items in different tables.
CREATE TABLE t5 (id INT AUTO_INCREMENT, b CHAR (20), PRIMARY KEY (id));

# The primary key can consist of more than one column. Any autoinc column must come first.
CREATE TABLE t6 (id INT AUTO_INCREMENT, a INT, b CHAR (20), PRIMARY KEY (id,a));
```

Para obter mais informações sobre colunas de autoincremento, consulte a Seção 14.6.1.6, “Tratamento de AUTO_INCREMENT no InnoDB”.

Embora uma tabela funcione corretamente sem definir uma chave primária, a chave primária está envolvida em muitos aspectos do desempenho e é um aspecto de design crucial para qualquer tabela grande ou frequentemente usada. Recomenda-se que você sempre especifique uma chave primária na instrução `CREATE TABLE`. Se você criar a tabela, carregar dados e, em seguida, executar `ALTER TABLE` para adicionar uma chave primária mais tarde, essa operação é muito mais lenta do que definir a chave primária ao criar a tabela. Para mais informações sobre chaves primárias, consulte a Seção 14.6.2.1, “Indekses Agrupados e Secundários”.

##### Visualizar propriedades da tabela InnoDB

Para visualizar as propriedades de uma tabela `InnoDB`, execute a instrução `SHOW TABLE STATUS`.

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

Para obter informações sobre a saída do comando `SHOW TABLE STATUS`, consulte a Seção 13.7.5.36, “Instrução SHOW TABLE STATUS”.

Você também pode acessar as propriedades da tabela `InnoDB` consultando as tabelas do esquema de informações do `InnoDB`:

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

Para obter mais informações, consulte a Seção 14.16.3, “Tabelas do Sistema InnoDB INFORMATION_SCHEMA”.
