#### 19.1.4.3 Desativando Transações GTID Online

Esta seção descreve como desativar transações GTID em servidores que já estão online. Esse procedimento não requer a remoção do servidor do ar e é adequado para uso em produção. No entanto, se você tiver a possibilidade de remover os servidores do ar ao desativar o modo GTID, esse processo é mais fácil.

O processo é semelhante ao de habilitar transações GTID enquanto o servidor está online, mas ao reverter as etapas. A única diferença é o ponto em que você espera que as transações registradas sejam replicadas.

Antes de começar, todos os servidores devem atender às seguintes condições:

* Todos os servidores têm o `gtid_mode` definido como `ON`.

* A opção `--replicate-same-server-id` não está definida em nenhum servidor. Você não pode desativar transações GTID se essa opção estiver definida junto com a opção `--log-replica-updates` (padrão) e o registro binário estiver habilitado (também o padrão). Sem GTIDs, essa combinação de opções causa loops infinitos na replicação circular.

1. Execute as seguintes instruções em cada replica, e, se estiver usando replicação de múltiplas fontes, faça isso para cada canal, incluindo a cláusula `FOR CHANNEL` ao usar replicação de múltiplas fontes:

   ```
   STOP REPLICA [FOR CHANNEL 'channel'];

   CHANGE REPLICATION SOURCE TO
     SOURCE_AUTO_POSITION = 0,
     SOURCE_LOG_FILE = 'file',
     SOURCE_LOG_POS = position
     [FOR CHANNEL 'channel'];

   START REPLICA [FOR CHANNEL 'channel'];
   ```

   Você pode obter os valores para *`file`* e *`position`* a partir das colunas `relay_source_log_file` e `exec_source_log_position` no resultado de `SHOW REPLICA STATUS`. Os nomes *`file`* e *`channel`* são strings; ambos devem ser citados quando usados nas instruções `STOP REPLICA`, `CHANGE REPLICATION SOURCE TO` e `START REPLICA`.

2. Em cada servidor, execute a seguinte instrução:

   ```
   SET @@global.gtid_mode = ON_PERMISSIVE;
   ```

3. Em cada servidor, execute a seguinte instrução:

   ```
   SET @@global.gtid_mode = OFF_PERMISSIVE;
   ```

4. Em cada servidor, aguarde até que o valor global de `gtid_owned` seja igual à string vazia. Isso pode ser verificado usando a instrução mostrada aqui:

   ```
   SELECT @@global.gtid_owned;
   ```

   Em uma replica, teoricamente é possível que ela esteja vazia e, em seguida, se torne preenchida novamente. Isso não é um problema; basta que o valor esteja vazio pelo menos uma vez.

5. Aguarde até que todas as transações que atualmente existam em qualquer log binário sejam confirmadas em todas as réplicas. Veja a Seção 19.1.4.4, “Verificação da Replicação de Transações Anônimas”, para um método de verificar se todas as transações anônimas foram replicadas para todos os servidores.

6. Se você estiver usando logs binários para qualquer outra finalidade além da replicação—por exemplo, para realizar backup ou restauração em um ponto no tempo—aguarde até que você não precise mais de nenhum log binário antigo contendo transações GTID.

   Por exemplo, após a etapa anterior ter sido concluída, você pode executar `FLUSH LOGS` no servidor onde está fazendo o backup. Em seguida, faça um backup manualmente ou aguarde a próxima iteração de qualquer rotina de backup periódica que você tenha configurado.

   Idealmente, você deve esperar que o servidor limpe todos os logs binários que existiam quando a etapa 5 foi concluída e que qualquer backup feito antes disso expire.

   Você deve ter em mente que logs contendo transações GTID não podem ser usados após a próxima etapa. Por essa razão, antes de prosseguir, você deve ter certeza de que não existem transações GTID não confirmadas em nenhum lugar da topologia.

7. Em cada servidor, execute a seguinte instrução:

   ```
   SET @@global.gtid_mode = OFF;
   ```

8. Em cada servidor, defina `gtid_mode=OFF` em `my.cnf`.

   Opcionalmente, você também pode definir `enforce_gtid_consistency=OFF`. Após fazer isso, adicione `enforce_gtid_consistency=OFF` ao seu arquivo de configuração.

Se você quiser fazer uma downgrade para uma versão anterior do MySQL, pode fazê-lo agora, usando o procedimento de downgrade normal.