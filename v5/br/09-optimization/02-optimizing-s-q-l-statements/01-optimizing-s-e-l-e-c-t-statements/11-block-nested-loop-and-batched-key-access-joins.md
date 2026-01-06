#### 8.2.1.11 Conexões de junção em laço aninhado e acesso a chave em lote

No MySQL, está disponível um algoritmo de junção de acesso a chave em lote (BKA, na sigla em inglês) que utiliza tanto o acesso ao índice da tabela juncionada quanto um buffer de junção. O algoritmo BKA suporta operações de junção interna, externa e semiestruturada, incluindo junções externas aninhadas. Os benefícios do BKA incluem um desempenho de junção melhorado devido à varredura mais eficiente da tabela. Além disso, o algoritmo de junção Block Nested-Loop (BNL, na sigla em inglês) anteriormente usado apenas para junções internas foi estendido e pode ser empregado para operações de junção externa e semiestruturada, incluindo junções externas aninhadas.

As seções a seguir discutem a gestão do buffer de junção que está por trás da extensão do algoritmo original BNL, do algoritmo BNL estendido e do algoritmo BKA. Para informações sobre estratégias de junção parcial, consulte a Seção 8.2.2.1, “Otimizando subconsultas, tabelas derivadas e referências de visualizações com transformações de junção parcial”.

- Junte-se à Gerenciamento de Buffer para Algoritmos de Acesso a Chave em Lote e Lote de Nó Inzado

- Algoritmo de Lote de Laço Fechado para Conjunções Externas e Semijoinings

- Juntas de acesso de chave em lote

- Dicas de otimização para algoritmos de acesso a chave em lote e de laço aninhado

##### Junte-se à Gerenciamento de Buffer para Algoritmos de Acesso a Chave em Lote e Lote de Nó Inzado

O MySQL pode utilizar buffers de junção para executar não apenas junções internas sem acesso ao índice da tabela interna, mas também junções externas e junções semijoias que aparecem após a desdobramento de subconsultas. Além disso, um buffer de junção pode ser usado efetivamente quando há um acesso ao índice da tabela interna.

O código de gerenciamento do buffer de junção utiliza o espaço do buffer de junção de forma um pouco mais eficiente ao armazenar os valores das colunas da linha interessante: não são alocados bytes adicionais nos buffers para uma coluna da linha se seu valor for `NULL`, e o número mínimo de bytes é alocado para qualquer valor do tipo `VARCHAR`.

O código suporta dois tipos de buffers, regulares e incrementais. Suponha que o buffer de junção `B1` seja usado para unir as tabelas `t1` e `t2`, e o resultado dessa operação seja unido com a tabela `t3` usando o buffer de junção `B2`:

- Um buffer de junção regular contém colunas de cada operando de junção. Se `B2` for um buffer de junção regular, cada linha *`r`* inserida em `B2` é composta pelas colunas de uma linha *`r1`* de `B1` e pelas colunas interessantes de uma linha correspondente *`r2`* da tabela `t3`.

- Um buffer de junção incremental contém apenas as colunas das linhas da tabela produzida pelo segundo operando de junção. Ou seja, é incremental em relação a uma linha do buffer do primeiro operando. Se `B2` for um buffer de junção incremental, ele contém as colunas interessantes da linha *`r2`* juntamente com um link para a linha *`r1`* de `B1`.

Os buffers de junção incrementais são sempre incrementais em relação a um buffer de junção de uma operação de junção anterior, portanto, o buffer da primeira operação de junção é sempre um buffer regular. No exemplo dado, o buffer `B1` usado para unir as tabelas `t1` e `t2` deve ser um buffer regular.

Cada linha do buffer incremental usado para uma operação de junção contém apenas as colunas interessantes de uma linha da tabela a ser juncionada. Essas colunas são complementadas com uma referência às colunas interessantes da linha correspondente da tabela produzida pelo primeiro operando de junção. Várias linhas no buffer incremental podem se referir à mesma linha *`r`* cujas colunas são armazenadas nos buffers de junção anteriores, desde que todas essas linhas correspondam à linha *`r`*.

Os buffers incrementais permitem uma cópia menos frequente das colunas dos buffers usados para operações de junção anteriores. Isso proporciona uma economia de espaço no buffer, pois, no caso geral, uma linha produzida pelo primeiro operando da junção pode ser correspondida por várias linhas produzidas pelo segundo operando da junção. Não é necessário fazer várias cópias de uma linha do primeiro operando. Os buffers incrementais também proporcionam uma economia de tempo de processamento devido à redução do tempo de cópia.

As flags `block_nested_loop` e `batched_key_access` da variável de sistema `optimizer_switch` controlam como o otimizador usa os algoritmos de junção Block Nested-Loop e Batched Key Access. Por padrão, `block_nested_loop` está ativado e `batched_key_access` está desativado. Veja a Seção 8.9.2, “Otimizações Desconectables”. Dicas de otimizador também podem ser aplicadas; veja Dicas de Otimizador para Algoritmos de Block Nested-Loop e Batched Key Access.

Para obter informações sobre estratégias de junção parcial, consulte a Seção 8.2.2.1, “Otimização de subconsultas, tabelas derivadas e referências de visualizações com transformações de junção parcial”

##### Algoritmo de Lote de Laço Fechado para Conjunções Externas e Semijoinings

A implementação original do algoritmo MySQL BNL foi estendida para suportar operações de junção externa e semijoin.

Quando essas operações são executadas com um buffer de junção, cada linha colocada no buffer é fornecida com uma bandeira de correspondência.

Se uma operação de junção externa for executada usando um buffer de junção, cada linha da tabela produzida pelo segundo operando é verificada para uma correspondência com cada linha no buffer de junção. Quando uma correspondência é encontrada, uma nova linha estendida é formada (a linha original mais as colunas do segundo operando) e enviada para extensões adicionais pelas operações de junção restantes. Além disso, a bandeira de correspondência da linha correspondente no buffer é ativada. Após todas as linhas da tabela a ser juncionada terem sido examinadas, o buffer de junção é percorrido. Cada linha do buffer que não tem sua bandeira de correspondência ativada é estendida com complementos `NULL` (`valores `NULL\` para cada coluna no segundo operando) e enviada para extensões adicionais pelas operações de junção restantes.

A bandeira `block_nested_loop` da variável de sistema `optimizer_switch` controla como o otimizador usa o algoritmo de Loop Aninhado Bloco. Por padrão, `block_nested_loop` é `on`. Veja a Seção 8.9.2, “Otimizações Desconectables”. Dicas de otimizador também podem ser aplicadas; veja Dicas de Otimizador para Loop Aninhado Bloco e Algoritmos de Acesso a Chave em Bateladas.

Na saída `EXPLAIN`, o uso de BNL para uma tabela é indicado quando o valor `Extra` contém `Usando buffer de junção (Loop Aninhado em Bloco)` e o valor `type` é `ALL`, `index` ou `range`.

Alguns casos que envolvem a combinação de uma ou mais subconsultas com uma ou mais junções esquerdas, especialmente aqueles que retornam muitas linhas, podem usar BNL, mesmo que não seja ideal nessas situações. Esse é um problema conhecido que é corrigido no MySQL 8.0. Se a atualização do MySQL não for viável imediatamente para você, você pode desabilitar o BNL enquanto isso, definindo `optimizer_switch='block_nested_loop=off'` ou empregando a dica de otimizador `NO_BNL` para permitir que o otimizador escolha um plano melhor, usando uma ou mais dicas de índice (veja a Seção 8.9.4, “Dicas de Índice”) ou alguma combinação dessas, para melhorar o desempenho dessas consultas.

Para obter informações sobre estratégias de junção parcial, consulte a Seção 8.2.2.1, “Otimização de subconsultas, tabelas derivadas e referências de visualizações com transformações de junção parcial”

##### Juntas de acesso de chave em lote

O MySQL implementa um método de junção de tabelas chamado algoritmo de junção de acesso por chave em lote (BKA, na sigla em inglês). O BKA pode ser aplicado quando há um acesso ao índice da tabela produzido pelo segundo operando de junção. Assim como o algoritmo de junção BNL, o algoritmo de junção BKA utiliza um buffer de junção para acumular as colunas interessantes das linhas produzidas pelo primeiro operando da operação de junção. Em seguida, o algoritmo BKA constrói chaves para acessar a tabela a ser juncionada para todas as linhas no buffer e envia essas chaves em um lote para o motor do banco de dados para buscas no índice. As chaves são enviadas ao motor por meio da interface de leitura de várias faixas (MRR, na sigla em inglês) (consulte a Seção 8.2.1.10, “Otimização da Leitura de Várias Faixas”). Após a submissão das chaves, as funções do motor MRR realizam buscas no índice de maneira otimizada, obtendo as linhas da tabela juncionada encontradas por essas chaves e começa a alimentar o algoritmo de junção BKA com linhas correspondentes. Cada linha correspondente é acoplada a uma referência a uma linha no buffer de junção.

Quando o BKA é usado, o valor de `join_buffer_size` define o tamanho do lote de chaves em cada solicitação ao motor de armazenamento. Quanto maior o buffer, maior o acesso sequencial à tabela da direita de uma operação de junção, o que pode melhorar significativamente o desempenho.

Para que o BKA seja usado, a bandeira `batched_key_access` da variável de sistema `optimizer_switch` deve ser definida como `on`. O BKA usa o MRR, portanto, a bandeira `mrr` também deve estar definida como `on`. Atualmente, a estimativa de custo para o MRR é muito pessimista. Portanto, também é necessário que `mrr_cost_based` esteja definido como `off` para que o BKA seja usado. A configuração a seguir habilita o BKA:

```sql
mysql> SET optimizer_switch='mrr=on,mrr_cost_based=off,batched_key_access=on';
```

Existem dois cenários pelos quais as funções MRR são executadas:

- O primeiro cenário é usado para motores de armazenamento baseados em disco convencionais, como `InnoDB` e `MyISAM`. Para esses motores, geralmente as chaves de todas as linhas do buffer de junção são enviadas para a interface MRR de uma vez. Funções MRR específicas do motor realizam buscas de índice para as chaves enviadas, obtêm IDs de linha (ou chaves primárias) a partir delas e, em seguida, buscam linhas para todos esses IDs de linha selecionados um por um, mediante solicitação do algoritmo BKA. Cada linha é retornada com uma referência de associação que permite o acesso à linha correspondente no buffer de junção. As linhas são obtidas pelas funções MRR de maneira otimizada: são obtidas na ordem do ID de linha (chave primária). Isso melhora o desempenho porque as leituras são em ordem de disco, em vez de ordem aleatória.

- O segundo cenário é usado para motores de armazenamento remoto, como o `NDB`. Um pacote de chaves para uma parte das linhas do buffer de junção, juntamente com suas associações, é enviado por um servidor MySQL (nó SQL) para os nós de dados do NDB Cluster. Em troca, o nó SQL recebe um pacote (ou vários pacotes) de linhas correspondentes, juntamente com as associações correspondentes. O algoritmo de junção BKA recebe essas linhas e constrói novas linhas juncionadas. Em seguida, um novo conjunto de chaves é enviado para os nós de dados e as linhas dos pacotes retornados são usadas para construir novas linhas juncionadas. O processo continua até que as últimas chaves do buffer de junção sejam enviadas para os nós de dados, e o nó SQL tenha recebido e unido todas as linhas que correspondem a essas chaves. Isso melhora o desempenho, pois menos pacotes que carregam chaves enviados pelo nó SQL para os nós de dados significam menos viagens entre ele e os nós de dados para realizar a operação de junção.

No primeiro cenário, uma parte do buffer de junção é reservada para armazenar os IDs de linha (chaves primárias) selecionados por buscas de índice e passados como parâmetro para as funções MRR.

Não há um buffer especial para armazenar chaves construídas para linhas do buffer de junção. Em vez disso, uma função que constrói a chave para a próxima linha no buffer é passada como um parâmetro para as funções MRR.

Na saída `EXPLAIN`, o uso de BKA para uma tabela é indicado quando o valor `Extra` contém `Usando buffer de junção (Acesso por chave em lote)` e o valor `type` é `ref` ou `eq_ref`.

##### Dicas de otimização para algoritmos de acesso a chave em lote e de laço aninhado

Além de usar a variável de sistema `optimizer_switch` para controlar o uso do otimizador dos algoritmos BNL e BKA em toda a sessão, o MySQL suporta dicas de otimizador para influenciar o otimizador em uma base por declaração. Veja a Seção 8.9.3, “Dicas de Otimizador”.

Para usar uma dica BNL ou BKA para habilitar o bufferamento de junção para qualquer tabela interna de uma junção externa, o bufferamento de junção deve ser habilitado para todas as tabelas internas da junção externa.
