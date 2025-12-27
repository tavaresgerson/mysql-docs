### 10.8.2 Formato de Saída `EXPLAIN`

A instrução `EXPLAIN` fornece informações sobre como o MySQL executa instruções. `EXPLAIN` funciona com instruções `SELECT`, `DELETE`, `INSERT`, `REPLACE` e `UPDATE`.

`EXPLAIN` retorna uma linha de informações para cada tabela usada na instrução `SELECT`. Ela lista as tabelas no resultado na ordem que o MySQL lêria enquanto processa a instrução. Isso significa que o MySQL lê uma linha da primeira tabela, depois encontra uma linha correspondente na segunda tabela, e depois na terceira tabela, e assim por diante. Quando todas as tabelas são processadas, o MySQL exibe as colunas selecionadas e retrocede pela lista de tabelas até encontrar uma tabela para a qual haja mais linhas correspondentes. A próxima linha é lida dessa tabela e o processo continua com a próxima tabela.

::: info Nota

O MySQL Workbench tem uma capacidade de Explicação Visual que fornece uma representação visual da saída `EXPLAIN`. Veja o Tutorial: Usando Explicar para Melhorar o Desempenho das Consultas.

:::

* Colunas de Saída `EXPLAIN`
* Tipos de Conexão `EXPLAIN`
* Informações Adicionais `EXPLAIN`
* Interpretação da Saída `EXPLAIN`

#### Colunas de Saída `EXPLAIN`

Esta seção descreve as colunas de saída produzidas por `EXPLAIN`. As seções seguintes fornecem informações adicionais sobre as colunas `type` e `Extra`.

Cada linha de saída de `EXPLAIN` fornece informações sobre uma tabela. Cada linha contém os valores resumidos na Tabela 10.1, “Colunas de Saída `EXPLAIN`”, e descritos com mais detalhes a seguir na tabela. Os nomes das colunas são mostrados na primeira coluna da tabela; a segunda coluna fornece o nome da propriedade equivalente mostrado na saída quando o `FORMAT=JSON` é usado.

**Tabela 10.1 Colunas de Saída `EXPLAIN`**

<table><thead><tr> <th>Coluna</th> <th>Nome JSON</th> <th>Significado</th> </tr></thead><tbody><tr> <th><code>id</code></th> <td><code>select_id</code></td> <th>O identificador <code>SELECT</code></th> </tr><tr> <th><code>select_type</code></th> <td>Nenhum</td> <th>O tipo de <code>SELECT</code></th> </tr><tr> <th><code>table</code></th> <td><code>table_name</code></td> <th>A tabela para a linha de saída</th> </tr><tr> <th><code>partitions</code></th> <td><code>partitions</code></td> <th>As partições correspondentes</th> </tr><tr> <th><code>type</code></th> <td><code>access_type</code></td> <th>O tipo de junção</th> </tr><tr> <th><code>possible_keys</code></th> <td><code>possible_keys</code></td> <th>Os índices possíveis para escolha</th> </tr><tr> <th><code>key</code></th> <td><code>key</code></td> <th>O índice realmente escolhido</th> </tr><tr> <th><code>key_len</code></th> <td><code>key_length</code></td> <th>O comprimento do índice escolhido</th> </tr><tr> <th><code>ref</code></th> <td><code>ref</code></td> <th>As colunas comparadas ao índice</th> </tr><tr> <th><code>rows</code></th> <td><code>rows</code></td> <th>Estimativa de linhas a serem examinadas</th> </tr><tr> <th><code>filtered</code></th> <td><code>filtered</code></td> <th>Porcentagem de linhas filtradas pela condição da tabela</th> </tr><tr> <th><code>Extra</code></th> <td>Nenhum</td> <th>Informações adicionais</th> </tr></tbody></table> ::: info Nota

Propriedades JSON que são `NULL` não são exibidas na saída formatada JSON do `EXPLAIN`.

O tipo de `SELECT`, que pode ser qualquer um dos mostrados na tabela a seguir. Um `EXPLAIN` formatado em JSON expõe o tipo `SELECT` como uma propriedade de um `query_block`, a menos que seja `SIMPLE` ou `PRIMARY`. Os nomes do JSON (quando aplicável) também são mostrados na tabela.

<table><col style="width: 25%"/><col style="width: 25%"/><col style="width: 50%"/><thead><tr> <th><code>select_type</code> Valor</th> <th>Nome JSON</th> <th>Significado</th> </tr></thead><tbody><tr> <th><code>SIMPLE</code></th> <td>Nenhum</td> <td><code>SELECT</code> simples (não usando <code>UNION</code> ou subconsultas)</td> </tr><tr> <th><code>PRIMARY</code></th> <td>Nenhum</td> <td><code>SELECT</code> mais externo</td> </tr><tr> <th><code>UNION</code></th> <td>Nenhum</td> <td>Segunda ou posterior declaração de <code>SELECT</code> em uma <code>UNION</code></td> </tr><tr> <th><code>DEPENDENT UNION</code></th> <td><code>dependent</code> (<code>true</code>)</td> <td>Segunda ou posterior declaração de <code>SELECT</code> em uma <code>UNION</code>, dependente da consulta externa</td> </tr><tr> <th><code>UNION RESULT</code></th> <td><code>union_result</code></td> <td>Resultado de uma <code>UNION</code>.</td> </tr><tr> <th><code>SUBQUERY</code></th> <td>Nenhum</td> <td>Primeiro <code>SELECT</code> em subconsulta</td> </tr><tr> <th><code>DEPENDENT SUBQUERY</code></th> <td><code>dependent</code> (<code>true</code>)</td> <td>Primeiro <code>SELECT</code> em subconsulta, dependente da consulta externa</td> </tr><tr> <th><code>DERIVED</code></th> <td>Nenhum</td> <td>Tabela derivada</td> </tr><tr> <th><code>DEPENDENT DERIVED</code></th> <td><code>dependent</code> (<code>true</code>)</td> <td>Tabela derivada dependente de outra tabela</td> </tr><tr> <th><code>MATERIALIZED</code></th> <td><code>materialized_from_subquery</code></td> <td>Subconsulta materializada</td> </tr><tr> <th><code>UNCACHEABLE SUBQUERY</code></th> <td><code>cacheable</code> (<code>false</code>)</td> <td>Subconsulta para a qual o resultado não pode ser armazenado em cache e deve ser reavaliado para cada linha da consulta externa</td> </tr><tr> <th><code>UNCACHEABLE UNION</code></th> <td><code>cacheable</code> (<code>false</code>)</td> <td>A segunda ou posterior seleção em uma <code>UNION</code> que pertence a uma subconsulta não armazenável em cache (consulte <code>SUBQUERY NÃO ARMAZENÁVEL EM CACHE</code>)</td> </tr></tbody></table>

`DEPENDENT` geralmente indica o uso de uma subconsulta correlacionada. Veja a Seção 15.2.15.7, “Subconsultas Correlacionadas”.

A avaliação de `SUBQUERY DEPENDENT` difere da avaliação de `SUBQUERY NÃO CACHEÁVEL`. Para `SUBQUERY DEPENDENT`, a subconsulta é reavaliada apenas uma vez para cada conjunto de valores diferentes das variáveis de seu contexto externo. Para `SUBQUERY NÃO CACHEÁVEL`, a subconsulta é reavaliada para cada linha do contexto externo.

Quando você especifica `FORMAT=JSON` com `EXPLAIN`, a saída não tem uma única propriedade diretamente equivalente a `select_type`; a propriedade `query_block` corresponde a um `SELECT` específico. Propriedades equivalentes à maioria dos tipos de subconsulta `SELECT` mostrados anteriormente estão disponíveis (um exemplo é `materialized_from_subquery` para `MATERIALIZED`), e são exibidas quando apropriado. Não há equivalentes JSON para `SIMPLE` ou `PRIMARY`.

O valor `select_type` para instruções que não são `SELECT` exibe o tipo da instrução para as tabelas afetadas. Por exemplo, `select_type` é `DELETE` para instruções `DELETE`.
* `table` (nome JSON: `table_name`)

O nome da tabela para a qual a linha de saída se refere. Isso também pode ser um dos seguintes valores:

+ `<unionM,N>`: A linha se refere à união das linhas com valores de `id` de *`M`* e *`N`*.
+ `<derivedN>`: A linha se refere ao resultado da tabela derivada para a linha com um valor de `id` de *`N`*. Uma tabela derivada pode resultar, por exemplo, de uma subconsulta na cláusula `FROM`.
+ `<subqueryN>`: A linha se refere ao resultado de uma subconsulta materializada para a linha com um valor de `id` de *`N`*. Veja a Seção 10.2.2.2, “Otimizando Subconsultas com Materialização”.
* `partitions` (nome JSON: `partitions`)

As partições das quais os registros seriam correspondidos pela consulta. O valor é `NULL` para tabelas não particionadas. Veja a Seção 26.3.5, “Obtendo Informações Sobre Partições”.
* `type` (nome JSON: `access_type`)

O tipo de junção. Para descrições dos diferentes tipos, consulte `EXPLAIN` Tipos de Junção.
* `possible_keys` (nome JSON: `possible_keys`)

  A coluna `possible_keys` indica os índices a partir dos quais o MySQL pode escolher para encontrar as linhas nesta tabela. Note que essa coluna é totalmente independente da ordem das tabelas conforme exibida na saída do `EXPLAIN`. Isso significa que algumas das chaves em `possible_keys` podem não ser utilizáveis na prática com a ordem gerada da tabela.

  Se essa coluna for `NULL` (ou indefinida na saída formatada em JSON), não há índices relevantes. Nesse caso, você pode ser capaz de melhorar o desempenho da sua consulta examinando a cláusula `WHERE` para verificar se ela se refere a alguma coluna ou colunas que seriam adequadas para indexação. Se for o caso, crie um índice apropriado e verifique a consulta com `EXPLAIN` novamente. Veja a Seção 15.1.9, “Instrução ALTER TABLE”.

  Para ver quais índices uma tabela tem, use `SHOW INDEX FROM tbl_name`.
* `key` (nome JSON: `key`)

  A coluna `key` indica a chave (índice) que o MySQL realmente decidiu usar. Se o MySQL decidir usar um dos índices `possible_keys` para procurar linhas, esse índice é listado como o valor da chave.

  É possível que `key` nomeie um índice que não está presente no valor `possible_keys`. Isso pode acontecer se nenhum dos índices `possible_keys` for adequado para procurar linhas, mas todas as colunas selecionadas pela consulta são colunas de algum outro índice. Ou seja, o índice nomeado cobre as colunas selecionadas, então, embora não seja usado para determinar quais linhas serão recuperadas, uma varredura de índice é mais eficiente do que uma varredura de linha de dados.

  Para `InnoDB`, um índice secundário pode cobrir as colunas selecionadas mesmo que a consulta também selecione a chave primária, porque o `InnoDB` armazena o valor da chave primária com cada índice secundário. Se `key` for `NULL`, o MySQL não encontrou nenhum índice para usar para executar a consulta de forma mais eficiente.

Para forçar o MySQL a usar ou ignorar um índice listado na coluna `possible_keys`, use `FORCE INDEX`, `USE INDEX` ou `IGNORE INDEX` na sua consulta. Veja a Seção 10.9.4, “Dicas de índice”.

Para tabelas `MyISAM`, executar `ANALYZE TABLE` ajuda o otimizador a escolher melhores índices. Para tabelas `MyISAM`, `myisamchk --analyze` faz o mesmo. Veja a Seção 15.7.3.1, “Instrução ANALYZE TABLE”, e a Seção 9.6, “Manutenção e recuperação de falhas da tabela MyISAM”.
* `key_len` (nome JSON: `key_length`)

A coluna `key_len` indica o comprimento da chave que o MySQL decidiu usar. O valor de `key_len` permite determinar quantas partes de uma chave de múltiplos componentes o MySQL realmente usa. Se a coluna `key` diz `NULL`, a coluna `key_len` também diz `NULL`.

Devido ao formato de armazenamento da chave, o comprimento da chave é um maior para uma coluna que pode ser `NULL` do que para uma coluna `NOT NULL`.
* `ref` (nome JSON: `ref`)

A coluna `ref` mostra quais colunas ou constantes são comparadas ao índice nomeado na coluna `key` para selecionar linhas da tabela.

Se o valor for `func`, o valor usado é o resultado de alguma função. Para ver qual função, use `SHOW WARNINGS` após `EXPLAIN` para ver a saída extensamente `EXPLAIN`. A função pode ser realmente um operador, como um operador aritmético.
* `rows` (nome JSON: `rows`)

A coluna `rows` indica o número de linhas que o MySQL acredita que deve examinar para executar a consulta.

Para tabelas `InnoDB`, esse número é uma estimativa e nem sempre é exato.
* `filtered` (nome JSON: `filtered`)

A coluna `filtered` indica uma porcentagem estimada das linhas da tabela que são filtradas pela condição da tabela. O valor máximo é 100, o que significa que nenhuma filtragem de linhas ocorreu. Valores que diminuem de 100 indicam quantidades crescentes de filtragem. `rows` mostra o número estimado de linhas examinadas e `rows` × `filtered` mostra o número de linhas que são unidas com a tabela seguinte. Por exemplo, se `rows` é 1000 e `filtered` é 50,00 (50%), o número de linhas a serem unidas com a tabela seguinte é 1000 × 50% = 500.
* `Extra` (nome JSON: nenhum)

  Esta coluna contém informações adicionais sobre como o MySQL resolve a consulta. Para descrições dos diferentes valores, consulte `EXPLAIN` Informações Adicionais.

  Não há uma única propriedade JSON correspondente à coluna `Extra`; no entanto, os valores que podem ocorrer nesta coluna são exibidos como propriedades JSON ou como o texto da propriedade `message`.

#### Tipos de Conexão `EXPLAIN`

A coluna `type` da saída `EXPLAIN` descreve como as tabelas são unidas. Na saída formatada em JSON, esses valores são encontrados como valores da propriedade `access_type`. A lista a seguir descreve os tipos de conexão, ordenados do melhor tipo para o pior:

*  `system`

  A tabela tem apenas uma linha (= tabela `const`). Este é um caso especial do tipo de conexão `const`.
*  `const`

  A tabela tem, no máximo, uma linha correspondente, que é lida no início da consulta. Como há apenas uma linha, os valores da coluna nesta linha podem ser considerados constantes pelo resto do otimizador. As tabelas `const` são muito rápidas porque são lidas apenas uma vez.

   `const` é usado quando você compara todas as partes de um índice `PRIMARY KEY` ou `UNIQUE` a valores constantes. Nas seguintes consultas, *`tbl_name`* pode ser usado como uma tabela `const`:

  ```
  SELECT * FROM tbl_name WHERE primary_key=1;

  SELECT * FROM tbl_name
    WHERE primary_key_part1=1 AND primary_key_part2=2;
  ```
*  `eq_ref`

Uma linha é lida a partir desta tabela para cada combinação de linhas das tabelas anteriores. Exceto pelos tipos `system` e `const`, este é o melhor tipo de junção possível. É usado quando todas as partes de um índice são usadas pela junção e o índice é um índice `PRIMARY KEY` ou `UNIQUE NOT NULL`.

`eq_ref` pode ser usado para colunas indexadas que são comparadas usando o operador `=` . O valor de comparação pode ser uma constante ou uma expressão que usa colunas de tabelas que são lidas antes desta tabela. Nos exemplos seguintes, o MySQL pode usar uma junção `eq_ref` para processar *`ref_table`*:

```
  SELECT * FROM ref_table,other_table
    WHERE ref_table.key_column=other_table.column;

  SELECT * FROM ref_table,other_table
    WHERE ref_table.key_column_part1=other_table.column
    AND ref_table.key_column_part2=1;
  ```dOng25KGYa
*  `fulltext`

A junção é realizada usando um índice `FULLTEXT`.
*  `ref_or_null`

Este tipo de junção é como `ref`, mas com a adição de que o MySQL faz uma busca extra para linhas que contêm valores `NULL`. Este tipo de otimização de junção é usado mais frequentemente na resolução de subconsultas. Nos exemplos seguintes, o MySQL pode usar uma junção `ref_or_null` para processar *`ref_table`*:

```
  SELECT * FROM ref_table WHERE key_column=expr;

  SELECT * FROM ref_table,other_table
    WHERE ref_table.key_column=other_table.column;

  SELECT * FROM ref_table,other_table
    WHERE ref_table.key_column_part1=other_table.column
    AND ref_table.key_column_part2=1;
  ```ZOx3FbNyMC```
  SELECT * FROM ref_table
    WHERE key_column=expr OR key_column IS NULL;
  ```Y347d1bg8T```
  value IN (SELECT primary_key FROM single_table WHERE some_expr)
  ```OGikzPc8du```
  value IN (SELECT key_column FROM single_table WHERE some_expr)
  ```MNHzfEsMdz```
  SELECT * FROM tbl_name
    WHERE key_column = 10;

  SELECT * FROM tbl_name
    WHERE key_column BETWEEN 10 and 20;

  SELECT * FROM tbl_name
    WHERE key_column IN (10,20,30);

  SELECT * FROM tbl_name
    WHERE key_part1 = 10 AND key_part2 IN (10,20,30);
  ```UuUOSZKOXC```
  SELECT * FROM t1 LEFT JOIN t2 ON t1.id=t2.id
    WHERE t2.id IS NULL;
  ```2R3C16J3QS```
  SELECT
    ...
  FROM
    t,
    LATERAL (derived table that refers to t) AS dt
  ...
  ```x44oaLW73C```
  SELECT MIN(c1), MIN(c2) FROM t1;
  ```90EqT49pRi```
  SELECT MIN(c2) FROM t1 WHERE c1 <= 10;
  ```2mfiuoGuyI```
  SELECT MIN(c2) FROM t1 WHERE c1 = 10;
  ```zUCtPhHA0Z```
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
```QkygZoDirq```
table type possible_keys key  key_len ref  rows  Extra
et    ALL  PRIMARY       NULL NULL    NULL 74
do    ALL  PRIMARY       NULL NULL    NULL 2135
et_1  ALL  PRIMARY       NULL NULL    NULL 74
tt    ALL  AssignedPC,   NULL NULL    NULL 3872
           ClientID,
           ActualPC
      Range checked for each record (index map: 0x23)
```BfBGZE2kZB```
mysql> ALTER TABLE tt MODIFY ActualPC VARCHAR(15);
```h84UXL8cDx```
table type   possible_keys key     key_len ref         rows    Extra
tt    ALL    AssignedPC,   NULL    NULL    NULL        3872    Using
             ClientID,                                         where
             ActualPC
do    ALL    PRIMARY       NULL    NULL    NULL        2135
      Range checked for each record (index map: 0x1)
et_1  ALL    PRIMARY       NULL    NULL    NULL        74
      Range checked for each record (index map: 0x1)
et    eq_ref PRIMARY       PRIMARY 15      tt.ActualPC 1
```4bIJ9MKn6E```
mysql> ALTER TABLE tt MODIFY AssignedPC VARCHAR(15),
                      MODIFY ClientID   VARCHAR(15);
```VaKDg7fsyX```
table type   possible_keys key      key_len ref           rows Extra
et    ALL    PRIMARY       NULL     NULL    NULL          74
tt    ref    AssignedPC,   ActualPC 15      et.EMPLOYID   52   Using
             ClientID,                                         where
             ActualPC
et_1  eq_ref PRIMARY       PRIMARY  15      tt.AssignedPC 1
do    eq_ref PRIMARY       PRIMARY  15      tt.ClientID   1
```Tuiv12y8xz```

A coluna `rows` na saída do `EXPLAIN` é uma estimativa do otimizador de junção do MySQL. Verifique se os números estão próximos da verdade comparando o produto `rows` com o número real de linhas que a consulta retorna. Se os números estiverem bastante diferentes, você pode obter um melhor desempenho usando `STRAIGHT_JOIN` na sua instrução `SELECT` e tentando listar as tabelas em uma ordem diferente na cláusula `FROM`. (No entanto, `STRAIGHT_JOIN` pode impedir que os índices sejam usados porque desabilita as transformações de junção parcial. Veja Otimizando Predicados de Subconsultas IN e EXISTS com Transformações de Junção Parcial.)

Em alguns casos, é possível executar instruções que modificam dados quando o `EXPLAIN SELECT` é usado com uma subconsulta; para mais informações, consulte a Seção 15.2.15.8, “Tabelas Derivadas”.