#### 10.2.1.12 Conexões de Acesso de Chave Emnestricadas e em Massa

No MySQL, está disponível um algoritmo de Conexão de Acesso de Chave em Massa (BKA) que utiliza tanto o acesso ao índice da tabela conectada quanto um buffer de conexão. O algoritmo BKA suporta operações de junção interna, externa e semijunção, incluindo junções externas emnestricadas. Os benefícios do BKA incluem um desempenho de conexão melhorado devido à varredura mais eficiente da tabela. Além disso, o algoritmo de Conexão em Nestes Loops (BNL) anteriormente usado apenas para junções internas é estendido e pode ser empregado para operações de junção externa e semijunção, incluindo junções externas emnestricadas.

As seções a seguir discutem a gestão do buffer de conexão que está por trás da extensão do algoritmo original BNL, do algoritmo BNL estendido e do algoritmo BKA. Para informações sobre estratégias de semijunção, consulte  Otimizando Predicados de Subconsultas IN e EXISTS com Transformações de Semijunção

* Gestão do Buffer de Conexão para Algoritmos de Conexão em Nestes Loops e de Acesso de Chave em Massa
*  Algoritmo de Conexão em Nestes Loops para Junções Externas e Semijunções
*  Conexões de Acesso de Chave em Massa
*  Dicas do Otimizador para Algoritmos de Conexão em Nestes Loops e de Acesso de Chave em Massa

##### Gestão do Buffer de Conexão para Algoritmos de Conexão em Nestes Loops e de Acesso de Chave em Massa

O MySQL pode empregar buffers de conexão para executar não apenas junções internas sem acesso ao índice da tabela interna, mas também junções externas e semijunções que aparecem após a achatamento de subconsultas. Além disso, um buffer de conexão pode ser efetivamente usado quando há um acesso ao índice da tabela interna.

O código de gestão do buffer de conexão utiliza o espaço do buffer de conexão de forma ligeiramente mais eficiente ao armazenar os valores das colunas da linha interessante: Não são alocados bytes adicionais nos buffers para uma coluna da linha se seu valor for `NULL`, e o número mínimo de bytes é alocado para qualquer valor do tipo `VARCHAR`.

O código suporta dois tipos de buffers: regulares e incrementais. Suponha que o buffer de junção `B1` seja empregado para unir as tabelas `t1` e `t2`, e o resultado dessa operação seja unido com a tabela `t3` usando o buffer de junção `B2`:

* Um buffer de junção regular contém colunas de cada operando de junção. Se `B2` for um buffer de junção regular, cada linha *`r`* inserida em `B2` é composta pelas colunas de uma linha *`r1`* de `B1` e pelas colunas interessantes de uma linha correspondente *`r2`* da tabela `t3`.
* Um buffer de junção incremental contém apenas colunas de linhas da tabela produzida pelo segundo operando de junção. Ou seja, é incremental em relação a uma linha de um buffer de operando anterior. Se `B2` for um buffer de junção incremental, ele contém as colunas interessantes da linha *`r2`* juntamente com um link para a linha *`r1`* de `B1`.

Os buffers de junção incrementais são sempre incrementais em relação a um buffer de junção de uma operação de junção anterior, então o buffer da primeira operação de junção é sempre um buffer regular. No exemplo dado, o buffer `B1` usado para unir as tabelas `t1` e `t2` deve ser um buffer regular.

Cada linha do buffer incremental usado para uma operação de junção contém apenas as colunas interessantes de uma linha da tabela a ser unida. Essas colunas são aumentadas com uma referência às colunas interessantes da linha correspondente da tabela produzida pelo primeiro operando de junção. Várias linhas no buffer incremental podem se referir à mesma linha *`r`* cujas colunas são armazenadas nos buffers de operando anteriores, desde que todas essas linhas correspondam à linha *`r`*.

Os buffers incrementais permitem uma cópia menos frequente de colunas dos buffers usados para operações de junção anteriores. Isso proporciona uma economia de espaço no buffer, pois, no caso geral, uma linha produzida pelo primeiro operando de junção pode ser correspondida por várias linhas produzidas pelo segundo operando de junção. Não é necessário fazer várias cópias de uma linha do primeiro operando. Os buffers incrementais também proporcionam uma economia de tempo de processamento devido à redução do tempo de cópia.

A bandeira `block_nested_loop` da variável de sistema `optimizer_switch` controla as junções hash.

A bandeira `batched_key_access` controla como o otimizador usa os algoritmos de junção de chave em lote.

Por padrão, `block_nested_loop` está ativado e `batched_key_access` está desativado. Veja a Seção 10.9.2, “Otimizações Desconectables”. Também podem ser aplicadas dicas de otimizador; veja Dicas de Otimizador para Algoritmos de Junção em Lote e de Acesso a Chave em Lote.

Para informações sobre estratégias de junção semijoin, veja Otimizando Predicados de Subconsultas IN e EXISTS com Transformações Semijoin

##### Algoritmo de Junção em Lote para Junções Externas e Semijoins

A implementação original do algoritmo MySQL BNL foi estendida para suportar operações de junção externa e semijoin (e foi posteriormente substituída pelo algoritmo de junção hash; veja a Seção 10.2.1.4, “Otimização de Junção Hash”).

Quando essas operações são executadas com um buffer de junção, cada linha inserida no buffer é fornecida com uma bandeira de correspondência.

Se uma operação de junção externa for executada usando um buffer de junção, cada linha da tabela produzida pelo segundo operando é verificada para uma correspondência em relação a cada linha no buffer de junção. Quando uma correspondência é encontrada, uma nova linha estendida é formada (a linha original mais colunas do segundo operando) e enviada para extensões adicionais pelas operações de junção restantes. Além disso, a bandeira de correspondência da linha correspondente no buffer é habilitada. Após todas as linhas da tabela a ser unida terem sido examinadas, o buffer de junção é percorrido. Cada linha do buffer que não tem sua bandeira de correspondência habilitada é estendida com complementos `NULL` (`valores `NULL` para cada coluna no segundo operando) e enviada para extensões adicionais pelas operações de junção restantes.

A bandeira `block_nested_loop` da variável de sistema `optimizer_switch` controla as junções hash.

Veja a Seção 10.9.2, “Otimizações Desconectables”, para mais informações. Também podem ser aplicadas dicas de otimizador; veja Dicas de Otimizador para Algoritmos de Junção em Lote e de Acesso a Chave em Lote.

Na saída `EXPLAIN`, o uso de BNL para uma tabela é indicado quando o valor `Extra` contém `Usando buffer de junção (Loop Fechado em Bloco)` e o valor `type` é `ALL`, `index` ou `range`.

Para informações sobre estratégias de junção semijoin, consulte Otimizando Predicados de Subconsultas IN e EXISTS com Transformações Semijoin

##### Junções de Acesso a Chave em Batelamento

O MySQL implementa um método de junção de tabelas chamado algoritmo de junção de Acesso a Chave em Batelamento (BKA). O BKA pode ser aplicado quando há um acesso a índice na tabela produzido pelo segundo operando de junção. Assim como o algoritmo de junção BNL, o algoritmo de junção BKA emprega um buffer de junção para acumular as colunas interessantes das linhas produzidas pelo primeiro operando da operação de junção. Em seguida, o algoritmo BKA constrói chaves para acessar a tabela a ser juncionada para todas as linhas no buffer e envia essas chaves em um lote para o motor de banco de dados para buscas em índice. As chaves são enviadas ao motor através da interface de Leitura em Variação Múltipla (MRR) (veja Seção 10.2.1.11, “Otimização de Leitura em Variação Múltipla”). Após a submissão das chaves, as funções do motor de MRR realizam buscas no índice de maneira otimizada, obtendo as linhas da tabela juncionada encontradas por essas chaves e começa a alimentar o algoritmo de junção BKA com linhas correspondentes. Cada linha correspondente é acoplada a uma referência a uma linha no buffer de junção.

Quando o BKA é usado, o valor de `join_buffer_size` define o tamanho do lote de chaves em cada solicitação ao motor de armazenamento. Quanto maior o buffer, mais acesso sequencial é feito à tabela da direita de uma operação de junção, o que pode melhorar significativamente o desempenho.

Para que o BKA seja usado, o sinalizador `batched_key_access` da variável de sistema `optimizer_switch` deve ser definido como `on`. O BKA usa MRR, então o sinalizador `mrr` também deve ser `on`. Atualmente, a estimativa de custo para MRR é muito pessimista. Portanto, também é necessário que `mrr_cost_based` esteja definido como `off` para que o BKA seja usado. O seguinte ajuste habilita o BKA:

```
mysql> SET optimizer_switch='mrr=on,mrr_cost_based=off,batched_key_access=on';
```

Existem dois cenários pelos quais as funções do MRR são executadas:

* O primeiro cenário é usado para motores de armazenamento baseados em disco convencionais, como `InnoDB` e `MyISAM`. Para esses motores, geralmente as chaves de todas as linhas do buffer de junção são enviadas para a interface do MRR de uma vez. As funções de MRR específicas do motor realizam buscas de índice para as chaves enviadas, obtêm IDs de linha (ou chaves primárias) a partir delas e, em seguida, buscam linhas para todos esses IDs de linha selecionados um por um por solicitação do algoritmo BKA. Cada linha é retornada com uma referência de associação que permite o acesso à linha correspondente no buffer de junção. As linhas são obtidas pelas funções do MRR de maneira otimizada: são obtidas na ordem do ID de linha (chave primária). Isso melhora o desempenho porque as leituras são em ordem de disco, em vez de ordem aleatória.
* O segundo cenário é usado para motores de armazenamento remoto, como `NDB`. Um pacote de chaves para uma porção de linhas do buffer de junção, juntamente com suas associações, é enviado por um servidor MySQL (nó SQL) para os nós de dados do MySQL Cluster. Em troca, o nó SQL recebe um pacote (ou vários pacotes) de linhas correspondentes acopladas com as associações correspondentes. O algoritmo de junção BKA toma essas linhas e constrói novas linhas juncionadas. Então, um novo conjunto de chaves é enviado para os nós de dados e as linhas dos pacotes retornados são usadas para construir novas linhas juncionadas. O processo continua até que as últimas chaves do buffer de junção sejam enviadas para os nós de dados, e o nó SQL tenha recebido e unido todas as linhas que correspondem a essas chaves. Isso melhora o desempenho porque menos pacotes com chaves enviados pelo nó SQL para os nós de dados significam menos viagens entre ele e os nós de dados para realizar a operação de junção.

Com o primeiro cenário, uma porção do buffer de junção é reservada para armazenar IDs de linha (chaves primárias) selecionados por buscas de índice e passados como parâmetro para as funções do MRR.

Não há um buffer especial para armazenar chaves construídas para linhas do buffer de junção. Em vez disso, uma função que constrói a chave para a próxima linha no buffer é passada como um parâmetro para as funções MRR.

Na saída `EXPLAIN`, o uso de BKA para uma tabela é indicado quando o valor `Extra` contém `Usando buffer de junção (Acesso de Chave em Batelamento)` e o valor `type` é `ref` ou `eq_ref`.

##### Dicas de Otimizador para Algoritmos de Acesso de Chave em Batelamento e Acesso de Chave em Batelamento de Nessação

Além de usar a variável de sistema `optimizer_switch` para controlar o uso do otimizador dos algoritmos BNL e BKA em toda a sessão, o MySQL suporta dicas de otimizador para influenciar o otimizador em uma base de declaração. Veja a Seção 10.9.3, “Dicas de Otimizador”.

Para usar uma dica de BNL ou BKA para habilitar o buffer de junção para qualquer tabela interna de uma junção externa, o buffer de junção deve estar habilitado para todas as tabelas internas da junção externa.