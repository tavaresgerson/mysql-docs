### 19.4.10 Replicação Semisincronizada

19.4.10.1 Instalando a Replicação Semisincronizada

19.4.10.2 Configurando a Replicação Semisincronizada

19.4.10.3 Monitorando a Replicação Semisincronizada

Além da replicação assíncrona integrada, o MySQL 9.5 suporta uma interface para replicação semisincronizada, implementada por plugins. Esta seção discute o que é a replicação semisincronizada e como ela funciona. As seções seguintes abordam a interface administrativa para a replicação semisincronizada e como instalá-la, configurá-la e monitorá-la.

A replicação do MySQL, por padrão, é assíncrona. A fonte escreve eventos em seu log binário e as réplicas solicitam-nos quando estão prontas. A fonte não sabe se ou quando uma réplica recuperou e processou as transações, e não há garantia de que algum evento chegue a qualquer réplica. Com a replicação assíncrona, se a fonte falhar, as transações que ela comprometeu podem não ter sido transmitidas a nenhuma réplica. No caso de uma falha de transição da fonte para a réplica, isso pode resultar em uma falha de transição para um servidor que está faltando transações em relação à fonte.

Com a replicação totalmente síncrona, quando uma fonte compromete uma transação, todas as réplicas também comprometem a transação antes de a fonte retornar à sessão que executou a transação. A replicação totalmente síncrona significa que a transição da fonte para qualquer réplica é possível a qualquer momento. A desvantagem da replicação totalmente síncrona é que pode haver um grande atraso para completar uma transação.

A replicação semiesincrona fica entre a replicação assíncrona e a replicação totalmente síncrona. A fonte aguarda até que pelo menos uma réplica tenha recebido e registrado os eventos (o número necessário de réplicas é configurável) e, então, confirma a transação. A fonte não aguarda que todas as réplicas confirmem a recepção, e ela exige apenas uma confirmação das réplicas, não que os eventos tenham sido totalmente executados e confirmados no lado da réplica. Portanto, a replicação semiesincrona garante que, se a fonte falhar, todas as transações que ela confirmou foram transmitidas para pelo menos uma réplica.

Em comparação com a replicação assíncrona, a replicação semiesincrona oferece uma integridade de dados melhorada, porque, quando um commit retorna com sucesso, sabe-se que os dados existem em pelo menos dois lugares. Até que uma fonte semiesincrona receba a confirmação do número necessário de réplicas, a transação está em espera e não é confirmada.

Em comparação com a replicação totalmente síncrona, a replicação semiesincrona é mais rápida, porque pode ser configurada para equilibrar seus requisitos de integridade de dados (o número de réplicas que confirmam a recepção da transação) com a velocidade dos commits, que são mais lentos devido à necessidade de esperar pelas réplicas.

Importante

Com a replicação semiesincrona, se a fonte falhar e um failover para uma réplica for realizado, a fonte falhou não deve ser reutilizada como fonte de replicação e deve ser descartada. Ela poderia ter transações que não foram confirmadas por nenhuma réplica, que, portanto, não foram confirmadas antes do failover.

Se o seu objetivo é implementar uma topologia de replicação tolerante a falhas onde todos os servidores recebem as mesmas transações na mesma ordem e um servidor que cai pode se reiniciar no grupo e ser atualizado automaticamente, você pode usar a Replicação em Grupo para alcançar isso. Para obter informações, consulte o Capítulo 20, *Replicação em Grupo*.

O impacto no desempenho da replicação semisoincrona em comparação com a replicação assíncrona é o compromisso com o aumento da integridade dos dados. A quantidade de desaceleração é pelo menos o tempo de ida e volta do TCP/IP para enviar o commit para a replica e esperar o reconhecimento da recepção pela replica. Isso significa que a replicação semisoincrona funciona melhor para servidores próximos que se comunicam em redes rápidas e pior para servidores distantes que se comunicam em redes lentas. A replicação semisoincrona também coloca um limite de taxa em sessões ocupadas ao restringir a velocidade com que eventos de log binário podem ser enviados da fonte para a replica. Quando um usuário está muito ocupado, isso o desacelera, o que pode ser útil em algumas situações de implantação.

A replicação semisoincrona entre uma fonte e suas réplicas opera da seguinte forma:

* A replica indica se é capaz de replicação semisoincrona quando se conecta à fonte.

* Se a replicação semisoincrona estiver habilitada no lado da fonte e houver pelo menos uma replica semisoincrona, um thread que realiza um commit de transação na fonte bloqueia e aguarda até que pelo menos uma replica semisoincrona reconheça que recebeu todos os eventos da transação, ou até que ocorra um tempo limite.

* A replica reconhece a recepção dos eventos de uma transação apenas após os eventos terem sido escritos em seu log de retransmissão e descarregados no disco.

* Se ocorrer um tempo de espera sem que nenhuma réplica tenha confirmado a transação, a fonte retorna à replicação assíncrona. Quando pelo menos uma réplica semissíncrona recupera o atraso, a fonte retorna à replicação semissíncrona.

* A replicação semissíncrona deve ser habilitada tanto no lado da fonte quanto no lado das réplicas. Se a replicação semissíncrona for desabilitada no lado da fonte ou habilitada no lado da fonte, mas em nenhuma réplica, a fonte usa a replicação assíncrona.

Enquanto a fonte está bloqueando (esperando pela confirmação de uma réplica), ela não retorna à sessão que realizou a transação. Quando o bloqueio termina, a fonte retorna à sessão, que então pode prosseguir para executar outras instruções. Neste ponto, a transação foi confirmada no lado da fonte e o recebimento de seus eventos foi confirmado por pelo menos uma réplica. O número de confirmações de réplicas que a fonte deve receber por transação antes de retornar à sessão é configurável e tem como padrão uma confirmação (veja a Seção 19.4.10.2, “Configurando a Replicação Semissíncrona”).

O bloqueio também ocorre após recuos que são escritos no log binário, o que ocorre quando uma transação que modifica tabelas não transacionais é recuada. A transação recuada é registrada, mesmo que não tenha efeito para tabelas transacionais, porque as modificações nas tabelas não transacionais não podem ser recuadas e devem ser enviadas para as réplicas.

Para instruções que não ocorrem em contexto transacional (ou seja, quando nenhuma transação foi iniciada com `START TRANSACTION` ou `SET autocommit = 0`), o autocommit é habilitado e cada instrução é confirmada implicitamente. Com a replicação semissíncrona, a fonte bloqueia para cada instrução desse tipo, assim como para os commits explícitos de transação.

Por padrão, a fonte aguarda a confirmação da replicação da recepção da transação após a sincronização do log binário no disco, mas antes de comprometer a transação no motor de armazenamento. Como alternativa, você pode configurar a fonte para que ela espere a confirmação da replica após comprometer a transação no motor de armazenamento, usando a variável de sistema `rpl_semi_sync_source_wait_point`. Esta configuração afeta as características de replicação e os dados que os clientes podem ver na fonte. Para mais informações, consulte a Seção 19.4.10.2, “Configurando a Replicação Semisincronizada”.

Você pode melhorar o desempenho da replicação semisincronizada habilitando as variáveis de sistema `replication_sender_observe_commit_only`, que limita os callbacks, e `replication_optimize_for_static_plugin_config`, que adiciona blocos compartilhados e evita aquisições de bloqueios desnecessárias. Essas configurações ajudam à medida que o número de réplicas aumenta, porque a concorrência por blocos pode desacelerar o desempenho. Os servidores de fontes de replicação semisincronizada também podem obter benefícios de desempenho ao habilitar essas variáveis de sistema, porque eles usam os mesmos mecanismos de bloqueio que as réplicas.