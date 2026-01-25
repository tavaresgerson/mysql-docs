#### 21.6.15.10 A Tabela ndbinfo counters

A tabela `counters` fornece totais em execução de eventos, como reads e writes, para kernel blocks específicos e data nodes. As contagens são mantidas desde a inicialização ou reinicialização mais recente do node; uma inicialização ou reinicialização do node zera todos os counters nesse node. Nem todos os kernel blocks possuem todos os tipos de counters.

A tabela `counters` contém as seguintes colunas:

* `node_id`

  O ID do data node

* `block_name`

  Nome do NDB kernel block associado (consulte [NDB Kernel Blocks](/doc/ndb-internals/en/ndb-internals-kernel-blocks.html)).

* `block_instance`

  Instância do Block

* `counter_id`

  O número ID interno do counter; normalmente um inteiro entre 1 e 10, inclusive.

* `counter_name`

  O nome do counter. Consulte o texto para nomes de counters individuais e o NDB kernel block ao qual cada counter está associado.

* `val`

  O valor do counter

##### Notas

Cada counter está associado a um NDB kernel block específico.

O counter `OPERATIONS` está associado ao kernel block [`DBLQH`](/doc/ndb-internals/en/ndb-internals-kernel-blocks-dblqh.html) (local query handler) (consulte [The DBLQH Block](/doc/ndb-internals/en/ndb-internals-kernel-blocks-dblqh.html)). Uma primary-key read conta como uma operation, assim como um primary-key update. Para reads, há uma operation em [`DBLQH`](/doc/ndb-internals/en/ndb-internals-kernel-blocks-dblqh.html) por operation em [`DBTC`](/doc/ndb-internals/en/ndb-internals-kernel-blocks-dbtc.html). Para writes, há uma operation contada por fragment replica.

Os counters `ATTRINFO`, `TRANSACTIONS`, `COMMITS`, `READS`, `LOCAL_READS`, `SIMPLE_READS`, `WRITES`, `LOCAL_WRITES`, `ABORTS`, `TABLE_SCANS` e `RANGE_SCANS` estão associados ao kernel block DBTC (transaction co-ordinator) (consulte [The DBTC Block](/doc/ndb-internals/en/ndb-internals-kernel-blocks-dbtc.html)).

`LOCAL_WRITES` e `LOCAL_READS` são operations de primary-key que usam um transaction coordinator em um node que também contém a primary fragment replica do registro.

O counter `READS` inclui todas as reads. `LOCAL_READS` inclui apenas aquelas reads da primary fragment replica no mesmo node que este transaction coordinator. `SIMPLE_READS` inclui apenas aquelas reads nas quais a operation de read é a operation de início e fim para uma determinada transaction. Simple reads não mantêm locks, mas fazem parte de uma transaction, no sentido de que observam alterações não confirmadas feitas pela transaction que as contém, mas não de quaisquer outras transactions não confirmadas. Tais reads são “simples” do ponto de vista do block TC; como não mantêm locks, elas não são duráveis e, assim que [`DBTC`](/doc/ndb-internals/en/ndb-internals-kernel-blocks-dbtc.html) as roteia para o block LQH relevante, ele não mantém state para elas.

`ATTRINFO` mantém uma contagem do número de vezes que um programa interpretado é enviado ao data node. Consulte [NDB Protocol Messages](/doc/ndb-internals/en/ndb-internals-ndb-protocol-messages.html) para obter mais informações sobre mensagens `ATTRINFO` no NDB kernel.

Os counters `LOCAL_TABLE_SCANS_SENT`, `READS_RECEIVED`, `PRUNED_RANGE_SCANS_RECEIVED`, `RANGE_SCANS_RECEIVED`, `LOCAL_READS_SENT`, `CONST_PRUNED_RANGE_SCANS_RECEIVED`, `LOCAL_RANGE_SCANS_SENT`, `REMOTE_READS_SENT`, `REMOTE_RANGE_SCANS_SENT`, `READS_NOT_FOUND`, `SCAN_BATCHES_RETURNED`, `TABLE_SCANS_RECEIVED` e `SCAN_ROWS_RETURNED` estão associados ao kernel block [`DBSPJ`](/doc/ndb-internals/en/ndb-internals-kernel-blocks-dbspj.html) (select push-down join) (consulte [The DBSPJ Block](/doc/ndb-internals/en/ndb-internals-kernel-blocks-dbspj.html)).

As colunas `block_name` e `block_instance` fornecem, respectivamente, o nome e o número da instância do NDB kernel block aplicável. Você pode usá-las para obter informações sobre threads específicos da tabela [`threadblocks`](mysql-cluster-ndbinfo-threadblocks.html "21.6.15.41 The ndbinfo threadblocks Table").

Vários counters fornecem informações sobre transporter overload (sobrecarga de transportador) e dimensionamento de send buffer ao solucionar tais problemas. Para cada instância LQH, há uma instância de cada counter na lista a seguir:

* `LQHKEY_OVERLOAD`: Número de solicitações de primary key rejeitadas na instância do block LQH devido a transporter overload

* `LQHKEY_OVERLOAD_TC`: Contagem de instâncias de `LQHKEY_OVERLOAD` onde o transporter do node TC estava sobrecarregado

* `LQHKEY_OVERLOAD_READER`: Contagem de instâncias de `LQHKEY_OVERLOAD` onde o node API reader (somente reads) estava sobrecarregado.

* `LQHKEY_OVERLOAD_NODE_PEER`: Contagem de instâncias de `LQHKEY_OVERLOAD` onde o próximo backup data node (somente writes) estava sobrecarregado

* `LQHKEY_OVERLOAD_SUBSCRIBER`: Contagem de instâncias de `LQHKEY_OVERLOAD` onde um event subscriber (somente writes) estava sobrecarregado.

* `LQHSCAN_SLOWDOWNS`: Contagem de instâncias onde o tamanho do batch de fragment scan foi reduzido devido a scanning API transporter overload.