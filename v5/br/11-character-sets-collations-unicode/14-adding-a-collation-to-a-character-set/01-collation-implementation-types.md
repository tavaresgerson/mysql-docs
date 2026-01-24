### 10.14.1 Tipos de Implementação de Collation

O MySQL implementa diversos tipos de collations:

**Collations simples para Character Sets de 8-bit**

Este tipo de collation é implementado usando um array de 256 weights que define um mapeamento um-para-um (one-to-one mapping) de character codes para weights. `latin1_swedish_ci` é um exemplo. É um collation case-insensitive, portanto, as versões maiúsculas e minúsculas de um caractere têm os mesmos weights e são comparadas como iguais.

```sql
mysql> SET NAMES 'latin1' COLLATE 'latin1_swedish_ci';
Query OK, 0 rows affected (0.01 sec)

mysql> SELECT HEX(WEIGHT_STRING('a')), HEX(WEIGHT_STRING('A'));
+-------------------------+-------------------------+
| HEX(WEIGHT_STRING('a')) | HEX(WEIGHT_STRING('A')) |
+-------------------------+-------------------------+
| 41                      | 41                      |
+-------------------------+-------------------------+
1 row in set (0.01 sec)

mysql> SELECT 'a' = 'A';
+-----------+
| 'a' = 'A' |
+-----------+
|         1 |
+-----------+
1 row in set (0.12 sec)
```

Para instruções de implementação, consulte a Seção 10.14.3, “Adicionando um Simple Collation a um Character Set de 8-Bit”.

**Collations complexos para Character Sets de 8-bit**

Este tipo de collation é implementado usando funções em um arquivo C source que definem como ordenar caracteres, conforme descrito na Seção 10.13, “Adicionando um Character Set”.

**Collations para Character Sets multibyte não-Unicode**

Para este tipo de collation, caracteres de 8-bit (single-byte) e multibyte são tratados de forma diferente. Para caracteres de 8-bit, os character codes mapeiam para weights de maneira case-insensitive. (Por exemplo, os caracteres single-byte `'a'` e `'A'` ambos têm um weight de `0x41`.) Para caracteres multibyte, existem dois tipos de relacionamento entre character codes e weights:

* Weights iguais aos character codes. `sjis_japanese_ci` é um exemplo deste tipo de collation. O caractere multibyte `'ぢ'` tem um character code de `0x82C0`, e o weight também é `0x82C0`.

  ```sql
  mysql> CREATE TABLE t1
         (c1 VARCHAR(2) CHARACTER SET sjis COLLATE sjis_japanese_ci);
  Query OK, 0 rows affected (0.01 sec)

  mysql> INSERT INTO t1 VALUES ('a'),('A'),(0x82C0);
  Query OK, 3 rows affected (0.00 sec)
  Records: 3  Duplicates: 0  Warnings: 0

  mysql> SELECT c1, HEX(c1), HEX(WEIGHT_STRING(c1)) FROM t1;
  +------+---------+------------------------+
  | c1   | HEX(c1) | HEX(WEIGHT_STRING(c1)) |
  +------+---------+------------------------+
  | a    | 61      | 41                     |
  | A    | 41      | 41                     |
  | ぢ    | 82C0    | 82C0                   |
  +------+---------+------------------------+
  3 rows in set (0.00 sec)
  ```

* Character codes mapeiam um-para-um para weights, mas um code não é necessariamente igual ao weight. `gbk_chinese_ci` é um exemplo deste tipo de collation. O caractere multibyte `'膰'` tem um character code de `0x81B0`, mas um weight de `0xC286`.

  ```sql
  mysql> CREATE TABLE t1
         (c1 VARCHAR(2) CHARACTER SET gbk COLLATE gbk_chinese_ci);
  Query OK, 0 rows affected (0.33 sec)

  mysql> INSERT INTO t1 VALUES ('a'),('A'),(0x81B0);
  Query OK, 3 rows affected (0.00 sec)
  Records: 3  Duplicates: 0  Warnings: 0

  mysql> SELECT c1, HEX(c1), HEX(WEIGHT_STRING(c1)) FROM t1;
  +------+---------+------------------------+
  | c1   | HEX(c1) | HEX(WEIGHT_STRING(c1)) |
  +------+---------+------------------------+
  | a    | 61      | 41                     |
  | A    | 41      | 41                     |
  | 膰    | 81B0    | C286                   |
  +------+---------+------------------------+
  3 rows in set (0.00 sec)
  ```

Para instruções de implementação, consulte a Seção 10.13, “Adicionando um Character Set”.

**Collations para Character Sets multibyte Unicode**

Alguns desses collations são baseados no Unicode Collation Algorithm (UCA), outros não.

Collations não-UCA têm um mapeamento um-para-um de character code para weight. No MySQL, esses collations são case-insensitive e accent-insensitive. `utf8_general_ci` é um exemplo: `'a'`, `'A'`, `'À'` e `'á'` cada um tem character codes diferentes, mas todos têm um weight de `0x0041` e são comparados como iguais.

```sql
mysql> SET NAMES 'utf8' COLLATE 'utf8_general_ci';
Query OK, 0 rows affected (0.00 sec)

mysql> CREATE TABLE t1
       (c1 CHAR(1) CHARACTER SET UTF8 COLLATE utf8_general_ci);
Query OK, 0 rows affected (0.01 sec)

mysql> INSERT INTO t1 VALUES ('a'),('A'),('À'),('á');
Query OK, 4 rows affected (0.00 sec)
Records: 4  Duplicates: 0  Warnings: 0

mysql> SELECT c1, HEX(c1), HEX(WEIGHT_STRING(c1)) FROM t1;
+------+---------+------------------------+
| c1   | HEX(c1) | HEX(WEIGHT_STRING(c1)) |
+------+---------+------------------------+
| a    | 61      | 0041                   |
| A    | 41      | 0041                   |
| À    | C380    | 0041                   |
| á    | C3A1    | 0041                   |
+------+---------+------------------------+
4 rows in set (0.00 sec)
```

Collations baseados em UCA no MySQL têm estas propriedades:

* Se um caractere tem weights, cada weight usa 2 bytes (16 bits).

* Um caractere pode ter zero weights (ou um weight vazio). Neste caso, o caractere é ignorável. Exemplo: "U+0000 NULL" não tem um weight e é ignorável.

* Um caractere pode ter um weight. Exemplo: `'a'` tem um weight de `0x0E33`.

  ```sql
  mysql> SET NAMES 'utf8' COLLATE 'utf8_unicode_ci';
  Query OK, 0 rows affected (0.05 sec)

  mysql> SELECT HEX('a'), HEX(WEIGHT_STRING('a'));
  +----------+-------------------------+
  | HEX('a') | HEX(WEIGHT_STRING('a')) |
  +----------+-------------------------+
  | 61       | 0E33                    |
  +----------+-------------------------+
  1 row in set (0.02 sec)
  ```

* Um caractere pode ter muitos weights. Isso é uma expansão. Exemplo: A letra alemã `'ß'` (ligatura SZ, ou SHARP S) tem um weight de `0x0FEA0FEA`.

  ```sql
  mysql> SET NAMES 'utf8' COLLATE 'utf8_unicode_ci';
  Query OK, 0 rows affected (0.11 sec)

  mysql> SELECT HEX('ß'), HEX(WEIGHT_STRING('ß'));
  +-----------+--------------------------+
  | HEX('ß')  | HEX(WEIGHT_STRING('ß'))  |
  +-----------+--------------------------+
  | C39F      | 0FEA0FEA                 |
  +-----------+--------------------------+
  1 row in set (0.00 sec)
  ```

* Muitos caracteres podem ter um weight. Isso é uma contração. Exemplo: `'ch'` é uma única letra em Tcheco e tem um weight de `0x0EE2`.

  ```sql
  mysql> SET NAMES 'utf8' COLLATE 'utf8_czech_ci';
  Query OK, 0 rows affected (0.09 sec)

  mysql> SELECT HEX('ch'), HEX(WEIGHT_STRING('ch'));
  +-----------+--------------------------+
  | HEX('ch') | HEX(WEIGHT_STRING('ch')) |
  +-----------+--------------------------+
  | 6368      | 0EE2                     |
  +-----------+--------------------------+
  1 row in set (0.00 sec)
  ```

Um mapeamento de muitos-caracteres-para-muitos-weights também é possível (isso é contração com expansão), mas não é suportado pelo MySQL.

Para instruções de implementação, para um collation não-UCA, consulte a Seção 10.13, “Adicionando um Character Set”. Para um collation UCA, consulte a Seção 10.14.4, “Adicionando um UCA Collation a um Character Set Unicode”.

**Collations Diversos**

Existem também alguns collations que não se enquadram em nenhuma das categorias anteriores.