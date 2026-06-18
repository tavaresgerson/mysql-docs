### 6.6.9 mysqlbinlog — Ferramenta para processar arquivos de log binários

6.6.9.1 Formato de Exibição Hexadecimal do mysqlbinlog

6.6.9.2 Exibição de eventos de linha do mysqlbinlog

6.6.9.3 Usar mysqlbinlog para fazer backup de arquivos de log binário

6.6.9.4 Especificar o ID do servidor mysqlbinlog

O log binário do servidor consiste em arquivos que contêm “eventos” que descrevem as modificações nos conteúdos do banco de dados. O servidor escreve esses arquivos no formato binário. Para exibir seus conteúdos no formato de texto, use o utilitário **mysqlbinlog**. Você também pode usar **mysqlbinlog** para exibir o conteúdo dos arquivos de log de retransmissão escritos por um servidor replica em uma configuração de replicação, pois os logs de retransmissão têm o mesmo formato dos logs binários. O log binário e o log de retransmissão são discutidos mais detalhadamente na Seção 7.4.4, “O Log Binário”, e na Seção 19.2.4, “Repositórios de Log de Retransmissão e Metadados de Replicação”.

Invoque **mysqlbinlog** da seguinte forma:

```
mysqlbinlog [options] log_file ...
```

Por exemplo, para exibir o conteúdo do arquivo de log binário chamado `binlog.000003`, use este comando:

```
mysqlbinlog binlog.000003
```

A saída inclui eventos contidos em `binlog.000003`. Para o registro baseado em declarações, as informações dos eventos incluem a declaração SQL, o ID do servidor em que ela foi executada, o timestamp da execução da declaração, quanto tempo levou e assim por diante. Para o registro baseado em linhas, o evento indica uma mudança na linha em vez de uma declaração SQL. Consulte a Seção 19.2.1, “Formatos de Replicação”, para obter informações sobre os modos de registro.

Os eventos são precedidos por comentários de cabeçalho que fornecem informações adicionais. Por exemplo:

```
# at 141
#100309  9:28:36 server id 123  end_log_pos 245
  Query thread_id=3350  exec_time=11  error_code=0
```

Na primeira linha, o número que segue `at` indica o deslocamento do arquivo ou a posição inicial do evento no arquivo de log binário.

A segunda linha começa com uma data e uma hora que indicam quando a declaração começou no servidor onde o evento se originou. Para a replicação, este timestamp é propagado para os servidores replicados. `server id` é o valor `server_id` do servidor onde o evento se originou. `end_log_pos` indica onde o próximo evento começa (ou seja, é a posição final do evento atual + 1). `thread_id` indica qual thread executou o evento. `exec_time` é o tempo gasto executando o evento, em um servidor de origem de replicação. Em um replica, é a diferença do tempo de execução final na replica menos o tempo de início de execução na fonte. A diferença serve como um indicador de quanto a replica está atrasada em relação à fonte. `error_code` indica o resultado da execução do evento. Zero significa que não houve erro.

Nota

Ao usar grupos de eventos, os deslocamentos de arquivo dos eventos podem ser agrupados e os comentários dos eventos podem ser agrupados. Não confunda esses eventos agrupados com deslocamentos de arquivo em branco.

A saída do **mysqlbinlog** pode ser reexecutada (por exemplo, usando-o como entrada para o **mysql**) para refazer as declarações no log. Isso é útil para operações de recuperação após uma saída inesperada do servidor. Para outros exemplos de uso, consulte a discussão mais adiante nesta seção e na Seção 9.5, “Recuperação Ponto no Tempo (Incremental)”). Para executar as declarações de uso interno `BINLOG` usadas pelo **mysqlbinlog**, o usuário requer o privilégio `BINLOG_ADMIN` (ou o privilégio desatualizado `SUPER`), ou o privilégio `REPLICATION_APPLIER` mais os privilégios apropriados para executar cada evento de log.

Você pode usar **mysqlbinlog** para ler arquivos de log binário diretamente e aplicá-los ao servidor MySQL local. Você também pode ler logs binários de um servidor remoto usando a opção `--read-from-remote-server`. Para ler logs binários remotos, as opções de parâmetros de conexão podem ser fornecidas para indicar como se conectar ao servidor. Essas opções são `--host`, `--password`, `--port`, `--protocol`, `--socket` e `--user`.

Quando os arquivos de log binários são criptografados, o que pode ser feito a partir do MySQL 8.0.14 em diante, o **mysqlbinlog** não pode lê-los diretamente, mas pode lê-los do servidor usando a opção `--read-from-remote-server`. Os arquivos de log binários são criptografados quando a variável de sistema `binlog_encryption` do servidor é definida como `ON`. A instrução `SHOW BINARY LOGS` mostra se um arquivo de log binário específico está criptografado ou não. Arquivos de log binários criptografados e não criptografados também podem ser distinguidos usando o número mágico no início do cabeçalho do arquivo para arquivos de log criptografados (`0xFD62696E`), que difere do usado para arquivos de log não criptografados (`0xFE62696E`). Note que, a partir do MySQL 8.0.14, o **mysqlbinlog** retorna um erro adequado se você tentar ler um arquivo de log binário criptografado diretamente, mas versões mais antigas do **mysqlbinlog** não reconhecem o arquivo como um arquivo de log binário. Para mais informações sobre criptografia de log binário, consulte a Seção 19.3.2, “Criptografando Arquivos de Log Binário e Arquivos de Log Relay”.

Quando os payloads de transações de log binário foram comprimidos, o que pode ser feito a partir do MySQL 8.0.20 em diante, as versões do **mysqlbinlog** a partir dessa versão descompactarão e decodificarão automaticamente os payloads de transações e os imprimirão como eventos não compactados. Versões mais antigas do **mysqlbinlog** não podem ler payloads de transações compactados. Quando a variável de sistema `binlog_transaction_compression` do servidor é definida como `ON`, os payloads de transações são compactados e então escritos no arquivo de log binário do servidor como um único evento (um `Transaction_payload_event`). Com a opção `--verbose`, o **mysqlbinlog** adiciona comentários indicando o algoritmo de compactação usado, o tamanho do payload compactado que foi originalmente recebido e o tamanho do payload resultante após a descompactação.

Nota

A posição final (`end_log_pos`) que o **mysqlbinlog** indica para um evento individual que fazia parte de um payload de transação comprimido é a mesma da posição final do payload original comprimido. Portanto, vários eventos descomprimidos podem ter a mesma posição final.

A compressão de conexão do próprio **mysqlbinlog** faz menos se os payloads das transações já estiverem comprimidos, mas ainda opera em transações e cabeçalhos não comprimidos.

Para obter mais informações sobre a compressão de transações de log binário, consulte a Seção 7.4.4.5, “Compressão de Transações de Log Binário”.

Ao executar o **mysqlbinlog** em um log binário grande, tenha cuidado para que o sistema de arquivos tenha espaço suficiente para os arquivos resultantes. Para configurar o diretório que o **mysqlbinlog** usa para arquivos temporários, use a variável de ambiente `TMPDIR`.

O **mysqlbinlog** define o valor de `pseudo_replica_mode` ou `pseudo_slave_mode` para verdadeiro antes de executar quaisquer instruções SQL. Essa variável de sistema afeta o tratamento de transações XA, o timestamp de atraso de replicação `original_commit_timestamp` e a variável de sistema `original_server_version`, além de modos de SQL não suportados.

O **mysqlbinlog** suporta as seguintes opções, que podem ser especificadas na linha de comando ou nos grupos `[mysqlbinlog]` e `[client]` de um arquivo de opções. Para obter informações sobre os arquivos de opções usados pelos programas do MySQL, consulte a Seção 6.2.2.2, “Usando arquivos de opções”.

**Tabela 6.23 Opções do mysqlbinlog**

<table summary="Opções de linha de comando disponíveis para mysqlbinlog."><thead><tr><th scope="col">Nome da Opção</th> <th scope="col">Descrição</th> <th scope="col">Introduzido</th> <th scope="col">Desatualizado</th> </tr></thead><tbody><tr><th>--base64-output</th> <td>Imprimir entradas de log binário usando codificação base-64</td> <td></td> <td></td> </tr><tr><th>--bind-address</th> <td>Use a interface de rede especificada para se conectar ao servidor MySQL</td> <td></td> <td></td> </tr><tr><th>--binlog-row-event-max-size</th> <td>Tamanho máximo de evento no log binário</td> <td></td> <td></td> </tr><tr><th>--sets-de-caracteres-dir</th> <td>Diretório onde os conjuntos de caracteres são instalados</td> <td></td> <td></td> </tr><tr><th>--compress</th> <td>Compressar todas as informações enviadas entre o cliente e o servidor</td> <td>8.0.17</td> <td>8.0.18</td> </tr><tr><th>--algoritmos de compressão</th> <td>Algoritmos de compressão permitidos para conexões com o servidor</td> <td>8.0.18</td> <td></td> </tr><tr><th>--connection-server-id</th> <td>Utilizado para testes e depuração. Consulte o texto para obter os valores padrão aplicáveis e outras informações</td> <td></td> <td></td> </tr><tr><th>--database</th> <td>Listar entradas apenas para este banco de dados</td> <td></td> <td></td> </tr><tr><th>--debug</th> <td>Escreva o log de depuração</td> <td></td> <td></td> </tr><tr><th>--debug-check</th> <td>Imprimir informações de depuração quando o programa sai</td> <td></td> <td></td> </tr><tr><th>--debug-info</th> <td>Imprimir informações de depuração, memória e estatísticas da CPU quando o programa sai</td> <td></td> <td></td> </tr><tr><th>--default-auth</th> <td>Plugin de autenticação a ser usado</td> <td></td> <td></td> </tr><tr><th>--defaults-extra-file</th> <td>Leia o arquivo de opção nomeado, além dos arquivos de opção usuais</td> <td></td> <td></td> </tr><tr><th>--defaults-file</th> <td>Arquivo de opção de leitura apenas nomeado</td> <td></td> <td></td> </tr><tr><th>--defaults-group-suffix</th> <td>Valor do sufixo do grupo de opções</td> <td></td> <td></td> </tr><tr><th>--disable-log-bin</th> <td>Desativar o registro binário</td> <td></td> <td></td> </tr><tr><th>--exclude-gtids</th> <td>Não mostre nenhum dos grupos no conjunto de GTID fornecido</td> <td></td> <td></td> </tr><tr><th>--force-if-open</th> <td>Leia arquivos de log binários mesmo que estejam abertos ou não fechados corretamente</td> <td></td> <td></td> </tr><tr><th>--force-read</th> <td>Se o mysqlbinlog ler um evento de log binário que ele não reconhece, ele imprime uma mensagem de alerta</td> <td></td> <td></td> </tr><tr><th>--get-server-public-key</th> <td>Solicitar chave pública RSA do servidor</td> <td></td> <td></td> </tr><tr><th>--help</th> <td>Exibir mensagem de ajuda e sair</td> <td></td> <td></td> </tr><tr><th>--hexdump</th> <td>Exibir um dump hexadecimal do log nos comentários</td> <td></td> <td></td> </tr><tr><th>--host</th> <td>Anfitrião no qual o servidor MySQL está localizado</td> <td></td> <td></td> </tr><tr><th>--idempotente</th> <td>Fazer com que o servidor use o modo idempotente ao processar atualizações do log binário desta sessão apenas</td> <td></td> <td></td> </tr><tr><th>--include-gtids</th> <td>Mostrar apenas os grupos no conjunto de GTID fornecido</td> <td></td> <td></td> </tr><tr><th>--local-load</th> <td>Prepare arquivos temporários locais para o LOAD DATA no diretório especificado</td> <td></td> <td></td> </tr><tr><th>--login-path</th> <td>Leia as opções de caminho de login a partir de .mylogin.cnf</td> <td></td> <td></td> </tr><tr><th>--no-defaults</th> <td>Não ler arquivos de opção</td> <td></td> <td></td> </tr><tr><th>--offset</th> <td>Pular as primeiras N entradas no log</td> <td></td> <td></td> </tr><tr><th>--senha</th> <td>Senha para usar ao se conectar ao servidor</td> <td></td> <td></td> </tr><tr><th>--plugin-dir</th> <td>Diretório onde os plugins são instalados</td> <td></td> <td></td> </tr><tr><th>--port</th> <td>Número de porta TCP/IP para a conexão</td> <td></td> <td></td> </tr><tr><th>--print-defaults</th> <td>Opções padrão de impressão</td> <td></td> <td></td> </tr><tr><th>--print-table-metadata</th> <td>Imprimir metadados da tabela</td> <td></td> <td></td> </tr><tr><th>--protocolo</th> <td>Protocolo de transporte a ser utilizado</td> <td></td> <td></td> </tr><tr><th>--raw</th> <td>Escreva eventos no formato bruto (binário) para arquivos de saída</td> <td></td> <td></td> </tr><tr><th>--read-from-remote-master</th> <td>Leia o log binário de um servidor de origem de replicação MySQL em vez de ler um arquivo de log local</td> <td></td> <td>8.0.26</td> </tr><tr><th>--read-from-remote-server</th> <td>Leia o log binário do servidor MySQL em vez do arquivo de log local</td> <td></td> <td></td> </tr><tr><th>--read-from-remote-source</th> <td>Leia o log binário de um servidor de origem de replicação MySQL em vez de ler um arquivo de log local</td> <td>8.0.26</td> <td></td> </tr><tr><th>--require-row-format</th> <td>Exigir o formato de registro binário baseado em linha</td> <td>8.0.19</td> <td></td> </tr><tr><th>--result-file</th> <td>Saída direta para um arquivo nomeado</td> <td></td> <td></td> </tr><tr><th>--rewrite-db</th> <td>Crie regras de reescrita para bancos de dados ao reproduzir logs escritos em formato de linha. Pode ser usado várias vezes</td> <td></td> <td></td> </tr><tr><th>--server-id</th> <td>Extraia apenas os eventos criados pelo servidor com o ID do servidor fornecido</td> <td></td> <td></td> </tr><tr><th>--server-id-bits</th> <td>Informe ao mysqlbinlog como interpretar os IDs do servidor no log binário quando o log foi escrito por um mysqld com seus bits de ID do servidor configurados para menos que o máximo; suportado apenas pela versão do mysqlbinlog do MySQL Cluster</td> <td></td> <td></td> </tr><tr><th>--server-public-key-path</th> <td>Nome do caminho para o arquivo que contém a chave pública RSA</td> <td></td> <td></td> </tr><tr><th>--set-charset</th> <td>Adicione uma declaração SET NAMES charset_name ao resultado</td> <td></td> <td></td> </tr><tr><th>--shared-memory-base-name</th> <td>Nome de memória compartilhada para conexões de memória compartilhada (apenas Windows)</td> <td></td> <td></td> </tr><tr><th>--curta</th> <td>Exibir apenas as declarações contidas no log</td> <td></td> <td></td> </tr><tr><th>--skip-gtids</th> <td>Não inclua os GTIDs dos arquivos de log binário no arquivo de exclusão de saída</td> <td></td> <td></td> </tr><tr><th>--socket</th> <td>Arquivo de soquete Unix ou tubo nomeado do Windows a ser usado</td> <td></td> <td></td> </tr><tr><th>--ssl-ca</th> <td>Arquivo que contém a lista de Autoridades de Certificação SSL confiáveis</td> <td></td> <td></td> </tr><tr><th>--ssl-capath</th> <td>Diretório que contém arquivos de certificados de Autoridade de Certificação SSL confiáveis</td> <td></td> <td></td> </tr><tr><th>--ssl-cert</th> <td>Arquivo que contém o certificado X.509</td> <td></td> <td></td> </tr><tr><th>--ssl-cipher</th> <td>Cifras permitidas para criptografia de conexão</td> <td></td> <td></td> </tr><tr><th>--ssl-crl</th> <td>Arquivo que contém listas de revogação de certificados</td> <td></td> <td></td> </tr><tr><th>--ssl-crlpath</th> <td>Diretório que contém arquivos de lista de revogação de certificados</td> <td></td> <td></td> </tr><tr><th>--ssl-fips-mode</th> <td>Se deve habilitar o modo FIPS no lado do cliente</td> <td></td> <td>8.0.34</td> </tr><tr><th>--ssl-chave</th> <td>Arquivo que contém a chave X.509</td> <td></td> <td></td> </tr><tr><th>--ssl-mode</th> <td>Estado de segurança desejado da conexão com o servidor</td> <td></td> <td></td> </tr><tr><th>--ssl-session-data</th> <td>Arquivo que contém dados da sessão SSL</td> <td>8.0.29</td> <td></td> </tr><tr><th>--ssl-session-data-continue-on-failed-reuse</th> <td>Se estabelecer conexões se a reutilização da sessão falhar</td> <td>8.0.29</td> <td></td> </tr><tr><th>--start-datetime</th> <td>Leia o log binário a partir do primeiro evento com o timestamp igual ou posterior ao argumento datetime</td> <td></td> <td></td> </tr><tr><th>--start-position</th> <td>Decodificar o log binário a partir do primeiro evento com a posição igual ou maior que o argumento</td> <td></td> <td></td> </tr><tr><th>--stop-datetime</th> <td>Pare de ler o log binário no primeiro evento com o timestamp igual ou maior que o argumento datetime</td> <td></td> <td></td> </tr><tr><th>--stop-never</th> <td>Mantenha-se conectado ao servidor após ler o último arquivo de log binário</td> <td></td> <td></td> </tr><tr><th>--stop-never-slave-server-id</th> <td>ID do servidor escravo para relatar ao conectar-se ao servidor</td> <td></td> <td></td> </tr><tr><th>--stop-position</th> <td>Pare de decodificar o log binário no primeiro evento com a posição igual ou maior que o argumento</td> <td></td> <td></td> </tr><tr><th>--tls-ciphersuites</th> <td>Cifras TLSv1.3 permitidas para conexões criptografadas</td> <td>8.0.16</td> <td></td> </tr><tr><th>--tls-version</th> <td>Protocolos TLS permitidos para conexões criptografadas</td> <td></td> <td></td> </tr><tr><th>--to-last-log</th> <td>Não pare no final do log binário solicitado de um servidor MySQL, mas sim continue imprimindo até o final do último log binário</td> <td></td> <td></td> </tr><tr><th>--user</th> <td>Nome do usuário do MySQL a ser usado ao se conectar ao servidor</td> <td></td> <td></td> </tr><tr><th>--verbose</th> <td>Reconstrua eventos de linha como instruções SQL</td> <td></td> <td></td> </tr><tr><th>--verify-binlog-checksum</th> <td>Verifique os checksums no log binário</td> <td></td> <td></td> </tr><tr><th>--version</th> <td>Exibir informações da versão e sair</td> <td></td> <td></td> </tr><tr><th>--zstd-compression-level</th> <td>Nível de compressão para conexões com servidores que utilizam compressão zstd</td> <td>8.0.18</td> <td></td> </tr></tbody></table>

- `--help`, `-?`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>

  Exiba uma mensagem de ajuda e saia.

- `--base64-output=value`

  <table summary="Propriedades para saída base64"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--base64-output=value</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>AUTO</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>AUTO</code>]]</p><p class="valid-value">[[<code>NEVER</code>]]</p><p class="valid-value">[[<code>DECODE-ROWS</code>]]</p></td> </tr></tbody></table>

  Esta opção determina quando os eventos devem ser exibidos codificados como strings baseadas em 64 usando as instruções `BINLOG`. A opção tem esses valores permitidos (não case-sensitive):

  - `AUTO` ("automático") ou `UNSPEC` ("não especificado") exibe as declarações `BINLOG` automaticamente quando necessário (ou seja, para eventos de descrição de formato e eventos de linha). Se nenhuma opção `--base64-output` for fornecida, o efeito é o mesmo que `--base64-output=AUTO`.

    Nota

    A exibição automática do `BINLOG` é o único comportamento seguro se você pretende usar a saída do **mysqlbinlog** para reexecutar o conteúdo do arquivo de log binário. Os outros valores das opções são destinados apenas para fins de depuração ou teste, pois podem produzir saída que não inclui todos os eventos na forma executável.

  - `NEVER` faz com que as instruções `BINLOG` não sejam exibidas. **mysqlbinlog** sai com um erro se um evento de linha for encontrado que deve ser exibido usando `BINLOG`.

  - `DECODE-ROWS` especifica para o **mysqlbinlog** que você deseja que os eventos de linha sejam decodificados e exibidos como instruções SQL comentadas, especificando também a opção `--verbose`. Assim como `NEVER`, `DECODE-ROWS` suprime a exibição de instruções `BINLOG`, mas, ao contrário de `NEVER`, ele não sai com um erro se um evento de linha for encontrado.

  Para exemplos que mostram o efeito de `--base64-output` e `--verbose` na saída de eventos de linha, consulte a Seção 6.6.9.2, “Exibição de Eventos de Linha mysqlbinlog”.

- `--bind-address=ip_address`

  <table summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>

  Em um computador com várias interfaces de rede, use esta opção para selecionar qual interface usar para se conectar ao servidor MySQL.

- `--binlog-row-event-max-size=N`

  <table summary="Propriedades para binlog-row-event-max-size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--binlog-row-event-max-size=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td>[[<code>4294967040</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>256</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>18446744073709547520</code>]]</td> </tr></tbody></table>

  Especifique o tamanho máximo de um evento de registro binário baseado em linha, em bytes. As linhas são agrupadas em eventos menores que esse tamanho, se possível. O valor deve ser um múltiplo de 256. O valor padrão é de 4 GB.

- `--character-sets-dir=dir_name`

  <table summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=dir_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>

  O diretório onde os conjuntos de caracteres são instalados. Consulte a Seção 12.15, “Configuração de Conjunto de Caracteres”.

- `--compress`

  <table summary="Propriedades para comprimir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--compress[={OFF|ON}]</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.17</td> </tr><tr><th>Desatualizado</th> <td>8.0.18</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

  Compressa todas as informações enviadas entre o cliente e o servidor, se possível. Consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.

  Essa opção foi adicionada no MySQL 8.0.17. A partir do MySQL 8.0.18, ela está desatualizada. Espera-se que ela seja removida em uma versão futura do MySQL. Consulte Configurando a Compressão de Conexão Legado.

- `--compression-algorithms=value`

  <table summary="Propriedades para algoritmos de compressão"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--compression-algorithms=value</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.18</td> </tr><tr><th>Tipo</th> <td>Conjunto</td> </tr><tr><th>Valor padrão</th> <td>[[<code>uncompressed</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>zlib</code>]]</p><p class="valid-value">[[<code>zstd</code>]]</p><p class="valid-value">[[<code>uncompressed</code>]]</p></td> </tr></tbody></table>

  Os algoritmos de compressão permitidos para conexões ao servidor. Os algoritmos disponíveis são os mesmos da variável de sistema `protocol_compression_algorithms`. O valor padrão é `uncompressed`.

  Para obter mais informações, consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.

  Essa opção foi adicionada no MySQL 8.0.18.

- `--connection-server-id=server_id`

  <table summary="Propriedades para conexão-server-id"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--connection-server-id=#]</code>]]</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>0 (1)</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0 (1)</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>4294967295</code>]]</td> </tr></tbody></table>

  `--connection-server-id` especifica o ID do servidor que o **mysqlbinlog** relata quando se conecta ao servidor. Ele pode ser usado para evitar um conflito com o ID de um servidor replica ou outro processo **mysqlbinlog**.

  Se a opção `--read-from-remote-server` for especificada, o **mysqlbinlog** informa um ID de servidor de 0, o que indica ao servidor que se desconecte após enviar o último arquivo de log (comportamento não bloqueante). Se a opção `--stop-never` também for especificada para manter a conexão com o servidor, o **mysqlbinlog** informa um ID de servidor padrão de 1 em vez de 0, e o `--connection-server-id` pode ser usado para substituir esse ID de servidor, se necessário. Veja a Seção 6.6.9.4, “Especificação do ID de servidor mysqlbinlog”.

- `--database=db_name`, `-d db_name`

  <table summary="Propriedades para banco de dados"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--database=db_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>

  Essa opção faz com que o **mysqlbinlog** exiba entradas do log binário (apenas o log local) que ocorrem enquanto `db_name` está sendo selecionado como o banco de dados padrão pelo `USE`.

  A opção `--database` para **mysqlbinlog** é semelhante à opção `--binlog-do-db` para **mysqld**, mas pode ser usada para especificar apenas um banco de dados. Se `--database` for fornecido várias vezes, apenas a última instância será usada.

  Os efeitos dessa opção dependem se o formato de registro baseado em declarações ou baseado em linhas está em uso, da mesma forma que os efeitos do `--binlog-do-db` dependem se o registro baseado em declarações ou baseado em linhas está em uso.

  **Registro baseado em declarações.** A opção `--database` funciona da seguinte forma:

  - Embora `db_name` seja o banco de dados padrão, as instruções são exibidas independentemente de elas modificarem tabelas em `db_name` ou em outro banco de dados.

  - A menos que `db_name` seja selecionado como banco de dados padrão, as declarações não são exibidas, mesmo que modifiquem tabelas em `db_name`.

  - Há uma exceção para `CREATE DATABASE`, `ALTER DATABASE` e `DROP DATABASE`. O banco de dados que está sendo *criado, alterado ou excluído* é considerado o banco de dados padrão ao determinar se a instrução deve ser exibida.

  Suponha que o log binário foi criado executando essas instruções usando o registro baseado em instruções:

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

  **mysqlbinlog --database=test** não exibe as duas primeiras instruções `INSERT` porque não há um banco de dados padrão. Ele exibe as três instruções `INSERT` que seguem `USE test`, mas não as três instruções `INSERT` que seguem `USE db2`.

  **mysqlbinlog --database=db2** não exibe as duas primeiras instruções `INSERT` porque não há um banco de dados padrão. Não exibe as três instruções `INSERT` que seguem `USE test`, mas exibe as três instruções `INSERT` que seguem `USE db2`.

  **Registro baseado em linhas.** **mysqlbinlog** exibe apenas as entradas que alteram tabelas pertencentes a `db_name`. O banco de dados padrão não tem efeito sobre isso. Suponha que o log binário recém-descrito tenha sido criado usando registro baseado em linhas, em vez de registro baseado em instruções. **mysqlbinlog --database=test** exibe apenas as entradas que modificam `t1` no banco de dados test, independentemente de `USE` ter sido emitido ou qual seja o banco de dados padrão.

  Se um servidor estiver rodando com `binlog_format` definido como `MIXED` e você quiser que seja possível usar o **mysqlbinlog** com a opção `--database`, você deve garantir que as tabelas que são modificadas estejam no banco de dados selecionado por `USE`. (Em particular, não devem ser usadas atualizações cruzadas entre bancos de dados.)

  Quando usado juntamente com a opção `--rewrite-db`, a opção `--rewrite-db` é aplicada primeiro; em seguida, a opção `--database` é aplicada, usando o nome do banco de dados reescrito. A ordem em que as opções são fornecidas não faz diferença nesse sentido.

- `--debug[=debug_options]`, `-# [debug_options]`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>0

  Escreva um log de depuração. Uma string típica `debug_options` é `d:t:o,file_name`. O padrão é `d:t:o,/tmp/mysqlbinlog.trace`.

  Esta opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são construídos usando essa opção.

- `--debug-check`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>1

  Imprima algumas informações de depuração quando o programa sair.

  Esta opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são construídos usando essa opção.

- `--debug-info`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>2

  Imprima informações de depuração, estatísticas de uso de memória e CPU quando o programa sair.

  Esta opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são construídos usando essa opção.

- `--default-auth=plugin`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>3

  Uma dica sobre qual plugin de autenticação do lado do cliente deve ser usado. Veja a Seção 8.2.17, “Autenticação Personalizável”.

- `--defaults-extra-file=file_name`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>4

  Leia este arquivo de opção após o arquivo de opção global, mas (no Unix) antes do arquivo de opção do usuário. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se `file_name` não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--defaults-file=file_name`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>5

  Use apenas o arquivo de opção fornecido. Se o arquivo não existir ou estiver inacessível, ocorrerá um erro. Se `file_name` não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

  Exceção: Mesmo com `--defaults-file`, os programas de cliente leem `.mylogin.cnf`.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--defaults-group-suffix=str`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>6

  Leia não apenas os grupos de opções usuais, mas também grupos com os nomes usuais e um sufixo de `str`. Por exemplo, **mysqlbinlog** normalmente lê os grupos `[client]` e `[mysqlbinlog]`. Se esta opção for dada como `--defaults-group-suffix=_other`, **mysqlbinlog** também lê os grupos `[client_other]` e `[mysqlbinlog_other]`.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--disable-log-bin`, `-D`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>7

  Desative o registro binário. Isso é útil para evitar um loop infinito se você usar a opção `--to-last-log` e estiver enviando a saída para o mesmo servidor MySQL. Esta opção também é útil ao restaurar após uma saída inesperada para evitar a duplicação das declarações que você registrou.

  Essa opção faz com que o **mysqlbinlog** inclua uma declaração `SET sql_log_bin = 0` em sua saída para desabilitar o registro binário do restante da saída. Manipular o valor da sessão da variável de sistema `sql_log_bin` é uma operação restrita, portanto, essa opção exige que você tenha privilégios suficientes para definir variáveis de sessão restritas. Veja a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”.

- `--exclude-gtids=gtid_set`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>8

  Não exiba nenhum dos grupos listados no `gtid_set`.

- `--force-if-open`, `-F`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>9

  Leia arquivos de log binários mesmo que estejam abertos ou não tenham sido fechados corretamente (a bandeira `IN_USE` está definida); não falhe se o arquivo terminar com um evento truncado.

  A bandeira `IN_USE` é definida apenas para o log binário que está sendo escrito atualmente pelo servidor; se o servidor falhar, a bandeira permanece definida até que o servidor seja reiniciado e o log binário seja recuperado. Sem essa opção, o **mysqlbinlog** se recusa a processar um arquivo com essa bandeira definida. Como o servidor pode estar no processo de gravação do arquivo, o corte do último evento é considerado normal.

- `--force-read`, `-f`

  <table summary="Propriedades para saída base64"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--base64-output=value</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>AUTO</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>AUTO</code>]]</p><p class="valid-value">[[<code>NEVER</code>]]</p><p class="valid-value">[[<code>DECODE-ROWS</code>]]</p></td> </tr></tbody></table>0

  Com essa opção, se o **mysqlbinlog** ler um evento de log binário que ele não reconhece, ele imprime um aviso, ignora o evento e continua. Sem essa opção, o **mysqlbinlog** para se parar se ler tal evento.

- `--get-server-public-key`

  <table summary="Propriedades para saída base64"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--base64-output=value</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>AUTO</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>AUTO</code>]]</p><p class="valid-value">[[<code>NEVER</code>]]</p><p class="valid-value">[[<code>DECODE-ROWS</code>]]</p></td> </tr></tbody></table>1

  Peça à rede o par de chaves públicas necessário para a troca de senhas com base em pares de chaves RSA. Esta opção aplica-se a clientes que se autenticam com o plugin de autenticação `caching_sha2_password`. Para esse plugin, o servidor não envia a chave pública a menos que seja solicitado. Esta opção é ignorada para contas que não se autenticam com esse plugin. Também é ignorada se a troca de senha com base em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

  Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele terá precedência sobre `--get-server-public-key`.

  Para obter informações sobre o plugin `caching_sha2_password`, consulte a Seção 8.4.1.2, “Cacheamento de Autenticação Conectada a SHA-2”.

- `--hexdump`, `-H`

  <table summary="Propriedades para saída base64"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--base64-output=value</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>AUTO</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>AUTO</code>]]</p><p class="valid-value">[[<code>NEVER</code>]]</p><p class="valid-value">[[<code>DECODE-ROWS</code>]]</p></td> </tr></tbody></table>2

  Exiba um dump hexadecimal do log nos comentários, conforme descrito na Seção 6.6.9.1, "Formato de Dump Hexadecimal mysqlbinlog". A saída hexadecimal pode ser útil para depuração de replicação.

- `--host=host_name`, `-h host_name`

  <table summary="Propriedades para saída base64"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--base64-output=value</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>AUTO</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>AUTO</code>]]</p><p class="valid-value">[[<code>NEVER</code>]]</p><p class="valid-value">[[<code>DECODE-ROWS</code>]]</p></td> </tr></tbody></table>3

  Obtenha o log binário do servidor MySQL no host fornecido.

- `--idempotent`

  <table summary="Propriedades para saída base64"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--base64-output=value</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>AUTO</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>AUTO</code>]]</p><p class="valid-value">[[<code>NEVER</code>]]</p><p class="valid-value">[[<code>DECODE-ROWS</code>]]</p></td> </tr></tbody></table>4

  Informe ao servidor MySQL para usar o modo idempotente durante o processamento de atualizações; isso causa a supressão de quaisquer erros de chave duplicada ou chave não encontrada que o servidor encontrar na sessão atual durante o processamento de atualizações. Esta opção pode ser útil sempre que seja desejável ou necessário refazer um ou mais logs binários para um servidor MySQL que pode não conter todos os dados aos quais os logs se referem.

  O escopo de efeito para esta opção inclui apenas o cliente e a sessão atuais **mysqlbinlog**.

- `--include-gtids=gtid_set`

  <table summary="Propriedades para saída base64"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--base64-output=value</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>AUTO</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>AUTO</code>]]</p><p class="valid-value">[[<code>NEVER</code>]]</p><p class="valid-value">[[<code>DECODE-ROWS</code>]]</p></td> </tr></tbody></table>5

  Exiba apenas os grupos listados no `gtid_set`.

- `--local-load=dir_name`, `-l dir_name`

  <table summary="Propriedades para saída base64"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--base64-output=value</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>AUTO</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>AUTO</code>]]</p><p class="valid-value">[[<code>NEVER</code>]]</p><p class="valid-value">[[<code>DECODE-ROWS</code>]]</p></td> </tr></tbody></table>6

  Para operações de carregamento de dados correspondentes às instruções `LOAD DATA`, o **mysqlbinlog** extrai os arquivos dos eventos do log binário, escreve-os como arquivos temporários no sistema de arquivos local e escreve as instruções `LOAD DATA LOCAL` para fazer com que os arquivos sejam carregados. Por padrão, o **mysqlbinlog** escreve esses arquivos temporários em um diretório específico do sistema operacional. A opção `--local-load` pode ser usada para especificar explicitamente o diretório onde o **mysqlbinlog** deve preparar arquivos temporários locais.

  Como outros processos podem gravar arquivos no diretório padrão específico do sistema, é aconselhável especificar a opção `--local-load` para o **mysqlbinlog** para designar um diretório diferente para os arquivos de dados, e, em seguida, designar o mesmo diretório especificando a opção `--load-data-local-dir` para o **mysql** ao processar a saída do **mysqlbinlog**. Por exemplo:

  ```
  mysqlbinlog --local-load=/my/local/data ...
      | mysql --load-data-local-dir=/my/local/data ...
  ```

  Importante

  Esses arquivos temporários não são removidos automaticamente pelo **mysqlbinlog** ou por qualquer outro programa do MySQL.

- `--login-path=name`

  <table summary="Propriedades para saída base64"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--base64-output=value</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>AUTO</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>AUTO</code>]]</p><p class="valid-value">[[<code>NEVER</code>]]</p><p class="valid-value">[[<code>DECODE-ROWS</code>]]</p></td> </tr></tbody></table>7

  Leia as opções do caminho de login nomeado no arquivo de caminho de login `.mylogin.cnf`. Um “caminho de login” é um grupo de opções que contém opções que especificam para qual servidor MySQL se conectar e qual conta autenticar. Para criar ou modificar um arquivo de caminho de login, use o utilitário **mysql\_config\_editor**. Veja a Seção 6.6.7, “mysql\_config\_editor — Utilitário de Configuração MySQL”.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--no-defaults`

  <table summary="Propriedades para saída base64"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--base64-output=value</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>AUTO</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>AUTO</code>]]</p><p class="valid-value">[[<code>NEVER</code>]]</p><p class="valid-value">[[<code>DECODE-ROWS</code>]]</p></td> </tr></tbody></table>8

  Não leia nenhum arquivo de opções. Se o início do programa falhar devido à leitura de opções desconhecidas de um arquivo de opções, `--no-defaults` pode ser usado para impedir que sejam lidas.

  A exceção é que o arquivo `.mylogin.cnf` é lido em todos os casos, se existir. Isso permite que as senhas sejam especificadas de uma maneira mais segura do que na linha de comando, mesmo quando o `--no-defaults` é usado. Para criar o `.mylogin.cnf`, use o utilitário **mysql\_config\_editor**. Veja a Seção 6.6.7, “mysql\_config\_editor — Utilitário de Configuração do MySQL”.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--offset=N`, `-o N`

  <table summary="Propriedades para saída base64"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--base64-output=value</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>AUTO</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>AUTO</code>]]</p><p class="valid-value">[[<code>NEVER</code>]]</p><p class="valid-value">[[<code>DECODE-ROWS</code>]]</p></td> </tr></tbody></table>9

  Ignorar as primeiras entradas `N` no log.

- `--open-files-limit=N`

  <table summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>0

  Especifique o número de descritores de arquivo abertos a serem reservados.

- `--password[=password]`, `-p[password]`

  <table summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>1

  A senha da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecido, o **mysqlbinlog** solicitará uma senha. Se for fornecida, não deve haver **espaço** entre `--password=` ou `-p` e a senha que o segue. Se nenhuma opção de senha for especificada, o padrão é não enviar a senha.

  Especificar uma senha na linha de comando deve ser considerado inseguro. Para evitar fornecer a senha na linha de comando, use um arquivo de opção. Consulte a Seção 8.1.2.1, "Diretrizes para o Usuário Final sobre Segurança de Senhas".

  Para especificar explicitamente que não há senha e que o **mysqlbinlog** não deve solicitar uma senha, use a opção `--skip-password`.

- `--plugin-dir=dir_name`

  <table summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>2

  O diretório onde procurar por plugins. Especifique esta opção se a opção `--default-auth` for usada para especificar um plugin de autenticação, mas o **mysqlbinlog** não encontrá-lo. Veja a Seção 8.2.17, “Autenticação Personalizável”.

- `--port=port_num`, `-P port_num`

  <table summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>3

  O número da porta TCP/IP a ser usado para se conectar a um servidor remoto.

- `--print-defaults`

  <table summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>4

  Imprima o nome do programa e todas as opções que ele obtém a partir de arquivos de opção.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--print-table-metadata`

  <table summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>5

  Imprima metadados relacionados à tabela do log binário. Configure a quantidade de metadados binários relacionados à tabela registrados usando `binlog-row-metadata`.

- `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>6

  O protocolo de transporte a ser usado para se conectar ao servidor. É útil quando os outros parâmetros de conexão normalmente resultam no uso de um protocolo diferente do que você deseja. Para obter detalhes sobre os valores permitidos, consulte a Seção 6.2.7, “Protocolos de Transporte de Conexão”.

- `--raw`

  <table summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>7

  Por padrão, o **mysqlbinlog** lê arquivos de log binários e escreve eventos no formato de texto. A opção `--raw` indica ao **mysqlbinlog** que escreva-os em seu formato binário original. Seu uso requer que `--read-from-remote-server` também seja usado, pois os arquivos são solicitados a partir de um servidor. O **mysqlbinlog** escreve um arquivo de saída para cada arquivo lido do servidor. A opção `--raw` pode ser usada para fazer um backup do log binário de um servidor. Com a opção `--stop-never`, o backup é “ativo” porque o **mysqlbinlog** permanece conectado ao servidor. Por padrão, os arquivos de saída são escritos no diretório atual com os mesmos nomes dos arquivos de log originais. Os nomes dos arquivos de saída podem ser modificados usando a opção `--result-file`. Para mais informações, consulte a Seção 6.6.9.3, “Usando o mysqlbinlog para fazer backup de arquivos de log binário”.

- `--read-from-remote-source=type`

  <table summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>8

  A partir do MySQL 8.0.26, use `--read-from-remote-source`, e antes do MySQL 8.0.26, use `--read-from-remote-master`. Ambas as opções têm o mesmo efeito. As opções leem logs binários de um servidor MySQL com os comandos `COM_BINLOG_DUMP` ou `COM_BINLOG_DUMP_GTID`, definindo o valor da opção para `BINLOG-DUMP-NON-GTIDS` ou `BINLOG-DUMP-GTIDS`, respectivamente. Se `--read-from-remote-source=BINLOG-DUMP-GTIDS` ou `--read-from-remote-master=BINLOG-DUMP-GTIDS` for combinado com `--exclude-gtids`, as transações podem ser filtradas na fonte, evitando o tráfego de rede desnecessário.

  As opções de parâmetros de conexão são usadas com essas opções ou com a opção `--read-from-remote-server`. Essas opções são `--host`, `--password`, `--port`, `--protocol`, `--socket` e `--user`. Se nenhuma das opções remotas for especificada, as opções de parâmetros de conexão são ignoradas.

  O privilégio `REPLICATION SLAVE` é necessário para usar essas opções.

- `--read-from-remote-master=type`

  <table summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>9

  Use esta opção antes do MySQL 8.0.26 em vez de `--read-from-remote-source`. Ambas as opções têm o mesmo efeito.

- `--read-from-remote-server=file_name`, `-R`

  <table summary="Propriedades para binlog-row-event-max-size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--binlog-row-event-max-size=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td>[[<code>4294967040</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>256</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>18446744073709547520</code>]]</td> </tr></tbody></table>0

  Leia o log binário de um servidor MySQL em vez de ler um arquivo de log local. Esta opção exige que o servidor remoto esteja em execução. Funciona apenas para arquivos de log binário no servidor remoto e não para arquivos de log de retransmissão. Aceita o nome do arquivo de log binário (incluindo o sufixo numérico) sem o caminho do arquivo.

  As opções de parâmetros de conexão são usadas com esta opção ou com a opção `--read-from-remote-master`. Estas opções são `--host`, `--password`, `--port`, `--protocol`, `--socket` e `--user`. Se nenhuma das opções remotas for especificada, as opções de parâmetros de conexão são ignoradas.

  O privilégio `REPLICATION SLAVE` é necessário para usar essa opção.

  Essa opção é como `--read-from-remote-master=BINLOG-DUMP-NON-GTIDS`.

- `--result-file=name`, `-r name`

  <table summary="Propriedades para binlog-row-event-max-size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--binlog-row-event-max-size=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td>[[<code>4294967040</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>256</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>18446744073709547520</code>]]</td> </tr></tbody></table>1

  Sem a opção `--raw`, essa opção indica o arquivo para o qual o **mysqlbinlog** escreve a saída de texto. Com `--raw`, o **mysqlbinlog** escreve um arquivo de saída binário para cada arquivo de log transferido do servidor, escrevendo-os, por padrão, no diretório atual usando os mesmos nomes do arquivo de log original. Nesse caso, o valor da opção `--result-file` é tratado como um prefixo que modifica os nomes dos arquivos de saída.

- `--require-row-format`

  <table summary="Propriedades para binlog-row-event-max-size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--binlog-row-event-max-size=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td>[[<code>4294967040</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>256</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>18446744073709547520</code>]]</td> </tr></tbody></table>2

  Exigir o formato de registro binário baseado em linhas para eventos. Esta opção obriga a eventos de replicação baseados em linhas para a saída do **mysqlbinlog**. O fluxo de eventos produzido com esta opção seria aceito por um canal de replicação que seja protegido usando a opção `REQUIRE_ROW_FORMAT` da declaração `CHANGE REPLICATION SOURCE TO` (a partir do MySQL 8.0.23) ou da declaração `CHANGE MASTER TO` (antes do MySQL 8.0.23). `binlog_format=ROW` deve ser definido no servidor onde o log binário foi escrito. Quando você especifica esta opção, o **mysqlbinlog** pára com uma mensagem de erro se encontrar quaisquer eventos que sejam proibidos sob as restrições `REQUIRE_ROW_FORMAT`, incluindo instruções `LOAD DATA INFILE`, criação ou remoção de tabelas temporárias, `INTVAR`, `RAND` ou `USER_VAR`, e eventos não baseados em linhas dentro de uma transação DML. O **mysqlbinlog** também imprime uma declaração `SET @@session.require_row_format` no início de sua saída para aplicar as restrições quando a saída é executada e não imprime a declaração `SET @@session.pseudo_thread_id`.

  Essa opção foi adicionada no MySQL 8.0.19.

- `--rewrite-db='from_name->to_name'`

  <table summary="Propriedades para binlog-row-event-max-size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--binlog-row-event-max-size=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td>[[<code>4294967040</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>256</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>18446744073709547520</code>]]</td> </tr></tbody></table>3

  Ao ler um log baseado em linhas ou em declarações, substitua todas as ocorrências de `from_name` por `to_name`. A reescrita é feita nas linhas, para logs baseados em linhas, bem como nas cláusulas `USE` para logs baseados em declarações.

  Aviso

  As declarações nas quais os nomes das tabelas são qualificados com os nomes dos bancos de dados não são reescritas para usar o novo nome ao usar essa opção.

  A regra de reescrita empregada como valor para esta opção é uma string com a forma `'from_name->to_name'`, conforme mostrado anteriormente, e, por isso, deve ser colocada entre aspas.

  Para usar várias regras de reescrita, especifique a opção várias vezes, conforme mostrado aqui:

  ```
  mysqlbinlog --rewrite-db='dbcurrent->dbold' --rewrite-db='dbtest->dbcurrent' \
      binlog.00001 > /tmp/statements.sql
  ```

  Quando usado juntamente com a opção `--database`, a opção `--rewrite-db` é aplicada primeiro; em seguida, a opção `--database` é aplicada, usando o nome do banco de dados reescrito. A ordem em que as opções são fornecidas não faz diferença nesse sentido.

  Isso significa, por exemplo, que se o **mysqlbinlog** for iniciado com `--rewrite-db='mydb->yourdb' --database=yourdb`, todas as atualizações em quaisquer tabelas nos bancos de dados `mydb` e `yourdb` serão incluídas na saída. Por outro lado, se for iniciado com `--rewrite-db='mydb->yourdb' --database=mydb`, o **mysqlbinlog** não emitirá nenhuma declaração: como todas as atualizações em `mydb` são reescritas primeiro como atualizações em `yourdb` antes de aplicar a opção `--database`, não restam atualizações que correspondam a `--database=mydb`.

- `--server-id=id`

  <table summary="Propriedades para binlog-row-event-max-size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--binlog-row-event-max-size=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td>[[<code>4294967040</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>256</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>18446744073709547520</code>]]</td> </tr></tbody></table>4

  Exiba apenas os eventos criados pelo servidor com o ID do servidor fornecido.

- `--server-id-bits=N`

  <table summary="Propriedades para binlog-row-event-max-size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--binlog-row-event-max-size=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td>[[<code>4294967040</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>256</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>18446744073709547520</code>]]</td> </tr></tbody></table>5

  Use apenas os primeiros `N` bits do `server_id` para identificar o servidor. Se o log binário foi escrito por um **mysqld** com bits de ID do servidor definidos para menos de 32 e os dados do usuário armazenados no bit mais significativo, executar **mysqlbinlog** com `--server-id-bits` definido para 32 permite que esses dados sejam vistos.

  Esta opção é suportada apenas pela versão do **mysqlbinlog** fornecida com a distribuição do NDB Cluster ou construída com suporte ao NDB Cluster.

- `--server-public-key-path=file_name`

  <table summary="Propriedades para binlog-row-event-max-size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--binlog-row-event-max-size=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td>[[<code>4294967040</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>256</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>18446744073709547520</code>]]</td> </tr></tbody></table>6

  O nome do caminho de um arquivo no formato PEM que contém uma cópia do lado do cliente da chave pública necessária pelo servidor para a troca de senhas com par de chaves RSA. Esta opção aplica-se a clientes que se autenticam com o plugin de autenticação `sha256_password` ou `caching_sha2_password`. Esta opção é ignorada para contas que não se autenticam com um desses plugins. Também é ignorada se a troca de senha com base em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

  Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele terá precedência sobre `--get-server-public-key`.

  Para `sha256_password`, esta opção só se aplica se o MySQL foi construído usando o OpenSSL.

  Para obter informações sobre os plugins `sha256_password` e `caching_sha2_password`, consulte a Seção 8.4.1.3, “Autenticação Conectada a SHA-256”, e a Seção 8.4.1.2, “Cache de Autenticação Conectada a SHA-2”.

- `--set-charset=charset_name`

  <table summary="Propriedades para binlog-row-event-max-size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--binlog-row-event-max-size=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td>[[<code>4294967040</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>256</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>18446744073709547520</code>]]</td> </tr></tbody></table>7

  Adicione uma declaração `SET NAMES charset_name` ao resultado para especificar o conjunto de caracteres a ser usado para processar arquivos de log.

- `--shared-memory-base-name=name`

  <table summary="Propriedades para binlog-row-event-max-size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--binlog-row-event-max-size=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td>[[<code>4294967040</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>256</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>18446744073709547520</code>]]</td> </tr></tbody></table>8

  Em Windows, o nome de memória compartilhada a ser usado para conexões feitas usando memória compartilhada para um servidor local. O valor padrão é \[\[`MYSQL`]. O nome de memória compartilhada é sensível a maiúsculas e minúsculas.

  Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `shared_memory` habilitada para suportar conexões de memória compartilhada.

- `--short-form`, `-s`

  <table summary="Propriedades para binlog-row-event-max-size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--binlog-row-event-max-size=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td>[[<code>4294967040</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>256</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>18446744073709547520</code>]]</td> </tr></tbody></table>9

  Exiba apenas as declarações contidas no log, sem nenhuma informação extra ou eventos baseados em linhas. Isso é apenas para testes e não deve ser usado em sistemas de produção. Ele está desatualizado e você deve esperar que ele seja removido em uma futura versão.

- `--skip-gtids[=(true|false)]`

  <table summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=dir_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>0

  Não inclua os GTIDs dos arquivos de log binário no arquivo de exclusão de saída. Por exemplo:

  ```
  mysqlbinlog --skip-gtids binlog.000001 >  /tmp/dump.sql
  mysql -u root -p -e "source /tmp/dump.sql"
  ```

  Normalmente, você não deve usar essa opção em produção ou na recuperação, exceto nos cenários específicos e raros em que os GTIDs são indesejados ativamente. Por exemplo, um administrador pode querer duplicar transações selecionadas (como definições de tabelas) de uma implantação para outra, não relacionada, que não será replicada para ou a partir do original. Nesse cenário, o `--skip-gtids` pode ser usado para permitir que o administrador aplique as transações como se fossem novas e garanta que as implantações permaneçam não relacionadas. No entanto, você deve usar essa opção apenas se a inclusão dos GTIDs causar um problema conhecido para o seu caso de uso.

- `--socket=path`, `-S path`

  <table summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=dir_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>1

  Para conexões ao `localhost`, o arquivo de socket Unix a ser usado ou, no Windows, o nome do tubo nomeado a ser usado.

  No Windows, essa opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões de canal nomeado. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.

- `--ssl*`

  As opções que começam com `--ssl` especificam se você deseja se conectar ao servidor usando criptografia e indicam onde encontrar as chaves e certificados SSL. Consulte Opções de comando para conexões criptografadas.

- `--ssl-fips-mode={OFF|ON|STRICT}`

  <table summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=dir_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>2

  Controla se o modo FIPS deve ser habilitado no lado do cliente. A opção `--ssl-fips-mode` difere de outras opções `--ssl-xxx` porque não é usada para estabelecer conexões criptografadas, mas sim para determinar quais operações criptográficas devem ser permitidas. Veja a Seção 8.8, “Suporte FIPS”.

  Estes valores `--ssl-fips-mode` são permitidos:

  - `OFF`: Desative o modo FIPS.
  - `ON`: Habilitar o modo FIPS.
  - `STRICT`: Habilitar o modo FIPS "estricto".

  Nota

  Se o Módulo de Objeto FIPS OpenSSL não estiver disponível, o único valor permitido para `--ssl-fips-mode` é `OFF`. Nesse caso, definir `--ssl-fips-mode` para `ON` ou `STRICT` faz com que o cliente emita um aviso na inicialização e opere no modo não FIPS.

  A partir do MySQL 8.0.34, essa opção está desatualizada. Espera-se que ela seja removida em uma versão futura do MySQL.

- `--start-datetime=datetime`

  <table summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=dir_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>3

  Comece a ler o log binário a partir do primeiro evento com um timestamp igual ou posterior ao argumento `datetime`. O valor `datetime` é relativo ao fuso horário local da máquina onde você executa o **mysqlbinlog**. O valor deve estar em um formato aceito para os tipos de dados `DATETIME` ou `TIMESTAMP`. Por exemplo:

  ```
  mysqlbinlog --start-datetime="2005-12-25 11:25:56" binlog.000003
  ```

  Essa opção é útil para a recuperação em um ponto específico. Veja a Seção 9.5, “Recuperação em um Ponto Específico (Incremental) de Recuperação”).

- `--start-position=N`, `-j N`

  <table summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=dir_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>4

  Comece a decodificar o log binário na posição do log `N`, incluindo na saída quaisquer eventos que comecem na posição `N` ou depois. A posição é um ponto de byte no arquivo de log, não um contador de eventos; ela precisa apontar para a posição inicial de um evento para gerar uma saída útil. Esta opção se aplica ao primeiro arquivo de log nomeado na linha de comando.

  Antes do MySQL 8.0.33, o valor máximo suportado para essa opção era 4294967295 (232-1). No MySQL 8.0.33 e versões posteriores, é 18446744073709551616 (264-1), a menos que `--read-from-remote-server` ou `--read-from-remote-source` também esteja sendo usado, caso em que o máximo é 4294967295.

  Essa opção é útil para a recuperação em um ponto específico. Veja a Seção 9.5, “Recuperação em um Ponto Específico (Incremental) de Recuperação”).

- `--stop-datetime=datetime`

  <table summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=dir_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>5

  Pare de ler o log binário no primeiro evento com um timestamp igual ou posterior ao argumento `datetime`. Consulte a descrição da opção `--start-datetime` para obter informações sobre o valor `datetime`.

  Essa opção é útil para a recuperação em um ponto específico. Veja a Seção 9.5, “Recuperação em um Ponto Específico (Incremental) de Recuperação”).

- `--stop-never`

  <table summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=dir_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>6

  Esta opção é usada com `--read-from-remote-server`. Ela informa ao **mysqlbinlog** para permanecer conectado ao servidor. Caso contrário, o **mysqlbinlog** sai quando o último arquivo de log é transferido do servidor. `--stop-never` implica em `--to-last-log`, então apenas o primeiro arquivo de log a ser transferido precisa ser nomeado na linha de comando.

  `--stop-never` é comumente usado com `--raw` para fazer um backup de log binário em tempo real, mas também pode ser usado sem `--raw` para manter uma exibição contínua de eventos de log à medida que o servidor os gera.

  Com `--stop-never`, por padrão, o **mysqlbinlog** reporta um ID de servidor de 1 quando se conecta ao servidor. Use `--connection-server-id` para especificar explicitamente um ID alternativo a ser reportado. Ele pode ser usado para evitar um conflito com o ID de um servidor replica ou outro processo **mysqlbinlog**. Veja a Seção 6.6.9.4, “Especificando o ID do Servidor mysqlbinlog”.

- `--stop-never-slave-server-id=id`

  <table summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=dir_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>7

  Esta opção está desatualizada; espere-se que seja removida em uma futura versão. Use a opção `--connection-server-id` em vez disso para especificar um ID de servidor para o **mysqlbinlog** para relatar.

- `--stop-position=N`

  <table summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=dir_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>8

  Pare de decodificar o log binário na posição do log `N`, excluindo da saída quaisquer eventos que comecem na posição `N` ou depois. A posição é um ponto de byte no arquivo de log, não um contador de eventos; ela precisa apontar para um ponto após a posição inicial do último evento que você deseja incluir na saída. O evento que começa antes da posição `N` e termina na ou depois da posição é o último evento a ser processado. Esta opção se aplica ao último arquivo de log nomeado na linha de comando.

  Essa opção é útil para a recuperação em um ponto específico. Veja a Seção 9.5, “Recuperação em um Ponto Específico (Incremental) de Recuperação”).

- `--tls-ciphersuites=ciphersuite_list`

  <table summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=dir_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>9

  As sequências de cifra permitidas para conexões criptografadas que utilizam TLSv1.3. O valor é uma lista de um ou mais nomes de sequências de cifra separados por vírgula. As sequências de cifra que podem ser nomeadas para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para obter detalhes, consulte a Seção 8.3.2, “Protocolos e cifra de conexão criptografada TLS”.

  Essa opção foi adicionada no MySQL 8.0.16.

- `--tls-version=protocol_list`

  <table summary="Propriedades para comprimir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--compress[={OFF|ON}]</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.17</td> </tr><tr><th>Desatualizado</th> <td>8.0.18</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>0

  Os protocolos TLS permitidos para conexões criptografadas. O valor é uma lista de um ou mais nomes de protocolos separados por vírgula. Os protocolos que podem ser nomeados para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para obter detalhes, consulte a Seção 8.3.2, “Protocolos e cifra TLS de conexão criptografada”.

- `--to-last-log`, `-t`

  <table summary="Propriedades para comprimir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--compress[={OFF|ON}]</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.17</td> </tr><tr><th>Desatualizado</th> <td>8.0.18</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>1

  Não pare no final do log binário solicitado de um servidor MySQL, mas sim continue imprimindo até o final do último log binário. Se você enviar a saída para o mesmo servidor MySQL, isso pode levar a um loop infinito. Esta opção requer `--read-from-remote-server`.

- `--user=user_name`, `-u user_name`

  <table summary="Propriedades para comprimir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--compress[={OFF|ON}]</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.17</td> </tr><tr><th>Desatualizado</th> <td>8.0.18</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>2

  O nome de usuário da conta MySQL a ser usado ao se conectar a um servidor remoto.

  Se você estiver usando o plugin `Rewriter` com o MySQL 8.0.31 ou posterior, você deve conceder este usuário o privilégio `SKIP_QUERY_REWRITE`.

- `--verbose`, `-v`

  <table summary="Propriedades para comprimir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--compress[={OFF|ON}]</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.17</td> </tr><tr><th>Desatualizado</th> <td>8.0.18</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>3

  Reconstrói os eventos da linha e exibe-os como instruções SQL comentadas, com informações sobre a partição da tabela, quando aplicável. Se esta opção for fornecida duas vezes (passando "-vv" ou "--verbose --verbose"), a saída inclui comentários para indicar os tipos de dados das colunas e alguns metadados, além de eventos de log informativos, como eventos de log de consulta de linha, se a variável de sistema `binlog_rows_query_log_events` estiver definida como `TRUE`.

  Para exemplos que mostram o efeito de `--base64-output` e `--verbose` na saída de eventos de linha, consulte a Seção 6.6.9.2, “Exibição de Eventos de Linha mysqlbinlog”.

- `--verify-binlog-checksum`, `-c`

  <table summary="Propriedades para comprimir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--compress[={OFF|ON}]</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.17</td> </tr><tr><th>Desatualizado</th> <td>8.0.18</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>4

  Verifique os checksums nos arquivos de log binários.

- `--version`, `-V`

  <table summary="Propriedades para comprimir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--compress[={OFF|ON}]</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.17</td> </tr><tr><th>Desatualizado</th> <td>8.0.18</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>5

  Exibir informações da versão e sair.

  Ao contrário do que acontece com as versões anteriores do MySQL, o número da versão exibido pelo **mysqlbinlog** quando você usa essa opção é o mesmo da versão do MySQL Server.

- `--zstd-compression-level=level`

  <table summary="Propriedades para comprimir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--compress[={OFF|ON}]</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.17</td> </tr><tr><th>Desatualizado</th> <td>8.0.18</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>6

  O nível de compressão a ser usado para conexões com o servidor que utilizam o algoritmo de compressão `zstd`. Os níveis permitidos variam de 1 a 22, com valores maiores indicando níveis crescentes de compressão. O nível de compressão padrão `zstd` é 3. A configuração do nível de compressão não afeta conexões que não utilizam a compressão `zstd`.

  Para obter mais informações, consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.

  Essa opção foi adicionada no MySQL 8.0.18.

Você pode redirecionar a saída do **mysqlbinlog** para o cliente **mysql** para executar os eventos contidos no log binário. Essa técnica é usada para recuperar de uma saída inesperada quando você tem um backup antigo (veja a Seção 9.5, “Recuperação Ponto no Tempo (Incremental)”). Por exemplo:

```
mysqlbinlog binlog.000001 | mysql -u root -p
```

Ou:

```
mysqlbinlog binlog.[0-9]* | mysql -u root -p
```

Se as declarações geradas pelo **mysqlbinlog** podem conter valores `BLOB`, esses podem causar problemas quando o **mysql** os processa. Nesse caso, invocando o **mysql** com a opção `--binary-mode`.

Você também pode redirecionar a saída do **mysqlbinlog** para um arquivo de texto, se precisar modificar o log das declarações primeiro (por exemplo, para remover declarações que você não deseja executar por algum motivo). Após editar o arquivo, execute as declarações que ele contém usando-o como entrada para o programa **mysql**:

```
mysqlbinlog binlog.000001 > tmpfile
... edit tmpfile ...
mysql -u root -p < tmpfile
```

Quando o **mysqlbinlog** é invocado com a opção `--start-position`, ele exibe apenas aqueles eventos com um deslocamento no log binário maior ou igual a uma posição dada (a posição dada deve corresponder ao início de um evento). Ele também tem opções para parar e começar quando vê um evento com uma data e hora dadas. Isso permite que você realize a recuperação em um ponto no tempo usando a opção `--stop-datetime` (para poder dizer, por exemplo, “avançar meus bancos de dados para como estavam hoje às 10h30”).

**Processamento de vários arquivos.** Se você tiver mais de um log binário para executar no servidor MySQL, o método seguro é processá-los todos usando uma única conexão com o servidor. Aqui está um exemplo que demonstra o que pode ser **inseguro**:

```
mysqlbinlog binlog.000001 | mysql -u root -p # DANGER!!
mysqlbinlog binlog.000002 | mysql -u root -p # DANGER!!
```

O processamento de logs binários dessa maneira, usando múltiplas conexões ao servidor, causa problemas se o primeiro arquivo de log contiver uma declaração `CREATE TEMPORARY TABLE` e o segundo log contiver uma declaração que usa a tabela temporária. Quando o primeiro processo **mysql** termina, o servidor elimina a tabela temporária. Quando o segundo processo **mysql** tenta usar a tabela, o servidor relata “tabela desconhecida”.

Para evitar problemas como esse, use um único processo *mysql* para executar o conteúdo de todos os logs binários que você deseja processar. Aqui está uma maneira de fazer isso:

```
mysqlbinlog binlog.000001 binlog.000002 | mysql -u root -p
```

Outra abordagem é escrever todos os logs em um único arquivo e, em seguida, processar o arquivo:

```
mysqlbinlog binlog.000001 >  /tmp/statements.sql
mysqlbinlog binlog.000002 >> /tmp/statements.sql
mysql -u root -p -e "source /tmp/statements.sql"
```

A partir do MySQL 8.0.12, você também pode fornecer vários arquivos de log binário para o **mysqlbinlog** como entrada em fluxo usando um tubo de shell. Um arquivo de log binário compactado pode ser descompactado e fornecido diretamente ao **mysqlbinlog**. Neste exemplo, `binlog-files_1.gz` contém vários arquivos de log binário para processamento. O pipeline extrai o conteúdo de `binlog-files_1.gz`, envia os arquivos de log binário para o **mysqlbinlog** como entrada padrão e envia a saída do **mysqlbinlog** para o cliente **mysql** para execução:

```
gzip -cd binlog-files_1.gz | ./mysqlbinlog - | ./mysql -uroot  -p
```

Você pode especificar mais de um arquivo de arquivo, por exemplo:

```
gzip -cd binlog-files_1.gz binlog-files_2.gz | ./mysqlbinlog - | ./mysql -uroot  -p
```

Para entrada transmitida, não use `--stop-position`, porque o **mysqlbinlog** não consegue identificar o último arquivo de log para aplicar essa opção.

**Operações de CARREGAR DADOS.** O **mysqlbinlog** pode gerar uma saída que reproduz uma operação `LOAD DATA` sem o arquivo de dados original. O **mysqlbinlog** copia os dados para um arquivo temporário e escreve uma declaração `LOAD DATA LOCAL` que se refere ao arquivo. A localização padrão do diretório onde esses arquivos são escritos é específica do sistema. Para especificar um diretório explicitamente, use a opção `--local-load`.

Como o **mysqlbinlog** converte as instruções `LOAD DATA` em instruções `LOAD DATA LOCAL` (ou seja, adiciona `LOCAL`), tanto o cliente quanto o servidor que você usa para processar as instruções devem estar configurados com a capacidade `LOCAL` habilitada. Veja a Seção 8.1.6, “Considerações de Segurança para LOAD DATA LOCAL”.

Aviso

Os arquivos temporários criados para as declarações `LOAD DATA LOCAL` *não* são excluídos automaticamente, pois são necessários até que você execute essas declarações. Você deve excluir os arquivos temporários manualmente depois de não precisar mais do log da declaração. Os arquivos podem ser encontrados no diretório de arquivos temporários e têm nomes como `original_file_name-#-#`.
