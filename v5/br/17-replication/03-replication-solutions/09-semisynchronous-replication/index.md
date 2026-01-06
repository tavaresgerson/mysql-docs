### 16.3.9 Replicação semiesincronizada

Interface Administrativa de Replicação Semisíncrona

16.3.9.2 Instalação e Configuração da Replicação Semisíncrona

16.3.9.3 Monitoramento da Replicação Semisíncrona

Além da replicação assíncrona integrada, o MySQL 5.7 suporta uma interface para replicação semi-síncrona, implementada por plugins. Esta seção discute o que é a replicação semi-síncrona e como ela funciona. As seções seguintes abordam a interface administrativa para replicação semi-síncrona e como instalá-la, configurá-la e monitorá-la.

A replicação do MySQL, por padrão, é assíncrona. A fonte escreve eventos em seu log binário e as réplicas solicitam-nos quando estão prontas. A fonte não sabe se uma réplica já recuperou e processou as transações ou quando, e não há garantia de que algum evento chegue a qualquer réplica. Com a replicação assíncrona, se a fonte falhar, as transações que ela tenha comprometido podem não ter sido transmitidas a nenhuma réplica. A falha do servidor fonte para a réplica, nesse caso, pode resultar em uma falha para um servidor que está faltando transações em relação à fonte.

Com a replicação totalmente síncrona, quando uma fonte executa uma transação, todas as réplicas também devem ter executado a transação antes de a fonte retornar à sessão que executou a transação. A replicação totalmente síncrona significa que o failover da fonte para qualquer réplica é possível a qualquer momento. A desvantagem da replicação totalmente síncrona é que pode haver um grande atraso para concluir uma transação.

A replicação semiesincronizada fica entre a replicação assíncrona e a replicação totalmente sincronizada. A fonte aguarda até que pelo menos uma réplica tenha recebido e registrado os eventos (o número necessário de réplicas é configurável) e, então, confirma a transação. A fonte não espera que todas as réplicas confirmem a recepção e requer apenas uma confirmação das réplicas, não que os eventos tenham sido totalmente executados e confirmados no lado da réplica. Portanto, a replicação semiesincronizada garante que, se a fonte falhar, todas as transações que ela confirmou foram transmitidas para pelo menos uma réplica.

Em comparação com a replicação assíncrona, a replicação semiesincrônica oferece maior integridade dos dados, pois, quando um commit retorna com sucesso, sabe-se que os dados existem em pelo menos dois locais. Até que uma fonte semiesincrônica receba confirmação do número necessário de réplicas, a transação fica suspensa e não é confirmada.

Comparado à replicação totalmente síncrona, a replicação sem síncrona é mais rápida, pois pode ser configurada para equilibrar suas necessidades de integridade dos dados (o número de réplicas que confirmam a recepção da transação) com a velocidade dos commits, que são mais lentos devido à necessidade de esperar pelas réplicas.

Importante

Com a replicação semiesincronizada, se a fonte falhar e uma falha de replicação for realizada, a fonte falha não deve ser reutilizada como servidor de fonte de replicação e deve ser descartada. Ela pode ter transações que não foram reconhecidas por nenhuma replica, portanto, não foram comprometidas antes da falha de replicação.

Se o seu objetivo é implementar uma topologia de replicação tolerante a falhas, onde todos os servidores recebem as mesmas transações na mesma ordem, e um servidor que falha pode se reiniciar no grupo e ser atualizado automaticamente, você pode usar a Replicação por Grupo para alcançar isso. Para obter informações, consulte \[Capítulo 17, *Replicação por Grupo*] (group-replication.html).

O impacto no desempenho da replicação semi-sincrona em comparação com a replicação assíncrona é o compromisso com o aumento da integridade dos dados. A quantidade de desaceleração é, no mínimo, o tempo de ida e volta do TCP/IP para enviar o commit para a réplica e esperar o reconhecimento da recepção pela réplica. Isso significa que a replicação semi-sincrona funciona melhor para servidores próximos que se comunicam em redes rápidas e pior para servidores distantes que se comunicam em redes lentas. A replicação semi-sincrona também coloca um limite de taxa em sessões ocupadas, restringindo a velocidade com que eventos de log binário podem ser enviados da fonte para a réplica. Quando um usuário está muito ocupado, isso o desacelera, o que pode ser útil em algumas situações de implantação.

A replicação semiesincronizada entre uma fonte e suas réplicas funciona da seguinte maneira:

- Uma réplica indica se é compatível com semi-sincronização quando se conecta à fonte.

- Se a replicação semissíncrona estiver habilitada no lado de origem e houver pelo menos uma replica semissíncrona, uma thread que realiza um commit de transação nos blocos de origem e aguarda até que pelo menos uma replica semissíncrona reconheça que recebeu todos os eventos da transação, ou até que ocorra um tempo limite.

- A réplica só reconhece a recepção dos eventos de uma transação após esses eventos terem sido escritos em seu log de retransmissão e descarregados no disco.

- Se ocorrer um tempo de espera sem que nenhuma réplica tenha confirmado a transação, a fonte retorna à replicação assíncrona. Quando pelo menos uma réplica semissíncrona recupera o atraso, a fonte retorna à replicação semissíncrona.

- A replicação semiesincronizada deve ser habilitada tanto no lado da fonte quanto no lado das réplicas. Se a replicação semiesincronizada estiver desabilitada na fonte ou habilitada na fonte, mas não nas réplicas, a fonte usará a replicação assíncrona.

Enquanto a fonte está bloqueando (esperando por confirmação de uma réplica), ela não retorna à sessão que realizou a transação. Quando o bloqueio termina, a fonte retorna à sessão, que então pode prosseguir para executar outras instruções. Neste ponto, a transação foi confirmada no lado da fonte e o recebimento de seus eventos foi confirmado por pelo menos uma réplica. O número de confirmações de réplica que a fonte deve receber por transação antes de retornar à sessão é configurável usando a variável de sistema `rpl_semi_sync_master_wait_for_slave_count`, cujo valor padrão é 1.

O bloqueio também ocorre após recuos que são escritos no log binário, o que acontece quando uma transação que modifica tabelas não transacionais é revertida. A transação revertida é registrada, mesmo que não tenha efeito para tabelas transacionais, porque as modificações nas tabelas não transacionais não podem ser revertidas e devem ser enviadas para réplicas.

Para declarações que não ocorrem em contexto de transação (ou seja, quando nenhuma transação foi iniciada com `START TRANSACTION` ou `SET autocommit = 0`), o autocommit está habilitado e cada declaração executa implicitamente. Com a replicação semi-sincrona, o bloco de origem para cada declaração é bloqueado, assim como acontece com os commits explícitos de transação.

A variável de sistema `rpl_semi_sync_master_wait_point` controla o ponto em que uma fonte de replicação semi-sincronizada espera pela confirmação da replica da recepção da transação antes de retornar um status ao cliente que comprometeu a transação. Esses valores são permitidos:

- `AFTER_SYNC` (padrão): A fonte escreve cada transação em seu log binário e na replica, e sincroniza o log binário com o disco. A fonte aguarda o reconhecimento da replica da recepção da transação após a sincronização. Ao receber o reconhecimento, a fonte confirma a transação no mecanismo de armazenamento e retorna um resultado ao cliente, que pode então prosseguir.

- `AFTER_COMMIT`: A fonte escreve cada transação no seu log binário e na replica, sincroniza o log binário e confirma a transação no motor de armazenamento. A fonte aguarda a confirmação da replica sobre a recepção da transação após o commit. Ao receber a confirmação, a fonte retorna um resultado ao cliente, que pode então prosseguir.

As características de replicação desses ajustes diferem da seguinte forma:

- Com `AFTER_SYNC`, todos os clientes veem a transação comprometida ao mesmo tempo, ou seja, após ela ter sido reconhecida pela replica e comprometida no motor de armazenamento na fonte. Assim, todos os clientes veem os mesmos dados na fonte.

  Em caso de falha na fonte, todas as transações realizadas na fonte foram replicadas para a replica (salvadas em seu log de retransmissão). Uma saída inesperada da fonte e a transição para a replica são irreversíveis porque a replica está atualizada. Como mencionado acima, a fonte não deve ser reutilizada após a transição.

- Com `AFTER_COMMIT`, o cliente que emite a transação recebe o status de retorno apenas após o servidor confirmar o armazenamento no mecanismo de armazenamento e receber o reconhecimento da replica. Após o commit e antes do reconhecimento da replica, outros clientes podem ver a transação confirmada antes do cliente que a confirmou.

  Se algo der errado de modo que a réplica não processe a transação, então, em caso de uma saída inesperada da fonte e failover para a réplica, é possível que esses clientes percam dados em relação ao que viram na fonte.
