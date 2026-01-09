#### 16.1.6.4 Opções e variáveis de registro binário

- Opções de inicialização usadas com registro binário
- Variáveis do sistema usadas com registro binário

Você pode usar as opções do **mysqld** e as variáveis de sistema descritas nesta seção para afetar o funcionamento do log binário, bem como para controlar quais instruções são escritas no log binário. Para obter informações adicionais sobre o log binário, consulte Seção 5.4.4, “O Log Binário”. Para obter informações adicionais sobre o uso das opções e variáveis de sistema do servidor MySQL, consulte Seção 5.1.6, “Opções de Comando do Servidor” e Seção 5.1.7, “Variáveis de Sistema do Servidor”.

##### Opções de inicialização usadas com registro binário

A lista a seguir descreve as opções de inicialização para habilitar e configurar o log binário. As variáveis de sistema usadas com o registro binário são discutidas mais adiante nesta seção.

- `--binlog-row-event-max-size=N`

  <table frame="box" rules="all" summary="Propriedades para binlog-row-event-max-size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--binlog-row-event-max-size=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>8192</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>256</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td>[[<code>18446744073709551615</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td>[[<code>4294967295</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></tbody></table>

  Especifique o tamanho máximo de um evento de registro binário baseado em linha, em bytes. As linhas são agrupadas em eventos menores que esse tamanho, se possível. O valor deve ser um múltiplo de 256. O valor padrão é 8192. Consulte Seção 16.2.1, “Formatos de Replicação”.

- `--log-bin[=nome_base]`

  <table frame="box" rules="all" summary="Propriedades para log-bin"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--log-bin=file_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  Habilita o registro binário. Com o registro binário habilitado, o servidor registra todas as declarações que alteram dados no log binário, que é usado para backup e replicação. O log binário é uma sequência de arquivos com um nome de base e extensão numérica. Para obter informações sobre o formato e a gestão do log binário, consulte Seção 5.4.4, “O Log Binário”.

  Se você fornecer um valor para a opção `--log-bin`, o valor é usado como o nome base para a sequência de log. O servidor cria arquivos de log binários em sequência, adicionando um sufixo numérico ao nome base. No MySQL 5.7, o nome base é definido como `host_name-bin`, usando o nome da máquina do host. Recomenda-se que você especifique um nome base, para que você possa continuar a usar os mesmos nomes de arquivos de log binários, independentemente das alterações no nome padrão.

  O local padrão para os arquivos de log binário é o diretório de dados. Você pode usar a opção `--log-bin` para especificar um local alternativo, adicionando um nome de caminho absoluto antes do nome da base para especificar um diretório diferente. Quando o servidor lê uma entrada do arquivo de índice de log binário, que rastreia os arquivos de log binário que foram usados, ele verifica se a entrada contém um caminho relativo. Se estiver presente, a parte relativa do caminho é substituída pelo caminho absoluto definido usando a opção `--log-bin`. Um caminho absoluto registrado no arquivo de índice de log binário permanece inalterado; nesse caso, o arquivo de índice deve ser editado manualmente para permitir que um novo caminho ou caminhos sejam usados. (Em versões mais antigas do MySQL, era necessária intervenção manual sempre que se movia os arquivos de log binário ou de log de retransmissão.) (Bug #11745230, Bug #12133)

  Definir essa opção faz com que a variável de sistema `log_bin` seja definida como `ON` (ou `1`), e não pelo nome base. O nome de base do arquivo de log binário e qualquer caminho especificado estão disponíveis como a variável de sistema `log_bin_basename`.

  Se você especificar a opção `--log-bin` sem também especificar a variável de sistema `server_id`, o servidor não será permitido iniciar. (Bug #11763963, Bug #56739)

  Quando os GTIDs estão em uso no servidor, se o registro binário não estiver habilitado ao reiniciar o servidor após uma parada anormal, é provável que alguns GTIDs sejam perdidos, causando o fracasso da replicação. Em uma parada normal, o conjunto de GTIDs do arquivo de log binário atual é salvo na tabela `mysql.gtid_executed`. Após uma parada anormal em que isso não aconteceu, durante a recuperação, os GTIDs são adicionados à tabela a partir do arquivo de log binário, desde que o registro binário ainda esteja habilitado. Se o registro binário for desabilitado para o reinício do servidor, o servidor não poderá acessar o arquivo de log binário para recuperar os GTIDs, então a replicação não poderá ser iniciada. O registro binário pode ser desabilitado com segurança após uma parada normal.

  Se você deseja desabilitar o registro binário para o início de um servidor, mas manter a configuração `--log-bin` intacta, você pode especificar a opção `--skip-log-bin` ou `--disable-log-bin` no momento do início. Especifique a opção após a opção `--log-bin`, para que ela tenha precedência. Quando o registro binário é desativado, a variável de sistema `log_bin` (replication-options-binary-log.html#sysvar\_log\_bin) é definida como OFF.

- `--log-bin-index[=nome_do_arquivo]`

  <table frame="box" rules="all" summary="Propriedades para log-bin-index"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--log-bin-index=file_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="replication-options-binary-log.html#sysvar_log_bin_index">log_bin_index</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  O nome do arquivo de índice do log binário, que contém os nomes dos arquivos de log binário. Por padrão, ele tem a mesma localização e nome de base que o valor especificado para os arquivos de log binário usando a opção `--log-bin`, mais a extensão `.index`. Se você não especificar `--log-bin`, o nome padrão do arquivo de índice do log binário é `binlog.index`. Se você omitir o nome do arquivo e não especificar um com `--log-bin`, o nome padrão do arquivo de índice do log binário é `host_name-bin.index`, usando o nome da máquina do host.

  Para obter informações sobre o formato e a gestão do log binário, consulte Seção 5.4.4, “O Log Binário”.

**Opções de seleção de declarações.** As opções na lista a seguir afetam quais declarações são escritas no log binário e, portanto, enviadas por um servidor de origem de replicação para suas réplicas. Há também opções para servidores de réplica que controlam quais declarações recebidas da fonte devem ser executadas ou ignoradas. Para obter detalhes, consulte Seção 16.1.6.3, “Opções e variáveis do servidor de réplica”.

- [`--binlog-do-db=db_name`](https://replication-options-binary-log.html#option_mysqld_binlog-do-db)

  <table frame="box" rules="all" summary="Propriedades para binlog-do-db"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--binlog-do-db=name</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Esta opção afeta o registro binário de maneira semelhante à forma como `--replicate-do-db` afeta a replicação.

  Os efeitos desta opção dependem se o formato de registro baseado em declarações ou baseado em linhas está em uso, da mesma forma que os efeitos de `--replicate-do-db` dependem se a replicação baseada em declarações ou baseada em linhas está em uso. Você deve ter em mente que o formato usado para registrar uma determinada declaração pode não ser necessariamente o mesmo indicado pelo valor de `binlog_format`. Por exemplo, declarações de DDL como `CREATE TABLE` e `ALTER TABLE` são sempre registradas como declarações, independentemente do formato de registro em vigor, portanto, as seguintes regras de registro baseadas em declarações para `--binlog-do-db` sempre se aplicam para determinar se a declaração é registrada ou

  **Registro baseado em declarações.** Apenas aquelas declarações são escritas no log binário onde o banco de dados padrão (ou seja, aquele selecionado por `USE`) é *`db_name`*. Para especificar mais de um banco de dados, use esta opção várias vezes, uma vez para cada banco de dados; no entanto, isso *não* causa o registro de declarações entre bancos, como `UPDATE some_db.some_table SET foo='bar'` enquanto um banco de dados diferente (ou nenhum banco de dados) está selecionado.

  Aviso

  Para especificar múltiplas bases de dados, você *deve* usar múltiplas instâncias desta opção. Como os nomes de banco de dados podem conter vírgulas, a lista é tratada como o nome de uma única base de dados se você fornecer uma lista separada por vírgula.

  Um exemplo do que não funciona conforme o esperado ao usar o registro baseado em instruções: Se o servidor for iniciado com [`--binlog-do-db=sales`](https://pt.wikipedia.org/wiki/Op%C3%A9rnia_mysqld_binlog-do-db) e você emitir as seguintes instruções, a instrução [`UPDATE`](https://pt.wikipedia.org/wiki/Instru%C3%A7%C3%A3o_mysqld_update) *não* será registrada:

  ```sql
  USE prices;
  UPDATE sales.january SET amount=amount+1000;
  ```

  A principal razão para esse comportamento de "apenas verifique o banco de dados padrão" é que, a partir da declaração sozinha, é difícil saber se ele deve ser replicado (por exemplo, se você está usando várias declarações de `DELETE` (delete.html) ou várias declarações de `UPDATE` (update.html) que atuam em vários bancos de dados). Também é mais rápido verificar apenas o banco de dados padrão em vez de todos os bancos de dados, se não houver necessidade.

  Outro caso que pode não ser óbvio ocorre quando um banco de dados específico é replicado, mesmo que isso não tenha sido especificado ao definir a opção. Se o servidor for iniciado com `--binlog-do-db=sales`, a seguinte instrução `UPDATE` será registrada, mesmo que `prices` não tenha sido incluído ao definir `--binlog-do-db`:

  ```sql
  USE sales;
  UPDATE prices.discounts SET percentage = percentage + 10;
  ```

  Como `sales` é o banco de dados padrão quando a instrução `UPDATE` é emitida, a instrução `UPDATE` é registrada.

  **Registro baseado em linhas.** O registro é restrito ao banco de dados *`db_name`*. Apenas as alterações nas tabelas pertencentes a *`db_name`* são registradas; o banco de dados padrão não tem efeito sobre isso. Suponha que o servidor seja iniciado com [`--binlog-do-db=sales`](https://pt.wikipedia.org/wiki/Replicação_de_bin%C3%A1rio#Op%C3%A7%C3%A3o_mysqld_binlog-do-db) e o registro baseado em linhas estiver em vigor, e então as seguintes instruções forem executadas:

  ```sql
  USE prices;
  UPDATE sales.february SET amount=amount+100;
  ```

  As alterações na tabela `february` no banco de dados `sales` são registradas de acordo com a instrução `UPDATE`; isso ocorre independentemente de a instrução `USE` ter sido emitida ou não. No entanto, ao usar o formato de registro baseado em linhas e `--binlog-do-db=sales`, as alterações feitas pelas seguintes instruções `UPDATE` não são registradas:

  ```sql
  USE prices;
  UPDATE prices.march SET amount=amount-25;
  ```

  Mesmo que a declaração `USE prices` fosse alterada para `USE sales`, os efeitos da declaração `UPDATE` ainda não seriam escritos no log binário.

  Outra diferença importante no tratamento da log de declarações (`--binlog-do-db` em inglês) em relação à log de linhas, em vez da log de linhas, ocorre em relação às declarações que se referem a múltiplas bases de dados. Suponha que o servidor seja iniciado com `--binlog-do-db=db1` (replicação-opções-log-binário.html#opção\_mysqld\_binlog-do-db), e as seguintes declarações sejam executadas:

  ```sql
  USE db1;
  UPDATE db1.table1, db2.table2 SET db1.table1.col1 = 10, db2.table2.col2 = 20;
  ```

  Se você estiver usando o registro baseado em declarações, as atualizações em ambas as tabelas serão escritas no log binário. No entanto, ao usar o formato baseado em linhas, apenas as alterações em `table1` serão registradas; `table2` está em um banco de dados diferente, então não será alterado pela `UPDATE`. Agora, suponha que, em vez da declaração `USE db1`, tivesse sido usada a declaração `USE db4`:

  ```sql
  USE db4;
  UPDATE db1.table1, db2.table2 SET db1.table1.col1 = 10, db2.table2.col2 = 20;
  ```

  Neste caso, a instrução `UPDATE` não é escrita no log binário ao usar o registro baseado em instruções. No entanto, ao usar o registro baseado em linhas, a alteração em `table1` é registrada, mas não em `table2`—ou seja, apenas as alterações em tabelas no banco de dados nomeado por `--binlog-do-db` são registradas, e a escolha do banco de dados padrão não afeta esse comportamento.

- [`--binlog-ignore-db=db_name`](https://replication-options-binary-log.html#option_mysqld_binlog-ignore-db)

  <table frame="box" rules="all" summary="Propriedades para binlog-ignore-db"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--binlog-ignore-db=name</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Esta opção afeta o registro binário de maneira semelhante à forma como `--replicate-ignore-db` afeta a replicação.

  Os efeitos desta opção dependem se o formato de registro baseado em declarações ou baseado em linhas está em uso, da mesma forma que os efeitos de `--replicate-ignore-db` dependem se a replicação baseada em declarações ou baseada em linhas está em uso. Você deve ter em mente que o formato usado para registrar uma determinada declaração pode não ser necessariamente o mesmo indicado pelo valor de `binlog_format`. Por exemplo, declarações de DDL como `CREATE TABLE` e `ALTER TABLE` são sempre registradas como declarações, independentemente do formato de registro em vigor, portanto, as seguintes regras de registro baseadas em declarações para `--binlog-ignore-db` sempre se aplicam para determinar se a declaração é registrada ou

  **Registro baseado em declarações.** Instrui o servidor a não registrar nenhuma declaração onde o banco de dados padrão (ou seja, o selecionado por `USE`) é *`db_name`*.

  Antes do MySQL 5.7.2, essa opção fazia com que quaisquer instruções que contendessem nomes de tabelas totalmente qualificados não fossem registradas se não houvesse um banco de dados padrão especificado (ou seja, quando `SELECT` `DATABASE()` retornasse `NULL`). No MySQL 5.7.2 e versões posteriores, quando não há um banco de dados padrão, as opções `--binlog-ignore-db` não são aplicadas e essas instruções são sempre registradas. (Bug #11829838, Bug
  \#60188)

  **Formato baseado em linhas.** Diz ao servidor para não registrar atualizações em nenhuma tabela no banco de dados *`db_name`*. O banco de dados atual não tem efeito.

  Ao usar o registro baseado em declarações, o seguinte exemplo não funciona conforme o esperado. Suponha que o servidor seja iniciado com [`--binlog-ignore-db=sales`](https://pt.wikipedia.org/wiki/Op%C3%A9rnia_mysqld_binlog-ignore-db) e você execute as seguintes declarações:

  ```sql
  USE prices;
  UPDATE sales.january SET amount=amount+1000;
  ```

  A declaração `UPDATE` *é* registrada nesse caso, porque `--binlog-ignore-db` se aplica apenas ao banco de dados padrão (determinado pela declaração `USE`). Como o banco de dados `sales` foi especificado explicitamente na declaração, a declaração não foi filtrada. No entanto, ao usar o registro baseado em linhas, os efeitos da declaração `UPDATE` *não* são escritos no log binário, o que significa que nenhuma alteração na tabela `sales.january` é registrada; nesse caso, `--binlog-ignore-db=sales` faz com que *todas* as alterações feitas nas tabelas na cópia do `sales` do banco de dados de origem sejam ignoradas para fins de registro binário.

  Para especificar mais de um banco de dados a ser ignorado, use essa opção várias vezes, uma vez para cada banco de dados. Como os nomes dos bancos de dados podem conter vírgulas, a lista é tratada como o nome de um único banco de dados se você fornecer uma lista separada por vírgula.

  Você não deve usar essa opção se estiver usando atualizações entre bancos de dados e não quiser que essas atualizações sejam registradas.

**Opções de verificação de checksum.** O MySQL suporta a leitura e a escrita de verificações de checksums de log binário. Essas opções são ativadas usando as duas opções listadas aqui:

- `--binlog-checksum={NONE|CRC32}`

  <table frame="box" rules="all" summary="Propriedades para binlog-checksum"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--binlog-checksum=type</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code>CRC32</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>NONE</code>]]</p><p class="valid-value">[[<code>CRC32</code>]]</p></td> </tr></tbody></table>

  Ativação desta opção faz com que a fonte escreva verificações de integridade para eventos escritos no log binário. Defina para `NONE` para desativar ou o nome do algoritmo a ser usado para gerar verificações de integridade; atualmente, apenas verificações de integridade CRC32 são suportadas, e CRC32 é o padrão. Você não pode alterar a configuração desta opção dentro de uma transação.

Para controlar a leitura dos checksums pela replica (do log do relé), use a opção [`--slave-sql-verify-checksum`](https://pt.wikipedia.org/wiki/Op%C3%A9rnia_\(inform%C3%A1tica\)#%C3%8Dndice_de_refer%C3%AAncia:replication-options-replica.html#option_mysqld_slave-sql-verify-checksum).

**Opções de teste e depuração.** As seguintes opções de log binário são usadas no teste e depuração da replicação. Elas não são destinadas ao uso em operações normais.

- `--max-binlog-dump-events=N`

  <table frame="box" rules="all" summary="Propriedades para max-binlog-dump-events"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--max-binlog-dump-events=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>0</code>]]</td> </tr></tbody></table>

  Esta opção é usada internamente pelo conjunto de testes do MySQL para testes de replicação e depuração.

- [`--sporadic-binlog-dump-fail`](https://replication-options-binary-log.html#option_mysqld_sporadic-binlog-dump-fail)

  <table frame="box" rules="all" summary="Propriedades para sporadic-binlog-dump-fail"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--sporadic-binlog-dump-fail[={OFF|ON}]</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

  Esta opção é usada internamente pelo conjunto de testes do MySQL para testes de replicação e depuração.

##### Variáveis do sistema usadas com registro binário

A lista a seguir descreve as variáveis de sistema para controlar o registro binário. Elas podem ser definidas na inicialização do servidor e algumas podem ser alteradas em tempo de execução usando `SET`. As opções do servidor usadas para controlar o registro binário estão listadas anteriormente nesta seção.

- [`binlog_cache_size`](https://docs.postgresql.org/en/current/replication-options-binary-log.html#sysvar_binlog_cache_size)

  <table frame="box" rules="all" summary="Propriedades para binlog_cache_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--binlog-cache-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="replication-options-binary-log.html#sysvar_binlog_cache_size">binlog_cache_size</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>32768</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>4096</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td>[[<code>18446744073709547520</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td>[[<code>4294963200</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr><tr><th><a class="link" href="server-system-variables.html#system-variables-block-size" title="Nota">Tamanho do bloco</a></th> <td>[[<code>4096</code>]]</td> </tr></tbody></table>

  O tamanho do cache para armazenar as alterações no log binário durante uma transação.

  Um cache de log binário é alocado para cada cliente se o servidor suportar algum motor de armazenamento transacional e se o servidor tiver o log binário habilitado (opção `--log-bin`). Se você usar frequentemente transações grandes, pode aumentar esse tamanho de cache para obter um melhor desempenho. As variáveis de status `Binlog_cache_use` (\[server-status-variables.html#statvar\_Binlog\_cache\_use]) e `Binlog_cache_disk_use` (\[server-status-variables.html#statvar\_Binlog\_cache\_disk\_use]) podem ser úteis para ajustar o tamanho dessa variável. Veja Seção 5.4.4, “O Log Binário”.

  `binlog_cache_size` define o tamanho apenas para o cache de transações; o tamanho do cache de declarações é regido pela variável de sistema [`binlog_stmt_cache_size`](https://pt.wikibooks.org/wiki/Replication_Options_Binary_Log/sysvar_binlog_stmt_cache_size).

- [`binlog_checksum`](https://pt-br.replication-options-binary-log.html#sysvar_binlog_checksum)

  <table frame="box" rules="all" summary="Propriedades para binlog_checksum"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--binlog-checksum=type</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="replication-options-binary-log.html#sysvar_binlog_checksum">binlog_checksum</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code>CRC32</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>NONE</code>]]</p><p class="valid-value">[[<code>CRC32</code>]]</p></td> </tr></tbody></table>

  Quando habilitada, essa variável faz com que a fonte escreva um checksum para cada evento no log binário. `binlog_checksum` suporta os valores `NONE` (desativado) e `CRC32`. O padrão é `CRC32`. Você não pode alterar o valor de `binlog_checksum` dentro de uma transação.

  Quando o `binlog_checksum` é desativado (valor `NONE`), o servidor verifica se está escrevendo apenas eventos completos no log binário, escrevendo e verificando o comprimento do evento (em vez de um checksum) para cada evento.

  Altere o valor desta variável para fazer com que o log binário seja rotado; os checksums são sempre escritos em um arquivo de log binário inteiro e nunca apenas em parte dele.

  Definir essa variável na fonte para um valor não reconhecido pela réplica faz com que a réplica defina seu próprio valor `binlog_checksum` para `NONE` e pare a replicação com um erro. (Bug #13553750, Bug #61096) Se a compatibilidade reversa com réplicas mais antigas é uma preocupação, você pode querer definir o valor explicitamente para `NONE`.

- [`binlog_direct_non_transactional_updates`](https://replication-options-binary-log.html#sysvar_binlog_direct_non_transactional_updates)

  <table frame="box" rules="all" summary="Propriedades para log-bin"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--log-bin=file_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  Devido a problemas de concorrência, uma replica pode se tornar inconsistente quando uma transação contém atualizações tanto em tabelas transacionais quanto não transacionais. O MySQL tenta preservar a causalidade entre essas declarações escrevendo declarações não transacionais no cache de transação, que é descartado após o commit. No entanto, problemas surgem quando as modificações feitas em tabelas não transacionais em nome de uma transação tornam-se imediatamente visíveis para outras conexões, pois essas alterações podem não ser escritas imediatamente no log binário.

  A variável [`binlog_direct_non_transactional_updates`](https://pt.wikipedia.org/wiki/Binlog#Binlog_direto_de_atualizações_não_transacionais) oferece uma solução possível para esse problema. Por padrão, essa variável está desabilitada. Ativação da variável [`binlog_direct_non_transactional_updates`](https://pt.wikipedia.org/wiki/Binlog#Binlog_direto_de_atualizações_não_transacionais) faz com que as atualizações de tabelas não transacionais sejam escritas diretamente no log binário, em vez de serem armazenadas na cache de transações.

  *`binlog_direct_non_transactional_updates` funciona apenas para declarações que são replicadas usando o formato de registro binário baseado em declarações*; ou seja, funciona apenas quando o valor de `binlog_format` é `STATEMENT`, ou quando `binlog_format` é `MIXED` e uma determinada declaração está sendo replicada usando o formato baseado em declarações. Esta variável não tem efeito quando o formato do log binário é `ROW`, ou quando `binlog_format` é definido como `MIXED` e uma determinada declaração está sendo replicada usando o formato baseado em linhas.

  Importante

  Antes de habilitar essa variável, você deve garantir que não haja dependências entre tabelas transacionais e não transacionais; um exemplo de tal dependência seria a instrução `INSERT INTO myisam_table SELECT * FROM innodb_table`. Caso contrário, essas instruções provavelmente farão com que a replica se desvie da fonte.

  Essa variável não tem efeito quando o formato do log binário é `ROW` ou `MIXED`.

- [`binlog_error_action`](https://replication-options-binary-log.html#sysvar_binlog_error_action)

  <table frame="box" rules="all" summary="Propriedades para log-bin"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--log-bin=file_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  Controla o que acontece quando o servidor encontra um erro, como não conseguir escrever, esvaziar ou sincronizar o log binário, o que pode fazer com que o log binário da fonte se torne inconsistente e as réplicas percam a sincronização.

  Em MySQL 5.7.7 e versões posteriores, essa variável tem o valor padrão `ABORT_SERVER`, o que faz com que o servidor pare de registrar e desligue sempre que encontrar esse erro no log binário. Na reinicialização, a recuperação prossegue como no caso de uma parada inesperada do servidor (consulte Seção 16.3.2, “Tratamento de uma Parada Inesperada de uma Replicação”).

  Quando `binlog_error_action` é definido como `IGNORE_ERROR`, se o servidor encontrar esse tipo de erro, ele continuará a transação em andamento, registrará o erro e, em seguida, encerrará o registro, continuando a realizar atualizações. Para reativar o registro binário, `log_bin` (replicação-opções-log-binário.html#sysvar\_log\_bin) deve ser habilitado novamente, o que requer o reinício do servidor. Esta configuração oferece compatibilidade reversa com versões mais antigas do MySQL.

  Em versões anteriores, essa variável era chamada de `binlogging_impossible_mode`.

- [`binlog_format`](https://pt-br.replication-options-binary-log.html#sysvar_binlog_format)

  <table frame="box" rules="all" summary="Propriedades para log-bin"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--log-bin=file_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  Esta variável de sistema define o formato de registro binário e pode ser qualquer uma das opções `STATEMENT`, `ROW` ou `MIXED`. Consulte Seção 16.2.1, “Formatos de Replicação”. A configuração entra em vigor quando o registro binário é habilitado no servidor, o que ocorre quando a variável de sistema `log_bin` é definida como `ON`. No MySQL 5.7, o registro binário não é habilitado por padrão, e você o habilita usando a opção `--log-bin`.

  [`binlog_format`](https://pt.replication-options-binary-log.html#sysvar_binlog_format) pode ser definido na inicialização ou durante o runtime, exceto que, sob certas condições, alterar essa variável durante o runtime não é possível ou faz com que a replicação falhe, conforme descrito mais adiante.

  Antes do MySQL 5.7.7, o formato padrão era `STATEMENT`. No MySQL 5.7.7 e versões posteriores, o padrão é `ROW`. *Exceção*: No NDB Cluster, o padrão é `MIXED`; a replicação baseada em declarações não é suportada para o NDB Cluster.

  Definir o valor da sessão desta variável de sistema é uma operação restrita. O usuário da sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Consulte Seção 5.1.8.1, “Privilégios de Variáveis de Sistema”.

  As regras que regem quando as alterações nesta variável entram em vigor e por quanto tempo o efeito dura são as mesmas que para outras variáveis do sistema do servidor MySQL. Para mais informações, consulte Seção 13.7.4.1, “Sintaxe SET para Atribuição de Variáveis”.

  Quando o `MIXED` é especificado, a replicação baseada em declarações é usada, exceto nos casos em que apenas a replicação baseada em linhas garanta resultados adequados. Por exemplo, isso acontece quando as declarações contêm funções carregáveis ou a função `UUID()`.

  Para obter detalhes sobre como os programas armazenados (procedimentos e funções armazenados, gatilhos e eventos) são tratados quando cada formato de registro binário é definido, consulte Seção 23.7, “Registro Binário de Programas Armazenados”.

  Existem exceções quando você não pode alternar o formato de replicação em tempo de execução:

  - De uma função armazenada ou de um gatilho.

  - Se a sessão estiver no modo de replicação baseada em linhas e tiver tabelas temporárias abertas.

  - Dentro de uma transação.

  Tentar mudar o formato nesses casos resulta em um erro.

  Alterar o formato de registro em um servidor de origem de replicação não faz com que uma réplica mude seu formato de registro para combinar. Alterar o formato de replicação enquanto a replicação estiver em andamento pode causar problemas se uma réplica tiver o registro binário habilitado, e a mudança resultar no uso do registro `STATEMENT` pela réplica enquanto a fonte estiver usando o registro `ROW` ou `MIXED`. Uma réplica não é capaz de converter entradas de log binário recebidas no formato de registro `ROW` para o formato `STATEMENT` para uso em seu próprio log binário, então essa situação pode causar o fracasso da replicação. Para mais informações, consulte Seção 5.4.4.2, “Definindo o Formato de Registro Binário”.

  O formato de log binário afeta o comportamento das seguintes opções do servidor:

  - [`--replicate-do-db`](https://replication-options-replica.html#option_mysqld_replicate-do-db)
  - [`--replicate-ignore-db`](https://replication-options-replica.html#option_mysqld_replicate-ignore-db)
  - [`--binlog-do-db`](https://replication-options-binary-log.html#option_mysqld_binlog-do-db)
  - [`--binlog-ignore-db`](https://replication-options-binary-log.html#option_mysqld_binlog-ignore-db)

  Esses efeitos são discutidos em detalhes nas descrições das opções individuais.

- [`binlog_group_commit_sync_delay`](https://replication-options-binary-log.html#sysvar_binlog_group_commit_sync_delay)

  <table frame="box" rules="all" summary="Propriedades para log-bin"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--log-bin=file_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  Controla quantos microsegundos o log binário de commit espera antes de sincronizar o arquivo do log binário com o disco. Por padrão, [`binlog_group_commit_sync_delay`](https://pt.wikipedia.org/wiki/Replicação_\(banco_de_dados\)/Opções_de_log_bin%C3%A1rio#sysvar_binlog_group_commit_sync_delay) está definido como 0, o que significa que não há atraso. Definir [`binlog_group_commit_sync_delay`](https://pt.wikipedia.org/wiki/Replicação_\(banco_de_dados\)/Opções_de_log_bin%C3%A1rio#sysvar_binlog_group_commit_sync_delay) com um atraso em microsegundos permite que mais transações sejam sincronizadas com o disco de uma vez, reduzindo o tempo total para confirmar um grupo de transações, pois os grupos maiores requerem menos unidades de tempo por grupo.

  Quando [`sync_binlog=0`](https://pt.wikipedia.org/wiki/Replicação_de_transações#Op%C3%A7%C3%B5es_de_binary-log) ou [`sync_binlog=1`](https://pt.wikipedia.org/wiki/Replicação_de_transações#Op%C3%A7%C3%B5es_de_binary-log) é definido, o atraso especificado por [`binlog_group_commit_sync_delay`](https://pt.wikipedia.org/wiki/Replicação_de_transações#Op%C3%A7%C3%B5es_de_binary-log) é aplicado para cada grupo de commit do log binário antes da sincronização (ou, no caso de [`sync_binlog=0`](https://pt.wikipedia.org/wiki/Replicação_de_transações#Op%C3%A7%C3%B5es_de_binary-log), antes de prosseguir). Quando [`sync_binlog`](https://pt.wikipedia.org/wiki/Replicação_de_transações#Op%C3%A7%C3%B5es_de_binary-log) é definido para um valor *n* maior que 1, o atraso é aplicado após cada *n* grupo de commit do log binário.

  A configuração de [`binlog_group_commit_sync_delay`](https://pt.wikipedia.org/wiki/Binlog#Op%C3%A7%C3%B5es_bin%C3%A1rias.3C/a) pode aumentar o número de transações de commit paralelas em qualquer servidor que tenha (ou possa ter após uma falha de replicação) uma replica, e, portanto, pode aumentar a execução paralela nas réplicas. Para se beneficiar desse efeito, os servidores de replica devem ter [`slave_parallel_type=CLOCK`](https://pt.wikipedia.org/wiki/Binlog#Op%C3%A7%C3%B5es_bin%C3%A1rias.3C/a) definido, e o efeito é mais significativo quando [`binlog_transaction_dependency_tracking=COMMIT_ORDER`](https://pt.wikipedia.org/wiki/Binlog#Op%C3%A7%C3%B5es_bin%C3%A1rias.3C/a) também está definido. É importante levar em consideração tanto o throughput da fonte quanto o throughput das réplicas ao ajustar a configuração de [`binlog_group_commit_sync_delay`](https://pt.wikipedia.org/wiki/Binlog#Op%C3%A7%C3%B5es_bin%C3%A1rias.3C/a).

  A definição de [`binlog_group_commit_sync_delay`](https://docs.postgresql.org/en/current/replication-options-binary-log.html#sysvar_binlog_group_commit_sync_delay) também pode reduzir o número de chamadas `fsync()` ao log binário em qualquer servidor (fonte ou réplica) que tenha um log binário.

  Observe que definir [`binlog_group_commit_sync_delay`](https://pt.wikipedia.org/wiki/Replicação_de_transações#Op%C3%A7%C3%B5es_bin%C3%A1rias_de_replicac%C3%A3o.html#sysvar_binlog_group_commit_sync_delay) aumenta a latência das transações no servidor, o que pode afetar as aplicações do cliente. Além disso, em cargas de trabalho altamente concorrentes, é possível que o atraso aumente a concorrência e, portanto, reduza o desempenho. Normalmente, os benefícios de definir um atraso superam os inconvenientes, mas o ajuste deve ser sempre realizado para determinar o ajuste ótimo.

- [`binlog_group_commit_sync_no_delay_count`](https://replication-options-binary-log.html#sysvar_binlog_group_commit_sync_no_delay_count)

  <table frame="box" rules="all" summary="Propriedades para log-bin"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--log-bin=file_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  O número máximo de transações a serem esperadas antes de abortar o atraso atual, conforme especificado por [`binlog_group_commit_sync_delay`](https://pt.wikipedia.org/wiki/Replicação_de_transações#Op%C3%A7%C3%B5es_de_binlog). Se [`binlog_group_commit_sync_delay`](https://pt.wikipedia.org/wiki/Replicação_de_transações#Op%C3%A7%C3%B5es_de_binlog) estiver definido como 0, então essa opção não tem efeito.

- [`binlog_max_flush_queue_time`](https://replication-options-binary-log.html#sysvar_binlog_max_flush_queue_time)

  <table frame="box" rules="all" summary="Propriedades para log-bin"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--log-bin=file_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  Anteriormente, isso controlava o tempo em microsegundos para continuar lendo transações da fila de esvaziamento antes de prosseguir com o commit do grupo. No MySQL 5.7, essa variável não tem mais efeito.

  `binlog_max_flush_queue_time` está desatualizado a partir do MySQL 5.7.9 e está marcado para eventual remoção em uma futura versão do MySQL.

- [`binlog_order_commits`](https://replication-options-binary-log.html#sysvar_binlog_order_commits)

  <table frame="box" rules="all" summary="Propriedades para log-bin"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--log-bin=file_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  Quando essa variável é habilitada em um servidor de fonte de replicação (o que é o padrão), as instruções de commit de transações emitidas para os motores de armazenamento são serializadas em um único thread, de modo que as transações são sempre confirmadas na mesma ordem em que são escritas no log binário. Desabilitar essa variável permite que as instruções de commit de transações sejam emitidas usando múltiplos threads. Usada em combinação com o commit de grupo de log binário, isso impede que a taxa de commit de uma única transação seja um gargalo para o desempenho e, portanto, pode produzir uma melhoria no desempenho.

  As transações são escritas no log binário no momento em que todos os motores de armazenamento envolvidos confirmam que a transação está pronta para ser confirmada. A lógica de commit do grupo de log binário então confirma um grupo de transações após a gravação no log binário ter ocorrido. Quando o [`binlog_order_commits`](https://pt.wikipedia.org/wiki/Log_bin%C3%A1rio#sysvar_binlog_order_commits) é desativado, porque múltiplos threads são usados para esse processo, as transações em um grupo de commit podem ser confirmadas em uma ordem diferente da ordem em que estão no log binário. (As transações de um único cliente sempre são confirmadas em ordem cronológica.) Em muitos casos, isso não importa, pois as operações realizadas em transações separadas devem produzir resultados consistentes, e se isso não for o caso, uma única transação deve ser usada.

  Se você deseja garantir que o histórico de transações na fonte e na replica multithreading permaneça idêntico, defina [`slave_preserve_commit_order=1`](https://pt.wikibooks.org/wiki/Replication_Options/Replica_Options#sysvar_slave_preserve_commit_order) na replica.

- [`binlog_row_image`](https://replication-options-binary-log.html#sysvar_binlog_row_image)

  <table frame="box" rules="all" summary="Propriedades para log-bin"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--log-bin=file_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  Para a replicação baseada em linhas do MySQL, essa variável determina como as imagens das linhas são escritas no log binário.

  Na replicação baseada em linhas do MySQL, cada evento de mudança de linha contém duas imagens, uma imagem “antes” cujas colunas são comparadas ao buscar a linha a ser atualizada, e uma imagem “depois” que contém as alterações. Normalmente, o MySQL registra linhas completas (ou seja, todas as colunas) tanto para as imagens antes quanto depois. No entanto, não é estritamente necessário incluir todas as colunas em ambas as imagens, e muitas vezes podemos economizar espaço em disco, memória e uso de rede ao registrar apenas as colunas que são realmente necessárias.

  Nota

  Ao excluir uma linha, apenas a imagem anterior é registrada, uma vez que não há valores alterados para serem propagados após a exclusão. Ao inserir uma linha, apenas a imagem posterior é registrada, uma vez que não há uma linha existente para ser correspondida. Somente ao atualizar uma linha, as imagens anterior e posterior são necessárias e ambas são escritas no log binário.

  Para a imagem anterior, é necessário apenas que o conjunto mínimo de colunas necessário para identificar de forma única as linhas seja registrado. Se a tabela que contém a linha tiver uma chave primária, então apenas a(s) coluna(s) da chave primária será(ão) escrita(s) no log binário. Caso contrário, se a tabela tiver uma chave única cujas colunas são `NOT NULL`, então apenas as colunas da chave única precisam ser registradas. (Se a tabela não tiver nem uma chave primária nem uma chave única sem quaisquer colunas `NULL`, então todas as colunas devem ser usadas na imagem anterior e registradas.) Na imagem posterior, é necessário registrar apenas as colunas que realmente mudaram.

  Você pode fazer com que o servidor registre linhas completas ou mínimas usando a variável de sistema `binlog_row_image`. Essa variável, na verdade, aceita um dos três valores possíveis, conforme mostrado na lista a seguir:

  - `full`: Registre todas as colunas na imagem anterior e na imagem posterior.

  - `minimal`: Registre apenas as colunas da imagem anterior que são necessárias para identificar a linha a ser alterada; registre apenas as colunas da imagem final onde um valor foi especificado pelo comando SQL ou gerado por autoincremento.

  - `noblob`: Registre todas as colunas (mesmo que `full`), exceto as colunas `BLOB` e `TEXT` que não são necessárias para identificar linhas ou que não foram alteradas.

  Nota

  Esta variável não é suportada pelo NDB Cluster; definir isso não tem efeito na logagem das tabelas de `NDB`.

  O valor padrão é `full`.

  Ao usar `minimal` ou `noblob`, as operações de exclusão e atualização são garantidas para funcionar corretamente para uma tabela específica se e somente se as seguintes condições forem verdadeiras tanto para a tabela de origem quanto para a tabela de destino:

  - Todas as colunas devem estar presentes e na mesma ordem; cada coluna deve usar o mesmo tipo de dado que sua contraparte na outra tabela.

  - As tabelas devem ter definições de chave primária idênticas.

  (Em outras palavras, as tabelas devem ser idênticas, com a possível exceção de índices que não fazem parte das chaves primárias das tabelas.)

  Se essas condições não forem atendidas, é possível que os valores das colunas da chave primária na tabela de destino possam não ser suficientes para fornecer uma correspondência única para uma exclusão ou atualização. Nesse caso, nenhum aviso ou erro é emitido; a fonte e a réplica divergem silenciosamente, rompendo assim a consistência.

  Definir essa variável não tem efeito quando o formato de registro binário é `STATEMENT`. Quando [`binlog_format`](https://pt.wikipedia.org/wiki/Replicação#Op%C3%A7%C3%B5es_de_registro_bin%C3%A1rio.3C/a) é `MIXED`, o ajuste para `binlog_row_image` é aplicado a alterações registradas usando o formato baseado em linhas, mas esse ajuste não tem efeito em alterações registradas como declarações.

  Definir `binlog_row_image` no nível global ou de sessão não causa um commit implícito; isso significa que essa variável pode ser alterada enquanto uma transação estiver em andamento sem afetar a transação.

- `binlog_rows_query_log_events`

  <table frame="box" rules="all" summary="Propriedades para log-bin"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--log-bin=file_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  Esta variável de sistema afeta apenas o registro baseado em linhas. Quando ativada, faz com que o servidor escreva eventos de registro informativos, como eventos de registro de consultas de linha, em seu log binário. Essas informações podem ser usadas para depuração e fins relacionados, como obter a consulta original emitida na fonte quando não puder ser reconstruída a partir das atualizações da linha.

  Esses eventos informativos são normalmente ignorados pelos programas do MySQL que leem o log binário e, portanto, não causam problemas durante a replicação ou restauração a partir de um backup. Para visualizá-los, aumente o nível de verbosidade usando a opção `--verbose` do mysqlbinlog (mysqlbinlog.html#option\_mysqlbinlog\_verbose) duas vezes, como `-vv` ou `--verbose --verbose`.

- [`binlog_stmt_cache_size`](https://replication-options-binary-log.html#sysvar_binlog_stmt_cache_size)

  <table frame="box" rules="all" summary="Propriedades para log-bin"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--log-bin=file_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  Essa variável determina o tamanho do cache do log binário para armazenar declarações não transacionais emitidas durante uma transação.

  Cache separado de transações e declarações de log binário são alocados para cada cliente se o servidor suportar algum motor de armazenamento transacional e se o servidor tiver o log binário habilitado (opção `--log-bin`). Se você usar frequentemente grandes declarações não transacionais durante transações, pode aumentar esse tamanho de cache para obter um melhor desempenho. As variáveis de status `Binlog_stmt_cache_use` e `Binlog_stmt_cache_disk_use` podem ser úteis para ajustar o tamanho dessa variável. Veja Seção 5.4.4, “O Log Binário”.

  A variável de sistema [`binlog_cache_size`](https://pt.wikipedia.org/wiki/Replicação_de_transações#Op%C3%A7%C3%B5es_bin%C3%A1rias-de_transa%C3%A7%C3%A3o) define o tamanho do cache de transações.

- [`binlog_transaction_dependency_tracking`](https://replication-options-binary-log.html#sysvar_binlog_transaction_dependency_tracking)

  <table frame="box" rules="all" summary="Propriedades para log-bin-index"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--log-bin-index=file_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="replication-options-binary-log.html#sysvar_log_bin_index">log_bin_index</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  A fonte de informações de dependência que a fonte usa para determinar quais transações podem ser executadas em paralelo pelo aplicativo multithread da replica. Essa variável pode assumir um dos três valores descritos na lista a seguir:

  - `COMMIT_ORDER`: As informações de dependência são geradas a partir dos timestamps de commit da fonte. Isso é o padrão.

  - `WRITESET`: As informações de dependência são geradas a partir do conjunto de escrita da fonte, e quaisquer transações que escrevam tuplas diferentes podem ser paralelizadas.

  - `WRITESET_SESSION`: As informações de dependência são geradas a partir do conjunto de escrita da fonte, e quaisquer transações que escrevam tuplas diferentes podem ser paralelizadas, com a exceção de que nenhuma atualização da mesma sessão pode ser reordenada.

  No modo `WRITESET` ou `WRITESET_SESSION`, as transações podem ser confirmadas fora da ordem, a menos que você também defina `slave_preserve_commit_order=1`.

  Para algumas transações, os modos `WRITESET` e `WRITESET_SESSION` não podem melhorar os resultados que seriam retornados no modo `COMMIT_ORDER`. Esse é o caso de transações que têm conjuntos de escrita vazios ou parciais, transações que atualizam tabelas sem chaves primárias ou únicas e transações que atualizam tabelas pai em uma relação de chave estrangeira. Nessas situações, a fonte usa o modo `COMMIT_ORDER` para gerar as informações de dependência.

  O valor desta variável não pode ser definido para nada além de `COMMIT_ORDER` se `transaction_write_set_extraction` estiver `OFF`. Você também deve notar que o valor de `transaction_write_set_extraction` não pode ser alterado se o valor atual de `binlog_transaction_dependency_tracking` for `WRITESET` ou `WRITESET_SESSION`. Se você alterar o valor, o novo valor não entrará em vigor nas réplicas até que a réplica tenha sido parada e reiniciada com as instruções `STOP SLAVE` e `START SLAVE`.

  O número de hashes de linha a serem mantidos e verificados para determinar se a última transação alterou uma determinada linha é determinado pelo valor de [`binlog_transaction_dependency_history_size`](https://pt.wikipedia.org/wiki/Op%C3%A7%C3%B5es_de_log_bin%C3%A1rio#sysvar_binlog_transaction_dependency_history_size).

- [`binlog_transaction_dependency_history_size`](https://replication-options-binary-log.html#sysvar_binlog_transaction_dependency_history_size)

  <table frame="box" rules="all" summary="Propriedades para log-bin-index"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--log-bin-index=file_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="replication-options-binary-log.html#sysvar_log_bin_index">log_bin_index</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  Define um limite superior para o número de hashes de linha que são mantidos na memória e usados para procurar a transação que modificou a última uma determinada linha. Quando esse número de hashes é atingido, o histórico é apagado.

- `expire_logs_days`

  <table frame="box" rules="all" summary="Propriedades para log-bin-index"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--log-bin-index=file_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="replication-options-binary-log.html#sysvar_log_bin_index">log_bin_index</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  O número de dias para a remoção automática do arquivo de log binário. O padrão é 0, o que significa "sem remoção automática". As remoções automáticas ocorrem ao iniciar o servidor e quando o log binário é descarregado. O descarregamento do log ocorre conforme indicado em Seção 5.4, "Logs do MySQL Server".

  Para remover arquivos de log binários manualmente, use a instrução `PURGE BINARY LOGS`. Veja Seção 13.4.1.1, “Instrução PURGE BINARY LOGS”.

- [`log_bin`](https://replication-options-binary-log.html#sysvar_log_bin)

  <table frame="box" rules="all" summary="Propriedades para log-bin-index"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--log-bin-index=file_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="replication-options-binary-log.html#sysvar_log_bin_index">log_bin_index</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  Se o log binário estiver habilitado. Se a opção `--log-bin` for usada, o valor desta variável é `ON`; caso contrário, é `OFF`. Esta variável informa apenas sobre o status do registro binário (ativado ou desativado); ela não informa o valor para o qual a opção `--log-bin` está definida.

  Veja Seção 5.4.4, “O Log Binário”.

- [`log_bin_basename`](https://replication-options-binary-log.html#sysvar_log_bin_basename)

  <table frame="box" rules="all" summary="Propriedades para log-bin-index"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--log-bin-index=file_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="replication-options-binary-log.html#sysvar_log_bin_index">log_bin_index</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  Armazena o nome de base e o caminho dos arquivos de log binários, que podem ser definidos com a opção de servidor `--log-bin`. A variável de comprimento máximo é de 256. No MySQL 5.7, o nome de base padrão é o nome da máquina do host com o sufixo `-bin`. A localização padrão é o diretório de dados.

- [`log_bin_index`](https://replication-options-binary-log.html#sysvar_log_bin_index)

  <table frame="box" rules="all" summary="Propriedades para log-bin-index"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--log-bin-index=file_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="replication-options-binary-log.html#sysvar_log_bin_index">log_bin_index</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  Armazena o nome de base e o caminho do arquivo de índice do log binário, que pode ser definido com a opção de servidor [`--log-bin-index`](https://pt.wikipedia.org/wiki/Op%C3%A9rnia_de_servidor_mysqld_log-bin-index), a variável de comprimento máximo é de 256.

- [`log_bin_trust_function_creators`](https://replication-options-binary-log.html#sysvar_log_bin_trust_function_creators)

  <table frame="box" rules="all" summary="Propriedades para log-bin-index"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--log-bin-index=file_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="replication-options-binary-log.html#sysvar_log_bin_index">log_bin_index</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  Esta variável é aplicada quando o registro binário está habilitado. Ela controla se os criadores de funções armazenadas podem ser confiáveis para não criar funções armazenadas que causem eventos inseguros a serem escritos no log binário. Se definida para 0 (o padrão), os usuários não têm permissão para criar ou alterar funções armazenadas, a menos que tenham o privilégio `SUPER`, além do privilégio `CREATE ROUTINE` ou `ALTER ROUTINE`. Uma configuração de 0 também impõe a restrição de que uma função deve ser declarada com a característica `DETERMINISTIC`, ou com a característica `READS SQL DATA` ou `NO SQL`. Se a variável for definida para 1, o MySQL não aplica essas restrições à criação de funções armazenadas. Esta variável também se aplica à criação de gatilhos. Veja Seção 23.7, “Registro Binário de Programas Armazenados”.

- [`log_bin_use_v1_row_events`](https://replication-options-binary-log.html#sysvar_log_bin_use_v1_row_events)

  <table frame="box" rules="all" summary="Propriedades para log-bin-index"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--log-bin-index=file_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="replication-options-binary-log.html#sysvar_log_bin_index">log_bin_index</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  Se a versão 2 do registro binário estiver em uso. Se essa variável for 0 (desativada, o padrão), os eventos do log binário da versão 2 estarão em uso. Se essa variável for 1 (ativada), o servidor escreve o log binário usando eventos de registro da versão 1 (a única versão de eventos de registro binário usada em versões anteriores) e, assim, produz um log binário que pode ser lido por réplicas mais antigas.

  O MySQL 5.7 usa eventos de linha de log binário da Versão 2 por padrão. No entanto, os eventos da Versão 2 não podem ser lidos por versões do MySQL Server anteriores a MySQL 5.6.6. Ativação de `log_bin_use_v1_row_events` faz com que o **mysqld** escreva o log binário usando eventos de registro da Versão 1.

  Esta variável é somente de leitura durante a execução. Para alternar entre o registro de eventos binários da Versão 1 e da Versão 2, é necessário definir `log_bin_use_v1_row_events` no início do servidor.

  Exceto durante a realização de atualizações do NDB Cluster Replication, `log_bin_use_v1_row_events` é principalmente de interesse ao configurar a detecção e resolução de conflitos de replicação usando `NDB$EPOCH_TRANS()` como a função de detecção de conflitos, o que requer eventos de linha de log binário da Versão 2. Assim, essa variável e `--ndb-log-transaction-id` não são compatíveis.

  Nota

  O MySQL NDB Cluster 7.5 usa eventos de linha de log binário da Versão 2 por padrão. Você deve ter isso em mente ao planejar atualizações ou desatualizações e para configurações que utilizam a Replicação do NDB Cluster.

  Para obter mais informações, consulte Seção 21.7.11, “Resolução de conflitos de replicação de cluster NDB”.

- [`log_builtin_as_identified_by_password`](https://replication-options-binary-log.html#sysvar_log_builtin_as_identified_by_password)

  <table frame="box" rules="all" summary="Propriedades para log-bin-index"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--log-bin-index=file_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="replication-options-binary-log.html#sysvar_log_bin_index">log_bin_index</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  Essa variável afeta o registro binário de declarações de gerenciamento de usuários. Quando habilitada, a variável tem os seguintes efeitos:

  - O registro binário para as instruções `CREATE USER` que envolvem plugins de autenticação integrados reescreve as instruções para incluir uma cláusula `IDENTIFIED BY PASSWORD`.

  - As declarações `SET PASSWORD` são registradas como declarações `SET PASSWORD`, em vez de serem reescritas como declarações `ALTER USER`.

  - As instruções `SET PASSWORD` são alteradas para registrar o hash da senha em vez da senha fornecida em texto claro (não criptografada).

  Ativação desta variável garante melhor compatibilidade para replicação entre versões com réplicas da versão 5.6 e pré-5.7.6, e para aplicativos que esperam essa sintaxe no log binário.

- [`log_slave_updates`](https://replication-options-binary-log.html#sysvar_log_slave_updates)

  <table frame="box" rules="all" summary="Propriedades para log-bin-index"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--log-bin-index=file_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="replication-options-binary-log.html#sysvar_log_bin_index">log_bin_index</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  Se as atualizações recebidas por um servidor replica de um servidor fonte devem ser registradas no log binário próprio da replica.

  Normalmente, uma replica não registra em seu próprio log binário quaisquer atualizações recebidas de um servidor de origem. Ativação desta variável faz com que a replica escreva as atualizações realizadas por seu próprio thread de replicação SQL em seu próprio log binário. Para que esta opção tenha algum efeito, a replica também deve ser iniciada com a opção `--log-bin` para habilitar o registro binário. Veja Seção 16.1.6, “Opções e Variáveis de Registro Binário e Replicação”.

  O [`log_slave_updates`](https://replication-options-binary-log.html#sysvar_log_slave_updates) está habilitado quando você deseja encadear servidores de replicação. Por exemplo, você pode querer configurar servidores de replicação usando essa configuração:

  ```sql
  A -> B -> C
  ```

  Aqui, `A` serve como fonte para a replica `B`, e `B` serve como fonte para a replica `C`. Para que isso funcione, `B` deve ser tanto uma fonte *e* uma replica. Você deve iniciar tanto `A` quanto `B` com `--log-bin` para habilitar o registro binário, e `B` com `log_slave_updates` habilitado para que as atualizações recebidas de `A` sejam registradas por `B` em seu log binário.

- [`log_statements_unsafe_for_binlog`](https://replication-options-binary-log.html#sysvar_log_statements_unsafe_for_binlog)

  <table frame="box" rules="all" summary="Propriedades para binlog-do-db"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--binlog-do-db=name</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Se o erro 1592 for encontrado, controle se os avisos gerados serão adicionados ao log de erros ou

- [`master_verify_checksum`](https://replication-options-binary-log.html#sysvar_master_verify_checksum)

  <table frame="box" rules="all" summary="Propriedades para binlog-do-db"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--binlog-do-db=name</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Ativação desta variável faz com que a fonte verifique os eventos lidos do log binário examinando os checksums e pare com um erro em caso de discrepância. `master_verify_checksum` está desativado por padrão; nesse caso, a fonte usa o comprimento do evento do log binário para verificar os eventos, de modo que apenas eventos completos sejam lidos do log binário.

- [`max_binlog_cache_size`](https://replication-options-binary-log.html#sysvar_max_binlog_cache_size)

  <table frame="box" rules="all" summary="Propriedades para binlog-do-db"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--binlog-do-db=name</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Se uma transação exigir mais de esse número de bytes, o servidor gera um erro de transação de múltiplos comandos que exige mais de 'max\_binlog\_cache\_size' bytes de armazenamento. Quando `gtid_mode` não está `ON`, o valor máximo recomendado é de 4 GB, devido ao fato de que, neste caso, o MySQL não pode trabalhar com posições de log binário maiores que 4 GB; quando `gtid_mode` está `ON`, essa limitação não se aplica e o servidor pode trabalhar com posições de log binário de tamanho arbitrário.

  Se, por algum motivo, o `gtid_mode` não estiver ativado ou se você precisar garantir que o log binário não ultrapasse um tamanho específico *`maxsize`*, você deve definir essa variável de acordo com a fórmula mostrada aqui:

  ```sql
  max_binlog_cache_size <
    (((maxsize - max_binlog_size) / max_connections) - 1000) / 1.2
  ```

  Esse cálculo leva em consideração as seguintes condições:

  - O servidor escreve no log binário enquanto o tamanho antes de começar a escrever for menor que [`max_binlog_size`](https://pt.wikipedia.org/wiki/Op%C3%A7%C3%B5es_de_replic%C3%A3o#sysvar_max_binlog_size).

  - O servidor não escreve transações individuais, mas sim grupos de transações. O número máximo de transações em um grupo é igual a `max_connections`.

  - O servidor escreve dados que não estão incluídos no cache. Isso inclui um checksum de 4 bytes para cada evento; embora isso aumente menos de 20% no tamanho da transação, esse valor não é desprezível. Além disso, o servidor escreve um `Gtid_log_event` para cada transação; cada um desses eventos pode adicionar mais 1 KB ao que é escrito no log binário.

  `max_binlog_cache_size` define o tamanho apenas para o cache de transações; o limite superior para o cache de instruções é regido pela variável de sistema [`max_binlog_stmt_cache_size`](https://pt.wikipedia.org/wiki/Replicação_de_logs_binários#sysvar_max_binlog_stmt_cache_size).

  A visibilidade das sessões de `max_binlog_cache_size` corresponde à da variável de sistema [`binlog_cache_size`](https://pt.wikipedia.org/wiki/Replicação_de_bin%C3%A1rios#Op%C3%A7%C3%B5es_bin%C3%A1rias-de_replicac%C3%A3o.html#sysvar_binlog_cache_size), ou seja, alterar seu valor afeta apenas as novas sessões iniciadas após a alteração.

- [`max_binlog_size`](https://pt.replication-options-binary-log.html#sysvar_max_binlog_size)

  <table frame="box" rules="all" summary="Propriedades para binlog-do-db"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--binlog-do-db=name</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Se uma escrita no log binário causar que o tamanho atual do arquivo de log exceda o valor desta variável, o servidor rotaciona os logs binários (fecha o arquivo atual e abre o próximo). O valor mínimo é de 4096 bytes. O valor máximo e o valor padrão é de 1 GB.

  Uma transação é escrita em um único bloco no log binário, portanto, ela nunca é dividida entre vários logs binários. Portanto, se você tiver transações grandes, você pode ver arquivos de log binário maiores do que `max_binlog_size`.

  Se `max_relay_log_size` for 0, o valor de `max_binlog_size` também será aplicado aos logs de retransmissão.

- [`max_binlog_stmt_cache_size`](https://replication-options-binary-log.html#sysvar_max_binlog_stmt_cache_size)

  <table frame="box" rules="all" summary="Propriedades para binlog-do-db"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--binlog-do-db=name</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Se declarações não transacionais dentro de uma transação exigirem mais de quantos bytes de memória, o servidor gera um erro. O valor mínimo é de 4096. Os valores máximo e padrão são de 4 GB em plataformas de 32 bits e 16 EB (exabytes) em plataformas de 64 bits.

  `max_binlog_stmt_cache_size` define o tamanho apenas para o cache de instruções; o limite superior para o cache de transações é regido exclusivamente pela variável de sistema [`max_binlog_cache_size`](https://pt.wikipedia.org/wiki/Replicação_de_logs_binários#sysvar_max_binlog_cache_size).

- [`sql_log_bin`](https://pt-br.replication-options-binary-log.html#sysvar_sql_log_bin)

  <table frame="box" rules="all" summary="Propriedades para binlog-do-db"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--binlog-do-db=name</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Essa variável controla se o registro no log binário está habilitado para a sessão atual (assumindo que o próprio log binário esteja habilitado). O valor padrão é `ON`. Para desabilitar ou habilitar o registro binário para a sessão atual, defina a variável da sessão [`sql_log_bin`](https://pt.replication-options-binary-log.html#sysvar_sql_log_bin) para `OFF` ou `ON`.

  Defina essa variável para `OFF` para uma sessão desativar temporariamente o registro binário enquanto você faz alterações na fonte que você não deseja replicar para a replica.

  Definir o valor da sessão desta variável de sistema é uma operação restrita. O usuário da sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Consulte Seção 5.1.8.1, “Privilégios de Variáveis de Sistema”.

  Não é possível definir o valor da sessão de [`sql_log_bin`](https://pt.wikipedia.org/wiki/Replicação_de_logs_bin%C3%A1rios#sysvar_sql_log_bin) dentro de uma transação ou subconsulta.

  *Definir essa variável como `OFF` impede que GTIDs sejam atribuídos às transações no log binário*. Se você estiver usando GTIDs para replicação, isso significa que, mesmo quando o registro binário for habilitado novamente, os GTIDs escritos no log a partir desse ponto não considerarão quaisquer transações que ocorreram nesse período, portanto, essas transações serão perdidas.

  A variável global [`sql_log_bin`](https://pt.wikipedia.org/wiki/Replicação_de_opções_de_log_bin%C3%A1rio#sysvar_sql_log_bin) é de leitura somente e não pode ser modificada. O escopo global é desatualizado; espere que ele seja removido em uma futura versão do MySQL.

- [`sync_binlog`](https://pt.replication-options-binary-log.html#sysvar_sync_binlog)

  <table frame="box" rules="all" summary="Propriedades para binlog-do-db"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--binlog-do-db=name</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Controla a frequência com que o servidor MySQL sincroniza o log binário com o disco.

  - [`sync_binlog=0`](https://replication-options-binary-log.html#sysvar_sync_binlog): Desabilita a sincronização do log binário com o disco pelo servidor MySQL. Em vez disso, o servidor MySQL depende do sistema operacional para esvaziar o log binário para o disco de tempos em tempos, como faz com qualquer outro arquivo. Esta configuração oferece o melhor desempenho, mas, em caso de falha de energia ou falha do sistema operacional, é possível que o servidor tenha comprometido transações que não foram sincronizadas com o log binário.

  - [`sync_binlog=1`](https://pt.replication-options-binary-log.html#sysvar_sync_binlog): Habilita a sincronização do log binário com o disco antes que as transações sejam confirmadas. Esta é a configuração mais segura, mas pode ter um impacto negativo no desempenho devido ao aumento do número de escritas no disco. Em caso de falha de energia ou falha do sistema operacional, as transações que estão ausentes do log binário estão apenas em um estado preparado. Isso permite que a rotina de recuperação automática desfaça as transações, o que garante que nenhuma transação seja perdida do log binário.

  - `sync_binlog=N`, onde *`N`* é um valor diferente de 0 ou 1: O log binário é sincronizado com o disco após a coleta de `N` grupos de commit do log binário. Em caso de falha de energia ou falha do sistema operacional, é possível que o servidor tenha comprometido transações que não foram descarregadas para o log binário. Esta configuração pode ter um impacto negativo no desempenho devido ao aumento do número de escritas no disco. Um valor maior melhora o desempenho, mas aumenta o risco de perda de dados.

  Para obter a maior durabilidade e consistência possível em uma configuração de replicação que utiliza o `InnoDB` com transações, use as seguintes configurações:

  - `sync_binlog=1`.
  - `innodb_flush_log_at_trx_commit=1`.

  Cuidado

  Muitos sistemas operacionais e alguns hardwares de disco enganam a operação de gravação no disco. Eles podem informar ao **mysqld** que a gravação ocorreu, mesmo que não tenha. Nesse caso, a durabilidade das transações não é garantida, mesmo com as configurações recomendadas, e, no pior dos casos, uma queda de energia pode corromper os dados do `InnoDB`. O uso de um cache de disco com bateria no controlador de disco SCSI ou no próprio disco acelera as gravação no disco e torna a operação mais segura. Você também pode tentar desativar o cache de gravação no disco em caches de hardware.

- [`transaction_write_set_extraction`](https://replication-options-binary-log.html#sysvar_transaction_write_set_extraction)

  <table frame="box" rules="all" summary="Propriedades para binlog-do-db"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--binlog-do-db=name</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Define o algoritmo usado para gerar um hash que identifica as gravações associadas a uma transação. Se você estiver usando a Replicação por Grupo, o valor do hash é usado para detecção e tratamento de conflitos distribuídos. Em sistemas de 64 bits que executam a Replicação por Grupo, recomendamos definir esse valor para `XXHASH64` para evitar colisões desnecessárias de hash que resultam em falhas de certificação e no rollback das transações dos usuários. Veja Seção 17.3.1, “Requisitos de Replicação por Grupo”. O valor da variável `binlog_format` deve ser definido para `ROW` para alterar o valor dessa variável. Se você alterar o valor, o novo valor só entrará em vigor nas réplicas após a réplica ter sido parada e reiniciada com as instruções `STOP SLAVE` (parar o escravo) e `START SLAVE` (começar o escravo).

  Nota

  Quando `WRITESET` ou `WRITESET_SESSION` é definido como o valor para `binlog_transaction_dependency_tracking`, `transaction_write_set_extraction` deve ser definido para especificar um algoritmo (não definido como `OFF`). Enquanto o valor atual de `binlog_transaction_dependency_tracking` é `WRITESET` ou `WRITESET_SESSION`, você não pode alterar o valor de `transaction_write_set_extraction`.
