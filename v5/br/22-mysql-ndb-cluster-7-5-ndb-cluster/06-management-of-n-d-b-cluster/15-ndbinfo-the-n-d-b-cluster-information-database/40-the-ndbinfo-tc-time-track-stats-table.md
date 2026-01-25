#### 21.6.15.40 A Tabela ndbinfo tc_time_track_stats

A tabela `tc_time_track_stats` fornece informações de rastreamento de tempo obtidas das instâncias do bloco [`DBTC`](/doc/ndb-internals/en/ndb-internals-kernel-blocks-dbtc.html) (TC) nos nós de dados, por meio do acesso `NDB` dos nós de API. Cada instância TC rastreia latências para um conjunto de atividades que ela realiza em nome de nós de API ou outros nós de dados; essas atividades incluem transactions, erros de transaction, leituras de Key, escritas de Key, operações de Unique Index, operações de Key falhas de qualquer tipo, scans, scans falhos, fragment scans e fragment scans falhos.

Um conjunto de contadores é mantido para cada atividade, cobrindo cada contador um intervalo de latências menor ou igual a um limite superior (`upper bound`). Ao final de cada atividade, sua latência é determinada e o contador apropriado é incrementado. A tabela `tc_time_track_stats` apresenta essa informação como linhas, com uma linha para cada instância do seguinte:

* Nó de dados, usando seu ID
* Instância do bloco TC
* Outro nó de dados ou nó de API comunicante, usando seu ID
* Valor do limite superior (`upper bound`)

##### Notas

Cada linha contém um valor para cada tipo de atividade. Este é o número de vezes que esta atividade ocorreu com uma latência dentro do intervalo especificado pela linha (ou seja, onde a latência não excede o limite superior).

A tabela `tc_time_track_stats` contém as seguintes colunas:

| Coluna | Descrição |
| :--- | :--- |
| `node_id` | ID do nó solicitante |
| `block_number` | Número do bloco TC |
| `block_instance` | Número da instância do bloco TC |
| `comm_node_id` | ID do nó de API ou nó de dados comunicante |
| `upper_bound` | Limite superior do intervalo (em microssegundos) |
| `scans` | Baseado na duração de scans bem-sucedidos, desde a abertura até o fechamento, rastreados em relação aos nós de API ou de dados que os solicitam. |
| `scan_errors` | Baseado na duração de scans falhos, desde a abertura até o fechamento, rastreados em relação aos nós de API ou de dados que os solicitam. |
| `scan_fragments` | Baseado na duração de fragment scans bem-sucedidos, desde a abertura até o fechamento, rastreados em relação aos nós de dados que os executam. |
| `scan_fragment_errors` | Baseado na duração de fragment scans falhos, desde a abertura até o fechamento, rastreados em relação aos nós de dados que os executam. |
| `transactions` | Baseado na duração de transactions bem-sucedidas, desde o início até o envio do `ACK` de commit, rastreadas em relação aos nós de API ou de dados que as solicitam. Transactions *stateless* não estão incluídas. |
| `transaction_errors` | Baseado na duração de transactions falhas, desde o início até o ponto de falha, rastreadas em relação aos nós de API ou de dados que as solicitam. |
| `read_key_ops` | Baseado na duração de leituras de Primary Key bem-sucedidas com Locks. Rastreadeas em relação tanto ao nó de API ou de dados que as solicitam quanto ao nó de dados que as executa. |
| `write_key_ops` | Baseado na duração de escritas de Primary Key bem-sucedidas, rastreadas em relação tanto ao nó de API ou de dados que as solicitam quanto ao nó de dados que as executa. |
| `index_key_ops` | Baseado na duração de operações de Unique Index Key bem-sucedidas, rastreadas em relação tanto ao nó de API ou de dados que as solicitam quanto ao nó de dados que executa as leituras de tabelas base. |
| `key_op_errors` | Baseado na duração de todas as operações de leitura ou escrita de Key malsucedidas, rastreadas em relação tanto ao nó de API ou de dados que as solicitam quanto ao nó de dados que as executa. |

A coluna `block_instance` fornece o número da instância do bloco de kernel [`DBTC`](/doc/ndb-internals/en/ndb-internals-kernel-blocks-dbtc.html). Você pode usar isso junto com o nome do bloco para obter informações sobre Threads específicos da tabela [`threadblocks`](mysql-cluster-ndbinfo-threadblocks.html "21.6.15.41 The ndbinfo threadblocks Table").