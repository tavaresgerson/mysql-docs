## 5.4 Logs do Servidor MySQL

[5.4.1 Selecionando Destinos de Saída para o General Query Log e Slow Query Log](log-destinations.html)

[5.4.2 O Error Log](error-log.html)

[5.4.3 O General Query Log](query-log.html)

[5.4.4 O Binary Log](binary-log.html)

[5.4.5 O Slow Query Log](slow-query-log.html)

[5.4.6 O DDL Log](ddl-log.html)

[5.4.7 Manutenção dos Logs do Servidor](log-file-maintenance.html)

O Servidor MySQL possui vários logs que podem ajudá-lo a descobrir qual atividade está ocorrendo.

| Tipo de Log | Informações Escritas no Log |
| :--- | :--- |
| Error log | Problemas encontrados ao iniciar, executar ou parar o **mysqld** |
| General query log | Conexões de cliente estabelecidas e statements (declarações) recebidas dos clientes |
| Binary log | Statements que alteram dados (também usado para replication) |
| Relay log | Alterações de dados recebidas de um servidor source de replication |
| Slow query log | Queries que levaram mais de `long_query_time` segundos para serem executadas |
| DDL log (log de metadados) | Operações de metadados realizadas por statements DDL |

Por padrão, nenhum log é ativado, exceto o error log no Windows. (O DDL log é sempre criado quando necessário, e não possui opções configuráveis pelo usuário; consulte [Seção 5.4.6, “O DDL Log”](ddl-log.html "5.4.6 The DDL Log").) As seções específicas de log a seguir fornecem informações sobre as opções do servidor que ativam o logging.

Por padrão, o servidor grava arquivos para todos os logs ativados no data directory. Você pode forçar o servidor a fechar e reabrir os arquivos de log (ou, em alguns casos, mudar para um novo arquivo de log) realizando o flushing dos logs. O flushing do log ocorre quando você executa um statement [`FLUSH LOGS`](flush.html#flush-logs); executa o [**mysqladmin**](mysqladmin.html "4.5.2 mysqladmin — Um Programa de Administração do Servidor MySQL") com um argumento `flush-logs` ou `refresh`; ou executa o [**mysqldump**](mysqldump.html "4.5.4 mysqldump — Um Programa de Backup de Database") com a opção [`--flush-logs`](mysqldump.html#option_mysqldump_flush-logs). Consulte [Seção 13.7.6.3, “FLUSH Statement”](flush.html "13.7.6.3 FLUSH Statement"), [Seção 4.5.2, “mysqladmin — Um Programa de Administração do Servidor MySQL”](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program") e [Seção 4.5.4, “mysqldump — Um Programa de Backup de Database”](mysqldump.html "4.5.4 mysqldump — A Database Backup Program"). Além disso, o binary log é feito o flush quando seu tamanho atinge o valor da variável de sistema [`max_binlog_size`](replication-options-binary-log.html#sysvar_max_binlog_size).

Você pode controlar o general query log e o slow query log durante o runtime. Você pode ativar ou desativar o logging, ou alterar o nome do arquivo de log. Você pode instruir o servidor a gravar entradas do general query e slow query em log tables, log files, ou ambos. Para detalhes, consulte [Seção 5.4.1, “Selecionando Destinos de Saída para o General Query Log e Slow Query Log”](log-destinations.html "5.4.1 Selecting General Query Log and Slow Query Log Output Destinations"), [Seção 5.4.3, “O General Query Log”](query-log.html "5.4.3 The General Query Log") e [Seção 5.4.5, “O Slow Query Log”](slow-query-log.html "5.4.5 The Slow Query Log").

O relay log é usado apenas em replicas, para armazenar alterações de dados provenientes do servidor source de replication que também devem ser aplicadas na replica. Para discussão sobre o conteúdo e configuração do relay log, consulte [Seção 16.2.4.1, “O Relay Log”](replica-logs-relaylog.html "16.2.4.1 The Relay Log").

Para informações sobre operações de manutenção de log, como a expiração de arquivos de log antigos, consulte [Seção 5.4.7, “Manutenção dos Logs do Servidor”](log-file-maintenance.html "5.4.7 Server Log Maintenance").

Para informações sobre como manter os logs seguros, consulte [Seção 6.1.2.3, “Senhas e Logging”](password-logging.html "6.1.2.3 Passwords and Logging").