#### 21.2.4.2 O que há de novo no NDB Cluster 7.6

Novas funcionalidades e outras mudanças importantes no NDB Cluster 7.6 que provavelmente serão de interesse estão listadas a seguir:

- **Novo formato de arquivo de tabela de Dados de disco.** Um novo formato de arquivo é usado no NDB 7.6 para tabelas de Dados de disco, o que permite que cada tabela de Dados de disco seja identificada de forma única sem reutilizar quaisquer IDs de tabela. Isso deve ajudar a resolver problemas com o gerenciamento de páginas e extensões que eram visíveis para o usuário como problemas com a criação e remoção rápidas de tabelas de Dados de disco, e para os quais o formato antigo não fornecia uma maneira pronta de corrigir.

  O novo formato é agora usado sempre que novos grupos de arquivos de registro de desfazer e arquivos de dados de espaço de disco são criados. Os arquivos relacionados aos espaços de disco e aos arquivos de registro de desfazer das tabelas existentes continuam a usar o formato antigo até que seus espaços de disco e grupos de arquivos de registro de desfazer sejam recriados.

  Importante

  Os formatos antigo e novo não são compatíveis; arquivos de dados diferentes ou arquivos de registro de desfazer que são usados pela mesma tabela ou espaço de dados do disco não podem usar uma mistura de formatos.

  Para evitar problemas relacionados às mudanças no formato, você deve recriar quaisquer espaços de tabela existentes e desfazer grupos de arquivos de log quando atualizar para o NDB 7.6. Você pode fazer isso realizando um reinício inicial de cada nó de dados (ou seja, usando a opção `--initial` como parte do processo de atualização). Você pode esperar que essa etapa seja torna obrigatória como parte da atualização de NDB 7.5 ou uma série de versões anteriores para NDB 7.6 ou versões posteriores.

  Se você estiver usando tabelas de Dados de disco, uma atualização para qualquer versão do NDB 7.6 — independentemente do status da versão — requer que você reinicie todos os nós de dados com `--initial` como parte do processo de atualização. Isso ocorre porque as séries de versões do NDB 7.5 e anteriores não conseguem ler o novo formato de arquivo de Dados de disco.

  Para obter mais informações, consulte Seção 21.3.7, “Atualização e Downgrade do NDB Cluster”.

- **Pool de memória de dados e memória de índice dinâmica.** A memória necessária para os índices nas colunas da tabela `NDB` agora é alocada dinamicamente a partir da alocada para `DataMemory`. Por essa razão, o parâmetro de configuração `IndexMemory` é agora desatualizado e está sujeito à remoção em uma futura série de lançamentos.

  Importante

  No NDB 7.6, se o `IndexMemory` estiver definido no arquivo `config.ini`, o servidor de gerenciamento emite o aviso "IndexMemory é desatualizado; use o número de bytes em cada nó ndbd(DB) alocado para armazenar índices em vez disso na inicialização" e qualquer memória atribuída a este parâmetro é automaticamente adicionada ao `DataMemory`.

  Além disso, o valor padrão para `DataMemory` foi aumentado para 98M; o padrão para `IndexMemory` foi reduzido para 0.

  A combinação da memória de índice com a memória de dados simplifica a configuração do `NDB`; um benefício adicional dessas mudanças é que a expansão aumentando o número de threads do LDM não é mais limitada por ter definido um valor insuficientemente grande para `IndexMemory`. Isso ocorre porque a memória de índice não é mais uma quantidade estática que é alocada apenas uma vez (quando o clúster começa), mas agora pode ser alocada e realocada conforme necessário. Anteriormente, às vezes acontecia que aumentar o número de threads do LDM poderia levar ao esgotamento da memória de índice enquanto grandes quantidades de `DataMemory` permaneciam disponíveis.

  Como parte desse trabalho, vários casos de uso de `DataMemory` que não estavam diretamente relacionados ao armazenamento de dados de tabelas agora usam a memória de transação.

  Por essa razão, em alguns sistemas, pode ser necessário aumentar `SharedGlobalMemory` para permitir que a memória de transação aumente quando necessário, como ao usar a Replicação em NDB Cluster, que requer uma grande quantidade de buffer nos nós de dados. Em sistemas que realizam cargas iniciais em massa de dados, pode ser necessário dividir transações muito grandes em partes menores.

  Além disso, os nós de dados agora geram eventos de `MemoryUsage` (veja Seção 21.6.3.2, “Eventos de Log do NDB Cluster”) e escrevem mensagens apropriadas no log do cluster quando o uso de recursos atinge 99%, assim como quando atinge 80%, 90% ou 100%, como antes.

  Outras alterações relacionadas estão listadas aqui:

  - `IndexMemory` não está mais entre os valores exibidos na coluna `memory_type` da tabela `ndbinfo.memoryusage`; também não está mais exibido na saída do **ndb_config**.

  - O comando `REPORT MEMORYUSAGE` e outros comandos que exibem o consumo de memória agora mostram o consumo de memória do índice usando páginas de 32K (anteriormente eram páginas de 8K).

  - A tabela \`ndbinfo.resources agora mostra o recurso `DISK_OPERATIONS`como`TRANSACTION_MEMORY`, e o recurso `RESERVED\` foi removido.

- O **ndbinfo processa e configura as tabelas _config_nodes.** O NDB 7.6 adiciona duas tabelas ao banco de dados de informações `ndbinfo` (mysql-cluster-ndbinfo.html) para fornecer informações sobre os nós do cluster; essas tabelas estão listadas aqui:

  - `config_nodes`: Esta tabela contém o ID do nó, o tipo de processo e o nome do host para cada nó listado no arquivo de configuração de um cluster NDB.

  - O `processes` mostra informações sobre os nós atualmente conectados ao clúster; essas informações incluem o nome do processo e o ID do processo do sistema; para cada nó de dados e nó SQL, também mostra o ID do processo do processo anjo do nó. Além disso, a tabela mostra um endereço de serviço para cada nó conectado; esse endereço pode ser definido em aplicativos da API NDB usando o método `Ndb_cluster_connection::set_service_uri()`, que também foi adicionado no NDB 7.6.

- **Nome do sistema.** O nome do sistema de um clúster NDB pode ser usado para identificar um clúster específico. No NDB 7.6, o MySQL Server exibe esse nome como o valor da variável de status `Ndb_system_name`; os aplicativos da API NDB podem usar o método `Ndb_cluster_connection::get_system_name()` que é adicionado na mesma versão.

  Um nome do sistema baseado no horário em que o servidor de gerenciamento foi iniciado é gerado automaticamente. Você pode substituir esse valor adicionando uma seção `[system]` ao arquivo de configuração do cluster e definindo o parâmetro `Name` com um valor de sua escolha nessa seção, antes de iniciar o servidor de gerenciamento.

- \*\* Ferramenta de importação CSV ndb_import.\*\* **ndb_import**, adicionada no NDB Cluster 7.6, carrega dados formatados em CSV diretamente em uma tabela de `NDB` usando a API NDB (é necessário um servidor MySQL apenas para criar a tabela e o banco de dados em que ela está localizada). **ndb_import** pode ser considerado um análogo de **mysqlimport** ou da instrução SQL `LOAD DATA`, e suporta muitas das mesmas ou opções semelhantes para formatação dos dados.

  Supondo que o banco de dados e a tabela `NDB` de destino existam, o **ndb_import** precisa apenas de uma conexão com o servidor de gerenciamento do cluster (**ndb_mgmd**) para realizar a importação; por essa razão, deve haver um slot `[api]` disponível para a ferramenta no arquivo `config.ini` do cluster.

  Para mais informações, consulte Seção 21.5.14, “ndb_import — Importar dados CSV no NDB”.

- **Ferramenta de monitoramento ndb_top.** Foi adicionado o utilitário **ndb_top**, que mostra informações de carga e uso da CPU para um nó de dados `NDB` em tempo real. Essas informações podem ser exibidas em formato de texto, como um gráfico ASCII ou ambos. O gráfico pode ser exibido em cores ou usando escala de cinza.

  **ndb_top** conecta-se a um nó SQL do NDB Cluster (ou seja, a um servidor MySQL). Por essa razão, o programa deve ser capaz de se conectar como um usuário MySQL com o privilégio `SELECT` em tabelas no banco de dados `ndbinfo`.

  **ndb_top** está disponível para as plataformas Linux, Solaris e macOS, mas atualmente não está disponível para plataformas Windows.

  Para obter mais informações, consulte Seção 21.5.29, “ndb_top — Visualizar informações de uso da CPU para threads NDB”.

- **Limpeza do código.** Um número significativo de instruções de depuração e impressões não necessárias para operações normais foram movidas para o código usado apenas durante testes ou depuração do `NDB`, ou dispensadas completamente. Essa remoção do overhead deve resultar em uma melhoria notável no desempenho dos threads LDM e TC na ordem de 10% em muitos casos.

- Melhorias no thread LDM e no LCP. Anteriormente, quando um thread de gerenciamento de dados local sofria com atraso de I/O, ele escrevia para pontos de verificação locais mais lentamente. Isso poderia acontecer, por exemplo, durante uma condição de sobrecarga de disco. Problemas poderiam ocorrer porque outros fios LDM nem sempre observavam esse estado, ou não faziam o mesmo. Agora, o `NDB` rastreia o modo de atraso de I/O globalmente, de modo que esse estado é relatado assim que pelo menos um thread estiver escrevendo no modo de atraso de I/O; ele então garante que a velocidade de escrita reduzida para esse LCP seja aplicada a todos os fios LDM durante a duração da condição de desaceleração. Como a redução na velocidade de escrita agora é observada por outras instâncias LDM, a capacidade geral é aumentada; isso permite que a sobrecarga de disco (ou outra condição que induz o atraso de I/O) seja superada mais rapidamente nesses casos do que era anteriormente.

- **Identificação de erros do NDB.** Mensagens de erro e informações podem ser obtidas usando o cliente **mysql** no NDB 7.6 a partir de uma nova tabela `error_messages` no banco de dados de informações `ndbinfo`. Além disso, o NDB 7.6 introduz um novo cliente de linha de comando **ndb_perror** para obter informações dos códigos de erro do NDB; isso substitui o uso de **perror** com `--ndb`, que agora está desatualizado e sujeito à remoção em uma futura versão.

  Para obter mais informações, consulte Seção 21.6.15.21, “Tabela ndbinfo error_messages” e Seção 21.5.17, “ndb_perror — Obter informações de mensagens de erro NDB”.

- Melhorias no SPJ. Ao executar um varredura como uma junção empurrada (ou seja, a raiz da consulta é uma varredura), o bloco `DBTC` envia um pedido SPJ para uma instância `DBSPJ` no mesmo nó do fragmento a ser varrido. Anteriormente, um pedido desse tipo era enviado para cada fragmento do nó. Como o número de instâncias `DBTC` e `DBSPJ` normalmente é menor que o número de instâncias LDM, isso significa que todas as instâncias SPJ estavam envolvidas na execução de uma única consulta, e, de fato, algumas instâncias SPJ podiam (e fizeram) receber múltiplos pedidos da mesma consulta. O NDB 7.6 permite que um único pedido SPJ lide com um conjunto de fragmentos raiz a serem varridos, de modo que apenas um único pedido SPJ (`SCAN_FRAGREQ`) precisa ser enviado para qualquer instância SPJ (`DBSPJ` bloco) em cada nó.

  Como o `DBSPJ` consome uma quantidade relativamente pequena da CPU total usada ao avaliar uma junção empurrada, diferentemente do bloco LDM (que é responsável pela maioria do uso da CPU), a introdução de vários blocos SPJ adiciona algum paralelismo, mas o custo adicional também aumenta. Ao permitir que um único pedido SPJ lide com um conjunto de fragmentos raiz a serem escaneados, de modo que apenas um único pedido SPJ seja enviado para cada instância `DBSPJ` em cada nó e tamanhos de lote sejam alocados por fragmento, a varredura de múltiplos fragmentos pode obter um tamanho total de lote maior, permitindo que algumas otimizações de agendamento sejam feitas dentro do bloco SPJ, que pode escanear um único fragmento de cada vez (dando-lhe a alocação total do tamanho do lote), escanear todos os fragmentos em paralelo usando sub-lote menores ou uma combinação dos dois.

  Espera-se que este trabalho aumente o desempenho das junções empurradas para as seguintes razões:

  - Como vários fragmentos de raiz podem ser verificados para cada solicitação SPJ, é necessário solicitar menos instâncias SPJ ao executar uma junção empurrada.

  - A alocação de tamanho de lote disponível aumentada, e para cada fragmento, também deve resultar, na maioria dos casos, em menos solicitações necessárias para completar uma junção.

- Melhoria no tratamento do O_DIRECT para logs de rollback. O NDB 7.6 oferece um novo parâmetro de configuração do nó de dados `ODirectSyncFlag`, que faz com que as gravações de logs de rollback concluídas usando `O_DIRECT` sejam tratadas como chamadas `fsync`. O `ODirectSyncFlag` está desativado por padrão; para ativá-lo, defina-o para `true`.

  Você deve ter em mente que o valor definido para este parâmetro é ignorado quando pelo menos uma das seguintes condições for verdadeira:

  - `ODirect` não está habilitado.

  - `InitFragmentLogFiles` está definido como `SPARSE`.

- **Bloqueio de CPUs para construções de índices offline.** No NDB 7.6, as construções de índices offline usam, por padrão, todas as cores disponíveis para **ndbmtd**, em vez de serem limitadas ao único núcleo reservado para o thread de E/S. Também é possível especificar um conjunto desejado de núcleos a serem usados para os threads de E/S que realizam construções multithread de índices ordenados offline. Isso pode melhorar os tempos de reinício e restauração, bem como o desempenho e a disponibilidade.

  Nota

  “Offline”, no sentido aqui utilizado, refere-se a uma construção de índice realizada enquanto uma determinada tabela não está sendo escrita. Essas construções de índice ocorrem durante o reinício de um nó ou sistema ou ao restaurar um clúster a partir de um backup usando **ndb_restore** `--rebuild-indexes`.

  Essa melhoria envolve várias mudanças relacionadas. A primeira delas é alterar o valor padrão do parâmetro de configuração `BuildIndexThreads` (de 0 para 128), o que significa que as construções de índices ordenados offline agora são multitramadas por padrão. O valor padrão do parâmetro de configuração `TwoPassInitialNodeRestartCopy` também foi alterado (de `false` para `true`), de modo que um reinício inicial do nó primeiro copia todos os dados sem a criação de índices de um nó "vivo" para o nó que está sendo iniciado, constrói os índices ordenados offline após a cópia dos dados, e depois sincroniza novamente com o nó "vivo"; isso pode reduzir significativamente o tempo necessário para a construção de índices. Além disso, para facilitar o bloqueio explícito dos threads de construção de índices offline para CPUs específicas, um novo tipo de thread (`idxbld`) é definido para o parâmetro de configuração `ThreadConfig`.

  Como parte desse trabalho, o `NDB` agora pode distinguir entre os tipos de threads de execução e outros tipos de threads, e entre os tipos de threads que são atribuídos permanentemente a tarefas específicas e aqueles cujas atribuições são meramente temporárias.

  O NDB 7.6 também introduz o parâmetro `nosend` para `ThreadCOnfig`. Ao definir esse parâmetro para 1, você pode impedir que um thread `main`, `ldm`, `rep` ou `tc` ajude os threads de envio. Esse parâmetro é 0 por padrão e não pode ser usado com threads de E/S, threads de envio, threads de construção de índices ou threads de vigilância.

  Para obter informações adicionais, consulte as descrições dos parâmetros.

- **Tamanhos de lote variáveis para operações de dados em lote DDL.** Como parte do trabalho em andamento para otimizar o desempenho de DDL em lote por **ndbmtd**, agora é possível obter melhorias de desempenho aumentando o tamanho do lote para as partes de dados em lote das operações DDL que processam dados usando varreduras. Os tamanhos de lote agora são configuráveis para construções de índices únicos, construções de chaves estrangeiras e reorganização online, definindo os parâmetros de configuração do nó de dados respectivos listados aqui:

  - `MaxUIBuildBatchSize`: Tamanho máximo do lote de varredura usado para a construção de chaves únicas.

  - `MaxFKBuildBatchSize`: Tamanho máximo do lote de varredura usado para a construção de chaves estrangeiras.

  - `MaxReorgBuildBatchSize`: Tamanho máximo do lote de varredura usado para reorganização de partições de tabelas.

  Para cada um dos parâmetros listados acima, o valor padrão é 64, o mínimo é 16 e o máximo é 512.

  Aumentar o tamanho ou os tamanhos apropriados do lote pode ajudar a amortizar as latências entre os threads e entre os nós e a utilizar mais recursos paralelos (locais e remotos) para ajudar a escalar o desempenho do DDL. Em cada caso, pode haver um compromisso com o tráfego contínuo.

- **LCPs parciais.** O NDB 7.6 implementa pontos de verificação locais parciais. Anteriormente, um LCP sempre fazia uma cópia de todo o banco de dados. Ao trabalhar com terabytes de dados, esse processo poderia exigir muito tempo, com um impacto negativo, especialmente, nos reinícios de nós e clusters, além de mais espaço para os logs de refazer. Agora, não é mais estritamente necessário que os LCPs façam isso — em vez disso, um LCP agora, por padrão, salva apenas um número de registros baseado na quantidade de dados alterados desde o LCP anterior. Isso pode variar entre um ponto de verificação completo e um ponto de verificação que não altera nada. No caso de o ponto de verificação refletir quaisquer alterações, o mínimo é escrever uma parte dos 2048 que compõem um LCP local.

  Como parte dessa mudança, dois novos parâmetros de configuração de nós de dados são introduzidos nesta versão: `EnablePartialLcp` (padrão `true`, ou ativado) habilita LCPs parciais. `RecoveryWork` controla a porcentagem de espaço dada aos LCPs; ele aumenta com a quantidade de trabalho que deve ser realizado nos LCPs durante reinicializações, em oposição ao que é realizado durante operações normais. Aumentar esse valor faz com que os LCPs durante operações normais precisem escrever menos registros e, assim, diminui a carga de trabalho usual. Aumentar esse valor também significa que as reinicializações podem levar mais tempo.

  Você deve desabilitar os LCPs parciais explicitamente, definindo `EnablePartialLcp=false`. Isso usa a menor quantidade de disco, mas também tende a maximizar a carga de escrita para os LCPs. Para otimizar a menor carga de trabalho nos LCPs durante o funcionamento normal, use `EnablePartialLcp=true` e `RecoveryWork=100`. Para usar o menor espaço de disco para LCPs parciais, mas com escritas limitadas, use `EnablePartialLcp=true` e `RecoveryWork=25`, que é o mínimo para `RecoveryWork`. O padrão é `EnablePartialLcp=true` com `RecoveryWork=50`, o que significa que os arquivos LCP exigem aproximadamente 1,5 vezes `DataMemory`; usando `CompressedLcp=1`, isso pode ser reduzido pela metade. Os tempos de recuperação com as configurações padrão também devem ser muito mais rápidos do que quando `EnablePartialLcp` é definido como `false`.

  Nota

  O valor padrão para `RecoveryWork` foi aumentado de 50 para 60.

  Além disso, os parâmetros de configuração do nó de dados `BackupDataBufferSize`, `BackupWriteSize` e `BackupMaxWriteSize` estão todos obsoletos e estarão sujeitos à remoção em uma futura versão do MySQL NDB Cluster.

  Como parte dessa melhoria, foram feitos trabalhos para corrigir vários problemas com reinicializações de nós, em que era possível ficar sem o registro de desfazer em várias situações, geralmente quando se estava restaurando um nó que havia parado por um longo tempo durante um período de atividade de escrita intensa.

  Foram realizados trabalhos adicionais para melhorar a sobrevivência dos nós de dados durante longos períodos de sincronização sem expiração de tempo, atualizando o mecanismo de vigilância LCP durante esse processo e mantendo um melhor acompanhamento do progresso da sincronização de dados do disco. Anteriormente, havia a possibilidade de avisos falsos ou até mesmo falhas nos nós se a sincronização demorar mais do que o tempo de expiração do mecanismo de vigilância LCP.

  Importante

  Ao atualizar um NDB Cluster que usa tabelas de dados em disco para a versão NDB 7.6 ou ao fazer uma atualização para uma versão anterior da NDB 7.6, é necessário reiniciar todos os nós de dados com `--initial`.

- **Processamento em lote de registros do log de desfazer em paralelo.** Anteriormente, o bloco do kernel do nó de dados `LGMAN` processava os registros do log de desfazer sequencialmente; agora, isso é feito em paralelo. O thread rep, que entrega os registros de desfazer para os threads LDM, aguardava que um LDM terminasse de aplicar um registro antes de buscar o próximo; agora, o thread rep não aguarda mais, mas passa imediatamente para o próximo registro e LDM.

  Um contador do número de registros de log pendentes para cada LDM no `LGMAN` é mantido e decrementado sempre que um LDM conclui a execução de um registro. Todos os registros pertencentes a uma página são enviados para o mesmo thread do LDM, mas não há garantia de que sejam processados em ordem, portanto, um mapa de hash de páginas que têm registros pendentes mantém uma fila para cada uma dessas páginas. Quando a página está disponível no cache de páginas, todos os registros pendentes na fila são aplicados em ordem.

  Alguns tipos de registros continuam a ser processados em série: `UNDO_LCP`, `UNDO_LCP_FIRST`, `UNDO_LOCAL_LCP`, `UNDO_LOCAL_LCP_FIRST`, `UNDO_DROP` e `UNDO_END`.

  Não há alterações visíveis aos usuários na funcionalidade diretamente associadas a essa melhoria de desempenho; faz parte do trabalho realizado para melhorar o recurso de desfazer longas manipulações em suporte a pontos de verificação locais parciais no NDB Cluster 7.6.

- **Leitura de tabelas e IDs de fragmentos a partir do ID de extensão para o aplicativo de registro de desfazer.** Ao aplicar um registro de desfazer, é necessário obter o ID da tabela e o ID do fragmento a partir do ID da página. Isso era feito anteriormente lendo a página do bloco do kernel `PGMAN` usando um thread adicional de trabalho `PGMAN`, mas ao aplicar o registro de desfazer, era necessário ler a página novamente.

  Ao usar `O_DIRECT`, isso era muito ineficiente, pois a página não estava cacheada no kernel do sistema operacional. Para corrigir esse problema, a mapeamento de ID de página para ID de tabela e ID de fragmento agora é feito usando informações do cabeçalho de extensão, os IDs de tabela e IDs de fragmento para as páginas usadas dentro de uma determinada extensão. As páginas de extensão estão sempre presentes no cache de páginas, então não são necessárias leituras extras do disco para realizar o mapeamento. Além disso, as informações já podem ser lidas, usando as estruturas de dados de blocos do kernel existentes `TSMAN`.

  Consulte a descrição do parâmetro de configuração do nó de dados `ODirect` para obter mais informações.

- **Transportador de memória compartilhada.** As conexões de memória compartilhada (SHM) definidas pelo usuário entre um nó de dados e um nó de API no mesmo computador host são totalmente suportadas no NDB 7.6 e não são mais consideradas experimentais. Você pode habilitar uma conexão explícita de memória compartilhada definindo o parâmetro de configuração `UseShm` para `1` para o nó de dados relevante. Ao definir explicitamente a memória compartilhada como o método de conexão, também é necessário que tanto o nó de dados quanto o nó de API sejam identificados por `HostName`.

  O desempenho das conexões SHM pode ser aprimorado definindo parâmetros como `ShmSize`, `ShmSpintime` e `SendBufferMemory` em uma seção `[shm]` ou `[shm default]` do arquivo de configuração do cluster (`config.ini`). A configuração do SHM é, de outra forma, semelhante à do transportador TCP.

  O parâmetro `SigNum` não é utilizado na nova implementação de SHM, e quaisquer configurações feitas para ele agora são ignoradas. Seção 21.4.3.12, “Conexões de Memória Compartilhada do NDB Cluster”, fornece mais informações sobre esses parâmetros. Além disso, como parte deste trabalho, o código `NDB` relacionado ao antigo transportador SCI foi removido.

  Para obter mais informações, consulte Seção 21.4.3.12, "Conexões de Memória Compartilhada do NDB Cluster".

- **Otimização da junção interna do bloco SPJ.** No NDB 7.6, o bloco de kernel `SPJ` pode levar em consideração quando está avaliando uma solicitação de junção na qual pelo menos algumas das tabelas estão UNTER-juntas. Isso significa que ele pode eliminar solicitações para linhas, faixas ou ambas assim que se souber que uma ou mais das solicitações anteriores não retornaram nenhum resultado para uma linha pai. Isso economiza tanto os nós de dados quanto o bloco `SPJ` de terem que lidar com solicitações e linhas de resultado que nunca participam de uma linha de resultado UNTER-junta.

  Considere esta consulta de junção, onde `pk` é a chave primária nas tabelas t2, t3 e t4, e as colunas x, y e z são colunas não indexadas:

  ```sql
  SELECT * FROM t1
    JOIN t2 ON t2.pk = t1.x
    JOIN t3 ON t3.pk = t1.y
    JOIN t4 ON t4.pk = t1.z;
  ```

  Anteriormente, isso resultava em um pedido `SPJ` que incluía uma varredura na tabela `t1` e consultas em cada uma das tabelas `t2`, `t3` e `t4`; essas eram avaliadas para cada linha retornada de `t1`. Para essas, o `SPJ` criava pedidos `LQHKEYREQ` para as tabelas `t2`, `t3` e `t4`. Agora, o `SPJ` leva em consideração a exigência de que, para produzir quaisquer linhas de resultado, uma junção interna deve encontrar uma correspondência em todas as tabelas unidas; assim que não forem encontradas correspondências para uma das tabelas, quaisquer pedidos adicionais para tabelas que tenham o mesmo pai ou tabelas são ignorados.

  Nota

  Essa otimização não pode ser aplicada até que todos os nós de dados e todos os nós de API no clúster tenham sido atualizados para o NDB 7.6.

- **Ferramenta de acordamento do NDB.** O `NDB` usa um receptor de pesquisa para ler dos soquetes, executar mensagens dos soquetes e acordar outros threads. Ao usar apenas o uso intermitente de um thread de recebimento, a propriedade de pesquisa é liberada antes de começar a acordar outros threads, o que proporciona algum grau de paralelismo no thread de recebimento, mas, ao usar constantemente o thread de recebimento, o thread pode ser sobrecarregado por tarefas, incluindo o acordamento de outros threads.

  O NDB 7.6 suporta a transferência de tarefas de acordar outros threads para um novo thread pelo thread receptor, que acorda outros threads a pedido (e, de outra forma, simplesmente dorme), permitindo melhorar a capacidade de uma única conexão de cluster em cerca de 10 a 20%.

- Controle adaptativo do LCP.

  O NDB 7.6.7 implementa um mecanismo de controle LCP adaptativo que atua em resposta a mudanças no uso do espaço do log de reverso. Ao controlar a velocidade de escrita no disco do LCP, você pode ajudar a proteger contra vários problemas relacionados aos recursos, incluindo os seguintes:

  - Recursos insuficientes de CPU para aplicações de tráfego
  - Sobrecarga de disco
  - Buffer insuficiente do log de refazer
  - Condições de parada do GCP
  - Espaço insuficiente no log de refazer
  - Espaço insuficiente no registro de desfazer

  Este trabalho inclui as seguintes alterações relacionadas aos parâmetros de configuração de `NDB`:

  - O valor padrão do parâmetro de nó de dados `RecoveryWork` é aumentado de 50 para 60; ou seja, o `NDB` agora usa 1,6 vezes o tamanho dos dados para o armazenamento dos LCPs.

  - Um novo parâmetro de configuração de nó de dados `InsertRecoveryWork` oferece capacidades de ajuste adicionais ao controlar a porcentagem de `RecoveryWork` reservada para operações de inserção. O valor padrão é 40 (ou seja, 40% do espaço de armazenamento já reservado por `RecoveryWork`); o mínimo e o máximo são 0 e 70, respectivamente. Aumentar esse valor permite que mais escritas sejam realizadas durante um LCP, enquanto limita o tamanho total do LCP. Diminuir `InsertRecoveryWork` limita o número de escritas usadas durante um LCP, mas resulta em mais espaço sendo usado para o LCP, o que significa que a recuperação leva mais tempo.

  Este trabalho implementa o controle da velocidade do LCP principalmente para minimizar o risco de esgotamento do log de redo. Isso é feito de forma adaptativa, com base na quantidade de espaço do log de redo utilizado, usando os níveis de alerta, com as respostas tomadas quando esses níveis são atingidos, mostrados aqui:

  - **Baixo**: O uso do espaço do log de refazer é maior que 25%, ou o uso estimado mostra espaço insuficiente para o log de refazer em uma taxa de transações muito alta. Em resposta, o uso dos buffers de dados do LCP é aumentado durante as varreduras do LCP, a prioridade das varreduras do LCP é aumentada e a quantidade de dados que pode ser escrita por interrupção em tempo real durante uma varredura do LCP também é aumentada.

  - **Alto**: O uso do espaço do log de refazer é maior que 40%, ou a estimativa é que o espaço do log de refazer acabe em uma taxa de transações alta. Quando esse nível de uso é atingido, o valor de `MaxDiskWriteSpeed` é aumentado para o valor de `MaxDiskWriteSpeedOtherNodeRestart`. Além disso, a velocidade mínima é duplicada e a prioridade das varreduras do LCP e do que pode ser escrito por quebra em tempo real também são aumentadas ainda mais.

  - **Crítica**: O uso do espaço do log de refazer é maior que 60%, ou o uso estimado mostra espaço insuficiente para o log de refazer em uma taxa de transação normal. Neste nível, o `MaxDiskWriteSpeed` é aumentado para o valor de `MaxDiskWriteSpeedOwnRestart`; o `MinDiskWriteSpeed` também é definido para este valor. A prioridade das varreduras do LCP e a quantidade de dados que podem ser escritos por pausa em tempo real são aumentadas ainda mais, e o buffer de dados do LCP está completamente disponível durante a varredura do LCP.

  Aumentar o nível também tem o efeito de aumentar a velocidade calculada do ponto de verificação.

  O controle LCP oferece os seguintes benefícios para as instalações `NDB`:

  - Os clusters devem agora suportar cargas muito pesadas com configurações padrão muito melhor do que antes.

  - Agora, deve ser possível que o `NDB` funcione de forma confiável em sistemas onde o espaço disponível no disco é (como um mínimo aproximado) 2,1 vezes a quantidade de memória alocada para ele (`DataMemory`). Você deve notar que esse número *não* inclui o espaço em disco usado para as tabelas de Dados do Disco.

- **Opções de ndb_restore.** A partir do NDB 7.6.9, as opções `--nodeid` (mysql-cluster-programs-ndb-restore.html#option_ndb_restore_nodeid) e `--backupid` (mysql-cluster-programs-ndb-restore.html#option_ndb_restore_backupid) são obrigatórias ao invocar o **ndb_restore**.

- **Restauração por fatias.** A partir da versão NDB 7.6.13, é possível dividir um backup em porções aproximadamente iguais (fatias) e restaurar essas fatias em paralelo usando duas novas opções implementadas para **ndb_restore**:

  - `--num-slices` determina o número de fatias em que o backup deve ser dividido.

  - `--slice-id` fornece o ID do slice a ser restaurado pela instância atual do **ndb_restore**.

  Isso permite que múltiplas instâncias do **ndb_restore** sejam usadas para restaurar subconjuntos do backup em paralelo, reduzindo potencialmente o tempo necessário para realizar a operação de restauração.

  Para obter mais informações, consulte a descrição da opção `--num-slices` do **ndb_restore** **ndb_restore**.

- **ndb_restore: alterações no esquema da chave primária.** O NDB 7.6.14 (e versões posteriores) suporta diferentes definições de chave primária para tabelas de origem e destino ao restaurar um backup nativo `NDB` com **ndb_restore** quando executado com a opção `--allow-pk-changes`. Ambos os casos de aumento e diminuição do número de colunas que compõem a chave primária original são suportados.

  Quando a chave primária é estendida com uma coluna ou colunas adicionais, todas as colunas adicionadas devem ser definidas como `NOT NULL`, e nenhum valor em nenhuma dessas colunas pode ser alterado durante o tempo em que o backup está sendo feito. Como algumas aplicações definem todos os valores das colunas em uma linha ao atualizá-la, independentemente de todos os valores realmente terem sido alterados, isso pode fazer com que uma operação de restauração falhe, mesmo que nenhum valor na coluna que será adicionada à chave primária tenha sido alterado. Você pode sobrepor esse comportamento usando a opção `--ignore-extended-pk-updates` também adicionada no NDB 7.6.14; nesse caso, você deve garantir que nenhum desses valores seja alterado.

  Uma coluna pode ser removida da chave primária da tabela, independentemente de essa coluna permanecer ou não como parte da tabela.

  Para obter mais informações, consulte a descrição da opção `--allow-pk-changes` para **ndb_restore**.

- Melhorias no **ndb_blob_tool**. A partir do NDB 7.6.14, o utilitário **ndb_blob_tool** pode detectar partes de blob ausentes para as quais existem partes em linha e substituí-las por partes de blob de espaço (com caracteres de espaço) do comprimento correto. Para verificar se há partes de blob ausentes, use a opção `--check-missing` com este programa. Para substituir quaisquer partes de blob ausentes por marcadores, use a opção `--add-missing`.

  Para obter mais informações, consulte Seção 21.5.6, “ndb_blob_tool — Verificar e reparar colunas BLOB e TEXT de tabelas de NDB Cluster”.

- **Mesclando backups com ndb_restore.** Em alguns casos, pode ser desejável consolidar os dados originalmente armazenados em diferentes instâncias do NDB Cluster (todos usando o mesmo esquema) em um único NDB Cluster de destino. Isso agora é suportado ao usar backups criados no cliente **ndb_mgm** (veja Seção 21.6.8.2, “Usando o Cliente de Gerenciamento do NDB Cluster para Criar um Backup”) e restaurá-los com **ndb_restore**, usando a opção `--remap-column` adicionada no NDB 7.6.14, juntamente com `--restore-data` (e possivelmente opções compatíveis adicionais conforme necessário ou desejado). `--remap-column` pode ser empregado para lidar com casos em que os valores de chave primária e exclusiva estão sobrepostos entre os clusters de origem e é necessário que eles não se sobreponham no cluster de destino, além de preservar outras relações entre tabelas, como chaves estrangeiras.

  `--remap-column` aceita como argumento uma string no formato `db.tbl.col:fn:args`, onde *`db`*, *`tbl`* e *`col`* são, respectivamente, os nomes do banco de dados, tabela e coluna, *`fn`* é o nome de uma função de remapeamento e *`args`* é um ou mais argumentos para *`fn`*. Não há valor padrão. Apenas `offset` é suportado como o nome da função, com *`args`* como o deslocamento inteiro a ser aplicado ao valor da coluna ao inseri-la na tabela de destino a partir do backup. Esta coluna deve ser uma das tipos `INT` ou `BIGINT`; o intervalo permitido do valor do deslocamento é o mesmo que a versão assíncrona desse tipo (isso permite que o deslocamento seja negativo, se desejado).

  A nova opção pode ser usada várias vezes na mesma invocação de **ndb_restore**, para que você possa remappear para novos valores várias colunas da mesma tabela, de tabelas diferentes ou de ambas. O valor de deslocamento não precisa ser o mesmo para todas as instâncias da opção.

  Além disso, duas novas opções são fornecidas para **ndb_desc**, também a partir do NDB 7.6.14:

  - `--auto-inc` (forma abreviada `-a`): Inclui o próximo valor de autoincremento na saída, se a tabela tiver uma coluna `AUTO_INCREMENT`.

  - `--context` (forma abreviada `-x`): Fornece informações adicionais sobre a tabela, incluindo o esquema, o nome do banco de dados, o nome da tabela e o ID interno.

  Para obter mais informações e exemplos, consulte a descrição da opção `--remap-column`.

- **Opção `--ndb-log-fail-terminate`.** A partir do NDB 7.6.14, você pode fazer com que o nó SQL termine sempre que não conseguir registrar todos os eventos de linha completamente. Isso pode ser feito iniciando o **mysqld** com a opção `--ndb-log-fail-terminate` (mysql-cluster-options-variables.html#option_mysqld_ndb-log-fail-terminate).

- **Programas do NDB — Remoção da dependência do NDBT.** A dependência de vários programas de utilitários do NDB na biblioteca NDBT foi removida. Essa biblioteca é usada internamente para desenvolvimento e não é necessária para uso normal; sua inclusão nesses programas poderia causar problemas indesejados durante os testes.

  Os programas afetados estão listados aqui, juntamente com as versões do `NDB` nas quais a dependência foi removida:

  - **ndb_restore**, em NDB 7.6.11
  - **ndb_show_tables**, em NDB 7.6.14
  - **ndb_waiter**, em NDB 7.6.14

  O principal efeito dessa mudança para os usuários é que esses programas não imprimem mais `NDBT_ProgramExit - status` após a conclusão de uma execução. As aplicações que dependem desse comportamento devem ser atualizadas para refletir a mudança ao serem atualizadas para as versões indicadas.

- **Depreciação e remoção do Auto-Instalador.** A ferramenta de instalação baseada na web do Auto-Instalador do MySQL NDB Cluster (**ndb_setup.py**) é descontinuada no NDB 7.6.16 e removida no NDB 7.6.17 e versões posteriores. Ela não é mais suportada.

- **Descontinuidade e remoção do ndbmemcache.** O `ndbmemcache` não é mais suportado. O `ndbmemcache` foi descontinuado no NDB 7.6.16 e removido no NDB 7.6.17.

- **Suporte ao Node.js removido.** A partir da versão NDB Cluster 7.6.16, o suporte ao Node.js pela NDB 7.6 foi removido.

  O suporte para Node.js pelo NDB Cluster é mantido apenas no NDB 8.0.

- **Conversão entre NULL e NOT NULL durante operações de restauração.** A partir do NDB 7.6.19, o **ndb_restore** pode suportar a restauração de colunas `NULL` como `NOT NULL` e vice-versa, usando as opções listadas aqui:

  - Para restaurar uma coluna `NULL` como `NOT NULL`, use a opção `--lossy-conversions`.

    A coluna originalmente declarada como `NULL` não deve conter nenhuma linha `NULL`; se contiver, o **ndb_restore** sai com um erro.

  - Para restaurar uma coluna `NOT NULL` como `NULL`, use a opção `--promote-attributes`.

  Para obter mais informações, consulte as descrições das opções indicadas **ndb_restore**.

- **Suporte ao OpenSSL 3.0.** A partir do NDB 7.6.27, todos os binários do servidor e do cliente MySQL incluídos na distribuição `NDB` são compilados com suporte ao OpenSSL 3.0

- **Opção `mysql client --commands`.** A opção **mysql** `--commands` (mysql-command-options.html#option_mysql_commands), adicionada no NDB 7.6.35, habilita ou desabilita a maioria dos comandos do cliente **mysql**.

  Esta opção está habilitada por padrão. Para desabilitá-la, inicie o cliente **mysql** com `--commands=OFF` ou `--skip-commands`.

  Para obter mais informações, consulte Seção 4.5.1.1, “Opções do cliente do MySQL”.
