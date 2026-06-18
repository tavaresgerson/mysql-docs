#### 7.6.3.3 Operação do Conjunto de Fios

O pool de threads é composto por vários grupos de threads, cada um dos quais gerencia um conjunto de conexões de clientes. À medida que as conexões são estabelecidas, o pool de threads as atribui aos grupos de threads de forma round-robin.

O pool de threads exibe variáveis do sistema que podem ser usadas para configurar sua operação:

- `thread_pool_algorithm`: O algoritmo de concorrência a ser utilizado para a programação.

- `thread_pool_dedicated_listeners`: Dedica uma thread de escuta em cada grupo de threads para ouvir declarações recebidas de conexões atribuídas ao grupo.

- `thread_pool_high_priority_connection`: Como agendar a execução de uma declaração para uma sessão.

- `thread_pool_max_active_query_threads`: Quantos tópicos ativos por grupo permitir.

- `thread_pool_max_transactions_limit`: O número máximo de transações permitidas pelo plugin de pool de threads.

- `thread_pool_max_unused_threads`: Quantos fios de sono permitir.

- `thread_pool_prio_kickup_timer`: Quanto tempo antes o pool de threads move uma declaração aguardando execução da fila de baixa prioridade para a fila de alta prioridade.

- `thread_pool_query_threads_per_group`: O número de threads de consulta permitidos em um grupo de threads (o valor padrão é uma única thread de consulta). Considere aumentar o valor se você notar tempos de resposta mais lentos devido a transações de longa duração.

- `thread_pool_size`: O número de grupos de threads no pool de threads. Este é o parâmetro mais importante que controla o desempenho do pool de threads.

- `thread_pool_stall_limit`: O tempo antes de uma declaração em execução ser considerada travada.

- `thread_pool_transaction_delay`: O período de atraso antes de iniciar uma nova transação.

Para configurar o número de grupos de threads, use a variável de sistema `thread_pool_size`. O número padrão de grupos é 16. Para obter orientações sobre como definir essa variável, consulte a Seção 7.6.3.4, “Ajuste do Pool de Threads”.

O número máximo de threads por grupo é de 4096 (ou 4095 em alguns sistemas onde uma thread é usada internamente).

O pool de threads separa conexões e threads, portanto, não há uma relação fixa entre conexões e os threads que executam instruções recebidas dessas conexões. Isso difere do modelo padrão de gerenciamento de threads que associa um thread a uma conexão, de modo que um determinado thread executa todas as instruções de sua conexão.

Por padrão, o pool de threads tenta garantir um máximo de um thread executando em cada grupo a qualquer momento, mas, às vezes, permite que mais threads sejam executadas temporariamente para obter o melhor desempenho:

- Cada grupo de threads tem uma thread de ouvinte que escuta as declarações recebidas das conexões atribuídas ao grupo. Quando uma declaração chega, o grupo de threads começa a executá-la imediatamente ou coloca-a em fila para execução posterior:

  - A execução imediata ocorre se a declaração for a única recebida e não houver declarações em fila ou em execução no momento.

    A partir do MySQL 8.0.31, a execução imediata pode ser adiada configurando `thread_pool_transaction_delay`, que tem um efeito de controle sobre as transações. Para mais informações, consulte a descrição desta variável na discussão a seguir.

  - A fila ocorre se a instrução não puder começar a ser executada imediatamente devido a instruções em fila ou em execução simultaneamente.

- A variável `thread_pool_transaction_delay` especifica um atraso de transação em milissegundos. Os threads do trabalhador dormem por um período especificado antes de executar uma nova transação.

  O atraso de transações pode ser usado em casos em que transações paralelas afetam o desempenho de outras operações devido à disputa por recursos. Por exemplo, se transações paralelas afetam a criação de índices ou uma operação de redimensionamento de um pool de buffers online, você pode configurar um atraso de transação para reduzir a disputa por recursos enquanto essas operações estiverem em execução. O atraso tem um efeito de controle sobre as transações.

  A configuração `thread_pool_transaction_delay` não afeta as consultas emitidas a partir de uma conexão privilegiada (uma conexão atribuída ao grupo de threads `Admin`). Essas consultas não estão sujeitas a um atraso de transação configurado.

- Se a execução imediata ocorrer, o fio de escuta executará essa tarefa. (Isso significa que, temporariamente, nenhum fio do grupo está ouvindo.) Se a instrução for concluída rapidamente, o fio executando retorna para ouvir outras instruções. Caso contrário, o pool de fios considera a instrução como travada e inicia outro fio como fio de escuta (criando-o, se necessário). Para garantir que nenhum grupo de fios seja bloqueado por instruções travadas, o pool de fios tem um fio de fundo que monitora regularmente os estados dos grupos de fios.

  Ao usar o fio de escuta para executar uma instrução que pode começar imediatamente, não é necessário criar um fio adicional se a instrução terminar rapidamente. Isso garante a execução mais eficiente possível no caso de um número baixo de threads concorrentes.

  Quando o plugin de pool de threads é iniciado, ele cria um thread por grupo (o thread do ouvinte), além do thread de fundo. Threads adicionais são criados conforme necessário para executar instruções.

- O valor da variável de sistema `thread_pool_stall_limit` determina o significado de “finaliza rapidamente” no item anterior. O tempo padrão antes que os threads sejam considerados parados é de 60 ms, mas pode ser ajustado para um máximo de 6 s. Este parâmetro é configurável para permitir que você encontre um equilíbrio adequado para a carga de trabalho do servidor. Valores de espera curtos permitem que os threads iniciem mais rapidamente. Valores curtos também são melhores para evitar situações de deadlock. Valores de espera longos são úteis para cargas de trabalho que incluem instruções de execução longa, para evitar iniciar muitas novas instruções enquanto as atuais estão sendo executadas.

- Se `thread_pool_max_active_query_threads` for 0, o algoritmo padrão será aplicado conforme descrito anteriormente para determinar o número máximo de threads ativas por grupo. O algoritmo padrão leva em consideração as threads paralisadas e pode permitir temporariamente mais threads ativas. Se `thread_pool_max_active_query_threads` for maior que 0, ele estabelece um limite para o número de threads ativas por grupo.

- O pool de threads foca em limitar o número de declarações curtas em execução simultânea. Antes que uma declaração em execução atinja o tempo de parada, ela impede que outras declarações comecem a ser executadas. Se a declaração for executada após o tempo de parada, ela é permitida para continuar, mas não impede mais que outras declarações comecem. Dessa forma, o pool de threads tenta garantir que, em cada grupo de threads, nunca haja mais de uma declaração curta em execução, embora possa haver várias declarações de longa duração. Não é desejável permitir que declarações de longa duração impeçam outras declarações de serem executadas, porque não há limite para a quantidade de espera que pode ser necessária. Por exemplo, em um servidor de fonte de replicação, um thread que está enviando eventos de log binário para uma replica funciona efetivamente para sempre.

- Uma declaração fica bloqueada se encontrar uma operação de E/S de disco ou um bloqueio de nível de usuário (bloqueio de linha ou bloqueio de tabela). O bloqueio faria com que o grupo de threads ficasse inutilizado, então há chamadas de retorno para o pool de threads para garantir que o pool de threads possa iniciar imediatamente um novo thread neste grupo para executar outra declaração. Quando um thread bloqueado retorna, o pool de threads permite que ele reinicie imediatamente.

- Existem duas filas, uma de alta prioridade e outra de baixa prioridade. A primeira declaração em uma transação vai para a fila de baixa prioridade. Quaisquer declarações seguintes para a transação vão para a fila de alta prioridade se a transação estiver em andamento (as declarações para ela já começaram a ser executadas) ou para a fila de baixa prioridade caso contrário. A atribuição da fila pode ser afetada ao habilitar a variável de sistema `thread_pool_high_priority_connection`, que faz com que todas as declarações em fila para uma sessão passem para a fila de alta prioridade.

  As declarações para um motor de armazenamento não transacional, ou para um motor transacional se `autocommit` estiver habilitado, são tratadas como declarações de baixa prioridade, pois, neste caso, cada declaração é uma transação. Assim, dada uma mistura de declarações para as tabelas `InnoDB` e `MyISAM`, o pool de threads prioriza as de `InnoDB` sobre as de `MyISAM`, a menos que `autocommit` esteja habilitado. Com `autocommit` habilitado, todas as declarações têm prioridade baixa.

- Quando o grupo de threads seleciona uma instrução em fila para execução, ele primeiro procura na fila de alta prioridade e, em seguida, na fila de baixa prioridade. Se uma instrução for encontrada, ela é removida de sua fila e começa a ser executada.

- Se uma declaração ficar na fila de baixa prioridade por muito tempo, o pool de threads passa para a fila de alta prioridade. O valor da variável de sistema `thread_pool_prio_kickup_timer` controla o tempo antes do movimento. Para cada grupo de threads, no máximo uma declaração por 10 ms (100 por segundo) é movida da fila de baixa prioridade para a fila de alta prioridade.

- O pool de threads reutiliza os threads mais ativos para obter um uso muito melhor dos caches da CPU. Esse é um pequeno ajuste que tem um grande impacto no desempenho.

- Enquanto um fio executa uma instrução de uma conexão de usuário, a instrumentação do Schema de Desempenho registra a atividade do fio na conexão de usuário. Caso contrário, o Schema de Desempenho registra a atividade no pool de threads.

Aqui estão exemplos de condições em que um grupo de threads pode ter múltiplos threads iniciados para executar instruções:

- Um fio começa a executar uma instrução, mas permanece o tempo suficiente para ser considerado parado. O grupo de fios permite que outro fio comece a executar outra instrução, mesmo que o primeiro fio ainda esteja executando.

- Um fio começa a executar uma instrução, depois é bloqueado e relata isso de volta para o grupo de fios. O grupo de fios permite que outro fio comece a executar outra instrução.

- Um fio começa a executar uma instrução, fica bloqueado, mas não relata que está bloqueado porque o bloqueio não ocorre em código instrumentado com chamadas de retorno do pool de threads. Nesse caso, o fio parece para o grupo de threads que ainda está em execução. Se o bloqueio durar o tempo suficiente para que a instrução seja considerada travada, o grupo permite que outro fio comece a executar outra instrução.

O conjunto de threads é projetado para ser escalável em um número crescente de conexões. Ele também é projetado para evitar deadlocks que podem surgir ao limitar o número de instruções executadas ativamente. É importante que os threads que não retornem ao conjunto de threads não impeçam que outras instruções sejam executadas, causando assim um deadlock no conjunto de threads. Exemplos de tais instruções são:

- Declarações de longo prazo. Isso levaria a todos os recursos usados por apenas algumas declarações e poderia impedir que todos os outros acessassem o servidor.

- Os threads de exibição de registros binários leem o registro binário e o enviam para réplicas. Esse é um tipo de "declaração" de longa duração que dura muito tempo e que não deve impedir a execução de outras declarações.

- Declarações bloqueadas em um bloqueio de linha, bloqueio de tabela, sono ou qualquer outra atividade de bloqueio que não tenha sido reportada de volta ao pool de threads pelo MySQL Server ou por um mecanismo de armazenamento.

Em cada caso, para evitar o impasse, a instrução é movida para a categoria travada quando não é concluída rapidamente, para que o grupo de threads possa permitir que outra instrução comece a ser executada. Com esse design, quando um thread é executado ou fica bloqueado por um período prolongado, o pool de threads move o thread para a categoria travada e, para o resto da execução da instrução, não impede que outras instruções sejam executadas.

O número máximo de threads que podem ocorrer é a soma de `max_connections` e `thread_pool_size`. Isso pode acontecer em uma situação em que todas as conexões estão no modo de execução e um thread extra é criado por grupo para ouvir mais declarações. Isso não é necessariamente um estado que ocorre com frequência, mas é teoricamente possível.

##### Conexões Privilegiadas

Quando o limite definido por `thread_pool_max_transactions_limit` for atingido, novas conexões parecem ficar pendentes até que uma ou mais transações existentes sejam concluídas. O mesmo ocorre ao tentar iniciar uma nova transação em uma conexão existente. Se as conexões existentes estiverem bloqueadas ou em execução por muito tempo, a única maneira de acessar o servidor é usando uma conexão privilegiada.

Para estabelecer uma conexão privilegiada, o usuário que inicia a conexão deve ter o privilégio `TP_CONNECTION_ADMIN`. Uma conexão privilegiada ignora o limite definido por `thread_pool_max_transactions_limit` e permite conectar-se ao servidor para aumentar o limite, remover o limite ou interromper transações em execução. O privilégio `TP_CONNECTION_ADMIN` deve ser concedido explicitamente. Ele não é concedido a nenhum usuário por padrão.

Uma conexão privilegiada pode executar instruções e iniciar transações, e é atribuída a um grupo de threads designado como o grupo de threads `Admin`.

Ao consultar a tabela `performance_schema.tp_thread_group_stats`, que relata estatísticas por grupo de threads, as estatísticas do grupo de threads `Admin` são relatadas na última linha do conjunto de resultados. Por exemplo, se \`SELECT

- As estatísticas do grupo de threads `performance_schema.tp_thread_group_stats\G[[PH_CODE_0]]Admin` são relatadas na 17ª linha.
