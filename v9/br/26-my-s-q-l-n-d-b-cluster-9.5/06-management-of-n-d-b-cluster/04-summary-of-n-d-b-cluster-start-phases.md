### 25.6.4 Resumo das Fases de Início do NDB Cluster

Esta seção fornece um esboço simplificado das etapas envolvidas ao iniciar os nós de dados do NDB Cluster. Informações mais completas podem ser encontradas em Fases de Início do NDB Cluster, no *Guia Interno do NDB*.

Esses estágios são os mesmos relatados na saída do comando `node_id STATUS` no cliente de gerenciamento (veja a Seção 25.6.1, “Comandos no Cliente de Gerenciamento do NDB Cluster”). Esses estágios de início também são relatados na coluna `start_phase` da tabela `ndbinfo.nodes`.

**Tipos de início.** Existem vários tipos e modos de inicialização diferentes, conforme mostrado na seguinte lista:

* **Início inicial.** O cluster inicia com um sistema de arquivos limpo em todos os nós de dados. Isso ocorre quando o cluster é iniciado pela primeira vez ou quando todos os nós de dados são reiniciados usando a opção `--initial`.

  Nota

  Os arquivos de dados do disco não são removidos ao reiniciar um nó usando `--initial`.

* **Reinício do sistema.** O cluster inicia e lê os dados armazenados nos nós de dados. Isso ocorre quando o cluster é desligado após ter sido utilizado, quando se deseja que o cluster retome as operações a partir do ponto em que parou.

* **Reinício do nó.** Este é o reinício online de um nó do cluster enquanto o próprio cluster está em execução.

* **Reinício inicial do nó.** Este é o mesmo que um reinício de nó, exceto que o nó é reiniciado e iniciado com um sistema de arquivos limpo.

**Configuração e inicialização (fase -1).** Antes do início, cada nó de dados (processo **ndbd**) deve ser inicializado. A inicialização consiste nas seguintes etapas:

1. Obter um ID de nó
2. Recuperar dados de configuração
3. Alocar portas a serem usadas para comunicações entre nós
4. Alocar memória de acordo com as configurações obtidas do arquivo de configuração

Quando um nó de dados ou um nó SQL se conecta pela primeira vez ao nó de gerenciamento, ele reserva um ID de nó do cluster. Para garantir que nenhum outro nó aloque o mesmo ID de nó, esse ID é mantido até que o nó tenha conseguido se conectar ao cluster e pelo menos um **ndbd** informe que esse nó está conectado. Essa retenção do ID de nó é protegida pela conexão entre o nó em questão e **ndb_mgmd**.

Após a inicialização de cada nó de dados, o processo de inicialização do cluster pode prosseguir. As etapas pelas quais o cluster passa durante esse processo estão listadas aqui:

* **Fase 0.** Os blocos `NDBFS` e `NDBCNTR` começam. Os sistemas de arquivos de nó de dados são limpos nos nós de dados que foram iniciados com a opção `--initial`.

* **Fase 1.** Nesta etapa, todos os blocos do kernel `NDB` restantes são iniciados. As conexões do NDB Cluster são configuradas, as comunicações entre blocos são estabelecidas e os batimentos cardíacos são iniciados. No caso de um reinício do nó, as conexões do nó API também são verificadas.

  Nota

  Quando um ou mais nós ficam presos na Fase 1 enquanto o nó ou nós restantes ficam presos na Fase 2, isso geralmente indica problemas de rede. Uma possível causa desses problemas é que um ou mais hosts do cluster tenham múltiplas interfaces de rede. Outra fonte comum de problemas que causam essa condição é o bloqueio de portas TCP/IP necessárias para as comunicações entre nós do cluster. No último caso, isso geralmente é devido a um firewall mal configurado.

* **Fase 2.** O bloco de kernel `NDBCNTR` verifica os estados de todos os nós existentes. O nó mestre é escolhido e o arquivo do esquema do cluster é inicializado.

* **Fase 3.** Os blocos de kernel `DBLQH` e `DBTC` configuram as comunicações entre eles. O tipo de inicialização é determinado; se for um reinício, o bloco `DBDIH` obtém permissão para realizar o reinício.

* **Fase 4.** Para um início inicial ou reinício inicial do nó, os arquivos de log de reverso são criados. O número desses arquivos é igual a `NoOfFragmentLogFiles`.

  Para um reinício do sistema:

  + Leia o esquema ou esquemas.
  + Leia os dados do ponto de verificação local.
  + Aplique todas as informações de reverso até que o último ponto de verificação global recuperável tenha sido alcançado.

  Para um reinício do nó, encontre a cauda do log de reverso.

* **Fase 5.** A maior parte da parte relacionada ao banco de dados de um nó de dados é realizada durante esta fase. Para um início inicial ou reinício do sistema, um ponto de verificação local é executado, seguido de um ponto de verificação global. Verificações periódicas do uso de memória começam durante esta fase, e quaisquer retomadas de nó necessárias são realizadas.

* **Fase 6.** Nesta fase, grupos de nó são definidos e configurados.

* **Fase 7.** O nó árbitro é selecionado e começa a funcionar. O próximo ID de backup é definido, assim como a velocidade de escrita do disco de backup. Nós que atingem esta fase de início são marcados como `Started`. Agora é possível que nós API (incluindo nós SQL) se conectem ao clúster.

* **Fase 8.** Se este for um reinício do sistema, todos os índices são reconstruídos (pelo `DBDIH`).

* **Fase 9.** As variáveis de inicialização interna do nó são redefinidas.

* **Fase 100 (DESUTILIZADA).** Anteriormente, era neste ponto durante um reinício do nó ou um início inicial do nó que os nós API podiam se conectar ao nó e começar a receber eventos. Atualmente, esta fase está vazia.

* **Fase 101.** Neste ponto de um reinício do nó ou um início inicial do nó, a entrega de eventos é entregue ao nó que está se juntando ao clúster. O nó recém-juntado assume a responsabilidade de entregar seus dados primários aos assinantes. Esta fase também é referida como fase de entrega `SUMA`.

Após esse processo ser concluído para um início inicial ou reinício do sistema, o gerenciamento de transações é habilitado. Para um reinício do nó ou um reinício inicial do nó, a conclusão do processo de inicialização significa que o nó agora pode atuar como um coordenador de transações.