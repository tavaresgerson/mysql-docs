## 10.9 Controlar o Otimizador de Consulta

O MySQL oferece controle de otimizador através de variáveis do sistema que afetam a forma como os planos de consulta são avaliados, otimizações comutadas, dicas de otimizador e índice, e o modelo de custo do otimizador.

O servidor mantém estatísticas de histograma sobre os valores das colunas na tabela do dicionário de dados `column_statistics` (consulte a Seção 10.9.6, “Estatísticas do otimizador”). Assim como outras tabelas do dicionário de dados, essa tabela não é diretamente acessível pelos usuários. Em vez disso, você pode obter informações de histograma realizando uma consulta ao `INFORMATION_SCHEMA.COLUMN_STATISTICS`, que é implementado como uma visão na tabela do dicionário de dados. Você também pode realizar a gestão de histograma usando a declaração `ANALYZE TABLE`.

### 10.9.1 Controle da avaliação do plano de consulta

A tarefa do otimizador de consultas é encontrar um plano ótimo para executar uma consulta SQL. Como a diferença de desempenho entre os planos "bom" e "ruim" pode ser de ordens de grandeza (ou seja, segundos versus horas ou até dias), a maioria dos otimizadores de consultas, incluindo o do MySQL, realiza uma busca mais ou menos exaustiva por um plano ótimo entre todos os planos possíveis de avaliação de consultas. Para consultas de junção, o número de planos possíveis investigados pelo otimizador do MySQL cresce exponencialmente com o número de tabelas referenciadas em uma consulta. Para um pequeno número de tabelas (tipicamente menos de 7 a 10), isso não é um problema. No entanto, quando consultas maiores são enviadas, o tempo gasto na otimização da consulta pode facilmente se tornar o principal gargalo no desempenho do servidor.

Um método mais flexível para otimização de consultas permite que o usuário controle quão exhaustivo o otimizador é em sua busca por um plano de avaliação de consulta ótimo. A ideia geral é que, quanto menos planos são investigados pelo otimizador, menos tempo ele gasta na compilação de uma consulta. Por outro lado, como o otimizador ignora alguns planos, pode não encontrar um plano ótimo.

O comportamento do otimizador em relação ao número de planos que ele avalia pode ser controlado usando duas variáveis do sistema:

* A variável `optimizer_prune_level` indica ao otimizador que ignore certos planos com base em estimativas do número de linhas acessadas para cada tabela. Nossa experiência mostra que esse tipo de "gasto educado" raramente erra planos ótimos e pode reduzir drasticamente os tempos de compilação das consultas. É por isso que essa opção está ativada (`optimizer_prune_level=1`) por padrão. No entanto, se você acredita que o otimizador errou um plano de consulta melhor, essa opção pode ser desativada (`optimizer_prune_level=0`) com o risco de que a compilação da consulta possa levar muito mais tempo. Note que, mesmo com o uso dessa heurística, o otimizador ainda explora um número aproximadamente exponencial de planos.

* A variável `optimizer_search_depth` indica até que ponto no "futuro" de cada plano incompleto o otimizador deve procurar para avaliar se ele deve ser expandido ainda mais. Valores menores de `optimizer_search_depth` podem resultar em tempos de compilação de consultas de ordem de magnitude menores. Por exemplo, consultas com 12, 13 ou mais tabelas podem facilmente exigir horas e até dias para compilação, se `optimizer_search_depth` estiver próximo ao número de tabelas na consulta. Ao mesmo tempo, se compilada com `optimizer_search_depth` igual a 3 ou 4, o otimizador pode compilar em menos de um minuto para a mesma consulta. Se você não tem certeza do que é um valor razoável para `optimizer_search_depth`, essa variável pode ser definida como 0 para indicar ao otimizador que determine o valor automaticamente.

### 10.9.2 Otimizações Desconectables
### 10.9.3 Otimizações Desconectables
### 10.9.4 Otimizações Desconectables
### 10.9.5 Otimizações Desconectables
### 10.9.6 Otimizações Desconectables
### 10.9.7 Otimizações Desconectables
### 10.9.8 Otimizações Desconectables
### 10.9.9 Otimizações Desconectables

A variável de sistema `optimizer_switch` permite o controle do comportamento do otimizador. Seu valor é um conjunto de flags, cada uma com um valor de `on` ou `off` para indicar se o comportamento do otimizador correspondente está habilitado ou desabilitado. Esta variável tem valores globais e de sessão e pode ser alterada em tempo de execução. O valor padrão global pode ser definido na inicialização do servidor.

Para ver o conjunto atual de flags do otimizador, selecione o valor da variável:

```
mysql> SELECT @@optimizer_switch\G
*************************** 1. row ***************************
@@optimizer_switch: index_merge=on,index_merge_union=on,
                    index_merge_sort_union=on,index_merge_intersection=on,
                    engine_condition_pushdown=on,index_condition_pushdown=on,
                    mrr=on,mrr_cost_based=on,block_nested_loop=on,
                    batched_key_access=off,materialization=on,semijoin=on,
                    loosescan=on,firstmatch=on,duplicateweedout=on,
                    subquery_materialization_cost_based=on,
                    use_index_extensions=on,condition_fanout_filter=on,
                    derived_merge=on,use_invisible_indexes=off,skip_scan=on,
                    hash_join=on,subquery_to_derived=off,
                    prefer_ordering_index=on,hypergraph_optimizer=off,
                    derived_condition_pushdown=on
1 row in set (0.00 sec)
```

Para alterar o valor de `optimizer_switch`, atribua um valor que consista em uma lista de comandos separados por vírgula de um ou mais comandos:

```
SET [GLOBAL|SESSION] optimizer_switch='command[,command]...';
```

Cada valor *`command`* deve ter uma das formas mostradas na tabela a seguir.

<table summary="The syntax of the command value for SET optimizer_switch commands."><col style="width: 25%"/><col style="width: 75%"/><thead><tr> <th>Command Syntax</th> <th>Significado</th> </tr></thead><tbody><tr> <td><code>default</code></td> <td>Redefinir todas as otimizações para seu valor padrão</td> </tr><tr> <td><code><em class="replaceable"><code>opt_name</code></em>=default</code></td> <td>Defina a otimização nomeada para seu valor padrão</td> </tr><tr> <td><code><em class="replaceable"><code>opt_name</code></em>=off</code></td> <td>Desative a otimização nomeada</td> </tr><tr> <td><code><em class="replaceable"><code>opt_name</code></em>=on</code></td> <td>Ative a otimização nomeada</td> </tr></tbody></table>

A ordem dos comandos no valor não importa, embora o comando `default` seja executado primeiro, se estiver presente. Definir uma bandeira *`opt_name`* para `default` define-a como a que, entre `on` ou `off`, é seu valor padrão. Especificar qualquer *`opt_name`* dado mais de uma vez no valor não é permitido e causa um erro. Quaisquer erros no valor fazem com que a atribuição falhe com um erro, deixando o valor de `optimizer_switch` inalterado.

A lista a seguir descreve os nomes das bandeiras *`opt_name`* permitidos, agrupados por estratégia de otimização:

* Fлагаres de acesso chave em lote

+ `batched_key_access` (padrão `off`)

Controles para o uso do algoritmo de junção BKA.

Para que `batched_key_access` tenha algum efeito quando definido como `on`, a bandeira `mrr` também deve ser `on`. Atualmente, a estimativa de custo para MRR é muito pessimista. Portanto, também é necessário que `mrr_cost_based` seja `off` para que o BKA seja utilizado.

Para mais informações, consulte a Seção 10.2.1.12, “Conjuntos de acesso a chave em lote e junções de laço aninhado”.

* Bloquear bandeiras de laço aninhado

+ `block_nested_loop` (padrão `on`)

O controle do uso do algoritmo de junção BNL faz parte. No MySQL 8.0.18 e versões posteriores, isso também controla o uso de junções de hash, assim como as dicas de otimização `BNL` e `NO_BNL`. No MySQL 8.0.20 e versões posteriores, o suporte a loop aninhado é removido do servidor MySQL, e essa bandeira controla o uso de junções de hash apenas, assim como as dicas de otimização referenciadas.

Para mais informações, consulte a Seção 10.2.1.12, “Conjuntos de acesso a chave em lote e junções de laço aninhado”.

* Indicadores de filtragem de condição

+ `condition_fanout_filter` (padrão `on`)

Controle o uso do filtro de condição.

Para mais informações, consulte a Seção 10.2.1.13, “Filtragem de Condições”.

* Fлагаdos de empurrão de condição derivada

+ `derived_condition_pushdown` (padrão `on`)

Controle derivado da condição pushdown.

Para mais informações, consulte a Seção 10.2.2.5, “Otimização de empurrão de condição derivada”

* Mergulho de tabelas derivadas de bandeiras

+ `derived_merge` (padrão `on`)

Controles para a fusão de tabelas e visualizações derivadas no bloco de consulta externa.

A bandeira `derived_merge` controla se o otimizador tenta combinar tabelas derivadas, referências de visão e expressões de tabela comuns no bloco da consulta externa, assumindo que nenhuma outra regra impeça a combinação; por exemplo, uma diretiva `ALGORITHM` para uma visão tem precedência sobre o ajuste `derived_merge`. Por padrão, a bandeira é `on` para habilitar a combinação.

Para mais informações, consulte [Seção 10.2.2.4, “Otimizando tabelas derivadas, referências de visão e expressões de tabela comuns com junção ou materialização”][(derived-table-optimization.html "10.2.2.4 Optimizing Derived Tables, View References, and Common Table Expressions with Merging or Materialization")].

* Marcadores de condição do motor

+ `engine_condition_pushdown` (padrão `on`)

Controle a condição do motor em baixa pressão.

Para mais informações, consulte a Seção 10.2.1.5, “Otimização de empurrar o estado do motor”.

* Fлагаres de junção hash

+ `hash_join` (padrão `on`)

Controla as junções hash apenas no MySQL 8.0.18 e não tem efeito em nenhuma versão subsequente. No MySQL 8.0.19 e posterior, para controlar o uso de junção hash, use a bandeira `block_nested_loop`, em vez disso.

Para mais informações, consulte a Seção 10.2.1.4, “Otimização do Join Hash”.

* Índices Condição Pushdown de Flashes

+ `index_condition_pushdown` (padrão `on`)

Controle de condição de índice pushdown.

Para mais informações, consulte a Seção 10.2.1.6, “Otimização da Pushdown do Índice Condition”.

* Indicadores de extensões de bandeira

+ `use_index_extensions` (padrão `on`)

Controle o uso de extensões de índice.

Para mais informações, consulte a Seção 10.3.10, “Uso de extensões de índice”.

* Fлагаres de junção de índice

+ `index_merge` (padrão `on`)

Controla todas as otimizações de junção de índice.

+ `index_merge_intersection` (padrão `on`)

Controla a otimização da interseção de junção de índice.

+ `index_merge_sort_union` (padrão `on`)

Controla a otimização da união de índices, ordenação por índice e acesso.

+ `index_merge_union` (padrão `on`)

Controla a otimização da união de junção de índice.

Para mais informações, consulte a Seção 10.2.1.3, “Otimização da Mesclagem de Índices”.

* Indicadores de visibilidade

+ `use_invisible_indexes` (padrão `off`)

Controle o uso de índices invisíveis.

Para mais informações, consulte a Seção 10.3.12, “Indeks invisíveis”.

* Fлагаres de otimização de limite

+ `prefer_ordering_index` (padrão `on`)

Controla se, no caso de uma consulta que tenha um `ORDER BY` ou `GROUP BY` com uma cláusula `LIMIT`, o otimizador tenta usar um índice ordenado em vez de um índice não ordenado, um filesort ou outra otimização. Essa otimização é realizada por padrão sempre que o otimizador determina que, ao usá-la, seria possível executar a consulta mais rapidamente.

Como o algoritmo que faz essa determinação não pode lidar com todos os casos concebíveis (em parte devido à suposição de que a distribuição dos dados é sempre mais ou menos uniforme), há casos em que essa otimização pode não ser desejável. Antes do MySQL 8.0.21, não era possível desativar essa otimização, mas no MySQL 8.0.21 e versões posteriores, embora permaneça o comportamento padrão, pode ser desativada definindo a bandeira `prefer_ordering_index` para `off`.

Para mais informações e exemplos, consulte a Seção 10.2.1.19, “Otimização da consulta LIMIT”.

* Leitura de bandeiras de várias faixas

+ `mrr` (padrão `on`)

Controla a estratégia de leitura de Multi-Range.

+ `mrr_cost_based` (padrão `on`)

Controle o uso do MRR baseado em custos se `mrr=on`.

Para mais informações, consulte a Seção 10.2.1.11, “Otimização da leitura de várias faixas”.

* Bandeiras de Semijoin

+ `duplicateweedout` (padrão `on`)

Controla a estratégia de semijoin Duplicate Weedout.

+ `firstmatch` (padrão `on`)

Controla a estratégia semijoin FirstMatch.

+ `loosescan` (padrão `on`)

Controla a estratégia semijoin LooseScan (não confundir com Loose Index Scan para `GROUP BY`).

+ `semijoin` (padrão `on`)

Controla todas as estratégias de semijoin.

Em MySQL 8.0.17 e versões posteriores, isso também se aplica à otimização de antijoin.

As bandeiras `semijoin`, `firstmatch`, `loosescan` e `duplicateweedout` permitem o controle de estratégias de semijoin. A bandeira `semijoin` controla se semijoins são usados. Se estiver definida como `on`, as bandeiras `firstmatch` e `loosescan` permitem um controle mais preciso sobre as estratégias de semijoin permitidas.

Se a estratégia de junção semijoinha `duplicateweedout` estiver desativada, ela não será usada, a menos que todas as outras estratégias aplicáveis também estejam desativadas.

Se `semijoin` e `materialization` forem ambos `on`, os semijoins também utilizam materialização quando aplicável. Essas bandeiras são `on` por padrão.

Para mais informações, consulte [Seção 10.2.2.1, “Otimizando predicados de subconsultas IN e EXISTS com transformações Semijoin”][(semijoins.html "10.2.2.1 Optimizing IN and EXISTS Subquery Predicates with Semijoin Transformations")].

* Ignorar bandeiras de varredura

+ `skip_scan` (padrão `on`)

Controles para o uso do método de acesso Skip Scan.

Para mais informações, consulte o método de acesso sem intervalo de varredura.

* Indicadores de materialização de subconsulta

+ `materialization` (padrão `on`)

Controles de materialização (incluindo materialização semijoin).

+ `subquery_materialization_cost_based` (padrão `on`)

Use a opção de materialização baseada em custos.

A bandeira `materialization` controla se a materialização de subconsulta é usada. Se `semijoin` e `materialization` estão ambos `on`, semijoins também usam materialização onde aplicável. Essas bandeiras são `on` por padrão.

A bandeira `subquery_materialization_cost_based` permite o controle sobre a escolha entre materialização de subconsulta e transformação de subconsulta de `IN` para `EXISTS`. Se a bandeira for `on` (a padrão), o otimizador realiza uma escolha baseada em custos entre materialização de subconsulta e transformação de subconsulta de `IN` para `EXISTS`, se qualquer um dos métodos puder ser utilizado. Se a bandeira for `off`, o otimizador escolhe materialização de subconsulta sobre transformação de subconsulta de `IN` para `EXISTS`.

Para mais informações, consulte [Seção 10.2.2, “Otimizando subconsultas, tabelas derivadas, referências de visão e expressões de tabela comum”][(subquery-optimization.html "10.2.2 Optimizing Subqueries, Derived Tables, View References, and Common Table Expressions")].

* Fлагаres de transformação de subconsulta

+ `subquery_to_derived` (padrão `off`)

A partir do MySQL 8.0.21, o otimizador pode, em muitos casos, transformar uma subconsulta escalar em uma cláusula `SELECT`, `WHERE`, `JOIN` ou `HAVING` em uma junção externa à esquerda em uma tabela derivada. (Dependendo da nulidade da tabela derivada, isso pode, às vezes, ser simplificado ainda mais para uma junção interna.) Isso pode ser feito para uma subconsulta que atenda às seguintes condições:

- A subconsulta não utiliza funções não determinísticas, como `RAND()`.

- A subconsulta não é uma subconsulta `ANY` ou `ALL`, que pode ser reescrita para usar `MIN()` ou `MAX()`.

- A consulta principal não define uma variável de usuário, pois reescrevê-la pode afetar a ordem de execução, o que poderia levar a resultados inesperados se a variável for acessada mais de uma vez na mesma consulta.

- A subconsulta não deve ser correlacionada, ou seja, não deve referenciar uma coluna de uma tabela na consulta externa, ou conter um agregado que seja avaliado na consulta externa.

Antes do MySQL 8.0.22, a subconsulta não podia conter uma cláusula `GROUP BY`.

Essa otimização também pode ser aplicada a uma subconsulta de tabela que é o argumento para `IN`, `NOT IN`, `EXISTS` ou `NOT EXISTS`, que não contém um `GROUP BY`.

O valor padrão para esta bandeira é `off`, pois, na maioria dos casos, habilitar esta otimização não produz nenhuma melhoria perceptível no desempenho (e, em muitos casos, pode até fazer com que as consultas sejam executadas mais lentamente), mas você pode habilitar a otimização definindo a bandeira `subquery_to_derived` para `on`. É destinado principalmente para uso em testes.

Exemplo, usando uma subconsulta escalar:

    ```
    d
    mysql> CREATE TABLE t1(a INT);

    mysql> CREATE TABLE t2(a INT);

    mysql> INSERT INTO t1 VALUES ROW(1), ROW(2), ROW(3), ROW(4);

    mysql> INSERT INTO t2 VALUES ROW(1), ROW(2);

    mysql> SELECT * FROM t1
        ->     WHERE t1.a > (SELECT COUNT(a) FROM t2);
    +------+
    | a    |
    +------+
    |    3 |
    |    4 |
    +------+

    mysql> SELECT @@optimizer_switch LIKE '%subquery_to_derived=off%';
    +-----------------------------------------------------+
    | @@optimizer_switch LIKE '%subquery_to_derived=off%' |
    +-----------------------------------------------------+
    |                                                   1 |
    +-----------------------------------------------------+

    mysql> EXPLAIN SELECT * FROM t1 WHERE t1.a > (SELECT COUNT(a) FROM t2)\G
    *************************** 1. row ***************************
               id: 1
      select_type: PRIMARY
            table: t1
       partitions: NULL
             type: ALL
    possible_keys: NULL
              key: NULL
          key_len: NULL
              ref: NULL
             rows: 4
         filtered: 33.33
            Extra: Using where
    *************************** 2. row ***************************
               id: 2
      select_type: SUBQUERY
            table: t2
       partitions: NULL
             type: ALL
    possible_keys: NULL
              key: NULL
          key_len: NULL
              ref: NULL
             rows: 2
         filtered: 100.00
            Extra: NULL

    mysql> SET @@optimizer_switch='subquery_to_derived=on';


    mysql> SELECT @@optimizer_switch LIKE '%subquery_to_derived=off%';
    +-----------------------------------------------------+
    | @@optimizer_switch LIKE '%subquery_to_derived=off%' |
    +-----------------------------------------------------+
    |                                                   0 |
    +-----------------------------------------------------+

    mysql> SELECT @@optimizer_switch LIKE '%subquery_to_derived=on%';
    +----------------------------------------------------+
    | @@optimizer_switch LIKE '%subquery_to_derived=on%' |
    +----------------------------------------------------+
    |                                                  1 |
    +----------------------------------------------------+

    mysql> EXPLAIN SELECT * FROM t1 WHERE t1.a > (SELECT COUNT(a) FROM t2)\G
    *************************** 1. row ***************************
               id: 1
      select_type: PRIMARY
            table: <derived2>
       partitions: NULL
             type: ALL
    possible_keys: NULL
              key: NULL
          key_len: NULL
              ref: NULL
             rows: 1
         filtered: 100.00
            Extra: NULL
    *************************** 2. row ***************************
               id: 1
      select_type: PRIMARY
            table: t1
       partitions: NULL
             type: ALL
    possible_keys: NULL
              key: NULL
          key_len: NULL
              ref: NULL
             rows: 4
         filtered: 33.33
            Extra: Using where; Using join buffer (hash join)
    *************************** 3. row ***************************
               id: 2
      select_type: DERIVED
            table: t2
       partitions: NULL
             type: ALL
    possible_keys: NULL
              key: NULL
          key_len: NULL
              ref: NULL
             rows: 2
         filtered: 100.00
            Extra: NULL
    ```

Como pode ser visto ao executar `SHOW WARNINGS` imediatamente após a segunda declaração (show-warnings.html "15.7.7.42 SHOW WARNINGS Statement"), com a otimização habilitada, a consulta `SELECT * FROM t1 WHERE t1.a > (SELECT COUNT(a) FROM t2)` é reescrita em uma forma semelhante àquela mostrada aqui:

    ```
    SELECT t1.a FROM t1
        JOIN  ( SELECT COUNT(t2.a) AS c FROM t2 ) AS d
                WHERE t1.a > d.c;
    ```

Exemplo, usando uma consulta com `IN (subquery)`:

    ```
    mysql> DROP TABLE IF EXISTS t1, t2;

    mysql> CREATE TABLE t1 (a INT, b INT);
    mysql> CREATE TABLE t2 (a INT, b INT);

    mysql> INSERT INTO t1 VALUES ROW(1,10), ROW(2,20), ROW(3,30);
    mysql> INSERT INTO t2
        ->    VALUES ROW(1,10), ROW(2,20), ROW(3,30), ROW(1,110), ROW(2,120), ROW(3,130);

    mysql> SELECT * FROM t1
        ->     WHERE   t1.b < 0
        ->             OR
        ->             t1.a IN (SELECT t2.a + 1 FROM t2);
    +------+------+
    | a    | b    |
    +------+------+
    |    2 |   20 |
    |    3 |   30 |
    +------+------+

    mysql> SET @@optimizer_switch="subquery_to_derived=off";

    mysql> EXPLAIN SELECT * FROM t1
        ->             WHERE   t1.b < 0
        ->                     OR
        ->                     t1.a IN (SELECT t2.a + 1 FROM t2)\G
    *************************** 1. row ***************************
               id: 1
      select_type: PRIMARY
            table: t1
       partitions: NULL
             type: ALL
    possible_keys: NULL
              key: NULL
          key_len: NULL
              ref: NULL
             rows: 3
         filtered: 100.00
            Extra: Using where
    *************************** 2. row ***************************
               id: 2
      select_type: DEPENDENT SUBQUERY
            table: t2
       partitions: NULL
             type: ALL
    possible_keys: NULL
              key: NULL
          key_len: NULL
              ref: NULL
             rows: 6
         filtered: 100.00
            Extra: Using where

    mysql> SET @@optimizer_switch="subquery_to_derived=on";

    mysql> EXPLAIN SELECT * FROM t1
        ->             WHERE   t1.b < 0
        ->                     OR
        ->                     t1.a IN (SELECT t2.a + 1 FROM t2)\G
    *************************** 1. row ***************************
               id: 1
      select_type: PRIMARY
            table: t1
       partitions: NULL
             type: ALL
    possible_keys: NULL
              key: NULL
          key_len: NULL
              ref: NULL
             rows: 3
         filtered: 100.00
            Extra: NULL
    *************************** 2. row ***************************
               id: 1
      select_type: PRIMARY
            table: <derived2>
       partitions: NULL
             type: ref
    possible_keys: <auto_key0>
              key: <auto_key0>
          key_len: 9
              ref: std2.t1.a
             rows: 2
         filtered: 100.00
            Extra: Using where; Using index
    *************************** 3. row ***************************
               id: 2
      select_type: DERIVED
            table: t2
       partitions: NULL
             type: ALL
    possible_keys: NULL
              key: NULL
          key_len: NULL
              ref: NULL
             rows: 6
         filtered: 100.00
            Extra: Using temporary
    ```

Verificar e simplificar o resultado do `SHOW WARNINGS` após executar o `EXPLAIN` nesta consulta mostra que, quando a bandeira `subquery_to_derived` está habilitada, `SELECT * FROM t1 WHERE t1.b < 0 OR t1.a IN (SELECT t2.a + 1 FROM t2)` é reescrito em uma forma semelhante àquela mostrada aqui:

    ```
    SELECT a, b FROM t1
        LEFT JOIN (SELECT DISTINCT a + 1 AS e FROM t2) d
        ON t1.a = d.e
        WHERE   t1.b < 0
                OR
                d.e IS NOT NULL;
    ```

Exemplo, usando uma consulta com `EXISTS (subquery)` e as mesmas tabelas e dados do exemplo anterior:

    ```
    mysql> SELECT * FROM t1
        ->     WHERE   t1.b < 0
        ->             OR
        ->             EXISTS(SELECT * FROM t2 WHERE t2.a = t1.a + 1);
    +------+------+
    | a    | b    |
    +------+------+
    |    1 |   10 |
    |    2 |   20 |
    +------+------+

    mysql> SET @@optimizer_switch="subquery_to_derived=off";

    mysql> EXPLAIN SELECT * FROM t1
        ->             WHERE   t1.b < 0
        ->                     OR
        ->                     EXISTS(SELECT * FROM t2 WHERE t2.a = t1.a + 1)\G
    *************************** 1. row ***************************
               id: 1
      select_type: PRIMARY
            table: t1
       partitions: NULL
             type: ALL
    possible_keys: NULL
              key: NULL
          key_len: NULL
              ref: NULL
             rows: 3
         filtered: 100.00
            Extra: Using where
    *************************** 2. row ***************************
               id: 2
      select_type: DEPENDENT SUBQUERY
            table: t2
       partitions: NULL
             type: ALL
    possible_keys: NULL
              key: NULL
          key_len: NULL
              ref: NULL
             rows: 6
         filtered: 16.67
            Extra: Using where

    mysql> SET @@optimizer_switch="subquery_to_derived=on";

    mysql> EXPLAIN SELECT * FROM t1
        ->             WHERE   t1.b < 0
        ->                     OR
        ->                     EXISTS(SELECT * FROM t2 WHERE t2.a = t1.a + 1)\G
    *************************** 1. row ***************************
               id: 1
      select_type: PRIMARY
            table: t1
       partitions: NULL
             type: ALL
    possible_keys: NULL
              key: NULL
          key_len: NULL
              ref: NULL
             rows: 3
         filtered: 100.00
            Extra: NULL
    *************************** 2. row ***************************
               id: 1
      select_type: PRIMARY
            table: <derived2>
       partitions: NULL
             type: ALL
    possible_keys: NULL
              key: NULL
          key_len: NULL
              ref: NULL
             rows: 6
         filtered: 100.00
            Extra: Using where; Using join buffer (hash join)
    *************************** 3. row ***************************
               id: 2
      select_type: DERIVED
            table: t2
       partitions: NULL
             type: ALL
    possible_keys: NULL
              key: NULL
          key_len: NULL
              ref: NULL
             rows: 6
         filtered: 100.00
            Extra: Using temporary
    ```

Se executarmos `SHOW WARNINGS`(show-warnings.html "15.7.7.42 SHOW WARNINGS Statement") após executarmos `EXPLAIN` na consulta `SELECT * FROM t1 WHERE t1.b < 0 OR EXISTS(SELECT * FROM t2 WHERE t2.a = t1.a + 1)` quando `subquery_to_derived` foi habilitado, e simplificar a segunda linha do resultado, vemos que ela foi reescrita em uma forma que se assemelha a esta:

    ```
    SELECT a, b FROM t1
    LEFT JOIN (SELECT DISTINCT 1 AS e1, t2.a AS e2 FROM t2) d
    ON t1.a + 1 = d.e2
    WHERE   t1.b < 0
            OR
            d.e1 IS NOT NULL;
    ```

Para mais informações, consulte a [Seção 10.2.2.4, “Otimização de tabelas derivadas, referências de visualização e expressões de tabela comuns com junção ou materialização”][(derived-table-optimization.html "10.2.2.4 Optimizing Derived Tables, View References, and Common Table Expressions with Merging or Materialization")], bem como a Seção 10.2.1.19, “Otimização da consulta LIMIT”, e [Seção 10.2.2.1, “Otimização de predicados de subconsultas IN e EXISTS com transformações de semijoin”][(semijoins.html "10.2.2.1 Optimizing IN and EXISTS Subquery Predicates with Semijoin Transformations")].

Quando você atribui um valor a `optimizer_switch`, as bandeiras que não são mencionadas mantêm seus valores atuais. Isso permite habilitar ou desabilitar comportamentos específicos do otimizador em uma única declaração sem afetar outros comportamentos. A declaração não depende do que outras bandeiras do otimizador existem e quais são seus valores. Suponha que todas as otimizações de Merge de Índices estejam habilitadas:

```
mysql> SELECT @@optimizer_switch\G
*************************** 1. row ***************************
@@optimizer_switch: index_merge=on,index_merge_union=on,
                    index_merge_sort_union=on,index_merge_intersection=on,
                    engine_condition_pushdown=on,index_condition_pushdown=on,
                    mrr=on,mrr_cost_based=on,block_nested_loop=on,
                    batched_key_access=off,materialization=on,semijoin=on,
                    loosescan=on, firstmatch=on,
                    subquery_materialization_cost_based=on,
                    use_index_extensions=on,condition_fanout_filter=on,
                    derived_merge=on,use_invisible_indexes=off,skip_scan=on,
                    hash_join=on,subquery_to_derived=off,
                    prefer_ordering_index=on
```

Se o servidor estiver usando os métodos de acesso de junção de índice ou junção de índice e índice de classificação-junção para certas consultas e você quiser verificar se o otimizador pode realizar melhor sem eles, defina o valor da variável da seguinte forma:

```
mysql> SET optimizer_switch='index_merge_union=off,index_merge_sort_union=off';

mysql> SELECT @@optimizer_switch\G
*************************** 1. row ***************************
@@optimizer_switch: index_merge=on,index_merge_union=off,
                    index_merge_sort_union=off,index_merge_intersection=on,
                    engine_condition_pushdown=on,index_condition_pushdown=on,
                    mrr=on,mrr_cost_based=on,block_nested_loop=on,
                    batched_key_access=off,materialization=on,semijoin=on,
                    loosescan=on, firstmatch=on,
                    subquery_materialization_cost_based=on,
                    use_index_extensions=on,condition_fanout_filter=on,
                    derived_merge=on,use_invisible_indexes=off,skip_scan=on,
                    hash_join=on,subquery_to_derived=off,
                    prefer_ordering_index=on
```

### 10.9.3 Dicas de otimizador

Uma forma de controle sobre as estratégias de otimização é definir a variável de sistema `optimizer_switch` (consulte a Seção 10.9.2, “Otimizações Desconectables”). Alterações nesta variável afetam a execução de todas as consultas subsequentes; para alterar uma consulta de forma diferente de outra, é necessário alterar `optimizer_switch` antes de cada uma.

Outra maneira de controlar o otimizador é usando dicas de otimizador, que podem ser especificadas dentro de declarações individuais. Como as dicas de otimizador são aplicadas por declaração, elas fornecem um controle mais fino sobre os planos de execução das declarações do que o que pode ser alcançado usando `optimizer_switch`. Por exemplo, você pode habilitar uma otimização para uma tabela em uma declaração e desabilitar a otimização para uma tabela diferente. As dicas dentro de uma declaração têm precedência sobre as flags `optimizer_switch`.

Exemplos:

```
SELECT /*+ NO_RANGE_OPTIMIZATION(t3 PRIMARY, f2_idx) */ f1
  FROM t3 WHERE f1 > 30 AND f1 < 33;
SELECT /*+ BKA(t1) NO_BKA(t2) */ * FROM t1 INNER JOIN t2 WHERE ...;
SELECT /*+ NO_ICP(t1, t2) */ * FROM t1 INNER JOIN t2 WHERE ...;
SELECT /*+ SEMIJOIN(FIRSTMATCH, LOOSESCAN) */ * FROM t1 ...;
EXPLAIN SELECT /*+ NO_ICP(t1) */ * FROM t1 WHERE ...;
SELECT /*+ MERGE(dt) */ * FROM (SELECT * FROM t1) AS dt;
INSERT /*+ SET_VAR(foreign_key_checks=OFF) */ INTO t2 VALUES(2);
```

Os indicadores de otimização, descritos aqui, diferem dos indicadores de índice, descritos na Seção 10.9.4, “Indicadores de índice”. Os indicadores de otimização e de índice podem ser usados separadamente ou juntos.

* Visão geral do Optimizer Hint
* Sintaxe do Optimizer Hint
* Dicas de otimização de ordem de junção
* Dicas de otimização de nível de tabela
* Dicas de otimização de nível de índice
* Dicas de otimização de subconsultas
* Dicas de otimização de tempo de execução de declaração
* Sintaxe de dica de definição de variáveis
* Sintaxe de dica de grupo de recursos
* Dicas de otimização de nomeação de blocos de consulta

#### Visão geral do Optimizer Hint

Os indicadores de otimização são aplicados em diferentes níveis de escopo:

* Global: O indicador afeta toda a declaração
* Bloco de consulta: O indicador afeta um bloco de consulta específico dentro de uma declaração

* Nível de tabela: O aviso afeta uma tabela específica dentro de um bloco de consulta

* Nível de índice: O indicador afeta um índice específico dentro de uma tabela

A tabela a seguir resume as dicas de otimização disponíveis, as estratégias de otimização que elas afetam e o escopo ou escopos em que elas se aplicam. Mais detalhes são fornecidos mais adiante.

**Tabela 10.2 Dicas de otimização disponíveis**

<table summary="Optimizer hint names, descriptions, and contexts in which they apply."><col style="width: 30%"/><col style="width: 40%"/><col style="width: 30%"/><thead><tr> <th scope="col">Hint Name</th> <th scope="col">Description</th> <th scope="col">Applicable Scopes</th> </tr></thead><tbody><tr> <th scope="row"><code>BKA</code>,<code>NO_BKA</code></th> <td>Afeta o processamento de junção de acesso chave em lote</td> <td>Bloco de consulta, tabela</td> </tr><tr> <th scope="row"><code>BNL</code>,<code>NO_BNL</code></th> <td>Antes do MySQL 8.0.20: afeta o processamento de junção Block Nested-Loop; MySQL 8.0.18 e versões posteriores: também afeta a otimização de junção hash; MySQL 8.0.20 e versões posteriores: afeta apenas a otimização de junção hash</td> <td>Bloco de consulta, tabela</td> </tr><tr> <th scope="row"><code>DERIVED_CONDITION_PUSHDOWN</code>,<code>NO_DERIVED_CONDITION_PUSHDOWN</code></th> <td>Use ou ignore a otimização de empurrar a condição derivada para tabelas derivadas materializadas (Adicionado no MySQL 8.0.22)</td> <td>Bloco de consulta, tabela</td> </tr><tr> <th scope="row"><code>GROUP_INDEX</code>,<code>NO_GROUP_INDEX</code></th> <td>Use ou ignore o índice ou índices especificados para varreduras de índice em<code>GROUP BY</code>operações (Adicionado no MySQL 8.0.20)</td> <td>Índice</td> </tr><tr> <th scope="row"><code>HASH_JOIN</code>,<code>NO_HASH_JOIN</code></th> <td>Afeta a otimização do Join Hash (apenas MySQL 8.0.18</td> <td>Bloco de consulta, tabela</td> </tr><tr> <th scope="row"><code>INDEX</code>, <code>NO_INDEX</code></th> <td>Acts as the combination of <code>JOIN_INDEX</code>, <code>GROUP_INDEX</code>, and <code>ORDER_INDEX</code>, or as the combination of <code>NO_JOIN_INDEX</code>, <code>NO_GROUP_INDEX</code>, and <code>NO_ORDER_INDEX</code> (Added in MySQL 8.0.20)</td> <td>Index</td> </tr><tr> <th scope="row"><code>INDEX_MERGE</code>,<code>NO_INDEX_MERGE</code></th> <td>Afeta a otimização da junção do índice</td> <td>Tabela, índice</td> </tr><tr> <th scope="row"><code>JOIN_FIXED_ORDER</code></th> <td>Utilize a ordem da tabela especificada em<code>FROM</code>cláusula para ordem de adesão</td> <td>Bloco de consulta</td> </tr><tr> <th scope="row"><code>JOIN_INDEX</code>,<code>NO_JOIN_INDEX</code></th> <td>Use ou ignore o índice ou índices especificados para qualquer método de acesso (Adicionado no MySQL 8.0.20)</td> <td>Índice</td> </tr><tr> <th scope="row"><code>JOIN_ORDER</code></th> <td>Use a ordem da tabela especificada no hint para a ordem de junção</td> <td>Bloco de consulta</td> </tr><tr> <th scope="row"><code>JOIN_PREFIX</code></th> <td>Utilize a ordem da tabela especificada no hint para as primeiras tabelas do pedido de junção</td> <td>Bloco de consulta</td> </tr><tr> <th scope="row"><code>JOIN_SUFFIX</code></th> <td>Use a ordem da tabela especificada no hint para as últimas tabelas do pedido de junção</td> <td>Bloco de consulta</td> </tr><tr> <th scope="row"><code>MAX_EXECUTION_TIME</code></th> <td>Limits statement execution time</td> <td>Global</td> </tr><tr> <th scope="row"><code>MERGE</code>, <code>NO_MERGE</code></th> <td>Affects derived table/view merging into outer query block</td> <td>Table</td> </tr><tr> <th scope="row"><code>MRR</code>,<code>NO_MRR</code></th> <td>Afeta a otimização da leitura em várias faixas de frequência</td> <td>Tabela, índice</td> </tr><tr> <th scope="row"><code>NO_ICP</code></th> <td>Afeta a condição do índice Otimização Pushdown</td> <td>Tabela, índice</td> </tr><tr> <th scope="row"><code>NO_RANGE_OPTIMIZATION</code></th> <td>Affects range optimization</td> <td>Table, index</td> </tr><tr> <th scope="row"><code>ORDER_INDEX</code>,<code>NO_ORDER_INDEX</code></th> <td>Use ou ignore o índice ou índices especificados para ordenar as linhas (Adicionado no MySQL 8.0.20)</td> <td>Índice</td> </tr><tr> <th scope="row"><code>QB_NAME</code></th> <td>Atribui nome ao bloco de consulta</td> <td>Bloco de consulta</td> </tr><tr> <th scope="row"><code>RESOURCE_GROUP</code></th> <td>Definir o grupo de recursos durante a execução da declaração</td> <td>Global</td> </tr><tr> <th scope="row"><code>SEMIJOIN</code>,<code>NO_SEMIJOIN</code></th> <td>Afeta estratégias de semijoin; começando com o MySQL 8.0.17, isso também se aplica a antijoins</td> <td>Bloco de consulta</td> </tr><tr> <th scope="row"><code>SKIP_SCAN</code>,<code>NO_SKIP_SCAN</code></th> <td>Afecta a otimização do exame saltatório</td> <td>Tabela, índice</td> </tr><tr> <th scope="row"><code>SET_VAR</code></th> <td>Set variable during statement execution</td> <td>Global</td> </tr><tr> <th scope="row"><code>SUBQUERY</code></th> <td>Afecta a materialização,<code>IN</code>-to-<code>EXISTS</code>estratégias de subconsulta</td> <td>Bloco de consulta</td> </tr></tbody></table>

Desativar uma otimização impede que o otimizador a use. Habilitar uma otimização significa que o otimizador está livre para usar a estratégia se ela se aplicar à execução da declaração, não que o otimizador a use necessariamente.

#### Sintaxe do Hint do Optimizer

O MySQL suporta comentários em declarações SQL conforme descrito na Seção 11.7, “Comentários”. Os indicadores do otimizador devem ser especificados dentro de comentários `/*+ ... */`. Ou seja, os indicadores do otimizador usam uma variante da sintaxe de comentário em estilo C `/* ... */`, com um caractere `+` após a sequência de abertura do comentário `/*`. Exemplos:

```
/*+ BKA(t1) */
/*+ BNL(t1, t2) */
/*+ NO_RANGE_OPTIMIZATION(t4 PRIMARY) */
/*+ QB_NAME(qb2) */
```

Espaços em branco são permitidos após o caractere `+`.

O analisador reconhece comentários de dica de otimização após a palavra-chave inicial das declarações `SELECT`, `UPDATE`, `INSERT`, `REPLACE` e `DELETE`. As dicas são permitidas nesses contextos:

* No início das declarações de consulta e mudança de dados:

  ```
  SELECT /*+ ... */ ...
  INSERT /*+ ... */ ...
  REPLACE /*+ ... */ ...
  UPDATE /*+ ... */ ...
  DELETE /*+ ... */ ...
  ```

* No início dos blocos de consulta:

  ```
  (SELECT /*+ ... */ ... )
  (SELECT ... ) UNION (SELECT /*+ ... */ ... )
  (SELECT /*+ ... */ ... ) UNION (SELECT /*+ ... */ ... )
  UPDATE ... WHERE x IN (SELECT /*+ ... */ ...)
  INSERT ... SELECT /*+ ... */ ...
  ```

* Em declarações hintaveis precedidas por `EXPLAIN`. Por exemplo:

  ```
  EXPLAIN SELECT /*+ ... */ ...
  EXPLAIN UPDATE ... WHERE x IN (SELECT /*+ ... */ ...)
  ```

A implicação é que você pode usar `EXPLAIN` para ver como as dicas do otimizador afetam os planos de execução. Use `SHOW WARNINGS` imediatamente após `EXPLAIN` para ver como as dicas são usadas. A saída `EXPLAIN` estendida exibida por um `SHOW WARNINGS` subsequente (show-warnings.html "15.7.7.42 SHOW WARNINGS Statement") indica quais dicas foram usadas. As dicas ignoradas não são exibidas.

Um comentário de dica pode conter múltiplas dicas, mas um bloco de consulta não pode conter múltiplos comentários de dica. Isso é válido:

```
SELECT /*+ BNL(t1) BKA(t2) */ ...
```

Mas isso é inválido:

```
SELECT /*+ BNL(t1) */ /* BKA(t2) */ ...
```

Quando um comentário com dicas contém várias dicas, existe a possibilidade de duplicatas e conflitos. As diretrizes gerais a seguir se aplicam. Para tipos específicos de dicas, podem ser aplicadas regras adicionais, conforme indicado nas descrições das dicas.

* Dicas duplicadas: Para uma dica como `/*+ MRR(idx1) MRR(idx1) */`, o MySQL usa a primeira dica e emite um aviso sobre a dica duplicada.

* Dúvidas sobre os índices: Para um índice como `/*+ MRR(idx1) NO_MRR(idx1) */`, o MySQL usa o primeiro índice e emite um aviso sobre o segundo índice que entra em conflito.

Os nomes dos blocos de consulta são identificadores e seguem as regras habituais sobre quais nomes são válidos e como citá-los (consulte a Seção 11.2, "Nomes de Objetos do Esquema").

Os nomes de dicas, nomes de blocos de consulta e nomes de estratégias não são sensíveis ao caso. As referências a nomes de tabela e índice seguem as regras habituais de sensibilidade ao caso de identificadores (ver Seção 11.2.3, “Sensibilidade ao caso do identificador”).

#### Dicas do Otimizador de Ordem de Conjunto

As dicas de ordem de junção afetam a ordem em que o otimizador junta as tabelas.

Sintaxe da dica `JOIN_FIXED_ORDER`:

```
hint_name([@query_block_name])
```

Sintaxe de outras dicas de ordem de junção:

```
hint_name([@query_block_name] tbl_name [, tbl_name] ...)
hint_name(tbl_name[@query_block_name] [, tbl_name[@query_block_name]] ...)
```

A sintaxe refere-se a esses termos:

* *`hint_name`*: Esses nomes indicativos são permitidos:

+ `JOIN_FIXED_ORDER`: Forçar o otimizador a unir as tabelas usando a ordem em que elas aparecem na cláusula `FROM`. Isso é o mesmo que especificar `SELECT STRAIGHT_JOIN`.

+ `JOIN_ORDER`: Instrua o otimizador a unir as tabelas usando a ordem de tabela especificada. O aviso se aplica às tabelas nomeadas. O otimizador pode colocar tabelas que não estão nomeadas em qualquer lugar na ordem de junção, incluindo entre as tabelas especificadas.

+ `JOIN_PREFIX`: Instrua o otimizador a unir as tabelas usando a ordem de tabela especificada para as primeiras tabelas do plano de execução de junção. O aviso se aplica às tabelas nomeadas. O otimizador coloca todas as outras tabelas após as tabelas nomeadas.

+ `JOIN_SUFFIX`: Instrua o otimizador a unir as tabelas usando a ordem de tabela especificada para as últimas tabelas do plano de execução de junção. O aviso se aplica às tabelas nomeadas. O otimizador coloca todas as outras tabelas antes das tabelas nomeadas.

* *`tbl_name`*: O nome de uma tabela usada na declaração. Uma dica de que os nomes de tabelas se aplicam a todas as tabelas que ela nomeia. A dica `JOIN_FIXED_ORDER` não nomeia tabelas e se aplica a todas as tabelas na cláusula `FROM` do bloco de consulta na qual ela ocorre.

Se uma tabela tiver um alias, as dicas devem se referir ao alias, não ao nome da tabela.

Os nomes das tabelas nas dicas não podem ser qualificados com nomes de esquema.

* *`query_block_name`*: O bloco de consulta ao qual o indicativo se aplica. Se o indicativo não incluir o `@query_block_name` inicial, o indicativo se aplica ao bloco de consulta no qual ele ocorre. Para a sintaxe `tbl_name@query_block_name`, o indicativo se aplica à tabela nomeada no bloco de consulta nomeado. Para atribuir um nome a um bloco de consulta, consulte Sugestões do otimizador para nomear blocos de consulta.

Exemplo:

```
SELECT
/*+ JOIN_PREFIX(t2, t5@subq2, t4@subq1)
    JOIN_ORDER(t4@subq1, t3)
    JOIN_SUFFIX(t1) */
COUNT(*) FROM t1 JOIN t2 JOIN t3
           WHERE t1.f1 IN (SELECT /*+ QB_NAME(subq1) */ f1 FROM t4)
             AND t2.f1 IN (SELECT /*+ QB_NAME(subq2) */ f1 FROM t5);
```

Os indicadores controlam o comportamento das tabelas semijoin que são unidas ao bloco da consulta externa. Se as subconsultas `subq1` e `subq2` forem convertidas em semijoins, as tabelas `t4@subq1` e `t5@subq2` serão unidas ao bloco da consulta externa. Neste caso, o indicador especificado no bloco da consulta externa controla o comportamento das tabelas `t4@subq1`, `t5@subq2`.

O otimizador resolve as dicas de ordem de junção de acordo com esses princípios:

* Múltiplas instâncias de dica

Apenas uma dica `JOIN_PREFIX` e `JOIN_SUFFIX` de cada tipo são aplicadas. Quaisquer dicas posteriores do mesmo tipo são ignoradas com um aviso. `JOIN_ORDER` pode ser especificado várias vezes.

Exemplos:

  ```
  /*+ JOIN_PREFIX(t1) JOIN_PREFIX(t2) */
  ```

A segunda dica `JOIN_PREFIX` é ignorada com um aviso.

  ```
  /*+ JOIN_PREFIX(t1) JOIN_SUFFIX(t2) */
  ```

Ambos os indicadores são aplicáveis. Não ocorre nenhum aviso.

  ```
  /*+ JOIN_ORDER(t1, t2) JOIN_ORDER(t2, t3) */
  ```

Ambos os indicadores são aplicáveis. Não ocorre nenhum aviso.

* Sugestões contraditórias

Em alguns casos, as dicas podem entrar em conflito, como quando `JOIN_ORDER` e `JOIN_PREFIX` têm ordens de tabela que são impossíveis de aplicar ao mesmo tempo:

  ```
  SELECT /*+ JOIN_ORDER(t1, t2) JOIN_PREFIX(t2, t1) */ ... FROM t1, t2;
  ```

Neste caso, o primeiro aviso especificado é aplicado e os avisos conflitantes subsequentes são ignorados sem aviso. Um aviso válido que é impossível aplicar é silenciado sem aviso.

* Dicas ignoradas

Um indicador é ignorado se uma tabela especificada no indicador tiver uma dependência circular.

Exemplo:

  ```
  /*+ JOIN_ORDER(t1, t2) JOIN_PREFIX(t2, t1) */
  ```

A dica `JOIN_ORDER` define a tabela `t2` como dependente de `t1`. A dica `JOIN_PREFIX` é ignorada porque a tabela `t1` não pode ser dependente de `t2`. As dicas ignoradas não são exibidas na saída `EXPLAIN` estendida.

* Interação com as tabelas `const`

O otimizador do MySQL coloca as tabelas `const` em primeiro lugar na ordem de junção, e a posição de uma tabela `const` não pode ser afetada por dicas. As referências às tabelas `const` em dicas de ordem de junção são ignoradas, embora a dica ainda seja aplicável. Por exemplo, estas são equivalentes:

  ```
  JOIN_ORDER(t1, const_tbl, t2)
  JOIN_ORDER(t1, t2)
  ```

Os indicadores aceitos mostrados na saída estendida `EXPLAIN` incluem as tabelas `const` conforme especificadas.

* Interação com tipos de operações de junção

O MySQL suporta vários tipos de junções: `LEFT`, `RIGHT`, `INNER`, `CROSS`, `STRAIGHT_JOIN`. Uma dica que entra em conflito com o tipo especificado de junção é ignorada sem aviso.

Exemplo:

  ```
  SELECT /*+ JOIN_PREFIX(t1, t2) */FROM t2 LEFT JOIN t1;
  ```

Aqui ocorre um conflito entre a ordem de junção solicitada no aviso e a ordem exigida pelo `LEFT JOIN`. O aviso é ignorado sem aviso.

#### Dicas de otimização de nível de tabela

As dicas de nível de tabela afetam:

* Uso dos algoritmos de processamento de junção de Bloco Nested-Loop (BNL) e Acesso de Chave em Massa (BKA) (consulte a Seção 10.2.1.12, "Bloco Nested-Loop e Acesso de Chave em Massa").

* As tabelas derivadas, as referências de visualização ou as expressões de tabela comuns devem ser agregadas no bloco da consulta externa, ou materializadas usando uma tabela temporária interna.

* Uso da otimização de empurrar a condição de tabela derivada (adicionada no MySQL 8.0.22). Veja a Seção 10.2.2.5, “Otimização de empurrar a condição de condição derivada”.

Esses tipos de dicas se aplicam a tabelas específicas ou a todas as tabelas em um bloco de consulta.

Sintaxe de dicas de nível de tabela:

```
hint_name([@query_block_name] [tbl_name [, tbl_name] ...])
hint_name([tbl_name@query_block_name [, tbl_name@query_block_name] ...])
```

A sintaxe refere-se a esses termos:

* *`hint_name`*: Esses nomes indicativos são permitidos:

+ `BKA`, `NO_BKA`: Ative ou desative o acesso por chave em lote para as tabelas especificadas.

+ `BNL`, `NO_BNL`: Ative ou desative o bloco de loop aninhado para as tabelas especificadas. No MySQL 8.0.18 e versões posteriores, essas dicas também ativam e desativam a otimização de junção hash.

Nota

A otimização do loop aninhado em blocos é removida no MySQL 8.0.20 e em versões posteriores, mas `BNL` e `NO_BNL` continuam a ser suportados para habilitar e desabilitar junções de hash.

+ `DERIVED_CONDITION_PUSHDOWN`, `NO_DERIVED_CONDITION_PUSHDOWN`: Ative ou desative o uso de condição de empurrão de tabela derivada para as tabelas especificadas (adicionada no MySQL 8.0.22). Para mais informações, consulte a Seção 10.2.2.5, “Otimização de Empurrão de Condição Derivada”.

+ `HASH_JOIN`, `NO_HASH_JOIN`: Apenas no MySQL 8.0.18, habilite ou desative o uso de uma junção hash para as tabelas especificadas. Esses índices não têm efeito no MySQL 8.0.19 ou posterior, onde você deve usar `BNL` ou `NO_BNL` em vez disso.

+ `MERGE`, `NO_MERGE`: Habilitar a fusão para as tabelas especificadas, referências de visão ou expressões de tabela comuns; ou desabilitar a fusão e usar materialização em vez disso.

Nota

Para usar uma dica de acesso à chave em lote ou uma alça de loop aninhada para habilitar o bufferamento de junção para qualquer tabela interna de uma junção externa, o bufferamento de junção deve ser habilitado para todas as tabelas internas da junção externa.

* *`tbl_name`*: O nome de uma tabela usada na declaração. O aviso se aplica a todas as tabelas que ele nomeia. Se o aviso não nomear nenhuma tabela, ele se aplica a todas as tabelas do bloco de consulta em que ocorre.

Se uma tabela tiver um alias, as dicas devem se referir ao alias, não ao nome da tabela.

Os nomes das tabelas nas dicas não podem ser qualificados com nomes de esquema.

* *`query_block_name`*: O bloco de consulta ao qual o indicativo se aplica. Se o indicativo não incluir o `@query_block_name` inicial, o indicativo se aplica ao bloco de consulta no qual ele ocorre. Para a sintaxe `tbl_name@query_block_name`, o indicativo se aplica à tabela nomeada no bloco de consulta nomeado. Para atribuir um nome a um bloco de consulta, consulte Sugestões do otimizador para nomear blocos de consulta.

Exemplos:

```
SELECT /*+ NO_BKA(t1, t2) */ t1.* FROM t1 INNER JOIN t2 INNER JOIN t3;
SELECT /*+ NO_BNL() BKA(t1) */ t1.* FROM t1 INNER JOIN t2 INNER JOIN t3;
SELECT /*+ NO_MERGE(dt) */ * FROM (SELECT * FROM t1) AS dt;
```

Uma dica de nível de tabela se aplica a tabelas que recebem registros de tabelas anteriores, não de tabelas de remetente. Considere esta declaração:

```
SELECT /*+ BNL(t2) */ FROM t1, t2;
```

Se o otimizador optar por processar `t1` primeiro, ele aplica uma junção Bloco em Nó Envolto a `t2` ao bufferizar as linhas de `t1` antes de começar a ler a partir de `t2`. Se, em vez disso, o otimizador optar por processar `t2` primeiro, a dica não tem efeito porque `t2` é uma tabela de emissor.

Para as dicas de `MERGE` e `NO_MERGE`, essas regras de precedência se aplicam:

* Um indicativo tem precedência sobre qualquer heurística de otimizador que não seja uma restrição técnica. (Se fornecer um indicativo como sugestão não tiver efeito, o otimizador tem um motivo para ignorá-lo.)

* Um indicador tem precedência sobre a bandeira `derived_merge` da variável de sistema `optimizer_switch`.

* Para referências de visualização, uma cláusula `ALGORITHM={MERGE|TEMPTABLE}` na definição da visualização tem precedência sobre um aviso especificado na consulta que faz referência à visualização.

#### Dicas de otimização de nível de índice

Os indicadores de nível de índice afetam as estratégias de processamento de índice que o otimizador usa para tabelas ou índices específicos. Esses tipos de indicação afetam o uso do Index Condition Pushdown (ICP), Multi-Range Read (MRR), Merge de índice e otimizações de intervalo (consulte Seção 10.2.1, “Otimizando declarações SELECT”).

Sintaxe das dicas de nível de índice:

```
hint_name([@query_block_name] tbl_name [index_name [, index_name] ...])
hint_name(tbl_name@query_block_name [index_name [, index_name] ...])
```

A sintaxe refere-se a esses termos:

* *`hint_name`*: Esses nomes indicativos são permitidos:

+ `GROUP_INDEX`, `NO_GROUP_INDEX`: Ative ou desative o índice especificado ou os índices para varreduras de índice para operações de `GROUP BY`. É equivalente às dicas de índice `FORCE INDEX FOR GROUP BY`, `IGNORE INDEX FOR GROUP BY`. Disponível no MySQL 8.0.20 e versões posteriores.

+ `INDEX`, `NO_INDEX`: Funciona como a combinação de `JOIN_INDEX`, `GROUP_INDEX` e `ORDER_INDEX`, obrigando o servidor a usar o índice ou índices especificados para todos os escopos, ou como a combinação de `NO_JOIN_INDEX`, `NO_GROUP_INDEX` e `NO_ORDER_INDEX`, o que faz com que o servidor ignore o índice ou índices especificados para todos os escopos. Equivalente a `FORCE INDEX`, `IGNORE INDEX`. Disponível a partir do MySQL 8.0.20.

+ `INDEX_MERGE`, `NO_INDEX_MERGE`: Ative ou desative o método de acesso à junção de índices para a tabela ou índices especificados. Para informações sobre esse método de acesso, consulte a Seção 10.2.1.3, “Otimização da Junção de Índices”. Esses indicativos se aplicam a todos os três algoritmos de junção de índices.

A dica `INDEX_MERGE` obriga o otimizador a usar a Mesclagem de Índices para a tabela especificada, utilizando o conjunto especificado de índices. Se nenhum índice for especificado, o otimizador considera todas as combinações possíveis de índice e seleciona a menos dispendiosa. A dica pode ser ignorada se a combinação de índices não for aplicável à declaração dada.

A dica `NO_INDEX_MERGE` desativa as combinações de junção de índice que envolvem qualquer um dos índices especificados. Se a dica não especificar índices, a junção de índice não é permitida para a tabela.

+ `JOIN_INDEX`, `NO_JOIN_INDEX`: Força o MySQL a usar ou ignorar o índice ou índices especificados para qualquer método de acesso, como `ref`, `range`, `index_merge` e assim por diante. É equivalente a `FORCE INDEX FOR JOIN`, `IGNORE INDEX FOR JOIN`. Disponível no MySQL 8.0.20 e posterior.

+ `MRR`, `NO_MRR`: Ative ou desative o MRR para a tabela ou índices especificados. As dicas de MRR se aplicam apenas às tabelas `InnoDB` e `MyISAM`. Para informações sobre esse método de acesso, consulte a Seção 10.2.1.11, “Otimização de Leitura de Múltiplos Intervalos”.

+ `NO_ICP`: Desative o ICP para a tabela ou índices especificados. Por padrão, o ICP é uma estratégia de otimização candidata, portanto, não há dica para habilitá-lo. Para informações sobre esse método de acesso, consulte a Seção 10.2.1.6, “Otimização de Otimização de Condição de Índice”.

+ `NO_RANGE_OPTIMIZATION`: Desative o acesso ao intervalo de índice para a tabela ou índices especificados. Esse aviso também desativa a Mesclagem de índice e a varredura de índice solta para a tabela ou índices. Por padrão, o acesso ao intervalo é uma estratégia de otimização candidata, então não há aviso para habilitá-lo.

Essa dica pode ser útil quando o número de faixas pode ser alto e a otimização das faixas exigiria muitos recursos.

+ `ORDER_INDEX`, `NO_ORDER_INDEX`: Faça com que o MySQL use ou ignore o índice ou índices especificados para ordenar as linhas. É equivalente a `FORCE INDEX FOR ORDER BY`, `IGNORE INDEX FOR ORDER BY`. Disponível a partir do MySQL 8.0.20.

+ `SKIP_SCAN`, `NO_SKIP_SCAN`: Ative ou desative o método de acesso de varredura ignorada para a tabela ou índices especificados. Para informações sobre este método de acesso, consulte o Método de Acesso de Alcance de Varredura Ignorada. Esses dicas estão disponíveis a partir do MySQL 8.0.13.

A dica `SKIP_SCAN` obriga o otimizador a usar o Skip Scan para a tabela especificada, usando o conjunto especificado de índices. Se nenhum índice for especificado, o otimizador considera todos os índices possíveis e seleciona o menos dispendioso. A dica pode ser ignorada se o índice não for aplicável à declaração dada.

A dica `NO_SKIP_SCAN` desativa o Desvio de varredura para os índices especificados. Se a dica não especificar nenhum índice, o Desvio de varredura não é permitido para a tabela.

* *`tbl_name`*: A tabela à qual o aviso se aplica.

* *`index_name`*: O nome de um índice na tabela nomeada. O aviso se aplica a todos os índices que ele nomeia. Se o aviso não nomear nenhum índice, ele se aplica a todos os índices na tabela.

Para se referir a uma chave primária, use o nome `PRIMARY`. Para ver os nomes dos índices de uma tabela, use `SHOW INDEX`.

* *`query_block_name`*: O bloco de consulta ao qual o indicativo se aplica. Se o indicativo não incluir o `@query_block_name` inicial, o indicativo se aplica ao bloco de consulta no qual ele ocorre. Para a sintaxe `tbl_name@query_block_name`, o indicativo se aplica à tabela nomeada no bloco de consulta nomeado. Para atribuir um nome a um bloco de consulta, consulte Sugestões do otimizador para nomear blocos de consulta.

Exemplos:

```
SELECT /*+ INDEX_MERGE(t1 f3, PRIMARY) */ f2 FROM t1
  WHERE f1 = 'o' AND f2 = f3 AND f3 <= 4;
SELECT /*+ MRR(t1) */ * FROM t1 WHERE f2 <= 3 AND 3 <= f3;
SELECT /*+ NO_RANGE_OPTIMIZATION(t3 PRIMARY, f2_idx) */ f1
  FROM t3 WHERE f1 > 30 AND f1 < 33;
INSERT INTO t3(f1, f2, f3)
  (SELECT /*+ NO_ICP(t2) */ t2.f1, t2.f2, t2.f3 FROM t1,t2
   WHERE t1.f1=t2.f1 AND t2.f2 BETWEEN t1.f1
   AND t1.f2 AND t2.f2 + 1 >= t1.f1 + 1);
SELECT /*+ SKIP_SCAN(t1 PRIMARY) */ f1, f2
  FROM t1 WHERE f2 > 40;
```

Os exemplos a seguir utilizam as dicas de junção de índices, mas outras dicas de nível de índice seguem os mesmos princípios em relação ao ignoramento de dicas e à precedência das dicas do otimizador em relação à variável de sistema `optimizer_switch` ou dicas de índice.

Suponha que a tabela `t1` tenha as colunas `a`, `b`, `c` e `d`; e que índices com os nomes `i_a`, `i_b` e `i_c` existam em `a`, `b` e `c`, respectivamente:

```
SELECT /*+ INDEX_MERGE(t1 i_a, i_b, i_c)*/ * FROM t1
  WHERE a = 1 AND b = 2 AND c = 3 AND d = 4;
```

O Merge de índice é usado para `(i_a, i_b, i_c)` neste caso.

```
SELECT /*+ INDEX_MERGE(t1 i_a, i_b, i_c)*/ * FROM t1
  WHERE b = 1 AND c = 2 AND d = 3;
```

O Merge de índice é usado para `(i_b, i_c)` neste caso.

```
/*+ INDEX_MERGE(t1 i_a, i_b) NO_INDEX_MERGE(t1 i_b) */
```

`NO_INDEX_MERGE` é ignorado porque há um aviso anterior para a mesma tabela.

```
/*+ NO_INDEX_MERGE(t1 i_a, i_b) INDEX_MERGE(t1 i_b) */
```

`INDEX_MERGE` é ignorado porque há um aviso anterior para a mesma tabela.

Para as dicas de otimização `INDEX_MERGE` e `NO_INDEX_MERGE`, essas regras de precedência se aplicam:

* Se uma dica de otimização for especificada e aplicável, ela tem precedência sobre as bandeiras relacionadas à junção de índices da variável de sistema `optimizer_switch`.

  ```
  SET optimizer_switch='index_merge_intersection=off';
  SELECT /*+ INDEX_MERGE(t1 i_b, i_c) */ * FROM t1
  WHERE b = 1 AND c = 2 AND d = 3;
  ```

O indicador tem precedência sobre `optimizer_switch`. A junção de índice é usada para `(i_b, i_c)` neste caso.

  ```
  SET optimizer_switch='index_merge_intersection=on';
  SELECT /*+ INDEX_MERGE(t1 i_b) */ * FROM t1
  WHERE b = 1 AND c = 2 AND d = 3;
  ```

O indicador especifica apenas um índice, portanto, é inaplicável, e a bandeira `optimizer_switch` (`on`) se aplica. A Mesclagem de índices é usada se o otimizador avaliar que é eficiente em termos de custo.

  ```
  SET optimizer_switch='index_merge_intersection=off';
  SELECT /*+ INDEX_MERGE(t1 i_b) */ * FROM t1
  WHERE b = 1 AND c = 2 AND d = 3;
  ```

O indicador especifica apenas um índice, portanto, é inaplicável, e a bandeira `optimizer_switch` (`off`) se aplica. A fusão de índice não é usada.

Os índices de otimização `GROUP_INDEX`, `INDEX`, `JOIN_INDEX` e `ORDER_INDEX` têm precedência sobre os equivalentes `FORCE INDEX`, ou seja, eles fazem com que os índices `FORCE INDEX` sejam ignorados. Da mesma forma, os índices `NO_GROUP_INDEX`, `NO_INDEX`, `NO_JOIN_INDEX` e `NO_ORDER_INDEX` têm precedência sobre quaisquer equivalentes `IGNORE INDEX`, também fazendo com que eles sejam ignorados.

Os índices de otimização `GROUP_INDEX`, `NO_GROUP_INDEX`, `INDEX`, `NO_INDEX`, `JOIN_INDEX`, `NO_JOIN_INDEX`, `ORDER_INDEX` e `NO_ORDER_INDEX` têm precedência sobre todos os outros índices de otimização, incluindo outros índices de otimização de nível de índice. Todos os outros índices de otimização são aplicados apenas aos índices permitidos por esses índices.

Os `GROUP_INDEX`, `INDEX`, `JOIN_INDEX` e `ORDER_INDEX` são todos equivalentes ao `FORCE INDEX` e não ao `USE INDEX`. Isso ocorre porque o uso de um ou mais desses índices significa que uma varredura de tabela é usada apenas se não houver nenhuma maneira de usar um dos índices nomeados para encontrar linhas na tabela. Para fazer com que o MySQL use o mesmo índice ou conjunto de índices que uma instância específica do `USE INDEX`, você pode usar `NO_INDEX`, `NO_JOIN_INDEX`, `NO_GROUP_INDEX`, `NO_ORDER_INDEX` ou alguma combinação desses.

Para replicar o efeito que `USE INDEX` tem na consulta `SELECT a,c FROM t1 USE INDEX FOR ORDER BY (i_a) ORDER BY a`, você pode usar a dica de otimizador `NO_ORDER_INDEX` para cobrir todos os índices na tabela, exceto o desejado, da seguinte forma:

  ```
  SELECT /*+ NO_ORDER_INDEX(t1 i_b,i_c) */ a,c
      FROM t1
      ORDER BY a;
  ```

Tentar combinar `NO_ORDER_INDEX` para a tabela como um todo com `USE INDEX FOR ORDER BY` não funciona para fazer isso, porque `NO_ORDER_BY` faz com que `USE INDEX` seja ignorado, como mostrado aqui:

  ```
  mysql> EXPLAIN SELECT /*+ NO_ORDER_INDEX(t1) */ a,c FROM t1
      ->     USE INDEX FOR ORDER BY (i_a) ORDER BY a\G
  *************************** 1. row ***************************
             id: 1
    select_type: SIMPLE
          table: t1
     partitions: NULL
           type: ALL
  possible_keys: NULL
            key: NULL
        key_len: NULL
            ref: NULL
           rows: 256
       filtered: 100.00
          Extra: Using filesort
  ```

Os índices `USE INDEX`, `FORCE INDEX` e `IGNORE INDEX` têm prioridade maior do que os índices `INDEX_MERGE` e `NO_INDEX_MERGE` do otimizador.

  ```
  /*+ INDEX_MERGE(t1 i_a, i_b, i_c) */ ... IGNORE INDEX i_a
  ```

`IGNORE INDEX` tem precedência sobre `INDEX_MERGE`, portanto, o índice `i_a` é excluído dos possíveis intervalos para a Mesclagem de Índices.

  ```
  /*+ NO_INDEX_MERGE(t1 i_a, i_b) */ ... FORCE INDEX i_a, i_b
  ```

A junção do índice é desaconselhada para `i_a, i_b` devido a `FORCE INDEX`, mas o otimizador é obrigado a usar `i_a` ou `i_b` para o acesso a `range` ou `ref`. Não há conflitos; ambos os índices são aplicáveis.

* Se uma dica `IGNORE INDEX` indicar vários índices, esses índices não estarão disponíveis para a Mesclagem de Índices.

* Os `FORCE INDEX` e `USE INDEX` indicam que apenas os índices nomeados estarão disponíveis para a Mesclagem de Índices.

  ```
  SELECT /*+ INDEX_MERGE(t1 i_a, i_b, i_c) */ a FROM t1
  FORCE INDEX (i_a, i_b) WHERE c = 'h' AND a = 2 AND b = 'b';
  ```

O algoritmo de acesso de interseção da junção do Índice é utilizado para `(i_a, i_b)`. O mesmo vale se `FORCE INDEX` for alterado para `USE INDEX`.

#### Dicas do otimizador de subconsultas

As dicas de subconsulta afetam se as transformações de semijoin devem ser usadas e quais estratégias de semijoin devem ser permitidas, e, quando semijoins não são usados, se a materialização de subconsulta ou as transformações `IN`-para-`EXISTS` devem ser usadas. Para mais informações sobre essas otimizações, consulte [Seção 10.2.2, “Otimizando subconsultas, tabelas derivadas, referências de visão e expressões de tabela comum”][(subquery-optimization.html "10.2.2 Optimizing Subqueries, Derived Tables, View References, and Common Table Expressions")].

Sintaxe de dicas que afetam estratégias de semijoin:

```
hint_name([@query_block_name] [strategy [, strategy] ...])
```

A sintaxe refere-se a esses termos:

* *`hint_name`*: Esses nomes indicativos são permitidos:

+ `SEMIJOIN`, `NO_SEMIJOIN`: Ative ou desative as estratégias de junção semijoinha nomeadas.

* *`strategy`*: Uma estratégia de semijoin que deve ser habilitada ou desabilitada. Esses nomes de estratégia são permitidos: `DUPSWEEDOUT`, `FIRSTMATCH`, `LOOSESCAN`, `MATERIALIZATION`.

Para dicas de `SEMIJOIN`, se não houver estratégias nomeadas, o semijoin é usado, se possível, com base nas estratégias habilitadas de acordo com a variável de sistema `optimizer_switch`. Se as estratégias forem nomeadas, mas inapropriadas para a declaração, é usada a `DUPSWEEDOUT`.

Para dicas de `NO_SEMIJOIN`, se não houver estratégias nomeadas, o semijoin não é usado. Se as estratégias forem nomeadas e excluam todas as estratégias aplicáveis para a declaração, é usado `DUPSWEEDOUT`.

Se uma subconsulta estiver aninhada em outra e ambas forem unidas em uma semijoin de uma consulta externa, qualquer especificação de estratégias de semijoin para a consulta mais interna será ignorada. Os hints `SEMIJOIN` e `NO_SEMIJOIN` ainda podem ser usados para habilitar ou desabilitar transformações de semijoin para tais subconsultas aninhadas.

Se `DUPSWEEDOUT` estiver desativado, por vezes, o otimizador pode gerar um plano de consulta que está longe de ser ótimo. Isso ocorre devido à poda heurística durante a busca gananciosa, que pode ser evitada ao definir `optimizer_prune_level=0`.

Exemplos:

```
SELECT /*+ NO_SEMIJOIN(@subq1 FIRSTMATCH, LOOSESCAN) */ * FROM t2
  WHERE t2.a IN (SELECT /*+ QB_NAME(subq1) */ a FROM t3);
SELECT /*+ SEMIJOIN(@subq1 MATERIALIZATION, DUPSWEEDOUT) */ * FROM t2
  WHERE t2.a IN (SELECT /*+ QB_NAME(subq1) */ a FROM t3);
```

Sintaxe de dicas que afetam se deve usar materialização de subconsulta ou transformações de `IN` para `EXISTS`:

```
SUBQUERY([@query_block_name] strategy)
```

O nome do indicador é sempre `SUBQUERY`.

Para dicas de `SUBQUERY`, esses valores *`strategy`* são permitidos: `INTOEXISTS`, `MATERIALIZATION`.

Exemplos:

```
SELECT id, a IN (SELECT /*+ SUBQUERY(MATERIALIZATION) */ a FROM t1) FROM t2;
SELECT * FROM t2 WHERE t2.a IN (SELECT /*+ SUBQUERY(INTOEXISTS) */ a FROM t1);
```

Para dicas de semijoin e `SUBQUERY`, um líder `@query_block_name` especifica o bloco de consulta ao qual a dica se aplica. Se a dica não incluir um líder `@query_block_name`, a dica se aplica ao bloco de consulta em que ocorre. Para atribuir um nome a um bloco de consulta, consulte Dicas do otimizador para nomear blocos de consulta.

Se um comentário de dica contiver várias dicas de subconsulta, a primeira é usada. Se houver outras dicas desse tipo, elas geram um aviso. Dicas de outros tipos são ignoradas silenciosamente.

#### Dicas de otimização do tempo de execução da declaração

O `MAX_EXECUTION_TIME` é permitido apenas para declarações `SELECT`. Ele estabelece um limite *`N`* (um valor de tempo de espera em milissegundos) sobre o tempo que uma declaração é permitida para ser executada antes de o servidor terminá-la:

```
MAX_EXECUTION_TIME(N)
```

Exemplo com um tempo de espera de 1 segundo (1000 milissegundos):

```
SELECT /*+ MAX_EXECUTION_TIME(1000) */ * FROM t1 INNER JOIN t2 WHERE ...
```

A dica `MAX_EXECUTION_TIME(N)` define o tempo de espera para a execução de uma declaração em *`N`* milissegundos. Se esta opção estiver ausente ou se *`N`* for 0, o tempo de espera estabelecido pela variável de sistema `max_execution_time` se aplica.

O `MAX_EXECUTION_TIME` é aplicável da seguinte forma:

* Para declarações com múltiplos termos-chave `SELECT`, como uniões ou declarações com subconsultas, `MAX_EXECUTION_TIME` se aplica a toda a declaração e deve aparecer após o primeiro `SELECT`.

* Aplica-se a declarações `SELECT` apenas para leitura. As declarações que não são apenas para leitura são aquelas que invocam uma função armazenada que modifica dados como efeito colateral.

* Não se aplica às declarações `SELECT` em programas armazenados e é ignorado.

#### Sintaxe de dica de configuração variável

A dica `SET_VAR` define o valor da sessão de uma variável do sistema temporariamente (pelo período de uma única declaração). Exemplos:

```
SELECT /*+ SET_VAR(sort_buffer_size = 16M) */ name FROM people ORDER BY name;
INSERT /*+ SET_VAR(foreign_key_checks=OFF) */ INTO t2 VALUES(2);
SELECT /*+ SET_VAR(optimizer_switch = 'mrr_cost_based=off') */ 1;
```

Sintaxe da dica `SET_VAR`:

```
SET_VAR(var_name = value)
```

*`var_name`* nomeia uma variável de sistema que tem um valor de sessão (embora nem todas as variáveis assim possam ser nomeadas, conforme explicado mais adiante). *`value`* é o valor a ser atribuído à variável; o valor deve ser escalar.

`SET_VAR` realiza uma alteração temporária de variável, conforme demonstrado por essas declarações:

```
mysql> SELECT @@unique_checks;
+-----------------+
| @@unique_checks |
+-----------------+
|               1 |
+-----------------+
mysql> SELECT /*+ SET_VAR(unique_checks=OFF) */ @@unique_checks;
+-----------------+
| @@unique_checks |
+-----------------+
|               0 |
+-----------------+
mysql> SELECT @@unique_checks;
+-----------------+
| @@unique_checks |
+-----------------+
|               1 |
+-----------------+
```

Com `SET_VAR`, não é necessário salvar e restaurar o valor da variável. Isso permite que você substitua várias declarações por uma única declaração. Considere esta sequência de declarações:

```
SET @saved_val = @@SESSION.var_name;
SET @@SESSION.var_name = value;
SELECT ...
SET @@SESSION.var_name = @saved_val;
```

A sequência pode ser substituída por esta única declaração:

```
SELECT /*+ SET_VAR(var_name = value) ...
```

As declarações `SET` independentes permitem qualquer uma dessas sintaxes para nomear variáveis de sessão:

```
SET SESSION var_name = value;
SET @@SESSION.var_name = value;
SET @@.var_name = value;
```

Como o `SET_VAR` se aplica apenas a variáveis de sessão, o escopo de sessão é implícito, e `SESSION`, `@@SESSION.` e `@@` não são necessários nem permitidos. Incluir a sintaxe explícita de indicador de sessão resulta no `SET_VAR` sendo ignorado com um aviso.

Nem todas as variáveis de sessão são permitidas para uso com `SET_VAR`. As descrições individuais das variáveis do sistema indicam se cada variável é hintable; veja a Seção 7.1.8, “Variáveis do Sistema do Servidor”. Você também pode verificar uma variável do sistema em tempo de execução, tentando usá-la com `SET_VAR`. Se a variável não for hintable, uma mensagem de alerta ocorre:

```
mysql> SELECT /*+ SET_VAR(collation_server = 'utf8mb4') */ 1;
+---+
| 1 |
+---+
| 1 |
+---+
1 row in set, 1 warning (0.00 sec)

mysql> SHOW WARNINGS\G
*************************** 1. row ***************************
  Level: Warning
   Code: 4537
Message: Variable 'collation_server' cannot be set using SET_VAR hint.
```

A sintaxe do `SET_VAR` permite definir apenas uma única variável, mas múltiplos indicadores podem ser fornecidos para definir múltiplas variáveis:

```
SELECT /*+ SET_VAR(optimizer_switch = 'mrr_cost_based=off')
           SET_VAR(max_heap_table_size = 1G) */ 1;
```

Se houver várias dicas com o mesmo nome de variável na mesma declaração, a primeira é aplicada e as outras são ignoradas com um aviso:

```
SELECT /*+ SET_VAR(max_heap_table_size = 1G)
           SET_VAR(max_heap_table_size = 3G) */ 1;
```

Neste caso, o segundo aviso é ignorado com um aviso de que está em conflito.

Uma dica `SET_VAR` é ignorada com um aviso se nenhuma variável do sistema tiver o nome especificado ou se o valor da variável estiver incorreto:

```
SELECT /*+ SET_VAR(max_size = 1G) */ 1;
SELECT /*+ SET_VAR(optimizer_switch = 'mrr_cost_based=yes') */ 1;
```

Para a primeira declaração, não há a variável `max_size`. Para a segunda declaração, `mrr_cost_based` assume valores de `on` ou `off`, portanto, tentar configurá-la para `yes` é incorreto. Em cada caso, o aviso é ignorado.

O `SET_VAR` é permitido apenas no nível de declaração. Se usado em uma subconsulta, o aviso é ignorado.

As réplicas ignoram os `SET_VAR` em declarações replicadas para evitar potenciais problemas de segurança.

#### Sintaxe do Grupo de Recursos Hint

A dica de otimização `RESOURCE_GROUP` é usada para a gestão de grupos de recursos (consulte a Seção 7.1.16, “Grupos de Recursos”). Essa dica atribui o thread que executa uma declaração ao grupo de recursos nomeado temporariamente (pelo período da declaração). Ela exige o privilégio `RESOURCE_GROUP_ADMIN` ou `RESOURCE_GROUP_USER`.

Exemplos:

```
SELECT /*+ RESOURCE_GROUP(USR_default) */ name FROM people ORDER BY name;
INSERT /*+ RESOURCE_GROUP(Batch) */ INTO t2 VALUES(2);
```

Sintaxe da dica `RESOURCE_GROUP`:

```
RESOURCE_GROUP(group_name)
```

*`group_name`* indica o grupo de recursos ao qual o thread deve ser atribuído durante a execução da declaração. Se o grupo não existir, uma mensagem de aviso é exibida e o aviso é ignorado.

O `RESOURCE_GROUP` deve aparecer após a palavra-chave de declaração inicial (`SELECT`, `INSERT`, `REPLACE`, `UPDATE` ou `DELETE`).

Uma alternativa a `RESOURCE_GROUP` é a declaração `SET RESOURCE GROUP`, que atribui, de forma não temporária, os threads a um grupo de recursos. Veja a Seção 15.7.2.4, “Declaração SET RESOURCE GROUP”.

#### Dicas de otimização para o nomeação de blocos de consulta

As dicas de nível de tabela, nível de índice e subconsulta permitem que blocos de consulta específicos sejam nomeados como parte de sua sintaxe de argumento. Para criar esses nomes, use a dica `QB_NAME`, que atribui um nome ao bloco de consulta em que ocorre:

```
QB_NAME(name)
```

As dicas `QB_NAME` podem ser usadas para indicar de forma explícita, de maneira clara, quais blocos de consulta se aplicam a outras dicas. Elas também permitem que todas as dicas de nome de bloco que não são de consulta sejam especificadas em um único comentário de dica para uma compreensão mais fácil de declarações complexas. Considere a seguinte declaração:

```
SELECT ...
  FROM (SELECT ...
  FROM (SELECT ... FROM ...)) ...
```

Os índices `QB_NAME` atribuem nomes aos blocos de consulta na declaração:

```
SELECT /*+ QB_NAME(qb1) */ ...
  FROM (SELECT /*+ QB_NAME(qb2) */ ...
  FROM (SELECT /*+ QB_NAME(qb3) */ ... FROM ...)) ...
```

Em seguida, outros indicadores podem usar esses nomes para se referir aos blocos de consulta apropriados:

```
SELECT /*+ QB_NAME(qb1) MRR(@qb1 t1) BKA(@qb2) NO_MRR(@qb3t1 idx1, id2) */ ...
  FROM (SELECT /*+ QB_NAME(qb2) */ ...
  FROM (SELECT /*+ QB_NAME(qb3) */ ... FROM ...)) ...
```

O efeito resultante é o seguinte:

* `MRR(@qb1 t1)` se aplica à tabela `t1` no bloco de consulta `qb1`.

* `BKA(@qb2)` se aplica ao bloco de consulta `qb2`.

* `NO_MRR(@qb3 t1 idx1, id2)`(optimizer-hints.html#optimizer-hints-index-level "Index-Level Optimizer Hints") se aplica aos índices `idx1` e `idx2` na tabela `t1` no bloco de consulta `qb3`.

Os nomes dos blocos de consulta são identificadores e seguem as regras habituais sobre quais nomes são válidos e como citá-los (consulte a Seção 11.2, "Nomes de Objetos do Esquema"). Por exemplo, um nome de bloco de consulta que contém espaços deve ser citado, o que pode ser feito usando barras:

```
SELECT /*+ BKA(@`my hint name`) */ ...
  FROM (SELECT /*+ QB_NAME(`my hint name`) */ ...) ...
```

Se o modo SQL `ANSI_QUOTES` estiver habilitado, também é possível citar os nomes dos blocos de consulta entre aspas duplas:

```
SELECT /*+ BKA(@"my hint name") */ ...
  FROM (SELECT /*+ QB_NAME("my hint name") */ ...) ...
```

### 10.9.4 Dicas de índice

Os índices indicam ao otimizador informações sobre como escolher índices durante o processamento de consultas. Os índices indicados aqui diferem dos índices indicados pelo otimizador, descritos na Seção 10.9.3, “Indícios do otimizador”. Os índices e os índices indicados pelo otimizador podem ser usados separadamente ou juntos.

Os índices de dicas se aplicam às declarações `SELECT` e `UPDATE`. Eles também funcionam com declarações multi-tabela `DELETE`, mas não com declarações de tabela única `DELETE`, conforme mostrado mais adiante nesta seção.

Os índices de dicas são especificados após o nome de uma tabela. (Para a sintaxe geral para especificar tabelas em uma declaração `SELECT`, consulte a Seção 15.2.13.2, “Cláusula JOIN”.) A sintaxe para se referir a uma tabela individual, incluindo índices de dicas, é a seguinte:

```
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

O `USE INDEX (index_list)` indica ao MySQL que use apenas um dos índices nomeados para encontrar linhas na tabela. A sintaxe alternativa `IGNORE INDEX (index_list)` indica ao MySQL que não use algum índice ou índices específicos. Esses indicativos são úteis se `EXPLAIN` mostrar que o MySQL está usando o índice errado da lista de índices possíveis.

O `FORCE INDEX` hint funciona como o `USE INDEX (index_list)`, com a adição de que uma varredura de tabela é considerada *muito* cara. Em outras palavras, uma varredura de tabela é usada apenas se não houver nenhuma maneira de usar um dos índices nomeados para encontrar linhas na tabela.

Nota

A partir do MySQL 8.0.20, o servidor suporta as dicas de otimização de nível de índice `JOIN_INDEX`, `GROUP_INDEX`, `ORDER_INDEX` e `INDEX`, que são equivalentes e destinados a substituir as dicas de índice `FORCE INDEX`, bem como as dicas de otimização `NO_JOIN_INDEX`, `NO_GROUP_INDEX`, `NO_ORDER_INDEX` e `NO_INDEX`, que são equivalentes e destinados a substituir as dicas de índice `IGNORE INDEX`. Portanto, você deve esperar que `USE INDEX`, `FORCE INDEX` e `IGNORE INDEX` sejam descontinuados em uma futura versão do MySQL, e que, em algum momento, posteriormente, sejam removidos completamente.

Essas dicas de otimização de nível de índice são suportadas tanto com declarações de tabela única quanto de tabela múltipla `DELETE`.

Para mais informações, consulte Dicas de otimização de nível de índice.

Cada pista requer nomes de índice, não de colunas. Para se referir a uma chave primária, use o nome `PRIMARY`. Para ver os nomes dos índices de uma tabela, use a declaração [`SHOW INDEX`](show-index.html "15.7.7.22 SHOW INDEX Statement") ou a tabela do Esquema de Informações `STATISTICS`.

Um valor * `index_name` não precisa ser um nome completo de índice. Pode ser um prefixo inequívoco de um nome de índice. Se um prefixo for ambíguo, ocorre um erro.

Exemplos:

```
SELECT * FROM table1 USE INDEX (col1_index,col2_index)
  WHERE col1=1 AND col2=2 AND col3=3;

SELECT * FROM table1 IGNORE INDEX (col3_index)
  WHERE col1=1 AND col2=2 AND col3=3;
```

A sintaxe para dicas de índice tem as seguintes características:

* É sintaticamente válido omitir *`index_list`* para `USE INDEX`, o que significa “não usar índices”. Omitir *`index_list`* para `FORCE INDEX` ou `IGNORE INDEX` é um erro de sintaxe.

* Você pode especificar o escopo de uma dica de índice adicionando uma cláusula `FOR` à dica. Isso oferece um controle mais detalhado sobre a seleção do plano de execução do otimizador para várias fases do processamento de consultas. Para afetar apenas os índices usados quando o MySQL decide como encontrar as linhas na tabela e como processar junções, use `FOR JOIN`. Para influenciar o uso do índice para ordenação ou agrupamento de linhas, use `FOR ORDER BY` ou `FOR GROUP BY`.

* Você pode especificar várias dicas de índice:

  ```
  SELECT * FROM t1 USE INDEX (i1) IGNORE INDEX FOR ORDER BY (i2) ORDER BY a;
  ```

Não é um erro nomear o mesmo índice em várias dicas (mesmo dentro da mesma dica):

  ```
  SELECT * FROM t1 USE INDEX (i1) USE INDEX (i1,i1);
  ```

No entanto, é um erro misturar `USE INDEX` e `FORCE INDEX` para a mesma tabela:

  ```
  SELECT * FROM t1 USE INDEX FOR JOIN (i1) FORCE INDEX FOR JOIN (i2);
  ```

Se uma dica de índice não incluir nenhuma cláusula `FOR`, o escopo da dica é aplicar a todas as partes da declaração. Por exemplo, esta dica:

```
IGNORE INDEX (i1)
```

é equivalente a esta combinação de dicas:

```
IGNORE INDEX FOR JOIN (i1)
IGNORE INDEX FOR ORDER BY (i1)
IGNORE INDEX FOR GROUP BY (i1)
```

Em MySQL 5.0, o escopo do indicador sem a cláusula `FOR` era aplicável apenas à recuperação de linhas. Para fazer com que o servidor use esse comportamento mais antigo quando não houver a cláusula `FOR`, habilite a variável de sistema `old` na inicialização do servidor. Tenha cuidado ao habilitar essa variável em uma configuração de replicação. Com o registro binário baseado em declarações, ter diferentes modos para a fonte e réplicas pode levar a erros de replicação.

Quando os indicadores são processados, eles são coletados em uma única lista por tipo (`USE`, `FORCE`, `IGNORE`) e por escopo (`FOR JOIN`, `FOR ORDER BY`, `FOR GROUP BY`). Por exemplo:

```
SELECT * FROM t1
  USE INDEX () IGNORE INDEX (i2) USE INDEX (i1) USE INDEX (i2);
```

é equivalente a:

```
SELECT * FROM t1
   USE INDEX (i1,i2) IGNORE INDEX (i2);
```

Os indicadores de pista são aplicados para cada escopo na seguinte ordem:

1. `{USE|FORCE} INDEX` é aplicado se estiver presente. (Caso contrário, o conjunto de índices determinado pelo otimizador é utilizado.)

2. `IGNORE INDEX` é aplicado sobre o resultado do passo anterior. Por exemplo, as seguintes duas consultas são equivalentes:

   ```
   SELECT * FROM t1 USE INDEX (i1) IGNORE INDEX (i2) USE INDEX (i2);

   SELECT * FROM t1 USE INDEX (i1);
   ```

Para as pesquisas de `FULLTEXT`, as dicas de índice funcionam da seguinte forma:

* Para pesquisas em modo de linguagem natural, as dicas de índice são ignoradas silenciosamente. Por exemplo, `IGNORE INDEX(i1)` é ignorado sem aviso e o índice ainda é usado.

* Para pesquisas em modo booleano, as dicas de índice com `FOR ORDER BY` ou `FOR GROUP BY` são ignoradas silenciosamente. As dicas de índice com `FOR JOIN` ou sem o modificador `FOR` são respeitadas. Em contraste com a forma como as dicas se aplicam para pesquisas que não são `FULLTEXT`, a dica é usada para todas as fases da execução da consulta (encontrar linhas e recuperação, agrupamento e ordenamento). Isso é verdadeiro mesmo que a dica seja dada para um índice que não é `FULLTEXT`.

Por exemplo, as seguintes duas consultas são equivalentes:

  ```
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

```
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

### 10.9.5 Modelo de Custo do Otimizador

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

Para substituir uma estimativa de custo padrão (para uma entrada que especifica `NULL`), defina o custo para um valor que não seja `NULL`. Para retornar ao padrão, defina o valor para `NULL`. Em seguida, execute [`FLUSH OPTIMIZER_COSTS`(flush.html#flush-optimizer-costs) para informar ao servidor que leia novamente as tabelas de custo.

* `last_update`

O horário da última atualização da última linha.

* `comment`

Um comentário descritivo associado à estimativa de custo. Os DBA podem usar essa coluna para fornecer informações sobre por que uma linha de estimativa de custo armazena um valor específico.

* `default_value`

O valor padrão (compilado) para a estimativa de custo. Esta coluna é uma coluna gerada apenas para leitura que retém seu valor mesmo se a estimativa de custo associada for alterada. Para as linhas adicionadas à tabela no momento da execução, o valor desta coluna é `NULL`.

A chave primária da tabela `server_cost` é a coluna `cost_name`, portanto, não é possível criar várias entradas para qualquer estimativa de custo.

O servidor reconhece esses valores `cost_name` para a tabela `server_cost`:

* `disk_temptable_create_cost`, `disk_temptable_row_cost`

As estimativas de custo para tabelas temporárias criadas internamente armazenadas em um mecanismo de armazenamento baseado em disco (ou seja, `InnoDB` ou `MyISAM`). Aumentar esses valores aumenta a estimativa de custo do uso de tabelas temporárias internas e faz com que o otimizador prefira planos de consulta com menos uso delas. Para informações sobre tais tabelas, consulte a Seção 10.4.4, “Uso de Tabela Temporária Interna no MySQL”.

Os valores padrão maiores para esses parâmetros de disco em comparação com os valores padrão para os parâmetros de memória correspondentes (`memory_temptable_create_cost`, `memory_temptable_row_cost`) refletem o maior custo do processamento de tabelas baseadas em disco.

* `key_compare_cost`

O custo de comparar chaves de registro. Aumentar esse valor faz com que um plano de consulta que compara muitas chaves se torne mais caro. Por exemplo, um plano de consulta que executa um `filesort` se torna relativamente mais caro em comparação com um plano de consulta que evita a ordenação usando um índice.

* `memory_temptable_create_cost`, `memory_temptable_row_cost`

As estimativas de custo para tabelas temporárias internamente criadas armazenadas no mecanismo de armazenamento `MEMORY`. Aumentar esses valores aumenta a estimativa de custo do uso de tabelas temporárias internas e faz com que o otimizador prefira planos de consulta com menos uso delas. Para informações sobre essas tabelas, consulte a Seção 10.4.4, “Uso de Tabela Temporária Interna em MySQL”.

Os valores padrão menores para esses parâmetros de memória em comparação com os valores padrão para os parâmetros correspondentes do disco (`disk_temptable_create_cost`, `disk_temptable_row_cost`) refletem o menor custo de processamento de tabelas baseadas em memória.

* `row_evaluate_cost`

O custo de avaliar condições de registro. Aumentar esse valor faz com que um plano de consulta que examina muitas linhas se torne mais caro em comparação com um plano de consulta que examina menos linhas. Por exemplo, uma varredura de tabela se torna relativamente mais cara em comparação com uma varredura de intervalo que lê menos linhas.

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

* `default_value`

O valor padrão (compilado) para a estimativa de custo. Esta coluna é uma coluna gerada apenas para leitura que retém seu valor mesmo se a estimativa de custo associada for alterada. Para as linhas adicionadas à tabela no momento da execução, o valor desta coluna é `NULL`, com exceção de que, se a linha tiver o mesmo valor `cost_name` que uma das linhas originais, a coluna `default_value` terá o mesmo valor dessa linha.

A chave primária da tabela `engine_cost` é uma tupla que compreende as colunas (`cost_name`, `engine_name`, `device_type`) e, portanto, não é possível criar várias entradas para qualquer combinação de valores nessas colunas.

O servidor reconhece esses valores `cost_name` para a tabela `engine_cost`:

* `io_block_read_cost`

O custo de ler um índice ou bloco de dados do disco. Aumentar esse valor faz com que um plano de consulta que lê muitos blocos de disco se torne mais caro em comparação com um plano de consulta que lê menos blocos de disco. Por exemplo, uma varredura de tabela se torna relativamente mais cara em comparação com uma varredura de intervalo que lê menos blocos.

* `memory_block_read_cost`

Semelhante a `io_block_read_cost`, mas representa o custo de leitura de um índice ou bloco de dados de um buffer de banco de dados em memória.

Se os valores de `io_block_read_cost` e `memory_block_read_cost` forem diferentes, o plano de execução pode mudar entre duas execuções da mesma consulta. Suponha que o custo para acesso à memória seja menor que o custo para acesso ao disco. Nesse caso, na inicialização do servidor, antes de os dados terem sido lidos na piscina de buffers, você pode obter um plano diferente do que após a execução da consulta, porque, nesse caso, os dados estão na memória.

#### Fazendo alterações no banco de dados do modelo de custo

Para os DBAs que desejam alterar os parâmetros do modelo de custo em relação aos seus valores padrão, tente dobrar ou reduzir a metade o valor e medir o efeito.

Alterações nos parâmetros `io_block_read_cost` e `memory_block_read_cost` provavelmente produzirão resultados valiosos. Esses valores de parâmetro permitem que modelos de custo para métodos de acesso a dados considerem os custos de leitura de informações de diferentes fontes; ou seja, o custo de leitura de informações de disco em comparação com a leitura de informações já em um buffer de memória. Por exemplo, se todas as outras coisas forem iguais, definir `io_block_read_cost` para um valor maior que `memory_block_read_cost` faz com que o otimizador prefira planos de consulta que leem informações já mantidas na memória em comparação com planos que devem ler do disco.

Este exemplo mostra como alterar o valor padrão para `io_block_read_cost`:

```
UPDATE mysql.engine_cost
  SET cost_value = 2.0
  WHERE cost_name = 'io_block_read_cost';
FLUSH OPTIMIZER_COSTS;
```

Este exemplo mostra como alterar o valor de `io_block_read_cost` apenas para o motor de armazenamento `InnoDB`:

```
INSERT INTO mysql.engine_cost
  VALUES ('InnoDB', 0, 'io_block_read_cost', 3.0,
  CURRENT_TIMESTAMP, 'Using a slower disk for InnoDB');
FLUSH OPTIMIZER_COSTS;
```

### 10.9.6 Estatísticas do otimizador

A tabela do dicionário de dados `column_statistics` armazena estatísticas de histograma sobre os valores das colunas, para uso do otimizador na construção de planos de execução de consultas. Para realizar a gestão de histograma, use a declaração `ANALYZE TABLE`(analyze-table.html "15.7.3.1 ANALYZE TABLE Statement").

A tabela `column_statistics` tem essas características:

* A tabela contém estatísticas para colunas de todos os tipos de dados, exceto os tipos de geometria (dados espaciais) e `JSON`.

* A tabela é persistente, de modo que as estatísticas da coluna não precisam ser criadas a cada vez que o servidor é iniciado.

* O servidor realiza as atualizações na tabela; os usuários

A tabela `column_statistics` não é diretamente acessível pelos usuários, pois faz parte do dicionário de dados. As informações do histograma estão disponíveis usando `INFORMATION_SCHEMA.COLUMN_STATISTICS`, que é implementado como uma visão na tabela do dicionário de dados. `COLUMN_STATISTICS` tem essas colunas:

* `SCHEMA_NAME`, `TABLE_NAME`, `COLUMN_NAME`: Os nomes do esquema, tabela e coluna para os quais as estatísticas se aplicam.

* `HISTOGRAM`: Um valor `JSON` que descreve as estatísticas da coluna, armazenado como um histograma.

Os histogramas de coluna contêm recipientes para partes da faixa de valores armazenados na coluna. Os histogramas são objetos `JSON` para permitir flexibilidade na representação das estatísticas da coluna. Aqui está um objeto de histograma de amostra:

```
{
  "buckets": [
    [
      1,
      0.3333333333333333
    ],
    [
      2,
      0.6666666666666666
    ],
    [
      3,
      1
    ]
  ],
  "null-values": 0,
  "last-updated": "2017-03-24 13:32:40.000000",
  "sampling-rate": 1,
  "histogram-type": "singleton",
  "number-of-buckets-specified": 128,
  "data-type": "int",
  "collation-id": 8
}
```

Os objetos de histograma têm essas chaves:

* `buckets`: Os buckets do histograma. A estrutura do bucket depende do tipo de histograma.

Para os histogramas de `singleton`, os buckets contêm dois valores:

+ Valor 1: O valor para o bucket. O tipo depende do tipo de dados da coluna.

+ Valor 2: Um duplo que representa a frequência cumulativa para o valor. Por exemplo, .25 e .75 indicam que 25% e 75% dos valores na coluna são menores ou iguais ao valor do bucket.

Para histograma de `equi-height`, os buckets contêm quatro valores:

+ Valores 1, 2: Os valores inferiores e superiores inclusivos para o bucket. O tipo depende do tipo de dados da coluna.

+ Valor 3: Um duplo que representa a frequência cumulativa para o valor. Por exemplo, .25 e .75 indicam que 25% e 75% dos valores na coluna são menores ou iguais ao valor superior do bucket.

+ Valor 4: O número de valores distintos na faixa do valor inferior do bucket até o seu valor superior.

* `null-values`: Um número entre 0,0 e 1,0 que indica a fração dos valores da coluna que são valores SQL `NULL`. Se 0, a coluna não contém valores `NULL`.

* `last-updated`: Quando o histograma foi gerado, como um valor UTC no formato de *`YYYY-MM-DD hh:mm:ss.uuuuuu`*.

* `sampling-rate`: Um número entre 0,0 e 1,0 que indica a fração dos dados que foram amostrados para criar o histograma. Um valor de 1 significa que todos os dados foram lidos (sem amostragem).

* `histogram-type`: O tipo de histograma:

+ `singleton`: Um balde representa um único valor na coluna. Este tipo de histograma é criado quando o número de valores distintos na coluna é igual ou menor que o número de baldes especificados na declaração `ANALYZE TABLE` que gerou o histograma.

+ `equi-height`: Um balde representa uma faixa de valores. Este tipo de histograma é criado quando o número de valores distintos na coluna é maior que o número de baldes especificados na declaração `ANALYZE TABLE` que gerou o histograma.

* `number-of-buckets-specified`: O número de buckets especificado na declaração `ANALYZE TABLE`[(analyze-table.html "15.7.3.1 ANALYZE TABLE Statement")] que gerou o histograma.

* `data-type`: O tipo de dados que este histograma contém. Isso é necessário ao ler e analisar histograma de armazenamento persistente para a memória. O valor é um dos `int`, `uint` (inteiro sem sinal), `double`, `decimal`, `datetime` ou `string` (inclui strings de caracteres e binárias).

* `collation-id`: O ID de agregação para os dados do histograma. É principalmente significativo quando o valor de `data-type` é `string`. Os valores correspondem aos valores da coluna `ID` na tabela do Esquema de Informação `COLLATIONS`.

Para extrair valores específicos dos objetos do histograma, você pode usar operações `JSON`. Por exemplo:

```
mysql> SELECT
         TABLE_NAME, COLUMN_NAME,
         HISTOGRAM->>'$."data-type"' AS 'data-type',
         JSON_LENGTH(HISTOGRAM->>'$."buckets"') AS 'bucket-count'
       FROM INFORMATION_SCHEMA.COLUMN_STATISTICS;
+-----------------+-------------+-----------+--------------+
| TABLE_NAME      | COLUMN_NAME | data-type | bucket-count |
+-----------------+-------------+-----------+--------------+
| country         | Population  | int       |          226 |
| city            | Population  | int       |         1024 |
| countrylanguage | Language    | string    |          457 |
+-----------------+-------------+-----------+--------------+
```

O otimizador utiliza estatísticas de histograma, se aplicável, para colunas de qualquer tipo de dados para os quais as estatísticas são coletadas. O otimizador aplica estatísticas de histograma para determinar estimativas de linha com base na seletividade (efeito de filtragem) das comparações de valores de coluna contra valores constantes. Predicados dessas formas qualificam-se para o uso de histograma:

```
col_name = constant
col_name <> constant
col_name != constant
col_name > constant
col_name < constant
col_name >= constant
col_name <= constant
col_name IS NULL
col_name IS NOT NULL
col_name BETWEEN constant AND constant
col_name NOT BETWEEN constant AND constant
col_name IN (constant[, constant] ...)
col_name NOT IN (constant[, constant] ...)
```

Por exemplo, essas declarações contêm predicados que se qualificam para uso de histograma:

```
SELECT * FROM orders WHERE amount BETWEEN 100.0 AND 300.0;
SELECT * FROM tbl WHERE col1 = 15 AND col2 > 100;
```

O requisito de comparação com um valor constante inclui funções que são constantes, como `ABS()` e `FLOOR()`:

```
SELECT * FROM tbl WHERE col1 < ABS(-34);
```

As estatísticas de histograma são úteis principalmente para colunas não indexadas. Adicionar um índice a uma coluna para a qual as estatísticas de histograma sejam aplicáveis também pode ajudar o otimizador a fazer estimativas de linha. As compensações são:

* Um índice deve ser atualizado quando os dados da tabela são modificados. * Um histograma é criado ou atualizado apenas sob demanda, portanto, não adiciona sobrecarga quando os dados da tabela são modificados. Por outro lado, as estatísticas tornam-se progressivamente desatualizadas quando ocorrem modificações na tabela, até a próxima atualização.

O otimizador prefere as estimativas de linha do otimizador de intervalo às obtidas a partir das estatísticas do histograma. Se o otimizador determinar que o otimizador de intervalo é aplicado, ele não usa as estatísticas do histograma.

Para colunas que estão indexadas, as estimativas de linha podem ser obtidas para comparações de igualdade usando mergulhos no índice (consulte a Seção 10.2.1.2, “Otimização de intervalo”). Nesse caso, as estatísticas do histograma não são necessariamente úteis, porque os mergulhos no índice podem fornecer melhores estimativas.

Em alguns casos, o uso de estatísticas de histograma pode não melhorar a execução da consulta (por exemplo, se as estatísticas estiverem desatualizadas). Para verificar se esse é o caso, use `ANALYZE TABLE`(analyze-table.html "15.7.3.1 ANALYZE TABLE Statement") para regenerar as estatísticas de histograma, em seguida, execute a consulta novamente.

Como alternativa, para desabilitar as estatísticas do histograma, use `ANALYZE TABLE` para excluí-las. Um método diferente para desabilitar as estatísticas do histograma é desativar a bandeira `condition_fanout_filter` da variável de sistema `optimizer_switch` (embora isso possa desativar outras otimizações também):

```
SET optimizer_switch='condition_fanout_filter=off';
```

Se as estatísticas do histograma forem usadas, o efeito resultante será visível usando `EXPLAIN`. Considere a seguinte consulta, onde não há índice disponível para a coluna `col1`:

```
SELECT * FROM t1 WHERE col1 < 24;
```

Se as estatísticas do histograma indicarem que 57% das linhas em `t1` satisfazem o predicado `col1 < 24`, o filtro pode ocorrer mesmo na ausência de um índice, e `EXPLAIN` mostra 57,00 na coluna `filtered`.