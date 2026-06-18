## 11.4 Variáveis Definidas pelo Usuário

Você pode armazenar um valor em uma variável definida pelo usuário em uma única instrução e referenciá-lo mais tarde em outra instrução. Isso permite que você passe valores de uma instrução para outra.

As variáveis de usuário são escritas como `@var_name`, onde o nome da variável `var_name` consiste em caracteres alfanuméricos, `.`, `_` e `$`. O nome de uma variável de usuário pode conter outros caracteres se você a citar como uma string ou identificador (por exemplo, `@'my-var'`, `@"my-var"` ou `` @`my-var` ``).

As variáveis definidas pelo usuário são específicas da sessão. Uma variável de usuário definida por um cliente não pode ser vista ou usada por outros clientes. (Exceção: um usuário com acesso à tabela do Schema de Desempenho `user_variables_by_thread` pode ver todas as variáveis de usuário para todas as sessões.) Todas as variáveis de uma sessão de um cliente específico são liberadas automaticamente quando esse cliente sai.

Os nomes de variáveis do usuário não são sensíveis ao maiúsculas e minúsculas. Os nomes têm um comprimento máximo de 64 caracteres.

Uma maneira de definir uma variável definida pelo usuário é emitindo uma declaração `SET`:

```
SET @var_name = expr [, @var_name = expr] ...
```

Para `SET`, pode ser usado o operador de atribuição `=` ou `:=`.

As variáveis de usuário podem receber um valor de um conjunto limitado de tipos de dados: inteiro, decimal, ponto flutuante, string binária ou não binária ou valor `NULL`. A atribuição de valores decimais e reais não preserva a precisão ou a escala do valor. Um valor de um tipo diferente dos tipos permitidos é convertido para um tipo permitido. Por exemplo, um valor com um tipo de dados temporal ou espacial é convertido para uma string binária. Um valor com o tipo de dados `JSON` é convertido para uma string com um conjunto de caracteres de `utf8mb4` e uma ordenação de `utf8mb4_bin`.

Se uma variável de usuário receber um valor de cadeia de caracteres não binária (caractere), ela terá o mesmo conjunto de caracteres e ordenação que a cadeia de caracteres. A coercibilidade das variáveis de usuário é implícita (isso é a mesma coercibilidade que para os valores das colunas da tabela).

Valores hexadecimais ou de bits atribuídos a variáveis de usuário são tratados como strings binárias. Para atribuir um valor hexadecimal ou de bits como um número a uma variável de usuário, use-o em um contexto numérico. Por exemplo, adicione 0 ou use `CAST(... AS UNSIGNED)`:

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

Se o valor de uma variável de usuário for selecionado em um conjunto de resultados, ele será retornado ao cliente como uma string.

Se você se referir a uma variável que não foi inicializada, ela terá o valor `NULL` e um tipo de string.

A partir do MySQL 8.0.22, uma referência a uma variável de usuário em uma instrução preparada tem seu tipo determinado quando a instrução é preparada pela primeira vez e mantém esse tipo cada vez que a instrução é executada posteriormente. Da mesma forma, o tipo de uma variável de usuário usada em uma instrução dentro de um procedimento armazenado é determinado pela primeira vez que o procedimento armazenado é invocado e mantém esse tipo em cada invocação subsequente.

As variáveis de usuário podem ser usadas na maioria dos contextos em que as expressões são permitidas. Isso atualmente não inclui contextos que exigem explicitamente um valor literal, como na cláusula `LIMIT` de uma declaração `SELECT` ou na cláusula `IGNORE N LINES` de uma declaração `LOAD DATA`.

Versões anteriores do MySQL permitiam atribuir um valor a uma variável de usuário em instruções diferentes de `SET`. Essa funcionalidade é suportada no MySQL 8.0 para compatibilidade reversa, mas está sujeita à remoção em uma futura versão do MySQL.

Ao fazer uma atribuição dessa maneira, você deve usar `:=` como o operador de atribuição; `=` é tratado como o operador de comparação em declarações que não sejam `SET`.

A ordem de avaliação para expressões que envolvem variáveis do usuário é indefinida. Por exemplo, não há garantia de que `SELECT @a, @a:=@a+1` avalie `@a` primeiro e, em seguida, realize a atribuição.

Além disso, o tipo de resultado padrão de uma variável é baseado em seu tipo no início da declaração. Isso pode ter efeitos não intencionais se uma variável tiver um valor de um tipo no início de uma declaração na qual também é atribuído um novo valor de um tipo diferente.

Para evitar problemas com esse comportamento, não atribua um valor à mesma variável e não leia o valor dela em uma única instrução, ou então defina a variável para `0`, `0.0` ou `''` para definir seu tipo antes de usá-la.

`HAVING`, `GROUP BY` e `ORDER BY`, quando se refere a uma variável que recebe um valor na lista de expressões de seleção, não funcionam como esperado porque a expressão é avaliada no cliente e, portanto, pode usar valores de coluna desatualizados de uma linha anterior.

As variáveis de usuário são destinadas a fornecer valores de dados. Elas não podem ser usadas diretamente em uma instrução SQL como um identificador ou como parte de um identificador, como em contextos em que se espera um nome de tabela ou banco de dados, ou como uma palavra reservada, como `SELECT`. Isso é verdadeiro mesmo que a variável esteja entre aspas, como mostrado no exemplo a seguir:

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

Uma exceção a este princípio, de que as variáveis de usuário não podem ser usadas para fornecer identificadores, é quando você está construindo uma string para uso como uma instrução preparada para ser executada mais tarde. Nesse caso, as variáveis de usuário podem ser usadas para fornecer qualquer parte da instrução. O exemplo a seguir ilustra como isso pode ser feito:

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

Consulte a Seção 15.5, “Declarações Preparadas”, para obter mais informações.

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
