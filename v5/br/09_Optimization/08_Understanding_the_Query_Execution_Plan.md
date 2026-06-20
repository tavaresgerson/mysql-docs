## 8.8 Entendendo o Plano de Execução da Consulta

Dependendo dos detalhes das suas tabelas, colunas, índices e das condições na sua cláusula `WHERE`, o otimizador do MySQL considera muitas técnicas para realizar eficientemente as consultas envolvidas em uma consulta SQL. Uma consulta em uma tabela enorme pode ser realizada sem ler todas as strings; uma junção que envolve várias tabelas pode ser realizada sem comparar cada combinação de strings. O conjunto de operações que o otimizador escolhe para realizar a consulta mais eficiente é chamado de “plano de execução da consulta”, também conhecido como o plano `EXPLAIN`. Seus objetivos são reconhecer os aspectos do plano `EXPLAIN` que indicam que a consulta está bem otimizada e aprender a sintaxe SQL e as técnicas de indexação para melhorar o plano se você notar algumas operações ineficientes.

### 8.8.1 Otimizando consultas com EXPLAIN

A declaração `EXPLAIN` fornece informações sobre como o MySQL executa as declarações:

* As declarações `EXPLAIN` funcionam com as declarações `SELECT`, `DELETE`, `INSERT`, `REPLACE` e `UPDATE`.

* Quando `EXPLAIN` é usado com uma declaração explicável, o MySQL exibe informações do otimizador sobre o plano de execução da declaração. Isso significa que o MySQL explica como processaria a declaração, incluindo informações sobre como as tabelas são unidas e em que ordem. Para informações sobre o uso de `EXPLAIN` para obter informações sobre o plano de execução, consulte a Seção 8.8.2, “Formato de Saída EXPLAIN”.

* Quando `EXPLAIN` é usado com `FOR CONNECTION connection_id` em vez de uma declaração explicável, ele exibe o plano de execução da declaração que está sendo executada na conexão nomeada. Veja a Seção 8.8.4, “Obtenção de Informações do Plano de Execução para uma Conexão Nomeada”.

* Para as declarações de `SELECT`, o `EXPLAIN` produz informações adicionais sobre o plano de execução que podem ser exibidas usando `SHOW WARNINGS`. Veja a Seção 8.8.3, “Formato de Saída de EXPLAIN Extendido”.

* `EXPLAIN` é útil para examinar consultas que envolvem tabelas particionadas. Veja a Seção 22.3.5, “Obtenção de Informações sobre Partições”.

* A opção `FORMAT` pode ser usada para selecionar o formato de saída. `TRADITIONAL` apresenta a saída em formato tabular. Este é o padrão se nenhuma opção `FORMAT` estiver presente. O formato `JSON` exibe as informações em formato JSON.

Com a ajuda de `EXPLAIN`, você pode ver onde você deve adicionar índices às tabelas para que a declaração execute mais rápido, usando índices para encontrar strings. Você também pode usar `EXPLAIN` para verificar se o otimizador está combinando as tabelas em uma ordem ótima. Para dar uma dica ao otimizador para usar uma ordem de junção correspondente à ordem em que as tabelas são nomeadas em uma declaração `SELECT`, comece a declaração com `SELECT STRAIGHT_JOIN` em vez de apenas `SELECT`. (Veja Seção 13.2.9, “Declaração SELECT”.) No entanto, `STRAIGHT_JOIN` pode impedir que índices sejam usados porque desativa transformações de semijoin. Veja Seção 8.2.2.1, “Otimizando subconsultas, tabelas derivadas e referências de visão com transformações de semijoin”.

O rastreamento do otimizador pode, às vezes, fornecer informações complementares às do `EXPLAIN`. No entanto, o formato e o conteúdo do rastreamento do otimizador estão sujeitos a alterações entre as versões. Para detalhes, consulte a Seção 8.15, “Rastreamento do Otimizador”.

Se você tiver um problema com os índices não sendo usados quando você acredita que eles deveriam ser, execute `ANALYZE TABLE` para atualizar as estatísticas da tabela, como a cardinalidade das chaves, que podem afetar as escolhas que o otimizador faz. Veja a Seção 13.7.2.1, “Declaração ANALYZE TABLE”.

Nota

`EXPLAIN` também pode ser usado para obter informações sobre as colunas de uma tabela. `EXPLAIN tbl_name` é sinônimo de `DESCRIBE tbl_name` e `SHOW COLUMNS FROM tbl_name`. Para mais informações, consulte a Seção 13.8.1, “Declaração DESCRIBE”, e a Seção 13.7.5.5, “Declaração SHOW COLUMNS”.

### 8.8.2 Formato do formato de saída EXPLAIN

A declaração `EXPLAIN` fornece informações sobre como o MySQL executa as declarações. A declaração `EXPLAIN` funciona com as declarações `SELECT`, `DELETE`, `INSERT`, `REPLACE` e `UPDATE`.

`EXPLAIN` retorna uma string de informações para cada tabela usada na declaração `SELECT`. Lista as tabelas na saída na ordem que o MySQL as leria durante o processamento da declaração. O MySQL resolve todas as junções usando um método de junção de laço aninhado. Isso significa que o MySQL lê uma string da primeira tabela e, em seguida, encontra uma string correspondente na segunda tabela, na terceira tabela e assim por diante. Quando todas as tabelas são processadas, o MySQL exibe as colunas selecionadas e retrocede pela lista de tabelas até encontrar uma tabela para a qual haja mais strings correspondentes. A próxima string é lida a partir dessa tabela e o processo continua com a próxima tabela.

A saída `EXPLAIN` inclui informações de partição. Além disso, para as declarações `SELECT`, a `EXPLAIN` gera informações extensas que podem ser exibidas com a `SHOW WARNINGS` após a `EXPLAIN` (ver Seção 8.8.3, “Formato de saída EXPLAIN estendido”).

Nota

Em versões mais antigas do MySQL, as informações de partição e estendida eram produzidas usando `EXPLAIN PARTITIONS` e `EXPLAIN EXTENDED`. Essas sintaxes ainda são reconhecidas para compatibilidade reversa, mas a saída de partição e estendida é habilitada por padrão, então as palavras-chave `PARTITIONS` e `EXTENDED` são supérfluas e desatualizadas. Seu uso resulta em um aviso; espere que elas sejam removidas da sintaxe `EXPLAIN` em uma versão futura do MySQL.

Você não pode usar as palavras-chave descontinuadas `PARTITIONS` e `EXTENDED` juntas na mesma declaração `EXPLAIN`. Além disso, nenhuma dessas palavras-chave pode ser usada juntas com a opção `FORMAT`.

Nota

O MySQL Workbench possui uma capacidade de Explicação Visual que fornece uma representação visual do `EXPLAIN` de saída. Veja o Tutorial: Usando Explicação para melhorar o desempenho da consulta.

* Explicar Colunas de Saída
* Explicar Tipos de Conexão
* Explicar Informações Extra
* Explicar Interpretação de Saída

#### EXPLICAR Colunas de Saída

Esta seção descreve as colunas de saída produzidas por `EXPLAIN`. As seções subsequentes fornecem informações adicionais sobre as colunas `type` e `Extra`.

Cada string de saída de `EXPLAIN` fornece informações sobre uma tabela. Cada string contém os valores resumidos na Tabela 8.1, “Colunas de Saída EXPLAIN”, e descritos com mais detalhes após a tabela. Os nomes das colunas são mostrados na primeira coluna da tabela; a segunda coluna fornece o nome da propriedade equivalente mostrado na saída quando `FORMAT=JSON` é usado.

**Tabela 8.1 Colunas de saída do EXPLAIN**

<table summary="Output columns produced by the EXPLAIN statement."><col style="width: 25%"/><col style="width: 25%"/><col style="width: 50%"/><thead><tr> <th>Column</th> <th>JSON Name</th> <th>Meaning</th> </tr></thead><tbody><tr> <th><code>id</code></th> <td><code>select_id</code></td> <td>The <code>SELECT</code> identifier</td> </tr><tr> <th><code>select_type</code></th> <td>None</td> <td>The <code>SELECT</code> type</td> </tr><tr> <th><code>table</code></th> <td><code>table_name</code></td> <td>A tabela para a string de saída</td> </tr><tr> <th><code>partitions</code></th> <td><code>partitions</code></td> <td>The matching partitions</td> </tr><tr> <th><code>type</code></th> <td><code>access_type</code></td> <td>The join type</td> </tr><tr> <th><code>possible_keys</code></th> <td><code>possible_keys</code></td> <td>The possible indexes to choose</td> </tr><tr> <th><code>key</code></th> <td><code>key</code></td> <td>The index actually chosen</td> </tr><tr> <th><code>key_len</code></th> <td><code>key_length</code></td> <td>O comprimento da chave escolhida</td> </tr><tr> <th><code>ref</code></th> <td><code>ref</code></td> <td>As colunas em comparação com o índice</td> </tr><tr> <th><code>rows</code></th> <td><code>rows</code></td> <td>Estimativa de strings a serem examinadas</td> </tr><tr> <th><code>filtered</code></th> <td><code>filtered</code></td> <td>Porcentagem de strings filtradas por condição da tabela</td> </tr><tr> <th><code>Extra</code></th> <td>None</td> <td>Additional information</td> </tr></tbody></table>

Nota

As propriedades do JSON que são `NULL` não são exibidas na saída formatada em JSON `EXPLAIN`.

* `id` (nome em JSON: `select_id`)

O identificador `SELECT`. Este é o número sequencial do `SELECT` dentro da consulta. O valor pode ser `NULL` se a string se referir ao resultado da união de outras strings. Neste caso, a coluna `table` exibe um valor como `<unionM,N>` para indicar que a string se refere à união das strings com os valores `id` de *`M`* e *`N`*.

* `select_type` (nome em JSON: nenhum)

O tipo de `SELECT`, que pode ser qualquer um dos mostrados na tabela a seguir. Um `EXPLAIN` formatado em JSON expõe o tipo `SELECT` como uma propriedade de um `query_block`, a menos que seja `SIMPLE` ou `PRIMARY`. Os nomes em JSON (quando aplicável) também são mostrados na tabela.

  <table summary="select_type values and the meaning of each value."><col style="width: 25%"/><col style="width: 25%"/><col style="width: 50%"/><thead><tr> <th><code>select_type</code> Value</th> <th>JSON Name</th> <th>Meaning</th> </tr></thead><tbody><tr> <th><code>SIMPLE</code></th> <td>Nenhum</td> <td>Simples<code>SELECT</code>(não usando<code>UNION</code>ou subconsultas)</td> </tr><tr> <th><code>PRIMARY</code></th> <td>None</td> <td>Outermost <code>SELECT</code></td> </tr><tr> <th><code>UNION</code></th> <td>Nenhum</td> <td>Segunda ou posterior<code>SELECT</code>declaração em um<code>UNION</code></td> </tr><tr> <th><code>DEPENDENT UNION</code></th> <td><code>dependent</code>(<code>true</code>)</td> <td>Segunda ou posterior<code>SELECT</code>declaração em um<code>UNION</code>, dependente da consulta externa</td> </tr><tr> <th><code>UNION RESULT</code></th> <td><code>union_result</code></td> <td>Resultado de um<code>UNION</code>.</td> </tr><tr> <th><code>SUBQUERY</code></th> <td>None</td> <td>First <code>SELECT</code> in subquery</td> </tr><tr> <th><code>DEPENDENT SUBQUERY</code></th> <td><code>dependent</code>(<code>true</code>)</td> <td>Primeiro<code>SELECT</code>na subconsulta, dependente da consulta externa</td> </tr><tr> <th><code>DERIVED</code></th> <td>None</td> <td>Derived table</td> </tr><tr> <th><code>MATERIALIZED</code></th> <td><code>materialized_from_subquery</code></td> <td>Materialized subquery</td> </tr><tr> <th><code>UNCACHEABLE SUBQUERY</code></th> <td><code>cacheable</code>(<code>false</code>)</td> <td>Uma subconsulta para a qual o resultado não pode ser armazenado em cache e deve ser reavaliado para cada string da consulta externa</td> </tr><tr> <th><code>UNCACHEABLE UNION</code></th> <td><code>cacheable</code>(<code>false</code>)</td> <td>A segunda ou posterior seleção em um<code>UNION</code>que pertence a uma subconsulta não cacheável (consulte<code>UNCACHEABLE SUBQUERY</code>)</td> </tr></tbody></table>

`DEPENDENT` geralmente significa o uso de uma subconsulta correlacionada. Veja a Seção 13.2.10.7, “Subconsultas Correlacionadas”.

A avaliação de `DEPENDENT SUBQUERY` difere da avaliação de `UNCACHEABLE SUBQUERY`. Para `DEPENDENT SUBQUERY`, a subconsulta é reavaliada apenas uma vez para cada conjunto de diferentes valores das variáveis de seu contexto externo. Para `UNCACHEABLE SUBQUERY`, a subconsulta é reavaliada para cada string do contexto externo.

A capacidade de cache de subconsultas difere da cache de resultados de consulta na cache de consulta (que é descrita na Seção 8.10.3.1, “Como a Cache de Consulta Funciona”). O cache de subconsultas ocorre durante a execução da consulta, enquanto a cache de consulta é usada para armazenar resultados apenas após a execução da consulta terminar.

Quando você especifica `FORMAT=JSON` com `EXPLAIN`, a saída não tem uma única propriedade diretamente equivalente a `select_type`; a propriedade `query_block` corresponde a um `SELECT` específico. As propriedades equivalentes à maioria dos tipos de subconsulta `SELECT` mostrados anteriormente estão disponíveis (um exemplo é `materialized_from_subquery` para `MATERIALIZED`) e são exibidas quando apropriado. Não há equivalentes JSON para `SIMPLE` ou `PRIMARY`.

O valor `select_type` para declarações que não são `SELECT` exibe o tipo de declaração para as tabelas afetadas. Por exemplo, `select_type` é `DELETE` para declarações `DELETE`.

* `table` (nome em JSON: `table_name`)

O nome da tabela a qual a string de saída se refere. Isso também pode ser um dos seguintes valores:

+ `<unionM,N>`: A string se refere à união das strings com os valores da string `id` de *`M`* e *`N`*.

+ `<derivedN>`: A string se refere ao resultado da tabela derivada para a string com um valor de `id` de *`N`*. Uma tabela derivada pode resultar, por exemplo, de uma subconsulta na cláusula `FROM`.

+ `<subqueryN>`: A string se refere ao resultado de uma subconsulta materializada para a string com um valor de `id` de *`N`*. Veja a Seção 8.2.2.2, “Otimizando subconsultas com materialização”.

* `partitions` (nome em JSON: `partitions`)

As partições pelas quais os registros seriam correspondidos pela consulta. O valor é `NULL` para tabelas não particionadas. Veja a Seção 22.3.5, “Obtenção de informações sobre partições”.

* `type` (nome em JSON: `access_type`)

O tipo de junção. Para descrições dos diferentes tipos, consulte `EXPLAIN` Tipos de junção.

* `possible_keys` (nome em JSON: `possible_keys`)

A coluna `possible_keys` indica os índices a partir dos quais o MySQL pode escolher para encontrar as strings nesta tabela. Note que esta coluna é totalmente independente da ordem das tabelas conforme exibida na saída de `EXPLAIN`. Isso significa que algumas das chaves em `possible_keys` podem não ser utilizáveis na prática com a ordem de tabela gerada.

Se esta coluna estiver `NULL` (ou indefinida na saída formatada em JSON), não há índices relevantes. Neste caso, você pode ser capaz de melhorar o desempenho da sua consulta examinando a cláusula `WHERE` para verificar se ela se refere a alguma coluna ou colunas que seriam adequadas para indexação. Se assim for, crie um índice apropriado e verifique a consulta com `EXPLAIN` novamente. Veja a Seção 13.1.8, “Declaração ALTER TABLE”.

Para ver quais índices uma tabela tem, use `SHOW INDEX FROM tbl_name`.

* `key` (nome em JSON: `key`)

A coluna `key` indica a chave (índice) que o MySQL realmente decidiu usar. Se o MySQL decidir usar um dos índices `possible_keys` para procurar strings, esse índice é listado como o valor da chave.

É possível que `key` nomeie um índice que não está presente no valor de `possible_keys`. Isso pode acontecer se nenhum dos índices `possible_keys` for adequado para pesquisar strings, mas todas as colunas selecionadas pela consulta são colunas de algum outro índice. Ou seja, o índice nomeado cobre as colunas selecionadas, então, embora não seja usado para determinar quais strings devem ser recuperadas, uma varredura de índice é mais eficiente do que uma varredura de string de dados.

Para `InnoDB`, um índice secundário pode cobrir as colunas selecionadas mesmo que a consulta também selecione a chave primária, porque `InnoDB` armazena o valor da chave primária com cada índice secundário. Se `key` é `NULL`, o MySQL não encontrou nenhum índice para usar para executar a consulta de forma mais eficiente.

Para forçar o MySQL a usar ou ignorar um índice listado na coluna `possible_keys`, use `FORCE INDEX`, `USE INDEX` ou `IGNORE INDEX` em sua consulta. Veja a Seção 8.9.4, “Dicas de índice”.

Para as tabelas `MyISAM`, executar `ANALYZE TABLE` ajuda o otimizador a escolher índices melhores. Para as tabelas `MyISAM`, o **myisamchk --analyze** faz o mesmo. Veja a Seção 13.7.2.1, “Declaração TABLE ANALYZE”, e a Seção 7.6, “Manutenção e Recuperação de Quebra de Tabela MyISAM”.

* `key_len` (nome em JSON: `key_length`)

A coluna `key_len` indica o comprimento da chave que o MySQL decidiu usar. O valor da coluna `key_len` permite determinar quantas partes de uma chave de múltiplas partes o MySQL realmente usa. Se a coluna `key` indicar `NULL`, a coluna `key_len` também indica `NULL`.

Devido ao formato de armazenamento de chave, o comprimento da chave é um maior para uma coluna que pode ser `NULL` do que para uma coluna `NOT NULL`.

* `ref` (nome em JSON: `ref`)

A coluna `ref` mostra quais colunas ou constantes são comparadas ao índice nomeado na coluna `key` para selecionar strings da tabela.

Se o valor for `func`, o valor utilizado é o resultado de alguma função. Para saber qual função, use `SHOW WARNINGS` após `EXPLAIN` para ver a saída `EXPLAIN` ampliada. A função pode ser, na verdade, um operador, como um operador aritmético.

* `rows` (nome em JSON: `rows`)

A coluna `rows` indica o número de strings que o MySQL acredita que deve examinar para executar a consulta.

Para as tabelas `InnoDB`, esse número é uma estimativa e nem sempre pode ser exato.

* `filtered` (nome em JSON: `filtered`)

A coluna `filtered` indica a porcentagem estimada de strings da tabela filtradas pela condição da tabela. O valor máximo é 100, o que significa que não houve filtragem de strings. Valores que diminuem de 100 indicam quantidades crescentes de filtragem. `rows` mostra o número estimado de strings examinadas e `rows` × `filtered` mostra o número de strings que foram unidas com a tabela seguinte. Por exemplo, se `rows` é 1000 e `filtered` é 50,00 (50%), o número de strings a serem unidas com a tabela seguinte é 1000 × 50% = 500.

* `Extra` (nome em JSON: nenhum)

Esta coluna contém informações adicionais sobre como o MySQL resolve a consulta. Para descrições dos diferentes valores, consulte `EXPLAIN` Informações Adicionais.

Não há uma única propriedade JSON correspondente à coluna `Extra`; no entanto, os valores que podem ocorrer nesta coluna são exibidos como propriedades JSON ou como o texto da propriedade `message`.

#### EXPLIQUE Tipos de Conexão

A coluna `type` do `EXPLAIN` de saída descreve como as tabelas são unidas. No output formatado em JSON, esses valores são encontrados como propriedades da propriedade `access_type`. A lista a seguir descreve os tipos de junção, ordenados do melhor tipo ao pior:

* `system`

A tabela tem apenas uma string (= tabela do sistema). Este é um caso especial do tipo de junção `const`.

* `const`

A tabela tem, no máximo, uma string correspondente, que é lida no início da consulta. Como há apenas uma string, os valores da coluna nessa string podem ser considerados constantes pelo resto do otimizador. As tabelas `const` são muito rápidas porque são lidas apenas uma vez.

`const` é usado quando você compara todas as partes de um índice `PRIMARY KEY` ou `UNIQUE` a valores constantes. Nas seguintes consultas, *`tbl_name`* pode ser usado como uma tabela `const`:

  ```sql
  SELECT * FROM tbl_name WHERE primary_key=1;

  SELECT * FROM tbl_name
    WHERE primary_key_part1=1 AND primary_key_part2=2;
  ```

* `eq_ref`

Uma string é lida a partir desta tabela para cada combinação de strings das tabelas anteriores. Além dos tipos `system` e `const`, este é o melhor tipo de junção possível. É usado quando todas as partes de um índice são usadas pelo junção e o índice é um índice `PRIMARY KEY` ou `UNIQUE NOT NULL`.

`eq_ref` pode ser usado para colunas indexadas que são comparadas usando o operador `=`. O valor de comparação pode ser uma constante ou uma expressão que usa colunas de tabelas que são lidas antes desta tabela. Nos exemplos a seguir, o MySQL pode usar uma junção `eq_ref` para processar *`ref_table`*:

  ```sql
  SELECT * FROM ref_table,other_table
    WHERE ref_table.key_column=other_table.column;

  SELECT * FROM ref_table,other_table
    WHERE ref_table.key_column_part1=other_table.column
    AND ref_table.key_column_part2=1;
  ```

* `ref`

Todas as strings com valores de índice correspondentes são lidas a partir desta tabela para cada combinação de strings das tabelas anteriores. `ref` é usado se a junção usar apenas um prefixo da esquerda da chave ou se a chave não for um índice `PRIMARY KEY` ou `UNIQUE` (ou seja, se a junção não puder selecionar uma única string com base no valor da chave). Se a chave que é usada corresponde apenas a algumas strings, este é um bom tipo de junção.

`ref` pode ser usado para colunas indexadas que são comparadas usando o operador `=` ou `<=>`. Nos exemplos a seguir, o MySQL pode usar uma junção `ref` para processar *`ref_table`*:

  ```sql
  SELECT * FROM ref_table WHERE key_column=expr;

  SELECT * FROM ref_table,other_table
    WHERE ref_table.key_column=other_table.column;

  SELECT * FROM ref_table,other_table
    WHERE ref_table.key_column_part1=other_table.column
    AND ref_table.key_column_part2=1;
  ```

* `fulltext`

A junção é realizada usando um índice `FULLTEXT`.

* `ref_or_null`

Este tipo de junção é como `ref`, mas com a adição de que o MySQL faz uma busca extra para as strings que contêm valores de `NULL`. Esta otimização do tipo de junção é usada com mais frequência na resolução de subconsultas. Nos exemplos a seguir, o MySQL pode usar uma junção `ref_or_null` para processar *`ref_table`*:

  ```sql
  SELECT * FROM ref_table
    WHERE key_column=expr OR key_column IS NULL;
  ```

Veja a Seção 8.2.1.13, “Otimização de IS NULL”.

* `index_merge`

Este tipo de junção indica que a otimização de junção de índices é usada. Neste caso, a coluna `key` na string de saída contém uma lista de índices usados, e `key_len` contém uma lista das partes de chave mais longas para os índices usados. Para mais informações, consulte a Seção 8.2.1.3, “Otimização de junção de índices”.

* `unique_subquery`

Este tipo substitui `eq_ref` para algumas subconsultas `IN` do seguinte formato:

  ```sql
  value IN (SELECT primary_key FROM single_table WHERE some_expr)
  ```

`unique_subquery` é apenas uma função de busca de índice que substitui completamente a subconsulta para uma melhor eficiência.

* `index_subquery`

Este tipo de junção é semelhante ao `unique_subquery`. Ele substitui as subconsultas `IN`, mas funciona para índices não únicos em subconsultas da seguinte forma:

  ```sql
  value IN (SELECT key_column FROM single_table WHERE some_expr)
  ```

* `range`

Apenas as strings que estão em um determinado intervalo são recuperadas, usando um índice para selecionar as strings. A coluna `key` na string de saída indica qual índice é usado. A `key_len` contém a parte da chave mais longa que foi usada. A coluna `ref` é `NULL` para este tipo.

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

* `index`

O tipo de junção `index` é o mesmo que `ALL`, exceto que a árvore de índice é verificada. Isso ocorre de duas maneiras:

+ Se o índice for um índice coberto para as consultas e puder ser usado para satisfazer todos os dados necessários da tabela, apenas a árvore do índice é verificada. Nesse caso, a coluna `Extra` diz `Using index`. Um exame apenas do índice geralmente é mais rápido do que `ALL`, porque o tamanho do índice geralmente é menor que os dados da tabela.

+ Uma varredura completa da tabela é realizada usando leituras do índice para procurar strings de dados na ordem do índice. `Uses index` não aparece na coluna `Extra`.

O MySQL pode usar esse tipo de junção quando a consulta usa apenas colunas que fazem parte de um único índice.

* `ALL`

Um varrimento completo da tabela é feito para cada combinação de strings das tabelas anteriores. Isso normalmente não é bom se a tabela for a primeira tabela não marcada `const`, e geralmente *muito* ruim em todos os outros casos. Normalmente, você pode evitar `ALL` adicionando índices que permitem a recuperação de strings da tabela com base em valores constantes ou valores de coluna de tabelas anteriores.

#### EXPLICAR Informações Adicionais

A coluna `Extra` do `EXPLAIN` de saída contém informações adicionais sobre como o MySQL resolve a consulta. A lista a seguir explica os valores que podem aparecer nesta coluna. Cada item também indica para saída formatada em JSON qual propriedade exibe o valor do `Extra`. Para alguns desses, há uma propriedade específica. Os outros são exibidos como o texto da propriedade `message`.

Se você deseja fazer suas consultas o mais rápido possível, fique atento aos valores das colunas `Extra` de `Using filesort` e `Using temporary`, ou, em saída formatada em JSON de `EXPLAIN`, às propriedades `using_filesort` e `using_temporary_table` iguais a `true`.

* `Child of 'table' pushed join@1` (JSON: `message` texto)

Essa tabela é referenciada como a criança de *`table`* em uma junção que pode ser empurrada para o kernel NDB. Aplica-se apenas no NDB Cluster, quando as junções empurradas estão habilitadas. Veja a descrição da variável de sistema de servidor `ndb_join_pushdown` para mais informações e exemplos.

* `const row not found` (propriedade JSON: `const_row_not_found`)

Para uma consulta como `SELECT ... FROM tbl_name`, a tabela estava vazia.

* `Deleting all rows` (propriedade JSON: `message`)

Para `DELETE`, alguns motores de armazenamento (como `MyISAM`) suportam um método de manipulador que remove todas as strings de tabela de maneira simples e rápida. Este valor `Extra` é exibido se o motor usar essa otimização.

* `Distinct` (propriedade JSON: `distinct`)

O MySQL está procurando valores distintos, então ele para de procurar mais strings para a combinação de string atual após encontrar a primeira string correspondente.

* `FirstMatch(tbl_name)` (propriedade JSON: `first_match`)

A estratégia de junção semijoinha FirstMatch é usada para *`tbl_name`*.

* `Full scan on NULL key` (propriedade JSON: `message`)

Isso ocorre para a otimização de subconsultas como uma estratégia de fallback quando o otimizador não pode usar um método de acesso de consulta por índice.

* `Impossible HAVING` (propriedade JSON: `message`)

A cláusula `HAVING` é sempre falsa e não pode selecionar nenhuma string.

* `Impossible WHERE` (propriedade JSON: `message`)

A cláusula `WHERE` é sempre falsa e não pode selecionar nenhuma string.

* `Impossible WHERE noticed after reading const tables` (propriedade JSON: `message`)

MySQL leu todas as tabelas `const` (e `system`) e notou que a cláusula `WHERE` é sempre falsa.

* `LooseScan(m..n)` (propriedade JSON: `message`)

A estratégia semijoin LooseScan é utilizada. *`m`* e *`n`* são números de peças-chave.

* `No matching min/max row` (propriedade JSON: `message`)

Nenhuma string satisfaz a condição para uma consulta como `SELECT MIN(...) FROM ... WHERE condition`.

* `no matching row in const table` (propriedade JSON: `message`)

Para uma consulta com uma junção, havia uma tabela vazia ou uma tabela sem strings que satisfaçam uma condição de índice único.

* `No matching rows after partition pruning` (propriedade JSON: `message`)

Para `DELETE` ou `UPDATE`, o otimizador não encontrou nada a ser excluído ou atualizado após o recorte de partição. É semelhante em significado para `Impossible WHERE` para declarações de `SELECT`.

* `No tables used` (propriedade JSON: `message`)

A consulta não tem a cláusula `FROM`, ou tem a cláusula `FROM DUAL`.

Para as declarações `INSERT` ou `REPLACE`, `EXPLAIN` exibe esse valor quando não há parte `SELECT`. Por exemplo, aparece para `EXPLAIN INSERT INTO t VALUES(10)`, pois é equivalente a `EXPLAIN INSERT INTO t SELECT 10 FROM DUAL`.

* `Not exists` (propriedade JSON: `message`)

O MySQL conseguiu realizar uma otimização do `LEFT JOIN` na consulta e não examina mais strings nesta tabela para a combinação de string anterior após encontrar uma string que corresponda aos critérios do `LEFT JOIN`. Aqui está um exemplo do tipo de consulta que pode ser otimizado dessa forma:

  ```sql
  SELECT * FROM t1 LEFT JOIN t2 ON t1.id=t2.id
    WHERE t2.id IS NULL;
  ```

Suponha que `t2.id` seja definido como `NOT NULL`. Nesse caso, o MySQL examina `t1` e busca as strings em `t2` usando os valores de `t1.id`. Se o MySQL encontrar uma string correspondente em `t2`, sabe que `t2.id` nunca pode ser `NULL`, e não examina o resto das strings em `t2` que têm o mesmo valor de `id`. Em outras palavras, para cada string em `t1`, o MySQL precisa fazer apenas uma única pesquisa em `t2`, independentemente de quantas strings realmente correspondam em `t2`.

* `Plan isn't ready yet` (propriedade JSON: nenhuma)

Esse valor ocorre com `EXPLAIN FOR CONNECTION` quando o otimizador não terminou de criar o plano de execução para a declaração que está sendo executada na conexão nomeada. Se o resultado do plano de execução tiver várias strings, qualquer uma ou todas elas podem ter esse valor `Extra`, dependendo do progresso do otimizador na determinação do plano de execução completo.

* `Range checked for each record (index map: N)` (propriedade JSON: `message`)

O MySQL não encontrou um bom índice para usar, mas descobriu que alguns índices podem ser usados após os valores das colunas das tabelas anteriores serem conhecidos. Para cada combinação de string nas tabelas anteriores, o MySQL verifica se é possível usar um método de acesso `range` ou `index_merge` para recuperar as strings. Isso não é muito rápido, mas é mais rápido do que realizar uma junção sem nenhum índice. Os critérios de aplicabilidade são descritos na Seção 8.2.1.2, “Otimização de intervalo”, e na Seção 8.2.1.3, “Otimização de junção de índices”, com a exceção de que todos os valores das colunas da tabela anterior são conhecidos e considerados constantes.

Os índices são numerados a partir do número 1, na mesma ordem que é mostrado por `SHOW INDEX` para a tabela. O valor do mapa de índice *`N`* é um valor de bitmask que indica quais índices são candidatos. Por exemplo, um valor de `0x19` (binário 11001) significa que os índices 1, 4 e 5 são considerados.

* `Scanned N databases` (propriedade JSON: `message`)

Isso indica quantas varreduras de diretório o servidor realiza ao processar uma consulta para as tabelas `INFORMATION_SCHEMA`, conforme descrito na Seção 8.2.3, “Otimizando consultas do INFORMATION_SCHEMA”. O valor de *`N`* pode ser 0, 1 ou `all`.

* `Select tables optimized away` (propriedade JSON: `message`)

O otimizador determinou 1) que, no máximo, uma string deve ser devolvida e 2) que, para produzir essa string, um conjunto determinístico de strings deve ser lido. Quando as strings que devem ser lidas podem ser lidas durante a fase de otimização (por exemplo, lendo strings de índice), não há necessidade de ler quaisquer tabelas durante a execução da consulta.

A primeira condição é cumprida quando a consulta é agrupada implicitamente (contém uma função agregada, mas nenhuma cláusula `GROUP BY`). A segunda condição é cumprida quando uma pesquisa de string é realizada por índice utilizado. O número de índices lidos determina o número de strings a serem lidas.

Considere a seguinte consulta implicitamente agrupada:

  ```sql
  SELECT MIN(c1), MIN(c2) FROM t1;
  ```

Suponha que `MIN(c1)` possa ser recuperado lendo uma string de índice e `MIN(c2)` pode ser recuperado lendo uma string de um índice diferente. Ou seja, para cada coluna `c1` e `c2`, existe um índice onde a coluna é a primeira coluna do índice. Neste caso, uma string é devolvida, produzida lendo duas strings determinísticas.

Esse valor `Extra` não ocorre se as strings a serem lidas não forem determinísticas. Considere esta consulta:

  ```sql
  SELECT MIN(c2) FROM t1 WHERE c1 <= 10;
  ```

Suponha que `(c1, c2)` seja um índice de cobertura. Usando este índice, todas as strings com `c1 <= 10` devem ser verificadas para encontrar o valor mínimo de `c2`. Por outro lado, considere esta consulta:

  ```sql
  SELECT MIN(c2) FROM t1 WHERE c1 = 10;
  ```

Neste caso, a primeira string do índice com `c1 = 10` contém o valor mínimo `c2`. Apenas uma string deve ser lida para produzir a string devolvida.

Para motores de armazenamento que mantêm um contagem exata de strings por tabela (como `MyISAM`, mas não `InnoDB`), este valor `Extra` pode ocorrer para consultas `COUNT(*)` para as quais a cláusula `WHERE` está ausente ou sempre verdadeira e não há cláusula `GROUP BY`. (Esta é uma instância de uma consulta agrupada implicitamente, onde o motor de armazenamento influencia se um número determinado de strings pode ser lido.)

* `Skip_open_table`, `Open_frm_only`, `Open_full_table` (propriedade JSON: `message`)

Esses valores indicam otimizações de abertura de arquivos que se aplicam a consultas para tabelas `INFORMATION_SCHEMA`, conforme descrito na Seção 8.2.3, “Otimizando consultas do INFORMATION_SCHEMA”.

+ `Skip_open_table`: Não é necessário abrir os arquivos de tabela. As informações já se tornaram disponíveis na consulta ao digitalizar o diretório do banco de dados.

+ `Open_frm_only`: Apenas o arquivo `.frm` da tabela precisa ser aberto.

+ `Open_full_table`: Busca de informações não otimizada. Os arquivos `.frm`, `.MYD` e `.MYI` devem ser abertos.

* `Start temporary`, `End temporary` (propriedade JSON: `message`)

Isso indica o uso de tabela temporária para a estratégia de semijoin Duplicate Weedout.

* `unique row not found` (propriedade JSON: `message`)

Para uma consulta como `SELECT ... FROM tbl_name`, nenhuma string satisfaz a condição para um índice `UNIQUE` ou `PRIMARY KEY` na tabela.

* `Using filesort` (propriedade JSON: `using_filesort`)

O MySQL deve fazer uma passagem extra para descobrir como recuperar as strings em ordem ordenada. O tipo de ordenação é feito percorrendo todas as strings de acordo com o tipo de junção e armazenando a chave de ordenação e o ponteiro para a string para todas as strings que correspondem à cláusula `WHERE`. As chaves são então ordenadas e as strings são recuperadas em ordem ordenada. Veja a Seção 8.2.1.14, “Otimização de ORDER BY”.

* `Using index` (propriedade JSON: `using_index`)

As informações da coluna são recuperadas da tabela usando apenas informações na árvore de índice, sem precisar realizar uma busca adicional para ler a string real. Essa estratégia pode ser usada quando a consulta usa apenas colunas que fazem parte de um único índice.

Para as tabelas `InnoDB` que possuem um índice agrupado definido pelo usuário, esse índice pode ser usado mesmo quando `Using index` está ausente na coluna `Extra`. Esse é o caso se `type` for `index` e `key` for `PRIMARY`.

* `Using index condition` (propriedade JSON: `using_index_condition`)

As tabelas são lidas acessando tuplos de índice e testando-os primeiro para determinar se é necessário ler strings completas da tabela. Dessa forma, as informações do índice são usadas para adiar (“empurrar para baixo”) a leitura de strings completas da tabela, a menos que seja necessário. Veja a Seção 8.2.1.5, “Otimização de Empurrar para Baixo da Condição do Índice”.

* `Using index for group-by` (propriedade JSON: `using_index_for_group_by`)

Semelhante ao método de acesso à tabela `Using index`, o `Using index for group-by` indica que o MySQL encontrou um índice que pode ser usado para recuperar todas as colunas de uma consulta `GROUP BY` ou `DISTINCT` sem qualquer acesso adicional ao disco à tabela real. Além disso, o índice é usado da maneira mais eficiente, de modo que, para cada grupo, apenas algumas entradas de índice são lidas. Para detalhes, consulte a Seção 8.2.1.15, “Otimização de GROUP BY”.

* `Using join buffer (Block Nested Loop)`, `Using join buffer (Batched Key Access)` (propriedade JSON: `using_join_buffer`)

As tabelas de junções anteriores são lidas em porções no buffer de junção e, em seguida, suas strings são usadas a partir do buffer para realizar a junção com a tabela atual. `(Block Nested Loop)` indica o uso do algoritmo de Bloco de Busca em Nó e `(Batched Key Access)` indica o uso do algoritmo de Acesso a Chave em Batel. Ou seja, as chaves da tabela na string anterior da saída do `EXPLAIN` são armazenadas em buffer, e as strings correspondentes são obtidas em lotes da tabela representada pela string na qual o `Using join buffer` aparece.

Na saída formatada em JSON, o valor de `using_join_buffer` é sempre um dos valores de `Block Nested Loop` ou `Batched Key Access`.

Para mais informações sobre esses algoritmos, consulte Algoritmo de Conjunção de Nó Bloqueado e Conjunções de Acesso a Chave em lote.

* `Using MRR` (propriedade JSON: `message`)

As tabelas são lidas usando a estratégia de otimização de leitura de Multi-Range. Veja a Seção 8.2.1.10, “Otimização de Leitura de Multi-Range”.

* `Using sort_union(...)`, `Using union(...)`, `Using intersect(...)` (propriedade JSON: `message`)

Esses indicam o algoritmo específico que mostra como as pesquisas de índice são unidas para o tipo de junção `index_merge`. Veja a Seção 8.2.1.3, “Otimização da junção de índices”.

* `Using temporary` (propriedade JSON: `using_temporary_table`)

Para resolver a consulta, o MySQL precisa criar uma tabela temporária para armazenar o resultado. Isso geralmente acontece se a consulta contiver cláusulas `GROUP BY` e `ORDER BY` que listam as colunas de maneira diferente.

* `Using where` (propriedade JSON: `attached_condition`)

Uma cláusula `WHERE` é usada para restringir quais strings devem ser correspondidas com a próxima tabela ou enviadas ao cliente. A menos que você pretenda especificamente buscar ou examinar todas as strings da tabela, você pode ter algo errado em sua consulta se o valor `Extra` não for `Using where` e o tipo de junção da tabela for `ALL` ou `index`.

`Using where` não tem correspondência direta em saída formatada em JSON; a propriedade `attached_condition` contém qualquer condição `WHERE` usada.

* `Using where with pushed condition` (propriedade JSON: `message`)

Este item se aplica apenas às tabelas `NDB`. Isso significa que o NDB Cluster está usando a otimização de empurrar a condição para melhorar a eficiência de uma comparação direta entre uma coluna não indexada e uma constante. Nesses casos, a condição é "empurrada" para os nós de dados do cluster e é avaliada em todos os nós de dados simultaneamente. Isso elimina a necessidade de enviar strings não correspondentes pela rede e pode acelerar essas consultas em um fator de 5 a 10 vezes em relação aos casos em que a otimização de empurrar a condição do motor pode ser usada, mas não é usada. Para mais informações, consulte a Seção 8.2.1.4, "Otimização de Condição de Motor".

* `Zero limit` (propriedade JSON: `message`)

A consulta tinha uma cláusula `LIMIT 0` e não pode selecionar nenhuma string.

#### Explicação da Interpretação do Saída

Você pode obter uma boa indicação de quão bom é um join ao calcular o produto dos valores na coluna `rows` do `EXPLAIN` de saída. Isso deve lhe dizer aproximadamente quantas strings o MySQL deve examinar para executar a consulta. Se você restringir as consultas com a variável de sistema `max_join_size`, esse produto de strings também é usado para determinar quais declarações de múltiplas tabelas `SELECT` devem ser executadas e quais devem ser abortadas. Veja a Seção 5.1.1, “Configurando o servidor”.

O exemplo a seguir mostra como uma junção de múltiplas tabelas pode ser otimizada progressivamente com base nas informações fornecidas por `EXPLAIN`.

Suponha que você tenha a declaração `SELECT` mostrada aqui e que planeje examiná-la usando `EXPLAIN`:

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

  <table summary="Table names, column names, and data types for the columns being compared in the EXPLAIN example described in the preceding text."><col style="width: 10%"/><col style="width: 25%"/><col style="width: 25%"/><thead><tr> <th>Table</th> <th>Column</th> <th>Data Type</th> </tr></thead><tbody><tr> <th><code>tt</code></th> <td><code>ActualPC</code></td> <td><code>CHAR(10)</code></td> </tr><tr> <th><code>tt</code></th> <td><code>AssignedPC</code></td> <td><code>CHAR(10)</code></td> </tr><tr> <th><code>tt</code></th> <td><code>ClientID</code></td> <td><code>CHAR(10)</code></td> </tr><tr> <th><code>et</code></th> <td><code>EMPLOYID</code></td> <td><code>CHAR(15)</code></td> </tr><tr> <th><code>do</code></th> <td><code>CUSTNMBR</code></td> <td><code>CHAR(15)</code></td> </tr></tbody></table>

* As tabelas possuem os seguintes índices.

  <table summary="Indexes for each of the tables that are part of the EXPLAIN example described in the preceding text."><col style="width: 10%"/><col style="width: 40%"/><thead><tr> <th>Table</th> <th>Index</th> </tr></thead><tbody><tr> <td><code>tt</code></td> <td><code>ActualPC</code></td> </tr><tr> <td><code>tt</code></td> <td><code>AssignedPC</code></td> </tr><tr> <td><code>tt</code></td> <td><code>ClientID</code></td> </tr><tr> <td><code>et</code></td> <td><code>EMPLOYID</code> (primary key)</td> </tr><tr> <td><code>do</code></td> <td><code>CUSTNMBR</code> (primary key)</td> </tr></tbody></table>

* Os valores de `tt.ActualPC` não estão distribuídos de forma uniforme.

Inicialmente, antes que qualquer otimização tenha sido realizada, a declaração `EXPLAIN` produz as seguintes informações:

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

Como `type` é `ALL` para cada tabela, essa saída indica que o MySQL está gerando um produto cartesiano de todas as tabelas; ou seja, cada combinação de strings. Isso leva bastante tempo, porque o produto do número de strings em cada tabela deve ser examinado. No caso em questão, esse produto é 74 × 2135 × 74 × 3872 = 45.268.558.720 strings. Se as tabelas fossem maiores, você pode apenas imaginar quanto tempo levaria.

Um problema aqui é que o MySQL pode usar índices em colunas de forma mais eficiente se eles forem declarados como o mesmo tipo e tamanho. Neste contexto, `VARCHAR` e `CHAR` são considerados iguais se forem declarados com o mesmo tamanho. `tt.ActualPC` é declarado como `CHAR(10)` e `et.EMPLOYID` é `CHAR(15)`, então há um desalinhamento de comprimento.

Para corrigir essa disparidade entre os comprimentos das colunas, use `ALTER TABLE` para alongar `ActualPC` de 10 caracteres para 15 caracteres:

```sql
mysql> ALTER TABLE tt MODIFY ActualPC VARCHAR(15);
```

Agora, `tt.ActualPC` e `et.EMPLOYID` são ambos `VARCHAR(15)`. Executar a declaração `EXPLAIN` novamente produz este resultado:

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

Isso não é perfeito, mas é muito melhor: O produto dos valores de `rows` é menor por um fator de 74. Esta versão executa em alguns segundos.

Uma segunda alteração pode ser feita para eliminar as discrepâncias na largura da coluna para as comparações de `tt.AssignedPC = et_1.EMPLOYID` e `tt.ClientID = do.CUSTNMBR`:

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

Neste ponto, a consulta é otimizada quase da melhor maneira possível. O problema restante é que, por padrão, o MySQL assume que os valores na coluna `tt.ActualPC` estão distribuídos de forma uniforme, e esse não é o caso da tabela `tt`. Felizmente, é fácil dizer ao MySQL para analisar a distribuição da chave:

```sql
mysql> ANALYZE TABLE tt;
```

Com as informações adicionais do índice, a junção é perfeita e `EXPLAIN` produz este resultado:

```sql
table type   possible_keys key     key_len ref           rows Extra
tt    ALL    AssignedPC    NULL    NULL    NULL          3872 Using
             ClientID,                                        where
             ActualPC
et    eq_ref PRIMARY       PRIMARY 15      tt.ActualPC   1
et_1  eq_ref PRIMARY       PRIMARY 15      tt.AssignedPC 1
do    eq_ref PRIMARY       PRIMARY 15      tt.ClientID   1
```

A coluna `rows` no resultado do `EXPLAIN` é uma suposição educada do otimizador de junção do MySQL. Verifique se os números estão muito próximos da verdade, comparando o produto `rows` com o número real de strings que a consulta retorna. Se os números forem bastante diferentes, você pode obter um desempenho melhor usando `STRAIGHT_JOIN` em sua declaração `SELECT` e tentando listar as tabelas em uma ordem diferente na cláusula `FROM`. (No entanto, `STRAIGHT_JOIN` pode impedir que índices sejam usados porque desativa transformações de junção parcial. Veja Seção 8.2.2.1, “Otimizando subconsultas, tabelas derivadas e referências de visão com transformações de junção parcial”.)

Em alguns casos, é possível executar instruções que modificam dados quando o `EXPLAIN SELECT` é usado com uma subconsulta; para mais informações, consulte a Seção 13.2.10.8, “Tabelas Derivadas”.

### 8.8.3 Formato de saída do EXPLAIN ampliado

Para as declarações `SELECT`, a declaração `EXPLAIN` produz informações extras (“extendidas”) que não fazem parte da saída `EXPLAIN`, mas podem ser visualizadas ao emitir uma declaração `SHOW WARNINGS` após `EXPLAIN`. O valor `Message` na saída `SHOW WARNINGS` exibe como o otimizador qualifica os nomes de tabela e coluna na declaração `SELECT`, como o `SELECT` parece após a aplicação das regras de reescrita e otimização, e, possivelmente, outras notas sobre o processo de otimização.

A exibição de informações estendida com uma declaração `SHOW WARNINGS` após `EXPLAIN` é produzida apenas para declarações `SELECT`. `SHOW WARNINGS` exibe um resultado vazio para outras declarações explicáveis (`DELETE`, `INSERT`, `REPLACE` e `UPDATE`).

Nota

Em versões mais antigas do MySQL, as informações extensas eram produzidas usando `EXPLAIN EXTENDED`. Essa sintaxe ainda é reconhecida para compatibilidade reversa, mas a saída extensível é agora habilitada por padrão, então a palavra-chave `EXTENDED` é supérflua e desatualizada. Seu uso resulta em um aviso; espere que ele seja removido da sintaxe `EXPLAIN` em uma versão futura do MySQL.

Aqui está um exemplo de saída `EXPLAIN` estendida:

```sql
mysql> EXPLAIN
       SELECT t1.a, t1.a IN (SELECT t2.a FROM t2) FROM t1\G
*************************** 1. row ***************************
           id: 1
  select_type: PRIMARY
        table: t1
         type: index
possible_keys: NULL
          key: PRIMARY
      key_len: 4
          ref: NULL
         rows: 4
     filtered: 100.00
        Extra: Using index
*************************** 2. row ***************************
           id: 2
  select_type: SUBQUERY
        table: t2
         type: index
possible_keys: a
          key: a
      key_len: 5
          ref: NULL
         rows: 3
     filtered: 100.00
        Extra: Using index
2 rows in set, 1 warning (0.00 sec)

mysql> SHOW WARNINGS\G
*************************** 1. row ***************************
  Level: Note
   Code: 1003
Message: /* select#1 */ select `test`.`t1`.`a` AS `a`,
         <in_optimizer>(`test`.`t1`.`a`,`test`.`t1`.`a` in
         ( <materialize> (/* select#2 */ select `test`.`t2`.`a`
         from `test`.`t2` where 1 having 1 ),
         <primary_index_lookup>(`test`.`t1`.`a` in
         <temporary table> on <auto_key>
         where ((`test`.`t1`.`a` = `materialized-subquery`.`a`))))) AS `t1.a
         IN (SELECT t2.a FROM t2)` from `test`.`t1`
1 row in set (0.00 sec)
```

Como a declaração exibida por `SHOW WARNINGS` pode conter marcadores especiais para fornecer informações sobre a reescrita de consultas ou ações do otimizador, a declaração não é necessariamente uma SQL válida e não é destinada a ser executada. A saída também pode incluir strings com os valores de `Message` que fornecem notas explicativas adicionais não-SQL sobre as ações tomadas pelo otimizador.

A lista a seguir descreve marcadores especiais que podem aparecer na saída ampliada exibida por `SHOW WARNINGS`:

* `<auto_key>`

Uma chave gerada automaticamente para uma tabela temporária.

* `<cache>(expr)`

A expressão (como uma subconsulta escalar) é executada uma vez e o valor resultante é salvo na memória para uso posterior. Para resultados que consistem em vários valores, uma tabela temporária pode ser criada e você pode ver `<temporary table>` em vez disso.

* `<exists>(query fragment)`

O predicado da subconsulta é convertido em um predicado `EXISTS` e a subconsulta é transformada para que possa ser usada juntamente com o predicado `EXISTS`.

* `<in_optimizer>(query fragment)`

Este é um objeto otimizador interno sem importância para o usuário.

* `<index_lookup>(query fragment)`

O fragmento da consulta é processado usando uma pesquisa de índice para encontrar as strings qualificadas.

* `<if>(condition, expr1, expr2)`

Se a condição for verdadeira, avalie para *`expr1`*, caso contrário, *`expr2`*.

* `<is_not_null_test>(expr)`

Um teste para verificar se a expressão não avalia `NULL`.

* `<materialize>(query fragment)`

É usada materialização de subconsulta.

* `` `subconsulta_materializada`.col_name ``

Uma referência à coluna *`col_name`* em uma tabela temporária interna materializada para armazenar o resultado da avaliação de uma subconsulta.

* `<primary_index_lookup>(query fragment)`

O fragmento da consulta é processado usando uma pesquisa de chave primária para encontrar as strings qualificadas.

* `<ref_null_helper>(expr)`

Este é um objeto otimizador interno sem importância para o usuário.

* `/* select#N */ select_stmt`

O `SELECT` está associado à string da saída não estendida `EXPLAIN` que tem um valor de `id` de *`N`*.

* `outer_tables semi join (inner_tables)`

Uma operação semijoin. *`inner_tables`* mostra as tabelas que não foram extraídas. Veja a Seção 8.2.2.1, “Otimizando subconsultas, tabelas derivadas e referências de visão com transformações semijoin”.

* `<temporary table>`

Isso representa uma tabela temporária interna criada para armazenar um resultado intermediário.

Quando algumas tabelas são do tipo `const` ou `system`, as expressões que envolvem colunas dessas tabelas são avaliadas precocemente pelo otimizador e não fazem parte da declaração exibida. No entanto, com `FORMAT=JSON`, alguns acessos à tabela `const` são exibidos como um acesso `ref` que usa um valor constante.

### 8.8.4 Obter informações sobre o plano de execução para uma conexão nomeada

Para obter o plano de execução de uma declaração explicável que esteja sendo executada em uma conexão nomeada, use esta declaração:

```sql
EXPLAIN [options] FOR CONNECTION connection_id;
```

`EXPLAIN FOR CONNECTION` retorna as informações do `EXPLAIN` que estão atualmente sendo usadas para executar uma consulta em uma conexão específica. Devido às mudanças nos dados (e nas estatísticas de suporte), pode produzir um resultado diferente ao executar `EXPLAIN` no texto equivalente da consulta. Essa diferença de comportamento pode ser útil no diagnóstico de problemas de desempenho mais transitórios. Por exemplo, se você estiver executando uma declaração em uma sessão que leva um longo tempo para ser concluída, usar `EXPLAIN FOR CONNECTION` em outra sessão pode fornecer informações úteis sobre a causa do atraso.

*`connection_id`* é o identificador de conexão, obtido a partir da tabela `INFORMATION_SCHEMA` `PROCESSLIST` ou da declaração `SHOW PROCESSLIST`. Se você tiver o privilégio `PROCESS`, pode especificar o identificador para qualquer conexão. Caso contrário, pode especificar o identificador apenas para suas próprias conexões.

Se a conexão nomeada não estiver executando uma declaração, o resultado é vazio. Caso contrário, `EXPLAIN FOR CONNECTION` se aplica apenas se a declaração sendo executada na conexão nomeada for explicável. Isso inclui `SELECT`, `DELETE`, `INSERT`, `REPLACE` e `UPDATE`. (No entanto, `EXPLAIN FOR CONNECTION` não funciona para declarações preparadas, mesmo que sejam declarações preparadas desses tipos.)

Se a conexão nomeada estiver executando uma declaração explicável, a saída é o que você obteria ao usar `EXPLAIN` na própria declaração.

Se a conexão nomeada estiver executando uma declaração que não é explicável, um erro ocorrerá. Por exemplo, você não pode nomear o identificador de conexão para sua sessão atual porque `EXPLAIN` não é explicável:

```sql
mysql> SELECT CONNECTION_ID();
+-----------------+
| CONNECTION_ID() |
+-----------------+
|             373 |
+-----------------+
1 row in set (0.00 sec)

mysql> EXPLAIN FOR CONNECTION 373;
ERROR 1889 (HY000): EXPLAIN FOR CONNECTION command is supported
only for SELECT/UPDATE/INSERT/DELETE/REPLACE
```

A variável de status `Com_explain_other` indica o número de declarações `EXPLAIN FOR CONNECTION` executadas.

### 8.8.5 Estimativa do desempenho da consulta

Na maioria dos casos, você pode estimar o desempenho da consulta contando os acessos ao disco. Para tabelas pequenas, geralmente é possível encontrar uma string em um único acesso ao disco (porque o índice provavelmente está em cache). Para tabelas maiores, você pode estimar que, usando índices de árvore B, você precisa desses acessos para encontrar uma string: `log(row_count) / log(index_block_length / 3 * 2 / (index_length + data_pointer_length)) + 1`.

Em MySQL, um bloco de índice geralmente é de 1.024 bytes e o ponteiro de dados geralmente é de quatro bytes. Para uma tabela de 500.000 strings com um comprimento do valor da chave de três bytes (o tamanho de `MEDIUMINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT)), a fórmula indica que `log(500,000)/log(1024/3*2/(3+4)) + 1` = `4` busca.

Esse índice exigiria o armazenamento de cerca de 500.000 * 7 * 3/2 = 5,2 MB (assumindo um típico índice de taxa de preenchimento de buffer de 2/3), então você provavelmente tem grande parte do índice na memória e, portanto, precisa de apenas uma ou duas chamadas para ler dados para encontrar a string.

Para escrever, no entanto, você precisa de quatro solicitações de busca para encontrar onde colocar um novo valor de índice e, normalmente, duas buscas para atualizar o índice e escrever a string.

A discussão anterior não significa que o desempenho da sua aplicação se degenere lentamente por meio do log *`N`*. Enquanto tudo estiver em cache pelo sistema operacional ou pelo servidor MySQL, as coisas se tornam apenas marginalmente mais lentas à medida que a tabela cresce. Depois que os dados se tornam grandes demais para serem cacheados, as coisas começam a se tornar muito mais lentas até que suas aplicações sejam limitadas apenas por buscas em disco (que aumentam por meio do log *`N`). Para evitar isso, aumente o tamanho da cache de chave à medida que os dados crescem. Para as tabelas `MyISAM`, o tamanho da cache de chave é controlado pela variável de sistema `key_buffer_size`. Veja a Seção 5.1.1, “Configurando o servidor”.