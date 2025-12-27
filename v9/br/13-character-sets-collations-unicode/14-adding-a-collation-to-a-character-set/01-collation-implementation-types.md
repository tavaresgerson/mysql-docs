### 12.14.1 Tipos de Colagem

O MySQL implementa vários tipos de colágias:

**Colágias simples para conjuntos de caracteres de 8 bits**

Esse tipo de colágias é implementado usando um array de 256 pesos que define uma correspondência um-para-um entre códigos de caracteres e pesos. `latin1_swedish_ci` é um exemplo. É uma colágias insensível a maiúsculas e minúsculas, portanto, as versões maiúsculas e minúsculas de um caractere têm os mesmos pesos e são comparadas como iguais.

```
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

Para instruções de implementação, consulte a Seção 12.14.3, “Adicionando uma Colágias Simples a um Conjunto de Caracteres de 8 Bits”.

**Colágias complexas para conjuntos de caracteres multibyte de 8 bits**

Esse tipo de colágias é implementado usando funções em um arquivo de código C que definem como ordenar caracteres, conforme descrito na Seção 12.13, “Adicionando um Conjunto de Caracteres”.

**Colágias para conjuntos de caracteres multibyte não Unicode**

Para esse tipo de colágias, caracteres de 8 bits (single-byte) e multibyte são tratados de maneira diferente. Para caracteres de 8 bits, os códigos de caracteres mapeiam para pesos de maneira insensível a maiúsculas e minúsculas. (Por exemplo, os caracteres single-byte `'a'` e `'A'` têm ambos um peso de `0x41`.) Para caracteres multibyte, existem dois tipos de relação entre códigos de caracteres e pesos:

* Pesos iguais a códigos de caracteres. `sjis_japanese_ci` é um exemplo desse tipo de colágias. O caractere multibyte `'ぢ'` tem um código de caractere de `0x82C0`, e o peso também é `0x82C0`.

  ```
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

* Códigos de caracteres mapeiam um-para-um para pesos, mas um código não é necessariamente igual ao peso. `gbk_chinese_ci` é um exemplo desse tipo de colágias. O caractere multibyte `'膰'` tem um código de caractere de `0x81B0`, mas um peso de `0xC286`.

  ```
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

Para instruções de implementação, consulte a Seção 12.13, “Adicionando um Conjunto de Caracteres”.

**Colagens para conjuntos de caracteres multibyte Unicode**

Algumas dessas colagens são baseadas no Algoritmo de Colagem Unicode (UCA), outras não.

As colagens que não são baseadas no UCA têm uma correspondência um-para-um entre o código do caractere e o peso. No MySQL, essas colagens são insensíveis ao caso e ao acento. `utf8mb4_general_ci` é um exemplo: `'a'`, `'A'`, `'À'`, e `'á'` têm códigos de caracteres diferentes, mas todos têm um peso de `0x0041` e são comparados como iguais.

```
mysql> SET NAMES 'utf8mb4' COLLATE 'utf8mb4_general_ci';
Query OK, 0 rows affected (0.00 sec)

mysql> CREATE TABLE t1
       (c1 CHAR(1) CHARACTER SET UTF8MB4 COLLATE utf8mb4_general_ci);
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

As colagens baseadas no UCA no MySQL têm essas propriedades:

* Se um caractere tem pesos, cada peso usa 2 bytes (16 bits).

* Um caractere pode ter zero pesos (ou um peso vazio). Neste caso, o caractere é ignorável. Exemplo: "U+0000 NULL" não tem um peso e é ignorável.

* Um caractere pode ter um peso. Exemplo: `'a'` tem um peso de `0x0E33`.

  ```
  mysql> SET NAMES 'utf8mb4' COLLATE 'utf8mb4_unicode_ci';
  Query OK, 0 rows affected (0.05 sec)

  mysql> SELECT HEX('a'), HEX(WEIGHT_STRING('a'));
  +----------+-------------------------+
  | HEX('a') | HEX(WEIGHT_STRING('a')) |
  +----------+-------------------------+
  | 61       | 0E33                    |
  +----------+-------------------------+
  1 row in set (0.02 sec)
  ```

* Um caractere pode ter muitos pesos. Esta é uma expansão. Exemplo: A letra alemã `'ß'` (ligatura SZ, ou SHARP S) tem um peso de `0x0FEA0FEA`.

  ```
  mysql> SET NAMES 'utf8mb4' COLLATE 'utf8mb4_unicode_ci';
  Query OK, 0 rows affected (0.11 sec)

  mysql> SELECT HEX('ß'), HEX(WEIGHT_STRING('ß'));
  +-----------+--------------------------+
  | HEX('ß')  | HEX(WEIGHT_STRING('ß'))  |
  +-----------+--------------------------+
  | C39F      | 0FEA0FEA                 |
  +-----------+--------------------------+
  1 row in set (0.00 sec)
  ```

* Muitos caracteres podem ter um peso. Esta é uma contração. Exemplo: `'ch'` é uma única letra no tcheco e tem um peso de `0x0EE2`.

  ```
  mysql> SET NAMES 'utf8mb4' COLLATE 'utf8mb4_czech_ci';
  Query OK, 0 rows affected (0.09 sec)

  mysql> SELECT HEX('ch'), HEX(WEIGHT_STRING('ch'));
  +-----------+--------------------------+
  | HEX('ch') | HEX(WEIGHT_STRING('ch')) |
  +-----------+--------------------------+
  | 6368      | 0EE2                     |
  +-----------+--------------------------+
  1 row in set (0.00 sec)
  ```

Uma mapeiação de muitos caracteres para muitos pesos também é possível (esta é uma contração com expansão), mas não é suportada pelo MySQL.

Para instruções de implementação, para uma colagem que não é baseada no UCA, consulte a Seção 12.13, “Adicionando um Conjunto de Caracteres”. Para uma colagem baseada no UCA, consulte a Seção 12.14.4, “Adicionando uma Colagem UCA a um Conjunto de Caracteres Unicode”.

**Colagens mistas**

Há também algumas colagens que não se encaixam em nenhuma das categorias anteriores.