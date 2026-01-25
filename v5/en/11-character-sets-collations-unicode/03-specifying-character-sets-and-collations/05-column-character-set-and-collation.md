### 10.3.5 Conjunto de Caracteres e Collation de Coluna

Toda coluna de “caracteres” (ou seja, uma coluna do tipo `CHAR`, `VARCHAR`, um tipo `TEXT` ou qualquer sinônimo) possui um conjunto de caracteres de coluna e uma collation de coluna. A sintaxe de definição de coluna para `CREATE TABLE` e `ALTER TABLE` possui cláusulas opcionais para especificar o conjunto de caracteres e a collation da coluna:

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

O MySQL escolhe o conjunto de caracteres e a collation da coluna da seguinte maneira:

* Se tanto `CHARACTER SET charset_name` quanto `COLLATE collation_name` forem especificados, o conjunto de caracteres *`charset_name`* e a collation *`collation_name`* serão usados.

  ```sql
  CREATE TABLE t1
  (
      col1 CHAR(10) CHARACTER SET utf8 COLLATE utf8_unicode_ci
  ) CHARACTER SET latin1 COLLATE latin1_bin;
  ```

  O conjunto de caracteres e a collation são especificados para a coluna, portanto, são usados. A coluna terá o conjunto de caracteres `utf8` e a collation `utf8_unicode_ci`.

* Se `CHARACTER SET charset_name` for especificado sem `COLLATE`, o conjunto de caracteres *`charset_name`* e sua collation padrão serão usados.

  ```sql
  CREATE TABLE t1
  (
      col1 CHAR(10) CHARACTER SET utf8
  ) CHARACTER SET latin1 COLLATE latin1_bin;
  ```

  O conjunto de caracteres é especificado para a coluna, mas a collation não é. A coluna terá o conjunto de caracteres `utf8` e a collation padrão para `utf8`, que é `utf8_general_ci`. Para ver a collation padrão para cada conjunto de caracteres, use o comando `SHOW CHARACTER SET` ou faça uma Query na tabela `CHARACTER_SETS` do `INFORMATION_SCHEMA`.

* Se `COLLATE collation_name` for especificado sem `CHARACTER SET`, o conjunto de caracteres associado a *`collation_name`* e a collation *`collation_name`* serão usados.

  ```sql
  CREATE TABLE t1
  (
      col1 CHAR(10) COLLATE utf8_polish_ci
  ) CHARACTER SET latin1 COLLATE latin1_bin;
  ```

  A collation é especificada para a coluna, mas o conjunto de caracteres não é. A coluna terá a collation `utf8_polish_ci` e o conjunto de caracteres será aquele associado à collation, que é `utf8`.

* Caso contrário (se nem `CHARACTER SET` nem `COLLATE` forem especificados), o conjunto de caracteres e a collation da tabela serão usados.

  ```sql
  CREATE TABLE t1
  (
      col1 CHAR(10)
  ) CHARACTER SET latin1 COLLATE latin1_bin;
  ```

  Nem o conjunto de caracteres nem a collation são especificados para a coluna, portanto, os padrões da tabela são usados. A coluna terá o conjunto de caracteres `latin1` e a collation `latin1_bin`.

As cláusulas `CHARACTER SET` e `COLLATE` são SQL padrão.

Se você usar `ALTER TABLE` para converter uma coluna de um conjunto de caracteres para outro, o MySQL tentará mapear os valores dos dados, mas se os conjuntos de caracteres forem incompatíveis, poderá haver perda de dados.