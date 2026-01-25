### 14.5.1 Buffer Pool

O Buffer Pool é uma área na memória principal onde o `InnoDB` armazena em cache (caches) dados de tabelas e Index à medida que são acessados. O Buffer Pool permite que dados frequentemente usados sejam acessados diretamente da memória, o que acelera o processamento. Em servidores dedicados, até 80% da memória física é frequentemente alocada para o Buffer Pool.

Para eficiência de operações de leitura de alto volume, o Buffer Pool é dividido em *pages* (páginas) que podem potencialmente conter múltiplas linhas (*rows*). Para eficiência do gerenciamento de cache, o Buffer Pool é implementado como uma lista encadeada (*linked list*) de *pages*; dados raramente usados são removidos do cache (*aged out*) usando uma variação do algoritmo *least recently used* (LRU).

Saber como tirar proveito do Buffer Pool para manter dados frequentemente acessados na memória é um aspecto importante da otimização (*tuning*) do MySQL.

#### Algoritmo LRU do Buffer Pool

O Buffer Pool é gerenciado como uma lista usando uma variação do algoritmo LRU. Quando é necessário espaço para adicionar uma nova *page* ao Buffer Pool, a *page* menos recentemente usada é despejada (*evicted*) e uma nova *page* é adicionada ao meio da lista. Esta estratégia de inserção no ponto médio trata a lista como duas sublistas:

* Na cabeça (*head*), uma sublista de *pages* novas (“young”) que foram acessadas recentemente.

* Na cauda (*tail*), uma sublista de *pages* antigas (“old”) que foram acessadas com menos frequência.

**Figura 14.2 Lista do Buffer Pool**

![O conteúdo é descrito no texto ao redor.](images/innodb-buffer-pool-list.png)

O algoritmo mantém as *pages* frequentemente usadas na sublista nova. A sublista antiga contém *pages* acessadas com menos frequência; essas *pages* são candidatas à remoção (*eviction*).

Por padrão, o algoritmo opera da seguinte forma:

* 3/8 do Buffer Pool é dedicado à sublista antiga (*old sublist*).
* O ponto médio da lista é o limite onde a cauda da sublista nova encontra a cabeça da sublista antiga.

* Quando o `InnoDB` lê uma *page* no Buffer Pool, ele a insere inicialmente no ponto médio (a cabeça da sublista antiga). Uma *page* pode ser lida porque é exigida por uma operação iniciada pelo usuário, como uma Query SQL, ou como parte de uma operação Read-Ahead executada automaticamente pelo `InnoDB`.

* Acessar uma *page* na sublista antiga a torna “jovem” (*young*), movendo-a para a cabeça da sublista nova. Se a *page* foi lida porque era necessária para uma operação iniciada pelo usuário, o primeiro acesso ocorre imediatamente e a *page* se torna *young*. Se a *page* foi lida devido a uma operação Read-Ahead, o primeiro acesso não ocorre imediatamente e pode nem ocorrer antes que a *page* seja despejada (*evicted*).

* À medida que o Database opera, as *pages* no Buffer Pool que não são acessadas “envelhecem” (*age*) movendo-se em direção à cauda da lista. *Pages* nas sublistas nova e antiga envelhecem à medida que outras *pages* se tornam novas. As *pages* na sublista antiga também envelhecem à medida que as *pages* são inseridas no ponto médio. Eventualmente, uma *page* que permanece sem uso atinge a cauda da sublista antiga e é despejada (*evicted*).

Por padrão, as *pages* lidas pelas Querys são movidas imediatamente para a sublista nova, o que significa que permanecem no Buffer Pool por mais tempo. Um *table scan*, realizado para uma operação **mysqldump** ou uma instrução `SELECT` sem cláusula `WHERE`, por exemplo, pode trazer uma grande quantidade de dados para o Buffer Pool e despejar uma quantidade equivalente de dados mais antigos, mesmo que os novos dados nunca mais sejam usados. Da mesma forma, as *pages* que são carregadas pelo *background thread* de Read-Ahead e acessadas apenas uma vez são movidas para a cabeça da lista nova. Estas situações podem empurrar *pages* frequentemente usadas para a sublista antiga, onde ficam sujeitas à remoção (*eviction*). Para obter informações sobre como otimizar este comportamento, consulte Section 14.8.3.3, “Tornando o Buffer Pool Resistente a Scan”, e Section 14.8.3.4, “Configurando o Prefetching do Buffer Pool do InnoDB (Read-Ahead)”").

A saída do `InnoDB` Standard Monitor contém vários campos na seção `BUFFER POOL AND MEMORY` relacionados à operação do algoritmo LRU do Buffer Pool. Para detalhes, consulte Monitorando o Buffer Pool Usando o InnoDB Standard Monitor.

#### Configuração do Buffer Pool

Você pode configurar os vários aspectos do Buffer Pool para melhorar o desempenho.

* O ideal é definir o tamanho do Buffer Pool para o maior valor prático, deixando memória suficiente para que outros processos no servidor sejam executados sem excesso de *paging*. Quanto maior o Buffer Pool, mais o `InnoDB` age como um Database em memória, lendo dados do disco uma vez e depois acessando os dados da memória durante leituras subsequentes. Consulte Section 14.8.3.1, “Configurando o Tamanho do Buffer Pool do InnoDB”.

* Em sistemas de 64 bits com memória suficiente, você pode dividir o Buffer Pool em múltiplas partes para minimizar a contenção por estruturas de memória entre operações concorrentes. Para detalhes, consulte Section 14.8.3.2, “Configurando Múltiplas Instâncias do Buffer Pool”.

* Você pode manter dados frequentemente acessados na memória, independentemente de picos repentinos de atividade de operações que trariam grandes quantidades de dados raramente acessados para o Buffer Pool. Para detalhes, consulte Section 14.8.3.3, “Tornando o Buffer Pool Resistente a Scan”.

* Você pode controlar como e quando executar solicitações Read-Ahead para pré-buscar *pages* no Buffer Pool de forma assíncrona, antecipando que as *pages* serão necessárias em breve. Para detalhes, consulte Section 14.8.3.4, “Configurando o Prefetching do Buffer Pool do InnoDB (Read-Ahead)”").

* Você pode controlar quando o *flushing* em segundo plano (*background flushing*) ocorre e se a taxa de *flushing* é ajustada dinamicamente com base na carga de trabalho. Para detalhes, consulte Section 14.8.3.5, “Configurando o Flushing do Buffer Pool”.

* Você pode configurar como o `InnoDB` preserva o estado atual do Buffer Pool para evitar um longo período de *warmup* após a reinicialização do servidor. Para detalhes, consulte Section 14.8.3.6, “Salvando e Restaurando o Estado do Buffer Pool”.

#### Monitorando o Buffer Pool Usando o InnoDB Standard Monitor

A saída do `InnoDB` Standard Monitor, que pode ser acessada usando `SHOW ENGINE INNODB STATUS`, fornece métricas relacionadas à operação do Buffer Pool. As métricas do Buffer Pool estão localizadas na seção `BUFFER POOL AND MEMORY` da saída do `InnoDB` Standard Monitor:

```sql
----------------------
BUFFER POOL AND MEMORY
----------------------
Total large memory allocated 2198863872
Dictionary memory allocated 776332
Buffer pool size   131072
Free buffers       124908
Database pages     5720
Old database pages 2071
Modified db pages  910
Pending reads 0
Pending writes: LRU 0, flush list 0, single page 0
Pages made young 4, not young 0
0.10 youngs/s, 0.00 non-youngs/s
Pages read 197, created 5523, written 5060
0.00 reads/s, 190.89 creates/s, 244.94 writes/s
Buffer pool hit rate 1000 / 1000, young-making rate 0 / 1000 not
0 / 1000
Pages read ahead 0.00/s, evicted without access 0.00/s, Random read
ahead 0.00/s
LRU len: 5720, unzip_LRU len: 0
I/O sum[0]:cur[0], unzip sum[0]:cur[0]
```

A tabela a seguir descreve as métricas do Buffer Pool relatadas pelo `InnoDB` Standard Monitor.

As médias por segundo fornecidas na saída do `InnoDB` Standard Monitor são baseadas no tempo decorrido desde a última impressão da saída do `InnoDB` Standard Monitor.

**Tabela 14.2 Métricas do Buffer Pool do InnoDB**

| Nome | Descrição |
| :--- | :--- |
| Total memory allocated | A memória total alocada para o Buffer Pool em bytes. |
| Dictionary memory allocated | A memória total alocada para o dicionário de dados do `InnoDB` em bytes. |
| Buffer pool size | O tamanho total em *pages* alocadas para o Buffer Pool. |
| Free buffers | O tamanho total em *pages* da *free list* do Buffer Pool. |
| Database pages | O tamanho total em *pages* da lista LRU do Buffer Pool. |
| Old database pages | O tamanho total em *pages* da sublista LRU *old* do Buffer Pool. |
| Modified db pages | O número atual de *pages* modificadas no Buffer Pool. |
| Pending reads | O número de *pages* do Buffer Pool aguardando serem lidas no Buffer Pool. |
| Pending writes LRU | O número de *pages* *dirty* antigas (*old*) dentro do Buffer Pool a serem escritas a partir do final da lista LRU. |
| Pending writes flush list | O número de *pages* do Buffer Pool a serem *flushed* durante o *checkpointing*. |
| Pending writes single page | O número de *writes* de *page* independentes pendentes dentro do Buffer Pool. |
| Pages made young | O número total de *pages* tornadas *young* na lista LRU do Buffer Pool (movidas para a cabeça da sublista de *pages* “new”). |
| Pages made not young | O número total de *pages* que não foram tornadas *young* na lista LRU do Buffer Pool (*pages* que permaneceram na sublista “old” sem se tornarem *young*). |
| youngs/s | A média por segundo de acessos a *pages* *old* na lista LRU do Buffer Pool que resultaram em *pages* tornadas *young*. Consulte as notas que se seguem a esta tabela para mais informações. |
| non-youngs/s | A média por segundo de acessos a *pages* *old* na lista LRU do Buffer Pool que resultaram em *pages* *não* tornadas *young*. Consulte as notas que se seguem a esta tabela para mais informações. |
| Pages read | O número total de *pages* lidas do Buffer Pool. |
| Pages created | O número total de *pages* criadas dentro do Buffer Pool. |
| Pages written | O número total de *pages* escritas a partir do Buffer Pool. |
| reads/s | O número médio por segundo de leituras de *page* do Buffer Pool. |
| creates/s | O número médio por segundo de *pages* criadas no Buffer Pool. |
| writes/s | O número médio por segundo de *pages* escritas no Buffer Pool. |
| Buffer pool hit rate | O *hit rate* de *pages* do Buffer Pool para *pages* lidas do Buffer Pool versus aquelas lidas do armazenamento em disco. |
| young-making rate | O *hit rate* médio no qual os acessos de *page* resultaram em *pages* tornadas *young*. Consulte as notas que se seguem a esta tabela para mais informações. |
| not (young-making rate) | O *hit rate* médio no qual os acessos de *page* *não* resultaram em *pages* tornadas *young*. Consulte as notas que se seguem a esta tabela para mais informações. |
| Pages read ahead | A média por segundo de operações Read-Ahead. |
| Pages evicted without access | A média por segundo das *pages* despejadas (*evicted*) sem terem sido acessadas no Buffer Pool. |
| Random read ahead | A média por segundo de operações Random Read-Ahead. |
| LRU len | O tamanho total em *pages* da lista LRU do Buffer Pool. |
| unzip_LRU len | O comprimento (em *pages*) da lista unzip_LRU do Buffer Pool. |
| I/O sum | O número total de *pages* da lista LRU do Buffer Pool acessadas. |
| I/O cur | O número total de *pages* da lista LRU do Buffer Pool acessadas no intervalo atual. |
| I/O unzip sum | O número total de *pages* da lista unzip_LRU do Buffer Pool descompactadas. |
| I/O unzip cur | O número total de *pages* da lista unzip_LRU do Buffer Pool descompactadas no intervalo atual. |

**Notas**:

* A métrica `youngs/s` é aplicável apenas a *pages* *old*. É baseada no número de acessos de *page*. Pode haver múltiplos acessos para uma determinada *page*, todos eles contados. Se você observar valores muito baixos de `youngs/s` quando não houver *large scans* ocorrendo, considere reduzir o tempo de atraso ou aumentar a porcentagem do Buffer Pool usada para a sublista *old*. Aumentar a porcentagem torna a sublista *old* maior, de modo que leva mais tempo para que as *pages* nessa sublista se movam para a cauda, o que aumenta a probabilidade de que essas *pages* sejam acessadas novamente e tornadas *young*. Consulte Section 14.8.3.3, “Tornando o Buffer Pool Resistente a Scan”.

* A métrica `non-youngs/s` é aplicável apenas a *pages* *old*. É baseada no número de acessos de *page*. Pode haver múltiplos acessos para uma determinada *page*, todos eles contados. Se você não observar um valor `non-youngs/s` mais alto ao executar *large table scans* (e um valor `youngs/s` mais alto), aumente o valor do atraso. Consulte Section 14.8.3.3, “Tornando o Buffer Pool Resistente a Scan”.

* O `young-making rate` contabiliza todos os acessos de *page* do Buffer Pool, não apenas acessos para *pages* na sublista *old*. O `young-making rate` e o `not rate` normalmente não somam o *Buffer Pool hit rate* geral. *Page hits* na sublista *old* fazem com que as *pages* se movam para a sublista *new*, mas *page hits* na sublista *new* fazem com que as *pages* se movam para a cabeça da lista apenas se estiverem a uma certa distância da cabeça.

* `not (young-making rate)` é o *hit rate* médio no qual os acessos de *page* não resultaram em *pages* tornadas *young* devido ao atraso definido por `innodb_old_blocks_time` não ter sido atingido, ou devido a *page hits* na sublista *new* que não resultaram em *pages* movidas para a cabeça. Esta taxa contabiliza todos os acessos de *page* do Buffer Pool, não apenas acessos para *pages* na sublista *old*.

As variáveis de status do servidor do Buffer Pool e a tabela `INNODB_BUFFER_POOL_STATS` fornecem muitas das mesmas métricas do Buffer Pool encontradas na saída do `InnoDB` Standard Monitor. Para obter mais informações, consulte Example 14.10, “Querying a Tabela INNODB_BUFFER_POOL_STATS”.