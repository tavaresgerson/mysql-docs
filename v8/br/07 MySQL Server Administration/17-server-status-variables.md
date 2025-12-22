### 7.1.10 Variaveis de estado do servidor

O servidor MySQL mantém muitas variáveis de status que fornecem informações sobre sua operação. Você pode visualizar essas variáveis e seus valores usando a instrução `SHOW [GLOBAL | SESSION] STATUS` (veja Seção 15.7.7.37, SHOW STATUS Statement). A palavra-chave `GLOBAL` opcional agrega os valores em todas as conexões, e `SESSION` mostra os valores para a conexão atual.

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

Esta secção fornece uma descrição de cada variável de status. Para um resumo da variável de status, consulte a Seção 7.1.6, Referência à Variavel de Status do Servidor. Para informações sobre variáveis de status específicas do Cluster NDB, consulte a Seção 25.4.3.9.3, Variaveis de Status do Cluster NDB.

As variáveis de estado têm os seguintes significados.

- `Aborted_clients`

O número de conexões que foram interrompidas porque o cliente morreu sem fechar a conexão corretamente.

- `Aborted_connects`

O número de tentativas falhadas de conexão com o servidor MySQL. Ver secção B.3.2.9, "Erros de comunicação e conexões interrompidas".

Para informações adicionais relacionadas à conexão, verifique as variáveis de status `Connection_errors_xxx` e a tabela `host_cache`.

- `Authentication_ldap_sasl_supported_methods`

O plug-in `authentication_ldap_sasl` que implementa a autenticação SASL LDAP suporta vários métodos de autenticação, mas dependendo da configuração do sistema host, eles podem não estar todos disponíveis. A variável `Authentication_ldap_sasl_supported_methods` fornece detectabilidade para os métodos suportados. Seu valor é uma string consistindo de nomes de métodos suportados separados por espaços. Exemplo: `"SCRAM-SHA 1 SCRAM-SHA-256 GSSAPI"`

- `Binlog_cache_disk_use`

O número de transações que usaram o cache temporário do log binário, mas que excederam o valor de \[`binlog_cache_size`]] e usaram um arquivo temporário para armazenar extratos da transação.

O número de instruções não transacionais que causaram o cache de transações do log binário a ser escrito no disco é rastreado separadamente na variável de status `Binlog_stmt_cache_disk_use`.

- `Acl_cache_items_count`

O número de objetos de privilégios armazenados em cache. Cada objeto é a combinação de privilégios de um usuário e suas funções ativas.

- `Binlog_cache_use`

O número de transações que utilizaram o cache de registo binário.

- `Binlog_stmt_cache_disk_use`

O número de instruções não transacionais que usaram o cache de instruções de log binário, mas que excederam o valor de `binlog_stmt_cache_size` e usaram um arquivo temporário para armazenar essas instruções.

- `Binlog_stmt_cache_use`

O número de instruções não transacionais que utilizaram o cache de instruções de registo binário.

- `Bytes_received`

O número de bytes recebidos de todos os clientes.

- `Bytes_sent`

O número de bytes enviados a todos os clientes.

- `Caching_sha2_password_rsa_public_key`

A chave pública usada pelo plug-in de autenticação `caching_sha2_password` para troca de senhas baseada em pares de chaves RSA. O valor não é vazio somente se o servidor inicializar com sucesso as chaves privada e pública nos arquivos nomeados pelas variáveis de sistema `caching_sha2_password_private_key_path` e `caching_sha2_password_public_key_path`. O valor de `Caching_sha2_password_rsa_public_key` vem do último arquivo.

- `Com_xxx`

  As variáveis de contagem de instruções \[`Com_xxx`] indicam o número de vezes que cada instrução \[`xxx`] foi executada. Há uma variável de status para cada tipo de instrução. Por exemplo, \[`Com_delete`] e \[`Com_update`] contam as instruções \[`DELETE`] e \[`UPDATE`] respectivamente. \[`Com_delete_multi`] e \[`Com_update_multi`] são semelhantes, mas se aplicam às instruções \[`DELETE`] e \[`UPDATE`] que usam sintaxe de várias tabelas.

  Todas as variáveis `Com_stmt_xxx` são aumentadas mesmo se um argumento de instrução preparado for desconhecido ou ocorrer um erro durante a execução. Em outras palavras, seus valores correspondem ao número de solicitações emitidas, não ao número de solicitações concluídas com sucesso. Por exemplo, como as variáveis de status são inicializadas para cada inicialização do servidor e não persistem em reinicializações, as variáveis `Com_restart` e `Com_shutdown` que rastreiam as instruções `RESTART` e `SHUTDOWN` normalmente têm um valor de zero, mas podem ser diferentes de zero se as instruções `RESTART` ou `SHUTDOWN` foram executadas, mas falharam.

  As variáveis de status `Com_stmt_xxx` são as seguintes:

  - `Com_stmt_prepare`
  - `Com_stmt_execute`
  - `Com_stmt_fetch`
  - `Com_stmt_send_long_data`
  - `Com_stmt_reset`
  - `Com_stmt_close`

  Essas variáveis representam comandos de instrução preparados. Seus nomes referem-se ao conjunto de comandos `COM_xxx` usado na camada de rede. Em outras palavras, seus valores aumentam sempre que chamadas de instrução API preparadas como \*\*mysql\_stmt\_prepare() \*\*, \*\*mysql\_stmt\_execute() \*\*, e assim por diante são executadas. No entanto, `Com_stmt_prepare`, `Com_stmt_execute` e `Com_stmt_close` também aumentam para `PREPARE`, `EXECUTE`, ou `DEALLOCATE PREPARE`, respectivamente. Além disso, os valores das variáveis de instrução mais antigas `Com_prepare_sql`, `Com_execute_sql`, e \[\[CO`Com_dealloc_sql`]] aumentam para as `PREPARE`, \[\[CO`EXECUTE`]] e \[\[CO`DEALLOCATE PREPARE`]] instruções.

  \[`Com_stmt_reprepare`] indica o número de vezes que as instruções foram automaticamente representadas pelo servidor, por exemplo, após alterações de metadados em tabelas ou vistas referidas pela instrução.

  `Com_explain_other` indica o número de instruções `EXPLAIN FOR CONNECTION` executadas. Ver Seção 10.8.4, Obtenção de Informações de Plano de Execução para uma Conexão Nomeada.

  `Com_change_repl_filter` indica o número de instruções `CHANGE REPLICATION FILTER` executadas.
- `Compression`

Se a conexão cliente utiliza a compressão no protocolo cliente/servidor.

Esta variável de status está desatualizada; espera-se que seja removida em uma versão futura do MySQL. Veja Configurar a Compressão de Conexão Legada.

- `Compression_algorithm`

O nome do algoritmo de compressão em uso para a conexão atual com o servidor. O valor pode ser qualquer algoritmo permitido no valor da variável do sistema `protocol_compression_algorithms`. Por exemplo, o valor é `uncompressed` se a conexão não usar compressão, ou `zlib` se a conexão usar o algoritmo `zlib`.

Para mais informações, ver ponto 6.2.8, "Controlo da compressão da ligação".

- `Compression_level`

O nível de compressão em uso para a conexão atual com o servidor. O valor é 6 para conexões `zlib` (o nível de compressão padrão do algoritmo `zlib`), 1 a 22 para conexões `zstd` e 0 para conexões `uncompressed`.

Para mais informações, ver ponto 6.2.8, "Controlo da compressão da ligação".

- `Connection_errors_xxx`

Essas variáveis fornecem informações sobre erros que ocorrem durante o processo de conexão do cliente. Eles são apenas globais e representam contagens de erros agregados em conexões de todos os hosts. Essas variáveis rastreiam erros não contabilizados pelo cache do host (ver Seção 7.1.12.3, "DNS Lookups e o Host Cache"), como erros que não estão associados a conexões TCP, ocorrem muito cedo no processo de conexão (mesmo antes de um endereço IP ser conhecido) ou não são específicos para qualquer endereço IP específico (como condições de falta de memória).

- `Connection_errors_accept`

```
The number of errors that occurred during calls to `accept()` on the listening port.
```

- `Connection_errors_internal`

```
The number of connections refused due to internal errors in the server, such as failure to start a new thread or an out-of-memory condition.
```

- `Connection_errors_max_connections`

```
The number of connections refused because the server `max_connections` limit was reached.
```

- `Connection_errors_peer_address`

```
The number of errors that occurred while searching for connecting client IP addresses.
```

- `Connection_errors_select`

```
The number of errors that occurred during calls to `select()` or `poll()` on the listening port. (Failure of this operation does not necessarily means a client connection was rejected.)
```

- `Connection_errors_tcpwrap`

```
The number of connections refused by the `libwrap` library.
```

- `Connections`

O número de tentativas de conexão (sucedidas ou não) com o servidor MySQL.

- `Created_tmp_disk_tables`

Número de tabelas temporárias internas no disco criadas pelo servidor durante a execução de instruções.

Você pode comparar o número de tabelas temporárias internas no disco criadas com o número total de tabelas temporárias internas criadas comparando os valores `Created_tmp_disk_tables` e `Created_tmp_tables`.

::: info Note

Devido a uma limitação conhecida, o `Created_tmp_disk_tables` não conta com tabelas temporárias no disco criadas em arquivos mapeados na memória. Por padrão, o mecanismo de transbordamento do motor de armazenamento TempTable cria tabelas temporárias internas em arquivos mapeados na memória. Este comportamento é controlado pela variável `temptable_use_mmap`.

:::

Ver também a secção 10.4.4, "Utilização de tabelas temporárias internas no MySQL".

- `Created_tmp_files`

Quantos arquivos temporários a mysqld criou.

- `Created_tmp_tables`

Número de tabelas temporárias internas criadas pelo servidor durante a execução de instruções.

Você pode comparar o número de tabelas temporárias internas no disco criadas com o número total de tabelas temporárias internas criadas comparando os valores `Created_tmp_disk_tables` e `Created_tmp_tables`.

Ver também a secção 10.4.4, "Utilização de tabelas temporárias internas no MySQL".

Cada invocação da instrução `SHOW STATUS` usa uma tabela temporária interna e aumenta o valor global `Created_tmp_tables`.

- `Current_tls_ca`

O valor ativo `ssl_ca` no contexto SSL que o servidor usa para novas conexões. Este valor de contexto pode diferir do valor atual da variável do sistema `ssl_ca` se a variável do sistema foi alterada, mas `ALTER INSTANCE RELOAD TLS` não foi posteriormente executada para reconfigurar o contexto SSL a partir dos valores das variáveis do sistema relacionadas ao contexto e atualizar as variáveis de status correspondentes. (Esta diferença potencial de valores se aplica a cada par correspondente de variáveis de sistema e status relacionadas ao contexto. Veja Configuração e monitoramento de tempo de execução do lado do servidor para conexões criptografadas.)

Os valores das variáveis de status `Current_tls_xxx` também estão disponíveis através da tabela do Esquema de Desempenho `tls_channel_status`.

- `Current_tls_capath`

O valor ativo `ssl_capath` no contexto TLS que o servidor usa para novas conexões. Para notas sobre a relação entre esta variável de status e sua variável de sistema correspondente, consulte a descrição de `Current_tls_ca`.

- `Current_tls_cert`

O valor ativo `ssl_cert` no contexto TLS que o servidor usa para novas conexões. Para notas sobre a relação entre esta variável de status e sua variável de sistema correspondente, consulte a descrição de `Current_tls_ca`.

- `Current_tls_cipher`

O valor ativo `ssl_cipher` no contexto TLS que o servidor usa para novas conexões. Para notas sobre a relação entre esta variável de status e sua variável de sistema correspondente, consulte a descrição de `Current_tls_ca`.

- `Current_tls_ciphersuites`

O valor ativo `tls_ciphersuites` no contexto TLS que o servidor usa para novas conexões. Para notas sobre a relação entre esta variável de status e sua variável de sistema correspondente, consulte a descrição de `Current_tls_ca`.

- `Current_tls_crl`

O valor ativo `ssl_crl` no contexto TLS que o servidor usa para novas conexões. Para notas sobre a relação entre esta variável de status e sua variável de sistema correspondente, consulte a descrição de `Current_tls_ca`.

::: info Note

Quando você recarrega o contexto TLS, o OpenSSL recarrega o arquivo contendo o CRL (lista de revogação de certificado) como parte do processo. Se o arquivo CRL for grande, o servidor aloca um grande pedaço de memória (dez vezes o tamanho do arquivo), que é duplicado enquanto a nova instância está sendo carregada e a antiga ainda não foi liberada. A memória residente do processo não é imediatamente reduzida após uma grande alocação ser liberada, então se você emitir a instrução `ALTER INSTANCE RELOAD TLS` repetidamente com um arquivo CRL grande, o uso da memória residente do processo pode aumentar como resultado disso.

:::

- `Current_tls_crlpath`

O valor ativo `ssl_crlpath` no contexto TLS que o servidor usa para novas conexões. Para notas sobre a relação entre esta variável de status e sua variável de sistema correspondente, consulte a descrição de `Current_tls_ca`.

- `Current_tls_key`

O valor ativo `ssl_key` no contexto TLS que o servidor usa para novas conexões. Para notas sobre a relação entre esta variável de status e sua variável de sistema correspondente, consulte a descrição de `Current_tls_ca`.

- `Current_tls_version`

O valor ativo `tls_version` no contexto TLS que o servidor usa para novas conexões. Para notas sobre a relação entre esta variável de status e sua variável de sistema correspondente, consulte a descrição de `Current_tls_ca`.

- `Delayed_errors`

Esta variável de status está obsoleta (porque as inserções de `DELAYED` não são suportadas); espere que ela seja removida em uma versão futura.

- `Delayed_insert_threads`

Esta variável de status está obsoleta (porque as inserções de `DELAYED` não são suportadas); espere que ela seja removida em uma versão futura.

- `Delayed_writes`

Esta variável de status está obsoleta (porque as inserções de `DELAYED` não são suportadas); espere que ela seja removida em uma versão futura.

- `Deprecated_use_i_s_processlist_count`

Quantas vezes a tabela `information_schema.processlist` foi acessada desde a última reinicialização.

- `Deprecated_use_i_s_processlist_last_timestamp`

Um carimbo de tempo indicando a última vez que a tabela `information_schema.processlist` foi acessada desde a última reinicialização. Mostra microssegundos desde o Unix Epoch.

- `dragnet.Status`

O resultado da atribuição mais recente à variável do sistema `dragnet.log_error_filter_rules`, vazio se tal atribuição não tiver ocorrido.

- `Error_log_buffered_bytes`

É possível que o valor diminua, por exemplo, se um novo evento não puder caber até descartar um evento antigo, mas o novo evento for menor do que o antigo.

- `Error_log_buffered_events`

O número de eventos atualmente presentes na tabela do Esquema de Desempenho `error_log`. Tal como com `Error_log_buffered_bytes`, é possível que o valor diminua.

- `Error_log_expired_events`

O número de eventos descartados da tabela do Esquema de Desempenho `error_log` para abrir espaço para novos eventos.

- `Error_log_latest_write`

A hora da última gravação na tabela de Performance Schema `error_log`.

- `Flush_commands`

O número de vezes que o servidor limpa as tabelas, seja porque um usuário executou uma instrução `FLUSH TABLES` ou devido a uma operação interna do servidor. Ele também é incrementado pelo recebimento de um pacote `COM_REFRESH`. Isso é em contraste com `Com_flush`, que indica quantas instruções `FLUSH` foram executadas, se `FLUSH TABLES`, `FLUSH LOGS` e assim por diante.

- `Global_connection_memory`

A memória usada por todas as conexões de usuários ao servidor. A memória usada por threads do sistema ou pela conta raiz do MySQL está incluída no total, mas tais threads ou usuários não estão sujeitos a desconexão devido ao uso de memória. Esta memória não é calculada a menos que o `global_connection_memory_tracking` esteja ativado (desativado por padrão). O Esquema de Desempenho também deve estar ativado.

Você pode controlar (indiretamente) a frequência com que esta variável é atualizada definindo `connection_memory_chunk_size`.

- `Handler_commit`

O número de instruções internas `COMMIT`.

- `Handler_delete`

O número de vezes que as linhas foram excluídas das tabelas.

- `Handler_external_lock`

O servidor aumenta essa variável para cada chamada para sua função `external_lock()`, que geralmente ocorre no início e no final do acesso a uma instância de tabela. Pode haver diferenças entre os mecanismos de armazenamento. Esta variável pode ser usada, por exemplo, para descobrir para uma instrução que acessa uma tabela particionada quantas partições foram podadas antes do bloqueio ocorrer: Verifique quanto o contador aumentou para a instrução, subtraia 2 (2 chamadas para a própria tabela), em seguida, divida por 2 para obter o número de partições bloqueadas.

- `Handler_mrr_init`

O número de vezes que o servidor utiliza a implementação Multi-Range Read de um motor de armazenamento para o acesso à tabela.

- `Handler_prepare`

Um contador para a fase de preparação de operações de autorização em duas fases.

- `Handler_read_first`

O número de vezes que a primeira entrada em um índice foi lida. Se este valor for alto, sugere que o servidor está fazendo muitas varreduras de índice completas (por exemplo, `SELECT col1 FROM foo`, assumindo que `col1` está indexado).

- `Handler_read_key`

O número de pedidos para ler uma linha com base numa chave. Se este valor for elevado, é um bom indicador de que as suas tabelas estão correctamente indexadas para as suas consultas.

- `Handler_read_last`

O número de solicitações para ler a última chave em um índice. Com `ORDER BY`, o servidor emite uma solicitação de primeira chave seguida por várias solicitações de próxima chave, enquanto que com `ORDER BY DESC`, o servidor emite uma solicitação de última chave seguida por várias solicitações de chave anterior.

- `Handler_read_next`

O número de pedidos para ler a próxima linha na ordem da chave. Este valor é incrementado se estiver a consultar uma coluna de índice com uma restrição de intervalo ou se estiver a fazer uma varredura de índice.

- `Handler_read_prev`

O número de pedidos para ler a linha anterior na ordem da chave. Este método de leitura é usado principalmente para otimizar o `ORDER BY ... DESC`.

- `Handler_read_rnd`

O número de solicitações para ler uma linha com base em uma posição fixa. Este valor é alto se você estiver fazendo muitas consultas que requerem classificação do resultado. Você provavelmente tem muitas consultas que requerem o MySQL para digitalizar tabelas inteiras ou você tem junções que não usam chaves corretamente.

- `Handler_read_rnd_next`

O número de solicitações para ler a próxima linha no arquivo de dados. Este valor é alto se você estiver fazendo muitas varreduras de tabelas. Geralmente, isso sugere que suas tabelas não estão devidamente indexadas ou que suas consultas não são escritas para tirar proveito dos índices que você tem.

- `Handler_rollback`

O número de pedidos para que um motor de armazenamento execute uma operação de reversão.

- `Handler_savepoint`

O número de solicitações de um motor de armazenamento para colocar um ponto de salvamento.

- `Handler_savepoint_rollback`

O número de solicitações para que um motor de armazenamento volte a um ponto de salvamento.

- `Handler_update`

Número de pedidos de atualização de uma linha de uma tabela.

- `Handler_write`

Número de pedidos de inserção de uma linha numa tabela.

- `Innodb_buffer_pool_dump_status`

O progresso de uma operação para registrar as páginas mantidas no pool de buffer `InnoDB`, acionado pela configuração de `innodb_buffer_pool_dump_at_shutdown` ou `innodb_buffer_pool_dump_now`.

Para obter informações e exemplos relacionados, ver a secção 17.8.3.6, "Salvar e restabelecer o estado do pool de amortização".

- `Innodb_buffer_pool_load_status`

O progresso de uma operação para aquecer o pool de buffer `InnoDB` através da leitura de um conjunto de páginas correspondentes a um ponto anterior no tempo, acionado pela configuração de `innodb_buffer_pool_load_at_startup` ou `innodb_buffer_pool_load_now`. Se a operação introduz muito overhead, você pode cancelá-la definindo `innodb_buffer_pool_load_abort`.

Para obter informações e exemplos relacionados, ver a secção 17.8.3.6, "Salvar e restabelecer o estado do pool de amortização".

- `Innodb_buffer_pool_bytes_data`

O número total de bytes no pool de buffer que contém dados. O número inclui páginas sujas e limpas. Para cálculos de uso de memória mais precisos do que com o `Innodb_buffer_pool_pages_data`, quando tabelas compactadas fazem com que o pool de buffer contenha páginas de tamanhos diferentes.

- `Innodb_buffer_pool_pages_data`

O número de páginas no pool de buffer que contém dados. O número inclui páginas sujas e limpas. Ao usar tabelas compactadas, o valor reportado de `Innodb_buffer_pool_pages_data` pode ser maior do que `Innodb_buffer_pool_pages_total` (Bug #59550).

- `Innodb_buffer_pool_bytes_dirty`

O número total atual de bytes mantidos em páginas sujas no pool de buffer `InnoDB`. Para cálculos de uso de memória mais precisos do que com `Innodb_buffer_pool_pages_dirty`, quando tabelas compactadas fazem com que o pool de buffer contenha páginas de tamanhos diferentes.

- `Innodb_buffer_pool_pages_dirty`

O número atual de páginas sujas no pool de buffer `InnoDB`.

- `Innodb_buffer_pool_pages_flushed`

O número de solicitações para limpar páginas do pool de buffer `InnoDB`.

- `Innodb_buffer_pool_pages_free`

O número de páginas livres no pool de memória `InnoDB`.

- `Innodb_buffer_pool_pages_latched`

O número de páginas trancadas no pool de buffer `InnoDB`. Estas são páginas que estão sendo lidas ou escritas atualmente, ou que não podem ser limpas ou removidas por algum outro motivo. O cálculo desta variável é caro, por isso está disponível apenas quando o sistema `UNIV_DEBUG` é definido no tempo de construção do servidor.

- `Innodb_buffer_pool_pages_misc`

O número de páginas no pool de buffer do `InnoDB` que estão ocupadas porque foram alocadas para despesas administrativas, como bloqueios de linha ou o índice de hash adaptativo. Este valor também pode ser calculado como `Innodb_buffer_pool_pages_total` - `Innodb_buffer_pool_pages_free` - `Innodb_buffer_pool_pages_data`. Ao usar tabelas compactadas, o `Innodb_buffer_pool_pages_misc` pode relatar um valor fora dos limites (Bug #59550).

- `Innodb_buffer_pool_pages_total`

O tamanho total do pool de buffer, em páginas. Ao usar tabelas compactadas, o valor reportado pode ser maior do que o valor do buffer (Bug #59550)

- `Innodb_buffer_pool_read_ahead`

O número de páginas lidas no pool de buffer `InnoDB` pelo thread de fundo de leitura antecipada.

- `Innodb_buffer_pool_read_ahead_evicted`

O número de páginas lidas no pool de buffer `InnoDB` pelo thread de fundo de leitura antecipada que foram posteriormente despejadas sem terem sido acessadas por consultas.

- `Innodb_buffer_pool_read_ahead_rnd`

O número de cabeçalhos de leitura random iniciados por `InnoDB`. Isso acontece quando uma consulta digitaliza uma grande parte de uma tabela, mas em ordem aleatória.

- `Innodb_buffer_pool_read_requests`

Número de solicitações de leitura lógicas.

- `Innodb_buffer_pool_reads`

O número de leituras lógicas que `InnoDB` não pôde satisfazer a partir do pool de buffer, e teve que ler diretamente do disco.

- `Innodb_buffer_pool_resize_status`

O status de uma operação para redimensionar o pool de buffer `InnoDB` dinamicamente, acionado pela definição do parâmetro `innodb_buffer_pool_size` dinamicamente. O parâmetro `innodb_buffer_pool_size` é dinâmico, o que permite redimensionar o pool de buffer sem reiniciar o servidor. Consulte Configurar o tamanho do pool de buffer InnoDB Online para informações relacionadas.

- `Innodb_buffer_pool_resize_status_code`

Reporta códigos de status para rastrear operações de redimensionamento de pool de buffer online. Cada código de status representa uma etapa em uma operação de redimensionamento.

- 0: Nenhuma operação de redimensionamento em andamento
- 1: Começar a redimensionar
- 2: Desativar AHI (Índice de Hash Adaptativo)
- 3: Blocos de retirada
- 4: Adquirir o Global Lock
- 5: Redimensionamento da piscina
- 6: Redimensionamento de Hash
- 7: Falhou o redimensionamento

Você pode usar essa variável de status em conjunto com o `Innodb_buffer_pool_resize_status_progress` para rastrear o progresso de cada estágio de uma operação de redimensionamento. A variável `Innodb_buffer_pool_resize_status_progress` informa um valor percentual indicando o progresso do estágio atual.

Para mais informações, consulte Monitoring Online Buffer Pool Resize Progress.

- `Innodb_buffer_pool_resize_status_progress`

Relata um valor percentual indicando o progresso da fase atual de uma operação de redimensionamento de pool de buffer online. Esta variável é usada em conjunto com `Innodb_buffer_pool_resize_status_code`, que relata um código de status indicando a fase atual de uma operação de redimensionamento de pool de buffer online.

O valor percentual é atualizado após cada instância do pool de buffer ser processada. Como o código de status (relatado por `Innodb_buffer_pool_resize_status_code`) muda de um estado para outro, o valor percentual é redefinido para 0.

Para obter informações relacionadas, consulte Monitoring Online Buffer Pool Resize Progress.

- `Innodb_buffer_pool_wait_free`

Normalmente, escreve para o pool de buffer `InnoDB` em segundo plano. Quando `InnoDB` precisa ler ou criar uma página e não há páginas limpas disponíveis, `InnoDB` limpa algumas páginas sujas primeiro e aguarda que a operação termine. Este contador conta instâncias dessas esperas. Se `innodb_buffer_pool_size` foi definido corretamente, este valor deve ser pequeno.

- `Innodb_buffer_pool_write_requests`

O número de gravações feitas no pool de buffer `InnoDB`.

- `Innodb_data_fsyncs`

O número de operações de `fsync()` até agora. A frequência das chamadas de `fsync()` é influenciada pela configuração da opção de configuração de `innodb_flush_method`.

Conta o número de `fdatasync()` operações se `innodb_use_fdatasync` está habilitado.

- `Innodb_data_pending_fsyncs`

O número atual de operações pendentes de `fsync()`. A frequência das chamadas de `fsync()` é influenciada pela configuração da opção de configuração de `innodb_flush_method`.

- `Innodb_data_pending_reads`

O número actual de pendentes é:

- `Innodb_data_pending_writes`

O número actual de escritos pendentes.

- `Innodb_data_read`

A quantidade de dados lidos desde que o servidor foi iniciado (em bytes).

- `Innodb_data_reads`

O número total de leituras de dados (leituras de ficheiros do sistema operativo).

- `Innodb_data_writes`

O número total de dados que escreve.

- `Innodb_data_written`

A quantidade de dados escritos até agora, em bytes.

- `Innodb_dblwr_pages_written`

O número de páginas que foram escritas no buffer de dupla gravação (ver Secção 17.11.1, "InnoDB Disk I/O").

- `Innodb_dblwr_writes`

O número de operações de dupla gravação executadas; ver secção 17.11.1, "InnoDB Disk I/O".

- `Innodb_have_atomic_builtins`

Indica se o servidor foi construído com instruções atômicas.

- `Innodb_log_waits`

O número de vezes em que o buffer de registos era demasiado pequeno e era necessária uma espera para que fosse lavado antes de continuar.

- `Innodb_log_write_requests`

O número de solicitações de gravação para o log de refazer do `InnoDB`.

- `Innodb_log_writes`

O número de gravações físicas no arquivo de registro de repetição `InnoDB`.

- `Innodb_num_open_files`

O número de arquivos `InnoDB` atualmente está aberto.

- `Innodb_os_log_fsyncs`

O número de `fsync()` gravações feitas para os `InnoDB` arquivos de log de refazer.

- `Innodb_os_log_pending_fsyncs`

O número de operações pendentes de `fsync()` para os arquivos de registo de repetição de `InnoDB`.

- `Innodb_os_log_pending_writes`

O número de gravações pendentes nos arquivos de registro de repetição.

- `Innodb_os_log_written`

O número de bytes escritos nos arquivos de registo de repetição `InnoDB`.

- `Innodb_page_size`

`InnoDB` tamanho da página (padrão 16KB). Muitos valores são contados em páginas; o tamanho da página permite que eles sejam facilmente convertidos em bytes.

- `Innodb_pages_created`

O número de páginas criadas por operações em tabelas `InnoDB`.

- `Innodb_pages_read`

O número de páginas lidas do pool de buffer `InnoDB` por operações em tabelas `InnoDB`.

- `Innodb_pages_written`

O número de páginas escritas por operações em tabelas `InnoDB`.

- `Innodb_redo_log_enabled`

Se o registo de repetição está ativado ou desativado. Ver Desativar registo de repetição.

- `Innodb_redo_log_capacity_resized`

A capacidade total de registo de refazimentos para todos os ficheiros de registo de refazimentos, em bytes, após a última operação de redimensionamento de capacidade concluída. O valor inclui ficheiros de registo de refazimentos comuns e de reserva.

Se não houver nenhuma operação pendente de diminuição do tamanho, `Innodb_redo_log_capacity_resized` deve ser igual à configuração `innodb_redo_log_capacity` se for usada, ou é (\*(innodb\_log\_files\_in\_group \* innodb\_log\_file\_size) \*) se forem usados em vez disso. Veja a documentação `innodb_redo_log_capacity` para mais esclarecimentos. As operações de redimensionamento são instantâneas.

Para informações relacionadas, ver Secção 17.6.5, "Log de Redo".

- `Innodb_redo_log_checkpoint_lsn`

Ponto de verificação do registo de repetição LSN. Para informações relacionadas, ver secção 17.6.5, "Registo de repetição".

- `Innodb_redo_log_current_lsn`

O LSN atual representa a última posição escrita no buffer de registro de redatamento. `InnoDB` escreve dados para o buffer de registro de redatamento dentro do processo MySQL antes de solicitar que o sistema operacional escreva os dados para o arquivo de registro de redatamento atual.

- `Innodb_redo_log_flushed_to_disk_lsn`

O LSN de lavagem ao disco. `InnoDB` primeiro escreve dados para o registro de refação e, em seguida, solicita que o sistema operacional lave os dados para o disco. O LSN de lavagem ao disco representa a última posição no registro de refação que `InnoDB` sabe ter sido lavada para o disco. Para informações relacionadas, consulte a Seção 17.6.5, Redo Log.

- `Innodb_redo_log_logical_size`

Um valor de tamanho de dados, em bytes, que representa o intervalo LSN contendo dados de registo de refacção em uso, abrangendo desde o bloco mais antigo exigido pelos consumidores de registo de refacção até ao bloco mais recente escrito.

- `Innodb_redo_log_physical_size`

A quantidade de espaço em disco em bytes atualmente consumida por todos os arquivos de registo de redatamento no disco, excluindo os arquivos de registo de redatamento de reserva.

- `Innodb_redo_log_read_only`

Se o registo de repetição é apenas de leitura.

- `Innodb_redo_log_resize_status`

O estado de redimensionamento do log de refação indicando o estado atual do mecanismo de redimensionamento da capacidade do log de refação.

- `OK`: Não há problemas e não há operações pendentes de redimensionamento de capacidade de registro de refazer.
- `Resizing down`: Uma operação de diminuição de tamanho está em andamento.

Uma operação de redimensionamento é instantânea e, portanto, não tem status pendente.

- `Innodb_redo_log_uuid`

O UUID do registo de repetição.

- `Innodb_row_lock_current_waits`

O número de bloqueios de linha atualmente aguardados por operações nas tabelas `InnoDB`.

- `Innodb_row_lock_time`

O tempo total gasto na aquisição de bloqueios de linha para tabelas `InnoDB`, em milissegundos.

- `Innodb_row_lock_time_avg`

O tempo médio para adquirir um bloqueio de linha para tabelas `InnoDB`, em milissegundos.

- `Innodb_row_lock_time_max`

O tempo máximo para adquirir um bloqueio de linha para tabelas `InnoDB`, em milissegundos.

- `Innodb_row_lock_waits`

O número de vezes que as operações nas tabelas `InnoDB` tiveram que esperar por um bloqueio de linha.

- `Innodb_rows_deleted`

O número de linhas excluídas das tabelas `InnoDB`.

- `Innodb_rows_inserted`

O número de linhas inseridas nas tabelas `InnoDB`.

- `Innodb_rows_read`

O número de linhas lidas a partir das tabelas `InnoDB`.

- `Innodb_rows_updated`

O número estimado de linhas atualizadas nas tabelas `InnoDB`.

::: info Note

Este valor não deve ser 100% preciso. Para um resultado preciso (mas mais caro), use `ROW_COUNT()`.

:::

- `Innodb_system_rows_deleted`

O número de linhas excluídas das tabelas `InnoDB` pertencentes a esquemas criados pelo sistema.

- `Innodb_system_rows_inserted`

O número de linhas inseridas nas tabelas `InnoDB` pertencentes a esquemas criados pelo sistema.

- `Innodb_system_rows_updated`

O número de linhas atualizadas nas tabelas `InnoDB` pertencentes a esquemas criados pelo sistema.

- `Innodb_system_rows_read`

O número de linhas lidas das tabelas `InnoDB` pertencentes a esquemas criados pelo sistema.

- `Innodb_truncated_status_writes`

O número de vezes de saída da instrução `SHOW ENGINE INNODB STATUS` foi truncado.

- `Innodb_undo_tablespaces_active`

O número de tablespaces de anulação ativos. Inclui tanto os tablespaces de anulação implícitos (criados por `InnoDB`) quanto os explícitos (criados pelo usuário). Para informações sobre tablespaces de anulação, consulte a Seção 17.6.3.4, Undo Tablespaces.

- `Innodb_undo_tablespaces_explicit`

O número de tablespaces de anulação criados pelo utilizador.

- `Innodb_undo_tablespaces_implicit`

O número de tablespaces de anulação criados por `InnoDB`. Dois tablespaces de anulação padrão são criados por `InnoDB` quando a instância do MySQL é inicializada. Para informações sobre tablespaces de anulação, veja Seção 17.6.3.4, Undo Tablespaces.

- `Innodb_undo_tablespaces_total`

O número total de espaços de tabela de anulação. Inclui tanto os espaços de tabela de anulação implícitos (criados por `InnoDB`) quanto os explícitos (criados pelo usuário), ativos e inativos. Para informações sobre espaços de tabela de anulação, consulte a Seção 17.6.3.4, Undo Tablespaces.

- `Key_blocks_not_flushed`

O número de blocos de chave no cache de chave `MyISAM` que foram alterados, mas ainda não foram descarregados no disco.

- `Key_blocks_unused`

O número de blocos não usados no cache de chave `MyISAM`. Você pode usar esse valor para determinar quanto do cache de chave está em uso; veja a discussão do `key_buffer_size` na Seção 7.1.8, Variaveis do Sistema do Servidor.

- `Key_blocks_used`

O número de blocos usados no cache de chaves `MyISAM`. Este valor é uma marca de alta que indica o número máximo de blocos que já foram usados ao mesmo tempo.

- `Key_read_requests`

O número de pedidos para ler um bloco de chaves do cache de chaves `MyISAM`.

- `Key_reads`

O número de leituras físicas de um bloco de chave do disco para o cache de chave `MyISAM`. Se `Key_reads` é grande, então seu valor `key_buffer_size` é provavelmente muito pequeno. A taxa de falha do cache pode ser calculada como `Key_reads` / `Key_read_requests`.

- `Key_write_requests`

O número de solicitações para escrever um bloco de chave para o cache de chave `MyISAM`.

- `Key_writes`

O número de gravações físicas de um bloco de chaves do cache de chaves `MyISAM` para o disco.

- `Last_query_cost`

O custo total da última consulta compilada, como calculado pelo otimizador de consulta. Isso é útil para comparar o custo de diferentes planos de consulta para a mesma consulta. O valor padrão de 0 significa que nenhuma consulta foi compilada ainda. O valor padrão é 0.

Esta variável mostra o custo de consultas que têm vários blocos de consulta, somando as estimativas de custo de cada bloco de consulta, estimando quantas vezes são executadas subconselhos não cacheáveis e multiplicando o custo desses blocos de consulta pelo número de execuções de subconselhos.

- `Last_query_partial_plans`

O número de iterações que o otimizador de consulta fez na construção do plano de execução para a consulta anterior.

`Last_query_partial_plans` tem escopo de sessão.

- `Locked_connects`

O número de tentativas de conexão com contas de utilizador bloqueadas.

- `Max_execution_time_exceeded`

O número de instruções `SELECT` para as quais o tempo de execução foi excedido.

- `Max_execution_time_set`

O número de instruções `SELECT` para as quais um tempo de execução diferente de zero foi definido. Isso inclui instruções que incluem uma sugestão de otimizador `MAX_EXECUTION_TIME` diferente de zero, e instruções que não incluem tal sugestão, mas executam enquanto o tempo de execução indicado pela variável do sistema `max_execution_time` é diferente de zero.

- `Max_execution_time_set_failed`

O número de instruções `SELECT` para as quais a tentativa de definir um tempo de execução falhou.

- `Max_used_connections`

Número máximo de conexões em uso simultâneo desde o início do servidor.

- `Max_used_connections_time`

A hora em que o `Max_used_connections` atingiu o seu valor atual.

- `Not_flushed_delayed_rows`

Esta variável de status está obsoleta (porque as inserções de `DELAYED` não são suportadas); espere que ela seja removida em uma versão futura.

- `mecab_charset`

O conjunto de caracteres atualmente usado pelo plugin de análise de texto completo MeCab. Para informações relacionadas, consulte a Seção 14.9.9, MeCab Full-Text Parser Plugin.

- `Ongoing_anonymous_transaction_count`

Indica o número de transacções em curso que foram marcadas como anónimas, o que pode ser utilizado para garantir que não há mais transacções à espera de serem processadas.

- `Ongoing_anonymous_gtid_violating_transaction_count`

Esta variável de status só está disponível nas compilações de depuração. Mostra o número de transações em andamento que usam `gtid_next=ANONYMOUS` e que violam a consistência GTID.

- `Ongoing_automatic_gtid_violating_transaction_count`

Esta variável de status só está disponível nas compilações de depuração. Mostra o número de transações em andamento que usam `gtid_next=AUTOMATIC` e que violam a consistência GTID.

- `Open_files`

O número de arquivos que estão abertos. Esta contagem inclui arquivos regulares abertos pelo servidor. Não inclui outros tipos de arquivos, como sockets ou pipes. Além disso, a contagem não inclui arquivos que os mecanismos de armazenamento abrem usando suas próprias funções internas, em vez de pedir ao nível do servidor que o faça.

- `Open_streams`

Número de rios abertos (usados principalmente para extração de madeira).

- `Open_table_definitions`

O número de definições de tabela armazenadas em cache.

- `Open_tables`

O número de mesas abertas.

- `Opened_files`

O número de arquivos que foram abertos com `my_open()` (uma função de biblioteca `mysys`). Partes do servidor que abrem arquivos sem usar esta função não aumentam a contagem.

- `Opened_table_definitions`

O número de definições de tabela que foram armazenadas em cache.

- `Opened_tables`

O número de tabelas que foram abertas. Se `Opened_tables` é grande, seu valor `table_open_cache` é provavelmente muito pequeno.

- `Performance_schema_xxx`

  As variáveis de estado do esquema de desempenho são enumeradas na secção 29.16, "Variáveis de estado do esquema de desempenho". Estas variáveis fornecem informações sobre a instrumentação que não pôde ser carregada ou criada devido a restrições de memória.
- `Prepared_stmt_count`

O número atual de instruções preparadas. (O número máximo de instruções é dado pela variável do sistema `max_prepared_stmt_count`.)

- `Queries`

O número de instruções executadas pelo servidor. Esta variável inclui instruções executadas dentro de programas armazenados, ao contrário da variável `Questions`. Não conta com os comandos `COM_PING` ou `COM_STATISTICS`.

A discussão no início desta secção indica como relacionar esta variável de estado de contagem de declarações com outras variáveis desse tipo.

- `Questions`

O número de instruções executadas pelo servidor. Isso inclui apenas instruções enviadas ao servidor por clientes e não instruções executadas dentro de programas armazenados, ao contrário da variável `Queries`. Esta variável não conta com os comandos `COM_PING`, `COM_STATISTICS`, `COM_STMT_PREPARE`, `COM_STMT_CLOSE` ou `COM_STMT_RESET`.

A discussão no início desta secção indica como relacionar esta variável de estado de contagem de declarações com outras variáveis desse tipo.

- `Replica_open_temp_tables`

  `Replica_open_temp_tables` mostra o número de tabelas temporárias que o thread SQL de replicação está aberto atualmente. Se o valor for maior que zero, não é seguro encerrar a réplica; veja Seção 19.5.1.31, Replicação e tabelas temporárias. Esta variável informa a contagem total de tabelas temporárias abertas para *todos* os canais de replicação.
- `Resource_group_supported`

Indica se o recurso de grupo de recursos é suportado.

Em algumas plataformas ou configurações de servidor MySQL, os grupos de recursos não estão disponíveis ou têm limitações.

- `Rpl_semi_sync_master_clients`

O número de réplicas semisíncronas.

Sinônimo depreciado para `Rpl_semi_sync_source_clients`.

- `Rpl_semi_sync_master_net_avg_wait_time`

Sinônimo depreciado para `Rpl_semi_sync_source_net_avg_wait_time`.

- `Rpl_semi_sync_master_net_wait_time`

Sinônimo depreciado para `Rpl_semi_sync_source_net_wait_time`.

- `Rpl_semi_sync_master_net_waits`

O número total de vezes que a fonte esperou por respostas de réplica.

Sinônimo depreciado para `Rpl_semi_sync_source_net_waits`.

- `Rpl_semi_sync_master_no_times`

Sinônimo depreciado para `Rpl_semi_sync_source_no_times`.

- `Rpl_semi_sync_master_no_tx`

Sinônimo depreciado para `Rpl_semi_sync_source_no_tx`.

- `Rpl_semi_sync_master_status`

Sinônimo depreciado para `Rpl_semi_sync_source_status`.

- `Rpl_semi_sync_master_timefunc_failures`

Sinônimo depreciado para `Rpl_semi_sync_source_timefunc_failures`.

- `Rpl_semi_sync_master_tx_avg_wait_time`

Sinônimo depreciado para `Rpl_semi_sync_source_tx_avg_wait_time`.

- `Rpl_semi_sync_master_tx_wait_time`

Sinônimo depreciado para `Rpl_semi_sync_source_tx_wait_time`.

- `Rpl_semi_sync_master_tx_waits`

Sinônimo depreciado para `Rpl_semi_sync_source_tx_waits`.

- `Rpl_semi_sync_master_wait_pos_backtraverse`

Sinônimo depreciado para `Rpl_semi_sync_source_wait_pos_backtraverse`.

- `Rpl_semi_sync_master_wait_sessions`

Sinônimo depreciado para `Rpl_semi_sync_source_wait_sessions`.

- `Rpl_semi_sync_master_yes_tx`

Sinônimo depreciado para `Rpl_semi_sync_source_yes_tx`.

- `Rpl_semi_sync_source_clients`

O número de réplicas semisíncronas.

Disponível quando o plug-in `rpl_semi_sync_source` (biblioteca `semisync_source.so`) estiver instalado na fonte.

- `Rpl_semi_sync_source_net_avg_wait_time`

O tempo médio em microssegundos que a fonte esperou por uma resposta de réplica. Esta variável é sempre `0`, e está desatualizada; espere que seja removida em uma versão futura.

Disponível quando o plug-in `rpl_semi_sync_source` (biblioteca `semisync_source.so`) estiver instalado na fonte.

- `Rpl_semi_sync_source_net_wait_time`

O tempo total em microssegundos que a fonte esperou por respostas de réplica. Esta variável é sempre `0`, e está desatualizada; espere que seja removida em uma versão futura.

Disponível quando o plug-in `rpl_semi_sync_source` (biblioteca `semisync_source.so`) estiver instalado na fonte.

- `Rpl_semi_sync_source_net_waits`

O número total de vezes que a fonte esperou por respostas de réplica.

Disponível quando o plug-in `rpl_semi_sync_source` (biblioteca `semisync_source.so`) estiver instalado na fonte.

- `Rpl_semi_sync_source_no_times`

Número de vezes em que a fonte desligou a replicação semisíncrona.

Disponível quando o plug-in `rpl_semi_sync_source` (biblioteca `semisync_source.so`) estiver instalado na fonte.

- `Rpl_semi_sync_source_no_tx`

O número de commits que não foram reconhecidos com sucesso por uma réplica.

Disponível quando o plug-in `rpl_semi_sync_source` (biblioteca `semisync_source.so`) estiver instalado na fonte.

- `Rpl_semi_sync_source_status`

Se a replicação semisíncrona está atualmente operacional no código-fonte. O valor é `ON` se o plugin foi habilitado e ocorreu um reconhecimento de commit. É `OFF` se o plugin não for habilitado ou a fonte voltou à replicação assíncrona devido ao tempo de confirmação de commit.

Disponível quando o plug-in `rpl_semi_sync_source` (biblioteca `semisync_source.so`) estiver instalado na fonte.

- `Rpl_semi_sync_source_timefunc_failures`

O número de vezes que a fonte falhou ao chamar funções de tempo, como `gettimeofday()`.

Disponível quando o plug-in `rpl_semi_sync_source` (biblioteca `semisync_source.so`) estiver instalado na fonte.

- `Rpl_semi_sync_source_tx_avg_wait_time`

O tempo médio em microssegundos que a fonte esperou para cada transação.

Disponível quando o plug-in `rpl_semi_sync_source` (biblioteca `semisync_source.so`) estiver instalado na fonte.

- `Rpl_semi_sync_source_tx_wait_time`

O tempo total em microssegundos em que a fonte esperou por transações.

Disponível quando o plug-in `rpl_semi_sync_source` (biblioteca `semisync_source.so`) estiver instalado na fonte.

- `Rpl_semi_sync_source_tx_waits`

Número total de vezes que a fonte esperou por transações.

Disponível quando o plug-in `rpl_semi_sync_source` (biblioteca `semisync_source.so`) estiver instalado na fonte.

- `Rpl_semi_sync_source_wait_pos_backtraverse`

O número total de vezes que a fonte esperou por um evento com coordenadas binárias mais baixas do que os eventos esperados anteriormente. Isso pode ocorrer quando a ordem em que as transações começam a esperar por uma resposta é diferente da ordem em que seus eventos de log binário são escritos.

Disponível quando o plug-in `rpl_semi_sync_source` (biblioteca `semisync_source.so`) estiver instalado na fonte.

- `Rpl_semi_sync_source_wait_sessions`

Número de sessões que aguardam atualmente respostas de réplica.

Disponível quando o plug-in `rpl_semi_sync_source` (biblioteca `semisync_source.so`) estiver instalado na fonte.

- `Rpl_semi_sync_source_yes_tx`

O número de commits reconhecidos com sucesso por uma réplica.

Disponível quando o plug-in `rpl_semi_sync_source` (biblioteca `semisync_source.so`) estiver instalado na fonte.

- `Rpl_semi_sync_replica_status`

Mostra se a replicação semisíncrona está atualmente operacional na réplica. Este é `ON` se o plugin foi habilitado e o thread de I/O (receptor) de replicação estiver em execução, `OFF` caso contrário.

Disponível quando o plug-in `rpl_semi_sync_source` (biblioteca `semisync_source.so`) estiver instalado na fonte.

- `Rpl_semi_sync_slave_status`

Sinônimo depreciado para `Rpl_semi_sync_replica_status`.

- `Rsa_public_key`

O valor desta variável é a chave pública usada pelo plug-in de autenticação \[`sha256_password`] (obsoleto) para troca de senhas baseada em pares de chaves RSA. O valor não é vazio apenas se o servidor inicializa com sucesso as chaves privada e pública nos arquivos nomeados pelas variáveis do sistema \[`sha256_password_private_key_path`] e \[`sha256_password_public_key_path`]. O valor de \[`Rsa_public_key`] vem do último arquivo.

Para obter informações sobre \[`sha256_password`], ver Secção 8.4.1.3, SHA-256 Pluggable Authentication.

- `Secondary_engine_execution_count`

Para uso com o MySQL HeatWave apenas. Veja Status Variables, para mais informações.

- `Select_full_join`

O número de junções que executam varreduras de tabelas porque não usam índices. Se este valor não for 0, deve verificar cuidadosamente os índices das suas tabelas.

- `Select_full_range_join`

Número de junções que utilizaram uma pesquisa de intervalo numa tabela de referência.

- `Select_range`

O número de junções usadas varia na primeira tabela. Isso normalmente não é uma questão crítica, mesmo que o valor seja bastante grande.

- `Select_range_check`

O número de junções sem chaves que verificam o uso de chaves após cada linha. Se não for 0, você deve verificar cuidadosamente os índices de suas tabelas.

- `Select_scan`

O número de junções que fizeram uma varredura completa da primeira tabela.

- `Slave_open_temp_tables`

Alias deprecado para `Replica_open_temp_tables`.

- `Slave_rows_last_search_algorithm_used`

Alias deprecado para `Replica_rows_last_search_algorithm_used`.

- `Slow_launch_threads`

O número de tópicos que levaram mais de `slow_launch_time` segundos para criar.

- `Slow_queries`

O número de consultas que levaram mais do que \[`long_query_time`] segundos. Este contador aumenta independentemente de se o registro de consulta lenta está habilitado. Para informações sobre esse registro, consulte a Seção 7.4.5, The Slow Query Log.

- `Sort_merge_passes`

O número de passes de fusão que o algoritmo de classificação teve que fazer. Se este valor for grande, você deve considerar aumentar o valor da variável do sistema `sort_buffer_size`.

- `Sort_range`

O número de tipos que foram feitos usando intervalos.

- `Sort_rows`

O número de linhas ordenadas.

- `Sort_scan`

O número de tipos que foram feitas por varredura da tabela.

- `Ssl_accept_renegotiates`

O número de negociações necessárias para estabelecer a ligação.

- `Ssl_accepts`

Número de conexões SSL aceites.

- `Ssl_callback_cache_hits`

O número de chamadas de retorno do cache.

- `Ssl_cipher`

A cifra de encriptação atual (vazia para conexões não encriptadas).

- `Ssl_cipher_list`

A lista de códigos SSL possíveis (vazio para conexões não SSL). Se o MySQL suporta TLSv1.3, o valor inclui os possíveis conjuntos de códigos TLSv1.3.

- `Ssl_client_connects`

O número de tentativas de conexão SSL para um servidor de origem de replicação habilitado para SSL.

- `Ssl_connect_renegotiates`

O número de negociações necessárias para estabelecer a ligação a um servidor de origem de replicação habilitado para SSL.

- `Ssl_ctx_verify_depth`

Profundidade de verificação de contexto SSL (quantos certificados da cadeia são testados).

- `Ssl_ctx_verify_mode`

O modo de verificação de contexto SSL.

- `Ssl_default_timeout`

O tempo de espera SSL padrão.

- `Ssl_finished_accepts`

O número de conexões SSL com êxito ao servidor.

- `Ssl_finished_connects`

Número de conexões de réplica com êxito a um servidor de origem de réplica habilitado para SSL.

- `Ssl_server_not_after`

A última data para a qual o certificado SSL é válido. Para verificar a informação de expiração do certificado SSL, use esta declaração:

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

A primeira data de validade do certificado SSL.

- `Ssl_session_cache_hits`

O número de sessões de cache SSL acertadas.

- `Ssl_session_cache_misses`

O número de cache de sessão SSL falhou.

- `Ssl_session_cache_mode`

O modo de cache de sessão SSL. Quando o valor da variável do servidor `ssl_session_cache_mode` é `ON`, o valor da variável de status `Ssl_session_cache_mode` é `SERVER`.

- `Ssl_session_cache_overflows`

O número de cache de sessão SSL transborda.

- `Ssl_session_cache_size`

O tamanho do cache da sessão SSL.

- `Ssl_session_cache_timeout`

O valor de tempo de expiração em segundos das sessões SSL no cache.

- `Ssl_session_cache_timeouts`

O número de temporadas de cache de sessão SSL.

- `Ssl_sessions_reused`

Isso é igual a 0 se o TLS não foi usado na sessão atual do MySQL, ou se uma sessão TLS não foi reutilizada; caso contrário, é igual a 1.

`Ssl_sessions_reused` tem escopo de sessão.

- `Ssl_used_session_cache_entries`

Quantas entradas de cache de sessão SSL foram utilizadas.

- `Ssl_verify_depth`

Profundidade de verificação para conexões SSL de replicação.

- `Ssl_verify_mode`

O modo de verificação usado pelo servidor para uma conexão que usa SSL. O valor é uma máscara de bits; os bits são definidos no arquivo de cabeçalho `openssl/ssl.h`:

```
# define SSL_VERIFY_NONE                 0x00
# define SSL_VERIFY_PEER                 0x01
# define SSL_VERIFY_FAIL_IF_NO_PEER_CERT 0x02
# define SSL_VERIFY_CLIENT_ONCE          0x04
```

`SSL_VERIFY_PEER` indica que o servidor solicita um certificado do cliente. Se o cliente fornecer um, o servidor executa a verificação e prossegue somente se a verificação for bem-sucedida. `SSL_VERIFY_CLIENT_ONCE` indica que um pedido para o certificado do cliente é executado apenas no aperto de mão inicial.

- `Ssl_version`

A versão do protocolo SSL da conexão (por exemplo, TLSv1.2).

- `Table_locks_immediate`

O número de vezes que um pedido de bloqueio de mesa pode ser concedido imediatamente.

- `Table_locks_waited`

O número de vezes que um pedido para um bloqueio de tabela não pôde ser concedido imediatamente e uma espera foi necessária. Se isso for alto e você tiver problemas de desempenho, você deve primeiro otimizar suas consultas e, em seguida, dividir sua tabela ou tabelas ou usar replicação.

- `Table_open_cache_hits`

O número de hits para pesquisas de cache de tabelas abertas.

- `Table_open_cache_misses`

O número de falhas para pesquisas de cache de tabelas abertas.

- `Table_open_cache_overflows`

O número de sobrecargas para o cache de tabelas abertas. Este é o número de vezes, depois que uma tabela é aberta ou fechada, uma instância de cache tem uma entrada não usada e o tamanho da instância é maior do que `table_open_cache` / `table_open_cache_instances`.

- `Tc_log_max_pages_used`

Para a implementação mapeada na memória do log que é usada pelo `mysqld` quando atua como coordenador de transações para recuperação de transações internas XA, esta variável indica o maior número de páginas usadas para o log desde o início do servidor. Se o produto de `Tc_log_max_pages_used` e `Tc_log_page_size` é sempre significativamente menor que o tamanho do log, o tamanho é maior do que o necessário e pode ser reduzido. (O tamanho é definido pela opção `--log-tc-size`. Esta variável não é usada: Não é necessária para recuperação baseada em log binário, e o método de recuperação de log mapeado na memória não é usado a menos que o número de mecanismos de armazenamento capazes de cometer em duas fases e que suportem transações XA seja maior do que um. (`InnoDB` é o único mecanismo aplicável.)

- `Tc_log_page_size`

O tamanho da página usada para a implementação mapeada na memória do log de recuperação XA. O valor padrão é determinado usando `getpagesize()`. Esta variável não é usada pelas mesmas razões descritas para `Tc_log_max_pages_used`.

- `Tc_log_page_waits`

Para a implementação mapeada na memória do log de recuperação, esta variável aumenta cada vez que o servidor não foi capaz de cometer uma transação e teve que esperar por uma página livre no log. Se este valor for grande, você pode querer aumentar o tamanho do log (com a opção `--log-tc-size`). Para a recuperação baseada em log binário, esta variável aumenta cada vez que o log binário não pode ser fechado porque há commits em duas fases em andamento. (A operação de fechamento aguarda até que todas essas transações sejam concluídas.)

- `Telemetry_metrics_supported`

Se as métricas de telemetria do servidor são suportadas.

Para obter mais informações, consulte a seção *Serviço de métricas de telemetria de servidor* na documentação do código-fonte do MySQL.

- `telemetry.live_sessions`

Mostra o número atual de sessões instrumentalizadas com telemetria. Isto pode ser útil ao descarregar o componente de telemetria, para monitorar quantas sessões estão bloqueando a operação de descarregar.

Para mais informações, consulte a seção \* Serviço de rastreamento de telemetria do servidor \* na documentação do código fonte do MySQL e no capítulo 35, \* Telemetria \*.

- `Telemetry_traces_supported`

Se o rastreamento por telemetria do servidor é suportado.

Para mais informações, consulte a seção *Service de rastreamento de telemetria do servidor* na documentação do código fonte do MySQL.

- `Threads_cached`

O número de threads no cache de threads.

- `Threads_connected`

Número de conexões atualmente abertas.

- `Threads_created`

O número de threads criados para lidar com conexões. Se o `Threads_created` for grande, você pode aumentar o valor `thread_cache_size`. A taxa de falha do cache pode ser calculada como `Threads_created` / `Connections`.

- `Threads_running`

O número de fios que não estão dormindo.

- `Tls_library_version`

A versão de tempo de execução da biblioteca OpenSSL que está em uso para esta instância do MySQL.

- `Tls_sni_server_name`

A Indicação de Nome do Servidor (SNI) que está em uso para esta sessão, se especificado pelo cliente; caso contrário, vazio. SNI é uma extensão do protocolo TLS (OpenSSL deve ser compilado usando extensões TLS para que esta variável de status funcione). A implementação MySQL do SNI representa apenas o lado do cliente.

- `Uptime`

O número de segundos que o servidor esteve ligado.

- `Uptime_since_flush_status`

O número de segundos desde a instrução `FLUSH STATUS` mais recente.
