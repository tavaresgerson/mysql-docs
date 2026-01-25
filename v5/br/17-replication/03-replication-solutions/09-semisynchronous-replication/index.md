### 16.3.9 Replicação Semissíncrona

[16.3.9.1 Interface Administrativa de Replicação Semissíncrona](replication-semisync-interface.html)

[16.3.9.2 Instalação e Configuração de Replicação Semissíncrona](replication-semisync-installation.html)

[16.3.9.3 Monitoramento de Replicação Semissíncrona](replication-semisync-monitoring.html)

Além da replicação assíncrona integrada, o MySQL 5.7 suporta uma interface para replicação semissíncrona que é implementada por *plugins*. Esta seção discute o que é a replicação semissíncrona e como ela funciona. As seções seguintes cobrem a interface administrativa para replicação semissíncrona e como instalá-la, configurá-la e monitorá-la.

Por padrão, a replicação MySQL é assíncrona. O *source* (origem) escreve eventos em seu *Binary Log* e as *replicas* os solicitam quando estão prontas. O *source* não sabe se ou quando uma *replica* recuperou e processou as *transactions*, e não há garantia de que qualquer evento chegue a qualquer *replica*. Com a replicação assíncrona, se o *source* falhar (*crashes*), as *transactions* que ele *commitou* podem não ter sido transmitidas a nenhuma *replica*. O *Failover* do *source* para a *replica* neste caso pode resultar em *failover* para um servidor que está com *transactions* faltando em relação ao *source*.

Com a replicação totalmente síncrona, quando um *source* *commita* uma *transaction*, todas as *replicas* também devem ter *commitado* a *transaction* antes que o *source* retorne à sessão que executou a *transaction*. A replicação totalmente síncrona significa que o *failover* do *source* para qualquer *replica* é possível a qualquer momento. A desvantagem da replicação totalmente síncrona é que pode haver muita demora para concluir uma *transaction*.

A replicação semissíncrona se situa entre a replicação assíncrona e a totalmente síncrona. O *source* espera até que pelo menos uma *replica* tenha recebido e registrado os eventos (*logged the events*) (o número necessário de *replicas* é configurável) e, em seguida, *commita* a *transaction*. O *source* não espera que todas as *replicas* confirmem o recebimento, e exige apenas uma confirmação das *replicas*, e não que os eventos tenham sido totalmente executados e *commitados* no lado da *replica*. A replicação semissíncrona, portanto, garante que, se o *source* falhar (*crashes*), todas as *transactions* que ele *commitou* tenham sido transmitidas para pelo menos uma *replica*.

Em comparação com a replicação assíncrona, a replicação semissíncrona oferece melhor integridade de dados, pois quando um *commit* retorna com sucesso, sabe-se que os dados existem em pelo menos dois locais. Até que um *source* semissíncrono receba a confirmação do número necessário de *replicas*, a *transaction* fica em espera e não é *commitada*.

Em comparação com a replicação totalmente síncrona, a replicação semissíncrona é mais rápida, pois pode ser configurada para equilibrar seus requisitos de integridade de dados (o número de *replicas* que confirmam o recebimento da *transaction*) com a velocidade dos *commits*, que são mais lentos devido à necessidade de esperar pelas *replicas*.

**Importante**

Com a replicação semissíncrona, se o *source* falhar e um *failover* para uma *replica* for executado, o *source* que falhou não deve ser reutilizado como o servidor *source* de replicação e deve ser descartado. Ele pode ter *transactions* que não foram confirmadas por nenhuma *replica*, as quais, portanto, não foram *commitadas* antes do *failover*.

Se seu objetivo é implementar uma topologia de replicação tolerante a falhas onde todos os servidores recebem as mesmas *transactions* na mesma ordem, e um servidor que falha pode retornar ao grupo e ser atualizado automaticamente, você pode usar o *Group Replication* para conseguir isso. Para informações, consulte [Capítulo 17, *Group Replication*](group-replication.html "Chapter 17 Group Replication").

O impacto de desempenho da replicação semissíncrona em comparação com a replicação assíncrona é a compensação por maior integridade de dados. A quantidade de desaceleração é de pelo menos o tempo de ida e volta do *TCP/IP* para enviar o *commit* para a *replica* e esperar a confirmação de recebimento pela *replica*. Isso significa que a replicação semissíncrona funciona melhor para servidores próximos que se comunicam por redes rápidas e pior para servidores distantes que se comunicam por redes lentas. A replicação semissíncrona também impõe um limite de taxa em sessões ocupadas, restringindo a velocidade na qual os eventos do *Binary Log* podem ser enviados do *source* para a *replica*. Quando um usuário está muito ocupado, isso o retarda, o que pode ser útil em algumas situações de implantação.

A replicação semissíncrona entre um *source* e suas *replicas* opera da seguinte forma:

*   Uma *replica* indica se é capaz de replicação semissíncrona quando se conecta ao *source*.

*   Se a replicação semissíncrona estiver habilitada no lado do *source* e houver pelo menos uma *replica* semissíncrona, um *thread* que executa um *commit* de *transaction* no *source* bloqueia e espera até que pelo menos uma *replica* semissíncrona confirme que recebeu todos os eventos para a *transaction*, ou até que ocorra um *timeout*.

*   A *replica* confirma o recebimento dos eventos de uma *transaction* somente após os eventos terem sido escritos em seu *Relay Log* e descarregados (*flushed*) para o *disk*.

*   Se ocorrer um *timeout* sem que nenhuma *replica* tenha confirmado a *transaction*, o *source* reverte para replicação assíncrona. Quando pelo menos uma *replica* semissíncrona se atualiza, o *source* retorna à replicação semissíncrona.

*   A replicação semissíncrona deve estar habilitada tanto no lado do *source* quanto no lado da *replica*. Se a replicação semissíncrona estiver desabilitada no *source*, ou habilitada no *source* mas em nenhuma *replica*, o *source* usa replicação assíncrona.

Enquanto o *source* está bloqueando (esperando pela confirmação de uma *replica*), ele não retorna à *session* que executou a *transaction*. Quando o bloqueio termina, o *source* retorna à *session*, que pode então prosseguir para executar outras instruções. Neste ponto, a *transaction* foi *commitada* no lado do *source*, e o recebimento de seus eventos foi confirmado por pelo menos uma *replica*. O número de confirmações de *replica* que o *source* deve receber por *transaction* antes de retornar à *session* é configurável usando a *system variable* [`rpl_semi_sync_master_wait_for_slave_count`](replication-options-source.html#sysvar_rpl_semi_sync_master_wait_for_slave_count), cujo valor padrão é 1.

O bloqueio também ocorre após *rollbacks* que são escritos no *Binary Log*, o que ocorre quando uma *transaction* que modifica tabelas não transacionais é revertida (*rolled back*). A *transaction* revertida é registrada mesmo que não tenha efeito para tabelas transacionais, porque as modificações nas tabelas não transacionais não podem ser revertidas e devem ser enviadas às *replicas*.

Para instruções que não ocorrem em contexto transacional (ou seja, quando nenhuma *transaction* foi iniciada com [`START TRANSACTION`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") ou [`SET autocommit = 0`](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment")), o *autocommit* está habilitado e cada instrução *commita* implicitamente. Com a replicação semissíncrona, o *source* bloqueia para cada instrução, assim como faz para *commits* explícitos de *transaction*.

A *system variable* [`rpl_semi_sync_master_wait_point`](replication-options-source.html#sysvar_rpl_semi_sync_master_wait_point) controla o ponto em que um *source* de replicação semissíncrona espera pela confirmação de recebimento da *transaction* pela *replica* antes de retornar um status ao *client* que *commitou* a *transaction*. Estes valores são permitidos:

*   `AFTER_SYNC` (o padrão): O *source* escreve cada *transaction* em seu *Binary Log* e na *replica*, e sincroniza (*syncs*) o *Binary Log* para o *disk*. O *source* espera pela confirmação de recebimento da *transaction* pela *replica* após a sincronização. Ao receber a confirmação, o *source* *commita* a *transaction* no *Storage Engine* e retorna um resultado ao *client*, que pode então prosseguir.

*   `AFTER_COMMIT`: O *source* escreve cada *transaction* em seu *Binary Log* e na *replica*, sincroniza o *Binary Log* e *commita* a *transaction* no *Storage Engine*. O *source* espera pela confirmação de recebimento da *transaction* pela *replica* após o *commit*. Ao receber a confirmação, o *source* retorna um resultado ao *client*, que pode então prosseguir.

As características de replicação dessas configurações diferem da seguinte forma:

*   Com `AFTER_SYNC`, todos os *clients* veem a *transaction* *commitada* ao mesmo tempo, que é depois que ela foi confirmada pela *replica* e *commitada* no *Storage Engine* no *source*. Assim, todos os *clients* veem os mesmos dados no *source*.

    No caso de falha do *source*, todas as *transactions* *commitadas* no *source* foram replicadas para a *replica* (salvas em seu *Relay Log*). Uma saída inesperada do *source* e o *failover* para a *replica* são sem perda (*lossless*) porque a *replica* está atualizada. Conforme observado acima, o *source* não deve ser reutilizado após o *failover*.

*   Com `AFTER_COMMIT`, o *client* que emite a *transaction* obtém um status de retorno somente após o servidor fazer o *commit* no *Storage Engine* e receber a confirmação da *replica*. Após o *commit* e antes da confirmação da *replica*, outros *clients* podem ver a *transaction* *commitada* antes do *client* que a *commitou*.

    Se algo der errado de forma que a *replica* não processe a *transaction*, no caso de uma saída inesperada do *source* e *failover* para a *replica*, é possível que tais *clients* vejam uma perda de dados em relação ao que viram no *source*.