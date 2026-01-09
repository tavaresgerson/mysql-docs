#### 16.2.1.3 Determinação de declarações seguras e inseguras no registro binário

A “segurança” de uma declaração na replicação do MySQL refere-se a se a declaração e seus efeitos podem ser replicados corretamente usando o formato baseado em declarações. Se isso for verdade para a declaração, a chamamos de segura; caso contrário, a chamamos de insegura.

Em geral, uma declaração é segura se for determinística e insegura se não for. No entanto, certas funções não determinísticas **não** são consideradas inseguras (consulte [Funções não determinísticas não consideradas inseguras](replication-rbr-safe-unsafe.html#replication-rbr-safe-unsafe), mais adiante nesta seção). Além disso, declarações que utilizam resultados de funções matemáticas de ponto flutuante — que dependem do hardware — são sempre consideradas inseguras (consulte [Seção 16.4.1.12, “Replicação e Valores de Ponto Flutuante”](replication-features-floatvalues.html)).

**Tratamento de declarações seguras e inseguras.** Uma declaração é tratada de maneira diferente dependendo se a declaração é considerada segura e em relação ao formato de registro binário (ou seja, o valor atual de [`binlog_format`](replication-options-binary-log.html#sysvar_binlog_format)).

- Ao usar o registro baseado em linhas, não há distinção no tratamento de declarações seguras e inseguras.

- Ao usar o registro de formato misto, as declarações marcadas como inseguras são registradas no formato baseado em linha; as declarações consideradas seguras são registradas no formato baseado em declaração.

- Ao usar o registro baseado em declarações, as declarações marcadas como inseguras geram um aviso nesse sentido. As declarações seguras são registradas normalmente.

Cada declaração marcada como insegura gera um aviso. Anteriormente, se um grande número dessas declarações fosse executado na fonte, isso poderia levar a arquivos de log de erro excessivamente grandes. Para evitar isso, o MySQL 5.7 fornece um mecanismo de supressão de avisos, que funciona da seguinte maneira: Sempre que os 50 avisos mais recentes de [`ER_BINLOG_UNSAFE_STATEMENT`]\(/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_binlog_unsafe_statement] forem gerados mais de 50 vezes em qualquer período de 50 segundos, a supressão de avisos é habilitada. Quando ativado, isso faz com que esses avisos não sejam escritos no log de erro; em vez disso, para cada 50 avisos desse tipo, uma nota `O último aviso foi repetido N vezes nos últimos S segundos` é escrita no log de erro. Isso continua enquanto os 50 avisos mais recentes forem emitidos em 50 segundos ou menos; uma vez que a taxa diminui abaixo desse limite, os avisos são novamente registrados normalmente. A supressão de avisos não afeta a determinação da segurança das declarações para o registro baseado em declarações, nem a forma como os avisos são enviados ao cliente. Os clientes do MySQL ainda recebem um aviso para cada declaração desse tipo.

Para mais informações, consulte [Seção 16.2.1, "Formatos de Replicação"](replication-formats.html).

**Declarações consideradas inseguras.** Declarações com as seguintes características são consideradas inseguras:

- **Declarações que contêm funções do sistema que podem retornar um valor diferente em uma réplica.** Essas funções incluem [`FOUND_ROWS()`](information-functions.html#function_found-rows), [`GET_LOCK()`](locking-functions.html#function_get-lock), [`IS_FREE_LOCK()`](locking-functions.html#function_is-free-lock), [`IS_USED_LOCK()`](locking-functions.html#function_is-used-lock), [`LOAD_FILE()`](string-functions.html#function_load-file), [`MASTER_POS_WAIT()`](miscellaneous-functions.html#function_master-pos-wait), [`PASSWORD()`](encryption-functions.html#function_password), [`RAND()`](mathematical-functions.html#function_rand), [`RELEASE_LOCK()`](locking-functions.html#function_release-lock), [`ROW_COUNT()`](information-functions.html#function_row-count), [`SESSION_USER()`](information-functions.html#function_session-user), [`SLEEP()`](miscellaneous-functions.html#function_sleep), [`SYSDATE()`](date-and-time-functions.html#function_sysdate), [`SYSTEM_USER()`](information-functions.html#function_system-user), [`USER()`](information-functions.html#function_user), [`UUID()`](miscellaneous-functions.html#function_uuid), e [`UUID_SHORT()`](miscellaneous-functions.html#function_uuid-short).

  As funções não determinísticas não são consideradas inseguras. Embora essas funções não sejam determinísticas, elas são tratadas como seguras para fins de registro e replicação: [`CONNECTION_ID()`](information-functions.html#function_connection-id), [`CURDATE()`](date-and-time-functions.html#function_curdate), [`CURRENT_DATE()`](date-and-time-functions.html#function_current-date), [`CURRENT_TIME()`](date-and-time-functions.html#function_current-time), [`CURRENT_TIMESTAMP()`](date-and-time-functions.html#function_current-timestamp), [`CURTIME()`](date-and-time-functions.html#function_curtime), [`LAST_INSERT_ID()`](information-functions.html#function_last-insert-id), [`LOCALTIME()`](date-and-time-functions.html#function_localtime), [`LOCALTIMESTAMP()`](date-and-time-functions.html#function_localtimestamp), [`NOW()`](date-and-time-functions.html#function_now), [`UNIX_TIMESTAMP()`](date-and-time-functions.html#function_unix-timestamp), [`UTC_DATE()`](date-and-time-functions.html#function_utc-date), [`UTC_TIME()`](date-and-time-functions.html#function_utc-time), e [`UTC_TIMESTAMP()`](date-and-time-functions.html#function_utc-timestamp).

  Para obter mais informações, consulte [Seção 16.4.1.15, “Replicação e Funções do Sistema”](replication-features-functions.html).

- **Referências a variáveis do sistema.** A maioria das variáveis do sistema não é replicada corretamente usando o formato baseado em declarações. Consulte [Seção 16.4.1.37, “Replicação e Variáveis”](replication-features-variables.html). Para exceções, consulte [Seção 5.4.4.3, “Formato de Registro Binário Misto”](binary-log-mixed.html).

- **Funções carregáveis.** Como não temos controle sobre o que uma função carregável faz, devemos assumir que ela está executando instruções inseguras.

- **Plugin de texto completo.** Este plugin pode se comportar de maneira diferente em diferentes servidores MySQL; portanto, as declarações que dependem dele podem ter resultados diferentes. Por essa razão, todas as declarações que dependem do plugin de texto completo são tratadas como inseguras (Bug #11756280, Bug #48183).

- **O trigger ou a atualização de programas armazenados atualizam uma tabela que possui uma coluna AUTO_INCREMENT.** Isso é inseguro porque a ordem em que as linhas são atualizadas pode diferir entre a fonte e a réplica.

  Além disso, uma inserção em uma tabela que possui uma chave primária composta contendo uma coluna `AUTO_INCREMENT` que não é a primeira coluna dessa chave composta é insegura.

  Para mais informações, consulte [Seção 16.4.1.1, “Replicação e AUTO_INCREMENT”](replication-features-auto-increment.html).

- **INSERIR ... na cláusula UPDATE para tabelas com múltiplas chaves primárias ou únicas.** Quando executada em uma tabela que contém mais de uma chave primária ou única, essa cláusula é considerada insegura, pois é sensível à ordem em que o mecanismo de armazenamento verifica as chaves, que não é determinística, e da qual depende a escolha das linhas atualizadas pelo MySQL Server.

  Uma instrução [`INSERT ... ON DUPLICATE KEY UPDATE`](insert-on-duplicate.html) contra uma tabela que possui mais de uma chave única ou primária é marcada como insegura para replicação baseada em instruções. (Bug #11765650, Bug #58637)

- **Atualizações usando LIMIT.** A ordem em que as linhas são recuperadas não é especificada e, portanto, é considerada insegura. Consulte [Seção 16.4.1.17, “Replicação e LIMIT”](replication-features-limit.html).

- **Registro de acessos ou referências às tabelas de log.** O conteúdo da tabela de log do sistema pode diferir entre a fonte e a replica.

- **Operações não transacionais após operações transacionais.** Dentro de uma transação, permitir que quaisquer leituras ou escritas não transacionais sejam executadas após leituras ou escritas transacionais é considerado inseguro.

  Para mais informações, consulte [Seção 16.4.1.33, “Replicação e Transações”](replication-features-transactions.html).

- **Acesse ou faça referência a tabelas de autoregistro.** Todas as leituras e escritas em tabelas de autoregistro são consideradas inseguras. Dentro de uma transação, qualquer declaração que siga uma leitura ou escrita em tabelas de autoregistro também é considerada insegura.

- **Instruções `LOAD DATA`.** [`LOAD DATA`](load-data.html) é tratado como inseguro e, quando [`binlog_format=mixed`](replication-options-binary-log.html#sysvar_binlog_format) a instrução é registrada no formato de linha. Quando [`binlog_format=statement`](replication-options-binary-log.html#sysvar_binlog_format) [`LOAD DATA`](load-data.html) não gera uma mensagem de alerta, ao contrário de outras instruções inseguras.

- **Transações XA.** Se duas transações XA comprometidas em paralelo na fonte estiverem sendo preparadas na replica na ordem inversa, podem ocorrer dependências de bloqueio com a replicação baseada em declarações que não podem ser resolvidas com segurança, e é possível que a replicação falhe com um impasse na replica. Quando [`binlog_format=STATEMENT`](replication-options-binary-log.html#sysvar_binlog_format) é definido, as declarações DML dentro das transações XA são marcadas como inseguras e geram um aviso. Quando [`binlog_format=MIXED`](replication-options-binary-log.html#sysvar_binlog_format) ou [`binlog_format=ROW`](replication-options-binary-log.html#sysvar_binlog_format) é definido, as declarações DML dentro das transações XA são registradas usando a replicação baseada em linhas, e o problema potencial não está presente.

Para obter informações adicionais, consulte [Seção 16.4.1, “Recursos e problemas de replicação”](replication-features.html).
