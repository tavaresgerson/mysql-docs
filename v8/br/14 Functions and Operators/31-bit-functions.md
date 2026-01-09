## Funções e Operadores de Bits

**Tabela 14.17 Funções e Operadores de Bits**

<table><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Nome</th> <th>Descrição</th> </tr></thead><tbody><tr><td><code>&amp;</code></td> <td> E lógico </td> </tr><tr><td><code>&gt;&gt;</code></td> <td> Deslocamento à direita </td> </tr><tr><td><code>&lt;&lt;</code></td> <td> Deslocamento à esquerda </td> </tr><tr><td><code>^</code></td> <td> XOR lógico </td> </tr><tr><td><code>BIT_COUNT()</code></td> <td> Retorna o número de bits definidos </td> </tr><tr><td><code>|</code></td> <td> OU lógico </td> </tr><tr><td><code>~</code></td> <td> Inversão lógica </td> </tr></tbody></table>

A lista a seguir descreve as funções e operadores de bits disponíveis:

*  `|`

  OU lógico.

  O tipo de resultado depende se os argumentos são avaliados como strings binárias ou números:

  + A avaliação de string binária ocorre quando os argumentos têm um tipo de string binária e pelo menos um deles não é um literal hexadecimal, literal de bit ou literal `NULL`. A avaliação numérica ocorre de outra forma, com a conversão dos argumentos para inteiros de 64 bits não negativos conforme necessário.
  + A avaliação de string binária produz uma string binária da mesma comprimento dos argumentos. Se os argumentos tiverem comprimentos diferentes, ocorre um erro `ER_INVALID_BITWISE_OPERANDS_SIZE`. A avaliação numérica produz um inteiro de 64 bits não negativos.

  Para mais informações, consulte a discussão introdutória nesta seção.

  ```
  mysql> SELECT 29 | 15;
          -> 31
  mysql> SELECT _binary X'40404040' | X'01020304';
          -> 'ABCD'
  ```

  Se o OU lógico for invocado dentro do cliente `mysql`, os resultados de string binária são exibidos usando notação hexadecimal, dependendo do valor da opção `--binary-as-hex`. Para mais informações sobre essa opção, consulte a Seção 6.5.1, “mysql — O Cliente de Linha de Comando do MySQL”.
*  `&`

  E lógico.

  O tipo de resultado depende se os argumentos são avaliados como strings binárias ou números:

A avaliação de cadeias binárias ocorre quando os argumentos têm um tipo de cadeia binária e pelo menos um deles não é um literal hexadecimal, literal de bit ou literal `NULL`. A avaliação numérica ocorre de outra forma, com a conversão dos argumentos em inteiros de 64 bits não nulos, conforme necessário.
A avaliação de cadeias binárias produz uma cadeia binária da mesma extensão que os argumentos. Se os argumentos tiverem comprimentos diferentes, ocorre um erro `ER_INVALID_BITWISE_OPERANDS_SIZE`. A avaliação numérica produz um inteiro de 64 bits não nulo.

Para mais informações, consulte a discussão introdutória nesta seção.

```
  mysql> SELECT 29 & 15;
          -> 13
  mysql> SELECT HEX(_binary X'FF' & b'11110000');
          -> 'F0'
  ```

Se a operação de E e OU bit a bit for invocada dentro do cliente `mysql`, os resultados das cadeias binárias são exibidos usando a notação hexadecimal, dependendo do valor da opção `--binary-as-hex`. Para mais informações sobre essa opção, consulte a Seção 6.5.1, “mysql — O Cliente de Linha de Comando do MySQL”.
*  `^`

  E OU bit a bit.

O tipo de resultado depende se os argumentos são avaliados como cadeias binárias ou números:

+ A avaliação de cadeias binárias ocorre quando os argumentos têm um tipo de cadeia binária e pelo menos um deles não é um literal hexadecimal, literal de bit ou literal `NULL`. A avaliação numérica ocorre de outra forma, com a conversão dos argumentos em inteiros de 64 bits não nulos, conforme necessário.
+ A avaliação de cadeias binárias produz uma cadeia binária da mesma extensão que os argumentos. Se os argumentos tiverem comprimentos diferentes, ocorre um erro `ER_INVALID_BITWISE_OPERANDS_SIZE`. A avaliação numérica produz um inteiro de 64 bits não nulo.

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

Se a operação de E OU bit a bit for invocada dentro do cliente `mysql`, os resultados das cadeias binárias são exibidos usando a notação hexadecimal, dependendo do valor da opção `--binary-as-hex`. Para mais informações sobre essa opção, consulte a Seção 6.5.1, “mysql — O Cliente de Linha de Comando do MySQL”.
*  `<<`

  Desloca um número `longlong` ( `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT")) ou uma cadeia binária para a esquerda.

O tipo de resultado depende se o argumento bit é avaliado como uma string binária ou um número:

+ A avaliação de string binária ocorre quando o argumento bit tem um tipo de string binária e não é um literal hexadecimal, literal bit ou literal `NULL`. A avaliação numérica ocorre de outra forma, com conversão do argumento para um inteiro de 64 bits não signatário, conforme necessário.
+ A avaliação de string binária produz uma string binária do mesmo comprimento que o argumento bit. A avaliação numérica produz um inteiro de 64 bits não signatário.

Bits deslocados do final do valor são perdidos sem aviso, independentemente do tipo do argumento. Em particular, se o número de deslocamentos for maior ou igual ao número de bits no argumento bit, todos os bits no resultado são 0.

Para mais informações, consulte a discussão introdutória nesta seção.

```
  mysql> SELECT 1 << 2;
          -> 4
  mysql> SELECT HEX(_binary X'00FF00FF00FF' << 8);
          -> 'FF00FF00FF00'
  ```

Se uma deslocação de bit for invocada dentro do cliente `mysql`, os resultados de string binária são exibidos usando notação hexadecimal, dependendo do valor da opção `--binary-as-hex`. Para mais informações sobre essa opção, consulte a Seção 6.5.1, “mysql — O Cliente de Linha de Comando do MySQL”.

*  `>>`

Desloca um número `longlong` ( `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT")) ou string binária para a direita.

O tipo de resultado depende se o argumento bit é avaliado como uma string binária ou um número:

+ A avaliação de string binária ocorre quando o argumento bit tem um tipo de string binária e não é um literal hexadecimal, literal bit ou literal `NULL`. A avaliação numérica ocorre de outra forma, com conversão do argumento para um inteiro de 64 bits não signatário, conforme necessário.
+ A avaliação de string binária produz uma string binária do mesmo comprimento que o argumento bit. A avaliação numérica produz um inteiro de 64 bits não signatário.

Bits deslocados do final do valor são perdidos sem aviso, independentemente do tipo do argumento. Em particular, se o número de deslocamentos for maior ou igual ao número de bits no argumento bit, todos os bits no resultado são 0.

Para obter mais informações, consulte a discussão introdutória nesta seção.

```
  mysql> SELECT 4 >> 2;
          -> 1
  mysql> SELECT HEX(_binary X'00FF00FF00FF' >> 8);
          -> '0000FF00FF00'
  ```

Se uma operação de deslocamento de bits for invocada dentro do cliente `mysql`, os resultados das strings binárias são exibidos usando notação hexadecimal, dependendo do valor da opção `--binary-as-hex`. Para obter mais informações sobre essa opção, consulte a Seção 6.5.1, “mysql — O Cliente de Linha de Comando do MySQL”.
*  `~`

  Inverter todos os bits.

  O tipo de resultado depende se o argumento de bit é avaliado como uma string binária ou número:

  + A avaliação de string binária ocorre quando o argumento de bit tem um tipo de string binária e não é um literal hexadecimal, literal de bit ou literal `NULL`. A avaliação numérica ocorre de outra forma, com conversão do argumento para um inteiro de 64 bits não assinado conforme necessário.
  + A avaliação de string binária produz uma string binária do mesmo comprimento que o argumento de bit. A avaliação numérica produz um inteiro de 64 bits não assinado.

  Para obter mais informações, consulte a discussão introdutória nesta seção.

```
  mysql> SELECT 5 & ~1;
          -> 4
  mysql> SELECT HEX(~X'0000FFFF1111EEEE');
          -> 'FFFF0000EEEE1111'
  ```

Se a inversão bit a bit for invocada dentro do cliente `mysql`, os resultados das strings binárias são exibidos usando notação hexadecimal, dependendo do valor da opção `--binary-as-hex`. Para obter mais informações sobre essa opção, consulte a Seção 6.5.1, “mysql — O Cliente de Linha de Comando do MySQL”.
*  `BIT_COUNT(N)`

  Retorna o número de bits que estão definidos no argumento *`N`* como um inteiro de 64 bits não assinado, ou `NULL` se o argumento for `NULL`.

  ```
  mysql> SELECT BIT_COUNT(64), BIT_COUNT(BINARY 64);
          -> 1, 7
  mysql> SELECT BIT_COUNT('64'), BIT_COUNT(_binary '64');
          -> 1, 7
  mysql> SELECT BIT_COUNT(X'40'), BIT_COUNT(_binary X'40');
          -> 1, 1
  ```

As funções e operadores de bits incluem `BIT_COUNT()`, `BIT_AND()`, `BIT_OR()`, `BIT_XOR()`, `&`, `|`, `^`, `~`, `<<` e `>>`. (As funções agregadas `BIT_AND()`, `BIT_OR()` e `BIT_XOR()` são descritas na Seção 14.19.1, “Descrição das Funções Agregadas”).

As funções e operadores de bits permitem argumentos de tipos de string binária (tipos `BINARY`, `VARBINARY` e `BLOB`) e retornam um valor do mesmo tipo. Argumentos de string não binários são convertidos para `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, `BIGINT`).

* Operações com bits
* Exemplos de operações de bits em strings binárias
* Operações de E e OU com bits, e XOR com bits
* Operações de complemento e deslocamento com bits
* Operações BIT_COUNT()
* Operações BIT_AND(), BIT_OR() e BIT_XOR(), BIT_OR() e BIT_XOR()
* Tratamento especial de literais hexadecimais, literais de bits e literais NULL

### Operações com bits

O MySQL 8.4 lida com argumentos de strings binárias diretamente (sem conversão) e produz resultados em strings binárias. Argumentos que não são inteiros ou strings binárias são convertidos em inteiros.

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

Em contexto de avaliação numérica, os valores permitidos de argumentos literais hexadecimais e literais de bits têm um máximo de 64 bits, assim como os resultados. Em contraste, em contexto de avaliação de strings binárias, os argumentos (e resultados) permitidos podem exceder 64 bits:

```
mysql> SELECT _binary X'4040404040404040' | X'0102030405060708';
+---------------------------------------------------+
| _binary X'4040404040404040' | X'0102030405060708' |
+---------------------------------------------------+
| ABCDEFGH                                          |
+---------------------------------------------------+
```

Há várias maneiras de referenciar um literal hexadecimal ou literal de bit em uma operação com bits para causar avaliação como strings binárias:

```
_binary literal
BINARY literal
CAST(literal AS BINARY)
```

Outra maneira de produzir a avaliação de strings binárias de literais hexadecimais ou literais de bits é atribuí-los a variáveis definidas pelo usuário, o que resulta em variáveis que têm um tipo de string binária:

```
mysql> SET @v1 = X'40', @v2 = X'01', @v3 = b'11110001', @v4 = b'01001111';
mysql> SELECT @v1 | @v2, @v3 & @v4;
+-----------+-----------+
| @v1 | @v2 | @v3 & @v4 |
+-----------+-----------+
| A         | A         |
+-----------+-----------+
```

No contexto de string binária, os argumentos das operações bit a bit devem ter o mesmo comprimento ou ocorrerá um erro `ER_INVALID_BITWISE_OPERANDS_SIZE`:

```
mysql> SELECT _binary X'40' | X'0001';
ERROR 3513 (HY000): Binary operands of bitwise
operators must be of equal length
```

Para satisfazer o requisito de comprimento igual, pule o valor mais curto com dígitos nulos no início ou, se o valor mais longo começar com dígitos nulos e um valor de resultado mais curto for aceitável, remova-os:

```
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
```

O preenchimento ou remoção também pode ser realizado usando funções como `LPAD()`, `RPAD()`, `SUBSTR()` ou `CAST()`. Nesses casos, os argumentos da expressão deixam de ser literais e `_binary` torna-se desnecessário. Exemplos:

```
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
```

Veja também o Tratamento Especial de Literais Hexadecimais, Literais de Bits e Literais NULL.

### Exemplos de Operações Bit a Bit com String Binária

O exemplo seguinte ilustra o uso de operações bit a bit para extrair partes de um valor UUID, neste caso, o timestamp e o número de nó IEEE 802. Essa técnica requer máscaras de bits para cada parte extraída.

Converta o valor de texto UUID para o valor binário correspondente de 16 bytes, para que possa ser manipulado usando operações bit a bit no contexto de string binária:

```
mysql> SET @uuid = UUID_TO_BIN('6ccd780c-baba-1026-9564-5b8c656024db');
mysql> SELECT HEX(@uuid);
+----------------------------------+
| HEX(@uuid)                       |
+----------------------------------+
| 6CCD780CBABA102695645B8C656024DB |
+----------------------------------+
```

Construa máscaras de bits para as partes de timestamp e número de nó do valor. O timestamp compreende as três primeiras partes (64 bits, bits 0 a 63) e o número de nó é a última parte (48 bits, bits 80 a 127):

```
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
```

A função `CAST(... AS BINARY(16))` é usada aqui porque as máscaras devem ter o mesmo comprimento que o valor UUID contra o qual são aplicadas. O mesmo resultado pode ser produzido usando outras funções para preencher as máscaras ao comprimento necessário:

```
SET @ts_mask= RPAD(X'FFFFFFFFFFFFFFFF' , 16, X'00');
SET @node_mask = LPAD(X'FFFFFFFFFFFF', 16, X'00') ;
```

Use as máscaras para extrair as partes de timestamp e número de nó:

```
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
```

O exemplo anterior usa essas operações bit a bit: deslocamento à direita (`>>`) e E e (AND) bit a bit (`&`).

::: info Nota
Português (Brasil):

`UUID_TO_BIN()` aceita uma flag que causa uma reorganização de alguns bits no valor binário resultante do UUID. Se você usar essa flag, modifique as máscaras de extração conforme necessário.


:::

O próximo exemplo usa operações de bits para extrair as partes de rede e host de um endereço IPv6. Suponha que a parte de rede tenha uma extensão de 80 bits. Então, a parte de host tem uma extensão de 48 bits (128 − 80). Para extrair as partes de rede e host do endereço, converta-o em uma string binária, em seguida, use operações de bits no contexto da string binária.

Converta o endereço IPv6 de texto para a string binária correspondente:

```
mysql> SET @ip = INET6_ATON('fe80::219:d1ff:fe91:1a72');
```

Defina a extensão da rede em bits:

```
mysql> SET @net_len = 80;
```

Construa as máscaras de rede e host, deslocando a string de todos os uns para a esquerda ou para a direita. Para fazer isso, comece com o endereço `::`, que é uma abreviação para todos os zeros, como você pode ver ao convertê-lo em uma string binária assim:

```
mysql> SELECT HEX(INET6_ATON('::')) AS 'all zeros';
+----------------------------------+
| all zeros                        |
+----------------------------------+
| 00000000000000000000000000000000 |
+----------------------------------+
```

Para produzir o valor complementar (todos os uns), use o operador `~` para inverter os bits:

```
mysql> SELECT HEX(~INET6_ATON('::')) AS 'all ones';
+----------------------------------+
| all ones                         |
+----------------------------------+
| FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF |
+----------------------------------+
```

Desloque o valor de todos os uns para a esquerda ou para a direita para produzir as máscaras de rede e host:

```
mysql> SET @net_mask = ~INET6_ATON('::') << (128 - @net_len);
mysql> SET @host_mask = ~INET6_ATON('::') >> @net_len;
```

Exiba as máscaras para verificar se cobrem as partes corretas do endereço:

```
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
```

Extraia e exiba as partes de rede e host do endereço:

```
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
```

O exemplo anterior usa essas operações de bits: Complemento (`~`), deslocamento para a esquerda (`<<`), e E e OU (bitwise AND e OR) (`&`).

A discussão restante fornece detalhes sobre o tratamento de argumentos para cada grupo de operações de bits, e mais informações sobre o tratamento de valores literais em operações de bits.

### Operações de E e OU, E EXCLUSIVO (XOR) e E (AND) Bitwise

Para as operações de bits `&`, `|` e `^`, o tipo de resultado depende se os argumentos são avaliados como strings binárias ou números:

* A avaliação de strings binárias ocorre quando os argumentos têm um tipo de string binária e pelo menos um deles não é um literal hexadecimal, literal de bit ou literal `NULL`. A avaliação numérica ocorre de outra forma, com a conversão dos argumentos para inteiros de 64 bits não nulos, conforme necessário.
* A avaliação de strings binárias produz uma string binária da mesma extensão que os argumentos. Se os argumentos tiverem extensões desiguais, ocorre um erro `ER_INVALID_BITWISE_OPERANDS_SIZE`. A avaliação numérica produz um inteiro de 64 bits não nulo.

Exemplos de avaliação numérica:

```
mysql> SELECT 64 | 1, X'40' | X'01';
+--------+---------------+
| 64 | 1 | X'40' | X'01' |
+--------+---------------+
|     65 |            65 |
+--------+---------------+
```

Exemplos de avaliação de strings binárias:

```
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
```

### Operações de Complemento e Deslocamento Bitwise

Para as operações de bitwise `~`, `<<` e `>>`, o tipo do resultado depende se o argumento de bit é avaliado como uma string binária ou um número:

* A avaliação de strings binárias ocorre quando o argumento de bit tem um tipo de string binária e não é um literal hexadecimal, literal de bit ou `NULL`. A avaliação numérica ocorre de outra forma, com a conversão dos argumentos para um inteiro de 64 bits não nulos, conforme necessário.
* A avaliação de strings binárias produz uma string binária da mesma extensão que o argumento de bit. A avaliação numérica produz um inteiro de 64 bits não nulo.

Para operações de deslocamento, os bits deslocados do final do valor são perdidos sem aviso, independentemente do tipo do argumento. Em particular, se o número de deslocamentos for maior ou igual ao número de bits no argumento de bit, todos os bits no resultado são 0.

Exemplos de avaliação numérica:

```
mysql> SELECT ~0, 64 << 2, X'40' << 2;
+----------------------+---------+------------+
| ~0                   | 64 << 2 | X'40' << 2 |
+----------------------+---------+------------+
| 18446744073709551615 |     256 |        256 |
+----------------------+---------+------------+
```

Exemplos de avaliação de strings binárias:

```
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
```

### Operações BIT_COUNT()

A função  `BIT_COUNT()` sempre retorna um inteiro de 64 bits não nulo, ou `NULL` se o argumento for `NULL`.

```
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
```

### Operações BIT_AND(), BIT_OR() e BIT_XOR()

Para as funções de bitwise `BIT_AND()`, `BIT_OR()` e `BIT_XOR()`, o tipo do resultado depende se os valores dos argumentos da função são avaliados como strings binárias ou números:

* A avaliação de cadeias binárias ocorre quando os valores dos argumentos têm um tipo de string binária e o argumento não é um literal hexadecimal, literal de bit ou literal `NULL`. A avaliação numérica ocorre de outra forma, com a conversão do valor do argumento para inteiros de 64 bits não signatários conforme necessário.
* A avaliação de cadeias binárias produz uma string binária da mesma extensão que os valores dos argumentos. Se os valores dos argumentos tiverem extensões desiguais, ocorre um erro `ER_INVALID_BITWISE_OPERANDS_SIZE`. Se o tamanho do argumento exceder 511 bytes, ocorre um erro `ER_INVALID_BITWISE_AGGREGATE_OPERANDS_SIZE`. A avaliação numérica produz um inteiro de 64 bits não signatário.

Os valores `NULL` não afetam o resultado, a menos que todos os valores sejam `NULL`. Nesse caso, o resultado é um valor neutro com a mesma extensão que a extensão dos valores dos argumentos (todos os bits 1 para `BIT_AND()`, todos os bits 0 para `BIT_OR()` e `BIT_XOR()`).

Exemplo:

```
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
```

### Tratamento Especial de Literais Hexadecimais, Literais de Bit e Literais `NULL`

O MySQL 8.4 avalia operações de bit em contexto numérico quando todos os argumentos de bit são literals hexadecimais, literals de bit ou `NULL`. Isso significa que as operações de bit em argumentos de bit binários não usam avaliação de cadeia binária se todos os argumentos de bit forem literals hexadecimais não ornamentados, literals de bit ou `NULL` literals. (Isso não se aplica a tais literals se forem escritos com um introduzir `_binary`, operador `BINARY` ou outra maneira de especificá-los explicitamente como strings binárias.)

Exemplos:

* Essas operações de bit avaliam os literais em contexto numérico e produzem um resultado `BIGINT`:

  ```
  b'0001' | b'0010'
  X'0008' << 8
  ```
* Essas operações de bit avaliam `NULL` em contexto numérico e produzem um resultado `BIGINT` que tem um valor `NULL`:

  ```
  NULL & NULL
  NULL >> 4
  ```

Você pode fazer essas operações avaliarem os argumentos em contexto de cadeia binária, indicando explicitamente que pelo menos um argumento é uma string binária:

```
_binary b'0001' | b'0010'
_binary X'0008' << 8
BINARY NULL & NULL
BINARY NULL >> 4
```

O resultado das duas últimas expressões é `NULL`, assim como sem o operador `BINARY`, mas o tipo de dados do resultado é um tipo de string binária, e não um tipo inteiro.