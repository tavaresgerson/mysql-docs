### 14.4.4 Operadores de Atribuição

**Tabela 14.6 Operadores de Atribuição**

<table><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Nome</th> <th>Descrição</th> </tr></thead><tbody><tr><td><code>:=</code></td> <td> Atribuir um valor </td> </tr><tr><td><code>=</code></td> <td> Atribuir um valor (como parte de uma instrução <code>SET</code>, ou como parte da cláusula <code>SET</code> em uma instrução <code>UPDATE</code>) </td> </tr></tbody></table>

*  `:=`

  Operador de atribuição. Faz com que a variável do lado esquerdo do operador assuma o valor do lado direito. O valor do lado direito pode ser um valor literal, outra variável que armazena um valor ou qualquer expressão legal que produza um valor escalar, incluindo o resultado de uma consulta (desde que esse valor seja um valor escalar). Você pode realizar múltiplas atribuições na mesma instrução `SET`. Você pode realizar múltiplas atribuições na mesma instrução.

  Ao contrário de `=`, o operador `:=` nunca é interpretado como um operador de comparação. Isso significa que você pode usar `:=` em qualquer instrução SQL válida (não apenas em instruções `SET`) para atribuir um valor a uma variável.

  ```
  mysql> SELECT @var1, @var2;
          -> NULL, NULL
  mysql> SELECT @var1 := 1, @var2;
          -> 1, NULL
  mysql> SELECT @var1, @var2;
          -> 1, NULL
  mysql> SELECT @var1, @var2 := @var1;
          -> 1, 1
  mysql> SELECT @var1, @var2;
          -> 1, 1

  mysql> SELECT @var1:=COUNT(*) FROM t1;
          -> 4
  mysql> SELECT @var1;
          -> 4
  ```

  Você pode fazer atribuições de valor usando `:=` em outras instruções além de `SELECT`, como mostrado aqui:

  ```
  mysql> SELECT @var1;
          -> 4
  mysql> SELECT * FROM t1;
          -> 1, 3, 5, 7

  mysql> UPDATE t1 SET c1 = 2 WHERE c1 = @var1:= 1;
  Query OK, 1 row affected (0.00 sec)
  Rows matched: 1  Changed: 1  Warnings: 0

  mysql> SELECT @var1;
          -> 1
  mysql> SELECT * FROM t1;
          -> 2, 3, 5, 7
  ```

  Embora seja também possível tanto definir quanto ler o valor da mesma variável em uma única instrução SQL usando o operador `:=`, isso não é recomendado. A Seção 11.4, “Variáveis Definidas pelo Usuário”, explica por que você deve evitar fazer isso.
*  `=`

  Este operador é usado para realizar atribuições de valor em dois casos, descritos nos dois parágrafos seguintes.

Dentro de uma declaração `SET`, `=` é tratado como um operador de atribuição que faz com que a variável do usuário à esquerda do operador assuma o valor à sua direita. (Em outras palavras, quando usado em uma declaração `SET`, `=` é tratado de forma idêntica a `:=`.) O valor à direita pode ser um valor literal, outra variável que armazena um valor ou qualquer expressão legal que produza um valor escalar, incluindo o resultado de uma consulta (desde que esse valor seja um valor escalar). Você pode realizar múltiplas atribuições na mesma declaração `SET`.

Na cláusula `SET` de uma declaração `UPDATE`, `=` também atua como um operador de atribuição; nesse caso, no entanto, faz com que a coluna nomeada à esquerda do operador assuma o valor dado à direita, desde que quaisquer condições `WHERE` que fazem parte da `UPDATE` sejam atendidas. Você pode fazer múltiplas atribuições na mesma cláusula `SET` de uma declaração `UPDATE`.

Em qualquer outro contexto, `=` é tratado como um operador de comparação.

```
  mysql> SELECT @var1, @var2;
          -> NULL, NULL
  mysql> SELECT @var1 := 1, @var2;
          -> 1, NULL
  mysql> SELECT @var1, @var2;
          -> 1, NULL
  mysql> SELECT @var1, @var2 := @var1;
          -> 1, 1
  mysql> SELECT @var1, @var2;
          -> 1, 1
  ```

Para mais informações, consulte a Seção 15.7.6.1, “Sintaxe SET para Atribuição de Variáveis”, a Seção 15.2.17, “Declaração UPDATE” e a Seção 15.2.15, “Subconsultas”.