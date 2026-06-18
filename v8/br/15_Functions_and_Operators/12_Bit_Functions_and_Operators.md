## 14.12 Funções e operadores de bits

**Tabela 14.17 Funções e Operadores de Bits**

<table summary="Uma referência que lista funções e operadores de bits."><thead><tr><th>Nome</th> <th>Descrição</th> </tr></thead><tbody><tr><td>[[<code>&amp;</code>]]</td> <td>E AND bit a bit</td> </tr><tr><td>[[<code>&gt;&gt;</code>]]</td> <td>Deslocamento para a direita</td> </tr><tr><td>[[<code>&lt;&lt;</code>]]</td> <td>Deslocamento para a esquerda</td> </tr><tr><td>[[<code>^</code>]]</td> <td>XOR bit a bit</td> </tr><tr><td>[[<code>BIT_COUNT()</code>]]</td> <td>Retorne o número de bits definidos</td> </tr><tr><td>[[<code>|</code>]]</td> <td>Bitwise OU</td> </tr><tr><td>[[<code>~</code>]]</td> <td>Inversão bit a bit</td> </tr></tbody></table>

A lista a seguir descreve as funções e operadores de bits disponíveis:

- `|`

  Bitwise OU.

  O tipo de resultado depende se os argumentos são avaliados como strings binárias ou números:

  - A avaliação de cadeias binárias ocorre quando os argumentos têm um tipo de cadeia binária e pelo menos um deles não é um literal hexadecimal, literal de bit ou literal `NULL`. A avaliação numérica ocorre de outra forma, com a conversão dos argumentos em inteiros de 64 bits não assinados, conforme necessário.

  - A avaliação de strings binárias produz uma string binária da mesma extensão que os argumentos. Se os argumentos tiverem comprimentos diferentes, ocorre um erro `ER_INVALID_BITWISE_OPERANDS_SIZE`. A avaliação numérica produz um inteiro de 64 bits sem sinal.

  Para mais informações, consulte a discussão introdutória nesta seção.

  ```
  mysql> SELECT 29 | 15;
          -> 31
  mysql> SELECT _binary X'40404040' | X'01020304';
          -> 'ABCD'
  ```

  Se a operação de E ou bit a bit for invocada dentro do cliente **mysql**, os resultados das strings binárias são exibidos usando notação hexadecimal, dependendo do valor do `--binary-as-hex`. Para obter mais informações sobre essa opção, consulte a Seção 6.5.1, “mysql — O Cliente de Linha de Comando do MySQL”.

- `&`

  E AND bit a bit.

  O tipo de resultado depende se os argumentos são avaliados como strings binárias ou números:

  - A avaliação de cadeias binárias ocorre quando os argumentos têm um tipo de cadeia binária e pelo menos um deles não é um literal hexadecimal, literal de bit ou literal `NULL`. A avaliação numérica ocorre de outra forma, com a conversão dos argumentos em inteiros de 64 bits não assinados, conforme necessário.

  - A avaliação de strings binárias produz uma string binária da mesma extensão que os argumentos. Se os argumentos tiverem comprimentos diferentes, ocorre um erro `ER_INVALID_BITWISE_OPERANDS_SIZE`. A avaliação numérica produz um inteiro de 64 bits sem sinal.

  Para mais informações, consulte a discussão introdutória nesta seção.

  ```
  mysql> SELECT 29 & 15;
          -> 13
  mysql> SELECT HEX(_binary X'FF' & b'11110000');
          -> 'F0'
  ```

  Se a operação de E e B for invocada dentro do cliente **mysql**, os resultados da string binária são exibidos usando a notação hexadecimal, dependendo do valor do `--binary-as-hex`. Para obter mais informações sobre essa opção, consulte a Seção 6.5.1, “mysql — O Cliente de Linha de Comando do MySQL”.

- `^`

  XOR bit a bit.

  O tipo de resultado depende se os argumentos são avaliados como strings binárias ou números:

  - A avaliação de cadeias binárias ocorre quando os argumentos têm um tipo de cadeia binária e pelo menos um deles não é um literal hexadecimal, literal de bit ou literal `NULL`. A avaliação numérica ocorre de outra forma, com a conversão dos argumentos em inteiros de 64 bits não assinados, conforme necessário.

  - A avaliação de strings binárias produz uma string binária da mesma extensão que os argumentos. Se os argumentos tiverem comprimentos diferentes, ocorre um erro `ER_INVALID_BITWISE_OPERANDS_SIZE`. A avaliação numérica produz um inteiro de 64 bits sem sinal.

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

  Se o operador XOR de bits for invocado dentro do cliente **mysql**, os resultados das strings binárias são exibidos usando notação hexadecimal, dependendo do valor do `--binary-as-hex`. Para obter mais informações sobre essa opção, consulte a Seção 6.5.1, “mysql — O Cliente de Linha de Comando do MySQL”.

- `<<`

  Desloca um número ou uma string binária para a esquerda (`BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT)).

  O tipo de resultado depende se o argumento bit é avaliado como uma string binária ou um número:

  - A avaliação de strings binárias ocorre quando o argumento bit tem um tipo de string binária e não é um literal hexadecimal, literal de bit ou literal `NULL`. A avaliação numérica ocorre de outra forma, com a conversão do argumento para um inteiro de 64 bits não assinado, conforme necessário.

  - A avaliação de strings binárias produz uma string binária com o mesmo comprimento do argumento bit. A avaliação numérica produz um inteiro de 64 bits sem sinal.

  Os bits deslocados do final do valor são perdidos sem aviso prévio, independentemente do tipo de argumento. Em particular, se o número de deslocamentos for maior ou igual ao número de bits do argumento de bits, todos os bits do resultado serão 0.

  Para mais informações, consulte a discussão introdutória nesta seção.

  ```
  mysql> SELECT 1 << 2;
          -> 4
  mysql> SELECT HEX(_binary X'00FF00FF00FF' << 8);
          -> 'FF00FF00FF00'
  ```

  Se uma operação de deslocamento de bits for invocada dentro do cliente **mysql**, os resultados das strings binárias são exibidos usando notação hexadecimal, dependendo do valor do `--binary-as-hex`. Para obter mais informações sobre essa opção, consulte a Seção 6.5.1, “mysql — O Cliente de Linha de Comando do MySQL”.

- `>>`

  Desloca um número ou uma string binária para a direita (`BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT)).

  O tipo de resultado depende se o argumento bit é avaliado como uma string binária ou um número:

  - A avaliação de strings binárias ocorre quando o argumento bit tem um tipo de string binária e não é um literal hexadecimal, literal de bit ou literal `NULL`. A avaliação numérica ocorre de outra forma, com a conversão do argumento para um inteiro de 64 bits não assinado, conforme necessário.

  - A avaliação de strings binárias produz uma string binária com o mesmo comprimento do argumento bit. A avaliação numérica produz um inteiro de 64 bits sem sinal.

  Os bits deslocados do final do valor são perdidos sem aviso prévio, independentemente do tipo de argumento. Em particular, se o número de deslocamentos for maior ou igual ao número de bits do argumento de bits, todos os bits do resultado serão 0.

  Para mais informações, consulte a discussão introdutória nesta seção.

  ```
  mysql> SELECT 4 >> 2;
          -> 1
  mysql> SELECT HEX(_binary X'00FF00FF00FF' >> 8);
          -> '0000FF00FF00'
  ```

  Se uma operação de deslocamento de bits for invocada dentro do cliente **mysql**, os resultados das strings binárias são exibidos usando notação hexadecimal, dependendo do valor do `--binary-as-hex`. Para obter mais informações sobre essa opção, consulte a Seção 6.5.1, “mysql — O Cliente de Linha de Comando do MySQL”.

- `~`

  Inverter todos os bits.

  O tipo de resultado depende se o argumento bit é avaliado como uma string binária ou um número:

  - A avaliação de strings binárias ocorre quando o argumento bit tem um tipo de string binária e não é um literal hexadecimal, literal de bit ou literal `NULL`. A avaliação numérica ocorre de outra forma, com a conversão do argumento para um inteiro de 64 bits não assinado, conforme necessário.

  - A avaliação de strings binárias produz uma string binária com o mesmo comprimento do argumento bit. A avaliação numérica produz um inteiro de 64 bits sem sinal.

  Para mais informações, consulte a discussão introdutória nesta seção.

  ```
  mysql> SELECT 5 & ~1;
          -> 4
  mysql> SELECT HEX(~X'0000FFFF1111EEEE');
          -> 'FFFF0000EEEE1111'
  ```

  Se a inversão bit a bit for invocada dentro do cliente **mysql**, os resultados das strings binárias são exibidos usando notação hexadecimal, dependendo do valor do `--binary-as-hex`. Para obter mais informações sobre essa opção, consulte a Seção 6.5.1, “mysql — O Cliente de Linha de Comando do MySQL”.

- `BIT_COUNT(N)`

  Retorna o número de bits definidos no argumento `N` como um inteiro de 64 bits sem sinal, ou `NULL` se o argumento for `NULL`.

  ```
  mysql> SELECT BIT_COUNT(64), BIT_COUNT(BINARY 64);
          -> 1, 7
  mysql> SELECT BIT_COUNT('64'), BIT_COUNT(_binary '64');
          -> 1, 7
  mysql> SELECT BIT_COUNT(X'40'), BIT_COUNT(_binary X'40');
          -> 1, 1
  ```

As funções e operadores de bits compreendem `BIT_COUNT()`, `BIT_AND()`, `BIT_OR()`, `BIT_XOR()`, `&`, `|`, `^`, `~`, `<<` e `>>`. (As funções agregadoras `BIT_AND()`, `BIT_OR()` e `BIT_XOR()` são descritas na Seção 14.19.1, “Descrição das Funções Agregadoras”). Antes do MySQL 8.0, as funções e operadores de bits exigiam argumentos de `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") (inteiro de 64 bits) e retornavam valores de `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") de 64 bits, portanto, tinham um alcance máximo de 64 bits. Os argumentos que não eram `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") eram convertidos em `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") antes de realizar a operação e poderia ocorrer uma truncagem.

No MySQL 8.0, as funções e operadores de bits permitem argumentos do tipo de string binária (os tipos `BINARY`, `VARBINARY` e `BLOB`) e retornam um valor do mesmo tipo, o que permite que eles recebam argumentos e produzam valores de retorno maiores que 64 bits. Argumentos de string não binários são convertidos em `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") e processados como antes.

Uma implicação dessa mudança de comportamento é que as operações de bits em argumentos de strings binárias podem produzir um resultado diferente no MySQL 8.0 do que no 5.7. Para obter informações sobre como se preparar no MySQL 5.7 para potenciais incompatibilidades entre o MySQL 5.7 e o 8.0, consulte Funções e Operadores de Bits, no Manual de Referência do MySQL 5.7.

- Operações de bits antes do MySQL 8.0

- Operações de bits no MySQL 8.0

- Exemplos de operações de bits em strings binárias

- Operações de E, OU e XOR com Bitwise

- Operações de complemento e deslocamento bit a bit

- BIT\_COUNT() Operações Operações")

- Operações BIT\_AND(), BIT\_OR() e BIT\_XOR() Operações BIT\_OR() e BIT\_XOR()

- Tratamento Especial de Literais Hexadecimais, Literais de Bits e Literais NULL

- Incompatibilidades de Operações de Bits com o MySQL 5.7

### Operações de bits antes do MySQL 8.0

As operações de bits antes do MySQL 8.0 tratam apenas valores de argumentos e resultados inteiros de 64 bits não assinados (ou seja, valores não assinados `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"). A conversão dos argumentos de outros tipos para `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") ocorre conforme necessário. Exemplos:

- Esta declaração opera com literais numéricos, tratados como inteiros de 64 bits não assinados:

  ```
  mysql> SELECT 127 | 128, 128 << 2, BIT_COUNT(15);
  +-----------+----------+---------------+
  | 127 | 128 | 128 << 2 | BIT_COUNT(15) |
  +-----------+----------+---------------+
  |       255 |      512 |             4 |
  +-----------+----------+---------------+
  ```

- Esta declaração realiza conversões de número para string nos argumentos da string (`'127'` a `127`, e assim por diante) antes de realizar as mesmas operações que a primeira declaração e produzir os mesmos resultados:

  ```
  mysql> SELECT '127' | '128', '128' << 2, BIT_COUNT('15');
  +---------------+------------+-----------------+
  | '127' | '128' | '128' << 2 | BIT_COUNT('15') |
  +---------------+------------+-----------------+
  |           255 |        512 |               4 |
  +---------------+------------+-----------------+
  ```

- Esta declaração utiliza literais hexadecimais para os argumentos das operações de bits. O MySQL, por padrão, trata os literais hexadecimais como strings binárias, mas, em contexto numérico, os avalia como números (veja a Seção 11.1.4, “Literais Hexadecimais”). Antes do MySQL 8.0, o contexto numérico inclui operações de bits. Exemplos:

  ```
  mysql> SELECT X'7F' | X'80', X'80' << 2, BIT_COUNT(X'0F');
  +---------------+------------+------------------+
  | X'7F' | X'80' | X'80' << 2 | BIT_COUNT(X'0F') |
  +---------------+------------+------------------+
  |           255 |        512 |                4 |
  +---------------+------------+------------------+
  ```

  O tratamento de literais de valor de bit em operações de bit é semelhante ao de literais hexadecimais (ou seja, como números).

### Operações de bits no MySQL 8.0

O MySQL 8.0 estende as operações de bits para lidar diretamente com argumentos de string binária (sem conversão) e produzir resultados em string binária. (Argumentos que não são inteiros ou strings binárias ainda são convertidos em inteiros, como antes.) Essa extensão melhora as operações de bits das seguintes maneiras:

- Operações de bits se tornam possíveis em valores maiores que 64 bits.

- É mais fácil realizar operações de bits em valores que são representados de forma mais natural como strings binárias do que como inteiros.

Por exemplo, considere os valores UUID e os endereços IPv6, que têm formatos de texto legíveis por humanos como este:

```
UUID: 6ccd780c-baba-1026-9564-5b8c656024db
IPv6: fe80::219:d1ff:fe91:1a72
```

É complicado operar com cadeias de texto nesses formatos. Uma alternativa é convertê-las em cadeias binárias de comprimento fixo sem delimitadores. `UUID_TO_BIN()` e `INET6_ATON()` produzem cada um um valor do tipo de dados `BINARY(16)`, uma string binária de 16 bytes (128 bits) de comprimento. As seguintes declarações ilustram isso (`HEX()` é usado para produzir valores exibíveis):

```
mysql> SELECT HEX(UUID_TO_BIN('6ccd780c-baba-1026-9564-5b8c656024db'));
+----------------------------------------------------------+
| HEX(UUID_TO_BIN('6ccd780c-baba-1026-9564-5b8c656024db')) |
+----------------------------------------------------------+
| 6CCD780CBABA102695645B8C656024DB                         |
+----------------------------------------------------------+
mysql> SELECT HEX(INET6_ATON('fe80::219:d1ff:fe91:1a72'));
+---------------------------------------------+
| HEX(INET6_ATON('fe80::219:d1ff:fe91:1a72')) |
+---------------------------------------------+
| FE800000000000000219D1FFFE911A72            |
+---------------------------------------------+
```

Esses valores binários são facilmente manipuláveis com operações de bits para realizar ações como extrair o timestamp dos valores UUID ou extrair as partes de rede e host dos endereços IPv6. (Para exemplos, veja mais adiante nesta discussão.)

Os argumentos que são considerados cadeias binárias incluem valores de coluna, parâmetros de rotina, variáveis locais e variáveis definidas pelo usuário que têm um tipo de cadeia binária: `BINARY`, `VARBINARY` ou um dos tipos `BLOB`.

E quanto aos literais hexadecimais e literais de bits? Lembre-se de que esses são strings binárias por padrão no MySQL, mas números em contexto numérico. Como eles são tratados para operações de bits no MySQL 8.0? O MySQL continua a avaliá-los em contexto numérico, como era feito antes do MySQL 8.0? Ou as operações de bits os avaliam como strings binárias, agora que as strings binárias podem ser manipuladas "nativamente" sem conversão?

Resposta: Tem sido comum especificar argumentos para operações de bits usando literais hexadecimais ou literais de bits com a intenção de que representem números, então o MySQL continua a avaliar operações de bits em contexto numérico quando todos os argumentos de bit são hexadecimais ou literais de bits, para compatibilidade reversa. Se você precisar de avaliação como strings binárias, isso pode ser facilmente feito: Use o `_binary` para introduzir pelo menos um literal.

- Essas operações de bits avaliam os literais hexadecimais e os literais de bits como inteiros:

  ```
  mysql> SELECT X'40' | X'01', b'11110001' & b'01001111';
  +---------------+---------------------------+
  | X'40' | X'01' | b'11110001' & b'01001111' |
  +---------------+---------------------------+
  |            65 |                        65 |
  +---------------+---------------------------+
  ```

- Essas operações de bits avaliam os literais hexadecimais e os literais de bits como strings binárias, devido à introdução do `_binary`:

  ```
  mysql> SELECT _binary X'40' | X'01', b'11110001' & _binary b'01001111';
  +-----------------------+-----------------------------------+
  | _binary X'40' | X'01' | b'11110001' & _binary b'01001111' |
  +-----------------------+-----------------------------------+
  | A                     | A                                 |
  +-----------------------+-----------------------------------+
  ```

Embora as operações de bits em ambas as declarações produzam um resultado com um valor numérico de 65, a segunda declaração opera em um contexto de string binária, para o qual 65 é o código ASCII `A`.

No contexto de avaliação numérica, os valores permitidos de argumentos literais hexadecimais e literais de bits têm um máximo de 64 bits, assim como os resultados. Em contraste, no contexto de avaliação de strings binárias, os argumentos (e os resultados) permitidos podem exceder 64 bits:

```
mysql> SELECT _binary X'4040404040404040' | X'0102030405060708';
+---------------------------------------------------+
| _binary X'4040404040404040' | X'0102030405060708' |
+---------------------------------------------------+
| ABCDEFGH                                          |
+---------------------------------------------------+
```

Há várias maneiras de se referir a um literal hexadecimal ou literal de bit em uma operação de bit para causar a avaliação de uma string binária:

```
_binary literal
BINARY literal
CAST(literal AS BINARY)
```

Outra maneira de produzir a avaliação de cadeias binárias de literais hexadecimais ou literais de bits é atribuí-los a variáveis definidas pelo usuário, o que resulta em variáveis que têm um tipo de cadeia binária:

```
mysql> SET @v1 = X'40', @v2 = X'01', @v3 = b'11110001', @v4 = b'01001111';
mysql> SELECT @v1 | @v2, @v3 & @v4;
+-----------+-----------+
| @v1 | @v2 | @v3 & @v4 |
+-----------+-----------+
| A         | A         |
+-----------+-----------+
```

No contexto de strings binárias, os argumentos das operações lógicas devem ter a mesma extensão ou ocorrerá um erro `ER_INVALID_BITWISE_OPERANDS_SIZE`:

```
mysql> SELECT _binary X'40' | X'0001';
ERROR 3513 (HY000): Binary operands of bitwise
operators must be of equal length
```

Para atender à exigência de comprimento igual, preencha o valor mais curto com dígitos de alinhamento ou, se o valor mais longo começar com dígitos de alinhamento e um valor de resultado mais curto for aceitável, remova-os:

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

O preenchimento ou a remoção também podem ser realizados usando funções como `LPAD()`, `RPAD()`, `SUBSTR()` ou `CAST()`. Nesse caso, os argumentos da expressão não são mais todos literais e `_binary` torna-se desnecessário. Exemplos:

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

### Exemplos de operações de bits em strings binárias

O exemplo a seguir ilustra o uso de operações de bits para extrair partes de um valor UUID, neste caso, o timestamp e o número de nó IEEE 802. Essa técnica requer máscaras de bits para cada parte extraída.

Converta o valor hexadecimal do texto UUID para o valor binário correspondente de 16 bytes, para que ele possa ser manipulado usando operações de bits no contexto de string binária:

```
mysql> SET @uuid = UUID_TO_BIN('6ccd780c-baba-1026-9564-5b8c656024db');
mysql> SELECT HEX(@uuid);
+----------------------------------+
| HEX(@uuid)                       |
+----------------------------------+
| 6CCD780CBABA102695645B8C656024DB |
+----------------------------------+
```

Construa máscaras de bits para as partes do timestamp e do número de nó do valor. O timestamp compreende as três primeiras partes (64 bits, bits 0 a 63) e o número de nó é a última parte (48 bits, bits 80 a 127):

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

A função `CAST(... AS BINARY(16))` é usada aqui porque as máscaras devem ter o mesmo comprimento que o valor UUID contra o qual são aplicadas. O mesmo resultado pode ser obtido usando outras funções para preenchimento das máscaras com o comprimento necessário:

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

O exemplo anterior usa essas operações de bits: deslocamento à direita (`>>`) e E bit a bit (`&`).

Nota

`UUID_TO_BIN()` aceita uma bandeira que causa uma reorganização de alguns bits no valor binário resultante do UUID. Se você usar essa bandeira, modifique as máscaras de extração conforme necessário.

O próximo exemplo usa operações de bits para extrair as partes de rede e host de um endereço IPv6. Suponha que a parte de rede tenha uma extensão de 80 bits. Então, a parte de host tem uma extensão de 128 − 80 = 48 bits. Para extrair as partes de rede e host do endereço, converta-o em uma string binária e, em seguida, use operações de bits no contexto da string binária.

Converta o endereço IPv6 para a string binária correspondente:

```
mysql> SET @ip = INET6_ATON('fe80::219:d1ff:fe91:1a72');
```

Defina o comprimento da rede em bits:

```
mysql> SET @net_len = 80;
```

Construa máscaras de rede e de host, movendo o endereço de todos os zeros para a esquerda ou para a direita. Para fazer isso, comece com o endereço `::`, que é uma abreviação para todos os zeros, como você pode ver ao convertê-lo em uma string binária assim:

```
mysql> SELECT HEX(INET6_ATON('::')) AS 'all zeros';
+----------------------------------+
| all zeros                        |
+----------------------------------+
| 00000000000000000000000000000000 |
+----------------------------------+
```

Para produzir o valor complementar (todos uns), use o operador `~` para inverter os bits:

```
mysql> SELECT HEX(~INET6_ATON('::')) AS 'all ones';
+----------------------------------+
| all ones                         |
+----------------------------------+
| FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF |
+----------------------------------+
```

Desloque o valor de todos os 1 para a esquerda ou para a direita para produzir as máscaras de rede e do host:

```
mysql> SET @net_mask = ~INET6_ATON('::') << (128 - @net_len);
mysql> SET @host_mask = ~INET6_ATON('::') >> @net_len;
```

Mostre as máscaras para verificar se elas cobrem as partes corretas do endereço:

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

O exemplo anterior utiliza essas operações de bits: complemento (`~`), deslocamento à esquerda (`<<`), e E lógico (`&`).

A discussão restante fornece detalhes sobre o tratamento de argumentos para cada grupo de operações de bits, mais informações sobre o tratamento de valores literais em operações de bits e possíveis incompatibilidades entre o MySQL 8.0 e versões anteriores do MySQL.

### Operações de E, OU e XOR com Bitwise

Para as operações de bits `&`, `|` e `^`, o tipo de resultado depende se os argumentos são avaliados como strings binárias ou números:

- A avaliação de cadeias binárias ocorre quando os argumentos têm um tipo de cadeia binária e pelo menos um deles não é um literal hexadecimal, literal de bit ou literal `NULL`. A avaliação numérica ocorre de outra forma, com a conversão dos argumentos em inteiros de 64 bits não assinados, conforme necessário.

- A avaliação de strings binárias produz uma string binária da mesma extensão que os argumentos. Se os argumentos tiverem comprimentos diferentes, ocorre um erro `ER_INVALID_BITWISE_OPERANDS_SIZE`. A avaliação numérica produz um inteiro de 64 bits sem sinal.

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

### Operações de complemento e deslocamento bit a bit

Para as operações de bits `~`, `<<` e `>>`, o tipo de resultado depende se o argumento de bit é avaliado como uma string binária ou um número:

- A avaliação de strings binárias ocorre quando o argumento bit tem um tipo de string binária e não é um literal hexadecimal, literal de bit ou literal `NULL`. A avaliação numérica ocorre de outra forma, com a conversão do argumento para um inteiro de 64 bits não assinado, conforme necessário.

- A avaliação de strings binárias produz uma string binária com o mesmo comprimento do argumento bit. A avaliação numérica produz um inteiro de 64 bits sem sinal.

Para operações de deslocamento, os bits deslocados do final do valor são perdidos sem aviso prévio, independentemente do tipo do argumento. Em particular, se o número de deslocamentos for maior ou igual ao número de bits do argumento de bits, todos os bits do resultado serão 0.

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

### BIT\_COUNT() Operações

A função `BIT_COUNT()` sempre retorna um inteiro de 64 bits não assinado, ou `NULL` se o argumento for `NULL`.

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

### Operações BIT\_AND(), BIT\_OR() e BIT\_XOR()

Para as funções de bits `BIT_AND()`, `BIT_OR()` e `BIT_XOR()`, o tipo de resultado depende se os valores dos argumentos da função são avaliados como strings binárias ou números:

- A avaliação de cadeias binárias ocorre quando os valores dos argumentos têm um tipo de cadeia binária e o argumento não é um literal hexadecimal, literal de bit ou literal `NULL`. A avaliação numérica ocorre de outra forma, com a conversão do valor do argumento em inteiros de 64 bits não assinados, conforme necessário.

- A avaliação de strings binárias produz uma string binária com o mesmo comprimento dos valores dos argumentos. Se os valores dos argumentos tiverem comprimentos diferentes, ocorre um erro `ER_INVALID_BITWISE_OPERANDS_SIZE`. Se o tamanho do argumento exceder 511 bytes, ocorre um erro `ER_INVALID_BITWISE_AGGREGATE_OPERANDS_SIZE`. A avaliação numérica produz um inteiro de 64 bits sem sinal.

Os valores de `NULL` não afetam o resultado, a menos que todos os valores sejam `NULL`. Nesse caso, o resultado é um valor neutro com o mesmo comprimento que o comprimento dos valores do argumento (todos os bits 1 para `BIT_AND()`, todos os bits 0 para `BIT_OR()` e `BIT_XOR()`).

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

### Tratamento Especial de Literais Hexadecimais, Literais de Bits e Literais NULL

Para compatibilidade reversa, o MySQL 8.0 avalia operações de bits em contexto numérico quando todos os argumentos de bit são literais hexadecimais, literais de bit ou literais `NULL`. Isso significa que operações de bits em argumentos de bit de string binária não usam avaliação de string binária se todos os argumentos de bit forem literais hexadecimais não adornados, literais de bit ou literais `NULL`. (Isso não se aplica a esses literais se forem escritos com um `_binary` introducer, operador `BINARY` ou outra maneira de especificá-los explicitamente como strings binárias.)

O tratamento literal descrito acima é o mesmo que antes do MySQL 8.0. Exemplos:

- Essas operações de bits avaliam os literais em contexto numérico e produzem um resultado `BIGINT`:

  ```
  b'0001' | b'0010'
  X'0008' << 8
  ```

- Essas operações de bits avaliam `NULL` em contexto numérico e produzem um resultado `BIGINT` que tem um valor `NULL`:

  ```
  NULL & NULL
  NULL >> 4
  ```

No MySQL 8.0, você pode fazer essas operações avaliarem os argumentos em contexto de string binária, indicando explicitamente que pelo menos um argumento é uma string binária:

```
_binary b'0001' | b'0010'
_binary X'0008' << 8
BINARY NULL & NULL
BINARY NULL >> 4
```

O resultado das duas últimas expressões é `NULL`, assim como sem o operador `BINARY`, mas o tipo de dados do resultado é um tipo de string binária em vez de um tipo inteiro.

### Incompatibilidades de Operações de Bits com o MySQL 5.7

Como as operações de bits podem lidar com argumentos de string binária nativamente no MySQL 8.0, algumas expressões produzem um resultado diferente no MySQL 8.0 do que no 5.7. Os cinco tipos de expressões problemáticas a serem observados são:

```
nonliteral_binary { & | ^ } binary
binary  { & | ^ } nonliteral_binary
nonliteral_binary { << >> } anything
~ nonliteral_binary
AGGR_BIT_FUNC(nonliteral_binary)
```

Essas expressões retornam `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") no MySQL 5.7, string binária no 8.0.

Explicação da notação:

- `{ op1 op2 ... }`: Lista de operadores que se aplicam ao tipo de expressão fornecido.

- `binary`: Qualquer tipo de argumento de string binária, incluindo um literal hexadecimal, literal de bit ou literal `NULL`.

- `nonliteral_binary`: Um argumento que é um valor de cadeia binária diferente de um literal hexadecimal, literal de bit ou literal `NULL`.

- `AGGR_BIT_FUNC`: Uma função agregada que aceita argumentos de valor de bit: `BIT_AND()`, `BIT_OR()`, `BIT_XOR()`.

Para obter informações sobre como se preparar no MySQL 5.7 para potenciais incompatibilidades entre o MySQL 5.7 e o 8.0, consulte Funções e operadores de bits, no Manual de referência do MySQL 5.7.
