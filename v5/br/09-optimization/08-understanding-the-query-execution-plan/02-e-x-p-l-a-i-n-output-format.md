### 8.8.2 Formato de Saída Explicação

A instrução `EXPLAIN` fornece informações sobre como o MySQL executa as instruções. A `EXPLAIN` funciona com as instruções `SELECT`, `DELETE`, `INSERT`, `REPLACE` e `UPDATE`.

`EXPLAIN` retorna uma linha de informações para cada tabela usada na instrução `SELECT`. Ela lista as tabelas na saída na ordem que o MySQL as lê enquanto processa a instrução. O MySQL resolve todas as junções usando um método de junção em loop aninhado. Isso significa que o MySQL lê uma linha da primeira tabela e, em seguida, encontra uma linha correspondente na segunda tabela, na terceira tabela e assim por diante. Quando todas as tabelas são processadas, o MySQL exibe as colunas selecionadas e retrocede pela lista de tabelas até encontrar uma tabela para a qual haja mais linhas correspondentes. A próxima linha é lida dessa tabela e o processo continua com a próxima tabela.

A saída `EXPLAIN` inclui informações sobre as partições. Além disso, para instruções `SELECT`, o `EXPLAIN` gera informações extensas que podem ser exibidas com `SHOW WARNINGS` após o `EXPLAIN` (consulte a Seção 8.8.3, “Formato de Saída EXPLAIN Extendido”).

Nota

Em versões mais antigas do MySQL, as informações de partição e estendida eram geradas usando `EXPLAIN PARTITIONS` e `EXPLAIN EXTENDED`. Essas sintaxes ainda são reconhecidas para compatibilidade reversa, mas a saída de partição e estendida está habilitada por padrão, então as palavras-chave `PARTITIONS` e `EXTENDED` são supérfluas e desatualizadas. Seu uso resulta em um aviso; espere que elas sejam removidas da sintaxe `EXPLAIN` em uma futura versão do MySQL.

Você não pode usar as palavras-chave desatualizadas `PARTITIONS` e `EXTENDED` juntas na mesma instrução `EXPLAIN`. Além disso, nenhuma dessas palavras-chave pode ser usada junto com a opção `FORMAT`.

Nota

O MySQL Workbench possui uma funcionalidade de Visual Explain que fornece uma representação visual do resultado do `EXPLAIN`. Veja o Tutorial: Usando Explain para melhorar o desempenho das consultas.

- EXPLAIN Colunas de Saída
- EXPLIQUE Tipos de Conexão
- EXPLAIN Informações Adicionais
- EXPLAIN Saída de Interpretação

#### EXPLAIN Colunas de Saída

Esta seção descreve as colunas de saída produzidas pelo `EXPLAIN`. Seções posteriores fornecem informações adicionais sobre as colunas `type` e `Extra`.

Cada linha de saída do `EXPLAIN` fornece informações sobre uma tabela. Cada linha contém os valores resumidos na Tabela 8.1, “Colunas de Saída do EXPLAIN”, e descritos com mais detalhes após a tabela. Os nomes das colunas são mostrados na primeira coluna da tabela; a segunda coluna fornece o nome da propriedade equivalente mostrado na saída quando o `FORMAT=JSON` é usado.

**Tabela 8.1 Colunas de Saída do Resultado EXPLAIN**

<table summary="Colunas de saída produzidas pelo comando EXPLAIN."><col style="width: 25%"/><col style="width: 25%"/><col style="width: 50%"/><thead><tr> <th>Coluna</th> <th>Nome JSON</th> <th>Significado</th> </tr></thead><tbody><tr> <th><a class="link" href="explain-output.html#explain_id">[[PH_HTML_CODE_<code>access_type</code>]</a></th> <td>[[PH_HTML_CODE_<code>access_type</code>]</td> <td>O identificador [[PH_HTML_CODE_<code>possible_keys</code>]</td> </tr><tr> <th><a class="link" href="explain-output.html#explain_select_type">[[PH_HTML_CODE_<code>key</code>]</a></th> <td>Nenhum</td> <td>O tipo [[PH_HTML_CODE_<code>key</code>]</td> </tr><tr> <th><a class="link" href="explain-output.html#explain_table">[[PH_HTML_CODE_<code>key_len</code>]</a></th> <td>[[PH_HTML_CODE_<code>key_length</code>]</td> <td>A tabela para a linha de saída</td> </tr><tr> <th><a class="link" href="explain-output.html#explain_partitions">[[PH_HTML_CODE_<code>ref</code>]</a></th> <td>[[PH_HTML_CODE_<code>ref</code>]</td> <td>As divisórias correspondentes</td> </tr><tr> <th><a class="link" href="explain-output.html#explain_type">[[PH_HTML_CODE_<code>rows</code>]</a></th> <td>[[<code>access_type</code>]]</td> <td>O tipo de conexão</td> </tr><tr> <th><a class="link" href="explain-output.html#explain_possible_keys">[[<code>select_id</code><code>access_type</code>]</a></th> <td>[[<code>possible_keys</code>]]</td> <td>Os possíveis índices para escolher</td> </tr><tr> <th><a class="link" href="explain-output.html#explain_key">[[<code>key</code>]]</a></th> <td>[[<code>key</code>]]</td> <td>O índice escolhido na verdade</td> </tr><tr> <th><a class="link" href="explain-output.html#explain_key_len">[[<code>key_len</code>]]</a></th> <td>[[<code>key_length</code>]]</td> <td>O comprimento da chave escolhida</td> </tr><tr> <th><a class="link" href="explain-output.html#explain_ref">[[<code>ref</code>]]</a></th> <td>[[<code>ref</code>]]</td> <td>As colunas em comparação com o índice</td> </tr><tr> <th><a class="link" href="explain-output.html#explain_rows">[[<code>rows</code>]]</a></th> <td>[[<code>SELECT</code><code>access_type</code>]</td> <td>Estimativa de linhas a serem examinadas</td> </tr><tr> <th><a class="link" href="explain-output.html#explain_filtered">[[<code>SELECT</code><code>access_type</code>]</a></th> <td>[[<code>SELECT</code><code>possible_keys</code>]</td> <td>Porcentagem de linhas filtradas por condição da tabela</td> </tr><tr> <th><a class="link" href="explain-output.html#explain_extra">[[<code>SELECT</code><code>key</code>]</a></th> <td>Nenhum</td> <td>Informações adicionais</td> </tr></tbody></table>

Nota

As propriedades do JSON que são `NULL` não são exibidas na saída `EXPLAIN` formatada em JSON.

- `id` (nome no JSON: `select_id`)

  O identificador `SELECT`. Este é o número sequencial do `SELECT` dentro da consulta. O valor pode ser `NULL` se a linha se referir ao resultado da união de outras linhas. Neste caso, a coluna `table` exibe um valor como `<unionM,N>` para indicar que a linha se refere à união das linhas com valores de `id` de *`M`* e *`N`*.

- `select_type` (nome JSON: none)

  O tipo de `SELECT`, que pode ser qualquer um dos mostrados na tabela a seguir. Um `EXPLAIN` formatado em JSON expõe o tipo de `SELECT` como uma propriedade de um `query_block`, a menos que seja `SIMPLE` ou `PRIMARY`. Os nomes do JSON (quando aplicável) também são mostrados na tabela.

  <table summary="valores de select_type e o significado de cada valor."><col style="width: 25%"/><col style="width: 25%"/><col style="width: 50%"/><thead><tr> <th>[[PH_HTML_CODE_<code>dependent</code>] Valor</th> <th>Nome JSON</th> <th>Significado</th> </tr></thead><tbody><tr> <th>[[PH_HTML_CODE_<code>dependent</code>]</th> <td>Nenhum</td> <td>Simples<a class="link" href="select.html" title="13.2.9 Instrução SELECT">[[PH_HTML_CODE_<code>SELECT</code>]</a>(não usando<a class="link" href="union.html" title="13.2.9.3 Cláusula de UNIÃO">[[PH_HTML_CODE_<code>UNION</code>]</a>ou subconsultas)</td> </tr><tr> <th>[[PH_HTML_CODE_<code>UNION RESULT</code>]</th> <td>Nenhum</td> <td>Mais distante<a class="link" href="select.html" title="13.2.9 Instrução SELECT">[[PH_HTML_CODE_<code>union_result</code>]</a></td> </tr><tr> <th><a class="link" href="union.html" title="13.2.9.3 Cláusula de UNIÃO">[[PH_HTML_CODE_<code>UNION</code>]</a></th> <td>Nenhum</td> <td>Segunda ou posterior<a class="link" href="select.html" title="13.2.9 Instrução SELECT">[[PH_HTML_CODE_<code>SUBQUERY</code>]</a>declaração em um<a class="link" href="union.html" title="13.2.9.3 Cláusula de UNIÃO">[[PH_HTML_CODE_<code>SELECT</code>]</a></td> </tr><tr> <th>[[PH_HTML_CODE_<code>DEPENDENT SUBQUERY</code>]</th> <td>[[<code>dependent</code>]] ([[<code>SIMPLE</code><code>dependent</code>])</td> <td>Segunda ou posterior<a class="link" href="select.html" title="13.2.9 Instrução SELECT">[[<code>SELECT</code>]]</a>declaração em um<a class="link" href="union.html" title="13.2.9.3 Cláusula de UNIÃO">[[<code>UNION</code>]]</a>, dependente da consulta externa</td> </tr><tr> <th>[[<code>UNION RESULT</code>]]</th> <td>[[<code>union_result</code>]]</td> <td>Resultado de um<a class="link" href="union.html" title="13.2.9.3 Cláusula de UNIÃO">[[<code>UNION</code>]]</a>.</td> </tr><tr> <th><a class="link" href="optimizer-hints.html#optimizer-hints-subquery" title="Dicas de otimização de subconsultas">[[<code>SUBQUERY</code>]]</a></th> <td>Nenhum</td> <td>Primeiro<a class="link" href="select.html" title="13.2.9 Instrução SELECT">[[<code>SELECT</code>]]</a>em subconsulta</td> </tr><tr> <th>[[<code>DEPENDENT SUBQUERY</code>]]</th> <td>[[<code>SELECT</code><code>dependent</code>] ([[<code>SELECT</code><code>dependent</code>])</td> <td>Primeiro<a class="link" href="select.html" title="13.2.9 Instrução SELECT">[[<code>SELECT</code><code>SELECT</code>]</a>em subconsulta, dependente da consulta externa</td> </tr><tr> <th>[[<code>SELECT</code><code>UNION</code>]</th> <td>Nenhum</td> <td>Tabela derivada</td> </tr><tr> <th>[[<code>SELECT</code><code>UNION RESULT</code>]</th> <td>[[<code>SELECT</code><code>union_result</code>]</td> <td>Subconsulta materializada</td> </tr><tr> <th>[[<code>SELECT</code><code>UNION</code>]</th> <td>[[<code>SELECT</code><code>SUBQUERY</code>] ([[<code>SELECT</code><code>SELECT</code>])</td> <td>Uma subconsulta para a qual o resultado não pode ser armazenado em cache e deve ser reavaliado para cada linha da consulta externa</td> </tr><tr> <th>[[<code>SELECT</code><code>DEPENDENT SUBQUERY</code>]</th> <td>[[<code>UNION</code><code>dependent</code>] ([[<code>UNION</code><code>dependent</code>])</td> <td>A segunda ou a posterior seleção em uma<a class="link" href="union.html" title="13.2.9.3 Cláusula de UNIÃO">[[<code>UNION</code><code>SELECT</code>]</a>que pertence a uma subconsulta não cacheável (veja [[<code>UNION</code><code>UNION</code>])</td> </tr></tbody></table>

  `DEPENDENT` geralmente indica o uso de uma subconsulta correlacionada. Veja a Seção 13.2.10.7, “Subconsultas Correlacionadas”.

  A avaliação de `DEPENDENT SUBQUERY` difere da avaliação de `UNCACHEABLE SUBQUERY`. Para `DEPENDENT SUBQUERY`, a subconsulta é reavaliada apenas uma vez para cada conjunto de valores diferentes das variáveis do seu contexto externo. Para `UNCACHEABLE SUBQUERY`, a subconsulta é reavaliada para cada linha do contexto externo.

  A capacidade de cache de subconsultas difere do cache de resultados de consultas no cache de consultas (que é descrito na Seção 8.10.3.1, “Como o Cache de Consultas Funciona”). O cache de subconsultas ocorre durante a execução da consulta, enquanto o cache de consultas é usado para armazenar resultados apenas após a execução da consulta terminar.

  Quando você especifica `FORMAT=JSON` com `EXPLAIN`, a saída não tem uma única propriedade diretamente equivalente a `select_type`; a propriedade `query_block` corresponde a um `SELECT` específico. As propriedades equivalentes à maioria dos tipos de subconsultas `SELECT` mostrados anteriormente estão disponíveis (um exemplo é `materialized_from_subquery` para `MATERIALIZED`), e são exibidas quando apropriado. Não há equivalentes JSON para `SIMPLE` ou `PRIMARY`.

  O valor `select_type` para instruções que não são `SELECT` exibe o tipo da instrução para as tabelas afetadas. Por exemplo, `select_type` é `DELETE` para instruções `DELETE`.

- `table` (nome JSON: `table_name`)

  O nome da tabela a qual a linha de saída se refere. Isso também pode ser um dos seguintes valores:

  - `<unionM,N>`: A linha refere-se à união das linhas com valores de `id` de *`M`* e *`N`*.

  - `<derivedN>`: A linha refere-se ao resultado da tabela derivada para a linha com um valor de `id` de *`N`*. Uma tabela derivada pode resultar, por exemplo, de uma subconsulta na cláusula `FROM`.

  - `<subqueryN>`: A linha refere-se ao resultado de uma subconsulta materializada para a linha com um valor de `id` de *`N`*. Veja a Seção 8.2.2.2, “Otimizando Subconsultas com Materialização”.

- `partitions` (nome JSON: `partitions`)

  As partições nas quais os registros seriam correspondidos pela consulta. O valor é `NULL` para tabelas não particionadas. Consulte a Seção 22.3.5, “Obtendo Informações Sobre Partições”.

- `type` (nome no JSON: `access_type`)

  O tipo de junção. Para descrições dos diferentes tipos, consulte os Tipos de junção `EXPLAIN`.

- `possible_keys` (nome JSON: `possible_keys`)

  A coluna `possible_keys` indica os índices a partir dos quais o MySQL pode escolher para encontrar as linhas nesta tabela. Note que essa coluna é totalmente independente da ordem das tabelas, conforme exibida na saída do `EXPLAIN`. Isso significa que algumas das chaves em `possible_keys` podem não ser utilizáveis na prática com a ordem da tabela gerada.

  Se esta coluna estiver `NULL` (ou indefinida na saída formatada em JSON), não há índices relevantes. Nesse caso, você pode melhorar o desempenho da sua consulta examinando a cláusula `WHERE` para verificar se ela se refere a alguma coluna ou colunas que seriam adequadas para indexação. Se for o caso, crie um índice apropriado e verifique a consulta novamente com `EXPLAIN`. Veja a Seção 13.1.8, “Instrução ALTER TABLE”.

  Para ver quais índices uma tabela tem, use `SHOW INDEX FROM tbl_name`.

- `key` (nome JSON: `key`)

  A coluna `chave` indica a chave (índice) que o MySQL realmente decidiu usar. Se o MySQL decidir usar um dos índices `possíveis_chaves` para procurar linhas, esse índice é listado como o valor da chave.

  É possível que `key` nomeie um índice que não está presente no valor `possible_keys`. Isso pode acontecer se nenhum dos índices `possible_keys` for adequado para buscar linhas, mas todas as colunas selecionadas pela consulta forem colunas de algum outro índice. Ou seja, o índice nomeado cobre as colunas selecionadas, então, embora não seja usado para determinar quais linhas serão recuperadas, uma varredura de índice é mais eficiente do que uma varredura de linha de dados.

  Para o `InnoDB`, um índice secundário pode cobrir as colunas selecionadas, mesmo que a consulta também selecione a chave primária, porque o `InnoDB` armazena o valor da chave primária com cada índice secundário. Se `key` for `NULL`, o MySQL não encontrou nenhum índice para usar para executar a consulta de forma mais eficiente.

  Para forçar o MySQL a usar ou ignorar um índice listado na coluna `possible_keys`, use `FORCE INDEX`, `USE INDEX` ou `IGNORE INDEX` na sua consulta. Veja a Seção 8.9.4, “Dicas de índice”.

  Para tabelas `MyISAM`, executar `ANALYZE TABLE` ajuda o otimizador a escolher índices melhores. Para tabelas `MyISAM`, **myisamchk --analyze** faz o mesmo. Veja a Seção 13.7.2.1, “Instrução ANALYZE TABLE”, e a Seção 7.6, “Manutenção e Recuperação após Falha de Tabelas MyISAM”.

- `key_len` (nome JSON: `key_length`)

  A coluna `key_len` indica o comprimento da chave que o MySQL decidiu usar. O valor de `key_len` permite determinar quantas partes de uma chave de múltiplos campos o MySQL realmente usa. Se a coluna `key` disser `NULL`, a coluna `key_len` também dirá `NULL`.

  Devido ao formato de armazenamento de chave, o comprimento da chave é um maior para uma coluna que pode ser `NULL` do que para uma coluna `NOT NULL`.

- `ref` (nome JSON: `ref`)

  A coluna `ref` mostra quais colunas ou constantes são comparadas ao índice nomeado na coluna `key` para selecionar linhas da tabela.

  Se o valor for `func`, o valor usado é o resultado de alguma função. Para ver qual função, use `SHOW WARNINGS` após `EXPLAIN` para ver o resultado detalhado do `EXPLAIN`. A função pode ser, na verdade, um operador, como um operador aritmético.

- `rows` (nome JSON: `rows`)

  A coluna `rows` indica o número de linhas que o MySQL acredita que deve examinar para executar a consulta.

  Para as tabelas do InnoDB, esse número é uma estimativa e nem sempre será exato.

- `filtered` (nome JSON: `filtered`)

  A coluna `filtrada` indica uma porcentagem estimada de linhas da tabela filtradas pela condição da tabela. O valor máximo é 100, o que significa que não houve filtragem de linhas. Valores que diminuem de 100 indicam quantidades crescentes de filtragem. `rows` mostra o número estimado de linhas examinadas e `rows` × `filtrada` mostra o número de linhas unidas com a tabela seguinte. Por exemplo, se `rows` for 1000 e `filtrada` for 50,00 (50%), o número de linhas a serem unidas com a tabela seguinte é 1000 × 50% = 500.

- `Extra` (nome JSON: nenhum)

  Esta coluna contém informações adicionais sobre como o MySQL resolve a consulta. Para descrições dos diferentes valores, consulte as informações extras `EXPLAIN`.

  Não há uma única propriedade JSON correspondente à coluna `Extra`; no entanto, os valores que podem ocorrer nesta coluna são exibidos como propriedades JSON ou como o texto da propriedade `message`.

#### EXPLIQUE Tipos de Conexão

A coluna `type` da saída `EXPLAIN` descreve como as tabelas são unidas. Na saída formatada em JSON, esses valores são encontrados como propriedades do `access_type`. A lista a seguir descreve os tipos de junção, ordenados do melhor tipo para o pior:

- `sistema`

  A tabela tem apenas uma linha (= tabela de sistema). Este é um caso especial do tipo de junção `const`.

- `const`

  A tabela tem, no máximo, uma linha correspondente, que é lida no início da consulta. Como há apenas uma linha, os valores da coluna dessa linha podem ser considerados constantes pelo resto do otimizador. As tabelas `const` são muito rápidas porque são lidas apenas uma vez.

  `const` é usado quando você compara todas as partes de um índice `PRIMARY KEY` ou `UNIQUE` a valores constantes. Nas seguintes consultas, *`tbl_name`* pode ser usado como uma tabela `const`:

  ```sql
  SELECT * FROM tbl_name WHERE primary_key=1;

  SELECT * FROM tbl_name
    WHERE primary_key_part1=1 AND primary_key_part2=2;
  ```

- `eq_ref`

  Uma linha é lida desta tabela para cada combinação de linhas das tabelas anteriores. Exceto para os tipos `system` e `const`, este é o melhor tipo de junção possível. Ele é usado quando todas as partes de um índice são usadas pela junção e o índice é um índice `PRIMARY KEY` ou `UNIQUE NOT NULL`.

  `eq_ref` pode ser usado para colunas indexadas que são comparadas usando o operador `=` . O valor de comparação pode ser uma constante ou uma expressão que usa colunas de tabelas que são lidas antes desta tabela. Nos exemplos a seguir, o MySQL pode usar uma junção `eq_ref` para processar *`ref_table`*:

  ```sql
  SELECT * FROM ref_table,other_table
    WHERE ref_table.key_column=other_table.column;

  SELECT * FROM ref_table,other_table
    WHERE ref_table.key_column_part1=other_table.column
    AND ref_table.key_column_part2=1;
  ```

- `ref`

  Todas as linhas com valores de índice correspondentes são lidas desta tabela para cada combinação de linhas das tabelas anteriores. O `ref` é usado se a junção usar apenas um prefixo da esquerda da chave ou se a chave não for um índice `PRIMARY KEY` ou `UNIQUE` (em outras palavras, se a junção não puder selecionar uma única linha com base no valor da chave). Se a chave usada corresponder a apenas algumas linhas, este é um bom tipo de junção.

  `ref` pode ser usado para colunas indexadas que são comparadas usando o operador `=` ou `=>`. Nos exemplos a seguir, o MySQL pode usar uma junção `ref` para processar *`ref_table`*:

  ```sql
  SELECT * FROM ref_table WHERE key_column=expr;

  SELECT * FROM ref_table,other_table
    WHERE ref_table.key_column=other_table.column;

  SELECT * FROM ref_table,other_table
    WHERE ref_table.key_column_part1=other_table.column
    AND ref_table.key_column_part2=1;
  ```

- `fulltext`

  A junção é realizada usando um índice `FULLTEXT`.

- `ref_or_null`

  Este tipo de junção é semelhante ao `ref`, mas com a adição de que o MySQL faz uma busca extra por linhas que contêm valores `NULL`. Essa otimização do tipo de junção é usada com mais frequência para resolver subconsultas. Nos exemplos a seguir, o MySQL pode usar uma junção `ref_or_null` para processar *`ref_table`*:

  ```sql
  SELECT * FROM ref_table
    WHERE key_column=expr OR key_column IS NULL;
  ```

  Consulte a Seção 8.2.1.13, “Otimização IS NULL”.

- `index_merge`

  Este tipo de junção indica que a otimização de junção de índices foi usada. Neste caso, a coluna `key` na linha de saída contém uma lista de índices usados e `key_len` contém uma lista das partes de chave mais longas para os índices usados. Para mais informações, consulte a Seção 8.2.1.3, “Otimização de Junção de Índices”.

- `unique_subquery`

  Esse tipo substitui `eq_ref` para algumas subconsultas `IN` da seguinte forma:

  ```sql
  value IN (SELECT primary_key FROM single_table WHERE some_expr)
  ```

  `unique_subquery` é apenas uma função de busca de índice que substitui completamente a subconsulta para melhorar a eficiência.

- `index_subquery`

  Este tipo de junção é semelhante ao `unique_subquery`. Ele substitui subconsultas `IN`, mas funciona para índices não únicos em subconsultas da seguinte forma:

  ```sql
  value IN (SELECT key_column FROM single_table WHERE some_expr)
  ```

- `range`

  Apenas as linhas que estão em um determinado intervalo são recuperadas, usando um índice para selecionar as linhas. A coluna `key` na linha de saída indica qual índice é usado. A `key_len` contém a parte mais longa da chave que foi usada. A coluna `ref` é `NULL` para este tipo.

  `range` pode ser usado quando uma coluna chave é comparada a uma constante usando qualquer um dos operadores `=`, `<>`, `>`, `>=`, `<`, `<=`, `IS NULL`, `<=>`, `BETWEEN`, `LIKE` ou `IN()`:

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

- `índice`

  O tipo de junção `index` é o mesmo que `ALL`, exceto que a árvore de índice é percorrida. Isso ocorre de duas maneiras:

  - Se o índice for um índice de cobertura para as consultas e puder ser usado para satisfazer todos os dados necessários da tabela, apenas a árvore do índice será percorrida. Nesse caso, a coluna `Extra` indica que o índice está sendo usado. Um varredura apenas com índice geralmente é mais rápida do que `ALL` porque o tamanho do índice geralmente é menor que os dados da tabela.

  - Um varrimento completo da tabela é realizado usando leituras do índice para buscar linhas de dados na ordem do índice. `Usa índice` não aparece na coluna `Extra`.

  O MySQL pode usar esse tipo de junção quando a consulta usa apenas colunas que fazem parte de um único índice.

- `TODOS`

  Um varredura completa da tabela é realizada para cada combinação de linhas das tabelas anteriores. Isso normalmente não é bom se a tabela for a primeira tabela não marcada como `const`, e geralmente é *muito* ruim em todos os outros casos. Normalmente, você pode evitar `ALL` adicionando índices que permitem a recuperação de linhas da tabela com base em valores constantes ou valores de coluna de tabelas anteriores.

#### EXPLAIN Informações Adicionais

A coluna `Extra` da saída `EXPLAIN` contém informações adicionais sobre como o MySQL resolve a consulta. A lista a seguir explica os valores que podem aparecer nesta coluna. Cada item também indica para a saída formatada em JSON qual propriedade exibe o valor `Extra`. Para alguns desses, há uma propriedade específica. Os outros são exibidos como o texto da propriedade `message`.

Se você deseja realizar suas consultas o mais rápido possível, procure por valores na coluna `Extra` dos parâmetros `Using filesort` e `Using temporary`, ou, na saída `EXPLAIN` formatada em JSON, por propriedades `using_filesort` e `using_temporary_table` iguais a `true`.

- `Child de 'table' empurrado para join@1` (texto `message` em JSON)

  Essa tabela é referenciada como a filha de *`table`* em uma junção que pode ser empurrada para o kernel NDB. Aplica-se apenas no NDB Cluster, quando as junções empurradas estão habilitadas. Consulte a descrição da variável de sistema `ndb_join_pushdown` para obter mais informações e exemplos.

- `const linha não encontrada` (propriedade JSON: `const_row_not_found`)

  Para uma consulta como `SELECT ... FROM tbl_name`, a tabela estava vazia.

- `Excluir todas as linhas` (propriedade JSON: `message`)

  Para `DELETE`, alguns motores de armazenamento (como `MyISAM`) suportam um método de manipulador que remove todas as linhas da tabela de maneira simples e rápida. Este valor `Extra` é exibido se o motor usar essa otimização.

- `Distinct` (propriedade JSON: `distinct`)

  O MySQL procura por valores distintos, então ele para de procurar mais linhas para a combinação de linha atual após encontrar a primeira linha correspondente.

- `FirstMatch(tbl_name)` (propriedade JSON: `first_match`)

  A estratégia de encurtamento de junção FirstMatch semijoin é usada para *`tbl_name`*.

- "Análise completa na chave NULL" (propriedade JSON: `message`)

  Isso ocorre para a otimização de subconsultas como uma estratégia de fallback quando o otimizador não pode usar um método de acesso de consulta por índice.

- `Impossível HAVING` (propriedade JSON: `message`)

  A cláusula `HAVING` é sempre falsa e não pode selecionar nenhuma linha.

- `Impossível WHERE` (propriedade JSON: `message`)

  A cláusula `WHERE` é sempre falsa e não pode selecionar nenhuma linha.

- `Impossível notar WHERE após a leitura de tabelas estáticas` (propriedade JSON: `message`)

  O MySQL leu todas as tabelas `const` (e `system`) e percebeu que a cláusula `WHERE` sempre é falsa.

- `LooseScan(m..n)` (propriedade JSON: `message`)

  A estratégia semijoin LooseScan é utilizada. *`m`* e *`n`* são números de peça-chave.

- `Nenhuma linha mínima/máxima correspondente` (propriedade JSON: `message`)

  Nenhuma linha satisfaz a condição para uma consulta como `SELECT MIN(...) FROM ... WHERE condição`.

- `nenhuma linha correspondente na tabela const` (propriedade JSON: `message`)

  Para uma consulta com uma junção, havia uma tabela vazia ou uma tabela sem linhas que satisfaçam uma condição de índice único.

- `Nenhuma linha correspondente após o corte de partição` (propriedade JSON: `message`)

  Para `DELETE` ou `UPDATE`, o otimizador não encontrou nada para excluir ou atualizar após a poda de partição. Isso é semelhante ao significado de `Impossível WHERE` para instruções `SELECT`.

- `Nenhuma tabela usada` (propriedade JSON: `message`)

  A consulta não tem a cláusula `FROM`, ou tem a cláusula `FROM DUAL`.

  Para as instruções `INSERT` ou `REPLACE`, o `EXPLAIN` exibe esse valor quando não há uma parte `SELECT`. Por exemplo, ele aparece para `EXPLAIN INSERT INTO t VALUES(10)`, pois é equivalente a `EXPLAIN INSERT INTO t SELECT 10 FROM DUAL`.

- `Não existe` (propriedade JSON: `message`)

  O MySQL conseguiu otimizar a consulta com uma `JOIN LEFT` e não examina mais linhas nesta tabela para a combinação da linha anterior após encontrar uma linha que corresponda aos critérios da `JOIN LEFT`. Aqui está um exemplo do tipo de consulta que pode ser otimizada dessa maneira:

  ```sql
  SELECT * FROM t1 LEFT JOIN t2 ON t1.id=t2.id
    WHERE t2.id IS NULL;
  ```

  Suponha que `t2.id` seja definido como `NOT NULL`. Nesse caso, o MySQL pesquisa `t1` e busca as linhas em `t2` usando os valores de `t1.id`. Se o MySQL encontrar uma linha correspondente em `t2`, ele sabe que `t2.id` nunca pode ser `NULL` e não pesquisa o restante das linhas em `t2` que têm o mesmo valor de `id`. Em outras palavras, para cada linha em `t1`, o MySQL precisa fazer apenas uma única pesquisa em `t2`, independentemente de quantas linhas realmente corresponderem em `t2`.

- O plano ainda não está pronto (propriedade JSON: nenhuma)

  Esse valor ocorre com `EXPLAIN FOR CONNECTION` quando o otimizador ainda não terminou de criar o plano de execução para a instrução que está sendo executada na conexão nomeada. Se o resultado do plano de execução contiver várias linhas, qualquer uma delas ou todas elas podem ter esse valor `Extra`, dependendo do progresso do otimizador na determinação do plano de execução completo.

- `Verificação de intervalo para cada registro (mapa de índice: N)` (propriedade JSON: `message`)

  O MySQL não encontrou um bom índice para usar, mas descobriu que alguns índices podem ser usados depois que os valores das colunas das tabelas anteriores são conhecidos. Para cada combinação de linha nas tabelas anteriores, o MySQL verifica se é possível usar um método de acesso `range` ou `index_merge` para recuperar as linhas. Isso não é muito rápido, mas é mais rápido do que realizar uma junção sem nenhum índice. Os critérios de aplicabilidade são descritos nas Seções 8.2.1.2, “Otimização de Faixa”, e 8.2.1.3, “Otimização de Fusão de Índices”, com a exceção de que todos os valores das colunas da tabela anterior são conhecidos e considerados constantes.

  Os índices são numerados a partir do número 1, na mesma ordem que é exibida pelo comando `SHOW INDEX` para a tabela. O valor do mapa do índice *`N`* é um valor de máscara de bits que indica quais índices são candidatos. Por exemplo, um valor de `0x19` (binário 11001) significa que os índices 1, 4 e 5 são considerados.

- `Bancos de dados digitalizados N` (propriedade JSON: `mensagem`)

  Isso indica quantas varreduras de diretório o servidor realiza ao processar uma consulta para as tabelas do `INFORMATION_SCHEMA`, conforme descrito na Seção 8.2.3, “Otimizando consultas do INFORMATION\_SCHEMA”. O valor de *`N`* pode ser 0, 1 ou `all`.

- `Selecionar tabelas otimizadas` (propriedade JSON: `message`)

  O otimizador determinou 1) que, no máximo, uma linha deve ser retornada e 2) que, para produzir essa linha, um conjunto determinístico de linhas deve ser lido. Quando as linhas a serem lidas podem ser lidas durante a fase de otimização (por exemplo, lendo linhas de índice), não há necessidade de ler nenhuma tabela durante a execução da consulta.

  A primeira condição é cumprida quando a consulta é agrupada implicitamente (contém uma função agregada, mas sem a cláusula `GROUP BY`). A segunda condição é cumprida quando uma consulta de busca por linha é realizada por índice usado. O número de índices lidos determina o número de linhas a serem lidas.

  Considere a seguinte consulta implicitamente agrupada:

  ```sql
  SELECT MIN(c1), MIN(c2) FROM t1;
  ```

  Suponha que `MIN(c1)` possa ser recuperado lendo uma única linha de índice e `MIN(c2)` possa ser recuperado lendo uma única linha de um índice diferente. Ou seja, para cada coluna `c1` e `c2`, existe um índice onde a coluna é a primeira coluna do índice. Nesse caso, uma única linha é devolvida, produzida pela leitura de duas linhas determinísticas.

  Esse valor `Extra` não ocorre se as linhas a serem lidas não forem determinísticas. Considere esta consulta:

  ```sql
  SELECT MIN(c2) FROM t1 WHERE c1 <= 10;
  ```

  Suponha que `(c1, c2)` seja um índice de cobertura. Usando esse índice, todas as linhas com `c1 <= 10` devem ser verificadas para encontrar o valor mínimo de `c2`. Por outro lado, considere esta consulta:

  ```sql
  SELECT MIN(c2) FROM t1 WHERE c1 = 10;
  ```

  Neste caso, a primeira linha do índice com `c1 = 10` contém o valor mínimo de `c2`. Apenas uma linha deve ser lida para produzir a linha de retorno.

  Para motores de armazenamento que mantêm um contagem exata de linhas por tabela (como `MyISAM`, mas não `InnoDB`), esse valor `Extra` pode ocorrer em consultas `COUNT(*)` para as quais a cláusula `WHERE` está ausente ou sempre verdadeira e não há cláusula `GROUP BY`. (Isso é um exemplo de uma consulta implicitamente agrupada, onde o motor de armazenamento influencia se um número determinado de linhas pode ser lido.)

- `Skip_open_table`, `Open_frm_only`, `Open_full_table` (propriedade JSON: `message`)

  Esses valores indicam otimizações de abertura de arquivos que se aplicam a consultas para tabelas do `INFORMATION_SCHEMA`, conforme descrito na Seção 8.2.3, “Otimizando consultas do INFORMATION\_SCHEMA”.

  - `Skip_open_table`: Os arquivos de tabela não precisam ser abertos. As informações já estão disponíveis na consulta ao analisar o diretório do banco de dados.

  - `Open_frm_only`: Apenas o arquivo `.frm` da tabela precisa ser aberto.

  - `Open_full_table`: Busca de informações não otimizada. Os arquivos `.frm`, `.MYD` e `.MYI` devem ser abertos.

- `Início temporário`, `Fim temporário` (propriedade JSON: `mensagem`)

  Isso indica o uso temporário da tabela para a estratégia de semijoin Duplicate Weedout.

- `linha única não encontrada` (propriedade JSON: `mensagem`)

  Para uma consulta como `SELECT ... FROM tbl_name`, nenhuma linha satisfaz a condição para um índice `UNIQUE` ou `PRIMARY KEY` na tabela.

- `Using filesort` (propriedade JSON: `using_filesort`)

  O MySQL deve fazer uma passagem extra para descobrir como recuperar as linhas em ordem classificada. A classificação é feita percorrendo todas as linhas de acordo com o tipo de junção e armazenando a chave de classificação e o ponteiro para a linha para todas as linhas que correspondem à cláusula `WHERE`. As chaves são então classificadas e as linhas são recuperadas em ordem classificada. Veja a Seção 8.2.1.14, “Otimização de ORDER BY”.

- `Usando índice` (propriedade JSON: `using_index`)

  As informações da coluna são recuperadas da tabela usando apenas as informações na árvore de índice, sem precisar fazer uma busca adicional para ler a linha real. Essa estratégia pode ser usada quando a consulta usa apenas colunas que fazem parte de um único índice.

  Para tabelas `InnoDB` que possuem um índice agrupado definido pelo usuário, esse índice pode ser usado mesmo quando a opção `Using index` está ausente na coluna `Extra`. Esse é o caso se `type` for `index` e `key` for `PRIMARY`.

- `Usando a condição de índice` (propriedade JSON: `using_index_condition`)

  As tabelas são lidas acessando tuplas de índice e testando-as primeiro para determinar se é necessário ler linhas inteiras da tabela. Dessa forma, as informações do índice são usadas para adiar (“empurrar para baixo”) a leitura de linhas inteiras da tabela, a menos que seja necessário. Veja a Seção 8.2.1.5, “Otimização de Empurrão de Condição de Índice”.

- `Usar índice para agrupamento` (propriedade JSON: `using_index_for_group_by`)

  Assim como o método de acesso à tabela `Usando índice`, `Usando índice para agrupamento` indica que o MySQL encontrou um índice que pode ser usado para recuperar todas as colunas de uma consulta `GROUP BY` ou `DISTINCT` sem qualquer acesso adicional ao disco à tabela real. Além disso, o índice é usado da maneira mais eficiente, de modo que, para cada grupo, apenas algumas entradas do índice são lidas. Para obter detalhes, consulte a Seção 8.2.1.15, “Otimização de GROUP BY”.

- `Usando o buffer de junção (Loop Aninhado Bloco)`, `Usando o buffer de junção (Acesso de Chave em Batelamento)` (Propriedade JSON: `using_join_buffer`)

  As tabelas de junções anteriores são lidas em porções no buffer de junção e, em seguida, suas linhas são usadas a partir do buffer para realizar a junção com a tabela atual. `(Loop Aninhado de Bloco)` indica o uso do algoritmo Loop Aninhado de Bloco e `(Acesso de Chave em Batelada)` indica o uso do algoritmo Acesso de Chave em Batelada. Ou seja, as chaves da tabela na linha anterior do resultado do `EXPLAIN` são armazenadas no buffer, e as linhas correspondentes são recuperadas em lotes da tabela representada pela linha na qual `Usando buffer de junção` aparece.

  Na saída formatada em JSON, o valor de `using_join_buffer` é sempre um dos seguintes: `Block Nested Loop` ou `Batched Key Access`.

  Para obter mais informações sobre esses algoritmos, consulte Algoritmo de Conclusão de Join de Nó Fechado e Conclusão de Join de Acesso a Chave em lote.

- `Usando MRR` (propriedade JSON: `message`)

  As tabelas são lidas usando a estratégia de otimização de leitura de Multi-Range. Veja a Seção 8.2.1.10, “Otimização de Leitura de Multi-Range”.

- `Usando sort_union(...)`, `Usando union(...)`, `Usando intersect(...)` (propriedade JSON: `message`)

  Esses indicam o algoritmo específico que mostra como as consultas de índice são unidas para o tipo de junção `index_merge`. Veja a Seção 8.2.1.3, “Otimização da Junção de Índices”.

- `Usando temporário` (propriedade JSON: `using_temporary_table`)

  Para resolver a consulta, o MySQL precisa criar uma tabela temporária para armazenar o resultado. Isso geralmente acontece se a consulta contiver cláusulas `GROUP BY` e `ORDER BY` que listam colunas de maneira diferente.

- `Usando onde` (propriedade JSON: `attached_condition`)

  Uma cláusula `WHERE` é usada para restringir quais linhas devem ser correspondidas à próxima tabela ou enviadas ao cliente. A menos que você tenha a intenção específica de recuperar ou examinar todas as linhas da tabela, pode haver algo errado em sua consulta se o valor `Extra` não for `Using where` e o tipo de junção da tabela for `ALL` ou `index`.

  A opção `Using where` não tem correspondência direta na saída formatada em JSON; a propriedade `attached_condition` contém qualquer condição `WHERE` usada.

- `Usando onde com condição pressionada` (propriedade JSON: `message`)

  Este item se aplica apenas às tabelas `NDB`. Isso significa que o NDB Cluster está usando a otimização de empurrar a condição para melhorar a eficiência de uma comparação direta entre uma coluna não indexada e uma constante. Nesse caso, a condição é "empurrada" para os nós de dados do cluster e é avaliada em todos os nós de dados simultaneamente. Isso elimina a necessidade de enviar linhas não correspondentes pela rede e pode acelerar essas consultas em um fator de 5 a 10 vezes em relação aos casos em que a otimização de empurrar a condição do motor poderia ser usada, mas não é. Para mais informações, consulte a Seção 8.2.1.4, "Otimização de Empurrar a Condição do Motor".

- `Limite zero` (propriedade JSON: `mensagem`)

  A consulta tinha uma cláusula `LIMIT 0` e não pode selecionar nenhuma linha.

#### EXPLAIN Saída de Interpretação

Você pode obter uma boa indicação de quão bom é um join tomando o produto dos valores na coluna `rows` do resultado do `EXPLAIN`. Isso deve lhe dizer aproximadamente quantos registros o MySQL deve examinar para executar a consulta. Se você restringir consultas com a variável de sistema `max_join_size`, esse produto de linhas também é usado para determinar quais instruções `SELECT` de múltiplas tabelas devem ser executadas e quais devem ser abortadas. Veja a Seção 5.1.1, “Configurando o Servidor”.

O exemplo a seguir mostra como uma junção de múltiplas tabelas pode ser otimizada progressivamente com base nas informações fornecidas pelo `EXPLAIN`.

Suponha que você tenha a instrução `SELECT` mostrada aqui e que planeje examiná-la usando `EXPLAIN`:

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

- As colunas que estão sendo comparadas foram declaradas da seguinte forma.

  <table summary="Nomes de tabelas, nomes de colunas e tipos de dados para as colunas que estão sendo comparadas no exemplo EXPLAIN descrito no texto anterior."><col style="width: 10%"/><col style="width: 25%"/><col style="width: 25%"/><thead><tr> <th>Tabela</th> <th>Coluna</th> <th>Tipo de dados</th> </tr></thead><tbody><tr> <th>[[PH_HTML_CODE_<code>EMPLOYID</code>]</th> <td>[[PH_HTML_CODE_<code>EMPLOYID</code>]</td> <td>[[PH_HTML_CODE_<code>do</code>]</td> </tr><tr> <th>[[PH_HTML_CODE_<code>CUSTNMBR</code>]</th> <td>[[PH_HTML_CODE_<code>CHAR(15)</code>]</td> <td>[[<code>CHAR(10)</code>]]</td> </tr><tr> <th>[[<code>tt</code>]]</th> <td>[[<code>ClientID</code>]]</td> <td>[[<code>CHAR(10)</code>]]</td> </tr><tr> <th>[[<code>et</code>]]</th> <td>[[<code>EMPLOYID</code>]]</td> <td>[[<code>ActualPC</code><code>EMPLOYID</code>]</td> </tr><tr> <th>[[<code>do</code>]]</th> <td>[[<code>CUSTNMBR</code>]]</td> <td>[[<code>CHAR(15)</code>]]</td> </tr></tbody></table>

- As tabelas têm os seguintes índices.

  <table summary="Índices para cada uma das tabelas que fazem parte do exemplo EXPLAIN descrito no texto anterior."><col style="width: 10%"/><col style="width: 40%"/><thead><tr> <th>Tabela</th> <th>Índice</th> </tr></thead><tbody><tr> <td>[[<code>tt</code>]]</td> <td>[[<code>ActualPC</code>]]</td> </tr><tr> <td>[[<code>tt</code>]]</td> <td>[[<code>AssignedPC</code>]]</td> </tr><tr> <td>[[<code>tt</code>]]</td> <td>[[<code>ClientID</code>]]</td> </tr><tr> <td>[[<code>et</code>]]</td> <td>[[<code>EMPLOYID</code>]] (chave primária)</td> </tr><tr> <td>[[<code>do</code>]]</td> <td>[[<code>CUSTNMBR</code>]] (chave primária)</td> </tr></tbody></table>

- Os valores de `tt.ActualPC` não estão distribuídos de forma uniforme.

Inicialmente, antes que qualquer otimização tenha sido realizada, a instrução `EXPLAIN` produz as seguintes informações:

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

Como `type` é `ALL` para cada tabela, essa saída indica que o MySQL está gerando um produto cartesiano de todas as tabelas; ou seja, cada combinação de linhas. Isso leva bastante tempo, porque o produto do número de linhas em cada tabela deve ser examinado. No caso em questão, esse produto é de 74 × 2135 × 74 × 3872 = 45.268.558.720 linhas. Se as tabelas fossem maiores, você só pode imaginar quanto tempo levaria.

Um problema aqui é que o MySQL pode usar índices em colunas de forma mais eficiente se eles forem declarados com o mesmo tipo e tamanho. Nesse contexto, `VARCHAR` e `CHAR` são considerados iguais se forem declarados com o mesmo tamanho. `tt.ActualPC` é declarado como `CHAR(10)` e `et.EMPLOYID` é `CHAR(15)`, então há uma incompatibilidade de comprimento.

Para corrigir essa disparidade entre os comprimentos das colunas, use `ALTER TABLE` para alongar `ActualPC` de 10 caracteres para 15 caracteres:

```sql
mysql> ALTER TABLE tt MODIFY ActualPC VARCHAR(15);
```

Agora, `tt.ActualPC` e `et.EMPLOYID` são ambos `VARCHAR(15)`. Executar novamente a instrução `EXPLAIN` produz este resultado:

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

Isso não é perfeito, mas é muito melhor: O produto dos valores de `rows` é menor em um fator de 74. Esta versão executa em alguns segundos.

Uma segunda alteração pode ser feita para eliminar as diferenças de comprimento da coluna para as comparações `tt.AssignedPC = et_1.EMPLOYID` e `tt.ClientID = do.CUSTNMBR`:

```sql
mysql> ALTER TABLE tt MODIFY AssignedPC VARCHAR(15),
                      MODIFY ClientID   VARCHAR(15);
```

Após essa modificação, o `EXPLAIN` produz a saída mostrada aqui:

```sql
table type   possible_keys key      key_len ref           rows Extra
et    ALL    PRIMARY       NULL     NULL    NULL          74
tt    ref    AssignedPC,   ActualPC 15      et.EMPLOYID   52   Using
             ClientID,                                         where
             ActualPC
et_1  eq_ref PRIMARY       PRIMARY  15      tt.AssignedPC 1
do    eq_ref PRIMARY       PRIMARY  15      tt.ClientID   1
```

Neste ponto, a consulta está otimizada quase da melhor maneira possível. O problema restante é que, por padrão, o MySQL assume que os valores na coluna `tt.ActualPC` estão distribuídos de forma uniforme, e isso não é o caso da tabela `tt`. Felizmente, é fácil dizer ao MySQL para analisar a distribuição da chave:

```sql
mysql> ANALYZE TABLE tt;
```

Com as informações adicionais do índice, a junção é perfeita e o `EXPLAIN` produz este resultado:

```sql
table type   possible_keys key     key_len ref           rows Extra
tt    ALL    AssignedPC    NULL    NULL    NULL          3872 Using
             ClientID,                                        where
             ActualPC
et    eq_ref PRIMARY       PRIMARY 15      tt.ActualPC   1
et_1  eq_ref PRIMARY       PRIMARY 15      tt.AssignedPC 1
do    eq_ref PRIMARY       PRIMARY 15      tt.ClientID   1
```

A coluna `rows` no resultado do `EXPLAIN` é uma estimativa baseada no otimizador de junção do MySQL. Verifique se os números estão próximos da verdade comparando o produto `rows` com o número real de linhas que a consulta retorna. Se os números forem bastante diferentes, você pode obter um melhor desempenho usando `STRAIGHT_JOIN` na sua instrução `SELECT` e tentando listar as tabelas em uma ordem diferente na cláusula `FROM`. (No entanto, `STRAIGHT_JOIN` pode impedir que índices sejam usados porque desabilita as transformações de junção parcial. Veja a Seção 8.2.2.1, “Otimizando subconsultas, tabelas derivadas e referências de visualizações com transformações de junção parcial”.)

Em alguns casos, é possível executar instruções que modificam dados quando o comando `EXPLAIN SELECT` é usado com uma subconsulta; para mais informações, consulte a Seção 13.2.10.8, “Tabelas Derivadas”.
