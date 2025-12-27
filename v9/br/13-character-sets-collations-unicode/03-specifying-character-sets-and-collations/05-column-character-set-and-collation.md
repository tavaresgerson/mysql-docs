### 12.3.5 Conjunto de Caracteres da Coluna e Coletânea

Cada coluna de "caractere" (ou seja, uma coluna do tipo `CHAR`, `VARCHAR`, um tipo `TEXT` ou qualquer sinônimo) tem um conjunto de caracteres da coluna e uma coletânea da coluna. A sintaxe de definição de coluna para `CREATE TABLE` e `ALTER TABLE` tem cláusulas opcionais para especificar o conjunto de caracteres da coluna e a coletânea da coluna:

```
col_name {CHAR | VARCHAR | TEXT} (col_length)
    [CHARACTER SET charset_name]
    [COLLATE collation_name]
```

Essas cláusulas também podem ser usadas para colunas `ENUM` e `SET`:

```
col_name {ENUM | SET} (val_list)
    [CHARACTER SET charset_name]
    [COLLATE collation_name]
```

Exemplos:

```
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

O MySQL escolhe o conjunto de caracteres da coluna e a coletânea da coluna da seguinte maneira:

* Se tanto `CHARACTER SET charset_name` quanto `COLLATE collation_name` forem especificados, o conjunto de caracteres *`charset_name`* e a coletânea *`collation_name`* serão usados.

  ```
  CREATE TABLE t1
  (
      col1 CHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  ) CHARACTER SET latin1 COLLATE latin1_bin;
  ```

  O conjunto de caracteres e a coletânea são especificados para a coluna, então eles são usados. A coluna tem conjunto de caracteres `utf8mb4` e coletânea `utf8mb4_unicode_ci`.

* Se `CHARACTER SET charset_name` for especificado sem `COLLATE`, o conjunto de caracteres *`charset_name`* e sua coletânea padrão serão usados.

  ```
  CREATE TABLE t1
  (
      col1 CHAR(10) CHARACTER SET utf8mb4
  ) CHARACTER SET latin1 COLLATE latin1_bin;
  ```

  O conjunto de caracteres é especificado para a coluna, mas a coletânea não. A coluna tem conjunto de caracteres `utf8mb4` e a coletânea padrão para `utf8mb4`, que é `utf8mb4_0900_ai_ci`. Para ver a coletânea padrão para cada conjunto de caracteres, use a declaração `SHOW CHARACTER SET` ou consulte a tabela `INFORMATION_SCHEMA` `CHARACTER_SETS`.

* Se `COLLATE collation_name` for especificado sem `CHARACTER SET`, o conjunto de caracteres associado a *`collation_name`* e a coletânea *`collation_name`* serão usados.

  ```
  CREATE TABLE t1
  (
      col1 CHAR(10) COLLATE utf8mb4_polish_ci
  ) CHARACTER SET latin1 COLLATE latin1_bin;
  ```

  A coletânea é especificada para a coluna, mas o conjunto de caracteres não. A coluna tem coletânea `utf8mb4_polish_ci` e o conjunto de caracteres é o associado à coletânea, que é `utf8mb4`.

* Caso contrário (nem `CHARACTER SET` nem `COLLATE` sejam especificados), o conjunto de caracteres da tabela e a collation são usados.

```
  CREATE TABLE t1
  (
      col1 CHAR(10)
  ) CHARACTER SET latin1 COLLATE latin1_bin;
  ```

Não foram especificados o conjunto de caracteres nem a collation para a coluna, então os valores padrão da tabela são usados. A coluna tem o conjunto de caracteres `latin1` e a collation `latin1_bin`.

As cláusulas `CHARACTER SET` e `COLLATE` são SQL padrão.

Se você usar `ALTER TABLE` para converter uma coluna de um conjunto de caracteres para outro, o MySQL tenta mapear os valores dos dados, mas se os conjuntos de caracteres forem incompatíveis, pode haver perda de dados.