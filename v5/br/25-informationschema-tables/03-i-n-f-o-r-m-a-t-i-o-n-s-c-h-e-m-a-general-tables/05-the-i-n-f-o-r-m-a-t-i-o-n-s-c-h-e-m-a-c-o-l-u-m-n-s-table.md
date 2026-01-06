### 24.3.5 A tabela INFORMATION\_SCHEMA COLUMNS

A tabela `COLUMNS` fornece informações sobre as colunas das tabelas.

A tabela `COLUMNS` tem essas colunas:

- `TABLE_CATALOG`

  O nome do catálogo ao qual a tabela que contém a coluna pertence. Esse valor é sempre `def`.

- `TABLE_SCHEMA`

  O nome do esquema (banco de dados) ao qual a tabela que contém a coluna pertence.

- `NOME_TABELA`

  O nome da tabela que contém a coluna.

- `NOME_COLUNA`

  O nome da coluna.

- `ORDINAL_POSITION`

  A posição da coluna na tabela. `ORDINAL_POSITION` é necessária porque você pode querer dizer `ORDER BY ORDINAL_POSITION`. Ao contrário de `SHOW COLUMNS`, `SELECT` da tabela `COLUMNS` não tem ordenação automática.

- `COLUNA_PADrão`

  O valor padrão da coluna. É `NULL` se a coluna tiver um valor padrão explícito de `NULL` ou se a definição da coluna não incluir nenhuma cláusula `DEFAULT`.

- `IS_NULLABLE`

  A coluna nulidade. O valor é `SIM` se valores `NULL` puderem ser armazenados na coluna, `NÃO` se não puderem.

- `DATA_TYPE`

  O tipo de dados da coluna.

  O valor `DATA_TYPE` é apenas o nome do tipo sem nenhuma outra informação. O valor `COLUMN_TYPE` contém o nome do tipo e, possivelmente, outras informações, como a precisão ou o comprimento.

- `CHARACTER_MAXIMUM_LENGTH`

  Para colunas de texto, o comprimento máximo em caracteres.

- `CHARACTER_OCTET_LENGTH`

  Para colunas de texto, o comprimento máximo em bytes.

- `NUMERIC_PRECISION`

  Para colunas numéricas, a precisão numérica.

- `NUMERIC_SCALE`

  Para colunas numéricas, a escala numérica.

- `DATETIME_PRECISION`

  Para colunas temporais, a precisão de frações de segundo.

- `CHARACTER_SET_NAME`

  Para colunas de cadeias de caracteres, o nome do conjunto de caracteres.

- `COLLATION_NAME`

  Para colunas de cadeias de caracteres, o nome da collation.

- `COLUMN_TYPE`

  O tipo de dados da coluna.

  O valor `DATA_TYPE` é apenas o nome do tipo sem nenhuma outra informação. O valor `COLUMN_TYPE` contém o nome do tipo e, possivelmente, outras informações, como a precisão ou o comprimento.

- `COLUNA_CHAVE`

  Se a coluna está indexada:

  - Se `COLUMN_KEY` estiver vazio, a coluna não está indexada ou está indexada apenas como uma coluna secundária em um índice múltiplo e não único.

  - Se `COLUMN_KEY` for `PRI`, a coluna é uma `PRIMARY KEY` ou é uma das colunas de uma `PRIMARY KEY` de múltiplas colunas.

  - Se `COLUMN_KEY` for `UNI`, a coluna é a primeira coluna de um índice `UNIQUE`. (Um índice `UNIQUE` permite múltiplos valores `NULL`, mas você pode verificar se a coluna permite `NULL` verificando a coluna `Null`.)

  - Se `COLUMN_KEY` for `MUL`, a coluna é a primeira coluna de um índice não único em que múltiplas ocorrências de um valor específico são permitidas na coluna.

  Se mais de um dos valores de `COLUMN_KEY` se aplicar a uma coluna específica de uma tabela, o `COLUMN_KEY` exibirá o valor com a maior prioridade, na ordem `PRI`, `UNI`, `MUL`.

  Um índice `UNIQUE` pode ser exibido como `PRI` se ele não puder conter valores `NULL` e não houver uma `PRIMARY KEY` na tabela. Um índice `UNIQUE` pode ser exibido como `MUL` se várias colunas formarem um índice `UNIQUE` composto; embora a combinação das colunas seja única, cada coluna ainda pode conter múltiplas ocorrências de um valor específico.

- `EXTRA`

  Qualquer informação adicional disponível sobre uma coluna específica. O valor não pode estar vazio nesses casos:

  - `auto_increment` para as colunas que possuem o atributo `AUTO_INCREMENT`.

  - `on update CURRENT_TIMESTAMP` para as colunas `TIMESTAMP` ou `DATETIME` que possuem o atributo `ON UPDATE CURRENT_TIMESTAMP`.

  - `STORED GENERATED` ou `VIRTUAL GENERATED` para colunas geradas.

- PRÉMIOS

  Os privilégios que você tem para a coluna.

- `COLUNA_COMENTÁRIO`

  Qualquer comentário incluído na definição da coluna.

- `EXPRESSÃO_GERAÇÃO`

  Para colunas geradas, exibe a expressão usada para calcular os valores da coluna. Vazio para colunas não geradas. Para informações sobre colunas geradas, consulte Seção 13.1.18.7, “CREATE TABLE e Colunas Geradas”.

#### Notas

- Na página `SHOW COLUMNS`, a exibição `Type` inclui valores de várias colunas diferentes da tabela `COLUMNS` (information-schema-columns-table.html).

- `CHARACTER_OCTET_LENGTH` deve ser igual a `CHARACTER_MAXIMUM_LENGTH`, exceto para conjuntos de caracteres multibyte.

- `CHARACTER_SET_NAME` pode ser derivado de `COLLATION_NAME`. Por exemplo, se você digitar `SHOW FULL COLUMNS FROM t`, e você ver no campo `COLLATION_NAME` um valor de `latin1_swedish_ci`, o conjunto de caracteres é o que está antes do primeiro sublinhado: `latin1`.

As informações da coluna também estão disponíveis na instrução `SHOW COLUMNS`. Veja Seção 13.7.5.5, “Instrução SHOW COLUMNS”. As seguintes instruções são quase equivalentes:

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
