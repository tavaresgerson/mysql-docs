### 5.1.9 Variáveis de Status do Servidor

O servidor MySQL mantém muitas variáveis de status que fornecem informações sobre sua operação. Você pode visualizar essas variáveis e seus valores usando a instrução `SHOW [GLOBAL | SESSION] STATUS` (consulte Seção 13.7.5.35, "Instrução SHOW STATUS"). A palavra-chave opcional `GLOBAL` agrega os valores sobre todas as conexões, e `SESSION` mostra os valores para a conexão atual.

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

Muitas variáveis de status são redefinidas para 0 pela instrução `FLUSH STATUS`.

Esta seção fornece uma descrição de cada variável de estado. Para um resumo das variáveis de estado, consulte Seção 5.1.5, “Referência da Variável de Estado do Servidor”. Para informações sobre variáveis de estado específicas do NDB Cluster, consulte Seção 21.4.3.9.3, “Variáveis de Estado do NDB Cluster”.

As variáveis de status têm os significados mostrados na lista a seguir.

- `Clientes cancelados`

  O número de conexões que foram interrompidas porque o cliente morreu sem fechar a conexão corretamente. Consulte Seção B.3.2.9, "Erros de Comunicação e Conexões Interrompidas".

- `Conexões interrompidas`

  O número de tentativas falhas de conexão com o servidor MySQL. Consulte Seção B.3.2.9, “Erros de Comunicação e Conexões Abortadas”.

  Para obter informações adicionais sobre conexões, consulte as variáveis de status `Connection_errors_xxx` e a tabela `host_cache`.

  A partir do MySQL 5.7.3, `Aborted_connects` não é visível no servidor integrado porque, para esse servidor, ele não é atualizado e não tem significado.

- `Binlog_cache_disk_use`

  O número de transações que usaram o cache temporário de log binário, mas que excederam o valor de [`binlog_cache_size`](https://pt.wikipedia.org/wiki/Op%C3%A7%C3%B5es_de_replic%C3%A3o#sysvar_binlog_cache_size) e usaram um arquivo temporário para armazenar as instruções da transação.

  O número de declarações não transacionais que causaram a gravação do cache de transações do log binário no disco é rastreado separadamente na variável de status `Binlog_stmt_cache_disk_use`.

- `Binlog_cache_use`

  O número de transações que usaram o cache do log binário.

- `Binlog_stmt_cache_disk_use`

  O número de declarações não transacionais que usaram o cache de declarações do log binário, mas que excederam o valor de [`binlog_stmt_cache_size`](https://pt.wikipedia.org/wiki/Op%C3%A7%C3%B5es_de_replic%C3%A3o#sysvar_binlog_stmt_cache_size) e usaram um arquivo temporário para armazenar essas declarações.

- `Binlog_stmt_cache_use`

  O número de declarações não transacionais que usaram o cache de declarações de log binário.

- `Bytes_received`

  O número de bytes recebidos de todos os clientes.

- `Bytes_sent`

  O número de bytes enviados para todos os clientes.

- `Com_xxx`

  As variáveis de contador `Com_xxx` indicam o número de vezes que cada declaração `xxx` foi executada. Há uma variável de status para cada tipo de declaração. Por exemplo, `Com_delete` e `Com_update` contam as declarações `DELETE` e `UPDATE`, respectivamente. `Com_delete_multi` e `Com_update_multi` são semelhantes, mas se aplicam a declarações `DELETE` e `UPDATE` que usam sintaxe de múltiplas tabelas.

  Se um resultado de consulta for retornado do cache de consulta, o servidor incrementa a variável de status `Qcache_hits`, e não `Com_select`. Veja Seção 8.10.3.4, “Status e Manutenção do Cache de Consulta”.

  Todas as variáveis `Com_stmt_xxx` são incrementadas mesmo que um argumento de declaração preparada seja desconhecido ou se ocorrer um erro durante a execução. Em outras palavras, seus valores correspondem ao número de solicitações emitidas, e não ao número de solicitações concluídas com sucesso. Por exemplo, como as variáveis de status são inicializadas para cada inicialização do servidor e não persistem em reinicializações, a variável `Com_shutdown` que rastreia as declarações de `SHUTDOWN` normalmente tem um valor de zero, mas pode ser diferente de zero se as declarações de `SHUTDOWN` forem executadas, mas falhar.

  As variáveis de status `Com_stmt_xxx` são as seguintes:

  - `Com_stmt_prepare`
  - `Com_stmt_execute`
  - `Com_stmt_fetch`
  - `Com_stmt_send_long_data`
  - `Com_stmt_reset`
  - `Com_stmt_close`

  Essas variáveis representam comandos de declaração preparada. Seus nomes referem-se ao conjunto de comandos `COM_xxx` usado na camada de rede. Em outras palavras, seus valores aumentam sempre que chamadas da API de declaração preparada, como **mysql_stmt_prepare()**, **mysql_stmt_execute()**, e assim por diante, são executadas. No entanto, `Com_stmt_prepare`, `Com_stmt_execute` e `Com_stmt_close` também aumentam para `PREPARE`, `EXECUTE` ou `DEALLOCATE PREPARE`, respectivamente. Além disso, os valores das variáveis de contador de declarações mais antigas `Com_prepare_sql`, `Com_execute_sql` e `Com_dealloc_sql` aumentam para as declarações `PREPARE`, `EXECUTE` e `DEALLOCATE PREPARE`. `Com_stmt_fetch` representa o número total de viagens de ida e volta na rede emitidas ao recuperar de cursors.

  `Com_stmt_reprepare` indica quantas vezes as instruções foram reprogramadas automaticamente pelo servidor após alterações de metadados em tabelas ou visualizações referenciadas pela instrução. Uma operação de reprogramação incrementa `Com_stmt_reprepare` e também `Com_stmt_prepare`.

  `Com_explain_other` indica o número de instruções `EXPLAIN FOR CONNECTION` executadas. Veja Seção 8.8.4, “Obtendo informações do plano de execução para uma conexão nomeada”.

  `Com_change_repl_filter` indica o número de instruções de `REPLICAÇÃO DE MUDANÇAS DE FILTRO` executadas.

- `Compressão`

  Se a conexão do cliente utiliza compressão no protocolo cliente/servidor.

- `Erros de conexão_xxx`

  Essas variáveis fornecem informações sobre os erros que ocorrem durante o processo de conexão do cliente. Elas são globais e representam contagens de erros agregadas em todas as conexões de todos os hosts. Essas variáveis rastreiam erros que não são contabilizados pelo cache do host (veja Seção 5.1.11.2, “Consultas DNS e o Cache do Host”), como erros que não estão associados a conexões TCP, ocorrem muito cedo no processo de conexão (mesmo antes de um endereço IP ser conhecido) ou não são específicos para qualquer endereço IP particular (como condições de memória insuficiente).

  A partir do MySQL 5.7.3, as variáveis de status `Connection_errors_xxx` não são visíveis no servidor integrado, pois, para esse servidor, elas não são atualizadas e não têm significado.

  - [`Erros de conexão_aceitar`]\(server-status-variables.html#statvar_Erros de conexão_aceitar)

    O número de erros que ocorreram durante as chamadas para `accept()` na porta de escuta.

  - `Erros de conexão internos`

    O número de conexões recusadas devido a erros internos no servidor, como falha ao iniciar um novo thread ou condição de falta de memória.

  - `Erros de conexão_max_conexões`

    O número de conexões recusadas porque o limite do servidor `max_connections` foi atingido.

  - `Erros de conexão de endereço do parceiro`

    O número de erros que ocorreram ao procurar por endereços IP do cliente de conexão.

  - [`Erros de conexão_selecionar`]\(server-status-variables.html#statvar_Erros de conexão_selecionar)

    O número de erros que ocorreram durante chamadas para `select()` ou `poll()` na porta de escuta. (O falha desta operação não significa necessariamente que uma conexão com o cliente foi rejeitada.)

  - `Erros de conexão_tcpwrap`

    Número de conexões recusadas pela biblioteca `libwrap`.

- `Conexões`

  O número de tentativas de conexão (sucedidas ou não) ao servidor MySQL.

- `Criado_tabelas_de_disco_temporário`

  O número de tabelas temporárias internas no disco criadas pelo servidor durante a execução de instruções.

  Você pode comparar o número de tabelas temporárias internas criadas no disco com o número total de tabelas temporárias internas criadas comparando os valores de `Created_tmp_disk_tables` e `Created_tmp_tables`.

  Veja também Seção 8.4.4, “Uso de Tabelas Temporárias Internas no MySQL”.

- `Created_tmp_files`

  Quantos arquivos temporários **mysqld** foram criados.

- `Criadas tabelas temporárias`

  O número de tabelas temporárias internas criadas pelo servidor durante a execução de instruções.

  Você pode comparar o número de tabelas temporárias internas criadas no disco com o número total de tabelas temporárias internas criadas comparando os valores de `Created_tmp_disk_tables` e `Created_tmp_tables`.

  Veja também Seção 8.4.4, “Uso de Tabelas Temporárias Internas no MySQL”.

  Cada invocação da instrução `SHOW STATUS` usa uma tabela temporária interna e incrementa o valor global `Created_tmp_tables`.

- `Erros atrasados`

  Essa variável de status está desatualizada (porque as inserções `DELAYED` não são suportadas); espere que ela seja removida em uma futura versão.

- `Delayed_insert_threads`

  Essa variável de status está desatualizada (porque as inserções `DELAYED` não são suportadas); espere que ela seja removida em uma futura versão.

- `escritas_atrasadas`

  Essa variável de status está desatualizada (porque as inserções `DELAYED` não são suportadas); espere que ela seja removida em uma futura versão.

- `Flush_commands`

  O número de vezes que o servidor esvazia as tabelas, seja porque um usuário executou uma instrução `FLUSH TABLES` ou devido a uma operação interna do servidor. Ele também é incrementado com o recebimento de um pacote `COM_REFRESH`. Isso contrasta com `Com_flush`, que indica quantos `FLUSH` instruções foram executadas, seja `FLUSH TABLES`, `FLUSH LOGS` e assim por diante.

- `grupo_replicação_membro_primario`

  Mostra o UUID do membro principal quando o grupo está em modo de único principal. Se o grupo estiver em modo de múltiplos principais, mostrará uma string vazia.

- `Handler_commit`

  O número de declarações internas `COMMIT`.

- `Handler_delete`

  O número de vezes que as linhas foram excluídas das tabelas.

- `Handler_external_lock`

  O servidor incrementa essa variável a cada chamada à sua função `external_lock()`, que geralmente ocorre no início e no final do acesso a uma instância de tabela. Pode haver diferenças entre os motores de armazenamento. Essa variável pode ser usada, por exemplo, para descobrir, para uma instrução que acessa uma tabela particionada, quantos particionamentos foram eliminados antes de o bloqueio ocorrer: Verifique quanto o contador aumentou para a instrução, subtraia 2 (2 chamadas para a própria tabela), depois divida por 2 para obter o número de particionamentos bloqueados.

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

  O número de solicitações para ler a linha anterior na ordem chave. Esse método de leitura é usado principalmente para otimizar a consulta `ORDER BY ... DESC`.

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

- `Innodb_available_undo_logs`

  Nota

  A variável de status `Innodb_available_undo_logs` está desatualizada a partir do MySQL 5.7.19; espere-se que ela seja removida em uma futura versão.

  O número total de segmentos de rollback disponíveis do `InnoDB` [glossary.html#glos_rollback_segment]. Complementa a variável de sistema `innodb_rollback_segments`, que define o número de segmentos de rollback ativos.

  Um segmento de rollback sempre reside no espaço de tabelas do sistema, e 32 segmentos de rollback são reservados para uso de tabelas temporárias e hospedados no espaço de tabelas temporárias (`ibtmp1`). Veja Seção 14.6.7, “Logs de Undo”.

  Se você iniciar uma instância MySQL com 32 ou menos segmentos de rollback, o `InnoDB` ainda atribui um segmento de rollback ao espaço de tabelas do sistema e 32 segmentos de rollback ao espaço de tabelas temporárias. Nesse caso, `Innodb_available_undo_logs` relata 33 segmentos de rollback disponíveis, mesmo que a instância tenha sido inicializada com um valor menor de `innodb_rollback_segments` (innodb-parameters.html#sysvar_innodb_rollback_segments).

- `Innodb_buffer_pool_dump_status`

  O progresso de uma operação de registro das páginas armazenadas no `InnoDB` buffer pool, acionado pela configuração de `innodb_buffer_pool_dump_at_shutdown` ou `innodb_buffer_pool_dump_now`.

  Para informações e exemplos relacionados, consulte Seção 14.8.3.6, “Salvar e restaurar o estado do pool de buffer”.

- `Innodb_buffer_pool_load_status`

  O progresso de uma operação para aquecer o `InnoDB` pool de buffers lendo um conjunto de páginas correspondentes a um ponto anterior no tempo, acionado pela configuração de `innodb_buffer_pool_load_at_startup` ou `innodb_buffer_pool_load_now`. Se a operação introduzir um excesso de sobrecarga, você pode cancelá-la configurando `innodb_buffer_pool_load_abort`.

  Para informações e exemplos relacionados, consulte Seção 14.8.3.6, “Salvar e restaurar o estado do pool de buffer”.

- `Innodb_buffer_pool_bytes_data`

  O número total de bytes no `InnoDB` pool de buffers que contém dados. O número inclui páginas sujas e limpas. Para cálculos mais precisos de uso de memória do que com `Innodb_buffer_pool_pages_data`, quando tabelas [comprimidos]\(glossary.html#glos_compression] causam o pool de buffers a reter páginas de tamanhos diferentes.

- `Innodb_buffer_pool_pages_data`

  O número de páginas no `pool de buffers InnoDB` (glossary.html#glos_buffer_pool) que contêm dados. O número inclui tanto páginas sujas quanto páginas limpas. Ao usar tabelas compactadas, o valor relatado de `Innodb_buffer_pool_pages_data` pode ser maior que `Innodb_buffer_pool_pages_total` (Bug #59550).

- `Innodb_buffer_pool_bytes_dirty`

  O número total atual de bytes mantidos nas páginas sujas ([glossary.html#glos_dirty_page]) no `InnoDB` buffer pool. Para cálculos mais precisos de uso de memória do que com `Innodb_buffer_pool_pages_dirty`, quando tabelas comprimidos fazem com que o buffer pool mantenha páginas de tamanhos diferentes.

- `Innodb_buffer_pool_pages_dirty`

  O número atual de páginas sujas no `InnoDB` pool de buffers.

- `Innodb_buffer_pool_pages_flushed`

  O número de solicitações para limpar páginas do `InnoDB` pool de buffers.

- `Innodb_buffer_pool_pages_free`

  O número de páginas livres no `InnoDB` buffer pool.

- `Innodb_buffer_pool_pages_latched`

  O número de páginas abertas (glossary.html#glos_page) no `InnoDB` buffer pool. São páginas que estão sendo lidas ou escritas atualmente, ou que não podem ser limpadas ou removidas por algum outro motivo. O cálculo dessa variável é caro, portanto, ela está disponível apenas quando o sistema `UNIV_DEBUG` é definido durante a construção do servidor.

- `Innodb_buffer_pool_pages_misc`

  O número de páginas no `InnoDB` pool de buffers que estão ocupadas porque foram alocadas para overhead administrativo, como blocos de linha ou o índice de hash adaptativo. Esse valor também pode ser calculado como `Innodb_buffer_pool_pages_total` − `Innodb_buffer_pool_pages_free` − `Innodb_buffer_pool_pages_data`. Ao usar tabelas compactadas, `Innodb_buffer_pool_pages_misc` pode reportar um valor fora dos limites (Bug #59550).

- `Innodb_buffer_pool_pages_total`

  O tamanho total do `InnoDB` pool de buffers, em páginas. Ao usar tabelas compactadas, o valor relatado de `Innodb_buffer_pool_pages_data` pode ser maior que `Innodb_buffer_pool_pages_total` (Bug #59550)

- `Innodb_buffer_pool_read_ahead`

  O número de páginas lidas no pool de buffer do InnoDB pelo thread de sincronização de leitura ahead em segundo plano.

- `Innodb_buffer_pool_read_ahead_evicted`

  O número de páginas lidas no pool de buffer do InnoDB pela antecipação da thread de fundo que foram posteriormente expulsas sem terem sido acessadas por consultas.

- `Innodb_buffer_pool_read_ahead_rnd`

  O número de leituras "aleatórias" iniciadas pelo `InnoDB`. Isso acontece quando uma consulta examina uma grande parte de uma tabela, mas em ordem aleatória.

- `Innodb_buffer_pool_read_requests`

  O número de solicitações de leitura lógicas.

- `Innodb_buffer_pool_reads`

  O número de leituras lógicas que o `InnoDB` não conseguiu satisfazer a partir do pool de buffers e teve que ler diretamente do disco.

- `Innodb_buffer_pool_resize_status`

  O estado de uma operação para redimensionar o `InnoDB` pool de buffers dinamicamente, acionada pelo ajuste dinâmico do parâmetro `innodb_buffer_pool_size`. O parâmetro `innodb_buffer_pool_size` é dinâmico, o que permite redimensionar o pool de buffers sem reiniciar o servidor. Consulte Configurando o Tamanho do Pool de Buffers do InnoDB Online para obter informações relacionadas.

- `Innodb_buffer_pool_wait_free`

  Normalmente, as solicitações para o `InnoDB` pool de buffers ocorrem em segundo plano. Quando o `InnoDB` precisa ler ou criar uma página e não há páginas limpas disponíveis, o `InnoDB` esvazia primeiro algumas páginas sujas e aguarda que essa operação termine. Esse contador conta as instâncias dessas espera. Se o valor de `innodb_buffer_pool_size` tiver sido configurado corretamente, esse valor deve ser pequeno.

- `Innodb_buffer_pool_write_requests`

  O número de gravações feitas no `InnoDB` pool de buffers.

- `Innodb_data_fsyncs`

  O número de operações `fsync()` até agora. A frequência das chamadas `fsync()` é influenciada pela configuração da opção de configuração `innodb_flush_method`.

- `Innodb_data_pending_fsyncs`

  O número atual de operações pendentes de `fsync()`. A frequência das chamadas de `fsync()` é influenciada pela configuração da opção de configuração `innodb_flush_method`.

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

  O número de páginas que foram escritas no buffer de escrita dupla. Consulte Seção 14.12.1, “E/S de disco do InnoDB”.

- `Innodb_dblwr_writes`

  O número de operações de escrita dupla que foram realizadas. Consulte Seção 14.12.1, “E/S de disco do InnoDB”.

- `Innodb_have_atomic_builtins`

  Indica se o servidor foi construído com instruções atómicas.

- `Innodb_log_waits`

  O número de vezes que o buffer de log foi muito pequeno e foi necessário um espera para que ele fosse limpo antes de continuar.

- `Innodb_log_write_requests`

  O número de solicitações de escrita para o `InnoDB` registro de refazer.

- `Innodb_log_writes`

  O número de gravações físicas no arquivo `InnoDB` registro de refazer.

- `Innodb_num_open_files`

  O número de arquivos que o `InnoDB` atualmente mantém abertos.

- `Innodb_os_log_fsyncs`

  O número de escritas `fsync()` feitas nos arquivos do registro de revisão do InnoDB.

- `Innodb_os_log_pending_fsyncs`

  O número de operações pendentes de `fsync()` para os arquivos de log de refazer do InnoDB.

- `Innodb_os_log_pending_writes`

  O número de escritas pendentes nos arquivos do registro de refazer do InnoDB.

- `Innodb_os_log_written`

  O número de bytes escritos nos arquivos do registro de refazer do InnoDB.

- `Innodb_page_size`

  Tamanho da página do `InnoDB` (padrão 16 KB). Muitos valores são contados em páginas; o tamanho da página permite que sejam facilmente convertidos em bytes.

- `Innodb_pages_created`

  O número de páginas criadas por operações em tabelas do `InnoDB`.

- `Innodb_pages_read`

  O número de páginas lidas do pool de buffer do `InnoDB` por operações nas tabelas do `InnoDB`.

- `Innodb_pages_written`

  O número de páginas escritas por operações nas tabelas do `InnoDB`.

- `Innodb_row_lock_current_waits`

  O número de blocos de linha atualmente aguardados por operações em tabelas do `InnoDB`.

- `Innodb_row_lock_time`

  O tempo total gasto na aquisição de blocos de linha para tabelas do `InnoDB`, em milissegundos.

- `Innodb_row_lock_time_avg`

  O tempo médio para adquirir um bloqueio de linha (glossary.html#glos_row_lock) para tabelas `InnoDB`, em milissegundos.

- `Innodb_row_lock_time_max`

  O tempo máximo para adquirir um bloqueio de linha (glossary.html#glos_row_lock) para tabelas `InnoDB`, em milissegundos.

- `Innodb_row_lock_waits`

  O número de vezes em que as operações nas tabelas do `InnoDB` tiveram que esperar por um bloqueio de linha.

- `Innodb_rows_deleted`

  O número de linhas excluídas das tabelas do `InnoDB`.

- `Innodb_rows_inserted`

  O número de linhas inseridas nas tabelas do `InnoDB`.

- `Innodb_rows_read`

  O número de linhas lidas das tabelas do `InnoDB`.

- `Innodb_rows_updated`

  O número estimado de linhas atualizadas nas tabelas do `InnoDB`.

  Nota

  Esse valor não é preciso em 100%. Para obter um resultado preciso (mas mais caro), use [`ROW_COUNT()`](https://pt.docs.oracle.com/database/122/SQL/SQLFUNCTIONS09.htm#SQLI0900000000000000).

- `Innodb_truncated_status_writes`

  Número de vezes em que a saída da instrução `SHOW ENGINE INNODB STATUS` foi truncada.

- `Blocos_chave_não_limpos`

  O número de blocos-chave no cache de chave `MyISAM` que foram alterados, mas ainda não foram descarregados no disco.

- `Key_blocks_unused`

  O número de blocos não utilizados no cache de chaves do `MyISAM`. Você pode usar esse valor para determinar quanto do cache de chaves está em uso; consulte a discussão sobre `key_buffer_size` na Seção 5.1.7, “Variáveis do Sistema do Servidor”.

- `Key_blocks_used`

  O número de blocos usados no cache de chave `MyISAM`. Esse valor é um limite máximo que indica o número máximo de blocos que já estiveram em uso ao mesmo tempo.

- `Solicitações de leitura de chave`

  O número de solicitações para ler um bloco-chave do cache de chaves `MyISAM`.

- `Leitura de chave`

  O número de leituras físicas de um bloco-chave do disco para o cache de chave `MyISAM`. Se `Key_reads` for grande, então o valor de `key_buffer_size` provavelmente é muito pequeno. A taxa de falha de cache pode ser calculada como `Key_reads`/`Key_read_requests`.

- `Solicitações de escrita de chave`

  O número de solicitações para escrever um bloco chave no cache de chave `MyISAM`.

- `Key_writes`

  O número de escritas físicas de um bloco-chave do cache de chaves `MyISAM` para o disco.

- `Last_query_cost`

  O custo total da última consulta compilada, conforme calculado pelo otimizador de consultas. Isso é útil para comparar o custo de diferentes planos de consulta para a mesma consulta. O valor padrão de 0 significa que nenhuma consulta foi compilada ainda. O valor padrão é 0. `Last_query_cost` tem escopo de sessão.

  O `Last_query_cost` pode ser calculado com precisão apenas para consultas simples e "planas", mas não para consultas complexas, como aquelas que contêm subconsultas ou `UNION` (union.html). Para este último caso, o valor é definido como 0.

- `Last_query_partial_plans`

  O número de iterações que o otimizador de consultas fez na construção do plano de execução para a consulta anterior.

  `Last_query_partial_plans` tem escopo de sessão.

- `Conexões bloqueadas`

  Número de tentativas para se conectar a contas de usuários bloqueadas. Para obter informações sobre bloqueio e desbloqueio de contas, consulte Seção 6.2.15, “Bloqueio de Conta”.

- `Max_execution_time_exceeded`

  O número de instruções `SELECT` para as quais o tempo de execução foi excedido.

- `Max_execution_time_set`

  O número de instruções `SELECT` para as quais um tempo de espera de execução não nulo foi definido. Isso inclui instruções que incluem uma dica de otimização `MAX_EXECUTION_TIME` não nula e instruções que não incluem essa dica, mas são executadas enquanto o tempo de espera indicado pela variável de sistema `max_execution_time` não é nulo.

- `Max_execution_time_set_failed`

  Número de instruções `SELECT` para as quais a tentativa de definir um tempo limite de execução falhou.

- `Max_used_connections`

  O número máximo de conexões que estão em uso simultaneamente desde que o servidor começou.

- `Max_used_connections_time`

  O momento em que `Max_used_connections` atingiu seu valor atual.

- `Not_flushed_delayed_rows`

  Essa variável de status está desatualizada (porque as inserções `DELAYED` não são suportadas); espere que ela seja removida em uma futura versão.

- [`mecab_charset`](https://server-status-variables.html#statvar_mecab_charset)

  O conjunto de caracteres atualmente utilizado pelo plugin de analisador de texto completo MeCab. Para informações relacionadas, consulte Seção 12.9.9, “Plugin de Analisador de Texto Completo MeCab”.

- [`Número de transações anônimas em andamento`]\(server-status-variables.html#statvar_Número de transações anônimas em andamento)

  Mostra o número de transações em andamento que foram marcadas como anônimas. Isso pode ser usado para garantir que nenhuma transação adicional esteja aguardando processamento.

- `Número de transações anônimas em violação de `ongoing_anonymous_gtid` em andamento`

  Essa variável de status está disponível apenas em builds de depuração. Mostra o número de transações em andamento que usam [`gtid_next=ANONYMOUS`](https://pt.wikipedia.org/wiki/GTID) e que violam a consistência do GTID.

- `Número de transações que estão violando `ongoing_automatic_gtid` em andamento`

  Essa variável de status está disponível apenas em builds de depuração. Mostra o número de transações em andamento que usam [`gtid_next=AUTOMATIC`](https://pt.wikipedia.org/wiki/GTID) e que violam a consistência do GTID.

- `Open_files`

  O número de arquivos abertos. Esse contagem inclui arquivos regulares abertos pelo servidor. Não inclui outros tipos de arquivos, como soquetes ou tubos. Além disso, o contagem não inclui arquivos que os motores de armazenamento abrem usando suas próprias funções internas, em vez de pedir ao nível do servidor para fazer isso.

- `Open_streams`

  O número de fluxos abertos (usados principalmente para registro).

- [`Definições de tabela aberta`]\(server-status-variables.html#statvar_Definições de tabela aberta)

  O número de arquivos `.frm` armazenados em cache.

- [`Tabelas abertas`]\(server-status-variables.html#statvar_Tabelas abertas)

  O número de tabelas abertas.

- `Arquivos abertos`

  O número de arquivos abertos com `my_open()` (uma função da biblioteca `mysys`). Parte do servidor que abre arquivos sem usar essa função não incrementa o contador.

- [`Definições de tabela abertas`]\(server-status-variables.html#statvar_Definições de tabela abertas)

  O número de arquivos `.frm` que foram cacheados.

- [`Tabelas abertas`]\(server-status-variables.html#statvar_Tabelas abertas)

  O número de tabelas que foram abertas. Se `Opened_tables` for grande, o valor de `table_open_cache` provavelmente é muito pequeno.

- `Performance_schema_xxx`

  As variáveis de status do Schema de Desempenho estão listadas em Seção 25.16, “Variáveis de Status do Schema de Desempenho”. Essas variáveis fornecem informações sobre a instrumentação que não pôde ser carregada ou criada devido a restrições de memória.

- `Prepared_stmt_count`

  O número atual de declarações preparadas. (O número máximo de declarações é dado pela variável de sistema `max_prepared_stmt_count`.)

- `Qcache_free_blocks`

  O número de blocos de memória livres no cache de consultas.

  Nota

  O cache de consultas é descontinuado a partir do MySQL 5.7.20 e é removido no MySQL 8.0. A descontinuidade inclui `Qcache_free_blocks`.

- `Qcache_free_memory`

  A quantidade de memória livre para o cache de consultas.

  Nota

  O cache de consultas é descontinuado a partir do MySQL 5.7.20 e é removido no MySQL 8.0. A descontinuidade inclui `Qcache_free_memory`.

- `Qcache_hits`

  O número de acertos no cache de consultas.

  A discussão no início desta seção indica como relacionar essa variável de status de contagem de declarações a outras variáveis semelhantes.

  Nota

  O cache de consultas é descontinuado a partir do MySQL 5.7.20 e é removido no MySQL 8.0. A descontinuidade inclui `Qcache_hits`.

- `Qcache_inserts`

  O número de consultas adicionadas ao cache de consultas.

  Nota

  O cache de consultas é descontinuado a partir do MySQL 5.7.20 e será removido no MySQL 8.0. A descontinuidade inclui `Qcache_inserts`.

- `Qcache_lowmem_prunes`

  O número de consultas que foram excluídas do cache de consultas devido à baixa memória.

  Nota

  O cache de consultas é descontinuado a partir do MySQL 5.7.20 e será removido no MySQL 8.0. A descontinuidade inclui `Qcache_lowmem_prunes`.

- `Qcache_not_cached`

  O número de consultas não armazenadas em cache (que não podem ser armazenadas em cache ou não podem ser armazenadas em cache devido à configuração de `query_cache_type`.

  Nota

  O cache de consultas é descontinuado a partir do MySQL 5.7.20 e é removido no MySQL 8.0. A descontinuidade inclui `Qcache_not_cached`.

- `Qcache_queries_in_cache`

  O número de consultas registradas no cache de consultas.

  Nota

  O cache de consultas é descontinuado a partir do MySQL 5.7.20 e será removido no MySQL 8.0. A descontinuidade inclui `Qcache_queries_in_cache`.

- `Qcache_total_blocks`

  O número total de blocos no cache de consultas.

  Nota

  O cache de consultas é descontinuado a partir do MySQL 5.7.20 e é removido no MySQL 8.0. A descontinuidade inclui `Qcache_total_blocks`.

- `Perguntas`

  O número de instruções executadas pelo servidor. Esta variável inclui instruções executadas dentro de programas armazenados, ao contrário da variável `Questions`. Ela não conta os comandos `COM_PING` ou `COM_STATISTICS`.

  A discussão no início desta seção indica como relacionar essa variável de status de contagem de declarações a outras variáveis semelhantes.

- `Perguntas`

  O número de instruções executadas pelo servidor. Isso inclui apenas as instruções enviadas ao servidor pelos clientes e não as instruções executadas dentro de programas armazenados, ao contrário da variável `Consultas`. Esta variável não conta os comandos `COM_PING`, `COM_STATISTICS`, `COM_STMT_PREPARE`, `COM_STMT_CLOSE` ou `COM_STMT_RESET`.

  A discussão no início desta seção indica como relacionar essa variável de status de contagem de declarações a outras variáveis semelhantes.

- `Rpl_semi_sync_master_clients`

  O número de réplicas semissíncronas.

  Esta variável está disponível apenas se o plugin de replicação semisoincronizada do lado da fonte estiver instalado.

- `Rpl_semi_sync_master_net_avg_wait_time`

  O tempo médio em microsegundos que a fonte esperou por uma resposta replicada. Esta variável está desatualizada, sempre `0`; espere-se que ela esteja em uma versão futura.

  Esta variável está disponível apenas se o plugin de replicação semisoincronizada do lado da fonte estiver instalado.

- `Rpl_semi_sync_master_net_wait_time`

  O tempo total em microsegundos que a fonte esperou por respostas replicadas. Esta variável está desatualizada e sempre é `0`; espere-se que seja removida em uma versão futura.

  Esta variável está disponível apenas se o plugin de replicação semisoincronizada do lado da fonte estiver instalado.

- `Rpl_semi_sync_master_net_waits`

  O número total de vezes que a fonte esperou por respostas replicadas.

  Esta variável está disponível apenas se o plugin de replicação semisoincronizada do lado da fonte estiver instalado.

- `Rpl_semi_sync_master_no_times`

  Número de vezes que a fonte desativou a replicação semisincronizada.

  Esta variável está disponível apenas se o plugin de replicação semisoincronizada do lado da fonte estiver instalado.

- `Rpl_semi_sync_master_no_tx`

  O número de commits que não foram reconhecidos com sucesso por uma réplica.

  Esta variável está disponível apenas se o plugin de replicação semisoincronizada do lado da fonte estiver instalado.

- `Rpl_semi_sync_master_status`

  Se a replicação semi-sincronizada está atualmente operacional na fonte. O valor é `ON` se o plugin tiver sido habilitado e um reconhecimento de commit ocorrer. É `OFF` se o plugin não estiver habilitado ou se a fonte tiver retornado à replicação assíncrona devido ao tempo limite de reconhecimento de commit.

  Esta variável está disponível apenas se o plugin de replicação semisoincronizada do lado da fonte estiver instalado.

- `Rpl_semi_sync_master_timefunc_failures`

  O número de vezes que a fonte falhou ao chamar funções de tempo, como `gettimeofday()`.

  Esta variável está disponível apenas se o plugin de replicação semisoincronizada do lado da fonte estiver instalado.

- `Rpl_semi_sync_master_tx_avg_wait_time`

  O tempo médio em microsegundos que a fonte esperou por cada transação.

  Esta variável está disponível apenas se o plugin de replicação semisoincronizada do lado da fonte estiver instalado.

- `Rpl_semi_sync_master_tx_wait_time`

  O tempo total em microsegundos que a fonte esperou por transações.

  Esta variável está disponível apenas se o plugin de replicação semisoincronizada do lado da fonte estiver instalado.

- `Rpl_semi_sync_master_tx_waits`

  O número total de vezes que a fonte esperou por transações.

  Esta variável está disponível apenas se o plugin de replicação semisoincronizada do lado da fonte estiver instalado.

- `Rpl_semi_sync_master_wait_pos_backtraverse`

  O número total de vezes que a fonte esperou por um evento com coordenadas binárias inferiores às esperadas anteriormente. Isso pode ocorrer quando a ordem em que as transações começam a esperar por uma resposta é diferente da ordem em que seus eventos de log binário são escritos.

  Esta variável está disponível apenas se o plugin de replicação semisoincronizada do lado da fonte estiver instalado.

- `Rpl_semi_sync_master_wait_sessions`

  O número de sessões que estão aguardando respostas replicadas atualmente.

  Esta variável está disponível apenas se o plugin de replicação semisoincronizada do lado da fonte estiver instalado.

- `Rpl_semi_sync_master_yes_tx`

  O número de commits que foram reconhecidos com sucesso por uma réplica.

  Esta variável está disponível apenas se o plugin de replicação semisoincronizada do lado da fonte estiver instalado.

- `Rpl_semi_sync_slave_status`

  Se a replicação semi-sincronizada está atualmente em operação na replica. É `ON` se o plugin tiver sido habilitado e a thread de E/S da replica estiver em execução, `OFF` caso contrário.

  Esta variável está disponível apenas se o plugin de replicação semi-sincronizada do lado da replica estiver instalado.

- `Rsa_public_key`

  Esta variável está disponível se o MySQL foi compilado com o OpenSSL (consulte Seção 6.3.4, “Capacidades Dependentes da Biblioteca SSL”). Seu valor é não vazio apenas se o servidor inicializar com sucesso as chaves privada e pública nos arquivos nomeados pelas variáveis de sistema `sha256_password_private_key_path` e `sha256_password_public_key_path`. O valor de `Rsa_public_key` vem do último arquivo.

  Para obter informações sobre `sha256_password`, consulte Seção 6.4.1.5, “Autenticação Pluggable SHA-256”.

- `Selecionar_join_completo`

  O número de junções que realizam varreduras de tabela porque não usam índices. Se esse valor não for 0, você deve verificar cuidadosamente os índices de suas tabelas.

- `Selecionar_join_full_range`

  O número de junções que usaram uma pesquisa de intervalo em uma tabela de referência.

- [`Selecionar intervalo`]\(server-status-variables.html#statvar_Selecionar intervalo)

  O número de junções que utilizaram intervalos na primeira tabela. Normalmente, isso não é um problema crítico, mesmo que o valor seja bastante grande.

- [`Selecionar intervalo de verificação`]\(server-status-variables.html#statvar_Selecionar intervalo de verificação)

  O número de junções sem chaves que verificam o uso de chaves após cada linha. Se este número não for 0, você deve verificar cuidadosamente os índices de suas tabelas.

- [`Selecionar varredura`]\(server-status-variables.html#statvar_Selecionar varredura)

  O número de junções que realizaram uma varredura completa da primeira tabela.

- `Slave_heartbeat_period`

  Mostra o intervalo de batida de replicação (em segundos) em uma replica de replicação.

  Essa variável é afetada pelo valor da variável de sistema `show_compatibility_56`. Para obter detalhes, consulte Efeito de show_compatibility_56 nas variáveis de status do escravo.

  Nota

  Essa variável mostra apenas o status do canal de replicação padrão. Para monitorar qualquer canal de replicação, use a coluna `HEARTBEAT_INTERVAL` na tabela `replication_connection_configuration` para o canal de replicação. O valor `Slave_heartbeat_period` (período de batida do escravo) está desatualizado e será removido no MySQL 8.0.

- `Slave_last_heartbeat`

  Mostra quando o sinal de batimento cardíaco mais recente foi recebido por uma réplica, como um valor de `TIMESTAMP`.

  Essa variável é afetada pelo valor da variável de sistema `show_compatibility_56`. Para obter detalhes, consulte Efeito de show_compatibility_56 nas variáveis de status do escravo.

  Nota

  Essa variável mostra apenas o status do canal de replicação padrão. Para monitorar qualquer canal de replicação, use a coluna `LAST_HEARTBEAT_TIMESTAMP` na tabela `replication_connection_status` para o canal de replicação. `Slave_last_heartbeat` (variáveis de status do servidor.html#statvar_Slave_last_heartbeat) está desatualizado e será removido no MySQL 8.0.

- `Slave_open_temp_tables`

  O número de tabelas temporárias que o fio de replicação SQL atual tem aberto. Se o valor for maior que zero, não é seguro desligar a replica; veja Seção 16.4.1.29, “Replicação e Tabelas Temporárias”. Esta variável relata o total de tabelas temporárias abertas para *todos* os canais de replicação.

- `Slave_received_heartbeats`

  Esse contador é incrementado a cada batida de replicação recebida por uma réplica de replicação desde a última vez que a réplica foi reiniciada ou redefinida, ou uma declaração `CHANGE MASTER TO` foi emitida.

  Essa variável é afetada pelo valor da variável de sistema `show_compatibility_56`. Para obter detalhes, consulte Efeito de show_compatibility_56 nas variáveis de status do escravo.

  Nota

  Essa variável mostra apenas o status do canal de replicação padrão. Para monitorar qualquer canal de replicação, use a coluna `COUNT_RECEIVED_HEARTBEATS` na tabela `replication_connection_status` para o canal de replicação. `Slave_received_heartbeats` (variáveis de estado do servidor.html#statvar_Slave_received_heartbeats) está desatualizado e será removido no MySQL 8.0.

- `Slave_retried_transactions`

  O número total de vezes desde a inicialização em que o fio de replicação SQL tentou novamente as transações.

  Essa variável é afetada pelo valor da variável de sistema `show_compatibility_56`. Para obter detalhes, consulte Efeito de show_compatibility_56 nas variáveis de status do escravo.

  Nota

  Essa variável mostra apenas o status do canal de replicação padrão. Para monitorar qualquer canal de replicação, use a coluna `COUNT_TRANSACTIONS_RETRIES` na tabela `replication_applier_status` para o canal de replicação. `Slave_retried_transactions` (variáveis de estado do servidor.html#statvar_Slave_retried_transactions) está desatualizado e será removido no MySQL 8.0.

- `Slave_rows_last_search_algorithm_used`

  O algoritmo de busca que foi mais recentemente utilizado por essa replica para localizar linhas para a replicação baseada em linhas. O resultado mostra se a replica usou índices, uma varredura de tabela ou hashing como o algoritmo de busca para a última transação executada em qualquer canal.

  O método utilizado depende do valor da variável de sistema `slave_rows_search_algorithms` e das chaves disponíveis na tabela relevante.

  Essa variável está disponível apenas para as compilações de depuração do MySQL.

- `Slave_running`

  Esta opção está ativada se este servidor for uma réplica conectada a uma fonte de replicação e se os threads de E/S e SQL estiverem em execução; caso contrário, está desativada.

  Essa variável é afetada pelo valor da variável de sistema `show_compatibility_56`. Para obter detalhes, consulte Efeito de show_compatibility_56 nas variáveis de status do escravo.

  Nota

  Essa variável mostra apenas o status do canal de replicação padrão. Para monitorar qualquer canal de replicação, use a coluna `SERVICE_STATE` nas tabelas `[replication_applier_status]` (performance-schema-replication-applier-status-table.html) ou `[replication_connection_status]` (performance-schema-replication-connection-status-table.html) do canal de replicação. `Slave_running` (server-status-variables.html#statvar_Slave_running) está desatualizado e será removido no MySQL 8.0.

- `Slow_launch_threads`

  O número de threads que levaram mais de `slow_launch_time` segundos para serem criadas.

  Essa variável não tem significado no servidor integrado (`libmysqld`) e, a partir do MySQL 5.7.2, ela não está mais visível no servidor integrado.

- `Slow_queries`

  O número de consultas que levaram mais de `long_query_time` segundos. Esse contador é incrementado independentemente de o registro de consultas lentas estar habilitado. Para obter informações sobre esse registro, consulte Seção 5.4.5, “O Registro de Consultas Lentas”.

- `Sort_merge_passes`

  O número de passes de fusão que o algoritmo de ordenação teve que realizar. Se esse valor for grande, você deve considerar aumentar o valor da variável de sistema `sort_buffer_size`.

- [`Intervalo de classificação`]\(server-status-variables.html#statvar_Intervalo de classificação)

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

  A lista de possíveis cifra SSL (vazia para conexões não SSL).

- `Ssl_client_connects`

  O número de tentativas de conexão SSL para uma fonte habilitada para SSL.

- `Ssl_connect_renegotiates`

  O número de negociações necessárias para estabelecer a conexão com uma fonte habilitada para SSL.

- `Ssl_ctx_verify_depth`

  Profundidade da verificação do contexto SSL (quantos certificados na cadeia são testados).

- `Ssl_ctx_verify_mode`

  O modo de verificação do contexto SSL.

- `Ssl_default_timeout`

  O tempo de espera padrão do SSL.

- `Ssl_finished_accepts`

  O número de conexões SSL bem-sucedidas com o servidor.

- `Ssl_finished_connects`

  Número de conexões de replicação bem-sucedidas a uma fonte habilitada para SSL.

- `Ssl_server_not_after`

  A última data em que o certificado SSL é válido. Para verificar as informações de expiração do certificado SSL, use esta declaração:

  ```sql
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

  O modo de cache de sessão SSL.

- `Ssl_session_cache_overflows`

  O número de transbordamentos de cache de sessão SSL.

- `Ssl_session_cache_size`

  O tamanho do cache de sessão SSL.

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

  ```sql
  # define SSL_VERIFY_NONE                 0x00
  # define SSL_VERIFY_PEER                 0x01
  # define SSL_VERIFY_FAIL_IF_NO_PEER_CERT 0x02
  # define SSL_VERIFY_CLIENT_ONCE          0x04
  ```

  `SSL_VERIFY_PEER` indica que o servidor solicita um certificado do cliente. Se o cliente fornecer um, o servidor realiza a verificação e prossegue apenas se a verificação for bem-sucedida. `SSL_VERIFY_CLIENT_ONCE` indica que um pedido para o certificado do cliente é feito apenas no aperto inicial.

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

  Para a implementação mapeada à memória do log que é usada pelo **mysqld** quando atua como coordenador de transações para a recuperação de transações internas XA, essa variável indica o maior número de páginas usadas para o log desde que o servidor foi iniciado. Se o produto de `Tc_log_max_pages_used` e `Tc_log_page_size` for sempre significativamente menor que o tamanho do log, o tamanho é maior do que o necessário e pode ser reduzido. (O tamanho é definido pela opção `--log-tc-size`. Essa variável não é usada: não é necessária para a recuperação baseada em log binário, e o método de log de recuperação mapeada à memória não é usado, a menos que o número de motores de armazenamento que são capazes de dois estágios de compromisso e que suportam transações XA seja maior que um. (`InnoDB` é o único motor aplicável.)

- `Tc_log_page_size`

  O tamanho da página usado para a implementação mapeada à memória do log de recuperação XA. O valor padrão é determinado usando `getpagesize()`. Esta variável é inutilizada pelas mesmas razões descritas para `Tc_log_max_pages_used`.

- `Tc_log_page_waits`

  Para a implementação mapeada à memória do log de recuperação, essa variável é incrementada sempre que o servidor não conseguiu confirmar uma transação e teve que esperar por uma página livre no log. Se esse valor for grande, você pode querer aumentar o tamanho do log (com a opção `--log-tc-size`). Para a recuperação baseada em log binário, essa variável é incrementada sempre que o log binário não pode ser fechado porque há confirmações de duas fases em andamento. (A operação de fechamento aguarda até que todas essas transações sejam concluídas.)

- `Threads_cached`

  O número de threads na cache de threads.

  Essa variável não tem significado no servidor integrado (`libmysqld`) e, a partir do MySQL 5.7.2, ela não está mais visível no servidor integrado.

- `Threads_connected`

  O número de conexões abertas atualmente.

- `Threads_created`

  O número de threads criados para lidar com as conexões. Se `Threads_created` for grande, você pode querer aumentar o valor de `thread_cache_size`. A taxa de falha de cache pode ser calculada como `Threads_created`/`Connections`.

- `Threads_running`

  O número de threads que não estão dormindo.

- `Tempo de atividade`

  O número de segundos que o servidor está ativo.

- `Uptime_since_flush_status`

  O número de segundos desde a última declaração `FLUSH STATUS`.
