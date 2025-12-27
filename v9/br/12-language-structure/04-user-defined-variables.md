## 11.4 Variáveis Definidas pelo Usuário

Você pode armazenar um valor em uma variável definida pelo usuário em uma única instrução e referenciá-lo mais tarde em outra instrução. Isso permite que você passe valores de uma instrução para outra.

As variáveis de usuário são escritas como `@var_name`, onde o nome da variável *`var_name`* consiste em caracteres alfanuméricos, `.`, `_` e `$`. O nome de uma variável de usuário pode conter outros caracteres se você a citar como uma string ou identificador (por exemplo, `@'minha-var'`, `@"minha-var"`, ou `` @`minha-var` ``).

As variáveis definidas pelo usuário são específicas da sessão. Uma variável de usuário definida por um cliente não pode ser vista ou usada por outros clientes. (Exceção: Um usuário com acesso à tabela `user_variables_by_thread` do Schema de Desempenho pode ver todas as variáveis de usuário para todas as sessões.) Todas as variáveis para uma sessão de um cliente específico são liberadas automaticamente quando esse cliente sai.

Os nomes das variáveis de usuário não são case-sensitive. Os nomes têm um comprimento máximo de 64 caracteres.

Uma maneira de definir uma variável definida pelo usuário é emitindo uma instrução `SET`:

```
SET @var_name = expr [, @var_name = expr] ...
```

Para `SET`, pode-se usar `=` ou `:=` como o operador de atribuição.

As variáveis de usuário podem ser atribuídas um valor de um conjunto limitado de tipos de dados: inteiro, decimal, ponto flutuante, string binária ou não binária, ou valor `NULL`. A atribuição de valores decimais e reais não preserva a precisão ou escala do valor. Um valor de um tipo diferente dos tipos permitidos é convertido para um tipo permitido. Por exemplo, um valor com um tipo de dados temporal ou espacial é convertido para uma string binária. Um valor com o tipo de dados `JSON` é convertido para uma string com um conjunto de caracteres de `utf8mb4` e uma ordenação de `utf8mb4_bin`.

Se uma variável de usuário for atribuída um valor de cadeia de caracteres não binária (caractere), ela terá o mesmo conjunto de caracteres e ordenação que a cadeia de caracteres. A coercibilidade das variáveis de usuário é implícita. (Essa é a mesma coercibilidade que para os valores de colunas de tabela.)

Valores hexadecimais ou de bits atribuídos a variáveis de usuário são tratados como strings binárias. Para atribuir um valor hexadecimal ou de bits como um número a uma variável de usuário, use-o em um contexto numérico. Por exemplo, adicione 0 ou use `CAST(... COMO UNSIGNED)`:

```
mysql> SET @v1 = X'41';
mysql> SET @v2 = X'41'+0;
mysql> SET @v3 = CAST(X'41' AS UNSIGNED);
mysql> SELECT @v1, @v2, @v3;
+------+------+------+
| @v1  | @v2  | @v3  |
+------+------+------+
| A    |   65 |   65 |
+------+------+------+
mysql> SET @v1 = b'1000001';
mysql> SET @v2 = b'1000001'+0;
mysql> SET @v3 = CAST(b'1000001' AS UNSIGNED);
mysql> SELECT @v1, @v2, @v3;
+------+------+------+
| @v1  | @v2  | @v3  |
+------+------+------+
| A    |   65 |   65 |
+------+------+------+
```

Se o valor de uma variável de usuário for selecionado em um conjunto de resultados, ele é retornado ao cliente como uma string.

Se você se referir a uma variável que não foi inicializada, ela terá um valor de `NULL` e um tipo de string.

Uma referência a uma variável de usuário em uma instrução preparada tem seu tipo determinado quando a instrução é preparada pela primeira vez e retém esse tipo cada vez que a instrução é executada posteriormente. Da mesma forma, o tipo de uma variável de usuário empregada em uma instrução dentro de um procedimento armazenado é determinado pela primeira vez que o procedimento armazenado é invocado e retém esse tipo com cada invocação subsequente.

Variáveis de usuário podem ser usadas na maioria dos contextos onde expressões são permitidas. Isso atualmente não inclui contextos que exigem explicitamente um valor literal, como na cláusula `LIMIT` de uma instrução `SELECT`, ou na cláusula `IGNORE N LINES` de uma instrução `LOAD DATA`.

Versões anteriores do MySQL possibilitaram atribuir um valor a uma variável de usuário em instruções além de `SET`. Essa funcionalidade é suportada no MySQL 9.5 para compatibilidade com versões anteriores, mas está sujeita à remoção em uma futura versão do MySQL.

Ao fazer uma atribuição dessa maneira, você deve usar `:=` como o operador de atribuição; `=` é tratado como o operador de comparação em instruções além de `SET`.

A ordem de avaliação de expressões que envolvem variáveis do usuário é indefinida. Por exemplo, não há garantia de que `SELECT @a, @a:=@a+1` avalie `@a` primeiro e, em seguida, realize a atribuição.

Além disso, o tipo de resultado padrão de uma variável é baseado em seu tipo no início da instrução. Isso pode ter efeitos indesejados se uma variável mantiver um valor de um tipo no início de uma instrução na qual também é atribuído um novo valor de um tipo diferente.

Para evitar problemas com esse comportamento, não atribua um valor a uma variável e leia o valor da mesma variável dentro de uma única instrução, ou defina a variável para `0`, `0.0` ou `''` para definir seu tipo antes de usá-la.

`HAVING`, `GROUP BY` e `ORDER BY`, ao se referirem a uma variável que recebe um valor na lista de expressões de seleção, não funcionam como esperado porque a expressão é avaliada no cliente e, portanto, pode usar valores de coluna desatualizados de uma linha anterior.

As variáveis do usuário são destinadas a fornecer valores de dados. Elas não podem ser usadas diretamente em uma instrução SQL como um identificador ou como parte de um identificador, como em contextos em que é esperado um nome de tabela ou banco de dados, ou como uma palavra reservada, como `SELECT`. Isso é verdadeiro mesmo que a variável seja citada, como mostrado no exemplo a seguir:

```
mysql> SELECT c1 FROM t;
+----+
| c1 |
+----+
|  0 |
+----+
|  1 |
+----+
2 rows in set (0.00 sec)

mysql> SET @col = "c1";
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT @col FROM t;
+------+
| @col |
+------+
| c1   |
+------+
1 row in set (0.00 sec)

mysql> SELECT `@col` FROM t;
ERROR 1054 (42S22): Unknown column '@col' in 'field list'

mysql> SET @col = "`c1`";
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT @col FROM t;
+------+
| @col |
+------+
| `c1` |
+------+
1 row in set (0.00 sec)
```

Uma exceção a esse princípio de que as variáveis do usuário não podem ser usadas para fornecer identificadores é quando você está construindo uma string para uso como uma instrução preparada para ser executada posteriormente. Nesse caso, as variáveis do usuário podem ser usadas para fornecer qualquer parte da instrução. O exemplo a seguir ilustra como isso pode ser feito:

```
mysql> SET @c = "c1";
Query OK, 0 rows affected (0.00 sec)

mysql> SET @s = CONCAT("SELECT ", @c, " FROM t");
Query OK, 0 rows affected (0.00 sec)

mysql> PREPARE stmt FROM @s;
Query OK, 0 rows affected (0.04 sec)
Statement prepared

mysql> EXECUTE stmt;
+----+
| c1 |
+----+
|  0 |
+----+
|  1 |
+----+
2 rows in set (0.00 sec)

mysql> DEALLOCATE PREPARE stmt;
Query OK, 0 rows affected (0.00 sec)
```

Consulte a Seção 15.5, “Instruções Preparadas”, para obter mais informações.

Uma técnica semelhante pode ser usada em programas de aplicação para construir instruções SQL usando variáveis de programa, como mostrado aqui usando PHP 5:

```
<?php
  $mysqli = new mysqli("localhost", "user", "pass", "test");

  if( mysqli_connect_errno() )
    die("Connection failed: %s\n", mysqli_connect_error());

  $col = "c1";

  $query = "SELECT $col FROM t";

  $result = $mysqli->query($query);

  while($row = $result->fetch_assoc())
  {
    echo "<p>" . $row["$col"] . "</p>\n";
  }

  $result->close();

  $mysqli->close();
?>
```

Montar uma instrução SQL dessa forma é, por vezes, conhecido como "SQL dinâmico".