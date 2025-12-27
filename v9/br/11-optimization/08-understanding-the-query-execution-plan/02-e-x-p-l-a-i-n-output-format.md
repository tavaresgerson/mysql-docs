### 10.8.2 Formato de Saída do `EXPLAIN`

A instrução `EXPLAIN` fornece informações sobre como o MySQL executa instruções. O `EXPLAIN` funciona com as instruções `SELECT`, `DELETE`, `INSERT`, `REPLACE` e `UPDATE`.

O `EXPLAIN` retorna uma linha de informações para cada tabela usada na instrução `SELECT`. Ele lista as tabelas no resultado na ordem que o MySQL lêria enquanto processa a instrução. Isso significa que o MySQL lê uma linha da primeira tabela, depois encontra uma linha correspondente na segunda tabela, e depois na terceira tabela, e assim por diante. Quando todas as tabelas são processadas, o MySQL exibe as colunas selecionadas e retrocede pela lista de tabelas até encontrar uma tabela para a qual haja mais linhas correspondentes. A próxima linha é lida dessa tabela e o processo continua com a próxima tabela.

Nota

O MySQL Workbench tem uma capacidade de Explicação Visual que fornece uma representação visual do resultado do `EXPLAIN`. Veja o Tutorial: Usando Explicar para Melhorar o Desempenho das Consultas.

* Colunas de Saída do `EXPLAIN`
* Tipos de Conexão do `EXPLAIN`
* Informações Adicionais do `EXPLAIN`
* Interpretação do Resultado do `EXPLAIN`

#### Colunas de Saída do `EXPLAIN`

Esta seção descreve as colunas de saída produzidas pelo `EXPLAIN`. As seções seguintes fornecem informações adicionais sobre as colunas `type` e `Extra`.

Cada linha de saída do `EXPLAIN` fornece informações sobre uma tabela. Cada linha contém os valores resumidos na Tabela 10.1, “Colunas de Saída do `EXPLAIN`”, e descritos com mais detalhes a seguir na tabela. Os nomes das colunas são mostrados na primeira coluna da tabela; a segunda coluna fornece o nome da propriedade equivalente mostrado no resultado quando o `FORMAT=JSON` é usado.

**Tabela 10.1 Colunas de Saída do `EXPLAIN`**

<table summary="Colunas de saída produzidas pelo comando EXPLAIN.">
<col style="width: 25%"/><col style="width: 25%"/><col style="width: 50%"/>
<thead><tr>
<th scope="col">Coluna</th>
<th scope="col">Nome JSON</th>
<th scope="col">Significado</th>
</tr></thead><tbody>
<tr>
<th scope="row"><a class="link" href="explain-output.html#explain_id"><code class="literal">id</code></a></th>
<td><code class="literal">select_id</code></td>
<td>O identificador <code class="literal">SELECT</code></td>
</tr>
<tr>
<th scope="row"><a class="link" href="explain-output.html#explain_select_type"><code class="literal">select_type</code></a></th>
<td>Nenhum</td>
<td>O tipo de <code class="literal">SELECT</code></td>
</tr>
<tr>
<th scope="row"><a class="link" href="explain-output.html#explain_table"><code class="literal">table</code></a></th>
<td><code class="literal">table_name</code></td>
<td>A tabela para a linha de saída</td>
</tr>
<tr>
<th scope="row"><a class="link" href="explain-output.html#explain_partitions"><code class="literal">partitions</code></a></th>
<td><code class="literal">partitions</code></td>
<td>As partições correspondentes</td>
</tr>
<tr>
<th scope="row"><a class="link" href="explain-output.html#explain_type"><code class="literal">type</code></a></th>
<td><code class="literal">access_type</code></td>
<td>O tipo de junção</td>
</tr>
<tr>
<th scope="row"><a class="link" href="explain-output.html#explain_possible_keys"><code class="literal">possible_keys</code></a></th>
<td><code class="literal">possible_keys</code></td>
<td>Os índices possíveis para escolha</td>
</tr>
<tr>
<th scope="row"><a class="link" href="explain-output.html#explain_key"><code class="literal">key</code></a></th>
<td><code class="literal">key</code></td>
<td>O índice realmente escolhido</td>
</tr>
<tr>
<th scope="row"><a class="link" href="explain-output.html#explain_key_len"><code class="literal">key_len</code></a></th>
<td><code class="literal">key_length</code></td>
<td>O comprimento do índice escolhido</td>
</tr>
<tr>
<th scope="row"><a class="link" href="explain-output.html#explain_ref"><code class="literal">ref</code></a></th>
<td><code class="literal">ref</code></td>
<td>As colunas comparadas ao índice</td>
</tr>
<tr>
<th scope="row"><a class="link" href="explain-output.html#explain_rows"><code class="literal">rows</code></a></th>
<td><code class="literal">rows</code></td>
<td>Estimativa de linhas a serem examinadas</td>
</tr>
<tr>
<th scope="row"><a class="link" href="explain-output.html#explain_filtered"><code class="literal">filtered</code></a></th>
<td><code class="literal">filtered</code></td>
<td>Porcentagem de linhas filtradas pela condição da tabela</td>
</tr>
<tr>
<th scope="row"><a class="link" href="explain-output.html#explain_extra"><code class="literal">Extra</code></a></th>
<td>Nenhum</td>
<td>Informações adicionais</td>
</tr>
</tbody></table>

Observação

Propriedades JSON que são `NULL` não são exibidas na saída `EXPLAIN` formatada em JSON.

* `id` (nome JSON: `select_id`)

  O identificador `SELECT`. Este é o número sequencial do `SELECT` dentro da consulta. O valor pode ser `NULL` se a linha se referir ao resultado da união de outras linhas. Neste caso, a coluna `table` exibe um valor como `<unionM,N>` para indicar que a linha se refere à união das linhas com valores de `id` de *`M`* e *`N`*.

* `select_type` (nome JSON: nenhum)

  O tipo de `SELECT`, que pode ser qualquer um dos mostrados na tabela a seguir. Uma saída `EXPLAIN` formatada em JSON expõe o tipo de `SELECT` como uma propriedade de um `query_block`, a menos que seja `SIMPLE` ou `PRIMARY`. Os nomes JSON (quando aplicável) também são mostrados na tabela.

<table summary="valores de `select_type` e o significado de cada valor."><col style="width: 25%"/><col style="width: 25%"/><col style="width: 50%"/><thead><tr> <th scope="col"><code class="literal">select_type</code> Valor</th> <th scope="col">Nome JSON</th> <th scope="col">Significado</th> </tr></thead><tbody><tr> <th scope="row"><code class="literal">SIMPLE</code></th> <td>Nenhum</td> <td>Simples <a class="link" href="select.html" title="15.2.13 Instrução SELECT"><code class="literal">SELECT</code></a> (sem usar <a class="link" href="union.html" title="15.2.18 Cláusula UNION"><code class="literal">UNION</code></a> ou subconsultas)</td> </tr><tr> <th scope="row"><code class="literal">PRIMARY</code></th> <td>Nenhum</td> <td>Consulta externa <a class="link" href="select.html" title="15.2.13 Instrução SELECT"><code class="literal">SELECT</code></a></td> </tr><tr> <th scope="row"><a class="link" href="union.html" title="15.2.18 Cláusula UNION"><code class="literal">UNION</code></a></th> <td>Nenhum</td> <td>Segunda ou subsequente <a class="link" href="select.html" title="15.2.13 Instrução SELECT"><code class="literal">SELECT</code></a> em uma <a class="link" href="union.html" title="15.2.18 Cláusula UNION"><code class="literal">UNION</code></a></td> </tr><tr> <th scope="row"><code class="literal">DEPENDENT UNION</code></th> <td><code class="literal">dependente</code> (<code class="literal">true</code>)</td> <td>Segunda ou subsequente <a class="link" href="select.html" title="15.2.13 Instrução SELECT"><code class="literal">SELECT</code></a> em uma <a class="link" href="union.html" title="15.2.18 Cláusula UNION"><code class="literal">UNION</code></a>, dependente da consulta externa</td> </tr><tr> <th scope="row"><code class="literal">UNION RESULT</code></th> <td><code class="literal">union_result</code></td> <td>Resultado de uma <a class="link" href="union.html" title="15.2.18 Cláusula UNION"><code class="literal">UNION</code></a>.</td> </tr><tr> <th scope="row"><a class="link" href="optimizer-hints.html#optimizer-hints-subquery" title="Dicas de otimização de subconsultas"><code class="literal">SUBQUERY</code></a></th> <td>Nenhum</td> <td>Primeira <a class="link" href="select.html" title="15.2.13 Instrução SELECT"><code class="literal">SELECT</code></a> em subconsulta</td> </tr><tr> <th scope="row"><code class="literal">DEPENDENT SUBQUERY</code></th> <td><code class="literal">dependente</code> (<code class="literal">true</code>)</td> <td>Primeira <a class="link" href="select.html" title="15.2.13 Instrução SELECT"><code class="literal">SELECT</code></a> em subconsulta, dependente da consulta externa</td> </tr><tr> <th scope="row"><code class="literal">DERIVED</code></th> <td>Nenhum</td> <td>Tabela derivada</td> </tr><tr> <th scope="row"><code class="literal">DEPENDENT DERIVED</code></th> <td><code class="literal">dependente</code> (<code class="literal">true</code>)</td> <td>Tabela derivada dependente de outra tabela</td> </tr><tr> <th scope="row"><code class="literal">MATERIALIZED</code></th> <td><code class="literal">materialized_from_subquery</code></td> <td>Tabela materializada a partir de subconsulta</td> </tr><tr> <th scope="row"><code class="literal">UNCACHEABLE SUBQUERY</code></th> <td><code class="literal">cacheable</code> (<code class="literal">false</code>)</td> <td>Subconsulta que não pode ser cacheada e deve ser reavaliada para cada linha da consulta externa</td> </tr><tr> <th scope="row"><code class="literal">UNCACHEABLE UNION</code></th> <td><code class="literal">cacheable</code> (<code class="literal">false</code>)</td> <td>A segunda

`DEPENDENT` geralmente indica o uso de uma subconsulta correlacionada. Veja a Seção 15.2.15.7, “Subconsultas Correlacionadas”.

A avaliação de `SUBQUERY DEPENDENT` difere da avaliação de `SUBQUERY NÃO CACHEÁVEL`. Para `SUBQUERY DEPENDENT`, a subconsulta é reavaliada apenas uma vez para cada conjunto de valores diferentes das variáveis de seu contexto externo. Para `SUBQUERY NÃO CACHEÁVEL`, a subconsulta é reavaliada para cada linha do contexto externo.

Quando você especifica `FORMAT=JSON` com `EXPLAIN`, a saída não tem uma única propriedade diretamente equivalente a `select_type`; a propriedade `query_block` corresponde a um `SELECT` específico. Propriedades equivalentes à maioria dos tipos de subconsulta `SELECT` mostrados anteriormente estão disponíveis (um exemplo é `materialized_from_subquery` para `MATERIALIZED`), e são exibidas quando apropriado. Não há equivalentes JSON para `SIMPLE` ou `PRIMARY`.

O valor `select_type` para instruções que não são `SELECT` exibe o tipo da instrução para as tabelas afetadas. Por exemplo, `select_type` é `DELETE` para instruções `DELETE`.

* `table` (nome JSON: `table_name`)

  O nome da tabela a qual a linha de saída se refere. Isso também pode ser um dos seguintes valores:

  + `<unionM,N>`: A linha se refere à união das linhas com valores de `id` de *`M`* e *`N`*.

  + `<derivedN>`: A linha se refere ao resultado da tabela derivada para a linha com um valor de `id` de *`N`*. Uma tabela derivada pode resultar, por exemplo, de uma subconsulta na cláusula `FROM`.

  + `<subqueryN>`: A linha se refere ao resultado de uma subconsulta materializada para a linha com um valor de `id` de *`N`*. Veja a Seção 10.2.2.2, “Otimizando Subconsultas com Materialização”.

* `partitions` (nome JSON: `partitions`)

As partições das quais os registros seriam correspondidos pela consulta. O valor é `NULL` para tabelas não particionadas. Veja a Seção 26.3.5, “Obtendo Informações Sobre Partições”.

* `type` (nome JSON: `access_type`)

  O tipo de junção. Para descrições dos diferentes tipos, veja os Tipos de Junção `EXPLAIN`.

* `possible_keys` (nome JSON: `possible_keys`)

  A coluna `possible_keys` indica os índices a partir dos quais o MySQL pode escolher para encontrar as linhas nesta tabela. Note que essa coluna é totalmente independente da ordem das tabelas conforme exibida na saída do `EXPLAIN`. Isso significa que algumas das chaves em `possible_keys` podem não ser utilizáveis na prática com a ordem de geração da tabela.

  Se essa coluna for `NULL` (ou indefinida na saída formatada em JSON), não há índices relevantes. Nesse caso, você pode ser capaz de melhorar o desempenho da sua consulta examinando a cláusula `WHERE` para verificar se ela se refere a alguma coluna ou colunas que seriam adequadas para indexação. Se for o caso, crie um índice apropriado e verifique a consulta com `EXPLAIN` novamente. Veja a Seção 15.1.11, “Instrução ALTER TABLE”.

  Para ver quais índices uma tabela tem, use `SHOW INDEX FROM tbl_name`.

* `key` (nome JSON: `key`)

  A coluna `key` indica a chave (índice) que o MySQL realmente decidiu usar. Se o MySQL decidir usar um dos índices `possible_keys` para buscar linhas, esse índice é listado como o valor da chave.

É possível que `key` nomeie um índice que não está presente no valor `possible_keys`. Isso pode acontecer se nenhum dos índices `possible_keys` for adequado para pesquisar linhas, mas todas as colunas selecionadas pela consulta forem colunas de algum outro índice. Ou seja, o índice nomeado cobre as colunas selecionadas, então, embora não seja usado para determinar quais linhas serão recuperadas, uma varredura de índice é mais eficiente do que uma varredura de linha de dados.

Para `InnoDB`, um índice secundário pode cobrir as colunas selecionadas mesmo que a consulta também selecione a chave primária, porque o `InnoDB` armazena o valor da chave primária com cada índice secundário. Se `key` for `NULL`, o MySQL não encontrou nenhum índice para usar para executar a consulta de forma mais eficiente.

Para forçar o MySQL a usar ou ignorar um índice listado na coluna `possible_keys`, use `FORCE INDEX`, `USE INDEX` ou `IGNORE INDEX` na sua consulta. Veja a Seção 10.9.4, “Dicas de índice”.

Para tabelas `MyISAM`, executar `ANALYZE TABLE` ajuda o otimizador a escolher índices melhores. Para tabelas `MyISAM`, **myisamchk --analyze** faz o mesmo. Veja a Seção 15.7.3.1, “Instrução ANALYZE TABLE”, e a Seção 9.6, “Manutenção e recuperação de falhas de tabelas MyISAM”.

* `key_len` (nome JSON: `key_length`)

A coluna `key_len` indica o comprimento da chave que o MySQL decidiu usar. O valor de `key_len` permite determinar quantas partes de uma chave múltipla o MySQL realmente usa. Se a coluna `key` disser `NULL`, a coluna `key_len` também diz `NULL`.

Devido ao formato de armazenamento da chave, o comprimento da chave é um maior para uma coluna que pode ser `NULL` do que para uma coluna `NOT NULL`.

Se o valor for `func`, o valor usado é o resultado de alguma função. Para ver qual função, use `SHOW WARNINGS` após `EXPLAIN` para ver a saída `EXPLAIN` estendida. A função pode ser, na verdade, um operador, como um operador aritmético.

* `rows` (nome JSON: `rows`)

  A coluna `rows` indica o número de linhas que o MySQL acredita que deve examinar para executar a consulta.

  Para tabelas `InnoDB`, esse número é uma estimativa e nem sempre é exato.

* `filtered` (nome JSON: `filtered`)

  A coluna `filtered` indica uma porcentagem estimada de linhas da tabela que são filtradas pela condição da tabela. O valor máximo é 100, o que significa que nenhuma filtragem de linhas ocorreu. Valores que diminuem de 100 indicam quantidades crescentes de filtragem. `rows` mostra o número estimado de linhas examinadas e `rows` × `filtered` mostra o número de linhas que são unidas com a tabela seguinte. Por exemplo, se `rows` é 1000 e `filtered` é 50,00 (50%), o número de linhas a serem unidas com a tabela seguinte é 1000 × 50% = 500.

* `Extra` (nome JSON: `none`)

  Esta coluna contém informações adicionais sobre como o MySQL resolve a consulta. Para descrições dos diferentes valores, consulte `EXPLAIN` Informações Extras.

  Não há uma única propriedade JSON correspondente à coluna `Extra`; no entanto, os valores que podem ocorrer nesta coluna são exibidos como propriedades JSON ou como o texto da propriedade `message`.

#### Tipos de Conexão EXPLAIN

A coluna `type` da saída `EXPLAIN` descreve como as tabelas são unidas. Na saída formatada em JSON, esses são encontrados como valores da propriedade `access_type`. A lista seguinte descreve os tipos de conexão, ordenados do melhor tipo para o pior:

* `system`

  A tabela tem apenas uma linha (= tabela `const`). Este é um caso especial do tipo de conexão `const`.

* `const`

  A tabela tem, no máximo, uma linha correspondente, que é lida no início da consulta. Como há apenas uma linha, os valores da coluna dessa linha podem ser considerados constantes pelo resto do otimizador. As tabelas `const` são muito rápidas porque são lidas apenas uma vez.

  `const` é usado quando você compara todas as partes de um índice `PRIMARY KEY` ou `UNIQUE` com valores constantes. Nas seguintes consultas, *`tbl_name`* pode ser usado como uma tabela `const`:

  ```
  SELECT * FROM tbl_name WHERE primary_key=1;

  SELECT * FROM tbl_name
    WHERE primary_key_part1=1 AND primary_key_part2=2;
  ```
* `eq_ref`

  Uma linha é lida dessa tabela para cada combinação de linhas das tabelas anteriores. Exceto pelos tipos `system` e `const`, esse é o melhor tipo de junção possível. Ele é usado quando todas as partes de um índice são usadas pela junção e o índice é um índice `PRIMARY KEY` ou `UNIQUE NOT NULL`.

  `eq_ref` pode ser usado para colunas indexadas que são comparadas usando o operador `=` . O valor da comparação pode ser um valor constante ou uma expressão que usa colunas de tabelas que são lidas antes dessa tabela. Nos seguintes exemplos, o MySQL pode usar uma junção `eq_ref` para processar *`ref_table`*:

  ```
  SELECT * FROM ref_table,other_table
    WHERE ref_table.key_column=other_table.column;

  SELECT * FROM ref_table,other_table
    WHERE ref_table.key_column_part1=other_table.column
    AND ref_table.key_column_part2=1;
  ```
* `ref`

  Todas as linhas com valores de índice correspondentes são lidas dessa tabela para cada combinação de linhas das tabelas anteriores. `ref` é usado se a junção usar apenas um prefixo da esquerda da chave ou se a chave não for um índice `PRIMARY KEY` ou `UNIQUE` (em outras palavras, se a junção não puder selecionar uma única linha com base no valor da chave). Se a chave usada corresponder a apenas algumas linhas, esse é um bom tipo de junção.

  `ref` pode ser usado para colunas indexadas que são comparadas usando os operadores `=` ou `=>`. Nos seguintes exemplos, o MySQL pode usar uma junção `ref` para processar *`ref_table`*:

  ```
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

Este tipo de junção é semelhante ao `ref`, mas com a adição de que o MySQL realiza uma busca adicional por linhas que contêm valores `NULL`. Essa otimização do tipo de junção é usada com mais frequência para resolver subconsultas. Nos exemplos seguintes, o MySQL pode usar uma junção `ref_or_null` para processar *`ref_table`*:

```
  SELECT * FROM ref_table
    WHERE key_column=expr OR key_column IS NULL;
  ```

Veja a Seção 10.2.1.15, “Otimização IS NULL”.

* `index_merge`

  Este tipo de junção indica que a otimização de Merge de Índice é usada. Neste caso, a coluna `key` na linha de saída contém uma lista de índices usados, e `key_len` contém uma lista das partes de chave mais longas para os índices usados. Para mais informações, consulte a Seção 10.2.1.3, “Otimização de Merge de Índice”.

* `unique_subquery`

  Este tipo substitui `eq_ref` para algumas subconsultas `IN` da seguinte forma:

  ```
  value IN (SELECT primary_key FROM single_table WHERE some_expr)
  ```

  `unique_subquery` é apenas uma função de busca de índice que substitui completamente a subconsulta para melhor eficiência.

* `index_subquery`

  Este tipo de junção é semelhante a `unique_subquery`. Ele substitui subconsultas `IN`, mas funciona para índices não únicos em subconsultas da seguinte forma:

  ```
  value IN (SELECT key_column FROM single_table WHERE some_expr)
  ```

* `range`

  Apenas as linhas que estão em um determinado intervalo são recuperadas, usando um índice para selecionar as linhas. A coluna `key` na linha de saída indica qual índice é usado. `key_len` contém a parte de chave mais longa que foi usada. A coluna `ref` é `NULL` para este tipo.

  `range` pode ser usado quando uma coluna de chave é comparada a uma constante usando qualquer um dos operadores `=`, `<>`, `>`, `>=`, `<`, `<=`, `IS NULL`, `<=>`, `BETWEEN`, `LIKE` ou `IN()`:

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

* `index`

  O tipo de junção `index` é o mesmo que `ALL`, exceto que a árvore de índices é percorrida. Isso ocorre de duas maneiras:

+ Se o índice for um índice de cobertura para as consultas e puder ser usado para satisfazer todos os dados necessários da tabela, apenas a árvore do índice é percorrida. Nesse caso, a coluna `Extra` diz `Usando índice`. Um varredura apenas com índice geralmente é mais rápida do que `ALL` porque o tamanho do índice geralmente é menor que os dados da tabela.

+ Uma varredura completa da tabela é realizada usando leituras do índice para procurar linhas de dados em ordem de índice. `Uses index` não aparece na coluna `Extra`.

+ O MySQL pode usar esse tipo de junção quando a consulta usa apenas colunas que fazem parte de um único índice.

* `ALL`

+ Uma varredura completa da tabela é feita para cada combinação de linhas das tabelas anteriores. Isso normalmente não é bom se a tabela for a primeira tabela não marcada como `const`, e geralmente é *muito* ruim em todos os outros casos. Normalmente, você pode evitar `ALL` adicionando índices que permitem a recuperação de linhas da tabela com base em valores constantes ou valores de coluna de tabelas anteriores.

#### Informações Adicionais EXPLAIN

A coluna `Extra` da saída `EXPLAIN` contém informações adicionais sobre como o MySQL resolve a consulta. A lista a seguir explica os valores que podem aparecer nesta coluna. Cada item também indica para a saída formatada em JSON qual propriedade exibe o valor `Extra`. Para alguns desses, há uma propriedade específica. Os outros são exibidos como o texto da propriedade `message`.

Se você deseja que suas consultas sejam tão rápidas quanto possível, fique atento aos valores da coluna `Extra` de `Using filesort` e `Using temporary`, ou, na saída `EXPLAIN` formatada em JSON, para as propriedades `using_filesort` e `using_temporary_table` iguais a `true`.

* `Varredura de índice reversa` (JSON: `backward_index_scan`)

O otimizador pode usar um índice descendente em uma tabela `InnoDB`. Exibido junto com `Usando índice`. Para mais informações, consulte a Seção 10.3.13, “Índices descendentes”.

* `Join@1 empurrado como filho de 'tabela'` (JSON: `message` texto)

  Esta tabela é referenciada como filho de *`tabela`* em um join que pode ser empurrado para o kernel NDB. Aplica-se apenas no NDB Cluster, quando os joins empurrados estão habilitados. Veja a descrição da variável de sistema `ndb_join_pushdown` para mais informações e exemplos.

* `const linha não encontrada` (propriedade JSON: `const_row_not_found`)

  Para uma consulta como `SELECT ... FROM tbl_name`, a tabela estava vazia.

* `Excluindo todas as linhas` (propriedade JSON: `message`)

  Para `DELETE`, alguns motores de armazenamento (como `MyISAM`) suportam um método de manipulador que remove todas as linhas da tabela de maneira simples e rápida. Este valor `Extra` é exibido se o motor usar essa otimização.

* `Distinct` (propriedade JSON: `distinct`)

  O MySQL está procurando por valores distintos, então ele para de procurar mais linhas para a combinação de linha atual após encontrar a primeira linha correspondente.

* `FirstMatch(tbl_name)` (propriedade JSON: `first_match`)

  A estratégia de atalho do join semijoin FirstMatch é usada para *`tbl_name`*.

* `Scan completo em chave NULL` (propriedade JSON: `message`)

  Isso ocorre para a otimização de subconsultas como uma estratégia de fallback quando o otimizador não pode usar um método de acesso de busca por índice.

* `Impossible HAVING` (propriedade JSON: `message`)

  A cláusula `HAVING` é sempre falsa e não pode selecionar nenhuma linha.

* `Impossible WHERE` (propriedade JSON: `message`)

  A cláusula `WHERE` é sempre falsa e não pode selecionar nenhuma linha.

* `Impossible WHERE notado após a leitura de tabelas constantes` (propriedade JSON: `message`)

O MySQL leu todas as tabelas `const` (e `system`) e percebeu que a cláusula `WHERE` está sempre falsa.

* `LooseScan(m..n)` (propriedade JSON: `message`)

  A estratégia de LooseScan semijoin é usada. *`m`* e *`n`* são números de peças-chave.

* `Nenhuma linha correspondente` (propriedade JSON: `message`)

  Nenhuma linha satisfaz a condição para uma consulta como `SELECT MIN(...) FROM ... WHERE condição`.

* `Nenhuma linha correspondente na tabela const` (propriedade JSON: `message`)

  Para uma consulta com uma junção, havia uma tabela vazia ou uma tabela sem linhas que satisfaçam uma condição de índice único.

* `Nenhuma linha correspondente após a poda de partição` (propriedade JSON: `message`)

  Para `DELETE` ou `UPDATE`, o otimizador não encontrou nada para excluir ou atualizar após a poda de partição. Isso é semelhante ao `Impossible WHERE` para declarações `SELECT`.

* `Nenhuma tabela usada` (propriedade JSON: `message`)

  A consulta não tem uma cláusula `FROM`, ou tem uma cláusula `FROM DUAL`.

  Para declarações `INSERT` ou `REPLACE`, o `EXPLAIN` exibe esse valor quando não há uma parte `SELECT`. Por exemplo, aparece para `EXPLAIN INSERT INTO t VALUES(10)` porque é equivalente a `EXPLAIN INSERT INTO t SELECT 10 FROM DUAL`.

* `Not exists` (propriedade JSON: `message`)

  O MySQL conseguiu otimizar uma `LEFT JOIN` na consulta e não examina mais linhas nesta tabela para a combinação de linha anterior após encontrar uma linha que corresponda aos critérios da `LEFT JOIN`. Aqui está um exemplo do tipo de consulta que pode ser otimizado dessa maneira:

  ```
  SELECT * FROM t1 LEFT JOIN t2 ON t1.id=t2.id
    WHERE t2.id IS NULL;
  ```

Suponha que `t2.id` seja definido como `NOT NULL`. Nesse caso, o MySQL examina `t1` e busca as linhas em `t2` usando os valores de `t1.id`. Se o MySQL encontrar uma linha correspondente em `t2`, sabe que `t2.id` nunca pode ser `NULL` e não examina o restante das linhas em `t2` que têm o mesmo valor de `id`. Em outras palavras, para cada linha em `t1`, o MySQL precisa fazer apenas uma única busca em `t2`, independentemente de quantas linhas realmente corresponderem em `t2`.

Isso também pode indicar que uma condição `WHERE` na forma `NOT IN (subquery)` ou `NOT EXISTS (subquery)` foi transformada internamente em um antijoin. Isso remove a subquery e traz suas tabelas para o plano da consulta mais alta, proporcionando um planejamento de custo melhorado. Ao combinar semijoins e antijoins, o otimizador pode reorganizar as tabelas no plano de execução de forma mais livre, resultando, em alguns casos, em um plano mais rápido.

Você pode ver quando uma transformação de antijoin é realizada para uma consulta específica verificando a coluna `Message` do `SHOW WARNINGS` após a execução de `EXPLAIN`, ou na saída de `EXPLAIN FORMAT=TREE`.

Nota

Um antijoin é o complemento de um semijoin `table_a JOIN table_b ON condition`. O antijoin retorna todas as linhas de *`table_a`* para as quais não há *nenhuma* linha em *`table_b`* que corresponda a *`condition`*.

* `O plano ainda não está pronto` (propriedade JSON: none)

Este valor ocorre com `EXPLAIN FOR CONNECTION` quando o otimizador não terminou de criar o plano de execução para a instrução que está sendo executada na conexão nomeada. Se a saída do plano de execução contiver várias linhas, qualquer ou todas elas podem ter este valor `Extra`, dependendo do progresso do otimizador na determinação do plano de execução completo.

* `Range checked for each record (index map: N)` (propriedade JSON: `message`)

O MySQL não encontrou um bom índice para usar, mas descobriu que alguns índices podem ser usados depois que os valores das colunas das tabelas anteriores são conhecidos. Para cada combinação de linha nas tabelas anteriores, o MySQL verifica se é possível usar um método de acesso `range` ou `index_merge` para recuperar as linhas. Isso não é muito rápido, mas é mais rápido do que realizar uma junção sem nenhum índice. Os critérios de aplicabilidade são descritos na Seção 10.2.1.2, “Otimização de Range”, e na Seção 10.2.1.3, “Otimização de Merge de Índices”, com a exceção de que todos os valores das colunas da tabela anterior são conhecidos e considerados constantes.

Os índices são numerados a partir de 1, na mesma ordem que é exibida pelo `SHOW INDEX` para a tabela. O valor do mapa de índice *`N`* é um valor de bitmask que indica quais índices são candidatos. Por exemplo, um valor de `0x19` (binário 11001) significa que os índices 1, 4 e 5 são considerados.

* `Recursive` (propriedade JSON: `recursive`)

  Isso indica que a linha se aplica à parte `SELECT` recursiva de uma expressão comum de tabela recursiva. Veja a Seção 15.2.20, “Com (Expressões de Tabela Comuns”)”).

* `Rematerialize` (propriedade JSON: `rematerialize`)

  `Rematerialize (X,...)` é exibido na linha `EXPLAIN` para a tabela `T`, onde `X` é qualquer tabela derivada lateral cuja rematerialização é acionada quando uma nova linha de `T` é lida. Por exemplo:

  ```
  SELECT
    ...
  FROM
    t,
    LATERAL (derived table that refers to t) AS dt
  ...
  ```

  O conteúdo da tabela derivada é rematerializado para atualizá-lo a cada vez que uma nova linha de `t` é processada pela consulta principal.

* `Scanned N databases` (propriedade JSON: `message`)

  Isso indica quantos escaneamentos de diretório o servidor realiza ao processar uma consulta para tabelas do `INFORMATION_SCHEMA`, conforme descrito na Seção 10.2.3, “Otimizando Consultas do INFORMATION\_SCHEMA”. O valor de *`N`* pode ser 0, 1 ou `all`.

* "Selecionar tabelas otimizadas" (propriedade JSON: `mensagem`)

  O otimizador determinou 1) que, no máximo, uma linha deve ser retornada e 2) que, para produzir essa linha, um conjunto determinado de linhas deve ser lido. Quando as linhas a serem lidas podem ser lidas durante a fase de otimização (por exemplo, lendo linhas de índice), não há necessidade de ler nenhuma tabela durante a execução da consulta.

  A primeira condição é cumprida quando a consulta é agrupada implicitamente (contém uma função agregada, mas sem a cláusula `GROUP BY`). A segunda condição é cumprida quando uma consulta de busca por linha é realizada por índice usado. O número de índices lidos determina o número de linhas a serem lidas.

  Considere a seguinte consulta agrupada implicitamente:

  ```
  SELECT MIN(c1), MIN(c2) FROM t1;
  ```

  Suponha que `MIN(c1)` possa ser recuperado lendo uma linha de índice e `MIN(c2)` possa ser recuperado lendo uma linha de uma linha diferente. Ou seja, para cada coluna `c1` e `c2`, existe um índice onde a coluna é a primeira coluna do índice. Neste caso, uma linha é retornada, produzida pela leitura de duas linhas determinadas.

  Este valor `Extra` não ocorre se as linhas a serem lidas não forem determinadas. Considere esta consulta:

  ```
  SELECT MIN(c2) FROM t1 WHERE c1 <= 10;
  ```

  Suponha que `(c1, c2)` seja um índice de cobertura. Usando este índice, todas as linhas com `c1 <= 10` devem ser varridas para encontrar o valor mínimo de `c2`. Em contraste, considere esta consulta:

  ```
  SELECT MIN(c2) FROM t1 WHERE c1 = 10;
  ```

  Neste caso, a primeira linha de índice com `c1 = 10` contém o valor mínimo de `c2`. Apenas uma linha deve ser lida para produzir a linha retornada.

Para motores de armazenamento que mantêm um contagem exata de linhas por tabela (como `MyISAM`, mas não `InnoDB`), este valor `Extra` pode ocorrer para consultas `COUNT(*)` para as quais a cláusula `WHERE` está ausente ou sempre verdadeira e não há cláusula `GROUP BY`. (Esta é uma instância de uma consulta implicitamente agrupada onde o motor de armazenamento influencia se um número determinado de linhas pode ser lido.)

* `Skip_open_table`, `Open_frm_only`, `Open_full_table` (propriedade JSON: `message`)

  Esses valores indicam otimizações de abertura de arquivos que se aplicam a consultas para tabelas do `INFORMATION_SCHEMA`.

  + `Skip_open_table`: Os arquivos de tabela não precisam ser abertos. As informações já estão disponíveis no dicionário de dados.

  + `Open_frm_only`: Apenas o dicionário de dados precisa ser lido para informações de tabela.

  + `Open_full_table`: Busca de informações não otimizada. As informações de tabela precisam ser lidas do dicionário de dados e lendo arquivos de tabela.

* `Start temporary`, `End temporary` (propriedade JSON: `message`)

  Isso indica o uso de tabela temporária para a estratégia de semijoin Duplicate Weedout.

* `unique row not found` (propriedade JSON: `message`)

  Para uma consulta como `SELECT ... FROM tbl_name`, nenhuma linha satisfaz a condição para um índice `UNIQUE` ou `PRIMARY KEY` na tabela.

* `Using filesort` (propriedade JSON: `using_filesort`)

  O MySQL deve fazer uma passagem extra para descobrir como recuperar as linhas em ordem ordenada. A ordenação é feita percorrendo todas as linhas de acordo com o tipo de junção e armazenando a chave de ordenação e o ponteiro para a linha para todas as linhas que correspondem à cláusula `WHERE`. As chaves são então ordenadas e as linhas são recuperadas em ordem ordenada. Veja a Seção 10.2.1.16, “Otimização de ORDER BY”.

* `Using index` (propriedade JSON: `using_index`)

As informações da coluna são recuperadas da tabela usando apenas as informações na árvore de índice sem precisar fazer uma busca adicional para ler a linha real. Essa estratégia pode ser usada quando a consulta usa apenas colunas que fazem parte de um único índice.

Para tabelas `InnoDB` que têm um índice agrupado definido pelo usuário, esse índice pode ser usado mesmo quando `Using index` está ausente na coluna `Extra`. Esse é o caso se `type` for `index` e `key` for `PRIMARY`.

As informações sobre quaisquer índices cobertores usados são mostradas para `EXPLAIN FORMAT=TRADITIONAL` e `EXPLAIN FORMAT=JSON`. Também são mostradas para `EXPLAIN FORMAT=TREE`.

* `Condição de uso do índice` (propriedade JSON: `using_index_condition`)

As tabelas são lidas acessando tuplas de índice e testando-as primeiro para determinar se devem ler as linhas completas da tabela. Dessa forma, as informações do índice são usadas para adiar (“empurrar para baixo”) a leitura das linhas completas da tabela, a menos que seja necessário. Veja a Seção 10.2.1.6, “Otimização de Empurrar para Baixo a Condição do Índice”.

* `Usar índice para grupo por` (propriedade JSON: `using_index_for_group_by`)

Semelhante ao método de acesso à tabela `Using index`, `Usar índice para grupo por` indica que o MySQL encontrou um índice que pode ser usado para recuperar todas as colunas de uma consulta `GROUP BY` ou `DISTINCT` sem qualquer acesso adicional ao disco da tabela real. Além disso, o índice é usado da maneira mais eficiente para que, para cada grupo, apenas algumas entradas de índice sejam lidas. Para detalhes, veja a Seção 10.2.1.17, “Otimização de GROUP BY”.

* `Usar índice para varredura de desvio` (propriedade JSON: `using_index_for_skip_scan`)

Indica que o método de acesso de varredura de desvio é usado. Veja o Método de Acesso de Intervalo de Varredura de Desvio.

* `Usar buffer de junção (Loop Fechado em Bloco)`, `Usar buffer de junção (Acesso de Chave em Batelada)`, `Usar buffer de junção (join hash)` (propriedade JSON: `using_join_buffer`)

As tabelas de junções anteriores são lidas em porções no buffer de junção e, em seguida, suas linhas são usadas a partir do buffer para realizar a junção com a tabela atual. `(Loop Aninhado de Bloco)` indica o uso do algoritmo Loop Aninhado de Bloco, `(Acesso por Chave em Batelada)` indica o uso do algoritmo Acesso por Chave em Batelada e `(junção hash)` indica o uso de uma junção hash. Ou seja, as chaves da tabela na linha anterior do resultado do `EXPLAIN` são armazenadas no buffer, e as linhas correspondentes são recuperadas em lotes da tabela representada pela linha na qual `Usando buffer de junção` aparece.

Na saída formatada em JSON, o valor de `using_join_buffer` é sempre um dos valores `Block Nested Loop`, `Batched Key Access` ou `hash join`.

Para mais informações sobre junções hash, consulte a Seção 10.2.1.4, “Otimização da Junção Hash”.

Consulte Junções por Acesso por Chave em Batelada para informações sobre o algoritmo Acesso por Chave em Batelada.

* `Usando MRR` (propriedade JSON: `message`)

As tabelas são lidas usando a estratégia de otimização de leitura de múltiplos intervalos. Consulte a Seção 10.2.1.11, “Otimização de Leitura Múltiplo Intervalo”.

* `Usando sort_union(...)`, `Usando union(...)`, `Usando intersect(...)` (propriedade JSON: `message`)

Estes indicam o algoritmo específico que mostra como as consultas de varredura de índice são mescladas para o tipo de junção `index_merge`. Consulte a Seção 10.2.1.3, “Otimização de Junção de Índice”.

* `Usando temporário` (propriedade JSON: `using_temporary_table`)

Para resolver a consulta, o MySQL precisa criar uma tabela temporária para armazenar o resultado. Isso geralmente acontece se a consulta contiver cláusulas `GROUP BY` e `ORDER BY` que listam colunas de forma diferente.

* `Usando where` (propriedade JSON: `attached_condition`)

Uma cláusula `WHERE` é usada para restringir quais linhas devem ser correspondidas à próxima tabela ou enviadas ao cliente. A menos que você tenha a intenção específica de recuperar ou examinar todas as linhas da tabela, pode haver algo errado em sua consulta se o valor `Extra` não for `Using where` e o tipo de junção da tabela for `ALL` ou `index`.

`Using where` não tem um equivalente direto na saída formatada em JSON; a propriedade `attached_condition` contém qualquer condição `WHERE` usada.

* `Using where com condição empurrada` (propriedade JSON: `message`)

Este item se aplica apenas às tabelas `NDB`. Isso significa que o NDB Cluster está usando a otimização de empurrão de condição para melhorar a eficiência de uma comparação direta entre uma coluna não indexada e uma constante. Nesse caso, a condição é "empurrada" para os nós de dados do cluster e é avaliada em todos os nós de dados simultaneamente. Isso elimina a necessidade de enviar linhas não correspondentes pela rede e pode acelerar essas consultas em um fator de 5 a 10 vezes em relação aos casos em que a empurrão de condição poderia ser usada, mas não é. Para mais informações, consulte a Seção 10.2.1.5, "Otimização de Empurrão de Condição do Motor".

* `Limite zero` (propriedade JSON: `message`)

A consulta tinha uma cláusula `LIMIT 0` e não pode selecionar nenhuma linha.

#### Interpretação da Saída EXPLAIN

Você pode obter uma boa indicação de quão bom é um join tomando o produto dos valores na coluna `rows` da saída `EXPLAIN`. Isso deve dizer a você aproximadamente quantas linhas o MySQL deve examinar para executar a consulta. Se você restringir consultas com a variável de sistema `max_join_size`, esse produto de linhas também é usado para determinar quais instruções `SELECT` de múltiplas tabelas devem ser executadas e quais devem ser abortadas. Veja a Seção 7.1.1, "Configurando o Servidor".

O exemplo a seguir mostra como uma junção de múltiplas tabelas pode ser otimizada progressivamente com base nas informações fornecidas pelo `EXPLAIN`.

Suponha que você tenha a instrução `SELECT` mostrada aqui e que planeje examiná-la usando `EXPLAIN`:

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

* As colunas sendo comparadas foram declaradas da seguinte forma.

  <table summary="Nomes das tabelas, nomes das colunas e tipos de dados das colunas sendo comparadas no exemplo EXPLAIN descrito no texto anterior."><col style="width: 10%"/><col style="width: 25%"/><col style="width: 25%"/><thead><tr> <th scope="col">Tabela</th> <th scope="col">Coluna</th> <th scope="col">Tipo de Dados</th> </tr></thead><tbody><tr> <th scope="row"><code class="literal">tt</code></th> <td><code class="literal">ActualPC</code></td> <td><code class="literal">CHAR(10)</code></td> </tr><tr> <th scope="row"><code class="literal">tt</code></th> <td><code class="literal">AssignedPC</code></td> <td><code class="literal">CHAR(10)</code></td> </tr><tr> <th scope="row"><code class="literal">tt</code></th> <td><code class="literal">ClientID</code></td> <td><code class="literal">CHAR(10)</code></td> </tr><tr> <th scope="row"><code class="literal">et</code></th> <td><code class="literal">EMPLOYID</code></td> <td><code class="literal">CHAR(15)</code></td> </tr><tr> <th scope="row"><code class="literal">do</code></th> <td><code class="literal">CUSTNMBR</code></td> <td><code class="literal">CHAR(15)</code></td> </tr></tbody></table>

* As tabelas têm os seguintes índices.

<table summary="Índices para cada uma das tabelas que fazem parte do exemplo EXPLAIN descrito no texto anterior."><col style="width: 10%"/><col style="width: 40%"/><thead><tr> <th>Tabela</th> <th>Índice</th> </tr></thead><tbody><tr> <td><code class="literal">tt</code></td> <td><code class="literal">ActualPC</code></td> </tr><tr> <td><code class="literal">tt</code></td> <td><code class="literal">AssignedPC</code></td> </tr><tr> <td><code class="literal">tt</code></td> <td><code class="literal">ClientID</code></td> </tr><tr> <td><code class="literal">et</code></td> <td><code class="literal">EMPLOYID</code> (chave primária)</td> </tr><tr> <td><code class="literal">do</code></td> <td><code class="literal">CUSTNMBR</code> (chave primária)</td> </tr></tbody></table>

* Os valores de `tt.ActualPC` não estão distribuídos uniformemente.

Inicialmente, antes que qualquer otimização tenha sido realizada, a instrução `EXPLAIN` produz as seguintes informações:

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

Como `type` é `ALL` para cada tabela, essa saída indica que o MySQL está gerando um produto cartesiano de todas as tabelas; ou seja, cada combinação de linhas. Isso leva bastante tempo, porque o produto do número de linhas em cada tabela deve ser examinado. No caso em questão, esse produto é de 74 × 2135 × 74 × 3872 = 45.268.558.720 linhas. Se as tabelas fossem maiores, você pode apenas imaginar o tempo que levaria.

Um problema aqui é que o MySQL pode usar índices em colunas de forma mais eficiente se eles forem declarados com o mesmo tipo e tamanho. Neste contexto, `VARCHAR` e `CHAR` são considerados iguais se forem declarados com o mesmo tamanho. `tt.ActualPC` é declarado como `CHAR(10)` e `et.EMPLOYID` é `CHAR(15)`, então há um desalinhamento de comprimento.

Para corrigir essa disparidade entre os comprimentos das colunas, use `ALTER TABLE` para alongar `ActualPC` de 10 caracteres para 15 caracteres:

```
mysql> ALTER TABLE tt MODIFY ActualPC VARCHAR(15);
```

Agora, `tt.ActualPC` e `et.EMPLOYID` são ambos `VARCHAR(15)`. Executar a instrução `EXPLAIN` novamente produz este resultado:

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

Isso não é perfeito, mas é muito melhor: O produto dos valores das linhas é menor por um fator de 74. Esta versão executa em alguns segundos.

Uma segunda alteração pode ser feita para eliminar as discrepâncias de comprimento da coluna para as comparações `tt.AssignedPC = et_1.EMPLOYID` e `tt.ClientID = do.CUSTNMBR`:

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

Neste ponto, a consulta é otimizada quase tão bem quanto possível. O problema restante é que, por padrão, o MySQL assume que os valores na coluna `tt.ActualPC` estão distribuídos uniformemente, e isso não é o caso da tabela `tt`. Felizmente, é fácil dizer ao MySQL para analisar a distribuição da chave:

```
mysql> ANALYZE TABLE tt;
```

Com as informações adicionais sobre o índice, a junção é perfeita e `EXPLAIN` produz este resultado:

```
table type   possible_keys key     key_len ref           rows Extra
tt    ALL    AssignedPC    NULL    NULL    NULL          3872 Using
             ClientID,                                        where
             ActualPC
et    eq_ref PRIMARY       PRIMARY 15      tt.ActualPC   1
et_1  eq_ref PRIMARY       PRIMARY 15      tt.AssignedPC 1
do    eq_ref PRIMARY       PRIMARY 15      tt.ClientID   1
```

A coluna `rows` na saída de `EXPLAIN` é uma estimativa educada do otimizador de junção do MySQL. Verifique se os números estão próximos da verdade comparando o produto das linhas com o número real de linhas que a consulta retorna. Se os números estiverem bastante diferentes, você pode obter um melhor desempenho usando `STRAIGHT_JOIN` na sua instrução `SELECT` e tentando listar as tabelas em uma ordem diferente na cláusula `FROM`. (No entanto, `STRAIGHT_JOIN` pode impedir que os índices sejam usados porque desabilita as transformações de junção parcial. Veja Otimizando Predicados de Subconsultas IN e EXISTS com Transformações de Junção Parcial.)

Em alguns casos, é possível executar instruções que modificam dados quando o comando `EXPLAIN SELECT` é usado com uma subconsulta; para mais informações, consulte a Seção 15.2.15.8, “Tabelas Derivadas”.