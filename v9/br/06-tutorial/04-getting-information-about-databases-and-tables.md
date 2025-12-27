## 5.4 Obtendo Informações sobre Bancos de Dados e Tabelas

E se você esquecer o nome de um banco de dados ou de uma tabela, ou o que é a estrutura de uma tabela específica (por exemplo, quais são os nomes das colunas)? O MySQL resolve esse problema por meio de várias instruções que fornecem informações sobre os bancos de dados e tabelas que suporta.

Você já viu `SHOW DATABASES`, que lista os bancos de dados gerenciados pelo servidor. Para descobrir qual banco de dados está atualmente selecionado, use a função `DATABASE()`:

```
mysql> SELECT DATABASE();
+------------+
| DATABASE() |
+------------+
| menagerie  |
+------------+
```

Se você ainda não selecionou nenhum banco de dados, o resultado é `NULL`.

Para descobrir quais tabelas o banco de dados padrão contém (por exemplo, quando você não tem certeza do nome de uma tabela), use essa instrução:

```
mysql> SHOW TABLES;
+---------------------+
| Tables_in_menagerie |
+---------------------+
| event               |
| pet                 |
+---------------------+
```

O nome da coluna no resultado produzido por essa instrução é sempre `Tables_in_db_name`, onde *`db_name`* é o nome do banco de dados. Veja a Seção 15.7.7.40, “Instrução SHOW TABLES”, para mais informações.

Se você quiser descobrir a estrutura de uma tabela, a instrução `DESCRIBE` é útil; ela exibe informações sobre cada uma das colunas de uma tabela:

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

`Field` indica o nome da coluna, `Type` é o tipo de dado para a coluna, `NULL` indica se a coluna pode conter valores `NULL`, `Key` indica se a coluna está indexada e `Default` especifica o valor padrão da coluna. `Extra` exibe informações especiais sobre colunas: Se uma coluna foi criada com a opção `AUTO_INCREMENT`, o valor é `auto_increment` em vez de vazio.

`DESC` é uma forma abreviada de `DESCRIBE`. Veja a Seção 15.8.1, “Instrução DESCRIBE”, para mais informações.

Você pode obter a instrução `CREATE TABLE` necessária para criar uma tabela existente usando a instrução `SHOW CREATE TABLE`. Veja a Seção 15.7.7.12, “Instrução SHOW CREATE TABLE”.

Se você tiver índices em uma tabela, o comando `SHOW INDEX FROM tbl_name` fornece informações sobre eles. Consulte a Seção 15.7.7.24, “Instrução SHOW INDEX”, para saber mais sobre essa instrução.