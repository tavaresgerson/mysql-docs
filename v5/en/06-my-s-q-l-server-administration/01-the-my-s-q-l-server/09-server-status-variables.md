### 5.1.9 Variáveis de Status do Servidor

O servidor MySQL mantém muitas variáveis de status que fornecem informações sobre sua operação. Você pode visualizar essas variáveis e seus valores usando a instrução `SHOW [GLOBAL | SESSION] STATUS` (veja [Seção 13.7.5.35, “SHOW STATUS Statement”](show-status.html "13.7.5.35 SHOW STATUS Statement")). A palavra-chave opcional `GLOBAL` agrega os valores de todas as conexões, e `SESSION` mostra os valores para a conexão atual.

```sql
mysql> SHOW GLOBAL STATUS;
+-----------------------------------+------------+
| Variable_name                     | Value      |
+-----------------------------------+------------+
| Aborted_clients                   | 0          |
| Aborted_connects                  | 0          |
| Bytes_received                    | 155372598  |
| Bytes_sent                        | 1176560426 |
...
| Connections                       | 30023      |
| Created_tmp_disk_tables           | 0          |
| Created_tmp_files                 | 3          |
| Created_tmp_tables                | 2          |
...
| Threads_created                   | 217        |
| Threads_running                   | 88         |
| Uptime                            | 1389872    |
+-----------------------------------+------------+
```

Muitas variáveis de status são redefinidas para 0 pela instrução [`FLUSH STATUS`](flush.html#flush-status).

Esta seção fornece uma descrição de cada variável de status. Para um resumo das variáveis de status, consulte [Seção 5.1.5, “Referência de Variáveis de Status do Servidor”](server-status-variable-reference.html "5.1.5 Referência de Variáveis de Status do Servidor"). Para obter informações sobre variáveis de status específicas para o NDB Cluster, consulte [Seção 21.4.3.9.3, “NDB Cluster Status Variables”](mysql-cluster-options-variables.html#mysql-cluster-status-variables "21.4.3.9.3 NDB Cluster Status Variables").

As variáveis de status têm os significados mostrados na lista a seguir.

* [`Aborted_clients`](server-status-variables.html#statvar_Aborted_clients)

  O número de conexões que foram abortadas porque o cliente morreu sem fechar a conexão adequadamente. Consulte [Seção B.3.2.9, “Communication Errors and Aborted Connections”](communication-errors.html "B.3.2.9 Communication Errors and Aborted Connections").

* [`Aborted_connects`](server-status-variables.html#statvar_Aborted_connects)

  O número de tentativas fracassadas de se conectar ao servidor MySQL. Consulte [Seção B.3.2.9, “Communication Errors and Aborted Connections”](communication-errors.html "B.3.2.9 Communication Errors and Aborted Connections").

  Para informações adicionais relacionadas à conexão, verifique as variáveis de status [`Connection_errors_xxx`](server-status-variables.html#statvar_Connection_errors_xxx) e a tabela [`host_cache`](performance-schema-host-cache-table.html "25.12.16.1 The host_cache Table").

  A partir do MySQL 5.7.3, [`Aborted_connects`](server-status-variables.html#statvar_Aborted_connects) não é visível no servidor embedded porque, para esse servidor, ele não é atualizado e não é significativo.

* [`Binlog_cache_disk_use`](server-status-variables.html#statvar_Binlog_cache_disk_use)

  O número de transações que usaram o cache temporário do binary log, mas que excederam o valor de [`binlog_cache_size`](replication-options-binary-log.html#sysvar_binlog_cache_size) e usaram um arquivo temporário para armazenar instruções da transação.

  O número de instruções não transacionais que fizeram com que o cache de transações do binary log fosse escrito no disco é rastreado separadamente na variável de status [`Binlog_stmt_cache_disk_use`](server-status-variables.html#statvar_Binlog_stmt_cache_disk_use).

* [`Binlog_cache_use`](server-status-variables.html#statvar_Binlog_cache_use)

  O número de transações que usaram o cache do binary log.

* [`Binlog_stmt_cache_disk_use`](server-status-variables.html#statvar_Binlog_stmt_cache_disk_use)

  O número de instruções não transacionais que usaram o cache de instruções do binary log, mas que excederam o valor de [`binlog_stmt_cache_size`](replication-options-binary-log.html#sysvar_binlog_stmt_cache_size) e usaram um arquivo temporário para armazenar essas instruções.

* [`Binlog_stmt_cache_use`](server-status-variables.html#statvar_Binlog_stmt_cache_use)

  O número de instruções não transacionais que usaram o cache de instruções do binary log.

* [`Bytes_received`](server-status-variables.html#statvar_Bytes_received)

  O número de bytes recebidos de todos os clientes.

* [`Bytes_sent`](server-status-variables.html#statvar_Bytes_sent)

  O número de bytes enviados a todos os clientes.

* `Com_xxx`

  As variáveis contadoras de instruções `Com_xxx` indicam o número de vezes que cada instrução *`xxx`* foi executada. Existe uma variável de status para cada tipo de instrução. Por exemplo, `Com_delete` e `Com_update` contam as instruções [`DELETE`](delete.html "13.2.2 DELETE Statement") e [`UPDATE`](update.html "13.2.11 UPDATE Statement"), respectivamente. `Com_delete_multi` e `Com_update_multi` são semelhantes, mas se aplicam às instruções [`DELETE`](delete.html "13.2.2 DELETE Statement") e [`UPDATE`](update.html "13.2.11 UPDATE Statement") que usam sintaxe de múltiplas tabelas.

  Se o resultado de uma Query for retornado do Query Cache, o servidor incrementa a variável de status [`Qcache_hits`](server-status-variables.html#statvar_Qcache_hits), e não `Com_select`. Consulte [Seção 8.10.3.4, “Query Cache Status and Maintenance”](query-cache-status-and-maintenance.html "8.10.3.4 Query Cache Status and Maintenance").

  Todas as variáveis `Com_stmt_xxx` são incrementadas mesmo que um argumento de prepared statement seja desconhecido ou ocorra um erro durante a execução. Em outras palavras, seus valores correspondem ao número de requisições emitidas, e não ao número de requisições concluídas com sucesso. Por exemplo, como as variáveis de status são inicializadas para cada inicialização do servidor e não persistem após reinicializações, a variável `Com_shutdown` que rastreia as instruções [`SHUTDOWN`](shutdown.html "13.7.6.7 SHUTDOWN Statement") normalmente tem um valor zero, mas pode ser diferente de zero se instruções [`SHUTDOWN`](shutdown.html "13.7.6.7 SHUTDOWN Statement") foram executadas, mas falharam.

  As variáveis de status `Com_stmt_xxx` são as seguintes:

  + `Com_stmt_prepare`
  + `Com_stmt_execute`
  + `Com_stmt_fetch`
  + `Com_stmt_send_long_data`
  + `Com_stmt_reset`
  + `Com_stmt_close`

  Essas variáveis representam comandos de prepared statement. Seus nomes se referem ao conjunto de comandos `COM_xxx` usado na camada de rede. Em outras palavras, seus valores aumentam sempre que chamadas de API de prepared statement, como **mysql_stmt_prepare()**, **mysql_stmt_execute()** e assim por diante, são executadas. No entanto, `Com_stmt_prepare`, `Com_stmt_execute` e `Com_stmt_close` também aumentam para [`PREPARE`](prepare.html "13.5.1 PREPARE Statement"), [`EXECUTE`](execute.html "13.5.2 EXECUTE Statement") ou [`DEALLOCATE PREPARE`](deallocate-prepare.html "13.5.3 DEALLOCATE PREPARE Statement"), respectivamente. Além disso, os valores das variáveis contadoras de instruções mais antigas `Com_prepare_sql`, `Com_execute_sql` e `Com_dealloc_sql` aumentam para as instruções [`PREPARE`](prepare.html "13.5.1 PREPARE Statement"), [`EXECUTE`](execute.html "13.5.2 EXECUTE Statement") e [`DEALLOCATE PREPARE`](deallocate-prepare.html "13.5.3 DEALLOCATE PREPARE Statement"). `Com_stmt_fetch` representa o número total de viagens de ida e volta na rede emitidas ao buscar a partir de cursors.

  `Com_stmt_reprepare` indica o número de vezes que as instruções foram automaticamente *reprepared* pelo servidor após mudanças de metadados em tabelas ou views referenciadas pela instrução. Uma operação de reprepare incrementa `Com_stmt_reprepare` e também `Com_stmt_prepare`.

  `Com_explain_other` indica o número de instruções [`EXPLAIN FOR CONNECTION`](explain.html "13.8.2 EXPLAIN Statement") executadas. Consulte [Seção 8.8.4, “Obtaining Execution Plan Information for a Named Connection”](explain-for-connection.html "8.8.4 Obtaining Execution Plan Information for a Named Connection").

  `Com_change_repl_filter` indica o número de instruções [`CHANGE REPLICATION FILTER`](change-replication-filter.html "13.4.2.2 CHANGE REPLICATION FILTER Statement") executadas.

* [`Compression`](server-status-variables.html#statvar_Compression)

  Se a conexão do cliente usa compression no protocolo cliente/servidor.

* [`Connection_errors_xxx`](server-status-variables.html#statvar_Connection_errors_xxx)

  Essas variáveis fornecem informações sobre erros que ocorrem durante o processo de conexão do cliente. Elas são apenas globais e representam contagens de erros agregadas em todas as conexões de todos os hosts. Essas variáveis rastreiam erros não contabilizados pelo Host Cache (consulte [Seção 5.1.11.2, “DNS Lookups and the Host Cache”](host-cache.html "5.1.11.2 DNS Lookups and the Host Cache")), como erros que não estão associados a conexões TCP, ocorrem muito cedo no processo de conexão (mesmo antes que um endereço IP seja conhecido) ou não são específicos de nenhum endereço IP em particular (como condições de falta de memória).

  A partir do MySQL 5.7.3, as variáveis de status `Connection_errors_xxx` não são visíveis no servidor embedded porque, para esse servidor, elas não são atualizadas e não são significativas.

  + [`Connection_errors_accept`](server-status-variables.html#statvar_Connection_errors_accept)

    O número de erros que ocorreram durante chamadas a `accept()` na porta de escuta.

  + [`Connection_errors_internal`](server-status-variables.html#statvar_Connection_errors_internal)

    O número de conexões recusadas devido a erros internos no servidor, como falha ao iniciar uma nova Thread ou uma condição de falta de memória.

  + [`Connection_errors_max_connections`](server-status-variables.html#statvar_Connection_errors_max_connections)

    O número de conexões recusadas porque o limite [`max_connections`](server-system-variables.html#sysvar_max_connections) do servidor foi atingido.

  + [`Connection_errors_peer_address`](server-status-variables.html#statvar_Connection_errors_peer_address)

    O número de erros que ocorreram durante a busca por endereços IP de clientes em conexão.

  + [`Connection_errors_select`](server-status-variables.html#statvar_Connection_errors_select)

    O número de erros que ocorreram durante chamadas a `select()` ou `poll()` na porta de escuta. (A falha desta operação não significa necessariamente que uma conexão de cliente foi rejeitada.)

  + [`Connection_errors_tcpwrap`](server-status-variables.html#statvar_Connection_errors_tcpwrap)

    O número de conexões recusadas pela biblioteca `libwrap`.

* [`Connections`](server-status-variables.html#statvar_Connections)

  O número de tentativas de conexão (bem-sucedidas ou não) ao servidor MySQL.

* [`Created_tmp_disk_tables`](server-status-variables.html#statvar_Created_tmp_disk_tables)

  O número de tabelas temporárias internas em disco criadas pelo servidor durante a execução de instruções.

  Você pode comparar o número de tabelas temporárias internas em disco criadas com o número total de tabelas temporárias internas criadas comparando os valores de [`Created_tmp_disk_tables`](server-status-variables.html#statvar_Created_tmp_disk_tables) e [`Created_tmp_tables`](server-status-variables.html#statvar_Created_tmp_tables).

  Consulte também [Seção 8.4.4, “Internal Temporary Table Use in MySQL”](internal-temporary-tables.html "8.4.4 Internal Temporary Table Use in MySQL").

* [`Created_tmp_files`](server-status-variables.html#statvar_Created_tmp_files)

  Quantos arquivos temporários o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") criou.

* [`Created_tmp_tables`](server-status-variables.html#statvar_Created_tmp_tables)

  O número de tabelas temporárias internas criadas pelo servidor durante a execução de instruções.

  Você pode comparar o número de tabelas temporárias internas em disco criadas com o número total de tabelas temporárias internas criadas comparando os valores de [`Created_tmp_disk_tables`](server-status-variables.html#statvar_Created_tmp_disk_tables) e [`Created_tmp_tables`](server-status-variables.html#statvar_Created_tmp_tables).

  Consulte também [Seção 8.4.4, “Internal Temporary Table Use in MySQL”](internal-temporary-tables.html "8.4.4 Internal Temporary Table Use in MySQL").

  Cada invocação da instrução [`SHOW STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") usa uma tabela temporária interna e incrementa o valor global de [`Created_tmp_tables`](server-status-variables.html#statvar_Created_tmp_tables).

* [`Delayed_errors`](server-status-variables.html#statvar_Delayed_errors)

  Esta variável de status está depreciada (porque inserções `DELAYED` não são suportadas); espere que ela seja removida em um lançamento futuro.

* [`Delayed_insert_threads`](server-status-variables.html#statvar_Delayed_insert_threads)

  Esta variável de status está depreciada (porque inserções `DELAYED` não são suportadas); espere que ela seja removida em um lançamento futuro.

* [`Delayed_writes`](server-status-variables.html#statvar_Delayed_writes)

  Esta variável de status está depreciada (porque inserções `DELAYED` não são suportadas); espere que ela seja removida em um lançamento futuro.

* [`Flush_commands`](server-status-variables.html#statvar_Flush_commands)

  O número de vezes que o servidor faz flush de tabelas, seja porque um usuário executou uma instrução [`FLUSH TABLES`](flush.html#flush-tables) ou devido a uma operação interna do servidor. Também é incrementado pelo recebimento de um pacote `COM_REFRESH`. Isso contrasta com [`Com_flush`](server-status-variables.html#statvar_Com_xxx), que indica quantas instruções `FLUSH` foram executadas, sejam [`FLUSH TABLES`](flush.html#flush-tables), [`FLUSH LOGS`](flush.html#flush-logs), e assim por diante.

* [`group_replication_primary_member`](server-status-variables.html#statvar_group_replication_primary_member)

  Mostra o UUID do membro primary quando o grupo está operando em modo single-primary. Se o grupo estiver operando em modo multi-primary, mostra uma string vazia.

* [`Handler_commit`](server-status-variables.html#statvar_Handler_commit)

  O número de instruções [`COMMIT`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") internas.

* [`Handler_delete`](server-status-variables.html#statvar_Handler_delete)

  O número de vezes que rows foram deletadas de tabelas.

* [`Handler_external_lock`](server-status-variables.html#statvar_Handler_external_lock)

  O servidor incrementa esta variável para cada chamada à sua função `external_lock()`, o que geralmente ocorre no início e no fim do acesso a uma instância de tabela. Pode haver diferenças entre os storage engines. Esta variável pode ser usada, por exemplo, para descobrir para uma instrução que acessa uma tabela particionada quantas partições foram podadas (pruned) antes que o Lock ocorresse: Verifique o quanto o contador aumentou para a instrução, subtraia 2 (2 chamadas para a tabela em si) e, em seguida, divida por 2 para obter o número de partições locked.

* [`Handler_mrr_init`](server-status-variables.html#statvar_Handler_mrr_init)

  O número de vezes que o servidor usa a implementação Multi-Range Read do próprio storage engine para acesso à tabela.

* [`Handler_prepare`](server-status-variables.html#statvar_Handler_prepare)

  Um contador para a fase de prepare de operações de two-phase commit.

* [`Handler_read_first`](server-status-variables.html#statvar_Handler_read_first)

  O número de vezes que o primeiro registro em um Index foi lido. Se este valor for alto, sugere que o servidor está fazendo muitos full Index scans (por exemplo, `SELECT col1 FROM foo`, assumindo que `col1` é indexed).

* [`Handler_read_key`](server-status-variables.html#statvar_Handler_read_key)

  O número de requisições para ler uma row baseada em uma key. Se este valor for alto, é uma boa indicação de que suas tabelas estão devidamente indexed para suas Queries.

* [`Handler_read_last`](server-status-variables.html#statvar_Handler_read_last)

  O número de requisições para ler a última key em um Index. Com `ORDER BY`, o servidor emite uma requisição de primeira key seguida por várias requisições de próxima key, enquanto com `ORDER BY DESC`, o servidor emite uma requisição de última key seguida por várias requisições de key anterior.

* [`Handler_read_next`](server-status-variables.html#statvar_Handler_read_next)

  O número de requisições para ler a próxima row em ordem de key. Este valor é incrementado se você estiver consultando uma coluna Index com uma restrição de range ou se estiver fazendo um Index scan.

* [`Handler_read_prev`](server-status-variables.html#statvar_Handler_read_prev)

  O número de requisições para ler a row anterior em ordem de key. Este método de leitura é usado principalmente para otimizar `ORDER BY ... DESC`.

* [`Handler_read_rnd`](server-status-variables.html#statvar_Handler_read_rnd)

  O número de requisições para ler uma row baseada em uma posição fixa. Este valor é alto se você estiver fazendo muitas Queries que exigem sorting do resultado. Você provavelmente tem muitas Queries que exigem que o MySQL faça scan de tabelas inteiras ou tem JOINs que não usam keys adequadamente.

* [`Handler_read_rnd_next`](server-status-variables.html#statvar_Handler_read_rnd_next)

  O número de requisições para ler a próxima row no arquivo de dados. Este valor é alto se você estiver fazendo muitos table scans. Geralmente, isso sugere que suas tabelas não estão devidamente indexed ou que suas Queries não estão escritas para tirar proveito dos Index que você possui.

* [`Handler_rollback`](server-status-variables.html#statvar_Handler_rollback)

  O número de requisições para um storage engine realizar uma operação de rollback.

* [`Handler_savepoint`](server-status-variables.html#statvar_Handler_savepoint)

  O número de requisições para um storage engine colocar um savepoint.

* [`Handler_savepoint_rollback`](server-status-variables.html#statvar_Handler_savepoint_rollback)

  O número de requisições para um storage engine fazer rollback para um savepoint.

* [`Handler_update`](server-status-variables.html#statvar_Handler_update)

  O número de requisições para atualizar uma row em uma tabela.

* [`Handler_write`](server-status-variables.html#statvar_Handler_write)

  O número de requisições para inserir uma row em uma tabela.

* [`Innodb_available_undo_logs`](server-status-variables.html#statvar_Innodb_available_undo_logs)

  Note

  A variável de status [`Innodb_available_undo_logs`](server-status-variables.html#statvar_Innodb_available_undo_logs) está depreciada a partir do MySQL 5.7.19; espere que ela seja removida em um lançamento futuro.

  O número total de rollback segments `InnoDB` disponíveis. Complementa a variável de sistema [`innodb_rollback_segments`](innodb-parameters.html#sysvar_innodb_rollback_segments), que define o número de rollback segments ativos.

  Um rollback segment sempre reside no tablespace do sistema, e 32 rollback segments são reservados para uso por tabelas temporárias e são hospedados no tablespace temporário (`ibtmp1`). Consulte [Seção 14.6.7, “Undo Logs”](innodb-undo-logs.html "14.6.7 Undo Logs").

  Se você iniciar uma instância MySQL com 32 ou menos rollback segments, o `InnoDB` ainda atribui um rollback segment ao tablespace do sistema e 32 rollback segments ao tablespace temporário. Neste caso, `Innodb_available_undo_logs` relata 33 rollback segments disponíveis, embora a instância tenha sido inicializada com um valor [`innodb_rollback_segments`](innodb-parameters.html#sysvar_innodb_rollback_segments) menor.

* [`Innodb_buffer_pool_dump_status`](server-status-variables.html#statvar_Innodb_buffer_pool_dump_status)

  O progresso de uma operação para registrar as pages mantidas no `InnoDB` [Buffer Pool](glossary.html#glos_buffer_pool "buffer pool"), acionada pela configuração de `innodb_buffer_pool_dump_at_shutdown` ou `innodb_buffer_pool_dump_now`.

  Para informações e exemplos relacionados, consulte [Seção 14.8.3.6, “Saving and Restoring the Buffer Pool State”](innodb-preload-buffer-pool.html "14.8.3.6 Saving and Restoring the Buffer Pool State").

* [`Innodb_buffer_pool_load_status`](server-status-variables.html#statvar_Innodb_buffer_pool_load_status)

  O progresso de uma operação para fazer [warm up](glossary.html#glos_warm_up "warm up") do `InnoDB` [Buffer Pool](glossary.html#glos_buffer_pool "buffer pool") lendo um conjunto de [pages](glossary.html#glos_page "page") correspondentes a um ponto anterior no tempo, acionada pela configuração de [`innodb_buffer_pool_load_at_startup`](innodb-parameters.html#sysvar_innodb_buffer_pool_load_at_startup) ou [`innodb_buffer_pool_load_now`](innodb-parameters.html#sysvar_innodb_buffer_pool_load_now). Se a operação introduzir muito overhead, você pode cancelá-la definindo [`innodb_buffer_pool_load_abort`](innodb-parameters.html#sysvar_innodb_buffer_pool_load_abort).

  Para informações e exemplos relacionados, consulte [Seção 14.8.3.6, “Saving and Restoring the Buffer Pool State”](innodb-preload-buffer-pool.html "14.8.3.6 Saving and Restoring the Buffer Pool State").

* [`Innodb_buffer_pool_bytes_data`](server-status-variables.html#statvar_Innodb_buffer_pool_bytes_data)

  O número total de bytes no `InnoDB` [Buffer Pool](glossary.html#glos_buffer_pool "buffer pool") contendo dados. O número inclui pages [dirty](glossary.html#glos_dirty_page "dirty page") e clean. Para cálculos de uso de memória mais precisos do que com [`Innodb_buffer_pool_pages_data`](server-status-variables.html#statvar_Innodb_buffer_pool_pages_data), quando tabelas [compressed](glossary.html#glos_compression "compression") fazem com que o Buffer Pool contenha pages de diferentes tamanhos.

* [`Innodb_buffer_pool_pages_data`](server-status-variables.html#statvar_Innodb_buffer_pool_pages_data)

  O número de [pages](glossary.html#glos_page "page") no `InnoDB` [Buffer Pool](glossary.html#glos_buffer_pool "buffer pool") contendo dados. O número inclui pages [dirty](glossary.html#glos_dirty_page "dirty page") e clean. Ao usar [tabelas compressed](glossary.html#glos_compressed_table "compressed table"), o valor [`Innodb_buffer_pool_pages_data`](server-status-variables.html#statvar_Innodb_buffer_pool_pages_data) relatado pode ser maior que [`Innodb_buffer_pool_pages_total`](server-status-variables.html#statvar_Innodb_buffer_pool_pages_total) (Bug #59550).

* [`Innodb_buffer_pool_bytes_dirty`](server-status-variables.html#statvar_Innodb_buffer_pool_bytes_dirty)

  O número total atual de bytes mantidos em [dirty pages](glossary.html#glos_dirty_page "dirty page") no `InnoDB` [Buffer Pool](glossary.html#glos_buffer_pool "buffer pool"). Para cálculos de uso de memória mais precisos do que com [`Innodb_buffer_pool_pages_dirty`](server-status-variables.html#statvar_Innodb_buffer_pool_pages_dirty), quando tabelas [compressed](glossary.html#glos_compression "compression") fazem com que o Buffer Pool contenha pages de diferentes tamanhos.

* [`Innodb_buffer_pool_pages_dirty`](server-status-variables.html#statvar_Innodb_buffer_pool_pages_dirty)

  O número atual de [dirty pages](glossary.html#glos_dirty_page "dirty page") no `InnoDB` [Buffer Pool](glossary.html#glos_buffer_pool "buffer pool").

* [`Innodb_buffer_pool_pages_flushed`](server-status-variables.html#statvar_Innodb_buffer_pool_pages_flushed)

  O número de requisições para fazer [flush](glossary.html#glos_flush "flush") de [pages](glossary.html#glos_page "page") do `InnoDB` [Buffer Pool](glossary.html#glos_buffer_pool "buffer pool").

* [`Innodb_buffer_pool_pages_free`](server-status-variables.html#statvar_Innodb_buffer_pool_pages_free)

  O número de [pages](glossary.html#glos_page "page") livres no `InnoDB` [Buffer Pool](glossary.html#glos_buffer_pool "buffer pool").

* [`Innodb_buffer_pool_pages_latched`](server-status-variables.html#statvar_Innodb_buffer_pool_pages_latched)

  O número de [pages](glossary.html#glos_page "page") latched no `InnoDB` [Buffer Pool](glossary.html#glos_buffer_pool "buffer pool"). Estas são pages que estão sendo lidas ou escritas atualmente, ou que não podem ser [flushed](glossary.html#glos_flush "flush") ou removidas por algum outro motivo. O cálculo desta variável é dispendioso, então ela está disponível apenas quando o sistema `UNIV_DEBUG` é definido no momento da construção do servidor.

* [`Innodb_buffer_pool_pages_misc`](server-status-variables.html#statvar_Innodb_buffer_pool_pages_misc)

  O número de [pages](glossary.html#glos_page "page") no `InnoDB` [Buffer Pool](glossary.html#glos_buffer_pool "buffer pool") que estão ocupadas porque foram alocadas para overhead administrativo, como [row locks](glossary.html#glos_row_lock "row lock") ou o [adaptive hash index](glossary.html#glos_adaptive_hash_index "adaptive hash index"). Este valor também pode ser calculado como [`Innodb_buffer_pool_pages_total`](server-status-variables.html#statvar_Innodb_buffer_pool_pages_total) − [`Innodb_buffer_pool_pages_free`](server-status-variables.html#statvar_Innodb_buffer_pool_pages_free) − [`Innodb_buffer_pool_pages_data`](server-status-variables.html#statvar_Innodb_buffer_pool_pages_data). Ao usar [tabelas compressed](glossary.html#glos_compressed_table "compressed table"), [`Innodb_buffer_pool_pages_misc`](server-status-variables.html#statvar_Innodb_buffer_pool_pages_misc) pode relatar um valor fora dos limites (Bug #59550).

* [`Innodb_buffer_pool_pages_total`](server-status-variables.html#statvar_Innodb_buffer_pool_pages_total)

  O tamanho total do `InnoDB` [Buffer Pool](glossary.html#glos_buffer_pool "buffer pool"), em [pages](glossary.html#glos_page "page"). Ao usar [tabelas compressed](glossary.html#glos_compressed_table "compressed table"), o valor [`Innodb_buffer_pool_pages_data`](server-status-variables.html#statvar_Innodb_buffer_pool_pages_data) relatado pode ser maior que [`Innodb_buffer_pool_pages_total`](server-status-variables.html#statvar_Innodb_buffer_pool_pages_total) (Bug #59550).

* [`Innodb_buffer_pool_read_ahead`](server-status-variables.html#statvar_Innodb_buffer_pool_read_ahead)

  O número de [pages](glossary.html#glos_page "page") lidas no `InnoDB` [Buffer Pool](glossary.html#glos_buffer_pool "buffer pool") pelo Thread de background de [read-ahead](glossary.html#glos_read_ahead "read-ahead").

* [`Innodb_buffer_pool_read_ahead_evicted`](server-status-variables.html#statvar_Innodb_buffer_pool_read_ahead_evicted)

  O número de [pages](glossary.html#glos_page "page") lidas no `InnoDB` [Buffer Pool](glossary.html#glos_buffer_pool "buffer pool") pelo Thread de background de [read-ahead](glossary.html#glos_read_ahead "read-ahead") que foram subsequentemente [evicted](glossary.html#glos_eviction "eviction") sem terem sido acessadas por Queries.

* [`Innodb_buffer_pool_read_ahead_rnd`](server-status-variables.html#statvar_Innodb_buffer_pool_read_ahead_rnd)

  O número de read-aheads “aleatórios” iniciados pelo `InnoDB`. Isso acontece quando uma Query faz scan de uma grande porção de uma tabela, mas em ordem aleatória.

* [`Innodb_buffer_pool_read_requests`](server-status-variables.html#statvar_Innodb_buffer_pool_read_requests)

  O número de requisições de leitura lógicas.

* [`Innodb_buffer_pool_reads`](server-status-variables.html#statvar_Innodb_buffer_pool_reads)

  O número de leituras lógicas que o `InnoDB` não conseguiu satisfazer a partir do [Buffer Pool](glossary.html#glos_buffer_pool "buffer pool") e teve que ler diretamente do disco.

* [`Innodb_buffer_pool_resize_status`](server-status-variables.html#statvar_Innodb_buffer_pool_resize_status)

  O status de uma operação para redimensionar o `InnoDB` [Buffer Pool](glossary.html#glos_buffer_pool "buffer pool") dinamicamente, acionada pela definição dinâmica do parâmetro [`innodb_buffer_pool_size`](innodb-parameters.html#sysvar_innodb_buffer_pool_size). O parâmetro [`innodb_buffer_pool_size`](innodb-parameters.html#sysvar_innodb_buffer_pool_size) é dinâmico, o que permite redimensionar o Buffer Pool sem reiniciar o servidor. Consulte [Configuring InnoDB Buffer Pool Size Online](innodb-buffer-pool-resize.html#innodb-buffer-pool-online-resize "Configuring InnoDB Buffer Pool Size Online") para informações relacionadas.

* [`Innodb_buffer_pool_wait_free`](server-status-variables.html#statvar_Innodb_buffer_pool_wait_free)

  Normalmente, os writes para o `InnoDB` [Buffer Pool](glossary.html#glos_buffer_pool "buffer pool") acontecem em background. Quando o `InnoDB` precisa ler ou criar uma [page](glossary.html#glos_page "page") e nenhuma page clean está disponível, o `InnoDB` faz flush de algumas [dirty pages](glossary.html#glos_dirty_page "dirty page") primeiro e espera que essa operação termine. Este contador conta as instâncias desses waits. Se [`innodb_buffer_pool_size`](innodb-parameters.html#sysvar_innodb_buffer_pool_size) foi definido corretamente, este valor deve ser pequeno.

* [`Innodb_buffer_pool_write_requests`](server-status-variables.html#statvar_Innodb_buffer_pool_write_requests)

  O número de writes realizados no `InnoDB` [Buffer Pool](glossary.html#glos_buffer_pool "buffer pool").

* [`Innodb_data_fsyncs`](server-status-variables.html#statvar_Innodb_data_fsyncs)

  O número de operações `fsync()` até o momento. A frequência das chamadas `fsync()` é influenciada pela configuração da opção [`innodb_flush_method`](innodb-parameters.html#sysvar_innodb_flush_method).

* [`Innodb_data_pending_fsyncs`](server-status-variables.html#statvar_Innodb_data_pending_fsyncs)

  O número atual de operações `fsync()` pendentes. A frequência das chamadas `fsync()` é influenciada pela configuração da opção [`innodb_flush_method`](innodb-parameters.html#sysvar_innodb_flush_method).

* [`Innodb_data_pending_reads`](server-status-variables.html#statvar_Innodb_data_pending_reads)

  O número atual de reads pendentes.

* [`Innodb_data_pending_writes`](server-status-variables.html#statvar_Innodb_data_pending_writes)

  O número atual de writes pendentes.

* [`Innodb_data_read`](server-status-variables.html#statvar_Innodb_data_read)

  A quantidade de dados lidos desde o início do servidor (em bytes).

* [`Innodb_data_reads`](server-status-variables.html#statvar_Innodb_data_reads)

  O número total de reads de dados (reads de arquivo OS).

* [`Innodb_data_writes`](server-status-variables.html#statvar_Innodb_data_writes)

  O número total de writes de dados.

* [`Innodb_data_written`](server-status-variables.html#statvar_Innodb_data_written)

  A quantidade de dados escritos até o momento, em bytes.

* [`Innodb_dblwr_pages_written`](server-status-variables.html#statvar_Innodb_dblwr_pages_written)

  O número de [pages](glossary.html#glos_page "page") que foram escritas no [doublewrite buffer](glossary.html#glos_doublewrite_buffer "doublewrite buffer"). Consulte [Seção 14.12.1, “InnoDB Disk I/O”](innodb-disk-io.html "14.12.1 InnoDB Disk I/O").

* [`Innodb_dblwr_writes`](server-status-variables.html#statvar_Innodb_dblwr_writes)

  O número de operações doublewrite que foram realizadas. Consulte [Seção 14.12.1, “InnoDB Disk I/O”](innodb-disk-io.html "14.12.1 InnoDB Disk I/O").

* [`Innodb_have_atomic_builtins`](server-status-variables.html#statvar_Innodb_have_atomic_builtins)

  Indica se o servidor foi construído com [atomic instructions](glossary.html#glos_atomic_instruction "atomic instruction").

* [`Innodb_log_waits`](server-status-variables.html#statvar_Innodb_log_waits)

  O número de vezes que o [log buffer](glossary.html#glos_log_buffer "log buffer") estava muito pequeno e um [wait](glossary.html#glos_wait "wait") foi necessário para que ele fosse [flushed](glossary.html#glos_flush "flush") antes de continuar.

* [`Innodb_log_write_requests`](server-status-variables.html#statvar_Innodb_log_write_requests)

  O número de requisições de write para o [redo log](glossary.html#glos_redo_log "redo log") do `InnoDB`.

* [`Innodb_log_writes`](server-status-variables.html#statvar_Innodb_log_writes)

  O número de writes físicos para o arquivo [redo log](glossary.html#glos_redo_log "redo log") do `InnoDB`.

* [`Innodb_num_open_files`](server-status-variables.html#statvar_Innodb_num_open_files)

  O número de arquivos que o `InnoDB` mantém abertos atualmente.

* [`Innodb_os_log_fsyncs`](server-status-variables.html#statvar_Innodb_os_log_fsyncs)

  O número de writes `fsync()` realizados nos arquivos [redo log](glossary.html#glos_redo_log "redo log") do `InnoDB`.

* [`Innodb_os_log_pending_fsyncs`](server-status-variables.html#statvar_Innodb_os_log_pending_fsyncs)

  O número de operações `fsync()` pendentes para os arquivos [redo log](glossary.html#glos_redo_log "redo log") do `InnoDB`.

* [`Innodb_os_log_pending_writes`](server-status-variables.html#statvar_Innodb_os_log_pending_writes)

  O número de writes pendentes para os arquivos [redo log](glossary.html#glos_redo_log "redo log") do `InnoDB`.

* [`Innodb_os_log_written`](server-status-variables.html#statvar_Innodb_os_log_written)

  O número de bytes escritos nos arquivos [redo log](glossary.html#glos_redo_log "redo log") do `InnoDB`.

* [`Innodb_page_size`](server-status-variables.html#statvar_Innodb_page_size)

  Tamanho da page do `InnoDB` (padrão 16KB). Muitos valores são contados em pages; o tamanho da page permite que sejam facilmente convertidos em bytes.

* [`Innodb_pages_created`](server-status-variables.html#statvar_Innodb_pages_created)

  O número de pages criadas por operações em tabelas `InnoDB`.

* [`Innodb_pages_read`](server-status-variables.html#statvar_Innodb_pages_read)

  O número de pages lidas do Buffer Pool `InnoDB` por operações em tabelas `InnoDB`.

* [`Innodb_pages_written`](server-status-variables.html#statvar_Innodb_pages_written)

  O número de pages escritas por operações em tabelas `InnoDB`.

* [`Innodb_row_lock_current_waits`](server-status-variables.html#statvar_Innodb_row_lock_current_waits)

  O número de [row locks](glossary.html#glos_row_lock "row lock") atualmente aguardados por operações em tabelas `InnoDB`.

* [`Innodb_row_lock_time`](server-status-variables.html#statvar_Innodb_row_lock_time)

  O tempo total gasto na aquisição de [row locks](glossary.html#glos_row_lock "row lock") para tabelas `InnoDB`, em milissegundos.

* [`Innodb_row_lock_time_avg`](server-status-variables.html#statvar_Innodb_row_lock_time_avg)

  O tempo médio para adquirir um [row lock](glossary.html#glos_row_lock "row lock") para tabelas `InnoDB`, em milissegundos.

* [`Innodb_row_lock_time_max`](server-status-variables.html#statvar_Innodb_row_lock_time_max)

  O tempo máximo para adquirir um [row lock](glossary.html#glos_row_lock "row lock") para tabelas `InnoDB`, em milissegundos.

* [`Innodb_row_lock_waits`](server-status-variables.html#statvar_Innodb_row_lock_waits)

  O número de vezes que operações em tabelas `InnoDB` tiveram que esperar por um [row lock](glossary.html#glos_row_lock "row lock").

* [`Innodb_rows_deleted`](server-status-variables.html#statvar_Innodb_rows_deleted)

  O número de rows deletadas de tabelas `InnoDB`.

* [`Innodb_rows_inserted`](server-status-variables.html#statvar_Innodb_rows_inserted)

  O número de rows inseridas nas tabelas `InnoDB`.

* [`Innodb_rows_read`](server-status-variables.html#statvar_Innodb_rows_read)

  O número de rows lidas nas tabelas `InnoDB`.

* [`Innodb_rows_updated`](server-status-variables.html#statvar_Innodb_rows_updated)

  O número estimado de rows atualizadas nas tabelas `InnoDB`.

  Note

  Este valor não se destina a ser 100% preciso. Para um resultado preciso (mas mais custoso), use [`ROW_COUNT()`](information-functions.html#function_row-count).

* [`Innodb_truncated_status_writes`](server-status-variables.html#statvar_Innodb_truncated_status_writes)

  O número de vezes que a saída da instrução `SHOW ENGINE INNODB STATUS` foi truncada.

* [`Key_blocks_not_flushed`](server-status-variables.html#statvar_Key_blocks_not_flushed)

  O número de key blocks no `MyISAM` Key Cache que foram alterados, mas ainda não foram flushed para o disco.

* [`Key_blocks_unused`](server-status-variables.html#statvar_Key_blocks_unused)

  O número de blocks não utilizados no `MyISAM` Key Cache. Você pode usar este valor para determinar quanto do Key Cache está em uso; veja a discussão sobre [`key_buffer_size`](server-system-variables.html#sysvar_key_buffer_size) na [Seção 5.1.7, “Server System Variables”](server-system-variables.html "5.1.7 Server System Variables").

* [`Key_blocks_used`](server-status-variables.html#statvar_Key_blocks_used)

  O número de blocks usados no `MyISAM` Key Cache. Este valor é uma marca d'água alta (high-water mark) que indica o número máximo de blocks que já estiveram em uso ao mesmo tempo.

* [`Key_read_requests`](server-status-variables.html#statvar_Key_read_requests)

  O número de requisições para ler um key block do `MyISAM` Key Cache.

* [`Key_reads`](server-status-variables.html#statvar_Key_reads)

  O número de leituras físicas de um key block do disco para o `MyISAM` Key Cache. Se [`Key_reads`](server-status-variables.html#statvar_Key_reads) for grande, então o valor do seu [`key_buffer_size`](server-system-variables.html#sysvar_key_buffer_size) provavelmente é muito pequeno. A taxa de Cache Miss (falha no cache) pode ser calculada como [`Key_reads`](server-status-variables.html#statvar_Key_reads)/[`Key_read_requests`](server-status-variables.html#statvar_Key_read_requests).

* [`Key_write_requests`](server-status-variables.html#statvar_Key_write_requests)

  O número de requisições para escrever um key block no `MyISAM` Key Cache.

* [`Key_writes`](server-status-variables.html#statvar_Key_writes)

  O número de writes físicos de um key block do `MyISAM` Key Cache para o disco.

* [`Last_query_cost`](server-status-variables.html#statvar_Last_query_cost)

  O custo total da última Query compilada, conforme calculado pelo Query optimizer. Isso é útil para comparar o custo de diferentes planos de Query para a mesma Query. O valor padrão de 0 significa que nenhuma Query foi compilada ainda. [`Last_query_cost`](server-status-variables.html#statvar_Last_query_cost) tem escopo de session.

  `Last_query_cost` pode ser calculado com precisão apenas para Queries simples, "flat", mas não para Queries complexas, como aquelas que contêm subqueries ou [`UNION`](union.html "13.2.9.3 UNION Clause"). Para estas últimas, o valor é definido como 0.

* [`Last_query_partial_plans`](server-status-variables.html#statvar_Last_query_partial_plans)

  O número de iterações que o Query optimizer fez na construção do plano de execução para a Query anterior.

  `Last_query_partial_plans` tem escopo de session.

* [`Locked_connects`](server-status-variables.html#statvar_Locked_connects)

  O número de tentativas de conexão a contas de usuário locked. Para obter informações sobre Lock e unlock de contas, consulte [Seção 6.2.15, “Account Locking”](account-locking.html "6.2.15 Account Locking").

* [`Max_execution_time_exceeded`](server-status-variables.html#statvar_Max_execution_time_exceeded)

  O número de instruções [`SELECT`](select.html "13.2.9 SELECT Statement") para as quais o timeout de execução foi excedido.

* [`Max_execution_time_set`](server-status-variables.html#statvar_Max_execution_time_set)

  O número de instruções [`SELECT`](select.html "13.2.9 SELECT Statement") para as quais um timeout de execução diferente de zero foi definido. Isso inclui instruções que incluem uma dica de otimização [`MAX_EXECUTION_TIME`](optimizer-hints.html#optimizer-hints-execution-time "Statement Execution Time Optimizer Hints") diferente de zero, e instruções que não incluem tal dica, mas são executadas enquanto o timeout indicado pela variável de sistema [`max_execution_time`](server-system-variables.html#sysvar_max_execution_time) for diferente de zero.

* [`Max_execution_time_set_failed`](server-status-variables.html#statvar_Max_execution_time_set_failed)

  O número de instruções [`SELECT`](select.html "13.2.9 SELECT Statement") para as quais a tentativa de definir um timeout de execução falhou.

* [`Max_used_connections`](server-status-variables.html#statvar_Max_used_connections)

  O número máximo de conexões que foram usadas simultaneamente desde o início do servidor.

* [`Max_used_connections_time`](server-status-variables.html#statvar_Max_used_connections_time)

  O momento em que [`Max_used_connections`](server-status-variables.html#statvar_Max_used_connections) atingiu seu valor atual.

* [`Not_flushed_delayed_rows`](server-status-variables.html#statvar_Not_flushed_delayed_rows)

  Esta variável de status está depreciada (porque inserções `DELAYED` não são suportadas); espere que ela seja removida em um lançamento futuro.

* [`mecab_charset`](server-status-variables.html#statvar_mecab_charset)

  O character set atualmente usado pelo plugin MeCab full-text parser. Para informações relacionadas, consulte [Seção 12.9.9, “MeCab Full-Text Parser Plugin”](fulltext-search-mecab.html "12.9.9 MeCab Full-Text Parser Plugin").

* [`Ongoing_anonymous_transaction_count`](server-status-variables.html#statvar_Ongoing_anonymous_transaction_count)

  Mostra o número de transações ongoing que foram marcadas como anonymous. Isso pode ser usado para garantir que não haja mais transações esperando para serem processadas.

* [`Ongoing_anonymous_gtid_violating_transaction_count`](server-status-variables.html#statvar_Ongoing_anonymous_gtid_violating_transaction_count)

  Esta variável de status está disponível apenas em builds de debug. Mostra o número de transações ongoing que usam [`gtid_next=ANONYMOUS`](replication-options-gtids.html#sysvar_gtid_next) e que violam a consistência GTID.

* [`Ongoing_automatic_gtid_violating_transaction_count`](server-status-variables.html#statvar_Ongoing_automatic_gtid_violating_transaction_count)

  Esta variável de status está disponível apenas em builds de debug. Mostra o número de transações ongoing que usam [`gtid_next=AUTOMATIC`](replication-options-gtids.html#sysvar_gtid_next) e que violam a consistência GTID.

* [`Open_files`](server-status-variables.html#statvar_Open_files)

  O número de arquivos que estão abertos. Esta contagem inclui arquivos regulares abertos pelo servidor. Não inclui outros tipos de arquivos, como sockets ou pipes. Além disso, a contagem não inclui arquivos que os storage engines abrem usando suas próprias funções internas, em vez de solicitar que o nível do servidor o faça.

* [`Open_streams`](server-status-variables.html#statvar_Open_streams)

  O número de streams que estão abertos (usados principalmente para logging).

* [`Open_table_definitions`](server-status-variables.html#statvar_Open_table_definitions)

  O número de arquivos `.frm` em cache.

* [`Open_tables`](server-status-variables.html#statvar_Open_tables)

  O número de tabelas que estão abertas.

* [`Opened_files`](server-status-variables.html#statvar_Opened_files)

  O número de arquivos que foram abertos com `my_open()` (uma função da biblioteca `mysys`). Partes do servidor que abrem arquivos sem usar esta função não incrementam a contagem.

* [`Opened_table_definitions`](server-status-variables.html#statvar_Opened_table_definitions)

  O número de arquivos `.frm` que foram armazenados em cache.

* [`Opened_tables`](server-status-variables.html#statvar_Opened_tables)

  O número de tabelas que foram abertas. Se [`Opened_tables`](server-status-variables.html#statvar_Opened_tables) for grande, seu valor [`table_open_cache`](server-system-variables.html#sysvar_table_open_cache) provavelmente é muito pequeno.

* `Performance_schema_xxx`

  As variáveis de status do Performance Schema estão listadas em [Seção 25.16, “Performance Schema Status Variables”](performance-schema-status-variables.html "25.16 Performance Schema Status Variables"). Estas variáveis fornecem informações sobre instrumentation que não pôde ser carregada ou criada devido a restrições de memória.

* [`Prepared_stmt_count`](server-status-variables.html#statvar_Prepared_stmt_count)

  O número atual de prepared statements. (O número máximo de statements é dado pela variável de sistema [`max_prepared_stmt_count`](server-system-variables.html#sysvar_max_prepared_stmt_count)).

* [`Qcache_free_blocks`](server-status-variables.html#statvar_Qcache_free_blocks)

  O número de free memory blocks no Query Cache.

  Note

  O Query Cache está depreciado a partir do MySQL 5.7.20 e foi removido no MySQL 8.0. A depreciação inclui [`Qcache_free_blocks`](server-status-variables.html#statvar_Qcache_free_blocks).

* [`Qcache_free_memory`](server-status-variables.html#statvar_Qcache_free_memory)

  A quantidade de free memory para o Query Cache.

  Note

  O Query Cache está depreciado a partir do MySQL 5.7.20 e foi removido no MySQL 8.0. A depreciação inclui [`Qcache_free_memory`](server-status-variables.html#statvar_Qcache_free_memory).

* [`Qcache_hits`](server-status-variables.html#statvar_Qcache_hits)

  O número de hits no Query Cache.

  A discussão no início desta seção indica como relacionar esta variável de status de contagem de statement com outras variáveis semelhantes.

  Note

  O Query Cache está depreciado a partir do MySQL 5.7.20 e foi removido no MySQL 8.0. A depreciação inclui [`Qcache_hits`](server-status-variables.html#statvar_Qcache_hits).

* [`Qcache_inserts`](server-status-variables.html#statvar_Qcache_inserts)

  O número de Queries adicionadas ao Query Cache.

  Note

  O Query Cache está depreciado a partir do MySQL 5.7.20 e foi removido no MySQL 8.0. A depreciação inclui [`Qcache_inserts`](server-status-variables.html#statvar_Qcache_inserts).

* [`Qcache_lowmem_prunes`](server-status-variables.html#statvar_Qcache_lowmem_prunes)

  O número de Queries que foram deletadas do Query Cache devido à low memory.

  Note

  O Query Cache está depreciado a partir do MySQL 5.7.20 e foi removido no MySQL 8.0. A depreciação inclui [`Qcache_lowmem_prunes`](server-status-variables.html#statvar_Qcache_lowmem_prunes).

* [`Qcache_not_cached`](server-status-variables.html#statvar_Qcache_not_cached)

  O número de Queries não armazenadas em cache (não cacheable ou não armazenadas em cache devido à configuração [`query_cache_type`](server-system-variables.html#sysvar_query_cache_type)).

  Note

  O Query Cache está depreciado a partir do MySQL 5.7.20 e foi removido no MySQL 8.0. A depreciação inclui [`Qcache_not_cached`](server-status-variables.html#statvar_Qcache_not_cached).

* [`Qcache_queries_in_cache`](server-status-variables.html#statvar_Qcache_queries_in_cache)

  O número de Queries registradas no Query Cache.

  Note

  O Query Cache está depreciado a partir do MySQL 5.7.20 e foi removido no MySQL 8.0. A depreciação inclui [`Qcache_queries_in_cache`](server-status-variables.html#statvar_Qcache_queries_in_cache).

* [`Qcache_total_blocks`](server-status-variables.html#statvar_Qcache_total_blocks)

  O número total de blocks no Query Cache.

  Note

  O Query Cache está depreciado a partir do MySQL 5.7.20 e foi removido no MySQL 8.0. A depreciação inclui [`Qcache_total_blocks`](server-status-variables.html#statvar_Qcache_total_blocks).

* [`Queries`](server-status-variables.html#statvar_Queries)

  O número de statements executados pelo servidor. Esta variável inclui statements executados dentro de stored programs, diferente da variável [`Questions`](server-status-variables.html#statvar_Questions). Não conta comandos `COM_PING` ou `COM_STATISTICS`.

  A discussão no início desta seção indica como relacionar esta variável de status de contagem de statement com outras variáveis semelhantes.

* [`Questions`](server-status-variables.html#statvar_Questions)

  O número de statements executados pelo servidor. Isso inclui apenas statements enviados ao servidor por clientes e não statements executados dentro de stored programs, diferente da variável [`Queries`](server-status-variables.html#statvar_Queries). Esta variável não conta comandos `COM_PING`, `COM_STATISTICS`, `COM_STMT_PREPARE`, `COM_STMT_CLOSE` ou `COM_STMT_RESET`.

  A discussão no início desta seção indica como relacionar esta variável de status de contagem de statement com outras variáveis semelhantes.

* [`Rpl_semi_sync_master_clients`](server-status-variables.html#statvar_Rpl_semi_sync_master_clients)

  O número de replicas semisynchronous.

  Esta variável está disponível apenas se o plugin de replicação semisynchronous do lado da source estiver instalado.

* [`Rpl_semi_sync_master_net_avg_wait_time`](server-status-variables.html#statvar_Rpl_semi_sync_master_net_avg_wait_time)

  O tempo médio em microssegundos que a source esperou por uma resposta da replica. Esta variável está depreciada, sempre `0`; espere que ela seja removida em uma versão futura.

  Esta variável está disponível apenas se o plugin de replicação semisynchronous do lado da source estiver instalado.

* [`Rpl_semi_sync_master_net_wait_time`](server-status-variables.html#statvar_Rpl_semi_sync_master_net_wait_time)

  O tempo total em microssegundos que a source esperou pelas respostas da replica. Esta variável está depreciada e é sempre `0`; espere que ela seja removida em uma versão futura.

  Esta variável está disponível apenas se o plugin de replicação semisynchronous do lado da source estiver instalado.

* [`Rpl_semi_sync_master_net_waits`](server-status-variables.html#statvar_Rpl_semi_sync_master_net_waits)

  O número total de vezes que a source esperou pelas respostas da replica.

  Esta variável está disponível apenas se o plugin de replicação semisynchronous do lado da source estiver instalado.

* [`Rpl_semi_sync_master_no_times`](server-status-variables.html#statvar_Rpl_semi_sync_master_no_times)

  O número de vezes que a source desativou a replicação semisynchronous.

  Esta variável está disponível apenas se o plugin de replicação semisynchronous do lado da source estiver instalado.

* [`Rpl_semi_sync_master_no_tx`](server-status-variables.html#statvar_Rpl_semi_sync_master_no_tx)

  O número de commits que não foram confirmados com sucesso por uma replica.

  Esta variável está disponível apenas se o plugin de replicação semisynchronous do lado da source estiver instalado.

* [`Rpl_semi_sync_master_status`](server-status-variables.html#statvar_Rpl_semi_sync_master_status)

  Se a replicação semisynchronous está operacional na source atualmente. O valor é `ON` se o plugin foi habilitado e uma confirmação de commit ocorreu. É `OFF` se o plugin não estiver habilitado ou se a source voltou à replicação assíncrona devido a um timeout de confirmação de commit.

  Esta variável está disponível apenas se o plugin de replicação semisynchronous do lado da source estiver instalado.

* [`Rpl_semi_sync_master_timefunc_failures`](server-status-variables.html#statvar_Rpl_semi_sync_master_timefunc_failures)

  O número de vezes que a source falhou ao chamar time functions como `gettimeofday()`.

  Esta variável está disponível apenas se o plugin de replicação semisynchronous do lado da source estiver instalado.

* [`Rpl_semi_sync_master_tx_avg_wait_time`](server-status-variables.html#statvar_Rpl_semi_sync_master_tx_avg_wait_time)

  O tempo médio em microssegundos que a source esperou por cada transação.

  Esta variável está disponível apenas se o plugin de replicação semisynchronous do lado da source estiver instalado.

* [`Rpl_semi_sync_master_tx_wait_time`](server-status-variables.html#statvar_Rpl_semi_sync_master_tx_wait_time)

  O tempo total em microssegundos que a source esperou por transações.

  Esta variável está disponível apenas se o plugin de replicação semisynchronous do lado da source estiver instalado.

* [`Rpl_semi_sync_master_tx_waits`](server-status-variables.html#statvar_Rpl_semi_sync_master_tx_waits)

  O número total de vezes que a source esperou por transações.

  Esta variável está disponível apenas se o plugin de replicação semisynchronous do lado da source estiver instalado.

* [`Rpl_semi_sync_master_wait_pos_backtraverse`](server-status-variables.html#statvar_Rpl_semi_sync_master_wait_pos_backtraverse)

  O número total de vezes que a source esperou por um evento com coordenadas binárias mais baixas do que eventos aguardados anteriormente. Isso pode ocorrer quando a ordem em que as transações começam a esperar por uma resposta é diferente da ordem em que seus binary log events são escritos.

  Esta variável está disponível apenas se o plugin de replicação semisynchronous do lado da source estiver instalado.

* [`Rpl_semi_sync_master_wait_sessions`](server-status-variables.html#statvar_Rpl_semi_sync_master_wait_sessions)

  O número de sessions atualmente esperando por respostas da replica.

  Esta variável está disponível apenas se o plugin de replicação semisynchronous do lado da source estiver instalado.

* [`Rpl_semi_sync_master_yes_tx`](server-status-variables.html#statvar_Rpl_semi_sync_master_yes_tx)

  O número de commits que foram confirmados com sucesso por uma replica.

  Esta variável está disponível apenas se o plugin de replicação semisynchronous do lado da source estiver instalado.

* [`Rpl_semi_sync_slave_status`](server-status-variables.html#statvar_Rpl_semi_sync_slave_status)

  Se a replicação semisynchronous está operacional na replica atualmente. O valor é `ON` se o plugin foi habilitado e o Thread I/O da replica está em execução, `OFF` caso contrário.

  Esta variável está disponível apenas se o plugin de replicação semisynchronous do lado da replica estiver instalado.

* [`Rsa_public_key`](server-status-variables.html#statvar_Rsa_public_key)

  Esta variável está disponível se o MySQL foi compilado usando OpenSSL (consulte [Seção 6.3.4, “SSL Library-Dependent Capabilities”](ssl-libraries.html "6.3.4 SSL Library-Dependent Capabilities")). Seu valor é a chave pública usada pelo plugin de autenticação `sha256_password` para troca de senha baseada em par de chaves RSA. O valor só é diferente de vazio se o servidor inicializar com sucesso as chaves private e public nos arquivos nomeados pelas variáveis de sistema [`sha256_password_private_key_path`](server-system-variables.html#sysvar_sha256_password_private_key_path) e [`sha256_password_public_key_path`](server-system-variables.html#sysvar_sha256_password_public_key_path). O valor de [`Rsa_public_key`](server-status-variables.html#statvar_Rsa_public_key) vem deste último arquivo.

  Para obter informações sobre `sha256_password`, consulte [Seção 6.4.1.5, “SHA-256 Pluggable Authentication”](sha256-pluggable-authentication.html "6.4.1.5 SHA-256 Pluggable Authentication").

* [`Select_full_join`](server-status-variables.html#statvar_Select_full_join)

  O número de JOINs que realizam table scans porque não usam Index. Se este valor não for 0, você deve verificar cuidadosamente os Index de suas tabelas.

* [`Select_full_range_join`](server-status-variables.html#statvar_Select_full_range_join)

  O número de JOINs que usaram uma range search em uma tabela de referência.

* [`Select_range`](server-status-variables.html#statvar_Select_range)

  O número de JOINs que usaram ranges na primeira tabela. Normalmente, isso não é um problema crítico, mesmo que o valor seja bastante grande.

* [`Select_range_check`](server-status-variables.html#statvar_Select_range_check)

  O número de JOINs sem keys que verificam o uso de key após cada row. Se este valor não for 0, você deve verificar cuidadosamente os Index de suas tabelas.

* [`Select_scan`](server-status-variables.html#statvar_Select_scan)

  O número de JOINs que fizeram um full scan da primeira tabela.

* [`Slave_heartbeat_period`](server-status-variables.html#statvar_Slave_heartbeat_period)

  Mostra o intervalo do replication heartbeat (em segundos) em uma replica de replicação.

  Esta variável é afetada pelo valor da variável de sistema [`show_compatibility_56`](server-system-variables.html#sysvar_show_compatibility_56). Para detalhes, consulte [Effect of show_compatibility_56 on Slave Status Variables](server-system-variables.html#sysvar_show_compatibility_56_slave_status "Effect of show_compatibility_56 on Slave Status Variables").

  Note

  Esta variável mostra apenas o status do canal de replicação padrão. Para monitorar qualquer canal de replicação, use a coluna `HEARTBEAT_INTERVAL` na tabela [`replication_connection_configuration`](performance-schema-replication-connection-configuration-table.html "25.12.11.1 The replication_connection_configuration Table") para o canal de replicação. [`Slave_heartbeat_period`](server-status-variables.html#statvar_Slave_heartbeat_period) está depreciada e será removida no MySQL 8.0.

* [`Slave_last_heartbeat`](server-status-variables.html#statvar_Slave_last_heartbeat)

  Mostra quando o sinal de heartbeat mais recente foi recebido por uma replica, como um valor [`TIMESTAMP`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types").

  Esta variável é afetada pelo valor da variável de sistema [`show_compatibility_56`](server-system-variables.html#sysvar_show_compatibility_56). Para detalhes, consulte [Effect of show_compatibility_56 on Slave Status Variables](server-system-variables.html#sysvar_show_compatibility_56_slave_status "Effect of show_compatibility_56 on Slave Status Variables").

  Note

  Esta variável mostra apenas o status do canal de replicação padrão. Para monitorar qualquer canal de replicação, use a coluna `LAST_HEARTBEAT_TIMESTAMP` na tabela [`replication_connection_status`](performance-schema-replication-connection-status-table.html "25.12.11.2 The replication_connection_status Table") para o canal de replicação. [`Slave_last_heartbeat`](server-status-variables.html#statvar_Slave_last_heartbeat) está depreciada e será removida no MySQL 8.0.

* [`Slave_open_temp_tables`](server-status-variables.html#statvar_Slave_open_temp_tables)

  O número de tabelas temporárias que o SQL Thread da replica tem abertas atualmente. Se o valor for maior que zero, não é seguro desligar a replica; consulte [Seção 16.4.1.29, “Replication and Temporary Tables”](replication-features-temptables.html "16.4.1.29 Replication and Temporary Tables"). Esta variável reporta a contagem total de tabelas temporárias abertas para *todos* os canais de replicação.

* [`Slave_received_heartbeats`](server-status-variables.html#statvar_Slave_received_heartbeats)

  Este contador incrementa a cada replication heartbeat recebido por uma replica de replicação desde a última vez que a replica foi reiniciada ou resetada, ou uma instrução [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") foi emitida.

  Esta variável é afetada pelo valor da variável de sistema [`show_compatibility_56`](server-system-variables.html#sysvar_show_compatibility_56). Para detalhes, consulte [Effect of show_compatibility_56 on Slave Status Variables](server-system-variables.html#sysvar_show_compatibility_56_slave_status "Effect of show_compatibility_56 on Slave Status Variables").

  Note

  Esta variável mostra apenas o status do canal de replicação padrão. Para monitorar qualquer canal de replicação, use a coluna `COUNT_RECEIVED_HEARTBEATS` na tabela [`replication_connection_status`](performance-schema-replication-connection-status-table.html "25.12.11.2 The replication_connection_status Table") para o canal de replicação. [`Slave_received_heartbeats`](server-status-variables.html#statvar_Slave_received_heartbeats) está depreciada e será removida no MySQL 8.0.

* [`Slave_retried_transactions`](server-status-variables.html#statvar_Slave_retried_transactions)

  O número total de vezes desde a inicialização que o SQL Thread da replica de replicação tentou novamente (retried) transações.

  Esta variável é afetada pelo valor da variável de sistema [`show_compatibility_56`](server-system-variables.html#sysvar_show_compatibility_56). Para detalhes, consulte [Effect of show_compatibility_56 on Slave Status Variables](server-system-variables.html#sysvar_show_compatibility_56_slave_status "Effect of show_compatibility_56 on Slave Status Variables").

  Note

  Esta variável mostra apenas o status do canal de replicação padrão. Para monitorar qualquer canal de replicação, use a coluna `COUNT_TRANSACTIONS_RETRIES` na tabela [`replication_applier_status`](performance-schema-replication-applier-status-table.html "25.12.11.4 The replication_applier_status Table") para o canal de replicação. [`Slave_retried_transactions`](server-status-variables.html#statvar_Slave_retried_transactions) está depreciada e será removida no MySQL 8.0.

* [`Slave_rows_last_search_algorithm_used`](server-status-variables.html#statvar_Slave_rows_last_search_algorithm_used)

  O search algorithm que foi usado mais recentemente por esta replica para localizar rows para replicação baseada em row. O resultado mostra se a replica usou Index, um table scan ou hashing como o search algorithm para a última transação executada em qualquer canal.

  O método usado depende da configuração da variável de sistema [`slave_rows_search_algorithms`](replication-options-replica.html#sysvar_slave_rows_search_algorithms) e das keys disponíveis na tabela relevante.

  Esta variável está disponível apenas para builds de debug do MySQL.

* [`Slave_running`](server-status-variables.html#statvar_Slave_running)

  Isto é `ON` se este servidor for uma replica que está conectada a uma source de replicação, e tanto o I/O Thread quanto o SQL Thread estiverem em execução; caso contrário, é `OFF`.

  Esta variável é afetada pelo valor da variável de sistema [`show_compatibility_56`](server-system-variables.html#sysvar_show_compatibility_56). Para detalhes, consulte [Effect of show_compatibility_56 on Slave Status Variables](server-system-variables.html#sysvar_show_compatibility_56_slave_status "Effect of show_compatibility_56 on Slave Status Variables").

  Note

  Esta variável mostra apenas o status do canal de replicação padrão. Para monitorar qualquer canal de replicação, use a coluna `SERVICE_STATE` na tabela [`replication_applier_status`](performance-schema-replication-applier-status-table.html "25.12.11.4 The replication_applier_status Table") ou [`replication_connection_status`](performance-schema-replication-connection-status-table.html "25.12.11.2 The replication_connection_status Table") para o canal de replicação. [`Slave_running`](server-status-variables.html#statvar_Slave_running) está depreciada e será removida no MySQL 8.0.

* [`Slow_launch_threads`](server-status-variables.html#statvar_Slow_launch_threads)

  O número de Threads cuja criação demorou mais do que [`slow_launch_time`](server-system-variables.html#sysvar_slow_launch_time) segundos.

  Esta variável não é significativa no servidor embedded (`libmysqld`) e a partir do MySQL 5.7.2 não é mais visível dentro do servidor embedded.

* [`Slow_queries`](server-status-variables.html#statvar_Slow_queries)

  O número de Queries que demoraram mais do que [`long_query_time`](server-system-variables.html#sysvar_long_query_time) segundos. Este contador incrementa independentemente de o slow Query log estar habilitado. Para obter informações sobre esse log, consulte [Seção 5.4.5, “The Slow Query Log”](slow-query-log.html "5.4.5 The Slow Query Log").

* [`Sort_merge_passes`](server-status-variables.html#statvar_Sort_merge_passes)

  O número de merge passes que o algoritmo de sort precisou fazer. Se este valor for grande, você deve considerar aumentar o valor da variável de sistema [`sort_buffer_size`](server-system-variables.html#sysvar_sort_buffer_size).

* [`Sort_range`](server-status-variables.html#statvar_Sort_range)

  O número de sorts que foram feitos usando ranges.

* [`Sort_rows`](server-status-variables.html#statvar_Sort_rows)

  O número de rows sortidas.

* [`Sort_scan`](server-status-variables.html#statvar_Sort_scan)

  O número de sorts que foram feitos por scanning da tabela.

* [`Ssl_accept_renegotiates`](server-status-variables.html#statvar_Ssl_accept_renegotiates)

  O número de negotiates necessários para estabelecer a conexão.

* [`Ssl_accepts`](server-status-variables.html#statvar_Ssl_accepts)

  O número de conexões SSL aceitas.

* [`Ssl_callback_cache_hits`](server-status-variables.html#statvar_Ssl_callback_cache_hits)

  O número de hits do callback cache.

* [`Ssl_cipher`](server-status-variables.html#statvar_Ssl_cipher)

  O cipher de encryption atual (vazio para conexões não encrypted).

* [`Ssl_cipher_list`](server-status-variables.html#statvar_Ssl_cipher_list)

  A lista de ciphers SSL possíveis (vazio para conexões não SSL).

* [`Ssl_client_connects`](server-status-variables.html#statvar_Ssl_client_connects)

  O número de tentativas de conexão SSL a uma source habilitada para SSL.

* [`Ssl_connect_renegotiates`](server-status-variables.html#statvar_Ssl_connect_renegotiates)

  O número de negotiates necessários para estabelecer a conexão a uma source habilitada para SSL.

* [`Ssl_ctx_verify_depth`](server-status-variables.html#statvar_Ssl_ctx_verify_depth)

  A profundidade de verificação do contexto SSL (quantos certificates na cadeia são testados).

* [`Ssl_ctx_verify_mode`](server-status-variables.html#statvar_Ssl_ctx_verify_mode)

  O modo de verificação do contexto SSL.

* [`Ssl_default_timeout`](server-status-variables.html#statvar_Ssl_default_timeout)

  O timeout SSL padrão.

* [`Ssl_finished_accepts`](server-status-variables.html#statvar_Ssl_finished_accepts)

  O número de conexões SSL bem-sucedidas ao servidor.

* [`Ssl_finished_connects`](server-status-variables.html#statvar_Ssl_finished_connects)

  O número de conexões de replica bem-sucedidas a uma source habilitada para SSL.

* [`Ssl_server_not_after`](server-status-variables.html#statvar_Ssl_server_not_after)

  A última data para a qual o certificate SSL é válido. Para verificar as informações de expiração do certificate SSL, use esta instrução:

  ```sql
  mysql> SHOW STATUS LIKE 'Ssl_server_not%';
  +-----------------------+--------------------------+
  | Variable_name         | Value                    |
  +-----------------------+--------------------------+
  | Ssl_server_not_after  | Apr 28 14:16:39 2025 GMT |
  | Ssl_server_not_before | May  1 14:16:39 2015 GMT |
  +-----------------------+--------------------------+
  ```

* [`Ssl_server_not_before`](server-status-variables.html#statvar_Ssl_server_not_before)

  A primeira data para a qual o certificate SSL é válido.

* [`Ssl_session_cache_hits`](server-status-variables.html#statvar_Ssl_session_cache_hits)

  O número de hits no SSL session cache.

* [`Ssl_session_cache_misses`](server-status-variables.html#statvar_Ssl_session_cache_misses)

  O número de misses no SSL session cache.

* [`Ssl_session_cache_mode`](server-status-variables.html#statvar_Ssl_session_cache_mode)

  O modo do SSL session cache.

* [`Ssl_session_cache_overflows`](server-status-variables.html#statvar_Ssl_session_cache_overflows)

  O número de overflows do SSL session cache.

* [`Ssl_session_cache_size`](server-status-variables.html#statvar_Ssl_session_cache_size)

  O tamanho do SSL session cache.

* [`Ssl_session_cache_timeouts`](server-status-variables.html#statvar_Ssl_session_cache_timeouts)

  O número de timeouts do SSL session cache.

* [`Ssl_sessions_reused`](server-status-variables.html#statvar_Ssl_sessions_reused)

  Isto é igual a 0 se TLS não foi usado na session MySQL atual, ou se uma session TLS não foi reutilizada; caso contrário, é igual a 1.

  `Ssl_sessions_reused` tem escopo de session.

* [`Ssl_used_session_cache_entries`](server-status-variables.html#statvar_Ssl_used_session_cache_entries)

  Quantas entradas do SSL session cache foram usadas.

* [`Ssl_verify_depth`](server-status-variables.html#statvar_Ssl_verify_depth)

  A profundidade de verificação para conexões SSL de replicação.

* [`Ssl_verify_mode`](server-status-variables.html#statvar_Ssl_verify_mode)

  O modo de verificação usado pelo servidor para uma conexão que usa SSL. O valor é um bitmask; os bits são definidos no arquivo header `openssl/ssl.h`:

  ```sql
  # define SSL_VERIFY_NONE                 0x00
  # define SSL_VERIFY_PEER                 0x01
  # define SSL_VERIFY_FAIL_IF_NO_PEER_CERT 0x02
  # define SSL_VERIFY_CLIENT_ONCE          0x04
  ```

  `SSL_VERIFY_PEER` indica que o servidor solicita um client certificate. Se o cliente fornecer um, o servidor realiza a verificação e procede somente se a verificação for bem-sucedida. `SSL_VERIFY_CLIENT_ONCE` indica que uma requisição para o client certificate é feita apenas no handshake inicial.

* [`Ssl_version`](server-status-variables.html#statvar_Ssl_version)

  A versão do protocolo SSL da conexão (por exemplo, TLSv1). Se a conexão não estiver encrypted, o valor será vazio.

* [`Table_locks_immediate`](server-status-variables.html#statvar_Table_locks_immediate)

  O número de vezes que uma requisição para um table Lock pôde ser concedida imediatamente.

* [`Table_locks_waited`](server-status-variables.html#statvar_Table_locks_waited)

  O número de vezes que uma requisição para um table Lock não pôde ser concedida imediatamente e foi necessário um wait. Se este valor for alto e você tiver problemas de performance, você deve primeiro otimizar suas Queries e, em seguida, dividir sua tabela ou tabelas ou usar replicação.

* [`Table_open_cache_hits`](server-status-variables.html#statvar_Table_open_cache_hits)

  O número de hits para lookups no cache de tabelas abertas.

* [`Table_open_cache_misses`](server-status-variables.html#statvar_Table_open_cache_misses)

  O número de misses para lookups no cache de tabelas abertas.

* [`Table_open_cache_overflows`](server-status-variables.html#statvar_Table_open_cache_overflows)

  O número de overflows para o cache de tabelas abertas. Este é o número de vezes que, após uma tabela ser aberta ou fechada, uma instância de cache tem uma entrada não utilizada e o tamanho da instância é maior que [`table_open_cache`](server-system-variables.html#sysvar_table_open_cache) / [`table_open_cache_instances`](server-system-variables.html#sysvar_table_open_cache_instances).

* [`Tc_log_max_pages_used`](server-status-variables.html#statvar_Tc_log_max_pages_used)

  Para a implementação memory-mapped do log que é usada pelo [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") quando ele atua como o transaction coordinator para recovery de transações XA internas, esta variável indica o maior número de pages usadas para o log desde o início do servidor. Se o produto de [`Tc_log_max_pages_used`](server-status-variables.html#statvar_Tc_log_max_pages_used) e [`Tc_log_page_size`](server-status-variables.html#statvar_Tc_log_page_size) for sempre significativamente menor do que o tamanho do log, o tamanho é maior do que o necessário e pode ser reduzido. (O tamanho é definido pela opção [`--log-tc-size`](server-options.html#option_mysqld_log-tc-size). Esta variável não é usada: não é necessária para binary log-based recovery, e o método de recovery log memory-mapped não é usado a menos que o número de storage engines capazes de two-phase commit e que suportam transações XA seja maior que um. (`InnoDB` é o único engine aplicável).

* [`Tc_log_page_size`](server-status-variables.html#statvar_Tc_log_page_size)

  O tamanho da page usado para a implementação memory-mapped do log de recovery XA. O valor padrão é determinado usando `getpagesize()`. Esta variável não é usada pelas mesmas razões descritas para [`Tc_log_max_pages_used`](server-status-variables.html#statvar_Tc_log_max_pages_used).

* [`Tc_log_page_waits`](server-status-variables.html#statvar_Tc_log_page_waits)

  Para a implementação memory-mapped do recovery log, esta variável incrementa cada vez que o servidor não conseguiu fazer commit de uma transação e teve que esperar por uma page free no log. Se este valor for grande, você pode querer aumentar o tamanho do log (com a opção [`--log-tc-size`](server-options-binary-log.html#option_mysqld_log-tc-size)). Para binary log-based recovery, esta variável incrementa cada vez que o binary log não pode ser fechado porque há two-phase commits em progresso. (A operação de close espera até que todas essas transações sejam concluídas).

* [`Threads_cached`](server-status-variables.html#statvar_Threads_cached)

  O número de Threads no Thread Cache.

  Esta variável não é significativa no servidor embedded (`libmysqld`) e a partir do MySQL 5.7.2 não é mais visível dentro do servidor embedded.

* [`Threads_connected`](server-status-variables.html#statvar_Threads_connected)

  O número de conexões abertas atualmente.

* [`Threads_created`](server-status-variables.html#statvar_Threads_created)

  O número de Threads criadas para lidar com conexões. Se [`Threads_created`](server-status-variables.html#statvar_Threads_created) for grande, você pode querer aumentar o valor [`thread_cache_size`](server-system-variables.html#sysvar_thread_cache_size). A taxa de Cache Miss pode ser calculada como [`Threads_created`](server-status-variables.html#statvar_Threads_created)/[`Connections`](server-status-variables.html#statvar_Connections).

* [`Threads_running`](server-status-variables.html#statvar_Threads_running)

  O número de Threads que não estão sleeping.

* [`Uptime`](server-status-variables.html#statvar_Uptime)

  O número de segundos que o servidor está ativo.

* [`Uptime_since_flush_status`](server-status-variables.html#statvar_Uptime_since_flush_status)

  O número de segundos desde a instrução `FLUSH STATUS` mais recente.