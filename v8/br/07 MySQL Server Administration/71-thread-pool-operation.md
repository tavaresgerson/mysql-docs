#### 7.6.3.3 Funcionamento do conjunto de roscas

O pool de tópicos consiste em vários grupos de tópicos, cada um dos quais gerencia um conjunto de conexões de clientes.

O pool de threads expõe variáveis do sistema que podem ser utilizadas para configurar o seu funcionamento:

- `thread_pool_algorithm`: O algoritmo de simultaneidade a ser usado para agendamento.
- `thread_pool_dedicated_listeners`: Dedica um thread de ouvinte em cada grupo de threads para ouvir instruções de entrada de conexões atribuídas ao grupo.
- `thread_pool_high_priority_connection`: Como agendar a execução de instruções para uma sessão.
- `thread_pool_longrun_trx_limit`: Quanto tempo esperar enquanto os threads usando todos os `thread_pool_max_transactions_limit` estiverem sendo executados antes de suspender o limite para o grupo.
- `thread_pool_max_active_query_threads`: Quantos tópicos ativos por grupo para permitir.
- `thread_pool_max_transactions_limit`: O número máximo de transações permitidas pelo plugin do pool de tópicos.
- `thread_pool_max_unused_threads`: Quantos tópicos de repouso para permitir.
- `thread_pool_prio_kickup_timer`: Quanto tempo antes do grupo de tópicos mover uma instrução aguardando execução da fila de baixa prioridade para a fila de alta prioridade.
- `thread_pool_query_threads_per_group`: O número de tópicos de consulta permitidos em um grupo de tópicos (o padrão é um único tópico de consulta). Considere aumentar o valor se você tiver tempos de resposta mais lentos devido a transações de longa execução.
- `thread_pool_size`: O número de grupos de threads no pool de threads. Este é o parâmetro mais importante que controla o desempenho do pool de threads.
- `thread_pool_stall_limit`: O tempo antes de uma instrução de execução ser considerada paralisada.
- `thread_pool_transaction_delay`: Período de atraso antes de iniciar uma nova transação.

Para configurar o número de grupos de threads, use a variável de sistema `thread_pool_size`. O número padrão de grupos é 16.

O número máximo de fios por grupo é 4096 (ou 4095 em alguns sistemas em que um fio é utilizado internamente).

O pool de threads separa conexões e threads, de modo que não há uma relação fixa entre conexões e os threads que executam instruções recebidas dessas conexões.

Por padrão, o pool de tópicos tenta garantir um máximo de um tópico executando em cada grupo a qualquer momento, mas às vezes permite que mais tópicos sejam executados temporariamente para o melhor desempenho:

- Cada grupo de tópicos tem um tópico ouvinte que escuta as instruções de entrada das conexões atribuídas ao grupo. Quando uma instrução chega, o grupo de tópicos começa a executá-la imediatamente ou coloca-a em fila para execução posterior:

  - A execução imediata ocorre se a instrução for a única recebida e não houver instruções na fila ou atualmente em execução.

    A execução imediata pode ser atrasada pela configuração de `thread_pool_transaction_delay`, o que tem um efeito de estrangulamento nas transações.
  - O enfileiramento ocorre se a instrução não puder começar a ser executada imediatamente devido a instruções enfileiradas ou executadas simultaneamente.
- A variável `thread_pool_transaction_delay` especifica um atraso de transação em milissegundos. Os threads de trabalho dormem durante o período especificado antes de executar uma nova transação.

  Um atraso de transação pode ser usado nos casos em que transações paralelas afetam o desempenho de outras operações devido à contenção de recursos. Por exemplo, se transações paralelas afetam a criação de índice ou uma operação de redimensionamento de pool de buffer on-line, você pode configurar um atraso de transação para reduzir a contenção de recursos enquanto essas operações estão sendo executadas. O atraso tem um efeito de estrangulamento nas transações.

  A configuração `thread_pool_transaction_delay` não afeta consultas emitidas a partir de uma conexão privilegiada (uma conexão atribuída ao grupo de threads `Admin`).
- Se a execução imediata ocorrer, o thread ouvinte a executará. (Isso significa que temporariamente nenhum thread no grupo está ouvindo.) Se a instrução terminar rapidamente, o thread executante retorna à escuta de instruções. Caso contrário, o pool de threads considera a instrução paralisada e inicia outro thread como um thread ouvinte (criando-o se necessário). Para garantir que nenhum grupo de threads seja bloqueado por instruções paralisadas, o pool de threads tem um thread de fundo que monitora regularmente os estados do grupo de threads.

  Ao usar o tópico de escuta para executar uma instrução que pode começar imediatamente, não há necessidade de criar um tópico adicional se a instrução terminar rapidamente. Isso garante a execução mais eficiente possível no caso de um baixo número de tópicos concorrentes.

  Quando o plugin do pool de tópicos é iniciado, ele cria um tópico por grupo (o tópico do ouvinte), além do tópico de fundo.
- O valor da variável do sistema `thread_pool_stall_limit` determina o significado de "finaliza rapidamente" no item anterior. O tempo padrão antes que os tópicos sejam considerados estagnados é de 60ms, mas pode ser definido para um máximo de 6s. Este parâmetro é configurável para permitir que você atinja um equilíbrio apropriado para a carga de trabalho do servidor. Valores de espera curtos permitem que os tópicos sejam iniciados mais rapidamente. Valores de espera curtos também são melhores para evitar situações de impasse. Valores de espera longa são úteis para cargas de trabalho que incluem instruções de execução longa, para evitar iniciar muitas instruções novas enquanto as atuais são executadas.
- Se `thread_pool_max_active_query_threads` é 0, o algoritmo padrão se aplica como descrito para determinar o número máximo de tópicos ativos por grupo. O algoritmo padrão leva em conta tópicos estagnados e pode permitir temporariamente mais tópicos ativos. Se `thread_pool_max_active_query_threads` é maior que 0, coloca um limite no número de tópicos ativos por grupo.
- O pool de tópicos se concentra em limitar o número de instruções de execução curtas concorrentes. Antes que uma instrução de execução atinja o tempo de parada, ela impede que outras instruções comecem a ser executadas. Se a instrução for executada após o tempo de parada, ela é permitida a continuar, mas não impede mais que outras instruções comecem. Desta forma, o pool de tópicos tenta garantir que em cada grupo de tópicos nunca haja mais de uma instrução de execução curta, embora possa haver várias instruções de execução longa. É indesejável deixar que as instruções de execução longa impedem que outras instruções sejam executadas porque não há limite na quantidade de espera que pode ser necessária. Por exemplo, em um servidor de origem de replicação, um tópico que está enviando eventos de log binário para uma réplica é executado efetivamente para sempre.
- Uma instrução fica bloqueada se encontrar uma operação de E/S de disco ou um bloqueio de nível de usuário (bloqueio de linha ou bloqueio de tabela). O bloqueio faria com que o grupo de tópicos ficasse inutilizado, então há callbacks para o pool de tópicos para garantir que o pool de tópicos possa iniciar imediatamente um novo tópico neste grupo para executar outra instrução. Quando um tópico bloqueado retorna, o pool de tópicos permite que ele seja reiniciado imediatamente.
- Existem duas filas, uma de alta prioridade e outra de baixa prioridade. A primeira instrução de uma transação vai para a de baixa prioridade. Qualquer instrução seguinte para a transação vai para a fila de alta prioridade se a transação estiver em andamento (instruções para ela começaram a ser executadas), ou para a fila de baixa prioridade caso contrário. A atribuição de fila pode ser afetada ativando a variável de sistema `thread_pool_high_priority_connection`, que faz com que todas as instruções em fila para uma sessão vão para a fila de alta prioridade.

  As instruções para um mecanismo de armazenamento não transacional, ou um mecanismo transacional se o `autocommit` estiver habilitado, são tratadas como instruções de baixa prioridade porque, neste caso, cada instrução é uma transação. Assim, dada uma mistura de instruções para as tabelas `InnoDB` e `MyISAM`, o pool de tópicos prioriza as de `InnoDB` sobre as de `MyISAM` a menos que o `autocommit` esteja habilitado. Com o `autocommit` habilitado, todas as instruções têm baixa prioridade.
- Quando o grupo de threads seleciona uma instrução em fila para execução, ele primeiro olha na fila de alta prioridade, em seguida, na fila de baixa prioridade.
- Se uma instrução permanece na fila de baixa prioridade por muito tempo, o grupo de tópicos se move para a fila de alta prioridade. O valor da variável do sistema `thread_pool_prio_kickup_timer` controla o tempo antes do movimento. Para cada grupo de tópicos, um máximo de uma instrução por 10ms (100 por segundo) é movido da fila de baixa prioridade para a fila de alta prioridade.
- O pool de threads reutiliza os threads mais ativos para obter um uso muito melhor dos caches da CPU. Este é um pequeno ajuste que tem um grande impacto no desempenho.
- Enquanto um thread executa uma instrução de uma conexão de usuário, a instrumentação do Performance Schema contabiliza a atividade do thread para a conexão do usuário.

Aqui estão exemplos de condições sob as quais um grupo de threads pode ter vários threads iniciados para executar instruções:

- Um thread começa a executar uma instrução, mas é executado o tempo suficiente para ser considerado paralisado. O grupo de threads permite que outro thread comece a executar outra instrução mesmo que o primeiro thread ainda esteja sendo executado.
- Um thread começa a executar uma instrução, depois fica bloqueado e relata isso de volta ao grupo de threads. O grupo de threads permite que outro thread comece a executar outra instrução.
- Um thread começa a executar uma instrução, fica bloqueado, mas não relata que está bloqueado porque o bloqueio não ocorre em código que foi instrumentado com callbacks de pool de threads. Neste caso, o thread parece estar ainda em execução para o grupo de threads. Se o bloqueio durar o suficiente para que a instrução seja considerada paralisada, o grupo permite que outro thread comece a executar outra instrução.

O pool de tópicos é projetado para ser escalável em um número crescente de conexões. Ele também é projetado para evitar bloqueios que podem surgir da limitação do número de instruções executando ativamente. É importante que os tópicos que não relatam de volta para o pool de tópicos não impeçam outras instruções de executar e, assim, causar o pool de tópicos para se tornar bloqueado.

- As instruções de longa duração levarão a todos os recursos usados por apenas algumas instruções e poderão impedir que todos os outros acessem o servidor.
- Os threads de dump de log binário que lêem o log binário e o enviam para réplicas. Este é um tipo de instrução de longa duração que é executado por um tempo muito longo, e que não deve impedir que outras instruções sejam executadas.
- Declarações bloqueadas em um bloqueio de linha, bloqueio de tabela, sono ou qualquer outra atividade de bloqueio que não tenha sido relatada de volta ao pool de tópicos pelo MySQL Server ou um mecanismo de armazenamento.

Em cada caso, para evitar o impasse, a instrução é movida para a categoria paralisada quando não é concluída rapidamente, para que o grupo de threads possa permitir que outra instrução comece a ser executada.

O número máximo de threads que podem ocorrer é a soma de `max_connections` e `thread_pool_size`. Isso pode acontecer em uma situação em que todas as conexões estão no modo de execução e um thread extra é criado por grupo para ouvir mais instruções. Este não é necessariamente um estado que acontece com frequência, mas é teoricamente possível.

##### Relações Privilegiadas

Se o limite definido por `thread_pool_max_transactions_limit` foi atingido e novas conexões ou novas transações usando conexões existentes parecem estar suspensas até que uma ou mais transações existentes sejam concluídas, apesar de quaisquer ajustes feitos em `thread_pool_longrun_trx_limit`, de modo que todas as conexões existentes estão bloqueadas ou em execução prolongada, a única maneira de acessar o servidor pode ser usar uma conexão privilegiada.

Para estabelecer uma conexão privilegiada, o usuário que inicia a conexão deve ter o privilégio `TP_CONNECTION_ADMIN`. Uma conexão privilegiada ignora o limite definido por `thread_pool_max_transactions_limit` e permite a conexão com o servidor para aumentar o limite, remover o limite ou matar transações em execução. O privilégio `TP_CONNECTION_ADMIN` deve ser concedido explicitamente. Ele não é concedido a nenhum usuário por padrão.

Uma conexão privilegiada pode executar instruções e iniciar transações, e é atribuída a um grupo de threads designado como o grupo de threads `Admin`.

Ao consultar a tabela `performance_schema.tp_thread_group_stats`, que relata estatísticas por grupo de tópicos, as estatísticas do grupo de tópicos `Admin` são relatadas na última linha do conjunto de resultados.

- As estatísticas dos grupos de tópicos administrativos são reportadas na 17a linha.
