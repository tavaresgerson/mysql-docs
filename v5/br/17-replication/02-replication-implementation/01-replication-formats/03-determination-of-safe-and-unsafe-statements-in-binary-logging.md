#### 16.2.1.3 Determinação de Statements Seguros e Não Seguros no Binary Logging

A “segurança” (safeness) de um Statement no MySQL Replication refere-se à capacidade de o Statement e seus efeitos serem replicados corretamente usando o formato baseado em Statement (statement-based format). Se isso for verdadeiro, referimo-nos ao Statement como seguro (safe); caso contrário, referimo-nos a ele como não seguro (unsafe).

Em geral, um Statement é seguro se for determinístico e não seguro se não for. No entanto, certas funções não determinísticas *não* são consideradas não seguras (veja [Funções não determinísticas não consideradas não seguras](replication-rbr-safe-unsafe.html#replication-rbr-safe-unsafe-not "Nondeterministic functions not considered unsafe"), posteriormente nesta seção). Além disso, Statements que utilizam resultados de funções matemáticas de ponto flutuante (floating-point)—que dependem de hardware—são sempre considerados não seguros (veja [Seção 16.4.1.12, “Replication e Valores de Ponto Flutuante”](replication-features-floatvalues.html "16.4.1.12 Replication and Floating-Point Values")).

**Manuseio de Statements seguros e não seguros.** Um Statement é tratado de forma diferente dependendo se é considerado seguro e em relação ao formato de Binary Logging (ou seja, o valor atual de [`binlog_format`](replication-options-binary-log.html#sysvar_binlog_format)).

* Quando usando logging baseado em Row (row-based logging), nenhuma distinção é feita no tratamento de Statements seguros e não seguros.

* Quando usando logging de formato misto (mixed-format logging), Statements sinalizados como não seguros são registrados usando o formato baseado em Row (row-based format); Statements considerados seguros são registrados usando o formato baseado em Statement (statement-based format).

* Quando usando logging baseado em Statement (statement-based logging), Statements sinalizados como não seguros geram um aviso (warning) para esse efeito. Statements seguros são registrados normalmente.

Cada Statement sinalizado como não seguro gera um warning. Anteriormente, se um grande número desses Statements fosse executado na source, isso poderia levar a arquivos de log de erro excessivamente grandes. Para evitar isso, o MySQL 5.7 fornece um mecanismo de supressão de warning, que se comporta da seguinte forma: Sempre que os 50 warnings mais recentes de [`ER_BINLOG_UNSAFE_STATEMENT`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_binlog_unsafe_statement) forem gerados mais de 50 vezes em qualquer período de 50 segundos, a supressão de warning é ativada. Quando ativado, isso faz com que tais warnings não sejam escritos no error log; em vez disso, para cada 50 warnings desse tipo, uma nota `The last warning was repeated N times in last S seconds` é escrita no error log. Isso continua enquanto os 50 warnings mais recentes desse tipo forem emitidos em 50 segundos ou menos; assim que a taxa diminuir abaixo desse limite, os warnings são registrados normalmente novamente. A supressão de warning não afeta a forma como a segurança dos Statements para logging baseado em Statement é determinada, nem a forma como os warnings são enviados ao cliente. Clientes MySQL ainda recebem um warning para cada Statement.

Para mais informações, consulte [Seção 16.2.1, “Replication Formats”](replication-formats.html "16.2.1 Replication Formats").

**Statements considerados não seguros.** Statements com as seguintes características são considerados não seguros:

* **Statements contendo funções de sistema que podem retornar um valor diferente em uma Replica.** Essas funções incluem [`FOUND_ROWS()`](information-functions.html#function_found-rows), [`GET_LOCK()`](locking-functions.html#function_get-lock), [`IS_FREE_LOCK()`](locking-functions.html#function_is-free-lock), [`IS_USED_LOCK()`](locking-functions.html#function_is-used-lock), [`LOAD_FILE()`](string-functions.html#function_load-file), [`MASTER_POS_WAIT()`](miscellaneous-functions.html#function_master-pos-wait), [`PASSWORD()`](encryption-functions.html#function_password), [`RAND()`](mathematical-functions.html#function_rand), [`RELEASE_LOCK()`](locking-functions.html#function_release-lock), [`ROW_COUNT()`](information-functions.html#function_row-count), [`SESSION_USER()`](information-functions.html#function_session-user), [`SLEEP()`](miscellaneous-functions.html#function_sleep), [`SYSDATE()`](date-and-time-functions.html#function_sysdate), [`SYSTEM_USER()`](information-functions.html#function_system-user), [`USER()`](information-functions.html#function_user), [`UUID()`](miscellaneous-functions.html#function_uuid) e [`UUID_SHORT()`](miscellaneous-functions.html#function_uuid-short).

  **Funções não determinísticas não consideradas não seguras.** Embora essas funções não sejam determinísticas, elas são tratadas como seguras para fins de logging e Replication: [`CONNECTION_ID()`](information-functions.html#function_connection-id), [`CURDATE()`](date-and-time-functions.html#function_curdate), [`CURRENT_DATE()`](date-and-time-functions.html#function_current-date), [`CURRENT_TIME()`](date-and-time-functions.html#function_current-time), [`CURRENT_TIMESTAMP()`](date-and-time-functions.html#function_current-timestamp), [`CURTIME()`](date-and-time-functions.html#function_curtime), [`LAST_INSERT_ID()`](information-functions.html#function_last-insert-id), [`LOCALTIME()`](date-and-time-functions.html#function_localtime), [`LOCALTIMESTAMP()`](date-and-time-functions.html#function_localtimestamp), [`NOW()`](date-and-time-functions.html#function_now), [`UNIX_TIMESTAMP()`](date-and-time-functions.html#function_unix-timestamp), [`UTC_DATE()`](date-and-time-functions.html#function_utc-date), [`UTC_TIME()`](date-and-time-functions.html#function_utc-time) e [`UTC_TIMESTAMP()`](date-and-time-functions.html#function_utc-timestamp).

  Para mais informações, consulte [Seção 16.4.1.15, “Replication e Funções de Sistema”](replication-features-functions.html "16.4.1.15 Replication and System Functions").

* **Referências a variáveis de sistema.** A maioria das variáveis de sistema não é replicada corretamente usando o formato baseado em Statement. Consulte [Seção 16.4.1.37, “Replication e Variáveis”](replication-features-variables.html "16.4.1.37 Replication and Variables"). Para exceções, consulte [Seção 5.4.4.3, “Mixed Binary Logging Format”](binary-log-mixed.html "5.4.4.3 Mixed Binary Logging Format").

* **Funções Carregáveis (Loadable Functions).** Uma vez que não temos controle sobre o que uma função carregável faz, devemos presumir que ela está executando Statements não seguros.

* **Plugin Fulltext.** Este Plugin pode se comportar de maneira diferente em diferentes servidores MySQL; portanto, Statements que dependem dele podem ter resultados diferentes. Por esse motivo, todos os Statements que dependem do Plugin Fulltext são tratados como não seguros (Bug #11756280, Bug #48183).

* **Um Trigger ou programa armazenado (stored program) atualiza uma tabela que possui uma coluna AUTO_INCREMENT.** Isso é não seguro porque a ordem na qual as Rows são atualizadas pode diferir na Source e na Replica.

  Além disso, um [`INSERT`](insert.html "13.2.5 INSERT Statement") em uma tabela que possui uma Primary Key composta contendo uma coluna `AUTO_INCREMENT` que não é a primeira coluna desta chave composta é não seguro (unsafe).

  Para mais informações, consulte [Seção 16.4.1.1, “Replication e AUTO_INCREMENT”](replication-features-auto-increment.html "16.4.1.1 Replication and AUTO_INCREMENT").

* **Statements INSERT ... ON DUPLICATE KEY UPDATE em tabelas com múltiplas Primary Keys ou Unique Keys.** Quando executado em uma tabela que contém mais de uma Primary Key ou Unique Key, este Statement é considerado não seguro, sendo sensível à ordem em que o storage engine verifica as Keys, o que não é determinístico, e do qual depende a escolha de Rows atualizadas pelo MySQL Server.

  Um Statement [`INSERT ... ON DUPLICATE KEY UPDATE`](insert-on-duplicate.html "13.2.5.2 INSERT ... ON DUPLICATE KEY UPDATE Statement") contra uma tabela que possui mais de uma Unique Key ou Primary Key é marcado como não seguro para statement-based replication. (Bug #11765650, Bug #58637)

* **Atualizações usando LIMIT.** A ordem na qual as Rows são recuperadas não é especificada e, portanto, é considerada não segura. Consulte [Seção 16.4.1.17, “Replication e LIMIT”](replication-features-limit.html "16.4.1.17 Replication and LIMIT").

* **Acessos ou referências a tabelas de log.** O conteúdo da tabela de log do sistema pode diferir entre a Source e a Replica.

* **Operações não transacionais após operações transacionais.** Dentro de uma transaction, permitir que qualquer leitura ou escrita não transacional seja executada após qualquer leitura ou escrita transacional é considerado não seguro.

  Para mais informações, consulte [Seção 16.4.1.33, “Replication e Transactions”](replication-features-transactions.html "16.4.1.33 Replication and Transactions").

* **Acessos ou referências a tabelas de auto-logging (self-logging).** Todas as leituras e escritas em tabelas de self-logging são consideradas não seguras. Dentro de uma transaction, qualquer Statement que siga uma leitura ou escrita em tabelas de self-logging também é considerado não seguro.

* **Statements LOAD DATA.** [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement") é tratado como não seguro e, quando [`binlog_format=mixed`](replication-options-binary-log.html#sysvar_binlog_format), o Statement é registrado no formato baseado em Row (row-based format). Quando [`binlog_format=statement`](replication-options-binary-log.html#sysvar_binlog_format), o [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement") não gera um warning, diferentemente de outros Statements não seguros.

* **Transações XA.** Se duas transações XA submetidas (committed) em paralelo na Source estiverem sendo preparadas na Replica na ordem inversa, dependências de Lock podem ocorrer com statement-based replication que não podem ser resolvidas com segurança, e é possível que a Replication falhe com deadlock na Replica. Quando [`binlog_format=STATEMENT`](replication-options-binary-log.html#sysvar_binlog_format) está configurado, Statements DML dentro de transações XA são sinalizados como não seguros e geram um warning. Quando [`binlog_format=MIXED`](replication-options-binary-log.html#sysvar_binlog_format) ou [`binlog_format=ROW`](replication-options-binary-log.html#sysvar_binlog_format) está configurado, Statements DML dentro de transações XA são registrados usando row-based replication, e o problema potencial não está presente.

Para informações adicionais, consulte [Seção 16.4.1, “Replication Features and Issues”](replication-features.html "16.4.1 Replication Features and Issues").