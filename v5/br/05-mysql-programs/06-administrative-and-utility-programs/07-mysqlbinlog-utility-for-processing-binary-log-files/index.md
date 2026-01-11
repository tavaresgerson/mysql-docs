### 4.6.7 mysqlbinlog — Ferramenta para processar arquivos de log binários

4.6.7.1 Formato de Exibição Hexadecimal do mysqlbinlog

4.6.7.2 Exibição de eventos de linha do mysqlbinlog

4.6.7.3 Usar mysqlbinlog para fazer backup de arquivos de log binário

4.6.7.4 Especificar o ID do servidor mysqlbinlog

O log binário do servidor consiste em arquivos que contêm “eventos” que descrevem as modificações nos conteúdos do banco de dados. O servidor escreve esses arquivos no formato binário. Para exibir seus conteúdos no formato de texto, use o utilitário **mysqlbinlog**. Você também pode usar **mysqlbinlog** para exibir o conteúdo dos arquivos de log de retransmissão escritos por um servidor replica em uma configuração de replicação, pois os logs de retransmissão têm o mesmo formato dos logs binários. O log binário e o log de retransmissão são discutidos mais detalhadamente na Seção 5.4.4, “O Log Binário”, e na Seção 16.2.4, “Repositórios de Log de Retransmissão e Metadados de Replicação”.

Invoque **mysqlbinlog** da seguinte forma:

```sql
mysqlbinlog [options] log_file ...
```

Por exemplo, para exibir o conteúdo do arquivo de log binário chamado `binlog.000003`, use este comando:

```sql
mysqlbinlog binlog.000003
```

A saída inclui eventos contidos em `binlog.000003`. Para o registro baseado em declarações, as informações dos eventos incluem a declaração SQL, o ID do servidor em que ela foi executada, o timestamp da execução da declaração, o tempo gasto e assim por diante. Para o registro baseado em linhas, o evento indica uma mudança na linha em vez de uma declaração SQL. Consulte a Seção 16.2.1, “Formatos de Replicação”, para obter informações sobre os modos de registro.

Os eventos são precedidos por comentários de cabeçalho que fornecem informações adicionais. Por exemplo:

```sql
# at 141
#100309  9:28:36 server id 123  end_log_pos 245
  Query thread_id=3350  exec_time=11  error_code=0
```

Na primeira linha, o número após `at` indica o deslocamento do arquivo ou a posição inicial do evento no arquivo de log binário.

A segunda linha começa com uma data e uma hora que indicam quando a declaração começou no servidor onde o evento se originou. Para a replicação, este timestamp é propagado para os servidores replicados. `id do servidor` é o valor `server_id` do servidor onde o evento se originou. `end_log_pos` indica onde o próximo evento começa (ou seja, é a posição final do evento atual + 1). `thread_id` indica qual thread executou o evento. `exec_time` é o tempo gasto executando o evento, em um servidor de origem de replicação. Em um replica, é a diferença do tempo de execução final na replica menos o tempo de início de execução na fonte. A diferença serve como um indicador de quanto a replicação está atrasada em relação à fonte. `error_code` indica o resultado da execução do evento. Zero significa que não houve erro.

Nota

Ao usar grupos de eventos, os deslocamentos de arquivo dos eventos podem ser agrupados e os comentários dos eventos podem ser agrupados. Não confunda esses eventos agrupados com deslocamentos de arquivo em branco.

A saída do **mysqlbinlog** pode ser reexecutada (por exemplo, usando-o como entrada para o **mysql**) para refazer as declarações no log. Isso é útil para operações de recuperação após uma saída inesperada do servidor. Para outros exemplos de uso, consulte a discussão mais adiante nesta seção e na Seção 7.5, “Recuperação Ponto no Tempo (Incremental)”).

Você pode usar **mysqlbinlog** para ler arquivos de log binário diretamente e aplicá-los ao servidor MySQL local. Você também pode ler logs binários de um servidor remoto usando a opção `--read-from-remote-server`. Para ler logs binários remotos, as opções de parâmetros de conexão podem ser fornecidas para indicar como se conectar ao servidor. Essas opções são `--host`, `--password`, `--port`, `--protocol`, `--socket` e `--user`.

Ao executar o **mysqlbinlog** em um log binário grande, tenha cuidado para que o sistema de arquivos tenha espaço suficiente para os arquivos resultantes. Para configurar o diretório que o **mysqlbinlog** usa para arquivos temporários, use a variável de ambiente `TMPDIR`.

O **mysqlbinlog** define o valor de `pseudo_slave_mode` para true antes de executar quaisquer instruções SQL. Essa variável de sistema afeta o tratamento de transações XA.

O **mysqlbinlog** suporta as seguintes opções, que podem ser especificadas na linha de comando ou nos grupos `[mysqlbinlog]` e `[client]` de um arquivo de opções. Para obter informações sobre os arquivos de opções usados pelos programas do MySQL, consulte a Seção 4.2.2.2, “Usando arquivos de opções”.

**Tabela 4.23 Opções do mysqlbinlog**

<table frame="box" rules="all" summary="Opções de linha de comando disponíveis para mysqlbinlog."><col style="width: 27%"/><col style="width: 50%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th>Nome da Opção</th> <th>Descrição</th> <th>Introduzido</th> <th>Desatualizado</th> </tr></thead><tbody><tr><th>--base64-output</th> <td>Imprimir entradas de log binário usando codificação base-64</td> <td></td> <td></td> </tr><tr><th>--bind-address</th> <td>Use a interface de rede especificada para se conectar ao servidor MySQL</td> <td></td> <td></td> </tr><tr><th>--binlog-row-event-max-size</th> <td>Tamanho máximo de evento no log binário</td> <td></td> <td></td> </tr><tr><th>--character-sets-dir</th> <td>Diretório onde os conjuntos de caracteres são instalados</td> <td></td> <td></td> </tr><tr><th>--connection-server-id</th> <td>Utilizado para testes e depuração. Consulte o texto para obter os valores padrão aplicáveis e outras informações</td> <td></td> <td></td> </tr><tr><th>--database</th> <td>Listar entradas apenas para este banco de dados</td> <td></td> <td></td> </tr><tr><th>--debug</th> <td>Escreva o log de depuração</td> <td></td> <td></td> </tr><tr><th>--debug-check</th> <td>Imprimir informações de depuração quando o programa sai</td> <td></td> <td></td> </tr><tr><th>--debug-info</th> <td>Imprimir informações de depuração, memória e estatísticas da CPU quando o programa sai</td> <td></td> <td></td> </tr><tr><th>--default-auth</th> <td>Plugin de autenticação a ser usado</td> <td></td> <td></td> </tr><tr><th>--defaults-extra-file</th> <td>Leia o arquivo de opção nomeado, além dos arquivos de opção usuais</td> <td></td> <td></td> </tr><tr><th>--defaults-file</th> <td>Arquivo de opção de leitura apenas nomeado</td> <td></td> <td></td> </tr><tr><th>--defaults-group-suffix</th> <td>Valor do sufixo do grupo de opções</td> <td></td> <td></td> </tr><tr><th>--disable-log-bin</th> <td>Desativar o registro binário</td> <td></td> <td></td> </tr><tr><th>--exclude-gtids</th> <td>Não mostre nenhum dos grupos no conjunto de GTID fornecido</td> <td></td> <td></td> </tr><tr><th>--force-if-open</th> <td>Leia arquivos de log binários mesmo que estejam abertos ou não fechados corretamente</td> <td></td> <td></td> </tr><tr><th>--force-read</th> <td>Se o mysqlbinlog ler um evento de log binário que ele não reconhece, ele imprime uma mensagem de alerta</td> <td></td> <td></td> </tr><tr><th>--get-server-public-key</th> <td>Solicitar chave pública RSA do servidor</td> <td>5.7.23</td> <td></td> </tr><tr><th>--help</th> <td>Exibir mensagem de ajuda e sair</td> <td></td> <td></td> </tr><tr><th>--hexdump</th> <td>Exibir um dump hexadecimal do log nos comentários</td> <td></td> <td></td> </tr><tr><th>--host</th> <td>Anfitrião no qual o servidor MySQL está localizado</td> <td></td> <td></td> </tr><tr><th>--idempotente</th> <td>Fazer com que o servidor use o modo idempotente ao processar atualizações do log binário desta sessão apenas</td> <td></td> <td></td> </tr><tr><th>--include-gtids</th> <td>Mostrar apenas os grupos no conjunto de GTID fornecido</td> <td></td> <td></td> </tr><tr><th>--local-load</th> <td>Prepare arquivos temporários locais para o LOAD DATA no diretório especificado</td> <td></td> <td></td> </tr><tr><th>--login-path</th> <td>Leia as opções de caminho de login a partir de .mylogin.cnf</td> <td></td> <td></td> </tr><tr><th>--no-defaults</th> <td>Não ler arquivos de opção</td> <td></td> <td></td> </tr><tr><th>--offset</th> <td>Pular as primeiras N entradas no log</td> <td></td> <td></td> </tr><tr><th>--limite-de-arquivos-abertos</th> <td>Especifique o número de descritores de arquivo abertos a serem reservados</td> <td></td> <td></td> </tr><tr><th>--password</th> <td>Senha para usar ao se conectar ao servidor</td> <td></td> <td></td> </tr><tr><th>--plugin-dir</th> <td>Diretório onde os plugins são instalados</td> <td></td> <td></td> </tr><tr><th>--port</th> <td>Número de porta TCP/IP para a conexão</td> <td></td> <td></td> </tr><tr><th>--print-defaults</th> <td>Opções padrão de impressão</td> <td></td> <td></td> </tr><tr><th>--protocol</th> <td>Protocolo de transporte a ser utilizado</td> <td></td> <td></td> </tr><tr><th>--raw</th> <td>Escreva eventos no formato bruto (binário) para arquivos de saída</td> <td></td> <td></td> </tr><tr><th>--read-from-remote-master</th> <td>Leia o log binário de um servidor de origem de replicação MySQL em vez de ler um arquivo de log local</td> <td></td> <td></td> </tr><tr><th>--read-from-remote-server</th> <td>Leia o log binário do servidor MySQL em vez do arquivo de log local</td> <td></td> <td></td> </tr><tr><th>--result-file</th> <td>Saída direta para um arquivo nomeado</td> <td></td> <td></td> </tr><tr><th>--rewrite-db</th> <td>Crie regras de reescrita para bancos de dados ao reproduzir logs escritos em formato de linha. Pode ser usado várias vezes</td> <td></td> <td></td> </tr><tr><th>--secure-auth</th> <td>Não envie senhas para o servidor no formato antigo (pré-4.1)</td> <td></td> <td>Sim</td> </tr><tr><th>--server-id</th> <td>Extraia apenas os eventos criados pelo servidor com o ID do servidor fornecido</td> <td></td> <td></td> </tr><tr><th>--server-id-bits</th> <td>Informe ao mysqlbinlog como interpretar os IDs do servidor no log binário quando o log foi escrito por um mysqld com seus bits de ID do servidor configurados para menos que o máximo; suportado apenas pela versão do mysqlbinlog do MySQL Cluster</td> <td></td> <td></td> </tr><tr><th>--server-public-key-path</th> <td>Nome do caminho para o arquivo que contém a chave pública RSA</td> <td>5.7.23</td> <td></td> </tr><tr><th>--set-charset</th> <td>Adicione uma declaração SET NAMES charset_name ao resultado</td> <td></td> <td></td> </tr><tr><th>--shared-memory-base-name</th> <td>Nome de memória compartilhada para conexões de memória compartilhada (apenas Windows)</td> <td></td> <td></td> </tr><tr><th>--curta</th> <td>Exibir apenas as declarações contidas no log</td> <td></td> <td></td> </tr><tr><th>--skip-gtids</th> <td>Não inclua os GTIDs dos arquivos de log binário no arquivo de exclusão de saída</td> <td></td> <td></td> </tr><tr><th>--socket</th> <td>Arquivo de soquete Unix ou tubo nomeado do Windows a ser usado</td> <td></td> <td></td> </tr><tr><th>--ssl</th> <td>Ative a criptografia de conexão</td> <td></td> <td></td> </tr><tr><th>--ssl-ca</th> <td>Arquivo que contém a lista de Autoridades de Certificação SSL confiáveis</td> <td></td> <td></td> </tr><tr><th>--ssl-capath</th> <td>Diretório que contém arquivos de certificados de Autoridade de Certificação SSL confiáveis</td> <td></td> <td></td> </tr><tr><th>--ssl-cert</th> <td>Arquivo que contém o certificado X.509</td> <td></td> <td></td> </tr><tr><th>--ssl-cipher</th> <td>Cifras permitidas para criptografia de conexão</td> <td></td> <td></td> </tr><tr><th>--ssl-crl</th> <td>Arquivo que contém listas de revogação de certificados</td> <td></td> <td></td> </tr><tr><th>--ssl-crlpath</th> <td>Diretório que contém arquivos de lista de revogação de certificados</td> <td></td> <td></td> </tr><tr><th>--ssl-chave</th> <td>Arquivo que contém a chave X.509</td> <td></td> <td></td> </tr><tr><th>--ssl-mode</th> <td>Estado de segurança desejado da conexão com o servidor</td> <td>5.7.11</td> <td></td> </tr><tr><th>--ssl-verify-server-cert</th> <td>Verifique o nome do host contra a identidade do Nome comum do certificado do servidor</td> <td></td> <td></td> </tr><tr><th>--start-datetime</th> <td>Leia o log binário a partir do primeiro evento com o timestamp igual ou posterior ao argumento datetime</td> <td></td> <td></td> </tr><tr><th>--start-position</th> <td>Decodificar o log binário a partir do primeiro evento com a posição igual ou maior que o argumento</td> <td></td> <td></td> </tr><tr><th>--stop-datetime</th> <td>Pare de ler o log binário no primeiro evento com o timestamp igual ou maior que o argumento datetime</td> <td></td> <td></td> </tr><tr><th>--stop-never</th> <td>Mantenha-se conectado ao servidor após ler o último arquivo de log binário</td> <td></td> <td></td> </tr><tr><th>--stop-never-slave-server-id</th> <td>ID do servidor escravo para relatar ao conectar-se ao servidor</td> <td></td> <td></td> </tr><tr><th>--stop-position</th> <td>Pare de decodificar o log binário no primeiro evento com a posição igual ou maior que o argumento</td> <td></td> <td></td> </tr><tr><th>--tls-version</th> <td>Protocolos TLS permitidos para conexões criptografadas</td> <td>5.7.10</td> <td></td> </tr><tr><th>--to-last-log</th> <td>Não pare no final do log binário solicitado de um servidor MySQL, mas sim continue imprimindo até o final do último log binário</td> <td></td> <td></td> </tr><tr><th>--user</th> <td>Nome do usuário do MySQL a ser usado ao se conectar ao servidor</td> <td></td> <td></td> </tr><tr><th>--verbose</th> <td>Reconstrua eventos de linha como instruções SQL</td> <td></td> <td></td> </tr><tr><th>--verify-binlog-checksum</th> <td>Verifique os checksums no log binário</td> <td></td> <td></td> </tr><tr><th>--version</th> <td>Exibir informações da versão e sair</td> <td></td> <td></td> </tr></tbody></table>

- `--help`, `-?`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Exiba uma mensagem de ajuda e saia.

- `--base64-output=valor`

  <table frame="box" rules="all" summary="Propriedades para saída base64"><tbody><tr><th>Formato de linha de comando</th> <td><code>--base64-output=value</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>AUTO</code></td> </tr><tr><th>Valores válidos</th> <td><p><code>AUTO</code></p><p><code>NEVER</code></p><p><code>DECODE-ROWS</code></p></td> </tr></tbody></table>

  Esta opção determina quando os eventos devem ser exibidos codificados como strings base-64 usando as instruções `BINLOG`. A opção tem os seguintes valores permitidos (não case-sensitive):

  - `AUTO` ("automático") ou `UNSPEC` ("não especificado") exibe as instruções `BINLOG` automaticamente quando necessário (ou seja, para eventos de descrição de formato e eventos de linha). Se nenhuma opção `--base64-output` for fornecida, o efeito é o mesmo que `--base64-output=AUTO`.

    Nota

    A exibição automática do `BINLOG` é o único comportamento seguro se você pretende usar a saída do **mysqlbinlog** para reexecutar o conteúdo do arquivo de log binário. Os outros valores das opções são destinados apenas para fins de depuração ou teste, pois podem produzir saída que não inclui todos os eventos na forma executável.

  - `NEVER` faz com que as instruções `BINLOG` não sejam exibidas. **mysqlbinlog** sai com um erro se um evento de linha for encontrado que deve ser exibido usando `BINLOG`.

  - `DECODE-ROWS` especifica para o **mysqlbinlog** que você deseja que os eventos de linha sejam decodificados e exibidos como instruções SQL comentadas, especificando também a opção `--verbose`. Assim como `NEVER`, `DECODE-ROWS` suprime a exibição de instruções `BINLOG`, mas, ao contrário de `NEVER`, não sai com um erro se um evento de linha for encontrado.

  Para exemplos que mostram o efeito da opção `--base64-output` e da opção `--verbose` na saída de eventos de linha, consulte a Seção 4.6.7.2, “Exibição de Eventos de Linha do mysqlbinlog”.

- `--bind-address=ip_address`

  <table frame="box" rules="all" summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  Em um computador com várias interfaces de rede, use esta opção para selecionar qual interface usar para se conectar ao servidor MySQL.

- `--binlog-row-event-max-size=N`

  <table frame="box" rules="all" summary="Propriedades para binlog-row-event-max-size"><tbody><tr><th>Formato de linha de comando</th> <td><code>--binlog-row-event-max-size=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td><code>4294967040</code></td> </tr><tr><th>Valor mínimo</th> <td><code>256</code></td> </tr><tr><th>Valor máximo</th> <td><code>18446744073709547520</code></td> </tr></tbody></table>

  Especifique o tamanho máximo de um evento de registro binário baseado em linha, em bytes. As linhas são agrupadas em eventos menores que esse tamanho, se possível. O valor deve ser um múltiplo de 256. O valor padrão é de 4 GB.

- `--character-sets-dir=dir_name`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>

  O diretório onde os conjuntos de caracteres são instalados. Consulte a Seção 10.15, “Configuração de Conjunto de Caracteres”.

- `--connection-server-id=server_id`

  <table frame="box" rules="all" summary="Propriedades para conexão-server-id"><tbody><tr><th>Formato de linha de comando</th> <td><code>--connection-server-id=#]</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>0 (1)</code></td> </tr><tr><th>Valor mínimo</th> <td><code>0 (1)</code></td> </tr><tr><th>Valor máximo</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Esta opção é usada para testar um servidor MySQL quanto ao suporte à bandeira de conexão `BINLOG_DUMP_NON_BLOCK`. Não é necessária para operações normais.

  Os valores padrão e mínimos eficazes para esta opção dependem de se o **mysqlbinlog** é executado no modo bloqueante ou não bloqueante. Quando o **mysqlbinlog** é executado no modo bloqueante, o valor padrão (e mínimo) é 1; quando executado no modo não bloqueante, o valor padrão (e mínimo) é 0.

- `--database=db_name`, `-d db_name`

  <table frame="box" rules="all" summary="Propriedades para banco de dados"><tbody><tr><th>Formato de linha de comando</th> <td><code>--database=db_name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Essa opção faz com que o **mysqlbinlog** exiba entradas do log binário (apenas o log local) que ocorrem enquanto *`db_name`* é selecionado como o banco de dados padrão pelo comando `USE`.

  A opção `--database` para o **mysqlbinlog** é semelhante à opção `--binlog-do-db` para o **mysqld**, mas pode ser usada para especificar apenas um banco de dados. Se `--database` for fornecida várias vezes, apenas a última instância será usada.

  Os efeitos dessa opção dependem se o formato de registro baseado em declarações ou baseado em linhas está em uso, da mesma forma que os efeitos de `--binlog-do-db` dependem se o registro baseado em declarações ou baseado em linhas está em uso.

  **Registro baseado em declarações.** A opção `--database` funciona da seguinte forma:

  - Embora *`db_name`* seja o banco de dados padrão, as instruções são exibidas independentemente de elas modificarem tabelas em *`db_name`* ou em um banco de dados diferente.

  - A menos que *`db_name`* seja selecionado como o banco de dados padrão, as instruções não serão exibidas, mesmo que modifiquem tabelas em *`db_name`*.

  - Há uma exceção para `CREATE DATABASE`, `ALTER DATABASE` e `DROP DATABASE`. O banco de dados que está sendo *criado, alterado ou excluído* é considerado o banco de dados padrão ao determinar se a instrução deve ser exibida.

  Suponha que o log binário foi criado executando essas instruções usando o registro baseado em instruções:

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

  **mysqlbinlog --database=test** não exibe os dois primeiros `INSERT` porque não há um banco de dados padrão. Ele exibe os três `INSERT` que seguem `USE test`, mas não os três `INSERT` que seguem `USE db2`.

  **mysqlbinlog --database=db2** não exibe as duas primeiras instruções `INSERT` porque não há um banco de dados padrão. Ele não exibe as três instruções `INSERT` após `USE test`, mas exibe as três instruções `INSERT` após `USE db2`.

  **Registro baseado em linhas.** **mysqlbinlog** exibe apenas as entradas que alteram tabelas pertencentes a *`db_name`*. O banco de dados padrão não tem efeito sobre isso. Suponha que o log binário recém-descrito foi criado usando registro baseado em linhas em vez de registro baseado em instruções. **mysqlbinlog --database=test** exibe apenas as entradas que modificam `t1` no banco de dados de teste, independentemente de ter sido emitida a instrução `USE` ou qual seja o banco de dados padrão.

  Se um servidor estiver rodando com `binlog_format` definido como `MIXED` e você quiser que seja possível usar o **mysqlbinlog** com a opção `--database`, você deve garantir que as tabelas que são modificadas estejam no banco de dados selecionado por `USE`. (Em particular, não devem ser usadas atualizações entre bancos.)

  Quando usado juntamente com a opção `--rewrite-db`, a opção `--rewrite-db` é aplicada primeiro; em seguida, a opção `--database` é aplicada, usando o nome do banco de dados reescrito. A ordem em que as opções são fornecidas não faz diferença nesse sentido.

- `--debug[=opções_de_depuração]`, `-# [opções_de_depuração]`

  <table frame="box" rules="all" summary="Propriedades para depuração"><tbody><tr><th>Formato de linha de comando</th> <td><code>--debug[=debug_option<code>d:t:o,/tmp/mysqlbinlog.trace</code></code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>d:t:o,/tmp/mysqlbinlog.trace</code></td> </tr></tbody></table>

  Escreva um log de depuração. Uma string típica de *`debug_options`* é `d:t:o,nome_do_arquivo`. O padrão é `d:t:o,/tmp/mysqlbinlog.trace`.

  Esta opção está disponível apenas se o MySQL foi compilado com `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são compilados com esta opção.

- `--debug-check`

  <table frame="box" rules="all" summary="Propriedades para verificação de depuração"><tbody><tr><th>Formato de linha de comando</th> <td><code>--debug-check</code></td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Imprima algumas informações de depuração quando o programa sair.

  Esta opção está disponível apenas se o MySQL foi compilado com `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são compilados com esta opção.

- `--debug-info`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Imprima informações de depuração, estatísticas de uso de memória e CPU quando o programa sair.

  Esta opção está disponível apenas se o MySQL foi compilado com `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são compilados com esta opção.

- `--default-auth=plugin`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Uma dica sobre qual plugin de autenticação do lado do cliente deve ser usado. Veja a Seção 6.2.13, “Autenticação Personalizável”.

- `--defaults-extra-file=nome_do_arquivo`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Leia este arquivo de opção após o arquivo de opção global, mas (no Unix) antes do arquivo de opção do usuário. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--defaults-file=nome_do_arquivo`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Use apenas o arquivo de opção fornecido. Se o arquivo não existir ou estiver inacessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

  Exceção: Mesmo com `--defaults-file`, os programas cliente leem `.mylogin.cnf`.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--defaults-group-suffix=str`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Leia não apenas os grupos de opções usuais, mas também grupos com os nomes usuais e um sufixo de *`str`*. Por exemplo, **mysqlbinlog** normalmente lê os grupos `[client]` e `[mysqlbinlog]`. Se esta opção for fornecida como `--defaults-group-suffix=_other`, **mysqlbinlog** também lê os grupos `[client_other]` e `[mysqlbinlog_other]`.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--disable-log-bin`, `-D`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Desative o registro binário. Isso é útil para evitar um loop infinito se você usar a opção `--to-last-log` e estiver enviando a saída para o mesmo servidor MySQL. Esta opção também é útil ao restaurar após uma saída inesperada para evitar a duplicação das declarações que você registrou.

  Essa opção faz com que o **mysqlbinlog** inclua uma instrução `SET sql_log_bin = 0` em sua saída para desabilitar o registro binário do restante da saída. Manipular o valor da sessão da variável de sistema `sql_log_bin` é uma operação restrita, portanto, essa opção exige que você tenha privilégios suficientes para definir variáveis de sessão restritas. Consulte a Seção 5.1.8.1, “Privilégios de Variáveis de Sistema”.

- `--exclude-gtids=gtid_set`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Não exiba nenhum dos grupos listados no *`gtid_set`*.

- `--force-if-open`, `-F`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Leia arquivos de log binários mesmo que estejam abertos ou não tenham sido fechados corretamente.

- `--force-read`, `-f`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Com essa opção, se o **mysqlbinlog** ler um evento de log binário que ele não reconhece, ele imprime um aviso, ignora o evento e continua. Sem essa opção, o **mysqlbinlog** para se parar se ler tal evento.

- `--get-server-public-key`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Peça à rede o par de chaves públicas necessário para a troca de senhas com base em pares de chaves RSA. Esta opção aplica-se a clientes que se autenticam com o plugin de autenticação `caching_sha2_password`. Para esse plugin, o servidor não envia a chave pública a menos que seja solicitado. Esta opção é ignorada para contas que não se autenticam com esse plugin. Também é ignorada se a troca de senha com base em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

  Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele terá precedência sobre `--get-server-public-key`.

  Para obter informações sobre o plugin `caching_sha2_password`, consulte a Seção 6.4.1.4, “Cacheamento de Autenticação Conectada SHA-2”.

  A opção `--get-server-public-key` foi adicionada no MySQL 5.7.23.

- `--hexdump`, `-H`

  <table frame="box" rules="all" summary="Propriedades para saída base64"><tbody><tr><th>Formato de linha de comando</th> <td><code>--base64-output=value</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>AUTO</code></td> </tr><tr><th>Valores válidos</th> <td><p><code>AUTO</code></p><p><code>NEVER</code></p><p><code>DECODE-ROWS</code></p></td> </tr></tbody></table>

  Exiba um dump hexadecimal do log nos comentários, conforme descrito na Seção 4.6.7.1, "Formato de Dump Hexadecimal mysqlbinlog". A saída hexadecimal pode ser útil para depuração de replicação.

- `--host=host_name`, `-h host_name`

  <table frame="box" rules="all" summary="Propriedades para saída base64"><tbody><tr><th>Formato de linha de comando</th> <td><code>--base64-output=value</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>AUTO</code></td> </tr><tr><th>Valores válidos</th> <td><p><code>AUTO</code></p><p><code>NEVER</code></p><p><code>DECODE-ROWS</code></p></td> </tr></tbody></table>

  Obtenha o log binário do servidor MySQL no host fornecido.

- `--idempotent`

  <table frame="box" rules="all" summary="Propriedades para saída base64"><tbody><tr><th>Formato de linha de comando</th> <td><code>--base64-output=value</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>AUTO</code></td> </tr><tr><th>Valores válidos</th> <td><p><code>AUTO</code></p><p><code>NEVER</code></p><p><code>DECODE-ROWS</code></p></td> </tr></tbody></table>

  Informe ao servidor MySQL para usar o modo idempotente durante o processamento de atualizações; isso causa a supressão de quaisquer erros de chave duplicada ou chave não encontrada que o servidor encontrar na sessão atual durante o processamento de atualizações. Esta opção pode ser útil sempre que seja desejável ou necessário refazer um ou mais logs binários para um servidor MySQL que pode não conter todos os dados aos quais os logs se referem.

  O escopo de efeito para esta opção inclui apenas o cliente e a sessão atuais **mysqlbinlog**.

- `--include-gtids=gtid_set`

  <table frame="box" rules="all" summary="Propriedades para saída base64"><tbody><tr><th>Formato de linha de comando</th> <td><code>--base64-output=value</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>AUTO</code></td> </tr><tr><th>Valores válidos</th> <td><p><code>AUTO</code></p><p><code>NEVER</code></p><p><code>DECODE-ROWS</code></p></td> </tr></tbody></table>

  Exiba apenas os grupos listados no *`gtid_set`*.

- `--local-load=dir_name`, `-l dir_name`

  <table frame="box" rules="all" summary="Propriedades para saída base64"><tbody><tr><th>Formato de linha de comando</th> <td><code>--base64-output=value</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>AUTO</code></td> </tr><tr><th>Valores válidos</th> <td><p><code>AUTO</code></p><p><code>NEVER</code></p><p><code>DECODE-ROWS</code></p></td> </tr></tbody></table>

  Para operações de carregamento de dados correspondentes às instruções `LOAD DATA`, o **mysqlbinlog** extrai os arquivos dos eventos do log binário, escreve-os como arquivos temporários no sistema de arquivos local e escreve as instruções `LOAD DATA LOCAL` para carregar os arquivos. Por padrão, o **mysqlbinlog** escreve esses arquivos temporários em um diretório específico do sistema operacional. A opção `--local-load` pode ser usada para especificar explicitamente o diretório onde o **mysqlbinlog** deve preparar arquivos temporários locais.

  Importante

  Esses arquivos temporários não são removidos automaticamente pelo **mysqlbinlog** ou por qualquer outro programa do MySQL.

- `--login-path=nome`

  <table frame="box" rules="all" summary="Propriedades para saída base64"><tbody><tr><th>Formato de linha de comando</th> <td><code>--base64-output=value</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>AUTO</code></td> </tr><tr><th>Valores válidos</th> <td><p><code>AUTO</code></p><p><code>NEVER</code></p><p><code>DECODE-ROWS</code></p></td> </tr></tbody></table>

  Leia as opções do caminho de login nomeado no arquivo de caminho de login `.mylogin.cnf`. Um “caminho de login” é um grupo de opções que contém opções que especificam qual servidor MySQL conectar e qual conta autenticar. Para criar ou modificar um arquivo de caminho de login, use o utilitário **mysql_config_editor**. Veja a Seção 4.6.6, “mysql_config_editor — Utilitário de Configuração MySQL”.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--no-defaults`

  <table frame="box" rules="all" summary="Propriedades para saída base64"><tbody><tr><th>Formato de linha de comando</th> <td><code>--base64-output=value</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>AUTO</code></td> </tr><tr><th>Valores válidos</th> <td><p><code>AUTO</code></p><p><code>NEVER</code></p><p><code>DECODE-ROWS</code></p></td> </tr></tbody></table>

  Não leia nenhum arquivo de opções. Se a inicialização do programa falhar devido à leitura de opções desconhecidas de um arquivo de opções, o `--no-defaults` pode ser usado para impedir que sejam lidas.

  A exceção é que o arquivo `.mylogin.cnf` é lido em todos os casos, se ele existir. Isso permite que as senhas sejam especificadas de uma maneira mais segura do que na linha de comando, mesmo quando o `--no-defaults` é usado. Para criar `.mylogin.cnf`, use o utilitário **mysql_config_editor**. Veja a Seção 4.6.6, “mysql_config_editor — Ferramenta de Configuração do MySQL”.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--offset=N`, `-o N`

  <table frame="box" rules="all" summary="Propriedades para saída base64"><tbody><tr><th>Formato de linha de comando</th> <td><code>--base64-output=value</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>AUTO</code></td> </tr><tr><th>Valores válidos</th> <td><p><code>AUTO</code></p><p><code>NEVER</code></p><p><code>DECODE-ROWS</code></p></td> </tr></tbody></table>

  Pule as primeiras *`N`* entradas no log.

- `--open-files-limit=N`

  <table frame="box" rules="all" summary="Propriedades para saída base64"><tbody><tr><th>Formato de linha de comando</th> <td><code>--base64-output=value</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>AUTO</code></td> </tr><tr><th>Valores válidos</th> <td><p><code>AUTO</code></p><p><code>NEVER</code></p><p><code>DECODE-ROWS</code></p></td> </tr></tbody></table>

  Especifique o número de descritores de arquivo abertos a serem reservados.

- `--password[=password]`, `-p[password]`

  <table frame="box" rules="all" summary="Propriedades para saída base64"><tbody><tr><th>Formato de linha de comando</th> <td><code>--base64-output=value</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>AUTO</code></td> </tr><tr><th>Valores válidos</th> <td><p><code>AUTO</code></p><p><code>NEVER</code></p><p><code>DECODE-ROWS</code></p></td> </tr></tbody></table>

  A senha da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecido, o **mysqlbinlog** solicitará uma senha. Se for fornecida, não deve haver **espaço** entre `--password=` ou `-p` e a senha que a segue. Se nenhuma opção de senha for especificada, o padrão é não enviar a senha.

  Especificar uma senha na linha de comando deve ser considerado inseguro. Para evitar fornecer a senha na linha de comando, use um arquivo de opção. Consulte a Seção 6.1.2.1, "Diretrizes para o Usuário Final sobre Segurança de Senhas".

  Para especificar explicitamente que não há senha e que o **mysqlbinlog** não deve solicitar uma senha, use a opção `--skip-password`.

- `--plugin-dir=dir_name`

  <table frame="box" rules="all" summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  O diretório onde procurar por plugins. Especifique esta opção se a opção `--default-auth` for usada para especificar um plugin de autenticação, mas o **mysqlbinlog** não encontrá-lo. Veja a Seção 6.2.13, “Autenticação Personalizável”.

- `--port=port_num`, `-P port_num`

  <table frame="box" rules="all" summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  O número da porta TCP/IP a ser usado para se conectar a um servidor remoto.

- `--print-defaults`

  <table frame="box" rules="all" summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  Imprima o nome do programa e todas as opções que ele obtém a partir de arquivos de opção.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table frame="box" rules="all" summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  O protocolo de transporte a ser usado para se conectar ao servidor. É útil quando os outros parâmetros de conexão normalmente resultam no uso de um protocolo diferente do que você deseja. Para obter detalhes sobre os valores permitidos, consulte a Seção 4.2.5, “Protocolos de Transporte de Conexão”.

- `--raw`

  <table frame="box" rules="all" summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  Por padrão, o **mysqlbinlog** lê arquivos de log binários e escreve eventos no formato de texto. A opção `--raw` indica ao **mysqlbinlog** que escreva-os em seu formato binário original. Seu uso requer que a opção `--read-from-remote-server` também seja usada, pois os arquivos são solicitados a partir de um servidor. O **mysqlbinlog** escreve um arquivo de saída para cada arquivo lido do servidor. A opção `--raw` pode ser usada para fazer um backup de um log binário de servidor. Com a opção `--stop-never`, o backup é “ativo” porque o **mysqlbinlog** permanece conectado ao servidor. Por padrão, os arquivos de saída são escritos no diretório atual com os mesmos nomes dos arquivos de log originais. Os nomes dos arquivos de saída podem ser modificados usando a opção `--result-file`. Para mais informações, consulte a Seção 4.6.7.3, “Usando o mysqlbinlog para fazer backup de arquivos de log binários”.

- `--read-from-remote-master=type`

  <table frame="box" rules="all" summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  Leia logs binários de um servidor MySQL com os comandos `COM_BINLOG_DUMP` ou `COM_BINLOG_DUMP_GTID`, definindo o valor da opção para `BINLOG-DUMP-NON-GTIDS` ou `BINLOG-DUMP-GTIDS`, respectivamente. Se `--read-from-remote-master=BINLOG-DUMP-GTIDS` for combinado com `--exclude-gtids`, as transações podem ser filtradas na fonte, evitando tráfego de rede desnecessário.

  As opções de parâmetros de conexão são usadas com esta opção ou com a opção `--read-from-remote-server`. Essas opções são `--host`, `--password`, `--port`, `--protocol`, `--socket` e `--user`. Se nenhuma das opções remotas for especificada, as opções de parâmetros de conexão são ignoradas.

  O privilégio `REPLICATION SLAVE` é necessário para usar essa opção.

- `--read-from-remote-server=file_name`, `-R`

  <table frame="box" rules="all" summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  Leia o log binário de um servidor MySQL em vez de ler um arquivo de log local. Esta opção exige que o servidor remoto esteja em execução. Funciona apenas para arquivos de log binário no servidor remoto, não para arquivos de log de retransmissão, e aceita apenas o nome do arquivo de log binário (incluindo o sufixo numérico) como argumento, ignorando qualquer caminho.

  As opções de parâmetros de conexão são usadas com esta opção ou com a opção `--read-from-remote-master`. Essas opções são `--host`, `--password`, `--port`, `--protocol`, `--socket` e `--user`. Se nenhuma das opções remotas for especificada, as opções de parâmetros de conexão são ignoradas.

  O privilégio `REPLICATION SLAVE` é necessário para usar essa opção.

  Essa opção é semelhante a `--read-from-remote-master=BINLOG-DUMP-NON-GTIDS`.

- `--result-file=nome`, `-r nome`

  <table frame="box" rules="all" summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  Sem a opção `--raw`, essa opção indica o arquivo para o qual o **mysqlbinlog** escreve a saída de texto. Com `--raw`, o **mysqlbinlog** escreve um arquivo de saída binário para cada arquivo de log transferido do servidor, escrevendo-os, por padrão, no diretório atual usando os mesmos nomes do arquivo de log original. Nesse caso, o valor da opção `--result-file` é tratado como um prefixo que modifica os nomes dos arquivos de saída.

- `--rewrite-db='de_nome->nome_para'`

  <table frame="box" rules="all" summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  Ao ler de um log baseado em linhas ou em declarações, reescreva todas as ocorrências de *`from_name`* para *`to_name`*. A reescrita é feita nas linhas, para logs baseados em linhas, bem como nas cláusulas `USE`, para logs baseados em declarações. Em versões do MySQL anteriores a 5.7.8, essa opção era usada apenas ao restaurar tabelas registradas usando o formato baseado em linhas.

  Aviso

  As declarações nas quais os nomes das tabelas são qualificados com os nomes dos bancos de dados não são reescritas para usar o novo nome ao usar essa opção.

  A regra de reescrita empregada como valor para esta opção é uma string na forma `'from_name->to_name'`, conforme mostrado anteriormente, e, por isso, deve ser colocada entre aspas.

  Para usar várias regras de reescrita, especifique a opção várias vezes, conforme mostrado aqui:

  ```sql
  mysqlbinlog --rewrite-db='dbcurrent->dbold' --rewrite-db='dbtest->dbcurrent' \
      binlog.00001 > /tmp/statements.sql
  ```

  Quando usado juntamente com a opção `--database`, a opção `--rewrite-db` é aplicada primeiro; em seguida, a opção `--database` é aplicada, usando o nome do banco de dados reescrito. A ordem em que as opções são fornecidas não faz diferença nesse sentido.

  Isso significa, por exemplo, que se o **mysqlbinlog** for iniciado com `--rewrite-db='mydb->yourdb' --database=yourdb`, todas as atualizações em quaisquer tabelas dos bancos de dados `mydb` e `yourdb` serão incluídas na saída. Por outro lado, se for iniciado com `--rewrite-db='mydb->yourdb' --database=mydb`, o **mysqlbinlog** não emitirá nenhuma declaração: como todas as atualizações em `mydb` são reescritas primeiro como atualizações em `yourdb` antes de aplicar a opção `--database`, não restam atualizações que correspondam a `--database=mydb`.

- `--secure-auth`

  <table frame="box" rules="all" summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  Não envie senhas para o servidor no formato antigo (pré-4.1). Isso impede conexões, exceto para servidores que usam o formato de senha mais recente.

  A partir do MySQL 5.7.5, essa opção é desaconselhada; espere-se que ela seja removida em uma futura versão do MySQL. Ela está sempre habilitada e tentar desabilitá-la (`--skip-secure-auth`, `--secure-auth=0`) produz um erro. Antes do MySQL 5.7.5, essa opção está habilitada por padrão, mas pode ser desabilitada.

  Nota

  Senhas que usam o método de hashing pré-4.1 são menos seguras do que senhas que usam o método de hashing de senha nativo e devem ser evitadas. Senhas pré-4.1 são desaconselhadas e o suporte para elas foi removido no MySQL 5.7.5. Para instruções de atualização de conta, consulte a Seção 6.4.1.3, “Migrando para fora do hashing de senha pré-4.1 e do plugin mysql_old_password”.

- `--server-id=id`

  <table frame="box" rules="all" summary="Propriedades para binlog-row-event-max-size"><tbody><tr><th>Formato de linha de comando</th> <td><code>--binlog-row-event-max-size=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td><code>4294967040</code></td> </tr><tr><th>Valor mínimo</th> <td><code>256</code></td> </tr><tr><th>Valor máximo</th> <td><code>18446744073709547520</code></td> </tr></tbody></table>

  Exiba apenas os eventos criados pelo servidor com o ID do servidor fornecido.

- `--server-id-bits=N`

  <table frame="box" rules="all" summary="Propriedades para binlog-row-event-max-size"><tbody><tr><th>Formato de linha de comando</th> <td><code>--binlog-row-event-max-size=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td><code>4294967040</code></td> </tr><tr><th>Valor mínimo</th> <td><code>256</code></td> </tr><tr><th>Valor máximo</th> <td><code>18446744073709547520</code></td> </tr></tbody></table>

  Use apenas os primeiros *`N`* bits do `server_id` para identificar o servidor. Se o log binário foi escrito por um **mysqld** com os bits de `server_id` definidos para menos de 32 e os dados do usuário armazenados no bit mais significativo, executar **mysqlbinlog** com `--server-id-bits` definido para 32 permite que esses dados sejam vistos.

  Esta opção é suportada apenas pela versão do **mysqlbinlog** fornecida com a distribuição do NDB Cluster ou construída com suporte ao NDB Cluster.

- `--server-public-key-path=nome_do_arquivo`

  <table frame="box" rules="all" summary="Propriedades para binlog-row-event-max-size"><tbody><tr><th>Formato de linha de comando</th> <td><code>--binlog-row-event-max-size=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td><code>4294967040</code></td> </tr><tr><th>Valor mínimo</th> <td><code>256</code></td> </tr><tr><th>Valor máximo</th> <td><code>18446744073709547520</code></td> </tr></tbody></table>

  O nome do caminho de um arquivo no formato PEM que contém uma cópia do lado do cliente da chave pública necessária pelo servidor para a troca de senhas com par de chaves RSA. Esta opção aplica-se a clientes que se autenticam com o plugin de autenticação `sha256_password` ou `caching_sha2_password`. Esta opção é ignorada para contas que não se autenticam com um desses plugins. Também é ignorada se a troca de senha com base em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

  Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele terá precedência sobre `--get-server-public-key`.

  Para `sha256_password`, essa opção só se aplica se o MySQL foi construído usando o OpenSSL.

  Para obter informações sobre os módulos `sha256_password` e `caching_sha2_password`, consulte a Seção 6.4.1.5, “Autenticação com Pluggable SHA-256” e a Seção 6.4.1.4, “Cache de Autenticação com Pluggable SHA-2”.

  A opção `--server-public-key-path` foi adicionada no MySQL 5.7.23.

- `--set-charset=charset_name`

  <table frame="box" rules="all" summary="Propriedades para binlog-row-event-max-size"><tbody><tr><th>Formato de linha de comando</th> <td><code>--binlog-row-event-max-size=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td><code>4294967040</code></td> </tr><tr><th>Valor mínimo</th> <td><code>256</code></td> </tr><tr><th>Valor máximo</th> <td><code>18446744073709547520</code></td> </tr></tbody></table>

  Adicione uma declaração `SET NAMES charset_name` ao resultado para especificar o conjunto de caracteres a ser usado para processar arquivos de log.

- `--shared-memory-base-name=nome`

  <table frame="box" rules="all" summary="Propriedades para binlog-row-event-max-size"><tbody><tr><th>Formato de linha de comando</th> <td><code>--binlog-row-event-max-size=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td><code>4294967040</code></td> </tr><tr><th>Valor mínimo</th> <td><code>256</code></td> </tr><tr><th>Valor máximo</th> <td><code>18446744073709547520</code></td> </tr></tbody></table>

  Em Windows, o nome de memória compartilhada a ser usado para conexões feitas usando memória compartilhada com um servidor local. O valor padrão é `MYSQL`. O nome de memória compartilhada é case-sensitive.

  Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `shared_memory` habilitada para suportar conexões de memória compartilhada.

- `--short-form`, `-s`

  <table frame="box" rules="all" summary="Propriedades para binlog-row-event-max-size"><tbody><tr><th>Formato de linha de comando</th> <td><code>--binlog-row-event-max-size=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td><code>4294967040</code></td> </tr><tr><th>Valor mínimo</th> <td><code>256</code></td> </tr><tr><th>Valor máximo</th> <td><code>18446744073709547520</code></td> </tr></tbody></table>

  Exiba apenas as declarações contidas no log, sem nenhuma informação extra ou eventos baseados em linhas. Isso é apenas para testes e não deve ser usado em sistemas de produção.

- `--skip-gtids[=(true|false)]`

  <table frame="box" rules="all" summary="Propriedades para binlog-row-event-max-size"><tbody><tr><th>Formato de linha de comando</th> <td><code>--binlog-row-event-max-size=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td><code>4294967040</code></td> </tr><tr><th>Valor mínimo</th> <td><code>256</code></td> </tr><tr><th>Valor máximo</th> <td><code>18446744073709547520</code></td> </tr></tbody></table>

  Não inclua os GTIDs dos arquivos de log binário no arquivo de exclusão de saída. Por exemplo:

  ```sql
  mysqlbinlog --skip-gtids binlog.000001 >  /tmp/dump.sql
  mysql -u root -p -e "source /tmp/dump.sql"
  ```

  Normalmente, você não deve usar essa opção em produção ou na recuperação, exceto nos cenários específicos e raros em que os GTIDs são indesejados ativamente. Por exemplo, um administrador pode querer duplicar transações selecionadas (como definições de tabelas) de uma implantação para outra, não relacionada, que não será replicada para ou a partir do original. Nesse cenário, o `--skip-gtids` pode ser usado para permitir que o administrador aplique as transações como se fossem novas e garanta que as implantações permaneçam não relacionadas. No entanto, você deve usar essa opção apenas se a inclusão dos GTIDs causar um problema conhecido para o seu caso de uso.

- `--socket=caminho`, `-S caminho`

  <table frame="box" rules="all" summary="Propriedades para binlog-row-event-max-size"><tbody><tr><th>Formato de linha de comando</th> <td><code>--binlog-row-event-max-size=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td><code>4294967040</code></td> </tr><tr><th>Valor mínimo</th> <td><code>256</code></td> </tr><tr><th>Valor máximo</th> <td><code>18446744073709547520</code></td> </tr></tbody></table>

  Para conexões ao `localhost`, o arquivo de socket Unix a ser usado ou, no Windows, o nome do tubo nomeado a ser usado.

  No Windows, essa opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões por named pipe. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.

- `--ssl*`

  As opções que começam com `--ssl` especificam se você deseja se conectar ao servidor usando criptografia e indicam onde encontrar as chaves e certificados SSL. Consulte Opções de comando para conexões criptografadas.

- `--start-datetime=datetime`

  <table frame="box" rules="all" summary="Propriedades para binlog-row-event-max-size"><tbody><tr><th>Formato de linha de comando</th> <td><code>--binlog-row-event-max-size=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td><code>4294967040</code></td> </tr><tr><th>Valor mínimo</th> <td><code>256</code></td> </tr><tr><th>Valor máximo</th> <td><code>18446744073709547520</code></td> </tr></tbody></table>

  Comece a ler o log binário a partir do primeiro evento com um timestamp igual ou posterior ao argumento *`datetime`*. O valor *`datetime`* é relativo ao fuso horário local da máquina onde você executa o **mysqlbinlog**. O valor deve estar em um formato aceito para os tipos de dados `DATETIME` ou `TIMESTAMP`. Por exemplo:

  ```sql
  mysqlbinlog --start-datetime="2005-12-25 11:25:56" binlog.000003
  ```

  Essa opção é útil para a recuperação em um ponto específico. Veja a Seção 7.5, “Recuperação em um Ponto Específico (Incremental) de Recuperação”).

- `--start-position=N`, `-j N`

  <table frame="box" rules="all" summary="Propriedades para binlog-row-event-max-size"><tbody><tr><th>Formato de linha de comando</th> <td><code>--binlog-row-event-max-size=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td><code>4294967040</code></td> </tr><tr><th>Valor mínimo</th> <td><code>256</code></td> </tr><tr><th>Valor máximo</th> <td><code>18446744073709547520</code></td> </tr></tbody></table>

  Comece a ler o log binário a partir do primeiro evento com uma posição igual ou maior que *`N`*. Esta opção se aplica ao primeiro arquivo de log nomeado na linha de comando.

  Essa opção é útil para a recuperação em um ponto específico. Veja a Seção 7.5, “Recuperação em um Ponto Específico (Incremental) de Recuperação”).

- `--stop-datetime=datetime`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>

  Pare de ler o log binário no primeiro evento com um timestamp igual ou posterior ao argumento *`datetime`*. Consulte a descrição da opção `--start-datetime` para obter informações sobre o valor *`datetime`*.

  Essa opção é útil para a recuperação em um ponto específico. Veja a Seção 7.5, “Recuperação em um Ponto Específico (Incremental) de Recuperação”).

- `--stop-never`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>

  Esta opção é usada com `--read-from-remote-server`. Ela informa ao **mysqlbinlog** para permanecer conectado ao servidor. Caso contrário, o **mysqlbinlog** sai quando o último arquivo de log é transferido do servidor. `--stop-never` implica em `--to-last-log`, então apenas o primeiro arquivo de log a ser transferido precisa ser nomeado na linha de comando.

  `--stop-never` é comumente usado com `--raw` para fazer um backup de log binário ao vivo, mas também pode ser usado sem `--raw` para manter uma exibição contínua de texto dos eventos do log conforme o servidor os gera.

- `--stop-never-slave-server-id=id`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>

  Com `--stop-never`, o **mysqlbinlog** relata um ID de servidor de 65535 quando se conecta ao servidor. `--stop-never-slave-server-id` especifica explicitamente o ID de servidor a ser relatado. Ele pode ser usado para evitar um conflito com o ID de um servidor replica ou outro processo **mysqlbinlog**. Veja a Seção 4.6.7.4, “Especificando o ID de Servidor do \*\*mysqlbinlog”].

- `--stop-position=N`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>

  Pare de ler o log binário no primeiro evento com uma posição igual ou maior que *`N`*. Esta opção se aplica ao último arquivo de log nomeado na linha de comando.

  Essa opção é útil para a recuperação em um ponto específico. Veja a Seção 7.5, “Recuperação em um Ponto Específico (Incremental) de Recuperação”).

- `--tls-version=lista_protocolos`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>

  Os protocolos TLS permitidos para conexões criptografadas. O valor é uma lista de um ou mais nomes de protocolos separados por vírgula. Os protocolos que podem ser nomeados para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para obter detalhes, consulte a Seção 6.3.2, “Protocolos e cifra TLS de conexão criptografada”.

  Essa opção foi adicionada no MySQL 5.7.10.

- `--to-last-log`, `-t`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>

  Não pare no final do log binário solicitado de um servidor MySQL, mas sim continue imprimindo até o final do último log binário. Se você enviar a saída para o mesmo servidor MySQL, isso pode resultar em um loop infinito. Esta opção requer `--read-from-remote-server`.

- `--user=user_name`, `-u user_name`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>

  O nome de usuário da conta MySQL a ser usado ao se conectar a um servidor remoto.

- `--verbose`, `-v`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>

  Reconstrói os eventos da linha e exibe-os como instruções SQL comentadas. Se esta opção for fornecida duas vezes (através da passagem de "-vv" ou "--verbose --verbose"), a saída inclui comentários para indicar os tipos de dados das colunas e alguns metadados, e eventos de log de consulta de linha, se configurados.

  Para exemplos que mostram o efeito da opção `--base64-output` e da opção `--verbose` na saída de eventos de linha, consulte a Seção 4.6.7.2, “Exibição de Eventos de Linha do mysqlbinlog”.

- `--verify-binlog-checksum`, `-c`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>

  Verifique os checksums nos arquivos de log binários.

- `--version`, `-V`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>

  Exibir informações da versão e sair.

  No MySQL 5.7, o número de versão exibido pelo **mysqlbinlog** ao usar essa opção é 3.4.

Você pode redirecionar a saída do **mysqlbinlog** para o cliente **mysql** para executar os eventos contidos no log binário. Essa técnica é usada para recuperar de uma saída inesperada quando você tem um backup antigo (veja a Seção 7.5, “Recuperação Ponto no Tempo (Incremental)”). Por exemplo:

```sql
mysqlbinlog binlog.000001 | mysql -u root -p
```

Ou:

```sql
mysqlbinlog binlog.[0-9]* | mysql -u root -p
```

Se as declarações geradas pelo **mysqlbinlog** podem conter valores `BLOB`, isso pode causar problemas quando o **mysql** as processa. Nesse caso, invocando o **mysql** com a opção `--binary-mode`.

Você também pode redirecionar a saída do **mysqlbinlog** para um arquivo de texto, se precisar modificar o log das declarações primeiro (por exemplo, para remover declarações que você não deseja executar por algum motivo). Após editar o arquivo, execute as declarações que ele contém usando-o como entrada para o programa **mysql**:

```sql
mysqlbinlog binlog.000001 > tmpfile
... edit tmpfile ...
mysql -u root -p < tmpfile
```

Quando o **mysqlbinlog** é invocado com a opção `--start-position`, ele exibe apenas aqueles eventos com um deslocamento no log binário maior ou igual a uma posição específica (a posição específica deve corresponder ao início de um evento). Ele também tem opções para parar e começar quando vê um evento com uma data e hora específicas. Isso permite que você realize a recuperação em um ponto específico usando a opção `--stop-datetime` (para poder dizer, por exemplo, “avançar meus bancos de dados para o estado em que estavam hoje às 10h30”).

**Processamento de vários arquivos.** Se você tiver mais de um log binário para executar no servidor MySQL, o método seguro é processá-los todos usando uma única conexão com o servidor. Aqui está um exemplo que demonstra o que pode ser **inseguro**:

```sql
mysqlbinlog binlog.000001 | mysql -u root -p # DANGER!!
mysqlbinlog binlog.000002 | mysql -u root -p # DANGER!!
```

O processamento de logs binários dessa maneira, usando múltiplas conexões ao servidor, causa problemas se o primeiro arquivo de log contiver uma instrução `CREATE TEMPORARY TABLE` e o segundo log contiver uma instrução que usa a tabela temporária. Quando o primeiro processo **mysql** termina, o servidor elimina a tabela temporária. Quando o segundo processo **mysql** tenta usar a tabela, o servidor relata “tabela desconhecida”.

Para evitar problemas como esse, use um único processo *mysql* para executar o conteúdo de todos os logs binários que você deseja processar. Aqui está uma maneira de fazer isso:

```sql
mysqlbinlog binlog.000001 binlog.000002 | mysql -u root -p
```

Outra abordagem é escrever todos os logs em um único arquivo e, em seguida, processar o arquivo:

```sql
mysqlbinlog binlog.000001 >  /tmp/statements.sql
mysqlbinlog binlog.000002 >> /tmp/statements.sql
mysql -u root -p -e "source /tmp/statements.sql"
```

O **mysqlbinlog** pode gerar uma saída que reproduz uma operação `LOAD DATA` sem o arquivo de dados original. O **mysqlbinlog** copia os dados para um arquivo temporário e escreve uma declaração `LOAD DATA LOCAL` que se refere ao arquivo. A localização padrão do diretório onde esses arquivos são escritos é específica do sistema. Para especificar um diretório explicitamente, use a opção `--local-load`.

Como o **mysqlbinlog** converte as instruções `LOAD DATA` em instruções `LOAD DATA LOCAL` (ou seja, adiciona `LOCAL`), tanto o cliente quanto o servidor que você usa para processar as instruções devem estar configurados com a capacidade `LOCAL` habilitada. Veja a Seção 6.1.6, “Considerações de segurança para LOAD DATA LOCAL”.

Aviso

Os arquivos temporários criados para as instruções `LOAD DATA LOCAL` *não são* excluídos automaticamente, pois são necessários até que você execute essas instruções. Você deve excluir os arquivos temporários manualmente depois de não precisar mais do log da instrução. Os arquivos podem ser encontrados no diretório de arquivos temporários e têm nomes como *`original_file_name-#-#`*.
