#### 19.1.4.3 Desativar transações GTID online

Esta seção descreve como desativar as transações GTID em servidores que já estão online. Esse procedimento não requer a desativação do servidor e é adequado para uso em produção. No entanto, se você tiver a possibilidade de desativar os servidores ao desativar o modo GTID, esse processo será mais fácil.

O processo é semelhante ao de habilitar transações GTID enquanto o servidor estiver online, mas invertendo os passos. A única coisa que difere é o momento em que você espera que as transações registradas sejam replicadas.

Antes de começar, certifique-se de que os servidores atendam às seguintes condições prévias:

- *Todos os* servidores em sua topologia devem usar o MySQL 5.7.6 ou uma versão posterior. Você não pode desabilitar as transações GTID online em nenhum servidor individual, a menos que *todos* os servidores que estão na topologia estejam usando essa versão.

- Todos os servidores têm `gtid_mode` definido como `ON`.

- A opção `--replicate-same-server-id` não está definida em nenhum servidor. Você não pode desabilitar as transações GTID se essa opção estiver definida junto com a opção `--log-slave-updates` (que é a opção padrão) e o registro binário estiver habilitado (o que também é a opção padrão). Sem GTIDs, essa combinação de opções causa loops infinitos na replicação circular.

1. Execute as seguintes instruções em cada replica e, se estiver usando replicação de múltiplas fontes, faça isso para cada canal, incluindo a cláusula `FOR CHANNEL` ao usar replicação de múltiplas fontes (*MySQL 8.0.23 e versões posteriores*):

   ```
   STOP REPLICA [FOR CHANNEL 'channel'];

   CHANGE REPLICATION SOURCE TO
     SOURCE_AUTO_POSITION = 0,
     SOURCE_LOG_FILE = 'file',
     SOURCE_LOG_POS = position
     [FOR CHANNEL 'channel'];

   START REPLICA [FOR CHANNEL 'channel'];
   ```

   Você pode obter os valores para `file` e `position` das colunas `relay_source_log_file` e `exec_source_log_position` no resultado de `SHOW REPLICA STATUS`. Os nomes `file` e `channel` são strings; ambos devem ser entre aspas quando usados nas instruções `STOP REPLICA`, `CHANGE REPLICATION SOURCE TO` e `START REPLICA`.

   *Antes do MySQL 8.0.23*:

   ```
   STOP SLAVE [FOR CHANNEL 'channel'];

   CHANGE MASTER TO
     MASTER_AUTO_POSITION = 0,
     MASTER_LOG_FILE = 'file',
     MASTER_LOG_POS = position
     [FOR CHANNEL 'channel'];

   START SLAVE [FOR CHANNEL 'channel'];
   ```

   Neste caso, obtenha os valores para `file` e `position` das colunas `relay_source_log_file` e `exec_source_log_position` no resultado de `SHOW SLAVE STATUS`. Os nomes `file` e `channel` são strings e, portanto, devem ser entre aspas quando usados nas instruções `STOP SLAVE`, `CHANGE MASTER TO` e `START SLAVE`.

2. Em cada servidor, execute a seguinte declaração:

   ```
   SET @@global.gtid_mode = ON_PERMISSIVE;
   ```

3. Em cada servidor, execute a seguinte declaração:

   ```
   SET @@global.gtid_mode = OFF_PERMISSIVE;
   ```

4. Em cada servidor, aguarde até que o valor global de `gtid_owned` seja igual à string vazia. Isso pode ser verificado usando a instrução mostrada aqui:

   ```
   SELECT @@global.gtid_owned;
   ```

   Em uma réplica, teoricamente é possível que ela esteja vazia e, em seguida, se torne preenchida novamente. Isso não é um problema; basta que o valor esteja vazio pelo menos uma vez.

5. Aguarde até que todas as transações que atualmente existem em qualquer log binário sejam confirmadas em todas as réplicas. Consulte a Seção 19.1.4.4, “Verificação da Replicação de Transações Anônimas”, para um método de verificar se todas as transações anônimas foram replicadas para todos os servidores.

6. Se você usar logs binários para qualquer outra finalidade que não seja a replicação — por exemplo, para realizar backup ou restauração em um ponto específico no tempo —, espere até que você não precise mais de nenhum log binário antigo que contenha transações GTID.

   Por exemplo, após a etapa anterior ser concluída, você pode executar `FLUSH LOGS` no servidor onde está fazendo o backup. Em seguida, você pode fazer um backup manualmente ou esperar pela próxima iteração de qualquer rotina de backup periódica que você tenha configurado.

   Idealmente, você deve esperar que o servidor limpe todos os logs binários que existiam quando o passo 5 foi concluído e que qualquer backup feito antes disso venha a expirar.

   Você deve ter em mente que os logs que contêm transações GTID não podem ser usados após a próxima etapa. Por essa razão, antes de prosseguir, você deve ter certeza de que não existem transações GTID não confirmadas em nenhuma parte da topologia.

7. Em cada servidor, execute a seguinte declaração:

   ```
   SET @@global.gtid_mode = OFF;
   ```

8. Em cada servidor, defina `gtid_mode=OFF` em `my.cnf`.

   Opcionalmente, você também pode definir `enforce_gtid_consistency=OFF`. Após fazer isso, você deve adicionar `enforce_gtid_consistency=OFF` ao seu arquivo de configuração.

Se você quiser fazer uma downgrade para uma versão anterior do MySQL, pode fazê-lo agora, usando o procedimento de downgrade normal.
