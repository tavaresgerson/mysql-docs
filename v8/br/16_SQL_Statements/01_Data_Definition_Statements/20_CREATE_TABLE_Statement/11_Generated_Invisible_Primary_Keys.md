#### 15.1.20.11 Chaves primárias invisíveis geradas

A partir do MySQL 8.0.30, o MySQL suporta chaves primárias geradas invisíveis para qualquer tabela `InnoDB` que seja criada sem uma chave primária explícita. Quando a variável de sistema do servidor `sql_generate_invisible_primary_key` é definida como `ON`, o servidor MySQL adiciona automaticamente uma chave primária invisível gerada (GIPK) a qualquer tabela desse tipo. Esta configuração não tem efeito em tabelas criadas usando qualquer outro mecanismo de armazenamento além de `InnoDB`.

Por padrão, o valor de `sql_generate_invisible_primary_key` é `OFF`, o que significa que a adição automática de GIPKs está desativada. Para ilustrar como isso afeta a criação de tabelas, começamos criando duas tabelas idênticas, nenhuma das quais tem uma chave primária, a única diferença sendo que a primeira (tabela `auto_0`) é criada com `sql_generate_invisible_primary_key` definido como `OFF`, e a segunda (`auto_1`) após defini-la como `ON`, como mostrado aqui:

```
mysql> SELECT @@sql_generate_invisible_primary_key;
+--------------------------------------+
| @@sql_generate_invisible_primary_key |
+--------------------------------------+
|                                    0 |
+--------------------------------------+
1 row in set (0.00 sec)

mysql> CREATE TABLE auto_0 (c1 VARCHAR(50), c2 INT);
Query OK, 0 rows affected (0.02 sec)

mysql> SET sql_generate_invisible_primary_key=ON;
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT @@sql_generate_invisible_primary_key;
+--------------------------------------+
| @@sql_generate_invisible_primary_key |
+--------------------------------------+
|                                    1 |
+--------------------------------------+
1 row in set (0.00 sec)

mysql> CREATE TABLE auto_1 (c1 VARCHAR(50), c2 INT);
Query OK, 0 rows affected (0.04 sec)
```

Compare a saída dessas declarações `SHOW CREATE TABLE` para ver a diferença na forma como as tabelas foram realmente criadas:

```
mysql> SHOW CREATE TABLE auto_0\G
*************************** 1. row ***************************
       Table: auto_0
Create Table: CREATE TABLE `auto_0` (
  `c1` varchar(50) DEFAULT NULL,
  `c2` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
1 row in set (0.00 sec)

mysql> SHOW CREATE TABLE auto_1\G
*************************** 1. row ***************************
       Table: auto_1
Create Table: CREATE TABLE `auto_1` (
  `my_row_id` bigint unsigned NOT NULL AUTO_INCREMENT /*!80023 INVISIBLE */,
  `c1` varchar(50) DEFAULT NULL,
  `c2` int DEFAULT NULL,
  PRIMARY KEY (`my_row_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
1 row in set (0.00 sec)
```

Como o `auto_1` não tinha uma chave primária especificada pela declaração `CREATE TABLE` usada para criá-lo, definir o `sql_generate_invisible_primary_key = ON` faz com que o MySQL adicione tanto a coluna invisível `my_row_id` a essa tabela quanto uma chave primária nessa coluna. Como o `sql_generate_invisible_primary_key` era `OFF` no momento em que o `auto_0` foi criado, nenhuma adição foi realizada nessa tabela.

Quando uma chave primária é adicionada a uma tabela pelo servidor, o nome da coluna e da chave é sempre `my_row_id`. Por essa razão, ao habilitar chaves primárias geradas invisíveis dessa maneira, você não pode criar uma tabela com uma coluna chamada `my_row_id`, a menos que a instrução de criação da tabela também especifique uma chave primária explícita. (Nesse caso, você não precisa nomear a coluna ou a chave `my_row_id`.)

`my_row_id` é uma coluna invisível, o que significa que ela não é exibida na saída de `SELECT *` ou `TABLE`; a coluna deve ser selecionada explicitamente pelo nome. Veja a Seção 15.1.20.10, “Colunas Invisíveis”.

Quando os GIPKs estão habilitados, uma chave primária gerada não pode ser alterada, exceto para alterná-la entre `VISIBLE` e `INVISIBLE`. Para tornar a chave primária gerada invisível em `auto_1` visível, execute esta instrução `ALTER TABLE`:

```
mysql> ALTER TABLE auto_1 ALTER COLUMN my_row_id SET VISIBLE;
Query OK, 0 rows affected (0.02 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> SHOW CREATE TABLE auto_1\G
*************************** 1. row ***************************
       Table: auto_1
Create Table: CREATE TABLE `auto_1` (
  `my_row_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `c1` varchar(50) DEFAULT NULL,
  `c2` int DEFAULT NULL,
  PRIMARY KEY (`my_row_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
1 row in set (0.01 sec)
```

Para tornar essa chave primária gerada invisível novamente, execute `ALTER TABLE auto_1 ALTER COLUMN my_row_id SET INVISIBLE`.

Uma chave primária primária gerada é sempre invisível por padrão.

Sempre que os GIPKs estiverem habilitados, você não poderá descartar uma chave primária gerada se uma das seguintes 2 condições resultar:

- A tabela fica sem chave primária.
- A chave primária foi removida, mas a coluna da chave primária não foi.

Os efeitos de `sql_generate_invisible_primary_key` se aplicam apenas a tabelas que utilizam o mecanismo de armazenamento `InnoDB`. Você pode usar uma instrução `ALTER TABLE` para alterar o mecanismo de armazenamento usado por uma tabela que possui uma chave primária invisível gerada; nesse caso, a chave primária e a coluna permanecem no lugar, mas a tabela e a chave não recebem mais nenhum tratamento especial.

Por padrão, as GIPKs são exibidas na saída de `SHOW CREATE TABLE`, `SHOW COLUMNS` e `SHOW INDEX`, e são visíveis nas tabelas do esquema de informações `COLUMNS` e `STATISTICS`. Você pode fazer com que as chaves primárias geradas sejam ocultas em vez disso, configurando a variável de sistema `show_gipk_in_create_table_and_information_schema` para `OFF`. Por padrão, essa variável é `ON`, conforme mostrado aqui:

```
mysql> SELECT @@show_gipk_in_create_table_and_information_schema;
+----------------------------------------------------+
| @@show_gipk_in_create_table_and_information_schema |
+----------------------------------------------------+
|                                                  1 |
+----------------------------------------------------+
1 row in set (0.00 sec)
```

Como pode ser visto na consulta a seguir contra a tabela `COLUMNS`, `my_row_id` é visível entre as colunas de `auto_1`:

```
mysql> SELECT COLUMN_NAME, ORDINAL_POSITION, DATA_TYPE, COLUMN_KEY
    -> FROM INFORMATION_SCHEMA.COLUMNS
    -> WHERE TABLE_NAME = "auto_1";
+-------------+------------------+-----------+------------+
| COLUMN_NAME | ORDINAL_POSITION | DATA_TYPE | COLUMN_KEY |
+-------------+------------------+-----------+------------+
| my_row_id   |                1 | bigint    | PRI        |
| c1          |                2 | varchar   |            |
| c2          |                3 | int       |            |
+-------------+------------------+-----------+------------+
3 rows in set (0.01 sec)
```

Depois que `show_gipk_in_create_table_and_information_schema` é definido como `OFF`, `my_row_id` não pode mais ser visto na tabela `COLUMNS`, conforme mostrado aqui:

```
mysql> SET show_gipk_in_create_table_and_information_schema = OFF;
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT @@show_gipk_in_create_table_and_information_schema;
+----------------------------------------------------+
| @@show_gipk_in_create_table_and_information_schema |
+----------------------------------------------------+
|                                                  0 |
+----------------------------------------------------+
1 row in set (0.00 sec)

mysql> SELECT COLUMN_NAME, ORDINAL_POSITION, DATA_TYPE, COLUMN_KEY
    -> FROM INFORMATION_SCHEMA.COLUMNS
    -> WHERE TABLE_NAME = "auto_1";
+-------------+------------------+-----------+------------+
| COLUMN_NAME | ORDINAL_POSITION | DATA_TYPE | COLUMN_KEY |
+-------------+------------------+-----------+------------+
| c1          |                2 | varchar   |            |
| c2          |                3 | int       |            |
+-------------+------------------+-----------+------------+
2 rows in set (0.00 sec)
```

O cenário para `sql_generate_invisible_primary_key` não é replicado e é ignorado pelas threads do aplicativo de replicação. Isso significa que a definição dessa variável na fonte não tem efeito na replica. No MySQL 8.0.32 e versões posteriores, você pode fazer com que a replica adicione um GIPK para tabelas replicadas sem chaves primárias em um determinado canal de replicação usando `REQUIRE_TABLE_PRIMARY_KEY_CHECK = GENERATE` como parte de uma instrução `CHANGE REPLICATION SOURCE TO`.

Os GIPKs trabalham com replicação baseada em linhas do `CREATE TABLE ... SELECT`; as informações escritas no log binário para essa declaração, nesses casos, incluem a definição do GIPK e, portanto, são replicadas corretamente. A replicação baseada em declarações do `CREATE TABLE ... SELECT` não é suportada com o `sql_generate_invisible_primary_key = ON`.

Ao criar ou importar backups de instalações onde os GIPKs estão em uso, é possível excluir as colunas e valores primárias invisíveis gerados. A opção `--skip-generated-invisible-primary-key` para o **mysqldump** faz com que as informações do GIPK sejam excluídas na saída do programa. Se você estiver importando um arquivo de dump que contém chaves primárias invisíveis e valores gerados, também pode usar `--skip-generated-invisible-primary-key` com o **mysqlpump** para suprimi-los (e, portanto, não serem importados).
