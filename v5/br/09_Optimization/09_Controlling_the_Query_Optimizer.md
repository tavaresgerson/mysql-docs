## 8.9 Controlar o Otimizador de Consulta

O MySQL oferece controle de otimizador através de variáveis do sistema que afetam a forma como os planos de consulta são avaliados, otimizações comutadas, dicas de otimizador e índice, e o modelo de custo do otimizador.

### 8.9.1 Controle da avaliação do plano de consulta

A tarefa do otimizador de consultas é encontrar um plano ótimo para executar uma consulta SQL. Como a diferença de desempenho entre os planos "bom" e "ruim" pode ser de ordens de grandeza (ou seja, segundos versus horas ou até dias), a maioria dos otimizadores de consultas, incluindo o do MySQL, realiza uma busca mais ou menos exaustiva por um plano ótimo entre todos os planos possíveis de avaliação de consultas. Para consultas de junção, o número de planos possíveis investigados pelo otimizador do MySQL cresce exponencialmente com o número de tabelas referenciadas em uma consulta. Para um pequeno número de tabelas (tipicamente menos de 7 a 10), isso não é um problema. No entanto, quando consultas maiores são enviadas, o tempo gasto na otimização da consulta pode facilmente se tornar o principal gargalo no desempenho do servidor.

Um método mais flexível para otimização de consultas permite que o usuário controle quão exhaustivo o otimizador é em sua busca por um plano de avaliação de consulta ótimo. A ideia geral é que, quanto menos planos são investigados pelo otimizador, menos tempo ele gasta na compilação de uma consulta. Por outro lado, como o otimizador ignora alguns planos, pode não encontrar um plano ótimo.

O comportamento do otimizador em relação ao número de planos que ele avalia pode ser controlado usando duas variáveis do sistema:

* A variável `optimizer_prune_level` indica ao otimizador que ignore certos planos com base em estimativas do número de strings acessadas para cada tabela. Nossa experiência mostra que esse tipo de "gasto educado" raramente perde planos ótimos e pode reduzir drasticamente os tempos de compilação das consultas. É por isso que essa opção está ativada (`optimizer_prune_level=1`) por padrão. No entanto, se você acredita que o otimizador perdeu um plano de consulta melhor, essa opção pode ser desativada (`optimizer_prune_level=0`) com o risco de que a compilação da consulta possa levar muito mais tempo. Note que, mesmo com o uso dessa heurística, o otimizador ainda explora um número aproximadamente exponencial de planos.

* A variável `optimizer_search_depth` indica até que ponto no "futuro" de cada plano incompleto o otimizador deve procurar para avaliar se ele deve ser expandido ainda mais. Valores menores de `optimizer_search_depth` podem resultar em tempos de compilação de consultas de ordem de magnitude menores. Por exemplo, consultas com 12, 13 ou mais tabelas podem facilmente exigir horas e até dias para compilação, se `optimizer_search_depth` estiver próximo ao número de tabelas na consulta. Ao mesmo tempo, se compilada com `optimizer_search_depth` igual a 3 ou 4, o otimizador pode compilar em menos de um minuto para a mesma consulta. Se você não tem certeza do que é um valor razoável para `optimizer_search_depth`, essa variável pode ser definida como 0 para indicar ao otimizador que determine o valor automaticamente.

### 8.9.2 Otimizações Desconectables
### 8.9.3 Otimizações Desconectables
### 8.9.4 Otimizações Desconectables
### 8.9.5 Otimizações Desconectables
### 8.9.6 Otimizações Desconectables
### 8.9.7 Otimizações Desconectables
### 8.9.8 Otimizações Desconectables
### 8.9.9 Otimizações Desconectables
### 8.9.10 Otimizações Desconectables

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

Para alterar o valor de `optimizer_switch`, atribua um valor que consista em uma lista de comandos separados por vírgula de um ou mais comandos:

```sql
SET [GLOBAL|SESSION] optimizer_switch='command[,command]...';
```

Cada valor *`command`* deve ter uma das formas mostradas na tabela a seguir.

<table summary="The syntax of the command value for SET optimizer_switch commands."><col style="width: 25%"/><col style="width: 75%"/><thead><tr> <th>Command Syntax</th> <th>Significado</th> </tr></thead><tbody><tr> <td><code>default</code></td> <td>Redefinir todas as otimizações para seu valor padrão</td> </tr><tr> <td><code><code>opt_name</code>=default</code></td> <td>Defina a otimização nomeada para seu valor padrão</td> </tr><tr> <td><code><code>opt_name</code>=off</code></td> <td>Desative a otimização nomeada</td> </tr><tr> <td><code><code>opt_name</code>=on</code></td> <td>Ative a otimização nomeada</td> </tr></tbody></table>

A ordem dos comandos no valor não importa, embora o comando `default` seja executado primeiro, se estiver presente. Definir uma bandeira *`opt_name`* para `default` a define como o valor padrão de `on` ou `off`. Especificar qualquer *`opt_name`* dado mais de uma vez no valor não é permitido e causa um erro. Quaisquer erros no valor fazem com que a atribuição falhe com um erro, deixando o valor de `optimizer_switch` inalterado.

A lista a seguir descreve os nomes das flags *`opt_name`* permitidos, agrupados por estratégia de otimização:

* Fлагаres de acesso chave em lote

+ `batched_key_access` (padrão `off`)

Controles para o uso do algoritmo de junção BKA.

Para que `batched_key_access` tenha algum efeito quando definido como `on`, a bandeira `mrr` também deve ser `on`. Atualmente, a estimativa de custo para MRR é muito pessimista. Portanto, também é necessário que `mrr_cost_based` seja `off` para que o BKA seja utilizado.

Para mais informações, consulte a Seção 8.2.1.11, “Conjuntos de acesso a chave em lote e junções de laço aninhado”.

* Bloquear bandeiras de laço aninhado

+ `block_nested_loop` (padrão `on`)

Controles para o uso do algoritmo de junção BNL.

Para mais informações, consulte a Seção 8.2.1.11, “Conjuntos de acesso a chave em lote e junções de laço aninhado”.

* Indicadores de filtragem de condição

+ `condition_fanout_filter` (padrão `on`)

Controle o uso do filtro de condição.

Para mais informações, consulte a Seção 8.2.1.12, “Filtragem de Condições”.

* Mergulho de tabelas derivadas de bandeiras

+ `derived_merge` (padrão `on`)

Controles para a fusão de tabelas e visualizações derivadas no bloco de consulta externa.

A bandeira `derived_merge` controla se o otimizador tenta combinar tabelas derivadas e referências de visão no bloco da consulta externa, assumindo que nenhuma outra regra impeça a combinação; por exemplo, uma diretiva `ALGORITHM` para uma visão tem precedência sobre o ajuste `derived_merge`. Por padrão, a bandeira é `on` para habilitar a combinação.

Para mais informações, consulte a Seção 8.2.2.4, “Otimizando tabelas derivadas e referências de visão com fusão ou materialização”.

* Marcadores de condição do motor

+ `engine_condition_pushdown` (padrão `on`)

Controle a condição do motor em baixa pressão.

Para mais informações, consulte a Seção 8.2.1.4, “Otimização de empurrar o estado do motor”.

* Índices Condição Pushdown de Flashes

+ `index_condition_pushdown` (padrão `on`)

Controle de condição de índice pushdown.

Para mais informações, consulte a Seção 8.2.1.5, “Otimização da Pushdown de Condição de Índice”.

* Indicadores de extensões de bandeira

+ `use_index_extensions` (padrão `on`)

Controle o uso de extensões de índice.

Para mais informações, consulte a Seção 8.3.9, “Uso de extensões de índice”.

* Fлагаres de junção de índice

+ `index_merge` (padrão `on`)

Controla todas as otimizações de junção de índice.

+ `index_merge_intersection` (padrão `on`)

Controla a otimização da interseção de junção de índice.

+ `index_merge_sort_union` (padrão `on`)

Controla a otimização da união de índices, ordenação por índice e acesso.

+ `index_merge_union` (padrão `on`)

Controla a otimização da união de junção de índice.

Para mais informações, consulte a Seção 8.2.1.3, “Otimização da Mesclagem de Índices”.

* Fлагаres de otimização de limite

+ `prefer_ordering_index` (padrão `on`)

Controla se, no caso de uma consulta que tenha um `ORDER BY` ou `GROUP BY` com uma cláusula `LIMIT`, o otimizador tenta usar um índice ordenado em vez de um índice não ordenado, um filesort ou outra otimização. Essa otimização é realizada por padrão sempre que o otimizador determina que, ao usá-la, seria possível executar a consulta mais rapidamente.

Como o algoritmo que faz essa determinação não pode lidar com todos os casos concebíveis (em parte devido à suposição de que a distribuição dos dados é sempre mais ou menos uniforme), há casos em que essa otimização pode não ser desejável. Antes do MySQL 5.7.33, não era possível desativar essa otimização, mas no MySQL 5.7.33 e versões posteriores, embora permaneça o comportamento padrão, pode ser desativada definindo a bandeira `prefer_ordering_index` para `off`.

Para mais informações e exemplos, consulte a Seção 8.2.1.17, “Otimização da consulta LIMIT”.

* Leitura de bandeiras de várias faixas

+ `mrr` (padrão `on`)

Controla a estratégia de leitura de Multi-Range.

+ `mrr_cost_based` (padrão `on`)

Controle o uso de MRR baseado em custos se `mrr=on`.

Para mais informações, consulte a Seção 8.2.1.10, “Otimização da leitura de várias faixas”.

* Bandeiras de Semijoin

+ `duplicateweedout` (padrão `on`)

Controla a estratégia de semijoin Duplicate Weedout.

+ `firstmatch` (padrão `on`)

Controla a estratégia semijoin FirstMatch.

+ `loosescan` (padrão `on`)

Controla a estratégia semijoin LooseScan (não confundir com Loose Index Scan para `GROUP BY`).

+ `semijoin` (padrão `on`)

Controla todas as estratégias de semijoin.

As bandeiras `semijoin`, `firstmatch`, `loosescan` e `duplicateweedout` permitem o controle de estratégias de semijoin. A bandeira `semijoin` controla se semijoins são usados. Se estiver definida como `on`, as bandeiras `firstmatch` e `loosescan` permitem um controle mais preciso sobre as estratégias de semijoin permitidas.

Se a estratégia de junção semijoinha `duplicateweedout` estiver desativada, ela não será usada, a menos que todas as outras estratégias aplicáveis também estejam desativadas.

Se `semijoin` e `materialization` forem ambos `on`, os semijoins também utilizam materialização quando aplicável. Essas bandeiras são `on` por padrão.

Para mais informações, consulte a Seção 8.2.2.1, “Otimizando subconsultas, tabelas derivadas e referências de visualizações com transformações Semijoin”.

* Indicadores de materialização de subconsulta

+ `materialization` (padrão `on`)

Controles de materialização (incluindo materialização semijoin).

+ `subquery_materialization_cost_based` (padrão `on`)

Use a opção de materialização baseada em custos.

A bandeira `materialization` controla se a materialização de subconsulta é usada. Se `semijoin` e `materialization` estão ambos `on`, semijoins também usam materialização onde aplicável. Essas bandeiras são `on` por padrão.

A bandeira `subquery_materialization_cost_based` permite o controle sobre a escolha entre materialização de subconsulta e transformação de subconsulta de `IN` para `EXISTS` (`on`) se a bandeira for a padrão. Se a bandeira for `on` (a padrão), o otimizador realiza uma escolha baseada no custo entre materialização de subconsulta e transformação de subconsulta de `IN` para `EXISTS` se qualquer um dos métodos puder ser usado. Se a bandeira for `off`, o otimizador escolhe materialização de subconsulta sobre transformação de subconsulta de `IN` para `EXISTS`.

Para mais informações, consulte a Seção 8.2.2, “Otimizando subconsultas, tabelas derivadas e referências de visualização”.

Quando você atribui um valor a `optimizer_switch`, as bandeiras que não são mencionadas mantêm seus valores atuais. Isso permite habilitar ou desabilitar comportamentos específicos do otimizador em uma única declaração sem afetar outros comportamentos. A declaração não depende do que outras bandeiras do otimizador existem e quais são seus valores. Suponha que todas as otimizações de Merge de Índice estejam habilitadas:

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

Se o servidor estiver usando os métodos de acesso de junção de índice ou junção de índice e índice de classificação-junção para certas consultas e você quiser verificar se o otimizador se sai melhor sem eles, defina o valor da variável da seguinte forma:

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

### 8.9.3 Dicas de otimizador

Uma forma de controle sobre as estratégias de otimização é definir a variável de sistema `optimizer_switch` (consulte a Seção 8.9.2, “Otimizações Desconectables”). Alterações nesta variável afetam a execução de todas as consultas subsequentes; para alterar uma consulta de forma diferente da outra, é necessário alterar `optimizer_switch` antes de cada uma.

Outra maneira de controlar o otimizador é usando dicas de otimizador, que podem ser especificadas dentro de declarações individuais. Como as dicas de otimizador são aplicadas por declaração, elas fornecem um controle mais fino sobre os planos de execução das declarações do que o que pode ser alcançado usando `optimizer_switch`. Por exemplo, você pode habilitar uma otimização para uma tabela em uma declaração e desabilitar a otimização para uma tabela diferente. As dicas dentro de uma declaração têm precedência sobre as flags `optimizer_switch`.

Exemplos:

```sql
SELECT /*+ NO_RANGE_OPTIMIZATION(t3 PRIMARY, f2_idx) */ f1
  FROM t3 WHERE f1 > 30 AND f1 < 33;
SELECT /*+ BKA(t1) NO_BKA(t2) */ * FROM t1 INNER JOIN t2 WHERE ...;
SELECT /*+ NO_ICP(t1, t2) */ * FROM t1 INNER JOIN t2 WHERE ...;
SELECT /*+ SEMIJOIN(FIRSTMATCH, LOOSESCAN) */ * FROM t1 ...;
EXPLAIN SELECT /*+ NO_ICP(t1) */ * FROM t1 WHERE ...;
```

Nota

O cliente **mysql**, por padrão, elimina os comentários das instruções SQL enviadas ao servidor (incluindo dicas do otimizador) até o MySQL 5.7.7, quando foi alterado para passar dicas do otimizador para o servidor. Para garantir que as dicas do otimizador não sejam eliminadas se você estiver usando uma versão mais antiga do cliente **mysql** com uma versão do servidor que entende dicas do otimizador, invoque o **mysql** com a opção `--comments`.

Os indicadores de otimização, descritos aqui, diferem dos indicadores de índice, descritos na Seção 8.9.4, “Indicadores de índice”. Otimizador e indicadores de índice podem ser usados separadamente ou juntos.

* Visão geral do Optimizer Hint
* Sintaxe do Optimizer Hint
* Dicas de otimização de nível de tabela
* Dicas de otimização de nível de índice
* Dicas de otimização de subconsultas
* Dicas de otimização de tempo de execução de declaração
* Dicas de otimização de nomeação de blocos de consulta

#### Visão geral do Optimizer Hint

Os indicadores de otimização são aplicados em diferentes níveis de escopo:

* Global: O indicador afeta toda a declaração
* Bloco de consulta: O indicador afeta um bloco de consulta específico dentro de uma declaração

* Nível de tabela: O aviso afeta uma tabela específica dentro de um bloco de consulta

* Nível de índice: O indicador afeta um índice específico dentro de uma tabela

A tabela a seguir resume as dicas de otimização disponíveis, as estratégias de otimização que elas afetam e o escopo ou escopos em que elas se aplicam. Mais detalhes são fornecidos mais adiante.

**Tabela 8.2 Dicas de otimizador disponíveis**

<table summary="Optimizer hint names, descriptions, and contexts in which they apply."><col style="width: 30%"/><col style="width: 40%"/><col style="width: 30%"/><thead><tr> <th>Hint Name</th> <th>Description</th> <th>Applicable Scopes</th> </tr></thead><tbody><tr> <th><code>BKA</code>,<code>NO_BKA</code></th> <td>Afeta o processamento de junção de acesso chave em lote</td> <td>Bloco de consulta, tabela</td> </tr><tr> <th><code>BNL</code>,<code>NO_BNL</code></th> <td>Afeta o processamento de junção de laço aninhado</td> <td>Bloco de consulta, tabela</td> </tr><tr> <th><code>MAX_EXECUTION_TIME</code></th> <td>Limits statement execution time</td> <td>Global</td> </tr><tr> <th><code>MRR</code>,<code>NO_MRR</code></th> <td>Afeta a otimização da leitura em várias faixas de frequência</td> <td>Tabela, índice</td> </tr><tr> <th><code>NO_ICP</code></th> <td>Afeta a condição do índice Otimização Pushdown</td> <td>Tabela, índice</td> </tr><tr> <th><code>NO_RANGE_OPTIMIZATION</code></th> <td>Affects range optimization</td> <td>Table, index</td> </tr><tr> <th><code>QB_NAME</code></th> <td>Atribui nome ao bloco de consulta</td> <td>Bloco de consulta</td> </tr><tr> <th><code>SEMIJOIN</code>, <code>NO_SEMIJOIN</code></th> <td>semijoin strategies</td> <td>Query block</td> </tr><tr> <th><code>SUBQUERY</code></th> <td>Afecta a materialização,<code>IN</code>-to-<code>EXISTS</code>estratégias de subconsulta</td> <td>Bloco de consulta</td> </tr></tbody></table>

Desativar uma otimização impede que o otimizador a use. Habilitar uma otimização significa que o otimizador está livre para usar a estratégia se ela se aplicar à execução da declaração, não que o otimizador a use necessariamente.

#### Sintaxe do Hint do Optimizer

O MySQL suporta comentários em declarações SQL conforme descrito na Seção 9.6, “Comentários”. Os indicadores do otimizador devem ser especificados dentro de comentários `/*+ ... */`. Ou seja, os indicadores do otimizador utilizam uma variante da sintaxe de comentário em estilo C `/* ... */`, com um caractere `+` após a sequência de abertura do comentário `/*`. Exemplos:

```sql
/*+ BKA(t1) */
/*+ BNL(t1, t2) */
/*+ NO_RANGE_OPTIMIZATION(t4 PRIMARY) */
/*+ QB_NAME(qb2) */
```

Espaços em branco são permitidos após o caractere `+`.

O analisador reconhece comentários de dica de otimização após a palavra-chave inicial das declarações `SELECT`, `UPDATE`, `INSERT`, `REPLACE` e `DELETE`. As dicas são permitidas nesses contextos:

* No início das declarações de consulta e mudança de dados:

  ```sql
  SELECT /*+ ... */ ...
  INSERT /*+ ... */ ...
  REPLACE /*+ ... */ ...
  UPDATE /*+ ... */ ...
  DELETE /*+ ... */ ...
  ```

* No início dos blocos de consulta:

  ```sql
  (SELECT /*+ ... */ ... )
  (SELECT ... ) UNION (SELECT /*+ ... */ ... )
  (SELECT /*+ ... */ ... ) UNION (SELECT /*+ ... */ ... )
  UPDATE ... WHERE x IN (SELECT /*+ ... */ ...)
  INSERT ... SELECT /*+ ... */ ...
  ```

* Em declarações hintaveis precedidas por `EXPLAIN`. Por exemplo:

  ```sql
  EXPLAIN SELECT /*+ ... */ ...
  EXPLAIN UPDATE ... WHERE x IN (SELECT /*+ ... */ ...)
  ```

A implicação é que você pode usar `EXPLAIN` para ver como as dicas do otimizador afetam os planos de execução. Use `SHOW WARNINGS` imediatamente após `EXPLAIN` para ver como as dicas são usadas. A saída `EXPLAIN` estendida exibida por um `SHOW WARNINGS` subsequente indica quais dicas foram usadas. As dicas ignoradas não são exibidas.

Um comentário de dica pode conter múltiplas dicas, mas um bloco de consulta não pode conter múltiplos comentários de dica. Isso é válido:

```sql
SELECT /*+ BNL(t1) BKA(t2) */ ...
```

Mas isso é inválido:

```sql
SELECT /*+ BNL(t1) */ /* BKA(t2) */ ...
```

Quando um comentário com dicas contém várias dicas, existe a possibilidade de duplicatas e conflitos. As diretrizes gerais a seguir se aplicam. Para tipos específicos de dicas, podem ser aplicadas regras adicionais, conforme indicado nas descrições das dicas.

* Dicas duplicadas: Para uma dica como `/*+ MRR(idx1) MRR(idx1) */`, o MySQL usa a primeira dica e emite um aviso sobre a dica duplicada.

* Dúvidas sobre os índices: Para um índice como `/*+ MRR(idx1) NO_MRR(idx1) */`, o MySQL usa o primeiro índice e emite um aviso sobre o segundo índice que entra em conflito.

Os nomes dos blocos de consulta são identificadores e seguem as regras habituais sobre quais nomes são válidos e como citá-los (consulte a Seção 9.2, "Nomes de Objetos do Esquema").

Os nomes de dicas, nomes de blocos de consulta e nomes de estratégias não são sensíveis ao caso. As referências a nomes de tabela e índice seguem as regras habituais de sensibilidade ao caso de identificadores (ver Seção 9.2.3, “Sensibilidade ao caso do identificador”).

#### Dicas de otimização de nível de tabela

Os indicadores de nível de tabela afetam o uso dos algoritmos de processamento de junção de Bloco de Busca Nestabilizada (BNL) e Acesso de Chave em Batel (BKA) (consulte a Seção 8.2.1.11, “Junções de Bloco de Busca Nestabilizada e Acesso de Chave em Batel”). Esses tipos de indicação se aplicam a tabelas específicas ou a todas as tabelas em um bloco de consulta.

Sintaxe de dicas de nível de tabela:

```sql
hint_name([@query_block_name] [tbl_name [, tbl_name] ...])
hint_name([tbl_name@query_block_name [, tbl_name@query_block_name] ...])
```

A sintaxe refere-se a esses termos:

* *`hint_name`*: Esses nomes indicativos são permitidos:

+ `BKA`, `NO_BKA`: Ative ou desative o BKA para as tabelas especificadas.

+ `BNL`, `NO_BNL`: Ative ou desative o BNL para as tabelas especificadas.

Nota

Para usar uma dica do BNL ou do BKA para habilitar o bufferamento de junção para qualquer tabela interna de uma junção externa, o bufferamento de junção deve ser habilitado para todas as tabelas internas da junção externa.

* *`tbl_name`*: O nome de uma tabela usada na declaração. O aviso se aplica a todas as tabelas que ele nomeia. Se o aviso não nomear nenhuma tabela, ele se aplica a todas as tabelas do bloco de consulta em que ocorre.

Se uma tabela tiver um alias, as dicas devem se referir ao alias, não ao nome da tabela.

Os nomes das tabelas nas dicas não podem ser qualificados com nomes de esquema.

* *`query_block_name`*: O bloco de consulta ao qual o indicativo se aplica. Se o indicativo não incluir o `@query_block_name` inicial, o indicativo se aplica ao bloco de consulta no qual ele ocorre. Para a sintaxe `tbl_name@query_block_name`, o indicativo se aplica à tabela nomeada no bloco de consulta nomeado. Para atribuir um nome a um bloco de consulta, consulte Sugestões do otimizador para nomear blocos de consulta.

Exemplos:

```sql
SELECT /*+ NO_BKA(t1, t2) */ t1.* FROM t1 INNER JOIN t2 INNER JOIN t3;
SELECT /*+ NO_BNL() BKA(t1) */ t1.* FROM t1 INNER JOIN t2 INNER JOIN t3;
```

Uma dica de nível de tabela se aplica a tabelas que recebem registros de tabelas anteriores, não de tabelas de remetente. Considere esta declaração:

```sql
SELECT /*+ BNL(t2) */ FROM t1, t2;
```

Se o otimizador optar por processar `t1` primeiro, ele aplica uma junção Bloco em Nó Envolto a `t2` ao bufferizar as strings de `t1` antes de começar a ler a partir de `t2`. Se, em vez disso, o otimizador optar por processar `t2` primeiro, a dica não tem efeito porque `t2` é uma tabela de emissor.

#### Dicas de otimização de nível de índice

Os indicadores de nível de índice afetam as estratégias de processamento de índice que o otimizador usa para tabelas ou índices específicos. Esses tipos de indicação afetam o uso do Index Condition Pushdown (ICP), Multi-Range Read (MRR) e otimizações de intervalo (consulte a Seção 8.2.1, “Otimizando declarações SELECT”).

Sintaxe das dicas de nível de índice:

```sql
hint_name([@query_block_name] tbl_name [index_name [, index_name] ...])
hint_name(tbl_name@query_block_name [index_name [, index_name] ...])
```

A sintaxe refere-se a esses termos:

* *`hint_name`*: Esses nomes indicativos são permitidos:

+ `MRR`, `NO_MRR`: Ative ou desative o MRR para a tabela ou índices especificados. As dicas de MRR se aplicam apenas às tabelas `InnoDB` e `MyISAM`.

+ `NO_ICP`: Desative o ICP para a tabela ou índices especificados. Por padrão, o ICP é uma estratégia de otimização candidata, portanto, não há dica para ativá-lo.

+ `NO_RANGE_OPTIMIZATION`: Desabilitar o acesso ao intervalo de índice para a tabela ou índices especificados. Esse aviso também desabilita a Mesclagem de índice e a varredura de índice solta para a tabela ou índices. Por padrão, o acesso ao intervalo é uma estratégia de otimização candidata, então não há aviso para habilitá-lo.

Essa dica pode ser útil quando o número de faixas pode ser alto e a otimização das faixas exigiria muitos recursos.

* *`tbl_name`*: A tabela à qual o aviso se aplica.

* *`index_name`*: O nome de um índice na tabela nomeada. O aviso se aplica a todos os índices que ele nomeia. Se o aviso não nomear nenhum índice, ele se aplica a todos os índices na tabela.

Para se referir a uma chave primária, use o nome `PRIMARY`. Para ver os nomes dos índices de uma tabela, use `SHOW INDEX`.

* *`query_block_name`*: O bloco de consulta ao qual o indicativo se aplica. Se o indicativo não incluir `@query_block_name` no início, o indicativo se aplica ao bloco de consulta no qual ele ocorre. Para a sintaxe `tbl_name@query_block_name`, o indicativo se aplica à tabela nomeada no bloco de consulta nomeado. Para atribuir um nome a um bloco de consulta, consulte Sugestões do otimizador para nomear blocos de consulta.

Exemplos:

```sql
SELECT /*+ MRR(t1) */ * FROM t1 WHERE f2 <= 3 AND 3 <= f3;
SELECT /*+ NO_RANGE_OPTIMIZATION(t3 PRIMARY, f2_idx) */ f1
  FROM t3 WHERE f1 > 30 AND f1 < 33;
INSERT INTO t3(f1, f2, f3)
  (SELECT /*+ NO_ICP(t2) */ t2.f1, t2.f2, t2.f3 FROM t1,t2
   WHERE t1.f1=t2.f1 AND t2.f2 BETWEEN t1.f1
   AND t1.f2 AND t2.f2 + 1 >= t1.f1 + 1);
```

#### Dicas do otimizador de subconsultas

As dicas de subconsulta afetam se as transformações semijoin devem ser usadas e quais estratégias semijoin devem ser permitidas, e, quando semijoins não são usados, se a materialização de subconsulta ou as transformações `IN`-para-`EXISTS` devem ser usadas. Para mais informações sobre essas otimizações, consulte a Seção 8.2.2, “Otimizando subconsultas, tabelas derivadas e referências de visualização”.

Sintaxe de dicas que afetam estratégias de semijoin:

```sql
hint_name([@query_block_name] [strategy [, strategy] ...])
```

A sintaxe refere-se a esses termos:

* *`hint_name`*: Esses nomes indicativos são permitidos:

+ `SEMIJOIN`, `NO_SEMIJOIN`: Ative ou desative as estratégias de junção semijoinha nomeadas.

* *`strategy`*: Uma estratégia de semijoin que deve ser habilitada ou desabilitada. Esses nomes de estratégia são permitidos: `DUPSWEEDOUT`, `FIRSTMATCH`, `LOOSESCAN`, `MATERIALIZATION`.

Para dicas de `SEMIJOIN`, se não houver estratégias nomeadas, o semijoin é usado, se possível, com base nas estratégias habilitadas de acordo com a variável de sistema `optimizer_switch`. Se as estratégias forem nomeadas, mas inapropriadas para a declaração, é usado `DUPSWEEDOUT`.

Para dicas de `NO_SEMIJOIN`, se não houver estratégias nomeadas, o semijoin não é usado. Se as estratégias forem nomeadas e excluam todas as estratégias aplicáveis para a declaração, é usado `DUPSWEEDOUT`.

Se uma subconsulta estiver aninhada em outra e ambas forem unidas em uma semijoin de uma consulta externa, qualquer especificação de estratégias de semijoin para a consulta mais interna será ignorada. Os hints `SEMIJOIN` e `NO_SEMIJOIN` ainda podem ser usados para habilitar ou desabilitar transformações de semijoin para tais subconsultas aninhadas.

Se `DUPSWEEDOUT` estiver desativado, por vezes, o otimizador pode gerar um plano de consulta que está longe de ser ótimo. Isso ocorre devido à poda heurística durante a busca gananciosa, que pode ser evitada ao definir `optimizer_prune_level=0`.

Exemplos:

```sql
SELECT /*+ NO_SEMIJOIN(@subq1 FIRSTMATCH, LOOSESCAN) */ * FROM t2
  WHERE t2.a IN (SELECT /*+ QB_NAME(subq1) */ a FROM t3);
SELECT /*+ SEMIJOIN(@subq1 MATERIALIZATION, DUPSWEEDOUT) */ * FROM t2
  WHERE t2.a IN (SELECT /*+ QB_NAME(subq1) */ a FROM t3);
```

Sintaxe de dicas que afetam se deve usar materialização de subconsulta ou transformações de `IN` para `EXISTS`:

```sql
SUBQUERY([@query_block_name] strategy)
```

O nome do indicador é sempre `SUBQUERY`.

Para dicas de `SUBQUERY`, esses valores de *`strategy`* são permitidos: `INTOEXISTS`, `MATERIALIZATION`.

Exemplos:

```sql
SELECT id, a IN (SELECT /*+ SUBQUERY(MATERIALIZATION) */ a FROM t1) FROM t2;
SELECT * FROM t2 WHERE t2.a IN (SELECT /*+ SUBQUERY(INTOEXISTS) */ a FROM t1);
```

Para dicas de semijoin e `SUBQUERY`, um líder `@query_block_name` especifica o bloco de consulta ao qual a dica se aplica. Se a dica não incluir um líder `@query_block_name`, a dica se aplica ao bloco de consulta em que ocorre. Para atribuir um nome a um bloco de consulta, consulte Dicas do otimizador para nomear blocos de consulta.

Se um comentário de dica contiver várias dicas de subconsulta, a primeira é usada. Se houver outras dicas desse tipo, elas geram um aviso. Dicas de outros tipos são ignoradas silenciosamente.

#### Dicas de otimização do tempo de execução da declaração

O `MAX_EXECUTION_TIME` é permitido apenas para declarações `SELECT`. Ele coloca um limite *`N`* (um valor de tempo de espera em milissegundos) sobre o tempo que uma declaração é permitida para ser executada antes de o servidor terminá-la:

```sql
MAX_EXECUTION_TIME(N)
```

Exemplo com um tempo de espera de 1 segundo (1000 milissegundos):

```sql
SELECT /*+ MAX_EXECUTION_TIME(1000) */ * FROM t1 INNER JOIN t2 WHERE ...
```

A dica `MAX_EXECUTION_TIME(N)` define o tempo de espera para a execução de uma declaração em *`N`* milissegundos. Se esta opção estiver ausente ou se *`N`* for 0, o tempo de espera estabelecido pela variável de sistema `max_execution_time` se aplica.

O `MAX_EXECUTION_TIME` é aplicável da seguinte forma:

* Para declarações com múltiplos termos-chave `SELECT`, como uniões ou declarações com subconsultas, `MAX_EXECUTION_TIME` se aplica a toda a declaração e deve aparecer após o primeiro `SELECT`.

* Aplica-se a declarações `SELECT` somente de leitura. As declarações que não são somente de leitura são aquelas que invocam uma função armazenada que modifica dados como efeito colateral.

* Não se aplica às declarações `SELECT` em programas armazenados e é ignorado.

#### Dicas de otimização para o nomeação de blocos de consulta

As dicas de nível de tabela, nível de índice e subconsulta permitem que blocos de consulta específicos sejam nomeados como parte de sua sintaxe de argumento. Para criar esses nomes, use a dica `QB_NAME`, que atribui um nome ao bloco de consulta em que ocorre:

```sql
QB_NAME(name)
```

As dicas `QB_NAME` podem ser usadas para indicar de forma explícita, de maneira clara, quais blocos de consulta se aplicam a outras dicas. Elas também permitem que todas as dicas de nome de bloco que não são de consulta sejam especificadas em um único comentário de dica para uma compreensão mais fácil de declarações complexas. Considere a seguinte declaração:

```sql
SELECT ...
  FROM (SELECT ...
  FROM (SELECT ... FROM ...)) ...
```

Os índices `QB_NAME` atribuem nomes aos blocos de consulta na declaração:

```sql
SELECT /*+ QB_NAME(qb1) */ ...
  FROM (SELECT /*+ QB_NAME(qb2) */ ...
  FROM (SELECT /*+ QB_NAME(qb3) */ ... FROM ...)) ...
```

Em seguida, outros indicadores podem usar esses nomes para se referir aos blocos de consulta apropriados:

```sql
SELECT /*+ QB_NAME(qb1) MRR(@qb1 t1) BKA(@qb2) NO_MRR(@qb3t1 idx1, id2) */ ...
  FROM (SELECT /*+ QB_NAME(qb2) */ ...
  FROM (SELECT /*+ QB_NAME(qb3) */ ... FROM ...)) ...
```

O efeito resultante é o seguinte:

* `MRR(@qb1 t1)` se aplica à tabela `t1` no bloco de consulta `qb1`.

* `BKA(@qb2)` se aplica ao bloco de consulta `qb2`.

* `NO_MRR(@qb3 t1 idx1, id2)` se aplica aos índices `idx1` e `idx2` na tabela `t1` no bloco de consulta `qb3`.

Os nomes dos blocos de consulta são identificadores e seguem as regras habituais sobre quais nomes são válidos e como citá-los (consulte a Seção 9.2, "Nomes de Objetos do Esquema"). Por exemplo, um nome de bloco de consulta que contém espaços deve ser citado, o que pode ser feito usando barras:

```sql
SELECT /*+ BKA(@`my hint name`) */ ...
  FROM (SELECT /*+ QB_NAME(`my hint name`) */ ...) ...
```

Se o modo SQL `ANSI_QUOTES` estiver habilitado, também é possível citar os nomes dos blocos de consulta entre aspas duplas:

```sql
SELECT /*+ BKA(@"my hint name") */ ...
  FROM (SELECT /*+ QB_NAME("my hint name") */ ...) ...
```

### 8.9.4 Dicas de índice

Os índices indicam ao otimizador informações sobre como escolher índices durante o processamento de consultas. Os índices indicados aqui diferem dos índices indicados pelo otimizador, descritos na Seção 8.9.3, “Indícios do otimizador”. Os índices e os índices indicados pelo otimizador podem ser usados separadamente ou juntos.

Os índices de dicas se aplicam às declarações `SELECT` e `UPDATE`. Eles também funcionam com declarações multi-tabela `DELETE`, mas não com declarações de tabela única `DELETE`, conforme mostrado mais adiante nesta seção.

Os índices de dicas são especificados após o nome de uma tabela. (Para a sintaxe geral para especificar tabelas em uma declaração `SELECT`, consulte a Seção 13.2.9.2, “Cláusula JOIN”.) A sintaxe para se referir a uma tabela individual, incluindo índices de dicas, é a seguinte:

```sql
tbl_name [[AS] alias] [index_hint_list]

index_hint_list:
    index_hint [index_hint] ...

index_hint:
    USE {INDEX|KEY}
      [FOR {JOIN|ORDER BY|GROUP BY}] ([index_list])
  | {IGNORE|FORCE} {INDEX|KEY}
      [FOR {JOIN|ORDER BY|GROUP BY}] (index_list)

index_list:
    index_name [, index_name] ...
```

O `USE INDEX (index_list)` indica ao MySQL que use apenas um dos índices nomeados para encontrar as strings na tabela. A sintaxe alternativa `IGNORE INDEX (index_list)` indica ao MySQL que não use algum índice ou índices específicos. Esses indicativos são úteis se `EXPLAIN` mostrar que o MySQL está usando o índice errado da lista de índices possíveis.

O `FORCE INDEX` atua como o `USE INDEX (index_list)`, com a adição de que uma varredura de tabela é considerada *muito* cara. Em outras palavras, uma varredura de tabela é usada apenas se não houver nenhuma maneira de usar um dos índices nomeados para encontrar strings na tabela.

Cada pista requer nomes de índice, não de colunas. Para se referir a uma chave primária, use o nome `PRIMARY`. Para ver os nomes dos índices de uma tabela, use a declaração `SHOW INDEX` ou a tabela do Esquema de Informações `STATISTICS`.

Um valor * `index_name` não precisa ser um nome completo de índice. Pode ser um prefixo inequívoco de um nome de índice. Se um prefixo for ambíguo, ocorre um erro.

Exemplos:

```sql
SELECT * FROM table1 USE INDEX (col1_index,col2_index)
  WHERE col1=1 AND col2=2 AND col3=3;

SELECT * FROM table1 IGNORE INDEX (col3_index)
  WHERE col1=1 AND col2=2 AND col3=3;
```

A sintaxe para dicas de índice tem as seguintes características:

* É sintaticamente válido omitir *`index_list`* para `USE INDEX`, o que significa “não usar índices”. Omitir *`index_list`* para `FORCE INDEX` ou `IGNORE INDEX` é um erro de sintaxe.

* Você pode especificar o escopo de uma dica de índice adicionando uma cláusula `FOR` à dica. Isso oferece um controle mais detalhado sobre a seleção do plano de execução do otimizador para várias fases do processamento de consultas. Para afetar apenas os índices usados quando o MySQL decide como encontrar as strings na tabela e como processar junções, use `FOR JOIN`. Para influenciar o uso do índice para ordenação ou agrupamento de strings, use `FOR ORDER BY` ou `FOR GROUP BY`.

* Você pode especificar várias dicas de índice:

  ```sql
  SELECT * FROM t1 USE INDEX (i1) IGNORE INDEX FOR ORDER BY (i2) ORDER BY a;
  ```

Não é um erro nomear o mesmo índice em várias dicas (mesmo dentro da mesma dica):

  ```sql
  SELECT * FROM t1 USE INDEX (i1) USE INDEX (i1,i1);
  ```

No entanto, é um erro misturar `USE INDEX` e `FORCE INDEX` para a mesma tabela:

  ```sql
  SELECT * FROM t1 USE INDEX FOR JOIN (i1) FORCE INDEX FOR JOIN (i2);
  ```

Se uma dica de índice não incluir nenhuma cláusula `FOR`, o escopo da dica é aplicar a todas as partes da declaração. Por exemplo, esta dica:

```sql
IGNORE INDEX (i1)
```

é equivalente a esta combinação de dicas:

```sql
IGNORE INDEX FOR JOIN (i1)
IGNORE INDEX FOR ORDER BY (i1)
IGNORE INDEX FOR GROUP BY (i1)
```

Em MySQL 5.0, o escopo do indicador sem a cláusula `FOR` era aplicável apenas à recuperação de strings. Para fazer com que o servidor use esse comportamento mais antigo quando não houver a cláusula `FOR`, habilite a variável de sistema `old` na inicialização do servidor. Tenha cuidado ao habilitar essa variável em uma configuração de replicação. Com o registro binário baseado em declarações, ter diferentes modos para a fonte e réplicas pode levar a erros de replicação.

Quando os indicadores são processados, eles são coletados em uma única lista por tipo (`USE`, `FORCE`, `IGNORE`) e por escopo (`FOR JOIN`, `FOR ORDER BY`, `FOR GROUP BY`). Por exemplo:

```sql
SELECT * FROM t1
  USE INDEX () IGNORE INDEX (i2) USE INDEX (i1) USE INDEX (i2);
```

é equivalente a:

```sql
SELECT * FROM t1
   USE INDEX (i1,i2) IGNORE INDEX (i2);
```

Os indicadores de pista são aplicados para cada escopo na seguinte ordem:

1. `{USE|FORCE} INDEX` é aplicado se estiver presente. (Caso contrário, o conjunto de índices determinado pelo otimizador é utilizado.)

2. `IGNORE INDEX` é aplicado sobre o resultado do passo anterior. Por exemplo, as seguintes duas consultas são equivalentes:

   ```sql
   SELECT * FROM t1 USE INDEX (i1) IGNORE INDEX (i2) USE INDEX (i2);

   SELECT * FROM t1 USE INDEX (i1);
   ```

Para as pesquisas de `FULLTEXT`, as dicas de índice funcionam da seguinte forma:

* Para pesquisas em modo de linguagem natural, as dicas de índice são ignoradas silenciosamente. Por exemplo, `IGNORE INDEX(i1)` é ignorado sem aviso e o índice ainda é usado.

* Para pesquisas em modo booleano, as dicas de índice com `FOR ORDER BY` ou `FOR GROUP BY` são ignoradas silenciosamente. As dicas de índice com `FOR JOIN` ou sem o modificador `FOR` são respeitadas. Em contraste com a forma como as dicas se aplicam para pesquisas que não são `FULLTEXT`, a dica é usada para todas as fases da execução da consulta (encontrar strings e recuperação, agrupamento e ordenamento). Isso é verdadeiro mesmo que a dica seja dada para um índice que não é `FULLTEXT`.

Por exemplo, as seguintes duas consultas são equivalentes:

  ```sql
  SELECT * FROM t
    USE INDEX (index1)
    IGNORE INDEX FOR ORDER BY (index1)
    IGNORE INDEX FOR GROUP BY (index1)
    WHERE ... IN BOOLEAN MODE ... ;

  SELECT * FROM t
    USE INDEX (index1)
    WHERE ... IN BOOLEAN MODE ... ;
  ```

Os índices indicam que funcionam com as declarações `DELETE`, mas apenas se você usar a sintaxe de multitabela `DELETE`, como mostrado aqui:

```sql
mysql> EXPLAIN DELETE FROM t1 USE INDEX(col2)
    -> WHERE col1 BETWEEN 1 AND 100 AND COL2 BETWEEN 1 AND 100\G
ERROR 1064 (42000): You have an error in your SQL syntax; check the manual that
corresponds to your MySQL server version for the right syntax to use near 'use
index(col2) where col1 between 1 and 100 and col2 between 1 and 100' at line 1

mysql> EXPLAIN DELETE t1.* FROM t1 USE INDEX(col2)
    -> WHERE col1 BETWEEN 1 AND 100 AND COL2 BETWEEN 1 AND 100\G
*************************** 1. row ***************************
           id: 1
  select_type: DELETE
        table: t1
   partitions: NULL
         type: range
possible_keys: col2
          key: col2
      key_len: 5
          ref: NULL
         rows: 72
     filtered: 11.11
        Extra: Using where
1 row in set, 1 warning (0.00 sec)
```

### 8.9.5 O Modelo de Custo do Otimizador

Para gerar planos de execução, o otimizador utiliza um modelo de custo que é baseado em estimativas do custo de várias operações que ocorrem durante a execução da consulta. O otimizador tem um conjunto de "constantes de custo" compiladas disponíveis para tomar decisões sobre os planos de execução.

O otimizador também possui um banco de dados de estimativas de custo para uso durante a construção do plano de execução. Essas estimativas são armazenadas nas tabelas `server_cost` e `engine_cost` no banco de dados do sistema `mysql` e são configuráveis a qualquer momento. O propósito dessas tabelas é permitir que você ajuste facilmente as estimativas de custo que o otimizador usa quando tenta chegar a planos de execução de consulta.

* Modelo de Custos Operação Geral
* Banco de Dados do Modelo de Custos
* Fazendo Alterações no Banco de Dados do Modelo de Custos

#### Modelo de Custos Operação Geral

O modelo de custo do otimizador configurável funciona da seguinte maneira:

* O servidor lê as tabelas do modelo de custo na memória no momento do início e utiliza os valores na memória durante a execução. Qualquer estimativa de custo não `NULL` especificada nas tabelas tem precedência sobre a constante de custo padrão compilada. Qualquer estimativa `NULL` indica ao otimizador que utilize a constante de custo padrão compilada.

* Durante a execução, o servidor pode reler as tabelas de custo. Isso ocorre quando um mecanismo de armazenamento é carregado dinamicamente ou quando uma declaração `FLUSH OPTIMIZER_COSTS` é executada.

* As tabelas de custos permitem que os administradores de servidores ajustem facilmente as estimativas de custo, alterando as entradas nas tabelas. Também é fácil retornar a um padrão ao definir o custo de uma entrada como `NULL`. O otimizador utiliza os valores de custo de memória, portanto, as alterações nas tabelas devem ser seguidas por `FLUSH OPTIMIZER_COSTS` para produzir efeito.

* As estimativas de custo de memória que são atuais quando uma sessão do cliente começa se aplicam durante toda a sessão até que ela termine. Em particular, se o servidor reler as tabelas de custo, quaisquer estimativas alteradas se aplicam apenas a sessões subsequentemente iniciadas. As sessões existentes não são afetadas.

* As tabelas de custo são específicas para uma instância de servidor dada. O servidor não replica as alterações da tabela de custo para réplicas.

#### Banco de Dados do Modelo de Custos

O banco de dados do modelo de custo otimizador consiste em duas tabelas no banco de dados do sistema `mysql` que contêm informações de estimativa de custo para operações que ocorrem durante a execução da consulta:

* `server_cost`: Estimativas de custo do otimizador para operações gerais de servidor

* `engine_cost`: Estimativas de custo do otimizador para operações específicas de motores de armazenamento

A tabela `server_cost` contém essas colunas:

* `cost_name`

O nome de uma estimativa de custo utilizada no modelo de custo. O nome não é sensível ao caso. Se o servidor não reconhecer o nome do custo ao ler esta tabela, ele escreve um aviso no log de erro.

* `cost_value`

O valor da estimativa de custo. Se o valor não for `NULL`, o servidor o usa como custo. Caso contrário, ele usa a estimativa padrão (o valor compilado). Os DBAs podem alterar uma estimativa de custo atualizando esta coluna. Se o servidor encontrar que o valor do custo é inválido (não positivo) ao ler esta tabela, ele escreve um aviso no log de erro.

Para substituir uma estimativa de custo padrão (para uma entrada que especifica `NULL`), defina o custo para um valor que não seja `NULL`. Para retornar ao padrão, defina o valor para `NULL`. Em seguida, execute `FLUSH OPTIMIZER_COSTS` para informar ao servidor que leia novamente as tabelas de custo.

* `last_update`

O horário da última atualização da última string.

* `comment`

Um comentário descritivo associado à estimativa de custo. Os DBA podem usar essa coluna para fornecer informações sobre por que uma string de estimativa de custo armazena um valor específico.

A chave primária da tabela `server_cost` é a coluna `cost_name`, portanto, não é possível criar várias entradas para qualquer estimativa de custo.

O servidor reconhece esses valores `cost_name` para a tabela `server_cost`:

* `disk_temptable_create_cost` (padrão 40,0), `disk_temptable_row_cost` (padrão 1,0)

As estimativas de custo para tabelas temporárias criadas internamente armazenadas em um mecanismo de armazenamento baseado em disco (seja `InnoDB` ou `MyISAM`). Aumentar esses valores aumenta a estimativa de custo do uso de tabelas temporárias internas e faz com que o otimizador prefira planos de consulta com menos uso delas. Para informações sobre tais tabelas, consulte a Seção 8.4.4, “Uso de Tabela Temporária Interna no MySQL”.

Os valores padrão maiores para esses parâmetros de disco em comparação com os valores padrão para os parâmetros de memória correspondentes (`memory_temptable_create_cost`, `memory_temptable_row_cost`) refletem o maior custo do processamento de tabelas baseadas em disco.

* `key_compare_cost` (padrão 0,1)

O custo de comparar chaves de registro. Aumentar esse valor faz com que um plano de consulta que compara muitas chaves se torne mais caro. Por exemplo, um plano de consulta que executa um `filesort` se torna relativamente mais caro em comparação com um plano de consulta que evita a ordenação usando um índice.

* `memory_temptable_create_cost` (padrão 2,0), `memory_temptable_row_cost` (padrão 0,2)

As estimativas de custo para tabelas temporárias internamente criadas armazenadas no mecanismo de armazenamento `MEMORY`. Aumentar esses valores aumenta a estimativa de custo do uso de tabelas temporárias internas e faz com que o otimizador prefira planos de consulta com menos uso delas. Para informações sobre essas tabelas, consulte a Seção 8.4.4, “Uso de Tabela Temporária Interna em MySQL”.

Os valores padrão menores para esses parâmetros de memória em comparação com os valores padrão para os parâmetros correspondentes do disco (`disk_temptable_create_cost`, `disk_temptable_row_cost`) refletem o menor custo de processamento de tabelas baseadas em memória.

* `row_evaluate_cost` (padrão 0,2)

O custo de avaliar condições de registro. Aumentar esse valor faz com que um plano de consulta que examina muitas strings se torne mais caro em comparação com um plano de consulta que examina menos strings. Por exemplo, uma varredura de tabela se torna relativamente mais cara em comparação com uma varredura de intervalo que lê menos strings.

A tabela `engine_cost` contém essas colunas:

* `engine_name`

O nome do motor de armazenamento ao qual esta estimativa de custo se aplica. O nome não é sensível ao caso. Se o valor for `default`, ele se aplica a todos os motores de armazenamento que não têm uma entrada nomeada própria. Se o servidor não reconhecer o nome do motor ao ler esta tabela, ele escreve um aviso no log de erro.

* `device_type`

O tipo de dispositivo para o qual esta estimativa de custo se aplica. A coluna é destinada a especificar diferentes estimativas de custo para diferentes tipos de dispositivos de armazenamento, como discos rígidos em comparação com unidades de estado sólido. Atualmente, essa informação não é usada e 0 é o único valor permitido.

* `cost_name`

O mesmo que na tabela `server_cost`.

* `cost_value`

O mesmo que na tabela `server_cost`.

* `last_update`

O mesmo que na tabela `server_cost`.

* `comment`

O mesmo que na tabela `server_cost`.

A chave primária da tabela `engine_cost` é uma tupla que compreende as colunas (`cost_name`, `engine_name`, `device_type`) e, portanto, não é possível criar várias entradas para qualquer combinação de valores nessas colunas.

O servidor reconhece esses valores `cost_name` para a tabela `engine_cost`:

* `io_block_read_cost` (padrão 1,0)

O custo de ler um índice ou bloco de dados do disco. Aumentar esse valor faz com que um plano de consulta que lê muitos blocos de disco se torne mais caro em comparação com um plano de consulta que lê menos blocos de disco. Por exemplo, uma varredura de tabela se torna relativamente mais cara em comparação com uma varredura de intervalo que lê menos blocos.

* `memory_block_read_cost` (padrão 1,0)

Semelhante a `io_block_read_cost`, mas representa o custo de leitura de um índice ou bloco de dados de um buffer de banco de dados em memória.

Se os valores de `io_block_read_cost` e `memory_block_read_cost` forem diferentes, o plano de execução pode mudar entre duas execuções da mesma consulta. Suponha que o custo para acesso à memória seja menor que o custo para acesso ao disco. Nesse caso, na inicialização do servidor, antes de os dados terem sido lidos na piscina de buffers, você pode obter um plano diferente do que após a execução da consulta, porque, nesse caso, os dados estão na memória.

#### Fazendo alterações no banco de dados do modelo de custo

Para os DBAs que desejam alterar os parâmetros do modelo de custo em relação aos seus valores padrão, tente dobrar ou reduzir a metade o valor e medir o efeito.

Alterações nos parâmetros `io_block_read_cost` e `memory_block_read_cost` provavelmente produzirão resultados valiosos. Esses valores de parâmetro permitem que modelos de custo para métodos de acesso a dados considerem os custos de leitura de informações de diferentes fontes; ou seja, o custo de leitura de informações de disco em comparação com a leitura de informações já em um buffer de memória. Por exemplo, se todas as outras coisas forem iguais, definir `io_block_read_cost` para um valor maior que `memory_block_read_cost` faz com que o otimizador prefira planos de consulta que leem informações já mantidas na memória em comparação com planos que devem ler do disco.

Este exemplo mostra como alterar o valor padrão para `io_block_read_cost`:

```sql
UPDATE mysql.engine_cost
  SET cost_value = 2.0
  WHERE cost_name = 'io_block_read_cost';
FLUSH OPTIMIZER_COSTS;
```

Este exemplo mostra como alterar o valor de `io_block_read_cost` apenas para o mecanismo de armazenamento `InnoDB`:

```sql
INSERT INTO mysql.engine_cost
  VALUES ('InnoDB', 0, 'io_block_read_cost', 3.0,
  CURRENT_TIMESTAMP, 'Using a slower disk for InnoDB');
FLUSH OPTIMIZER_COSTS;
```
