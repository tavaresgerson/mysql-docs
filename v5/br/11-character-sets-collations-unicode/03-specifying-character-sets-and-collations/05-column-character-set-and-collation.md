### 10.3.5 Conjunto de caracteres da coluna e classificação

Cada coluna de “caractere” (ou seja, uma coluna do tipo `CHAR`, `VARCHAR`, um tipo `TEXT` ou qualquer sinônimo) tem um conjunto de caracteres da coluna e uma collation da coluna. A sintaxe de definição de coluna para `CREATE TABLE` e `ALTER TABLE` tem cláusulas opcionais para especificar o conjunto de caracteres da coluna e a collation:

```sql
col_name {CHAR | VARCHAR | TEXT} (col_length)
    [CHARACTER SET charset_name]
    [COLLATE collation_name]
```

Essas cláusulas também podem ser usadas para colunas `ENUM` e `SET`:

```sql
col_name {ENUM | SET} (val_list)
    [CHARACTER SET charset_name]
    [COLLATE collation_name]
```

Exemplos:

```sql
CREATE TABLE t1
(
    col1 VARCHAR(5)
      CHARACTER SET latin1
      COLLATE latin1_german1_ci
);

ALTER TABLE t1 MODIFY
    col1 VARCHAR(5)
      CHARACTER SET latin1
      COLLATE latin1_swedish_ci;
```

O MySQL escolhe o conjunto de caracteres da coluna e a ordenação da seguinte maneira:

- Se ambos `CHARACTER SET charset_name` e `COLLATE collation_name` forem especificados, o conjunto de caracteres *`charset_name`* e a ordenação *`collation_name`* serão usados.

  ```sql
  CREATE TABLE t1
  (
      col1 CHAR(10) CHARACTER SET utf8 COLLATE utf8_unicode_ci
  ) CHARACTER SET latin1 COLLATE latin1_bin;
  ```

  O conjunto de caracteres e a ordenação são especificados para a coluna, então eles são usados. A coluna tem o conjunto de caracteres `utf8` e a ordenação `utf8_unicode_ci`.

- Se `CHARACTER SET charset_name` for especificado sem `COLLATE`, o conjunto de caracteres `charset_name`\* e sua collation padrão serão usados.

  ```sql
  CREATE TABLE t1
  (
      col1 CHAR(10) CHARACTER SET utf8
  ) CHARACTER SET latin1 COLLATE latin1_bin;
  ```

  O conjunto de caracteres é especificado para a coluna, mas a concordância não está definida. A coluna tem o conjunto de caracteres `utf8` e a concordância padrão para `utf8`, que é `utf8_general_ci`. Para ver a concordância padrão para cada conjunto de caracteres, use a instrução `SHOW CHARACTER SET` ou consulte a tabela `INFORMATION_SCHEMA` `CHARACTER_SETS`.

- Se `COLLATE collation_name` for especificado sem `CHARACTER SET`, o conjunto de caracteres associado a *`collation_name`* e a collation *`collation_name`* serão usados.

  ```sql
  CREATE TABLE t1
  (
      col1 CHAR(10) COLLATE utf8_polish_ci
  ) CHARACTER SET latin1 COLLATE latin1_bin;
  ```

  A ordenação é especificada para a coluna, mas o conjunto de caracteres não é. A coluna tem a ordenação `utf8_polish_ci` e o conjunto de caracteres é o associado à ordenação, que é `utf8`.

- Caso contrário (nem `CHARACTER SET` nem `COLLATE` sejam especificados), o conjunto de caracteres da tabela e a collation serão usados.

  ```sql
  CREATE TABLE t1
  (
      col1 CHAR(10)
  ) CHARACTER SET latin1 COLLATE latin1_bin;
  ```

  Não foi especificado o conjunto de caracteres nem a ordenação para a coluna, então os valores padrão da tabela são usados. A coluna tem o conjunto de caracteres `latin1` e a ordenação `latin1_bin`.

As cláusulas `CHARACTER SET` e `COLLATE` são SQL padrão.

Se você usar `ALTER TABLE` para converter uma coluna de um conjunto de caracteres para outro, o MySQL tenta mapear os valores dos dados, mas se os conjuntos de caracteres forem incompatíveis, pode haver perda de dados.
