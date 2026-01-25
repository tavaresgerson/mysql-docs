## 3.4 Obtendo Informações Sobre Databases e Tabelas

E se você esquecer o nome de um Database ou Tabela, ou qual é a estrutura de uma determinada tabela (por exemplo, como suas colunas são chamadas)? O MySQL aborda esse problema através de várias *statements* que fornecem informações sobre os Databases e tabelas que ele suporta.

Você já viu anteriormente [`SHOW DATABASES`](show-databases.html "13.7.5.14 SHOW DATABASES Statement"), que lista os Databases gerenciados pelo servidor. Para descobrir qual Database está atualmente selecionado, use a função [`DATABASE()`](information-functions.html#function_database):

```sql
mysql> SELECT DATABASE();
+------------+
| DATABASE() |
+------------+
| menagerie  |
+------------+
```

Se você ainda não selecionou nenhum Database, o resultado será `NULL`.

Para descobrir quais tabelas o Database padrão contém (por exemplo, quando você não tem certeza sobre o nome de uma tabela), use esta *statement*:

```sql
mysql> SHOW TABLES;
+---------------------+
| Tables_in_menagerie |
+---------------------+
| event               |
| pet                 |
+---------------------+
```

O nome da coluna na saída produzida por esta *statement* é sempre `Tables_in_db_name`, onde *`db_name`* é o nome do Database. Consulte [Section 13.7.5.37, “SHOW TABLES Statement”](show-tables.html "13.7.5.37 SHOW TABLES Statement"), para mais informações.

Se você deseja saber sobre a estrutura de uma tabela, a *statement* [`DESCRIBE`](describe.html "13.8.1 DESCRIBE Statement") é útil; ela exibe informações sobre cada uma das colunas de uma tabela:

```sql
mysql> DESCRIBE pet;
+---------+-------------+------+-----+---------+-------+
| Field   | Type        | Null | Key | Default | Extra |
+---------+-------------+------+-----+---------+-------+
| name    | varchar(20) | YES  |     | NULL    |       |
| owner   | varchar(20) | YES  |     | NULL    |       |
| species | varchar(20) | YES  |     | NULL    |       |
| sex     | char(1)     | YES  |     | NULL    |       |
| birth   | date        | YES  |     | NULL    |       |
| death   | date        | YES  |     | NULL    |       |
+---------+-------------+------+-----+---------+-------+
```

`Field` indica o nome da coluna, `Type` é o tipo de dado para a coluna, `NULL` indica se a coluna pode conter valores `NULL`, `Key` indica se a coluna é um Index, e `Default` especifica o valor padrão da coluna. `Extra` exibe informações especiais sobre colunas: Se uma coluna foi criada com a opção `AUTO_INCREMENT`, o valor é `auto_increment` em vez de vazio.

`DESC` é uma forma abreviada de [`DESCRIBE`](describe.html "13.8.1 DESCRIBE Statement"). Consulte [Section 13.8.1, “DESCRIBE Statement”](describe.html "13.8.1 DESCRIBE Statement"), para mais informações.

Você pode obter a *statement* [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") necessária para criar uma tabela existente usando a *statement* [`SHOW CREATE TABLE`](show-create-table.html "13.7.5.10 SHOW CREATE TABLE Statement"). Consulte [Section 13.7.5.10, “SHOW CREATE TABLE Statement”](show-create-table.html "13.7.5.10 SHOW CREATE TABLE Statement").

Se você tiver Indexes em uma tabela, `SHOW INDEX FROM tbl_name` produz informações sobre eles. Consulte [Section 13.7.5.22, “SHOW INDEX Statement”](show-index.html "13.7.5.22 SHOW INDEX Statement"), para mais detalhes sobre esta *statement*.