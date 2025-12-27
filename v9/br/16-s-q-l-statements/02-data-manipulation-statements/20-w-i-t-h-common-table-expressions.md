### 15.2.2.2 COM (Expressões de Tabela Comuns)

Uma expressão de tabela comum (CTE, na sigla em inglês) é um conjunto de resultados temporário nomeado que existe no escopo de uma única instrução e que pode ser referenciado posteriormente nessa instrução, possivelmente várias vezes. A discussão a seguir descreve como escrever instruções que utilizam CTEs.

* Expressões de Tabela Comuns
* Expressões de Tabela Comuns Recursivas
* Limitação da Recursividade da Expressão de Tabela Comum
* Exemplos de Expressões de Tabela Comuns
* Expressões de Tabela Comuns Comparadas a Construções Semelhantes

Para obter informações sobre a otimização de CTEs, consulte a Seção 10.2.2.4, “Otimizando Tabelas Derivadas, Referências de Visual e Expressões de Tabela Comuns com Fusão ou Materialização”.

#### Expressões de Tabela Comuns

Para especificar expressões de tabela comuns, use uma cláusula `WITH`") que tenha uma ou mais cláusulas subscritas separadas por vírgula. Cada cláusula subscrita fornece uma subconsulta que produz um conjunto de resultados e associa um nome à subconsulta. O exemplo a seguir define CTEs nomeadas `cte1` e `cte2` na cláusula `WITH"") e as refere na instrução de nível superior `SELECT` que segue a cláusula `WITH"") :

```
WITH
  cte1 AS (SELECT a, b FROM table1),
  cte2 AS (SELECT c, d FROM table2)
SELECT b, d FROM cte1 JOIN cte2
WHERE cte1.a = cte2.c;
```

Na instrução que contém a cláusula `WITH""), cada nome de CTE pode ser referenciado para acessar o conjunto de resultados correspondente da CTE.

Um nome de CTE pode ser referenciado em outras CTEs, permitindo que CTEs sejam definidas com base em outras CTEs.

Uma CTE pode se referenciar a si mesma para definir uma CTE recursiva. Aplicações comuns de CTEs recursivas incluem a geração de séries e a navegação por dados hierárquicos ou estruturados em árvore.

As expressões de tabela comuns são uma parte opcional da sintaxe para instruções DML. Elas são definidas usando uma cláusula `WITH"") :

```
with_clause:
    WITH [RECURSIVE]
        cte_name [(col_name [, col_name] ...)] AS (subquery)
        [, cte_name [(col_name [, col_name] ...)] AS (subquery)] ...
```

* `cte_name`* nomeia uma única expressão de tabela comum e pode ser usado como referência de tabela na instrução que contém a cláusula `WITH"") .

A parte ``subquery`` de `AS (subquery)` é chamada de "subquery da CTE" e é o que produz o conjunto de resultados da CTE. As chaves entre parênteses após `AS` são necessárias.

Uma expressão comum de tabela é recursiva se sua subquery se referir ao próprio nome. A palavra-chave `RECURSIVE` deve ser incluída se qualquer CTE na cláusula `WITH`) for recursiva. Para mais informações, consulte Expressões de Tabela Comuns Recursivas.

A determinação dos nomes das colunas para uma CTE dada ocorre da seguinte forma:

* Se uma lista entre parênteses de nomes segue o nome da CTE, esses nomes são os nomes das colunas:

  ```
  WITH cte (col1, col2) AS
  (
    SELECT 1, 2
    UNION ALL
    SELECT 3, 4
  )
  SELECT col1, col2 FROM cte;
  ```

  O número de nomes na lista deve ser o mesmo que o número de colunas no conjunto de resultados.

* Caso contrário, os nomes das colunas vêm da lista de seleção do primeiro `SELECT` dentro da parte `AS (subquery)`:

  ```
  WITH cte AS
  (
    SELECT 1 AS col1, 2 AS col2
    UNION ALL
    SELECT 3, 4
  )
  SELECT col1, col2 FROM cte;
  ```

Uma cláusula `WITH`) é permitida nesses contextos:

* No início das instruções `SELECT`, `UPDATE` e `DELETE`.

  ```
  WITH ... SELECT ...
  WITH ... UPDATE ...
  WITH ... DELETE ...
  ```

* No início de subqueries (incluindo subqueries de tabela derivada):

  ```
  SELECT ... WHERE id IN (WITH ... SELECT ...) ...
  SELECT * FROM (WITH ... SELECT ...) AS dt ...
  ```

* Imediatamente antes de `SELECT` para instruções que incluem uma instrução `SELECT`:

  ```
  INSERT ... WITH ... SELECT ...
  REPLACE ... WITH ... SELECT ...
  CREATE TABLE ... WITH ... SELECT ...
  CREATE VIEW ... WITH ... SELECT ...
  DECLARE CURSOR ... WITH ... SELECT ...
  EXPLAIN ... WITH ... SELECT ...
  ```

Apenas uma cláusula `WITH`) é permitida no mesmo nível. `WITH`) seguido de `WITH`) no mesmo nível não é permitido, então isso é ilegal:

```
WITH cte1 AS (...) WITH cte2 AS (...) SELECT ...
```

Para tornar a instrução legal, use uma única cláusula `WITH`) que separa as subcláusulas por vírgula:

```
WITH cte1 AS (...), cte2 AS (...) SELECT ...
```

No entanto, uma instrução pode conter múltiplas cláusulas `WITH`) se ocorrerem em diferentes níveis:

```
WITH cte1 AS (SELECT 1)
SELECT * FROM (WITH cte2 AS (SELECT 2) SELECT * FROM cte2 JOIN cte1) AS dt;
```

Uma cláusula `WITH`) pode definir uma ou mais expressões de tabela comuns, mas cada nome de CTE deve ser único para a cláusula. Isso é ilegal:

```
WITH cte1 AS (...), cte1 AS (...) SELECT ...
```

Para tornar a instrução legal, defina as CTEs com nomes únicos:

```
WITH cte1 AS (...), cte2 AS (...) SELECT ...
```

Um CTE pode se referir a si mesmo ou a outros CTEs:

* Um CTE de autoreferência é recursivo.
* Um CTE pode se referir a CTEs definidas anteriormente na mesma cláusula `WITH")", mas não a aqueles definidos mais tarde.

Essa restrição exclui CTEs mutuamente recursivas, onde `cte1` referencia `cte2` e `cte2` referencia `cte1`. Uma dessas referências deve ser para um CTE definido mais tarde, o que não é permitido.

* Um CTE em um bloco de consulta dado pode se referir a CTEs definidas em blocos de consulta em um nível mais externo, mas não a CTEs definidas em blocos de consulta em um nível mais interno.

Para resolver referências a objetos com nomes iguais, as tabelas derivadas ocultam CTEs; e CTEs ocultam tabelas base, tabelas `TEMPORARY` e visualizações. A resolução de nomes ocorre procurando por objetos no mesmo bloco de consulta, e depois prosseguindo para blocos externos em ordem, enquanto nenhum objeto com o nome é encontrado.

Para considerações de sintaxe adicionais específicas para CTEs recursivas, consulte CTEs Comuns Recursivas.

#### CTEs Comuns Recursivas

Uma CTE comum recursiva é aquela que tem uma subconsulta que se refere ao seu próprio nome. Por exemplo:

```
WITH RECURSIVE cte (n) AS
(
  SELECT 1
  UNION ALL
  SELECT n + 1 FROM cte WHERE n < 5
)
SELECT * FROM cte;
```

Quando executada, a declaração produz este resultado, uma única coluna contendo uma sequência linear simples:

```
+------+
| n    |
+------+
|    1 |
|    2 |
|    3 |
|    4 |
|    5 |
+------+
```

Uma CTE recursiva tem essa estrutura:

* A cláusula `WITH` deve começar com `WITH RECURSIVE` se qualquer CTE na cláusula `WITH` se referir a si mesmo. (Se nenhum CTE se referir a si mesmo, `RECURSIVE` é permitido, mas não obrigatório.)

  Se você esquecer `RECURSIVE` para um CTE recursivo, este erro é um resultado provável:

  ```
  ERROR 1146 (42S02): Table 'cte_name' doesn't exist
  ```

* A subconsulta da CTE recursiva tem duas partes, separadas por `UNION ALL` ou `UNION [DISTINCT]`:

  ```
  SELECT ...      -- return initial row set
  UNION ALL
  SELECT ...      -- return additional row sets
  ```

O primeiro `SELECT` produz a(s) primeira(s) linha(s) do CTE e não faz referência ao nome do CTE. O segundo `SELECT` produz linhas adicionais e faz recursividade, fazendo referência ao nome do CTE na sua cláusula `FROM`. A recursividade termina quando essa parte não produz mais novas linhas. Assim, um CTE recursivo consiste em uma parte `SELECT` não recursiva seguida de uma parte `SELECT` recursiva.

Cada parte `SELECT` pode ser uma união de várias instruções `SELECT`.

* Os tipos das colunas do resultado do CTE são inferidos apenas pelos tipos das colunas da parte `SELECT` não recursiva, e as colunas são todas nulos. Para a determinação do tipo, a parte `SELECT` recursiva é ignorada.

* Se as partes não recursiva e recursiva forem separadas por `UNION DISTINCT`, as linhas duplicadas são eliminadas. Isso é útil para consultas que realizam fechamentos transitivos, para evitar loops infinitos.

* Cada iteração da parte recursiva opera apenas nas linhas produzidas pela iteração anterior. Se a parte recursiva tiver vários blocos de consulta, as iterações de cada bloco de consulta são agendadas em ordem não especificada, e cada bloco de consulta opera em linhas que foram produzidas pela sua iteração anterior ou por outros blocos de consulta desde o final daquela iteração anterior.

A subconsulta recursiva CTE mostrada anteriormente tem essa parte não recursiva que recupera uma única linha para produzir o conjunto de linhas inicial:

```
SELECT 1
```

A subconsulta CTE também tem essa parte recursiva:

```
SELECT n + 1 FROM cte WHERE n < 5
```

Em cada iteração, esse `SELECT` produz uma linha com um novo valor um maior que o valor de `n` da linha anterior do conjunto de linhas. A primeira iteração opera no conjunto de linhas inicial (`1`) e produz `1+1=2`; a segunda iteração opera no conjunto de linhas da primeira iteração (`2`) e produz `2+1=3`; e assim por diante. Isso continua até que a recursão termine, o que ocorre quando `n` não é mais menor que 5.

Se a parte recursiva de uma CTE produz valores mais amplos para uma coluna do que a parte não recursiva, pode ser necessário ampliar a coluna na parte não recursiva para evitar a redução de dados. Considere esta declaração:

```
WITH RECURSIVE cte AS
(
  SELECT 1 AS n, 'abc' AS str
  UNION ALL
  SELECT n + 1, CONCAT(str, str) FROM cte WHERE n < 3
)
SELECT * FROM cte;
```

No modo SQL não estrito, a declaração produz esta saída:

```
+------+------+
| n    | str  |
+------+------+
|    1 | abc  |
|    2 | abc  |
|    3 | abc  |
+------+------+
```

Os valores da coluna `str` são todos `'abc'` porque a parte não recursiva do `SELECT` determina as larguras das colunas. Consequentemente, os valores `str` mais amplos produzidos pelo `SELECT` recursivo são truncados.

No modo SQL estrito, a declaração produz um erro:

```
ERROR 1406 (22001): Data too long for column 'str' at row 1
```

Para resolver esse problema, para que a declaração não produza truncações ou erros, use `CAST()` na parte não recursiva do `SELECT` para ampliar a coluna `str`:

```
WITH RECURSIVE cte AS
(
  SELECT 1 AS n, CAST('abc' AS CHAR(20)) AS str
  UNION ALL
  SELECT n + 1, CONCAT(str, str) FROM cte WHERE n < 3
)
SELECT * FROM cte;
```

Agora a declaração produz este resultado, sem truncações:

```
+------+--------------+
| n    | str          |
+------+--------------+
|    1 | abc          |
|    2 | abcabc       |
|    3 | abcabcabcabc |
+------+--------------+
```

As colunas são acessadas por nome, não por posição, o que significa que as colunas na parte recursiva podem acessar colunas na parte não recursiva que têm uma posição diferente, como ilustra essa CTE:

```
WITH RECURSIVE cte AS
(
  SELECT 1 AS n, 1 AS p, -1 AS q
  UNION ALL
  SELECT n + 1, q * 2, p * 2 FROM cte WHERE n < 5
)
SELECT * FROM cte;
```

Como `p` em uma linha é derivado de `q` na linha anterior, e vice-versa, os valores positivos e negativos trocam de posição em cada linha subsequente do resultado:

```
+------+------+------+
| n    | p    | q    |
+------+------+------+
|    1 |    1 |   -1 |
|    2 |   -2 |    2 |
|    3 |    4 |   -4 |
|    4 |   -8 |    8 |
|    5 |   16 |  -16 |
+------+------+------+
```

Algumas restrições de sintaxe se aplicam dentro das subconsultas recursivas de CTE:

* A parte recursiva do `SELECT` não deve conter essas construções:

+ Funções agregadas como `SUM()`
  + Funções de janela
  + `GROUP BY`
  + `ORDER BY`
  + `DISTINCT`

  A parte `SELECT` recursiva de uma CTE recursiva também pode usar uma cláusula `LIMIT`, juntamente com uma cláusula `OFFSET` opcional. O efeito no conjunto de resultados é o mesmo quando se usa `LIMIT` na cláusula `SELECT` mais externa, mas também é mais eficiente, pois usar com a `SELECT` recursiva para parar a geração de linhas assim que o número solicitado de elas tiver sido produzido.

  A proibição de `DISTINCT` aplica-se apenas aos membros da `UNION`; `UNION DISTINCT` é permitido.

* A parte `SELECT` recursiva deve referenciar a CTE apenas uma vez e apenas na sua cláusula `FROM`, não em nenhuma subconsulta. Pode referenciar tabelas diferentes da CTE e uni-las com a CTE. Se usada em uma junção assim, a CTE não deve estar no lado direito de uma `LEFT JOIN`.

Essas restrições vêm do padrão SQL, exceto pelas exclusões específicas do MySQL mencionadas anteriormente.

Para CTEs recursivas, as linhas de saída do `EXPLAIN` para partes `SELECT` recursivas exibem `Recursive` na coluna `Extra`.

As estimativas de custo exibidas pelo `EXPLAIN` representam o custo por iteração, o que pode diferir consideravelmente do custo total. O otimizador não pode prever o número de iterações porque não pode prever em que ponto a cláusula `WHERE` se torna falsa.

O custo real da CTE também pode ser afetado pelo tamanho do conjunto de resultados. Uma CTE que produz muitas linhas pode exigir uma tabela temporária interna grande o suficiente para ser convertida do formato de memória para o formato de disco e pode sofrer uma penalidade de desempenho. Se assim for, aumentar o tamanho permitido da tabela temporária de memória pode melhorar o desempenho; veja a Seção 10.4.4, “Uso de Tabelas Temporárias Internas no MySQL”.

#### Limitação da Recursividade da Expressão de Tabela Comum
[Fim da tradução]

É importante que CTEs recursivas incluam uma condição de término da recursão na parte `SELECT` recursiva. Como uma técnica de desenvolvimento para evitar uma recursão excessiva de CTEs, você pode forçar o término colocando um limite de tempo de execução:

* A variável de sistema `cte_max_recursion_depth` impõe um limite no número de níveis de recursão para CTEs. O servidor termina a execução de qualquer CTE que recursar mais níveis do que o valor dessa variável.

* A variável de sistema `max_execution_time` impõe um tempo de espera de execução para as instruções `SELECT` executadas dentro da sessão atual.

* A dica de otimização `MAX_EXECUTION_TIME` impõe um tempo de espera de execução por consulta para a instrução `SELECT` na qual aparece.

Suponha que uma CTE recursiva seja escrita por engano sem uma condição de término da recursão:

```
WITH RECURSIVE cte (n) AS
(
  SELECT 1
  UNION ALL
  SELECT n + 1 FROM cte
)
SELECT * FROM cte;
```

Por padrão, `cte_max_recursion_depth` tem um valor de 1000, fazendo com que a CTE termine quando recursar mais de 1000 níveis. As aplicações podem alterar o valor da sessão para ajustar às suas necessidades:

```
SET SESSION cte_max_recursion_depth = 10;      -- permit only shallow recursion
SET SESSION cte_max_recursion_depth = 1000000; -- permit deeper recursion
```

Você também pode definir o valor global de `cte_max_recursion_depth` para afetar todas as sessões que começarem posteriormente.

Para consultas que executam e, portanto, recursam lentamente ou em contextos para os quais há motivo para definir o valor de `cte_max_recursion_depth` muito alto, outra maneira de evitar a recursão profunda é definir um tempo de espera por sessão. Para fazer isso, execute uma instrução como esta antes de executar a instrução CTE:

```
SET max_execution_time = 1000; -- impose one second timeout
```

Alternativamente, inclua uma dica de otimização dentro da própria instrução CTE:

```
WITH RECURSIVE cte (n) AS
(
  SELECT 1
  UNION ALL
  SELECT n + 1 FROM cte
)
SELECT /*+ SET_VAR(cte_max_recursion_depth = 1M) */ * FROM cte;

WITH RECURSIVE cte (n) AS
(
  SELECT 1
  UNION ALL
  SELECT n + 1 FROM cte
)
SELECT /*+ MAX_EXECUTION_TIME(1000) */ * FROM cte;
```

Você também pode usar `LIMIT` dentro da consulta recursiva para impor um número máximo de linhas a serem retornadas ao `SELECT` mais externo, por exemplo:

```
WITH RECURSIVE cte (n) AS
(
  SELECT 1
  UNION ALL
  SELECT n + 1 FROM cte LIMIT 10000
)
SELECT * FROM cte;
```

Você pode fazer isso além ou em vez de definir um limite de tempo. Assim, o seguinte CTE termina após retornar dez mil linhas ou executar por um segundo (1000 milissegundos), o que ocorrer primeiro:

```
WITH RECURSIVE cte (n) AS
(
  SELECT 1
  UNION ALL
  SELECT n + 1 FROM cte LIMIT 10000
)
SELECT /*+ MAX_EXECUTION_TIME(1000) */ * FROM cte;
```

Se uma consulta recursiva sem um limite de tempo de execução entrar em um loop infinito, você pode terminá-la de outra sessão usando `KILL QUERY`. Dentro da própria sessão, o programa cliente usado para executar a consulta pode fornecer uma maneira de matar a consulta. Por exemplo, no **mysql**, digitar **Control+C** interrompe a declaração atual.

#### Exemplos de Expressão Comum de Tabela Recursiva

Como mencionado anteriormente, expressões comuns de tabela recursivas (CTEs) são frequentemente usadas para geração de séries e navegação por dados hierárquicos ou estruturados em árvore. Esta seção mostra alguns exemplos simples dessas técnicas.

* Geração de Série de Fibonacci
* Geração de Série de Datas
* Navegação por Dados Hierárquicos

##### Geração de Série de Fibonacci

Uma série de Fibonacci começa com os dois números 0 e 1 (ou 1 e 1) e cada número após isso é a soma dos dois números anteriores. Uma expressão comum de tabela recursiva pode gerar uma série de Fibonacci se cada linha produzida pela `SELECT` recursiva tiver acesso aos dois números anteriores da série. O seguinte CTE gera uma série de 10 números usando 0 e 1 como os dois primeiros números:

```
WITH RECURSIVE fibonacci (n, fib_n, next_fib_n) AS
(
  SELECT 1, 0, 1
  UNION ALL
  SELECT n + 1, next_fib_n, fib_n + next_fib_n
    FROM fibonacci WHERE n < 10
)
SELECT * FROM fibonacci;
```

O CTE produz este resultado:

```
+------+-------+------------+
| n    | fib_n | next_fib_n |
+------+-------+------------+
|    1 |     0 |          1 |
|    2 |     1 |          1 |
|    3 |     1 |          2 |
|    4 |     2 |          3 |
|    5 |     3 |          5 |
|    6 |     5 |          8 |
|    7 |     8 |         13 |
|    8 |    13 |         21 |
|    9 |    21 |         34 |
|   10 |    34 |         55 |
+------+-------+------------+
```

Como o CTE funciona:

* `n` é uma coluna de exibição para indicar que a linha contém o `n`-ésimo número de Fibonacci. Por exemplo, o 8º número de Fibonacci é 13.

* A coluna `fib_n` exibe o número de Fibonacci `n`.

* A coluna `next_fib_n` exibe o próximo número de Fibonacci após o número `n`. Essa coluna fornece o próximo valor da série para a próxima linha, para que essa linha possa calcular a soma dos dois valores anteriores da série em sua coluna `fib_n`.

* A recorrência termina quando `n` atinge 10. Essa é uma escolha arbitrária, para limitar a saída a um pequeno conjunto de linhas.

A saída anterior mostra o resultado completo da CTE. Para selecionar apenas uma parte dele, adicione uma cláusula `WHERE` ao `SELECT` de nível superior. Por exemplo, para selecionar o 8º número de Fibonacci, faça isso:

```
mysql> WITH RECURSIVE fibonacci ...
       ...
       SELECT fib_n FROM fibonacci WHERE n = 8;
+-------+
| fib_n |
+-------+
|    13 |
+-------+
```

##### Geração de Série de Datas

Uma expressão de tabela comum pode gerar uma série de datas consecutivas, o que é útil para gerar resumos que incluem uma linha para todas as datas na série, incluindo datas não representadas nos dados resumidos.

Suponha que uma tabela de números de vendas contenha essas linhas:

```
mysql> SELECT * FROM sales ORDER BY date, price;
+------------+--------+
| date       | price  |
+------------+--------+
| 2017-01-03 | 100.00 |
| 2017-01-03 | 200.00 |
| 2017-01-06 |  50.00 |
| 2017-01-08 |  10.00 |
| 2017-01-08 |  20.00 |
| 2017-01-08 | 150.00 |
| 2017-01-10 |   5.00 |
+------------+--------+
```

Esta consulta resume as vendas por dia:

```
mysql> SELECT date, SUM(price) AS sum_price
       FROM sales
       GROUP BY date
       ORDER BY date;
+------------+-----------+
| date       | sum_price |
+------------+-----------+
| 2017-01-03 |    300.00 |
| 2017-01-06 |     50.00 |
| 2017-01-08 |    180.00 |
| 2017-01-10 |      5.00 |
+------------+-----------+
```

No entanto, esse resultado contém "buracos" para datas não representadas no intervalo de datas abrangido pela tabela. Um resultado que representa todas as datas no intervalo pode ser produzido usando uma CTE recursiva para gerar esse conjunto de datas, unido com uma `LEFT JOIN` aos dados de vendas.

Aqui está a CTE para gerar a série de intervalo de datas:

```
WITH RECURSIVE dates (date) AS
(
  SELECT MIN(date) FROM sales
  UNION ALL
  SELECT date + INTERVAL 1 DAY FROM dates
  WHERE date + INTERVAL 1 DAY <= (SELECT MAX(date) FROM sales)
)
SELECT * FROM dates;
```

A CTE produz esse resultado:

```
+------------+
| date       |
+------------+
| 2017-01-03 |
| 2017-01-04 |
| 2017-01-05 |
| 2017-01-06 |
| 2017-01-07 |
| 2017-01-08 |
| 2017-01-09 |
| 2017-01-10 |
+------------+
```

Como a CTE funciona:

* A consulta não recursiva produz a data mais baixa no intervalo de datas abrangido pela tabela `sales`.

* Cada linha produzida pela consulta recursiva adiciona um dia à data produzida pela linha anterior.

* A recorrência termina após as datas atingirem a data mais alta no intervalo de datas abrangido pela tabela `sales`.

Unindo a CTE com uma `LEFT JOIN` contra a tabela `sales` produz o resumo das vendas com uma linha para cada data no intervalo:

```
WITH RECURSIVE dates (date) AS
(
  SELECT MIN(date) FROM sales
  UNION ALL
  SELECT date + INTERVAL 1 DAY FROM dates
  WHERE date + INTERVAL 1 DAY <= (SELECT MAX(date) FROM sales)
)
SELECT dates.date, COALESCE(SUM(price), 0) AS sum_price
FROM dates LEFT JOIN sales ON dates.date = sales.date
GROUP BY dates.date
ORDER BY dates.date;
```

A saída parece assim:

```
+------------+-----------+
| date       | sum_price |
+------------+-----------+
| 2017-01-03 |    300.00 |
| 2017-01-04 |      0.00 |
| 2017-01-05 |      0.00 |
| 2017-01-06 |     50.00 |
| 2017-01-07 |      0.00 |
| 2017-01-08 |    180.00 |
| 2017-01-09 |      0.00 |
| 2017-01-10 |      5.00 |
+------------+-----------+
```

Alguns pontos a notar:

* As consultas são ineficientes, especialmente a que contém a subconsulta `MAX()` executada para cada linha no `SELECT` recursivo? O `EXPLAIN` mostra que a subconsulta que contém `MAX()` é avaliada apenas uma vez e o resultado é armazenado em cache.

* O uso de `COALESCE()` evita exibir `NULL` na coluna `sum_price` nos dias em que não há dados de vendas na tabela `sales`.

##### Travessia de Dados Hierárquicos

Expressões de tabela comuns recursivas são úteis para percorrer dados que formam uma hierarquia. Considere estas instruções que criam um conjunto de dados pequeno que mostra, para cada funcionário de uma empresa, o nome e o número de ID do funcionário, e o ID do gerente do funcionário. O funcionário de nível superior (o CEO) tem um ID de gerente `NULL` (sem gerente).

```
CREATE TABLE employees (
  id         INT PRIMARY KEY NOT NULL,
  name       VARCHAR(100) NOT NULL,
  manager_id INT NULL,
  INDEX (manager_id),
FOREIGN KEY (manager_id) REFERENCES employees (id)
);
INSERT INTO employees VALUES
(333, "Yasmina", NULL),  # Yasmina is the CEO (manager_id is NULL)
(198, "John", 333),      # John has ID 198 and reports to 333 (Yasmina)
(692, "Tarek", 333),
(29, "Pedro", 198),
(4610, "Sarah", 29),
(72, "Pierre", 29),
(123, "Adil", 692);
```

O conjunto de dados resultante parece assim:

```
mysql> SELECT * FROM employees ORDER BY id;
+------+---------+------------+
| id   | name    | manager_id |
+------+---------+------------+
|   29 | Pedro   |        198 |
|   72 | Pierre  |         29 |
|  123 | Adil    |        692 |
|  198 | John    |        333 |
|  333 | Yasmina |       NULL |
|  692 | Tarek   |        333 |
| 4610 | Sarah   |         29 |
+------+---------+------------+
```

Para produzir o organograma com a cadeia de gerenciamento para cada funcionário (ou seja, o caminho do CEO ao funcionário), use uma CTE recursiva:

```
WITH RECURSIVE employee_paths (id, name, path) AS
(
  SELECT id, name, CAST(id AS CHAR(200))
    FROM employees
    WHERE manager_id IS NULL
  UNION ALL
  SELECT e.id, e.name, CONCAT(ep.path, ',', e.id)
    FROM employee_paths AS ep JOIN employees AS e
      ON ep.id = e.manager_id
)
SELECT * FROM employee_paths ORDER BY path;
```

A CTE produz esta saída:

```
+------+---------+-----------------+
| id   | name    | path            |
+------+---------+-----------------+
|  333 | Yasmina | 333             |
|  198 | John    | 333,198         |
|   29 | Pedro   | 333,198,29      |
| 4610 | Sarah   | 333,198,29,4610 |
|   72 | Pierre  | 333,198,29,72   |
|  692 | Tarek   | 333,692         |
|  123 | Adil    | 333,692,123     |
+------+---------+-----------------+
```

Como a CTE funciona:

* A consulta não recursiva produz a linha para o CEO (a linha com um ID de gerente `NULL`).

  A coluna `path` é ampliada para `CHAR(200)` para garantir que haja espaço para os valores de `path` mais longos produzidos pela CTE recursiva.

* Cada linha produzida pela CTE recursiva encontra todos os funcionários que relatam diretamente a um funcionário produzido por uma linha anterior. Para cada funcionário assim, a linha inclui o ID e o nome do funcionário, e a cadeia de gerenciamento do funcionário. A cadeia é a cadeia do gerente, com o ID do funcionário adicionado ao final.

* A recursão termina quando os funcionários não têm outros que relatem a eles.

Para encontrar o caminho de um funcionário específico ou de vários funcionários, adicione uma cláusula `WHERE` ao `SELECT` de nível superior. Por exemplo, para exibir os resultados para Tarek e Sarah, modifique esse `SELECT` da seguinte maneira:

```
mysql> WITH RECURSIVE ...
       ...
       SELECT * FROM employees_extended
       WHERE id IN (692, 4610)
       ORDER BY path;
+------+-------+-----------------+
| id   | name  | path            |
+------+-------+-----------------+
| 4610 | Sarah | 333,198,29,4610 |
|  692 | Tarek | 333,692         |
+------+-------+-----------------+
```

#### Expressões de Tabela Comuns Comparadas a Construções Semelhantes

As expressões de tabela comum (CTE, na sigla em inglês) são semelhantes às tabelas derivadas de algumas maneiras:

* Ambas as construções são nomeadas.
* Ambas as construções existem para o escopo de uma única instrução.

Devido a essas semelhanças, as CTEs e as tabelas derivadas podem ser usadas de forma intercambiável frequentemente. Como exemplo trivial, essas instruções são equivalentes:

```
WITH cte AS (SELECT 1) SELECT * FROM cte;
SELECT * FROM (SELECT 1) AS dt;
```

No entanto, as CTEs têm algumas vantagens em relação às tabelas derivadas:

* Uma tabela derivada pode ser referenciada apenas uma vez dentro de uma consulta. Uma CTE pode ser referenciada várias vezes. Para usar múltiplas instâncias de um resultado de tabela derivada, você deve derivar o resultado várias vezes.

* Uma CTE pode ser autoreferenciada (recursiva).
* Uma CTE pode referenciar outra.
* Uma CTE pode ser mais fácil de ler quando sua definição aparece no início da instrução em vez de embutida nela.

As CTEs são semelhantes às tabelas criadas com `CREATE [TEMPORARY] TABLE`, mas não precisam ser definidas ou descartadas explicitamente. Para uma CTE, você não precisa de privilégios para criar tabelas.