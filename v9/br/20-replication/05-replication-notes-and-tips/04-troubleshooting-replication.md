### 19.5.4 Solução de Problemas de Replicação

Se você seguiu as instruções, mas a configuração de replicação não está funcionando, a primeira coisa a fazer é *verificar o log de erros em busca de mensagens*. Muitos usuários perderam tempo ao não fazer isso logo após encontrar problemas.

Se você não conseguir determinar do log de erros qual foi o problema, tente as seguintes técnicas:

* Verifique se o log binário está habilitado na fonte executando a instrução `SHOW BINARY LOG STATUS`. O log binário está habilitado por padrão. Se o log binário estiver habilitado, o valor `Position` não é nulo. Se o log binário não estiver habilitado, verifique se você não está executando a fonte com configurações que desabilitam o log binário, como a opção `--skip-log-bin`.

* Verifique se a variável de sistema `server_id` foi definida na inicialização tanto na fonte quanto na replica e que o valor do ID é único em cada servidor.

* Verifique se a replica está em execução. Use `SHOW REPLICA STATUS` para verificar se os valores `Replica_IO_Running` e `Replica_SQL_Running` estão ambos em `Yes`. Se não estiverem, verifique as opções usadas ao iniciar o servidor de replicação. Por exemplo, `--skip-replica-start` impede que os threads de replicação sejam iniciados até que você emita a instrução `START REPLICA`.

* Se a replica estiver em execução, verifique se ela estabeleceu uma conexão com a fonte. Use `SHOW PROCESSLIST`, encontre os threads de I/O (receptor) e SQL (aplicador) e verifique sua coluna `State` para ver o que eles exibem. Veja a Seção 19.2.3, “Threads de Replicação”. Se o estado do thread do receptor disser `Connecting to master`, verifique o seguinte:

  + Verifique os privilégios do usuário de replicação na fonte.

+ Verifique se o nome do host da fonte está correto e se você está usando a porta correta para se conectar à fonte. A porta usada para a replicação é a mesma usada para a comunicação da rede do cliente (o padrão é `3306`). Para o nome do host, certifique-se de que o nome resolva o endereço IP correto.

  + Verifique o arquivo de configuração para ver se a variável de sistema `skip_networking` foi habilitada na fonte ou na replica para desabilitar a rede. Se sim, comente a configuração ou remova-a.

  + Se a fonte tiver uma configuração de firewall ou filtragem de IP, certifique-se de que a porta de rede usada para o MySQL não está sendo filtrada.

  + Verifique se você pode acessar a fonte usando `ping` ou `traceroute`/`tracert` para alcançar o host.

* Se a replica estava em execução anteriormente, mas parou, a razão geralmente é que alguma instrução que teve sucesso na fonte falhou na replica. Isso nunca deve acontecer se você tiver feito um snapshot adequado da fonte e nunca tiver modificado os dados na replica fora dos threads de replicação. Se a replica parar inesperadamente, é um bug ou você encontrou um dos problemas de replicação conhecidos descritos na Seção 19.5.1, “Recursos e Problemas de Replicação”. Se for um bug, consulte a Seção 19.5.5, “Como Relatar Bugs ou Problemas de Replicação”, para instruções sobre como relatar.

* Se uma instrução que teve sucesso na fonte se recusa a ser executada na replica, tente o seguinte procedimento se não for viável fazer uma resincronização completa do banco de dados excluindo os bancos de dados da replica e copiando um novo snapshot da fonte:

  1. Determine se a tabela afetada na replica é diferente da tabela da fonte. Tente entender como isso aconteceu. Em seguida, torne a tabela da replica idêntica à da fonte e execute `START REPLICA`.

2. Se a etapa anterior não funcionar ou não se aplicar, tente entender se seria seguro fazer a atualização manualmente (se necessário) e, em seguida, ignore a próxima declaração da fonte.

3. Se você decidir que a replica pode pular a próxima declaração da fonte, emita as seguintes declarações:

```
     mysql> SET GLOBAL sql_replica_skip_counter = N;
     mysql> START REPLICA;
     ```

O valor de *`N`* deve ser 1 se a próxima declaração da fonte não usar `AUTO_INCREMENT` ou `LAST_INSERT_ID()`. Caso contrário, o valor deve ser 2. A razão para usar um valor de 2 para declarações que usam `AUTO_INCREMENT` ou `LAST_INSERT_ID()` é que elas levam dois eventos no log binário da fonte.

4. Se você tiver certeza de que a replica começou perfeitamente sincronizada com a fonte e que ninguém atualizou as tabelas envolvidas fora dos threads de replicação, então, presumivelmente, a discrepância é o resultado de um bug. Se você estiver executando a versão mais recente do MySQL, por favor, informe o problema. Se você estiver executando uma versão mais antiga, tente atualizar para a versão mais recente de produção para determinar se o problema persiste.