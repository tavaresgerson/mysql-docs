#### 19.2.3.2 Monitoramento das Threads do Trabalhador do Aplicador de Replicação

Em uma replica multithreaded, as tabelas do Schema de Desempenho `replication_applier_status_by_coordinator` e `replication_applier_status_by_worker` mostram informações de status para a thread do coordenador da replica e, respectivamente, as threads do trabalhador do aplicável. Para uma replica com múltiplos canais, as threads de cada canal são identificadas.

A thread do coordenador de uma replica multithreaded também imprime estatísticas no log de erro da replica regularmente, se a configuração de verbosidade for definida para exibir mensagens informativas. As estatísticas são impressas dependendo do volume de eventos que a thread do coordenador atribuiu às threads do trabalhador do aplicável, com uma frequência máxima de uma vez a cada 120 segundos. A mensagem lista as seguintes estatísticas para o canal de replicação relevante, ou o canal de replicação padrão (que não tem nome):

Segundos decorridos:   A diferença em segundos entre a hora atual e a última vez que essas informações foram impressas no log de erro.

Eventos atribuídos:   O número total de eventos que a thread do coordenador enfileirou para todas as threads do trabalhador do aplicável desde que a thread do coordenador foi iniciada.

Filhos de fila de trabalhador cheios acima do nível de excesso:   O número atual de eventos que estão enfileirados em qualquer uma das threads do trabalhador do aplicável em excesso do nível de excesso, que é definido em 90% do comprimento máximo da fila de 16384 eventos. Se esse valor for zero, nenhuma thread do trabalhador do aplicável está operando no limite superior de sua capacidade.

Aguardado devido à fila de trabalhador cheia:   O número de vezes que a thread do coordenador teve que esperar para agendar um evento porque a fila de uma thread do trabalhador do aplicável estava cheia. Se esse valor for zero, nenhuma thread do trabalhador do aplicável esgotou sua capacidade.

Aguardou devido ao tamanho total:   O número de vezes que o fio do coordenador teve que esperar para agendar um evento porque o limite `replica_pending_jobs_size_max` havia sido atingido. Esta variável de sistema define a quantidade máxima de memória (em bytes) disponível para as filas de threads de aplicador que estão segurando eventos ainda não aplicados. Se um evento anormalmente grande exceder esse tamanho, a transação é suspensa até que todas as filas de threads de aplicador estejam vazias, e então processada. Todas as transações subsequentes são suspensas até que a grande transação seja concluída.

Aguardou por conflitos de relógio:   O número de nanosegundos que o fio do coordenador teve que esperar para agendar um evento porque uma transação da qual o evento dependia ainda não havia sido comprometida.

Aguardou (contagem) quando os trabalhadores estavam ocupados:   O número de vezes que o fio do coordenador dormiu por um curto período, o que ele pode fazer se o fio do coordenador atribuir um evento e encontrar a fila do thread de aplicador ocupada além do nível de suborno de 10% do comprimento máximo da fila, caso em que ele dorme por um máximo de 1 milissegundo.