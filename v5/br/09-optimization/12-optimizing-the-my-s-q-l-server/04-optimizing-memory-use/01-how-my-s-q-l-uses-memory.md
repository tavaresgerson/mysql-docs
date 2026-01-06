#### 8.12.4.1 Como o MySQL usa a memória

O MySQL aloca buffers e caches para melhorar o desempenho das operações do banco de dados. A configuração padrão é projetada para permitir que um servidor MySQL seja iniciado em uma máquina virtual que tenha aproximadamente 512 MB de RAM. Você pode melhorar o desempenho do MySQL aumentando os valores de certas variáveis de sistema relacionadas a caches e buffers. Você também pode modificar a configuração padrão para executar o MySQL em sistemas com memória limitada.

A lista a seguir descreve algumas das maneiras pelas quais o MySQL utiliza a memória. Quando aplicável, variáveis do sistema relevantes são referenciadas. Alguns itens são específicos do mecanismo de armazenamento ou recursos.

- O pool de buffers `InnoDB` é uma área de memória que armazena dados `InnoDB` cacheados para tabelas, índices e outros buffers auxiliares. Para a eficiência das operações de leitura de alto volume, o pool de buffers é dividido em páginas que podem potencialmente armazenar múltiplas linhas. Para a eficiência da gestão do cache, o pool de buffers é implementado como uma lista encadeada de páginas; os dados que raramente são usados são eliminados do cache, usando uma variação do algoritmo LRU. Para mais informações, consulte a Seção 14.5.1, “Pool de Buffers”.

  O tamanho do pool de buffer é importante para o desempenho do sistema:

  - O `InnoDB` aloca memória para todo o pool de buffers no início do servidor, usando operações `malloc()`. A variável de sistema `innodb_buffer_pool_size` define o tamanho do pool de buffers. Tipicamente, um valor recomendado para `innodb_buffer_pool_size` é de 50 a 75% da memória do sistema. `innodb_buffer_pool_size` pode ser configurado dinamicamente, enquanto o servidor estiver em execução. Para mais informações, consulte a Seção 14.8.3.1, “Configurando o Tamanho do Pool de Buffers do InnoDB”.

  - Em sistemas com uma grande quantidade de memória, você pode melhorar a concorrência dividindo o pool de buffers em várias instâncias do pool de buffers. A variável de sistema `innodb_buffer_pool_instances` define o número de instâncias do pool de buffers.

  - Um pool de tampão muito pequeno pode causar um movimento excessivo, pois as páginas são descartadas do pool de tampão e, pouco tempo depois, são necessárias novamente.

  - Um pool de tampão muito grande pode causar troca de dados devido à competição por memória.

- Todos os threads compartilham o buffer de chave `MyISAM`. A variável de sistema `key_buffer_size` determina seu tamanho.

  Para cada tabela `MyISAM` que o servidor abre, o arquivo de índice é aberto uma vez; o arquivo de dados é aberto uma vez para cada fio de execução concorrente que acessa a tabela. Para cada fio de execução concorrente, uma estrutura de tabela, estruturas de coluna para cada coluna e um buffer do tamanho `3 * N` são alocados (onde *`N`* é o comprimento máximo da linha, excluindo as colunas `BLOB`). Uma coluna `BLOB` requer de cinco a oito bytes mais o comprimento dos dados `BLOB`. O mecanismo de armazenamento `MyISAM` mantém um buffer de linha extra para uso interno.

- A variável de sistema `myisam_use_mmap` pode ser definida como 1 para habilitar a mapeamento de memória para todas as tabelas `MyISAM`.

- Se uma tabela temporária interna em memória ficar muito grande (conforme determinado usando as variáveis de sistema `tmp_table_size` e `max_heap_table_size`), o MySQL converte automaticamente a tabela do formato em memória para o formato em disco. As tabelas temporárias em disco usam o mecanismo de armazenamento definido pela variável de sistema `internal_tmp_disk_storage_engine`. Você pode aumentar o tamanho permitido da tabela temporária conforme descrito na Seção 8.4.4, “Uso de Tabelas Temporárias Internas no MySQL”.

  Para as tabelas `MEMORY` criadas explicitamente com `CREATE TABLE`, apenas a variável de sistema `max_heap_table_size` determina o tamanho máximo que uma tabela pode crescer, e não há conversão para o formato no disco.

- O Schema de Desempenho do MySQL é uma funcionalidade para monitorar a execução do servidor MySQL em um nível baixo. O Schema de Desempenho aloca dinamicamente a memória incrementalmente, ajustando seu uso de memória à carga real do servidor, em vez de alocar a memória necessária durante o início do servidor. Uma vez que a memória é alocada, ela não é liberada até que o servidor seja reiniciado. Para mais informações, consulte a Seção 25.17, “O Modelo de Alocação de Memória do Schema de Desempenho”.

- Cada fio que o servidor usa para gerenciar as conexões dos clientes requer um espaço específico para cada fio. A lista a seguir indica esses espaços e quais variáveis do sistema controlam seu tamanho:

  - Uma pilha (`thread_stack`)

  - Um buffer de conexão (`net_buffer_length`)

  - Um buffer de resultado (`net_buffer_length`)

  O buffer de conexão e o buffer de resultados começam com um tamanho igual a `net_buffer_length` bytes, mas são ampliados dinamicamente até `max_allowed_packet` bytes conforme necessário. O buffer de resultados diminui para `net_buffer_length` bytes após cada instrução SQL. Enquanto uma instrução está sendo executada, uma cópia da string atual da instrução também é alocada.

  Cada fio de conexão usa memória para calcular os resumos das instruções. O servidor aloca `max_digest_length` bytes por sessão. Veja a Seção 25.10, “Resumo de instruções do Schema de desempenho”.

- Todos os fios compartilham a mesma memória básica.

- Quando um fio não é mais necessário, a memória alocada para ele é liberada e devolvida ao sistema, a menos que o fio volte para a cache de threads. Nesse caso, a memória permanece alocada.

- Cada solicitação que realiza uma varredura sequencial de uma tabela aloca um buffer de leitura. A variável de sistema `read_buffer_size` determina o tamanho do buffer.

- Ao ler linhas em uma sequência arbitrária (por exemplo, após uma ordenação), um buffer de leitura aleatória pode ser alocado para evitar buscas no disco. A variável de sistema `read_rnd_buffer_size` determina o tamanho do buffer.

- Todas as junções são executadas em uma única passagem, e a maioria das junções pode ser feita sem usar uma tabela temporária. A maioria das tabelas temporárias são tabelas hash baseadas em memória. Tabelas temporárias com um comprimento de linha grande (calculado como a soma de todos os comprimentos das colunas) ou que contêm colunas `BLOB` são armazenadas em disco.

- A maioria dos pedidos que realizam uma classificação aloca um buffer de classificação e de zero a dois arquivos temporários, dependendo do tamanho do conjunto de resultados. Veja a Seção B.3.3.5, “Onde o MySQL armazena arquivos temporários”.

- Quase todo o processamento e cálculo são feitos em pools de memória locais e reutilizáveis. Não é necessário sobrecarga de memória para itens pequenos, evitando assim a alocação e liberação de memória lenta. A memória é alocada apenas para strings inesperadamente grandes.

- Para cada tabela com colunas `BLOB`, um buffer é ampliado dinamicamente para ler valores `BLOB` maiores. Se você digitalizar uma tabela, o buffer cresce até o tamanho do maior valor `BLOB`.

- O MySQL requer memória e descritores para o cache de tabelas. As estruturas de manipulador para todas as tabelas em uso são salvas no cache de tabelas e gerenciadas como “Primeiro A Entrar, Primeiro A Sair” (FIFO). A variável de sistema `table_open_cache` define o tamanho inicial do cache de tabelas; veja a Seção 8.4.3.1, “Como o MySQL Abre e Fecha Tabelas”.

  O MySQL também requer memória para o cache de definição de tabela. A variável de sistema `table_definition_cache` define o número de definições de tabela (de arquivos `.frm`) que podem ser armazenadas no cache de definição de tabela. Se você usar um grande número de tabelas, pode criar um grande cache de definição de tabela para acelerar a abertura das tabelas. O cache de definição de tabela ocupa menos espaço e não usa descritores de arquivo, ao contrário do cache de tabela.

- A instrução `FLUSH TABLES` ou o comando **mysqladmin flush-tables** fecha todas as tabelas que não estão em uso de uma vez e marca todas as tabelas em uso para serem fechadas quando o thread atualmente em execução terminar. Isso libera efetivamente a maioria da memória em uso. `FLUSH TABLES` não retorna até que todas as tabelas tenham sido fechadas.

- O servidor armazena informações na memória como resultado das instruções `GRANT`, `CREATE USER`, `CREATE SERVER` e `INSTALL PLUGIN`. Essa memória não é liberada pelas instruções correspondentes `REVOKE`, `DROP USER`, `DROP SERVER` e `UNINSTALL PLUGIN`, portanto, para um servidor que executa muitas instâncias das instruções que causam o armazenamento em cache, o uso de memória armazenada é muito provável que aumente, a menos que seja liberado com `FLUSH PRIVILEGES`.

**ps** e outros programas de status do sistema podem relatar que o **mysqld** usa muita memória. Isso pode ser causado por pilhas de threads em endereços de memória diferentes. Por exemplo, a versão Solaris do **ps** conta a memória não utilizada entre as pilhas como memória usada. Para verificar isso, verifique a troca disponível com `swap -s`. Testamos o **mysqld** com vários detectores de vazamento de memória (tanto comerciais quanto de código aberto), então não deve haver vazamentos de memória.
