#### 16.1.2.6 Adicionando Replicas a uma Topologia de Replication

Você pode adicionar outra replica a uma configuração de replication existente sem parar o servidor source. Para fazer isso, você pode configurar a nova replica copiando o data directory de uma replica existente e fornecendo à nova replica um Server ID diferente (que é especificado pelo usuário) e um Server UUID (que é gerado na inicialização).

Para duplicar uma replica existente:

1. Pare a replica existente e registre as informações de status da replica, particularmente o arquivo binary log do source e as posições do arquivo relay log. Você pode visualizar o status da replica nas tabelas de replication do Performance Schema (consulte [Section 25.12.11, “Performance Schema Replication Tables”](performance-schema-replication-tables.html "25.12.11 Performance Schema Replication Tables")) ou executando [`SHOW SLAVE STATUS`](show-slave-status.html "13.7.5.34 SHOW SLAVE STATUS Statement") da seguinte forma:

   ```sql
   mysql> STOP SLAVE;
   mysql> SHOW SLAVE STATUS\G
   ```

2. Encerre a replica existente:

   ```sql
   $> mysqladmin shutdown
   ```

3. Copie o data directory da replica existente para a nova replica, incluindo os arquivos log e os arquivos relay log. Você pode fazer isso criando um arquivo morto usando **tar** ou `WinZip`, ou realizando uma cópia direta usando uma ferramenta como **cp** ou **rsync**.

   Importante

   * Antes de copiar, verifique se todos os arquivos relacionados à replica existente estão de fato armazenados no data directory. Por exemplo, o `InnoDB` system tablespace, undo tablespace e redo log podem estar armazenados em um local alternativo. Os arquivos de tablespace do `InnoDB` e tablespaces file-per-table podem ter sido criados em outros diretórios. Os binary logs e relay logs para a replica podem estar em seus próprios diretórios fora do data directory. Verifique as system variables que estão definidas para a replica existente e procure quaisquer paths alternativos que tenham sido especificados. Se encontrar algum, copie esses diretórios também.

   * Durante a cópia, se arquivos foram usados para os repositórios de metadados de replication (consulte [Section 16.2.4, “Relay Log and Replication Metadata Repositories”](replica-logs.html "16.2.4 Relay Log and Replication Metadata Repositories")), que é o padrão no MySQL 5.7, certifique-se de copiar esses arquivos da replica existente para a nova replica também. Se tabelas tiverem sido usadas para os repositórios, as tabelas estarão no data directory.

   * Após a cópia, exclua o arquivo `auto.cnf` da cópia do data directory na nova replica, para que a nova replica seja iniciada com um Server UUID gerado diferente. O Server UUID deve ser único.

   Um problema comum encontrado ao adicionar novas replicas é que a nova replica falha com uma série de mensagens de aviso e erro como estas:

   ```sql
   071118 16:44:10 [Warning] Neither --relay-log nor --relay-log-index were used; so
   replication may break when this MySQL server acts as a slave and has his hostname
   changed!! Please use '--relay-log=new_replica_hostname-relay-bin' to avoid this problem.
   071118 16:44:10 [ERROR] Failed to open the relay log './old_replica_hostname-relay-bin.003525'
   (relay_log_pos 22940879)
   071118 16:44:10 [ERROR] Could not find target log during relay log initialization
   071118 16:44:10 [ERROR] Failed to initialize the master info structure
   ```

   Esta situação pode ocorrer se a system variable [`relay_log`](replication-options-replica.html#sysvar_relay_log) não for especificada, pois os arquivos relay log contêm o host name como parte de seus nomes de arquivo. Isso também é verdade para o arquivo relay log index se a system variable [`relay_log_index`](replication-options-replica.html#sysvar_relay_log_index) não for usada. Para obter mais informações sobre essas variáveis, consulte [Section 16.1.6, “Replication and Binary Logging Options and Variables”](replication-options.html "16.1.6 Replication and Binary Logging Options and Variables").

   Para evitar este problema, use o mesmo valor para [`relay_log`](replication-options-replica.html#sysvar_relay_log) na nova replica que foi usado na replica existente. Se esta opção não foi definida explicitamente na replica existente, use `existing_replica_hostname-relay-bin`. Se isso não for possível, copie o arquivo relay log index da replica existente para a nova replica e defina a system variable [`relay_log_index`](replication-options-replica.html#sysvar_relay_log_index) na nova replica para corresponder ao que foi usado na replica existente. Se esta opção não foi definida explicitamente na replica existente, use `existing_replica_hostname-relay-bin.index`. Alternativamente, se você já tentou iniciar a nova replica após seguir as etapas restantes nesta seção e encontrou erros como os descritos anteriormente, execute as seguintes etapas:

   1. Se ainda não o fez, execute [`STOP SLAVE`](stop-slave.html "13.4.2.6 STOP SLAVE Statement") na nova replica.

      Se você já iniciou a replica existente novamente, execute [`STOP SLAVE`](stop-slave.html "13.4.2.6 STOP SLAVE Statement") na replica existente também.

   2. Copie o conteúdo do arquivo relay log index da replica existente para o arquivo relay log index da nova replica, certificando-se de sobrescrever qualquer conteúdo que já esteja no arquivo.

   3. Prossiga com as etapas restantes desta seção.
4. Quando a cópia estiver completa, reinicie a replica existente.
5. Na nova replica, edite a configuração e atribua à nova replica um Server ID exclusivo (usando a system variable [`server_id`](replication-options.html#sysvar_server_id)) que não seja usado pelo source ou por quaisquer replicas existentes.

6. Inicie o novo servidor replica, especificando a opção [`--skip-slave-start`](replication-options-replica.html#option_mysqld_skip-slave-start) para que o replication não comece ainda. Use as tabelas de replication do Performance Schema ou execute [`SHOW SLAVE STATUS`](show-slave-status.html "13.7.5.34 SHOW SLAVE STATUS Statement") para confirmar que a nova replica possui as configurações corretas em comparação com a replica existente. Exiba também o Server ID e o Server UUID e verifique se estão corretos e exclusivos para a nova replica.

7. Inicie os replication threads executando um statement [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement"):

   ```sql
   mysql> START SLAVE;
   ```

   A nova replica agora usa as informações em seu repositório de metadados de conexão para iniciar o processo de replication.