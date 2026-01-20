#### 14.6.2.3 Construção de índices ordenados

O `InnoDB` realiza uma carga em massa em vez de inserir um registro de índice de cada vez ao criar ou reconstruir índices. Esse método de criação de índices também é conhecido como construção de índice ordenado. Construções de índices ordenados não são suportadas para índices espaciais.

Há três fases para a construção de um índice. Na primeira fase, o índice agrupado é percorrido, e as entradas do índice são geradas e adicionadas ao buffer de ordenação. Quando o buffer de ordenação fica cheio, as entradas são ordenadas e escritas em um arquivo intermediário temporário. Esse processo também é conhecido como “rodada”. Na segunda fase, com uma ou mais rodadas escritas no arquivo intermediário temporário, uma ordenação por fusão é realizada em todas as entradas do arquivo. Na terceira e última fase, as entradas ordenadas são inseridas na árvore B.

Antes da introdução das construções de índices ordenados, as entradas de índice eram inseridas no B-tree um registro de cada vez usando APIs de inserção. Esse método envolvia abrir um cursor do B-tree para encontrar a posição de inserção e, em seguida, inserir entradas em uma página do B-tree usando uma inserção otimista. Se uma inserção falhasse devido a uma página estar cheia, uma inserção pessimista seria realizada, o que envolve abrir um cursor do B-tree e dividir e combinar nós do B-tree conforme necessário para encontrar espaço para a entrada. As desvantagens desse método “de cima para baixo” de construção de um índice são o custo de buscar uma posição de inserção e a constante divisão e fusão de nós do B-tree.

Os índices ordenados utilizam uma abordagem "de baixo para cima" para a construção de um índice. Com essa abordagem, uma referência à página mais à direita da árvore B é mantida em todos os níveis da árvore B. A página mais à direita da árvore B na profundidade necessária é alocada e as entradas são inseridas de acordo com sua ordem ordenada. Quando uma página de folha é cheia, um ponteiro de nó é anexado à página pai e uma página de folha de irmão é alocada para a próxima inserção. Esse processo continua até que todas as entradas sejam inseridas, o que pode resultar em inserções até o nível da raiz. Quando uma página de irmão é alocada, a referência à página de folha anteriormente fixada é liberada, e a nova página de folha alocada torna-se a página de folha mais à direita e nova localização de inserção padrão.

##### Reservar espaço de página de árvore B para o crescimento futuro do índice

Para reservar espaço para o crescimento futuro do índice, você pode usar a variável `innodb_fill_factor` para reservar uma porcentagem do espaço das páginas da árvore B. Por exemplo, definir `innodb_fill_factor` para 80 reserva 20% do espaço nas páginas da árvore B durante a construção de um índice ordenado. Esta configuração aplica-se tanto às páginas de folha da árvore B quanto às páginas não-folha. Não se aplica a páginas externas usadas para entradas `TEXT` ou `BLOB`. O espaço reservado pode não ser exatamente conforme configurado, pois o valor de `innodb_fill_factor` é interpretado como um indicativo em vez de um limite rígido.

##### Construção de índices ordenados e suporte a índice de texto completo

Os índices de construção ordenada são suportados para índices full-text. Anteriormente, o SQL era usado para inserir entradas em um índice full-text.

##### Construção de índices ordenados e tabelas compactadas

Para tabelas compactadas, o método anterior de criação de índice anexava entradas tanto às páginas compactadas quanto às não compactadas. Quando o log de modificação (que representa o espaço livre na página compactada) ficava cheio, a página compactada seria recompactada. Se a compactação falhasse devido à falta de espaço, a página seria dividida. Com construções de índice ordenadas, as entradas são anexadas apenas às páginas não compactadas. Quando uma página não compactada fica cheia, ela é compactada. O alinhamento adaptativo é usado para garantir que a compactação tenha sucesso na maioria dos casos, mas se a compactação falhar, a página é dividida e a compactação é tentada novamente. Esse processo continua até que a compactação seja bem-sucedida. Para mais informações sobre a compactação de páginas B-Tree, consulte a Seção 14.9.1.5, “Como a Compactação Funciona para Tabelas InnoDB”.

##### Construção de índices ordenados e registro de refação

O registro em cores é desativado durante a construção de um índice ordenado. Em vez disso, há um ponto de verificação para garantir que a construção do índice possa suportar uma saída ou falha inesperada. O ponto de verificação obriga a gravação de todas as páginas sujas no disco. Durante a construção de um índice ordenado, o thread de limpeza de páginas é sinalizado periodicamente para descartar páginas sujas, garantindo que a operação do ponto de verificação possa ser processada rapidamente. Normalmente, o thread de limpeza de páginas descarta páginas sujas quando o número de páginas limpas cai abaixo de um limiar definido. Para construções de índices ordenados, as páginas sujas são descartadas prontamente para reduzir o overhead do ponto de verificação e para paralelizar a atividade de E/S e CPU.

##### Construção de índices ordenados e estatísticas do otimizador

Os índices ordenados podem resultar em estatísticas do otimizador que diferem das geradas pelo método anterior de criação de índices. A diferença nas estatísticas, que não é esperada afetar o desempenho da carga de trabalho, é devida ao algoritmo diferente usado para preencher o índice.
