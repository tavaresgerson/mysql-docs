### 8.8.2 Formato de Saída do EXPLAIN

O comando `EXPLAIN` fornece informações sobre como o MySQL executa comandos. O `EXPLAIN` funciona com comandos `SELECT`, `DELETE`, `INSERT`, `REPLACE` e `UPDATE`.

O `EXPLAIN` retorna uma linha de informação para cada tabela usada no comando `SELECT`. Ele lista as tabelas na saída na ordem em que o MySQL as leria durante o processamento do comando. O MySQL resolve todos os JOINs usando um método de JOIN de loop aninhado (nested-loop join). Isso significa que o MySQL lê uma linha da primeira tabela, depois encontra uma linha correspondente na segunda tabela, na terceira tabela e assim por diante. Quando todas as tabelas são processadas, o MySQL exibe as colunas selecionadas e retrocede pela lista de tabelas até que uma tabela seja encontrada para a qual existam mais linhas correspondentes. A próxima linha é lida desta tabela e o processo continua com a próxima tabela.

A saída do `EXPLAIN` inclui informações de Partition. Além disso, para comandos `SELECT`, o `EXPLAIN` gera informações estendidas que podem ser exibidas com `SHOW WARNINGS` após o `EXPLAIN` (veja Seção 8.8.3, “Formato de Saída Estendida do EXPLAIN”).

Nota

Em versões mais antigas do MySQL, as informações de Partition e estendidas eram produzidas usando `EXPLAIN PARTITIONS` e `EXPLAIN EXTENDED`. Essas sintaxes ainda são reconhecidas para compatibilidade com versões anteriores, mas a saída de Partition e estendida agora está habilitada por padrão, então as palavras-chave `PARTITIONS` e `EXTENDED` são supérfluas e estão depreciadas. O uso delas resulta em um aviso; espera-se que sejam removidas da sintaxe `EXPLAIN` em um futuro lançamento do MySQL.

Você não pode usar as palavras-chave depreciadas `PARTITIONS` e `EXTENDED` juntas no mesmo comando `EXPLAIN`. Além disso, nenhuma dessas palavras-chave pode ser usada em conjunto com a opção `FORMAT`.

Nota

O MySQL Workbench possui um recurso Visual Explain que fornece uma representação visual da saída do `EXPLAIN`. Veja Tutorial: Usando Explain para Melhorar a Performance da Query.

* Colunas de Saída do EXPLAIN
* Tipos de JOIN do EXPLAIN
* Informações Extras do EXPLAIN
* Interpretação da Saída do EXPLAIN

#### Colunas de Saída do EXPLAIN

Esta seção descreve as colunas de saída produzidas pelo `EXPLAIN`. As seções posteriores fornecem informações adicionais sobre as colunas `type` e `Extra`.

Cada linha de saída do `EXPLAIN` fornece informações sobre uma tabela. Cada linha contém os valores resumidos na Tabela 8.1, “Colunas de Saída do EXPLAIN”, e descritos em mais detalhes após a tabela. Os nomes das colunas são mostrados na primeira coluna da tabela; a segunda coluna fornece o nome de propriedade equivalente mostrado na saída quando `FORMAT=JSON` é usado.

**Tabela 8.1 Colunas de Saída do EXPLAIN**

<table summary="Colunas de saída produzidas pelo comando EXPLAIN.">
   <thead>
      <tr>
         <th>Coluna</th>
         <th>Nome JSON</th>
         <th>Significado</th>
      </tr>
   </thead>
   <tbody>
      <tr>
         <th><code>id</code></th>
         <td><code>select_id</code></td>
         <td>O identificador do <code>SELECT</code></td>
      </tr>
      <tr>
         <th><code>select_type</code></th>
         <td>None</td>
         <td>O tipo de <code>SELECT</code></td>
      </tr>
      <tr>
         <th><code>table</code></th>
         <td><code>table_name</code></td>
         <td>A tabela para a linha de saída</td>
      </tr>
      <tr>
         <th><code>partitions</code></th>
         <td><code>partitions</code></td>
         <td>As Partitions correspondentes</td>
      </tr>
      <tr>
         <th><code>type</code></th>
         <td><code>access_type</code></td>
         <td>O tipo de JOIN</td>
      </tr>
      <tr>
         <th><code>possible_keys</code></th>
         <td><code>possible_keys</code></td>
         <td>Os Indexes possíveis a escolher</td>
      </tr>
      <tr>
         <th><code>key</code></th>
         <td><code>key</code></td>
         <td>O Index realmente escolhido</td>
      </tr>
      <tr>
         <th><code>key_len</code></th>
         <td><code>key_length</code></td>
         <td>O comprimento da Key escolhida</td>
      </tr>
      <tr>
         <th><code>ref</code></th>
         <td><code>ref</code></td>
         <td>As colunas comparadas ao Index</td>
      </tr>
      <tr>
         <th><code>rows</code></th>
         <td><code>rows</code></td>
         <td>Estimativa de linhas a serem examinadas</td>
      </tr>
      <tr>
         <th><code>filtered</code></th>
         <td><code>filtered</code></td>
         <td>Porcentagem de linhas filtradas pela condição da tabela</td>
      </tr>
      <tr>
         <th><code>Extra</code></th>
         <td>None</td>
         <td>Informação adicional</td>
      </tr>
   </tbody>
</table>

Nota

Propriedades JSON que são `NULL` não são exibidas na saída `EXPLAIN` formatada em JSON.

* `id` (Nome JSON: `select_id`)

  O identificador do `SELECT`. Este é o número sequencial do `SELECT` dentro da Query. O valor pode ser `NULL` se a linha se referir ao resultado da `UNION` de outras linhas. Neste caso, a coluna `table` mostra um valor como `<unionM,N>` para indicar que a linha se refere à `UNION` das linhas com valores `id` de *`M`* e *`N`*.

* `select_type` (Nome JSON: nenhum)

  O tipo de `SELECT`, que pode ser qualquer um dos mostrados na tabela a seguir. Um `EXPLAIN` formatado em JSON expõe o tipo de `SELECT` como uma propriedade de um `query_block`, a menos que seja `SIMPLE` ou `PRIMARY`. Os nomes JSON (quando aplicável) também são mostrados na tabela.

  <table summary="Valores de select_type e o significado de cada valor."><col style="width: 25%"/><col style="width: 25%"/><col style="width: 50%"/><thead><tr> <th>Valor <code>select_type</code></th> <th>Nome JSON</th> <th>Significado</th> </tr></thead><tbody><tr> <th><code>SIMPLE</code></th> <td>None</td> <td><code>SELECT</code> simples (não usando <code>UNION</code> ou subqueries)</td> </tr><tr> <th><code>PRIMARY</code></th> <td>None</td> <td><code>SELECT</code> mais externo</td> </tr><tr> <th><code>UNION</code></th> <td>None</td> <td>Segundo ou posterior comando <code>SELECT</code> em uma <code>UNION</code></td> </tr><tr> <th><code>DEPENDENT UNION</code></th> <td><code>dependent</code> (<code>true</code>)</td> <td>Segundo ou posterior comando <code>SELECT</code> em uma <code>UNION</code>, dependente da Query externa</td> </tr><tr> <th><code>UNION RESULT</code></th> <td><code>union_result</code></td> <td>Resultado de uma <code>UNION</code>.</td> </tr><tr> <th><code>SUBQUERY</code></th> <td>None</td> <td>Primeiro <code>SELECT</code> em subquery</td> </tr><tr> <th><code>DEPENDENT SUBQUERY</code></th> <td><code>dependent</code> (<code>true</code>)</td> <td>Primeiro <code>SELECT</code> em subquery, dependente da Query externa</td> </tr><tr> <th><code>DERIVED</code></th> <td>None</td> <td>Tabela derivada (Derived table)</td> </tr><tr> <th><code>MATERIALIZED</code></th> <td><code>materialized_from_subquery</code></td> <td>Subquery materializada</td> </tr><tr> <th><code>UNCACHEABLE SUBQUERY</code></th> <td><code>cacheable</code> (<code>false</code>)</td> <td>Uma subquery cujo resultado não pode ser armazenado em cache e deve ser reavaliada para cada linha da Query externa</td> </tr><tr> <th><code>UNCACHEABLE UNION</code></th> <td><code>cacheable</code> (<code>false</code>)</td> <td>O segundo ou posterior SELECT em uma <code>UNION</code> que pertence a uma subquery não armazenável em cache (veja <code>UNCACHEABLE SUBQUERY</code>)</td> </tr></tbody></table>

  `DEPENDENT` tipicamente significa o uso de uma subquery correlacionada. Veja Seção 13.2.10.7, “Subqueries Correlacionadas”.

  A avaliação de `DEPENDENT SUBQUERY` difere da avaliação de `UNCACHEABLE SUBQUERY`. Para `DEPENDENT SUBQUERY`, a subquery é reavaliada apenas uma vez para cada conjunto de valores diferentes das variáveis de seu contexto externo. Para `UNCACHEABLE SUBQUERY`, a subquery é reavaliada para cada linha do contexto externo.

  A capacidade de cache de subqueries difere do cache de resultados de Query no Query cache (descrito na Seção 8.10.3.1, “Como o Query Cache Opera”). O cache de subquery ocorre durante a execução da Query, enquanto o Query cache é usado para armazenar resultados somente após a conclusão da execução da Query.

  Quando você especifica `FORMAT=JSON` com `EXPLAIN`, a saída não tem uma única propriedade diretamente equivalente a `select_type`; a propriedade `query_block` corresponde a um determinado `SELECT`. Propriedades equivalentes à maioria dos tipos de subquery `SELECT` acabam de ser mostradas e estão disponíveis (um exemplo é `materialized_from_subquery` para `MATERIALIZED`) e são exibidas quando apropriado. Não há equivalentes JSON para `SIMPLE` ou `PRIMARY`.

  O valor `select_type` para comandos que não são `SELECT` exibe o tipo de comando para as tabelas afetadas. Por exemplo, `select_type` é `DELETE` para comandos `DELETE`.

* `table` (Nome JSON: `table_name`)

  O nome da tabela à qual a linha de saída se refere. Este também pode ser um dos seguintes valores:

  + `<unionM,N>`: A linha se refere à `UNION` das linhas com valores `id` de *`M`* e *`N`*.

  + `<derivedN>`: A linha se refere ao resultado da tabela derivada para a linha com um valor `id` de *`N`*. Uma tabela derivada pode resultar, por exemplo, de uma subquery na cláusula `FROM`.

  + `<subqueryN>`: A linha se refere ao resultado de uma subquery materializada para a linha com um valor `id` de *`N`*. Veja Seção 8.2.2.2, “Otimizando Subqueries com Materialização”.

* `partitions` (Nome JSON: `partitions`)

  As Partitions das quais os registros seriam correspondidos pela Query. O valor é `NULL` para tabelas não particionadas. Veja Seção 22.3.5, “Obtendo Informações Sobre Partitions”.

* `type` (Nome JSON: `access_type`)

  O tipo de JOIN. Para descrições dos diferentes tipos, veja Tipos de JOIN do EXPLAIN.

* `possible_keys` (Nome JSON: `possible_keys`)

  A coluna `possible_keys` indica os Indexes a partir dos quais o MySQL pode escolher para encontrar as linhas nesta tabela. Observe que esta coluna é totalmente independente da ordem das tabelas exibidas na saída do `EXPLAIN`. Isso significa que algumas das Keys em `possible_keys` podem não ser utilizáveis na prática com a ordem de tabela gerada.

  Se esta coluna for `NULL` (ou indefinida na saída formatada em JSON), não há Indexes relevantes. Neste caso, você pode melhorar a performance da sua Query examinando a cláusula `WHERE` para verificar se ela se refere a alguma coluna ou colunas que seriam adequadas para Indexing. Se sim, crie um Index apropriado e verifique a Query com `EXPLAIN` novamente. Veja Seção 13.1.8, “Comando ALTER TABLE”.

  Para ver quais Indexes uma tabela possui, use `SHOW INDEX FROM tbl_name`.

* `key` (Nome JSON: `key`)

  A coluna `key` indica a Key (Index) que o MySQL realmente decidiu usar. Se o MySQL decidir usar um dos Indexes `possible_keys` para procurar linhas, esse Index será listado como o valor Key.

  É possível que `key` nomeie um Index que não esteja presente no valor `possible_keys`. Isso pode acontecer se nenhum dos Indexes `possible_keys` for adequado para procurar linhas, mas todas as colunas selecionadas pela Query forem colunas de algum outro Index. Ou seja, o Index nomeado cobre as colunas selecionadas, então, embora não seja usado para determinar quais linhas recuperar, uma varredura de Index (Index scan) é mais eficiente do que uma varredura de linha de dados.

  Para `InnoDB`, um Index secundário pode cobrir as colunas selecionadas, mesmo que a Query também selecione a Primary Key, porque o `InnoDB` armazena o valor da Primary Key com cada Index secundário. Se `key` for `NULL`, o MySQL não encontrou nenhum Index para usar para executar a Query de forma mais eficiente.

  Para forçar o MySQL a usar ou ignorar um Index listado na coluna `possible_keys`, use `FORCE INDEX`, `USE INDEX` ou `IGNORE INDEX` na sua Query. Veja Seção 8.9.4, “Dicas de Index”.

  Para tabelas `MyISAM`, executar `ANALYZE TABLE` ajuda o Optimizer a escolher Indexes melhores. Para tabelas `MyISAM`, **myisamchk --analyze** faz o mesmo. Veja Seção 13.7.2.1, “Comando ANALYZE TABLE”, e Seção 7.6, “Manutenção de Tabela MyISAM e Recuperação de Falhas”.

* `key_len` (Nome JSON: `key_length`)

  A coluna `key_len` indica o comprimento da Key que o MySQL decidiu usar. O valor de `key_len` permite determinar quantas partes de uma Key composta o MySQL realmente usa. Se a coluna `key` disser `NULL`, a coluna `key_len` também dirá `NULL`.

  Devido ao formato de armazenamento da Key, o comprimento da Key é um a mais para uma coluna que pode ser `NULL` do que para uma coluna `NOT NULL`.

* `ref` (Nome JSON: `ref`)

  A coluna `ref` mostra quais colunas ou constantes são comparadas ao Index nomeado na coluna `key` para selecionar linhas da tabela.

  Se o valor for `func`, o valor usado é o resultado de alguma função. Para ver qual função, use `SHOW WARNINGS` após `EXPLAIN` para ver a saída estendida do `EXPLAIN`. A função pode ser, na verdade, um operador, como um operador aritmético.

* `rows` (Nome JSON: `rows`)

  A coluna `rows` indica o número de linhas que o MySQL acredita que deve examinar para executar a Query.

  Para tabelas `InnoDB`, este número é uma estimativa e nem sempre é exato.

* `filtered` (Nome JSON: `filtered`)

  A coluna `filtered` indica uma porcentagem estimada de linhas da tabela filtradas pela condição da tabela. O valor máximo é 100, o que significa que não ocorreu nenhuma filtragem de linhas. Valores decrescentes a partir de 100 indicam quantidades crescentes de filtragem. `rows` mostra o número estimado de linhas examinadas e `rows` × `filtered` mostra o número de linhas unidas com a tabela seguinte. Por exemplo, se `rows` for 1000 e `filtered` for 50.00 (50%), o número de linhas a serem unidas com a tabela seguinte é 1000 × 50% = 500.

* `Extra` (Nome JSON: nenhum)

  Esta coluna contém informações adicionais sobre como o MySQL resolve a Query. Para descrições dos diferentes valores, veja Informações Extras do EXPLAIN.

  Não há uma única propriedade JSON correspondente à coluna `Extra`; no entanto, valores que podem ocorrer nesta coluna são expostos como propriedades JSON ou como o texto da propriedade `message`.

#### Tipos de JOIN do EXPLAIN

A coluna `type` da saída do `EXPLAIN` descreve como as tabelas são unidas. Na saída formatada em JSON, elas são encontradas como valores da propriedade `access_type`. A lista a seguir descreve os tipos de JOIN, ordenados do melhor tipo para o pior:

* `system`

  A tabela tem apenas uma linha (= tabela de sistema). Este é um caso especial do tipo de JOIN `const`.

* `const`

  A tabela tem no máximo uma linha correspondente, que é lida no início da Query. Como há apenas uma linha, os valores da coluna nesta linha podem ser considerados como constantes pelo restante do Optimizer. Tabelas `const` são muito rápidas porque são lidas apenas uma vez.

  `const` é usado quando você compara todas as partes de um Index `PRIMARY KEY` ou `UNIQUE` com valores constantes. Nas Queries a seguir, *`tbl_name`* pode ser usada como uma tabela `const`:

  ```sql
  SELECT * FROM tbl_name WHERE primary_key=1;

  SELECT * FROM tbl_name
    WHERE primary_key_part1=1 AND primary_key_part2=2;
  ```

* `eq_ref`

  Uma linha é lida desta tabela para cada combinação de linhas das tabelas anteriores. Além dos tipos `system` e `const`, este é o melhor tipo de JOIN possível. É usado quando todas as partes de um Index são usadas pelo JOIN e o Index é um Index `PRIMARY KEY` ou `UNIQUE NOT NULL`.

  `eq_ref` pode ser usado para colunas Indexadas que são comparadas usando o operador `=`. O valor de comparação pode ser uma constante ou uma expressão que usa colunas de tabelas que são lidas antes desta tabela. Nos exemplos a seguir, o MySQL pode usar um JOIN `eq_ref` para processar *`ref_table`*:

  ```sql
  SELECT * FROM ref_table,other_table
    WHERE ref_table.key_column=other_table.column;

  SELECT * FROM ref_table,other_table
    WHERE ref_table.key_column_part1=other_table.column
    AND ref_table.key_column_part2=1;
  ```

* `ref`

  Todas as linhas com valores de Index correspondentes são lidas desta tabela para cada combinação de linhas das tabelas anteriores. `ref` é usado se o JOIN usar apenas um prefixo mais à esquerda da Key ou se a Key não for uma `PRIMARY KEY` ou um Index `UNIQUE` (em outras palavras, se o JOIN não puder selecionar uma única linha com base no valor da Key). Se a Key usada corresponder a apenas algumas linhas, este é um bom tipo de JOIN.

  `ref` pode ser usado para colunas Indexadas que são comparadas usando o operador `=` ou `<=>`. Nos exemplos a seguir, o MySQL pode usar um JOIN `ref` para processar *`ref_table`*:

  ```sql
  SELECT * FROM ref_table WHERE key_column=expr;

  SELECT * FROM ref_table,other_table
    WHERE ref_table.key_column=other_table.column;

  SELECT * FROM ref_table,other_table
    WHERE ref_table.key_column_part1=other_table.column
    AND ref_table.key_column_part2=1;
  ```

* `fulltext`

  O JOIN é executado usando um Index `FULLTEXT`.

* `ref_or_null`

  Este tipo de JOIN é como `ref`, mas com o acréscimo de que o MySQL faz uma busca extra por linhas que contêm valores `NULL`. Esta otimização de tipo de JOIN é usada com mais frequência na resolução de subqueries. Nos exemplos a seguir, o MySQL pode usar um JOIN `ref_or_null` para processar *`ref_table`*:

  ```sql
  SELECT * FROM ref_table
    WHERE key_column=expr OR key_column IS NULL;
  ```

  Veja Seção 8.2.1.13, “Otimização IS NULL”.

* `index_merge`

  Este tipo de JOIN indica que a otimização Index Merge é usada. Neste caso, a coluna `key` na linha de saída contém uma lista de Indexes usados, e `key_len` contém uma lista das partes mais longas da Key para os Indexes usados. Para mais informações, veja Seção 8.2.1.3, “Otimização Index Merge”.

* `unique_subquery`

  Este tipo substitui `eq_ref` para algumas subqueries `IN` da seguinte forma:

  ```sql
  value IN (SELECT primary_key FROM single_table WHERE some_expr)
  ```

  `unique_subquery` é apenas uma função de busca de Index que substitui a subquery completamente para melhor eficiência.

* `index_subquery`

  Este tipo de JOIN é semelhante a `unique_subquery`. Ele substitui subqueries `IN`, mas funciona para Indexes não-únicos em subqueries da seguinte forma:

  ```sql
  value IN (SELECT key_column FROM single_table WHERE some_expr)
  ```

* `range`

  Apenas as linhas que estão em um determinado Range são recuperadas, usando um Index para selecionar as linhas. A coluna `key` na linha de saída indica qual Index é usado. O `key_len` contém a parte da Key mais longa que foi usada. A coluna `ref` é `NULL` para este tipo.

  `range` pode ser usado quando uma coluna Key é comparada a uma constante usando qualquer um dos operadores `=`, `<>`, `>`, `>=`, `<`, `<=`, `IS NULL`, `<=>`, `BETWEEN`, `LIKE` ou `IN()`:

  ```sql
  SELECT * FROM tbl_name
    WHERE key_column = 10;

  SELECT * FROM tbl_name
    WHERE key_column BETWEEN 10 and 20;

  SELECT * FROM tbl_name
    WHERE key_column IN (10,20,30);

  SELECT * FROM tbl_name
    WHERE key_part1 = 10 AND key_part2 IN (10,20,30);
  ```

* `index`

  O tipo de JOIN `index` é o mesmo que `ALL`, exceto que a Index tree é varrida. Isso ocorre de duas maneiras:

  + Se o Index for um Index de cobertura (covering index) para as Queries e puder ser usado para satisfazer todos os dados exigidos da tabela, apenas a Index tree é varrida. Neste caso, a coluna `Extra` diz `Using index`. Uma varredura de Index-only geralmente é mais rápida que `ALL` porque o tamanho do Index geralmente é menor do que os dados da tabela.

  + Uma varredura de tabela completa é realizada usando leituras do Index para procurar linhas de dados na ordem do Index. `Uses index` não aparece na coluna `Extra`.

  O MySQL pode usar este tipo de JOIN quando a Query usa apenas colunas que fazem parte de um único Index.

* `ALL`

  Uma varredura de tabela completa (full table scan) é feita para cada combinação de linhas das tabelas anteriores. Isso normalmente não é bom se a tabela for a primeira tabela não marcada como `const`, e geralmente *muito* ruim em todos os outros casos. Normalmente, você pode evitar `ALL` adicionando Indexes que permitam a recuperação de linhas da tabela com base em valores constantes ou valores de coluna de tabelas anteriores.

#### Informações Extras do EXPLAIN

A coluna `Extra` da saída do `EXPLAIN` contém informações adicionais sobre como o MySQL resolve a Query. A lista a seguir explica os valores que podem aparecer nesta coluna. Cada item também indica qual propriedade exibe o valor `Extra` na saída formatada em JSON. Para alguns destes, existe uma propriedade específica. Os outros são exibidos como o texto da propriedade `message`.

Se você deseja tornar suas Queries o mais rápidas possível, procure valores na coluna `Extra` de `Using filesort` e `Using temporary`, ou, na saída `EXPLAIN` formatada em JSON, para as propriedades `using_filesort` e `using_temporary_table` iguais a `true`.

* `Child of 'table' pushed join@1` (JSON: texto `message`)

  Esta tabela é referenciada como o filho de *`table`* em um JOIN que pode ser empurrado (pushed down) para o kernel NDB. Aplica-se apenas no NDB Cluster, quando os JOINs pushed-down estão habilitados. Veja a descrição da variável de sistema do servidor `ndb_join_pushdown` para mais informações e exemplos.

* `const row not found` (Propriedade JSON: `const_row_not_found`)

  Para uma Query como `SELECT ... FROM tbl_name`, a tabela estava vazia.

* `Deleting all rows` (Propriedade JSON: `message`)

  Para `DELETE`, alguns Storage Engines (como `MyISAM`) suportam um método de Handler que remove todas as linhas da tabela de maneira simples e rápida. Este valor `Extra` é exibido se o Engine usar essa otimização.

* `Distinct` (Propriedade JSON: `distinct`)

  O MySQL está procurando valores distintos, então ele para de procurar por mais linhas para a combinação de linhas atual depois de encontrar a primeira linha correspondente.

* `FirstMatch(tbl_name)` (Propriedade JSON: `first_match`)

  A estratégia de atalho de JOIN FirstMatch de semijoin é usada para *`tbl_name`*.

* `Full scan on NULL key` (Propriedade JSON: `message`)

  Isso ocorre para otimização de subquery como uma estratégia de fallback quando o Optimizer não pode usar um método de acesso de busca de Index (index-lookup access method).

* `Impossible HAVING` (Propriedade JSON: `message`)

  A cláusula `HAVING` é sempre falsa e não pode selecionar nenhuma linha.

* `Impossible WHERE` (Propriedade JSON: `message`)

  A cláusula `WHERE` é sempre falsa e não pode selecionar nenhuma linha.

* `Impossible WHERE noticed after reading const tables` (Propriedade JSON: `message`)

  O MySQL leu todas as tabelas `const` (e `system`) e notou que a cláusula `WHERE` é sempre falsa.

* `LooseScan(m..n)` (Propriedade JSON: `message`)

  A estratégia de semijoin LooseScan é usada. *`m`* e *`n`* são números de parte da Key.

* `No matching min/max row` (Propriedade JSON: `message`)

  Nenhuma linha satisfaz a condição para uma Query como `SELECT MIN(...) FROM ... WHERE condition`.

* `no matching row in const table` (Propriedade JSON: `message`)

  Para uma Query com um JOIN, havia uma tabela vazia ou uma tabela sem linhas que satisfizessem uma condição de Index único.

* `No matching rows after partition pruning` (Propriedade JSON: `message`)

  Para `DELETE` ou `UPDATE`, o Optimizer não encontrou nada para deletar ou atualizar após o Partition Pruning. É semelhante em significado a `Impossible WHERE` para comandos `SELECT`.

* `No tables used` (Propriedade JSON: `message`)

  A Query não tem cláusula `FROM`, ou tem uma cláusula `FROM DUAL`.

  Para comandos `INSERT` ou `REPLACE`, `EXPLAIN` exibe este valor quando não há parte `SELECT`. Por exemplo, ele aparece para `EXPLAIN INSERT INTO t VALUES(10)` porque isso é equivalente a `EXPLAIN INSERT INTO t SELECT 10 FROM DUAL`.

* `Not exists` (Propriedade JSON: `message`)

  O MySQL conseguiu fazer uma otimização `LEFT JOIN` na Query e não examina mais linhas nesta tabela para a combinação de linhas anterior depois de encontrar uma linha que corresponda aos critérios do `LEFT JOIN`. Aqui está um exemplo do tipo de Query que pode ser otimizada desta forma:

  ```sql
  SELECT * FROM t1 LEFT JOIN t2 ON t1.id=t2.id
    WHERE t2.id IS NULL;
  ```

  Suponha que `t2.id` seja definido como `NOT NULL`. Neste caso, o MySQL varre `t1` e procura as linhas em `t2` usando os valores de `t1.id`. Se o MySQL encontrar uma linha correspondente em `t2`, ele sabe que `t2.id` nunca pode ser `NULL` e não varre o restante das linhas em `t2` que têm o mesmo valor `id`. Em outras palavras, para cada linha em `t1`, o MySQL precisa fazer apenas uma única busca em `t2`, independentemente de quantas linhas realmente correspondam em `t2`.

* `Plan isn't ready yet` (Propriedade JSON: nenhuma)

  Este valor ocorre com `EXPLAIN FOR CONNECTION` quando o Optimizer ainda não terminou de criar o plano de execução para o comando que está sendo executado na conexão nomeada. Se a saída do plano de execução incluir várias linhas, qualquer ou todas elas podem ter este valor `Extra`, dependendo do progresso do Optimizer na determinação do plano de execução completo.

* `Range checked for each record (index map: N)` (Propriedade JSON: `message`)

  O MySQL não encontrou um Index bom para usar, mas descobriu que alguns Indexes podem ser usados depois que os valores das colunas das tabelas precedentes forem conhecidos. Para cada combinação de linhas nas tabelas precedentes, o MySQL verifica se é possível usar um método de acesso `range` ou `index_merge` para recuperar linhas. Isso não é muito rápido, mas é mais rápido do que realizar um JOIN sem nenhum Index. Os critérios de aplicabilidade são conforme descrito na Seção 8.2.1.2, “Otimização Range”, e Seção 8.2.1.3, “Otimização Index Merge”, com a exceção de que todos os valores de coluna para a tabela precedente são conhecidos e considerados constantes.

  Os Indexes são numerados começando com 1, na mesma ordem mostrada por `SHOW INDEX` para a tabela. O valor do Index map *`N`* é um valor de bitmask que indica quais Indexes são candidatos. Por exemplo, um valor de `0x19` (binário 11001) significa que os Indexes 1, 4 e 5 são considerados.

* `Scanned N databases` (Propriedade JSON: `message`)

  Isso indica quantas varreduras de diretório o servidor executa ao processar uma Query para tabelas `INFORMATION_SCHEMA`, conforme descrito na Seção 8.2.3, “Otimizando Queries INFORMATION_SCHEMA”. O valor de *`N`* pode ser 0, 1 ou `all`.

* `Select tables optimized away` (Propriedade JSON: `message`)

  O Optimizer determinou 1) que no máximo uma linha deve ser retornada e 2) que, para produzir esta linha, um conjunto determinístico de linhas deve ser lido. Quando as linhas a serem lidas podem ser lidas durante a fase de otimização (por exemplo, lendo linhas de Index), não há necessidade de ler nenhuma tabela durante a execução da Query.

  A primeira condição é satisfeita quando a Query é implicitamente agrupada (contém uma função de agregação, mas nenhuma cláusula `GROUP BY`). A segunda condição é satisfeita quando uma busca de linha é realizada por Index usado. O número de Indexes lidos determina o número de linhas a serem lidas.

  Considere a seguinte Query implicitamente agrupada:

  ```sql
  SELECT MIN(c1), MIN(c2) FROM t1;
  ```

  Suponha que `MIN(c1)` possa ser recuperado lendo uma linha de Index e `MIN(c2)` possa ser recuperado lendo uma linha de um Index diferente. Ou seja, para cada coluna `c1` e `c2`, existe um Index onde a coluna é a primeira coluna do Index. Neste caso, uma linha é retornada, produzida pela leitura de duas linhas determinísticas.

  Este valor `Extra` não ocorre se as linhas a serem lidas não forem determinísticas. Considere esta Query:

  ```sql
  SELECT MIN(c2) FROM t1 WHERE c1 <= 10;
  ```

  Suponha que `(c1, c2)` seja um covering index. Usando este Index, todas as linhas com `c1 <= 10` devem ser varridas para encontrar o valor mínimo de `c2`. Por outro lado, considere esta Query:

  ```sql
  SELECT MIN(c2) FROM t1 WHERE c1 = 10;
  ```

  Neste caso, a primeira linha de Index com `c1 = 10` contém o valor mínimo de `c2`. Apenas uma linha deve ser lida para produzir a linha retornada.

  Para Storage Engines que mantêm uma contagem exata de linhas por tabela (como `MyISAM`, mas não `InnoDB`), este valor `Extra` pode ocorrer para Queries `COUNT(*)` para as quais a cláusula `WHERE` está faltando ou é sempre verdadeira e não há cláusula `GROUP BY`. (Este é um caso de uma Query implicitamente agrupada onde o Storage Engine influencia se um número determinístico de linhas pode ser lido.)

* `Skip_open_table`, `Open_frm_only`, `Open_full_table` (Propriedade JSON: `message`)

  Estes valores indicam otimizações de abertura de arquivo que se aplicam a Queries para tabelas `INFORMATION_SCHEMA`, conforme descrito na Seção 8.2.3, “Otimizando Queries INFORMATION_SCHEMA”.

  + `Skip_open_table`: Os arquivos da tabela não precisam ser abertos. A informação já se tornou disponível dentro da Query varrendo o diretório da Database.

  + `Open_frm_only`: Apenas o arquivo `.frm` da tabela precisa ser aberto.

  + `Open_full_table`: A busca de informação não otimizada. Os arquivos `.frm`, `.MYD` e `.MYI` devem ser abertos.

* `Start temporary`, `End temporary` (Propriedade JSON: `message`)

  Isso indica o uso de tabela temporária para a estratégia de semijoin Duplicate Weedout.

* `unique row not found` (Propriedade JSON: `message`)

  Para uma Query como `SELECT ... FROM tbl_name`, nenhuma linha satisfaz a condição para um Index `UNIQUE` ou `PRIMARY KEY` na tabela.

* `Using filesort` (Propriedade JSON: `using_filesort`)

  O MySQL deve fazer uma passagem extra para descobrir como recuperar as linhas em ordem classificada (sorted order). A classificação é feita percorrendo todas as linhas de acordo com o tipo de JOIN e armazenando a Key de classificação (sort key) e o Pointer para a linha para todas as linhas que correspondem à cláusula `WHERE`. As Keys são então classificadas e as linhas são recuperadas em ordem classificada. Veja Seção 8.2.1.14, “Otimização ORDER BY”.

* `Using index` (Propriedade JSON: `using_index`)

  A informação da coluna é recuperada da tabela usando apenas informação na Index tree sem ter que fazer uma busca adicional para ler a linha real. Esta estratégia pode ser usada quando a Query usa apenas colunas que fazem parte de um único Index.

  Para tabelas `InnoDB` que possuem um Index clusterizado definido pelo usuário, esse Index pode ser usado mesmo quando `Using index` estiver ausente na coluna `Extra`. Este é o caso se `type` for `index` e `key` for `PRIMARY`.

* `Using index condition` (Propriedade JSON: `using_index_condition`)

  As tabelas são lidas acessando tuplas de Index e testando-as primeiro para determinar se devem ler linhas de tabela completas. Desta forma, a informação do Index é usada para adiar (“push down”) a leitura de linhas de tabela completas, a menos que seja necessário. Veja Seção 8.2.1.5, “Otimização Index Condition Pushdown”.

* `Using index for group-by` (Propriedade JSON: `using_index_for_group_by`)

  Semelhante ao método de acesso à tabela `Using index`, `Using index for group-by` indica que o MySQL encontrou um Index que pode ser usado para recuperar todas as colunas de uma Query `GROUP BY` ou `DISTINCT` sem nenhum acesso de disco extra à tabela real. Além disso, o Index é usado da maneira mais eficiente para que, para cada grupo, apenas algumas entradas de Index sejam lidas. Para detalhes, veja Seção 8.2.1.15, “Otimização GROUP BY”.

* `Using join buffer (Block Nested Loop)`, `Using join buffer (Batched Key Access)` (Propriedade JSON: `using_join_buffer`)

  As tabelas de JOINs anteriores são lidas em porções no Join Buffer, e então suas linhas são usadas do Buffer para realizar o JOIN com a tabela atual. `(Block Nested Loop)` indica o uso do algoritmo Block Nested-Loop e `(Batched Key Access)` indica o uso do algoritmo Batched Key Access. Ou seja, as Keys da tabela na linha anterior da saída do `EXPLAIN` são armazenadas em Buffer, e as linhas correspondentes são buscadas em lotes da tabela representada pela linha na qual `Using join buffer` aparece.

  Na saída formatada em JSON, o valor de `using_join_buffer` é sempre um de `Block Nested Loop` ou `Batched Key Access`.

  Para mais informações sobre estes algoritmos, veja Algoritmo de Join Block Nested-Loop e Joins Batched Key Access.

* `Using MRR` (Propriedade JSON: `message`)

  As tabelas são lidas usando a estratégia de otimização Multi-Range Read. Veja Seção 8.2.1.10, “Otimização Multi-Range Read”.

* `Using sort_union(...)`, `Using union(...)`, `Using intersect(...)` (Propriedade JSON: `message`)

  Estes indicam o algoritmo particular mostrando como as varreduras de Index são mescladas para o tipo de JOIN `index_merge`. Veja Seção 8.2.1.3, “Otimização Index Merge”.

* `Using temporary` (Propriedade JSON: `using_temporary_table`)

  Para resolver a Query, o MySQL precisa criar uma tabela temporária para manter o resultado. Isso tipicamente acontece se a Query contiver cláusulas `GROUP BY` e `ORDER BY` que listam colunas de forma diferente.

* `Using where` (Propriedade JSON: `attached_condition`)

  Uma cláusula `WHERE` é usada para restringir quais linhas correspondem à próxima tabela ou são enviadas ao cliente. A menos que você pretenda especificamente buscar ou examinar todas as linhas da tabela, você pode ter algo errado na sua Query se o valor `Extra` não for `Using where` e o tipo de JOIN da tabela for `ALL` ou `index`.

  `Using where` não tem uma contraparte direta na saída formatada em JSON; a propriedade `attached_condition` contém qualquer condição `WHERE` usada.

* `Using where with pushed condition` (Propriedade JSON: `message`)

  Este item se aplica a tabelas `NDB` *apenas*. Isso significa que o NDB Cluster está usando a otimização Condition Pushdown para melhorar a eficiência de uma comparação direta entre uma coluna não Indexada e uma constante. Em tais casos, a condição é “empurrada para baixo” (pushed down) para os Data Nodes do Cluster e é avaliada em todos os Data Nodes simultaneamente. Isso elimina a necessidade de enviar linhas não correspondentes pela rede e pode acelerar tais Queries em um fator de 5 a 10 vezes em comparação com os casos em que o Condition Pushdown poderia ser, mas não é usado. Para mais informações, veja Seção 8.2.1.4, “Otimização Engine Condition Pushdown”.

* `Zero limit` (Propriedade JSON: `message`)

  A Query tinha uma cláusula `LIMIT 0` e não pode selecionar nenhuma linha.

#### Interpretação da Saída do EXPLAIN

Você pode obter uma boa indicação de quão bom é um JOIN multiplicando os valores na coluna `rows` da saída do `EXPLAIN`. Isso deve lhe dizer aproximadamente quantas linhas o MySQL deve examinar para executar a Query. Se você restringir Queries com a variável de sistema `max_join_size`, este produto de linhas também é usado para determinar quais comandos `SELECT` de múltiplas tabelas executar e quais abortar. Veja Seção 5.1.1, “Configurando o Servidor”.

O exemplo a seguir mostra como um JOIN de múltiplas tabelas pode ser otimizado progressivamente com base nas informações fornecidas pelo `EXPLAIN`.

Suponha que você tenha o comando `SELECT` mostrado aqui e que você planeje examiná-lo usando `EXPLAIN`:

```sql
EXPLAIN SELECT tt.TicketNumber, tt.TimeIn,
               tt.ProjectReference, tt.EstimatedShipDate,
               tt.ActualShipDate, tt.ClientID,
               tt.ServiceCodes, tt.RepetitiveID,
               tt.CurrentProcess, tt.CurrentDPPerson,
               tt.RecordVolume, tt.DPPrinted, et.COUNTRY,
               et_1.COUNTRY, do.CUSTNAME
        FROM tt, et, et AS et_1, do
        WHERE tt.SubmitTime IS NULL
          AND tt.ActualPC = et.EMPLOYID
          AND tt.AssignedPC = et_1.EMPLOYID
          AND tt.ClientID = do.CUSTNMBR;
```

Para este exemplo, faça as seguintes suposições:

* As colunas que estão sendo comparadas foram declaradas da seguinte forma.

  <table summary="Nomes de tabelas, nomes de colunas e tipos de dados para as colunas que estão sendo comparadas no exemplo EXPLAIN descrito no texto anterior."><col style="width: 10%"/><col style="width: 25%"/><col style="width: 25%"/><thead><tr> <th>Tabela</th> <th>Coluna</th> <th>Tipo de Dado</th> </tr></thead><tbody><tr> <th><code>tt</code></th> <td><code>ActualPC</code></td> <td><code>CHAR(10)</code></td> </tr><tr> <th><code>tt</code></th> <td><code>AssignedPC</code></td> <td><code>CHAR(10)</code></td> </tr><tr> <th><code>tt</code></th> <td><code>ClientID</code></td> <td><code>CHAR(10)</code></td> </tr><tr> <th><code>et</code></th> <td><code>EMPLOYID</code></td> <td><code>CHAR(15)</code></td> </tr><tr> <th><code>do</code></th> <td><code>CUSTNMBR</code></td> <td><code>CHAR(15)</code></td> </tr></tbody></table>

* As tabelas têm os seguintes Indexes.

  <table summary="Indexes para cada uma das tabelas que fazem parte do exemplo EXPLAIN descrito no texto anterior."><col style="width: 10%"/><col style="width: 40%"/><thead><tr> <th>Tabela</th> <th>Índice</th> </tr></thead><tbody><tr> <td><code>tt</code></td> <td><code>ActualPC</code></td> </tr><tr> <td><code>tt</code></td> <td><code>AssignedPC</code></td> </tr><tr> <td><code>tt</code></td> <td><code>ClientID</code></td> </tr><tr> <td><code>et</code></td> <td><code>EMPLOYID</code> (primary key)</td> </tr><tr> <td><code>do</code></td> <td><code>CUSTNMBR</code> (primary key)</td> </tr></tbody></table>

* Os valores de `tt.ActualPC` não estão distribuídos uniformemente.

Inicialmente, antes que qualquer otimização tenha sido executada, o comando `EXPLAIN` produz a seguinte informação:

```sql
table type possible_keys key  key_len ref  rows  Extra
et    ALL  PRIMARY       NULL NULL    NULL 74
do    ALL  PRIMARY       NULL NULL    NULL 2135
et_1  ALL  PRIMARY       NULL NULL    NULL 74
tt    ALL  AssignedPC,   NULL NULL    NULL 3872
           ClientID,
           ActualPC
      Range checked for each record (index map: 0x23)
```

Como `type` é `ALL` para cada tabela, esta saída indica que o MySQL está gerando um produto cartesiano de todas as tabelas; ou seja, cada combinação de linhas. Isso leva bastante tempo, porque o produto do número de linhas em cada tabela deve ser examinado. Para o caso em questão, este produto é 74 × 2135 × 74 × 3872 = 45.268.558.720 linhas. Se as tabelas fossem maiores, você pode apenas imaginar quanto tempo levaria.

Um problema aqui é que o MySQL pode usar Indexes em colunas de forma mais eficiente se elas forem declaradas com o mesmo tipo e tamanho. Neste contexto, `VARCHAR` e `CHAR` são considerados iguais se forem declarados com o mesmo tamanho. `tt.ActualPC` é declarado como `CHAR(10)` e `et.EMPLOYID` é `CHAR(15)`, então há uma incompatibilidade de comprimento.

Para corrigir essa disparidade entre os comprimentos das colunas, use `ALTER TABLE` para aumentar o comprimento de `ActualPC` de 10 caracteres para 15 caracteres:

```sql
mysql> ALTER TABLE tt MODIFY ActualPC VARCHAR(15);
```

Agora `tt.ActualPC` e `et.EMPLOYID` são ambos `VARCHAR(15)`. Executar o comando `EXPLAIN` novamente produz este resultado:

```sql
table type   possible_keys key     key_len ref         rows    Extra
tt    ALL    AssignedPC,   NULL    NULL    NULL        3872    Using
             ClientID,                                         where
             ActualPC
do    ALL    PRIMARY       NULL    NULL    NULL        2135
      Range checked for each record (index map: 0x1)
et_1  ALL    PRIMARY       NULL    NULL    NULL        74
      Range checked for each record (index map: 0x1)
et    eq_ref PRIMARY       PRIMARY 15      tt.ActualPC 1
```

Isto não é perfeito, mas é muito melhor: O produto dos valores de `rows` é menor por um fator de 74. Esta versão é executada em alguns segundos.

Uma segunda alteração pode ser feita para eliminar as incompatibilidades de comprimento de coluna para as comparações `tt.AssignedPC = et_1.EMPLOYID` e `tt.ClientID = do.CUSTNMBR`:

```sql
mysql> ALTER TABLE tt MODIFY AssignedPC VARCHAR(15),
                      MODIFY ClientID   VARCHAR(15);
```

Após essa modificação, `EXPLAIN` produz a saída mostrada aqui:

```sql
table type   possible_keys key      key_len ref           rows Extra
et    ALL    PRIMARY       NULL     NULL    NULL          74
tt    ref    AssignedPC,   ActualPC 15      et.EMPLOYID   52   Using
             ClientID,                                         where
             ActualPC
et_1  eq_ref PRIMARY       PRIMARY  15      tt.AssignedPC 1
do    eq_ref PRIMARY       PRIMARY  15      tt.ClientID   1
```

Neste ponto, a Query está otimizada quase o máximo possível. O problema restante é que, por padrão, o MySQL assume que os valores na coluna `tt.ActualPC` estão distribuídos uniformemente, e esse não é o caso para a tabela `tt`. Felizmente, é fácil dizer ao MySQL para analisar a distribuição da Key:

```sql
mysql> ANALYZE TABLE tt;
```

Com a informação de Index adicional, o JOIN é perfeito e `EXPLAIN` produz este resultado:

```sql
table type   possible_keys key     key_len ref           rows Extra
tt    ALL    AssignedPC    NULL    NULL    NULL          3872 Using
             ClientID,                                        where
             ActualPC
et    eq_ref PRIMARY       PRIMARY 15      tt.ActualPC   1
et_1  eq_ref PRIMARY       PRIMARY 15      tt.AssignedPC 1
do    eq_ref PRIMARY       PRIMARY 15      tt.ClientID   1
```

A coluna `rows` na saída do `EXPLAIN` é um palpite educado do Optimizer de JOIN do MySQL. Verifique se os números estão próximos da verdade comparando o produto `rows` com o número real de linhas que a Query retorna. Se os números forem bastante diferentes, você pode obter melhor performance usando `STRAIGHT_JOIN` no seu comando `SELECT` e tentando listar as tabelas em uma ordem diferente na cláusula `FROM`. (No entanto, `STRAIGHT_JOIN` pode impedir que Indexes sejam usados porque desabilita transformações de semijoin. Veja Seção 8.2.2.1, “Otimizando Subqueries, Tabelas Derivadas e Referências de View com Transformações Semijoin”.)

É possível em alguns casos executar comandos que modificam dados quando `EXPLAIN SELECT` é usado com uma subquery; para mais informações, veja Seção 13.2.10.8, “Tabelas Derivadas”.