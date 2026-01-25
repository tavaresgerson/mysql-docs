#### 16.1.4.2 Habilitando GTID Transactions Online

Esta seção descreve como habilitar GTID transactions e, opcionalmente, o auto-positioning, em servers que já estão online e utilizando anonymous transactions. Este procedimento não exige que o server seja colocado offline e é adequado para uso em produção. No entanto, se você tiver a possibilidade de colocar os servers offline ao habilitar GTID transactions, o processo será mais fácil.

Antes de começar, garanta que os servers atendam às seguintes pré-condições:

* *Todos* os servers na sua topology devem usar MySQL 5.7.6 ou posterior. Você não pode habilitar GTID transactions online em nenhum server individual, a menos que *todos* os servers que fazem parte da topology estejam usando esta versão.

* Todos os servers devem ter [`gtid_mode`](replication-options-gtids.html#sysvar_gtid_mode) definido com o valor padrão `OFF`.

O procedimento a seguir pode ser pausado a qualquer momento e retomado posteriormente de onde parou, ou revertido, pulando para a etapa correspondente da [Seção 16.1.4.3, “Disabling GTID Transactions Online”](replication-mode-change-online-disable-gtids.html "16.1.4.3 Disabling GTID Transactions Online"), o procedimento online para desabilitar GTIDs. Isso torna o procedimento tolerante a falhas (fault-tolerant), pois quaisquer problemas não relacionados que possam surgir no meio do processo podem ser tratados como de costume, e então o procedimento pode ser continuado de onde foi interrompido.

Note

É crucial que você complete cada etapa antes de prosseguir para a próxima etapa.

Para habilitar GTID transactions:

1. Em cada server, execute:

   ```sql
   SET @@GLOBAL.ENFORCE_GTID_CONSISTENCY = WARN;
   ```

   Deixe o server rodar por um tempo com sua workload normal e monitore os logs. Se esta etapa causar quaisquer warnings no log, ajuste sua aplicação para que ela use apenas recursos compatíveis com GTID e não gere warnings.

   Important

   Este é o primeiro passo importante. Você deve garantir que nenhum warning esteja sendo gerado nos error logs antes de prosseguir para a próxima etapa.

2. Em cada server, execute:

   ```sql
   SET @@GLOBAL.ENFORCE_GTID_CONSISTENCY = ON;
   ```

3. Em cada server, execute:

   ```sql
   SET @@GLOBAL.GTID_MODE = OFF_PERMISSIVE;
   ```

   Não importa qual server execute esta statement primeiro, mas é importante que todos os servers completem esta etapa antes que qualquer server comece a próxima.

4. Em cada server, execute:

   ```sql
   SET @@GLOBAL.GTID_MODE = ON_PERMISSIVE;
   ```

   Não importa qual server execute esta statement primeiro.

5. Em cada server, aguarde até que a status variable `ONGOING_ANONYMOUS_TRANSACTION_COUNT` seja zero. Isso pode ser verificado usando:

   ```sql
   SHOW STATUS LIKE 'ONGOING_ANONYMOUS_TRANSACTION_COUNT';
   ```

   Note

   Em uma replica, é teoricamente possível que isso mostre zero e depois um valor diferente de zero novamente. Isso não é um problema; é suficiente que mostre zero uma vez.

6. Aguarde que todas as transactions geradas até a etapa 5 sejam replicadas para todos os servers. Você pode fazer isso sem interromper os updates: a única coisa importante é que todas as anonymous transactions sejam replicadas.

   Consulte a [Seção 16.1.4.4, “Verifying Replication of Anonymous Transactions”](replication-mode-change-online-verify-transactions.html "16.1.4.4 Verifying Replication of Anonymous Transactions") para um método de verificar se todas as anonymous transactions foram replicadas para todos os servers.

7. Se você usa binary logs para algo além de replication, por exemplo, point in time backup and restore, espere até não precisar mais dos binary logs antigos que contêm transactions sem GTIDs.

   Por exemplo, após a conclusão da etapa 6, você pode executar [`FLUSH LOGS`](flush.html#flush-logs) no server onde você está realizando backups. Em seguida, ou realize um backup explicitamente ou aguarde a próxima iteração de qualquer rotina de backup periódico que você possa ter configurado.

   Idealmente, espere que o server purgue todos os binary logs que existiam quando a etapa 6 foi concluída. Também espere que qualquer backup feito antes da etapa 6 expire.

   Important

   Este é o segundo ponto importante. É vital entender que binary logs contendo anonymous transactions, sem GTIDs, não podem ser usados após a próxima etapa. Após esta etapa, você deve ter certeza de que transactions sem GTIDs não existem em nenhuma parte da topology.

8. Em cada server, execute:

   ```sql
   SET @@GLOBAL.GTID_MODE = ON;
   ```

9. Em cada server, adicione `gtid_mode=ON` e `enforce_gtid_consistency=ON` ao `my.cnf`.

   Agora você tem a garantia de que todas as transactions possuem um GTID (exceto transactions geradas na etapa 5 ou anteriores, que já foram processadas). Para começar a usar o GTID protocol para que você possa posteriormente realizar o automatic fail-over, execute o seguinte em cada replica. Opcionalmente, se você usar multi-source replication, faça isso para cada channel e inclua a cláusula `FOR CHANNEL channel`:

   ```sql
   STOP SLAVE [FOR CHANNEL 'channel'];
   CHANGE MASTER TO MASTER_AUTO_POSITION = 1 [FOR CHANNEL 'channel'];
   START SLAVE [FOR CHANNEL 'channel'];
   ```
