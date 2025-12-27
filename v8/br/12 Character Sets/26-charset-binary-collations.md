### 12.8.5 A Colagem Binária em Relação às Colagens `_bin`

Esta seção descreve como a colagem `binary` para strings binárias se compara às colagens `_bin` para strings não binárias.

As strings binárias (armazenadas usando os tipos de dados `BINARY`, `VARBINARY` e `BLOB`) têm um conjunto de caracteres e uma colagem nomeada `binary`. As strings binárias são sequências de bytes, e os valores numéricos desses bytes determinam a ordem de comparação e ordenação. Consulte a Seção 12.10.8, “O Conjunto de Caracteres Binário”.

As strings não binárias (armazenadas usando os tipos de dados `CHAR`, `VARCHAR` e `TEXT`) têm um conjunto de caracteres e uma colagem diferente de `binary`. Um determinado conjunto de caracteres não binário pode ter várias colagens, cada uma das quais define uma comparação e ordem de ordenação específicas para os caracteres do conjunto. Para a maioria dos conjuntos de caracteres, uma dessas é a colagem binária, indicada por um sufixo `_bin` no nome da colagem. Por exemplo, as colagens binárias para `latin1` e `big5` são nomeadas `latin1_bin` e `big5_bin`, respectivamente. `utf8mb4` é uma exceção que tem duas colagens binárias, `utf8mb4_bin` e `utf8mb4_0900_bin`; consulte a Seção 12.10.1, “Conjunto de Caracteres Unicode”.

A colagem `binary` difere das colagens `_bin` em vários aspectos, discutidos nas seções seguintes:

*  Unidade para Comparação e Ordenação
*  Conversão de Conjunto de Caracteres
*  Conversão de Maiúsculas e Minúsculas
*  Tratamento de Espaço Final em Comparativos
*  Tratamento de Espaço Final para Inserções e Recuperações

#### A Unidade para Comparação e Ordenação

As strings binárias são sequências de bytes. Para a colagem `binary`, a comparação e ordenação são baseadas em valores numéricos de bytes. As strings não binárias são sequências de caracteres, que podem ser multibytes. As colagens para strings não binárias definem uma ordem dos valores de caracteres para comparação e ordenação. Para as colagens `_bin`, essa ordem é baseada em valores numéricos de código de caracteres, o que é semelhante à ordem para strings binárias, exceto que os valores de código de caracteres podem ser multibytes.

#### Conversão de Conjunto de Caracteres
English:
Portuguese (Brazil):

Uma cadeia não binária tem um conjunto de caracteres e é automaticamente convertida para outro conjunto de caracteres na maioria dos casos, mesmo quando a cadeia tem uma ordenação `_bin`:

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

Para colunas de strings binárias, não ocorre conversão. Para casos semelhantes aos anteriores, o valor da string é copiado caractere por caractere.

#### Conversão de Maiúsculas e Minúsculas

As ordenações para conjuntos de caracteres não binários fornecem informações sobre a maiúscula e minúscula dos caracteres, então caracteres em uma string não binária podem ser convertidos de uma maiúscula para outra, mesmo para ordenações `_bin` que ignoram a maiúscula e minúscula para a ordenação:

```
mysql> SET NAMES utf8mb4 COLLATE utf8mb4_bin;
mysql> SELECT LOWER('aA'), UPPER('zZ');
+-------------+-------------+
| LOWER('aA') | UPPER('zZ') |
+-------------+-------------+
| aa          | ZZ          |
+-------------+-------------+
```

O conceito de maiúscula e minúscula não se aplica aos bytes em uma string binária. Para realizar a conversão de maiúscula e minúscula, a string deve ser convertida primeiro para uma string não binária usando um conjunto de caracteres apropriado para os dados armazenados na string:

```
mysql> SET NAMES binary;
mysql> SELECT LOWER('aA'), LOWER(CONVERT('aA' USING utf8mb4));
+-------------+------------------------------------+
| LOWER('aA') | LOWER(CONVERT('aA' USING utf8mb4)) |
+-------------+------------------------------------+
| aA          | aa                                 |
+-------------+------------------------------------+
```

#### Tratamento de Espaço Final em Comparações

As ordenações do MySQL têm um atributo de alinhamento, que tem um valor de `PAD SPACE` ou `NO PAD`:

* A maioria das ordenações do MySQL tem um atributo de alinhamento de `PAD SPACE`.
* As ordenações Unicode baseadas na UCA 9.0.0 e superiores têm um atributo de alinhamento de `NO PAD`; veja a Seção 12.10.1, “Conjunto de Caracteres Unicode”.

Para cadeias não binárias (`CHAR`, `VARCHAR` e valores `TEXT`), o atributo de alinhamento de padronização da cadeia determina o tratamento em comparações de espaços finais no final das strings:

* Para ordenações `PAD SPACE`, espaços finais são insignificantes em comparações; as strings são comparadas sem considerar os espaços finais.
* Ordenações `NO PAD` tratam espaços finais como significativos em comparações, como qualquer outro caractere.

Os comportamentos diferentes podem ser demonstrados usando as duas colorações binárias `utf8mb4`, uma das quais é `PAD SPACE`, e a outra `NO PAD`. O exemplo também mostra como usar a tabela `INFORMATION_SCHEMA` `COLLATIONS` para determinar o atributo `pad` para as colorações.

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

::: info Nota

"Comparação" neste contexto não inclui o operador de correspondência de padrões `LIKE`, para o qual espaços finais são significativos, independentemente da coloração.


:::

Para strings binárias (`BINARY`, `VARBINARY` e valores `BLOB`), todos os bytes são significativos em comparações, incluindo espaços finais:

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

Colunas `CHAR(N)` armazenam strings não binárias de *`N`* caracteres de comprimento. Para inserções, valores menores que *`N`* caracteres são estendidos com espaços. Para recuperações, espaços finais são removidos.

Colunas `BINARY(N)` armazenam strings binárias de *`N`* bytes de comprimento. Para inserções, valores menores que *`N`* bytes são estendidos com `0x00` bytes. Para recuperações, nada é removido; um valor do comprimento declarado é sempre retornado.

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