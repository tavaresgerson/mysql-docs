### 10.8.2 Formato de Saída Explicação

A declaração `EXPLAIN` fornece informações sobre como o MySQL executa as declarações. A declaração `EXPLAIN` funciona com as declarações `SELECT`, `DELETE`, `INSERT`, `REPLACE` e `UPDATE`.

`EXPLAIN` retorna uma linha de informações para cada tabela usada na declaração `SELECT`. Ela lista as tabelas na saída na ordem que o MySQL as lê enquanto processa a declaração. Isso significa que o MySQL lê uma linha da primeira tabela, depois encontra uma linha correspondente na segunda tabela, e depois na terceira tabela, e assim por diante. Quando todas as tabelas são processadas, o MySQL exibe as colunas selecionadas e retrocede pela lista de tabelas até encontrar uma tabela para a qual haja mais linhas correspondentes. A próxima linha é lida dessa tabela e o processo continua com a próxima tabela.

Nota

O MySQL Workbench possui uma funcionalidade de Visual Explain que fornece uma representação visual do resultado do `EXPLAIN`. Veja o Tutorial: Usando Explain para melhorar o desempenho da consulta.

- EXPLAIN Colunas de Saída
- EXPLIQUE Tipos de Conexão
- EXPLAIN Informações Adicionais
- EXPLAIN Saída de Interpretação

#### EXPLAIN Colunas de Saída

Esta seção descreve as colunas de saída produzidas pelo `EXPLAIN`. Seções posteriores fornecem informações adicionais sobre as colunas `type` e `Extra`.

Cada linha de saída de `EXPLAIN` fornece informações sobre uma tabela. Cada linha contém os valores resumidos na Tabela 10.1, “Colunas de Saída EXPLAIN”, e descritos com mais detalhes após a tabela. Os nomes das colunas são mostrados na primeira coluna da tabela; a segunda coluna fornece o nome do atributo equivalente mostrado na saída quando `FORMAT=JSON` é usado.

**Tabela 10.1 Colunas de Saída do Resultado EXPLAIN**

<table summary="Colunas de saída produzidas pelo comando EXPLAIN."><thead><tr> <th scope="col">Coluna</th> <th scope="col">Nome JSON</th> <th scope="col">Significado</th> </tr></thead><tbody><tr> <th>[[PH_HTML_CODE_<code>access_type</code>]</th> <td>[[PH_HTML_CODE_<code>access_type</code>]</td> <td>O identificador [[PH_HTML_CODE_<code>possible_keys</code>]</td> </tr><tr> <th>[[PH_HTML_CODE_<code>key</code>]</th> <td>Nenhum</td> <td>O tipo [[PH_HTML_CODE_<code>key</code>]</td> </tr><tr> <th>[[PH_HTML_CODE_<code>key_len</code>]</th> <td>[[PH_HTML_CODE_<code>key_length</code>]</td> <td>A tabela para a linha de saída</td> </tr><tr> <th>[[PH_HTML_CODE_<code>ref</code>]</th> <td>[[PH_HTML_CODE_<code>ref</code>]</td> <td>As divisórias correspondentes</td> </tr><tr> <th>[[PH_HTML_CODE_<code>rows</code>]</th> <td>[[<code>access_type</code>]]</td> <td>O tipo de conexão</td> </tr><tr> <th>[[<code>select_id</code><code>access_type</code>]</th> <td>[[<code>possible_keys</code>]]</td> <td>Os possíveis índices para escolher</td> </tr><tr> <th>[[<code>key</code>]]</th> <td>[[<code>key</code>]]</td> <td>O índice escolhido na verdade</td> </tr><tr> <th>[[<code>key_len</code>]]</th> <td>[[<code>key_length</code>]]</td> <td>O comprimento da chave escolhida</td> </tr><tr> <th>[[<code>ref</code>]]</th> <td>[[<code>ref</code>]]</td> <td>As colunas em comparação com o índice</td> </tr><tr> <th>[[<code>rows</code>]]</th> <td>[[<code>SELECT</code><code>access_type</code>]</td> <td>Estimativa de linhas a serem examinadas</td> </tr><tr> <th>[[<code>SELECT</code><code>access_type</code>]</th> <td>[[<code>SELECT</code><code>possible_keys</code>]</td> <td>Porcentagem de linhas filtradas por condição da tabela</td> </tr><tr> <th>[[<code>SELECT</code><code>key</code>]</th> <td>Nenhum</td> <td>Informações adicionais</td> </tr></tbody></table>

Nota

As propriedades do JSON que são `NULL` não são exibidas na saída formatada em JSON `EXPLAIN`.

- `id` (nome JSON: `select_id`)

  O identificador `SELECT`. Este é o número sequencial do `SELECT` dentro da consulta. O valor pode ser `NULL` se a linha se referir ao resultado da união de outras linhas. Neste caso, a coluna `table` exibe um valor como `<unionM,N>` para indicar que a linha se refere à união das linhas com os valores de `id` de `M` e `N`.

- `select_type` (nome JSON: nenhum)

  O tipo de `SELECT`, que pode ser qualquer um dos mostrados na tabela a seguir. Um `EXPLAIN` formatado em JSON expõe o tipo `SELECT` como uma propriedade de um `query_block`, a menos que seja `SIMPLE` ou `PRIMARY`. Os nomes do JSON (quando aplicável) também estão mostrados na tabela.

  <table summary="valores de select_type e o significado de cada valor."><thead><tr> <th scope="col">[[PH_HTML_CODE_<code>dependent</code>] Valor</th> <th scope="col">Nome JSON</th> <th scope="col">Significado</th> </tr></thead><tbody><tr> <th>[[PH_HTML_CODE_<code>dependent</code>]</th> <td>Nenhum</td> <td>Simples [[PH_HTML_CODE_<code>SELECT</code>] (não usando [[PH_HTML_CODE_<code>UNION</code>] ou subconsultas)</td> </tr><tr> <th>[[PH_HTML_CODE_<code>UNION RESULT</code>]</th> <td>Nenhum</td> <td>Extremo [[PH_HTML_CODE_<code>union_result</code>]</td> </tr><tr> <th>[[PH_HTML_CODE_<code>UNION</code>]</th> <td>Nenhum</td> <td>Segunda ou posterior declaração [[PH_HTML_CODE_<code>SUBQUERY</code>] em uma declaração [[PH_HTML_CODE_<code>SELECT</code>]</td> </tr><tr> <th>[[PH_HTML_CODE_<code>DEPENDENT SUBQUERY</code>]</th> <td>[[<code>dependent</code>]] ([[<code>SIMPLE</code><code>dependent</code>])</td> <td>Segunda ou posterior declaração [[<code>SELECT</code>]] em uma [[<code>UNION</code>]], dependente da consulta externa</td> </tr><tr> <th>[[<code>UNION RESULT</code>]]</th> <td>[[<code>union_result</code>]]</td> <td>Resultado de um [[<code>UNION</code>]].</td> </tr><tr> <th>[[<code>SUBQUERY</code>]]</th> <td>Nenhum</td> <td>Primeiro [[<code>SELECT</code>]] na subconsulta</td> </tr><tr> <th>[[<code>DEPENDENT SUBQUERY</code>]]</th> <td>[[<code>SELECT</code><code>dependent</code>] ([[<code>SELECT</code><code>dependent</code>])</td> <td>Primeiro [[<code>SELECT</code><code>SELECT</code>] na subconsulta, dependente da consulta externa</td> </tr><tr> <th>[[<code>SELECT</code><code>UNION</code>]</th> <td>Nenhum</td> <td>Tabela derivada</td> </tr><tr> <th>[[<code>SELECT</code><code>UNION RESULT</code>]</th> <td>[[<code>SELECT</code><code>union_result</code>] ([[<code>SELECT</code><code>UNION</code>])</td> <td>Tabela derivada dependente de outra tabela</td> </tr><tr> <th>[[<code>SELECT</code><code>SUBQUERY</code>]</th> <td>[[<code>SELECT</code><code>SELECT</code>]</td> <td>Subconsulta materializada</td> </tr><tr> <th>[[<code>SELECT</code><code>DEPENDENT SUBQUERY</code>]</th> <td>[[<code>UNION</code><code>dependent</code>] ([[<code>UNION</code><code>dependent</code>])</td> <td>Uma subconsulta para a qual o resultado não pode ser armazenado em cache e deve ser reavaliado para cada linha da consulta externa</td> </tr><tr> <th>[[<code>UNION</code><code>SELECT</code>]</th> <td>[[<code>UNION</code><code>UNION</code>] ([[<code>UNION</code><code>UNION RESULT</code>])</td> <td>A segunda ou a subsequente seleção em um [[<code>UNION</code><code>union_result</code>] que pertence a uma subconsulta não cacheável (veja [[<code>UNION</code><code>UNION</code>])</td> </tr></tbody></table>

  `DEPENDENT` geralmente indica o uso de uma subconsulta correlacionada. Veja a Seção 15.2.15.7, “Subconsultas Correlacionadas”.

  A avaliação de `DEPENDENT SUBQUERY` difere da avaliação de `UNCACHEABLE SUBQUERY`. Para `DEPENDENT SUBQUERY`, a subconsulta é reavaliada apenas uma vez para cada conjunto de valores diferentes das variáveis do seu contexto externo. Para `UNCACHEABLE SUBQUERY`, a subconsulta é reavaliada para cada linha do contexto externo.

  Quando você especifica `FORMAT=JSON` com `EXPLAIN`, a saída não tem uma única propriedade diretamente equivalente a `select_type`; a propriedade `query_block` corresponde a um dado `SELECT`. As propriedades equivalentes à maioria dos tipos de subconsultas `SELECT` mostrados anteriormente estão disponíveis (um exemplo é `materialized_from_subquery` para `MATERIALIZED`), e são exibidas quando apropriado. Não há equivalentes JSON para `SIMPLE` ou `PRIMARY`.

  O valor `select_type` para declarações que não são `SELECT` exibe o tipo de declaração para as tabelas afetadas. Por exemplo, `select_type` é `DELETE` para declarações `DELETE`.

- `table` (nome JSON: `table_name`)

  O nome da tabela a qual a linha de saída se refere. Isso também pode ser um dos seguintes valores:

  - `<unionM,N>`: A linha se refere à união das linhas com os valores de `id` de `M` e `N`.

  - `<derivedN>`: A linha refere-se ao resultado da tabela derivada para a linha com um valor de `id` de `N`. Uma tabela derivada pode resultar, por exemplo, de uma subconsulta na cláusula `FROM`.

  - `<subqueryN>`: A linha refere-se ao resultado de uma subconsulta materializada para a linha com um valor de `id` de `N`. Veja a Seção 10.2.2.2, “Otimizando Subconsultas com Materialização”.

- `partitions` (nome JSON: `partitions`)

  As partições nas quais os registros seriam correspondidos pela consulta. O valor é `NULL` para tabelas não particionadas. Veja a Seção 26.3.5, “Obtendo Informações Sobre Partições”.

- `type` (nome JSON: `access_type`)

  O tipo de conexão. Para descrições dos diferentes tipos, consulte `EXPLAIN` Tipos de Conexão.

- `possible_keys` (nome JSON: `possible_keys`)

  A coluna `possible_keys` indica os índices a partir dos quais o MySQL pode escolher para encontrar as linhas nesta tabela. Observe que essa coluna é totalmente independente da ordem das tabelas conforme exibida na saída de `EXPLAIN`. Isso significa que algumas das chaves em `possible_keys` podem não ser utilizáveis na prática com a ordem da tabela gerada.

  Se esta coluna for `NULL` (ou indefinida na saída formatada em JSON), não há índices relevantes. Nesse caso, você pode melhorar o desempenho da sua consulta examinando a cláusula `WHERE` para verificar se ela se refere a alguma coluna ou colunas que seriam adequadas para indexação. Se for o caso, crie um índice apropriado e verifique a consulta com `EXPLAIN` novamente. Veja a Seção 15.1.9, “Instrução ALTER TABLE”.

  Para ver quais índices uma tabela tem, use `SHOW INDEX FROM tbl_name`.

- `key` (nome JSON: `key`)

  A coluna `key` indica a chave (índice) que o MySQL realmente decidiu usar. Se o MySQL decidir usar um dos índices `possible_keys` para procurar linhas, esse índice é listado como o valor da chave.

  É possível que `key` possa nomear um índice que não está presente no valor `possible_keys`. Isso pode acontecer se nenhum dos índices `possible_keys` for adequado para pesquisar linhas, mas todas as colunas selecionadas pela consulta são colunas de algum outro índice. Ou seja, o índice nomeado cobre as colunas selecionadas, então, embora não seja usado para determinar quais linhas devem ser recuperadas, uma varredura de índice é mais eficiente do que uma varredura de linha de dados.

  Para `InnoDB`, um índice secundário pode cobrir as colunas selecionadas, mesmo que a consulta também selecione a chave primária, porque `InnoDB` armazena o valor da chave primária com cada índice secundário. Se `key` for `NULL`, o MySQL não encontrou nenhum índice para usar para executar a consulta de forma mais eficiente.

  Para forçar o MySQL a usar ou ignorar um índice listado na coluna `possible_keys`, use `FORCE INDEX`, `USE INDEX` ou `IGNORE INDEX` em sua consulta. Veja a Seção 10.9.4, “Dicas de índice”.

  Para as tabelas `MyISAM`, executar `ANALYZE TABLE` ajuda o otimizador a escolher índices melhores. Para as tabelas `MyISAM`, o comando **myisamchk --analyze** faz o mesmo. Veja a Seção 15.7.3.1, “Instrução ANALYZE TABLE”, e a Seção 9.6, “Manutenção e Recuperação após Falha da Tabela MyISAM”.

- `key_len` (nome JSON: `key_length`)

  A coluna `key_len` indica a extensão da chave que o MySQL decidiu usar. O valor da coluna `key_len` permite determinar quantas partes de uma chave de múltiplas partes o MySQL realmente usa. Se a coluna `key` disser `NULL`, a coluna `key_len` também dirá `NULL`.

  Devido ao formato de armazenamento de chaves, o comprimento da chave é um maior para uma coluna que pode ser `NULL` do que para uma coluna `NOT NULL`.

- `ref` (nome JSON: `ref`)

  A coluna `ref` mostra quais colunas ou constantes são comparadas ao índice nomeado na coluna `key` para selecionar linhas da tabela.

  Se o valor for `func`, o valor utilizado é o resultado de alguma função. Para ver qual função, use `SHOW WARNINGS` após `EXPLAIN` para ver o resultado `EXPLAIN` ampliado. A função pode ser, na verdade, um operador, como um operador aritmético.

- `rows` (nome JSON: `rows`)

  A coluna `rows` indica o número de linhas que o MySQL acredita que deve examinar para executar a consulta.

  Para as tabelas `InnoDB`, esse número é uma estimativa e nem sempre será exato.

- `filtered` (nome JSON: `filtered`)

  A coluna `filtered` indica uma porcentagem estimada de linhas da tabela que são filtradas pela condição da tabela. O valor máximo é 100, o que significa que não houve filtragem de linhas. Valores que diminuem de 100 indicam quantidades crescentes de filtragem. `rows` mostra o número estimado de linhas examinadas e `rows` × `filtered` mostra o número de linhas que são unidas com a tabela seguinte. Por exemplo, se `rows` for 1000 e `filtered` for 50,00 (50%), o número de linhas a serem unidas com a tabela seguinte é 1000 × 50% = 500.

- `Extra` (nome JSON: nenhum)

  Esta coluna contém informações adicionais sobre como o MySQL resolve a consulta. Para descrições dos diferentes valores, consulte `EXPLAIN` Informações Adicionais.

  Não há uma única propriedade JSON correspondente à coluna `Extra`; no entanto, os valores que podem ocorrer nesta coluna são exibidos como propriedades JSON ou como o texto da propriedade `message`.

#### EXPLIQUE Tipos de Conexão

A coluna `type` do resultado de `EXPLAIN` descreve como as tabelas são unidas. No resultado formatado em JSON, esses valores são encontrados como propriedades do `access_type`. A lista a seguir descreve os tipos de junção, ordenados do melhor tipo para o pior:

- `system`

  A tabela tem apenas uma linha (= tabela de sistema). Este é um caso especial do tipo de junção `const`.

- `const`

  A tabela tem, no máximo, uma linha correspondente, que é lida no início da consulta. Como há apenas uma linha, os valores da coluna dessa linha podem ser considerados constantes pelo resto do otimizador. As tabelas `const` são muito rápidas porque são lidas apenas uma vez.

  `const` é usado quando você compara todas as partes de um índice `PRIMARY KEY` ou `UNIQUE` com valores constantes. Nas seguintes consultas, `tbl_name` pode ser usado como uma tabela `const`:

  ```
  SELECT * FROM tbl_name WHERE primary_key=1;

  SELECT * FROM tbl_name
    WHERE primary_key_part1=1 AND primary_key_part2=2;
  ```

- `eq_ref`

  Uma linha é lida desta tabela para cada combinação de linhas das tabelas anteriores. Exceto para os tipos `system` e `const`, este é o melhor tipo de junção possível. Ele é usado quando todas as partes de um índice são usadas pelo join e o índice é um índice `PRIMARY KEY` ou `UNIQUE NOT NULL`.

  `eq_ref` pode ser usado para colunas indexadas que são comparadas usando o operador `=`. O valor de comparação pode ser uma constante ou uma expressão que usa colunas de tabelas que são lidas antes desta tabela. Nos exemplos seguintes, o MySQL pode usar uma junção `eq_ref` para processar `ref_table`:

  ```
  SELECT * FROM ref_table,other_table
    WHERE ref_table.key_column=other_table.column;

  SELECT * FROM ref_table,other_table
    WHERE ref_table.key_column_part1=other_table.column
    AND ref_table.key_column_part2=1;
  ```

- `ref`

  Todas as linhas com valores de índice correspondentes são lidas desta tabela para cada combinação de linhas das tabelas anteriores. `ref` é usado se a junção usar apenas um prefixo da esquerda da chave ou se a chave não for um índice `PRIMARY KEY` ou `UNIQUE` (ou seja, se a junção não puder selecionar uma única linha com base no valor da chave). Se a chave usada corresponder a apenas algumas linhas, este é um bom tipo de junção.

  `ref` pode ser usado para colunas indexadas que são comparadas usando o operador `=` ou `<=>`. Nos exemplos a seguir, o MySQL pode usar uma junção `ref` para processar `ref_table`:

  ```
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

  Este tipo de junção é semelhante ao `ref`, mas com a adição de que o MySQL faz uma busca adicional por linhas que contêm valores de `NULL`. Essa otimização do tipo de junção é usada com mais frequência para resolver subconsultas. Nos exemplos a seguir, o MySQL pode usar uma junção `ref_or_null` para processar `ref_table`:

  ```
  SELECT * FROM ref_table
    WHERE key_column=expr OR key_column IS NULL;
  ```

  Consulte a Seção 10.2.1.15, “Otimização IS NULL”.

- `index_merge`

  Este tipo de junção indica que a otimização de junção de índices foi usada. Neste caso, a coluna `key` na linha de saída contém uma lista de índices usados, e `key_len` contém uma lista das partes de chave mais longas para os índices usados. Para mais informações, consulte a Seção 10.2.1.3, “Otimização de Junção de Índices”.

- `unique_subquery`

  Esse tipo substitui `eq_ref` por algumas subconsultas `IN` do seguinte formato:

  ```
  value IN (SELECT primary_key FROM single_table WHERE some_expr)
  ```

  `unique_subquery` é apenas uma função de busca de índice que substitui completamente a subconsulta para maior eficiência.

- `index_subquery`

  Este tipo de junção é semelhante ao `unique_subquery`. Ele substitui as subconsultas `IN`, mas funciona para índices não únicos em subconsultas da seguinte forma:

  ```
  value IN (SELECT key_column FROM single_table WHERE some_expr)
  ```

- `range`

  Apenas as linhas que estão em um determinado intervalo são recuperadas, usando um índice para selecionar as linhas. A coluna `key` na linha de saída indica qual índice é usado. A coluna `key_len` contém a parte da chave mais longa que foi usada. A coluna `ref` é `NULL` para este tipo.

  `range` pode ser usado quando uma coluna chave é comparada a uma constante usando qualquer um dos operadores `=`, `<>`, `>`, `>=`, `<`, `<=`, `IS NULL`, `<=>`, `BETWEEN`, `LIKE` ou `IN()`:

  ```
  SELECT * FROM tbl_name
    WHERE key_column = 10;

  SELECT * FROM tbl_name
    WHERE key_column BETWEEN 10 and 20;

  SELECT * FROM tbl_name
    WHERE key_column IN (10,20,30);

  SELECT * FROM tbl_name
    WHERE key_part1 = 10 AND key_part2 IN (10,20,30);
  ```

- `index`

  O tipo de junção `index` é o mesmo que `ALL`, exceto que a árvore de índice é percorrida. Isso ocorre de duas maneiras:

  - Se o índice for um índice de cobertura para as consultas e puder ser usado para satisfazer todos os dados necessários da tabela, apenas a árvore do índice é percorrida. Nesse caso, a coluna `Extra` diz `Using index`. Um varredura apenas com índice geralmente é mais rápida que `ALL` porque o tamanho do índice geralmente é menor que os dados da tabela.

  - Um varredura completa da tabela é realizada usando leituras do índice para procurar linhas de dados na ordem do índice. `Uses index` não aparece na coluna `Extra`.

  O MySQL pode usar esse tipo de junção quando a consulta usa apenas colunas que fazem parte de um único índice.

- `ALL`

  Um varredura completa da tabela é realizada para cada combinação de linhas das tabelas anteriores. Isso normalmente não é bom se a tabela for a primeira tabela não marcada `const`, e geralmente é *muito* ruim em todos os outros casos. Normalmente, você pode evitar `ALL` adicionando índices que permitem a recuperação de linhas da tabela com base em valores constantes ou valores de coluna de tabelas anteriores.

#### EXPLAIN Informações Adicionais

A coluna `Extra` do `EXPLAIN` de saída contém informações adicionais sobre como o MySQL resolve a consulta. A lista a seguir explica os valores que podem aparecer nesta coluna. Cada item também indica para a saída formatada em JSON qual propriedade exibe o valor `Extra`. Para alguns desses, há uma propriedade específica. Os outros são exibidos como o texto da propriedade `message`.

Se você deseja fazer suas consultas o mais rápido possível, fique atento aos valores da coluna `Extra` dos registros `Using filesort` e `Using temporary`, ou, na saída formatada em JSON `EXPLAIN`, às propriedades `using_filesort` e `using_temporary_table` iguais a `true`.

- `Backward index scan` (JSON: `backward_index_scan`)

  O otimizador pode usar um índice descendente em uma tabela `InnoDB`. Mostrado junto com `Using index`. Para mais informações, consulte a Seção 10.3.13, “Índices Descendentes”.

- `Child of 'table' pushed join@1` (JSON: `message` texto)

  Essa tabela é referenciada como a filha de `table` em uma junção que pode ser empurrada para o kernel do NDB. Aplica-se apenas no NDB Cluster, quando as junções empurradas estão habilitadas. Consulte a descrição da variável de sistema do servidor `ndb_join_pushdown` para obter mais informações e exemplos.

- `const row not found` (propriedade JSON: `const_row_not_found`)

  Para uma consulta como `SELECT ... FROM tbl_name`, a tabela estava vazia.

- `Deleting all rows` (propriedade JSON: `message`)

  Para `DELETE`, alguns motores de armazenamento (como `MyISAM`) suportam um método de manipulador que remove todas as linhas da tabela de maneira simples e rápida. Este valor `Extra` é exibido se o motor usar essa otimização.

- `Distinct` (propriedade JSON: `distinct`)

  O MySQL procura por valores distintos, então ele para de procurar mais linhas para a combinação de linha atual após encontrar a primeira linha correspondente.

- `FirstMatch(tbl_name)` (propriedade JSON: `first_match`)

  A estratégia de encurtamento de junção FirstMatch semijoin é usada para `tbl_name`.

- `Full scan on NULL key` (propriedade JSON: `message`)

  Isso ocorre para a otimização de subconsultas como uma estratégia de fallback quando o otimizador não pode usar um método de acesso de consulta por índice.

- `Impossible HAVING` (propriedade JSON: `message`)

  A cláusula `HAVING` é sempre falsa e não pode selecionar nenhuma linha.

- `Impossible WHERE` (propriedade JSON: `message`)

  A cláusula `WHERE` é sempre falsa e não pode selecionar nenhuma linha.

- `Impossible WHERE noticed after reading const tables` (propriedade JSON: `message`)

  O MySQL leu todas as tabelas `const` (e `system`) e percebeu que a cláusula `WHERE` sempre é falsa.

- `LooseScan(m..n)` (propriedade JSON: `message`)

  A estratégia semijoin LooseScan é utilizada. `m` e `n` são números de peça-chave.

- `No matching min/max row` (propriedade JSON: `message`)

  Nenhuma linha satisfaz a condição para uma consulta como `SELECT MIN(...) FROM ... WHERE condition`.

- `no matching row in const table` (propriedade JSON: `message`)

  Para uma consulta com uma junção, havia uma tabela vazia ou uma tabela sem linhas que satisfaçam uma condição de índice único.

- `No matching rows after partition pruning` (propriedade JSON: `message`)

  Para `DELETE` ou `UPDATE`, o otimizador não encontrou nada a ser excluído ou atualizado após a poda de partição. Isso é semelhante ao significado de `Impossible WHERE` para as instruções `SELECT`.

- `No tables used` (propriedade JSON: `message`)

  A consulta não tem a cláusula `FROM` ou tem a cláusula `FROM DUAL`.

  Para as declarações `INSERT` ou `REPLACE`, `EXPLAIN` exibe esse valor quando não há uma parte `SELECT`. Por exemplo, ele aparece para `EXPLAIN INSERT INTO t VALUES(10)`, pois é equivalente a `EXPLAIN INSERT INTO t SELECT 10 FROM DUAL`.

- `Not exists` (propriedade JSON: `message`)

  O MySQL conseguiu otimizar a consulta com `LEFT JOIN` e não examina mais linhas nesta tabela para a combinação de linha anterior após encontrar uma linha que atenda aos critérios `LEFT JOIN`. Aqui está um exemplo do tipo de consulta que pode ser otimizada dessa maneira:

  ```
  SELECT * FROM t1 LEFT JOIN t2 ON t1.id=t2.id
    WHERE t2.id IS NULL;
  ```

  Suponha que `t2.id` seja definido como `NOT NULL`. Nesse caso, o MySQL examina `t1` e busca as linhas em `t2` usando os valores de `t1.id`. Se o MySQL encontrar uma linha correspondente em `t2`, ele sabe que `t2.id` nunca pode ser `NULL`, e não examina o resto das linhas em `t2` que têm o mesmo valor de `id`. Em outras palavras, para cada linha em `t1`, o MySQL precisa fazer apenas uma única pesquisa em `t2`, independentemente de quantas linhas realmente corresponderem em `t2`.

  No MySQL 8.0.17 e versões posteriores, isso também pode indicar que uma condição `WHERE` do tipo `NOT IN (subquery)` ou `NOT EXISTS (subquery)` foi transformada internamente em um antijoin. Isso remove a subconsulta e inclui suas tabelas no plano da consulta mais alta, proporcionando um planejamento de custo melhorado. Ao combinar semijoins e antijoins, o otimizador pode reorganizar as tabelas no plano de execução de forma mais livre, resultando, em alguns casos, em um plano mais rápido.

  Você pode ver quando uma transformação antijoin é realizada para uma consulta específica verificando a coluna `Message` de `SHOW WARNINGS` após a execução de `EXPLAIN`, ou no resultado de `EXPLAIN FORMAT=TREE`.

  Nota

  Um antijoin é o complemento de um semijoin `table_a JOIN table_b ON condition`. O antijoin retorna todas as linhas de `table_a` para as quais não há *nenhuma* linha em `table_b` que corresponda a `condition`.

- `Plan isn't ready yet` (propriedade JSON: nenhuma)

  Esse valor ocorre com `EXPLAIN FOR CONNECTION` quando o otimizador ainda não terminou de criar o plano de execução para a instrução que está sendo executada na conexão nomeada. Se o resultado do plano de execução contiver várias linhas, qualquer uma delas ou todas elas podem ter esse valor `Extra`, dependendo do progresso do otimizador na determinação do plano de execução completo.

- `Range checked for each record (index map: N)` (propriedade JSON: `message`)

  O MySQL não encontrou um bom índice para usar, mas descobriu que alguns índices podem ser usados depois que os valores das colunas das tabelas anteriores forem conhecidos. Para cada combinação de linha nas tabelas anteriores, o MySQL verifica se é possível usar um método de acesso `range` ou `index_merge` para recuperar as linhas. Isso não é muito rápido, mas é mais rápido do que realizar uma junção sem nenhum índice. Os critérios de aplicabilidade são descritos nas Seções 10.2.1.2, “Otimização de Faixa”, e 10.2.1.3, “Otimização de Fusão de Índices”, com a exceção de que todos os valores das colunas da tabela anterior são conhecidos e considerados constantes.

  Os índices são numerados a partir do número 1, na mesma ordem que é mostrado pelo `SHOW INDEX` para a tabela. O valor do mapa de índice `N` é um valor de máscara de bits que indica quais índices são candidatos. Por exemplo, um valor de `0x19` (binário 11001) significa que os índices 1, 4 e 5 são considerados.

- `Recursive` (propriedade JSON: `recursive`)

  Isso indica que a linha se aplica à parte recursiva `SELECT` de uma expressão de tabela comum recursiva. Veja a Seção 15.2.20, “Com (Expressões de Tabela Comum)”.

- `Rematerialize` (propriedade JSON: `rematerialize`)

  `Rematerialize (X,...)` é exibido na linha `EXPLAIN` para a tabela `T`, onde `X` é qualquer tabela derivada lateral cuja rematerialização é acionada quando uma nova linha de `T` é lida. Por exemplo:

  ```
  SELECT
    ...
  FROM
    t,
    LATERAL (derived table that refers to t) AS dt
  ...
  ```

  O conteúdo da tabela derivada é rematerializado para atualizá-lo a cada vez que uma nova linha do `t` é processada pela consulta principal.

- `Scanned N databases` (propriedade JSON: `message`)

  Isso indica quantas varreduras de diretório o servidor realiza ao processar uma consulta para as tabelas `INFORMATION_SCHEMA`, conforme descrito na Seção 10.2.3, “Otimizando consultas do INFORMATION\_SCHEMA”. O valor de `N` pode ser 0, 1 ou `all`.

- `Select tables optimized away` (propriedade JSON: `message`)

  O otimizador determinou 1) que, no máximo, uma linha deve ser retornada e 2) que, para produzir essa linha, um conjunto determinístico de linhas deve ser lido. Quando as linhas a serem lidas podem ser lidas durante a fase de otimização (por exemplo, lendo linhas de índice), não há necessidade de ler nenhuma tabela durante a execução da consulta.

  A primeira condição é cumprida quando a consulta é agrupada implicitamente (contém uma função agregada, mas nenhuma cláusula `GROUP BY`). A segunda condição é cumprida quando uma pesquisa por linha é realizada por índice usado. O número de índices lidos determina o número de linhas a serem lidas.

  Considere a seguinte consulta implicitamente agrupada:

  ```
  SELECT MIN(c1), MIN(c2) FROM t1;
  ```

  Suponha que `MIN(c1)` possa ser recuperado lendo uma única linha de índice e `MIN(c2)` pode ser recuperado lendo uma única linha de um índice diferente. Ou seja, para cada coluna `c1` e `c2`, existe um índice onde a coluna é a primeira coluna do índice. Nesse caso, uma única linha é devolvida, produzida pela leitura de duas linhas determinísticas.

  Este valor `Extra` não ocorre se as linhas a serem lidas não forem determinísticas. Considere esta consulta:

  ```
  SELECT MIN(c2) FROM t1 WHERE c1 <= 10;
  ```

  Suponha que `(c1, c2)` seja um índice de cobertura. Usando esse índice, todas as linhas com `c1 <= 10` devem ser verificadas para encontrar o valor mínimo de `c2`. Por outro lado, considere esta consulta:

  ```
  SELECT MIN(c2) FROM t1 WHERE c1 = 10;
  ```

  Neste caso, a primeira linha do índice com `c1 = 10` contém o valor mínimo de `c2`. Apenas uma linha deve ser lida para produzir a linha de retorno.

  Para motores de armazenamento que mantêm um contagem exata de linhas por tabela (como `MyISAM`, mas não `InnoDB`), este valor `Extra` pode ocorrer para consultas `COUNT(*)` para as quais a cláusula `WHERE` está ausente ou sempre verdadeira e não há nenhuma cláusula `GROUP BY`. (Esta é uma instância de uma consulta agrupada implicitamente, onde o motor de armazenamento influencia se um número determinado de linhas pode ser lido.)

- `Skip_open_table`, `Open_frm_only`, `Open_full_table` (propriedade JSON: `message`)

  Esses valores indicam otimizações de abertura de arquivos que se aplicam a consultas para tabelas `INFORMATION_SCHEMA`.

  - `Skip_open_table`: Não é necessário abrir arquivos de tabela. As informações já estão disponíveis no dicionário de dados.

  - `Open_frm_only`: Somente o dicionário de dados precisa ser lido para obter informações sobre a tabela.

  - `Open_full_table`: Busca de informações não otimizada. As informações da tabela devem ser lidas do dicionário de dados e a partir dos arquivos da tabela.

- `Start temporary`, `End temporary` (propriedade JSON: `message`)

  Isso indica o uso temporário da tabela para a estratégia de semijoin Duplicate Weedout.

- `unique row not found` (propriedade JSON: `message`)

  Para uma consulta como `SELECT ... FROM tbl_name`, nenhuma linha satisfaz a condição para um índice `UNIQUE` ou `PRIMARY KEY` na tabela.

- `Using filesort` (propriedade JSON: `using_filesort`)

  O MySQL deve fazer uma passagem extra para descobrir como recuperar as linhas em ordem classificada. A classificação é feita percorrendo todas as linhas de acordo com o tipo de junção e armazenando a chave de classificação e o ponteiro para a linha para todas as linhas que correspondem à cláusula `WHERE`. As chaves são então classificadas e as linhas são recuperadas em ordem classificada. Veja a Seção 10.2.1.16, “Otimização de ORDER BY”.

- `Using index` (propriedade JSON: `using_index`)

  As informações da coluna são recuperadas da tabela usando apenas as informações na árvore de índice, sem precisar fazer uma busca adicional para ler a linha real. Essa estratégia pode ser usada quando a consulta usa apenas colunas que fazem parte de um único índice.

  Para tabelas `InnoDB` que possuem um índice agrupado definido pelo usuário, esse índice pode ser usado mesmo quando `Using index` está ausente da coluna `Extra`. Esse é o caso se `type` for `index` e `key` for `PRIMARY`.

  As informações sobre quaisquer índices de cobertura usados são exibidas para `EXPLAIN FORMAT=TRADITIONAL` e `EXPLAIN FORMAT=JSON`. A partir do MySQL 8.0.27, também são exibidas para `EXPLAIN FORMAT=TREE`.

- `Using index condition` (propriedade JSON: `using_index_condition`)

  As tabelas são lidas acessando tuplas de índice e testando-as primeiro para determinar se é necessário ler linhas inteiras da tabela. Dessa forma, as informações do índice são usadas para adiar (“empurrar para baixo”) a leitura de linhas inteiras da tabela, a menos que seja necessário. Veja a Seção 10.2.1.6, “Otimização de Empurrão de Condição de Índice”.

- `Using index for group-by` (propriedade JSON: `using_index_for_group_by`)

  Assim como o método de acesso à tabela `Using index`, `Using index for group-by` indica que o MySQL encontrou um índice que pode ser usado para recuperar todas as colunas de uma consulta `GROUP BY` ou `DISTINCT` sem qualquer acesso adicional ao disco à tabela real. Além disso, o índice é usado da maneira mais eficiente, de modo que, para cada grupo, apenas algumas entradas do índice são lidas. Para obter detalhes, consulte a Seção 10.2.1.17, “Otimização de GROUP BY”.

- `Using index for skip scan` (propriedade JSON: `using_index_for_skip_scan`)

  Indica que o método de acesso de varredura pular é usado. Veja o método de acesso de varredura pular.

- `Using join buffer (Block Nested Loop)`, `Using join buffer (Batched Key Access)`, `Using join buffer (hash join)` (propriedade JSON: `using_join_buffer`)

  As tabelas de junções anteriores são lidas em porções no buffer de junção e, em seguida, suas linhas são usadas a partir do buffer para realizar a junção com a tabela atual. `(Block Nested Loop)` indica o uso do algoritmo de Bloco de Loop Aninhado, `(Batched Key Access)` indica o uso do algoritmo de Acesso por Chave em Bateladas e `(hash join)` indica o uso de uma junção hash. Ou seja, as chaves da tabela na linha anterior da saída `EXPLAIN` são armazenadas no buffer, e as linhas correspondentes são recuperadas em lotes da tabela representada pela linha na qual `Using join buffer` aparece.

  Na saída formatada em JSON, o valor de `using_join_buffer` é sempre um dos valores `Block Nested Loop`, `Batched Key Access` ou `hash join`.

  As junções hash estão disponíveis a partir do MySQL 8.0.18; o algoritmo Block Nested-Loop não é usado no MySQL 8.0.20 ou em versões posteriores do MySQL. Para obter mais informações sobre essas otimizações, consulte a Seção 10.2.1.4, “Otimização de Junção Hash” e o Algoritmo de Junção Block Nested-Loop.

  Consulte Conexões de Acesso de Chave em lote, para obter informações sobre o algoritmo de Acesso de Chave em lote.

- `Using MRR` (propriedade JSON: `message`)

  As tabelas são lidas usando a estratégia de otimização de leitura de Multi-Range. Veja a Seção 10.2.1.11, “Otimização de Leitura de Multi-Range”.

- `Using sort_union(...)`, `Using union(...)`, `Using intersect(...)` (propriedade JSON: `message`)

  Esses indicam o algoritmo específico que mostra como as consultas de índice são unidas para o tipo de junção `index_merge`. Veja a Seção 10.2.1.3, “Otimização da Fusão de Índices”.

- `Using temporary` (propriedade JSON: `using_temporary_table`)

  Para resolver a consulta, o MySQL precisa criar uma tabela temporária para armazenar o resultado. Isso geralmente acontece se a consulta contiver cláusulas `GROUP BY` e `ORDER BY` que listam as colunas de maneira diferente.

- `Using where` (propriedade JSON: `attached_condition`)

  Uma cláusula `WHERE` é usada para restringir quais linhas devem ser correspondidas à próxima tabela ou enviadas ao cliente. A menos que você tenha a intenção específica de recuperar ou examinar todas as linhas da tabela, pode haver algo errado em sua consulta se o valor `Extra` não for `Using where` e o tipo de junção da tabela for `ALL` ou `index`.

  `Using where` não tem correspondente direto na saída formatada em JSON; a propriedade `attached_condition` contém qualquer condição `WHERE` usada.

- `Using where with pushed condition` (propriedade JSON: `message`)

  Este item se aplica apenas às tabelas `NDB`. Isso significa que o NDB Cluster está usando a otimização de empurrar a condição para melhorar a eficiência de uma comparação direta entre uma coluna não indexada e uma constante. Nesse caso, a condição é “empurrada” para os nós de dados do cluster e é avaliada em todos os nós de dados simultaneamente. Isso elimina a necessidade de enviar linhas não correspondentes pela rede e pode acelerar essas consultas em um fator de 5 a 10 vezes em relação aos casos em que a otimização de empurrar a condição do motor poderia ser usada, mas não é. Para mais informações, consulte a Seção 10.2.1.5, “Otimização de Empurrar a Condição do Motor”.

- `Zero limit` (propriedade JSON: `message`)

  A consulta tinha uma cláusula `LIMIT 0` e não pode selecionar nenhuma linha.

#### EXPLAIN Saída de Interpretação

Você pode obter uma boa indicação de quão bom é um join ao multiplicar os valores na coluna `rows` do resultado `EXPLAIN`. Isso deve lhe dizer aproximadamente quantas linhas o MySQL deve examinar para executar a consulta. Se você restringir as consultas com a variável de sistema `max_join_size`, esse produto de linhas também é usado para determinar quais declarações de múltiplas tabelas `SELECT` devem ser executadas e quais devem ser abortadas. Veja a Seção 7.1.1, “Configurando o Servidor”.

O exemplo a seguir mostra como uma junção de múltiplas tabelas pode ser otimizada progressivamente com base nas informações fornecidas por `EXPLAIN`.

Suponha que você tenha a declaração `SELECT` mostrada aqui e que planeje examiná-la usando `EXPLAIN`:

```
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

  <table summary="Nomes de tabelas, nomes de colunas e tipos de dados para as colunas que estão sendo comparadas no exemplo EXPLAIN descrito no texto anterior."><thead><tr> <th scope="col">Tabela</th> <th scope="col">Coluna</th> <th scope="col">Tipo de dados</th> </tr></thead><tbody><tr> <th>[[PH_HTML_CODE_<code>EMPLOYID</code>]</th> <td>[[PH_HTML_CODE_<code>EMPLOYID</code>]</td> <td>[[PH_HTML_CODE_<code>do</code>]</td> </tr><tr> <th>[[PH_HTML_CODE_<code>CUSTNMBR</code>]</th> <td>[[PH_HTML_CODE_<code>CHAR(15)</code>]</td> <td>[[<code>CHAR(10)</code>]]</td> </tr><tr> <th>[[<code>tt</code>]]</th> <td>[[<code>ClientID</code>]]</td> <td>[[<code>CHAR(10)</code>]]</td> </tr><tr> <th>[[<code>et</code>]]</th> <td>[[<code>EMPLOYID</code>]]</td> <td>[[<code>ActualPC</code><code>EMPLOYID</code>]</td> </tr><tr> <th>[[<code>do</code>]]</th> <td>[[<code>CUSTNMBR</code>]]</td> <td>[[<code>CHAR(15)</code>]]</td> </tr></tbody></table>

- As tabelas têm os seguintes índices.

  <table summary="Índices para cada uma das tabelas que fazem parte do exemplo EXPLAIN descrito no texto anterior."><thead><tr> <th>Tabela</th> <th>Índice</th> </tr></thead><tbody><tr> <td>[[<code>tt</code>]]</td> <td>[[<code>ActualPC</code>]]</td> </tr><tr> <td>[[<code>tt</code>]]</td> <td>[[<code>AssignedPC</code>]]</td> </tr><tr> <td>[[<code>tt</code>]]</td> <td>[[<code>ClientID</code>]]</td> </tr><tr> <td>[[<code>et</code>]]</td> <td>[[<code>EMPLOYID</code>]] (chave primária)</td> </tr><tr> <td>[[<code>do</code>]]</td> <td>[[<code>CUSTNMBR</code>]] (chave primária)</td> </tr></tbody></table>

- Os valores `tt.ActualPC` não estão distribuídos de forma uniforme.

Inicialmente, antes que qualquer otimização tenha sido realizada, a declaração `EXPLAIN` produz as seguintes informações:

```
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

Um problema aqui é que o MySQL pode usar índices em colunas de forma mais eficiente se eles forem declarados com o mesmo tipo e tamanho. Nesse contexto, `VARCHAR` e `CHAR` são considerados iguais se forem declarados com o mesmo tamanho. `tt.ActualPC` é declarado como `CHAR(10)` e `et.EMPLOYID` é `CHAR(15)`, então há um desajuste de comprimento.

Para corrigir essa disparidade entre os comprimentos das colunas, use `ALTER TABLE` para alongar `ActualPC` de 10 caracteres para 15 caracteres:

```
mysql> ALTER TABLE tt MODIFY ActualPC VARCHAR(15);
```

Agora, `tt.ActualPC` e `et.EMPLOYID` são ambos `VARCHAR(15)`. Executar a instrução `EXPLAIN` novamente produz esse resultado:

```
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

```
mysql> ALTER TABLE tt MODIFY AssignedPC VARCHAR(15),
                      MODIFY ClientID   VARCHAR(15);
```

Após essa modificação, `EXPLAIN` produz a saída mostrada aqui:

```
table type   possible_keys key      key_len ref           rows Extra
et    ALL    PRIMARY       NULL     NULL    NULL          74
tt    ref    AssignedPC,   ActualPC 15      et.EMPLOYID   52   Using
             ClientID,                                         where
             ActualPC
et_1  eq_ref PRIMARY       PRIMARY  15      tt.AssignedPC 1
do    eq_ref PRIMARY       PRIMARY  15      tt.ClientID   1
```

Neste ponto, a consulta está otimizada quase da melhor maneira possível. O problema restante é que, por padrão, o MySQL assume que os valores na coluna `tt.ActualPC` estão distribuídos de forma uniforme, e isso não é o caso da tabela `tt`. Felizmente, é fácil dizer ao MySQL para analisar a distribuição da chave:

```
mysql> ANALYZE TABLE tt;
```

Com as informações adicionais do índice, a junção é perfeita e `EXPLAIN` produz este resultado:

```
table type   possible_keys key     key_len ref           rows Extra
tt    ALL    AssignedPC    NULL    NULL    NULL          3872 Using
             ClientID,                                        where
             ActualPC
et    eq_ref PRIMARY       PRIMARY 15      tt.ActualPC   1
et_1  eq_ref PRIMARY       PRIMARY 15      tt.AssignedPC 1
do    eq_ref PRIMARY       PRIMARY 15      tt.ClientID   1
```

A coluna `rows` no resultado do `EXPLAIN` é uma suposição educada do otimizador de junção do MySQL. Verifique se os números estão próximos da verdade comparando o produto `rows` com o número real de linhas que a consulta retorna. Se os números forem bastante diferentes, você pode obter um melhor desempenho usando `STRAIGHT_JOIN` na sua declaração `SELECT` e tentando listar as tabelas em uma ordem diferente na cláusula `FROM`. (No entanto, `STRAIGHT_JOIN` pode impedir que índices sejam usados porque desabilita as transformações de junção parcial. Veja a Seção 10.2.2.1, “Otimizando Predicados de Subconsultas IN e EXISTS com Transformações de Junção Parcial”.)

Em alguns casos, é possível executar instruções que modificam dados quando o `EXPLAIN SELECT` é usado com uma subconsulta; para mais informações, consulte a Seção 15.2.15.8, “Tabelas Derivadas”.
