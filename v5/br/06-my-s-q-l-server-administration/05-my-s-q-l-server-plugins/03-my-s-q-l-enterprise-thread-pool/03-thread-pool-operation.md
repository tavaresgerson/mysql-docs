#### 5.5.3.3 Operação do Conjunto de Fios

O pool de threads é composto por vários grupos de threads, cada um dos quais gerencia um conjunto de conexões de clientes. À medida que as conexões são estabelecidas, o pool de threads as atribui aos grupos de threads de forma round-robin.

O pool de threads exibe variáveis do sistema que podem ser usadas para configurar sua operação:

- `thread_pool_algorithm`: O algoritmo de concorrência a ser usado para agendamento.

- `thread_pool_high_priority_connection`: Como agendar a execução de instruções para uma sessão.

- `thread_pool_max_unused_threads`: Quantos threads em espera permitir.

- `thread_pool_prio_kickup_timer`: Quanto tempo antes o pool de threads move uma declaração aguardando execução da fila de baixa prioridade para a fila de alta prioridade.

- `thread_pool_size`: O número de grupos de threads no pool de threads. Este é o parâmetro mais importante que controla o desempenho do pool de threads.

- `thread_pool_stall_limit`: O tempo antes que uma instrução em execução seja considerada travada.

Para configurar o número de grupos de threads, use a variável de sistema `thread_pool_size`. O número padrão de grupos é 16. Para obter orientações sobre como definir essa variável, consulte Seção 5.5.3.4, “Ajuste do Pool de Threads”.

O número máximo de threads por grupo é de 4096 (ou 4095 em alguns sistemas onde uma thread é usada internamente).

O pool de threads separa conexões e threads, portanto, não há uma relação fixa entre conexões e os threads que executam instruções recebidas dessas conexões. Isso difere do modelo padrão de gerenciamento de threads que associa um thread a uma conexão, de modo que um determinado thread executa todas as instruções de sua conexão.

O pool de threads tenta garantir que, em qualquer momento, no máximo uma thread esteja sendo executada em cada grupo, mas, às vezes, permite que mais threads sejam executadas temporariamente para obter o melhor desempenho:

- Cada grupo de threads tem uma thread de ouvinte que escuta as declarações recebidas das conexões atribuídas ao grupo. Quando uma declaração chega, o grupo de threads começa a executá-la imediatamente ou coloca-a em fila para execução posterior:

  - A execução imediata ocorre se a declaração for a única recebida e nenhuma declaração estiver em fila ou em execução.

  - A fila ocorre se a instrução não puder começar a ser executada imediatamente.

- Se a execução imediata ocorrer, o fio de escuta executará essa tarefa. (Isso significa que, temporariamente, nenhum fio do grupo está ouvindo.) Se a instrução for concluída rapidamente, o fio executando retorna para ouvir outras instruções. Caso contrário, o pool de fios considera a instrução como travada e inicia outro fio como fio de escuta (criando-o, se necessário). Para garantir que nenhum grupo de fios seja bloqueado por instruções travadas, o pool de fios tem um fio de fundo que monitora regularmente os estados dos grupos de fios.

  Ao usar o fio de escuta para executar uma instrução que pode começar imediatamente, não é necessário criar um fio adicional se a instrução terminar rapidamente. Isso garante a execução mais eficiente possível no caso de um número baixo de threads concorrentes.

  Quando o plugin de pool de threads é iniciado, ele cria um thread por grupo (o thread do ouvinte), além do thread de fundo. Threads adicionais são criados conforme necessário para executar instruções.

- O valor da variável de sistema `thread_pool_stall_limit` determina o significado de “fica parado rapidamente” no item anterior. O tempo padrão antes que os threads sejam considerados parados é de 60ms, mas pode ser ajustado para um máximo de 6s. Este parâmetro é configurável para permitir que você encontre um equilíbrio adequado para a carga de trabalho do servidor. Valores de espera curtos permitem que os threads comecem mais rapidamente. Valores curtos também são melhores para evitar situações de deadlock. Valores de espera longos são úteis para cargas de trabalho que incluem instruções de execução longa, para evitar iniciar muitas novas instruções enquanto as atuais estão sendo executadas.

- O pool de threads foca em limitar o número de declarações curtas em execução simultânea. Antes que uma declaração em execução atinja o tempo de parada, ela impede que outras declarações comecem a ser executadas. Se a declaração for executada após o tempo de parada, ela é permitida para continuar, mas não impede mais que outras declarações comecem. Dessa forma, o pool de threads tenta garantir que, em cada grupo de threads, nunca haja mais de uma declaração curta em execução, embora possa haver múltiplas declarações de longa duração. Não é desejável permitir que declarações de longa duração impeçam outras declarações de serem executadas, pois não há limite para a quantidade de espera que pode ser necessária. Por exemplo, em uma fonte de replicação, um thread que está enviando eventos de log binário para uma replica funciona efetivamente para sempre.

- Uma declaração fica bloqueada se encontrar uma operação de E/S de disco ou um bloqueio de nível de usuário (bloqueio de linha ou bloqueio de tabela). O bloqueio faria com que o grupo de threads ficasse inutilizado, então há chamadas de retorno para o pool de threads para garantir que o pool de threads possa iniciar imediatamente um novo thread neste grupo para executar outra declaração. Quando um thread bloqueado retorna, o pool de threads permite que ele reinicie imediatamente.

- Existem duas filas, uma de alta prioridade e uma de baixa prioridade. A primeira declaração em uma transação vai para a fila de baixa prioridade. Quaisquer declarações seguintes para a transação vão para a fila de alta prioridade se a transação estiver em andamento (as declarações para ela já começaram a ser executadas) ou para a fila de baixa prioridade caso contrário. A atribuição da fila pode ser afetada ao habilitar a variável de sistema `thread_pool_high_priority_connection`, o que faz com que todas as declarações em fila para uma sessão vão para a fila de alta prioridade.

  As declarações para um motor de armazenamento não transacional, ou para um motor transacional se o `autocommit` estiver habilitado, são tratadas como declarações de baixa prioridade porque, neste caso, cada declaração é uma transação. Assim, dada uma mistura de declarações para tabelas `InnoDB` e `MyISAM`, o pool de threads prioriza as de `InnoDB` sobre as de `MyISAM`, a menos que o `autocommit` esteja habilitado. Com o `autocommit` habilitado, todas as declarações têm prioridade baixa.

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

O número máximo de threads que podem ocorrer é a soma de `max_connections` e `thread_pool_size`. Isso pode acontecer em uma situação em que todas as conexões estão no modo de execução e um thread extra é criado por grupo para ouvir mais declarações. Isso não é necessariamente um estado que acontece com frequência, mas é teoricamente possível.
