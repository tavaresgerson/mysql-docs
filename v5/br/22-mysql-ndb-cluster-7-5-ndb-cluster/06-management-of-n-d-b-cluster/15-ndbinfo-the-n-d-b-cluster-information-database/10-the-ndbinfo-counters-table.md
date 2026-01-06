#### 21.6.15.10 Contas da tabela ndbinfo

A tabela `counters` fornece totalizações em tempo real de eventos, como leituras e escritas, para blocos do kernel e nós de dados específicos. Os conteus são mantidos a partir do início ou reinício mais recente do nó; um início ou reinício do nó redefiniu todos os conteus nesse nó. Nem todos os blocos do kernel têm todos os tipos de conteus.

A tabela `counters` contém as seguintes colunas:

- `node_id`

  O ID do nó de dados

- `nome_do_bloco`

  Nome do bloco de kernel NDB associado (consulte Blocos de Kernel NDB).

- `block_instance`

  Bloquear instância

- `counter_id`

  O número de identificação interno do caixa; normalmente um número inteiro entre 1 e 10, inclusive.

- `nome_do_contador`

  O nome do contador. Veja o texto para os nomes dos contadores individuais e o bloco do kernel NDB com o qual cada contador está associado.

- `val`

  O valor do mostrador

##### Notas

Cada contador está associado a um bloco específico do kernel NDB.

O contador `OPERATIONS` está associado ao bloco do kernel `DBLQH` (gerenciador de consultas locais) (veja O bloco DBLQH). Uma leitura de chave primária é considerada uma operação, assim como uma atualização de chave primária. Para leituras, há uma operação em `DBLQH` por operação em `DBTC`. Para escritas, há uma operação contada por replica de fragmento.

Os contadores `ATTRINFO`, `TRANSACTIONS`, `COMMITS`, `READS`, `LOCAL_READS`, `SIMPLE_READS`, `WRITES`, `LOCAL_WRITES`, `ABORTS`, `TABLE_SCANS` e `RANGE_SCANS` estão associados ao bloco do kernel DBTC (coordenador de transações) (veja O bloco DBTC).

`LOCAL_WRITES` e `LOCAL_READS` são operações de chave primária que utilizam um coordenador de transação em um nó que também contém a replica primária do fragmento do registro.

O contador `READS` inclui todas as leituras. `LOCAL_READS` inclui apenas aquelas leituras da replica primária do fragmento no mesmo nó que este coordenador de transação. `SIMPLE_READS` inclui apenas aquelas leituras nas quais a operação de leitura é a operação de início e término para uma determinada transação. As leituras simples não mantêm bloqueios, mas fazem parte de uma transação, pois observam as alterações não confirmadas feitas pela transação que as contém, mas não por nenhuma outra transação não confirmada. Tais leituras são “simples” do ponto de vista do bloco `DBTC` (ver `/doc/ndb-internals/en/ndb-internals-kernel-blocks-dbtc.html`); como não mantêm bloqueios, elas não são duráveis, e uma vez que o `DBTC` as encaminhou para o bloco LQH relevante, ele não mantém nenhum estado para elas.

`ATTRINFO` mantém um contador do número de vezes que um programa interpretado é enviado ao nó de dados. Consulte Mensagens de Protocolo NDB para obter mais informações sobre as mensagens `ATTRINFO` no kernel `NDB`.

Os contadores `LOCAL_TABLE_SCANS_SENT`, `READS_RECEIVED`, `PRUNED_RANGE_SCANS_RECEIVED`, `RANGE_SCANS_RECEIVED`, `LOCAL_READS_SENT`, `CONST_PRUNED_RANGE_SCANS_RECEIVED`, `LOCAL_RANGE_SCANS_SENT`, `REMOTE_READS_SENT`, `REMOTE_RANGE_SCANS_SENT`, `READS_NOT_FOUND`, `SCAN_BATCHES_RETURNED`, `TABLE_SCANS_RECEIVED` e `SCAN_ROWS_RETURNED` estão associados ao bloco do kernel `DBSPJ` (join de empilhamento seletivo), conforme descrito em O bloco DBSPJ.

As colunas `block_name` e `block_instance` fornecem, respectivamente, o nome do bloco do kernel NDB aplicável e o número de instância. Você pode usar essas informações para obter informações sobre threads específicas a partir da tabela `threadblocks`.

Vários contadores fornecem informações sobre a sobrecarga do transportador e enviam o dimensionamento do buffer ao solucionar esses problemas. Para cada instância do LQH, há uma instância de cada contador na lista a seguir:

- `LQHKEY_OVERLOAD`: Número de solicitações de chave primária rejeitadas na instância do bloco LQH devido ao sobrecarga do transportador

- `LQHKEY_OVERLOAD_TC`: Número de instâncias de `LQHKEY_OVERLOAD` em que o transportador do nó TC foi sobrecarregado

- `LQHKEY_OVERLOAD_READER`: Número de instâncias de `LQHKEY_OVERLOAD` em que o nó do leitor da API (leia apenas) foi sobrecarregado.

- `LQHKEY_OVERLOAD_NODE_PEER`: Número de instâncias de `LQHKEY_OVERLOAD` onde o próximo nó de dados de backup (apenas gravações) foi sobrecarregado

- `LQHKEY_OVERLOAD_SUBSCRIBER`: Número de instâncias de `LQHKEY_OVERLOAD` em que um assinante de eventos (escreve apenas) foi sobrecarregado.

- `LQHSCAN_SLOWDOWNS`: Número de instâncias em que o tamanho do lote de varredura de fragmentos foi reduzido devido ao sobrecarregamento do transportador da API de varredura.
