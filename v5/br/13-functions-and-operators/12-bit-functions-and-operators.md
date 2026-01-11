## 12.12 Funções e operadores de bits

**Tabela 12.17 Funções e Operadores de Bits**

<table frame="box" rules="all" summary="Uma referência que lista funções e operadores de bits."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Nome</th> <th>Descrição</th> </tr></thead><tbody><tr><td><code>&amp;</code></td> <td>E AND bit a bit</td> </tr><tr><td><code>&gt;&gt;</code></td> <td>Deslocamento para a direita</td> </tr><tr><td><code>&lt;&lt;</code></td> <td>Deslocamento para a esquerda</td> </tr><tr><td><code>^</code></td> <td>XOR bit a bit</td> </tr><tr><td><code>BIT_COUNT()</code></td> <td>Retorne o número de bits definidos</td> </tr><tr><td><code>|</code></td> <td>Bitwise OU</td> </tr><tr><td><code>~</code></td> <td>Inversão bit a bit</td> </tr></tbody></table>

A lista a seguir descreve as funções e operadores de bits disponíveis:

- `|`

  Bitwise OU.

  O resultado é um inteiro de 64 bits não assinado.

  ```sql
  mysql> SELECT 29 | 15;
          -> 31
  ```

- `&`

  E AND bit a bit.

  O resultado é um inteiro de 64 bits não assinado.

  ```sql
  mysql> SELECT 29 & 15;
          -> 13
  ```

- `^`

  XOR bit a bit.

  O resultado é um inteiro de 64 bits não assinado.

  ```sql
  mysql> SELECT 1 ^ 1;
          -> 0
  mysql> SELECT 1 ^ 0;
          -> 1
  mysql> SELECT 11 ^ 3;
          -> 8
  ```

- <<

  Desloca um número longo (`BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT)) para a esquerda.

  O resultado é um inteiro de 64 bits não assinado. O valor é truncado para 64 bits. Em particular, se o número de deslocamento for maior ou igual à largura de um número de 64 bits não assinado, o resultado é zero.

  ```sql
  mysql> SELECT 1 << 2;
          -> 4
  ```

- `>>`

  Desloca um número longo (`BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT)) para a direita.

  O resultado é um inteiro de 64 bits não assinado. O valor é truncado para 64 bits. Em particular, se o número de deslocamento for maior ou igual à largura de um número de 64 bits não assinado, o resultado é zero.

  ```sql
  mysql> SELECT 4 >> 2;
          -> 1
  ```

- `~`

  Inverter todos os bits.

  O resultado é um inteiro de 64 bits não assinado.

  ```sql
  mysql> SELECT 5 & ~1;
          -> 4
  ```

- `BIT_COUNT(N)`

  Retorna o número de bits definidos no argumento *`N`* como um inteiro de 64 bits sem sinal, ou `NULL` se o argumento for `NULL`.

  ```sql
  mysql> SELECT BIT_COUNT(29), BIT_COUNT(b'101010');
          -> 4, 3
  ```

As funções e operadores de bits incluem `BIT_COUNT()`, `BIT_AND()`, `BIT_OR()`, `BIT_XOR()`, `&`, `|`, `^`, `~`, `<<` e `>>`. (As funções `BIT_AND()`, `BIT_OR()` e `BIT_XOR()` são funções agregadas descritas na Seção 12.19.1, “Descrição de Funções Agregadas”). Atualmente, as funções e operadores de bits exigem argumentos `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") e retornam valores `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") , portanto, têm um alcance máximo de 64 bits. Argumentos de outros tipos são convertidos em `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") e pode ocorrer truncação.

Uma extensão para o MySQL 8.0 altera o comportamento da conversão de tipos para `BIGINT` - `INTEGER`, `INT`, `SMALLINT`, `TINYINT`, `MEDIUMINT`, `BIGINT") : as funções e operadores de bits permitem argumentos de tipos de string binária (`BINARY`, `VARBINARY`e os tipos`BLOB\`), permitindo que eles recebam argumentos e produzam valores de retorno maiores que 64 bits. Consequentemente, as operações de bits em argumentos binários no MySQL 5.7 podem produzir resultados diferentes no MySQL 8.0. Para fornecer aviso antecipado sobre essa possível mudança de comportamento, o servidor produz avisos a partir do MySQL 5.7.11 para operações de bits para as quais os argumentos binários não são convertidos para inteiro no MySQL 8.0. Esses avisos oferecem uma oportunidade de reescrever as declarações afetadas. Para produzir o comportamento do MySQL 5.7 explicitamente de uma maneira que não mude após a atualização para 8.0, converta os argumentos binários de operações de bits para converter-os para inteiro.

Os cinco tipos de expressões problemáticas a serem observados são:

```sql
nonliteral_binary { & | ^ } binary
binary  { & | ^ } nonliteral_binary
nonliteral_binary { << >> } anything
~ nonliteral_binary
AGGR_BIT_FUNC(nonliteral_binary)
```

Essas expressões retornam `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") no MySQL 5.7, string binária no 8.0.

Explicação da notação:

- `{ op1 op2 ... }`: Lista de operadores que se aplicam ao tipo de expressão fornecido.

- *`binary`*: Qualquer tipo de argumento de string binária, incluindo um literal hexadecimal, literal de bit ou literal `NULL`.

- *`nonliteral_binary`*: Um argumento que é um valor de cadeia binária diferente de um literal hexadecimal, literal de bit ou literal `NULL`.

- *`AGGR_BIT_FUNC`*: Uma função agregada que aceita argumentos de valor de bit: `BIT_AND()`, `BIT_OR()`, `BIT_XOR()`.

O servidor emite um único aviso para cada expressão problemática em uma declaração, e não um aviso para cada linha processada. Suponha que uma declaração que contém duas expressões problemáticas selecione três linhas de uma tabela. O número de avisos por execução da declaração é de dois, e não seis. O exemplo a seguir ilustra isso.

```sql
mysql> CREATE TABLE t(vbin1 VARBINARY(32), vbin2 VARBINARY(32));
Query OK, 0 rows affected (0.03 sec)

mysql> INSERT INTO t VALUES (3,1), (3,2), (3,3);
Query OK, 3 rows affected (0.01 sec)
Records: 3  Duplicates: 0  Warnings: 0

mysql> SELECT HEX(vbin1 & vbin2) AS op1,
    -> HEX(vbin1 | vbin2) AS op2
    -> FROM t;
+------+------+
| op1  | op2  |
+------+------+
| 1    | 3    |
| 2    | 3    |
| 3    | 3    |
+------+------+
3 rows in set, 2 warnings (0.00 sec)

mysql> SHOW WARNINGS\G
*************************** 1. row ***************************
  Level: Warning
   Code: 1287
Message: Bitwise operations on BINARY will change behavior in a future
         version, check the 'Bit functions' section in the manual.
*************************** 2. row ***************************
  Level: Warning
   Code: 1287
Message: Bitwise operations on BINARY will change behavior in a future
         version, check the 'Bit functions' section in the manual.
2 rows in set (0.00 sec)
```

Para evitar que uma declaração afetada produza um resultado diferente após uma atualização para o MySQL 8.0, reescreva-a para que não gere avisos de operações de bits. Para fazer isso, defina pelo menos um argumento binário para `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") com `CAST(... COMO UNSIGNED)`. Isso torna o cast binário implícito do MySQL 5.7 explícito:

```sql
mysql> SELECT HEX(CAST(vbin1 AS UNSIGNED) & CAST(vbin2 AS UNSIGNED)) AS op1,
    -> HEX(CAST(vbin1 AS UNSIGNED) | CAST(vbin2 AS UNSIGNED)) AS op2
    -> FROM t;
+------+------+
| op1  | op2  |
+------+------+
| 1    | 3    |
| 2    | 3    |
| 3    | 3    |
+------+------+
3 rows in set (0.01 sec)

mysql> SHOW WARNINGS\G
Empty set (0.00 sec)
```

Com a declaração reescrita conforme mostrado, o MySQL 8.0 respeita a intenção de tratar os argumentos binários como inteiros e produz o mesmo resultado que no 5.7. Além disso, replicar a declaração do MySQL 5.7 para o 8.0 não produz resultados diferentes em servidores diferentes.

Uma declaração afetada que não pode ser reescrita está sujeita a esses problemas potenciais em relação a atualizações e replicação:

- A declaração pode retornar um resultado diferente após uma atualização para o MySQL 8.0.

- A replicação para o MySQL 8.0 a partir de versões mais antigas pode falhar para o registro binário baseado em instruções e de formato misto. Isso também é verdadeiro para a reprodução de logs binários mais antigos em um servidor 8.0 (por exemplo, usando **mysqlbinlog**). Para evitar isso, mude para o registro binário baseado em linhas no servidor de origem mais antigo.
