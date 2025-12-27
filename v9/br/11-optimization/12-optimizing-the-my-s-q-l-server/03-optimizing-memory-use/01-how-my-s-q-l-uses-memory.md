#### 10.12.3.1 Como o MySQL Usa a Memória

O MySQL aloca buffers e caches para melhorar o desempenho das operações do banco de dados. A configuração padrão é projetada para permitir que um servidor MySQL seja iniciado em uma máquina virtual que tenha aproximadamente 512 MB de RAM. Você pode melhorar o desempenho do MySQL aumentando os valores de certas variáveis de sistema relacionadas a caches e buffers. Você também pode modificar a configuração padrão para executar o MySQL em sistemas com memória limitada.

A lista a seguir descreve algumas das maneiras pelas quais o MySQL usa a memória. Quando aplicável, variáveis de sistema relevantes são referenciadas. Alguns itens são específicos do mecanismo de armazenamento ou recursos.

* O pool de buffers `InnoDB` é uma área de memória que armazena dados `InnoDB` cacheados para tabelas, índices e outros buffers auxiliares. Para a eficiência de operações de leitura de alto volume, o pool de buffers é dividido em páginas que podem potencialmente conter várias linhas. Para a eficiência da gestão de cache, o pool de buffers é implementado como uma lista encadeada de páginas; dados que raramente são usados são excluídos do cache, usando uma variação do algoritmo LRU. Para mais informações, consulte a Seção 17.5.1, “Pool de Buffers”.

  O tamanho do pool de buffers é importante para o desempenho do sistema:

  + O `InnoDB` aloca memória para todo o pool de buffers no início do servidor, usando operações `malloc()`. A variável de sistema `innodb_buffer_pool_size` define o tamanho do pool de buffers. Tipicamente, um valor recomendado de `innodb_buffer_pool_size` é de 50 a 75% da memória do sistema. `innodb_buffer_pool_size` pode ser configurado dinamicamente, enquanto o servidor está em execução. Para mais informações, consulte a Seção 17.8.3.1, “Configurando o Tamanho do Pool de Buffers do InnoDB”.

+ Em sistemas com uma grande quantidade de memória, você pode melhorar a concorrência dividindo o pool de buffers em várias instâncias do pool de buffers. A variável de sistema `innodb_buffer_pool_instances` define o número de instâncias do pool de buffers.

+ Um pool de buffers muito pequeno pode causar um desgaste excessivo, pois as páginas são descartadas do pool de buffers e precisam ser recuperadas novamente em pouco tempo.

+ Um pool de buffers muito grande pode causar troca de dados devido à competição por memória.

* A interface do mecanismo de armazenamento permite que o otimizador forneça informações sobre o tamanho do buffer de registro a ser usado para pesquisas que o otimizador estima que provavelmente leiam várias linhas. O tamanho do buffer pode variar com base no tamanho da estimativa. O `InnoDB` utiliza essa capacidade de buffer de tamanho variável para aproveitar o preenchimento prévio de linhas e reduzir o overhead da trava e da navegação na árvore B.

* Todos os threads compartilham o buffer de chave `MyISAM`. A variável de sistema `key_buffer_size` determina seu tamanho.

+ Para cada tabela `MyISAM` aberta pelo servidor, o arquivo de índice é aberto uma vez; o arquivo de dados é aberto uma vez para cada thread que acessa a tabela. Para cada thread concorrente, uma estrutura de tabela, estruturas de coluna para cada coluna e um buffer do tamanho `3 * N` são alocados (onde *`N`* é o comprimento máximo da linha, excluindo as colunas `BLOB`). Uma coluna `BLOB` requer de cinco a oito bytes mais o comprimento dos dados do `BLOB`. O mecanismo de armazenamento `MyISAM` mantém um buffer de linha extra para uso interno.

+ A variável de sistema `myisam_use_mmap` pode ser definida para 1 para habilitar o mapeamento de memória para todas as tabelas `MyISAM`.

* Se uma tabela temporária interna em memória ficar muito grande (conforme determinado por `tmp_table_size` e `max_heap_table_size`), o MySQL converte automaticamente a tabela de memória para o formato em disco, que utiliza o mecanismo de armazenamento `InnoDB`. Ao atingir esse limite, também é incrementado `Count_hit_tmp_table_size`. Você pode aumentar o tamanho permitido da tabela temporária conforme descrito na Seção 10.4.4, “Uso de Tabelas Temporárias Internas no MySQL”.

  Para tabelas `MEMORY` criadas explicitamente com `CREATE TABLE`, apenas a variável de sistema `max_heap_table_size` determina o tamanho máximo que uma tabela pode crescer, e não há conversão para o formato em disco.

* O MySQL Performance Schema é uma funcionalidade para monitorar a execução do servidor MySQL em um nível baixo. O Performance Schema aloca dinamicamente a memória incrementalmente, escalando seu uso de memória para a carga real do servidor, em vez de alocar a memória necessária durante o inicialização do servidor. Uma vez que a memória é alocada, ela não é liberada até que o servidor seja reiniciado. Para mais informações, consulte a Seção 29.17, “O Modelo de Alocação de Memória do Performance Schema”.

* Cada fio que o servidor usa para gerenciar conexões de clientes requer algum espaço específico para o fio. A lista a seguir indica esses e quais variáveis de sistema controlam seu tamanho:

  + Uma pilha (`thread_stack`)

  + Um buffer de conexão (`net_buffer_length`)

  + Um buffer de resultado (`net_buffer_length`)

  O buffer de conexão e o buffer de resultado começam com um tamanho igual a `net_buffer_length` bytes, mas são ampliados dinamicamente até `max_allowed_packet` bytes conforme necessário. O buffer de resultado diminui para `net_buffer_length` bytes após cada instrução SQL. Enquanto uma instrução está sendo executada, uma cópia da string atual da instrução também é alocada.

Cada fio de conexão usa memória para calcular os resumos das instruções. O servidor aloca `max_digest_length` bytes por sessão. Veja a Seção 29.10, “Resumo de instruções do Schema de Desempenho e Amostragem”.

* Todos os threads compartilham a mesma memória básica.
* Quando um thread não é mais necessário, a memória alocada para ele é liberada e devolvida ao sistema, a menos que o thread volte para a cache de threads. Nesse caso, a memória permanece alocada.

* Cada solicitação que realiza uma varredura sequencial de uma tabela aloca um buffer de leitura. A variável de sistema `read_buffer_size` determina o tamanho do buffer.

* Ao ler linhas em uma sequência arbitrária (por exemplo, após uma ordenação), um buffer de leitura aleatória pode ser alocado para evitar buscas no disco. A variável de sistema `read_rnd_buffer_size` determina o tamanho do buffer.

* Todos os junções são executados em uma única passagem, e a maioria das junções pode ser feita sem usar uma tabela temporária. A maioria das tabelas temporárias é uma tabela hash baseada em memória. Tabelas temporárias com um comprimento de linha grande (calculado como a soma de todos os comprimentos das colunas) ou que contêm colunas `BLOB` são armazenadas no disco.

* A maioria das solicitações que realizam uma ordenação aloca um buffer de ordenação e de zero a dois arquivos temporários, dependendo do tamanho do conjunto de resultados. Veja a Seção B.3.3.5, “Onde o MySQL armazena arquivos temporários”.

* Quase todas as parses e cálculos são feitos em pools de memória locais e reutilizáveis. Não há sobrecarga de memória para itens pequenos, evitando assim a alocação e liberação normais de memória lenta. A memória é alocada apenas para strings inesperadamente grandes.

* Para cada tabela com colunas `BLOB`, um buffer é ampliado dinamicamente para ler valores `BLOB` maiores. Se você varrer uma tabela, o buffer cresce até o maior valor `BLOB`.

* O MySQL requer memória e descritores para o cache de tabelas. As estruturas de manipulador para todas as tabelas em uso são salvas no cache de tabelas e gerenciadas como "Primeiro a Entrar, Primeiro a Saiar" (FIFO). A variável de sistema `table_open_cache` define o tamanho inicial do cache de tabelas; veja a Seção 10.4.3.1, "Como o MySQL Abre e Fecha Tabelas".

  O MySQL também requer memória para o cache de definição de tabelas. A variável de sistema `table_definition_cache` define o número de definições de tabelas que podem ser armazenadas no cache de definição de tabelas. Se você usar um grande número de tabelas, pode criar um grande cache de definições de tabelas para acelerar a abertura das tabelas. O cache de definição de tabelas ocupa menos espaço e não usa descritores de arquivo, ao contrário do cache de tabelas.

* Uma declaração `FLUSH TABLES` ou o comando **mysqladmin flush-tables` fecha todas as tabelas que não estão em uso de uma vez e marca todas as tabelas em uso para serem fechadas quando o thread atualmente em execução terminar. Isso libera efetivamente a maioria da memória em uso. `FLUSH TABLES` não retorna até que todas as tabelas tenham sido fechadas.

* O servidor armazena informações na memória como resultado das declarações `GRANT`, `CREATE USER`, `CREATE SERVER` e `INSTALL PLUGIN`. Essa memória não é liberada pelas declarações correspondentes `REVOKE`, `DROP USER`, `DROP SERVER` e `UNINSTALL PLUGIN`, então, para um servidor que executa muitas instâncias das declarações que causam o cache, há um aumento no uso de memória cache, a menos que seja liberado com `FLUSH PRIVILEGES`.

* Em uma topologia de replicação, as seguintes configurações afetam o uso de memória e podem ser ajustadas conforme necessário:

  + A variável de sistema `max_allowed_packet` em uma fonte de replicação limita o tamanho máximo do pacote que a fonte envia para suas réplicas para processamento. Esse ajuste tem como padrão 64M.

A variável de sistema `replica_pending_jobs_size_max` em uma replica multithread define o tamanho máximo de memória disponível para armazenar mensagens aguardando processamento. Esse ajuste é definido como padrão para 128M. A memória é alocada apenas quando necessário, mas pode ser usada se a topologia de replicação lidar com transações grandes às vezes. É um limite flexível, e transações maiores podem ser processadas.

A variável de sistema `rpl_read_size` em uma fonte de replicação ou replica controla a quantidade mínima de dados em bytes que é lida dos arquivos de log binário e dos arquivos de log de retransmissão. O padrão é de 8192 bytes. Um buffer do tamanho desse valor é alocado para cada thread que lê dos arquivos de log binário e de log de retransmissão, incluindo threads de dump nas fontes e threads de coordenador nas réplicas.

A variável de sistema `binlog_transaction_dependency_history_size` limita o número de hashes de linha mantidos como histórico em memória.

A variável de sistema `max_binlog_cache_size` especifica o limite máximo de uso de memória por uma transação individual.

Os programas `ps` e outros programas de status do sistema podem relatar que o **mysqld** usa muita memória. Isso pode ser causado por pilhas de threads em endereços de memória diferentes. Por exemplo, a versão Solaris do **ps** conta o espaço de memória inutilizado entre as pilhas como espaço de memória usado. Para verificar isso, verifique o swap disponível com `swap -s`. Testamos o **mysqld** com vários detectores de vazamento de memória (tanto comerciais quanto de código aberto), então não deve haver vazamentos de memória.