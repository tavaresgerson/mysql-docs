### 19.4.10 Replicação semiesincronizada

19.4.10.1 Instalação da Replicação Semisincronizada

19.4.10.2 Configurando a Replicação Semisíncrona

19.4.10.3 Monitoramento da Replicação Semisincronizada

Além da replicação assíncrona integrada, o MySQL 8.0 suporta uma interface para replicação semi-síncrona, implementada por plugins. Esta seção discute o que é a replicação semi-síncrona e como ela funciona. As seções seguintes abordam a interface administrativa para replicação semi-síncrona e como instalá-la, configurá-la e monitorá-la.

A replicação do MySQL, por padrão, é assíncrona. A fonte escreve eventos em seu log binário e as réplicas solicitam-nos quando estão prontas. A fonte não sabe se uma réplica já recuperou e processou as transações ou quando, e não há garantia de que algum evento chegue a qualquer réplica. Com a replicação assíncrona, se a fonte falhar, as transações que ela tenha comprometido podem não ter sido transmitidas a nenhuma réplica. A falha do servidor fonte para a réplica, nesse caso, pode resultar em uma falha para um servidor que está faltando transações em relação à fonte.

Com a replicação totalmente síncrona, quando uma fonte executa uma transação, todas as réplicas também confirmaram a transação antes de a fonte retornar à sessão que executou a transação. A replicação totalmente síncrona significa que o failover da fonte para qualquer réplica é possível a qualquer momento. A desvantagem da replicação totalmente síncrona é que pode haver um grande atraso para concluir uma transação.

A replicação semiesincronizada fica entre a replicação assíncrona e a replicação totalmente sincronizada. A fonte aguarda até que pelo menos uma réplica tenha recebido e registrado os eventos (o número necessário de réplicas é configurável) e, então, confirma a transação. A fonte não espera que todas as réplicas confirmem a recepção e requer apenas uma confirmação das réplicas, não que os eventos tenham sido totalmente executados e confirmados no lado da réplica. Portanto, a replicação semiesincronizada garante que, se a fonte falhar, todas as transações que ela confirmou foram transmitidas para pelo menos uma réplica.

Em comparação com a replicação assíncrona, a replicação semiesincrônica oferece maior integridade dos dados, pois, quando um commit retorna com sucesso, sabe-se que os dados existem em pelo menos dois locais. Até que uma fonte semiesincrônica receba confirmação do número necessário de réplicas, a transação fica suspensa e não é confirmada.

Comparado à replicação totalmente síncrona, a replicação sem síncrona é mais rápida, pois pode ser configurada para equilibrar suas necessidades de integridade dos dados (o número de réplicas que confirmam a recepção da transação) com a velocidade dos commits, que são mais lentos devido à necessidade de esperar pelas réplicas.

Importante

Com a replicação semiesincronizada, se a fonte falhar e uma falha de replicação for realizada, a fonte falha não deve ser reutilizada como fonte de replicação e deve ser descartada. Ela pode ter transações que não foram reconhecidas por nenhuma replica, portanto, não foram comprometidas antes da falha de replicação.

Se o seu objetivo é implementar uma topologia de replicação tolerante a falhas, onde todos os servidores recebem as mesmas transações na mesma ordem, e um servidor que falha pode se reiniciar no grupo e ser atualizado automaticamente, você pode usar a Replicação por Grupo para alcançar isso. Para obter informações, consulte o Capítulo 20, *Replicação por Grupo*.

O impacto no desempenho da replicação semi-sincrona em comparação com a replicação assíncrona é o compromisso com o aumento da integridade dos dados. A quantidade de desaceleração é, no mínimo, o tempo de ida e volta do TCP/IP para enviar o commit para a réplica e esperar o reconhecimento da recepção pela réplica. Isso significa que a replicação semi-sincrona funciona melhor para servidores próximos que se comunicam em redes rápidas e pior para servidores distantes que se comunicam em redes lentas. A replicação semi-sincrona também coloca um limite de taxa em sessões ocupadas, restringindo a velocidade com que eventos de log binário podem ser enviados da fonte para a réplica. Quando um usuário está muito ocupado, isso o desacelera, o que pode ser útil em algumas situações de implantação.

A replicação semiesincronizada entre uma fonte e suas réplicas funciona da seguinte maneira:

- Uma réplica indica se é compatível com semi-sincronização quando se conecta à fonte.

- Se a replicação semissíncrona estiver habilitada no lado de origem e houver pelo menos uma replica semissíncrona, uma thread que realiza um commit de transação nos blocos de origem e aguarda até que pelo menos uma replica semissíncrona reconheça que recebeu todos os eventos da transação, ou até que ocorra um tempo limite.

- A réplica só reconhece a recepção dos eventos de uma transação após esses eventos terem sido escritos em seu log de retransmissão e descarregados no disco.

- Se ocorrer um tempo de espera sem que nenhuma réplica tenha confirmado a transação, a fonte retorna à replicação assíncrona. Quando pelo menos uma réplica semissíncrona recupera o atraso, a fonte retorna à replicação semissíncrona.

- A replicação semiesincronizada deve ser habilitada tanto no lado da fonte quanto no lado das réplicas. Se a replicação semiesincronizada estiver desabilitada na fonte ou habilitada na fonte, mas não nas réplicas, a fonte usará a replicação assíncrona.

Enquanto a fonte está bloqueando (esperando por confirmação de uma réplica), ela não retorna à sessão que realizou a transação. Quando o bloqueio termina, a fonte retorna à sessão, que então pode prosseguir para executar outras instruções. Neste ponto, a transação foi confirmada no lado da fonte, e o recebimento de seus eventos foi confirmado por pelo menos uma réplica. O número de confirmações de réplica que a fonte deve receber por transação antes de retornar à sessão é configurável e, por padrão, é de uma confirmação (veja a Seção 19.4.10.2, “Configurando a Replicação Semisincronizada”).

O bloqueio também ocorre após recuos que são escritos no log binário, o que acontece quando uma transação que modifica tabelas não transacionais é revertida. A transação revertida é registrada, mesmo que não tenha efeito para tabelas transacionais, porque as modificações nas tabelas não transacionais não podem ser revertidas e devem ser enviadas para réplicas.

Para declarações que não ocorrem em contexto de transação (ou seja, quando nenhuma transação foi iniciada com `START TRANSACTION` ou `SET autocommit = 0`), o autocommit está habilitado e cada declaração realiza um commit implicitamente. Com a replicação semi-sincrona, os blocos de origem para cada declaração são bloqueados, assim como acontece com os commits explícitos de transação.

Por padrão, a fonte aguarda o reconhecimento da replicação da recepção da transação após a sincronização do log binário no disco, mas antes de comprometer a transação no motor de armazenamento. Como alternativa, você pode configurar a fonte para que ela espere o reconhecimento da replicação após comprometer a transação no motor de armazenamento, usando a variável de sistema `rpl_semi_sync_source_wait_point` ou `rpl_semi_sync_master_wait_point`. Esta configuração afeta as características de replicação e os dados que os clientes podem ver na fonte. Para mais informações, consulte a Seção 19.4.10.2, “Configurando a Replicação Semisincronizada”.

A partir do MySQL 8.0.23, você pode melhorar o desempenho da replicação semi-sincronizada ao habilitar as variáveis de sistema `replication_sender_observe_commit_only`, que limita os callbacks, e `replication_optimize_for_static_plugin_config`, que adiciona bloqueios compartilhados e evita aquisições de bloqueios desnecessárias. Essas configurações ajudam à medida que o número de réplicas aumenta, pois a concorrência por bloqueios pode desacelerar o desempenho. Os servidores de origem da replicação semi-sincronizada também podem obter benefícios de desempenho ao habilitar essas variáveis de sistema, pois eles usam os mesmos mecanismos de bloqueio que as réplicas.
