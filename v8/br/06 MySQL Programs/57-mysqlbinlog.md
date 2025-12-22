### 6.6.9 mysqlbinlog  Utilitário para processamento de arquivos de log binário

O log binário do servidor consiste em arquivos contendo "eventos" que descrevem modificações no conteúdo do banco de dados. O servidor escreve esses arquivos em formato binário. Para exibir seu conteúdo em formato de texto, use o utilitário **mysqlbinlog**. Você também pode usar **mysqlbinlog** para exibir o conteúdo de arquivos de log de retransmissão escritos por um servidor de réplica em uma configuração de réplica porque os logs de retransmissão têm o mesmo formato que os logs binários. O log binário e o log de retransmissão são discutidos mais adiante na Seção 7.4.4, The Binary Log, e na Seção 19.2.4, Relay Log and Replication Metadata Repositories.

Invocar o **mysqlbinlog** assim:

```
mysqlbinlog [options] log_file ...
```

Por exemplo, para exibir o conteúdo do arquivo de log binário chamado `binlog.000003`, use este comando:

```
mysqlbinlog binlog.000003
```

A saída inclui eventos contidos em `binlog.000003`. Para registro baseado em instruções, as informações de evento incluem a instrução SQL, o ID do servidor em que foi executado, o carimbo de tempo em que a instrução foi executada, quanto tempo levou, e assim por diante. Para registro baseado em linhas, o evento indica uma mudança de linha em vez de uma instrução SQL. Veja Seção 19.2.1, Formatos de replicação, para informações sobre modos de registro.

Os eventos são precedidos por comentários de cabeçalho que fornecem informações adicionais.

```
# at 141
#100309  9:28:36 server id 123  end_log_pos 245
  Query thread_id=3350  exec_time=11  error_code=0
```

Na primeira linha, o número seguinte a `at` indica o deslocamento do arquivo, ou posição inicial, do evento no arquivo de log binário.

A segunda linha começa com uma data e hora indicando quando a instrução começou no servidor onde o evento se originou. Para a replicação, este carimbo de tempo é propagado para os servidores de réplica. `server id` é o valor `server_id` do servidor onde o evento se originou. `end_log_pos` indica onde o próximo evento começa (ou seja, é a posição final do evento atual + 1). `thread_id` indica qual thread executou o evento. `exec_time` é o tempo gasto executando o evento, em um servidor de fonte de replicação. Em uma réplica, é a diferença do tempo de execução final na réplica menos o tempo de execução inicial na fonte. A diferença serve como um indicador de quanto a replicação está atrasada. \[\[CO`error_code`]] indica o evento resultante da execução. Zero significa que nenhum erro ocorreu.

::: info Note

Ao usar grupos de eventos, os deslocamentos de arquivos de eventos podem ser agrupados e os comentários de eventos podem ser agrupados.

:::

A saída de **mysqlbinlog** pode ser re-executada (por exemplo, usando-a como entrada para `mysql`) para refazer as instruções no log. Isso é útil para operações de recuperação após uma saída inesperada do servidor. Para outros exemplos de uso, veja a discussão mais adiante nesta seção e na Seção 9.5, "Recuperação de Ponto em Tempo (Incremental) "). Para executar as instruções de uso interno `BINLOG` usadas por **mysqlbinlog**, o usuário requer o privilégio `BINLOG_ADMIN` (ou o privilégio depreciado `SUPER`), ou o privilégio `REPLICATION_APPLIER` mais os privilégios apropriados para executar cada evento no log.

Você pode usar **mysqlbinlog** para ler arquivos de log binários diretamente e aplicá-los ao servidor MySQL local. Você também pode ler logs binários de um servidor remoto usando a opção `--read-from-remote-server`. Para ler logs binários remotos, as opções de parâmetros de conexão podem ser dadas para indicar como se conectar ao servidor. Estas opções são `--host`, `--password`, `--port`, `--protocol`, `--socket`, e `--user`.

Quando os arquivos de log binários foram criptografados, **mysqlbinlog** não pode lê-los diretamente, mas pode lê-los do servidor usando a opção `--read-from-remote-server`. Os arquivos de log binários são criptografados quando a variável de sistema `binlog_encryption` do servidor é definida como `ON`. A instrução `SHOW BINARY LOGS` mostra se um determinado arquivo de log binário é criptografado ou não criptografado. Os arquivos de log binários criptografados e não criptografados também podem ser distinguidos usando o número mágico no início do cabeçalho do arquivo para arquivos de log criptografados (\[\[PH\_CODE\_DE4]]), que difere do usado para arquivos de log não criptografados (\[\[PH\_CODE\_CODE5]]). \*\* Observe que o Logmysqlbinlog\*\* retorna um erro se você tentar ler um arquivo de log binário criptografado diretamente, mas as versões mais

Quando as cargas úteis de transação de log binário foram compactadas, **mysqlbinlog** automaticamente descompacta e decodifica as cargas úteis de transação e as imprime como se fossem eventos não compactados. Quando `binlog_transaction_compression` é definido como `ON`, as cargas úteis de transação são compactadas e, em seguida, escritas no arquivo de log binário do servidor como um único evento (a `Transaction_payload_event`). Com a `--verbose` opção, **mysqlbinlog** adiciona comentários indicando o algoritmo de compressão usado, o tamanho da carga útil comprimida que foi originalmente recebido, e o tamanho da carga útil resultante após a descompressão.

::: info Note

A posição final (`end_log_pos`) que **mysqlbinlog** declara para um evento individual que fazia parte de uma carga útil de transação comprimida é a mesma que a posição final da carga útil comprimida original.

A própria compressão de conexão do mysqlbinlog faz menos se as cargas de transação já estiverem comprimidas, mas ainda opera em transações e cabeçalhos não comprimidos.

:::

Para obter mais informações sobre a compressão de transações de log binário, ver Seção 7.4.4.5, "Compressão de transações de log binário".

Ao executar **mysqlbinlog** contra um grande log binário, tenha cuidado para que o sistema de arquivos tenha espaço suficiente para os arquivos resultantes. Para configurar o diretório que **mysqlbinlog** usa para arquivos temporários, use a variável de ambiente `TMPDIR`.

**mysqlbinlog** define o valor de `pseudo_replica_mode` como verdadeiro antes de executar qualquer instrução SQL. Esta variável do sistema afeta o manuseio de transações XA, o timestamp de atraso de replicação `original_commit_timestamp` e a variável do sistema `original_server_version`, e modos SQL não suportados.

**mysqlbinlog** suporta as seguintes opções, que podem ser especificadas na linha de comando ou nos grupos `[mysqlbinlog]` e `[client]` de um arquivo de opções. Para informações sobre arquivos de opções usados por programas MySQL, consulte a Seção 6.2.2.2, Using Option Files.

**Tabela 6.20 Opções do mysqlbinlog**

<table><col style="width: 35%"/><col style="width: 64%"/><thead><tr><th>Nome da opção</th> <th>Descrição</th> </tr></thead><tbody><tr><td>--base64-output</td> <td>Imprimir entradas de log binário usando codificação base-64</td> </tr><tr><td>- Endereço de ligação</td> <td>Usar interface de rede especificada para se conectar ao MySQL Server</td> </tr><tr><td>--binlog-row-event-max-size</td> <td>Dimensão máxima do evento do log binário</td> </tr><tr><td>--conjuntos de caracteres-dir</td> <td>Diretório onde são instalados conjuntos de caracteres</td> </tr><tr><td>--comprimir</td> <td>Comprimir todas as informações enviadas entre o cliente e o servidor</td> </tr><tr><td>Algoritmos de compressão</td> <td>Algoritmos de compressão permitidos para ligações ao servidor</td> </tr><tr><td>--connection-server-id</td> <td>Utilizado para testes e depuração. Ver texto para valores padrão aplicáveis e outros detalhes</td> </tr><tr><td>--base de dados</td> <td>Lista de entradas apenas para esta base de dados</td> </tr><tr><td>--debug</td> <td>Registro de depuração</td> </tr><tr><td>--debug-check</td> <td>Imprimir informações de depuração quando o programa sair</td> </tr><tr><td>--debug-info</td> <td>Imprimir informações de depuração, memória e estatísticas da CPU quando o programa sai</td> </tr><tr><td>--default-auth</td> <td>Plugin de autenticação a usar</td> </tr><tr><td>--defaults-extra-file</td> <td>Leia arquivo de opção nomeado além dos arquivos de opção habituais</td> </tr><tr><td>--defaults-file</td> <td>Arquivo de opções nomeadas somente para leitura</td> </tr><tr><td>--defaults-group-suffix</td> <td>Valor do sufixo do grupo de opções</td> </tr><tr><td>--disable-log-bin</td> <td>Desativar o registo binário</td> </tr><tr><td>--excluir-gtids</td> <td>Não mostrar nenhum dos grupos no conjunto GTID fornecido</td> </tr><tr><td>- Força-se-aberta</td> <td>Ler arquivos de registo binários mesmo que abertos ou não fechados corretamente</td> </tr><tr><td>- Forçar-a-ler</td> <td>Se mysqlbinlog lê um evento de log binário que não reconhece, ele imprime um aviso</td> </tr><tr><td>--get-server-public-key</td> <td>Solicitar a chave pública RSA do servidor</td> </tr><tr><td>- Ajuda .</td> <td>Mostrar mensagem de ajuda e sair</td> </tr><tr><td>- Hexdump.</td> <td>Mostrar uma descarga hexadecimal do registo de comentários</td> </tr><tr><td>- Hospedeiro</td> <td>Host em que o servidor MySQL está localizado</td> </tr><tr><td>- Idempotente.</td> <td>Fazer o servidor usar o modo idempotente enquanto processa atualizações de log binário apenas desta sessão</td> </tr><tr><td>--include-gtids</td> <td>Mostrar apenas os grupos do conjunto GTID fornecido</td> </tr><tr><td>--carga local</td> <td>Preparar arquivos temporários locais para LOAD DATA no diretório especificado</td> </tr><tr><td>--login-path</td> <td>Leia as opções de caminho de login em .mylogin.cnf</td> </tr><tr><td>- Não há padrões</td> <td>Não ler arquivos de opções</td> </tr><tr><td>--não-login-caminhos</td> <td>Não ler os caminhos de login no arquivo de caminho de login</td> </tr><tr><td>- Compensação</td> <td>Saltar as primeiras N entradas no registo</td> </tr><tr><td>--senha</td> <td>Senha para usar quando se conectar ao servidor</td> </tr><tr><td>--plugin-dir</td> <td>Diretório onde os plugins estão instalados</td> </tr><tr><td>- Porto</td> <td>Número de porta TCP/IP para conexão</td> </tr><tr><td>- Impressão padrão</td> <td>Opções padrão de impressão</td> </tr><tr><td>--metadados da tabela de impressão</td> <td>Metadados da tabela de impressão</td> </tr><tr><td>- Protocolo</td> <td>Protocolo de transporte a utilizar</td> </tr><tr><td>- em bruto</td> <td>Escrever eventos em formato RAW (binário) para arquivos de saída</td> </tr><tr><td>- Leia-de-remote-mestre</td> <td>Ler o log binário de um servidor de origem de replicação do MySQL em vez de ler um arquivo de log local</td> </tr><tr><td>--read-from-remote-server</td> <td>Leia o log binário do servidor MySQL em vez do arquivo de log local</td> </tr><tr><td>- Ler-de-fonte-remoto</td> <td>Ler o log binário de um servidor de origem de replicação do MySQL em vez de ler um arquivo de log local</td> </tr><tr><td>--requer-row-format</td> <td>Formulário de registo binário baseado em linhas</td> </tr><tr><td>--resultado-arquivo</td> <td>Saída direta para arquivo nomeado</td> </tr><tr><td>--rewrite-db</td> <td>Criar regras de reescrita para bancos de dados ao reproduzir de registros escritos em formato baseado em linhas. Pode ser usado várias vezes</td> </tr><tr><td>--server-id</td> <td>Extrair apenas os eventos criados pelo servidor com o ID do servidor dado</td> </tr><tr><td>--bits de identificação de servidor</td> <td>Dizer ao mysqlbinlog como interpretar IDs de servidor em log binário quando o log foi escrito por um mysqld tendo seus bits de id de servidor definidos em menos do que o máximo; suportado apenas pela versão do MySQL Cluster do mysqlbinlog</td> </tr><tr><td>--server-chave pública-caminho</td> <td>Nome do caminho para o ficheiro que contém a chave pública RSA</td> </tr><tr><td>--set-charset</td> <td>Adicionar uma instrução SET NAMES charset_name à saída</td> </tr><tr><td>--shared-memory-base-name</td> <td>Nome de memória partilhada para conexões de memória partilhada (somente Windows)</td> </tr><tr><td>- Forma abreviada</td> <td>Mostrar apenas as instruções contidas no registo</td> </tr><tr><td>- Esqueça-me.</td> <td>Não incluir os GTIDs dos arquivos de log binário no arquivo de despejo de saída</td> </tr><tr><td>- Soquete</td> <td>Arquivo de soquete do Unix ou tubo nomeado do Windows para usar</td> </tr><tr><td>- O quê?</td> <td>Arquivo que contém lista de autoridades de certificação SSL confiáveis</td> </tr><tr><td>--ssl-capath</td> <td>Diretório que contém ficheiros de certificados SSL confiáveis</td> </tr><tr><td>--ssl-cert</td> <td>Arquivo que contém o certificado X.509</td> </tr><tr><td>--SSL-cifrado</td> <td>Códigos permitidos para a encriptação da ligação</td> </tr><tr><td>--ssl-crl</td> <td>Arquivo que contém listas de revogação de certificados</td> </tr><tr><td>--ssl-crlpath</td> <td>Diretório que contém ficheiros de lista de revogação de certificado</td> </tr><tr><td>--ssl-fips-modo</td> <td>Ativar o modo FIPS do lado do cliente</td> </tr><tr><td>--ssl-chave</td> <td>Arquivo que contém a chave X.509</td> </tr><tr><td>- Modo SSL</td> <td>Estado de segurança desejado da ligação ao servidor</td> </tr><tr><td>--ssl-data-de-sessão</td> <td>Arquivo que contém dados de sessão SSL</td> </tr><tr><td>--ssl-session-data-continue-on-failed-reuse</td> <td>Estabelecer conexões se a reutilização da sessão falhar</td> </tr><tr><td>--data-hora de início</td> <td>Leia o registo binário do primeiro evento com marca de tempo igual ou posterior ao argumento datetime</td> </tr><tr><td>- Posição de partida</td> <td>Decodificar log binário do primeiro evento com posição igual ou maior que o argumento</td> </tr><tr><td>--stop-datetime</td> <td>Parar de ler o log binário no primeiro evento com marca de tempo igual ou maior que o argumento datetime</td> </tr><tr><td>- Nunca pare.</td> <td>Permanecer ligado ao servidor depois de ler o último arquivo de registo binário</td> </tr><tr><td>--stop-never-slave-server-id</td> <td>Identificação do servidor escravo para relatar quando se conectar ao servidor</td> </tr><tr><td>- Posição de parada</td> <td>Parar a decodificação do log binário no primeiro evento com posição igual ou maior que o argumento</td> </tr><tr><td>--tls-ciphersuites</td> <td>Suítes de encriptação TLSv1.3 permitidas para conexões criptografadas</td> </tr><tr><td>--tls-sni-nome do servidor</td> <td>Nome do servidor fornecido pelo cliente</td> </tr><tr><td>- Versão TLS</td> <td>Protocolos TLS admissíveis para ligações encriptadas</td> </tr><tr><td>--to-last-log</td> <td>Não pare no final do log binário solicitado de um servidor MySQL, mas sim continuar a impressão até o final do último log binário</td> </tr><tr><td>-- utilizador</td> <td>Nome do usuário do MySQL para usar quando se conectar ao servidor</td> </tr><tr><td>- Verbosos.</td> <td>Reconstruir eventos de linha como instruções SQL</td> </tr><tr><td>--verificar-binlog-checksum</td> <td>Verificar checksums em log binário</td> </tr><tr><td>- versão</td> <td>Informações de versão de exibição e saída</td> </tr><tr><td>--zstd-nível de compressão</td> <td>Nível de compressão para conexões com servidor que usam compressão zstd</td> </tr></tbody></table>

- `--help`, `-?`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>

Mostra uma mensagem de ajuda e sai.

- `--base64-output=value`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--base64-output=value</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>AUTO</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>AUTO</code>]]</p><p class="valid-value">[[<code>NEVER</code>]]</p><p class="valid-value">[[<code>DECODE-ROWS</code>]]</p></td> </tr></tbody></table>

Esta opção determina quando os eventos devem ser exibidos codificados como strings base-64 usando instruções `BINLOG`. A opção tem estes valores permitidos (não sensíveis a maiúsculas e minúsculas):

- \[`AUTO`]] ("automático") ou \[`UNSPEC`]] ("não especificado") exibe instruções \[`BINLOG`]] automaticamente quando necessário (ou seja, para eventos de descrição de formato e eventos de linha). Se nenhuma opção \[`--base64-output`]] for fornecida, o efeito é o mesmo que \[`--base64-output=AUTO`].

  ::: info Note

  A exibição automática de `BINLOG` é o único comportamento seguro se você pretende usar a saída de **mysqlbinlog** para re-executar o conteúdo do arquivo de log binário. Os outros valores de opção são destinados apenas para fins de depuração ou teste, pois podem produzir uma saída que não inclui todos os eventos em forma executável.

  :::

- `NEVER` faz com que as instruções `BINLOG` não sejam exibidas. **mysqlbinlog** sai com um erro se for encontrado um evento de linha que deve ser exibido usando `BINLOG`.

- `DECODE-ROWS` especifica para **mysqlbinlog** que você pretende que os eventos de linha sejam decodificados e exibidos como instruções SQL comentadas, especificando também a opção `--verbose`. Como `NEVER`, `DECODE-ROWS` suprime a exibição de instruções `BINLOG`, mas ao contrário de `NEVER`, não sai com um erro se um evento de linha for encontrado.

Para exemplos que mostram o efeito de `--base64-output` e `--verbose` na saída de eventos de linha, veja Seção 6.6.9.2, mysqlbinlog Display de Eventos de Linha.

- `--bind-address=ip_address`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>

Em um computador com várias interfaces de rede, use esta opção para selecionar qual interface usar para se conectar ao servidor MySQL.

- `--binlog-row-event-max-size=N`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--binlog-row-event-max-size=#</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>4294967040</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>256</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>18446744073709547520</code>]]</td> </tr></tbody></table>

Especifique o tamanho máximo de um evento de log binário baseado em linhas, em bytes. Linhas são agrupadas em eventos menores do que este tamanho, se possível. O valor deve ser um múltiplo de 256. O padrão é 4GB.

- `--character-sets-dir=dir_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--character-sets-dir=dir_name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Nome do diretório</td> </tr></tbody></table>

O diretório onde estão instalados os conjuntos de caracteres.

- `--compress`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--compress[={OFF|ON}]</code>]]</td> </tr><tr><th>Depreciado</th> <td>Sim , sim .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

Se possível, comprimir todas as informações enviadas entre o cliente e o servidor.

Esta opção está desatualizada. Espera-se que seja removida em uma versão futura do MySQL. Veja Configurar a Compressão de Conexão Legada.

- `--compression-algorithms=value`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--compression-algorithms=value</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Conjunto</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>uncompressed</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>zlib</code>]]</p><p class="valid-value">[[<code>zstd</code>]]</p><p class="valid-value">[[<code>uncompressed</code>]]</p></td> </tr></tbody></table>

Os algoritmos de compressão permitidos para conexões com o servidor. Os algoritmos disponíveis são os mesmos que para a variável do sistema `protocol_compression_algorithms`. O valor padrão é `uncompressed`.

Para mais informações, ver ponto 6.2.8, "Controlo da compressão da ligação".

- `--connection-server-id=server_id`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--connection-server-id=#]</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>0 (1)</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0 (1)</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>4294967295</code>]]</td> </tr></tbody></table>

`--connection-server-id` especifica o ID do servidor que **mysqlbinlog** relata quando se conecta ao servidor. Pode ser usado para evitar um conflito com o ID de um servidor de réplica ou outro processo **mysqlbinlog**.

Se a opção `--read-from-remote-server` for especificada, **mysqlbinlog** informa um ID de servidor de 0, o que diz ao servidor para se desconectar após o envio do último arquivo de registro (comportamento não bloqueador). Se a opção `--stop-never` também for especificada para manter a conexão com o servidor, **mysqlbinlog** informa um ID de servidor de 1 por padrão em vez de 0, e `--connection-server-id` pode ser usado para substituir esse ID de servidor, se necessário.

- `--database=db_name`, `-d db_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--database=db_name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

Esta opção faz com que o **mysqlbinlog** faça a saída de entradas do log binário (apenas o log local) que ocorrem enquanto `db_name` é selecionado como o banco de dados padrão por `USE`.

A opção `--database` para **mysqlbinlog** é semelhante à opção `--binlog-do-db` para `mysqld`, mas pode ser usada para especificar apenas um banco de dados. Se `--database` é dado várias vezes, apenas a última instância é usada.

Os efeitos desta opção dependem de se o formato de registro baseado em instruções ou baseado em linhas está em uso, da mesma forma que os efeitos de `--binlog-do-db` dependem de se o registro baseado em instruções ou baseado em linhas está em uso.

\*\* Registro baseado em declarações. \*\* A opção `--database` funciona da seguinte forma:

- Enquanto `db_name` é o banco de dados padrão, as instruções são exibidas independentemente de modificarem tabelas em `db_name` ou em um banco de dados diferente.
- A menos que `db_name` seja selecionado como o banco de dados padrão, as instruções não são exibidas, mesmo que modifiquem tabelas em `db_name`.
- Há uma exceção para `CREATE DATABASE`, `ALTER DATABASE`, e `DROP DATABASE`. A base de dados sendo *criada, alterada ou descartada* é considerada a base de dados padrão ao determinar se a instrução deve ser exibida.

Suponha que o log binário foi criado executando estas instruções usando o registro baseado em instruções:

```
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

**mysqlbinlog --database=test** não produz as duas primeiras instruções `INSERT` porque não há um banco de dados padrão. Ele produz as três instruções `INSERT` após `USE test`, mas não as três instruções `INSERT` após `USE db2`.

**mysqlbinlog --database=db2** não produz as duas primeiras instruções de `INSERT` porque não há um banco de dados padrão. Ele não produz as três instruções de `INSERT` após `USE test`, mas produz as três instruções de `INSERT` após `USE db2`.

\*\* Registro baseado em linhas. \*\* \*\* mysqlbinlog\*\* apenas produz entradas que alteram tabelas pertencentes a \* `db_name` *. O banco de dados padrão não tem efeito sobre isso. Suponha que o registro binário apenas descrito foi criado usando registro baseado em linhas em vez de registro baseado em instruções. \*\* mysqlbinlog --database=test*\* produz apenas as entradas que modificam o `t1` no banco de dados de teste, independentemente de se o `USE` foi emitido ou qual é o banco de dados padrão.

Se um servidor está sendo executado com `binlog_format` definido como `MIXED` e você quer que seja possível usar **mysqlbinlog** com a opção `--database`, você deve garantir que as tabelas que são modificadas estejam no banco de dados selecionado por `USE`. (Em particular, nenhuma atualização de banco de dados cruzado deve ser usada.)

Quando usado em conjunto com a opção `--rewrite-db`, a opção `--rewrite-db` é aplicada primeiro; em seguida, a opção `--database` é aplicada, usando o nome do banco de dados reescrito. A ordem em que as opções são fornecidas não faz diferença a este respeito.

- `--debug[=debug_options]`, `-# [debug_options]`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--debug[=debug_option<code>d:t:o,/tmp/mysqlbinlog.trace</code></code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>d:t:o,/tmp/mysqlbinlog.trace</code>]]</td> </tr></tbody></table>

Escreva um log de depuração. Uma string típica `debug_options` é `d:t:o,file_name`. O padrão é `d:t:o,/tmp/mysqlbinlog.trace`.

Esta opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`.

- `--debug-check`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--debug-check</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>

Imprima algumas informações de depuração quando o programa sair.

Esta opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`.

- `--debug-info`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--debug-info</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>

Imprima informações de depuração e estatísticas de uso de memória e CPU quando o programa sair.

Esta opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`.

- `--default-auth=plugin`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--default-auth=plugin</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

Uma dica sobre qual plugin de autenticação do lado do cliente usar.

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

Leia não apenas os grupos de opções usuais, mas também os grupos com os nomes usuais e um sufixo de \* `str` \*. Por exemplo, \*\* mysqlbinlog \*\* normalmente lê os grupos `[client]` e `[mysqlbinlog]` . Se esta opção for dada como `--defaults-group-suffix=_other`, \*\* mysqlbinlog \*\* também lê os grupos `[client_other]` e `[mysqlbinlog_other]`.

Para obter informações adicionais sobre esta e outras opções de ficheiro de opções, consulte a secção 6.2.2.3, "Opções de linha de comando que afectam a manipulação de ficheiro de opções".

- `--disable-log-bin`, `-D`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--disable-log-bin</code>]]</td> </tr></tbody></table>

Desativar o registro binário. Isso é útil para evitar um loop infinito se você usar a opção `--to-last-log` e estiver enviando a saída para o mesmo servidor MySQL. Esta opção também é útil ao restaurar após uma saída inesperada para evitar a duplicação das instruções que você registrou.

Esta opção faz com que o **mysqlbinlog** inclua uma instrução `SET sql_log_bin = 0` em sua saída para desativar o registro binário da saída restante. Manipulando o valor de sessão da variável do sistema `sql_log_bin` é uma operação restrita, então esta opção requer que você tenha privilégios suficientes para definir variáveis de sessão restritas. Veja Seção 7.1.9.1,  Privilégios de variável do sistema.

- `--exclude-gtids=gtid_set`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--exclude-gtids=gtid_set</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor por defeito</th> <td>[[<code></code>]]</td> </tr></tbody></table>

Não exibir nenhum dos grupos listados no `gtid_set`.

- `--force-if-open`, `-F`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--force-if-open</code>]]</td> </tr></tbody></table>

Leia arquivos de log binários mesmo que estejam abertos ou não tenham sido fechados corretamente (a bandeira `IN_USE` está definida); não falhe se o arquivo terminar com um evento truncado.

A bandeira `IN_USE` é definida apenas para o log binário que está atualmente escrito pelo servidor; se o servidor falhou, a bandeira permanece definida até que o servidor seja reiniciado e recupere o log binário. Sem essa opção, **mysqlbinlog** se recusa a processar um arquivo com esse conjunto de bandeiras. Como o servidor pode estar no processo de escrever o arquivo, o truncamento do último evento é considerado normal.

- `--force-read`, `-f`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--force-read</code>]]</td> </tr></tbody></table>

Com esta opção, se **mysqlbinlog** ler um evento de log binário que não reconhece, ele imprime um aviso, ignora o evento e continua. Sem esta opção, **mysqlbinlog** pára se ler tal evento.

- `--get-server-public-key`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--get-server-public-key</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr></tbody></table>

Solicitar do servidor a chave pública necessária para a troca de senhas baseada em pares de chaves RSA. Esta opção se aplica a clientes que se autenticam com o plugin de autenticação `caching_sha2_password`. Para esse plugin, o servidor não envia a chave pública a menos que seja solicitado. Esta opção é ignorada para contas que não se autenticam com esse plugin. Também é ignorada se a troca de senhas baseada em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

Se `--server-public-key-path=file_name` é dado e especifica um arquivo de chave pública válido, ele tem precedência sobre `--get-server-public-key`.

Para obter informações sobre o plug-in `caching_sha2_password`, consulte a Seção 8.4.1.2, Caching SHA-2 Pluggable Authentication.

- `--hexdump`, `-H`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--hexdump</code>]]</td> </tr></tbody></table>

Exibe um hex dump do log em comentários, como descrito na Seção 6.6.9.1, mysqlbinlog Hex Dump Format. A saída hex pode ser útil para depuração de replicação.

- `--host=host_name`, `-h host_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--host=host_name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>localhost</code>]]</td> </tr></tbody></table>

Obter o log binário do servidor MySQL no host dado.

- `--idempotent`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--idempotent</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>true</code>]]</td> </tr></tbody></table>

Diga ao MySQL Server para usar o modo idempotent durante o processamento de atualizações; isso causa a supressão de quaisquer erros de chave duplicada ou chave não encontrada que o servidor encontra na sessão atual durante o processamento de atualizações. Esta opção pode ser útil sempre que for desejável ou necessário reproduzir um ou mais logs binários para um MySQL Server que podem não conter todos os dados aos quais os logs se referem.

O escopo de efeito para esta opção inclui apenas o cliente **mysqlbinlog** e a sessão atual.

- `--include-gtids=gtid_set`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--include-gtids=gtid_set</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor por defeito</th> <td>[[<code></code>]]</td> </tr></tbody></table>

Mostrar apenas os grupos listados no `gtid_set`.

- `--local-load=dir_name`, `-l dir_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--local-load=dir_name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Nome do diretório</td> </tr></tbody></table>

Para operações de carregamento de dados correspondentes a instruções `LOAD DATA`, **mysqlbinlog** extrai os arquivos dos eventos de log binário, os escreve como arquivos temporários para o sistema de arquivos local e escreve instruções `LOAD DATA LOCAL` para fazer com que os arquivos sejam carregados. Por padrão, **mysqlbinlog** escreve esses arquivos temporários para um diretório específico do sistema operacional. A opção `--local-load` pode ser usada para especificar explicitamente o diretório onde **mysqlbinlog** deve preparar arquivos temporários locais.

Como outros processos podem escrever arquivos para o diretório padrão específico do sistema, é aconselhável especificar a opção `--local-load` para **mysqlbinlog** para designar um diretório diferente para arquivos de dados e, em seguida, designar esse mesmo diretório especificando a opção `--load-data-local-dir` para `mysql` ao processar a saída de **mysqlbinlog**. Por exemplo:

```
mysqlbinlog --local-load=/my/local/data ...
    | mysql --load-data-local-dir=/my/local/data ...
```

Importância

Estes arquivos temporários não são automaticamente removidos pelo **mysqlbinlog** ou qualquer outro programa MySQL.

- `--login-path=name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--login-path=name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

Leia opções do caminho de login nomeado no arquivo de caminho de login. Um caminho de login é um grupo de opções que contém opções que especificam a qual servidor MySQL se conectar e qual conta autenticar. Para criar ou modificar um arquivo de caminho de login, use o utilitário **mysql\_config\_editor**. Veja Seção 6.6.7, mysql\_config\_editor  MySQL Configuration Utility.

Para obter informações adicionais sobre esta e outras opções de ficheiro de opções, consulte a secção 6.2.2.3, "Opções de linha de comando que afectam a manipulação de ficheiro de opções".

- `--no-login-paths`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--no-login-paths</code>]]</td> </tr></tbody></table>

Salta opções de leitura do arquivo de caminho de login.

Ver `--login-path` para informações relacionadas.

Para obter informações adicionais sobre esta e outras opções de ficheiro de opções, consulte a secção 6.2.2.3, "Opções de linha de comando que afectam a manipulação de ficheiro de opções".

- `--no-defaults`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--no-defaults</code>]]</td> </tr></tbody></table>

Não leia nenhum arquivo de opções. Se o início do programa falhar devido à leitura de opções desconhecidas de um arquivo de opções, `--no-defaults` pode ser usado para impedi-las de serem lidas.

A exceção é que o arquivo `.mylogin.cnf` é lido em todos os casos, se existir. Isso permite que as senhas sejam especificadas de uma forma mais segura do que na linha de comando, mesmo quando `--no-defaults` é usado. Para criar `.mylogin.cnf`, use o utilitário **mysql\_config\_editor**. Veja Seção 6.6.7, mysql\_config\_editor  MySQL Configuration Utility.

Para obter informações adicionais sobre esta e outras opções de ficheiro de opções, consulte a secção 6.2.2.3, "Opções de linha de comando que afectam a manipulação de ficheiro de opções".

- `--offset=N`, `-o N`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--offset=#</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número</td> </tr></tbody></table>

Esqueça as primeiras entradas `N` no log.

- `--open-files-limit=N`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--open-files-limit=#</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>8</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>[platform dependent]</code>]]</td> </tr></tbody></table>

Especificar o número de descritores de ficheiros abertos a reservar.

- `--password[=password]`, `-p[password]`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--password[=password]</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

A senha da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecido, **mysqlbinlog** solicita um. Se for fornecido, deve haver \* nenhum espaço \* entre `--password=` ou `-p` e a senha que a segue. Se nenhuma opção de senha for especificada, o padrão é não enviar senha.

A especificação de uma senha na linha de comando deve ser considerada insegura. Para evitar a indicação da senha na linha de comando, use um arquivo de opções. Veja a Seção 8.1.2.1, "Diretrizes do Usuário Final para a Segurança de Senhas".

Para especificar explicitamente que não há senha e que **mysqlbinlog** não deve solicitar uma, use a opção `--skip-password`.

- `--plugin-dir=dir_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--plugin-dir=dir_name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Nome do diretório</td> </tr></tbody></table>

O diretório no qual procurar plugins. Especifique esta opção se a opção `--default-auth` for usada para especificar um plugin de autenticação, mas **mysqlbinlog** não o encontrar. Veja Seção 8.2.17, Autenticação Pluggable.

- `--port=port_num`, `-P port_num`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--port=port_num</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>3306</code>]]</td> </tr></tbody></table>

O número de porta TCP/IP a utilizar para se conectar a um servidor remoto.

- `--print-defaults`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--print-defaults</code>]]</td> </tr></tbody></table>

Imprima o nome do programa e todas as opções que ele obtém de arquivos de opções.

Para obter informações adicionais sobre esta e outras opções de ficheiro de opções, consulte a secção 6.2.2.3, "Opções de linha de comando que afectam a manipulação de ficheiro de opções".

- `--print-table-metadata`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--print-table-metadata</code>]]</td> </tr></tbody></table>

Imprima metadados relacionados à tabela a partir do log binário. Configure a quantidade de metadados binários relacionados à tabela registrados usando `binlog-row-metadata`.

- `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--protocol=type</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>[see tex<code>TCP</code></code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>TCP</code>]]</p><p class="valid-value">[[<code>SOCKET</code>]]</p><p class="valid-value">[[<code>PIPE</code>]]</p><p class="valid-value">[[<code>MEMORY</code>]]</p></td> </tr></tbody></table>

O protocolo de transporte a utilizar para se conectar ao servidor. É útil quando os outros parâmetros de conexão normalmente resultam na utilização de um protocolo diferente daquele desejado.

- `--raw`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--raw</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>

Por padrão, **mysqlbinlog** lê arquivos de log binário e escreve eventos em formato de texto. A opção `--raw` diz ao **mysqlbinlog** para escrevê-los em seu formato binário original. Seu uso requer que `--read-from-remote-server` também seja usado porque os arquivos são solicitados de um servidor. **mysqlbinlog** escreve um arquivo de saída para cada arquivo lido do servidor. A opção `--raw` pode ser usada para fazer um backup do log binário de um servidor. Com a opção `--stop-never`, o backup é  vivo porque **mysqlbinlog** permanece conectado ao servidor. Por padrão, os arquivos de saída são escritos no diretório atual com os mesmos nomes que os arquivos de log originais. Os nomes de arquivos de saída podem ser modificados usando a opção \[\[Back\_CODE\_PH\_4]].

- `--read-from-remote-source=type`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--read-from-remote-source=type</code>]]</td> </tr></tbody></table>

Esta opção lê registros binários de um servidor MySQL com os comandos `COM_BINLOG_DUMP` ou `COM_BINLOG_DUMP_GTID` definindo o valor da opção para `BINLOG-DUMP-NON-GTIDS` ou `BINLOG-DUMP-GTIDS`, respectivamente. Se `--read-from-remote-source=BINLOG-DUMP-GTIDS` for combinado com `--exclude-gtids`, as transações podem ser filtradas na fonte, evitando tráfego de rede desnecessário.

As opções de parâmetros de conexão são usadas com essas opções ou com a opção `--read-from-remote-server`. Estas opções são `--host`, `--password`, `--port`, `--protocol`, `--socket`, e `--user`. Se nenhuma das opções remotas for especificada, as opções de parâmetros de conexão são ignoradas.

O privilégio `REPLICATION SLAVE` é necessário para usar essas opções.

- `--read-from-remote-master=type`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--read-from-remote-master=type</code>]]</td> </tr><tr><th>Depreciado</th> <td>Sim , sim .</td> </tr></tbody></table>

Sinônimo depreciado para `--read-from-remote-source`.

- `--read-from-remote-server=file_name`, `-R`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--read-from-remote-server=file_name</code>]]</td> </tr></tbody></table>

Leia o log binário de um servidor MySQL em vez de ler um arquivo de log local. Esta opção requer que o servidor remoto esteja em execução. Funciona apenas para arquivos de log binários no servidor remoto e não para arquivos de log de retransmissão. Isso aceita o nome do arquivo de log binário (incluindo o sufixo numérico) sem o caminho do arquivo.

As opções de parâmetros de conexão são usadas com esta opção ou com a opção `--read-from-remote-source`. Estas opções são `--host`, `--password`, `--port`, `--protocol`, `--socket`, e `--user`. Se nenhuma das opções remotas for especificada, as opções de parâmetros de conexão são ignoradas.

O privilégio `REPLICATION SLAVE` é necessário para usar esta opção.

Esta opção é como `--read-from-remote-source=BINLOG-DUMP-NON-GTIDS`.

- `--result-file=name`, `-r name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--result-file=name</code>]]</td> </tr></tbody></table>

Sem a opção `--raw`, esta opção indica o arquivo para o qual o **mysqlbinlog** escreve a saída de texto. Com o `--raw`, o **mysqlbinlog** escreve um arquivo de saída binário para cada arquivo de log transferido do servidor, escrevendo-os por padrão no diretório atual usando os mesmos nomes do arquivo de log original. Neste caso, o valor da opção `--result-file` é tratado como um prefixo que modifica os nomes dos arquivos de saída.

- `--require-row-format`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--require-row-format</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>false</code>]]</td> </tr></tbody></table>

O fluxo de eventos produzidos com esta opção seria aceito por um canal de replicação que é protegido usando a opção `REQUIRE_ROW_FORMAT` da instrução `CHANGE REPLICATION SOURCE TO`. `binlog_format=ROW` deve ser definido no servidor onde o log binário foi escrito. Quando você especifica esta opção, **mysqlbinlog** pára com uma mensagem de erro se encontrar qualquer evento que seja desautorizado sob as restrições `REQUIRE_ROW_FORMAT` , incluindo `LOAD DATA INFILE` , instruções de criação ou descartando tabelas temporárias, `INTVAR`, `RAND`, ou `USER_VAR` eventos, e eventos não baseados em uma transação dentro de uma instrução de saída. \*\* DML imprime também um \[\[mysqllog\_CODE\_8]] no seu servidor, e não é aplicado às restrições de saída quando a instrução `SET @@session.pseudo_thread_id` é executada.

- `--rewrite-db='from_name->to_name'`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--rewrite-db='oldname-&gt;newname'</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>

Ao ler de um log baseado em linhas ou baseado em instruções, reescreva todas as ocorrências de \* `from_name` \* para \* `to_name` \*. A reescreva é feita nas linhas, para logs baseados em linhas, bem como nas cláusulas `USE`, para logs baseados em instruções.

Advertência

As instruções nas quais os nomes das tabelas são qualificados com os nomes das bases de dados não são reescritas para usar o novo nome ao usar esta opção.

A regra de reescrita utilizada como valor para esta opção é uma cadeia de caracteres com a forma `'from_name->to_name'`, como mostrado anteriormente, e por esta razão deve ser cercada por aspas.

Para empregar várias regras de reescrita, especifique a opção várias vezes, como mostrado aqui:

```
mysqlbinlog --rewrite-db='dbcurrent->dbold' --rewrite-db='dbtest->dbcurrent' \
    binlog.00001 > /tmp/statements.sql
```

Quando usado em conjunto com a opção `--database`, a opção `--rewrite-db` é aplicada primeiro; em seguida, a opção `--database` é aplicada, usando o nome do banco de dados reescrito. A ordem em que as opções são fornecidas não faz diferença a este respeito.

Isso significa que, por exemplo, se **mysqlbinlog** é iniciado com `--rewrite-db='mydb->yourdb' --database=yourdb`, então todas as atualizações de quaisquer tabelas nas bases de dados `mydb` e `yourdb` são incluídas na saída. Por outro lado, se é iniciado com `--rewrite-db='mydb->yourdb' --database=mydb`, então **mysqlbinlog** não produz nenhuma instrução: uma vez que todas as atualizações para `mydb` são primeiro reescritas como atualizações para `yourdb` antes de aplicar a opção `--database`, não restam atualizações que correspondam a `--database=mydb`.

- `--server-id=id`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--server-id=id</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número</td> </tr></tbody></table>

Exibir apenas os eventos criados pelo servidor com o ID de servidor dado.

- `--server-id-bits=N`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--server-id-bits=#</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>32</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>7</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>32</code>]]</td> </tr></tbody></table>

Se o log binário foi escrito por um `mysqld` com os bits de identificação do servidor definidos em menos de 32 e os dados do usuário armazenados no bit mais significativo, executar **mysqlbinlog** com o `--server-id-bits` definido em 32 permite que esses dados sejam vistos.

Esta opção é suportada apenas pela versão de **mysqlbinlog** fornecida com a distribuição NDB Cluster, ou construída com o suporte NDB Cluster.

- `--server-public-key-path=file_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--server-public-key-path=file_name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Nome do ficheiro</td> </tr></tbody></table>

O nome do caminho para um arquivo no formato PEM contendo uma cópia do lado do cliente da chave pública exigida pelo servidor para troca de senhas baseada em pares de chaves RSA. Esta opção se aplica a clientes que se autenticam com o plug-in de autenticação `sha256_password` (obsoleto) ou `caching_sha2_password`. Esta opção é ignorada para contas que não se autenticam com um desses plug-ins. Também é ignorada se a troca de senhas baseada em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

Se `--server-public-key-path=file_name` é dado e especifica um arquivo de chave pública válido, ele tem precedência sobre `--get-server-public-key`.

Para `sha256_password` (deprecated), esta opção aplica-se apenas se o MySQL foi construído usando OpenSSL.

Para obter informações sobre os plugins `sha256_password` e `caching_sha2_password`, consulte a Seção 8.4.1.3, Autenticação Pluggable SHA-256, e a Seção 8.4.1.2, Cache SHA-2 Pluggable Authentication.

- `--set-charset=charset_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--set-charset=charset_name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

Adicione uma instrução `SET NAMES charset_name` à saída para especificar o conjunto de caracteres a ser usado para processar arquivos de log.

- `--shared-memory-base-name=name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--shared-memory-base-name=name</code>]]</td> </tr><tr><th>Específicos da plataforma</th> <td>Vidros</td> </tr></tbody></table>

No Windows, o nome de memória compartilhada a ser usado para conexões feitas usando memória compartilhada para um servidor local. O valor padrão é `MYSQL`. O nome de memória compartilhada é sensível a maiúscula e minúscula.

Esta opção aplica-se apenas se o servidor foi iniciado com a variável de sistema `shared_memory` habilitada para suportar conexões de memória compartilhada.

- `--short-form`, `-s`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--short-form</code>]]</td> </tr></tbody></table>

Mostre apenas as instruções contidas no log, sem qualquer informação extra ou eventos baseados em linhas. Isto é apenas para testes, e não deve ser usado em sistemas de produção. É depreciado, e você deve esperar que seja removido em uma versão futura.

- `--skip-gtids[=(true|false)]`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--skip-gtids[=true|fals<code>false</code></code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>false</code>]]</td> </tr></tbody></table>

Não incluir os GTIDs dos arquivos de registo binários no arquivo de descarga de saída.

```
mysqlbinlog --skip-gtids binlog.000001 >  /tmp/dump.sql
mysql -u root -p -e "source /tmp/dump.sql"
```

Normalmente, você não deve usar essa opção na produção ou na recuperação, exceto nos cenários específicos e raros em que os GTIDs são ativamente indesejados. Por exemplo, um administrador pode querer duplicar transações selecionadas (como definições de tabela) de uma implantação para outra, não relacionada, implantação que não será replicada para ou a partir do original. Nesse cenário, `--skip-gtids` pode ser usado para permitir que o administrador aplique as transações como se fossem novas e garantir que as implantações permaneçam não relacionadas. No entanto, você só deve usar essa opção se a inclusão dos GTIDs causar um problema conhecido para o seu caso de uso.

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

- `--start-datetime=datetime`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--start-datetime=datetime</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Data e hora</td> </tr></tbody></table>

Comece a ler o log binário no primeiro evento com um carimbo de tempo igual ou posterior ao argumento \* `datetime` \*. O valor \* `datetime` \* é relativo ao fuso horário local na máquina onde você executa \*\* mysqlbinlog \*\*. O valor deve estar em um formato aceito para os tipos de dados `DATETIME` ou `TIMESTAMP`. Por exemplo:

```
mysqlbinlog --start-datetime="2005-12-25 11:25:56" binlog.000003
```

Esta opção é útil para a recuperação pontual (ver secção 9.5, "Recuperação pontual (incremental)  Recuperação").

- `--start-position=N`, `-j N`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--start-position=#</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número</td> </tr></tbody></table>

Comece a decodificar o log binário na posição de log \* `N`*, incluindo na saída todos os eventos que começam na posição \* `N`* ou depois. A posição é um ponto de byte no arquivo de log, não um contador de eventos; ele precisa apontar para a posição inicial de um evento para gerar uma saída útil. Esta opção se aplica ao primeiro arquivo de log nomeado na linha de comando.

O valor máximo suportado para esta opção é 18446744073709551616 (264-1), a menos que também sejam utilizados `--read-from-remote-server` ou `--read-from-remote-source`, caso em que o valor máximo é 4294967295.

Esta opção é útil para a recuperação pontual (ver secção 9.5, "Recuperação pontual (incremental)  Recuperação").

- `--stop-datetime=datetime`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--stop-datetime=datetime</code>]]</td> </tr></tbody></table>

Pare de ler o log binário no primeiro evento com um carimbo de tempo igual ou posterior ao argumento \* `datetime` \*. Veja a descrição da opção `--start-datetime` para informações sobre o valor \* `datetime` \*.

Esta opção é útil para a recuperação pontual (ver secção 9.5, "Recuperação pontual (incremental)  Recuperação").

- `--stop-never`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--stop-never</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>

Esta opção é usada com `--read-from-remote-server`. Ele diz **mysqlbinlog** para permanecer conectado ao servidor. Caso contrário **mysqlbinlog** sai quando o último arquivo de log foi transferido do servidor. `--stop-never` implica `--to-last-log`, então apenas o primeiro arquivo de log para transferir precisa ser nomeado na linha de comando.

`--stop-never` é comumente usado com `--raw` para fazer um backup de log binário ao vivo, mas também pode ser usado sem `--raw` para manter uma exibição contínua de texto de eventos de log à medida que o servidor os gera.

Com `--stop-never`, por padrão, **mysqlbinlog** relata um ID de servidor de 1 quando se conecta ao servidor. Use `--connection-server-id` para especificar explicitamente um ID alternativo para relatar. Pode ser usado para evitar um conflito com o ID de um servidor de réplica ou outro processo **mysqlbinlog**. Veja Seção 6.6.9.4, Especificar o ID do servidor mysqlbinlog.

- `--stop-never-slave-server-id=id`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--stop-never-slave-server-id=#</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>65535</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr></tbody></table>

Esta opção está desatualizada; espera-se que seja removida em uma versão futura. Use a opção `--connection-server-id` em vez disso para especificar um ID de servidor para **mysqlbinlog** relatar.

- `--stop-position=N`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--stop-position=#</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número</td> </tr></tbody></table>

Pare de decodificar o log binário na posição de log \* `N`*, excluindo da saída todos os eventos que começam na posição \* `N`* ou posterior. A posição é um ponto de byte no arquivo de log, não um contador de eventos; ele precisa apontar para um ponto após a posição inicial do último evento que você deseja incluir na saída. O evento que começa antes da posição \* `N`\* e termina na ou após a posição é o último evento a ser processado. Esta opção se aplica ao último arquivo de log nomeado na linha de comando.

Esta opção é útil para a recuperação pontual (ver secção 9.5, "Recuperação pontual (incremental)  Recuperação").

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

- `--to-last-log`, `-t`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--to-last-log</code>]]</td> </tr></tbody></table>

Não pare no final do registro binário solicitado de um servidor MySQL, mas continue imprimindo até o final do último registro binário. Se você enviar a saída para o mesmo servidor MySQL, isso pode levar a um loop sem fim. Esta opção requer `--read-from-remote-server`.

- `--user=user_name`, `-u user_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--user=user_name,</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

Nome do utilizador da conta MySQL a utilizar quando se ligar a um servidor remoto.

Se você estiver usando o plug-in `Rewriter`, você deve conceder a este usuário o privilégio `SKIP_QUERY_REWRITE`.

- `--verbose`, `-v`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--verbose</code>]]</td> </tr></tbody></table>

Reconstruir eventos de linha e exibi-los como instruções SQL comentadas, com informações de partição de tabela quando aplicável. Se esta opção for dada duas vezes (passando em "-vv" ou "--verbose --verbose"), a saída inclui comentários para indicar tipos de dados de coluna e alguns metadados, e eventos de registro de informações, como eventos de registro de consulta de linha, se a variável de sistema `binlog_rows_query_log_events` for definida como `TRUE`.

Para exemplos que mostram o efeito de `--base64-output` e `--verbose` na saída de eventos de linha, veja Seção 6.6.9.2, mysqlbinlog Display de Eventos de Linha.

- `--verify-binlog-checksum`, `-c`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--verify-binlog-checksum</code>]]</td> </tr></tbody></table>

Verificar somas de verificação em ficheiros de registo binários.

- `--version`, `-V`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--version</code>]]</td> </tr></tbody></table>

Informações de versão e saída.

- `--zstd-compression-level=level`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--zstd-compression-level=#</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr></tbody></table>

O nível de compressão a usar para conexões com o servidor que usam o algoritmo de compressão `zstd`. Os níveis permitidos são de 1 a 22, com valores maiores indicando níveis crescentes de compressão. O nível de compressão `zstd` padrão é 3. A configuração do nível de compressão não tem efeito em conexões que não usam a compressão `zstd`.

Para mais informações, ver ponto 6.2.8, "Controlo da compressão da ligação".

Você pode enviar a saída do **mysqlbinlog** para o cliente `mysql` para executar os eventos contidos no log binário. Esta técnica é usada para recuperar de uma saída inesperada quando você tem um backup antigo (ver Seção 9.5, "Recuperação de ponto em tempo (incremental)  Recuperação"). Por exemplo:

```
mysqlbinlog binlog.000001 | mysql -u root -p
```

Ou:

```
mysqlbinlog binlog.[0-9]* | mysql -u root -p
```

Se as instruções produzidas por **mysqlbinlog** podem conter valores `BLOB`, estes podem causar problemas quando `mysql` os processa. Neste caso, invoque `mysql` com a opção `--binary-mode`.

Você também pode redirecionar a saída do **mysqlbinlog** para um arquivo de texto em vez disso, se você precisar modificar o registro de instruções primeiro (por exemplo, para remover instruções que você não quer executar por algum motivo). Após editar o arquivo, execute as instruções que ele contém usando-o como entrada para o programa `mysql`:

```
mysqlbinlog binlog.000001 > tmpfile
... edit tmpfile ...
mysql -u root -p < tmpfile
```

Quando o **mysqlbinlog** é invocado com a opção `--start-position`, ele exibe apenas os eventos com um deslocamento no registro binário maior ou igual a uma determinada posição (a posição dada deve corresponder ao início de um evento). Ele também tem opções para parar e iniciar quando vê um evento com uma data e hora determinadas. Isso permite que você execute a recuperação pontual usando a opção `--stop-datetime` (para poder dizer, por exemplo,  rolar para a frente meus bancos de dados para como eles estavam hoje às 10:30 da manhã ).

\*\* Processamento de vários arquivos. \*\* Se você tiver mais de um log binário para executar no servidor MySQL, o método seguro é processá-los todos usando uma única conexão com o servidor. Aqui está um exemplo que demonstra o que pode ser \* inseguro \*:

```
mysqlbinlog binlog.000001 | mysql -u root -p # DANGER!!
mysqlbinlog binlog.000002 | mysql -u root -p # DANGER!!
```

O processamento de logs binários desta forma usando várias conexões com o servidor causa problemas se o primeiro arquivo de log contém uma instrução `CREATE TEMPORARY TABLE` e o segundo log contém uma instrução que usa a tabela temporária. Quando o primeiro processo `mysql` termina, o servidor deixa cair a tabela temporária. Quando o segundo processo `mysql` tenta usar a tabela, o servidor relata tabela desconhecida.

Para evitar problemas como este, use um processo *single* `mysql` para executar o conteúdo de todos os logs binários que você deseja processar.

```
mysqlbinlog binlog.000001 binlog.000002 | mysql -u root -p
```

Outra abordagem é escrever todos os logs em um único arquivo e, em seguida, processar o arquivo:

```
mysqlbinlog binlog.000001 >  /tmp/statements.sql
mysqlbinlog binlog.000002 >> /tmp/statements.sql
mysql -u root -p -e "source /tmp/statements.sql"
```

Você também pode fornecer vários arquivos de log binário para **mysqlbinlog** como entrada de fluxo usando um shell pipe. Um arquivo de arquivos de log binários comprimidos pode ser descompactado e fornecido diretamente para **mysqlbinlog**. Neste exemplo, `binlog-files_1.gz` contém vários arquivos de log binários para processamento. O pipeline extrai o conteúdo de `binlog-files_1.gz`, canaliza os arquivos de log binários para **mysqlbinlog** como entrada padrão e canaliza a saída de **mysqlbinlog** para o cliente `mysql` para execução:

```
gzip -cd binlog-files_1.gz | ./mysqlbinlog - | ./mysql -uroot  -p
```

Pode especificar mais de um ficheiro de arquivo, por exemplo:

```
gzip -cd binlog-files_1.gz binlog-files_2.gz | ./mysqlbinlog - | ./mysql -uroot  -p
```

Para entrada de fluxo, não use `--stop-position`, porque **mysqlbinlog** não pode identificar o último arquivo de log para aplicar esta opção.

\*\* Operações de LOAD DATA. \*\* \*\* mysqlbinlog \*\* pode produzir uma saída que reproduz uma operação `LOAD DATA` sem o arquivo de dados original. \*\* mysqlbinlog \*\* copia os dados para um arquivo temporário e escreve uma instrução `LOAD DATA LOCAL` que se refere ao arquivo. A localização padrão do diretório onde esses arquivos são escritos é específica do sistema. Para especificar um diretório explicitamente, use a opção `--local-load`.

Como **mysqlbinlog** converte as instruções `LOAD DATA` em instruções `LOAD DATA LOCAL` (ou seja, adiciona `LOCAL`), tanto o cliente quanto o servidor que você usa para processar as instruções devem ser configurados com a capacidade `LOCAL` ativada. Veja Seção 8.1.6, Considerações de segurança para LOAD DATA LOCAL.

Advertência

Os arquivos temporários criados para as instruções `LOAD DATA LOCAL` *não* são automaticamente excluídos porque são necessários até que você realmente execute essas instruções. Você deve excluir os arquivos temporários sozinho depois de não precisar mais do registro de instruções. Os arquivos podem ser encontrados no diretório de arquivos temporários e têm nomes como `original_file_name-#-#`.
