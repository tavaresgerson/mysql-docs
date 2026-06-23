## 5.4 Obtendo informações sobre bancos de dados e tabelas

E se você esquecer o nome de um banco de dados ou tabela, ou qual é a estrutura de uma tabela específica (por exemplo, quais são as colunas que ela possui)? O MySQL resolve esse problema por meio de várias declarações que fornecem informações sobre os bancos de dados e tabelas que ele suporta.

Você já viu `SHOW DATABASES`(show-databases.html "15.7.7.14 SHOW DATABASES Statement"), que lista os bancos de dados gerenciados pelo servidor. Para descobrir qual banco de dados está selecionado atualmente, use a função `DATABASE()`:

```
mysql> SELECT DATABASE();
+------------+
| DATABASE() |
+------------+
| menagerie  |
+------------+
```

Se você ainda não selecionou nenhum banco de dados, o resultado é `NULL`.

Para descobrir quais tabelas o banco de dados padrão contém (por exemplo, quando você não tem certeza sobre o nome de uma tabela), use esta declaração:

```
mysql> SHOW TABLES;
+---------------------+
| Tables_in_menagerie |
+---------------------+
| event               |
| pet                 |
+---------------------+
```

O nome da coluna no resultado produzido por essa declaração é sempre `Tables_in_db_name`, onde *`db_name`* é o nome do banco de dados. Consulte a Seção 15.7.7.39, “Declaração SHOW TABLES”, para obter mais informações.

Se você quiser saber sobre a estrutura de uma tabela, a declaração `DESCRIBE` é útil; ela exibe informações sobre cada uma das colunas de uma tabela:

```
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

`Field` indica o nome da coluna, `Type` é o tipo de dados para a coluna, `NULL` indica se a coluna pode conter valores de `NULL`, `Key` indica se a coluna está indexada e `Default` especifica o valor padrão da coluna. `Extra` exibe informações especiais sobre as colunas: Se uma coluna foi criada com a opção `AUTO_INCREMENT`, o valor é `auto_increment` em vez de vazio.

`DESC` é uma forma abreviada de `DESCRIBE`. Consulte a Seção 15.8.1, “Declaração DESCRIBE”, para obter mais informações.

Você pode obter a declaração `CREATE TABLE` necessária para criar uma tabela existente usando a declaração `SHOW CREATE TABLE`. Veja a Seção 15.7.7.10, “Declaração SHOW CREATE TABLE”.

Se você tiver índices em uma tabela, o `SHOW INDEX FROM tbl_name` fornece informações sobre eles. Consulte a Seção 15.7.7.22, “Declaração SHOW INDEX”, para mais informações sobre essa declaração.