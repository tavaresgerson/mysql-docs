#### 16.1.4.3 Desabilitando Transações GTID Online

Esta seção descreve como desabilitar transações GTID em servidores que já estão online. Este procedimento não requer a parada do servidor (taking the server offline) e é adequado para uso em produção. No entanto, se você tiver a possibilidade de desativar os servidores ao desabilitar o modo GTID, o processo será mais fácil.

O processo é semelhante a habilitar transações GTID enquanto o servidor está online, mas invertendo os passos. A única diferença é o ponto em que você aguarda a replicação das transações logadas.

Antes de começar, certifique-se de que os servidores atendem às seguintes pré-condições:

* *Todos* os servidores em sua topologia devem usar o MySQL 5.7.6 ou posterior. Você não pode desabilitar transações GTID online em nenhum servidor isolado, a menos que *todos* os servidores na topologia estejam usando esta versão.

* Todos os servidores têm [`gtid_mode`](replication-options-gtids.html#sysvar_gtid_mode) definido como `ON`.

1. Execute o seguinte em cada Replica e, se estiver usando Multi-Source Replication, faça isso para cada Channel e inclua a cláusula `FOR CHANNEL` channel:

   ```sql
   STOP SLAVE [FOR CHANNEL 'channel'];
   CHANGE MASTER TO MASTER_AUTO_POSITION = 0, MASTER_LOG_FILE = file, \
   MASTER_LOG_POS = position [FOR CHANNEL 'channel'];
   START SLAVE [FOR CHANNEL 'channel'];
   ```

2. Em cada servidor, execute:

   ```sql
   SET @@GLOBAL.GTID_MODE = ON_PERMISSIVE;
   ```

3. Em cada servidor, execute:

   ```sql
   SET @@GLOBAL.GTID_MODE = OFF_PERMISSIVE;
   ```

4. Em cada servidor, aguarde até que a variável @@GLOBAL.GTID_OWNED seja igual à string vazia. Isso pode ser verificado usando:

   ```sql
   SELECT @@GLOBAL.GTID_OWNED;
   ```

   Em uma Replica, é teoricamente possível que isso esteja vazio e depois se torne não vazio novamente. Isso não é um problema, basta que esteja vazio uma vez.

5. Aguarde que todas as transações que existem atualmente em qualquer Binary Log se repliquem para todas as Replicas. Consulte [Section 16.1.4.4, “Verifying Replication of Anonymous Transactions”](replication-mode-change-online-verify-transactions.html "16.1.4.4 Verifying Replication of Anonymous Transactions") para um método de verificação de que todas as transações anônimas foram replicadas para todos os servidores.

6. Se você usa Binary Logs para algo além de replicação, por exemplo, para fazer Backup ou Restore point-in-time: aguarde até não precisar mais dos Binary Logs antigos que contêm transações GTID.

   Por exemplo, após a conclusão da etapa 5, você pode executar [`FLUSH LOGS`](flush.html#flush-logs) no servidor onde você está realizando o Backup. Em seguida, realize um Backup explicitamente ou aguarde a próxima iteração de qualquer rotina periódica de Backup que você possa ter configurado.

   Idealmente, espere que o servidor elimine todos os Binary Logs que existiam quando a etapa 5 foi concluída. Aguarde também que qualquer Backup feito antes da etapa 5 expire.

   Importante

   Este é o ponto mais importante durante este procedimento. É crucial entender que os Logs contendo transações GTID não podem ser usados após a próxima etapa. Antes de prosseguir, você deve ter certeza de que as transações GTID não existem em nenhum lugar da topologia.

7. Em cada servidor, execute:

   ```sql
   SET @@GLOBAL.GTID_MODE = OFF;
   ```

8. Em cada servidor, defina [`gtid_mode=OFF`](replication-options-gtids.html#sysvar_gtid_mode) no `my.cnf`.

   Se você deseja definir [`enforce_gtid_consistency=OFF`](replication-options-gtids.html#sysvar_enforce_gtid_consistency), pode fazê-lo agora. Após defini-lo, você deve adicionar [`enforce_gtid_consistency=OFF`](replication-options-gtids.html#sysvar_enforce_gtid_consistency) ao seu arquivo de configuração.

Se você quiser fazer o Downgrade para uma versão anterior do MySQL, pode fazê-lo agora, usando o procedimento normal de Downgrade.