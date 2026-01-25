#### 16.1.6.4 Opções e Variáveis de Binary Logging

* [Opções de Inicialização Usadas com Binary Logging](replication-options-binary-log.html#replication-optvars-binlog "Startup Options Used with Binary Logging")
* [Variáveis de Sistema Usadas com Binary Logging](replication-options-binary-log.html#replication-sysvars-binlog "System Variables Used with Binary Logging")

Você pode usar as opções e variáveis de sistema do [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") descritas nesta seção para afetar a operação do binary log, bem como para controlar quais statements são escritos no binary log. Para informações adicionais sobre o binary log, consulte [Seção 5.4.4, “The Binary Log”](binary-log.html "5.4.4 The Binary Log"). Para informações adicionais sobre o uso de opções e variáveis de sistema do MySQL server, consulte [Seção 5.1.6, “Server Command Options”](server-options.html "5.1.6 Server Command Options") e [Seção 5.1.7, “Server System Variables”](server-system-variables.html "5.1.7 Server System Variables").

##### Opções de Inicialização Usadas com Binary Logging

A lista a seguir descreve as opções de inicialização para habilitar e configurar o binary log. As variáveis de sistema usadas com binary logging são discutidas mais adiante nesta seção.

* [`--binlog-row-event-max-size=N`](replication-options-binary-log.html#option_mysqld_binlog-row-event-max-size)

  <table frame="box" rules="all" summary="Properties for binlog-row-event-max-size"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--binlog-row-event-max-size=#</code></td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>8192</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>256</code></td> </tr><tr><th>Valor Máximo (plataformas de 64 bits)</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Valor Máximo (plataformas de 32 bits)</th> <td><code>4294967295</code></td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></tbody></table>

  Especifica o tamanho máximo de um evento de binary log baseado em linha (row-based), em bytes. Se possível, as linhas são agrupadas em eventos menores que esse tamanho. O valor deve ser um múltiplo de 256. O padrão é 8192. Consulte [Seção 16.2.1, “Replication Formats”](replication-formats.html "16.2.1 Replication Formats").

* [`--log-bin[=base_name]`](replication-options-binary-log.html#option_mysqld_log-bin)

  <table frame="box" rules="all" summary="Properties for log-bin"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--log-bin=file_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do Arquivo</td> </tr></tbody></table>

  Habilita o binary logging. Com o binary logging habilitado, o server registra todos os statements que alteram dados no binary log, que é usado para backup e replication. O binary log é uma sequência de arquivos com um nome base e uma extensão numérica. Para obter informações sobre o formato e o gerenciamento do binary log, consulte [Seção 5.4.4, “The Binary Log”](binary-log.html "5.4.4 The Binary Log").

  Se você fornecer um valor para a opção `--log-bin`, o valor será usado como o nome base para a sequência de log. O server cria arquivos de binary log em sequência, adicionando um sufixo numérico ao nome base. No MySQL 5.7, o nome base padrão é `host_name-bin`, usando o nome da máquina host. É recomendável que você especifique um nome base, para que possa continuar a usar os mesmos nomes de arquivos de binary log, independentemente de alterações no nome padrão.

  O local padrão para os arquivos de binary log é o Data Directory. Você pode usar a opção `--log-bin` para especificar um local alternativo, adicionando um nome de caminho absoluto inicial ao nome base para especificar um diretório diferente. Quando o server lê uma entrada do arquivo Index do binary log, que rastreia os arquivos de binary log que foram usados, ele verifica se a entrada contém um caminho relativo. Se contiver, a parte relativa do caminho é substituída pelo caminho absoluto definido usando a opção `--log-bin`. Um caminho absoluto registrado no arquivo Index do binary log permanece inalterado; nesse caso, o arquivo Index deve ser editado manualmente para permitir que um novo caminho ou caminhos sejam usados. (Em versões mais antigas do MySQL, era necessária intervenção manual sempre que os arquivos de binary log ou relay log eram realocados.) (Bug #11745230, Bug #12133)

  Definir esta opção faz com que a variável de sistema [`log_bin`](replication-options-binary-log.html#sysvar_log_bin) seja definida como `ON` (ou `1`), e não como o nome base. O nome base do arquivo do binary log e qualquer path especificado estão disponíveis como a variável de sistema [`log_bin_basename`](replication-options-binary-log.html#sysvar_log_bin_basename).

  Se você especificar a opção `--log-bin` sem especificar também a variável de sistema [`server_id`](replication-options.html#sysvar_server_id), o server não poderá ser iniciado. (Bug #11763963, Bug #56739)

  Quando GTIDs estão em uso no server, se o binary logging não estiver habilitado ao reiniciar o server após um desligamento anormal, é provável que alguns GTIDs sejam perdidos, causando falha na replication. Em um desligamento normal, o conjunto de GTIDs do arquivo de binary log atual é salvo na tabela `mysql.gtid_executed`. Após um desligamento anormal em que isso não ocorreu, durante a recuperação, os GTIDs são adicionados à tabela a partir do arquivo de binary log, desde que o binary logging ainda esteja habilitado. Se o binary logging estiver desabilitado para o restart do server, o server não poderá acessar o arquivo de binary log para recuperar os GTIDs, portanto, a replication não poderá ser iniciada. O binary logging pode ser desabilitado com segurança após um desligamento normal.

  Se você quiser desabilitar o binary logging para uma inicialização do server, mas manter a configuração `--log-bin` intacta, você pode especificar a opção [`--skip-log-bin`](replication-options-binary-log.html#option_mysqld_log-bin) ou [`--disable-log-bin`](replication-options-binary-log.html#option_mysqld_log-bin) na inicialização. Especifique a opção após a opção `--log-bin`, para que ela tenha precedência. Quando o binary logging é desabilitado, a variável de sistema [`log_bin`](replication-options-binary-log.html#sysvar_log_bin) é definida como OFF.

* [`--log-bin-index[=file_name]`](replication-options-binary-log.html#option_mysqld_log-bin-index)

  <table frame="box" rules="all" summary="Properties for log-bin-index"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--log-bin-index=file_name</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>log_bin_index</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do Arquivo</td> </tr></tbody></table>

  O nome para o arquivo Index do binary log, que contém os nomes dos arquivos do binary log. Por padrão, ele tem o mesmo local e nome base que o valor especificado para os arquivos do binary log usando a opção [`--log-bin`](replication-options-binary-log.html#option_mysqld_log-bin), mais a extensão `.index`. Se você não especificar [`--log-bin`](replication-options-binary-log.html#option_mysqld_log-bin), o nome padrão do arquivo Index do binary log será `binlog.index`. Se você omitir o nome do arquivo e não especificar um com [`--log-bin`](replication-options-binary-log.html#option_mysqld_log-bin), o nome padrão do arquivo Index do binary log será `host_name-bin.index`, usando o nome da máquina host.

  Para obter informações sobre o formato e o gerenciamento do binary log, consulte [Seção 5.4.4, “The Binary Log”](binary-log.html "5.4.4 The Binary Log").

**Opções de seleção de Statement.** As opções na lista a seguir afetam quais statements são escritos no binary log e, portanto, enviados por um server source de replication para suas réplicas. Existem também opções para servers replica que controlam quais statements recebidos da source devem ser executados ou ignorados. Para detalhes, consulte [Seção 16.1.6.3, “Replica Server Options and Variables”](replication-options-replica.html "16.1.6.3 Replica Server Options and Variables").

* [`--binlog-do-db=db_name`](replication-options-binary-log.html#option_mysqld_binlog-do-db)

  <table frame="box" rules="all" summary="Properties for binlog-do-db"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--binlog-do-db=name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Esta opção afeta o binary logging de forma semelhante à maneira como [`--replicate-do-db`](replication-options-replica.html#option_mysqld_replicate-do-db) afeta a replication.

  Os efeitos desta opção dependem se o formato de logging baseado em statement (statement-based) ou baseado em linha (row-based) está em uso, da mesma forma que os efeitos de [`--replicate-do-db`](replication-options-replica.html#option_mysqld_replicate-do-db) dependem se a replication baseada em statement ou baseada em linha está em uso. Você deve ter em mente que o formato usado para registrar um determinado statement pode não ser necessariamente o mesmo que o indicado pelo valor de [`binlog_format`](replication-options-binary-log.html#sysvar_binlog_format). Por exemplo, statements DDL, como [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") e [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement"), são sempre registrados como statements, independentemente do formato de logging em vigor, portanto, as seguintes regras baseadas em statement para `--binlog-do-db` sempre se aplicam ao determinar se o statement é registrado ou não.

  **Logging baseado em Statement.** Apenas os statements são escritos no binary log onde o Database padrão (ou seja, o selecionado por [`USE`](use.html "13.8.4 USE Statement")) é *`db_name`*. Para especificar mais de um Database, use esta opção várias vezes, uma para cada Database; no entanto, isso *não* faz com que statements cross-database como `UPDATE some_db.some_table SET foo='bar'` sejam registrados enquanto um Database diferente (ou nenhum Database) estiver selecionado.

  Aviso

  Para especificar múltiplos Databases você *deve* usar múltiplas instâncias desta opção. Como nomes de Database podem conter vírgulas, a lista é tratada como o nome de um único Database se você fornecer uma lista separada por vírgulas.

  Um exemplo do que não funciona como você esperaria ao usar o logging baseado em statement: Se o server for iniciado com [`--binlog-do-db=sales`](replication-options-binary-log.html#option_mysqld_binlog-do-db) e você emitir os seguintes statements, o statement [`UPDATE`](update.html "13.2.11 UPDATE Statement") *não* será registrado:

  ```sql
  USE prices;
  UPDATE sales.january SET amount=amount+1000;
  ```

  A principal razão para este comportamento de “apenas verificar o Database padrão” é que é difícil, apenas pelo statement, saber se ele deve ser replicado (por exemplo, se você estiver usando statements [`DELETE`](delete.html "13.2.2 DELETE Statement") de múltiplas tabelas ou statements [`UPDATE`](update.html "13.2.11 UPDATE Statement") de múltiplas tabelas que atuam em múltiplos Databases). Também é mais rápido verificar apenas o Database padrão do que todos os Databases, se não houver necessidade.

  Outro caso que pode não ser óbvio ocorre quando um determinado Database é replicado, mesmo que não tenha sido especificado ao definir a opção. Se o server for iniciado com `--binlog-do-db=sales`, o seguinte statement [`UPDATE`](update.html "13.2.11 UPDATE Statement") é registrado, embora `prices` não tenha sido incluído ao definir `--binlog-do-db`:

  ```sql
  USE sales;
  UPDATE prices.discounts SET percentage = percentage + 10;
  ```

  Como `sales` é o Database padrão quando o statement [`UPDATE`](update.html "13.2.11 UPDATE Statement") é emitido, o [`UPDATE`](update.html "13.2.11 UPDATE Statement") é registrado.

  **Logging baseado em Linha (Row-based).** O Logging é restrito ao Database *`db_name`*. Apenas as alterações em tabelas pertencentes a *`db_name`* são registradas; o Database padrão não tem efeito sobre isso. Suponha que o server seja iniciado com [`--binlog-do-db=sales`](replication-options-binary-log.html#option_mysqld_binlog-do-db) e o logging baseado em linha esteja em vigor, e então os seguintes statements sejam executados:

  ```sql
  USE prices;
  UPDATE sales.february SET amount=amount+100;
  ```

  As alterações na tabela `february` no Database `sales` são registradas de acordo com o statement [`UPDATE`](update.html "13.2.11 UPDATE Statement"); isso ocorre independentemente de o statement [`USE`](use.html "13.8.4 USE Statement") ter sido emitido. No entanto, ao usar o formato de logging baseado em linha e [`--binlog-do-db=sales`](replication-options-binary-log.html#option_mysqld_binlog-do-db), as alterações feitas pelo seguinte [`UPDATE`](update.html "13.2.11 UPDATE Statement") não são registradas:

  ```sql
  USE prices;
  UPDATE prices.march SET amount=amount-25;
  ```

  Mesmo que o statement `USE prices` fosse alterado para `USE sales`, os efeitos do statement [`UPDATE`](update.html "13.2.11 UPDATE Statement") ainda não seriam escritos no binary log.

  Outra diferença importante no tratamento de [`--binlog-do-db`](replication-options-binary-log.html#option_mysqld_binlog-do-db) para logging baseado em statement em oposição ao logging baseado em linha ocorre em relação a statements que se referem a múltiplos Databases. Suponha que o server seja iniciado com [`--binlog-do-db=db1`](replication-options-binary-log.html#option_mysqld_binlog-do-db) e os seguintes statements sejam executados:

  ```sql
  USE db1;
  UPDATE db1.table1, db2.table2 SET db1.table1.col1 = 10, db2.table2.col2 = 20;
  ```

  Se você estiver usando o logging baseado em statement, as atualizações para ambas as tabelas serão escritas no binary log. No entanto, ao usar o formato baseado em linha, apenas as alterações em `table1` são registradas; `table2` está em um Database diferente, portanto, não é alterada pelo statement [`UPDATE`](update.html "13.2.11 UPDATE Statement"). Agora suponha que, em vez do statement `USE db1`, um statement `USE db4` tivesse sido usado:

  ```sql
  USE db4;
  UPDATE db1.table1, db2.table2 SET db1.table1.col1 = 10, db2.table2.col2 = 20;
  ```

  Neste caso, o statement [`UPDATE`](update.html "13.2.11 UPDATE Statement") não é escrito no binary log ao usar o logging baseado em statement. No entanto, ao usar o logging baseado em linha, a alteração em `table1` é registrada, mas não a em `table2` — em outras palavras, apenas as alterações em tabelas no Database nomeado por [`--binlog-do-db`](replication-options-binary-log.html#option_mysqld_binlog-do-db) são registradas, e a escolha do Database padrão não tem efeito sobre este comportamento.

* [`--binlog-ignore-db=db_name`](replication-options-binary-log.html#option_mysqld_binlog-ignore-db)

  <table frame="box" rules="all" summary="Properties for binlog-ignore-db"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--binlog-ignore-db=name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Esta opção afeta o binary logging de forma semelhante à maneira como [`--replicate-ignore-db`](replication-options-replica.html#option_mysqld_replicate-ignore-db) afeta a replication.

  Os efeitos desta opção dependem se o formato de logging baseado em statement ou baseado em linha está em uso, da mesma forma que os efeitos de [`--replicate-ignore-db`](replication-options-replica.html#option_mysqld_replicate-ignore-db) dependem se a replication baseada em statement ou baseada em linha está em uso. Você deve ter em mente que o formato usado para registrar um determinado statement pode não ser necessariamente o mesmo que o indicado pelo valor de [`binlog_format`](replication-options-binary-log.html#sysvar_binlog_format). Por exemplo, statements DDL, como [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") e [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement"), são sempre registrados como statements, independentemente do formato de logging em vigor, portanto, as seguintes regras baseadas em statement para `--binlog-ignore-db` sempre se aplicam ao determinar se o statement é registrado ou não.

  **Logging baseado em Statement.** Instrui o server a não registrar (log) nenhum statement onde o Database padrão (ou seja, o selecionado por [`USE`](use.html "13.8.4 USE Statement")) é *`db_name`*.

  Antes do MySQL 5.7.2, esta opção fazia com que quaisquer statements contendo nomes de tabelas totalmente qualificados não fossem registrados se nenhum Database padrão fosse especificado (ou seja, quando [`SELECT`](select.html "13.2.9 SELECT Statement") [`DATABASE()`](information-functions.html#function_database) retornava `NULL`). No MySQL 5.7.2 e superior, quando não há Database padrão, nenhuma opção `--binlog-ignore-db` é aplicada, e tais statements são sempre registrados. (Bug #11829838, Bug #60188)

  **Formato baseado em Linha (Row-based).** Instrui o server a não registrar updates em nenhuma tabela no Database *`db_name`*. O Database atual não tem efeito.

  Ao usar o logging baseado em statement, o seguinte exemplo não funciona como você esperaria. Suponha que o server seja iniciado com [`--binlog-ignore-db=sales`](replication-options-binary-log.html#option_mysqld_binlog-ignore-db) e você emita os seguintes statements:

  ```sql
  USE prices;
  UPDATE sales.january SET amount=amount+1000;
  ```

  O statement [`UPDATE`](update.html "13.2.11 UPDATE Statement") *é* registrado em tal caso porque [`--binlog-ignore-db`](replication-options-binary-log.html#option_mysqld_binlog-ignore-db) se aplica apenas ao Database padrão (determinado pelo statement [`USE`](use.html "13.8.4 USE Statement")). Como o Database `sales` foi especificado explicitamente no statement, o statement não foi filtrado. No entanto, ao usar o logging baseado em linha, os efeitos do statement [`UPDATE`](update.html "13.2.11 UPDATE Statement") *não* são escritos no binary log, o que significa que nenhuma alteração na tabela `sales.january` é registrada; nesta instância, [`--binlog-ignore-db=sales`](replication-options-binary-log.html#option_mysqld_binlog-ignore-db) faz com que *todas* as alterações feitas nas tabelas na cópia do Database `sales` da source sejam ignoradas para fins de binary logging.

  Para especificar mais de um Database a ser ignorado, use esta opção várias vezes, uma para cada Database. Como nomes de Database podem conter vírgulas, a lista é tratada como o nome de um único Database se você fornecer uma lista separada por vírgulas.

  Você não deve usar esta opção se estiver usando updates cross-database e não quiser que esses updates sejam registrados.

**Opções de Checksum.** O MySQL suporta a leitura e escrita de checksums do binary log. Eles são habilitados usando as duas opções listadas aqui:

* [`--binlog-checksum={NONE|CRC32}`](replication-options-binary-log.html#option_mysqld_binlog-checksum)

  <table frame="box" rules="all" summary="Properties for binlog-checksum"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--binlog-checksum=type</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>CRC32</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>NONE</code></p><p><code>CRC32</code></p></td> </tr></tbody></table>

  Habilitar esta opção faz com que a source escreva checksums para eventos escritos no binary log. Defina como `NONE` para desabilitar, ou o nome do algoritmo a ser usado para gerar checksums; atualmente, apenas checksums CRC32 são suportados, e CRC32 é o padrão. Você não pode alterar a configuração desta opção dentro de uma transaction.

Para controlar a leitura de checksums pela réplica (a partir do relay log), use a opção [`--slave-sql-verify-checksum`](replication-options-replica.html#option_mysqld_slave-sql-verify-checksum).

**Opções de Teste e Debugging.** As seguintes opções de binary log são usadas em testes e debugging de replication. Elas não se destinam ao uso em operações normais.

* [`--max-binlog-dump-events=N`](replication-options-binary-log.html#option_mysqld_max-binlog-dump-events)

  <table frame="box" rules="all" summary="Properties for max-binlog-dump-events"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--max-binlog-dump-events=#</code></td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>0</code></td> </tr></tbody></table>

  Esta opção é usada internamente pelo pacote de testes do MySQL para testes e debugging de replication.

* [`--sporadic-binlog-dump-fail`](replication-options-binary-log.html#option_mysqld_sporadic-binlog-dump-fail)

  <table frame="box" rules="all" summary="Properties for sporadic-binlog-dump-fail"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--sporadic-binlog-dump-fail[={OFF|ON}]</code></td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Esta opção é usada internamente pelo pacote de testes do MySQL para testes e debugging de replication.

##### Variáveis de Sistema Usadas com Binary Logging

A lista a seguir descreve as variáveis de sistema para controlar o binary logging. Elas podem ser definidas na inicialização do server e algumas delas podem ser alteradas em tempo de execução usando [`SET`](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment"). As opções do server usadas para controlar o binary logging estão listadas anteriormente nesta seção.

* [`binlog_cache_size`](replication-options-binary-log.html#sysvar_binlog_cache_size)

  <table frame="box" rules="all" summary="Properties for binlog_cache_size"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--binlog-cache-size=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>binlog_cache_size</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>32768</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>4096</code></td> </tr><tr><th>Valor Máximo (plataformas de 64 bits)</th> <td><code>18446744073709547520</code></td> </tr><tr><th>Valor Máximo (plataformas de 32 bits)</th> <td><code>4294963200</code></td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr><tr><th>Tamanho do Bloco</th> <td><code>4096</code></td> </tr></tbody></table>

  O tamanho do cache para armazenar alterações no binary log durante uma transaction.

  Um cache de binary log é alocado para cada cliente se o server suportar qualquer Storage Engine transacional e se o server tiver o binary log habilitado (opção [`--log-bin`](replication-options-binary-log.html#option_mysqld_log-bin)). Se você costuma usar transactions grandes, pode aumentar o tamanho deste cache para obter melhor performance. As variáveis de status [`Binlog_cache_use`](server-status-variables.html#statvar_Binlog_cache_use) e [`Binlog_cache_disk_use`](server-status-variables.html#statvar_Binlog_cache_disk_use) podem ser úteis para ajustar o tamanho desta variável. Consulte [Seção 5.4.4, “The Binary Log”](binary-log.html "5.4.4 The Binary Log").

  `binlog_cache_size` define o tamanho apenas para o cache de transaction; o tamanho do cache de statement é regido pela variável de sistema [`binlog_stmt_cache_size`](replication-options-binary-log.html#sysvar_binlog_stmt_cache_size).

* [`binlog_checksum`](replication-options-binary-log.html#sysvar_binlog_checksum)

  <table frame="box" rules="all" summary="Properties for binlog_checksum"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--binlog-checksum=type</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>binlog_checksum</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>CRC32</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>NONE</code></p><p><code>CRC32</code></p></td> </tr></tbody></table>

  Quando habilitada, esta variável faz com que a source escreva um checksum para cada evento no binary log. `binlog_checksum` suporta os valores `NONE` (desabilitado) e `CRC32`. O padrão é `CRC32`. Você não pode alterar o valor de `binlog_checksum` dentro de uma transaction.

  Quando `binlog_checksum` está desabilitado (valor `NONE`), o server verifica se está escrevendo apenas eventos completos no binary log, escrevendo e verificando o comprimento do evento (em vez de um checksum) para cada evento.

  Alterar o valor desta variável faz com que o binary log seja rotacionado; os checksums são sempre escritos em um arquivo de binary log inteiro, e nunca apenas em parte dele.

  Definir esta variável na source para um valor não reconhecido pela réplica faz com que a réplica defina seu próprio valor `binlog_checksum` para `NONE` e pare a replication com um erro. (Bug #13553750, Bug #61096) Se a compatibilidade com versões anteriores de réplicas for uma preocupação, você pode querer definir o valor explicitamente como `NONE`.

* [`binlog_direct_non_transactional_updates`](replication-options-binary-log.html#sysvar_binlog_direct_non_transactional_updates)

  <table frame="box" rules="all" summary="Properties for log-bin"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--log-bin=file_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do Arquivo</td> </tr></tbody></table>

  Devido a problemas de concorrência, uma réplica pode se tornar inconsistente quando uma transaction contém updates em tabelas transacionais e não transacionais. O MySQL tenta preservar a causalidade entre esses statements, escrevendo statements não transacionais no cache de transaction, que é descarregado no COMMIT. No entanto, problemas surgem quando modificações feitas em tabelas não transacionais em nome de uma transaction se tornam imediatamente visíveis para outras conexões porque essas alterações podem não ser escritas imediatamente no binary log.

  A variável [`binlog_direct_non_transactional_updates`](replication-options-binary-log.html#sysvar_binlog_direct_non_transactional_updates) oferece uma possível solução alternativa para este problema. Por padrão, esta variável está desabilitada. Habilitar [`binlog_direct_non_transactional_updates`](replication-options-binary-log.html#sysvar_binlog_direct_non_transactional_updates) faz com que updates em tabelas não transacionais sejam escritos diretamente no binary log, em vez de no cache de transaction.

  *[`binlog_direct_non_transactional_updates`](replication-options-binary-log.html#sysvar_binlog_direct_non_transactional_updates) funciona apenas para statements que são replicados usando o formato de binary logging baseado em statement*; ou seja, funciona apenas quando o valor de [`binlog_format`](replication-options-binary-log.html#sysvar_binlog_format) é `STATEMENT`, ou quando [`binlog_format`](replication-options-binary-log.html#sysvar_binlog_format) é `MIXED` e um determinado statement está sendo replicado usando o formato baseado em statement. Esta variável não tem efeito quando o formato do binary log é `ROW`, ou quando [`binlog_format`](replication-options-binary-log.html#sysvar_binlog_format) é definido como `MIXED` e um determinado statement é replicado usando o formato baseado em linha.

  Importante

  Antes de habilitar esta variável, você deve se certificar de que não há dependências entre tabelas transacionais e não transacionais; um exemplo de tal dependência seria o statement `INSERT INTO myisam_table SELECT * FROM innodb_table`. Caso contrário, tais statements provavelmente farão com que a réplica se desvie da source.

  Esta variável não tem efeito quando o formato do binary log é `ROW` ou `MIXED`.

* [`binlog_error_action`](replication-options-binary-log.html#sysvar_binlog_error_action)

  <table frame="box" rules="all" summary="Properties for log-bin"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--log-bin=file_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do Arquivo</td> </tr></tbody></table>

  Controla o que acontece quando o server encontra um erro, como não conseguir escrever, descarregar (flush) ou sincronizar o binary log, o que pode fazer com que o binary log da source se torne inconsistente e as réplicas percam a sincronização.

  No MySQL 5.7.7 e superior, esta variável assume o padrão `ABORT_SERVER`, o que faz com que o server interrompa o logging e desligue sempre que encontrar tal erro com o binary log. Na reinicialização, a recuperação prossegue como no caso de uma paralisação inesperada do server (consulte [Seção 16.3.2, “Handling an Unexpected Halt of a Replica”](replication-solutions-unexpected-replica-halt.html "16.3.2 Handling an Unexpected Halt of a Replica")).

  Quando `binlog_error_action` é definido como `IGNORE_ERROR`, se o server encontrar tal erro, ele continua a transaction em andamento, registra o erro e interrompe o logging, e continua a realizar updates. Para retomar o binary logging, [`log_bin`](replication-options-binary-log.html#sysvar_log_bin) deve ser habilitado novamente, o que requer um restart do server. Esta configuração fornece compatibilidade com versões anteriores do MySQL.

  Em releases anteriores, esta variável era chamada `binlogging_impossible_mode`.

* [`binlog_format`](replication-options-binary-log.html#sysvar_binlog_format)

  <table frame="box" rules="all" summary="Properties for log-bin"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--log-bin=file_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do Arquivo</td> </tr></tbody></table>

  Esta variável de sistema define o formato de binary logging e pode ser `STATEMENT`, `ROW` ou `MIXED`. Consulte [Seção 16.2.1, “Replication Formats”](replication-formats.html "16.2.1 Replication Formats"). A configuração entra em vigor quando o binary logging é habilitado no server, o que acontece quando a variável de sistema [`log_bin`](replication-options-binary-log.html#sysvar_log_bin) é definida como `ON`. No MySQL 5.7, o binary logging não é habilitado por padrão e você o habilita usando a opção [`--log-bin`](replication-options-binary-log.html#option_mysqld_log-bin).

  [`binlog_format`](replication-options-binary-log.html#sysvar_binlog_format) pode ser definido na inicialização ou em tempo de execução, exceto que, sob algumas condições, a alteração desta variável em tempo de execução não é possível ou causa falha na replication, conforme descrito adiante.

  Antes do MySQL 5.7.7, o formato padrão era `STATEMENT`. No MySQL 5.7.7 e superior, o padrão é `ROW`. *Exceção*: No NDB Cluster, o padrão é `MIXED`; a replication baseada em statement não é suportada para NDB Cluster.

  Definir o valor de session desta variável de sistema é uma operação restrita. O usuário da session deve ter privilégios suficientes para definir variáveis de session restritas. Consulte [Seção 5.1.8.1, “System Variable Privileges”](system-variable-privileges.html "5.1.8.1 System Variable Privileges").

  As regras que governam quando as alterações nesta variável entram em vigor e quanto tempo o efeito dura são as mesmas que para outras variáveis de sistema do MySQL server. Para obter mais informações, consulte [Seção 13.7.4.1, “SET Syntax for Variable Assignment”](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment").

  Quando `MIXED` é especificado, a replication baseada em statement é usada, exceto para casos em que apenas a replication baseada em linha é garantida para levar a resultados adequados. Por exemplo, isso acontece quando statements contêm funções carregáveis ou a função [`UUID()`](miscellaneous-functions.html#function_uuid).

  Para obter detalhes sobre como os stored programs (stored procedures e functions, triggers e events) são tratados quando cada formato de binary logging é definido, consulte [Seção 23.7, “Stored Program Binary Logging”](stored-programs-logging.html "23.7 Stored Program Binary Logging").

  Existem exceções em que você não pode alternar o formato de replication em tempo de execução:

  + De dentro de uma stored function ou um trigger.
  + Se a session estiver atualmente no modo de replication baseado em linha e tiver temporary tables abertas.

  + De dentro de uma transaction.

  Tentar alternar o formato nesses casos resulta em um erro.

  Alterar o formato de logging em um server source de replication não faz com que uma réplica altere seu formato de logging para corresponder. Mudar o formato de replication enquanto a replication está em andamento pode causar problemas se uma réplica tiver o binary logging habilitado, e a alteração resultar na réplica usando o logging no formato `STATEMENT` enquanto a source estiver usando o logging no formato `ROW` ou `MIXED`. Uma réplica não é capaz de converter entradas de binary log recebidas no formato de logging `ROW` para o formato `STATEMENT` para uso em seu próprio binary log, portanto, esta situação pode fazer com que a replication falhe. Para obter mais informações, consulte [Seção 5.4.4.2, “Setting The Binary Log Format”](binary-log-setting.html "5.4.4.2 Setting The Binary Log Format").

  O formato do binary log afeta o comportamento das seguintes opções do server:

  + [`--replicate-do-db`](replication-options-replica.html#option_mysqld_replicate-do-db)
  + [`--replicate-ignore-db`](replication-options-replica.html#option_mysqld_replicate-ignore-db)
  + [`--binlog-do-db`](replication-options-binary-log.html#option_mysqld_binlog-do-db)
  + [`--binlog-ignore-db`](replication-options-binary-log.html#option_mysqld_binlog-ignore-db)

  Estes efeitos são discutidos em detalhes nas descrições das opções individuais.

* [`binlog_group_commit_sync_delay`](replication-options-binary-log.html#sysvar_binlog_group_commit_sync_delay)

  <table frame="box" rules="all" summary="Properties for log-bin"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--log-bin=file_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do Arquivo</td> </tr></tbody></table>

  Controla quantos microssegundos o COMMIT do binary log espera antes de sincronizar o arquivo do binary log para o disco. Por padrão, [`binlog_group_commit_sync_delay`](replication-options-binary-log.html#sysvar_binlog_group_commit_sync_delay) é definido como 0, o que significa que não há atraso. Definir [`binlog_group_commit_sync_delay`](replication-options-binary-log.html#sysvar_binlog_group_commit_sync_delay) para um atraso em microssegundos permite que mais transactions sejam sincronizadas juntas para o disco de uma só vez, reduzindo o tempo total para o COMMIT de um grupo de transactions porque os grupos maiores exigem menos unidades de tempo por grupo.

  Quando [`sync_binlog=0`](replication-options-binary-log.html#sysvar_sync_binlog) ou [`sync_binlog=1`](replication-options-binary-log.html#sysvar_sync_binlog) é definido, o atraso especificado por [`binlog_group_commit_sync_delay`](replication-options-binary-log.html#sysvar_binlog_group_commit_sync_delay) é aplicado para cada grupo de COMMIT do binary log antes da sincronização (ou no caso de [`sync_binlog=0`](replication-options-binary-log.html#sysvar_sync_binlog), antes de prosseguir). Quando [`sync_binlog`](replication-options-binary-log.html#sysvar_sync_binlog) é definido como um valor *n* maior que 1, o atraso é aplicado após cada *n* grupos de COMMIT do binary log.

  Definir [`binlog_group_commit_sync_delay`](replication-options-binary-log.html#sysvar_binlog_group_commit_sync_delay) pode aumentar o número de transactions em COMMIT paralelo em qualquer server que tenha (ou possa ter após um failover) uma réplica, e, portanto, pode aumentar a execução paralela nas réplicas. Para se beneficiar deste efeito, os servers replica devem ter [`slave_parallel_type=LOGICAL_CLOCK`](replication-options-replica.html#sysvar_slave_parallel_type) definido, e o efeito é mais significativo quando [`binlog_transaction_dependency_tracking=COMMIT_ORDER`](replication-options-binary-log.html#sysvar_binlog_transaction_dependency_tracking) também está definido. É importante levar em consideração tanto o throughput da source quanto o throughput das réplicas ao ajustar a configuração para [`binlog_group_commit_sync_delay`](replication-options-binary-log.html#sysvar_binlog_group_commit_sync_delay).

  Definir [`binlog_group_commit_sync_delay`](replication-options-binary-log.html#sysvar_binlog_group_commit_sync_delay) também pode reduzir o número de chamadas `fsync()` para o binary log em qualquer server (source ou réplica) que tenha um binary log.

  Observe que definir [`binlog_group_commit_sync_delay`](replication-options-binary-log.html#sysvar_binlog_group_commit_sync_delay) aumenta a latência de transactions no server, o que pode afetar os aplicativos cliente. Além disso, em workloads altamente concorrentes, é possível que o atraso aumente a contenção e, portanto, reduza o throughput. Tipicamente, os benefícios de definir um atraso superam as desvantagens, mas o ajuste (tuning) deve sempre ser realizado para determinar a configuração ideal.

* [`binlog_group_commit_sync_no_delay_count`](replication-options-binary-log.html#sysvar_binlog_group_commit_sync_no_delay_count)

  <table frame="box" rules="all" summary="Properties for log-bin"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--log-bin=file_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do Arquivo</td> </tr></tbody></table>

  O número máximo de transactions a esperar antes de abortar o atraso atual, conforme especificado por [`binlog_group_commit_sync_delay`](replication-options-binary-log.html#sysvar_binlog_group_commit_sync_delay). Se [`binlog_group_commit_sync_delay`](replication-options-binary-log.html#sysvar_binlog_group_commit_sync_delay) for definido como 0, esta opção não terá efeito.

* [`binlog_max_flush_queue_time`](replication-options-binary-log.html#sysvar_binlog_max_flush_queue_time)

  <table frame="box" rules="all" summary="Properties for log-bin"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--log-bin=file_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do Arquivo</td> </tr></tbody></table>

  Anteriormente, isso controlava o tempo em microssegundos para continuar a ler transactions da fila de flush antes de prosseguir com o group commit. No MySQL 5.7, esta variável não tem mais nenhum efeito.

  `binlog_max_flush_queue_time` está depreciada a partir do MySQL 5.7.9 e está marcada para eventual remoção em um futuro release do MySQL.

* [`binlog_order_commits`](replication-options-binary-log.html#sysvar_binlog_order_commits)

  <table frame="box" rules="all" summary="Properties for log-bin"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--log-bin=file_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do Arquivo</td> </tr></tbody></table>

  Quando esta variável está habilitada em um server source de replication (que é o padrão), as instruções de COMMIT de transaction emitidas para os Storage Engines são serializadas em um único Thread, de modo que as transactions são sempre submetidas (committed) na mesma ordem em que são escritas no binary log. Desabilitar esta variável permite que as instruções de COMMIT de transaction sejam emitidas usando múltiplos Threads. Usado em combinação com o group commit do binary log, isso evita que a taxa de COMMIT de uma única transaction seja um bottleneck para o throughput e, portanto, pode produzir uma melhoria de performance.

  As transactions são escritas no binary log no momento em que todos os Storage Engines envolvidos confirmaram que a transaction está preparada para o COMMIT. A lógica de group commit do binary log, então, submete um grupo de transactions após a escrita de seu binary log ter ocorrido. Quando [`binlog_order_commits`](replication-options-binary-log.html#sysvar_binlog_order_commits) está desabilitado, como múltiplos Threads são usados para este processo, as transactions em um grupo de COMMIT podem ser submetidas em uma ordem diferente da sua ordem no binary log. (Transactions de um único cliente sempre são submetidas em ordem cronológica.) Em muitos casos, isso não importa, pois as operações realizadas em transactions separadas devem produzir resultados consistentes e, se não for o caso, uma única transaction deve ser usada.

  Se você quiser garantir que o histórico de transactions na source e em uma réplica multithreaded permaneça idêntico, defina [`slave_preserve_commit_order=1`](replication-options-replica.html#sysvar_slave_preserve_commit_order) na réplica.

* [`binlog_row_image`](replication-options-binary-log.html#sysvar_binlog_row_image)

  <table frame="box" rules="all" summary="Properties for log-bin"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--log-bin=file_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do Arquivo</td> </tr></tbody></table>

  Para a replication baseada em linha do MySQL, esta variável determina como as imagens de linha (row images) são escritas no binary log.

  Na replication baseada em linha do MySQL, cada evento de alteração de linha contém duas imagens, uma imagem "before" (anterior) cujas colunas são comparadas ao procurar a linha a ser atualizada, e uma imagem "after" (posterior) contendo as alterações. Normalmente, o MySQL registra linhas completas (ou seja, todas as colunas) para as imagens before e after. No entanto, não é estritamente necessário incluir todas as colunas em ambas as imagens e, muitas vezes, podemos economizar uso de disco, memória e network registrando apenas as colunas que são realmente necessárias.

  Note

  Ao deletar uma linha, apenas a imagem before é registrada, uma vez que não há valores alterados para propagar após a exclusão. Ao inserir uma linha, apenas a imagem after é registrada, pois não há linha existente para ser comparada. Somente ao atualizar uma linha, as imagens before e after são necessárias e ambas são escritas no binary log.

  Para a imagem before, é necessário apenas que o conjunto mínimo de colunas necessárias para identificar exclusivamente as linhas seja registrado. Se a tabela que contém a linha tiver uma Primary Key, apenas a coluna ou colunas da Primary Key serão escritas no binary log. Caso contrário, se a tabela tiver uma Unique Key cujas colunas sejam todas `NOT NULL`, apenas as colunas na Unique Key precisam ser registradas. (Se a tabela não tiver Primary Key nem Unique Key sem colunas `NULL`, todas as colunas devem ser usadas na imagem before e registradas.) Na imagem after, é necessário registrar apenas as colunas que realmente foram alteradas.

  Você pode fazer com que o server registre linhas completas ou mínimas usando a variável de sistema `binlog_row_image`. Esta variável assume, na verdade, um de três valores possíveis, conforme mostrado na lista a seguir:

  + `full`: Registra todas as colunas nas imagens before e after.

  + `minimal`: Registra apenas as colunas na imagem before que são necessárias para identificar a linha a ser alterada; registra apenas as colunas na imagem after onde um valor foi especificado pelo statement SQL, ou gerado por auto-increment.

  + `noblob`: Registra todas as colunas (o mesmo que `full`), exceto para colunas [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") e [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types") que não são necessárias para identificar linhas, ou que não foram alteradas.

  Note

  Esta variável não é suportada pelo NDB Cluster; defini-la não tem efeito no logging de tabelas [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6").

  O valor padrão é `full`.

  Ao usar `minimal` ou `noblob`, Deletes e Updates são garantidos para funcionar corretamente para uma determinada tabela se e somente se as seguintes condições forem verdadeiras para as tabelas source e de destino:

  + Todas as colunas devem estar presentes e na mesma ordem; cada coluna deve usar o mesmo Data Type que sua contraparte na outra tabela.

  + As tabelas devem ter definições idênticas de Primary Key.

  (Em outras palavras, as tabelas devem ser idênticas, com a possível exceção de Indexes que não fazem parte das Primary Keys das tabelas.)

  Se estas condições não forem atendidas, é possível que os valores da coluna da Primary Key na tabela de destino se mostrem insuficientes para fornecer uma correspondência exclusiva para um Delete ou Update. Neste caso, nenhum aviso ou erro é emitido; a source e a réplica divergem silenciosamente, quebrando assim a consistência.

  Definir esta variável não tem efeito quando o formato de binary logging é `STATEMENT`. Quando [`binlog_format`](replication-options-binary-log.html#sysvar_binlog_format) é `MIXED`, a configuração para `binlog_row_image` é aplicada a alterações que são registradas usando o formato baseado em linha, mas esta configuração não tem efeito em alterações registradas como statements.

  Definir `binlog_row_image` no nível global ou de session não causa um COMMIT implícito; isso significa que esta variável pode ser alterada enquanto uma transaction está em andamento sem afetar a transaction.

* `binlog_rows_query_log_events`

  <table frame="box" rules="all" summary="Properties for log-bin"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--log-bin=file_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do Arquivo</td> </tr></tbody></table>

  Esta variável de sistema afeta apenas o logging baseado em linha. Quando habilitada, faz com que o server escreva eventos de log informativos, como eventos de log de Query de linha, em seu binary log. Esta informação pode ser usada para debugging e propósitos relacionados, como obter a Query original emitida na source quando ela não pode ser reconstruída a partir dos updates de linha.

  Estes eventos informativos são normalmente ignorados pelos programas MySQL que leem o binary log e, portanto, não causam problemas ao replicar ou restaurar a partir de backup. Para visualizá-los, aumente o nível de verbosidade usando a opção [`--verbose`](mysqlbinlog.html#option_mysqlbinlog_verbose) do mysqlbinlog duas vezes, como `-vv` ou `--verbose --verbose`.

* [`binlog_stmt_cache_size`](replication-options-binary-log.html#sysvar_binlog_stmt_cache_size)

  <table frame="box" rules="all" summary="Properties for log-bin"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--log-bin=file_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do Arquivo</td> </tr></tbody></table>

  Esta variável determina o tamanho do cache para o binary log manter statements não transacionais emitidos durante uma transaction.

  Caches de statement e transaction de binary log separados são alocados para cada cliente se o server suportar qualquer Storage Engine transacional e se o server tiver o binary log habilitado (opção [`--log-bin`](replication-options-binary-log.html#option_mysqld_log-bin)). Se você costuma usar statements não transacionais grandes durante transactions, você pode aumentar o tamanho deste cache para obter melhor performance. As variáveis de status [`Binlog_stmt_cache_use`](server-status-variables.html#statvar_Binlog_stmt_cache_use) e [`Binlog_stmt_cache_disk_use`](server-status-variables.html#statvar_Binlog_stmt_cache_disk_use) podem ser úteis para ajustar o tamanho desta variável. Consulte [Seção 5.4.4, “The Binary Log”](binary-log.html "5.4.4 The Binary Log").

  A variável de sistema [`binlog_cache_size`](replication-options-binary-log.html#sysvar_binlog_cache_size) define o tamanho para o cache de transaction.

* [`binlog_transaction_dependency_tracking`](replication-options-binary-log.html#sysvar_binlog_transaction_dependency_tracking)

  <table frame="box" rules="all" summary="Properties for log-bin-index"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--log-bin-index=file_name</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>log_bin_index</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do Arquivo</td> </tr></tbody></table>

  A origem das informações de dependência que a source usa para determinar quais transactions podem ser executadas em paralelo pelo aplicador multithreaded da réplica. Esta variável pode assumir um dos três valores descritos na lista a seguir:

  + `COMMIT_ORDER`: As informações de dependência são geradas a partir dos carimbos de data/hora de COMMIT da source. Este é o padrão.

  + `WRITESET`: As informações de dependência são geradas a partir do write set da source, e quaisquer transactions que escrevam tuplas diferentes podem ser paralelizadas.

  + `WRITESET_SESSION`: As informações de dependência são geradas a partir do write set da source, e quaisquer transactions que escrevam tuplas diferentes podem ser paralelizadas, com a exceção de que não é possível reordenar dois updates da mesma session.

  Nos modos `WRITESET` ou `WRITESET_SESSION`, as transactions podem ser submetidas fora de ordem, a menos que você também defina [`slave_preserve_commit_order=1`](replication-options-replica.html#sysvar_slave_preserve_commit_order).

  Para algumas transactions, os modos `WRITESET` e `WRITESET_SESSION` não podem melhorar os resultados que teriam sido retornados no modo `COMMIT_ORDER`. Este é o caso para transactions que têm write sets vazios ou parciais, transactions que atualizam tabelas sem Primary Keys ou Unique Keys, e transactions que atualizam tabelas pai em um relacionamento de Foreign Key. Nestas situações, a source usa o modo `COMMIT_ORDER` para gerar as informações de dependência.

  O valor desta variável não pode ser definido como algo diferente de `COMMIT_ORDER` se [`transaction_write_set_extraction`](replication-options-binary-log.html#sysvar_transaction_write_set_extraction) for `OFF`. Você também deve notar que o valor de `transaction_write_set_extraction` não pode ser alterado se o valor atual de `binlog_transaction_dependency_tracking` for `WRITESET` ou `WRITESET_SESSION`. Se você alterar o valor, o novo valor não entrará em vigor nas réplicas até que a réplica tenha sido parada e reiniciada com os statements [`STOP SLAVE`](stop-slave.html "13.4.2.6 STOP SLAVE Statement") e [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement").

  O número de hashes de linha a serem mantidos e verificados para a transaction mais recente que alterou uma determinada linha é determinado pelo valor de [`binlog_transaction_dependency_history_size`](replication-options-binary-log.html#sysvar_binlog_transaction_dependency_history_size).

* [`binlog_transaction_dependency_history_size`](replication-options-binary-log.html#sysvar_binlog_transaction_dependency_history_size)

  <table frame="box" rules="all" summary="Properties for log-bin-index"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--log-bin-index=file_name</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>log_bin_index</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do Arquivo</td> </tr></tbody></table>

  Define um limite superior para o número de hashes de linha que são mantidos na memória e usados para procurar a transaction que modificou pela última vez uma determinada linha. Uma vez que este número de hashes seja atingido, o histórico é purgado.

* [`expire_logs_days`](replication-options-binary-log.html#sysvar_expire_logs_days)

  <table frame="box" rules="all" summary="Properties for log-bin-index"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--log-bin-index=file_name</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>log_bin_index</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do Arquivo</td> </tr></tbody></table>

  O número de dias para a remoção automática de arquivos de binary log. O padrão é 0, o que significa “sem remoção automática”. Possíveis remoções acontecem na inicialização e quando o binary log é descarregado (flushed). O descarregamento (flushing) do log ocorre conforme indicado em [Seção 5.4, “MySQL Server Logs”](server-logs.html "5.4 MySQL Server Logs").

  Para remover arquivos de binary log manualmente, use o statement [`PURGE BINARY LOGS`](purge-binary-logs.html "13.4.1.1 PURGE BINARY LOGS Statement"). Consulte [Seção 13.4.1.1, “PURGE BINARY LOGS Statement”](purge-binary-logs.html "13.4.1.1 PURGE BINARY LOGS Statement").

* [`log_bin`](replication-options-binary-log.html#sysvar_log_bin)

  <table frame="box" rules="all" summary="Properties for log-bin-index"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--log-bin-index=file_name</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>log_bin_index</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do Arquivo</td> </tr></tbody></table>

  Se o binary log está habilitado. Se a opção [`--log-bin`](replication-options-binary-log.html#option_mysqld_log-bin) for usada, o valor desta variável é `ON`; caso contrário, é `OFF`. Esta variável reporta apenas o status do binary logging (habilitado ou desabilitado); ela não reporta o valor para o qual [`--log-bin`](replication-options-binary-log.html#option_mysqld_log-bin) está definido.

  Consulte [Seção 5.4.4, “The Binary Log”](binary-log.html "5.4.4 The Binary Log").

* [`log_bin_basename`](replication-options-binary-log.html#sysvar_log_bin_basename)

  <table frame="box" rules="all" summary="Properties for log-bin-index"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--log-bin-index=file_name</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>log_bin_index</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do Arquivo</td> </tr></tbody></table>

  Contém o nome base e o path para os arquivos de binary log, que podem ser definidos com a opção de server [`--log-bin`](replication-options-binary-log.html#option_mysqld_log-bin). O comprimento máximo da variável é 256. No MySQL 5.7, o nome base padrão é o nome da máquina host com o sufixo `-bin`. O local padrão é o Data Directory.

* [`log_bin_index`](replication-options-binary-log.html#sysvar_log_bin_index)

  <table frame="box" rules="all" summary="Properties for log-bin-index"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--log-bin-index=file_name</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>log_bin_index</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do Arquivo</td> </tr></tbody></table>

  Contém o nome base e o path para o arquivo Index do binary log, que pode ser definido com a opção de server [`--log-bin-index`](replication-options-binary-log.html#option_mysqld_log-bin-index). O comprimento máximo da variável é 256.

* [`log_bin_trust_function_creators`](replication-options-binary-log.html#sysvar_log_bin_trust_function_creators)

  <table frame="box" rules="all" summary="Properties for log-bin-index"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--log-bin-index=file_name</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>log_bin_index</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do Arquivo</td> </tr></tbody></table>

  Esta variável se aplica quando o binary logging está habilitado. Ela controla se os criadores de stored functions podem ser confiáveis para não criar stored functions que causem a escrita de eventos inseguros no binary log. Se definida como 0 (o padrão), os usuários não têm permissão para criar ou alterar stored functions, a menos que tenham o privilégio [`SUPER`](privileges-provided.html#priv_super) além do privilégio [`CREATE ROUTINE`](privileges-provided.html#priv_create-routine) ou [`ALTER ROUTINE`](privileges-provided.html#priv_alter-routine). Uma configuração de 0 também impõe a restrição de que uma função deve ser declarada com a característica `DETERMINISTIC`, ou com a característica `READS SQL DATA` ou `NO SQL`. Se a variável for definida como 1, o MySQL não impõe estas restrições na criação de stored functions. Esta variável também se aplica à criação de triggers. Consulte [Seção 23.7, “Stored Program Binary Logging”](stored-programs-logging.html "23.7 Stored Program Binary Logging").

* [`log_bin_use_v1_row_events`](replication-options-binary-log.html#sysvar_log_bin_use_v1_row_events)

  <table frame="box" rules="all" summary="Properties for log-bin-index"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--log-bin-index=file_name</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>log_bin_index</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do Arquivo</td> </tr></tbody></table>

  Se o binary logging Versão 2 está em uso. Se esta variável for 0 (desabilitada, o padrão), os eventos de binary log Versão 2 estão em uso. Se esta variável for 1 (habilitada), o server escreve o binary log usando eventos de logging Versão 1 (a única versão de eventos de binary log usada em releases anteriores) e, portanto, produz um binary log que pode ser lido por réplicas mais antigas.

  O MySQL 5.7 usa eventos de linha de binary log Versão 2 por padrão. No entanto, eventos Versão 2 não podem ser lidos por releases do MySQL Server anteriores ao MySQL 5.6.6. Habilitar [`log_bin_use_v1_row_events`](replication-options-binary-log.html#sysvar_log_bin_use_v1_row_events) faz com que o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") escreva o binary log usando eventos de logging Versão 1.

  Esta variável é read-only (somente leitura) em tempo de execução. Para alternar entre o binary logging de eventos binários Versão 1 e Versão 2, é necessário definir [`log_bin_use_v1_row_events`](replication-options-binary-log.html#sysvar_log_bin_use_v1_row_events) na inicialização do server.

  Além de ao realizar upgrades de NDB Cluster Replication, [`log_bin_use_v1_row_events`](replication-options-binary-log.html#sysvar_log_bin_use_v1_row_events) é principalmente de interesse ao configurar a detecção e resolução de conflitos de replication usando `NDB$EPOCH_TRANS()` como a função de detecção de conflitos, que requer eventos de linha de binary log Versão 2. Assim, esta variável e [`--ndb-log-transaction-id`](mysql-cluster-options-variables.html#option_mysqld_ndb-log-transaction-id) não são compatíveis.

  Note

  O MySQL NDB Cluster 7.5 usa eventos de linha de binary log Versão 2 por padrão. Você deve ter isso em mente ao planejar upgrades ou downgrades e para configurações que usam NDB Cluster Replication.

  Para obter mais informações, consulte [Seção 21.7.11, “NDB Cluster Replication Conflict Resolution”](mysql-cluster-replication-conflict-resolution.html "21.7.11 NDB Cluster Replication Conflict Resolution").

* [`log_builtin_as_identified_by_password`](replication-options-binary-log.html#sysvar_log_builtin_as_identified_by_password)

  <table frame="box" rules="all" summary="Properties for log-bin-index"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--log-bin-index=file_name</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>log_bin_index</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do Arquivo</td> </tr></tbody></table>

  Esta variável afeta o binary logging de statements de gerenciamento de usuário. Quando habilitada, a variável tem os seguintes efeitos:

  + O binary logging para statements [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement") envolvendo plugins de autenticação internos reescreve os statements para incluir uma cláusula `IDENTIFIED BY PASSWORD`.

  + Statements [`SET PASSWORD`](set-password.html "13.7.1.7 SET PASSWORD Statement") são registrados como statements [`SET PASSWORD`](set-password.html "13.7.1.7 SET PASSWORD Statement"), em vez de serem reescritos para statements [`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement").

  + Statements [`SET PASSWORD`](set-password.html "13.7.1.7 SET PASSWORD Statement") são alterados para registrar o hash da password em vez da password cleartext (não criptografada) fornecida.

  Habilitar esta variável garante melhor compatibilidade para replication cross-version com réplicas 5.6 e pré-5.7.6, e para aplicativos que esperam esta sintaxe no binary log.

* [`log_slave_updates`](replication-options-binary-log.html#sysvar_log_slave_updates)

  <table frame="box" rules="all" summary="Properties for log-bin-index"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--log-bin-index=file_name</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>log_bin_index</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do Arquivo</td> </tr></tbody></table>

  Se os updates recebidos por um server replica de um server source devem ser registrados no próprio binary log da réplica.

  Normalmente, uma réplica não registra em seu próprio binary log quaisquer updates que sejam recebidos de um server source. Habilitar esta variável faz com que a réplica escreva os updates realizados pelo seu replication SQL Thread em seu próprio binary log. Para que esta opção tenha qualquer efeito, a réplica também deve ser iniciada com a opção [`--log-bin`](replication-options-binary-log.html#option_mysqld_log-bin) para habilitar o binary logging. Consulte [Seção 16.1.6, “Replication and Binary Logging Options and Variables”](replication-options.html "16.1.6 Replication and Binary Logging Options and Variables").

  [`log_slave_updates`](replication-options-binary-log.html#sysvar_log_slave_updates) é habilitada quando você deseja encadear servers de replication. Por exemplo, você pode querer configurar servers de replication usando este arranjo:

  ```sql
  A -> B -> C
  ```

  Aqui, `A` serve como a source para a réplica `B`, e `B` serve como a source para a réplica `C`. Para que isso funcione, `B` deve ser tanto uma source *quanto* uma réplica. Você deve iniciar tanto `A` quanto `B` com [`--log-bin`](replication-options-binary-log.html#option_mysqld_log-bin) para habilitar o binary logging, e `B` com [`log_slave_updates`](replication-options-binary-log.html#sysvar_log_slave_updates) habilitado para que os updates recebidos de `A` sejam registrados por `B` em seu binary log.

* [`log_statements_unsafe_for_binlog`](replication-options-binary-log.html#sysvar_log_statements_unsafe_for_binlog)

  <table frame="box" rules="all" summary="Properties for binlog-do-db"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--binlog-do-db=name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Se o erro 1592 for encontrado, controla se os warnings gerados são adicionados ao error log ou não.

* [`master_verify_checksum`](replication-options-binary-log.html#sysvar_master_verify_checksum)

  <table frame="box" rules="all" summary="Properties for binlog-do-db"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--binlog-do-db=name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Habilitar esta variável faz com que a source verifique os eventos lidos do binary log examinando os checksums e pare com um erro em caso de incompatibilidade. [`master_verify_checksum`](replication-options-binary-log.html#sysvar_master_verify_checksum) está desabilitada por padrão; neste caso, a source usa o comprimento do evento do binary log para verificar os eventos, de modo que apenas eventos completos sejam lidos do binary log.

* [`max_binlog_cache_size`](replication-options-binary-log.html#sysvar_max_binlog_cache_size)

  <table frame="box" rules="all" summary="Properties for binlog-do-db"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--binlog-do-db=name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Se uma transaction exigir mais bytes do que este limite, o server gera um erro Multi-statement transaction required more than 'max_binlog_cache_size' bytes of storage. Quando [`gtid_mode`](replication-options-gtids.html#sysvar_gtid_mode) não é `ON`, o valor máximo recomendado é 4GB, devido ao fato de que, neste caso, o MySQL não pode trabalhar com posições de binary log maiores que 4GB; quando `gtid_mode` é `ON`, esta limitação não se aplica e o server pode trabalhar com posições de binary log de tamanho arbitrário.

  Se, porque [`gtid_mode`](replication-options-gtids.html#sysvar_gtid_mode) não é `ON`, ou por algum outro motivo, você precisa garantir que o binary log não exceda um determinado tamanho *`maxsize`*, você deve definir esta variável de acordo com a fórmula mostrada aqui:

  ```sql
  max_binlog_cache_size <
    (((maxsize - max_binlog_size) / max_connections) - 1000) / 1.2
  ```

  Este cálculo leva em consideração as seguintes condições:

  + O server escreve no binary log, desde que o tamanho antes de começar a escrever seja menor que [`max_binlog_size`](replication-options-binary-log.html#sysvar_max_binlog_size).

  + O server não escreve transactions únicas, mas sim grupos de transactions. O número máximo possível de transactions em um grupo é igual a [`max_connections`](server-system-variables.html#sysvar_max_connections).

  + O server escreve dados que não estão incluídos no cache. Isso inclui um checksum de 4 bytes para cada evento; embora isso adicione menos de 20% ao tamanho da transaction, essa quantidade não é desprezível. Além disso, o server escreve um `Gtid_log_event` para cada transaction; cada um desses eventos pode adicionar mais 1 KB ao que é escrito no binary log.

  `max_binlog_cache_size` define o tamanho apenas para o cache de transaction; o limite superior para o cache de statement é regido pela variável de sistema [`max_binlog_stmt_cache_size`](replication-options-binary-log.html#sysvar_max_binlog_stmt_cache_size).

  A visibilidade para sessions de `max_binlog_cache_size` corresponde à da variável de sistema [`binlog_cache_size`](replication-options-binary-log.html#sysvar_binlog_cache_size); em outras palavras, alterar seu valor afeta apenas novas sessions iniciadas após a alteração do valor.

* [`max_binlog_size`](replication-options-binary-log.html#sysvar_max_binlog_size)

  <table frame="box" rules="all" summary="Properties for binlog-do-db"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--binlog-do-db=name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Se uma escrita no binary log fizer com que o tamanho atual do arquivo de log exceda o valor desta variável, o server rotaciona os binary logs (fecha o arquivo atual e abre o próximo). O valor mínimo é de 4096 bytes. O valor máximo e padrão é 1GB.

  Uma transaction é escrita em um bloco no binary log, de modo que nunca é dividida entre vários binary logs. Portanto, se você tiver transactions grandes, poderá ver arquivos de binary log maiores que [`max_binlog_size`](replication-options-binary-log.html#sysvar_max_binlog_size).

  Se [`max_relay_log_size`](replication-options-replica.html#sysvar_max_relay_log_size) for 0, o valor de [`max_binlog_size`](replication-options-binary-log.html#sysvar_max_binlog_size) se aplica também aos relay logs.

* [`max_binlog_stmt_cache_size`](replication-options-binary-log.html#sysvar_max_binlog_stmt_cache_size)

  <table frame="box" rules="all" summary="Properties for binlog-do-db"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--binlog-do-db=name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Se statements não transacionais dentro de uma transaction exigirem mais bytes de memória do que este limite, o server gera um erro. O valor mínimo é 4096. Os valores máximo e padrão são 4GB em plataformas de 32 bits e 16EB (exabytes) em plataformas de 64 bits.

  `max_binlog_stmt_cache_size` define o tamanho apenas para o cache de statement; o limite superior para o cache de transaction é regido exclusivamente pela variável de sistema [`max_binlog_cache_size`](replication-options-binary-log.html#sysvar_max_binlog_cache_size).

* [`sql_log_bin`](replication-options-binary-log.html#sysvar_sql_log_bin)

  <table frame="box" rules="all" summary="Properties for binlog-do-db"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--binlog-do-db=name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Esta variável controla se o logging para o binary log está habilitado para a session atual (assumindo que o binary log em si está habilitado). O valor padrão é `ON`. Para desabilitar ou habilitar o binary logging para a session atual, defina a variável de session [`sql_log_bin`](replication-options-binary-log.html#sysvar_sql_log_bin) para `OFF` ou `ON`.

  Defina esta variável como `OFF` para uma session para desabilitar temporariamente o binary logging enquanto faz alterações na source que você não deseja replicar para a réplica.

  Definir o valor de session desta variável de sistema é uma operação restrita. O usuário da session deve ter privilégios suficientes para definir variáveis de session restritas. Consulte [Seção 5.1.8.1, “System Variable Privileges”](system-variable-privileges.html "5.1.8.1 System Variable Privileges").

  Não é possível definir o valor de session de [`sql_log_bin`](replication-options-binary-log.html#sysvar_sql_log_bin) dentro de uma transaction ou subquery.

  *Definir esta variável como `OFF` impede que GTIDs sejam atribuídos a transactions no binary log*. Se você estiver usando GTIDs para replication, isso significa que, mesmo quando o binary logging for habilitado novamente mais tarde, os GTIDs escritos no log a partir deste ponto não contabilizam nenhuma transaction que ocorreu nesse meio tempo, então, na prática, essas transactions são perdidas.

  A variável global [`sql_log_bin`](replication-options-binary-log.html#sysvar_sql_log_bin) é read only (somente leitura) e não pode ser modificada. O escopo global está depreciado; espera-se que seja removido em um futuro release do MySQL.

* [`sync_binlog`](replication-options-binary-log.html#sysvar_sync_binlog)

  <table frame="box" rules="all" summary="Properties for binlog-do-db"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--binlog-do-db=name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Controla a frequência com que o MySQL server sincroniza o binary log para o disco.

  + [`sync_binlog=0`](replication-options-binary-log.html#sysvar_sync_binlog): Desabilita a sincronização do binary log para o disco pelo MySQL server. Em vez disso, o MySQL server confia no sistema operacional para descarregar (flush) o binary log para o disco de tempos em tempos, como faz para qualquer outro arquivo. Esta configuração fornece a melhor performance, mas no caso de uma falha de energia ou falha do sistema operacional, é possível que o server tenha submetido transactions que não foram sincronizadas para o binary log.

  + [`sync_binlog=1`](replication-options-binary-log.html#sysvar_sync_binlog): Habilita a sincronização do binary log para o disco antes que as transactions sejam submetidas (committed). Esta é a configuração mais segura, mas pode ter um impacto negativo na performance devido ao aumento do número de escritas em disco. No caso de uma falha de energia ou falha do sistema operacional, as transactions que estão faltando no binary log estão apenas em um estado preparado. Isso permite que a rotina de recuperação automática faça o rollback das transactions, o que garante que nenhuma transaction seja perdida do binary log.

  + [`sync_binlog=N`](replication-options-binary-log.html#sysvar_sync_binlog), onde *`N`* é um valor diferente de 0 ou 1: O binary log é sincronizado para o disco após `N` grupos de COMMIT do binary log terem sido coletados. No caso de uma falha de energia ou falha do sistema operacional, é possível que o server tenha submetido transactions que não foram descarregadas (flushed) para o binary log. Esta configuração pode ter um impacto negativo na performance devido ao aumento do número de escritas em disco. Um valor mais alto melhora a performance, mas com um risco aumentado de perda de dados.

  Para a maior durabilidade e consistência possíveis em uma configuração de replication que usa `InnoDB` com transactions, use estas configurações:

  + [`sync_binlog=1`](replication-options-binary-log.html#sysvar_sync_binlog).
  + [`innodb_flush_log_at_trx_commit=1`](innodb-parameters.html#sysvar_innodb_flush_log_at_trx_commit).

  Cuidado

  Muitos sistemas operacionais e alguns hardwares de disco enganam a operação de flush-to-disk. Eles podem dizer ao [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") que o flush ocorreu, mesmo que não tenha ocorrido. Neste caso, a durabilidade das transactions não é garantida mesmo com as configurações recomendadas e, no pior dos casos, uma queda de energia pode corromper dados do `InnoDB`. Usar um cache de disco com bateria (battery-backed) no controlador de disco SCSI ou no próprio disco acelera os flushes de arquivo e torna a operação mais segura. Você também pode tentar desabilitar o caching de escritas em disco em caches de hardware.

* [`transaction_write_set_extraction`](replication-options-binary-log.html#sysvar_transaction_write_set_extraction)

  <table frame="box" rules="all" summary="Properties for binlog-do-db"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--binlog-do-db=name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Define o algoritmo usado para gerar um hash que identifica as escritas associadas a uma transaction. Se você estiver usando Group Replication, o valor de hash é usado para detecção e tratamento de conflitos distribuídos. Em sistemas de 64 bits executando Group Replication, recomendamos definir isso como `XXHASH64` para evitar colisões de hash desnecessárias que resultam em falhas de certificação e no rollback de transactions do usuário. Consulte [Seção 17.3.1, “Group Replication Requirements”](group-replication-requirements.html "17.3.1 Group Replication Requirements"). [`binlog_format`](replication-options-binary-log.html#sysvar_binlog_format) deve ser definido como `ROW` para alterar o valor desta variável. Se você alterar o valor, o novo valor não entrará em vigor nas réplicas até que a réplica tenha sido parada e reiniciada com os statements [`STOP SLAVE`](stop-slave.html "13.4.2.6 STOP SLAVE Statement") e [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement").

  Note

  Quando `WRITESET` ou `WRITESET_SESSION` é definido como o valor para [`binlog_transaction_dependency_tracking`](replication-options-binary-log.html#sysvar_binlog_transaction_dependency_tracking), [`transaction_write_set_extraction`](replication-options-binary-log.html#sysvar_transaction_write_set_extraction) deve ser definido para especificar um algoritmo (não definido como `OFF`). Enquanto o valor atual de [`binlog_transaction_dependency_tracking`](replication-options-binary-log.html#sysvar_binlog_transaction_dependency_tracking) for `WRITESET` ou `WRITESET_SESSION`, você não pode alterar o valor de [`transaction_write_set_extraction`](replication-options-binary-log.html#sysvar_transaction_write_set_extraction).