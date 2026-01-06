### 4.5.4 mysqldump — Um programa de backup de banco de dados

A ferramenta de cliente **mysqldump** realiza backups lógicos, produzindo um conjunto de instruções SQL que podem ser executadas para reproduzir as definições originais dos objetos do banco de dados e os dados das tabelas. Ele descarrega um ou mais bancos de dados MySQL para backup ou transferência para outro servidor SQL. O comando **mysqldump** também pode gerar saída em formato CSV, outro texto delimitado ou XML.

- Considerações sobre desempenho e escalabilidade
- Sintaxe de Invocação
- Sintaxe de opção - Resumo alfabético
- Opções de conexão
- Opção - Opções de arquivo
- Opções de DDL
- Opções de depuração
- Opções de Ajuda
- Opções de internacionalização
- Opções de replicação
- Opções de formato
- Opções de filtragem
- Opções de desempenho
- Opções de transação
- Grupos de Opções
- Exemplos
- Restrições

O **mysqldump** exige pelo menos o privilégio `SELECT` para tabelas descarregadas, `SHOW VIEW` para vistas descarregadas, `TRIGGER` para gatilhos descarregados, `LOCK TABLES` se a opção `--single-transaction` não for usada e, a partir do MySQL 5.7.31, `PROCESS` se a opção `--no-tablespaces` não for usada. Algumas opções podem exigir outros privilégios, conforme indicado nas descrições das opções.

Para recarregar um arquivo de dump, você deve ter os privilégios necessários para executar as instruções que ele contém, como os privilégios de `CREATE` apropriados para objetos criados por essas instruções.

A saída do **mysqldump** pode incluir instruções `ALTER DATABASE` que alteram a codificação de caracteres do banco de dados. Essas instruções podem ser usadas ao fazer o backup de programas armazenados para preservar suas codificações de caracteres. Para recarregar um arquivo de backup que contenha essas instruções, é necessário o privilégio `ALTER` para o banco de dados afetado.

Nota

Um dump feito usando o PowerShell no Windows com redirecionamento de saída cria um arquivo com codificação UTF-16:

```sql
mysqldump [options] > dump.sql
```

No entanto, o UTF-16 não é permitido como conjunto de caracteres de conexão (veja Conjuntos de caracteres de cliente impermissíveis), então o arquivo de dump não pode ser carregado corretamente. Para contornar esse problema, use a opção `--result-file`, que cria a saída no formato ASCII:

```sql
mysqldump [options] --result-file=dump.sql
```

Não é recomendado carregar um arquivo de dump quando os GTIDs estão habilitados no servidor (`gtid_mode=ON`), se o seu arquivo de dump incluir tabelas do sistema. O **mysqldump** emite instruções DML para as tabelas do sistema que usam o mecanismo de armazenamento não transacional MyISAM, e essa combinação não é permitida quando os GTIDs estão habilitados.

#### Considerações sobre desempenho e escalabilidade

As vantagens do `mysqldump` incluem a conveniência e flexibilidade de visualizar ou até mesmo editar a saída antes da restauração. Você pode clonar bancos de dados para trabalho de desenvolvimento e DBA, ou produzir variações leves de um banco de dados existente para testes. Ele não é destinado como uma solução rápida ou escalável para fazer backup de grandes quantidades de dados. Com tamanhos de dados grandes, mesmo que o passo de backup leve um tempo razoável, restaurar os dados pode ser muito lento porque a reprodução das instruções SQL envolve I/O de disco para inserção, criação de índices, e assim por diante.

Para backups e restaurações em larga escala, um backup físico é mais apropriado, para copiar os arquivos de dados em seu formato original, que podem ser restaurados rapidamente:

- Se suas tabelas são principalmente tabelas `InnoDB`, ou se você tem uma mistura de tabelas `InnoDB` e `MyISAM`, considere usar o comando **mysqlbackup** do produto MySQL Enterprise Backup. (Disponível como parte da assinatura Enterprise.) Ele oferece o melhor desempenho para backups `InnoDB` com mínima interrupção; também pode fazer backup de tabelas de `MyISAM` e outros motores de armazenamento; e oferece várias opções convenientes para acomodar diferentes cenários de backup. Veja a Seção 28.1, “Visão geral do MySQL Enterprise Backup”.

O **mysqldump** pode recuperar e descartar o conteúdo da tabela linha por linha ou pode recuperar todo o conteúdo de uma tabela e bufferá-lo na memória antes de descartá-lo. O bufferamento na memória pode ser um problema se você estiver descartando tabelas grandes. Para descartar tabelas linha por linha, use a opção `--quick` (ou `--opt`, que habilita `--quick`). A opção `--opt` (e, portanto, `--quick`) é habilitada por padrão, então para habilitar o bufferamento na memória, use `--skip-quick`.

Se você estiver usando uma versão recente do **mysqldump** para gerar um dump que será recarregado em um servidor MySQL muito antigo, use a opção `--skip-opt` em vez da opção `--opt` ou `--extended-insert`.

Para obter informações adicionais sobre o **mysqldump**, consulte a Seção 7.4, “Usando mysqldump para backups”.

#### Sintaxe de Invocação

Existem, em geral, três maneiras de usar o **mysqldump**: para fazer o dump de um conjunto de uma ou mais tabelas, de um conjunto de uma ou mais bases de dados completas ou de um servidor MySQL inteiro, conforme mostrado aqui:

```sql
mysqldump [options] db_name [tbl_name ...]
mysqldump [options] --databases db_name ...
mysqldump [options] --all-databases
```

Para descartar bancos de dados inteiros, não dê nome a nenhuma tabela após *`db_name`*, ou use a opção `--databases` ou `--all-databases`.

Para ver uma lista das opções suportadas pela sua versão do **mysqldump**, execute o comando **mysqldump --help**.

#### Sintaxe de opção - Resumo alfabético

O **mysqldump** suporta as seguintes opções, que podem ser especificadas na linha de comando ou nos grupos `[mysqldump]` e `[client]` de um arquivo de opções. Para obter informações sobre os arquivos de opções usados pelos programas MySQL, consulte a Seção 4.2.2.2, “Usando arquivos de opções”.

**Tabela 4.16 Opções do mysqldump**

<table frame="box" rules="all" summary="Opções de linha de comando disponíveis para mysqldump."><col style="width: 27%"/><col style="width: 50%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th scope="col">Nome da Opção</th> <th scope="col">Descrição</th> <th scope="col">Introduzido</th> <th scope="col">Desatualizado</th> </tr></thead><tbody><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_add-drop-database">--add-drop-database</a></th> <td>Adicione a instrução DROP DATABASE antes de cada instrução CREATE DATABASE</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_add-drop-table">--add-drop-table</a></th> <td>Adicione a declaração DROP TABLE antes de cada declaração CREATE TABLE</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_add-drop-trigger">--add-drop-trigger</a></th> <td>Adicione a declaração DROP TRIGGER antes de cada declaração CREATE TRIGGER</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_add-locks">--add-locks</a></th> <td>Cerque cada dump de tabela com as instruções LOCK TABLES e UNLOCK TABLES</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_all-databases">--all-databases</a></th> <td>Exclua todas as tabelas em todos os bancos de dados</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_allow-keywords">--allow-keywords</a></th> <td>Permitir a criação de nomes de colunas que sejam palavras-chave</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_apply-slave-statements">--apply-slave-statements</a></th> <td>Incluir STOP SLAVE antes da declaração CHANGE MASTER e START SLAVE no final da saída</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_bind-address">--bind-address</a></th> <td>Use a interface de rede especificada para se conectar ao servidor MySQL</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_character-sets-dir">--sets-de-caracteres-dir</a></th> <td>Diretório onde os conjuntos de caracteres são instalados</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_comments">--comentários</a></th> <td>Adicione comentários ao arquivo de dump</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_compact">--compacto</a></th> <td>Produza uma saída mais compacta</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_compatible">--compatível</a></th> <td>Produza uma saída mais compatível com outros sistemas de banco de dados ou com servidores MySQL mais antigos</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_complete-insert">--complete-insert</a></th> <td>Use instruções INSERT completas que incluam os nomes das colunas</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_compress">--compress</a></th> <td>Compressar todas as informações enviadas entre o cliente e o servidor</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_create-options">--create-options</a></th> <td>Incluir todas as opções de tabela específicas do MySQL nas declarações CREATE TABLE</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_databases">--databases</a></th> <td>Interprete todos os argumentos de nome como nomes de banco de dados</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_debug">--debug</a></th> <td>Escreva o log de depuração</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_debug-check">--debug-check</a></th> <td>Imprimir informações de depuração quando o programa sai</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_debug-info">--debug-info</a></th> <td>Imprimir informações de depuração, memória e estatísticas da CPU quando o programa sai</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_default-auth">--default-auth</a></th> <td>Plugin de autenticação a ser usado</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_default-character-set">--default-character-set</a></th> <td>Especifique o conjunto de caracteres padrão</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_defaults-extra-file">--defaults-extra-file</a></th> <td>Leia o arquivo de opção nomeado, além dos arquivos de opção usuais</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_defaults-file">--defaults-file</a></th> <td>Arquivo de opção de leitura apenas nomeado</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_defaults-group-suffix">--defaults-group-suffix</a></th> <td>Valor do sufixo do grupo de opções</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_delete-master-logs">--delete-master-logs</a></th> <td>Em um servidor de fonte de replicação, exclua os logs binários após a execução da operação de dump</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_disable-keys">--disable-keys</a></th> <td>Para cada tabela, rode as instruções INSERT com instruções para desabilitar e habilitar as chaves</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_dump-date">--dump-data</a></th> <td>Incluir a data do dump como comentário "Dump concluído em" se a opção --comments for fornecida</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_dump-slave">--dump-slave</a></th> <td>Incluir a declaração CHANGE MASTER que lista as coordenadas do log binário da fonte da réplica</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_enable-cleartext-plugin">--enable-cleartext-plugin</a></th> <td>Habilitar o plugin de autenticação em texto claro</td> <td>5.7.10</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_events">--eventos</a></th> <td>Eventos de descarte de bancos de dados descartados</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_extended-insert">--insert-extended</a></th> <td>Use a sintaxe de inserção de várias linhas</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_fields">--campos-cercados-por</a></th> <td>Esta opção é usada com a opção --tab e tem o mesmo significado que a cláusula correspondente para LOAD DATA</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_fields">--campos-escavados-por</a></th> <td>Esta opção é usada com a opção --tab e tem o mesmo significado que a cláusula correspondente para LOAD DATA</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_fields">--campos opcionalmente delimitados por</a></th> <td>Esta opção é usada com a opção --tab e tem o mesmo significado que a cláusula correspondente para LOAD DATA</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_fields">--campos-terminados-por</a></th> <td>Esta opção é usada com a opção --tab e tem o mesmo significado que a cláusula correspondente para LOAD DATA</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_flush-logs">--flush-logs</a></th> <td>Limpe os arquivos de log do servidor MySQL antes de iniciar o dump</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_flush-privileges">--flush-privileges</a></th> <td>Emita uma declaração FLUSH PRIVILEGES após descartar o banco de dados mysql</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_force">--force</a></th> <td>Continue mesmo que um erro SQL ocorra durante um dump de tabela</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_get-server-public-key">--get-server-public-key</a></th> <td>Solicitar chave pública RSA do servidor</td> <td>5.7.23</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_help">--help</a></th> <td>Exibir mensagem de ajuda e sair</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_hex-blob">--hex-blob</a></th> <td>Expor colunas binárias usando notação hexadecimal</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_host">--host</a></th> <td>Anfitrião no qual o servidor MySQL está localizado</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_ignore-error">--ignore-error</a></th> <td>Ignorar erros especificados</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_ignore-table">--ignore-table</a></th> <td>Não jogue fora a mesa dada</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_include-master-host-port">--include-master-host-port</a></th> <td>Incluir as opções MASTER_HOST/MASTER_PORT na declaração CHANGE MASTER produzida com --dump-slave</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_insert-ignore">--inserir-ignorar</a></th> <td>Escreva INSERT IGNORE em vez de instruções INSERT</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_lines-terminated-by">--lines-terminated-by</a></th> <td>Esta opção é usada com a opção --tab e tem o mesmo significado que a cláusula correspondente para LOAD DATA</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_lock-all-tables">--lock-all-tables</a></th> <td>Bloquear todas as tabelas em todos os bancos de dados</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_lock-tables">--lock-tables</a></th> <td>Bloquear todas as tabelas antes de descartá-las</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_log-error">--log-error</a></th> <td>Adicione avisos e erros a um arquivo nomeado</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_login-path">--login-path</a></th> <td>Leia as opções de caminho de login a partir de .mylogin.cnf</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_master-data">--master-data</a></th> <td>Escreva o nome e a posição do arquivo de log binário na saída</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_max-allowed-packet">--max-allowed-packet</a></th> <td>Comprimento máximo do pacote para enviar ou receber do servidor</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_net-buffer-length">--net-buffer-length</a></th> <td>Tamanho do buffer para comunicação TCP/IP e socket</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_no-autocommit">--no-autocommit</a></th> <td>Inclua as instruções INSERT para cada tabela descarregada dentro de SET autocommit = 0 e as instruções COMMIT</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_no-create-db">--no-create-db</a></th> <td>Não escreva declarações CREATE DATABASE</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_no-create-info">--no-create-info</a></th> <td>Não escreva declarações CREATE TABLE que recriem cada tabela descarregada</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_no-data">--no-data</a></th> <td>Não despeje o conteúdo da mesa</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_no-defaults">--no-defaults</a></th> <td>Não ler arquivos de opção</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_no-set-names">--no-set-names</a></th> <td>O mesmo que --skip-set-charset</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_no-tablespaces">--no-tablespaces</a></th> <td>Não escreva quaisquer declarações de CREATE LOGFILE GROUP ou CREATE TABLESPACE no output</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_opt">--opt</a></th> <td>Abreviação para --add-drop-table --add-locks --create-options --disable-keys --extended-insert --lock-tables --quick --set-charset</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_order-by-primary">--order-by-primary</a></th> <td>Exclua as linhas de cada tabela, classificadas por sua chave primária ou pelo primeiro índice exclusivo</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_password">--senha</a></th> <td>Senha para usar ao se conectar ao servidor</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_pipe">--pipe</a></th> <td>Conecte-se ao servidor usando o pipe nomeado (apenas Windows)</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_plugin-dir">--plugin-dir</a></th> <td>Diretório onde os plugins são instalados</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_port">--port</a></th> <td>Número de porta TCP/IP para a conexão</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_print-defaults">--print-defaults</a></th> <td>Opções padrão de impressão</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_protocol">--protocolo</a></th> <td>Protocolo de transporte a ser utilizado</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_quick">--rápido</a></th> <td>Recuperar linhas de uma tabela do servidor uma linha de cada vez</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_quote-names">--quote-names</a></th> <td>Identificador de citações dentro de caracteres de backtick</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_replace">--replace</a></th> <td>Escreva declarações REPLACE em vez de declarações INSERT</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_result-file">--result-file</a></th> <td>Saída direta para um arquivo específico</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_routines">--rotinas</a></th> <td>Expor rotinas armazenadas (procedimentos e funções) de bancos de dados expostos</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_secure-auth">--secure-auth</a></th> <td>Não envie senhas para o servidor no formato antigo (pré-4.1)</td> <td></td> <td>Sim</td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_server-public-key-path">--server-public-key-path</a></th> <td>Nome do caminho para o arquivo que contém a chave pública RSA</td> <td>5.7.23</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_set-charset">--set-charset</a></th> <td>Adicione SET NAMES default_character_set ao output</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_set-gtid-purged">--set-gtid-purged</a></th> <td>Se adicionar SET @@GLOBAL.GTID_PURGED ao output</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_shared-memory-base-name">--shared-memory-base-name</a></th> <td>Nome de memória compartilhada para conexões de memória compartilhada (apenas Windows)</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_single-transaction">--single-transaction</a></th> <td>Emita uma instrução BEGIN SQL antes de drenar dados do servidor</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_add-drop-table">--skip-add-drop-table</a></th> <td>Não adicione uma instrução DROP TABLE antes de cada instrução CREATE TABLE</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_add-locks">--skip-add-locks</a></th> <td>Não adicione bloqueios</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_skip-comments">--skip-comments</a></th> <td>Não adicione comentários ao arquivo de dump</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_compact">--skip-compact</a></th> <td>Não produza uma saída mais compacta</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_disable-keys">--skip-disable-keys</a></th> <td>Não desative as teclas</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_extended-insert">--skip-extended-insert</a></th> <td>Desligue o recurso de inserção prolongada</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_skip-mysql-schema">--skip-mysql-schema</a></th> <td>Não perca o esquema do mysql</td> <td>5.7.36</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_skip-opt">--skip-opt</a></th> <td>Desative as opções definidas por --opt</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_quick">--skip-quick</a></th> <td>Não retorne linhas de uma tabela do servidor uma linha de cada vez</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_quote-names">--skip-quote-names</a></th> <td>Não cite identificadores</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_set-charset">--skip-set-charset</a></th> <td>Não escreva a declaração SET NAMES</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_triggers">--skip-triggers</a></th> <td>Não jogue gatilhos no lixo</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_tz-utc">--skip-tz-utc</a></th> <td>Desligue tz-utc</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_socket">--socket</a></th> <td>Arquivo de soquete Unix ou tubo nomeado do Windows a ser usado</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_ssl">--ssl</a></th> <td>Ative a criptografia de conexão</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_ssl">--ssl-ca</a></th> <td>Arquivo que contém a lista de Autoridades de Certificação SSL confiáveis</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_ssl">--ssl-capath</a></th> <td>Diretório que contém arquivos de certificados de Autoridade de Certificação SSL confiáveis</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_ssl">--ssl-cert</a></th> <td>Arquivo que contém o certificado X.509</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_ssl">--ssl-cipher</a></th> <td>Cifras permitidas para criptografia de conexão</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_ssl">--ssl-crl</a></th> <td>Arquivo que contém listas de revogação de certificados</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_ssl">--ssl-crlpath</a></th> <td>Diretório que contém arquivos de lista de revogação de certificados</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_ssl">--ssl-chave</a></th> <td>Arquivo que contém a chave X.509</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_ssl">--ssl-mode</a></th> <td>Estado de segurança desejado da conexão com o servidor</td> <td>5.7.11</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_ssl">--ssl-verify-server-cert</a></th> <td>Verifique o nome do host contra a identidade do Nome comum do certificado do servidor</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_tab">--tab</a></th> <td>Produza arquivos de dados separados por tabulação</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_tables">--mesas</a></th> <td>Opção --databases ou -B para substituir</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_tls-version">--tls-version</a></th> <td>Protocolos TLS permitidos para conexões criptografadas</td> <td>5.7.10</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_triggers">--triggers</a></th> <td>Triggers para descarte de cada tabela descartada</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_tz-utc">--tz-utc</a></th> <td>Adicione SET TIME_ZONE='+00:00' ao arquivo de dump</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_user">--user</a></th> <td>Nome do usuário do MySQL a ser usado ao se conectar ao servidor</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_verbose">--verbose</a></th> <td>Modo verbosos</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_version">--version</a></th> <td>Exibir informações da versão e sair</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_where">--onde</a></th> <td>Exclua apenas as linhas selecionadas pela condição WHERE fornecida</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqldump.html#option_mysqldump_xml">--xml</a></th> <td>Produzir saída XML</td> <td></td> <td></td> </tr></tbody></table>

#### Opções de conexão

O comando **mysqldump** faz login em um servidor MySQL para extrair informações. As seguintes opções especificam como se conectar ao servidor MySQL, seja na mesma máquina ou em um sistema remoto.

- `--bind-address=ip_address`

  <table frame="box" rules="all" summary="Propriedades para endereço de ligação"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--bind-address=ip_address</code>]]</td> </tr></tbody></table>

  Em um computador com várias interfaces de rede, use esta opção para selecionar qual interface usar para se conectar ao servidor MySQL.

- `--compress`, `-C`

  <table frame="box" rules="all" summary="Propriedades para comprimir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--compress[={OFF|ON}]</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">OFF</code>]]</td> </tr></tbody></table>

  Compressa todas as informações enviadas entre o cliente e o servidor, se possível. Consulte a Seção 4.2.6, “Controle de Compressão de Conexão”.

- `--default-auth=plugin`

  <table frame="box" rules="all" summary="Propriedades para autenticação padrão"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--default-auth=plugin</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>

  Uma dica sobre qual plugin de autenticação do lado do cliente deve ser usado. Veja a Seção 6.2.13, “Autenticação Personalizável”.

- `--enable-cleartext-plugin`

  <table frame="box" rules="all" summary="Propriedades para habilitar o plugin enable-cleartext"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--enable-cleartext-plugin</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.10</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">FALSE</code>]]</td> </tr></tbody></table>

  Ative o plugin de autenticação de texto claro `mysql_clear_password`. (Consulte a Seção 6.4.1.6, “Autenticação Pluggable de Texto Claro no Cliente”.)

  Essa opção foi adicionada no MySQL 5.7.10.

- `--get-server-public-key`

  <table frame="box" rules="all" summary="Propriedades para get-server-public-key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--get-server-public-key</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.23</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr></tbody></table>

  Peça à rede o par de chaves públicas necessário para a troca de senhas com base em pares de chaves RSA. Esta opção aplica-se a clientes que se autenticam com o plugin de autenticação `caching_sha2_password`. Para esse plugin, o servidor não envia a chave pública a menos que seja solicitado. Esta opção é ignorada para contas que não se autenticam com esse plugin. Também é ignorada se a troca de senha com base em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

  Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele terá precedência sobre `--get-server-public-key`.

  Para obter informações sobre o plugin `caching_sha2_password`, consulte a Seção 6.4.1.4, “Cacheamento de Autenticação Conectada SHA-2”.

  A opção `--get-server-public-key` foi adicionada no MySQL 5.7.23.

- `--host=host_name`, `-h host_name`

  <table frame="box" rules="all" summary="Propriedades para o anfitrião"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--host</code>]]</td> </tr></tbody></table>

  Arraste os dados do servidor MySQL para o host fornecido. O host padrão é `localhost`.

- `--login-path=nome`

  <table frame="box" rules="all" summary="Propriedades para o caminho de login"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--login-path=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>

  Leia as opções do caminho de login nomeado no arquivo de caminho de login `.mylogin.cnf`. Um “caminho de login” é um grupo de opções que contém opções que especificam qual servidor MySQL conectar e qual conta autenticar. Para criar ou modificar um arquivo de caminho de login, use o utilitário **mysql\_config\_editor**. Veja a Seção 4.6.6, “mysql\_config\_editor — Utilitário de Configuração MySQL”.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--password[=password]`, `-p[password]`

  <table frame="box" rules="all" summary="Propriedades para senha"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--password[=password]</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>

  A senha da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecido, o **mysqldump** solicitará uma senha. Se for fornecida, não deve haver **espaço** entre `--password=` ou `-p` e a senha que a segue. Se nenhuma opção de senha for especificada, o padrão é não enviar a senha.

  Especificar uma senha na linha de comando deve ser considerado inseguro. Para evitar fornecer a senha na linha de comando, use um arquivo de opção. Consulte a Seção 6.1.2.1, "Diretrizes para o Usuário Final sobre Segurança de Senhas".

  Para especificar explicitamente que não há senha e que o **mysqldump** não deve solicitar uma senha, use a opção `--skip-password`.

- `--pipe`, `-W`

  <table frame="box" rules="all" summary="Propriedades para tubulação"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--pipe</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>

  No Windows, conecte-se ao servidor usando um tubo nomeado. Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões por tubo nomeado. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.

- `--plugin-dir=dir_name`

  <table frame="box" rules="all" summary="Propriedades para endereço de ligação"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--bind-address=ip_address</code>]]</td> </tr></tbody></table>0

  O diretório onde procurar por plugins. Especifique esta opção se a opção `--default-auth` for usada para especificar um plugin de autenticação, mas o **mysqldump** não encontrá-lo. Veja a Seção 6.2.13, “Autenticação Personalizável”.

- `--port=port_num`, `-P port_num`

  <table frame="box" rules="all" summary="Propriedades para endereço de ligação"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--bind-address=ip_address</code>]]</td> </tr></tbody></table>1

  Para conexões TCP/IP, o número de porta a ser usado.

- `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table frame="box" rules="all" summary="Propriedades para endereço de ligação"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--bind-address=ip_address</code>]]</td> </tr></tbody></table>2

  O protocolo de transporte a ser usado para se conectar ao servidor. É útil quando os outros parâmetros de conexão normalmente resultam no uso de um protocolo diferente do que você deseja. Para obter detalhes sobre os valores permitidos, consulte a Seção 4.2.5, “Protocolos de Transporte de Conexão”.

- `--secure-auth`

  <table frame="box" rules="all" summary="Propriedades para endereço de ligação"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--bind-address=ip_address</code>]]</td> </tr></tbody></table>3

  Não envie senhas para o servidor no formato antigo (pré-4.1). Isso impede conexões, exceto para servidores que usam o formato de senha mais recente.

  A partir do MySQL 5.7.5, essa opção é desaconselhada; espere-se que ela seja removida em uma futura versão do MySQL. Ela está sempre habilitada e tentar desabilitá-la (`--skip-secure-auth`, `--secure-auth=0`) produz um erro. Antes do MySQL 5.7.5, essa opção está habilitada por padrão, mas pode ser desabilitada.

  Nota

  Senhas que usam o método de hashing pré-4.1 são menos seguras do que senhas que usam o método de hashing de senha nativo e devem ser evitadas. Senhas pré-4.1 são desaconselhadas e o suporte para elas foi removido no MySQL 5.7.5. Para instruções de atualização de conta, consulte a Seção 6.4.1.3, “Migrando para fora do hashing de senha pré-4.1 e do plugin mysql\_old\_password”.

- `--server-public-key-path=nome_do_arquivo`

  <table frame="box" rules="all" summary="Propriedades para endereço de ligação"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--bind-address=ip_address</code>]]</td> </tr></tbody></table>4

  O nome do caminho de um arquivo no formato PEM que contém uma cópia do lado do cliente da chave pública necessária pelo servidor para a troca de senhas com par de chaves RSA. Esta opção aplica-se a clientes que se autenticam com o plugin de autenticação `sha256_password` ou `caching_sha2_password`. Esta opção é ignorada para contas que não se autenticam com um desses plugins. Também é ignorada se a troca de senha com base em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

  Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele terá precedência sobre `--get-server-public-key`.

  Para `sha256_password`, essa opção só se aplica se o MySQL foi construído usando o OpenSSL.

  Para obter informações sobre os módulos `sha256_password` e `caching_sha2_password`, consulte a Seção 6.4.1.5, “Autenticação com Pluggable SHA-256” e a Seção 6.4.1.4, “Cache de Autenticação com Pluggable SHA-2”.

  A opção `--server-public-key-path` foi adicionada no MySQL 5.7.23.

- `--skip-mysql-schema`

  <table frame="box" rules="all" summary="Propriedades para endereço de ligação"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--bind-address=ip_address</code>]]</td> </tr></tbody></table>5

  Não elimine o esquema `mysql` quando o arquivo de dump for restaurado. Por padrão, o esquema é eliminado.

  Essa opção foi adicionada no MySQL 5.7.36.

- `--socket=caminho`, `-S caminho`

  <table frame="box" rules="all" summary="Propriedades para endereço de ligação"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--bind-address=ip_address</code>]]</td> </tr></tbody></table>6

  Para conexões ao `localhost`, o arquivo de socket Unix a ser usado ou, no Windows, o nome do tubo nomeado a ser usado.

  No Windows, essa opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões por named pipe. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.

- `--ssl*`

  As opções que começam com `--ssl` especificam se você deseja se conectar ao servidor usando criptografia e indicam onde encontrar as chaves e certificados SSL. Consulte Opções de comando para conexões criptografadas.

- `--tls-version=lista_protocolos`

  <table frame="box" rules="all" summary="Propriedades para endereço de ligação"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--bind-address=ip_address</code>]]</td> </tr></tbody></table>7

  Os protocolos TLS permitidos para conexões criptografadas. O valor é uma lista de um ou mais nomes de protocolos separados por vírgula. Os protocolos que podem ser nomeados para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para obter detalhes, consulte a Seção 6.3.2, “Protocolos e cifra TLS de conexão criptografada”.

  Essa opção foi adicionada no MySQL 5.7.10.

- `--user=user_name`, `-u user_name`

  <table frame="box" rules="all" summary="Propriedades para endereço de ligação"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--bind-address=ip_address</code>]]</td> </tr></tbody></table>8

  O nome de usuário da conta MySQL a ser usado para se conectar ao servidor.

#### Opção - Opções de arquivo

Essas opções são usadas para controlar quais arquivos de opção devem ser lidos.

- `--defaults-extra-file=nome_do_arquivo`

  <table frame="box" rules="all" summary="Propriedades para endereço de ligação"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--bind-address=ip_address</code>]]</td> </tr></tbody></table>9

  Leia este arquivo de opção após o arquivo de opção global, mas (no Unix) antes do arquivo de opção do usuário. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--defaults-file=nome_do_arquivo`

  <table frame="box" rules="all" summary="Propriedades para comprimir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--compress[={OFF|ON}]</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">OFF</code>]]</td> </tr></tbody></table>0

  Use apenas o arquivo de opção fornecido. Se o arquivo não existir ou estiver inacessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

  Exceção: Mesmo com `--defaults-file`, os programas cliente leem `.mylogin.cnf`.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--defaults-group-suffix=str`

  <table frame="box" rules="all" summary="Propriedades para comprimir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--compress[={OFF|ON}]</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">OFF</code>]]</td> </tr></tbody></table>1

  Leia não apenas os grupos de opções usuais, mas também grupos com os nomes usuais e um sufixo de *`str`*. Por exemplo, **mysqldump** normalmente lê os grupos `[client]` e `[mysqldump]`. Se esta opção for fornecida como `--defaults-group-suffix=_other`, **mysqldump** também lê os grupos `[client_other]` e `[mysqldump_other]`.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--no-defaults`

  <table frame="box" rules="all" summary="Propriedades para comprimir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--compress[={OFF|ON}]</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">OFF</code>]]</td> </tr></tbody></table>2

  Não leia nenhum arquivo de opções. Se a inicialização do programa falhar devido à leitura de opções desconhecidas de um arquivo de opções, o `--no-defaults` pode ser usado para impedir que sejam lidas.

  A exceção é que o arquivo `.mylogin.cnf` é lido em todos os casos, se ele existir. Isso permite que as senhas sejam especificadas de uma maneira mais segura do que na linha de comando, mesmo quando o `--no-defaults` é usado. Para criar `.mylogin.cnf`, use o utilitário **mysql\_config\_editor**. Veja a Seção 4.6.6, “mysql\_config\_editor — Ferramenta de Configuração do MySQL”.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--print-defaults`

  <table frame="box" rules="all" summary="Propriedades para comprimir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--compress[={OFF|ON}]</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">OFF</code>]]</td> </tr></tbody></table>3

  Imprima o nome do programa e todas as opções que ele obtém a partir de arquivos de opção.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

#### Opções de DDL

Os cenários de uso do **mysqldump** incluem a configuração de uma nova instância completa do MySQL (incluindo tabelas de banco de dados) e a substituição de dados em uma instância existente por bancos de dados e tabelas existentes. As seguintes opções permitem que você especifique quais coisas devem ser desmontadas e configuradas ao restaurar um dump, codificando várias instruções DDL dentro do arquivo de dump.

- `--add-drop-database`

  <table frame="box" rules="all" summary="Propriedades para comprimir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--compress[={OFF|ON}]</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">OFF</code>]]</td> </tr></tbody></table>4

  Escreva uma instrução `DROP DATABASE` antes de cada instrução `CREATE DATABASE`. Esta opção é normalmente usada em conjunto com a opção `--all-databases` ou `--databases`, pois nenhuma instrução `CREATE DATABASE` é escrita a menos que uma dessas opções seja especificada.

- `--add-drop-table`

  <table frame="box" rules="all" summary="Propriedades para comprimir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--compress[={OFF|ON}]</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">OFF</code>]]</td> </tr></tbody></table>5

  Escreva uma declaração `DROP TABLE` antes de cada declaração `CREATE TABLE`.

- `--add-drop-trigger`

  <table frame="box" rules="all" summary="Propriedades para comprimir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--compress[={OFF|ON}]</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">OFF</code>]]</td> </tr></tbody></table>6

  Escreva uma declaração `DROP TRIGGER` antes de cada declaração `CREATE TRIGGER`.

- `--all-tablespaces`, `-Y`

  <table frame="box" rules="all" summary="Propriedades para comprimir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--compress[={OFF|ON}]</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">OFF</code>]]</td> </tr></tbody></table>7

  Adiciona a uma varredura de tabela todas as instruções SQL necessárias para criar quaisquer espaços de tabela usados por uma tabela `NDB`. Essas informações não estão incluídas de outra forma na saída do **mysqldump**. Esta opção atualmente é relevante apenas para tabelas do NDB Cluster, que não são suportadas no MySQL 5.7.

- `--no-create-db`, `-n`

  <table frame="box" rules="all" summary="Propriedades para comprimir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--compress[={OFF|ON}]</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">OFF</code>]]</td> </tr></tbody></table>8

  Retire as instruções `CREATE DATABASE` que, de outra forma, estão incluídas na saída se a opção `--databases` ou `--all-databases` for fornecida.

- `--no-create-info`, `-t`

  <table frame="box" rules="all" summary="Propriedades para comprimir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--compress[={OFF|ON}]</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">OFF</code>]]</td> </tr></tbody></table>9

  Não escreva declarações `CREATE TABLE` que criem cada tabela descarregada.

  Nota

  Essa opção **não** exclui declarações que criam grupos de arquivos de log ou espaços de tabelas do resultado do **mysqldump**. No entanto, você pode usar a opção `--no-tablespaces` para esse propósito.

- `--no-tablespaces`, `-y`

  <table frame="box" rules="all" summary="Propriedades para autenticação padrão"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--default-auth=plugin</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>0

  Essa opção suprime todos os comandos `CREATE LOGFILE GROUP` e `CREATE TABLESPACE` na saída do **mysqldump**.

- `--replace`

  <table frame="box" rules="all" summary="Propriedades para autenticação padrão"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--default-auth=plugin</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>1

  Escreva declarações `REPLACE` em vez de declarações `INSERT`.

#### Opções de depuração

As seguintes opções imprimem informações de depuração, codificam informações de depuração no arquivo de depuração ou permitem que a operação de depuração prossiga independentemente de possíveis problemas.

- `--allow-keywords`

  <table frame="box" rules="all" summary="Propriedades para autenticação padrão"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--default-auth=plugin</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>2

  Permita a criação de nomes de colunas que sejam palavras-chave. Isso funciona prefixando cada nome de coluna com o nome da tabela.

- `--comments`, `-i`

  <table frame="box" rules="all" summary="Propriedades para autenticação padrão"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--default-auth=plugin</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>3

  Escreva informações adicionais no arquivo de dump, como a versão do programa, a versão do servidor e o host. Esta opção está habilitada por padrão. Para suprimir essas informações adicionais, use `--skip-comments`.

- `--debug[=opções_de_depuração]`, `-# [opções_de_depuração]`

  <table frame="box" rules="all" summary="Propriedades para autenticação padrão"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--default-auth=plugin</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>4

  Escreva um log de depuração. Uma string típica de *`debug_options`* é `d:t:o,nome_do_arquivo`. O valor padrão é `d:t:o,/tmp/mysqldump.trace`.

  Esta opção está disponível apenas se o MySQL foi compilado com `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são compilados com esta opção.

- `--debug-check`

  <table frame="box" rules="all" summary="Propriedades para autenticação padrão"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--default-auth=plugin</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>5

  Imprima algumas informações de depuração quando o programa sair.

  Esta opção está disponível apenas se o MySQL foi compilado com `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são compilados com esta opção.

- `--debug-info`

  <table frame="box" rules="all" summary="Propriedades para autenticação padrão"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--default-auth=plugin</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>6

  Imprima informações de depuração, estatísticas de uso de memória e CPU quando o programa sair.

  Esta opção está disponível apenas se o MySQL foi compilado com `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são compilados com esta opção.

- `--dump-date`

  <table frame="box" rules="all" summary="Propriedades para autenticação padrão"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--default-auth=plugin</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>7

  Se a opção `--comments` for fornecida, o **mysqldump** produz um comentário no final do dump da seguinte forma:

  ```sql
  -- Dump completed on DATE
  ```

  No entanto, a data faz com que os arquivos de dump obtidos em momentos diferentes pareçam diferentes, mesmo que os dados sejam idênticos. `--dump-date` e `--skip-dump-date` controlam se a data é adicionada ao comentário. O padrão é `--dump-date` (inclua a data no comentário). `--skip-dump-date` suprime a impressão da data.

- `--force`, `-f`

  <table frame="box" rules="all" summary="Propriedades para autenticação padrão"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--default-auth=plugin</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>8

  Ignore todos os erros; continue mesmo que um erro SQL ocorra durante um dump de tabela.

  Uma das utilizações dessa opção é fazer com que o **mysqldump** continue executando mesmo quando ele encontrar uma visão que se tornou inválida porque a definição faz referência a uma tabela que foi removida. Sem `--force`, o **mysqldump** sai com uma mensagem de erro. Com `--force`, o **mysqldump** exibe a mensagem de erro, mas também escreve um comentário SQL contendo a definição da visão no resultado do dump e continua executando.

  Se a opção `--ignore-error` também for fornecida para ignorar erros específicos, a opção `--force` terá precedência.

- `--log-error=nome_do_arquivo`

  <table frame="box" rules="all" summary="Propriedades para autenticação padrão"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--default-auth=plugin</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>9

  Registre avisos e erros anexando-os ao arquivo nomeado. O padrão é não registrar.

- `--skip-comments`

  <table frame="box" rules="all" summary="Propriedades para habilitar o plugin enable-cleartext"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--enable-cleartext-plugin</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.10</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">FALSE</code>]]</td> </tr></tbody></table>0

  Veja a descrição da opção `--comments`.

- `--verbose`, `-v`

  <table frame="box" rules="all" summary="Propriedades para habilitar o plugin enable-cleartext"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--enable-cleartext-plugin</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.10</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">FALSE</code>]]</td> </tr></tbody></table>1

  Modo verbose. Imprima mais informações sobre o que o programa faz.

#### Opções de Ajuda

As seguintes opções exibem informações sobre o próprio comando **mysqldump**.

- `--help`, `-?`

  <table frame="box" rules="all" summary="Propriedades para habilitar o plugin enable-cleartext"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--enable-cleartext-plugin</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.10</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">FALSE</code>]]</td> </tr></tbody></table>2

  Exiba uma mensagem de ajuda e saia.

- `--version`, `-V`

  <table frame="box" rules="all" summary="Propriedades para habilitar o plugin enable-cleartext"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--enable-cleartext-plugin</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.10</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">FALSE</code>]]</td> </tr></tbody></table>3

  Exibir informações da versão e sair.

#### Opções de internacionalização

As opções a seguir alteram a forma como o comando **mysqldump** representa dados de caracteres com configurações de idioma nacional.

- `--character-sets-dir=dir_name`

  <table frame="box" rules="all" summary="Propriedades para habilitar o plugin enable-cleartext"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--enable-cleartext-plugin</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.10</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">FALSE</code>]]</td> </tr></tbody></table>4

  O diretório onde os conjuntos de caracteres são instalados. Consulte a Seção 10.15, “Configuração de Conjunto de Caracteres”.

- `--default-character-set=charset_name`

  <table frame="box" rules="all" summary="Propriedades para habilitar o plugin enable-cleartext"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--enable-cleartext-plugin</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.10</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">FALSE</code>]]</td> </tr></tbody></table>5

  Use *`charset_name`* como o conjunto de caracteres padrão. Veja a Seção 10.15, “Configuração do Conjunto de Caracteres”. Se nenhum conjunto de caracteres for especificado, o **mysqldump** usa `utf8`.

- `--no-set-names`, `-N`

  <table frame="box" rules="all" summary="Propriedades para habilitar o plugin enable-cleartext"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--enable-cleartext-plugin</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.10</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">FALSE</code>]]</td> </tr></tbody></table>6

  Desativa a configuração `--set-charset`, o mesmo que especificar `--skip-set-charset`.

- `--set-charset`

  <table frame="box" rules="all" summary="Propriedades para habilitar o plugin enable-cleartext"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--enable-cleartext-plugin</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.10</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">FALSE</code>]]</td> </tr></tbody></table>7

  Escreva `SET NAMES default_character_set` na saída. Esta opção está habilitada por padrão. Para suprimir a declaração `SET NAMES`, use `--skip-set-charset`.

#### Opções de replicação

O comando **mysqldump** é frequentemente usado para criar uma instância vazia ou uma instância que inclua dados em um servidor de replicação em uma configuração de replicação. As seguintes opções se aplicam ao descarregamento e ao restabelecimento de dados em servidores de origem de replicação e servidores de replicação.

- `--apply-slave-statements`

  <table frame="box" rules="all" summary="Propriedades para habilitar o plugin enable-cleartext"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--enable-cleartext-plugin</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.10</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">FALSE</code>]]</td> </tr></tbody></table>8

  Para um dump de replicação produzido com a opção `--dump-slave`, adicione uma declaração `STOP SLAVE` antes da declaração `CHANGE MASTER TO` e uma declaração `START SLAVE` no final da saída.

- `--delete-master-logs`

  <table frame="box" rules="all" summary="Propriedades para habilitar o plugin enable-cleartext"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--enable-cleartext-plugin</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.10</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">FALSE</code>]]</td> </tr></tbody></table>9

  Em um servidor de replicação de fonte, exclua os logs binários enviando uma instrução `PURGE BINARY LOGS` para o servidor após realizar a operação de dump. Esta opção requer o privilégio `RELOAD`, além de privilégios suficientes para executar essa instrução. Esta opção habilita automaticamente `--master-data`.

- `--dump-slave[=valor]`

  <table frame="box" rules="all" summary="Propriedades para get-server-public-key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--get-server-public-key</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.23</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr></tbody></table>0

  Esta opção é semelhante à `--master-data`, exceto que é usada para drenar um servidor de réplica para produzir um arquivo de dump que pode ser usado para configurar outro servidor como uma réplica que tenha a mesma fonte que o servidor descarregado. Isso faz com que a saída do dump inclua uma declaração `CHANGE MASTER TO` que indica as coordenadas do log binário (nome do arquivo e posição) da fonte da réplica descarregada. A declaração `CHANGE MASTER TO` lê os valores de `Relay_Master_Log_File` e `Exec_Master_Log_Pos` da saída do `SHOW SLAVE STATUS` e os usa para `MASTER_LOG_FILE` e `MASTER_LOG_POS`, respectivamente. Essas são as coordenadas do servidor fonte do qual a réplica deve começar a replicar.

  Nota

  Inconsistências na sequência das transações do log de retransmissão que foram executadas podem causar o uso da posição errada. Consulte a Seção 16.4.1.32, “Replicação e Inconsistências de Transações”, para obter mais informações.

  A opção `--dump-slave` faz com que as coordenadas do servidor de origem sejam usadas, em vez das do servidor descarregado, como faz a opção `--master-data`. Além disso, ao especificar essa opção, ela substitui a opção `--master-data`, se estiver presente, e a ignora efetivamente.

  Aviso

  Esta opção não deve ser usada se o servidor onde o dump vai ser aplicado estiver usando `gtid_mode=ON` e `MASTER_AUTOPOSITION=1`.

  O valor da opção é tratado da mesma maneira que para `--master-data` (definir um valor nulo ou 1 faz com que uma instrução `CHANGE MASTER TO` seja escrita no dump, definir 2 faz com que a instrução seja escrita, mas encapsulada em comentários SQL) e tem o mesmo efeito que `--master-data` em termos de habilitar ou desabilitar outras opções e de como o bloqueio é tratado.

  Essa opção faz com que o **mysqldump** pare o fio de replicação do SQL antes do dump e o reinicie novamente depois.

  `--dump-slave` envia uma declaração `SHOW SLAVE STATUS` para o servidor para obter informações, portanto, requer privilégios suficientes para executar essa declaração.

  Em conjunto com `--dump-slave`, as opções `--apply-slave-statements` e `--include-master-host-port` também podem ser usadas.

- `--include-master-host-port`

  <table frame="box" rules="all" summary="Propriedades para get-server-public-key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--get-server-public-key</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.23</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr></tbody></table>1

  Para a declaração `CHANGE MASTER TO` em um dump de replicação produzido com a opção `--dump-slave`, adicione as opções `MASTER_HOST` e `MASTER_PORT` para o nome do host e o número de porta TCP/IP da fonte da replicação.

- `--master-data[=valor]`

  <table frame="box" rules="all" summary="Propriedades para get-server-public-key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--get-server-public-key</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.23</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr></tbody></table>2

  Use esta opção para descartar um servidor de replicação de origem para produzir um arquivo de dump que pode ser usado para configurar outro servidor como uma réplica do servidor de origem. Isso faz com que a saída do dump inclua uma declaração `CHANGE MASTER TO` que indica as coordenadas do log binário (nome do arquivo e posição) do servidor descartado. Essas são as coordenadas do servidor de origem a partir das quais a réplica deve começar a replicar após você carregar o arquivo de dump na réplica.

  Se o valor da opção for 2, a instrução `CHANGE MASTER TO` é escrita como um comentário SQL e, portanto, é apenas informativa; ela não tem efeito quando o arquivo de dump é recarregado. Se o valor da opção for 1, a instrução não é escrita como um comentário e tem efeito quando o arquivo de dump é recarregado. Se nenhum valor de opção for especificado, o valor padrão é 1.

  `--master-data` envia uma declaração `SHOW MASTER STATUS` para o servidor para obter informações, portanto, requer privilégios suficientes para executar essa declaração. Esta opção também requer o privilégio `RELOAD` e o log binário deve estar habilitado.

  A opção `--master-data` desativa automaticamente `--lock-tables`. Ela também ativa `--lock-all-tables`, a menos que `--single-transaction` também seja especificado, caso em que uma bloqueio de leitura global é adquirido apenas por um curto período no início do dump (veja a descrição para `--single-transaction`). Em todos os casos, qualquer ação nos logs acontece no momento exato do dump.

  Também é possível configurar uma replica descarregando uma replica existente da fonte, usando a opção `--dump-slave`, que substitui `--master-data` e faz com que ela seja ignorada se ambas as opções forem usadas.

- `--set-gtid-purged=valor`

  <table frame="box" rules="all" summary="Propriedades para get-server-public-key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--get-server-public-key</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.23</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr></tbody></table>3

  Essa opção permite o controle sobre as informações de ID de transação global (GTID) escritas no arquivo de depuração, indicando se deve adicionar uma declaração `SET @@GLOBAL.gtid_purged` à saída. Essa opção também pode causar a escrita de uma declaração na saída que desabilita o registro binário enquanto o arquivo de depuração está sendo recarregado.

  A tabela a seguir mostra os valores de opção permitidos. O valor padrão é `AUTO`.

  <table frame="box" rules="all" summary="Propriedades para get-server-public-key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--get-server-public-key</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.23</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr></tbody></table>4

  Um descarte parcial de um servidor que está usando a replicação baseada em GTID requer a especificação da opção `--set-gtid-purged={ON|OFF}`. Use `ON` se a intenção for implantar uma nova réplica de replicação usando apenas alguns dos dados do servidor descartado. Use `OFF` se a intenção for reparar uma tabela copiando-a dentro de uma topologia. Use `OFF` se a intenção for copiar uma tabela entre topologias de replicação que são disjuntas e para que permaneçam assim.

  A opção `--set-gtid-purged` tem o seguinte efeito no registro binário quando o arquivo de dump é recarregado:

  - `--set-gtid-purged=OFF`: `SET @@SESSION.SQL_LOG_BIN=0;` não é adicionado ao resultado.

  - `--set-gtid-purged=ON`: `SET @@SESSION.SQL_LOG_BIN=0;` é adicionado ao resultado.

  - `--set-gtid-purged=AUTO`: `SET @@SESSION.SQL_LOG_BIN=0;` é adicionado ao resultado se os GTIDs estiverem habilitados no servidor que você está fazendo o backup (ou seja, se `AUTO` for avaliado como `ON`).

  Usar essa opção com a opção `--single-transaction` pode levar a inconsistências na saída. Se `--set-gtid-purged=ON` for necessário, ela pode ser usada com `--lock-all-tables`, mas isso pode impedir consultas paralelas enquanto o **mysqldump** estiver sendo executado.

  Não é recomendado carregar um arquivo de dump quando os GTIDs estão habilitados no servidor (`gtid_mode=ON`), se o seu arquivo de dump incluir tabelas do sistema. O **mysqldump** emite instruções DML para as tabelas do sistema que usam o motor de armazenamento não transacional MyISAM, e essa combinação não é permitida quando os GTIDs estão habilitados. Além disso, esteja ciente de que carregar um arquivo de dump de um servidor com GTIDs habilitados para outro servidor com GTIDs habilitados gera identificadores de transação diferentes.

#### Opções de formato

As seguintes opções especificam como representar todo o arquivo de registro ou certos tipos de dados no arquivo de registro. Elas também controlam se certas informações opcionais são escritas no arquivo de registro.

- `--compact`

  <table frame="box" rules="all" summary="Propriedades para get-server-public-key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--get-server-public-key</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.23</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr></tbody></table>5

  Produza uma saída mais compacta. Esta opção habilita as opções `--skip-add-drop-table`, `--skip-add-locks`, `--skip-comments`, `--skip-disable-keys` e `--skip-set-charset`.

- `--compatible=nome`

  <table frame="box" rules="all" summary="Propriedades para get-server-public-key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--get-server-public-key</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.23</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr></tbody></table>6

  Produza uma saída mais compatível com outros sistemas de banco de dados ou com servidores MySQL mais antigos. O valor de *`name`* pode ser `ansi`, `mysql323`, `mysql40`, `postgresql`, `oracle`, `mssql`, `db2`, `maxdb`, `no_key_options`, `no_table_options` ou `no_field_options`. Para usar vários valores, separe-os por vírgula. Esses valores têm o mesmo significado das opções correspondentes para definir o modo SQL do servidor. Veja a Seção 5.1.10, “Modos SQL do Servidor”.

  Esta opção não garante compatibilidade com outros servidores. Ela apenas habilita os valores do modo SQL que estão atualmente disponíveis para tornar a saída do dump mais compatível. Por exemplo, `--compatible=oracle` não mapeia tipos de dados para tipos Oracle ou usa a sintaxe de comentário Oracle.

- `--complete-insert`, `-c`

  <table frame="box" rules="all" summary="Propriedades para get-server-public-key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--get-server-public-key</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.23</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr></tbody></table>7

  Use declarações `INSERT` completas que incluam os nomes das colunas.

- `--create-options`

  <table frame="box" rules="all" summary="Propriedades para get-server-public-key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--get-server-public-key</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.23</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr></tbody></table>8

  Inclua todas as opções de tabela específicas do MySQL nas instruções `CREATE TABLE`.

- `--campos-terminados-por=...`, `--campos-envolvidos-por=...`, `--campos-opcionalmente-envolvidos-por=...`, `--campos-e-escapedos-por=...`

  <table frame="box" rules="all" summary="Propriedades para get-server-public-key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--get-server-public-key</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.23</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr></tbody></table>9

  <table frame="box" rules="all" summary="Propriedades para o anfitrião"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--host</code>]]</td> </tr></tbody></table>0

  <table frame="box" rules="all" summary="Propriedades para o anfitrião"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--host</code>]]</td> </tr></tbody></table>1

  <table frame="box" rules="all" summary="Propriedades para o anfitrião"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--host</code>]]</td> </tr></tbody></table>2

  Essas opções são usadas com a opção `--tab` e têm o mesmo significado das cláusulas `FIELDS` correspondentes para `LOAD DATA`. Veja a Seção 13.2.6, “Instrução LOAD DATA”.

- `--hex-blob`

  <table frame="box" rules="all" summary="Propriedades para o anfitrião"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--host</code>]]</td> </tr></tbody></table>3

  Arrume colunas binárias usando notação hexadecimal (por exemplo, `'abc'` se torna `0x616263`). Os tipos de dados afetados são os tipos `BINARY`, `VARBINARY`, `BLOB`, `BIT`, todos os tipos de dados espaciais e outros tipos de dados não binários quando usados com o conjunto de caracteres `binary`.

  A opção `--hex-blob` é ignorada quando a opção `--tab` é usada.

- `--lines-terminated-by=...`

  <table frame="box" rules="all" summary="Propriedades para o anfitrião"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--host</code>]]</td> </tr></tbody></table>4

  Esta opção é usada com a opção `--tab` e tem o mesmo significado que a cláusula `LINES` correspondente para `LOAD DATA`. Veja a Seção 13.2.6, “Instrução LOAD DATA”.

- `--quote-names`, `-Q`

  <table frame="box" rules="all" summary="Propriedades para o anfitrião"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--host</code>]]</td> </tr></tbody></table>5

  Identifique os identificadores (como nomes de banco de dados, tabelas e colunas) entre \`\`\` caracteres. Se o modo SQL `ANSI_QUOTES` estiver habilitado, os identificadores são citados entre caracteres `"`. Esta opção está habilitada por padrão. Pode ser desabilitada com `--skip-quote-names`, mas esta opção deve ser dada após qualquer opção como `--compatible` que possa habilitar `--quote-names`.

- `--result-file=file_name`, `-r file_name`

  <table frame="box" rules="all" summary="Propriedades para o anfitrião"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--host</code>]]</td> </tr></tbody></table>6

  Saída direta para o arquivo nomeado. O arquivo de resultado é criado e seus conteúdos anteriores são sobrescritos, mesmo que um erro ocorra durante a geração do dump.

  Essa opção deve ser usada no Windows para evitar que os caracteres de nova linha `\n` sejam convertidos em sequências de retorno de carro/nova linha `\r\n`.

- `--tab=nome_do_diretório`, `-T nome_do_diretório`

  <table frame="box" rules="all" summary="Propriedades para o anfitrião"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--host</code>]]</td> </tr></tbody></table>7

  Produza arquivos de dados no formato de texto separados por tabulação. Para cada tabela descarregada, o **mysqldump** cria um arquivo `tbl_name.sql` que contém a instrução `CREATE TABLE` que cria a tabela, e o servidor escreve um arquivo `tbl_name.txt` que contém seus dados. O valor da opção é o diretório onde os arquivos serão escritos.

  Nota

  Esta opção deve ser usada apenas quando o **mysqldump** é executado na mesma máquina que o servidor **mysqld**. Como o servidor cria arquivos `*.txt` no diretório que você especifica, o diretório deve ser legível pelo servidor e a conta MySQL que você usa deve ter o privilégio `FILE`. Como o **mysqldump** cria `*.sql` no mesmo diretório, ele deve ser legível pela conta de login do seu sistema.

  Por padrão, os arquivos de dados `.txt` são formatados usando caracteres de tabulação entre os valores das colunas e uma nova linha no final de cada linha. O formato pode ser especificado explicitamente usando as opções `--fields-xxx` e `--lines-terminated-by`.

  Os valores das colunas são convertidos para o conjunto de caracteres especificado pela opção `--default-character-set`.

- `--tz-utc`

  <table frame="box" rules="all" summary="Propriedades para o anfitrião"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--host</code>]]</td> </tr></tbody></table>8

  Essa opção permite que as colunas `TIMESTAMP` sejam descarregadas e recarregadas entre servidores em diferentes fusos horários. O **mysqldump** define seu fuso horário de conexão como UTC e adiciona `SET TIME_ZONE='+00:00'` ao arquivo de dump. Sem essa opção, as colunas `TIMESTAMP` são descarregadas e recarregadas nos fusos horários locais dos servidores de origem e destino, o que pode causar alterações nos valores se os servidores estiverem em fusos horários diferentes. O `--tz-utc` também protege contra alterações devido ao horário de verão. O `--tz-utc` está habilitado por padrão. Para desabilitá-lo, use `--skip-tz-utc`.

- `--xml`, `-X`

  <table frame="box" rules="all" summary="Propriedades para o anfitrião"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--host</code>]]</td> </tr></tbody></table>9

  Escreva a saída do dump em formato bem formado de XML.

  **`NULL`, `'NULL'` e Valores Vazios**: Para uma coluna com o nome *`column_name`*, o valor `NULL`, uma string vazia e o valor da string `'NULL'` são distinguidos uns dos outros na saída gerada por esta opção da seguinte forma.

  <table frame="box" rules="all" summary="Propriedades para o caminho de login"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--login-path=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>0

  A saída do cliente **mysql** quando executado com a opção `--xml` também segue as regras anteriores. (Veja a Seção 4.5.1.1, “Opções do Cliente mysql”.)

  A saída XML do **mysqldump** inclui o espaço de nomes XML, conforme mostrado aqui:

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

#### Opções de filtragem

As seguintes opções controlam quais tipos de objetos do esquema são escritos no arquivo de dump: por categoria, como gatilhos ou eventos; por nome, por exemplo, escolhendo quais bancos de dados e tabelas devem ser dumpados; ou até mesmo filtrando linhas dos dados da tabela usando uma cláusula `WHERE`.

- `--all-databases`, `-A`

  <table frame="box" rules="all" summary="Propriedades para o caminho de login"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--login-path=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>1

  Exclua todas as tabelas em todos os bancos de dados. Isso é o mesmo que usar a opção `--databases` e nomear todos os bancos de dados na linha de comando.

- `--databases`, `-B`

  <table frame="box" rules="all" summary="Propriedades para o caminho de login"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--login-path=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>2

  Exclua várias bases de dados. Normalmente, o **mysqldump** trata o argumento de nome do primeiro banco de dados na linha de comando como um nome de banco de dados e os nomes seguintes como nomes de tabelas. Com esta opção, ele trata todos os argumentos de nome como nomes de bancos de dados. As instruções `CREATE DATABASE` e `USE` são incluídas na saída antes de cada novo banco de dados.

  Essa opção pode ser usada para descartar os bancos de dados `INFORMATION_SCHEMA` e `performance_schema`, que normalmente não são descartados mesmo com a opção `--all-databases`. (Use também a opção `--skip-lock-tables`.)

- `--events`, `-E`

  <table frame="box" rules="all" summary="Propriedades para o caminho de login"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--login-path=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>3

  Inclua eventos do Agendamento de Eventos para as bases de dados descartadas na saída. Esta opção requer os privilégios `EVENT` para essas bases de dados.

  A saída gerada usando `--events` contém instruções `CREATE EVENT` para criar os eventos. No entanto, essas instruções não incluem atributos como os timestamps de criação e modificação do evento, então, quando os eventos são recarregados, eles são criados com timestamps iguais ao tempo de recarga.

  Se você precisar criar eventos com seus atributos de data e hora originais, não use `--events`. Em vez disso, faça o dump e o reload do conteúdo da tabela `mysql.event` diretamente, usando uma conta MySQL que tenha os privilégios apropriados para o banco de dados `mysql`.

- `--ignore-error=error[,error]...`

  <table frame="box" rules="all" summary="Propriedades para o caminho de login"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--login-path=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>4

  Ignore os erros especificados. O valor da opção é uma lista de números de erro separados por vírgula, especificando os erros a serem ignorados durante a execução do **mysqldump**. Se a opção `--force` também for fornecida para ignorar todos os erros, a `--force` tem precedência.

- `--ignore-table=db_name.tbl_name`

  <table frame="box" rules="all" summary="Propriedades para o caminho de login"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--login-path=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>5

  Não descarte a tabela fornecida, que deve ser especificada usando tanto os nomes do banco de dados quanto da tabela. Para ignorar múltiplas tabelas, use essa opção várias vezes. Essa opção também pode ser usada para ignorar visualizações.

- `--no-data`, `-d`

  <table frame="box" rules="all" summary="Propriedades para o caminho de login"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--login-path=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>6

  Não escreva nenhuma informação da linha da tabela (ou seja, não descarregue o conteúdo da tabela). Isso é útil se você quiser descarregar apenas a instrução `CREATE TABLE` para a tabela (por exemplo, para criar uma cópia vazia da tabela carregando o arquivo de descarregamento).

- `--routines`, `-R`

  <table frame="box" rules="all" summary="Propriedades para o caminho de login"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--login-path=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>7

  Inclua rotinas armazenadas (procedimentos e funções) para os bancos de dados descartados na saída. Esta opção requer o privilégio `SELECT` para a tabela `mysql.proc`.

  A saída gerada usando `--routines` contém instruções `CREATE PROCEDURE` e `CREATE FUNCTION` para criar as rotinas. No entanto, essas instruções não incluem atributos como os timestamps de criação e modificação da rotina, então, quando as rotinas são recarregadas, elas são criadas com timestamps iguais ao tempo de recarga.

  Se você precisar criar rotinas com seus atributos de data e hora originais, não use `--routines`. Em vez disso, faça o dump e o reload do conteúdo da tabela `mysql.proc` diretamente, usando uma conta MySQL que tenha os privilégios apropriados para o banco de dados `mysql`.

- `--tables`

  <table frame="box" rules="all" summary="Propriedades para o caminho de login"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--login-path=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>8

  Supere a opção `--databases` ou `-B`. O **mysqldump** considera todos os argumentos de nome que seguem a opção como nomes de tabela.

- `--triggers`

  <table frame="box" rules="all" summary="Propriedades para o caminho de login"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--login-path=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>9

  Inclua os gatilhos de cada tabela descarregada na saída. Esta opção está habilitada por padrão; desabilite-a com `--skip-triggers`.

  Para poder descartar os gatilhos de uma tabela, você deve ter o privilégio `TRIGGER` para a tabela.

  Múltiplos gatilhos são permitidos. O **mysqldump** grava os gatilhos na ordem de ativação, para que, quando o arquivo de dump for carregado novamente, os gatilhos sejam criados na mesma ordem de ativação. No entanto, se um arquivo de dump do **mysqldump** contiver múltiplos gatilhos para uma tabela que tenham o mesmo evento de gatilho e hora de ação, ocorrerá um erro para tentativas de carregar o arquivo de dump em um servidor mais antigo que não suporte múltiplos gatilhos. (Para uma solução alternativa, consulte a Seção 2.11.3, “Notas de Desempenho”; você pode converter os gatilhos para serem compatíveis com servidores mais antigos.)

- `--where='where_condition'`, `-w 'where_condition'`

  <table frame="box" rules="all" summary="Propriedades para senha"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--password[=password]</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>0

  Exclua apenas as linhas selecionadas pela condição `WHERE` fornecida. As aspas ao redor da condição são obrigatórias se ela contiver espaços ou outros caracteres especiais para o interpretador do comando.

  Exemplos:

  ```sql
  --where="user='jimf'"
  -w"userid>1"
  -w"userid<1"
  ```

#### Opções de desempenho

As seguintes opções são as mais relevantes para o desempenho, especialmente das operações de restauração. Para conjuntos de dados grandes, a operação de restauração (processamento das instruções `INSERT` no arquivo de dump) é a parte mais demorada. Quando é urgente restaurar os dados rapidamente, planeje e teste o desempenho desta etapa com antecedência. Para tempos de restauração medidos em horas, você pode preferir uma solução de backup e restauração alternativa, como o MySQL Enterprise Backup para bancos de dados `InnoDB` e de uso misto.

O desempenho também é afetado pelas opções transacionais, principalmente para a operação de dump.

- `--disable-keys`, `-K`

  <table frame="box" rules="all" summary="Propriedades para senha"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--password[=password]</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>1

  Para cada tabela, rode as instruções `INSERT` com as instruções `/*!40000 ALTER TABLE tbl_name DISABLE KEYS */;` e `/*!40000 ALTER TABLE tbl_name ENABLE KEYS */;` Isso torna o carregamento do arquivo de dump mais rápido, pois os índices são criados após todas as linhas serem inseridas. Esta opção é eficaz apenas para índices não únicos de tabelas `MyISAM`.

- `--extended-insert`, `-e`

  <table frame="box" rules="all" summary="Propriedades para senha"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--password[=password]</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>2

  Escreva instruções `INSERT` usando a sintaxe de múltiplas linhas que inclui várias listas `VALUES`. Isso resulta em um arquivo de dump menor e acelera as inserções quando o arquivo é carregado novamente.

- `--insert-ignore`

  <table frame="box" rules="all" summary="Propriedades para senha"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--password[=password]</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>3

  Escreva instruções `INSERT IGNORE` em vez de instruções `INSERT`.

- `--max-allowed-packet=valor`

  <table frame="box" rules="all" summary="Propriedades para senha"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--password[=password]</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>4

  O tamanho máximo do buffer para a comunicação cliente/servidor. O padrão é de 24 MB, e o máximo é de 1 GB.

  Nota

  O valor dessa opção é específico para o **mysqldump** e não deve ser confundido com a variável de sistema `max_allowed_packet` do servidor MySQL; o valor do servidor não pode ser excedido por um único pacote do **mysqldump**, independentemente de qualquer configuração da opção **mysqldump**, mesmo que esta seja maior.

- `--net-buffer-length=valor`

  <table frame="box" rules="all" summary="Propriedades para senha"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--password[=password]</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>5

  O tamanho inicial do buffer para a comunicação cliente/servidor. Ao criar instruções `INSERT` de várias linhas (como com a opção `--extended-insert` ou `--opt`), o **mysqldump** cria linhas com até `--net-buffer-length` bytes de comprimento. Se você aumentar essa variável, certifique-se de que a variável de sistema `net_buffer_length` do servidor MySQL tenha um valor pelo menos desse tamanho.

- `--opt`

  <table frame="box" rules="all" summary="Propriedades para senha"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--password[=password]</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>6

  Esta opção, ativada por padrão, é uma abreviação da combinação de `--add-drop-table` `--add-locks` `--create-options` `--disable-keys` `--extended-insert` `--lock-tables` `--quick` `--set-charset`. Ela oferece uma operação de dump rápida e produz um arquivo de dump que pode ser carregado rapidamente em um servidor MySQL.

  Como a opção `--opt` está habilitada por padrão, você só precisa especificar sua oposta, a `--skip-opt`, para desativar várias configurações padrão. Consulte a discussão sobre os grupos de opções do `mysqldump` para obter informações sobre como habilitar ou desabilitar seletivamente um subconjunto das opções afetadas por `--opt`.

- `--quick`, `-q`

  <table frame="box" rules="all" summary="Propriedades para senha"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--password[=password]</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>7

  Esta opção é útil para descartar tabelas grandes. Ela obriga o **mysqldump** a recuperar linhas de uma tabela do servidor uma linha de cada vez, em vez de recuperar todo o conjunto de linhas e armazená-lo em memória antes de gravá-lo.

- `--skip-opt`

  <table frame="box" rules="all" summary="Propriedades para senha"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--password[=password]</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>8

  Veja a descrição da opção `--opt`.

#### Opções de transação

As seguintes opções sacrificam o desempenho da operação de exclusão em favor da confiabilidade e consistência dos dados exportados.

- `--add-locks`

  <table frame="box" rules="all" summary="Propriedades para senha"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--password[=password]</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>9

  Cerque cada dump de tabela com as instruções `LOCK TABLES` e `UNLOCK TABLES`. Isso resulta em inserções mais rápidas quando o arquivo de dump é recarregado. Veja a Seção 8.2.4.1, “Otimizando instruções INSERT”.

- `--flush-logs`, `-F`

  <table frame="box" rules="all" summary="Propriedades para tubulação"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--pipe</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>0

  Limpe os arquivos de log do servidor MySQL antes de iniciar o dump. Esta opção requer o privilégio `RELOAD`. Se você usar esta opção em combinação com a opção `--all-databases`, os logs serão limpos *para cada banco de dados dumpado*. A exceção é quando você usa `--lock-all-tables`, `--master-data` ou `--single-transaction`: Nesse caso, os logs são limpos apenas uma vez, correspondendo ao momento em que todas as tabelas são bloqueadas por `FLUSH TABLES WITH READ LOCK`. Se você deseja que seu dump e o flush de log ocorram exatamente no mesmo momento, você deve usar `--flush-logs` junto com `--lock-all-tables`, `--master-data` ou `--single-transaction`.

- `--flush-privileges`

  <table frame="box" rules="all" summary="Propriedades para tubulação"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--pipe</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>1

  Adicione uma declaração `FLUSH PRIVILEGES` à saída do dump após o dumping do banco de dados `mysql`. Esta opção deve ser usada sempre que o dump contiver o banco de dados `mysql` e qualquer outro banco de dados que dependa dos dados do banco de dados `mysql` para uma restauração adequada.

  Como o arquivo de implantação contém uma instrução `FLUSH PRIVILEGES`, a recarga do arquivo requer privilégios suficientes para executar essa instrução.

  Nota

  Para fazer atualizações para o MySQL 5.7 ou versões mais recentes a partir de versões mais antigas, não use `--flush-privileges`. Para obter instruções de atualização neste caso, consulte a Seção 2.10.3, “Alterações no MySQL 5.7”.

- `--lock-all-tables`, `-x`

  <table frame="box" rules="all" summary="Propriedades para tubulação"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--pipe</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>2

  Bloquear todas as tabelas em todos os bancos de dados. Isso é feito ao adquirir um bloqueio de leitura global por toda a duração do dump. Esta opção desativa automaticamente `--single-transaction` e `--lock-tables`.

- `--lock-tables`, `-l`

  <table frame="box" rules="all" summary="Propriedades para tubulação"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--pipe</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>3

  Para cada banco de dados descartado, bloqueie todas as tabelas que serão descartadas antes de descartá-las. As tabelas são bloqueadas com `READ LOCAL` para permitir inserções concorrentes no caso de tabelas `MyISAM`. Para tabelas transacionais, como `InnoDB`, `--single-transaction` é uma opção muito melhor do que `--lock-tables`, pois não é necessário bloquear as tabelas.

  Como o `--lock-tables` bloqueia as tabelas separadamente para cada banco de dados, essa opção não garante que as tabelas no arquivo de dump estejam logicamente consistentes entre os bancos de dados. As tabelas em diferentes bancos de dados podem ser descarregadas em estados completamente diferentes.

  Algumas opções, como `--opt`, habilitam automaticamente `--lock-tables`. Se você quiser ignorar isso, use `--skip-lock-tables` no final da lista de opções.

- `--no-autocommit`

  <table frame="box" rules="all" summary="Propriedades para tubulação"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--pipe</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>4

  Inclua as instruções `INSERT` para cada tabela descarregada dentro de `SET autocommit = 0` e as instruções `COMMIT`.

- `--order-by-primary`

  <table frame="box" rules="all" summary="Propriedades para tubulação"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--pipe</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>5

  Exclua as linhas de cada tabela ordenadas por sua chave primária ou pelo primeiro índice exclusivo, se houver. Isso é útil ao excluir uma tabela `MyISAM` para ser carregada em uma tabela `InnoDB`, mas faz com que a operação de exclusão demore consideravelmente mais tempo.

- `--shared-memory-base-name=nome`

  <table frame="box" rules="all" summary="Propriedades para tubulação"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--pipe</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>6

  Em Windows, o nome de memória compartilhada a ser usado para conexões feitas usando memória compartilhada com um servidor local. O valor padrão é `MYSQL`. O nome de memória compartilhada é case-sensitive.

  Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `shared_memory` habilitada para suportar conexões de memória compartilhada.

- `--single-transaction`

  <table frame="box" rules="all" summary="Propriedades para tubulação"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--pipe</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>7

  Essa opção define o modo de isolamento de transação como `REPEATABLE READ` e envia uma instrução SQL `START TRANSACTION` para o servidor antes de drenar os dados. Ela é útil apenas com tabelas transacionais, como `InnoDB`, porque, nesse caso, ela drenará o estado consistente do banco de dados no momento em que a instrução `START TRANSACTION` foi emitida, sem bloquear nenhuma aplicação.

  O privilégio RELOAD ou FLUSH\_TABLES é necessário com `--single-transaction` se estiverem definidos tanto gtid\_mode=ON quanto --set-gtid=purged=ON|AUTO. Essa exigência foi adicionada no MySQL 8.0.32.

  Ao usar essa opção, você deve ter em mente que apenas as tabelas `InnoDB` são descarregadas em um estado consistente. Por exemplo, quaisquer tabelas `MyISAM` ou `MEMORY` descarregadas enquanto estiver usando essa opção ainda podem mudar de estado.

  Enquanto um dump `--single-transaction` estiver em processo, para garantir um arquivo de dump válido (conteúdo correto da tabela e coordenadas do log binário), nenhuma outra conexão deve usar as seguintes instruções: `ALTER TABLE`, `CREATE TABLE`, `DROP TABLE`, `RENAME TABLE`, `TRUNCATE TABLE`. Uma leitura consistente não está isolada dessas instruções, então o uso delas em uma tabela a ser dumpada pode fazer com que o `SELECT` realizado pelo **mysqldump** retorne o conteúdo da tabela incorreto ou falhe.

  A opção `--single-transaction` e a opção `--lock-tables` são mutuamente exclusivas, pois o comando `LOCK TABLES` faz com que quaisquer transações pendentes sejam comprometidas implicitamente.

  Não é recomendado usar `--single-transaction` junto com a opção `--set-gtid-purged`; isso pode causar inconsistências na saída do **mysqldump**.

  Para descartar tabelas grandes, combine a opção `--single-transaction` com a opção `--quick`.

#### Grupos de Opções

- A opção `--opt` ativa várias configurações que trabalham juntas para realizar uma operação de dump rápida. Todas essas configurações estão ativadas por padrão, porque `--opt` está ativado por padrão. Assim, você raramente, ou nunca, especifica `--opt`. Em vez disso, você pode desativar essas configurações como um grupo, especificando `--skip-opt`, e, opcionalmente, reativar certas configurações especificando as opções associadas mais tarde na linha de comando.

- A opção `--compact` desativa várias configurações que controlam se as declarações e comentários opcionais aparecem na saída. Novamente, você pode seguir essa opção com outras opções que reativam certas configurações ou ativar todas as configurações usando o formato `--skip-compact`.

Quando você habilita ou desabilita seletivamente o efeito de uma opção de grupo, a ordem é importante, pois as opções são processadas da primeira à última. Por exemplo, `--disable-keys` `--lock-tables` `--skip-opt` não teria o efeito desejado; é o mesmo que `--skip-opt` por si só.

#### Exemplos

Para fazer um backup de um banco de dados inteiro:

```sql
mysqldump db_name > backup-file.sql
```

Para carregar o arquivo de depuração de volta no servidor:

```sql
mysql db_name < backup-file.sql
```

Outra maneira de recarregar o arquivo de dump:

```sql
mysql -e "source /path-to-backup/backup-file.sql" db_name
```

O **mysqldump** também é muito útil para preencher bancos de dados copiando dados de um servidor MySQL para outro:

```sql
mysqldump --opt db_name | mysql --host=remote_host -C db_name
```

Você pode descartar várias bases de dados com um comando:

```sql
mysqldump --databases db_name1 [db_name2 ...] > my_databases.sql
```

Para descartar todas as bases de dados, use a opção `--all-databases`:

```sql
mysqldump --all-databases > all_databases.sql
```

Para as tabelas do InnoDB, o **mysqldump** oferece uma maneira de fazer um backup online:

```sql
mysqldump --all-databases --master-data --single-transaction > all_databases.sql
```

Este backup adquire um bloqueio de leitura global em todas as tabelas (usando `FLUSH TABLES WITH READ LOCK`) no início do dump. Assim que esse bloqueio é adquirido, os endereços do log binário são lidos e o bloqueio é liberado. Se declarações de atualização longas estiverem em execução quando a instrução `FLUSH` for emitida, o servidor MySQL pode ficar parado até que essas declarações terminem. Após isso, o dump fica livre de bloqueios e não interfere em leituras e escritas nas tabelas. Se as declarações de atualização que o servidor MySQL recebe forem curtas (em termos de tempo de execução), o período inicial de bloqueio não deve ser perceptível, mesmo com muitas atualizações.

Para a recuperação em um ponto específico no tempo (também conhecida como “regra de avanço”, quando você precisa restaurar um backup antigo e refazer as alterações que ocorreram desde esse backup), muitas vezes é útil rotular o log binário (veja a Seção 5.4.4, “O Log Binário”) ou, pelo menos, conhecer as coordenadas do log binário às quais o dump corresponde:

```sql
mysqldump --all-databases --master-data=2 > all_databases.sql
```

Ou:

```sql
mysqldump --all-databases --flush-logs --master-data=2 > all_databases.sql
```

As opções `--master-data` e `--single-transaction` podem ser usadas simultaneamente, o que oferece uma maneira conveniente de fazer um backup online adequado para uso antes da recuperação em um ponto específico, se as tabelas forem armazenadas usando o mecanismo de armazenamento `InnoDB`.

Para obter mais informações sobre como fazer backups, consulte a Seção 7.2, “Métodos de Backup de Banco de Dados”, e a Seção 7.3, “Estratégia de Backup e Recuperação Exemplo”.

- Para selecionar o efeito da opção `--opt`, exceto para alguns recursos, use a opção `--skip` para cada recurso. Para desabilitar os insertos estendidos e o buffer de memória, use `--opt` `--skip-inserto-extendido` `--skip-rápido`. (Na verdade, `--skip-inserto-extendido` `--skip-rápido` é suficiente, pois `--opt` está ativado por padrão.)

- Para reverter `--opt` para todas as funcionalidades, exceto a desativação do índice e o bloqueio de tabelas, use `--skip-opt` `--disable-keys` `--lock-tables`.

#### Restrições

O **mysqldump** não realiza o dump do esquema `INFORMATION_SCHEMA`, `performance_schema` ou `sys` por padrão. Para realizar o dump de qualquer um desses esquemas, nomeie-os explicitamente na linha de comando. Você também pode nomeá-los com a opção `--databases`. Para `INFORMATION_SCHEMA` e `performance_schema`, também use a opção `--skip-lock-tables`.

O **mysqldump** não descarrega o banco de dados de informações do NDB Cluster `ndbinfo`.

O **mysqldump** não grava as instruções `CREATE TABLESPACE` do `InnoDB`.

O **mysqldump** sempre remove o modo SQL `NO_AUTO_CREATE_USER`, pois `NO_AUTO_CREATE_USER` não é compatível com o MySQL 8.0. Ele permanece removido mesmo ao importar de volta para o MySQL 5.7, o que significa que as rotinas armazenadas podem se comportar de maneira diferente após a restauração de um dump se dependerem desse modo específico de sql. Ele é removido a partir do **mysqldump** 5.7.24.

Não é recomendado restaurar de um dump feito com **mysqldump** para um servidor MySQL 5.6.9 ou anterior que tenha GTIDs habilitados. Consulte a Seção 16.1.3.6, “Restrições na replicação com GTIDs”.

O **mysqldump** inclui instruções para recriar as tabelas `general_log` e `slow_query_log` para os backups do banco de dados `mysql`. O conteúdo das tabelas de log não é copiado.

Se você encontrar problemas ao fazer backup de visualizações devido a privilégios insuficientes, consulte a Seção 23.9, “Restrições em visualizações”, para uma solução alternativa.
