### 4.5.4 mysqldump — Um Programa de Backup de Database

O utilitário cliente **mysqldump** executa backups lógicos, produzindo um conjunto de instruções SQL que podem ser executadas para reproduzir as definições originais dos objetos de database e os dados das Table. Ele faz o dump de uma ou mais Databases MySQL para backup ou transferência para outro SQL server. O comando **mysqldump** também pode gerar saída nos formatos CSV, outros textos delimitados ou XML.

* Considerações sobre Performance e Escalabilidade
* Sintaxe de Invocação
* Sintaxe de Opções - Resumo Alfabético
* Opções de Conexão
* Opções de Arquivo de Opções
* Opções DDL
* Opções de Debug
* Opções de Ajuda
* Opções de Internacionalização
* Opções de Replicação
* Opções de Formato
* Opções de Filtragem
* Opções de Performance
* Opções Transacionais
* Grupos de Opções
* Exemplos
* Restrições

**mysqldump** requer pelo menos o privilégio `SELECT` para Table que estão sendo despejadas (dumped), `SHOW VIEW` para Views despejadas, `TRIGGER` para Triggers despejadas, `LOCK TABLES` se a opção `--single-transaction` não for usada, e (a partir do MySQL 5.7.31) `PROCESS` se a opção `--no-tablespaces` não for usada. Certas opções podem exigir outros privilégios, conforme observado nas descrições das opções.

Para recarregar um dump file, você deve ter os privilégios necessários para executar as instruções que ele contém, como os privilégios `CREATE` apropriados para objetos criados por essas instruções.

A saída do **mysqldump** pode incluir instruções `ALTER DATABASE` que alteram a collation do Database. Isso pode ser usado ao fazer o dump de stored programs para preservar suas character encodings. Para recarregar um dump file contendo tais instruções, o privilégio `ALTER` para a Database afetada é necessário.

Note

Um dump feito usando PowerShell no Windows com redirecionamento de saída cria um arquivo que tem codificação UTF-16:

```sql
mysqldump [options] > dump.sql
```

No entanto, UTF-16 não é permitido como um connection character set (veja Impermissible Client Character Sets), então o dump file não pode ser carregado corretamente. Para contornar esse problema, use a opção `--result-file`, que cria a saída no formato ASCII:

```sql
mysqldump [options] --result-file=dump.sql
```

Não é recomendado carregar um dump file quando GTIDs estão habilitados no server (`gtid_mode=ON`), se o seu dump file incluir system tables. **mysqldump** emite instruções DML para as system tables que usam o storage engine não-transacional MyISAM, e essa combinação não é permitida quando GTIDs estão habilitados.

#### Considerações sobre Performance e Escalabilidade

As vantagens do `mysqldump` incluem a conveniência e flexibilidade de visualizar ou até mesmo editar a saída antes de restaurar. Você pode clonar Databases para desenvolvimento e trabalho de DBA, ou produzir pequenas variações de um Database existente para testes. Não se destina a ser uma solução rápida ou escalável para fazer backup de quantidades substanciais de dados. Com grandes volumes de dados, mesmo que a etapa de backup demore um tempo razoável, a restauração dos dados pode ser muito lenta porque a repetição das instruções SQL envolve I/O de disco para insertion, index creation, e assim por diante.

Para backup e restore em larga escala, um backup físico é mais apropriado, para copiar os data files em seu formato original que pode ser restaurado rapidamente:

* Se suas Tables forem principalmente Tables `InnoDB`, ou se você tiver uma mistura de Tables `InnoDB` e `MyISAM`, considere usar o comando **mysqlbackup** do produto MySQL Enterprise Backup. (Disponível como parte da assinatura Enterprise.) Ele oferece a melhor performance para backups `InnoDB` com o mínimo de interrupção; ele também pode fazer backup de Tables de `MyISAM` e outros storage engines; e fornece várias opções convenientes para acomodar diferentes cenários de backup. Veja Seção 28.1, “Visão Geral do MySQL Enterprise Backup”.

**mysqldump** pode recuperar e despejar o conteúdo da Table linha por linha, ou pode recuperar o conteúdo inteiro de uma Table e armazená-lo em Buffer na memória antes de despejá-lo. O Buffer na memória pode ser um problema se você estiver fazendo o dump de Tables grandes. Para fazer o dump de Tables linha por linha, use a opção `--quick` (ou `--opt`, que habilita `--quick`). A opção `--opt` (e, portanto, `--quick`) está habilitada por default, então, para habilitar o Buffer de memória, use `--skip-quick`.

Se você estiver usando uma versão recente do **mysqldump** para gerar um dump a ser recarregado em um MySQL server muito antigo, use a opção `--skip-opt` em vez de `--opt` ou `--extended-insert`.

Para obter informações adicionais sobre **mysqldump**, consulte a Seção 7.4, “Usando mysqldump para Backups”.

#### Sintaxe de Invocação

Existem, em geral, três maneiras de usar o **mysqldump** — para despejar um conjunto de uma ou mais Tables, um conjunto de uma ou mais Databases completas, ou um MySQL server inteiro — conforme mostrado aqui:

```sql
mysqldump [options] db_name [tbl_name ...]
mysqldump [options] --databases db_name ...
mysqldump [options] --all-databases
```

Para despejar Databases inteiras, não nomeie nenhuma Table após *`db_name`*, ou use a opção `--databases` ou `--all-databases`.

Para ver uma lista das opções suportadas por sua versão do **mysqldump**, execute o comando **mysqldump --help**.

#### Sintaxe de Opções - Resumo Alfabético

O **mysqldump** suporta as seguintes opções, que podem ser especificadas na command line ou nos grupos `[mysqldump]` e `[client]` de um option file. Para obter informações sobre option files usados por programas MySQL, consulte a Seção 4.2.2.2, “Usando Arquivos de Opções”.

**Table 4.16 Opções do mysqldump**

<table frame="box" rules="all" summary="Opções de linha de comando disponíveis para mysqldump."><col style="width: 27%"/><col style="width: 50%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th>Nome da Opção</th> <th>Descrição</th> <th>Introduzido</th> <th>Obsoleto</th> </tr></thead><tbody><tr><th>--add-drop-database</th> <td>Adiciona a instrução DROP DATABASE antes de cada instrução CREATE DATABASE</td> <td></td> <td></td> </tr><tr><th>--add-drop-table</th> <td>Adiciona a instrução DROP TABLE antes de cada instrução CREATE TABLE</td> <td></td> <td></td> </tr><tr><th>--add-drop-trigger</th> <td>Adiciona a instrução DROP TRIGGER antes de cada instrução CREATE TRIGGER</td> <td></td> <td></td> </tr><tr><th>--add-locks</th> <td>Envolve cada dump de Table com as instruções LOCK TABLES e UNLOCK TABLES</td> <td></td> <td></td> </tr><tr><th>--all-databases</th> <td>Faz o Dump de todas as Tables em todas as Databases</td> <td></td> <td></td> </tr><tr><th>--allow-keywords</th> <td>Permite a criação de nomes de coluna que são Keywords</td> <td></td> <td></td> </tr><tr><th>--apply-slave-statements</th> <td>Inclui STOP SLAVE antes da instrução CHANGE MASTER e START SLAVE no final da saída</td> <td></td> <td></td> </tr><tr><th>--bind-address</th> <td>Usa a interface de rede especificada para conectar ao MySQL Server</td> <td></td> <td></td> </tr><tr><th>--character-sets-dir</th> <td>Diretório onde os Character Sets estão instalados</td> <td></td> <td></td> </tr><tr><th>--comments</th> <td>Adiciona comentários ao dump file</td> <td></td> <td></td> </tr><tr><th>--compact</th> <td>Produz saída mais compacta</td> <td></td> <td></td> </tr><tr><th>--compatible</th> <td>Produz saída que é mais compatível com outros Database Systems ou com MySQL servers mais antigos</td> <td></td> <td></td> </tr><tr><th>--complete-insert</th> <td>Usa instruções INSERT completas que incluem nomes de coluna</td> <td></td> <td></td> </tr><tr><th>--compress</th> <td>Comprime todas as informações enviadas entre o client e o server</td> <td></td> <td></td> </tr><tr><th>--create-options</th> <td>Inclui todas as opções de Table específicas do MySQL nas instruções CREATE TABLE</td> <td></td> <td></td> </tr><tr><th>--databases</th> <td>Interpreta todos os argumentos de nome como nomes de Database</td> <td></td> <td></td> </tr><tr><th>--debug</th> <td>Grava o log de Debugging</td> <td></td> <td></td> </tr><tr><th>--debug-check</th> <td>Imprime informações de Debugging quando o programa é encerrado</td> <td></td> <td></td> </tr><tr><th>--debug-info</th> <td>Imprime informações de Debugging, memória e estatísticas de CPU quando o programa é encerrado</td> <td></td> <td></td> </tr><tr><th>--default-auth</th> <td>Plugin de autenticação a ser usado</td> <td></td> <td></td> </tr><tr><th>--default-character-set</th> <td>Especifica o Character Set default</td> <td></td> <td></td> </tr><tr><th>--defaults-extra-file</th> <td>Lê o option file nomeado além dos option files usuais</td> <td></td> <td></td> </tr><tr><th>--defaults-file</th> <td>Lê apenas o option file nomeado</td> <td></td> <td></td> </tr><tr><th>--defaults-group-suffix</th> <td>Valor do sufixo do grupo de opções</td> <td></td> <td></td> </tr><tr><th>--delete-master-logs</th> <td>Em um replication source server, exclui os binary logs após realizar a operação de dump</td> <td></td> <td></td> </tr><tr><th>--disable-keys</th> <td>Para cada Table, envolve as instruções INSERT com instruções para desabilitar e habilitar Keys</td> <td></td> <td></td> </tr><tr><th>--dump-date</th> <td>Inclui a data do dump como comentário "Dump completed on" se --comments for fornecido</td> <td></td> <td></td> </tr><tr><th>--dump-slave</th> <td>Inclui a instrução CHANGE MASTER que lista as coordenadas do binary log do source da replica</td> <td></td> <td></td> </tr><tr><th>--enable-cleartext-plugin</th> <td>Habilita o plugin de autenticação cleartext</td> <td>5.7.10</td> <td></td> </tr><tr><th>--events</th> <td>Faz o Dump de Events das Databases despejadas</td> <td></td> <td></td> </tr><tr><th>--extended-insert</th> <td>Usa a sintaxe INSERT de múltiplas linhas</td> <td></td> <td></td> </tr><tr><th>--fields-enclosed-by</th> <td>Esta opção é usada com a opção --tab e tem o mesmo significado que a cláusula correspondente para LOAD DATA</td> <td></td> <td></td> </tr><tr><th>--fields-escaped-by</th> <td>Esta opção é usada com a opção --tab e tem o mesmo significado que a cláusula correspondente para LOAD DATA</td> <td></td> <td></td> </tr><tr><th>--fields-optionally-enclosed-by</th> <td>Esta opção é usada com a opção --tab e tem o mesmo significado que a cláusula correspondente para LOAD DATA</td> <td></td> <td></td> </tr><tr><th>--fields-terminated-by</th> <td>Esta opção é usada com a opção --tab e tem o mesmo significado que a cláusula correspondente para LOAD DATA</td> <td></td> <td></td> </tr><tr><th>--flush-logs</th> <td>Faz o Flush dos log files do MySQL server antes de iniciar o dump</td> <td></td> <td></td> </tr><tr><th>--flush-privileges</th> <td>Emite uma instrução FLUSH PRIVILEGES após despejar a Database mysql</td> <td></td> <td></td> </tr><tr><th>--force</th> <td>Continua mesmo que ocorra um erro SQL durante o dump de uma Table</td> <td></td> <td></td> </tr><tr><th>--get-server-public-key</th> <td>Solicita a chave pública RSA do server</td> <td>5.7.23</td> <td></td> </tr><tr><th>--help</th> <td>Exibe a mensagem de ajuda e sai</td> <td></td> <td></td> </tr><tr><th>--hex-blob</th> <td>Faz o Dump de colunas binárias usando notação hexadecimal</td> <td></td> <td></td> </tr><tr><th>--host</th> <td>Host no qual o MySQL server está localizado</td> <td></td> <td></td> </tr><tr><th>--ignore-error</th> <td>Ignora erros especificados</td> <td></td> <td></td> </tr><tr><th>--ignore-table</th> <td>Não faz o dump da Table fornecida</td> <td></td> <td></td> </tr><tr><th>--include-master-host-port</th> <td>Inclui as opções MASTER_HOST/MASTER_PORT na instrução CHANGE MASTER produzida com --dump-slave</td> <td></td> <td></td> </tr><tr><th>--insert-ignore</th> <td>Escreve instruções INSERT IGNORE em vez de instruções INSERT</td> <td></td> <td></td> </tr><tr><th>--lines-terminated-by</th> <td>Esta opção é usada com a opção --tab e tem o mesmo significado que a cláusula correspondente para LOAD DATA</td> <td></td> <td></td> </tr><tr><th>--lock-all-tables</th> <td>Bloqueia todas as Tables em todas as Databases</td> <td></td> <td></td> </tr><tr><th>--lock-tables</th> <td>Bloqueia todas as Tables antes de despejá-las</td> <td></td> <td></td> </tr><tr><th>--log-error</th> <td>Anexa warnings e errors ao arquivo nomeado</td> <td></td> <td></td> </tr><tr><th>--login-path</th> <td>Lê as opções de login path do .mylogin.cnf</td> <td></td> <td></td> </tr><tr><th>--master-data</th> <td>Grava o nome do binary log file e a position na saída</td> <td></td> <td></td> </tr><tr><th>--max-allowed-packet</th> <td>Tamanho máximo do Packet a ser enviado ou recebido do server</td> <td></td> <td></td> </tr><tr><th>--net-buffer-length</th> <td>Tamanho do Buffer para comunicação TCP/IP e Socket</td> <td></td> <td></td> </tr><tr><th>--no-autocommit</th> <td>Envolve as instruções INSERT para cada Table despejada em instruções SET autocommit = 0 e COMMIT</td> <td></td> <td></td> </tr><tr><th>--no-create-db</th> <td>Não grava instruções CREATE DATABASE</td> <td></td> <td></td> </tr><tr><th>--no-create-info</th> <td>Não grava instruções CREATE TABLE que recriam cada Table despejada</td> <td></td> <td></td> </tr><tr><th>--no-data</th> <td>Não faz o dump do conteúdo da Table</td> <td></td> <td></td> </tr><tr><th>--no-defaults</th> <td>Não lê nenhum option file</td> <td></td> <td></td> </tr><tr><th>--no-set-names</th> <td>O mesmo que --skip-set-charset</td> <td></td> <td></td> </tr><tr><th>--no-tablespaces</th> <td>Não grava nenhuma instrução CREATE LOGFILE GROUP ou CREATE TABLESPACE na saída</td> <td></td> <td></td> </tr><tr><th>--opt</th> <td>Abreviação para --add-drop-table --add-locks --create-options --disable-keys --extended-insert --lock-tables --quick --set-charset</td> <td></td> <td></td> </tr><tr><th>--order-by-primary</th> <td>Faz o Dump das linhas de cada Table ordenadas por sua Primary Key, ou por seu primeiro Unique Index</td> <td></td> <td></td> </tr><tr><th>--password</th> <td>Password a ser usada ao conectar ao server</td> <td></td> <td></td> </tr><tr><th>--pipe</th> <td>Conecta ao server usando Named Pipe (somente Windows)</td> <td></td> <td></td> </tr><tr><th>--plugin-dir</th> <td>Diretório onde os Plugins estão instalados</td> <td></td> <td></td> </tr><tr><th>--port</th> <td>Número da Porta TCP/IP para conexão</td> <td></td> <td></td> </tr><tr><th>--print-defaults</th> <td>Imprime as opções default</td> <td></td> <td></td> </tr><tr><th>--protocol</th> <td>Protocolo de transporte a ser usado</td> <td></td> <td></td> </tr><tr><th>--quick</th> <td>Recupera as linhas de uma Table do server uma linha por vez</td> <td></td> <td></td> </tr><tr><th>--quote-names</th> <td>Faz o Quote de Identifiers dentro de caracteres backtick</td> <td></td> <td></td> </tr><tr><th>--replace</th> <td>Escreve instruções REPLACE em vez de instruções INSERT</td> <td></td> <td></td> </tr><tr><th>--result-file</th> <td>Direciona a saída para um determinado arquivo</td> <td></td> <td></td> </tr><tr><th>--routines</th> <td>Faz o Dump de stored routines (procedures e functions) das Databases despejadas</td> <td></td> <td></td> </tr><tr><th>--secure-auth</th> <td>Não envia passwords ao server em formato antigo (pré-4.1)</td> <td></td> <td>Sim</td> </tr><tr><th>--server-public-key-path</th> <td>Nome do Path para o arquivo contendo a chave pública RSA</td> <td>5.7.23</td> <td></td> </tr><tr><th>--set-charset</th> <td>Adiciona SET NAMES default_character_set à saída</td> <td></td> <td></td> </tr><tr><th>--set-gtid-purged</th> <td>Se deve adicionar SET @@GLOBAL.GTID_PURGED à saída</td> <td></td> <td></td> </tr><tr><th>--shared-memory-base-name</th> <td>Nome da Shared-Memory para conexões Shared-Memory (somente Windows)</td> <td></td> <td></td> </tr><tr><th>--single-transaction</th> <td>Emite uma instrução BEGIN SQL antes de fazer o dump dos dados do server</td> <td></td> <td></td> </tr><tr><th>--skip-add-drop-table</th> <td>Não adiciona uma instrução DROP TABLE antes de cada instrução CREATE TABLE</td> <td></td> <td></td> </tr><tr><th>--skip-add-locks</th> <td>Não adiciona Locks</td> <td></td> <td></td> </tr><tr><th>--skip-comments</th> <td>Não adiciona comentários ao dump file</td> <td></td> <td></td> </tr><tr><th>--skip-compact</th> <td>Não produz saída mais compacta</td> <td></td> <td></td> </tr><tr><th>--skip-disable-keys</th> <td>Não desabilita Keys</td> <td></td> <td></td> </tr><tr><th>--skip-extended-insert</th> <td>Desliga extended-insert</td> <td></td> <td></td> </tr><tr><th>--skip-mysql-schema</th> <td>Não elimina o schema mysql</td> <td>5.7.36</td> <td></td> </tr><tr><th>--skip-opt</th> <td>Desliga as opções definidas por --opt</td> <td></td> <td></td> </tr><tr><th>--skip-quick</th> <td>Não recupera as linhas de uma Table do server uma linha por vez</td> <td></td> <td></td> </tr><tr><th>--skip-quote-names</th> <td>Não faz o Quote de Identifiers</td> <td></td> <td></td> </tr><tr><th>--skip-set-charset</th> <td>Não grava a instrução SET NAMES</td> <td></td> <td></td> </tr><tr><th>--skip-triggers</th> <td>Não faz o Dump de Triggers</td> <td></td> <td></td> </tr><tr><th>--skip-tz-utc</th> <td>Desliga tz-utc</td> <td></td> <td></td> </tr><tr><th>--socket</th> <td>Arquivo Unix socket ou Named Pipe do Windows a ser usado</td> <td></td> <td></td> </tr><tr><th>--ssl</th> <td>Habilita a Connection Encryption</td> <td></td> <td></td> </tr><tr><th>--ssl-ca</th> <td>Arquivo que contém a lista de Certificate Authorities SSL confiáveis</td> <td></td> <td></td> </tr><tr><th>--ssl-capath</th> <td>Diretório que contém os certificate files das Certificate Authorities SSL confiáveis</td> <td></td> <td></td> </tr><tr><th>--ssl-cert</th> <td>Arquivo que contém o certificado X.509</td> <td></td> <td></td> </tr><tr><th>--ssl-cipher</th> <td>Ciphers permitidos para Connection Encryption</td> <td></td> <td></td> </tr><tr><th>--ssl-crl</th> <td>Arquivo que contém as Certificate Revocation Lists</td> <td></td> <td></td> </tr><tr><th>--ssl-crlpath</th> <td>Diretório que contém os Certificate Revocation List files</td> <td></td> <td></td> </tr><tr><th>--ssl-key</th> <td>Arquivo que contém a chave X.509</td> <td></td> <td></td> </tr><tr><th>--ssl-mode</th> <td>Estado de segurança desejado da conexão com o server</td> <td>5.7.11</td> <td></td> </tr><tr><th>--ssl-verify-server-cert</th> <td>Verifica o host name em relação à identidade Common Name do Server Certificate</td> <td></td> <td></td> </tr><tr><th>--tab</th> <td>Produz data files separados por tabulação</td> <td></td> <td></td> </tr><tr><th>--tables</th> <td>Substitui a opção --databases ou -B</td> <td></td> <td></td> </tr><tr><th>--tls-version</th> <td>Protocolos TLS permitidos para conexões encriptadas</td> <td>5.7.10</td> <td></td> </tr><tr><th>--triggers</th> <td>Faz o Dump de Triggers para cada Table despejada</td> <td></td> <td></td> </tr><tr><th>--tz-utc</th> <td>Adiciona SET TIME_ZONE='+00:00' ao dump file</td> <td></td> <td></td> </tr><tr><th>--user</th> <td>Nome de usuário MySQL a ser usado ao conectar ao server</td> <td></td> <td></td> </tr><tr><th>--verbose</th> <td>Modo Verbose</td> <td></td> <td></td> </tr><tr><th>--version</th> <td>Exibe informações da versão e sai</td> <td></td> <td></td> </tr><tr><th>--where</th> <td>Faz o Dump apenas das linhas selecionadas pela condição WHERE fornecida</td> <td></td> <td></td> </tr><tr><th>--xml</th> <td>Produz saída XML</td> <td></td> <td></td> </tr> </tbody></table>

#### Opções de Conexão

O comando **mysqldump** faz Login em um MySQL server para extrair informações. As seguintes opções especificam como conectar ao MySQL server, seja na mesma máquina ou em um sistema remoto.

* `--bind-address=ip_address`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato Command-Line</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  Em um computador com múltiplas network interfaces, use esta opção para selecionar qual interface usar para conectar ao MySQL server.

* `--compress`, `-C`

  <table frame="box" rules="all" summary="Propriedades para compress"><tbody><tr><th>Formato Command-Line</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Default</th> <td><code>OFF</code></td> </tr></tbody></table>

  Comprime todas as informações enviadas entre o client e o server, se possível. Consulte a Seção 4.2.6, “Controle de Compressão de Conexão”.

* `--default-auth=plugin`

  <table frame="box" rules="all" summary="Propriedades para default-auth"><tbody><tr><th>Formato Command-Line</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Uma dica sobre qual authentication plugin do lado do client usar. Consulte a Seção 6.2.13, “Pluggable Authentication”.

* `--enable-cleartext-plugin`

  <table frame="box" rules="all" summary="Propriedades para enable-cleartext-plugin"><tbody><tr><th>Formato Command-Line</th> <td><code>--enable-cleartext-plugin</code></td> </tr><tr><th>Introduzido</th> <td>5.7.10</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Default</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Habilita o plugin de autenticação cleartext `mysql_clear_password`. (Consulte a Seção 6.4.1.6, “Autenticação Pluggable Cleartext do Lado do Cliente”.)

  Esta opção foi adicionada no MySQL 5.7.10.

* `--get-server-public-key`

  <table frame="box" rules="all" summary="Propriedades para get-server-public-key"><tbody><tr><th>Formato Command-Line</th> <td><code>--get-server-public-key</code></td> </tr><tr><th>Introduzido</th> <td>5.7.23</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr></tbody></table>

  Solicita ao server a chave pública necessária para a troca de password baseada em par de chaves RSA. Esta opção se aplica a clients que se autenticam com o authentication plugin `caching_sha2_password`. Para esse plugin, o server não envia a chave pública, a menos que seja solicitada. Esta opção é ignorada para contas que não se autenticam com esse plugin. Também é ignorada se a troca de password baseada em RSA não for usada, como é o caso quando o client se conecta ao server usando uma Secure Connection.

  Se `--server-public-key-path=file_name` for fornecido e especificar um public key file válido, ele terá precedência sobre `--get-server-public-key`.

  Para obter informações sobre o plugin `caching_sha2_password`, consulte a Seção 6.4.1.4, “Autenticação Pluggable SHA-2 de Caching”.

  A opção `--get-server-public-key` foi adicionada no MySQL 5.7.23.

* `--host=host_name`, `-h host_name`

  <table frame="box" rules="all" summary="Propriedades para host"><tbody><tr><th>Formato Command-Line</th> <td><code>--host</code></td> </tr></tbody></table>

  Faz o Dump dos dados do MySQL server no host fornecido. O host default é `localhost`.

* `--login-path=name`

  <table frame="box" rules="all" summary="Propriedades para login-path"><tbody><tr><th>Formato Command-Line</th> <td><code>--login-path=name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Lê as opções do login path nomeado no login path file `.mylogin.cnf`. Um “login path” é um grupo de opções contendo opções que especificam a qual MySQL server conectar e com qual conta autenticar. Para criar ou modificar um login path file, use o utilitário **mysql_config_editor**. Consulte a Seção 4.6.6, “mysql_config_editor — Utilitário de Configuração MySQL”.

  Para obter informações adicionais sobre esta e outras opções de option file, consulte a Seção 4.2.2.3, “Opções de Linha de Comando que Afetam o Tratamento de Arquivos de Opções”.

* `--password[=password]`, `-p[password]`

  <table frame="box" rules="all" summary="Propriedades para password"><tbody><tr><th>Formato Command-Line</th> <td><code>--password[=password]</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  A password da conta MySQL usada para conectar ao server. O valor da password é opcional. Se não for fornecido, **mysqldump** solicitará um. Se for fornecido, *não deve haver espaço* entre `--password=` ou `-p` e a password que o segue. Se nenhuma opção de password for especificada, o default é não enviar nenhuma password.

  Especificar uma password na command line deve ser considerado inseguro. Para evitar fornecer a password na command line, use um option file. Consulte a Seção 6.1.2.1, “Diretrizes para o Usuário Final para Segurança de Password”.

  Para especificar explicitamente que não há password e que **mysqldump** não deve solicitar uma, use a opção `--skip-password`.

* `--pipe`, `-W`

  <table frame="box" rules="all" summary="Propriedades para pipe"><tbody><tr><th>Formato Command-Line</th> <td><code>--pipe</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  No Windows, conecta ao server usando um named pipe. Esta opção se aplica apenas se o server foi iniciado com a variável de sistema `named_pipe` habilitada para suportar named-pipe connections. Além disso, o usuário que está fazendo a conexão deve ser membro do grupo Windows especificado pela variável de sistema `named_pipe_full_access_group`.

* `--plugin-dir=dir_name`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato Command-Line</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  O diretório onde procurar por Plugins. Especifique esta opção se a opção `--default-auth` for usada para especificar um authentication plugin, mas **mysqldump** não o encontrar. Consulte a Seção 6.2.13, “Pluggable Authentication”.

* `--port=port_num`, `-P port_num`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato Command-Line</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  Para conexões TCP/IP, o número da porta a ser usado.

* `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato Command-Line</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  O protocolo de transporte a ser usado para conectar ao server. É útil quando os outros parâmetros de conexão normalmente resultam no uso de um protocolo diferente do que você deseja. Para detalhes sobre os valores permitidos, consulte a Seção 4.2.5, “Protocolos de Transporte de Conexão”.

* `--secure-auth`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato Command-Line</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  Não envia passwords para o server em formato antigo (pré-4.1). Isso impede conexões, exceto para servers que usam o formato de password mais recente.

  A partir do MySQL 5.7.5, esta opção está obsoleta; espera-se que seja removida em um futuro Release do MySQL. Está sempre habilitada e a tentativa de desabilitá-la (`--skip-secure-auth`, `--secure-auth=0`) produz um error. Antes do MySQL 5.7.5, esta opção está habilitada por default, mas pode ser desabilitada.

  Note

  Passwords que usam o método de hashing pré-4.1 são menos seguras do que passwords que usam o método de hashing de password nativo e devem ser evitadas. Passwords pré-4.1 estão obsoletas e o suporte a elas foi removido no MySQL 5.7.5. Para instruções de atualização de conta, consulte a Seção 6.4.1.3, “Migrando do Hashing de Password Pré-4.1 e do Plugin mysql_old_password”.

* `--server-public-key-path=file_name`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato Command-Line</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  O nome do Path para um arquivo no formato PEM contendo uma cópia do lado do client da chave pública exigida pelo server para troca de password baseada em par de chaves RSA. Esta opção se aplica a clients que se autenticam com o authentication plugin `sha256_password` ou `caching_sha2_password`. Esta opção é ignorada para contas que não se autenticam com um desses Plugins. Também é ignorada se a troca de password baseada em RSA não for usada, como é o caso quando o client se conecta ao server usando uma Secure Connection.

  Se `--server-public-key-path=file_name` for fornecido e especificar um public key file válido, ele terá precedência sobre `--get-server-public-key`.

  Para `sha256_password`, esta opção se aplica apenas se o MySQL foi construído usando OpenSSL.

  Para obter informações sobre os Plugins `sha256_password` e `caching_sha2_password`, consulte a Seção 6.4.1.5, “Autenticação Pluggable SHA-256”, e a Seção 6.4.1.4, “Autenticação Pluggable SHA-2 de Caching”.

  A opção `--server-public-key-path` foi adicionada no MySQL 5.7.23.

* `--skip-mysql-schema`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato Command-Line</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  Não elimina o schema `mysql` quando o dump file é restaurado. Por default, o schema é eliminado.

  Esta opção foi adicionada no MySQL 5.7.36.

* `--socket=path`, `-S path`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato Command-Line</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  Para conexões com `localhost`, o Unix socket file a ser usado ou, no Windows, o nome do named pipe a ser usado.

  No Windows, esta opção se aplica apenas se o server foi iniciado com a variável de sistema `named_pipe` habilitada para suportar named-pipe connections. Além disso, o usuário que está fazendo a conexão deve ser membro do grupo Windows especificado pela variável de sistema `named_pipe_full_access_group`.

* `--ssl*`

  Opções que começam com `--ssl` especificam se devem conectar ao server usando Encryption e indicam onde encontrar SSL keys e certificates. Consulte Opções de Comando para Conexões Encriptadas.

* `--tls-version=protocol_list`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato Command-Line</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  Os protocolos TLS permitidos para conexões encriptadas. O valor é uma lista de um ou mais nomes de protocolos separados por vírgulas. Os protocolos que podem ser nomeados para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para detalhes, consulte a Seção 6.3.2, “Protocolos e Ciphers TLS de Conexão Encriptada”.

  Esta opção foi adicionada no MySQL 5.7.10.

* `--user=user_name`, `-u user_name`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato Command-Line</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  O nome de usuário da conta MySQL a ser usada para conectar ao server.

#### Opções de Arquivo de Opções

Estas opções são usadas para controlar quais option files ler.

* `--defaults-extra-file=file_name`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato Command-Line</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  Lê este option file após o option file global, mas (no Unix) antes do option file do usuário. Se o arquivo não existir ou estiver inacessível, ocorre um error. Se *`file_name`* não for um absolute path name, ele será interpretado em relação ao current directory.

  Para obter informações adicionais sobre esta e outras opções de option file, consulte a Seção 4.2.2.3, “Opções de Linha de Comando que Afetam o Tratamento de Arquivos de Opções”.

* `--defaults-file=file_name`

  <table frame="box" rules="all" summary="Propriedades para compress"><tbody><tr><th>Formato Command-Line</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Default</th> <td><code>OFF</code></td> </tr></tbody></table>

  Usa apenas o option file fornecido. Se o arquivo não existir ou estiver inacessível, ocorre um error. Se *`file_name`* não for um absolute path name, ele será interpretado em relação ao current directory.

  Exceção: Mesmo com `--defaults-file`, os client programs leem `.mylogin.cnf`.

  Para obter informações adicionais sobre esta e outras opções de option file, consulte a Seção 4.2.2.3, “Opções de Linha de Comando que Afetam o Tratamento de Arquivos de Opções”.

* `--defaults-group-suffix=str`

  <table frame="box" rules="all" summary="Propriedades para compress"><tbody><tr><th>Formato Command-Line</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Default</th> <td><code>OFF</code></td> </tr></tbody></table>

  Lê não apenas os grupos de opções usuais, mas também grupos com os nomes usuais e um sufixo de *`str`*. Por exemplo, **mysqldump** normalmente lê os grupos `[client]` e `[mysqldump]`. Se esta opção for fornecida como `--defaults-group-suffix=_other`, **mysqldump** também lê os grupos `[client_other]` e `[mysqldump_other]`.

  Para obter informações adicionais sobre esta e outras opções de option file, consulte a Seção 4.2.2.3, “Opções de Linha de Comando que Afetam o Tratamento de Arquivos de Opções”.

* `--no-defaults`

  <table frame="box" rules="all" summary="Propriedades para compress"><tbody><tr><th>Formato Command-Line</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Default</th> <td><code>OFF</code></td> </tr></tbody></table>

  Não lê nenhum option file. Se a inicialização do programa falhar devido à leitura de opções desconhecidas de um option file, `--no-defaults` pode ser usado para evitar que sejam lidas.

  A exceção é que o arquivo `.mylogin.cnf` é lido em todos os casos, se existir. Isso permite que as passwords sejam especificadas de forma mais segura do que na command line, mesmo quando `--no-defaults` é usado. Para criar `.mylogin.cnf`, use o utilitário **mysql_config_editor**. Consulte a Seção 4.6.6, “mysql_config_editor — Utilitário de Configuração MySQL”.

  Para obter informações adicionais sobre esta e outras opções de option file, consulte a Seção 4.2.2.3, “Opções de Linha de Comando que Afetam o Tratamento de Arquivos de Opções”.

* `--print-defaults`

  <table frame="box" rules="all" summary="Propriedades para compress"><tbody><tr><th>Formato Command-Line</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Default</th> <td><code>OFF</code></td> </tr></tbody></table>

  Imprime o nome do programa e todas as opções que ele obtém dos option files.

  Para obter informações adicionais sobre esta e outras opções de option file, consulte a Seção 4.2.2.3, “Opções de Linha de Comando que Afetam o Tratamento de Arquivos de Opções”.

#### Opções DDL

Os cenários de uso para **mysqldump** incluem a configuração de uma nova instância MySQL inteira (incluindo Tables de Database) e a substituição de dados dentro de uma instância existente com Databases e Tables existentes. As seguintes opções permitem especificar quais itens derrubar e configurar ao restaurar um dump, codificando várias instruções DDL dentro do dump file.

* `--add-drop-database`

  <table frame="box" rules="all" summary="Propriedades para compress"><tbody><tr><th>Formato Command-Line</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Default</th> <td><code>OFF</code></td> </tr></tbody></table>

  Grava uma instrução `DROP DATABASE` antes de cada instrução `CREATE DATABASE`. Esta opção é tipicamente usada em conjunto com a opção `--all-databases` ou `--databases` porque nenhuma instrução `CREATE DATABASE` é gravada, a menos que uma dessas opções seja especificada.

* `--add-drop-table`

  <table frame="box" rules="all" summary="Propriedades para compress"><tbody><tr><th>Formato Command-Line</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Default</th> <td><code>OFF</code></td> </tr></tbody></table>

  Grava uma instrução `DROP TABLE` antes de cada instrução `CREATE TABLE`.

* `--add-drop-trigger`

  <table frame="box" rules="all" summary="Propriedades para compress"><tbody><tr><th>Formato Command-Line</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Default</th> <td><code>OFF</code></td> </tr></tbody></table>

  Grava uma instrução `DROP TRIGGER` antes de cada instrução `CREATE TRIGGER`.

* `--all-tablespaces`, `-Y`

  <table frame="box" rules="all" summary="Propriedades para compress"><tbody><tr><th>Formato Command-Line</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Default</th> <td><code>OFF</code></td> </tr></tbody></table>

  Adiciona a um dump de Table todas as instruções SQL necessárias para criar quaisquer Tablespaces usadas por uma Table `NDB`. Esta informação não é incluída de outra forma na saída do **mysqldump**. Esta opção é atualmente relevante apenas para Tables NDB Cluster, que não são suportadas no MySQL 5.7.

* `--no-create-db`, `-n`

  <table frame="box" rules="all" summary="Propriedades para compress"><tbody><tr><th>Formato Command-Line</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Default</th> <td><code>OFF</code></td> </tr></tbody></table>

  Suprime as instruções `CREATE DATABASE` que, de outra forma, seriam incluídas na saída se a opção `--databases` ou `--all-databases` fosse fornecida.

* `--no-create-info`, `-t`

  <table frame="box" rules="all" summary="Propriedades para compress"><tbody><tr><th>Formato Command-Line</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Default</th> <td><code>OFF</code></td> </tr></tbody></table>

  Não grava instruções `CREATE TABLE` que criam cada Table despejada.

  Note

  Esta opção *não* exclui instruções que criam log file groups ou Tablespaces da saída do **mysqldump**; no entanto, você pode usar a opção `--no-tablespaces` para este fim.

* `--no-tablespaces`, `-y`

  <table frame="box" rules="all" summary="Propriedades para default-auth"><tbody><tr><th>Formato Command-Line</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Esta opção suprime todas as instruções `CREATE LOGFILE GROUP` e `CREATE TABLESPACE` na saída do **mysqldump**.

* `--replace`

  <table frame="box" rules="all" summary="Propriedades para default-auth"><tbody><tr><th>Formato Command-Line</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Grava instruções `REPLACE` em vez de instruções `INSERT`.

#### Opções de Debug

As seguintes opções imprimem informações de Debugging, codificam informações de Debugging no dump file ou permitem que a operação de dump prossiga, independentemente de problemas potenciais.

* `--allow-keywords`

  <table frame="box" rules="all" summary="Propriedades para default-auth"><tbody><tr><th>Formato Command-Line</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Permite a criação de nomes de coluna que são Keywords. Isso funciona prefixando cada nome de coluna com o nome da Table.

* `--comments`, `-i`

  <table frame="box" rules="all" summary="Propriedades para default-auth"><tbody><tr><th>Formato Command-Line</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Grava informações adicionais no dump file, como versão do programa, versão do server e host. Esta opção está habilitada por default. Para suprimir esta informação adicional, use `--skip-comments`.

* `--debug[=debug_options]`, `-# [debug_options]`

  <table frame="box" rules="all" summary="Propriedades para default-auth"><tbody><tr><th>Formato Command-Line</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Grava um log de Debugging. Uma string *`debug_options`* típica é `d:t:o,file_name`. O valor default é `d:t:o,/tmp/mysqldump.trace`.

  Esta opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`. Os binários de Release do MySQL fornecidos pela Oracle *não* são construídos usando esta opção.

* `--debug-check`

  <table frame="box" rules="all" summary="Propriedades para default-auth"><tbody><tr><th>Formato Command-Line</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Imprime algumas informações de Debugging quando o programa é encerrado.

  Esta opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`. Os binários de Release do MySQL fornecidos pela Oracle *não* são construídos usando esta opção.

* `--debug-info`

  <table frame="box" rules="all" summary="Propriedades para default-auth"><tbody><tr><th>Formato Command-Line</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Imprime informações de Debugging e estatísticas de uso de memória e CPU quando o programa é encerrado.

  Esta opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`. Os binários de Release do MySQL fornecidos pela Oracle *não* são construídos usando esta opção.

* `--dump-date`

  <table frame="box" rules="all" summary="Propriedades para default-auth"><tbody><tr><th>Formato Command-Line</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Se a opção `--comments` for fornecida, **mysqldump** produz um comentário no final do dump do seguinte formato:

  ```sql
  -- Dump completed on DATE
  ```

  No entanto, a data faz com que dump files feitos em momentos diferentes pareçam ser diferentes, mesmo que os dados sejam idênticos. `--dump-date` e `--skip-dump-date` controlam se a data é adicionada ao comentário. O default é `--dump-date` (incluir a data no comentário). `--skip-dump-date` suprime a impressão da data.

* `--force`, `-f`

  <table frame="box" rules="all" summary="Propriedades para default-auth"><tbody><tr><th>Formato Command-Line</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Ignora todos os errors; continua mesmo que ocorra um SQL error durante o dump de uma Table.

  Um uso para esta opção é fazer com que **mysqldump** continue executando, mesmo quando encontra uma View que se tornou inválida porque a definição se refere a uma Table que foi eliminada. Sem `--force`, **mysqldump** é encerrado com uma mensagem de error. Com `--force`, **mysqldump** imprime a mensagem de error, mas também grava um SQL comment contendo a definição da View na saída do dump e continua a execução.

  Se a opção `--ignore-error` também for fornecida para ignorar errors específicos, `--force` terá precedência.

* `--log-error=file_name`

  <table frame="box" rules="all" summary="Propriedades para default-auth"><tbody><tr><th>Formato Command-Line</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Registra warnings e errors anexando-os ao arquivo nomeado. O default é não fazer logging.

* `--skip-comments`

  <table frame="box" rules="all" summary="Propriedades para enable-cleartext-plugin"><tbody><tr><th>Formato Command-Line</th> <td><code>--enable-cleartext-plugin</code></td> </tr><tr><th>Introduzido</th> <td>5.7.10</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Default</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Veja a descrição da opção `--comments`.

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Propriedades para enable-cleartext-plugin"><tbody><tr><th>Formato Command-Line</th> <td><code>--enable-cleartext-plugin</code></td> </tr><tr><th>Introduzido</th> <td>5.7.10</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Default</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Modo Verbose. Imprime mais informações sobre o que o programa faz.

#### Opções de Ajuda

As seguintes opções exibem informações sobre o próprio comando **mysqldump**.

* `--help`, `-?`

  <table frame="box" rules="all" summary="Propriedades para enable-cleartext-plugin"><tbody><tr><th>Formato Command-Line</th> <td><code>--enable-cleartext-plugin</code></td> </tr><tr><th>Introduzido</th> <td>5.7.10</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Default</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Exibe uma mensagem de ajuda e sai.

* `--version`, `-V`

  <table frame="box" rules="all" summary="Propriedades para enable-cleartext-plugin"><tbody><tr><th>Formato Command-Line</th> <td><code>--enable-cleartext-plugin</code></td> </tr><tr><th>Introduzido</th> <td>5.7.10</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Default</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Exibe informações da versão e sai.

#### Opções de Internacionalização

As seguintes opções alteram como o comando **mysqldump** representa dados de caracteres com configurações de linguagem nacional.

* `--character-sets-dir=dir_name`

  <table frame="box" rules="all" summary="Propriedades para enable-cleartext-plugin"><tbody><tr><th>Formato Command-Line</th> <td><code>--enable-cleartext-plugin</code></td> </tr><tr><th>Introduzido</th> <td>5.7.10</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Default</th> <td><code>FALSE</code></td> </tr></tbody></table>

  O diretório onde os Character Sets estão instalados. Consulte a Seção 10.15, “Configuração de Character Set”.

* `--default-character-set=charset_name`

  <table frame="box" rules="all" summary="Propriedades para enable-cleartext-plugin"><tbody><tr><th>Formato Command-Line</th> <td><code>--enable-cleartext-plugin</code></td> </tr><tr><th>Introduzido</th> <td>5.7.10</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Default</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Usa *`charset_name`* como o default character set. Consulte a Seção 10.15, “Configuração de Character Set”. Se nenhum Character Set for especificado, **mysqldump** usa `utf8`.

* `--no-set-names`, `-N`

  <table frame="box" rules="all" summary="Propriedades para enable-cleartext-plugin"><tbody><tr><th>Formato Command-Line</th> <td><code>--enable-cleartext-plugin</code></td> </tr><tr><th>Introduzido</th> <td>5.7.10</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Default</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Desliga a configuração `--set-charset`, o mesmo que especificar `--skip-set-charset`.

* `--set-charset`

  <table frame="box" rules="all" summary="Propriedades para enable-cleartext-plugin"><tbody><tr><th>Formato Command-Line</th> <td><code>--enable-cleartext-plugin</code></td> </tr><tr><th>Introduzido</th> <td>5.7.10</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Default</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Grava `SET NAMES default_character_set` na saída. Esta opção está habilitada por default. Para suprimir a instrução `SET NAMES`, use `--skip-set-charset`.

#### Opções de Replicação

O comando **mysqldump** é frequentemente usado para criar uma instância vazia, ou uma instância que inclui dados, em um replica server em uma Replication configuration. As seguintes opções se aplicam ao despejo e restauração de dados em replication source e replica servers.

* `--apply-slave-statements`

  <table frame="box" rules="all" summary="Propriedades para enable-cleartext-plugin"><tbody><tr><th>Formato Command-Line</th> <td><code>--enable-cleartext-plugin</code></td> </tr><tr><th>Introduzido</th> <td>5.7.10</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Default</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Para um dump de replica produzido com a opção `--dump-slave`, adiciona uma instrução `STOP SLAVE` antes da instrução `CHANGE MASTER TO` e uma instrução `START SLAVE` no final da saída.

* `--delete-master-logs`

  <table frame="box" rules="all" summary="Propriedades para enable-cleartext-plugin"><tbody><tr><th>Formato Command-Line</th> <td><code>--enable-cleartext-plugin</code></td> </tr><tr><th>Introduzido</th> <td>5.7.10</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Default</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Em um source replication server, exclui os binary logs enviando uma instrução `PURGE BINARY LOGS` ao server após realizar a operação de dump. Esta opção requer o privilégio `RELOAD`, bem como privilégios suficientes para executar essa instrução. Esta opção habilita automaticamente `--master-data`.

* `--dump-slave[=value]`

  <table frame="box" rules="all" summary="Propriedades para get-server-public-key"><tbody><tr><th>Formato Command-Line</th> <td><code>--get-server-public-key</code></td> </tr><tr><th>Introduzido</th> <td>5.7.23</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr></tbody></table>

  Esta opção é semelhante a `--master-data`, exceto que é usada para fazer o dump de um replication replica server para produzir um dump file que pode ser usado para configurar outro server como uma replica que tem o mesmo source que o server despejado. Isso faz com que a saída do dump inclua uma instrução `CHANGE MASTER TO` que indica as coordenadas do binary log (nome do arquivo e position) do source da replica despejada. A instrução `CHANGE MASTER TO` lê os valores de `Relay_Master_Log_File` e `Exec_Master_Log_Pos` da saída de `SHOW SLAVE STATUS` e os usa para `MASTER_LOG_FILE` e `MASTER_LOG_POS`, respectivamente. Estas são as coordenadas do source server a partir das quais a replica deve começar a replicar.

  Note

  Inconsistências na sequência de Transactions do relay log que foram executadas podem fazer com que a position errada seja usada. Consulte a Seção 16.4.1.32, “Inconsistências de Replicação e Transaction” para obter mais informações.

  `--dump-slave` faz com que as coordenadas do source sejam usadas em vez daquelas do server despejado, como é feito pela opção `--master-data`. Além disso, especificar esta opção faz com que a opção `--master-data` seja substituída, se usada, e efetivamente ignorada.

  Warning

  Esta opção não deve ser usada se o server onde o dump será aplicado usar `gtid_mode=ON` e `MASTER_AUTOPOSITION=1`.

  O valor da opção é tratado da mesma forma que para `--master-data` (definir nenhum valor ou 1 faz com que uma instrução `CHANGE MASTER TO` seja gravada no dump, definir 2 faz com que a instrução seja gravada, mas envolta em SQL comments) e tem o mesmo efeito que `--master-data` em termos de habilitação ou desabilitação de outras opções e na forma como o Lock é tratado.

  Esta opção faz com que **mysqldump** pare a replica SQL Thread antes do dump e a reinicie novamente depois.

  `--dump-slave` envia uma instrução `SHOW SLAVE STATUS` ao server para obter informações, portanto, requer privilégios suficientes para executar essa instrução.

  Em conjunto com `--dump-slave`, as opções `--apply-slave-statements` e `--include-master-host-port` também podem ser usadas.

* `--include-master-host-port`

  <table frame="box" rules="all" summary="Propriedades para get-server-public-key"><tbody><tr><th>Formato Command-Line</th> <td><code>--get-server-public-key</code></td> </tr><tr><th>Introduzido</th> <td>5.7.23</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr></tbody></table>

  Para a instrução `CHANGE MASTER TO` em um dump de replica produzido com a opção `--dump-slave`, adiciona as opções `MASTER_HOST` e `MASTER_PORT` para o host name e o número da porta TCP/IP do source da replica.

* `--master-data[=value]`

  <table frame="box" rules="all" summary="Propriedades para get-server-public-key"><tbody><tr><th>Formato Command-Line</th> <td><code>--get-server-public-key</code></td> </tr><tr><th>Introduzido</th> <td>5.7.23</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr></tbody></table>

  Use esta opção para fazer o dump de um source replication server para produzir um dump file que pode ser usado para configurar outro server como uma replica do source. Isso faz com que a saída do dump inclua uma instrução `CHANGE MASTER TO` que indica as coordenadas do binary log (nome do arquivo e position) do server despejado. Estas são as coordenadas do source server a partir das quais a replica deve começar a replicar após você carregar o dump file na replica.

  Se o valor da opção for 2, a instrução `CHANGE MASTER TO` é gravada como um SQL comment e, portanto, é apenas informativa; não tem efeito quando o dump file é recarregado. Se o valor da opção for 1, a instrução não é gravada como um comment e entra em vigor quando o dump file é recarregado. Se nenhum valor de opção for especificado, o valor default é 1.

  `--master-data` envia uma instrução `SHOW MASTER STATUS` ao server para obter informações, portanto, requer privilégios suficientes para executar essa instrução. Esta opção também requer o privilégio `RELOAD` e o binary log deve estar habilitado.

  A opção `--master-data` desliga automaticamente `--lock-tables`. Ela também liga `--lock-all-tables`, a menos que `--single-transaction` também seja especificado, caso em que um global read lock é adquirido apenas por um curto período no início do dump (veja a descrição de `--single-transaction`). Em todos os casos, qualquer ação em Logs acontece no momento exato do dump.

  Também é possível configurar uma replica fazendo o dump de uma replica existente do source, usando a opção `--dump-slave`, que substitui `--master-data` e faz com que seja ignorada se ambas as opções forem usadas.

* `--set-gtid-purged=value`

  <table frame="box" rules="all" summary="Propriedades para get-server-public-key"><tbody><tr><th>Formato Command-Line</th> <td><code>--get-server-public-key</code></td> </tr><tr><th>Introduzido</th> <td>5.7.23</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr></tbody></table>

  Esta opção permite controlar as informações de Global Transaction ID (GTID) gravadas no dump file, indicando se deve adicionar uma instrução `SET @@GLOBAL.gtid_purged` à saída. Esta opção também pode fazer com que uma instrução seja gravada na saída que desabilita o binary logging enquanto o dump file está sendo recarregado.

  A tabela a seguir mostra os valores de opção permitidos. O valor default é `AUTO`.

  <table frame="box" rules="all" summary="Propriedades para get-server-public-key"><tbody><tr><th>Formato Command-Line</th> <td><code>--get-server-public-key</code></td> </tr><tr><th>Introduzido</th> <td>5.7.23</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr></tbody></table>

  Um dump parcial de um server que está usando Replication baseada em GTID requer que a opção `--set-gtid-purged={ON|OFF}` seja especificada. Use `ON` se a intenção for implantar uma nova replication replica usando apenas alguns dos dados do server despejado. Use `OFF` se a intenção for reparar uma Table copiando-a dentro de uma Topology. Use `OFF` se a intenção for copiar uma Table entre Replication Topologies que são disjuntas e para que permaneçam assim.

  A opção `--set-gtid-purged` tem o seguinte efeito no binary logging quando o dump file é recarregado:

  + `--set-gtid-purged=OFF`: `SET @@SESSION.SQL_LOG_BIN=0;` não é adicionado à saída.

  + `--set-gtid-purged=ON`: `SET @@SESSION.SQL_LOG_BIN=0;` é adicionado à saída.

  + `--set-gtid-purged=AUTO`: `SET @@SESSION.SQL_LOG_BIN=0;` é adicionado à saída se GTIDs estiverem habilitados no server do qual você está fazendo backup (ou seja, se `AUTO` for avaliado como `ON`).

  O uso desta opção com a opção `--single-transaction` pode levar a inconsistências na saída. Se `--set-gtid-purged=ON` for necessário, ele poderá ser usado com `--lock-all-tables`, mas isso pode impedir Queries paralelas enquanto o **mysqldump** estiver sendo executado.

  Não é recomendado carregar um dump file quando GTIDs estão habilitados no server (`gtid_mode=ON`), se o seu dump file incluir system tables. **mysqldump** emite instruções DML para as system tables que usam o storage engine não-transacional MyISAM, e essa combinação não é permitida quando GTIDs estão habilitados. Esteja ciente também de que carregar um dump file de um server com GTIDs habilitados, em outro server com GTIDs habilitados, faz com que diferentes Transaction Identifiers sejam gerados.

#### Opções de Formato

As seguintes opções especificam como representar o dump file inteiro ou certos tipos de dados no dump file. Elas também controlam se certas informações opcionais são gravadas no dump file.

* `--compact`

  <table frame="box" rules="all" summary="Propriedades para get-server-public-key"><tbody><tr><th>Formato Command-Line</th> <td><code>--get-server-public-key</code></td> </tr><tr><th>Introduzido</th> <td>5.7.23</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr></tbody></table>

  Produz uma saída mais compacta. Esta opção habilita as opções `--skip-add-drop-table`, `--skip-add-locks`, `--skip-comments`, `--skip-disable-keys` e `--skip-set-charset`.

* `--compatible=name`

  <table frame="box" rules="all" summary="Propriedades para get-server-public-key"><tbody><tr><th>Formato Command-Line</th> <td><code>--get-server-public-key</code></td> </tr><tr><th>Introduzido</th> <td>5.7.23</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr></tbody></table>

  Produz uma saída que é mais compatível com outros Database Systems ou com MySQL servers mais antigos. O valor de *`name`* pode ser `ansi`, `mysql323`, `mysql40`, `postgresql`, `oracle`, `mssql`, `db2`, `maxdb`, `no_key_options`, `no_table_options` ou `no_field_options`. Para usar vários valores, separe-os por vírgulas. Estes valores têm o mesmo significado que as opções correspondentes para definir o Server SQL Mode. Consulte a Seção 5.1.10, “Modos SQL do Server”.

  Esta opção não garante compatibilidade com outros servers. Ela apenas habilita os valores de SQL Mode que estão atualmente disponíveis para tornar a saída do dump mais compatível. Por exemplo, `--compatible=oracle` não mapeia data types para tipos Oracle ou usa a sintaxe de comentário Oracle.

* `--complete-insert`, `-c`

  <table frame="box" rules="all" summary="Propriedades para get-server-public-key"><tbody><tr><th>Formato Command-Line</th> <td><code>--get-server-public-key</code></td> </tr><tr><th>Introduzido</th> <td>5.7.23</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr></tbody></table>

  Usa instruções `INSERT` completas que incluem nomes de coluna.

* `--create-options`

  <table frame="box" rules="all" summary="Propriedades para get-server-public-key"><tbody><tr><th>Formato Command-Line</th> <td><code>--get-server-public-key</code></td> </tr><tr><th>Introduzido</th> <td>5.7.23</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr></tbody></table>

  Inclui todas as Table Options específicas do MySQL nas instruções `CREATE TABLE`.

* `--fields-terminated-by=...`, `--fields-enclosed-by=...`, `--fields-optionally-enclosed-by=...`, `--fields-escaped-by=...`

  <table frame="box" rules="all" summary="Propriedades para get-server-public-key"><tbody><tr><th>Formato Command-Line</th> <td><code>--get-server-public-key</code></td> </tr><tr><th>Introduzido</th> <td>5.7.23</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr></tbody></table>

  <table frame="box" rules="all" summary="Propriedades para host"><tbody><tr><th>Formato Command-Line</th> <td><code>--host</code></td> </tr></tbody></table>

  <table frame="box" rules="all" summary="Propriedades para host"><tbody><tr><th>Formato Command-Line</th> <td><code>--host</code></td> </tr></tbody></table>

  <table frame="box" rules="all" summary="Propriedades para host"><tbody><tr><th>Formato Command-Line</th> <td><code>--host</code></td> </tr></tbody></table>

  Estas opções são usadas com a opção `--tab` e têm o mesmo significado que as cláusulas `FIELDS` correspondentes para `LOAD DATA`. Consulte a Seção 13.2.6, “Instrução LOAD DATA”.

* `--hex-blob`

  <table frame="box" rules="all" summary="Propriedades para host"><tbody><tr><th>Formato Command-Line</th> <td><code>--host</code></td> </tr></tbody></table>

  Faz o Dump de colunas binárias usando notação hexadecimal (por exemplo, `'abc'` torna-se `0x616263`). Os data types afetados são `BINARY`, `VARBINARY`, tipos `BLOB`, `BIT`, todos os spatial data types e outros non-binary data types quando usados com o character set `binary`.

  A opção `--hex-blob` é ignorada quando `--tab` é usado.

* `--lines-terminated-by=...`

  <table frame="box" rules="all" summary="Propriedades para host"><tbody><tr><th>Formato Command-Line</th> <td><code>--host</code></td> </tr></tbody></table>

  Esta opção é usada com a opção `--tab` e tem o mesmo significado que a cláusula `LINES` correspondente para `LOAD DATA`. Consulte a Seção 13.2.6, “Instrução LOAD DATA”.

* `--quote-names`, `-Q`

  <table frame="box" rules="all" summary="Propriedades para host"><tbody><tr><th>Formato Command-Line</th> <td><code>--host</code></td> </tr></tbody></table>

  Faz o Quote de Identifiers (como nomes de Database, Table e coluna) dentro de caracteres `` ` ``. Se o SQL Mode `ANSI_QUOTES` estiver habilitado, os Identifiers serão citados dentro de caracteres `"`. Esta opção está habilitada por default. Pode ser desabilitada com `--skip-quote-names`, mas esta opção deve ser fornecida após qualquer opção como `--compatible` que possa habilitar `--quote-names`.

* `--result-file=file_name`, `-r file_name`

  <table frame="box" rules="all" summary="Propriedades para host"><tbody><tr><th>Formato Command-Line</th> <td><code>--host</code></td> </tr></tbody></table>

  Direciona a saída para o arquivo nomeado. O result file é criado e seu conteúdo anterior é sobrescrito, mesmo que ocorra um error durante a geração do dump.

  Esta opção deve ser usada no Windows para evitar que os caracteres newline `\n` sejam convertidos em sequências de carriage return/newline `\r\n`.

* `--tab=dir_name`, `-T dir_name`

  <table frame="box" rules="all" summary="Propriedades para host"><tbody><tr><th>Formato Command-Line</th> <td><code>--host</code></td> </tr></tbody></table>

  Produz data files de texto separados por tabulação. Para cada Table despejada, **mysqldump** cria um arquivo `tbl_name.sql` que contém a instrução `CREATE TABLE` que cria a Table, e o server grava um arquivo `tbl_name.txt` que contém seus dados. O valor da opção é o diretório onde os arquivos devem ser gravados.

  Note

  Esta opção deve ser usada apenas quando **mysqldump** é executado na mesma máquina que o **mysqld** server. Como o server cria arquivos `*.txt` no diretório que você especifica, o diretório deve ser gravável pelo server e a conta MySQL que você usa deve ter o privilégio `FILE`. Como **mysqldump** cria `*.sql` no mesmo diretório, ele deve ser gravável por sua conta de Login do sistema.

  Por default, os data files `.txt` são formatados usando caracteres de tabulação entre os valores das colunas e um newline no final de cada linha. O formato pode ser especificado explicitamente usando as opções `--fields-xxx` e `--lines-terminated-by`.

  Os valores das colunas são convertidos para o Character Set especificado pela opção `--default-character-set`.

* `--tz-utc`

  <table frame="box" rules="all" summary="Propriedades para host"><tbody><tr><th>Formato Command-Line</th> <td><code>--host</code></td> </tr></tbody></table>

  Esta opção permite que colunas `TIMESTAMP` sejam despejadas e recarregadas entre servers em diferentes Time Zones. **mysqldump** define sua connection Time Zone como UTC e adiciona `SET TIME_ZONE='+00:00'` ao dump file. Sem esta opção, as colunas `TIMESTAMP` são despejadas e recarregadas nas Time Zones locais aos servers source e destination, o que pode fazer com que os valores mudem se os servers estiverem em Time Zones diferentes. `--tz-utc` também protege contra mudanças devido ao daylight saving time. `--tz-utc` está habilitada por default. Para desabilitá-la, use `--skip-tz-utc`.

* `--xml`, `-X`

  <table frame="box" rules="all" summary="Propriedades para host"><tbody><tr><th>Formato Command-Line</th> <td><code>--host</code></td> </tr></tbody></table>

  Grava a saída do dump como XML bem formado.

  **Valores `NULL`, `'NULL'` e Vazios**: Para uma coluna chamada *`column_name`*, o valor `NULL`, uma string vazia e o valor string `'NULL'` são distinguidos uns dos outros na saída gerada por esta opção da seguinte forma.

  <table frame="box" rules="all" summary="Propriedades para login-path"><tbody><tr><th>Formato Command-Line</th> <td><code>--login-path=name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  A saída do client **mysql** quando executado usando a opção `--xml` também segue as regras anteriores. (Consulte a Seção 4.5.1.1, “Opções do Cliente mysql”.)

  A saída XML do **mysqldump** inclui o XML namespace, conforme mostrado aqui:

  ```sql
  $> mysqldump --xml -u root world City
  <?xml version="1.0"?>
  <mysqldump xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <database name="world">
  <table_structure name="City">
  <field Field="ID" Type="int(11)" Null="NO" Key="PRI" Extra="auto_increment" />
  <field Field="Name" Type="char(35)" Null="NO" Key="" Default="" Extra="" />
  <field Field="CountryCode" Type="char(3)" Null="NO" Key="" Default="" Extra="" />
  <field Field="District" Type="char(20)" Null="NO" Key="" Default="" Extra="" />
  <field Field="Population" Type="int(11)" Null="NO" Key="" Default="0" Extra="" />
  <key Table="City" Non_unique="0" Key_name="PRIMARY" Seq_in_index="1" Column_name="ID"
  Collation="A" Cardinality="4079" Null="" Index_type="BTREE" Comment="" />
  <options Name="City" Engine="MyISAM" Version="10" Row_format="Fixed" Rows="4079"
  Avg_row_length="67" Data_length="273293" Max_data_length="18858823439613951"
  Index_length="43008" Data_free="0" Auto_increment="4080"
  Create_time="2007-03-31 01:47:01" Update_time="2007-03-31 01:47:02"
  Collation="latin1_swedish_ci" Create_options="" Comment="" />
  </table_structure>
  <table_data name="City">
  <row>
  <field name="ID">1</field>
  <field name="Name">Kabul</field>
  <field name="CountryCode">AFG</field>
  <field name="District">Kabol</field>
  <field name="Population">1780000</field>
  </row>

  ...

  <row>
  <field name="ID">4079</field>
  <field name="Name">Rafah</field>
  <field name="CountryCode">PSE</field>
  <field name="District">Rafah</field>
  <field name="Population">92020</field>
  </row>
  </table_data>
  </database>
  </mysqldump>
  ```

#### Opções de Filtragem

As seguintes opções controlam quais tipos de objetos de schema são gravados no dump file: por categoria, como Triggers ou Events; por nome, por exemplo, escolhendo quais Databases e Tables despejar; ou até mesmo filtrando linhas dos dados da Table usando uma cláusula `WHERE`.

* `--all-databases`, `-A`

  <table frame="box" rules="all" summary="Propriedades para login-path"><tbody><tr><th>Formato Command-Line</th> <td><code>--login-path=name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Faz o Dump de todas as Tables em todas as Databases. Isso é o mesmo que usar a opção `--databases` e nomear todas as Databases na command line.

* `--databases`, `-B`

  <table frame="box" rules="all" summary="Propriedades para login-path"><tbody><tr><th>Formato Command-Line</th> <td><code>--login-path=name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Faz o Dump de várias Databases. Normalmente, **mysqldump** trata o primeiro argumento de nome na command line como um nome de Database e os nomes seguintes como nomes de Table. Com esta opção, ele trata todos os argumentos de nome como nomes de Database. As instruções `CREATE DATABASE` e `USE` são incluídas na saída antes de cada nova Database.

  Esta opção pode ser usada para fazer o dump das Databases `INFORMATION_SCHEMA` e `performance_schema`, que normalmente não são despejadas mesmo com a opção `--all-databases`. (Use também a opção `--skip-lock-tables`.)

* `--events`, `-E`

  <table frame="box" rules="all" summary="Propriedades para login-path"><tbody><tr><th>Formato Command-Line</th> <td><code>--login-path=name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Inclui Events do Event Scheduler para as Databases despejadas na saída. Esta opção requer os privilégios `EVENT` para essas Databases.

  A saída gerada usando `--events` contém instruções `CREATE EVENT` para criar os Events. No entanto, estas instruções não incluem atributos como os Timestamps de criação e modificação do Event, então, quando os Events são recarregados, eles são criados com Timestamps iguais ao tempo de Reload.

  Se você precisar que os Events sejam criados com seus atributos de Timestamp originais, não use `--events`. Em vez disso, faça o dump e recarregue o conteúdo da Table `mysql.event` diretamente, usando uma conta MySQL que tenha privilégios apropriados para a Database `mysql`.

* `--ignore-error=error[,error]...`

  <table frame="box" rules="all" summary="Propriedades para login-path"><tbody><tr><th>Formato Command-Line</th> <td><code>--login-path=name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Ignora os errors especificados. O valor da opção é uma lista de números de error separados por vírgulas, especificando os errors a serem ignorados durante a execução do **mysqldump**. Se a opção `--force` também for fornecida para ignorar todos os errors, `--force` terá precedência.

* `--ignore-table=db_name.tbl_name`

  <table frame="box" rules="all" summary="Propriedades para login-path"><tbody><tr><th>Formato Command-Line</th> <td><code>--login-path=name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Não faz o dump da Table fornecida, que deve ser especificada usando os nomes de Database e Table. Para ignorar múltiplas Tables, use esta opção várias vezes. Esta opção também pode ser usada para ignorar Views.

* `--no-data`, `-d`

  <table frame="box" rules="all" summary="Propriedades para login-path"><tbody><tr><th>Formato Command-Line</th> <td><code>--login-path=name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Não grava nenhuma informação de linha da Table (ou seja, não faz o dump do conteúdo da Table). Isso é útil se você quiser fazer o dump apenas da instrução `CREATE TABLE` para a Table (por exemplo, para criar uma cópia vazia da Table carregando o dump file).

* `--routines`, `-R`

  <table frame="box" rules="all" summary="Propriedades para login-path"><tbody><tr><th>Formato Command-Line</th> <td><code>--login-path=name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Inclui stored routines (procedures e functions) para as Databases despejadas na saída. Esta opção requer o privilégio `SELECT` para a Table `mysql.proc`.

  A saída gerada usando `--routines` contém instruções `CREATE PROCEDURE` e `CREATE FUNCTION` para criar as routines. No entanto, estas instruções não incluem atributos como os Timestamps de criação e modificação da routine, então, quando as routines são recarregadas, elas são criadas com Timestamps iguais ao tempo de Reload.

  Se você precisar que as routines sejam criadas com seus atributos de Timestamp originais, não use `--routines`. Em vez disso, faça o dump e recarregue o conteúdo da Table `mysql.proc` diretamente, usando uma conta MySQL que tenha privilégios apropriados para a Database `mysql`.

* `--tables`

  <table frame="box" rules="all" summary="Propriedades para login-path"><tbody><tr><th>Formato Command-Line</th> <td><code>--login-path=name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Substitui a opção `--databases` ou `-B`. **mysqldump** considera todos os argumentos de nome após a opção como nomes de Table.

* `--triggers`

  <table frame="box" rules="all" summary="Propriedades para login-path"><tbody><tr><th>Formato Command-Line</th> <td><code>--login-path=name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Inclui Triggers para cada Table despejada na saída. Esta opção está habilitada por default; desabilite-a com `--skip-triggers`.

  Para poder fazer o dump dos Triggers de uma Table, você deve ter o privilégio `TRIGGER` para a Table.

  Múltiplos Triggers são permitidos. **mysqldump** faz o dump dos Triggers na Activation Order para que, quando o dump file for recarregado, os Triggers sejam criados na mesma Activation Order. No entanto, se um dump file do **mysqldump** contiver múltiplos Triggers para uma Table que tenham o mesmo Event de Trigger e Action Time, ocorrerá um error nas tentativas de carregar o dump file em um server mais antigo que não suporta múltiplos Triggers. (Para uma solução alternativa, consulte a Seção 2.11.3, “Notas de Downgrade”; você pode converter Triggers para serem compatíveis com servers mais antigos.)

* `--where='where_condition'`, `-w 'where_condition'`

  <table frame="box" rules="all" summary="Propriedades para password"><tbody><tr><th>Formato Command-Line</th> <td><code>--password[=password]</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Faz o Dump apenas das linhas selecionadas pela condição `WHERE` fornecida. Aspas ao redor da condição são obrigatórias se ela contiver espaços ou outros caracteres especiais para o seu command interpreter.

  Exemplos:

  ```sql
  --where="user='jimf'"
  -w"userid>1"
  -w"userid<1"
  ```

#### Opções de Performance

As seguintes opções são as mais relevantes para a performance, particularmente das operações de restore. Para grandes Data Sets, a operação de restore (processar as instruções `INSERT` no dump file) é a parte que consome mais tempo. Quando é urgente restaurar dados rapidamente, planeje e teste a performance desta fase com antecedência. Para tempos de restore medidos em horas, você pode preferir uma solução alternativa de backup e restore, como o MySQL Enterprise Backup para Databases somente `InnoDB` e de uso misto.

A performance também é afetada pelas Opções Transacionais, principalmente para a operação de dump.

* `--disable-keys`, `-K`

  <table frame="box" rules="all" summary="Propriedades para password"><tbody><tr><th>Formato Command-Line</th> <td><code>--password[=password]</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Para cada Table, envolve as instruções `INSERT` com instruções `/*!40000 ALTER TABLE tbl_name DISABLE KEYS */;` e `/*!40000 ALTER TABLE tbl_name ENABLE KEYS */;`. Isso torna o carregamento do dump file mais rápido porque os Indexes são criados após todas as linhas serem inseridas. Esta opção é eficaz apenas para Indexes não exclusivos de Tables `MyISAM`.

* `--extended-insert`, `-e`

  <table frame="box" rules="all" summary="Propriedades para password"><tbody><tr><th>Formato Command-Line</th> <td><code>--password[=password]</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Grava instruções `INSERT` usando sintaxe de múltiplas linhas que inclui várias listas de `VALUES`. Isso resulta em um dump file menor e acelera os inserts quando o arquivo é recarregado.

* `--insert-ignore`

  <table frame="box" rules="all" summary="Propriedades para password"><tbody><tr><th>Formato Command-Line</th> <td><code>--password[=password]</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Grava instruções `INSERT IGNORE` em vez de instruções `INSERT`.

* `--max-allowed-packet=value`

  <table frame="box" rules="all" summary="Propriedades para password"><tbody><tr><th>Formato Command-Line</th> <td><code>--password[=password]</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  O tamanho máximo do Buffer para comunicação client/server. O default é 24MB, o máximo é 1GB.

  Note

  O valor desta opção é específico para **mysqldump** e não deve ser confundido com a variável de sistema `max_allowed_packet` do MySQL server; o valor do server não pode ser excedido por um único Packet do **mysqldump**, independentemente de qualquer configuração para a opção **mysqldump**, mesmo que esta seja maior.

* `--net-buffer-length=value`

  <table frame="box" rules="all" summary="Propriedades para password"><tbody><tr><th>Formato Command-Line</th> <td><code>--password[=password]</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  O tamanho inicial do Buffer para comunicação client/server. Ao criar instruções `INSERT` de múltiplas linhas (como com a opção `--extended-insert` ou `--opt`), **mysqldump** cria linhas de até `--net-buffer-length` bytes de comprimento. Se você aumentar esta variável, certifique-se de que a variável de sistema `net_buffer_length` do MySQL server tenha um valor pelo menos tão grande quanto este.

* `--opt`

  <table frame="box" rules="all" summary="Propriedades para password"><tbody><tr><th>Formato Command-Line</th> <td><code>--password[=password]</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Esta opção, habilitada por default, é uma abreviação para a combinação de `--add-drop-table` `--add-locks` `--create-options` `--disable-keys` `--extended-insert` `--lock-tables` `--quick` `--set-charset`. Ela oferece uma operação de dump rápida e produz um dump file que pode ser recarregado em um MySQL server rapidamente.

  Como a opção `--opt` está habilitada por default, você só especifica o seu inverso, `--skip-opt`, para desativar várias configurações default. Consulte a discussão sobre grupos de opções do `mysqldump` para obter informações sobre como habilitar ou desabilitar seletivamente um subconjunto das opções afetadas por `--opt`.

* `--quick`, `-q`

  <table frame="box" rules="all" summary="Propriedades para password"><tbody><tr><th>Formato Command-Line</th> <td><code>--password[=password]</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Esta opção é útil para fazer o dump de Tables grandes. Ela força **mysqldump** a recuperar linhas para uma Table do server uma linha por vez, em vez de recuperar o conjunto de linhas inteiro e armazená-lo em Buffer na memória antes de gravá-lo.

* `--skip-opt`

  <table frame="box" rules="all" summary="Propriedades para password"><tbody><tr><th>Formato Command-Line</th> <td><code>--password[=password]</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Consulte a descrição da opção `--opt`.

#### Opções Transacionais

As seguintes opções equilibram a performance da operação de dump com a confiabilidade e consistência dos dados exportados.

* `--add-locks`

  <table frame="box" rules="all" summary="Propriedades para password"><tbody><tr><th>Formato Command-Line</th> <td><code>--password[=password]</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Envolve cada dump de Table com instruções `LOCK TABLES` e `UNLOCK TABLES`. Isso resulta em inserts mais rápidos quando o dump file é recarregado. Consulte a Seção 8.2.4.1, “Otimizando Instruções INSERT”.

* `--flush-logs`, `-F`

  <table frame="box" rules="all" summary="Propriedades para pipe"><tbody><tr><th>Formato Command-Line</th> <td><code>--pipe</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Faz o Flush dos log files do MySQL server antes de iniciar o dump. Esta opção requer o privilégio `RELOAD`. Se você usar esta opção em combinação com a opção `--all-databases`, os Logs são submetidos a Flush *para cada Database despejada*. A exceção é ao usar `--lock-all-tables`, `--master-data` ou `--single-transaction`: Neste caso, os Logs são submetidos a Flush apenas uma vez, correspondendo ao momento em que todas as Tables são bloqueadas por `FLUSH TABLES WITH READ LOCK`. Se você quiser que seu dump e o Flush do Log aconteçam exatamente no mesmo momento, você deve usar `--flush-logs` junto com `--lock-all-tables`, `--master-data` ou `--single-transaction`.

* `--flush-privileges`

  <table frame="box" rules="all" summary="Propriedades para pipe"><tbody><tr><th>Formato Command-Line</th> <td><code>--pipe</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Adiciona uma instrução `FLUSH PRIVILEGES` à saída do dump após despejar a Database `mysql`. Esta opção deve ser usada sempre que o dump contiver a Database `mysql` e qualquer outra Database que dependa dos dados na Database `mysql` para restauração adequada.

  Como o dump file contém uma instrução `FLUSH PRIVILEGES`, recarregar o arquivo requer privilégios suficientes para executar essa instrução.

  Note

  Para upgrades para MySQL 5.7 ou superior a partir de versões mais antigas, não use `--flush-privileges`. Para instruções de upgrade neste caso, consulte a Seção 2.10.3, “Mudanças no MySQL 5.7”.

* `--lock-all-tables`, `-x`

  <table frame="box" rules="all" summary="Propriedades para pipe"><tbody><tr><th>Formato Command-Line</th> <td><code>--pipe</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Bloqueia todas as Tables em todas as Databases. Isso é alcançado adquirindo um global read lock pela duração de todo o dump. Esta opção desliga automaticamente `--single-transaction` e `--lock-tables`.

* `--lock-tables`, `-l`

  <table frame="box" rules="all" summary="Propriedades para pipe"><tbody><tr><th>Formato Command-Line</th> <td><code>--pipe</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Para cada Database despejada, bloqueia todas as Tables a serem despejadas antes de despejá-las. As Tables são bloqueadas com `READ LOCAL` para permitir inserts concorrentes no caso de Tables `MyISAM`. Para Tables transacionais, como `InnoDB`, `--single-transaction` é uma opção muito melhor do que `--lock-tables`, pois não precisa bloquear as Tables.

  Como `--lock-tables` bloqueia Tables para cada Database separadamente, esta opção não garante que as Tables no dump file sejam logicamente consistentes entre Databases. Tables em diferentes Databases podem ser despejadas em estados completamente diferentes.

  Algumas opções, como `--opt`, habilitam automaticamente `--lock-tables`. Se você quiser substituir isso, use `--skip-lock-tables` no final da lista de opções.

* `--no-autocommit`

  <table frame="box" rules="all" summary="Propriedades para pipe"><tbody><tr><th>Formato Command-Line</th> <td><code>--pipe</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Envolve as instruções `INSERT` para cada Table despejada em instruções `SET autocommit = 0` e `COMMIT`.

* `--order-by-primary`

  <table frame="box" rules="all" summary="Propriedades para pipe"><tbody><tr><th>Formato Command-Line</th> <td><code>--pipe</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Faz o Dump das linhas de cada Table ordenadas por sua Primary Key, ou por seu primeiro Unique Index, se tal Index existir. Isso é útil ao fazer o dump de uma Table `MyISAM` para ser carregada em uma Table `InnoDB`, mas faz com que a operação de dump demore consideravelmente mais.

* `--shared-memory-base-name=name`

  <table frame="box" rules="all" summary="Propriedades para pipe"><tbody><tr><th>Formato Command-Line</th> <td><code>--pipe</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  No Windows, o nome da Shared-Memory a ser usado para conexões feitas usando Shared Memory para um server local. O valor default é `MYSQL`. O nome da Shared-Memory diferencia maiúsculas de minúsculas.

  Esta opção se aplica apenas se o server foi iniciado com a variável de sistema `shared_memory` habilitada para suportar Shared-Memory Connections.

* `--single-transaction`

  <table frame="box" rules="all" summary="Propriedades para pipe"><tbody><tr><th>Formato Command-Line</th> <td><code>--pipe</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Esta opção define o modo de Transaction Isolation para `REPEATABLE READ` e envia uma instrução `START TRANSACTION` SQL para o server antes de despejar os dados. É útil apenas com Tables transacionais, como `InnoDB`, porque então ele despeja o Consistent State do Database no momento em que `START TRANSACTION` foi emitido sem bloquear quaisquer aplicações.

  O privilégio RELOAD ou FLUSH_TABLES é necessário com `--single-transaction` se ambos gtid_mode=ON e --set-gtid=purged=ON|AUTO. Este requisito foi adicionado no MySQL 8.0.32.

  Ao usar esta opção, você deve ter em mente que apenas Tables `InnoDB` são despejadas em um Consistent State. Por exemplo, quaisquer Tables `MyISAM` ou `MEMORY` despejadas ao usar esta opção ainda podem mudar de estado.

  Enquanto um dump com `--single-transaction` está em processo, para garantir um dump file válido (conteúdo correto da Table e coordenadas do binary log), nenhuma outra conexão deve usar as seguintes instruções: `ALTER TABLE`, `CREATE TABLE`, `DROP TABLE`, `RENAME TABLE`, `TRUNCATE TABLE`. Um Consistent Read não é isolado dessas instruções, portanto, o uso delas em uma Table a ser despejada pode fazer com que o `SELECT` executado por **mysqldump** para recuperar o conteúdo da Table obtenha conteúdo incorreto ou falhe.

  A opção `--single-transaction` e a opção `--lock-tables` são mutuamente exclusivas porque `LOCK TABLES` faz com que quaisquer Transactions pendentes sejam implicitamente commitadas.

  Não é recomendado usar `--single-transaction` juntamente com a opção `--set-gtid-purged`; isso pode levar a inconsistências na saída do **mysqldump**.

  Para fazer o dump de Tables grandes, combine a opção `--single-transaction` com a opção `--quick`.

#### Grupos de Opções

* A opção `--opt` ativa várias configurações que trabalham juntas para realizar uma operação de dump rápida. Todas essas configurações estão ativadas por default, porque `--opt` está ativado por default. Assim, você raramente, se é que alguma vez, especifica `--opt`. Em vez disso, você pode desativar essas configurações como um grupo especificando `--skip-opt` e, opcionalmente, reabilitar certas configurações especificando as opções associadas mais tarde na command line.

* A opção `--compact` desativa várias configurações que controlam se instruções e comentários opcionais aparecem na saída. Novamente, você pode seguir esta opção com outras opções que reabilitam certas configurações, ou ativar todas as configurações usando a forma `--skip-compact`.

Quando você habilita ou desabilita seletivamente o efeito de uma opção de grupo, a ordem é importante porque as opções são processadas da primeira à última. Por exemplo, `--disable-keys` `--lock-tables` `--skip-opt` não teria o efeito pretendido; é o mesmo que `--skip-opt` por si só.

#### Exemplos

Para fazer um backup de uma Database inteira:

```sql
mysqldump db_name > backup-file.sql
```

Para recarregar o dump file de volta no server:

```sql
mysql db_name < backup-file.sql
```

Outra forma de recarregar o dump file:

```sql
mysql -e "source /path-to-backup/backup-file.sql" db_name
```

**mysqldump** também é muito útil para popular Databases copiando dados de um MySQL server para outro:

```sql
mysqldump --opt db_name | mysql --host=remote_host -C db_name
```

Você pode despejar várias Databases com um comando:

```sql
mysqldump --databases db_name1 [db_name2 ...] > my_databases.sql
```

Para despejar todas as Databases, use a opção `--all-databases`:

```sql
mysqldump --all-databases > all_databases.sql
```

Para Tables `InnoDB`, **mysqldump** oferece uma maneira de fazer um Online Backup:

```sql
mysqldump --all-databases --master-data --single-transaction > all_databases.sql
```

Este backup adquire um global read lock em todas as Tables (usando `FLUSH TABLES WITH READ LOCK`) no início do dump. Assim que este Lock for adquirido, as coordenadas do binary log são lidas e o Lock é liberado. Se long updating statements estiverem em execução quando a instrução `FLUSH` for emitida, o MySQL server pode ficar travado até que essas instruções terminem. Depois disso, o dump fica livre de Lock e não perturba Reads e Writes nas Tables. Se as updating statements que o MySQL server recebe forem curtas (em termos de tempo de execução), o período inicial de Lock não deve ser perceptível, mesmo com muitas atualizações.

Para Point-in-Time Recovery (também conhecido como “roll-forward”, quando você precisa restaurar um backup antigo e repetir as mudanças que ocorreram desde esse backup), é frequentemente útil rotacionar o binary log (consulte a Seção 5.4.4, “O Binary Log”) ou pelo menos saber as coordenadas do binary log às quais o dump corresponde:

```sql
mysqldump --all-databases --master-data=2 > all_databases.sql
```

Ou:

```sql
mysqldump --all-databases --flush-logs --master-data=2 > all_databases.sql
```

As opções `--master-data` e `--single-transaction` podem ser usadas simultaneamente, o que fornece uma maneira conveniente de fazer um Online Backup adequado para uso antes do Point-in-Time Recovery se as Tables estiverem armazenadas usando o storage engine `InnoDB`.

Para obter mais informações sobre como fazer backups, consulte a Seção 7.2, “Métodos de Backup de Database”, e a Seção 7.3, “Exemplo de Estratégia de Backup e Recovery”.

* Para selecionar o efeito de `--opt`, exceto para alguns recursos, use a opção `--skip` para cada recurso. Para desabilitar extended inserts e Buffer de memória, use `--opt` `--skip-extended-insert` `--skip-quick`. (Na verdade, `--skip-extended-insert` `--skip-quick` é suficiente porque `--opt` está ativado por default.)

* Para reverter `--opt` para todos os recursos, exceto desabilitação de Index e Table Locking, use `--skip-opt` `--disable-keys` `--lock-tables`.

#### Restrições

**mysqldump** não faz o dump dos schemas `INFORMATION_SCHEMA`, `performance_schema` ou `sys` por default. Para fazer o dump de qualquer um deles, nomeie-os explicitamente na command line. Você também pode nomeá-los com a opção `--databases`. Para `INFORMATION_SCHEMA` e `performance_schema`, use também a opção `--skip-lock-tables`.

**mysqldump** não faz o dump da Database de informações NDB Cluster `ndbinfo`.

**mysqldump** não faz o dump das instruções `CREATE TABLESPACE` do `InnoDB`.

**mysqldump** sempre remove o SQL Mode `NO_AUTO_CREATE_USER`, pois `NO_AUTO_CREATE_USER` não é compatível com o MySQL 8.0. Ele permanece removido mesmo ao importar de volta para o MySQL 5.7, o que significa que stored routines podem se comportar de forma diferente após restaurar um dump se dependerem deste sql_mode em particular. Ele é removido a partir do **mysqldump** 5.7.24.

Não é recomendado restaurar a partir de um dump feito usando **mysqldump** para um server MySQL 5.6.9 ou anterior que tenha GTIDs habilitados. Consulte a Seção 16.1.3.6, “Restrições sobre Replicação com GTIDs”.

**mysqldump** inclui instruções para recriar as Tables `general_log` e `slow_query_log` para dumps da Database `mysql`. O conteúdo das Log Tables não é despejado.

Se você encontrar problemas ao fazer backup de Views devido a privilégios insuficientes, consulte a Seção 23.9, “Restrições sobre Views” para uma solução alternativa.