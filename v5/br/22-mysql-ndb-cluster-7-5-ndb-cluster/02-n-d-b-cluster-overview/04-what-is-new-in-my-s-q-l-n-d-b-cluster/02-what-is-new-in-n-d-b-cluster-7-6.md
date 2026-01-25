#### 21.2.4.2 O que há de Novo no NDB Cluster 7.6

Novos recursos e outras mudanças importantes no NDB Cluster 7.6 que provavelmente serão de interesse estão listados a seguir:

* **Novo formato de arquivo para tabelas Disk Data.** Um novo formato de arquivo é usado no NDB 7.6 para tabelas NDB Disk Data, o que torna possível que cada tabela Disk Data seja identificada de forma exclusiva sem reutilizar nenhum Table ID. Isso deve ajudar a resolver problemas com o tratamento de page e extent que eram visíveis ao usuário como problemas na criação e exclusão rápida de tabelas Disk Data, e para os quais o formato antigo não fornecia um meio fácil de correção.

  O novo formato agora é usado sempre que novos grupos de arquivo de undo log e arquivos de dados de tablespace são criados. Os arquivos relacionados a tabelas Disk Data existentes continuam a usar o formato antigo até que seus tablespaces e grupos de arquivo de undo log sejam recriados.

  Importante

  Os formatos antigo e novo não são compatíveis; diferentes arquivos de dados ou arquivos de undo log usados pelo mesmo tablespace ou tabela Disk Data não podem usar uma mistura de formatos.

  Para evitar problemas relacionados às mudanças no formato, você deve recriar quaisquer tablespaces e grupos de arquivo de undo log existentes ao fazer o upgrade para o NDB 7.6. Você pode fazer isso realizando um restart inicial de cada Data Node (ou seja, usando a opção [`--initial`](mysql-cluster-programs-ndbd.html#option_ndbd_initial)) como parte do processo de upgrade. Você pode esperar que esta etapa se torne obrigatória como parte do upgrade do NDB 7.5 ou de uma série de versões anterior para o NDB 7.6 ou posterior.

  Se você estiver usando tabelas Disk Data, um downgrade de *qualquer* versão NDB 7.6 — independentemente do status da versão — para qualquer NDB 7.5 ou versão anterior exige que você reinicie todos os Data Nodes com [`--initial`](mysql-cluster-programs-ndbd.html#option_ndbd_initial) como parte do processo de downgrade. Isso ocorre porque o NDB 7.5 e as séries de versões anteriores não são capazes de ler o novo formato de arquivo Disk Data.

  Para mais informações, consulte [Section 21.3.7, “Upgrading and Downgrading NDB Cluster”](mysql-cluster-upgrade-downgrade.html "21.3.7 Upgrading and Downgrading NDB Cluster").

* **Pool de Data memory e Index memory dinâmico.** A memória necessária para Indexes em colunas de tabela `NDB` agora é alocada dinamicamente a partir da memória alocada para [`DataMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datamemory). Por esse motivo, o parâmetro de configuração [`IndexMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-indexmemory) agora está depreciado e sujeito à remoção em uma futura série de versões.

  Importante

  No NDB 7.6, se `IndexMemory` for definido no arquivo `config.ini`, o management server emitirá o aviso `IndexMemory` is deprecated, use `Number bytes on each ndbd(DB) node allocated for storing indexes` instead na inicialização, e qualquer memória atribuída a este parâmetro é automaticamente adicionada ao `DataMemory`.

  Além disso, o valor padrão para `DataMemory` foi aumentado para 98M; o padrão para `IndexMemory` foi diminuído para 0.

  A unificação da Index memory com a Data memory simplifica a configuração do `NDB`; um benefício adicional dessas mudanças é que o aumento da escala através do aumento do número de LDM threads não é mais limitado por ter definido um valor insuficientemente grande para `IndexMemory`. Isso ocorre porque a Index memory não é mais uma quantidade estática que é alocada apenas uma vez (quando o cluster é iniciado), mas agora pode ser alocada e desalocada conforme necessário. Anteriormente, às vezes, o aumento do número de LDM threads podia levar ao esgotamento da Index memory, enquanto grandes quantidades de `DataMemory` permaneciam disponíveis.

  Como parte deste trabalho, várias instâncias de uso de [`DataMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datamemory) não relacionadas diretamente ao armazenamento de dados de tabela agora usam transaction memory.

  Por esse motivo, pode ser necessário em alguns sistemas aumentar [`SharedGlobalMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-sharedglobalmemory) para permitir que a transaction memory aumente quando necessário, como ao usar NDB Cluster Replication, que requer uma grande quantidade de Buffer nos Data Nodes. Em sistemas que realizam Initial Bulk Loads de dados, pode ser necessário dividir transações muito grandes em partes menores.

  Além disso, os Data Nodes agora geram eventos `MemoryUsage` (consulte [Section 21.6.3.2, “NDB Cluster Log Events”](mysql-cluster-log-events.html "21.6.3.2 NDB Cluster Log Events")) e escrevem mensagens apropriadas no Cluster Log quando o uso de recursos atinge 99%, bem como quando atinge 80%, 90% ou 100%, como antes.

  Outras mudanças relacionadas estão listadas aqui:

  + `IndexMemory` não é mais um dos valores exibidos na coluna `memory_type` da tabela [`ndbinfo.memoryusage`](mysql-cluster-ndbinfo-memoryusage.html "21.6.15.26 The ndbinfo memoryusage Table"); também não é mais exibido na saída de [**ndb_config**](mysql-cluster-programs-ndb-config.html "21.5.7 ndb_config — Extract NDB Cluster Configuration Information").

  + [`REPORT MEMORYUSAGE`](mysql-cluster-mgm-client-commands.html#ndbclient-report) e outros comandos que expõem o consumo de memória agora mostram o consumo de Index memory usando páginas de 32K (anteriormente eram páginas de 8K).

  + A tabela [`ndbinfo.resources`](mysql-cluster-ndbinfo-resources.html "21.6.15.31 The ndbinfo resources Table") agora mostra o recurso `DISK_OPERATIONS` como `TRANSACTION_MEMORY`, e o recurso `RESERVED` foi removido.

* **Tabelas processes e config_nodes do ndbinfo.** O NDB 7.6 adiciona duas tabelas ao Database de informações [`ndbinfo`](mysql-cluster-ndbinfo.html "21.6.15 ndbinfo: The NDB Cluster Information Database") para fornecer informações sobre os nós do Cluster; essas tabelas estão listadas aqui:

  + [`config_nodes`](mysql-cluster-ndbinfo-config-nodes.html "21.6.15.7 The ndbinfo config_nodes Table"): Esta tabela lista o Node ID, o tipo de processo e o Host Name para cada nó listado no arquivo de configuração de um Cluster NDB.

  + A tabela [`processes`](mysql-cluster-ndbinfo-processes.html "21.6.15.30 The ndbinfo processes Table") mostra informações sobre os nós atualmente conectados ao Cluster; essas informações incluem o nome do processo e o System Process ID; para cada Data Node e SQL Node, também mostra o Process ID do Angel Process do nó. Além disso, a tabela mostra um Service Address para cada nó conectado; este endereço pode ser definido em aplicativos NDB API usando o método [`Ndb_cluster_connection::set_service_uri()`](/doc/ndbapi/en/ndb-ndb-cluster-connection.html#ndb-ndb-cluster-connection-set-service-uri), que também é adicionado no NDB 7.6.

* **Nome do Sistema.** O System Name de um Cluster NDB pode ser usado para identificar um Cluster específico. No NDB 7.6, o MySQL Server mostra este nome como o valor da variável de status [`Ndb_system_name`](mysql-cluster-options-variables.html#statvar_Ndb_system_name); aplicativos NDB API podem usar o método [`Ndb_cluster_connection::get_system_name()`](/doc/ndbapi/en/ndb-ndb-cluster-connection.html#ndb-ndb-cluster-connection-get-system-name) que é adicionado na mesma versão.

  Um System Name baseado no horário em que o Management Server foi iniciado é gerado automaticamente; você pode sobrescrever este valor adicionando uma seção `[system]` ao arquivo de configuração do Cluster e definindo o parâmetro `Name` para um valor de sua escolha nesta seção, antes de iniciar o Management Server.

* **Ferramenta de importação CSV ndb_import.** [**ndb_import**](mysql-cluster-programs-ndb-import.html "21.5.14 ndb_import — Import CSV Data Into NDB"), adicionado no NDB Cluster 7.6, carrega dados formatados em CSV diretamente em uma tabela [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") usando a NDB API (um MySQL Server é necessário apenas para criar a tabela e o Database onde ela está localizada). [**ndb_import**](mysql-cluster-programs-ndb-import.html "21.5.14 ndb_import — Import CSV Data Into NDB") pode ser considerado um análogo de [**mysqlimport**](mysqlimport.html "4.5.5 mysqlimport — A Data Import Program") ou da instrução SQL [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement"), e suporta muitas das mesmas opções ou opções semelhantes para formatação dos dados.

  Assumindo que o Database e a tabela `NDB` de destino existam, [**ndb_import**](mysql-cluster-programs-ndb-import.html "21.5.14 ndb_import — Import CSV Data Into NDB") precisa apenas de uma conexão com o Management Server do Cluster ([**ndb_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon")) para realizar a importação; por esse motivo, deve haver um slot `[api]` disponível para a ferramenta no arquivo `config.ini` do Cluster.

  Consulte [Section 21.5.14, “ndb_import — Import CSV Data Into NDB”](mysql-cluster-programs-ndb-import.html "21.5.14 ndb_import — Import CSV Data Into NDB"), para mais informações.

* **Ferramenta de monitoramento ndb_top.** Adicionada a utilidade [**ndb_top**](mysql-cluster-programs-ndb-top.html "21.5.29 ndb_top — View CPU usage information for NDB threads"), que mostra a carga de CPU e informações de uso para um Data Node `NDB` em tempo real. Esta informação pode ser exibida em formato de texto, como um gráfico ASCII, ou ambos. O gráfico pode ser mostrado em cores ou usando tons de cinza.

  [**ndb_top**](mysql-cluster-programs-ndb-top.html "21.5.29 ndb_top — View CPU usage information for NDB threads") se conecta a um SQL Node do NDB Cluster (ou seja, um MySQL Server). Por esse motivo, o programa deve ser capaz de se conectar como um usuário MySQL que tenha o privilégio [`SELECT`](privileges-provided.html#priv_select) nas tabelas no Database [`ndbinfo`](mysql-cluster-ndbinfo.html "21.6.15 ndbinfo: The NDB Cluster Information Database").

  [**ndb_top**](mysql-cluster-programs-ndb-top.html "21.5.29 ndb_top — View CPU usage information for NDB threads") está disponível para plataformas Linux, Solaris e macOS, mas atualmente não está disponível para plataformas Windows.

  Para mais informações, consulte [Section 21.5.29, “ndb_top — View CPU usage information for NDB threads”](mysql-cluster-programs-ndb-top.html "21.5.29 ndb_top — View CPU usage information for NDB threads").

* **Limpeza de Código.** Um número significativo de instruções e saídas de debugging desnecessárias para operações normais foram movidas para códigos usados apenas durante o teste ou debugging do `NDB`, ou eliminadas completamente. Esta remoção de overhead deve resultar em uma melhoria notável no desempenho das LDM e TC threads na ordem de 10% em muitos casos.

* **Melhorias no LDM thread e no LCP.** Anteriormente, quando um LDM (Local Data Management) thread experimentava I/O lag, ele escrevia Checkpoints Locais (LCPs) mais lentamente. Isso podia acontecer, por exemplo, durante uma condição de sobrecarga de disco. Podiam ocorrer problemas porque outros LDM threads nem sempre observavam esse estado ou faziam o mesmo. O `NDB` agora rastreia o modo I/O lag globalmente, de modo que este estado é relatado assim que pelo menos uma Thread está escrevendo no modo I/O lag; ele então garante que a velocidade de escrita reduzida para este LCP seja imposta a todos os LDM threads durante a condição de lentidão. Como a redução na velocidade de escrita agora é observada por outras instâncias LDM, a capacidade geral é aumentada; isso permite que a sobrecarga de disco (ou outra condição que induz o I/O lag) seja superada mais rapidamente nesses casos do que era anteriormente.

* **Identificação de erros NDB.** Mensagens e informações de erro podem ser obtidas usando o cliente [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") no NDB 7.6 a partir de uma nova tabela [`error_messages`](mysql-cluster-ndbinfo-error-messages.html "21.6.15.21 The ndbinfo error_messages Table") no Database de informações [`ndbinfo`](mysql-cluster-ndbinfo.html "21.6.15 ndbinfo: The NDB Cluster Information Database"). Além disso, o NDB 7.6 introduz um novo cliente de linha de comando [**ndb_perror**](mysql-cluster-programs-ndb-perror.html "21.5.17 ndb_perror — Obtain NDB Error Message Information") para obter informações de códigos de erro NDB; isso substitui o uso de [**perror**](perror.html "4.8.2 perror — Display MySQL Error Message Information") com [`--ndb`](perror.html#option_perror_ndb), que agora está depreciado e sujeito à remoção em uma versão futura.

  Para mais informações, consulte [Section 21.6.15.21, “The ndbinfo error_messages Table”](mysql-cluster-ndbinfo-error-messages.html "21.6.15.21 The ndbinfo error_messages Table"), e [Section 21.5.17, “ndb_perror — Obtain NDB Error Message Information”](mysql-cluster-programs-ndb-perror.html "21.5.17 ndb_perror — Obtain NDB Error Message Information").

* **Melhorias no SPJ.** Ao executar um Scan como um Pushed Join (ou seja, a raiz da Query é um Scan), o bloco [`DBTC`](/doc/ndb-internals/en/ndb-internals-kernel-blocks-dbtc.html) envia uma requisição SPJ para uma instância [`DBSPJ`](/doc/ndb-internals/en/ndb-internals-kernel-blocks-dbspj.html) no mesmo nó que o fragment a ser escaneado. Anteriormente, uma dessas requisições era enviada para cada um dos fragments do nó. Como o número de instâncias `DBTC` e `DBSPJ` é normalmente definido como inferior ao número de instâncias LDM, isso significa que todas as instâncias SPJ estavam envolvidas na execução de uma única Query e, de fato, algumas instâncias SPJ podiam (e recebiam) múltiplas requisições da mesma Query. O NDB 7.6 possibilita que uma única requisição SPJ manipule um conjunto de Root Fragments a serem escaneados, de modo que apenas uma única requisição SPJ (`SCAN_FRAGREQ`) precise ser enviada para qualquer instância SPJ (`DBSPJ` block) em cada nó.

  Como o `DBSPJ` consome uma quantidade relativamente pequena da CPU total usada ao avaliar um Pushed Join, ao contrário do bloco LDM (que é responsável pela maioria do uso da CPU), introduzir múltiplos blocos SPJ adiciona algum paralelismo, mas o overhead adicional também aumenta. Ao permitir que uma única requisição SPJ manipule um conjunto de Root Fragments a serem escaneados, de modo que apenas uma única requisição SPJ seja enviada para cada instância `DBSPJ` em cada nó e os tamanhos de Batch sejam alocados por fragment, o Scan de múltiplos fragments pode obter um Batch Size total maior, permitindo que algumas otimizações de agendamento sejam feitas dentro do bloco SPJ, que pode escanear um único fragment por vez (dando-lhe a alocação total do Batch Size), escanear todos os fragments em paralelo usando Sub-Batches menores, ou alguma combinação dos dois.

  Espera-se que este trabalho aumente o desempenho dos Pushed-Down Joins pelos seguintes motivos:

  + Como múltiplos Root Fragments podem ser escaneados para cada requisição SPJ, é necessário solicitar menos instâncias SPJ ao executar um Pushed Join.

  + O aumento da alocação disponível do Batch Size, e para cada fragment, também deve, na maioria dos casos, resultar em menos requisições necessárias para completar um Join.

* **Tratamento melhorado de O_DIRECT para redo logs.** O NDB 7.6 fornece um novo parâmetro de configuração de Data Node [`ODirectSyncFlag`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-odirectsyncflag) que faz com que as escritas completas do Redo Log usando `O_DIRECT` sejam tratadas como chamadas `fsync`. `ODirectSyncFlag` é desabilitado por padrão; para habilitá-lo, defina-o como `true`.

  Você deve ter em mente que a configuração para este parâmetro é ignorada quando pelo menos uma das seguintes condições é verdadeira:

  + [`ODirect`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-odirect) não está habilitado.

  + `InitFragmentLogFiles` está definido como `SPARSE`.

* **Atribuição de CPUs a threads de Index build offline.** No NDB 7.6, as construções de Index offline por padrão usam todos os Cores disponíveis para [**ndbmtd**](mysql-cluster-programs-ndbmtd.html "21.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)"), em vez de serem limitadas ao único Core reservado para o I/O Thread. Também se torna possível especificar um conjunto desejado de Cores a serem usados para I/O threads que realizam construções multithreaded offline de Ordered Indexes. Isso pode melhorar os tempos de restart e restore e o desempenho, bem como a disponibilidade.

  Note

  "Offline", conforme usado aqui, refere-se a uma construção de Ordered Index que ocorre enquanto uma determinada tabela não está sendo escrita. Tais construções de Index ocorrem durante um restart de nó ou sistema, ou ao restaurar um Cluster a partir de Backup usando [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") [`--rebuild-indexes`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_rebuild-indexes).

  Esta melhoria envolve várias mudanças relacionadas. A primeira delas é mudar o valor padrão para o parâmetro de configuração [`BuildIndexThreads`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-buildindexthreads) (de 0 para 128), o que significa que as construções de Ordered Index offline agora são multithreaded por padrão. O valor padrão para [`TwoPassInitialNodeRestartCopy`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-twopassinitialnoderestartcopy) também é alterado (de `false` para `true`), de modo que um restart inicial do nó primeiro copia todos os dados sem qualquer criação de Indexes de um nó "live" para o nó que está sendo iniciado, constrói os Ordered Indexes offline depois que os dados foram copiados e, em seguida, sincroniza novamente com o nó "live"; isso pode reduzir significativamente o tempo necessário para construir Indexes. Além disso, para facilitar a atribuição explícita de threads de Index build offline a CPUs específicas, um novo tipo de Thread (`idxbld`) é definido para o parâmetro de configuração [`ThreadConfig`](mysql-cluster-ndbd-definition.html#ndbparam-ndbmtd-threadconfig).

  Como parte deste trabalho, o `NDB` agora pode distinguir entre tipos de Execution Thread e outros tipos de threads, e entre tipos de threads que são permanentemente atribuídos a tarefas específicas e aqueles cujas atribuições são apenas temporárias.

  O NDB 7.6 também introduz o parâmetro `nosend` para [`ThreadCOnfig`](mysql-cluster-ndbd-definition.html#ndbparam-ndbmtd-threadconfig). Ao defini-lo como 1, você pode impedir que um thread `main`, `ldm`, `rep` ou `tc` ajude os Send Threads. Este parâmetro é 0 por padrão e não pode ser usado com I/O threads, Send Threads, Index Build Threads ou Watchdog Threads.

  Para informações adicionais, consulte as descrições dos parâmetros.

* **Tamanhos de Batch variáveis para operações DDL de dados em massa.** Como parte do trabalho em andamento para otimizar o desempenho de DDL em massa por [**ndbmtd**](mysql-cluster-programs-ndbmtd.html "21.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)"), agora é possível obter melhorias de desempenho aumentando o Batch Size para as partes de dados em massa de operações DDL que processam dados usando Scans. Os tamanhos de Batch agora podem ser configurados para Unique Index builds, Foreign Key builds e Online Reorganization, definindo os respectivos parâmetros de configuração de Data Node listados aqui:

  + [`MaxUIBuildBatchSize`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxuibuildbatchsize): Tamanho máximo do Scan Batch usado para construir Unique Keys.

  + [`MaxFKBuildBatchSize`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxfkbuildbatchsize): Tamanho máximo do Scan Batch usado para construir Foreign Keys.

  + [`MaxReorgBuildBatchSize`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxreorgbuildbatchsize): Tamanho máximo do Scan Batch usado para Reorganization de partições de tabela.

  Para cada um dos parâmetros listados, o valor padrão é 64, o mínimo é 16 e o máximo é 512.

  Aumentar o Batch Size ou os Batch Sizes apropriados pode ajudar a amortizar latências entre threads e entre nós e usar mais recursos paralelos (locais e remotos) para ajudar a dimensionar o desempenho do DDL. Em cada caso, pode haver um trade-off com o tráfego em andamento.

* **LCPs Parciais.** O NDB 7.6 implementa Checkpoints Locais (LCPs) parciais. Anteriormente, um LCP sempre fazia uma cópia de todo o Database. Ao trabalhar com Terabytes de dados, esse processo podia exigir muito tempo, com um impacto adverso nos restarts de nó e Cluster especialmente, bem como mais espaço para os Redo Logs. Agora não é mais estritamente necessário que os LCPs façam isso — em vez disso, um LCP agora, por padrão, salva apenas um número de registros que se baseia na quantidade de dados alterados desde o LCP anterior. Isso pode variar entre um Checkpoint completo e um Checkpoint que não muda nada. Caso o Checkpoint reflita quaisquer alterações, o mínimo é escrever uma parte dos 2048 que compõem um LCP local.

  Como parte desta mudança, dois novos parâmetros de configuração de Data Node são introduzidos nesta versão: [`EnablePartialLcp`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-enablepartiallcp) (padrão `true`, ou habilitado) habilita LCPs parciais. [`RecoveryWork`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-recoverywork) controla a porcentagem de espaço dedicada aos LCPs; ele aumenta com a quantidade de trabalho que deve ser realizado nos LCPs durante os restarts, em oposição ao que é realizado durante as operações normais. Aumentar este valor faz com que os LCPs durante as operações normais exijam a escrita de menos registros e, assim, diminui a workload usual. Aumentar este valor também significa que os restarts podem levar mais tempo.

  Você deve desabilitar LCPs parciais explicitamente definindo `EnablePartialLcp=false`. Isso usa a menor quantidade de disco, mas também tende a maximizar a Write Load para LCPs. Para otimizar para a menor Workload nos LCPs durante a operação normal, use `EnablePartialLcp=true` e `RecoveryWork=100`. Para usar o menor espaço em disco para LCPs parciais, mas com escritas limitadas, use `EnablePartialLcp=true` e `RecoveryWork=25`, que é o mínimo para `RecoveryWork`. O padrão é `EnablePartialLcp=true` com `RecoveryWork=50`, o que significa que os arquivos LCP exigem aproximadamente 1,5 vezes [`DataMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datamemory); usando [`CompressedLcp=1`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-compressedlcp), isso pode ser ainda mais reduzido pela metade. Os tempos de Recovery usando as configurações padrão também devem ser muito mais rápidos do que quando `EnablePartialLcp` está definido como `false`.

  Note

  O valor padrão para `RecoveryWork` foi aumentado de 50 para 60.

  Além disso, os parâmetros de configuração de Data Node [`BackupDataBufferSize`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-backupdatabuffersize), [`BackupWriteSize`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-backupwritesize) e [`BackupMaxWriteSize`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-backupmaxwritesize) estão todos depreciados e sujeitos à remoção em uma futura versão do MySQL NDB Cluster.

  Como parte deste aprimoramento, foi realizado um trabalho para corrigir vários problemas com restarts de nó em que era possível ficar sem Undo Log em várias situações, o mais comum ao restaurar um nó que ficou inativo por muito tempo durante um período de atividade de escrita intensiva.

  Trabalho adicional foi feito para melhorar a sobrevivência do Data Node a longos períodos de sincronização sem Timeout, atualizando o LCP Watchdog durante este processo e acompanhando melhor o progresso da sincronização de dados de disco. Anteriormente, havia a possibilidade de avisos espúrios ou até mesmo falhas de nó se a sincronização demorasse mais do que o Timeout do LCP Watchdog.

  Importante

  Ao atualizar um NDB Cluster que usa tabelas Disk Data para NDB 7.6 ou fazer o downgrade dele do NDB 7.6, é necessário reiniciar todos os Data Nodes com [`--initial`](mysql-cluster-programs-ndbd.html#option_ndbd_initial).

* **Processamento paralelo de registros de undo log.** Anteriormente, o bloco de kernel [`LGMAN`](/doc/ndb-internals/en/ndb-internals-kernel-blocks-lgman.html) do Data Node processava registros de Undo Log serialmente; agora isso é feito em paralelo. O Rep Thread, que entrega registros de Undo para LDM threads, esperava que um LDM terminasse de aplicar um registro antes de buscar o próximo; agora o Rep Thread não espera mais, mas procede imediatamente para o próximo registro e LDM.

  Uma contagem do número de registros de Log pendentes para cada LDM em `LGMAN` é mantida e decrementada sempre que um LDM conclui a execução de um registro. Todos os registros pertencentes a uma Page são enviados para o mesmo LDM Thread, mas não é garantido que sejam processados em ordem, então um Hash Map de Pages que têm registros pendentes mantém uma fila para cada uma dessas Pages. Quando a Page está disponível no Page Cache, todos os registros pendentes na fila são aplicados em ordem.

  Alguns tipos de registros continuam a ser processados serialmente: `UNDO_LCP`, `UNDO_LCP_FIRST`, `UNDO_LOCAL_LCP`, `UNDO_LOCAL_LCP_FIRST`, `UNDO_DROP` e `UNDO_END`.

  Não há mudanças de funcionalidade visíveis para o usuário diretamente associadas a este aprimoramento de desempenho; faz parte do trabalho realizado para melhorar o tratamento de Undo Log em suporte a LCPs parciais no NDB Cluster 7.6.

* **Leitura de Table e Fragment IDs a partir do extent para o aplicador de undo log.** Ao aplicar um Undo Log, é necessário obter o Table ID e o Fragment ID a partir do Page ID. Isso era feito anteriormente lendo a Page do bloco de kernel [`PGMAN`](/doc/ndb-internals/en/ndb-internals-kernel-blocks-pgman.html) usando um I/O Thread de `PGMAN` extra, mas ao aplicar o Undo Log era necessário ler a Page novamente.

  Ao usar `O_DIRECT`, isso era muito ineficiente, pois a Page não estava em Cache no Kernel do Sistema Operacional. Para corrigir este problema, o mapeamento de Page ID para Table ID e Fragment ID agora é feito usando informações do cabeçalho do Extent, o Table ID e os Fragment IDs para as Pages usadas dentro de um determinado Extent. As Extent Pages estão sempre presentes no Page Cache, então nenhuma leitura extra do disco é necessária para realizar o mapeamento. Além disso, a informação já pode ser lida, usando estruturas de dados de bloco de kernel [`TSMAN`](/doc/ndb-internals/en/ndb-internals-kernel-blocks-tsman.html) existentes.

  Consulte a descrição do parâmetro de configuração de Data Node [`ODirect`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-odirect), para mais informações.

* **Transporter de Shared memory.** Conexões de Shared Memory (SHM) definidas pelo usuário entre um Data Node e um API Node no mesmo Host Computer são totalmente suportadas no NDB 7.6 e não são mais consideradas experimentais. Você pode habilitar uma conexão explícita de Shared Memory definindo o parâmetro de configuração [`UseShm`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-useshm) para `1` para o Data Node relevante. Ao definir explicitamente a Shared Memory como o método de conexão, também é necessário que tanto o Data Node quanto o API Node sejam identificados por `HostName`.

  O desempenho das conexões SHM pode ser aprimorado através da definição de parâmetros como [`ShmSize`](mysql-cluster-shm-definition.html#ndbparam-shm-shmsize), [`ShmSpintime`](mysql-cluster-shm-definition.html#ndbparam-shm-shmspintime) e [`SendBufferMemory`](mysql-cluster-shm-definition.html#ndbparam-shm-sendbuffermemory) em uma seção `[shm]` ou `[shm default]` do arquivo de configuração do Cluster (`config.ini`). A configuração do SHM é, de outra forma, semelhante à do TCP Transporter.

  O parâmetro [`SigNum`](mysql-cluster-shm-definition.html#ndbparam-shm-signum) não é usado na nova implementação SHM, e quaisquer configurações feitas para ele agora são ignoradas. [Section 21.4.3.12, “NDB Cluster Shared Memory Connections”](mysql-cluster-shm-definition.html "21.4.3.12 NDB Cluster Shared Memory Connections"), fornece mais informações sobre esses parâmetros. Além disso, como parte deste trabalho, o código `NDB` relacionado ao antigo SCI Transporter foi removido.

  Para mais informações, consulte [Section 21.4.3.12, “NDB Cluster Shared Memory Connections”](mysql-cluster-shm-definition.html "21.4.3.12 NDB Cluster Shared Memory Connections").

* **Otimização de Inner Join no SPJ block.** No NDB 7.6, o bloco de kernel [`SPJ`](/doc/ndb-internals/en/ndb-internals-kernel-blocks-dbspj.html) pode levar em consideração quando está avaliando uma requisição de Join na qual pelo menos algumas das tabelas são INNER-joined. Isso significa que ele pode eliminar requisições para Row, Ranges, ou ambos, assim que se torna conhecido que uma ou mais das requisições anteriores não retornaram nenhum resultado para uma Parent Row. Isso economiza tanto para os Data Nodes quanto para o bloco `SPJ` o trabalho de ter que lidar com requisições e Rows de resultado que nunca participam de uma Row de resultado INNER-joined.

  Considere esta Join Query, onde `pk` é a Primary Key nas tabelas t2, t3 e t4, e as colunas x, y e z são colunas não Indexadas:

  ```sql
  SELECT * FROM t1
    JOIN t2 ON t2.pk = t1.x
    JOIN t3 ON t3.pk = t1.y
    JOIN t4 ON t4.pk = t1.z;
  ```

  Anteriormente, isso resultava em uma requisição `SPJ` incluindo um Scan na tabela `t1` e Lookups em cada uma das tabelas `t2`, `t3` e `t4`; estes eram avaliados para cada Row retornada de `t1`. Para estes, o `SPJ` criava requisições `LQHKEYREQ` para as tabelas `t2`, `t3` e `t4`. Agora o `SPJ` leva em consideração o requisito de que, para produzir quaisquer Rows de resultado, um Inner Join deve encontrar uma correspondência em todas as tabelas unidas; assim que nenhuma correspondência é encontrada para uma das tabelas, quaisquer requisições adicionais para tabelas que tenham o mesmo Parent ou tabelas são agora ignoradas.

  Note

  Esta otimização não pode ser aplicada até que todos os Data Nodes e todos os API Nodes no Cluster tenham sido atualizados para o NDB 7.6.

* **NDB wakeup thread.** O `NDB` usa um Poll Receiver para ler de Sockets, para executar mensagens dos Sockets e para acordar (Wake Up) outros threads. Ao usar apenas intermitentemente um Receive Thread, a propriedade do Poll é cedida antes de começar a acordar outros threads, o que fornece algum grau de paralelismo no Receive Thread, mas, ao usar constantemente o Receive Thread, o thread pode ser sobrecarregado por tarefas, incluindo o Wake Up de outros threads.

  O NDB 7.6 suporta o offloading da tarefa de Wake Up de outros threads do Receive Thread para um novo Thread que acorda outros threads mediante solicitação (e, caso contrário, simplesmente dorme), tornando possível melhorar a capacidade de uma única conexão de Cluster em cerca de dez a vinte por cento.

* **Controle adaptativo de LCP.**

  O NDB 7.6.7 implementa um mecanismo de controle adaptativo de LCP que age em resposta a mudanças no uso do espaço de Redo Log. Ao controlar a velocidade de escrita em disco do LCP, você pode ajudar a proteger contra uma série de problemas relacionados a recursos, incluindo o seguinte:

  + Recursos de CPU insuficientes para aplicativos de tráfego
  + Sobrecarga de disco
  + Redo Log Buffer insuficiente
  + Condições de GCP Stop
  + Espaço de Redo Log insuficiente
  + Espaço de Undo Log insuficiente

  Este trabalho inclui as seguintes mudanças relacionadas aos parâmetros de configuração [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"):

  + O valor padrão do parâmetro de Data Node [`RecoveryWork`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-recoverywork) é aumentado de 50 para 60; ou seja, o `NDB` agora usa 1,6 vezes o tamanho dos dados para armazenamento de LCPs.

  + Um novo parâmetro de configuração de Data Node [`InsertRecoveryWork`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-insertrecoverywork) fornece recursos de ajuste adicionais, controlando a porcentagem de `RecoveryWork` que é reservada para operações de Insert. O valor padrão é 40 (ou seja, 40% do espaço de armazenamento já reservado por `RecoveryWork`); o mínimo e o máximo são 0 e 70, respectivamente. Aumentar este valor permite que mais escritas sejam realizadas durante um LCP, enquanto limita o tamanho total do LCP. Diminuir `InsertRecoveryWork` limita o número de escritas usadas durante um LCP, mas resulta em mais espaço sendo usado para o LCP, o que significa que o Recovery leva mais tempo.

  Este trabalho implementa o controle da velocidade do LCP principalmente para minimizar o risco de ficar sem Redo Log. Isso é feito de forma adaptativa, com base na quantidade de espaço de Redo Log usado, usando os níveis de alerta, com as respostas tomadas quando esses níveis são atingidos, mostradas aqui:

  + **Low (Baixo)**: O uso do espaço de Redo Log é superior a 25%, ou o uso estimado mostra espaço de Redo Log insuficiente em uma taxa de transação muito alta. Em resposta, o uso de LCP Data Buffers é aumentado durante os LCP Scans, a prioridade dos LCP Scans é aumentada e a quantidade de dados que pode ser escrita por Real-Time Break em um LCP Scan também é aumentada.

  + **High (Alto)**: O uso do espaço de Redo Log é superior a 40%, ou a estimativa é de que o espaço de Redo Log acabe em uma alta taxa de transação. Quando este nível de uso é atingido, [`MaxDiskWriteSpeed`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxdiskwritespeed) é aumentado para o valor de [`MaxDiskWriteSpeedOtherNodeRestart`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxdiskwritespeedothernoderestart). Além disso, a velocidade mínima é dobrada, e a prioridade dos LCP Scans e o que pode ser escrito por Real-Time Break são ambos aumentados ainda mais.

  + **Critical (Crítico)**: O uso do espaço de Redo Log é superior a 60%, ou o uso estimado mostra espaço de Redo Log insuficiente em uma taxa de transação normal. Neste nível, `MaxDiskWriteSpeed` é aumentado para o valor de [`MaxDiskWriteSpeedOwnRestart`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxdiskwritespeedownrestart); [`MinDiskWriteSpeed`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-mindiskwritespeed) também é definido para este valor. A prioridade dos LCP Scans e a quantidade de dados que podem ser escritos por Real-Time Break são aumentadas ainda mais, e o LCP Data Buffer está totalmente disponível durante o LCP Scan.

  Aumentar o nível também tem o efeito de aumentar a velocidade de Checkpoint de destino calculada.

  O controle LCP tem os seguintes benefícios para instalações `NDB`:

  + Os Clusters devem agora sobreviver a cargas muito pesadas usando configurações padrão muito melhor do que anteriormente.

  + Agora deve ser possível para o `NDB` rodar de forma confiável em sistemas onde o espaço em disco disponível é (em um mínimo aproximado) 2,1 vezes a quantidade de memória alocada a ele ([`DataMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datamemory)). Você deve notar que este número *não* inclui qualquer espaço em disco usado para tabelas Disk Data.

* **Opções do ndb_restore.** A partir do NDB 7.6.9, as opções [`--nodeid`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_nodeid) e [`--backupid`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_backupid) são ambas necessárias ao invocar [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup").

* **Restauração por fatias (slices).** A partir do NDB 7.6.13, é possível dividir um Backup em porções aproximadamente iguais (slices) e restaurar essas slices em paralelo usando duas novas opções implementadas para [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup"):

  + [`--num-slices`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_num-slices) determina o número de slices em que o Backup deve ser dividido.

  + [`--slice-id`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_slice-id) fornece o ID da Slice a ser restaurada pela instância atual de [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup").

  Isso torna possível empregar múltiplas instâncias de [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") para restaurar subconjuntos do Backup em paralelo, potencialmente reduzindo a quantidade de tempo necessária para realizar a operação de Restore.

  Para mais informações, consulte a descrição da opção [`--num-slices`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_num-slices) de [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup").

* **ndb_restore: mudanças de Schema na Primary Key.** O NDB 7.6.14 (e posterior) suporta diferentes definições de Primary Key para tabelas de origem e de destino ao restaurar um Backup nativo `NDB` com [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") quando executado com a opção [`--allow-pk-changes`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_allow-pk-changes). Tanto o aumento quanto a diminuição do número de colunas que compõem a Primary Key original são suportados.

  Quando a Primary Key é estendida com uma ou mais colunas adicionais, quaisquer colunas adicionadas devem ser definidas como `NOT NULL`, e nenhum valor em tais colunas pode ser alterado durante o tempo em que o Backup está sendo feito. Como alguns aplicativos definem todos os valores de coluna em uma Row ao atualizá-la, quer todos os valores sejam realmente alterados ou não, isso pode fazer com que uma operação de Restore falhe, mesmo que nenhum valor na coluna a ser adicionada à Primary Key tenha sido alterado. Você pode anular este comportamento usando a opção [`--ignore-extended-pk-updates`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_ignore-extended-pk-updates), também adicionada no NDB 7.6.14; neste caso, você deve garantir que tais valores não sejam alterados.

  Uma coluna pode ser removida da Primary Key da tabela, quer esta coluna permaneça ou não como parte da tabela.

  Para mais informações, consulte a descrição da opção [`--allow-pk-changes`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_allow-pk-changes) para [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup").

* **Melhorias no ndb_blob_tool.** A partir do NDB 7.6.14, a utilidade [**ndb_blob_tool**](mysql-cluster-programs-ndb-blob-tool.html "21.5.6 ndb_blob_tool — Check and Repair BLOB and TEXT columns of NDB Cluster Tables") pode detectar partes de Blob ausentes para as quais existem partes Inline e substituí-las por Placeholder Blob Parts (consistindo em espaços) do comprimento correto. Para verificar se há partes de Blob ausentes, use a opção [`--check-missing`](mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_check-missing) com este programa. Para substituir quaisquer partes de Blob ausentes por Placeholders, use a opção [`--add-missing`](mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_add-missing).

  Para mais informações, consulte [Section 21.5.6, “ndb_blob_tool — Check and Repair BLOB and TEXT columns of NDB Cluster Tables”](mysql-cluster-programs-ndb-blob-tool.html "21.5.6 ndb_blob_tool — Check and Repair BLOB and TEXT columns of NDB Cluster Tables").

* **Fusão de Backups com ndb_restore.** Em alguns casos, pode ser desejável consolidar dados originalmente armazenados em diferentes instâncias do NDB Cluster (todos usando o mesmo Schema) em um único NDB Cluster de destino. Isso agora é suportado ao usar Backups criados no cliente [**ndb_mgm**](mysql-cluster-programs-ndb-mgm.html "21.5.5 ndb_mgm — The NDB Cluster Management Client") (consulte [Section 21.6.8.2, “Using The NDB Cluster Management Client to Create a Backup”](mysql-cluster-backup-using-management-client.html "21.6.8.2 Using The NDB Cluster Management Client to Create a Backup")) e restaurá-los com [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup"), usando a opção [`--remap-column`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_remap-column) adicionada no NDB 7.6.14 juntamente com [`--restore-data`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_restore-data) (e possivelmente opções compatíveis adicionais conforme necessário ou desejado). `--remap-column` pode ser empregado para lidar com casos em que os valores de Primary e Unique Key se sobrepõem entre Clusters de origem, e é necessário que eles não se sobreponham no Cluster de destino, bem como para preservar outras relações entre tabelas, como Foreign Keys.

  [`--remap-column`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_remap-column) recebe como argumento uma string com o formato `db.tbl.col:fn:args`, onde *`db`*, *`tbl`* e *`col`* são, respectivamente, os nomes do Database, tabela e coluna, *`fn`* é o nome de uma função de remapeamento e *`args`* é um ou mais argumentos para *`fn`*. Não há valor padrão. Apenas `offset` é suportado como nome de função, com *`args`* como o Offset de Integer a ser aplicado ao valor da coluna ao inseri-lo na tabela de destino a partir do Backup. Esta coluna deve ser um [`INT`](integer-types.html "11.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") ou [`BIGINT`](integer-types.html "11.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"); o intervalo permitido do valor do Offset é o mesmo que a versão Signed desse tipo (o que permite que o Offset seja negativo, se desejado).

  A nova opção pode ser usada múltiplas vezes na mesma invocação de [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup"), para que você possa remapear para novos valores múltiplas colunas da mesma tabela, de tabelas diferentes, ou de ambas. O valor do Offset não precisa ser o mesmo para todas as instâncias da opção.

  Além disso, duas novas opções são fornecidas para [**ndb_desc**](mysql-cluster-programs-ndb-desc.html "21.5.10 ndb_desc — Describe NDB Tables"), também a partir do NDB 7.6.14:

  + [`--auto-inc`](mysql-cluster-programs-ndb-desc.html#option_ndb_desc_auto-inc) (forma abreviada `-a`): Inclui o próximo valor Auto-Increment na saída, se a tabela tiver uma coluna `AUTO_INCREMENT`.

  + [`--context`](mysql-cluster-programs-ndb-desc.html#option_ndb_desc_context) (forma abreviada `-x`): Fornece informações extras sobre a tabela, incluindo o Schema, o nome do Database, o nome da tabela e o ID interno.

  Para mais informações e exemplos, consulte a descrição da opção [`--remap-column`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_remap-column).

* **Opção --ndb-log-fail-terminate.** A partir do NDB 7.6.14, você pode fazer com que o SQL Node seja encerrado sempre que não conseguir registrar todos os Row Events completamente. Isso pode ser feito iniciando [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") com a opção [`--ndb-log-fail-terminate`](mysql-cluster-options-variables.html#option_mysqld_ndb-log-fail-terminate).

* **Programas NDB — Remoção da dependência NDBT.** A dependência de vários programas utilitários `NDB` na biblioteca `NDBT` foi removida. Esta biblioteca é usada internamente para desenvolvimento e não é necessária para uso normal; sua inclusão nestes programas pode levar a problemas indesejados durante o teste.

  Os programas afetados estão listados aqui, juntamente com as versões NDB nas quais a dependência foi removida:

  + [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup"), no NDB 7.6.11
  + [**ndb_show_tables**](mysql-cluster-programs-ndb-show-tables.html "21.5.27 ndb_show_tables — Display List of NDB Tables"), no NDB 7.6.14
  + [**ndb_waiter**](mysql-cluster-programs-ndb-waiter.html "21.5.30 ndb_waiter — Wait for NDB Cluster to Reach a Given Status"), no NDB 7.6.14

  O principal efeito desta mudança para os usuários é que estes programas não imprimem mais `NDBT_ProgramExit - status` após a conclusão de uma execução. Aplicativos que dependem de tal comportamento devem ser atualizados para refletir a mudança ao fazer o upgrade para as versões indicadas.

* **Depreciação e remoção do Auto-Installer.** A ferramenta de instalação baseada na Web MySQL NDB Cluster Auto-Installer (**ndb_setup.py**) está depreciada no NDB 7.6.16 e é removida no NDB 7.6.17 e posterior. Ela não é mais suportada.

* **Depreciação e remoção do ndbmemcache.** `ndbmemcache` não é mais suportado. `ndbmemcache` foi depreciado no NDB 7.6.16 e removido no NDB 7.6.17.

* **Suporte a Node.js removido.** A partir da versão NDB Cluster 7.6.16, o suporte para Node.js pelo NDB 7.6 foi removido.

  O suporte para Node.js pelo NDB Cluster é mantido apenas no NDB 8.0.

* **Conversão entre NULL e NOT NULL durante operações de restore.** A partir do NDB 7.6.19, [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") pode suportar a restauração de colunas `NULL` como `NOT NULL` e o inverso, usando as opções listadas aqui:

  + Para restaurar uma coluna `NULL` como `NOT NULL`, use a opção [`--lossy-conversions`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_lossy-conversions).

    A coluna originalmente declarada como `NULL` não deve conter nenhuma Row `NULL`; se contiver, [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") sai com um erro.

  + Para restaurar uma coluna `NOT NULL` como `NULL`, use a opção [`--promote-attributes`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_promote-attributes).

  Para mais informações, consulte as descrições das opções indicadas de [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup").

* **Suporte a OpenSSL 3.0.** A partir do NDB 7.6.27, todos os binários de MySQL Server e cliente incluídos na distribuição `NDB` são compilados com suporte para Open SSL 3.0.

* **Opção --commands do cliente mysql.** A opção [`--commands`](mysql-command-options.html#option_mysql_commands) do cliente [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client"), adicionada no NDB 7.6.35, habilita ou desabilita a maioria dos comandos do cliente [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client").

  Esta opção é habilitada por padrão. Para desabilitá-la, inicie o cliente [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") com [`--commands=OFF`](mysql-command-options.html#option_mysql_commands) ou [`--skip-commands`](mysql-command-options.html#option_mysql_commands).

  Para mais informações, consulte [Section 4.5.1.1, “mysql Client Options”](mysql-command-options.html "4.5.1.1 mysql Client Options").