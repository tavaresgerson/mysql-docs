### 8.9.2 Otimizações comutadas

A variável de sistema `optimizer_switch` permite o controle do comportamento do otimizador. Seu valor é um conjunto de flags, cada uma com um valor de `on` ou `off` para indicar se o comportamento do otimizador correspondente está habilitado ou desabilitado. Esta variável tem valores globais e de sessão e pode ser alterada em tempo de execução. O valor padrão global pode ser definido na inicialização do servidor.

Para ver o conjunto atual de flags do otimizador, selecione o valor da variável:

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

Para alterar o valor de `optimizer_switch`, atribua um valor que seja uma lista de vírgulas de um ou mais comandos:

```sql
SET [GLOBAL|SESSION] optimizer_switch='command[,command]...';
```

Cada valor de *`command`* deve ter uma das formas mostradas na tabela a seguir.

<table summary="A sintaxe do valor do comando para os comandos SET optimizer_switch."><thead><tr> <th>Sintaxe de comando</th> <th>Significado</th> </tr></thead><tbody><tr> <td><code>default</code></td> <td>Reinicie todas as otimizações para o valor padrão</td> </tr><tr> <td><code><em><code>opt_name</code></em>=default</code></td> <td>Defina a otimização nomeada para o valor padrão</td> </tr><tr> <td><code><em><code>opt_name</code></em>=off</code></td> <td>Desative a otimização nomeada</td> </tr><tr> <td><code><em><code>opt_name</code></em>=on</code></td> <td>Ative a otimização nomeada</td> </tr></tbody></table>

A ordem dos comandos no valor não importa, embora o comando `default` seja executado primeiro, se estiver presente. Definir uma bandeira `opt_name` com o valor `default` define-a como o valor padrão entre `on` ou `off`. Especificar qualquer *`opt_name`* mais de uma vez no valor não é permitido e causa um erro. Quaisquer erros no valor fazem com que a atribuição falhe com um erro, deixando o valor de `optimizer_switch` inalterado.

A lista a seguir descreve os nomes permitidos da bandeira *`opt_name`*, agrupados por estratégia de otimização:

- Marcadores de acesso por lote

  - `batched_key_access` (padrão `off`)

    Controles para o uso do algoritmo de junção do BKA.

  Para que `batched_key_access` tenha algum efeito quando definido como `on`, a bandeira `mrr` também deve estar ativada. Atualmente, a estimativa de custo para MRR é muito pessimista. Portanto, também é necessário que `mrr_cost_based` esteja definido como `off` para que o BKA seja usado.

  Para obter mais informações, consulte a Seção 8.2.1.11, “Conjuntos de acesso a chave em laço aninhado e loteado”.

- Bloquear as bandeiras de laço aninhado

  - `block_nested_loop` (padrão `on`)

    Controles para o uso do algoritmo de junção BNL.

  Para obter mais informações, consulte a Seção 8.2.1.11, “Conjuntos de acesso a chave em laço aninhado e loteado”.

- Filtros de condição

  - `condition_fanout_filter` (padrão `on`)

    O controle usa a filtragem de condições.

  Para mais informações, consulte a Seção 8.2.1.12, “Filtragem de Condições”.

- Ferramentas de fusão de tabelas derivadas

  - `derived_merge` (padrão `on`)

    Controles para a fusão de tabelas e visualizações derivadas no bloco de consulta externa.

  A bandeira `derived_merge` controla se o otimizador tenta combinar tabelas derivadas e referências de visualizações no bloco de consulta externa, assumindo que nenhuma outra regra impeça a combinação; por exemplo, uma diretiva `ALGORITHM` para uma visualização tem precedência sobre a configuração `derived_merge`. Por padrão, a bandeira está ativada para permitir a combinação.

  Para obter mais informações, consulte a Seção 8.2.2.4, “Otimização de tabelas derivadas e referências de visualização com fusão ou materialização”.

- Marcadores de condição do motor

  - `engine_condition_pushdown` (padrão `on`)

    Controle a condição do motor para baixo.

  Para obter mais informações, consulte a Seção 8.2.1.4, “Otimização da Depressão do Estado do Motor”.

- Índices Condição Pushdown Flags

  - `index_condition_pushdown` (padrão `on`)

    Controles de indexação condicional pushdown.

  Para obter mais informações, consulte a Seção 8.2.1.5, “Otimização da empilhamento da condição de índice”.

- Extensões do índice: bandeiras

  - `use_index_extensions` (padrão `on`)

    Controles para uso de extensões de índice.

  Para obter mais informações, consulte a Seção 8.3.9, “Uso de extensões de índice”.

- Ferramentas de mesclagem de índice

  - `index_merge` (padrão `on`)

    Controla todas as otimizações de junção de índice.

  - `index_merge_intersection` (padrão `on`)

    Controla a otimização da interseção de junção de índices.

  - `index_merge_sort_union` (padrão `on`)

    Controla a otimização da união de índices, ordenação por junção e acesso.

  - `index_merge_union` (padrão `on`)

    Controla a otimização da união de junção de índice.

  Para mais informações, consulte a Seção 8.2.1.3, “Otimização da Mesclagem de Índices”.

- Ferramentas de otimização de limite

  - `prefer_ordering_index` (padrão `on`)

    Controla se, no caso de uma consulta com uma cláusula `ORDER BY` ou `GROUP BY` com uma cláusula `LIMIT`, o otimizador tenta usar um índice ordenado em vez de um índice não ordenado, um filesort ou outra otimização. Essa otimização é realizada por padrão sempre que o otimizador determina que, ao usá-la, seria possível executar a consulta mais rapidamente.

    Como o algoritmo que faz essa determinação não consegue lidar com todos os casos possíveis (em parte devido à suposição de que a distribuição dos dados é sempre mais ou menos uniforme), há casos em que essa otimização pode não ser desejável. Antes do MySQL 5.7.33, não era possível desativar essa otimização, mas no MySQL 5.7.33 e versões posteriores, embora continue sendo o comportamento padrão, ela pode ser desativada definindo a bandeira `prefer_ordering_index` para `off`.

  Para obter mais informações e exemplos, consulte a Seção 8.2.1.17, “Otimização da consulta LIMIT”.

- Ferramentas de leitura de faixa de múltiplos intervalos

  - `mrr` (padrão `on`)

    Controla a estratégia de leitura de Multi-Range.

  - `mrr_cost_based` (padrão `on`)

    Controles usam o MRR baseado em custos se `mrr=on`.

  Para mais informações, consulte a Seção 8.2.1.10, “Otimização da Leitura de Múltiplos Alcance”.

- Bandeiras Semijoin

  - `duplicateweedout` (padrão `on`)

    Controla a estratégia de semijoin Duplicate Weedout.

  - `firstmatch` (padrão `on`)

    Controla a estratégia Semijoin FirstMatch.

  - `loosescan` (padrão `on`)

    Controla a estratégia de junção parcial LooseScan (não confundir com Loose Index Scan para `GROUP BY`).

  - `semijoin` (padrão `on`)

    Controla todas as estratégias de junção parcial.

  As flags `semijoin`, `firstmatch`, `loosescan` e `duplicateweedout` permitem o controle sobre as estratégias de semijoin. A flag `semijoin` controla se os semijoins são usados. Se estiver definida como `on`, as flags `firstmatch` e `loosescan` permitem um controle mais preciso sobre as estratégias de semijoin permitidas.

  Se a estratégia de junção semijunta `duplicateweedout` estiver desativada, ela não será usada, a menos que todas as outras estratégias aplicáveis também estejam desativadas.

  Se `semijoin` e `materialization` estiverem ambos ativados, os semijoins também utilizam a materialização quando aplicável. Essas opções estão ativadas por padrão.

  Para obter mais informações, consulte a Seção 8.2.2.1, “Otimização de subconsultas, tabelas derivadas e referências de visualizações com transformações Semijoin”.

- Marcadores de materialização de subconsultas

  - `materialization` (padrão `on`)

    Controla a materialização (incluindo a materialização por junção parcial).

  - `subquery_materialization_cost_based` (padrão `on`)

    Use a opção de materialização baseada no custo.

  A bandeira `materialization` controla se a materialização de subconsultas é usada. Se `semijoin` e `materialization` estiverem ambos em `on`, os semijoins também usam materialização quando aplicável. Essas bandeiras estão em `on` por padrão.

  A bandeira `subquery_materialization_cost_based` permite controlar a escolha entre a materialização de subconsultas e a transformação de subconsultas `IN` para `EXISTS`. Se a bandeira estiver `on` (padrão), o otimizador realiza uma escolha baseada no custo entre a materialização de subconsultas e a transformação de subconsultas `IN` para `EXISTS`, se qualquer um dos métodos puder ser usado. Se a bandeira estiver `off`, o otimizador escolhe a materialização de subconsultas em detrimento da transformação de subconsultas `IN` para `EXISTS`.

  Para obter mais informações, consulte a Seção 8.2.2, “Otimização de subconsultas, tabelas derivadas e referências de visualizações”.

Quando você atribui um valor a `optimizer_switch`, as flags que não são mencionadas mantêm seus valores atuais. Isso permite habilitar ou desabilitar comportamentos específicos do otimizador em uma única instrução sem afetar outros comportamentos. A instrução não depende do que outras flags do otimizador existem e quais são seus valores. Suponha que todas as otimizações de Merge de Índices estejam habilitadas:

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

Se o servidor estiver usando os métodos de acesso Index Merge Union ou Index Merge Sort-Union para certas consultas e você quiser verificar se o otimizador funciona melhor sem eles, defina o valor da variável da seguinte maneira:

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
