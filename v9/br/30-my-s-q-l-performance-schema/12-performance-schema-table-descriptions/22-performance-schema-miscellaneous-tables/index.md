### 29.12.22 Tabelas Diversas do Schema de Desempenho

29.12.22.1 A tabela `component_scheduler_tasks`

29.12.22.2 A tabela `connection_control_failed_login_attempts`

29.12.22.3 A tabela `error_log`

29.12.22.4 A tabela `host_cache`

29.12.22.5 A tabela `innodb_redo_log_files`

29.12.22.6 A tabela `log_status`

29.12.22.7 A tabela `mysql_option`

29.12.22.8 A tabela `performance_timers`

29.12.22.9 A tabela `processlist`

29.12.22.10 A tabela `threads`

29.12.22.11 A tabela `tls_channel_status`

29.12.22.12 A tabela `user_defined_functions`

As seções a seguir descrevem tabelas que não se enquadram nas categorias de tabelas discutidas nas seções anteriores:

* `component_scheduler_tasks`: O status atual de cada tarefa agendada.

* `connection_control_failed_login_attempts`: O número atual de tentativas de login consecutivas não realizadas por conta.

* `error_log`: Os eventos mais recentes escritos no log de erro.

* `host_cache`: Informações do cache interno do host.

* `innodb_redo_log_files`: Informações sobre os arquivos de log de refazer do InnoDB.

* `log_status`: Informações sobre os logs do servidor para fins de backup.

* `mysql_option`: Informações sobre as funcionalidades disponíveis no MySQL Server.

* `performance_timers`: Quais temporizadores de eventos estão disponíveis.

* `processlist`: Informações sobre os processos do servidor.

* `threads`: Informações sobre os threads do servidor.

* `tls_channel_status`: Propriedades do contexto TLS para interfaces de conexão.

* `user_defined_functions`: Funções carregáveis registradas por um componente, plugin ou declaração `CREATE FUNCTION`.