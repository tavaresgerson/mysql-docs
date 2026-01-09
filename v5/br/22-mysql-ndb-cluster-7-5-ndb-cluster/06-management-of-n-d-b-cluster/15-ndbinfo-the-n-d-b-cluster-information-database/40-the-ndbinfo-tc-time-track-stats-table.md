#### 21.6.15.40 A tabela ndbinfo tc_time_track_stats

A tabela `tc_time_track_stats` fornece informações de rastreamento de tempo obtidas das instâncias do bloco `TC` (TC) nos nós de dados, por meio do acesso ao `NDB` (NDB) através dos nós de API. Cada instância TC rastreia as latências para um conjunto de atividades que realiza em nome dos nós de API ou outros nós de dados; essas atividades incluem transações, erros de transação, leituras de chaves, escritas de chaves, operações de índices únicos, operações de chave falhas de qualquer tipo, varreduras, varreduras falhas, varreduras de fragmentos e varreduras de fragmentos falhas.

Um conjunto de contadores é mantido para cada atividade, cada contador cobrindo uma faixa de latências iguais ou menores que um limite superior. Ao final de cada atividade, sua latência é determinada e o contador apropriado é incrementado. `tc_time_track_stats` apresenta essas informações como linhas, com uma linha para cada instância do seguinte:

- Nodo de dados, usando seu ID
- Instância de bloqueio de TC
- Outro nó de comunicação de dados ou nó de API, usando seu ID
- Valor superior limite

##### Notas

Cada linha contém um valor para cada tipo de atividade. Este é o número de vezes que essa atividade ocorreu com uma latência dentro do intervalo especificado pela linha (ou seja, onde a latência não excede o limite superior).

A tabela `tc_time_track_stats` contém as seguintes colunas:

- `node_id`

  Solicitar o ID do nó

- `número_de_bloco`

  Número do bloco TC

- `block_instance`

  Número da instância do bloco TC

- `comm_node_id`

  ID do nó da API ou do nó de dados que está se comunicando

- `superior_limite`

  Limite superior do intervalo (em microsegundos)

- `análises`

  Com base na duração das varreduras bem-sucedidas, desde a abertura até o fechamento, monitorada contra a API ou os nós de dados que as solicitam.

- `scan_errors`

  Com base na duração das varreduras que falharam, desde a abertura até o fechamento, acompanhadas pela API ou pelos nós de dados que as solicitam.

- `scan_fragments`

  Com base na duração das varreduras de fragmentos bem-sucedidas, desde a abertura até o fechamento, acompanhadas dos nós de dados que as executam

- `scan_fragment_errors`

  Com base na duração das varreduras de fragmentos que falharam, desde a abertura até o fechamento, acompanhadas dos nós de dados que as executaram

- "transações"

  Baseado na duração das transações bem-sucedidas, desde o início até o envio do commit `ACK`, monitorado contra as APIs ou nós de dados que os solicitam. As transações sem estado não são incluídas.

- `erros_transação`

  Com base na duração das transações que falharam, do início até o ponto de falha, acompanhada da API ou dos nós de dados que as solicitam.

- `read_key_ops`

  Baseado na duração das leituras bem-sucedidas da chave primária com bloqueios. Acompanhado tanto da API ou do nó de dados que os solicitam quanto do nó de dados que os executa.

- `write_key_ops`

  Com base na duração das escritas bem-sucedidas da chave primária, acompanhadas tanto da API ou do nó de dados que as solicitou quanto do nó de dados que as executou.

- `index_key_ops`

  Com base na duração das operações de chave de índice únicas bem-sucedidas, monitoradas tanto na API ou no nó de dados que as solicitam quanto no nó de dados que executa leituras de tabelas de base.

- `key_op_errors`

  Com base na duração de todas as operações de leitura ou escrita de chave não bem-sucedidas, acompanhadas tanto da API ou do nó de dados que as solicitou quanto do nó de dados que as executou.

A coluna `block_instance` fornece o número da instância de bloco do kernel `DBTC`. Você pode usar isso junto com o nome do bloco para obter informações sobre threads específicas da tabela `threadblocks`.
