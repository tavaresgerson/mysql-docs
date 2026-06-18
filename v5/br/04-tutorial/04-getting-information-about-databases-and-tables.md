## 3.4 Obtendo Informações sobre Bancos de Dados e Tabelas

E se você esquecer o nome de um banco de dados ou tabela, ou o que é a estrutura de uma determinada tabela (por exemplo, quais são as colunas dela)? O MySQL resolve esse problema por meio de várias declarações que fornecem informações sobre os bancos de dados e tabelas que suporta.

Você já viu `SHOW DATABASES`, que lista as bases de dados gerenciadas pelo servidor. Para descobrir qual base de dados está atualmente selecionada, use a função `DATABASE()`:

```sql
mysql> SELECT DATABASE();
+------------+
| DATABASE() |
+------------+
| menagerie  |
+------------+
```

Se você ainda não selecionou nenhum banco de dados, o resultado é `NULL`.

Para descobrir quais tabelas o banco de dados padrão contém (por exemplo, quando você não tem certeza do nome de uma tabela), use esta instrução:

```sql
mysql> SHOW TABLES;
+---------------------+
| Tables_in_menagerie |
+---------------------+
| event               |
| pet                 |
+---------------------+
```

O nome da coluna na saída produzida por essa declaração é sempre `Tables_in_db_name`, onde *`db_name`* é o nome do banco de dados. Consulte Seção 13.7.5.37, "Instrução SHOW TABLES" para obter mais informações.

Se você quiser saber sobre a estrutura de uma tabela, a instrução `DESCRIBE` é útil; ela exibe informações sobre cada uma das colunas de uma tabela:

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

`Field` indica o nome da coluna, `Type` é o tipo de dados para a coluna, `NULL` indica se a coluna pode conter valores `NULL`, `Key` indica se a coluna está indexada e `Default` especifica o valor padrão da coluna. `Extra` exibe informações especiais sobre as colunas: Se uma coluna foi criada com a opção `AUTO_INCREMENT`, o valor é `auto_increment` em vez de vazio.

`DESC` é uma abreviação de `DESCRIBE`. Consulte Seção 13.8.1, “Instrução DESCRIBE” para obter mais informações.

Você pode obter a instrução `CREATE TABLE` necessária para criar uma tabela existente usando a instrução `SHOW CREATE TABLE`. Veja Seção 13.7.5.10, “Instrução SHOW CREATE TABLE”.

Se você tiver índices em uma tabela, `SHOW INDEX FROM tbl_name` fornece informações sobre eles. Consulte Seção 13.7.5.22, “Instrução SHOW INDEX” para obter mais informações sobre essa instrução.
