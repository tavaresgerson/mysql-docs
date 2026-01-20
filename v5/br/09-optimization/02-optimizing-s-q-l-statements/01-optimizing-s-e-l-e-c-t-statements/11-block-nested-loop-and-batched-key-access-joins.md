#### 8.2.1.11 Blocos de Loop Aninhado e Junções de Acesso a Chaves em Lote

No MySQL, está disponível um algoritmo de junção de acesso a chave em lote (BKA, na sigla em inglês) que utiliza tanto o acesso ao índice da tabela juncionada quanto um buffer de junção. O algoritmo BKA suporta operações de junção interna, externa e semiestruturada, incluindo junções externas aninhadas. Os benefícios do BKA incluem um desempenho de junção melhorado devido à varredura mais eficiente da tabela. Além disso, o algoritmo de junção Block Nested-Loop (BNL, na sigla em inglês) anteriormente usado apenas para junções internas foi estendido e pode ser empregado para operações de junção externa e semiestruturada, incluindo junções externas aninhadas.

As seções a seguir discutem a gestão do buffer de junção que está por trás da extensão do algoritmo original BNL, do algoritmo BNL estendido e do algoritmo BKA. Para informações sobre estratégias de junção parcial, consulte a Seção 8.2.2.1, “Otimizando subconsultas, tabelas derivadas e referências de visualizações com transformações de junção parcial”.

* Algoritmo de laço aninhado em bloco para junções externas e semijunções
* Algoritmo de Loop Aninhado em Blocos para Junções Externas e Semijunções
* Junções com Acesso a Chaves em Lote
* Dicas de Otimização para Algoritmos de Loop Aninhado em Blocos e Acesso a Chaves em Lote

##### Gerenciamento de buffer integrado para algoritmos de acesso a chaves em lote e loops aninhados em bloco.

O MySQL pode utilizar buffers de junção para executar não apenas junções internas sem acesso a índices na tabela interna, mas também junções externas e semijunções que surgem após o achatamento de subconsultas. Além disso, um buffer de junção pode ser usado de forma eficaz quando há acesso a índices na tabela interna.

O código de gerenciamento de buffer de junção utiliza o espaço do buffer de forma ligeiramente mais eficiente ao armazenar os valores das colunas de linha relevantes: nenhum byte adicional é alocado nos buffers para uma coluna de linha se o seu valor for `NULL`, e o número mínimo de bytes é alocado para qualquer valor do tipo `VARCHAR`.

O código suporta dois tipos de buffers: regulares e incrementais. Suponha que o buffer de junção `B1` seja usado para unir as tabelas `t1` e `t2` e que o resultado dessa operação seja unido à tabela `t3` usando o buffer de junção `B2`:

* Um buffer de junção regular contém colunas de cada operando de junção. Se `B2` for um buffer de junção regular, cada linha *`r`* inserida em `B2` será composta pelas colunas de uma linha *`r1`* de `B1` e pelas colunas relevantes de uma linha correspondente *`r2`* da tabela `t3`.

* Um buffer de junção incremental contém apenas colunas das linhas da tabela produzidas pelo segundo operando de junção. Ou seja, ele é incremental em relação a uma linha do primeiro buffer de operando. Se `B2` for um buffer de junção incremental, ele conterá as colunas relevantes da linha *`r2`* juntamente com um link para a linha *`r1`* de `B1`.

Os buffers de junção incrementais são sempre incrementais em relação a um buffer de junção de uma operação de junção anterior; portanto, o buffer da primeira operação de junção é sempre um buffer regular. No exemplo dado, o buffer `B1` usado para unir as tabelas `t1` e `t2` deve ser um buffer regular.

* Cada linha do buffer incremental usado para uma operação de junção contém apenas as colunas relevantes de uma linha da tabela a ser unida. Essas colunas são complementadas com uma referência às colunas relevantes da linha correspondente da tabela produzida pelo primeiro operando de junção. Várias linhas no buffer incremental podem se referir à mesma linha *`r`*, cujas colunas estão armazenadas nos buffers de junção anteriores, desde que todas essas linhas correspondam à linha *`r`*.

Os buffers incrementais permitem a cópia menos frequente de colunas dos buffers usados ​​para operações de junção anteriores. Isso proporciona uma economia de espaço no buffer, pois, em geral, uma linha produzida pelo primeiro operando de junção pode ser correspondida por várias linhas produzidas pelo segundo operando de junção. Não é necessário fazer várias cópias de uma linha do primeiro operando. Os buffers incrementais também proporcionam uma economia de tempo de processamento devido à redução no tempo de cópia.

Os parâmetros `block_nested_loop` e `batched_key_access` da variável de sistema `optimizer_switch` controlam como o otimizador usa os algoritmos de junção Block Nested-Loop e Batched Key Access. Por padrão, `block_nested_loop` está definido como `on` e `batched_key_access` como `off`. Consulte a Seção 8.9.2, “Otimizações Alternáveis”. Dicas do otimizador também podem ser aplicadas; consulte Dicas do Otimizador para Algoritmos Block Nested-Loop e Batched Key Access.

Para obter informações sobre estratégias de semijunção, consulte a Seção 8.2.2.1, “Otimizando Subconsultas, Tabelas Derivadas e Referências de Visão com Transformações de Semijunção”.

##### Algoritmo de Loop Aninhado em Blocos para Junções Externas e Semijunções

A implementação original do algoritmo BNL do MySQL foi estendida para suportar operações de junção externa e semijunção.

Quando essas operações são executadas com um buffer de junção, cada linha inserida no buffer recebe um indicador de correspondência.

Se uma operação de junção externa for executada usando um buffer de junção, cada linha da tabela produzida pelo segundo operando é verificada quanto a uma correspondência com cada linha no buffer de junção. Quando uma correspondência é encontrada, uma nova linha estendida é formada (a linha original mais as colunas do segundo operando) e enviada para extensões adicionais pelas operações de junção restantes. Além disso, o indicador de correspondência da linha correspondente no buffer é habilitado. Após todas as linhas da tabela a ser unida terem sido examinadas, o buffer de junção é verificado. Cada linha do buffer que não possui o indicador de correspondência habilitado é estendida por complementos `NULL` (valores `NULL` para cada coluna no segundo operando) e enviada para extensões adicionais pelas operações de junção restantes.

O parâmetro `block_nested_loop` da variável de sistema `optimizer_switch` controla como o otimizador usa o algoritmo Block Nested-Loop. Por padrão, `block_nested_loop` está definido como `on`. Consulte a Seção 8.9.2, “Otimizações Alternáveis”. Dicas do otimizador também podem ser aplicadas; consulte Dicas do Otimizador para Block Nested-Loop e Algoritmos de Acesso a Chaves em Lote.

Na saída do comando `EXPLAIN`, o uso de BNL para uma tabela é indicado quando o valor de `Extra` contém `Using join buffer (Block Nested Loop)` e o valor de `type` é `ALL`, `index` ou `range`.

Alguns casos envolvendo a combinação de uma ou mais subconsultas com uma ou mais junções à esquerda (left joins), particularmente aquelas que retornam muitas linhas, podem usar BNL, mesmo que não seja o ideal nessas instâncias. Este é um problema conhecido que foi corrigido no MySQL 8.0. Se a atualização do MySQL não for viável para você no momento, talvez seja interessante desativar o BNL provisoriamente, definindo `optimizer_switch='block_nested_loop=off'` ou utilizando a dica de otimização `NO_BNL` para permitir que o otimizador escolha um plano melhor, usando uma ou mais dicas de índice (consulte a Seção 8.9.4, “Dicas de Índice”), ou alguma combinação delas, para melhorar o desempenho dessas consultas.

Para obter informações sobre estratégias de semijunção, consulte a Seção 8.2.2.1, “Otimizando Subconsultas, Tabelas Derivadas e Referências de Visão com Transformações de Semijunção”.

##### Junções com Acesso por Chave em Lote

O MySQL implementa um método de junção de tabelas chamado algoritmo de junção com Acesso por Chave em Lote (BKA). O BKA pode ser aplicado quando há um acesso ao índice da tabela produzido pelo segundo operando da junção. Assim como o algoritmo de junção BNL, o algoritmo de junção BKA utiliza um buffer de junção para acumular as colunas relevantes das linhas produzidas pelo primeiro operando da operação de junção. Em seguida, o algoritmo BKA constrói chaves para acessar a tabela a ser unida para todas as linhas no buffer e envia essas chaves em lote para o mecanismo de banco de dados para pesquisas de índice. As chaves são enviadas ao mecanismo por meio da interface de Leitura de Múltiplos Intervalos (MRR) (consulte a Seção 8.2.1.10, “Otimização de Leitura de Múltiplos Intervalos”). Após o envio das chaves, as funções do mecanismo MRR realizam pesquisas no índice de maneira otimizada, buscando as linhas da tabela unida encontradas por essas chaves e começam a alimentar o algoritmo de junção BKA com as linhas correspondentes. Cada linha correspondente é associada a uma referência a uma linha no buffer de junção.

Quando o BKA é utilizado, o valor de `join_buffer_size` define o tamanho do lote de chaves em cada solicitação ao mecanismo de armazenamento. Quanto maior o buffer, mais acessos sequenciais são feitos à tabela à direita de uma operação de junção, o que pode melhorar significativamente o desempenho.

Para que o BKA seja utilizado, o sinalizador `batched_key_access` da variável de sistema `optimizer_switch` deve ser definido como `on`. O BKA utiliza o MRR, portanto, o sinalizador `mrr` também deve ser `on`. Atualmente, a estimativa de custo para o MRR é muito pessimista. Portanto, também é necessário que `mrr_cost_based` seja `off` para que o BKA seja utilizado. A seguinte configuração habilita o BKA:

```sql
mysql> SET optimizer_switch='mrr=on,mrr_cost_based=off,batched_key_access=on';
```

Existem dois cenários pelos quais as funções MRR são executadas:

* O primeiro cenário é usado para mecanismos de armazenamento convencionais baseados em disco, como `InnoDB` e `MyISAM`. Para esses mecanismos, geralmente as chaves de todas as linhas do buffer de junção são enviadas à interface MRR de uma só vez. As funções MRR específicas do mecanismo realizam buscas de índice para as chaves enviadas, obtêm os IDs das linhas (ou chaves primárias) a partir delas e, em seguida, buscam as linhas para todos esses IDs de linha selecionados, uma a uma, por solicitação do algoritmo BKA. Cada linha é retornada com uma referência de associação que permite o acesso à linha correspondente no buffer de junção. As linhas são buscadas pelas funções MRR de maneira otimizada: elas são buscadas na ordem do ID da linha (chave primária). Isso melhora o desempenho porque as leituras são feitas na ordem do disco, em vez de em ordem aleatória.

* O segundo cenário é usado para mecanismos de armazenamento remoto, como o `NDB`. Um pacote de chaves para uma parte das linhas do buffer de junção, juntamente com suas associações, é enviado por um servidor MySQL (nó SQL) para os nós de dados do cluster NDB. Em troca, o nó SQL recebe um pacote (ou vários pacotes) de linhas correspondentes, juntamente com as associações correspondentes. O algoritmo de junção BKA utiliza essas linhas para construir novas linhas unidas. Em seguida, um novo conjunto de chaves é enviado aos nós de dados, e as linhas dos pacotes retornados são usadas para construir novas linhas unidas. O processo continua até que as últimas chaves do buffer de junção sejam enviadas aos nós de dados, e o nó SQL tenha recebido e unido todas as linhas correspondentes a essas chaves. Isso melhora o desempenho, pois um menor número de pacotes contendo chaves enviados pelo nó SQL aos nós de dados significa menos viagens de ida e volta entre ele e os nós de dados para realizar a operação de junção.

No primeiro cenário, uma parte do buffer de junção é reservada para armazenar IDs de linha (chaves primárias) selecionados por meio de pesquisas de índice e passados ​​como parâmetro para as funções MRR.

Não há um buffer específico para armazenar as chaves construídas para as linhas do buffer de junção. Em vez disso, uma função que constrói a chave para a próxima linha no buffer é passada como parâmetro para as funções MRR.

Na saída do comando `EXPLAIN`, o uso de BKA para uma tabela é indicado quando o valor de `Extra` contém `Using join buffer (Batched Key Access)` e o valor de `type` é `ref` ou `eq_ref`.

##### Dicas do Otimizador para Algoritmos de Block Nested-Loop e Batched Key Access

Além de usar a variável de sistema `optimizer_switch` para controlar o uso dos algoritmos BNL e BKA pelo otimizador em toda a sessão, o MySQL oferece suporte a dicas do otimizador para influenciar o otimizador em cada instrução individualmente. Consulte a Seção 8.9.3, “Dicas do Otimizador”.

Para usar uma dica BNL ou BKA para habilitar o buffer de junção para qualquer tabela interna de uma junção externa, o buffer de junção deve estar habilitado para todas as tabelas internas da junção externa.