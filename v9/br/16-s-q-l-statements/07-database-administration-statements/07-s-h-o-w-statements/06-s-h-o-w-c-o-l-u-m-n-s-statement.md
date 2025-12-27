#### 15.7.7.6 Declaração `SHOW COLUMNS`

```
SHOW [EXTENDED] [FULL] {COLUMNS | FIELDS}
    {FROM | IN} tbl_name
    [{FROM | IN} db_name]
    [LIKE 'pattern' | WHERE expr]
```

`SHOW COLUMNS` exibe informações sobre as colunas de uma tabela específica. Também funciona para visualizações. `SHOW COLUMNS` exibe informações apenas para aquelas colunas para as quais você tem algum privilégio.

```
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

Uma alternativa à sintaxe `tbl_name FROM db_name` é *`db_name.tbl_name`*. Essas duas declarações são equivalentes:

```
SHOW COLUMNS FROM mytable FROM mydb;
SHOW COLUMNS FROM mydb.mytable;
```

A palavra-chave opcional `EXTENDED` faz com que a saída inclua informações sobre colunas ocultas que o MySQL usa internamente e não são acessíveis pelos usuários.

A palavra-chave opcional `FULL` faz com que a saída inclua a collation da coluna e comentários, bem como os privilégios que você tem para cada coluna.

A cláusula `LIKE`, se presente, indica quais nomes de colunas devem ser correspondidos. A cláusula `WHERE` pode ser usada para selecionar linhas usando condições mais gerais, conforme discutido na Seção 28.8, “Extensões para Declarações SHOW”.

Os tipos de dados podem diferir do que você espera com base em uma declaração `CREATE TABLE` porque o MySQL às vezes altera os tipos de dados ao criar ou alterar uma tabela. As condições sob as quais isso ocorre são descritas na Seção 15.1.24.7, “Mudanças Silenciosas de Especificação de Colunas”.

`SHOW COLUMNS` exibe os seguintes valores para cada coluna de tabela:

* `Field`

  O nome da coluna.

* `Type`

  O tipo de dado da coluna.

* `Collation`

  A collation para colunas de string não binárias, ou `NULL` para outras colunas. Esse valor é exibido apenas se você usar a palavra-chave `FULL`.

* `Null`

  A não-nulidade da coluna. O valor é `YES` se valores `NULL` podem ser armazenados na coluna, `NO` se não.

* `Key`

  Se a coluna está indexada:

  + Se `Key` estiver vazio, a coluna não está indexada ou está indexada apenas como uma coluna secundária em um índice de múltiplas colunas, não único.

+ Se `Key` for `PRI`, a coluna é uma `PRIMARY KEY` ou é uma das colunas de uma `PRIMARY KEY` de múltiplas colunas.

+ Se `Key` for `UNI`, a coluna é a primeira coluna de um índice `UNIQUE`. (Um índice `UNIQUE` permite múltiplos valores `NULL`, mas você pode determinar se a coluna permite `NULL` verificando o campo `Null`.)

+ Se `Key` for `MUL`, a coluna é a primeira coluna de um índice não único em que múltiplas ocorrências de um valor dado são permitidas dentro da coluna.

Se mais de um dos valores de `Key` se aplicar a uma coluna específica de uma tabela, `Key` exibe o valor com a maior prioridade, na ordem `PRI`, `UNI`, `MUL`.

Um índice `UNIQUE` pode ser exibido como `PRI` se não puder conter valores `NULL` e não houver uma `PRIMARY KEY` na tabela. Um índice `UNIQUE` pode ser exibido como `MUL` se várias colunas formarem um índice `UNIQUE` composto; embora a combinação das colunas seja única, cada coluna ainda pode conter múltiplas ocorrências de um valor dado.

* `Default`

  O valor padrão para a coluna. Isso é `NULL` se a coluna tiver um padrão explícito de `NULL`, ou se a definição da coluna não incluir nenhuma cláusula `DEFAULT`.

* `Extra`

  Qualquer informação adicional disponível sobre uma coluna específica. O valor não é vazio nestes casos:

  + `auto_increment` para colunas que têm o atributo `AUTO_INCREMENT`.

  + `on update CURRENT_TIMESTAMP` para colunas `TIMESTAMP` ou `DATETIME` que têm o atributo `ON UPDATE CURRENT_TIMESTAMP`.

  + `VIRTUAL GENERATED` ou `STORED GENERATED` para colunas geradas.

  + `DEFAULT_GENERATED` para colunas que têm um valor de padrão de expressão.

* `Privileges`

  Os privilégios que você tem para a coluna. Esse valor é exibido apenas se você usar a palavra-chave `FULL`.

* `Comment`

Qualquer comentário incluído na definição da coluna. Esse valor é exibido apenas se você usar a palavra-chave `FULL`.

As informações das colunas da tabela também estão disponíveis na tabela `INFORMATION_SCHEMA` `COLUMNS`. Veja a Seção 28.3.8, “A Tabela INFORMATION\_SCHEMA COLUMNS”. As informações extensas sobre colunas ocultas estão disponíveis apenas usando `SHOW EXTENDED COLUMNS`; não podem ser obtidas da tabela `COLUMNS`.

Você pode listar as colunas de uma tabela com o comando **mysqlshow *`db_name`* *`tbl_name`***.

A instrução `DESCRIBE` fornece informações semelhantes a `SHOW COLUMNS`. Veja a Seção 15.8.1, “Instrução DESCRIBE”.

As instruções `SHOW CREATE TABLE`, `SHOW TABLE STATUS` e `SHOW INDEX` também fornecem informações sobre as tabelas. Veja a Seção 15.7.7, “Instruções SHOW”.

`SHOW COLUMNS` inclui a chave primária invisível gerada pela tabela, se tiver uma, por padrão. Você pode fazer com que essa informação seja suprimida na saída da instrução definindo `show_gipk_in_create_table_and_information_schema = OFF`. Para mais informações, veja a Seção 15.1.24.11, “Chaves Primárias Invisíveis Geradas”.