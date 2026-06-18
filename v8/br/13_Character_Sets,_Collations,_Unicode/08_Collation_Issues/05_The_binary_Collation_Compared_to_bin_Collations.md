### 12.8.5 A Colagem Binária Comparada às Colagens \_bin

Esta seção descreve como a ordenação `binary` para strings binárias é comparada às ordenações `_bin` para strings não binárias.

As cadeias binárias (como armazenadas usando os tipos de dados `BINARY`, `VARBINARY` e `BLOB`) têm um conjunto de caracteres e uma ordenação nomeados `binary`. As cadeias binárias são sequências de bytes e os valores numéricos desses bytes determinam a ordem de comparação e ordenação. Veja a Seção 12.10.8, “O Conjunto de Caracteres Binário”.

As cadeias não binárias (armazenadas usando os tipos de dados `CHAR`, `VARCHAR` e `TEXT`) têm um conjunto de caracteres e uma ordenação diferentes dos `binary`. Um conjunto de caracteres não binário pode ter várias ordenações, cada uma das quais define uma comparação e uma ordem de ordenação específicas para os caracteres do conjunto. Para a maioria dos conjuntos de caracteres, uma dessas ordenações é a ordenação binária, indicada por um sufixo `_bin` no nome da ordenação. Por exemplo, as ordenações binárias para `latin1` e `big5` são nomeadas `latin1_bin` e `big5_bin`, respectivamente. `utf8mb4` é uma exceção que tem duas ordenações binárias, `utf8mb4_bin` e `utf8mb4_0900_bin`; veja a Seção 12.10.1, “Conjunto de Caracteres Unicode”.

A ordenação `binary` difere das ordenações `_bin` em vários aspectos, discutidos nas seções a seguir:

- Unidade de Comparação e Ordenação
- Conversão do Conjunto de Caracteres
- Conversão de Lettercase
- Tratamento de Espaço em Retração em Comparativos
- Tratamento de espaço em marcha para inserções e recuperações

#### Unidade de Comparação e Ordenação

As cadeias binárias são sequências de bytes. Para a cotação `binary`, a comparação e ordenação são baseadas em valores numéricos de bytes. As cadeias não binárias são sequências de caracteres, que podem ser multibytes. As cotações para cadeias não binárias definem uma ordem dos valores de caracteres para comparação e ordenação. Para as cotações `_bin`, essa ordem é baseada em valores numéricos de código de caracteres, o que é semelhante à ordem para cadeias binárias, exceto que os valores de código de caracteres podem ser multibytes.

#### Conversão do Conjunto de Caracteres

Uma cadeia não binária tem um conjunto de caracteres e é automaticamente convertida para outro conjunto de caracteres em muitos casos, mesmo quando a cadeia possui uma collation `_bin`:

- Ao atribuir valores de coluna a outra coluna que tem um conjunto de caracteres diferente:

  ```
  UPDATE t1 SET utf8mb4_bin_column=latin1_column;
  INSERT INTO t1 (latin1_column) SELECT utf8mb4_bin_column FROM t2;
  ```

- Ao atribuir valores de coluna para `INSERT` ou `UPDATE` usando uma literal de string:

  ```
  SET NAMES latin1;
  INSERT INTO t1 (utf8mb4_bin_column) VALUES ('string-in-latin1');
  ```

- Ao enviar resultados do servidor para um cliente:

  ```
  SET NAMES latin1;
  SELECT utf8mb4_bin_column FROM t2;
  ```

Para colunas de strings binárias, não ocorre conversão. Para casos semelhantes aos anteriores, o valor da string é copiado caracter a caractere.

#### Conversão de Lettercase

As collation para conjuntos de caracteres não binários fornecem informações sobre o caso das letras dos caracteres, para que os caracteres em uma string não binária possam ser convertidos de um caso de letras para outro, mesmo para `_bin` collation que ignora o caso das letras para a ordenação:

```
mysql> SET NAMES utf8mb4 COLLATE utf8mb4_bin;
mysql> SELECT LOWER('aA'), UPPER('zZ');
+-------------+-------------+
| LOWER('aA') | UPPER('zZ') |
+-------------+-------------+
| aa          | ZZ          |
+-------------+-------------+
```

O conceito de maiúsculas e minúsculas não se aplica a bytes em uma string binária. Para realizar a conversão de maiúsculas e minúsculas, a string deve ser convertida primeiro para uma string não binária usando um conjunto de caracteres apropriado para os dados armazenados na string:

```
mysql> SET NAMES binary;
mysql> SELECT LOWER('aA'), LOWER(CONVERT('aA' USING utf8mb4));
+-------------+------------------------------------+
| LOWER('aA') | LOWER(CONVERT('aA' USING utf8mb4)) |
+-------------+------------------------------------+
| aA          | aa                                 |
+-------------+------------------------------------+
```

#### Tratamento de Espaço em Retração em Comparativos

As colorações do MySQL têm um atributo pad, que tem o valor `PAD SPACE` ou `NO PAD`:

- A maioria das colalções do MySQL tem um atributo pad `PAD SPACE`.

- As colorações Unicode baseadas na UCA 9.0.0 e superior têm um atributo de alinhamento `NO PAD`; veja a Seção 12.10.1, “Conjunto de Caracteres Unicode”.

Para cadeias não binárias (os valores `CHAR`, `VARCHAR` e `TEXT`), o atributo pad de ordenação de cadeia determina o tratamento em comparações de espaços finais nas extremidades das cadeias:

- Para as codificações `PAD SPACE`, os espaços em branco finais são irrelevantes em comparações; as cadeias são comparadas sem considerar os espaços em branco finais.

- As `NO PAD` colatações tratam espaços em branco finais como significativos em comparações, como qualquer outro caractere.

Os comportamentos diferentes podem ser demonstrados usando as duas colatações binárias `utf8mb4` — uma delas é `PAD SPACE` e a outra é `NO PAD`. O exemplo também mostra como usar a tabela `INFORMATION_SCHEMA` `COLLATIONS` para determinar o atributo pad para colatações.

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

“Comparação” neste contexto não inclui o operador de correspondência de padrões `LIKE`, para o qual espaços finais são significativos, independentemente da ordenação.

Para strings binárias (valores `BINARY`, `VARBINARY` e `BLOB`), todos os bytes são significativos em comparações, incluindo espaços em branco finais:

```
mysql> SET NAMES binary;
mysql> SELECT 'a ' = 'a';
+------------+
| 'a ' = 'a' |
+------------+
|          0 |
+------------+
```

#### Tratamento de espaço em marcha para inserções e recuperações

As colunas `CHAR(N)` armazenam cadeias de caracteres não binários com `N` caracteres. Para inserções, os valores mais curtos que `N` caracteres são estendidos com espaços. Para recuperações, os espaços finais são removidos.

As colunas `BINARY(N)` armazenam cadeias binárias de `N` bytes de comprimento. Para inserções, os valores mais curtos que `N` bytes são estendidos com `0x00` bytes. Para recuperações, nada é removido; um valor do comprimento declarado é sempre retornado.

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
