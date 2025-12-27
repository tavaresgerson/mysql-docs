### 27.3.8 Uso de Bibliotecas JavaScript

Esta seção fornece informações e exemplos de uso de bibliotecas JavaScript em programas armazenados em JavaScript, conforme suportado pelo Motor Multilíngue (MLE) na Edição Empresarial do MySQL. (Veja a Seção 7.5.7, “Componente do Motor Multilíngue (MLE”)”).

Primeiro, criamos um banco de dados `jslib` e o tornamos o banco de dados atual, da seguinte forma:

```
mysql> CREATE DATABASE IF NOT EXISTS jslib;
Query OK, 0 rows affected (0.02 sec)

mysql> USE jslib;
Database changed
```

Usando as duas instruções `CREATE LIBRARY` mostradas aqui, criamos duas bibliotecas JavaScript, cada uma exportando uma função. Para ser importable, a função deve ser declarada com a palavra-chave `export`. (Isso é verdade para todos os valores JavaScript que você deseja importar em outra rotina; veja [*export*](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Reference/Statements/export), na documentação do Mozilla Developer para mais informações).

```
mysql> CREATE LIBRARY IF NOT EXISTS jslib.lib1 LANGUAGE JAVASCRIPT
    ->     AS $$
    $>       export function f(n) {
    $>         return n
    $>       }
    $>     $$;
Query OK, 0 rows affected (0.02 sec)

mysql> CREATE LIBRARY IF NOT EXISTS jslib.lib2 LANGUAGE JAVASCRIPT
    ->     AS $$
    $>       export function g(n) {
    $>         return n * 2
    $>       }
    $>     $$;
Query OK, 0 rows affected (0.00 sec)
```

Você pode opcionalmente declarar uma função dentro de uma biblioteca dada como `export default`. Neste caso, a função deve ser chamada pela rotina importadora como `libname.default()`.

Você pode obter informações gerais sobre bibliotecas JavaScript consultando a tabela Schema de Informações `LIBRARIES`; o Schema de Informações `ROUTINE_LIBRARIES` mostra as importações em rotinas armazenadas. As linhas correspondentes às bibliotecas `jslib.lib1` e `jslib.lib2` nessas duas tabelas são mostradas pelas seguintes consultas:

```
mysql> SELECT * FROM information_schema.LIBRARIES
    -> WHERE LIBRARY_SCHEMA='jslib'\G
*************************** 1. row ***************************
   LIBRARY_CATALOG: def
    LIBRARY_SCHEMA: jslib
      LIBRARY_NAME: lib1
LIBRARY_DEFINITION:
      export function f(n) {
        return n
      }

          LANGUAGE: JAVASCRIPT
           CREATED: 2024-12-16 09:20:26
      LAST_ALTERED: 2024-12-16 09:20:26
          SQL_MODE: ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,
NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION
           CREATOR: me@localhost
*************************** 2. row ***************************
   LIBRARY_CATALOG: def
    LIBRARY_SCHEMA: jslib
      LIBRARY_NAME: lib2
LIBRARY_DEFINITION:
      export function g(n) {
        return n * 2
      }

          LANGUAGE: JAVASCRIPT
           CREATED: 2024-12-16 09:20:26
      LAST_ALTERED: 2024-12-16 09:20:26
          SQL_MODE: ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,
NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION
           CREATOR: me@localhost
2 rows in set (0.00 sec)

mysql> SELECT * FROM information_schema.ROUTINE_LIBRARIES
    -> WHERE LIBRARY_SCHEMA='jslib'\G
*************************** 1. row ***************************
ROUTINE_CATALOG: def
 ROUTINE_SCHEMA: jslib
   ROUTINE_NAME: foo
   ROUTINE_TYPE: FUNCTION
LIBRARY_CATALOG: def
 LIBRARY_SCHEMA: jslib
   LIBRARY_NAME: lib1
LIBRARY_VERSION: NULL
*************************** 2. row ***************************
ROUTINE_CATALOG: def
 ROUTINE_SCHEMA: jslib
   ROUTINE_NAME: foo
   ROUTINE_TYPE: FUNCTION
LIBRARY_CATALOG: def
 LIBRARY_SCHEMA: jslib
   LIBRARY_NAME: lib2
LIBRARY_VERSION: NULL
2 rows in set (0.00 sec)
```

A segunda consulta responde à pergunta, “Quais rotinas armazenadas importam de `jslib` e o que importam?”

As tabelas `LIBRARIES` e `ROUTINE_LIBRARIES` são fornecidas pelo componente MLE e não estão presentes se o componente não estiver instalado.

Se você tiver os privilégios necessários, também pode visualizar o código JavaScript de uma biblioteca usando a instrução `SHOW CREATE LIBRARY`. Consulte a descrição dessa instrução para obter mais informações e exemplos.

Você também pode usar `SHOW LIBRARY STATUS` para obter informações básicas sobre uma ou mais bibliotecas JavaScript, incluindo nome, banco de dados, criador (definidor) e datas de criação e modificação mais recente. Consulte a Seção 15.7.7.25, “Instrução SHOW LIBRARY STATUS”, para obter mais informações e exemplos.

Para criar uma função JavaScript que use as duas bibliotecas, inclua a palavra-chave `USING` junto com uma lista de bibliotecas a serem importadas como parte de `CREATE FUNCTION`, assim:

```
mysql> CREATE FUNCTION foo(n INTEGER) RETURNS INTEGER LANGUAGE JAVASCRIPT
    ->         USING (jslib.lib1 AS mylib, jslib.lib2 AS yourlib)
    ->         AS $$
    $>           return mylib.f(n) + yourlib.g(n)
    $>         $$;
Query OK, 0 rows affected (0.00 sec)
```

O alias (`palavra-chave AS` e cláusula) é geralmente opcional, mas se especificado, você deve usá-lo para o nome da biblioteca ao incluir funções dela em seus próprios programas armazenados. Um identificador de biblioteca—o nome, ou seu alias, se houver um, excluindo o nome do banco de dados—deve ser único dentro de uma função armazenada JavaScript dada. Você pode usar `AS` com `CREATE FUNCTION` para evitar colisões de nomes entre bibliotecas. Por exemplo, para incluir uma biblioteca chamada `ourlib` no banco de dados atual, juntamente com uma que tem o mesmo nome, mas reside no banco de dados `other`, você poderia usar a instrução mostrada aqui:

```
CREATE FUNCTION myfunc(x INTEGER) RETURNS INTEGER LANGUAGE JAVASCRIPT
    USING (ourlib, other.ourlib AS theirlib)
...
;
```

No caso mostrado, há duas bibliotecas com o mesmo nome; para evitar quaisquer conflitos, é necessário usar um alias para pelo menos uma delas.

Se uma (ou mais) das bibliotecas incluídas não existir, ou se o usuário não tiver os privilégios necessários para acessá-la, a instrução `CREATE FUNCTION` que a referencia é rejeitada com um erro.

As referências a uma biblioteca importada dentro de uma rotina armazenada em JavaScript devem corresponder ao nome da biblioteca conforme declarado. Note que o nome utilizado na cláusula `USING` não precisa ter a mesma formatação em maiúsculas e minúsculas; por exemplo, `USING (MY_LIB)` pode ser usado para importar uma biblioteca chamada `my_lib`, embora as referências à biblioteca dentro do corpo da rotina armazenada devam usar `my_lib`.

Você pode verificar se a função foi criada verificando a tabela do Schema de Informações `ROUTINES`, com uma consulta semelhante à mostrada aqui:

```
mysql> SELECT
    ->   SPECIFIC_NAME, ROUTINE_NAME, ROUTINE_SCHEMA,
    ->   DATA_TYPE, ROUTINE_DEFINITION
    -> FROM information_schema.ROUTINES
    -> WHERE ROUTINE_NAME='foo'\G
*************************** 1. row ***************************
     SPECIFIC_NAME: foo
      ROUTINE_NAME: foo
    ROUTINE_SCHEMA: jslib
         DATA_TYPE: int
ROUTINE_DEFINITION:
      return mylib.f(n) + otherlib.g(n)
1 row in set (0.00 sec)
```

Podemos invocar a função recém-criada da mesma forma que invocaríamos qualquer outra função armazenada.

```
mysql> SELECT foo(2), foo(3), foo(-10), foo(1.5), foo(1.2);
+--------+--------+----------+----------+----------+
| foo(2) | foo(3) | foo(-10) | foo(1.5) | foo(1.2) |
+--------+--------+----------+----------+----------+
|      6 |      9 |      -30 |        6 |        3 |
+--------+--------+----------+----------+----------+
1 row in set (0.00 sec)
```

Como o parâmetro de entrada é do tipo `INTEGER`, a arredondagem, como se estivesse usando `Math.round()`, ocorre antes que o valor seja usado em quaisquer cálculos, 1,5 é avaliado como `2 + (2 * 2) = 6`, e 1,2 como `1 + (2 * 1) = 3`.

A sintaxe do JavaScript é verificada no momento da criação da biblioteca, como mostrado aqui:

```
mysql> CREATE LIBRARY IF NOT EXISTS jslib.lib3 LANGUAGE JAVASCRIPT
    ->     AS $$
    $>       export function f(n) {
    $>         return n $ 2
    $>       }
    $>     $$;
ERROR 6113 (HY000): JavaScript> SyntaxError: lib3:3:17 Expected ; but found $
        return n $ 2
                 ^
```

A instrução `CREATE LIBRARY` é executada com sucesso após a correção do erro tipográfico, como mostrado aqui:

```
mysql> CREATE LIBRARY IF NOT EXISTS jslib.lib3 LANGUAGE JAVASCRIPT
    ->     AS $$
    $>       export function h(n) {
    $>         return n - 2
    $>       }
    $>     $$;
Query OK, 0 rows affected (0.01 sec)
```

Também é possível realizar importações dinâmicas, que não precisam ser especificadas com uma cláusula `USING`. Você deve estar ciente de que uma importação dinâmica retorna uma [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise); use [`await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await) para obter a biblioteca importada. Geralmente, é recomendado que você use `await` para esperar por qualquer `Promise` criada em seu código.

Você pode usar `await` no nível superior de funções armazenadas e procedimentos armazenados, como mostrado aqui:

```
mysql> CREATE DATABASE db1;
Query OK, 0 rows affected (0.01 sec)

mysql> CREATE LIBRARY db1.lib1 LANGUAGE JAVASCRIPT
    -> AS $$
    $>   export function myAdd(x, y) {returns x + y}
    $> $$;
Query OK, 0 rows affected (0.01 sec)

mysql> CREATE FUNCTION use_dynamic_import() RETURNS INT LANGUAGE JAVASCRIPT
    -> AS $$
    $>   let m = await import("/db1/lib1")
    $>   return m.myAdd(1, 2)
    $> $$;
Query OK, 0 rows affected (0.01 sec)

mysql> SELECT use_dynamic_import();
+-----------------------+
| uses_dynamic_import() |
+-----------------------+
|                     3 |
+-----------------------+
1 row in set (0.00 sec)
```

O uso de `await` faz com que a `Promise` retornada pelo `import()` seja resolvida. A resolução pode ser pendente, cumprida ou rejeitada; uma `Promise` "resolvida" ou "sentada" é aquela que não está mais pendente e pode ser cumprida ou rejeitada.

O `import()` recebe o caminho da biblioteca importada, que deve ser uma string do formato `"/nome_do_banco/nome_da_biblioteca"`; ele retorna uma `Promise` de um módulo ECMAScript.

O exemplo seguinte demonstra como você pode determinar qual das várias bibliotecas carregar em tempo de execução. Primeiro, criamos duas bibliotecas — cada uma das quais exporta várias funções e objetos, e tem uma exportação padrão — assim:

```
mysql> CREATE LIBRARY db1.lib_rectangle LANGUAGE JAVASCRIPT
    -> AS $$
    $>  export class Rectangle {
    $>    constructor(height, width) {
    $>      this.height = height
    $>      this.width = width
    $>    }
    $>    print() {
    $>      return "Rectangle of size " + this.height + " by " + this.width
    $>    }
    $>  }
    $>  export function area(x) {return x.height * x.width}
    $>  const r = new Rectangle(2, 3)
    $>  export default r
    $> $$;
Query OK, 0 rows affected (0.01 sec)

mysql> CREATE LIBRARY db1.lib_square LANGUAGE JAVASCRIPT
    -> AS $$
    $>  export class Square {
    $>    constructor(a) {
    $>      this.a = a
    $>    }
    $>    print() {return "Square of size " + this.a}
    $>  }
    $>  export function area(x) {return x.a * x.a}
    $>  const s = new Square(2)
    $>  export default s
    $> $$;
Query OK, 0 rows affected (0.01 sec)
```

A função `printObject()` determina a biblioteca a ser importada em tempo de execução, com base no valor passado para ela, como mostrado aqui:

```
mysql> CREATE FUNCTION printObject(object_type VARCHAR(16)) RETURNS TEXT LANGUAGE JAVASCRIPT
    -> AS $$
    $>  let module = await import(`/db1/lib_${object_type}`)
    $>  // both libraries have default exports with print methods
    $>  return module.default.print()
    $> $$;
Query OK, 0 rows affected (0.01 sec)

mysql> SELECT printObject("square");
+-----------------------+
| printObject("square") |
+-----------------------+
|      Square of size 2 |
+-----------------------+
1 row in set (0.00 sec)

mysql> SELECT printObject("rectangle");
+--------------------------+
| printObject("rectangle") |
+--------------------------+
| Rectangle of size 2 by 3 |
+--------------------------+
1 row in set (0.00 sec)
```

Além disso, o objeto namespace retornado após aguardar a `Promise` pode ser destruído como qualquer outro objeto; as exportações padrão e outras podem ser facilmente renomeadas para uso dentro do programa armazenado, como mostrado aqui:

```
mysql> CREATE FUNCTION computeRectangle() RETURNS INT LANGUAGE JAVASCRIPT
    -> AS $$
    $>  let {default: myRectangle, area: area} = await import(`/db1/lib_rectangle`)
    $>  return area(myRectangle)
    $> $$;
Query OK, 0 rows affected (0.01 sec)

mysql> SELECT computeRectangle();
+--------------------+
| computeRectangle() |
+--------------------+
|                  6 |
+--------------------+
1 row in set (0.00 sec)
```

É possível importar bibliotecas ou partes delas para outras bibliotecas, como mostrado neste exemplo onde a função `foo()` é importada da biblioteca `mylib` para a biblioteca `theirlib` e usada em uma função `bar()` definida em `theirlib`, que é então importada para a função armazenada `myfunc()`, que invoca `bar()`:

```
mysql> CREATE LIBRARY mylib LANGUAGE JAVASCRIPT
    -> AS $$
    $>   export function foo(){return 42}
    $> $$;
Query OK, 0 rows affected (0.04 sec)

mysql> CREATE LIBRARY theirlib LANGUAGE JAVASCRIPT
    -> AS $$
    $>   import {foo} from "/db1/mylib"
    $>   export function bar(){return 2 * foo()}
    $> $$;
Query OK, 0 rows affected (0.01 sec)

mysql> CREATE FUNCTION myfunc(x INTEGER) RETURNS INT
    -> LANGUAGE JAVASCRIPT
    -> NO SQL
    -> USING (theirlib)
    -> AS $$
    $>   let result = theirlib.bar()
    $>
    $>   result += x
    $>
    $>   return result
    $> $$;
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT myfunc(1), myfunc(10);
+-----------+------------+
| myfunc(1) | myfunc(10) |
+-----------+------------+
|        85 |         94 |
+-----------+------------+
1 row in set (0.00 sec)
```

As funções da biblioteca podem ser invocadas apenas dentro da biblioteca ou da rotina armazenada na qual sua biblioteca contendo é importada. Por exemplo, a seguinte função armazenada `myfunc2()` importa `theirlib`, e `theirlib` importa `mylib`. A instrução `CREATE FUNCTION` neste caso tem sucesso, mas uma tentativa direta de invocar uma função originária de `mylib` é rejeitada em tempo de execução, como mostrado aqui:

```
mysql> CREATE FUNCTION myfunc2(x INTEGER) RETURNS INT
    -> LANGUAGE JAVASCRIPT
    -> NO SQL
    -> USING (theirlib)
    -> AS $$
    $>   return mylib.foo()
    $> $$;
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT myfunc2(1), myfunc2(10);
ERROR 6113 (HY000): JavaScript> ReferenceError: mylib is not defined
```

O código da biblioteca MLE JavaScript é executado apenas quando invocado como parte de uma rotina armazenada que inclui a biblioteca. O código da biblioteca não é executado por nenhuma das seguintes instruções:

* `CREATE FUNCTION`
* `CREATE PROCEDURE`
* `CREATE LIBRARY`

Por exemplo, estas são instruções válidas de `CREATE LIBRARY` e `CREATE FUNCTION`, pois o código não é realmente executado:

```
mysql> CREATE LIBRARY my_lib LANGUAGE JAVASCRIPT
    -> AS $$
    $>   throw "MyError"
    $> $$;
Query OK, 0 rows affected (0.02 sec)

mysql> CREATE FUNCTION my_func(x INTEGER)
    -> RETURNS INTEGER LANGUAGE JAVASCRIPT NO SQL
    -> USING(my_lib)
    -> AS $$
    $>   return x * 10
    $> $$;
Query OK, 0 rows affected (0.02 sec)
```

Invocar a função que importa a biblioteca realmente invoca o código da biblioteca, o que causa um erro, como mostrado aqui:

```
mysql> SELECT my_func(8);
ERROR 6113 (HY000): JavaScript> MyError
```