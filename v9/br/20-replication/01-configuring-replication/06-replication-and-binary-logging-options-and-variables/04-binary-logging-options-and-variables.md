#### 19.1.6.4 Opções e variáveis de registro binário

* Opções de inicialização usadas com registro binário
* Variáveis de sistema usadas com registro binário

Você pode usar as opções do **mysqld** e as variáveis de sistema descritas nesta seção para afetar o funcionamento do log binário, bem como para controlar quais instruções são escritas no log binário. Para obter informações adicionais sobre o log binário, consulte a Seção 7.4.4, “O Log Binário”. Para obter informações adicionais sobre o uso de opções e variáveis de sistema do servidor MySQL, consulte a Seção 7.1.7, “Opções de comandos do servidor”, e a Seção 7.1.8, “Variáveis de sistema do servidor”.

##### Opções de inicialização usadas com registro binário

A lista a seguir descreve as opções de inicialização para habilitar e configurar o log binário. As variáveis de sistema usadas com registro binário são discutidas mais adiante nesta seção.

* `--binlog-row-event-max-size=N`

<table frame="box" rules="all" summary="Propriedades para binlog-row-event-max-size">
  <tr><th>Formato de Linha de Comando</th> <td><code>--binlog-row-event-max-size=#</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code>binlog_row_event_max_size</code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Não</td> </tr>
  <tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>8192</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>256</code></td> </tr>
  <tr><th>Valor Máximo (Plataformas de 64 bits)</th> <td><code>18446744073709551615</code></td> </tr>
  <tr><th>Valor Máximo (Plataformas de 32 bits)</th> <td><code>4294967295</code></td> </tr>
  <tr><th>Unidade</th> <td>bytes</td> </tr>
</table>

  Quando o registro binário baseado em linhas é usado, este ajuste é um limite suave do tamanho máximo de um evento de log binário baseado em linhas, em bytes. Sempre que possível, as linhas armazenadas no log binário são agrupadas em eventos com um tamanho não superior ao valor deste ajuste. Se um evento não puder ser dividido, o tamanho máximo pode ser excedido. O valor deve ser (ou, caso contrário, será arredondado para baixo) um múltiplo de 256. O valor padrão é de 8192 bytes.

* `--log-bin[=base_name]`

<table frame="box" rules="all" summary="Propriedades para log-bin">
  <tr><th>Formato de Linha de Comando</th> <td><code>--log-bin=nome_arquivo</code></td> </tr>
  <tr><th>Tipo</th> <td>Nome do arquivo</td> </tr>
</table>

Especifica o nome base a ser usado para arquivos de log binários. Com o registro binário habilitado, o servidor registra todas as declarações que alteram dados nos logs binários, que são usados para backup e replicação. O log binário é uma sequência de arquivos com um nome base e extensão numérica. O valor da opção `--log-bin` é o nome base para a sequência de logs. O servidor cria arquivos de log binários em sequência, adicionando um sufixo numérico ao nome base.

Se você não fornecer a opção `--log-bin`, o MySQL usa `binlog` como nome base padrão para os arquivos de log binários. Para compatibilidade com versões anteriores, se você fornecer a opção `--log-bin` sem uma string ou com uma string vazia, o nome base será definido como `host_name-bin`, usando o nome da máquina do host.

O local padrão para os arquivos de log binários é o diretório de dados. Você pode usar a opção `--log-bin` para especificar um local alternativo, adicionando um nome de caminho absoluto antes do nome da base para especificar um diretório diferente. Quando o servidor lê uma entrada do arquivo de índice de log binário, que rastreia os arquivos de log binário que foram usados, ele verifica se a entrada contém um caminho relativo. Se estiver presente, a parte relativa do caminho é substituída pelo caminho absoluto definido usando a opção `--log-bin`. Um caminho absoluto registrado no arquivo de índice de log binário permanece inalterado; nesse caso, o arquivo de índice deve ser editado manualmente para permitir que um novo caminho ou caminhos sejam usados. O nome da base do arquivo de log binário e qualquer caminho especificado estão disponíveis como a variável de sistema `log_bin_basename`.

  No MySQL 9.5, o registro binário é ativado por padrão, seja ou não você especificar a opção `--log-bin`. A exceção é se você usar o **mysqld** para inicializar o diretório de dados manualmente, invocando-o com a opção `--initialize` ou `--initialize-insecure`, quando o registro binário está desativado por padrão. É possível ativar o registro binário neste caso, especificando a opção `--log-bin`. Quando o registro binário está ativado, a variável de sistema `log_bin`, que mostra o status do registro binário no servidor, é definida como ON.

  Para desativar o registro binário, você pode especificar a opção `--skip-log-bin` ou `--disable-log-bin` na inicialização. Se qualquer uma dessas opções for especificada e `--log-bin` também for especificada, a opção especificada posteriormente tem precedência. Quando o registro binário está desativado, a variável de sistema `log_bin` é definida como OFF.

Quando os GTIDs estão em uso no servidor, se você desabilitar o registro binário ao reiniciar o servidor após um desligamento anormal, é provável que alguns GTIDs sejam perdidos, causando o falhanço da replicação. Em um desligamento normal, o conjunto de GTIDs do arquivo de log binário atual é salvo na tabela `mysql.gtid_executed`. Após um desligamento anormal em que isso não ocorreu, durante a recuperação, os GTIDs são adicionados à tabela a partir do arquivo de log binário, desde que o registro binário ainda esteja habilitado. Se o registro binário for desabilitado para o reinício do servidor, o servidor não poderá acessar o arquivo de log binário para recuperar os GTIDs, então a replicação não poderá ser iniciada. O registro binário pode ser desabilitado com segurança após um desligamento normal.

As opções `--log-replica-updates` e `--replica-preserve-commit-order` exigem o registro binário. Se você desabilitar o registro binário, omita essas opções ou especifique `--log-replica-updates=OFF` e `--skip-replica-preserve-commit-order`. O MySQL desabilita essas opções por padrão quando `--skip-log-bin` ou `--disable-log-bin` é especificado. Se você especificar `--log-replica-updates` ou `--replica-preserve-commit-order` junto com `--skip-log-bin` ou `--disable-log-bin`, uma mensagem de aviso ou erro é emitida.

O servidor pode ser iniciado com o ID de servidor padrão quando o registro binário está habilitado, mas uma mensagem informativa é emitida se você não especificar um ID de servidor explicitamente ao definir a variável de sistema `server_id`. Para servidores que são usados em uma topologia de replicação, você deve especificar um ID de servidor único e não nulo para cada servidor.

Para informações sobre o formato e a gestão do log binário, consulte a Seção 7.4.4, “O Log Binário”.

* `--log-bin-index[=file_name]`

<table frame="box" rules="all" summary="Propriedades para log-bin-index">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code>--log-bin-index=nome_arquivo</code></td>
  </tr>
  <tr>
    <th>Variável do sistema</th>
    <td><code>log_bin_index</code></td>
  </tr>
  <tr>
    <th>Alcance</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmico</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Hinta de <code>SET_VAR</th></a> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Nome do arquivo</td>
  </tr>
</table>

  O nome do arquivo de índice do log binário, que contém os nomes dos arquivos de log binário. Por padrão, ele tem a mesma localização e nome base que o valor especificado para os arquivos de log binário usando a opção `--log-bin`, mais a extensão `.index`. Se você não especificar `--log-bin`, o nome padrão do arquivo de índice do log binário é `binlog.index`. Se você especificar a opção `--log-bin` sem uma string ou uma string vazia, o nome padrão do arquivo de índice do log binário é `nome_do_host-bin.index`, usando o nome da máquina do host.

  Para informações sobre o formato e a gestão do log binário, consulte a Seção 7.4.4, “O Log Binário”.

**Opções de seleção de declarações.** As opções na lista a seguir afetam quais declarações são escritas no log binário e, portanto, enviadas por um servidor de origem de replicação para suas réplicas. Há também opções para réplicas que controlam quais declarações recebidas da fonte devem ser executadas ou ignoradas. Para detalhes, consulte a Seção 19.1.6.3, “Opções e variáveis do servidor de réplica”.

* `--binlog-do-db=nome_do_banco_de_dados`

<table frame="box" rules="all" summary="Propriedades para binlog-do-db"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--binlog-do-db=nome</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Esta opção afeta o registro binário de maneira semelhante à forma como a opção `--replicate-do-db` afeta a replicação.

  Os efeitos desta opção dependem se o formato de registro baseado em declarações ou baseado em linhas está em uso, da mesma forma que os efeitos de `--replicate-do-db` dependem se a replicação baseada em declarações ou baseada em linhas está em uso. Você deve ter em mente que o formato usado para registrar uma determinada declaração pode não ser necessariamente o mesmo indicado pelo valor de `binlog_format`. Por exemplo, declarações DDL como `CREATE TABLE` e `ALTER TABLE` são sempre registradas como declarações, independentemente do formato de registro em vigor, portanto, as seguintes regras baseadas em declarações para `--binlog-do-db` sempre se aplicam para determinar se a declaração é registrada ou não.

  **Registro baseado em declarações.** Apenas aquelas declarações são escritas no log binário onde o banco de dados padrão (ou seja, aquele selecionado por `USE`) é *`db_name`*. Para especificar mais de um banco de dados, use esta opção várias vezes, uma vez para cada banco de dados; no entanto, fazer isso *não* faz com que declarações entre bancos, como `UPDATE some_db.some_table SET foo='bar'` sejam registradas enquanto um banco de dados diferente (ou nenhum banco de dados) é selecionado.

  Aviso

  Para especificar múltiplos bancos de dados, *você* deve usar múltiplas instâncias desta opção. Como os nomes de banco de dados podem conter vírgulas, a lista é tratada como o nome de um único banco de dados se você fornecer uma lista separada por vírgula.

Um exemplo do que não funciona conforme o esperado ao usar o registro baseado em declarações: Se o servidor for iniciado com `--binlog-do-db=sales` e você emitir as seguintes declarações, a declaração `UPDATE` *não* será registrada:

```
  USE prices;
  UPDATE sales.january SET amount=amount+1000;
  ```

A principal razão desse comportamento "só verifique o banco de dados padrão" é que, a partir da declaração sozinha, é difícil saber se ela deve ser replicada (por exemplo, se você estiver usando declarações `DELETE` de múltiplas tabelas ou declarações `UPDATE` de múltiplas tabelas que atuam em vários bancos de dados). Também é mais rápido verificar apenas o banco de dados padrão em vez de todos os bancos de dados, se não houver necessidade.

Outro caso que pode não ser evidente ocorre quando um determinado banco de dados é replicado, mesmo que não tenha sido especificado ao definir a opção. Se o servidor for iniciado com `--binlog-do-db=sales`, a seguinte declaração `UPDATE` será registrada, mesmo que `prices` não tenha sido incluído ao definir `--binlog-do-db`:

```
  USE sales;
  UPDATE prices.discounts SET percentage = percentage + 10;
  ```

Como `sales` é o banco de dados padrão quando a declaração `UPDATE` é emitida, a `UPDATE` é registrada.

**Registro baseado em linhas.** O registro é restrito ao banco de dados `db_name`. Apenas as alterações em tabelas pertencentes a `db_name` são registradas; o banco de dados padrão não tem efeito sobre isso. Suponha que o servidor seja iniciado com `--binlog-do-db=sales` e o registro baseado em linhas esteja em vigor, e então as seguintes declarações sejam executadas:

```
  USE prices;
  UPDATE sales.february SET amount=amount+100;
  ```

As alterações na tabela `february` no banco de dados `sales` serão registradas de acordo com a declaração `UPDATE`; isso ocorre independentemente de a declaração `USE` ter sido emitida ou não. No entanto, ao usar o formato de registro baseado em linhas e `--binlog-do-db=sales`, as alterações feitas pelas seguintes `UPDATE` não serão registradas:

```
  USE prices;
  UPDATE prices.march SET amount=amount-25;
  ```

Mesmo que a declaração `USE prices` fosse alterada para `USE sales`, os efeitos da declaração `UPDATE` ainda não seriam escritos no log binário.

Outra diferença importante no tratamento da `--binlog-do-db` para o registro baseado em declarações, em oposição ao registro baseado em linhas, ocorre em relação às declarações que se referem a múltiplas bases de dados. Suponha que o servidor seja iniciado com `--binlog-do-db=db1`, e as seguintes declarações sejam executadas:

```
  USE db1;
  UPDATE db1.table1, db2.table2 SET db1.table1.col1 = 10, db2.table2.col2 = 20;
  ```

Se você estiver usando o registro baseado em declarações, as atualizações em ambas as tabelas são escritas no log binário. No entanto, ao usar o formato baseado em linhas, apenas as alterações em `table1` são registradas; `table2` está em uma base de dados diferente, então não é alterada pelo `UPDATE`. Agora, suponha que, em vez da declaração `USE db1`, tivesse sido usada uma declaração `USE db4`:

```
  USE db4;
  UPDATE db1.table1, db2.table2 SET db1.table1.col1 = 10, db2.table2.col2 = 20;
  ```

Neste caso, a declaração `UPDATE` não é escrita no log binário ao usar o registro baseado em declarações. No entanto, ao usar o registro baseado em linhas, a alteração em `table1` é registrada, mas não em `table2`—em outras palavras, apenas as alterações em tabelas na base de dados nomeada por `--binlog-do-db` são registradas, e a escolha da base de dados padrão não tem efeito nesse comportamento.

* `--binlog-ignore-db=db_name`

<table frame="box" rules="all" summary="Propriedades para binlog-ignore-db"><tr><th>Formato de Linha de Comando</th> <td><code>--binlog-ignore-db=name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

Esta opção afeta o registro binário de maneira semelhante à forma como `--replicate-ignore-db` afeta a replicação.

Os efeitos desta opção dependem se o formato de registro baseado em declarações ou baseado em linhas está em uso, da mesma forma que os efeitos de `--replicate-ignore-db` dependem se a replicação baseada em declarações ou baseada em linhas está em uso. Você deve ter em mente que o formato usado para registrar uma determinada declaração pode não ser necessariamente o mesmo indicado pelo valor de `binlog_format`. Por exemplo, declarações DDL como `CREATE TABLE` e `ALTER TABLE` são sempre registradas como declarações, independentemente do formato de registro em vigor, então as seguintes regras de registro baseadas em declarações para `--binlog-ignore-db` sempre se aplicam para determinar se a declaração é registrada ou não.

**Registro baseado em declarações.** Diz ao servidor para não registrar nenhuma declaração onde a base de dados padrão (ou seja, a selecionada por `USE`) é *`db_name`*.

Quando não há base de dados padrão, nenhuma opção `--binlog-ignore-db` é aplicada, e tais declarações são sempre registradas. (Bug #11829838, Bug
#60188)

**Formato baseado em linhas.** Diz ao servidor para não registrar atualizações em nenhuma tabela na base de dados *`db_name`*. A base de dados atual não tem efeito.

Ao usar o registro baseado em declarações, o exemplo seguinte não funciona como você pode esperar. Suponha que o servidor seja iniciado com `--binlog-ignore-db=sales` e você emitir os seguintes comandos:

```
  USE prices;
  UPDATE sales.january SET amount=amount+1000;
  ```

A declaração `UPDATE` *é* registrada nesse caso, porque `--binlog-ignore-db` se aplica apenas ao banco de dados padrão (determinado pela declaração `USE`). Como o banco de dados `sales` foi especificado explicitamente na declaração, a declaração não foi filtrada. No entanto, ao usar o registro baseado em linhas, os efeitos da declaração `UPDATE` *não* são escritos no log binário, o que significa que nenhuma alteração na tabela `sales.january` é registrada; nesse caso, `--binlog-ignore-db=sales` faz com que *todas* as alterações feitas nas tabelas na cópia da fonte do banco de dados `sales` sejam ignoradas para fins de registro binário.

Para especificar mais de um banco de dados a ser ignorado, use essa opção várias vezes, uma vez para cada banco de dados. Como os nomes dos bancos de dados podem conter vírgulas, a lista é tratada como o nome de um único banco de dados se você fornecer uma lista separada por vírgula.

Você não deve usar essa opção se estiver usando atualizações entre bancos e não quiser que essas atualizações sejam registradas.

**Opções de verificação de checksum.** O MySQL suporta leitura e escrita de verificações de checksum do log binário. Essas são habilitadas usando as duas opções listadas aqui:

* `--binlog-checksum={NONE|CRC32}`

<table frame="box" rules="all" summary="Propriedades para binlog-checksum"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--binlog-checksum=type</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>CRC32</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>NONE</code></p><p><code>CRC32</code></p></td> </tr></tbody></table>

Ativação desta opção faz com que a fonte escreva verificações de integridade para eventos escritos no log binário. Defina para `NONE` para desativar ou o nome do algoritmo a ser usado para gerar verificações de integridade; atualmente, apenas verificações de integridade CRC32 são suportadas, e CRC32 é o padrão. Não é possível alterar a configuração desta opção durante uma transação.

Para controlar a leitura de verificações de integridade pela replica (do log de retransmissão), use a opção `--replica-sql-verify-checksum`.

**Opções de teste e depuração.** As seguintes opções de log binário são usadas no teste e depuração de replicação. Elas não são destinadas ao uso em operações normais.

* `--max-binlog-dump-events=N`

  <table frame="box" rules="all" summary="Propriedades para max-binlog-dump-events"><tbody><tr><th>Formato de linha de comando</th> <td><code>--max-binlog-dump-events=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>0</code></td> </tr></tbody></table>

  Esta opção é usada internamente pela suíte de teste MySQL para teste e depuração de replicação.

* `--sporadic-binlog-dump-fail`

  <table frame="box" rules="all" summary="Propriedades para sporadic-binlog-dump-fail"><tbody><tr><th>Formato de linha de comando</th> <td><code>--sporadic-binlog-dump-fail[={OFF|ON}]</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Esta opção é usada internamente pela suíte de teste MySQL para teste e depuração de replicação.

##### Variáveis de sistema usadas com log binário

A lista a seguir descreve as variáveis de sistema para controlar o registro binário. Elas podem ser definidas na inicialização do servidor e algumas podem ser alteradas em tempo de execução usando `SET`. As opções do servidor usadas para controlar o registro binário estão listadas anteriormente nesta seção.

* `binlog_cache_size`

  <table frame="box" rules="all" summary="Propriedades para binlog_cache_size"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--binlog-cache-size=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>binlog_cache_size</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>32768</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>4096</code></td> </tr><tr><th>Valor Máximo (Plataformas de 64 bits)</th> <td><code>18446744073709547520</code></td> </tr><tr><th>Valor Máximo (Plataformas de 32 bits)</th> <td><code>4294963200</code></td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr><tr><th>Tamanho do Bloco</th> <td><code>4096</code></td> </tr></tbody></table>

  O tamanho do buffer de memória para armazenar as alterações no log binário durante uma transação.

Quando o registro binário é habilitado no servidor (com a variável de sistema `log_bin` definida como ON), um cache de log binário é alocado para cada cliente, se o servidor suportar quaisquer motores de armazenamento transacionais. Se os dados da transação ultrapassarem o espaço no buffer de memória, os dados em excesso são armazenados em um arquivo temporário. Quando a criptografia do log binário está ativa no servidor, o buffer de memória não é criptografado, mas qualquer arquivo temporário usado para armazenar o cache de log binário é criptografado. Após cada transação ser confirmada, o cache de log binário é redefinido, limpando o buffer de memória e truncando o arquivo temporário, se usado.

Se você usa frequentemente transações grandes, pode aumentar esse tamanho de cache para obter um melhor desempenho, reduzindo ou eliminando a necessidade de gravar em arquivos temporários. As variáveis de status `Binlog_cache_use` e `Binlog_cache_disk_use` podem ser úteis para ajustar o tamanho dessa variável. Consulte a Seção 7.4.4, “O Log Binário”.

`binlog_cache_size` define o tamanho do cache de transação apenas; o tamanho do cache de declarações é regido pela variável de sistema `binlog_stmt_cache_size`.

* `binlog_checksum`

<table frame="box" rules="all" summary="Propriedades para binlog_checksum"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--binlog-checksum=type</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>binlog_checksum</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Dicas de Configuração de Variáveis</a> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>CRC32</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>NONE</code></p><p><code>CRC32</code></p></td> </tr></tbody></table>

  Quando habilitado, essa variável faz com que a fonte escreva um checksum para cada evento no log binário. `binlog_checksum` suporta os valores `NONE` (que desabilita os checksums) e `CRC32`. O valor padrão é `CRC32`. Quando `binlog_checksum` é desabilitado (valor `NONE`), o servidor verifica se está escrevendo apenas eventos completos no log binário, escrevendo e verificando o comprimento do evento (em vez de um checksum) para cada evento.

  Definir essa variável na fonte para um valor não reconhecido pela replica faz com que a replica defina seu próprio valor de `binlog_checksum` para `NONE` e pare a replicação com um erro. Se a compatibilidade reversa com réplicas mais antigas for uma preocupação, você pode querer definir o valor explicitamente para `NONE`.

  A Replicação em Grupo no MySQL 9.5 suporta checksums, então os membros do grupo podem usar o ajuste padrão.

A alteração do valor de `binlog_checksum` faz com que o log binário seja rotado, pois os checksums devem ser escritos para um arquivo binário de log inteiro, e nunca apenas para parte dele. Você não pode alterar o valor de `binlog_checksum` dentro de uma transação.

Quando a compressão de transações de log binário é habilitada usando a variável de sistema `binlog_transaction_compression`, os checksums não são escritos para eventos individuais em um payload de transação comprimida. Em vez disso, um checksum é escrito para o evento GTID e um checksum para o payload comprimido do evento `Transaction_payload`.

* `binlog_direct_non_transactional_updates`

  <table frame="box" rules="all" summary="Propriedades para log-bin"><tbody><tr><th>Formato de linha de comando</th> <td><code>--log-bin=file_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  Devido a problemas de concorrência, uma replica pode se tornar inconsistente quando uma transação contém atualizações tanto em tabelas transacionais quanto não transacionais. O MySQL tenta preservar a causalidade entre essas declarações escrevendo declarações não transacionais no cache de transação, que é descartado após o commit. No entanto, problemas surgem quando as modificações feitas em tabelas não transacionais em nome de uma transação tornam-se imediatamente visíveis para outras conexões porque essas mudanças podem não ser escritas imediatamente no log binário.

  A variável `binlog_direct_non_transactional_updates` oferece uma solução possível para esse problema. Por padrão, essa variável está desabilitada. Habilitar `binlog_direct_non_transactional_updates` faz com que as atualizações em tabelas não transacionais sejam escritas diretamente no log binário, em vez de no cache de transação.

Definir o valor da variável de sessão desta variável do sistema é uma operação restrita. O usuário da sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Consulte a Seção 7.1.9.1, “Privilégios de Variáveis do Sistema”.

* `binlog_direct_non_transactional_updates` funciona apenas para instruções que são replicadas usando o formato de log binário baseado em instruções*; ou seja, funciona apenas quando o valor de `binlog_format` é `STATEMENT`, ou quando `binlog_format` é `MIXED` e uma determinada instrução está sendo replicada usando o formato baseado em instruções. Esta variável não tem efeito quando o formato do log binário é `ROW`, ou quando `binlog_format` é definido como `MIXED` e uma determinada instrução está sendo replicada usando o formato baseado em linhas.

  Importante

  Antes de habilitar esta variável, você deve garantir que não haja dependências entre tabelas transacionais e não transacionais; um exemplo de tal dependência seria a instrução `INSERT INTO myisam_table SELECT * FROM innodb_table`. Caso contrário, tais instruções provavelmente causarão que a replica se desvie da fonte.

  Esta variável não tem efeito quando o formato do log binário é `ROW` ou `MIXED`.

* `binlog_encryption`

  <table frame="box" rules="all" summary="Propriedades para log-bin"><tr><th>Formato de Linha de Comando</th> <td><code>--log-bin=file_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

Habilita a criptografia para arquivos de log binários e arquivos de log de retransmissão neste servidor. `OFF` é o padrão. `ON` habilita a criptografia para arquivos de log binários e arquivos de log de retransmissão. O registro binário não precisa ser habilitado no servidor para habilitar a criptografia, então você pode criptografar os arquivos de log de retransmissão em uma replica que não tenha arquivos de log binários. Para usar a criptografia, um plugin de chaveira deve ser instalado e configurado para fornecer o serviço de chaveira do MySQL Server. Para obter instruções sobre como fazer isso, consulte a Seção 8.4.5, “A Chaveira MySQL”. Qualquer plugin de chaveira suportado pode ser usado para armazenar as chaves de criptografia dos arquivos de log binários.

Quando você inicia o servidor pela primeira vez com a criptografia de log binário habilitada, uma nova chave de criptografia de log binário é gerada antes que os logs binários e de retransmissão sejam inicializados. Esta chave é usada para criptografar uma senha de arquivo para cada arquivo de log binário (se o servidor tiver registro binário habilitado) e arquivo de log de retransmissão (se o servidor tiver canais de replicação), e chaves geradas a partir das senhas de arquivo são usadas para criptografar os dados nos arquivos. Os arquivos de log de retransmissão são criptografados para todos os canais, incluindo canais de aplicação da replicação de grupo e novos canais que são criados após a criptografia ser ativada. O arquivo de índice de log binário e o arquivo de índice de log de retransmissão nunca são criptografados.

Se você ativar o criptoamento enquanto o servidor estiver em execução, uma nova chave de criptoamento do log binário será gerada naquela época. A exceção é se o criptoamento estiver ativo anteriormente no servidor e depois desativado, caso em que a chave de criptoamento do log binário que estava em uso antes é usada novamente. O arquivo de log binário e os arquivos de log de retransmissão são rotados imediatamente, e as senhas dos arquivos são criptografadas usando essa chave de criptoamento do log binário. Arquivos de log binário e arquivos de log de retransmissão existentes ainda presentes no servidor não são criptografados automaticamente, mas você pode excluí-los se não forem mais necessários.

Se você desativar o criptoamento alterando a variável de sistema `binlog_encryption` para `OFF`, o arquivo de log binário e os arquivos de log de retransmissão são rotados imediatamente e toda a logon subsequente fica não criptografada. Arquivos criptografados anteriormente não são automaticamente descriptografados, mas o servidor ainda é capaz de lê-los. O privilégio `BINLOG_ENCRYPTION_ADMIN` (ou o desatualizado privilégio `SUPER`) é necessário para ativar ou desativar o criptoamento enquanto o servidor estiver em execução. Os canais de aplicação da replicação em grupo não são incluídos na solicitação de rotação do log de retransmissão, então a logon não criptografada para esses canais não começa até que seus logs sejam rotados no uso normal.

Para mais informações sobre criptografia de arquivos de log binário e arquivos de log de retransmissão, consulte a Seção 19.3.2, “Criptografar Arquivos de Log Binário e Arquivos de Log de Retransmissão”.

* `binlog_error_action`

Controla o que acontece quando o servidor encontra um erro, como não conseguir escrever, esvaziar ou sincronizar o log binário, o que pode fazer com que o log binário da fonte se torne inconsistente e as réplicas percam a sincronização.

Esta variável tem o valor padrão `ABORT_SERVER`, que faz o servidor parar de registrar e desligar sempre que encontrar tal erro no log binário. Na reinicialização, a recuperação prossegue como no caso de uma parada inesperada do servidor (consulte a Seção 19.4.2, “Tratamento de uma Parada Inesperada de uma Réplica”).

Quando `binlog_error_action` é definido como `IGNORE_ERROR`, se o servidor encontrar tal erro, ele continua a transação em andamento, registra o erro e depois para de registrar, continuando a realizar atualizações. Para retomar o registro binário, `log_bin` deve ser habilitado novamente, o que requer uma reinicialização do servidor. Esta configuração oferece compatibilidade reversa com versões mais antigas do MySQL.

* `binlog_expire_logs_seconds`

  <table frame="box" rules="all" summary="Propriedades para log-bin"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--log-bin=file_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  Define o período de expiração do log binário em segundos. Após o término do período de expiração, os arquivos do log binário podem ser removidos automaticamente. As remoções podem ocorrer automaticamente ao iniciar e quando o log binário é esvaziado. O esvaziamento do log ocorre conforme indicado na Seção 7.4, “Logs do Servidor MySQL”.

  O período padrão de expiração do log binário é de 2592000 segundos, o que equivale a 30 dias (30\*24\*60\*60 segundos).

  A limpeza automática do log binário pode ser desativada definindo a variável de sistema `binlog_expire_logs_auto_purge` para `OFF`. Isso tem precedência sobre qualquer configuração para `binlog_expire_logs_seconds`.

Para remover arquivos de log binários manualmente, use a instrução `PURGE BINARY LOGS`. Veja a Seção 15.4.1.1, “Instrução PURGE BINARY LOGS”.

* `binlog_expire_logs_auto_purge`

  <table frame="box" rules="all" summary="Propriedades para log-bin"><tbody><tr><th>Formato de linha de comando</th> <td><code>--log-bin=file_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  Habilita ou desabilita a purga automática de arquivos de log binários. Definir essa variável para `ON` (o padrão) habilita a purga automática; definí-la para `OFF` desabilita a purga automática. O intervalo de espera antes da purga é controlado por `binlog_expire_logs_seconds`.

  Nota

  Mesmo que `binlog_expire_logs_auto_purge` esteja em `ON`, definir `binlog_expire_logs_seconds` para `0` para impedir que a purga automática ocorra.

  Esta variável não tem efeito sobre `PURGE BINARY LOGS`.

* `binlog_format`

  <table frame="box" rules="all" summary="Propriedades para log-bin"><tbody><tr><th>Formato de linha de comando</th> <td><code>--log-bin=file_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  Esta variável de sistema define o formato de log binário e pode ser qualquer um dos formatos `STATEMENT`, `ROW` ou `MIXED`. (Veja a Seção 19.2.1, “Formatos de replicação”.) A configuração entra em vigor quando o registro binário é habilitado no servidor, o que é o caso quando a variável de sistema `log_bin` é definida como `ON`. No MySQL 9.5, o registro binário é habilitado por padrão e, por padrão, usa o formato baseado em linha.

  Nota

`binlog_format` está desatualizado e está sujeito à remoção em uma futura versão do MySQL. Isso implica que o suporte para formatos de registro diferentes do baseado em linhas também está sujeito à remoção em uma futura versão. Assim, apenas o registro baseado em linhas deve ser empregado para quaisquer novas configurações de replicação do MySQL.

`binlog_format` pode ser definido no início ou durante o runtime, exceto que, sob certas condições, alterar essa variável durante o runtime não é possível ou causa falha na replicação, conforme descrito mais adiante.

O padrão é `ROW`. *Exceção*: No NDB Cluster, o padrão é `MIXED`; a replicação baseada em declarações não é suportada para o NDB Cluster.

Definir o valor da variável de sessão desta variável é uma operação restrita. O usuário da sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Consulte a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”.

As regras que regem quando as alterações nesta variável entram em vigor e por quanto tempo o efeito dura são as mesmas que para outras variáveis de sistema do servidor MySQL. Para mais informações, consulte a Seção 15.7.6.1, “Sintaxe SET para Atribuição de Variáveis”.

Quando `MIXED` é especificado, a replicação baseada em declarações é usada, exceto em casos em que apenas a replicação baseada em linhas garanta resultados adequados. Por exemplo, isso acontece quando as declarações contêm funções carregáveis ou a função `UUID()`.

Para detalhes de como os programas armazenados (procedimentos e funções armazenados, gatilhos e eventos) são tratados quando cada formato de registro binário é definido, consulte a Seção 27.9, “Registro Binário de Programas Armazenados”.

Existem exceções quando não é possível alternar o formato de replicação durante o runtime:

+ O formato de replicação não pode ser alterado dentro de uma função armazenada ou um gatilho.

+ Se uma sessão tiver tabelas temporárias abertas, o formato de replicação não pode ser alterado para a sessão (`SET @@SESSION.binlog_format`).

+ Se qualquer canal de replicação tiver tabelas temporárias abertas, o formato de replicação não pode ser alterado globalmente (`SET @@GLOBAL.binlog_format` ou `SET @@PERSIST.binlog_format`).

+ Se qualquer fio de aplicação do canal de replicação estiver em execução, o formato de replicação não pode ser alterado globalmente (`SET @@GLOBAL.binlog_format` ou `SET @@PERSIST.binlog_format`).

+ Tentar alterar o formato de replicação em qualquer um desses casos (ou tentar definir o formato de replicação atual) resulta em um erro. No entanto, você pode usar `PERSIST_ONLY` (`SET @@PERSIST_ONLY.binlog_format`) para alterar o formato de replicação a qualquer momento, pois essa ação não modifica o valor da variável global do sistema em tempo de execução e só se torna efetiva após o reinício do servidor.

+ Alterar o formato de registro em um servidor de origem de replicação não faz com que a replica altere seu formato de registro. Alterar o formato de registro em um servidor de origem de replicação enquanto a replica está em execução pode causar problemas se a replica tiver log de binário habilitado e a mudança resultar na replica usar o registro `STATEMENT` enquanto a fonte usa o registro `ROW` ou `MIXED`. A replica não é capaz de converter entradas de log binário recebidas no formato de registro `ROW` para o formato `STATEMENT` para uso em seu próprio log binário, então essa situação pode causar falha na replicação. Para mais informações, consulte a Seção 7.4.4.2, “Definindo o Formato do Log Binário”.

O formato do log binário afeta o comportamento das seguintes opções do servidor:

  + `--replicate-do-db`
  + `--replicate-ignore-db`
  + `--binlog-do-db`
  + `--binlog-ignore-db`

  Esses efeitos são discutidos em detalhes nas descrições das opções individuais.

* `binlog_group_commit_sync_delay`

  <table frame="box" rules="all" summary="Propriedades para log-bin">
    
    <tbody>
      <tr><th>Formato de Linha de Comando</th> <td><code>--log-bin=file_name</code></td> </tr>
      <tr><th>Tipo</th> <td>Nome do arquivo</td> </tr>
    </tbody>
  </table>

  Controla quantos microsegundos o log binário de commit espera antes de sincronizar o arquivo do log binário com o disco. Por padrão, `binlog_group_commit_sync_delay` é definido para 0, o que significa que não há atraso. Definir `binlog_group_commit_sync_delay` com um atraso em microsegundos permite que mais transações sejam sincronizadas juntas com o disco de uma vez, reduzindo o tempo total para confirmar um grupo de transações, pois os grupos maiores requerem menos unidades de tempo por grupo.

  Quando `sync_binlog=0` ou `sync_binlog=1` é definido, o atraso especificado por `binlog_group_commit_sync_delay` é aplicado para cada grupo de commit do log binário antes da sincronização (ou, no caso de `sync_binlog=0`, antes de prosseguir). Quando `sync_binlog` é definido para um valor *n* maior que 1, o atraso é aplicado após cada *n* grupos de commit do log binário.

  Definir `binlog_group_commit_sync_delay` pode aumentar o número de transações de commit paralelas em qualquer servidor que tenha (ou possa ter após uma falha de replicação) uma replica, e, portanto, pode aumentar a execução paralela nas réplicas. É importante levar em consideração o throughput da fonte e da replica ao definir `binlog_group_commit_sync_delay`.

Definir `binlog_group_commit_sync_delay` também pode reduzir o número de chamadas `fsync()` ao log binário em qualquer servidor (fonte ou replica) que tenha um log binário.

Lembre-se de que definir `binlog_group_commit_sync_delay` aumenta a latência das transações no servidor, o que pode afetar as aplicações cliente. Além disso, em cargas de trabalho altamente concorrentes, é possível que o atraso aumente a concorrência e, portanto, reduza o desempenho. Normalmente, os benefícios de definir um atraso superam os inconvenientes, mas a regulagem sempre deve ser realizada para determinar o ajuste ótimo.

* `binlog_group_commit_sync_no_delay_count`

  <table frame="box" rules="all" summary="Propriedades para log-bin"><tbody><tr><th>Formato de linha de comando</th> <td><code>--log-bin=nome_do_arquivo</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  O número máximo de transações a serem esperadas antes de abortar o atraso atual, conforme especificado por `binlog_group_commit_sync_delay`. Se `binlog_group_commit_sync_delay` for definido como 0, então essa opção não tem efeito.

* `binlog_max_flush_queue_time`

  <table frame="box" rules="all" summary="Propriedades para log-bin"><tbody><tr><th>Formato de linha de comando</th> <td><code>--log-bin=nome_do_arquivo</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  `binlog_max_flush_queue_time` está desatualizado e está marcado para eventual remoção em uma futura versão do MySQL. Anteriormente, essa variável de sistema controlava o tempo em microsegundos para continuar lendo transações da fila de esvaziamento antes de prosseguir com o commit do grupo. Ela não tem mais efeito.

* `binlog_order_commits`

<table frame="box" rules="all" summary="Propriedades para log-bin">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--log-bin=nome_arquivo</code></td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Nome do arquivo</td>
  </tr>
  </tbody>
</table>

9

  Quando essa variável é habilitada em um servidor de fonte de replicação (o que é o padrão), as instruções de commit de transações emitidas para os motores de armazenamento são serializadas em um único thread, de modo que as transações são sempre comprometidas na mesma ordem em que são escritas no log binário. Desabilitar essa variável permite que as instruções de commit de transações sejam emitidas usando múltiplos threads. Usada em combinação com o commit de grupo de log binário, isso previne que a taxa de commit de uma única transação seja um gargalo para o desempenho e, portanto, pode produzir uma melhoria no desempenho.

  As transações são escritas no log binário no ponto em que todos os motores de armazenamento envolvidos confirmaram que a transação está pronta para ser comprometida. A lógica de commit de grupo de log binário então compromete um grupo de transações após sua escrita no log binário ter ocorrido. Quando `binlog_order_commits` é desativado, porque múltiplos threads são usados para esse processo, as transações em um grupo de commit podem ser comprometidas em uma ordem diferente da ordem em que estão no log binário. (As transações de um único cliente sempre são comprometidas em ordem cronológica.) Em muitos casos, isso não importa, pois as operações realizadas em transações separadas devem produzir resultados consistentes, e se isso não for o caso, uma única transação deve ser usada.

  Se você deseja garantir que o histórico de transações na fonte e na replica multithread permaneça idêntico, defina `replica_preserve_commit_order=1` na replica.

* `binlog_rotate_encryption_master_key_at_startup`

<table frame="box" rules="all" summary="Propriedades para log-bin-index"><tr><th>Formato de linha de comando</th> <td><code>--log-bin-index=nome_do_arquivo</code></td> </tr><tr><th>Variável do sistema</th> <td><code>log_bin_index</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></table>

Especifica se a chave mestre do log binário deve ser rotacionada ao iniciar o servidor. A chave mestre do log binário é a chave de criptografia do log binário que é usada para criptografar senhas de arquivo dos arquivos de log binário e de log de retransmissão no servidor. Quando um servidor é iniciado pela primeira vez com a criptografia do log binário habilitada (`binlog_encryption=ON`), uma nova chave de criptografia do log binário é gerada e usada como a chave mestre do log binário. Se a variável de sistema `binlog_rotate_encryption_master_key_at_startup` também for definida como `ON`, sempre que o servidor for reiniciado, uma nova chave de criptografia do log binário é gerada e usada como a chave mestre do log binário para todos os arquivos de log binário e arquivos de log de retransmissão subsequentes. Se a variável de sistema `binlog_rotate_encryption_master_key_at_startup` for definida como `OFF`, que é o padrão, a chave mestre do log binário existente é usada novamente após o servidor ser reiniciado. Para obter mais informações sobre as chaves de criptografia do log binário e a chave mestre do log binário, consulte a Seção 19.3.2, “Criptografando Arquivos de Log Binário e Arquivos de Log de Retransmissão”.

* `binlog_row_event_max_size`

Quando o registro binário baseado em linhas é usado, essa configuração é um limite suave do tamanho máximo de um evento de registro binário baseado em linhas, em bytes. Sempre que possível, as linhas armazenadas no log binário são agrupadas em eventos com um tamanho não superior ao valor dessa configuração. Se um evento não puder ser dividido, o tamanho máximo pode ser excedido. O valor padrão é de 8192 bytes.

Esta variável de sistema global é de leitura somente e pode ser definida apenas no início da inicialização do servidor. Seu valor só pode ser modificado usando a palavra-chave `PERSIST_ONLY` ou o qualificador `@@persist_only` com a instrução `SET`.

* `binlog_row_image`

  <table frame="box" rules="all" summary="Propriedades para log-bin-index"><tr><th>Formato de Linha de Comando</th> <td><code>--log-bin-index=file_name</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>log_bin_index</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  Para a replicação baseada em linhas do MySQL, essa variável determina como as imagens das linhas são escritas no log binário.

Definir o valor da sessão dessa variável de sistema é uma operação restrita. O usuário da sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Veja a Seção 7.1.9.1, “Privilégios de Variáveis de Sessão”.

Na replicação baseada em linhas do MySQL, cada evento de mudança de linha contém duas imagens, uma imagem "antes" cujas colunas são comparadas ao buscar a linha a ser atualizada, e uma imagem "depois" contendo as alterações. Normalmente, o MySQL registra linhas completas (ou seja, todas as colunas) tanto para as imagens antes quanto depois. No entanto, não é estritamente necessário incluir todas as colunas em ambas as imagens, e muitas vezes podemos economizar espaço em disco, memória e uso de rede ao registrar apenas as colunas que são realmente necessárias.

Nota

Ao excluir uma linha, apenas a imagem antes é registrada, uma vez que não há valores alterados a serem propagados após a exclusão. Ao inserir uma linha, apenas a imagem depois é registrada, uma vez que não há uma linha existente a ser correspondida. Somente ao atualizar uma linha são necessárias ambas as imagens, antes e depois, e ambas são escritas no log binário.

Para a imagem antes, é necessário apenas que o conjunto mínimo de colunas necessário para identificar linhas de forma única seja registrado. Se a tabela que contém a linha tiver uma chave primária, então apenas a(s) coluna(s) da chave primária é(m) escrita(s) no log binário. Caso contrário, se a tabela tiver uma chave única cujas colunas são `NOT NULL`, então apenas as colunas da chave única precisam ser registradas. (Se a tabela não tiver uma chave primária nem uma chave única sem nenhuma coluna `NULL`, então todas as colunas devem ser usadas na imagem antes e registradas.) Na imagem depois, é necessário registrar apenas as colunas que realmente mudaram.

Você pode fazer o servidor registrar linhas completas ou mínimas usando a variável de sistema `binlog_row_image`. Essa variável na verdade assume um dos três valores possíveis, conforme mostrado na seguinte lista:

+ `full`: Registre todas as colunas tanto na imagem antes quanto na imagem depois.

+ `minimal`: Registre apenas as colunas na imagem anterior que são necessárias para identificar a linha a ser alterada; registre apenas as colunas na imagem após que um valor foi especificado pelo comando SQL ou gerado pelo autoincremento.

  + `noblob`: Registre todas as colunas (mesmo que `full`), exceto as colunas `BLOB` e `TEXT` que não são necessárias para identificar linhas ou que não foram alteradas.

  Observação

  Esta variável não é suportada pelo NDB Cluster; definir-a não tem efeito no registro de tabelas `NDB`.

  O valor padrão é `full`.

  Observação

  Se `binlog_row_image` estiver definido como `full` na fonte e `minimal` na replica, o evento de log binário da replica contém a imagem após a linha completa, mesmo que apenas um valor de coluna mude.

  Ao usar `minimal` ou `noblob`, as deletarizações e atualizações são garantidas para funcionar corretamente para uma determinada tabela se e somente se as seguintes condições forem verdadeiras tanto para as tabelas de origem quanto de destino:

  + Todas as colunas devem estar presentes e na mesma ordem; cada coluna deve usar o mesmo tipo de dado que sua contraparte na outra tabela.

  + As tabelas devem ter definições de chave primária idênticas.

  (Em outras palavras, as tabelas devem ser idênticas, com a possível exceção de índices que não fazem parte das chaves primárias das tabelas.)

  Se essas condições não forem atendidas, é possível que os valores das colunas da chave primária na tabela de destino possam se mostrar insuficientes para fornecer uma correspondência única para uma deletarização ou atualização. Nesse caso, nenhum aviso ou erro é emitido; a fonte e a replica divergem silenciosamente, assim quebrando a consistência.

Definir essa variável não tem efeito quando o formato de registro binário é `STATEMENT`. Quando `binlog_format` é `MIXED`, o ajuste para `binlog_row_image` é aplicado a alterações registradas usando o formato baseado em linhas, mas essa configuração não tem efeito em alterações registradas como declarações.

Definir `binlog_row_image` no nível global ou de sessão não causa um commit implícito; isso significa que essa variável pode ser alterada enquanto uma transação está em andamento sem afetar a transação.

* `binlog_row_metadata`

  <table frame="box" rules="all" summary="Propriedades para log-bin-index"><tr><th>Formato de Linha de Comando</th> <td><code>--log-bin-index=file_name</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>log_bin_index</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  Configura a quantidade de metadados da tabela adicionados ao log binário ao usar o registro baseado em linhas. Quando definido como `MINIMAL`, o padrão, apenas metadados relacionados aos flags `SIGNED`, conjunto de caracteres da coluna e tipos de geometria são registrados. Quando definido como `FULL`, metadados completos para tabelas são registrados, como o nome da coluna, valores de string `ENUM` ou `SET`, informações de `PRIMARY KEY`, e assim por diante.

Os metadados estendidos servem aos seguintes propósitos:

+ As réplicas usam os metadados para transferir dados quando a estrutura da tabela é diferente da do banco de origem.

* `binlog_row_value_options`

  <table frame="box" rules="all" summary="Propriedades para log-bin-index"><tr><th>Formato de linha de comando</th> <td><code>--log-bin-index=nome_do_arquivo</code></td> </tr><tr><th>Variável do sistema</th> <td><code>log_bin_index</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Dica de sintaxe SET_VAR Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></table>

  Quando definido como `PARTIAL_JSON`, permite o uso de um formato de log binário eficiente em termos de espaço para atualizações que modificam apenas uma pequena parte de um documento JSON, o que faz com que a replicação baseada em linhas escreva apenas as partes modificadas do documento JSON na imagem posterior para a atualização no log binário, em vez de escrever o documento completo (veja Atualizações Parciais de Valores JSON). Isso funciona para uma declaração `UPDATE` que modifica uma coluna JSON usando qualquer sequência de `JSON_SET()`, `JSON_REPLACE()` e `JSON_REMOVE()`. Se o servidor não conseguir gerar uma atualização parcial, o documento completo é usado.

  O valor padrão é uma string vazia, que desabilita o uso do formato. Para desabilitar `binlog_row_value_options` e reverter para a escrita do documento JSON completo, defina seu valor para a string vazia.

Definir o valor da variável de sessão desta variável de sistema é uma operação restrita. O usuário da sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Consulte a Seção 7.1.9.1, “Privilégios de variáveis de sistema”.

`binlog_row_value_options=PARTIAL_JSON` só tem efeito quando o registro binário está habilitado e `binlog_format` está definido como `ROW` ou `MIXED`. A replicação baseada em declarações *sempre* registra apenas as partes modificadas do documento JSON, independentemente de qualquer valor definido para `binlog_row_value_options`. Para maximizar a quantidade de espaço economizado, use `binlog_row_image=NOBLOB` ou `binlog_row_image=MINIMAL` junto com esta opção. `binlog_row_image=FULL` economiza menos espaço do que qualquer uma dessas opções, pois o documento JSON completo é armazenado na imagem anterior, e a atualização parcial é armazenada apenas na imagem posterior.

A saída do **mysqlbinlog** inclui atualizações JSON parciais na forma de eventos codificados como strings base64 usando declarações `BINLOG`. Se a opção `--verbose` for especificada, o **mysqlbinlog** exibe as atualizações JSON parciais como JSON legíveis usando declarações pseudo-SQL.

A replicação MySQL gera um erro se uma modificação não puder ser aplicada ao documento JSON na replica. Isso inclui a falha em encontrar o caminho. Esteja ciente de que, mesmo com esta e outras verificações de segurança, se um documento JSON em uma replica divergir do documento em origem e uma atualização parcial for aplicada, ainda é teoricamente possível produzir um documento JSON válido, mas inesperado, na replica.

* `binlog_rows_query_log_events`

<table frame="box" rules="all" summary="Propriedades para log-bin-index">
  <tr><th>Formato de Linha de Comando</th> <td><code>--log-bin-index=nome_arquivo</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code>log_bin_index</code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Não</td> </tr>
  <tr><th>Hinta de <code>SET_VAR</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Nome do arquivo</td> </tr>
</table>

  Esta variável do sistema afeta apenas o registro baseado em linhas. Quando habilitada, faz com que o servidor escreva eventos de log informativos, como eventos de log de consultas de linha, em seu log binário. Essas informações podem ser usadas para depuração e fins relacionados, como obter a consulta original emitida na fonte quando não puder ser reconstruída a partir das atualizações de linha.

  Definir o valor da sessão desta variável do sistema é uma operação restrita. O usuário da sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Consulte a Seção 7.1.9.1, “Privilégios de variáveis de sessão”.

  Esses eventos informativos são normalmente ignorados pelos programas do MySQL que leem o log binário e, portanto, não causam problemas ao replicar ou restaurar de backup. Para visualizá-los, aumente o nível de verbosidade usando a opção `--verbose` do mysqlbinlog duas vezes, seja como `-vv` ou `--verbose --verbose`.

* `binlog_stmt_cache_size`

<table frame="box" rules="all" summary="Propriedades para log-bin-index"><tr><th>Formato de Linha de Comando</th> <td><code>--log-bin-index=nome_arquivo</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>log_bin_index</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></table>

  O tamanho do buffer de memória para o log binário armazenar declarações não transacionais emitidas durante uma transação.

  Quando o registro binário é habilitado no servidor (com a variável de sistema `log_bin` definida como ON), caches separados de transações e declarações de registro binário são alocados para cada cliente, se o servidor suportar quaisquer motores de armazenamento transacionais. Se os dados das declarações não transacionais usadas na transação excederem o espaço no buffer de memória, os dados em excesso são armazenados em um arquivo temporário. Quando a criptografia do log binário está ativa no servidor, o buffer de memória não é criptografado, mas qualquer arquivo temporário usado para armazenar o cache do log binário é criptografado. Após cada transação ser confirmada, o cache de declarações do registro binário é redefinido, limpando o buffer de memória e truncando o arquivo temporário, se usado.

Se você usa frequentemente declarações grandes não transacionais durante as transações, pode aumentar esse tamanho de cache para obter um melhor desempenho, reduzindo ou eliminando a necessidade de gravar em arquivos temporários. As variáveis de status `Binlog_stmt_cache_use` e `Binlog_stmt_cache_disk_use` podem ser úteis para ajustar o tamanho dessa variável. Veja a Seção 7.4.4, “O Log Binário”.

A variável de sistema `binlog_cache_size` define o tamanho do cache de transações.

* `binlog_transaction_compression`

  <table frame="box" rules="all" summary="Propriedades para log-bin-index"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--log-bin-index=file_name</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>log_bin_index</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  Habilita a compressão para transações que são escritas em arquivos de log binário neste servidor. `OFF` é o padrão. Use a variável de sistema `binlog_transaction_compression_level_zstd` para definir o nível do algoritmo `zstd` usado para compressão.

Definir `binlog_transaction_compression` não tem efeito imediato, mas se aplica a todas as declarações subsequentes de `START REPLICA`.

Quando a compressão de transações de log binário está habilitada, os payloads das transações são comprimidos e então escritos no arquivo de log binário como um único evento (`Transaction_payload_event`). Os payloads de transações comprimidos permanecem em estado comprimido enquanto são enviados na corrente de replicação para réplicas, outros membros do grupo de replicação do grupo ou clientes como **mysqlbinlog**, e são escritos no log de retransmissão ainda em seu estado comprimido. A compressão de transações de log binário, portanto, economiza espaço de armazenamento tanto no remetente da transação quanto no destinatário (e para seus backups), e economiza largura de banda de rede quando as transações são enviadas entre instâncias do servidor.

Para que `binlog_transaction_compression=ON` tenha um efeito direto, o registro binário deve estar habilitado no servidor. Quando uma instância de servidor MySQL 9.5 não tem um log binário, ela pode receber, manipular e exibir payloads de transações comprimidos, independentemente de seu valor para `binlog_transaction_compression`. Os payloads de transações comprimidos recebidos por tais instâncias de servidor são escritos em seu estado comprimido no log de retransmissão, então eles se beneficiam indiretamente da compressão realizada por outros servidores na topologia de replicação.

Esta variável de sistema não pode ser alterada dentro do contexto de uma transação. Definir o valor da sessão desta variável de sistema é uma operação restrita. O usuário da sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Veja a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”.

Para mais informações sobre a compressão de transações de log binário, incluindo detalhes sobre quais eventos são e não são comprimidos, e mudanças no comportamento quando a compressão de transações está em uso, consulte a Seção 7.4.4.5, “Compressão de Transações de Log Binário”.

Você pode usar a variável de sistema `ndb_log_transaction_compression` para habilitar esse recurso para o `NDB`. Além disso, definir `--binlog-transaction-compression=ON` na linha de comando ou em um arquivo `my.cnf` faz com que `ndb_log_transaction_compression` seja habilitado na inicialização do servidor. Veja a descrição da variável para obter mais informações.

* `binlog_transaction_compression_level_zstd`

  <table frame="box" rules="all" summary="Propriedades para log-bin-index"><tr><th>Formato de Linha de Comando</th> <td><code>--log-bin-index=file_name</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>log_bin_index</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Dica de Sintaxe de Configuração</th> <td><code>SET_VAR</code></a> Aplica-se</td> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  Define o nível de compressão para a compressão de transações de log binário neste servidor, que é habilitado pela variável de sistema `binlog_transaction_compression`. O valor é um inteiro que determina o esforço de compressão, de 1 (o menor esforço) a 22 (o maior esforço). Se você não especificar essa variável de sistema, o nível de compressão é definido para 3.

  Definir `binlog_transaction_compression_level_zstd` não tem efeito imediato, mas aplica-se a todas as declarações subsequentes de `START REPLICA`.

À medida que o nível de compressão aumenta, a proporção de compressão de dados também aumenta, o que reduz o espaço de armazenamento e a largura de banda da rede necessárias para o payload da transação. No entanto, o esforço necessário para a compressão de dados também aumenta, consumindo tempo e recursos de CPU e memória no servidor de origem. Aumentos no esforço de compressão não têm uma relação linear com aumentos na proporção de compressão de dados.

Esta variável de sistema não pode ser alterada no contexto de uma transação. Definir o valor da sessão desta variável de sistema é uma operação restrita. O usuário da sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Consulte a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”.

Esta variável não tem efeito na logagem de transações em tabelas `NDB`; use `ndb_log_transaction_compression_level_zstd` em vez disso.

* `binlog_transaction_dependency_history_size`

<table frame="box" rules="all" summary="Propriedades para log-bin-index"><tr><th>Formato de Linha de Comando</th> <td><code>--log-bin-index=nome_do_arquivo</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>log_bin_index</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

Define um limite superior para o número de hashes de linha que são mantidos na memória e usados para procurar a transação que modificou a última vez uma linha específica. Quando esse número de hashes é atingido, o histórico é apagado.

* `log_bin`

  <table frame="box" rules="all" summary="Propriedades para binlog-do-db"><tbody><tr><th>Formato de linha de comando</th> <td><code>--binlog-do-db=nome</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Mostra o status do registro binário no servidor, habilitado (`ON`) ou desabilitado (`OFF`). Com o registro binário habilitado, o servidor registra todas as instruções que alteram dados no log binário, que é usado para backup e replicação. `ON` significa que o log binário está disponível, `OFF` significa que ele não está em uso. A opção `--log-bin` pode ser usada para especificar um nome de base e localização para o log binário.

  Em versões anteriores do MySQL, o registro binário estava desabilitado por padrão e era habilitado se você especificar a opção `--log-bin`. O registro binário está habilitado por padrão, com a variável de sistema `log_bin` definida como `ON`, independentemente de você especificar a opção `--log-bin`. A exceção é se você usar o **mysqld** para inicializar o diretório de dados manualmente, invocando-o com a opção `--initialize` ou `--initialize-insecure`, quando o registro binário está desabilitado por padrão. É possível habilitar o registro binário nesse caso, especificando a opção `--log-bin`.

  Se a opção `--skip-log-bin` ou `--disable-log-bin` for especificada na inicialização, o registro binário é desabilitado, com a variável de sistema `log_bin` definida como `OFF`. Se qualquer uma dessas opções for especificada e `--log-bin` também for especificada, a opção especificada posteriormente tem precedência.

Para obter informações sobre o formato e a gestão do log binário, consulte a Seção 7.4.4, “O Log Binário”.

* `log_bin_basename`

  <table frame="box" rules="all" summary="Propriedades para binlog-do-db"><tr><th>Formato de linha de comando</th> <td><code>--binlog-do-db=nome</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></table>

  Contém o nome base e o caminho para os arquivos de log binário, que podem ser definidos com a opção de servidor `--log-bin`. O comprimento máximo da variável é de 256 caracteres. No MySQL 9.5, se a opção `--log-bin` não for fornecida, o nome base padrão é `binlog`. Para compatibilidade com o MySQL 5.7, se a opção `--log-bin` for fornecida sem uma string ou com uma string vazia, o nome base padrão é `host_name-bin`, usando o nome da máquina do host. A localização padrão é o diretório de dados.

* `log_bin_index`

  <table frame="box" rules="all" summary="Propriedades para binlog-do-db"><tr><th>Formato de linha de comando</th> <td><code>--binlog-do-db=nome</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></table>

  Contém o nome base e o caminho para o arquivo de índice do log binário, que pode ser definido com a opção de servidor `--log-bin-index`. O comprimento máximo da variável é de 256 caracteres.

* `log_bin_trust_function_creators`

  <table frame="box" rules="all" summary="Propriedades para binlog-do-db"><tr><th>Formato de linha de comando</th> <td><code>--binlog-do-db=nome</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></table>

Esta variável é aplicada quando o registro binário está habilitado. Ela controla se os criadores de funções armazenadas podem ser confiáveis para não criar funções armazenadas que possam causar eventos inseguros serem registrados no log binário. Se definida como 0 (o padrão), os usuários não têm permissão para criar ou alterar funções armazenadas, a menos que tenham o privilégio `SUPER`, além do privilégio `CREATE ROUTINE` ou `ALTER ROUTINE`. Uma configuração de 0 também impõe a restrição de que uma função deve ser declarada com a característica `DETERMINISTIC`, ou com a característica `READS SQL DATA` ou `NO SQL`. Se a variável for definida como 1, o MySQL não aplica essas restrições à criação de funções armazenadas. Esta variável também se aplica à criação de gatilhos. Veja a Seção 27.9, “Registro Binário de Programas Armazenados”.

* `log_replica_updates`

  <table frame="box" rules="all" summary="Propriedades para binlog-do-db"><tr><th>Formato de Linha de Comando</th> <td><code>--binlog-do-db=nome</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  `log_replica_updates` especifica se as atualizações recebidas por um servidor replica de um servidor de origem de replicação devem ser registradas no log binário da própria replica.

Ativação desta variável faz com que a replica escreva as atualizações recebidas de uma fonte e executadas pelo fio de replicação SQL no log binário da própria replica. O registro binário, que é controlado pela opção `--log-bin` e ativado por padrão, também deve ser ativado na replica para que as atualizações sejam registradas. Veja a Seção 19.1.6, “Opções e Variáveis de Registro Binário e Replicação”. `log_replica_updates` é ativado por padrão, a menos que você especifique `--skip-log-bin` para desativar o registro binário, caso em que o MySQL também desativa o registro de atualizações da replica por padrão. Se você precisar desativar o registro de atualizações da replica quando o registro binário estiver ativado, especifique `--log-replica-updates=OFF` no início do servidor da replica.

Ativação de `log_replica_updates` permite que os servidores de replicação sejam encadeados. Por exemplo, você pode querer configurar servidores de replicação usando essa configuração:

```
  A -> B -> C
  ```

Aqui, `A` serve como a fonte para a replica `B`, e `B` serve como a fonte para a replica `C`. Para que isso funcione, `B` deve ser tanto uma fonte *e* uma replica. Com o registro binário ativado e `log_replica_updates` ativado, que são as configurações padrão, as atualizações recebidas de `A` são registradas por `B` em seu log binário e, portanto, podem ser passadas para `C`.

* `log_slave_updates`

  <table frame="box" rules="all" summary="Propriedades para binlog-do-db"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--binlog-do-db=name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Alias desatualizado para `log_replica_updates`.

* `log_statements_unsafe_for_binlog`

<table frame="box" rules="all" summary="Propriedades para binlog-do-db"><tr><th>Formato de linha de comando</th> <td><code>--binlog-do-db=nome</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></table>

  Se o erro 1592 for encontrado, controla se as mensagens de aviso geradas são adicionadas ao log de erros ou não.

* `master_verify_checksum`

  <table frame="box" rules="all" summary="Propriedades para binlog-do-db"><tr><th>Formato de linha de comando</th> <td><code>--binlog-do-db=nome</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></table>

  Alias desatualizado para `source_verify_checksum`.

* `max_binlog_cache_size`

  <table frame="box" rules="all" summary="Propriedades para binlog-do-db"><tr><th>Formato de linha de comando</th> <td><code>--binlog-do-db=nome</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></table>

  Se uma transação exigir mais do que esse número de bytes, o servidor gera um erro de transação de múltiplas instruções que requer mais 'max_binlog_cache_size' bytes de armazenamento. Quando `gtid_mode` não está `ON`, o valor máximo recomendado é de 4GB, devido ao fato de que, neste caso, o MySQL não pode trabalhar com posições de log binário maiores que 4GB; quando `gtid_mode` está `ON`, essa limitação não se aplica e o servidor pode trabalhar com posições de log binário de tamanho arbitrário.

  Se, por causa de `gtid_mode` não estar `ON`, ou por algum outro motivo, você precisar garantir que o log binário não exceda um tamanho dado *`maxsize`*, você deve definir essa variável de acordo com a fórmula mostrada aqui:

  ```
  max_binlog_cache_size <
    (((maxsize - max_binlog_size) / max_connections) - 1000) / 1.2
  ```

Este cálculo leva em consideração as seguintes condições:

+ O servidor escreve no log binário enquanto o tamanho antes de começar a escrever for menor que `max_binlog_size`.

+ O servidor não escreve transações individuais, mas sim grupos de transações. O número máximo possível de transações em um grupo é igual a `max_connections`.

+ O servidor escreve dados que não estão incluídos no cache. Isso inclui um checksum de 4 bytes para cada evento; embora isso aumente menos de 20% no tamanho da transação, esse valor não é negligenciável. Além disso, o servidor escreve um `Gtid_log_event` para cada transação; cada um desses eventos pode adicionar mais 1 KB ao que é escrito no log binário.

`max_binlog_cache_size` define o tamanho do cache de transações apenas; o limite superior para o cache de declarações é regido pela variável de sistema `max_binlog_stmt_cache_size`.

A visibilidade para sessões de `max_binlog_cache_size` corresponde à da variável de sistema `binlog_cache_size`; em outras palavras, alterar seu valor afeta apenas novas sessões que são iniciadas após o valor ser alterado.

* `max_binlog_size`

<table frame="box" rules="all" summary="Propriedades para binlog-do-db"><tr><th>Formato de linha de comando</th> <td><code>--binlog-do-db=name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></table>

Se uma escrita no log binário faz com que o tamanho do arquivo de log atual exceda o valor desta variável, o servidor roda os logs binários (fecha o arquivo atual e abre o próximo). O valor mínimo é de 4096 bytes. O valor máximo e o valor padrão é de 1GB. Arquivos de log binário criptografados têm um cabeçalho adicional de 512 bytes, que é incluído em `max_binlog_size`.

Uma transação é escrita em um único bloco no log binário, portanto, nunca é dividida entre vários logs binários. Portanto, se você tiver transações grandes, pode ver arquivos de log binário maiores que `max_binlog_size`.

Se `max_relay_log_size` for 0, o valor de `max_binlog_size` também se aplica aos logs de retransmissão.

Com GTIDs em uso no servidor, quando `max_binlog_size` for atingido, se a tabela de sistema `mysql.gtid_executed` não puder ser acessada para escrever os GTIDs do arquivo binário atual, o log binário não poderá ser rotado. Nessa situação, o servidor responde de acordo com sua configuração de `binlog_error_action`. Se `IGNORE_ERROR` for definido, um erro é registrado no servidor e o registro binário é interrompido, ou se `ABORT_SERVER` for definido, o servidor é desligado.

* `max_binlog_stmt_cache_size`

<table frame="box" rules="all" summary="Propriedades para binlog-ignore-db"><tbody><tr><th>Formato de linha de comando</th> <td><code>--binlog-ignore-db=nome</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Se declarações não transacionais dentro de uma transação exigirem mais desses bytes de memória, o servidor gera um erro. O valor mínimo é 4096. Os valores máximo e padrão são 4GB em plataformas de 32 bits e 16EB (exabytes) em plataformas de 64 bits.

  `max_binlog_stmt_cache_size` define o tamanho do cache de declarações; o limite superior para o cache de transação é regido exclusivamente pela variável de sistema `max_binlog_cache_size`.

* `original_commit_timestamp`

<table frame="box" rules="all" summary="Propriedades para binlog-ignore-db">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code>--binlog-ignore-db=nome</code></td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>String</td>
  </tr>
  </tbody>
</table>

  Para uso interno pela replicação. Ao executar novamente uma transação em uma replica, este valor é definido para o momento em que a transação foi comprometida na fonte original, medido em microsegundos desde a época. Isso permite que o timestamp de comprometimento original seja propagado por toda a topologia de replicação.

  Definir o valor da sessão desta variável do sistema é uma operação restrita. O usuário da sessão deve ter o privilégio `REPLICATION_APPLIER` (consulte a Seção 19.3.3, “Verificação de privilégios de replicação”) ou privilégios suficientes para definir variáveis de sessão restritas (consulte a Seção 7.1.9.1, “Privilégios de variáveis do sistema”). No entanto, note que a variável não é destinada para que os usuários a definam; ela é definida automaticamente pela infraestrutura de replicação.

* `source_verify_checksum`

  <table frame="box" rules="all" summary="Propriedades para binlog-ignore-db">
    <tr>
      <th>Formato de linha de comando</th>
      <td><code>--binlog-ignore-db=nome</code></td>
    </tr>
    <tr>
      <th>Tipo</th>
      <td>String</td>
    </tr>
  </tbody>
  </table>

  Ativação de `source_verify_checksum` faz com que a fonte verifique eventos lidos do log binário examinando checksums e pare com um erro no caso de um desajuste. `source_verify_checksum` está desativado por padrão; nesse caso, a fonte usa o comprimento do evento do log binário para verificar eventos, de modo que apenas eventos completos são lidos do log binário.

* `sql_log_bin`

<table frame="box" rules="all" summary="Propriedades para binlog-ignore-db">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--binlog-ignore-db=nome</code></td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>String</td>
  </tr>
  </tbody>
</table>

  Esta variável controla se o registro no log binário está habilitado para a sessão atual (assumindo que o próprio log binário está habilitado). O valor padrão é `ON`. Para desabilitar ou habilitar o registro binário para a sessão atual, defina a variável `sql_log_bin` da sessão para `OFF` ou `ON`.

  Defina esta variável para `OFF` para uma sessão desativar temporariamente o registro binário enquanto faz alterações na fonte que você não deseja replicar para a replica.

  Definir o valor da sessão desta variável do sistema é uma operação restrita. O usuário da sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Consulte a Seção 7.1.9.1, “Privilégios de Variáveis do Sistema”.

  Não é possível definir o valor da sessão de `sql_log_bin` dentro de uma transação ou subconsulta.

  *Definir esta variável para `OFF` impede que GTIDs sejam atribuídos a transações no log binário*. Se você está usando GTIDs para replicação, isso significa que, mesmo quando o registro binário for habilitado novamente, os GTIDs escritos no log a partir deste ponto não consideram quaisquer transações que ocorreram no meio do caminho, portanto, na prática, essas transações são perdidas.

* `sync_binlog`

  <table frame="box" rules="all" summary="Propriedades para binlog-ignore-db">
    <tr>
      <th>Formato de Linha de Comando</th>
      <td><code>--binlog-ignore-db=nome</code></td>
    </tr>
    <tr>
      <th>Tipo</th>
      <td>String</td>
    </tr>
  </tbody>
  </table>

Controla a frequência com que o servidor MySQL sincroniza o log binário com o disco.

+ `sync_binlog=0`: Desabilita a sincronização do log binário com o disco pelo servidor MySQL. Em vez disso, o servidor MySQL depende do sistema operacional para limpar o log binário no disco de tempos em tempos, como faz com qualquer outro arquivo. Esta configuração oferece o melhor desempenho, mas, em caso de falha de energia ou falha do sistema operacional, é possível que o servidor tenha comprometido transações que não foram sincronizadas com o log binário.

+ `sync_binlog=1`: Habilita a sincronização do log binário com o disco antes de as transações serem comprometidas. Esta é a configuração mais segura, mas pode ter um impacto negativo no desempenho devido ao aumento do número de escritas no disco. Em caso de falha de energia ou falha do sistema operacional, as transações que estão ausentes do log binário estão apenas em um estado preparado. Isso permite que a rotina de recuperação automática reverta as transações, o que garante que nenhuma transação seja perdida do log binário.

+ `sync_binlog=N`, onde *`N`* é um valor diferente de 0 ou 1: O log binário é sincronizado com o disco após `N` grupos de comprometimento do log binário terem sido coletados. Em caso de falha de energia ou falha do sistema operacional, é possível que o servidor tenha comprometido transações que não foram limpas para o log binário. Esta configuração pode ter um impacto negativo no desempenho devido ao aumento do número de escritas no disco. Um valor maior melhora o desempenho, mas com um risco aumentado de perda de dados.

Para a maior durabilidade e consistência possíveis em uma configuração de replicação que usa `InnoDB` com transações, use estas configurações:

+ `sync_binlog=1`.
+ `innodb_flush_log_at_trx_commit=1`.

Cuidado

Muitos sistemas operacionais e alguns hardwares de disco enganam a operação de gravação no disco. Eles podem informar ao **mysqld** que a gravação ocorreu, mesmo que não tenha. Nesse caso, a durabilidade das transações não é garantida, mesmo com as configurações recomendadas, e, no pior dos casos, uma queda de energia pode corromper os dados do `InnoDB`. O uso de um cache de disco com bateria no controlador de disco SCSI ou no próprio disco acelera as gravação no disco e torna a operação mais segura. Você também pode tentar desativar o cache de gravação de disco em caches de hardware.