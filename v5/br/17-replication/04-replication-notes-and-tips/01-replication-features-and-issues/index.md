### 16.4.1 Recursos e Problemas da Replication

[16.4.1.1 Replication e AUTO_INCREMENT](replication-features-auto-increment.html)

[16.4.1.2 Replication e Tabelas BLACKHOLE](replication-features-blackhole.html)

[16.4.1.3 Replication e Conjuntos de Caracteres](replication-features-charset.html)

[16.4.1.4 Replication e CHECKSUM TABLE](replication-features-checksum-table.html)

[16.4.1.5 Replication de Instruções CREATE ... IF NOT EXISTS](replication-features-create-if-not-exists.html)

[16.4.1.6 Replication de Instruções CREATE TABLE ... SELECT](replication-features-create-select.html)

[16.4.1.7 Replication de CREATE SERVER, ALTER SERVER e DROP SERVER](replication-features-create-alter-drop-server.html)

[16.4.1.8 Replication de CURRENT_USER()](replication-features-current-user.html)

[16.4.1.9 Replication de Instruções DROP ... IF EXISTS](replication-features-drop-if-exists.html)

[16.4.1.10 Replication com Definições de Tabela Diferentes na Source e na Replica](replication-features-differing-tables.html)

[16.4.1.11 Replication e Opções de Tabela DIRECTORY](replication-features-directory.html)

[16.4.1.12 Replication e Valores de Ponto Flutuante](replication-features-floatvalues.html)

[16.4.1.13 Replication e Suporte a Segundos Fracionários](replication-features-fractional-seconds.html)

[16.4.1.14 Replication e FLUSH](replication-features-flush.html)

[16.4.1.15 Replication e Funções de Sistema](replication-features-functions.html)

[16.4.1.16 Replication de Recursos Invocados](replication-features-invoked.html)

[16.4.1.17 Replication e LIMIT](replication-features-limit.html)

[16.4.1.18 Replication e LOAD DATA](replication-features-load-data.html)

[16.4.1.19 Replication e max_allowed_packet](replication-features-max-allowed-packet.html)

[16.4.1.20 Replication e Tabelas MEMORY](replication-features-memory.html)

[16.4.1.21 Replication do Database de Sistema mysql](replication-features-mysqldb.html)

[16.4.1.22 Replication e o Query Optimizer](replication-features-optimizer.html)

[16.4.1.23 Replication e Partitioning](replication-features-partitioning.html)

[16.4.1.24 Replication e REPAIR TABLE](replication-features-repair-table.html)

[16.4.1.25 Replication e Palavras Reservadas](replication-features-reserved-words.html)

[16.4.1.26 Replication e Desligamentos (Shutdowns) da Source ou Replica](replication-features-shutdowns.html)

[16.4.1.27 Erros na Replica Durante a Replication](replication-features-errors.html)

[16.4.1.28 Replication e SQL Mode do Server](replication-features-sql-mode.html)

[16.4.1.29 Replication e Temporary Tables](replication-features-temptables.html)

[16.4.1.30 Repetições e Timeouts da Replication](replication-features-timeout.html)

[16.4.1.31 Replication e Time Zones](replication-features-timezone.html)

[16.4.1.32 Replication e Inconsistências de Transaction](replication-features-transaction-inconsistencies.html)

[16.4.1.33 Replication e Transactions](replication-features-transactions.html)

[16.4.1.34 Replication e Triggers](replication-features-triggers.html)

[16.4.1.35 Replication e TRUNCATE TABLE](replication-features-truncate.html)

[16.4.1.36 Replication e Comprimento de Nome de Usuário](replication-features-user-names.html)

[16.4.1.37 Replication e Variáveis](replication-features-variables.html)

[16.4.1.38 Replication e Views](replication-features-views.html)

As seções a seguir fornecem informações sobre o que é suportado e o que não é na Replication do MySQL, bem como sobre problemas e situações específicas que podem ocorrer ao replicar certas *statements* (instruções SQL).

A Replication baseada em *statements* depende da compatibilidade no nível SQL entre a *source* e a *replica*. Em outras palavras, o sucesso da replication baseada em *statements* exige que quaisquer recursos SQL utilizados sejam suportados por ambos os *servers*: *source* e *replica*. Se você usar um recurso no *source server* que está disponível apenas na versão atual do MySQL, você não poderá replicar para uma *replica* que usa uma versão anterior do MySQL. Tais incompatibilidades podem ocorrer tanto dentro de uma mesma série de *releases* quanto entre versões.

Se você está planejando usar a Replication baseada em *statements* entre o MySQL 5.7 e uma série de *releases* anterior do MySQL, é recomendável consultar a edição do *Manual de Referência do MySQL* correspondente à série de *releases* anterior para obter informações sobre as características de replication dessa série.

Com a Replication baseada em *statements* do MySQL, podem haver problemas ao replicar *stored routines* ou *triggers*. Você pode evitar esses problemas usando a Replication baseada em linhas (*row-based replication*) do MySQL. Para uma lista detalhada de problemas, consulte [Seção 23.7, “Stored Program Binary Logging”](stored-programs-logging.html "23.7 Stored Program Binary Logging"). Para mais informações sobre *row-based logging* e *row-based replication*, consulte [Seção 5.4.4.1, “Binary Logging Formats”](binary-log-formats.html "5.4.4.1 Binary Logging Formats"), e [Seção 16.2.1, “Replication Formats”](replication-formats.html "16.2.1 Replication Formats").

Para informações adicionais específicas sobre Replication e `InnoDB`, consulte [Seção 14.20, “InnoDB and MySQL Replication”](innodb-and-mysql-replication.html "14.20 InnoDB and MySQL Replication"). Para informações relacionadas à Replication com NDB Cluster, consulte [Seção 21.7, “NDB Cluster Replication”](mysql-cluster-replication.html "21.7 NDB Cluster Replication").
