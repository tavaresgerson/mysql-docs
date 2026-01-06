### 10.8.5 A Colagem Binária Comparada às Colagens \_bin

Esta seção descreve como a ordenação `binary` para strings binárias é comparada às ordenações `_bin` para strings não binárias.

As cadeias binárias (como armazenadas usando os tipos de dados `BINARY`, `VARBINARY` e `BLOB`) têm um conjunto de caracteres e uma ordenação nomeados `binary`. As cadeias binárias são sequências de bytes e os valores numéricos desses bytes determinam a ordem de comparação e ordenação. Veja a Seção 10.10.8, “O Conjunto de Caracteres Binário”.

As cadeias não binárias (como armazenadas usando os tipos de dados `CHAR`, `VARCHAR` e `TEXT`) têm um conjunto de caracteres e uma ordenação diferente do `binary`. Um conjunto de caracteres não binário pode ter várias ordenações, cada uma das quais define uma comparação e ordem de ordenação específicas para os caracteres do conjunto. Uma delas é a ordenação binária, indicada pelo sufixo `_bin` no nome da ordenação. Por exemplo, a ordenação binária para `utf8` e `latin1` é chamada `utf8_bin` e `latin1_bin`, respectivamente.

A ordenação `binary` difere das ordenações `_bin` em vários aspectos, discutidos nas seções a seguir:

- Unidade de Comparação e Ordenação
- Conversão do Conjunto de Caracteres
- Conversão de Lettercase
- Tratamento de Espaço em Retração em Comparativos
- Tratamento de espaço em marcha para inserções e recuperações

#### Unidade de Comparação e Ordenação

As cadeias binárias são sequências de bytes. Para a classificação `binary`, a comparação e ordenação são baseadas em valores numéricos de bytes. As cadeias não binárias são sequências de caracteres, que podem ser multibytes. As classificações para cadeias não binárias definem uma ordem dos valores de caracteres para comparação e ordenação. Para as classificações `_bin`, essa ordem é baseada em valores numéricos de código de caracteres, o que é semelhante à ordem para cadeias binárias, exceto que os valores de código de caracteres podem ser multibytes.

#### Conversão do Conjunto de Caracteres

Uma cadeia não binária tem um conjunto de caracteres e é automaticamente convertida para outro conjunto de caracteres em muitos casos, mesmo quando a cadeia possui uma classificação `_bin`:

- Ao atribuir valores de coluna a outra coluna que tem um conjunto de caracteres diferente:

  ```sql
  UPDATE t1 SET utf8_bin_column=latin1_column;
  INSERT INTO t1 (latin1_column) SELECT utf8_bin_column FROM t2;
  ```

- Ao atribuir valores de coluna para `INSERT` ou `UPDATE` usando uma literal de string:

  ```sql
  SET NAMES latin1;
  INSERT INTO t1 (utf8_bin_column) VALUES ('string-in-latin1');
  ```

- Ao enviar resultados do servidor para um cliente:

  ```sql
  SET NAMES latin1;
  SELECT utf8_bin_column FROM t2;
  ```

Para colunas de strings binárias, não ocorre conversão. Para casos semelhantes aos anteriores, o valor da string é copiado caracter a caractere.

#### Conversão de Lettercase

As collation para conjuntos de caracteres não binários fornecem informações sobre o caso das letras dos caracteres, para que os caracteres em uma string não binária possam ser convertidos de um caso de letra para outro, mesmo para collationes `_bin` que ignoram o caso das letras para a ordenação:

```sql
mysql> SET NAMES utf8mb4 COLLATE utf8mb4_bin;
mysql> SELECT LOWER('aA'), UPPER('zZ');
+-------------+-------------+
| LOWER('aA') | UPPER('zZ') |
+-------------+-------------+
| aa          | ZZ          |
+-------------+-------------+
```

O conceito de maiúsculas e minúsculas não se aplica a bytes em uma string binária. Para realizar a conversão de maiúsculas e minúsculas, a string deve ser convertida primeiro para uma string não binária usando um conjunto de caracteres apropriado para os dados armazenados na string:

```sql
mysql> SET NAMES binary;
mysql> SELECT LOWER('aA'), LOWER(CONVERT('aA' USING utf8mb4));
+-------------+------------------------------------+
| LOWER('aA') | LOWER(CONVERT('aA' USING utf8mb4)) |
+-------------+------------------------------------+
| aA          | aa                                 |
+-------------+------------------------------------+
```

#### Tratamento de Espaço em Retração em Comparativos

As cadeias não binárias têm comportamento de `PAD SPACE` para todas as codificações, incluindo as codificações `_bin`. Espaços finais são irrelevantes em comparações:

```sql
mysql> SET NAMES utf8 COLLATE utf8_bin;
mysql> SELECT 'a ' = 'a';
+------------+
| 'a ' = 'a' |
+------------+
|          1 |
+------------+
```

Para strings binárias, todos os bytes são significativos em comparações, incluindo espaços em branco finais:

```sql
mysql> SET NAMES binary;
mysql> SELECT 'a ' = 'a';
+------------+
| 'a ' = 'a' |
+------------+
|          0 |
+------------+
```

#### Tratamento de espaço em marcha para inserções e recuperações

As colunas `CHAR(N)` armazenam cadeias não binárias de *`N`* caracteres. Para inserções, os valores mais curtos que *`N`* caracteres são estendidos com espaços. Para recuperações, os espaços finais são removidos.

As colunas `BINARY(N)` armazenam cadeias binárias de *`N`* bytes de comprimento. Para inserções, os valores mais curtos que *`N`* bytes são estendidos com bytes `0x00`. Para recuperações, nada é removido; um valor do comprimento declarado é sempre retornado.

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
