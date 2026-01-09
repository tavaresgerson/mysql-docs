#### 27.3.6.10 API de Rotinas Armazenadas

Duas funções, listadas aqui, fornecem objetos de funções JavaScript [`Function`](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Function) que refletem rotinas armazenadas do MySQL:

* `getFunction()`: Obtém uma instância de `Function` dada o nome de uma função armazenada.

* `getProcedure()`: Obtém uma instância de `Function` dada o nome de um procedimento armazenado.

Use o método `close()` para fechar o recurso associado à rotina armazenada. Um erro é lançado se a rotina, após ser fechada, for chamada novamente ou se seu método `close()` for chamado novamente.

O exemplo a seguir cria duas funções armazenadas `getArea()` e `getDiag()`, e depois cria e executa um procedimento armazenado JavaScript procRect que usa essas funções, instanciando-as e executando-as por meio de objetos `Function`.

```
mysql> CREATE FUNCTION getArea(w INT, h INT)
    -> RETURNS INT DETERMINISTIC
    -> RETURN w * h;
Query OK, 0 rows affected (0.01 sec)

mysql> CREATE FUNCTION getDiag(w INT, h INT)
    ->   RETURNS FLOAT DETERMINISTIC
    ->   RETURN Math.sqrt(Math.pow(w, 2) + Math.pow(h, 2));
Query OK, 0 rows affected (0.01 sec)

mysql> CREATE PROCEDURE procRect(IN x INT, IN y INT) LANGUAGE JAVASCRIPT
    -> AS $$
    $>   console.clear()
    $>
    $>   let s = session.getDefaultSchema()
    $>   let f = s.getFunction("getArea")
    $>   let g = s.getFunction("getDiag")
    $>
    $>   let a = x
    $>   let b = y
    $>
    $>   console.log (
    $>                 "Width: " + a + ", Height: " + b + "; Area: " +
    $>                 f(a,b) + "; Diagonal: " + g(a,b)
    $>               )
    $>
    $>   f.close()
    $>   g.close()
    $> $$;
Query OK, 0 rows affected (0.01 sec)

mysql> CALL procRect(5, 10);
Query OK, 0 rows affected (0.03 sec)

mysql> SELECT mle_session_state("stdout")\G
*************************** 1. row ***************************
mle_session_state("stdout"): Width: 5, Height: 10; Area: 50; Diagonal: 11.180339813232422

1 row in set (0.00 sec)

mysql> CALL procRect(2, 25);
Query OK, 0 rows affected (0.02 sec)

mysql> SELECT mle_session_state("stdout")\G
*************************** 1. row ***************************
mle_session_state("stdout"): Width: 2, Height: 25; Area: 50; Diagonal: 25.079872131347656

1 row in set (0.00 sec)
```

Para funções armazenadas, os argumentos são simplesmente passados por valor, como mostrado nos exemplos mostrados com `getDiag()` e `getArea()`. Para procedimentos armazenados, o tratamento de argumentos é o seguinte:

* Parâmetro `IN`: Os valores dos parâmetros são passados diretamente.

* Parâmetro `OUT` ou `INOUT`: É necessário criar um marcador, usando a função `mysql.arg()`, no qual armazenar o valor de saída para o parâmetro. `my.arg()` é discutido nos próximos parágrafos desta seção.

**mysql.arg().** Esta função é sempre chamada como um método do objeto global `mysql`. Ela cria um objeto `Argument`, que pode ser atribuído um valor na criação ou por uma chamada de procedimento. Depois, o valor pode ser recuperado como `argument.val`. Isso é mostrado no exemplo seguinte, onde instâncias de argumento `a` e `b` são criadas em `use_my_proc()` para atuar como marcadores para `y` e `z` em `my_proc()`:

```
mysql> CREATE PROCEDURE my_proc(
    ->   IN x INT,
    ->   OUT y VARCHAR(20),
    ->   INOUT z TEXT
    -> )
    -> LANGUAGE JAVASCRIPT
    -> AS $$
    $>     y = "Hello world " + x
    $>     z += "Hello again JS"
    $> $$;
Query OK, 0 rows affected (0.04 sec)

mysql> CREATE PROCEDURE use_my_proc() LANGUAGE JAVASCRIPT
    -> AS $$
    $>     console.clear()
    $>
    $>     let s = session.getDefaultSchema()
    $>     let p = s.getProcedure("my_proc")
    $>
    $>     let a = mysql.arg()
    $>     let b = mysql.arg("World ")
    $>
    $>     p(42, a, b)
    $>
    $>     console.log(a.val)
    $>     console.log(b.val)
    $>
    $>     p.close()
    $> $$;
Query OK, 0 rows affected (0.01 sec)

mysql> CALL use_my_proc();
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT mle_session_state("stdout")\G
*************************** 1. row ***************************
mle_session_state("stdout"): Hello world 42
World Hello again JS

1 row in set (0.00 sec)
```

Nota

Um `Argument` pode ser instanciado apenas chamando `mysql.arg()`, e acessado apenas através de sua propriedade `val`. De outra forma, ele é inacessível.

Os equivalentes entre os tipos de parâmetros `OUT` ou `INOUT` do MySQL e os tipos do JavaScript são mostrados na tabela a seguir:

<table border="1" class="informaltable" summary="Texto descritivo">
<colgroup><col/><col/><col/></colgroup>
<thead><tr><th>Tipo de MySQL</th><th>Tipo de JavaScript</th><th>Notas</th></tr></thead>
<tbody><tr><td><code>NULL</code></td><td><code>null</code></td><td>-</td></tr>
<tr><td><a class="link" href="integer-types.html" title="13.1.2 Tipos de Inteiros (Valor Exato) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"><code>BIGINT</code></a></td><td><code>Número</code>, <code>String</code>, <code>BigInt</code></td><td>Depende da opção <code>integerType</code> do método <a class="link" href="srjsapi-session.html#srjsapi-session-sql"><code>session.sql()</code></a></td></tr>
<tr><td><a class="link" href="fixed-point-types.html" title="13.1.3 Tipos de Ponto Fixo (Valor Exato) - DECIMAL, NUMERIC"><code>DECIMAL</code></a></td><td>-</td><td>Erro: Tipo não suportado</td></tr>
<tr><td><a class="link" href="floating-point-types.html" title="13.1.4 Tipos de Ponto Flutuante (Valor Aproximado) - FLOAT, DOUBLE"><code>DOUBLE</code></a></td><td><code>Número</code></td><td>-</td></tr>
<tr><td>String binária (<a class="link" href="binary-varbinary.html" title="13.3.3 Os Tipos BINARY e VARBINARY"><code>BINARY</code></a>, <a class="link" href="blob.html" title="13.3.4 Os Tipos BLOB e TEXT"><code>BLOB</code></a>)</td><td><code>Uint8Array</code></td><td>-</td></tr>
<tr><td>String não binária (<a class="link" href="blob.html" title="13.3.4 Os Tipos BLOB e TEXT"><code>TEXT</code></a>)</td><td><code>String</code></td><td>-</td></tr>
<tr><td><a class="link" href="vector.html" title="13.3.5 O Tipo VECTOR"><code>VECTOR</code></a></td><td><code>Float32Array</code></td><td>-</td></tr>
<tr><td><a class="link" href="json.html" title="13.5 O Tipo de Dados JSON"><code>JSON</code></a></td><td><code>Object</code></td><td>-</td></tr>
<tr><td><a class="link" href="datetime.html" title="13.2.2 Os Tipos DATE, DATETIME e TIMESTAMP"><code>DATE</code></a>, <a class="link" href="datetime.html" title="13.2.2 Os Tipos DATE, DATETIME e TIMESTAMP"><code>DATETIME</code></a>, <a class="link" href="datetime.html" title="13.2.2 Os Tipos DATE, DATETIME e TIMESTAMP"><code>TIMESTAMP</code></a></td><td><code>Date</code></td><td>-</td></tr>
<tr><td><a class="link" href="enum.html" title="13.3.6 O Tipo ENUM"><code>ENUM</code></a></td><td><code>String</code></td><td>-</td></tr>
<tr><td><a class="link" href="set.html" title="13.3.7 O Tipo SET"><code>SET</code></a></td><td><code>Set</code> (<code>String</code>)</td><td>O <code>Set</code> JavaScript pode ser convertido em uma string separada por vírgula</td></tr></tbody></table>