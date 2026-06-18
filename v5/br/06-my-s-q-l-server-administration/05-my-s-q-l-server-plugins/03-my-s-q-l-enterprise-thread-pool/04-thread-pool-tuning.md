#### 5.5.3.4 Ajuste da Piscina de Fios

Esta seção fornece diretrizes sobre como definir as variáveis do pool de threads para obter o melhor desempenho, medido por uma métrica como transações por segundo.

`thread_pool_size` é o parâmetro mais importante que controla o desempenho do pool de threads. Ele só pode ser definido na inicialização do servidor. Nossa experiência com o teste do pool de threads indica o seguinte:

- Se o motor de armazenamento primário for o `InnoDB`, o ajuste ótimo do `thread_pool_size` provavelmente estará entre 16 e 36, com os valores ótimos mais comuns tendendo a estar entre 24 e 36. Não vimos nenhuma situação em que o ajuste tenha sido ótimo além de 36. Pode haver casos especiais em que um valor menor que 16 seja ótimo.

  Para cargas de trabalho como DBT2 e Sysbench, o valor ótimo para o `InnoDB` parece ser geralmente em torno de 36. Para cargas de trabalho muito intensivas em escrita, o ajuste ótimo pode, às vezes, ser menor.

- Se o motor de armazenamento primário for `MyISAM`, o ajuste `thread_pool_size` deve ser bastante baixo. O desempenho ótimo é frequentemente visto com valores de 4 a 8. Valores mais altos tendem a ter um impacto ligeiramente negativo, mas não dramático, no desempenho.

Outra variável do sistema, `thread_pool_stall_limit`, é importante para o gerenciamento de instruções bloqueadas e de execução prolongada. Se todas as chamadas que bloqueiam o MySQL Server forem reportadas ao pool de threads, ele sempre saberá quando os threads de execução estão bloqueados. No entanto, isso nem sempre é verdade. Por exemplo, blocos podem ocorrer em código que não foi instrumentado com callbacks do pool de threads. Para tais casos, o pool de threads deve ser capaz de identificar threads que parecem estar bloqueados. Isso é feito por meio de um tempo limite que pode ser ajustado usando a variável de sistema `thread_pool_stall_limit`, cujo valor é medido em unidades de 10ms. Este parâmetro garante que o servidor não fique completamente bloqueado. O valor de `thread_pool_stall_limit` tem um limite superior de 6 segundos para evitar o risco de um servidor em deadlock.

`thread_pool_stall_limit` também permite que o pool de threads gerencie instruções de execução prolongada. Se uma instrução de execução prolongada fosse permitida para bloquear um grupo de threads, todas as outras conexões atribuídas ao grupo seriam bloqueadas e incapazes de iniciar a execução até que a instrução de execução prolongada fosse concluída. No pior dos casos, isso poderia levar horas ou até dias.

O valor de `thread_pool_stall_limit` deve ser escolhido de forma que as instruções que executam mais tempo do que seu valor sejam consideradas travadas. As instruções travadas geram um grande excesso de overhead, pois envolvem trocas de contexto extras e, em alguns casos, até mesmo a criação de novos threads. Por outro lado, definir o parâmetro `thread_pool_stall_limit` muito alto significa que instruções de execução longa bloqueiam um número de instruções de execução curta por mais tempo do que o necessário. Valores de espera curtos permitem que os threads comecem mais rapidamente. Valores curtos também são melhores para evitar situações de deadlock. Valores de espera longos são úteis para cargas de trabalho que incluem instruções de execução longa, para evitar o início de muitas novas instruções enquanto as atuais estão sendo executadas.

Suponha que um servidor execute uma carga de trabalho onde 99,9% das instruções são concluídas em 100ms, mesmo quando o servidor está sobrecarregado, e as instruções restantes levam entre 100ms e 2 horas, distribuídas de forma bastante uniforme. Nesse caso, seria sensato definir `thread_pool_stall_limit` para 10 (10 × 10ms = 100ms). O valor padrão de 6 (60ms) é adequado para servidores que executam principalmente instruções muito simples.

O parâmetro `thread_pool_stall_limit` pode ser alterado em tempo de execução para permitir que você encontre um equilíbrio adequado para a carga de trabalho do servidor. Supondo que a tabela `TP_THREAD_GROUP_STATS` esteja habilitada, você pode usar a seguinte consulta para determinar a fração de instruções executadas que ficaram paradas:

```sql
SELECT SUM(STALLED_QUERIES_EXECUTED) / SUM(QUERIES_EXECUTED)
FROM INFORMATION_SCHEMA.TP_THREAD_GROUP_STATS;
```

Esse número deve ser o menor possível. Para diminuir a probabilidade de as declarações ficarem paralisadas, aumente o valor de `thread_pool_stall_limit`.

Quando uma declaração chega, qual é o tempo máximo que ela pode ser adiada antes de realmente começar a ser executada? Vamos supor que as seguintes condições se apliquem:

- Há 200 declarações na fila de baixa prioridade.

- Há 10 declarações na fila de alta prioridade.

- `thread_pool_prio_kickup_timer` está definido para 10000 (10 segundos).

- `thread_pool_stall_limit` está definido para 100 (1 segundo).

No pior dos casos, as 10 declarações de alta prioridade representam 10 transações que continuam sendo executadas por um longo tempo. Assim, no pior dos casos, nenhuma declaração é movida para a fila de alta prioridade porque ela já contém declarações aguardando execução. Após 10 segundos, a nova declaração se torna elegível para ser movida para a fila de alta prioridade. No entanto, antes que ela possa ser movida, todas as declarações anteriores a ela também devem ser movidas. Isso pode levar mais 2 segundos, porque no máximo 100 declarações por segundo são movidas para a fila de alta prioridade. Agora, quando a declaração chega à fila de alta prioridade, pode haver potencialmente muitas declarações em execução. No pior dos casos, cada uma delas fica paralisada e leva 1 segundo para cada declaração antes que a próxima declaração seja recuperada da fila de alta prioridade. Assim, neste cenário, leva-se 222 segundos antes que a nova declaração comece a ser executada.

Este exemplo mostra um caso extremo para uma aplicação. Como lidar com isso depende da aplicação. Se a aplicação tiver requisitos elevados para o tempo de resposta, ela provavelmente deve restringir os usuários em um nível mais alto. Caso contrário, ela pode usar os parâmetros de configuração do pool de threads para definir algum tipo de tempo máximo de espera.
