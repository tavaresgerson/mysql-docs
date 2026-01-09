## Funções e Operadores de Bits

**Tabela 14.17 Funções e Operadores de Bits**

<table frame="box" rules="all" summary="Uma referência que lista funções e operadores de bits.">
<col style="width: 28%"/><col style="width: 71%"/>
<thead><tr><th>Nome</th> <th>Descrição</th> </tr></thead><tbody><tr><td><a class="link" href="bit-functions.html#operator_bitwise-and"><code>&amp;</code></a></td> <td> E bit a bit </td> </tr><tr><td><a class="link" href="bit-functions.html#operator_right-shift"><code>&gt;&gt;</code></a></td> <td> Deslocamento à direita </td> </tr><tr><td><a class="link" href="bit-functions.html#operator_left-shift"><code>&lt;&lt;</code></a></td> <td> Deslocamento à esquerda </td> </tr><tr><td><a class="link" href="bit-functions.html#operator_bitwise-xor"><code>^</code></a></td> <td> XOR bit a bit </td> </tr><tr><td><a class="link" href="bit-functions.html#function_bit-count"><code>BIT_COUNT()</code></a></td> <td> Retorna o número de bits definidos </td> </tr><tr><td><a class="link" href="bit-functions.html#operator_bitwise-or"><code>|</code></a></td> <td> OU bit a bit </td> </tr><tr><td><a class="link" href="bit-functions.html#operator_bitwise-invert"><code>~</code></a></td> <td> Inversão bit a bit </td> </tr></tbody></table>

A lista a seguir descreve as funções e operadores de bits disponíveis:

* `|`

  OU bit a bit.

  O tipo de resultado depende se os argumentos são avaliados como strings binárias ou números:

  + Avaliação de string binária ocorre quando os argumentos têm um tipo de string binária e pelo menos um deles não é um literal hexadecimal, literal de bit ou literal `NULL`. A avaliação numérica ocorre de outra forma, com a conversão dos argumentos em inteiros de 64 bits não negativos conforme necessário.

A avaliação de cadeias binárias produz uma cadeia binária com o mesmo comprimento dos argumentos. Se os argumentos tiverem comprimentos diferentes, ocorre um erro `ER_INVALID_BITWISE_OPERANDS_SIZE`. A avaliação numérica produz um inteiro de 64 bits não assinado.

Para mais informações, consulte a discussão introdutória nesta seção.

```
  mysql> SELECT 29 | 15;
          -> 31
  mysql> SELECT _binary X'40404040' | X'01020304';
          -> 'ABCD'
  ```

Se a operação de EOR for invocada dentro do cliente **mysql**, os resultados das cadeias binárias são exibidos usando notação hexadecimal, dependendo do valor da opção `--binary-as-hex`. Para mais informações sobre essa opção, consulte a Seção 6.5.1, “mysql — O Cliente de Linha de Comando do MySQL”.

* `&`

  E lógico.

  O tipo de resultado depende se os argumentos são avaliados como cadeias binárias ou números:

  + A avaliação de cadeias binárias ocorre quando os argumentos têm um tipo de cadeia binária e pelo menos um deles não é um literal hexadecimal, literal de bit ou literal `NULL`. A avaliação numérica ocorre de outra forma, com a conversão dos argumentos em inteiros de 64 bits não assinados, conforme necessário.

  + A avaliação de cadeias binárias produz uma cadeia binária com o mesmo comprimento dos argumentos. Se os argumentos tiverem comprimentos diferentes, ocorre um erro `ER_INVALID_BITWISE_OPERANDS_SIZE`. A avaliação numérica produz um inteiro de 64 bits não assinado.

  Para mais informações, consulte a discussão introdutória nesta seção.

```
  mysql> SELECT 29 & 15;
          -> 13
  mysql> SELECT HEX(_binary X'FF' & b'11110000');
          -> 'F0'
  ```

Se a operação de EOR for invocada dentro do cliente **mysql**, os resultados das cadeias binárias são exibidos usando notação hexadecimal, dependendo do valor da opção `--binary-as-hex`. Para mais informações sobre essa opção, consulte a Seção 6.5.1, “mysql — O Cliente de Linha de Comando do MySQL”.

* `^`

  XOR lógico.

  O tipo de resultado depende se os argumentos são avaliados como cadeias binárias ou números:

+ A avaliação de strings binárias ocorre quando os argumentos têm um tipo de string binária e pelo menos um deles não é um literal hexadecimal, literal de bit ou literal `NULL`. A avaliação numérica ocorre de outra forma, com a conversão dos argumentos em inteiros de 64 bits não signatários, conforme necessário.

+ A avaliação de strings binárias produz uma string binária da mesma extensão que os argumentos. Se os argumentos tiverem extensões desiguais, ocorre um erro `ER_INVALID_BITWISE_OPERANDS_SIZE`. A avaliação numérica produz um inteiro de 64 bits não signatário.

Para mais informações, consulte a discussão introdutória nesta seção.

```
  mysql> SELECT 1 ^ 1;
          -> 0
  mysql> SELECT 1 ^ 0;
          -> 1
  mysql> SELECT 11 ^ 3;
          -> 8
  mysql> SELECT HEX(_binary X'FEDC' ^ X'1111');
          -> 'EFCD'
  ```

+ Se o XOR bit a bit for invocado dentro do cliente **mysql**, os resultados das strings binárias são exibidos usando a notação hexadecimal, dependendo do valor da opção `--binary-as-hex`. Para mais informações sobre essa opção, consulte a Seção 6.5.1, “mysql — O Cliente de Linha de Comando do MySQL”.

* `<<`

+ Desloca um número longlong (`BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT")) ou string binária para a esquerda.

+ O tipo de resultado depende se o argumento de bit é avaliado como uma string binária ou um número:

+ A avaliação de strings binárias ocorre quando o argumento de bit tem um tipo de string binária e não é um literal hexadecimal, literal de bit ou literal `NULL`. A avaliação numérica ocorre de outra forma, com a conversão dos argumentos em um inteiro de 64 bits não signatário, conforme necessário.

+ A avaliação de strings binárias produz uma string binária da mesma extensão que o argumento de bit. A avaliação numérica produz um inteiro de 64 bits não signatário.

+ Bits deslocados do final do valor são perdidos sem aviso, independentemente do tipo de argumento. Em particular, se o número de deslocamentos for maior ou igual ao número de bits no argumento de bit, todos os bits no resultado são 0.

Para obter mais informações, consulte a discussão introdutória nesta seção.

```
  mysql> SELECT 1 << 2;
          -> 4
  mysql> SELECT HEX(_binary X'00FF00FF00FF' << 8);
          -> 'FF00FF00FF00'
  ```

Se uma operação de deslocamento de bits for invocada dentro do cliente **mysql**, os resultados das strings binárias são exibidos usando notação hexadecimal, dependendo do valor da opção `--binary-as-hex`. Para obter mais informações sobre essa opção, consulte a Seção 6.5.1, “mysql — O Cliente de Linha de Comando do MySQL”.

* `>>`

  Desloca um número longlong (`BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT")) ou uma string binária para a direita.

  O tipo de resultado depende se o argumento de bit é avaliado como uma string binária ou um número:

  + A avaliação de string binária ocorre quando o argumento de bit tem um tipo de string binária e não é um literal hexadecimal, literal de bit ou literal `NULL`. A avaliação numérica ocorre de outra forma, com conversão do argumento para um inteiro de 64 bits não signatário, conforme necessário.

  + A avaliação de string binária produz uma string binária do mesmo comprimento que o argumento de bit. A avaliação numérica produz um inteiro de 64 bits não signatário.

  Bits deslocados do final do valor são perdidos sem aviso, independentemente do tipo do argumento. Em particular, se o número de bits a ser deslocado for maior ou igual ao número de bits no argumento de bit, todos os bits no resultado são 0.

  Para obter mais informações, consulte a discussão introdutória nesta seção.

```
  mysql> SELECT 4 >> 2;
          -> 1
  mysql> SELECT HEX(_binary X'00FF00FF00FF' >> 8);
          -> '0000FF00FF00'
  ```

Se uma operação de deslocamento de bits for invocada dentro do cliente **mysql**, os resultados das strings binárias são exibidos usando notação hexadecimal, dependendo do valor da opção `--binary-as-hex`. Para obter mais informações sobre essa opção, consulte a Seção 6.5.1, “mysql — O Cliente de Linha de Comando do MySQL”.

* `~`

  Inverte todos os bits.

  O tipo de resultado depende se o argumento de bit é avaliado como uma string binária ou um número:

+ A avaliação de strings binárias ocorre quando o argumento bit tem um tipo de string binária e não é um literal hexadecimal, literal de bit ou literal `NULL`. A avaliação numérica ocorre de outra forma, com a conversão do argumento para um inteiro de 64 bits não assinado, conforme necessário.

+ A avaliação de strings binárias produz uma string binária da mesma extensão que o argumento bit. A avaliação numérica produz um inteiro de 64 bits não assinado.

Para mais informações, consulte a discussão introdutória nesta seção.

```
  mysql> SELECT 5 & ~1;
          -> 4
  mysql> SELECT HEX(~X'0000FFFF1111EEEE');
          -> 'FFFF0000EEEE1111'
  ```

Se a inversão bit a bit for invocada dentro do cliente **mysql**, os resultados das strings binárias são exibidos usando notação hexadecimal, dependendo do valor da opção `--binary-as-hex`. Para mais informações sobre essa opção, consulte a Seção 6.5.1, “mysql — O Cliente de Linha de Comando do MySQL”.

* `BIT_COUNT(N)`

Retorna o número de bits definidos no argumento *`N`* como um inteiro de 64 bits não assinado, ou `NULL` se o argumento for `NULL`.

```
  mysql> SELECT BIT_COUNT(64), BIT_COUNT(BINARY 64);
          -> 1, 7
  mysql> SELECT BIT_COUNT('64'), BIT_COUNT(_binary '64');
          -> 1, 7
  mysql> SELECT BIT_COUNT(X'40'), BIT_COUNT(_binary X'40');
          -> 1, 1
  ```

As funções e operadores de bit incluem `BIT_COUNT()`, `BIT_AND()`, `BIT_OR()`, `BIT_XOR()`, `&`, `|`, `^`, `~`, `<<` e `>>`. (As funções agregadas `BIT_AND()`, `BIT_OR()` e `BIT_XOR()` são descritas na Seção 14.19.1, “Descrição das Funções Agregadas”).

As funções e operadores de bit permitem argumentos de tipo string binária (`BINARY`, `VARBINARY` e os tipos `BLOB`) e retornam um valor do mesmo tipo. Argumentos de string não binários são convertidos para `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, `BIGINT`).

* Operações com bits
* Exemplos de operações de bits em strings binárias
* Operações de E, OU e XOR com bits
* Operações de complemento e deslocamento com bits
* Operações BIT\_COUNT()
* Operações BIT\_AND(), BIT\_OR() e BIT\_XOR(), BIT_OR() e BIT_XOR()
* Tratamento especial de literais hexadecimais, literais de bits e literais NULL

### Operações com bits

O MySQL 9.5 lida diretamente com argumentos de strings binárias (sem conversão) e produz resultados em strings binárias. Argumentos que não são inteiros ou strings binárias são convertidos em inteiros.

Argumentos que são considerados strings binárias incluem valores de colunas, parâmetros de rotina, variáveis locais e variáveis definidas pelo usuário que têm um tipo de string binária: `BINARY`, `VARBINARY` ou um dos tipos `BLOB`.

Você pode especificar argumentos para operações com bits usando literais hexadecimais ou literais de bits com a intenção de que representem números; o MySQL avalia operações com bits em contexto numérico quando todos os argumentos de bit são hexadecimais ou literais de bits. Para avaliação como strings binárias, use o introduzir `_binary` para pelo menos um dos valores literais.

* Essas operações com bits avaliam os literais hexadecimais e literais de bits como inteiros:

  ```
  mysql> SELECT X'40' | X'01', b'11110001' & b'01001111';
  +---------------+---------------------------+
  | X'40' | X'01' | b'11110001' & b'01001111' |
  +---------------+---------------------------+
  |            65 |                        65 |
  +---------------+---------------------------+
  ```

* Essas operações com bits avaliam os literais hexadecimais e literais de bits como strings binárias, devido ao introduzir `_binary`:

  ```
  mysql> SELECT _binary X'40' | X'01', b'11110001' & _binary b'01001111';
  +-----------------------+-----------------------------------+
  | _binary X'40' | X'01' | b'11110001' & _binary b'01001111' |
  +-----------------------+-----------------------------------+
  | A                     | A                                 |
  +-----------------------+-----------------------------------+
  ```

Embora as operações com bits em ambas as declarações produzam um resultado com um valor numérico de 65, a segunda declaração opera em contexto de strings binárias, para o qual 65 é `A` ASCII.

No contexto de avaliação numérica, os valores permitidos de argumentos literais hexadecimais e literais de bits têm um máximo de 64 bits, assim como os resultados. Em contraste, no contexto de avaliação de strings binárias, os argumentos (e resultados) permitidos podem exceder 64 bits:

```
mysql> SELECT _binary X'4040404040404040' | X'0102030405060708';
+---------------------------------------------------+
| _binary X'4040404040404040' | X'0102030405060708' |
+---------------------------------------------------+
| ABCDEFGH                                          |
+---------------------------------------------------+
```fAGTtaeMZH```
_binary literal
BINARY literal
CAST(literal AS BINARY)
```KmC8rPruys```
mysql> SET @v1 = X'40', @v2 = X'01', @v3 = b'11110001', @v4 = b'01001111';
mysql> SELECT @v1 | @v2, @v3 & @v4;
+-----------+-----------+
| @v1 | @v2 | @v3 & @v4 |
+-----------+-----------+
| A         | A         |
+-----------+-----------+
```93TTmV6lPE```
mysql> SELECT _binary X'40' | X'0001';
ERROR 3513 (HY000): Binary operands of bitwise
operators must be of equal length
```ODnpb5sebu```
mysql> SELECT _binary X'0040' | X'0001';
+---------------------------+
| _binary X'0040' | X'0001' |
+---------------------------+
|  A                        |
+---------------------------+
mysql> SELECT _binary X'40' | X'01';
+-----------------------+
| _binary X'40' | X'01' |
+-----------------------+
| A                     |
+-----------------------+
```lO0MLloj5n```
mysql> SELECT LPAD(X'40', 2, X'00') | X'0001';
+---------------------------------+
| LPAD(X'40', 2, X'00') | X'0001' |
+---------------------------------+
|  A                              |
+---------------------------------+
mysql> SELECT X'40' | SUBSTR(X'0001', 2, 1);
+-------------------------------+
| X'40' | SUBSTR(X'0001', 2, 1) |
+-------------------------------+
| A                             |
+-------------------------------+
```lgE0xoNokx```
mysql> SET @uuid = UUID_TO_BIN('6ccd780c-baba-1026-9564-5b8c656024db');
mysql> SELECT HEX(@uuid);
+----------------------------------+
| HEX(@uuid)                       |
+----------------------------------+
| 6CCD780CBABA102695645B8C656024DB |
+----------------------------------+
```IvW84t2noD```
mysql> SET @ts_mask = CAST(X'FFFFFFFFFFFFFFFF' AS BINARY(16));
mysql> SET @node_mask = CAST(X'FFFFFFFFFFFF' AS BINARY(16)) >> 80;
mysql> SELECT HEX(@ts_mask);
+----------------------------------+
| HEX(@ts_mask)                    |
+----------------------------------+
| FFFFFFFFFFFFFFFF0000000000000000 |
+----------------------------------+
mysql> SELECT HEX(@node_mask);
+----------------------------------+
| HEX(@node_mask)                  |
+----------------------------------+
| 00000000000000000000FFFFFFFFFFFF |
+----------------------------------+
```4uRSOlfIsn```
SET @ts_mask= RPAD(X'FFFFFFFFFFFFFFFF' , 16, X'00');
SET @node_mask = LPAD(X'FFFFFFFFFFFF', 16, X'00') ;
```gMwd7YJwru```
mysql> SELECT HEX(@uuid & @ts_mask) AS 'timestamp part';
+----------------------------------+
| timestamp part                   |
+----------------------------------+
| 6CCD780CBABA10260000000000000000 |
+----------------------------------+
mysql> SELECT HEX(@uuid & @node_mask) AS 'node part';
+----------------------------------+
| node part                        |
+----------------------------------+
| 000000000000000000005B8C656024DB |
+----------------------------------+
```QpUNaAD3ir```
mysql> SET @ip = INET6_ATON('fe80::219:d1ff:fe91:1a72');
```5N9AW0Uh8C```
mysql> SET @net_len = 80;
```4nTnkzJd84```
mysql> SELECT HEX(INET6_ATON('::')) AS 'all zeros';
+----------------------------------+
| all zeros                        |
+----------------------------------+
| 00000000000000000000000000000000 |
+----------------------------------+
```1RkrqjFr4f```
mysql> SELECT HEX(~INET6_ATON('::')) AS 'all ones';
+----------------------------------+
| all ones                         |
+----------------------------------+
| FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF |
+----------------------------------+
```79zeSvhuuv```
mysql> SET @net_mask = ~INET6_ATON('::') << (128 - @net_len);
mysql> SET @host_mask = ~INET6_ATON('::') >> @net_len;
```VW3ZfAoBIl```
mysql> SELECT INET6_NTOA(@net_mask) AS 'network mask';
+----------------------------+
| network mask               |
+----------------------------+
| ffff:ffff:ffff:ffff:ffff:: |
+----------------------------+
mysql> SELECT INET6_NTOA(@host_mask) AS 'host mask';
+------------------------+
| host mask              |
+------------------------+
| ::ffff:255.255.255.255 |
+------------------------+
```9iEWIUV8ig```
mysql> SET @net_part = @ip & @net_mask;
mysql> SET @host_part = @ip & @host_mask;
mysql> SELECT INET6_NTOA(@net_part) AS 'network part';
+-----------------+
| network part    |
+-----------------+
| fe80::219:0:0:0 |
+-----------------+
mysql> SELECT INET6_NTOA(@host_part) AS 'host part';
+------------------+
| host part        |
+------------------+
| ::d1ff:fe91:1a72 |
+------------------+
```B3sh9XsVtB```
mysql> SELECT 64 | 1, X'40' | X'01';
+--------+---------------+
| 64 | 1 | X'40' | X'01' |
+--------+---------------+
|     65 |            65 |
+--------+---------------+
```k57qpoFjq4```
mysql> SELECT _binary X'40' | X'01';
+-----------------------+
| _binary X'40' | X'01' |
+-----------------------+
| A                     |
+-----------------------+
mysql> SET @var1 = X'40', @var2 = X'01';
mysql> SELECT @var1 | @var2;
+---------------+
| @var1 | @var2 |
+---------------+
| A             |
+---------------+
```6zMGGRPoVL```
mysql> SELECT ~0, 64 << 2, X'40' << 2;
+----------------------+---------+------------+
| ~0                   | 64 << 2 | X'40' << 2 |
+----------------------+---------+------------+
| 18446744073709551615 |     256 |        256 |
+----------------------+---------+------------+
```Ubws2rfeH9```
mysql> SELECT HEX(_binary X'1111000022220000' >> 16);
+----------------------------------------+
| HEX(_binary X'1111000022220000' >> 16) |
+----------------------------------------+
| 0000111100002222                       |
+----------------------------------------+
mysql> SELECT HEX(_binary X'1111000022220000' << 16);
+----------------------------------------+
| HEX(_binary X'1111000022220000' << 16) |
+----------------------------------------+
| 0000222200000000                       |
+----------------------------------------+
mysql> SET @var1 = X'F0F0F0F0';
mysql> SELECT HEX(~@var1);
+-------------+
| HEX(~@var1) |
+-------------+
| 0F0F0F0F    |
+-------------+
```jWwv4NXJVh```
mysql> SELECT BIT_COUNT(127);
+----------------+
| BIT_COUNT(127) |
+----------------+
|              7 |
+----------------+
mysql> SELECT BIT_COUNT(b'010101'), BIT_COUNT(_binary b'010101');
+----------------------+------------------------------+
| BIT_COUNT(b'010101') | BIT_COUNT(_binary b'010101') |
+----------------------+------------------------------+
|                    3 |                            3 |
+----------------------+------------------------------+
```lOzlJh8s06```
mysql> CREATE TABLE t (group_id INT, a VARBINARY(6));
mysql> INSERT INTO t VALUES (1, NULL);
mysql> INSERT INTO t VALUES (1, NULL);
mysql> INSERT INTO t VALUES (2, NULL);
mysql> INSERT INTO t VALUES (2, X'1234');
mysql> INSERT INTO t VALUES (2, X'FF34');
mysql> SELECT HEX(BIT_AND(a)), HEX(BIT_OR(a)), HEX(BIT_XOR(a))
       FROM t GROUP BY group_id;
+-----------------+----------------+-----------------+
| HEX(BIT_AND(a)) | HEX(BIT_OR(a)) | HEX(BIT_XOR(a)) |
+-----------------+----------------+-----------------+
| FFFFFFFFFFFF    | 000000000000   | 000000000000    |
| 1234            | FF34           | ED00            |
+-----------------+----------------+-----------------+
```HDSvDV5xrl```
  b'0001' | b'0010'
  X'0008' << 8
  ```0vu2Wtbyg3```
  NULL & NULL
  NULL >> 4
  ```3zjCqtlVG0```

O resultado das duas últimas expressões é `NULL`, assim como sem o operador `BINARY`, mas o tipo de dados do resultado é um tipo de string binária em vez de um tipo inteiro.