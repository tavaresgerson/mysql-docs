### 16.3.7 Alteração de fontes durante o failover

Você pode instruir uma replica a mudar para uma nova fonte usando a instrução `CHANGE MASTER TO`. A replica não verifica se os bancos de dados na fonte são compatíveis com os da replica; ela simplesmente começa a ler e executar eventos a partir das coordenadas especificadas no log binário da nova fonte. Em uma situação de failover, todos os servidores do grupo normalmente estão executando os mesmos eventos a partir do mesmo arquivo de log binário, então mudar a fonte dos eventos não deve afetar a estrutura ou integridade do banco de dados, desde que você tome cuidado ao fazer a mudança.

As réplicas devem ser executadas com o registro binário habilitado (a opção `--log-bin`), que é a opção padrão. Se você não estiver usando GTIDs para a replicação, então as réplicas também devem ser executadas com `--log-slave-updates=OFF` (o registro das atualizações da replica é a opção padrão). Dessa forma, a replica está pronta para se tornar uma fonte sem precisar reiniciar a replica **mysqld**. Suponha que você tenha a estrutura mostrada na Figura 16.4, “Redundância Usando Replicação, Estrutura Inicial”.

**Figura 16.4 Redundância usando replicação, estrutura inicial**

![Dois clientes web direcionam as leituras e escritas no banco de dados para um único servidor de origem MySQL. O servidor de origem MySQL é replicado para Replica 1, Replica 2 e Replica 3.](images/redundancy-before.png)

Neste diagrama, o `Source` contém o banco de dados de origem, os hosts `Replica*` são réplicas e as máquinas `Web Client` estão realizando leituras e escritas no banco de dados. Os clientes web que realizam apenas leituras (e normalmente estariam conectados às réplicas) não são mostrados, pois não precisam alternar para um novo servidor em caso de falha. Para um exemplo mais detalhado de uma estrutura de replicação de escala de leitura/escrita, consulte Seção 16.3.4, “Usando a Replicação para Escala de Leitura/Escrita”.

Cada replica do MySQL (`Replica 1`, `Replica 2` e `Replica 3`) é uma replica que está rodando com o registro binário habilitado e com `--log-slave-updates=OFF`. Como as atualizações recebidas por uma replica da fonte não são escritas no log binário quando o `--log-slave-updates=OFF` é especificado, o log binário em cada replica está inicialmente vazio. Se, por algum motivo, o `Source` ficar indisponível, você pode escolher uma das réplicas para se tornar a nova fonte. Por exemplo, se você escolher `Replica 1`, todos os `Clientes da Web` devem ser redirecionados para `Replica 1`, que escreve as atualizações em seu log binário. `Replica 2` e `Replica 3` devem então replicar a partir de `Replica 1`.

A razão para executar a replica com `--log-slave-updates=OFF` é evitar que as réplicas recebam atualizações duas vezes, caso você faça uma das réplicas se tornar a nova fonte. Se a `Replica 1` tiver o `--log-slave-updates` habilitado, que é o padrão, ela escreve quaisquer atualizações que recebe do `Source` em seu próprio log binário. Isso significa que, quando a `Replica 2` muda do `Source` para a `Replica 1` como sua fonte, ela pode receber atualizações da `Replica 1` que já recebeu do `Source`.

Certifique-se de que todas as réplicas processaram todas as declarações em seu log de retransmissão. Em cada réplica, execute `STOP SLAVE IO_THREAD`, depois verifique a saída de `SHOW PROCESSLIST` até ver `Has read all relay log`. Quando isso for verdadeiro para todas as réplicas, elas podem ser recarregadas para a nova configuração. Na réplica `Replica 1` que está sendo promovida para se tornar a fonte, execute `STOP SLAVE` e `RESET MASTER` (`stop-slave.html` e `reset-master.html`, respectivamente).

Nas outras réplicas `Replica 2` e `Replica 3`, use `STOP SLAVE` e `CHANGE MASTER TO MASTER_HOST='Replica1'` (onde `'Replica1'` representa o nome real do host da `Replica 1`). Para usar `CHANGE MASTER TO`, adicione todas as informações sobre como se conectar à `Replica 1` a partir da `Replica 2` ou `Replica 3` (*`user`*, *`password`*, *`port`*). Ao emitir a declaração neste cenário, não é necessário especificar o nome do arquivo de log binário da `Replica 1` ou a posição de log a ser lida, uma vez que o primeiro arquivo de log binário e a posição 4 são os padrões. Por fim, execute `START SLAVE` nas `Replica 2` e `Replica 3`.

Depois que a nova configuração de replicação estiver em vigor, você precisa dizer a cada `Web Client` para direcionar suas declarações para `Replica 1`. A partir desse momento, todas as atualizações enviadas pelo `Web Client` para `Replica 1` serão escritas no log binário de `Replica 1`, que então contém todas as atualizações enviadas para `Replica 1` desde que `Source` deixou de estar disponível.

A estrutura do servidor resultante é mostrada na Figura 16.5, “Redundância usando replicação após falha na fonte”.

**Figura 16.5 Redundância usando replicação após falha na fonte**

![O servidor de origem do MySQL falhou e não está mais conectado à topologia de replicação. Os dois clientes da web agora direcionam as leituras e as escritas no banco de dados para a Replica 1, que é a nova origem. A Replica 1 replica para a Replica 2 e a Replica 3.](images/redundância-after.png)

Quando o `Source` estiver disponível novamente, você deve torná-lo uma réplica do `Replica 1`. Para fazer isso, execute no `Source` a mesma declaração `CHANGE MASTER TO` que foi emitida no `Replica 2` e `Replica 3` anteriormente. O `Source` então se torna uma réplica do `Replica 1` e recupera as escritas do `Web Client` que ele perdeu enquanto estava offline.

Para tornar `Source` novamente uma fonte, use o procedimento anterior como se `Replica 1` estivesse indisponível e `Source` fosse a nova fonte. Durante esse procedimento, não se esqueça de executar `RESET MASTER` em `Source` antes de criar as réplicas de `Replica 1`, `Replica 2` e `Replica 3` de `Source`. Se você não fizer isso, as réplicas podem pegar escritas obsoletas das aplicações `Web Client` que datam de antes do ponto em que `Source` ficou indisponível.

Você deve estar ciente de que não há sincronização entre as réplicas, mesmo quando elas compartilham a mesma fonte, e, portanto, algumas réplicas podem estar significativamente à frente das outras. Isso significa que, em alguns casos, o procedimento descrito no exemplo anterior pode não funcionar conforme o esperado. Na prática, no entanto, os logs de retransmissão em todas as réplicas devem estar relativamente próximos uns dos outros.

Uma maneira de manter as aplicações informadas sobre a localização da fonte é ter uma entrada DNS dinâmica para o host da fonte. Com o **BIND**, você pode usar o **nsupdate** para atualizar o DNS dinamicamente.
