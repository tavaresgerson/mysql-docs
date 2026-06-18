#### 16.2.1.3 Determinação de Statements Seguros e Não Seguros no Binary Logging

A “segurança” (safeness) de um Statement no MySQL Replication refere-se à capacidade de o Statement e seus efeitos serem replicados corretamente usando o formato baseado em Statement (statement-based format). Se isso for verdadeiro, referimo-nos ao Statement como seguro (safe); caso contrário, referimo-nos a ele como não seguro (unsafe).

Em geral, um Statement é seguro se for determinístico e não seguro se não for. No entanto, certas funções não determinísticas *não* são consideradas não seguras (veja Funções não determinísticas não consideradas não seguras, posteriormente nesta seção). Além disso, Statements que utilizam resultados de funções matemáticas de ponto flutuante (floating-point)—que dependem de hardware—são sempre considerados não seguros (veja Seção 16.4.1.12, “Replication e Valores de Ponto Flutuante”).

**Manuseio de Statements seguros e não seguros.** Um Statement é tratado de forma diferente dependendo se é considerado seguro e em relação ao formato de Binary Logging (ou seja, o valor atual de `binlog_format`).

* Quando usando logging baseado em Row (row-based logging), nenhuma distinção é feita no tratamento de Statements seguros e não seguros.

* Quando usando logging de formato misto (mixed-format logging), Statements sinalizados como não seguros são registrados usando o formato baseado em Row (row-based format); Statements considerados seguros são registrados usando o formato baseado em Statement (statement-based format).

* Quando usando logging baseado em Statement (statement-based logging), Statements sinalizados como não seguros geram um aviso (warning) para esse efeito. Statements seguros são registrados normalmente.

Cada Statement sinalizado como não seguro gera um warning. Anteriormente, se um grande número desses Statements fosse executado na source, isso poderia levar a arquivos de log de erro excessivamente grandes. Para evitar isso, o MySQL 5.7 fornece um mecanismo de supressão de warning, que se comporta da seguinte forma: Sempre que os 50 warnings mais recentes de `ER_BINLOG_UNSAFE_STATEMENT` forem gerados mais de 50 vezes em qualquer período de 50 segundos, a supressão de warning é ativada. Quando ativado, isso faz com que tais warnings não sejam escritos no error log; em vez disso, para cada 50 warnings desse tipo, uma nota `The last warning was repeated N times in last S seconds` é escrita no error log. Isso continua enquanto os 50 warnings mais recentes desse tipo forem emitidos em 50 segundos ou menos; assim que a taxa diminuir abaixo desse limite, os warnings são registrados normalmente novamente. A supressão de warning não afeta a forma como a segurança dos Statements para logging baseado em Statement é determinada, nem a forma como os warnings são enviados ao cliente. Clientes MySQL ainda recebem um warning para cada Statement.

Para mais informações, consulte Seção 16.2.1, “Replication Formats”.

**Statements considerados não seguros.** Statements com as seguintes características são considerados não seguros:

* **Statements contendo funções de sistema que podem retornar um valor diferente em uma Replica.** Essas funções incluem `FOUND_ROWS()`, `GET_LOCK()`, `IS_FREE_LOCK()`, `IS_USED_LOCK()`, `LOAD_FILE()`, `MASTER_POS_WAIT()`, `PASSWORD()`, `RAND()`, `RELEASE_LOCK()`, `ROW_COUNT()`, `SESSION_USER()`, `SLEEP()`, `SYSDATE()`, `SYSTEM_USER()`, `USER()`, `UUID()` e `UUID_SHORT()`.

  **Funções não determinísticas não consideradas não seguras.** Embora essas funções não sejam determinísticas, elas são tratadas como seguras para fins de logging e Replication: `CONNECTION_ID()`, `CURDATE()`, `CURRENT_DATE()`, `CURRENT_TIME()`, `CURRENT_TIMESTAMP()`, `CURTIME()`, `LAST_INSERT_ID()`, `LOCALTIME()`, `LOCALTIMESTAMP()`, `NOW()`, `UNIX_TIMESTAMP()`, `UTC_DATE()`, `UTC_TIME()` e `UTC_TIMESTAMP()`.

  Para mais informações, consulte Seção 16.4.1.15, “Replication e Funções de Sistema”.

* **Referências a variáveis de sistema.** A maioria das variáveis de sistema não é replicada corretamente usando o formato baseado em Statement. Consulte Seção 16.4.1.37, “Replication e Variáveis”. Para exceções, consulte Seção 5.4.4.3, “Mixed Binary Logging Format”.

* **Funções Carregáveis (Loadable Functions).** Uma vez que não temos controle sobre o que uma função carregável faz, devemos presumir que ela está executando Statements não seguros.

* **Plugin Fulltext.** Este Plugin pode se comportar de maneira diferente em diferentes servidores MySQL; portanto, Statements que dependem dele podem ter resultados diferentes. Por esse motivo, todos os Statements que dependem do Plugin Fulltext são tratados como não seguros (Bug #11756280, Bug #48183).

* **Um Trigger ou programa armazenado (stored program) atualiza uma tabela que possui uma coluna AUTO_INCREMENT.** Isso é não seguro porque a ordem na qual as Rows são atualizadas pode diferir na Source e na Replica.

  Além disso, um `INSERT` em uma tabela que possui uma Primary Key composta contendo uma coluna `AUTO_INCREMENT` que não é a primeira coluna desta chave composta é não seguro (unsafe).

  Para mais informações, consulte Seção 16.4.1.1, “Replication e AUTO_INCREMENT”.

* **Statements INSERT ... ON DUPLICATE KEY UPDATE em tabelas com múltiplas Primary Keys ou Unique Keys.** Quando executado em uma tabela que contém mais de uma Primary Key ou Unique Key, este Statement é considerado não seguro, sendo sensível à ordem em que o storage engine verifica as Keys, o que não é determinístico, e do qual depende a escolha de Rows atualizadas pelo MySQL Server.

  Um Statement `INSERT ... ON DUPLICATE KEY UPDATE` contra uma tabela que possui mais de uma Unique Key ou Primary Key é marcado como não seguro para statement-based replication. (Bug #11765650, Bug #58637)

* **Atualizações usando LIMIT.** A ordem na qual as Rows são recuperadas não é especificada e, portanto, é considerada não segura. Consulte Seção 16.4.1.17, “Replication e LIMIT”.

* **Acessos ou referências a tabelas de log.** O conteúdo da tabela de log do sistema pode diferir entre a Source e a Replica.

* **Operações não transacionais após operações transacionais.** Dentro de uma transaction, permitir que qualquer leitura ou escrita não transacional seja executada após qualquer leitura ou escrita transacional é considerado não seguro.

  Para mais informações, consulte Seção 16.4.1.33, “Replication e Transactions”.

* **Acessos ou referências a tabelas de auto-logging (self-logging).** Todas as leituras e escritas em tabelas de self-logging são consideradas não seguras. Dentro de uma transaction, qualquer Statement que siga uma leitura ou escrita em tabelas de self-logging também é considerado não seguro.

* **Statements LOAD DATA.** `LOAD DATA` é tratado como não seguro e, quando `binlog_format=mixed`, o Statement é registrado no formato baseado em Row (row-based format). Quando `binlog_format=statement`, o `LOAD DATA` não gera um warning, diferentemente de outros Statements não seguros.

* **Transações XA.** Se duas transações XA submetidas (committed) em paralelo na Source estiverem sendo preparadas na Replica na ordem inversa, dependências de Lock podem ocorrer com statement-based replication que não podem ser resolvidas com segurança, e é possível que a Replication falhe com deadlock na Replica. Quando `binlog_format=STATEMENT` está configurado, Statements DML dentro de transações XA são sinalizados como não seguros e geram um warning. Quando `binlog_format=MIXED` ou `binlog_format=ROW` está configurado, Statements DML dentro de transações XA são registrados usando row-based replication, e o problema potencial não está presente.

Para informações adicionais, consulte Seção 16.4.1, “Replication Features and Issues”.