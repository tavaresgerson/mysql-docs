#### 7.6.3.3 Operação do Pool de Threads

O pool de threads consiste em vários grupos de threads, cada um dos quais gerencia um conjunto de conexões de clientes. À medida que as conexões são estabelecidas, o pool de threads as atribui aos grupos de threads de forma round-robin.

O pool de threads expõe variáveis do sistema que podem ser usadas para configurá-lo:

* `thread_pool_algorithm`: O algoritmo de concorrência a ser usado para a programação.

* `thread_pool_dedicated_listeners`: Dedicando um thread de ouvinte em cada grupo de threads para ouvir declarações recebidas de conexões atribuídas ao grupo.

* `thread_pool_high_priority_connection`: Como programar a execução de declarações para uma sessão.

* `thread_pool_max_active_query_threads`: Quantos threads ativos por grupo são permitidos.

* `thread_pool_max_transactions_limit`: O número máximo de transações permitidas pelo plugin do pool de threads.

* `thread_pool_max_unused_threads`: Quantos threads em espera são permitidos.

* `thread_pool_prio_kickup_timer`: Quanto tempo antes o pool de threads move uma declaração aguardando execução da fila de baixa prioridade para a fila de alta prioridade.

* `thread_pool_query_threads_per_group`: O número de threads de consulta permitidos em um grupo de threads (o padrão é um único thread de consulta). Considere aumentar o valor se você estiver experimentando tempos de resposta mais lentos devido a transações de longa duração.

* `thread_pool_size`: O número de grupos de threads no pool de threads. Este é o parâmetro mais importante que controla o desempenho do pool de threads.

* `thread_pool_stall_limit`: O tempo antes que uma declaração em execução seja considerada travada.

* `thread_pool_transaction_delay`: O período de atraso antes de iniciar uma nova transação.

Para configurar o número de grupos de threads, use a variável de sistema `thread_pool_size`. O número padrão de grupos é 16. Para obter orientações sobre como definir essa variável, consulte a Seção 7.6.3.4, “Ajuste do Pool de Threads”.

O número máximo de threads por grupo é 4096 (ou 4095 em alguns sistemas onde um thread é usado internamente).

O pool de threads separa conexões e threads, portanto, não há uma relação fixa entre conexões e os threads que executam instruções recebidas dessas conexões. Isso difere do modelo padrão de manipulação de threads que associa um thread a uma conexão, de modo que um determinado thread executa todas as instruções de sua conexão.

Por padrão, o pool de threads tenta garantir um máximo de um thread executando em cada grupo a qualquer momento, mas às vezes permite que mais threads sejam executados temporariamente para obter o melhor desempenho:

* Cada grupo de threads tem um thread de ouvinte que escuta as instruções recebidas das conexões atribuídas ao grupo. Quando uma instrução chega, o grupo de threads começa a executá-la imediatamente ou enfileira-a para execução posterior:

  + A execução imediata ocorre se a instrução for a única recebida e não houver instruções enfileiradas ou atualmente em execução.

    A execução imediata pode ser adiada configurando `thread_pool_transaction_delay`, que tem um efeito de controle de tráfego nas transações. Para mais informações, consulte a descrição dessa variável na discussão que segue.

  + A enfileiração ocorre se a instrução não puder começar a ser executada imediatamente devido a instruções enfileiradas ou em execução.

* A variável `thread_pool_transaction_delay` especifica um atraso de transação em milissegundos. Os threads de trabalhador dormem por um período especificado antes de executar uma nova transação.

Um atraso de transação pode ser usado em casos em que transações paralelas afetam o desempenho de outras operações devido à concorrência por recursos. Por exemplo, se transações paralelas afetam a criação de índices ou uma operação de redimensionamento de um pool de buffers online, você pode configurar um atraso de transação para reduzir a concorrência por recursos enquanto essas operações estão em execução. O atraso tem um efeito de controle sobre as transações.

O ajuste `thread_pool_transaction_delay` não afeta as consultas emitidas a partir de uma conexão privilegiada (uma conexão atribuída ao grupo de threads `Admin`). Essas consultas não estão sujeitas a um atraso de transação configurado.

* Se a execução imediata ocorrer, o thread do ouvinte a executa. (Isso significa que, temporariamente, nenhum thread do grupo está ouvindo.) Se a instrução terminar rapidamente, o thread executando retorna para ouvir instruções. Caso contrário, o pool de threads considera a instrução como travada e inicia outro thread como thread ouvinte (criando-o, se necessário). Para garantir que nenhum grupo de threads seja bloqueado por instruções travadas, o pool de threads tem um thread de segundo plano que monitora regularmente os estados dos grupos de threads.

Ao usar o thread ouvinte para executar uma instrução que pode começar imediatamente, não é necessário criar um thread adicional se a instrução terminar rapidamente. Isso garante a execução mais eficiente possível no caso de um pequeno número de threads concorrentes.

Quando o plugin do pool de threads é iniciado, ele cria um thread por grupo (o thread ouvinte) e, além disso, o thread de segundo plano. Threads adicionais são criados conforme necessário para executar instruções.

* O valor da variável de sistema `thread_pool_stall_limit` determina o significado de "finaliza rapidamente" no item anterior. O tempo padrão antes que os threads sejam considerados parados é de 60ms, mas pode ser ajustado para um máximo de 6s. Este parâmetro é configurável para permitir que você encontre um equilíbrio adequado para a carga de trabalho do servidor. Valores de espera curtos permitem que os threads comecem mais rapidamente. Valores curtos também são melhores para evitar situações de deadlock. Valores de espera longos são úteis para cargas de trabalho que incluem instruções de execução longa, para evitar iniciar muitas novas instruções enquanto as atuais estão sendo executadas.

* Se `thread_pool_max_active_query_threads` for 0, o algoritmo padrão é aplicado como descrito anteriormente para determinar o número máximo de threads ativas por grupo. O algoritmo padrão leva em conta os threads parados e pode permitir temporariamente mais threads ativos. Se `thread_pool_max_active_query_threads` for maior que 0, ele coloca um limite no número de threads ativas por grupo.

* O pool de threads foca em limitar o número de instruções curtas concorrentes. Antes que uma instrução em execução atinja o tempo de parada, ela impede que outras instruções comecem a ser executadas. Se a instrução for executada após o tempo de parada, ela é permitida para continuar, mas não impede mais que outras instruções comecem. Dessa forma, o pool de threads tenta garantir que, em cada grupo de threads, nunca haja mais de uma instrução de execução curta, embora possa haver múltiplas instruções de execução longa. Não é desejável deixar que instruções de execução longa impeçam outras instruções de serem executadas, pois não há limite para a quantidade de espera que possa ser necessária. Por exemplo, em um servidor de fonte de replicação, um thread que está enviando eventos de log binário para uma replica efetivamente corre para sempre.

* Uma declaração fica bloqueada se encontrar uma operação de E/S de disco ou um bloqueio no nível do usuário (bloqueio de linha ou bloqueio de tabela). O bloqueio faz com que o grupo de threads fique inutilizado, então há chamadas de retorno para o pool de threads para garantir que o pool de threads possa iniciar imediatamente um novo thread neste grupo para executar outra declaração. Quando um thread bloqueado retorna, o pool de threads permite que ele reinicie imediatamente.

* Existem duas filas, uma fila de alta prioridade e uma fila de baixa prioridade. A primeira declaração em uma transação vai para a fila de baixa prioridade. Quaisquer declarações seguintes para a transação vão para a fila de alta prioridade se a transação estiver em andamento (as declarações para ela já começaram a ser executadas), ou para a fila de baixa prioridade caso contrário. A atribuição da fila pode ser afetada ao habilitar a variável de sistema `thread_pool_high_priority_connection`, o que faz com que todas as declarações em fila para uma sessão passem para a fila de alta prioridade.

  As declarações para um motor de armazenamento não transakcional, ou para um motor transakcional se `autocommit` estiver habilitado, são tratadas como declarações de baixa prioridade porque, neste caso, cada declaração é uma transação. Assim, dada uma mistura de declarações para tabelas `InnoDB` e `MyISAM`, o pool de threads dá prioridade às de `InnoDB` sobre as de `MyISAM`, a menos que `autocommit` esteja habilitado. Com `autocommit` habilitado, todas as declarações têm prioridade baixa.

* Quando o grupo de threads seleciona uma declaração em fila para execução, ele primeiro procura na fila de alta prioridade, depois na fila de baixa prioridade. Se uma declaração for encontrada, ela é removida de sua fila e começa a ser executada.

* Se uma declaração ficar na fila de baixa prioridade por muito tempo, o pool de threads passa para a fila de alta prioridade. O valor da variável de sistema `thread_pool_prio_kickup_timer` controla o tempo antes do movimento. Para cada grupo de threads, no máximo uma declaração por 10ms (100 por segundo) é movida da fila de baixa prioridade para a fila de alta prioridade.

* O pool de threads reutiliza os threads mais ativos para obter um uso muito melhor dos caches da CPU. Esse é um pequeno ajuste que tem um grande impacto no desempenho.

* Enquanto um thread executa uma declaração de uma conexão de usuário, a instrumentação do Schema de Desempenho contabiliza a atividade do thread para a conexão de usuário. Caso contrário, o Schema de Desempenho contabiliza a atividade para o pool de threads.

Aqui estão exemplos de condições sob as quais um grupo de threads pode ter vários threads iniciados para executar declarações:

* Um thread começa a executar uma declaração, mas funciona o tempo suficiente para ser considerado parado. O grupo de threads permite que outro thread comece a executar outra declaração, mesmo que o primeiro thread ainda esteja executando.

* Um thread começa a executar uma declaração, depois fica bloqueado e relata isso de volta ao pool de threads. O grupo de threads permite que outro thread comece a executar outra declaração.

* Um thread começa a executar uma declaração, fica bloqueado, mas não relata que está bloqueado porque o bloqueio não ocorre em código que foi instrumentado com callbacks do pool de threads. Nesse caso, o thread parece para o grupo de threads que ainda está em execução. Se o bloqueio durar o tempo suficiente para que a declaração seja considerada parada, o grupo permite que outro thread comece a executar outra declaração.

O pool de threads é projetado para ser escalável em um número crescente de conexões. Ele também é projetado para evitar deadlocks que podem surgir ao limitar o número de instruções executadas ativamente. É importante que os threads que não retornam ao pool de threads não impeçam que outras instruções sejam executadas e, assim, causem um deadlock no pool de threads. Exemplos de tais instruções seguem:

* Instruções de longa duração. Essas levariam a todos os recursos usados por apenas algumas instruções e poderiam impedir que todos os outros acessem o servidor.

* Threads de exibição de registro binário que leem o registro binário e o enviam para réplicas. Esse é um tipo de "instrução" de longa duração que dura muito tempo e que não deve impedir que outras instruções sejam executadas.

* Instruções bloqueadas em um bloqueio de linha, bloqueio de tabela, sono ou qualquer outra atividade de bloqueio que não tenha sido reportada de volta ao pool de threads pelo MySQL Server ou por um mecanismo de armazenamento.

Em cada caso, para evitar deadlock, a instrução é movida para a categoria travada quando não é concluída rapidamente, para que o grupo de threads possa permitir que outra instrução comece a ser executada. Com esse design, quando um thread é executado ou fica bloqueado por um tempo prolongado, o pool de threads move o thread para a categoria travada e, pelo resto da execução da instrução, não impede que outras instruções sejam executadas.

O número máximo de threads que pode ocorrer é a soma de `max_connections` e `thread_pool_size`. Isso pode acontecer em uma situação em que todas as conexões estão no modo de execução e um thread extra é criado por grupo para ouvir mais instruções. Isso não é necessariamente um estado que acontece com frequência, mas é teoricamente possível.

##### Conexões privilegiadas

Se o limite definido por `thread_pool_max_transactions_limit` tiver sido atingido e novas conexões ou novas transações usando conexões existentes parecem ficar pendentes até que uma ou mais transações existentes sejam concluídas, apesar de quaisquer ajustes feitos em `thread_pool_longrun_trx_limit`, de modo que todas as conexões existentes sejam bloqueadas ou de longa duração, a única maneira de acessar o servidor pode ser usar uma conexão privilegiada.

Para estabelecer uma conexão privilegiada, o usuário que inicia a conexão deve ter o privilégio `TP_CONNECTION_ADMIN`. Uma conexão privilegiada ignora o limite definido por `thread_pool_max_transactions_limit` e permite conectar-se ao servidor para aumentar o limite, remover o limite ou interromper transações em execução. O privilégio `TP_CONNECTION_ADMIN` deve ser concedido explicitamente. Ele não é concedido a nenhum usuário por padrão.

Uma conexão privilegiada pode executar instruções e iniciar transações e é atribuída a um grupo de threads designado como o grupo de threads `Admin`.

Ao consultar a tabela `performance_schema.tp_thread_group_stats`, que relata estatísticas por grupo de threads, as estatísticas do grupo de threads `Admin` são relatadas na última linha do conjunto de resultados. Por exemplo, se `SELECT

* FROM performance_schema.tp_thread_group_stats` retorna 17 linhas (uma linha por grupo de threads), as estatísticas do grupo de threads `Admin` são relatadas na 17ª linha.