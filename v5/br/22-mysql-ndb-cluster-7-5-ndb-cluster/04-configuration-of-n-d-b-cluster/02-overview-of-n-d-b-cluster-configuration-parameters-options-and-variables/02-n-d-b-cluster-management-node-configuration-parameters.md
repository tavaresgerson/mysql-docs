#### 21.4.2.2 Parâmetros de Configuração do Node de Gerenciamento do NDB Cluster

A listagem nesta seção fornece informações sobre os parâmetros usados na seção `[ndb_mgmd]` ou `[mgm]` de um arquivo `config.ini` para configurar os nodes de gerenciamento do NDB Cluster. Para descrições detalhadas e outras informações adicionais sobre cada um desses parâmetros, consulte [Section 21.4.3.5, “Defining an NDB Cluster Management Server”](mysql-cluster-mgm-definition.html "21.4.3.5 Defining an NDB Cluster Management Server").

* `ArbitrationDelay`: Quando solicitado a arbitrar, o *arbitrator* espera por este período antes de votar (milissegundos).

* `ArbitrationRank`: Se 0, o node de gerenciamento não é um *arbitrator*. O *Kernel* seleciona os *arbitrators* na ordem 1, 2.

* `DataDir`: Data directory para este node.

* `ExecuteOnComputer`: String que referencia um COMPUTER definido anteriormente.

* `ExtraSendBufferMemory`: Memory a ser usada para *send buffers* adicionalmente a qualquer *memory* alocada por TotalSendBufferMemory ou SendBufferMemory. O Default (0) permite até 16MB.

* `HeartbeatIntervalMgmdMgmd`: Tempo entre os *heartbeats* de node de gerenciamento para node de gerenciamento; a conexão entre os nodes de gerenciamento é considerada perdida após 3 *heartbeats* não recebidos.

* `HeartbeatThreadPriority`: Define a política e a *priority* da *heartbeat thread* para nodes de gerenciamento; consulte o manual para valores permitidos.

* `HostName`: Host name ou endereço IP para este node de gerenciamento.

* `Id`: Número que identifica o node de gerenciamento. Agora descontinuado (*deprecated*); use NodeId em vez disso.

* `LocationDomainId`: Atribui este node de gerenciamento a um *availability domain* ou *zone* específico. 0 (*default*) mantém esta configuração não definida.

* `LogDestination`: Onde enviar as mensagens de *log*: console, *system log* ou arquivo de *log* especificado.

* `NodeId`: Número que identifica o node de gerenciamento de forma única entre todos os nodes no *cluster*.

* `PortNumber`: Port number para enviar comandos e buscar a configuração do *management server*.

* `PortNumberStats`: Port number usada para obter informações estatísticas do *management server*.

* `TotalSendBufferMemory`: Total de *memory* a ser usada para todos os *transporter send buffers*.

* `wan`: Usa a configuração WAN TCP como *default*.

**Nota**

Após fazer alterações na configuração de um node de gerenciamento, é necessário realizar um *rolling restart* do *cluster* para que a nova configuração entre em vigor. Consulte [Section 21.4.3.5, “Defining an NDB Cluster Management Server”](mysql-cluster-mgm-definition.html "21.4.3.5 Defining an NDB Cluster Management Server"), para mais informações.

Para adicionar novos *management servers* a um NDB Cluster em execução, também é necessário realizar um *rolling restart* de todos os *cluster nodes* após modificar quaisquer arquivos `config.ini` existentes. Para mais informações sobre problemas que surgem ao usar múltiplos nodes de gerenciamento, consulte [Section 21.2.7.10, “Limitations Relating to Multiple NDB Cluster Nodes”](mysql-cluster-limitations-multiple-nodes.html "21.2.7.10 Limitations Relating to Multiple NDB Cluster Nodes").