#### 16.2.3.2 Monitoramento das Threads do Trabalhador do Aplicativo de Aplicação de Replicação

Em uma replica multithreading, as tabelas do Schema de Desempenho `replication_applier_status_by_coordinator` e `replication_applier_status_by_worker` mostram informações de status para as threads do coordenador da replica e, respectivamente, para as threads do trabalhador do aplicador. Para uma replica com vários canais, as threads de cada canal são identificadas.

O fio de coordenação de uma replica multithread também imprime estatísticas no log de erros da replica regularmente, se a configuração de granularidade estiver definida para exibir mensagens informativas. As estatísticas são impressas dependendo do volume de eventos que o fio de coordenação atribuiu aos fios de trabalho do aplicável, com uma frequência máxima de uma vez a cada 120 segundos. A mensagem lista as seguintes estatísticas para o canal de replicação relevante ou o canal de replicação padrão (que não tem nome):

Segundos decorridos: A diferença em segundos entre a hora atual e a última vez que essas informações foram impressas no log de erros.

Eventos atribuídos: O número total de eventos que o fio de coordenador colocou em fila para todos os fios de trabalhador do aplicador desde que o fio de coordenador foi iniciado.

As filas de trabalhadores estão cheias além do limite de sobrecarga: O número atual de eventos que estão em fila em qualquer um dos threads de trabalhadores do aplicável, além do limite de sobrecarga, que é definido em 90% do comprimento máximo da fila de 16.384 eventos. Se esse valor for zero, nenhum thread de trabalhador do aplicável está operando no limite superior de sua capacidade.

Esperou devido à fila de trabalhador estar cheia:   O número de vezes que o fio do coordenador teve que esperar para agendar um evento porque a fila de um fio de trabalhador solicitador estava cheia. Se esse valor for zero, nenhum fio de trabalhador solicitador esgotou sua capacidade.

Esperou devido ao tamanho total:   O número de vezes que o fio de coordenador teve que esperar para agendar um evento porque o limite `slave_pending_jobs_size_max` havia sido atingido. Esta variável de sistema define a quantidade máxima de memória (em bytes) disponível para as filas de threads de trabalhador do aplicativo que estão segurando eventos ainda não aplicados. Se um evento anormalmente grande exceder esse tamanho, a transação é suspensa até que todas as filas de threads de trabalhador do aplicativo estejam vazias e, então, processada. Todas as transações subsequentes são suspensas até que a grande transação seja concluída.

Esperou por conflitos de relógio: O número de nanosegundos que o fio de coordenador teve que esperar para agendar um evento porque uma transação da qual o evento dependia ainda não havia sido comprometida. Se `slave_parallel_type` estiver definido como `DATABASE` (em vez de `LOGICAL_CLOCK`), esse valor será sempre zero.

Esperou (contar) quando os trabalhadores ocuparam:   O número de vezes que o fio do coordenador dormiu por um curto período, o que ele poderia fazer em duas situações. A primeira situação é quando o fio do coordenador atribui um evento e descobre que a fila do fio do trabalhador aplicante está cheia além do nível de suborno de 10% do comprimento máximo da fila, caso em que ele dorme por um máximo de 1 milissegundo. A segunda situação é quando `slave_parallel_type` é definido como `LOGICAL_CLOCK` e o fio do coordenador precisa atribuir o primeiro evento de uma transação para a fila de um fio do trabalhador aplicante, ele só faz isso para um trabalhador com uma fila vazia, então, se nenhuma fila estiver vazia, o fio do coordenador dorme até que uma fique vazia.

Esperou quando os trabalhadores ocuparam: O número de nanosegundos que o fio coordenador dormiu enquanto esperava por uma fila de fio de trabalhador aplicador vazia (ou seja, na segunda situação descrita acima, onde `slave_parallel_type` é definido como `LOGICAL_CLOCK` e o primeiro evento de uma transação precisa ser atribuído).
