### 26.4.1 Índice de Objetos do Schema sys

As tabelas a seguir listam os objetos do schema `sys` e fornecem uma breve descrição de cada um.

**Tabela 26.1 Tabelas e Triggers do Schema sys**

| Nome da Tabela ou Trigger | Descrição |
| :--- | :--- |
| `sys_config` | Tabela de opções de configuração do schema sys |
| `sys_config_insert_set_user` | Trigger de INSERT para `sys_config` |
| `sys_config_update_set_user` | Trigger de UPDATE para `sys_config` |

**Tabela 26.2 Views do Schema sys**

| Nome da View | Descrição | Descontinuado |
| :--- | :--- | :--- |
| `host_summary`, `x$host_summary` | Atividade de Statement, I/O de arquivo e conexões, agrupadas por host | |
| `host_summary_by_file_io`, `x$host_summary_by_file_io` | I/O de arquivo, agrupadas por host | |
| `host_summary_by_file_io_type`, `x$host_summary_by_file_io_type` | I/O de arquivo, agrupadas por host e tipo de evento | |
| `host_summary_by_stages`, `x$host_summary_by_stages` | Estágios de Statement, agrupados por host | |
| `host_summary_by_statement_latency`, `x$host_summary_by_statement_latency` | Estatísticas de Statement, agrupadas por host | |
| `host_summary_by_statement_type`, `x$host_summary_by_statement_type` | Statements executados, agrupados por host e Statement | |
| `innodb_buffer_stats_by_schema`, `x$innodb_buffer_stats_by_schema` | Informações do Buffer Pool do InnoDB, agrupadas por schema | |
| `innodb_buffer_stats_by_table`, `x$innodb_buffer_stats_by_table` | Informações do Buffer Pool do InnoDB, agrupadas por schema e table | |
| `innodb_lock_waits`, `x$innodb_lock_waits` | Informações de Lock do InnoDB | |
| `io_by_thread_by_latency`, `x$io_by_thread_by_latency` | Consumidores de I/O, agrupados por Thread | |
| `io_global_by_file_by_bytes`, `x$io_global_by_file_by_bytes` | Consumidores globais de I/O, agrupados por arquivo e bytes | |
| `io_global_by_file_by_latency`, `x$io_global_by_file_by_latency` | Consumidores globais de I/O, agrupados por arquivo e latência | |
| `io_global_by_wait_by_bytes`, `x$io_global_by_wait_by_bytes` | Consumidores globais de I/O, agrupados por bytes | |
| `io_global_by_wait_by_latency`, `x$io_global_by_wait_by_latency` | Consumidores globais de I/O, agrupados por latência | |
| `latest_file_io`, `x$latest_file_io` | I/O mais recente, agrupado por arquivo e Thread | |
| `memory_by_host_by_current_bytes`, `x$memory_by_host_by_current_bytes` | Uso de memória, agrupado por host | |
| `memory_by_thread_by_current_bytes`, `x$memory_by_thread_by_current_bytes` | Uso de memória, agrupado por Thread | |
| `memory_by_user_by_current_bytes`, `x$memory_by_user_by_current_bytes` | Uso de memória, agrupado por user | |
| `memory_global_by_current_bytes`, `x$memory_global_by_current_bytes` | Uso de memória, agrupado por tipo de alocação | |
| `memory_global_total`, `x$memory_global_total` | Uso total de memória | |
| `metrics` | Métricas do servidor | |
| `processlist`, `x$processlist` | Informações do Processlist | |
| `ps_check_lost_instrumentation` | Variáveis que perderam instrumentos | |
| `schema_auto_increment_columns` | Informações de colunas AUTO_INCREMENT | |
| `schema_index_statistics`, `x$schema_index_statistics` | Estatísticas de Index | |
| `schema_object_overview` | Tipos de objetos dentro de cada schema | |
| `schema_redundant_indexes` | Indexes duplicados ou redundantes | |
| `schema_table_lock_waits`, `x$schema_table_lock_waits` | Sessões esperando por Locks de metadados | |
| `schema_table_statistics`, `x$schema_table_statistics` | Estatísticas de Table | |
| `schema_table_statistics_with_buffer`, `x$schema_table_statistics_with_buffer` | Estatísticas de Table, incluindo estatísticas do Buffer Pool do InnoDB | |
| `schema_tables_with_full_table_scans`, `x$schema_tables_with_full_table_scans` | Tables sendo acessadas com full scans | |
| `schema_unused_indexes` | Indexes não utilizados ativamente | |
| `session`, `x$session` | Informações do Processlist para sessões de user | |
| `session_ssl_status` | Informações SSL da conexão | |
| `statement_analysis`, `x$statement_analysis` | Estatísticas agregadas de Statement | |
| `statements_with_errors_or_warnings`, `x$statements_with_errors_or_warnings` | Statements que produziram erros ou warnings | |
| `statements_with_full_table_scans`, `x$statements_with_full_table_scans` | Statements que realizaram full table scans | |
| `statements_with_runtimes_in_95th_percentile`, `x$statements_with_runtimes_in_95th_percentile` | Statements com o maior tempo médio de execução | |
| `statements_with_sorting`, `x$statements_with_sorting` | Statements que realizaram ordenações (sorts) | |
| `statements_with_temp_tables`, `x$statements_with_temp_tables` | Statements que usaram temporary tables | |
| `user_summary`, `x$user_summary` | Atividade de Statement e conexão do user | |
| `user_summary_by_file_io`, `x$user_summary_by_file_io` | I/O de arquivo, agrupadas por user | |
| `user_summary_by_file_io_type`, `x$user_summary_by_file_io_type` | I/O de arquivo, agrupadas por user e evento | |
| `user_summary_by_stages`, `x$user_summary_by_stages` | Eventos de estágio, agrupados por user | |
| `user_summary_by_statement_latency`, `x$user_summary_by_statement_latency` | Estatísticas de Statement, agrupadas por user | |
| `user_summary_by_statement_type`, `x$user_summary_by_statement_type` | Statements executados, agrupados por user e Statement | |
| `version` | Versões atuais do schema sys e do servidor MySQL | 5.7.28 |
| `wait_classes_global_by_avg_latency`, `x$wait_classes_global_by_avg_latency` | Latência média de Wait class, agrupada por classe de evento | |
| `wait_classes_global_by_latency`, `x$wait_classes_global_by_latency` | Latência total de Wait class, agrupada por classe de evento | |
| `waits_by_host_by_latency`, `x$waits_by_host_by_latency` | Eventos de Wait, agrupados por host e evento | |
| `waits_by_user_by_latency`, `x$waits_by_user_by_latency` | Eventos de Wait, agrupados por user e evento | |
| `waits_global_by_latency`, `x$waits_global_by_latency` | Eventos de Wait, agrupados por evento | |
| `x$ps_digest_95th_percentile_by_avg_us` | View auxiliar para views de percentil 95 | |
| `x$ps_digest_avg_latency_distribution` | View auxiliar para views de percentil 95 | |
| `x$ps_schema_table_statistics_io` | View auxiliar para views de estatísticas de table | |
| `x$schema_flattened_keys` | View auxiliar para `schema_redundant_indexes` | |

**Tabela 26.3 Stored Procedures do Schema sys**

| Nome da Procedure | Descrição |
| :--- | :--- |
| `create_synonym_db()` | Cria sinônimo para schema |
| `diagnostics()` | Coleta informações de diagnóstico do sistema |
| `execute_prepared_stmt()` | Executa Statement preparado |
| `ps_setup_disable_background_threads()` | Desabilita a instrumentação de Threads em segundo plano |
| `ps_setup_disable_consumer()` | Desabilita consumers |
| `ps_setup_disable_instrument()` | Desabilita instruments |
| `ps_setup_disable_thread()` | Desabilita a instrumentação para Thread |
| `ps_setup_enable_background_threads()` | Habilita a instrumentação de Threads em segundo plano |
| `ps_setup_enable_consumer()` | Habilita consumers |
| `ps_setup_enable_instrument()` | Habilita instruments |
| `ps_setup_enable_thread()` | Habilita a instrumentação para Thread |
| `ps_setup_reload_saved()` | Recarrega a configuração salva do Performance Schema |
| `ps_setup_reset_to_default()` | Reseta a configuração salva do Performance Schema para o padrão |
| `ps_setup_save()` | Salva a configuração do Performance Schema |
| `ps_setup_show_disabled()` | Exibe a configuração desabilitada do Performance Schema |
| `ps_setup_show_disabled_consumers()` | Exibe os consumers desabilitados do Performance Schema |
| `ps_setup_show_disabled_instruments()` | Exibe os instruments desabilitados do Performance Schema |
| `ps_setup_show_enabled()` | Exibe a configuração habilitada do Performance Schema |
| `ps_setup_show_enabled_consumers()` | Exibe os consumers habilitados do Performance Schema |
| `ps_setup_show_enabled_instruments()` | Exibe os instruments habilitados do Performance Schema |
| `ps_statement_avg_latency_histogram()` | Exibe o histograma de latência média de Statement |
| `ps_trace_statement_digest()` | Rastreia a instrumentação do Performance Schema para digest |
| `ps_trace_thread()` | Despeja dados do Performance Schema para Thread |
| `ps_truncate_all_tables()` | Trunca tabelas de resumo do Performance Schema |
| `statement_performance_analyzer()` | Relatório de Statements em execução no servidor |
| `table_exists()` | Verifica se uma table existe |

**Tabela 26.4 Stored Functions do Schema sys**

| Nome da Function | Descrição | Introduzido |
| :--- | :--- | :--- |
| `extract_schema_from_file_name()` | Extrai a parte do nome do schema do nome do arquivo | |
| `extract_table_from_file_name()` | Extrai a parte do nome da table do nome do arquivo | |
| `format_bytes()` | Converte contagem de bytes para valor com unidades | |
| `format_path()` | Substitui diretórios no nome do path por nomes de variáveis de sistema simbólicas | |
| `format_statement()` | Trunca Statement longo para um comprimento fixo | |
| `format_time()` | Converte tempo em picossegundos para valor com unidades | |
| `list_add()` | Adiciona item à lista | |
| `list_drop()` | Remove item da lista | |
| `ps_is_account_enabled()` | Verifica se a instrumentação do Performance Schema para a conta está habilitada | |
| `ps_is_consumer_enabled()` | Verifica se o consumer do Performance Schema está habilitado | |
| `ps_is_instrument_default_enabled()` | Verifica se o instrument do Performance Schema está habilitado por padrão | |
| `ps_is_instrument_default_timed()` | Verifica se o instrument do Performance Schema está temporizado por padrão | |
| `ps_is_thread_instrumented()` | Verifica se a instrumentação do Performance Schema para o ID da conexão está habilitada | |
| `ps_thread_account()` | Conta associada ao ID da Thread do Performance Schema | |
| `ps_thread_id()` | ID da Thread do Performance Schema associado ao ID da conexão | |
| `ps_thread_stack()` | Informações do evento para o ID da conexão | |
| `ps_thread_trx_info()` | Informações da Transaction para o ID da Thread | |
| `quote_identifier()` | Coloca string entre aspas como Identifier | 5.7.14 |
| `sys_get_config()` | Valor da opção de configuração do schema sys | |
| `version_major()` | Número da versão major do servidor MySQL | |
| `version_minor()` | Número da versão minor do servidor MySQL | |
| `version_patch()` | Número da versão de patch release do servidor MySQL | |