### 6.5.4 mysqldump  Um programa de backup de banco de dados

O utilitário do cliente `mysqldump` executa backups lógicos, produzindo um conjunto de instruções SQL que podem ser executadas para reproduzir as definições originais de objetos de banco de dados e dados de tabela. Ele despeja um ou mais bancos de dados MySQL para backup ou transferência para outro servidor SQL. O comando `mysqldump` também pode gerar saída em CSV, outro texto delimitado ou formato XML.

Dicas

Considere usar os utilitários de despejo MySQL Shell, que fornecem despejo paralelo com vários threads, compressão de arquivos e exibição de informações de progresso, bem como recursos de nuvem, como o Oracle Cloud Infrastructure Object Storage streaming e verificações e modificações de compatibilidade MySQL HeatWave. Os despejos podem ser facilmente importados em uma instância do MySQL Server ou em um MySQL HeatWave DB System usando os utilitários de despejo de carga MySQL Shell.

- Considerações de desempenho e escalabilidade
- Síntese de invocação
- Síntese das opções - Resumo alfabético
- Opções de ligação
- Opções de arquivo de opções
- Opções de DDL
- Opções de depuração
- Opções de Ajuda
- Opções de internacionalização
- Opções de replicação
- Opções de formato
- Opções de filtragem
- Opções de desempenho
- Opções de transação
- Grupos de opções
- Exemplos
- Restrições

`mysqldump` requer pelo menos o privilégio `SELECT` para tabelas despejadas, `SHOW VIEW` para vistas despejadas, `TRIGGER` para gatilhos despejados, `LOCK TABLES` se a opção `--single-transaction` não for usada, `PROCESS` se a opção `--no-tablespaces` não for usada, e o privilégio `RELOAD` ou `FLUSH_TABLES` com `--single-transaction` se ambos `gtid_mode=ON` e `gtid_purged=ON|AUTO` Certas opções podem exigir outros privilégios, conforme observado nas descrições das opções.

Para recarregar um arquivo de despejo, você deve ter os privilégios necessários para executar as instruções que ele contém, como os privilégios `CREATE` apropriados para objetos criados por essas instruções.

`mysqldump` a saída pode incluir `ALTER DATABASE` instruções que mudam a coleta de banco de dados. Estes podem ser usados quando o despejo de programas armazenados para preservar suas codificações de caracteres. Para recarregar um arquivo de despejo contendo tais instruções, o privilégio `ALTER` para o banco de dados afetado é necessário.

::: info Note

Um dump feito usando o PowerShell no Windows com redirecionamento de saída cria um arquivo com codificação UTF-16:

```
mysqldump [options] > dump.sql
```

No entanto, o UTF-16 não é permitido como um conjunto de caracteres de conexão (ver Imprevisível Conjuntos de Caracteres de Cliente), de modo que o arquivo de descarga não pode ser carregado corretamente. Para resolver este problema, use a opção `--result-file`, que cria a saída no formato ASCII:

```
mysqldump [options] --result-file=dump.sql
```

:::

Não é recomendado carregar um arquivo de despejo quando os GTIDs estão habilitados no servidor (`gtid_mode=ON`), se o seu arquivo de despejo incluir tabelas do sistema. `mysqldump` emite instruções DML para as tabelas do sistema que usam o mecanismo de armazenamento MyISAM não transacional, e essa combinação não é permitida quando os GTIDs estão habilitados.

#### Considerações de desempenho e escalabilidade

As vantagens do `mysqldump` incluem a conveniência e flexibilidade de visualizar ou até mesmo editar a saída antes da restauração. Você pode clonar bancos de dados para desenvolvimento e trabalho de DBA, ou produzir pequenas variações de um banco de dados existente para testes. Ele não é destinado como uma solução rápida ou escalável para fazer backup de quantidades substanciais de dados. Com grandes tamanhos de dados, mesmo que a etapa de backup leve um tempo razoável, restaurar os dados pode ser muito lento porque reproduzir as instruções SQL envolve I/O em disco para inserção, criação de índice e assim por diante.

Para backup e restauração em larga escala, um backup físico é mais apropriado, para copiar os arquivos de dados em seu formato original para que possam ser restaurados rapidamente.

Se suas tabelas forem principalmente tabelas `InnoDB` ou se você tiver uma mistura de tabelas `InnoDB` e `MyISAM`, considere usar **mysqlbackup**, que está disponível como parte do MySQL Enterprise. Esta ferramenta fornece alto desempenho para backups `InnoDB` com interrupção mínima; também pode fazer backup de tabelas de `MyISAM` e outros mecanismos de armazenamento; também fornece uma série de opções convenientes para acomodar diferentes cenários de backup.

`mysqldump` pode recuperar e despejar conteúdos de tabela linha por linha, ou pode recuperar todo o conteúdo de uma tabela e armazená-lo na memória antes de despejá-lo. O buffer na memória pode ser um problema se você estiver despejando tabelas grandes. Para despejar tabelas linha por linha, use a opção `--quick` (ou `--opt`, que habilita `--quick`). A opção `--opt` (e, portanto, `--quick`) está habilitada por padrão, então para habilitar o buffer de memória, use `--skip-quick`.

Se você estiver usando uma versão recente do `mysqldump` para gerar um dump para ser recarregado em um servidor MySQL muito antigo, use a opção `--skip-opt` em vez da opção `--opt` ou `--extended-insert`.

Para informações adicionais sobre `mysqldump`, consulte a Secção 9.4, "Utilizando mysqldump para Backups".

#### Síntese de invocação

Existem em geral três maneiras de usar `mysqldump` para despejar um conjunto de uma ou mais tabelas, um conjunto de uma ou mais bases de dados completas ou um servidor MySQL inteiro, como mostrado aqui:

```
mysqldump [options] db_name [tbl_name ...]
mysqldump [options] --databases db_name ...
mysqldump [options] --all-databases
```

Para despejar bancos de dados inteiros, não nomeie nenhuma tabela após \* `db_name` \*, ou use a opção `--databases` ou `--all-databases`.

Para ver uma lista das opções que sua versão do `mysqldump` suporta, emita o comando `mysqldump` `--help`.

#### Síntese das opções - Resumo alfabético

`mysqldump` suporta as seguintes opções, que podem ser especificadas na linha de comando ou nos grupos `[mysqldump]` e `[client]` de um arquivo de opções.

**Tabela 6.13 Opções de despejo de mysqldump**

<table><col style="width: 35%"/><col style="width: 64%"/><thead><tr><th>Nome da opção</th> <th>Descrição</th> </tr></thead><tbody><tr><td>- Base de dados de adição-drop</td> <td>Adicionar instrução DROP DATABASE antes de cada instrução CREATE DATABASE</td> </tr><tr><td>-- adicionar-deixar-deixar tabela</td> <td>Adicionar instrução DROP TABLE antes de cada instrução CREATE TABLE</td> </tr><tr><td>- Add-drop-trigger</td> <td>Adicionar instrução DROP TRIGGER antes de cada instrução CREATE TRIGGER</td> </tr><tr><td>- Add-locks</td> <td>Rodear cada despejo de tabela com LOCK TABLES e UNLOCK TABLES declarações</td> </tr><tr><td>--todas as bases de dados</td> <td>Descarregar todas as tabelas em todas as bases de dados</td> </tr><tr><td>--permitir palavras-chave</td> <td>Permitir criação de nomes de colunas que sejam palavras-chave</td> </tr><tr><td>- Aplicar declarações de réplica</td> <td>Inclua STOP REPLICA antes de CHANGE REPLICATION SOURCE TO declaração e START REPLICA no final da saída</td> </tr><tr><td>--aplicar-escravo-declarações</td> <td>Incluir STOP SLAVE antes da instrução CHANGE MASTER e START SLAVE no final da saída</td> </tr><tr><td>- Endereço de ligação</td> <td>Usar interface de rede especificada para se conectar ao MySQL Server</td> </tr><tr><td>--conjuntos de caracteres-dir</td> <td>Diretório onde são instalados conjuntos de caracteres</td> </tr><tr><td>--coluna-estadísticas</td> <td>Escrever declarações ANALYZE TABLE para gerar histogramas de estatísticas</td> </tr><tr><td>--comentários</td> <td>Adicionar comentários ao arquivo de descarga</td> </tr><tr><td>- Compacto.</td> <td>Produzir uma saída mais compacta</td> </tr><tr><td>--compatível</td> <td>Produzir saída que é mais compatível com outros sistemas de banco de dados ou com servidores MySQL mais antigos</td> </tr><tr><td>- Completar-inserir</td> <td>Usar instruções INSERT completas que incluam nomes de colunas</td> </tr><tr><td>--comprimir</td> <td>Comprimir todas as informações enviadas entre o cliente e o servidor</td> </tr><tr><td>Algoritmos de compressão</td> <td>Algoritmos de compressão permitidos para ligações ao servidor</td> </tr><tr><td>--create-opções</td> <td>Incluir todas as opções de tabela específicas do MySQL nas instruções CREATE TABLE</td> </tr><tr><td>--bases de dados</td> <td>Interpretar todos os argumentos de nome como nomes de base de dados</td> </tr><tr><td>--debug</td> <td>Registro de depuração</td> </tr><tr><td>--debug-check</td> <td>Imprimir informações de depuração quando o programa sair</td> </tr><tr><td>--debug-info</td> <td>Imprimir informações de depuração, memória e estatísticas da CPU quando o programa sai</td> </tr><tr><td>--default-auth</td> <td>Plugin de autenticação a usar</td> </tr><tr><td>--default-character-set</td> <td>Especificar o conjunto de caracteres padrão</td> </tr><tr><td>--defaults-extra-file</td> <td>Leia arquivo de opção nomeado além dos arquivos de opção habituais</td> </tr><tr><td>--defaults-file</td> <td>Arquivo de opções nomeadas somente para leitura</td> </tr><tr><td>--defaults-group-suffix</td> <td>Valor do sufixo do grupo de opções</td> </tr><tr><td>--delete-master-logs</td> <td>Em um servidor de origem de replicação, apagar os registros binários após a execução da operação de despejo</td> </tr><tr><td>--delete-source-logs</td> <td>Em um servidor de origem de replicação, apagar os registros binários após a execução da operação de despejo</td> </tr><tr><td>- Desativar-chaves</td> <td>Para cada tabela, rodear INSERT declarações com declarações para desativar e habilitar chaves</td> </tr><tr><td>-- data de descarga</td> <td>Incluir a data de descarga como comentário "Depósito concluído em" se --comentários for dado</td> </tr><tr><td>- Replica de descarte</td> <td>Incluir CHANGE REPLICATION SOURCE à instrução que lista as coordenadas de log binário da fonte da réplica</td> </tr><tr><td>- Escravo de descarte.</td> <td>Incluir instrução CHANGE MASTER que lista as coordenadas de log binário da fonte da réplica</td> </tr><tr><td>- Plug-in de texto claro</td> <td>Ativar o plug-in de autenticação de texto claro</td> </tr><tr><td>--eventos</td> <td>Eventos de despejo de bases de dados despejadas</td> </tr><tr><td>- ... extended-insert</td> <td>Utilizar a sintaxe INSERT de linhas múltiplas</td> </tr><tr><td>--campo-fechado-por</td> <td>Esta opção é usada com a opção --tab e tem o mesmo significado que a cláusula correspondente para LOAD DATA</td> </tr><tr><td>- ... campos-escapados-por</td> <td>Esta opção é usada com a opção --tab e tem o mesmo significado que a cláusula correspondente para LOAD DATA</td> </tr><tr><td>--fields-optionally-enclosed-by</td> <td>Esta opção é usada com a opção --tab e tem o mesmo significado que a cláusula correspondente para LOAD DATA</td> </tr><tr><td>-- campos-terminados-por</td> <td>Esta opção é usada com a opção --tab e tem o mesmo significado que a cláusula correspondente para LOAD DATA</td> </tr><tr><td>--flush-logs</td> <td>Limpe os ficheiros de registo do servidor MySQL antes de iniciar o dump</td> </tr><tr><td>Privilégios de descarga</td> <td>Emitir uma declaração FLUSH PRIVILEGES após o despejo da base de dados mysql</td> </tr><tr><td>- Força</td> <td>Continuar mesmo que ocorra um erro SQL durante um despejo de tabela</td> </tr><tr><td>--get-server-public-key</td> <td>Solicitar a chave pública RSA do servidor</td> </tr><tr><td>- Ajuda .</td> <td>Mostrar mensagem de ajuda e sair</td> </tr><tr><td>- Hex-blob</td> <td>Dump colunas binárias usando notação hexadecimal</td> </tr><tr><td>- Hospedeiro</td> <td>Host em que o servidor MySQL está localizado</td> </tr><tr><td>- Ignorar erro</td> <td>Ignorar erros especificados</td> </tr><tr><td>- ... ignorar a tabela.</td> <td>Não descarregue a tabela dada</td> </tr><tr><td>- ignorar-visões</td> <td>Esqueça a tabela de dumping</td> </tr><tr><td>--include-master-host-port</td> <td>Incluir opções MASTER_HOST/MASTER_PORT na instrução CHANGE MASTER produzida com --dump-slave</td> </tr><tr><td>--include-source-host-port</td> <td>Incluir as opções SOURCE_HOST e SOURCE_PORT na instrução CHANGE REPLICATION SOURCE TO produzida com --dump-replica</td> </tr><tr><td>--init-comando</td> <td>Instrução SQL única para ser executada após conectar ou reconectar-se ao servidor MySQL; redefine comandos definidos existentes</td> </tr><tr><td>--init-command-add</td> <td>Adicionar uma instrução SQL adicional para executar após conectar ou reconectar ao servidor MySQL</td> </tr><tr><td>--inserir-ignorar</td> <td>Escrever INSERT IGNORE em vez de INSERT instruções</td> </tr><tr><td>--linhas-terminadas-por</td> <td>Esta opção é usada com a opção --tab e tem o mesmo significado que a cláusula correspondente para LOAD DATA</td> </tr><tr><td>- Tranca todas as mesas.</td> <td>Bloquear todas as tabelas em todas as bases de dados</td> </tr><tr><td>- Mesas de fechamento</td> <td>Tranque todas as mesas antes de as deitar fora .</td> </tr><tr><td>--log-error</td> <td>Anexar avisos e erros ao arquivo nomeado</td> </tr><tr><td>--login-path</td> <td>Leia as opções de caminho de login em .mylogin.cnf</td> </tr><tr><td>--dados-mestre</td> <td>Escrever o nome do arquivo de registo binário e posição para a saída</td> </tr><tr><td>- Pacote máximo permitido</td> <td>Comprimento máximo do pacote a enviar ou receber do servidor</td> </tr><tr><td>--mysqld-long-query-time</td> <td>Valor da sessão para o limiar de consulta lenta</td> </tr><tr><td>- comprimento de tampão líquido</td> <td>Tamanho do buffer para comunicação TCP/IP e soquete</td> </tr><tr><td>- Tempo limite de rede.</td> <td>Aumentar o tempo de espera da rede para permitir despejos de tabelas maiores</td> </tr><tr><td>- Sem compromisso automático.</td> <td>Incluir as instruções INSERT para cada tabela de dumping dentro SET autocommit = 0 e COMMIT instruções</td> </tr><tr><td>--não-criar-db</td> <td>Não escreva instruções CREATE DATABASE</td> </tr><tr><td>--não-criar-informação</td> <td>Não escreva instruções CREATE TABLE que recriam cada tabela despejada</td> </tr><tr><td>--sem dados</td> <td>Não descarregue o conteúdo da tabela</td> </tr><tr><td>- Não há padrões</td> <td>Não ler arquivos de opções</td> </tr><tr><td>--não-login-caminhos</td> <td>Não ler os caminhos de login no arquivo de caminho de login</td> </tr><tr><td>--não-configurado-nomes</td> <td>O mesmo que --skip-set-charset</td> </tr><tr><td>--não-espaços de tabela</td> <td>Não escreva nenhuma instrução CREATE LOGFILE GROUP ou CREATE TABLESPACE na saída</td> </tr><tr><td>--optar</td> <td>Esquema para --add-drop-table --add-locks --create-options --disable-keys --extended-insert --lock-tables --quick --set-charset</td> </tr><tr><td>--ordem-por-primário</td> <td>Dump cada tabela de linhas ordenadas por sua chave primária, ou por seu primeiro índice único</td> </tr><tr><td>--output-as-version</td> <td>Determina a terminologia de réplica e evento usada em depósitos; para compatibilidade com versões mais antigas</td> </tr><tr><td>--senha</td> <td>Senha para usar quando se conectar ao servidor</td> </tr><tr><td>- Senha 1</td> <td>Primeira senha de autenticação multifator a usar ao se conectar ao servidor</td> </tr><tr><td>- Senha 2</td> <td>Segunda senha de autenticação multifator a usar ao se conectar ao servidor</td> </tr><tr><td>- Senha 3</td> <td>Terceira senha de autenticação multifator a utilizar quando se conectar ao servidor</td> </tr><tr><td>- Tubo.</td> <td>Conectar-se ao servidor usando o nome do tubo (somente Windows)</td> </tr><tr><td>--plugin-authentication-kerberos-client-mode</td> <td>Permitir autenticação plugável GSSAPI através da biblioteca Kerberos do MIT no Windows</td> </tr><tr><td>--plugin-dir</td> <td>Diretório onde os plugins estão instalados</td> </tr><tr><td>- Porto</td> <td>Número de porta TCP/IP para conexão</td> </tr><tr><td>- Impressão padrão</td> <td>Opções padrão de impressão</td> </tr><tr><td>- Protocolo</td> <td>Protocolo de transporte a utilizar</td> </tr><tr><td>- Rápido.</td> <td>Obter linhas para uma tabela do servidor uma linha de cada vez</td> </tr><tr><td>- Nomes de citação.</td> <td>Identificadores de citação dentro de caracteres retrógrados</td> </tr><tr><td>- Substituir</td> <td>Escrever instruções REPLACE em vez de instruções INSERT</td> </tr><tr><td>--resultado-arquivo</td> <td>Saída direta para um arquivo dado</td> </tr><tr><td>- rotinas</td> <td>Dump de rotinas armazenadas (procedimentos e funções) a partir de bases de dados dumpadas</td> </tr><tr><td>--server-chave pública-caminho</td> <td>Nome do caminho para o ficheiro que contém a chave pública RSA</td> </tr><tr><td>--set-charset</td> <td>Adicionar SET NAMES default_character_set à saída</td> </tr><tr><td>- ... set-gtid-purged</td> <td>Se adicionar SET @@GLOBAL.GTID_PURGED à saída</td> </tr><tr><td>--shared-memory-base-name</td> <td>Nome de memória partilhada para conexões de memória partilhada (somente Windows)</td> </tr><tr><td>- Mostrar - Criar - Esquecer - Motor secundário</td> <td>Excluir a cláusula SECONDARY ENGINE das instruções CREATE TABLE</td> </tr><tr><td>- transacção única</td> <td>Emitir uma instrução BEGIN SQL antes de descarregar dados do servidor</td> </tr><tr><td>--skip-add-drop-table</td> <td>Não adicione uma instrução DROP TABLE antes de cada instrução CREATE TABLE</td> </tr><tr><td>- "Skip-add-locks" (falta de adição de bloqueios)</td> <td>Não adicione fechaduras</td> </tr><tr><td>--comentários de omissão</td> <td>Não adicionar comentários ao arquivo de descarga</td> </tr><tr><td>- Esqueça-compacto.</td> <td>Não produza mais saída compacta</td> </tr><tr><td>- teclas de desactivação</td> <td>Não desativar as chaves</td> </tr><tr><td>--skip-extended-insert</td> <td>Desligue a inserção alargada</td> </tr><tr><td>--skip-generated-invisible-primary-key</td> <td>Não incluir as chaves primárias invisíveis geradas no arquivo de descarga</td> </tr><tr><td>- Esquecer-se</td> <td>Desativar as opções definidas por --opt</td> </tr><tr><td>- Desligue-se depressa.</td> <td>Não recuperar linhas para uma tabela do servidor uma linha de cada vez</td> </tr><tr><td>- Nomes de citações</td> <td>Não citar identificadores</td> </tr><tr><td>- Esquecer-configurar-charset</td> <td>Não escreva a instrução SET NAMES</td> </tr><tr><td>- Desligadores</td> <td>Não descarte gatilhos.</td> </tr><tr><td>- Esqueça-o.</td> <td>Desligue o tz-utc .</td> </tr><tr><td>- Soquete</td> <td>Arquivo de soquete do Unix ou tubo nomeado do Windows para usar</td> </tr><tr><td>--dados-fonte</td> <td>Escrever o nome do arquivo de registo binário e posição para a saída</td> </tr><tr><td>- O quê?</td> <td>Arquivo que contém lista de autoridades de certificação SSL confiáveis</td> </tr><tr><td>--ssl-capath</td> <td>Diretório que contém ficheiros de certificados SSL confiáveis</td> </tr><tr><td>--ssl-cert</td> <td>Arquivo que contém o certificado X.509</td> </tr><tr><td>--SSL-cifrado</td> <td>Códigos permitidos para a encriptação da ligação</td> </tr><tr><td>--ssl-crl</td> <td>Arquivo que contém listas de revogação de certificados</td> </tr><tr><td>--ssl-crlpath</td> <td>Diretório que contém ficheiros de lista de revogação de certificado</td> </tr><tr><td>--ssl-fips-modo</td> <td>Ativar o modo FIPS do lado do cliente</td> </tr><tr><td>--ssl-chave</td> <td>Arquivo que contém a chave X.509</td> </tr><tr><td>- Modo SSL</td> <td>Estado de segurança desejado da ligação ao servidor</td> </tr><tr><td>--ssl-data-de-sessão</td> <td>Arquivo que contém dados de sessão SSL</td> </tr><tr><td>--ssl-session-data-continue-on-failed-reuse</td> <td>Estabelecer conexões se a reutilização da sessão falhar</td> </tr><tr><td>- ... tabela</td> <td>Produzir arquivos de dados separados por tabulação</td> </tr><tr><td>-- tabelas</td> <td>Anular --bases de dados ou opção -B</td> </tr><tr><td>--tls-ciphersuites</td> <td>Suítes de encriptação TLSv1.3 permitidas para conexões criptografadas</td> </tr><tr><td>--tls-sni-nome do servidor</td> <td>Nome do servidor fornecido pelo cliente</td> </tr><tr><td>- Versão TLS</td> <td>Protocolos TLS admissíveis para ligações encriptadas</td> </tr><tr><td>- gatilhos.</td> <td>Ativadores de descarga para cada tabela descarregada</td> </tr><tr><td>--tz-utc</td> <td>Adicionar SET TIME_ZONE='+00:00' ao arquivo de descarregamento</td> </tr><tr><td>-- utilizador</td> <td>Nome do usuário do MySQL para usar quando se conectar ao servidor</td> </tr><tr><td>- Verbosos.</td> <td>Modo Verbose</td> </tr><tr><td>- versão</td> <td>Informações de versão de exibição e saída</td> </tr><tr><td>- Onde?</td> <td>Descarregar apenas as linhas selecionadas pela condição WHERE dada</td> </tr><tr><td>--xml</td> <td>Produzir saída XML</td> </tr><tr><td>--zstd-nível de compressão</td> <td>Nível de compressão para conexões com servidor que usam compressão zstd</td> </tr></tbody></table>

#### Opções de ligação

O comando `mysqldump` inicia sessão em um servidor MySQL para extrair informações. As opções a seguir especificam como se conectar ao servidor MySQL, na mesma máquina ou em um sistema remoto.

- `--bind-address=ip_address`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>

Em um computador com várias interfaces de rede, use esta opção para selecionar qual interface usar para se conectar ao servidor MySQL.

- `--compress`, `-C`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--compress[={OFF|ON}]</code>]]</td> </tr><tr><th>Depreciado</th> <td>Sim , sim .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

Se possível, comprimir todas as informações enviadas entre o cliente e o servidor.

Esta opção está desatualizada. Espera-se que seja removida em uma versão futura do MySQL. Veja Configurar a Compressão de Conexão Legada.

- `--compression-algorithms=value`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--compression-algorithms=value</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Conjunto</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>uncompressed</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>zlib</code>]]</p><p class="valid-value">[[<code>zstd</code>]]</p><p class="valid-value">[[<code>uncompressed</code>]]</p></td> </tr></tbody></table>

Os algoritmos de compressão permitidos para conexões com o servidor. Os algoritmos disponíveis são os mesmos que para a variável do sistema `protocol_compression_algorithms`. O valor padrão é `uncompressed`.

Para mais informações, ver ponto 6.2.8, "Controlo da compressão da ligação".

- `--default-auth=plugin`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--default-auth=plugin</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

Uma dica sobre qual plugin de autenticação do lado do cliente usar.

- `--enable-cleartext-plugin`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--enable-cleartext-plugin</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>

Ativar o plug-in de autenticação de texto transparente `mysql_clear_password` (ver Seção 8.4.1.4, Client-Side Cleartext Pluggable Authentication.)

- `--get-server-public-key`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--get-server-public-key</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr></tbody></table>

Solicitar do servidor a chave pública necessária para a troca de senhas baseada em pares de chaves RSA. Esta opção se aplica a clientes que se autenticam com o plugin de autenticação `caching_sha2_password`. Para esse plugin, o servidor não envia a chave pública a menos que seja solicitado. Esta opção é ignorada para contas que não se autenticam com esse plugin. Também é ignorada se a troca de senhas baseada em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

Se `--server-public-key-path=file_name` é dado e especifica um arquivo de chave pública válido, ele tem precedência sobre `--get-server-public-key`.

Para obter informações sobre o plug-in `caching_sha2_password`, consulte a Seção 8.4.1.2, Caching SHA-2 Pluggable Authentication.

- `--host=host_name`, `-h host_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--host</code>]]</td> </tr></tbody></table>

Dump dados do servidor MySQL no host dado. O host padrão é `localhost`.

- `--login-path=name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--login-path=name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

Leia opções do caminho de login nomeado no arquivo de caminho de login. Um caminho de login é um grupo de opções que contém opções que especificam a qual servidor MySQL se conectar e qual conta autenticar. Para criar ou modificar um arquivo de caminho de login, use o utilitário **mysql\_config\_editor**. Veja Seção 6.6.7, mysql\_config\_editor  MySQL Configuration Utility.

Para obter informações adicionais sobre esta e outras opções de ficheiro de opções, consulte a secção 6.2.2.3, "Opções de linha de comando que afectam a manipulação de ficheiro de opções".

- `--no-login-paths`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--no-login-paths</code>]]</td> </tr></tbody></table>

Salta opções de leitura do arquivo de caminho de login.

Ver `--login-path` para informações relacionadas.

Para obter informações adicionais sobre esta e outras opções de ficheiro de opções, consulte a secção 6.2.2.3, "Opções de linha de comando que afectam a manipulação de ficheiro de opções".

- `--password[=password]`, `-p[password]`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--password[=password]</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

A senha da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecido, `mysqldump` solicita um. Se for fornecido, deve haver \* nenhum espaço \* entre `--password=` ou `-p` e a senha seguinte. Se nenhuma opção de senha for especificada, o padrão é não enviar senha.

A especificação de uma senha na linha de comando deve ser considerada insegura. Para evitar a indicação da senha na linha de comando, use um arquivo de opções. Veja a Seção 8.1.2.1, "Diretrizes do Usuário Final para a Segurança de Senhas".

Para especificar explicitamente que não há senha e que `mysqldump` não deve solicitar uma, use a opção `--skip-password`.

- `--password1[=pass_val]`

A senha para o fator de autenticação multifator 1 da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecido, `mysqldump` solicita um. Se for fornecido, deve haver \* nenhum espaço \* entre `--password1=` e a senha que o segue. Se nenhuma opção de senha for especificada, o padrão é não enviar senha.

A especificação de uma senha na linha de comando deve ser considerada insegura. Para evitar a indicação da senha na linha de comando, use um arquivo de opções. Veja a Seção 8.1.2.1, "Diretrizes do Usuário Final para a Segurança de Senhas".

Para especificar explicitamente que não há senha e que `mysqldump` não deve solicitar uma, use a opção `--skip-password1`.

`--password1` e `--password` são sinônimos, assim como `--skip-password1` e `--skip-password`.

- `--password2[=pass_val]`

A senha para o fator de autenticação multifator 2 da conta MySQL usada para se conectar ao servidor. A semântica desta opção é semelhante à semântica de `--password1`; veja a descrição dessa opção para detalhes.

- `--password3[=pass_val]`

A senha para o fator de autenticação multifator 3 da conta MySQL usada para se conectar ao servidor. A semântica desta opção é semelhante à semântica para `--password1`; veja a descrição dessa opção para detalhes.

- `--pipe`, `-W`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--pipe</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

No Windows, conecte-se ao servidor usando um tubo nomeado. Esta opção se aplica apenas se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões de tubo nomeado. Além disso, o usuário que faz a conexão deve ser um membro do grupo Windows especificado pela variável de sistema `named_pipe_full_access_group`.

- `--plugin-authentication-kerberos-client-mode=value`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--plugin-authentication-kerberos-client-mode</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>SSPI</code>]]</td> </tr><tr><th>Valores válidos</th> <td>[[<code>GSSAPI</code>]]</td> </tr></tbody></table>

No Windows, o plug-in de autenticação `authentication_kerberos_client` suporta esta opção de plug-in. Ele fornece dois valores possíveis que o usuário do cliente pode definir no tempo de execução: `SSPI` e `GSSAPI`.

O valor padrão para a opção do plugin do lado do cliente usa a Security Support Provider Interface (SSPI), que é capaz de adquirir credenciais do cache da memória interna do Windows. Alternativamente, o usuário do cliente pode selecionar um modo que suporte a Generic Security Service Application Program Interface (GSSAPI) através da biblioteca MIT Kerberos no Windows. GSSAPI é capaz de adquirir credenciais em cache geradas anteriormente usando o comando **kinit**.

Para mais informações, consulte Comando para Clientes do Windows no Modo GSSAPI.

- `--plugin-dir=dir_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--plugin-dir=dir_name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Nome do diretório</td> </tr></tbody></table>

O diretório no qual procurar plugins. Especifique esta opção se a opção `--default-auth` for usada para especificar um plugin de autenticação, mas `mysqldump` não o encontrar. Veja Seção 8.2.17, Autenticação Pluggable.

- `--port=port_num`, `-P port_num`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--port=port_num</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>3306</code>]]</td> </tr></tbody></table>

Para as ligações TCP/IP, o número de porta a utilizar.

- `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--protocol=type</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>[see tex<code>TCP</code></code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>TCP</code>]]</p><p class="valid-value">[[<code>SOCKET</code>]]</p><p class="valid-value">[[<code>PIPE</code>]]</p><p class="valid-value">[[<code>MEMORY</code>]]</p></td> </tr></tbody></table>

O protocolo de transporte a utilizar para se conectar ao servidor. É útil quando os outros parâmetros de conexão normalmente resultam na utilização de um protocolo diferente daquele desejado.

- `--server-public-key-path=file_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--server-public-key-path=file_name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Nome do ficheiro</td> </tr></tbody></table>

O nome do caminho para um arquivo no formato PEM contendo uma cópia do lado do cliente da chave pública exigida pelo servidor para troca de senhas baseada em pares de chaves RSA. Esta opção se aplica a clientes que se autenticam com o plug-in de autenticação `sha256_password` (obsoleto) ou `caching_sha2_password`. Esta opção é ignorada para contas que não se autenticam com um desses plug-ins. Também é ignorada se a troca de senhas baseada em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

Se `--server-public-key-path=file_name` é dado e especifica um arquivo de chave pública válido, ele tem precedência sobre `--get-server-public-key`.

Para `sha256_password` (deprecated), esta opção aplica-se apenas se o MySQL foi construído usando OpenSSL.

Para obter informações sobre os plugins `sha256_password` e `caching_sha2_password`, consulte a Seção 8.4.1.3, Autenticação Pluggable SHA-256, e a Seção 8.4.1.2, Cache SHA-2 Pluggable Authentication.

- `--socket=path`, `-S path`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--socket={file_name|pipe_name}</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

Para conexões com `localhost`, o arquivo de soquete do Unix a ser usado, ou, no Windows, o nome do tubo nomeado a ser usado.

No Windows, essa opção se aplica apenas se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões de name-pipe. Além disso, o usuário que faz a conexão deve ser um membro do grupo Windows especificado pela variável de sistema `named_pipe_full_access_group`.

- `--ssl*`

  As opções que começam com `--ssl` especificam se deve se conectar ao servidor usando criptografia e indicam onde encontrar chaves e certificados SSL. Veja Opções de comando para conexões criptografadas.
- `--ssl-fips-mode={OFF|ON|STRICT}`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--ssl-fips-mode={OFF|ON|STRICT}</code>]]</td> </tr><tr><th>Depreciado</th> <td>Sim , sim .</td> </tr><tr><th>Tipo do produto</th> <td>Enumeração</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>STRICT</code>]]</p></td> </tr></tbody></table>

Controla se o modo FIPS deve ser habilitado no lado do cliente. A opção `--ssl-fips-mode` difere das outras opções `--ssl-xxx` na medida em que não é usada para estabelecer conexões criptografadas, mas sim para afetar quais operações criptográficas devem ser permitidas. Veja Seção 8.8, Suporte FIPS.

São permitidos os seguintes valores de \[`--ssl-fips-mode`]:

- `OFF`: Desativar o modo FIPS.
- `ON`: Ativar o modo FIPS.
- `STRICT`: Ativar o modo FIPS strict.

::: info Note

Se o módulo de objeto OpenSSL FIPS não estiver disponível, o único valor permitido para `--ssl-fips-mode` é `OFF`. Neste caso, definir `--ssl-fips-mode` para `ON` ou `STRICT` faz com que o cliente produza um aviso na inicialização e funcione no modo não-FIPS.

:::

Esta opção está desatualizada. Espera-se que seja removida em uma versão futura do MySQL.

- `--tls-ciphersuites=ciphersuite_list`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--tls-ciphersuites=ciphersuite_list</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

Os ciphersuites permitidos para conexões criptografadas que usam TLSv1.3. O valor é uma lista de um ou mais nomes de ciphersuite separados por duas vírgulas. Os ciphersuites que podem ser nomeados para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para detalhes, consulte a Seção 8.3.2, "Protocolos e Cipheres TLS de Conexão Criptografada".

- `--tls-sni-servername=server_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--tls-sni-servername=server_name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

Quando especificado, o nome é passado para a biblioteca de API C `libmysqlclient` usando a opção `MYSQL_OPT_TLS_SNI_SERVERNAME` de `mysql_options()`. O nome do servidor não é sensível a maiúsculas e minúsculas. Para mostrar qual nome de servidor o cliente especificou para a sessão atual, se houver, verifique a variável de status `Tls_sni_server_name`.

O Server Name Indication (SNI) é uma extensão do protocolo TLS (o OpenSSL deve ser compilado usando extensões TLS para que esta opção funcione).

- `--tls-version=protocol_list`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--tls-version=protocol_list</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor por defeito</th> <td><p class="valid-value">[[<code>TLSv1,TLSv1.1,TLSv1.2,TLSv1.3</code>]] (OpenSSL 1.1.1 ou superior)</p><p class="valid-value">[[<code>TLSv1,TLSv1.1,TLSv1.2</code>]] (caso contrário)</p></td> </tr></tbody></table>

Os protocolos TLS permitidos para conexões criptografadas. O valor é uma lista de um ou mais nomes de protocolo separados por vírgulas. Os protocolos que podem ser nomeados para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para detalhes, consulte a Seção 8.3.2, "Protocolos e cifras TLS de conexão criptografada".

- `--user=user_name`, `-u user_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--user=user_name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

Nome do utilizador da conta MySQL a utilizar para se conectar ao servidor.

Se você estiver usando o plug-in `Rewriter`, você deve conceder a este usuário o privilégio `SKIP_QUERY_REWRITE`.

- `--zstd-compression-level=level`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--zstd-compression-level=#</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr></tbody></table>

O nível de compressão a usar para conexões com o servidor que usam o algoritmo de compressão `zstd`. Os níveis permitidos são de 1 a 22, com valores maiores indicando níveis crescentes de compressão. O nível de compressão `zstd` padrão é 3. A configuração do nível de compressão não tem efeito em conexões que não usam a compressão `zstd`.

Para mais informações, ver ponto 6.2.8, "Controlo da compressão da ligação".

#### Opções de arquivo de opções

Essas opções são usadas para controlar quais arquivos de opções devem ser lidos.

- `--defaults-extra-file=file_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--defaults-extra-file=file_name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Nome do ficheiro</td> </tr></tbody></table>

Leia este arquivo de opção após o arquivo de opção global, mas (em Unix) antes do arquivo de opção do usuário. Se o arquivo não existir ou for inacessível, ocorre um erro. Se \* `file_name` \* não for um nome de caminho absoluto, ele é interpretado em relação ao diretório atual.

Para obter informações adicionais sobre esta e outras opções de ficheiro de opções, consulte a secção 6.2.2.3, "Opções de linha de comando que afectam a manipulação de ficheiro de opções".

- `--defaults-file=file_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--defaults-file=file_name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Nome do ficheiro</td> </tr></tbody></table>

Use apenas o arquivo de opção dado. Se o arquivo não existir ou for inacessível, ocorre um erro. Se `file_name` não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

Exceção: Mesmo com `--defaults-file`, os programas cliente lêem `.mylogin.cnf`.

Para obter informações adicionais sobre esta e outras opções de ficheiro de opções, consulte a secção 6.2.2.3, "Opções de linha de comando que afectam a manipulação de ficheiro de opções".

- `--defaults-group-suffix=str`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--defaults-group-suffix=str</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

Leia não apenas os grupos de opções usuais, mas também os grupos com os nomes usuais e um sufixo de \* `str` \*. Por exemplo, \*\* mysqldump \*\* normalmente lê os grupos `[client]` e `[mysqldump]` . Se esta opção for dada como `--defaults-group-suffix=_other`, \*\* mysqldump \*\* também lê os grupos `[client_other]` e `[mysqldump_other]`.

Para obter informações adicionais sobre esta e outras opções de ficheiro de opções, consulte a secção 6.2.2.3, "Opções de linha de comando que afectam a manipulação de ficheiro de opções".

- `--no-defaults`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--no-defaults</code>]]</td> </tr></tbody></table>

Não leia nenhum arquivo de opções. Se o início do programa falhar devido à leitura de opções desconhecidas de um arquivo de opções, `--no-defaults` pode ser usado para impedi-las de serem lidas.

A exceção é que o arquivo `.mylogin.cnf` é lido em todos os casos, se existir. Isso permite que as senhas sejam especificadas de uma forma mais segura do que na linha de comando, mesmo quando `--no-defaults` é usado. Para criar `.mylogin.cnf`, use o utilitário **mysql\_config\_editor**. Veja Seção 6.6.7, mysql\_config\_editor  MySQL Configuration Utility.

Para obter informações adicionais sobre esta e outras opções de ficheiro de opções, consulte a secção 6.2.2.3, "Opções de linha de comando que afectam a manipulação de ficheiro de opções".

- `--print-defaults`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--print-defaults</code>]]</td> </tr></tbody></table>

Imprima o nome do programa e todas as opções que ele obtém de arquivos de opções.

Para obter informações adicionais sobre esta e outras opções de ficheiro de opções, consulte a secção 6.2.2.3, "Opções de linha de comando que afectam a manipulação de ficheiro de opções".

#### Opções de DDL

Os cenários de uso para `mysqldump` incluem a criação de uma nova instância do MySQL (incluindo tabelas de banco de dados), e a substituição de dados dentro de uma instância existente com bancos de dados e tabelas existentes. As opções a seguir permitem especificar quais as coisas a serem derrubadas e configuradas ao restaurar um dump, codificando várias instruções DDL dentro do arquivo de dump.

- `--add-drop-database`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--add-drop-database</code>]]</td> </tr></tbody></table>

Escreva uma instrução `DROP DATABASE` antes de cada instrução `CREATE DATABASE`. Esta opção é normalmente usada em conjunto com a opção `--all-databases` ou `--databases` porque nenhuma instrução `CREATE DATABASE` é escrita a menos que uma dessas opções seja especificada.

::: info Note

No MySQL 8.4, o `mysql` esquema é considerado um esquema de sistema que não pode ser descartado pelos usuários finais. Se `--add-drop-database` é usado com `--all-databases` ou com `--databases` onde a lista de esquemas a serem descartados inclui `mysql`, o arquivo de despejo contém uma instrução `` DROP DATABASE `mysql` `` que causa um erro quando o arquivo de despejo é recarregado.

Em vez disso, para usar `--add-drop-database`, use `--databases` com uma lista de esquemas a serem despejados, onde a lista não inclui `mysql`.

:::

- `--add-drop-table`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--add-drop-table</code>]]</td> </tr></tbody></table>

Escreva uma instrução `DROP TABLE` antes de cada instrução `CREATE TABLE`.

- `--add-drop-trigger`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--add-drop-trigger</code>]]</td> </tr></tbody></table>

Escreva uma instrução `DROP TRIGGER` antes de cada instrução `CREATE TRIGGER`.

- `--all-tablespaces`, `-Y`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--all-tablespaces</code>]]</td> </tr></tbody></table>

Adiciona a um depósito de tabela todas as instruções SQL necessárias para criar quaisquer tablespaces usados por uma tabela `NDB`. Esta informação não é de outra forma incluída na saída de `mysqldump`. Esta opção é atualmente relevante apenas para tabelas de cluster NDB.

- `--no-create-db`, `-n`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--no-create-db</code>]]</td> </tr></tbody></table>

Suprimir as instruções `CREATE DATABASE` que de outra forma estão incluídas na saída se a opção `--databases` ou `--all-databases` for dada.

- `--no-create-info`, `-t`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--no-create-info</code>]]</td> </tr></tbody></table>

Não escreva instruções `CREATE TABLE` que criem cada tabela despejada.

::: info Note

Esta opção *não* exclui instruções que criam grupos de arquivos de log ou tablespaces a partir da saída `mysqldump`; no entanto, você pode usar a opção `--no-tablespaces` para este propósito.

:::

- `--no-tablespaces`, `-y`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--no-tablespaces</code>]]</td> </tr></tbody></table>

Esta opção suprime todas as instruções `CREATE LOGFILE GROUP` e `CREATE TABLESPACE` na saída do `mysqldump`.

- `--replace`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--replace</code>]]</td> </tr></tbody></table>

Escreva instruções `REPLACE` em vez de instruções `INSERT`.

#### Opções de depuração

As seguintes opções imprimem informações de depuração, codificam informações de depuração no arquivo de descarga ou deixam a operação de descarga prosseguir independentemente de possíveis problemas.

- `--allow-keywords`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--allow-keywords</code>]]</td> </tr></tbody></table>

Permitir a criação de nomes de colunas que sejam palavras-chave. Isto funciona prefixando cada nome de coluna com o nome da tabela.

- `--comments`, `-i`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--comments</code>]]</td> </tr></tbody></table>

Escrever informações adicionais no arquivo de descarregamento, como versão do programa, versão do servidor e host. Esta opção está habilitada por padrão. Para suprimir essas informações adicionais, use `--skip-comments`.

- `--debug[=debug_options]`, `-# [debug_options]`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--debug[=debug_option<code>d:t:o,/tmp/mysqldump.trace</code></code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>d:t:o,/tmp/mysqldump.trace</code>]]</td> </tr></tbody></table>

Escreva um log de depuração. Uma string típica `debug_options` é `d:t:o,file_name`. O valor padrão é `d:t:o,/tmp/mysqldump.trace`.

Esta opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`.

- `--debug-check`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--debug-check</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>

Imprima algumas informações de depuração quando o programa sair.

Esta opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`.

- `--debug-info`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--debug-info</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>

Imprima informações de depuração e estatísticas de uso de memória e CPU quando o programa sair.

Esta opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`.

- `--dump-date`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--dump-date</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>TRUE</code>]]</td> </tr></tbody></table>

Se a opção `--comments` for dada, `mysqldump` produz um comentário no final do dump da seguinte forma:

```
-- Dump completed on DATE
```

No entanto, a data faz com que os arquivos de despejo tomados em momentos diferentes pareçam diferentes, mesmo que os dados sejam idênticos. `--dump-date` e `--skip-dump-date` controlam se a data é adicionada ao comentário. O padrão é `--dump-date` (incluir a data no comentário). `--skip-dump-date` suprime a impressão de data.

- `--force`, `-f`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--force</code>]]</td> </tr></tbody></table>

Ignore todos os erros; continue mesmo se ocorrer um erro SQL durante um despejo de tabela.

Um uso para esta opção é fazer com que `mysqldump` continue executando mesmo quando encontra uma vista que se tornou inválida porque a definição se refere a uma tabela que foi descartada. Sem `--force`, `mysqldump` sai com uma mensagem de erro. Com `--force`, `mysqldump` imprime a mensagem de erro, mas também escreve um comentário SQL contendo a definição de visualização para a saída de despejo e continua executando.

Se a opção `--ignore-error` também for dada para ignorar erros específicos, `--force` tem precedência.

- `--log-error=file_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--log-error=file_name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Nome do ficheiro</td> </tr></tbody></table>

Registre avisos e erros anexando-os ao arquivo nomeado. O padrão é não fazer registro.

- `--skip-comments`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--skip-comments</code>]]</td> </tr></tbody></table>

Ver a descrição da opção `--comments`.

- `--verbose`, `-v`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--verbose</code>]]</td> </tr></tbody></table>

Imprima mais informações sobre o que o programa faz.

#### Opções de Ajuda

As seguintes opções exibem informações sobre o próprio comando `mysqldump`.

- `--help`, `-?`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>

Mostra uma mensagem de ajuda e sai.

- `--version`, `-V`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--version</code>]]</td> </tr></tbody></table>

Informações de versão e saída.

#### Opções de internacionalização

As seguintes opções alteram a forma como o comando `mysqldump` representa dados de caracteres com as configurações de idioma nacional.

- `--character-sets-dir=dir_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--character-sets-dir=dir_name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Nome do diretório</td> </tr></tbody></table>

O diretório onde estão instalados os conjuntos de caracteres.

- `--default-character-set=charset_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--default-character-set=charset_name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>utf8</code>]]</td> </tr></tbody></table>

Use `charset_name` como o conjunto de caracteres padrão. Veja Seção 12.15, Caracter Set Configuration. Se nenhum conjunto de caracteres for especificado, `mysqldump` usa `utf8mb4`.

- `--no-set-names`, `-N`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--no-set-names</code>]]</td> </tr><tr><th>Depreciado</th> <td>Sim , sim .</td> </tr></tbody></table>

Desativa a configuração `--set-charset`, o mesmo que especificar `--skip-set-charset`.

- `--set-charset`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--set-charset</code>]]</td> </tr><tr><th>Desativado por</th> <td>[[<code>skip-set-charset</code>]]</td> </tr></tbody></table>

Escreva `SET NAMES default_character_set` na saída. Esta opção está habilitada por padrão. Para suprimir a instrução `SET NAMES`, use `--skip-set-charset`.

#### Opções de replicação

O comando `mysqldump` é frequentemente usado para criar uma instância vazia, ou uma instância incluindo dados, em um servidor de réplica em uma configuração de réplica.

- `--apply-replica-statements`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--apply-replica-statements</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>

Para um dump de réplica produzido com a opção `--dump-replica`, esta opção adiciona uma instrução `STOP REPLICA` antes da instrução com as coordenadas de log binário e uma instrução `START REPLICA` no final da saída.

- `--apply-slave-statements`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--apply-slave-statements</code>]]</td> </tr><tr><th>Depreciado</th> <td>Sim , sim .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>

Este é um alias desatualizado para `--apply-replica-statements`.

- `--delete-source-logs`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--delete-source-logs</code>]]</td> </tr></tbody></table>

Em um servidor de origem de replicação, apague os registros binários enviando uma instrução `PURGE BINARY LOGS` para o servidor após executar a operação de despejo. As opções exigem o privilégio `RELOAD` bem como privilégios suficientes para executar essa instrução. Esta opção automaticamente habilita `--source-data`.

- `--delete-master-logs`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--delete-master-logs</code>]]</td> </tr><tr><th>Depreciado</th> <td>Sim , sim .</td> </tr></tbody></table>

Este é um alias desatualizado para `--delete-source-logs`.

- `--dump-replica[=value]`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--dump-replica[=valu<code>1</code></code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>1</code>]]</p><p class="valid-value">[[<code>2</code>]]</p></td> </tr></tbody></table>

Esta opção é semelhante a `--source-data`, exceto que é usada para despejar um servidor de réplica para produzir um arquivo de despejo que pode ser usado para configurar outro servidor como uma réplica que tem a mesma fonte que o servidor despejado. A opção faz com que o resultado do despejo inclua uma instrução `CHANGE REPLICATION SOURCE TO` que indica as coordenadas de log binário (nome e posição do arquivo) da fonte da réplica despejada. A instrução `CHANGE REPLICATION SOURCE TO` lê os valores de `Relay_Master_Log_File` e `Exec_Master_Log_Pos` da saída `SHOW REPLICA STATUS` e os usa para `SOURCE_LOG_FILE` e `SOURCE_LOG_POS` respectivamente. Estes são os coordenadas do servidor de origem da réplica a partir do qual a réplica começa a replicar.

::: info Note

Inconsistências na sequência de transacções do registo de retransmissão que tenham sido executadas podem fazer com que a posição errada seja utilizada.

:::

`--dump-replica` faz com que as coordenadas da fonte sejam usadas em vez das do servidor despejado, como é feito pela opção `--source-data`. Além disso, especificar esta opção substitui a opção `--source-data`.

Advertência

`--dump-replica` não deve ser usado se o servidor onde o dump será aplicado usar `gtid_mode=ON` e `SOURCE_AUTO_POSITION=1`.

O valor da opção é manuseado da mesma maneira que para `--source-data`. Definir nenhum valor ou 1 faz com que uma instrução `CHANGE REPLICATION SOURCE TO` seja escrita no dump. Definir 2 faz com que a instrução seja escrita, mas encerrada em comentários SQL. Tem o mesmo efeito que `--source-data` em termos de habilitar ou desativar outras opções e em como o bloqueio é manuseado.

`--dump-replica` faz com que `mysqldump` pare o thread de replicação SQL antes do despejo e o reinicie novamente depois.

`--dump-replica` envia uma instrução `SHOW REPLICA STATUS` para o servidor para obter informações, então eles exigem privilégios suficientes para executar essa instrução.

As opções `--apply-replica-statements` e `--include-source-host-port` podem ser usadas em conjunto com `--dump-replica`.

- `--dump-slave[=value]`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--dump-slave[=valu<code>1</code></code>]]</td> </tr><tr><th>Depreciado</th> <td>Sim , sim .</td> </tr><tr><th>Tipo do produto</th> <td>Número</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>1</code>]]</p><p class="valid-value">[[<code>2</code>]]</p></td> </tr></tbody></table>

Este é um alias desatualizado para `--dump-replica`.

- `--include-source-host-port`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--include-source-host-port</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>

Adiciona as opções `SOURCE_HOST` e `SOURCE_PORT` para o nome do host e o número da porta TCP/IP da fonte da réplica, à instrução `CHANGE REPLICATION SOURCE TO` em um dump de réplica produzido com a opção `--dump-replica`.

- `--include-master-host-port`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--include-master-host-port</code>]]</td> </tr><tr><th>Depreciado</th> <td>Sim , sim .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>

Este é um alias desatualizado para `--include-source-host-port`.

- `--master-data[=value]`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--master-data[=valu<code>1</code></code>]]</td> </tr><tr><th>Depreciado</th> <td>Sim , sim .</td> </tr><tr><th>Tipo do produto</th> <td>Número</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>1</code>]]</p><p class="valid-value">[[<code>2</code>]]</p></td> </tr></tbody></table>

Este é um alias desatualizado para `--source-data`.

- `--output-as-version=value`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--output-as-version=value</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Enumeração</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>SERVER</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>BEFORE_8_0_23</code>]]</p><p class="valid-value">[[<code>BEFORE_8_2_0</code>]]</p></td> </tr></tbody></table>

Determina o nível de terminologia usado para instruções relacionadas a réplicas e eventos, tornando possível a criação de dumps compatíveis com versões mais antigas do MySQL que não aceitam a terminologia mais recente. Esta opção pode ter qualquer um dos seguintes valores, com efeitos descritos como listados aqui:

- `SERVER`: Leia a versão do servidor e usa as versões mais recentes de instruções compatíveis com essa versão. Este é o valor padrão.
- `BEFORE_8_0_23`: instruções SQL de replicação usando termos desatualizados como slave e master são escritas na saída no lugar daqueles que usam replica e source, como nas versões do MySQL antes de 8.0.23.

  Esta opção também duplica os efeitos de `BEFORE_8_2_0` na saída de `SHOW CREATE EVENT`.
- `BEFORE_8_2_0`: Esta opção faz com que `SHOW CREATE EVENT` reflita como o evento teria sido criado em um servidor MySQL antes da versão 8.2.0, exibindo `DISABLE ON SLAVE` em vez de `DISABLE ON REPLICA`.

Esta opção afeta a saída de `--events`, `--dump-replica`, `--source-data`, `--apply-replica-statements`, e `--include-source-host-port`.

- `--source-data[=value]`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--source-data[=valu<code>1</code></code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>1</code>]]</p><p class="valid-value">[[<code>2</code>]]</p></td> </tr></tbody></table>

Usado para despejar um servidor de origem de replicação para produzir um arquivo de despejo que pode ser usado para configurar outro servidor como uma réplica da fonte. As opções fazem com que a saída de despejo inclua uma instrução `CHANGE REPLICATION SOURCE TO` que indica as coordenadas de log binário (nome de arquivo e posição) do servidor despejado. Estes são as coordenadas do servidor de origem de replicação a partir das quais a réplica deve começar a replicar depois de carregar o arquivo de despejo na réplica.

Se o valor da opção for 2, a instrução `CHANGE REPLICATION SOURCE TO` é escrita como um comentário SQL e, portanto, é apenas informativa; não tem efeito quando o arquivo de descarga é recarregado. Se o valor da opção for 1, a instrução não é escrita como um comentário e entra em vigor quando o arquivo de descarga é recarregado. Se nenhum valor da opção for especificado, o valor padrão é 1.

\[`--source-data`] envia uma instrução \[`SHOW BINARY LOG STATUS`] para o servidor para obter informações, então eles exigem privilégios suficientes para executar essa instrução. Esta opção também requer o privilégio \[`RELOAD`] e o log binário deve ser habilitado.

Eles também ligam o `--lock-all-tables`, a menos que o `--single-transaction` também seja especificado, caso em que um bloqueio de leitura global é adquirido apenas por um curto período de tempo no início do despejo (veja a descrição para o `--single-transaction`). Em todos os casos, qualquer ação nos registros acontece no momento exato do despejo.

Também é possível configurar uma réplica despejando uma réplica existente da fonte, usando a opção `--dump-replica`, que substitui `--source-data` fazendo com que ela seja ignorada.

- `--set-gtid-purged=value`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--set-gtid-purged=value</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Enumeração</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>AUTO</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>AUTO</code>]]</p></td> </tr></tbody></table>

Esta opção é para servidores que usam replicação baseada em GTID (`gtid_mode=ON`). Ele controla a inclusão de uma instrução `SET @@GLOBAL.gtid_purged` na saída de descarga, que atualiza o valor de `gtid_purged` em um servidor onde o arquivo de descarga é recarregado, para adicionar o GTID definido a partir da variável do sistema `gtid_executed` do servidor de origem. `gtid_purged` mantém os GTIDs de todas as transações que foram aplicadas no servidor, mas não existem em nenhum arquivo de log binário no servidor. `mysqldump`, portanto, adiciona os GTIDs para as transações que foram executadas no servidor de origem, para que o servidor de destino registre essas transações como aplicadas, embora não as tenha em seus logs binários. PH\_CODE5 também controla a inclusão de uma instrução `SET @@SESSION.sql_log_bin=0`, que desativa o log enquanto o arquivo de descarga é recarregado, para evitar que o GTID original seja atribuído às transações, e

Se você não definir a opção `--set-gtid-purged`, o padrão é que uma instrução `SET @@GLOBAL.gtid_purged` seja incluída na saída do dump se os GTIDs estiverem habilitados no servidor que você está fazendo backup, e o conjunto de GTIDs no valor global da variável do sistema `gtid_executed` não estiver vazio. Uma instrução `SET @@SESSION.sql_log_bin=0` também é incluída se os GTIDs estiverem habilitados no servidor.

Você pode substituir o valor de `gtid_purged` com um conjunto GTID especificado, ou adicionar um sinal de mais (+) à instrução para anexar um conjunto GTID especificado ao conjunto GTID que já é mantido por `gtid_purged`. A instrução `SET @@GLOBAL.gtid_purged` registrada por `mysqldump` inclui um sinal de mais (`+`) em um comentário específico de versão, de modo que o MySQL adiciona o conjunto GTID do arquivo de despejo ao valor existente `gtid_purged`.

É importante notar que o valor que é incluído por `mysqldump` para a instrução `SET @@GLOBAL.gtid_purged` inclui os GTIDs de todas as transações no conjunto `gtid_executed` no servidor, mesmo aqueles que alteraram partes suprimidas do banco de dados, ou outros bancos de dados no servidor que não foram incluídos em um despejo parcial. Isso pode significar que depois que o valor `gtid_purged` foi atualizado no servidor onde o arquivo de despejo é reproduzido, GTIDs estão presentes que não se relacionam a nenhum dado no servidor de destino. Se você não reproduzir nenhum outro arquivo de despejo no servidor de destino, os GTIDs externos não causam problemas com a operação futura do servidor de reprodução, mas tornam mais difícil comparar conjuntos ou GTIDs em diferentes servidores de reprodução na topologia do arquivo de replicação. Se você fizer uma instrução de despejo adicional no mesmo arquivo de despejo alvo que contém os GTIDs suprimidos

Se a instrução `SET @@GLOBAL.gtid_purged` não tiver o resultado desejado em seu servidor de destino, você pode excluir a instrução da saída, ou incluí-la, mas comentá-la para que ela não seja acionada automaticamente. Você também pode incluir a instrução, mas editá-la manualmente no arquivo de despejo para alcançar o resultado desejado.

Os valores possíveis para a opção `--set-gtid-purged` são os seguintes:

`AUTO`: O valor padrão. Se os GTIDs estiverem habilitados no servidor que você está fazendo o backup e `gtid_executed` não estiver vazio, `SET @@GLOBAL.gtid_purged` será adicionado à saída, contendo o conjunto GTID de `gtid_executed`. Se os GTIDs estiverem habilitados, `SET @@SESSION.sql_log_bin=0` será adicionado à saída. Se os GTIDs não estiverem habilitados no servidor, as instruções não serão adicionadas à saída.

`OFF`: `SET @@GLOBAL.gtid_purged` não é adicionado à saída, e `SET @@SESSION.sql_log_bin=0` não é adicionado à saída. Para um servidor onde GTIDs não estão em uso, use esta opção ou `AUTO`. Use esta opção apenas para um servidor onde GTIDs estão em uso se você tiver certeza de que o conjunto GTID necessário já está presente em `gtid_purged` no servidor de destino e não deve ser alterado, ou se você planeja identificar e adicionar qualquer GTIDs ausentes manualmente.

`ON`: Se os GTIDs estiverem habilitados no servidor que você está fazendo o backup, `SET @@GLOBAL.gtid_purged` será adicionado à saída (a menos que `gtid_executed` esteja vazio), e `SET @@SESSION.sql_log_bin=0` será adicionado à saída. Um erro ocorre se você definir essa opção, mas os GTIDs não estiverem habilitados no servidor. Para um servidor onde os GTIDs estão em uso, use essa opção ou `AUTO`, a menos que você tenha certeza de que os GTIDs em `gtid_executed` não são necessários no servidor de destino.

`COMMENTED`: Se os GTIDs estiverem habilitados no servidor que você está fazendo backup, `SET @@GLOBAL.gtid_purged` será adicionado à saída (a menos que `gtid_executed` esteja vazio), mas será comentado. Isso significa que o valor de `gtid_executed` está disponível na saída, mas nenhuma ação é tomada automaticamente quando o arquivo de descarga é recarregado. `SET @@SESSION.sql_log_bin=0` será adicionado à saída, e não será comentado. Com `COMMENTED`, você pode controlar o uso do conjunto `gtid_executed` manualmente ou por meio de automação. Por exemplo, você pode preferir fazer isso se estiver migrando dados para outro servidor que já tem diferentes bancos de dados ativos.

#### Opções de formato

As opções a seguir especificam como representar todo o arquivo de despejo ou certos tipos de dados no arquivo de despejo.

- `--compact`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--compact</code>]]</td> </tr></tbody></table>

Produza uma saída mais compacta. Esta opção permite as opções `--skip-add-drop-table`, `--skip-add-locks`, `--skip-comments`, `--skip-disable-keys`, e `--skip-set-charset`.

- `--compatible=name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--compatible=name[,name,...]</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>''</code>]]</td> </tr><tr><th>Valores válidos</th> <td>[[<code>ansi</code>]]</td> </tr></tbody></table>

Produzir uma saída que seja mais compatível com outros sistemas de banco de dados ou com servidores MySQL mais antigos. O único valor permitido para esta opção é `ansi`, que tem o mesmo significado que a opção correspondente para definir o modo SQL do servidor. Veja Seção 7.1.11, Server SQL Modes.

- `--complete-insert`, `-c`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--complete-insert</code>]]</td> </tr></tbody></table>

Use instruções completas de `INSERT` que incluam nomes de colunas.

- `--create-options`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--create-options</code>]]</td> </tr></tbody></table>

Incluir todas as opções de tabela específicas do MySQL nas instruções `CREATE TABLE`.

- `--fields-terminated-by=...`, `--fields-enclosed-by=...`, `--fields-optionally-enclosed-by=...`, `--fields-escaped-by=...`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--fields-terminated-by=string</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table><table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--fields-enclosed-by=string</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table><table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--fields-optionally-enclosed-by=string</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table><table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--fields-escaped-by</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

Estas opções são usadas com a opção `--tab` e têm o mesmo significado que as cláusulas correspondentes `FIELDS` para `LOAD DATA`.

- `--hex-blob`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--hex-blob</code>]]</td> </tr></tbody></table>

Dump colunas binárias usando notação hexadecimal (por exemplo, `'abc'` torna-se `0x616263`). Os tipos de dados afetados são `BINARY`, `VARBINARY`, `BLOB` tipos, `BIT`, todos os tipos de dados espaciais, e outros tipos de dados não-binários quando usado com o `binary` conjunto de caracteres.

A opção `--hex-blob` é ignorada quando a `--tab` é usada.

- `--lines-terminated-by=...`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--lines-terminated-by=string</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

Esta opção é usada com a opção `--tab` e tem o mesmo significado que a correspondente cláusula `LINES` para `LOAD DATA`.

- `--quote-names`, `-Q`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--quote-names</code>]]</td> </tr><tr><th>Desativado por</th> <td>[[<code>skip-quote-names</code>]]</td> </tr></tbody></table>

Identificadores de citação (como nomes de banco de dados, tabelas e colunas) dentro de caracteres `` ` ``. Se o modo SQL `ANSI_QUOTES` estiver habilitado, os identificadores serão citados dentro de caracteres `"`. Esta opção está habilitada por padrão. Pode ser desativada com `--skip-quote-names`, mas esta opção deve ser dada depois de qualquer opção como `--compatible` que possa habilitar `--quote-names`.

- `--result-file=file_name`, `-r file_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--result-file=file_name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Nome do ficheiro</td> </tr></tbody></table>

A saída direta para o arquivo nomeado. O arquivo de resultado é criado e seu conteúdo anterior é sobrescrito, mesmo que ocorra um erro ao gerar o dump.

Esta opção deve ser usada no Windows para evitar que os caracteres da nova linha `\n` sejam convertidos em `\r\n` sequências de retorno/nova linha.

- `--show-create-skip-secondary-engine=value`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--show-create-skip-secondary-engine</code>]]</td> </tr></tbody></table>

Exclui a cláusula `SECONDARY ENGINE` das instruções `CREATE TABLE`. Ele faz isso ativando a variável do sistema `show_create_table_skip_secondary_engine` durante a duração da operação de despejo. Alternativamente, você pode ativar a variável do sistema `show_create_table_skip_secondary_engine` antes de usar `mysqldump`.

- `--tab=dir_name`, `-T dir_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--tab=dir_name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Nome do diretório</td> </tr></tbody></table>

Produzir arquivos de dados em formato de texto separados por abas. Para cada tabela despejada, `mysqldump` cria um arquivo `tbl_name.sql` que contém a instrução `CREATE TABLE` que cria a tabela, e o servidor escreve um arquivo `tbl_name.txt` que contém seus dados. O valor da opção é o diretório no qual escrever os arquivos.

::: info Note

Esta opção deve ser usada apenas quando `mysqldump` é executado na mesma máquina que o servidor `mysqld`. Como o servidor cria arquivos `*.txt` no diretório que você especifica, o diretório deve ser escrevível pelo servidor e a conta MySQL que você usa deve ter o privilégio `FILE`. Como `mysqldump` cria `*.sql` no mesmo diretório, ele deve ser escrevível pela sua conta de login do sistema.

:::

Por padrão, os arquivos de dados `.txt` são formatados usando caracteres de tabulação entre valores de coluna e uma nova linha no final de cada linha. O formato pode ser especificado explicitamente usando as opções `--fields-xxx` e `--lines-terminated-by`.

Os valores das colunas são convertidos para o conjunto de caracteres especificado pela opção `--default-character-set`.

- `--tz-utc`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--tz-utc</code>]]</td> </tr><tr><th>Desativado por</th> <td>[[<code>skip-tz-utc</code>]]</td> </tr></tbody></table>

Esta opção permite que as colunas de `TIMESTAMP` sejam despejadas e recarregadas entre servidores em diferentes fusos horários. `mysqldump` define seu fuso horário de conexão para UTC e adiciona `SET TIME_ZONE='+00:00'` ao arquivo de despejo. Sem esta opção, as colunas de `TIMESTAMP` são despejadas e recarregadas nos fusos horários locais para os servidores de origem e destino, o que pode fazer com que os valores mudem se os servidores estiverem em fusos horários diferentes. `--tz-utc` também protege contra alterações devido ao horário de verão. `--tz-utc` está habilitado por padrão. Para desativá-lo, use `--skip-tz-utc`.

- `--xml`, `-X`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--xml</code>]]</td> </tr></tbody></table>

Escrever a saída de descarga como XML bem formado.

\*\* `NULL`, `'NULL'`, e Valores vazios\*\*: Para uma coluna chamada \* `column_name`\*, o valor `NULL` , uma string vazia, e o valor string `'NULL'` são distinguidos uns dos outros na saída gerada por esta opção como segue.

  <table><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Valor:</th> <th>Representação XML:</th> </tr></thead><tbody><tr> <td>[[<code>NULL</code>]] (<span><em>valor desconhecido</em></span>)</td> <td><p> [[<code>&lt;field name="<em><code>column_name</code>]]</em>" xsi:nil="true" /&gt;</code> </p></td> </tr><tr> <td>[[<code>''</code>]] (<span><em>linha vazia</em></span>)</td> <td><p> [[<code>&lt;field name="<em><code>column_name</code>]]</em>"&gt;&lt;/field&gt;</code> </p></td> </tr><tr> <td>[[<code>'NULL'</code>]] (<span><em>valor de string</em></span>)</td> <td><p> [[<code>&lt;field name="<em><code>column_name</code>]]</em>"&gt;NULL&lt;/campo&gt;</code> </p></td> </tr></tbody></table>

A saída do cliente `mysql` quando executado usando a opção `--xml` também segue as regras precedentes. (Ver Seção 6.5.1.1, "Opções do Cliente Mysql")

A saída XML de `mysqldump` inclui o espaço de nomes XML, como mostrado aqui:

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

As seguintes opções controlam quais tipos de objetos de esquema são escritos no arquivo de descarte: por categoria, como gatilhos ou eventos; por nome, por exemplo, escolhendo quais bancos de dados e tabelas para descarte; ou até mesmo filtrando linhas dos dados da tabela usando uma cláusula `WHERE`.

- `--all-databases`, `-A`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--all-databases</code>]]</td> </tr></tbody></table>

Dump todas as tabelas em todos os bancos de dados. Isto é o mesmo que usar a opção `--databases` e nomear todos os bancos de dados na linha de comando.

::: info Note

Veja a descrição de `--add-drop-database` para informações sobre uma incompatibilidade dessa opção com `--all-databases`.

:::

Antes do MySQL 8.4, as opções `--routines` e `--events` para `mysqldump` não eram necessárias para incluir rotinas e eventos armazenados ao usar a opção `--all-databases`: O despejo incluía o banco de dados do sistema `mysql`, e, portanto, também as tabelas `mysql.proc` e `mysql.event` que continham definições de rotina e evento armazenadas. A partir do MySQL 8.4, as tabelas `mysql.event` e `mysql.proc` não são usadas. As definições para os objetos correspondentes são armazenadas em tabelas de dicionário de dados, mas essas tabelas não são despejadas. Para incluir rotinas e eventos armazenados em um despejo usando `--all-databases`, use as opções `--routines` e `--events` explicitamente.

- `--databases`, `-B`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--databases</code>]]</td> </tr></tbody></table>

Dump vários bancos de dados. Normalmente, `mysqldump` trata o primeiro argumento de nome na linha de comando como um nome de banco de dados e os nomes seguintes como nomes de tabela. Com esta opção, trata todos os argumentos de nome como nomes de banco de dados. As instruções `CREATE DATABASE` e `USE` são incluídas na saída antes de cada novo banco de dados.

Esta opção pode ser usada para despejar o banco de dados `performance_schema`, que normalmente não é despejado mesmo com a opção `--all-databases`. (Também use a opção `--skip-lock-tables`.)

::: info Note

Veja a descrição de `--add-drop-database` para informações sobre uma incompatibilidade dessa opção com `--databases`.

:::

- `--events`, `-E`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--events</code>]]</td> </tr></tbody></table>

Incluir eventos do agendador de eventos para os bancos de dados despejados na saída. Esta opção requer os privilégios `EVENT` para esses bancos de dados.

A saída gerada usando `--events` contém `CREATE EVENT` instruções para criar os eventos.

- `--ignore-error=error[,error]...`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--ignore-error=error[,error]...</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

Ignorar os erros especificados. O valor da opção é uma lista de números de erro separados por vírgulas especificando os erros a serem ignorados durante a execução do `mysqldump`. Se a opção `--force` também for dada para ignorar todos os erros, `--force` terá precedência.

- `--ignore-table=db_name.tbl_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--ignore-table=db_name.tbl_name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

Não descarte a tabela dada, que deve ser especificada usando tanto o banco de dados quanto os nomes das tabelas. Para ignorar várias tabelas, use esta opção várias vezes. Esta opção também pode ser usada para ignorar exibições.

- `--ignore-views=boolean`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--ignore-views</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>

Salta as visualizações de tabela no arquivo de despejo.

- `--init-command=str`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--init-command=str</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

Uma única instrução SQL para ser executada após a conexão com o servidor MySQL. A definição redefine instruções existentes definidas por ela ou `init-command-add`.

- `--init-command-add=str`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--init-command-add=str</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

Adicionar uma instrução SQL adicional para executar após a conexão ou reconexão ao servidor MySQL. É utilizável sem `--init-command` mas não tem efeito se usado antes dele porque `init-command` redefine a lista de comandos para chamar.

- `--no-data`, `-d`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--no-data</code>]]</td> </tr></tbody></table>

Não escreva nenhuma informação de linha de tabela (isto é, não descarte o conteúdo da tabela). Isso é útil se você quiser descarte apenas a instrução `CREATE TABLE` para a tabela (por exemplo, para criar uma cópia vazia da tabela carregando o arquivo de descarte).

- `--routines`, `-R`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--routines</code>]]</td> </tr></tbody></table>

Incluir rotinas armazenadas (procedimentos e funções) para os bancos de dados despejados na saída. Esta opção requer o privilégio global `SELECT`.

A saída gerada usando `--routines` contém `CREATE PROCEDURE` e `CREATE FUNCTION` instruções para criar as rotinas.

- `--skip-generated-invisible-primary-key`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--skip-generated-invisible-primary-key</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>

Esta opção faz com que as chaves primárias invisíveis geradas sejam excluídas da saída.

- `--tables`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--tables</code>]]</td> </tr></tbody></table>

Anula a opção `--databases` ou `-B`. `mysqldump` considera todos os argumentos de nome após a opção como nomes de tabela.

- `--triggers`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--triggers</code>]]</td> </tr><tr><th>Desativado por</th> <td>[[<code>skip-triggers</code>]]</td> </tr></tbody></table>

Incluir gatilhos para cada tabela despejada na saída. Esta opção está habilitada por padrão; desative-a com `--skip-triggers`.

Para ser capaz de despejar os gatilhos de uma tabela, você deve ter o privilégio `TRIGGER` para a tabela.

Múltiplos gatilhos são permitidos. `mysqldump` despeja gatilhos na ordem de ativação para que, quando o arquivo de despejo é recarregado, os gatilhos sejam criados na mesma ordem de ativação. No entanto, se um arquivo de despejo `mysqldump` contém vários gatilhos para uma tabela que tem o mesmo evento de gatilho e tempo de ação, ocorre um erro para tentativas de carregar o arquivo de despejo em um servidor antigo que não suporta gatilhos múltiplos. (Para uma solução alternativa, consulte Notas de degradação; você pode converter gatilhos para serem compatíveis com servidores antigos.)

- `--where='where_condition'`, `-w 'where_condition'`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--where='where_condition'</code>]]</td> </tr></tbody></table>

Dump apenas linhas selecionadas pela condição `WHERE` dada. As citações em torno da condição são obrigatórias se contiver espaços ou outros caracteres que são especiais para o seu interpretador de comando.

Exemplos:

```
--where="user='jimf'"
-w"userid>1"
-w"userid<1"
```

#### Opções de desempenho

As seguintes opções são as mais relevantes para o desempenho, particularmente das operações de restauração. Para grandes conjuntos de dados, a operação de restauração (processamento das instruções `INSERT` no arquivo de descarga) é a parte mais demorada. Quando é urgente restaurar dados rapidamente, planeje e teste o desempenho desta etapa com antecedência. Para tempos de restauração medidos em horas, você pode preferir uma solução alternativa de backup e restauração, como o MySQL Enterprise Backup para bancos de dados de uso misto e apenas de `InnoDB`.

O desempenho é igualmente afectado pelas opções transaccionais, principalmente no que respeita à operação de dumping.

- `--column-statistics`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--column-statistics</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

Adicione instruções `ANALYZE TABLE` à saída para gerar estatísticas de histograma para tabelas despejadas quando o arquivo de despejo é recarregado. Esta opção está desativada por padrão porque a geração de histograma para tabelas grandes pode levar muito tempo.

- `--disable-keys`, `-K`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--disable-keys</code>]]</td> </tr></tbody></table>

Para cada tabela, rodeie as instruções `INSERT` com as instruções `/*!40000 ALTER TABLE tbl_name DISABLE KEYS */;` e `/*!40000 ALTER TABLE tbl_name ENABLE KEYS */;`. Isso faz com que o arquivo de descarga seja carregado mais rápido porque os índices são criados depois que todas as linhas são inseridas. Esta opção é eficaz apenas para índices não exclusivos das tabelas `MyISAM`.

- `--extended-insert`, `-e`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--extended-insert</code>]]</td> </tr><tr><th>Desativado por</th> <td>[[<code>skip-extended-insert</code>]]</td> </tr></tbody></table>

Escreva instruções `INSERT` usando uma sintaxe de várias linhas que inclui várias listas `VALUES`. Isso resulta em um arquivo de descarte menor e acelera as inserções quando o arquivo é recarregado.

- `--insert-ignore`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--insert-ignore</code>]]</td> </tr></tbody></table>

Escreva instruções `INSERT IGNORE` em vez de instruções `INSERT`.

- `--max-allowed-packet=value`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--max-allowed-packet=value</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>25165824</code>]]</td> </tr></tbody></table>

O tamanho máximo do buffer para comunicação cliente/servidor. O padrão é 24MB, o máximo é 1GB.

::: info Note

O valor desta opção é específico para `mysqldump` e não deve ser confundido com a variável de sistema `max_allowed_packet` do servidor MySQL; o valor do servidor não pode ser excedido por um único pacote de `mysqldump`, independentemente de qualquer configuração para a opção `mysqldump`, mesmo que esta última seja maior.

:::

- `--mysqld-long-query-time=value`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--mysqld-long-query-time=value</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>Server global setting</code>]]</td> </tr></tbody></table>

Defina o valor de sessão da variável de sistema `long_query_time` . Use esta opção se você quiser aumentar o tempo permitido para consultas de `mysqldump` antes de serem registradas no arquivo de registro de consultas lento. `mysqldump` executa uma varredura de tabela completa, o que significa que suas consultas podem muitas vezes exceder uma configuração global `long_query_time` que é útil para consultas regulares. A configuração global padrão é de 10 segundos.

Você pode usar `--mysqld-long-query-time` para especificar um valor de sessão de 0 (o que significa que cada consulta de `mysqldump` é registrada no registro de consultas lentas) a 31536000, que é 365 dias em segundos. Para a opção `mysqldump`, você só pode especificar segundos inteiros. Quando você não especifica essa opção, a configuração global do servidor se aplica às consultas do `mysqldump`.

- `--net-buffer-length=value`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--net-buffer-length=value</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>16384</code>]]</td> </tr></tbody></table>

O tamanho inicial do buffer para comunicação cliente/servidor. Ao criar instruções de `INSERT` de várias linhas (como com a opção `--extended-insert` ou `--opt`), `mysqldump` cria linhas de até `--net-buffer-length` bytes de comprimento. Se você aumentar essa variável, certifique-se de que a variável do sistema do servidor MySQL `net_buffer_length` tenha um valor pelo menos deste tamanho.

- `--network-timeout`, `-M`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--network-timeout[={0|1}]</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>TRUE</code>]]</td> </tr></tbody></table>

Permitir que tabelas grandes sejam despejadas definindo o valor máximo de `--max-allowed-packet` e o tempo de leitura e gravação da rede para um valor grande. Esta opção está habilitada por padrão. Para desativá-la, use `--skip-network-timeout`.

- `--opt`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--opt</code>]]</td> </tr><tr><th>Desativado por</th> <td>[[<code>skip-opt</code>]]</td> </tr></tbody></table>

Esta opção, ativada por padrão, é uma abreviação para a combinação de `--add-drop-table` `--add-locks` `--create-options` `--disable-keys` `--extended-insert` `--lock-tables` `--quick` `--set-charset`. Ele fornece uma operação de despejo rápida e produz um arquivo de despejo que pode ser recarregado em um servidor MySQL rapidamente.

Como a opção `--opt` está habilitada por padrão, você só especifica sua conversão, a `--skip-opt` para desativar várias configurações padrão. Veja a discussão dos grupos de opções `mysqldump` para informações sobre como habilitar ou desativar seletivamente um subconjunto das opções afetadas pela `--opt`.

- `--quick`, `-q`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--quick</code>]]</td> </tr><tr><th>Desativado por</th> <td>[[<code>skip-quick</code>]]</td> </tr></tbody></table>

Esta opção é útil para despejar tabelas grandes. Força `mysqldump` a recuperar linhas para uma tabela do servidor uma linha de cada vez, em vez de recuperar todo o conjunto de linhas e armazená-lo na memória antes de escrevê-lo.

- `--skip-opt`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--skip-opt</code>]]</td> </tr></tbody></table>

Ver a descrição da opção `--opt`.

#### Opções de transação

As seguintes opções permitem avaliar o desempenho da operação de dumping em função da fiabilidade e da coerência dos dados exportados.

- `--add-locks`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--add-locks</code>]]</td> </tr></tbody></table>

Cerque cada depósito de tabela com as instruções `LOCK TABLES` e `UNLOCK TABLES`. Isso resulta em inserções mais rápidas quando o arquivo de depósito é recarregado. Veja Seção 10.2.5.1, Otimização de instruções INSERT.

- `--flush-logs`, `-F`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--flush-logs</code>]]</td> </tr></tbody></table>

Limpe os arquivos de log do servidor MySQL antes de iniciar o despejo. Esta opção requer o privilégio `RELOAD`. Se você usar essa opção em combinação com a opção `--all-databases`, os logs serão limpos \* para cada banco de dados despejado\*. A exceção é quando se usa `--lock-all-tables`, `--source-data`, ou `--single-transaction`. Nesses casos, os logs são limpos apenas uma vez, correspondendo ao momento em que todas as tabelas são bloqueadas por `FLUSH TABLES WITH READ LOCK`. Se você quiser que o seu despejo e o log flush aconteçam exatamente no mesmo momento, você deve usar `--flush-logs` junto com `--lock-all-tables`, `--source-data`, ou `--single-transaction`.

- `--flush-privileges`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--flush-privileges</code>]]</td> </tr></tbody></table>

Adicionar uma instrução `FLUSH PRIVILEGES` à saída do dump após o dump da base de dados `mysql`. Esta opção deve ser usada sempre que o dump contenha a base de dados `mysql` e qualquer outra base de dados que dependa dos dados da base de dados `mysql` para a restauração adequada.

Como o arquivo de despejo contém uma instrução `FLUSH PRIVILEGES`, o recarregamento do arquivo requer privilégios suficientes para executar essa instrução.

- `--lock-all-tables`, `-x`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--lock-all-tables</code>]]</td> </tr></tbody></table>

Bloqueie todas as tabelas em todos os bancos de dados. Isso é conseguido adquirindo um bloqueio de leitura global para a duração de todo o depósito. Esta opção desativa automaticamente `--single-transaction` e `--lock-tables`.

- `--lock-tables`, `-l`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--lock-tables</code>]]</td> </tr></tbody></table>

Para cada banco de dados despejado, bloqueie todas as tabelas a serem despejadas antes de despejá-las. As tabelas são bloqueadas com `READ LOCAL` para permitir inserções simultâneas no caso das tabelas `MyISAM`. Para tabelas transacionais como `InnoDB`, `--single-transaction` é uma opção muito melhor do que `--lock-tables` porque não precisa bloquear as tabelas.

Como `--lock-tables` bloqueia tabelas para cada banco de dados separadamente, essa opção não garante que as tabelas no arquivo de descarregamento sejam logicamente consistentes entre bancos de dados.

Algumas opções, como `--opt`, ativam automaticamente `--lock-tables`. Se você quiser substituir isso, use `--skip-lock-tables` no final da lista de opções.

- `--no-autocommit`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--no-autocommit</code>]]</td> </tr></tbody></table>

Incluir as instruções `INSERT` para cada tabela de dumping dentro das instruções `SET autocommit = 0` e `COMMIT`.

- `--order-by-primary`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--order-by-primary</code>]]</td> </tr></tbody></table>

Dump as linhas de cada tabela ordenadas por sua chave primária, ou por seu primeiro índice exclusivo, se tal índice existir. Isso é útil quando se despeja uma tabela `MyISAM` para ser carregada em uma tabela `InnoDB`, mas faz com que a operação de despejo leve consideravelmente mais tempo.

- `--shared-memory-base-name=name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--shared-memory-base-name=name</code>]]</td> </tr><tr><th>Específicos da plataforma</th> <td>Vidros</td> </tr></tbody></table>

No Windows, o nome de memória compartilhada a ser usado para conexões feitas usando memória compartilhada para um servidor local. O valor padrão é `MYSQL`. O nome de memória compartilhada é sensível a maiúscula e minúscula.

Esta opção aplica-se apenas se o servidor foi iniciado com a variável de sistema `shared_memory` habilitada para suportar conexões de memória compartilhada.

- `--single-transaction`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--single-transaction</code>]]</td> </tr></tbody></table>

Esta opção define o modo de isolamento de transação para `REPEATABLE READ` e envia uma instrução SQL `START TRANSACTION` para o servidor antes de despejar dados. É útil apenas com tabelas transacionais como `InnoDB`, porque então despeja o estado consistente do banco de dados no momento em que `START TRANSACTION` foi emitido sem bloquear nenhum aplicativo.

O privilégio `RELOAD` ou `FLUSH_TABLES` é necessário com `--single-transaction` se ambos `gtid_mode=ON` e `gtid_purged=ON|AUTO`.

Ao usar esta opção, você deve ter em mente que somente as tabelas `InnoDB` são despejadas em um estado consistente. Por exemplo, qualquer `MyISAM` ou `MEMORY` tabelas despejadas ao usar esta opção ainda podem mudar de estado.

Enquanto um dump está em andamento, para garantir um arquivo de dump válido (conteúdos de tabela corretos e coordenadas de log binário), nenhuma outra conexão deve usar as seguintes instruções: \[`ALTER TABLE`], \[`CREATE TABLE`], \[`DROP TABLE`], \[`RENAME TABLE`], \[`TRUNCATE TABLE`]. Uma leitura consistente não é isolada dessas instruções, portanto, usá-las em uma tabela a ser despejada pode causar o \[`SELECT`] que é executado pelo mysqldump para recuperar o conteúdo da tabela para obter conteúdos incorretos ou falhar.

A opção `--single-transaction` e a opção `--lock-tables` são mutuamente exclusivas porque `LOCK TABLES` faz com que quaisquer transações pendentes sejam comprometidas implicitamente.

Para despejar tabelas grandes, combine a opção `--single-transaction` com a opção `--quick`.

#### Grupos de opções

- A opção `--opt` ativa várias configurações que trabalham em conjunto para executar uma operação de descarga rápida. Todas essas configurações estão ativadas por padrão, porque `--opt` está ativado por padrão. Assim, você raramente especifica `--opt`. Em vez disso, você pode desativar essas configurações como um grupo especificando `--skip-opt`, em seguida, opcionalmente reativar certas configurações especificando as opções associadas mais tarde na linha de comando.
- A opção `--compact` desativa várias configurações que controlam se as instruções e comentários opcionais aparecem na saída. Novamente, você pode seguir esta opção com outras opções que reativam certas configurações, ou ativar todas as configurações usando o formulário `--skip-compact`.

Quando você seletivamente habilita ou desativa o efeito de uma opção de grupo, a ordem é importante porque as opções são processadas de primeiro a último. Por exemplo, `--disable-keys` `--lock-tables` `--skip-opt` não teria o efeito pretendido; é o mesmo que `--skip-opt` por si só.

#### Exemplos

Para fazer um backup de um banco de dados inteiro:

```
mysqldump db_name > backup-file.sql
```

Para carregar o arquivo de descarga de volta ao servidor:

```
mysql db_name < backup-file.sql
```

Outra maneira de recarregar o arquivo de descarga:

```
mysql -e "source /path-to-backup/backup-file.sql" db_name
```

`mysqldump` também é muito útil para preencher bancos de dados, copiando dados de um servidor MySQL para outro:

```
mysqldump --opt db_name | mysql --host=remote_host -C db_name
```

Pode descarregar várias bases de dados com um comando:

```
mysqldump --databases db_name1 [db_name2 ...] > my_databases.sql
```

Para descarregar todos os bancos de dados, use a opção `--all-databases`:

```
mysqldump --all-databases > all_databases.sql
```

Para tabelas `InnoDB`, `mysqldump` fornece uma maneira de fazer um backup on-line:

```
mysqldump --all-databases --source-data --single-transaction > all_databases.sql
```

Este backup adquire um bloqueio de leitura global em todas as tabelas (usando `FLUSH TABLES WITH READ LOCK`) no início do despejo. Assim que este bloqueio foi adquirido, as coordenadas do log binário são lidas e o bloqueio é liberado. Se as instruções de atualização longas estiverem sendo executadas quando a instrução `FLUSH` é emitida, o servidor MySQL pode ficar paralisado até que essas instruções terminem. Depois disso, o despejo se torna livre de bloqueio e não perturba a leitura e escrita nas tabelas. Se as instruções de atualização que o servidor MySQL recebe são curtas (em termos de tempo de execução), o período de bloqueio inicial não deve ser perceptível, mesmo com muitas atualizações.

Para recuperação pontual (também conhecida como roll-forward, quando você precisa restaurar um backup antigo e reproduzir as alterações que aconteceram desde esse backup), muitas vezes é útil girar o log binário (ver Seção 7.4.4, O Log Binário) ou pelo menos conhecer as coordenadas do log binário às quais o dump corresponde:

```
mysqldump --all-databases --source-data=2 > all_databases.sql
```

Ou:

```
mysqldump --all-databases --flush-logs --source-data=2 > all_databases.sql
```

A opção `--source-data` pode ser usada simultaneamente com a opção `--single-transaction`, que fornece uma maneira conveniente de fazer um backup on-line adequado para uso antes da recuperação de ponto em tempo se as tabelas forem armazenadas usando o mecanismo de armazenamento `InnoDB`.

Para obter mais informações sobre a realização de cópias de segurança, consulte a Seção 9.2, "Métodos de cópias de segurança de bases de dados" e a Seção 9.3, "Exemplo de estratégia de cópias de segurança e recuperação".

- Para selecionar o efeito do `--opt` com exceção de alguns recursos, use a opção `--skip` para cada recurso. Para desativar inserções estendidas e buffering de memória, use `--opt` `--skip-extended-insert` `--skip-quick`. (Na verdade, `--skip-extended-insert` `--skip-quick` é suficiente porque `--opt` está ativado por padrão.)
- Para reverter o `--opt` para todas as funções, exceto a desativação de índices e bloqueio de tabelas, use o `--skip-opt` `--disable-keys` `--lock-tables`.

#### Restrições

`mysqldump` não descarrega o `performance_schema` ou `sys` por padrão. Para descarregar qualquer um deles, nomeie-os explicitamente na linha de comando. Você também pode nomeá-los com a `--databases` opção. Para `performance_schema`, também use a `--skip-lock-tables` opção.

`mysqldump` não descarrega o `INFORMATION_SCHEMA` esquema.

`mysqldump` não descarrega instruções `InnoDB` `CREATE TABLESPACE`.

`mysqldump` não descarrega o banco de dados de informações do cluster NDB `ndbinfo`.

`mysqldump` inclui instruções para recriar as tabelas `general_log` e `slow_query_log` para despejos do banco de dados `mysql`.

Se você encontrar problemas ao fazer backup de visualizações devido a privilégios insuficientes, consulte a Seção 27.9, "Restrições de Visualizações" para uma solução alternativa.
