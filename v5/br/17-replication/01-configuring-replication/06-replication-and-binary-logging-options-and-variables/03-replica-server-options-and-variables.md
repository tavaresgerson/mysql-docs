#### 16.1.6.3 Opções e Variáveis do Servidor Replica

Esta seção explica as opções do servidor e as variáveis de sistema que se aplicam a replicas e contém o seguinte:

* [Opções de Inicialização para Replicas](replication-options-replica.html#replication-optvars-slaves "Opções de Inicialização para Replicas")
* [Opções para Logar o Status da Replica em Tabelas](replication-options-replica.html#replication-options-replica-log-tables "Opções para Logar o Status da Replica em Tabelas")
* [Variáveis de Sistema Usadas em Replicas](replication-options-replica.html#replication-sysvars-slaves "Variáveis de Sistema Usadas em Replicas")

Especifique as opções na [linha de comando](command-line-options.html "4.2.2.1 Using Options on the Command Line") ou em um [arquivo de opções](option-files.html "4.2.2.2 Using Option Files"). Muitas das opções podem ser definidas enquanto o servidor está em execução usando a instrução [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement"). Especifique valores de variáveis de sistema usando a sintaxe [`SET`](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment").

**Server ID.** No source e em cada replica, você deve definir a variável de sistema [`server_id`](replication-options.html#sysvar_server_id) para estabelecer um ID de replicação único no intervalo de 1 a 232 − 1. "Único" significa que cada ID deve ser diferente de todos os outros IDs em uso por qualquer outro source ou replica na topologia de replicação. Exemplo de arquivo `my.cnf`:

```sql
[mysqld]
server-id=3
```

##### Opções de Inicialização para Replicas

Esta seção explica as opções de inicialização para controlar servidores replica. Muitas dessas opções podem ser definidas enquanto o servidor está em execução usando a instrução [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement"). Outras, como as opções `--replicate-*`, podem ser definidas apenas quando o servidor replica é iniciado. As variáveis de sistema relacionadas à replicação são discutidas posteriormente nesta seção.

* [`--log-warnings[=level]`](server-options.html#option_mysqld_log-warnings)

  <table frame="box" rules="all" summary="Propriedades para log-warnings"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--log-warnings[=#]</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr><tr><th>Variável de Sistema</th> <td><code>log_warnings</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>2</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo (plataformas 64-bit)</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Valor Máximo (plataformas 32-bit)</th> <td><code>4294967295</code></td> </tr> </tbody></table>

  Note

  A variável de sistema [`log_error_verbosity`](server-system-variables.html#sysvar_log_error_verbosity) é preferível e deve ser usada no lugar da opção [`--log-warnings`](server-options.html#option_mysqld_log-warnings) ou da variável de sistema [`log_warnings`](server-system-variables.html#sysvar_log_warnings). Para mais informações, consulte as descrições de [`log_error_verbosity`](server-system-variables.html#sysvar_log_error_verbosity) e [`log_warnings`](server-system-variables.html#sysvar_log_warnings). A opção de linha de comando [`--log-warnings`](server-options.html#option_mysqld_log-warnings) e a variável de sistema [`log_warnings`](server-system-variables.html#sysvar_log_warnings) estão descontinuadas; espere que sejam removidas em uma futura versão do MySQL.

  Faz com que o servidor registre mais mensagens no error log sobre o que está fazendo. Em relação à replicação, o servidor gera warnings sobre o sucesso da reconexão após uma falha de rede ou conexão, e fornece informações sobre como cada thread de replicação foi iniciado. Esta variável é definida como 2 por padrão. Para desativá-la, defina-a como 0. O servidor registra mensagens sobre instruções que não são seguras para o Statement-Based Logging se o valor for maior que 0. Conexões abortadas e erros de acesso negado para novas tentativas de conexão são registrados se o valor for maior que 1. Consulte [Seção B.3.2.9, “Communication Errors and Aborted Connections”](communication-errors.html "B.3.2.9 Communication Errors and Aborted Connections").

  Note

  Os efeitos desta opção não se limitam à replicação. Ela afeta mensagens de diagnóstico em todo o espectro de atividades do servidor.

* [`--master-info-file=file_name`](replication-options-replica.html#option_mysqld_master-info-file)

  <table frame="box" rules="all" summary="Propriedades para master-info-file"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--master-info-file=file_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do Arquivo</td> </tr><tr><th>Valor Padrão</th> <td><code>master.info</code></td> </tr> </tbody></table>

  O nome a ser usado para o arquivo no qual a replica registra informações sobre o source. O nome padrão é `master.info` no diretório de dados. Para obter informações sobre o formato deste arquivo, consulte [Seção 16.2.4.2, “Replication Metadata Repositories”](replica-logs-status.html "16.2.4.2 Replication Metadata Repositories").

* [`--master-retry-count=count`](replication-options-replica.html#option_mysqld_master-retry-count)

  <table frame="box" rules="all" summary="Propriedades para master-retry-count"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--master-retry-count=#</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>86400</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo (plataformas 64-bit)</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Valor Máximo (plataformas 32-bit)</th> <td><code>4294967295</code></td> </tr> </tbody></table>

  O número de vezes que a replica tenta se reconectar ao source antes de desistir. O valor padrão é 86400 vezes. Um valor de 0 significa "infinito", e a replica tenta se conectar para sempre. As tentativas de reconexão são acionadas quando a replica atinge seu timeout de conexão (especificado pela variável de sistema [`slave_net_timeout`](replication-options-replica.html#sysvar_slave_net_timeout)) sem receber dados ou um sinal de heartbeat do source. A reconexão é tentada em intervalos definidos pela opção `MASTER_CONNECT_RETRY` da instrução [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") (que é padronizada para a cada 60 segundos).

  Esta opção está descontinuada; espere que seja removida em uma futura versão do MySQL. Use a opção `MASTER_RETRY_COUNT` da instrução [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") em seu lugar.

* [`--max-relay-log-size=size`](replication-options-replica.html#option_mysqld_max-relay-log-size)

  <table frame="box" rules="all" summary="Propriedades para max_relay_log_size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--max-relay-log-size=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>max_relay_log_size</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>0</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>1073741824</code></td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr><tr><th>Tamanho do Bloco</th> <td><code>4096</code></td> </tr> </tbody></table>

  O tamanho no qual o servidor rotaciona os relay log files automaticamente. Se este valor for diferente de zero, o relay log é rotacionado automaticamente quando seu tamanho excede este valor. Se este valor for zero (o padrão), o tamanho no qual a rotação do relay log ocorre é determinado pelo valor de [`max_binlog_size`](replication-options-binary-log.html#sysvar_max_binlog_size). Para mais informações, consulte [Seção 16.2.4.1, “The Relay Log”](replica-logs-relaylog.html "16.2.4.1 The Relay Log").

* [`--relay-log-purge={0|1}`](replication-options-replica.html#option_mysqld_relay-log-purge)

  <table frame="box" rules="all" summary="Propriedades para relay_log_purge"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--relay-log-purge[={OFF|ON}]</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>relay_log_purge</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr> </tbody></table>

  Desativa ou ativa a purga automática dos relay logs assim que eles não forem mais necessários. O valor padrão é 1 (ativado). Esta é uma variável global que pode ser alterada dinamicamente com `SET GLOBAL relay_log_purge = N`. Desativar a purga dos relay logs ao habilitar a opção [`--relay-log-recovery`](replication-options-replica.html#sysvar_relay_log_recovery) coloca a consistência dos dados em risco.

* [`--relay-log-space-limit=size`](replication-options-replica.html#option_mysqld_relay-log-space-limit)

  <table frame="box" rules="all" summary="Propriedades para relay_log_space_limit"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--relay-log-space-limit=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>relay_log_space_limit</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>0</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr> </tbody></table>

  Esta opção impõe um limite superior no tamanho total em bytes de todos os relay logs na replica. Um valor de 0 significa "sem limite". Isso é útil para um host de servidor replica que tem espaço em disco limitado. Quando o limite é atingido, o replication I/O thread para de ler binary log events do source até que o replication SQL thread tenha alcançado e excluído alguns relay logs não utilizados. Note que este limite não é absoluto: Há casos em que o SQL thread precisa de mais eventos antes que possa excluir relay logs. Nesse caso, o I/O thread excede o limite até que se torne possível para o SQL thread excluir alguns relay logs, pois não fazê-lo causaria um deadlock. Você não deve definir [`--relay-log-space-limit`](replication-options-replica.html#option_mysqld_relay-log-space-limit) para menos do que o dobro do valor de [`--max-relay-log-size`](replication-options-replica.html#option_mysqld_max-relay-log-size) (ou [`--max-binlog-size`](replication-options-binary-log.html#sysvar_max_binlog_size) se [`--max-relay-log-size`](replication-options-replica.html#option_mysqld_max-relay-log-size) for 0). Nesse caso, existe a chance de o I/O thread esperar por espaço livre porque [`--relay-log-space-limit`](replication-options-replica.html#option_mysqld_relay-log-space-limit) é excedido, mas o SQL thread não tem relay log para purgar e é incapaz de satisfazer o I/O thread. Isso força o I/O thread a ignorar [`--relay-log-space-limit`](replication-options-replica.html#option_mysqld_relay-log-space-limit) temporariamente.

* [`--replicate-do-db=db_name`](replication-options-replica.html#option_mysqld_replicate-do-db)

  <table frame="box" rules="all" summary="Propriedades para replicate-do-db"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--replicate-do-db=name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr> </tbody></table>

  Cria um replication filter usando o nome de um Database. Tais filtros também podem ser criados usando a instrução [`CHANGE REPLICATION FILTER REPLICATE_DO_DB`](change-replication-filter.html "13.4.2.2 CHANGE REPLICATION FILTER Statement"). O efeito preciso desta filtragem depende se a Statement-Based Replication ou a Row-Based Replication está em uso, e são descritos nos próximos parágrafos.

  Important

  Replication filters não podem ser usados em uma instância de servidor MySQL configurada para Group Replication, porque a filtragem de transações em alguns servidores tornaria o grupo incapaz de chegar a um acordo sobre um estado consistente.

  **Statement-based replication.** Instrua o replication SQL thread a restringir a replicação a instruções onde o Database padrão (ou seja, aquele selecionado por [`USE`](use.html "13.8.4 USE Statement")) é *`db_name`*. Para especificar mais de um Database, use esta opção várias vezes, uma para cada Database; no entanto, fazer isso *não* replica instruções cross-database, como `UPDATE some_db.some_table SET foo='bar'` enquanto um Database diferente (ou nenhum Database) está selecionado.

  Warning

  Para especificar múltiplos Databases, você *deve* usar múltiplas instâncias desta opção. Como os nomes de Databases podem conter vírgulas, se você fornecer uma lista separada por vírgulas, a lista será tratada como o nome de um único Database.

  Um exemplo do que não funciona como você esperaria ao usar Statement-Based Replication: Se a replica for iniciada com [`--replicate-do-db=sales`](replication-options-replica.html#option_mysqld_replicate-do-db) e você emitir as seguintes instruções no source, a instrução [`UPDATE`](update.html "13.2.11 UPDATE Statement") *não* será replicada:

  ```sql
  USE prices;
  UPDATE sales.january SET amount=amount+1000;
  ```

  A principal razão para este comportamento de "verificar apenas o Database padrão" é que é difícil saber, apenas pela instrução, se ela deve ser replicada (por exemplo, se você estiver usando instruções [`DELETE`](delete.html "13.2.2 DELETE Statement") de múltiplas tabelas ou instruções [`UPDATE`](update.html "13.2.11 UPDATE Statement") de múltiplas tabelas que atuam em vários Databases). Também é mais rápido verificar apenas o Database padrão em vez de todos os Databases se não houver necessidade.

  **Row-based replication.** Instrua o replication SQL thread a restringir a replicação ao Database *`db_name`*. Apenas as tabelas pertencentes a *`db_name`* são alteradas; o Database atual não tem efeito sobre isso. Suponha que a replica seja iniciada com [`--replicate-do-db=sales`](replication-options-replica.html#option_mysqld_replicate-do-db) e a Row-Based Replication esteja em vigor, e as seguintes instruções sejam executadas no source:

  ```sql
  USE prices;
  UPDATE sales.february SET amount=amount+100;
  ```

  A tabela `february` no Database `sales` na replica é alterada de acordo com a instrução [`UPDATE`](update.html "13.2.11 UPDATE Statement"); isso ocorre independentemente de a instrução [`USE`](use.html "13.8.4 USE Statement") ter sido emitida ou não. No entanto, a emissão das seguintes instruções no source não tem efeito na replica ao usar Row-Based Replication e [`--replicate-do-db=sales`](replication-options-replica.html#option_mysqld_replicate-do-db):

  ```sql
  USE prices;
  UPDATE prices.march SET amount=amount-25;
  ```

  Mesmo que a instrução `USE prices` fosse alterada para `USE sales`, os efeitos da instrução [`UPDATE`](update.html "13.2.11 UPDATE Statement") ainda não seriam replicados.

  Outra diferença importante na forma como [`--replicate-do-db`](replication-options-replica.html#option_mysqld_replicate-do-db) é tratado na Statement-Based Replication em oposição à Row-Based Replication ocorre em relação a instruções que se referem a múltiplos Databases. Suponha que a replica seja iniciada com [`--replicate-do-db=db1`](replication-options-replica.html#option_mysqld_replicate-do-db), e as seguintes instruções sejam executadas no source:

  ```sql
  USE db1;
  UPDATE db1.table1, db2.table2 SET db1.table1.col1 = 10, db2.table2.col2 = 20;
  ```

  Se você estiver usando Statement-Based Replication, ambas as tabelas serão atualizadas na replica. No entanto, ao usar Row-Based Replication, apenas a `table1` é afetada na replica; uma vez que a `table2` está em um Database diferente, a `table2` na replica não é alterada pela instrução [`UPDATE`](update.html "13.2.11 UPDATE Statement"). Agora suponha que, em vez da instrução `USE db1`, uma instrução `USE db4` tenha sido usada:

  ```sql
  USE db4;
  UPDATE db1.table1, db2.table2 SET db1.table1.col1 = 10, db2.table2.col2 = 20;
  ```

  Neste caso, a instrução [`UPDATE`](update.html "13.2.11 UPDATE Statement") não teria efeito na replica ao usar Statement-Based Replication. No entanto, se você estiver usando Row-Based Replication, a instrução [`UPDATE`](update.html "13.2.11 UPDATE Statement") alteraria a `table1` na replica, mas não a `table2` — em outras palavras, apenas as tabelas no Database nomeado por [`--replicate-do-db`](replication-options-replica.html#option_mysqld_replicate-do-db) são alteradas, e a escolha do Database padrão não tem efeito neste comportamento.

  Se você precisar que as atualizações cross-database funcionem, use [`--replicate-wild-do-table=db_name.%`](replication-options-replica.html#option_mysqld_replicate-wild-do-table) em vez disso. Consulte [Seção 16.2.5, “How Servers Evaluate Replication Filtering Rules”](replication-rules.html "16.2.5 How Servers Evaluate Replication Filtering Rules").

  Note

  Esta opção afeta a replicação da mesma forma que [`--binlog-do-db`](replication-options-binary-log.html#option_mysqld_binlog-do-db) afeta o Binary Logging, e os efeitos do formato de replicação sobre como [`--replicate-do-db`](replication-options-replica.html#option_mysqld_replicate-do-db) afeta o comportamento de replicação são os mesmos dos efeitos do formato de logging sobre o comportamento de [`--binlog-do-db`](replication-options-binary-log.html#option_mysqld_binlog-do-db).

  Esta opção não tem efeito sobre as instruções [`BEGIN`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements"), [`COMMIT`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements"), ou [`ROLLBACK`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements").

* [`--replicate-ignore-db=db_name`](replication-options-replica.html#option_mysqld_replicate-ignore-db)

  <table frame="box" rules="all" summary="Propriedades para replicate-ignore-db"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--replicate-ignore-db=name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr> </tbody></table>

  Cria um replication filter usando o nome de um Database. Tais filtros também podem ser criados usando a instrução [`CHANGE REPLICATION FILTER REPLICATE_IGNORE_DB`](change-replication-filter.html "13.4.2.2 CHANGE REPLICATION FILTER Statement"). Assim como acontece com [`--replicate-do-db`](replication-options-replica.html#option_mysqld_replicate-do-db), o efeito preciso desta filtragem depende se a Statement-Based Replication ou a Row-Based Replication está em uso, e são descritos nos próximos parágrafos.

  Important

  Replication filters não podem ser usados em uma instância de servidor MySQL configurada para Group Replication, porque a filtragem de transações em alguns servidores tornaria o grupo incapaz de chegar a um acordo sobre um estado consistente.

  **Statement-based replication.** Instrua o replication SQL thread a não replicar nenhuma instrução onde o Database padrão (ou seja, aquele selecionado por [`USE`](use.html "13.8.4 USE Statement")) é *`db_name`*.

  **Row-based replication.** Instrua o replication SQL thread a não atualizar nenhuma tabela no Database *`db_name`*. O Database padrão não tem efeito.

  Ao usar Statement-Based Replication, o exemplo a seguir não funciona como você esperaria. Suponha que a replica seja iniciada com [`--replicate-ignore-db=sales`](replication-options-replica.html#option_mysqld_replicate-ignore-db) e você emita as seguintes instruções no source:

  ```sql
  USE prices;
  UPDATE sales.january SET amount=amount+1000;
  ```

  A instrução [`UPDATE`](update.html "13.2.11 UPDATE Statement") *é* replicada neste caso porque [`--replicate-ignore-db`](replication-options-replica.html#option_mysqld_replicate-ignore-db) se aplica apenas ao Database padrão (determinado pela instrução [`USE`](use.html "13.8.4 USE Statement")). Como o Database `sales` foi especificado explicitamente na instrução, a instrução não foi filtrada. No entanto, ao usar Row-Based Replication, os efeitos da instrução [`UPDATE`](update.html "13.2.11 UPDATE Statement") *não* são propagados para a replica, e a cópia da tabela `sales.january` da replica permanece inalterada; neste caso, [`--replicate-ignore-db=sales`](replication-options-replica.html#option_mysqld_replicate-ignore-db) faz com que *todas* as alterações feitas nas tabelas na cópia do Database `sales` do source sejam ignoradas pela replica.

  Para especificar mais de um Database a ser ignorado, use esta opção várias vezes, uma para cada Database. Como os nomes de Databases podem conter vírgulas, se você fornecer uma lista separada por vírgulas, a lista será tratada como o nome de um único Database.

  Você não deve usar esta opção se estiver usando atualizações cross-database e não quiser que essas atualizações sejam replicadas. Consulte [Seção 16.2.5, “How Servers Evaluate Replication Filtering Rules”](replication-rules.html "16.2.5 How Servers Evaluate Replication Filtering Rules").

  Se você precisar que as atualizações cross-database funcionem, use [`--replicate-wild-ignore-table=db_name.%`](replication-options-replica.html#option_mysqld_replicate-wild-ignore-table) em vez disso. Consulte [Seção 16.2.5, “How Servers Evaluate Replication Filtering Rules”](replication-rules.html "16.2.5 How Servers Evaluate Replication Filtering Rules").

  Note

  Esta opção afeta a replicação da mesma forma que [`--binlog-ignore-db`](replication-options-binary-log.html#option_mysqld_binlog-ignore-db) afeta o Binary Logging, e os efeitos do formato de replicação sobre como [`--replicate-ignore-db`](replication-options-replica.html#option_mysqld_replicate-ignore-db) afeta o comportamento de replicação são os mesmos dos efeitos do formato de logging sobre o comportamento de [`--binlog-ignore-db`](replication-options-binary-log.html#option_mysqld_binlog-ignore-db).

  Esta opção não tem efeito sobre as instruções [`BEGIN`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements"), [`COMMIT`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements"), ou [`ROLLBACK`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements").

* [`--replicate-do-table=db_name.tbl_name`](replication-options-replica.html#option_mysqld_replicate-do-table)

  <table frame="box" rules="all" summary="Propriedades para replicate-do-table"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--replicate-do-table=name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr> </tbody></table>

  Cria um replication filter instruindo o replication SQL thread a restringir a replicação a uma determinada tabela. Para especificar mais de uma tabela, use esta opção várias vezes, uma para cada tabela. Isso funciona tanto para atualizações cross-database quanto para atualizações de Database padrão, em contraste com [`--replicate-do-db`](replication-options-replica.html#option_mysqld_replicate-do-db). Consulte [Seção 16.2.5, “How Servers Evaluate Replication Filtering Rules”](replication-rules.html "16.2.5 How Servers Evaluate Replication Filtering Rules"). Você também pode criar tal filtro emitindo uma instrução [`CHANGE REPLICATION FILTER REPLICATE_DO_TABLE`](change-replication-filter.html "13.4.2.2 CHANGE REPLICATION FILTER Statement").

  Important

  Replication filters não podem ser usados em uma instância de servidor MySQL configurada para Group Replication, porque a filtragem de transações em alguns servidores tornaria o grupo incapaz de chegar a um acordo sobre um estado consistente.

  Esta opção afeta apenas instruções que se aplicam a tabelas. Não afeta instruções que se aplicam apenas a outros Database objects, como stored routines. Para filtrar instruções que operam em stored routines, use uma ou mais das opções `--replicate-*-db`.

* [`--replicate-ignore-table=db_name.tbl_name`](replication-options-replica.html#option_mysqld_replicate-ignore-table)

  <table frame="box" rules="all" summary="Propriedades para replicate-ignore-table"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--replicate-ignore-table=name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr> </tbody></table>

  Cria um replication filter instruindo o replication SQL thread a não replicar nenhuma instrução que atualize a tabela especificada, mesmo que quaisquer outras tabelas possam ser atualizadas pela mesma instrução. Para especificar mais de uma tabela a ser ignorada, use esta opção várias vezes, uma para cada tabela. Isso funciona para atualizações cross-database, em contraste com [`--replicate-ignore-db`](replication-options-replica.html#option_mysqld_replicate-ignore-db). Consulte [Seção 16.2.5, “How Servers Evaluate Replication Filtering Rules”](replication-rules.html "16.2.5 How Servers Evaluate Replication Filtering Rules"). Você também pode criar tal filtro emitindo uma instrução [`CHANGE REPLICATION FILTER REPLICATE_IGNORE_TABLE`](change-replication-filter.html "13.4.2.2 CHANGE REPLICATION FILTER Statement").

  Note

  Replication filters não podem ser usados em uma instância de servidor MySQL configurada para Group Replication, porque a filtragem de transações em alguns servidores tornaria o grupo incapaz de chegar a um acordo sobre um estado consistente.

  Esta opção afeta apenas instruções que se aplicam a tabelas. Não afeta instruções que se aplicam apenas a outros Database objects, como stored routines. Para filtrar instruções que operam em stored routines, use uma ou mais das opções `--replicate-*-db`.

* [`--replicate-rewrite-db=from_name->to_name`](replication-options-replica.html#option_mysqld_replicate-rewrite-db)

  <table frame="box" rules="all" summary="Propriedades para master-info-file"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--master-info-file=file_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do Arquivo</td> </tr><tr><th>Valor Padrão</th> <td><code>master.info</code></td> </tr> </tbody></table>

  Instrui a replica a criar um replication filter que traduz o Database especificado para *`to_name`* se ele era *`from_name`* no source. Apenas instruções envolvendo tabelas são afetadas, e não instruções como [`CREATE DATABASE`](create-database.html "13.1.11 CREATE DATABASE Statement"), [`DROP DATABASE`](drop-database.html "13.1.22 DROP DATABASE Statement"), e [`ALTER DATABASE`](alter-database.html "13.1.1 ALTER DATABASE Statement").

  Para especificar múltiplas reescritas, use esta opção várias vezes. O servidor usa a primeira com um valor *`from_name`* que corresponda. A tradução do nome do Database é feita *antes* que as regras `--replicate-*` sejam testadas. Você também pode criar tal filtro emitindo uma instrução [`CHANGE REPLICATION FILTER REPLICATE_REWRITE_DB`](change-replication-filter.html "13.4.2.2 CHANGE REPLICATION FILTER Statement").

  Se você usar a opção [`--replicate-rewrite-db`](replication-options-replica.html#option_mysqld_replicate-rewrite-db) na linha de comando e o caractere `>` for especial para o seu interpretador de comandos, coloque o valor da opção entre aspas. Por exemplo:

  ```sql
  $> mysqld --replicate-rewrite-db="olddb->newdb"
  ```

  O efeito da opção [`--replicate-rewrite-db`](replication-options-replica.html#option_mysqld_replicate-rewrite-db) difere dependendo se o formato de Binary Logging Statement-Based ou Row-Based é usado para a Query. Com o formato Statement-Based, as instruções DML são traduzidas com base no Database atual, conforme especificado pela instrução [`USE`](use.html "13.8.4 USE Statement"). Com o formato Row-Based, as instruções DML são traduzidas com base no Database onde a tabela modificada existe. As instruções DDL são sempre filtradas com base no Database atual, conforme especificado pela instrução [`USE`](use.html "13.8.4 USE Statement"), independentemente do formato de Binary Logging.

  Para garantir que a reescrita produza os resultados esperados, particularmente em combinação com outras opções de filtragem de replicação, siga estas recomendações ao usar a opção [`--replicate-rewrite-db`](replication-options-replica.html#option_mysqld_replicate-rewrite-db):

  + Crie os Databases *`from_name`* e *`to_name`* manualmente no source e na replica com nomes diferentes.

  + Se você usar o formato de Binary Logging Statement-Based ou Mixed, não use Queries cross-database e não especifique nomes de Databases nas Queries. Para instruções DDL e DML, confie na instrução [`USE`](use.html "13.8.4 USE Statement") para especificar o Database atual e use apenas o nome da tabela nas Queries.

  + Se você usar exclusivamente o formato de Binary Logging Row-Based, para instruções DDL, confie na instrução [`USE`](use.html "13.8.4 USE Statement") para especificar o Database atual e use apenas o nome da tabela nas Queries. Para instruções DML, você pode usar um nome de tabela totalmente qualificado (*`db`*.*`table`*) se desejar.

  Se estas recomendações forem seguidas, é seguro usar a opção [`--replicate-rewrite-db`](replication-options-replica.html#option_mysqld_replicate-rewrite-db) em combinação com opções de filtragem de replicação de nível de tabela, como [`--replicate-do-table`](replication-options-replica.html#option_mysqld_replicate-do-table).

  Note

  Replication filters globais não podem ser usados em uma instância de servidor MySQL configurada para Group Replication, porque a filtragem de transações em alguns servidores tornaria o grupo incapaz de chegar a um acordo sobre um estado consistente.

* [`--replicate-same-server-id`](replication-options-replica.html#option_mysqld_replicate-same-server-id)

  <table frame="box" rules="all" summary="Propriedades para master-info-file"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--master-info-file=file_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do Arquivo</td> </tr><tr><th>Valor Padrão</th> <td><code>master.info</code></td> </tr> </tbody></table>

  Deve ser usado em servidores replica. Geralmente, você deve usar a configuração padrão de 0, para evitar loops infinitos causados pela replicação circular. Se definido como 1, a replica não ignora eventos que tenham seu próprio server ID. Normalmente, isso é útil apenas em configurações raras. Não pode ser definido como 1 se [`log_slave_updates`](replication-options-binary-log.html#sysvar_log_slave_updates) estiver ativado. Por padrão, o replication I/O thread não grava binary log events no relay log se eles tiverem o server ID da replica (esta otimização ajuda a economizar uso de disco). Se você quiser usar [`--replicate-same-server-id`](replication-options-replica.html#option_mysqld_replicate-same-server-id), certifique-se de iniciar a replica com esta opção antes de fazer com que a replica leia seus próprios eventos que você deseja que o replication SQL thread execute.

* [`--replicate-wild-do-table=db_name.tbl_name`](replication-options-replica.html#option_mysqld_replicate-wild-do-table)

  <table frame="box" rules="all" summary="Propriedades para master-info-file"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--master-info-file=file_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do Arquivo</td> </tr><tr><th>Valor Padrão</th> <td><code>master.info</code></td> </tr> </tbody></table>

  Cria um replication filter instruindo o replication SQL thread a restringir a replicação a instruções onde qualquer uma das tabelas atualizadas corresponda aos padrões de Database e nome de tabela especificados. Os padrões podem conter os caracteres wildcard `%` e `_`, que têm o mesmo significado que para o operador de correspondência de padrão [`LIKE`](string-comparison-functions.html#operator_like). Para especificar mais de uma tabela, use esta opção várias vezes, uma para cada tabela. Isso funciona para atualizações cross-database. Consulte [Seção 16.2.5, “How Servers Evaluate Replication Filtering Rules”](replication-rules.html "16.2.5 How Servers Evaluate Replication Filtering Rules"). Você também pode criar tal filtro emitindo uma instrução [`CHANGE REPLICATION FILTER REPLICATE_WILD_DO_TABLE`](change-replication-filter.html "13.4.2.2 CHANGE REPLICATION FILTER Statement").

  Note

  Replication filters não podem ser usados em uma instância de servidor MySQL configurada para Group Replication, porque a filtragem de transações em alguns servidores tornaria o grupo incapaz de chegar a um acordo sobre um estado consistente.

  Esta opção se aplica a tabelas, views e triggers. Não se aplica a stored procedures e functions, ou events. Para filtrar instruções que operam nos últimos objetos, use uma ou mais das opções `--replicate-*-db`.

  Como exemplo, [`--replicate-wild-do-table=foo%.bar%`](replication-options-replica.html#option_mysqld_replicate-wild-do-table) replica apenas atualizações que usam uma tabela onde o nome do Database começa com `foo` e o nome da tabela começa com `bar`.

  Se o padrão de nome da tabela for `%`, ele corresponde a qualquer nome de tabela e a opção também se aplica a instruções de nível de Database ([`CREATE DATABASE`](create-database.html "13.1.11 CREATE DATABASE Statement"), [`DROP DATABASE`](drop-database.html "13.1.22 DROP DATABASE Statement"), e [`ALTER DATABASE`](alter-database.html "13.1.1 ALTER DATABASE Statement")). Por exemplo, se você usar [`--replicate-wild-do-table=foo%.%`](replication-options-replica.html#option_mysqld_replicate-wild-do-table), instruções de nível de Database serão replicadas se o nome do Database corresponder ao padrão `foo%`.

  Important

  Replication filters de nível de tabela são aplicados apenas a tabelas que são explicitamente mencionadas e operadas na Query. Eles não se aplicam a tabelas que são implicitamente atualizadas pela Query. Por exemplo, uma instrução [`GRANT`](grant.html "13.7.1.4 GRANT Statement"), que atualiza a tabela do sistema `mysql.user` mas não menciona essa tabela, não é afetada por um filtro que especifica `mysql.%` como o padrão wildcard.

  Para incluir caracteres wildcard literais nos padrões de nome de Database ou tabela, escape-os com uma barra invertida. Por exemplo, para replicar todas as tabelas de um Database chamado `my_own%db`, mas não replicar tabelas do Database `my1ownAABCdb`, você deve escapar os caracteres `_` e `%` desta forma: [`--replicate-wild-do-table=my_own\%db`](replication-options-replica.html#option_mysqld_replicate-wild-do-table). Se você usar a opção na linha de comando, pode ser necessário duplicar as barras invertidas ou colocar o valor da opção entre aspas, dependendo do seu interpretador de comandos. Por exemplo, com o shell **bash**, você precisaria digitar [`--replicate-wild-do-table=my_own\\%db`](replication-options-replica.html#option_mysqld_replicate-wild-do-table).

* [`--replicate-wild-ignore-table=db_name.tbl_name`](replication-options-replica.html#option_mysqld_replicate-wild-ignore-table)

  <table frame="box" rules="all" summary="Propriedades para master-info-file"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--master-info-file=file_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do Arquivo</td> </tr><tr><th>Valor Padrão</th> <td><code>master.info</code></td> </tr> </tbody></table>

  Cria um replication filter que impede o replication SQL thread de replicar uma instrução na qual qualquer tabela corresponda ao padrão wildcard fornecido. Para especificar mais de uma tabela a ser ignorada, use esta opção várias vezes, uma para cada tabela. Isso funciona para atualizações cross-database. Consulte [Seção 16.2.5, “How Servers Evaluate Replication Filtering Rules”](replication-rules.html "16.2.5 How Servers Evaluate Replication Filtering Rules"). Você também pode criar tal filtro emitindo uma instrução [`CHANGE REPLICATION FILTER REPLICATE_WILD_IGNORE_TABLE`](change-replication-filter.html "13.4.2.2 CHANGE REPLICATION FILTER Statement").

  Important

  Replication filters não podem ser usados em uma instância de servidor MySQL configurada para Group Replication, porque a filtragem de transações em alguns servidores tornaria o grupo incapaz de chegar a um acordo sobre um estado consistente.

  Como exemplo, [`--replicate-wild-ignore-table=foo%.bar%`](replication-options-replica.html#option_mysqld_replicate-wild-ignore-table) não replica atualizações que usam uma tabela onde o nome do Database começa com `foo` e o nome da tabela começa com `bar`.

  Para obter informações sobre como a correspondência funciona, consulte a descrição da opção [`--replicate-wild-do-table`](replication-options-replica.html#option_mysqld_replicate-wild-do-table). As regras para incluir caracteres wildcard literais no valor da opção são as mesmas para [`--replicate-wild-ignore-table`](replication-options-replica.html#option_mysqld_replicate-wild-ignore-table).

  Important

  Replication filters de nível de tabela são aplicados apenas a tabelas que são explicitamente mencionadas e operadas na Query. Eles não se aplicam a tabelas que são implicitamente atualizadas pela Query. Por exemplo, uma instrução [`GRANT`](grant.html "13.7.1.4 GRANT Statement"), que atualiza a tabela do sistema `mysql.user` mas não menciona essa tabela, não é afetada por um filtro que especifica `mysql.%` como o padrão wildcard.

  Se você precisar filtrar instruções [`GRANT`](grant.html "13.7.1.4 GRANT Statement") ou outras instruções administrativas, uma possível solução alternativa é usar o filtro [`--replicate-ignore-db`](replication-options-replica.html#option_mysqld_replicate-ignore-db). Este filtro opera no Database padrão que está em vigor, conforme determinado pela instrução [`USE`](use.html "13.8.4 USE Statement"). Você pode, portanto, criar um filtro para ignorar instruções para um Database que não é replicado, e então emitir a instrução [`USE`](use.html "13.8.4 USE Statement") para mudar o Database padrão para aquele imediatamente antes de emitir quaisquer instruções administrativas que você deseja ignorar. Na instrução administrativa, nomeie o Database real onde a instrução é aplicada.

  Por exemplo, se [`--replicate-ignore-db=nonreplicated`](replication-options-replica.html#option_mysqld_replicate-ignore-db) estiver configurado no servidor replica, a seguinte sequência de instruções fará com que a instrução [`GRANT`](grant.html "13.7.1.4 GRANT Statement") seja ignorada, porque o Database padrão `nonreplicated` está em vigor:

  ```sql
  USE nonreplicated;
  GRANT SELECT, INSERT ON replicated.t1 TO 'someuser'@'somehost';
  ```

* [`--skip-slave-start`](replication-options-replica.html#option_mysqld_skip-slave-start)

  <table frame="box" rules="all" summary="Propriedades para master-info-file"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--master-info-file=file_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do Arquivo</td> </tr><tr><th>Valor Padrão</th> <td><code>master.info</code></td> </tr> </tbody></table>

  Instrui o servidor replica a não iniciar os threads de replicação quando o servidor iniciar. Para iniciar os threads mais tarde, use uma instrução [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement").

* [`--slave-skip-errors=[err_code1,err_code2,...|all|ddl_exist_errors]`](replication-options-replica.html#option_mysqld_slave-skip-errors)

  <table frame="box" rules="all" summary="Propriedades para master-info-file"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--master-info-file=file_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do Arquivo</td> </tr><tr><th>Valor Padrão</th> <td><code>master.info</code></td> </tr> </tbody></table>

  Normalmente, a replicação para quando ocorre um erro na replica, o que lhe dá a oportunidade de resolver a inconsistência nos dados manualmente. Esta opção faz com que o replication SQL thread continue a replicação quando uma instrução retorna qualquer um dos erros listados no valor da opção.

  Não use esta opção a menos que você compreenda completamente por que está recebendo erros. Se não houver bugs em sua configuração de replicação e programas clientes, e nenhum bug no próprio MySQL, um erro que pare a replicação nunca deve ocorrer. O uso indiscriminado desta opção resulta em replicas ficando irremediavelmente fora de sincronia com o source, sem que você tenha ideia do porquê isso ocorreu.

  Para códigos de erro, você deve usar os números fornecidos pela mensagem de erro no error log da replica e na saída de [`SHOW SLAVE STATUS`](show-slave-status.html "13.7.5.34 SHOW SLAVE STATUS Statement"). [Apêndice B, *Error Messages and Common Problems*](error-handling.html "Appendix B Error Messages and Common Problems"), lista os códigos de erro do servidor.

  O valor abreviado `ddl_exist_errors` é equivalente à lista de códigos de erro `1007,1008,1050,1051,1054,1060,1061,1068,1091,1146`.

  Você também pode (mas não deve) usar o valor altamente não recomendado de `all` para fazer com que a replica ignore todas as mensagens de erro e continue, independentemente do que aconteça. Escusado será dizer que, se você usar `all`, não há garantias quanto à integridade dos seus dados. Por favor, não reclame (ou registre relatórios de bugs) neste caso se os dados da replica não estiverem nem perto do que estão no source. *Você foi avisado*.

  Esta opção não funciona da mesma forma ao replicar entre NDB Clusters, devido ao mecanismo interno [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") para verificar os números de sequência de epoch; assim que o `NDB` detecta um número de epoch ausente ou fora de sequência, ele para imediatamente o thread applier da replica.

  Exemplos:

  ```sql
  --slave-skip-errors=1062,1053
  --slave-skip-errors=all
  --slave-skip-errors=ddl_exist_errors
  ```

* [`--slave-sql-verify-checksum={0|1}`](replication-options-replica.html#option_mysqld_slave-sql-verify-checksum)

  <table frame="box" rules="all" summary="Propriedades para master-info-file"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--master-info-file=file_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do Arquivo</td> </tr><tr><th>Valor Padrão</th> <td><code>master.info</code></td> </tr> </tbody></table>

  Quando esta opção está ativada, a replica examina os checksums lidos do relay log. No caso de uma incompatibilidade, a replica para com um erro.

As seguintes opções são usadas internamente pelo conjunto de testes MySQL para testes e debugging de replicação. Elas não são destinadas ao uso em um ambiente de produção.

* [`--abort-slave-event-count`](replication-options-replica.html#option_mysqld_abort-slave-event-count)

  <table frame="box" rules="all" summary="Propriedades para master-info-file"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--master-info-file=file_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do Arquivo</td> </tr><tr><th>Valor Padrão</th> <td><code>master.info</code></td> </tr> </tbody></table>

  Quando esta opção é definida para algum inteiro positivo *`value`* diferente de 0 (o padrão), ela afeta o comportamento de replicação da seguinte forma: Depois que o replication SQL thread é iniciado, *`value`* log events podem ser executados; depois disso, o replication SQL thread não recebe mais nenhum evento, assim como se a conexão de rede do source fosse cortada. O replication SQL thread continua a ser executado, e a saída de [`SHOW SLAVE STATUS`](show-slave-status.html "13.7.5.34 SHOW SLAVE STATUS Statement") exibe `Yes` em ambas as colunas `Slave_IO_Running` e `Slave_SQL_Running`, mas nenhum outro evento é lido do relay log.

  Esta opção é usada internamente pelo conjunto de testes MySQL para testes e debugging de replicação. Ela não é destinada ao uso em um ambiente de produção.

* [`--disconnect-slave-event-count`](replication-options-replica.html#option_mysqld_disconnect-slave-event-count)

  <table frame="box" rules="all" summary="Propriedades para master-info-file"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--master-info-file=file_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do Arquivo</td> </tr><tr><th>Valor Padrão</th> <td><code>master.info</code></td> </tr> </tbody></table>

  Esta opção é usada internamente pelo conjunto de testes MySQL para testes e debugging de replicação. Ela não é destinada ao uso em um ambiente de produção.

##### Opções para Logar o Status da Replica em Tabelas

O MySQL 5.7 suporta o logging de Replication Metadata em tabelas em vez de arquivos. A gravação do connection metadata repository e do applier metadata repository da replica pode ser configurada separadamente usando estas duas variáveis de sistema:

* [`master_info_repository`](replication-options-replica.html#sysvar_master_info_repository)
* [`relay_log_info_repository`](replication-options-replica.html#sysvar_relay_log_info_repository)

Para obter informações sobre essas variáveis, consulte [Seção 16.1.6.3, “Replica Server Options and Variables”](replication-options-replica.html "16.1.6.3 Replica Server Options and Variables").

Essas variáveis podem ser usadas para tornar uma replica resiliente a paradas inesperadas. Consulte [Seção 16.3.2, “Handling an Unexpected Halt of a Replica”](replication-solutions-unexpected-replica-halt.html "16.3.2 Handling an Unexpected Halt of a Replica"), para mais informações.

As tabelas de log de informações e seus conteúdos são considerados locais para uma determinada instância do MySQL Server. Elas não são replicadas, e as alterações nelas não são gravadas no Binary Log.

Para mais informações, consulte [Seção 16.2.4, “Relay Log and Replication Metadata Repositories”](replica-logs.html "16.2.4 Relay Log and Replication Metadata Repositories").

##### Variáveis de Sistema Usadas em Replicas

A lista a seguir descreve as variáveis de sistema para controlar servidores replica. Elas podem ser definidas na inicialização do servidor e algumas delas podem ser alteradas em tempo de execução usando [`SET`](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment"). As opções de servidor usadas com replicas estão listadas anteriormente nesta seção.

* [`init_slave`](replication-options-replica.html#sysvar_init_slave)

  <table frame="box" rules="all" summary="Propriedades para master-info-file"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--master-info-file=file_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do Arquivo</td> </tr><tr><th>Valor Padrão</th> <td><code>master.info</code></td> </tr> </tbody></table>

  Esta variável é semelhante a [`init_connect`](server-system-variables.html#sysvar_init_connect), mas é uma String a ser executada por um servidor replica cada vez que o replication SQL thread é iniciado. O formato da String é o mesmo que para a variável [`init_connect`](server-system-variables.html#sysvar_init_connect). A configuração desta variável entra em vigor para as instruções [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement") subsequentes.

  Note

  O replication SQL thread envia um reconhecimento ao cliente antes de executar [`init_slave`](replication-options-replica.html#sysvar_init_slave). Portanto, não é garantido que [`init_slave`](replication-options-replica.html#sysvar_init_slave) tenha sido executado quando [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement") retorna. Consulte [Seção 13.4.2.5, “START SLAVE Statement”](start-slave.html "13.4.2.5 START SLAVE Statement"), para mais informações.

* [`log_slow_slave_statements`](replication-options-replica.html#sysvar_log_slow_slave_statements)

  <table frame="box" rules="all" summary="Propriedades para master-retry-count"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--master-retry-count=#</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>86400</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo (plataformas 64-bit)</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Valor Máximo (plataformas 32-bit)</th> <td><code>4294967295</code></td> </tr> </tbody></table>

  Quando o slow query log está ativado, esta variável permite o logging para Queries que levaram mais de [`long_query_time`](server-system-variables.html#sysvar_long_query_time) segundos para serem executadas na replica. Note que se a Row-Based Replication estiver em uso ([`binlog_format=ROW`](replication-options-binary-log.html#sysvar_binlog_format)), [`log_slow_slave_statements`](replication-options-replica.html#sysvar_log_slow_slave_statements) não tem efeito. As Queries são adicionadas ao slow query log da replica apenas quando são logadas no Statement Format no Binary Log, ou seja, quando [`binlog_format=STATEMENT`](replication-options-binary-log.html#sysvar_binlog_format) está definido, ou quando [`binlog_format=MIXED`](replication-options-binary-log.html#sysvar_binlog_format) está definido e a instrução é logada no Statement Format. Queries lentas que são logadas no Row Format quando [`binlog_format=MIXED`](replication-options-binary-log.html#sysvar_binlog_format) está definido, ou que são logadas quando [`binlog_format=ROW`](replication-options-binary-log.html#sysvar_binlog_format) está definido, não são adicionadas ao slow query log da replica, mesmo que [`log_slow_slave_statements`](replication-options-replica.html#sysvar_log_slow_slave_statements) esteja ativado.

  A definição de [`log_slow_slave_statements`](replication-options-replica.html#sysvar_log_slow_slave_statements) não tem efeito imediato. O estado da variável se aplica a todas as instruções [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement") subsequentes. Note também que a configuração global para [`long_query_time`](server-system-variables.html#sysvar_long_query_time) se aplica durante a vida útil do SQL thread. Se você alterar essa configuração, você deve parar e reiniciar o replication SQL thread para implementar a alteração lá (por exemplo, emitindo as instruções [`STOP SLAVE`](stop-slave.html "13.4.2.6 STOP SLAVE Statement") e [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement") com a opção `SQL_THREAD`).

* [`master_info_repository`](replication-options-replica.html#sysvar_master_info_repository)

  <table frame="box" rules="all" summary="Propriedades para master-retry-count"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--master-retry-count=#</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>86400</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo (plataformas 64-bit)</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Valor Máximo (plataformas 32-bit)</th> <td><code>4294967295</code></td> </tr> </tbody></table>

  A configuração desta variável determina se a replica registra metadata sobre o source, consistindo em status e informações de conexão, em uma tabela `InnoDB` no Database do sistema `mysql`, ou como um arquivo no diretório de dados. Para mais informações sobre o connection metadata repository, consulte [Seção 16.2.4, “Relay Log and Replication Metadata Repositories”](replica-logs.html "16.2.4 Relay Log and Replication Metadata Repositories").

  A configuração padrão é `FILE`. Como arquivo, o connection metadata repository da replica é nomeado `master.info` por padrão. Você pode alterar este nome usando a opção [`--master-info-file`](replication-options-replica.html#option_mysqld_master-info-file).

  A configuração alternativa é `TABLE`. Como uma tabela `InnoDB`, o connection metadata repository da replica é nomeado `mysql.slave_master_info`. A configuração `TABLE` é necessária quando múltiplos replication channels estão configurados.

  Esta variável deve ser definida como `TABLE` antes de configurar múltiplos replication channels. Se você estiver usando múltiplos replication channels, não poderá reverter o valor para `FILE`.

  A configuração para a localização do connection metadata repository tem uma influência direta sobre o efeito da definição da variável de sistema [`sync_master_info`](replication-options-replica.html#sysvar_sync_master_info). Você só pode alterar a configuração quando nenhum thread de replicação estiver sendo executado.

* [`max_relay_log_size`](replication-options-replica.html#sysvar_max_relay_log_size)

  <table frame="box" rules="all" summary="Propriedades para master-retry-count"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--master-retry-count=#</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>86400</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo (plataformas 64-bit)</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Valor Máximo (plataformas 32-bit)</th> <td><code>4294967295</code></td> </tr> </tbody></table>

  Se uma gravação por uma replica em seu relay log fizer com que o tamanho do arquivo de log atual exceda o valor desta variável, a replica rotaciona os relay logs (fecha o arquivo atual e abre o próximo). Se [`max_relay_log_size`](replication-options-replica.html#sysvar_max_relay_log_size) for 0, o servidor usa [`max_binlog_size`](replication-options-binary-log.html#sysvar_max_binlog_size) tanto para o Binary Log quanto para o relay log. Se [`max_relay_log_size`](replication-options-replica.html#sysvar_max_relay_log_size) for maior que 0, ele restringe o tamanho do relay log, o que permite que você tenha tamanhos diferentes para os dois logs. Você deve definir [`max_relay_log_size`](replication-options-replica.html#sysvar_max_relay_log_size) para um valor entre 4096 bytes e 1GB (inclusive), ou para 0. O valor padrão é 0. Consulte [Seção 16.2.3, “Replication Threads”](replication-threads.html "16.2.3 Replication Threads").

* [`relay_log`](replication-options-replica.html#sysvar_relay_log)

  <table frame="box" rules="all" summary="Propriedades para master-retry-count"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--master-retry-count=#</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>86400</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo (plataformas 64-bit)</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Valor Máximo (plataformas 32-bit)</th> <td><code>4294967295</code></td> </tr> </tbody></table>

  O nome base para relay log files. Para o replication channel padrão, o nome base padrão para relay logs é `host_name-relay-bin`. Para replication channels não padrão, o nome base padrão para relay logs é `host_name-relay-bin-channel`, onde *`channel`* é o nome do replication channel registrado neste relay log.

  O servidor grava o arquivo no diretório de dados, a menos que o nome base seja fornecido com um nome de caminho absoluto inicial para especificar um diretório diferente. O servidor cria relay log files em sequência adicionando um sufixo numérico ao nome base.

  Devido à maneira como o MySQL analisa as opções do servidor, se você especificar esta variável na inicialização do servidor, você deve fornecer um valor; *o nome base padrão é usado apenas se a opção não for realmente especificada*. Se você especificar a variável de sistema [`relay_log`](replication-options-replica.html#sysvar_relay_log) na inicialização do servidor sem especificar um valor, é provável que ocorra um comportamento inesperado; este comportamento depende das outras opções usadas, da ordem em que são especificadas e se são especificadas na linha de comando ou em um arquivo de opções. Para obter mais informações sobre como o MySQL lida com as opções do servidor, consulte [Seção 4.2.2, “Specifying Program Options”](program-options.html "4.2.2 Specifying Program Options").

  Se você especificar esta variável, o valor especificado também será usado como o nome base para o relay log index file. Você pode substituir este comportamento especificando um nome base de relay log index file diferente usando a variável de sistema [`relay_log_index`](replication-options-replica.html#sysvar_relay_log_index).

  Quando o servidor lê uma entrada do index file, ele verifica se a entrada contém um caminho relativo. Se contiver, a parte relativa do caminho é substituída pelo caminho absoluto definido usando a variável de sistema [`relay_log`](replication-options-replica.html#sysvar_relay_log). Um caminho absoluto permanece inalterado; neste caso, o índice deve ser editado manualmente para permitir que o novo caminho ou caminhos sejam usados.

  Você pode achar a variável de sistema [`relay_log`](replication-options-replica.html#sysvar_relay_log) útil na execução das seguintes tarefas:

  + Criar relay logs cujos nomes são independentes dos nomes de host.

  + Se você precisar colocar os relay logs em alguma área diferente do diretório de dados porque seus relay logs tendem a ser muito grandes e você não quer diminuir [`max_relay_log_size`](replication-options-replica.html#sysvar_max_relay_log_size).

  + Para aumentar a velocidade usando balanceamento de carga entre discos.

  Você pode obter o nome do arquivo (e o caminho) do relay log na variável de sistema [`relay_log_basename`](replication-options-replica.html#sysvar_relay_log_basename).

* [`relay_log_basename`](replication-options-replica.html#sysvar_relay_log_basename)

  <table frame="box" rules="all" summary="Propriedades para master-retry-count"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--master-retry-count=#</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>86400</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo (plataformas 64-bit)</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Valor Máximo (plataformas 32-bit)</th> <td><code>4294967295</code></td> </tr> </tbody></table>

  Contém o nome base e o caminho completo para o relay log file. O comprimento máximo da variável é 256. Esta variável é definida pelo servidor e é Read Only.

* [`relay_log_index`](replication-options-replica.html#sysvar_relay_log_index)

  <table frame="box" rules="all" summary="Propriedades para master-retry-count"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--master-retry-count=#</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>86400</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo (plataformas 64-bit)</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Valor Máximo (plataformas 32-bit)</th> <td><code>4294967295</code></td> </tr> </tbody></table>

  O nome para o relay log index file. O comprimento máximo da variável é 256. Para o replication channel padrão, o nome padrão é `host_name-relay-bin.index`. Para replication channels não padrão, o nome padrão é `host_name-relay-bin-channel.index`, onde *`channel`* é o nome do replication channel registrado neste relay log index.

  O servidor grava o arquivo no diretório de dados, a menos que o nome seja fornecido com um nome de caminho absoluto inicial para especificar um diretório diferente.

  Devido à maneira como o MySQL analisa as opções do servidor, se você especificar esta variável na inicialização do servidor, você deve fornecer um valor; *o nome base padrão é usado apenas se a opção não for realmente especificada*. Se você especificar a variável de sistema [`relay_log_index`](replication-options-replica.html#sysvar_relay_log_index) na inicialização do servidor sem especificar um valor, é provável que ocorra um comportamento inesperado; este comportamento depende das outras opções usadas, da ordem em que são especificadas e se são especificadas na linha de comando ou em um arquivo de opções. Para obter mais informações sobre como o MySQL lida com as opções do servidor, consulte [Seção 4.2.2, “Specifying Program Options”](program-options.html "4.2.2 Specifying Program Options").

* [`relay_log_info_file`](replication-options-replica.html#sysvar_relay_log_info_file)

  <table frame="box" rules="all" summary="Propriedades para master-retry-count"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--master-retry-count=#</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>86400</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo (plataformas 64-bit)</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Valor Máximo (plataformas 32-bit)</th> <td><code>4294967295</code></td> </tr> </tbody></table>

  O nome do arquivo no qual a replica registra informações sobre os relay logs, quando [`relay_log_info_repository=FILE`](replication-options-replica.html#sysvar_relay_log_info_repository). Se [`relay_log_info_repository=TABLE`](replication-options-replica.html#sysvar_relay_log_info_repository), é o nome do arquivo que seria usado caso o repository fosse alterado para `FILE`). O nome padrão é `relay-log.info` no diretório de dados. Para obter informações sobre o applier metadata repository, consulte [Seção 16.2.4.2, “Replication Metadata Repositories”](replica-logs-status.html "16.2.4.2 Replication Metadata Repositories").

* [`relay_log_info_repository`](replication-options-replica.html#sysvar_relay_log_info_repository)

  <table frame="box" rules="all" summary="Propriedades para master-retry-count"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--master-retry-count=#</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>86400</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo (plataformas 64-bit)</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Valor Máximo (plataformas 32-bit)</th> <td><code>4294967295</code></td> </tr> </tbody></table>

  A configuração desta variável determina se o servidor replica armazena seu applier metadata repository como uma tabela `InnoDB` no Database do sistema `mysql`, ou como um arquivo no diretório de dados. Para mais informações sobre o applier metadata repository, consulte [Seção 16.2.4, “Relay Log and Replication Metadata Repositories”](replica-logs.html "16.2.4 Relay Log and Replication Metadata Repositories").

  A configuração padrão é `FILE`. Como arquivo, o applier metadata repository da replica é nomeado `relay-log.info` por padrão, e você pode alterar este nome usando a variável de sistema [`relay_log_info_file`](replication-options-replica.html#sysvar_relay_log_info_file).

  Com a configuração `TABLE`, como uma tabela `InnoDB`, o applier metadata repository da replica é nomeado `mysql.slave_relay_log_info`. A configuração `TABLE` é necessária quando múltiplos replication channels estão configurados. A configuração `TABLE` para o applier metadata repository da replica também é necessária para tornar a replicação resiliente a paradas inesperadas. Consulte [Seção 16.3.2, “Handling an Unexpected Halt of a Replica”](replication-solutions-unexpected-replica-halt.html "16.3.2 Handling an Unexpected Halt of a Replica") para mais informações.

  Esta variável deve ser definida como `TABLE` antes de configurar múltiplos replication channels. Se você estiver usando múltiplos replication channels, você não poderá reverter o valor para `FILE`.

  A configuração para a localização do applier metadata repository tem uma influência direta sobre o efeito da definição da variável de sistema [`sync_relay_log_info`](replication-options-replica.html#sysvar_sync_relay_log_info). Você só pode alterar a configuração quando nenhum thread de replicação estiver sendo executado.

* [`relay_log_purge`](replication-options-replica.html#sysvar_relay_log_purge)

  <table frame="box" rules="all" summary="Propriedades para master-retry-count"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--master-retry-count=#</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>86400</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo (plataformas 64-bit)</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Valor Máximo (plataformas 32-bit)</th> <td><code>4294967295</code></td> </tr> </tbody></table>

  Desativa ou ativa a purga automática dos relay log files assim que eles não forem mais necessários. O valor padrão é 1 (`ON`).

* [`relay_log_recovery`](replication-options-replica.html#sysvar_relay_log_recovery)

  <table frame="box" rules="all" summary="Propriedades para master-retry-count"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--master-retry-count=#</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>86400</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo (plataformas 64-bit)</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Valor Máximo (plataformas 32-bit)</th> <td><code>4294967295</code></td> </tr> </tbody></table>

  Se ativada, esta variável permite a recuperação automática do relay log imediatamente após a inicialização do servidor. O processo de recuperação cria um novo relay log file, inicializa a posição do SQL thread para este novo relay log e inicializa o I/O thread para a posição do SQL thread. A leitura do relay log do source então continua.

  Esta variável global é Read Only em tempo de execução. Seu valor pode ser definido com a opção [`--relay-log-recovery`](replication-options-replica.html#sysvar_relay_log_recovery) na inicialização do servidor replica, que deve ser usada após uma parada inesperada da replica para garantir que nenhum relay log possivelmente corrompido seja processado, e deve ser usada para garantir uma replica crash-safe. O valor padrão é 0 (desativado). Para obter informações sobre a combinação de configurações em uma replica que é mais resiliente a paradas inesperadas, consulte [Seção 16.3.2, “Handling an Unexpected Halt of a Replica”](replication-solutions-unexpected-replica-halt.html "16.3.2 Handling an Unexpected Halt of a Replica").

  Esta variável também interage com a variável [`relay_log_purge`](replication-options-replica.html#sysvar_relay_log_purge), que controla a purga de logs quando eles não são mais necessários. Ativar [`relay_log_recovery`](replication-options-replica.html#sysvar_relay_log_recovery) quando [`relay_log_purge`](replication-options-replica.html#sysvar_relay_log_purge) está desativado arrisca a leitura do relay log a partir de arquivos que não foram purgados, levando à inconsistência de dados.

  Para uma multithreaded replica (onde [`slave_parallel_workers`](replication-options-replica.html#sysvar_slave_parallel_workers) é maior que 0), a partir do MySQL 5.7.13, a definição de [`relay_log_recovery = ON`](replication-options-replica.html#sysvar_relay_log_recovery) lida automaticamente com quaisquer inconsistências e lacunas na sequência de transações que foram executadas a partir do relay log. Essas lacunas podem ocorrer quando a replicação baseada em posição de arquivo está em uso. (Para mais detalhes, consulte [Seção 16.4.1.32, “Replication and Transaction Inconsistencies”](replication-features-transaction-inconsistencies.html "16.4.1.32 Replication and Transaction Inconsistencies").) O processo de recuperação do relay log lida com as lacunas usando o mesmo método que a instrução [`START SLAVE UNTIL SQL_AFTER_MTS_GAPS`](start-slave.html "13.4.2.5 START SLAVE Statement") usaria. Quando a replica atinge um estado consistente e sem lacunas, o processo de recuperação do relay log continua a buscar mais transações do source começando na posição do replication SQL thread. Em versões do MySQL anteriores ao MySQL 5.7.13, esse processo não era automático e exigia iniciar o servidor com [`relay_log_recovery=0`](replication-options-replica.html#sysvar_relay_log_recovery), iniciar a replica com [`START SLAVE UNTIL SQL_AFTER_MTS_GAPS`](start-slave.html "13.4.2.5 START SLAVE Statement") para corrigir quaisquer inconsistências de transação e, em seguida, reiniciar a replica com [`relay_log_recovery=1`](replication-options-replica.html#sysvar_relay_log_recovery). Quando a replicação baseada em GTID está em uso, a partir do MySQL 5.7.28, uma multithreaded replica verifica primeiro se `MASTER_AUTO_POSITION` está definido como `ON` e, se estiver, omite a etapa de calcular as transações que devem ser puladas ou não puladas, de modo que os relay logs antigos não sejam necessários para o processo de recuperação.

  Note

  Esta variável não afeta os seguintes Group Replication channels:

  + `group_replication_applier`
  + `group_replication_recovery`

  Quaisquer outros channels em execução em um grupo são afetados, como um channel que está replicando de um source externo ou de outro grupo.

* [`relay_log_space_limit`](replication-options-replica.html#sysvar_relay_log_space_limit)

  <table frame="box" rules="all" summary="Propriedades para max_relay_log_size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--max-relay-log-size=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>max_relay_log_size</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>0</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>1073741824</code></td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr><tr><th>Tamanho do Bloco</th> <td><code>4096</code></td> </tr> </tbody></table>

  A quantidade máxima de espaço a ser usada para todos os relay logs.

* [`replication_optimize_for_static_plugin_config`](replication-options-replica.html#sysvar_replication_optimize_for_static_plugin_config)

  <table frame="box" rules="all" summary="Propriedades para max_relay_log_size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--max-relay-log-size=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>max_relay_log_size</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>0</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>1073741824</code></td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr><tr><th>Tamanho do Bloco</th> <td><code>4096</code></td> </tr> </tbody></table>

  Use shared locks e evite aquisições de Lock desnecessárias para melhorar o performance para Semi-Synchronous Replication. Enquanto esta variável de sistema estiver ativada, o plugin de Semi-Synchronous Replication não pode ser desinstalado, então você deve desativar a variável de sistema antes que a desinstalação possa ser concluída.

  Esta variável de sistema pode ser ativada antes ou depois de instalar o plugin de Semi-Synchronous Replication e pode ser ativada enquanto a replicação está em execução. Os source servers de Semi-Synchronous Replication também podem obter benefícios de performance ao ativar esta variável de sistema, pois usam os mesmos mecanismos de Lock que as replicas.

  [`replication_optimize_for_static_plugin_config`](replication-options-replica.html#sysvar_replication_optimize_for_static_plugin_config) pode ser ativado quando o Group Replication está em uso em um servidor. Nesse cenário, pode beneficiar o performance quando há contenção por Locks devido a altas cargas de trabalho.

* [`replication_sender_observe_commit_only`](replication-options-replica.html#sysvar_replication_sender_observe_commit_only)

  <table frame="box" rules="all" summary="Propriedades para max_relay_log_size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--max-relay-log-size=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>max_relay_log_size</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>0</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>1073741824</code></td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr><tr><th>Tamanho do Bloco</th> <td><code>4096</code></td> </tr> </tbody></table>

  Limita os Callbacks para melhorar o performance da Semi-Synchronous Replication. Esta variável de sistema pode ser ativada antes ou depois de instalar o plugin de Semi-Synchronous Replication e pode ser ativada enquanto a replicação está em execução. Os source servers de Semi-Synchronous Replication também podem obter benefícios de performance ao ativar esta variável de sistema, pois usam os mesmos mecanismos de Lock que as replicas.

* [`report_host`](replication-options-replica.html#sysvar_report_host)

  <table frame="box" rules="all" summary="Propriedades para max_relay_log_size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--max-relay-log-size=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>max_relay_log_size</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>0</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>1073741824</code></td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr><tr><th>Tamanho do Bloco</th> <td><code>4096</code></td> </tr> </tbody></table>

  O host name ou IP address da replica a ser reportado ao source durante o registro da replica. Este valor aparece na saída de [`SHOW SLAVE HOSTS`](show-slave-hosts.html "13.7.5.33 SHOW SLAVE HOSTS Statement") no source server. Deixe o valor não definido se você não quiser que a replica se registre no source.

  Note

  Não é suficiente que o source simplesmente leia o IP address da replica do socket TCP/IP depois que a replica se conecta. Devido a NAT e outros problemas de roteamento, esse IP pode não ser válido para se conectar à replica a partir do source ou de outros hosts.

* [`report_password`](replication-options-replica.html#sysvar_report_password)

  <table frame="box" rules="all" summary="Propriedades para max_relay_log_size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--max-relay-log-size=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>max_relay_log_size</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>0</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>1073741824</code></td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr><tr><th>Tamanho do Bloco</th> <td><code>4096</code></td> </tr> </tbody></table>

  A Password da conta do usuário de replicação da replica a ser reportada ao source durante o registro da replica. Este valor aparece na saída de [`SHOW SLAVE HOSTS`](show-slave-hosts.html "13.7.5.33 SHOW SLAVE HOSTS Statement") no source server se o source foi iniciado com [`--show-slave-auth-info`](replication-options-source.html#option_mysqld_show-slave-auth-info).

  Embora o nome desta variável possa implicar o contrário, [`report_password`](replication-options-replica.html#sysvar_report_password) não está conectado ao sistema de privilégios de usuário do MySQL e, portanto, não é necessariamente (ou mesmo provável que seja) o mesmo que a Password para a conta de usuário de replicação do MySQL.

* [`report_port`](replication-options-replica.html#sysvar_report_port)

  <table frame="box" rules="all" summary="Propriedades para max_relay_log_size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--max-relay-log-size=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>max_relay_log_size</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>0</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>1073741824</code></td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr><tr><th>Tamanho do Bloco</th> <td><code>4096</code></td> </tr> </tbody></table>

  O número da porta TCP/IP para conexão à replica, a ser reportado ao source durante o registro da replica. Defina isso apenas se a replica estiver escutando em uma porta não padrão ou se você tiver um tunnel especial do source ou de outros clientes para a replica. Se você não tiver certeza, não use esta opção.

  O valor padrão para esta opção é o número da porta realmente usado pela replica. Este também é o valor padrão exibido por [`SHOW SLAVE HOSTS`](show-slave-hosts.html "13.7.5.33 SHOW SLAVE HOSTS Statement").

* [`report_user`](replication-options-replica.html#sysvar_report_user)

  <table frame="box" rules="all" summary="Propriedades para max_relay_log_size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--max-relay-log-size=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>max_relay_log_size</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>0</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>1073741824</code></td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr><tr><th>Tamanho do Bloco</th> <td><code>4096</code></td> </tr> </tbody></table>

  O user name da conta da replica a ser reportado ao source durante o registro da replica. Este valor aparece na saída de [`SHOW SLAVE HOSTS`](show-slave-hosts.html "13.7.5.33 SHOW SLAVE HOSTS Statement") no source server se o source foi iniciado com [`--show-slave-auth-info`](replication-options-source.html#option_mysqld_show-slave-auth-info).

  Embora o nome desta variável possa implicar o contrário, [`report_user`](replication-options-replica.html#sysvar_report_user) não está conectado ao sistema de privilégios de usuário do MySQL e, portanto, não é necessariamente (ou mesmo provável que seja) o mesmo que o nome da conta de usuário de replicação do MySQL.

* [`rpl_semi_sync_slave_enabled`](replication-options-replica.html#sysvar_rpl_semi_sync_slave_enabled)

  <table frame="box" rules="all" summary="Propriedades para max_relay_log_size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--max-relay-log-size=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>max_relay_log_size</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>0</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>1073741824</code></td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr><tr><th>Tamanho do Bloco</th> <td><code>4096</code></td> </tr> </tbody></table>

  Controla se a Semi-Synchronous Replication está ativada na replica. Para ativar ou desativar o plugin, defina esta variável como `ON` ou `OFF` (ou 1 ou 0), respectivamente. O padrão é `OFF`.

  Esta variável está disponível apenas se o plugin de Semi-Synchronous Replication do lado da replica estiver instalado.

* [`rpl_semi_sync_slave_trace_level`](replication-options-replica.html#sysvar_rpl_semi_sync_slave_trace_level)

  <table frame="box" rules="all" summary="Propriedades para max_relay_log_size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--max-relay-log-size=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>max_relay_log_size</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>0</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>1073741824</code></td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr><tr><th>Tamanho do Bloco</th> <td><code>4096</code></td> </tr> </tbody></table>

  O nível de Debug Trace da Semi-Synchronous Replication na replica. Consulte [`rpl_semi_sync_master_trace_level`](replication-options-source.html#sysvar_rpl_semi_sync_master_trace_level) para os valores permitidos.

  Esta variável está disponível apenas se o plugin de Semi-Synchronous Replication do lado da replica estiver instalado.

* [`rpl_stop_slave_timeout`](replication-options-replica.html#sysvar_rpl_stop_slave_timeout)

  <table frame="box" rules="all" summary="Propriedades para max_relay_log_size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--max-relay-log-size=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>max_relay_log_size</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>0</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>1073741824</code></td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr><tr><th>Tamanho do Bloco</th> <td><code>4096</code></td> </tr> </tbody></table>

  Você pode controlar a duração (em segundos) que [`STOP SLAVE`](stop-slave.html "13.4.2.6 STOP SLAVE Statement") espera antes de atingir o timeout, definindo esta variável. Isso pode ser usado para evitar deadlocks entre `STOP SLAVE` e outras instruções SQL usando diferentes client connections para a replica.

  O valor máximo e padrão de `rpl_stop_slave_timeout` é 31536000 segundos (1 ano). O mínimo é 2 segundos. As alterações nesta variável entram em vigor para as instruções [`STOP SLAVE`](stop-slave.html "13.4.2.6 STOP SLAVE Statement") subsequentes.

  Esta variável afeta apenas o cliente que emite uma instrução `STOP SLAVE`. Quando o timeout é atingido, o cliente emissor retorna uma mensagem de erro indicando que a execução do comando está incompleta. O cliente então para de esperar que os threads de replicação parem, mas os threads de replicação continuam a tentar parar, e a instrução `STOP SLAVE` permanece em vigor. Assim que os threads de replicação não estiverem mais ocupados, a instrução `STOP SLAVE` é executada e a replica para.

* [`slave_checkpoint_group`](replication-options-replica.html#sysvar_slave_checkpoint_group)

  <table frame="box" rules="all" summary="Propriedades para relay_log_purge"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--relay-log-purge[={OFF|ON}]</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>relay_log_purge</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr> </tbody></table>

  Define o número máximo de transações que podem ser processadas por uma multithreaded replica antes que uma operação de checkpoint seja chamada para atualizar seu status conforme mostrado por [`SHOW SLAVE STATUS`](show-slave-status.html "13.7.5.34 SHOW SLAVE STATUS Statement"). A definição desta variável não tem efeito em replicas para as quais o multithreading não está ativado. A definição desta variável não tem efeito imediato. O estado da variável se aplica a todos os comandos [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement") subsequentes.

  Note

  Multithreaded replicas não são atualmente suportadas pelo NDB Cluster, que ignora silenciosamente a configuração desta variável. Consulte [Seção 21.7.3, “Known Issues in NDB Cluster Replication”](mysql-cluster-replication-issues.html "21.7.3 Known Issues in NDB Cluster Replication"), para mais informações.

  Esta variável funciona em combinação com a variável de sistema [`slave_checkpoint_period`](replication-options-replica.html#sysvar_slave_checkpoint_period) de tal forma que, quando qualquer um dos limites é excedido, o checkpoint é executado e os contadores que rastreiam tanto o número de transações quanto o tempo decorrido desde o último checkpoint são redefinidos.

  O valor mínimo permitido para esta variável é 32, a menos que o servidor tenha sido construído usando [`-DWITH_DEBUG`](source-configuration-options.html#option_cmake_with_debug), caso em que o valor mínimo é 1. O valor efetivo é sempre um múltiplo de 8; você pode defini-lo para um valor que não seja tal múltiplo, mas o servidor o arredonda para baixo para o próximo múltiplo inferior de 8 antes de armazenar o valor. (*Exceção*: Nenhum arredondamento é realizado pelo servidor de Debug.) Independentemente de como o servidor foi construído, o valor padrão é 512, e o valor máximo permitido é 524280.

* [`slave_checkpoint_period`](replication-options-replica.html#sysvar_slave_checkpoint_period)

  <table frame="box" rules="all" summary="Propriedades para relay_log_purge"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--relay-log-purge[={OFF|ON}]</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>relay_log_purge</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr> </tbody></table>

  Define o tempo máximo (em milissegundos) permitido para passar antes que uma operação de checkpoint seja chamada para atualizar o status de uma multithreaded replica conforme mostrado por [`SHOW SLAVE STATUS`](show-slave-status.html "13.7.5.34 SHOW SLAVE STATUS Statement"). A definição desta variável não tem efeito em replicas para as quais o multithreading não está ativado. A definição desta variável entra em vigor imediatamente para todos os replication channels, incluindo channels em execução.

  Note

  Multithreaded replicas não são atualmente suportadas pelo NDB Cluster, que ignora silenciosamente a configuração desta variável. Consulte [Seção 21.7.3, “Known Issues in NDB Cluster Replication”](mysql-cluster-replication-issues.html "21.7.3 Known Issues in NDB Cluster Replication"), para mais informações.

  Esta variável funciona em combinação com a variável de sistema [`slave_checkpoint_group`](replication-options-replica.html#sysvar_slave_checkpoint_group) de tal forma que, quando qualquer um dos limites é excedido, o checkpoint é executado e os contadores que rastreiam tanto o número de transações quanto o tempo decorrido desde o último checkpoint são redefinidos.

  O valor mínimo permitido para esta variável é 1, a menos que o servidor tenha sido construído usando [`-DWITH_DEBUG`](source-configuration-options.html#option_cmake_with_debug), caso em que o valor mínimo é 0. Independentemente de como o servidor foi construído, o valor padrão é 300 milissegundos e o valor máximo possível é 4294967295 milissegundos (aproximadamente 49,7 dias).

* [`slave_compressed_protocol`](replication-options-replica.html#sysvar_slave_compressed_protocol)

  <table frame="box" rules="all" summary="Propriedades para relay_log_purge"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--relay-log-purge[={OFF|ON}]</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>relay_log_purge</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr> </tbody></table>

  Define se deve usar a compressão do protocol source/replica se tanto o source quanto a replica o suportarem. Se esta variável estiver desativada (o padrão), as conexões não são compactadas. As alterações nesta variável entram em vigor nas tentativas de conexão subsequentes; isso inclui após a emissão de uma instrução [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement"), bem como reconexões feitas por um replication I/O thread em execução (por exemplo, após definir a opção `MASTER_RETRY_COUNT` para a instrução [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement")). Consulte também [Seção 4.2.6, “Connection Compression Control”](connection-compression-control.html "4.2.6 Connection Compression Control").

* [`slave_exec_mode`](replication-options-replica.html#sysvar_slave_exec_mode)

  <table frame="box" rules="all" summary="Propriedades para relay_log_purge"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--relay-log-purge[={OFF|ON}]</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>relay_log_purge</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr> </tbody></table>

  Controla como um thread de replicação resolve conflitos e erros durante a replicação. O modo `IDEMPOTENT` causa a supressão de erros de duplicate-key e no-key-found; `STRICT` significa que tal supressão não ocorre.

  O modo `IDEMPOTENT` destina-se ao uso em Multi-Source Replication, Replicação Circular e alguns outros cenários especiais de NDB Cluster Replication. (Consulte [Seção 21.7.10, “NDB Cluster Replication: Bidirectional and Circular Replication”](mysql-cluster-replication-multi-source.html "21.7.10 NDB Cluster Replication: Bidirectional and Circular Replication"), e [Seção 21.7.11, “NDB Cluster Replication Conflict Resolution”](mysql-cluster-replication-conflict-resolution.html "21.7.11 NDB Cluster Replication Conflict Resolution"), para mais informações.) O NDB Cluster ignora qualquer valor explicitamente definido para [`slave_exec_mode`](replication-options-replica.html#sysvar_slave_exec_mode) e sempre o trata como `IDEMPOTENT`.

  No MySQL Server 5.7, o modo `STRICT` é o valor padrão.

  Para Storage Engines que não sejam [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"), *o modo `IDEMPOTENT` deve ser usado apenas quando você tiver certeza absoluta de que erros de duplicate-key e erros de key-not-found podem ser ignorados com segurança*. Destina-se a ser usado em cenários de fail-over para NDB Cluster onde a Multi-Source Replication ou Replicação Circular é empregada, e não é recomendado para uso em outros casos.

* [`slave_load_tmpdir`](replication-options-replica.html#sysvar_slave_load_tmpdir)

  <table frame="box" rules="all" summary="Propriedades para relay_log_purge"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--relay-log-purge[={OFF|ON}]</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>relay_log_purge</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr> </tbody></table>

  O nome do diretório onde a replica cria temporary files. A definição desta variável entra em vigor imediatamente para todos os replication channels, incluindo channels em execução. O valor da variável é por padrão igual ao valor da variável de sistema [`tmpdir`](server-system-variables.html#sysvar_tmpdir), ou o padrão que se aplica quando essa variável de sistema não é especificada.

  Quando o replication SQL thread replica uma instrução [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement"), ele extrai o arquivo a ser carregado do relay log para temporary files e, em seguida, os carrega na tabela. Se o arquivo carregado no source for enorme, os temporary files na replica também serão enormes. Portanto, pode ser aconselhável usar esta opção para instruir a replica a colocar temporary files em um diretório localizado em algum file system que tenha muito espaço disponível. Nesse caso, os relay logs também são enormes, então você também pode querer definir a variável de sistema [`relay_log`](replication-options-replica.html#sysvar_relay_log) para colocar os relay logs naquele file system.

  O diretório especificado por esta opção deve estar localizado em um file system baseado em disco (não um file system baseado em memória) para que os temporary files usados para replicar instruções [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement") possam sobreviver a reinicializações da máquina. O diretório também não deve ser um que seja limpo pelo sistema operacional durante o processo de inicialização do sistema. No entanto, a replicação pode agora continuar após uma reinicialização se os temporary files tiverem sido removidos.

* [`slave_max_allowed_packet`](replication-options-replica.html#sysvar_slave_max_allowed_packet)

  <table frame="box" rules="all" summary="Propriedades para relay_log_purge"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--relay-log-purge[={OFF|ON}]</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>relay_log_purge</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr> </tbody></table>

  Esta variável define o tamanho máximo do Packet para os replication SQL e I/O threads, de modo que grandes atualizações usando Row-Based Replication não causem falha na replicação porque uma atualização excedeu [`max_allowed_packet`](server-system-variables.html#sysvar_max_allowed_packet). A definição desta variável entra em vigor imediatamente para todos os replication channels, incluindo channels em execução.

  Esta variável global sempre tem um valor que é um múltiplo inteiro positivo de 1024; se você a definir para algum valor que não seja, o valor é arredondado para baixo para o próximo múltiplo superior de 1024 para ser armazenado ou usado; definir `slave_max_allowed_packet` como 0 faz com que 1024 seja usado. (Um warning de truncamento é emitido em todos esses casos.) O valor padrão e máximo é 1073741824 (1 GB); o mínimo é 1024.

* [`slave_net_timeout`](replication-options-replica.html#sysvar_slave_net_timeout)

  <table frame="box" rules="all" summary="Propriedades para relay_log_purge"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--relay-log-purge[={OFF|ON}]</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>relay_log_purge</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr> </tbody></table>

  O número de segundos a esperar por mais dados ou um sinal de heartbeat do source antes que a replica considere a conexão interrompida, aborte a leitura e tente reconectar. A definição desta variável não tem efeito imediato. O estado da variável se aplica a todos os comandos [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement") subsequentes.

  A primeira nova tentativa ocorre imediatamente após o timeout. O intervalo entre as novas tentativas é controlado pela opção `MASTER_CONNECT_RETRY` para a instrução [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement"), e o número de tentativas de reconexão é limitado pela opção `MASTER_RETRY_COUNT` para a instrução [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement").

  O intervalo de heartbeat, que impede que o timeout de conexão ocorra na ausência de dados se a conexão ainda estiver boa, é controlado pela opção `MASTER_HEARTBEAT_PERIOD` para a instrução [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement"). O intervalo de heartbeat é padronizado para metade do valor de [`slave_net_timeout`](replication-options-replica.html#sysvar_slave_net_timeout), e é registrado no connection metadata repository da replica e mostrado na tabela Performance Schema [`replication_connection_configuration`](performance-schema-replication-connection-configuration-table.html "25.12.11.1 The replication_connection_configuration Table"). Note que uma alteração no valor ou na configuração padrão de [`slave_net_timeout`](replication-options-replica.html#sysvar_slave_net_timeout) não altera automaticamente o intervalo de heartbeat, quer este tenha sido definido explicitamente ou esteja usando um padrão calculado anteriormente. Se o timeout de conexão for alterado, você também deve emitir [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") para ajustar o intervalo de heartbeat para um valor apropriado para que ele ocorra antes do timeout de conexão.

* [`slave_parallel_type`](replication-options-replica.html#sysvar_slave_parallel_type)

  <table frame="box" rules="all" summary="Propriedades para relay_log_purge"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--relay-log-purge[={OFF|ON}]</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>relay_log_purge</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr> </tbody></table>

  Ao usar uma multithreaded replica ([`slave_parallel_workers`](replication-options-replica.html#sysvar_slave_parallel_workers) é maior que 0), esta variável especifica a política usada para decidir quais transações podem ser executadas em paralelo na replica. A variável não tem efeito em replicas para as quais o multithreading não está ativado. Os valores possíveis são:

  + `LOGICAL_CLOCK`: As transações que fazem parte do mesmo Binary Log Group Commit em um source são aplicadas em paralelo em uma replica. As dependências entre transações são rastreadas com base em seus timestamps para fornecer paralelização adicional sempre que possível. Quando este valor é definido, a variável de sistema [`binlog_transaction_dependency_tracking`](replication-options-binary-log.html#sysvar_binlog_transaction_dependency_tracking) pode ser usada no source para especificar que write sets são usados para paralelização em vez de timestamps, se um write set estiver disponível para a transação e fornecer resultados aprimorados em comparação com timestamps.

  + `DATABASE`: Transações que atualizam Databases diferentes são aplicadas em paralelo. Este valor é apropriado apenas se os dados estiverem particionados em múltiplos Databases que estão sendo atualizados de forma independente e concorrente no source. Não deve haver restrições cross-database, pois tais restrições podem ser violadas na replica.

  Quando [`slave_preserve_commit_order`](replication-options-replica.html#sysvar_slave_preserve_commit_order) é `1`, [`slave_parallel_type`](replication-options-replica.html#sysvar_slave_parallel_type) deve ser `LOGICAL_CLOCK`.

  Todos os applier threads de replicação devem ser interrompidos antes de definir [`slave_parallel_type`](replication-options-replica.html#sysvar_slave_parallel_type).

  Quando sua topologia de replicação usa múltiplos níveis de replicas, `LOGICAL_CLOCK` pode alcançar menos paralelização para cada nível que a replica está longe do source. Você pode reduzir este efeito usando [`binlog_transaction_dependency_tracking`](replication-options-binary-log.html#sysvar_binlog_transaction_dependency_tracking) no source para especificar que write sets são usados em vez de timestamps para paralelização sempre que possível.

* [`slave_parallel_workers`](replication-options-replica.html#sysvar_slave_parallel_workers)

  <table frame="box" rules="all" summary="Propriedades para relay_log_purge"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--relay-log-purge[={OFF|ON}]</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>relay_log_purge</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr> </tbody></table>

  Define o número de applier threads para executar transações de replicação em paralelo. Definir esta variável para um número maior que 0 cria uma multithreaded replica com este número de applier threads. Quando definido como 0 (o padrão), a execução paralela é desativada e a replica usa um único applier thread. A definição de [`slave_parallel_workers`](replication-options-replica.html#sysvar_slave_parallel_workers) não tem efeito imediato. O estado da variável se aplica a todas as instruções [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement") subsequentes.

  Note

  Multithreaded replicas não são atualmente suportadas pelo NDB Cluster, que ignora silenciosamente a configuração desta variável. Consulte [Seção 21.7.3, “Known Issues in NDB Cluster Replication”](mysql-cluster-replication-issues.html "21.7.3 Known Issues in NDB Cluster Replication"), para mais informações.

  Uma multithreaded replica fornece execução paralela usando um coordinator thread e o número de applier threads configurado por esta variável. A forma como as transações são distribuídas entre os applier threads é configurada por [`slave_parallel_type`](replication-options-replica.html#sysvar_slave_parallel_type). As transações que a replica aplica em paralelo podem fazer Commit fora de ordem, a menos que [`slave_preserve_commit_order=1`](replication-options-replica.html#sysvar_slave_preserve_commit_order). Portanto, verificar a transação executada mais recentemente não garante que todas as transações anteriores do source tenham sido executadas na replica. Isso tem implicações para logging e recovery ao usar uma multithreaded replica. Por exemplo, em uma multithreaded replica, a instrução [`START SLAVE UNTIL`](start-slave.html "13.4.2.5 START SLAVE Statement") só suporta o uso de `SQL_AFTER_MTS_GAPS`.

  No MySQL 5.7, a nova tentativa de transações é suportada quando o multithreading está ativado em uma replica. Em versões anteriores, [`slave_transaction_retries`](replication-options-replica.html#sysvar_slave_transaction_retries) era tratado como igual a 0 ao usar multithreaded replicas.

  Multithreaded replicas não são atualmente suportadas pelo NDB Cluster. Consulte [Seção 21.7.3, “Known Issues in NDB Cluster Replication”](mysql-cluster-replication-issues.html "21.7.3 Known Issues in NDB Cluster Replication"), para mais informações sobre como o [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") lida com as configurações para esta variável.

* [`slave_pending_jobs_size_max`](replication-options-replica.html#sysvar_slave_pending_jobs_size_max)

  <table frame="box" rules="all" summary="Propriedades para relay_log_purge"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--relay-log-purge[={OFF|ON}]</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>relay_log_purge</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr> </tbody></table>

  Para multithreaded replicas, esta variável define a quantidade máxima de memória (em bytes) disponível para worker queues que contêm eventos ainda não aplicados. A definição desta variável não tem efeito em replicas para as quais o multithreading não está ativado. A definição desta variável não tem efeito imediato. O estado da variável se aplica a todos os comandos [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement") subsequentes.

  O valor mínimo possível para esta variável é 1024; o padrão é 16MB. O valor máximo possível é 18446744073709551615 (16 exabytes). Valores que não são múltiplos exatos de 1024 são arredondados para baixo para o próximo múltiplo superior de 1024 antes de serem armazenados.

  O valor desta variável é um soft limit e pode ser definido para corresponder à carga de trabalho normal. Se um evento excepcionalmente grande exceder este tamanho, a transação é retida até que todos os worker threads tenham queues vazias e, em seguida, processada. Todas as transações subsequentes são retidas até que a transação grande seja concluída.

* [`slave_preserve_commit_order`](replication-options-replica.html#sysvar_slave_preserve_commit_order)

  <table frame="box" rules="all" summary="Propriedades para relay_log_space_limit"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--relay-log-space-limit=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>relay_log_space_limit</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>0</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr> </tbody></table>

  Para multithreaded replicas, a configuração 1 para esta variável garante que as transações sejam externalizadas na replica na mesma ordem em que aparecem no relay log da replica e evita lacunas na sequência de transações que foram executadas a partir do relay log. Esta variável não tem efeito em replicas para as quais o multithreading não está ativado. Note que [`slave_preserve_commit_order=1`](replication-options-replica.html#sysvar_slave_preserve_commit_order) não preserva a ordem das atualizações DML não transacionais, portanto, estas podem fazer Commit antes das transações que as precedem no relay log, o que pode resultar em lacunas.

  [`slave_preserve_commit_order=1`](replication-options-replica.html#sysvar_slave_preserve_commit_order) exige que [`--log-bin`](replication-options-binary-log.html#option_mysqld_log-bin) e [`--log-slave-updates`](replication-options-binary-log.html#sysvar_log_slave_updates) estejam ativados na replica, e [`slave_parallel_type`](replication-options-replica.html#sysvar_slave_parallel_type) esteja definido como `LOGICAL_CLOCK`. Antes de alterar esta variável, todos os applier threads de replicação (para todos os replication channels, se você estiver usando múltiplos replication channels) devem ser interrompidos.

  Com [`slave_preserve_commit_order`](replication-options-replica.html#sysvar_slave_preserve_commit_order) ativado, o executing thread espera até que todas as transações anteriores sejam submetidas a Commit antes de fazer Commit. Enquanto o thread espera que outros workers façam Commit em suas transações, ele relata seu status como `Waiting for preceding transaction to commit`. (Antes do MySQL 5.7.8, isso era mostrado como `Waiting for its turn to commit`.) Ativar este modo em uma multithreaded replica garante que ela nunca entre em um estado em que o source não estava. Isso suporta o uso de replicação para Read Scale-Out. Consulte [Seção 16.3.4, “Using Replication for Scale-Out”](replication-solutions-scaleout.html "16.3.4 Using Replication for Scale-Out").

  Se [`slave_preserve_commit_order`](replication-options-replica.html#sysvar_slave_preserve_commit_order) for `0`, as transações que a replica aplica em paralelo podem fazer Commit fora de ordem. Portanto, verificar a transação executada mais recentemente não garante que todas as transações anteriores do source tenham sido executadas na replica. Existe uma chance de lacunas na sequência de transações que foram executadas a partir do relay log da replica. Isso tem implicações para logging e recovery ao usar uma multithreaded replica. Note que a configuração [`slave_preserve_commit_order=1`](replication-options-replica.html#sysvar_slave_preserve_commit_order) evita lacunas, mas não impede o lag de posição do Binary Log do source (onde `Exec_master_log_pos` está atrás da posição até a qual as transações foram executadas). Consulte [Seção 16.4.1.32, “Replication and Transaction Inconsistencies”](replication-features-transaction-inconsistencies.html "16.4.1.32 Replication and Transaction Inconsistencies") para mais informações.

* [`slave_rows_search_algorithms`](replication-options-replica.html#sysvar_slave_rows_search_algorithms)

  <table frame="box" rules="all" summary="Propriedades para relay_log_space_limit"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--relay-log-space-limit=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>relay_log_space_limit</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>0</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr> </tbody></table>

  Ao preparar batches de linhas para Row-Based Logging e replicação, esta variável controla como as linhas são pesquisadas por correspondências, em particular se as hash scans são usadas. A definição desta variável entra em vigor imediatamente para todos os replication channels, incluindo channels em execução.

  Especifique uma lista separada por vírgulas das seguintes combinações de 2 valores da lista `INDEX_SCAN`, `TABLE_SCAN`, `HASH_SCAN`. O valor é esperado como uma String, portanto, se definido em tempo de execução em vez de na inicialização do servidor, o valor deve ser citado. Além disso, o valor não deve conter espaços. As combinações (listas) recomendadas e seus efeitos são mostrados na tabela a seguir:

  <table frame="box" rules="all" summary="Propriedades para relay_log_space_limit"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--relay-log-space-limit=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>relay_log_space_limit</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>0</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr> </tbody></table>

  + O valor padrão é `INDEX_SCAN,TABLE_SCAN`, o que significa que todas as pesquisas que podem usar Indexes os usam, e as pesquisas sem Indexes usam table scans.

  + Para usar hashing para quaisquer pesquisas que não usem uma Primary Key ou Unique Key, defina `INDEX_SCAN,HASH_SCAN`. Especificar `INDEX_SCAN,HASH_SCAN` tem o mesmo efeito que especificar `INDEX_SCAN,TABLE_SCAN,HASH_SCAN`, o que é permitido.

  + Não use a combinação `TABLE_SCAN,HASH_SCAN`. Esta configuração força o hashing para todas as pesquisas. Não tem vantagem sobre `INDEX_SCAN,HASH_SCAN` e pode levar a erros de “record not found” ou erros de duplicate key no caso de um único evento contendo múltiplas atualizações para a mesma linha ou atualizações que dependem da ordem.

  A ordem em que os algoritmos são especificados na lista não faz diferença para a ordem em que são exibidos por uma instrução [`SELECT`](select.html "13.2.9 SELECT Statement") ou [`SHOW VARIABLES`](show-variables.html "13.7.5.39 SHOW VARIABLES Statement").

  É possível especificar um único valor, mas isso não é ideal, pois definir um único valor limita as pesquisas a usar apenas esse algoritmo. Em particular, não é recomendado definir `INDEX_SCAN` sozinho, pois nesse caso as pesquisas não conseguem encontrar linhas se nenhum Index estiver presente.

* [`slave_skip_errors`](replication-options-replica.html#sysvar_slave_skip_errors)

  <table frame="box" rules="all" summary="Propriedades para relay_log_space_limit"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--relay-log-space-limit=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>relay_log_space_limit</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>0</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr> </tbody></table>

  Normalmente, a replicação para quando ocorre um erro na replica, o que lhe dá a oportunidade de resolver a inconsistência nos dados manualmente. Esta variável faz com que o replication SQL thread continue a replicação quando uma instrução retorna qualquer um dos erros listados no valor da variável.

* [`slave_sql_verify_checksum`](replication-options-replica.html#sysvar_slave_sql_verify_checksum)

  <table frame="box" rules="all" summary="Propriedades para relay_log_space_limit"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--relay-log-space-limit=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>relay_log_space_limit</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>0</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr> </tbody></table>

  Faz com que o replication SQL thread verifique os dados usando os checksums lidos do relay log. No caso de uma incompatibilidade, a replica para com um erro. A definição desta variável entra em vigor imediatamente para todos os replication channels, incluindo channels em execução.

  Note

  O replication I/O thread sempre lê checksums, se possível, ao aceitar eventos pela rede.

* [`slave_transaction_retries`](replication-options-replica.html#sysvar_slave_transaction_retries)

  <table frame="box" rules="all" summary="Propriedades para relay_log_space_limit"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--relay-log-space-limit=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>relay_log_space_limit</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>0</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr> </tbody></table>

  Se um replication SQL thread falhar ao executar uma transação devido a um deadlock do [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") ou porque o tempo de execução da transação excedeu [`innodb_lock_wait_timeout`](innodb-parameters.html#sysvar_innodb_lock_wait_timeout) do [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") ou [`TransactionDeadlockDetectionTimeout`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-transactiondeadlockdetectiontimeout) ou [`TransactionInactiveTimeout`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-transactioninactivetimeout) do [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"), ele tenta novamente automaticamente [`slave_transaction_retries`](replication-options-replica.html#sysvar_slave_transaction_retries) vezes antes de parar com um erro. Transações com um erro não temporário não são tentadas novamente.

  O valor padrão para [`slave_transaction_retries`](replication-options-replica.html#sysvar_slave_transaction_retries) é 10. Definir a variável como 0 desativa a nova tentativa automática de transações. A definição da variável entra em vigor imediatamente para todos os replication channels, incluindo channels em execução.

  A partir do MySQL 5.7.5, a nova tentativa de transações é suportada quando o multithreading está ativado em uma replica. Em versões anteriores, [`slave_transaction_retries`](replication-options-replica.html#sysvar_slave_transaction_retries) era tratado como igual a 0 ao usar multithreaded replicas.

  A tabela Performance Schema [`replication_applier_status`](performance-schema-replication-applier-status-table.html "25.12.11.4 The replication_applier_status Table") mostra o número de novas tentativas que ocorreram em cada replication channel, na coluna `COUNT_TRANSACTIONS_RETRIES`.

* [`slave_type_conversions`](replication-options-replica.html#sysvar_slave_type_conversions)

  <table frame="box" rules="all" summary="Propriedades para relay_log_space_limit"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--relay-log-space-limit=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>relay_log_space_limit</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>0</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr> </tbody></table>

  Controla o modo de Type Conversion em vigor na replica ao usar Row-Based Replication. No MySQL 5.7.2 e superior, seu valor é um conjunto delimitado por vírgulas de zero ou mais elementos da lista: `ALL_LOSSY`, `ALL_NON_LOSSY`, `ALL_SIGNED`, `ALL_UNSIGNED`. Defina esta variável como uma String vazia para proibir Type Conversions entre o source e a replica. A definição desta variável entra em vigor imediatamente para todos os replication channels, incluindo channels em execução.

  `ALL_SIGNED` e `ALL_UNSIGNED` foram adicionados no MySQL 5.7.2 (Bug#15831300). Para informações adicionais sobre os modos de Type Conversion aplicáveis à promotion e demotion de atributos na Row-Based Replication, consulte [Row-based replication: attribute promotion and demotion](replication-features-differing-tables.html#replication-features-attribute-promotion "Row-based replication: attribute promotion and demotion").

* [`sql_slave_skip_counter`](replication-options-replica.html#sysvar_sql_slave_skip_counter)

  <table frame="box" rules="all" summary="Propriedades para relay_log_space_limit"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--relay-log-space-limit=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>relay_log_space_limit</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>0</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr> </tbody></table>

  O número de eventos do source que uma replica deve ignorar. A definição da opção não tem efeito imediato. A variável se aplica à próxima instrução [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement"); a próxima instrução [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement") também altera o valor de volta para 0. Quando esta variável é definida para um valor diferente de zero e há múltiplos replication channels configurados, a instrução [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement") só pode ser usada com a cláusula `FOR CHANNEL channel`.

  Esta opção é incompatível com a replicação baseada em GTID e não deve ser definida para um valor diferente de zero quando [`gtid_mode=ON`](replication-options-gtids.html#sysvar_gtid_mode). Se você precisar ignorar transações ao empregar GTIDs, use [`gtid_executed`](replication-options-gtids.html#sysvar_gtid_executed) do source em vez disso. Consulte [Seção 16.1.7.3, “Skipping Transactions”](replication-administration-skip.html "16.1.7.3 Skipping Transactions").

  Important

  Se pular o número de eventos especificado pela definição desta variável faria com que a replica começasse no meio de um Event Group, a replica continua a pular até encontrar o início do próximo Event Group e começa a partir desse ponto. Para mais informações, consulte [Seção 16.1.7.3, “Skipping Transactions”](replication-administration-skip.html "16.1.7.3 Skipping Transactions").

* [`sync_master_info`](replication-options-replica.html#sysvar_sync_master_info)

  <table frame="box" rules="all" summary="Propriedades para relay_log_space_limit"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--relay-log-space-limit=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>relay_log_space_limit</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>0</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr> </tbody></table>

  Os efeitos desta variável em uma replica dependem se o [`master_info_repository`](replication-options-replica.html#sysvar_master_info_repository) da replica está definido como `FILE` ou `TABLE`, conforme explicado nos parágrafos a seguir.

  **master_info_repository = FILE.** Se o valor de `sync_master_info` for maior que 0, a replica sincroniza seu arquivo `master.info` para o disco (usando `fdatasync()`) após cada `sync_master_info` eventos. Se for 0, o MySQL server não realiza sincronização do arquivo `master.info` para o disco; em vez disso, o servidor depende do sistema operacional para descarregar seu conteúdo periodicamente como em qualquer outro arquivo.

  **master_info_repository = TABLE.** Se o valor de `sync_master_info` for maior que 0, a replica atualiza sua connection metadata repository table após cada `sync_master_info` eventos. Se for 0, a tabela nunca é atualizada.

  O valor padrão para `sync_master_info` é 10000. A definição desta variável entra em vigor imediatamente para todos os replication channels, incluindo channels em execução.

* [`sync_relay_log`](replication-options-replica.html#sysvar_sync_relay_log)

  <table frame="box" rules="all" summary="Propriedades para relay_log_space_limit"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--relay-log-space-limit=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>relay_log_space_limit</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>0</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr> </tbody></table>

  Se o valor desta variável for maior que 0, o MySQL server sincroniza seu relay log para o disco (usando `fdatasync()`) após cada `sync_relay_log` eventos serem gravados no relay log. A definição desta variável entra em vigor imediatamente para todos os replication channels, incluindo channels em execução.

  Definir `sync_relay_log` como 0 faz com que nenhuma sincronização seja feita para o disco; neste caso, o servidor depende do sistema operacional para descarregar o conteúdo do relay log de tempos em tempos como para qualquer outro arquivo.

  Um valor de 1 é a escolha mais segura porque, no caso de uma parada inesperada, você perde no máximo um evento do relay log. No entanto, também é a escolha mais lenta (a menos que o disco tenha um cache com bateria de reserva, o que torna a sincronização muito rápida). Para obter informações sobre a combinação de configurações em uma replica que é mais resiliente a paradas inesperadas, consulte [Seção 16.3.2, “Handling an Unexpected Halt of a Replica”](replication-solutions-unexpected-replica-halt.html "16.3.2 Handling an Unexpected Halt of a Replica").

* [`sync_relay_log_info`](replication-options-replica.html#sysvar_sync_relay_log_info)

  <table frame="box" rules="all" summary="Propriedades para replicate-do-db"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--replicate-do-db=name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr> </tbody></table>

  O valor padrão para `sync_relay_log_info` é 10000. A definição desta variável entra em vigor imediatamente para todos os replication channels, incluindo channels em execução.

  Os efeitos desta variável na replica dependem da configuração de [`relay_log_info_repository`](replication-options-replica.html#sysvar_relay_log_info_repository) do servidor (`FILE` ou `TABLE`). Se a configuração for `TABLE`, os efeitos da variável também dependem se o Storage Engine usado pela relay log info table é transacional (como [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine")) ou não transacional ([`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine")). Os efeitos desses fatores no comportamento do servidor para valores de `sync_relay_log_info` iguais a zero e maiores que zero são os seguintes:

  `sync_relay_log_info = 0` :   + Se [`relay_log_info_repository`](replication-options-replica.html#sysvar_relay_log_info_repository) estiver definido como `FILE`, o MySQL server não realiza sincronização do arquivo `relay-log.info` para o disco; em vez disso, o servidor depende do sistema operacional para descarregar seu conteúdo periodicamente como em qualquer outro arquivo.

      + Se [`relay_log_info_repository`](replication-options-replica.html#sysvar_relay_log_info_repository) estiver definido como `TABLE`, e o Storage Engine para essa tabela for transacional, a tabela será atualizada após cada transação. (A configuração `sync_relay_log_info` é efetivamente ignorada neste caso.)

      + Se [`relay_log_info_repository`](replication-options-replica.html#sysvar_relay_log_info_repository) estiver definido como `TABLE`, e o Storage Engine para essa tabela não for transacional, a tabela nunca é atualizada.

  `sync_relay_log_info = N > 0` :   + Se [`relay_log_info_repository`](replication-options-replica.html#sysvar_relay_log_info_repository) estiver definido como `FILE`, a replica sincroniza seu arquivo `relay-log.info` para o disco (usando `fdatasync()`) após cada *`N`* transações.

      + Se [`relay_log_info_repository`](replication-options-replica.html#sysvar_relay_log_info_repository) estiver definido como `TABLE`, e o Storage Engine para essa tabela for transacional, a tabela será atualizada após cada transação. (A configuração `sync_relay_log_info` é efetivamente ignorada neste caso.)

      + Se [`relay_log_info_repository`](replication-options-replica.html#sysvar_relay_log_info_repository) estiver definido como `TABLE`, e o Storage Engine para essa tabela não for transacional, a tabela será atualizada após cada *`N`* eventos.