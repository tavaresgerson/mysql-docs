### 27.3.12 Exemplos de Programa Armazenado em JavaScript

Esta seção contém exemplos que ilustram vários aspectos diferentes do uso de programas em JavaScript em diferentes circunstâncias.

O exemplo a seguir demonstra o uso de uma função armazenada em JavaScript com valores de colunas de tabela. Primeiro, definimos uma função armazenada `gcd()` que encontra o maior denominador comum de dois inteiros, mostrado aqui:

```
mysql> CREATE FUNCTION gcd(a INT, b INT)
    -> RETURNS INT NO SQL LANGUAGE JAVASCRIPT AS
    -> $mle$
    $>   let x = Math.abs(a)
    $>   let y = Math.abs(b)
    $>   while(y) {
    $>     var t = y
    $>     y = x % y
    $>     x = t
    $>   }
    $>   return x
    $> $mle$
    -> ;
Query OK, 0 rows affected (0.01 sec)
```

Podemos testar a função armazenada, assim:

```
mysql> SELECT gcd(75, 220), gcd(75, 225);
+--------------+--------------+
| gcd(75, 220) | gcd(75, 225) |
+--------------+--------------+
|            5 |           75 |
+--------------+--------------+
1 row in set (0.00 sec)
```

Em seguida, criamos uma tabela `t1` com duas colunas inteiras e a preenchemos com algumas linhas, assim:

```
mysql> CREATE TABLE t1 (c1 INT, c2 INT);
Query OK, 0 rows affected (0.02 sec)

mysql> INSERT INTO t1 VALUES ROW(12,70), ROW(17,3), ROW(81,9);
Query OK, 3 rows affected (0.01 sec)
Records: 3  Duplicates: 0  Warnings: 0

mysql> TABLE t1;
+------+------+
| c1   | c2   |
+------+------+
|   12 |   70 |
|   17 |    3 |
|   81 |    9 |
+------+------+
3 rows in set (0.00 sec)
```

Agora podemos selecionar de `t1`, usando a função `gcd()` com os valores das colunas como valores de argumento na chamada da função, como mostrado aqui:

```
mysql> SELECT c1, c2, gcd(c1, c2) AS G
    -> FROM t1
    -> WHERE gcd(c1, c2) > 1
    -> ORDER BY gcd(c1, c2);
+----+----+---+
| c1 | c2 | G |
+----+----+---+
| 12 | 70 | 2 |
| 81 |  9 | 9 |
+----+----+---+
8 rows in set (0.01 sec)
```

Um valor de argumento que não é do tipo especificado é coercido para o tipo correto quando possível, como mostrado aqui:

```
mysql> SELECT gcd(500.3, 600), gcd(500.5, 600);
+-----------------+-----------------+
| gcd(500.3, 600) | gcd(500.5, 600) |
+-----------------+-----------------+
|             100 |               3 |
+-----------------+-----------------+
1 row in set (0.01 sec)
```

O arredondamento de valores de ponto flutuante para inteiros é realizado usando `Math.round()`; neste caso, 500.3 é arredondado para baixo para 500, mas 500.5 é arredondado para cima para 501.

Em seguida, criamos um procedimento armazenado simples em JavaScript usando uma declaração `CREATE PROCEDURE` que inclui um parâmetro `OUT` para passar a data e hora atuais em um formato legível para humanos para uma variável de usuário. Como não temos certeza de quão longa essa representação é, usamos VARCHAR(25) para o tipo do parâmetro.

```
mysql> CREATE PROCEDURE d1 (OUT res VARCHAR(25))
    -> LANGUAGE JAVASCRIPT
    -> AS
    -> $$
    $>   let d = new Date().toString()
    $>   res = d
    $> $$
    -> ;
Query OK, 0 rows affected (0.01 sec)
```

Agora podemos testar o procedimento armazenado, primeiro verificando que a variável de usuário @today ainda não foi definida para nenhum valor, assim:

```
mysql> SELECT @today;
+----------------------+
| @today               |
+----------------------+
| NULL                 |
+----------------------+
1 row in set (0.01 sec)

mysql> CALL d1(@today);
ERROR 1406 (22001): Data too long for column 'res' at row 1
```

O procedimento é sintaticamente válido, mas o tipo de dados do parâmetro `INOUT` (`res`) não permite um número suficiente de caracteres; em vez de truncar o valor, o programa armazenado o rejeita. Como não é possível alterar o código do procedimento no local, devemos descartar o procedimento e recriá-lo; desta vez, tentamos dobrar o comprimento especificado para o parâmetro `INOUT`:

```
mysql> DROP PROCEDURE d1;
Query OK, 0 rows affected (0.02 sec)

mysql> CREATE PROCEDURE d1 (OUT res VARCHAR(50))
    -> LANGUAGE JAVASCRIPT
    -> AS
    -> $$
    $>   let d = new Date().toString()
    $>   res = d
    $> $$
    -> ;
Query OK, 0 rows affected (0.01 sec)
```

Agora podemos repetir o teste, assim:

```
mysql> SELECT @today;
+----------------------+
| @today               |
+----------------------+
| NULL                 |
+----------------------+
1 row in set (0.01 sec)
```

Antes de invocar o procedimento atualizado com `CALL`, o valor de `@today` permanece não definido, já que a versão original de `d1()` não foi executada com sucesso. A versão atualizada é executada com sucesso, e vemos depois que, desta vez, o valor da variável de usuário é definido como esperado:

```
mysql> CALL d1(@today);
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT @today;
+-----------------------------------------+
| @today                                  |
+-----------------------------------------+
| Mon Oct 30 2023 20:47:29 GMT+0000 (GMT) |
+-----------------------------------------+
1 row in set (0.00 sec)
```

Nota

O valor que você obtém ao executar este exemplo provavelmente será diferente em certa medida do que é mostrado aqui, já que a representação exata das datas depende do seu local do sistema e, possivelmente, de outras configurações. Consulte a documentação do objeto `Date` do JavaScript para obter mais informações.

O próximo exemplo demonstra o uso de uma função armazenada JavaScript em um gatilho.

Primeiro, criamos uma tabela `t2` contendo três colunas inteiras, assim:

```
mysql> CREATE TABLE t2 (c1 INT, c2 INT, c3 INT);
Query OK, 0 rows affected (0.04 sec)
```

Agora podemos criar um gatilho nesta tabela. Isso deve ser feito usando uma declaração `CREATE TRIGGER` escrita da maneira usual usando SQL (veja a Seção 27.4, “Usando Gatilhos”), mas pode fazer uso de rotinas armazenadas escritas em JavaScript, como a função `js_pow()` mostrada anteriormente nesta seção.

```
mysql> delimiter //
mysql> CREATE TRIGGER jst BEFORE INSERT ON t2
    -> FOR EACH ROW
    -> BEGIN
    ->   SET NEW.c2 = js_pow(NEW.c1, 2);
    ->   SET NEW.c3 = js_pow(NEW.c1, 3);
    -> END;
    -> //
Query OK, 0 rows affected (0.02 sec)

mysql> delimiter ;
mysql>
```

Esse gatilho é ativado quando uma linha é inserida em `t2`, utilizando o valor inserido na primeira coluna e inserindo o quadrado desse valor na segunda coluna, e seu cubo na terceira. Testamos o gatilho inserindo algumas linhas na tabela; como o único valor que não é descartado é o fornecido para a coluna `c1`, podemos simplesmente usar `NULL` para cada uma das duas colunas restantes, como mostrado aqui:

```
mysql> INSERT INTO t2
    -> VALUES
    ->   ROW(1, NULL, NULL),
    ->   ROW(2.49, NULL, NULL),
    ->   ROW(-3, NULL, NULL),
    ->   ROW(4.725, NULL, NULL);
Query OK, 4 rows affected (0.01 sec)
Records: 4  Duplicates: 0  Warnings: 0
```

Como a função invocada pelo gatilho foi escrita em JavaScript, as regras de arredondamento do JavaScript se aplicam, de modo que 2,49 é arredondado para baixo para 2, e 4,75 é arredondado para cima para 5. Podemos ver que esse é o caso quando verificamos o resultado usando uma declaração `TABLE`:

```
mysql> TABLE t2;
+------+------+------+
| c1   | c2   | c3   |
+------+------+------+
|    1 |    1 |    1 |
|    2 |    4 |    8 |
|   -3 |    9 |  -27 |
|    5 |   25 |  125 |
+------+------+------+
4 rows in set (0.00 sec)
```

Os seguintes exemplos demonstram alguns dos conceitos básicos de trabalho com valores `VECTOR` em programas armazenados em JavaScript MySQL. Começamos criando uma tabela `v1` que contém uma coluna `VECTOR` `c1`, assim:

```
mysql> CREATE TABLE v1 (
    ->   c1 VECTOR(3)
    -> );
Query OK, 0 rows affected (0.02 sec)
```

Para inserir alguns valores nesta tabela, criamos um procedimento armazenado em JavaScript `vxin` que recebe como argumento uma representação de string de um vetor, a converte em um valor `VECTOR` e o insere. Em seguida, chamamos esse procedimento várias vezes, como mostrado aqui:

```
mysql> CREATE PROCEDURE vxin (IN val VARCHAR(100))
    -> LANGUAGE JAVASCRIPT
    ->   AS $$
    $>     let q = "INSERT INTO v1 VALUES("
    $>     q += "STRING_TO_VECTOR(\"" + val + "\")"
    $>     q += ")"
    $>
    $>     let s = session.sql(q)
    $>
    $>     s.execute()
    $>   $$;
Query OK, 0 rows affected (0.00 sec)

mysql> CALL vxin("[50, 100, 50]");
Query OK, 1 row affected (0.01 sec)

mysql> CALL vxin("[100, 0, -50]");
Query OK, 1 row affected (0.00 sec)

mysql> CALL vxin("[250, 350, 450]");
Query OK, 1 row affected (0.01 sec)
```

Após `v1` ter sido preenchida, a saída de `TABLE v1` parece assim:

```
mysql> TABLE v1;
+----------------------------+
| c1                         |
+----------------------------+
| 0x000048420000C84200004842 |
| 0x0000C84200000000000048C2 |
| 0x00007A430000AF430000E143 |
+----------------------------+
3 rows in set (0.00 sec)
```

Em seguida, criamos um procedimento armazenado em JavaScript **`vxout1`**, que seleciona todas as linhas em **`v1`**, recuperando os valores da coluna e escrevendo-os em `stdout`. A declaração `CREATE PROCEDURE` usada para criar esse procedimento é mostrada aqui:

```
mysql> CREATE PROCEDURE vxout1 ()
    -> LANGUAGE JAVASCRIPT
    ->   AS $$
    $>     let s = session.sql("TABLE v1");
    $>
    $>     let res = s.execute()
    $>
    $>     console.log(res.getColumnNames())
    $>
    $>     let row = res.fetchOne()
    $>
    $>     while(row) {
    $>       console.log(row.toArray())
    $>       row = res.fetchOne()
    $>     }
    $>   $$;
Query OK, 0 rows affected (0.00 sec)
```

Podemos testar esse procedimento da seguinte forma:

```
mysql> SELECT mle_session_reset();
+------------------------------------------+
| mle_session_reset()                      |
+------------------------------------------+
| The session state is successfully reset. |
+------------------------------------------+
1 row in set (0.00 sec)

mysql> CALL vxout1();
Query OK, 0 rows affected (0.01 sec)

mysql> SELECT mle_session_state("stdout")\G
*************************** 1. row ***************************
mle_session_state("stdout"): c1
50,100,50
100,0,-50
250,350,450

1 row in set (0.00 sec)
```

Você pode estar esperando ver as mesmas representações binárias exibidas na saída da instrução `TABLE`. Como o JavaScript trata um valor `VECTOR` como um array (uma instância de `Float32Array`), ele é exibido no formato de array. Você pode usar a função SQL `HEX()` para forçar que esses valores sejam exibidos usando a notação binária, se desejar, assim:

```
mysql> CREATE PROCEDURE vxout2 ()
    -> LANGUAGE JAVASCRIPT
    ->   AS $$
    $>     let s = session.sql("SELECT HEX(c1) FROM v1");
    $>
    $>     let res = s.execute()
    $>
    $>     console.log(res.getColumnNames())
    $>
    $>     let row = res.fetchOne()
    $>
    $>     while(row) {
    $>       console.log(row.toArray())
    $>       row = res.fetchOne()
    $>     }
    $>   $$;
Query OK, 0 rows affected (0.01 sec)

mysql> SELECT mle_session_reset();
+------------------------------------------+
| mle_session_reset()                      |
+------------------------------------------+
| The session state is successfully reset. |
+------------------------------------------+
1 row in set (0.00 sec)

mysql> CALL vxout2();
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT mle_session_state("stdout")\G
*************************** 1. row ***************************
mle_session_state("stdout"): HEX(c1)
000048420000C84200004842
0000C84200000000000048C2
00007A430000AF430000E143

1 row in set (0.00 sec)
```

Independentemente do formato de exibição, os valores `VECTOR` são tratados como vetores, e não como strings ou arrays, como podemos ver no exemplo seguinte que emprega a função `DISTANCE()` (apenas do MySQL HeatWave). Primeiro, criamos e preenchimos uma tabela `v2` contendo duas colunas `VECTOR`, usando as instruções SQL mostradas aqui:

```
CREATE TABLE v2 (
  c1 VECTOR(3),
  c2 VECTOR(3)
);

INSERT INTO v2 VALUES
  ROW(STRING_TO_VECTOR("[50, 100, 50]"), STRING_TO_VECTOR("[0, 200, 0]")),
  ROW(STRING_TO_VECTOR("[100, 0, -50]"), STRING_TO_VECTOR("[5, 10, 5]")),
  ROW(STRING_TO_VECTOR("[250, 350, 450]"), STRING_TO_VECTOR("[-150, 1000, 50]"))
;
```

A seguinte consulta mostra o produto escalar dos dois vetores em cada linha:

```
mysql> SELECT VECTOR_DISTANCE(c1, c2, "DOT") AS d FROM v2;
+--------+
| d      |
+--------+
|  20000 |
|    250 |
| 335000 |
+--------+
3 rows in set (0.00 sec)
```

Observação

O produto escalar de dois vetores é definido como a soma dos produtos de seus componentes, em ordem. Por exemplo, para os vetores na segunda linha da tabela `v5` (`[100, 0, -50]` e `[5, 10, 5]`), o produto escalar é `(100)(5) + (0)(10) + (-50)(5) = 500 + 0 - 250 = 250`.

Você pode escrever sua própria função JavaScript para obter o produto escalar de dois vetores, semelhante a esta:

```
mysql> CREATE FUNCTION dot_product (v1 VECTOR, v2 VECTOR)
    -> RETURNS FLOAT DETERMINISTIC
    -> LANGUAGE JAVASCRIPT
    ->   AS $$
    $>     if(v1.length !== v2.length)
    $>       throw new Error('Vectors must be of the same length')
    $>
    $>     let dot = 0, i=0
    $>
    $>     for(i=0; i<v1.length; i++)
    $>       dot += v1[i]*v2[i]
    $>
    $>     return dot
    $>   $$;

mysql> SELECT dot_product(c1, c2) AS dot FROM v5\G
*************************** 1. row ***************************
dot: 20000
*************************** 2. row ***************************
dot: 250
*************************** 3. row ***************************
dot: 335000
```

Em seguida, criamos um procedimento armazenado JavaScript `vxout5` que executa a mesma consulta, assim:

```
mysql> CREATE PROCEDURE vxout5 ()
    -> LANGUAGE JAVASCRIPT
    ->   AS $$
    $>     let s = session.sql("SELECT VECTOR_DISTANCE(c1, c2, \"DOT\") AS d FROM v5");
    $>
    $>     let res = s.execute()
    $>
    $>     console.log(res.getColumnNames())
    $>
    $>     let row = res.fetchOne()
    $>
    $>     while(row) {
    $>       console.log(row.toArray())
    $>       row = res.fetchOne()
    $>     }
    $>   $$;
Query OK, 0 rows affected (0.01 sec)
```

Quando executamos `vxout5` (primeiramente limpando o estado da sessão usando `mle_session_reset()` como antes), podemos ver que os valores da coluna de `v5` são tratados como vetores, com o mesmo resultado que ao executar a consulta diretamente no cliente **mysql**:

```
mysql> SELECT mle_session_reset();
+------------------------------------------+
| mle_session_reset()                      |
+------------------------------------------+
| The session state is successfully reset. |
+------------------------------------------+
1 row in set (0.00 sec)

mysql> CALL vxout5();
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT mle_session_state("stdout")\G
*************************** 1. row ***************************
mle_session_state("stdout"): d
20000
250
335000

1 row in set (0.00 sec)
```