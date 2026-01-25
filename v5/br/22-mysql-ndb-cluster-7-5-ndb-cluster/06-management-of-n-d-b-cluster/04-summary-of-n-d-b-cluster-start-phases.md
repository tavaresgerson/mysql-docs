### 21.6.4 Sumário das Fases de Inicialização do NDB Cluster

Esta seção fornece um esboço simplificado das etapas envolvidas quando os data nodes do NDB Cluster são iniciados. Informações mais completas podem ser encontradas em [NDB Cluster Start Phases](/doc/ndb-internals/en/ndb-internals-start-phases.html), no *`NDB` Internals Guide*.

Estas fases são as mesmas relatadas na saída do comando [`node_id STATUS`](mysql-cluster-mgm-client-commands.html#ndbclient-status) no management client (veja [Seção 21.6.1, “Comandos no NDB Cluster Management Client”](mysql-cluster-mgm-client-commands.html "21.6.1 Comandos no NDB Cluster Management Client")). Essas fases de inicialização também são relatadas na coluna `start_phase` da tabela [`ndbinfo.nodes`](mysql-cluster-ndbinfo-nodes.html "21.6.15.28 The ndbinfo nodes Table").

**Tipos de Inicialização.** Existem diversos tipos e modos de startup diferentes, conforme mostrado na lista a seguir:

* **Initial start (Inicialização Inicial).** O Cluster é iniciado com um clean file system em todos os data nodes. Isso ocorre quando o Cluster é iniciado pela primeira vez ou quando todos os data nodes são reiniciados usando a opção [`--initial`](mysql-cluster-programs-ndbd.html#option_ndbd_initial).

  Note

  Os arquivos Disk Data não são removidos ao reiniciar um Node usando [`--initial`](mysql-cluster-programs-ndbd.html#option_ndbd_initial).

* **System restart (Reinicialização do Sistema).** O Cluster inicia e lê os dados armazenados nos data nodes. Isso ocorre quando o Cluster foi desligado após ter sido usado, e quando se deseja que o Cluster retome as operações do ponto em que parou.

* **Node restart (Reinicialização do Node).** Este é o restart online de um Cluster Node enquanto o Cluster em si está em execução.

* **Initial node restart (Reinicialização Inicial do Node).** É o mesmo que um Node restart, exceto que o Node é reinicializado e iniciado com um clean file system.

**Configuração e inicialização (fase -1).** Antes do startup, cada data node (processo [**ndbd**](mysql-cluster-programs-ndbd.html "21.5.1 ndbd — The NDB Cluster Data Node Daemon")) deve ser inicializado. A inicialização consiste nas seguintes etapas:

1. Obter um Node ID
2. Buscar dados de configuração (Fetch configuration data)
3. Alocar ports a serem usados para comunicações inter-node
4. Alocar memory de acordo com as configurações obtidas no arquivo de configuração

Quando um data node ou SQL node se conecta pela primeira vez ao management node, ele reserva um Cluster Node ID. Para garantir que nenhum outro Node aloque o mesmo Node ID, este ID é retido até que o Node consiga se conectar ao Cluster e pelo menos um [**ndbd**](mysql-cluster-programs-ndbd.html "21.5.1 ndbd — The NDB Cluster Data Node Daemon") relate que este Node está conectado. Essa retenção do Node ID é protegida pela conexão entre o Node em questão e [**ndb_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon").

Após cada data node ser inicializado, o processo de startup do Cluster pode prosseguir. Os estágios pelos quais o Cluster passa durante esse processo estão listados aqui:

* **Fase 0.** Os blocks [`NDBFS`](/doc/ndb-internals/en/ndb-internals-kernel-blocks-ndbfs.html) e [`NDBCNTR`](/doc/ndb-internals/en/ndb-internals-kernel-blocks-ndbcntr.html) são iniciados. Os file systems dos data nodes são limpos naqueles data nodes que foram iniciados com a opção [`--initial`](mysql-cluster-programs-ndbd.html#option_ndbd_initial).

* **Fase 1.** Nesta fase, todos os blocks kernel [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") restantes são iniciados. As conexões do NDB Cluster são configuradas, as comunicações inter-block são estabelecidas e os heartbeats são iniciados. No caso de um node restart, as conexões do API node também são verificadas.

  Note

  Quando um ou mais Nodes ficam travados (hang) na Fase 1 enquanto o Node ou Nodes restantes ficam travados na Fase 2, isso geralmente indica problemas de network. Uma possível causa para tais problemas é um ou mais hosts do Cluster possuírem múltiplas network interfaces. Outra fonte comum de problemas que causa essa condição é o bloqueio de ports TCP/IP necessários para a comunicação entre os Cluster Nodes. Neste último caso, isso geralmente se deve a um firewall mal configurado.

* **Fase 2.** O kernel block `NDBCNTR` verifica os states de todos os Nodes existentes. O master node é escolhido, e o arquivo de schema do Cluster é inicializado.

* **Fase 3.** Os kernel blocks [`DBLQH`](/doc/ndb-internals/en/ndb-internals-kernel-blocks-dblqh.html) e [`DBTC`](/doc/ndb-internals/en/ndb-internals-kernel-blocks-dbtc.html) configuram as comunicações entre eles. O tipo de startup é determinado; se for um restart, o block [`DBDIH`](/doc/ndb-internals/en/ndb-internals-kernel-blocks-dbdih.html) obtém permissão para realizar o restart.

* **Fase 4.** Para um initial start ou initial node restart, os redo log files são criados. O número desses arquivos é igual a [`NoOfFragmentLogFiles`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-nooffragmentlogfiles).

  Para um system restart:

  + Ler o schema ou schemas.
  + Ler os dados a partir do local checkpoint.
  + Aplicar todas as informações de redo até que o latest restorable global checkpoint tenha sido alcançado.

  Para um node restart, encontrar o tail do redo log.

* **Fase 5.** A maior parte da porção de um data node start relacionada ao Database é realizada durante esta fase. Para um initial start ou system restart, um local checkpoint é executado, seguido por um global checkpoint. Verificações periódicas de uso de memory começam durante esta fase, e quaisquer node takeovers necessários são realizados.

* **Fase 6.** Nesta fase, os node groups são definidos e configurados.

* **Fase 7.** O arbitrator node é selecionado e começa a funcionar. O próximo backup ID é definido, assim como a velocidade de write do disk de backup. Os Nodes que atingem esta fase de start são marcados como `Started`. Agora é possível que API nodes (incluindo SQL nodes) se conectem ao Cluster.

* **Fase 8.** Se for um system restart, todos os Indexes são reconstruídos (pelo [`DBDIH`](/doc/ndb-internals/en/ndb-internals-kernel-blocks-dbdih.html)).

* **Fase 9.** As variáveis internas de startup do Node são redefinidas (reset).

* **Fase 100 (OBSOLETA).** Anteriormente, era neste ponto durante um node restart ou initial node restart que os API nodes podiam se conectar ao Node e começar a receber events. Atualmente, esta fase está vazia.

* **Fase 101.** Neste ponto em um node restart ou initial node restart, a entrega de events é transferida (handed over) para o Node que está se juntando ao Cluster. O Node recém-conectado assume a responsabilidade pela entrega de seus primary data aos subscribers. Esta fase também é conhecida como fase de handover do [`SUMA`](/doc/ndb-internals/en/ndb-internals-kernel-blocks-suma.html).

Após a conclusão deste processo para um initial start ou system restart, o transaction handling é habilitado. Para um node restart ou initial node restart, a conclusão do processo de startup significa que o Node agora pode atuar como um transaction coordinator.
