### 15.2.14 Operações com Conjuntos com UNION, INTERSECT e EXCEPT

* Nomes e Tipos de Dados das Colunas do Conjunto de Resultados
* Operações com Conjuntos com Instruções TABLE e VALUES
* Operações com Conjuntos usando DISTINCT e ALL
* Operações com Conjuntos com ORDER BY e LIMIT
* Limitações das Operações com Conjuntos

As operações com conjuntos no SQL combinam os resultados de vários blocos de consulta em um único resultado. Um *bloco de consulta*, às vezes também conhecido como *tabela simples*, é qualquer instrução SQL que retorne um conjunto de resultados, como `SELECT`. O MySQL 9.5 também suporta as instruções `TABLE` e `VALUES`. Consulte as descrições individuais dessas instruções em outras partes deste capítulo para obter informações adicionais.

O padrão SQL define as seguintes três operações com conjuntos:

* `UNION`: Combine todos os resultados de dois blocos de consulta em um único resultado, omitindo quaisquer duplicatas.

* `INTERSECT`: Combine apenas as linhas que os resultados de dois blocos de consulta têm em comum, omitindo quaisquer duplicatas.

* `EXCEPT`: Para dois blocos de consulta *`A`* e *`B`*, retorne todos os resultados de *`A`* que também não estão presentes em *`B`*, omitindo quaisquer duplicatas.

(Alguns sistemas de banco de dados, como o Oracle, usam `MINUS` para o nome deste operador. Isso não é suportado no MySQL.)

O MySQL suporta `UNION`, `INTERSECT` e `EXCEPT`.

Cada um desses operadores de conjunto suporta um modificador `ALL`. Quando a palavra-chave `ALL` segue um operador de conjunto, isso faz com que as duplicatas sejam incluídas no resultado. Consulte as seções seguintes que cobrem os operadores individuais para obter mais informações e exemplos.

Todos os três operadores de conjunto também suportam a palavra-chave `DISTINCT`, que suprime as duplicatas no resultado. Como este é o comportamento padrão para operadores de conjunto, geralmente não é necessário especificar `DISTINCT` explicitamente.

Em geral, blocos de consulta e operações de conjunto podem ser combinados em qualquer número e ordem. Uma representação muito simplificada é mostrada aqui:

```
query_block [set_op query_block] [set_op query_block] ...

query_block:
    SELECT | TABLE | VALUES

set_op:
    UNION | INTERSECT | EXCEPT
```

Isso pode ser representado de forma mais precisa e detalhada, assim:

```
query_expression:
  [with_clause] /* WITH clause */
  query_expression_body
  [order_by_clause] [limit_clause] [into_clause]

query_expression_body:
    query_term
 |  query_expression_body UNION [ALL | DISTINCT] query_term
 |  query_expression_body EXCEPT [ALL | DISTINCT] query_term

query_term:
    query_primary
 |  query_term INTERSECT [ALL | DISTINCT] query_primary

query_primary:
    query_block
 |  '(' query_expression_body [order_by_clause] [limit_clause] [into_clause] ')'

query_block:   /* also known as a simple table */
    query_specification                     /* SELECT statement */
 |  table_value_constructor                 /* VALUES statement */
 |  explicit_table                          /* TABLE statement  */
```

Você deve estar ciente de que `INTERSECT` é avaliado antes de `UNION` ou `EXCEPT`. Isso significa que, por exemplo, `TABLE x UNION TABLE y INTERSECT TABLE z` é sempre avaliado como `TABLE x UNION (TABLE y INTERSECT TABLE z)`. Veja a Seção 15.2.8, “Cláusula INTERSECT”, para mais informações.

Além disso, você deve ter em mente que, embora os operadores de conjunto `UNION` e `INTERSECT` sejam compostos (a ordem não é significativa), `EXCEPT` não é (a ordem dos operandos afeta o resultado). Em outras palavras, todas as seguintes afirmações são verdadeiras:

* `TABLE x UNION TABLE y` e `TABLE y UNION TABLE x` produzem o mesmo resultado, embora a ordem das linhas possa diferir. Você pode forçar que elas sejam iguais usando `ORDER BY`; veja Operações de Conjunto com ORDER BY e LIMIT.

* `TABLE x INTERSECT TABLE y` e `TABLE y INTERSECT TABLE x` retornam o mesmo resultado.

* `TABLE x EXCEPT TABLE y` e `TABLE y EXCEPT TABLE x` *não* produzem o mesmo resultado. Veja a Seção 15.2.4, “Cláusula EXCEPT”, para um exemplo.

Mais informações e exemplos podem ser encontrados nas seções que seguem.

#### Nomes de Colunas do Conjunto de Resultados e Tipos de Dados

Os nomes das colunas para o resultado de uma operação de conjunto são tirados dos nomes das colunas do primeiro bloco de consulta. Exemplo:

```
mysql> CREATE TABLE t1 (x INT, y INT);
Query OK, 0 rows affected (0.04 sec)

mysql> INSERT INTO t1 VALUES ROW(4,-2), ROW(5,9);
Query OK, 2 rows affected (0.00 sec)
Records: 2  Duplicates: 0  Warnings: 0

mysql> CREATE TABLE t2 (a INT, b INT);
Query OK, 0 rows affected (0.04 sec)

mysql> INSERT INTO t2 VALUES ROW(1,2), ROW(3,4);
Query OK, 2 rows affected (0.01 sec)
Records: 2  Duplicates: 0  Warnings: 0

mysql> TABLE t1 UNION TABLE t2;
+------+------+
| x    | y    |
+------+------+
|    4 |   -2 |
|    5 |    9 |
|    1 |    2 |
|    3 |    4 |
+------+------+
4 rows in set (0.00 sec)

mysql> TABLE t2 UNION TABLE t1;
+------+------+
| a    | b    |
+------+------+
|    1 |    2 |
|    3 |    4 |
|    4 |   -2 |
|    5 |    9 |
+------+------+
4 rows in set (0.00 sec)
```

Isso é verdade para consultas `UNION`, `EXCEPT` e `INTERSECT`.

Colunas selecionadas listadas em posições correspondentes de cada bloco de consulta devem ter o mesmo tipo de dado. Por exemplo, a primeira coluna selecionada pela primeira instrução deve ter o mesmo tipo que a primeira coluna selecionada pelas outras instruções. Se os tipos de dados das colunas resultantes correspondentes não corresponderem, os tipos e comprimentos das colunas no resultado levam em conta os valores recuperados por todos os blocos de consulta. Por exemplo, o comprimento da coluna no conjunto de resultados não é limitado ao comprimento do valor da primeira instrução, como mostrado aqui:

```
mysql> SELECT REPEAT('a',1) UNION SELECT REPEAT('b',20);
+----------------------+
| REPEAT('a',1)        |
+----------------------+
| a                    |
| bbbbbbbbbbbbbbbbbbbb |
+----------------------+
```

#### Operações de Conjunto com Instruções TABLE e VALUES

Você também pode usar uma instrução `TABLE` ou `VALUES` sempre que puder empregar a instrução `SELECT` equivalente. Suponha que as tabelas `t1` e `t2` sejam criadas e preenchidas como mostrado aqui:

```
CREATE TABLE t1 (x INT, y INT);
INSERT INTO t1 VALUES ROW(4,-2),ROW(5,9);

CREATE TABLE t2 (a INT, b INT);
INSERT INTO t2 VALUES ROW(1,2),ROW(3,4);
```

Diante disso, e ignorando os nomes das colunas na saída das consultas que começam com `VALUES`, todas as seguintes consultas `UNION` produzem o mesmo resultado:

```
SELECT * FROM t1 UNION SELECT * FROM t2;
TABLE t1 UNION SELECT * FROM t2;
VALUES ROW(4,-2), ROW(5,9) UNION SELECT * FROM t2;
SELECT * FROM t1 UNION TABLE t2;
TABLE t1 UNION TABLE t2;
VALUES ROW(4,-2), ROW(5,9) UNION TABLE t2;
SELECT * FROM t1 UNION VALUES ROW(4,-2),ROW(5,9);
TABLE t1 UNION VALUES ROW(4,-2),ROW(5,9);
VALUES ROW(4,-2), ROW(5,9) UNION VALUES ROW(4,-2),ROW(5,9);
```

Para forçar que os nomes das colunas sejam os mesmos, envolva o bloco de consulta do lado esquerdo em uma instrução `SELECT` e use aliases, assim:

```
mysql> SELECT * FROM (TABLE t2) AS t(x,y) UNION TABLE t1;
+------+------+
| x    | y    |
+------+------+
|    1 |    2 |
|    3 |    4 |
|    4 |   -2 |
|    5 |    9 |
+------+------+
4 rows in set (0.00 sec)
```

#### Operações de Conjunto usando DISTINCT e ALL

Por padrão, as linhas duplicadas são removidas dos resultados das operações de conjunto. A palavra-chave opcional `DISTINCT` tem o mesmo efeito, mas torna isso explícito. Com a palavra-chave opcional `ALL`, a remoção de linhas duplicadas não ocorre e o resultado inclui todas as linhas correspondentes de todas as consultas na união.

Você pode misturar `ALL` e `DISTINCT` na mesma consulta. Tipos misturados são tratados de forma que uma operação de conjunto usando `DISTINCT` substitui qualquer operação de conjunto usando `ALL` à sua esquerda. Um conjunto `DISTINCT` pode ser produzido explicitamente usando `DISTINCT` com `UNION`, `INTERSECT` ou `EXCEPT`, ou implicitamente usando as operações de conjunto sem a palavra-chave `DISTINCT` ou `ALL` subsequente.

As operações de conjunto funcionam da mesma maneira quando uma ou mais declarações `TABLE`, declarações `VALUES` ou ambas são usadas para gerar o conjunto.

#### Operações de Conjunto com ORDER BY e LIMIT

Para aplicar uma cláusula `ORDER BY` ou `LIMIT` a um bloco de consulta individual usado como parte de uma união, interseção ou outra operação de conjunto, coloque o bloco de consulta entre parênteses, colocando a cláusula dentro dos parênteses, assim:

```
(SELECT a FROM t1 WHERE a=10 AND b=1 ORDER BY a LIMIT 10)
UNION
(SELECT a FROM t2 WHERE a=11 AND b=2 ORDER BY a LIMIT 10);

(TABLE t1 ORDER BY x LIMIT 10)
INTERSECT
(TABLE t2 ORDER BY a LIMIT 10);
```

O uso de `ORDER BY` para blocos de consulta individuais ou declarações implica em nada sobre a ordem em que as linhas aparecem no resultado final, porque as linhas produzidas por uma operação de conjunto são, por padrão, não ordenadas. Portanto, `ORDER BY` neste contexto é tipicamente usado em conjunto com `LIMIT`, para determinar o subconjunto das linhas selecionadas a serem recuperadas, embora isso não afete necessariamente a ordem dessas linhas no resultado final. Se `ORDER BY` aparece sem `LIMIT` dentro de um bloco de consulta, ele é otimizado, pois não tem efeito em nenhum caso.

Para usar uma cláusula `ORDER BY` ou `LIMIT` para ordenar ou limitar todo o resultado de uma operação de conjunto, coloque `ORDER BY` ou `LIMIT` após a última declaração:

```
SELECT a FROM t1
EXCEPT
SELECT a FROM t2 WHERE a=11 AND b=2
ORDER BY a LIMIT 10;

TABLE t1
UNION
TABLE t2
ORDER BY a LIMIT 10;
```

Se uma ou mais declarações individuais fizerem uso de `ORDER BY`, `LIMIT` ou ambos, e, além disso, você desejar aplicar um `ORDER BY`, `LIMIT` ou ambos ao resultado inteiro, então cada uma dessas declarações individuais deve ser colocada entre parênteses.

```
(SELECT a FROM t1 WHERE a=10 AND b=1)
EXCEPT
(SELECT a FROM t2 WHERE a=11 AND b=2)
ORDER BY a LIMIT 10;

(TABLE t1 ORDER BY a LIMIT 10)
UNION
TABLE t2
ORDER BY a LIMIT 10;
```

Uma declaração sem a cláusula `ORDER BY` ou `LIMIT` precisa ser colocada entre parênteses; substituir `TABLE t2` por `(TABLE t2)` na segunda declaração dos dois exemplos acima não altera o resultado da `UNION`.

Você também pode usar `ORDER BY` e `LIMIT` com declarações `VALUES` em operações de conjunto, como mostrado neste exemplo usando o cliente **mysql**:

```
mysql> VALUES ROW(4,-2), ROW(5,9), ROW(-1,3)
    -> UNION
    -> VALUES ROW(1,2), ROW(3,4), ROW(-1,3)
    -> ORDER BY column_0 DESC LIMIT 3;
+----------+----------+
| column_0 | column_1 |
+----------+----------+
|        5 |        9 |
|        4 |       -2 |
|        3 |        4 |
+----------+----------+
3 rows in set (0.00 sec)
```

(Você deve ter em mente que nem as declarações `TABLE` nem as declarações `VALUES` aceitam uma cláusula `WHERE`.

Esse tipo de `ORDER BY` não pode usar referências de coluna que incluam um nome de tabela (ou seja, nomes no formato *`tbl_name`.*`col_name`). Em vez disso, forneça um alias de coluna no primeiro bloco de consulta e faça referência ao alias na cláusula `ORDER BY`. (Você também pode fazer referência à coluna na cláusula `ORDER BY` usando sua posição na coluna, mas esse uso de posições de coluna é desaconselhado e, portanto, sujeito à eventual remoção em uma futura versão do MySQL.)

Se uma coluna a ser ordenada tiver um alias, a cláusula `ORDER BY` *deve* fazer referência ao alias, não ao nome da coluna. A primeira das seguintes declarações é permitida, mas a segunda falha com um erro `Unknown column 'a' in 'order clause'`.

Para fazer com que as linhas em um resultado de `UNION` consistam nos conjuntos de linhas recuperadas por cada bloco de consulta um após o outro, selecione uma coluna adicional em cada bloco de consulta para usar como coluna de ordenação e adicione uma cláusula `ORDER BY` que ordene nessa coluna após o último bloco de consulta:

```
(SELECT a AS b FROM t) UNION (SELECT ...) ORDER BY b;
(SELECT a AS b FROM t) UNION (SELECT ...) ORDER BY a;
```

Para manter a ordem de classificação dentro dos resultados individuais, adicione uma coluna secundária à cláusula `ORDER BY`:

```
(SELECT 1 AS sort_col, col1a, col1b, ... FROM t1)
UNION
(SELECT 2, col2a, col2b, ... FROM t2) ORDER BY sort_col;
```

O uso de uma coluna adicional também permite determinar de qual bloco de consulta cada linha vem. Colunas extras podem fornecer outras informações de identificação também, como uma string que indica um nome de tabela.

#### Limitações das Operações com Conjuntos

As operações com conjuntos no MySQL estão sujeitas a algumas limitações, que são descritas nos próximos parágrafos.

As operações com conjuntos, incluindo as instruções `SELECT`, têm as seguintes limitações:

* A cláusula `HIGH_PRIORITY` na primeira `SELECT` não tem efeito. A `HIGH_PRIORITY` em qualquer `SELECT` subsequente produz um erro sintático.

* Apenas a última instrução `SELECT` pode usar uma cláusula `INTO`. No entanto, todo o resultado da `UNION` é escrito no destino de saída `INTO`.

Essas duas variantes de `UNION` que contêm `INTO` estão desatualizadas; você deve esperar que o suporte para elas seja removido em uma versão futura do MySQL:

* No bloco de consulta final de uma expressão de consulta, o uso de `INTO` antes de `FROM` produz um aviso. Exemplo:

  ```
(SELECT 1 AS sort_col, col1a, col1b, ... FROM t1)
UNION
(SELECT 2, col2a, col2b, ... FROM t2) ORDER BY sort_col, col1a;
```

* Em um bloco de consulta final entre parênteses de uma expressão de consulta, o uso de `INTO` (independentemente de sua posição em relação a `FROM`) produz um aviso. Exemplo:

  ```
  ... UNION SELECT * INTO OUTFILE 'file_name' FROM table_name;
  ```

Essas variantes estão desatualizadas porque são confusas, como se estivessem coletando informações da tabela nomeada em vez de toda a expressão de consulta (a `UNION`).

As operações com conjuntos com uma função agregada em uma cláusula `ORDER BY` são rejeitadas com `ER_AGGREGATE_ORDER_FOR_UNION`. Embora o nome do erro possa sugerir que isso é exclusivo para consultas `UNION`, o anterior também é verdadeiro para consultas `EXCEPT` e `INTERSECT`, como mostrado aqui:

```
  ... UNION (SELECT * INTO OUTFILE 'file_name' FROM table_name);
  ```

Uma cláusula de bloqueio (como `FOR UPDATE` ou `LOCK IN SHARE MODE`) se aplica ao bloco de consulta que a segue. Isso significa que, em uma instrução `SELECT` usada com operações com conjuntos, uma cláusula de bloqueio pode ser usada apenas se o bloco de consulta e a cláusula de bloqueio estiverem entre parênteses.