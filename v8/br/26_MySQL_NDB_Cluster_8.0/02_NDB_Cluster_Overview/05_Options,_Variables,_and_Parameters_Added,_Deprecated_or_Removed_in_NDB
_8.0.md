### 25.2.5 Opções, variáveis e parâmetros adicionados, descontinuados ou removidos no NDB 8.0

- Parâmetros Introduzidos no NDB 8.0
- Parâmetros desatualizados no NDB 8.0
- Parâmetros removidos na NDB 8.0
- Opções e variáveis introduzidas no NDB 8.0
- Opções e variáveis descontinuadas no NDB 8.0
- Opções e variáveis removidas no NDB 8.0

As próximas seções contêm informações sobre os parâmetros de configuração do nó `NDB` e as opções e variáveis específicas do NDB **mysqld** que foram adicionadas, descontinuadas ou removidas do NDB 8.0.

#### Parâmetros Introduzidos no NDB 8.0

Os seguintes parâmetros de configuração de nó foram adicionados no NDB 8.0.

- `AllowUnresolvedHostNames`: Quando false (padrão), o falha do nó de gerenciamento em resolver o nome do host resulta em erro fatal; quando true, os nomes de host não resolvidos são relatados apenas como avisos. Adicionada no NDB 8.0.22.

- `ApiFailureHandlingTimeout`: Tempo máximo para o tratamento de falhas no nó da API antes de escalar. 0 significa sem limite de tempo; o valor mínimo utilizável é 10. Adicionado no NDB 8.0.42.

- `AutomaticThreadConfig`: Use a configuração automática de threads; substitui quaisquer configurações para ThreadConfig e MaxNoOfExecutionThreads e desabilita a ClassicFragmentation. Adicionada no NDB 8.0.23.

- `ClassicFragmentation`: Quando verdadeiro, use a fragmentação tradicional da tabela; defina para falso para habilitar a distribuição flexível dos fragmentos entre os LDMs. Desativado por AutomaticThreadConfig. Adicionada no NDB 8.0.23.

- `DiskDataUsingSameDisk`: Defina para falso se os espaços de dados de disco estiverem localizados em discos físicos separados. Adicionado no NDB 8.0.19.

- `EnableMultithreadedBackup`: Habilitar backup multisserial. Adicionada no NDB 8.0.16.

- `EncryptedFileSystem`: Criptografar arquivos de ponto de verificação e espaço de tabela locais. Adicionado no NDB 8.0.29.

- `KeepAliveSendInterval`: Tempo entre sinais de manutenção de conexão em links entre nós de dados, em milissegundos. Defina para 0 para desativar. Adicionado no NDB 8.0.27.

- `MaxDiskDataLatency`: Latência média máxima permitida de acesso ao disco (ms) antes de começar a abortar transações. Adicionada no NDB 8.0.19.

- `NodeGroupTransporters`: Número de transportadores a serem usados entre nós no mesmo grupo de nós. Adicionado no NDB 8.0.20.

- `NumCPUs`: Especifique o número de CPUs a serem usadas com AutomaticThreadConfig. Adicionada no NDB 8.0.23.

- `PartitionsPerNode`: Determina o número de partições de tabela criadas em cada nó de dados; não é usado se a fragmentação clássica estiver habilitada. Adicionada no NDB 8.0.23.

- `PreferIPVersion`: Indique a preferência do resolutor DNS para a versão 4 ou 6 do IP. Adicionada no NDB 8.0.26.

- `RequireEncryptedBackup`: Se os backups devem ser criptografados (1 = criptografia necessária, caso contrário 0). Adicionada no NDB 8.0.22.

- `ReservedConcurrentIndexOperations`: Número de operações de índice simultâneas com recursos dedicados em um nó de dados. Adicionado no NDB 8.0.16.

- `ReservedConcurrentOperations`: Número de operações simultâneas com recursos dedicados nos coordenadores de transação em um nó de dados. Adicionado no NDB 8.0.16.

- `ReservedConcurrentScans`: Número de varreduras simultâneas com recursos dedicados em um nó de dados. Adicionado no NDB 8.0.16.

- `ReservedConcurrentTransactions`: Número de transações simultâneas com recursos dedicados em um nó de dados. Adicionado no NDB 8.0.16.

- `ReservedFiredTriggers`: Número de gatilhos com recursos dedicados em um nó de dados. Adicionado no NDB 8.0.16.

- `ReservedLocalScans`: Número de varreduras de fragmentos simultâneas com recursos dedicados em um nó de dados. Adicionado no NDB 8.0.16.

- `ReservedTransactionBufferMemory`: Espaço de buffer dinâmico (em bytes) para os dados de chave e atributo alocados a cada nó de dados. Adicionado no NDB 8.0.16.

- `SpinMethod`: Determina o método de rotação usado pelo nó de dados; consulte a documentação para obter detalhes. Adicionado no NDB 8.0.20.

- `TcpSpinTime`: Tempo para girar antes de dormir ao receber. Adicionado no NDB 8.0.20.

- `TransactionMemory`: Memória alocada para transações em cada nó de dados. Adicionada no NDB 8.0.19.

#### Parâmetros desatualizados no NDB 8.0

Os seguintes parâmetros de configuração de nó foram descontinuados no NDB 8.0.

- `BatchSizePerLocalScan`: Usado para calcular o número de registros de bloqueio para varredura com bloqueio de retenção. Desatualizado no NDB 8.0.19.

- `MaxAllocate`: Não é mais usado; não tem efeito. Desatualizado na NDB 8.0.27.

- `MaxNoOfConcurrentIndexOperations`: Número total de operações de índice que podem ser executadas simultaneamente em um nó de dados. Desatualizado no NDB 8.0.19.

- `MaxNoOfConcurrentTransactions`: Número máximo de transações executadas simultaneamente neste nó de dados. O número total de transações que podem ser executadas simultaneamente é este valor vezes o número de nós de dados no clúster. Desatualizado no NDB 8.0.19.

- `MaxNoOfFiredTriggers`: Número total de gatilhos que podem ser acionados simultaneamente em um nó de dados. Desatualizado no NDB 8.0.19.

- `MaxNoOfLocalOperations`: Número máximo de registros de operação definidos neste nó de dados. Desatualizado no NDB 8.0.19.

- `MaxNoOfLocalScans`: Número máximo de varreduras de fragmentos em paralelo neste nó de dados. Desatualizado no NDB 8.0.19.

- `ReservedTransactionBufferMemory`: Espaço de buffer dinâmico (em bytes) para os dados de chave e atributo alocados a cada nó de dados. Desatualizado no NDB 8.0.19.

- `UndoDataBuffer`: Não utilizado; sem efeito. Desatualizado na NDB 8.0.27.

- `UndoIndexBuffer`: Não utilizado; sem efeito. Desatualizado na NDB 8.0.27.

#### Parâmetros removidos na NDB 8.0

Nenhum parâmetro de configuração de nó foi removido no NDB 8.0.

#### Opções e variáveis introduzidas no NDB 8.0

As seguintes variáveis de sistema, variáveis de status e opções de servidor foram adicionadas no NDB 8.0.

- `Ndb_api_adaptive_send_deferred_count_replica`: Número de chamadas de envio adaptativas que não foram realmente enviadas por esta réplica. Adicionada no NDB 8.0.23-ndb-8.0.23.

- `Ndb_api_adaptive_send_forced_count_replica`: Número de envios adaptativos com o envio forçado configurado enviados por esta réplica. Adicionado no NDB 8.0.23-ndb-8.0.23.

- `Ndb_api_adaptive_send_unforced_count_replica`: Número de envios adaptativos sem envios forçados enviados por esta réplica. Adicionado no NDB 8.0.23-ndb-8.0.23.

- `Ndb_api_bytes_received_count_replica`: Quantidade de dados (em bytes) recebidos de nós de dados por esta replica. Adicionada no NDB 8.0.23-ndb-8.0.23.

- `Ndb_api_bytes_sent_count_replica`: Quantidade de dados (em bytes) enviados para os nós de dados por esta replica. Adicionada no NDB 8.0.23-ndb-8.0.23.

- `Ndb_api_pk_op_count_replica`: Número de operações baseadas em ou que utilizam chaves primárias por esta réplica. Adicionado no NDB 8.0.23-ndb-8.0.23.

- `Ndb_api_pruned_scan_count_replica`: Número de varreduras que foram reduzidas a uma partição por esta réplica. Adicionada no NDB 8.0.23-ndb-8.0.23.

- `Ndb_api_range_scan_count_replica`: Número de varreduras de intervalo iniciadas por esta réplica. Adicionada no NDB 8.0.23-ndb-8.0.23.

- `Ndb_api_read_row_count_replica`: Número total de linhas que foram lidas por esta réplica. Adicionada no NDB 8.0.23-ndb-8.0.23.

- `Ndb_api_scan_batch_count_replica`: Número de lotes de linhas recebidos por esta replica. Adicionado no NDB 8.0.23-ndb-8.0.23.

- `Ndb_api_table_scan_count_replica`: Número de varreduras de tabela que foram iniciadas, incluindo varreduras de tabelas internas, por esta réplica. Adicionado no NDB 8.0.23-ndb-8.0.23.

- `Ndb_api_trans_abort_count_replica`: Número de transações abortadas por esta réplica. Adicionada no NDB 8.0.23-ndb-8.0.23.

- `Ndb_api_trans_close_count_replica`: Número de transações abortadas (pode ser maior que a soma de TransCommitCount e TransAbortCount) por esta réplica. Adicionada no NDB 8.0.23-ndb-8.0.23.

- `Ndb_api_trans_commit_count_replica`: Número de transações realizadas por esta réplica. Adicionada no NDB 8.0.23-ndb-8.0.23.

- `Ndb_api_trans_local_read_row_count_replica`: Número total de linhas que foram lidas por esta réplica. Adicionada no NDB 8.0.23-ndb-8.0.23.

- `Ndb_api_trans_start_count_replica`: Número de transações iniciadas por esta réplica. Adicionada no NDB 8.0.23-ndb-8.0.23.

- `Ndb_api_uk_op_count_replica`: Número de operações baseadas em ou que utilizam chaves únicas por esta réplica. Adicionado no NDB 8.0.23-ndb-8.0.23.

- `Ndb_api_wait_exec_complete_count_replica`: Número de vezes que o fio foi bloqueado enquanto esperava pela conclusão da execução da operação por esta réplica. Adicionado no NDB 8.0.23-ndb-8.0.23.

- `Ndb_api_wait_meta_request_count_replica`: Número de vezes que o fio foi bloqueado esperando por um sinal baseado em metadados por esta replica. Adicionado no NDB 8.0.23-ndb-8.0.23.

- `Ndb_api_wait_nanos_count_replica`: Tempo total (em nanosegundos) gasto esperando por algum tipo de sinal dos nós de dados por esta réplica. Adicionado no NDB 8.0.23-ndb-8.0.23.

- `Ndb_api_wait_scan_result_count_replica`: Número de vezes que o fio foi bloqueado enquanto aguardava por um sinal baseado em varredura por esta réplica. Adicionado no NDB 8.0.23-ndb-8.0.23.

- `Ndb_config_generation`: Número de geração da configuração atual do clúster. Adicionada no NDB 8.0.24-ndb-8.0.24.

- `Ndb_conflict_fn_max_del_win_ins`: Número de vezes que a resolução de conflitos de replicação NDB com base no resultado de NDB$MAX\_DEL\_WIN\_INS() foi aplicada às operações de inserção. Adicionada no NDB 8.0.30-ndb-8.0.30.

- `Ndb_conflict_fn_max_ins`: Número de vezes que a resolução de conflitos de replicação NDB com base na regra "o timestamp maior vence" foi aplicada em operações de inserção. Adicionada no NDB 8.0.30-ndb-8.0.30.

- `Ndb_fetch_table_stats`: Número de vezes que as estatísticas da tabela foram obtidas das tabelas em vez do cache. Adicionado no NDB 8.0.27-ndb-8.0.27.

- `Ndb_metadata_blacklist_size`: Número de objetos de metadados NDB que o NDB binlog thread não conseguiu sincronizar; renomeado no NDB 8.0.22 como Ndb\_metadata\_excluded\_count. Adicionado no NDB 8.0.18-ndb-8.0.18.

- `Ndb_metadata_detected_count`: Número de vezes que o monitor de alterações de metadados do NDB detectou alterações. Adicionado no NDB 8.0.16-ndb-8.0.16.

- `Ndb_metadata_excluded_count`: Número de objetos de metadados NDB que o NDB binlog thread não conseguiu sincronizar. Adicionado no NDB 8.0.18-ndb-8.0.22.

- `Ndb_metadata_synced_count`: Número de objetos de metadados do NDB que foram sincronizados. Adicionado no NDB 8.0.18-ndb-8.0.18.

- `Ndb_trans_hint_count_session`: Número de transações que utilizam dicas que foram iniciadas nesta sessão. Adicionado no NDB 8.0.17-ndb-8.0.17.

- `ndb-applier-allow-skip-epoch`: Permite que o aplicativo de replicação pule épocas. Adicionado no NDB 8.0.28-ndb-8.0.28.

- `ndb-log-fail-terminate`: Finalize o processo mysqld se a registro completo de todos os eventos das linhas encontradas não for possível. Adicionada no NDB 8.0.21-ndb-8.0.21.

- `ndb-log-transaction-dependency`: Faça com que o thread de log binário calcule as dependências das transações para cada transação que escreva no log binário. Adicionado no NDB 8.0.33-ndb-8.0.33.

- `ndb-schema-dist-timeout`: Quanto tempo esperar antes de detectar o tempo limite durante a distribuição do esquema. Adicionado no NDB 8.0.17-ndb-8.0.17.

- `ndb_conflict_role`: Papel que a replica deve desempenhar na detecção e resolução de conflitos. O valor é um dos valores PRIMARY, SECONDARY, PASS ou NONE (padrão). Pode ser alterado apenas quando o thread de SQL de replicação é interrompido. Consulte a documentação para obter mais informações. Adicionada no NDB 8.0.23-ndb-8.0.23.

- `ndb_dbg_check_shares`: Verifique se há ações persistentes (apenas builds de depuração). Adicionada no NDB 8.0.13-ndb-8.0.13.

- `ndb_log_transaction_compression`: Se comprimir o log binário do NDB; também pode ser habilitado ao iniciar, habilitando a opção --binlog-transaction-compression. Adicionada no NDB 8.0.31-ndb-8.0.31.

- `ndb_log_transaction_compression_level_zstd`: O nível de compressão ZSTD a ser usado ao gravar transações comprimidas no log binário NDB. Adicionado no NDB 8.0.31-ndb-8.0.31.

- `ndb_metadata_check`: Ative a detecção automática de alterações nos metadados do NDB em relação ao dicionário de dados do MySQL; ativado por padrão. Adicionado no NDB 8.0.16-ndb-8.0.16.

- `ndb_metadata_check_interval`: Intervalo em segundos para realizar a verificação de alterações nos metadados do NDB em relação ao dicionário de dados do MySQL. Adicionado no NDB 8.0.16-ndb-8.0.16.

- `ndb_metadata_sync`: Desenha a sincronização imediata de todas as alterações entre o dicionário NDB e o dicionário de dados MySQL; faz com que os valores ndb\_metadata\_check e ndb\_metadata\_check\_interval sejam ignorados. Redefine para false quando a sincronização estiver completa. Adicionada no NDB 8.0.19-ndb-8.0.19.

- `ndb_replica_batch_size`: Tamanho do lote em bytes para o aplicativo de replicação. Adicionado no NDB 8.0.30-ndb-8.0.30.

- `ndb_schema_dist_lock_wait_timeout`: Tempo durante a distribuição do esquema para esperar por bloqueio antes de retornar o erro. Adicionado no NDB 8.0.18-ndb-8.0.18.

- `ndb_schema_dist_timeout`: Tempo de espera antes de detectar o tempo limite durante a distribuição do esquema. Adicionado no NDB 8.0.16-ndb-8.0.16.

- `ndb_schema_dist_upgrade_allowed`: Permitir a atualização da tabela de distribuição do esquema ao se conectar ao NDB. Adicionada no NDB 8.0.17-ndb-8.0.17.

- `ndbinfo`: Habilitar o plugin ndbinfo, se suportado. Adicionado no NDB 8.0.13-ndb-8.0.13.

- `replica_allow_batching`: Ativa e desativa a batchização de atualizações para replica. Adicionada no NDB 8.0.26-ndb-8.0.26.

#### Opções e variáveis descontinuadas no NDB 8.0

As seguintes variáveis de sistema, variáveis de status e opções foram descontinuadas no NDB 8.0.

- `Ndb_api_adaptive_send_deferred_count_slave`: Número de chamadas de envio adaptativas que não foram realmente enviadas por esta réplica. Desatualizado no NDB 8.0.23-ndb-8.0.23.

- `Ndb_api_adaptive_send_forced_count_slave`: Número de envios adaptativos com o envio forçado definido por esta réplica. Desatualizado no NDB 8.0.23-ndb-8.0.23.

- `Ndb_api_adaptive_send_unforced_count_slave`: Número de envios adaptativos sem envios forçados enviados por esta réplica. Desatualizado no NDB 8.0.23-ndb-8.0.23.

- `Ndb_api_bytes_received_count_slave`: Quantidade de dados (em bytes) recebidos de nós de dados por esta replica. Desatualizado no NDB 8.0.23-ndb-8.0.23.

- `Ndb_api_bytes_sent_count_slave`: Quantidade de dados (em bytes) enviados para os nós de dados por esta replica. Desatualizado no NDB 8.0.23-ndb-8.0.23.

- `Ndb_api_pk_op_count_slave`: Número de operações baseadas em ou que utilizam chaves primárias por esta réplica. Desatualizado no NDB 8.0.23-ndb-8.0.23.

- `Ndb_api_pruned_scan_count_slave`: Número de varreduras que foram reduzidas a uma partição por esta réplica. Desatualizado no NDB 8.0.23-ndb-8.0.23.

- `Ndb_api_range_scan_count_slave`: Número de varreduras de intervalo iniciadas por esta réplica. Desatualizado no NDB 8.0.23-ndb-8.0.23.

- `Ndb_api_read_row_count_slave`: Número total de linhas que foram lidas por esta réplica. Desatualizado no NDB 8.0.23-ndb-8.0.23.

- `Ndb_api_scan_batch_count_slave`: Número de lotes de linhas recebidos por esta replica. Desatualizado no NDB 8.0.23-ndb-8.0.23.

- `Ndb_api_table_scan_count_slave`: Número de varreduras de tabela que foram iniciadas, incluindo varreduras de tabelas internas, por esta réplica. Desatualizado no NDB 8.0.23-ndb-8.0.23.

- `Ndb_api_trans_abort_count_slave`: Número de transações abortadas por esta réplica. Desatualizado no NDB 8.0.23-ndb-8.0.23.

- `Ndb_api_trans_close_count_slave`: Número de transações abortadas (pode ser maior que a soma de TransCommitCount e TransAbortCount) por esta réplica. Desatualizado no NDB 8.0.23-ndb-8.0.23.

- `Ndb_api_trans_commit_count_slave`: Número de transações realizadas por esta réplica. Desatualizado no NDB 8.0.23-ndb-8.0.23.

- `Ndb_api_trans_local_read_row_count_slave`: Número total de linhas que foram lidas por esta réplica. Desatualizado no NDB 8.0.23-ndb-8.0.23.

- `Ndb_api_trans_start_count_slave`: Número de transações iniciadas por esta réplica. Desatualizado no NDB 8.0.23-ndb-8.0.23.

- `Ndb_api_uk_op_count_slave`: Número de operações baseadas em ou que utilizam chaves únicas por esta réplica. Desatualizado no NDB 8.0.23-ndb-8.0.23.

- `Ndb_api_wait_exec_complete_count_slave`: Número de vezes que o fio foi bloqueado enquanto aguardava a conclusão da execução da operação por esta réplica. Desatualizado no NDB 8.0.23-ndb-8.0.23.

- `Ndb_api_wait_meta_request_count_slave`: Número de vezes que o fio foi bloqueado esperando por um sinal baseado em metadados por esta replica. Desatualizado no NDB 8.0.23-ndb-8.0.23.

- `Ndb_api_wait_nanos_count_slave`: Tempo total (em nanosegundos) gasto esperando por algum tipo de sinal dos nós de dados por esta réplica. Desatualizado no NDB 8.0.23-ndb-8.0.23.

- `Ndb_api_wait_scan_result_count_slave`: Número de vezes que o fio foi bloqueado enquanto aguardava por um sinal baseado em varredura por esta réplica. Desatualizado no NDB 8.0.23-ndb-8.0.23.

- `Ndb_metadata_blacklist_size`: Número de objetos de metadados NDB que o NDB binlog thread não conseguiu sincronizar; renomeado no NDB 8.0.22 como Ndb\_metadata\_excluded\_count. Desatualizado no NDB 8.0.21-ndb-8.0.21.

- `Ndb_replica_max_replicated_epoch`: Época mais recentemente comprometida do NDB nesta replica. Quando esse valor for maior ou igual à última época de conflito Ndb\_conflict\_last\_conflict\_epoch, nenhum conflito ainda foi detectado. Desatualizado no NDB 8.0.23-ndb-8.0.23.

- `ndb_slave_conflict_role`: Papel que a replica deve desempenhar na detecção e resolução de conflitos. O valor é um dos valores PRIMARY, SECONDARY, PASS ou NONE (padrão). Pode ser alterado apenas quando o thread de SQL de replicação é interrompido. Consulte a documentação para obter mais informações. Desatualizado no NDB 8.0.23-ndb-8.0.23.

- `slave_allow_batching`: Ativa e desativa a batchização de atualizações para replica. Desatualizado no NDB 8.0.26-ndb-8.0.26.

#### Opções e variáveis removidas no NDB 8.0

As seguintes variáveis de sistema, variáveis de status e opções foram removidas no NDB 8.0.

- `Ndb_metadata_blacklist_size`: Número de objetos de metadados do NDB que o thread do binlog do NDB não conseguiu sincronizar; renomeado no NDB 8.0.22 como Ndb\_metadata\_excluded\_count. Removido no NDB 8.0.22-ndb-8.0.22.
