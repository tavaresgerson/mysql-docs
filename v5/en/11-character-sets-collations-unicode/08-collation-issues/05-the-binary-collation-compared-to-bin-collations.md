### 10.8.5 A Collation binary Comparada às Collations _bin

Esta seção descreve como a collation `binary` para strings binárias se compara às collations `_bin` para strings não binárias.

Strings binárias (conforme armazenadas usando os Data Types `BINARY`, `VARBINARY` e `BLOB`) possuem um conjunto de caracteres e uma collation chamada `binary`. Strings binárias são sequências de bytes, e os valores numéricos desses bytes determinam a ordem de comparação e ordenação (sort order). Consulte a Seção 10.10.8, “O Conjunto de Caracteres Binário”.

Strings não binárias (conforme armazenadas usando os Data Types `CHAR`, `VARCHAR` e `TEXT`) possuem um conjunto de caracteres e uma collation diferente de `binary`. Um determinado conjunto de caracteres não binários pode ter várias collations, cada uma definindo uma ordem particular de comparação e ordenação (sort order) para os caracteres no conjunto. Uma dessas é a collation binária, indicada por um sufixo `_bin` no nome da collation. Por exemplo, a collation binária para `utf8` e `latin1` é nomeada `utf8_bin` e `latin1_bin`, respectivamente.

A collation `binary` difere das collations `_bin` em vários aspectos, discutidos nas seções a seguir:

* A Unidade para Comparação e Ordenação
* Conversão de Conjunto de Caracteres
* Conversão de Caixa
* Tratamento de Espaços à Direita em Comparações
* Tratamento de Espaços à Direita para Operações INSERT e Recuperações

#### A Unidade para Comparação e Ordenação

Strings binárias são sequências de bytes. Para a collation `binary`, a comparação e a ordenação são baseadas em valores numéricos de byte. Strings não binárias são sequências de caracteres, que podem ser multibyte. As collations para strings não binárias definem uma ordenação dos valores de caracteres para comparação e ordenação. Para as collations `_bin`, essa ordenação é baseada em valores numéricos de código de caractere, o que é semelhante à ordenação para strings binárias, exceto que os valores de código de caractere podem ser multibyte.

#### Conversão de Conjunto de Caracteres

Uma string não binária tem um conjunto de caracteres e é automaticamente convertida para outro conjunto de caracteres em muitos casos, mesmo quando a string tem uma collation `_bin`:

* Ao atribuir valores de coluna a outra coluna que possui um conjunto de caracteres diferente:

  ```sql
  UPDATE t1 SET utf8_bin_column=latin1_column;
  INSERT INTO t1 (latin1_column) SELECT utf8_bin_column FROM t2;
  ```

* Ao atribuir valores de coluna para `INSERT` ou `UPDATE` usando um literal de string:

  ```sql
  SET NAMES latin1;
  INSERT INTO t1 (utf8_bin_column) VALUES ('string-in-latin1');
  ```

* Ao enviar resultados do servidor para um cliente:

  ```sql
  SET NAMES latin1;
  SELECT utf8_bin_column FROM t2;
  ```

Para colunas de string binária, nenhuma conversão ocorre. Para casos semelhantes aos anteriores, o valor da string é copiado byte a byte (`byte-wise`).

#### Conversão de Caixa

As collations para conjuntos de caracteres não binários fornecem informações sobre a caixa dos caracteres (maiúsculas/minúsculas), de modo que os caracteres em uma string não binária podem ser convertidos de uma caixa para outra, mesmo para collations `_bin` que ignoram a caixa para fins de ordenação:

```sql
mysql> SET NAMES utf8mb4 COLLATE utf8mb4_bin;
mysql> SELECT LOWER('aA'), UPPER('zZ');
+-------------+-------------+
| LOWER('aA') | UPPER('zZ') |
+-------------+-------------+
| aa          | ZZ          |
+-------------+-------------+
```

O conceito de caixa (maiúsculas/minúsculas) não se aplica a bytes em uma string binária. Para realizar a conversão de caixa, a string deve primeiro ser convertida para uma string não binária usando um conjunto de caracteres apropriado para os dados armazenados na string:

```sql
mysql> SET NAMES binary;
mysql> SELECT LOWER('aA'), LOWER(CONVERT('aA' USING utf8mb4));
+-------------+------------------------------------+
| LOWER('aA') | LOWER(CONVERT('aA' USING utf8mb4)) |
+-------------+------------------------------------+
| aA          | aa                                 |
+-------------+------------------------------------+
```

#### Tratamento de Espaços à Direita em Comparações

Strings não binárias têm comportamento `PAD SPACE` para todas as collations, incluindo collations `_bin`. Espaços à direita (trailing spaces) são insignificantes nas comparações:

```sql
mysql> SET NAMES utf8 COLLATE utf8_bin;
mysql> SELECT 'a ' = 'a';
+------------+
| 'a ' = 'a' |
+------------+
|          1 |
+------------+
```

Para strings binárias, todos os bytes são significantes nas comparações, incluindo espaços à direita:

```sql
mysql> SET NAMES binary;
mysql> SELECT 'a ' = 'a';
+------------+
| 'a ' = 'a' |
+------------+
|          0 |
+------------+
```

#### Tratamento de Espaços à Direita para Operações INSERT e Recuperações

Colunas `CHAR(N)` armazenam strings não binárias com *`N`* caracteres de comprimento. Para operações INSERT, valores mais curtos do que *`N`* caracteres são estendidos com espaços. Para recuperações, os espaços à direita são removidos.

Colunas `BINARY(N)` armazenam strings binárias com *`N`* bytes de comprimento. Para operações INSERT, valores mais curtos do que *`N`* bytes são estendidos com bytes `0x00`. Para recuperações, nada é removido; um valor com o comprimento declarado é sempre retornado.

```sql
mysql> CREATE TABLE t1 (
         a CHAR(10) CHARACTER SET utf8 COLLATE utf8_bin,
         b BINARY(10)
       );
mysql> INSERT INTO t1 VALUES ('x','x');
mysql> INSERT INTO t1 VALUES ('x ','x ');
mysql> SELECT a, b, HEX(a), HEX(b) FROM t1;
+------+------------+--------+----------------------+
| a    | b          | HEX(a) | HEX(b)               |
+------+------------+--------+----------------------+
| x    | x          | 78     | 78000000000000000000 |
| x    | x          | 78     | 78200000000000000000 |
+------+------------+--------+----------------------+
```