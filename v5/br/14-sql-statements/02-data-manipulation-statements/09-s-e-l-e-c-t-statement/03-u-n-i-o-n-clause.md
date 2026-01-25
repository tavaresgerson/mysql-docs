#### 13.2.9.3 Cláusula UNION

```sql
SELECT ...
UNION [ALL | DISTINCT] SELECT ...
[UNION [ALL | DISTINCT] SELECT ...]
```

A cláusula [`UNION`](union.html "13.2.9.3 UNION Clause") combina o resultado de múltiplas instruções [`SELECT`](select.html "13.2.9 SELECT Statement") em um único result set. Exemplo:

```sql
mysql> SELECT 1, 2;
+---+---+
| 1 | 2 |
+---+---+
| 1 | 2 |
+---+---+
mysql> SELECT 'a', 'b';
+---+---+
| a | b |
+---+---+
| a | b |
+---+---+
mysql> SELECT 1, 2 UNION SELECT 'a', 'b';
+---+---+
| 1 | 2 |
+---+---+
| 1 | 2 |
| a | b |
+---+---+
```

* [Nomes e Tipos de Dados das Colunas do Result Set](union.html#union-result-set "Result Set Column Names and Data Types")
* [UNION DISTINCT e UNION ALL](union.html#union-distinct-all "UNION DISTINCT and UNION ALL")
* [ORDER BY e LIMIT em Unions](union.html#union-order-by-limit "ORDER BY and LIMIT in Unions")
* [Restrições do UNION](union.html#union-restrictions "UNION Restrictions")

##### Nomes e Tipos de Dados das Colunas do Result Set

Os nomes das colunas para um result set [`UNION`](union.html "13.2.9.3 UNION Clause") são obtidos a partir dos nomes das colunas da primeira instrução [`SELECT`](select.html "13.2.9 SELECT Statement").

As colunas selecionadas listadas em posições correspondentes de cada instrução [`SELECT`](select.html "13.2.9 SELECT Statement") devem ter o mesmo tipo de dado. Por exemplo, a primeira coluna selecionada pela primeira instrução deve ter o mesmo tipo que a primeira coluna selecionada pelas outras instruções. Se os tipos de dados das colunas [`SELECT`](select.html "13.2.9 SELECT Statement") correspondentes não coincidirem, os tipos e comprimentos das colunas no resultado [`UNION`](union.html "13.2.9.3 UNION Clause") levam em consideração os valores recuperados por todas as instruções [`SELECT`](select.html "13.2.9 SELECT Statement"). Por exemplo, considere o seguinte, onde o comprimento da coluna não é limitado ao comprimento do valor da primeira instrução [`SELECT`](select.html "13.2.9 SELECT Statement"):

```sql
mysql> SELECT REPEAT('a',1) UNION SELECT REPEAT('b',20);
+----------------------+
| REPEAT('a',1)        |
+----------------------+
| a                    |
| bbbbbbbbbbbbbbbbbbbb |
+----------------------+
```

##### UNION DISTINCT e UNION ALL

Por padrão, linhas duplicadas são removidas dos resultados [`UNION`](union.html "13.2.9.3 UNION Clause"). O termo opcional `DISTINCT` tem o mesmo efeito, mas o torna explícito. Com o termo opcional `ALL`, a remoção de linhas duplicadas não ocorre e o resultado inclui todas as linhas correspondentes de todas as instruções [`SELECT`](select.html "13.2.9 SELECT Statement").

Você pode misturar [`UNION ALL`](union.html "13.2.9.3 UNION Clause") e [`UNION DISTINCT`](union.html "13.2.9.3 UNION Clause") na mesma Query. Tipos [`UNION`](union.html "13.2.9.3 UNION Clause") mistos são tratados de forma que um `UNION DISTINCT` anule qualquer `UNION ALL` à sua esquerda. Um `UNION DISTINCT` pode ser produzido explicitamente usando [`UNION DISTINCT`](union.html "13.2.9.3 UNION Clause") ou implicitamente usando [`UNION`](union.html "13.2.9.3 UNION Clause") sem a palavra-chave `DISTINCT` ou `ALL` subsequente.

##### ORDER BY e LIMIT em Unions

Para aplicar uma cláusula `ORDER BY` ou `LIMIT` a uma instrução [`SELECT`](select.html "13.2.9 SELECT Statement") individual, coloque a instrução [`SELECT`](select.html "13.2.9 SELECT Statement") entre parênteses e insira a cláusula dentro dos parênteses:

```sql
(SELECT a FROM t1 WHERE a=10 AND B=1 ORDER BY a LIMIT 10)
UNION
(SELECT a FROM t2 WHERE a=11 AND B=2 ORDER BY a LIMIT 10);
```

Nota

Versões anteriores do MySQL podem permitir tais instruções sem parênteses. No MySQL 5.7, a exigência de parênteses é imposta.

O uso de `ORDER BY` para instruções [`SELECT`](select.html "13.2.9 SELECT Statement") individuais não implica nada sobre a ordem em que as linhas aparecem no resultado final, pois [`UNION`](union.html "13.2.9.3 UNION Clause") por padrão produz um conjunto de linhas não ordenado. Portanto, `ORDER BY` neste contexto é tipicamente usado em conjunto com `LIMIT`, para determinar o subconjunto de linhas selecionadas a ser recuperado para a instrução [`SELECT`](select.html "13.2.9 SELECT Statement"), embora não afete necessariamente a ordem dessas linhas no resultado final do [`UNION`](union.html "13.2.9.3 UNION Clause"). Se `ORDER BY` aparecer sem `LIMIT` em uma instrução [`SELECT`](select.html "13.2.9 SELECT Statement"), ele é otimizado e descartado, pois não tem efeito.

Para usar uma cláusula `ORDER BY` ou `LIMIT` para ordenar ou limitar o resultado completo do [`UNION`](union.html "13.2.9.3 UNION Clause"), coloque as instruções [`SELECT`](select.html "13.2.9 SELECT Statement") individuais entre parênteses e coloque o `ORDER BY` ou `LIMIT` após a última:

```sql
(SELECT a FROM t1 WHERE a=10 AND B=1)
UNION
(SELECT a FROM t2 WHERE a=11 AND B=2)
ORDER BY a LIMIT 10;
```

Uma instrução sem parênteses é equivalente a uma entre parênteses, conforme mostrado acima.

Este tipo de `ORDER BY` não pode usar referências de coluna que incluam um nome de tabela (ou seja, nomes no formato *`tbl_name`*.*`col_name`*). Em vez disso, forneça um alias de coluna na primeira instrução [`SELECT`](select.html "13.2.9 SELECT Statement") e faça referência ao alias no `ORDER BY`. (Alternativamente, faça referência à coluna no `ORDER BY` usando sua posição de coluna. No entanto, o uso de posições de coluna é obsoleto.)

Além disso, se uma coluna a ser ordenada for apelidada (aliased), a cláusula `ORDER BY` *deve* referenciar o alias, não o nome da coluna. A primeira das seguintes instruções é permitida, mas a segunda falha com um erro `Unknown column 'a' in 'order clause'`:

```sql
(SELECT a AS b FROM t) UNION (SELECT ...) ORDER BY b;
(SELECT a AS b FROM t) UNION (SELECT ...) ORDER BY a;
```

Para fazer com que as linhas em um resultado [`UNION`](union.html "13.2.9.3 UNION Clause") consistam nos conjuntos de linhas recuperadas por cada instrução [`SELECT`](select.html "13.2.9 SELECT Statement") uma após a outra, selecione uma coluna adicional em cada [`SELECT`](select.html "13.2.9 SELECT Statement") para usar como coluna de classificação e adicione um `ORDER BY` que ordene por essa coluna após a última instrução [`SELECT`](select.html "13.2.9 SELECT Statement"):

```sql
(SELECT 1 AS sort_col, col1a, col1b, ... FROM t1)
UNION
(SELECT 2, col2a, col2b, ... FROM t2) ORDER BY sort_col;
```

Para manter adicionalmente a ordem de classificação dentro dos resultados individuais do [`SELECT`](select.html "13.2.9 SELECT Statement"), adicione uma coluna secundária à cláusula `ORDER BY`:

```sql
(SELECT 1 AS sort_col, col1a, col1b, ... FROM t1)
UNION
(SELECT 2, col2a, col2b, ... FROM t2) ORDER BY sort_col, col1a;
```

O uso de uma coluna adicional também permite determinar de qual instrução [`SELECT`](select.html "13.2.9 SELECT Statement") cada linha se origina. Colunas extras podem fornecer outras informações de identificação, como uma string que indica um nome de tabela.

Queries [`UNION`](union.html "13.2.9.3 UNION Clause") com uma função de agregação em uma cláusula `ORDER BY` são rejeitadas com um erro [`ER_AGGREGATE_ORDER_FOR_UNION`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_aggregate_order_for_union). Exemplo:

```sql
SELECT 1 AS foo UNION SELECT 2 ORDER BY MAX(1);
```

##### Restrições do UNION

Em um [`UNION`](union.html "13.2.9.3 UNION Clause"), as instruções [`SELECT`](select.html "13.2.9 SELECT Statement") são instruções select normais, mas com as seguintes restrições:

* `HIGH_PRIORITY` na primeira instrução [`SELECT`](select.html "13.2.9 SELECT Statement") não tem efeito. `HIGH_PRIORITY` em qualquer instrução [`SELECT`](select.html "13.2.9 SELECT Statement") subsequente produz um erro de sintaxe.

* Apenas a última instrução [`SELECT`](select.html "13.2.9 SELECT Statement") pode usar uma cláusula `INTO`. No entanto, todo o resultado do [`UNION`](union.html "13.2.9.3 UNION Clause") é escrito no destino de saída do `INTO`.