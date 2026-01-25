### 8.9.2 Otimizações Configuráveis

A variável de sistema `optimizer_switch` permite controlar o comportamento do optimizer. Seu valor é um conjunto de *flags*, cada uma com um valor `on` ou `off` para indicar se o comportamento correspondente do optimizer está habilitado ou desabilitado. Essa variável possui valores globais e de sessão e pode ser alterada em tempo de execução (*runtime*). O padrão global pode ser definido na inicialização do servidor (*server startup*).

Para ver o conjunto atual de *flags* do optimizer, selecione o valor da variável:

```sql
mysql> SELECT @@optimizer_switch\G
*************************** 1. row ***************************
@@optimizer_switch: index_merge=on,index_merge_union=on,
                    index_merge_sort_union=on,
                    index_merge_intersection=on,
                    engine_condition_pushdown=on,
                    index_condition_pushdown=on,
                    mrr=on,mrr_cost_based=on,
                    block_nested_loop=on,batched_key_access=off,
                    materialization=on,semijoin=on,loosescan=on,
                    firstmatch=on,duplicateweedout=on,
                    subquery_materialization_cost_based=on,
                    use_index_extensions=on,
                    condition_fanout_filter=on,derived_merge=on,
                    prefer_ordering_index=on
```

Para alterar o valor de `optimizer_switch`, atribua um valor que consiste em uma lista de um ou mais comandos, separados por vírgulas:

```sql
SET [GLOBAL|SESSION] optimizer_switch='command[,command]...';
```

Cada valor de *`command`* deve ter uma das formas mostradas na tabela a seguir.

<table summary="A sintaxe do valor de comando para comandos SET optimizer_switch."><thead><tr> <th>Sintaxe do Comando</th> <th>Significado</th> </tr></thead><tbody><tr> <td><code>default</code></td> <td>Redefine todas as otimizações para seu valor padrão</td> </tr><tr> <td><code><em><code>opt_name</code></em>=default</code></td> <td>Define a otimização nomeada para seu valor padrão</td> </tr><tr> <td><code><em><code>opt_name</code></em>=off</code></td> <td>Desabilita a otimização nomeada</td> </tr><tr> <td><code><em><code>opt_name</code></em>=on</code></td> <td>Habilita a otimização nomeada</td> </tr></tbody></table>

A ordem dos comandos no valor não importa, embora o comando `default` seja executado primeiro, se estiver presente. Definir um *flag* *`opt_name`* como `default` o define para o valor padrão, seja ele `on` ou `off`. Não é permitido especificar o mesmo *`opt_name`* mais de uma vez no valor, o que causará um erro. Quaisquer erros no valor fazem com que a atribuição falhe com um erro, deixando o valor de `optimizer_switch` inalterado.

A lista a seguir descreve os nomes de *flags* *`opt_name`* permitidos, agrupados por estratégia de otimização:

* Flags de Batched Key Access

  + `batched_key_access` (padrão `off`)

    Controla o uso do algoritmo de JOIN BKA.

  Para que `batched_key_access` tenha algum efeito quando definido como `on`, o *flag* `mrr` também deve ser `on`. Atualmente, a estimativa de custo para MRR é muito pessimista. Portanto, também é necessário que `mrr_cost_based` esteja em `off` para que o BKA seja utilizado.

  Para mais informações, consulte a Seção 8.2.1.11, "Block Nested-Loop and Batched Key Access Joins".

* Flags de Block Nested-Loop

  + `block_nested_loop` (padrão `on`)

    Controla o uso do algoritmo de JOIN BNL.

  Para mais informações, consulte a Seção 8.2.1.11, "Block Nested-Loop and Batched Key Access Joins".

* Flags de Filtragem de Condição

  + `condition_fanout_filter` (padrão `on`)

    Controla o uso de filtragem de condição.

  Para mais informações, consulte a Seção 8.2.1.12, "Condition Filtering".

* Flags de Mesclagem de Derived Table

  + `derived_merge` (padrão `on`)

    Controla a mesclagem de derived tables e views no bloco de Query externo.

  O *flag* `derived_merge` controla se o optimizer tenta mesclar *derived tables* e referências a *views* no bloco de Query externo, assumindo que nenhuma outra regra impeça a mesclagem; por exemplo, uma diretiva `ALGORITHM` para uma *view* tem precedência sobre a configuração `derived_merge`. Por padrão, o *flag* está `on` para habilitar a mesclagem.

  Para mais informações, consulte a Seção 8.2.2.4, "Optimizing Derived Tables and View References with Merging or Materialization".

* Flags de Engine Condition Pushdown

  + `engine_condition_pushdown` (padrão `on`)

    Controla o Engine Condition Pushdown.

  Para mais informações, consulte a Seção 8.2.1.4, "Engine Condition Pushdown Optimization".

* Flags de Index Condition Pushdown

  + `index_condition_pushdown` (padrão `on`)

    Controla o Index Condition Pushdown.

  Para mais informações, consulte a Seção 8.2.1.5, "Index Condition Pushdown Optimization".

* Flags de Index Extensions

  + `use_index_extensions` (padrão `on`)

    Controla o uso de Index Extensions.

  Para mais informações, consulte a Seção 8.3.9, "Use of Index Extensions".

* Flags de Index Merge

  + `index_merge` (padrão `on`)

    Controla todas as otimizações de Index Merge.

  + `index_merge_intersection` (padrão `on`)

    Controla a otimização de acesso Index Merge Intersection.

  + `index_merge_sort_union` (padrão `on`)

    Controla a otimização de acesso Index Merge Sort-Union.

  + `index_merge_union` (padrão `on`)

    Controla a otimização de acesso Index Merge Union.

  Para mais informações, consulte a Seção 8.2.1.3, "Index Merge Optimization".

* Flags de Otimização de LIMIT

  + `prefer_ordering_index` (padrão `on`)

    Controla se, no caso de uma Query que contenha um `ORDER BY` ou `GROUP BY` com uma cláusula `LIMIT`, o optimizer tenta usar um Index ordenado em vez de um Index não ordenado, um filesort ou alguma outra otimização. Esta otimização é realizada por padrão sempre que o optimizer determina que usá-la permitiria uma execução mais rápida da Query.

    Como o algoritmo que faz essa determinação não consegue lidar com todos os casos concebíveis (devido em parte à suposição de que a distribuição dos dados é sempre mais ou menos uniforme), há casos em que essa otimização pode não ser desejável. Antes do MySQL 5.7.33, não era possível desabilitar essa otimização, mas no MySQL 5.7.33 e versões posteriores, embora continue sendo o comportamento padrão, ela pode ser desabilitada definindo o *flag* `prefer_ordering_index` como `off`.

  Para mais informações e exemplos, consulte a Seção 8.2.1.17, "LIMIT Query Optimization".

* Flags de Multi-Range Read

  + `mrr` (padrão `on`)

    Controla a estratégia Multi-Range Read.

  + `mrr_cost_based` (padrão `on`)

    Controla o uso de MRR baseado em custo se `mrr=on`.

  Para mais informações, consulte a Seção 8.2.1.10, "Multi-Range Read Optimization".

* Flags de Semijoin

  + `duplicateweedout` (padrão `on`)

    Controla a estratégia Semijoin Duplicate Weedout.

  + `firstmatch` (padrão `on`)

    Controla a estratégia Semijoin FirstMatch.

  + `loosescan` (padrão `on`)

    Controla a estratégia Semijoin LooseScan (não confundir com Loose Index Scan para `GROUP BY`).

  + `semijoin` (padrão `on`)

    Controla todas as estratégias de Semijoin.

  Os *flags* `semijoin`, `firstmatch`, `loosescan` e `duplicateweedout` permitem controlar as estratégias de Semijoin. O *flag* `semijoin` controla se os Semijoins são usados. Se estiver definido como `on`, os *flags* `firstmatch` e `loosescan` permitem um controle mais refinado sobre as estratégias de Semijoin permitidas.

  Se a estratégia Semijoin `duplicateweedout` for desabilitada, ela não será usada a menos que todas as outras estratégias aplicáveis também sejam desabilitadas.

  Se `semijoin` e `materialization` estiverem ambos em `on`, os Semijoins também usam Materialization quando aplicável. Esses *flags* estão `on` por padrão.

  Para mais informações, consulte a Seção 8.2.2.1, "Optimizing Subqueries, Derived Tables, and View References with Semijoin Transformations".

* Flags de Materialization de Subquery

  + `materialization` (padrão `on`)

    Controla o Materialization (incluindo Materialization de Semijoin).

  + `subquery_materialization_cost_based` (padrão `on`)

    Usa escolha de Materialization baseada em custo.

  O *flag* `materialization` controla se o Materialization de Subquery é usado. Se `semijoin` e `materialization` estiverem ambos em `on`, os Semijoins também usam Materialization quando aplicável. Esses *flags* estão `on` por padrão.

  O *flag* `subquery_materialization_cost_based` permite controlar a escolha entre Materialization de Subquery e a transformação de Subquery `IN`-para-`EXISTS`. Se o *flag* estiver `on` (o padrão), o optimizer executa uma escolha baseada em custo entre Materialization de Subquery e a transformação de Subquery `IN`-para-`EXISTS` se qualquer um dos métodos puder ser usado. Se o *flag* estiver `off`, o optimizer escolhe Materialization de Subquery em vez da transformação de Subquery `IN`-para-`EXISTS`.

  Para mais informações, consulte a Seção 8.2.2, "Optimizing Subqueries, Derived Tables, and View References".

Ao atribuir um valor a `optimizer_switch`, os *flags* que não são mencionados mantêm seus valores atuais. Isso torna possível habilitar ou desabilitar comportamentos específicos do optimizer em uma única instrução sem afetar outros comportamentos. A instrução não depende de quais outros *flags* do optimizer existem ou quais são seus valores. Suponha que todas as otimizações Index Merge estejam habilitadas:

```sql
mysql> SELECT @@optimizer_switch\G
*************************** 1. row ***************************
@@optimizer_switch: index_merge=on,index_merge_union=on,
                    index_merge_sort_union=on,
                    index_merge_intersection=on,
                    engine_condition_pushdown=on,
                    index_condition_pushdown=on,
                    mrr=on,mrr_cost_based=on,
                    block_nested_loop=on,batched_key_access=off,
                    materialization=on,semijoin=on,loosescan=on,
                    firstmatch=on,duplicateweedout=on,
                    subquery_materialization_cost_based=on,
                    use_index_extensions=on,
                    condition_fanout_filter=on,derived_merge=on,
                    prefer_ordering_index=on
```

Se o servidor estiver usando os métodos de acesso Index Merge Union ou Index Merge Sort-Union para certas Queries e você quiser verificar se o optimizer tem um desempenho melhor sem eles, defina o valor da variável desta forma:

```sql
mysql> SET optimizer_switch='index_merge_union=off,index_merge_sort_union=off';

mysql> SELECT @@optimizer_switch\G
*************************** 1. row ***************************
@@optimizer_switch: index_merge=on,index_merge_union=off,
                    index_merge_sort_union=off,
                    index_merge_intersection=on,
                    engine_condition_pushdown=on,
                    index_condition_pushdown=on,
                    mrr=on,mrr_cost_based=on,
                    block_nested_loop=on,batched_key_access=off,
                    materialization=on,semijoin=on,loosescan=on,
                    firstmatch=on,duplicateweedout=on,
                    subquery_materialization_cost_based=on,
                    use_index_extensions=on,
                    condition_fanout_filter=on,derived_merge=on,
                    prefer_ordering_index=on
```