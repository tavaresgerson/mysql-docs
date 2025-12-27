#### 19.1.4.2 Habilitar Transações GTID Online

Esta seção descreve como habilitar transações GTID e, opcionalmente, o posicionamento automático em servidores que já estão online e estão usando transações anônimas. Esse procedimento não requer a remoção do servidor do modo online e é adequado para uso em produção. No entanto, se você tiver a possibilidade de remover os servidores do modo online ao habilitar transações GTID, o processo será mais fácil.

Você pode configurar canais de replicação para atribuir GTIDs a transações replicadas que ainda não possuem nenhum. Essa funcionalidade permite a replicação de um servidor de origem que não usa replicação baseada em GTID para uma replica que a usa. Se for possível habilitar GTIDs no servidor de origem da replicação, conforme descrito neste procedimento, use essa abordagem. Atribuir GTIDs é projetado para servidores de origem de replicação onde você não pode habilitar GTIDs. Para mais informações sobre essa opção, consulte a Seção 19.1.3.6, “Replicação de uma Fonte Sem GTIDs para uma Replicação com GTIDs”.

Antes de começar, certifique-se de que `gtid_mode` esteja em `OFF` em todos os servidores.

O procedimento a seguir pode ser interrompido a qualquer momento e posteriormente retomado no ponto onde estava, ou invertido pulando para a etapa correspondente da Seção 19.1.4.3, “Desabilitar Transações GTID Online”, o procedimento online para desabilitar GTIDs. Isso torna o procedimento tolerante a falhas, pois quaisquer problemas não relacionados que possam aparecer no meio do procedimento podem ser tratados normalmente, e o procedimento é então continuado no ponto onde foi interrompido.

Para habilitar transações GTID, você deve completar cada uma das seguintes etapas antes de continuar para a próxima.

1. Em cada servidor, execute a seguinte instrução:

   ```
   SET @@GLOBAL.enforce_gtid_consistency = WARN;
   ```

Deixe o servidor rodar por um tempo com a carga de trabalho normal e monitore os logs. Se essa etapa causar alguma advertência no log, ajuste sua aplicação para que ela use apenas recursos compatíveis com GTID e não gere nenhuma advertência.

2. Em cada servidor, execute a seguinte instrução:

   ```
   SET @@GLOBAL.enforce_gtid_consistency = ON;
   ```

3. Em cada servidor, execute a seguinte instrução:

   ```
   SET @@GLOBAL.gtid_mode = OFF_PERMISSIVE;
   ```

   A ordem em que os servidores executam essa instrução não faz diferença, mas todos os servidores devem fazê-lo antes de iniciar a próxima etapa.

4. Em cada servidor, execute a seguinte instrução:

   ```
   SET @@GLOBAL.gtid_mode = ON_PERMISSIVE;
   ```

   Como no passo anterior, não faz diferença qual servidor executa a instrução primeiro, desde que cada servidor a faça antes de prosseguir.

5. Em cada servidor, aguarde até que `Ongoing_anonymous_transaction_count` seja `0`. Você pode verificar seu valor usando uma instrução `SHOW STATUS`, assim:

   ```
   mysql> SHOW STATUS LIKE 'Ongoing%';
   +-------------------------------------+-------+
   | Variable_name                       | Value |
   +-------------------------------------+-------+
   | Ongoing_anonymous_transaction_count | 0     |
   +-------------------------------------+-------+
   1 row in set (0.00 sec)
   ```

   Em uma réplica, é teoricamente possível que isso seja `0` e depois um valor não nulo novamente. Isso não é um problema, desde que seja `0` pelo menos uma vez.

6. Aguarde até que todas as transações geradas até o passo anterior sejam replicadas para todos os servidores. Você pode fazer isso sem interromper as atualizações; o que importa é que todas as transações anônimas sejam replicadas antes de prosseguir.

   Veja a Seção 19.1.4.4, “Verificação da Replicação de Transações Anônimas” para um método de verificar se todas as transações anônimas foram replicadas para todos os servidores.

7. Se você usar logs binários para qualquer outra coisa além da replicação, como backup e restauração em ponto no tempo, aguarde até que você não precise mais dos antigos logs binários contendo transações sem GTIDs.

Por exemplo, após todas as transações terem sido replicadas, você pode executar `FLUSH LOGS` no servidor onde está fazendo backups. Em seguida, você pode tomar um backup explicitamente ou esperar pela próxima iteração de qualquer rotina de backup periódica que você tenha configurado.

Idealmente, você deve esperar que o servidor limpe todos os logs binários que existiam quando a etapa anterior foi concluída e que qualquer backup feito antes disso expire.

Lembre-se de que os logs binários que contêm transações anônimas (ou seja, transações sem GTIDs) não podem ser usados após a próxima etapa, após a qual você deve garantir que nenhuma transação sem GTIDs permaneça não comprometida em nenhum servidor.

8. Em cada servidor, execute esta declaração:

```
   SET @@GLOBAL.GTID_MODE = ON;
   ```

9. Em cada servidor, adicione `gtid-mode=ON` e `enforce-gtid-consistency=ON` ao `my.cnf`. Isso garante que os GTIDs sejam usados para todas as transações que ainda não tenham sido processadas. Para começar a usar o protocolo GTID para que você possa realizar um failover automático mais tarde, execute o próximo conjunto de declarações em cada replica. Se você usar a replicação de múltiplas fontes, faça isso para cada canal, incluindo a cláusula `FOR CHANNEL channel`:

```
   STOP REPLICA [FOR CHANNEL 'channel'];

   CHANGE REPLICATION SOURCE TO SOURCE_AUTO_POSITION = 1 [FOR CHANNEL 'channel'];

   START REPLICA [FOR CHANNEL 'channel'];
   ```