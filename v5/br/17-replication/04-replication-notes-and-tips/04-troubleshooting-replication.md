### 16.4.4 Solução de Problemas de Replicação

Se você seguiu as instruções, mas sua configuração de *replication* não está funcionando, a primeira coisa a fazer é *verificar o error log em busca de mensagens*. Muitos usuários perderam tempo por não fazerem isso cedo o suficiente após encontrarem problemas.

Se você não conseguir determinar a causa do problema a partir do *error log*, tente as seguintes técnicas:

*   Verifique se a *source* tem o *binary logging* habilitado executando a instrução [`SHOW MASTER STATUS`](show-master-status.html "13.7.5.23 SHOW MASTER STATUS Statement"). Se o *logging* estiver habilitado, o `Position` será diferente de zero. Se o *binary logging* não estiver habilitado, verifique se você está executando o servidor *source* com a opção [`--log-bin`](replication-options-binary-log.html#option_mysqld_log-bin).

*   Verifique se a variável de sistema [`server_id`](replication-options.html#sysvar_server_id) foi definida na inicialização tanto na *source* quanto na *replica* e se o valor do ID é único em cada servidor.

*   Verifique se a *replica* está em execução. Use [`SHOW SLAVE STATUS`](show-slave-status.html "13.7.5.34 SHOW SLAVE STATUS Statement") para verificar se os valores `Slave_IO_Running` e `Slave_SQL_Running` são ambos `Yes`. Caso contrário, verifique as opções que foram usadas ao iniciar o servidor *replica*. Por exemplo, [`--skip-slave-start`](replication-options-replica.html#option_mysqld_skip-slave-start) impede que os *threads* da *replica* iniciem até que você execute uma instrução [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement").

*   Se a *replica* estiver em execução, verifique se ela estabeleceu uma conexão com a *source*. Use [`SHOW PROCESSLIST`](show-processlist.html "13.7.5.29 SHOW PROCESSLIST Statement"), encontre os *threads* de I/O e SQL e verifique a coluna `State` para ver o que eles exibem. Consulte [Seção 16.2.3, “Replication Threads”](replication-threads.html "16.2.3 Replication Threads"). Se o *State* do *Thread* de I/O de *Replication* indicar `Connecting to master`, verifique o seguinte:

    + Verifique os *privileges* para o usuário que está sendo usado para *replication* na *source*.

    + Verifique se o *host name* da *source* está correto e se você está usando a *port* correta para se conectar à *source*. A *port* usada para *replication* é a mesma usada para comunicação de rede do cliente (o padrão é `3306`). Para o *host name*, certifique-se de que o nome se resolva para o endereço IP correto.

    + Verifique o arquivo de configuração para ver se a variável de sistema [`skip_networking`](server-system-variables.html#sysvar_skip_networking) foi habilitada na *source* ou *replica* para desativar a rede (*networking*). Se sim, comente a configuração ou remova-a.

    + Se a *source* tiver uma configuração de *firewall* ou filtragem de IP, certifique-se de que a *network port* usada para o MySQL não esteja sendo filtrada.

    + Verifique se você consegue alcançar a *source* usando `ping` ou `traceroute`/`tracert` para acessar o *host*.

*   Se a *replica* estava sendo executada anteriormente, mas parou, a razão geralmente é que alguma instrução que teve sucesso na *source* falhou na *replica*. Isso nunca deveria acontecer se você tivesse tirado um *snapshot* adequado da *source* e nunca modificado os *data* na *replica* fora dos *replication threads*. Se a *replica* parar inesperadamente, é um *bug* ou você encontrou uma das limitações conhecidas de *replication* descritas em [Seção 16.4.1, “Replication Features and Issues”](replication-features.html "16.4.1 Replication Features and Issues"). Se for um *bug*, consulte [Seção 16.4.5, “How to Report Replication Bugs or Problems”](replication-bugs.html "16.4.5 How to Report Replication Bugs or Problems"), para obter instruções sobre como relatá-lo.

*   Se uma instrução que obteve sucesso na *source* se recusar a ser executada na *replica*, tente o seguinte procedimento, caso não seja viável fazer uma resincronização completa do *database* excluindo os *databases* da *replica* e copiando um novo *snapshot* da *source*:

    1. Determine se a *table* afetada na *replica* é diferente da *table* na *source*. Tente entender como isso aconteceu. Em seguida, torne a *table* da *replica* idêntica à da *source* e execute [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement").

    2. Se a etapa anterior não funcionar ou não se aplicar, tente entender se seria seguro fazer o *update* manualmente (se necessário) e depois ignorar a próxima instrução da *source*.

    3. Se você decidir que a *replica* pode pular a próxima instrução da *source*, execute as seguintes instruções:

       ```sql
     mysql> SET GLOBAL sql_slave_skip_counter = N;
     mysql> START SLAVE;
     ```

       O valor de *`N`* deve ser 1 se a próxima instrução da *source* não usar `AUTO_INCREMENT` ou [`LAST_INSERT_ID()`](information-functions.html#function_last-insert-id). Caso contrário, o valor deve ser 2. O motivo para usar um valor de 2 para instruções que usam `AUTO_INCREMENT` ou [`LAST_INSERT_ID()`](information-functions.html#function_last-insert-id) é que elas ocupam dois *events* no *binary log* da *source*.

       Consulte também [Seção 13.4.2.4, “SET GLOBAL sql_slave_skip_counter Syntax”](set-global-sql-slave-skip-counter.html "13.4.2.4 SET GLOBAL sql_slave_skip_counter Syntax").

    4. Se você tiver certeza de que a *replica* começou perfeitamente sincronizada com a *source*, e que ninguém atualizou as *tables* envolvidas fora dos *replication threads*, a discrepância é presumivelmente o resultado de um *bug*. Se você estiver executando a versão mais recente do MySQL, relate o problema. Se você estiver executando uma versão mais antiga, tente fazer o *upgrade* para a versão de produção mais recente para determinar se o problema persiste.