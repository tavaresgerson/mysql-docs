### 6.5.6 mysqlpump — Um programa de backup de banco de dados

- Sintaxe de Invocação de mysqlpump
- Resumo da opção mysqlpump
- mysqlpump Descrições de Opções
- mysqlpump Seleção de objeto
- mysqlpump Processamento Paralelo
- mysqlpump Restrições

A ferramenta de cliente **mysqlpump** realiza backups lógicos, produzindo um conjunto de instruções SQL que podem ser executadas para reproduzir as definições originais dos objetos do banco de dados e os dados das tabelas. Ela descarrega um ou mais bancos de dados MySQL para backup ou transferência para outro servidor SQL.

Nota

O **mysqlpump** está desatualizado a partir do MySQL 8.0.34; espere-se que ele seja removido em uma versão futura do MySQL. Você pode usar programas como **mysqldump** e o MySQL Shell para realizar backups lógicos, fazer dump de bancos de dados e tarefas semelhantes.

Dica

Considere usar os utilitários de dump do MySQL Shell, que oferecem dumping paralelo com múltiplos threads, compressão de arquivos e exibição de informações de progresso, além de recursos na nuvem, como o streaming do Oracle Cloud Infrastructure Object Storage e verificações e modificações de compatibilidade do MySQL HeatWave. Os dumps podem ser facilmente importados em uma instância do MySQL Server ou em um Sistema de Banco de Dados MySQL HeatWave usando os utilitários de carga de dump do MySQL Shell. As instruções de instalação do MySQL Shell podem ser encontradas aqui.

As características do **mysqlpump** incluem:

- Processamento paralelo de bancos de dados e de objetos dentro deles para acelerar o processo de dump

- Melhor controle sobre quais bancos de dados e objetos de banco de dados (tabelas, programas armazenados, contas de usuário) devem ser descarregados

- Exclusão de contas de usuários como declarações de gerenciamento de contas (`CREATE USER`, `GRANT`) em vez de inserções no banco de dados do sistema `mysql`

- Capacidade de criar saída comprimida

- Indicador de progresso (os valores são estimativas)

- Para a recarga do arquivo de dumping, criação de índice secundário mais rápida para as tabelas `InnoDB` adicionando índices após as linhas serem inseridas

Nota

O **mysqlpump** utiliza recursos do MySQL introduzidos no MySQL 5.7 e, portanto, assume o uso com o MySQL 5.7 ou superior.

O **mysqlpump** requer pelo menos o privilégio `SELECT` para tabelas descarregadas, `SHOW VIEW` para visualizações descarregadas, `TRIGGER` para gatilhos descarregados e `LOCK TABLES` se a opção `--single-transaction` não for usada. O privilégio `SELECT` no banco de dados do sistema `mysql` é necessário para descarregar definições de usuários. Algumas opções podem exigir outros privilégios, conforme indicado nas descrições das opções.

Para recarregar um arquivo de dump, você deve ter os privilégios necessários para executar as instruções que ele contém, como os privilégios apropriados `CREATE` para objetos criados por essas instruções.

Nota

Um dump feito usando o PowerShell no Windows com redirecionamento de saída cria um arquivo com codificação UTF-16:

```
mysqlpump [options] > dump.sql
```

No entanto, o UTF-16 não é permitido como conjunto de caracteres de conexão (consulte a Seção 12.4, “Conjunto de caracteres de conexão e colagens”), então o arquivo de dump não pode ser carregado corretamente. Para contornar esse problema, use a opção `--result-file`, que cria a saída no formato ASCII:

```
mysqlpump [options] --result-file=dump.sql
```

#### Sintaxe de Invocação de mysqlpump

Por padrão, o **mysqlpump** exibe todos os bancos de dados (com certas exceções mencionadas nas restrições do mysqlpump). Para especificar explicitamente esse comportamento, use a opção `--all-databases`:

```
mysqlpump --all-databases
```

Para descartar um único banco de dados ou certas tabelas dentro desse banco de dados, nomeie o banco de dados na linha de comando, opcionalmente seguido pelos nomes das tabelas:

```
mysqlpump db_name
mysqlpump db_name tbl_name1 tbl_name2 ...
```

Para tratar todos os argumentos de nome como nomes de banco de dados, use a opção `--databases`:

```
mysqlpump --databases db_name1 db_name2 ...
```

Por padrão, o **mysqlpump** não realiza o dump das definições das contas de usuário, mesmo que você faça o dump do banco de dados do sistema `mysql` que contém as tabelas de concessão. Para realizar o dump do conteúdo da tabela de concessão como definições lógicas na forma de instruções `CREATE USER` e `GRANT`, use a opção `--users` e suprima todo o dump do banco de dados:

```
mysqlpump --exclude-databases=% --users
```

No comando anterior, `%` é um caractere curinga que corresponde a todos os nomes de banco de dados para a opção `--exclude-databases`.

O **mysqlpump** suporta várias opções para incluir ou excluir bancos de dados, tabelas, programas armazenados e definições de usuários. Veja Seleção de Objetos do mysqlpump.

Para recarregar um arquivo de dump, execute as instruções que ele contém. Por exemplo, use o cliente **mysql**:

```
mysqlpump [options] > dump.sql
mysql < dump.sql
```

A discussão a seguir fornece exemplos adicionais de uso do **mysqlpump**.

Para ver uma lista das opções suportadas pelo **mysqlpump**, execute o comando **mysqlpump --help**.

#### Resumo da opção mysqlpump

O **mysqlpump** suporta as seguintes opções, que podem ser especificadas na linha de comando ou nos grupos `[mysqlpump]` e `[client]` de um arquivo de opções. (Antes do MySQL 8.0.20, o **mysqlpump** lia o grupo `[mysql_dump]` em vez de `[mysqlpump]`. A partir do 8.0.20, `[mysql_dump]` ainda é aceito, mas está desatualizado.) Para obter informações sobre arquivos de opções usados por programas do MySQL, consulte a Seção 6.2.2.2, “Usando Arquivos de Opções”.

**Tabela 6.17 Opções do mysqlpump**

<table summary="Opções de linha de comando disponíveis para o mysqlpump."><thead><tr><th scope="col">Nome da Opção</th> <th scope="col">Descrição</th> <th scope="col">Introduzido</th> <th scope="col">Desatualizado</th> </tr></thead><tbody><tr><th>--add-drop-database</th> <td>Adicione a instrução DROP DATABASE antes de cada instrução CREATE DATABASE</td> <td></td> <td></td> </tr><tr><th>--add-drop-table</th> <td>Adicione a declaração DROP TABLE antes de cada declaração CREATE TABLE</td> <td></td> <td></td> </tr><tr><th>--add-drop-user</th> <td>Adicione a declaração DROP USER antes de cada declaração CREATE USER</td> <td></td> <td></td> </tr><tr><th>--add-locks</th> <td>Cerque cada dump de tabela com as instruções LOCK TABLES e UNLOCK TABLES</td> <td></td> <td></td> </tr><tr><th>--all-databases</th> <td>Descarregue todas as bases de dados</td> <td></td> <td></td> </tr><tr><th>--bind-address</th> <td>Use a interface de rede especificada para se conectar ao servidor MySQL</td> <td></td> <td></td> </tr><tr><th>--sets-de-caracteres-dir</th> <td>Diretório onde os conjuntos de caracteres são instalados</td> <td></td> <td></td> </tr><tr><th>--column-statistics</th> <td>Escreva declarações ANALYZE TABLE para gerar histogramas de estatísticas</td> <td></td> <td></td> </tr><tr><th>--complete-insert</th> <td>Use instruções INSERT completas que incluam os nomes das colunas</td> <td></td> <td></td> </tr><tr><th>--compress</th> <td>Compressar todas as informações enviadas entre o cliente e o servidor</td> <td></td> <td>8.0.18</td> </tr><tr><th>--compress-output</th> <td>Algoritmo de compressão de saída</td> <td></td> <td></td> </tr><tr><th>--algoritmos de compressão</th> <td>Algoritmos de compressão permitidos para conexões com o servidor</td> <td>8.0.18</td> <td></td> </tr><tr><th>--databases</th> <td>Interprete todos os argumentos de nome como nomes de banco de dados</td> <td></td> <td></td> </tr><tr><th>--debug</th> <td>Escreva o log de depuração</td> <td></td> <td></td> </tr><tr><th>--debug-check</th> <td>Imprimir informações de depuração quando o programa sai</td> <td></td> <td></td> </tr><tr><th>--debug-info</th> <td>Imprimir informações de depuração, memória e estatísticas da CPU quando o programa sai</td> <td></td> <td></td> </tr><tr><th>--default-auth</th> <td>Plugin de autenticação a ser usado</td> <td></td> <td></td> </tr><tr><th>--default-character-set</th> <td>Especifique o conjunto de caracteres padrão</td> <td></td> <td></td> </tr><tr><th>--default-parallelism</th> <td>Número padrão de threads para processamento paralelo</td> <td></td> <td></td> </tr><tr><th>--defaults-extra-file</th> <td>Leia o arquivo de opção nomeado, além dos arquivos de opção usuais</td> <td></td> <td></td> </tr><tr><th>--defaults-file</th> <td>Arquivo de opção de leitura apenas nomeado</td> <td></td> <td></td> </tr><tr><th>--defaults-group-suffix</th> <td>Valor do sufixo do grupo de opções</td> <td></td> <td></td> </tr><tr><th>--defer-table-indexes</th> <td>Para recarregar, adiar a criação do índice até depois de carregar as linhas da tabela</td> <td></td> <td></td> </tr><tr><th>--eventos</th> <td>Eventos de descarte de bancos de dados descartados</td> <td></td> <td></td> </tr><tr><th>--exclude-databases</th> <td>Bases de dados a excluir do dump</td> <td></td> <td></td> </tr><tr><th>--exclude-events</th> <td>Eventos a serem excluídos do lixo eletrônico</td> <td></td> <td></td> </tr><tr><th>--exclude-routines</th> <td>Rotinas para excluir do dump</td> <td></td> <td></td> </tr><tr><th>--exclude-tables</th> <td>Tabelas para excluir do dump</td> <td></td> <td></td> </tr><tr><th>--exclude-triggers</th> <td>Triggers para excluir do dump</td> <td></td> <td></td> </tr><tr><th>--exclude-users</th> <td>Usuários a serem excluídos do dump</td> <td></td> <td></td> </tr><tr><th>--insert-extended</th> <td>Use a sintaxe de inserção de várias linhas</td> <td></td> <td></td> </tr><tr><th>--get-server-public-key</th> <td>Solicitar chave pública RSA do servidor</td> <td></td> <td></td> </tr><tr><th>--help</th> <td>Exibir mensagem de ajuda e sair</td> <td></td> <td></td> </tr><tr><th>--hex-blob</th> <td>Expor colunas binárias usando notação hexadecimal</td> <td></td> <td></td> </tr><tr><th>--host</th> <td>Anfitrião no qual o servidor MySQL está localizado</td> <td></td> <td></td> </tr><tr><th>--include-databases</th> <td>Bases de dados a incluir no dump</td> <td></td> <td></td> </tr><tr><th>--include-events</th> <td>Eventos a incluir no lixo</td> <td></td> <td></td> </tr><tr><th>--include-routines</th> <td>Rotinas a serem incluídas no descarte</td> <td></td> <td></td> </tr><tr><th>--include-tables</th> <td>Tabelas a serem incluídas no dump</td> <td></td> <td></td> </tr><tr><th>--include-triggers</th> <td>Triggers para incluir no dump</td> <td></td> <td></td> </tr><tr><th>--include-users</th> <td>Usuários a serem incluídos no dump</td> <td></td> <td></td> </tr><tr><th>--inserir-ignorar</th> <td>Escreva INSERT IGNORE em vez de instruções INSERT</td> <td></td> <td></td> </tr><tr><th>--log-error-file</th> <td>Adicione avisos e erros a um arquivo nomeado</td> <td></td> <td></td> </tr><tr><th>--login-path</th> <td>Leia as opções de caminho de login a partir de .mylogin.cnf</td> <td></td> <td></td> </tr><tr><th>--max-allowed-packet</th> <td>Comprimento máximo do pacote para enviar ou receber do servidor</td> <td></td> <td></td> </tr><tr><th>--net-buffer-length</th> <td>Tamanho do buffer para comunicação TCP/IP e socket</td> <td></td> <td></td> </tr><tr><th>--no-create-db</th> <td>Não escreva declarações CREATE DATABASE</td> <td></td> <td></td> </tr><tr><th>--no-create-info</th> <td>Não escreva declarações CREATE TABLE que recriem cada tabela descarregada</td> <td></td> <td></td> </tr><tr><th>--no-defaults</th> <td>Não ler arquivos de opção</td> <td></td> <td></td> </tr><tr><th>--schemas-paralelas</th> <td>Especificar paralelismo no processamento de esquema</td> <td></td> <td></td> </tr><tr><th>--senha</th> <td>Senha para usar ao se conectar ao servidor</td> <td></td> <td></td> </tr><tr><th>--senha1</th> <td>Primeira senha de autenticação multifator a ser usada ao se conectar ao servidor</td> <td>8.0.27</td> <td></td> </tr><tr><th>--senha2</th> <td>Segunda senha de autenticação multifator a ser usada ao se conectar ao servidor</td> <td>8.0.27</td> <td></td> </tr><tr><th>--senha3</th> <td>Terceira senha de autenticação multifator a ser usada ao se conectar ao servidor</td> <td>8.0.27</td> <td></td> </tr><tr><th>--plugin-dir</th> <td>Diretório onde os plugins são instalados</td> <td></td> <td></td> </tr><tr><th>--port</th> <td>Número de porta TCP/IP para a conexão</td> <td></td> <td></td> </tr><tr><th>--print-defaults</th> <td>Opções padrão de impressão</td> <td></td> <td></td> </tr><tr><th>--protocolo</th> <td>Protocolo de transporte a ser utilizado</td> <td></td> <td></td> </tr><tr><th>--replace</th> <td>Escreva declarações REPLACE em vez de declarações INSERT</td> <td></td> <td></td> </tr><tr><th>--result-file</th> <td>Saída direta para um arquivo específico</td> <td></td> <td></td> </tr><tr><th>--rotinas</th> <td>Expor rotinas armazenadas (procedimentos e funções) de bancos de dados expostos</td> <td></td> <td></td> </tr><tr><th>--server-public-key-path</th> <td>Nome do caminho para o arquivo que contém a chave pública RSA</td> <td></td> <td></td> </tr><tr><th>--set-charset</th> <td>Adicione SET NAMES default_character_set ao output</td> <td></td> <td></td> </tr><tr><th>--set-gtid-purged</th> <td>Se adicionar SET @@GLOBAL.GTID_PURGED ao output</td> <td></td> <td></td> </tr><tr><th>--single-transaction</th> <td>Tabelas de descarte dentro de uma única transação</td> <td></td> <td></td> </tr><tr><th>--skip-definer</th> <td>Omitar as cláusulas DEFINER e SQL SECURITY das declarações CREATE de views e programas armazenados</td> <td></td> <td></td> </tr><tr><th>--skip-dump-rows</th> <td>Não descarte linhas de tabela</td> <td></td> <td></td> </tr><tr><th>--skip-generated-invisible-primary-key</th> <td>Não descarte informações sobre chaves primárias invisíveis geradas</td> <td>8.0.30</td> <td></td> </tr><tr><th>--socket</th> <td>Arquivo de soquete Unix ou tubo nomeado do Windows a ser usado</td> <td></td> <td></td> </tr><tr><th>--ssl-ca</th> <td>Arquivo que contém a lista de Autoridades de Certificação SSL confiáveis</td> <td></td> <td></td> </tr><tr><th>--ssl-capath</th> <td>Diretório que contém arquivos de certificados de Autoridade de Certificação SSL confiáveis</td> <td></td> <td></td> </tr><tr><th>--ssl-cert</th> <td>Arquivo que contém o certificado X.509</td> <td></td> <td></td> </tr><tr><th>--ssl-cipher</th> <td>Cifras permitidas para criptografia de conexão</td> <td></td> <td></td> </tr><tr><th>--ssl-crl</th> <td>Arquivo que contém listas de revogação de certificados</td> <td></td> <td></td> </tr><tr><th>--ssl-crlpath</th> <td>Diretório que contém arquivos de lista de revogação de certificados</td> <td></td> <td></td> </tr><tr><th>--ssl-fips-mode</th> <td>Se deve habilitar o modo FIPS no lado do cliente</td> <td></td> <td>8.0.34</td> </tr><tr><th>--ssl-chave</th> <td>Arquivo que contém a chave X.509</td> <td></td> <td></td> </tr><tr><th>--ssl-mode</th> <td>Estado de segurança desejado da conexão com o servidor</td> <td></td> <td></td> </tr><tr><th>--ssl-session-data</th> <td>Arquivo que contém dados da sessão SSL</td> <td>8.0.29</td> <td></td> </tr><tr><th>--ssl-session-data-continue-on-failed-reuse</th> <td>Se estabelecer conexões se a reutilização da sessão falhar</td> <td>8.0.29</td> <td></td> </tr><tr><th>--tls-ciphersuites</th> <td>Cifras TLSv1.3 permitidas para conexões criptografadas</td> <td>8.0.16</td> <td></td> </tr><tr><th>--tls-version</th> <td>Protocolos TLS permitidos para conexões criptografadas</td> <td></td> <td></td> </tr><tr><th>--triggers</th> <td>Triggers para descarte de cada tabela descartada</td> <td></td> <td></td> </tr><tr><th>--tz-utc</th> <td>Adicione SET TIME_ZONE='+00:00' ao arquivo de dump</td> <td></td> <td></td> </tr><tr><th>--user</th> <td>Nome do usuário do MySQL a ser usado ao se conectar ao servidor</td> <td></td> <td></td> </tr><tr><th>--users</th> <td>Excluir contas de usuário</td> <td></td> <td></td> </tr><tr><th>--version</th> <td>Exibir informações da versão e sair</td> <td></td> <td></td> </tr><tr><th>--watch-progress</th> <td>Indicador de progresso exibido</td> <td></td> <td></td> </tr><tr><th>--zstd-compression-level</th> <td>Nível de compressão para conexões com servidores que utilizam compressão zstd</td> <td>8.0.18</td> <td></td> </tr></tbody></table>

#### mysqlpump Descrições de Opções

- `--help`, `-?`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>

  Exiba uma mensagem de ajuda e saia.

- `--add-drop-database`

  <table summary="Propriedades para adicionar ou remover banco de dados"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--add-drop-database</code>]]</td> </tr></tbody></table>

  Escreva uma declaração `DROP DATABASE` antes de cada declaração `CREATE DATABASE`.

  Nota

  No MySQL 8.0, o esquema `mysql` é considerado um esquema do sistema que não pode ser excluído por usuários finais. Se `--add-drop-database` for usado com `--all-databases` ou com `--databases`, onde a lista de esquemas a serem descarregados inclui `mysql`, o arquivo de descarregamento contém uma declaração `` DROP DATABASE `mysql` `` que causa um erro quando o arquivo de descarregamento é carregado novamente.

  Em vez disso, para usar `--add-drop-database`, use `--databases` com uma lista de esquemas a serem descartados, onde a lista não inclui `mysql`.

- `--add-drop-table`

  <table summary="Propriedades para adicionar ou remover tabela"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--add-drop-table</code>]]</td> </tr></tbody></table>

  Escreva uma declaração `DROP TABLE` antes de cada declaração `CREATE TABLE`.

- `--add-drop-user`

  <table summary="Propriedades para adicionar ou remover usuários"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--add-drop-user</code>]]</td> </tr></tbody></table>

  Escreva uma declaração `DROP USER` antes de cada declaração `CREATE USER`.

- `--add-locks`

  <table summary="Propriedades para bloqueios adicionais"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--add-locks</code>]]</td> </tr></tbody></table>

  Cerque cada dump de tabela com as instruções `LOCK TABLES` e `UNLOCK TABLES`. Isso resulta em inserções mais rápidas quando o arquivo de dump é recarregado. Veja a Seção 10.2.5.1, “Otimizando instruções INSERT”.

  Esta opção não funciona com paralelismo porque as instruções `INSERT` de diferentes tabelas podem ser intercaladas e as instruções `UNLOCK TABLES` que seguem o final das inserções para uma tabela podem liberar os bloqueios em tabelas para as quais as inserções ainda estão em andamento.

  `--add-locks` e `--single-transaction` são mutuamente exclusivos.

- `--all-databases`, `-A`

  <table summary="Propriedades para todos os bancos de dados"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--all-databases</code>]]</td> </tr></tbody></table>

  Exclua todas as bases de dados (com certas exceções mencionadas nas restrições do mysqlpump). Esse é o comportamento padrão, a menos que outro seja especificado explicitamente.

  `--all-databases` e `--databases` são mutuamente exclusivos.

  Nota

  Consulte a descrição do `--add-drop-database` para obter informações sobre uma incompatibilidade dessa opção com o `--all-databases`.

  Antes do MySQL 8.0, as opções `--routines` e `--events` para **mysqldump** e **mysqlpump** não eram necessárias para incluir rotinas e eventos armazenados ao usar a opção `--all-databases`: o dump incluía o banco de dados do sistema `mysql`, e, portanto, também as tabelas `mysql.proc` e `mysql.event` que continham definições de rotinas e eventos armazenados. A partir do MySQL 8.0, as tabelas `mysql.event` e `mysql.proc` não são usadas. As definições dos objetos correspondentes são armazenadas em tabelas do dicionário de dados, mas essas tabelas não são incluídas no dump. Para incluir rotinas e eventos armazenados em um dump feito usando `--all-databases`, use as opções `--routines` e `--events` explicitamente.

- `--bind-address=ip_address`

  <table summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>

  Em um computador com várias interfaces de rede, use esta opção para selecionar qual interface usar para se conectar ao servidor MySQL.

- `--character-sets-dir=path`

  <table summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=dir_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>

  O diretório onde os conjuntos de caracteres são instalados. Consulte a Seção 12.15, “Configuração de Conjunto de Caracteres”.

- `--column-statistics`

  <table summary="Propriedades para estatísticas de coluna"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--column-statistics</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

  Adicione as declarações `ANALYZE TABLE` ao resultado para gerar estatísticas de histogramas para tabelas descarregadas quando o arquivo de descarregamento for carregado novamente. Esta opção está desativada por padrão porque a geração de histogramas para tabelas grandes pode levar muito tempo.

- `--complete-insert`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>0

  Escreva declarações completas `INSERT` que incluam os nomes das colunas.

- `--compress`, `-C`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>1

  Compressa todas as informações enviadas entre o cliente e o servidor, se possível. Consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.

  A partir do MySQL 8.0.18, essa opção está desatualizada. Espere que ela seja removida em uma versão futura do MySQL. Consulte Configurando a Compressão de Conexão Legado.

- `--compress-output=algorithm`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>2

  Por padrão, o **mysqlpump** não comprime a saída. Esta opção especifica a compressão da saída usando o algoritmo especificado. Os algoritmos permitidos são `LZ4` e `ZLIB`.

  Para descomprimir a saída compactada, você deve ter um utilitário apropriado. Se os comandos do sistema **lz4** e **openssl zlib** não estiverem disponíveis, as distribuições do MySQL incluem os utilitários **lz4\_decompress** e **zlib\_decompress** que podem ser usados para descomprimir a saída do **mysqlpump** que foi compactada usando as opções `--compress-output=LZ4` e `--compress-output=ZLIB`. Para mais informações, consulte a Seção 6.8.1, “lz4\_decompress — Descomprima a saída compactada do mysqlpump LZ4”, e a Seção 6.8.3, “zlib\_decompress — Descomprima a saída compactada do mysqlpump ZLIB”.

- `--compression-algorithms=value`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>3

  Os algoritmos de compressão permitidos para conexões ao servidor. Os algoritmos disponíveis são os mesmos da variável de sistema `protocol_compression_algorithms`. O valor padrão é `uncompressed`.

  Para obter mais informações, consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.

  Essa opção foi adicionada no MySQL 8.0.18.

- `--databases`, `-B`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>4

  Normalmente, o **mysqlpump** trata o argumento de nome no comando da linha como o nome do banco de dados e quaisquer nomes subsequentes como nomes de tabela. Com esta opção, ele trata todos os argumentos de nome como nomes de banco de dados. As instruções `CREATE DATABASE` são incluídas na saída antes de cada novo banco de dados.

  `--all-databases` e `--databases` são mutuamente exclusivos.

  Nota

  Consulte a descrição do `--add-drop-database` para obter informações sobre uma incompatibilidade dessa opção com o `--databases`.

- `--debug[=debug_options]`, `-# [debug_options]`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>5

  Escreva um log de depuração. Uma string típica `debug_options` é `d:t:o,file_name`. O padrão é `d:t:O,/tmp/mysqlpump.trace`.

  Esta opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são construídos usando essa opção.

- `--debug-check`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>6

  Imprima algumas informações de depuração quando o programa sair.

  Esta opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são construídos usando essa opção.

- `--debug-info`, `-T`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>7

  Imprima informações de depuração, estatísticas de uso de memória e CPU quando o programa sair.

  Esta opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são construídos usando essa opção.

- `--default-auth=plugin`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>8

  Uma dica sobre qual plugin de autenticação do lado do cliente deve ser usado. Veja a Seção 8.2.17, “Autenticação Personalizável”.

- `--default-character-set=charset_name`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>9

  Use `charset_name` como o conjunto de caracteres padrão. Veja a Seção 12.15, “Configuração do Conjunto de Caracteres”. Se nenhum conjunto de caracteres for especificado, o **mysqlpump** usa `utf8mb4`.

- `--default-parallelism=N`

  <table summary="Propriedades para adicionar ou remover banco de dados"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--add-drop-database</code>]]</td> </tr></tbody></table>0

  O número padrão de threads para cada fila de processamento paralelo. O padrão é 2.

  A opção `--parallel-schemas` também afeta o paralelismo e pode ser usada para substituir o número padrão de threads. Para mais informações, consulte o processamento paralelo do mysqlpump.

  Com `--default-parallelism=0` e sem as opções `--parallel-schemas`, o **mysqlpump** funciona como um processo de fluxo único e não cria filas.

  Com o paralelismo ativado, é possível intercalar a saída de diferentes bancos de dados.

- `--defaults-extra-file=file_name`

  <table summary="Propriedades para adicionar ou remover banco de dados"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--add-drop-database</code>]]</td> </tr></tbody></table>1

  Leia este arquivo de opção após o arquivo de opção global, mas (no Unix) antes do arquivo de opção do usuário. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se `file_name` não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--defaults-file=file_name`

  <table summary="Propriedades para adicionar ou remover banco de dados"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--add-drop-database</code>]]</td> </tr></tbody></table>2

  Use apenas o arquivo de opção fornecido. Se o arquivo não existir ou estiver inacessível, ocorrerá um erro. Se `file_name` não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

  Exceção: Mesmo com `--defaults-file`, os programas de cliente leem `.mylogin.cnf`.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--defaults-group-suffix=str`

  <table summary="Propriedades para adicionar ou remover banco de dados"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--add-drop-database</code>]]</td> </tr></tbody></table>3

  Leia não apenas os grupos de opções usuais, mas também grupos com os nomes usuais e um sufixo de `str`. Por exemplo, **mysqlpump** normalmente lê os grupos `[client]` e `[mysqlpump]`. Se esta opção for dada como `--defaults-group-suffix=_other`, **mysqlpump** também lê os grupos `[client_other]` e `[mysqlpump_other]`.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--defer-table-indexes`

  <table summary="Propriedades para adicionar ou remover banco de dados"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--add-drop-database</code>]]</td> </tr></tbody></table>4

  Na saída do dump, adiar a criação do índice para cada tabela até que suas linhas tenham sido carregadas. Isso funciona para todos os motores de armazenamento, mas para `InnoDB` aplica-se apenas para índices secundários.

  Esta opção está habilitada por padrão; use `--skip-defer-table-indexes` para desabilitá-la.

- `--events`

  <table summary="Propriedades para adicionar ou remover banco de dados"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--add-drop-database</code>]]</td> </tr></tbody></table>5

  Inclua os eventos do Gerenciador de Eventos para as bases de dados descartadas na saída. O descarte de eventos requer os privilégios `EVENT` para essas bases de dados.

  A saída gerada usando `--events` contém instruções `CREATE EVENT` para criar os eventos.

  Esta opção está habilitada por padrão; use `--skip-events` para desabilitá-la.

- `--exclude-databases=db_list`

  <table summary="Propriedades para adicionar ou remover banco de dados"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--add-drop-database</code>]]</td> </tr></tbody></table>6

  Não descarte os bancos de dados em `db_list`, que é uma lista de um ou mais nomes de bancos de dados separados por vírgula. Instâncias múltiplas desta opção são aditivas. Para mais informações, consulte Seleção de Objetos do mysqlpump.

- `--exclude-events=event_list`

  <table summary="Propriedades para adicionar ou remover banco de dados"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--add-drop-database</code>]]</td> </tr></tbody></table>7

  Não descarte os bancos de dados em `event_list`, que é uma lista de um ou mais nomes de eventos separados por vírgula. Instâncias múltiplas desta opção são aditivas. Para mais informações, consulte Seleção de Objetos do mysqlpump.

- `--exclude-routines=routine_list`

  <table summary="Propriedades para adicionar ou remover banco de dados"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--add-drop-database</code>]]</td> </tr></tbody></table>8

  Não descarte os eventos em `routine_list`, que é uma lista de um ou mais nomes de rotinas (procedimento armazenado ou função) separados por vírgula. Instâncias múltiplas desta opção são aditivas. Para mais informações, consulte Seleção de Objeto mysqlpump.

- `--exclude-tables=table_list`

  <table summary="Propriedades para adicionar ou remover banco de dados"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--add-drop-database</code>]]</td> </tr></tbody></table>9

  Não descarte as tabelas em `table_list`, que é uma lista de um ou mais nomes de tabelas separados por vírgula. Instâncias múltiplas desta opção são aditivas. Para mais informações, consulte Seleção de Objetos do mysqlpump.

- `--exclude-triggers=trigger_list`

  <table summary="Propriedades para adicionar ou remover tabela"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--add-drop-table</code>]]</td> </tr></tbody></table>0

  Não descarte os gatilhos em `trigger_list`, que é uma lista de um ou mais nomes de gatilho separados por vírgula. Instâncias múltiplas desta opção são aditivas. Para mais informações, consulte Seleção de Objeto mysqlpump.

- `--exclude-users=user_list`

  <table summary="Propriedades para adicionar ou remover tabela"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--add-drop-table</code>]]</td> </tr></tbody></table>1

  Não descarte as contas de usuário em `user_list`, que é uma lista de um ou mais nomes de contas separados por vírgula. Instâncias múltiplas desta opção são aditivas. Para mais informações, consulte Seleção de Objeto mysqlpump.

- `--extended-insert=N`

  <table summary="Propriedades para adicionar ou remover tabela"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--add-drop-table</code>]]</td> </tr></tbody></table>2

  Escreva declarações `INSERT` usando a sintaxe de várias linhas que inclui várias listas `VALUES`. Isso resulta em um arquivo de depuração menor e acelera as inserções quando o arquivo é carregado novamente.

  O valor da opção indica o número de linhas a serem incluídas em cada declaração `INSERT`. O padrão é 250. Um valor de 1 gera uma declaração `INSERT` por linha da tabela.

- `--get-server-public-key`

  <table summary="Propriedades para adicionar ou remover tabela"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--add-drop-table</code>]]</td> </tr></tbody></table>3

  Peça à rede o par de chaves públicas necessário para a troca de senhas com base em pares de chaves RSA. Esta opção aplica-se a clientes que se autenticam com o plugin de autenticação `caching_sha2_password`. Para esse plugin, o servidor não envia a chave pública a menos que seja solicitado. Esta opção é ignorada para contas que não se autenticam com esse plugin. Também é ignorada se a troca de senha com base em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

  Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele terá precedência sobre `--get-server-public-key`.

  Para obter informações sobre o plugin `caching_sha2_password`, consulte a Seção 8.4.1.2, “Cacheamento de Autenticação Conectada a SHA-2”.

- `--hex-blob`

  <table summary="Propriedades para adicionar ou remover tabela"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--add-drop-table</code>]]</td> </tr></tbody></table>4

  Arrume colunas binárias usando notação hexadecimal (por exemplo, `'abc'` se torna `0x616263`). Os tipos de dados afetados são os tipos `BINARY`, `VARBINARY`, `BLOB`, `BIT`, todos os tipos de dados espaciais e outros tipos de dados não binários quando usados com o conjunto de caracteres `binary`.

- `--host=host_name`, `-h host_name`

  <table summary="Propriedades para adicionar ou remover tabela"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--add-drop-table</code>]]</td> </tr></tbody></table>5

  Arraste os dados do servidor MySQL para o host fornecido.

- `--include-databases=db_list`

  <table summary="Propriedades para adicionar ou remover tabela"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--add-drop-table</code>]]</td> </tr></tbody></table>6

  Arrume os bancos de dados em `db_list`, que é uma lista de um ou mais nomes de bancos de dados separados por vírgula. O dump inclui todos os objetos nos bancos de dados nomeados. Instâncias múltiplas desta opção são aditivas. Para mais informações, consulte Seleção de Objetos do mysqlpump.

- `--include-events=event_list`

  <table summary="Propriedades para adicionar ou remover tabela"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--add-drop-table</code>]]</td> </tr></tbody></table>7

  Arrume os eventos em `event_list`, que é uma lista de um ou mais nomes de eventos separados por vírgula. Instâncias múltiplas desta opção são aditivas. Para mais informações, consulte Seleção de Objetos do mysqlpump.

- `--include-routines=routine_list`

  <table summary="Propriedades para adicionar ou remover tabela"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--add-drop-table</code>]]</td> </tr></tbody></table>8

  Exclua as rotinas em `routine_list`, que é uma lista de um ou mais nomes de rotinas (procedimento armazenado ou função) separados por vírgula. Instâncias múltiplas desta opção são aditivas. Para mais informações, consulte Seleção de Objeto mysqlpump.

- `--include-tables=table_list`

  <table summary="Propriedades para adicionar ou remover tabela"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--add-drop-table</code>]]</td> </tr></tbody></table>9

  Exclua as tabelas em `table_list`, que é uma lista de um ou mais nomes de tabelas separados por vírgula. Instâncias múltiplas desta opção são aditivas. Para mais informações, consulte Seleção de Objetos do mysqlpump.

- `--include-triggers=trigger_list`

  <table summary="Propriedades para adicionar ou remover usuários"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--add-drop-user</code>]]</td> </tr></tbody></table>0

  Arrume os gatilhos em `trigger_list`, que é uma lista com um ou mais nomes de gatilho separados por vírgula. Instâncias múltiplas desta opção são aditivas. Para mais informações, consulte Seleção de Objeto mysqlpump.

- `--include-users=user_list`

  <table summary="Propriedades para adicionar ou remover usuários"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--add-drop-user</code>]]</td> </tr></tbody></table>1

  Exclua as contas de usuário em `user_list`, que é uma lista de um ou mais nomes de usuário separados por vírgula. Instâncias múltiplas desta opção são aditivas. Para mais informações, consulte Seleção de Objeto mysqlpump.

- `--insert-ignore`

  <table summary="Propriedades para adicionar ou remover usuários"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--add-drop-user</code>]]</td> </tr></tbody></table>2

  Escreva declarações `INSERT IGNORE` em vez de declarações `INSERT`.

- `--log-error-file=file_name`

  <table summary="Propriedades para adicionar ou remover usuários"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--add-drop-user</code>]]</td> </tr></tbody></table>3

  Registre avisos e erros anexando-os ao arquivo nomeado. Se esta opção não for fornecida, o **mysqlpump** escreve avisos e erros na saída padrão de erro.

- `--login-path=name`

  <table summary="Propriedades para adicionar ou remover usuários"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--add-drop-user</code>]]</td> </tr></tbody></table>4

  Leia as opções do caminho de login nomeado no arquivo de caminho de login `.mylogin.cnf`. Um “caminho de login” é um grupo de opções que contém opções que especificam para qual servidor MySQL se conectar e qual conta autenticar. Para criar ou modificar um arquivo de caminho de login, use o utilitário **mysql\_config\_editor**. Veja a Seção 6.6.7, “mysql\_config\_editor — Utilitário de Configuração MySQL”.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--max-allowed-packet=N`

  <table summary="Propriedades para adicionar ou remover usuários"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--add-drop-user</code>]]</td> </tr></tbody></table>5

  O tamanho máximo do buffer para a comunicação cliente/servidor. O padrão é de 24 MB, e o máximo é de 1 GB.

- `--net-buffer-length=N`

  <table summary="Propriedades para adicionar ou remover usuários"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--add-drop-user</code>]]</td> </tr></tbody></table>6

  O tamanho inicial do buffer para a comunicação cliente/servidor. Ao criar instruções `INSERT` de várias linhas (como com a opção `--extended-insert`), o **mysqlpump** cria linhas com até `N` bytes de comprimento. Se você usar essa opção para aumentar o valor, certifique-se de que a variável de sistema do servidor MySQL `net_buffer_length` tenha um valor pelo menos desse tamanho.

- `--no-create-db`

  <table summary="Propriedades para adicionar ou remover usuários"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--add-drop-user</code>]]</td> </tr></tbody></table>7

  Suprima quaisquer declarações `CREATE DATABASE` que possam ser incluídas no resultado caso contrário.

- `--no-create-info`, `-t`

  <table summary="Propriedades para adicionar ou remover usuários"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--add-drop-user</code>]]</td> </tr></tbody></table>8

  Não escreva declarações `CREATE TABLE` que criem cada tabela descarregada.

- `--no-defaults`

  <table summary="Propriedades para adicionar ou remover usuários"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--add-drop-user</code>]]</td> </tr></tbody></table>9

  Não leia nenhum arquivo de opções. Se o início do programa falhar devido à leitura de opções desconhecidas de um arquivo de opções, `--no-defaults` pode ser usado para impedir que sejam lidas.

  A exceção é que o arquivo `.mylogin.cnf` é lido em todos os casos, se existir. Isso permite que as senhas sejam especificadas de uma maneira mais segura do que na linha de comando, mesmo quando o `--no-defaults` é usado. Para criar o `.mylogin.cnf`, use o utilitário **mysql\_config\_editor**. Veja a Seção 6.6.7, “mysql\_config\_editor — Utilitário de Configuração do MySQL”.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--parallel-schemas=[N:]db_list`

  <table summary="Propriedades para bloqueios adicionais"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--add-locks</code>]]</td> </tr></tbody></table>0

  Crie uma fila para processar os bancos de dados em `db_list`, que é uma lista de um ou mais nomes de bancos de dados separados por vírgula. Se `N` for fornecido, a fila usa threads `N`. Se `N` não for fornecido, a opção `--default-parallelism` determina o número de threads da fila.

  Várias instâncias desta opção criam várias filas. O **mysqlpump** também cria uma fila padrão para uso com bancos de dados que não estejam nomeados em nenhuma opção `--parallel-schemas` e para dumper de definições de usuários, se as opções de comando as selecionarem. Para obter mais informações, consulte o processamento paralelo do mysqlpump.

- `--password[=password]`, `-p[password]`

  <table summary="Propriedades para bloqueios adicionais"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--add-locks</code>]]</td> </tr></tbody></table>1

  A senha da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecido, o **mysqlpump** solicitará uma senha. Se for fornecida, não deve haver **espaço** entre `--password=` ou `-p` e a senha que o segue. Se nenhuma opção de senha for especificada, o padrão é não enviar a senha.

  Especificar uma senha na linha de comando deve ser considerado inseguro. Para evitar fornecer a senha na linha de comando, use um arquivo de opção. Consulte a Seção 8.1.2.1, "Diretrizes para o Usuário Final sobre Segurança de Senhas".

  Para especificar explicitamente que não há senha e que o **mysqlpump** não deve solicitar uma senha, use a opção `--skip-password`.

- `--password1[=pass_val]`

  A senha para o fator de autenticação multifator 1 da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecido, o **mysqlpump** solicitará uma senha. Se for fornecida, não deve haver **espaço** entre `--password1=` e a senha que a segue. Se nenhuma opção de senha for especificada, o padrão é não enviar nenhuma senha.

  Especificar uma senha na linha de comando deve ser considerado inseguro. Para evitar fornecer a senha na linha de comando, use um arquivo de opção. Consulte a Seção 8.1.2.1, "Diretrizes para o Usuário Final sobre Segurança de Senhas".

  Para especificar explicitamente que não há senha e que o **mysqlpump** não deve solicitar uma senha, use a opção `--skip-password1`.

  `--password1` e `--password` são sinônimos, assim como `--skip-password1` e `--skip-password`.

- `--password2[=pass_val]`

  A senha para o fator de autenticação multifator 2 da conta MySQL usada para se conectar ao servidor. A semântica desta opção é semelhante à semântica do `--password1`; consulte a descrição dessa opção para obter detalhes.

- `--password3[=pass_val]`

  A senha para o fator de autenticação multifator 3 da conta MySQL usada para se conectar ao servidor. A semântica desta opção é semelhante à semântica do `--password1`; consulte a descrição dessa opção para obter detalhes.

- `--plugin-dir=dir_name`

  <table summary="Propriedades para bloqueios adicionais"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--add-locks</code>]]</td> </tr></tbody></table>2

  O diretório onde procurar por plugins. Especifique esta opção se a opção `--default-auth` for usada para especificar um plugin de autenticação, mas o **mysqlpump** não encontrá-lo. Veja a Seção 8.2.17, “Autenticação Personalizável”.

- `--port=port_num`, `-P port_num`

  <table summary="Propriedades para bloqueios adicionais"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--add-locks</code>]]</td> </tr></tbody></table>3

  Para conexões TCP/IP, o número de porta a ser usado.

- `--print-defaults`

  <table summary="Propriedades para bloqueios adicionais"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--add-locks</code>]]</td> </tr></tbody></table>4

  Imprima o nome do programa e todas as opções que ele obtém a partir de arquivos de opção.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table summary="Propriedades para bloqueios adicionais"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--add-locks</code>]]</td> </tr></tbody></table>5

  O protocolo de transporte a ser usado para se conectar ao servidor. É útil quando os outros parâmetros de conexão normalmente resultam no uso de um protocolo diferente do que você deseja. Para obter detalhes sobre os valores permitidos, consulte a Seção 6.2.7, “Protocolos de Transporte de Conexão”.

- `--replace`

  <table summary="Propriedades para bloqueios adicionais"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--add-locks</code>]]</td> </tr></tbody></table>6

  Escreva declarações `REPLACE` em vez de declarações `INSERT`.

- `--result-file=file_name`

  <table summary="Propriedades para bloqueios adicionais"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--add-locks</code>]]</td> </tr></tbody></table>7

  Saída direta para o arquivo nomeado. O arquivo de resultado é criado e seus conteúdos anteriores são sobrescritos, mesmo que um erro ocorra durante a geração do dump.

  Essa opção deve ser usada no Windows para evitar que os caracteres de nova linha `\n` sejam convertidos em sequências de retorno de carro/nova linha `\r\n`.

- `--routines`

  <table summary="Propriedades para bloqueios adicionais"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--add-locks</code>]]</td> </tr></tbody></table>8

  Inclua rotinas armazenadas (procedimentos e funções) para os bancos de dados descartados na saída. Esta opção requer o privilégio global `SELECT`.

  A saída gerada usando `--routines` contém as instruções `CREATE PROCEDURE` e `CREATE FUNCTION` para criar as rotinas.

  Esta opção está habilitada por padrão; use `--skip-routines` para desabilitá-la.

- `--server-public-key-path=file_name`

  <table summary="Propriedades para bloqueios adicionais"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--add-locks</code>]]</td> </tr></tbody></table>9

  O nome do caminho de um arquivo no formato PEM que contém uma cópia do lado do cliente da chave pública necessária pelo servidor para a troca de senhas com par de chaves RSA. Esta opção aplica-se a clientes que se autenticam com o plugin de autenticação `sha256_password` ou `caching_sha2_password`. Esta opção é ignorada para contas que não se autenticam com um desses plugins. Também é ignorada se a troca de senha com base em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

  Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele terá precedência sobre `--get-server-public-key`.

  Para `sha256_password`, esta opção só se aplica se o MySQL foi construído usando o OpenSSL.

  Para obter informações sobre os plugins `sha256_password` e `caching_sha2_password`, consulte a Seção 8.4.1.3, “Autenticação Conectada a SHA-256”, e a Seção 8.4.1.2, “Cache de Autenticação Conectada a SHA-2”.

- `--set-charset`

  <table summary="Propriedades para todos os bancos de dados"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--all-databases</code>]]</td> </tr></tbody></table>0

  Escreva `SET NAMES default_character_set` na saída.

  Esta opção está habilitada por padrão. Para desabilitá-la e suprimir a declaração `SET NAMES`, use `--skip-set-charset`.

- `--set-gtid-purged=value`

  <table summary="Propriedades para todos os bancos de dados"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--all-databases</code>]]</td> </tr></tbody></table>1

  Essa opção permite o controle sobre as informações da ID global de transação (GTID) escritas no arquivo de depuração, indicando se deve adicionar uma declaração `SET @@GLOBAL.gtid_purged` à saída. Essa opção também pode causar a escrita de uma declaração na saída que desabilita o registro binário enquanto o arquivo de depuração está sendo recarregado.

  A tabela a seguir mostra os valores de opção permitidos. O valor padrão é `AUTO`.

  <table summary="Propriedades para todos os bancos de dados"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--all-databases</code>]]</td> </tr></tbody></table>2

  A opção `--set-gtid-purged` tem o seguinte efeito no registro binário quando o arquivo de dump é recarregado:

  - `--set-gtid-purged=OFF`: `SET @@SESSION.SQL_LOG_BIN=0;` não é adicionado ao resultado.

  - `--set-gtid-purged=ON`: `SET @@SESSION.SQL_LOG_BIN=0;` é adicionado ao resultado.

  - `--set-gtid-purged=AUTO`: `SET @@SESSION.SQL_LOG_BIN=0;` é adicionado ao resultado se os GTIDs estiverem habilitados no servidor que você está fazendo backup (ou seja, se `AUTO` for avaliado como `ON`).

- `--single-transaction`

  <table summary="Propriedades para todos os bancos de dados"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--all-databases</code>]]</td> </tr></tbody></table>3

  Essa opção define o modo de isolamento de transação para `REPEATABLE READ` e envia uma instrução SQL `START TRANSACTION` para o servidor antes de drenar os dados. Ela é útil apenas com tabelas transacionais, como `InnoDB`, porque, nesse caso, ela drenará o estado consistente do banco de dados no momento em que `START TRANSACTION` foi emitido, sem bloquear nenhuma aplicação.

  Ao usar essa opção, você deve ter em mente que apenas as tabelas `InnoDB` são descarregadas em um estado consistente. Por exemplo, quaisquer tabelas `MyISAM` ou `MEMORY` descarregadas enquanto estiver usando essa opção ainda podem mudar de estado.

  Enquanto um dump `--single-transaction` estiver em processo, para garantir um arquivo de dump válido (conteúdo correto da tabela e coordenadas do log binário), nenhuma outra conexão deve usar as seguintes instruções: `ALTER TABLE`, `CREATE TABLE`, `DROP TABLE`, `RENAME TABLE`, `TRUNCATE TABLE`. Uma leitura consistente não é isolada dessas instruções, portanto, o uso delas em uma tabela a ser dumpada pode causar o `SELECT` que é realizado pelo **mysqlpump** para recuperar o conteúdo da tabela a obter conteúdos incorretos ou falhar.

  `--add-locks` e `--single-transaction` são mutuamente exclusivos.

- `--skip-definer`

  <table summary="Propriedades para todos os bancos de dados"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--all-databases</code>]]</td> </tr></tbody></table>4

  Omit as cláusulas `DEFINER` e `SQL SECURITY` das declarações `CREATE` para visualizações e programas armazenados. O arquivo de dump, ao ser carregado novamente, cria objetos que usam os valores padrão de `DEFINER` e `SQL SECURITY`. Veja a Seção 27.6, “Controle de Acesso a Objetos Armazenados”.

- `--skip-dump-rows`, `-d`

  <table summary="Propriedades para todos os bancos de dados"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--all-databases</code>]]</td> </tr></tbody></table>5

  Não descarte linhas de tabela.

- `--skip-generated-invisible-primary-key`

  <table summary="Propriedades para todos os bancos de dados"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--all-databases</code>]]</td> </tr></tbody></table>6

  Esta opção está disponível a partir do MySQL 8.0.30 e exclui as chaves primárias invisíveis geradas (GIPKs) do dump. Consulte a Seção 15.1.20.11, “Chaves Primárias Invisíveis Geradas”, para obter mais informações sobre as GIPKs e o modo GIPK.

- `--socket=path`, `-S path`

  <table summary="Propriedades para todos os bancos de dados"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--all-databases</code>]]</td> </tr></tbody></table>7

  Para conexões ao `localhost`, o arquivo de socket Unix a ser usado ou, no Windows, o nome do tubo nomeado a ser usado.

  No Windows, essa opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões de canal nomeado. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.

- `--ssl*`

  As opções que começam com `--ssl` especificam se você deseja se conectar ao servidor usando criptografia e indicam onde encontrar as chaves e certificados SSL. Consulte Opções de comando para conexões criptografadas.

- `--ssl-fips-mode={OFF|ON|STRICT}`

  <table summary="Propriedades para todos os bancos de dados"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--all-databases</code>]]</td> </tr></tbody></table>8

  Controla se o modo FIPS deve ser habilitado no lado do cliente. A opção `--ssl-fips-mode` difere de outras opções `--ssl-xxx` porque não é usada para estabelecer conexões criptografadas, mas sim para determinar quais operações criptográficas devem ser permitidas. Veja a Seção 8.8, “Suporte FIPS”.

  Estes valores `--ssl-fips-mode` são permitidos:

  - `OFF`: Desative o modo FIPS.
  - `ON`: Habilitar o modo FIPS.
  - `STRICT`: Habilitar o modo FIPS "estricto".

  Nota

  Se o Módulo de Objeto FIPS OpenSSL não estiver disponível, o único valor permitido para `--ssl-fips-mode` é `OFF`. Nesse caso, definir `--ssl-fips-mode` para `ON` ou `STRICT` faz com que o cliente emita um aviso na inicialização e opere no modo não FIPS.

  A partir do MySQL 8.0.34, essa opção está desatualizada. Espera-se que ela seja removida em uma versão futura do MySQL.

- `--tls-ciphersuites=ciphersuite_list`

  <table summary="Propriedades para todos os bancos de dados"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--all-databases</code>]]</td> </tr></tbody></table>9

  As sequências de cifra permitidas para conexões criptografadas que utilizam TLSv1.3. O valor é uma lista de um ou mais nomes de sequências de cifra separados por vírgula. As sequências de cifra que podem ser nomeadas para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para obter detalhes, consulte a Seção 8.3.2, “Protocolos e cifra de conexão criptografada TLS”.

  Essa opção foi adicionada no MySQL 8.0.16.

- `--tls-version=protocol_list`

  <table summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>0

  Os protocolos TLS permitidos para conexões criptografadas. O valor é uma lista de um ou mais nomes de protocolos separados por vírgula. Os protocolos que podem ser nomeados para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para obter detalhes, consulte a Seção 8.3.2, “Protocolos e cifra TLS de conexão criptografada”.

- `--triggers`

  <table summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>1

  Inclua os gatilhos para cada tabela descarregada na saída.

  Esta opção está habilitada por padrão; use `--skip-triggers` para desabilitá-la.

- `--tz-utc`

  <table summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>2

  Essa opção permite que as colunas `TIMESTAMP` sejam descarregadas e recarregadas entre servidores em diferentes fusos horários. O **mysqlpump** define seu fuso horário de conexão como UTC e adiciona `SET TIME_ZONE='+00:00'` ao arquivo de dump. Sem essa opção, as colunas `TIMESTAMP` são descarregadas e recarregadas nos fusos horários locais dos servidores de origem e destino, o que pode causar alterações nos valores se os servidores estiverem em fusos horários diferentes. O `--tz-utc` também protege contra alterações devido ao horário de verão.

  Esta opção está habilitada por padrão; use `--skip-tz-utc` para desabilitá-la.

- `--user=user_name`, `-u user_name`

  <table summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>3

  O nome de usuário da conta MySQL a ser usado para se conectar ao servidor.

  Se você estiver usando o plugin `Rewriter` com o MySQL 8.0.31 ou posterior, você deve conceder este usuário o privilégio `SKIP_QUERY_REWRITE`.

- `--users`

  <table summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>4

  Descarte as contas de usuários como definições lógicas na forma de declarações `CREATE USER` e `GRANT`.

  As definições do usuário são armazenadas nas tabelas de concessão no banco de dados do sistema `mysql`. Por padrão, o **mysqlpump** não inclui as tabelas de concessão nos backups do banco de dados `mysql`. Para fazer o backup do conteúdo das tabelas de concessão como definições lógicas, use a opção `--users` e suprima todos os backups de banco de dados:

  ```
  mysqlpump --exclude-databases=% --users
  ```

- `--version`, `-V`

  <table summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>5

  Exibir informações da versão e sair.

- `--watch-progress`

  <table summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>6

  Exiba periodicamente um indicador de progresso que forneça informações sobre o número total de tabelas, linhas e outros objetos concluídos.

  Esta opção está habilitada por padrão; use `--skip-watch-progress` para desabilitá-la.

- `--zstd-compression-level=level`

  <table summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>7

  O nível de compressão a ser usado para conexões com o servidor que utilizam o algoritmo de compressão `zstd`. Os níveis permitidos variam de 1 a 22, com valores maiores indicando níveis crescentes de compressão. O nível de compressão padrão `zstd` é 3. A configuração do nível de compressão não afeta conexões que não utilizam a compressão `zstd`.

  Para obter mais informações, consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.

  Essa opção foi adicionada no MySQL 8.0.18.

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

```
--exclude-databases=test,world
--include-tables=customer,invoice
```

Caracteres especiais são permitidos nos nomes dos objetos:

- `%` corresponde a qualquer sequência de zero ou mais caracteres.

- `_` corresponde a qualquer caractere único.

Por exemplo, `--include-tables=t%,__tmp` corresponde a todos os nomes de tabelas que começam com `t` e a todos os nomes de tabelas de cinco caracteres que terminam com `tmp`.

Para os usuários, um nome especificado sem uma parte de host é interpretado com um host implícito de `%`. Por exemplo, `u1` e `u1@%` são equivalentes. Esta é a mesma equivalência que se aplica no MySQL em geral (veja a Seção 8.2.4, “Especificação de Nomes de Conta”).

As opções de inclusão e exclusão interagem da seguinte forma:

- Por padrão, sem opções de inclusão ou exclusão, o **mysqlpump** exibe todos os bancos de dados (com certas exceções mencionadas nas restrições do mysqlpump).

- Se as opções de inclusão forem fornecidas na ausência de opções de exclusão, apenas os objetos nomeados como incluídos serão descarregados.

- Se as opções de exclusão forem fornecidas na ausência de opções de inclusão, todos os objetos serão descartados, exceto aqueles nomeados como excluídos.

- Se as opções de inclusão e exclusão forem fornecidas, todos os objetos nomeados como excluídos e não nomeados como incluídos não serão descarregados. Todos os outros objetos serão descarregados.

Se várias bases de dados estão sendo descarregadas, é possível nomear tabelas, gatilhos e rotinas em uma base de dados específica qualificando os nomes dos objetos com o nome da base de dados. O comando a seguir descarrega as bases de dados `db1` e `db2`, mas exclui as tabelas `db1.t1` e `db2.t2`:

```
mysqlpump --include-databases=db1,db2 --exclude-tables=db1.t1,db2.t2
```

As seguintes opções fornecem maneiras alternativas de especificar quais bancos de dados devem ser descarregados:

- A opção `--all-databases` descarrega todos os bancos de dados (com certas exceções mencionadas nas restrições do mysqlpump). É equivalente a não especificar nenhuma opção de objeto (a ação padrão do **mysqlpump** é descarregar tudo).

  `--include-databases=%` é semelhante a `--all-databases`, mas seleciona todos os bancos de dados para dumping, mesmo aqueles que são exceções para `--all-databases`.

- A opção `--databases` faz com que o **mysqlpump** trate todos os argumentos de nome como nomes de bancos a serem excluídos. É equivalente a uma opção `--include-databases` que nomeia os mesmos bancos.

#### mysqlpump Processamento Paralelo

O **mysqlpump** pode usar o paralelismo para alcançar o processamento concorrente. Você pode selecionar a concorrência entre bancos de dados (para drenar vários bancos de dados simultaneamente) e dentro dos bancos de dados (para drenar vários objetos de um dado banco de dados simultaneamente).

Por padrão, o **mysqlpump** configura uma fila com dois threads. Você pode criar filas adicionais e controlar o número de threads atribuídos a cada uma delas, incluindo a fila padrão:

- `--default-parallelism=N` especifica o número padrão de threads usado para cada fila. Na ausência dessa opção, `N` é 2.

  A fila padrão sempre usa o número padrão de threads. As filas adicionais usam o número padrão de threads, a menos que você especifique o contrário.

- `--parallel-schemas=[N:]db_list` configura uma fila de processamento para drenar os bancos de dados mencionados em `db_list` e, opcionalmente, especifica quantos threads a fila usa. `db_list` é uma lista de nomes de bancos de dados separados por vírgula. Se o argumento da opção começar com `N:`, a fila usa `N` threads. Caso contrário, a opção `--default-parallelism` determina o número de threads da fila.

  Várias instâncias da opção `--parallel-schemas` criam várias filas.

  Os nomes na lista do banco de dados podem conter os mesmos caracteres de substituição `%` e `_` permitidos para opções de filtragem (veja Seleção de Objetos do mysqlpump).

O **mysqlpump** usa a fila padrão para processar quaisquer bancos de dados que não sejam explicitamente nomeados com a opção `--parallel-schemas` e para descartar definições de usuários, se as opções de comando as selecionarem.

Em geral, com múltiplas filas, o **mysqlpump** utiliza o paralelismo entre os conjuntos de bancos de dados processados pelas filas para drenar múltiplos bancos de dados simultaneamente. Para uma fila que utiliza múltiplos threads, o **mysqlpump** utiliza o paralelismo dentro dos bancos de dados para drenar múltiplos objetos de um banco de dados específico simultaneamente. Pode ocorrer exceções; por exemplo, o **mysqlpump** pode bloquear as filas enquanto obtém listas de objetos dos servidores nos bancos de dados.

Com o paralelismo ativado, é possível intercalar a saída de diferentes bancos de dados. Por exemplo, as instruções `INSERT` de várias tabelas descarregadas em paralelo podem ser intercaladas; as instruções não são escritas em uma ordem específica. Isso não afeta a recarga, pois as instruções de saída qualificam os nomes dos objetos com os nomes dos bancos de dados ou são precedidas por instruções `USE` conforme necessário.

A granularidade para paralelismo é um único objeto de banco de dados. Por exemplo, uma única tabela não pode ser descarregada em paralelo usando múltiplos threads.

Exemplos:

```
mysqlpump --parallel-schemas=db1,db2 --parallel-schemas=db3
```

O **mysqlpump** configura uma fila para processar `db1` e `db2`, outra fila para processar `db3`, e uma fila padrão para processar todos os outros bancos de dados. Todas as filas usam dois threads.

```
mysqlpump --parallel-schemas=db1,db2 --parallel-schemas=db3
          --default-parallelism=4
```

Isto é o mesmo que o exemplo anterior, exceto que todas as filas usam quatro threads.

```
mysqlpump --parallel-schemas=5:db1,db2 --parallel-schemas=3:db3
```

A fila para `db1` e `db2` usa cinco threads, a fila para `db3` usa três threads, e a fila padrão usa o padrão de duas threads.

Como caso especial, com `--default-parallelism=0` e sem opções `--parallel-schemas`, o **mysqlpump** funciona como um processo de fluxo único e não cria filas.

#### mysqlpump Restrições

O **mysqlpump** não exclui o esquema `performance_schema`, `ndbinfo` ou `sys` por padrão. Para excluí-los, nomeie-os explicitamente na linha de comando. Você também pode nomeá-los com as opções `--databases` ou `--include-databases`.

O **mysqlpump** não dumperá o esquema `INFORMATION_SCHEMA`.

O **mysqlpump** não descarrega as instruções `InnoDB` `CREATE TABLESPACE`.

O **mysqlpump** exibe as contas de usuário em formato lógico usando as instruções `CREATE USER` e `GRANT` (por exemplo, quando você usa a opção `--include-users` ou `--users`). Por essa razão, os backups do banco de dados do sistema `mysql` não incluem, por padrão, as tabelas de concessão que contêm definições de usuário: `user`, `db`, `tables_priv`, `columns_priv`, `procs_priv` ou `proxies_priv`. Para fazer o backup de qualquer uma das tabelas de concessão, nomeie o banco de dados `mysql` seguido dos nomes das tabelas:

```
mysqlpump mysql user db ...
```
