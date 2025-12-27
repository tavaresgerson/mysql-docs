### 12.8.5 A Cotação Binária Comparada às Cotações \_bin

Esta seção descreve como a cotação `binary` para strings binárias compara-se com as cotações `_bin` para strings não binárias.

As strings binárias (armazenadas usando os tipos de dados `BINARY`, `VARBINARY` e `BLOB`) têm um conjunto de caracteres e uma cotação nomeada `binary`. As strings binárias são sequências de bytes e os valores numéricos desses bytes determinam a ordem de comparação e ordenação. Veja a Seção 12.10.8, “O Conjunto de Caracteres Binário”.

As strings não binárias (armazenadas usando os tipos de dados `CHAR`, `VARCHAR` e `TEXT`) têm um conjunto de caracteres e uma cotação diferente de `binary`. Um determinado conjunto de caracteres não binário pode ter várias cotações, cada uma das quais define uma comparação e ordem de ordenação particulares para os caracteres do conjunto. Para a maioria dos conjuntos de caracteres, uma delas é a cotação binária, indicada por um sufixo `_bin` no nome da cotação. Por exemplo, as cotações binárias para `latin1` e `big5` são nomeadas `latin1_bin` e `big5_bin`, respectivamente. `utf8mb4` é uma exceção que tem duas cotações binárias, `utf8mb4_bin` e `utf8mb4_0900_bin`; veja a Seção 12.10.1, “Conjunto de Caracteres Unicode”.

A cotação `binary` difere das cotações `_bin` em vários aspectos, discutidos nas seções seguintes:

* A Unidade para Comparação e Ordenação
* Conversão de Conjunto de Caracteres
* Conversão de Letra
* Tratamento de Espaço Final em Comparativos
* Tratamento de Espaço Final para Inserções e Recuperações

#### A Unidade para Comparação e Ordenação
Portuguese (Brazilian):

As cadeias binárias são sequências de bytes. Para a ponderação `binary`, a comparação e ordenação são baseadas em valores numéricos de bytes. As cadeias não binárias são sequências de caracteres, que podem ser multibytes. As ponderações para cadeias não binárias definem uma ordem dos valores de caracteres para comparação e ordenação. Para ponderações `_bin`, essa ordem é baseada em valores numéricos de códigos de caracteres, o que é semelhante à ordem para cadeias binárias, exceto que os valores de código de caracteres podem ser multibytes.

#### Conversão de Conjunto de Caracteres

Uma cadeia não binária tem um conjunto de caracteres e é automaticamente convertida para outro conjunto de caracteres em muitos casos, mesmo quando a cadeia tem uma ponderação `_bin`:

* Ao atribuir valores de coluna a outra coluna que tem um conjunto de caracteres diferente:

  ```
  UPDATE t1 SET utf8mb4_bin_column=latin1_column;
  INSERT INTO t1 (latin1_column) SELECT utf8mb4_bin_column FROM t2;
  ```

* Ao atribuir valores de coluna para `INSERT` ou `UPDATE` usando uma literal de string:

  ```
  SET NAMES latin1;
  INSERT INTO t1 (utf8mb4_bin_column) VALUES ('string-in-latin1');
  ```

* Ao enviar resultados do servidor para um cliente:

  ```
  SET NAMES latin1;
  SELECT utf8mb4_bin_column FROM t2;
  ```

Para colunas de cadeias binárias, nenhuma conversão ocorre. Para casos semelhantes aos anteriores, o valor da string é copiado byte a byte.

#### Conversão de Letra

As ponderações para conjuntos de caracteres não binários fornecem informações sobre a letra da cadeia de caracteres, então os caracteres em uma cadeia não binária podem ser convertidos de uma letra para outra, mesmo para ponderações `_bin` que ignoram a letra para a ordenação:

```
mysql> SET NAMES utf8mb4 COLLATE utf8mb4_bin;
mysql> SELECT LOWER('aA'), UPPER('zZ');
+-------------+-------------+
| LOWER('aA') | UPPER('zZ') |
+-------------+-------------+
| aa          | ZZ          |
+-------------+-------------+
```

O conceito de letra não se aplica aos bytes em uma cadeia binária. Para realizar a conversão de letra, a string deve ser convertida primeiro para uma cadeia não binária usando um conjunto de caracteres apropriado para os dados armazenados na string:

```
mysql> SET NAMES binary;
mysql> SELECT LOWER('aA'), LOWER(CONVERT('aA' USING utf8mb4));
+-------------+------------------------------------+
| LOWER('aA') | LOWER(CONVERT('aA' USING utf8mb4)) |
+-------------+------------------------------------+
| aA          | aa                                 |
+-------------+------------------------------------+
```

#### Tratamento de Espaço Final em Comparativos

As ponderações do MySQL têm um atributo `pad`, que tem um valor de `PAD SPACE` ou `NO PAD`:

* A maioria das colatações MySQL tem um atributo `PAD SPACE`.

* As colatações Unicode baseadas na UCA 9.0.0 e superior têm um atributo `PAD NO PAD`; veja a Seção 12.10.1, “Conjunto de caracteres Unicode”.

Para strings não binárias (`CHAR`, `VARCHAR` e `TEXT` valores), o atributo de colatação de espaço da string determina o tratamento em comparações de espaços finais:

* Para colatações `PAD SPACE`, os espaços finais são insignificantes em comparações; as strings são comparadas sem considerar os espaços finais.

* As colatações `NO PAD` tratam os espaços finais como significativos em comparações, como qualquer outro caractere.

Os comportamentos diferentes podem ser demonstrados usando as duas colatações binárias `utf8mb4`, uma das quais é `PAD SPACE`, e a outra `NO PAD`. O exemplo também mostra como usar a tabela `INFORMATION_SCHEMA` `COLLATIONS` para determinar o atributo de colatação para colatações.

```
mysql> SELECT COLLATION_NAME, PAD_ATTRIBUTE
       FROM INFORMATION_SCHEMA.COLLATIONS
       WHERE COLLATION_NAME LIKE 'utf8mb4%bin';
+------------------+---------------+
| COLLATION_NAME   | PAD_ATTRIBUTE |
+------------------+---------------+
| utf8mb4_bin      | PAD SPACE     |
| utf8mb4_0900_bin | NO PAD        |
+------------------+---------------+
mysql> SET NAMES utf8mb4 COLLATE utf8mb4_bin;
mysql> SELECT 'a ' = 'a';
+------------+
| 'a ' = 'a' |
+------------+
|          1 |
+------------+
mysql> SET NAMES utf8mb4 COLLATE utf8mb4_0900_bin;
mysql> SELECT 'a ' = 'a';
+------------+
| 'a ' = 'a' |
+------------+
|          0 |
+------------+
```

Nota

“Comparações” neste contexto não incluem o operador de correspondência de padrões `LIKE`, para o qual os espaços finais são significativos, independentemente da colatação.

Para strings binárias (`BINARY`, `VARBINARY` e `BLOB` valores), todos os bytes são significativos em comparações, incluindo os espaços finais:

```
mysql> SET NAMES binary;
mysql> SELECT 'a ' = 'a';
+------------+
| 'a ' = 'a' |
+------------+
|          0 |
+------------+
```

#### Tratamento de Espaços Finais para Inserções e Recuperações

Colunas `CHAR(N)` armazenam strings não binárias de *`N`* caracteres. Para inserções, valores mais curtos que *`N`* caracteres são estendidos com espaços. Para recuperações, os espaços finais são removidos.

Colunas `BINARY(N)` armazenam strings binárias de *`N`* bytes. Para inserções, valores mais curtos que *`N`* bytes são estendidos com `0x00` bytes. Para recuperações, nada é removido; um valor do comprimento declarado é sempre retornado.

```
mysql> CREATE TABLE t1 (
         a CHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
         b BINARY(10)
       );
mysql> INSERT INTO t1 VALUES ('x','x');
mysql> INSERT INTO t1 VALUES ('x ','x ');
mysql> SELECT a, b, HEX(a), HEX(b) FROM t1;
+------+------------------------+--------+----------------------+
| a    | b                      | HEX(a) | HEX(b)               |
+------+------------------------+--------+----------------------+
| x    | 0x78000000000000000000 | 78     | 78000000000000000000 |
| x    | 0x78200000000000000000 | 78     | 78200000000000000000 |
+------+------------------------+--------+----------------------+
```