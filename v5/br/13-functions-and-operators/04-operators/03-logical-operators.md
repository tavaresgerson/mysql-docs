### 12.4.3 Operadores Lógicos

**Tabela 12.5 Operadores Lógicos**

<table frame="box" rules="all" summary="Uma referência que lista operadores lógicos."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Nome</th> <th>Descrição</th> </tr></thead><tbody><tr><td><code>AND</code>, <code>&amp;&amp;</code></td> <td> AND Lógico </td> </tr><tr><td><code>NOT</code>, <code>!</code></td> <td> Nega o valor </td> </tr><tr><td><code>OR</code>, <code>||</code></td> <td> OR Lógico </td> </tr><tr><td><code>XOR</code></td> <td> XOR Lógico </td> </tr> </tbody></table>

Em SQL, todos os operadores lógicos avaliam para `TRUE`, `FALSE` ou `NULL` (`UNKNOWN`). No MySQL, eles são implementados como 1 (`TRUE`), 0 (`FALSE`) e `NULL`. A maior parte disso é comum a diferentes Database Servers SQL, embora alguns servidores possam retornar qualquer valor não zero para `TRUE`.

O MySQL avalia qualquer valor não zero e não `NULL` como `TRUE`. Por exemplo, as seguintes instruções são todas avaliadas como `TRUE`:

```sql
mysql> SELECT 10 IS TRUE;
-> 1
mysql> SELECT -10 IS TRUE;
-> 1
mysql> SELECT 'string' IS NOT NULL;
-> 1
```

* `NOT`, `!`

  NOT Lógico. Avalia para `1` se o operando for `0`, para `0` se o operando for não zero, e `NOT NULL` retorna `NULL`.

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

  O último exemplo produz `1` porque a expressão é avaliada da mesma forma que `(!1)+1`.

* `AND`, `&&`

  AND Lógico. Avalia para `1` se todos os operandos forem não zero e não `NULL`, para `0` se um ou mais operandos forem `0`, caso contrário, `NULL` é retornado.

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

* `OR`, `||`

  OR Lógico. Quando ambos os operandos são não `NULL`, o resultado é `1` se qualquer operando for não zero, e `0` caso contrário. Com um operando `NULL`, o resultado é `1` se o outro operando for não zero, e `NULL` caso contrário. Se ambos os operandos forem `NULL`, o resultado é `NULL`.

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

  Note

  Se o `SQL mode PIPES_AS_CONCAT` estiver ativado, `||` significa o operador de concatenação de strings padrão SQL (como `CONCAT()`).

* `XOR`

  XOR Lógico. Retorna `NULL` se qualquer um dos operandos for `NULL`. Para operandos não `NULL`, avalia para `1` se um número ímpar de operandos for não zero, caso contrário, `0` é retornado.

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

  `a XOR b` é matematicamente igual a `(a AND (NOT b)) OR ((NOT a) and b)`.