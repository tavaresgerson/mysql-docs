### 4.5.6 mysqlpump — Um Programa de Backup de Database

* Sintaxe de Invocação do mysqlpump
* Sumário das Opções do mysqlpump
* Descrições das Opções do mysqlpump
* Seleção de Objetos do mysqlpump
* Processamento Paralelo do mysqlpump
* Restrições do mysqlpump

O utilitário cliente **mysqlpump** realiza backups lógicos, produzindo um conjunto de instruções SQL que podem ser executadas para reproduzir as definições originais dos objects do Database e os dados da table. Ele faz o dump de um ou mais databases MySQL para backup ou transferência para outro SQL server.

As funcionalidades do **mysqlpump** incluem:

*   Processamento paralelo de databases, e de objects dentro dos databases, para acelerar o processo de dump.

*   Melhor controle sobre quais databases e objects de database (tables, stored programs, user accounts) incluir no dump.

*   Dump de user accounts como instruções de gerenciamento de contas (`CREATE USER`, `GRANT`), em vez de como inserts no system database `mysql`.

*   Capacidade de criar output comprimido.
*   Indicador de progresso (os valores são estimativas).
*   Para recarregar o arquivo de dump, criação mais rápida de secondary Index para tables `InnoDB` adicionando os Index após a inserção das rows.

O **mysqlpump** requer pelo menos o privilégio `SELECT` para as tables incluídas no dump, `SHOW VIEW` para as views incluídas no dump, `TRIGGER` para os triggers incluídos no dump e `LOCK TABLES` se a opção `--single-transaction` não for usada. O privilégio `SELECT` no system database `mysql` é necessário para fazer o dump das definições de usuário. Certas opções podem exigir outros privilégios, conforme observado nas descrições das opções.

Para recarregar um arquivo de dump, você deve ter os privilégios necessários para executar as instruções que ele contém, como os privilégios `CREATE` apropriados para os objects criados por essas instruções.

Nota

Um dump feito usando PowerShell no Windows com redirecionamento de output cria um arquivo com codificação UTF-16:

```sql
mysqlpump [options] > dump.sql
```

No entanto, UTF-16 não é permitido como um conjunto de caracteres de conexão (veja Seção 10.4, “Connection Character Sets and Collations”), então o arquivo de dump não carrega corretamente. Para contornar esse problema, use a opção `--result-file`, que cria o output no formato ASCII:

```sql
mysqlpump [options] --result-file=dump.sql
```

#### Sintaxe de Invocação do mysqlpump

Por padrão, o **mysqlpump** faz o dump de todos os databases (com certas exceções notadas em Restrições do mysqlpump). Para especificar explicitamente este comportamento, use a opção `--all-databases`:

```sql
mysqlpump --all-databases
```

Para fazer o dump de um único Database, ou de certas tables dentro desse Database, nomeie o Database na linha de comando, opcionalmente seguido pelos nomes das table:

```sql
mysqlpump db_name
mysqlpump db_name tbl_name1 tbl_name2 ...
```

Para tratar todos os argumentos de nome como nomes de Database, use a opção `--databases`:

```sql
mysqlpump --databases db_name1 db_name2 ...
```

Por padrão, o **mysqlpump** não faz o dump de definições de user account, mesmo que você faça o dump do system database `mysql` que contém as grant tables. Para fazer o dump do conteúdo das grant tables como definições lógicas na forma de instruções `CREATE USER` e `GRANT`, use a opção `--users` e suprima todo o dump de Database:

```sql
mysqlpump --exclude-databases=% --users
```

No comando anterior, `%` é um wildcard que corresponde a todos os nomes de Database para a opção `--exclude-databases`.

O **mysqlpump** suporta várias opções para incluir ou excluir databases, tables, stored programs e definições de usuário. Veja Seleção de Objetos do mysqlpump.

Para recarregar um arquivo de dump, execute as instruções que ele contém. Por exemplo, use o cliente **mysql**:

```sql
mysqlpump [options] > dump.sql
mysql < dump.sql
```

A discussão a seguir fornece exemplos adicionais de uso do **mysqlpump**.

Para ver uma lista das opções suportadas pelo **mysqlpump**, execute o comando **mysqlpump --help**.

#### Sumário das Opções do mysqlpump

O **mysqlpump** suporta as seguintes opções, que podem ser especificadas na linha de comando ou nos grupos `[mysqlpump]` e `[client]` de um arquivo de opção. (Antes do MySQL 5.7.30, o **mysqlpump** lia o grupo `[mysql_dump]` em vez de `[mysqlpump]`. A partir do 5.7.30, `[mysql_dump]` ainda é aceito, mas está obsoleto.) Para obter informações sobre os arquivos de opção usados pelos programas MySQL, consulte Seção 4.2.2.2, “Using Option Files”.

**Tabela 4.18 Opções do mysqlpump**

<table frame="box" rules="all" summary="Opções de linha de comando disponíveis para mysqlpump."><col style="width: 31%"/><col style="width: 56%"/><col style="width: 12%"/><thead><tr><th>Option Name</th> <th>Descrição</th> <th>Introduzido</th> </tr></thead><tbody><tr><th>--add-drop-database</th> <td>Adiciona a instrução DROP DATABASE antes de cada instrução CREATE DATABASE</td> <td></td> </tr><tr><th>--add-drop-table</th> <td>Adiciona a instrução DROP TABLE antes de cada instrução CREATE TABLE</td> <td></td> </tr><tr><th>--add-drop-user</th> <td>Adiciona a instrução DROP USER antes de cada instrução CREATE USER</td> <td></td> </tr><tr><th>--add-locks</th> <td>Envolve cada dump de table com as instruções LOCK TABLES e UNLOCK TABLES</td> <td></td> </tr><tr><th>--all-databases</th> <td>Faz o dump de todos os databases</td> <td></td> </tr><tr><th>--bind-address</th> <td>Usa a interface de rede especificada para se conectar ao MySQL Server</td> <td></td> </tr><tr><th>--character-sets-dir</th> <td>Diretório onde os character sets estão instalados</td> <td></td> </tr><tr><th>--complete-insert</th> <td>Usa instruções INSERT completas que incluem nomes de column</td> <td></td> </tr><tr><th>--compress</th> <td>Comprime todas as informações enviadas entre o client e o server</td> <td></td> </tr><tr><th>--compress-output</th> <td>Algoritmo de compressão de Output</td> <td></td> </tr><tr><th>--databases</th> <td>Interpreta todos os argumentos de nome como nomes de Database</td> <td></td> </tr><tr><th>--debug</th> <td>Escreve o log de debugging</td> <td></td> </tr><tr><th>--debug-check</th> <td>Imprime informações de debugging quando o programa é encerrado</td> <td></td> </tr><tr><th>--debug-info</th> <td>Imprime informações de debugging, memória e estatísticas de CPU quando o programa é encerrado</td> <td></td> </tr><tr><th>--default-auth</th> <td>Plugin de autenticação a ser usado</td> <td></td> </tr><tr><th>--default-character-set</th> <td>Especifica o character set padrão</td> <td></td> </tr><tr><th>--default-parallelism</th> <td>Número padrão de Threads para processamento paralelo</td> <td></td> </tr><tr><th>--defaults-extra-file</th> <td>Lê o arquivo de opção nomeado além dos arquivos de opção usuais</td> <td></td> </tr><tr><th>--defaults-file</th> <td>Lê apenas o arquivo de opção nomeado</td> <td></td> </tr><tr><th>--defaults-group-suffix</th> <td>Valor do sufixo do grupo de opções</td> <td></td> </tr><tr><th>--defer-table-indexes</th> <td>Para recarga, adia a criação de Index até depois de carregar as rows da table</td> <td></td> </tr><tr><th>--events</th> <td>Faz o dump de Events dos databases incluídos no dump</td> <td></td> </tr><tr><th>--exclude-databases</th> <td>Databases a excluir do dump</td> <td></td> </tr><tr><th>--exclude-events</th> <td>Events a excluir do dump</td> <td></td> </tr><tr><th>--exclude-routines</th> <td>Routines a excluir do dump</td> <td></td> </tr><tr><th>--exclude-tables</th> <td>Tables a excluir do dump</td> <td></td> </tr><tr><th>--exclude-triggers</th> <td>Triggers a excluir do dump</td> <td></td> </tr><tr><th>--exclude-users</th> <td>Usuários a excluir do dump</td> <td></td> </tr><tr><th>--extended-insert</th> <td>Usa sintaxe INSERT de múltiplas rows</td> <td></td> </tr><tr><th>--get-server-public-key</th> <td>Solicita a public key RSA do server</td> <td>5.7.23</td> </tr><tr><th>--help</th> <td>Exibe a mensagem de ajuda e sai</td> <td></td> </tr><tr><th>--hex-blob</th> <td>Faz o dump de colunas binárias usando notação hexadecimal</td> <td></td> </tr><tr><th>--host</th> <td>Host onde o MySQL server está localizado</td> <td></td> </tr><tr><th>--include-databases</th> <td>Databases a incluir no dump</td> <td></td> </tr><tr><th>--include-events</th> <td>Events a incluir no dump</td> <td></td> </tr><tr><th>--include-routines</th> <td>Routines a incluir no dump</td> <td></td> </tr><tr><th>--include-tables</th> <td>Tables a incluir no dump</td> <td></td> </tr><tr><th>--include-triggers</th> <td>Triggers a incluir no dump</td> <td></td> </tr><tr><th>--include-users</th> <td>Usuários a incluir no dump</td> <td></td> </tr><tr><th>--insert-ignore</th> <td>Escreve instruções INSERT IGNORE em vez de instruções INSERT</td> <td></td> </tr><tr><th>--log-error-file</th> <td>Adiciona warnings e errors ao arquivo nomeado</td> <td></td> </tr><tr><th>--login-path</th> <td>Lê opções de login path de .mylogin.cnf</td> <td></td> </tr><tr><th>--max-allowed-packet</th> <td>Comprimento máximo do packet para enviar ou receber do server</td> <td></td> </tr><tr><th>--net-buffer-length</th> <td>Tamanho do Buffer para comunicação TCP/IP e socket</td> <td></td> </tr><tr><th>--no-create-db</th> <td>Não escreve instruções CREATE DATABASE</td> <td></td> </tr><tr><th>--no-create-info</th> <td>Não escreve instruções CREATE TABLE que recriam cada table incluída no dump</td> <td></td> </tr><tr><th>--no-defaults</th> <td>Não lê arquivos de opção</td> <td></td> </tr><tr><th>--parallel-schemas</th> <td>Especifica o paralelismo de processamento de schema</td> <td></td> </tr><tr><th>--password</th> <td>Senha a ser usada ao conectar-se ao server</td> <td></td> </tr><tr><th>--plugin-dir</th> <td>Diretório onde os plugins estão instalados</td> <td></td> </tr><tr><th>--port</th> <td>Número da porta TCP/IP para conexão</td> <td></td> </tr><tr><th>--print-defaults</th> <td>Imprime opções padrão</td> <td></td> </tr><tr><th>--protocol</th> <td>Protocolo de transporte a ser usado</td> <td></td> </tr><tr><th>--replace</th> <td>Escreve instruções REPLACE em vez de instruções INSERT</td> <td></td> </tr><tr><th>--result-file</th> <td>Direciona o output para um determinado arquivo</td> <td></td> </tr><tr><th>--routines</th> <td>Faz o dump de stored routines (procedures e functions) dos databases incluídos no dump</td> <td></td> </tr><tr><th>--secure-auth</th> <td>Não envia senhas para o server em formato antigo (pré-4.1)</td> <td></td> </tr><tr><th>--server-public-key-path</th> <td>Path name para o arquivo que contém a public key RSA</td> <td>5.7.23</td> </tr><tr><th>--set-charset</th> <td>Adiciona SET NAMES default_character_set ao output</td> <td></td> </tr><tr><th>--set-gtid-purged</th> <td>Se deve adicionar SET @@GLOBAL.GTID_PURGED ao output</td> <td>5.7.18</td> </tr><tr><th>--single-transaction</th> <td>Faz o dump de tables dentro de um único transaction</td> <td></td> </tr><tr><th>--skip-definer</th> <td>Omite as cláusulas DEFINER e SQL SECURITY das instruções CREATE de view e stored program</td> <td></td> </tr><tr><th>--skip-dump-rows</th> <td>Não faz o dump das rows da table</td> <td></td> </tr><tr><th>--socket</th> <td>Arquivo Unix socket ou Windows named pipe a ser usado</td> <td></td> </tr><tr><th>--ssl</th> <td>Habilita a criptografia da conexão</td> <td></td> </tr><tr><th>--ssl-ca</th> <td>Arquivo que contém a lista de Certificate Authorities SSL confiáveis</td> <td></td> </tr><tr><th>--ssl-capath</th> <td>Diretório que contém arquivos de certificado de Certificate Authority SSL confiáveis</td> <td></td> </tr><tr><th>--ssl-cert</th> <td>Arquivo que contém o certificado X.509</td> <td></td> </tr><tr><th>--ssl-cipher</th> <td>Cifras permitidas para a criptografia da conexão</td> <td></td> </tr><tr><th>--ssl-crl</th> <td>Arquivo que contém listas de revogação de certificado</td> <td></td> </tr><tr><th>--ssl-crlpath</th> <td>Diretório que contém arquivos de lista de revogação de certificado</td> <td></td> </tr><tr><th>--ssl-key</th> <td>Arquivo que contém a chave X.509</td> <td></td> </tr><tr><th>--ssl-mode</th> <td>Estado de segurança desejado da conexão com o server</td> <td>5.7.11</td> </tr><tr><th>--ssl-verify-server-cert</th> <td>Verifica o host name em relação à identidade Common Name do certificado do server</td> <td></td> </tr><tr><th>--tls-version</th> <td>Protocolos TLS permitidos para conexões criptografadas</td> <td>5.7.10</td> </tr><tr><th>--triggers</th> <td>Faz o dump de Triggers para cada table incluída no dump</td> <td></td> </tr><tr><th>--tz-utc</th> <td>Adiciona SET TIME_ZONE='+00:00' ao arquivo de dump</td> <td></td> </tr><tr><th>--user</th> <td>Nome de usuário MySQL a ser usado ao conectar-se ao server</td> <td></td> </tr><tr><th>--users</th> <td>Faz o dump de user accounts</td> <td></td> </tr><tr><th>--version</th> <td>Exibe as informações de versão e sai</td> <td></td> </tr><tr><th>--watch-progress</th> <td>Exibe o indicador de progresso</td> <td></td> </tr></tbody></table>

#### Descrições das Opções do mysqlpump

* `--help`, `-?`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Exibe uma mensagem de ajuda e sai.

* `--add-drop-database`

  <table frame="box" rules="all" summary="Propriedades para add-drop-database"><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-database</code></td> </tr></tbody></table>

  Escreve uma instrução `DROP DATABASE` antes de cada instrução `CREATE DATABASE`.

* `--add-drop-table`

  <table frame="box" rules="all" summary="Propriedades para add-drop-table"><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-table</code></td> </tr></tbody></table>

  Escreve uma instrução `DROP TABLE` antes de cada instrução `CREATE TABLE`.

* `--add-drop-user`

  <table frame="box" rules="all" summary="Propriedades para add-drop-user"><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-user</code></td> </tr></tbody></table>

  Escreve uma instrução `DROP USER` antes de cada instrução `CREATE USER`.

* `--add-locks`

  <table frame="box" rules="all" summary="Propriedades para add-locks"><tbody><tr><th>Command-Line Format</th> <td><code>--add-locks</code></td> </tr></tbody></table>

  Envolve cada dump de table com as instruções `LOCK TABLES` e `UNLOCK TABLES`. Isso resulta em Inserts mais rápidos quando o arquivo de dump é recarregado. Veja Seção 8.2.4.1, “Optimizing INSERT Statements”.

  Esta opção não funciona com paralelismo porque as instruções `INSERT` de diferentes tables podem ser intercaladas e `UNLOCK TABLES` após o final dos Inserts para uma table pode liberar Locks em tables para as quais ainda restam Inserts.

  `--add-locks` e `--single-transaction` são mutuamente exclusivos.

* `--all-databases`, `-A`

  <table frame="box" rules="all" summary="Propriedades para all-databases"><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>

  Faz o dump de todos os databases (com certas exceções notadas em Restrições do mysqlpump). Este é o comportamento padrão se nenhum outro for especificado explicitamente.

  `--all-databases` e `--databases` são mutuamente exclusivos.

* `--bind-address=ip_address`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  Em um computador com múltiplas interfaces de rede, use esta opção para selecionar qual interface usar para se conectar ao MySQL server.

* `--character-sets-dir=path`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Type</th> <td>Nome do Diretório</td> </tr></tbody></table>

  O diretório onde os character sets estão instalados. Veja Seção 10.15, “Character Set Configuration”.

* `--complete-insert`

  <table frame="box" rules="all" summary="Propriedades para complete-insert"><tbody><tr><th>Command-Line Format</th> <td><code>--complete-insert</code></td> </tr></tbody></table>

  Escreve instruções `INSERT` completas que incluem nomes de column.

* `--compress`, `-C`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Comprime todas as informações enviadas entre o client e o server, se possível. Veja Seção 4.2.6, “Connection Compression Control”.

* `--compress-output=algorithm`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Por padrão, o **mysqlpump** não comprime o output. Esta opção especifica a compressão do output usando o algoritmo especificado. Os algoritmos permitidos são `LZ4` e `ZLIB`.

  Para descomprimir o output comprimido, você deve ter um utilitário apropriado. Se os comandos do sistema **lz4** e **openssl zlib** não estiverem disponíveis, a partir do MySQL 5.7.10, as distribuições MySQL incluem os utilitários **lz4_decompress** e **zlib_decompress** que podem ser usados para descomprimir o output do **mysqlpump** que foi comprimido usando as opções `--compress-output=LZ4` e `--compress-output=ZLIB`. Para mais informações, veja Seção 4.8.1, “lz4_decompress — Decompress mysqlpump LZ4-Compressed Output”, e Seção 4.8.5, “zlib_decompress — Decompress mysqlpump ZLIB-Compressed Output”.

  Alternativas incluem os comandos **lz4** e `openssl`, se estiverem instalados no seu sistema. Por exemplo, **lz4** pode descomprimir o output `LZ4`:

  ```sql
  lz4 -d input_file output_file
  ```

  O output `ZLIB` pode ser descomprimido desta forma:

  ```sql
  openssl zlib -d < input_file > output_file
  ```

* `--databases`, `-B`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Normalmente, o **mysqlpump** trata o primeiro argumento de nome na linha de comando como um nome de Database e quaisquer nomes seguintes como nomes de table. Com esta opção, ele trata todos os argumentos de nome como nomes de Database. As instruções `CREATE DATABASE` são incluídas no output antes de cada novo Database.

  `--all-databases` e `--databases` são mutuamente exclusivos.

* `--debug[=debug_options]`, `-# [debug_options]`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Escreve um log de debugging. Uma típica string *`debug_options`* é `d:t:o,file_name`. O padrão é `d:t:O,/tmp/mysqlpump.trace`.

  Esta opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são construídos usando esta opção.

* `--debug-check`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Imprime algumas informações de debugging quando o programa é encerrado.

  Esta opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são construídos usando esta opção.

* `--debug-info`, `-T`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Imprime informações de debugging e estatísticas de uso de memória e CPU quando o programa é encerrado.

  Esta opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são construídos usando esta opção.

* `--default-auth=plugin`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Uma dica sobre qual plugin de autenticação do lado do client usar. Veja Seção 6.2.13, “Pluggable Authentication”.

* `--default-character-set=charset_name`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Usa *`charset_name`* como o default character set. Veja Seção 10.15, “Character Set Configuration”. Se nenhum character set for especificado, o **mysqlpump** usa `utf8`.

* `--default-parallelism=N`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  O número padrão de Threads para cada fila de processamento paralelo. O padrão é 2.

  A opção `--parallel-schemas` também afeta o paralelismo e pode ser usada para sobrescrever o número padrão de Threads. Para mais informações, veja Processamento Paralelo do mysqlpump.

  Com `--default-parallelism=0` e sem opções `--parallel-schemas`, o **mysqlpump** é executado como um processo de Thread única e não cria filas.

  Com o paralelismo habilitado, é possível que o output de diferentes databases seja intercalado.

  Nota

  Antes do MySQL 5.7.11, o uso da opção `--single-transaction` é mutuamente exclusivo com o paralelismo. Para usar `--single-transaction`, desabilite o paralelismo definindo `--default-parallelism` como 0 e não usando nenhuma instância de `--parallel-schemas`:

  ```sql
  mysqlpump --single-transaction --default-parallelism=0
  ```

* `--defaults-extra-file=file_name`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Lê este arquivo de opção após o arquivo de opção global, mas (no Unix) antes do arquivo de opção do usuário. Se o arquivo não existir ou estiver inacessível, ocorre um error. Se *`file_name`* não for um path name absoluto, ele será interpretado em relação ao diretório atual.

  Para informações adicionais sobre esta e outras opções de arquivo de opção, veja Seção 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--defaults-file=file_name`

  <table frame="box" rules="all" summary="Propriedades para add-drop-database"><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-database</code></td> </tr></tbody></table>

  Usa apenas o arquivo de opção fornecido. Se o arquivo não existir ou estiver inacessível, ocorre um error. Se *`file_name`* não for um path name absoluto, ele será interpretado em relação ao diretório atual.

  Exceção: Mesmo com `--defaults-file`, os client programs leem `.mylogin.cnf`.

  Para informações adicionais sobre esta e outras opções de arquivo de opção, veja Seção 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--defaults-group-suffix=str`

  <table frame="box" rules="all" summary="Propriedades para add-drop-database"><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-database</code></td> </tr></tbody></table>

  Lê não apenas os grupos de opção usuais, mas também grupos com os nomes usuais e um sufixo de *`str`*. Por exemplo, o **mysqlpump** normalmente lê os grupos `[client]` e `[mysqlpump]`. Se esta opção for fornecida como `--defaults-group-suffix=_other`, o **mysqlpump** também lê os grupos `[client_other]` e `[mysqlpump_other]`.

  Para informações adicionais sobre esta e outras opções de arquivo de opção, veja Seção 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--defer-table-indexes`

  <table frame="box" rules="all" summary="Propriedades para add-drop-database"><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-database</code></td> </tr></tbody></table>

  No output do dump, adia a criação de Index para cada table até que suas rows tenham sido carregadas. Isso funciona para todos os storage engines, mas para `InnoDB` se aplica apenas a secondary Index.

  Esta opção é habilitada por padrão; use `--skip-defer-table-indexes` para desabilitá-la.

* `--events`

  <table frame="box" rules="all" summary="Propriedades para add-drop-database"><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-database</code></td> </tr></tbody></table>

  Inclui Event Scheduler events para os databases incluídos no dump no output. O dump de Event requer os privilégios `EVENT` para esses databases.

  O output gerado usando `--events` contém instruções `CREATE EVENT` para criar os Events. No entanto, essas instruções não incluem atributos como os timestamps de criação e modificação do Event, portanto, quando os Events são recarregados, eles são criados com timestamps iguais ao tempo de recarga.

  Se você precisar que os Events sejam criados com seus atributos de timestamp originais, não use `--events`. Em vez disso, faça o dump e recarregue o conteúdo da table `mysql.event` diretamente, usando uma conta MySQL que tenha privilégios apropriados para o Database `mysql`.

  Esta opção é habilitada por padrão; use `--skip-events` para desabilitá-la.

* `--exclude-databases=db_list`

  <table frame="box" rules="all" summary="Propriedades para add-drop-database"><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-database</code></td> </tr></tbody></table>

  Não faz o dump dos databases em *`db_list`*, que é uma lista de um ou mais nomes de Database separados por vírgula. Múltiplas instâncias desta opção são aditivas. Para mais informações, veja Seleção de Objetos do mysqlpump.

* `--exclude-events=event_list`

  <table frame="box" rules="all" summary="Propriedades para add-drop-database"><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-database</code></td> </tr></tbody></table>

  Não faz o dump dos events em *`event_list`*, que é uma lista de um ou mais nomes de event separados por vírgula. Múltiplas instâncias desta opção são aditivas. Para mais informações, veja Seleção de Objetos do mysqlpump.

* `--exclude-routines=routine_list`

  <table frame="box" rules="all" summary="Propriedades para add-drop-database"><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-database</code></td> </tr></tbody></table>

  Não faz o dump dos routines em *`routine_list`*, que é uma lista de um ou mais nomes de routine (stored procedure ou function) separados por vírgula. Múltiplas instâncias desta opção são aditivas. Para mais informações, veja Seleção de Objetos do mysqlpump.

* `--exclude-tables=table_list`

  <table frame="box" rules="all" summary="Propriedades para add-drop-database"><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-database</code></td> </tr></tbody></table>

  Não faz o dump das tables em *`table_list`*, que é uma lista de um ou mais nomes de table separados por vírgula. Múltiplas instâncias desta opção são aditivas. Para mais informações, veja Seleção de Objetos do mysqlpump.

* `--exclude-triggers=trigger_list`

  <table frame="box" rules="all" summary="Propriedades para add-drop-database"><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-database</code></td> </tr></tbody></table>

  Não faz o dump dos triggers em *`trigger_list`*, que é uma lista de um ou mais nomes de trigger separados por vírgula. Múltiplas instâncias desta opção são aditivas. Para mais informações, veja Seleção de Objetos do mysqlpump.

* `--exclude-users=user_list`

  <table frame="box" rules="all" summary="Propriedades para add-drop-database"><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-database</code></td> </tr></tbody></table>

  Não faz o dump dos user accounts em *`user_list`*, que é uma lista de um ou mais nomes de account separados por vírgula. Múltiplas instâncias desta opção são aditivas. Para mais informações, veja Seleção de Objetos do mysqlpump.

* `--extended-insert=N`

  <table frame="box" rules="all" summary="Propriedades para add-drop-table"><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-table</code></td> </tr></tbody></table>

  Escreve instruções `INSERT` usando sintaxe de múltiplas rows que inclui várias listas de `VALUES`. Isso resulta em um arquivo de dump menor e acelera os Inserts quando o arquivo é recarregado.

  O valor da opção indica o número de rows a incluir em cada instrução `INSERT`. O padrão é 250. Um valor de 1 produz uma instrução `INSERT` por row da table.

* `--get-server-public-key`

  <table frame="box" rules="all" summary="Propriedades para add-drop-table"><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-table</code></td> </tr></tbody></table>

  Solicita do server a public key necessária para a troca de senha baseada em RSA key pair. Esta opção se aplica a clients que autenticam com o plugin de autenticação `caching_sha2_password`. Para esse plugin, o server não envia a public key, a menos que seja solicitada. Esta opção é ignorada para accounts que não autenticam com esse plugin. Também é ignorada se a troca de senha baseada em RSA não for usada, como é o caso quando o client se conecta ao server usando uma conexão segura.

  Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de public key válido, ele terá precedência sobre `--get-server-public-key`.

  Para informações sobre o plugin `caching_sha2_password`, veja Seção 6.4.1.4, “Caching SHA-2 Pluggable Authentication”.

  A opção `--get-server-public-key` foi adicionada no MySQL 5.7.23.

* `--hex-blob`

  <table frame="box" rules="all" summary="Propriedades para add-drop-table"><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-table</code></td> </tr></tbody></table>

  Faz o dump de colunas binárias usando notação hexadecimal (por exemplo, `'abc'` se torna `0x616263`). Os data types afetados são `BINARY`, `VARBINARY`, tipos `BLOB`, `BIT`, todos os data types espaciais e outros data types não binários quando usados com o character set `binary`.

* `--host=host_name`, `-h host_name`

  <table frame="box" rules="all" summary="Propriedades para add-drop-table"><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-table</code></td> </tr></tbody></table>

  Faz o dump de dados do MySQL server no host fornecido.

* `--include-databases=db_list`

  <table frame="box" rules="all" summary="Propriedades para add-drop-table"><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-table</code></td> </tr></tbody></table>

  Faz o dump dos databases em *`db_list`*, que é uma lista de um ou mais nomes de Database separados por vírgula. O dump inclui todos os objects nos databases nomeados. Múltiplas instâncias desta opção são aditivas. Para mais informações, veja Seleção de Objetos do mysqlpump.

* `--include-events=event_list`

  <table frame="box" rules="all" summary="Propriedades para add-drop-table"><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-table</code></td> </tr></tbody></table>

  Faz o dump dos events em *`event_list`*, que é uma lista de um ou mais nomes de event separados por vírgula. Múltiplas instâncias desta opção são aditivas. Para mais informações, veja Seleção de Objetos do mysqlpump.

* `--include-routines=routine_list`

  <table frame="box" rules="all" summary="Propriedades para add-drop-table"><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-table</code></td> </tr></tbody></table>

  Faz o dump dos routines em *`routine_list`*, que é uma lista de um ou mais nomes de routine (stored procedure ou function) separados por vírgula. Múltiplas instâncias desta opção são aditivas. Para mais informações, veja Seleção de Objetos do mysqlpump.

* `--include-tables=table_list`

  <table frame="box" rules="all" summary="Propriedades para add-drop-table"><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-table</code></td> </tr></tbody></table>

  Faz o dump das tables em *`table_list`*, que é uma lista de um ou mais nomes de table separados por vírgula. Múltiplas instâncias desta opção são aditivas. Para mais informações, veja Seleção de Objetos do mysqlpump.

* `--include-triggers=trigger_list`

  <table frame="box" rules="all" summary="Propriedades para add-drop-table"><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-table</code></td> </tr></tbody></table>

  Faz o dump dos triggers em *`trigger_list`*, que é uma lista de um ou mais nomes de trigger separados por vírgula. Múltiplas instâncias desta opção são aditivas. Para mais informações, veja Seleção de Objetos do mysqlpump.

* `--include-users=user_list`

  <table frame="box" rules="all" summary="Propriedades para add-drop-table"><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-table</code></td> </tr></tbody></table>

  Faz o dump dos user accounts em *`user_list`*, que é uma lista de um ou mais nomes de usuário separados por vírgula. Múltiplas instâncias desta opção são aditivas. Para mais informações, veja Seleção de Objetos do mysqlpump.

* `--insert-ignore`

  <table frame="box" rules="all" summary="Propriedades para add-drop-user"><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-user</code></td> </tr></tbody></table>

  Escreve instruções `INSERT IGNORE` em vez de instruções `INSERT`.

* `--log-error-file=file_name`

  <table frame="box" rules="all" summary="Propriedades para add-drop-user"><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-user</code></td> </tr></tbody></table>

  Registra warnings e errors, adicionando-os ao arquivo nomeado. Se esta opção não for fornecida, o **mysqlpump** escreve warnings e errors para o standard error output.

* `--login-path=name`

  <table frame="box" rules="all" summary="Propriedades para add-drop-user"><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-user</code></td> </tr></tbody></table>

  Lê opções do login path nomeado no arquivo de login path `.mylogin.cnf`. Um “login path” é um grupo de opções que especificam a qual MySQL server se conectar e sob qual account autenticar. Para criar ou modificar um arquivo de login path, use o utilitário **mysql_config_editor**. Veja Seção 4.6.6, “mysql_config_editor — MySQL Configuration Utility”.

  Para informações adicionais sobre esta e outras opções de arquivo de opção, veja Seção 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--max-allowed-packet=N`

  <table frame="box" rules="all" summary="Propriedades para add-drop-user"><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-user</code></td> </tr></tbody></table>

  O tamanho máximo do Buffer para comunicação client/server. O padrão é 24MB, o máximo é 1GB.

* `--net-buffer-length=N`

  <table frame="box" rules="all" summary="Propriedades para add-drop-user"><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-user</code></td> </tr></tbody></table>

  O tamanho inicial do Buffer para comunicação client/server. Ao criar instruções `INSERT` de múltiplas rows (como com a opção `--extended-insert`), o **mysqlpump** cria rows de até *`N`* bytes de comprimento. Se você usar esta opção para aumentar o valor, certifique-se de que a system variable `net_buffer_length` do MySQL server tenha um valor pelo menos tão grande.

* `--no-create-db`

  <table frame="box" rules="all" summary="Propriedades para add-drop-user"><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-user</code></td> </tr></tbody></table>

  Suprime quaisquer instruções `CREATE DATABASE` que poderiam ser incluídas no output.

* `--no-create-info`, `-t`

  <table frame="box" rules="all" summary="Propriedades para add-drop-user"><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-user</code></td> </tr></tbody></table>

  Não escreve instruções `CREATE TABLE` que criam cada table incluída no dump.

* `--no-defaults`

  <table frame="box" rules="all" summary="Propriedades para add-drop-user"><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-user</code></td> </tr></tbody></table>

  Não lê nenhum arquivo de opção. Se a inicialização do programa falhar devido à leitura de opções desconhecidas de um arquivo de opção, `--no-defaults` pode ser usado para evitar que sejam lidas.

  A exceção é que o arquivo `.mylogin.cnf` é lido em todos os casos, se existir. Isso permite que as senhas sejam especificadas de maneira mais segura do que na linha de comando, mesmo quando `--no-defaults` é usado. Para criar `.mylogin.cnf`, use o utilitário **mysql_config_editor**. Veja Seção 4.6.6, “mysql_config_editor — MySQL Configuration Utility”.

  Para informações adicionais sobre esta e outras opções de arquivo de opção, veja Seção 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--parallel-schemas=[N:]db_list`

  <table frame="box" rules="all" summary="Propriedades para add-drop-user"><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-user</code></td> </tr></tbody></table>

  Cria uma fila para processar os databases em *`db_list`*, que é uma lista de um ou mais nomes de Database separados por vírgula. Se *`N`* for fornecido, a fila usa *`N`* Threads. Se *`N`* não for fornecido, a opção `--default-parallelism` determina o número de Threads da fila.

  Múltiplas instâncias desta opção criam múltiplas filas. O **mysqlpump** também cria uma fila padrão para usar para databases não nomeados em nenhuma opção `--parallel-schemas`, e para fazer o dump de definições de usuário se as opções de comando as selecionarem. Para mais informações, veja Processamento Paralelo do mysqlpump.

* `--password[=password]`, `-p[password]`

  <table frame="box" rules="all" summary="Propriedades para add-drop-user"><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-user</code></td> </tr></tbody></table>

  A senha da conta MySQL usada para se conectar ao server. O valor da senha é opcional. Se não for fornecido, o **mysqlpump** solicitará um. Se fornecido, não deve haver *espaço* entre `--password=` ou `-p` e a senha que o segue. Se nenhuma opção de senha for especificada, o padrão é não enviar nenhuma senha.

  Especificar uma senha na linha de comando deve ser considerado inseguro. Para evitar fornecer a senha na linha de comando, use um arquivo de opção. Veja Seção 6.1.2.1, “End-User Guidelines for Password Security”.

  Para especificar explicitamente que não há senha e que o **mysqlpump** não deve solicitar uma, use a opção `--skip-password`.

* `--plugin-dir=dir_name`

  <table frame="box" rules="all" summary="Propriedades para add-locks"><tbody><tr><th>Command-Line Format</th> <td><code>--add-locks</code></td> </tr></tbody></table>

  O diretório onde procurar plugins. Especifique esta opção se a opção `--default-auth` for usada para especificar um plugin de autenticação, mas o **mysqlpump** não o encontrar. Veja Seção 6.2.13, “Pluggable Authentication”.

* `--port=port_num`, `-P port_num`

  <table frame="box" rules="all" summary="Propriedades para add-locks"><tbody><tr><th>Command-Line Format</th> <td><code>--add-locks</code></td> </tr></tbody></table>

  Para conexões TCP/IP, o número da porta a ser usado.

* `--print-defaults`

  <table frame="box" rules="all" summary="Propriedades para add-locks"><tbody><tr><th>Command-Line Format</th> <td><code>--add-locks</code></td> </tr></tbody></table>

  Imprime o nome do programa e todas as opções que ele obtém dos arquivos de opção.

  Para informações adicionais sobre esta e outras opções de arquivo de opção, veja Seção 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table frame="box" rules="all" summary="Propriedades para add-locks"><tbody><tr><th>Command-Line Format</th> <td><code>--add-locks</code></td> </tr></tbody></table>

  O protocolo de transporte a ser usado para se conectar ao server. É útil quando os outros parâmetros de conexão normalmente resultam no uso de um protocolo diferente do que você deseja. Para detalhes sobre os valores permitidos, veja Seção 4.2.5, “Connection Transport Protocols”.

* `--replace`

  <table frame="box" rules="all" summary="Propriedades para add-locks"><tbody><tr><th>Command-Line Format</th> <td><code>--add-locks</code></td> </tr></tbody></table>

  Escreve instruções `REPLACE` em vez de instruções `INSERT`.

* `--result-file=file_name`

  <table frame="box" rules="all" summary="Propriedades para add-locks"><tbody><tr><th>Command-Line Format</th> <td><code>--add-locks</code></td> </tr></tbody></table>

  Direciona o output para o arquivo nomeado. O arquivo de resultado é criado e seu conteúdo anterior é sobrescrito, mesmo que ocorra um error ao gerar o dump.

  Esta opção deve ser usada no Windows para evitar que os caracteres de newline `\n` sejam convertidos em sequências de carriage return/newline `\r\n`.

* `--routines`

  <table frame="box" rules="all" summary="Propriedades para add-locks"><tbody><tr><th>Command-Line Format</th> <td><code>--add-locks</code></td> </tr></tbody></table>

  Inclui stored routines (procedures e functions) para os databases incluídos no dump no output. Esta opção requer o privilégio `SELECT` para a table `mysql.proc`.

  O output gerado usando `--routines` contém instruções `CREATE PROCEDURE` e `CREATE FUNCTION` para criar os routines. No entanto, essas instruções não incluem atributos como os timestamps de criação e modificação do routine, portanto, quando os routines são recarregados, eles são criados com timestamps iguais ao tempo de recarga.

  Se você precisar que os routines sejam criados com seus atributos de timestamp originais, não use `--routines`. Em vez disso, faça o dump e recarregue o conteúdo da table `mysql.proc` diretamente, usando uma conta MySQL que tenha privilégios apropriados para o Database `mysql`.

  Esta opção é habilitada por padrão; use `--skip-routines` para desabilitá-la.

* `--secure-auth`

  <table frame="box" rules="all" summary="Propriedades para add-locks"><tbody><tr><th>Command-Line Format</th> <td><code>--add-locks</code></td> </tr></tbody></table>

  Não envia senhas para o server em formato antigo (pré-4.1). Isso impede conexões, exceto para servers que usam o formato de senha mais recente.

  Esta opção está obsoleta; espere que seja removida em um futuro release do MySQL. Ela está sempre habilitada e tentar desabilitá-la (`--skip-secure-auth`, `--secure-auth=0`) produz um error.

* `--server-public-key-path=file_name`

  <table frame="box" rules="all" summary="Propriedades para add-locks"><tbody><tr><th>Command-Line Format</th> <td><code>--add-locks</code></td> </tr></tbody></table>

  O path name para um arquivo no formato PEM contendo uma cópia do lado do client da public key exigida pelo server para a troca de senha baseada em RSA key pair. Esta opção se aplica a clients que autenticam com o plugin de autenticação `sha256_password` ou `caching_sha2_password`. Esta opção é ignorada para accounts que não autenticam com um desses plugins. Também é ignorada se a troca de senha baseada em RSA não for usada, como é o caso quando o client se conecta ao server usando uma conexão segura.

  Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de public key válido, ele terá precedência sobre `--get-server-public-key`.

  Para `sha256_password`, esta opção se aplica apenas se o MySQL foi construído usando OpenSSL.

  Para informações sobre os plugins `sha256_password` e `caching_sha2_password`, veja Seção 6.4.1.5, “SHA-256 Pluggable Authentication”, e Seção 6.4.1.4, “Caching SHA-2 Pluggable Authentication”.

  A opção `--server-public-key-path` foi adicionada no MySQL 5.7.23.

* `--set-charset`

  <table frame="box" rules="all" summary="Propriedades para add-locks"><tbody><tr><th>Command-Line Format</th> <td><code>--add-locks</code></td> </tr></tbody></table>

  Escreve `SET NAMES default_character_set` no output.

  Esta opção é habilitada por padrão. Para desabilitá-la e suprimir a instrução `SET NAMES`, use `--skip-set-charset`.

* `--set-gtid-purged=value`

  <table frame="box" rules="all" summary="Propriedades para all-databases"><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>

  Esta opção permite o controle sobre as informações de global transaction ID (GTID) escritas no arquivo de dump, indicando se deve adicionar uma instrução `SET @@GLOBAL.gtid_purged` ao output. Esta opção também pode fazer com que uma instrução seja escrita no output que desabilita o binary logging enquanto o arquivo de dump está sendo recarregado.

  A tabela a seguir mostra os valores de opção permitidos. O valor padrão é `AUTO`.

  <table frame="box" rules="all" summary="Propriedades para all-databases"><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>

  A opção `--set-gtid-purged` tem o seguinte efeito no binary logging quando o arquivo de dump é recarregado:

  + `--set-gtid-purged=OFF`: `SET @@SESSION.SQL_LOG_BIN=0;` não é adicionado ao output.

  + `--set-gtid-purged=ON`: `SET @@SESSION.SQL_LOG_BIN=0;` é adicionado ao output.

  + `--set-gtid-purged=AUTO`: `SET @@SESSION.SQL_LOG_BIN=0;` é adicionado ao output se GTIDs estiverem habilitados no server do qual você está fazendo backup (ou seja, se `AUTO` for avaliado como `ON`).

  Esta opção foi adicionada no MySQL 5.7.18.

* `--single-transaction`

  <table frame="box" rules="all" summary="Propriedades para all-databases"><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>

  Esta opção define o modo de transaction isolation para `REPEATABLE READ` e envia uma instrução SQL `START TRANSACTION` para o server antes de fazer o dump dos dados. É útil apenas com tables transacionais como `InnoDB`, porque assim ele faz o dump do estado consistente do Database no momento em que o `START TRANSACTION` foi emitido, sem bloquear nenhuma aplicação.

  Ao usar esta opção, você deve ter em mente que apenas tables `InnoDB` são incluídas no dump em um estado consistente. Por exemplo, quaisquer tables `MyISAM` ou `MEMORY` incluídas no dump enquanto esta opção estiver sendo usada ainda podem ter seu estado alterado.

  Enquanto um dump `--single-transaction` estiver em andamento, para garantir um arquivo de dump válido (conteúdo correto da table e coordenadas de binary log), nenhuma outra conexão deve usar as seguintes instruções: `ALTER TABLE`, `CREATE TABLE`, `DROP TABLE`, `RENAME TABLE`, `TRUNCATE TABLE`. Uma consistent read não é isolada dessas instruções, portanto, o uso delas em uma table a ser incluída no dump pode fazer com que o `SELECT` executado pelo **mysqlpump** para recuperar o conteúdo da table obtenha conteúdo incorreto ou falhe.

  `--add-locks` e `--single-transaction` são mutuamente exclusivos.

  Nota

  Antes do MySQL 5.7.11, o uso da opção `--single-transaction` é mutuamente exclusivo com o paralelismo. Para usar `--single-transaction`, desabilite o paralelismo definindo `--default-parallelism` como 0 e não usando nenhuma instância de `--parallel-schemas`:

  ```sql
  mysqlpump --single-transaction --default-parallelism=0
  ```

* `--skip-definer`

  <table frame="box" rules="all" summary="Propriedades para all-databases"><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>

  Omite as cláusulas `DEFINER` e `SQL SECURITY` das instruções `CREATE` para views e stored programs. O arquivo de dump, quando recarregado, cria objects que usam os valores padrão de `DEFINER` e `SQL SECURITY`. Veja Seção 23.6, “Stored Object Access Control”.

* `--skip-dump-rows`, `-d`

  <table frame="box" rules="all" summary="Propriedades para all-databases"><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>

  Não faz o dump das rows da table.

* `--socket=path`, `-S path`

  <table frame="box" rules="all" summary="Propriedades para all-databases"><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>

  Para conexões a `localhost`, o Unix socket file a ser usado, ou, no Windows, o nome do named pipe a ser usado.

  No Windows, esta opção se aplica apenas se o server foi iniciado com a system variable `named_pipe` habilitada para suportar named-pipe connections. Além disso, o usuário que faz a conexão deve ser membro do grupo Windows especificado pela system variable `named_pipe_full_access_group`.

* `--ssl*`

  As opções que começam com `--ssl` especificam se deve conectar-se ao server usando criptografia e indicam onde encontrar chaves e certificados SSL. Veja Command Options for Encrypted Connections.

* `--tls-version=protocol_list`

  <table frame="box" rules="all" summary="Propriedades para all-databases"><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>

  Os protocolos TLS permitidos para conexões criptografadas. O valor é uma lista de um ou mais nomes de protocolo separados por vírgula. Os protocolos que podem ser nomeados para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para detalhes, veja Seção 6.3.2, “Encrypted Connection TLS Protocols and Ciphers”.

  Esta opção foi adicionada no MySQL 5.7.10.

* `--triggers`

  <table frame="box" rules="all" summary="Propriedades para all-databases"><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>

  Inclui triggers para cada table incluída no dump no output.

  Esta opção é habilitada por padrão; use `--skip-triggers` para desabilitá-la.

* `--tz-utc`

  <table frame="box" rules="all" summary="Propriedades para all-databases"><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>

  Esta opção permite que colunas `TIMESTAMP` sejam incluídas no dump e recarregadas entre servers em diferentes time zones. O **mysqlpump** define seu time zone de conexão para UTC e adiciona `SET TIME_ZONE='+00:00'` ao arquivo de dump. Sem esta opção, as colunas `TIMESTAMP` são incluídas no dump e recarregadas nos time zones locais dos servers de origem e destino, o que pode fazer com que os valores mudem se os servers estiverem em diferentes time zones. `--tz-utc` também protege contra mudanças devido ao horário de verão.

  Esta opção é habilitada por padrão; use `--skip-tz-utc` para desabilitá-la.

* `--user=user_name`, `-u user_name`

  <table frame="box" rules="all" summary="Propriedades para all-databases"><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>

  O nome de usuário da conta MySQL a ser usado para se conectar ao server.

* `--users`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  Faz o dump de user accounts como definições lógicas na forma de instruções `CREATE USER` e `GRANT`.

  As definições de usuário são armazenadas nas grant tables no system database `mysql`. Por padrão, o **mysqlpump** não inclui as grant tables em dumps do Database `mysql`. Para fazer o dump do conteúdo das grant tables como definições lógicas, use a opção `--users` e suprima todo o dump de Database:

  ```sql
  mysqlpump --exclude-databases=% --users
  ```

* `--version`, `-V`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  Exibe as informações de versão e sai.

* `--watch-progress`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  Exibe periodicamente um indicador de progresso que fornece informações sobre o número concluído e total de tables, rows e outros objects.

  Esta opção é habilitada por padrão; use `--skip-watch-progress` para desabilitá-la.

#### Seleção de Objetos do mysqlpump

O **mysqlpump** possui um conjunto de opções de inclusão e exclusão que permitem a filtragem de vários tipos de objects e fornecem controle flexível sobre quais objects incluir no dump:

*   `--include-databases` e `--exclude-databases` se aplicam a databases e todos os objects dentro deles.

*   `--include-tables` e `--exclude-tables` se aplicam a tables. Essas opções também afetam os triggers associados a tables, a menos que as opções específicas de trigger sejam fornecidas.

*   `--include-triggers` e `--exclude-triggers` se aplicam a triggers.

*   `--include-routines` e `--exclude-routines` se aplicam a stored procedures e functions. Se uma opção de routine corresponder a um nome de stored procedure, ela também corresponderá a uma stored function com o mesmo nome.

*   `--include-events` e `--exclude-events` se aplicam a Event Scheduler events.

*   `--include-users` e `--exclude-users` se aplicam a user accounts.

Qualquer opção de inclusão ou exclusão pode ser fornecida múltiplas vezes. O efeito é aditivo. A ordem dessas opções não importa.

O valor de cada opção de inclusão e exclusão é uma lista de nomes do tipo de object apropriado, separados por vírgula. Por exemplo:

```sql
--exclude-databases=test,world
--include-tables=customer,invoice
```

Caracteres wildcard são permitidos nos nomes dos objects:

*   `%` corresponde a qualquer sequência de zero ou mais caracteres.

*   `_` corresponde a qualquer caractere único.

Por exemplo, `--include-tables=t%,__tmp` corresponde a todos os nomes de table que começam com `t` e todos os nomes de table de cinco caracteres que terminam com `tmp`.

Para usuários, um nome especificado sem uma parte do host é interpretado com um host implícito de `%`. Por exemplo, `u1` e `u1@%` são equivalentes. Esta é a mesma equivalência que se aplica ao MySQL em geral (veja Seção 6.2.4, “Specifying Account Names”).

As opções de inclusão e exclusão interagem da seguinte forma:

*   Por padrão, sem opções de inclusão ou exclusão, o **mysqlpump** faz o dump de todos os databases (com certas exceções notadas em Restrições do mysqlpump).

*   Se as opções de inclusão forem fornecidas na ausência de opções de exclusão, apenas os objects nomeados como incluídos são incluídos no dump.

*   Se as opções de exclusão forem fornecidas na ausência de opções de inclusão, todos os objects são incluídos no dump, exceto aqueles nomeados como excluídos.

*   Se as opções de inclusão e exclusão forem fornecidas, todos os objects nomeados como excluídos e não nomeados como incluídos não são incluídos no dump. Todos os outros objects são incluídos no dump.

Se múltiplos databases estiverem sendo incluídos no dump, é possível nomear tables, triggers e routines em um Database específico qualificando os nomes dos objects com o nome do Database. O comando a seguir faz o dump dos databases `db1` e `db2`, mas exclui as tables `db1.t1` e `db2.t2`:

```sql
mysqlpump --include-databases=db1,db2 --exclude-tables=db1.t1,db2.t2
```

As seguintes opções fornecem formas alternativas de especificar quais databases incluir no dump:

*   A opção `--all-databases` faz o dump de todos os databases (com certas exceções notadas em Restrições do mysqlpump). É equivalente a não especificar nenhuma opção de object (a ação padrão do **mysqlpump** é incluir tudo no dump).

    `--include-databases=%` é semelhante a `--all-databases`, mas seleciona todos os databases para dump, mesmo aqueles que são exceções para `--all-databases`.

*   A opção `--databases` faz com que o **mysqlpump** trate todos os argumentos de nome como nomes de databases a incluir no dump. É equivalente a uma opção `--include-databases` que nomeia os mesmos databases.

#### Processamento Paralelo do mysqlpump

O **mysqlpump** pode usar paralelismo para alcançar o processamento concorrente. Você pode selecionar a concorrência entre databases (para fazer o dump de múltiplos databases simultaneamente) e dentro de databases (para fazer o dump de múltiplos objects de um determinado Database simultaneamente).

Por padrão, o **mysqlpump** configura uma fila com dois Threads. Você pode criar filas adicionais e controlar o número de Threads atribuídos a cada uma, incluindo a fila padrão:

*   `--default-parallelism=N` especifica o número padrão de Threads usados para cada fila. Na ausência desta opção, *`N`* é 2.

    A fila padrão sempre usa o número padrão de Threads. As filas adicionais usam o número padrão de Threads, a menos que você especifique o contrário.

*   `--parallel-schemas=[N:]db_list` configura uma fila de processamento para fazer o dump dos databases nomeados em *`db_list`* e, opcionalmente, especifica quantos Threads a fila usa. *`db_list`* é uma lista de nomes de Database separados por vírgula. Se o argumento da opção começar com `N:`, a fila usa *`N`* Threads. Caso contrário, a opção `--default-parallelism` determina o número de Threads da fila.

    Múltiplas instâncias da opção `--parallel-schemas` criam múltiplas filas.

    Os nomes na lista de databases podem conter os mesmos caracteres wildcard `%` e `_` suportados para opções de filtragem (veja Seleção de Objetos do mysqlpump).

O **mysqlpump** usa a fila padrão para processar quaisquer databases não nomeados explicitamente com uma opção `--parallel-schemas`, e para fazer o dump de definições de usuário se as opções de comando as selecionarem.

Em geral, com múltiplas filas, o **mysqlpump** usa paralelismo entre os conjuntos de databases processados pelas filas, para fazer o dump de múltiplos databases simultaneamente. Para uma fila que usa múltiplos Threads, o **mysqlpump** usa paralelismo dentro dos databases, para fazer o dump de múltiplos objects de um determinado Database simultaneamente. Exceções podem ocorrer; por exemplo, o **mysqlpump** pode bloquear filas enquanto obtém do server listas de objects em databases.

Com o paralelismo habilitado, é possível que o output de diferentes databases seja intercalado. Por exemplo, instruções `INSERT` de múltiplas tables incluídas no dump em paralelo podem ser intercaladas; as instruções não são escritas em nenhuma ordem específica. Isso não afeta a recarga porque as instruções de output qualificam os nomes dos objects com nomes de Database ou são precedidas por instruções `USE`, conforme necessário.

A granularidade para o paralelismo é um único object de database. Por exemplo, uma única table não pode ser incluída no dump em paralelo usando múltiplos Threads.

Exemplos:

```sql
mysqlpump --parallel-schemas=db1,db2 --parallel-schemas=db3
```

O **mysqlpump** configura uma fila para processar `db1` e `db2`, outra fila para processar `db3`, e uma fila padrão para processar todos os outros databases. Todas as filas usam dois Threads.

```sql
mysqlpump --parallel-schemas=db1,db2 --parallel-schemas=db3
          --default-parallelism=4
```

Este é o mesmo exemplo anterior, exceto que todas as filas usam quatro Threads.

```sql
mysqlpump --parallel-schemas=5:db1,db2 --parallel-schemas=3:db3
```

A fila para `db1` e `db2` usa cinco Threads, a fila para `db3` usa três Threads, e a fila padrão usa o padrão de dois Threads.

Como um caso especial, com `--default-parallelism=0` e sem opções `--parallel-schemas`, o **mysqlpump** é executado como um processo de Thread única e não cria filas.

Nota

Antes do MySQL 5.7.11, o uso da opção `--single-transaction` é mutuamente exclusivo com o paralelismo. Para usar `--single-transaction`, desabilite o paralelismo definindo `--default-parallelism` como 0 e não usando nenhuma instância de `--parallel-schemas`:

```sql
mysqlpump --single-transaction --default-parallelism=0
```

#### Restrições do mysqlpump

O **mysqlpump** não faz o dump dos schemas `INFORMATION_SCHEMA`, `performance_schema`, `ndbinfo` ou `sys` por padrão. Para fazer o dump de qualquer um desses, nomeie-os explicitamente na linha de comando. Você também pode nomeá-los com a opção `--databases` ou `--include-databases`.

O **mysqlpump** não faz o dump de instruções `CREATE TABLESPACE` do `InnoDB`.

O **mysqlpump** faz o dump de user accounts em formato lógico usando instruções `CREATE USER` e `GRANT` (por exemplo, quando você usa a opção `--include-users` ou `--users`). Por este motivo, os dumps do system database `mysql` não incluem por padrão as grant tables que contêm definições de usuário: `user`, `db`, `tables_priv`, `columns_priv`, `procs_priv` ou `proxies_priv`. Para fazer o dump de qualquer uma das grant tables, nomeie o Database `mysql` seguido pelos nomes das tables:

```sql
mysqlpump mysql user db ...
```
