### 6.5.4 mysqldump — Um programa de backup de banco de dados

A ferramenta de cliente **mysqldump** realiza backups lógicos, produzindo um conjunto de instruções SQL que podem ser executadas para reproduzir as definições originais dos objetos do banco de dados e os dados das tabelas. Ele descarrega um ou mais bancos de dados MySQL para backup ou transferência para outro servidor SQL. O comando **mysqldump** também pode gerar saída em formato CSV, outro texto delimitado ou XML.

Dica

Considere usar os utilitários de dump do MySQL Shell, que oferecem dumping paralelo com múltiplos threads, compressão de arquivos e exibição de informações de progresso, além de recursos na nuvem, como o streaming do Oracle Cloud Infrastructure Object Storage e verificações e modificações de compatibilidade do MySQL HeatWave. Os dumps podem ser facilmente importados em uma instância do MySQL Server ou em um Sistema de Banco de Dados MySQL HeatWave usando os utilitários de carga de dump do MySQL Shell. As instruções de instalação do MySQL Shell podem ser encontradas aqui.

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

O **mysqldump** requer pelo menos o privilégio `SELECT` para tabelas descarregadas, `SHOW VIEW` para visualizações descarregadas, `TRIGGER` para gatilhos descarregados, `LOCK TABLES` se a opção `--single-transaction` não for usada, `PROCESS` (a partir do MySQL 8.0.21) se a opção `--no-tablespaces` não for usada, e (a partir do MySQL 8.0.32) o privilégio `RELOAD` ou `FLUSH_TABLES` com `--single-transaction` se ambas as opções `gtid_mode=ON` e `gtid_purged=ON|AUTO` estiverem ativadas. Algumas opções podem exigir outros privilégios, conforme indicado nas descrições das opções.

Para recarregar um arquivo de dump, você deve ter os privilégios necessários para executar as instruções que ele contém, como os privilégios apropriados `CREATE` para objetos criados por essas instruções.

A saída do **mysqldump** pode incluir instruções `ALTER DATABASE` que alteram a collation do banco de dados. Essas instruções podem ser usadas ao fazer o dumping de programas armazenados para preservar suas codificações de caracteres. Para recarregar um arquivo de dump que contenha essas instruções, é necessário o privilégio `ALTER` para o banco de dados afetado.

Nota

Um dump feito usando o PowerShell no Windows com redirecionamento de saída cria um arquivo com codificação UTF-16:

```
mysqldump [options] > dump.sql
```

No entanto, o UTF-16 não é permitido como conjunto de caracteres de conexão (veja Conjuntos de caracteres de cliente impermissíveis), então o arquivo de dump não pode ser carregado corretamente. Para contornar esse problema, use a opção `--result-file`, que cria a saída no formato ASCII:

```
mysqldump [options] --result-file=dump.sql
```

Não é recomendado carregar um arquivo de dump quando os GTIDs estão habilitados no servidor (`gtid_mode=ON`), se o seu arquivo de dump incluir tabelas do sistema. O **mysqldump** emite instruções DML para as tabelas do sistema que usam o mecanismo de armazenamento não transacional MyISAM, e essa combinação não é permitida quando os GTIDs estão habilitados.

#### Considerações sobre desempenho e escalabilidade

As vantagens do `mysqldump` incluem a conveniência e flexibilidade de visualizar ou até mesmo editar a saída antes da restauração. Você pode clonar bancos de dados para trabalho de desenvolvimento e DBA, ou produzir variações leves de um banco de dados existente para testes. Não é destinado como uma solução rápida ou escalável para fazer backup de grandes quantidades de dados. Com tamanhos de dados grandes, mesmo que o passo de backup leve um tempo razoável, a restauração dos dados pode ser muito lenta porque a reprodução das instruções SQL envolve I/O de disco para inserção, criação de índices, e assim por diante.

Para backups e restaurações em larga escala, um backup físico é mais apropriado, para copiar os arquivos de dados em seu formato original, para que possam ser restaurados rapidamente.

Se suas tabelas são principalmente tabelas `InnoDB` ou se você tem uma mistura de tabelas `InnoDB` e `MyISAM`, considere usar o **mysqlbackup**, que está disponível como parte do MySQL Enterprise. Esta ferramenta oferece alto desempenho para backups `InnoDB` com mínima interrupção; também pode fazer backup de tabelas de `MyISAM` e outros motores de armazenamento; também oferece várias opções convenientes para acomodar diferentes cenários de backup. Veja a Seção 32.1, “Visão geral do backup do MySQL Enterprise”.

O **mysqldump** pode recuperar e dumper o conteúdo da tabela linha por linha ou pode recuperar todo o conteúdo de uma tabela e bufferá-lo na memória antes de dumperá-lo. O bufferamento na memória pode ser um problema se você estiver dumperando tabelas grandes. Para dumperar tabelas linha por linha, use a opção `--quick` (ou `--opt`, que habilita `--quick`). A opção `--opt` (e, portanto, `--quick`) é habilitada por padrão, então para habilitar o bufferamento na memória, use `--skip-quick`.

Se você estiver usando uma versão recente do **mysqldump** para gerar um dump que será recarregado em um servidor MySQL muito antigo, use a opção `--skip-opt` em vez da opção `--opt` ou `--extended-insert`.

Para obter informações adicionais sobre o **mysqldump**, consulte a Seção 9.4, “Usando mysqldump para backups”.

#### Sintaxe de Invocação

Existem, em geral, três maneiras de usar o **mysqldump**: para fazer o dump de um conjunto de uma ou mais tabelas, de um conjunto de uma ou mais bases de dados completas ou de um servidor MySQL inteiro, conforme mostrado aqui:

```
mysqldump [options] db_name [tbl_name ...]
mysqldump [options] --databases db_name ...
mysqldump [options] --all-databases
```

Para descartar bancos de dados inteiros, não nomeie nenhuma tabela após `db_name`, ou use a opção `--databases` ou `--all-databases`.

Para ver uma lista das opções suportadas pela sua versão do **mysqldump**, execute o comando **mysqldump** `--help`.

#### Sintaxe de opção - Resumo alfabético

O **mysqldump** suporta as seguintes opções, que podem ser especificadas na linha de comando ou nos grupos `[mysqldump]` e `[client]` de um arquivo de opções. Para obter informações sobre os arquivos de opções usados pelos programas do MySQL, consulte a Seção 6.2.2.2, “Usando arquivos de opções”.

**Tabela 6.15 Opções do mysqldump**

<table summary="Opções de linha de comando disponíveis para mysqldump."><thead><tr><th scope="col">Nome da Opção</th> <th scope="col">Descrição</th> <th scope="col">Introduzido</th> <th scope="col">Desatualizado</th> </tr></thead><tbody><tr><th>--add-drop-database</th> <td>Adicione a instrução DROP DATABASE antes de cada instrução CREATE DATABASE</td> <td></td> <td></td> </tr><tr><th>--add-drop-table</th> <td>Adicione a declaração DROP TABLE antes de cada declaração CREATE TABLE</td> <td></td> <td></td> </tr><tr><th>--add-drop-trigger</th> <td>Adicione a declaração DROP TRIGGER antes de cada declaração CREATE TRIGGER</td> <td></td> <td></td> </tr><tr><th>--add-locks</th> <td>Cerque cada dump de tabela com as instruções LOCK TABLES e UNLOCK TABLES</td> <td></td> <td></td> </tr><tr><th>--all-databases</th> <td>Exclua todas as tabelas em todos os bancos de dados</td> <td></td> <td></td> </tr><tr><th>--allow-keywords</th> <td>Permitir a criação de nomes de colunas que sejam palavras-chave</td> <td></td> <td></td> </tr><tr><th>--apply-replica-statements</th> <td>Incluir STOP REPLICA antes da declaração CHANGE REPLICATION SOURCE TO e START REPLICA no final do resultado</td> <td>8.0.26</td> <td></td> </tr><tr><th>--apply-slave-statements</th> <td>Incluir STOP SLAVE antes da declaração CHANGE MASTER e START SLAVE no final da saída</td> <td></td> <td>8.0.26</td> </tr><tr><th>--bind-address</th> <td>Use a interface de rede especificada para se conectar ao servidor MySQL</td> <td></td> <td></td> </tr><tr><th>--sets-de-caracteres-dir</th> <td>Diretório onde os conjuntos de caracteres são instalados</td> <td></td> <td></td> </tr><tr><th>--column-statistics</th> <td>Escreva declarações ANALYZE TABLE para gerar histogramas de estatísticas</td> <td></td> <td></td> </tr><tr><th>--comentários</th> <td>Adicione comentários ao arquivo de dump</td> <td></td> <td></td> </tr><tr><th>--compacto</th> <td>Produza uma saída mais compacta</td> <td></td> <td></td> </tr><tr><th>--compatível</th> <td>Produza uma saída mais compatível com outros sistemas de banco de dados ou com servidores MySQL mais antigos</td> <td></td> <td></td> </tr><tr><th>--complete-insert</th> <td>Use instruções INSERT completas que incluam os nomes das colunas</td> <td></td> <td></td> </tr><tr><th>--compress</th> <td>Compressar todas as informações enviadas entre o cliente e o servidor</td> <td></td> <td>8.0.18</td> </tr><tr><th>--algoritmos de compressão</th> <td>Algoritmos de compressão permitidos para conexões com o servidor</td> <td>8.0.18</td> <td></td> </tr><tr><th>--create-options</th> <td>Incluir todas as opções de tabela específicas do MySQL nas declarações CREATE TABLE</td> <td></td> <td></td> </tr><tr><th>--databases</th> <td>Interprete todos os argumentos de nome como nomes de banco de dados</td> <td></td> <td></td> </tr><tr><th>--debug</th> <td>Escreva o log de depuração</td> <td></td> <td></td> </tr><tr><th>--debug-check</th> <td>Imprimir informações de depuração quando o programa sai</td> <td></td> <td></td> </tr><tr><th>--debug-info</th> <td>Imprimir informações de depuração, memória e estatísticas da CPU quando o programa sai</td> <td></td> <td></td> </tr><tr><th>--default-auth</th> <td>Plugin de autenticação a ser usado</td> <td></td> <td></td> </tr><tr><th>--default-character-set</th> <td>Especifique o conjunto de caracteres padrão</td> <td></td> <td></td> </tr><tr><th>--defaults-extra-file</th> <td>Leia o arquivo de opção nomeado, além dos arquivos de opção usuais</td> <td></td> <td></td> </tr><tr><th>--defaults-file</th> <td>Arquivo de opção de leitura apenas nomeado</td> <td></td> <td></td> </tr><tr><th>--defaults-group-suffix</th> <td>Valor do sufixo do grupo de opções</td> <td></td> <td></td> </tr><tr><th>--delete-master-logs</th> <td>Em um servidor de fonte de replicação, exclua os logs binários após a execução da operação de dump</td> <td></td> <td>8.0.26</td> </tr><tr><th>--delete-source-logs</th> <td>Em um servidor de fonte de replicação, exclua os logs binários após a execução da operação de dump</td> <td>8.0.26</td> <td></td> </tr><tr><th>--disable-keys</th> <td>Para cada tabela, rode as instruções INSERT com instruções para desabilitar e habilitar as chaves</td> <td></td> <td></td> </tr><tr><th>--dump-data</th> <td>Incluir a data do dump como comentário "Dump concluído em" se a opção --comments for fornecida</td> <td></td> <td></td> </tr><tr><th>--dump-replica</th> <td>Incluir a declaração CHANGE REPLICATION SOURCE TO que lista as coordenadas do log binário da fonte da replica.</td> <td>8.0.26</td> <td></td> </tr><tr><th>--dump-slave</th> <td>Incluir a declaração CHANGE MASTER que lista as coordenadas do log binário da fonte da réplica</td> <td></td> <td>8.0.26</td> </tr><tr><th>--enable-cleartext-plugin</th> <td>Habilitar o plugin de autenticação em texto claro</td> <td></td> <td></td> </tr><tr><th>--eventos</th> <td>Eventos de descarte de bancos de dados descartados</td> <td></td> <td></td> </tr><tr><th>--insert-extended</th> <td>Use a sintaxe de inserção de várias linhas</td> <td></td> <td></td> </tr><tr><th>--campos-cercados-por</th> <td>Esta opção é usada com a opção --tab e tem o mesmo significado que a cláusula correspondente para LOAD DATA</td> <td></td> <td></td> </tr><tr><th>--campos-escavados-por</th> <td>Esta opção é usada com a opção --tab e tem o mesmo significado que a cláusula correspondente para LOAD DATA</td> <td></td> <td></td> </tr><tr><th>--campos opcionalmente delimitados por</th> <td>Esta opção é usada com a opção --tab e tem o mesmo significado que a cláusula correspondente para LOAD DATA</td> <td></td> <td></td> </tr><tr><th>--campos-terminados-por</th> <td>Esta opção é usada com a opção --tab e tem o mesmo significado que a cláusula correspondente para LOAD DATA</td> <td></td> <td></td> </tr><tr><th>--flush-logs</th> <td>Limpe os arquivos de log do servidor MySQL antes de iniciar o dump</td> <td></td> <td></td> </tr><tr><th>--flush-privileges</th> <td>Emita uma declaração FLUSH PRIVILEGES após descartar o banco de dados mysql</td> <td></td> <td></td> </tr><tr><th>--force</th> <td>Continue mesmo que um erro SQL ocorra durante um dump de tabela</td> <td></td> <td></td> </tr><tr><th>--get-server-public-key</th> <td>Solicitar chave pública RSA do servidor</td> <td></td> <td></td> </tr><tr><th>--help</th> <td>Exibir mensagem de ajuda e sair</td> <td></td> <td></td> </tr><tr><th>--hex-blob</th> <td>Expor colunas binárias usando notação hexadecimal</td> <td></td> <td></td> </tr><tr><th>--host</th> <td>Anfitrião no qual o servidor MySQL está localizado</td> <td></td> <td></td> </tr><tr><th>--ignore-error</th> <td>Ignorar erros especificados</td> <td></td> <td></td> </tr><tr><th>--ignore-table</th> <td>Não jogue fora a mesa dada</td> <td></td> <td></td> </tr><tr><th>--include-master-host-port</th> <td>Incluir as opções MASTER_HOST/MASTER_PORT na declaração CHANGE MASTER produzida com --dump-slave</td> <td></td> <td>8.0.26</td> </tr><tr><th>--include-source-host-port</th> <td>Incluir as opções SOURCE_HOST e SOURCE_PORT na declaração CHANGE REPLICATION SOURCE TO produzida com --dump-replica</td> <td>8.0.26</td> <td></td> </tr><tr><th>--inserir-ignorar</th> <td>Escreva INSERT IGNORE em vez de instruções INSERT</td> <td></td> <td></td> </tr><tr><th>--lines-terminated-by</th> <td>Esta opção é usada com a opção --tab e tem o mesmo significado que a cláusula correspondente para LOAD DATA</td> <td></td> <td></td> </tr><tr><th>--lock-all-tables</th> <td>Bloquear todas as tabelas em todos os bancos de dados</td> <td></td> <td></td> </tr><tr><th>--lock-tables</th> <td>Bloquear todas as tabelas antes de descartá-las</td> <td></td> <td></td> </tr><tr><th>--log-error</th> <td>Adicione avisos e erros a um arquivo nomeado</td> <td></td> <td></td> </tr><tr><th>--login-path</th> <td>Leia as opções de caminho de login a partir de .mylogin.cnf</td> <td></td> <td></td> </tr><tr><th>--master-data</th> <td>Escreva o nome e a posição do arquivo de log binário na saída</td> <td></td> <td>8.0.26</td> </tr><tr><th>--max-allowed-packet</th> <td>Comprimento máximo do pacote para enviar ou receber do servidor</td> <td></td> <td></td> </tr><tr><th>--mysqld-long-query-time</th> <td>Valor de sessão para o limite de consultas lentas</td> <td>8.0.30</td> <td></td> </tr><tr><th>--net-buffer-length</th> <td>Tamanho do buffer para comunicação TCP/IP e socket</td> <td></td> <td></td> </tr><tr><th>--network-timeout</th> <td>Aumente os tempos de espera da rede para permitir descargas maiores de tabelas</td> <td></td> <td></td> </tr><tr><th>--no-autocommit</th> <td>Inclua as instruções INSERT para cada tabela descarregada dentro de SET autocommit = 0 e as instruções COMMIT</td> <td></td> <td></td> </tr><tr><th>--no-create-db</th> <td>Não escreva declarações CREATE DATABASE</td> <td></td> <td></td> </tr><tr><th>--no-create-info</th> <td>Não escreva declarações CREATE TABLE que recriem cada tabela descarregada</td> <td></td> <td></td> </tr><tr><th>--no-data</th> <td>Não despeje o conteúdo da mesa</td> <td></td> <td></td> </tr><tr><th>--no-defaults</th> <td>Não ler arquivos de opção</td> <td></td> <td></td> </tr><tr><th>--no-set-names</th> <td>O mesmo que --skip-set-charset</td> <td></td> <td></td> </tr><tr><th>--no-tablespaces</th> <td>Não escreva quaisquer declarações de CREATE LOGFILE GROUP ou CREATE TABLESPACE no output</td> <td></td> <td></td> </tr><tr><th>--opt</th> <td>Abreviação para --add-drop-table --add-locks --create-options --disable-keys --extended-insert --lock-tables --quick --set-charset</td> <td></td> <td></td> </tr><tr><th>--order-by-primary</th> <td>Exclua as linhas de cada tabela, classificadas por sua chave primária ou pelo primeiro índice exclusivo</td> <td></td> <td></td> </tr><tr><th>--senha</th> <td>Senha para usar ao se conectar ao servidor</td> <td></td> <td></td> </tr><tr><th>--senha1</th> <td>Primeira senha de autenticação multifator a ser usada ao se conectar ao servidor</td> <td>8.0.27</td> <td></td> </tr><tr><th>--senha2</th> <td>Segunda senha de autenticação multifator a ser usada ao se conectar ao servidor</td> <td>8.0.27</td> <td></td> </tr><tr><th>--senha3</th> <td>Terceira senha de autenticação multifator a ser usada ao se conectar ao servidor</td> <td>8.0.27</td> <td></td> </tr><tr><th>--pipe</th> <td>Conecte-se ao servidor usando o pipe nomeado (apenas Windows)</td> <td></td> <td></td> </tr><tr><th>--plugin-authentication-kerberos-client-mode</th> <td>Permitir autenticação pluggable GSSAPI através da biblioteca MIT Kerberos no Windows</td> <td>8.0.32</td> <td></td> </tr><tr><th>--plugin-dir</th> <td>Diretório onde os plugins são instalados</td> <td></td> <td></td> </tr><tr><th>--port</th> <td>Número de porta TCP/IP para a conexão</td> <td></td> <td></td> </tr><tr><th>--print-defaults</th> <td>Opções padrão de impressão</td> <td></td> <td></td> </tr><tr><th>--protocolo</th> <td>Protocolo de transporte a ser utilizado</td> <td></td> <td></td> </tr><tr><th>--rápido</th> <td>Recuperar linhas de uma tabela do servidor uma linha de cada vez</td> <td></td> <td></td> </tr><tr><th>--quote-names</th> <td>Identificador de citações dentro de caracteres de backtick</td> <td></td> <td></td> </tr><tr><th>--replace</th> <td>Escreva declarações REPLACE em vez de declarações INSERT</td> <td></td> <td></td> </tr><tr><th>--result-file</th> <td>Saída direta para um arquivo específico</td> <td></td> <td></td> </tr><tr><th>--rotinas</th> <td>Expor rotinas armazenadas (procedimentos e funções) de bancos de dados expostos</td> <td></td> <td></td> </tr><tr><th>--server-public-key-path</th> <td>Nome do caminho para o arquivo que contém a chave pública RSA</td> <td></td> <td></td> </tr><tr><th>--set-charset</th> <td>Adicione SET NAMES default_character_set ao output</td> <td></td> <td></td> </tr><tr><th>--set-gtid-purged</th> <td>Se adicionar SET @@GLOBAL.GTID_PURGED ao output</td> <td></td> <td></td> </tr><tr><th>--shared-memory-base-name</th> <td>Nome de memória compartilhada para conexões de memória compartilhada (apenas Windows)</td> <td></td> <td></td> </tr><tr><th>--show-create-skip-secondary-engine</th> <td>Exclua a cláusula SECONDARY ENGINE das declarações CREATE TABLE</td> <td>8.0.18</td> <td></td> </tr><tr><th>--single-transaction</th> <td>Emita uma instrução BEGIN SQL antes de drenar dados do servidor</td> <td></td> <td></td> </tr><tr><th>--skip-add-drop-table</th> <td>Não adicione uma instrução DROP TABLE antes de cada instrução CREATE TABLE</td> <td></td> <td></td> </tr><tr><th>--skip-add-locks</th> <td>Não adicione bloqueios</td> <td></td> <td></td> </tr><tr><th>--skip-comments</th> <td>Não adicione comentários ao arquivo de dump</td> <td></td> <td></td> </tr><tr><th>--skip-compact</th> <td>Não produza uma saída mais compacta</td> <td></td> <td></td> </tr><tr><th>--skip-disable-keys</th> <td>Não desative as teclas</td> <td></td> <td></td> </tr><tr><th>--skip-extended-insert</th> <td>Desligue o recurso de inserção prolongada</td> <td></td> <td></td> </tr><tr><th>--skip-generated-invisible-primary-key</th> <td>Não inclua chaves primárias primárias geradas invisíveis no arquivo de dump</td> <td>8.0.30</td> <td></td> </tr><tr><th>--skip-opt</th> <td>Desative as opções definidas por --opt</td> <td></td> <td></td> </tr><tr><th>--skip-quick</th> <td>Não retorne linhas de uma tabela do servidor uma linha de cada vez</td> <td></td> <td></td> </tr><tr><th>--skip-quote-names</th> <td>Não cite identificadores</td> <td></td> <td></td> </tr><tr><th>--skip-set-charset</th> <td>Não escreva a declaração SET NAMES</td> <td></td> <td></td> </tr><tr><th>--skip-triggers</th> <td>Não jogue gatilhos no lixo</td> <td></td> <td></td> </tr><tr><th>--skip-tz-utc</th> <td>Desligue tz-utc</td> <td></td> <td></td> </tr><tr><th>--socket</th> <td>Arquivo de soquete Unix ou tubo nomeado do Windows a ser usado</td> <td></td> <td></td> </tr><tr><th>--source-data</th> <td>Escreva o nome e a posição do arquivo de log binário na saída</td> <td>8.0.26</td> <td></td> </tr><tr><th>--ssl-ca</th> <td>Arquivo que contém a lista de Autoridades de Certificação SSL confiáveis</td> <td></td> <td></td> </tr><tr><th>--ssl-capath</th> <td>Diretório que contém arquivos de certificados de Autoridade de Certificação SSL confiáveis</td> <td></td> <td></td> </tr><tr><th>--ssl-cert</th> <td>Arquivo que contém o certificado X.509</td> <td></td> <td></td> </tr><tr><th>--ssl-cipher</th> <td>Cifras permitidas para criptografia de conexão</td> <td></td> <td></td> </tr><tr><th>--ssl-crl</th> <td>Arquivo que contém listas de revogação de certificados</td> <td></td> <td></td> </tr><tr><th>--ssl-crlpath</th> <td>Diretório que contém arquivos de lista de revogação de certificados</td> <td></td> <td></td> </tr><tr><th>--ssl-fips-mode</th> <td>Se deve habilitar o modo FIPS no lado do cliente</td> <td></td> <td>8.0.34</td> </tr><tr><th>--ssl-chave</th> <td>Arquivo que contém a chave X.509</td> <td></td> <td></td> </tr><tr><th>--ssl-mode</th> <td>Estado de segurança desejado da conexão com o servidor</td> <td></td> <td></td> </tr><tr><th>--ssl-session-data</th> <td>Arquivo que contém dados da sessão SSL</td> <td>8.0.29</td> <td></td> </tr><tr><th>--ssl-session-data-continue-on-failed-reuse</th> <td>Se estabelecer conexões se a reutilização da sessão falhar</td> <td>8.0.29</td> <td></td> </tr><tr><th>--tab</th> <td>Produza arquivos de dados separados por tabulação</td> <td></td> <td></td> </tr><tr><th>--mesas</th> <td>Opção --databases ou -B para substituir</td> <td></td> <td></td> </tr><tr><th>--tls-ciphersuites</th> <td>Cifras TLSv1.3 permitidas para conexões criptografadas</td> <td>8.0.16</td> <td></td> </tr><tr><th>--tls-version</th> <td>Protocolos TLS permitidos para conexões criptografadas</td> <td></td> <td></td> </tr><tr><th>--triggers</th> <td>Triggers para descarte de cada tabela descartada</td> <td></td> <td></td> </tr><tr><th>--tz-utc</th> <td>Adicione SET TIME_ZONE='+00:00' ao arquivo de dump</td> <td></td> <td></td> </tr><tr><th>--user</th> <td>Nome do usuário do MySQL a ser usado ao se conectar ao servidor</td> <td></td> <td></td> </tr><tr><th>--verbose</th> <td>Modo verbosos</td> <td></td> <td></td> </tr><tr><th>--version</th> <td>Exibir informações da versão e sair</td> <td></td> <td></td> </tr><tr><th>--onde</th> <td>Exclua apenas as linhas selecionadas pela condição WHERE fornecida</td> <td></td> <td></td> </tr><tr><th>--xml</th> <td>Produzir saída XML</td> <td></td> <td></td> </tr><tr><th>--zstd-compression-level</th> <td>Nível de compressão para conexões com servidores que utilizam compressão zstd</td> <td>8.0.18</td> <td></td> </tr></tbody></table>

#### Opções de conexão

O comando **mysqldump** faz login em um servidor MySQL para extrair informações. As seguintes opções especificam como se conectar ao servidor MySQL, seja na mesma máquina ou em um sistema remoto.

- `--bind-address=ip_address`

  <table summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>

  Em um computador com várias interfaces de rede, use esta opção para selecionar qual interface usar para se conectar ao servidor MySQL.

- `--compress`, `-C`

  <table summary="Propriedades para comprimir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--compress[={OFF|ON}]</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.18</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

  Compressa todas as informações enviadas entre o cliente e o servidor, se possível. Consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.

  A partir do MySQL 8.0.18, essa opção está desatualizada. Espere que ela seja removida em uma versão futura do MySQL. Consulte Configurando a Compressão de Conexão Legado.

- `--compression-algorithms=value`

  <table summary="Propriedades para algoritmos de compressão"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--compression-algorithms=value</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.18</td> </tr><tr><th>Tipo</th> <td>Conjunto</td> </tr><tr><th>Valor padrão</th> <td>[[<code>uncompressed</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>zlib</code>]]</p><p class="valid-value">[[<code>zstd</code>]]</p><p class="valid-value">[[<code>uncompressed</code>]]</p></td> </tr></tbody></table>

  Os algoritmos de compressão permitidos para conexões ao servidor. Os algoritmos disponíveis são os mesmos da variável de sistema `protocol_compression_algorithms`. O valor padrão é `uncompressed`.

  Para obter mais informações, consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.

  Essa opção foi adicionada no MySQL 8.0.18.

- `--default-auth=plugin`

  <table summary="Propriedades para autenticação padrão"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--default-auth=plugin</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>

  Uma dica sobre qual plugin de autenticação do lado do cliente deve ser usado. Veja a Seção 8.2.17, “Autenticação Personalizável”.

- `--enable-cleartext-plugin`

  <table summary="Propriedades para habilitar o plugin enable-cleartext"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--enable-cleartext-plugin</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>

  Ative o plugin de autenticação de texto claro `mysql_clear_password`. (Consulte a Seção 8.4.1.4, “Autenticação Pluggable de Texto Claro do Cliente”).

- `--get-server-public-key`

  <table summary="Propriedades para get-server-public-key"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--get-server-public-key</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr></tbody></table>

  Peça à rede o par de chaves públicas necessário para a troca de senhas com base em pares de chaves RSA. Esta opção aplica-se a clientes que se autenticam com o plugin de autenticação `caching_sha2_password`. Para esse plugin, o servidor não envia a chave pública a menos que seja solicitado. Esta opção é ignorada para contas que não se autenticam com esse plugin. Também é ignorada se a troca de senha com base em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

  Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele terá precedência sobre `--get-server-public-key`.

  Para obter informações sobre o plugin `caching_sha2_password`, consulte a Seção 8.4.1.2, “Cacheamento de Autenticação Conectada a SHA-2”.

- `--host=host_name`, `-h host_name`

  <table summary="Propriedades para o anfitrião"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--host</code>]]</td> </tr></tbody></table>

  Arraste os dados do servidor MySQL para o host fornecido. O host padrão é `localhost`.

- `--login-path=name`

  <table summary="Propriedades para o caminho de login"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--login-path=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>

  Leia as opções do caminho de login nomeado no arquivo de caminho de login `.mylogin.cnf`. Um “caminho de login” é um grupo de opções que contém opções que especificam para qual servidor MySQL se conectar e qual conta autenticar. Para criar ou modificar um arquivo de caminho de login, use o utilitário **mysql\_config\_editor**. Veja a Seção 6.6.7, “mysql\_config\_editor — Utilitário de Configuração MySQL”.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--password[=password]`, `-p[password]`

  <table summary="Propriedades para senha"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--password[=password]</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>

  A senha da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecido, o **mysqldump** solicitará uma senha. Se for fornecida, não deve haver **espaço** entre `--password=` ou `-p` e a senha que o segue. Se nenhuma opção de senha for especificada, o padrão é não enviar a senha.

  Especificar uma senha na linha de comando deve ser considerado inseguro. Para evitar fornecer a senha na linha de comando, use um arquivo de opção. Consulte a Seção 8.1.2.1, "Diretrizes para o Usuário Final sobre Segurança de Senhas".

  Para especificar explicitamente que não há senha e que o **mysqldump** não deve solicitar uma senha, use a opção `--skip-password`.

- `--password1[=pass_val]`

  A senha para o fator de autenticação multifator 1 da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecido, o **mysqldump** solicitará uma senha. Se for fornecida, não deve haver **espaço** entre `--password1=` e a senha que a segue. Se nenhuma opção de senha for especificada, o padrão é não enviar nenhuma senha.

  Especificar uma senha na linha de comando deve ser considerado inseguro. Para evitar fornecer a senha na linha de comando, use um arquivo de opção. Consulte a Seção 8.1.2.1, "Diretrizes para o Usuário Final sobre Segurança de Senhas".

  Para especificar explicitamente que não há senha e que o **mysqldump** não deve solicitar uma senha, use a opção `--skip-password1`.

  `--password1` e `--password` são sinônimos, assim como `--skip-password1` e `--skip-password`.

- `--password2[=pass_val]`

  A senha para o fator de autenticação multifator 2 da conta MySQL usada para se conectar ao servidor. A semântica desta opção é semelhante à semântica do `--password1`; consulte a descrição dessa opção para obter detalhes.

- `--password3[=pass_val]`

  A senha para o fator de autenticação multifator 3 da conta MySQL usada para se conectar ao servidor. A semântica desta opção é semelhante à semântica do `--password1`; consulte a descrição dessa opção para obter detalhes.

- `--pipe`, `-W`

  <table summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>0

  No Windows, conecte-se ao servidor usando um tubo nomeado. Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões por tubo nomeado. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.

- `--plugin-authentication-kerberos-client-mode=value`

  <table summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>1

  No Windows, o plugin de autenticação `authentication_kerberos_client` suporta essa opção do plugin. Ele fornece dois valores possíveis que o usuário do cliente pode definir em tempo de execução: `SSPI` e `GSSAPI`.

  O valor padrão da opção de plugin do lado do cliente usa a Interface de Suporte de Segurança (SSPI), que é capaz de adquirir credenciais do cache em memória do Windows. Alternativamente, o usuário do cliente pode selecionar um modo que suporte a Interface de Programa de Aplicação de Serviço de Segurança Genérico (GSSAPI) através da biblioteca MIT Kerberos no Windows. O GSSAPI é capaz de adquirir credenciais armazenadas anteriormente geradas usando o comando **kinit**.

  Para obter mais informações, consulte os comandos para clientes do Windows no modo GSSAPI.

- `--plugin-dir=dir_name`

  <table summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>2

  O diretório onde procurar por plugins. Especifique esta opção se a opção `--default-auth` for usada para especificar um plugin de autenticação, mas o **mysqldump** não encontrá-lo. Veja a Seção 8.2.17, “Autenticação Personalizável”.

- `--port=port_num`, `-P port_num`

  <table summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>3

  Para conexões TCP/IP, o número de porta a ser usado.

- `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>4

  O protocolo de transporte a ser usado para se conectar ao servidor. É útil quando os outros parâmetros de conexão normalmente resultam no uso de um protocolo diferente do que você deseja. Para obter detalhes sobre os valores permitidos, consulte a Seção 6.2.7, “Protocolos de Transporte de Conexão”.

- `--server-public-key-path=file_name`

  <table summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>5

  O nome do caminho de um arquivo no formato PEM que contém uma cópia do lado do cliente da chave pública necessária pelo servidor para a troca de senhas com par de chaves RSA. Esta opção aplica-se a clientes que se autenticam com o plugin de autenticação `sha256_password` ou `caching_sha2_password`. Esta opção é ignorada para contas que não se autenticam com um desses plugins. Também é ignorada se a troca de senha com base em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

  Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele terá precedência sobre `--get-server-public-key`.

  Para `sha256_password`, esta opção só se aplica se o MySQL foi construído usando o OpenSSL.

  Para obter informações sobre os plugins `sha256_password` e `caching_sha2_password`, consulte a Seção 8.4.1.3, “Autenticação Conectada a SHA-256”, e a Seção 8.4.1.2, “Cache de Autenticação Conectada a SHA-2”.

- `--socket=path`, `-S path`

  <table summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>6

  Para conexões ao `localhost`, o arquivo de socket Unix a ser usado ou, no Windows, o nome do tubo nomeado a ser usado.

  No Windows, essa opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões de canal nomeado. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.

- `--ssl*`

  As opções que começam com `--ssl` especificam se você deseja se conectar ao servidor usando criptografia e indicam onde encontrar as chaves e certificados SSL. Consulte Opções de comando para conexões criptografadas.

- `--ssl-fips-mode={OFF|ON|STRICT}`

  <table summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>7

  Controla se o modo FIPS deve ser habilitado no lado do cliente. A opção `--ssl-fips-mode` difere de outras opções `--ssl-xxx` porque não é usada para estabelecer conexões criptografadas, mas sim para determinar quais operações criptográficas devem ser permitidas. Veja a Seção 8.8, “Suporte FIPS”.

  Estes valores `--ssl-fips-mode` são permitidos:

  - `OFF`: Desative o modo FIPS.
  - `ON`: Habilitar o modo FIPS.
  - `STRICT`: Habilitar o modo FIPS "estricto".

  Nota

  Se o Módulo de Objeto FIPS OpenSSL não estiver disponível, o único valor permitido para `--ssl-fips-mode` é `OFF`. Nesse caso, definir `--ssl-fips-mode` para `ON` ou `STRICT` faz com que o cliente emita um aviso na inicialização e opere no modo não FIPS.

  A partir do MySQL 8.0.34, essa opção está desatualizada. Espera-se que ela seja removida em uma versão futura do MySQL.

- `--tls-ciphersuites=ciphersuite_list`

  <table summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>8

  As sequências de cifra permitidas para conexões criptografadas que utilizam TLSv1.3. O valor é uma lista de um ou mais nomes de sequências de cifra separados por vírgula. As sequências de cifra que podem ser nomeadas para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para obter detalhes, consulte a Seção 8.3.2, “Protocolos e cifra de conexão criptografada TLS”.

  Essa opção foi adicionada no MySQL 8.0.16.

- `--tls-version=protocol_list`

  <table summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>9

  Os protocolos TLS permitidos para conexões criptografadas. O valor é uma lista de um ou mais nomes de protocolos separados por vírgula. Os protocolos que podem ser nomeados para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para obter detalhes, consulte a Seção 8.3.2, “Protocolos e cifra TLS de conexão criptografada”.

- `--user=user_name`, `-u user_name`

  <table summary="Propriedades para comprimir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--compress[={OFF|ON}]</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.18</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>0

  O nome de usuário da conta MySQL a ser usado para se conectar ao servidor.

  Se você estiver usando o plugin `Rewriter` com o MySQL 8.0.31 ou posterior, você deve conceder este usuário o privilégio `SKIP_QUERY_REWRITE`.

- `--zstd-compression-level=level`

  <table summary="Propriedades para comprimir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--compress[={OFF|ON}]</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.18</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>1

  O nível de compressão a ser usado para conexões com o servidor que utilizam o algoritmo de compressão `zstd`. Os níveis permitidos variam de 1 a 22, com valores maiores indicando níveis crescentes de compressão. O nível de compressão padrão `zstd` é 3. A configuração do nível de compressão não afeta conexões que não utilizam a compressão `zstd`.

  Para obter mais informações, consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.

  Essa opção foi adicionada no MySQL 8.0.18.

#### Opção - Opções de arquivo

Essas opções são usadas para controlar quais arquivos de opção devem ser lidos.

- `--defaults-extra-file=file_name`

  <table summary="Propriedades para comprimir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--compress[={OFF|ON}]</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.18</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>2

  Leia este arquivo de opção após o arquivo de opção global, mas (no Unix) antes do arquivo de opção do usuário. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se `file_name` não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--defaults-file=file_name`

  <table summary="Propriedades para comprimir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--compress[={OFF|ON}]</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.18</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>3

  Use apenas o arquivo de opção fornecido. Se o arquivo não existir ou estiver inacessível, ocorrerá um erro. Se `file_name` não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

  Exceção: Mesmo com `--defaults-file`, os programas de cliente leem `.mylogin.cnf`.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--defaults-group-suffix=str`

  <table summary="Propriedades para comprimir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--compress[={OFF|ON}]</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.18</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>4

  Leia não apenas os grupos de opções usuais, mas também grupos com os nomes usuais e um sufixo de `str`. Por exemplo, **mysqldump** normalmente lê os grupos `[client]` e `[mysqldump]`. Se esta opção for dada como `--defaults-group-suffix=_other`, **mysqldump** também lê os grupos `[client_other]` e `[mysqldump_other]`.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--no-defaults`

  <table summary="Propriedades para comprimir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--compress[={OFF|ON}]</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.18</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>5

  Não leia nenhum arquivo de opções. Se o início do programa falhar devido à leitura de opções desconhecidas de um arquivo de opções, `--no-defaults` pode ser usado para impedir que sejam lidas.

  A exceção é que o arquivo `.mylogin.cnf` é lido em todos os casos, se existir. Isso permite que as senhas sejam especificadas de uma maneira mais segura do que na linha de comando, mesmo quando o `--no-defaults` é usado. Para criar o `.mylogin.cnf`, use o utilitário **mysql\_config\_editor**. Veja a Seção 6.6.7, “mysql\_config\_editor — Utilitário de Configuração do MySQL”.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--print-defaults`

  <table summary="Propriedades para comprimir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--compress[={OFF|ON}]</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.18</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>6

  Imprima o nome do programa e todas as opções que ele obtém a partir de arquivos de opção.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

#### Opções de DDL

Os cenários de uso do **mysqldump** incluem a configuração de uma nova instância completa do MySQL (incluindo tabelas de banco de dados) e a substituição de dados em uma instância existente por bancos de dados e tabelas existentes. As seguintes opções permitem que você especifique quais coisas devem ser desmontadas e configuradas ao restaurar um dump, codificando várias instruções DDL dentro do arquivo de dump.

- `--add-drop-database`

  <table summary="Propriedades para comprimir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--compress[={OFF|ON}]</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.18</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>7

  Escreva uma declaração `DROP DATABASE` antes de cada declaração `CREATE DATABASE`. Esta opção é tipicamente usada em conjunto com as opções `--all-databases` ou `--databases`, pois nenhuma declaração `CREATE DATABASE` é escrita a menos que uma dessas opções seja especificada.

  Nota

  No MySQL 8.0, o esquema `mysql` é considerado um esquema do sistema que não pode ser excluído por usuários finais. Se `--add-drop-database` for usado com `--all-databases` ou com `--databases`, onde a lista de esquemas a serem descarregados inclui `mysql`, o arquivo de descarregamento contém uma declaração `` DROP DATABASE `mysql` `` que causa um erro quando o arquivo de descarregamento é carregado novamente.

  Em vez disso, para usar `--add-drop-database`, use `--databases` com uma lista de esquemas a serem descartados, onde a lista não inclui `mysql`.

- `--add-drop-table`

  <table summary="Propriedades para comprimir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--compress[={OFF|ON}]</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.18</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>8

  Escreva uma declaração `DROP TABLE` antes de cada declaração `CREATE TABLE`.

- `--add-drop-trigger`

  <table summary="Propriedades para comprimir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--compress[={OFF|ON}]</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.18</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>9

  Escreva uma declaração `DROP TRIGGER` antes de cada declaração `CREATE TRIGGER`.

- `--all-tablespaces`, `-Y`

  <table summary="Propriedades para algoritmos de compressão"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--compression-algorithms=value</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.18</td> </tr><tr><th>Tipo</th> <td>Conjunto</td> </tr><tr><th>Valor padrão</th> <td>[[<code>uncompressed</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>zlib</code>]]</p><p class="valid-value">[[<code>zstd</code>]]</p><p class="valid-value">[[<code>uncompressed</code>]]</p></td> </tr></tbody></table>0

  Adiciona a um dump de tabela todas as instruções SQL necessárias para criar quaisquer espaços de tabela usados por uma tabela `NDB`. Essas informações não estão incluídas em outras saídas do **mysqldump**. Esta opção atualmente é relevante apenas para tabelas do NDB Cluster.

- `--no-create-db`, `-n`

  <table summary="Propriedades para algoritmos de compressão"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--compression-algorithms=value</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.18</td> </tr><tr><th>Tipo</th> <td>Conjunto</td> </tr><tr><th>Valor padrão</th> <td>[[<code>uncompressed</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>zlib</code>]]</p><p class="valid-value">[[<code>zstd</code>]]</p><p class="valid-value">[[<code>uncompressed</code>]]</p></td> </tr></tbody></table>1

  Suprima as declarações `CREATE DATABASE` que, de outra forma, estão incluídas na saída se a opção `--databases` ou `--all-databases` for fornecida.

- `--no-create-info`, `-t`

  <table summary="Propriedades para algoritmos de compressão"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--compression-algorithms=value</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.18</td> </tr><tr><th>Tipo</th> <td>Conjunto</td> </tr><tr><th>Valor padrão</th> <td>[[<code>uncompressed</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>zlib</code>]]</p><p class="valid-value">[[<code>zstd</code>]]</p><p class="valid-value">[[<code>uncompressed</code>]]</p></td> </tr></tbody></table>2

  Não escreva declarações `CREATE TABLE` que criem cada tabela descarregada.

  Nota

  Esta opção **não** exclui declarações que criam grupos de arquivos de log ou espaços de tabelas do resultado do **mysqldump**, no entanto, você pode usar a opção `--no-tablespaces` para esse propósito.

- `--no-tablespaces`, `-y`

  <table summary="Propriedades para algoritmos de compressão"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--compression-algorithms=value</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.18</td> </tr><tr><th>Tipo</th> <td>Conjunto</td> </tr><tr><th>Valor padrão</th> <td>[[<code>uncompressed</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>zlib</code>]]</p><p class="valid-value">[[<code>zstd</code>]]</p><p class="valid-value">[[<code>uncompressed</code>]]</p></td> </tr></tbody></table>3

  Essa opção suprime todas as instruções `CREATE LOGFILE GROUP` e `CREATE TABLESPACE` na saída do **mysqldump**.

- `--replace`

  <table summary="Propriedades para algoritmos de compressão"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--compression-algorithms=value</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.18</td> </tr><tr><th>Tipo</th> <td>Conjunto</td> </tr><tr><th>Valor padrão</th> <td>[[<code>uncompressed</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>zlib</code>]]</p><p class="valid-value">[[<code>zstd</code>]]</p><p class="valid-value">[[<code>uncompressed</code>]]</p></td> </tr></tbody></table>4

  Escreva declarações `REPLACE` em vez de declarações `INSERT`.

#### Opções de depuração

As seguintes opções imprimem informações de depuração, codificam informações de depuração no arquivo de depuração ou permitem que a operação de depuração prossiga independentemente de possíveis problemas.

- `--allow-keywords`

  <table summary="Propriedades para algoritmos de compressão"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--compression-algorithms=value</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.18</td> </tr><tr><th>Tipo</th> <td>Conjunto</td> </tr><tr><th>Valor padrão</th> <td>[[<code>uncompressed</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>zlib</code>]]</p><p class="valid-value">[[<code>zstd</code>]]</p><p class="valid-value">[[<code>uncompressed</code>]]</p></td> </tr></tbody></table>5

  Permita a criação de nomes de colunas que sejam palavras-chave. Isso funciona prefixando cada nome de coluna com o nome da tabela.

- `--comments`, `-i`

  <table summary="Propriedades para algoritmos de compressão"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--compression-algorithms=value</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.18</td> </tr><tr><th>Tipo</th> <td>Conjunto</td> </tr><tr><th>Valor padrão</th> <td>[[<code>uncompressed</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>zlib</code>]]</p><p class="valid-value">[[<code>zstd</code>]]</p><p class="valid-value">[[<code>uncompressed</code>]]</p></td> </tr></tbody></table>6

  Escreva informações adicionais no arquivo de dump, como a versão do programa, a versão do servidor e o host. Esta opção está habilitada por padrão. Para suprimir essas informações adicionais, use `--skip-comments`.

- `--debug[=debug_options]`, `-# [debug_options]`

  <table summary="Propriedades para algoritmos de compressão"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--compression-algorithms=value</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.18</td> </tr><tr><th>Tipo</th> <td>Conjunto</td> </tr><tr><th>Valor padrão</th> <td>[[<code>uncompressed</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>zlib</code>]]</p><p class="valid-value">[[<code>zstd</code>]]</p><p class="valid-value">[[<code>uncompressed</code>]]</p></td> </tr></tbody></table>7

  Escreva um log de depuração. Uma string típica `debug_options` é `d:t:o,file_name`. O valor padrão é `d:t:o,/tmp/mysqldump.trace`.

  Esta opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são construídos usando essa opção.

- `--debug-check`

  <table summary="Propriedades para algoritmos de compressão"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--compression-algorithms=value</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.18</td> </tr><tr><th>Tipo</th> <td>Conjunto</td> </tr><tr><th>Valor padrão</th> <td>[[<code>uncompressed</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>zlib</code>]]</p><p class="valid-value">[[<code>zstd</code>]]</p><p class="valid-value">[[<code>uncompressed</code>]]</p></td> </tr></tbody></table>8

  Imprima algumas informações de depuração quando o programa sair.

  Esta opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são construídos usando essa opção.

- `--debug-info`

  <table summary="Propriedades para algoritmos de compressão"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--compression-algorithms=value</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.18</td> </tr><tr><th>Tipo</th> <td>Conjunto</td> </tr><tr><th>Valor padrão</th> <td>[[<code>uncompressed</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>zlib</code>]]</p><p class="valid-value">[[<code>zstd</code>]]</p><p class="valid-value">[[<code>uncompressed</code>]]</p></td> </tr></tbody></table>9

  Imprima informações de depuração, estatísticas de uso de memória e CPU quando o programa sair.

  Esta opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são construídos usando essa opção.

- `--dump-date`

  <table summary="Propriedades para autenticação padrão"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--default-auth=plugin</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>0

  Se a opção `--comments` for fornecida, o **mysqldump** produz um comentário no final do dump da seguinte forma:

  ```
  -- Dump completed on DATE
  ```

  No entanto, a data faz com que os arquivos de exclusão coletados em momentos diferentes pareçam diferentes, mesmo que os dados sejam idênticos. `--dump-date` e `--skip-dump-date` controlam se a data é adicionada ao comentário. O padrão é `--dump-date` (inclua a data no comentário). `--skip-dump-date` suprime a impressão da data.

- `--force`, `-f`

  <table summary="Propriedades para autenticação padrão"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--default-auth=plugin</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>1

  Ignore todos os erros; continue mesmo que um erro SQL ocorra durante um dump de tabela.

  Uma das utilizações desta opção é fazer com que o **mysqldump** continue a executar mesmo quando ele encontrar uma visão que se tornou inválida porque a definição faz referência a uma tabela que foi removida. Sem `--force`, o **mysqldump** sai com uma mensagem de erro. Com `--force`, o **mysqldump** imprime a mensagem de erro, mas também escreve um comentário SQL contendo a definição da visão na saída do dump e continua a executar.

  Se a opção `--ignore-error` também for fornecida para ignorar erros específicos, a opção `--force` terá precedência.

- `--log-error=file_name`

  <table summary="Propriedades para autenticação padrão"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--default-auth=plugin</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>2

  Registre avisos e erros anexando-os ao arquivo nomeado. O padrão é não registrar.

- `--skip-comments`

  <table summary="Propriedades para autenticação padrão"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--default-auth=plugin</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>3

  Veja a descrição da opção `--comments`.

- `--verbose`, `-v`

  <table summary="Propriedades para autenticação padrão"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--default-auth=plugin</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>4

  Modo verbose. Imprima mais informações sobre o que o programa faz.

#### Opções de Ajuda

As seguintes opções exibem informações sobre o próprio comando **mysqldump**.

- `--help`, `-?`

  <table summary="Propriedades para autenticação padrão"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--default-auth=plugin</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>5

  Exiba uma mensagem de ajuda e saia.

- `--version`, `-V`

  <table summary="Propriedades para autenticação padrão"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--default-auth=plugin</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>6

  Exibir informações da versão e sair.

#### Opções de internacionalização

As opções a seguir alteram a forma como o comando **mysqldump** representa dados de caracteres com configurações de idioma nacional.

- `--character-sets-dir=dir_name`

  <table summary="Propriedades para autenticação padrão"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--default-auth=plugin</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>7

  O diretório onde os conjuntos de caracteres são instalados. Consulte a Seção 12.15, “Configuração de Conjunto de Caracteres”.

- `--default-character-set=charset_name`

  <table summary="Propriedades para autenticação padrão"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--default-auth=plugin</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>8

  Use `charset_name` como o conjunto de caracteres padrão. Veja a Seção 12.15, “Configuração do Conjunto de Caracteres”. Se nenhum conjunto de caracteres for especificado, o **mysqldump** usa `utf8mb4`.

- `--no-set-names`, `-N`

  <table summary="Propriedades para autenticação padrão"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--default-auth=plugin</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>9

  Desativa o ajuste `--set-charset`, o mesmo que especificar `--skip-set-charset`.

- `--set-charset`

  <table summary="Propriedades para habilitar o plugin enable-cleartext"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--enable-cleartext-plugin</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>0

  Escreva `SET NAMES default_character_set` na saída. Esta opção está habilitada por padrão. Para suprimir a declaração `SET NAMES`, use `--skip-set-charset`.

#### Opções de replicação

O comando **mysqldump** é frequentemente usado para criar uma instância vazia ou uma instância que inclua dados em um servidor de replicação em uma configuração de replicação. As seguintes opções se aplicam ao descarregamento e ao restabelecimento de dados em servidores de origem de replicação e réplicas.

- `--apply-replica-statements`

  <table summary="Propriedades para habilitar o plugin enable-cleartext"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--enable-cleartext-plugin</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>1

  A partir do MySQL 8.0.26, use `--apply-replica-statements`, e antes do MySQL 8.0.26, use `--apply-slave-statements`. Ambas as opções têm o mesmo efeito. Para um dump de replica produzido com a opção `--dump-replica` ou `--dump-slave`, as opções adicionam uma declaração `STOP REPLICA` (ou antes do MySQL 8.0.22, `STOP SLAVE`) antes da declaração com as coordenadas do log binário, e uma declaração `START REPLICA` no final da saída.

- `--apply-slave-statements`

  <table summary="Propriedades para habilitar o plugin enable-cleartext"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--enable-cleartext-plugin</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>2

  Use esta opção antes do MySQL 8.0.26 em vez de `--apply-replica-statements`. Ambas as opções têm o mesmo efeito.

- `--delete-source-logs`

  <table summary="Propriedades para habilitar o plugin enable-cleartext"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--enable-cleartext-plugin</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>3

  A partir do MySQL 8.0.26, use `--delete-source-logs`, e antes do MySQL 8.0.26, use `--delete-master-logs`. Ambas as opções têm o mesmo efeito. Em um servidor de origem de replicação, as opções excluem os logs binários enviando uma declaração `PURGE BINARY LOGS` para o servidor após a execução da operação de dump. As opções exigem o privilégio `RELOAD`, além de privilégios suficientes para executar essa declaração. As opções habilitam automaticamente `--source-data` ou `--master-data`.

- `--delete-master-logs`

  <table summary="Propriedades para habilitar o plugin enable-cleartext"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--enable-cleartext-plugin</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>4

  Use esta opção antes do MySQL 8.0.26 em vez de `--delete-source-logs`. Ambas as opções têm o mesmo efeito.

- `--dump-replica[=value]`

  <table summary="Propriedades para habilitar o plugin enable-cleartext"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--enable-cleartext-plugin</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>5

  A partir do MySQL 8.0.26, use `--dump-replica`, e antes do MySQL 8.0.26, use `--dump-slave`. Ambas as opções têm o mesmo efeito. As opções são semelhantes a `--source-data`, exceto que são usadas para drenar um servidor replica para produzir um arquivo de dump que pode ser usado para configurar outro servidor como uma replica que tem a mesma fonte do servidor descarregado. As opções fazem com que a saída do dump inclua uma declaração `CHANGE REPLICATION SOURCE TO` (a partir do MySQL 8.0.23) ou declaração `CHANGE MASTER TO` (antes do MySQL 8.0.23) que indica as coordenadas do log binário (nome do arquivo e posição) da fonte da replica descarregada. A declaração `CHANGE REPLICATION SOURCE TO` lê os valores de `Relay_Master_Log_File` e `Exec_Master_Log_Pos` da saída `SHOW REPLICA STATUS` e os usa para `SOURCE_LOG_FILE` e `SOURCE_LOG_POS`, respectivamente. Essas são as coordenadas do servidor fonte da replica de onde a replica começa a replicar.

  Nota

  Inconsistências na sequência das transações do log de retransmissão que foram executadas podem causar o uso da posição errada. Consulte a Seção 19.5.1.34, “Replicação e Inconsistências de Transações”, para obter mais informações.

  `--dump-replica` ou `--dump-slave` faz com que as coordenadas da fonte sejam usadas em vez das do servidor descarregado, como é feito pela opção `--source-data` ou `--master-data`. Além disso, ao especificar essa opção, a opção `--source-data` ou `--master-data` é substituída, se usada, e efetivamente ignorada.

  Aviso

  `--dump-replica` ou `--dump-slave` não devem ser usados se o servidor onde a dump vai ser aplicada usa `gtid_mode=ON` e `SOURCE_AUTO_POSITION=1` ou `MASTER_AUTO_POSITION=1`.

  O valor da opção é tratado da mesma maneira que para `--source-data`. Definir sem valor ou 1 faz com que uma declaração `CHANGE REPLICATION SOURCE TO` (a partir do MySQL 8.0.23) ou declaração `CHANGE MASTER TO` (antes do MySQL 8.0.23) seja escrita no dump. Definir 2 faz com que a declaração seja escrita, mas encapsulada em comentários SQL. Tem o mesmo efeito que `--source-data` em termos de habilitar ou desabilitar outras opções e de como o bloqueio é tratado.

  `--dump-replica` ou `--dump-slave` faz com que o **mysqldump** pare o fio de replicação SQL antes do dump e o reinicie novamente depois.

  `--dump-replica` ou `--dump-slave` envia uma declaração `SHOW REPLICA STATUS` para o servidor para obter informações, portanto, eles exigem privilégios suficientes para executar essa declaração.

  As opções `--apply-replica-statements` e `--include-source-host-port` podem ser usadas em conjunto com `--dump-replica` ou `--dump-slave`.

- `--dump-slave[=value]`

  <table summary="Propriedades para habilitar o plugin enable-cleartext"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--enable-cleartext-plugin</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>6

  Use esta opção antes do MySQL 8.0.26 em vez de `--dump-replica`. Ambas as opções têm o mesmo efeito.

- `--include-source-host-port`

  <table summary="Propriedades para habilitar o plugin enable-cleartext"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--enable-cleartext-plugin</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>7

  A partir do MySQL 8.0.26, use `--include-source-host-port`, e antes do MySQL 8.0.26, use `--include-master-host-port`. Ambas as opções têm o mesmo efeito. As opções adicionam as opções `SOURCE_HOST` | `MASTER_HOST` e `SOURCE_PORT` | `MASTER_PORT` para o nome do host e o número da porta TCP/IP da fonte da réplica, à declaração `CHANGE REPLICATION SOURCE TO` (a partir do MySQL 8.0.23) ou à declaração `CHANGE MASTER TO` (antes do MySQL 8.0.23) em um dump de réplica produzido com a opção `--dump-replica` ou `--dump-slave`.

- `--include-master-host-port`

  <table summary="Propriedades para habilitar o plugin enable-cleartext"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--enable-cleartext-plugin</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>8

  Use esta opção antes do MySQL 8.0.26 em vez de `--include-source-host-port`. Ambas as opções têm o mesmo efeito.

- `--source-data[=value]`

  <table summary="Propriedades para habilitar o plugin enable-cleartext"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--enable-cleartext-plugin</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>9

  A partir do MySQL 8.0.26, use `--source-data`, e antes do MySQL 8.0.26, use `--master-data`. Ambas as opções têm o mesmo efeito. As opções são usadas para drenar um servidor de origem de replicação para produzir um arquivo de dump que pode ser usado para configurar outro servidor como uma réplica do servidor de origem. As opções fazem com que a saída do dump inclua uma declaração `CHANGE REPLICATION SOURCE TO` (a partir do MySQL 8.0.23) ou declaração `CHANGE MASTER TO` (antes do MySQL 8.0.23) que indica as coordenadas do log binário (nome do arquivo e posição) do servidor descarregado. Essas são as coordenadas do servidor de origem de replicação a partir das quais a réplica deve começar a replicar após carregar o arquivo de dump na réplica.

  Se o valor da opção for 2, a declaração `CHANGE REPLICATION SOURCE TO` | `CHANGE MASTER TO` é escrita como um comentário SQL e, portanto, é apenas informativa; ela não tem efeito quando o arquivo de dump é recarregado. Se o valor da opção for 1, a declaração não é escrita como um comentário e tem efeito quando o arquivo de dump é recarregado. Se nenhum valor de opção for especificado, o valor padrão é 1.

  `--source-data` e `--master-data` enviam uma declaração `SHOW MASTER STATUS` para o servidor para obter informações, portanto, eles exigem privilégios suficientes para executar essa declaração. Esta opção também requer o privilégio `RELOAD` e o log binário deve estar habilitado.

  `--source-data` e `--master-data` desligam automaticamente `--lock-tables`. Eles também ligam `--lock-all-tables`, a menos que `--single-transaction` também seja especificado, caso em que uma trava de leitura global é adquirida apenas por um curto período no início do dump (veja a descrição para `--single-transaction`). Em todos os casos, qualquer ação nos logs acontece no exato momento do dump.

  Também é possível configurar uma replica descarregando uma replica existente da fonte, usando a opção `--dump-replica` ou `--dump-slave`, que substitui `--source-data` e `--master-data` e faz com que eles sejam ignorados.

- `--master-data[=value]`

  <table summary="Propriedades para get-server-public-key"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--get-server-public-key</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr></tbody></table>0

  Use esta opção antes do MySQL 8.0.26 em vez de `--source-data`. Ambas as opções têm o mesmo efeito.

- `--set-gtid-purged=value`

  <table summary="Propriedades para get-server-public-key"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--get-server-public-key</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr></tbody></table>1

  Esta opção é para servidores que usam replicação baseada em GTID (`gtid_mode=ON`). Ela controla a inclusão de uma declaração `SET @@GLOBAL.gtid_purged` na saída do dump, que atualiza o valor de `gtid_purged` em um servidor onde o arquivo de dump é recarregado, para adicionar o conjunto de GTID da variável de sistema `gtid_executed` do servidor de origem. `gtid_purged` contém os GTIDs de todas as transações que foram aplicadas no servidor, mas não existem em nenhum arquivo de log binário no servidor. Portanto, o **mysqldump** adiciona os GTIDs das transações que foram executadas no servidor de origem, para que o servidor de destino registre essas transações como aplicadas, embora não as tenha em seus logs binários. `--set-gtid-purged` também controla a inclusão de uma declaração `SET @@SESSION.sql_log_bin=0`, que desabilita o registro binário enquanto o arquivo de dump está sendo recarregado. Esta declaração impede que novos GTIDs sejam gerados e atribuídos às transações no arquivo de dump à medida que são executadas, para que os GTIDs originais das transações sejam usados.

  Se você não definir a opção `--set-gtid-purged`, o padrão é incluir uma declaração `SET @@GLOBAL.gtid_purged` na saída do dump se os GTIDs estiverem habilitados no servidor que você está fazendo o backup, e o conjunto de GTIDs no valor global da variável de sistema `gtid_executed` não estiver vazio. Uma declaração `SET @@SESSION.sql_log_bin=0` também será incluída se os GTIDs estiverem habilitados no servidor.

  Você pode substituir o valor de `gtid_purged` por um conjunto de GTID especificado ou adicionar um sinal de mais (+) à declaração para anexar um conjunto de GTID especificado ao conjunto de GTID já armazenado em `gtid_purged`. A declaração `SET @@GLOBAL.gtid_purged` registrada pelo **mysqldump** inclui um sinal de mais (`+`) em um comentário específico da versão, de modo que o MySQL adicione o conjunto de GTID do arquivo de dump ao valor existente em `gtid_purged`.

  É importante notar que o valor que o **mysqldump** inclui para a declaração `SET @@GLOBAL.gtid_purged` inclui os GTIDs de todas as transações no conjunto `gtid_executed` no servidor, mesmo aquelas que alteraram partes suprimidas do banco de dados, ou outros bancos de dados no servidor que não foram incluídos em um dump parcial. Isso pode significar que, após o valor `gtid_purged` ter sido atualizado no servidor onde o arquivo de dump é reexecutado, os GTIDs estão presentes e não estão relacionados a nenhum dado no servidor de destino. Se você não reexecutar mais arquivos de dump no servidor de destino, os GTIDs estranhos não causam problemas com o funcionamento futuro do servidor, mas tornam mais difícil comparar ou reconciliar conjuntos de GTIDs em diferentes servidores na topologia de replicação. Se você reexecutar mais um arquivo de dump no servidor de destino que contém os mesmos GTIDs (por exemplo, outro dump parcial do mesmo servidor de origem), qualquer declaração `SET @@GLOBAL.gtid_purged` no segundo arquivo de dump falha. Neste caso, remova a declaração manualmente antes de reexecutar o arquivo de dump, ou produza o arquivo de dump sem a declaração.

  Antes do MySQL 8.0.32: O uso desta opção com a opção `--single-transaction` poderia levar a inconsistências na saída. Se `--set-gtid-purged=ON` for necessário, ele pode ser usado com `--lock-all-tables`, mas isso pode impedir consultas paralelas enquanto o **mysqldump** estiver sendo executado.

  Se a instrução `SET @@GLOBAL.gtid_purged` não produzir o resultado desejado no servidor de destino, você pode excluir a instrução da saída ou (a partir do MySQL 8.0.17) incluí-la, mas com um comentário para que ela não seja executada automaticamente. Você também pode incluir a instrução, mas editá-la manualmente no arquivo de dump para obter o resultado desejado.

  Os possíveis valores para a opção `--set-gtid-purged` são os seguintes:

  `AUTO` :   O valor padrão. Se os GTIDs estiverem habilitados no servidor que você está fazendo o backup e `gtid_executed` não estiver vazio, `SET @@GLOBAL.gtid_purged` será adicionado ao resultado, contendo o conjunto de GTIDs de `gtid_executed`. Se os GTIDs estiverem habilitados, `SET @@SESSION.sql_log_bin=0` será adicionado ao resultado. Se os GTIDs não estiverem habilitados no servidor, as declarações não serão adicionadas ao resultado.

  `OFF` : `SET @@GLOBAL.gtid_purged` não é adicionado ao resultado, e `SET @@SESSION.sql_log_bin=0` não é adicionado ao resultado. Para um servidor onde os GTIDs não estão em uso, use esta opção ou `AUTO`. Use esta opção apenas para um servidor onde os GTIDs estão em uso se você tiver certeza de que o conjunto de GTIDs necessário já está presente em `gtid_purged` no servidor de destino e não deve ser alterado, ou se você planeja identificar e adicionar manualmente quaisquer GTIDs ausentes.

  `ON` :   Se os GTIDs estiverem habilitados no servidor que você está fazendo o backup, `SET @@GLOBAL.gtid_purged` é adicionado ao resultado (a menos que `gtid_executed` esteja vazio) e `SET @@SESSION.sql_log_bin=0` é adicionado ao resultado. Um erro ocorre se você definir essa opção, mas os GTIDs não estiverem habilitados no servidor. Para um servidor onde os GTIDs estão em uso, use essa opção ou `AUTO`, a menos que você esteja certo de que os GTIDs em `gtid_executed` não são necessários no servidor de destino.

  `COMMENTED` : Disponível a partir do MySQL 8.0.17. Se os GTIDs estiverem habilitados no servidor que você está fazendo o backup, `SET @@GLOBAL.gtid_purged` é adicionado ao resultado (a menos que `gtid_executed` esteja vazio), mas ele é desmarcado. Isso significa que o valor de `gtid_executed` está disponível no resultado, mas nenhuma ação é realizada automaticamente quando o arquivo de dump é carregado novamente. `SET @@SESSION.sql_log_bin=0` é adicionado ao resultado, e ele não é desmarcado. Com `COMMENTED`, você pode controlar o uso do conjunto `gtid_executed` manualmente ou por meio de automação. Por exemplo, você pode preferir fazer isso se estiver migrando dados para outro servidor que já tem diferentes bancos de dados ativos.

#### Opções de formato

As seguintes opções especificam como representar todo o arquivo de registro ou certos tipos de dados no arquivo de registro. Elas também controlam se certas informações opcionais são escritas no arquivo de registro.

- `--compact`

  <table summary="Propriedades para get-server-public-key"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--get-server-public-key</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr></tbody></table>2

  Produza uma saída mais compacta. Esta opção habilita as opções `--skip-add-drop-table`, `--skip-add-locks`, `--skip-comments`, `--skip-disable-keys` e `--skip-set-charset`.

- `--compatible=name`

  <table summary="Propriedades para get-server-public-key"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--get-server-public-key</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr></tbody></table>3

  Produza uma saída mais compatível com outros sistemas de banco de dados ou com servidores MySQL mais antigos. O único valor permitido para esta opção é `ansi`, que tem o mesmo significado que a opção correspondente para definir o modo SQL do servidor. Consulte a Seção 7.1.11, “Modos SQL do Servidor”.

- `--complete-insert`, `-c`

  <table summary="Propriedades para get-server-public-key"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--get-server-public-key</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr></tbody></table>4

  Use declarações completas `INSERT` que incluam os nomes das colunas.

- `--create-options`

  <table summary="Propriedades para get-server-public-key"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--get-server-public-key</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr></tbody></table>5

  Inclua todas as opções de tabela específicas do MySQL nas declarações `CREATE TABLE`.

- `--fields-terminated-by=...`, `--fields-enclosed-by=...`, `--fields-optionally-enclosed-by=...`, `--fields-escaped-by=...`

  <table summary="Propriedades para get-server-public-key"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--get-server-public-key</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr></tbody></table>6

  <table summary="Propriedades para get-server-public-key"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--get-server-public-key</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr></tbody></table>7

  <table summary="Propriedades para get-server-public-key"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--get-server-public-key</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr></tbody></table>8

  <table summary="Propriedades para get-server-public-key"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--get-server-public-key</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr></tbody></table>9

  Essas opções são usadas com a opção `--tab` e têm o mesmo significado das cláusulas correspondentes `FIELDS` para `LOAD DATA`. Veja a Seção 15.2.9, “Instrução LOAD DATA”.

- `--hex-blob`

  <table summary="Propriedades para o anfitrião"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--host</code>]]</td> </tr></tbody></table>0

  Arrume colunas binárias usando notação hexadecimal (por exemplo, `'abc'` se torna `0x616263`). Os tipos de dados afetados são os tipos `BINARY`, `VARBINARY`, `BLOB`, `BIT`, todos os tipos de dados espaciais e outros tipos de dados não binários quando usados com o conjunto de caracteres `binary`.

  A opção `--hex-blob` é ignorada quando o `--tab` é usado.

- `--lines-terminated-by=...`

  <table summary="Propriedades para o anfitrião"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--host</code>]]</td> </tr></tbody></table>1

  Esta opção é usada com a opção `--tab` e tem o mesmo significado que a cláusula correspondente `LINES` para `LOAD DATA`. Veja a Seção 15.2.9, “Instrução LOAD DATA”.

- `--quote-names`, `-Q`

  <table summary="Propriedades para o anfitrião"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--host</code>]]</td> </tr></tbody></table>2

  Identifique os identificadores (como nomes de banco de dados, tabelas e colunas) dentro de `` ` `` caracteres. Se o modo SQL `ANSI_QUOTES` estiver habilitado, os identificadores são citados dentro de `"` caracteres. Esta opção é habilitada por padrão. Pode ser desativada com `--skip-quote-names`, mas esta opção deve ser dada após qualquer opção como `--compatible` que possa habilitar `--quote-names`.

- `--result-file=file_name`, `-r file_name`

  <table summary="Propriedades para o anfitrião"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--host</code>]]</td> </tr></tbody></table>3

  Saída direta para o arquivo nomeado. O arquivo de resultado é criado e seus conteúdos anteriores são sobrescritos, mesmo que um erro ocorra durante a geração do dump.

  Essa opção deve ser usada no Windows para evitar que os caracteres de nova linha `\n` sejam convertidos em sequências de retorno de carro/nova linha `\r\n`.

- `--show-create-skip-secondary-engine=value`

  <table summary="Propriedades para o anfitrião"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--host</code>]]</td> </tr></tbody></table>4

  Exclui a cláusula `SECONDARY ENGINE` das declarações `CREATE TABLE`. Isso é feito habilitando a variável de sistema `show_create_table_skip_secondary_engine` durante a operação de dump. Alternativamente, você pode habilitar a variável de sistema `show_create_table_skip_secondary_engine` antes de usar o **mysqldump**.

  Essa opção foi adicionada no MySQL 8.0.18. Tentando uma operação de **mysqldump** com a opção `--show-create-skip-secondary-engine` em uma versão anterior ao MySQL 8.0.18 que não suporta a variável `show_create_table_skip_secondary_engine` causa um erro.

- `--tab=dir_name`, `-T dir_name`

  <table summary="Propriedades para o anfitrião"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--host</code>]]</td> </tr></tbody></table>5

  Produza arquivos de dados no formato de texto separados por tabulação. Para cada tabela descarregada, o **mysqldump** cria um arquivo `tbl_name.sql` que contém a instrução `CREATE TABLE` que cria a tabela, e o servidor escreve um arquivo `tbl_name.txt` que contém seus dados. O valor da opção é o diretório onde os arquivos serão escritos.

  Nota

  Esta opção deve ser usada apenas quando o **mysqldump** for executado na mesma máquina que o servidor **mysqld**. Como o servidor cria arquivos `*.txt` no diretório que você especificar, o diretório deve ser legível pelo servidor e a conta MySQL que você usar deve ter o privilégio `FILE`. Como o **mysqldump** cria `*.sql` no mesmo diretório, ele deve ser legível pela conta de login do seu sistema.

  Por padrão, os arquivos de dados `.txt` são formatados usando caracteres de tabulação entre os valores das colunas e uma nova linha no final de cada linha. O formato pode ser especificado explicitamente usando as opções `--fields-xxx` e `--lines-terminated-by`.

  Os valores das colunas são convertidos para o conjunto de caracteres especificado pela opção `--default-character-set`.

- `--tz-utc`

  <table summary="Propriedades para o anfitrião"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--host</code>]]</td> </tr></tbody></table>6

  Essa opção permite que as colunas `TIMESTAMP` sejam descarregadas e recarregadas entre servidores em diferentes fusos horários. O **mysqldump** define seu fuso horário de conexão como UTC e adiciona `SET TIME_ZONE='+00:00'` ao arquivo de dump. Sem essa opção, as colunas `TIMESTAMP` são descarregadas e recarregadas nos fusos horários locais dos servidores de origem e destino, o que pode causar alterações nos valores se os servidores estiverem em fusos horários diferentes. `--tz-utc` também protege contra alterações devido ao horário de verão. `--tz-utc` está habilitado por padrão. Para desabilitá-lo, use `--skip-tz-utc`.

- `--xml`, `-X`

  <table summary="Propriedades para o anfitrião"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--host</code>]]</td> </tr></tbody></table>7

  Escreva a saída do dump em formato bem formado de XML.

  **`NULL`, `'NULL'` e Valores Vazios**: Para uma coluna denominada `column_name`, o valor `NULL`, uma string vazia e o valor da string `'NULL'` são distinguidos uns dos outros na saída gerada por esta opção da seguinte forma.

  <table summary="Propriedades para o anfitrião"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--host</code>]]</td> </tr></tbody></table>8

  A saída do cliente **mysql** quando executado com a opção `--xml` também segue as regras anteriores. (Veja a Seção 6.5.1.1, “Opções do Cliente mysql”.)

  A saída XML do **mysqldump** inclui o espaço de nomes XML, conforme mostrado aqui:

  ```
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

  <table summary="Propriedades para o anfitrião"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--host</code>]]</td> </tr></tbody></table>9

  Exclua todas as tabelas em todos os bancos de dados. Isso é o mesmo que usar a opção `--databases` e nomear todos os bancos de dados na linha de comando.

  Nota

  Consulte a descrição do `--add-drop-database` para obter informações sobre uma incompatibilidade dessa opção com o `--all-databases`.

  Antes do MySQL 8.0, as opções `--routines` e `--events` para **mysqldump** e **mysqlpump** não eram necessárias para incluir rotinas e eventos armazenados ao usar a opção `--all-databases`: o dump incluía o banco de dados do sistema `mysql`, e, portanto, também as tabelas `mysql.proc` e `mysql.event` que continham definições de rotinas e eventos armazenados. A partir do MySQL 8.0, as tabelas `mysql.event` e `mysql.proc` não são usadas. As definições dos objetos correspondentes são armazenadas em tabelas do dicionário de dados, mas essas tabelas não são incluídas no dump. Para incluir rotinas e eventos armazenados em um dump feito usando `--all-databases`, use as opções `--routines` e `--events` explicitamente.

- `--databases`, `-B`

  <table summary="Propriedades para o caminho de login"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--login-path=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>0

  Exporte várias bases de dados. Normalmente, o **mysqldump** trata o argumento de nome do primeiro banco de dados na linha de comando como um nome de banco de dados e os nomes seguintes como nomes de tabelas. Com esta opção, ele trata todos os argumentos de nome como nomes de bancos de dados. As instruções `CREATE DATABASE` e `USE` são incluídas na saída antes de cada novo banco de dados.

  Essa opção pode ser usada para descartar o banco de dados `performance_schema`, que normalmente não é descartado mesmo com a opção `--all-databases`. (Use também a opção `--skip-lock-tables`.)

  Nota

  Consulte a descrição do `--add-drop-database` para obter informações sobre uma incompatibilidade dessa opção com o `--databases`.

- `--events`, `-E`

  <table summary="Propriedades para o caminho de login"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--login-path=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>1

  Inclua os eventos do Agendamento de Eventos para as bases de dados descartadas na saída. Esta opção requer os privilégios `EVENT` para essas bases de dados.

  A saída gerada usando `--events` contém instruções `CREATE EVENT` para criar os eventos.

- `--ignore-error=error[,error]...`

  <table summary="Propriedades para o caminho de login"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--login-path=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>2

  Ignore os erros especificados. O valor da opção é uma lista de números de erro separados por vírgula, especificando os erros a serem ignorados durante a execução do **mysqldump**. Se a opção `--force` também for fornecida para ignorar todos os erros, o `--force` terá precedência.

- `--ignore-table=db_name.tbl_name`

  <table summary="Propriedades para o caminho de login"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--login-path=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>3

  Não descarte a tabela fornecida, que deve ser especificada usando tanto os nomes do banco de dados quanto da tabela. Para ignorar múltiplas tabelas, use essa opção várias vezes. Essa opção também pode ser usada para ignorar visualizações.

- `--no-data`, `-d`

  <table summary="Propriedades para o caminho de login"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--login-path=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>4

  Não escreva nenhuma informação da linha da tabela (ou seja, não descarregue o conteúdo da tabela). Isso é útil se você quiser descarregar apenas a declaração `CREATE TABLE` da tabela (por exemplo, para criar uma cópia vazia da tabela carregando o arquivo de descarregamento).

- `--routines`, `-R`

  <table summary="Propriedades para o caminho de login"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--login-path=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>5

  Inclua rotinas armazenadas (procedimentos e funções) para os bancos de dados descartados na saída. Esta opção requer o privilégio global `SELECT`.

  A saída gerada usando `--routines` contém as instruções `CREATE PROCEDURE` e `CREATE FUNCTION` para criar as rotinas.

- `--skip-generated-invisible-primary-key`

  <table summary="Propriedades para o caminho de login"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--login-path=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>6

  Esta opção está disponível a partir do MySQL 8.0.30 e exclui as chaves primárias invisíveis geradas do resultado. Para mais informações, consulte a Seção 15.1.20.11, “Chaves Primárias Invisíveis Geradas”.

- `--tables`

  <table summary="Propriedades para o caminho de login"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--login-path=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>7

  Supere a opção `--databases` ou `-B`. O **mysqldump** considera todos os argumentos de nome após a opção como nomes de tabela.

- `--triggers`

  <table summary="Propriedades para o caminho de login"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--login-path=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>8

  Inclua os gatilhos para cada tabela descarregada na saída. Esta opção está habilitada por padrão; desabilite-a com `--skip-triggers`.

  Para poder descartar os gatilhos de uma tabela, você deve ter o privilégio `TRIGGER` para a tabela.

  Múltiplos gatilhos são permitidos. O **mysqldump** grava os gatilhos na ordem de ativação, para que, ao recarregar o arquivo de dump, os gatilhos sejam criados na mesma ordem de ativação. No entanto, se um arquivo de dump do **mysqldump** contiver múltiplos gatilhos para uma tabela que tenham o mesmo evento de gatilho e hora de ação, ocorrerá um erro para tentativas de carregar o arquivo de dump em um servidor mais antigo que não suporte múltiplos gatilhos. (Para uma solução alternativa, consulte as Notas de Desconexão; você pode converter os gatilhos para serem compatíveis com servidores mais antigos.)

- `--where='where_condition'`, `-w 'where_condition'`

  <table summary="Propriedades para o caminho de login"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--login-path=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>9

  Exclua apenas as linhas selecionadas pela condição `WHERE` fornecida. As aspas ao redor da condição são obrigatórias se ela contiver espaços ou outros caracteres especiais para o interpretador do comando.

  Exemplos:

  ```
  --where="user='jimf'"
  -w"userid>1"
  -w"userid<1"
  ```

#### Opções de desempenho

As seguintes opções são as mais relevantes para o desempenho, especialmente das operações de restauração. Para conjuntos de dados grandes, a operação de restauração (processamento das instruções `INSERT` no arquivo de dump) é a parte mais demorada. Quando é urgente restaurar os dados rapidamente, planeje e teste o desempenho desta etapa com antecedência. Para tempos de restauração medidos em horas, você pode preferir uma solução de backup e restauração alternativa, como o MySQL Enterprise Backup para bancos de dados `InnoDB` e de uso misto.

O desempenho também é afetado pelas opções transacionais, principalmente para a operação de dump.

- `--column-statistics`

  <table summary="Propriedades para senha"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--password[=password]</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>0

  Adicione as declarações `ANALYZE TABLE` ao resultado para gerar estatísticas de histogramas para tabelas descarregadas quando o arquivo de descarregamento for carregado novamente. Esta opção está desativada por padrão porque a geração de histogramas para tabelas grandes pode levar muito tempo.

- `--disable-keys`, `-K`

  <table summary="Propriedades para senha"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--password[=password]</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>1

  Para cada tabela, rode as declarações `INSERT` com as declarações `/*!40000 ALTER TABLE tbl_name DISABLE KEYS */;` e `/*!40000 ALTER TABLE tbl_name ENABLE KEYS */;`. Isso torna o carregamento do arquivo de dump mais rápido, pois os índices são criados após todas as linhas serem inseridas. Esta opção é eficaz apenas para índices não únicos das tabelas `MyISAM`.

- `--extended-insert`, `-e`

  <table summary="Propriedades para senha"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--password[=password]</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>2

  Escreva declarações `INSERT` usando a sintaxe de várias linhas que inclui várias listas `VALUES`. Isso resulta em um arquivo de depuração menor e acelera as inserções quando o arquivo é carregado novamente.

- `--insert-ignore`

  <table summary="Propriedades para senha"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--password[=password]</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>3

  Escreva declarações `INSERT IGNORE` em vez de declarações `INSERT`.

- `--max-allowed-packet=value`

  <table summary="Propriedades para senha"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--password[=password]</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>4

  O tamanho máximo do buffer para a comunicação cliente/servidor. O padrão é de 24 MB, e o máximo é de 1 GB.

  Nota

  O valor dessa opção é específico para o **mysqldump** e não deve ser confundido com a variável de sistema `max_allowed_packet` do servidor MySQL; o valor do servidor não pode ser excedido por um único pacote do **mysqldump**, independentemente de qualquer configuração da opção **mysqldump**, mesmo que esta seja maior.

- `--mysqld-long-query-time=value`

  <table summary="Propriedades para senha"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--password[=password]</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>5

  Defina o valor da sessão da variável de sistema `long_query_time`. Use esta opção, disponível a partir do MySQL 8.0.30, se quiser aumentar o tempo permitido para consultas do **mysqldump** antes que sejam registradas no arquivo de log de consultas lentas. O **mysqldump** realiza uma varredura completa da tabela, o que significa que suas consultas podem frequentemente exceder um ajuste global `long_query_time` que é útil para consultas regulares. O ajuste global padrão é de 10 segundos.

  Você pode usar `--mysqld-long-query-time` para especificar um valor de sessão de 0 (o que significa que todas as consultas do **mysqldump** são registradas no log de consultas lentas) para 31536000, que é de 365 dias em segundos. Para a opção do **mysqldump**, você só pode especificar segundos inteiros. Quando você não especifica essa opção, o ajuste global do servidor se aplica às consultas do **mysqldump**.

- `--net-buffer-length=value`

  <table summary="Propriedades para senha"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--password[=password]</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>6

  O tamanho inicial do buffer para a comunicação cliente/servidor. Ao criar instruções `INSERT` de várias linhas (como com a opção `--extended-insert` ou `--opt`), o **mysqldump** cria linhas com até `--net-buffer-length` bytes de comprimento. Se você aumentar essa variável, certifique-se de que a variável de sistema do servidor MySQL `net_buffer_length` tenha um valor pelo menos desse tamanho.

- `--network-timeout`, `-M`

  <table summary="Propriedades para senha"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--password[=password]</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>7

  Ative a exclusão de tabelas grandes definindo `--max-allowed-packet` no seu valor máximo e configurando os tempos de espera para leitura e escrita na rede para um valor grande. Esta opção está habilitada por padrão. Para desabilitá-la, use `--skip-network-timeout`.

- `--opt`

  <table summary="Propriedades para senha"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--password[=password]</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>8

  Esta opção, ativada por padrão, é uma abreviação da combinação de `--add-drop-table` `--add-locks` `--create-options` `--disable-keys` `--extended-insert` `--lock-tables` `--quick` `--set-charset`. Ela oferece uma operação de varredura rápida e produz um arquivo de varredura que pode ser carregado rapidamente em um servidor MySQL.

  Como a opção `--opt` está habilitada por padrão, você só precisa especificar sua oposta, a opção `--skip-opt`, para desativar várias configurações padrão. Consulte a discussão sobre os grupos de opções `mysqldump` para obter informações sobre como habilitar ou desabilitar seletivamente um subconjunto das opções afetadas por `--opt`.

- `--quick`, `-q`

  <table summary="Propriedades para senha"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--password[=password]</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>9

  Esta opção é útil para descartar tabelas grandes. Ela obriga o **mysqldump** a recuperar linhas de uma tabela do servidor uma linha de cada vez, em vez de recuperar todo o conjunto de linhas e armazená-lo em memória antes de gravá-lo.

- `--skip-opt`

  <table summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>00

  Veja a descrição da opção `--opt`.

#### Opções de transação

As seguintes opções sacrificam o desempenho da operação de exclusão em favor da confiabilidade e consistência dos dados exportados.

- `--add-locks`

  <table summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>01

  Cerque cada dump de tabela com as instruções `LOCK TABLES` e `UNLOCK TABLES`. Isso resulta em inserções mais rápidas quando o arquivo de dump é recarregado. Veja a Seção 10.2.5.1, “Otimizando instruções INSERT”.

- `--flush-logs`, `-F`

  <table summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>02

  Limpe os arquivos de log do servidor MySQL antes de iniciar o dump. Esta opção requer o privilégio `RELOAD`. Se você usar esta opção em combinação com a opção `--all-databases`, os logs são limpos *para cada banco de dados dumpado*. A exceção é quando você usa `--lock-all-tables`, `--source-data` ou `--master-data`, ou `--single-transaction`. Nesses casos, os logs são limpos apenas uma vez, correspondendo ao momento em que todas as tabelas são bloqueadas por `FLUSH TABLES WITH READ LOCK`. Se você deseja que seu dump e o flush do log aconteçam exatamente no mesmo momento, você deve usar `--flush-logs` junto com `--lock-all-tables`, `--source-data` ou `--master-data`, ou `--single-transaction`.

- `--flush-privileges`

  <table summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>03

  Adicione uma declaração `FLUSH PRIVILEGES` à saída do dump após o dumping do banco de dados `mysql`. Esta opção deve ser usada sempre que o dump contiver o banco de dados `mysql` e qualquer outro banco de dados que dependa dos dados do banco de dados `mysql` para uma restauração adequada.

  Como o arquivo de descarte contém uma declaração `FLUSH PRIVILEGES`, a recarga do arquivo requer privilégios suficientes para executar essa declaração.

  Nota

  Para atualizações para o MySQL 5.7 ou superior a partir de versões mais antigas, não use `--flush-privileges`. Para obter instruções de atualização neste caso, consulte a Seção 3.5, “Alterações no MySQL 8.0”.

- `--lock-all-tables`, `-x`

  <table summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>04

  Bloquear todas as tabelas em todos os bancos de dados. Isso é feito ao adquirir um bloqueio de leitura global por toda a duração do dump. Esta opção desativa automaticamente `--single-transaction` e `--lock-tables`.

- `--lock-tables`, `-l`

  <table summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>05

  Para cada banco de dados descartado, bloqueie todas as tabelas que serão descartadas antes de fazê-lo. As tabelas são bloqueadas com `READ LOCAL` para permitir inserções concorrentes no caso das tabelas `MyISAM`. Para tabelas transacionais, como `InnoDB`, `--single-transaction` é uma opção muito melhor do que `--lock-tables`, pois não precisa bloquear as tabelas.

  Como o `--lock-tables` bloqueia as tabelas para cada banco de dados separadamente, essa opção não garante que as tabelas no arquivo de dump estejam logicamente consistentes entre os bancos de dados. As tabelas em diferentes bancos de dados podem ser descarregadas em estados completamente diferentes.

  Algumas opções, como `--opt`, ativam automaticamente `--lock-tables`. Se você quiser substituir isso, use `--skip-lock-tables` no final da lista de opções.

- `--no-autocommit`

  <table summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>06

  Inclua as declarações `INSERT` para cada tabela descarregada dentro das declarações `SET autocommit = 0` e `COMMIT`.

- `--order-by-primary`

  <table summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>07

  Exclua as linhas de cada tabela ordenadas por sua chave primária ou pelo primeiro índice exclusivo, se houver. Isso é útil ao excluir uma tabela `MyISAM` para ser carregada em uma tabela `InnoDB`, mas faz com que a operação de exclusão demore muito mais tempo.

- `--shared-memory-base-name=name`

  <table summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>08

  Em Windows, o nome de memória compartilhada a ser usado para conexões feitas usando memória compartilhada para um servidor local. O valor padrão é \[\[`MYSQL`]. O nome de memória compartilhada é sensível a maiúsculas e minúsculas.

  Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `shared_memory` habilitada para suportar conexões de memória compartilhada.

- `--single-transaction`

  <table summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>09

  Essa opção define o modo de isolamento de transação para `REPEATABLE READ` e envia uma instrução SQL `START TRANSACTION` para o servidor antes de drenar os dados. Ela é útil apenas com tabelas transacionais, como `InnoDB`, porque, nesse caso, ela drenará o estado consistente do banco de dados no momento em que `START TRANSACTION` foi emitido, sem bloquear nenhuma aplicação.

  O privilégio `RELOAD` ou `FLUSH_TABLES` é necessário com `--single-transaction` se ambos `gtid_mode=ON` e `gtid_purged=ON|AUTO`. Esse requisito foi adicionado no MySQL 8.0.32.

  Ao usar essa opção, você deve ter em mente que apenas as tabelas `InnoDB` são descarregadas em um estado consistente. Por exemplo, quaisquer tabelas `MyISAM` ou `MEMORY` descarregadas enquanto estiver usando essa opção ainda podem mudar de estado.

  Enquanto um dump `--single-transaction` estiver em processo, para garantir um arquivo de dump válido (conteúdo correto da tabela e coordenadas do log binário), nenhuma outra conexão deve usar as seguintes instruções: `ALTER TABLE`, `CREATE TABLE`, `DROP TABLE`, `RENAME TABLE`, `TRUNCATE TABLE`. Uma leitura consistente não é isolada dessas instruções, portanto, o uso delas em uma tabela a ser dumpada pode causar o `SELECT` que é realizado pelo **mysqldump** para recuperar o conteúdo da tabela a obter conteúdos incorretos ou falhar.

  A opção `--single-transaction` e a opção `--lock-tables` são mutuamente exclusivas, pois `LOCK TABLES` faz com que todas as transações pendentes sejam comprometidas implicitamente.

  Antes da versão 8.0.32: Não era recomendado usar `--single-transaction` junto com a opção `--set-gtid-purged`, pois isso poderia causar inconsistências na saída do **mysqldump**.

  Para descartar tabelas grandes, combine a opção `--single-transaction` com a opção `--quick`.

#### Grupos de Opções

- A opção `--opt` ativa várias configurações que trabalham juntas para realizar uma operação de dump rápida. Todas essas configurações estão ativadas por padrão, porque `--opt` está ativada por padrão. Assim, você raramente, ou nunca, especifica `--opt`. Em vez disso, você pode desativar essas configurações como um grupo, especificando `--skip-opt`, e, opcionalmente, reativar certas configurações especificando as opções associadas mais tarde na linha de comando.

- A opção `--compact` desativa várias configurações que controlam se as declarações e comentários opcionais aparecem na saída. Novamente, você pode seguir essa opção com outras opções que reativam certas configurações, ou ativar todas as configurações usando o formulário `--skip-compact`.

Quando você habilita ou desabilita seletivamente o efeito de uma opção de grupo, a ordem é importante, pois as opções são processadas da primeira à última. Por exemplo, `--disable-keys` `--lock-tables` `--skip-opt` não teria o efeito desejado; é o mesmo que `--skip-opt` por si só.

#### Exemplos

Para fazer um backup de um banco de dados inteiro:

```
mysqldump db_name > backup-file.sql
```

Para carregar o arquivo de depuração de volta no servidor:

```
mysql db_name < backup-file.sql
```

Outra maneira de recarregar o arquivo de dump:

```
mysql -e "source /path-to-backup/backup-file.sql" db_name
```

O **mysqldump** também é muito útil para preencher bancos de dados copiando dados de um servidor MySQL para outro:

```
mysqldump --opt db_name | mysql --host=remote_host -C db_name
```

Você pode descartar várias bases de dados com um comando:

```
mysqldump --databases db_name1 [db_name2 ...] > my_databases.sql
```

Para descartar todas as bases de dados, use a opção `--all-databases`:

```
mysqldump --all-databases > all_databases.sql
```

Para as tabelas `InnoDB`, o **mysqldump** oferece uma maneira de fazer um backup online:

```
mysqldump --all-databases --master-data --single-transaction > all_databases.sql
```

Ou, no MySQL 8.0.26 e versões posteriores:

```
mysqldump --all-databases --source-data --single-transaction > all_databases.sql
```

Este backup adquire um bloqueio de leitura global em todas as tabelas (usando `FLUSH TABLES WITH READ LOCK`) no início do dump. Assim que esse bloqueio é adquirido, os endereços do log binário são lidos e o bloqueio é liberado. Se declarações de atualização longas estiverem em execução quando a declaração `FLUSH` for emitida, o servidor MySQL pode ficar parado até que essas declarações terminem. Após isso, o dump se torna livre de bloqueios e não interfere em leituras e escritas nas tabelas. Se as declarações de atualização que o servidor MySQL recebe forem curtas (em termos de tempo de execução), o período inicial de bloqueio não deve ser perceptível, mesmo com muitas atualizações.

Para a recuperação em um ponto específico no tempo (também conhecida como “regra de avanço”, quando você precisa restaurar um backup antigo e refazer as alterações que ocorreram desde esse backup), muitas vezes é útil rotular o log binário (veja a Seção 7.4.4, “O Log Binário”) ou, pelo menos, conhecer as coordenadas do log binário às quais o dump corresponde:

```
mysqldump --all-databases --master-data=2 > all_databases.sql
```

Ou, no MySQL 8.0.26 e versões posteriores:

```
mysqldump --all-databases --source-data=2 > all_databases.sql
```

Ou:

```
mysqldump --all-databases --flush-logs --master-data=2 > all_databases.sql
```

Ou, no MySQL 8.0.26 e versões posteriores:

```
mysqldump --all-databases --flush-logs --source-data=2 > all_databases.sql
```

A opção `--source-data` ou `--master-data` pode ser usada simultaneamente com a opção `--single-transaction`, que oferece uma maneira conveniente de fazer um backup online adequado para uso antes da recuperação em um ponto específico, se as tabelas forem armazenadas usando o mecanismo de armazenamento `InnoDB`.

Para obter mais informações sobre como fazer backups, consulte a Seção 9.2, “Métodos de Backup de Banco de Dados”, e a Seção 9.3, “Estratégia de Backup e Recuperação Exemplo”.

- Para selecionar o efeito de `--opt` exceto por algumas funcionalidades, use a opção `--skip` para cada funcionalidade. Para desativar os insertos estendidos e o buffer de memória, use `--opt` `--skip-extended-insert` `--skip-quick`. (Na verdade, `--skip-extended-insert` `--skip-quick` é suficiente porque `--opt` está ativado por padrão.)

- Para reverter `--opt` para todas as funcionalidades, exceto a desativação de índices e o bloqueio de tabelas, use `--skip-opt` `--disable-keys` `--lock-tables`.

#### Restrições

O **mysqldump** não realiza o dump do esquema `performance_schema` ou `sys` por padrão. Para realizar o dump de qualquer um deles, nomeie-os explicitamente na linha de comando. Você também pode nomeá-los com a opção `--databases`. Para `performance_schema`, também use a opção `--skip-lock-tables`.

O **mysqldump** não realiza o dump do esquema `INFORMATION_SCHEMA`.

O **mysqldump** não dumperá as instruções `InnoDB` `CREATE TABLESPACE`.

O **mysqldump** não dumperá o banco de dados de informações do NDB Cluster `ndbinfo`.

O **mysqldump** inclui instruções para recriar as tabelas `general_log` e `slow_query_log` para os backups do banco de dados `mysql`. O conteúdo da tabela de log não é copiado.

Se você encontrar problemas ao fazer backup de visualizações devido a privilégios insuficientes, consulte a Seção 27.9, “Restrições em visualizações”, para uma solução alternativa.
