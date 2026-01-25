### 5.4.4 O Binary Log

[5.4.4.1 Formatos de Binary Logging](binary-log-formats.html)

[5.4.4.2 Configurando o Formato de Binary Log](binary-log-setting.html)

[5.4.4.3 Formato Misto de Binary Logging](binary-log-mixed.html)

[5.4.4.4 Formato de Logging para Alterações em Tabelas do Database mysql](binary-log-mysql-database.html)

O Binary Log contém "eventos" que descrevem mudanças no Database, como operações de criação de tabela ou alterações nos dados da tabela. Ele também contém eventos para instruções que potencialmente poderiam ter feito alterações (por exemplo, um [`DELETE`](delete.html "13.2.2 DELETE Statement") que não correspondeu a nenhuma linha), a menos que o logging baseado em linha (row-based logging) seja usado. O Binary Log também contém informações sobre o tempo que cada instrução levou para atualizar os dados. O Binary Log tem dois propósitos importantes:

* Para Replication, o Binary Log em um Source Server de Replication fornece um registro das alterações de dados a serem enviadas aos Replicas. O Source envia os eventos contidos em seu Binary Log para seus Replicas, que executam esses eventos para fazer as mesmas alterações de dados que foram feitas no Source. Consulte [Section 16.2, “Replication Implementation”](replication-implementation.html "16.2 Replication Implementation").

* Certas operações de recuperação de dados exigem o uso do Binary Log. Após a restauração de um Backup, os eventos no Binary Log que foram registrados após a realização do Backup são reexecutados. Esses eventos atualizam os Databases a partir do ponto do Backup. Consulte [Section 7.5, “Point-in-Time (Incremental) Recovery”](point-in-time-recovery.html "7.5 Point-in-Time (Incremental) Recovery").

O Binary Log não é usado para instruções como [`SELECT`](select.html "13.2.9 SELECT Statement") ou [`SHOW`](show.html "13.7.5 SHOW Statements") que não modificam dados. Para registrar todas as instruções (por exemplo, para identificar uma Query problemática), use o general query log. Consulte [Section 5.4.3, “The General Query Log”](query-log.html "5.4.3 The General Query Log").

Executar um Server com o binary logging habilitado torna a performance ligeiramente mais lenta. No entanto, os benefícios do Binary Log ao permitir configurar Replication e para operações de restauração geralmente superam essa pequena diminuição de performance.

O Binary Log é geralmente resiliente a paralisações inesperadas porque apenas Transactions completas são registradas ou lidas de volta. Consulte [Section 16.3.2, “Handling an Unexpected Halt of a Replica”](replication-solutions-unexpected-replica-halt.html "16.3.2 Handling an Unexpected Halt of a Replica") para mais informações.

Senhas em instruções escritas no Binary Log são reescritas pelo Server para não ocorrerem literalmente em texto simples (plain text). Consulte também [Section 6.1.2.3, “Passwords and Logging”](password-logging.html "6.1.2.3 Passwords and Logging").

A discussão a seguir descreve algumas das opções e variáveis do Server que afetam a operação do binary logging. Para uma lista completa, consulte [Section 16.1.6.4, “Binary Logging Options and Variables”](replication-options-binary-log.html "16.1.6.4 Binary Logging Options and Variables").

Para habilitar o Binary Log, inicie o Server com a opção [`--log-bin[=base_name]`](replication-options-binary-log.html#option_mysqld_log-bin). Se nenhum valor de *`base_name`* for fornecido, o nome padrão é o valor da opção [`--pid-file`](server-system-variables.html#sysvar_pid_file) (que por padrão é o nome da máquina host) seguido por `-bin`. Se o base name for fornecido, o Server escreve o arquivo no data directory, a menos que o base name seja fornecido com um nome de caminho absoluto inicial para especificar um diretório diferente. Recomenda-se especificar um base name explicitamente em vez de usar o padrão do nome do host; veja [Section B.3.7, “Known Issues in MySQL”](known-issues.html "B.3.7 Known Issues in MySQL"), para saber o motivo.

Se você fornecer uma extensão no nome do log (por exemplo, [`--log-bin=base_name.extension`](replication-options-binary-log.html#option_mysqld_log-bin)), a extensão é removida e ignorada silenciosamente.

O [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") anexa uma extensão numérica ao base name do Binary Log para gerar nomes de arquivos de Binary Log. O número aumenta cada vez que o Server cria um novo arquivo de log, criando assim uma série ordenada de arquivos. O Server cria um novo arquivo na série sempre que qualquer um dos seguintes eventos ocorre:

* O Server é iniciado ou reiniciado.
* O Server faz o flush dos logs.
* O tamanho do arquivo de log atual atinge [`max_binlog_size`](replication-options-binary-log.html#sysvar_max_binlog_size).

Um arquivo de Binary Log pode se tornar maior do que [`max_binlog_size`](replication-options-binary-log.html#sysvar_max_binlog_size) se você estiver usando Transactions grandes, pois uma Transaction é escrita no arquivo inteira, nunca dividida entre arquivos.

Para acompanhar quais arquivos de Binary Log foram usados, o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") também cria um arquivo de índice de Binary Log que contém os nomes dos arquivos de Binary Log. Por padrão, este tem o mesmo base name que o arquivo de Binary Log, com a extensão `'.index'`. Você pode alterar o nome do arquivo de índice de Binary Log com a opção [`--log-bin-index[=file_name]`](replication-options-binary-log.html#option_mysqld_log-bin-index). Você não deve editar este arquivo manualmente enquanto o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") estiver em execução; fazer isso o confundiria.

O termo "arquivo de Binary Log" (binary log file) geralmente denota um arquivo numerado individual que contém eventos do Database. O termo "Binary Log" denota coletivamente o conjunto de arquivos de Binary Log numerados mais o arquivo de índice.

Um Client que tem privilégios suficientes para definir variáveis de sistema de Session restritas (consulte [Section 5.1.8.1, “System Variable Privileges”](system-variable-privileges.html "5.1.8.1 System Variable Privileges")) pode desabilitar o binary logging de suas próprias instruções usando uma instrução [`SET sql_log_bin=OFF`](set-sql-log-bin.html "13.4.1.3 SET sql_log_bin Statement").

Por padrão, o Server registra o comprimento do evento, bem como o próprio evento, e usa isso para verificar se o evento foi escrito corretamente. Você também pode fazer com que o Server escreva checksums para os eventos definindo a variável de sistema [`binlog_checksum`](replication-options-binary-log.html#sysvar_binlog_checksum). Ao ler de volta o Binary Log, o Source usa o comprimento do evento por padrão, mas pode ser configurado para usar checksums, se disponíveis, habilitando a variável de sistema [`master_verify_checksum`](replication-options-binary-log.html#sysvar_master_verify_checksum). O Thread I/O de Replication também verifica os eventos recebidos do Source. Você pode fazer com que o Thread SQL de Replication use checksums, se disponíveis, ao ler o relay log, habilitando a variável de sistema [`slave_sql_verify_checksum`](replication-options-replica.html#sysvar_slave_sql_verify_checksum).

O formato dos eventos registrados no Binary Log depende do formato de binary logging. Três tipos de formato são suportados: row-based logging, statement-based logging e mixed-base logging. O formato de binary logging usado depende da versão do MySQL. Para descrições gerais dos formatos de logging, consulte [Section 5.4.4.1, “Binary Logging Formats”](binary-log-formats.html "5.4.4.1 Binary Logging Formats"). Para informações detalhadas sobre o formato do Binary Log, consulte [MySQL Internals: The Binary Log](/doc/internals/en/binary-log.html).

O Server avalia as opções [`--binlog-do-db`](replication-options-binary-log.html#option_mysqld_binlog-do-db) e [`--binlog-ignore-db`](replication-options-binary-log.html#option_mysqld_binlog-ignore-db) da mesma forma que as opções [`--replicate-do-db`](replication-options-replica.html#option_mysqld_replicate-do-db) e [`--replicate-ignore-db`](replication-options-replica.html#option_mysqld_replicate-ignore-db). Para obter informações sobre como isso é feito, consulte [Section 16.2.5.1, “Evaluation of Database-Level Replication and Binary Logging Options”](replication-rules-db-options.html "16.2.5.1 Evaluation of Database-Level Replication and Binary Logging Options").

Por padrão, um Replica não escreve em seu próprio Binary Log quaisquer modificações de dados que são recebidas do Source. Para registrar essas modificações, inicie o Replica com a opção [`--log-slave-updates`](replication-options-binary-log.html#sysvar_log_slave_updates) além da opção [`--log-bin`](replication-options-binary-log.html#option_mysqld_log-bin) (consulte [Section 16.1.6.3, “Replica Server Options and Variables”](replication-options-replica.html "16.1.6.3 Replica Server Options and Variables")). Isso é feito quando um Replica também deve atuar como Source para outros Replicas em chained replication.

Você pode excluir todos os arquivos de Binary Log com a instrução [`RESET MASTER`](reset-master.html "13.4.1.2 RESET MASTER Statement"), ou um subconjunto deles com [`PURGE BINARY LOGS`](purge-binary-logs.html "13.4.1.1 PURGE BINARY LOGS Statement"). Consulte [Section 13.7.6.6, “RESET Statement”](reset.html "13.7.6.6 RESET Statement"), e [Section 13.4.1.1, “PURGE BINARY LOGS Statement”](purge-binary-logs.html "13.4.1.1 PURGE BINARY LOGS Statement").

Se você estiver usando Replication, não deve excluir arquivos de Binary Log antigos no Source até ter certeza de que nenhum Replica ainda precisa usá-los. Por exemplo, se seus Replicas nunca estiverem atrasados mais de três dias, uma vez por dia você pode executar [**mysqladmin flush-logs binary**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program") no Source e, em seguida, remover todos os logs com mais de três dias. Você pode remover os arquivos manualmente, mas é preferível usar [`PURGE BINARY LOGS`](purge-binary-logs.html "13.4.1.1 PURGE BINARY LOGS Statement"), que também atualiza o arquivo de índice de Binary Log com segurança para você (e que pode receber um argumento de data). Consulte [Section 13.4.1.1, “PURGE BINARY LOGS Statement”](purge-binary-logs.html "13.4.1.1 PURGE BINARY LOGS Statement").

Você pode exibir o conteúdo dos arquivos de Binary Log com o utilitário [**mysqlbinlog**](mysqlbinlog.html "4.6.7 mysqlbinlog — Utility for Processing Binary Log Files"). Isso pode ser útil quando você deseja reprocessar instruções no log para uma operação de recuperação. Por exemplo, você pode atualizar um MySQL Server a partir do Binary Log da seguinte forma:

```sql
$> mysqlbinlog log_file | mysql -h server_name
```

O [**mysqlbinlog**](mysqlbinlog.html "4.6.7 mysqlbinlog — Utility for Processing Binary Log Files") também pode ser usado para exibir o conteúdo do relay log, pois eles são escritos usando o mesmo formato que os arquivos de Binary Log. Para obter mais informações sobre o utilitário [**mysqlbinlog**](mysqlbinlog.html "4.6.7 mysqlbinlog — Utility for Processing Binary Log Files") e como usá-lo, consulte [Section 4.6.7, “mysqlbinlog — Utility for Processing Binary Log Files”](mysqlbinlog.html "4.6.7 mysqlbinlog — Utility for Processing Binary Log Files"). Para obter mais informações sobre o Binary Log e operações de recuperação, consulte [Section 7.5, “Point-in-Time (Incremental) Recovery”](point-in-time-recovery.html "7.5 Point-in-Time (Incremental) Recovery").

O binary logging é feito imediatamente após a conclusão de uma instrução ou Transaction, mas antes que quaisquer Locks sejam liberados ou qualquer Commit seja feito. Isso garante que o log seja registrado na ordem de Commit.

Atualizações em tabelas não transacionais são armazenadas no Binary Log imediatamente após a execução.

Dentro de uma Transaction não Committada, todas as atualizações ([`UPDATE`](update.html "13.2.11 UPDATE Statement"), [`DELETE`](delete.html "13.2.2 DELETE Statement") ou [`INSERT`](insert.html "13.2.5 INSERT Statement")) que alteram tabelas transacionais, como tabelas `InnoDB`, são armazenadas em Cache até que uma instrução [`COMMIT`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") seja recebida pelo Server. Nesse ponto, o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") escreve a Transaction inteira no Binary Log antes que o [`COMMIT`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") seja executado.

Modificações em tabelas não transacionais não podem ser revertidas (rolled back). Se uma Transaction que é revertida (rolled back) incluir modificações em tabelas não transacionais, a Transaction inteira é registrada com uma instrução [`ROLLBACK`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") no final para garantir que as modificações nessas tabelas sejam replicadas.

Quando um Thread que gerencia a Transaction é iniciado, ele aloca um Buffer de [`binlog_cache_size`](replication-options-binary-log.html#sysvar_binlog_cache_size) para armazenar instruções em Buffer. Se uma instrução for maior do que isso, o Thread abre um arquivo temporário para armazenar a Transaction. O arquivo temporário é excluído quando o Thread termina.

A variável de Status [`Binlog_cache_use`](server-status-variables.html#statvar_Binlog_cache_use) mostra o número de Transactions que usaram este Buffer (e possivelmente um arquivo temporário) para armazenar instruções. A variável de Status [`Binlog_cache_disk_use`](server-status-variables.html#statvar_Binlog_cache_disk_use) mostra quantas dessas Transactions realmente tiveram que usar um arquivo temporário. Essas duas variáveis podem ser usadas para ajustar [`binlog_cache_size`](replication-options-binary-log.html#sysvar_binlog_cache_size) para um valor grande o suficiente que evite o uso de arquivos temporários.

A variável de sistema [`max_binlog_cache_size`](replication-options-binary-log.html#sysvar_max_binlog_cache_size) (padrão 4GB, que também é o máximo) pode ser usada para restringir o tamanho total usado para armazenar em Cache uma Transaction de múltiplas instruções. Se uma Transaction for maior do que esse número de bytes, ela falha e sofre Rollback. O valor mínimo é 4096.

Se você estiver usando o Binary Log e row based logging, as inserts concorrentes são convertidas em inserts normais para instruções `CREATE ... SELECT` ou [`INSERT ... SELECT`](insert-select.html "13.2.5.1 INSERT ... SELECT Statement"). Isso é feito para garantir que você possa recriar uma cópia exata de suas tabelas aplicando o log durante uma operação de Backup. Se você estiver usando statement-based logging, a instrução original é escrita no log.

O formato do Binary Log tem algumas limitações conhecidas que podem afetar a recuperação de Backups. Consulte [Section 16.4.1, “Replication Features and Issues”](replication-features.html "16.4.1 Replication Features and Issues").

O binary logging para Stored Programs é feito conforme descrito em [Section 23.7, “Stored Program Binary Logging”](stored-programs-logging.html "23.7 Stored Program Binary Logging").

Observe que o formato do Binary Log difere no MySQL 5.7 de versões anteriores do MySQL, devido a aprimoramentos no Replication. Consulte [Section 16.4.2, “Replication Compatibility Between MySQL Versions”](replication-compatibility.html "16.4.2 Replication Compatibility Between MySQL Versions").

Se o Server não conseguir gravar no Binary Log, fazer o flush dos arquivos de Binary Log ou sincronizar o Binary Log no disco, o Binary Log no Source pode se tornar inconsistente e os Replicas podem perder a sincronização com o Source. A variável de sistema [`binlog_error_action`](replication-options-binary-log.html#sysvar_binlog_error_action) controla a ação tomada se um erro desse tipo for encontrado com o Binary Log.

* O ajuste padrão, `ABORT_SERVER`, faz com que o Server interrompa o binary logging e seja desligado. Neste ponto, você pode identificar e corrigir a causa do erro. Na reinicialização, a recuperação prossegue como no caso de uma paralisação inesperada do Server (consulte [Section 16.3.2, “Handling an Unexpected Halt of a Replica”](replication-solutions-unexpected-replica-halt.html "16.3.2 Handling an Unexpected Halt of a Replica")).

* O ajuste `IGNORE_ERROR` fornece compatibilidade com versões mais antigas do MySQL. Com esta configuração, o Server continua a Transaction em andamento e registra o erro, depois interrompe o binary logging, mas continua a realizar Updates. Neste ponto, você pode identificar e corrigir a causa do erro. Para retomar o binary logging, [`log_bin`](replication-options-binary-log.html#sysvar_log_bin) deve ser habilitado novamente, o que requer a reinicialização do Server. Use esta opção apenas se precisar de compatibilidade com versões anteriores e o Binary Log não for essencial nesta instância do MySQL Server. Por exemplo, você pode usar o Binary Log apenas para auditoria ou Debugging intermitente do Server e não usá-lo para Replication a partir do Server ou confiar nele para operações de restauração Point-in-Time.

Por padrão, o Binary Log é sincronizado com o disco a cada escrita ([`sync_binlog=1`](replication-options-binary-log.html#sysvar_sync_binlog)). Se [`sync_binlog`](replication-options-binary-log.html#sysvar_sync_binlog) não estiver habilitado, e o sistema operacional ou a máquina (não apenas o MySQL Server) falhar, há uma chance de que as últimas instruções do Binary Log sejam perdidas. Para evitar isso, habilite a variável de sistema [`sync_binlog`](replication-options-binary-log.html#sysvar_sync_binlog) para sincronizar o Binary Log com o disco após cada *`N`* Commit groups. Consulte [Section 5.1.7, “Server System Variables”](server-system-variables.html "5.1.7 Server System Variables"). O valor mais seguro para [`sync_binlog`](replication-options-binary-log.html#sysvar_sync_binlog) é 1 (o padrão), mas este também é o mais lento.

Por exemplo, se você estiver usando tabelas `InnoDB` e o MySQL Server processar uma instrução [`COMMIT`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements"), ele escreve muitas Transactions preparadas no Binary Log em sequência, sincroniza o Binary Log e, em seguida, Committa esta Transaction no `InnoDB`. Se o Server sair inesperadamente entre essas duas operações, a Transaction é revertida (rolled back) pelo `InnoDB` na reinicialização, mas ainda existe no Binary Log. Tal problema é resolvido assumindo que [`--innodb_support_xa`](innodb-parameters.html#sysvar_innodb_support_xa) está definido como 1, o padrão. Embora esta opção esteja relacionada ao suporte de XA Transactions no `InnoDB`, ela também garante que o Binary Log e os arquivos de dados `InnoDB` estejam sincronizados. Para que esta opção forneça um grau maior de segurança, o MySQL Server também deve ser configurado para sincronizar o Binary Log e os logs `InnoDB` no disco antes de Committar a Transaction. Os logs `InnoDB` são sincronizados por padrão, e `sync_binlog=1` pode ser usado para sincronizar o Binary Log. O efeito desta opção é que, na reinicialização após uma falha, após fazer um Rollback de Transactions, o MySQL Server escaneia o arquivo de Binary Log mais recente para coletar os valores *`xid`* da Transaction e calcular a última posição válida no arquivo de Binary Log. O MySQL Server então instrui o `InnoDB` a completar quaisquer Transactions preparadas que foram escritas com sucesso no Binary Log e trunca o Binary Log para a última posição válida. Isso garante que o Binary Log reflita os dados exatos das tabelas `InnoDB` e, portanto, o Replica permaneça em sincronia com o Source, pois não recebe uma instrução que foi revertida (rolled back).

Note

[`innodb_support_xa`](innodb-parameters.html#sysvar_innodb_support_xa) está depreciado; espere que ele seja removido em uma versão futura. O suporte do `InnoDB` para Commit em duas fases (two-phase commit) em XA Transactions está sempre habilitado a partir do MySQL 5.7.10.

Se o MySQL Server descobrir durante a recuperação de falhas que o Binary Log está mais curto do que deveria, ele estará com falta de pelo menos uma Transaction `InnoDB` Committada com sucesso. Isso não deve acontecer se `sync_binlog=1` e o disco/sistema de arquivos fizerem uma sincronização real quando solicitados (alguns não o fazem), então o Server imprime uma mensagem de erro `The binary log file_name is shorter than its expected size`. Neste caso, este Binary Log não está correto e a Replication deve ser reiniciada a partir de um novo Snapshot dos dados do Source.

Os valores de Session das seguintes variáveis de sistema são gravados no Binary Log e honrados pelo Replica ao analisar o Binary Log:

* [`sql_mode`](server-system-variables.html#sysvar_sql_mode) (exceto que o modo [`NO_DIR_IN_CREATE`](sql-mode.html#sqlmode_no_dir_in_create) não é replicado; consulte [Section 16.4.1.37, “Replication and Variables”](replication-features-variables.html "16.4.1.37 Replication and Variables"))

* [`foreign_key_checks`](server-system-variables.html#sysvar_foreign_key_checks)
* [`unique_checks`](server-system-variables.html#sysvar_unique_checks)
* [`character_set_client`](server-system-variables.html#sysvar_character_set_client)
* [`collation_connection`](server-system-variables.html#sysvar_collation_connection)
* [`collation_database`](server-system-variables.html#sysvar_collation_database)
* [`collation_server`](server-system-variables.html#sysvar_collation_server)
* [`sql_auto_is_null`](server-system-variables.html#sysvar_sql_auto_is_null)