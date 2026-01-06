### 4.5.6 mysqlpump — Um programa de backup de banco de dados

- Sintaxe de Invocação de mysqlpump
- Resumo da opção mysqlpump
- mysqlpump Descrições de Opções
- mysqlpump Seleção de objeto
- mysqlpump Processamento Paralelo
- mysqlpump Restrições

A ferramenta de cliente **mysqlpump** realiza backups lógicos, produzindo um conjunto de instruções SQL que podem ser executadas para reproduzir as definições originais dos objetos do banco de dados e os dados das tabelas. Ela descarrega um ou mais bancos de dados MySQL para backup ou transferência para outro servidor SQL.

As características do **mysqlpump** incluem:

- Processamento paralelo de bancos de dados e de objetos dentro deles para acelerar o processo de dump

- Melhor controle sobre quais bancos de dados e objetos de banco de dados (tabelas, programas armazenados, contas de usuário) devem ser descarregados

- Lançamento de contas de usuários como declarações de gerenciamento de contas (`CREATE USER`, `GRANT`) em vez de como inserções no banco de dados do sistema `mysql`

- Capacidade de criar saída comprimida

- Indicador de progresso (os valores são estimativas)

- Para a recarga de arquivos de dump, criação de índice secundário mais rápida para tabelas `InnoDB` ao adicionar índices após as linhas serem inseridas

O **mysqlpump** exige pelo menos o privilégio `SELECT` para tabelas descarregadas, `SHOW VIEW` para vistas descarregadas, `TRIGGER` para gatilhos descarregados e `LOCK TABLES` se a opção `--single-transaction` não for usada. O privilégio `SELECT` no banco de dados do sistema `mysql` é necessário para descarregar definições de usuário. Algumas opções podem exigir outros privilégios, conforme indicado nas descrições das opções.

Para recarregar um arquivo de dump, você deve ter os privilégios necessários para executar as instruções que ele contém, como os privilégios de `CREATE` apropriados para objetos criados por essas instruções.

Nota

Um dump feito usando o PowerShell no Windows com redirecionamento de saída cria um arquivo com codificação UTF-16:

```sql
mysqlpump [options] > dump.sql
```

No entanto, o UTF-16 não é permitido como conjunto de caracteres de conexão (consulte a Seção 10.4, “Conjunto de caracteres de conexão e colagens”), então o arquivo de dump não é carregado corretamente. Para contornar esse problema, use a opção `--result-file`, que cria a saída no formato ASCII:

```sql
mysqlpump [options] --result-file=dump.sql
```

#### Sintaxe de Invocação de mysqlpump

Por padrão, o **mysqlpump** exibe todos os bancos de dados (com certas exceções mencionadas nas restrições do mysqlpump). Para especificar esse comportamento explicitamente, use a opção `--all-databases`:

```sql
mysqlpump --all-databases
```

Para descartar um único banco de dados ou certas tabelas dentro desse banco de dados, nomeie o banco de dados na linha de comando, opcionalmente seguido pelos nomes das tabelas:

```sql
mysqlpump db_name
mysqlpump db_name tbl_name1 tbl_name2 ...
```

Para tratar todos os argumentos de nome como nomes de banco de dados, use a opção `--databases`:

```sql
mysqlpump --databases db_name1 db_name2 ...
```

Por padrão, o **mysqlpump** não exclui as definições das contas de usuário, mesmo que você exclua o banco de dados do sistema `mysql` que contém as tabelas de concessão. Para excluir o conteúdo das tabelas de concessão como definições lógicas na forma de instruções `CREATE USER` e `GRANT`, use a opção `--users` e suprima todo o descarte do banco de dados:

```sql
mysqlpump --exclude-databases=% --users
```

No comando anterior, `%` é um caractere curinga que corresponde a todos os nomes de banco de dados para a opção `--exclude-databases`.

O **mysqlpump** suporta várias opções para incluir ou excluir bancos de dados, tabelas, programas armazenados e definições de usuários. Veja Seleção de Objetos do mysqlpump.

Para recarregar um arquivo de dump, execute as instruções que ele contém. Por exemplo, use o cliente **mysql**:

```sql
mysqlpump [options] > dump.sql
mysql < dump.sql
```

A discussão a seguir fornece exemplos adicionais de uso do **mysqlpump**.

Para ver uma lista das opções suportadas pelo **mysqlpump**, execute o comando **mysqlpump --help**.

#### Resumo da opção mysqlpump

O **mysqlpump** suporta as seguintes opções, que podem ser especificadas na linha de comando ou nos grupos **\[mysqlpump]** e **\[client]** de um arquivo de opções. (Antes do MySQL 5.7.30, o **mysqlpump** lia o grupo **\[mysql\_dump]** em vez de **\[mysqlpump]**. A partir do MySQL 5.7.30, **\[mysql\_dump]** ainda é aceito, mas está desatualizado.) Para obter informações sobre os arquivos de opções usados pelos programas do MySQL, consulte a Seção 4.2.2.2, “Usando arquivos de opções”.

**Tabela 4.18 Opções do mysqlpump**

<table frame="box" rules="all" summary="Opções de linha de comando disponíveis para o mysqlpump."><col style="width: 31%"/><col style="width: 56%"/><col style="width: 12%"/><thead><tr><th scope="col">Nome da Opção</th> <th scope="col">Descrição</th> <th scope="col">Introduzido</th> </tr></thead><tbody><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_add-drop-database">--add-drop-database</a></th> <td>Adicione a instrução DROP DATABASE antes de cada instrução CREATE DATABASE</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_add-drop-table">--add-drop-table</a></th> <td>Adicione a declaração DROP TABLE antes de cada declaração CREATE TABLE</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_add-drop-user">--add-drop-user</a></th> <td>Adicione a declaração DROP USER antes de cada declaração CREATE USER</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_add-locks">--add-locks</a></th> <td>Cerque cada dump de tabela com as instruções LOCK TABLES e UNLOCK TABLES</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_all-databases">--all-databases</a></th> <td>Descarregue todas as bases de dados</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_bind-address">--bind-address</a></th> <td>Use a interface de rede especificada para se conectar ao servidor MySQL</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_character-sets-dir">--sets-de-caracteres-dir</a></th> <td>Diretório onde os conjuntos de caracteres são instalados</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_complete-insert">--complete-insert</a></th> <td>Use instruções INSERT completas que incluam os nomes das colunas</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_compress">--compress</a></th> <td>Compressar todas as informações enviadas entre o cliente e o servidor</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_compress-output">--compress-output</a></th> <td>Algoritmo de compressão de saída</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_databases">--databases</a></th> <td>Interprete todos os argumentos de nome como nomes de banco de dados</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_debug">--debug</a></th> <td>Escreva o log de depuração</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_debug-check">--debug-check</a></th> <td>Imprimir informações de depuração quando o programa sai</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_debug-info">--debug-info</a></th> <td>Imprimir informações de depuração, memória e estatísticas da CPU quando o programa sai</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_default-auth">--default-auth</a></th> <td>Plugin de autenticação a ser usado</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_default-character-set">--default-character-set</a></th> <td>Especifique o conjunto de caracteres padrão</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_default-parallelism">--default-parallelism</a></th> <td>Número padrão de threads para processamento paralelo</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_defaults-extra-file">--defaults-extra-file</a></th> <td>Leia o arquivo de opção nomeado, além dos arquivos de opção usuais</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_defaults-file">--defaults-file</a></th> <td>Arquivo de opção de leitura apenas nomeado</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_defaults-group-suffix">--defaults-group-suffix</a></th> <td>Valor do sufixo do grupo de opções</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_defer-table-indexes">--defer-table-indexes</a></th> <td>Para recarregar, adiar a criação do índice até depois de carregar as linhas da tabela</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_events">--eventos</a></th> <td>Eventos de descarte de bancos de dados descartados</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_exclude-databases">--exclude-databases</a></th> <td>Bases de dados a excluir do dump</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_exclude-events">--exclude-events</a></th> <td>Eventos a serem excluídos do lixo eletrônico</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_exclude-routines">--exclude-routines</a></th> <td>Rotinas para excluir do dump</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_exclude-tables">--exclude-tables</a></th> <td>Tabelas para excluir do dump</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_exclude-triggers">--exclude-triggers</a></th> <td>Triggers para excluir do dump</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_exclude-users">--exclude-users</a></th> <td>Usuários a serem excluídos do dump</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_extended-insert">--insert-extended</a></th> <td>Use a sintaxe de inserção de várias linhas</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_get-server-public-key">--get-server-public-key</a></th> <td>Solicitar chave pública RSA do servidor</td> <td>5.7.23</td> </tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_help">--help</a></th> <td>Exibir mensagem de ajuda e sair</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_hex-blob">--hex-blob</a></th> <td>Expor colunas binárias usando notação hexadecimal</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_host">--host</a></th> <td>Anfitrião no qual o servidor MySQL está localizado</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_include-databases">--include-databases</a></th> <td>Bases de dados a incluir no dump</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_include-events">--include-events</a></th> <td>Eventos a incluir no lixo</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_include-routines">--include-routines</a></th> <td>Rotinas a serem incluídas no descarte</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_include-tables">--include-tables</a></th> <td>Tabelas a serem incluídas no dump</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_include-triggers">--include-triggers</a></th> <td>Triggers para incluir no dump</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_include-users">--include-users</a></th> <td>Usuários a serem incluídos no dump</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_insert-ignore">--inserir-ignorar</a></th> <td>Escreva INSERT IGNORE em vez de instruções INSERT</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_log-error-file">--log-error-file</a></th> <td>Adicione avisos e erros a um arquivo nomeado</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_login-path">--login-path</a></th> <td>Leia as opções de caminho de login a partir de .mylogin.cnf</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_max-allowed-packet">--max-allowed-packet</a></th> <td>Comprimento máximo do pacote para enviar ou receber do servidor</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_net-buffer-length">--net-buffer-length</a></th> <td>Tamanho do buffer para comunicação TCP/IP e socket</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_no-create-db">--no-create-db</a></th> <td>Não escreva declarações CREATE DATABASE</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_no-create-info">--no-create-info</a></th> <td>Não escreva declarações CREATE TABLE que recriem cada tabela descarregada</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_no-defaults">--no-defaults</a></th> <td>Não ler arquivos de opção</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_parallel-schemas">--schemas-paralelas</a></th> <td>Especificar paralelismo no processamento de esquema</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_password">--senha</a></th> <td>Senha para usar ao se conectar ao servidor</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_plugin-dir">--plugin-dir</a></th> <td>Diretório onde os plugins são instalados</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_port">--port</a></th> <td>Número de porta TCP/IP para a conexão</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_print-defaults">--print-defaults</a></th> <td>Opções padrão de impressão</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_protocol">--protocolo</a></th> <td>Protocolo de transporte a ser utilizado</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_replace">--replace</a></th> <td>Escreva declarações REPLACE em vez de declarações INSERT</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_result-file">--result-file</a></th> <td>Saída direta para um arquivo específico</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_routines">--rotinas</a></th> <td>Expor rotinas armazenadas (procedimentos e funções) de bancos de dados expostos</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_secure-auth">--secure-auth</a></th> <td>Não envie senhas para o servidor no formato antigo (pré-4.1)</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_server-public-key-path">--server-public-key-path</a></th> <td>Nome do caminho para o arquivo que contém a chave pública RSA</td> <td>5.7.23</td> </tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_set-charset">--set-charset</a></th> <td>Adicione SET NAMES default_character_set ao output</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_set-gtid-purged">--set-gtid-purged</a></th> <td>Se adicionar SET @@GLOBAL.GTID_PURGED ao output</td> <td>5.7.18</td> </tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_single-transaction">--single-transaction</a></th> <td>Tabelas de descarte dentro de uma única transação</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_skip-definer">--skip-definer</a></th> <td>Omitar as cláusulas DEFINER e SQL SECURITY das declarações CREATE de views e programas armazenados</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_skip-dump-rows">--skip-dump-rows</a></th> <td>Não descarte linhas de tabela</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_socket">--socket</a></th> <td>Arquivo de soquete Unix ou tubo nomeado do Windows a ser usado</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_ssl">--ssl</a></th> <td>Ative a criptografia de conexão</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_ssl">--ssl-ca</a></th> <td>Arquivo que contém a lista de Autoridades de Certificação SSL confiáveis</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_ssl">--ssl-capath</a></th> <td>Diretório que contém arquivos de certificados de Autoridade de Certificação SSL confiáveis</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_ssl">--ssl-cert</a></th> <td>Arquivo que contém o certificado X.509</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_ssl">--ssl-cipher</a></th> <td>Cifras permitidas para criptografia de conexão</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_ssl">--ssl-crl</a></th> <td>Arquivo que contém listas de revogação de certificados</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_ssl">--ssl-crlpath</a></th> <td>Diretório que contém arquivos de lista de revogação de certificados</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_ssl">--ssl-chave</a></th> <td>Arquivo que contém a chave X.509</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_ssl">--ssl-mode</a></th> <td>Estado de segurança desejado da conexão com o servidor</td> <td>5.7.11</td> </tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_ssl">--ssl-verify-server-cert</a></th> <td>Verifique o nome do host contra a identidade do Nome comum do certificado do servidor</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_tls-version">--tls-version</a></th> <td>Protocolos TLS permitidos para conexões criptografadas</td> <td>5.7.10</td> </tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_triggers">--triggers</a></th> <td>Triggers para descarte de cada tabela descartada</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_tz-utc">--tz-utc</a></th> <td>Adicione SET TIME_ZONE='+00:00' ao arquivo de dump</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_user">--user</a></th> <td>Nome do usuário do MySQL a ser usado ao se conectar ao servidor</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_users">--users</a></th> <td>Excluir contas de usuário</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_version">--version</a></th> <td>Exibir informações da versão e sair</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_watch-progress">--watch-progress</a></th> <td>Indicador de progresso exibido</td> <td></td> </tr></tbody></table>

#### mysqlpump Descrições de Opções

- `--help`, `-?`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--help</code>]]</td> </tr></tbody></table>

  Exiba uma mensagem de ajuda e saia.

- `--add-drop-database`

  <table frame="box" rules="all" summary="Propriedades para adicionar ou remover banco de dados"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--add-drop-database</code>]]</td> </tr></tbody></table>

  Escreva uma instrução `DROP DATABASE` antes de cada instrução `CREATE DATABASE`.

- `--add-drop-table`

  <table frame="box" rules="all" summary="Propriedades para adicionar ou remover tabela"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--add-drop-table</code>]]</td> </tr></tbody></table>

  Escreva uma declaração `DROP TABLE` antes de cada declaração `CREATE TABLE`.

- `--add-drop-user`

  <table frame="box" rules="all" summary="Propriedades para adicionar ou remover usuários"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--add-drop-user</code>]]</td> </tr></tbody></table>

  Escreva uma declaração `DROP USER` antes de cada declaração `CREATE USER`.

- `--add-locks`

  <table frame="box" rules="all" summary="Propriedades para bloqueios adicionais"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--add-locks</code>]]</td> </tr></tbody></table>

  Cerque cada dump de tabela com as instruções `LOCK TABLES` e `UNLOCK TABLES`. Isso resulta em inserções mais rápidas quando o arquivo de dump é recarregado. Veja a Seção 8.2.4.1, “Otimizando instruções INSERT”.

  Esta opção não funciona com paralelismo porque as instruções `INSERT` de diferentes tabelas podem ser intercaladas e o `UNLOCK TABLES` após o final das inserções de uma tabela pode liberar bloqueios em tabelas para as quais as inserções ainda estão em andamento.

  `--add-locks` e `--single-transaction` são mutuamente exclusivos.

- `--all-databases`, `-A`

  <table frame="box" rules="all" summary="Propriedades para todos os bancos de dados"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--all-databases</code>]]</td> </tr></tbody></table>

  Exclua todas as bases de dados (com certas exceções mencionadas nas restrições do mysqlpump). Esse é o comportamento padrão, a menos que outro seja especificado explicitamente.

  `--all-databases` e `--databases` são mutuamente exclusivos.

- `--bind-address=ip_address`

  <table frame="box" rules="all" summary="Propriedades para endereço de ligação"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--bind-address=ip_address</code>]]</td> </tr></tbody></table>

  Em um computador com várias interfaces de rede, use esta opção para selecionar qual interface usar para se conectar ao servidor MySQL.

- `--character-sets-dir=caminho`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=dir_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>

  O diretório onde os conjuntos de caracteres são instalados. Consulte a Seção 10.15, “Configuração de Conjunto de Caracteres”.

- `--complete-insert`

  <table frame="box" rules="all" summary="Propriedades para inserção completa"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--complete-insert</code>]]</td> </tr></tbody></table>

  Escreva declarações `INSERT` completas que incluam os nomes das colunas.

- `--compress`, `-C`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--help</code>]]</td> </tr></tbody></table>0

  Compressa todas as informações enviadas entre o cliente e o servidor, se possível. Consulte a Seção 4.2.6, “Controle de Compressão de Conexão”.

- `--compress-output=algorithm`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--help</code>]]</td> </tr></tbody></table>1

  Por padrão, o **mysqlpump** não comprime a saída. Esta opção especifica a compressão da saída usando o algoritmo especificado. Os algoritmos permitidos são `LZ4` e `ZLIB`.

  Para descomprimir a saída compactada, você deve ter um utilitário apropriado. Se os comandos do sistema **lz4** e **openssl zlib** não estiverem disponíveis, a partir do MySQL 5.7.10, as distribuições do MySQL incluem os utilitários **lz4\_decompress** e **zlib\_decompress** que podem ser usados para descomprimir a saída do **mysqlpump** que foi compactada usando as opções `--compress-output=LZ4` e `--compress-output=ZLIB`. Para mais informações, consulte a Seção 4.8.1, “lz4\_decompress — Descomprima a saída compactada do mysqlpump em LZ4”, e a Seção 4.8.5, “zlib\_decompress — Descomprima a saída compactada do mysqlpump em ZLIB”.

  As alternativas incluem os comandos **lz4** e `openssl`, se estiverem instalados no seu sistema. Por exemplo, o **lz4** pode descomprimir a saída do **LZ4**:

  ```sql
  lz4 -d input_file output_file
  ```

  A saída do `ZLIB` pode ser descomprimida da seguinte forma:

  ```sql
  openssl zlib -d < input_file > output_file
  ```

- `--databases`, `-B`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--help</code>]]</td> </tr></tbody></table>2

  Normalmente, o **mysqlpump** trata o argumento de nome no comando da linha como um nome de banco de dados e quaisquer nomes subsequentes como nomes de tabelas. Com esta opção, ele trata todos os argumentos de nome como nomes de banco de dados. As instruções `CREATE DATABASE` são incluídas na saída antes de cada novo banco de dados.

  `--all-databases` e `--databases` são mutuamente exclusivos.

- `--debug[=opções_de_depuração]`, `-# [opções_de_depuração]`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--help</code>]]</td> </tr></tbody></table>3

  Escreva um log de depuração. Uma string típica de *`debug_options`* é `d:t:o,nome_do_arquivo`. O padrão é `d:t:O,/tmp/mysqlpump.trace`.

  Esta opção está disponível apenas se o MySQL foi compilado com `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são compilados com esta opção.

- `--debug-check`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--help</code>]]</td> </tr></tbody></table>4

  Imprima algumas informações de depuração quando o programa sair.

  Esta opção está disponível apenas se o MySQL foi compilado com `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são compilados com esta opção.

- `--debug-info`, `-T`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--help</code>]]</td> </tr></tbody></table>5

  Imprima informações de depuração, estatísticas de uso de memória e CPU quando o programa sair.

  Esta opção está disponível apenas se o MySQL foi compilado com `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são compilados com esta opção.

- `--default-auth=plugin`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--help</code>]]</td> </tr></tbody></table>6

  Uma dica sobre qual plugin de autenticação do lado do cliente deve ser usado. Veja a Seção 6.2.13, “Autenticação Personalizável”.

- `--default-character-set=charset_name`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--help</code>]]</td> </tr></tbody></table>7

  Use *`charset_name`* como o conjunto de caracteres padrão. Veja a Seção 10.15, “Configuração do Conjunto de Caracteres”. Se nenhum conjunto de caracteres for especificado, o **mysqlpump** usa `utf8`.

- `--default-parallelism=N`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--help</code>]]</td> </tr></tbody></table>8

  O número padrão de threads para cada fila de processamento paralelo. O padrão é 2.

  A opção `--parallel-schemas` também afeta o paralelismo e pode ser usada para substituir o número padrão de threads. Para mais informações, consulte o processamento paralelo do mysqlpump.

  Com `--default-parallelism=0` e sem as opções `--parallel-schemas`, o **mysqlpump** funciona como um processo de fluxo único e não cria filas.

  Com o paralelismo ativado, é possível intercalar a saída de diferentes bancos de dados.

  Nota

  Antes do MySQL 5.7.11, o uso da opção `--single-transaction` é mutuamente exclusivo com o paralelismo. Para usar `--single-transaction`, desative o paralelismo configurando `--default-parallelism` para 0 e não usando nenhuma instância de `--parallel-schemas`:

  ```sql
  mysqlpump --single-transaction --default-parallelism=0
  ```

- `--defaults-extra-file=nome_do_arquivo`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--help</code>]]</td> </tr></tbody></table>9

  Leia este arquivo de opção após o arquivo de opção global, mas (no Unix) antes do arquivo de opção do usuário. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--defaults-file=nome_do_arquivo`

  <table frame="box" rules="all" summary="Propriedades para adicionar ou remover banco de dados"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--add-drop-database</code>]]</td> </tr></tbody></table>0

  Use apenas o arquivo de opção fornecido. Se o arquivo não existir ou estiver inacessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

  Exceção: Mesmo com `--defaults-file`, os programas cliente leem `.mylogin.cnf`.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--defaults-group-suffix=str`

  <table frame="box" rules="all" summary="Propriedades para adicionar ou remover banco de dados"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--add-drop-database</code>]]</td> </tr></tbody></table>1

  Leia não apenas os grupos de opções usuais, mas também grupos com os nomes usuais e um sufixo de *`str`*. Por exemplo, **mysqlpump** normalmente lê os grupos `[client]` e `[mysqlpump]`. Se esta opção for fornecida como `--defaults-group-suffix=_other`, **mysqlpump** também lê os grupos `[client_other]` e `[mysqlpump_other]`.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--defer-table-indexes`

  <table frame="box" rules="all" summary="Propriedades para adicionar ou remover banco de dados"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--add-drop-database</code>]]</td> </tr></tbody></table>2

  Na saída de dump, adiar a criação do índice para cada tabela até que suas linhas tenham sido carregadas. Isso funciona para todos os motores de armazenamento, mas para o `InnoDB`, aplica-se apenas para índices secundários.

  Esta opção está habilitada por padrão; use `--skip-defer-table-indexes` para desabilitá-la.

- `--eventos`

  <table frame="box" rules="all" summary="Propriedades para adicionar ou remover banco de dados"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--add-drop-database</code>]]</td> </tr></tbody></table>3

  Inclua os eventos do Agendamento de Eventos para as bases de dados descartadas na saída. O descarte de eventos requer os privilégios `EVENT` para essas bases de dados.

  A saída gerada usando `--events` contém instruções `CREATE EVENT` para criar os eventos. No entanto, essas instruções não incluem atributos como os timestamps de criação e modificação do evento, então, quando os eventos são recarregados, eles são criados com timestamps iguais ao tempo de recarga.

  Se você precisar criar eventos com seus atributos de data e hora originais, não use `--events`. Em vez disso, faça o dump e o reload do conteúdo da tabela `mysql.event` diretamente, usando uma conta MySQL que tenha os privilégios apropriados para o banco de dados `mysql`.

  Esta opção está habilitada por padrão; use `--skip-events` para desabilitá-la.

- `--exclude-databases=db_list`

  <table frame="box" rules="all" summary="Propriedades para adicionar ou remover banco de dados"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--add-drop-database</code>]]</td> </tr></tbody></table>4

  Não descarte os bancos de dados em *`db_list`*, que é uma lista de um ou mais nomes de bancos de dados separados por vírgula. Instâncias múltiplas desta opção são aditivas. Para mais informações, consulte Seleção de Objetos do mysqlpump.

- `--exclude-events=lista_eventos`

  <table frame="box" rules="all" summary="Propriedades para adicionar ou remover banco de dados"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--add-drop-database</code>]]</td> </tr></tbody></table>5

  Não descarte os bancos de dados em *`event_list`*, que é uma lista de um ou mais nomes de eventos separados por vírgula. Instâncias múltiplas desta opção são aditivas. Para mais informações, consulte Seleção de Objetos do mysqlpump.

- `--exclude-routines=routine_list`

  <table frame="box" rules="all" summary="Propriedades para adicionar ou remover banco de dados"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--add-drop-database</code>]]</td> </tr></tbody></table>6

  Não descarte os eventos na *`routine_list`*, que é uma lista de um ou mais nomes de rotinas separados por vírgula (procedimento armazenado ou função). Instâncias múltiplas desta opção são aditivas. Para mais informações, consulte Seleção de Objeto mysqlpump.

- `--exclude-tables=lista_de_tabelas`

  <table frame="box" rules="all" summary="Propriedades para adicionar ou remover banco de dados"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--add-drop-database</code>]]</td> </tr></tbody></table>7

  Não descarte as tabelas em *`table_list`*, que é uma lista de um ou mais nomes de tabelas separados por vírgula. Instâncias múltiplas desta opção são aditivas. Para mais informações, consulte Seleção de Objetos do mysqlpump.

- `--exclude-triggers=trigger_list`

  <table frame="box" rules="all" summary="Propriedades para adicionar ou remover banco de dados"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--add-drop-database</code>]]</td> </tr></tbody></table>8

  Não descarte os gatilhos na lista de gatilhos *`trigger_list`*, que é uma lista de um ou mais nomes de gatilho separados por vírgula. Instâncias múltiplas desta opção são aditivas. Para mais informações, consulte Seleção de Objeto mysqlpump.

- `--exclude-users=user_list`

  <table frame="box" rules="all" summary="Propriedades para adicionar ou remover banco de dados"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--add-drop-database</code>]]</td> </tr></tbody></table>9

  Não descarte as contas de usuário no *`user_list`*, que é uma lista de um ou mais nomes de contas separados por vírgula. Instâncias múltiplas desta opção são aditivas. Para mais informações, consulte Seleção de Objetos do mysqlpump.

- `--extended-insert=N`

  <table frame="box" rules="all" summary="Propriedades para adicionar ou remover tabela"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--add-drop-table</code>]]</td> </tr></tbody></table>0

  Escreva instruções `INSERT` usando a sintaxe de múltiplas linhas que inclui várias listas `VALUES`. Isso resulta em um arquivo de dump menor e acelera as inserções quando o arquivo é carregado novamente.

  O valor da opção indica o número de linhas a serem incluídas em cada instrução `INSERT`. O padrão é 250. Um valor de 1 produz uma instrução `INSERT` por linha da tabela.

- `--get-server-public-key`

  <table frame="box" rules="all" summary="Propriedades para adicionar ou remover tabela"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--add-drop-table</code>]]</td> </tr></tbody></table>1

  Peça à rede o par de chaves públicas necessário para a troca de senhas com base em pares de chaves RSA. Esta opção aplica-se a clientes que se autenticam com o plugin de autenticação `caching_sha2_password`. Para esse plugin, o servidor não envia a chave pública a menos que seja solicitado. Esta opção é ignorada para contas que não se autenticam com esse plugin. Também é ignorada se a troca de senha com base em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

  Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele terá precedência sobre `--get-server-public-key`.

  Para obter informações sobre o plugin `caching_sha2_password`, consulte a Seção 6.4.1.4, “Cacheamento de Autenticação Conectada SHA-2”.

  A opção `--get-server-public-key` foi adicionada no MySQL 5.7.23.

- `--hex-blob`

  <table frame="box" rules="all" summary="Propriedades para adicionar ou remover tabela"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--add-drop-table</code>]]</td> </tr></tbody></table>2

  Arrume colunas binárias usando notação hexadecimal (por exemplo, `'abc'` se torna `0x616263`). Os tipos de dados afetados são os tipos `BINARY`, `VARBINARY`, `BLOB`, `BIT`, todos os tipos de dados espaciais e outros tipos de dados não binários quando usados com o conjunto de caracteres `binary`.

- `--host=host_name`, `-h host_name`

  <table frame="box" rules="all" summary="Propriedades para adicionar ou remover tabela"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--add-drop-table</code>]]</td> </tr></tbody></table>3

  Arraste os dados do servidor MySQL para o host fornecido.

- `--include-databases=db_list`

  <table frame="box" rules="all" summary="Propriedades para adicionar ou remover tabela"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--add-drop-table</code>]]</td> </tr></tbody></table>4

  Arrume os bancos de dados em *`db_list`*, que é uma lista de um ou mais nomes de bancos de dados separados por vírgula. O dump inclui todos os objetos nos bancos de dados nomeados. Instâncias múltiplas desta opção são aditivas. Para mais informações, consulte Seleção de Objetos do mysqlpump.

- `--include-events=event_list`

  <table frame="box" rules="all" summary="Propriedades para adicionar ou remover tabela"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--add-drop-table</code>]]</td> </tr></tbody></table>5

  Exclua os eventos em *`event_list`*, que é uma lista de um ou mais nomes de eventos separados por vírgula. Instâncias múltiplas desta opção são aditivas. Para mais informações, consulte Seleção de Objetos do mysqlpump.

- `--include-routines=lista_rotinas`

  <table frame="box" rules="all" summary="Propriedades para adicionar ou remover tabela"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--add-drop-table</code>]]</td> </tr></tbody></table>6

  Exclua as rotinas na lista de rotinas, que é uma lista de um ou mais nomes de rotinas (procedimentos armazenados ou funções) separados por vírgula. Instâncias múltiplas desta opção são aditivas. Para obter mais informações, consulte Seleção de Objetos do mysqlpump.

- `--include-tables=lista_de_tabelas`

  <table frame="box" rules="all" summary="Propriedades para adicionar ou remover tabela"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--add-drop-table</code>]]</td> </tr></tbody></table>7

  Exclua as tabelas em `table_list`, que é uma lista de um ou mais nomes de tabelas separados por vírgula. Instâncias múltiplas desta opção são aditivas. Para mais informações, consulte Seleção de Objetos do mysqlpump.

- `--include-triggers=lista_de_triggers`

  <table frame="box" rules="all" summary="Propriedades para adicionar ou remover tabela"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--add-drop-table</code>]]</td> </tr></tbody></table>8

  Descarte os gatilhos na lista *`trigger_list`*, que é uma lista de um ou mais nomes de gatilho separados por vírgula. Instâncias múltiplas desta opção são aditivas. Para mais informações, consulte Seleção de Objeto mysqlpump.

- `--include-users=user_list`

  <table frame="box" rules="all" summary="Propriedades para adicionar ou remover tabela"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--add-drop-table</code>]]</td> </tr></tbody></table>9

  Exclua as contas de usuário em *`user_list`*, que é uma lista de um ou mais nomes de usuário separados por vírgula. Instâncias múltiplas desta opção são aditivas. Para mais informações, consulte Seleção de Objetos do mysqlpump.

- `--insert-ignore`

  <table frame="box" rules="all" summary="Propriedades para adicionar ou remover usuários"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--add-drop-user</code>]]</td> </tr></tbody></table>0

  Escreva instruções `INSERT IGNORE` em vez de instruções `INSERT`.

- `--log-error-file=nome_arquivo`

  <table frame="box" rules="all" summary="Propriedades para adicionar ou remover usuários"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--add-drop-user</code>]]</td> </tr></tbody></table>1

  Registre avisos e erros anexando-os ao arquivo nomeado. Se esta opção não for fornecida, o **mysqlpump** escreve avisos e erros na saída padrão de erro.

- `--login-path=nome`

  <table frame="box" rules="all" summary="Propriedades para adicionar ou remover usuários"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--add-drop-user</code>]]</td> </tr></tbody></table>2

  Leia as opções do caminho de login nomeado no arquivo de caminho de login `.mylogin.cnf`. Um “caminho de login” é um grupo de opções que contém opções que especificam qual servidor MySQL conectar e qual conta autenticar. Para criar ou modificar um arquivo de caminho de login, use o utilitário **mysql\_config\_editor**. Veja a Seção 4.6.6, “mysql\_config\_editor — Utilitário de Configuração MySQL”.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--max-allowed-packet=N`

  <table frame="box" rules="all" summary="Propriedades para adicionar ou remover usuários"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--add-drop-user</code>]]</td> </tr></tbody></table>3

  O tamanho máximo do buffer para a comunicação cliente/servidor. O padrão é de 24 MB, e o máximo é de 1 GB.

- `--net-buffer-length=N`

  <table frame="box" rules="all" summary="Propriedades para adicionar ou remover usuários"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--add-drop-user</code>]]</td> </tr></tbody></table>4

  O tamanho inicial do buffer para a comunicação cliente/servidor. Ao criar instruções `INSERT` de várias linhas (como com a opção `--extended-insert`), o **mysqlpump** cria linhas com até *`N`* bytes de comprimento. Se você usar essa opção para aumentar o valor, certifique-se de que a variável de sistema `net_buffer_length` do servidor MySQL tenha um valor pelo menos desse tamanho.

- `--no-create-db`

  <table frame="box" rules="all" summary="Propriedades para adicionar ou remover usuários"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--add-drop-user</code>]]</td> </tr></tbody></table>5

  Suprima quaisquer declarações `CREATE DATABASE` que possam estar incluídas na saída.

- `--no-create-info`, `-t`

  <table frame="box" rules="all" summary="Propriedades para adicionar ou remover usuários"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--add-drop-user</code>]]</td> </tr></tbody></table>6

  Não escreva declarações `CREATE TABLE` que criem cada tabela descarregada.

- `--no-defaults`

  <table frame="box" rules="all" summary="Propriedades para adicionar ou remover usuários"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--add-drop-user</code>]]</td> </tr></tbody></table>7

  Não leia nenhum arquivo de opções. Se a inicialização do programa falhar devido à leitura de opções desconhecidas de um arquivo de opções, o `--no-defaults` pode ser usado para impedir que sejam lidas.

  A exceção é que o arquivo `.mylogin.cnf` é lido em todos os casos, se ele existir. Isso permite que as senhas sejam especificadas de uma maneira mais segura do que na linha de comando, mesmo quando o `--no-defaults` é usado. Para criar `.mylogin.cnf`, use o utilitário **mysql\_config\_editor**. Veja a Seção 4.6.6, “mysql\_config\_editor — Ferramenta de Configuração do MySQL”.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--parallel-schemas=[N:]db_list`

  <table frame="box" rules="all" summary="Propriedades para adicionar ou remover usuários"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--add-drop-user</code>]]</td> </tr></tbody></table>8

  Crie uma fila para processar os bancos de dados em *`db_list`*, que é uma lista de um ou mais nomes de bancos de dados separados por vírgula. Se *`N`* for fornecido, a fila usa *`N`* threads. Se *`N`* não for fornecido, a opção `--default-parallelism` determina o número de threads da fila.

  Várias instâncias desta opção criam várias filas. O **mysqlpump** também cria uma fila padrão para uso com bancos de dados que não estejam nomeados em nenhuma opção `--parallel-schemas` e para dumper de definições de usuário, se as opções de comando as selecionarem. Para obter mais informações, consulte o processamento paralelo do mysqlpump.

- `--password[=password]`, `-p[password]`

  <table frame="box" rules="all" summary="Propriedades para adicionar ou remover usuários"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--add-drop-user</code>]]</td> </tr></tbody></table>9

  A senha da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecido, o **mysqlpump** solicitará uma senha. Se for fornecida, não deve haver **espaço** entre `--password=` ou `-p` e a senha que a segue. Se nenhuma opção de senha for especificada, o padrão é não enviar a senha.

  Especificar uma senha na linha de comando deve ser considerado inseguro. Para evitar fornecer a senha na linha de comando, use um arquivo de opção. Consulte a Seção 6.1.2.1, "Diretrizes para o Usuário Final sobre Segurança de Senhas".

  Para especificar explicitamente que não há senha e que o **mysqlpump** não deve solicitar uma senha, use a opção `--skip-password`.

- `--plugin-dir=dir_name`

  <table frame="box" rules="all" summary="Propriedades para bloqueios adicionais"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--add-locks</code>]]</td> </tr></tbody></table>0

  O diretório onde procurar por plugins. Especifique esta opção se a opção `--default-auth` for usada para especificar um plugin de autenticação, mas o **mysqlpump** não encontrá-lo. Veja a Seção 6.2.13, “Autenticação Personalizável”.

- `--port=port_num`, `-P port_num`

  <table frame="box" rules="all" summary="Propriedades para bloqueios adicionais"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--add-locks</code>]]</td> </tr></tbody></table>1

  Para conexões TCP/IP, o número de porta a ser usado.

- `--print-defaults`

  <table frame="box" rules="all" summary="Propriedades para bloqueios adicionais"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--add-locks</code>]]</td> </tr></tbody></table>2

  Imprima o nome do programa e todas as opções que ele obtém a partir de arquivos de opção.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table frame="box" rules="all" summary="Propriedades para bloqueios adicionais"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--add-locks</code>]]</td> </tr></tbody></table>3

  O protocolo de transporte a ser usado para se conectar ao servidor. É útil quando os outros parâmetros de conexão normalmente resultam no uso de um protocolo diferente do que você deseja. Para obter detalhes sobre os valores permitidos, consulte a Seção 4.2.5, “Protocolos de Transporte de Conexão”.

- `--replace`

  <table frame="box" rules="all" summary="Propriedades para bloqueios adicionais"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--add-locks</code>]]</td> </tr></tbody></table>4

  Escreva declarações `REPLACE` em vez de declarações `INSERT`.

- `--result-file=nome_do_arquivo`

  <table frame="box" rules="all" summary="Propriedades para bloqueios adicionais"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--add-locks</code>]]</td> </tr></tbody></table>5

  Saída direta para o arquivo nomeado. O arquivo de resultado é criado e seus conteúdos anteriores são sobrescritos, mesmo que um erro ocorra durante a geração do dump.

  Essa opção deve ser usada no Windows para evitar que os caracteres de nova linha `\n` sejam convertidos em sequências de retorno de carro/nova linha `\r\n`.

- `--routines`

  <table frame="box" rules="all" summary="Propriedades para bloqueios adicionais"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--add-locks</code>]]</td> </tr></tbody></table>6

  Inclua rotinas armazenadas (procedimentos e funções) para os bancos de dados descartados na saída. Esta opção requer o privilégio `SELECT` para a tabela `mysql.proc`.

  A saída gerada usando `--routines` contém instruções `CREATE PROCEDURE` e `CREATE FUNCTION` para criar as rotinas. No entanto, essas instruções não incluem atributos como os timestamps de criação e modificação da rotina, então, quando as rotinas são recarregadas, elas são criadas com timestamps iguais ao tempo de recarga.

  Se você precisar criar rotinas com seus atributos de data e hora originais, não use `--routines`. Em vez disso, faça o dump e o reload do conteúdo da tabela `mysql.proc` diretamente, usando uma conta MySQL que tenha os privilégios apropriados para o banco de dados `mysql`.

  Esta opção está habilitada por padrão; use `--skip-routines` para desabilitá-la.

- `--secure-auth`

  <table frame="box" rules="all" summary="Propriedades para bloqueios adicionais"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--add-locks</code>]]</td> </tr></tbody></table>7

  Não envie senhas para o servidor no formato antigo (pré-4.1). Isso impede conexões, exceto para servidores que usam o formato de senha mais recente.

  Esta opção está desatualizada; espere-se que seja removida em uma futura versão do MySQL. Ela está sempre habilitada e tentar desabilitá-la (`--skip-secure-auth`, `--secure-auth=0`) produz um erro.

- `--server-public-key-path=nome_do_arquivo`

  <table frame="box" rules="all" summary="Propriedades para bloqueios adicionais"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--add-locks</code>]]</td> </tr></tbody></table>8

  O nome do caminho de um arquivo no formato PEM que contém uma cópia do lado do cliente da chave pública necessária pelo servidor para a troca de senhas com par de chaves RSA. Esta opção aplica-se a clientes que se autenticam com o plugin de autenticação `sha256_password` ou `caching_sha2_password`. Esta opção é ignorada para contas que não se autenticam com um desses plugins. Também é ignorada se a troca de senha com base em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

  Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele terá precedência sobre `--get-server-public-key`.

  Para `sha256_password`, essa opção só se aplica se o MySQL foi construído usando o OpenSSL.

  Para obter informações sobre os módulos `sha256_password` e `caching_sha2_password`, consulte a Seção 6.4.1.5, “Autenticação com Pluggable SHA-256” e a Seção 6.4.1.4, “Cache de Autenticação com Pluggable SHA-2”.

  A opção `--server-public-key-path` foi adicionada no MySQL 5.7.23.

- `--set-charset`

  <table frame="box" rules="all" summary="Propriedades para bloqueios adicionais"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--add-locks</code>]]</td> </tr></tbody></table>9

  Escreva `SET NAMES default_character_set` na saída.

  Esta opção está habilitada por padrão. Para desabilitá-la e suprimir a instrução `SET NAMES`, use `--skip-set-charset`.

- `--set-gtid-purged=valor`

  <table frame="box" rules="all" summary="Propriedades para todos os bancos de dados"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--all-databases</code>]]</td> </tr></tbody></table>0

  Essa opção permite o controle sobre as informações de ID de transação global (GTID) escritas no arquivo de depuração, indicando se deve adicionar uma declaração `SET @@GLOBAL.gtid_purged` à saída. Essa opção também pode causar a escrita de uma declaração na saída que desabilita o registro binário enquanto o arquivo de depuração está sendo recarregado.

  A tabela a seguir mostra os valores de opção permitidos. O valor padrão é `AUTO`.

  <table frame="box" rules="all" summary="Propriedades para todos os bancos de dados"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--all-databases</code>]]</td> </tr></tbody></table>1

  A opção `--set-gtid-purged` tem o seguinte efeito no registro binário quando o arquivo de dump é recarregado:

  - `--set-gtid-purged=OFF`: `SET @@SESSION.SQL_LOG_BIN=0;` não é adicionado ao resultado.

  - `--set-gtid-purged=ON`: `SET @@SESSION.SQL_LOG_BIN=0;` é adicionado ao resultado.

  - `--set-gtid-purged=AUTO`: `SET @@SESSION.SQL_LOG_BIN=0;` é adicionado ao resultado se os GTIDs estiverem habilitados no servidor que você está fazendo o backup (ou seja, se `AUTO` for avaliado como `ON`).

  Essa opção foi adicionada no MySQL 5.7.18.

- `--single-transaction`

  <table frame="box" rules="all" summary="Propriedades para todos os bancos de dados"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--all-databases</code>]]</td> </tr></tbody></table>2

  Essa opção define o modo de isolamento de transação como `REPEATABLE READ` e envia uma instrução SQL `START TRANSACTION` para o servidor antes de drenar os dados. Ela é útil apenas com tabelas transacionais, como `InnoDB`, porque, nesse caso, ela drenará o estado consistente do banco de dados no momento em que a instrução `START TRANSACTION` foi emitida, sem bloquear nenhuma aplicação.

  Ao usar essa opção, você deve ter em mente que apenas as tabelas `InnoDB` são descarregadas em um estado consistente. Por exemplo, quaisquer tabelas `MyISAM` ou `MEMORY` descarregadas enquanto estiver usando essa opção ainda podem mudar de estado.

  Enquanto um dump `--single-transaction` estiver em processo, para garantir um arquivo de dump válido (conteúdo correto da tabela e coordenadas do log binário), nenhuma outra conexão deve usar as seguintes instruções: `ALTER TABLE`, `CREATE TABLE`, `DROP TABLE`, `RENAME TABLE`, `TRUNCATE TABLE`. Uma leitura consistente não está isolada dessas instruções, então o uso delas em uma tabela a ser descarregada pode fazer com que o `SELECT` realizado pelo **mysqlpump** retorne o conteúdo da tabela incorreto ou falhe.

  `--add-locks` e `--single-transaction` são mutuamente exclusivos.

  Nota

  Antes do MySQL 5.7.11, o uso da opção `--single-transaction` é mutuamente exclusivo com o paralelismo. Para usar `--single-transaction`, desative o paralelismo configurando `--default-parallelism` para 0 e não usando nenhuma instância de `--parallel-schemas`:

  ```sql
  mysqlpump --single-transaction --default-parallelism=0
  ```

- `--skip-definer`

  <table frame="box" rules="all" summary="Propriedades para todos os bancos de dados"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--all-databases</code>]]</td> </tr></tbody></table>3

  Omitam as cláusulas `DEFINER` e `SQL SECURITY` das instruções `CREATE` para visualizações e programas armazenados. O arquivo de dump, ao ser carregado novamente, cria objetos que usam os valores padrão de `DEFINER` e `SQL SECURITY`. Veja a Seção 23.6, “Controle de Acesso a Objetos Armazenados”.

- `--skip-dump-rows`, `-d`

  <table frame="box" rules="all" summary="Propriedades para todos os bancos de dados"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--all-databases</code>]]</td> </tr></tbody></table>4

  Não descarte linhas de tabela.

- `--socket=caminho`, `-S caminho`

  <table frame="box" rules="all" summary="Propriedades para todos os bancos de dados"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--all-databases</code>]]</td> </tr></tbody></table>5

  Para conexões ao `localhost`, o arquivo de socket Unix a ser usado ou, no Windows, o nome do tubo nomeado a ser usado.

  No Windows, essa opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões por named pipe. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.

- `--ssl*`

  As opções que começam com `--ssl` especificam se você deseja se conectar ao servidor usando criptografia e indicam onde encontrar as chaves e certificados SSL. Consulte Opções de comando para conexões criptografadas.

- `--tls-version=lista_protocolos`

  <table frame="box" rules="all" summary="Propriedades para todos os bancos de dados"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--all-databases</code>]]</td> </tr></tbody></table>6

  Os protocolos TLS permitidos para conexões criptografadas. O valor é uma lista de um ou mais nomes de protocolos separados por vírgula. Os protocolos que podem ser nomeados para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para obter detalhes, consulte a Seção 6.3.2, “Protocolos e cifra TLS de conexão criptografada”.

  Essa opção foi adicionada no MySQL 5.7.10.

- `--triggers`

  <table frame="box" rules="all" summary="Propriedades para todos os bancos de dados"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--all-databases</code>]]</td> </tr></tbody></table>7

  Inclua os gatilhos para cada tabela descarregada na saída.

  Esta opção está habilitada por padrão; use `--skip-triggers` para desabilitá-la.

- `--tz-utc`

  <table frame="box" rules="all" summary="Propriedades para todos os bancos de dados"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--all-databases</code>]]</td> </tr></tbody></table>8

  Essa opção permite que as colunas `TIMESTAMP` sejam descarregadas e recarregadas entre servidores em diferentes fusos horários. O **mysqlpump** define seu fuso horário de conexão como UTC e adiciona `SET TIME_ZONE='+00:00'` ao arquivo de dump. Sem essa opção, as colunas `TIMESTAMP` são descarregadas e recarregadas nos fusos horários locais dos servidores de origem e destino, o que pode causar alterações nos valores se os servidores estiverem em fusos horários diferentes. A opção `--tz-utc` também protege contra alterações devido ao horário de verão.

  Esta opção está habilitada por padrão; use `--skip-tz-utc` para desabilitá-la.

- `--user=user_name`, `-u user_name`

  <table frame="box" rules="all" summary="Propriedades para todos os bancos de dados"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--all-databases</code>]]</td> </tr></tbody></table>9

  O nome de usuário da conta MySQL a ser usado para se conectar ao servidor.

- `--users`

  <table frame="box" rules="all" summary="Propriedades para endereço de ligação"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--bind-address=ip_address</code>]]</td> </tr></tbody></table>0

  Descarte as contas de usuários como definições lógicas na forma de declarações `CREATE USER` e `GRANT`.

  As definições de usuário são armazenadas nas tabelas de concessão no banco de dados do sistema `mysql`. Por padrão, o **mysqlpump** não inclui as tabelas de concessão nos backups do banco de dados `mysql`. Para fazer o backup do conteúdo das tabelas de concessão como definições lógicas, use a opção `--users` e suprima todos os backups de banco de dados:

  ```sql
  mysqlpump --exclude-databases=% --users
  ```

- `--version`, `-V`

  <table frame="box" rules="all" summary="Propriedades para endereço de ligação"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--bind-address=ip_address</code>]]</td> </tr></tbody></table>1

  Exibir informações da versão e sair.

- `--watch-progress`

  <table frame="box" rules="all" summary="Propriedades para endereço de ligação"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--bind-address=ip_address</code>]]</td> </tr></tbody></table>2

  Exiba periodicamente um indicador de progresso que forneça informações sobre o número total de tabelas, linhas e outros objetos concluídos.

  Esta opção está habilitada por padrão; use `--skip-watch-progress` para desabilitá-la.

#### mysqlpump Seleção de objeto

O **mysqlpump** possui um conjunto de opções de inclusão e exclusão que permitem filtrar vários tipos de objetos e fornecer controle flexível sobre quais objetos devem ser excluídos:

- `--include-databases` e `--exclude-databases` se aplicam a bancos de dados e a todos os objetos dentro deles.

- `--include-tables` e `--exclude-tables` se aplicam a tabelas. Essas opções também afetam os gatilhos associados às tabelas, a menos que as opções específicas do gatilho sejam fornecidas.

- `--include-triggers` e `--exclude-triggers` se aplicam a gatilhos.

- `--include-routines` e `--exclude-routines` se aplicam a procedimentos armazenados e funções. Se uma opção de rotina corresponder a um nome de procedimento armazenado, ela também corresponderá a uma função armazenada com o mesmo nome.

- `--include-events` e `--exclude-events` se aplicam a eventos do Agendamento de Eventos.

- `--include-users` e `--exclude-users` se aplicam a contas de usuário.

Qualquer opção de inclusão ou exclusão pode ser dada várias vezes. O efeito é aditivo. A ordem dessas opções não importa.

O valor de cada opção de inclusão e exclusão é uma lista de nomes separados por vírgula do tipo de objeto apropriado. Por exemplo:

```sql
--exclude-databases=test,world
--include-tables=customer,invoice
```

Caracteres especiais são permitidos nos nomes dos objetos:

- `%` corresponde a qualquer sequência de zero ou mais caracteres.

- `_` corresponde a qualquer caractere único.

Por exemplo, `--include-tables=t%,__tmp` corresponde a todos os nomes de tabelas que começam com `t` e a todos os nomes de tabelas de cinco caracteres que terminam com `tmp`.

Para os usuários, um nome especificado sem uma parte de host é interpretado com um host implícito de `%`. Por exemplo, `u1` e `u1@%` são equivalentes. Esta é a mesma equivalência que se aplica no MySQL em geral (veja a Seção 6.2.4, “Especificação de Nomes de Conta”).

As opções de inclusão e exclusão interagem da seguinte forma:

- Por padrão, sem opções de inclusão ou exclusão, o **mysqlpump** exibe todos os bancos de dados (com certas exceções mencionadas nas restrições do mysqlpump).

- Se as opções de inclusão forem fornecidas na ausência de opções de exclusão, apenas os objetos nomeados como incluídos serão descarregados.

- Se as opções de exclusão forem fornecidas na ausência de opções de inclusão, todos os objetos serão descartados, exceto aqueles nomeados como excluídos.

- Se as opções de inclusão e exclusão forem fornecidas, todos os objetos nomeados como excluídos e não nomeados como incluídos não serão descarregados. Todos os outros objetos serão descarregados.

Se várias bases de dados estão sendo descarregadas, é possível nomear tabelas, gatilhos e rotinas em uma base de dados específica qualificando os nomes dos objetos com o nome da base de dados. O comando a seguir descarrega as bases de dados `db1` e `db2`, mas exclui as tabelas `db1.t1` e `db2.t2`:

```sql
mysqlpump --include-databases=db1,db2 --exclude-tables=db1.t1,db2.t2
```

As seguintes opções fornecem maneiras alternativas de especificar quais bancos de dados devem ser descarregados:

- A opção `--all-databases` exibe todos os bancos de dados (com certas exceções mencionadas nas restrições do mysqlpump). É equivalente a não especificar nenhuma opção de objeto (a ação padrão do **mysqlpump** é excluir tudo).

  `--include-databases=%` é semelhante a `--all-databases`, mas seleciona todos os bancos de dados para o dumping, mesmo aqueles que são exceções para `--all-databases`.

- A opção `--databases` faz com que o **mysqlpump** trate todos os argumentos de nome como nomes de bancos de dados a serem excluídos. É equivalente a uma opção `--include-databases` que nomeia os mesmos bancos de dados.

#### mysqlpump Processamento Paralelo

O **mysqlpump** pode usar o paralelismo para alcançar o processamento concorrente. Você pode selecionar a concorrência entre bancos de dados (para drenar vários bancos de dados simultaneamente) e dentro dos bancos de dados (para drenar vários objetos de um dado banco de dados simultaneamente).

Por padrão, o **mysqlpump** configura uma fila com dois threads. Você pode criar filas adicionais e controlar o número de threads atribuídos a cada uma delas, incluindo a fila padrão:

- `--default-parallelism=N` especifica o número padrão de threads usado para cada fila. Na ausência dessa opção, *`N`* é 2.

  A fila padrão sempre usa o número padrão de threads. As filas adicionais usam o número padrão de threads, a menos que você especifique o contrário.

- `--parallel-schemas=[N:]db_list` configura uma fila de processamento para drenar os bancos de dados nomeados em *`db_list`* e especifica, opcionalmente, quantos threads a fila usa. *`db_list`* é uma lista de nomes de bancos de dados separados por vírgula. Se o argumento da opção começar com `N:`, a fila usa *`N`* threads. Caso contrário, a opção `--default-parallelism` determina o número de threads da fila.

  Várias instâncias da opção `--parallel-schemas` criam várias filas.

  Os nomes na lista do banco de dados podem conter os mesmos caracteres de substituição `%` e `_` suportados para opções de filtragem (veja Seleção de Objetos do mysqlpump).

O **mysqlpump** usa a fila padrão para processar quaisquer bancos de dados que não sejam explicitamente nomeados com a opção `--parallel-schemas` e para descartar definições de usuário se as opções de comando as selecionarem.

Em geral, com múltiplas filas, o **mysqlpump** utiliza o paralelismo entre os conjuntos de bancos de dados processados pelas filas para drenar múltiplos bancos de dados simultaneamente. Para uma fila que utiliza múltiplos threads, o **mysqlpump** utiliza o paralelismo dentro dos bancos de dados para drenar múltiplos objetos de um banco de dados específico simultaneamente. Pode ocorrer exceções; por exemplo, o **mysqlpump** pode bloquear as filas enquanto obtém listas de objetos dos servidores nos bancos de dados.

Com o paralelismo ativado, é possível intercalar a saída de diferentes bancos de dados. Por exemplo, as instruções `INSERT` de várias tabelas descarregadas em paralelo podem ser intercaladas; as instruções não são escritas em ordem específica. Isso não afeta a recarga porque as instruções de saída qualificam os nomes dos objetos com os nomes dos bancos de dados ou são precedidas por instruções `USE` conforme necessário.

A granularidade para paralelismo é um único objeto de banco de dados. Por exemplo, uma única tabela não pode ser descarregada em paralelo usando múltiplos threads.

Exemplos:

```sql
mysqlpump --parallel-schemas=db1,db2 --parallel-schemas=db3
```

O **mysqlpump** configura uma fila para processar `db1` e `db2`, outra fila para processar `db3` e uma fila padrão para processar todos os outros bancos de dados. Todas as filas usam dois threads.

```sql
mysqlpump --parallel-schemas=db1,db2 --parallel-schemas=db3
          --default-parallelism=4
```

Isto é o mesmo que o exemplo anterior, exceto que todas as filas usam quatro threads.

```sql
mysqlpump --parallel-schemas=5:db1,db2 --parallel-schemas=3:db3
```

A fila para `db1` e `db2` usa cinco threads, a fila para `db3` usa três threads e a fila padrão usa o padrão de duas threads.

Como caso especial, com `--default-parallelism=0` e sem as opções `--parallel-schemas`, o **mysqlpump** funciona como um processo de fluxo único e não cria filas.

Nota

Antes do MySQL 5.7.11, o uso da opção `--single-transaction` é mutuamente exclusivo com o paralelismo. Para usar `--single-transaction`, desative o paralelismo configurando `--default-parallelism` para 0 e não usando nenhuma instância de `--parallel-schemas`:

```sql
mysqlpump --single-transaction --default-parallelism=0
```

#### mysqlpump Restrições

O **mysqlpump** não exclui o esquema `INFORMATION_SCHEMA`, `performance_schema`, `ndbinfo` ou `sys` por padrão. Para excluí-los, nomeie-os explicitamente na linha de comando. Você também pode nomeá-los com a opção `--databases` ou `--include-databases`.

O **mysqlpump** não grava as instruções `CREATE TABLESPACE` do `InnoDB`.

O **mysqlpump** exibe as contas de usuário em formato lógico usando as instruções `CREATE USER` e `GRANT` (por exemplo, quando você usa a opção `--include-users` ou `--users`). Por esse motivo, os backups do banco de dados do sistema `mysql` não incluem, por padrão, as tabelas de concessão que contêm definições de usuário: `user`, `db`, `tables_priv`, `columns_priv`, `procs_priv` ou `proxies_priv`. Para fazer o backup de qualquer uma das tabelas de concessão, nomeie o banco de dados `mysql` seguido dos nomes das tabelas:

```sql
mysqlpump mysql user db ...
```
