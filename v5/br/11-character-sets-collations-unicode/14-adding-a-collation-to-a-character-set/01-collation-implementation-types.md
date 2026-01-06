### 10.14.1 Tipos de implementação de cotação

O MySQL implementa vários tipos de colatações:

**Colagens simples para conjuntos de caracteres de 8 bits**

Esse tipo de ordenação é implementado usando um array de 256 pesos que define uma correspondência um-para-um entre códigos de caracteres e pesos. `latin1_swedish_ci` é um exemplo. É uma ordenação insensível a maiúsculas e minúsculas, portanto, as versões maiúsculas e minúsculas de um caractere têm os mesmos pesos e são consideradas iguais.

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

Para obter instruções de implementação, consulte a Seção 10.14.3, “Adicionando uma Colagem Simples a um Conjunto de Caracteres de 8 Bits”.

**Colagens complexas para conjuntos de caracteres de 8 bits**

Esse tipo de ordenação é implementado usando funções em um arquivo de código-fonte em C que definem como ordenar os caracteres, conforme descrito na Seção 10.13, “Adicionando um Conjunto de Caracteres”.

**Colagens para conjuntos de caracteres multibyte não Unicode**

Para este tipo de ordenação, os caracteres de 8 bits (um único byte) e os caracteres multibyte são tratados de maneira diferente. Para caracteres de 8 bits, os códigos de caracteres correspondem a pesos de forma insensível a maiúsculas e minúsculas. (Por exemplo, os caracteres de um único byte `'a'` e `'A'` têm o mesmo peso, que é `0x41`.) Para caracteres multibyte, existem dois tipos de relação entre os códigos de caracteres e os pesos:

- Os pesos correspondem aos códigos de caracteres. `sjis_japanese_ci` é um exemplo desse tipo de ordenação. O caractere multibyte `'ぢ'` tem um código de caracteres de `0x82C0`, e o peso também é `0x82C0`.

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

- Os códigos de caracteres mapeiam um para um com os pesos, mas um código não é necessariamente igual ao peso. `gbk_chinese_ci` é um exemplo desse tipo de ordenação. O caractere multibyte `'膰'` tem um código de caracteres de `0x81B0`, mas um peso de `0xC286`.

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

Para obter instruções de implementação, consulte a Seção 10.13, “Adicionar um Conjunto de Caracteres”.

**Colagens para conjuntos de caracteres multibyte Unicode**

Algumas dessas ordenações são baseadas no Algoritmo de Ordenação Unicode (UCA), outras

As collation não-UCA têm uma correspondência um-para-um entre o código de caracteres e o peso. No MySQL, essas collation são insensíveis ao caso e ao acento. `utf8_general_ci` é um exemplo: `'a'`, `'A'`, `'À'` e `'á'` têm códigos de caracteres diferentes, mas todos têm o mesmo peso (`0x0041`) e são comparados como iguais.

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

As collation de base em UCA no MySQL têm essas propriedades:

- Se um caractere tiver pesos, cada peso usa 2 bytes (16 bits).

- Um caractere pode ter zero pesos (ou um peso vazio). Nesse caso, o caractere é ignorável. Exemplo: "U+0000 NULL" não tem peso e é ignorável.

- Um caractere pode ter um peso. Exemplo: `'a'` tem um peso de `0x0E33`.

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

- Um caractere pode ter vários pesos. Isso é uma expansão. Exemplo: A letra alemã `'ß'` (ligatura SZ, ou S AFUNDADO) tem um peso de `0x0FEA0FEA`.

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

- Muitos caracteres podem ter um peso. Isso é uma contração. Exemplo: `'ch'` é uma única letra em checo e tem um peso de `0x0EE2`.

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

É também possível criar uma mapeia de muitos caracteres para muitos pesos (essa é a contração com expansão), mas isso não é suportado pelo MySQL.

Para obter instruções de implementação, para uma ordenação que não seja da UCA, consulte a Seção 10.13, “Adicionando um Conjunto de Caracteres”. Para uma ordenação da UCA, consulte a Seção 10.14.4, “Adicionando uma Ordenação da UCA a um Conjunto de Caracteres Unicode”.

**Colagens variadas**

Há também algumas combinações que não se enquadram em nenhuma das categorias anteriores.
