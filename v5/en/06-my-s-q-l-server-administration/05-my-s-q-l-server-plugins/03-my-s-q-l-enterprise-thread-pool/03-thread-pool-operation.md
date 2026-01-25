#### 5.5.3.3 Operação do Thread Pool

O Thread Pool consiste em um número de Thread Groups, cada um dos quais gerencia um conjunto de Connections de cliente. À medida que as Connections são estabelecidas, o Thread Pool as atribui aos Thread Groups em modo *round-robin*.

O Thread Pool expõe variáveis de sistema que podem ser usadas para configurar sua operação:

* [`thread_pool_algorithm`](server-system-variables.html#sysvar_thread_pool_algorithm): O algoritmo de concorrência a ser usado para *scheduling*.

* [`thread_pool_high_priority_connection`](server-system-variables.html#sysvar_thread_pool_high_priority_connection): Como agendar a execução de *statements* para uma sessão.

* [`thread_pool_max_unused_threads`](server-system-variables.html#sysvar_thread_pool_max_unused_threads): Quantos *sleeping threads* permitir.

* [`thread_pool_prio_kickup_timer`](server-system-variables.html#sysvar_thread_pool_prio_kickup_timer): Quanto tempo o Thread Pool espera antes de mover um *statement* aguardando execução da *low-priority queue* para a *high-priority queue*.

* [`thread_pool_size`](server-system-variables.html#sysvar_thread_pool_size): O número de Thread Groups no Thread Pool. Este é o parâmetro mais importante que controla o desempenho do Thread Pool.

* [`thread_pool_stall_limit`](server-system-variables.html#sysvar_thread_pool_stall_limit): O tempo antes que um *statement* em execução seja considerado *stalled*.

Para configurar o número de Thread Groups, use a variável de sistema [`thread_pool_size`](server-system-variables.html#sysvar_thread_pool_size). O número padrão de Groups é 16. Para orientações sobre como definir esta variável, consulte [Section 5.5.3.4, “Thread Pool Tuning”](thread-pool-tuning.html "5.5.3.4 Thread Pool Tuning").

O número máximo de Threads por Group é 4096 (ou 4095 em alguns sistemas onde um Thread é usado internamente).

O Thread Pool separa Connections e Threads, de modo que não há uma relação fixa entre Connections e os Threads que executam os *statements* recebidos dessas Connections. Isso difere do modelo padrão de manuseio de Threads que associa um Thread a uma Connection, de modo que um determinado Thread executa todos os *statements* de sua Connection.

O Thread Pool tenta garantir no máximo um Thread em execução em cada Group a qualquer momento, mas às vezes permite que mais Threads sejam executados temporariamente para obter o melhor desempenho:

* Cada Thread Group possui um *listener thread* que escuta *statements* recebidos das Connections atribuídas ao Group. Quando um *statement* chega, o Thread Group inicia sua execução imediatamente ou o enfileira para execução posterior:

  + A execução imediata ocorre se o *statement* for o único recebido e não houver *statements* enfileirados ou atualmente em execução.

  + O enfileiramento ocorre se o *statement* não puder iniciar a execução imediatamente.

* Se ocorrer execução imediata, o *listener thread* a executa. (Isso significa que, temporariamente, nenhum Thread no Group está escutando.) Se o *statement* terminar rapidamente, o Thread em execução retorna à escuta por *statements*. Caso contrário, o Thread Pool considera o *statement* *stalled* e inicia outro Thread como *listener thread* (criando-o se necessário). Para garantir que nenhum Thread Group seja bloqueado por *stalled statements*, o Thread Pool possui um Thread de fundo que monitora regularmente os estados do Thread Group.

  Ao usar o *listening thread* para executar um *statement* que pode começar imediatamente, não há necessidade de criar um Thread adicional se o *statement* terminar rapidamente. Isso garante a execução mais eficiente possível no caso de um baixo número de Threads concorrentes.

  Quando o *plugin* do Thread Pool inicia, ele cria um Thread por Group (o *listener thread*), mais o Thread de fundo. Threads adicionais são criados conforme necessário para executar *statements*.

* O valor da variável de sistema [`thread_pool_stall_limit`](server-system-variables.html#sysvar_thread_pool_stall_limit) determina o significado de “termina rapidamente” no item anterior. O tempo padrão antes que os Threads sejam considerados *stalled* é 60ms, mas pode ser configurado para um máximo de 6s. Este parâmetro é configurável para permitir que você encontre um equilíbrio apropriado para a carga de trabalho do servidor. Valores de espera curtos permitem que os Threads iniciem mais rapidamente. Valores curtos também são melhores para evitar situações de Deadlock. Valores de espera longos são úteis para cargas de trabalho que incluem *statements* de longa duração, para evitar iniciar muitos novos *statements* enquanto os atuais estão em execução.

* O Thread Pool foca em limitar o número de *statements* concorrentes de curta duração. Antes que um *statement* em execução atinja o tempo de *stall*, ele impede que outros *statements* comecem a ser executados. Se o *statement* for executado após o tempo de *stall*, ele pode continuar, mas não impede mais que outros *statements* iniciem. Desta forma, o Thread Pool tenta garantir que em cada Thread Group nunca haja mais do que um *statement* de curta duração, embora possa haver vários *statements* de longa duração. Não é desejável permitir que *statements* de longa duração impeçam a execução de outros *statements* porque não há limite para a quantidade de espera que pode ser necessária. Por exemplo, em uma fonte de replicação, um Thread que está enviando eventos do Binary Log para uma Replica é executado efetivamente para sempre.

* Um *statement* fica *blocked* (bloqueado) se encontrar uma operação de Disk I/O ou um Lock de nível de usuário (Row Lock ou Table Lock). O Block faria com que o Thread Group ficasse inutilizado, então existem *callbacks* para o Thread Pool para garantir que ele possa iniciar imediatamente um novo Thread neste Group para executar outro *statement*. Quando um Thread *blocked* retorna, o Thread Pool permite que ele reinicie imediatamente.

* Existem duas Queues: uma *high-priority queue* e uma *low-priority queue*. O primeiro *statement* em uma Transaction vai para a *low-priority queue*. Quaisquer *statements* seguintes para a Transaction vão para a *high-priority queue* se a Transaction estiver em andamento (*statements* para ela começaram a ser executados) ou para a *low-priority queue* caso contrário. A atribuição à Queue pode ser afetada ao habilitar a variável de sistema [`thread_pool_high_priority_connection`](server-system-variables.html#sysvar_thread_pool_high_priority_connection), o que faz com que todos os *statements* enfileirados para uma sessão entrem na *high-priority queue*.

  *Statements* para um Storage Engine não transacional, ou um Engine transacional se [`autocommit`](server-system-variables.html#sysvar_autocommit) estiver habilitado, são tratados como *statements* de baixa prioridade, pois neste caso, cada *statement* é uma Transaction. Assim, dada uma mistura de *statements* para tabelas `InnoDB` e `MyISAM`, o Thread Pool prioriza aqueles para `InnoDB` em detrimento daqueles para `MyISAM`, a menos que [`autocommit`](server-system-variables.html#sysvar_autocommit) esteja habilitado. Com [`autocommit`](server-system-variables.html#sysvar_autocommit) habilitado, todos os *statements* são de baixa prioridade.

* Quando o Thread Group seleciona um *statement* enfileirado para execução, ele primeiro procura na *high-priority queue*, depois na *low-priority queue*. Se um *statement* for encontrado, ele é removido de sua Queue e começa a ser executado.

* Se um *statement* permanecer na *low-priority queue* por muito tempo, o Thread Pool o move para a *high-priority queue*. O valor da variável de sistema [`thread_pool_prio_kickup_timer`](server-system-variables.html#sysvar_thread_pool_prio_kickup_timer) controla o tempo antes dessa movimentação. Para cada Thread Group, um máximo de um *statement* a cada 10ms (100 por segundo) é movido da *low-priority queue* para a *high-priority queue*.

* O Thread Pool reutiliza os Threads mais ativos para obter um uso muito melhor dos CPU Caches. Este é um pequeno ajuste que tem um grande impacto no desempenho.

* Enquanto um Thread executa um *statement* a partir de uma Connection de usuário, a instrumentação do Performance Schema atribui a atividade do Thread à Connection de usuário. Caso contrário, o Performance Schema atribui a atividade ao Thread Pool.

Aqui estão exemplos de condições sob as quais um Thread Group pode ter vários Threads iniciados para executar *statements*:

* Um Thread começa a executar um *statement*, mas é executado por tempo suficiente para ser considerado *stalled*. O Thread Group permite que outro Thread comece a executar outro *statement*, mesmo que o primeiro Thread ainda esteja em execução.

* Um Thread começa a executar um *statement*, então fica *blocked* e reporta isso de volta ao Thread Pool. O Thread Group permite que outro Thread comece a executar outro *statement*.

* Um Thread começa a executar um *statement*, fica *blocked*, mas não reporta que está *blocked* porque o Block não ocorre em código que foi instrumentado com *callbacks* do Thread Pool. Neste caso, o Thread parece ao Thread Group estar ainda em execução. Se o Block durar tempo suficiente para o *statement* ser considerado *stalled*, o Group permite que outro Thread comece a executar outro *statement*.

O Thread Pool é projetado para ser escalável em um número crescente de Connections. Ele também é projetado para evitar Deadlocks que podem surgir ao limitar o número de *statements* em execução ativa. É importante que os Threads que não reportam ao Thread Pool não impeçam a execução de outros *statements* e, assim, causem um Deadlock no Thread Pool. Exemplos de tais *statements* a seguir:

* *Statements* de longa duração. Estes levariam todos os recursos a serem usados por apenas alguns *statements* e poderiam impedir que todos os outros acessassem o servidor.

* *Binary Log dump threads* que leem o Binary Log e o enviam para Replicas. Este é um tipo de “*statement*” de longa duração que é executado por muito tempo e que não deve impedir a execução de outros *statements*.

* *Statements* *blocked* em um Row Lock, Table Lock, *sleep*, ou qualquer outra atividade de Block que não tenha sido reportada ao Thread Pool pelo MySQL Server ou por um Storage Engine.

Em cada caso, para prevenir Deadlock, o *statement* é movido para a categoria *stalled* quando não é concluído rapidamente, para que o Thread Group possa permitir que outro *statement* comece a ser executado. Com este design, quando um Thread executa ou fica *blocked* por um tempo prolongado, o Thread Pool move o Thread para a categoria *stalled* e, durante o resto da execução do *statement*, ele não impede a execução de outros *statements*.

O número máximo de Threads que podem ocorrer é a soma de [`max_connections`](server-system-variables.html#sysvar_max_connections) e [`thread_pool_size`](server-system-variables.html#sysvar_thread_pool_size). Isso pode acontecer em uma situação em que todas as Connections estão em modo de execução e um Thread extra é criado por Group para escutar mais *statements*. Este não é necessariamente um estado que ocorre frequentemente, mas é teoricamente possível.