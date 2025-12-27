### 7.1.10 Variáveis de Status do Servidor

O servidor MySQL mantém muitas variáveis de status que fornecem informações sobre sua operação. Você pode visualizar essas variáveis e seus valores usando a instrução `SHOW [GLOBAL | SESSION] STATUS` (consulte  Seção 15.7.7.37, “Instrução SHOW STATUS”). A palavra-chave opcional `GLOBAL` agrega os valores sobre todas as conexões, e `SESSION` mostra os valores para a conexão atual.

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

Esta seção fornece uma descrição de cada variável de status. Para um resumo das variáveis de status, consulte a Seção 7.1.6, “Referência de Variáveis de Status do Servidor”. Para informações sobre variáveis de status específicas do NDB Cluster, consulte a Seção 25.4.3.9.3, “Variáveis de Status do NDB Cluster”.

As variáveis de status têm os seguintes significados.

*  `Aborted_clients`

  O número de conexões que foram abortadas porque o cliente morreu sem fechar a conexão corretamente. Consulte a Seção B.3.2.9, “Erros de Comunicação e Conexões Abortadas”.
*  `Aborted_connects`

  O número de tentativas falhadas de conectar ao servidor MySQL. Consulte  Seção B.3.2.9, “Erros de Comunicação e Conexões Abortadas”.

  Para informações adicionais relacionadas à conexão, consulte as variáveis de status `Connection_errors_xxx` e a tabela `host_cache`.
*  `Authentication_ldap_sasl_supported_methods`

  O plugin `authentication_ldap_sasl` que implementa a autenticação LDAP SASL suporta vários métodos de autenticação, mas, dependendo da configuração do sistema do host, eles podem não estar todos disponíveis. A variável `Authentication_ldap_sasl_supported_methods` fornece a descoberta dos métodos suportados. Seu valor é uma string composta por nomes de métodos de autenticação separados por espaços. Exemplo: `"SCRAM-SHA 1 SCRAM-SHA-256 GSSAPI"`
*  `Binlog_cache_disk_use`

O número de transações que utilizaram o cache temporário de log binário, mas que excederam o valor de `binlog_cache_size` e usaram um arquivo temporário para armazenar instruções da transação.

O número de instruções não-transacionais que fizeram com que o cache de transações de log binário fosse escrito em disco é rastreado separadamente na variável de status `Binlog_stmt_cache_disk_use`.
* `Acl_cache_items_count`

O número de objetos de privilégio armazenados no cache. Cada objeto é a combinação de privilégio de um usuário e seus papéis ativos.
* `Binlog_cache_use`

O número de transações que utilizaram o cache de log binário.
* `Binlog_stmt_cache_disk_use`

O número de instruções não-transacionais que utilizaram o cache de instruções de log binário, mas que excederam o valor de `binlog_stmt_cache_size` e usaram um arquivo temporário para armazenar essas instruções.
* `Binlog_stmt_cache_use`

O número de instruções não-transacionais que utilizaram o cache de instruções de log binário.
* `Bytes_received`

O número de bytes recebidos de todos os clientes.
* `Bytes_sent`

O número de bytes enviados para todos os clientes.
* `Caching_sha2_password_rsa_public_key`

A chave pública usada pelo plugin de autenticação `caching_sha2_password` para a troca de senhas com par de chaves RSA. O valor não é vazio apenas se o servidor inicializar com sucesso as chaves privadas e públicas nos arquivos nomeados pelas variáveis de sistema `caching_sha2_password_private_key_path` e `caching_sha2_password_public_key_path`. O valor de `Caching_sha2_password_rsa_public_key` vem do último arquivo.
* `Com_xxx`

As variáveis de contador de instruções `Com_xxx` indicam o número de vezes que cada instrução *`xxx`* foi executada. Há uma variável de status para cada tipo de instrução. Por exemplo, `Com_delete` e `Com_update` contam as instruções `DELETE` e `UPDATE`, respectivamente. `Com_delete_multi` e `Com_update_multi` são semelhantes, mas se aplicam a instruções `DELETE` e `UPDATE` que usam sintaxe de múltiplas tabelas.

Todas as variáveis `Com_stmt_xxx` são incrementadas mesmo que um argumento de declaração preparada seja desconhecido ou que um erro tenha ocorrido durante a execução. Em outras palavras, seus valores correspondem ao número de solicitações emitidas, e não ao número de solicitações concluídas com sucesso. Por exemplo, como as variáveis de status são inicializadas para cada inicialização do servidor e não persistem em reinicializações, as variáveis `Com_restart` e `Com_shutdown` que rastreiam as declarações `RESTART` e `SHUTDOWN` normalmente têm um valor de zero, mas podem ser não nulos se as declarações `RESTART` ou `SHUTDOWN` foram executadas, mas falharam.

As variáveis de status `Com_stmt_xxx` são as seguintes:

+ `Com_stmt_prepare`
+ `Com_stmt_execute`
+ `Com_stmt_fetch`
+ `Com_stmt_send_long_data`
+ `Com_stmt_reset`
+ `Com_stmt_close`

Esses são comandos de declarações preparadas. Seus nomes referem-se ao conjunto de comandos `COM_xxx` usado na camada de rede. Em outras palavras, seus valores aumentam sempre que chamadas da API de declarações preparadas, como `mysql_stmt_prepare()`, `mysql_stmt_execute()` e assim por diante, são executadas. No entanto, `Com_stmt_prepare`, `Com_stmt_execute` e `Com_stmt_close` também aumentam para `PREPARE`, `EXECUTE` ou `DEALLOCATE PREPARE`, respectivamente. Além disso, os valores das variáveis de contador de declarações mais antigas `Com_prepare_sql`, `Com_execute_sql` e `Com_dealloc_sql` aumentam para as declarações `PREPARE`, `EXECUTE` e `DEALLOCATE PREPARE`. `Com_stmt_fetch` representa o número total de viagens de ida e volta na rede emitidas ao buscar em cursors.

`Com_stmt_reprepare` indica o número de vezes que as declarações foram automaticamente repreparadas pelo servidor, por exemplo, após alterações de metadados em tabelas ou visualizações referenciadas pela declaração. Uma operação de repreparação incrementa `Com_stmt_reprepare` e também `Com_stmt_prepare`.

`Com_explain_other` indica o número de declarações `EXPLAIN FOR CONNECTION` executadas. Veja a Seção 10.8.4, “Obtendo Informações do Plano de Execução para uma Conexão Nomeada”.

`Com_change_repl_filter` indica o número de declarações `FILTER DE REPLICA DE MUDANÇA` executadas.
*  `Compression`

  Se a conexão do cliente usa compressão no protocolo cliente/servidor.

  Esta variável de status está desatualizada; espere-se que seja removida em uma versão futura do MySQL. Consulte Configuração da Compressão de Conexão Legado.
*  `Compression_algorithm`

  O nome do algoritmo de compressão em uso para a conexão atual com o servidor. O valor pode ser qualquer algoritmo permitido no valor da variável de sistema `protocol_compression_algorithms`. Por exemplo, o valor é `uncompressed` se a conexão não usar compressão, ou `zlib` se a conexão usar o algoritmo `zlib`.

  Para mais informações, consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.
*  `Compression_level`

  O nível de compressão em uso para a conexão atual com o servidor. O valor é 6 para conexões `zlib` (o nível de compressão padrão do algoritmo `zlib`), 1 a 22 para conexões `zstd`, e 0 para conexões `uncompressed`.

  Para mais informações, consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.
*  `Connection_errors_xxx`

  Essas variáveis fornecem informações sobre erros que ocorrem durante o processo de conexão do cliente. Elas são globais apenas e representam contagens de erros agregadas em todas as conexões de todos os hosts. Essas variáveis rastreiam erros que não são contabilizados pelo cache do host (consulte Seção 7.1.12.3, “Consultas DNS e o Cache do Host”), como erros que não estão associados a conexões TCP, ocorrem muito cedo no processo de conexão (mesmo antes de um endereço IP ser conhecido) ou não são específicos de qualquer endereço IP particular (como condições de memória insuficiente).

  +  `Connection_errors_accept`

    O número de erros que ocorreram durante chamadas a `accept()` na porta de escuta.
  +  `Connection_errors_internal`

O número de conexões recusadas devido a erros internos no servidor, como falha ao iniciar um novo thread ou condição de memória insuficiente.
  +  `Connection_errors_max_connections`

    O número de conexões recusadas porque o limite de conexões `max_connections` do servidor foi atingido.
  +  `Connection_errors_peer_address`

    O número de erros que ocorreram ao buscar endereços IP de clientes conectados.
  +  `Connection_errors_select`

    O número de erros que ocorreram durante chamadas a `select()` ou `poll()` na porta de escuta. (A falha nesta operação não significa necessariamente que uma conexão com o cliente foi rejeitada.)
  +  `Connection_errors_tcpwrap`

    O número de conexões recusadas pela biblioteca `libwrap`.
*  `Connections`

    O número de tentativas de conexão (sucedidas ou não) ao servidor MySQL.
*  `Created_tmp_disk_tables`

    O número de tabelas temporárias internas em disco criadas pelo servidor enquanto executa instruções.

  Você pode comparar o número de tabelas temporárias internas em disco criadas com o número total de tabelas temporárias internas criadas comparando os valores de `Created_tmp_disk_tables` e `Created_tmp_tables`.

  ::: info Nota

  Devido a uma limitação conhecida, `Created_tmp_disk_tables` não conta as tabelas temporárias em disco criadas em arquivos mapeados em memória. Por padrão, o mecanismo de overflow do mecanismo de armazenamento TempTable cria tabelas temporárias internas em arquivos mapeados em memória. Esse comportamento é controlado pela variável `temptable_use_mmap`.

  :::

  Veja também  Seção 10.4.4, “Uso de Tabelas Temporárias Internas no MySQL”.
*  `Created_tmp_files`

    Quantos arquivos temporários `mysqld` criou.
*  `Created_tmp_tables`

    O número de tabelas temporárias internas criadas pelo servidor enquanto executa instruções.

  Você pode comparar o número de tabelas temporárias internas em disco criadas com o número total de tabelas temporárias internas criadas comparando os valores de `Created_tmp_disk_tables` e `Created_tmp_tables`.

Veja também a Seção 10.4.4, “Uso de Tabelas Temporárias Internas no MySQL”.

Cada invocação da instrução `SHOW STATUS` usa uma tabela temporária interna e incrementa o valor global `Created_tmp_tables`.
* `Current_tls_ca`

O valor ativo `ssl_ca` no contexto SSL que o servidor usa para novas conexões. Esse valor do contexto pode diferir do valor atual da variável de sistema `ssl_ca` se a variável de sistema tiver sido alterada, mas a instrução `ALTER INSTANCE RELOAD TLS` não tiver sido executada posteriormente para reconfigurar o contexto SSL a partir dos valores das variáveis de sistema relacionadas ao contexto e atualizar as variáveis de status correspondentes. (Essa possível diferença de valores se aplica a cada par correspondente de variáveis de sistema e status relacionadas ao contexto. Consulte Configuração e Monitoramento de Execução no Lado do Servidor para Conexões Encriptadas.)

Os valores das variáveis de status `Current_tls_xxx` também estão disponíveis através da tabela `tls_channel_status` do Schema de Desempenho. Veja a Seção 29.12.22.9, “A Tabela `tls_channel_status`”.
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

  ::: info Nota

  Quando você recarregar o contexto TLS, o OpenSSL recarrega o arquivo contendo a CRL (lista de revogação de certificados) como parte do processo. Se o arquivo CRL for grande, o servidor aloca um grande pedaço de memória (dez vezes o tamanho do arquivo), que é dobrado enquanto a nova instância está sendo carregada e a antiga ainda não foi liberada. O uso da memória residente do processo não é imediatamente reduzido após uma grande alocação ser liberada, então se você emitir a declaração `ALTER INSTANCE RELOAD TLS` repetidamente com um grande arquivo CRL, o uso da memória residente do processo pode crescer como resultado disso.

  :::

Esta variável de status está desatualizada (porque as inserções `DELAYED` não são suportadas); espere-se que seja removida em uma futura versão.
*  `Delayed_insert_threads`

  Esta variável de status está desatualizada (porque as inserções `DELAYED` não são suportadas); espere-se que seja removida em uma futura versão.
*  `Delayed_writes`

  Esta variável de status está desatualizada (porque as inserções `DELAYED` não são suportadas); espere-se que seja removida em uma futura versão.
*  `Deprecated_use_i_s_processlist_count`

  Quantas vezes a tabela `information_schema.processlist` foi acessada desde o último reinício.
*  `Deprecated_use_i_s_processlist_last_timestamp`

  Um timestamp indicando a última vez que a tabela `information_schema.processlist` foi acessada desde o último reinício. Mostra microsegundos desde o Unix Epoch.
*  `dragnet.Status`

  O resultado da atribuição mais recente à variável de sistema `dragnet.log_error_filter_rules`, vazia se nenhuma atribuição ocorreu.
*  `Error_log_buffered_bytes`

  O número de bytes atualmente usados na tabela `error_log` do Schema de Desempenho. É possível que o valor diminua, por exemplo, se um novo evento não cabe até descartar um evento antigo, mas o novo evento é menor que o antigo.
*  `Error_log_buffered_events`

  O número de eventos atualmente presentes na tabela `error_log` do Schema de Desempenho. Como com `Error_log_buffered_bytes`, é possível que o valor diminua.
*  `Error_log_expired_events`

  O número de eventos descartados da tabela `error_log` do Schema de Desempenho para dar lugar a novos eventos.
*  `Error_log_latest_write`

  A hora da última escrita na tabela `error_log` do Schema de Desempenho.
*  `Flush_commands`

O número de vezes que o servidor esvazia tabelas, seja porque um usuário executou uma instrução `FLUSH TABLES` ou devido a uma operação interna do servidor. Ele também é incrementado com a recepção de um pacote `COM_REFRESH`. Isso contrasta com `Com_flush`, que indica quantas instruções `FLUSH` foram executadas, seja `FLUSH TABLES`, `FLUSH LOGS`, e assim por diante.
*  `Global_connection_memory`

  A memória usada por todas as conexões de usuário ao servidor. A memória usada por threads do sistema ou pela conta raiz do MySQL está incluída no total, mas tais threads ou usuários não estão sujeitos à desconexão devido ao uso de memória. Essa memória não é calculada a menos que `global_connection_memory_tracking` esteja habilitado (desabilitado por padrão). O Schema de Desempenho também deve estar habilitado.

  Você pode controlar (indiretamente) a frequência com que essa variável é atualizada configurando `connection_memory_chunk_size`.
*  `Handler_commit`

  O número de instruções `COMMIT` internas.
*  `Handler_delete`

  O número de vezes em que linhas foram excluídas das tabelas.
*  `Handler_external_lock`

  O servidor incrementa essa variável para cada chamada à sua função `external_lock()`, que geralmente ocorre no início e no final do acesso a uma instância de tabela. Pode haver diferenças entre os motores de armazenamento. Essa variável pode ser usada, por exemplo, para descobrir para uma instrução que acessa uma tabela particionada quantos particionamentos foram eliminados antes do bloqueio ocorrer: Verifique quanto o contador aumentou para a instrução, subtraia 2 (2 chamadas para a própria tabela), depois divida por 2 para obter o número de particionamentos bloqueados.
*  `Handler_mrr_init`

  O número de vezes que o servidor usa a própria implementação de Leitura de Múltiplos Intervalos do motor de armazenamento para o acesso a tabelas.
*  `Handler_prepare`

  Um contador para a fase de preparação das operações de comprovação em duas fases.
*  `Handler_read_first`

O número de vezes que a primeira entrada em um índice foi lida. Se esse valor for alto, sugere que o servidor está realizando muitas varreduras completas do índice (por exemplo, `SELECT col1 FROM foo`, assumindo que `col1` está indexado).
*  `Handler_read_key`

  O número de solicitações para ler uma linha com base em uma chave. Se esse valor for alto, é um bom indicador de que suas tabelas estão corretamente indexadas para suas consultas.
*  `Handler_read_last`

  O número de solicitações para ler a última chave em um índice. Com `ORDER BY`, o servidor emite uma solicitação de primeira chave seguida por várias solicitações de próxima chave, enquanto com `ORDER BY DESC`, o servidor emite uma solicitação de última chave seguida por várias solicitações de chave anterior.
*  `Handler_read_next`

  O número de solicitações para ler a próxima linha na ordem da chave. Esse valor é incrementado se você estiver consultando uma coluna de índice com uma restrição de intervalo ou se estiver realizando uma varredura de índice.
*  `Handler_read_prev`

  O número de solicitações para ler a linha anterior na ordem da chave. Esse método de leitura é usado principalmente para otimizar `ORDER BY ... DESC`.
*  `Handler_read_rnd`

  O número de solicitações para ler uma linha com base em uma posição fixa. Esse valor é alto se você estiver realizando muitas consultas que requerem ordenação dos resultados. Provavelmente, você tem muitas consultas que exigem que o MySQL escaneie tabelas inteiras ou que você tenha junções que não utilizam chaves corretamente.
*  `Handler_read_rnd_next`

  O número de solicitações para ler a próxima linha no arquivo de dados. Esse valor é alto se você estiver realizando muitas varreduras de tabela. Geralmente, isso sugere que suas tabelas não estão corretamente indexadas ou que suas consultas não foram escritas para aproveitar os índices que você tem.
*  `Handler_rollback`

  O número de solicitações para que um mecanismo de armazenamento realize uma operação de rollback.
*  `Handler_savepoint`

  O número de solicitações para que um mecanismo de armazenamento coloque um ponto de salvamento.
*  `Handler_savepoint_rollback`

  O número de solicitações para que um mecanismo de armazenamento volte a um ponto de salvamento.
*  `Handler_update`

O número de solicitações para atualizar uma linha em uma tabela.
*  `Handler_write`

  O número de solicitações para inserir uma linha em uma tabela.
*  `Innodb_buffer_pool_dump_status`

  O progresso de uma operação para registrar as páginas mantidas no `InnoDB` buffer pool, acionado pelo ajuste de `innodb_buffer_pool_dump_at_shutdown` ou `innodb_buffer_pool_dump_now`.

  Para informações e exemplos relacionados, consulte a Seção 17.8.3.6, “Salvar e Restaurar o Estado do Buffer Pool”.
*  `Innodb_buffer_pool_load_status`

  O progresso de uma operação para aquecer o `InnoDB` buffer pool lendo um conjunto de páginas correspondentes a um ponto anterior no tempo, acionado pelo ajuste de `innodb_buffer_pool_load_at_startup` ou `innodb_buffer_pool_load_now`. Se a operação introduzir muito overhead, você pode cancelá-la ajustando `innodb_buffer_pool_load_abort`.

  Para informações e exemplos relacionados, consulte a Seção 17.8.3.6, “Salvar e Restaurar o Estado do Buffer Pool”.
*  `Innodb_buffer_pool_bytes_data`

  O número total de bytes no `InnoDB` buffer pool contendo dados. O número inclui páginas limpas e sujas. Para cálculos mais precisos de uso de memória do que com `Innodb_buffer_pool_pages_data`, quando tabelas compactadas fazem com que o buffer pool retenha páginas de tamanhos diferentes.
*  `Innodb_buffer_pool_pages_data`

  O número de páginas no `InnoDB` buffer pool contendo dados. O número inclui páginas limpas e sujas. Ao usar tabelas compactadas, o valor relatado de `Innodb_buffer_pool_pages_data` pode ser maior que `Innodb_buffer_pool_pages_total` (Bug #59550).
*  `Innodb_buffer_pool_bytes_dirty`

  O número total atual de bytes mantidos em páginas sujas no `InnoDB` buffer pool. Para cálculos de uso de memória mais precisos do que com `Innodb_buffer_pool_pages_dirty`, quando tabelas compactadas fazem com que o buffer pool retenha páginas de tamanhos diferentes.
*  `Innodb_buffer_pool_pages_dirty`

O número atual de páginas sujas no `InnoDB` buffer pool.
*  `Innodb_buffer_pool_pages_flushed`

  O número de solicitações para descartar páginas do `InnoDB` buffer pool.
*  `Innodb_buffer_pool_pages_free`

  O número de páginas livres no `InnoDB` buffer pool.
*  `Innodb_buffer_pool_pages_latched`

  O número de páginas travadas no `InnoDB` buffer pool. São páginas atualmente sendo lidas ou escritas, ou que não podem ser descartadas por algum outro motivo. O cálculo desta variável é caro, portanto, está disponível apenas quando o sistema `UNIV_DEBUG` é definido durante a construção do servidor.
*  `Innodb_buffer_pool_pages_misc`

  O número de páginas no `InnoDB` buffer pool que estão ocupadas porque foram alocadas para overhead administrativo, como bloqueios de linhas ou índice de hash adaptativo. Esse valor também pode ser calculado como `Innodb_buffer_pool_pages_total` − `Innodb_buffer_pool_pages_free` − `Innodb_buffer_pool_pages_data`. Ao usar tabelas compactadas, `Innodb_buffer_pool_pages_misc` pode reportar um valor fora dos limites (Bug #59550).
*  `Innodb_buffer_pool_pages_total`

  O tamanho total do `InnoDB` buffer pool, em páginas. Ao usar tabelas compactadas, o valor relatado de `Innodb_buffer_pool_pages_data` pode ser maior que `Innodb_buffer_pool_pages_total` (Bug #59550)
*  `Innodb_buffer_pool_read_ahead`

  O número de páginas lidas no `InnoDB` buffer pool pelo fio de fundo de leitura antecipada.
*  `Innodb_buffer_pool_read_ahead_evicted`

  O número de páginas lidas no `InnoDB` buffer pool pelo fio de fundo de leitura antecipada que foram posteriormente expulsas sem terem sido acessadas por consultas.
*  `Innodb_buffer_pool_read_ahead_rnd`

  O número de leituras antecipadas "aleatórias" iniciadas pelo `InnoDB`. Isso acontece quando uma consulta examina uma grande parte de uma tabela, mas em ordem aleatória.
*  `Innodb_buffer_pool_read_requests`

  O número de solicitações de leitura lógicas.
*  `Innodb_buffer_pool_reads`

O número de leituras lógicas que o `InnoDB` não conseguiu atender do pool de buffer e teve que ler diretamente do disco.
*  `Innodb_buffer_pool_resize_status`

  O status de uma operação para redimensionar dinamicamente o pool de buffer do `InnoDB`, acionada pelo ajuste dinâmico do parâmetro `innodb_buffer_pool_size`. O parâmetro `innodb_buffer_pool_size` é dinâmico, o que permite redimensionar o pool de buffer sem reiniciar o servidor. Consulte Configurando o Tamanho do Pool de Buffer do InnoDB Online para informações relacionadas.
*  `Innodb_buffer_pool_resize_status_code`

  Relata códigos de status para acompanhar operações de redimensionamento dinâmico do pool de buffer online. Cada código de status representa uma etapa em uma operação de redimensionamento. Os códigos de status incluem:

  + 0: Nenhuma operação de redimensionamento em andamento
  + 1: Começando a redimensionar
  + 2: Desabilitando AHI (Índice Hash Adaptativo)
  + 3: Retirando Blocos
  + 4: Adquirindo Bloqueio Global
  + 5: Redimensionando o Pool
  + 6: Redimensionando o Hash
  + 7: Redimensionamento Falhou

  Você pode usar essa variável de status em conjunto com `Innodb_buffer_pool_resize_status_progress` para acompanhar o progresso de cada etapa de uma operação de redimensionamento. A variável `Innodb_buffer_pool_resize_status_progress` relata um valor percentual indicando o progresso da etapa atual.

  Para mais informações, consulte Monitorando o Progresso de Redimensionamento do Pool de Buffer Online.
*  `Innodb_buffer_pool_resize_status_progress`

  Relata um valor percentual indicando o progresso da etapa atual de uma operação de redimensionamento dinâmico do pool de buffer online. Esta variável é usada em conjunto com `Innodb_buffer_pool_resize_status_code`, que relata um código de status indicando a etapa atual de uma operação de redimensionamento dinâmico do pool de buffer online.

  O valor percentual é atualizado após cada instância do pool de buffer ser processada. À medida que o código de status (relato por `Innodb_buffer_pool_resize_status_code`) muda de um status para outro, o valor percentual é redefinido para 0.

  Para informações relacionadas, consulte Monitorando o Progresso de Redimensionamento do Pool de Buffer Online.
*  `Innodb_buffer_pool_wait_free`

Normalmente, as mensagens para o pool de buffer do `InnoDB` ocorrem em segundo plano. Quando o `InnoDB` precisa ler ou criar uma página e não há páginas limpas disponíveis, o `InnoDB` esvazia primeiro algumas páginas sujas e aguarda que essa operação termine. Esse contador conta as instâncias dessas espera. Se o `innodb_buffer_pool_size` foi configurado corretamente, esse valor deve ser pequeno.
*  `Innodb_buffer_pool_write_requests`

  O número de escritas feitas no pool de buffer do `InnoDB`.
*  `Innodb_data_fsyncs`

  O número de operações `fsync()` até o momento. A frequência das chamadas `fsync()` é influenciada pela configuração da opção de configuração `innodb_flush_method`.

Conta o número de operações `fdatasync()` se `innodb_use_fdatasync` estiver habilitado.
*  `Innodb_data_pending_fsyncs`

  O número atual de operações `fsync()` pendentes. A frequência das chamadas `fsync()` é influenciada pela configuração da opção de configuração `innodb_flush_method`.
*  `Innodb_data_pending_reads`

  O número atual de leituras pendentes.
*  `Innodb_data_pending_writes`

  O número atual de escritas pendentes.
*  `Innodb_data_read`

  A quantidade de dados lidos desde que o servidor foi iniciado (em bytes).
*  `Innodb_data_reads`

  O número total de leituras de dados (leitura de arquivos do sistema operacional).
*  `Innodb_data_writes`

  O número total de escritas de dados.
*  `Innodb_data_written`

  A quantidade de dados escritos até o momento, em bytes.
*  `Innodb_dblwr_pages_written`

  O número de páginas que foram escritas no buffer de dupla escrita. Veja a Seção 17.11.1, “I/O de disco do InnoDB”.
*  `Innodb_dblwr_writes`

  O número de operações de dupla escrita que foram realizadas. Veja a Seção 17.11.1, “I/O de disco do InnoDB”.
*  `Innodb_have_atomic_builtins`

  Indica se o servidor foi construído com instruções atômicas.
*  `Innodb_log_waits`

  O número de vezes que o buffer de log foi muito pequeno e uma espera foi necessária para que ele fosse esvaziado antes de continuar.
*  `Innodb_log_write_requests`

O número de solicitações de gravação para o log de refazer do `InnoDB`.
*  `Innodb_log_writes`

  O número de gravação física no arquivo do log de refazer do `InnoDB`.
*  `Innodb_num_open_files`

  O número de arquivos que o `InnoDB` atualmente mantém abertos.
*  `Innodb_os_log_fsyncs`

  O número de gravação `fsync()` feitas nos arquivos do log de refazer do `InnoDB`.
*  `Innodb_os_log_pending_fsyncs`

  O número de operações `fsync()` pendentes para os arquivos do log de refazer do `InnoDB`.
*  `Innodb_os_log_pending_writes`

  O número de gravação pendente nos arquivos do log de refazer do `InnoDB`.
*  `Innodb_os_log_written`

  O número de bytes escritos nos arquivos do log de refazer do `InnoDB`.
*  `Innodb_page_size`

  Tamanho da página do `InnoDB` (padrão 16KB). Muitos valores são contados em páginas; o tamanho da página permite que sejam facilmente convertidos em bytes.
*  `Innodb_pages_created`

  O número de páginas criadas por operações em tabelas do `InnoDB`.
*  `Innodb_pages_read`

  O número de páginas lidas do pool de buffer do `InnoDB` por operações em tabelas do `InnoDB`.
*  `Innodb_pages_written`

  O número de páginas escritas por operações em tabelas do `InnoDB`.
*  `Innodb_redo_log_enabled`

  Se o registro de refazer está habilitado ou desabilitado. Consulte Desabilitar o Registro de Refazer.
*  `Innodb_redo_log_capacity_resized`

  A capacidade total do log de refazer para todos os arquivos do log de refazer, em bytes, após a última operação de redimensionamento de capacidade concluída. O valor inclui arquivos de refazer ordinários e de reserva.

  Se não houver operação de redimensionamento para baixo pendente, `Innodb_redo_log_capacity_resized` deve ser igual ao ajuste `innodb_redo_log_capacity` se estiver sendo usado, ou `(innodb_log_files_in_group, innodb_log_file_size)` se esses forem usados. Consulte a documentação do `innodb_redo_log_capacity` para mais esclarecimentos. As operações de redimensionamento para cima são instantâneas.

  Para informações relacionadas, consulte a Seção 17.6.5, “Registro de Refazer”.
*  `Innodb_redo_log_checkpoint_lsn`

  LSN do ponto de verificação do log de refazer. Para informações relacionadas, consulte a Seção 17.6.5, “Registro de Refazer”.
*  `Innodb_redo_log_current_lsn`

A LSN atual representa a última posição escrita no buffer do log de refazer. O `InnoDB` escreve dados no buffer de log de refazer dentro do processo do MySQL antes de solicitar que o sistema operacional escreva os dados no arquivo de log de refazer atual. Para informações relacionadas, consulte a Seção 17.6.5, “Log de Refazer”.
*  `Innodb_redo_log_flushed_to_disk_lsn`

  A LSN enviada para o disco. O `InnoDB` escreve dados primeiro no log de refazer e, em seguida, solicita que o sistema operacional envie os dados para o disco. A LSN enviada para o disco representa a última posição no log de refazer que o `InnoDB` sabe ter sido enviada para o disco. Para informações relacionadas, consulte a Seção 17.6.5, “Log de Refazer”.
*  `Innodb_redo_log_logical_size`

  Um valor de tamanho de dados, em bytes, representando o intervalo de LSN que contém dados de log de refazer em uso, abrangendo do bloco mais antigo necessário pelos consumidores do log de refazer ao bloco escrito mais recente. Para informações relacionadas, consulte a Seção 17.6.5, “Log de Refazer”.
*  `Innodb_redo_log_physical_size`

  A quantidade de espaço em disco, em bytes, atualmente consumida por todos os arquivos de log de refazer no disco, excluindo arquivos de log de refazer de reserva. Para informações relacionadas, consulte a Seção 17.6.5, “Log de Refazer”.
*  `Innodb_redo_log_read_only`

  Se o log de refazer é somente leitura.
*  `Innodb_redo_log_resize_status`

  O status de redimensionamento do log de refazer, indicando o estado atual do mecanismo de redimensionamento da capacidade do log de refazer. Os valores possíveis incluem:

  + `OK`: Não há problemas e nenhuma operação de redimensionamento pendente da capacidade do log de refazer.
  + `Resizing down`: Uma operação de redimensionamento para baixo está em andamento.

  Uma operação de redimensionamento para cima é instantânea e, portanto, não tem status pendente.
*  `Innodb_redo_log_uuid`

  O UUID do log de refazer.
*  `Innodb_row_lock_current_waits`

  O número de  bloques de registro atualmente aguardados por operações em tabelas do `InnoDB`.
*  `Innodb_row_lock_time`

  O tempo total gasto na aquisição de blocos de registro para tabelas do `InnoDB`, em milissegundos.
*  `Innodb_row_lock_time_avg`

O tempo médio para adquirir um bloqueio de linha para tabelas `InnoDB`, em milissegundos.
*  `Innodb_row_lock_time_max`

  O tempo máximo para adquirir um bloqueio de linha para tabelas `InnoDB`, em milissegundos.
*  `Innodb_row_lock_waits`

  O número de vezes que as operações em tabelas `InnoDB` tiveram que esperar por um bloqueio de linha.
*  `Innodb_rows_deleted`

  O número de linhas excluídas das tabelas `InnoDB`.
*  `Innodb_rows_inserted`

  O número de linhas inseridas nas tabelas `InnoDB`.
*  `Innodb_rows_read`

  O número de linhas lidas das tabelas `InnoDB`.
*  `Innodb_rows_updated`

  O número estimado de linhas atualizadas nas tabelas `InnoDB`.

  ::: info Nota

  Este valor não é 100% preciso. Para obter um resultado preciso (mas mais caro), use `ROW_COUNT()`.

  :::
  
*  `Innodb_system_rows_deleted`

  O número de linhas excluídas das tabelas `InnoDB` pertencentes a esquemas criados pelo sistema.
*  `Innodb_system_rows_inserted`

  O número de linhas inseridas nas tabelas `InnoDB` pertencentes a esquemas criados pelo sistema.
*  `Innodb_system_rows_updated`

  O número de linhas atualizadas nas tabelas `InnoDB` pertencentes a esquemas criados pelo sistema.
*  `Innodb_system_rows_read`

  O número de linhas lidas das tabelas `InnoDB` pertencentes a esquemas criados pelo sistema.
*  `Innodb_truncated_status_writes`

  O número de vezes que a saída da instrução `SHOW ENGINE INNODB STATUS` foi truncada.
*  `Innodb_undo_tablespaces_active`

  O número de espaços de desfazer ativos. Inclui tanto espaços de desfazer implícitos (`InnoDB` criados) quanto explícitos (criados pelo usuário). Para informações sobre espaços de desfazer, consulte  Seção 17.6.3.4, “Espaços de desfazer”.
*  `Innodb_undo_tablespaces_explicit`

  O número de espaços de desfazer criados pelo usuário. Para informações sobre espaços de desfazer, consulte Seção 17.6.3.4, “Espaços de desfazer”.
*  `Innodb_undo_tablespaces_implicit`

O número de espaços de tabelas de desfazer criados por `InnoDB`. Dois espaços de tabelas de desfazer padrão são criados por `InnoDB` quando a instância do MySQL é inicializada. Para obter informações sobre espaços de tabelas de desfazer, consulte a Seção 17.6.3.4, “Espaços de tabelas de desfazer”.
*  `Innodb_undo_tablespaces_total`

  O número total de espaços de tabelas de desfazer. Inclui tanto espaços de tabelas de desfazer implícitos (`criados por `InnoDB`) quanto explícitos (criados pelo usuário), ativos e inativos. Para obter informações sobre espaços de tabelas de desfazer, consulte a Seção 17.6.3.4, “Espaços de tabelas de desfazer”.
*  `Blocos_chave_não_flushados`

  O número de blocos de chave na cache de chave `MyISAM` que foram alterados, mas ainda não foram descarregados no disco.
*  `Blocos_chave_não_utilizados`

  O número de blocos não utilizados na cache de chave `MyISAM`. Você pode usar esse valor para determinar quanto da cache de chave está em uso; consulte a discussão sobre `key_buffer_size` na Seção 7.1.8, “Variáveis do sistema do servidor”.
*  `Blocos_chave_utilizados`

  O número de blocos utilizados na cache de chave `MyISAM`. Esse valor é um limite máximo que indica o número máximo de blocos que já foram utilizados de uma vez.
*  `Solicitações_de_leitura_de_chave`

  O número de solicitações para ler um bloco de chave da cache de chave `MyISAM`.
*  `Leitura_de_chave`

  O número de leituras físicas de um bloco de chave do disco para a cache de chave `MyISAM`. Se `Leitura_de_chave` for grande, então o valor de `key_buffer_size` provavelmente é muito pequeno. A taxa de falha de cache pode ser calculada como `Leitura_de_chave`/`Solicitações_de_leitura_de_chave`.
*  `Solicitações_de_escrita_de_chave`

  O número de solicitações para escrever um bloco de chave na cache de chave `MyISAM`.
*  `Escrita_de_chave`

  O número de leituras físicas de um bloco de chave da cache de chave `MyISAM` para o disco.
*  `Último_custo_da_consulta`

  O custo total da última consulta compilada, conforme calculado pelo otimizador de consultas. Isso é útil para comparar o custo de diferentes planos de consulta para a mesma consulta. O valor padrão de 0 significa que nenhuma consulta foi compilada ainda. O valor padrão é 0. `Último_custo_da_consulta` tem escopo de sessão.

Essa variável mostra o custo das consultas que têm vários blocos de consulta, somando as estimativas de custo de cada bloco de consulta, estimativa de quantas vezes subconsultas não cacheáveis são executadas e multiplicando o custo desses blocos de consulta pelo número de execuções das subconsultas.
*  `Last_query_partial_plans`

  O número de iterações que o otimizador de consulta fez na construção do plano de execução para a consulta anterior.

  `Last_query_partial_plans` tem escopo de sessão.
*  `Locked_connects`

  O número de tentativas de conexão com contas de usuário bloqueadas. Para informações sobre bloqueio e desbloqueio de contas, consulte a Seção 8.2.20, “Bloqueio de Conta”.
*  `Max_execution_time_exceeded`

  O número de  `SELECT` instruções para as quais o tempo de execução foi excedido.
*  `Max_execution_time_set`

  O número de  `SELECT` instruções para as quais um tempo de execução não nulo foi definido. Isso inclui instruções que incluem uma dica de otimizador `MAX_EXECUTION_TIME` não nulo e instruções que incluem tal dica, mas executam enquanto o tempo de espera indicado pela variável de sistema `max_execution_time` não é nulo.
*  `Max_execution_time_set_failed`

  O número de  `SELECT` instruções para as quais a tentativa de definir um tempo de execução falhou.
*  `Max_used_connections`

  O número máximo de conexões que estiveram em uso simultaneamente desde que o servidor começou.
*  `Max_used_connections_time`

  O tempo em que `Max_used_connections` atingiu seu valor atual.
*  `Not_flushed_delayed_rows`

  Esta variável de status está desatualizada (porque as inserções `DELAYED` não são suportadas); espere que ela seja removida em uma futura versão.
*  `mecab_charset`

  O conjunto de caracteres atualmente usado pelo plugin de parser de texto completo MeCab. Para informações relacionadas, consulte a Seção 14.9.9, “Plugin de Parser de Texto Completo MeCab”.
*  `Ongoing_anonymous_transaction_count`

Mostra o número de transações em andamento que foram marcadas como anônimas. Isso pode ser usado para garantir que nenhuma transação adicional esteja aguardando processamento.
* `Ongoing_anonymous_gtid_violating_transaction_count`

  Esta variável de status está disponível apenas em builds de depuração. Mostra o número de transações em andamento que usam `gtid_next=ANONYMOUS` e que violam a consistência do GTID.
* `Ongoing_automatic_gtid_violating_transaction_count`

  Esta variável de status está disponível apenas em builds de depuração. Mostra o número de transações em andamento que usam `gtid_next=AUTOMATIC` e que violam a consistência do GTID.
* `Open_files`

  O número de arquivos abertos. Esse contagem inclui arquivos regulares abertos pelo servidor. Não inclui outros tipos de arquivos, como sockets ou pipes. Além disso, o contagem não inclui arquivos que os motores de armazenamento abrem usando suas próprias funções internas, em vez de pedir ao nível do servidor para fazer isso.
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

  As variáveis de status do Schema de Desempenho estão listadas na Seção 29.16, “Variáveis de Status do Schema de Desempenho”. Essas variáveis fornecem informações sobre a instrumentação que não pôde ser carregada ou criada devido a restrições de memória.
* `Prepared_stmt_count`

O número atual de declarações preparadas. (O número máximo de declarações é dado pela variável de sistema `max_prepared_stmt_count`. )
*  `Perguntas`

  O número de declarações executadas pelo servidor. Esta variável inclui declarações executadas dentro de programas armazenados, ao contrário da variável `Perguntas`. Não conta comandos `COM_PING` ou `COM_STATISTICS`.

  A discussão no início desta seção indica como relacionar esta variável de status de contagem de declarações a outras variáveis semelhantes.
*  `Perguntas`

  O número de declarações executadas pelo servidor. Esta inclui apenas declarações enviadas ao servidor pelos clientes e não declarações executadas dentro de programas armazenados, ao contrário da variável `Perguntas`. Esta variável não conta comandos `COM_PING`, `COM_STATISTICS`, `COM_STMT_PREPARE`, `COM_STMT_CLOSE` ou `COM_STMT_RESET`.

  A discussão no início desta seção indica como relacionar esta variável de status de contagem de declarações a outras variáveis semelhantes.
*  `Replica_open_temp_tables`

   `Replica_open_temp_tables` mostra o número de tabelas temporárias que o thread de SQL de replicação atualmente tem abertas. Se o valor for maior que zero, não é seguro desligar a replica; veja a Seção 19.5.1.31, “Replicação e Tabelas Temporárias”. Esta variável relata o total de tabelas temporárias abertas para *todos* os canais de replicação.
*  `Resource_group_supported`

  Indica se o recurso do grupo de recursos é suportado.

  Em algumas plataformas ou configurações do servidor MySQL, os grupos de recursos não estão disponíveis ou têm limitações. Em particular, os sistemas Linux podem exigir uma etapa manual para alguns métodos de instalação. Para detalhes, consulte Restrições de Grupo de Recursos.
*  `Rpl_semi_sync_master_clients`

  O número de réplicas semissíncronas.

  Símbolo obsoleto para `Rpl_semi_sync_source_clients`.
*  `Rpl_semi_sync_master_net_avg_wait_time`

  Símbolo obsoleto para `Rpl_semi_sync_source_net_avg_wait_time`.
*  `Rpl_semi_sync_master_net_wait_time`

Sinônimo obsoleto para `Rpl_semi_sync_source_net_wait_time`.
*  `Rpl_semi_sync_master_net_waits`

  O número total de vezes que a fonte esperou por respostas da réplica.

  Sinônimo obsoleto para `Rpl_semi_sync_source_net_waits`.
*  `Rpl_semi_sync_master_no_times`

  Sinônimo obsoleto para `Rpl_semi_sync_source_no_times`.
*  `Rpl_semi_sync_master_no_tx`

  Sinônimo obsoleto para `Rpl_semi_sync_source_no_tx`.
*  `Rpl_semi_sync_master_status`

  Sinônimo obsoleto para `Rpl_semi_sync_source_status`.
*  `Rpl_semi_sync_master_timefunc_failures`

  Sinônimo obsoleto para `Rpl_semi_sync_source_timefunc_failures`.
*  `Rpl_semi_sync_master_tx_avg_wait_time`

  Sinônimo obsoleto para `Rpl_semi_sync_source_tx_avg_wait_time`.
*  `Rpl_semi_sync_master_tx_wait_time`

  Sinônimo obsoleto para `Rpl_semi_sync_source_tx_wait_time`.
*  `Rpl_semi_sync_master_tx_waits`

  Sinônimo obsoleto para `Rpl_semi_sync_source_tx_waits`.
*  `Rpl_semi_sync_master_wait_pos_backtraverse`

  Sinônimo obsoleto para `Rpl_semi_sync_source_wait_pos_backtraverse`.
*  `Rpl_semi_sync_master_wait_sessions`

  Sinônimo obsoleto para `Rpl_semi_sync_source_wait_sessions`.
*  `Rpl_semi_sync_master_yes_tx`

  Sinônimo obsoleto para `Rpl_semi_sync_source_yes_tx`.
*  `Rpl_semi_sync_source_clients`

  O número de réplicas semissíncronas.

  Disponível quando o plugin `rpl_semi_sync_source` (`biblioteca semisynsource.so`) é instalado na fonte.
*  `Rpl_semi_sync_source_net_avg_wait_time`

  O tempo médio em microsegundos que a fonte esperou por uma resposta da réplica. Esta variável é sempre `0` e está obsoleta; espere que ela seja removida em uma versão futura.

  Disponível quando o plugin `rpl_semi_sync_source` (`biblioteca semisynsource.so`) é instalado na fonte.
*  `Rpl_semi_sync_source_net_wait_time`

  O tempo total em microsegundos que a fonte esperou por respostas da réplica. Esta variável é sempre `0` e está obsoleta; espere que ela seja removida em uma versão futura.

Disponível quando o plugin `rpl_semi_sync_source` (`biblioteca semisync_source.so`) está instalado na fonte.
*  `Rpl_semi_sync_source_net_waits`

  O número total de vezes que a fonte esperou por respostas da replica.

  Disponível quando o plugin `rpl_semi_sync_source` (`biblioteca semisync_source.so`) está instalado na fonte.
*  `Rpl_semi_sync_source_no_times`

  O número de vezes que a fonte desativou a replicação semiesincronizada.

  Disponível quando o plugin `rpl_semi_sync_source` (`biblioteca semisync_source.so`) está instalado na fonte.
*  `Rpl_semi_sync_source_no_tx`

  O número de commits que não foram reconhecidos com sucesso por uma replica.

  Disponível quando o plugin `rpl_semi_sync_source` (`biblioteca semisync_source.so`) está instalado na fonte.
*  `Rpl_semi_sync_source_status`

  Se a replicação semiesincronizada está atualmente operacional na fonte. O valor é `ON` se o plugin foi habilitado e um reconhecimento de commit ocorreu. É `OFF` se o plugin não estiver habilitado ou se a fonte tiver retornado à replicação assíncrona devido ao tempo limite de reconhecimento de commit.

  Disponível quando o plugin `rpl_semi_sync_source` (`biblioteca semisync_source.so`) está instalado na fonte.
*  `Rpl_semi_sync_source_timefunc_failures`

  O número de vezes que a fonte falhou ao chamar funções de tempo, como `gettimeofday()`.

  Disponível quando o plugin `rpl_semi_sync_source` (`biblioteca semisync_source.so`) está instalado na fonte.
*  `Rpl_semi_sync_source_tx_avg_wait_time`

  O tempo médio em microsegundos que a fonte esperou por cada transação.

  Disponível quando o plugin `rpl_semi_sync_source` (`biblioteca semisync_source.so`) está instalado na fonte.
*  `Rpl_semi_sync_source_tx_wait_time`

  O tempo total em microsegundos que a fonte esperou por transações.

  Disponível quando o plugin `rpl_semi_sync_source` (`biblioteca semisync_source.so`) está instalado na fonte.
*  `Rpl_semi_sync_source_tx_waits`

O número total de vezes que a fonte esperou por transações.

Disponível quando o plugin `rpl_semi_sync_source` (`biblioteca semisync_source.so`) está instalado na fonte.
*  `Rpl_semi_sync_source_wait_pos_backtraverse`

O número total de vezes que a fonte esperou por um evento com coordenadas binárias menores que os eventos esperados anteriormente. Isso pode ocorrer quando a ordem em que as transações começam a esperar por uma resposta é diferente da ordem em que seus eventos de log binário são escritos.

Disponível quando o plugin `rpl_semi_sync_source` (`biblioteca semisync_source.so`) está instalado na fonte.
*  `Rpl_semi_sync_source_wait_sessions`

O número de sessões atualmente esperando por respostas da replica.

Disponível quando o plugin `rpl_semi_sync_source` (`biblioteca semisync_source.so`) está instalado na fonte.
*  `Rpl_semi_sync_source_yes_tx`

O número de commits que foram reconhecidos com sucesso por uma replica.

Disponível quando o plugin `rpl_semi_sync_source` (`biblioteca semisync_source.so`) está instalado na fonte.
*  `Rpl_semi_sync_replica_status`

Mostra se a replicação semisincronizada está atualmente operacional na replica. É `ON` se o plugin foi habilitado e o thread de I/O de replicação (receptor) está em execução, `OFF` caso contrário.

Disponível quando o plugin `rpl_semi_sync_source` (`biblioteca semisync_source.so`) está instalado na fonte.
*  `Rpl_semi_sync_slave_status`

Símbolo obsoleto para `Rpl_semi_sync_replica_status`.
*  `Rsa_public_key`

O valor desta variável é a chave pública usada pelo plugin de autenticação `sha256_password` (obsoleto) para a troca de senhas baseada em pares de chaves RSA. O valor não está vazio apenas se o servidor inicializar com sucesso as chaves privadas e públicas nos arquivos nomeados pelas variáveis de sistema `sha256_password_private_key_path` e `sha256_password_public_key_path`. O valor de `Rsa_public_key` vem do último arquivo.

Para informações sobre `sha256_password`, consulte a Seção 8.4.1.3, “Autenticação Pluggable SHA-256”.
*  `Secondary_engine_execution_count`

  Para uso apenas com MySQL HeatWave. Consulte Variáveis de Status, para mais informações.
*  `Select_full_join`

  O número de junções que realizam varreduras de tabela porque não usam índices. Se esse valor não for 0, você deve verificar cuidadosamente os índices de suas tabelas.
*  `Select_full_range_join`

  O número de junções que usaram uma pesquisa de intervalo em uma tabela de referência.
*  `Select_range`

  O número de junções que usaram intervalos na primeira tabela. Normalmente, isso não é um problema crítico, mesmo que o valor seja bastante grande.
*  `Select_range_check`

  O número de junções sem chaves que verificam o uso de chaves após cada linha. Se esse valor não for 0, você deve verificar cuidadosamente os índices de suas tabelas.
*  `Select_scan`

  O número de junções que realizaram uma varredura completa da primeira tabela.
*  `Slave_open_temp_tables`

  Alias desatualizado para `Replica_open_temp_tables`.
*  `Slave_rows_last_search_algorithm_used`

  Alias desatualizado para `Replica_rows_last_search_algorithm_used`.
*  `Slow_launch_threads`

  O número de threads que levaram mais de `slow_launch_time` segundos para serem criados.
*  `Slow_queries`

  O número de consultas que levaram mais de `long_query_time` segundos. Esse contador é incrementado independentemente de o log de consultas lentas estar habilitado. Para informações sobre esse log, consulte a Seção 7.4.5, “O Log de Consultas Lentas”.
*  `Sort_merge_passes`

  O número de passes de fusão que o algoritmo de ordenação teve que realizar. Se esse valor for grande, você deve considerar aumentar o valor da variável de sistema  `sort_buffer_size`.
*  `Sort_range`

  O número de ordenações realizadas usando intervalos.
*  `Sort_rows`

  O número de linhas ordenadas.
*  `Sort_scan`

  O número de ordenações realizadas por varredura da tabela.
*  `Ssl_accept_renegotiates`

  O número de negociações necessárias para estabelecer a conexão.
*  `Ssl_accepts`

O número de conexões SSL aceitas.
* `Ssl_callback_cache_hits`

O número de acessos ao cache de callbacks.
* `Ssl_cipher`

O cifrador de criptografia atual (vazio para conexões não criptografadas).
* `Ssl_cipher_list`

A lista de possíveis cifradores SSL (vazia para conexões não SSL). Se o MySQL suportar TLSv1.3, o valor inclui os possíveis cifradores TLSv1.3. Consulte a Seção 8.3.2, “Protocolos e cifradores TLS de Conexão Encriptada”.
* `Ssl_client_connects`

O número de tentativas de conexão SSL para um servidor de origem de replicação habilitado para SSL.
* `Ssl_connect_renegotiates`

O número de negociações necessárias para estabelecer a conexão com um servidor de origem de replicação habilitado para SSL.
* `Ssl_ctx_verify_depth`

A profundidade de verificação do contexto SSL (quantos certificados na cadeia são testados).
* `Ssl_ctx_verify_mode`

O modo de verificação do contexto SSL.
* `Ssl_default_timeout`

O tempo de espera padrão do SSL.
* `Ssl_finished_accepts`

O número de conexões SSL bem-sucedidas com o servidor.
* `Ssl_finished_connects`

O número de conexões de replica bem-sucedidas com um servidor de origem de replicação habilitado para SSL.
* `Ssl_server_not_after`

A última data para a qual o certificado SSL é válido. Para verificar as informações de expiração do certificado SSL, use esta instrução:

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

A primeira data para a qual o certificado SSL é válido.
* `Ssl_session_cache_hits`

O número de acessos ao cache de sessões SSL.
* `Ssl_session_cache_misses`

O número de falhas no cache de sessões SSL.
* `Ssl_session_cache_mode`

O modo de cache de sessões SSL. Quando o valor da variável `ssl_session_cache_mode` do servidor for `ON`, o valor da variável de status `Ssl_session_cache_mode` será `SERVER`.
* `Ssl_session_cache_overflows`

O número de overflows no cache de sessões SSL.
* `Ssl_session_cache_size`

O tamanho do cache de sessões SSL.
* `Ssl_session_cache_timeout`

O valor de tempo de espera em segundos das sessões SSL no cache.
* `Ssl_session_cache_timeouts`

O número de expurgos de cache de sessão SSL.
*  `Ssl_sessions_reused`

  Isso é igual a 0 se o TLS não foi usado na sessão atual do MySQL, ou se uma sessão TLS não foi reutilizada; caso contrário, é igual a 1.

  `Ssl_sessions_reused` tem escopo de sessão.
*  `Ssl_used_session_cache_entries`

  Quantas entradas de cache de sessão SSL foram usadas.
*  `Ssl_verify_depth`

  A profundidade de verificação para conexões SSL de replicação.
*  `Ssl_verify_mode`

  O modo de verificação usado pelo servidor para uma conexão que usa SSL. O valor é uma máscara de bits; os bits são definidos no arquivo de cabeçalho `openssl/ssl.h`:

  ```
  # define SSL_VERIFY_NONE                 0x00
  # define SSL_VERIFY_PEER                 0x01
  # define SSL_VERIFY_FAIL_IF_NO_PEER_CERT 0x02
  # define SSL_VERIFY_CLIENT_ONCE          0x04
  ```

  `SSL_VERIFY_PEER` indica que o servidor solicita um certificado do cliente. Se o cliente fornecer um, o servidor realiza a verificação e prossegue apenas se a verificação for bem-sucedida. `SSL_VERIFY_CLIENT_ONCE` indica que um pedido para o certificado do cliente é realizado apenas no handshake inicial.
*  `Ssl_version`

  A versão do protocolo SSL da conexão (por exemplo, TLSv1.2). Se a conexão não estiver criptografada, o valor é vazio.
*  `Table_locks_immediate`

  O número de vezes que um pedido para um bloqueio de tabela pôde ser concedido imediatamente.
*  `Table_locks_waited`

  O número de vezes que um pedido para um bloqueio de tabela não pôde ser concedido imediatamente e uma espera foi necessária. Se este valor for alto e você tiver problemas de desempenho, você deve primeiro otimizar suas consultas e, em seguida, dividir sua(s) tabela(s) ou usar replicação.
*  `Table_open_cache_hits`

  O número de acessos para consultas de cache de tabela aberta.
*  `Table_open_cache_misses`

  O número de falhas para consultas de cache de tabela aberta.
*  `Table_open_cache_overflows`

  O número de overflow para o cache de tabela aberta. Este é o número de vezes, após uma tabela ser aberta ou fechada, em que uma instância de cache tem uma entrada não utilizada e o tamanho da instância é maior que `table_open_cache` / `table_open_cache_instances`.
*  `Tc_log_max_pages_used`

Para a implementação mapeada à memória do log que é usada pelo `mysqld` quando atua como coordenador de transações para a recuperação de transações internas XA, essa variável indica o maior número de páginas usadas para o log desde que o servidor foi iniciado. Se o produto de `Tc_log_max_pages_used` e `Tc_log_page_size` for sempre significativamente menor que o tamanho do log, o tamanho é maior do que o necessário e pode ser reduzido. (O tamanho é definido pela opção `--log-tc-size`. Essa variável é inutilizada: não é necessária para a recuperação com log binário, e o método de log de recuperação mapeado à memória não é usado a menos que o número de motores de armazenamento capazes de dois estágios de compromisso e que suportam transações XA seja maior que um. (`InnoDB` é o único motor aplicável.)
*  `Tc_log_page_size`

  O tamanho da página usado para a implementação mapeada à memória do log de recuperação XA. O valor padrão é determinado usando `getpagesize()`. Essa variável é inutilizada pelos mesmos motivos descritos para `Tc_log_max_pages_used`.
*  `Tc_log_page_waits`

  Para a implementação mapeada à memória do log de recuperação, essa variável é incrementada toda vez que o servidor não conseguiu comprometer uma transação e teve que esperar por uma página livre no log. Se esse valor for grande, você pode querer aumentar o tamanho do log (com a opção `--log-tc-size`). Para a recuperação com log binário, essa variável é incrementada toda vez que o log binário não pode ser fechado porque há transações em dois estágios de compromisso em andamento. (A operação de fechamento aguarda até que todas essas transações sejam concluídas.)
*  `Telemetry_metrics_supported`

  Se as métricas de telemetria do servidor são suportadas.

  Para mais informações, consulte a seção *Serviço de métricas de telemetria do servidor* na documentação do Código-fonte do MySQL.
*  `telemetry.live_sessions`

  Exibe o número atual de sessões instrumentadas com telemetria. Isso pode ser útil ao desativar o componente de Telemetria, para monitorar quantas sessões estão bloqueando a operação de desativação.

Para obter mais informações, consulte a seção *Serviço de rastreamento de telemetria do servidor* na documentação do código-fonte do MySQL e o Capítulo 35, *Telemetria*.
* `Telemetry_traces_supported`

  Se o rastreamento de telemetria do servidor é suportado.

  Para obter mais informações, consulte a seção *Serviço de rastreamento de telemetria do servidor* na documentação do código-fonte do MySQL.
* `Threads_cached`

  O número de threads na cache de threads.
* `Threads_connected`

  O número de conexões abertas atualmente.
* `Threads_created`

  O número de threads criados para lidar com conexões. Se `Threads_created` for grande, você pode querer aumentar o valor de `thread_cache_size`. A taxa de falha de cache pode ser calculada como `Threads_created`/`Connections`.
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