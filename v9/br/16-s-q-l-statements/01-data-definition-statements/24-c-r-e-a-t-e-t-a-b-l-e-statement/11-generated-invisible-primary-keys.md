#### 15.1.24.11 Chaves Primárias Invisíveis Geradas

O MySQL 9.5 suporta chaves primárias invisíveis geradas para qualquer tabela `InnoDB` criada sem uma chave primária explícita. Quando a variável de sistema `sql_generate_invisible_primary_key` é definida como `ON`, o servidor MySQL adiciona automaticamente uma chave primária invisível gerada (GIPK) a qualquer tabela desse tipo. Esse ajuste não tem efeito em tabelas criadas usando qualquer outro mecanismo de armazenamento além do `InnoDB`.

Por padrão, o valor de `sql_generate_invisible_primary_key` é `OFF`, o que significa que a adição automática de GIPKs está desativada. Para ilustrar como isso afeta a criação de tabelas, começamos criando duas tabelas idênticas, nenhuma das quais tem uma chave primária, a única diferença sendo que a primeira (tabela `auto_0`) é criada com `sql_generate_invisible_primary_key` definido como `OFF`, e a segunda (`auto_1`) após ser definida como `ON`, como mostrado aqui:

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

Compare o resultado dessas declarações `SHOW CREATE TABLE` para ver a diferença na forma como as tabelas foram realmente criadas:

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

Como `auto_1` não tinha uma chave primária especificada pela declaração `CREATE TABLE` usada para criá-la, definir `sql_generate_invisible_primary_key = ON` faz com que o MySQL adicione tanto a coluna invisível `my_row_id` a essa tabela quanto uma chave primária naquela coluna. Como `sql_generate_invisible_primary_key` estava `OFF` no momento em que `auto_0` foi criada, nenhuma adição desse tipo foi realizada naquela tabela.

Quando uma chave primária é adicionada a uma tabela pelo servidor, o nome da coluna e da chave é sempre `my_row_id`. Por essa razão, ao habilitar chaves primárias geradas invisíveis dessa maneira, você não pode criar uma tabela com uma coluna chamada `my_row_id`, a menos que a instrução de criação da tabela também especifique uma chave primária explícita. (Você não é obrigado a nomear a coluna ou a chave como `my_row_id` nesses casos.)

`my_row_id` é uma coluna invisível, o que significa que ela não é exibida na saída de `SELECT *` ou `TABLE`; a coluna deve ser selecionada explicitamente pelo nome. Veja a Seção 15.1.24.10, “Colunas Invisíveis”.

Quando os GIPKs são habilitados, uma chave primária gerada não pode ser alterada, exceto para alterná-la entre `VISIBLE` e `INVISIBLE`. Para tornar a chave primária invisível gerada em `auto_1` visível, execute esta instrução `ALTER TABLE`:

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

Para tornar essa chave primária invisível novamente, execute `ALTER TABLE auto_1 ALTER COLUMN my_row_id SET INVISIBLE`.

Uma chave primária invisível gerada é sempre invisível por padrão.

Sempre que os GIPKs são habilitados, você não pode descartar uma chave primária gerada se uma das seguintes 2 condições resultar:

* A tabela ficar sem chave primária.
* A chave primária for descartada, mas não a coluna da chave primária.

Os efeitos de `sql_generate_invisible_primary_key` se aplicam apenas a tabelas que usam o motor de armazenamento `InnoDB`. Você pode usar uma instrução `ALTER TABLE` para alterar o motor de armazenamento usado por uma tabela que tem uma chave primária invisível gerada; nesse caso, a chave primária e a coluna permanecem no lugar, mas a tabela e a chave não recebem mais nenhum tratamento especial.

Por padrão, as chaves primárias invisíveis são exibidas na saída de `SHOW CREATE TABLE`, `SHOW COLUMNS` e `SHOW INDEX`, e são visíveis nas tabelas do esquema de informações `COLUMNS` e `STATISTICS`. Você pode fazer com que chaves primárias invisíveis geradas sejam ocultas, em vez disso, configurando a variável de sistema `show_gipk_in_create_table_and_information_schema` para `OFF`. Por padrão, essa variável está configurada para `ON`, como mostrado aqui:

```
mysql> SELECT @@show_gipk_in_create_table_and_information_schema;
+----------------------------------------------------+
| @@show_gipk_in_create_table_and_information_schema |
+----------------------------------------------------+
|                                                  1 |
+----------------------------------------------------+
1 row in set (0.00 sec)
```

Como pode ser visto na seguinte consulta contra a tabela `COLUMNS`, `my_row_id` é visível entre as colunas de `auto_1`:

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

Após `show_gipk_in_create_table_and_information_schema` ser configurado para `OFF`, `my_row_id` não pode mais ser visto na tabela `COLUMNS`, como mostrado aqui:

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

O ajuste para `sql_generate_invisible_primary_key` não é replicado e é ignorado pelos threads do aplicador de replicação. Isso significa que o ajuste dessa variável na fonte não tem efeito na replica. Você pode fazer com que a replica adicione uma chave primária GIPK para tabelas replicadas sem chaves primárias em um determinado canal de replicação usando `REQUIRE_TABLE_PRIMARY_KEY_CHECK = GENERATE` como parte de uma declaração `CHANGE REPLICATION SOURCE TO`.

As GIPKs funcionam com a replicação baseada em linhas de `CREATE TABLE ... SELECT`; as informações escritas no log binário para essa declaração, nesse caso, incluem a definição da GIPK, e, portanto, são replicadas corretamente. A replicação baseada em declarações de `CREATE TABLE ... SELECT` não é suportada com `sql_generate_invisible_primary_key = ON`.

Ao criar ou importar backups de instalações onde as GIPKs estão em uso, é possível excluir colunas e valores de chaves primárias invisíveis geradas. A opção `--skip-generated-invisible-primary-key` para **mysqldump** faz com que as informações da GIPK sejam excluídas na saída do programa.