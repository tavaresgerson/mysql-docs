#### 8.2.1.11 Block Nested-Loop e Batched Key Access Joins

Em MySQL, está disponível um algoritmo de JOIN chamado Batched Key Access (BKA), que utiliza tanto o acesso por Index à tabela unida quanto um join buffer. O algoritmo BKA suporta operações de inner join, outer join e semijoin, incluindo nested outer joins. Os benefícios do BKA incluem melhor desempenho de JOIN devido a uma varredura de tabela mais eficiente. Além disso, o algoritmo Block Nested-Loop (BNL) Join, que era usado anteriormente apenas para inner joins, foi estendido e pode ser empregado para operações de outer join e semijoin, incluindo nested outer joins.

As seções a seguir discutem o gerenciamento do join buffer que sustenta a extensão do algoritmo BNL original, o algoritmo BNL estendido e o algoritmo BKA. Para obter informações sobre estratégias de semijoin, consulte a Seção 8.2.2.1, “Optimizing Subqueries, Derived Tables, and View References with Semijoin Transformations”.

* Gerenciamento de Join Buffer para Algoritmos Block Nested-Loop e Batched Key Access
* Algoritmo Block Nested-Loop para Outer Joins e Semijoins
* Batched Key Access Joins
* Optimizer Hints para Algoritmos Block Nested-Loop e Batched Key Access

##### Gerenciamento de Join Buffer para Algoritmos Block Nested-Loop e Batched Key Access

O MySQL pode empregar join buffers para executar não apenas inner joins sem acesso por Index à tabela interna, mas também outer joins e semijoins que aparecem após o *flattening* (achatamento) da subquery. Além disso, um join buffer pode ser usado de forma eficaz quando há um acesso por Index à tabela interna.

O código de gerenciamento do join buffer utiliza o espaço do join buffer de forma ligeiramente mais eficiente ao armazenar os valores das colunas de linhas relevantes: Nenhum byte adicional é alocado no buffer para uma coluna de linha se seu valor for `NULL`, e o número mínimo de bytes é alocado para qualquer valor do tipo `VARCHAR`.

O código suporta dois tipos de buffers: regular e incremental. Suponha que o join buffer `B1` seja empregado para unir as tabelas `t1` e `t2`, e o resultado desta operação seja unido à tabela `t3` usando o join buffer `B2`:

* Um join buffer regular contém colunas de cada operando do JOIN. Se `B2` for um join buffer regular, cada linha *`r`* inserida em `B2` é composta pelas colunas de uma linha *`r1`* de `B1` e pelas colunas relevantes de uma linha correspondente *`r2`* da tabela `t3`.

* Um join buffer incremental contém apenas colunas de linhas produzidas pelo segundo operando do JOIN. Ou seja, ele é incremental em relação a uma linha do buffer do primeiro operando. Se `B2` for um join buffer incremental, ele contém as colunas relevantes da linha *`r2`* juntamente com um link para a linha *`r1`* de `B1`.

Buffers incrementais são sempre incrementais em relação a um join buffer de uma operação de JOIN anterior, portanto, o buffer da primeira operação de JOIN é sempre um buffer regular. No exemplo dado, o buffer `B1` usado para unir as tabelas `t1` e `t2` deve ser um buffer regular.

Cada linha do buffer incremental usada para uma operação de JOIN contém apenas as colunas relevantes de uma linha da tabela a ser unida. Essas colunas são complementadas com uma referência às colunas relevantes da linha correspondente do resultado da primeira operação de JOIN. Várias linhas no buffer incremental podem se referir à mesma linha *`r`* cujas colunas estão armazenadas nos buffers anteriores na medida em que todas essas linhas correspondem à linha *`r`*.

Buffers incrementais permitem uma cópia menos frequente de colunas dos buffers usados para operações de JOIN anteriores. Isso proporciona economia de espaço no buffer porque, no caso geral, uma linha produzida pelo primeiro operando do JOIN pode ser correspondida por várias linhas produzidas pelo segundo operando do JOIN. Não é necessário fazer várias cópias de uma linha do primeiro operando. Buffers incrementais também proporcionam economia no tempo de processamento devido à redução no tempo de cópia.

As flags `block_nested_loop` e `batched_key_access` da variável de sistema `optimizer_switch` controlam como o otimizador usa os algoritmos Block Nested-Loop e Batched Key Access Join. Por padrão, `block_nested_loop` está `on` e `batched_key_access` está `off`. Consulte a Seção 8.9.2, “Switchable Optimizations”. Optimizer hints também podem ser aplicados; consulte Optimizer Hints para Algoritmos Block Nested-Loop e Batched Key Access.

Para obter informações sobre estratégias de semijoin, consulte a Seção 8.2.2.1, “Optimizing Subqueries, Derived Tables, and View References with Semijoin Transformations”.

##### Algoritmo Block Nested-Loop para Outer Joins e Semijoins

A implementação original do algoritmo BNL do MySQL foi estendida para suportar operações de outer join e semijoin.

Quando estas operações são executadas com um join buffer, cada linha inserida no buffer é fornecida com uma flag de correspondência (*match flag*).

Se uma operação de outer join for executada usando um join buffer, cada linha da tabela produzida pelo segundo operando é verificada quanto à correspondência em relação a cada linha no join buffer. Quando uma correspondência é encontrada, uma nova linha estendida é formada (a linha original mais as colunas do segundo operando) e enviada para extensões adicionais pelas operações de JOIN restantes. Além disso, a *match flag* da linha correspondida no buffer é habilitada. Depois que todas as linhas da tabela a ser unida tiverem sido examinadas, o join buffer é varrido. Cada linha do buffer que não tem sua *match flag* habilitada é estendida com complementos `NULL` (valores `NULL` para cada coluna no segundo operando) e enviada para extensões adicionais pelas operações de JOIN restantes.

A flag `block_nested_loop` da variável de sistema `optimizer_switch` controla como o otimizador usa o algoritmo Block Nested-Loop. Por padrão, `block_nested_loop` está `on`. Consulte a Seção 8.9.2, “Switchable Optimizations”. Optimizer hints também podem ser aplicados; consulte Optimizer Hints para Algoritmos Block Nested-Loop e Batched Key Access.

Na saída do `EXPLAIN`, o uso de BNL para uma tabela é sinalizado quando o valor `Extra` contém `Using join buffer (Block Nested Loop)` e o valor `type` é `ALL`, `index` ou `range`.

Alguns casos envolvendo a combinação de uma ou mais subqueries com um ou mais left joins, particularmente aqueles que retornam muitas linhas, podem usar BNL mesmo que não seja o ideal nessas instâncias. Este é um problema conhecido que foi corrigido no MySQL 8.0. Se a atualização do MySQL não for imediatamente viável para você, pode ser útil desabilitar o BNL temporariamente, definindo `optimizer_switch='block_nested_loop=off'` ou empregando o optimizer hint `NO_BNL` para permitir que o otimizador escolha um plano melhor, usando uma ou mais *index hints* (consulte a Seção 8.9.4, “Index Hints”), ou alguma combinação destes, para melhorar o desempenho dessas Queries.

Para obter informações sobre estratégias de semijoin, consulte a Seção 8.2.2.1, “Optimizing Subqueries, Derived Tables, and View References with Semijoin Transformations”.

##### Batched Key Access Joins

O MySQL implementa um método de união de tabelas chamado algoritmo Batched Key Access (BKA) join. O BKA pode ser aplicado quando há um acesso por Index à tabela produzida pelo segundo operando do JOIN. Assim como o algoritmo BNL join, o algoritmo BKA join emprega um join buffer para acumular as colunas relevantes das linhas produzidas pelo primeiro operando da operação de JOIN. Em seguida, o algoritmo BKA constrói Keys para acessar a tabela a ser unida para todas as linhas no buffer e submete essas Keys em um *batch* ao Database Engine para *index lookups* (buscas de Index). As Keys são submetidas ao Engine por meio da interface Multi-Range Read (MRR) (consulte a Seção 8.2.1.10, “Multi-Range Read Optimization”). Após a submissão das Keys, as funções MRR do Engine executam *lookups* no Index de maneira ideal, buscando as linhas da tabela unida encontradas por essas Keys, e começam a alimentar o algoritmo BKA join com as linhas correspondentes. Cada linha correspondente é acoplada a uma referência a uma linha no join buffer.

Quando o BKA é usado, o valor de `join_buffer_size` define o tamanho do *batch* de Keys em cada solicitação ao Storage Engine. Quanto maior o buffer, mais acesso sequencial é feito à tabela da direita de uma operação de JOIN, o que pode melhorar significativamente o desempenho.

Para que o BKA seja usado, a flag `batched_key_access` da variável de sistema `optimizer_switch` deve ser definida como `on`. O BKA usa MRR, portanto, a flag `mrr` também deve estar `on`. Atualmente, a estimativa de custo para MRR é muito pessimista. Portanto, também é necessário que `mrr_cost_based` esteja `off` para que o BKA seja usado. A seguinte configuração habilita o BKA:

```sql
mysql> SET optimizer_switch='mrr=on,mrr_cost_based=off,batched_key_access=on';
```

Existem dois cenários pelos quais as funções MRR são executadas:

* O primeiro cenário é usado para Storage Engines convencionais baseados em disco, como `InnoDB` e `MyISAM`. Para esses Engines, geralmente as Keys para todas as linhas do join buffer são submetidas à interface MRR de uma vez. As funções MRR específicas do Engine realizam *index lookups* para as Keys submetidas, obtêm IDs de linha (ou Primary Keys) a partir delas e, em seguida, buscam as linhas para todos esses IDs de linha selecionados, um por um, por solicitação do algoritmo BKA. Cada linha é retornada com uma referência de associação que permite o acesso à linha correspondente no join buffer. As linhas são buscadas pelas funções MRR de maneira ideal: Elas são buscadas na ordem do ID da linha (Primary Key). Isso melhora o desempenho porque as leituras estão na ordem do disco, em vez de em ordem aleatória.

* O segundo cenário é usado para Storage Engines remotos, como `NDB`. Um pacote de Keys para uma porção de linhas do join buffer, juntamente com suas associações, é enviado por um MySQL Server (SQL node) para os Data Nodes do NDB Cluster. Em troca, o SQL node recebe um pacote (ou vários pacotes) de linhas correspondentes acopladas às associações correspondentes. O algoritmo BKA join pega essas linhas e constrói novas linhas unidas. Em seguida, um novo conjunto de Keys é enviado aos Data Nodes e as linhas dos pacotes retornados são usadas para construir novas linhas unidas. O processo continua até que as últimas Keys do join buffer sejam enviadas aos Data Nodes, e o SQL node tenha recebido e unido todas as linhas que correspondem a essas Keys. Isso melhora o desempenho porque menos pacotes contendo Keys enviados pelo SQL node aos Data Nodes significam menos *round trips* entre ele e os Data Nodes para realizar a operação de JOIN.

Com o primeiro cenário, uma parte do join buffer é reservada para armazenar IDs de linha (Primary Keys) selecionadas por *index lookups* e passadas como parâmetro para as funções MRR.

Não há um buffer especial para armazenar Keys construídas para linhas do join buffer. Em vez disso, uma função que constrói a Key para a próxima linha no buffer é passada como parâmetro para as funções MRR.

Na saída do `EXPLAIN`, o uso de BKA para uma tabela é sinalizado quando o valor `Extra` contém `Using join buffer (Batched Key Access)` e o valor `type` é `ref` ou `eq_ref`.

##### Optimizer Hints para Algoritmos Block Nested-Loop e Batched Key Access

Além de usar a variável de sistema `optimizer_switch` para controlar o uso dos algoritmos BNL e BKA pelo otimizador em nível de sessão, o MySQL suporta *optimizer hints* para influenciar o otimizador por instrução. Consulte a Seção 8.9.3, “Optimizer Hints”.

Para usar um hint BNL ou BKA para habilitar o *join buffering* para qualquer tabela interna de um outer join, o *join buffering* deve ser habilitado para todas as tabelas internas do outer join.