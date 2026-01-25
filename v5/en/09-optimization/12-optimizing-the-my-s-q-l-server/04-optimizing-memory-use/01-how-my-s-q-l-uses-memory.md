#### 8.12.4.1 Como o MySQL Usa Memória

O MySQL aloca buffers e caches para melhorar o desempenho das operações de Database. A configuração padrão é projetada para permitir que um servidor MySQL inicie em uma máquina virtual que possua aproximadamente 512MB de RAM. Você pode melhorar o desempenho do MySQL aumentando os valores de certas system variables relacionadas a cache e buffer. Você também pode modificar a configuração padrão para executar o MySQL em sistemas com memória limitada.

A lista a seguir descreve algumas das formas como o MySQL usa memória. Onde aplicável, system variables relevantes são referenciadas. Alguns itens são específicos de Storage Engine ou recurso.

* O `InnoDB` Buffer Pool é uma área de memória que armazena dados `InnoDB` em cache para tabelas, Indexes e outros buffers auxiliares. Para eficiência de operações de leitura de alto volume, o Buffer Pool é dividido em pages que podem potencialmente armazenar múltiplas linhas. Para eficiência do gerenciamento de cache, o Buffer Pool é implementado como uma lista encadeada (linked list) de pages; dados que são raramente usados são removidos do cache (aged out), utilizando uma variação do algoritmo LRU. Para mais informações, veja a Seção 14.5.1, “Buffer Pool”.

  O tamanho do Buffer Pool é importante para o desempenho do sistema:

  + O `InnoDB` aloca memória para todo o Buffer Pool na inicialização do servidor, utilizando operações `malloc()`. A system variable `innodb_buffer_pool_size` define o tamanho do Buffer Pool. Tipicamente, um valor recomendado para `innodb_buffer_pool_size` é de 50 a 75 por cento da memória do sistema. `innodb_buffer_pool_size` pode ser configurado dinamicamente, enquanto o servidor está em execução. Para mais informações, veja a Seção 14.8.3.1, “Configuring InnoDB Buffer Pool Size”.

  + Em sistemas com uma grande quantidade de memória, você pode melhorar a concorrência dividindo o Buffer Pool em múltiplas instâncias de Buffer Pool. A system variable `innodb_buffer_pool_instances` define o número de instâncias de Buffer Pool.

  + Um Buffer Pool que é muito pequeno pode causar excessiva instabilidade (churning) à medida que as pages são liberadas (flushed) do Buffer Pool apenas para serem necessárias novamente pouco tempo depois.

  + Um Buffer Pool que é muito grande pode causar swapping devido à competição por memória.

* Todos os Threads compartilham o key buffer do `MyISAM`. A system variable `key_buffer_size` determina seu tamanho.

  Para cada tabela `MyISAM` que o servidor abre, o arquivo de Index é aberto uma vez; o arquivo de dados é aberto uma vez para cada Thread executando concorrentemente que acessa a tabela. Para cada Thread concorrente, uma estrutura de tabela, estruturas de coluna para cada coluna e um buffer de tamanho `3 * N` são alocados (onde *`N`* é o comprimento máximo da linha, sem contar as colunas `BLOB`). Uma coluna `BLOB` requer de cinco a oito bytes mais o comprimento dos dados `BLOB`. O Storage Engine `MyISAM` mantém um buffer de linha extra para uso interno.

* A system variable `myisam_use_mmap` pode ser definida como 1 para habilitar memory-mapping para todas as tabelas `MyISAM`.

* Se uma tabela temporária interna in-memory se tornar muito grande (conforme determinado pelas system variables `tmp_table_size` e `max_heap_table_size`), o MySQL converte automaticamente a tabela do formato in-memory para o formato em disco (on-disk). As tabelas temporárias em disco usam o Storage Engine definido pela system variable `internal_tmp_disk_storage_engine`. Você pode aumentar o tamanho permissível da tabela temporária conforme descrito na Seção 8.4.4, “Internal Temporary Table Use in MySQL”.

  Para tabelas `MEMORY` criadas explicitamente com `CREATE TABLE`, apenas a system variable `max_heap_table_size` determina o quão grande uma tabela pode crescer, e não há conversão para formato em disco.

* O Performance Schema do MySQL é um recurso para monitorar a execução do servidor MySQL em um nível baixo. O Performance Schema aloca memória dinamicamente de forma incremental, escalando seu uso de memória de acordo com a carga real do servidor, em vez de alocar a memória necessária durante a inicialização do servidor. Uma vez alocada, a memória não é liberada até que o servidor seja reiniciado. Para mais informações, veja a Seção 25.17, “The Performance Schema Memory-Allocation Model”.

* Cada Thread que o servidor usa para gerenciar conexões de clientes requer algum espaço específico do Thread. A lista a seguir indica esses espaços e quais system variables controlam seu tamanho:

  + Uma stack (`thread_stack`)

  + Um connection buffer (`net_buffer_length`)

  + Um result buffer (`net_buffer_length`)

  O connection buffer e o result buffer começam cada um com um tamanho igual a `net_buffer_length` bytes, mas são dinamicamente aumentados até `max_allowed_packet` bytes conforme necessário. O result buffer diminui para `net_buffer_length` bytes após cada instrução SQL. Enquanto uma instrução está em execução, uma cópia da string da instrução atual também é alocada.

  Cada Thread de conexão usa memória para o cálculo de statement digests. O servidor aloca `max_digest_length` bytes por sessão. Veja a Seção 25.10, “Performance Schema Statement Digests”.

* Todos os Threads compartilham a mesma memória base.
* Quando um Thread não é mais necessário, a memória alocada a ele é liberada e retornada ao sistema, a menos que o Thread volte para o thread cache. Nesse caso, a memória permanece alocada.

* Cada requisição que executa um sequential scan de uma tabela aloca um read buffer. A system variable `read_buffer_size` determina o tamanho do buffer.

* Ao ler linhas em uma sequência arbitrária (por exemplo, após um sort), um random-read buffer pode ser alocado para evitar disk seeks. A system variable `read_rnd_buffer_size` determina o tamanho do buffer.

* Todos os Joins são executados em uma única passagem, e a maioria dos Joins pode ser feita sem sequer usar uma tabela temporária. A maioria das tabelas temporárias são hash tables baseadas em memória. Tabelas temporárias com um grande comprimento de linha (calculado como a soma de todos os comprimentos de coluna) ou que contêm colunas `BLOB` são armazenadas em disco.

* A maioria das requisições que executam um sort alocam um sort buffer e zero a dois arquivos temporários, dependendo do tamanho do result set. Veja a Seção B.3.3.5, “Where MySQL Stores Temporary Files”.

* Quase todo o parsing e cálculo é feito em memory pools locais ao Thread e reutilizáveis. Nenhuma sobrecarga de memória é necessária para itens pequenos, evitando assim a lenta alocação e liberação de memória normal. A memória é alocada apenas para strings inesperadamente grandes.

* Para cada tabela que possui colunas `BLOB`, um buffer é dinamicamente aumentado para ler valores `BLOB` maiores. Se você fizer um scan de uma tabela, o buffer cresce até o tamanho do maior valor `BLOB`.

* O MySQL requer memória e descritores para o table cache. Estruturas de Handler para todas as tabelas em uso são salvas no table cache e gerenciadas como “First In, First Out” (FIFO). A system variable `table_open_cache` define o tamanho inicial do table cache; veja a Seção 8.4.3.1, “How MySQL Opens and Closes Tables”.

  O MySQL também requer memória para o table definition cache. A system variable `table_definition_cache` define o número de definições de tabela (a partir de arquivos `.frm`) que podem ser armazenadas no table definition cache. Se você usar um grande número de tabelas, poderá criar um table definition cache grande para acelerar a abertura de tabelas. O table definition cache ocupa menos espaço e não usa descritores de arquivo, ao contrário do table cache.

* Um comando `FLUSH TABLES` ou **mysqladmin flush-tables** fecha todas as tabelas que não estão em uso imediatamente e marca todas as tabelas em uso para serem fechadas quando o Thread em execução atual terminar. Isso libera efetivamente a maior parte da memória em uso. `FLUSH TABLES` não retorna até que todas as tabelas tenham sido fechadas.

* O servidor armazena informações em cache na memória como resultado dos comandos `GRANT`, `CREATE USER`, `CREATE SERVER` e `INSTALL PLUGIN`. Essa memória não é liberada pelos comandos correspondentes `REVOKE`, `DROP USER`, `DROP SERVER` e `UNINSTALL PLUGIN`, portanto, para um servidor que executa muitas instâncias dos comandos que causam caching, é muito provável que o uso de memória em cache aumente, a menos que seja liberado com `FLUSH PRIVILEGES`.

**ps** e outros programas de status do sistema podem relatar que **mysqld** usa muita memória. Isso pode ser causado por thread stacks em diferentes endereços de memória. Por exemplo, a versão Solaris do **ps** conta a memória não utilizada entre stacks como memória utilizada. Para verificar isso, confira o swap disponível com `swap -s`. Testamos **mysqld** com vários detectores de memory-leakage (tanto comerciais quanto Open Source), portanto, não deve haver memory leaks.