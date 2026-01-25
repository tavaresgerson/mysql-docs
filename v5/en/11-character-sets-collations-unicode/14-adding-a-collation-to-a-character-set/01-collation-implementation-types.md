### 10.14.1 Tipos de Implementação de Collation

O MySQL implementa vários tipos de collations:

**Collations simples para conjuntos de caracteres de 8 bits**

Este tipo de collation é implementado usando um array de 256 pesos (weights) que define um mapeamento um-para-um de códigos de caracteres para pesos. `latin1_swedish_ci` é um exemplo. É um collation case-insensitive (não sensível a maiúsculas/minúsculas), portanto, as versões em maiúsculas e minúsculas de um caractere têm os mesmos pesos e são comparadas como iguais.

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

Para instruções de implementação, consulte a Seção 10.14.3, “Adicionando um Collation Simples a um Conjunto de Caracteres de 8 Bits”.

**Collations complexos para conjuntos de caracteres de 8 bits**

Este tipo de collation é implementado usando funções em um arquivo fonte C que definem como ordenar caracteres, conforme descrito na Seção 10.13, “Adicionando um Conjunto de Caracteres”.

**Collations para conjuntos de caracteres multibyte não-Unicode**

Para este tipo de collation, caracteres de 8 bits (single-byte) e multibyte são tratados de forma diferente. Para caracteres de 8 bits, os códigos de caracteres mapeiam para pesos de maneira case-insensitive. (Por exemplo, os caracteres single-byte `'a'` e `'A'` ambos têm um peso de `0x41`.) Para caracteres multibyte, existem dois tipos de relação entre códigos de caracteres e pesos:

*   Os pesos são iguais aos códigos de caracteres. `sjis_japanese_ci` é um exemplo deste tipo de collation. O caractere multibyte `'ぢ'` tem um código de caractere de `0x82C0`, e o peso também é `0x82C0`.

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

*   Os códigos de caracteres mapeiam um-para-um para pesos, mas um código não é necessariamente igual ao peso. `gbk_chinese_ci` é um exemplo deste tipo de collation. O caractere multibyte `'膰'` tem um código de caractere de `0x81B0`, mas um peso de `0xC286`.

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

Para instruções de implementação, consulte a Seção 10.13, “Adicionando um Conjunto de Caracteres”.

**Collations para conjuntos de caracteres multibyte Unicode**

Alguns desses collations são baseados no Unicode Collation Algorithm (UCA), outros não.

Collations não-UCA têm um mapeamento um-para-um do código de caractere para o peso. No MySQL, tais collations são case-insensitive e accent-insensitive (não sensíveis a acentuação). `utf8_general_ci` é um exemplo: `'a'`, `'A'`, `'À'` e `'á'` cada um tem códigos de caracteres diferentes, mas todos têm um peso de `0x0041` e comparam como iguais.

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

*   Se um caractere tiver pesos, cada peso usa 2 bytes (16 bits).

*   Um caractere pode ter zero pesos (ou um peso vazio). Neste caso, o caractere é ignorável. Exemplo: "U+0000 NULL" não tem um peso e é ignorável.

*   Um caractere pode ter um peso. Exemplo: `'a'` tem um peso de `0x0E33`.

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

*   Um caractere pode ter muitos pesos. Isso é uma expansão. Exemplo: A letra alemã `'ß'` (ligatura SZ, ou SHARP S) tem um peso de `0x0FEA0FEA`.

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

*   Muitos caracteres podem ter um peso. Isso é uma contração. Exemplo: `'ch'` é uma única letra em Tcheco e tem um peso de `0x0EE2`.

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

Um mapeamento de muitos caracteres para muitos pesos também é possível (isto é, contração com expansão), mas não é suportado pelo MySQL.

Para instruções de implementação, para um collation não-UCA, consulte a Seção 10.13, “Adicionando um Conjunto de Caracteres”. Para um collation UCA, consulte a Seção 10.14.4, “Adicionando um Collation UCA a um Conjunto de Caracteres Unicode”.

**Collations diversos**

Existem também alguns collations que não se enquadram em nenhuma das categorias anteriores.