### 16.4.4 Solução de problemas de replicação

Se você seguiu as instruções, mas a configuração de replicação não está funcionando, a primeira coisa a fazer é *verificar o log de erros em busca de mensagens*. Muitos usuários perderam tempo ao não fazer isso logo após encontrar problemas.

Se você não conseguir identificar o problema no log de erros, experimente as seguintes técnicas:

- Verifique se o log binário está habilitado na fonte executando a instrução `SHOW MASTER STATUS`. Se o log estiver habilitado, a posição será diferente de zero. Se o log binário não estiver habilitado, verifique se o servidor fonte está sendo executado com a opção `--log-bin`.

- Verifique se a variável de sistema `server_id` foi definida durante a inicialização tanto no servidor de origem quanto na replica, e que o valor do ID é único em cada servidor.

- Verifique se a replica está em execução. Use `SHOW SLAVE STATUS` para verificar se os valores `Slave_IO_Running` e `Slave_SQL_Running` estão ambos em `Yes`. Se não estiverem, verifique as opções usadas ao iniciar o servidor de replica. Por exemplo, `--skip-slave-start` impede que os threads da replica sejam iniciados até que você emita uma declaração `START SLAVE`.

- Se a replica estiver em execução, verifique se ela estabeleceu uma conexão com a fonte. Use `SHOW PROCESSLIST`, encontre os threads de I/O e SQL e verifique sua coluna `State` para ver o que eles exibem. Veja Seção 16.2.3, “Threads de Replicação”. Se o estado do thread de I/O de replicação disser `Conectando ao mestre`, verifique o seguinte:

  - Verifique os privilégios do usuário que está sendo usado para replicação na fonte.

  - Verifique se o nome do host da fonte está correto e se você está usando a porta correta para se conectar à fonte. A porta usada para a replicação é a mesma usada para a comunicação da rede do cliente (o padrão é `3306`). Para o nome do host, certifique-se de que o nome resolva o endereço IP correto.

  - Verifique o arquivo de configuração para ver se a variável de sistema `skip_networking` foi habilitada na fonte ou na replica para desabilitar a rede. Se sim, comente a configuração ou remova-a.

  - Se a fonte tiver uma configuração de firewall ou filtragem de IP, certifique-se de que a porta de rede usada para o MySQL não esteja sendo filtrada.

  - Verifique se você consegue acessar a fonte usando `ping` ou `traceroute`/`tracert` para alcançar o host.

- Se a réplica estava em execução anteriormente, mas parou, a razão geralmente é que alguma instrução que teve sucesso na fonte falhou na réplica. Isso nunca deve acontecer se você tiver feito um snapshot adequado da fonte e nunca tiver modificado os dados na réplica fora dos threads de replicação. Se a réplica parar inesperadamente, é um bug ou você encontrou um dos problemas de replicação conhecidos descritos em Seção 16.4.1, “Recursos e Problemas de Replicação”. Se for um bug, consulte Seção 16.4.5, “Como Relatar Bugs ou Problemas de Replicação” para obter instruções sobre como relatar.

- Se uma declaração que funcionou na fonte se recusar a funcionar na réplica, tente o procedimento a seguir se não for viável realizar uma ressonancização completa do banco de dados, excluindo os bancos de dados da réplica e copiando um novo instantâneo da fonte:

  1. Determine se a tabela afetada na replica é diferente da tabela na fonte. Tente entender como isso aconteceu. Em seguida, faça a tabela da replica ser idêntica à da fonte e execute `START SLAVE`.

  2. Se a etapa anterior não funcionar ou não se aplicar, tente entender se seria seguro fazer a atualização manualmente (se necessário) e, em seguida, ignore a próxima declaração da fonte.

  3. Se você decidir que a réplica pode pular a próxima declaração da fonte, emita as seguintes declarações:

     ```sql
     mysql> SET GLOBAL sql_slave_skip_counter = N;
     mysql> START SLAVE;
     ```

     O valor de *`N`* deve ser 1 se a próxima declaração da fonte não usar `AUTO_INCREMENT` ou `LAST_INSERT_ID()`. Caso contrário, o valor deve ser 2. A razão para usar um valor de 2 para declarações que usam `AUTO_INCREMENT` ou `LAST_INSERT_ID()` é que elas registram dois eventos no log binário da fonte.

     Veja também Seção 13.4.2.4, “Sintaxe de SET GLOBAL sql_slave_skip_counter”.

  4. Se você tem certeza de que a réplica começou perfeitamente sincronizada com a fonte e que ninguém atualizou as tabelas envolvidas fora dos threads de replicação, então, presumivelmente, a discrepância é o resultado de um bug. Se você estiver executando a versão mais recente do MySQL, por favor, informe o problema. Se você estiver executando uma versão mais antiga, tente atualizar para a versão mais recente de produção para determinar se o problema persiste.
