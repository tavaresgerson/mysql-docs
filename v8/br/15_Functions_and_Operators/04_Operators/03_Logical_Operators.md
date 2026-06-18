### 14.4.3 Operadores Lógicos

**Tabela 14.5 Operadores Lógicos**

<table summary="Uma referência que lista operadores lógicos."><thead><tr><th>Nome</th> <th>Descrição</th> </tr></thead><tbody><tr><td>[[<code>AND</code>]], [[<code>&amp;&amp;</code>]]</td> <td>E lógico AND</td> </tr><tr><td>[[<code>NOT</code>]], [[<code>!</code>]]</td> <td>Nega o valor</td> </tr><tr><td>[[<code>OR</code>]], [[<code>||</code>]]</td> <td>OU lógico</td> </tr><tr><td>[[<code>XOR</code>]]</td> <td>XOR lógico</td> </tr></tbody></table>

Em SQL, todos os operadores lógicos são avaliados como `TRUE`, `FALSE` ou `NULL` (`UNKNOWN`). No MySQL, esses são implementados como 1 (`TRUE`), 0 (`FALSE`), e `NULL`. A maior parte disso é comum a diferentes servidores de banco de dados SQL, embora alguns servidores possam retornar qualquer valor não nulo para `TRUE`.

O MySQL avalia qualquer valor não nulo, não `NULL`, para `TRUE`. Por exemplo, as seguintes instruções são todas avaliadas como `TRUE`:

```
mysql> SELECT 10 IS TRUE;
-> 1
mysql> SELECT -10 IS TRUE;
-> 1
mysql> SELECT 'string' IS NOT NULL;
-> 1
```

- `NOT`, `!`

  Logical NOT. Avalia `1` se o operando for `0`, `0` se o operando for não nulo e `NOT NULL` retorna `NULL`.

  ```
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

  O operador `!`, operador não padrão do MySQL, está desatualizado a partir do MySQL 8.0.17. Espera-se que ele seja removido em uma versão futura do MySQL. As aplicações devem ser ajustadas para usar o operador SQL padrão `NOT`.

- `AND`, `&&`

  E lógico. Avalia `1` se todos os operadores forem não nulos e não forem `NULL`, `0` se um ou mais operadores forem `0`, caso contrário, `NULL` é retornado.

  ```
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

  O operador `&&`, operador não padrão do MySQL, está desatualizado a partir do MySQL 8.0.17. O suporte para esse operador será removido em uma versão futura do MySQL. As aplicações devem ser ajustadas para usar o operador SQL padrão `AND`.

- `OR`, `||`

  OU lógico. Quando ambos os operadores são não `NULL`, o resultado é `1` se algum dos operadores for não nulo, e `0` caso contrário. Com um operador `NULL`, o resultado é `1` se o outro operador for não nulo, e `NULL` caso contrário. Se ambos os operadores forem `NULL`, o resultado é `NULL`.

  ```
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

  Se o modo SQL `PIPES_AS_CONCAT` estiver ativado, `||` indica o operador de concatenação de strings padrão do SQL (como `CONCAT()`).

  O operador `||`, operador não padrão, é uma extensão do MySQL. A partir do MySQL 8.0.17, este operador é desaconselhado; espera-se que o suporte a ele seja removido em uma versão futura do MySQL. As aplicações devem ser ajustadas para usar o operador SQL padrão `OR`. Exceção: A depreciação não se aplica se `PIPES_AS_CONCAT` estiver habilitado, porque, nesse caso, `||` significa concatenação de strings.

- `XOR`

  XOR lógico. Retorna `NULL` se qualquer dos operandos for `NULL`. Para operandos que não são `NULL`, avalia-se a `1` se houver um número ímpar de operandos não nulos, caso contrário, é retornado `0`.

  ```
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
