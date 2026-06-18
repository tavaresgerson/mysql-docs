### 15.2.20 COM (Expressões de Tabela Comum)

Uma expressão de tabela comum (CTE, na sigla em inglês) é um conjunto de resultados temporário nomeado que existe dentro do escopo de uma única instrução e que pode ser referenciado posteriormente dentro dessa instrução, possivelmente várias vezes. A discussão a seguir descreve como escrever instruções que utilizam CTEs.

- Expressões de Tabela Comuns
- Expressões Comuns de Tabela Recorrentes
- Limitar a Recursividade da Expressão de Tabela Comum
- Exemplos de Expressão Comum de Tabela Recursiva
- Expressões de Tabela Comuns Comparadas a Construções Semelhantes

Para obter informações sobre a otimização de CTE, consulte a Seção 10.2.2.4, “Otimizando tabelas derivadas, referências de visualização e expressões de tabela comuns com fusão ou materialização”.

#### Recursos adicionais

Esses artigos contêm informações adicionais sobre o uso de CTEs no MySQL, incluindo muitos exemplos:

- MySQL 8.0 Labs: Expressões de Tabela Recorsivas (CTEs) no MySQL

- MySQL 8.0 Labs: \[Recursivo] Expressões de Tabela Comuns no MySQL (CTEs), Parte Dois – como gerar séries

- MySQL 8.0 Labs: \[Recursivo] Expressões de Tabela Comuns no MySQL (CTEs), Parte Três – hierarquias

- MySQL 8.0.1: \[Recursivo] Expressões de Tabela Comuns no MySQL (CTEs), Parte Quatro – Traversal de primeira profundidade ou de primeira largura, fechamento transitivo, evitação de ciclos

#### Expressões de Tabela Comuns

Para especificar expressões de tabela comuns, use uma cláusula `WITH`") que tenha uma ou mais subcláusulas separadas por vírgula. Cada subcláusula fornece uma subconsulta que produz um conjunto de resultados e associa um nome à subconsulta. O exemplo seguinte define CTEs chamadas `cte1` e `cte2` na cláusula `WITH`") e as refere no nível superior `SELECT` que segue a cláusula `WITH`").

```
WITH
  cte1 AS (SELECT a, b FROM table1),
  cte2 AS (SELECT c, d FROM table2)
SELECT b, d FROM cte1 JOIN cte2
WHERE cte1.a = cte2.c;
```

Na declaração que contém a cláusula `WITH`") cada nome de CTE pode ser referenciado para acessar o conjunto de resultados correspondente do CTE.

Um nome de CTE pode ser referenciado em outros CTEs, permitindo que os CTEs sejam definidos com base em outros CTEs.

Um CTE pode se referir a si mesmo para definir um CTE recursivo. Aplicações comuns de CTEs recursivos incluem a geração de séries e a navegação por dados hierárquicos ou estruturados em árvore.

As expressões de tabela comuns são uma parte opcional da sintaxe para instruções DML. Elas são definidas usando uma cláusula `WITH`").

```
with_clause:
    WITH [RECURSIVE]
        cte_name [(col_name [, col_name] ...)] AS (subquery)
        [, cte_name [(col_name [, col_name] ...)] AS (subquery)] ...
```

`cte_name` nomeia uma única expressão de tabela comum e pode ser usado como referência de tabela na declaração que contém a cláusula `WITH`")

A parte `subquery` de `AS (subquery)` é chamada de "subconsulta da CTE" e é o que produz o conjunto de resultados da CTE. As chaves de parênteses que seguem `AS` são necessárias.

Uma expressão de tabela recursiva é aquela em que a subconsulta faz referência ao próprio nome. A palavra-chave `RECURSIVE` deve ser incluída se qualquer CTE na cláusula `WITH`") for recursiva. Para obter mais informações, consulte Expressões de Tabela Comuns Recursivas.

A determinação dos nomes das colunas para um CTE específico ocorre da seguinte forma:

- Se uma lista entre parênteses de nomes segue o nome do CTE, esses nomes são os nomes das colunas:

  ```
  WITH cte (col1, col2) AS
  (
    SELECT 1, 2
    UNION ALL
    SELECT 3, 4
  )
  SELECT col1, col2 FROM cte;
  ```

  O número de nomes na lista deve ser igual ao número de colunas no conjunto de resultados.

- Caso contrário, os nomes das colunas vêm da lista de seleção do primeiro `SELECT` dentro da parte `AS (subquery)`:

  ```
  WITH cte AS
  (
    SELECT 1 AS col1, 2 AS col2
    UNION ALL
    SELECT 3, 4
  )
  SELECT col1, col2 FROM cte;
  ```

Uma cláusula `WITH`") é permitida nesses contextos:

- No início das instruções `SELECT`, `UPDATE` e `DELETE`.

  ```
  WITH ... SELECT ...
  WITH ... UPDATE ...
  WITH ... DELETE ...
  ```

- No início de subconsultas (incluindo subconsultas de tabelas derivadas):

  ```
  SELECT ... WHERE id IN (WITH ... SELECT ...) ...
  SELECT * FROM (WITH ... SELECT ...) AS dt ...
  ```

- Imediatamente antes de `SELECT` para declarações que incluem uma declaração `SELECT`:

  ```
  INSERT ... WITH ... SELECT ...
  REPLACE ... WITH ... SELECT ...
  CREATE TABLE ... WITH ... SELECT ...
  CREATE VIEW ... WITH ... SELECT ...
  DECLARE CURSOR ... WITH ... SELECT ...
  EXPLAIN ... WITH ... SELECT ...
  ```

Apenas uma cláusula `WITH`") é permitida no mesmo nível. `WITH`") seguida de `WITH`") no mesmo nível não é permitida, portanto, isso é ilegal:

```
WITH cte1 AS (...) WITH cte2 AS (...) SELECT ...
```

Para tornar a declaração legal, use uma única cláusula `WITH`") que separa as subcláusulas por vírgula:

```
WITH cte1 AS (...), cte2 AS (...) SELECT ...
```

No entanto, uma declaração pode conter múltiplas cláusulas `WITH`") se elas ocorrerem em diferentes níveis:

```
WITH cte1 AS (SELECT 1)
SELECT * FROM (WITH cte2 AS (SELECT 2) SELECT * FROM cte2 JOIN cte1) AS dt;
```

Uma cláusula `WITH`") pode definir uma ou mais expressões de tabela comuns, mas cada nome de CTE deve ser único para a cláusula. Isso é ilegal:

```
WITH cte1 AS (...), cte1 AS (...) SELECT ...
```

Para tornar a declaração legal, defina os CTEs com nomes únicos:

```
WITH cte1 AS (...), cte2 AS (...) SELECT ...
```

Um CTE pode se referir a si mesmo ou a outros CTEs:

- Um CTE auto-referencial é recursivo.

- Um CTE pode se referir a CTEs definidas anteriormente na mesma cláusula `WITH`", mas não a aquelas definidas posteriormente.

  Essa restrição exclui CTEs mutuamente recursivas, onde `cte1` faz referência a `cte2` e `cte2` faz referência a `cte1`. Uma dessas referências deve ser para um CTE definido mais tarde, o que não é permitido.

- Um CTE em um bloco de consulta específico pode se referir a CTEs definidas em blocos de consulta em um nível mais externo, mas não a CTEs definidas em blocos de consulta em um nível mais interno.

Para resolver referências a objetos com nomes iguais, as tabelas derivadas ocultam CTEs; e as CTEs ocultam tabelas base, tabelas `TEMPORARY` e visualizações. A resolução de nomes ocorre procurando por objetos no mesmo bloco de consulta, e, em seguida, prosseguindo para blocos externos, uma a uma, até que nenhum objeto com o nome seja encontrado.

Assim como as tabelas derivadas, uma CTE não pode conter referências externas antes do MySQL 8.0.14. Essa é uma restrição do MySQL que foi removida no MySQL 8.0.14, e não uma restrição do padrão SQL. Para obter informações adicionais sobre considerações de sintaxe específicas para CTEs recursivas, consulte Expressões de Tabela Comum Recursivas.

#### Expressões Comuns de Tabela Recorrentes

Uma expressão comum de tabela recursiva é aquela que possui uma subconsulta que se refere ao próprio nome. Por exemplo:

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

Um CTE recursivo tem essa estrutura:

- A cláusula `WITH` deve começar com `WITH RECURSIVE` se qualquer CTE na cláusula `WITH` se referir a si mesma. (Se nenhum CTE se referir a si mesmo, `RECURSIVE` é permitido, mas não é obrigatório.)

  Se você esquecer `RECURSIVE` para um CTE recursivo, este erro é um resultado provável:

  ```
  ERROR 1146 (42S02): Table 'cte_name' doesn't exist
  ```

- A subconsulta recursiva CTE tem duas partes, separadas por `UNION ALL` ou `UNION [DISTINCT]`:

  ```
  SELECT ...      -- return initial row set
  UNION ALL
  SELECT ...      -- return additional row sets
  ```

  O primeiro `SELECT` produz a(s) primeira(s) linha(s) para o CTE e não se refere ao nome do CTE. O segundo `SELECT` produz linhas adicionais e faz recursividade, referenciando o nome do CTE na sua cláusula `FROM`. A recursividade termina quando esta parte não produz mais novas linhas. Assim, um CTE recursivo consiste em uma parte não recursiva `SELECT` seguida por uma parte recursiva `SELECT`.

  Cada parte `SELECT` pode ser, por si só, uma união de múltiplas declarações `SELECT`.

- Os tipos das colunas dos resultados do CTE são inferidos apenas pelos tipos das colunas da parte não recursiva `SELECT` e todas as colunas são nulos. Para a determinação do tipo, a parte recursiva `SELECT` é ignorada.

- Se as partes não recursivas e recursivas forem separadas por `UNION DISTINCT`, as linhas duplicadas serão eliminadas. Isso é útil para consultas que realizam fechamentos transitivos, para evitar loops infinitos.

- Cada iteração da parte recursiva opera apenas nas linhas produzidas pela iteração anterior. Se a parte recursiva tiver vários blocos de consulta, as iterações de cada bloco de consulta são agendadas em ordem não especificada, e cada bloco de consulta opera em linhas que foram produzidas pela sua iteração anterior ou por outros blocos de consulta desde o final daquela iteração anterior.

A subconsulta recursiva CTE mostrada anteriormente tem essa parte não recursiva que recupera uma única linha para produzir o conjunto de linhas inicial:

```
SELECT 1
```

A subconsulta do CTE também tem essa parte recursiva:

```
SELECT n + 1 FROM cte WHERE n < 5
```

Em cada iteração, o `SELECT` produz uma linha com um novo valor um maior que o valor de `n` da linha anterior do conjunto. A primeira iteração opera no conjunto inicial de linhas (`1`) e produz `1+1=2`; a segunda iteração opera no conjunto de linhas da primeira iteração (`2`) e produz `2+1=3`; e assim por diante. Isso continua até que a recursão termine, o que ocorre quando `n` não for mais menor que 5.

Se a parte recursiva de um CTE produzir valores mais amplos para uma coluna do que a parte não recursiva, pode ser necessário ampliar a coluna na parte não recursiva para evitar o corte de dados. Considere esta declaração:

```
WITH RECURSIVE cte AS
(
  SELECT 1 AS n, 'abc' AS str
  UNION ALL
  SELECT n + 1, CONCAT(str, str) FROM cte WHERE n < 3
)
SELECT * FROM cte;
```

No modo SQL não estrito, a instrução produz esta saída:

```
+------+------+
| n    | str  |
+------+------+
|    1 | abc  |
|    2 | abc  |
|    3 | abc  |
+------+------+
```

Os valores da coluna `str` são todos `'abc'` porque o `SELECT` não recursivo determina as larguras das colunas. Consequentemente, os valores mais largos do `str` produzidos pelo `SELECT` recursivo são truncados.

No modo SQL estrito, a instrução produz um erro:

```
ERROR 1406 (22001): Data too long for column 'str' at row 1
```

Para resolver esse problema, para que a declaração não produza truncações ou erros, use `CAST()` no `SELECT` não recursivo para tornar a coluna `str` mais larga:

```
WITH RECURSIVE cte AS
(
  SELECT 1 AS n, CAST('abc' AS CHAR(20)) AS str
  UNION ALL
  SELECT n + 1, CONCAT(str, str) FROM cte WHERE n < 3
)
SELECT * FROM cte;
```

Agora, a declaração produz esse resultado, sem corte:

```
+------+--------------+
| n    | str          |
+------+--------------+
|    1 | abc          |
|    2 | abcabc       |
|    3 | abcabcabcabc |
+------+--------------+
```

As colunas são acessadas pelo nome, e não pela posição, o que significa que as colunas da parte recursiva podem acessar colunas da parte não recursiva que têm uma posição diferente, como ilustra este CTE:

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

Algumas restrições de sintaxe se aplicam em subconsultas de CTE recursiva:

- A parte recursiva `SELECT` não deve conter esses constructos:

  - Funções agregadas como `SUM()`
  - Funções de janela
  - `GROUP BY`
  - `ORDER BY`
  - `DISTINCT`

  Antes do MySQL 8.0.19, a parte recursiva `SELECT` de uma CTE recursiva também não podia usar uma cláusula `LIMIT`. Essa restrição foi removida no MySQL 8.0.19, e agora a cláusula `LIMIT` é suportada nesses casos, juntamente com uma cláusula opcional `OFFSET`. O efeito no conjunto de resultados é o mesmo quando se usa `LIMIT` no `SELECT` mais externo, mas também é mais eficiente, pois usar com a `SELECT` recursiva interrompe a geração de linhas assim que o número solicitado de linhas tiver sido produzido.

  Essas restrições não se aplicam à parte não recursiva do CTE recursivo `SELECT`. A proibição do `DISTINCT` se aplica apenas aos membros do `UNION`; o `UNION DISTINCT` é permitido.

- A parte recursiva `SELECT` deve referenciar o CTE apenas uma vez e apenas na sua cláusula `FROM`, não em nenhuma subconsulta. Pode referenciar tabelas diferentes do CTE e unir-se a elas com o CTE. Se for usado em uma junção assim, o CTE não deve estar do lado direito de um `LEFT JOIN`.

Essas restrições são provenientes do padrão SQL, além das exclusões específicas do MySQL `ORDER BY`, `LIMIT` (MySQL 8.0.18 e versões anteriores) e `DISTINCT`.

Para CTEs recursivas, as linhas de saída `EXPLAIN` para partes recursivas `SELECT` exibem `Recursive` na coluna `Extra`.

As estimativas de custo exibidas por `EXPLAIN` representam o custo por iteração, o que pode diferir consideravelmente do custo total. O otimizador não pode prever o número de iterações porque não pode prever em que ponto a cláusula `WHERE` se torna falsa.

O custo real do CTE também pode ser afetado pelo tamanho do conjunto de resultados. Um CTE que produz muitas linhas pode exigir uma tabela temporária interna grande o suficiente para ser convertida do formato de memória para o formato de disco e pode sofrer uma penalidade de desempenho. Se isso ocorrer, aumentar o tamanho permitido da tabela temporária de memória pode melhorar o desempenho; consulte a Seção 10.4.4, “Uso de Tabelas Temporárias Internas no MySQL”.

#### Limitar a Recursividade da Expressão de Tabela Comum

É importante que as CTE recursivas que contenham a parte recursiva `SELECT` incluam uma condição para interromper a recursão. Como uma técnica de desenvolvimento para evitar uma recursão descontrolada, você pode forçar o término colocando um limite de tempo de execução:

- A variável de sistema `cte_max_recursion_depth` estabelece um limite para o número de níveis de recursão para CTEs. O servidor interrompe a execução de qualquer CTE que realize mais níveis do que o valor desta variável.

- A variável de sistema `max_execution_time` impõe um tempo limite de execução para as instruções `SELECT` executadas dentro da sessão atual.

- A dica de otimização `MAX_EXECUTION_TIME` impõe um limite de tempo de execução por consulta para a instrução `SELECT` na qual ela aparece.

Suponha que uma CTE recursiva seja escrita incorretamente sem uma condição de término de execução recursiva:

```
WITH RECURSIVE cte (n) AS
(
  SELECT 1
  UNION ALL
  SELECT n + 1 FROM cte
)
SELECT * FROM cte;
```

Por padrão, `cte_max_recursion_depth` tem um valor de 1000, fazendo com que o CTE termine quando ele recursar além de 1000 níveis. As aplicações podem alterar o valor da sessão para ajustar às suas necessidades:

```
SET SESSION cte_max_recursion_depth = 10;      -- permit only shallow recursion
SET SESSION cte_max_recursion_depth = 1000000; -- permit deeper recursion
```

Você também pode definir o valor global `cte_max_recursion_depth` para afetar todas as sessões que começarem posteriormente.

Para consultas que executam e, portanto, recorrem lentamente ou em contextos para os quais há motivos para definir o valor `cte_max_recursion_depth` muito alto, outra maneira de evitar a recursão profunda é definir um limite de tempo por sessão. Para fazer isso, execute uma instrução como esta antes de executar a instrução CTE:

```
SET max_execution_time = 1000; -- impose one second timeout
```

Alternativamente, inclua uma dica de otimização dentro da própria declaração do CTE:

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

A partir do MySQL 8.0.19, você também pode usar `LIMIT` na consulta recursiva para impor um número máximo de linhas a serem retornadas ao `SELECT` mais externo, por exemplo:

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

Se uma consulta recursiva sem um limite de tempo de execução entrar em um loop infinito, você pode interromper-la a partir de outra sessão usando `KILL QUERY`. Dentro da própria sessão, o programa cliente usado para executar a consulta pode fornecer uma maneira de interromper a consulta. Por exemplo, no **mysql**, digitar **Control+C** interrompe a declaração atual.

#### Exemplos de Expressão Comum de Tabela Recursiva

Como mencionado anteriormente, as expressões comuns de tabela recursivas (CTEs) são frequentemente usadas para geração de séries e para percorrer dados hierárquicos ou estruturados em árvore. Esta seção mostra alguns exemplos simples dessas técnicas.

- Geração da Série de Fibonacci
- Geração de Série de Datas
- Traversamento hierárquico de dados

##### Geração da Série de Fibonacci

Uma série de Fibonacci começa com os dois números 0 e 1 (ou 1 e 1) e cada número depois disso é a soma dos dois números anteriores. Uma expressão de tabela comum recursiva pode gerar uma série de Fibonacci se cada linha produzida pelo `SELECT` recursivo tiver acesso aos dois números anteriores da série. A CTE a seguir gera uma série de 10 números usando 0 e 1 como os dois primeiros números:

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

- `n` é uma coluna de exibição para indicar que a linha contém o número de Fibonacci `n`-ésimo. Por exemplo, o 8º número de Fibonacci é 13.

- A coluna `fib_n` exibe o número de Fibonacci `n`.

- A coluna `next_fib_n` exibe o próximo número de Fibonacci após o número `n`. Essa coluna fornece o próximo valor da série para a próxima linha, para que essa linha possa calcular a soma dos dois valores anteriores da série na sua coluna `fib_n`.

- A recursão termina quando `n` atinge 10. Esta é uma escolha arbitrária, para limitar a saída a um pequeno conjunto de linhas.

A saída anterior mostra todo o resultado do CTE. Para selecionar apenas uma parte dele, adicione uma cláusula apropriada `WHERE` ao nível superior `SELECT`. Por exemplo, para selecionar o 8º número de Fibonacci, faça isso:

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

Uma expressão de tabela comum pode gerar uma série de datas consecutivas, o que é útil para gerar resumos que incluem uma linha para todas as datas da série, incluindo datas não representadas nos dados resumidos.

Suponha que uma tabela com números de vendas contenha essas linhas:

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

No entanto, esse resultado contém "buracos" para datas que não estão representadas na faixa de datas abrangidas pela tabela. Um resultado que representa todas as datas na faixa pode ser gerado usando uma CTE recursiva para gerar esse conjunto de datas, unido com um `LEFT JOIN` aos dados de vendas.

Aqui está o CTE para gerar a série de intervalo de datas:

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

O CTE produz este resultado:

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

Como o CTE funciona:

- O não recursivo `SELECT` produz a data mais baixa na faixa de datas abrangida pela tabela `sales`.

- Cada linha produzida pelo `SELECT` recursivo adiciona um dia à data produzida pela linha anterior.

- A recursão termina após as datas atingirem a data mais alta no intervalo de datas abrangido pela tabela `sales`.

A junção do CTE com um `LEFT JOIN` contra a tabela `sales` produz o resumo das vendas com uma linha para cada data na faixa:

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

Alguns pontos a serem observados:

- As consultas são ineficientes, especialmente a que contém a subconsulta `MAX()` executada para cada linha no recursivo `SELECT`? `EXPLAIN` mostra que a subconsulta que contém `MAX()` é avaliada apenas uma vez e o resultado é armazenado na cache.

- O uso de `COALESCE()` evita a exibição de `NULL` na coluna `sum_price` nos dias em que não há dados de vendas na tabela `sales`.

##### Traversamento hierárquico de dados

As expressões comuns de tabela recursivas são úteis para percorrer dados que formam uma hierarquia. Considere estas declarações que criam um pequeno conjunto de dados que mostram, para cada funcionário de uma empresa, o nome e o número de identificação do funcionário, e o ID do gerente do funcionário. O funcionário de nível superior (o CEO) tem um ID de gerente de `NULL` (sem gerente).

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

O conjunto de dados resultante tem a seguinte aparência:

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

Para criar o organograma com a cadeia de gestão para cada funcionário (ou seja, o caminho do CEO até o funcionário), use um CTE recursivo:

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

O CTE produz essa saída:

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

Como o CTE funciona:

- O não recursivo `SELECT` produz a linha para o CEO (a linha com um ID de gerente `NULL`).

  A coluna `path` foi ampliada para `CHAR(200)` para garantir que haja espaço para os valores mais longos de `path` produzidos pelos `SELECT` recursivos.

- Cada linha gerada pelo `SELECT` recursivo encontra todos os funcionários que reportam diretamente a um funcionário gerado por uma linha anterior. Para cada funcionário, a linha inclui o ID e o nome do funcionário, além da cadeia de gerenciamento do funcionário. A cadeia é a cadeia do gerente, com o ID do funcionário adicionado no final.

- A hierarquia termina quando os funcionários não têm mais subordinados.

Para encontrar o caminho de um funcionário específico ou de vários funcionários, adicione uma cláusula `WHERE` ao nível superior `SELECT`. Por exemplo, para exibir os resultados para Tarek e Sarah, modifique esse `SELECT` da seguinte maneira:

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

As expressões de tabela comuns (CTEs) são semelhantes às tabelas derivadas em alguns aspectos:

- Ambos os constructos são nomeados.
- Ambas as construções existem para o escopo de uma única declaração.

Devido a essas semelhanças, as CTEs e as tabelas derivadas podem ser usadas de forma intercambiável. Como exemplo trivial, essas declarações são equivalentes:

```
WITH cte AS (SELECT 1) SELECT * FROM cte;
SELECT * FROM (SELECT 1) AS dt;
```

No entanto, as CTEs têm algumas vantagens em relação às tabelas derivadas:

- Uma tabela derivada pode ser referenciada apenas uma única vez em uma consulta. Uma CTE pode ser referenciada várias vezes. Para usar várias instâncias de um resultado de tabela derivada, você deve derivar o resultado várias vezes.

- Um CTE pode ser autoreferencial (recursivo).

- Um CTE pode se referir a outro.

- Uma CTE pode ser mais fácil de ler quando sua definição aparece no início da declaração, em vez de estar embutida nela.

As CTEs são semelhantes às tabelas criadas com `CREATE [TEMPORARY] TABLE`, mas não precisam ser definidas ou excluídas explicitamente. Para uma CTE, você não precisa de privilégios para criar tabelas.
