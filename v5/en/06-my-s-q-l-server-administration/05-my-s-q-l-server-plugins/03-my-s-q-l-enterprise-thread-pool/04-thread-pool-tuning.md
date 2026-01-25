#### 5.5.3.4 Otimização do Thread Pool

Esta seção fornece diretrizes sobre a configuração de variáveis de sistema do thread pool para o melhor desempenho, medido usando uma métrica como transactions per second.

[`thread_pool_size`](server-system-variables.html#sysvar_thread_pool_size) é o parâmetro mais importante que controla o desempenho do thread pool. Ele pode ser configurado apenas na inicialização do server. Nossa experiência ao testar o thread pool indica o seguinte:

* Se o storage engine primário for [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine"), a configuração ideal de [`thread_pool_size`](server-system-variables.html#sysvar_thread_pool_size) provavelmente estará entre 16 e 36, com os valores ideais mais comuns tendendo a ser de 24 a 36. Não vimos nenhuma situação em que a configuração tenha sido ideal acima de 36. Pode haver casos especiais em que um valor menor que 16 seja ideal.

  Para workloads como DBT2 e Sysbench, o ideal para [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") geralmente parece ser em torno de 36. Para workloads com uso intensivo de escrita (write-intensive), a configuração ideal pode ser menor.

* Se o storage engine primário for [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine"), a configuração de [`thread_pool_size`](server-system-variables.html#sysvar_thread_pool_size) deve ser razoavelmente baixa. O desempenho ideal é frequentemente observado com valores de 4 a 8. Valores mais altos tendem a ter um impacto ligeiramente negativo, mas não dramático, no desempenho.

Outra variável de sistema, [`thread_pool_stall_limit`](server-system-variables.html#sysvar_thread_pool_stall_limit), é importante para o tratamento de statements bloqueados e de longa execução (long-running statements). Se todas as chamadas que bloqueiam o MySQL Server fossem reportadas ao thread pool, ele sempre saberia quando os execution threads estariam bloqueados. No entanto, isso pode nem sempre ser verdade. Por exemplo, os bloqueios podem ocorrer em código que não foi instrumentado com thread pool callbacks. Para esses casos, o thread pool deve ser capaz de identificar threads que parecem estar bloqueados. Isso é feito por meio de um timeout que pode ser ajustado usando a variável de sistema [`thread_pool_stall_limit`](server-system-variables.html#sysvar_thread_pool_stall_limit), cujo valor é medido em unidades de 10ms. Este parâmetro garante que o server não fique completamente bloqueado. O valor de [`thread_pool_stall_limit`](server-system-variables.html#sysvar_thread_pool_stall_limit) tem um limite superior de 6 segundos para evitar o risco de um server em deadlock.

[`thread_pool_stall_limit`](server-system-variables.html#sysvar_thread_pool_stall_limit) também permite que o thread pool gerencie statements de longa execução. Se um long-running statement fosse permitido bloquear um thread group, todas as outras conexões atribuídas ao grupo seriam bloqueadas e incapazes de iniciar a execução até que o long-running statement fosse concluído. Na pior das hipóteses, isso poderia levar horas ou até dias.

O valor de [`thread_pool_stall_limit`](server-system-variables.html#sysvar_thread_pool_stall_limit) deve ser escolhido de forma que statements que executam por mais tempo do que o seu valor sejam considerados *stalled*. Stalled statements geram muita sobrecarga extra, pois envolvem context switches extras e, em alguns casos, até mesmo criações de threads extras. Por outro lado, definir o parâmetro [`thread_pool_stall_limit`](server-system-variables.html#sysvar_thread_pool_stall_limit) muito alto significa que statements de longa execução bloqueiam uma série de statements de curta execução por mais tempo do que o necessário. Valores de espera curtos permitem que threads iniciem mais rapidamente. Valores curtos também são melhores para evitar situações de deadlock. Valores de espera longos são úteis para workloads que incluem statements de longa execução, para evitar iniciar muitos statements novos enquanto os atuais estão em execução.

Suponha que um server execute um workload onde 99,9% dos statements sejam concluídos em 100ms, mesmo quando o server está carregado, e os statements restantes levem entre 100ms e 2 horas, distribuídos de forma bastante uniforme. Neste caso, faria sentido definir [`thread_pool_stall_limit`](server-system-variables.html#sysvar_thread_pool_stall_limit) como 10 (10 × 10ms = 100ms). O valor padrão de 6 (60ms) é adequado para servers que executam principalmente statements muito simples.

O parâmetro [`thread_pool_stall_limit`](server-system-variables.html#sysvar_thread_pool_stall_limit) pode ser alterado em runtime para permitir que você encontre um equilíbrio apropriado para o workload do server. Assumindo que a tabela `TP_THREAD_GROUP_STATS` esteja habilitada, você pode usar a seguinte Query para determinar a fração de statements executados que entraram em *stall*:

```sql
SELECT SUM(STALLED_QUERIES_EXECUTED) / SUM(QUERIES_EXECUTED)
FROM INFORMATION_SCHEMA.TP_THREAD_GROUP_STATS;
```

Este número deve ser o mais baixo possível. Para diminuir a probabilidade de statements entrarem em *stall*, aumente o valor de [`thread_pool_stall_limit`](server-system-variables.html#sysvar_thread_pool_stall_limit).

Quando um statement chega, qual é o tempo máximo que ele pode ser atrasado antes de realmente começar a ser executado? Suponha que as seguintes condições se apliquem:

* Existem 200 statements na fila de baixa prioridade (low-priority queue).
* Existem 10 statements na fila de alta prioridade (high-priority queue).
* [`thread_pool_prio_kickup_timer`](server-system-variables.html#sysvar_thread_pool_prio_kickup_timer) está configurado para 10000 (10 segundos).
* [`thread_pool_stall_limit`](server-system-variables.html#sysvar_thread_pool_stall_limit) está configurado para 100 (1 segundo).

No pior dos casos, os 10 statements de alta prioridade representam 10 transactions que continuam a ser executadas por um longo tempo. Assim, na pior das hipóteses, nenhum statement é movido para a high-priority queue porque ela já contém statements aguardando execução. Após 10 segundos, o novo statement é elegível para ser movido para a high-priority queue. No entanto, antes que possa ser movido, todos os statements anteriores a ele também devem ser movidos. Isso pode levar mais 2 segundos, pois um máximo de 100 statements por segundo são movidos para a high-priority queue. Agora, quando o statement atinge a high-priority queue, pode haver potencialmente muitos statements de longa execução à sua frente. Na pior das hipóteses, cada um deles entra em *stall* e leva 1 segundo para cada statement antes que o próximo statement seja recuperado da high-priority queue. Assim, neste cenário, são necessários 222 segundos antes que o novo statement comece a ser executado.

Este exemplo mostra o pior caso para uma aplicação. Como lidar com isso depende da aplicação. Se a aplicação tiver altos requisitos de response time, ela provavelmente deverá limitar (throttle) os usuários em um nível mais alto. Caso contrário, ela pode usar os parâmetros de configuração do thread pool para definir algum tipo de tempo máximo de espera.