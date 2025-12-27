### 14.17.6 Funções de Tabela JSON

Esta seção contém informações sobre funções JSON que convertem dados JSON em dados tabelados. O MySQL 9.5 suporta uma dessas funções, `JSON_TABLE()`.

`JSON_TABLE(expr, path COLUMNS (column_list) [AS] alias)`

Extrai dados de um documento JSON e os retorna como uma tabela relacional com as colunas especificadas. A sintaxe completa desta função é mostrada aqui:

```
JSON_TABLE(
    expr,
    path COLUMNS (column_list)
)   [AS] alias

column_list:
    column[, column][, ...]

column:
    name FOR ORDINALITY
    |  name type PATH string path [on_empty] [on_error]
    |  name type EXISTS PATH string path
    |  NESTED [PATH] path COLUMNS (column_list)

on_empty:
    {NULL | DEFAULT json_string | ERROR} ON EMPTY

on_error:
    {NULL | DEFAULT json_string | ERROR} ON ERROR
```

*`expr`*: Esta é uma expressão que retorna dados JSON. Pode ser uma constante (`'{"a":1}'`), uma coluna (`t1.json_data`, dada a tabela `t1` especificada antes de `JSON_TABLE()` na cláusula `FROM`), ou uma chamada de função (`JSON_EXTRACT(t1.json_data,'$.post.comments')`).

*`path`*: Uma expressão de caminho JSON, que é aplicada à fonte de dados. Referenciamos o valor JSON que corresponde ao caminho como a *fonte de linha*; isso é usado para gerar uma linha de dados relacional. A cláusula `COLUMNS` avalia a fonte de linha, encontra valores JSON específicos dentro da fonte de linha e retorna esses valores JSON como valores SQL em colunas individuais de uma linha de dados relacional.

O *`alias`* é obrigatório. As regras usuais para aliases de tabela se aplicam (veja a Seção 11.2, “Nomes de Objetos de Esquema”).

Esta função compara os nomes das colunas de forma case-insensitive.

`JSON_TABLE()` suporta quatro tipos de colunas, descritos na lista a seguir:

1. `name FOR ORDINALITY`: Este tipo enumera linhas na cláusula `COLUMNS`; a coluna nomeada *`name`* é um contador cujo tipo é `UNSIGNED INT`, e cujo valor inicial é 1. Isso é equivalente a especificar uma coluna como `AUTO_INCREMENT` em uma declaração `CREATE TABLE`, e pode ser usado para distinguir linhas pai com o mesmo valor para múltiplas linhas geradas por uma cláusula `NESTED [PATH]`.

2. `nome tipo PATH string_path [on_empty] [on_error]`: Colunas deste tipo são usadas para extrair valores especificados por *`string_path`*. *`tipo`* é um tipo de dados escalar MySQL (ou seja, não pode ser um objeto ou um array). *`JSON_TABLE()`* extrai dados como JSON e os coerce para o tipo da coluna, usando a conversão automática regular aplicável aos dados JSON no MySQL. Um valor ausente aciona a cláusula *`on_empty`*. Salvar um objeto ou um array aciona a cláusula opcional *`on error`*; isso também ocorre quando ocorre um erro durante a coerção do valor salvo como JSON para a coluna da tabela, como tentar salvar a string `'asd'` em uma coluna de inteiro.

3. `nome tipo EXISTS PATH path`: Esta coluna retorna 1 se houver algum dado presente na localização especificada por *`path`*, e 0 caso contrário. *`tipo`* pode ser qualquer tipo de dado MySQL válido, mas normalmente deve ser especificado como alguma variedade de `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT").

4. `NESTED [PATH] path COLUMNS (column_list)`: Esta desfaz objetos ou arrays aninhados em dados JSON em uma única linha, juntamente com os valores JSON do objeto ou array pai. O uso de múltiplas opções de *`PATH`* permite a projeção de valores JSON de múltiplos níveis de aninhamento em uma única linha.

*`path`* está relativo à linha de caminho de tabela JSON do caminho pai de `JSON_TABLE()`, ou ao caminho do `NESTED [PATH]` cláusula pai, no caso de caminhos aninhados.

*`on empty`*, se especificado, determina o que *`JSON_TABLE()`* faz no caso de dados ausentes (dependendo do tipo). Esta cláusula também é acionada em uma coluna de uma cláusula `NESTED PATH` quando esta última não tem correspondência e uma linha complementada com `NULL` é produzida para ela. *`on empty`* aceita um dos seguintes valores:

* `NULL ON EMPTY`: A coluna é definida como `NULL`; este é o comportamento padrão.

* `DEFAULT json_string ON EMPTY`: o *`json_string`* fornecido é analisado como JSON, desde que seja válido, e armazenado em vez do valor ausente. As regras de tipo de coluna também se aplicam ao valor padrão.

* `ERROR ON EMPTY`: uma exceção é lançada.

Se usado, *`on_error`* aceita um dos seguintes valores com o resultado correspondente, conforme mostrado aqui:

* `NULL ON ERROR`: a coluna é definida como `NULL`; esse é o comportamento padrão.

* `DEFAULT json string ON ERROR`: o *`json_string`* é analisado como JSON (desde que seja válido) e armazenado em vez do objeto ou array.

* `ERROR ON ERROR`: uma exceção é lançada.

Especificar `ON ERROR` antes de `ON EMPTY` é não padrão e desaconselhado no MySQL; tentar faz com que o servidor emita uma mensagem de aviso. O suporte para a sintaxe não padrão deve ser removido em uma versão futura do MySQL.

Quando um valor salvo em uma coluna é truncado, como salvar 3.14159 em uma coluna `DECIMAL(10,1)` - DECIMAL, NUMERIC")", uma mensagem de aviso é emitida independentemente de qualquer opção `ON ERROR`. Quando vários valores são truncados em uma única instrução, a mensagem de aviso é emitida apenas uma vez.

Quando a expressão e o caminho passados para essa função resolvem em JSON null, `JSON_TABLE()` retorna SQL `NULL`, de acordo com o padrão SQL, conforme mostrado aqui:

```
mysql> SELECT *
    ->   FROM
    ->     JSON_TABLE(
    ->       '[ {"c1": null} ]',
    ->       '$[*]' COLUMNS( c1 INT PATH '$.c1' ERROR ON ERROR )
    ->     ) as jt;
+------+
| c1   |
+------+
| NULL |
+------+
1 row in set (0.00 sec)
```

A seguinte consulta demonstra o uso de `ON EMPTY` e `ON ERROR`. A linha correspondente a `{"b":1}` é vazia para o caminho `"$.a"`, e tentar salvar `[1,2]` como um escalar produz um erro; essas linhas são destacadas na saída mostrada.

```
mysql> SELECT *
    -> FROM
    ->   JSON_TABLE(
    ->     '[{"a":"3"},{"a":2},{"b":1},{"a":0},{"a":[1,2]}]',
    ->     "$[*]"
    ->     COLUMNS(
    ->       rowid FOR ORDINALITY,
    ->       ac VARCHAR(100) PATH "$.a" DEFAULT '111' ON EMPTY DEFAULT '999' ON ERROR,
    ->       aj JSON PATH "$.a" DEFAULT '{"x": 333}' ON EMPTY,
    ->       bx INT EXISTS PATH "$.b"
    ->     )
    ->   ) AS tt;

+-------+------+------------+------+
| rowid | ac   | aj         | bx   |
+-------+------+------------+------+
|     1 | 3    | "3"        |    0 |
|     2 | 2    | 2          |    0 |
|     3 | 111  | {"x": 333} |    1 |
|     4 | 0    | 0          |    0 |
|     5 | 999  | [1, 2]     |    0 |
+-------+------+------------+------+
5 rows in set (0.00 sec)
```

Os nomes das colunas estão sujeitos às regras e limitações usuais que regem os nomes de colunas de tabela. Veja a Seção 11.2, “Nomes de Objetos de Esquema”.

Todas as expressões JSON e de caminho JSON são verificadas quanto à validade; uma expressão inválida de qualquer tipo causa uma exceção.

Cada correspondência para o `*` seguido da palavra-chave `COLUMNS` mapeia para uma linha individual na tabela de resultados. Por exemplo, a seguinte consulta mostra o resultado mostrado aqui:

```
mysql> SELECT *
    -> FROM
    ->   JSON_TABLE(
    ->     '[{"x":2,"y":"8"},{"x":"3","y":"7"},{"x":"4","y":6}]',
    ->     "$[*]" COLUMNS(
    ->       xval VARCHAR(100) PATH "$.x",
    ->       yval VARCHAR(100) PATH "$.y"
    ->     )
    ->   ) AS  jt1;

+------+------+
| xval | yval |
+------+------+
| 2    | 8    |
| 3    | 7    |
| 4    | 6    |
+------+------+
```

A expressão `"$[*]"` corresponde a cada elemento do array. Você pode filtrar as linhas nos resultados modificando o caminho. Por exemplo, usando `"$[1]"` limita a extração ao segundo elemento do array JSON usado como fonte, como mostrado aqui:

```
mysql> SELECT *
    -> FROM
    ->   JSON_TABLE(
    ->     '[{"x":2,"y":"8"},{"x":"3","y":"7"},{"x":"4","y":6}]',
    ->     "$[1]" COLUMNS(
    ->       xval VARCHAR(100) PATH "$.x",
    ->       yval VARCHAR(100) PATH "$.y"
    ->     )
    ->   ) AS  jt1;

+------+------+
| xval | yval |
+------+------+
| 3    | 7    |
+------+------+
```

Dentro de uma definição de coluna, `"$"` passa todo o correspondente para a coluna; `"$.x"` e `"$.y"` passam apenas os valores correspondentes às chaves `x` e `y`, respectivamente, dentro desse correspondente. Para mais informações, consulte a Sintaxe de Caminhos JSON.

`NESTED PATH` (ou simplesmente `NESTED`; `PATH` é opcional) produz um conjunto de registros para cada correspondência na cláusula `COLUMNS` a que pertence. Se não houver correspondência, todas as colunas do caminho aninhado são definidas como `NULL`. Isso implementa uma união externa entre a cláusula mais alta e `NESTED [PATH]`. Uma união interna pode ser simulada aplicando uma condição adequada na cláusula `WHERE`, como mostrado aqui:

```
mysql> SELECT *
    -> FROM
    ->   JSON_TABLE(
    ->     '[ {"a": 1, "b": [11,111]}, {"a": 2, "b": [22,222]}, {"a":3}]',
    ->     '$[*]' COLUMNS(
    ->             a INT PATH '$.a',
    ->             NESTED PATH '$.b[*]' COLUMNS (b INT PATH '$')
    ->            )
    ->    ) AS jt
    -> WHERE b IS NOT NULL;

+------+------+
| a    | b    |
+------+------+
|    1 |   11 |
|    1 |  111 |
|    2 |   22 |
|    2 |  222 |
+------+------+
```

Caminhos aninhados de irmãos — ou seja, duas ou mais instâncias de `NESTED [PATH]` na mesma cláusula `COLUMNS` — são processados um após o outro, um de cada vez. Enquanto um caminho aninhado está produzindo registros, as colunas de qualquer expressão de caminho aninhado de irmãos são definidas como `NULL`. Isso significa que o número total de registros para uma única correspondência dentro de uma única cláusula `COLUMNS` é a soma e não o produto de todos os registros produzidos pelos modificadores `NESTED [PATH]`, como mostrado aqui:

```
mysql> SELECT *
    -> FROM
    ->   JSON_TABLE(
    ->     '[{"a": 1, "b": [11,111]}, {"a": 2, "b": [22,222]}]',
    ->     '$[*]' COLUMNS(
    ->         a INT PATH '$.a',
    ->         NESTED PATH '$.b[*]' COLUMNS (b1 INT PATH '$'),
    ->         NESTED PATH '$.b[*]' COLUMNS (b2 INT PATH '$')
    ->     )
    -> ) AS jt;

+------+------+------+
| a    | b1   | b2   |
+------+------+------+
|    1 |   11 | NULL |
|    1 |  111 | NULL |
|    1 | NULL |   11 |
|    1 | NULL |  111 |
|    2 |   22 | NULL |
|    2 |  222 | NULL |
|    2 | NULL |   22 |
|    2 | NULL |  222 |
+------+------+------+
```

Uma coluna `FOR ORDINALITY` enumera os registros produzidos pela cláusula `COLUMNS` e pode ser usada para distinguir registros pai de um caminho aninhado, especialmente se os valores nos registros pai forem os mesmos, como pode ser visto aqui:

```
mysql> SELECT *
    -> FROM
    ->   JSON_TABLE(
    ->     '[{"a": "a_val",
    '>       "b": [{"c": "c_val", "l": [1,2]}]},
    '>     {"a": "a_val",
    '>       "b": [{"c": "c_val","l": [11]}, {"c": "c_val", "l": [22]}]}]',
    ->     '$[*]' COLUMNS(
    ->       top_ord FOR ORDINALITY,
    ->       apath VARCHAR(10) PATH '$.a',
    ->       NESTED PATH '$.b[*]' COLUMNS (
    ->         bpath VARCHAR(10) PATH '$.c',
    ->         ord FOR ORDINALITY,
    ->         NESTED PATH '$.l[*]' COLUMNS (lpath varchar(10) PATH '$')
    ->         )
    ->     )
    -> ) as jt;

+---------+---------+---------+------+-------+
| top_ord | apath   | bpath   | ord  | lpath |
+---------+---------+---------+------+-------+
|       1 |  a_val  |  c_val  |    1 | 1     |
|       1 |  a_val  |  c_val  |    1 | 2     |
|       2 |  a_val  |  c_val  |    1 | 11    |
|       2 |  a_val  |  c_val  |    2 | 22    |
+---------+---------+---------+------+-------+
```

O documento fonte contém um array de dois elementos; cada um desses elementos produz duas linhas. Os valores de `apath` e `bpath` são os mesmos em todo o conjunto de resultados; isso significa que eles não podem ser usados para determinar se os valores de `lpath` vieram de pais iguais ou diferentes. O valor da coluna `ord` permanece o mesmo que o conjunto de registros que têm `top_ord` igual a 1, então esses dois valores são de um único objeto. Os dois valores restantes são de objetos diferentes, uma vez que têm valores diferentes na coluna `ord`.

Normalmente, você não pode realizar uma junção de uma tabela derivada que dependa de colunas de tabelas anteriores na mesma cláusula `FROM`. O MySQL, de acordo com o padrão SQL, faz uma exceção para funções de tabela; essas são consideradas tabelas derivadas laterais. Isso é implícito e, por essa razão, não é permitido antes de `JSON_TABLE()`, também de acordo com o padrão.

Suponha que você tenha uma tabela `t1` criada e preenchida usando as instruções mostradas aqui:

```
CREATE TABLE t1 (c1 INT, c2 CHAR(1), c3 JSON);

INSERT INTO t1 () VALUES
	ROW(1, 'z', JSON_OBJECT('a', 23, 'b', 27, 'c', 1)),
	ROW(1, 'y', JSON_OBJECT('a', 44, 'b', 22, 'c', 11)),
	ROW(2, 'x', JSON_OBJECT('b', 1, 'c', 15)),
	ROW(3, 'w', JSON_OBJECT('a', 5, 'b', 6, 'c', 7)),
	ROW(5, 'v', JSON_OBJECT('a', 123, 'c', 1111))
;
```

Você pode então executar junções, como esta, na qual `JSON_TABLE()` atua como uma tabela derivada enquanto, ao mesmo tempo, se refere a uma coluna em uma tabela referenciada anteriormente:

```
SELECT c1, c2, JSON_EXTRACT(c3, '$.*')
FROM t1 AS m
JOIN
JSON_TABLE(
  m.c3,
  '$.*'
  COLUMNS(
    at VARCHAR(10) PATH '$.a' DEFAULT '1' ON EMPTY,
    bt VARCHAR(10) PATH '$.b' DEFAULT '2' ON EMPTY,
    ct VARCHAR(10) PATH '$.c' DEFAULT '3' ON EMPTY
  )
) AS tt
ON m.c1 > tt.at;
```

Tentar usar a palavra-chave `LATERAL` com essa consulta gera `ER_PARSE_ERROR`.