#### 25.6.15.13 Contas do ndbinfo Tabela

A tabela `counters` fornece os totais em execução de eventos como leituras e escritas para blocos de kernel específicos e nós de dados. Os conteus são mantidos a partir do início ou reinício mais recente do nó; um início ou reinício do nó redefre o contador em todos os nós. Nem todos os blocos de kernel têm todos os tipos de contadores.

A tabela `counters` contém as seguintes colunas:

* `node_id`

  O ID do nó de dados

* `block_name`

  Nome do bloco de kernel NDB associado (veja Blocos de Kernel NDB).

* `block_instance`

  Instância do bloco

* `counter_id`

  O número interno do ID do contador; normalmente um inteiro entre 1 e 10, inclusive.

* `counter_name`

  O nome do contador. Veja o texto para os nomes dos contadores individuais e o bloco de kernel NDB com o qual cada contador está associado.

* `val`

  O valor do contador

##### Notas

Cada contador está associado a um bloco de kernel NDB específico.

O contador `OPERATIONS` está associado ao bloco de kernel `DBLQH` (controlador de consulta local). Uma leitura de chave primária é contada como uma operação, assim como uma atualização de chave primária. Para leituras, há uma operação em `DBLQH` por operação em `DBTC`. Para escritas, há uma operação contada por replica de fragmento.

Os contadores `ATTRINFO`, `TRANSACTIONS`, `COMMITS`, `READS`, `LOCAL_READS`, `SIMPLE_READS`, `WRITES`, `LOCAL_WRITES`, `ABORTS`, `TABLE_SCANS` e `RANGE_SCANS` estão associados ao bloco de kernel `DBTC` (coordenador de transações).

`LOCAL_WRITES` e `LOCAL_READS` são operações de chave primária usando um coordenador de transação em um nó que também contém a replica de fragmento primária do registro.

O contador `READS` inclui todas as leituras. `LOCAL_READS` inclui apenas aquelas leituras da replica do fragmento primário no mesmo nó que este coordenador de transações. `SIMPLE_READS` inclui apenas aquelas leituras nas quais a operação de leitura é a operação de início e término para uma transação específica. As leituras simples não mantêm bloqueios, mas fazem parte de uma transação, pois observam as alterações não confirmadas feitas pela transação que as contém, mas não de outras transações não confirmadas. Tais leituras são “simples” do ponto de vista do bloco TC; como não mantêm bloqueios, não são duráveis, e uma vez que o `DBTC` as encaminhou para o bloco LQH relevante, não mantém estado para elas.

`ATTRINFO` mantém um contador do número de vezes que um programa interpretado é enviado ao nó de dados. Consulte Mensagens de Protocolo NDB para obter mais informações sobre as mensagens `ATTRINFO` no kernel `NDB`.

Os contadores `LOCAL_TABLE_SCANS_SENT`, `READS_RECEIVED`, `PRUNED_RANGE_SCANS_RECEIVED`, `RANGE_SCANS_RECEIVED`, `LOCAL_READS_SENT`, `CONST_PRUNED_RANGE_SCANS_RECEIVED`, `LOCAL_RANGE_SCANS_SENT`, `REMOTE_READS_SENT`, `REMOTE_RANGE_SCANS_SENT`, `READS_NOT_FOUND`, `SCAN_BATCHES_RETURNED`, `TABLE_SCANS_RECEIVED` e `SCAN_ROWS_RETURNED` estão associados ao bloco de kernel `DBSPJ` (join empurrado para baixo).

As colunas `block_name` e `block_instance` fornecem, respectivamente, o nome do bloco do kernel NDB aplicável e o número de instância. Você pode usar essas informações para obter informações sobre threads específicas da tabela `threadblocks`.

Vários contadores fornecem informações sobre sobrecarga do transportador e dimensionamento do buffer de envio ao solucionar tais problemas. Para cada instância LQH, há uma instância de cada contador na seguinte lista:

* `LQHKEY_OVERLOAD`: Número de solicitações de chave primária rejeitadas na instância do bloco LQH devido ao sobrecarregamento do transportador

* `LQHKEY_OVERLOAD_TC`: Contagem de instâncias de `LQHKEY_OVERLOAD` em que o transportador do nó TC foi sobrecarregado

* `LQHKEY_OVERLOAD_READER`: Contagem de instâncias de `LQHKEY_OVERLOAD` em que o nó do leitor da API (leitura apenas) foi sobrecarregado.

* `LQHKEY_OVERLOAD_NODE_PEER`: Contagem de instâncias de `LQHKEY_OVERLOAD` em que o próximo nó de dados de backup (escrita apenas) foi sobrecarregado

* `LQHKEY_OVERLOAD_SUBSCRIBER`: Contagem de instâncias de `LQHKEY_OVERLOAD` em que um assinante de eventos (escrita apenas) foi sobrecarregado.

* `LQHSCAN_SLOWDOWNS`: Contagem de instâncias em que o tamanho de um lote de varredura de fragmentos foi reduzido devido ao sobrecarregamento do transportador da API de varredura.