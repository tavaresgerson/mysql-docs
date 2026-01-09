### 10.9.2 Otimizações Alternativas

A variável de sistema `optimizer_switch` permite o controle do comportamento do otimizador. Seu valor é um conjunto de flags, cada um dos quais tem um valor de `on` ou `off` para indicar se o comportamento correspondente do otimizador está habilitado ou desabilitado. Esta variável tem valores globais e de sessão e pode ser alterada em tempo de execução. O valor padrão global pode ser definido na inicialização do servidor.

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
                    derived_condition_pushdown=on,hash_set_operations=on
1 row in set (0.00 sec)
```

Para alterar o valor de `optimizer_switch`, atribua um valor consistindo de uma lista de vírgulas de um ou mais comandos:

```
SET [GLOBAL|SESSION] optimizer_switch='command[,command]...';
```

Cada valor de *`command`* deve ter uma das formas mostradas na tabela a seguir.

<table summary="A sintaxe do valor do comando para os comandos SET optimizer_switch."><thead><tr> <th>Sintaxe do Comando</th> <th>Significado</th> </tr></thead><tbody><tr> <td><code>default</code></td> <td>Reinicie toda otimização para seu valor padrão</td> </tr><tr> <td><code><em class="replaceable"><code>opt_name</code></em>=default</code></td> <td>Defina a otimização nomeada para seu valor padrão</td> </tr><tr> <td><code><em class="replaceable"><code>opt_name</code></em>=off</code></td> <td>Desabilite a otimização nomeada</td> </tr><tr> <td><code><em class="replaceable"><code>opt_name</code></em>=on</code></td> <td>Habilite a otimização nomeada</td> </tr></tbody></table>

A ordem dos comandos no valor não importa, embora o comando `default` seja executado primeiro, se presente. Definir uma bandeira `opt_name` com o valor `default` define-a como o valor padrão entre `on` ou `off`. Especificar qualquer *`opt_name`* mais de uma vez no valor não é permitido e causa um erro. Quaisquer erros no valor fazem com que a atribuição falhe com um erro, deixando o valor de `optimizer_switch` inalterado.

A lista a seguir descreve os nomes de bandeiras `opt_name` permitidos, agrupados por estratégia de otimização:

* Bandeiras de Acesso a Chave em Bloco

  + `batched_key_access` (padrão `off`)

    Controla o uso do algoritmo de junção BKA.

  Para que `batched_key_access` tenha algum efeito quando definido como `on`, a bandeira `mrr` também deve ser `on`. Atualmente, a estimativa de custo para MRR é muito pessimista. Portanto, também é necessário que `mrr_cost_based` seja `off` para que o BKA seja usado.

  Para mais informações, consulte a Seção 10.2.1.12, “Junções de Acesso a Chave em Bloco e Enlaçadas”.

* Bandeiras de Loop Enlaçado em Bloco

  + `block_nested_loop` (padrão `on`)

    Controla o uso de junções hash, assim como as dicas de otimização `BNL` e `NO_BNL`.

  Para mais informações, consulte a Seção 10.2.1.12, “Junções de Acesso a Chave em Bloco e Enlaçadas”.

* Bandeiras de Filtro de Condição

  + `condition_fanout_filter` (padrão `on`)

    Controla o uso do filtro de condição.

  Para mais informações, consulte a Seção 10.2.1.13, “Filtro de Condição”.

* Bandeiras de Desvio de Condição Derivada

  + `derived_condition_pushdown` (padrão `on`)

    Controla o desvio de condição derivada.

  Para mais informações, consulte a Seção 10.2.2.5, “Otimização de Desvio de Condição Derivada”

* Bandeiras de Fusão de Tabelas Derivadas

  + `derived_merge` (padrão `on`)

    Controla a fusão de tabelas e visualizações derivadas no bloco da consulta externa.

A bandeira `derived_merge` controla se o otimizador tenta mesclar tabelas derivadas, referências de visualizações e expressões de tabela comuns no bloco de consulta externa, assumindo que nenhuma outra regra impeça a mesclagem; por exemplo, uma diretiva `ALGORITHM` para uma visualização tem precedência sobre a configuração `derived_merge`. Por padrão, a bandeira está ativada para permitir a mesclagem.

Para mais informações, consulte a Seção 10.2.2.4, “Otimização de Tabelas Derivadas, Referências de Visualizações e Expressões de Tabela com Mesclagem ou Materialização”.

* Bandeiras de Pushdown de Condição do Motor

  + `engine_condition_pushdown` (padrão `on`)

    Controla o pushdown de condição do motor.

  Para mais informações, consulte a Seção 10.2.1.5, “Otimização de Pushdown de Condição do Motor”.

* Bandeiras de Join Hash

  + `hash_join` (padrão `on`)

    Não tem efeito no MySQL 9.5. Use a bandeira `block_nested_loop` em vez disso.

  Para mais informações, consulte a Seção 10.2.1.4, “Otimização de Join Hash”.

* Bandeiras de Pushdown de Condição de Índice

  + `index_condition_pushdown` (padrão `on`)

    Controla o pushdown de condição de índice.

  Para mais informações, consulte a Seção 10.2.1.6, “Otimização de Pushdown de Condição de Índice”.

* Bandeiras de Extensões de Índice

  + `use_index_extensions` (padrão `on`)

    Controla o uso de extensões de índice.

  Para mais informações, consulte a Seção 10.3.10, “Uso de Extensões de Índice”.

* Bandeiras de Mesclagem de Índice

  + `index_merge` (padrão `on`)

    Controla todas as otimizações de mesclagem de índice.

  + `index_merge_intersection` (padrão `on`)

    Controla a otimização de Acesso de Interseção de Mesclagem de Índice.

  + `index_merge_sort_union` (padrão `on`)

    Controla a otimização de Acesso de Mesclagem de Ordenação-União de Índice.

  + `index_merge_union` (padrão `on`)

    Controla a otimização de Acesso de Mesclagem de União de Índice.

Para mais informações, consulte a Seção 10.2.1.3, “Otimização da Fusão de Índices”.

* Índices de Visibilidade

  + `use_invisible_indexes` (padrão `off`)

    Controla o uso de índices invisíveis.

  Para mais informações, consulte a Seção 10.3.12, “Índices Invisíveis”.

* Índices de Limpeza de Duplicatas

  + `prefer_ordering_index` (padrão `on`)

    Controla se, no caso de uma consulta com uma cláusula `ORDER BY` ou `GROUP BY` com uma cláusula `LIMIT`, o otimizador tenta usar um índice ordenado em vez de um índice não ordenado, um filesort ou outra otimização. Essa otimização é realizada por padrão sempre que o otimizador determina que usá-la permitiria uma execução mais rápida da consulta.

  Como o algoritmo que faz essa determinação não pode lidar com todos os casos concebíveis (em parte devido à suposição de que a distribuição dos dados é sempre mais ou menos uniforme), há casos em que essa otimização pode não ser desejável. Essa otimização pode ser desativada definindo o sinalizador `prefer_ordering_index` para `off`.

  Para mais informações e exemplos, consulte a Seção 10.2.1.19, “Otimização de Consultas LIMIT”.

* Índices de Leitura de Múltiplos Intervalos

  + `mrr` (padrão `on`)

    Controla a estratégia de Leitura de Múltiplos Intervalos.

  + `mrr_cost_based` (padrão `on`)

    Controla o uso de MRR baseado em custo se `mrr=on`.

  Para mais informações, consulte a Seção 10.2.1.11, “Otimização de Leitura de Múltiplos Intervalos”.

* Índices de Semijoin

  + `duplicateweedout` (padrão `on`)

    Controla a estratégia de Semijoin Duplicate Weedout.

  + `firstmatch` (padrão `on`)

    Controla a estratégia de Semijoin FirstMatch.

  + `loosescan` (padrão `on`)

    Controla a estratégia de Semijoin LooseScan (não confundir com Loose Index Scan para `GROUP BY`).

  + `semijoin` (padrão `on`)

    Controla todas as estratégias de Semijoin.

Isso também se aplica à otimização de antijoin.

As flags `semijoin`, `firstmatch`, `loosescan` e `duplicateweedout` permitem o controle das estratégias de semijoin. A flag `semijoin` controla se os semijoins são usados. Se estiver definida como `on`, as flags `firstmatch` e `loosescan` permitem um controle mais fino sobre as estratégias de semijoin permitidas.

Se a estratégia de semijoin `duplicateweedout` for desativada, ela não será usada, a menos que todas as outras estratégias aplicáveis também sejam desativadas.

Se `semijoin` e `materialization` estiverem ambas ativadas, os semijoins também usam materialização quando aplicável. Essas flags estão ativadas por padrão.

Para mais informações, consulte Otimização de Predicados de Subconsultas IN e EXISTS com Transformações de Semijoin.

* Fлагаs de Operações de Conjunto

  + `hash_set_operations` (padrão `on`)

    Habilita a otimização da tabela hash para operações de conjunto envolvendo `EXCEPT` e `INTERSECT`); ativado por padrão. Caso contrário, a deduplicação baseada em tabela temporária é usada, como nas versões anteriores do MySQL.

    A quantidade de memória usada para hashing por essa otimização pode ser controlada usando a variável de sistema `set_operations_buffer_size`; aumentar isso geralmente resulta em tempos de execução mais rápidos para instruções que usam essas operações.

* Fлагаs de Acesso de Scan Descartável

  + `skip_scan` (padrão `on`)

    Controla o uso do método de acesso de Scan Descartável.

  Para mais informações, consulte Método de Acesso de Intervalo de Scan Descartável.

* Fлагаs de Materialização de Subconsultas

  + `materialization` (padrão `on`)

    Controla a materialização (incluindo materialização de semijoin).

  + `subquery_materialization_cost_based` (padrão `on`)

    Use a escolha de materialização baseada no custo.

A bandeira `materialização` controla se a materialização de subconsultas é usada. Se `semijoin` e `materialização` estiverem ambas ativadas, as semijoins também usam materialização quando aplicável. Essas bandeiras estão ativadas por padrão.

A bandeira `subquery_materialization_cost_based` permite o controle da escolha entre a materialização de subconsultas e a transformação de subconsultas `IN` para `EXISTS`. Se a bandeira estiver ativada (o padrão), o otimizador realiza uma escolha baseada no custo entre a materialização de subconsultas e a transformação de subconsultas `IN` para `EXISTS` se qualquer um dos métodos puder ser usado. Se a bandeira estiver desativada, o otimizador escolhe a materialização de subconsultas em detrimento da transformação de subconsultas `IN` para `EXISTS`.

Para mais informações, consulte a Seção 10.2.2, “Otimizando subconsultas, tabelas derivadas, referências de visualizações e expressões de tabela comum”.

* Bandeiras de Transformação de Subconsultas

  + `subquery_to_derived` (desativado por padrão)

    O otimizador pode, em muitos casos, transformar uma subconsulta escalar em uma cláusula `SELECT`, `WHERE`, `JOIN` ou `HAVING` em uma junção externa esquerda em uma tabela derivada. (Dependendo da não-nulidade da tabela derivada, isso pode, às vezes, ser simplificado ainda mais para uma junção interna.) Isso pode ser feito para uma subconsulta que atenda às seguintes condições:

    - A subconsulta não utiliza funções não determinísticas, como `RAND()`.

    - A consulta pai não define uma variável de usuário, pois reescrevê-la pode afetar a ordem de execução, o que poderia levar a resultados inesperados se a variável for acessada mais de uma vez na mesma consulta.

Essa otimização também pode ser aplicada a uma subconsulta de tabela que é o argumento de `IN`, `NOT IN`, `EXISTS` ou `NOT EXISTS`, que não contém um `GROUP BY`. Também pode ser aplicada para predicados de comparação quantificados gerais (comparações com `ANY` ou `ALL`) na cláusula `SELECT` ou `WHERE` em muitos casos; consulte a Seção 10.2.2.6, “Otimizando subconsultas ANY e ALL”, para mais informações.

O valor padrão para essa bandeira é `off`, pois, na maioria dos casos, habilitar essa otimização não produz nenhuma melhoria perceptível no desempenho (e, em muitos casos, pode até fazer com que as consultas sejam executadas mais lentamente), mas você pode habilitar a otimização definindo a bandeira `subquery_to_derived` para `on`. Isso pode ser útil em certos casos quando há execução lenta de subconsultas.

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

Como pode ser visto ao executar `SHOW WARNINGS` imediatamente após a segunda declaração `EXPLAIN`, com a otimização habilitada, a consulta `SELECT * FROM t1 WHERE t1.a > (SELECT COUNT(a) FROM t2)` é reescrita de uma forma semelhante à que é mostrada aqui:

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

Verificar e simplificar o resultado de `SHOW WARNINGS` após executar `EXPLAIN` nesta consulta mostra que, quando a bandeira `subquery_to_derived` é habilitada, `SELECT * FROM t1 WHERE t1.b < 0 OR t1.a IN (SELECT t2.a + 1 FROM t2)` é reescrita de uma forma semelhante à que é mostrada aqui:

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

Se executarmos `SHOW WARNINGS` após executarmos `EXPLAIN` na consulta `SELECT * FROM t1 WHERE t1.b < 0 OR EXISTS(SELECT * FROM t2 WHERE t2.a = t1.a + 1)` quando `subquery_to_derived` estiver habilitado, e simplificarmos a segunda linha do resultado, vemos que ela foi reescrita em uma forma que se assemelha a isso:

```
    SELECT a, b FROM t1
    LEFT JOIN (SELECT DISTINCT 1 AS e1, t2.a AS e2 FROM t2) d
    ON t1.a + 1 = d.e2
    WHERE   t1.b < 0
            OR
            d.e1 IS NOT NULL;
    ```

Para obter mais informações, consulte a Seção 10.2.2.4, “Otimização de Tabelas Derivadas, Referências de Visualizações e Expressões de Tabela Comuns com Fusão ou Materialização”, bem como a Seção 10.2.1.19, “Otimização da Consulta LIMIT” e Otimização de Predicados de Subconsultas IN e EXISTS com Transformações Semijoin”.

Quando você atribui um valor à `optimizer_switch`, as flags que não são mencionadas mantêm seus valores atuais. Isso permite habilitar ou desabilitar comportamentos específicos do otimizador em uma única instrução sem afetar outros comportamentos. A instrução não depende do que outras flags do otimizador existem e quais são seus valores. Suponha que todas as otimizações de Fusão de Índices estejam habilitadas:

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

Se o servidor estiver usando os métodos de acesso Union ou Sort-Union de Fusão de Índices para certas consultas e você quiser verificar se o otimizador pode se sair melhor sem eles, defina o valor da variável da seguinte forma:

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