#### 14.8.3.5 Configurando o esvaziamento do pool de buffers

O `InnoDB` realiza certas tarefas em segundo plano, incluindo o esvaziamento de páginas sujas do pool de buffer. Páginas sujas são aquelas que foram modificadas, mas ainda não foram escritas nos arquivos de dados no disco.

No MySQL 5.7, o esvaziamento do pool de buffers é realizado por threads do limpador de páginas. O número de threads do limpador de páginas é controlado pela variável `innodb_page_cleaners`, que tem um valor padrão de 4. No entanto, se o número de threads do limpador de páginas exceder o número de instâncias do pool de buffers, `innodb_page_cleaners` é automaticamente definido para o mesmo valor que `innodb_buffer_pool_instances`.

O esvaziamento do pool de tampão é iniciado quando a porcentagem de páginas sujas atinge o valor mínimo definido pela variável `innodb_max_dirty_pages_pct_lwm`. O valor mínimo padrão é 0, o que desabilita esse comportamento de esvaziamento precoce.

O objetivo do limite `innodb_max_dirty_pages_pct_lwm` é controlar a porcentagem de páginas sujas no pool de buffers e evitar que a quantidade de páginas sujas atinja o limite definido pela variável `innodb_max_dirty_pages_pct`, que tem um valor padrão de 75. O `InnoDB` elimina agressivamente as páginas do pool de buffers se a porcentagem de páginas sujas no pool de buffers atingir o limite `innodb_max_dirty_pages_pct`.

Ao configurar `innodb_max_dirty_pages_pct_lwm`, o valor deve ser sempre menor que o valor `innodb_max_dirty_pages_pct`.

Variáveis adicionais permitem o ajuste fino do comportamento de esvaziamento do pool de tampão:

- A variável `innodb_flush_neighbors` define se o esvaziamento de uma página do pool de buffer também esvazia outras páginas sujas da mesma extensão.

  - Um valor de 0 desativa `innodb_flush_neighbors`. Páginas sujas no mesmo intervalo não são descartadas.

  - A configuração padrão de 1 esvazia páginas sujas adjacentes no mesmo intervalo.

  - Uma configuração de 2 varreduras de páginas sujas na mesma extensão.

  Quando os dados da tabela são armazenados em um dispositivo de armazenamento HDD tradicional, o esvaziamento de páginas vizinhas em uma única operação reduz o overhead de I/O (principalmente para operações de busca no disco) em comparação com o esvaziamento de páginas individuais em momentos diferentes. Para dados da tabela armazenados em SSD, o tempo de busca não é um fator significativo, e você pode desabilitar essa configuração para espalhar as operações de escrita.

- A variável `innodb_lru_scan_depth` especifica, por instância de pool de buffers, até que ponto o thread de limpeza de páginas busca, na lista LRU do pool de buffers, páginas sujas para serem descartadas. Essa é uma operação em segundo plano realizada por um thread de limpeza de páginas uma vez por segundo.

  Um valor menor que o padrão é geralmente adequado para a maioria das cargas de trabalho. Um valor significativamente maior do que o necessário pode afetar o desempenho. Considere apenas aumentar o valor se você tiver capacidade de E/S adicional sob uma carga de trabalho típica. Por outro lado, se uma carga de trabalho intensiva em escrita saturar sua capacidade de E/S, diminua o valor, especialmente no caso de um grande pool de buffers.

  Ao ajustar `innodb_lru_scan_depth`, comece com um valor baixo e configure o ajuste para cima, com o objetivo de raramente ver páginas livres iguais a zero. Além disso, considere ajustar `innodb_lru_scan_depth` ao alterar o número de instâncias do pool de buffers, pois `innodb_lru_scan_depth` \* `innodb_buffer_pool_instances` define a quantidade de trabalho realizada pelo fio de limpeza de páginas a cada segundo.

As variáveis `innodb_flush_neighbors` e `innodb_lru_scan_depth` são projetadas principalmente para cargas de trabalho intensivas em escrita. Com uma atividade DML intensa, o processo de varredura pode ficar para trás se não for suficientemente agressivo, ou as escritas no disco podem saturar a capacidade de E/S se o processo de varredura for muito agressivo. As configurações ideais dependem da sua carga de trabalho, dos padrões de acesso aos dados e da configuração de armazenamento (por exemplo, se os dados são armazenados em dispositivos HDD ou SSD).

##### Limpeza adaptativa

O `InnoDB` utiliza um algoritmo de esvaziamento adaptativo para ajustar dinamicamente a taxa de esvaziamento com base na velocidade da geração do log de reverso e na taxa atual de esvaziamento. A intenção é suavizar o desempenho geral, garantindo que a atividade de esvaziamento mantenha o ritmo da carga de trabalho atual. Ajustar automaticamente a taxa de esvaziamento ajuda a evitar quedas repentinas no desempenho que podem ocorrer quando surtos de atividade de E/S devido ao esvaziamento do pool de buffers afetam a capacidade de E/S disponível para a atividade de leitura e escrita ordinária.

Pontos de verificação agudos, que geralmente estão associados a cargas de trabalho intensivas em escrita que geram muitas entradas de refazer, podem causar uma mudança súbita no desempenho, por exemplo. Um ponto de verificação agudo ocorre quando o `InnoDB` deseja reutilizar uma parte de um arquivo de log. Antes de fazer isso, todas as páginas sujas com entradas de refazer nessa parte do arquivo de log devem ser descarregadas. Se os arquivos de log ficarem cheios, ocorre um ponto de verificação agudo, causando uma redução temporária no desempenho. Esse cenário pode ocorrer mesmo se o limite `innodb_max_dirty_pages_pct` não for atingido.

O algoritmo de limpeza adaptativo ajuda a evitar tais cenários, monitorando o número de páginas sujas no pool de buffer e a taxa na qual os registros do log de refazer estão sendo gerados. Com base nessas informações, ele decide quantos páginas sujas devem ser limpas do pool de buffer a cada segundo, o que permite que ele gerencie mudanças repentinas na carga de trabalho.

A variável `innodb_adaptive_flushing_lwm` define uma marca de água baixa para a capacidade do log de refazer. Quando esse limite é ultrapassado, o esvaziamento adaptativo é ativado, mesmo que a variável `innodb_adaptive_flushing` esteja desativada.

O benchmarking interno mostrou que o algoritmo não apenas mantém o desempenho ao longo do tempo, mas também pode melhorar significativamente o desempenho geral. No entanto, o esvaziamento adaptativo pode afetar significativamente o padrão de E/S de uma carga de trabalho e pode não ser apropriado em todos os casos. Ele traz o maior benefício quando o log de revisão está em perigo de ficar cheio. Se o esvaziamento adaptativo não for apropriado às características da sua carga de trabalho, você pode desabilitá-lo. O esvaziamento adaptativo é controlado pela variável `innodb_adaptive_flushing`, que é habilitada por padrão.

`innodb_flushing_avg_loops` define o número de iterações que o `InnoDB` mantém o instantâneo anteriormente calculado do estado de esvaziamento, controlando o quão rapidamente o esvaziamento adaptativo responde às mudanças na carga de trabalho em primeiro plano. Um valor alto de `innodb_flushing_avg_loops` significa que o `InnoDB` mantém o instantâneo anteriormente calculado por mais tempo, portanto, o esvaziamento adaptativo responde mais lentamente. Ao definir um valor alto, é importante garantir que a utilização do log de refazer não atinja 75% (o limite hardcoded em que o esvaziamento assíncrono começa) e que o limite `innodb_max_dirty_pages_pct` mantenha o número de páginas sujas em um nível apropriado para a carga de trabalho.

Sistemas com cargas de trabalho consistentes, um grande tamanho de arquivo de log (`innodb_log_file_size`) e picos pequenos que não atingem 75% de utilização do espaço de log devem usar um valor alto de `innodb_flushing_avg_loops` para manter o processo de esvaziamento o mais suave possível. Para sistemas com picos de carga extremos ou arquivos de log que não oferecem muito espaço, um valor menor permite que o esvaziamento acompanhe de perto as mudanças na carga de trabalho e ajuda a evitar atingir 75% de utilização do espaço de log.

Tenha em mente que, se o esvaziamento do buffer ficar para trás, a taxa de esvaziamento do buffer pode exceder a capacidade de E/S disponível para o `InnoDB`, conforme definido pelo ajuste `innodb_io_capacity`. O valor `innodb_io_capacity_max` define um limite superior para a capacidade de E/S nessas situações, para que um aumento na atividade de E/S não consuma toda a capacidade de E/S do servidor.

A configuração `innodb_io_capacity` é aplicável a todas as instâncias do pool de buffers. Quando as páginas sujas são descartadas, a capacidade de E/S é dividida igualmente entre as instâncias do pool de buffers.
