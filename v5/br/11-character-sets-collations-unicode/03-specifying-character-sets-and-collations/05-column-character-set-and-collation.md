### 10.3.5 Character Set e Collation de Coluna

Toda coluna de "caractere" (ou seja, uma coluna do tipo `CHAR`, `VARCHAR`, um tipo `TEXT` ou qualquer sinônimo) possui um character set de coluna e uma collation de coluna. A sintaxe de definição de coluna para `CREATE TABLE` e `ALTER TABLE` possui cláusulas opcionais para especificar o character set e a collation da coluna:

```sql
col_name {CHAR | VARCHAR | TEXT} (col_length)
    [CHARACTER SET charset_name]
    [COLLATE collation_name]
```

Estas cláusulas também podem ser usadas para colunas `ENUM` e `SET`:

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

O MySQL escolhe o character set e a collation da coluna da seguinte maneira:

* Se ambos `CHARACTER SET charset_name` e `COLLATE collation_name` forem especificados, o character set *`charset_name`* e a collation *`collation_name`* são usados.

  ```sql
  CREATE TABLE t1
  (
      col1 CHAR(10) CHARACTER SET utf8 COLLATE utf8_unicode_ci
  ) CHARACTER SET latin1 COLLATE latin1_bin;
  ```

  O character set e a collation são especificados para a coluna, portanto, são usados. A coluna tem character set `utf8` e collation `utf8_unicode_ci`.

* Se `CHARACTER SET charset_name` for especificado sem `COLLATE`, o character set *`charset_name`* e sua collation padrão são usados.

  ```sql
  CREATE TABLE t1
  (
      col1 CHAR(10) CHARACTER SET utf8
  ) CHARACTER SET latin1 COLLATE latin1_bin;
  ```

  O character set é especificado para a coluna, mas a collation não é. A coluna tem character set `utf8` e a collation padrão para `utf8`, que é `utf8_general_ci`. Para ver a collation padrão para cada character set, use a instrução `SHOW CHARACTER SET` ou faça uma Query na tabela `CHARACTER_SETS` do `INFORMATION_SCHEMA`.

* Se `COLLATE collation_name` for especificado sem `CHARACTER SET`, o character set associado a *`collation_name`* e a collation *`collation_name`* são usados.

  ```sql
  CREATE TABLE t1
  (
      col1 CHAR(10) COLLATE utf8_polish_ci
  ) CHARACTER SET latin1 COLLATE latin1_bin;
  ```

  A collation é especificada para a coluna, mas o character set não é. A coluna tem collation `utf8_polish_ci` e o character set é aquele associado à collation, que é `utf8`.

* Caso contrário (nem `CHARACTER SET` nem `COLLATE` é especificado), o character set e a collation da tabela são usados.

  ```sql
  CREATE TABLE t1
  (
      col1 CHAR(10)
  ) CHARACTER SET latin1 COLLATE latin1_bin;
  ```

  Nem o character set nem a collation são especificados para a coluna, portanto, os defaults da tabela são usados. A coluna tem character set `latin1` e collation `latin1_bin`.

As cláusulas `CHARACTER SET` e `COLLATE` são SQL padrão.

Se você usar `ALTER TABLE` para converter uma coluna de um character set para outro, o MySQL tentará mapear os valores dos dados, mas se os character sets forem incompatíveis, pode haver perda de dados.