#### 25.6.15.61 A tabela ndbinfo tc_time_track_stats

A tabela `tc_time_track_stats` fornece informações de rastreamento de tempo obtidas das instâncias do bloco `DBTC` (TC) nos nós de dados, por meio do acesso do nó API ao `NDB`. Cada instância de TC rastrea as latências para um conjunto de atividades que ela realiza em nome dos nós API ou outros nós de dados; essas atividades incluem transações, erros de transação, leituras de chaves, escritas de chaves, operações de índices únicos, operações de chave falhas de qualquer tipo, varreduras, varreduras falhas, varreduras de fragmentos e varreduras de fragmentos falhas.

Um conjunto de contadores é mantido para cada atividade, cada contador cobrindo uma faixa de latências menores ou iguais a um limite superior. Ao final de cada atividade, sua latência é determinada e o contador apropriado incrementado. `tc_time_track_stats` apresenta essas informações como linhas, com uma linha para cada instância do seguinte:

* Nó de dados, usando seu ID
* Instância do bloco TC
* Outro nó de dados ou nó API que está se comunicando, usando seu ID
* Valor do limite superior

Cada linha contém um valor para cada tipo de atividade. Esse é o número de vezes que essa atividade ocorreu com uma latência dentro da faixa especificada pela linha (ou seja, onde a latência não excede o limite superior).

A tabela `tc_time_track_stats` contém as seguintes colunas:

* `node_id`

  ID do nó solicitante

* `block_number`

  Número do bloco TC

* `block_instance`

  Número da instância do bloco TC

* `comm_node_id`

  ID do nó que está se comunicando, seja API ou nó de dados

* `upper_bound`

  Valor do limite superior (em microsegundos)

* `scans`

  Baseado na duração das varreduras bem-sucedidas, desde a abertura até o fechamento, rastreadas contra os nós API ou nós de dados que as solicitam.

* `scan_errors`

Baseado na duração das varreduras de fragmentos que falharam, desde a abertura até o fechamento, rastreado contra as API ou nós de dados que as solicitam.

* `scan_fragments`

  Baseado na duração das varreduras de fragmentos bem-sucedidas, desde a abertura até o fechamento, rastreado contra os nós de dados que as executam

* `scan_fragment_errors`

  Baseado na duração das varreduras de fragmentos que falharam, desde a abertura até o fechamento, rastreado contra os nós de dados que as executam

* `transactions`

  Baseado na duração das transações bem-sucedidas, desde o início até o envio do commit `ACK`, rastreado contra a API ou os nós de dados que as solicitam. Transações estateless não são incluídas.

* `transaction_errors`

  Baseado na duração das transações que falharam, desde o início até o ponto de falha, rastreado contra a API ou os nós de dados que as solicitam.

* `read_key_ops`

  Baseado na duração das leituras bem-sucedidas de chaves primárias com bloqueios. Rastreado tanto contra a API ou o nó de dados que as solicitam quanto contra o nó de dados que as executa.

* `write_key_ops`

  Baseado na duração das escritas bem-sucedidas de chaves primárias, rastreado tanto contra a API ou o nó de dados que as solicitam quanto contra o nó de dados que as executa.

* `index_key_ops`

  Baseado na duração das operações bem-sucedidas de chaves de índices únicos, rastreado tanto contra a API ou o nó de dados que as solicitam quanto contra o nó de dados que executa leituras de tabelas base.

* `key_op_errors`

  Baseado na duração de todas as operações de leitura ou escrita de chaves que falharam, rastreado tanto contra a API ou o nó de dados que as solicitam quanto contra o nó de dados que as executa.

##### Notas

A coluna `block_instance` fornece o número da instância de bloco do kernel `DBTC`. Você pode usar isso junto com o nome do bloco para obter informações sobre threads específicas da tabela `threadblocks`.