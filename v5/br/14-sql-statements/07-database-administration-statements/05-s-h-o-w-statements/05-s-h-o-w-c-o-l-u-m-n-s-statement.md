#### 13.7.5.5 Instrução SHOW COLUMNS

```sql
SHOW [FULL] {COLUMNS | FIELDS}
    {FROM | IN} tbl_name
    [{FROM | IN} db_name]
    [LIKE 'pattern' | WHERE expr]
```

A instrução [`SHOW COLUMNS`](show-columns.html "13.7.5.5 SHOW COLUMNS Statement") exibe informações sobre as colunas em uma determinada tabela. Também funciona para views. [`SHOW COLUMNS`](show-columns.html "13.7.5.5 SHOW COLUMNS Statement") exibe informações apenas para as colunas nas quais você possui algum privilégio.

```sql
mysql> SHOW COLUMNS FROM City;
+-------------+----------+------+-----+---------+----------------+
| Field       | Type     | Null | Key | Default | Extra          |
+-------------+----------+------+-----+---------+----------------+
| ID          | int(11)  | NO   | PRI | NULL    | auto_increment |
| Name        | char(35) | NO   |     |         |                |
| CountryCode | char(3)  | NO   | MUL |         |                |
| District    | char(20) | NO   |     |         |                |
| Population  | int(11)  | NO   |     | 0       |                |
+-------------+----------+------+-----+---------+----------------+
```

Uma alternativa à sintaxe `tbl_name FROM db_name` é *`db_name.tbl_name`*. Estas duas instruções são equivalentes:

```sql
SHOW COLUMNS FROM mytable FROM mydb;
SHOW COLUMNS FROM mydb.mytable;
```

A palavra-chave opcional `FULL` faz com que a saída inclua a Collation da coluna e comentários, bem como os privilégios que você tem para cada coluna.

A cláusula [`LIKE`](string-comparison-functions.html#operator_like), se presente, indica quais nomes de coluna devem ser correspondidos. A cláusula `WHERE` pode ser fornecida para selecionar linhas usando condições mais gerais, conforme discutido na [Seção 24.8, “Extensões para Instruções SHOW”](extended-show.html "24.8 Extensions to SHOW Statements").

Os tipos de dados podem diferir do que você espera com base em uma instrução [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") porque o MySQL às vezes altera os tipos de dados quando você cria ou altera uma tabela. As condições sob as quais isso ocorre são descritas na [Seção 13.1.18.6, “Alterações Silenciosas na Especificação de Coluna”](silent-column-changes.html "13.1.18.6 Silent Column Specification Changes").

[`SHOW COLUMNS`](show-columns.html "13.7.5.5 SHOW COLUMNS Statement") exibe os seguintes valores para cada coluna da tabela:

* `Field`

  O nome da coluna.

* `Type`

  O tipo de dado da coluna.

* `Collation`

  A Collation para colunas de string não binárias, ou `NULL` para outras colunas. Este valor é exibido apenas se você usar a palavra-chave `FULL`.

* `Null`

  A nulidade da coluna (nullability). O valor é `YES` se valores `NULL` puderem ser armazenados na coluna, `NO` caso contrário.

* `Key`

  Indica se a coluna é indexada:

  + Se `Key` estiver vazio, a coluna não é indexada ou é indexada apenas como uma coluna secundária em um Index não exclusivo de múltiplas colunas.

  + Se `Key` for `PRI`, a coluna é uma `PRIMARY KEY` ou é uma das colunas em uma `PRIMARY KEY` de múltiplas colunas.

  + Se `Key` for `UNI`, a coluna é a primeira coluna de um Index `UNIQUE`. (Um Index `UNIQUE` permite múltiplos valores `NULL`, mas você pode verificar se a coluna permite `NULL` checando o campo `Null`.)

  + Se `Key` for `MUL`, a coluna é a primeira coluna de um Index não exclusivo no qual múltiplas ocorrências de um determinado valor são permitidas dentro da coluna.

  Se mais de um dos valores de `Key` se aplicar a uma determinada coluna de uma tabela, `Key` exibe aquele com a prioridade mais alta, na ordem `PRI`, `UNI`, `MUL`.

  Um Index `UNIQUE` pode ser exibido como `PRI` se não puder conter valores `NULL` e não houver uma `PRIMARY KEY` na tabela. Um Index `UNIQUE` pode ser exibido como `MUL` se várias colunas formarem um Index `UNIQUE` composto; embora a combinação das colunas seja única, cada coluna ainda pode manter múltiplas ocorrências de um determinado valor.

* `Default`

  O valor Default para a coluna. Este será `NULL` se a coluna tiver um Default explícito de `NULL`, ou se a definição da coluna não incluir uma cláusula `DEFAULT`.

* `Extra`

  Qualquer informação adicional disponível sobre uma determinada coluna. O valor não está vazio nestes casos:

  + `auto_increment` para colunas que possuem o atributo `AUTO_INCREMENT`.

  + `on update CURRENT_TIMESTAMP` para colunas [`TIMESTAMP`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") ou [`DATETIME`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") que possuem o atributo `ON UPDATE CURRENT_TIMESTAMP`.

  + `VIRTUAL GENERATED` ou `STORED GENERATED` para colunas geradas.

* `Privileges`

  Os privilégios que você tem para a coluna. Este valor é exibido apenas se você usar a palavra-chave `FULL`.

* `Comment`

  Qualquer comentário incluído na definição da coluna. Este valor é exibido apenas se você usar a palavra-chave `FULL`.

Informações sobre as colunas da tabela também estão disponíveis na tabela [`COLUMNS`](information-schema-columns-table.html "24.3.5 The INFORMATION_SCHEMA COLUMNS Table") do `INFORMATION_SCHEMA`. Consulte [Seção 24.3.5, “A Tabela COLUMNS do INFORMATION_SCHEMA”](information-schema-columns-table.html "24.3.5 The INFORMATION_SCHEMA COLUMNS Table").

Você pode listar as colunas de uma tabela com o comando [**mysqlshow *`db_name`* *`tbl_name`***](mysqlshow.html "4.5.7 mysqlshow — Display Database, Table, and Column Information").

A instrução [`DESCRIBE`](describe.html "13.8.1 DESCRIBE Statement") fornece informações semelhantes a [`SHOW COLUMNS`](show-columns.html "13.7.5.5 SHOW COLUMNS Statement"). Consulte [Seção 13.8.1, “Instrução DESCRIBE”](describe.html "13.8.1 DESCRIBE Statement").

As instruções [`SHOW CREATE TABLE`](show-create-table.html "13.7.5.10 SHOW CREATE TABLE Statement"), [`SHOW TABLE STATUS`](show-table-status.html "13.7.5.36 SHOW TABLE STATUS Statement") e [`SHOW INDEX`](show-index.html "13.7.5.22 SHOW INDEX Statement") também fornecem informações sobre tabelas. Consulte [Seção 13.7.5, “Instruções SHOW”](show.html "13.7.5 SHOW Statements").