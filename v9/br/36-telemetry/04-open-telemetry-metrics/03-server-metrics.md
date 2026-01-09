### 35.4.3 Métricas do Servidor

As seguintes métricas de servidor são registradas por padrão:

* Métricas mysql.stats
* Métricas mysql.stats.com
* Métricas mysql.stats.connection
* Métricas mysql.perf_schema
* Métricas mysql.stats.handler
* Métricas mysql.stats.myisam
* Métricas mysql.stats.ssl
* Métricas mysql.inno
* Métricas mysql.inno.buffer_pool
* Métricas mysql.inno.data
* Métricas mysql.x
* Métricas mysql.x.stmt
* Métricas mysql.mle

O número máximo de instrumentos de métricas que podem ser criados é definido por `performance_schema_max_metric_classes`.

#### Métricas mysql.stats

**Tabela 35.3 Métricas mysql.stats**

 COUNTER</code> </p></td> <td><p> The number of execution units that are currently in use by the secondary engine. </p></td> </tr><tr> <td><p> <code>secondary_engine_open_files</code> </p></td> <td><p> <a class="link" href="server-status-variables.html#statvar_Secondary_engine_open_files"><code>Secondary_engine_open_files</code></a> </p></td> <td><p> <code>ASYNC COUNTER</code> </p></td> <td><p> The number of files that are open in the secondary engine. </p></td> </tr><tr> <td><p> <code>secondary_engine_open_streams</code> </p></td> <td><p> <a class="link" href="server-status-variables.html#statvar_Secondary_engine_open_streams"><code>Secondary_engine_open_streams</code></a> </p></td> <td><p> <code>ASYNC COUNTER</code> </p></td> <td><p> The number of streams that are open in the secondary engine. </p></td> </tr><tr> <td><p> <code>secondary_engine_open_tables</code> </p></td> <td><p> <a class="link" href="server-status-variables.html#statvar_Secondary_engine_open_tables"><code>Secondary_engine_open_tables</code></a> </p></td> <td><p> <code>ASYNC GAUGE COUNTER</code> </p></td> <td><p> The number of table definitions that are open in the secondary engine. </p></td> </tr><tr> <td><p> <code>secondary_engine_open_tables_disk</code> </p></td> <td><p> <a class="link" href="server-status-variables.html#statvar_Secondary_engine_open_tables_disk"><code>Secondary_engine_open_tables_disk</code></a> </p></td> <td><p> <code>ASYNC GAUGE COUNTER</code> </p></td> <td><p> The number of table definitions that are open and stored on disk in the secondary engine. </p></td> </tr><tr> <td><p> <code>secondary_engine_queries</code> </p></td> <td><p> <a class="link" href="server-status-variables.html#statvar_Secondary_engine_queries"><code>Secondary_engine_queries</code></a> </p></td> <td><p> <code>ASYNC COUNTER</code> </p></td> <td><p> The number of statements executed by the secondary engine. </p></td> </tr><tr> <td><p> <code>secondary_engine_questions</code> </p></td> <td><p> <a class="link" href="server-status-variables.html#statvar_Secondary_engine_questions"><code>Secondary_engine_questions</code></a> </p></td> <td><p> <code>ASYNC COUNTER</code> </p></td> <td><p> The number of statements sent to the secondary engine by clients. </p></td> </tr><tr> <td><p> <code>server_connection_memory</code> </p></td> <td><p> <a class="link" href="server-status-variables.html#statvar_Server_connection_memory"><code>Server_connection_memory</code></a> </p></td> <td><p> <code>ASYNC GAUGE COUNTER</code> </p></td> <td><p> The memory used by all user connections to the server. </p></td> </tr><tr> <td><p> <code>server_connection_memory_used</code> </p></td> <td><p> <a class="link" href="server-status-variables.html#statvar_Server_connection_memory_used"><code>Server_connection_memory_used</code></a> </p></td> <td><p> <code>ASYNC GAUGE COUNTER</code> </p></td> <td><p> The memory used by all user connections to the server, excluding the memory used by the server itself. </p></td> </tr><tr> <td><p> <code>server_connection_memory_used_by_server</code> </p></td> <td><p> <a class="link" href="server-status-variables.html#

#### Métricos mysql.stats.com

Os métricos `mysql.stats.com` correspondem às variáveis de contador de declarações `Com_xxx`. Consulte a Seção 7.1.10, “Variáveis de Status do Servidor” e Com\_xxxpara obter mais informações.

Os métricos `mysql.stats.com` são nomeados com base nessas variáveis, sem o prefixo `Com_`. Por exemplo, o métrico `select` corresponde à variável de contador de declaração `Com_select`.

Esses métricos são do tipo OTEL `CONTADOR ASSÍNCRONO` e registram o número de vezes (INTEIRO) que a declaração de comando correspondente foi executada.

#### Métricos mysql.stats.connection

Os métricos `mysql.stats.connection` correspondem às variáveis de status `Connections` e `Connection_XXX`.

**Tabela 35.4 Métricos mysql.stats.connection**

<table frame="void"><col width="20%"/><col width="20%"/><col width="20%"/><col width="40%"/><thead><tr> <th>Nome</th> <th>Variável Fonte</th> <th>Tipo de OTEL</th> <th>Descrição</th> </tr></thead><tbody><tr> <td><p> <code>total</code> </p></td> <td><p> <a class="link" href="server-status-variables.html#statvar_Connections"><code>Conexões</code></a> </p></td> <td><p> <code>CONTADOR ASSÍNCRONO</code> </p></td> <td><p> Contagem cumulativa de conexões criadas. </p></td> </tr><tr> <td><p> <code>errors_accept</code> </p></td> <td><p> <a class="link" href="server-status-variables.html#statvar_Connection_errors_accept"><code>Connection_errors_accept</code></a> </p></td> <td><p> <code>CONTADOR ASSÍNCRONO</code> </p></td> <td><p> Número de erros que ocorreram durante chamadas ao <code>accept()</code> na porta de escuta. </p></td> </tr><tr> <td><p> <code>errors_internal</code> </p></td> <td><p> <a class="link" href="server-status-variables.html#statvar_Connection_errors_internal"><code>Connection_errors_internal</code></a> </p></td> <td><p> <code>CONTADOR ASSÍNCRONO</code> </p></td> <td><p> Número de conexões recusadas devido a erros internos no servidor, como falha em iniciar um novo thread ou condição de memória insuficiente. </p></td> </tr><tr> <td><p> <code>errors_max_connections</code> </p></td> <td><p> <a class="link" href="server-status-variables.html#statvar_Connection_errors_max_connections"><code>Connection_errors_max_connections</code></a> </p></td> <td><p> <code>CONTADOR ASSÍNCRONO</code> </p></td> <td><p> Número de conexões recusadas porque o limite de conexões max_connections do servidor foi atingido. </p></td> </tr><tr> <td><p> <code>errors_peer_address</code> </p></td> <td><p> <a class="link" href="server-status-variables.html#statvar_Connection_errors_peer_address"><code>Connection_errors_peer_address</code></a> </p></td> <td><p> <code>CONTADOR ASSÍNCRONO</code> </p></td> <td><p> Número de erros que ocorreram ao buscar endereços IP de clientes conectados. </p></td> </tr><tr> <td><p> <code>errors_select</code> </p></td> <td><p> <a class="link" href="server-status-variables.html#statvar_Connection_errors_select"><code>Connection_errors_select</code></a> </p></td> <td><p> <code>CONTADOR ASSÍNCRONO</code> </p></td> <td><p> Número de erros que ocorreram durante chamadas ao <code>select()</code> ou <code>poll()</code> na porta de escuta. </p></td> </tr><tr> <td><p> <code>errors_tcpwrap</code> </p></td> <td><p> <a class="link" href="server-status-variables.html#statvar_Connection_errors_tcpwrap"><code>Connection_errors_tcpwrap</code></a> </p></td> <td><p> <code>CONTADOR ASSÍNCRONO</code> </p></td> <td><p> Número de conexões recusadas pela biblioteca <code>libwrap</code>. </p></td> </tr></tbody></table>

#### mysql.perf_schema Metricas

O `mysql.perf_schema` corresponde às variáveis de status `Performance_schema_XXX`. Veja a Seção 29.7, “Monitoramento de Status do Schema de Desempenho”.

**Tabela 35.5 mysql.perf_schema Metricas**

 threads Table"><code>threads</code></a> table. </p></td> </tr><tr> <td><p> <code>transaction_lost</code> </p></td> <td><p> <a class="link" href="performance-schema-status-variables.html#statvar_Performance_schema_transaction_lost"><code>Performance_schema_transaction_lost</code></a> </p></td> <td><p> <code>ASYNC COUNTER</code> </p></td> <td><p> The number of transactions for which statistics were lost. </p></td> </tr><tr> <td><p> <code>user_lost</code> </p></td> <td><p> <a class="link" href="performance-schema-status-variables.html#statvar_Performance_schema_user_lost"><code>Performance_schema_user_lost</code></a> </p></td> <td><p> <code>ASYNC COUNTER</code> </p></td> <td><p> How many user instruments could not be loaded. </p></td> </tr><tr> <td><p> <code>user_lock_stat_lost</code> </p></td> <td><p> <a class="link" href="performance-schema-status-variables.html#statvar_Performance_schema_user_lock_stat_lost"><code>Performance_schema_user_lock_stat_lost</code></a> </p></td> <td><p> <code>ASYNC COUNTER</code> </p></td> <td><p> The number of user locks for which statistics were lost. </p></td> </tr><tr> <td><p> <code>value_lost</code> </p></td> <td><p> <a class="link" href="performance-schema-status-variables.html#statvar_Performance_schema_value_lost"><code>Performance_schema_value_lost</code></a> </p></td> <td><p> <code>ASYNC COUNTER</code> </p></td> <td><p> The number of value instruments for which statistics were lost. </p></td> </tr><tr> <td><p> <code>value_lock_stat_lost</code> </p></td> <td><p> <a class="link" href="performance-schema-status-variables.html#statvar_Performance_schema_value_lock_stat_lost"><code>Performance_schema_value_lock_stat_lost</code></a> </p></td> <td><p> <code>ASYNC COUNTER</code> </p></td> <td><p> The number of value locks for which statistics were lost. </p></td> </tr><tr> <td><p> <code>version_lost</code> </p></td> <td><p> <a class="link" href="performance-schema-status-variables.html#statvar_Performance_schema_version_lost"><code>Performance_schema_version_lost</code></a> </p></td> <td><p> <code>ASYNC COUNTER</code> </p></td> <td><p> The number of version instruments for which statistics were lost. </p></td> </tr><tr> <td><p> <code>version_lock_stat_lost</code> </p></td> <td><p> <a class="link" href="performance-schema-status-variables.html#statvar_Performance_schema_version_lock_stat_lost"><code>Performance_schema_version_lock_stat_lost</code></a> </p></td> <td><p> <code>ASYNC COUNTER</code> </p></td> <td><p> The number of version locks for which statistics were lost. </p></td> </tr><tr> <td><p> <code>volatile_lost</code> </p></td> <td><p> <a class="link" href="performance-schema-status-variables.html#statvar_Performance_schema_volatile_lost"><code>Performance_schema_volatile_lost</code></a> </p></td> <td><p> <code>ASYNC COUNTER</code> </p></td> <td><p> The number of volatile instruments for which statistics were lost. </p></td> </tr><tr> <td><p> <code>volatile_lock_stat_lost</code> </p></td> <td><p> <a class="link" href="performance-schema-status-variables.html#statvar_Performance_schema_volatile_lock_

#### mysql.stats.handler Metricas

As métricas `mysql.stats.handler` correspondem às variáveis de status `Handler_XXX`.

**Tabela 35.6 mysql.perf\_schema Metricas**

<table>
  <tr>
    <th>Nome</th>
    <th>Variável Fonte</th>
    <th>Tipo de OTEL</th>
    <th>Descrição</th>
  </tr>
  <tr>
    <td><p> <code>commit</code></p></td>
    <td><p> <a class="link" href="server-status-variables.html#statvar_Handler_commit"><code>Handler_commit</code></a></p></td>
    <td><p> <code>COUNTER ASYNC</code></p></td>
    <td><p> O número de declarações internas COMMIT. </p></td>
  </tr>
  <tr>
    <td><p> <code>delete</code></p></td>
    <td><p> <a class="link" href="server-status-variables.html#statvar_Handler_delete"><code>Handler_delete</code></a></p></td>
    <td><p> <code>COUNTER ASYNC</code></p></td>
    <td><p> O número de vezes que linhas foram excluídas de tabelas. </p></td>
  </tr>
  <tr>
    <td><p> <code>discover</code></p></td>
    <td><p> <a class="link" href="mysql-cluster-options-variables.html#statvar_Handler_discover"><code>Handler_discover</code></a></p></td>
    <td><p> <code>COUNTER ASYNC</code></p></td>
    <td><p> O número de vezes que tabelas foram descobertas. </p></td>
  </tr>
  <tr>
    <td><p> <code>external_lock</code></p></td>
    <td><p> <a class="link" href="server-status-variables.html#statvar_Handler_external_lock"><code>Handler_external_lock</code></a></p></td>
    <td><p> <code>COUNTER ASYNC</code></p></td>
    <td><p> O servidor incrementa essa variável para cada chamada à sua função external_lock(), que geralmente ocorre no início e no final do acesso a uma instância de tabela. </p></td>
  </tr>
  <tr>
    <td><p> <code>mrr_init</code></p></td>
    <td><p> <a class="link" href="server-status-variables.html#statvar_Handler_mrr_init"><code>Handler_mrr_init</code></a></p></td>
    <td><p> <code>COUNTER ASYNC</code></p></td>
    <td><p> O número de vezes que o servidor usa a própria implementação de leitura de intervalo multipla do motor de armazenamento para o acesso a tabelas. </p></td>
  </tr>
  <tr>
    <td><p> <code>prepare</code></p></td>
    <td><p> <a class="link" href="server-status-variables.html#statvar_Handler_prepare"><code>Handler_prepare</code></a></p></td>
    <td><p> <code>COUNTER ASYNC</code></p></td>
    <td><p> Um contador para a fase de preparação de operações de dois estágios de compromisso. </p></td>
  </tr>
  <tr>
    <td><p> <code>read_first</code></p></td>
    <td><p> <a class="link" href="server-status-variables.html#statvar_Handler_read_first"><code>Handler_read_first</code></a></p></td>
    <td><p> <code>COUNTER ASYNC</code></p></td>
    <td><p> O número de vezes que a primeira entrada em um índice foi lida. </p></td>
  </tr>
  <tr>
    <td><p> <code>read_key</code></p></td>
    <td><p> <a class="link" href="server-status-variables.html#statvar_Handler_read_key"><code>Handler_read_key</code></a></p></td>
    <td><p> <code>COUNTER ASYNC</code></p></td>
    <td><p> O número de solicitações para ler uma linha com base em uma chave. </p></td>
  </tr>
  <tr>
    <td><p> <code>read_last</code></p></td>
    <td><p> <a class="link" href="

#### mysql.stats.myisam Metricas

**Tabela 35.7 mysql.perf_schema Metricas**

<table frame="void"><col width="20%"/><col width="20%"/><col width="20%"/><col width="40%"/><thead><tr> <th>Nome</th> <th>Variável Fonte</th> <th>Tipo de OTEL</th> <th>Descrição</th> </tr></thead><tbody><tr> <td><p> <code>key_blocks_not_flushed</code> </p></td> <td><p> <a class="link" href="server-status-variables.html#statvar_Key_blocks_not_flushed"><code>Key_blocks_not_flushed</code></a> </p></td> <td><p> <code>COUNTER ASÍNTONO</code> </p></td> <td><p> O número de blocos de chave no cache de chave MyISAM que foram alterados, mas ainda não foram descarregados no disco. </p></td> </tr><tr> <td><p> <code>key_blocks_unused</code> </p></td> <td><p> <a class="link" href="server-status-variables.html#statvar_Key_blocks_unused"><code>Key_blocks_unused</code></a> </p></td> <td><p> <code>COUNTER ASÍNTONO</code> </p></td> <td><p> O número de blocos não utilizados no cache de chave MyISAM. </p></td> </tr><tr> <td><p> <code>key_blocks_used</code> </p></td> <td><p> <a class="link" href="server-status-variables.html#statvar_Key_blocks_used"><code>Key_blocks_used</code></a> </p></td> <td><p> <code>COUNTER ASÍNTONO</code> </p></td> <td><p> O número de blocos utilizados no cache de chave MyISAM. </p></td> </tr><tr> <td><p> <code>key_read_requests</code> </p></td> <td><p> <a class="link" href="server-status-variables.html#statvar_Key_read_requests"><code>Key_read_requests</code></a> </p></td> <td><p> <code>COUNTER ASÍNTONO</code> </p></td> <td><p> O número de solicitações para ler um bloco de chave do cache de chave MyISAM. </p></td> </tr><tr> <td><p> <code>key_reads</code> </p></td> <td><p> <a class="link" href="server-status-variables.html#statvar_Key_reads"><code>Key_reads</code></a> </p></td> <td><p> <code>COUNTER ASÍNTONO</code> </p></td> <td><p> O número de leituras físicas de um bloco de chave do disco para o cache de chave MyISAM. </p></td> </tr><tr> <td><p> <code>key_write_requests</code> </p></td> <td><p> <a class="link" href="server-status-variables.html#statvar_Key_write_requests"><code>Key_write_requests</code></a> </p></td> <td><p> <code>COUNTER ASÍNTONO</code> </p></td> <td><p> O número de solicitações para escrever um bloco de chave no cache de chave MyISAM. </p></td> </tr><tr> <td><p> <code>key_writes</code> </p></td> <td><p> <a class="link" href="server-status-variables.html#statvar_Key_writes"><code>Key_writes</code></a> </p></td> <td><p> <code>COUNTER ASÍNTONO</code> </p></td> <td><p> O número de escritas físicas de um bloco de chave do cache de chave MyISAM para o disco. </p></td> </tr><tr> <td><p> <code>key_read_count</code> </p></td> <td><p> <a class="link" href="server-status-variables.html#statvar_Key_read_count"><code>Key_read_count</code></a> </p></td> <td><p> <code>COUNTER ASÍNTONO</code> </p></td> <td><p> O número total de leituras de blocos de chave no cache de

#### Métricas mysql.stats.ssl

**Tabela 35.8 Métricas mysql.stats.ssl**

<table>
  <tr>
    <th>Nome</th>
    <th>Variável Fonte</th>
    <th>Tipo de OTEL</th>
    <th>Descrição</th>
  </tr>
  <tr>
    <td><p> <code>client_connects</code> </p></td>
    <td><p> <a class="link" href="server-status-variables.html#statvar_Ssl_client_connects"><code>Ssl_client_connects</code></a> </p></td>
    <td><p> <code>CONTADOR ASSÍNCRONO</code> </p></td>
    <td><p> O número de tentativas de conexão SSL para um servidor de origem de replicação habilitado para SSL. </p></td>
  </tr>
  <tr>
    <td><p> <code>connect_renegotiates</code> </p></td>
    <td><p> <a class="link" href="server-status-variables.html#statvar_Ssl_connect_renegotiates"><code>Ssl_connect_renegotiates</code></a> </p></td>
    <td><p> <code>CONTADOR ASSÍNCRONO</code> </p></td>
    <td><p> O número de negociações necessárias para estabelecer a conexão com um servidor de origem de replicação habilitado para SSL. </p></td>
  </tr>
  <tr>
    <td><p> <code>finished_accepts</code> </p></td>
    <td><p> <a class="link" href="server-status-variables.html#statvar_Ssl_finished_accepts"><code>Ssl_finished_accepts</code></a> </p></td>
    <td><p> <code>CONTADOR ASSÍNCRONO</code> </p></td>
    <td><p> O número de conexões SSL concluídas com sucesso no servidor. </p></td>
  </tr>
  <tr>
    <td><p> <code>finished_connects</code> </p></td>
    <td><p> <a class="link" href="server-status-variables.html#statvar_Ssl_finished_connects"><code>Ssl_finished_connects</code></a> </p></td>
    <td><p> <code>CONTADOR ASSÍNCRONO</code> </p></td>
    <td><p> O número de conexões de replica concluídas com sucesso no servidor. </p></td>
  </tr>
  <tr>
    <td><p> <code>session_cache_hits</code> </p></td>
    <td><p> <a class="link" href="server-status-variables.html#statvar_Ssl_session_cache_hits"><code>Ssl_session_cache_hits</code></a> </p></td>
    <td><p> <code>CONTADOR ASSÍNCRONO</code> </p></td>
    <td><p> O número de acertos na cache de sessão SSL. </p></td>
  </tr>
  <tr>
    <td><p> <code>session_cache_misses</code> </p></td>
    <td><p> <a class="link" href="server-status-variables.html#statvar_Ssl_session_cache_misses"><code>Ssl_session_cache_misses</code></a> </p></td>
    <td><p> <code>CONTADOR ASSÍNCRONO</code> </p></td>
    <td><p> O número de falhas na cache de sessão SSL. </p></td>
  </tr>
  <tr>
    <td><p> <code>session_cache_overflows</code> </p></td>
    <td><p> <a class="link" href="server-status-variables.html#statvar_Ssl_session_cache_overflows"><code>Ssl_session_cache_overflows</code></a> </p></td>
    <td><p> <code>CONTADOR ASSÍNCRONO</code> </p></td>
    <td><p> O número de transbordamentos na cache de sessão SSL. </p></td>
  </tr>
  <tr>
    <td><p> <code>session_cache_size</code> </p></td>
    <td><p> <a class="link" href="server-status-variables.html#statvar_Ssl_session_cache_size"><code>Ssl_session_cache_size</code></a> </p></td>
    <td><p> <code>CONTADOR ASSÍNCRONO</code> </p>

#### mysql.inno Metrics

**Tabela 35.9 mysql.inno Metrics**

<table frame="void"><col width="20%"/><col width="20%"/><col width="40%"/><col width="20%"/><thead><tr> <th>Nome</th> <th>Variável de Parâmetro</th> <th>TIPO</th> <th>Descrição</th> </tr></thead><tbody><tr> <td><p> <code>dblwr_pages_written</code> </p></td> <td><p> <a class="link" href="server-status-variables.html#statvar_Innodb_dblwr_pages_written"><code>Innodb_dblwr_pages_written</code></a> </p></td> <td><p> <code>ASYNC COUNTER</code> </p></td> <td><p> Número de páginas escritas para operações de doublewrite </p></td> </tr><tr> <td><p> <code>dblwr_writes</code> </p></td> <td><p> <a class="link" href="server-status-variables.html#statvar_Innodb_dblwr_writes"><code>Innodb_dblwr_writes</code></a> </p></td> <td><p> <code>ASYNC COUNTER</code> </p></td> <td><p> Número de operações de doublewrite realizadas </p></td> </tr><tr> <td><p> <code>redo_log_logical_size</code> </p></td> <td><p> <a class="link" href="server-status-variables.html#statvar_Innodb_redo_log_logical_size"><code>Innodb_redo_log_logical_size</code></a> </p></td> <td><p> <code>ASYNC GAUGE COUNTER</code> </p></td> <td><p> Tamanho em bytes da faixa de LSN do dado de log redo em uso. </p></td> </tr><tr> <td><p> <code>redo_log_physical_size</code> </p></td> <td><p> <a class="link" href="server-status-variables.html#statvar_Innodb_redo_log_physical_size"><code>Innodb_redo_log_physical_size</code></a> </p></td> <td><p> <code>ASYNC GAUGE COUNTER</code> </p></td> <td><p> Espaço em bytes atualmente consumido por todos os arquivos de log redo no disco, excluindo os arquivos de log redo em branco. </p></td> </tr><tr> <td><p> <code>redo_log_capacity_resized</code> </p></td> <td><p> <a class="link" href="server-status-variables.html#statvar_Innodb_redo_log_capacity_resized"><code>Innodb_redo_log_capacity_resized</code></a> </p></td> <td><p> <code>ASYNC GAUGE COUNTER</code> </p></td> <td><p> Capacidade de log redo em bytes após a última operação de resize de capacidade concluída. </p></td> </tr><tr> <td><p> <code>log_waits</code> </p></td> <td><p> <a class="link" href="server-status-variables.html#statvar_Innodb_log_waits"><code>Innodb_log_waits</code></a> </p></td> <td><p> <code>ASYNC COUNTER</code> </p></td> <td><p> Número de aguardar devido a pequena buffer de log </p></td> </tr><tr> <td><p> <code>log_write_requests</code> </p></td> <td><p> <a class="link" href="server-status-variables.html#statvar_Innodb_log_write_requests"><code>Innodb_log_write_requests</code></a> </p></td> <td><p> <code>ASYNC COUNTER</code> </p></td> <td><p> Número de solicitações de escrita no log </p></td> </tr><tr> <td><p> <code>log_writes</code> </p></td> <td><p> <a class="link" href="server-status-variables.html#statvar_Innodb_log_writes"><code>Innodb_log_writes</code></a> </p></td> <td><p> <code>ASYNC COUNTER</code> </p></td> <td><p> Número de escritas físicas

#### Métricas mysql.inno.buffer_pool

**Tabela 35.10 Métricas mysql.inno.buffer_pool**

<table>
  <tr>
    <th>Nome</th>
    <th>Variável Fonte</th>
    <th>Tipo de OTEL</th>
    <th>Descrição</th>
  </tr>
  <tr>
    <td><p> <code>pages_data</code> </p></td>
    <td><p> <a class="link" href="server-status-variables.html#statvar_Innodb_buffer_pool_pages_data"><code>Innodb_buffer_pool_pages_data</code></a> </p></td>
    <td><p> <code>ASYNC GAUGE COUNTER</code> </p></td>
    <td><p> Páginas de dados. </p></td>
  </tr>
  <tr>
    <td><p> <code>bytes_data</code> </p></td>
    <td><p> <a class="link" href="server-status-variables.html#statvar_Innodb_buffer_pool_bytes_data"><code>Innodb_buffer_pool_bytes_data</code></a> </p></td>
    <td><p> <code>ASYNC GAUGE COUNTER</code> </p></td>
    <td><p> Bytes de dados. </p></td>
  </tr>
  <tr>
    <td><p> <code>pages_dirty</code> </p></td>
    <td><p> <a class="link" href="server-status-variables.html#statvar_Innodb_buffer_pool_pages_dirty"><code>Innodb_buffer_pool_pages_dirty</code></a> </p></td>
    <td><p> <code>ASYNC GAUGE COUNTER</code> </p></td>
    <td><p> Páginas atualmente sujas. </p></td>
  </tr>
  <tr>
    <td><p> <code>bytes_dirty</code> </p></td>
    <td><p> <a class="link" href="server-status-variables.html#statvar_Innodb_buffer_pool_bytes_dirty"><code>Innodb_buffer_pool_bytes_dirty</code></a> </p></td>
    <td><p> <code>ASYNC GAUGE COUNTER</code> </p></td>
    <td><p> Bytes atualmente sujos </p></td>
  </tr>
  <tr>
    <td><p> <code>pages_flushed</code> </p></td>
    <td><p> <a class="link" href="server-status-variables.html#statvar_Innodb_buffer_pool_pages_flushed"><code>Innodb_buffer_pool_pages_flushed</code></a> </p></td>
    <td><p> <code>ASYNC COUNTER</code> </p></td>
    <td><p> Número de solicitações para descartar páginas do buffer pool InnoDB. </p></td>
  </tr>
  <tr>
    <td><p> <code>pages_free</code> </p></td>
    <td><p> <a class="link" href="server-status-variables.html#statvar_Innodb_buffer_pool_pages_free"><code>Innodb_buffer_pool_pages_free</code></a> </p></td>
    <td><p> <code>ASYNC GAUGE COUNTER</code> </p></td>
    <td><p> Páginas do buffer pool atualmente livres. </p></td>
  </tr>
  <tr>
    <td><p> <code>pages_misc</code> </p></td>
    <td><p> <a class="link" href="server-status-variables.html#statvar_Innodb_buffer_pool_pages_misc"><code>Innodb_buffer_pool_pages_misc</code></a> </p></td>
    <td><p> <code>ASYNC GAUGE COUNTER</code> </p></td>
    <td><p> Páginas do buffer para uso misto, como bloqueios de linha ou índice de hash adaptativo. </p></td>
  </tr>
  <tr>
    <td><p> <code>pages_total</code> </p></td>
    <td><p> <a class="link" href="server-status-variables.html#statvar_Innodb_buffer_pool_pages_total"><code>Innodb_buffer_pool_pages_total</code></a> </p></td>
    <td><p> <code>ASYNC GAUGE COUNTER</code> </p>

#### Métricas mysql.inno.data

**Tabela 35.11 Métricas mysql.inno.data**

<table frame="void"><col width="20%"/><col width="20%"/><col width="20%"/><col width="40%"/><thead><tr> <th>Nome</th> <th>Variável Fonte</th> <th>TIPO DE OTEL</th> <th>Descrição</th> </tr></thead><tbody><tr> <td><p> <code>fsyncs</code> </p></td> <td><p> <a class="link" href="server-status-variables.html#statvar_Innodb_data_fsyncs"><code>Innodb_data_fsyncs</code></a> </p></td> <td><p> <code>CONTADOR DE FSYNCS ASÍNCRONOS</code> </p></td> <td><p> Número de chamadas de <code>fsync()</code>. </p></td> </tr><tr> <td><p> <code>pending_fsyncs</code> </p></td> <td><p> <a class="link" href="server-status-variables.html#statvar_Innodb_data_pending_fsyncs"><code>Innodb_data_pending_fsyncs</code></a> </p></td> <td><p> <code>CONTADOR DE MEDIDAS ASÍNCRONAS</code> </p></td> <td><p> Número de operações de fsync pendentes. </p></td> </tr><tr> <td><p> <code>pending_reads</code> </p></td> <td><p> <a class="link" href="server-status-variables.html#statvar_Innodb_data_pending_reads"><code>Innodb_data_pending_reads</code></a> </p></td> <td><p> <code>CONTADOR DE MEDIDAS ASÍNCRONAS</code> </p></td> <td><p> Número de leituras pendentes. </p></td> </tr><tr> <td><p> <code>pending_writes</code> </p></td> <td><p> <a class="link" href="server-status-variables.html#statvar_Innodb_data_pending_writes"><code>Innodb_data_pending_writes</code></a> </p></td> <td><p> <code>CONTADOR DE MEDIDAS ASÍNCRONAS</code> </p></td> <td><p> Número de escritas pendentes. </p></td> </tr><tr> <td><p> <code>read</code> </p></td> <td><p> <a class="link" href="server-status-variables.html#statvar_Innodb_data_read"><code>Innodb_data_read</code></a> </p></td> <td><p> <code>CONTADOR ASÍNCRONO</code> </p></td> <td><p> Quantidade de dados lidos em bytes. </p></td> </tr><tr> <td><p> <code>reads</code> </p></td> <td><p> <a class="link" href="server-status-variables.html#statvar_Innodb_data_reads"><code>Innodb_data_reads</code></a> </p></td> <td><p> <code>CONTADOR ASÍNCRONO</code> </p></td> <td><p> Número de leituras iniciadas. </p></td> </tr><tr> <td><p> <code>writes</code> </p></td> <td><p> <a class="link" href="server-status-variables.html#statvar_Innodb_data_writes"><code>Innodb_data_writes</code></a> </p></td> <td><p> <code>CONTADOR ASÍNCRONO</code> </p></td> <td><p> Número de escritas iniciadas. </p></td> </tr><tr> <td><p> <code>written</code> </p></td> <td><p> <a class="link" href="server-status-variables.html#statvar_Innodb_data_written"><code>Innodb_data_written</code></a> </p></td> <td><p> <code>CONTADOR ASÍNCRONO</code> </p></td> <td><p> Quantidade de dados escritos em bytes. </p></td> </tr></tbody></table>

#### Métricos mysql.x

**Tabela 35.12 Métricos mysql.x**

code>prep_rollback</code> </p></td> <td><p> <a class="link" href="x-plugin-status-variables.html#statvar_Mysqlx_prep_rollback"><code>Mysqlx_prep_rollback</code></a> </p></td> <td><p> <code>ASYNC COUNTER</code> </p></td> <td><p> The number of prepared-statement-rollback messages received. </p></td> </tr><tr> <td><p> <code>prep_execute_with_error</code> </p></td> <td><p> <a class="link" href="x-plugin-status-variables.html#statvar_Mysqlx_prep_execute_with_error"><code>Mysqlx_prep_execute_with_error</code></a> </p></td> <td><p> <code>ASYNC COUNTER</code> </p></td> <td><p> The number of prepared-statement-execute-with-error messages received. </p></td> </tr><tr> <td><p> <code>prep_execute_with_warning</code> </p></td> <td><p> <a class="link" href="x-plugin-status-variables.html#statvar_Mysqlx_prep_execute_with_warning"><code>Mysqlx_prep_execute_with_warning</code></a> </p></td> <td><p> <code>ASYNC COUNTER</code> </p></td> <td><p> The number of prepared-statement-execute-with-warning messages received. </p></td> </tr><tr> <td><p> <code>prep_execute_with_notice</code> </p></td> <td><p> <a class="link" href="x-plugin-status-variables.html#statvar_Mysqlx_prep_execute_with_notice"><code>Mysqlx_prep_execute_with_notice</code></a> </p></td> <td><p> <code>ASYNC COUNTER</code> </p></td> <td><p> The number of prepared-statement-execute-with-notice messages received. </p></td> </tr><tr> <td><p> <code>prep_execute_with_error_and_notice</code> </p></td> <td><p> <a class="link" href="x-plugin-status-variables.html#statvar_Mysqlx_prep_execute_with_error_and_notice"><code>Mysqlx_prep_execute_with_error_and_notice</code></a> </p></td> <td><p> <code>ASYNC COUNTER</code> </p></td> <td><p> The number of prepared-statement-execute-with-error-and-notice messages received. </p></td> </tr><tr> <td><p> <code>prep_execute_with_warning_and_notice</code> </p></td> <td><p> <a class="link" href="x-plugin-status-variables.html#statvar_Mysqlx_prep_execute_with_warning_and_notice"><code>Mysqlx_prep_execute_with_warning_and_notice</code></a> </p></td> <td><p> <code>ASYNC COUNTER</code> </p></td> <td><p> The number of prepared-statement-execute-with-warning-and-notice messages received. </p></td> </tr><tr> <td><p> <code>prep_execute_with_error_and_warning</code> </p></td> <td><p> <a class="link" href="x-plugin-status-variables.html#statvar_Mysqlx_prep_execute_with_error_and_warning"><code>Mysqlx_prep_execute_with_error_and_warning</code></a> </p></td> <td><p> <code>ASYNC COUNTER</code> </p></td> <td><p> The number of prepared-statement-execute-with-error-and-warning messages received. </p></td> </tr><tr> <td><p> <code>prep_execute_with_error_and_notice_and_warning</code> </p></td> <td><p> <a class="link" href="x-plugin-status-variables.html#statvar_Mysqlx_prep_execute_with_error_and_notice_and_warning"><code>Mysqlx_prep_execute_with_error_and_notice_and_warning</code></a

#### mysql.x.stmt Metricas

**Tabela 35.13 mysql.x.stmt Metricas**

<table frame="void"><col width="20%"/><col width="20%"/><col width="20%"/><col width="40%"/><thead><tr> <th>Nome</th> <th>Variável Fonte</th> <th>Tipo de OTEL</th> <th>Descrição</th> </tr></thead><tbody><tr> <td><p> <code>total</code> </p></td> <td><p> <a class="link" href="server-status-variables.html#statvar_Connections"><code>Conexões</code></a> </p></td> <td><p> <code>CONTADOR ASSÍNCRONO</code> </p></td> <td><p> Contagem cumulativa de conexões criadas. </p></td> </tr><tr> <td><p> <code>errors_accept</code> </p></td> <td><p> <a class="link" href="server-status-variables.html#statvar_Connection_errors_accept"><code>Connection_errors_accept</code></a> </p></td> <td><p> <code>CONTADOR ASSÍNCRONO</code> </p></td> <td><p> Número de erros que ocorreram durante chamadas ao <code>accept()</code> na porta de escuta. </p></td> </tr><tr> <td><p> <code>errors_internal</code> </p></td> <td><p> <a class="link" href="server-status-variables.html#statvar_Connection_errors_internal"><code>Connection_errors_internal</code></a> </p></td> <td><p> <code>CONTADOR ASSÍNCRONO</code> </p></td> <td><p> Número de conexões recusadas devido a erros internos no servidor, como falha em iniciar um novo thread ou condição de memória insuficiente. </p></td> </tr><tr> <td><p> <code>errors_max_connections</code> </p></td> <td><p> <a class="link" href="server-status-variables.html#statvar_Connection_errors_max_connections"><code>Connection_errors_max_connections</code></a> </p></td> <td><p> <code>CONTADOR ASSÍNCRONO</code> </p></td> <td><p> Número de conexões recusadas porque o limite de conexões max_connections do servidor foi atingido. </p></td> </tr><tr> <td><p> <code>errors_peer_address</code> </p></td> <td><p> <a class="link" href="server-status-variables.html#statvar_Connection_errors_peer_address"><code>Connection_errors_peer_address</code></a> </p></td> <td><p> <code>CONTADOR ASSÍNCRONO</code> </p></td> <td><p> Número de erros que ocorreram ao buscar endereços IP de clientes conectados. </p></td> </tr><tr> <td><p> <code>errors_select</code> </p></td> <td><p> <a class="link" href="server-status-variables.html#statvar_Connection_errors_select"><code>Connection_errors_select</code></a> </p></td> <td><p> <code>CONTADOR ASSÍNCRONO</code> </p></td> <td><p> Número de erros que ocorreram durante chamadas ao <code>select()</code> ou <code>poll()</code> na porta de escuta. </p></td> </tr><tr> <td><p> <code>errors_tcpwrap</code> </p></td> <td><p> <a class="link" href="server-status-variables.html#statvar_Connection_errors_tcpwrap"><code>Connection_errors_tcpwrap</code></a> </p></td> <td><p> <code>CONTADOR ASSÍNCRONO</code> </p></td> <td><p> Número de conexões recusadas pela biblioteca <code>libwrap</code>. </p></td> </tr></tbody></table>

#### Métricas mysql.mle

**Tabela 35.14 Métricas mysql.mle**

<table frame="void"><col width="20%"/><col width="20%"/><col width="20%"/><col width="40%"/><thead><tr> <th>Nome</th> <th>Variável Fonte</th> <th>Tipo de OTEL</th> <th>Descrição</th> </tr></thead><tbody><tr> <td><p> <code>total</code> </p></td> <td><p> <a class="link" href="server-status-variables.html#statvar_Connections"><code>Conexões</code></a> </p></td> <td><p> <code>CONTADOR ASSÍNCRONO</code> </p></td> <td><p> Contagem cumulativa de conexões criadas. </p></td> </tr><tr> <td><p> <code>errors_accept</code> </p></td> <td><p> <a class="link" href="server-status-variables.html#statvar_Connection_errors_accept"><code>Connection_errors_accept</code></a> </p></td> <td><p> <code>CONTADOR ASSÍNCRONO</code> </p></td> <td><p> Número de erros que ocorreram durante chamadas ao <code>accept()</code> na porta de escuta. </p></td> </tr><tr> <td><p> <code>errors_internal</code> </p></td> <td><p> <a class="link" href="server-status-variables.html#statvar_Connection_errors_internal"><code>Connection_errors_internal</code></a> </p></td> <td><p> <code>CONTADOR ASSÍNCRONO</code> </p></td> <td><p> Número de conexões recusadas devido a erros internos no servidor, como falha em iniciar um novo thread ou condição de memória insuficiente. </p></td> </tr><tr> <td><p> <code>errors_max_connections</code> </p></td> <td><p> <a class="link" href="server-status-variables.html#statvar_Connection_errors_max_connections"><code>Connection_errors_max_connections</code></a> </p></td> <td><p> <code>CONTADOR ASSÍNCRONO</code> </p></td> <td><p> Número de conexões recusadas porque o limite de conexões max_connections do servidor foi atingido. </p></td> </tr><tr> <td><p> <code>errors_peer_address</code> </p></td> <td><p> <a class="link" href="server-status-variables.html#statvar_Connection_errors_peer_address"><code>Connection_errors_peer_address</code></a> </p></td> <td><p> <code>CONTADOR ASSÍNCRONO</code> </p></td> <td><p> Número de erros que ocorreram ao buscar endereços IP de clientes conectados. </p></td> </tr><tr> <td><p> <code>errors_select</code> </p></td> <td><p> <a class="link" href="server-status-variables.html#statvar_Connection_errors_select"><code>Connection_errors_select</code></a> </p></td> <td><p> <code>CONTADOR ASSÍNCRONO</code> </p></td> <td><p> Número de erros que ocorreram durante chamadas ao <code>select()</code> ou <code>poll()</code> na porta de escuta. </p></td> </tr><tr> <td><p> <code>errors_tcpwrap</code> </p></td> <td><p> <a class="link" href="server-status-variables.html#statvar_Connection_errors_tcpwrap"><code>Connection_errors_tcpwrap</code></a> </p></td> <td><p> <code>CONTADOR ASSÍNCRONO</code> </p></td> <td><p> Número de conexões recusadas pela biblioteca <code>libwrap</code>. </p></td> </tr></tbody></table>