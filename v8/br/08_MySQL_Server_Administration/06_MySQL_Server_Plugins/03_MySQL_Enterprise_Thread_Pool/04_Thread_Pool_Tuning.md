#### 7.6.3.4 Ajuste da Piscina de Fios

Esta seção fornece diretrizes sobre a determinação da melhor configuração para o desempenho do pool de threads, conforme medido por uma métrica como transações por segundo.

A principal importância está no número de grupos de fios no pool de fios, que pode ser definido na inicialização do servidor usando a opção `--thread-pool-size`; isso não pode ser alterado durante a execução. Os valores recomendados para essa opção dependem se o motor de armazenamento primário em uso é `InnoDB` ou `MyISAM`:

- Se o motor de armazenamento primário for `InnoDB`, o valor recomendado para o tamanho do pool de threads é o número de núcleos físicos disponíveis na máquina hospedeira, até um máximo de 512.

- Se o motor de armazenamento primário for `MyISAM`, o tamanho do pool de threads deve ser bastante baixo. O desempenho ótimo é frequentemente observado com valores entre 4 e 8. Valores mais altos tendem a ter um impacto ligeiramente negativo, mas não dramático, no desempenho.

O limite superior do número de transações concorrentes que podem ser processadas pelo plugin de pool de threads é determinado pelo valor de `thread_pool_max_transactions_limit`. O ajuste inicial da recomendação para essa variável do sistema é o número de núcleos físicos vezes 32. Você pode precisar ajustar o valor a partir desse ponto inicial para atender a uma carga de trabalho específica; um limite superior razoável para esse valor é o número máximo de conexões concorrentes esperadas; o valor da variável de status `Max_used_connections` pode servir como um guia para determinar isso. Uma boa maneira de proceder é começar com `thread_pool_max_transactions_limit` definido para esse valor, depois ajustá-lo para baixo enquanto observa o efeito no desempenho.

O número máximo de threads de consulta permitido em um grupo de threads é determinado pelo valor de `thread_pool_query_threads_per_group`, que pode ser ajustado em tempo de execução. O produto desse valor e do tamanho do pool de threads é aproximadamente igual ao número total de threads disponíveis para processar consultas. Obter o melhor desempenho geralmente significa encontrar o equilíbrio adequado para sua aplicação entre `thread_pool_query_threads_per_group` e o tamanho do pool de threads. Valores maiores para `thread_pool_query_threads_per_group` tornam menos provável que todos os threads do grupo de threads executem consultas de longa duração simultaneamente, bloqueando as consultas de curta duração quando a carga de trabalho inclui consultas de longa e curta duração. Você deve ter em mente que o custo de operação de sondagem de conexão para cada grupo de threads aumenta quando se usam valores menores para o tamanho do pool de threads com valores maiores para `thread_pool_query_threads_per_group`. Por essa razão, recomendamos um valor inicial de `2` para `thread_pool_query_threads_per_group`; definir essa variável para um valor menor geralmente não oferece nenhum benefício de desempenho.

Para obter o melhor desempenho em condições normais, também recomendamos que você defina `thread_pool_algorithm` para 1 para alta concorrência.

Além disso, o valor da variável de sistema `thread_pool_stall_limit` determina o tratamento de instruções bloqueadas e de execução prolongada. Se todas as chamadas que bloqueiam o MySQL Server fossem reportadas ao pool de threads, ele sempre saberia quando os threads de execução estão bloqueados, mas isso nem sempre é verdade. Por exemplo, blocos podem ocorrer em código que não foi instrumentado com callbacks do pool de threads. Para tais casos, o pool de threads deve ser capaz de identificar threads que parecem estar bloqueadas. Isso é feito por meio de um tempo limite determinado pelo valor de `thread_pool_stall_limit`, que garante que o servidor não fique completamente bloqueado. O valor de `thread_pool_stall_limit` representa um número de intervalos de 10 milissegundos, de modo que `600` (o máximo) representa 6 segundos.

`thread_pool_stall_limit` também permite que o pool de threads gerencie instruções de execução prolongada. Se uma instrução de execução prolongada fosse permitida para bloquear um grupo de threads, todas as outras conexões atribuídas ao grupo seriam bloqueadas e incapazes de iniciar a execução até que a instrução de execução prolongada fosse concluída. No pior dos casos, isso poderia levar horas ou até dias.

O valor de `thread_pool_stall_limit` deve ser escolhido de forma que as instruções que executam mais tempo do que seu valor sejam consideradas bloqueadas. As instruções bloqueadas geram um grande overhead extra, pois envolvem trocas de contexto extras e, em alguns casos, até mesmo a criação de novos threads. Por outro lado, definir o parâmetro `thread_pool_stall_limit` muito alto significa que instruções de execução longa bloqueiam um número de instruções de execução curta por mais tempo do que o necessário. Valores de espera curtos permitem que os threads comecem mais rapidamente. Valores curtos também são melhores para evitar situações de deadlock. Valores de espera longos são úteis para cargas de trabalho que incluem instruções de execução longa, para evitar o início de muitas novas instruções enquanto as atuais estão sendo executadas.

Suponha que um servidor execute uma carga de trabalho onde 99,9% das declarações sejam concluídas em 100ms, mesmo quando o servidor estiver sobrecarregado, e as declarações restantes levem entre 100ms e 2 horas, distribuídas de forma bastante uniforme. Nesse caso, seria sensato definir `thread_pool_stall_limit` para 10 (10 × 10ms = 100ms). O valor padrão de 6 (60ms) é adequado para servidores que executam principalmente declarações muito simples.

O parâmetro `thread_pool_stall_limit` pode ser alterado em tempo de execução para permitir que você encontre um equilíbrio adequado para a carga de trabalho do servidor. Supondo que a tabela `tp_thread_group_stats` esteja habilitada, você pode usar a seguinte consulta para determinar a fração de instruções executadas que ficaram paralisadas:

```
SELECT SUM(STALLED_QUERIES_EXECUTED) / SUM(QUERIES_EXECUTED)
FROM performance_schema.tp_thread_group_stats;
```

Esse número deve ser o menor possível. Para diminuir a probabilidade de as declarações ficarem paralisadas, aumente o valor de `thread_pool_stall_limit`.

Quando uma declaração chega, qual é o tempo máximo que ela pode ser adiada antes de realmente começar a ser executada? Vamos supor que as seguintes condições se apliquem:

- Há 200 declarações na fila de baixa prioridade.

- Há 10 declarações na fila de alta prioridade.

- `thread_pool_prio_kickup_timer` está definido para 10000 (10 segundos).

- `thread_pool_stall_limit` está definido para 100 (1 segundo).

No pior dos casos, as 10 declarações de alta prioridade representam 10 transações que continuam sendo executadas por um longo tempo. Assim, no pior dos casos, nenhuma declaração pode ser movida para a fila de alta prioridade porque ela sempre já contém declarações aguardando execução. Após 10 segundos, a nova declaração se torna elegível para ser movida para a fila de alta prioridade. No entanto, antes que ela possa ser movida, todas as declarações anteriores a ela também devem ser movidas. Isso pode levar mais 2 segundos, porque no máximo 100 declarações por segundo são movidas para a fila de alta prioridade. Agora, quando a declaração chega à fila de alta prioridade, pode haver potencialmente muitas declarações em execução. No pior dos casos, cada uma delas fica paralisada e são necessários 1 segundo para cada declaração antes que a próxima declaração seja recuperada da fila de alta prioridade. Assim, neste cenário, leva-se 222 segundos antes que a nova declaração comece a ser executada.

Este exemplo mostra um caso extremo para uma aplicação. Como lidar com isso depende da aplicação. Se a aplicação tiver requisitos elevados para o tempo de resposta, ela provavelmente deve restringir os usuários em um nível mais alto. Caso contrário, ela pode usar os parâmetros de configuração do pool de threads para definir algum tipo de tempo máximo de espera.
