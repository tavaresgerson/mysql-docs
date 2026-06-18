#### 14.6.2.3 Construções de Index Ordenadas

O `InnoDB` executa um *bulk load* (carregamento em massa) em vez de inserir um registro de Index por vez ao criar ou reconstruir Indexes. Este método de criação de Index também é conhecido como uma *sorted index build* (construção de Index ordenada). As *sorted index builds* não são suportadas para Indexes espaciais.

Existem três fases para uma construção de Index. Na primeira fase, o *clustered index* é escaneado, e as entradas do Index são geradas e adicionadas ao *sort buffer*. Quando o *sort buffer* fica cheio, as entradas são ordenadas e gravadas em um arquivo intermediário temporário. Este processo também é conhecido como uma “*run*”. Na segunda fase, com uma ou mais *runs* escritas no arquivo intermediário temporário, um *merge sort* é realizado em todas as entradas no arquivo. Na terceira e última fase, as entradas ordenadas são inseridas na B-tree.

Antes da introdução das *sorted index builds*, as entradas de Index eram inseridas na B-tree um registro por vez usando APIs de inserção. Este método envolvia a abertura de um *B-tree cursor* para encontrar a posição de inserção e, em seguida, a inserção de entradas em uma *B-tree page* usando uma inserção otimista. Se uma inserção falhasse devido à página estar cheia, uma inserção pessimista seria realizada, o que envolve abrir um *B-tree cursor* e dividir e mesclar *B-tree nodes* conforme necessário para encontrar espaço para a entrada. As desvantagens deste método "top-down" (de cima para baixo) de construção de Index são o custo de procurar uma posição de inserção e a constante divisão e mesclagem de *B-tree nodes*.

As *sorted index builds* usam uma abordagem “*bottom-up*” (de baixo para cima) para construir um Index. Com esta abordagem, uma referência à *leaf page* mais à direita é mantida em todos os níveis da B-tree. A *leaf page* mais à direita na profundidade necessária da B-tree é alocada, e as entradas são inseridas de acordo com sua ordem ordenada. Assim que uma *leaf page* estiver cheia, um *node pointer* é anexado à *parent page* e uma *sibling leaf page* é alocada para a próxima inserção. Este processo continua até que todas as entradas sejam inseridas, o que pode resultar em inserções até o nível *root*. Quando uma *sibling page* é alocada, a referência à *leaf page* anteriormente fixada é liberada, e a *leaf page* recém-alocada se torna a *leaf page* mais à direita e o novo local de inserção padrão.

##### Reservando Espaço em B-tree Page para Crescimento Futuro do Index

Para reservar espaço para o crescimento futuro do Index, você pode usar a variável `innodb_fill_factor` para reservar uma porcentagem do espaço das *B-tree pages*. Por exemplo, definir `innodb_fill_factor` como 80 reserva 20 por cento do espaço nas *B-tree pages* durante uma *sorted index build*. Essa configuração se aplica tanto a *B-tree leaf pages* quanto a páginas não-folha. Ela não se aplica a páginas externas usadas para entradas `TEXT` ou `BLOB`. A quantidade de espaço reservado pode não ser exatamente a configurada, pois o valor de `innodb_fill_factor` é interpretado como uma dica (*hint*) em vez de um limite rígido (*hard limit*).

##### Sorted Index Builds e Suporte a Full-Text Index

As *sorted index builds* são suportadas para *fulltext indexes*. Anteriormente, o SQL era usado para inserir entradas em um *fulltext index*.

##### Sorted Index Builds e Tabelas Comprimidas

Para tabelas comprimidas, o método anterior de criação de Index anexava entradas a páginas comprimidas e não comprimidas. Quando o *modification log* (representando o espaço livre na página comprimida) ficava cheio, a página comprimida era recomprimida. Se a compressão falhasse devido à falta de espaço, a página era dividida (*split*). Com as *sorted index builds*, as entradas são anexadas apenas a páginas não comprimidas. Quando uma página não comprimida fica cheia, ela é comprimida. O *adaptive padding* é usado para garantir que a compressão seja bem-sucedida na maioria dos casos, mas se a compressão falhar, a página é dividida e a compressão é tentada novamente. Este processo continua até que a compressão seja bem-sucedida. Para mais informações sobre a compressão de B-tree pages, consulte a Seção 14.9.1.5, “Como a Compressão Funciona para Tabelas InnoDB”.

##### Sorted Index Builds e Redo Logging

O *Redo logging* é desativado durante uma *sorted index build*. Em vez disso, há um *checkpoint* para garantir que a construção do Index possa suportar uma saída ou falha inesperada. O *checkpoint* força uma gravação de todas as *dirty pages* (páginas sujas) no disco. Durante uma *sorted index build*, o *page cleaner thread* é sinalizado periodicamente para descarregar (*flush*) as *dirty pages* e garantir que a operação de *checkpoint* possa ser processada rapidamente. Normalmente, o *page cleaner thread* descarrega as *dirty pages* quando o número de páginas limpas cai abaixo de um limite definido. Para *sorted index builds*, as *dirty pages* são descarregadas prontamente para reduzir o *overhead* do *checkpoint* e para paralelizar a atividade de I/O e CPU.

##### Sorted Index Builds e Estatísticas do Optimizer

As *sorted index builds* podem resultar em estatísticas do *optimizer* que diferem daquelas geradas pelo método anterior de criação de Index. A diferença nas estatísticas, que não deve afetar a performance da *workload* (carga de trabalho), é devido ao algoritmo diferente usado para popular o Index.