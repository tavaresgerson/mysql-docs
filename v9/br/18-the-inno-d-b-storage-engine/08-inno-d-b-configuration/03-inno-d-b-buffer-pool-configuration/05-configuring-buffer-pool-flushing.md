#### 17.8.3.5 Configurando o Limpeza de Pool de Buffer

O `InnoDB` executa certas tarefas em segundo plano, incluindo a limpeza de páginas sujas do pool de buffer. Páginas sujas são aquelas que foram modificadas, mas ainda não foram escritas nos arquivos de dados no disco.

A limpeza do pool de buffer é realizada por threads de limpadores de páginas. O número de threads de limpadores de páginas é controlado pela variável `innodb_page_cleaners`, que tem um valor padrão definido para o mesmo valor que `innodb_buffer_pool_instances`.

A limpeza do pool de buffer é iniciada quando a porcentagem de páginas sujas atinge o valor do limite de água baixa definido pela variável `innodb_max_dirty_pages_pct_lwm`. O limite de água baixa padrão é de 10% das páginas do pool de buffer. Um valor de `innodb_max_dirty_pages_pct_lwm` de 0 desativa esse comportamento de limpeza precoce.

O propósito do limite `innodb_max_dirty_pages_pct_lwm` é controlar a porcentagem de páginas sujas no pool de buffer e evitar que a quantidade de páginas sujas atinja o limite definido pela variável `innodb_max_dirty_pages_pct`, que tem um valor padrão de 90. O `InnoDB` limpa agressivamente as páginas do pool de buffer se a porcentagem de páginas sujas no pool de buffer atingir o limite `innodb_max_dirty_pages_pct`.

Ao configurar `innodb_max_dirty_pages_pct_lwm`, o valor deve sempre ser menor que o valor de `innodb_max_dirty_pages_pct`.

Variáveis adicionais permitem o ajuste fino do comportamento de limpeza do pool de buffer:

* A variável `innodb_flush_neighbors` define se a limpeza de uma página do pool de buffer também limpa outras páginas sujas na mesma extensão.

  + O ajuste padrão de 0 desativa `innodb_flush_neighbors`. Páginas sujas na mesma extensão não são limpas. Este ajuste é recomendado para dispositivos de armazenamento não rotacional (SSD) onde o tempo de busca não é um fator significativo.

+ Uma configuração de 1 varredura de páginas sujas contíguas na mesma extensão.

+ Uma configuração de 2 varreduras de páginas sujas na mesma extensão.

Quando os dados da tabela são armazenados em um dispositivo de armazenamento HDD tradicional, a varredura de páginas vizinhas em uma única operação reduz o overhead de I/O (principalmente para operações de busca no disco) em comparação com a varredura de páginas individuais em momentos diferentes. Para dados de tabela armazenados em SSD, o tempo de busca não é um fator significativo e você pode desabilitar essa configuração para espalhar as operações de escrita.

* A variável `innodb_lru_scan_depth` especifica, por instância do pool de buffers, até que ponto o thread de limpeza de buffers escaneia a lista LRU do pool de buffers em busca de páginas sujas para varredura. Essa é uma operação em segundo plano realizada por um thread de limpeza de buffers uma vez por segundo.

Uma configuração menor que o padrão é geralmente adequada para a maioria das cargas de trabalho. Um valor significativamente maior que o necessário pode impactar o desempenho. Considere aumentar o valor apenas se você tiver capacidade de I/O disponível sob uma carga de trabalho típica. Por outro lado, se uma carga de trabalho intensiva em escrita saturar sua capacidade de I/O, diminua o valor, especialmente no caso de um grande pool de buffers.

Ao ajustar `innodb_lru_scan_depth`, comece com um valor baixo e configure a configuração para cima com o objetivo de raramente ver páginas livres zero. Além disso, considere ajustar `innodb_lru_scan_depth` ao alterar o número de instâncias do pool de buffers, pois `innodb_lru_scan_depth * innodb_buffer_pool_instances` define a quantidade de trabalho realizada pelo thread de limpeza de buffers a cada segundo.

As variáveis `innodb_flush_neighbors` e `innodb_lru_scan_depth` são projetadas principalmente para cargas de trabalho intensivas em escrita. Com uma atividade DML intensa, o processo de esvaziamento pode ficar para trás se não for suficientemente agressivo, ou as escritas no disco podem saturar a capacidade de I/O se o esvaziamento for muito agressivo. As configurações ideais dependem da sua carga de trabalho, dos padrões de acesso aos dados e da configuração de armazenamento (por exemplo, se os dados são armazenados em dispositivos HDD ou SSD).

##### Limpeza Adaptativa

O `InnoDB` utiliza um algoritmo de limpeza adaptativo para ajustar dinamicamente a taxa de esvaziamento com base na velocidade da geração do log de refazer e na taxa atual de esvaziamento. A intenção é suavizar o desempenho geral, garantindo que a atividade de esvaziamento acompanhe a carga de trabalho atual. Ajuste automático da taxa de esvaziamento ajuda a evitar quedas repentinas no desempenho que podem ocorrer quando surtos de atividade de I/O devido ao esvaziamento do pool de buffers afetam a capacidade de I/O disponível para a atividade de leitura e escrita ordinária.

Por exemplo, pontos de verificação bruscos, que são tipicamente associados a cargas de trabalho intensivas em escrita que geram muitas entradas de refazer, podem causar uma mudança súbita no desempenho. Um ponto de verificação brusco ocorre quando o `InnoDB` deseja reutilizar uma parte de um arquivo de log. Antes de fazer isso, todas as páginas sujas com entradas de refazer nessa parte do arquivo de log devem ser esvaziadas. Se os arquivos de log ficarem cheios, ocorre um ponto de verificação brusco, causando uma redução temporária no desempenho. Esse cenário pode ocorrer mesmo se o limite `innodb_max_dirty_pages_pct` não for atingido.

O algoritmo de limpeza adaptativa ajuda a evitar tais cenários, monitorando o número de páginas sujas no pool de buffer e a taxa na qual os registros do log de refazer estão sendo gerados. Com base nessas informações, ele decide quantos páginas sujas devem ser limpas do pool de buffer a cada segundo, o que permite que ele gerencie mudanças repentinas na carga de trabalho.

A variável `innodb_adaptive_flushing_lwm` define uma marca de água baixa para a capacidade do log de refazer. Quando esse limite é ultrapassado, a limpeza adaptativa é habilitada, mesmo que a variável `innodb_adaptive_flushing` esteja desabilitada.

O benchmarking interno mostrou que o algoritmo não apenas mantém o desempenho ao longo do tempo, mas também pode melhorar significativamente o desempenho geral. No entanto, a limpeza adaptativa pode afetar significativamente o padrão de I/O de uma carga de trabalho e pode não ser apropriada em todos os casos. Ela traz o maior benefício quando o log de refazer está em perigo de ficar cheio. Se a limpeza adaptativa não for apropriada às características da sua carga de trabalho, você pode desabilitá-la. A limpeza adaptativa controlada pela variável `innodb_adaptive_flushing`, que é habilitada por padrão.

`innodb_flushing_avg_loops` define o número de iterações que o `InnoDB` mantém o snapshot previamente calculado do estado de limpeza, controlando o quão rapidamente a limpeza adaptativa responde às mudanças na carga de trabalho em primeiro plano. Um valor alto de `innodb_flushing_avg_loops` significa que o `InnoDB` mantém o snapshot previamente calculado por mais tempo, então a limpeza adaptativa responde mais lentamente. Ao definir um valor alto, é importante garantir que a utilização do log de refazer não atinja 75% (o limite hardcoded em que o esvaziamento assíncrono começa) e que o limite `innodb_max_dirty_pages_pct` mantenha o número de páginas sujas em um nível apropriado para a carga de trabalho.

Sistemas com cargas de trabalho consistentes e picos pequenos que não atingem 75% de utilização do espaço de log devem usar um valor alto de `innodb_flushing_avg_loops` para manter o esvaziamento o mais suave possível. Para sistemas com picos de carga extremos ou arquivos de log que não fornecem muito espaço, um valor menor permite que o esvaziamento acompanhe de perto as mudanças na carga de trabalho e ajuda a evitar atingir 75% de utilização do espaço de log.

Tenha em mente que, se o esvaziamento ficar atrasado, a taxa de esvaziamento do pool de buffers pode exceder a capacidade de I/O disponível para o `InnoDB`, conforme definido pelo ajuste `innodb_io_capacity`. O valor `innodb_io_capacity_max` define um limite superior para a capacidade de I/O nessas situações, para que um pico na atividade de I/O não consuma toda a capacidade de I/O do servidor.

O ajuste `innodb_io_capacity` é aplicável a todas as instâncias do pool de buffers. Quando as páginas sujas são esvaziadas, a capacidade de I/O é dividida igualmente entre as instâncias do pool de buffers.

##### Limitar o Esvaziamento do Buffer Durante Períodos de Idade

A variável `innodb_idle_flush_pct` limita a taxa de esvaziamento do pool de buffers durante períodos de inatividade, que são períodos de tempo em que as páginas do banco de dados não são modificadas. Seu valor é interpretado como uma porcentagem da `innodb_io_capacity` (que define o número de operações de I/O por segundo disponíveis para o `InnoDB`). O valor padrão é 100, ou 100% do valor da `innodb_io_capacity`. Para limitar o esvaziamento durante períodos de inatividade, defina `innodb_idle_flush_pct` para menos de 100.

Limitar o esvaziamento de páginas durante períodos de inatividade pode ajudar a prolongar a vida útil dos dispositivos de armazenamento em estado sólido. Efeitos colaterais de limitar o esvaziamento de páginas durante períodos de inatividade podem incluir um tempo de desligamento mais longo após um longo período de inatividade e um período de recuperação mais longo em caso de falha do servidor.