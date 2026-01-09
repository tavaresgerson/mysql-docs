### 7.1.10 Variáveis de Status do Servidor

O servidor MySQL mantém muitas variáveis de status que fornecem informações sobre sua operação. Você pode visualizar essas variáveis e seus valores usando a instrução `SHOW [GLOBAL | SESSION] STATUS` (consulte a Seção 15.7.7.38, “Instrução SHOW STATUS”). A palavra-chave opcional `GLOBAL` agrega os valores sobre todas as conexões, e `SESSION` mostra os valores para a conexão atual.

```
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

Muitas variáveis de status são resetadas para 0 pela instrução `FLUSH STATUS`.

Esta seção fornece uma descrição de cada variável de status. Para um resumo das variáveis de status, consulte a Seção 7.1.6, “Referência de Variáveis de Status do Servidor”. Para informações sobre variáveis de status específicas do NDB Cluster, consulte a Seção 25.4.3.9.3, “Variáveis de Status do NDB Cluster”.

As variáveis de status têm os seguintes significados.

* `Aborted_clients`

  O número de conexões que foram abortadas porque o cliente morreu sem fechar a conexão corretamente. Consulte a Seção B.3.2.9, “Erros de Comunicação e Conexões Abortadas”.

* `Aborted_connects`

  O número de tentativas falhas de conexão com o servidor MySQL. Consulte a Seção B.3.2.9, “Erros de Comunicação e Conexões Abortadas”.

  Para informações adicionais relacionadas à conexão, consulte as variáveis de status `Connection_errors_xxx` e a tabela `host_cache`.

* `Authentication_ldap_sasl_supported_methods`

  O plugin `authentication_ldap_sasl` que implementa a autenticação LDAP SASL suporta vários métodos de autenticação, mas, dependendo da configuração do sistema do host, eles podem não estar todos disponíveis. A variável `Authentication_ldap_sasl_supported_methods` fornece a descoberta dos métodos suportados. Seu valor é uma string composta por nomes de métodos de autenticação suportados separados por espaços. Exemplo: `"SCRAM-SHA 1 SCRAM-SHA-256 GSSAPI"`

* `Binlog_cache_disk_use`

  O número de transações que usaram o cache de log binário temporário, mas que excederam o valor de `binlog_cache_size` e usaram um arquivo temporário para armazenar declarações da transação.

  O número de declarações não-transacionais que causaram a gravação do cache de transações de log binário no disco é rastreado separadamente na variável de status `Binlog_stmt_cache_disk_use`.

* `Acl_cache_items_count`

  O número de objetos de privilégio armazenados no cache. Cada objeto é a combinação de privilégio de um usuário e seus papéis ativos.

* `Binlog_cache_use`

  O número de transações que usaram o cache de log binário.

* `Binlog_stmt_cache_disk_use`

  O número de declarações não-transacionais que usaram o cache de declarações de log binário, mas que excederam o valor de `binlog_stmt_cache_size` e usaram um arquivo temporário para armazenar essas declarações.

* `Binlog_stmt_cache_use`

  O número de declarações não-transacionais que usaram o cache de declarações de log binário.

* `Bytes_received`

  O número de bytes recebidos de todos os clientes.

* `Bytes_sent`

  O número de bytes enviados para todos os clientes.

* `Caching_sha2_password_rsa_public_key`

  A chave pública usada pelo plugin de autenticação `caching_sha2_password` para a troca de senhas com par de chaves RSA. O valor não é vazio apenas se o servidor inicializar com sucesso as chaves privada e pública nos arquivos nomeados pelas variáveis de sistema `caching_sha2_password_private_key_path` e `caching_sha2_password_public_key_path`. O valor de `Caching_sha2_password_rsa_public_key` vem do último arquivo.

* `Com_xxx`

As variáveis de contador `Com_xxx` indicam o número de vezes que cada instrução `xxx` foi executada. Há uma variável de status para cada tipo de instrução. Por exemplo, `Com_delete` e `Com_update` contam as instruções `DELETE` e `UPDATE`, respectivamente. `Com_delete_multi` e `Com_update_multi` são semelhantes, mas se aplicam a instruções `DELETE` e `UPDATE` que usam sintaxe de múltiplas tabelas.

Todas as variáveis `Com_stmt_xxx` são incrementadas mesmo que um argumento de instrução preparada seja desconhecido ou ocorra um erro durante a execução. Em outras palavras, seus valores correspondem ao número de solicitações emitidas, não ao número de solicitações concluídas com sucesso. Por exemplo, como as variáveis de status são inicializadas para cada inicialização do servidor e não persistem em reinicializações, as variáveis `Com_restart` e `Com_shutdown` que rastreiam as instruções `RESTART` e `SHUTDOWN` normalmente têm um valor de zero, mas podem ser não nulos se as instruções `RESTART` ou `SHUTDOWN` foram executadas, mas falharam.

As variáveis de status `Com_stmt_xxx` são as seguintes:

+ `Com_stmt_prepare`
+ `Com_stmt_execute`
+ `Com_stmt_fetch`
+ `Com_stmt_send_long_data`
+ `Com_stmt_reset`
+ `Com_stmt_close`

Essas variáveis representam comandos de declaração preparada. Seus nomes referem-se ao conjunto de comandos `COM_xxx` usado na camada de rede. Em outras palavras, seus valores aumentam sempre que chamadas da API de declaração preparada, como **mysql_stmt_prepare()**, **mysql_stmt_execute()**, e assim por diante, são executadas. No entanto, `Com_stmt_prepare`, `Com_stmt_execute` e `Com_stmt_close` também aumentam para `PREPARE`, `EXECUTE` ou `DEALLOCATE PREPARE`, respectivamente. Além disso, os valores das variáveis de contador de declarações mais antigas `Com_prepare_sql`, `Com_execute_sql` e `Com_dealloc_sql` aumentam para as declarações `PREPARE`, `EXECUTE` e `DEALLOCATE PREPARE`. `Com_stmt_fetch` representa o número total de viagens de ida e volta da rede emitidas ao buscar em cursors.

`Com_stmt_reprepare` indica o número de vezes que as declarações foram automaticamente repreparadas pelo servidor, por exemplo, após alterações de metadados em tabelas ou visualizações referenciadas pela declaração. Uma operação de repreparação incrementa `Com_stmt_reprepare`, e também `Com_stmt_prepare`.

`Com_explain_other` indica o número de declarações `EXPLAIN FOR CONNECTION` executadas. Veja a Seção 10.8.4, “Obtendo Informações do Plano de Execução para uma Conexão Nomeada”.

`Com_change_repl_filter` indica o número de declarações `CHANGE REPLICATION FILTER` executadas.

`Com_create_library`, `Com_drop_library`, `Com_alter_library`, `Com_show_create_library` e `Com_show_library_status` indicam, respectivamente, os números de declarações `CREATE LIBRARY`, `DROP LIBRARY`, `ALTER LIBRARY`, `SHOW CREATE LIBRARY` e `SHOW LIBRARY STATUS` executadas. Essas variáveis estão presentes apenas se o componente MLE (Multilingual Engine Component) estiver instalado (veja a Seção 7.5.7, “Componente do Motor Multilíngue (MLE”)”).

* `Compressão`

Se a conexão do cliente usa compressão no protocolo cliente/servidor.

Esta variável de status está desatualizada; espere-se que seja removida em uma versão futura do MySQL. Veja Configurando Compressão de Conexão Legado.

* `Compression_algorithm`

  O nome do algoritmo de compressão em uso para a conexão atual com o servidor. O valor pode ser qualquer algoritmo permitido no valor da variável de sistema `protocol_compression_algorithms`. Por exemplo, o valor é `uncompressed` se a conexão não usar compressão, ou `zlib` se a conexão usar o algoritmo `zlib`.

  Para mais informações, veja a Seção 6.2.8, “Controle de Compressão de Conexão”.

* `Compression_level`

  O nível de compressão em uso para a conexão atual com o servidor. O valor é 6 para conexões `zlib` (o nível de compressão padrão do algoritmo `zlib`), 1 a 22 para conexões `zstd`, e 0 para conexões `uncompressed`.

  Para mais informações, veja a Seção 6.2.8, “Controle de Compressão de Conexão”.

* `Component_connection_control_delay_generated`

  Número de atrasos gerados pelo `component_connection_control`. Atualiza sempre que um atraso é acionado; reinicia para 0 sempre que `component_connection_control.failed_connections_threshold` é definido.

  Veja a Seção 8.4.2, “O Componente de Controle de Conexão”, para mais informações.

* `Component_connection_control_exempted_unknown_users`

  Número de conexões TCP falhas isentas da verificação de controle de conexão geradas pelo `component_connection_control.exempt_unknown_users`.

  Veja a Seção 8.4.2, “O Componente de Controle de Conexão”, para mais informações.

* `Connection_errors_xxx`

Essas variáveis fornecem informações sobre os erros que ocorrem durante o processo de conexão com o cliente. Elas são globais e representam o número de erros agregados em todas as conexões de todos os hosts. Essas variáveis rastreiam erros que não são contabilizados pelo cache do host (veja a Seção 7.1.12.3, “Consultas DNS e o Cache do Host”), como erros que não estão associados a conexões TCP, ocorrem muito cedo no processo de conexão (mesmo antes de um endereço IP ser conhecido) ou não são específicos de qualquer endereço IP particular (como condições de memória insuficiente).

+ `Connection_errors_accept`

    O número de erros que ocorreram durante chamadas a `accept()` na porta de escuta.

+ `Connection_errors_internal`

    O número de conexões recusadas devido a erros internos no servidor, como falha em iniciar um novo thread ou uma condição de memória insuficiente.

+ `Connection_errors_max_connections`

    O número de conexões recusadas porque o limite `max_connections` do servidor foi atingido.

+ `Connection_errors_peer_address`

    O número de erros que ocorreram ao buscar endereços IP de clientes conectados.

+ `Connection_errors_select`

    O número de erros que ocorreram durante chamadas a `select()` ou `poll()` na porta de escuta. (A falha dessa operação não significa necessariamente que uma conexão com o cliente foi rejeitada.)

+ `Connection_errors_tcpwrap`

    O número de conexões recusadas pela biblioteca `libwrap`.

* `Connections`

    O número de tentativas de conexão (sucesso ou não) ao servidor MySQL.

* `Count_hit_query_past_global_connection_memory_status_limit`

O número de vezes que consultas com qualquer conexão causaram o consumo total de memória a exceder o limite `global_connection_memory_status_limit`. Esse valor é incrementado quando uma consulta faz o consumo total de memória passar de menos que `global_connection_memory_status_limit` para maior que esse valor; quando uma consulta é executada, mas o consumo total de memória já excede esse limite, a variável de status não é incrementada.

* `Count_hit_query_past_connection_memory_status_limit`

  O número de vezes que consultas com a conexão atual causaram o consumo total de memória a exceder o limite `connection_memory_limit`. Esse valor é incrementado, para uma consulta executada dentro da conexão, quando tal consulta faz o consumo total de memória passar de menos que `connection_memory_limit` para maior que esse valor; quando uma consulta é executada, mas o consumo total de memória já excede esse limite, a variável de status não é incrementada.

* `Count_hit_tmp_table_size`

  O número de tabelas temporárias internas que foram convertidas de memória para disco porque o motor `TempTable` atingiu o limite `tmp_table_size` ou o motor `MEMORY` atingiu o valor menor entre `tmp_table_size` e `max_heap_table_size`.

* `Created_tmp_disk_tables`

  O número de tabelas temporárias internas em disco criadas pelo servidor enquanto executa instruções.

  Você pode comparar o número de tabelas temporárias internas em disco criadas ao número total de tabelas temporárias internas criadas comparando os valores de `Created_tmp_disk_tables` e `Created_tmp_tables`.

  Nota

Devido a uma limitação conhecida, o `Created_tmp_disk_tables` não contabiliza as tabelas temporárias on-disk criadas em arquivos mapeados em memória. Por padrão, o mecanismo de overflow do mecanismo de armazenamento TempTable cria tabelas temporárias internas em arquivos mapeados em memória. Esse comportamento é controlado pela variável `temptable_max_mmap`.

Veja também a Seção 10.4.4, “Uso de Tabelas Temporárias Internas no MySQL”.

* `Created_tmp_files`

  Quantos arquivos temporários o **mysqld** criou.

* `Created_tmp_tables`

  O número de tabelas temporárias internas criadas pelo servidor ao executar instruções.

  Você pode comparar o número de tabelas temporárias on-disk internas criadas com o número total de tabelas temporárias internas criadas comparando os valores de `Created_tmp_disk_tables` e `Created_tmp_tables`.

  Veja também a Seção 10.4.4, “Uso de Tabelas Temporárias Internas no MySQL”.

  Cada invocação da instrução `SHOW STATUS` usa uma tabela temporária interna e incrementa o valor global `Created_tmp_tables`.

* `Current_tls_ca`

  O valor ativo `ssl_ca` no contexto SSL que o servidor usa para novas conexões. Esse valor de contexto pode diferir do valor atual da variável de sistema `ssl_ca` se a variável de sistema tiver sido alterada, mas o `ALTER INSTANCE RELOAD TLS` não tiver sido executado subsequentemente para reconfigurar o contexto SSL a partir dos valores das variáveis de sistema relacionadas ao contexto e atualizar as variáveis de status correspondentes. (Essa possível diferença de valores se aplica a cada par correspondente de variáveis de sistema e variáveis de status relacionadas ao contexto. Veja Configuração e Monitoramento de Execução no Lado do Servidor para Conexões Encriptadas.)

  Os valores das variáveis de status `Current_tls_xxx` também estão disponíveis através da tabela `tls_channel_status` do Schema de Desempenho. Veja a Seção 29.12.22.11, “A tabela tls_channel_status”.

* `Current_tls_capath`

  O valor ativo `ssl_capath` no contexto TLS que o servidor usa para novas conexões. Para notas sobre a relação entre essa variável de status e sua variável de sistema correspondente, consulte a descrição de `Current_tls_ca`.

* `Current_tls_cert`

  O valor ativo `ssl_cert` no contexto TLS que o servidor usa para novas conexões. Para notas sobre a relação entre essa variável de status e sua variável de sistema correspondente, consulte a descrição de `Current_tls_ca`.

* `Current_tls_cipher`

  O valor ativo `ssl_cipher` no contexto TLS que o servidor usa para novas conexões. Para notas sobre a relação entre essa variável de status e sua variável de sistema correspondente, consulte a descrição de `Current_tls_ca`.

* `Current_tls_ciphersuites`

  O valor ativo `tls_ciphersuites` no contexto TLS que o servidor usa para novas conexões. Para notas sobre a relação entre essa variável de status e sua variável de sistema correspondente, consulte a descrição de `Current_tls_ca`.

* `Current_tls_crl`

  O valor ativo `ssl_crl` no contexto TLS que o servidor usa para novas conexões. Para notas sobre a relação entre essa variável de status e sua variável de sistema correspondente, consulte a descrição de `Current_tls_ca`.

  Nota

Quando você recarrega o contexto TLS, o OpenSSL recarrega o arquivo que contém a CRL (lista de revogação de certificados) como parte do processo. Se o arquivo CRL for grande, o servidor aloca um grande pedaço de memória (dez vezes o tamanho do arquivo), que é dobrado enquanto a nova instância está sendo carregada e a antiga ainda não foi liberada. A memória residente do processo não é reduzida imediatamente após uma grande alocação ser liberada, então se você emitir a declaração `ALTER INSTANCE RELOAD TLS` repetidamente com um grande arquivo CRL, o uso da memória residente do processo pode crescer como resultado disso.

* `Current_tls_crlpath`

  O valor ativo `ssl_crlpath` no contexto TLS que o servidor usa para novas conexões. Para notas sobre a relação entre essa variável de status e sua variável de sistema correspondente, consulte a descrição de `Current_tls_ca`.

* `Current_tls_key`

  O valor ativo `ssl_key` no contexto TLS que o servidor usa para novas conexões. Para notas sobre a relação entre essa variável de status e sua variável de sistema correspondente, consulte a descrição de `Current_tls_ca`.

* `Current_tls_version`

  O valor ativo `tls_version` no contexto TLS que o servidor usa para novas conexões. Para notas sobre a relação entre essa variável de status e sua variável de sistema correspondente, consulte a descrição de `Current_tls_ca`.

* `Delayed_errors`

  Esta variável de status é desatualizada (porque as inserções `DELAYED` não são suportadas); espere que ela seja removida em uma futura versão.

* `Delayed_insert_threads`

  Esta variável de status é desatualizada (porque as inserções `DELAYED` não são suportadas); espere que ela seja removida em uma futura versão.

* `Delayed_writes`

Esta variável de status está desatualizada (porque as inserções `DELAYED` não são suportadas); espere-se que ela seja removida em uma futura versão.

* `Deprecated_use_i_s_processlist_count`

  Quantas vezes a tabela `information_schema.processlist` foi acessada desde o último reinício.

* `Deprecated_use_i_s_processlist_last_timestamp`

  Um timestamp indicando a última vez que a tabela `information_schema.processlist` foi acessada desde o último reinício. Mostra microsegundos desde o Epoch Unix.

* `dragnet.Status`

  O resultado da atribuição mais recente à variável de sistema `dragnet.log_error_filter_rules`, vazia se nenhuma atribuição ocorrer.

* `Error_log_buffered_bytes`

  O número de bytes atualmente usados na tabela `error_log` do Schema de Desempenho. É possível que o valor diminua, por exemplo, se um novo evento não cabe até descartar um evento antigo, mas o novo evento é menor que o antigo.

* `Error_log_buffered_events`

  O número de eventos atualmente presentes na tabela `error_log` do Schema de Desempenho. Como com `Error_log_buffered_bytes`, é possível que o valor diminua.

* `Error_log_expired_events`

  O número de eventos descartados da tabela `error_log` do Schema de Desempenho para dar lugar a novos eventos.

* `Error_log_latest_write`

  A hora da última escrita na tabela `error_log` do Schema de Desempenho.

* `Flush_commands`

  O número de vezes que o servidor esvazia tabelas, seja porque um usuário executou uma instrução `FLUSH TABLES` ou devido a uma operação interna do servidor. Também é incrementado pela recepção de um pacote `COM_REFRESH`. Isso está em contraste com `Com_flush`, que indica quantas instruções `FLUSH` foram executadas, seja `FLUSH TABLES`, `FLUSH LOGS`, e assim por diante.

* `Global_connection_memory`

A memória usada por todas as conexões do usuário com o servidor. A memória usada por threads do sistema ou pela conta raiz do MySQL está incluída no total, mas tais threads ou usuários não estão sujeitos à desconexão devido ao uso de memória. Essa memória não é calculada, a menos que `global_connection_memory_tracking` esteja habilitado (desabilitado por padrão). O Schema de Desempenho também deve estar habilitado.

Você pode controlar (indiretamente) a frequência com que essa variável é atualizada, configurando `connection_memory_chunk_size`.

* `Handler_commit`

  O número de instruções `COMMIT` internas.

* `Handler_delete`

  O número de vezes que linhas foram excluídas das tabelas.

* `Handler_external_lock`

  O servidor incrementa essa variável para cada chamada à sua função `external_lock()`, que geralmente ocorre no início e no final do acesso a uma instância de tabela. Pode haver diferenças entre os motores de armazenamento. Essa variável pode ser usada, por exemplo, para descobrir, para uma instrução que acessa uma tabela particionada, quantos particionamentos foram eliminados antes do bloqueio ocorrer: Verifique quanto o contador aumentou para a instrução, subtraia 2 (2 chamadas para a própria tabela), depois divida por 2 para obter o número de particionamentos bloqueados.

* `Handler_mrr_init`

  O número de vezes que o servidor usa a própria implementação de Leitura de Múltiplos Intervalos do motor de armazenamento para o acesso a tabelas.

* `Handler_prepare`

  Um contador para a fase de preparação das operações de commit de duas fases.

* `Handler_read_first`

  O número de vezes que a primeira entrada em um índice foi lida. Se esse valor for alto, sugere que o servidor está fazendo muitas varreduras completas do índice (por exemplo, `SELECT col1 FROM foo`, assumindo que `col1` está indexado).

* `Handler_read_key`

O número de solicitações para ler uma linha com base em uma chave. Se esse valor for alto, é um bom indicativo de que suas tabelas estão corretamente indexadas para suas consultas.

* `Handler_read_last`

  O número de solicitações para ler a última chave em um índice. Com `ORDER BY`, o servidor emite uma solicitação de primeira chave seguida por várias solicitações de próxima chave, enquanto com `ORDER BY DESC`, o servidor emite uma solicitação de última chave seguida por várias solicitações de chave anterior.

* `Handler_read_next`

  O número de solicitações para ler a próxima linha em ordem de chave. Esse valor é incrementado se você estiver consultando uma coluna de índice com uma restrição de intervalo ou se estiver realizando uma varredura de índice.

* `Handler_read_prev`

  O número de solicitações para ler a linha anterior em ordem de chave. Esse método de leitura é usado principalmente para otimizar `ORDER BY ... DESC`.

* `Handler_read_rnd`

  O número de solicitações para ler uma linha com base em uma posição fixa. Esse valor é alto se você estiver fazendo muitas consultas que requerem ordenação dos resultados. Provavelmente você tem muitas consultas que exigem que o MySQL escaneie tabelas inteiras ou que você tenha junções que não utilizam chaves corretamente.

* `Handler_read_rnd_next`

  O número de solicitações para ler a próxima linha no arquivo de dados. Esse valor é alto se você estiver fazendo muitas varreduras de tabelas. Geralmente isso sugere que suas tabelas não estão corretamente indexadas ou que suas consultas não foram escritas para aproveitar os índices que você tem.

* `Handler_rollback`

  O número de solicitações para que um mecanismo de armazenamento execute uma operação de rollback.

* `Handler_savepoint`

  O número de solicitações para que um mecanismo de armazenamento coloque um ponto de salvamento.

* `Handler_savepoint_rollback`

  O número de solicitações para que um mecanismo de armazenamento volte a um ponto de salvamento.

* `Handler_update`

  O número de solicitações para atualizar uma linha em uma tabela.

* `Handler_write`

O número de solicitações para inserir uma linha em uma tabela.

* `Innodb_buffer_pool_dump_status`

  O progresso de uma operação para registrar as páginas mantidas no pool de buffer do `InnoDB`, acionado pela configuração de `innodb_buffer_pool_dump_at_shutdown` ou `innodb_buffer_pool_dump_now`.

  Para informações e exemplos relacionados, consulte a Seção 17.8.3.6, “Salvar e Restaurar o Estado do Pool de Buffer”.

* `Innodb_buffer_pool_load_status`

  O progresso de uma operação para aquecer o pool de buffer do `InnoDB` lendo um conjunto de páginas correspondentes a um ponto anterior no tempo, acionado pela configuração de `innodb_buffer_pool_load_at_startup` ou `innodb_buffer_pool_load_now`. Se a operação introduzir muito overhead, você pode cancelá-la configurando `innodb_buffer_pool_load_abort`.

  Para informações e exemplos relacionados, consulte a Seção 17.8.3.6, “Salvar e Restaurar o Estado do Pool de Buffer”.

* `Innodb_buffer_pool_bytes_data`

  O número total de bytes no pool de buffer do `InnoDB` contendo dados. O número inclui tanto páginas limpas quanto sujas. Para cálculos mais precisos de uso de memória do que com `Innodb_buffer_pool_pages_data`, quando tabelas compactadas fazem com que o pool de buffer retenha páginas de tamanhos diferentes.

* `Innodb_buffer_pool_pages_data`

  O número de páginas no pool de buffer do `InnoDB` contendo dados. O número inclui tanto páginas limpas quanto sujas. Ao usar tabelas compactadas, o valor relatado de `Innodb_buffer_pool_pages_data` pode ser maior que `Innodb_buffer_pool_pages_total` (Bug #59550).

* `Innodb_buffer_pool_bytes_dirty`

  O número total atual de bytes mantidos em páginas sujas no pool de buffer do `InnoDB`. Para cálculos de uso de memória mais precisos do que com `Innodb_buffer_pool_pages_dirty`, quando tabelas compactadas fazem com que o pool de buffer retenha páginas de tamanhos diferentes.

* `Innodb_buffer_pool_pages_dirty`

  O número atual de páginas sujas no pool de buffer do `InnoDB`.

* `Innodb_buffer_pool_pages_flushed`

  O número de solicitações para descartar páginas do pool de buffer do `InnoDB`.

* `Innodb_buffer_pool_pages_free`

  O número de páginas livres no pool de buffer do `InnoDB`.

* `Innodb_buffer_pool_pages_latched`

  O número de páginas travadas no pool de buffer do `InnoDB`. São páginas que estão sendo lidas ou escritas atualmente ou que não podem ser descartadas por algum outro motivo. O cálculo dessa variável é caro, então ela está disponível apenas quando o sistema `UNIV_DEBUG` é definido durante a construção do servidor.

* `Innodb_buffer_pool_pages_misc`

  O número de páginas no pool de buffer do `InnoDB` que estão ocupadas porque foram alocadas para overhead administrativo, como bloqueios de linhas ou índice de hash adaptativo. Esse valor também pode ser calculado como `Innodb_buffer_pool_pages_total` − `Innodb_buffer_pool_pages_free` − `Innodb_buffer_pool_pages_data`. Ao usar tabelas compactadas, `Innodb_buffer_pool_pages_misc` pode reportar um valor fora dos limites (Bug #59550).

* `Innodb_buffer_pool_pages_total`

  O tamanho total do pool de buffer do `InnoDB`, em páginas. Ao usar tabelas compactadas, o valor relatado de `Innodb_buffer_pool_pages_data` pode ser maior que `Innodb_buffer_pool_pages_total` (Bug #59550)

* `Innodb_buffer_pool_read_ahead`

  O número de páginas lidas no pool de buffer do `InnoDB` pelo fio de fundo de leitura antecipada.

* `Innodb_buffer_pool_read_ahead_evicted`

  O número de páginas lidas no pool de buffer do `InnoDB` pelo fio de fundo de leitura antecipada que foram posteriormente expulsas sem terem sido acessadas por consultas.

* `Innodb_buffer_pool_read_ahead_rnd`

O número de leituras "aleatórias" iniciadas pelo `InnoDB`. Isso acontece quando uma consulta examina uma grande parte de uma tabela, mas em ordem aleatória.

* `Innodb_buffer_pool_read_requests`

  O número de solicitações de leitura lógicas.

* `Innodb_buffer_pool_reads`

  O número de leituras lógicas que o `InnoDB` não conseguiu satisfazer a partir do pool de buffer e teve que ler diretamente do disco.

* `Innodb_buffer_pool_resize_status`

  O status de uma operação de redimensionamento do pool de buffer `InnoDB` dinamicamente, acionada pelo ajuste dinâmico do parâmetro `innodb_buffer_pool_size`. O parâmetro `innodb_buffer_pool_size` é dinâmico, o que permite redimensionar o pool de buffer sem reiniciar o servidor. Veja Configurando o Tamanho do Pool de Buffer de InnoDB Online para informações relacionadas.

* `Innodb_buffer_pool_resize_status_code`

  Reporta códigos de status para acompanhar operações de redimensionamento online do pool de buffer. Cada código de status representa uma etapa em uma operação de redimensionamento. Os códigos de status incluem:

  + 0: Nenhuma operação de redimensionamento em andamento
  + 1: Começando a redimensionar
  + 2: Desabilitando AHI (Índice Hash Adaptativo)
  + 3: Retirando Blocos
  + 4: Adquirindo Bloqueio Global
  + 5: Redimensionando o Pool
  + 6: Redimensionando o Hash
  + 7: Redimensionamento Falhou

  Você pode usar essa variável de status em conjunto com `Innodb_buffer_pool_resize_status_progress` para acompanhar o progresso de cada etapa de uma operação de redimensionamento. A variável `Innodb_buffer_pool_resize_status_progress` reporta um valor percentual indicando o progresso da etapa atual.

  Para mais informações, veja Monitorando o Progresso de Redimensionamento Online do Pool de Buffer.

* `Innodb_buffer_pool_resize_status_progress`

Representa um valor percentual que indica o progresso da etapa atual de uma operação de redimensionamento do pool de buffers online. Essa variável é usada em conjunto com `Innodb_buffer_pool_resize_status_code`, que representa um código de status que indica a etapa atual de uma operação de redimensionamento do pool de buffers online.

O valor percentual é atualizado após cada instância do pool de buffers ser processada. À medida que o código de status (relatado por `Innodb_buffer_pool_resize_status_code`) muda de um status para outro, o valor percentual é redefinido para 0.

Para informações relacionadas, consulte Monitoramento do progresso de redimensionamento do pool de buffers online.

* `Innodb_buffer_pool_wait_free`

  Normalmente, as escritas no pool de buffers do `InnoDB` ocorrem em segundo plano. Quando o `InnoDB` precisa ler ou criar uma página e não há páginas limpas disponíveis, o `InnoDB` esvazia primeiro algumas páginas sujas e aguarda que essa operação seja concluída. Esse contador conta as instâncias dessas espera. Se `innodb_buffer_pool_size` foi configurado corretamente, esse valor deve ser pequeno.

* `Innodb_buffer_pool_write_requests`

  O número de escritas feitas no pool de buffers do `InnoDB`.

* `Innodb_data_fsyncs`

  O número de operações `fsync()` até o momento. A frequência das chamadas `fsync()` é influenciada pela configuração da opção de configuração `innodb_flush_method`.

Conta o número de operações `fdatasync()` se `innodb_use_fdatasync` estiver habilitado.

* `Innodb_data_pending_fsyncs`

  O número atual de operações `fsync()` pendentes. A frequência das chamadas `fsync()` é influenciada pela configuração da opção de configuração `innodb_flush_method`.

* `Innodb_data_pending_reads`

  O número atual de leituras pendentes.

* `Innodb_data_pending_writes`

  O número atual de escritas pendentes.

* `Innodb_data_read`

A quantidade de dados lidos desde que o servidor foi iniciado (em bytes).

* `Innodb_data_reads`

  O número total de leituras de dados (leitura de arquivos do sistema operacional).

* `Innodb_data_writes`

  O número total de escritas de dados.

* `Innodb_data_written`

  A quantidade de dados escritos até agora, em bytes.

* `Innodb_dblwr_pages_written`

  O número de páginas que foram escritas no buffer de dupla escrita. Veja a Seção 17.11.1, “I/O de disco do InnoDB”.

* `Innodb_dblwr_writes`

  O número de operações de dupla escrita que foram realizadas. Veja a Seção 17.11.1, “I/O de disco do InnoDB”.

* `Innodb_have_atomic_builtins`

  Indica se o servidor foi construído com instruções atômicas.

* `Innodb_log_waits`

  O número de vezes que o buffer de log foi muito pequeno e foi necessário aguardar para que ele fosse esvaziado antes de continuar.

* `Innodb_log_write_requests`

  O número de solicitações de escrita para o log de refazer do `InnoDB`.

* `Innodb_log_writes`

  O número de escritas físicas no arquivo de log de refazer do `InnoDB`.

* `Innodb_num_open_files`

  O número de arquivos que o `InnoDB` atualmente mantém abertos.

* `Innodb_os_log_fsyncs`

  O número de escritas `fsync()` feitas nos arquivos de log de refazer do `InnoDB`.

* `Innodb_os_log_pending_fsyncs`

  O número de operações `fsync()` pendentes para os arquivos de log de refazer do `InnoDB`.

* `Innodb_os_log_pending_writes`

  O número de escritas pendentes nos arquivos de log de refazer do `InnoDB`.

* `Innodb_os_log_written`

  O número de bytes escritos nos arquivos de log de refazer do `InnoDB`.

* `Innodb_page_size`

  Tamanho da página do `InnoDB` (padrão 16KB). Muitos valores são contados em páginas; o tamanho da página permite que sejam facilmente convertidos em bytes.

* `Innodb_pages_created`

  O número de páginas criadas por operações em tabelas do `InnoDB`.

* `Innodb_pages_read`

O número de páginas lidas do pool de buffer `InnoDB` por operações nas tabelas `InnoDB`.

* `Innodb_pages_written`

  O número de páginas escritas por operações nas tabelas `InnoDB`.

* `Innodb_redo_log_enabled`

  Se a log de redo está habilitada ou desabilitada. Consulte Desabilitar a Log de Redo.

* `Innodb_redo_log_capacity_resized`

  A capacidade total da log de redo para todos os arquivos de log de redo, em bytes, após a última operação de redimensionamento de capacidade concluída. O valor inclui arquivos de log de redo ordinários e de reserva.

  Se não houver nenhuma operação de redimensionamento para baixo pendente, `Innodb_redo_log_capacity_resized` deve ser igual a `innodb_redo_log_capacity` se estiver sendo usado. Consulte a documentação de `innodb_redo_log_capacity` para mais esclarecimentos. As operações de redimensionamento para cima são instantâneas.

  Para informações relacionadas, consulte a Seção 17.6.5, “Log de Redo”.

* `Innodb_redo_log_checkpoint_lsn`

  O LSN de verificação de log de redo. Para informações relacionadas, consulte a Seção 17.6.5, “Log de Redo”.

* `Innodb_redo_log_current_lsn`

  O LSN atual representa a última posição escrita no buffer de log de redo. O `InnoDB` escreve dados no buffer de log de redo dentro do processo MySQL antes de solicitar que o sistema operacional escreva os dados no arquivo de log de redo atual. Para informações relacionadas, consulte a Seção 17.6.5, “Log de Redo”.

* `Innodb_redo_log_flushed_to_disk_lsn`

  O LSN para disco. O `InnoDB` escreve dados primeiro no log de redo e, em seguida, solicita que o sistema operacional descarte os dados no disco. O LSN para disco representa a última posição no log de redo que o `InnoDB` sabe que foi descartado no disco. Para informações relacionadas, consulte a Seção 17.6.5, “Log de Redo”.

* `Innodb_redo_log_logical_size`

Um valor de tamanho de dados, em bytes, que representa o intervalo do log de redo em uso, contendo dados do log de redo em uso, abrangendo desde o bloco mais antigo necessário pelos consumidores do log de redo até o bloco escrito mais recente. Para informações relacionadas, consulte a Seção 17.6.5, “Log de Redo”.

* `Innodb_redo_log_physical_size`

  A quantidade de espaço em disco em bytes atualmente consumida por todos os arquivos de log de redo no disco, excluindo arquivos de log de redo de reserva. Para informações relacionadas, consulte a Seção 17.6.5, “Log de Redo”.

* `Innodb_redo_log_read_only`

  Se o log de redo é somente leitura.

* `Innodb_redo_log_resize_status`

  O status de redimensionamento do log de redo, indicando o estado atual do mecanismo de redimensionamento da capacidade do log de redo. Os valores possíveis incluem:

  + `OK`: Não há problemas e nenhuma operação pendente de redimensionamento da capacidade do log de redo.

  + `Resizing down`: Uma operação de redimensionamento para baixo está em andamento.

  Uma operação de redimensionamento para cima é instantânea e, portanto, não tem status pendente.

* `Innodb_redo_log_uuid`

  O UUID do log de redo.

* `Innodb_row_lock_current_waits`

  O número de bloqueios de linha atualmente aguardados por operações em tabelas `InnoDB`.

* `Innodb_row_lock_time`

  O tempo total gasto na aquisição de bloqueios de linha para tabelas `InnoDB`, em milissegundos.

* `Innodb_row_lock_time_avg`

  O tempo médio para adquirir um bloqueio de linha para tabelas `InnoDB`, em milissegundos.

* `Innodb_row_lock_time_max`

  O tempo máximo para adquirir um bloqueio de linha para tabelas `InnoDB`, em milissegundos.

* `Innodb_row_lock_waits`

  O número de vezes que operações em tabelas `InnoDB` tiveram que esperar por um bloqueio de linha.

* `Innodb_rows_deleted`

  O número de linhas excluídas das tabelas `InnoDB`.

* `Innodb_rows_inserted`

  O número de linhas inseridas nas tabelas `InnoDB`.

* `Innodb_rows_read`

  O número de linhas lidas das tabelas `InnoDB`.

* `Innodb_rows_updated`

O número estimado de linhas atualizadas nas tabelas do `InnoDB`.

Nota

Este valor não é 100% preciso. Para obter um resultado preciso (mas mais caro), use `ROW_COUNT()`.

* `Innodb_system_rows_deleted`

  O número de linhas excluídas das tabelas do `InnoDB` pertencentes a esquemas criados pelo sistema.

* `Innodb_system_rows_inserted`

  O número de linhas inseridas nas tabelas do `InnoDB` pertencentes a esquemas criados pelo sistema.

* `Innodb_system_rows_updated`

  O número de linhas atualizadas nas tabelas do `InnoDB` pertencentes a esquemas criados pelo sistema.

* `Innodb_system_rows_read`

  O número de linhas lidas das tabelas do `InnoDB` pertencentes a esquemas criados pelo sistema.

* `Innodb_truncated_status_writes`

  O número de vezes que o resultado da instrução `SHOW ENGINE INNODB STATUS` foi truncado.

* `Innodb_undo_tablespaces_active`

  O número de espaços de desfazer ativos. Inclui tanto espaços de desfazer implícitos (`InnoDB` criados) quanto explícitos (criados pelo usuário). Para informações sobre espaços de desfazer, consulte a Seção 17.6.3.4, “Espaços de Desfazer”.

* `Innodb_undo_tablespaces_explicit`

  O número de espaços de desfazer criados pelo usuário. Para informações sobre espaços de desfazer, consulte a Seção 17.6.3.4, “Espaços de Desfazer”.

* `Innodb_undo_tablespaces_implicit`

  O número de espaços de desfazer criados pelo `InnoDB`. Dois espaços de desfazer padrão são criados pelo `InnoDB` quando a instância do MySQL é inicializada. Para informações sobre espaços de desfazer, consulte a Seção 17.6.3.4, “Espaços de Desfazer”.

* `Innodb_undo_tablespaces_total`

  O número total de espaços de desfazer. Inclui tanto espaços de desfazer implícitos (`InnoDB` criados) quanto explícitos (criados pelo usuário), ativos e inativos. Para informações sobre espaços de desfazer, consulte a Seção 17.6.3.4, “Espaços de Desfazer”.

* `Key_blocks_not_flushed`

O número de blocos-chave no cache de chave `MyISAM` que foram alterados, mas ainda não foram descarregados no disco.

* `Key_blocks_unused`

  O número de blocos não utilizados no cache de chave `MyISAM`. Você pode usar esse valor para determinar quanto do cache de chave está em uso; veja a discussão sobre `key_buffer_size` na Seção 7.1.8, “Variáveis do Sistema do Servidor”.

* `Key_blocks_used`

  O número de blocos utilizados no cache de chave `MyISAM`. Esse valor é um limite máximo que indica o número máximo de blocos que já foram utilizados de uma vez.

* `Key_read_requests`

  O número de solicitações para ler um bloco-chave do cache de chave `MyISAM`.

* `Key_reads`

  O número de leituras físicas de um bloco-chave do disco para o cache de chave `MyISAM`. Se `Key_reads` for grande, então o valor de `key_buffer_size` provavelmente é muito pequeno. A taxa de falha de cache pode ser calculada como `Key_reads`/`Key_read_requests`.

* `Key_write_requests`

  O número de solicitações para escrever um bloco-chave no cache de chave `MyISAM`.

* `Key_writes`

  O número de escritas físicas de um bloco-chave do cache de chave `MyISAM` para o disco.

* `Last_query_cost`

  O custo total da última consulta compilada, conforme calculado pelo otimizador de consultas. Isso é útil para comparar o custo de diferentes planos de consulta para a mesma consulta. O valor padrão de 0 significa que nenhuma consulta foi compilada ainda. O valor padrão é 0. `Last_query_cost` tem escopo de sessão.

  Esta variável mostra o custo de consultas que têm múltiplos blocos de consulta, somando as estimativas de custo de cada bloco de consulta, estimativa de quantas vezes subconsultas não cacheáveis são executadas e multiplicando o custo desses blocos de consulta pelo número de execuções de subconsultas.

* `Last_query_partial_plans`

O número de iterações que o otimizador de consultas fez na construção do plano de execução para a consulta anterior.

`Last_query_partial_plans` tem escopo de sessão.

* `Locked_connects`

  O número de tentativas de conexão com contas de usuário bloqueadas. Para informações sobre bloqueio e desbloqueio de contas, consulte a Seção 8.2.20, “Bloqueio de Conta”.

* `Max_execution_time_exceeded`

  O número de instruções `SELECT` para as quais o tempo de execução foi excedido.

* `Max_execution_time_set`

  O número de instruções `SELECT` para as quais um tempo de execução não nulo foi definido. Isso inclui instruções que incluem uma dica de tempo de execução não nulo do otimizador, e instruções que incluem tal dica, mas executam enquanto o tempo de espera indicado pela variável de sistema `max_execution_time` é não nulo.

* `Max_execution_time_set_failed`

  O número de instruções `SELECT` para as quais a tentativa de definir um tempo de execução foi falha.

* `Max_used_connections`

  O número máximo de conexões que estiveram em uso simultaneamente desde que o servidor começou.

* `Max_used_connections_time`

  O tempo em que `Max_used_connections` atingiu seu valor atual.

* `Not_flushed_delayed_rows`

  Esta variável de status está desatualizada (porque as inserções `DELAYED` não são suportadas); espere que ela seja removida em uma futura versão.

* `mecab_charset`

  O conjunto de caracteres atualmente usado pelo plugin de parser de texto completo MeCab. Para informações relacionadas, consulte a Seção 14.9.9, “Plugin de Parser de Texto Completo MeCab”.

* `Ongoing_anonymous_transaction_count`

  Mostra o número de transações em andamento que foram marcadas como anônimas. Isso pode ser usado para garantir que nenhuma outra transação esteja aguardando processamento.

* `Ongoing_automatic_gtid_violating_transaction_count`

Esta variável de status está disponível apenas em compilações de depuração. Mostra o número de transações em andamento que usam `gtid_next=AUTOMATIC` e que violam a consistência do GTID.

* `Open_files`

  O número de arquivos abertos. Esse contagem inclui arquivos regulares abertos pelo servidor. Não inclui outros tipos de arquivos, como soquetes ou tubos. Além disso, o contagem não inclui arquivos que os motores de armazenamento abrem usando suas próprias funções internas, em vez de pedir ao nível do servidor para fazer isso.

* `Open_streams`

  O número de fluxos abertos (usados principalmente para registro).

* `Open_table_definitions`

  O número de definições de tabelas cacheadas.

* `Open_tables`

  O número de tabelas abertas.

* `Opened_files`

  O número de arquivos que foram abertos com `my_open()` (uma função da biblioteca `mysys`). Parte do servidor que abre arquivos sem usar essa função não incrementa o contagem.

* `Opened_table_definitions`

  O número de definições de tabelas que foram cacheadas.

* `Opened_tables`

  O número de tabelas que foram abertas. Se `Opened_tables` for grande, o valor do seu `table_open_cache` provavelmente é muito pequeno.

* `Performance_schema_xxx`

  As variáveis de status do Schema de Desempenho estão listadas na Seção 29.16, “Variáveis de Status do Schema de Desempenho”. Essas variáveis fornecem informações sobre instrumentação que não puderam ser carregadas ou criadas devido a restrições de memória.

* `Prepared_stmt_count`

  O número atual de declarações preparadas. (O número máximo de declarações é dado pela variável de sistema `max_prepared_stmt_count`.

* `Queries`

  O número de declarações executadas pelo servidor. Essa variável inclui declarações executadas dentro de programas armazenados, ao contrário da variável `Questions`. Não conta comandos `COM_PING` ou `COM_STATISTICS`.

A discussão no início desta seção indica como relacionar essa variável de status de contagem de declarações a outras variáveis semelhantes.

* `Perguntas`

  O número de declarações executadas pelo servidor. Isso inclui apenas declarações enviadas ao servidor pelos clientes e não declarações executadas dentro de programas armazenados, ao contrário da variável `Consultas`. Esta variável não conta os comandos `COM_PING`, `COM_STATISTICS`, `COM_STMT_PREPARE`, `COM_STMT_CLOSE` ou `COM_STMT_RESET`.

  A discussão no início desta seção indica como relacionar essa variável de status de contagem de declarações a outras variáveis semelhantes.

* `Replica_open_tables_temp`

  `Replica_open_tables_temp` mostra o número de tabelas temporárias que o thread de SQL de replicação atualmente tem abertas. Se o valor for maior que zero, não é seguro desligar a replica; veja a Seção 19.5.1.32, “Replicação e Tabelas Temporárias”. Esta variável relata o total de tabelas temporárias abertas para *todos* os canais de replicação.

* `Grupo_de_recursos_suportável`

  Indica se o recurso do grupo de recursos é suportado.

  Em algumas plataformas ou configurações do servidor MySQL, os grupos de recursos não estão disponíveis ou têm limitações. Em particular, os sistemas Linux podem exigir uma etapa manual para alguns métodos de instalação. Para detalhes, consulte Restrições de Grupo de Recursos.

* `Rpl_semi_sync_master_clients`

  O número de réplicas semi-síncronas.

  Símbolo desatualizado para `Rpl_semi_sync_source_clients`.

* `Rpl_semi_sync_master_net_avg_wait_time`

  Símbolo desatualizado para `Rpl_semi_sync_source_net_avg_wait_time`.

* `Rpl_semi_sync_master_net_wait_time`

  Símbolo desatualizado para `Rpl_semi_sync_source_net_wait_time`.

* `Rpl_semi_sync_master_net_waits`

  O número total de vezes que a fonte esperou por respostas da replica.

Sinônimos desatualizados para `Rpl_semi_sync_source_net_waits`.

* `Rpl_semi_sync_master_no_times`

  Sinônimo desatualizado para `Rpl_semi_sync_source_no_times`.

* `Rpl_semi_sync_master_no_tx`

  Sinônimo desatualizado para `Rpl_semi_sync_source_no_tx`.

* `Rpl_semi_sync_master_status`

  Sinônimo desatualizado para `Rpl_semi_sync_source_status`.

* `Rpl_semi_sync_master_timefunc_failures`

  Sinônimo desatualizado para `Rpl_semi_sync_source_timefunc_failures`.

* `Rpl_semi_sync_master_tx_avg_wait_time`

  Sinônimo desatualizado para `Rpl_semi_sync_source_tx_avg_wait_time`.

* `Rpl_semi_sync_master_tx_wait_time`

  Sinônimo desatualizado para `Rpl_semi_sync_source_tx_wait_time`.

* `Rpl_semi_sync_master_tx_waits`

  Sinônimo desatualizado para `Rpl_semi_sync_source_tx_waits`.

* `Rpl_semi_sync_master_wait_pos_backtraverse`

  Sinônimo desatualizado para `Rpl_semi_sync_source_wait_pos_backtraverse`.

* `Rpl_semi_sync_master_wait_sessions`

  Sinônimo desatualizado para `Rpl_semi_sync_source_wait_sessions`.

* `Rpl_semi_sync_master_yes_tx`

  Sinônimo desatualizado para `Rpl_semi_sync_source_yes_tx`.

* `Rpl_semi_sync_source_clients`

  Número de réplicas semissincronizadas.

  Disponível quando o plugin `rpl_semi_sync_source` (`biblioteca `semisync_source.so`) é instalado na fonte.

* `Rpl_semi_sync_source_net_avg_wait_time`

  O tempo médio em microsegundos que a fonte esperou por uma resposta da réplica. Esta variável é sempre `0` e está desatualizada; espere que ela seja removida em uma versão futura.

  Disponível quando o plugin `rpl_semi_sync_source` (`biblioteca `semisync_source.so`) é instalado na fonte.

* `Rpl_semi_sync_source_net_wait_time`

  O tempo total em microsegundos que a fonte esperou por respostas das réplicas. Esta variável é sempre `0` e está desatualizada; espere que ela seja removida em uma versão futura.

Disponível quando o plugin `rpl_semi_sync_source` (`biblioteca semisync_source.so`) está instalado na fonte.

* `Rpl_semi_sync_source_net_waits`

  O número total de vezes que a fonte esperou por respostas da replica.

  Disponível quando o plugin `rpl_semi_sync_source` (`biblioteca semisync_source.so`) está instalado na fonte.

* `Rpl_semi_sync_source_no_times`

  O número de vezes que a fonte desativou a replicação semiesincronizada.

  Disponível quando o plugin `rpl_semi_sync_source` (`biblioteca semisync_source.so`) está instalado na fonte.

* `Rpl_semi_sync_source_no_tx`

  O número de commits que não foram reconhecidos com sucesso por uma replica.

  Disponível quando o plugin `rpl_semi_sync_source` (`biblioteca semisync_source.so`) está instalado na fonte.

* `Rpl_semi_sync_source_status`

  Se a replicação semiesincronizada está atualmente operacional na fonte. O valor é `ON` se o plugin foi habilitado e um reconhecimento de commit ocorreu. É `OFF` se o plugin não estiver habilitado ou a fonte tiver retornado à replicação assíncrona devido ao tempo limite de reconhecimento de commit.

  Disponível quando o plugin `rpl_semi_sync_source` (`biblioteca semisync_source.so`) está instalado na fonte.

* `Rpl_semi_sync_source_timefunc_failures`

  O número de vezes que a fonte falhou ao chamar funções de tempo, como `gettimeofday()`.

  Disponível quando o plugin `rpl_semi_sync_source` (`biblioteca semisync_source.so`) está instalado na fonte.

* `Rpl_semi_sync_source_tx_avg_wait_time`

  O tempo médio em microsegundos que a fonte esperou por cada transação.

  Disponível quando o plugin `rpl_semi_sync_source` (`biblioteca semisync_source.so`) está instalado na fonte.

* `Rpl_semi_sync_source_tx_wait_time`

O tempo total em microsegundos que a fonte esperou por transações.

Disponível quando o plugin `rpl_semi_sync_source` (`biblioteca semisync_source.so`) está instalado na fonte.

* `Rpl_semi_sync_source_tx_waits`

O número total de vezes que a fonte esperou por transações.

Disponível quando o plugin `rpl_semi_sync_source` (`biblioteca semisync_source.so`) está instalado na fonte.

* `Rpl_semi_sync_source_wait_pos_backtraverse`

O número total de vezes que a fonte esperou por um evento com coordenadas binárias menores que os eventos esperados anteriormente. Isso pode ocorrer quando a ordem em que as transações começam a esperar por uma resposta é diferente da ordem em que seus eventos de log binário são escritos.

Disponível quando o plugin `rpl_semi_sync_source` (`biblioteca semisync_source.so`) está instalado na fonte.

* `Rpl_semi_sync_source_wait_sessions`

O número de sessões atualmente esperando por respostas da replica.

Disponível quando o plugin `rpl_semi_sync_source` (`biblioteca semisync_source.so`) está instalado na fonte.

* `Rpl_semi_sync_source_yes_tx`

O número de commits que foram reconhecidos com sucesso por uma replica.

Disponível quando o plugin `rpl_semi_sync_source` (`biblioteca semisync_source.so`) está instalado na fonte.

* `Rpl_semi_sync_replica_status`

Mostra se a replicação semisoincronizada está atualmente operacional na replica. É `ON` se o plugin foi habilitado e o thread de I/O de replicação (receptor) está em execução, `OFF` caso contrário.

Disponível quando o plugin `rpl_semi_sync_source` (`biblioteca semisync_source.so`) está instalado na fonte.

* `Rpl_semi_sync_slave_status`

Símbolo desatualizado para `Rpl_semi_sync_replica_status`.

* `Rsa_public_key`

O valor desta variável é a chave pública usada pelo plugin de autenticação `sha256_password` (desatualizado) para a troca de senhas baseada em pares de chaves RSA. O valor só não é nulo se o servidor inicializar com sucesso as chaves privada e pública nos arquivos nomeados pelas variáveis de sistema `sha256_password_private_key_path` e `sha256_password_public_key_path`. O valor de `Rsa_public_key` vem do último arquivo.

Para informações sobre `sha256_password`, consulte a Seção 8.4.1.2, “Autenticação Conectada a SHA-256”.

* `Secondary_engine_execution_count`

  Para uso apenas com MySQL HeatWave. Consulte Variáveis de Status, para mais informações.

* `Select_full_join`

  O número de junções que realizam varreduras de tabela porque não usam índices. Se esse valor não for 0, você deve verificar cuidadosamente os índices de suas tabelas.

* `Select_full_range_join`

  O número de junções que usaram uma busca de intervalo em uma tabela de referência.

* `Select_range`

  O número de junções que usaram intervalos na primeira tabela. Isso normalmente não é um problema crítico, mesmo que o valor seja bastante grande.

* `Select_range_check`

  O número de junções sem chaves que verificam o uso de chave após cada linha. Se esse valor não for 0, você deve verificar cuidadosamente os índices de suas tabelas.

* `Select_scan`

  O número de junções que realizaram uma varredura completa da primeira tabela.

* `Slave_open_temp_tables`

  Alias desatualizado para `Replica_open_temp_tables`.

* `Slave_rows_last_search_algorithm_used`

  Alias desatualizado para `Replica_rows_last_search_algorithm_used`.

* `Slow_launch_threads`

  O número de threads que levaram mais de `slow_launch_time` segundos para serem criados.

* `Slow_queries`

O número de consultas que levaram mais de `long_query_time` segundos. Esse contador é incrementado independentemente de o log de consultas lentas estar habilitado. Para obter informações sobre esse log, consulte a Seção 7.4.5, “O Log de Consultas Lentas”.

* `Sort_merge_passes`

  O número de passes de fusão que o algoritmo de ordenação teve que realizar. Se esse valor for grande, você deve considerar aumentar o valor da variável de sistema `sort_buffer_size`.

* `Sort_range`

  O número de ordenações realizadas usando intervalos.

* `Sort_rows`

  O número de linhas ordenadas.

* `Sort_scan`

  O número de ordenações realizadas por varredura da tabela.

* `Ssl_accept_renegotiates`

  O número de negociações necessárias para estabelecer a conexão.

* `Ssl_accepts`

  O número de conexões SSL aceitas.

* `Ssl_callback_cache_hits`

  O número de acessos ao cache de callback.

* `Ssl_cipher`

  O algoritmo de criptografia atual (vazio para conexões não criptografadas).

* `Ssl_cipher_list`

  A lista de possíveis cifradores SSL (vazio para conexões não SSL). Se o MySQL suportar TLSv1.3, o valor inclui os possíveis cifradores TLSv1.3. Consulte a Seção 8.3.2, “Protocolos e Cifradores TLS de Conexão Encriptada”.

* `Ssl_client_connects`

  O número de tentativas de conexão SSL para um servidor de origem de replicação habilitado para SSL.

* `Ssl_connect_renegotiates`

  O número de negociações necessárias para estabelecer a conexão com um servidor de origem de replicação habilitado para SSL.

* `Ssl_ctx_verify_depth`

  A profundidade de verificação do contexto SSL (quantos certificados na cadeia são testados).

* `Ssl_ctx_verify_mode`

  O modo de verificação do contexto SSL.

* `Ssl_default_timeout`

  O timeout padrão do SSL.

* `Ssl_finished_accepts`

  O número de conexões SSL bem-sucedidas com o servidor.

* `Ssl_finished_connects`

O número de conexões de replicação bem-sucedidas a um servidor de origem de replicação habilitado para SSL.

* `Ssl_server_not_after`

  A última data em que o certificado SSL é válido. Para verificar as informações de expiração do certificado SSL, use esta declaração:

  ```
  mysql> SHOW STATUS LIKE 'Ssl_server_not%';
  +-----------------------+--------------------------+
  | Variable_name         | Value                    |
  +-----------------------+--------------------------+
  | Ssl_server_not_after  | Apr 28 14:16:39 2025 GMT |
  | Ssl_server_not_before | May  1 14:16:39 2015 GMT |
  +-----------------------+--------------------------+
  ```

* `Ssl_server_not_before`

  A primeira data em que o certificado SSL é válido.

* `Ssl_session_cache_hits`

  O número de acessos ao cache de sessão SSL.

* `Ssl_session_cache_misses`

  O número de acessos ao cache de sessão SSL que não foram atendidos.

* `Ssl_session_cache_mode`

  O modo do cache de sessão SSL. Quando o valor da variável `ssl_session_cache_mode` do servidor é `ON`, o valor da variável `Ssl_session_cache_mode` do status é `SERVER`.

* `Ssl_session_cache_overflows`

  O número de overflows do cache de sessão SSL.

* `Ssl_session_cache_size`

  O tamanho do cache de sessão SSL.

* `Ssl_session_cache_timeout`

  O valor de tempo de espera em segundos das sessões SSL no cache.

* `Ssl_session_cache_timeouts`

  O número de tempo de espera de cache de sessão SSL.

* `Ssl_sessions_reused`

  Este valor é igual a 0 se o TLS não foi usado na sessão MySQL atual, ou se uma sessão TLS não foi reutilizada; caso contrário, é igual a 1.

  `Ssl_sessions_reused` tem escopo de sessão.

* `Ssl_used_session_cache_entries`

  Quantas entradas do cache de sessão SSL foram usadas.

* `Ssl_verify_depth`

  A profundidade de verificação para conexões SSL de replicação.

* `Ssl_verify_mode`

  O modo de verificação usado pelo servidor para uma conexão que usa SSL. O valor é uma máscara de bits; os bits são definidos no arquivo de cabeçalho `openssl/ssl.h`:

  ```
  # define SSL_VERIFY_NONE                 0x00
  # define SSL_VERIFY_PEER                 0x01
  # define SSL_VERIFY_FAIL_IF_NO_PEER_CERT 0x02
  # define SSL_VERIFY_CLIENT_ONCE          0x04
  ```

`SSL_VERIFY_PEER` indica que o servidor solicita um certificado do cliente. Se o cliente fornecer um, o servidor realiza a verificação e prossegue apenas se a verificação for bem-sucedida. `SSL_VERIFY_CLIENT_ONCE` indica que um pedido para o certificado do cliente é realizado apenas no handshake inicial.

* `Ssl_version`

  A versão do protocolo SSL da conexão (por exemplo, TLSv1.2). Se a conexão não estiver criptografada, o valor é vazio.

* `Table_locks_immediate`

  O número de vezes que um pedido para um bloqueio de tabela pode ser concedido imediatamente.

* `Table_locks_waited`

  O número de vezes que um pedido para um bloqueio de tabela não pôde ser concedido imediatamente e uma espera foi necessária. Se este valor for alto e você tiver problemas de desempenho, você deve primeiro otimizar suas consultas e, em seguida, dividir sua(s) tabela(s) ou usar replicação.

* `Table_open_cache_hits`

  O número de acessos para consultas de cache de tabelas abertas.

* `Table_open_cache_misses`

  O número de erros de acesso para consultas de cache de tabelas abertas.

* `Table_open_cache_overflows`

  O número de overflow para o cache de tabelas abertas. Este é o número de vezes, após uma tabela ser aberta ou fechada, que uma instância do cache tem uma entrada não utilizada e o tamanho da instância é maior que `table_open_cache` / `table_open_cache_instances`.

* `Table_open_cache_triggers_hits`

  O número de acessos de cache para tabelas abertas com triggers. Este número é incrementado em 1 quando uma tabela com triggers é encontrada por uma operação de modificação de dados na lista de tabelas não utilizadas que têm triggers no cache de tabelas. Quando tal tabela é o objeto de uma operação de leitura apenas, como `SELECT`, a tabela é tratada como se não tivesse triggers, e `Table_open_cache_hits` é incrementado em vez disso.

* `Table_open_cache_triggers_misses`

O número de falhas de cache para tabelas abertas com gatilhos. Esse número é incrementado em 1 quando uma tabela com gatilhos não é encontrada por uma operação de modificação de dados pendente na lista de tabelas não utilizadas com gatilhos no cache de tabelas. Se a operação pendente na tabela for de leitura apenas, como no caso de uma instrução `SELECT`, a tabela é tratada como se não tivesse gatilhos, e `Table_open_cache_misses` é incrementado em vez disso.

* `Table_open_cache_triggers_overflows`

  O número de transbordamentos de cache para tabelas abertas com gatilhos. Esse número é incrementado em 1 quando há mais tabelas com gatilhos em uma determinada instância do cache de tabelas do que o máximo. Ou seja, essa variável de status é incrementada quando `Table_open_cache_triggers_hits` excede o número máximo por instância de cache de tabelas com gatilhos; esse máximo é determinado por `table_open_cache_triggers` / `table_open_cache_instances`.

  Nota

  `Table_open_cache_triggers_hits` é afetado apenas por operações de modificação de dados. Assim, quando uma operação de leitura apenas, como `SELECT`, acessa uma tabela com gatilhos, `Table_open_cache_triggers_overflows` também não é afetado. Uma operação de leitura apenas em uma tabela com gatilhos incrementa `Table_open_cache_hits`; se `Table_open_cache_hits` então exceder o limite determinado por `table_open_cache` / `table_open_cache_instances`, `Table_open_cache_overflows` é incrementado em vez disso.

* `Tc_log_max_pages_used`

Para a implementação mapeada à memória do log que é usada pelo **mysqld** quando atua como coordenador de transações para a recuperação de transações internas XA, essa variável indica o maior número de páginas usadas para o log desde que o servidor foi iniciado. Se o produto de `Tc_log_max_pages_used` e `Tc_log_page_size` for sempre significativamente menor que o tamanho do log, o tamanho é maior do que o necessário e pode ser reduzido. (O tamanho é definido pela opção `--log-tc-size`. Essa variável é inutilizada: não é necessária para a recuperação com log binário, e o método de log de recuperação mapeado à memória não é usado a menos que o número de motores de armazenamento capazes de dois estágios de compromisso e que suportam transações XA seja maior que um. (`InnoDB` é o único motor aplicável.)

* `Tc_log_page_size`

  O tamanho da página usado para a implementação mapeada à memória do log de recuperação XA. O valor padrão é determinado usando `getpagesize()`. Essa variável é inutilizada pelos mesmos motivos descritos para `Tc_log_max_pages_used`.

* `Tc_log_page_waits`

  Para a implementação mapeada à memória do log de recuperação, essa variável é incrementada toda vez que o servidor não conseguiu comprometer uma transação e teve que esperar por uma página livre no log. Se esse valor for grande, você pode querer aumentar o tamanho do log (com a opção `--log-tc-size`). Para a recuperação com log binário, essa variável é incrementada toda vez que o log binário não pode ser fechado porque há dois estágios de compromisso em andamento. (A operação de fechamento aguarda até que todas essas transações sejam concluídas.)

* `Telemetry_metrics_supported`

  Se as métricas de telemetria do servidor são suportadas.

  Para mais informações, consulte a seção *Serviço de métricas de telemetria do servidor* na documentação do Código-fonte do MySQL.

* `Telemetry_logs_supported`

Mostra se o servidor foi compilado com suporte a logs de telemetria.

Para mais informações, consulte a seção *Serviço de logs de telemetria do servidor* na documentação do código-fonte do MySQL e o Capítulo 35, *Telemetria*.

* `telemetry.live_sessions`

Mostra o número atual de sessões instrumentadas com telemetria. Isso pode ser útil ao descarregar o componente Telemetria, para monitorar quantas sessões estão bloqueando a operação de descarregamento.

Para mais informações, consulte a seção *Serviço de traços de telemetria do servidor* na documentação do código-fonte do MySQL e o Capítulo 35, *Telemetria*.

* `Telemetry_traces_supported`

Se o rastreamento de telemetria do servidor é suportado.

Para mais informações, consulte a seção *Serviço de rastreamento de telemetria do servidor* na documentação do código-fonte do MySQL.

* `telemetry.run_level`

Indica o estado atual de inicialização do componente Telemetria. Os códigos incluem:

+ `BOOT`: O componente Telemetria está sendo carregado.

+ `INSTALL`: O componente Telemetria está carregado e inicializando.

+ `DETECT_RESOURCE`: O componente Telemetria detectou um provedor de recursos e está verificando a disponibilidade do provedor. Se o provedor estiver disponível, o detector de recursos é invocado. Se o provedor estiver indisponível, o componente Telemetria aguarda até que o provedor seja carregado.

+ `DECODE_SECRET`: O componente Telemetria está sendo carregado e detectou que um `telemetry.secret_provider` foi configurado.

Se o componente do provedor de segredo estiver disponível, o componente de telemetria invoca o provedor de segredo. Se o componente do provedor de segredo não estiver disponível, o componente de telemetria aguarda até que o componente do provedor de segredo seja carregado.

+ `CONFIGURAR`: Todas as configurações necessárias são coletadas, incluindo um recurso do provedor de recursos e segredos do provedor de segredos, se necessário, a inicialização do componente de telemetria prossegue para a configuração do componente.

+ `PRONTO`: A configuração do componente foi bem-sucedida.

+ `FALHOU`: A configuração do componente falhou e não foi concluída.

+ `DESINSTALAR`: O componente de telemetria está sendo removido e a limpeza começou.

Para mais informações, consulte o Capítulo 35, *Telemetria*.

* `TempTable_count_hit_max_ram`

  O número de tabelas temporárias internas que foram convertidas no disco porque o motor `TempTable` atingiu o limite `temptable_max_ram`.

* `Threads_cached`

  O número de threads na cache de threads.

* `Threads_connected`

  O número de conexões abertas atualmente.

* `Threads_created`

  O número de threads criados para lidar com as conexões. Se `Threads_created` for grande, você pode querer aumentar o valor `thread_cache_size`. A taxa de falha de cache pode ser calculada como `Threads_created`/`Conexões`.

* `Threads_running`

  O número de threads que não estão dormindo.

* `Tls_library_version`

  A versão do tempo de execução da biblioteca OpenSSL que está sendo usada para esta instância do MySQL.

* `Tls_sni_server_name`

  O Nome do Servidor de Indicação (SNI) que está sendo usado para esta sessão, se especificado pelo cliente; caso contrário, vazio. O SNI é uma extensão do protocolo TLS (o OpenSSL deve ser compilado com extensões TLS para que essa variável de status funcione). A implementação do MySQL do SNI representa apenas o lado do cliente.

* `Uptime`

  O número de segundos que o servidor está ativo.

* `Uptime_since_flush_status`

  O número de segundos desde a última declaração `FLUSH STATUS`.