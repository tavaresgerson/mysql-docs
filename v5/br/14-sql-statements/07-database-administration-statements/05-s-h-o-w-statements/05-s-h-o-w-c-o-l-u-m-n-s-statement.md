#### 13.7.5.5. Declaração COLUMNS

```sql
SHOW [FULL] {COLUMNS | FIELDS}
    {FROM | IN} tbl_name
    [{FROM | IN} db_name]
    [LIKE 'pattern' | WHERE expr]
```

`SHOW COLUMNS` exibe informações sobre as colunas de uma tabela específica. Também funciona para visualizações. `SHOW COLUMNS` exibe informações apenas para as colunas para as quais você tem algum privilégio.

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

Uma alternativa à sintaxe `tbl_name FROM db_name` é *`db_name.tbl_name`*. Essas duas instruções são equivalentes:

```sql
SHOW COLUMNS FROM mytable FROM mydb;
SHOW COLUMNS FROM mydb.mytable;
```

A palavra-chave opcional `FULL` faz com que a saída inclua a concordância da coluna e comentários, além dos privilégios que você tem para cada coluna.

A cláusula `LIKE`, se presente, indica quais nomes de colunas devem ser correspondidos. A cláusula `WHERE` pode ser usada para selecionar linhas com condições mais gerais, conforme discutido em Seção 24.8, “Extensões para Declarações SHOW”.

Os tipos de dados podem diferir do que você espera deles com base em uma instrução `CREATE TABLE` porque o MySQL às vezes altera os tipos de dados ao criar ou alterar uma tabela. As condições sob as quais isso ocorre são descritas em Seção 13.1.18.6, “Alterações Silenciosas de Especificação de Colunas”.

`SHOW COLUMNS` exibe os seguintes valores para cada coluna da tabela:

- Campo

  O nome da coluna.

- `Tipo`

  O tipo de dados da coluna.

- `Colaboração`

  A agregação para colunas de strings não binárias ou `NULL` para outras colunas. Esse valor é exibido apenas se você usar a palavra-chave `FULL`.

- `Nulo`

  A coluna nulidade. O valor é `SIM` se valores `NULL` puderem ser armazenados na coluna, `NÃO` se não puderem.

- `Chave`

  Se a coluna está indexada:

  - Se `Key` estiver vazio, a coluna não está indexada ou está indexada apenas como uma coluna secundária em um índice múltiplo e não único.

  - Se `Key` for `PRI`, a coluna é uma `PRIMARY KEY` ou é uma das colunas de uma `PRIMARY KEY` de múltiplas colunas.

  - Se `Key` for `UNI`, a coluna é a primeira coluna de um índice `UNIQUE`. (Um índice `UNIQUE` permite múltiplos valores `NULL`, mas você pode verificar se a coluna permite `NULL` verificando o campo `Null`.)

  - Se `Key` for `MUL`, a coluna é a primeira coluna de um índice não único, no qual múltiplas ocorrências de um valor específico são permitidas na coluna.

  Se mais de um dos valores de `Key` se aplicar a uma coluna específica de uma tabela, o `Key` exibirá o valor com a maior prioridade, na ordem `PRI`, `UNI`, `MUL`.

  Um índice `UNIQUE` pode ser exibido como `PRI` se ele não puder conter valores `NULL` e não houver uma `PRIMARY KEY` na tabela. Um índice `UNIQUE` pode ser exibido como `MUL` se várias colunas formarem um índice `UNIQUE` composto; embora a combinação das colunas seja única, cada coluna ainda pode conter múltiplas ocorrências de um valor específico.

- `Padrão`

  O valor padrão da coluna. É `NULL` se a coluna tiver um valor padrão explícito de `NULL` ou se a definição da coluna não incluir nenhuma cláusula `DEFAULT`.

- `Extra`

  Qualquer informação adicional disponível sobre uma coluna específica. O valor não pode estar vazio nesses casos:

  - `auto_increment` para as colunas que possuem o atributo `AUTO_INCREMENT`.

  - `on update CURRENT_TIMESTAMP` para as colunas `TIMESTAMP` ou `DATETIME` que possuem o atributo `ON UPDATE CURRENT_TIMESTAMP`.

  - `VIRTUAL GERADO` ou `ARREMESSADO GERADO` para colunas geradas.

- "Privilegios"

  Os privilégios que você tem para a coluna. Esse valor é exibido apenas se você usar a palavra-chave `FULL`.

- `Comentário`

  Qualquer comentário incluído na definição da coluna. Esse valor é exibido apenas se você usar a palavra-chave `FULL`.

As informações das colunas da tabela também estão disponíveis na tabela `INFORMATION_SCHEMA [`COLUMNS\`]\(information-schema-columns-table.html). Veja Seção 24.3.5, “A Tabela INFORMATION\_SCHEMA COLUMNS”.

Você pode listar as colunas de uma tabela com o comando **mysqlshow *`db_name`* *`tbl_name`***.

A instrução `DESCRIBE` fornece informações semelhantes às da instrução `SHOW COLUMNS`. Veja Seção 13.8.1, “Instrução DESCRIBE”.

As instruções `SHOW CREATE TABLE`, `SHOW TABLE STATUS` e `SHOW INDEX` também fornecem informações sobre as tabelas. Veja Seção 13.7.5, “Instruções SHOW”.
