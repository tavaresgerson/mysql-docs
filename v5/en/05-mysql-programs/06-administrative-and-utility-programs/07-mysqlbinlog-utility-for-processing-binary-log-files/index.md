### 4.6.7 mysqlbinlog — Utilitário para Processamento de Arquivos de Binary Log

4.6.7.1 Formato Hex Dump do mysqlbinlog

4.6.7.2 Exibição de Row Event do mysqlbinlog

4.6.7.3 Usando o mysqlbinlog para Fazer Backup de Arquivos de Binary Log

4.6.7.4 Especificando o Server ID do mysqlbinlog

O binary log do server consiste em arquivos contendo “events” que descrevem modificações no conteúdo do Database. O server escreve esses arquivos em formato binário. Para exibir seus conteúdos em formato de texto, use o utilitário **mysqlbinlog**. Você também pode usar o **mysqlbinlog** para exibir o conteúdo dos relay log files escritos por um replica server em uma configuração de Replication, pois os relay logs têm o mesmo formato dos binary logs. O binary log e o relay log são discutidos posteriormente na Seção 5.4.4, “The Binary Log”, e na Seção 16.2.4, “Relay Log and Replication Metadata Repositories”.

Invoque o **mysqlbinlog** desta forma:

```sql
mysqlbinlog [options] log_file ...
```

Por exemplo, para exibir o conteúdo do arquivo de binary log chamado `binlog.000003`, use este comando:

```sql
mysqlbinlog binlog.000003
```

A saída inclui events contidos em `binlog.000003`. Para Statement-based logging, as informações do event incluem o SQL statement, o ID do server no qual ele foi executado, o timestamp de quando o statement foi executado, quanto tempo levou, e assim por diante. Para Row-based logging, o event indica uma alteração de linha (row change) em vez de um SQL statement. Consulte a Seção 16.2.1, “Replication Formats”, para obter informações sobre os modos de logging.

Os events são precedidos por comentários de cabeçalho que fornecem informações adicionais. Por exemplo:

```sql
# at 141
#100309  9:28:36 server id 123  end_log_pos 245
  Query thread_id=3350  exec_time=11  error_code=0
```

Na primeira linha, o número após `at` indica o file offset, ou posição inicial, do event no arquivo de binary log.

A segunda linha começa com uma data e hora indicando quando o statement começou no server onde o event se originou. Para Replication, este timestamp é propagado para os replica servers. `server id` é o valor de `server_id` do server onde o event se originou. `end_log_pos` indica onde o próximo event começa (ou seja, é a posição final do event atual + 1). `thread_id` indica qual Thread executou o event. `exec_time` é o tempo gasto na execução do event, em um replication source server. Em uma réplica (replica), é a diferença entre o tempo final de execução na réplica menos o tempo inicial de execução na origem. A diferença serve como um indicador de quão atrasada (lags behind) está a Replication em relação à origem. `error_code` indica o resultado da execução do event. Zero significa que nenhum error ocorreu.

Nota

Ao usar event groups, os file offsets dos events podem ser agrupados e os comentários dos events podem ser agrupados. Não confunda esses events agrupados com file offsets em branco.

A saída do **mysqlbinlog** pode ser re-executada (por exemplo, usando-a como input para o **mysql**) para refazer os statements no log. Isso é útil para operações de recovery após uma saída inesperada do server. Para outros exemplos de uso, consulte a discussão posterior nesta seção e na Seção 7.5, “Point-in-Time (Incremental) Recovery”.

Você pode usar o **mysqlbinlog** para ler binary log files diretamente e aplicá-los ao MySQL server local. Você também pode ler binary logs de um server remoto usando a opção `--read-from-remote-server`. Para ler binary logs remotos, as opções de connection parameter podem ser fornecidas para indicar como se conectar ao server. Essas opções são `--host`, `--password`, `--port`, `--protocol`, `--socket` e `--user`.

Ao executar o **mysqlbinlog** contra um binary log grande, tenha cuidado para que o filesystem tenha espaço suficiente para os arquivos resultantes. Para configurar o diretório que o **mysqlbinlog** usa para arquivos temporários, use a variável de ambiente `TMPDIR`.

O **mysqlbinlog** define o valor de `pseudo_slave_mode` como true antes de executar qualquer SQL statement. Essa system variable afeta o tratamento de XA transactions.

O **mysqlbinlog** suporta as seguintes opções, que podem ser especificadas na linha de comando ou nos grupos `[mysqlbinlog]` e `[client]` de um option file. Para obter informações sobre option files usados por programas MySQL, consulte a Seção 4.2.2.2, “Using Option Files”.

**Tabela 4.23 Opções do mysqlbinlog**

<table frame="box" rules="all" summary="Opções de linha de comando disponíveis para mysqlbinlog."><col style="width: 27%"/><col style="width: 50%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th>Nome da Opção</th> <th>Descrição</th> <th>Introduzido</th> <th>Obsoleto</th> </tr></thead><tbody><tr><th>--base64-output</th> <td>Imprime entradas do binary log usando codificação base-64</td> <td></td> <td></td> </tr><tr><th>--bind-address</th> <td>Usa a interface de rede especificada para conectar ao MySQL Server</td> <td></td> <td></td> </tr><tr><th>--binlog-row-event-max-size</th> <td>Tamanho máximo do event do binary log</td> <td></td> <td></td> </tr><tr><th>--character-sets-dir</th> <td>Diretório onde os character sets estão instalados</td> <td></td> <td></td> </tr><tr><th>--connection-server-id</th> <td>Usado para testes e debugging. Consulte o texto para valores default aplicáveis e outras particularidades</td> <td></td> <td></td> </tr><tr><th>--database</th> <td>Lista entradas apenas para este Database</td> <td></td> <td></td> </tr><tr><th>--debug</th> <td>Escreve log de debugging</td> <td></td> <td></td> </tr><tr><th>--debug-check</th> <td>Imprime informações de debugging quando o programa é encerrado</td> <td></td> <td></td> </tr><tr><th>--debug-info</th> <td>Imprime informações de debugging, memória e estatísticas de CPU quando o programa é encerrado</td> <td></td> <td></td> </tr><tr><th>--default-auth</th> <td>Plugin de Authentication a ser usado</td> <td></td> <td></td> </tr><tr><th>--defaults-extra-file</th> <td>Lê o option file nomeado, além dos option files usuais</td> <td></td> <td></td> </tr><tr><th>--defaults-file</th> <td>Lê apenas o option file nomeado</td> <td></td> <td></td> </tr><tr><th>--defaults-group-suffix</th> <td>Valor do sufixo do grupo de opções</td> <td></td> <td></td> </tr><tr><th>--disable-log-bin</th> <td>Desabilita o binary logging</td> <td></td> <td></td> </tr><tr><th>--exclude-gtids</th> <td>Não mostra nenhum dos grupos no GTID set fornecido</td> <td></td> <td></td> </tr><tr><th>--force-if-open</th> <td>Lê arquivos de binary log mesmo que estejam abertos ou não tenham sido fechados corretamente</td> <td></td> <td></td> </tr><tr><th>--force-read</th> <td>Se o mysqlbinlog ler um binary log event que não reconhece, ele imprime um warning</td> <td></td> <td></td> </tr><tr><th>--get-server-public-key</th> <td>Solicita a chave pública RSA do server</td> <td>5.7.23</td> <td></td> </tr><tr><th>--help</th> <td>Exibe mensagem de ajuda e sai</td> <td></td> <td></td> </tr><tr><th>--hexdump</th> <td>Exibe um hex dump do log em comentários</td> <td></td> <td></td> </tr><tr><th>--host</th> <td>Host onde o MySQL server está localizado</td> <td></td> <td></td> </tr><tr><th>--idempotent</th> <td>Faz com que o server use o modo idempotent ao processar updates do binary log apenas nesta session</td> <td></td> <td></td> </tr><tr><th>--include-gtids</th> <td>Mostra apenas os grupos no GTID set fornecido</td> <td></td> <td></td> </tr><tr><th>--local-load</th> <td>Prepara arquivos temporários locais para LOAD DATA no diretório especificado</td> <td></td> <td></td> </tr><tr><th>--login-path</th> <td>Lê opções de login path de .mylogin.cnf</td> <td></td> <td></td> </tr><tr><th>--no-defaults</th> <td>Não lê option files</td> <td></td> <td></td> </tr><tr><th>--offset</th> <td>Pula as primeiras N entradas no log</td> <td></td> <td></td> </tr><tr><th>--open-files-limit</th> <td>Especifica o número de file descriptors abertos a serem reservados</td> <td></td> <td></td> </tr><tr><th>--password</th> <td>Senha a ser usada ao conectar-se ao server</td> <td></td> <td></td> </tr><tr><th>--plugin-dir</th> <td>Diretório onde os plugins estão instalados</td> <td></td> <td></td> </tr><tr><th>--port</th> <td>Número da porta TCP/IP para a conexão</td> <td></td> <td></td> </tr><tr><th>--print-defaults</th> <td>Imprime opções default</td> <td></td> <td></td> </tr><tr><th>--protocol</th> <td>Protocolo de transporte a ser usado</td> <td></td> <td></td> </tr><tr><th>--raw</th> <td>Escreve events em formato raw (binário) nos arquivos de saída</td> <td></td> <td></td> </tr><tr><th>--read-from-remote-master</th> <td>Lê o binary log de um MySQL replication source server em vez de ler um arquivo de log local</td> <td></td> <td></td> </tr><tr><th>--read-from-remote-server</th> <td>Lê o binary log de um MySQL server em vez de um arquivo de log local</td> <td></td> <td></td> </tr><tr><th>--result-file</th> <td>Direciona a saída para o arquivo nomeado</td> <td></td> <td></td> </tr><tr><th>--rewrite-db</th> <td>Cria regras de rewrite para Databases ao reproduzir logs escritos em formato row-based. Pode ser usado múltiplas vezes</td> <td></td> <td></td> </tr><tr><th>--secure-auth</th> <td>Não envia senhas ao server em formato antigo (pré-4.1)</td> <td></td> <td>Sim</td> </tr><tr><th>--server-id</th> <td>Extrai apenas os events criados pelo server que possui o server ID fornecido</td> <td></td> <td></td> </tr><tr><th>--server-id-bits</th> <td>Informa ao mysqlbinlog como interpretar os Server IDs no binary log quando o log foi escrito por um mysqld com seu server-id-bits definido para menos do que o máximo; suportado apenas pela versão do MySQL Cluster do mysqlbinlog</td> <td></td> <td></td> </tr><tr><th>--server-public-key-path</th> <td>Nome do Path para o arquivo contendo a chave pública RSA</td> <td>5.7.23</td> <td></td> </tr><tr><th>--set-charset</th> <td>Adiciona um statement SET NAMES charset_name à saída</td> <td></td> <td></td> </tr><tr><th>--shared-memory-base-name</th> <td>Nome da Shared-memory para conexões de shared-memory (apenas Windows)</td> <td></td> <td></td> </tr><tr><th>--short-form</th> <td>Exibe apenas os statements contidos no log</td> <td></td> <td></td> </tr><tr><th>--skip-gtids</th> <td>Não inclui os GTIDs dos binary log files no arquivo de dump de saída</td> <td></td> <td></td> </tr><tr><th>--socket</th> <td>Arquivo de Unix socket ou named pipe do Windows a ser usado</td> <td></td> <td></td> </tr><tr><th>--ssl</th> <td>Habilita a conexão criptografada</td> <td></td> <td></td> </tr><tr><th>--ssl-ca</th> <td>Arquivo que contém a lista de Certificate Authorities SSL confiáveis</td> <td></td> <td></td> </tr><tr><th>--ssl-capath</th> <td>Diretório que contém arquivos de certificado de Certificate Authority SSL confiáveis</td> <td></td> <td></td> </tr><tr><th>--ssl-cert</th> <td>Arquivo que contém o certificado X.509</td> <td></td> <td></td> </tr><tr><th>--ssl-cipher</th> <td>Ciphers permitidos para criptografia de conexão</td> <td></td> <td></td> </tr><tr><th>--ssl-crl</th> <td>Arquivo que contém listas de revogação de certificado</td> <td></td> <td></td> </tr><tr><th>--ssl-crlpath</th> <td>Diretório que contém arquivos de lista de revogação de certificado</td> <td></td> <td></td> </tr><tr><th>--ssl-key</th> <td>Arquivo que contém a chave X.509</td> <td></td> <td></td> </tr><tr><th>--ssl-mode</th> <td>Estado de segurança desejado da conexão com o server</td> <td>5.7.11</td> <td></td> </tr><tr><th>--ssl-verify-server-cert</th> <td>Verifica o host name em relação à identidade Common Name do certificado do server</td> <td></td> <td></td> </tr><tr><th>--start-datetime</th> <td>Lê o binary log a partir do primeiro event com timestamp igual ou posterior ao argumento datetime</td> <td></td> <td></td> </tr><tr><th>--start-position</th> <td>Decodifica o binary log a partir do primeiro event com position igual ou superior ao argumento</td> <td></td> <td></td> </tr><tr><th>--stop-datetime</th> <td>Para de ler o binary log no primeiro event com timestamp igual ou posterior ao argumento datetime</td> <td></td> <td></td> </tr><tr><th>--stop-never</th> <td>Permanece conectado ao server após ler o último binary log file</td> <td></td> <td></td> </tr><tr><th>--stop-never-slave-server-id</th> <td>Slave server ID a ser relatado ao conectar-se ao server</td> <td></td> <td></td> </tr><tr><th>--stop-position</th> <td>Para de decodificar o binary log no primeiro event com position igual ou superior ao argumento</td> <td></td> <td></td> </tr><tr><th>--tls-version</th> <td>Protocolos TLS permitidos para conexões criptografadas</td> <td>5.7.10</td> <td></td> </tr><tr><th>--to-last-log</th> <td>Não para no final do binary log solicitado de um MySQL server, mas continua imprimindo até o final do último binary log</td> <td></td> <td></td> </tr><tr><th>--user</th> <td>Nome de usuário MySQL a ser usado ao conectar-se ao server</td> <td></td> <td></td> </tr><tr><th>--verbose</th> <td>Reconstrói row events como SQL statements</td> <td></td> <td></td> </tr><tr><th>--verify-binlog-checksum</th> <td>Verifica checksums no binary log</td> <td></td> <td></td> </tr><tr><th>--version</th> <td>Exibe informações da versão e sai</td> <td></td> <td></td> </tr></tbody></table>

* `--help`, `-?`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Exibe uma mensagem de ajuda e sai.

* `--base64-output=value`

  <table frame="box" rules="all" summary="Propriedades para base64-output"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--base64-output=value</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Default</th> <td><code>AUTO</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>AUTO</code></p><p><code>NEVER</code></p><p><code>DECODE-ROWS</code></p></td> </tr></tbody></table>

  Esta opção determina quando os events devem ser exibidos codificados como strings base-64 usando statements `BINLOG`. A opção tem estes valores permitidos (sem distinção entre maiúsculas e minúsculas):

  + `AUTO` ("automático") ou `UNSPEC` ("não especificado") exibe statements `BINLOG` automaticamente quando necessário (ou seja, para format description events e row events). Se nenhuma opção `--base64-output` for fornecida, o efeito é o mesmo que `--base64-output=AUTO`.

    Nota

    A exibição automática de `BINLOG` é o único comportamento seguro se você pretende usar a saída do **mysqlbinlog** para re-executar o conteúdo do binary log file. Os outros valores de opção são destinados apenas a fins de debugging ou teste porque podem produzir uma saída que não inclui todos os events em formato executável.

  + `NEVER` faz com que os statements `BINLOG` não sejam exibidos. O **mysqlbinlog** sai com um error se for encontrado um row event que deve ser exibido usando `BINLOG`.

  + `DECODE-ROWS` especifica ao **mysqlbinlog** que você pretende que os row events sejam decodificados e exibidos como SQL statements comentados, especificando também a opção `--verbose`. Assim como `NEVER`, o `DECODE-ROWS` suprime a exibição de statements `BINLOG`, mas, diferentemente de `NEVER`, não sai com um error se um row event for encontrado.

  Para exemplos que mostram o efeito de `--base64-output` e `--verbose` na saída de row event, consulte a Seção 4.6.7.2, “mysqlbinlog Row Event Display”.

* `--bind-address=ip_address`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  Em um computador com múltiplas interfaces de rede, use esta opção para selecionar qual interface usar para conectar-se ao MySQL server.

* `--binlog-row-event-max-size=N`

  <table frame="box" rules="all" summary="Propriedades para binlog-row-event-max-size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--binlog-row-event-max-size=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor Default</th> <td><code>4294967040</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>256</code></td> </tr><tr><th>Valor Máximo</th> <td><code>18446744073709547520</code></td> </tr></tbody></table>

  Especifica o tamanho máximo de um binary log event baseado em linha (row-based), em bytes. As linhas são agrupadas em events menores do que este tamanho, se possível. O valor deve ser um múltiplo de 256. O default é 4GB.

* `--character-sets-dir=dir_name`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do Diretório</td> </tr></tbody></table>

  O diretório onde os character sets estão instalados. Consulte a Seção 10.15, “Character Set Configuration”.

* `--connection-server-id=server_id`

  <table frame="box" rules="all" summary="Propriedades para connection-server-id"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--connection-server-id=#]</code></td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Default</th> <td><code>0 (1)</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0 (1)</code></td> </tr><tr><th>Valor Máximo</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Esta opção é usada para testar o suporte de um MySQL server ao connection flag `BINLOG_DUMP_NON_BLOCK`. Não é necessária para operações normais.

  Os valores default e mínimos efetivos para esta opção dependem de o **mysqlbinlog** ser executado em modo blocking ou non-blocking. Quando o **mysqlbinlog** é executado em modo blocking, o valor default (e mínimo) é 1; quando executado em modo non-blocking, o valor default (e mínimo) é 0.

* `--database=db_name`, `-d db_name`

  <table frame="box" rules="all" summary="Propriedades para database"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--database=db_name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Esta opção faz com que o **mysqlbinlog** gere entradas do binary log (apenas log local) que ocorrem enquanto *`db_name`* é selecionado como o Database default por `USE`.

  A opção `--database` para **mysqlbinlog** é semelhante à opção `--binlog-do-db` para **mysqld**, mas pode ser usada para especificar apenas um Database. Se `--database` for fornecida várias vezes, apenas a última instância será usada.

  Os efeitos desta opção dependem se o formato de logging statement-based ou row-based está em uso, da mesma forma que os efeitos de `--binlog-do-db` dependem se o logging statement-based ou row-based está em uso.

  **Logging Statement-based.** A opção `--database` funciona da seguinte forma:

  + Enquanto *`db_name`* for o Database default, os statements são gerados, quer modifiquem tables em *`db_name`* ou em um Database diferente.

  + A menos que *`db_name`* seja selecionado como o Database default, os statements não são gerados, mesmo que modifiquem tables em *`db_name`*.

  + Há uma exceção para `CREATE DATABASE`, `ALTER DATABASE` e `DROP DATABASE`. O Database sendo *criado, alterado ou excluído* é considerado o Database default ao determinar se o statement deve ser gerado.

  Suponha que o binary log foi criado executando estes statements usando Statement-based-logging:

  ```sql
  INSERT INTO test.t1 (i) VALUES(100);
  INSERT INTO db2.t2 (j)  VALUES(200);
  USE test;
  INSERT INTO test.t1 (i) VALUES(101);
  INSERT INTO t1 (i)      VALUES(102);
  INSERT INTO db2.t2 (j)  VALUES(201);
  USE db2;
  INSERT INTO test.t1 (i) VALUES(103);
  INSERT INTO db2.t2 (j)  VALUES(202);
  INSERT INTO t2 (j)      VALUES(203);
  ```

  **mysqlbinlog --database=test** não gera os dois primeiros statements `INSERT` porque não há um Database default. Ele gera os três statements `INSERT` após `USE test`, mas não os três statements `INSERT` após `USE db2`.

  **mysqlbinlog --database=db2** não gera os dois primeiros statements `INSERT` porque não há um Database default. Ele não gera os três statements `INSERT` após `USE test`, mas gera os três statements `INSERT` após `USE db2`.

  **Logging Row-based.** O **mysqlbinlog** gera apenas entradas que alteram tables pertencentes a *`db_name`*. O Database default não tem efeito nisso. Suponha que o binary log descrito acima foi criado usando Row-based logging em vez de Statement-based logging. **mysqlbinlog --database=test** gera apenas as entradas que modificam `t1` no Database `test`, independentemente de `USE` ter sido emitido ou qual seja o Database default.

  Se um server estiver rodando com `binlog_format` definido como `MIXED` e você quiser que seja possível usar o **mysqlbinlog** com a opção `--database`, você deve garantir que as tables que são modificadas estejam no Database selecionado por `USE`. (Em particular, nenhum update cross-database deve ser usado.)

  Quando usado em conjunto com a opção `--rewrite-db`, a opção `--rewrite-db` é aplicada primeiro; então a opção `--database` é aplicada, usando o nome do Database reescrito. A ordem em que as opções são fornecidas não faz diferença a este respeito.

* `--debug[=debug_options]`, `-# [debug_options]`

  <table frame="box" rules="all" summary="Propriedades para debug"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--debug[=debug_options]</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Default</th> <td><code>d:t:o,/tmp/mysqlbinlog.trace</code></td> </tr></tbody></table>

  Escreve um log de debugging. Uma string típica de *`debug_options`* é `d:t:o,file_name`. O default é `d:t:o,/tmp/mysqlbinlog.trace`.

  Esta opção está disponível apenas se o MySQL foi compilado usando `WITH_DEBUG`. Binários de release do MySQL fornecidos pela Oracle *não* são compilados usando esta opção.

* `--debug-check`

  <table frame="box" rules="all" summary="Propriedades para debug-check"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--debug-check</code></td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Default</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Imprime algumas informações de debugging quando o programa é encerrado.

  Esta opção está disponível apenas se o MySQL foi compilado usando `WITH_DEBUG`. Binários de release do MySQL fornecidos pela Oracle *não* são compilados usando esta opção.

* `--debug-info`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Imprime informações de debugging e estatísticas de uso de memória e CPU quando o programa é encerrado.

  Esta opção está disponível apenas se o MySQL foi compilado usando `WITH_DEBUG`. Binários de release do MySQL fornecidos pela Oracle *não* são compilados usando esta opção.

* `--default-auth=plugin`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Uma dica sobre qual plugin de Authentication do lado do client usar. Consulte a Seção 6.2.13, “Pluggable Authentication”.

* `--defaults-extra-file=file_name`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Lê este option file após o option file global, mas (no Unix) antes do option file do user. Se o arquivo não existir ou for inacessível, ocorrerá um error. Se *`file_name`* não for um path name absoluto, ele será interpretado em relação ao diretório atual.

  Para informações adicionais sobre esta e outras opções de option file, consulte a Seção 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--defaults-file=file_name`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Usa apenas o option file fornecido. Se o arquivo não existir ou for inacessível, ocorrerá um error. Se *`file_name`* não for um path name absoluto, ele será interpretado em relação ao diretório atual.

  Exceção: Mesmo com `--defaults-file`, os programas client leem `.mylogin.cnf`.

  Para informações adicionais sobre esta e outras opções de option file, consulte a Seção 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--defaults-group-suffix=str`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Lê não apenas os grupos de opções usuais, mas também grupos com os nomes usuais e um sufixo de *`str`*. Por exemplo, o **mysqlbinlog** normalmente lê os grupos `[client]` e `[mysqlbinlog]`. Se esta opção for fornecida como `--defaults-group-suffix=_other`, o **mysqlbinlog** também lerá os grupos `[client_other]` e `[mysqlbinlog_other]`.

  Para informações adicionais sobre esta e outras opções de option file, consulte a Seção 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--disable-log-bin`, `-D`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Desabilita o binary logging. Isso é útil para evitar um loop infinito se você usar a opção `--to-last-log` e estiver enviando a saída para o mesmo MySQL server. Esta opção também é útil ao restaurar após uma saída inesperada para evitar a duplicação dos statements que você logou.

  Esta opção faz com que o **mysqlbinlog** inclua um statement `SET sql_log_bin = 0` em sua saída para desabilitar o binary logging da saída restante. A manipulação do valor de session da system variable `sql_log_bin` é uma operação restrita, portanto, esta opção exige que você tenha privilégios suficientes para definir restricted session variables. Consulte a Seção 5.1.8.1, “System Variable Privileges”.

* `--exclude-gtids=gtid_set`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Não exibe nenhum dos grupos listados no *`gtid_set`*.

* `--force-if-open`, `-F`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Lê arquivos de binary log mesmo que estejam abertos ou não tenham sido fechados corretamente.

* `--force-read`, `-f`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Com esta opção, se o **mysqlbinlog** ler um binary log event que não reconhece, ele imprime um warning, ignora o event e continua. Sem esta opção, o **mysqlbinlog** para se ler tal event.

* `--get-server-public-key`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Solicita ao server a chave pública necessária para o password exchange baseado em RSA key pair. Esta opção se aplica a clients que autenticam com o plugin de Authentication `caching_sha2_password`. Para esse plugin, o server não envia a chave pública a menos que seja solicitada. Esta opção é ignorada para contas que não autenticam com esse plugin. Também é ignorada se o password exchange baseado em RSA não for usado, como é o caso quando o client se conecta ao server usando uma conexão segura.

  Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele terá precedência sobre `--get-server-public-key`.

  Para obter informações sobre o plugin `caching_sha2_password`, consulte a Seção 6.4.1.4, “Caching SHA-2 Pluggable Authentication”.

  A opção `--get-server-public-key` foi adicionada no MySQL 5.7.23.

* `--hexdump`, `-H`

  <table frame="box" rules="all" summary="Propriedades para base64-output"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--base64-output=value</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Default</th> <td><code>AUTO</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>AUTO</code></p><p><code>NEVER</code></p><p><code>DECODE-ROWS</code></p></td> </tr></tbody></table>

  Exibe um hex dump do log em comentários, conforme descrito na Seção 4.6.7.1, “mysqlbinlog Hex Dump Format”. A saída hexadecimal pode ser útil para debugging de Replication.

* `--host=host_name`, `-h host_name`

  <table frame="box" rules="all" summary="Propriedades para base64-output"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--base64-output=value</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Default</th> <td><code>AUTO</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>AUTO</code></p><p><code>NEVER</code></p><p><code>DECODE-ROWS</code></p></td> </tr></tbody></table>

  Obtém o binary log do MySQL server no host fornecido.

* `--idempotent`

  <table frame="box" rules="all" summary="Propriedades para base64-output"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--base64-output=value</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Default</th> <td><code>AUTO</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>AUTO</code></p><p><code>NEVER</code></p><p><code>DECODE-ROWS</code></p></td> </tr></tbody></table>

  Informa ao MySQL Server para usar o modo idempotent ao processar updates; isso causa a supressão de quaisquer errors de duplicate-key ou key-not-found que o server encontre na session atual ao processar updates. Esta opção pode ser útil sempre que for desejável ou necessário replicar um ou mais binary logs para um MySQL Server que pode não conter todos os dados aos quais os logs se referem.

  O escopo de efeito para esta opção inclui apenas o client **mysqlbinlog** e a session atual.

* `--include-gtids=gtid_set`

  <table frame="box" rules="all" summary="Propriedades para base64-output"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--base64-output=value</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Default</th> <td><code>AUTO</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>AUTO</code></p><p><code>NEVER</code></p><p><code>DECODE-ROWS</code></p></td> </tr></tbody></table>

  Exibe apenas os grupos listados no *`gtid_set`*.

* `--local-load=dir_name`, `-l dir_name`

  <table frame="box" rules="all" summary="Propriedades para base64-output"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--base64-output=value</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Default</th> <td><code>AUTO</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>AUTO</code></p><p><code>NEVER</code></p><p><code>DECODE-ROWS</code></p></td> </tr></tbody></table>

  Para operações de data loading correspondentes a statements `LOAD DATA`, o **mysqlbinlog** extrai os arquivos dos binary log events, escreve-os como temporary files no file system local e escreve statements `LOAD DATA LOCAL` para que os arquivos sejam carregados. Por default, o **mysqlbinlog** escreve esses temporary files em um diretório específico do sistema operacional. A opção `--local-load` pode ser usada para especificar explicitamente o diretório onde o **mysqlbinlog** deve preparar temporary files locais.

  Importante

  Estes temporary files não são removidos automaticamente pelo **mysqlbinlog** ou por qualquer outro programa MySQL.

* `--login-path=name`

  <table frame="box" rules="all" summary="Propriedades para base64-output"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--base64-output=value</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Default</th> <td><code>AUTO</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>AUTO</code></p><p><code>NEVER</code></p><p><code>DECODE-ROWS</code></p></td> </tr></tbody></table>

  Lê opções do login path nomeado no arquivo login path `.mylogin.cnf`. Um “login path” é um grupo de opções contendo opções que especificam a qual MySQL server conectar e com qual conta autenticar. Para criar ou modificar um arquivo login path, use o utilitário **mysql_config_editor**. Consulte a Seção 4.6.6, “mysql_config_editor — MySQL Configuration Utility”.

  Para informações adicionais sobre esta e outras opções de option file, consulte a Seção 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--no-defaults`

  <table frame="box" rules="all" summary="Propriedades para base64-output"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--base64-output=value</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Default</th> <td><code>AUTO</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>AUTO</code></p><p><code>NEVER</code></p><p><code>DECODE-ROWS</code></p></td> </tr></tbody></table>

  Não lê nenhum option file. Se a inicialização do programa falhar devido à leitura de opções desconhecidas de um option file, `--no-defaults` pode ser usado para evitar que sejam lidas.

  A exceção é que o arquivo `.mylogin.cnf` é lido em todos os casos, se existir. Isso permite que as senhas sejam especificadas de uma forma mais segura do que na linha de comando, mesmo quando `--no-defaults` é usado. Para criar `.mylogin.cnf`, use o utilitário **mysql_config_editor**. Consulte a Seção 4.6.6, “mysql_config_editor — MySQL Configuration Utility”.

  Para informações adicionais sobre esta e outras opções de option file, consulte a Seção 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--offset=N`, `-o N`

  <table frame="box" rules="all" summary="Propriedades para base64-output"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--base64-output=value</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Default</th> <td><code>AUTO</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>AUTO</code></p><p><code>NEVER</code></p><p><code>DECODE-ROWS</code></p></td> </tr></tbody></table>

  Pula as primeiras *`N`* entradas no log.

* `--open-files-limit=N`

  <table frame="box" rules="all" summary="Propriedades para base64-output"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--base64-output=value</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Default</th> <td><code>AUTO</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>AUTO</code></p><p><code>NEVER</code></p><p><code>DECODE-ROWS</code></p></td> </tr></tbody></table>

  Especifica o número de file descriptors abertos a serem reservados.

* `--password[=password]`, `-p[password]`

  <table frame="box" rules="all" summary="Propriedades para base64-output"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--base64-output=value</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Default</th> <td><code>AUTO</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>AUTO</code></p><p><code>NEVER</code></p><p><code>DECODE-ROWS</code></p></td> </tr></tbody></table>

  A senha da conta MySQL usada para conectar-se ao server. O valor da senha é opcional. Se não for fornecido, o **mysqlbinlog** solicitará uma. Se fornecido, *não deve haver espaço* entre `--password=` ou `-p` e a senha que o segue. Se nenhuma opção de password for especificada, o default é não enviar nenhuma senha.

  Especificar uma senha na linha de comando deve ser considerado inseguro. Para evitar fornecer a senha na linha de comando, use um option file. Consulte a Seção 6.1.2.1, “End-User Guidelines for Password Security”.

  Para especificar explicitamente que não há senha e que o **mysqlbinlog** não deve solicitá-la, use a opção `--skip-password`.

* `--plugin-dir=dir_name`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  O diretório onde procurar por plugins. Especifique esta opção se a opção `--default-auth` for usada para especificar um plugin de Authentication, mas o **mysqlbinlog** não o encontrar. Consulte a Seção 6.2.13, “Pluggable Authentication”.

* `--port=port_num`, `-P port_num`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  O número da porta TCP/IP a ser usada para conectar-se a um server remoto.

* `--print-defaults`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  Imprime o nome do programa e todas as opções que ele obtém dos option files.

  Para informações adicionais sobre esta e outras opções de option file, consulte a Seção 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  O protocolo de transporte a ser usado para conectar-se ao server. É útil quando os outros connection parameters normalmente resultam no uso de um protocolo diferente daquele que você deseja. Para detalhes sobre os valores permitidos, consulte a Seção 4.2.5, “Connection Transport Protocols”.

* `--raw`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  Por default, o **mysqlbinlog** lê binary log files e escreve events em formato de texto. A opção `--raw` instrui o **mysqlbinlog** a escrevê-los em seu formato binário original. Seu uso requer que `--read-from-remote-server` também seja usado, pois os arquivos são solicitados de um server. O **mysqlbinlog** escreve um output file para cada arquivo lido do server. A opção `--raw` pode ser usada para fazer um backup do binary log de um server. Com a opção `--stop-never`, o backup é “live” (em tempo real), pois o **mysqlbinlog** permanece conectado ao server. Por default, os output files são gravados no diretório atual com os mesmos nomes dos log files originais. Os nomes dos output files podem ser modificados usando a opção `--result-file`. Para mais informações, consulte a Seção 4.6.7.3, “Using mysqlbinlog to Back Up Binary Log Files”.

* `--read-from-remote-master=type`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  Lê binary logs de um MySQL server com os comandos `COM_BINLOG_DUMP` ou `COM_BINLOG_DUMP_GTID`, definindo o valor da opção para `BINLOG-DUMP-NON-GTIDS` ou `BINLOG-DUMP-GTIDS`, respectivamente. Se `--read-from-remote-master=BINLOG-DUMP-GTIDS` for combinado com `--exclude-gtids`, as transactions podem ser filtradas na origem, evitando tráfego de rede desnecessário.

  As opções de connection parameter são usadas com esta opção ou com a opção `--read-from-remote-server`. Estas opções são `--host`, `--password`, `--port`, `--protocol`, `--socket` e `--user`. Se nenhuma das opções remotas for especificada, as opções de connection parameter são ignoradas.

  O privilégio `REPLICATION SLAVE` é necessário para usar esta opção.

* `--read-from-remote-server=file_name`, `-R`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  Lê o binary log de um MySQL server em vez de ler um log file local. Esta opção requer que o server remoto esteja em execução. Funciona apenas para binary log files no server remoto, não para relay log files, e aceita apenas o nome do binary log file (incluindo o sufixo numérico) como seu argumento, ignorando qualquer path.

  As opções de connection parameter são usadas com esta opção ou com a opção `--read-from-remote-master`. Estas opções são `--host`, `--password`, `--port`, `--protocol`, `--socket` e `--user`. Se nenhuma das opções remotas for especificada, as opções de connection parameter são ignoradas.

  O privilégio `REPLICATION SLAVE` é necessário para usar esta opção.

  Esta opção é semelhante a `--read-from-remote-master=BINLOG-DUMP-NON-GTIDS`.

* `--result-file=name`, `-r name`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  Sem a opção `--raw`, esta opção indica o arquivo para o qual o **mysqlbinlog** escreve a saída de texto. Com `--raw`, o **mysqlbinlog** escreve um output file binário para cada log file transferido do server, gravando-os por default no diretório atual usando os mesmos nomes do log file original. Neste caso, o valor da opção `--result-file` é tratado como um prefixo que modifica os nomes dos output files.

* `--rewrite-db='from_name->to_name'`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  Ao ler de um log row-based ou statement-based, reescreve todas as ocorrências de *`from_name`* para *`to_name`*. A reescrita é feita nas rows, para logs row-based, bem como nas cláusulas `USE`, para logs statement-based. Em versões do MySQL anteriores a 5.7.8, esta opção era apenas para uso ao restaurar tables logadas usando o formato row-based.

  Aviso

  Statements em que os nomes das tables são qualificados com nomes de Databases não são reescritos para usar o novo nome ao usar esta opção.

  A regra de rewrite empregada como valor para esta opção é uma string com o formato `'from_name->to_name'`, conforme mostrado anteriormente, e por esta razão deve ser incluída entre aspas.

  Para empregar múltiplas regras de rewrite, especifique a opção múltiplas vezes, conforme mostrado aqui:

  ```sql
  mysqlbinlog --rewrite-db='dbcurrent->dbold' --rewrite-db='dbtest->dbcurrent' \
      binlog.00001 > /tmp/statements.sql
  ```

  Quando usado em conjunto com a opção `--database`, a opção `--rewrite-db` é aplicada primeiro; então a opção `--database` é aplicada, usando o nome do Database reescrito. A ordem em que as opções são fornecidas não faz diferença a este respeito.

  Isso significa que, por exemplo, se o **mysqlbinlog** for iniciado com `--rewrite-db='mydb->yourdb' --database=yourdb`, todos os updates para quaisquer tables nos Databases `mydb` e `yourdb` serão incluídos na saída. Por outro lado, se for iniciado com `--rewrite-db='mydb->yourdb' --database=mydb`, o **mysqlbinlog** não gera statements: como todos os updates para `mydb` são primeiro reescritos como updates para `yourdb` antes de aplicar a opção `--database`, não resta nenhum update que corresponda a `--database=mydb`.

* `--secure-auth`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  Não envia senhas ao server em formato antigo (pré-4.1). Isso impede conexões, exceto para servers que usam o formato de senha mais recente.

  A partir do MySQL 5.7.5, esta opção está obsoleta (deprecated); espere que seja removida em uma futura release do MySQL. Está sempre habilitada e tentar desabilitá-la (`--skip-secure-auth`, `--secure-auth=0`) produz um error. Antes do MySQL 5.7.5, esta opção é habilitada por default, mas pode ser desabilitada.

  Nota

  Senhas que usam o método de hashing pré-4.1 são menos seguras do que senhas que usam o método de password hashing nativo e devem ser evitadas. Senhas pré-4.1 estão obsoletas e o suporte a elas foi removido no MySQL 5.7.5. Para instruções de upgrade de contas, consulte a Seção 6.4.1.3, “Migrating Away from Pre-4.1 Password Hashing and the mysql_old_password Plugin”.

* `--server-id=id`

  <table frame="box" rules="all" summary="Propriedades para binlog-row-event-max-size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--binlog-row-event-max-size=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor Default</th> <td><code>4294967040</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>256</code></td> </tr><tr><th>Valor Máximo</th> <td><code>18446744073709547520</code></td> </tr></tbody></table>

  Exibe apenas os events criados pelo server que possui o Server ID fornecido.

* `--server-id-bits=N`

  <table frame="box" rules="all" summary="Propriedades para binlog-row-event-max-size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--binlog-row-event-max-size=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor Default</th> <td><code>4294967040</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>256</code></td> </tr><tr><th>Valor Máximo</th> <td><code>18446744073709547520</code></td> </tr></tbody></table>

  Usa apenas os primeiros *`N`* bits do `server_id` para identificar o server. Se o binary log foi escrito por um **mysqld** com `server-id-bits` definido para menos de 32 e dados de user armazenados no bit mais significativo, executar **mysqlbinlog** com `--server-id-bits` definido para 32 permite que esses dados sejam vistos.

  Esta opção é suportada apenas pela versão do **mysqlbinlog** fornecida com a distribuição NDB Cluster, ou compilada com suporte NDB Cluster.

* `--server-public-key-path=file_name`

  <table frame="box" rules="all" summary="Propriedades para binlog-row-event-max-size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--binlog-row-event-max-size=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor Default</th> <td><code>4294967040</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>256</code></td> </tr><tr><th>Valor Máximo</th> <td><code>18446744073709547520</code></td> </tr></tbody></table>

  O path name para um arquivo em formato PEM contendo uma cópia do lado do client da chave pública exigida pelo server para o password exchange baseado em RSA key pair. Esta opção se aplica a clients que autenticam com o plugin de Authentication `sha256_password` ou `caching_sha2_password`. Esta opção é ignorada para contas que não autenticam com um desses plugins. Também é ignorada se o password exchange baseado em RSA não for usado, como é o caso quando o client se conecta ao server usando uma conexão segura.

  Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele terá precedência sobre `--get-server-public-key`.

  Para `sha256_password`, esta opção se aplica apenas se o MySQL foi compilado usando OpenSSL.

  Para obter informações sobre os plugins `sha256_password` e `caching_sha2_password`, consulte a Seção 6.4.1.5, “SHA-256 Pluggable Authentication”, e a Seção 6.4.1.4, “Caching SHA-2 Pluggable Authentication”.

  A opção `--server-public-key-path` foi adicionada no MySQL 5.7.23.

* `--set-charset=charset_name`

  <table frame="box" rules="all" summary="Propriedades para binlog-row-event-max-size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--binlog-row-event-max-size=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor Default</th> <td><code>4294967040</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>256</code></td> </tr><tr><th>Valor Máximo</th> <td><code>18446744073709547520</code></td> </tr></tbody></table>

  Adiciona um statement `SET NAMES charset_name` à saída para especificar o character set a ser usado no processamento de log files.

* `--shared-memory-base-name=name`

  <table frame="box" rules="all" summary="Propriedades para binlog-row-event-max-size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--binlog-row-event-max-size=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor Default</th> <td><code>4294967040</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>256</code></td> </tr><tr><th>Valor Máximo</th> <td><code>18446744073709547520</code></td> </tr></tbody></table>

  No Windows, o nome da shared-memory a ser usado para conexões feitas usando shared memory a um server local. O valor default é `MYSQL`. O nome da shared-memory diferencia maiúsculas de minúsculas (case-sensitive).

  Esta opção se aplica apenas se o server foi iniciado com a system variable `shared_memory` habilitada para suportar conexões de shared-memory.

* `--short-form`, `-s`

  <table frame="box" rules="all" summary="Propriedades para binlog-row-event-max-size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--binlog-row-event-max-size=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor Default</th> <td><code>4294967040</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>256</code></td> </tr><tr><th>Valor Máximo</th> <td><code>18446744073709547520</code></td> </tr></tbody></table>

  Exibe apenas os statements contidos no log, sem qualquer informação extra ou row-based events. Isso é apenas para teste e não deve ser usado em sistemas de produção.

* `--skip-gtids[=(true|false)]`

  <table frame="box" rules="all" summary="Propriedades para binlog-row-event-max-size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--binlog-row-event-max-size=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor Default</th> <td><code>4294967040</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>256</code></td> </tr><tr><th>Valor Máximo</th> <td><code>18446744073709547520</code></td> </tr></tbody></table>

  Não inclui os GTIDs dos binary log files no arquivo de dump de saída. Por exemplo:

  ```sql
  mysqlbinlog --skip-gtids binlog.000001 >  /tmp/dump.sql
  mysql -u root -p -e "source /tmp/dump.sql"
  ```

  Você não deve normalmente usar esta opção em produção ou em recovery, exceto nos cenários específicos e raros onde os GTIDs são ativamente indesejados. Por exemplo, um administrador pode querer duplicar transactions selecionadas (como definições de table) de um deployment para outro deployment não relacionado que não fará Replication de ou para o original. Nesse cenário, `--skip-gtids` pode ser usado para permitir que o administrador aplique as transactions como se fossem novas e garantir que os deployments permaneçam não relacionados. No entanto, você só deve usar esta opção se a inclusão dos GTIDs causar um problema conhecido para o seu caso de uso.

* `--socket=path`, `-S path`

  <table frame="box" rules="all" summary="Propriedades para binlog-row-event-max-size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--binlog-row-event-max-size=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor Default</th> <td><code>4294967040</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>256</code></td> </tr><tr><th>Valor Máximo</th> <td><code>18446744073709547520</code></td> </tr></tbody></table>

  Para conexões a `localhost`, o arquivo de Unix socket a ser usado ou, no Windows, o nome do named pipe a ser usado.

  No Windows, esta opção se aplica apenas se o server foi iniciado com a system variable `named_pipe` habilitada para suportar conexões named-pipe. Além disso, o user que faz a conexão deve ser membro do grupo do Windows especificado pela system variable `named_pipe_full_access_group`.

* `--ssl*`

  Opções que começam com `--ssl` especificam se deve conectar ao server usando encryption e indicam onde encontrar chaves e certificados SSL. Consulte Opções de Comando para Conexões Criptografadas.

* `--start-datetime=datetime`

  <table frame="box" rules="all" summary="Propriedades para binlog-row-event-max-size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--binlog-row-event-max-size=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor Default</th> <td><code>4294967040</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>256</code></td> </tr><tr><th>Valor Máximo</th> <td><code>18446744073709547520</code></td> </tr></tbody></table>

  Começa a ler o binary log no primeiro event que tiver um timestamp igual ou posterior ao argumento *`datetime`*. O valor *`datetime`* é relativo ao fuso horário local na máquina onde você executa o **mysqlbinlog**. O valor deve estar em um formato aceito para os data types `DATETIME` ou `TIMESTAMP`. Por exemplo:

  ```sql
  mysqlbinlog --start-datetime="2005-12-25 11:25:56" binlog.000003
  ```

  Esta opção é útil para point-in-time recovery. Consulte a Seção 7.5, “Point-in-Time (Incremental) Recovery”.

* `--start-position=N`, `-j N`

  <table frame="box" rules="all" summary="Propriedades para binlog-row-event-max-size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--binlog-row-event-max-size=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor Default</th> <td><code>4294967040</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>256</code></td> </tr><tr><th>Valor Máximo</th> <td><code>18446744073709547520</code></td> </tr></tbody></table>

  Começa a ler o binary log no primeiro event que tiver uma position igual ou superior a *`N`*. Esta opção se aplica ao primeiro log file nomeado na linha de comando.

  Esta opção é útil para point-in-time recovery. Consulte a Seção 7.5, “Point-in-Time (Incremental) Recovery”.

* `--stop-datetime=datetime`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do Diretório</td> </tr></tbody></table>

  Para de ler o binary log no primeiro event que tiver um timestamp igual ou posterior ao argumento *`datetime`*. Consulte a descrição da opção `--start-datetime` para obter informações sobre o valor *`datetime`*.

  Esta opção é útil para point-in-time recovery. Consulte a Seção 7.5, “Point-in-Time (Incremental) Recovery”.

* `--stop-never`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do Diretório</td> </tr></tbody></table>

  Esta opção é usada com `--read-from-remote-server`. Ela informa ao **mysqlbinlog** para permanecer conectado ao server. Caso contrário, o **mysqlbinlog** sai quando o último log file tiver sido transferido do server. `--stop-never` implica `--to-last-log`, portanto, apenas o primeiro log file a ser transferido precisa ser nomeado na linha de comando.

  `--stop-never` é comumente usado com `--raw` para fazer um binary log backup live, mas também pode ser usado sem `--raw` para manter uma exibição de texto contínua dos log events conforme o server os gera.

* `--stop-never-slave-server-id=id`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do Diretório</td> </tr></tbody></table>

  Com `--stop-never`, o **mysqlbinlog** relata um Server ID de 65535 ao se conectar ao server. `--stop-never-slave-server-id` especifica explicitamente o Server ID a ser relatado. Pode ser usado para evitar um conflito com o ID de um replica server ou outro processo **mysqlbinlog**. Consulte a Seção 4.6.7.4, “Specifying the mysqlbinlog Server ID”.

* `--stop-position=N`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do Diretório</td> </tr></tbody></table>

  Para de ler o binary log no primeiro event que tiver uma position igual ou superior a *`N`*. Esta opção se aplica ao último log file nomeado na linha de comando.

  Esta opção é útil para point-in-time recovery. Consulte a Seção 7.5, “Point-in-Time (Incremental) Recovery”.

* `--tls-version=protocol_list`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do Diretório</td> </tr></tbody></table>

  Os protocolos TLS permitidos para conexões criptografadas. O valor é uma lista de um ou mais nomes de protocolo separados por vírgulas. Os protocolos que podem ser nomeados para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para detalhes, consulte a Seção 6.3.2, “Encrypted Connection TLS Protocols and Ciphers”.

  Esta opção foi adicionada no MySQL 5.7.10.

* `--to-last-log`, `-t`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do Diretório</td> </tr></tbody></table>

  Não para no final do binary log solicitado de um MySQL server, mas continua imprimindo até o final do último binary log. Se você enviar a saída para o mesmo MySQL server, isso pode levar a um loop infinito. Esta opção requer `--read-from-remote-server`.

* `--user=user_name`, `-u user_name`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do Diretório</td> </tr></tbody></table>

  O nome de user MySQL a ser usado ao conectar-se a um server remoto.

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do Diretório</td> </tr></tbody></table>

  Reconstrói row events e os exibe como SQL statements comentados. Se esta opção for fornecida duas vezes (passando "-vv" ou "--verbose --verbose"), a saída inclui comentários para indicar os data types das colunas e alguns metadados, e row query log events, se assim configurado.

  Para exemplos que mostram o efeito de `--base64-output` e `--verbose` na saída de row event, consulte a Seção 4.6.7.2, “mysqlbinlog Row Event Display”.

* `--verify-binlog-checksum`, `-c`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do Diretório</td> </tr></tbody></table>

  Verifica checksums em binary log files.

* `--version`, `-V`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do Diretório</td> </tr></tbody></table>

  Exibe informações da versão e sai.

  No MySQL 5.7, o número da versão mostrado pelo **mysqlbinlog** ao usar esta opção é 3.4.

Você pode canalizar (pipe) a saída do **mysqlbinlog** para o client **mysql** para executar os events contidos no binary log. Esta técnica é usada para recuperar-se de uma saída inesperada quando você tem um backup antigo (consulte a Seção 7.5, “Point-in-Time (Incremental) Recovery”). Por exemplo:

```sql
mysqlbinlog binlog.000001 | mysql -u root -p
```

Ou:

```sql
mysqlbinlog binlog.[0-9]* | mysql -u root -p
```

Se os statements produzidos pelo **mysqlbinlog** puderem conter valores `BLOB`, isso pode causar problemas quando o **mysql** os processar. Neste caso, invoque o **mysql** com a opção `--binary-mode`.

Você também pode redirecionar a saída do **mysqlbinlog** para um text file, se precisar modificar o statement log primeiro (por exemplo, para remover statements que você não deseja executar por algum motivo). Após editar o arquivo, execute os statements que ele contém usando-o como input para o programa **mysql**:

```sql
mysqlbinlog binlog.000001 > tmpfile
... edit tmpfile ...
mysql -u root -p < tmpfile
```

Quando o **mysqlbinlog** é invocado com a opção `--start-position`, ele exibe apenas os events com um offset no binary log maior ou igual a uma determinada position (a position fornecida deve corresponder ao início de um event). Ele também tem opções para parar e começar quando vê um event com uma determinada data e hora. Isso permite que você execute point-in-time recovery usando a opção `--stop-datetime` (para poder dizer, por exemplo, “roll forward meus Databases para como eles estavam hoje às 10:30 da manhã”).

**Processando múltiplos arquivos.** Se você tiver mais de um binary log para executar no MySQL server, o método seguro é processar todos eles usando uma única conexão ao server. Aqui está um exemplo que demonstra o que pode ser *inseguro*:

```sql
mysqlbinlog binlog.000001 | mysql -u root -p # DANGER!!
mysqlbinlog binlog.000002 | mysql -u root -p # DANGER!!
```

Processar binary logs dessa forma usando múltiplas conexões ao server causa problemas se o primeiro log file contiver um statement `CREATE TEMPORARY TABLE` e o segundo log contiver um statement que use a temporary table. Quando o primeiro processo **mysql** termina, o server descarta a temporary table. Quando o segundo processo **mysql** tenta usar a table, o server relata “unknown table.” (tabela desconhecida).

Para evitar problemas como este, use um *único* processo **mysql** para executar o conteúdo de todos os binary logs que você deseja processar. Aqui está uma maneira de fazer isso:

```sql
mysqlbinlog binlog.000001 binlog.000002 | mysql -u root -p
```

Outra abordagem é escrever todos os logs em um único arquivo e depois processar o arquivo:

```sql
mysqlbinlog binlog.000001 >  /tmp/statements.sql
mysqlbinlog binlog.000002 >> /tmp/statements.sql
mysql -u root -p -e "source /tmp/statements.sql"
```

O **mysqlbinlog** pode produzir uma saída que reproduz uma operação `LOAD DATA` sem o arquivo de dados original. O **mysqlbinlog** copia os dados para um temporary file e escreve um statement `LOAD DATA LOCAL` que se refere ao arquivo. O local default do diretório onde esses arquivos são escritos é específico do sistema. Para especificar um diretório explicitamente, use a opção `--local-load`.

Como o **mysqlbinlog** converte statements `LOAD DATA` em statements `LOAD DATA LOCAL` (ou seja, ele adiciona `LOCAL`), tanto o client quanto o server que você usa para processar os statements devem ser configurados com o capability `LOCAL` habilitado. Consulte a Seção 6.1.6, “Security Considerations for LOAD DATA LOCAL”.

Aviso

Os temporary files criados para statements `LOAD DATA LOCAL` *não* são excluídos automaticamente porque são necessários até que você execute esses statements. Você deve excluir os temporary files por conta própria depois que não precisar mais do statement log. Os arquivos podem ser encontrados no diretório de arquivos temporários e têm nomes como *`original_file_name-#-#`*.