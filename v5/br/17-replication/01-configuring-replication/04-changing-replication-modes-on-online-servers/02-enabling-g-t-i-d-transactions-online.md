#### 16.1.4.2 Habilitar transações GTID online

Esta seção descreve como habilitar as transações GTID e, opcionalmente, o posicionamento automático em servidores que já estão online e estão usando transações anônimas. Esse procedimento não requer a remoção do servidor do ar e é adequado para uso em produção. No entanto, se você tiver a possibilidade de remover os servidores do ar ao habilitar as transações GTID, o processo será mais fácil.

Antes de começar, certifique-se de que os servidores atendam às seguintes condições prévias:

- *Todos os* servidores em sua topologia devem usar o MySQL 5.7.6 ou uma versão posterior. Você não pode habilitar transações GTID online em qualquer servidor individual, a menos que *todos* os servidores que estão na topologia estejam usando essa versão.

- Todos os servidores têm `gtid_mode` definido para o valor padrão `OFF`.

O procedimento a seguir pode ser interrompido a qualquer momento e, posteriormente, retomado no ponto onde estava, ou invertido ao alternar para a etapa correspondente de Seção 16.1.4.3, “Desabilitar Transações GTID Online”, o procedimento online para desabilitar GTIDs. Isso torna o procedimento tolerante a falhas, pois quaisquer problemas não relacionados que possam surgir durante o procedimento podem ser tratados normalmente, e o procedimento é então continuado a partir do ponto onde foi interrompido.

Nota

É crucial que você complete cada etapa antes de continuar para a próxima etapa.

Para habilitar transações GTID:

1. Em cada servidor, execute:

   ```sql
   SET @@GLOBAL.ENFORCE_GTID_CONSISTENCY = WARN;
   ```

   Deixe o servidor rodar por um tempo com a carga de trabalho normal e monitore os logs. Se essa etapa causar algum aviso no log, ajuste sua aplicação para que ela use apenas recursos compatíveis com GTID e não gere quaisquer avisos.

   Importante

   Este é o primeiro passo importante. Você deve garantir que nenhum aviso esteja sendo gerado nos logs de erro antes de passar para o próximo passo.

2. Em cada servidor, execute:

   ```sql
   SET @@GLOBAL.ENFORCE_GTID_CONSISTENCY = ON;
   ```

3. Em cada servidor, execute:

   ```sql
   SET @@GLOBAL.GTID_MODE = OFF_PERMISSIVE;
   ```

   Não importa qual servidor execute essa declaração primeiro, mas é importante que todos os servidores completem essa etapa antes que qualquer servidor comece a próxima etapa.

4. Em cada servidor, execute:

   ```sql
   SET @@GLOBAL.GTID_MODE = ON_PERMISSIVE;
   ```

   Não importa qual servidor execute essa declaração primeiro.

5. Em cada servidor, aguarde até que a variável de status `CONTADOR_DE_TRANSACÇÕES_ANÔNIMAS_EM_ANDAMENTO` seja zero. Isso pode ser verificado usando:

   ```sql
   SHOW STATUS LIKE 'ONGOING_ANONYMOUS_TRANSACTION_COUNT';
   ```

   Nota

   Em uma réplica, teoricamente é possível que ele mostre zero e depois novamente um número não zero. Isso não é um problema, basta que ele mostre zero uma vez.

6. Aguarde que todas as transações geradas até o passo 5 sejam replicadas em todos os servidores. Você pode fazer isso sem interromper as atualizações: o único detalhe importante é que todas as transações anônimas sejam replicadas.

   Consulte Seção 16.1.4.4, “Verificação da Replicação de Transações Anônimas” para um método de verificar se todas as transações anônimas foram replicadas para todos os servidores.

7. Se você usar logs binários para qualquer outra finalidade que não seja a replicação, como, por exemplo, backup e restauração em um ponto específico, espere até que não precise mais dos logs binários antigos com transações sem GTIDs.

   Por exemplo, após a etapa 6 ser concluída, você pode executar `FLUSH LOGS` no servidor onde está fazendo os backups. Em seguida, você pode tomar um backup explicitamente ou esperar pela próxima iteração de qualquer rotina de backup periódica que você tenha configurado.

   Idealmente, espere o servidor limpar todos os logs binários que existiam quando o passo 6 foi concluído. Além disso, espere que qualquer backup feito antes do passo 6 expire.

   Importante

   Este é o segundo ponto importante. É vital entender que os logs binários que contêm transações anônimas, sem GTIDs, não podem ser usados após a próxima etapa. Após essa etapa, você deve ter certeza de que as transações sem GTIDs não existem em nenhuma parte da topologia.

8. Em cada servidor, execute:

   ```sql
   SET @@GLOBAL.GTID_MODE = ON;
   ```

9. Em cada servidor, adicione `gtid_mode=ON` e `enforce_gtid_consistency=ON` ao `my.cnf`.

   Agora você tem a garantia de que todas as transações têm um GTID (exceto as transações geradas no passo 5 ou antes, que já foram processadas). Para começar a usar o protocolo GTID, para que você possa realizar o fail-over automático mais tarde, execute o seguinte em cada replica. Opcionalmente, se você usar a replicação de múltiplas fontes, faça isso para cada canal e inclua a cláusula `FOR CHANNEL channel`:

   ```sql
   STOP SLAVE [FOR CHANNEL 'channel'];
   CHANGE MASTER TO MASTER_AUTO_POSITION = 1 [FOR CHANNEL 'channel'];
   START SLAVE [FOR CHANNEL 'channel'];
   ```
