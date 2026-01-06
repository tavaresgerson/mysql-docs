#### 13.2.9.3 Cláusula de UNIÃO

```sql
SELECT ...
UNION [ALL | DISTINCT] SELECT ...
[UNION [ALL | DISTINCT] SELECT ...]
```

`UNION` combina o resultado de várias instruções `SELECT` em um único conjunto de resultados. Exemplo:

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

- Nomes das Colunas do Conjunto de Resultados e Tipos de Dados
- UNION DISTINCT e UNION ALL
- ORDEM POR e LIMITE em Uniões
- Restrições da União

##### Nomes das Colunas e Tipos de Dados do Conjunto de Resultados

Os nomes das colunas de um conjunto de resultados de `UNION` são obtidos dos nomes das colunas da primeira instrução `SELECT`.

As colunas selecionadas listadas nas posições correspondentes de cada declaração `SELECT` devem ter o mesmo tipo de dado. Por exemplo, a primeira coluna selecionada pela primeira declaração deve ter o mesmo tipo que a primeira coluna selecionada pelas outras declarações. Se os tipos de dados das colunas correspondentes das declarações `SELECT` não corresponderem, os tipos e comprimentos das colunas no resultado da `UNION` levarão em consideração os valores recuperados por todas as declarações `SELECT`. Por exemplo, considere o seguinte, onde o comprimento da coluna não é limitado ao comprimento do valor da primeira declaração `SELECT`:

```sql
mysql> SELECT REPEAT('a',1) UNION SELECT REPEAT('b',20);
+----------------------+
| REPEAT('a',1)        |
+----------------------+
| a                    |
| bbbbbbbbbbbbbbbbbbbb |
+----------------------+
```

##### UNIÃO DISTINCT e UNIÃO ALL

Por padrão, as linhas duplicadas são removidas dos resultados do `UNION`. A palavra-chave opcional `DISTINCT` tem o mesmo efeito, mas torna isso explícito. Com a palavra-chave opcional `ALL`, a remoção de linhas duplicadas não ocorre e o resultado inclui todas as linhas correspondentes de todas as instruções de `SELECT`.

Você pode misturar `UNION ALL` e `UNION DISTINCT` na mesma consulta. Os tipos de `UNION` misturados são tratados de forma que uma união `DISTINCT` substitui qualquer união `ALL` à sua esquerda. Uma união `DISTINCT` pode ser produzida explicitamente usando `UNION DISTINCT` ou implicitamente usando `UNION` sem a palavra-chave `DISTINCT` ou `ALL` subsequente.

##### ORDEM POR e LIMITE em Uniões

Para aplicar uma cláusula `ORDER BY` ou `LIMIT` a um `SELECT` individual, coloque entre parênteses o `SELECT` e coloque a cláusula dentro dos parênteses:

```sql
(SELECT a FROM t1 WHERE a=10 AND B=1 ORDER BY a LIMIT 10)
UNION
(SELECT a FROM t2 WHERE a=11 AND B=2 ORDER BY a LIMIT 10);
```

Nota

Versões anteriores do MySQL podem permitir essas declarações sem as chaves. No MySQL 5.7, o requisito de chaves é exigido.

O uso de `ORDER BY` em instruções individuais de `SELECT` (select.html) não implica em nada sobre a ordem em que as linhas aparecem no resultado final, porque a `UNION` (union.html) produz, por padrão, um conjunto não ordenado de linhas. Portanto, `ORDER BY` neste contexto é tipicamente usado em conjunto com `LIMIT` para determinar o subconjunto das linhas selecionadas a serem recuperadas para a `SELECT` (select.html), embora isso não afete necessariamente a ordem dessas linhas no resultado final da `UNION` (union.html). Se `ORDER BY` aparece sem `LIMIT` em uma `SELECT` (select.html), ele é otimizado, pois não tem efeito.

Para usar uma cláusula `ORDER BY` ou `LIMIT` para ordenar ou limitar todo o resultado da consulta `UNION`, coloque entre parênteses as instruções individuais `SELECT` e coloque a cláusula `ORDER BY` ou `LIMIT` após a última:

```sql
(SELECT a FROM t1 WHERE a=10 AND B=1)
UNION
(SELECT a FROM t2 WHERE a=11 AND B=2)
ORDER BY a LIMIT 10;
```

Uma declaração sem parênteses é equivalente a uma declaração com parênteses, como mostrado acima.

Esse tipo de `ORDER BY` não pode usar referências de coluna que incluam o nome de uma tabela (ou seja, nomes no formato *`tbl_name`.*`col_name`\*). Em vez disso, forneça um alias de coluna na primeira instrução `SELECT` e faça referência ao alias no `ORDER BY`. (Alternativamente, você pode fazer referência à coluna no `ORDER BY` usando sua posição na coluna. No entanto, o uso de posições de coluna é desaconselhável.)

Além disso, se uma coluna a ser ordenada está aliassiada, a cláusula `ORDER BY` *deve* se referir ao alias, e não ao nome da coluna. A primeira das seguintes declarações é permitida, mas a segunda falha com um erro `Coluna desconhecida 'a' na cláusula de ordem`:

```sql
(SELECT a AS b FROM t) UNION (SELECT ...) ORDER BY b;
(SELECT a AS b FROM t) UNION (SELECT ...) ORDER BY a;
```

Para fazer com que as linhas de um resultado de `UNION` consistam nos conjuntos de linhas recuperadas por cada `SELECT` uma após a outra, selecione uma coluna adicional em cada `SELECT` para usar como coluna de ordenação e adicione um `ORDER BY` que ordene nessa coluna após o último `SELECT`:

```sql
(SELECT 1 AS sort_col, col1a, col1b, ... FROM t1)
UNION
(SELECT 2, col2a, col2b, ... FROM t2) ORDER BY sort_col;
```

Para manter a ordem de classificação dentro dos resultados individuais de `SELECT`, adicione uma coluna secundária à cláusula `ORDER BY`:

```sql
(SELECT 1 AS sort_col, col1a, col1b, ... FROM t1)
UNION
(SELECT 2, col2a, col2b, ... FROM t2) ORDER BY sort_col, col1a;
```

O uso de uma coluna adicional também permite determinar de qual `SELECT` cada linha vem. Colunas extras podem fornecer outras informações de identificação, como uma string que indica o nome de uma tabela.

Consultas de `UNION` com uma função agregada em uma cláusula `ORDER BY` são rejeitadas com um erro `ER_AGGREGATE_ORDER_FOR_UNION` (/doc/mysql-errors/5.7/en/server-error-reference.html#error\_er\_aggregate\_order\_for\_union). Exemplo:

```sql
SELECT 1 AS foo UNION SELECT 2 ORDER BY MAX(1);
```

##### UNION Restrições

Em uma `UNION`, as instruções `SELECT` são instruções de seleção normais, mas com as seguintes restrições:

- `HIGH_PRIORITY` no primeiro `SELECT` não tem efeito. `HIGH_PRIORITY` em qualquer `SELECT` subsequente produz um erro de sintaxe.

- Apenas a última instrução `SELECT` pode usar uma cláusula `INTO`. No entanto, todo o resultado da instrução `UNION` é escrito no destino de saída `INTO`.
