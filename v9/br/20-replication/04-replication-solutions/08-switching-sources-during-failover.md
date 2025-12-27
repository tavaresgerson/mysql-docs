### 19.4.8 Mudança de Fonte Durante o Failover

Você pode instruir uma replica a mudar para uma nova fonte usando a instrução `CHANGE REPLICATION SOURCE TO`. A replica não verifica se os bancos de dados na fonte são compatíveis com os da replica; ela simplesmente começa a ler e executar eventos a partir das coordenadas especificadas no log binário da nova fonte. Em uma situação de failover, todos os servidores do grupo normalmente estão executando os mesmos eventos do mesmo arquivo de log binário, então mudar a fonte dos eventos não deve afetar a estrutura ou integridade do banco de dados, desde que você exerça cuidado ao fazer a mudança.

As réplicas devem ser executadas com o registro binário habilitado (a opção `--log-bin`), que é o padrão. Se você não estiver usando GTIDs para a replicação, então as réplicas também devem ser executadas com `--log-replica-updates=OFF` (o registro de atualizações da replica é o padrão). Dessa forma, a replica está pronta para se tornar uma fonte sem reiniciar o **mysqld** da replica. Suponha que você tenha a estrutura mostrada na Figura 19.4, “Redundância Usando Replicação, Estrutura Inicial”.

**Figura 19.4 Redundância Usando Replicação, Estrutura Inicial**

![Dois clientes web direcionam tanto as leituras quanto as escritas de bancos de dados para um único servidor de fonte MySQL. O servidor de fonte MySQL replica para a Replica 1, Replica 2 e Replica 3.](images/redundancy-before.png)

Neste diagrama, o `Source` contém o banco de dados de origem, os hosts `Replica*` são réplicas e as máquinas `Web Client` estão emitindo leituras e escritas no banco de dados. Os clientes web que emitem apenas leituras (e normalmente estariam conectados às réplicas) não são mostrados, pois não precisam alternar para um novo servidor em caso de falha. Para um exemplo mais detalhado de uma estrutura de replicação de escala de leitura/escrita, consulte a Seção 19.4.5, “Usando a Replicação para Escala de Saída”.

Cada replica MySQL (`Replica 1`, `Replica 2` e `Replica 3`) é uma replica que está rodando com o registro binário habilitado e com `--log-replica-updates=OFF`. Como as atualizações recebidas por uma replica da origem não são escritas no log binário quando `--log-replica-updates=OFF` é especificado, o log binário em cada replica está inicialmente vazio. Se, por algum motivo, o `Source` ficar indisponível, você pode escolher uma das réplicas para se tornar a nova origem. Por exemplo, se você escolher `Replica 1`, todos os `Web Clients` devem ser redirecionados para `Replica 1`, que escreve as atualizações em seu log binário. `Replica 2` e `Replica 3` devem então replicar a partir de `Replica 1`.

A razão para rodar a replica com `--log-replica-updates=OFF` é evitar que as réplicas recebam atualizações duas vezes, caso você cause uma das réplicas a se tornar a nova origem. Se `Replica 1` tiver `--log-replica-updates` habilitado, que é o padrão, ela escreve quaisquer atualizações que recebe da `Source` em seu próprio log binário. Isso significa que, quando `Replica 2` muda da `Source` para `Replica 1` como sua origem, ela pode receber atualizações da `Replica 1` que já recebeu da `Source`.

Certifique-se de que todas as réplicas processaram as declarações em seu log de retransmissão. Em cada réplica, execute `STOP REPLICA IO_THREAD`, depois verifique a saída de `SHOW PROCESSLIST` até ver `Lêu todo o log de retransmissão`. Quando isso for verdadeiro para todas as réplicas, elas podem ser reconfiguradas para a nova configuração. Na réplica `Replica 1` que é promovida para se tornar a fonte, execute `STOP REPLICA` e `RESET BINARY LOGS AND GTIDS`.

Nas outras réplicas `Replica 2` e `Replica 3`, use `STOP REPLICA` e `CHANGE REPLICATION SOURCE TO SOURCE_HOST='Replica1'` (onde `'Replica1'` representa o nome real do host da `Replica 1`). Para usar `CHANGE REPLICATION SOURCE TO`, adicione todas as informações sobre como se conectar à `Replica 1` a partir de `Replica 2` ou `Replica 3` (*`user`*, *`password`*, *`port`*). Ao emitir a declaração neste cenário, não é necessário especificar o nome do arquivo de log binário da `Replica 1` ou a posição do log a ser lida, uma vez que o primeiro arquivo de log binário e a posição 4 são os padrões. Finalmente, execute `START REPLICA` na `Replica 2` e `Replica 3`.

Uma vez que a nova configuração de replicação esteja em vigor, você precisa dizer a cada `Web Client` para direcionar suas declarações para a `Replica 1`. A partir desse ponto, todas as atualizações enviadas pelo `Web Client` para a `Replica 1` são escritas no log binário da `Replica 1`, que então contém todas as atualizações enviadas para a `Replica 1` desde que a `Source` se tornou indisponível.

A estrutura do servidor resultante é mostrada na Figura 19.5, “Redundância Usando Replicação, Após Falha na Fonte”.

**Figura 19.5 Redundância Usando Replicação, Após Falha na Fonte**

![O servidor de origem do MySQL falhou e não está mais conectado à topologia de replicação. Os dois clientes da web agora direcionam as leituras e as escritas no banco de dados para a Replica 1, que é a nova origem. A Replica 1 replica para a Replica 2 e a Replica 3.](images/redundância-after.png)

Quando o `Source` estiver disponível novamente, você deve torná-lo uma replica da `Replica 1`. Para fazer isso, emita no `Source` a mesma declaração `CHANGE REPLICATION SOURCE TO` que foi emitida anteriormente na `Replica 2` e `Replica 3`. O `Source` então se torna uma replica da `Replica 1` e assume as escritas do `Web Client` que ele perdeu enquanto estava offline.

Para tornar o `Source` uma origem novamente, use o procedimento anterior como se a `Replica 1` estivesse indisponível e o `Source` estivesse para ser a nova origem. Durante esse procedimento, não se esqueça de executar `RESET BINARY LOGS AND GTIDS` no `Source` antes de fazer as `Replica 1`, `Replica 2` e `Replica 3` serem replicas do `Source`. Se você não fizer isso, as réplicas podem pegar escritas desatualizadas das aplicações do `Web Client` que datam de antes do ponto em que o `Source` ficou indisponível.

Você deve estar ciente de que não há sincronização entre as réplicas, mesmo quando elas compartilham a mesma origem, e, portanto, algumas réplicas podem estar consideravelmente à frente de outras. Isso significa que, em alguns casos, o procedimento descrito no exemplo anterior pode não funcionar como esperado. Na prática, no entanto, os logs de relevo em todas as réplicas devem estar relativamente próximos uns dos outros.

Uma maneira de manter as aplicações informadas sobre a localização da origem é ter uma entrada dinâmica de DNS para o host da origem. Com o `BIND`, você pode usar o **nsupdate** para atualizar o DNS dinamicamente.