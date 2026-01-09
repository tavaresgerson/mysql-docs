### 28.3.8 A Tabela INFORMATION_SCHEMA COLUMNS

A tabela `COLUMNS` fornece informações sobre as colunas das tabelas. A tabela relacionada `ST_GEOMETRY_COLUMNS` fornece informações sobre as colunas das tabelas que armazenam dados espaciais. Veja a Seção 28.3.41, “A Tabela INFORMATION_SCHEMA ST_GEOMETRY_COLUMNS”.

A tabela `COLUMNS` tem as seguintes colunas:

* `TABLE_CATALOG`

  O nome do catálogo ao qual a tabela que contém a coluna pertence. Esse valor é sempre `def`.

* `TABLE_SCHEMA`

  O nome do esquema (banco de dados) ao qual a tabela que contém a coluna pertence.

* `TABLE_NAME`

  O nome da tabela que contém a coluna.

* `COLUMN_NAME`

  O nome da coluna.

* `ORDINAL_POSITION`

  A posição da coluna dentro da tabela. `ORDINAL_POSITION` é necessário porque você pode querer dizer `ORDER BY ORDINAL_POSITION`. Ao contrário de `SHOW COLUMNS`, a consulta `SELECT` da tabela `COLUMNS` não tem ordenação automática.

* `COLUMN_DEFAULT`

  O valor padrão para a coluna. Isso é `NULL` se a coluna tiver um padrão explícito de `NULL`, ou se a definição da coluna não incluir nenhuma cláusula `DEFAULT`.

* `IS_NULLABLE`

  A não-nulidade da coluna. O valor é `YES` se valores `NULL` podem ser armazenados na coluna, `NO` se não.

* `DATA_TYPE`

  O tipo de dados da coluna.

  O valor `DATA_TYPE` é apenas o nome do tipo sem nenhuma outra informação. O valor `COLUMN_TYPE` contém o nome do tipo e possivelmente outras informações, como a precisão ou o comprimento.

* `CHARACTER_MAXIMUM_LENGTH`

  Para colunas de caracteres, o comprimento máximo em caracteres.

* `CHARACTER_OCTET_LENGTH`

  Para colunas de caracteres, o comprimento máximo em bytes.

* `NUMERIC_PRECISION`

  Para colunas numéricas, a precisão numérica.

* `NUMERIC_SCALE`

  Para colunas numéricas, a escala numérica.

* `DATETIME_PRECISION`

Para colunas temporais, a precisão de segundos fracionários.

* `CHARACTER_SET_NAME`

  Para colunas de strings de caracteres, o nome do conjunto de caracteres.

* `COLLATION_NAME`

  Para colunas de strings de caracteres, o nome da collation.

* `COLUMN_TYPE`

  O tipo de dados da coluna.

  O valor `DATA_TYPE` é apenas o nome do tipo sem outras informações. O valor `COLUMN_TYPE` contém o nome do tipo e, possivelmente, outras informações, como a precisão ou o comprimento.

* `COLUMN_KEY`

  Se a coluna está indexada:

  + Se `COLUMN_KEY` estiver vazio, a coluna não está indexada ou está indexada apenas como uma coluna secundária em um índice de múltiplas colunas, não único.

  + Se `COLUMN_KEY` for `PRI`, a coluna é uma `PRIMARY KEY` ou é uma das colunas em um `PRIMARY KEY` de múltiplas colunas.

  + Se `COLUMN_KEY` for `UNI`, a coluna é a primeira coluna de um `UNIQUE` index. (Um `UNIQUE` index permite múltiplos valores `NULL`, mas você pode determinar se a coluna permite `NULL` verificando a coluna `Null`.)

  + Se `COLUMN_KEY` for `MUL`, a coluna é a primeira coluna de um índice não único em que múltiplas ocorrências de um valor dado são permitidas dentro da coluna.

  Se mais de um dos valores de `COLUMN_KEY` se aplica a uma coluna dada de uma tabela, `COLUMN_KEY` exibe o valor com a maior prioridade, na ordem `PRI`, `UNI`, `MUL`.

  Um `UNIQUE` index pode ser exibido como `PRI` se não puder conter valores `NULL` e não houver `PRIMARY KEY` na tabela. Um `UNIQUE` index pode ser exibido como `MUL` se várias colunas formarem um `UNIQUE` index composto; embora a combinação das colunas seja única, cada coluna ainda pode conter múltiplas ocorrências de um valor dado.

* `EXTRA`

  Qualquer informação adicional disponível sobre uma coluna dada. O valor não está vazio nestes casos:

+ `auto_increment` para colunas que possuem o atributo `AUTO_INCREMENT`.

+ `on update CURRENT_TIMESTAMP` para colunas `TIMESTAMP` ou `DATETIME` que possuem o atributo `ON UPDATE CURRENT_TIMESTAMP`.

+ `STORED GENERATED` ou `VIRTUAL GENERATED` para colunas geradas.

+ `DEFAULT_GENERATED` para colunas que possuem um valor padrão de expressão.

* `PRIVILEGES`

  Os privilégios que você tem para a coluna.

* `COLUMN_COMMENT`

  Qualquer comentário incluído na definição da coluna.

* `GENERATION_EXPRESSION`

  Para colunas geradas, exibe a expressão usada para calcular os valores da coluna. Vazio para colunas não geradas. Para informações sobre colunas geradas, consulte a Seção 15.1.24.8, “CREATE TABLE e Colunas Geradas”.

* `SRS_ID`

  Este valor se aplica a colunas espaciais. Ele contém o valor da coluna `SRID` que indica o sistema de referência espacial para os valores armazenados na coluna. Consulte a Seção 13.4.1, “Tipos de Dados Espaciais”, e a Seção 13.4.5, “Suporte ao Sistema de Referência Espacial”. O valor é `NULL` para colunas não espaciais e colunas espaciais sem o atributo `SRID`.

#### Notas

* Na instrução `SHOW COLUMNS`, a exibição do `Type` inclui valores de várias colunas `COLUMNS` diferentes.

* `CHARACTER_OCTET_LENGTH` deve ser o mesmo que `CHARACTER_MAXIMUM_LENGTH`, exceto para conjuntos de caracteres multibyte.

* `CHARACTER_SET_NAME` pode ser derivado de `COLLATION_NAME`. Por exemplo, se você disser `SHOW FULL COLUMNS FROM t`, e você ver no `COLLATION_NAME` coluna um valor de `utf8mb4_swedish_ci`, o conjunto de caracteres é o que aparece antes do primeiro sublinhado: `utf8mb4`.

As informações da coluna também estão disponíveis a partir da instrução `SHOW COLUMNS`. Consulte a Seção 15.7.7.6, “Instrução SHOW COLUMNS”. As seguintes instruções são quase equivalentes:

```
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

As informações sobre as colunas primárias invisíveis geradas são visíveis nesta tabela por padrão. Você pode ocultar essas informações definindo `show_gipk_in_create_table_and_information_schema = OFF`. Para mais informações, consulte a Seção 15.1.24.11, “Chaves Primárias Invisíveis Geradas”.