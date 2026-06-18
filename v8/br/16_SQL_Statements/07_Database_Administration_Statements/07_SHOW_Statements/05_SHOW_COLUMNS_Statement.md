#### 15.7.7.5. Declaração COLUMNS

```
SHOW [EXTENDED] [FULL] {COLUMNS | FIELDS}
    {FROM | IN} tbl_name
    [{FROM | IN} db_name]
    [LIKE 'pattern' | WHERE expr]
```

`SHOW COLUMNS` exibe informações sobre as colunas de uma tabela específica. Também funciona para visualizações. `SHOW COLUMNS` exibe informações apenas para as colunas para as quais você tem algum privilégio.

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

Uma alternativa à sintaxe `tbl_name FROM db_name` é `db_name.tbl_name`. Essas duas declarações são equivalentes:

```
SHOW COLUMNS FROM mytable FROM mydb;
SHOW COLUMNS FROM mydb.mytable;
```

A palavra-chave opcional `EXTENDED` faz com que a saída inclua informações sobre colunas ocultas que o MySQL usa internamente e que não são acessíveis pelos usuários.

A palavra-chave opcional `FULL` faz com que a saída inclua a correção de colunas e comentários, além dos privilégios que você tem para cada coluna.

A cláusula `LIKE`, se presente, indica quais nomes de colunas devem ser correspondidos. A cláusula `WHERE` pode ser usada para selecionar linhas com condições mais gerais, conforme discutido na Seção 28.8, “Extensões para Declarações SHOW”.

Os tipos de dados podem diferir do que você espera deles com base em uma declaração `CREATE TABLE`, porque o MySQL às vezes altera os tipos de dados quando você cria ou altera uma tabela. As condições sob as quais isso ocorre são descritas na Seção 15.1.20.7, “Alterações Silenciosas de Especificação de Colunas”.

`SHOW COLUMNS` exibe os seguintes valores para cada coluna da tabela:

- `Field`

  O nome da coluna.

- `Type`

  O tipo de dados da coluna.

- `Collation`

  A agregação para colunas de strings não binárias ou `NULL` para outras colunas. Esse valor é exibido apenas se você usar a palavra-chave `FULL`.

- `Null`

  A coluna nulidade. O valor é `YES` se os valores de `NULL` puderem ser armazenados na coluna, `NO` se não puderem.

- `Key`

  Se a coluna está indexada:

  - Se `Key` estiver vazio, a coluna não está indexada ou está indexada apenas como uma coluna secundária em um índice múltiplo e não único.

  - Se `Key` for `PRI`, a coluna é uma `PRIMARY KEY` ou é uma das colunas de uma `PRIMARY KEY` de múltiplas colunas.

  - Se `Key` for `UNI`, a coluna é a primeira coluna de um índice `UNIQUE`. (Um índice `UNIQUE` permite múltiplos valores `NULL`, mas você pode determinar se a coluna permite `NULL` verificando o campo `Null`.

  - Se `Key` for `MUL`, a coluna é a primeira coluna de um índice não único, no qual múltiplas ocorrências de um valor específico são permitidas na coluna.

  Se mais de um dos valores `Key` se aplicar a uma coluna específica de uma tabela, o `Key` exibe o valor com a maior prioridade, na ordem `PRI`, `UNI`, `MUL`.

  Um índice `UNIQUE` pode ser exibido como `PRI` se ele não puder conter valores `NULL` e não houver nenhum `PRIMARY KEY` na tabela. Um índice `UNIQUE` pode ser exibido como `MUL` se várias colunas formarem um índice composto `UNIQUE`; embora a combinação das colunas seja única, cada coluna ainda pode conter múltiplas ocorrências de um valor específico.

- `Default`

  O valor padrão da coluna. Isso é `NULL` se a coluna tiver um valor padrão explícito de `NULL`, ou se a definição da coluna não incluir nenhuma cláusula `DEFAULT`.

- `Extra`

  Qualquer informação adicional disponível sobre uma coluna específica. O valor não pode estar vazio nesses casos:

  - `auto_increment` para colunas que possuem o atributo `AUTO_INCREMENT`.

  - `on update CURRENT_TIMESTAMP` para as colunas `TIMESTAMP` ou `DATETIME` que possuem o atributo `ON UPDATE CURRENT_TIMESTAMP`.

  - `VIRTUAL GENERATED` ou `STORED GENERATED` para colunas geradas.

  - `DEFAULT_GENERATED` para colunas que têm um valor padrão de expressão.

- `Privileges`

  Os privilégios que você tem para a coluna. Esse valor é exibido apenas se você usar a palavra-chave `FULL`.

- `Comment`

  Qualquer comentário incluído na definição da coluna. Esse valor é exibido apenas se você usar a palavra-chave `FULL`.

As informações das colunas da tabela também estão disponíveis na tabela `INFORMATION_SCHEMA` `COLUMNS`. Veja a Seção 28.3.8, “A Tabela INFORMATION\_SCHEMA COLUMNS”. As informações extensas sobre colunas ocultas estão disponíveis apenas usando `SHOW EXTENDED COLUMNS`; não podem ser obtidas a partir da tabela `COLUMNS`.

Você pode listar as colunas de uma tabela com o comando **mysqlshow `db_name` `tbl_name`**.

A declaração `DESCRIBE` fornece informações semelhantes às da declaração `SHOW COLUMNS`. Veja a Seção 15.8.1, “Declaração DESCRIBE”.

As instruções `SHOW CREATE TABLE`, `SHOW TABLE STATUS` e `SHOW INDEX` também fornecem informações sobre tabelas. Veja a Seção 15.7.7, “Instruções SHOW”.

No MySQL 8.0.30 e versões posteriores, `SHOW COLUMNS` inclui a chave primária gerada e invisível da tabela, se houver, por padrão. Você pode evitar que essa informação seja exibida na saída do comando configurando `show_gipk_in_create_table_and_information_schema = OFF`. Para mais informações, consulte a Seção 15.1.20.11, “Chaves Primárias Geradas e Invisíveis”.
