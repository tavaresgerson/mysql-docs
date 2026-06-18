### 29.12.21 Tabelas Diversas do Schema de Desempenho

29.12.21.1 A tabela component\_scheduler\_tasks

29.12.21.2 A tabela error\_log

29.12.21.3 A tabela host\_cache

29.12.21.4 A tabela innodb\_redo\_log\_files

29.12.21.5 A tabela log\_status

29.12.21.6 A tabela performance\_timers

29.12.21.7 A tabela processlist

29.12.21.8 A tabela de fios

29.12.21.9 A tabela tls\_channel\_status

29.12.21.10 A tabela user\_defined\_functions

As seções a seguir descrevem tabelas que não se enquadram nas categorias de tabelas discutidas nas seções anteriores:

- `component_scheduler_tasks`: O status atual de cada tarefa agendada.

- `error_log`: Os eventos mais recentes registrados no log de erro.

- `host_cache`: Informações do cache do host interno.

- `innodb_redo_log_files`: Informações sobre os arquivos de registro de refazer do InnoDB.

- `log_status`: Informações sobre os registros do servidor para fins de backup.

- `performance_timers`: Quais são os temporizadores de evento disponíveis.

- `processlist`: Informações sobre os processos do servidor.

- `threads`: Informações sobre os threads do servidor.

- `tls_channel_status`: Propriedades do contexto TLS para interfaces de conexão.

- `user_defined_functions`: Funções carregáveis registradas por um componente, plugin ou declaração `CREATE FUNCTION`.
