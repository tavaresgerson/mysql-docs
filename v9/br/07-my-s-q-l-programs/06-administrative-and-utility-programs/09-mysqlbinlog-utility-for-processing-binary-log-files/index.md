### 6.6.9 mysqlbinlog — Ferramenta para processar arquivos de log binário

6.6.9.1 Formato de Exibição Hexadecimal de mysqlbinlog

6.6.9.2 Exibição de Eventos de Linha de mysqlbinlog

6.6.9.3 Usando mysqlbinlog para fazer backup de arquivos de log binário

6.6.9.4 Especificando o ID do servidor mysqlbinlog

O log binário do servidor consiste em arquivos que contêm “eventos” que descrevem as modificações no conteúdo do banco de dados. O servidor escreve esses arquivos no formato binário. Para exibir seu conteúdo no formato de texto, use a **ferramenta mysqlbinlog**. Você também pode usar **mysqlbinlog** para exibir o conteúdo dos arquivos de log de retransmissão escritos por um servidor replica em uma configuração de replicação, pois os logs de retransmissão têm o mesmo formato que os logs binários. O log binário e o log de retransmissão são discutidos mais detalhadamente na Seção 7.4.4, “O Log Binário”, e na Seção 19.2.4, “Repositórios de Metadados de Log de Retransmissão e Replicação”.

Inicie o **mysqlbinlog** da seguinte forma:

```
mysqlbinlog [options] log_file ...
```

Por exemplo, para exibir o conteúdo do arquivo de log binário chamado `binlog.000003`, use este comando:

```
mysqlbinlog binlog.000003
```

A saída inclui os eventos contidos em `binlog.000003`. Para o registro de eventos baseado em instruções, as informações dos eventos incluem a instrução SQL, o ID do servidor em que ela foi executada, o timestamp da execução da instrução, o tempo necessário e assim por diante. Para o registro de eventos baseado em linhas, o evento indica uma mudança de linha em vez de uma instrução SQL. Consulte a Seção 19.2.1, “Formulários de Replicação”, para informações sobre os modos de registro.

Os eventos são precedidos por comentários de cabeçalho que fornecem informações adicionais. Por exemplo:

```
# at 141
#100309  9:28:36 server id 123  end_log_pos 245
  Query thread_id=3350  exec_time=11  error_code=0
```

Na primeira linha, o número que segue `at` indica o deslocamento do arquivo, ou a posição inicial, do evento no arquivo de log binário.

A segunda linha começa com uma data e hora que indica quando a declaração começou no servidor onde o evento se originou. Para a replicação, este timestamp é propagado para os servidores replicados. `id_servidor` é o valor `server_id` do servidor onde o evento se originou. `end_log_pos` indica onde o próximo evento começa (ou seja, é a posição final do evento atual + 1). `id_thread` indica qual thread executou o evento. `exec_time` é o tempo gasto executando o evento, em um servidor de origem de replicação. Em uma replica, é a diferença do tempo de execução final na replica menos o tempo de execução inicial na origem. A diferença serve como um indicador de quanto a replica está atrasada em relação à origem. `error_code` indica o resultado da execução do evento. Zero significa que não houve erro.

Nota

Ao usar grupos de eventos, os offsets de arquivo dos eventos podem ser agrupados e os comentários dos eventos podem ser agrupados. Não confunda esses eventos agrupados com offsets de arquivo em branco.

A saída do **mysqlbinlog** pode ser reexecutada (por exemplo, usando-o como entrada para **mysql**) para refazer as declarações no log. Isso é útil para operações de recuperação após uma saída inesperada do servidor. Para outros exemplos de uso, consulte a discussão mais adiante nesta seção e na Seção 9.5, “Recuperação Ponto em Tempo (Incremental”)”. Para executar as declarações de uso interno `BINLOG` usadas pelo **mysqlbinlog**, o usuário requer o privilégio `BINLOG_ADMIN` (ou o privilégio desatualizado `SUPER`) ou o privilégio `REPLICATION_APPLIER` mais os privilégios apropriados para executar cada evento de log.

Você pode usar **mysqlbinlog** para ler arquivos de log binários diretamente e aplicá-los ao servidor MySQL local. Você também pode ler logs binários de um servidor remoto usando a opção `--read-from-remote-server`. Para ler logs binários remotos, as opções de parâmetros de conexão podem ser fornecidas para indicar como se conectar ao servidor. Essas opções são `--host`, `--password`, `--port`, `--protocol`, `--socket` e `--user`.

Quando os arquivos de log binários foram criptografados, **mysqlbinlog** não pode lê-los diretamente, mas pode lê-los do servidor usando a opção `--read-from-remote-server`. Os arquivos de log binários são criptografados quando a variável de sistema `binlog_encryption` do servidor é definida como `ON`. A instrução `SHOW BINARY LOGS` mostra se um arquivo de log binário específico está criptografado ou não. Arquivos de log binários criptografados e não criptografados também podem ser distinguidos usando o número mágico no início do cabeçalho do arquivo para arquivos de log criptografados (`0xFD62696E`), que difere do usado para arquivos de log não criptografados (`0xFE62696E`). Note que **mysqlbinlog** retorna um erro adequado se você tentar ler um arquivo de log binário criptografado diretamente, mas versões mais antigas de **mysqlbinlog** não reconhecem o arquivo como um arquivo de log binário. Para mais informações sobre criptografia de log binário, consulte a Seção 19.3.2, “Criptografar Arquivos de Log Binário e Arquivos de Log Relay”.

Quando os payloads de transações de log binário são comprimidos, o **mysqlbinlog** descomprime e decodifica automaticamente os payloads de transações e os imprime como eventos não comprimidos. Quando `binlog_transaction_compression` é definido como `ON`, os payloads de transações são comprimidos e então escritos no arquivo de log binário do servidor como um único evento (um `Transaction_payload_event`). Com a opção `--verbose`, o **mysqlbinlog** adiciona comentários indicando o algoritmo de compressão usado, o tamanho do payload comprimido que foi originalmente recebido e o tamanho do payload resultante após a descomprimagem.

Nota

A posição final (`end_log_pos`) que o **mysqlbinlog** indica para um evento individual que fazia parte de um payload de transação comprimido é a mesma da posição final do payload comprimido original. Portanto, múltiplos eventos descomprimidos podem ter a mesma posição final.

A compressão de conexão própria do **mysqlbinlog** faz menos se os payloads de transação já estiverem comprimidos, mas ainda opera em transações e cabeçalhos não comprimidos.

Para obter mais informações sobre a compressão de transações de log binário, consulte a Seção 7.4.4.5, “Compressão de Transações de Log Binário”.

Ao executar o **mysqlbinlog** em um log binário grande, tenha cuidado para que o sistema de arquivos tenha espaço suficiente para os arquivos resultantes. Para configurar o diretório que o **mysqlbinlog** usa para arquivos temporários, use a variável de ambiente `TMPDIR`.

O **mysqlbinlog** define o valor de `pseudo_replica_mode` para `true` antes de executar quaisquer instruções SQL. Esta variável de sistema afeta o tratamento de transações XA, o timestamp de atraso de replicação `original_commit_timestamp` e a variável de sistema `original_server_version`, e modos de SQL não suportados.

O **mysqlbinlog** suporta as seguintes opções, que podem ser especificadas na linha de comando ou nos grupos `[mysqlbinlog]` e `[client]` de um arquivo de opções. Para obter informações sobre os arquivos de opções usados pelos programas do MySQL, consulte a Seção 6.2.2.2, “Usando arquivos de opções”.

**Tabela 6.21 Opções mysqlbinlog**

<table frame="box" rules="all" summary="Opções de linha de comando disponíveis para mysqlbinlog">
<tr><th>Nome da opção</th> <th>Descrição</th> </tr>
<tr><td>--base64-output</td> <td>Imprima entradas de log binário usando codificação base64</td> </tr>
<tr><td>--bind-address</td> <td>Use a interface de rede especificada para se conectar ao servidor MySQL</td> </tr>
<tr><td>--binlog-row-event-max-size</td> <td>Tamanho máximo de evento de log binário</td> </tr>
<tr><td>--character-sets-dir</td> <td>Diretório onde os conjuntos de caracteres são instalados</td> </tr>
<tr><td>--compress</td> <td>Compress todas as informações enviadas entre o cliente e o servidor</td> </tr>
<tr><td>--compression-algorithms</td> <td>Algoritmos de compressão permitidos para conexões com o servidor</td> </tr>
<tr><td>--connection-server-id</td> <td>Usado para testes e depuração. Consulte o texto para valores aplicáveis e outras informações detalhadas</td> </tr>
<tr><td>--database</td> <td>Listar entradas para apenas esta base de dados</td> </tr>
<tr><td>--debug</td> <td>Escrever log de depuração</td> </tr>
<tr><td>--debug-check</td> <td>Imprimir informações de depuração quando o programa sai</td> </tr>
<tr><td>--debug-info</td> <td>Imprimir informações de depuração, estatísticas de memória e CPU quando o programa sai</td> </tr>
<tr><td>--defaults-extra-file</td> <td>Leia o arquivo de opção adicional além dos arquivos de opção usuais</td> </tr>
<tr><td>--defaults-file</td> <td>Leia apenas o arquivo de opção</td> </tr>
<tr><td>--defaults-group-suffix</td> <td>Valor do sufixo de grupo de opção</td> </tr>
<tr><td>--disable-log-bin</td> <td>Desabilitar o log binário</td> </tr>
<tr><td>--force-if-open</td> <td>Ler arquivos de log binário mesmo se estiverem abertos ou não fechados corretamente</td> </tr>
<tr><td>--force-read</td> <td>Se mysqlbinlog ler um evento de log binário que não reconhece, imprima um aviso</td> </tr>
<tr><td>--get-server-public-key</td> <td>Solicitar a chave pública do servidor MySQL</td> </tr>
<tr><td><a class="link" href="mysqlbinlog.html#option_mysql

* `--help`, `-?`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tr><th>Formato de Linha de Comando</th> <td><code>--help</code></td> </tr></table>

  Exibir uma mensagem de ajuda e sair.

* `--base64-output=value`

  <table frame="box" rules="all" summary="Propriedades para base64-output"><tr><th>Formato de Linha de Comando</th> <td><code>--base64-output=value</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>AUTO</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>AUTO</code></p><p><code>NEVER</code></p><p><code>DECODE-ROWS</code></p></td> </tr></table>

  Esta opção determina quando os eventos devem ser exibidos codificados como strings base64 usando as instruções `BINLOG`. A opção tem esses valores permitidos (não case-sensitive):

  + `AUTO` ("automático") ou `UNSPEC` ("não especificado") exibe as instruções `BINLOG` automaticamente quando necessário (ou seja, para eventos de descrição de formato e eventos de linha). Se nenhuma opção `--base64-output` for fornecida, o efeito é o mesmo que `--base64-output=AUTO`.

    Nota

    A exibição automática de `BINLOG` é o único comportamento seguro se você pretende usar a saída de **mysqlbinlog** para reexecutar o conteúdo do arquivo de log binário. Os outros valores das opções são destinados apenas para fins de depuração ou teste, pois podem produzir saída que não inclui todos os eventos na forma executável.

+ `NEVER` faz com que as instruções `BINLOG` não sejam exibidas. **mysqlbinlog** sai com um erro se um evento de linha for encontrado que deve ser exibido usando `BINLOG`.

+ `DECODE-ROWS` especifica para **mysqlbinlog** que você pretende que os eventos de linha sejam decodificados e exibidos como instruções SQL comentadas, especificando também a opção `--verbose`. Assim como `NEVER`, `DECODE-ROWS` suprime a exibição das instruções `BINLOG`, mas, ao contrário de `NEVER`, não sai com um erro se um evento de linha for encontrado.

Para exemplos que mostram o efeito de `--base64-output` e `--verbose` na saída de eventos de linha, consulte a Seção 6.6.9.2, “Exibição de Eventos de Linha de mysqlbinlog”.

* `--bind-address=ip_address`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  Em um computador com múltiplas interfaces de rede, use esta opção para selecionar qual interface usar para se conectar ao servidor MySQL.

* `--binlog-row-event-max-size=N`

  <table frame="box" rules="all" summary="Propriedades para binlog-row-event-max-size"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--binlog-row-event-max-size=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor Padrão</th> <td><code>4294967040</code></td> </tr><tr><th>Valor Mínima</th> <td><code>256</code></td> </tr><tr><th>Valor Máximo</th> <td><code>18446744073709547520</code></td> </tr></tbody></table>

Especifique o tamanho máximo de um evento de log binário baseado em linhas, em bytes. As linhas são agrupadas em eventos menores que esse tamanho, se possível. O valor deve ser um múltiplo de 256. O padrão é 4 GB.

* `--character-sets-dir=dir_name`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>

  O diretório onde os conjuntos de caracteres são instalados. Consulte a Seção 12.15, “Configuração de Conjunto de Caracteres”.

* `--compress`

  <table frame="box" rules="all" summary="Propriedades para compress"><tbody><tr><th>Formato de linha de comando</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Compressar todas as informações enviadas entre o cliente e o servidor, se possível. Consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.

  Esta opção está desatualizada. Espere que ela seja removida em uma versão futura do MySQL. Consulte Configurando a Compressão de Conexão Legado.

* `--compression-algorithms=value`

<table frame="box" rules="all" summary="Propriedades para algoritmos de compressão">
  <tr><th>Formato de Linha de Comando</th> <td><code>--compression-algorithms=valor</code></td> </tr>
  <tr><th>Tipo</th> <td>Definido</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>não comprimido</code></td> </tr>
  <tr><th>Valores Válidos</th> <td><p><code>zlib</code></p><p><code>zstd</code></p><p><code>não comprimido</code></p></td> </tr>
</table>

  Os algoritmos de compressão permitidos para conexões com o servidor. Os algoritmos disponíveis são os mesmos da variável de sistema `protocol_compression_algorithms`. O valor padrão é `não comprimido`.

  Para mais informações, consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.

* `--connection-server-id=id_do_servidor`

  <table frame="box" rules="all" summary="Propriedades para id_do_servidor_de_conexão">
    <tr><th>Formato de Linha de Comando</th> <td><code>--connection-server-id=#]</code></td> </tr>
    <tr><th>Tipo</th> <td>Inteiro</td> </tr>
    <tr><th>Valor Padrão</th> <td><code>0 (1)</code></td> </tr>
    <tr><th>Valor Mínimo</th> <td><code>0 (1)</code></td> </tr>
    <tr><th>Valor Máximo</th> <td><code>4294967295</code></td> </tr>
  </table>

  `--connection-server-id` especifica o ID do servidor que o **mysqlbinlog** reporta quando se conecta ao servidor. Ele pode ser usado para evitar um conflito com o ID de um servidor replica ou outro processo **mysqlbinlog**.

Se a opção `--read-from-remote-server` for especificada, o **mysqlbinlog** reporta um ID de servidor de 0, o que instrui o servidor a se desconectar após enviar o último arquivo de log (comportamento não bloqueante). Se a opção `--stop-never` também for especificada para manter a conexão com o servidor, o **mysqlbinlog** reporta um ID de servidor padrão de 1 em vez de 0, e `--connection-server-id` pode ser usado para substituir esse ID de servidor, se necessário. Veja a Seção 6.6.9.4, “Especificando o ID de Servidor mysqlbinlog”.

* `--database=db_name`, -d db_name

  <table frame="box" rules="all" summary="Propriedades para o banco de dados"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--database=db_name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Esta opção faz com que o **mysqlbinlog** exiba entradas do log binário (apenas log local) que ocorrem enquanto *`db_name`* é selecionado como o banco de dados padrão pelo `USE`.

  A opção `--database` para o **mysqlbinlog** é semelhante à opção `--binlog-do-db` para o **mysqld**, mas pode ser usada para especificar apenas um banco de dados. Se `--database` for dada várias vezes, apenas a última instância é usada.

  Os efeitos desta opção dependem se o formato de registro baseado em declarações ou baseado em linhas está em uso, da mesma forma que os efeitos de `--binlog-do-db` dependem se o registro baseado em declarações ou baseado em linhas está em uso.

  **Registro baseado em declarações.** A opção `--database` funciona da seguinte forma:

  + Enquanto *`db_name`* é o banco de dados padrão, as declarações são exibidas, independentemente de elas modificar tabelas em *`db_name`* ou em um banco de dados diferente.

  + A menos que *`db_name`* seja selecionado como o banco de dados padrão, as declarações não são exibidas, mesmo que modifiquem tabelas em *`db_name`*.

Há uma exceção para `CREATE DATABASE`, `ALTER DATABASE` e `DROP DATABASE`. O banco de dados que está sendo *criado, alterado ou excluído* é considerado o banco de dados padrão ao determinar se a declaração será exibida.

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

**mysqlbinlog --database=test** não exibe as duas primeiras declarações `INSERT` porque não há um banco de dados padrão. Ele exibe as três declarações `INSERT` após `USE test`, mas não as três declarações `INSERT` após `USE db2`.

**mysqlbinlog --database=db2** não exibe as duas primeiras declarações `INSERT` porque não há um banco de dados padrão. Ele não exibe as três declarações `INSERT` após `USE test`, mas exibe as três declarações `INSERT` após `USE db2`.

**Registro baseado em linhas.** **mysqlbinlog** exibe apenas as entradas que alteram tabelas pertencentes a *`db_name`*. O banco de dados padrão não tem efeito sobre isso. Suponha que o log binário recém-descrito foi criado usando o registro baseado em linhas, em vez do registro baseado em declarações. **mysqlbinlog --database=test** exibe apenas as entradas que modificam `t1` no banco de dados test, independentemente de se a declaração `USE` ter sido emitida ou qual seja o banco de dados padrão.

Se um servidor estiver rodando com `binlog_format` definido como `MIXED` e você quiser que seja possível usar **mysqlbinlog** com a opção `--database`, você deve garantir que as tabelas que são modificadas estejam no banco de dados selecionado por `USE`. (Em particular, não devem ser usadas atualizações cruzadas entre bancos de dados.)

Quando usado juntamente com a opção `--rewrite-db`, a opção `--rewrite-db` é aplicada primeiro; em seguida, a opção `--database` é aplicada, usando o nome do banco de dados reescrito. A ordem em que as opções são fornecidas não faz diferença nesse aspecto.

* `--debug[=debug_options]`, `-# [debug_options]`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Escreva um log de depuração. Uma string típica de *`debug_options`* é `d:t:o,nome_do_arquivo`. O padrão é `d:t:o,/tmp/mysqlbinlog.trace`.

  Esta opção está disponível apenas se o MySQL foi compilado com `WITH_DEBUG`. Os binários de liberação do MySQL fornecidos pela Oracle *não* são compilados com esta opção.

* `--debug-check`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Imprima algumas informações de depuração quando o programa sair.

  Esta opção está disponível apenas se o MySQL foi compilado com `WITH_DEBUG`. Os binários de liberação do MySQL fornecidos pela Oracle *não* são compilados com esta opção.

* `--debug-info`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Imprima informações de depuração e estatísticas de uso de memória e CPU quando o programa sair.

  Esta opção está disponível apenas se o MySQL foi compilado com `WITH_DEBUG`. Os binários de liberação do MySQL fornecidos pela Oracle *não* são compilados com esta opção.

* `--default-auth=plugin`

<table frame="box" rules="all" summary="Propriedades para ajuda">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code>--help</code></td>
  </tr>
</table>

  Leia este arquivo de opção após o arquivo de opção global, mas (no Unix) antes do arquivo de opção do usuário. Se o arquivo não existir ou estiver inacessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opção, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivos de opção”.

  * `--defaults-extra-file=file_name`

  <table frame="box" rules="all" summary="Propriedades para ajuda">
    <tr>
      <th>Formato de linha de comando</th>
      <td><code>--help</code></td>
    </tr>
  </table>

  Use apenas o arquivo de opção fornecido. Se o arquivo não existir ou estiver inacessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

  Exceção: Mesmo com `--defaults-file`, os programas cliente leem `.mylogin.cnf`.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opção, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivos de opção”.

  * `--defaults-group-suffix=str`

<table frame="box" rules="all" summary="Propriedades de ajuda">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code>--help</code></td>
  </tr>
</table>

  Leia não apenas os grupos de opções habituais, mas também grupos com os nomes habituais e um sufixo de *`str`*. Por exemplo, **mysqlbinlog** normalmente lê os grupos `[client]` e `[mysqlbinlog]`. Se esta opção for fornecida como `--defaults-group-suffix=_other`, **mysqlbinlog** também lê os grupos `[client_other]` e `[mysqlbinlog_other]`.

  Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivos de opções”.

* `--disable-log-bin`, `-D`

  <table frame="box" rules="all" summary="Propriedades de ajuda">
    <tr>
      <th>Formato de linha de comando</th>
      <td><code>--help</code></td>
    </tr>
  </table>

  Desative o registro binário. Isso é útil para evitar um loop infinito se você usar a opção `--to-last-log` e estiver enviando a saída para o mesmo servidor MySQL. Esta opção também é útil ao restaurar após uma saída inesperada para evitar a duplicação das declarações que você registrou.

  Esta opção faz com que **mysqlbinlog** inclua uma declaração `SET sql_log_bin = 0` em sua saída para desativar o registro binário do restante da saída. Manipular o valor da sessão da variável de sistema `sql_log_bin` é uma operação restrita, portanto, esta opção requer que você tenha privilégios suficientes para definir variáveis de sessão restritas. Consulte a Seção 7.1.9.1, “Privilégios de variáveis de sistema”.

* `--exclude-gtids=gtid_set`

<table frame="box" rules="all" summary="Propriedades de ajuda">
  <tr><th>Formato de linha de comando</th> <td><code>--help</code></td> </tr>
</table>

  Não exiba nenhum dos grupos listados no *`gtid_set`*.

* `--force-if-open`, `-F`

  <table frame="box" rules="all" summary="Propriedades de ajuda">
    <tr><th>Formato de linha de comando</th> <td><code>--help</code></td> </tr>
  </table>

  Leia arquivos de log binários mesmo que estejam abertos ou não tenham sido fechados corretamente (a bandeira `IN_USE` está definida); não falhe se o arquivo terminar com um evento truncado.

  A bandeira `IN_USE` é definida apenas para o log binário que está sendo escrito atualmente pelo servidor; se o servidor falhar, a bandeira permanece definida até que o servidor seja reiniciado e recupere o log binário. Sem essa opção, o **mysqlbinlog** se recusa a processar um arquivo com essa bandeira definida. Como o servidor pode estar no processo de gravação do arquivo, a truncagem do último evento é considerada normal.

* `--force-read`, `-f`

  <table frame="box" rules="all" summary="Propriedades de saída em base64">
    <tr><th>Formato de linha de comando</th> <td><code>--base64-output=valor</code></td> </tr>
    <tr><th>Tipo</th> <td>String</td> </tr>
    <tr><th>Valor padrão</th> <td><code>AUTO</code></td> </tr>
    <tr><th>Valores válidos</th> <td><p><code>AUTO</code></p><p><code>NEVER</code></p><p><code>DECODE-ROWS</code></p></td> </tr>
  </table>

Com esta opção, se o **mysqlbinlog** ler um evento de log binário que ele não reconhece, ele imprime um aviso, ignora o evento e continua. Sem esta opção, o **mysqlbinlog** para se ele ler tal evento.

* `--get-server-public-key`

  <table frame="box" rules="all" summary="Propriedades para saída em base64"><tbody><tr><th>Formato de linha de comando</th> <td><code>--base64-output=valor</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>AUTO</code></td> </tr><tr><th>Valores válidos</th> <td><p><code>AUTO</code></p><p><code>NEVER</code></p><p><code>DECODE-ROWS</code></p></td> </tr></tbody></table>

  Peça ao servidor para obter a chave pública necessária para a troca de senha com base em um par de chaves RSA. Esta opção se aplica a clientes que se autenticam com o plugin de autenticação `caching_sha2_password`. Para esse plugin, o servidor não envia a chave pública a menos que seja solicitado. Esta opção é ignorada para contas que não se autenticam com esse plugin. Também é ignorada se a troca de senha baseada em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

  Se `--server-public-key-path=nome_arquivo` for fornecido e especificar um arquivo de chave pública válido, ele tem precedência sobre `--get-server-public-key`.

  Para informações sobre o plugin `caching_sha2_password`, consulte a Seção 8.4.1.1, “Cacheamento de Autenticação Pluggable SHA-2”.

* `--hexdump`, `-H`

<table frame="box" rules="all" summary="Propriedades para saída base64"><tbody><tr><th>Formato de linha de comando</th> <td><code>--base64-output=valor</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>AUTO</code></td> </tr><tr><th>Valores válidos</th> <td><p><code>AUTO</code></p><p><code>NEVER</code></p><p><code>DECODE-ROWS</code></p></td> </tr></tbody></table>

  Exibir um dump hexadecimal do log em comentários, conforme descrito na Seção 6.6.9.1, “Formato de Dump Hexadecimal de mysqlbinlog”. A saída hexadecimal pode ser útil para depuração de replicação.

* `--host=nome_do_host`, `-h nome_do_host`

  <table frame="box" rules="all" summary="Propriedades para saída base64"><tbody><tr><th>Formato de linha de comando</th> <td><code>--base64-output=valor</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>AUTO</code></td> </tr><tr><th>Valores válidos</th> <td><p><code>AUTO</code></p><p><code>NEVER</code></p><p><code>DECODE-ROWS</code></p></td> </tr></tbody></table>

  Obter o log binário do servidor MySQL no host fornecido.

* `--idempotent`

<table frame="box" rules="all" summary="Propriedades para saída base64"><tbody><tr><th>Formato de linha de comando</th> <td><code>--base64-output=valor</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>AUTO</code></td> </tr><tr><th>Valores válidos</th> <td><p><code>AUTO</code></p><p><code>NEVER</code></p><p><code>DECODE-ROWS</code></p></td> </tr></tbody></table>

  Informe ao servidor MySQL para usar o modo idempotente durante o processamento de atualizações; isso causa a supressão de quaisquer erros de chave duplicada ou chave não encontrada que o servidor encontre na sessão atual durante o processamento de atualizações. Esta opção pode ser útil sempre que seja desejável ou necessário reproduzir um ou mais logs binários para um servidor MySQL que pode não conter todos os dados a que os logs se referem.

  O escopo de efeito desta opção inclui apenas o cliente e a sessão **mysqlbinlog** atuais.

* `--include-gtids=gtid_set`

  <table frame="box" rules="all" summary="Propriedades para saída base64"><tbody><tr><th>Formato de linha de comando</th> <td><code>--base64-output=valor</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>AUTO</code></td> </tr><tr><th>Valores válidos</th> <td><p><code>AUTO</code></p><p><code>NEVER</code></p><p><code>DECODE-ROWS</code></p></td> </tr></tbody></table>

  Exiba apenas os grupos listados no *`gtid_set`*.

* `--local-load=nome_diretório`, `-l nome_diretório`

  <table frame="box" rules="all" summary="Propriedades para saída em base64"><tbody><tr><th>Formato de linha de comando</th> <td><code>--base64-output=valor</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>AUTO</code></td> </tr><tr><th>Valores válidos</th> <td><p><code>AUTO</code></p><p><code>NEVER</code></p><p><code>DECODE-ROWS</code></p></td> </tr></tbody></table>

  Para operações de carregamento de dados correspondentes às instruções `LOAD DATA`, o **mysqlbinlog** extrai os arquivos dos eventos do log binário, escreve-os como arquivos temporários no sistema de arquivos local e escreve instruções `LOAD DATA LOCAL` para carregar os arquivos. Por padrão, o **mysqlbinlog** escreve esses arquivos temporários em um diretório específico do sistema operacional. A opção `--local-load` pode ser usada para especificar explicitamente o diretório onde o **mysqlbinlog** deve preparar arquivos temporários locais.

  Como outros processos podem escrever arquivos no diretório padrão específico do sistema, é aconselhável especificar a opção `--local-load` para o **mysqlbinlog** para designar um diretório diferente para os arquivos de dados, e, em seguida, designar o mesmo diretório especificando a opção `--load-data-local-dir` para o **mysql** ao processar a saída do **mysqlbinlog**. Por exemplo:

  ```
  mysqlbinlog --local-load=/my/local/data ...
      | mysql --load-data-local-dir=/my/local/data ...
  ```

  Importante

  Esses arquivos temporários não são removidos automaticamente pelo **mysqlbinlog** ou por qualquer outro programa do MySQL.

<table frame="box" rules="all" summary="Propriedades para saída base64"><tbody><tr><th>Formato de linha de comando</th> <td><code>--base64-output=valor</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>AUTO</code></td> </tr><tr><th>Valores válidos</th> <td><p><code>AUTO</code></p><p><code>NEVER</code></p><p><code>DECODE-ROWS</code></p></td> </tr></tbody></table>

Leia opções de entrada do caminho de login nomeado no arquivo de caminho de login `.mylogin.cnf`. Um “caminho de login” é um grupo de opções que contém opções que especificam para qual servidor MySQL se conectar e com qual conta se autenticar. Para criar ou modificar um arquivo de caminho de login, use o utilitário **mysql_config_editor**. Veja a Seção 6.6.7, “mysql_config_editor — Utilitário de Configuração MySQL”.

Para obter informações adicionais sobre esta e outras opções de arquivos de opções, veja a Seção 6.2.2.3, “Opções de linha de comando que afetam o manuseio de arquivos de opções”.

* `--no-caminhos-de-login`

Veja `--login-path` para informações relacionadas.

Para obter informações adicionais sobre esta e outras opções de arquivo de configuração, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivos de configuração”.

* `--no-defaults`

  <table frame="box" rules="all" summary="Propriedades para saída base64"><tbody><tr><th>Formato de linha de comando</th> <td><code>--base64-output=valor</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>AUTO</code></td> </tr><tr><th>Valores válidos</th> <td><p><code>AUTO</code></p><p><code>NEVER</code></p><p><code>DECODE-ROWS</code></p></td> </tr></tbody></table>

  Não leia nenhum arquivo de configuração. Se o início do programa falhar devido à leitura de opções desconhecidas de um arquivo de configuração, o `--no-defaults` pode ser usado para evitar que sejam lidas.

  A exceção é que o arquivo `.mylogin.cnf` é lido em todos os casos, se existir. Isso permite que as senhas sejam especificadas de uma maneira mais segura do que na linha de comando, mesmo quando o `--no-defaults` é usado. Para criar `.mylogin.cnf`, use o utilitário **mysql_config_editor**. Veja a Seção 6.6.7, “mysql_config_editor — Ferramenta de configuração do MySQL”.

  Para obter informações adicionais sobre esta e outras opções de arquivo de configuração, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivos de configuração”.

* `--offset=N`, `-o N`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato de linha de comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  Pular as primeiras *`N`* entradas no log.

* `--open-files-limit=N`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  Especifique o número de descritores de arquivo abertos a serem reservados.

* `--password[=password]`, `-p[password]`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  A senha da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecido, o **mysqlbinlog** solicitará uma senha. Se for fornecida, não deve haver **espaço** entre `--password=` ou `-p` e a senha que a segue. Se nenhuma opção de senha for especificada, o padrão é não enviar a senha.

  Especificar uma senha na linha de comando deve ser considerado inseguro. Para evitar fornecer a senha na linha de comando, use um arquivo de opções. Veja a Seção 8.1.2.1, “Diretrizes do Usuário Final para Segurança da Senha”.

  Para especificar explicitamente que não há senha e que o **mysqlbinlog** não deve solicitar uma, use a opção `--skip-password`.

* `--plugin-dir=dir_name`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  O diretório onde procurar por plugins. Especifique esta opção se a opção `--default-auth` for usada para especificar um plugin de autenticação, mas o **mysqlbinlog** não o encontrar. Veja a Seção 8.2.17, “Autenticação Extensível”.

* `--port=port_num`, `-P port_num`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tr><th>Formato de linha de comando</th> <td><code>--bind-address=ip_address</code></td> </tr></table>

  O número de porta TCP/IP a ser usado para se conectar a um servidor remoto.

* `--print-defaults`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tr><th>Formato de linha de comando</th> <td><code>--bind-address=ip_address</code></td> </tr></table>

  Imprima o nome do programa e todas as opções que ele obtém de arquivos de opções.

  Para obter informações adicionais sobre isso e outras opções de arquivos de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivos de opções”.

* `--print-table-metadata`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tr><th>Formato de linha de comando</th> <td><code>--bind-address=ip_address</code></td> </tr></table>

  Imprima metadados relacionados à tabela do log binário. Configure a quantidade de metadados binários relacionados à tabela registrados no log binário usando `binlog-row-metadata`.

* `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tr><th>Formato de linha de comando</th> <td><code>--bind-address=ip_address</code></td> </tr></table>

O protocolo de transporte a ser usado para se conectar ao servidor. É útil quando os outros parâmetros de conexão normalmente resultam no uso de um protocolo diferente do que você deseja. Para obter detalhes sobre os valores permitidos, consulte a Seção 6.2.7, “Protocolos de Transporte de Conexão”.

* `--raw`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  Por padrão, o **mysqlbinlog** lê arquivos de log binário e escreve eventos no formato de texto. A opção `--raw` indica ao **mysqlbinlog** que escreva-os em seu formato binário original. Seu uso requer que a opção `--read-from-remote-server` também seja usada, pois os arquivos são solicitados a partir de um servidor. O **mysqlbinlog** escreve um arquivo de saída para cada arquivo lido do servidor. A opção `--raw` pode ser usada para fazer um backup de um log binário de servidor. Com a opção `--stop-never`, o backup é “ativo” porque o **mysqlbinlog** permanece conectado ao servidor. Por padrão, os arquivos de saída são escritos no diretório atual com os mesmos nomes dos arquivos de log originais. Os nomes dos arquivos de saída podem ser modificados usando a opção `--result-file`. Para obter mais informações, consulte a Seção 6.6.9.3, “Usando o mysqlbinlog para fazer backup de arquivos de log binário”.

* `--read-from-remote-source=type`

Essa opção lê logs binários de um servidor MySQL com os comandos `COM_BINLOG_DUMP` ou `COM_BINLOG_DUMP_GTID`, definindo o valor da opção para `BINLOG-DUMP-NON-GTIDS` ou `BINLOG-DUMP-GTIDS`, respectivamente. Se `--read-from-remote-source=BINLOG-DUMP-GTIDS` for combinado com `--exclude-gtids`, as transações podem ser filtradas na fonte, evitando tráfego de rede desnecessário.

As opções de parâmetros de conexão são usadas com essas opções ou a opção `--read-from-remote-server`. Essas opções são `--host`, `--password`, `--port`, `--protocol`, `--socket` e `--user`. Se nenhuma das opções remotas for especificada, as opções de parâmetros de conexão são ignoradas.

O privilégio `REPLICATION SLAVE` é necessário para usar essas opções.

* `--read-from-remote-master=type`

  <table frame="box" rules="all" summary="Propriedades para binlog-row-event-max-size"><tbody><tr><th>Formato de linha de comando</th> <td><code>--binlog-row-event-max-size=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td><code>4294967040</code></td> </tr><tr><th>Valor mínimo</th> <td><code>256</code></td> </tr><tr><th>Valor máximo</th> <td><code>18446744073709547520</code></td> </tr></tbody></table>

Sinônimo desatualizado para `--read-from-remote-source`.

* `--read-from-remote-server=file_name`, `-R`

<table frame="box" rules="all" summary="Propriedades para binlog-row-event-max-size"><tbody><tr><th>Formato de linha de comando</th> <td><code>--binlog-row-event-max-size=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td><code>4294967040</code></td> </tr><tr><th>Valor mínimo</th> <td><code>256</code></td> </tr><tr><th>Valor máximo</th> <td><code>18446744073709547520</code></td> </tr></tbody></table>

Leia o log binário de um servidor MySQL em vez de ler um arquivo de log local. Esta opção exige que o servidor remoto esteja em execução. Funciona apenas para arquivos de log binário no servidor remoto e não para arquivos de log de retransmissão. Aceita o nome do arquivo de log binário (incluindo o sufixo numérico) sem o caminho do arquivo.

As opções dos parâmetros de conexão são usadas com esta opção ou com a opção `--read-from-remote-source`. Estas opções são `--host`, `--password`, `--port`, `--protocol`, `--socket` e `--user`. Se nenhuma das opções remotas for especificada, as opções dos parâmetros de conexão são ignoradas.

O privilégio `REPLICATION SLAVE` é necessário para usar esta opção.

Esta opção é como `--read-from-remote-source=BINLOG-DUMP-NON-GTIDS`.

* `--result-file=nome`, `-r nome`

<table frame="box" rules="all" summary="Propriedades para binlog-row-event-max-size">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code>--binlog-row-event-max-size=#</code></td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Numérico</td>
  </tr>
  <tr>
    <th>Valor padrão</th>
    <td><code>4294967040</code></td>
  </tr>
  <tr>
    <th>Valor mínimo</th>
    <td><code>256</code></td>
  </tr>
  <tr>
    <th>Valor máximo</th>
    <td><code>18446744073709547520</code></td>
  </tr>
  </tbody>
</table>

2

Sem a opção `--raw`, esta opção indica o arquivo para o qual o **mysqlbinlog** escreve a saída de texto. Com `--raw`, o **mysqlbinlog** escreve um arquivo de saída binário para cada arquivo de log transferido do servidor, escrevendo-os, por padrão, no diretório atual usando os mesmos nomes que o arquivo de log original. Neste caso, o valor da opção `--result-file` é tratado como um prefixo que modifica os nomes dos arquivos de saída.

* `--require-row-format`

Exija o formato de registro binário baseado em linhas para eventos. Esta opção obriga a eventos de replicação baseados em linhas para a saída do **mysqlbinlog**. O fluxo de eventos produzido com esta opção seria aceito por um canal de replicação que seja protegido usando a opção `REQUIRE_ROW_FORMAT` da declaração `CHANGE REPLICATION SOURCE TO`. `binlog_format=ROW` deve ser definido no servidor onde o log binário foi escrito. Quando você especifica esta opção, o **mysqlbinlog** pára com uma mensagem de erro se encontrar algum evento que seja desativado pelas restrições `REQUIRE_ROW_FORMAT`, incluindo instruções `LOAD DATA INFILE`, criação ou remoção de tabelas temporárias, eventos `INTVAR`, `RAND` ou `USER_VAR` e eventos não baseados em linhas dentro de uma transação DML. O **mysqlbinlog** também imprime uma declaração `SET @@session.require_row_format` no início de sua saída para aplicar as restrições quando a saída for executada e não imprime a declaração `SET @@session.pseudo_thread_id`.

* `--rewrite-db='from_name->to_name'`

  <table frame="box" rules="all" summary="Propriedades para binlog-row-event-max-size"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--binlog-row-event-max-size=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor Padrão</th> <td><code>4294967040</code></td> </tr><tr><th>Valor Mínima</th> <td><code>256</code></td> </tr><tr><th>Valor Máximo</th> <td><code>18446744073709547520</code></td> </tr></tbody></table>

  Ao ler de um log baseado em linhas ou baseado em instruções, reescreva todas as ocorrências de *`from_name`* para *`to_name`*. A reescrita é feita nas linhas, para logs baseados em linhas, bem como nas cláusulas `USE`, para logs baseados em instruções.

  Aviso

As declarações nas quais os nomes da tabela são qualificados com os nomes do banco de dados não são reescritas para usar o novo nome ao usar esta opção.

A regra de reescrita empregada como valor para esta opção é uma string na forma `'from_name->to_name'`, conforme mostrado anteriormente, e, por isso, deve ser colocada entre aspas.

Para empregar múltiplas regras de reescrita, especifique a opção várias vezes, como mostrado aqui:

```
  mysqlbinlog --rewrite-db='dbcurrent->dbold' --rewrite-db='dbtest->dbcurrent' \
      binlog.00001 > /tmp/statements.sql
  ```

Quando usada juntamente com a opção `--database`, a opção `--rewrite-db` é aplicada primeiro; então a opção `--database` é aplicada, usando o nome do banco de dados reescrito. A ordem em que as opções são fornecidas não faz diferença nesse aspecto.

Isso significa, por exemplo, que se **mysqlbinlog** for iniciado com `--rewrite-db='mydb->yourdb' --database=yourdb`, então todas as atualizações em quaisquer tabelas nos bancos de dados `mydb` e `yourdb` serão incluídas na saída. Por outro lado, se for iniciado com `--rewrite-db='mydb->yourdb' --database=mydb`, então **mysqlbinlog** não emite nenhuma declaração: como todas as atualizações em `mydb` são reescritas primeiro como atualizações em `yourdb` antes de aplicar a opção `--database`, não restam atualizações que correspondam a `--database=mydb`.

* `--server-id=id`

Exiba apenas os eventos criados pelo servidor com o ID do servidor fornecido.

* `--server-id-bits=N`

  <table frame="box" rules="all" summary="Propriedades para binlog-row-event-max-size"><tbody><tr><th>Formato de linha de comando</th> <td><code>--binlog-row-event-max-size=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td><code>4294967040</code></td> </tr><tr><th>Valor mínimo</th> <td><code>256</code></td> </tr><tr><th>Valor máximo</th> <td><code>18446744073709547520</code></td> </tr></tbody></table>

  Use apenas os primeiros *`N`* bits do `server_id` para identificar o servidor. Se o log binário foi escrito por um **mysqld** com server-id-bits configurados para menos de 32 e os dados do usuário armazenados no bit mais significativo, executar **mysqlbinlog** com `--server-id-bits` configurado para 32 permite que esses dados sejam vistos.

  Esta opção é suportada apenas pela versão do **mysqlbinlog** fornecida com a distribuição NDB Cluster ou construída com suporte ao NDB Cluster.

* `--server-public-key-path=caminho_do_arquivo_nome`

  <table frame="box" rules="all" summary="Propriedades para binlog-row-event-max-size"><tbody><tr><th>Formato de linha de comando</th> <td><code>--binlog-row-event-max-size=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td><code>4294967040</code></td> </tr><tr><th>Valor mínimo</th> <td><code>256</code></td> </tr><tr><th>Valor máximo</th> <td><code>18446744073709547520</code></td> </tr></tbody></table>

O nome do caminho de um arquivo no formato PEM que contém uma cópia do lado do cliente da chave pública necessária pelo servidor para a troca de senhas baseada em pares de chaves RSA. Esta opção aplica-se a clientes que autenticam-se com o plugin de autenticação `sha256_password` ou `caching_sha2_password`. Esta opção é ignorada para contas que não autenticam-se com um desses plugins. Também é ignorada se a troca de senha baseada em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele tem precedência sobre `--get-server-public-key`.

Para `sha256_password`, esta opção só se aplica se o MySQL foi compilado usando OpenSSL.

Para informações sobre os plugins `sha256_password` e `caching_sha2_password`, consulte a Seção 8.4.1.2, “Autenticação Personalizável SHA-256”, e a Seção 8.4.1.1, “Autenticação Personalizável SHA-2”.

* `--set-charset=charset_name`

<table frame="box" rules="all" summary="Propriedades para binlog-row-event-max-size"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--binlog-row-event-max-size=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor Padrão</th> <td><code>4294967040</code></td> </tr><tr><th>Valor Mínima</th> <td><code>256</code></td> </tr><tr><th>Valor Máximo</th> <td><code>18446744073709547520</code></td> </tr></tbody></table>

Adicione uma declaração `SET NAMES charset_name` à saída para especificar o conjunto de caracteres a ser usado para processar arquivos de log.

* `--shared-memory-base-name=name`

<table frame="box" rules="all" summary="Propriedades para binlog-row-event-max-size">
  <tr><th>Formato de Linha de Comando</th> <td><code>--binlog-row-event-max-size=#</code></td> </tr>
  <tr><th>Tipo</th> <td>Numérico</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>4294967040</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>256</code></td> </tr>
  <tr><th>Valor Máximo</th> <td><code>18446744073709547520</code></td> </tr>
</table>

  Em Windows, o nome de memória compartilhada a ser usado para conexões feitas usando memória compartilhada a um servidor local. O valor padrão é `MYSQL`. O nome de memória compartilhada é sensível a maiúsculas e minúsculas.

  Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `shared_memory` habilitada para suportar conexões de memória compartilhada.

* `--short-form`, `-s`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir">
    <tr><th>Formato de Linha de Comando</th> <td><code>--character-sets-dir=dir_name</code></td> </tr>
    <tr><th>Tipo</th> <td>Nome de diretório</td> </tr>
  </table>

  Exibir apenas as declarações contidas no log, sem nenhuma informação extra ou eventos baseados em linhas. Isso é apenas para testes e não deve ser usado em sistemas de produção. É desatualizado e você deve esperar que ele seja removido em uma futura versão.

* `--skip-gtids[=(true|false)]`

Não inclua os GTIDs dos arquivos de log binário no arquivo de dump de saída. Por exemplo:

  ```
  mysqlbinlog --skip-gtids binlog.000001 >  /tmp/dump.sql
  mysql -u root -p -e "source /tmp/dump.sql"
  ```

  Normalmente, você não deve usar essa opção em produção ou na recuperação, exceto nos cenários específicos e raros em que os GTIDs são indesejados ativamente. Por exemplo, um administrador pode querer duplicar transações selecionadas (como definições de tabelas) de uma implantação para outra, não relacionada, que não será replicada para ou a partir do original. Nesse cenário, `--skip-gtids` pode ser usado para permitir que o administrador aplique as transações como se fossem novas e garanta que as implantações permaneçam não relacionadas. No entanto, você deve usar essa opção apenas se a inclusão dos GTIDs causar um problema conhecido para o seu caso de uso.

* `--socket=caminho`, `-S caminho`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td><code>--character-sets-dir=caminho_nome</code></td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>

  Para conexões com `localhost`, o arquivo de socket Unix a ser usado ou, no Windows, o nome do pipe nomeado a ser usado.

  No Windows, essa opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões por pipe nomeado. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.

* `--ssl*`

  Opções que começam com `--ssl` especificam se conectar ao servidor usando criptografia e indicam onde encontrar as chaves e certificados SSL. Veja Opções de Comando para Conexões Criptografadas.

* `--ssl-fips-mode={OFF|ON|STRICT}`

<table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>

  Controla se o modo FIPS deve ser habilitado no lado do cliente. A opção `--ssl-fips-mode` difere de outras opções `--ssl-xxx` porque não é usada para estabelecer conexões criptografadas, mas sim para afetar quais operações criptográficas devem ser permitidas. Veja a Seção 8.8, “Suporte FIPS”.

  Estes valores de `--ssl-fips-mode` são permitidos:

  + `OFF`: Desabilitar o modo FIPS.
  + `ON`: Habilitar o modo FIPS.
  + `STRICT`: Habilitar o modo FIPS “estricto”.

  Observação

  Se o Módulo de Objeto FIPS do OpenSSL não estiver disponível, o único valor permitido para `--ssl-fips-mode` é `OFF`. Nesse caso, definir `--ssl-fips-mode` para `ON` ou `STRICT` faz com que o cliente produza uma mensagem de aviso no início e opere no modo não FIPS.

  Esta opção está desatualizada. Espera-se que seja removida em uma versão futura do MySQL.

* `--start-datetime=datetime`

Esta opção é útil para a recuperação em um ponto no tempo. Veja a Seção 9.5, “Recuperação em Ponto no Tempo (Incremental) Recovery”).

* `--start-position=N`, `-j N`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>

  Comece a decodificar o log binário na posição de log *`N`*, incluindo na saída quaisquer eventos que comecem na posição *`N`* ou depois. A posição é um ponto de byte no arquivo de log, não um contador de eventos; ela precisa apontar para a posição inicial de um evento para gerar uma saída útil. Esta opção se aplica ao primeiro arquivo de log nomeado na linha de comando.

  O valor máximo suportado para esta opção é 18446744073709551616 (264-1), a menos que `--read-from-remote-server` ou `--read-from-remote-source` também esteja sendo usado, no qual caso o máximo é 4294967295.

  Esta opção é útil para a recuperação em um ponto no tempo. Veja a Seção 9.5, “Recuperação em Ponto no Tempo (Incremental) Recovery”).

* `--stop-datetime=datetime`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>

  Pare de ler o log binário no primeiro evento com um timestamp igual ou posterior ao argumento *`datetime`*. Veja a descrição da opção `--start-datetime` para informações sobre o valor de *`datetime`*.

Esta opção é útil para a recuperação em um ponto específico. Veja a Seção 9.5, “Recuperação em Ponto Específico (Incremental)” (Recuperação”).

* `--stop-never`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>

  Esta opção é usada com `--read-from-remote-server`. Ela indica que o **mysqlbinlog** deve permanecer conectado ao servidor. Caso contrário, o **mysqlbinlog** encerra quando o último arquivo de log tiver sido transferido do servidor. `--stop-never` implica em `--to-last-log`, então apenas o primeiro arquivo de log a ser transferido precisa ser nomeado na linha de comando.

  `--stop-never` é comumente usado com `--raw` para fazer uma cópia de segurança de log binário ao vivo, mas também pode ser usado sem `--raw` para manter uma exibição de texto contínua dos eventos de log conforme o servidor os gera.

  Com `--stop-never`, por padrão, o **mysqlbinlog** relata um ID de servidor de 1 quando se conecta ao servidor. Use `--connection-server-id` para especificar explicitamente um ID alternativo a ser relatado. Ele pode ser usado para evitar um conflito com o ID de um servidor replica ou outro processo **mysqlbinlog**. Veja a Seção 6.6.9.4, “Especificando o ID do Servidor mysqlbinlog”.

* `--stop-never-slave-server-id=id`

Esta opção está desatualizada; espere-se que seja removida em uma futura versão. Use a opção `--connection-server-id` em vez disso para especificar um ID de servidor para o **mysqlbinlog** para relatar.

* `--stop-position=N`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>

  Pare de decodificar o log binário na posição de log *`N`*, excluindo da saída quaisquer eventos que comecem na posição *`N`* ou após. A posição é um ponto de byte no arquivo de log, não um contador de eventos; ela precisa apontar para um local após a posição inicial do último evento que você deseja incluir na saída. O evento que começa antes da posição *`N`* e termina na ou após a posição é o último evento a ser processado. Esta opção se aplica ao último arquivo de log nomeado na linha de comando.

  Esta opção é útil para a recuperação em um ponto no tempo. Veja a Seção 9.5, “Recuperação em Ponto no Tempo (Incremental)” (Recuperação").

* `--tls-ciphersuites=ciphersuite_list`

  <table frame="box" rules="all" summary="Propriedades para compress"><tbody><tr><th>Formato de linha de comando</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

As sequências de cifra permitidas para conexões criptografadas que utilizam TLSv1.3. O valor é uma lista de um ou mais nomes de sequências de cifra separados por vírgula. As sequências de cifra que podem ser nomeadas para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para detalhes, consulte a Seção 8.3.2, “Protocolos e cifra TLS de Conexão Encriptada”.

* `--tls-sni-servername=server_name`

  <table frame="box" rules="all" summary="Propriedades para compressão">
    <tr>
      <th>Formato de linha de comando</th> <td><code>--compress[={OFF|ON}]</code></td>
    </tr>
    <tr>
      <th>Desatualizado</th> <td>Sim</td>
    </tr>
    <tr>
      <th>Tipo</th> <td>Booleano</td>
    </tr>
    <tr>
      <th>Valor padrão</th> <td><code>OFF</code></td>
    </tr>
  </tbody>
  </table>

  Quando especificado, o nome é passado para a biblioteca de API C `libmysqlclient` usando a opção `MYSQL_OPT_TLS_SNI_SERVERNAME` de `mysql_options()`. O nome do servidor não é case-sensitive. Para mostrar qual nome do servidor o cliente especificou para a sessão atual, se houver, verifique a variável `Tls_sni_server_name`.

  A Indicação de Nome do Servidor (SNI) é uma extensão do protocolo TLS (o OpenSSL deve ser compilado com extensões TLS para que esta opção funcione). A implementação do MySQL do SNI representa apenas o lado do cliente.

* `--tls-version=protocol_list`

  <table frame="box" rules="all" summary="Propriedades para compressão">
    <tr>
      <th>Formato de linha de comando</th> <td><code>--compress[={OFF|ON}]</code></td>
    </tr>
    <tr>
      <th>Desatualizado</th> <td>Sim</td>
    </tr>
    <tr>
      <th>Tipo</th> <td>Booleano</td>
    </tr>
    <tr>
      <th>Valor padrão</th> <td><code>OFF</code></td>
    </tr>
  </tbody>
  </table>

Os protocolos TLS permitidos para conexões criptografadas. O valor é uma lista de um ou mais nomes de protocolos separados por vírgula. Os protocolos que podem ser nomeados para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para detalhes, consulte a Seção 8.3.2, “Protocolos e cifra TLS de conexão criptografada”.

* `--to-last-log`, `-t`

  <table frame="box" rules="all" summary="Propriedades para compressão"><tbody><tr><th>Formato de linha de comando</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Não pare no final do log binário solicitado de um servidor MySQL, mas sim continue imprimindo até o final do último log binário. Se você enviar a saída para o mesmo servidor MySQL, isso pode levar a um loop infinito. Esta opção requer `--read-from-remote-server`.

* `--user=user_name`, `-u user_name`

  <table frame="box" rules="all" summary="Propriedades para compressão"><tbody><tr><th>Formato de linha de comando</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  O nome de usuário da conta MySQL a ser usado ao se conectar a um servidor remoto.

  Se você estiver usando o plugin `Rewriter`, você deve conceder a este usuário o privilégio `SKIP_QUERY_REWRITE`.

* `--verbose`, `-v`

<table frame="box" rules="all" summary="Propriedades para compressão"><tbody><tr><th>Formato de linha de comando</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Reconstrua eventos de linha e exiba-os como instruções SQL comentadas, com informações de partição da tabela, quando aplicável. Se esta opção for fornecida duas vezes (através da passagem de "-vv" ou "--verbose --verbose"), a saída inclui comentários para indicar os tipos de dados das colunas e alguns metadados, e eventos de log informativos, como eventos de log de consulta de linhas do `binlog_rows_query_log_events`, se a variável de sistema `binlog_rows_query_log_events` estiver definida como `TRUE`.

  Para exemplos que mostram o efeito de `--base64-output` e `--verbose` na saída de eventos de linha, consulte a Seção 6.6.9.2, “Exibição de Eventos de Linha do mysqlbinlog”.

* `--verify-binlog-checksum`, `-c`

<table frame="box" rules="all" summary="Propriedades para compressão"><tbody><tr><th>Formato de linha de comando</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Verifique os checksums em arquivos de log binário.

* `--version`, `-V`

<table frame="box" rules="all" summary="Propriedades para compressão"><tbody><tr><th>Formato de linha de comando</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Exibir informações de versão e sair.

* `--zstd-compression-level=level`

  <table frame="box" rules="all" summary="Propriedades para compressão"><tbody><tr><th>Formato de linha de comando</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  O nível de compressão a ser usado para conexões com o servidor que utilizam o algoritmo de compressão `zstd`. Os níveis permitidos são de 1 a 22, com valores maiores indicando níveis crescentes de compressão. O nível de compressão padrão do `zstd` é 3. O ajuste do nível de compressão não tem efeito em conexões que não utilizam compressão `zstd`.

  Para mais informações, consulte a Seção 6.2.8, “Controle de compressão de conexão”.

Você pode canalizar a saída do **mysqlbinlog** para o cliente **mysql** para executar os eventos contidos no log binário. Essa técnica é usada para recuperar de uma saída inesperada quando você tem um backup antigo (consulte a Seção 9.5, “Recuperação ponto no tempo (incremental”)”). Por exemplo:

```
  mysqlbinlog --start-datetime="2005-12-25 11:25:56" binlog.000003
  ```

Ou:

```
mysqlbinlog binlog.000001 | mysql -u root -p
```

Se as declarações geradas pelo **mysqlbinlog** podem conter valores `BLOB`, esses podem causar problemas quando o **mysql** os processa. Nesse caso, invocando o **mysql** com a opção `--binary-mode`.

Você também pode redirecionar a saída do **mysqlbinlog** para um arquivo de texto, se precisar modificar o log da declaração primeiro (por exemplo, para remover declarações que você não deseja executar por algum motivo). Após editar o arquivo, execute as declarações que ele contém usando-o como entrada para o programa **mysql**:

```
mysqlbinlog binlog.[0-9]* | mysql -u root -p
```

Quando o **mysqlbinlog** é invocado com a opção `--start-position`, ele exibe apenas aqueles eventos com um deslocamento no log binário maior ou igual a uma posição dada (a posição dada deve corresponder ao início de um evento). Ele também tem opções para parar e começar quando vê um evento com uma data e hora dadas. Isso permite que você realize a recuperação em um ponto no tempo usando a opção `--stop-datetime` (para poder dizer, por exemplo, “avançar minhas bases de dados para como estavam hoje às 10h30”).

**Processamento de vários arquivos.** Se você tiver mais de um log binário a ser executado no servidor MySQL, o método seguro é processá-los todos usando uma única conexão com o servidor. Aqui está um exemplo que demonstra o que pode ser *inseguro*:

```
mysqlbinlog binlog.000001 > tmpfile
... edit tmpfile ...
mysql -u root -p < tmpfile
```

Processar logs binários dessa maneira usando várias conexões com o servidor causa problemas se o primeiro arquivo de log contiver uma declaração `CREATE TEMPORARY TABLE` e o segundo log contiver uma declaração que usa a tabela temporária. Quando o primeiro processo do **mysql** termina, o servidor elimina a tabela temporária. Quando o segundo processo do **mysql** tenta usar a tabela, o servidor relata “tabela desconhecida”.

Para evitar problemas como esse, use um único processo **mysql** para executar o conteúdo de todos os logs binários que você deseja processar. Aqui está uma maneira de fazer isso:

```
mysqlbinlog binlog.000001 | mysql -u root -p # DANGER!!
mysqlbinlog binlog.000002 | mysql -u root -p # DANGER!!
```

Outra abordagem é escrever todos os logs em um único arquivo e, em seguida, processar o arquivo:

```
mysqlbinlog binlog.000001 binlog.000002 | mysql -u root -p
```

Você também pode fornecer vários arquivos de log binário ao **mysqlbinlog** como entrada em fluxo usando um tubo de shell. Um arquivo de log binário compactado pode ser descompactado e fornecido diretamente ao **mysqlbinlog**. Neste exemplo, `binlog-files_1.gz` contém vários arquivos de log binário para processamento. O pipeline extrai o conteúdo de `binlog-files_1.gz`, envia os arquivos de log binário ao **mysqlbinlog** como entrada padrão e envia a saída do **mysqlbinlog** para o cliente **mysql** para execução:

```
mysqlbinlog binlog.000001 >  /tmp/statements.sql
mysqlbinlog binlog.000002 >> /tmp/statements.sql
mysql -u root -p -e "source /tmp/statements.sql"
```

Você pode especificar mais de um arquivo de arquivo, por exemplo:

```
gzip -cd binlog-files_1.gz | ./mysqlbinlog - | ./mysql -uroot  -p
```

Para entrada em fluxo, não use `--stop-position`, porque o **mysqlbinlog** não pode identificar o último arquivo de log para aplicar essa opção.

**Operações de **LOAD DATA**. O **mysqlbinlog** pode produzir saída que reproduz uma operação `LOAD DATA` sem o arquivo de dados original. O **mysqlbinlog** copia os dados para um arquivo temporário e escreve uma declaração `LOAD DATA LOCAL` que se refere ao arquivo. A localização padrão do diretório onde esses arquivos são escritos é específica do sistema. Para especificar um diretório explicitamente, use a opção `--local-load`.

Como o **mysqlbinlog** converte as declarações `LOAD DATA` em declarações `LOAD DATA LOCAL` (ou seja, adiciona `LOCAL`), tanto o cliente quanto o servidor que você usa para processar as declarações devem ser configurados com a capacidade `LOCAL` habilitada. Veja a Seção 8.1.6, “Considerações de segurança para LOAD DATA LOCAL”.

Aviso

Os arquivos temporários criados para as instruções `LOAD DATA LOCAL` *não são* excluídos automaticamente, pois são necessários até que você execute essas instruções. Você deve excluir os arquivos temporários manualmente depois de não precisar mais do log da instrução. Os arquivos podem ser encontrados no diretório de arquivos temporários e têm nomes como *`original_file_name-#-#`*.