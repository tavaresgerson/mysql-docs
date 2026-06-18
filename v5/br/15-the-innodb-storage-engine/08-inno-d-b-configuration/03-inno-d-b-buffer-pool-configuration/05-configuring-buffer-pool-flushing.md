#### 14.8.3.5 Configurando o Buffer Pool Flushing

O `InnoDB` executa certas tarefas em segundo plano, incluindo o *flushing* de *dirty pages* do *Buffer Pool*. *Dirty pages* são aquelas que foram modificadas, mas ainda não foram escritas nos arquivos de dados no disco.

No MySQL 5.7, o *Buffer Pool flushing* é realizado por *page cleaner threads*. O número de *page cleaner threads* é controlado pela variável `innodb_page_cleaners`, que tem um valor padrão de 4. No entanto, se o número de *page cleaner threads* exceder o número de instâncias do *Buffer Pool*, `innodb_page_cleaners` é automaticamente definido com o mesmo valor de `innodb_buffer_pool_instances`.

O *Buffer Pool flushing* é iniciado quando a porcentagem de *dirty pages* atinge o valor de *low water mark* definido pela variável `innodb_max_dirty_pages_pct_lwm`. O *low water mark* padrão é 0, o que desativa este comportamento de *flushing* antecipado.

O objetivo do limite (`threshold`) `innodb_max_dirty_pages_pct_lwm` é controlar a porcentagem de *dirty pages* no *Buffer Pool* e evitar que a quantidade de *dirty pages* atinja o limite definido pela variável `innodb_max_dirty_pages_pct`, que tem um valor padrão de 75. O `InnoDB` executa o *flushing* de páginas do *Buffer Pool* de forma agressiva se a porcentagem de *dirty pages* no *Buffer Pool* atingir o limite `innodb_max_dirty_pages_pct`.

Ao configurar `innodb_max_dirty_pages_pct_lwm`, o valor deve ser sempre inferior ao valor de `innodb_max_dirty_pages_pct`.

Variáveis adicionais permitem o ajuste fino (*fine-tuning*) do comportamento de *Buffer Pool flushing*:

*   A variável `innodb_flush_neighbors` define se o *flushing* de uma página do *Buffer Pool* também executa o *flushing* de outras *dirty pages* no mesmo *extent*.

    +   Um ajuste de 0 desabilita `innodb_flush_neighbors`. *Dirty pages* no mesmo *extent* não são descarregadas (*flushed*).

    +   O ajuste padrão de 1 executa o *flushing* de *dirty pages* contíguas no mesmo *extent*.

    +   Um ajuste de 2 executa o *flushing* de *dirty pages* no mesmo *extent*.

    Quando os dados da tabela são armazenados em um dispositivo de armazenamento HDD tradicional, o *flushing* de páginas vizinhas em uma única operação reduz a sobrecarga de I/O (*I/O overhead*) (principalmente para operações de busca em disco — *disk seek operations*) em comparação com o *flushing* de páginas individuais em momentos diferentes. Para dados de tabela armazenados em SSD, o tempo de busca (*seek time*) não é um fator significativo e você pode desabilitar esta configuração para distribuir as operações de escrita (*write operations*).

*   A variável `innodb_lru_scan_depth` especifica, por instância de *Buffer Pool*, a profundidade da lista LRU do *Buffer Pool* que o *page cleaner thread* verifica em busca de *dirty pages* para *flush*. Esta é uma operação em segundo plano executada por um *page cleaner thread* uma vez por segundo.

    Uma configuração menor do que a padrão é geralmente adequada para a maioria dos *workloads* (cargas de trabalho). Um valor significativamente mais alto do que o necessário pode impactar o desempenho. Considere aumentar o valor apenas se você tiver capacidade de I/O sobressalente em um *workload* típico. Por outro lado, se um *workload* intensivo em escrita (*write-intensive*) saturar sua capacidade de I/O, diminua o valor, especialmente no caso de um *Buffer Pool* grande.

    Ao ajustar (`tuning`) `innodb_lru_scan_depth`, comece com um valor baixo e configure a definição para cima com o objetivo de raramente ver zero páginas livres. Além disso, considere ajustar `innodb_lru_scan_depth` ao alterar o número de instâncias do *Buffer Pool*, visto que `innodb_lru_scan_depth` * `innodb_buffer_pool_instances` define a quantidade de trabalho realizado pelo *page cleaner thread* a cada segundo.

As variáveis `innodb_flush_neighbors` e `innodb_lru_scan_depth` são destinadas principalmente a *workloads* intensivos em escrita (*write-intensive workloads*). Com atividade DML pesada, o *flushing* pode ficar atrasado se não for agressivo o suficiente, ou as escritas em disco podem saturar a capacidade de I/O se o *flushing* for muito agressivo. As configurações ideais dependem do seu *workload*, padrões de acesso a dados e configuração de armazenamento (por exemplo, se os dados estão armazenados em dispositivos HDD ou SSD).

##### Flushing Adaptativo

O `InnoDB` usa um algoritmo de *flushing* adaptativo para ajustar dinamicamente a taxa de *flushing* com base na velocidade de geração do *Redo Log* e na taxa atual de *flushing*. O objetivo é suavizar o desempenho geral, garantindo que a atividade de *flushing* acompanhe o *workload* atual. O ajuste automático da taxa de *flushing* ajuda a evitar quedas repentinas no *throughput* que podem ocorrer quando picos de atividade de I/O devido ao *Buffer Pool flushing* afetam a capacidade de I/O disponível para atividades comuns de leitura e escrita.

*Sharp Checkpoints* (Checkpoints acentuados), que são tipicamente associados a *workloads* intensivos em escrita que geram muitas entradas de *redo*, podem causar uma mudança repentina no *throughput*, por exemplo. Um *sharp checkpoint* ocorre quando o `InnoDB` deseja reutilizar uma porção de um arquivo de *log*. Antes de fazê-lo, todas as *dirty pages* com entradas de *redo* naquela porção do arquivo de *log* devem ser descarregadas (*flushed*). Se os arquivos de *log* ficarem cheios, um *sharp checkpoint* ocorre, causando uma redução temporária no *throughput*. Este cenário pode ocorrer mesmo que o limite `innodb_max_dirty_pages_pct` não seja atingido.

O algoritmo de *flushing* adaptativo ajuda a evitar tais cenários rastreando o número de *dirty pages* no *Buffer Pool* e a taxa na qual os registros de *Redo Log* estão sendo gerados. Com base nesta informação, ele decide quantas *dirty pages* descarregar (*flush*) do *Buffer Pool* a cada segundo, o que permite gerenciar mudanças repentinas no *workload*.

A variável `innodb_adaptive_flushing_lwm` define um *low water mark* para a capacidade do *Redo Log*. Quando esse limite é ultrapassado, o *flushing* adaptativo é habilitado, mesmo que a variável `innodb_adaptive_flushing` esteja desabilitada.

*Benchmarking* interno demonstrou que o algoritmo não apenas mantém o *throughput* ao longo do tempo, mas também pode melhorar significativamente o *throughput* geral. No entanto, o *flushing* adaptativo pode afetar significativamente o padrão de I/O de um *workload* e pode não ser apropriado em todos os casos. Ele oferece o maior benefício quando o *Redo Log* está em perigo de ser preenchido. Se o *flushing* adaptativo não for apropriado para as características do seu *workload*, você pode desabilitá-lo. O *flushing* adaptativo é controlado pela variável `innodb_adaptive_flushing`, que é habilitada por padrão.

`innodb_flushing_avg_loops` define o número de iterações em que o `InnoDB` mantém o *snapshot* calculado anteriormente do estado de *flushing*, controlando a rapidez com que o *flushing* adaptativo responde às mudanças do *workload* em primeiro plano. Um valor alto para `innodb_flushing_avg_loops` significa que o `InnoDB` mantém o *snapshot* calculado anteriormente por mais tempo, de modo que o *flushing* adaptativo responde mais lentamente. Ao definir um valor alto, é importante garantir que a utilização do *Redo Log* não atinja 75% (o limite codificado no sistema, no qual o *flushing* assíncrono começa) e que o limite `innodb_max_dirty_pages_pct` mantenha o número de *dirty pages* em um nível apropriado para o *workload*.

Sistemas com *workloads* consistentes, um tamanho de arquivo de *log* grande (`innodb_log_file_size`) e pequenos picos que não atingem 75% de utilização do espaço de *log* devem usar um valor alto para `innodb_flushing_avg_loops` para manter o *flushing* o mais suave possível. Para sistemas com picos de carga extremos ou arquivos de *log* que não fornecem muito espaço, um valor menor permite que o *flushing* acompanhe de perto as mudanças do *workload* e ajuda a evitar atingir 75% de utilização do espaço de *log*.

Esteja ciente de que, se o *flushing* ficar atrasado, a taxa de *Buffer Pool flushing* pode exceder a capacidade de I/O disponível para o `InnoDB`, conforme definido pela configuração `innodb_io_capacity`. O valor `innodb_io_capacity_max` define um limite superior para a capacidade de I/O em tais situações, para que um pico de atividade de I/O não consuma toda a capacidade de I/O do servidor.

A configuração `innodb_io_capacity` é aplicável a todas as instâncias do *Buffer Pool*. Quando as *dirty pages* são descarregadas (*flushed*), a capacidade de I/O é dividida igualmente entre as instâncias do *Buffer Pool*.