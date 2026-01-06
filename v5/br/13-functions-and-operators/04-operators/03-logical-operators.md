### 12.4.3 Operadores Lógicos

**Tabela 12.5 Operadores Lógicos**

<table frame="box" rules="all" summary="Uma referência que lista operadores lógicos."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Nome</th> <th>Descrição</th> </tr></thead><tbody><tr><td><a class="link" href="logical-operators.html#operator_and">[[<code class="literal">AND</code>]], [[<code class="literal">&amp;&amp;</code>]]</a></td> <td>E lógico AND</td> </tr><tr><td><a class="link" href="logical-operators.html#operator_not">[[<code class="literal">NOT</code>]], [[<code class="literal">!</code>]]</a></td> <td>Nega o valor</td> </tr><tr><td><a class="link" href="logical-operators.html#operator_or">[[<code class="literal">OR</code>]], [[<code class="literal">||</code>]]</a></td> <td>OU lógico</td> </tr><tr><td><a class="link" href="logical-operators.html#operator_xor">[[<code class="literal">XOR</code>]]</a></td> <td>XOR lógico</td> </tr></tbody></table>

Em SQL, todos os operadores lógicos avaliam como `TRUE`, `FALSE` ou `NULL` (`DESCONHECIDO`). No MySQL, esses são implementados como 1 (`TRUE`), 0 (`FALSE`) e `NULL`. A maior parte disso é comum a diferentes servidores de banco de dados SQL, embora alguns servidores possam retornar qualquer valor não nulo para `TRUE`.

O MySQL avalia qualquer valor não nulo e diferente de `NULL` como `TRUE`. Por exemplo, as seguintes declarações são todas avaliadas como `TRUE`:

```sql
mysql> SELECT 10 IS TRUE;
-> 1
mysql> SELECT -10 IS TRUE;
-> 1
mysql> SELECT 'string' IS NOT NULL;
-> 1
```

- `NÃO`, `!`

  Lógico NÃO. Avalia `1` se o operando for `0`, `0` se o operando for não nulo e `NOT NULL` retorna `NULL`.

  ```sql
  mysql> SELECT NOT 10;
          -> 0
  mysql> SELECT NOT 0;
          -> 1
  mysql> SELECT NOT NULL;
          -> NULL
  mysql> SELECT ! (1+1);
          -> 0
  mysql> SELECT ! 1+1;
          -> 1
  ```

  O último exemplo produz `1` porque a expressão avalia da mesma maneira que `(!1)+1`.

- `E`, `&&`

  E lógico. Avalia `1` se todos os operadores forem não nulos e não `NULL`, `0` se um ou mais operadores forem `0`, e, caso contrário, `NULL` é retornado.

  ```sql
  mysql> SELECT 1 AND 1;
          -> 1
  mysql> SELECT 1 AND 0;
          -> 0
  mysql> SELECT 1 AND NULL;
          -> NULL
  mysql> SELECT 0 AND NULL;
          -> 0
  mysql> SELECT NULL AND 0;
          -> 0
  ```

- `OU`, `||`

  OR lógico. Quando ambos os operadores são não `NULL`, o resultado é `1` se qualquer dos operadores for não nulo e `0` caso contrário. Com um operador `NULL`, o resultado é `1` se o outro operador for não nulo e `NULL` caso contrário. Se ambos os operadores forem `NULL`, o resultado é `NULL`.

  ```sql
  mysql> SELECT 1 OR 1;
          -> 1
  mysql> SELECT 1 OR 0;
          -> 1
  mysql> SELECT 0 OR 0;
          -> 0
  mysql> SELECT 0 OR NULL;
          -> NULL
  mysql> SELECT 1 OR NULL;
          -> 1
  ```

  Nota

  Se o modo SQL `PIPES_AS_CONCAT` estiver ativado, o operador de concatenação de strings padrão do SQL (`||`) (como `CONCAT()`) será usado.

- `XOR`

  XOR lógico. Retorna `NULL` se qualquer dos operandos for `NULL`. Para operandos que não são `NULL`, avalia como `1` se houver um número ímpar de operandos não nulos, caso contrário, `0` é retornado.

  ```sql
  mysql> SELECT 1 XOR 1;
          -> 0
  mysql> SELECT 1 XOR 0;
          -> 1
  mysql> SELECT 1 XOR NULL;
          -> NULL
  mysql> SELECT 1 XOR 1 XOR 1;
          -> 1
  ```

  `a XOR b` é matematicamente igual a `(a E (NOT b)) OU ((NOT a) e b)`.
