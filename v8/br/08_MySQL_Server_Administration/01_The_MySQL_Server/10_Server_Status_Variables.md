### 7.1.10 Variáveis de Status do Servidor

O servidor MySQL mantém muitas variáveis de estado que fornecem informações sobre sua operação. Você pode visualizar essas variáveis e seus valores usando a instrução `SHOW [GLOBAL | SESSION] STATUS` (consulte a Seção 15.7.7.37, “Instrução SHOW STATUS”). A palavra-chave opcional `GLOBAL` agrega os valores para todas as conexões, e `SESSION` mostra os valores para a conexão atual.

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

Muitas variáveis de status são redefinidas para 0 pela instrução `FLUSH STATUS`.

Esta seção fornece uma descrição de cada variável de status. Para um resumo das variáveis de status, consulte a Seção 7.1.6, “Referência da Variável de Status do Servidor”. Para informações sobre variáveis de status específicas do NDB Cluster, consulte a Seção 25.4.3.9.3, “Variáveis de Status do NDB Cluster”.

As variáveis de status têm os seguintes significados.

- `Aborted_clients`

  O número de conexões que foram interrompidas porque o cliente morreu sem fechar a conexão corretamente. Veja a Seção B.3.2.9, “Erros de Comunicação e Conexões Interrompidas”.

- `Aborted_connects`

  O número de tentativas falhas de conexão com o servidor MySQL. Consulte a Seção B.3.2.9, “Erros de Comunicação e Conexões Abortadas”.

  Para obter informações adicionais sobre a conexão, verifique as variáveis de status `Connection_errors_xxx` e a tabela `host_cache`.

- `Authentication_ldap_sasl_supported_methods`

  O plugin `authentication_ldap_sasl` que implementa a autenticação SASL LDAP suporta vários métodos de autenticação, mas, dependendo da configuração do sistema hospedeiro, nem todos podem estar disponíveis. A variável `Authentication_ldap_sasl_supported_methods` fornece a capacidade de descoberta dos métodos suportados. Seu valor é uma string composta pelos nomes dos métodos suportados separados por espaços. Exemplo: `"SCRAM-SHA 1 SCRAM-SHA-256 GSSAPI"`

  Essa variável foi adicionada no MySQL 8.0.21.

- `Binlog_cache_disk_use`

  O número de transações que utilizaram o cache temporário de log binário, mas que excederam o valor de `binlog_cache_size` e usaram um arquivo temporário para armazenar declarações da transação.

  O número de declarações não transacionais que causaram a gravação do cache de transações do log binário no disco é rastreado separadamente na variável de status `Binlog_stmt_cache_disk_use`.

- `Acl_cache_items_count`

  O número de objetos de privilégio armazenados em cache. Cada objeto é a combinação de privilégios de um usuário e seus papéis ativos.

- `Binlog_cache_use`

  O número de transações que usaram o cache do log binário.

- `Binlog_stmt_cache_disk_use`

  O número de declarações não transacionais que utilizaram o cache de declarações de log binário, mas que excederam o valor de `binlog_stmt_cache_size` e usaram um arquivo temporário para armazenar essas declarações.

- `Binlog_stmt_cache_use`

  O número de declarações não transacionais que usaram o cache de declarações de log binário.

- `Bytes_received`

  O número de bytes recebidos de todos os clientes.

- `Bytes_sent`

  O número de bytes enviados para todos os clientes.

- `Caching_sha2_password_rsa_public_key`

  A chave pública usada pelo plugin de autenticação `caching_sha2_password` para a troca de senhas com base em pares de chaves RSA. O valor só é não-vazio se o servidor inicializar com sucesso as chaves privadas e públicas nos arquivos nomeados pelas variáveis de sistema `caching_sha2_password_private_key_path` e `caching_sha2_password_public_key_path`. O valor de `Caching_sha2_password_rsa_public_key` vem do último arquivo.

- `Com_xxx`

  As variáveis de contagem de declarações `Com_xxx` indicam o número de vezes que cada declaração `xxx` foi executada. Há uma variável de status para cada tipo de declaração. Por exemplo, `Com_delete` e `Com_update` contam as declarações `DELETE` e `UPDATE`, respectivamente. `Com_delete_multi` e `Com_update_multi` são semelhantes, mas se aplicam às declarações `DELETE` e `UPDATE` que usam sintaxe de múltiplas tabelas.

  Todas as variáveis `Com_stmt_xxx` são incrementadas mesmo que um argumento de declaração preparada seja desconhecido ou se um erro ocorrer durante a execução. Em outras palavras, seus valores correspondem ao número de solicitações emitidas, e não ao número de solicitações concluídas com sucesso. Por exemplo, como as variáveis de status são inicializadas para cada inicialização do servidor e não persistem em reinicializações, as variáveis `Com_restart` e `Com_shutdown` que rastreiam as declarações `RESTART` e `SHUTDOWN` normalmente têm um valor de zero, mas podem ser não nulos se as declarações `RESTART` ou `SHUTDOWN` forem executadas, mas falharem.

  As variáveis de status `Com_stmt_xxx` são as seguintes:

  - `Com_stmt_prepare`
  - `Com_stmt_execute`
  - `Com_stmt_fetch`
  - `Com_stmt_send_long_data`
  - `Com_stmt_reset`
  - `Com_stmt_close`

  Essas variáveis representam comandos de declaração preparada. Seus nomes referem-se ao conjunto de comandos `COM_xxx` usado na camada de rede. Em outras palavras, seus valores aumentam sempre que chamadas da API de declaração preparada, como **mysql\_stmt\_prepare()**, **mysql\_stmt\_execute()**, e assim por diante, são executadas. No entanto, `Com_stmt_prepare`, `Com_stmt_execute` e `Com_stmt_close` também aumentam para `PREPARE`, `EXECUTE` ou `DEALLOCATE PREPARE`, respectivamente. Além disso, os valores das variáveis de contador de declarações mais antigas `Com_prepare_sql`, `Com_execute_sql` e `Com_dealloc_sql` aumentam para as declarações `PREPARE`, `EXECUTE` e `DEALLOCATE PREPARE`. `Com_stmt_fetch` representa o número total de viagens de ida e volta na rede emitidas ao buscar em cursors.

  `Com_stmt_reprepare` indica o número de vezes que as declarações foram reprojetadas automaticamente pelo servidor, por exemplo, após alterações de metadados em tabelas ou visualizações referenciadas pela declaração. Uma operação de reprojeção incrementa `Com_stmt_reprepare` e também `Com_stmt_prepare`.

  `Com_explain_other` indica o número de instruções `EXPLAIN FOR CONNECTION` executadas. Consulte a Seção 10.8.4, “Obtendo informações do plano de execução para uma conexão nomeada”.

  `Com_change_repl_filter` indica o número de declarações `CHANGE REPLICATION FILTER` executadas.

- `Compression`

  Se a conexão do cliente utiliza compressão no protocolo cliente/servidor.

  A partir do MySQL 8.0.18, essa variável de status é desaconselhada; espere-se que ela seja removida em uma versão futura do MySQL. Consulte Configurando a Compressão de Conexão Legado.

- `Compression_algorithm`

  O nome do algoritmo de compressão utilizado para a conexão atual com o servidor. O valor pode ser qualquer algoritmo permitido no valor da variável de sistema `protocol_compression_algorithms`. Por exemplo, o valor é `uncompressed` se a conexão não usar compressão, ou `zlib` se a conexão usar o algoritmo `zlib`.

  Para obter mais informações, consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.

  Essa variável foi adicionada no MySQL 8.0.18.

- `Compression_level`

  O nível de compressão utilizado para a conexão atual com o servidor. O valor é 6 para conexões `zlib` (o nível de compressão padrão do algoritmo `zlib`), de 1 a 22 para conexões `zstd` e 0 para conexões `uncompressed`.

  Para obter mais informações, consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.

  Essa variável foi adicionada no MySQL 8.0.18.

- `Connection_errors_xxx`

  Essas variáveis fornecem informações sobre os erros que ocorrem durante o processo de conexão do cliente. Elas são globais e representam contagens de erros agregadas em todas as conexões de todos os hosts. Essas variáveis rastreiam erros que não são contabilizados pelo cache do host (veja a Seção 7.1.12.3, “Consultas DNS e o Cache do Host”), como erros que não estão associados a conexões TCP, ocorrem muito cedo no processo de conexão (mesmo antes de um endereço IP ser conhecido) ou não são específicos para qualquer endereço IP particular (como condições de memória insuficiente).

  - `Connection_errors_accept`

    O número de erros que ocorreram durante as chamadas para `accept()` na porta de escuta.

  - `Connection_errors_internal`

    O número de conexões recusadas devido a erros internos no servidor, como falha ao iniciar um novo thread ou condição de falta de memória.

  - `Connection_errors_max_connections`

    O número de conexões recusadas porque o limite do servidor `max_connections` foi atingido.

  - `Connection_errors_peer_address`

    O número de erros que ocorreram ao procurar por endereços IP do cliente de conexão.

  - `Connection_errors_select`

    O número de erros que ocorreram durante as chamadas para `select()` ou `poll()` na porta de escuta. (O falha desta operação não significa necessariamente que uma conexão com o cliente foi rejeitada.)

  - `Connection_errors_tcpwrap`

    Número de conexões recusadas pela biblioteca `libwrap`.

- `Connections`

  O número de tentativas de conexão (sucedidas ou não) ao servidor MySQL.

- `Created_tmp_disk_tables`

  O número de tabelas temporárias internas no disco criadas pelo servidor durante a execução de instruções.

  Você pode comparar o número de tabelas temporárias internas criadas no disco com o número total de tabelas temporárias internas criadas comparando os valores de `Created_tmp_disk_tables` e `Created_tmp_tables`.

  Nota

  Devido a uma limitação conhecida, o `Created_tmp_disk_tables` não conta tabelas temporárias criadas em arquivos mapeados para memória. Por padrão, o mecanismo de overflow do mecanismo de armazenamento TempTable cria tabelas temporárias internas em arquivos mapeados para memória. Esse comportamento é controlado pela variável `temptable_use_mmap`, que é habilitada por padrão.

  Veja também a Seção 10.4.4, “Uso de Tabelas Temporárias Internas no MySQL”.

- `Created_tmp_files`

  Quantos arquivos temporários o **mysqld** criou.

- `Created_tmp_tables`

  O número de tabelas temporárias internas criadas pelo servidor durante a execução de instruções.

  Você pode comparar o número de tabelas temporárias internas criadas no disco com o número total de tabelas temporárias internas criadas comparando os valores de `Created_tmp_disk_tables` e `Created_tmp_tables`.

  Veja também a Seção 10.4.4, “Uso de Tabelas Temporárias Internas no MySQL”.

  Cada invocação da declaração `SHOW STATUS` usa uma tabela temporária interna e incrementa o valor global `Created_tmp_tables`.

- `Current_tls_ca`

  O valor ativo `ssl_ca` no contexto SSL que o servidor usa para novas conexões. Esse valor do contexto pode diferir do valor atual da variável de sistema `ssl_ca` se a variável de sistema tiver sido alterada, mas `ALTER INSTANCE RELOAD TLS` não tiver sido executada posteriormente para reconfigurar o contexto SSL a partir dos valores das variáveis de sistema relacionadas ao contexto e atualizar as variáveis de status correspondentes. (Essa possível diferença de valores se aplica a cada par correspondente de variáveis de sistema e status relacionadas ao contexto. Consulte Configuração e Monitoramento de Execução no Lado do Servidor para Conexões Encriptadas.)

  Essa variável foi adicionada no MySQL 8.0.16.

  A partir do MySQL 8.0.21, os valores das variáveis de status `Current_tls_xxx` também estão disponíveis através da tabela do Gerenciamento de Desempenho `tls_channel_status`. Consulte a Seção 29.12.21.9, “A tabela tls\_channel\_status”.

- `Current_tls_capath`

  O valor ativo `ssl_capath` no contexto TLS que o servidor usa para novas conexões. Para notas sobre a relação entre essa variável de status e sua variável de sistema correspondente, consulte a descrição de `Current_tls_ca`.

  Essa variável foi adicionada no MySQL 8.0.16.

- `Current_tls_cert`

  O valor ativo `ssl_cert` no contexto TLS que o servidor usa para novas conexões. Para notas sobre a relação entre essa variável de status e sua variável de sistema correspondente, consulte a descrição de `Current_tls_ca`.

  Essa variável foi adicionada no MySQL 8.0.16.

- `Current_tls_cipher`

  O valor ativo `ssl_cipher` no contexto TLS que o servidor usa para novas conexões. Para notas sobre a relação entre essa variável de status e sua variável de sistema correspondente, consulte a descrição de `Current_tls_ca`.

  Essa variável foi adicionada no MySQL 8.0.16.

- `Current_tls_ciphersuites`

  O valor ativo `tls_ciphersuites` no contexto TLS que o servidor usa para novas conexões. Para notas sobre a relação entre essa variável de status e sua variável de sistema correspondente, consulte a descrição de `Current_tls_ca`.

  Essa variável foi adicionada no MySQL 8.0.16.

- `Current_tls_crl`

  O valor ativo `ssl_crl` no contexto TLS que o servidor usa para novas conexões. Para notas sobre a relação entre essa variável de status e sua variável de sistema correspondente, consulte a descrição de `Current_tls_ca`.

  Essa variável foi adicionada no MySQL 8.0.16.

  Nota

  Quando você recarrega o contexto TLS, o OpenSSL recarrega o arquivo que contém a CRL (lista de revogação de certificados) como parte do processo. Se o arquivo CRL for grande, o servidor aloca um grande pedaço de memória (dez vezes o tamanho do arquivo), que é dobrado enquanto a nova instância está sendo carregada e a antiga ainda não foi liberada. A memória residente do processo não é reduzida imediatamente após uma grande alocação ser liberada, então, se você emitir a instrução `ALTER INSTANCE RELOAD TLS` repetidamente com um grande arquivo CRL, o uso da memória residente do processo pode crescer como resultado disso.

- `Current_tls_crlpath`

  O valor ativo `ssl_crlpath` no contexto TLS que o servidor usa para novas conexões. Para notas sobre a relação entre essa variável de status e sua variável de sistema correspondente, consulte a descrição de `Current_tls_ca`.

  Essa variável foi adicionada no MySQL 8.0.16.

- `Current_tls_key`

  O valor ativo `ssl_key` no contexto TLS que o servidor usa para novas conexões. Para notas sobre a relação entre essa variável de status e sua variável de sistema correspondente, consulte a descrição de `Current_tls_ca`.

  Essa variável foi adicionada no MySQL 8.0.16.

- `Current_tls_version`

  O valor ativo `tls_version` no contexto TLS que o servidor usa para novas conexões. Para notas sobre a relação entre essa variável de status e sua variável de sistema correspondente, consulte a descrição de `Current_tls_ca`.

  Essa variável foi adicionada no MySQL 8.0.16.

- `Delayed_errors`

  Essa variável de estado está desatualizada (porque as inserções `DELAYED` não são suportadas); espere que ela seja removida em uma futura versão.

- `Delayed_insert_threads`

  Essa variável de estado está desatualizada (porque as inserções `DELAYED` não são suportadas); espere que ela seja removida em uma futura versão.

- `Delayed_writes`

  Essa variável de estado está desatualizada (porque as inserções `DELAYED` não são suportadas); espere que ela seja removida em uma futura versão.

- `dragnet.Status`

  O resultado da atribuição mais recente à variável de sistema `dragnet.log_error_filter_rules`, vazia se nenhuma tal atribuição tiver ocorrido.

  Essa variável foi adicionada no MySQL 8.0.12.

- `Error_log_buffered_bytes`

  O número de bytes atualmente utilizado na tabela do Gerenciamento de Desempenho `error_log`. É possível que o valor diminua, por exemplo, se um novo evento não puder ser inserido até descartar um evento antigo, mas o novo evento for menor que o antigo.

  Essa variável foi adicionada no MySQL 8.0.22.

- `Error_log_buffered_events`

  O número de eventos atualmente presentes na tabela do Schema de Desempenho `error_log`. Como no `Error_log_buffered_bytes`, é possível que o valor diminua.

  Essa variável foi adicionada no MySQL 8.0.22.

- `Error_log_expired_events`

  O número de eventos descartados da tabela do Schema de Desempenho `error_log` para dar espaço para novos eventos.

  Essa variável foi adicionada no MySQL 8.0.22.

- `Error_log_latest_write`

  O horário da última gravação na tabela do Schema de Desempenho `error_log`.

  Essa variável foi adicionada no MySQL 8.0.22.

- `Flush_commands`

  O número de vezes que o servidor esvazia as tabelas, seja porque um usuário executou uma instrução `FLUSH TABLES` ou devido à operação interna do servidor. Ele também é incrementado com o recebimento de um pacote `COM_REFRESH`. Isso está em contraste com `Com_flush`, que indica quantas instruções `FLUSH` foram executadas, seja `FLUSH TABLES`, `FLUSH LOGS` e assim por diante.

- `Global_connection_memory`

  A memória usada por todas as conexões do usuário com o servidor. A memória usada por threads do sistema ou pela conta raiz do MySQL está incluída no total, mas tais threads ou usuários não estão sujeitos à desconexão devido ao uso de memória. Essa memória não é calculada a menos que `global_connection_memory_tracking` esteja habilitado (desabilitado por padrão). O Schema de Desempenho também deve estar habilitado.

  Você pode controlar (indiretamente) a frequência com que essa variável é atualizada, definindo `connection_memory_chunk_size`.

  A variável de status `Global_connection_memory` foi introduzida no MySQL 8.0.28.

- `Handler_commit`

  O número de declarações internas `COMMIT`.

- `Handler_delete`

  O número de vezes que as linhas foram excluídas das tabelas.

- `Handler_external_lock`

  O servidor incrementa essa variável a cada chamada à sua função `external_lock()`, que geralmente ocorre no início e no final do acesso a uma instância de tabela. Pode haver diferenças entre os motores de armazenamento. Essa variável pode ser usada, por exemplo, para descobrir, para uma instrução que acessa uma tabela particionada, quantos particionamentos foram eliminados antes de ocorrer o bloqueio: Verifique quanto o contador aumentou para a instrução, subtraia 2 (2 chamadas para a própria tabela), depois divida por 2 para obter o número de particionamentos bloqueados.

- `Handler_mrr_init`

  O número de vezes que o servidor usa a própria implementação de leitura de Multi-Range do mecanismo de armazenamento para o acesso à tabela.

- `Handler_prepare`

  Um contador para a fase de preparação de operações de commit de duas fases.

- `Handler_read_first`

  O número de vezes que a primeira entrada de um índice foi lida. Se esse valor for alto, sugere que o servidor está realizando muitas varreduras completas do índice (por exemplo, `SELECT col1 FROM foo`, assumindo que `col1` está indexado).

- `Handler_read_key`

  O número de solicitações para ler uma linha com base em uma chave. Se esse valor for alto, é um bom indicativo de que suas tabelas estão corretamente indexadas para suas consultas.

- `Handler_read_last`

  O número de solicitações para ler a última chave em um índice. Com `ORDER BY`, o servidor emite uma solicitação de primeira chave seguida por várias solicitações de próxima chave, enquanto com `ORDER BY DESC`, o servidor emite uma solicitação de última chave seguida por várias solicitações de chave anterior.

- `Handler_read_next`

  O número de solicitações para ler a próxima linha na ordem de chave. Esse valor é incrementado se você estiver consultando uma coluna de índice com uma restrição de intervalo ou se estiver realizando uma varredura de índice.

- `Handler_read_prev`

  O número de solicitações para ler a linha anterior na ordem chave. Esse método de leitura é usado principalmente para otimizar `ORDER BY ... DESC`.

- `Handler_read_rnd`

  O número de solicitações para ler uma linha com base em uma posição fixa. Esse valor é alto se você estiver fazendo muitas consultas que exigem a ordenação dos resultados. Provavelmente você tem muitas consultas que exigem que o MySQL escaneie tabelas inteiras ou você tem junções que não usam chaves corretamente.

- `Handler_read_rnd_next`

  O número de solicitações para ler a próxima linha no arquivo de dados. Esse valor é alto se você estiver realizando muitas varreduras de tabela. Geralmente, isso sugere que suas tabelas não estão corretamente indexadas ou que suas consultas não foram escritas para aproveitar os índices que você tem.

- `Handler_rollback`

  O número de solicitações para que um mecanismo de armazenamento realize uma operação de rollback.

- `Handler_savepoint`

  O número de solicitações para que um mecanismo de armazenamento coloque um ponto de salvamento.

- `Handler_savepoint_rollback`

  O número de solicitações para que um mecanismo de armazenamento volte a um ponto de salvamento.

- `Handler_update`

  O número de solicitações para atualizar uma linha em uma tabela.

- `Handler_write`

  O número de solicitações para inserir uma linha em uma tabela.

- `Innodb_buffer_pool_dump_status`

  O progresso de uma operação para registrar as páginas armazenadas no pool de memória de búfer `InnoDB`, acionado pela configuração de `innodb_buffer_pool_dump_at_shutdown` ou `innodb_buffer_pool_dump_now`.

  Para informações e exemplos relacionados, consulte a Seção 17.8.3.6, “Salvar e restaurar o estado do pool de buffers”.

- `Innodb_buffer_pool_load_status`

  O progresso de uma operação para aquecer o pool de buffers `InnoDB` lendo um conjunto de páginas correspondentes a um ponto anterior no tempo, acionado pela configuração de `innodb_buffer_pool_load_at_startup` ou `innodb_buffer_pool_load_now`. Se a operação introduzir um excesso de overhead, você pode cancelá-la configurando `innodb_buffer_pool_load_abort`.

  Para informações e exemplos relacionados, consulte a Seção 17.8.3.6, “Salvar e restaurar o estado do pool de buffers”.

- `Innodb_buffer_pool_bytes_data`

  O número total de bytes no pool de buffers `InnoDB` que contém dados. O número inclui páginas sujas e limpas. Para cálculos mais precisos de uso de memória do que com `Innodb_buffer_pool_pages_data`, quando tabelas compactadas fazem com que o pool de buffers retenha páginas de tamanhos diferentes.

- `Innodb_buffer_pool_pages_data`

  O número de páginas no pool de buffers `InnoDB` que contêm dados. O número inclui páginas sujas e limpas. Ao usar tabelas compactadas, o valor reportado de `Innodb_buffer_pool_pages_data` pode ser maior que `Innodb_buffer_pool_pages_total` (Bug #59550).

- `Innodb_buffer_pool_bytes_dirty`

  O número total atual de bytes mantidos em páginas sujas no pool de buffers `InnoDB`. Para cálculos mais precisos de uso de memória do que com `Innodb_buffer_pool_pages_dirty`, quando tabelas compactadas fazem com que o pool de buffers mantenha páginas de tamanhos diferentes.

- `Innodb_buffer_pool_pages_dirty`

  O número atual de páginas sujas no pool de buffer `InnoDB`.

- `Innodb_buffer_pool_pages_flushed`

  Número de solicitações para limpar páginas do pool de buffer `InnoDB`.

- `Innodb_buffer_pool_pages_free`

  O número de páginas livres no pool de buffers `InnoDB`.

- `Innodb_buffer_pool_pages_latched`

  O número de páginas abertas no pool de buffers `InnoDB`. São páginas que estão sendo lidas ou escritas atualmente ou que não podem ser descartadas ou removidas por algum outro motivo. O cálculo dessa variável é caro, portanto, ela está disponível apenas quando o sistema `UNIV_DEBUG` é definido no momento da construção do servidor.

- `Innodb_buffer_pool_pages_misc`

  O número de páginas no pool de buffers `InnoDB` que estão ocupadas porque foram alocadas para overhead administrativo, como bloqueios de linhas ou o índice de hash adaptativo. Esse valor também pode ser calculado como `Innodb_buffer_pool_pages_total` − `Innodb_buffer_pool_pages_free` − `Innodb_buffer_pool_pages_data`. Ao usar tabelas compactadas, `Innodb_buffer_pool_pages_misc` pode reportar um valor fora dos limites (Bug #59550).

- `Innodb_buffer_pool_pages_total`

  O tamanho total do pool de buffers `InnoDB`, em páginas. Ao usar tabelas compactadas, o valor reportado de `Innodb_buffer_pool_pages_data` pode ser maior que `Innodb_buffer_pool_pages_total` (Bug #59550)

- `Innodb_buffer_pool_read_ahead`

  O número de páginas lidas no pool de buffers `InnoDB` pela thread de pré-leitura em segundo plano.

- `Innodb_buffer_pool_read_ahead_evicted`

  O número de páginas lidas no pool de buffers `InnoDB` pela thread de pré-leitura em segundo plano que foram posteriormente removidas sem terem sido acessadas por consultas.

- `Innodb_buffer_pool_read_ahead_rnd`

  O número de leituras "aleatórias" iniciadas por `InnoDB`. Isso acontece quando uma consulta examina uma grande parte de uma tabela, mas em ordem aleatória.

- `Innodb_buffer_pool_read_requests`

  O número de solicitações de leitura lógicas.

- `Innodb_buffer_pool_reads`

  O número de leituras lógicas que `InnoDB` não conseguiu satisfazer do pool de buffer e teve que ler diretamente do disco.

- `Innodb_buffer_pool_resize_status`

  O status de uma operação para redimensionar o pool de buffers `InnoDB` dinamicamente, acionada pelo ajuste dinâmico do parâmetro `innodb_buffer_pool_size`. O parâmetro `innodb_buffer_pool_size` é dinâmico, o que permite redimensionar o pool de buffers sem reiniciar o servidor. Consulte Configurando o Tamanho do Pool de Buffers InnoDB Online para obter informações relacionadas.

- `Innodb_buffer_pool_resize_status_code`

  Códigos de status dos relatórios para o rastreamento de operações de redimensionamento do pool de buffer online. Cada código de status representa uma etapa de uma operação de redimensionamento. Os códigos de status incluem:

  - 0: Nenhuma operação de redimensionamento em andamento
  - 1: Começar Redimensionar
  - 2: Desativando o AHI (Índice Hash Adaptativo)
  - 3: Retirada de blocos
  - 4: Adquirindo o Bloqueio Global
  - 5: Pool de redimensionamento
  - 6: Recortar Hash
  - 7: Redimensionamento falhou

  Você pode usar essa variável de status em conjunto com `Innodb_buffer_pool_resize_status_progress` para acompanhar o progresso de cada etapa de uma operação de redimensionamento. A variável `Innodb_buffer_pool_resize_status_progress` informa um valor percentual que indica o progresso da etapa atual.

  Para obter mais informações, consulte Monitoramento do progresso de redimensionamento do pool de buffers online.

- `Innodb_buffer_pool_resize_status_progress`

  Representa um valor percentual que indica o progresso da etapa atual de uma operação de redimensionamento de um pool de tampão online. Esta variável é usada em conjunto com `Innodb_buffer_pool_resize_status_code`, que representa um código de status que indica a etapa atual de uma operação de redimensionamento de um pool de tampão online.

  O valor percentual é atualizado após cada instância do pool de buffers ser processada. À medida que o código de status (relatado por `Innodb_buffer_pool_resize_status_code`) muda de um status para outro, o valor percentual é redefinido para 0.

  Para informações relacionadas, consulte Monitoramento do progresso de redimensionamento do pool de buffers online.

- `Innodb_buffer_pool_wait_free`

  Normalmente, as mensagens para o pool de buffers `InnoDB` ocorrem em segundo plano. Quando o `InnoDB` precisa ler ou criar uma página e não há páginas limpas disponíveis, o `InnoDB` esvazia primeiro algumas páginas sujas e aguarda que essa operação termine. Esse contador conta as instâncias dessas espera. Se o `innodb_buffer_pool_size` tiver sido configurado corretamente, esse valor deve ser pequeno.

- `Innodb_buffer_pool_write_requests`

  O número de gravações feitas no pool de buffers `InnoDB`.

- `Innodb_data_fsyncs`

  O número de operações `fsync()` até agora. A frequência das chamadas `fsync()` é influenciada pela configuração da opção de configuração `innodb_flush_method`.

  Conta o número de operações `fdatasync()` se `innodb_use_fdatasync` estiver ativado.

- `Innodb_data_pending_fsyncs`

  O número atual de operações pendentes `fsync()`. A frequência das chamadas `fsync()` é influenciada pela configuração da opção de configuração `innodb_flush_method`.

- `Innodb_data_pending_reads`

  O número atual de leituras pendentes.

- `Innodb_data_pending_writes`

  O número atual de gravações pendentes.

- `Innodb_data_read`

  A quantidade de dados lidos desde que o servidor foi iniciado (em bytes).

- `Innodb_data_reads`

  O número total de leituras de dados (leitura de arquivos do sistema operacional).

- `Innodb_data_writes`

  O número total de gravações de dados.

- `Innodb_data_written`

  A quantidade de dados escritos até agora, em bytes.

- `Innodb_dblwr_pages_written`

  O número de páginas que foram escritas no buffer de escrita dupla. Consulte a Seção 17.11.1, “Entrada/Saída de Disco do InnoDB”.

- `Innodb_dblwr_writes`

  O número de operações de escrita dupla que foram realizadas. Consulte a Seção 17.11.1, “Entrada/Saída de Disco InnoDB”.

- `Innodb_have_atomic_builtins`

  Indica se o servidor foi construído com instruções atômicas.

- `Innodb_log_waits`

  O número de vezes em que o buffer de log foi muito pequeno e foi necessário aguardar para que ele fosse esvaziado antes de continuar.

- `Innodb_log_write_requests`

  Número de solicitações de escrita para o log de refazer `InnoDB`.

- `Innodb_log_writes`

  Número de escritas físicas no arquivo de log de redo `InnoDB`.

- `Innodb_num_open_files`

  O número de arquivos `InnoDB` atualmente abertos.

- `Innodb_os_log_fsyncs`

  O número de `fsync()` escritas feitas nos arquivos de log de redo `InnoDB`.

- `Innodb_os_log_pending_fsyncs`

  O número de operações pendentes `fsync()` para os arquivos de registro de reverso `InnoDB`.

- `Innodb_os_log_pending_writes`

  O número de gravações pendentes nos arquivos de log de redo `InnoDB`.

- `Innodb_os_log_written`

  O número de bytes escritos nos arquivos de registro `InnoDB` redo.

- `Innodb_page_size`

  `InnoDB` tamanho da página (padrão 16 KB). Muitos valores são contados em páginas; o tamanho da página permite que eles sejam facilmente convertidos em bytes.

- `Innodb_pages_created`

  O número de páginas criadas por operações nas tabelas `InnoDB`.

- `Innodb_pages_read`

  O número de páginas lidas do pool de buffers `InnoDB` por operações nas tabelas `InnoDB`.

- `Innodb_pages_written`

  O número de páginas escritas por operações nas tabelas `InnoDB`.

- `Innodb_redo_log_enabled`

  Se o registro de refazer está habilitado ou desabilitado. Veja Desativar o Registro de Refazer.

  Essa variável foi adicionada no MySQL 8.0.21.

- `Innodb_redo_log_capacity_resized`

  A capacidade total do log de refazer para todos os arquivos de log de refazer, em bytes, após a última operação de redimensionamento de capacidade concluída. O valor inclui arquivos de log de refazer comuns e de reserva.

  Se não houver nenhuma operação pendente de redimensionamento para baixo, `Innodb_redo_log_capacity_resized` deve ser igual ao ajuste `innodb_redo_log_capacity` (se estiver sendo usado) ou deve ser (*(innodb\_log\_files\_in\_group \* innodb\_log\_file\_size*)) se esses forem usados. Consulte a documentação do `innodb_redo_log_capacity` para mais esclarecimentos. As operações de redimensionamento para cima são instantâneas.

  Para informações relacionadas, consulte a Seção 17.6.5, “Registro de Refazer”.

  Essa variável foi adicionada no MySQL 8.0.30.

- `Innodb_redo_log_checkpoint_lsn`

  O ponto de verificação do log de refazer LSN. Para informações relacionadas, consulte a Seção 17.6.5, “Log de Refazer”.

  Essa variável foi adicionada no MySQL 8.0.30.

- `Innodb_redo_log_current_lsn`

  A LSN atual representa a última posição escrita no buffer do log de refazer. `InnoDB` escreve dados no buffer do log de refazer dentro do processo do MySQL antes de solicitar que o sistema operacional escreva os dados no arquivo atual do log de refazer. Para informações relacionadas, consulte a Seção 17.6.5, “Log de Refazer”.

  Essa variável foi adicionada no MySQL 8.0.30.

- `Innodb_redo_log_flushed_to_disk_lsn`

  O LSN `InnoDB` que foi enviado para o disco escreve primeiro os dados no log de reversão e, em seguida, solicita que o sistema operacional envie os dados para o disco. O LSN enviado para o disco representa a última posição no log de reversão que o `InnoDB` sabe que foi enviada para o disco. Para informações relacionadas, consulte a Seção 17.6.5, “Log de Reversão”.

  Essa variável foi adicionada no MySQL 8.0.30.

- `Innodb_redo_log_logical_size`

  Um valor de tamanho de dados, em bytes, que representa o intervalo de LSN (Log Segment Number) contendo dados do log de reverso em uso, abrangendo desde o bloco mais antigo necessário pelos consumidores do log de reverso até o bloco mais recente escrito. Para informações relacionadas, consulte a Seção 17.6.5, “Log de Reverso”.

  Essa variável foi adicionada no MySQL 8.0.30.

- `Innodb_redo_log_physical_size`

  O espaço em disco em bytes atualmente consumido por todos os arquivos de log de refazer no disco, excluindo os arquivos de log de refazer de reserva. Para informações relacionadas, consulte a Seção 17.6.5, "Log de Refazer".

  Essa variável foi adicionada no MySQL 8.0.30.

- `Innodb_redo_log_read_only`

  Se o log de refazer é somente de leitura.

  Essa variável foi adicionada no MySQL 8.0.30.

- `Innodb_redo_log_resize_status`

  O status de redimensionamento do log de revisão, que indica o estado atual do mecanismo de redimensionamento da capacidade do log de revisão. Os valores possíveis incluem:

  - `OK`: Não há problemas e nenhuma operação pendente de redimensionamento da capacidade do log de redo.

  - `Resizing down`: Uma operação de redimensionamento para baixo está em andamento.

  Uma operação de redimensionamento é instantânea e, portanto, não tem status pendente.

  Essa variável foi adicionada no MySQL 8.0.30.

- `Innodb_redo_log_uuid`

  O UUID do log de refazer.

  Essa variável foi adicionada no MySQL 8.0.30.

- `Innodb_row_lock_current_waits`

  O número de bloqueios de linha atualmente aguardados por operações nas tabelas `InnoDB`.

- `Innodb_row_lock_time`

  O tempo total gasto na aquisição de blocos de linha para as tabelas `InnoDB`, em milissegundos.

- `Innodb_row_lock_time_avg`

  O tempo médio para adquirir um bloqueio de linha para tabelas `InnoDB`, em milissegundos.

- `Innodb_row_lock_time_max`

  O tempo máximo para adquirir um bloqueio de linha para tabelas `InnoDB`, em milissegundos.

- `Innodb_row_lock_waits`

  O número de vezes em que as operações nas tabelas `InnoDB` tiveram que esperar por um bloqueio de linha.

- `Innodb_rows_deleted`

  O número de linhas excluídas das tabelas `InnoDB`.

- `Innodb_rows_inserted`

  O número de linhas inseridas nas tabelas `InnoDB`.

- `Innodb_rows_read`

  O número de linhas lidas das tabelas `InnoDB`.

- `Innodb_rows_updated`

  O número estimado de linhas atualizadas nas tabelas `InnoDB`.

  Nota

  Esse valor não é preciso em 100%. Para obter um resultado preciso (mas mais caro), use `ROW_COUNT()`.

- `Innodb_system_rows_deleted`

  O número de linhas excluídas das tabelas `InnoDB` pertencentes a esquemas criados pelo sistema.

- `Innodb_system_rows_inserted`

  O número de linhas inseridas nas tabelas `InnoDB` pertencentes a esquemas criados pelo sistema.

- `Innodb_system_rows_updated`

  O número de linhas atualizadas nas tabelas `InnoDB` pertencentes a esquemas criados pelo sistema.

- `Innodb_system_rows_read`

  O número de linhas lidas das tabelas `InnoDB` pertencentes a esquemas criados pelo sistema.

- `Innodb_truncated_status_writes`

  Número de vezes que a saída da instrução `SHOW ENGINE INNODB STATUS` foi truncada.

- `Innodb_undo_tablespaces_active`

  O número de tabelaspaces de desfazer ativas. Inclui tanto os tabelaspaces de desfazer implícitos (criados pelo `InnoDB` quanto os explícitos (criados pelo usuário). Para obter informações sobre tabelaspaces de desfazer, consulte a Seção 17.6.3.4, “Tabelaspaces de Desfazer”.

- `Innodb_undo_tablespaces_explicit`

  Número de espaços de tabela de desfazer criados pelo usuário. Para obter informações sobre espaços de tabela de desfazer, consulte a Seção 17.6.3.4, “Espaços de tabela de desfazer”.

- `Innodb_undo_tablespaces_implicit`

  O número de espaços de tabelas de reversão criados por `InnoDB`. Dois espaços de tabelas de reversão padrão são criados por `InnoDB` quando a instância do MySQL é inicializada. Para obter informações sobre espaços de tabelas de reversão, consulte a Seção 17.6.3.4, “Espaços de tabelas de reversão”.

- `Innodb_undo_tablespaces_total`

  O número total de espaços de tabela de desfazer. Inclui tanto espaços de tabela de desfazer implícitos (criados por `InnoDB`) quanto explícitos (criados pelo usuário), ativos e inativos. Para obter informações sobre espaços de tabela de desfazer, consulte a Seção 17.6.3.4, “Espaços de tabela de desfazer”.

- `Key_blocks_not_flushed`

  O número de blocos-chave no cache de chave `MyISAM` que foram alterados, mas ainda não foram descarregados no disco.

- `Key_blocks_unused`

  Número de blocos não utilizados no cache de chave `MyISAM`. Você pode usar esse valor para determinar quanto da cache de chave está em uso; consulte a discussão sobre `key_buffer_size` na Seção 7.1.8, “Variáveis do Sistema do Servidor”.

- `Key_blocks_used`

  O número de blocos usados no cache da chave `MyISAM`. Esse valor é um limite máximo que indica o número máximo de blocos que já estiveram em uso ao mesmo tempo.

- `Key_read_requests`

  O número de solicitações para ler um bloco-chave do cache de chave `MyISAM`.

- `Key_reads`

  O número de leituras físicas de um bloco-chave do disco para o cache de chave `MyISAM`. Se `Key_reads` for grande, então seu valor de `key_buffer_size` provavelmente é muito pequeno. A taxa de falha de cache pode ser calculada como `Key_reads`/`Key_read_requests`.

- `Key_write_requests`

  Número de solicitações para escrever um bloco chave no cache de chave `MyISAM`.

- `Key_writes`

  O número de gravações físicas de um bloco-chave da cache de chave `MyISAM` para o disco.

- `Last_query_cost`

  O custo total da última consulta compilada, conforme calculado pelo otimizador de consultas. Isso é útil para comparar o custo de diferentes planos de consulta para a mesma consulta. O valor padrão de 0 significa que nenhuma consulta foi compilada ainda. O valor padrão é 0. `Last_query_cost` tem escopo de sessão.

  No MySQL 8.0.16 e versões posteriores, essa variável mostra o custo das consultas que têm múltiplos blocos de consulta, somando as estimativas de custo de cada bloco de consulta, estimativa de quantas vezes subconsultas não cacheáveis são executadas e multiplicando o custo desses blocos de consulta pelo número de execuções de subconsultas. (Bug #92766, Bug #28786951) Antes do MySQL 8.0.16, `Last_query_cost` era calculado com precisão apenas para consultas simples e "planas", mas não para consultas complexas, como aquelas que contêm subconsultas ou `UNION`. (Para este último, o valor era definido como 0.)

- `Last_query_partial_plans`

  O número de iterações que o otimizador de consultas fez na construção do plano de execução para a consulta anterior.

  `Last_query_partial_plans` tem escopo de sessão.

- `Locked_connects`

  Número de tentativas para se conectar a contas de usuários bloqueadas. Para obter informações sobre bloqueio e desbloqueio de contas, consulte a Seção 8.2.20, “Bloqueio de Conta”.

- `Max_execution_time_exceeded`

  O número de declarações `SELECT` para as quais o tempo de execução foi excedido.

- `Max_execution_time_set`

  O número de declarações `SELECT` para as quais um tempo de espera de execução não nulo foi definido. Isso inclui declarações que incluem uma dica de otimizador não nulo `MAX_EXECUTION_TIME`, e declarações que não incluem essa dica, mas são executadas enquanto o tempo de espera indicado pela variável de sistema `max_execution_time` não for nulo.

- `Max_execution_time_set_failed`

  Número de declarações `SELECT` para as quais a tentativa de definir um tempo limite de execução falhou.

- `Max_used_connections`

  O número máximo de conexões que estão em uso simultaneamente desde que o servidor começou.

- `Max_used_connections_time`

  O momento em que `Max_used_connections` atingiu seu valor atual.

- `Not_flushed_delayed_rows`

  Essa variável de estado está desatualizada (porque as inserções `DELAYED` não são suportadas); espere que ela seja removida em uma futura versão.

- `mecab_charset`

  O conjunto de caracteres atualmente utilizado pelo plugin de analisador de texto completo MeCab. Para informações relacionadas, consulte a Seção 14.9.9, “Plugin de Analisador de Texto Completo MeCab”.

- `Ongoing_anonymous_transaction_count`

  Mostra o número de transações em andamento que foram marcadas como anônimas. Isso pode ser usado para garantir que nenhuma transação adicional esteja aguardando processamento.

- `Ongoing_anonymous_gtid_violating_transaction_count`

  Essa variável de status está disponível apenas em builds de depuração. Mostra o número de transações em andamento que usam `gtid_next=ANONYMOUS` e que violam a consistência do GTID.

- `Ongoing_automatic_gtid_violating_transaction_count`

  Essa variável de status está disponível apenas em builds de depuração. Mostra o número de transações em andamento que usam `gtid_next=AUTOMATIC` e que violam a consistência do GTID.

- `Open_files`

  O número de arquivos abertos. Esse contagem inclui arquivos regulares abertos pelo servidor. Não inclui outros tipos de arquivos, como soquetes ou tubos. Além disso, o contagem não inclui arquivos que os motores de armazenamento abrem usando suas próprias funções internas, em vez de pedir ao nível do servidor para fazer isso.

- `Open_streams`

  O número de fluxos abertos (usados principalmente para registro).

- `Open_table_definitions`

  Número de definições de tabelas armazenadas em cache.

- `Open_tables`

  O número de tabelas abertas.

- `Opened_files`

  O número de arquivos abertos com `my_open()` (uma função da biblioteca `mysys`). Parte do servidor que abre arquivos sem usar essa função não incrementa o contador.

- `Opened_table_definitions`

  O número de definições de tabela que foram armazenadas em cache.

- `Opened_tables`

  O número de tabelas que foram abertas. Se `Opened_tables` for grande, seu valor `table_open_cache` provavelmente é muito pequeno.

- `Performance_schema_xxx`

  As variáveis de status do Schema de Desempenho estão listadas na Seção 29.16, “Variáveis de Status do Schema de Desempenho”. Essas variáveis fornecem informações sobre a instrumentação que não pôde ser carregada ou criada devido a restrições de memória.

- `Prepared_stmt_count`

  O número atual de declarações preparadas. (O número máximo de declarações é dado pela variável de sistema `max_prepared_stmt_count`.)

- `Queries`

  O número de instruções executadas pelo servidor. Esta variável inclui instruções executadas dentro de programas armazenados, ao contrário da variável `Questions`. Não conta os comandos `COM_PING` ou `COM_STATISTICS`.

  A discussão no início desta seção indica como relacionar essa variável de status de contagem de declarações a outras variáveis semelhantes.

- `Questions`

  O número de instruções executadas pelo servidor. Isso inclui apenas as instruções enviadas ao servidor pelos clientes e não as instruções executadas dentro de programas armazenados, ao contrário da variável `Queries`. Esta variável não conta com os comandos `COM_PING`, `COM_STATISTICS`, `COM_STMT_PREPARE`, `COM_STMT_CLOSE` ou `COM_STMT_RESET`.

  A discussão no início desta seção indica como relacionar essa variável de status de contagem de declarações a outras variáveis semelhantes.

- `Replica_open_temp_tables`

  A partir do MySQL 8.0.26, use `Replica_open_temp_tables` no lugar de `Slave_open_temp_tables`, que foi descontinuado a partir dessa versão. Em versões anteriores ao MySQL 8.0.26, use `Slave_open_temp_tables`.

  `Replica_open_temp_tables` mostra o número de tabelas temporárias que o thread SQL de replicação atualmente tem aberto. Se o valor for maior que zero, não é seguro desligar a replica; veja a Seção 19.5.1.31, “Replicação e Tabelas Temporárias”. Esta variável relata o total de tabelas temporárias abertas para *todos* os canais de replicação.

- `Replica_rows_last_search_algorithm_used`

  A partir do MySQL 8.0.26, use `Replica_rows_last_search_algorithm_used` no lugar de `Slave_rows_last_search_algorithm_used`, que foi descontinuado a partir dessa versão. Em versões anteriores ao MySQL 8.0.26, use `Slave_rows_last_search_algorithm_used`.

  `Replica_rows_last_search_algorithm_used` mostra o algoritmo de busca mais recentemente utilizado por essa replica para localizar linhas para a replicação baseada em linhas. O resultado mostra se a replica usou índices, uma varredura de tabela ou hashing como o algoritmo de busca para a última transação executada em qualquer canal.

  O método utilizado depende do ambiente da variável de sistema `slave_rows_search_algorithms` (que agora está desatualizada) e das chaves disponíveis na tabela relevante.

  Essa variável está disponível apenas para as compilações de depuração do MySQL.

- `Resource_group_supported`

  Indica se o recurso do grupo de recursos é suportado.

  Em algumas plataformas ou configurações do servidor MySQL, os grupos de recursos não estão disponíveis ou têm limitações. Em particular, os sistemas Linux podem exigir uma etapa manual para alguns métodos de instalação. Para obter detalhes, consulte Restrições de grupos de recursos.

- `Rpl_semi_sync_master_clients`

  O número de réplicas semissíncronas.

  `Rpl_semi_sync_master_clients` está disponível quando o plugin `rpl_semi_sync_master` (biblioteca `semisync_master.so`) foi instalado na réplica para configurar a replicação semiesincronizada. Se o plugin `rpl_semi_sync_source` (biblioteca `semisync_source.so`) foi instalado, `Rpl_semi_sync_source_clients` está disponível.

- `Rpl_semi_sync_master_net_avg_wait_time`

  O tempo médio em microsegundos que a fonte esperou por uma resposta replicada. Esta variável é sempre `0`, e está desatualizada; espere que ela seja removida em uma versão futura.

  `Rpl_semi_sync_master_net_avg_wait_time` está disponível quando o plugin `rpl_semi_sync_master` (biblioteca `semisync_master.so`) foi instalado na réplica para configurar a replicação semiesincronizada. Se o plugin `rpl_semi_sync_source` (biblioteca `semisync_source.so`) foi instalado, `Rpl_semi_sync_source_net_avg_wait_time` está disponível.

- `Rpl_semi_sync_master_net_wait_time`

  O tempo total em microsegundos que a fonte esperou por respostas replicadas. Esta variável é sempre `0` e está desatualizada; espere que ela seja removida em uma versão futura.

  `Rpl_semi_sync_master_net_wait_time` está disponível quando o plugin `rpl_semi_sync_master` (biblioteca `semisync_master.so`) foi instalado na réplica para configurar a replicação semiesincronizada. Se o plugin `rpl_semi_sync_source` (biblioteca `semisync_source.so`) foi instalado, `Rpl_semi_sync_source_net_wait_time` está disponível.

- `Rpl_semi_sync_master_net_waits`

  O número total de vezes que a fonte esperou por respostas replicadas.

  `Rpl_semi_sync_master_net_waits` está disponível quando o plugin `rpl_semi_sync_master` (biblioteca `semisync_master.so`) foi instalado na réplica para configurar a replicação semiesincronizada. Se o plugin `rpl_semi_sync_source` (biblioteca `semisync_source.so`) foi instalado, `Rpl_semi_sync_source_net_waits` está disponível.

- `Rpl_semi_sync_master_no_times`

  Número de vezes que a fonte desativou a replicação semisincronizada.

  `Rpl_semi_sync_master_no_times` está disponível quando o plugin `rpl_semi_sync_master` (biblioteca `semisync_master.so`) foi instalado na réplica para configurar a replicação semiesincronizada. Se o plugin `rpl_semi_sync_source` (biblioteca `semisync_source.so`) foi instalado, `Rpl_semi_sync_source_no_times` está disponível.

- `Rpl_semi_sync_master_no_tx`

  O número de commits que não foram reconhecidos com sucesso por uma réplica.

  `Rpl_semi_sync_master_no_tx` está disponível quando o plugin `rpl_semi_sync_master` (biblioteca `semisync_master.so`) foi instalado na réplica para configurar a replicação semiesincronizada. Se o plugin `rpl_semi_sync_source` (biblioteca `semisync_source.so`) foi instalado, `Rpl_semi_sync_source_no_tx` está disponível.

- `Rpl_semi_sync_master_status`

  Se a replicação semi-sincronizada está atualmente em operação na fonte. O valor é `ON` se o plugin tiver sido habilitado e um reconhecimento de commit ocorrer. É `OFF` se o plugin não estiver habilitado ou se a fonte tiver retornado para replicação assíncrona devido ao tempo limite de reconhecimento de commit.

  `Rpl_semi_sync_master_status` está disponível quando o plugin `rpl_semi_sync_master` (biblioteca `semisync_master.so`) foi instalado na réplica para configurar a replicação semiesincronizada. Se o plugin `rpl_semi_sync_source` (biblioteca `semisync_source.so`) foi instalado, `Rpl_semi_sync_source_status` está disponível.

- `Rpl_semi_sync_master_timefunc_failures`

  O número de vezes que a fonte falhou ao chamar funções de tempo, como `gettimeofday()`.

  `Rpl_semi_sync_master_timefunc_failures` está disponível quando o plugin `rpl_semi_sync_master` (biblioteca `semisync_master.so`) foi instalado na réplica para configurar a replicação semiesincronizada. Se o plugin `rpl_semi_sync_source` (biblioteca `semisync_source.so`) foi instalado, `Rpl_semi_sync_source_timefunc_failures` está disponível.

- `Rpl_semi_sync_master_tx_avg_wait_time`

  O tempo médio em microsegundos que a fonte esperou por cada transação.

  `Rpl_semi_sync_master_tx_avg_wait_time` está disponível quando o plugin `rpl_semi_sync_master` (biblioteca `semisync_master.so`) foi instalado na réplica para configurar a replicação semiesincronizada. Se o plugin `rpl_semi_sync_source` (biblioteca `semisync_source.so`) foi instalado, `Rpl_semi_sync_source_tx_avg_wait_time` está disponível.

- `Rpl_semi_sync_master_tx_wait_time`

  O tempo total em microsegundos que a fonte esperou por transações.

  `Rpl_semi_sync_master_tx_wait_time` está disponível quando o plugin `rpl_semi_sync_master` (biblioteca `semisync_master.so`) foi instalado na réplica para configurar a replicação semiesincronizada. Se o plugin `rpl_semi_sync_source` (biblioteca `semisync_source.so`) foi instalado, `Rpl_semi_sync_source_tx_wait_time` está disponível.

- `Rpl_semi_sync_master_tx_waits`

  O número total de vezes que a fonte esperou por transações.

  `Rpl_semi_sync_master_tx_waits` está disponível quando o plugin `rpl_semi_sync_master` (biblioteca `semisync_master.so`) foi instalado na réplica para configurar a replicação semiesincronizada. Se o plugin `rpl_semi_sync_source` (biblioteca `semisync_source.so`) foi instalado, `Rpl_semi_sync_source_tx_waits` está disponível.

- `Rpl_semi_sync_master_wait_pos_backtraverse`

  O número total de vezes que a fonte esperou por um evento com coordenadas binárias inferiores às esperadas anteriormente. Isso pode ocorrer quando a ordem em que as transações começam a esperar por uma resposta é diferente da ordem em que seus eventos de log binário são escritos.

  `Rpl_semi_sync_master_wait_pos_backtraverse` está disponível quando o plugin `rpl_semi_sync_master` (biblioteca `semisync_master.so`) foi instalado na réplica para configurar a replicação semiesincronizada. Se o plugin `rpl_semi_sync_source` (biblioteca `semisync_source.so`) foi instalado, `Rpl_semi_sync_source_wait_pos_backtraverse` está disponível.

- `Rpl_semi_sync_master_wait_sessions`

  O número de sessões que estão aguardando respostas replicadas atualmente.

  `Rpl_semi_sync_master_wait_sessions` está disponível quando o plugin `rpl_semi_sync_master` (biblioteca `semisync_master.so`) foi instalado na réplica para configurar a replicação semiesincronizada. Se o plugin `rpl_semi_sync_source` (biblioteca `semisync_source.so`) foi instalado, `Rpl_semi_sync_source_wait_sessions` está disponível.

- `Rpl_semi_sync_master_yes_tx`

  O número de commits que foram reconhecidos com sucesso por uma réplica.

  `Rpl_semi_sync_master_yes_tx` está disponível quando o plugin `rpl_semi_sync_master` (biblioteca `semisync_master.so`) foi instalado na réplica para configurar a replicação semiesincronizada. Se o plugin `rpl_semi_sync_source` (biblioteca `semisync_source.so`) foi instalado, `Rpl_semi_sync_source_yes_tx` está disponível.

- `Rpl_semi_sync_source_clients`

  O número de réplicas semissíncronas.

  `Rpl_semi_sync_source_clients` está disponível quando o plugin `rpl_semi_sync_source` (biblioteca `semisync_source.so`) foi instalado na fonte para configurar a replicação semiesincronizada. Se o plugin `rpl_semi_sync_master` (biblioteca `semisync_master.so`) foi instalado, `Rpl_semi_sync_master_clients` está disponível.

- `Rpl_semi_sync_source_net_avg_wait_time`

  O tempo médio em microsegundos que a fonte esperou por uma resposta replicada. Esta variável é sempre `0`, e está desatualizada; espere que ela seja removida em uma versão futura.

  `Rpl_semi_sync_source_net_avg_wait_time` está disponível quando o plugin `rpl_semi_sync_source` (biblioteca `semisync_source.so`) foi instalado na fonte para configurar a replicação semiesincronizada. Se o plugin `rpl_semi_sync_master` (biblioteca `semisync_master.so`) foi instalado, `Rpl_semi_sync_master_net_avg_wait_time` está disponível.

- `Rpl_semi_sync_source_net_wait_time`

  O tempo total em microsegundos que a fonte esperou por respostas replicadas. Esta variável é sempre `0` e está desatualizada; espere que ela seja removida em uma versão futura.

  `Rpl_semi_sync_source_net_wait_time` está disponível quando o plugin `rpl_semi_sync_source` (biblioteca `semisync_source.so`) foi instalado na fonte para configurar a replicação semiesincronizada. Se o plugin `rpl_semi_sync_master` (biblioteca `semisync_master.so`) foi instalado, `Rpl_semi_sync_master_net_wait_time` está disponível.

- `Rpl_semi_sync_source_net_waits`

  O número total de vezes que a fonte esperou por respostas replicadas.

  `Rpl_semi_sync_source_net_waits` está disponível quando o plugin `rpl_semi_sync_source` (biblioteca `semisync_source.so`) foi instalado na fonte para configurar a replicação semiesincronizada. Se o plugin `rpl_semi_sync_master` (biblioteca `semisync_master.so`) foi instalado, `Rpl_semi_sync_master_net_waits` está disponível.

- `Rpl_semi_sync_source_no_times`

  Número de vezes que a fonte desativou a replicação semisincronizada.

  `Rpl_semi_sync_source_no_times` está disponível quando o plugin `rpl_semi_sync_source` (biblioteca `semisync_source.so`) foi instalado na fonte para configurar a replicação semiesincronizada. Se o plugin `rpl_semi_sync_master` (biblioteca `semisync_master.so`) foi instalado, `Rpl_semi_sync_master_no_times` está disponível.

- `Rpl_semi_sync_source_no_tx`

  O número de commits que não foram reconhecidos com sucesso por uma réplica.

  `Rpl_semi_sync_source_no_tx` está disponível quando o plugin `rpl_semi_sync_source` (biblioteca `semisync_source.so`) foi instalado na fonte para configurar a replicação semiesincronizada. Se o plugin `rpl_semi_sync_master` (biblioteca `semisync_master.so`) foi instalado, `Rpl_semi_sync_master_no_tx` está disponível.

- `Rpl_semi_sync_source_status`

  Se a replicação semi-sincronizada está atualmente em operação na fonte. O valor é `ON` se o plugin tiver sido habilitado e um reconhecimento de commit ocorrer. É `OFF` se o plugin não estiver habilitado ou se a fonte tiver retornado para replicação assíncrona devido ao tempo limite de reconhecimento de commit.

  `Rpl_semi_sync_source_status` está disponível quando o plugin `rpl_semi_sync_source` (biblioteca `semisync_source.so`) foi instalado na fonte para configurar a replicação semiesincronizada. Se o plugin `rpl_semi_sync_master` (biblioteca `semisync_master.so`) foi instalado, `Rpl_semi_sync_master_status` está disponível.

- `Rpl_semi_sync_source_timefunc_failures`

  O número de vezes que a fonte falhou ao chamar funções de tempo, como `gettimeofday()`.

  `Rpl_semi_sync_source_timefunc_failures` está disponível quando o plugin `rpl_semi_sync_source` (biblioteca `semisync_source.so`) foi instalado na fonte para configurar a replicação semiesincronizada. Se o plugin `rpl_semi_sync_master` (biblioteca `semisync_master.so`) foi instalado, `Rpl_semi_sync_master_timefunc_failures` está disponível.

- `Rpl_semi_sync_source_tx_avg_wait_time`

  O tempo médio em microsegundos que a fonte esperou por cada transação.

  `Rpl_semi_sync_source_tx_avg_wait_time` está disponível quando o plugin `rpl_semi_sync_source` (biblioteca `semisync_source.so`) foi instalado na fonte para configurar a replicação semiesincronizada. Se o plugin `rpl_semi_sync_master` (biblioteca `semisync_master.so`) foi instalado, `Rpl_semi_sync_master_tx_avg_wait_time` está disponível.

- `Rpl_semi_sync_source_tx_wait_time`

  O tempo total em microsegundos que a fonte esperou por transações.

  `Rpl_semi_sync_source_tx_wait_time` está disponível quando o plugin `rpl_semi_sync_source` (biblioteca `semisync_source.so`) foi instalado na fonte para configurar a replicação semiesincronizada. Se o plugin `rpl_semi_sync_master` (biblioteca `semisync_master.so`) foi instalado, `Rpl_semi_sync_master_tx_wait_time` está disponível.

- `Rpl_semi_sync_source_tx_waits`

  O número total de vezes que a fonte esperou por transações.

  `Rpl_semi_sync_source_tx_waits` está disponível quando o plugin `rpl_semi_sync_source` (biblioteca `semisync_source.so`) foi instalado na fonte para configurar a replicação semiesincronizada. Se o plugin `rpl_semi_sync_master` (biblioteca `semisync_master.so`) foi instalado, `Rpl_semi_sync_master_tx_waits` está disponível.

- `Rpl_semi_sync_source_wait_pos_backtraverse`

  O número total de vezes que a fonte esperou por um evento com coordenadas binárias inferiores às esperadas anteriormente. Isso pode ocorrer quando a ordem em que as transações começam a esperar por uma resposta é diferente da ordem em que seus eventos de log binário são escritos.

  `Rpl_semi_sync_source_wait_pos_backtraverse` está disponível quando o plugin `rpl_semi_sync_source` (biblioteca `semisync_source.so`) foi instalado na fonte para configurar a replicação semiesincronizada. Se o plugin `rpl_semi_sync_master` (biblioteca `semisync_master.so`) foi instalado, `Rpl_semi_sync_master_wait_pos_backtraverse` está disponível.

- `Rpl_semi_sync_source_wait_sessions`

  O número de sessões que estão aguardando respostas replicadas atualmente.

  `Rpl_semi_sync_source_wait_sessions` está disponível quando o plugin `rpl_semi_sync_source` (biblioteca `semisync_source.so`) foi instalado na fonte para configurar a replicação semiesincronizada. Se o plugin `rpl_semi_sync_master` (biblioteca `semisync_master.so`) foi instalado, `Rpl_semi_sync_master_wait_sessions` está disponível.

- `Rpl_semi_sync_source_yes_tx`

  O número de commits que foram reconhecidos com sucesso por uma réplica.

  `Rpl_semi_sync_source_yes_tx` está disponível quando o plugin `rpl_semi_sync_source` (biblioteca `semisync_source.so`) foi instalado na fonte para configurar a replicação semiesincronizada. Se o plugin `rpl_semi_sync_master` (biblioteca `semisync_master.so`) foi instalado, `Rpl_semi_sync_master_yes_tx` está disponível.

- `Rpl_semi_sync_replica_status`

  Mostra se a replicação semisoincronizada está atualmente operacional na replica. É `ON` se o plugin tiver sido habilitado e o thread de I/O de replicação (receptor) estiver em execução, `OFF` caso contrário.

  `Rpl_semi_sync_replica_status` está disponível quando o plugin `rpl_semi_sync_replica` (biblioteca `semisync_replica.so`) foi instalado na réplica para configurar a replicação semiesincronizada. Se o plugin `rpl_semi_sync_slave` (biblioteca `semisync_slave.so`) foi instalado, `Rpl_semi_sync_slave_status` está disponível.

- `Rpl_semi_sync_slave_status`

  Mostra se a replicação semisoincronizada está atualmente operacional na replica. É `ON` se o plugin tiver sido habilitado e o thread de I/O de replicação (receptor) estiver em execução, `OFF` caso contrário.

  `Rpl_semi_sync_slave_status` está disponível quando o plugin `rpl_semi_sync_slave` (biblioteca `semisync_slave.so`) foi instalado na réplica para configurar a replicação semiesincronizada. Se o plugin `rpl_semi_sync_replica` (biblioteca `semisync_replica.so`) foi instalado, `Rpl_semi_sync_replica_status` está disponível.

- `Rsa_public_key`

  O valor desta variável é a chave pública usada pelo plugin de autenticação `sha256_password` para a troca de senhas baseada em pares de chaves RSA. O valor só é não-vazio se o servidor inicializar com sucesso as chaves privadas e públicas nos arquivos nomeados pelas variáveis de sistema `sha256_password_private_key_path` e `sha256_password_public_key_path`. O valor de `Rsa_public_key` vem do último arquivo.

  Para obter informações sobre `sha256_password`, consulte a Seção 8.4.1.3, “Autenticação Pluggable SHA-256”.

- `Secondary_engine_execution_count`

  Para uso apenas com o MySQL HeatWave. Consulte Variáveis de Status, para mais informações.

- `Select_full_join`

  O número de junções que realizam varreduras de tabela porque não usam índices. Se esse valor não for 0, você deve verificar cuidadosamente os índices de suas tabelas.

- `Select_full_range_join`

  O número de junções que usaram uma pesquisa de intervalo em uma tabela de referência.

- `Select_range`

  O número de junções que utilizaram intervalos na primeira tabela. Normalmente, isso não é um problema crítico, mesmo que o valor seja bastante grande.

- `Select_range_check`

  O número de junções sem chaves que verificam o uso de chaves após cada linha. Se este número não for 0, você deve verificar cuidadosamente os índices de suas tabelas.

- `Select_scan`

  O número de junções que realizaram uma varredura completa da primeira tabela.

- `Slave_open_temp_tables`

  A partir do MySQL 8.0.26, `Slave_open_temp_tables` é descontinuado e o alias `Replica_open_temp_tables` deve ser usado em vez disso. Em versões anteriores ao MySQL 8.0.26, use `Slave_open_temp_tables`.

  `Slave_open_temp_tables` mostra o número de tabelas temporárias que o thread SQL de replicação atualmente tem aberto. Se o valor for maior que zero, não é seguro desligar a replica; veja a Seção 19.5.1.31, “Replicação e Tabelas Temporárias”. Esta variável relata o total de tabelas temporárias abertas para *todos* os canais de replicação.

- `Slave_rows_last_search_algorithm_used`

  A partir do MySQL 8.0.26, `Slave_rows_last_search_algorithm_used` é descontinuado e o alias `Replica_rows_last_search_algorithm_used` deve ser usado em vez disso. Em versões anteriores ao MySQL 8.0.26, use `Slave_rows_last_search_algorithm_used`.

  `Slave_rows_last_search_algorithm_used` mostra o algoritmo de busca mais recentemente utilizado por essa replica para localizar linhas para a replicação baseada em linhas. O resultado mostra se a replica usou índices, uma varredura de tabela ou hashing como o algoritmo de busca para a última transação executada em qualquer canal.

  O método utilizado depende do valor da variável de sistema `slave_rows_search_algorithms` e das chaves disponíveis na tabela relevante.

  Essa variável está disponível apenas para as compilações de depuração do MySQL.

- `Slow_launch_threads`

  O número de threads que levaram mais de `slow_launch_time` segundos para serem criadas.

- `Slow_queries`

  O número de consultas que levaram mais de `long_query_time` segundos. Esse contador é incrementado independentemente de o registro de consultas lentas estar habilitado. Para obter informações sobre esse registro, consulte a Seção 7.4.5, “O Registro de Consultas Lentas”.

- `Sort_merge_passes`

  O número de passes de fusão que o algoritmo de ordenação teve que realizar. Se esse valor for grande, você deve considerar aumentar o valor da variável de sistema `sort_buffer_size`.

- `Sort_range`

  O número de tipos de classificação que foram feitos usando intervalos.

- `Sort_rows`

  O número de linhas ordenadas.

- `Sort_scan`

  O número de tipos que foram feitos por meio da digitalização da tabela.

- `Ssl_accept_renegotiates`

  O número de negociações necessárias para estabelecer a conexão.

- `Ssl_accepts`

  O número de conexões SSL aceitas.

- `Ssl_callback_cache_hits`

  O número de acertos na cache de chamadas de volta.

- `Ssl_cipher`

  O algoritmo de criptografia atual (vazio para conexões não criptografadas).

- `Ssl_cipher_list`

  A lista de possíveis cifradores SSL (vazia para conexões não SSL). Se o MySQL suportar TLSv1.3, o valor inclui as possíveis suítes de cifradores TLSv1.3. Consulte a Seção 8.3.2, “Protocolos e cifradores de conexão encriptada TLS”.

- `Ssl_client_connects`

  O número de tentativas de conexão SSL para um servidor de origem de replicação habilitado para SSL.

- `Ssl_connect_renegotiates`

  O número de negociações necessárias para estabelecer a conexão com um servidor de origem de replicação habilitado para SSL.

- `Ssl_ctx_verify_depth`

  Profundidade da verificação do contexto SSL (quantos certificados na cadeia são testados).

- `Ssl_ctx_verify_mode`

  O modo de verificação do contexto SSL.

- `Ssl_default_timeout`

  O tempo de espera padrão do SSL.

- `Ssl_finished_accepts`

  O número de conexões SSL bem-sucedidas com o servidor.

- `Ssl_finished_connects`

  Número de conexões de replicação bem-sucedidas a um servidor de origem de replicação habilitado para SSL.

- `Ssl_server_not_after`

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

- `Ssl_server_not_before`

  A primeira data em que o certificado SSL é válido.

- `Ssl_session_cache_hits`

  O número de acertos no cache de sessões SSL.

- `Ssl_session_cache_misses`

  O número de falhas no cache de sessões SSL.

- `Ssl_session_cache_mode`

  O modo de cache de sessão SSL. Quando o valor da variável de servidor `ssl_session_cache_mode` é `ON`, o valor da variável de status `Ssl_session_cache_mode` é `SERVER`.

- `Ssl_session_cache_overflows`

  O número de transbordamentos de cache de sessão SSL.

- `Ssl_session_cache_size`

  O tamanho do cache de sessão SSL.

- `Ssl_session_cache_timeout`

  O valor de tempo de espera em segundos para sessões SSL no cache.

- `Ssl_session_cache_timeouts`

  Número de expirações de cache de sessão SSL.

- `Ssl_sessions_reused`

  Isso é igual a 0 se o TLS não foi usado na sessão atual do MySQL, ou se uma sessão TLS não foi reutilizada; caso contrário, é igual a 1.

  `Ssl_sessions_reused` tem escopo de sessão.

- `Ssl_used_session_cache_entries`

  Quantas entradas de cache de sessão SSL foram usadas.

- `Ssl_verify_depth`

  A profundidade de verificação para conexões SSL de replicação.

- `Ssl_verify_mode`

  O modo de verificação usado pelo servidor para uma conexão que utiliza SSL. O valor é uma máscara de bits; os bits são definidos no arquivo de cabeçalho `openssl/ssl.h`:

  ```
  # define SSL_VERIFY_NONE                 0x00
  # define SSL_VERIFY_PEER                 0x01
  # define SSL_VERIFY_FAIL_IF_NO_PEER_CERT 0x02
  # define SSL_VERIFY_CLIENT_ONCE          0x04
  ```

  `SSL_VERIFY_PEER` indica que o servidor solicita um certificado do cliente. Se o cliente fornecer um, o servidor realiza a verificação e prossegue apenas se a verificação for bem-sucedida. `SSL_VERIFY_CLIENT_ONCE` indica que um pedido para o certificado do cliente é realizado apenas no aperto inicial.

- `Ssl_version`

  A versão do protocolo SSL da conexão (por exemplo, TLSv1). Se a conexão não estiver criptografada, o valor será vazio.

- `Table_locks_immediate`

  O número de vezes que um pedido de bloqueio de tabela pode ser concedido imediatamente.

- `Table_locks_waited`

  O número de vezes em que um pedido de bloqueio de tabela não pôde ser concedido imediatamente e foi necessário aguardar. Se esse número for alto e você estiver enfrentando problemas de desempenho, você deve primeiro otimizar suas consultas e, em seguida, dividir sua tabela ou tabelas ou usar a replicação.

- `Table_open_cache_hits`

  Número de acessos para consultas de cache de tabelas abertas.

- `Table_open_cache_misses`

  Número de falhas para consultas de cache de tabelas abertas.

- `Table_open_cache_overflows`

  Número de transbordamentos para o cache de tabelas abertas. Este é o número de vezes, após uma tabela ser aberta ou fechada, em que uma instância de cache tem uma entrada não utilizada e o tamanho da instância é maior que `table_open_cache` / `table_open_cache_instances`.

- `Tc_log_max_pages_used`

  Para a implementação mapeada à memória do log que é usada pelo **mysqld** quando atua como coordenador de transações para a recuperação de transações internas XA, essa variável indica o maior número de páginas usadas para o log desde que o servidor foi iniciado. Se o produto de `Tc_log_max_pages_used` e `Tc_log_page_size` for sempre significativamente menor que o tamanho do log, o tamanho é maior do que o necessário e pode ser reduzido. (O tamanho é definido pela opção `--log-tc-size`. Essa variável não é usada: não é necessária para a recuperação baseada em log binário, e o método de log de recuperação mapeada à memória não é usado a menos que o número de motores de armazenamento que são capazes de dois estágios de compromisso e que suportam transações XA seja maior que um. `InnoDB` é o único motor aplicável.)

- `Tc_log_page_size`

  O tamanho da página usado para a implementação mapeada à memória do log de recuperação XA. O valor padrão é determinado usando `getpagesize()`. Esta variável é inutilizada pelas mesmas razões descritas para `Tc_log_max_pages_used`.

- `Tc_log_page_waits`

  Para a implementação mapeada à memória do log de recuperação, essa variável é incrementada sempre que o servidor não conseguiu confirmar uma transação e teve que esperar por uma página livre no log. Se esse valor for grande, você pode querer aumentar o tamanho do log (com a opção `--log-tc-size`). Para a recuperação com base em log binário, essa variável é incrementada sempre que o log binário não pode ser fechado porque há confirmações de duas fases em andamento. (A operação de fechamento aguarda até que todas essas transações sejam concluídas.)

- `Telemetry_traces_supported`

  Se as traças de telemetria do servidor são suportadas.

  Para obter mais informações, consulte a seção *Serviço de rastreamento de telemetria do servidor* na documentação do código-fonte do MySQL.

- `Threads_cached`

  O número de threads na cache de threads.

- `Threads_connected`

  O número de conexões abertas atualmente.

- `Threads_created`

  O número de threads criados para lidar com as conexões. Se `Threads_created` for grande, você pode querer aumentar o valor de `thread_cache_size`. A taxa de falha de cache pode ser calculada como `Threads_created`/`Connections`.

- `Threads_running`

  O número de threads que não estão dormindo.

- `Tls_library_version`

  A versão em execução da biblioteca OpenSSL que está sendo usada para esta instância do MySQL.

  Essa variável foi adicionada no MySQL 8.0.30.

- `Uptime`

  O número de segundos que o servidor está ativo.

- `Uptime_since_flush_status`

  O número de segundos desde a última declaração `FLUSH STATUS`.
