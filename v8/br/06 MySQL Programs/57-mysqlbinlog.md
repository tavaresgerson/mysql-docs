### 6.6.9 `mysqlbinlog` — Ferramenta para Processar Arquivos de Log Binário

O log binário do servidor consiste em arquivos que contêm “eventos” que descrevem as modificações nos conteúdos do banco de dados. O servidor escreve esses arquivos no formato binário. Para exibir seus conteúdos no formato de texto, use a ferramenta  `mysqlbinlog`. Você também pode usar  `mysqlbinlog` para exibir o conteúdo dos arquivos de log de relevo escritos por um servidor replica em uma configuração de replicação, pois os logs de relevo têm o mesmo formato dos logs binários. O log binário e o log de relevo são discutidos mais detalhadamente na Seção 7.4.4, “O Log Binário”, e na Seção 19.2.4, “Repositórios de Metadados de Log de Relevo e Replicação”.

Inicie o `mysqlbinlog` da seguinte forma:

```
mysqlbinlog [options] log_file ...
```

Por exemplo, para exibir o conteúdo do arquivo de log binário chamado `binlog.000003`, use este comando:

```
mysqlbinlog binlog.000003
```

A saída inclui os eventos contidos em `binlog.000003`. Para o registro de eventos baseado em instruções, as informações dos eventos incluem a instrução SQL, o ID do servidor em que ela foi executada, o timestamp da execução da instrução, o tempo necessário e assim por diante. Para o registro de eventos baseado em linhas, o evento indica uma mudança de linha em vez de uma instrução SQL. Consulte a Seção 19.2.1, “Formulários de Replicação”, para obter informações sobre os modos de registro.

Os eventos são precedidos por comentários de cabeçalho que fornecem informações adicionais. Por exemplo:

```
# at 141
#100309  9:28:36 server id 123  end_log_pos 245
  Query thread_id=3350  exec_time=11  error_code=0
```

Na primeira linha, o número após `at` indica o deslocamento do arquivo, ou a posição inicial, do evento no arquivo de log binário.

A segunda linha começa com uma data e hora que indica quando a declaração começou no servidor onde o evento se originou. Para a replicação, este timestamp é propagado para os servidores replicados. `id_servidor` é o valor `server_id` do servidor onde o evento se originou. `end_log_pos` indica onde o próximo evento começa (ou seja, é a posição final do evento atual + 1). `id_thread` indica qual thread executou o evento. `exec_time` é o tempo gasto executando o evento, em um servidor de origem de replicação. Em uma replica, é a diferença do tempo de execução final na replica menos o tempo de execução inicial na origem. A diferença serve como um indicador de quanto a replica está atrasada em relação à origem. `error_code` indica o resultado da execução do evento. Zero significa que não houve erro.

::: info Nota

Ao usar grupos de eventos, os offsets de arquivos dos eventos podem ser agrupados e os comentários dos eventos podem ser agrupados. Não confunda esses eventos agrupados com offsets de arquivos em branco.

:::

A saída do `mysqlbinlog` pode ser reexecutada (por exemplo, usando-o como entrada para `mysql`) para refazer as declarações no log. Isso é útil para operações de recuperação após uma saída inesperada do servidor. Para outros exemplos de uso, consulte a discussão mais adiante nesta seção e na Seção 9.5, “Recuperação Ponto em Tempo (Incremental)” Recovery". Para executar as declarações de uso interno `BINLOG` usadas pelo `mysqlbinlog`, o usuário requer o privilégio `BINLOG_ADMIN` (ou o privilégio desatualizado `SUPER`), ou o privilégio `REPLICATION_APPLIER` mais os privilégios apropriados para executar cada evento de log.

Você pode usar `mysqlbinlog` para ler arquivos de log binários diretamente e aplicá-los ao servidor MySQL local. Você também pode ler logs binários de um servidor remoto usando a opção `--read-from-remote-server`. Para ler logs binários remotos, os parâmetros de conexão podem ser fornecidos para indicar como se conectar ao servidor. Essas opções são `--host`, `--password`, `--port`, `--protocol`, `--socket` e `--user`.

Quando os arquivos de log binários foram criptografados, o `mysqlbinlog` não pode lê-los diretamente, mas pode lê-los do servidor usando a opção `--read-from-remote-server`. Os arquivos de log binários são criptografados quando a variável de sistema `binlog_encryption` do servidor é definida como `ON`. A instrução `SHOW BINARY LOGS` mostra se um arquivo de log binário específico está criptografado ou não. Arquivos de log binários criptografados e não criptografados também podem ser distinguidos usando o número mágico no início do cabeçalho do arquivo para arquivos de log criptografados (`0xFD62696E`), que difere do usado para arquivos de log não criptografados (`0xFE62696E`). Note que o `mysqlbinlog` retorna um erro apropriado se você tentar ler um arquivo de log binário criptografado diretamente, mas versões mais antigas do `mysqlbinlog` não reconhecem o arquivo como um arquivo de log binário. Para mais informações sobre criptografia de log binário, consulte a Seção 19.3.2, “Criptografando Arquivos de Log Binários e Arquivos de Log Relay”.

Quando os payloads de transações de log binário foram comprimidos, o `mysqlbinlog` descomprime e decodifica automaticamente os payloads de transação e os imprime como eventos não comprimidos. Quando `binlog_transaction_compression` é definido como `ON`, os payloads de transação são comprimidos e então escritos no arquivo de log binário do servidor como um único evento (um `Transaction_payload_event`). Com a opção `--verbose`, o `mysqlbinlog` adiciona comentários indicando o algoritmo de compressão usado, o tamanho do payload comprimido que foi originalmente recebido e o tamanho do payload resultante após a descomprimagem.

::: info Nota
Portuguese (Brazil):

A posição final (`end_log_pos`) que o `mysqlbinlog` indica para um evento individual que fazia parte de um payload de transação compactado é a mesma da posição final do payload compactado original. Portanto, vários eventos descompactados podem ter a mesma posição final.

A compressão de conexão própria do `mysqlbinlog` faz menos se os payloads de transação já estiverem compactados, mas ainda opera em transações e cabeçalhos não compactados.

:::

Para obter mais informações sobre a compressão de transações de log binário, consulte a Seção 7.4.4.5, “Compressão de Transações de Log Binário”.

Ao executar o `mysqlbinlog` em um log binário grande, tenha cuidado para que o sistema de arquivos tenha espaço suficiente para os arquivos resultantes. Para configurar o diretório que o `mysqlbinlog` usa para arquivos temporários, use a variável de ambiente `TMPDIR`.

O `mysqlbinlog` define o valor de `pseudo_replica_mode` para `true` antes de executar quaisquer instruções SQL. Esta variável de sistema afeta o tratamento de transações XA, o timestamp de atraso de replicação `original_commit_timestamp` e a variável de sistema `original_server_version`, e modos SQL não suportados.

O `mysqlbinlog` suporta as seguintes opções, que podem ser especificadas na linha de comando ou nos grupos `[mysqlbinlog]` e `[client]` de um arquivo de opções. Para obter informações sobre arquivos de opções usados por programas MySQL, consulte a Seção 6.2.2.2, “Usando Arquivos de Opções”.

**Tabela 6.20 Opções do `mysqlbinlog`**

<table>
   <thead>
      <tr>
         <th>Nome da Opção</th>
         <th>Descrição</th>
      </tr>
   </thead>
   <tbody>
      <tr>
         <td><code>--base64-output</code></td>
         <td>Imprima entradas de log binário usando codificação base-64</td>
      </tr>
      <tr>
         <td><code>--bind-address</code></td>
         <td>Use a interface de rede especificada para se conectar ao servidor MySQL</td>
      </tr>
      <tr>
         <td><code>--binlog-row-event-max-size</code></td>
         <td>Tamanho máximo de evento de registro binário</td>
      </tr>
      <tr>
         <td><code>--character-sets-dir</code></td>
         <td>Diretório onde os conjuntos de caracteres estão instalados</td>
      </tr>
      <tr>
         <td><code>--compress</code></td>
         <td>Compress todas as informações enviadas entre o cliente e o servidor</td>
      </tr>
      <tr>
         <td><code>--compression-algorithms</code></td>
         <td>Algoritmos de compressão permitidos para conexões com o servidor</td>
      </tr>
      <tr>
         <td><code>--connection-server-id</code></td>
         <td>Usado para testes e depuração. Consulte o texto para valores padrão aplicáveis e outras informações</td>
      </tr>
      <tr>
         <td><code>--database</code></td>
         <td>Listar entradas para apenas essa base de dados</td>
      </tr>
      <tr>
         <td><code>--debug</code></td>
         <td>Escreva log de depuração</td>
      </tr>
      <tr>
         <td><code>--debug-check</code></td>
         <td>Imprima informações de depuração quando o programa sair</td>
      </tr>
      <tr>
         <td><code>--debug-info</code></td>
         <td>Imprima informações de depuração, memória e estatísticas da CPU quando o programa sair</td>
      </tr>
      <tr>
         <td><code>--default-auth</code></td>
         <td>Plugin de autenticação a ser usado</td>
      </tr>
      <tr>
         <td><code>--defaults-extra-file</code></td>
         <td>Leia o arquivo de opções nomeado além dos arquivos de opções usuais</td>
      </tr>
      <tr>
         <td><code>--defaults-file</code></td>
         <td>Leia apenas o arquivo de opções nomeado</td>
      </tr>
      <tr>
         <td><code>--defaults-group-suffix</code></td>
         <td>Valor do sufixo do grupo de opções</td>
      </tr>
      <tr>
         <td><code>--disable-log-bin</code></td>
         <td>Desative o registro binário</td>
      </tr>
      <tr>
         <td><code>--exclude-gtids</code></td>
         <td>Não mostre nenhum dos grupos no conjunto de GTID fornecido</td>
      </tr>
      <tr>
         <td><code>--force-if-open</code></td>
         <td>Leia arquivos de log binário mesmo se não estiverem abertos corretamente</td>
      </tr>
      <tr>
         <td><code>--force-read</code></td>
         <td>Se o mysqlbinlog ler um evento de log binário que ele não reconhece, imprima uma mensagem de aviso</td>
      </tr>
      <tr>
         <td><code>--get-server-public-key</code></td>
         <td>Solicitar a chave pública RSA do servidor</td>
      </tr>
      <tr>
         <td><code>--help</code></td>
         <td>Exibir mensagem de ajuda e sair</td>
      </tr>
      <tr>
         <td><code>--hexdump</code></td>
         <td>Imprima um dump hexadecimal do log com comentários</td>
      </tr>
      <tr>
         <td><code>--host</code></td>
         <td>Host no qual o servidor MySQL está localizado</td>
      </tr>
      <tr>
         <td><code>--idempotent</code></td>
         <td>Fazer com que o servidor use o modo idempotente enquanto processa atualizações de log binário a partir desta sessão apenas</td>
      </tr>
      <tr>
         <td><code>--include-gtids</code></td>
         <td>Mostrar apenas os grupos no conjunto de <code>GTID</code> fornecido</td>
      </tr>
      <tr>
         <td><code>--local-load</code></td>
         <td>Prepare arquivos temporários locais para <code>LOAD DATA</code> no diretório especificado</td>
      </tr>
      <tr>
         <td><code>--login-path</code></td>
         <td>Leia as opções de caminho de login do .mylogin.cnf</td>
      </tr>
      <tr>
         <td><code>--no-defaults</code></td>
         <td>Leia sem arquivos de opções</td>
      </tr>
      <tr>
         <td><code>--no-login-paths</code></td>
         <td>Não leia caminhos de login do arquivo de login</td>
      </tr>
      <tr>
         <td><code>--offset</code></td>
         <td>Ignorar as primeiras <code>N</code> entradas no log</td>
      </tr>
      <tr>
         <td><code>--password</code></td>
         <td>Senha a ser usada ao se conectar ao servidor</td>
      </tr>

* `--help`, `-?`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Exibe uma mensagem de ajuda e sai.
* `--base64-output=value`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--base64-output=value</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>AUTO</code></td> </tr><tr><th>Valores válidos</th> <td><code>AUTO</code><code>NEVER</code><code>DECODE-ROWS</code></td> </tr></tbody></table>

  Esta opção determina quando os eventos devem ser exibidos codificados como strings base64 usando as instruções `BINLOG`. A opção tem esses valores permitidos (não case-sensitive):

  + `AUTO` ("automático") ou `UNSPEC` ("não especificado") exibe as instruções `BINLOG` automaticamente quando necessário (ou seja, para eventos de descrição de formato e eventos de linha). Se nenhuma opção `--base64-output` for dada, o efeito é o mesmo que `--base64-output=AUTO`.

    ::: info Nota

    A exibição automática de `BINLOG` é o único comportamento seguro se você pretende usar a saída de `mysqlbinlog` para reexecutar o conteúdo do arquivo de log binário. Os outros valores da opção são destinados apenas para fins de depuração ou teste, porque podem produzir saída que não inclui todos os eventos na forma executável.

    :::
    
  + `NEVER` faz com que as instruções `BINLOG` não sejam exibidas. O `mysqlbinlog` sai com um erro se for encontrado um evento de linha que deve ser exibido usando `BINLOG`.
  + `DECODE-ROWS` especifica ao `mysqlbinlog` que você pretende que os eventos de linha sejam decodificados e exibidos como instruções SQL comentadas, especificando também a opção `--verbose`. Como `NEVER`, `DECODE-ROWS` suprime a exibição das instruções `BINLOG`, mas, ao contrário de `NEVER`, não sai com um erro se for encontrado um evento de linha.

  Para exemplos que mostram o efeito de `--base64-output` e `--verbose` na saída de eventos de linha, consulte a Seção 6.6.9.2, “Exibição de Eventos de Linha de mysqlbinlog”.
* `--bind-address=ip_address`

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--bind-address=endereço_ip</code></td> </tr></tbody></table>

  Em um computador com múltiplas interfaces de rede, use esta opção para selecionar qual interface usar para se conectar ao servidor MySQL.
*  `--binlog-row-event-max-size=N`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--binlog-row-event-max-size=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td><code>4294967040</code></td> </tr><tr><th>Valor mínimo</th> <td><code>256</code></td> </tr><tr><th>Valor máximo</th> <td><code>18446744073709547520</code></td> </tr></tbody></table>

  Especifique o tamanho máximo de um evento de log binário baseado em linhas, em bytes. As linhas são agrupadas em eventos menores que este tamanho, se possível. O valor deve ser um múltiplo de 256. O padrão é 4 GB.
*  `--character-sets-dir=nome_diretório`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--character-sets-dir=nome_diretório</code></td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>

  O diretório onde os conjuntos de caracteres são instalados. Consulte a Seção 12.15, “Configuração de conjuntos de caracteres”.
*  `--compress`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Compressar todas as informações enviadas entre o cliente e o servidor, se possível. Consulte a Seção 6.2.8, “Controle de compressão da conexão”.

  Esta opção está desatualizada. Espera-se que seja removida em uma versão futura do MySQL. Consulte Configurando a compressão de conexão legada.
*  `--compression-algorithms=valor`

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--compression-algorithms=valor</code></td> </tr><tr><th>Tipo</th> <td>Conjunto</td> </tr><tr><th>Valor padrão</th> <td><code>não comprimido</code></td> </tr><tr><th>Valores válidos</th> <td><code>zlib</code><code>zstd</code><code>não comprimido</code></td> </tr></tbody></table>

  Os algoritmos de compressão permitidos para conexões com o servidor. Os algoritmos disponíveis são os mesmos da variável de sistema `protocol_compression_algorithms`. O valor padrão é `não comprimido`.

  Para mais informações, consulte a Seção 6.2.8, “Controle de compressão de conexão”.
*  `--connection-server-id=server_id`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--connection-server-id=#]</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>0 (1)</code></td> </tr><tr><th>Valor mínimo</th> <td><code>0 (1)</code></td> </tr><tr><th>Valor máximo</th> <td><code>4294967295</code></td> </tr></tbody></table>

   `--connection-server-id` especifica o ID do servidor que o `mysqlbinlog` relata quando se conecta ao servidor. Pode ser usado para evitar um conflito com o ID de um servidor replica ou outro processo `mysqlbinlog`.

  Se a opção `--read-from-remote-server` for especificada, o `mysqlbinlog` relata um ID de servidor de 0, o que indica ao servidor que se desconecte após enviar o último arquivo de log (comportamento não bloqueante). Se a opção `--stop-never` também for especificada para manter a conexão com o servidor, o `mysqlbinlog` relata um ID de servidor padrão de 1 em vez de 0, e `--connection-server-id` pode ser usado para substituir esse ID de servidor, se necessário. Consulte a Seção 6.6.9.4, “Especificação do ID de servidor mysqlbinlog”.
*  `--database=db_name`, `-d db_name`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--database=db_name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

Esta opção faz com que o `mysqlbinlog` exiba entradas do log binário (apenas o log local) que ocorrem enquanto *`db_name`* é selecionado como o banco de dados padrão pelo `USE`.

A opção `--database` para o `mysqlbinlog` é semelhante à opção `--binlog-do-db` para o `mysqld`, mas pode ser usada para especificar apenas um banco de dados. Se `--database` for fornecida várias vezes, apenas a última instância é usada.

Os efeitos desta opção dependem se o formato de registro baseado em declarações ou baseado em linhas está em uso, da mesma forma que os efeitos de `--binlog-do-db` dependem se o registro baseado em declarações ou baseado em linhas está em uso.

**Registro baseado em declarações.** A opção `--database` funciona da seguinte forma:

+ Enquanto *`db_name`* é o banco de dados padrão, as declarações são exibidas, independentemente de elas modificar tabelas em *`db_name`* ou em um banco de dados diferente.
+ A menos que *`db_name`* seja selecionado como o banco de dados padrão, as declarações não são exibidas, mesmo que modifiquem tabelas em *`db_name`*.
+ Há uma exceção para `CREATE DATABASE`, `ALTER DATABASE` e `DROP DATABASE`. O banco de dados que está sendo *criado, alterado ou excluído* é considerado o banco de dados padrão ao determinar se a declaração deve ser exibida.

Suponha que o log binário foi criado executando essas declarações usando o registro baseado em declarações:

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

`mysqlbinlog --database=test` não exibe as duas primeiras declarações `INSERT` porque não há um banco de dados padrão. Exibe as três declarações `INSERT` após `USE test`, mas não as três declarações `INSERT` após `USE db2`.

`mysqlbinlog --database=db2` não exibe as duas primeiras declarações `INSERT` porque não há um banco de dados padrão. Não exibe as três declarações `INSERT` após `USE test`, mas exibe as três declarações `INSERT` após `USE db2`.

**Registro baseado em linhas.** `mysqlbinlog` exibe apenas as entradas que alteram tabelas pertencentes a *`db_name`*. O banco de dados padrão não tem efeito sobre isso. Suponha que o log binário recém-descrito tenha sido criado usando o registro baseado em linhas em vez do registro baseado em instruções. `mysqlbinlog --database=test` exibe apenas aquelas entradas que modificam `t1` no banco de dados de teste, independentemente de se tenha emitido o comando `USE` ou qual seja o banco de dados padrão.

Se um servidor estiver rodando com `binlog_format` definido como `MIXED` e você quiser que seja possível usar `mysqlbinlog` com a opção `--database`, você deve garantir que as tabelas que são modificadas estejam no banco de dados selecionado pelo `USE`. (Em particular, não devem ser usadas atualizações cruzadas entre bancos de dados.)

Quando usado junto com a opção `--rewrite-db`, a opção `--rewrite-db` é aplicada primeiro; então a opção `--database` é aplicada, usando o nome do banco de dados reescrito. A ordem em que as opções são fornecidas não faz diferença nesse aspecto.
*  `--debug[=debug_options]`, `-# [debug_options]`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--debug[=debug_options]</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>d:t:o,/tmp/mysqlbinlog.trace</code></td> </tr></tbody></table>

  Escreva um log de depuração. Uma string típica de *`debug_options`* é `d:t:o,file_name`. O padrão é `d:t:o,/tmp/mysqlbinlog.trace`.

  Esta opção está disponível apenas se o MySQL foi compilado com `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são compilados com esta opção.
*  `--debug-check`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--debug-check</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Imprima algumas informações de depuração quando o programa sair.

  Esta opção está disponível apenas se o MySQL foi compilado com `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são compilados com esta opção.
*  `--debug-info`

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--debug-info</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Imprima informações de depuração e estatísticas de uso de memória e CPU quando o programa sair.

  Esta opção está disponível apenas se o MySQL foi compilado com `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são compilados com esta opção.
*  `--default-auth=plugin`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Uma dica sobre qual plugin de autenticação do lado do cliente usar. Consulte a Seção 8.2.17, “Autenticação Personalizável”.
*  `--defaults-extra-file=file_name`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--defaults-extra-file=file_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  Leia este arquivo de opção após o arquivo de opção global, mas (no Unix) antes do arquivo de opção do usuário. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opção, consulte  Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivos de opção”.
*  `--defaults-file=file_name`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--defaults-file=file_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  Use apenas o arquivo de opção fornecido. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

  Exceção: Mesmo com `--defaults-file`, os programas cliente leem `.mylogin.cnf`.

Para obter informações adicionais sobre essa e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivos de opções”.
*  `--defaults-group-suffix=str`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--defaults-group-suffix=str</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Leia não apenas os grupos de opções usuais, mas também grupos com os nomes usuais e um sufixo de *`str`*. Por exemplo,  `mysqlbinlog` normalmente lê os grupos `[client]` e `[mysqlbinlog]`. Se esta opção for fornecida como `--defaults-group-suffix=_other`,  `mysqlbinlog` também lê os grupos `[client_other]` e `[mysqlbinlog_other]`.

  Para obter informações adicionais sobre essa e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivos de opções”.
*  `--disable-log-bin`, `-D`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--disable-log-bin</code></td> </tr></tbody></table>

  Desative o registro binário. Isso é útil para evitar um loop infinito se você usar a opção `--to-last-log` e estiver enviando a saída para o mesmo servidor MySQL. Esta opção também é útil ao restaurar após uma saída inesperada para evitar a duplicação das declarações que você registrou.

  Esta opção faz com que o `mysqlbinlog` inclua uma declaração `SET sql_log_bin = 0` em sua saída para desativar o registro binário do restante da saída. Manipular o valor da sessão da variável de sistema `sql_log_bin` é uma operação restrita, portanto, esta opção requer que você tenha privilégios suficientes para definir variáveis de sessão restritas. Consulte a Seção 7.1.9.1, “Privilégios de variáveis de sistema”.
*  `--exclude-gtids=gtid_set`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--exclude-gtids=gtid_set</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code></code></td> </tr></tbody></table>

  Não exiba nenhum dos grupos listados no *`gtid_set`*.
*  `--force-if-open`, `-F`

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--force-if-open</code></td> </tr></tbody></table>

  Leia arquivos de log binário mesmo que estejam abertos ou não tenham sido fechados corretamente (a bandeira `IN_USE` está definida); não falhe se o arquivo terminar com um evento truncado.

  A bandeira `IN_USE` é definida apenas para o log binário que está sendo escrito atualmente pelo servidor; se o servidor falhar, a bandeira permanece definida até que o servidor seja reiniciado e recupere o log binário. Sem essa opção, o `mysqlbinlog` se recusa a processar um arquivo com essa bandeira definida. Como o servidor pode estar no processo de gravação do arquivo, o truncamento do último evento é considerado normal.
*  `--force-read`, `-f`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--force-read</code></td> </tr></tbody></table>

  Com essa opção, se o `mysqlbinlog` ler um evento de log binário que ele não reconhece, ele imprime um aviso, ignora o evento e continua. Sem essa opção, o `mysqlbinlog` para se ele ler tal evento.
*  `--get-server-public-key`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--get-server-public-key</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr></tbody></table>

  Peça ao servidor a chave pública necessária para a troca de senha baseada em par de chaves RSA. Esta opção se aplica a clientes que se autenticam com o plugin de autenticação `caching_sha2_password`. Para esse plugin, o servidor não envia a chave pública a menos que seja solicitado. Esta opção é ignorada para contas que não se autenticam com esse plugin. Também é ignorada se a troca de senha baseada em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

  Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele tem precedência sobre `--get-server-public-key`.

  Para informações sobre o plugin `caching_sha2_password`, consulte a Seção 8.4.1.2, “Cacheamento de Pluggable Authentication SHA-2”.
*  `--hexdump`, `-H`

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--hexdump</code></td> </tr></tbody></table>

  Exiba um dump hexadecimal do log em comentários, conforme descrito na Seção 6.6.9.1, “Formato de Dump Hexadecimal de mysqlbinlog”. A saída hexadecimal pode ser útil para depuração de replicação.
*  `--host=host_name`, `-h host_name`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--host=host_name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>localhost</code></td> </tr></tbody></table>

  Obtenha o log binário do servidor MySQL no host fornecido.
*  `--idempotent`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--idempotent</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>true</code></td> </tr></tbody></table>

  Informe ao servidor MySQL para usar o modo idempotente durante o processamento de atualizações; isso causa a supressão de quaisquer erros de chave duplicada ou chave não encontrada que o servidor encontre na sessão atual durante o processamento de atualizações. Esta opção pode ser útil sempre que seja desejável ou necessário refazer um ou mais logs binários para um servidor MySQL que pode não conter todos os dados a que os logs se referem.

  O escopo de efeito desta opção inclui apenas o cliente e a sessão atuais de `mysqlbinlog`.
*  `--include-gtids=gtid_set`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--include-gtids=gtid_set</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code></code></td> </tr></tbody></table>

  Exiba apenas os grupos listados no *`gtid_set`*.
*  `--local-load=dir_name`, `-l dir_name`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--local-load=dir_name</code></td> </tr><tr><th>Tipo</th> <td>Nome de diretório</td> </tr></tbody></table>

Para operações de carregamento de dados correspondentes às instruções `LOAD DATA`, o `mysqlbinlog` extrai os arquivos dos eventos do log binário, escreve-os como arquivos temporários no sistema de arquivos local e escreve as instruções `LOAD DATA LOCAL` para fazer com que os arquivos sejam carregados. Por padrão, o `mysqlbinlog` escreve esses arquivos temporários em um diretório específico do sistema operacional. A opção `--local-load` pode ser usada para especificar explicitamente o diretório onde o `mysqlbinlog` deve preparar arquivos temporários locais.

Como outros processos podem escrever arquivos no diretório padrão específico do sistema, é aconselhável especificar a opção `--local-load` no `mysqlbinlog` para designar um diretório diferente para os arquivos de dados, e, em seguida, designar o mesmo diretório especificando a opção `--load-data-local-dir` no `mysql` ao processar a saída do `mysqlbinlog`. Por exemplo:

```
  mysqlbinlog --local-load=/my/local/data ...
      | mysql --load-data-local-dir=/my/local/data ...
  ```

Importante

Esses arquivos temporários não são removidos automaticamente pelo `mysqlbinlog` ou por qualquer outro programa do MySQL.
*  `--login-path=name`

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--login-path=name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

Leia as opções do caminho de login do arquivo de caminho de login `.mylogin.cnf`. Um "caminho de login" é um grupo de opções que contêm opções que especificam qual servidor MySQL se conectar e qual conta autenticar. Para criar ou modificar um arquivo de caminho de login, use o utilitário `mysql_config_editor`. Veja a Seção 6.6.7, “mysql_config_editor — Ferramenta de configuração do MySQL”.

Para obter informações adicionais sobre isso e outras opções de arquivos de opções, veja a Seção 6.2.2.3, “Opções de linha de comando que afetam o manuseio de arquivos de opções”.
*  `--no-login-paths`

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--no-login-paths</code></td> </tr></tbody></table>

Ignora a leitura de opções do arquivo de caminho de login.

Veja `--login-path` para informações relacionadas.

Para obter informações adicionais sobre esta e outras opções de arquivo de configuração, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivos de configuração”.
*  `--no-defaults`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--no-defaults</code></td> </tr></tbody></table>

  Não leia nenhum arquivo de configuração. Se o início do programa falhar devido à leitura de opções desconhecidas de um arquivo de configuração, o `--no-defaults` pode ser usado para impedir que sejam lidas.

  A exceção é que o arquivo `.mylogin.cnf` é lido em todos os casos, se existir. Isso permite que as senhas sejam especificadas de uma maneira mais segura do que na linha de comando, mesmo quando o `--no-defaults` é usado. Para criar `.mylogin.cnf`, use o utilitário `mysql_config_editor`.

  Para obter informações adicionais sobre esta e outras opções de arquivo de configuração, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivos de configuração”.
*  `--offset=N`, `-o N`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--offset=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr></tbody></table>

  Pular as primeiras *`N`* entradas no log.
*  `--open-files-limit=N`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--open-files-limit=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td><code>8</code></td> </tr><tr><th>Valor mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor máximo</th> <td><code>[dependente da plataforma]</code></td> </tr></tbody></table>

  Especifique o número de descritores de arquivo abertos a serem reservados.
*  `--password[=password]`, `-p[password]`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--password[=password]</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

A senha da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecido, o `mysqlbinlog` solicitará uma senha. Se for fornecida, não deve haver espaço entre `--password=` ou `-p` e a senha que a segue. Se nenhuma opção de senha for especificada, o padrão é não enviar a senha.

Especificar uma senha na linha de comando deve ser considerado inseguro. Para evitar fornecer a senha na linha de comando, use um arquivo de opções. Veja a Seção 8.1.2.1, “Diretrizes para Usuários Finais sobre Segurança de Senhas”.

Para especificar explicitamente que não há senha e que o `mysqlbinlog` não deve solicitar uma senha, use a opção `--skip-password`.
*  `--plugin-dir=dir_name`

  <table><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--plugin-dir=dir_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>

  O diretório onde procurar por plugins. Especifique esta opção se a opção `--default-auth` for usada para especificar um plugin de autenticação, mas o `mysqlbinlog` não o encontrar. Veja a Seção 8.2.17, “Autenticação Personalizável”.
*  `--port=port_num`, `-P port_num`

  <table><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--port=port_num</code></td> </tr><tr><th>Tipo</th> <td>Número</td> </tr><tr><th>Valor Padrão</th> <td><code>3306</code></td> </tr></tbody></table>

  O número de porta TCP/IP a ser usado para se conectar a um servidor remoto.
*  `--print-defaults`

  <table><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--print-defaults</code></td> </tr></tbody></table>

  Imprima o nome do programa e todas as opções que ele obtém de arquivos de opções.

Para obter informações adicionais sobre esta e outras opções de arquivos de opções, veja a Seção 6.2.2.3, “Opções da Linha de Comando que Afetam o Tratamento de Arquivos de Opções”.
*  `--print-table-metadata`

  <table><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--print-table-metadata</code></td> </tr></tbody></table>

Imprima metadados relacionados à tabela do log binário. Configure a quantidade de metadados binários relacionados à tabela registrados usando `binlog-row-metadata`.
*  `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--protocol=tipo</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>[ver texto]</code></td> </tr><tr><th>Valores válidos</th> <td><code>TCP</code><code>SOCKET</code><code>PIPE</code><code>MEMORY</code></td> </tr></tbody></table>

  O protocolo de transporte a ser usado para se conectar ao servidor. É útil quando os outros parâmetros de conexão normalmente resultam no uso de um protocolo diferente do desejado. Para obter detalhes sobre os valores permitidos, consulte a Seção 6.2.7, “Protocolos de transporte de conexão”.
*  `--raw`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--raw</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Por padrão, o `mysqlbinlog` lê arquivos de log binário e escreve eventos no formato de texto. A opção `--raw` indica ao `mysqlbinlog` que escreva-os em seu formato binário original. Seu uso requer que a opção `--read-from-remote-server` também seja usada, pois os arquivos são solicitados a partir de um servidor. O `mysqlbinlog` escreve um arquivo de saída para cada arquivo lido do servidor. A opção `--raw` pode ser usada para fazer um backup do log binário de um servidor. Com a opção `--stop-never`, o backup é “ativo” porque o `mysqlbinlog` permanece conectado ao servidor. Por padrão, os arquivos de saída são escritos no diretório atual com os mesmos nomes dos arquivos de log originais. Os nomes dos arquivos de saída podem ser modificados usando a opção `--result-file`. Para obter mais informações, consulte a Seção 6.6.9.3, “Usando mysqlbinlog para fazer backup de arquivos de log binário”.
*  `--read-from-remote-source=type`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--read-from-remote-source=type</code></td> </tr></tbody></table>

Esta opção lê logs binários de um servidor MySQL com os comandos `COM_BINLOG_DUMP` ou `COM_BINLOG_DUMP_GTID`, definindo o valor da opção para `BINLOG-DUMP-NON-GTIDS` ou `BINLOG-DUMP-GTIDS`, respectivamente. Se `--read-from-remote-source=BINLOG-DUMP-GTIDS` for combinado com `--exclude-gtids`, as transações podem ser filtradas na fonte, evitando tráfego de rede desnecessário.

Os parâmetros de conexão são usados com essas opções ou a opção `--read-from-remote-server`. Esses parâmetros são `--host`, `--password`, `--port`, `--protocol`, `--socket` e `--user`. Se nenhuma das opções remotas for especificada, os parâmetros de conexão são ignorados.

O privilégio `REPLICATION SLAVE` é necessário para usar essas opções.
*  `--read-from-remote-master=type`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--read-from-remote-master=type</code></td> </tr><tr><th>Descontinuado</th> <td>Sim</td> </tr></tbody></table>

  Sinônimo descontinuado de `--read-from-remote-source`.
*  `--read-from-remote-server=file_name`, `-R`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--read-from-remote-server=file_name</code></td> </tr></tbody></table>

  Leia o log binário de um servidor MySQL em vez de ler um arquivo de log local. Esta opção exige que o servidor remoto esteja em execução. Funciona apenas para arquivos de log binário no servidor remoto e não para arquivos de log de relevo. Aceita o nome do arquivo de log binário (incluindo o sufixo numérico) sem o caminho do arquivo.

  Os parâmetros de conexão são usados com esta opção ou a opção `--read-from-remote-source`. Esses parâmetros são `--host`, `--password`, `--port`, `--protocol`, `--socket` e `--user`. Se nenhuma das opções remotas for especificada, os parâmetros de conexão são ignorados.

  O privilégio `REPLICATION SLAVE` é necessário para usar esta opção.

  Esta opção é como `--read-from-remote-source=BINLOG-DUMP-NON-GTIDS`.
*  `--result-file=name`, `-r name`

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--result-file=nome</code></td> </tr></tbody></table>

Sem a opção `--raw`, esta opção indica o arquivo para o qual o `mysqlbinlog` escreve a saída de texto. Com `--raw`, o `mysqlbinlog` escreve um arquivo de saída binário para cada arquivo de log transferido do servidor, escrevendo-os, por padrão, no diretório atual usando os mesmos nomes que o arquivo de log original. Neste caso, o valor da opção `--result-file` é tratado como um prefixo que modifica os nomes dos arquivos de saída.
*  `--require-row-format`

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--require-row-format</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>false</code></td> </tr></tbody></table>

Exigir o formato de registro binário baseado em linhas para eventos. Esta opção força eventos de replicação baseados em linhas para a saída do `mysqlbinlog`. O fluxo de eventos produzido com esta opção seria aceito por um canal de replicação que seja protegido usando a opção `REQUIRE_ROW_FORMAT` da declaração `CHANGE REPLICATION SOURCE TO`. `binlog_format=ROW` deve ser definido no servidor onde o log binário foi escrito. Quando você especifica esta opção, o `mysqlbinlog` pára com uma mensagem de erro se encontrar quaisquer eventos que sejam proibidos pelas restrições de `REQUIRE_ROW_FORMAT`, incluindo instruções `LOAD DATA INFILE`, criação ou remoção de tabelas temporárias, eventos `INTVAR`, `RAND` ou `USER_VAR` e eventos não baseados em linhas dentro de uma transação DML. O `mysqlbinlog` também imprime uma declaração `SET @@session.require_row_format` no início de sua saída para aplicar as restrições quando a saída é executada e não imprime a declaração `SET @@session.pseudo_thread_id`.
*  `--rewrite-db='oldname-&gt;newname'`

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--rewrite-db='oldname-&gt;newname'</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

Ao ler de um log baseado em linha ou em declarações, reescreva todas as ocorrências de *`from_name`* para *`to_name`*. A reescrita é feita nas linhas, para logs baseados em linhas, bem como nas cláusulas `USE`, para logs baseados em declarações.

Aviso

As declarações nas quais os nomes das tabelas são qualificados com nomes de banco de dados não são reescritas para usar o novo nome ao usar esta opção.

A regra de reescrita empregada como valor para esta opção é uma string na forma `'from_name->to_name'`, conforme mostrado anteriormente, e, por isso, deve ser colocada entre aspas.

Para empregar múltiplas regras de reescrita, especifique a opção várias vezes, conforme mostrado aqui:

```
  mysqlbinlog --rewrite-db='dbcurrent->dbold' --rewrite-db='dbtest->dbcurrent' \
      binlog.00001 > /tmp/statements.sql
  ```

Quando usada juntamente com a opção `--database`, a opção `--rewrite-db` é aplicada primeiro; então a opção `--database` é aplicada, usando o nome do banco de dados reescrito. A ordem em que as opções são fornecidas não faz diferença nesse aspecto.

Isso significa, por exemplo, que, se o `mysqlbinlog` for iniciado com `--rewrite-db='mydb->yourdb' --database=yourdb`, então todas as atualizações em quaisquer tabelas nos bancos de dados `mydb` e `yourdb` serão incluídas na saída. Por outro lado, se for iniciado com `--rewrite-db='mydb->yourdb' --database=mydb`, o `mysqlbinlog` não emitirá nenhuma declaração: como todas as atualizações em `mydb` são reescritas primeiro como atualizações em `yourdb` antes de aplicar a opção `--database`, não restam atualizações que correspondam a `--database=mydb`.
*  `--server-id=id`

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--server-id=id</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr></tbody></table>

Exiba apenas aqueles eventos criados pelo servidor com o ID de servidor dado.
*  `--server-id-bits=N`

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--server-id-bits=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td><code>32</code></td> </tr><tr><th>Valor mínimo</th> <td><code>7</code></td> </tr><tr><th>Valor máximo</th> <td><code>32</code></td> </tr></tbody></table>

  Use apenas os primeiros *`N`* bits do `server_id` para identificar o servidor. Se o log binário foi escrito por um `mysqld` com `server-id-bits` definido como menor que 32 e os dados do usuário armazenados no bit mais significativo, executar   `mysqlbinlog` com `--server-id-bits` definido para 32 permite que esses dados sejam vistos.

  Esta opção é suportada apenas pela versão do  `mysqlbinlog` fornecida com a distribuição do NDB Cluster ou construída com suporte ao NDB Cluster.
*  `--server-public-key-path=file_name`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--server-public-key-path=file_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tbody></table>

  O nome do caminho de um arquivo no formato PEM contendo uma cópia do lado do cliente da chave pública necessária pelo servidor para a troca de senha com par de chaves RSA. Esta opção se aplica a clientes que se autenticam com o plugin de autenticação `sha256_password` (desatualizado) ou `caching_sha2_password`. Esta opção é ignorada para contas que não se autenticam com um desses plugins. Também é ignorada se a troca de senha baseada em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

  Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele tem precedência sobre `--get-server-public-key`.

  Para `sha256_password` (desatualizado), esta opção se aplica apenas se o MySQL foi construído usando OpenSSL.

  Para informações sobre os plugins `sha256_password` e `caching_sha2_password`, consulte a Seção 8.4.1.3, “Autenticação Personalizável SHA-256”, e a Seção 8.4.1.2, “Autenticação Caching SHA-2 Personalizável”.
*  `--set-charset=charset_name`

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--set-charset=charset_name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Adicione uma declaração `SET NAMES charset_name` à saída para especificar o conjunto de caracteres a ser usado para processar arquivos de log.
*  `--shared-memory-base-name=name`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--shared-memory-base-name=name</code></td> </tr><tr><th>Especifica para plataforma</th> <td>Windows</td> </tr></tbody></table>

  Em Windows, o nome da memória compartilhada a ser usado para conexões feitas usando memória compartilhada a um servidor local. O valor padrão é `MYSQL`. O nome da memória compartilhada é sensível a maiúsculas e minúsculas.

  Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `shared_memory` habilitada para suportar conexões de memória compartilhada.
*  `--short-form`, `-s`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--short-form</code></td> </tr></tbody></table>

  Exiba apenas as declarações contidas no log, sem nenhuma informação extra ou eventos baseados em linhas. Isso é para testes apenas e não deve ser usado em sistemas de produção. É desatualizado e você deve esperar que ele seja removido em uma futura versão.
*  `--skip-gtids[=(true|false)]`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--skip-gtids[=true|false]</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>false</code></td> </tr></tbody></table>

  Não inclua os GTIDs dos arquivos de log binários no arquivo de dump de saída. Por exemplo:

  ```
  mysqlbinlog --skip-gtids binlog.000001 >  /tmp/dump.sql
  mysql -u root -p -e "source /tmp/dump.sql"
  ```

Normalmente, você não deve usar essa opção na produção ou na recuperação, exceto nos cenários específicos e raros em que os GTIDs são indesejados ativamente. Por exemplo, um administrador pode querer duplicar transações selecionadas (como definições de tabelas) de uma implantação para outra, não relacionada, que não será replicada para ou a partir do original. Nesse cenário, `--skip-gtids` pode ser usado para permitir que o administrador aplique as transações como se fossem novas e garanta que as implantações permaneçam não relacionadas. No entanto, você deve usar essa opção apenas se a inclusão dos GTIDs causar um problema conhecido para o seu caso de uso.
*  `--socket=caminho`, `-S caminho`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--socket={nome_de_arquivo|nome_de_canal}</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Para conexões com `localhost`, o arquivo de socket Unix a ser usado ou, no Windows, o nome do canal nomeado a ser usado.

  No Windows, essa opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões por canal nomeado. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.
* `--ssl*`

  Opções que começam com `--ssl` especificam se conectar ao servidor usando criptografia e indicam onde encontrar as chaves e certificados SSL. Veja Opções de comando para conexões criptografadas.
*  `--ssl-fips-mode={OFF|ON|STRICT}`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--ssl-fips-mode={OFF|ON|STRICT}</code></td> </tr><tr><th>Descontinuado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr><tr><th>Valores válidos</th> <td><code>OFF</code><code>ON</code><code>STRICT</code></td> </tr></tbody></table>

Controla se o modo FIPS deve ser habilitado no lado do cliente. A opção `--ssl-fips-mode` difere de outras opções `--ssl-xxx` porque não é usada para estabelecer conexões criptografadas, mas sim para afetar quais operações criptográficas devem ser permitidas. Veja a Seção 8.8, “Suporte FIPS”.

Estes valores de `--ssl-fips-mode` são permitidos:

+ `OFF`: Desabilitar o modo FIPS.
+ `ON`: Habilitar o modo FIPS.
+ `STRICT`: Habilitar o modo FIPS “estricto”.

::: info Nota

Se o Módulo de Objeto FIPS do OpenSSL não estiver disponível, o único valor permitido para `--ssl-fips-mode` é `OFF`. Nesse caso, definir `--ssl-fips-mode` para `ON` ou `STRICT` faz com que o cliente produza um aviso na inicialização e opere no modo não FIPS.

:::

Esta opção está desatualizada. Espere que ela seja removida em uma versão futura do MySQL.
* `--start-datetime=datetime`

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--start-datetime=datetime</code></td> </tr><tr><th>Tipo</th> <td>Datetime</td> </tr></tbody></table>

Comece a ler o log binário no primeiro evento com um timestamp igual ou posterior ao argumento *`datetime`*. O valor *`datetime`* é relativo ao fuso horário local da máquina onde você executa o `mysqlbinlog`. O valor deve estar em um formato aceito para os tipos de dados `DATETIME` ou `TIMESTAMP`. Por exemplo:

```
  mysqlbinlog --start-datetime="2005-12-25 11:25:56" binlog.000003
  ```

Esta opção é útil para a recuperação ponto-no-tempo. Veja a Seção 9.5, “Recuperação Ponto-no-Tempo (Incremental)” (Recuperação").
* `--start-position=N`, `-j N`

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--start-position=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr></tbody></table>

Comece a decodificar o log binário na posição de log *`N`*, incluindo na saída quaisquer eventos que comecem na posição *`N`* ou após. A posição é um ponto de byte no arquivo de log, não um contador de eventos; ela precisa apontar para a posição inicial de um evento para gerar uma saída útil. Esta opção se aplica ao primeiro arquivo de log nomeado na linha de comando.

O valor máximo suportado para esta opção é 18446744073709551616 (264-1), a menos que `--read-from-remote-server` ou `--read-from-remote-source` também esteja sendo usado, caso em que o máximo é 4294967295.

Esta opção é útil para a recuperação em ponto no tempo. Consulte a Seção 9.5, “Recuperação em Ponto no Tempo (Incremental)” Recovery".
*  `--stop-datetime=datetime`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--stop-datetime=datetime</code></td> </tr></tbody></table>

  Pare de ler o log binário no primeiro evento com um timestamp igual ou posterior ao argumento *`datetime`*. Consulte a descrição da opção `--start-datetime` para obter informações sobre o valor *`datetime`*.

  Esta opção é útil para a recuperação em ponto no tempo. Consulte a Seção 9.5, “Recuperação em Ponto no Tempo (Incremental)” Recovery").
*  `--stop-never`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--stop-never</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Esta opção é usada com `--read-from-remote-server`. Ela indica ao `mysqlbinlog` que deve permanecer conectado ao servidor. Caso contrário, o `mysqlbinlog` sai quando o último arquivo de log tiver sido transferido do servidor. `--stop-never` implica `--to-last-log`, então apenas o primeiro arquivo de log a ser transferido precisa ser nomeado na linha de comando.

   `--stop-never` é comumente usado com  `--raw` para fazer uma cópia de segurança binária em tempo real, mas também pode ser usado sem `--raw` para manter uma exibição de texto contínua dos eventos do log conforme o servidor os gera.

  Com `--stop-never`, por padrão, o `mysqlbinlog` relata um ID de servidor de 1 quando se conecta ao servidor. Use `--connection-server-id` para especificar explicitamente um ID alternativo para relatar. Pode ser usado para evitar um conflito com o ID de um servidor replica ou outro processo `mysqlbinlog`. Consulte a Seção 6.6.9.4, “Especificando o ID de Servidor mysqlbinlog”.
*  `--stop-never-slave-server-id=id`

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--stop-never-slave-server-id=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td><code>65535</code></td> </tr><tr><th>Valor mínimo</th> <td><code>1</code></td> </tr></tbody></table>

  Esta opção está desatualizada; espere-se que seja removida em uma futura versão. Use a opção `--connection-server-id` em vez disso para especificar um ID de servidor para o `mysqlbinlog` para relatar.
*  `--stop-position=N`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--stop-position=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr></tbody></table>

  Pare de decodificar o log binário na posição de log *`N`*, excluindo da saída quaisquer eventos que comecem na posição *`N`* ou após. A posição é um ponto de byte no arquivo de log, não um contador de eventos; ela precisa apontar para um ponto após a posição inicial do último evento que você deseja incluir na saída. O evento que começa antes da posição *`N`* e termina em ou após a posição é o último evento a ser processado. Esta opção se aplica ao último arquivo de log nomeado na linha de comando.

  Esta opção é útil para a recuperação ponto a ponto. Veja a Seção 9.5, “Recuperação Ponto a Ponto (Incremental)” Recuperação".
*  `--tls-ciphersuites=ciphersuite_list`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--tls-ciphersuites=ciphersuite_list</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Os ciphersuites permitidos para conexões criptografadas que usam TLSv1.3. O valor é uma lista de um ou mais nomes de ciphersuites separados por vírgula. Os ciphersuites que podem ser nomeados para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para detalhes, consulte a Seção 8.3.2, “Protocolos e Ciphers TLS de Conexão Criptografada”.
*  `--tls-sni-servername=server_name`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--tls-sni-servername=server_name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

Quando especificado, o nome é passado para a biblioteca de API C `libmysqlclient` usando a opção `MYSQL_OPT_TLS_SNI_SERVERNAME` de `mysql_options()`. O nome do servidor não é case-sensitive. Para mostrar qual nome do servidor o cliente especificou para a sessão atual, se houver, verifique a variável `Tls_sni_server_name`.

A Indicação de Nome do Servidor (SNI) é uma extensão do protocolo TLS (o OpenSSL deve ser compilado com extensões TLS para que essa opção funcione). A implementação do MySQL do SNI representa apenas o lado do cliente.
*  `--tls-version=protocol_list`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--tls-version=protocol_list</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>TLSv1,TLSv1.1,TLSv1.2,TLSv1.3</code> (OpenSSL 1.1.1 ou superior)<code>TLSv1,TLSv1.1,TLSv1.2</code> (caso contrário)</td> </tr></tbody></table>

  Os protocolos TLS permitidos para conexões criptografadas. O valor é uma lista de um ou mais nomes de protocolos separados por vírgula. Os protocolos que podem ser nomeados para essa opção dependem da biblioteca SSL usada para compilar o MySQL. Para detalhes, consulte a Seção 8.3.2, “Protocolos e cifra TLS de conexão criptografada”.
*  `--to-last-log`, `-t`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--to-last-log</code></td> </tr></tbody></table>

  Não pare no final do log binário solicitado de um servidor MySQL, mas sim continue imprimindo até o final do último log binário. Se você enviar a saída para o mesmo servidor MySQL, isso pode levar a um loop infinito. Esta opção requer `--read-from-remote-server`.
*  `--user=user_name`, `-u user_name`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--user=user_name,</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  O nome do usuário da conta MySQL a ser usado ao se conectar a um servidor remoto.

  Se você estiver usando o plugin `Rewriter`, você deve conceder a este usuário o privilégio `SKIP_QUERY_REWRITE`.
*  `--verbose`, `-v`

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--verbose</code></td> </tr></tbody></table>

  Reconstrói eventos de linha e exibe-os como instruções SQL comentadas, com informações sobre a partição da tabela, quando aplicável. Se esta opção for fornecida duas vezes (através da passagem de "-vv" ou "`--verbose` `--verbose`"), a saída inclui comentários para indicar os tipos de dados das colunas e alguns metadados, além de eventos de log informativos, como eventos de log de consulta de linha, se a variável de sistema `binlog_rows_query_log_events` estiver definida como `TRUE`.

  Para exemplos que mostram o efeito de `--base64-output` e `--verbose` na saída de eventos de linha, consulte  Seção 6.6.9.2, “Exibição de Eventos de Linha mysqlbinlog”.
*  `--verify-binlog-checksum`, `-c`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--verify-binlog-checksum</code></td> </tr></tbody></table>

  Verifique os checksums em arquivos de log binário.
*  `--version`, `-V`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--version</code></td> </tr></tbody></table>

  Exibir informações de versão e sair.
*  `--zstd-compression-level=level`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--zstd-compression-level=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr></tbody></table>

  O nível de compressão a ser usado para conexões com o servidor que utilizam o algoritmo de compressão `zstd`. Os níveis permitidos variam de 1 a 22, com valores maiores indicando níveis crescentes de compressão. O nível de compressão padrão é 3. A configuração do nível de compressão não tem efeito em conexões que não utilizam compressão `zstd`.

  Para mais informações, consulte Seção 6.2.8, “Controle de Compressão de Conexão”.

Você pode canalizar a saída de `mysqlbinlog` para o cliente `mysql` para executar os eventos contidos no log binário. Essa técnica é usada para recuperar de uma saída inesperada quando você tem um backup antigo (consulte Seção 9.5, “Recuperação Ponto no Tempo (Incremental)” Recovery"). Por exemplo:

```
mysqlbinlog binlog.000001 | mysql -u root -p
```

Ou:

```
mysqlbinlog binlog.[0-9]* | mysql -u root -p
```

Se as declarações geradas pelo `mysqlbinlog` puderem conter valores `BLOB`, isso pode causar problemas quando o `mysql` as processa. Nesse caso, invocando o `mysql` com a opção `--binary-mode`.

Você também pode redirecionar a saída do `mysqlbinlog` para um arquivo de texto, se precisar modificar o log de declarações primeiro (por exemplo, para remover declarações que você não deseja executar por algum motivo). Após editar o arquivo, execute as declarações que ele contém usando-o como entrada para o programa `mysql`:

```
mysqlbinlog binlog.000001 > tmpfile
... edit tmpfile ...
mysql -u root -p < tmpfile
```

Quando o `mysqlbinlog` é invocado com a opção `--start-position`, ele exibe apenas aqueles eventos com um deslocamento no log binário maior ou igual a uma posição dada (a posição dada deve corresponder ao início de um evento). Ele também tem opções para parar e começar quando vê um evento com uma data e hora dadas. Isso permite que você realize a recuperação em um ponto no tempo usando a opção `--stop-datetime` (para poder dizer, por exemplo, “avançar minhas bases de dados para como estavam hoje às 10:30 da manhã”).

**Processamento de vários arquivos.** Se você tiver mais de um log binário a ser executado no servidor MySQL, o método seguro é processá-los todos usando uma única conexão com o servidor. Aqui está um exemplo que demonstra o que pode ser *inseguro*:

```
mysqlbinlog binlog.000001 | mysql -u root -p # DANGER!!
mysqlbinlog binlog.000002 | mysql -u root -p # DANGER!!
```

Processar logs binários dessa maneira usando várias conexões com o servidor causa problemas se o primeiro arquivo de log contiver uma declaração `CREATE TEMPORARY TABLE` e o segundo log contiver uma declaração que usa a tabela temporária. Quando o primeiro processo `mysql` termina, o servidor elimina a tabela temporária. Quando o segundo processo `mysql` tenta usar a tabela, o servidor relata “tabela desconhecida”.

Para evitar problemas como esse, use um *único* processo `mysql` para executar o conteúdo de todos os logs binários que você deseja processar. Aqui está uma maneira de fazer isso:

```
mysqlbinlog binlog.000001 binlog.000002 | mysql -u root -p
```

Outra abordagem é escrever todos os logs em um único arquivo e depois processar o arquivo:

```
mysqlbinlog binlog.000001 >  /tmp/statements.sql
mysqlbinlog binlog.000002 >> /tmp/statements.sql
mysql -u root -p -e "source /tmp/statements.sql"
```

Você também pode fornecer vários arquivos de log binário para o `mysqlbinlog` como entrada em fluxo usando um tubo de shell. Um arquivo de log binário comprimido pode ser descompactado e fornecido diretamente ao `mysqlbinlog`. Neste exemplo, `binlog-files_1.gz` contém vários arquivos de log binário para processamento. O pipeline extrai o conteúdo de `binlog-files_1.gz`, envia os arquivos de log binário para o   `mysqlbinlog` como entrada padrão e envia a saída do   `mysqlbinlog` para o cliente `mysql` para execução:

```
gzip -cd binlog-files_1.gz | ./mysqlbinlog - | ./mysql -uroot  -p
```

Você pode especificar mais de um arquivo de arquivo, por exemplo:

```
gzip -cd binlog-files_1.gz binlog-files_2.gz | ./mysqlbinlog - | ./mysql -uroot  -p
```

Para entrada em fluxo, não use `--stop-position`, porque o `mysqlbinlog` não pode identificar o último arquivo de log para aplicar essa opção.

**Operações `LOAD DATA`.** O `mysqlbinlog` pode produzir saída que reproduz uma operação `LOAD DATA` sem o arquivo de dados original. O `mysqlbinlog` copia os dados para um arquivo temporário e escreve uma declaração `LOAD DATA LOCAL` que se refere ao arquivo. A localização padrão do diretório onde esses arquivos são escritos é específica do sistema. Para especificar um diretório explicitamente, use a opção `--local-load`.

Como o `mysqlbinlog` converte as declarações `LOAD DATA` em declarações `LOAD DATA LOCAL` (ou seja, adiciona `LOCAL`), o cliente e o servidor que você usa para processar as declarações devem ser configurados com a capacidade `LOCAL` habilitada.

Aviso

Os arquivos temporários criados para declarações `LOAD DATA LOCAL` não são *automaticamente* excluídos porque são necessários até que você execute essas declarações. Você deve excluir os arquivos temporários você mesmo depois de não precisar mais do log da declaração. Os arquivos podem ser encontrados no diretório de arquivos temporários e têm nomes como *`original_file_name-#-#`*.