### 14.4.3 Operadores Lógicos

**Tabela 14.5 Operadores Lógicos**

<table frame="box" rules="all" summary="Uma referência que lista os operadores lógicos.">
<col style="width: 28%"/><col style="width: 71%"/>
<thead><tr><th>Nome</th> <th>Descrição</th> </tr></thead><tbody><tr><td><a class="link" href="operadores-lógicos.html#operador_e"><code class="literal">E</code>, <code class="literal">&amp;&amp;</code></a></td> <td> E lógico</td> </tr><tr><td><a class="link" href="operadores-lógicos.html#operador_nao"><code class="literal">NÃO</code>, <code class="literal">!</code></a></td> <td> Nega o valor</td> </tr><tr><td><a class="link" href="operadores-lógicos.html#operador_ou"><code class="literal">OU</code>, <code class="literal">||</code></a></td> <td> E lógico OU</td> </tr><tr><td><a class="link" href="operadores-lógicos.html#operador_xor"><code class="literal">XOR</code></a></td> <td> E lógico XOR</td> </tr></tbody></table>

No SQL, todos os operadores lógicos avaliam como `TRUE`, `FALSE` ou `NULL` (`DESCONHECIDO`). No MySQL, esses são implementados como 1 (`TRUE`), 0 (`FALSE`) e `NULL`. A maior parte disso é comum a diferentes servidores de banco de dados SQL, embora alguns servidores possam retornar qualquer valor não nulo para `TRUE`.

O MySQL avalia qualquer valor não nulo como `TRUE`. Por exemplo, as seguintes declarações todas avaliam como `TRUE`:

```
mysql> SELECT 10 IS TRUE;
-> 1
mysql> SELECT -10 IS TRUE;
-> 1
mysql> SELECT 'string' IS NOT NULL;
-> 1
```

* `NOT`, `!`

  E lógico NÃO. Avalia como `1` se o operando for `0`, como `0` se o operando for não nulo e `NOT NULL` retorna `NULL`.

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

O operador `!` é uma extensão não padrão e está desatualizada; espere que ele seja removido em uma versão futura do MySQL. As aplicações, quando necessário, devem ser ajustadas para usar o operador `NOT` padrão do SQL.

* `AND`, `&&`

  E lógico AND. Avalia `1` se todos os operadores forem não nulos e não `NULL`, para `0` se um ou mais operadores forem `0`, caso contrário, `NULL` é retornado.

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

  O operador `&&`, é uma extensão não padrão e está desatualizada; espere que o suporte a ele seja removido em uma versão futura do MySQL. As aplicações, quando necessário, devem ser ajustadas para usar o operador `AND` padrão do SQL.

* `OR`, `||`

  E lógico OR. Quando ambos os operadores são não `NULL`, o resultado é `1` se algum operador for não nulo, e `0` caso contrário. Com um operador `NULL`, o resultado é `1` se o outro operador for não nulo, e `NULL` caso contrário. Se ambos os operadores forem `NULL`, o resultado é `NULL`.

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

  Se o modo SQL `PIPES_AS_CONCAT` estiver habilitado, `||` significa o operador de concatenação de strings padrão do SQL (como `CONCAT()`).

  O operador `||`, é uma extensão não padrão, e está desatualizada; espere que o suporte a ele seja removido em uma versão futura do MySQL. As aplicações, quando necessário, devem ser ajustadas para usar o operador `OR` padrão do SQL. Exceção: A depreciação não se aplica se `PIPES_AS_CONCAT` estiver habilitado, porque, nesse caso, `||` significa concatenação de strings.

* `XOR`

  E lógico XOR. Retorna `NULL` se um dos operadores for `NULL`. Para operadores não `NULL`, avalia `1` se um número ímpar de operadores for não nulo, caso contrário, `0` é retornado.

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

  `a XOR b` é matematicamente igual a `(a AND (NOT b)) OR ((NOT a) e b)`.