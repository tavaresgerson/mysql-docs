## 12.12 Funções e Operadores de Bit

**Tabela 12.17 Funções e Operadores de Bit**

<table frame="box" rules="all" summary="A reference that lists bit functions and operators."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Nome</th> <th>Descrição</th> </tr></thead><tbody><tr><td><code>&amp;</code></td> <td> AND bit a bit </td> </tr><tr><td><code>&gt;&gt;</code></td> <td> Deslocamento para a direita </td> </tr><tr><td><code>&lt;&lt;</code></td> <td> Deslocamento para a esquerda </td> </tr><tr><td><code>^</code></td> <td> XOR bit a bit </td> </tr><tr><td><code>BIT_COUNT()</code></td> <td> Retorna o número de bits que estão definidos </td> </tr><tr><td><code>|</code></td> <td> OR bit a bit </td> </tr><tr><td><code>~</code></td> <td> Inversão bit a bit </td> </tr> </tbody></table>

A lista a seguir descreve as funções e operadores de bit disponíveis:

* `|`

  OR bit a bit.

  O resultado é um INTEGER de 64 bits unsigned.

  ```sql
  mysql> SELECT 29 | 15;
          -> 31
  ```

* `&`

  AND bit a bit.

  O resultado é um INTEGER de 64 bits unsigned.

  ```sql
  mysql> SELECT 29 & 15;
          -> 13
  ```

* `^`

  XOR bit a bit.

  O resultado é um INTEGER de 64 bits unsigned.

  ```sql
  mysql> SELECT 1 ^ 1;
          -> 0
  mysql> SELECT 1 ^ 0;
          -> 1
  mysql> SELECT 11 ^ 3;
          -> 8
  ```

* `<<`

  Desloca um número longlong (`BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") para a esquerda.

  O resultado é um INTEGER de 64 bits unsigned. O valor é truncado para 64 bits. Em particular, se a contagem de deslocamento for maior ou igual à largura de um número de 64 bits unsigned, o resultado é zero.

  ```sql
  mysql> SELECT 1 << 2;
          -> 4
  ```

* `>>`

  Desloca um número longlong (`BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") para a direita.

  O resultado é um INTEGER de 64 bits unsigned. O valor é truncado para 64 bits. Em particular, se a contagem de deslocamento for maior ou igual à largura de um número de 64 bits unsigned, o resultado é zero.

  ```sql
  mysql> SELECT 4 >> 2;
          -> 1
  ```

* `~`

  Inverte todos os bits.

  O resultado é um INTEGER de 64 bits unsigned.

  ```sql
  mysql> SELECT 5 & ~1;
          -> 4
  ```

* `BIT_COUNT(N)`

  Retorna o número de bits que estão definidos no argumento *`N`* como um INTEGER de 64 bits unsigned, ou `NULL` se o argumento for `NULL`.

  ```sql
  mysql> SELECT BIT_COUNT(29), BIT_COUNT(b'101010');
          -> 4, 3
  ```

Funções e operadores de bit incluem `BIT_COUNT()`, `BIT_AND()`, `BIT_OR()`, `BIT_XOR()`, `&`, `|`, `^`, `~`, `<<` e `>>`. (As funções `BIT_AND()`, `BIT_OR()` e `BIT_XOR()` são funções Aggregate descritas na Seção 12.19.1, “Descrições de Funções Aggregate”.) Atualmente, funções e operadores de bit exigem argumentos `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") (INTEGER de 64 bits) e retornam valores `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), portanto, eles têm um alcance máximo de 64 bits. Argumentos de outros tipos são convertidos para `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") e pode ocorrer truncamento.

Uma extensão para o MySQL 8.0 altera este comportamento de cast para `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT": Funções e operadores de bit permitem argumentos do tipo string binária (`BINARY`, `VARBINARY` e os tipos `BLOB`), permitindo que recebam argumentos e produzam valores de retorno maiores que 64 bits. Consequentemente, operações de bit em argumentos binários no MySQL 5.7 podem produzir resultados diferentes no MySQL 8.0. Para fornecer aviso prévio sobre esta potencial alteração de comportamento, o servidor gera warnings a partir do MySQL 5.7.11 para operações de bit nas quais argumentos binários não são convertidos para INTEGER no MySQL 8.0. Estes warnings oferecem uma oportunidade para reescrever as statements afetadas. Para produzir explicitamente o comportamento do MySQL 5.7 de uma forma que não mude após um upgrade para o 8.0, faça o cast dos argumentos binários de operação de bit para convertê-los em INTEGER.

Os cinco tipos de expressão problemáticos a serem observados são:

```sql
nonliteral_binary { & | ^ } binary
binary  { & | ^ } nonliteral_binary
nonliteral_binary { << >> } anything
~ nonliteral_binary
AGGR_BIT_FUNC(nonliteral_binary)
```

Essas expressões retornam `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") no MySQL 5.7, e string binária no 8.0.

Explicação da notação:

* `{ op1 op2 ... }`: Lista de operadores que se aplicam ao tipo de expressão fornecido.

* *`binary`*: Qualquer tipo de argumento string binária, incluindo um literal hexadecimal, literal de bit ou literal `NULL`.

* *`nonliteral_binary`*: Um argumento que é um valor string binária diferente de um literal hexadecimal, literal de bit ou literal `NULL`.

* *`AGGR_BIT_FUNC`*: Uma função aggregate que aceita argumentos de valor de bit: `BIT_AND()`, `BIT_OR()`, `BIT_XOR()`.

O servidor produz um único warning para cada expressão problemática em uma statement, e não um warning para cada row processada. Suponha que uma statement contendo duas expressões problemáticas selecione três rows de uma table. O número de warnings por execução de statement é dois, não seis. O exemplo a seguir ilustra isso.

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

Para evitar que uma statement afetada produza um resultado diferente após um upgrade para o MySQL 8.0, reescreva-a de forma que não gere warnings de operação de bit. Para fazer isso, faça o cast de pelo menos um argumento binário para `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") usando `CAST(... AS UNSIGNED)`. Isso torna explícito o cast implícito de binário para INTEGER do MySQL 5.7:

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

Com a statement reescrita conforme mostrado, o MySQL 8.0 respeita a intenção de tratar os argumentos binários como INTEGERS e produz o mesmo resultado que no 5.7. Além disso, a Replication da statement do MySQL 5.7 para o 8.0 não produz resultados diferentes em servidores diferentes.

Uma statement afetada que não possa ser reescrita está sujeita a estes potenciais problemas em relação a upgrades e Replication:

* A statement pode retornar um resultado diferente após um upgrade para o MySQL 8.0.

* A Replication para o MySQL 8.0 a partir de versões mais antigas pode falhar para binary logging baseado em statement e em formato misto. Isso também é verdade para reproduzir binary logs mais antigos em um servidor 8.0 (por exemplo, usando **mysqlbinlog**). Para evitar isso, mude para binary logging baseado em row no servidor source mais antigo.