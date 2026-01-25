### 24.3.5 A Tabela COLUMNS do INFORMATION_SCHEMA

A tabela [`COLUMNS`](information-schema-columns-table.html "24.3.5 The INFORMATION_SCHEMA COLUMNS Table") fornece informações sobre colunas em tabelas.

A tabela [`COLUMNS`](information-schema-columns-table.html "24.3.5 The INFORMATION_SCHEMA COLUMNS Table") possui estas colunas:

* `TABLE_CATALOG`

  O nome do catalog ao qual a tabela que contém a coluna pertence. Este valor é sempre `def`.

* `TABLE_SCHEMA`

  O nome do schema (Database) ao qual a tabela que contém a coluna pertence.

* `TABLE_NAME`

  O nome da tabela que contém a coluna.

* `COLUMN_NAME`

  O nome da coluna.

* `ORDINAL_POSITION`

  A posição da coluna dentro da tabela. `ORDINAL_POSITION` é necessário porque você pode querer usar `ORDER BY ORDINAL_POSITION`. Diferentemente do [`SHOW COLUMNS`](show-columns.html "13.7.5.5 SHOW COLUMNS Statement"), o [`SELECT`](select.html "13.2.9 SELECT Statement") da tabela [`COLUMNS`](information-schema-columns-table.html "24.3.5 The INFORMATION_SCHEMA COLUMNS Table") não tem ordenação automática.

* `COLUMN_DEFAULT`

  O valor `DEFAULT` para a coluna. Este é `NULL` se a coluna tiver um `DEFAULT` explícito de `NULL`, ou se a definição da coluna não incluir nenhuma cláusula `DEFAULT`.

* `IS_NULLABLE`

  A nulidade da coluna. O valor é `YES` se valores `NULL` puderem ser armazenados na coluna, `NO` se não.

* `DATA_TYPE`

  O tipo de dado da coluna.

  O valor de `DATA_TYPE` é apenas o nome do tipo, sem outras informações. O valor de `COLUMN_TYPE` contém o nome do tipo e possivelmente outras informações, como a precisão ou o comprimento (length).

* `CHARACTER_MAXIMUM_LENGTH`

  Para colunas string, o comprimento máximo em caracteres.

* `CHARACTER_OCTET_LENGTH`

  Para colunas string, o comprimento máximo em bytes.

* `NUMERIC_PRECISION`

  Para colunas numéricas, a precisão numérica (numeric precision).

* `NUMERIC_SCALE`

  Para colunas numéricas, a escala numérica (numeric scale).

* `DATETIME_PRECISION`

  Para colunas temporais, a precisão de segundos fracionários.

* `CHARACTER_SET_NAME`

  Para colunas de string de caracteres, o nome do character set.

* `COLLATION_NAME`

  Para colunas de string de caracteres, o nome do collation.

* `COLUMN_TYPE`

  O tipo de dado da coluna.

  O valor de `DATA_TYPE` é apenas o nome do tipo, sem outras informações. O valor de `COLUMN_TYPE` contém o nome do tipo e possivelmente outras informações, como a precisão ou o comprimento (length).

* `COLUMN_KEY`

  Se a coluna é indexada:

  + Se `COLUMN_KEY` estiver vazio, a coluna não está indexada ou está indexada apenas como uma coluna secundária em um Index não-único e de múltiplas colunas.

  + Se `COLUMN_KEY` for `PRI`, a coluna é uma `PRIMARY KEY` ou é uma das colunas em uma `PRIMARY KEY` de múltiplas colunas.

  + Se `COLUMN_KEY` for `UNI`, a coluna é a primeira coluna de um Index `UNIQUE`. (Um Index `UNIQUE` permite múltiplos valores `NULL`, mas você pode saber se a coluna permite `NULL` verificando a coluna `Null`.)

  + Se `COLUMN_KEY` for `MUL`, a coluna é a primeira coluna de um Index não-único no qual múltiplas ocorrências de um determinado valor são permitidas dentro da coluna.

  Se mais de um dos valores de `COLUMN_KEY` se aplicar a uma determinada coluna de uma tabela, `COLUMN_KEY` exibe aquele com a prioridade mais alta, na ordem `PRI`, `UNI`, `MUL`.

  Um Index `UNIQUE` pode ser exibido como `PRI` se não puder conter valores `NULL` e não houver nenhuma `PRIMARY KEY` na tabela. Um Index `UNIQUE` pode ser exibido como `MUL` se várias colunas formarem um Index `UNIQUE` composto; embora a combinação das colunas seja unique, cada coluna ainda pode conter múltiplas ocorrências de um determinado valor.

* `EXTRA`

  Qualquer informação adicional disponível sobre uma determinada coluna. O valor é não vazio nestes casos:

  + `auto_increment` para colunas que possuem o atributo `AUTO_INCREMENT`.

  + `on update CURRENT_TIMESTAMP` para colunas [`TIMESTAMP`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") ou [`DATETIME`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") que possuem o atributo `ON UPDATE CURRENT_TIMESTAMP`.

  + `STORED GENERATED` ou `VIRTUAL GENERATED` para generated columns.

* `PRIVILEGES`

  Os privileges que você tem para a coluna.

* `COLUMN_COMMENT`

  Qualquer comment incluído na definição da coluna.

* `GENERATION_EXPRESSION`

  Para generated columns, exibe a expression usada para calcular os valores da coluna. Vazio para colunas não geradas. Para obter informações sobre generated columns, consulte [Section 13.1.18.7, “CREATE TABLE and Generated Columns”](create-table-generated-columns.html "13.1.18.7 CREATE TABLE and Generated Columns").

#### Notas

* No [`SHOW COLUMNS`](show-columns.html "13.7.5.5 SHOW COLUMNS Statement"), a exibição `Type` inclui valores de diversas colunas diferentes da tabela [`COLUMNS`](information-schema-columns-table.html "24.3.5 The INFORMATION_SCHEMA COLUMNS Table").

* `CHARACTER_OCTET_LENGTH` deve ser o mesmo que `CHARACTER_MAXIMUM_LENGTH`, exceto para character sets multibyte.

* `CHARACTER_SET_NAME` pode ser derivado de `COLLATION_NAME`. Por exemplo, se você executar `SHOW FULL COLUMNS FROM t` e vir na coluna `COLLATION_NAME` um valor de `latin1_swedish_ci`, o character set é o que está antes do primeiro underscore: `latin1`.

Informações sobre colunas também estão disponíveis na instrução [`SHOW COLUMNS`](show-columns.html "13.7.5.5 SHOW COLUMNS Statement"). Consulte [Section 13.7.5.5, “SHOW COLUMNS Statement”](show-columns.html "13.7.5.5 SHOW COLUMNS Statement"). As seguintes instruções são quase equivalentes:

```sql
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE table_name = 'tbl_name'
  [AND table_schema = 'db_name']
  [AND column_name LIKE 'wild']

SHOW COLUMNS
  FROM tbl_name
  [FROM db_name]
  [LIKE 'wild']
```