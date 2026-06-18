### 10.9.2 Otimizações comutadas

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

Para alterar o valor de `optimizer_switch`, atribua um valor que seja uma lista de vírgulas de um ou mais comandos:

```
SET [GLOBAL|SESSION] optimizer_switch='command[,command]...';
```

Cada valor `command` deve ter uma das formas mostradas na tabela a seguir.

<table summary="A sintaxe do valor do comando para os comandos SET optimizer_switch."><thead><tr> <th>Sintaxe de comando</th> <th>Significado</th> </tr></thead><tbody><tr> <td>[[<code>default</code>]]</td> <td>Reinicie todas as otimizações para o valor padrão</td> </tr><tr> <td>[[<code><em class="replaceable"><code>opt_name</code>]]</em>=default</code></td> <td>Defina a otimização nomeada para o valor padrão</td> </tr><tr> <td>[[<code><em class="replaceable"><code>opt_name</code>]]</em>=off</code></td> <td>Desative a otimização nomeada</td> </tr><tr> <td>[[<code><em class="replaceable"><code>opt_name</code>]]</em>=on</code></td> <td>Ative a otimização nomeada</td> </tr></tbody></table>

A ordem dos comandos no valor não importa, embora o comando `default` seja executado primeiro, se presente. Definir uma bandeira `opt_name` para `default` define-a para qualquer um de `on` ou `off` que seja seu valor padrão. Especificar qualquer `opt_name` dado mais de uma vez no valor não é permitido e causa um erro. Quaisquer erros no valor fazem com que a atribuição falhe com um erro, deixando o valor de `optimizer_switch` inalterado.

A lista a seguir descreve os nomes das bandeiras `opt_name` permitidos, agrupados por estratégia de otimização:

- Marcadores de acesso por lote

  - `batched_key_access` (padrão `off`)

    Controles para o uso do algoritmo de junção do BKA.

  Para que `batched_key_access` tenha algum efeito quando definido como `on`, a bandeira `mrr` também deve ser `on`. Atualmente, a estimativa de custo para MRR é muito pessimista. Portanto, também é necessário que `mrr_cost_based` seja `off` para que o BKA seja usado.

  Para obter mais informações, consulte a Seção 10.2.1.12, “Conjuntos de acesso a chave em laço aninhado e loteado”.

- Bloquear as bandeiras de laço aninhado

  - `block_nested_loop` (padrão `on`)

    O controle do uso do algoritmo de junção BNL. No MySQL 8.0.18 e versões posteriores, isso também controla o uso de junções hash, assim como as dicas de otimização `BNL` e `NO_BNL`. No MySQL 8.0.20 e versões posteriores, o suporte a loops aninhados é removido do servidor MySQL, e essa bandeira controla o uso apenas de junções hash, assim como as dicas de otimização referenciadas.

  Para obter mais informações, consulte a Seção 10.2.1.12, “Conjuntos de acesso a chave em laço aninhado e loteado”.

- Filtros de condição

  - `condition_fanout_filter` (padrão `on`)

    O controle usa a filtragem de condições.

  Para obter mais informações, consulte a Seção 10.2.1.13, “Filtragem de Condições”.

- Flags de empurrão de condição derivada

  - `derived_condition_pushdown` (padrão `on`)

    Controle de condição derivada pushdown.

  Para obter mais informações, consulte a Seção 10.2.2.5, “Otimização de empilhamento de condição derivada”.

- Ferramentas de fusão de tabelas derivadas

  - `derived_merge` (padrão `on`)

    Controles para a fusão de tabelas e visualizações derivadas no bloco de consulta externa.

  A bandeira `derived_merge` controla se o otimizador tenta combinar tabelas derivadas, referências de visualizações e expressões de tabela comuns no bloco de consulta externa, assumindo que nenhuma outra regra impeça a combinação; por exemplo, uma diretiva `ALGORITHM` para uma visualização tem precedência sobre a configuração `derived_merge`. Por padrão, a bandeira é `on` para habilitar a combinação.

  Para obter mais informações, consulte a Seção 10.2.2.4, “Otimização de tabelas derivadas, referências de visualização e expressões de tabela comuns com fusão ou materialização”.

- Marcadores de condição do motor

  - `engine_condition_pushdown` (padrão `on`)

    Controle a condição do motor para baixo.

  Para obter mais informações, consulte a Seção 10.2.1.5, “Otimização da Depressão do Estado do Motor”.

- Ferramentas de junção hash

  - `hash_join` (padrão `on`)

    Controla as junções hash apenas no MySQL 8.0.18 e não tem efeito em nenhuma versão subsequente. No MySQL 8.0.19 e versões posteriores, para controlar o uso da junção hash, use a bandeira `block_nested_loop` (código PH 0) em vez disso.

  Para obter mais informações, consulte a Seção 10.2.1.4, “Otimização da Conjunção Hash”.

- Índices Condição Pushdown Flags

  - `index_condition_pushdown` (padrão `on`)

    Controles de indexação condicional pushdown.

  Para obter mais informações, consulte a Seção 10.2.1.6, “Otimização da empilhamento da condição de índice”.

- Extensões do índice: bandeiras

  - `use_index_extensions` (padrão `on`)

    Controles para uso de extensões de índice.

  Para obter mais informações, consulte a Seção 10.3.10, “Uso de extensões de índice”.

- Ferramentas de mesclagem de índice

  - `index_merge` (padrão `on`)

    Controla todas as otimizações de junção de índice.

  - `index_merge_intersection` (padrão `on`)

    Controla a otimização da interseção de junção de índices.

  - `index_merge_sort_union` (padrão `on`)

    Controla a otimização da união de índices, ordenação por junção e acesso.

  - `index_merge_union` (padrão `on`)

    Controla a otimização da união de junção de índice.

  Para obter mais informações, consulte a Seção 10.2.1.3, “Otimização da Mesclagem de Índices”.

- Índices Visibilidade de Marcadores

  - `use_invisible_indexes` (padrão `off`)

    Controles para uso de índices invisíveis.

  Para mais informações, consulte a Seção 10.3.12, “Índices Invisíveis”.

- Ferramentas de otimização de limite

  - `prefer_ordering_index` (padrão `on`)

    Controla se, no caso de uma consulta com um `ORDER BY` ou `GROUP BY` com uma cláusula `LIMIT`, o otimizador tenta usar um índice ordenado em vez de um índice não ordenado, um filesort ou outra otimização. Essa otimização é realizada por padrão sempre que o otimizador determina que, ao usá-la, seria possível executar a consulta mais rapidamente.

    Como o algoritmo que faz essa determinação não consegue lidar com todos os casos possíveis (em parte devido à suposição de que a distribuição dos dados é sempre mais ou menos uniforme), há casos em que essa otimização pode não ser desejável. Antes do MySQL 8.0.21, não era possível desativar essa otimização, mas no MySQL 8.0.21 e versões posteriores, embora continue sendo o comportamento padrão, pode ser desativada definindo a bandeira `prefer_ordering_index` para `off`.

  Para obter mais informações e exemplos, consulte a Seção 10.2.1.19, “Otimização da consulta LIMIT”.

- Ferramentas de leitura de faixa de múltiplos intervalos

  - `mrr` (padrão `on`)

    Controla a estratégia de leitura de Multi-Range.

  - `mrr_cost_based` (padrão `on`)

    Controles usam o MRR baseado em custos se `mrr=on`.

  Para obter mais informações, consulte a Seção 10.2.1.11, “Otimização da Leitura de Múltiplos Alcance”.

- Bandeiras Semijoin

  - `duplicateweedout` (padrão `on`)

    Controla a estratégia de semijoin Duplicate Weedout.

  - `firstmatch` (padrão `on`)

    Controla a estratégia Semijoin FirstMatch.

  - `loosescan` (padrão `on`)

    Controla a estratégia de junção parcial LooseScan (não confundir com Loose Index Scan para `GROUP BY`).

  - `semijoin` (padrão `on`)

    Controla todas as estratégias de junção parcial.

    No MySQL 8.0.17 e versões posteriores, isso também se aplica à otimização de antijoin.

  As bandeiras `semijoin`, `firstmatch`, `loosescan` e `duplicateweedout` permitem o controle das estratégias de semijoin. A bandeira `semijoin` controla se os semijoins são usados. Se estiver definida como `on`, as bandeiras `firstmatch` e `loosescan` permitem um controle mais preciso sobre as estratégias de semijoin permitidas.

  Se a estratégia de junção semi-join `duplicateweedout` estiver desativada, ela não será usada, a menos que todas as outras estratégias aplicáveis também estejam desativadas.

  Se `semijoin` e `materialization` forem ambos `on`, os semijoins também usam materialização quando aplicável. Essas bandeiras são `on` por padrão.

  Para obter mais informações, consulte a Seção 10.2.2.1, “Otimizando Predicados de Subconsultas IN e EXISTS com Transformações Semijoin”.

- Ignorar bandeiras de varredura

  - `skip_scan` (padrão `on`)

    Controles utilizam o método de acesso de varredura saltável.

  Para obter mais informações, consulte o método de acesso sem varredura de intervalo.

- Marcadores de materialização de subconsultas

  - `materialization` (padrão `on`)

    Controla a materialização (incluindo a materialização por junção parcial).

  - `subquery_materialization_cost_based` (padrão `on`)

    Use a opção de materialização baseada no custo.

  A bandeira `materialization` controla se a materialização de subconsultas é usada. Se `semijoin` e `materialization` forem ambos `on`, os semijoins também usam materialização quando aplicável. Essas bandeiras são `on` por padrão.

  A bandeira `subquery_materialization_cost_based` permite o controle sobre a escolha entre materialização de subconsulta e transformação de subconsulta de `IN` para `EXISTS`. Se a bandeira for `on` (o padrão), o otimizador realiza uma escolha baseada nos custos entre materialização de subconsulta e transformação de subconsulta de `IN` para `EXISTS`, se qualquer um dos métodos puder ser usado. Se a bandeira for `off`, o otimizador escolhe a materialização de subconsulta sobre a transformação de subconsulta de `IN` para `EXISTS`.

  Para obter mais informações, consulte a Seção 10.2.2, “Otimização de subconsultas, tabelas derivadas, referências de visualizações e expressões de tabela comum”.

- Ferramentas de Transformação de Subconsultas

  - `subquery_to_derived` (padrão `off`)

    A partir do MySQL 8.0.21, o otimizador pode, em muitos casos, transformar uma subconsulta escalar em uma cláusula `SELECT`, `WHERE`, `JOIN` ou `HAVING` em uma junção externa esquerda em uma tabela derivada. (Dependendo da nulidade da tabela derivada, isso pode, às vezes, ser simplificado ainda mais para uma junção interna.) Isso pode ser feito para uma subconsulta que atenda às seguintes condições:

    - A subconsulta não utiliza funções não determinísticas, como `RAND()`.

    - A subconsulta não é uma subconsulta `ANY` ou `ALL`, que pode ser reescrita para usar `MIN()` ou `MAX()`.

    - A consulta pai não define uma variável de usuário, pois reescrevê-la pode afetar a ordem de execução, o que poderia levar a resultados inesperados se a variável for acessada mais de uma vez na mesma consulta.

    - A subconsulta não deve ser correlacionada, ou seja, não deve referenciar uma coluna de uma tabela na consulta externa, nem conter um aglomerado que seja avaliado na consulta externa.

    Antes do MySQL 8.0.22, a subconsulta não podia conter uma cláusula `GROUP BY`.

    Essa otimização também pode ser aplicada a uma subconsulta de tabela que é o argumento de `IN`, `NOT IN`, `EXISTS` ou `NOT EXISTS`, que não contém um `GROUP BY`.

    O valor padrão para essa bandeira é `off`, pois, na maioria dos casos, habilitar essa otimização não produz nenhuma melhoria perceptível no desempenho (e, em muitos casos, pode até fazer com que as consultas sejam executadas mais lentamente), mas você pode habilitar a otimização definindo a bandeira `subquery_to_derived` para `on`. É destinado principalmente para uso em testes.

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

    Como pode ser visto ao executar `SHOW WARNINGS` imediatamente após a segunda instrução `EXPLAIN`, com a otimização habilitada, a consulta `SELECT * FROM t1 WHERE t1.a > (SELECT COUNT(a) FROM t2)` é reescrita em uma forma semelhante à mostrada aqui:

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

    A verificação e simplificação do resultado de `SHOW WARNINGS` após a execução de `EXPLAIN` nesta consulta mostra que, quando a bandeira `subquery_to_derived` está ativada, `SELECT * FROM t1 WHERE t1.b < 0 OR t1.a IN (SELECT t2.a + 1 FROM t2)` é reescrita em uma forma semelhante àquela mostrada aqui:

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

    Se executarmos `SHOW WARNINGS` após executarmos `EXPLAIN` na consulta `SELECT * FROM t1 WHERE t1.b < 0 OR EXISTS(SELECT * FROM t2 WHERE t2.a = t1.a + 1)` quando `subquery_to_derived` foi habilitado, e simplificarmos a segunda linha do resultado, vemos que ela foi reescrita em um formato que se assemelha a este:

    ```
    SELECT a, b FROM t1
    LEFT JOIN (SELECT DISTINCT 1 AS e1, t2.a AS e2 FROM t2) d
    ON t1.a + 1 = d.e2
    WHERE   t1.b < 0
            OR
            d.e1 IS NOT NULL;
    ```

    Para obter mais informações, consulte a Seção 10.2.2.4, “Otimização de tabelas derivadas, referências de visualização e expressões de tabela comuns com junção ou materialização”, bem como a Seção 10.2.1.19, “Otimização da consulta LIMIT”, e a Seção 10.2.2.1, “Otimização de predicados de subconsultas IN e EXISTS com transformações de semijoin”.

Quando você atribui um valor a `optimizer_switch`, as flags que não são mencionadas mantêm seus valores atuais. Isso permite habilitar ou desabilitar comportamentos específicos do otimizador em uma única instrução sem afetar outros comportamentos. A instrução não depende do que outras flags do otimizador existem e quais são seus valores. Suponha que todas as otimizações de Merge de Índices estejam habilitadas:

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

Se o servidor estiver usando os métodos de acesso Index Merge Union ou Index Merge Sort-Union para certas consultas e você quiser verificar se o otimizador pode funcionar melhor sem eles, defina o valor da variável da seguinte maneira:

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
