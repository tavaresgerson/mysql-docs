#### 10.2.2.4. Otimização de tabelas derivadas, referências de visualização e expressões de tabela comuns com fusão ou materialização

O otimizador pode lidar com referências a tabelas derivadas usando duas estratégias (que também se aplicam a referências de visualizações e expressões de tabela comuns):

- Junte a tabela derivada ao bloco de consulta externa
- Materialize a tabela derivada em uma tabela temporária interna

Exemplo 1:

```
SELECT * FROM (SELECT * FROM t1) AS derived_t1;
```

Com a fusão da tabela derivada `derived_t1`, essa consulta é executada de forma semelhante a:

```
SELECT * FROM t1;
```

Exemplo 2:

```
SELECT *
  FROM t1 JOIN (SELECT t2.f1 FROM t2) AS derived_t2 ON t1.f2=derived_t2.f1
  WHERE t1.f1 > 0;
```

Com a fusão da tabela derivada `derived_t2`, essa consulta é executada de forma semelhante a:

```
SELECT t1.*, t2.f1
  FROM t1 JOIN t2 ON t1.f2=t2.f1
  WHERE t1.f1 > 0;
```

Com a materialização, `derived_t1` e `derived_t2` são tratados como tabelas separadas dentro de suas respectivas consultas.

O otimizador trata tabelas derivadas, referências de visualizações e expressões de tabela comuns da mesma maneira: ele evita a materialização desnecessária sempre que possível, o que permite que as condições sejam empurradas das consultas externas para as tabelas derivadas e produz planos de execução mais eficientes. (Para um exemplo, consulte a Seção 10.2.2.2, “Otimizando Subconsultas com Materialização”.)

Se a fusão resultar em um bloco de consulta externa que faça referência a mais de 61 tabelas de base, o otimizador opta pela materialização.

O otimizador propaga uma cláusula `ORDER BY` em uma referência de tabela derivada ou visual para o bloco de consulta externa se todas essas condições forem verdadeiras:

- A consulta externa não está agrupada ou agregada.

- A consulta externa não especifica `DISTINCT`, `HAVING` ou `ORDER BY`.

- A consulta externa tem essa referência de tabela ou visualização derivada como a única fonte na cláusula `FROM`.

Caso contrário, o otimizador ignora a cláusula `ORDER BY`.

Os seguintes meios estão disponíveis para influenciar se o otimizador tenta combinar tabelas derivadas, referências de visualização e expressões de tabela comuns no bloco de consulta externa:

- As dicas de otimização `MERGE` e `NO_MERGE` podem ser usadas. Elas se aplicam assumindo que nenhuma outra regra impeça a fusão. Veja a Seção 10.9.3, “Dicas de Otimização”.

- Da mesma forma, você pode usar a bandeira `derived_merge` da variável de sistema `optimizer_switch`. Veja a Seção 10.9.2, “Otimizações Alternativas”. Por padrão, a bandeira está habilitada para permitir a fusão. Desabilitar a bandeira impede a fusão e evita erros `ER_UPDATE_TABLE_USED`.

  A bandeira `derived_merge` também se aplica a visualizações que não contêm nenhuma cláusula `ALGORITHM`. Assim, se ocorrer um erro `ER_UPDATE_TABLE_USED` para uma referência de visualização que usa uma expressão equivalente à subconsulta, adicionar `ALGORITHM=TEMPTABLE` à definição da visualização impede a fusão e tem precedência sobre o valor `derived_merge`.

- É possível desativar a junção usando na subconsulta quaisquer construções que impeçam a junção, embora essas não sejam tão explícitas em seu efeito na materialização. As construções que impedem a junção são as mesmas para tabelas derivadas, expressões de tabela comuns e referências de visualização:

  - Funções agregadas ou funções de janela (`SUM()`, `MIN()`, `MAX()`, `COUNT()` e assim por diante)

  - `DISTINCT`

  - `GROUP BY`

  - `HAVING`

  - `LIMIT`

  - `UNION` ou `UNION ALL`

  - Subconsultas na lista de seleção

  - Atribuições a variáveis de usuário

  - Referências apenas a valores literais (neste caso, não há uma tabela subjacente)

Se o otimizador optar pela estratégia de materialização em vez de junção para uma tabela derivada, ele processará a consulta da seguinte forma:

- O otimizador adiou a materialização da tabela derivada até que seu conteúdo seja necessário durante a execução da consulta. Isso melhora o desempenho, pois a adição da materialização pode resultar em não precisar fazê-la. Considere uma consulta que junta o resultado de uma tabela derivada a outra tabela: Se o otimizador processar essa outra tabela primeiro e descobrir que ela não retorna nenhuma linha, a junção não precisa ser realizada e o otimizador pode pular completamente a materialização da tabela derivada.

- Durante a execução da consulta, o otimizador pode adicionar um índice a uma tabela derivada para acelerar a recuperação de linhas dela.

Considere a seguinte declaração `EXPLAIN` para uma consulta `SELECT` que contém uma tabela derivada:

```
EXPLAIN SELECT * FROM (SELECT * FROM t1) AS derived_t1;
```

O otimizador evita a materialização da tabela derivada, adiando-a até que o resultado seja necessário durante a execução do `SELECT`. Neste caso, a consulta não é executada (porque ocorre em uma instrução `EXPLAIN`), então o resultado nunca é necessário.

Mesmo para consultas que são executadas, o atraso na materialização da tabela derivada pode permitir que o otimizador evite a materialização completamente. Quando isso acontece, a execução da consulta é mais rápida no momento necessário para realizar a materialização. Considere a seguinte consulta, que junta o resultado de uma tabela derivada a outra tabela:

```
SELECT *
  FROM t1 JOIN (SELECT t2.f1 FROM t2) AS derived_t2
          ON t1.f2=derived_t2.f1
  WHERE t1.f1 > 0;
```

Se os processos de otimização `t1` forem executados primeiro e a cláusula `WHERE` produzir um resultado vazio, a junção deve ser necessariamente vazia e a tabela derivada pode não ser materializada.

Para casos em que uma tabela derivada requer materialização, o otimizador pode adicionar um índice à tabela materializada para acelerar o acesso a ela. Se tal índice permitir o acesso ao `ref` à tabela, pode reduzir significativamente a quantidade de dados lidos durante a execução da consulta. Considere a seguinte consulta:

```
SELECT *
 FROM t1 JOIN (SELECT DISTINCT f1 FROM t2) AS derived_t2
         ON t1.f1=derived_t2.f1;
```

O otimizador constrói um índice sobre a coluna `f1` a partir de `derived_t2` se isso permitir o uso do plano de execução de acesso `ref` com o menor custo. Após a adição do índice, o otimizador pode tratar a tabela derivada materializada da mesma forma que uma tabela regular com um índice, e se beneficia da mesma maneira do índice gerado. O custo da criação do índice é negligenciável em comparação com o custo da execução da consulta sem o índice. Se o acesso `ref` resultar em um custo maior do que algum outro método de acesso, o otimizador não cria o índice e não perde nada.

Para a saída de rastreamento do otimizador, uma referência de tabela ou visão derivada combinada não é exibida como um nó. Apenas suas tabelas subjacentes aparecem no plano da consulta principal.

O que é verdadeiro para a materialização de tabelas derivadas também é verdadeiro para expressões de tabela comuns (CTEs). Além disso, as seguintes considerações se aplicam especificamente às CTEs.

Se um CTE for materializado por uma consulta, ele é materializado uma vez para a consulta, mesmo que a consulta o refira várias vezes.

Um CTE recursivo é sempre materializado.

Se um CTE for materializado, o otimizador adiciona automaticamente índices relevantes se ele estimar que a indexação pode acelerar o acesso à declaração de nível superior ao CTE. Isso é semelhante à indexação automática de tabelas derivadas, exceto que, se o CTE for referenciado várias vezes, o otimizador pode criar vários índices, para acelerar o acesso de cada referência da maneira mais apropriada.

As dicas de otimização `MERGE` e `NO_MERGE` podem ser aplicadas a CTEs. Cada referência de CTE na declaração de nível superior pode ter sua própria dica, permitindo que as referências de CTE sejam unidas ou materializadas seletivamente. A seguinte declaração usa dicas para indicar que `cte1` deve ser unido e `cte2` deve ser materializado:

```
WITH
  cte1 AS (SELECT a, b FROM table1),
  cte2 AS (SELECT c, d FROM table2)
SELECT /*+ MERGE(cte1) NO_MERGE(cte2) */ cte1.b, cte2.d
FROM cte1 JOIN cte2
WHERE cte1.a = cte2.c;
```

A cláusula `ALGORITHM` para `CREATE VIEW` não afeta a materialização para qualquer cláusula `WITH` que antecede a declaração `SELECT` na definição da vista. Considere esta declaração:

```
CREATE ALGORITHM={TEMPTABLE|MERGE} VIEW v1 AS WITH ... SELECT ...
```

O valor `ALGORITHM` afeta a materialização apenas da cláusula `SELECT`, não da `WITH`")

Antes do MySQL 8.0.16, se `internal_tmp_disk_storage_engine=MYISAM` ocorresse um erro para qualquer tentativa de materializar uma CTE usando uma tabela temporária em disco, pois, para CTEs, o mecanismo de armazenamento usado para tabelas temporárias internas em disco não poderia ser `MyISAM`. A partir do MySQL 8.0.16, isso não é mais um problema, pois `TempTable` agora sempre usa `InnoDB` para tabelas temporárias internas em disco.

Como mencionado anteriormente, um CTE, se materializado, é materializado uma vez, mesmo se referenciado várias vezes. Para indicar a materialização única, a saída do rastreamento do otimizador contém uma ocorrência de `creating_tmp_table` mais uma ou mais ocorrências de `reusing_tmp_table`.

As CTEs são semelhantes às tabelas derivadas, para as quais o nó `materialized_from_subquery` segue a referência. Isso é verdade para uma CTE que é referenciada várias vezes, portanto, não há duplicação dos nós `materialized_from_subquery` (o que daria a impressão de que a subconsulta é executada várias vezes e produziria uma saída desnecessariamente verbose). Apenas uma referência à CTE tem um nó `materialized_from_subquery` completo com a descrição do seu plano de subconsulta. Outras referências têm um nó `materialized_from_subquery` reduzido. A mesma ideia se aplica ao resultado `EXPLAIN` no formato `TRADITIONAL`: as subconsultas para outras referências não são mostradas.
