#### 7.6.3.4 Ajuste de conjuntos de roscas

Esta secção fornece orientações sobre a determinação da melhor configuração para o desempenho do conjunto de threads, medido utilizando uma métrica como as transações por segundo.

O número de grupos de tópicos no pool de tópicos é o mais importante, que pode ser definido no início do servidor usando a opção `--thread-pool-size`; isso não pode ser alterado no tempo de execução.

- Se o motor de armazenamento primário for `InnoDB`, o valor recomendado para o tamanho do pool de threads é o número de núcleos físicos disponíveis na máquina host, até um máximo de 512.
- Se o motor de armazenamento primário for `MyISAM`, o tamanho do pool de threads deve ser bastante baixo.

O limite superior do número de transações simultâneas que podem ser processadas pelo plugin do pool de threads é determinado pelo valor de `thread_pool_max_transactions_limit`. A configuração inicial recomendada para esta variável do sistema é o número de núcleos físicos vezes 32. Você pode precisar ajustar o valor a partir deste ponto de partida para se adequar a uma determinada carga de trabalho; um limite superior razoável para este valor é o número máximo de conexões simultâneas esperadas; o valor da variável de status `Max_used_connections` pode servir como um guia para determinar isso. Uma boa maneira de proceder é começar com `thread_pool_max_transactions_limit` definido para este valor, em seguida, ajustá-lo para baixo enquanto observa o efeito sobre a taxa de transferência.

O número máximo de tópicos de consulta permitidos em um grupo de tópicos é determinado pelo valor de `thread_pool_query_threads_per_group`, que pode ser ajustado no tempo de execução. O produto deste valor e o tamanho do pool de tópicos é aproximadamente igual ao número total de tópicos disponíveis para processar consultas. Obter o melhor desempenho geralmente significa atingir o equilíbrio adequado para sua aplicação entre `thread_pool_query_threads_per_group` e o tamanho do pool de tópicos. Valores maiores para o valor de `thread_pool_query_threads_per_group` tornam menos provável que todos os tópicos no grupo de tópicos executem simultaneamente consultas de longa duração, bloqueando as mais curtas quando a carga de trabalho inclui consultas de longa e curta duração. Você deve ter em mente que a sobrecarga da operação de pesquisa de conexão para cada grupo de tópicos aumenta quando se usam valores menores para o tamanho do pool de tópicos com valores maiores para \[\[PH\_CODE\_CODE3]]. Por esta razão, recomendamos um valor inicial de \[\[PH\_CODE

Para o melhor desempenho em condições normais, também recomendamos que você defina `thread_pool_algorithm` em 1 para alta concurrencia.

Além disso, o valor da variável de sistema `thread_pool_stall_limit` determina o tratamento de instruções bloqueadas e de longa execução. Se todas as chamadas que bloqueiam o MySQL Server fossem relatadas ao pool de threads, ele sempre saberia quando os threads de execução são bloqueados, mas isso pode nem sempre ser verdade. Por exemplo, bloqueios poderiam ocorrer em código que não foi instrumentado com callbacks de pool de threads. Para tais casos, o pool de threads deve ser capaz de identificar threads que parecem ser bloqueados. Isso é feito por meio de um timeout determinado pelo valor de `thread_pool_stall_limit`, que garante que o servidor não seja completamente bloqueado. O valor de `thread_pool_stall_limit` representa um número de intervalos de 10 milissegundos, de modo que `600` (o máximo) representa 6 segundos.

`thread_pool_stall_limit` também permite que o pool de tópicos para lidar com longas instruções. Se uma instrução de longa duração foram autorizados a bloquear um grupo de tópicos, todas as outras conexões atribuídas ao grupo seria bloqueado e incapaz de iniciar a execução até a instrução de longa duração concluída. No pior dos casos, isso pode levar horas ou até dias.

O valor de `thread_pool_stall_limit` deve ser escolhido de tal forma que as instruções que executam mais do que seu valor sejam consideradas paradas. As instruções paradas geram muita sobrecarga extra, pois envolvem interruptores de contexto extras e, em alguns casos, até criações de threads extras. Por outro lado, definir o parâmetro `thread_pool_stall_limit` muito alto significa que as instruções de execução longa bloqueiam várias instruções de execução curta por mais tempo do que o necessário. Valores de espera curtos permitem que os threads iniciem mais rapidamente. Valores de espera curtos também são melhores para evitar situações de impasse. Valores de espera longa são úteis para cargas de trabalho que incluem instruções de execução longa, para evitar iniciar muitas instruções novas enquanto as atuais são executadas.

Suponha que um servidor execute uma carga de trabalho em que 99,9% das instruções são concluídas em 100ms mesmo quando o servidor está carregado, e as instruções restantes levam entre 100ms e 2 horas bastante uniformemente espalhadas. Neste caso, faria sentido definir o `thread_pool_stall_limit` em 10 (10 × 10ms = 100ms). O valor padrão de 6 (60ms) é adequado para servidores que executam principalmente instruções muito simples.

O parâmetro `thread_pool_stall_limit` pode ser alterado durante a execução para permitir que você atinja um equilíbrio apropriado para a carga de trabalho do servidor.

```
SELECT SUM(STALLED_QUERIES_EXECUTED) / SUM(QUERIES_EXECUTED)
FROM performance_schema.tp_thread_group_stats;
```

Este número deve ser o mais baixo possível. Para diminuir a probabilidade de declarações estagnando, aumente o valor de `thread_pool_stall_limit`.

Quando uma instrução chega, qual é o tempo máximo que ela pode ser atrasada antes de realmente começar a ser executada?

- Há 200 declarações na fila de baixa prioridade.
- Há 10 declarações na fila de alta prioridade.
- \[`thread_pool_prio_kickup_timer`]] é definido em 10000 (10 segundos).
- \[`thread_pool_stall_limit`]] é definido em 100 (1 segundo).

No pior dos casos, as 10 instruções de alta prioridade representam 10 transações que continuam a ser executadas por um longo tempo. Assim, no pior dos casos, nenhuma instrução pode ser movida para a fila de alta prioridade porque ela sempre contém instruções esperando por execução. Após 10 segundos, a nova instrução é elegível para ser movida para a fila de alta prioridade. No entanto, antes de poder ser movida, todas as instruções antes dela devem ser movidas também. Isso pode levar mais 2 segundos porque um máximo de 100 instruções por segundo são movidas para a fila de alta prioridade. Agora, quando a instrução atinge a fila de alta prioridade, pode haver muitas instruções de longa duração à sua frente. No pior dos casos, cada uma delas fica paralisada e é necessário 1 segundo para cada instrução antes que a próxima instrução seja recuperada da fila de alta prioridade. Assim, neste cenário, são necessários 222 segundos antes de a nova instrução começar a ser executada.

Este exemplo mostra o pior caso para uma aplicação. Como lidar com isso depende da aplicação. Se a aplicação tem altos requisitos para o tempo de resposta, ela provavelmente deve acelerar os usuários em um nível mais alto. Caso contrário, ela pode usar os parâmetros de configuração do pool de threads para definir algum tipo de tempo de espera máximo.
