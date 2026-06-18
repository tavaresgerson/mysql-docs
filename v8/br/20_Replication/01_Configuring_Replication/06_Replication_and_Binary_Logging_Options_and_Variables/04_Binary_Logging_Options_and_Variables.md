#### 19.1.6.4 Opções e variáveis de registro binário

- Opções de inicialização usadas com registro binário
- Variáveis do sistema usadas com registro binário

Você pode usar as opções do **mysqld** e as variáveis do sistema descritas nesta seção para afetar o funcionamento do log binário, bem como para controlar quais instruções são escritas no log binário. Para obter informações adicionais sobre o log binário, consulte a Seção 7.4.4, “O Log Binário”. Para obter informações adicionais sobre o uso das opções do servidor MySQL e das variáveis do sistema, consulte a Seção 7.1.7, “Opções de Comando do Servidor”, e a Seção 7.1.8, “Variáveis de Sistema do Servidor”.

##### Opções de inicialização usadas com registro binário

A lista a seguir descreve as opções de inicialização para habilitar e configurar o log binário. As variáveis de sistema usadas com o registro binário são discutidas mais adiante nesta seção.

- `--binlog-row-event-max-size=N`

  <table summary="Propriedades para binlog-row-event-max-size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--binlog-row-event-max-size=#</code>]]</td> </tr><tr><th>Variável do sistema (≥ 8.0.14)</th> <td>[[<code>binlog_row_event_max_size</code>]]</td> </tr><tr><th>Âmbito (≥ 8.0.14)</th> <td>Global</td> </tr><tr><th>Dinâmico (≥ 8.0.14)</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se (≥ 8.0.14)</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>8192</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>256</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td>[[<code>18446744073709551615</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td>[[<code>4294967295</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></tbody></table>

  Quando o registro binário baseado em linhas é usado, essa configuração é um limite suave para o tamanho máximo de um evento de registro binário baseado em linhas, em bytes. Sempre que possível, as linhas armazenadas no log binário são agrupadas em eventos com um tamanho não superior ao valor dessa configuração. Se um evento não puder ser dividido, o tamanho máximo pode ser excedido. O valor deve ser (ou ser arredondado para) um múltiplo de 256. O valor padrão é de 8192 bytes.

- `--log-bin[=base_name]`

  <table summary="Propriedades para log-bin"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--log-bin=file_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  Especifica o nome base a ser usado para os arquivos de log binário. Com o registro binário habilitado, o servidor registra todas as declarações que alteram dados nos logs binários, que são usados para backup e replicação. O log binário é uma sequência de arquivos com um nome base e extensão numérica. O valor da opção `--log-bin` é o nome base da sequência de logs. O servidor cria arquivos de log binário em sequência, adicionando um sufixo numérico ao nome base.

  Se você não fornecer a opção `--log-bin`, o MySQL usa `binlog` como o nome padrão da base para os arquivos de log binário. Para compatibilidade com versões anteriores, se você fornecer a opção `--log-bin` sem uma string ou com uma string vazia, o nome padrão da base é `host_name-bin`, usando o nome da máquina do host.

  O local padrão para os arquivos de log binário é o diretório de dados. Você pode usar a opção `--log-bin` para especificar um local alternativo, adicionando um nome de caminho absoluto antes do nome da base para especificar um diretório diferente. Quando o servidor lê uma entrada do arquivo de índice de log binário, que rastreia os arquivos de log binário que foram usados, ele verifica se a entrada contém um caminho relativo. Se estiver presente, a parte relativa do caminho é substituída pelo caminho absoluto definido usando a opção `--log-bin`. Um caminho absoluto registrado no arquivo de índice de log binário permanece inalterado; nesse caso, o arquivo de índice deve ser editado manualmente para permitir que um novo caminho ou caminhos sejam usados. O nome da base do arquivo de log binário e qualquer caminho especificado estão disponíveis como a variável de sistema `log_bin_basename`.

  Em versões anteriores do MySQL, o registro binário estava desativado por padrão e era ativado se você especificar a opção `--log-bin`. A partir do MySQL 8.0, o registro binário está ativado por padrão, independentemente de você especificar a opção `--log-bin`. A exceção é se você usar o **mysqld** para inicializar o diretório de dados manualmente, invocando-o com a opção `--initialize` ou `--initialize-insecure`, quando o registro binário está desativado por padrão. É possível ativar o registro binário neste caso, especificando a opção `--log-bin`. Quando o registro binário está ativado, a variável de sistema `log_bin`, que mostra o status do registro binário no servidor, é definida como ABERTO.

  Para desabilitar o registro binário, você pode especificar a opção `--skip-log-bin` ou `--disable-log-bin` durante a inicialização. Se uma dessas opções for especificada e `--log-bin` também for especificado, a opção especificada posteriormente terá precedência. Quando o registro binário é desativado, a variável de sistema `log_bin` é definida como OFF.

  Quando os GTIDs estão em uso no servidor, se você desabilitar o registro binário ao reiniciar o servidor após um desligamento anormal, é provável que alguns GTIDs sejam perdidos, causando o fracasso da replicação. Em um desligamento normal, o conjunto de GTIDs do arquivo de log binário atual é salvo na tabela `mysql.gtid_executed`. Após um desligamento anormal em que isso não aconteceu, durante a recuperação, os GTIDs são adicionados à tabela a partir do arquivo de log binário, desde que o registro binário ainda esteja habilitado. Se o registro binário for desabilitado para o reinício do servidor, o servidor não poderá acessar o arquivo de log binário para recuperar os GTIDs, então a replicação não poderá ser iniciada. O registro binário pode ser desabilitado com segurança após um desligamento normal.

  As opções `--log-slave-updates` e `--slave-preserve-commit-order` exigem registro binário. Se você desabilitar o registro binário, omita essas opções ou especifique `--log-slave-updates=OFF` e `--skip-slave-preserve-commit-order`. O MySQL desabilita essas opções por padrão quando `--skip-log-bin` ou `--disable-log-bin` é especificado. Se você especificar `--log-slave-updates` ou `--slave-preserve-commit-order` junto com `--skip-log-bin` ou `--disable-log-bin`, uma mensagem de aviso ou erro é emitida.

  No MySQL 5.7, um ID de servidor precisava ser especificado quando o registro binário estava habilitado, caso contrário, o servidor não seria iniciado. No MySQL 8.0, a variável de sistema `server_id` é definida como 1 por padrão. O servidor agora pode ser iniciado com esse ID de servidor padrão quando o registro binário está habilitado, mas uma mensagem informativa será emitida se você não especificar um ID de servidor explicitamente, definindo a variável de sistema `server_id`. Para servidores usados em uma topologia de replicação, você deve especificar um ID de servidor único e não nulo para cada servidor.

  Para obter informações sobre o formato e a gestão do log binário, consulte a Seção 7.4.4, “O Log Binário”.

- `--log-bin-index[=file_name]`

  <table summary="Propriedades para log-bin-index"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--log-bin-index=file_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>log_bin_index</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  O nome do arquivo de índice do log binário, que contém os nomes dos arquivos de log binário. Por padrão, ele tem a mesma localização e nome base que o valor especificado para os arquivos de log binário usando a opção `--log-bin`, mais a extensão `.index`. Se você não especificar a opção `--log-bin`, o nome padrão do arquivo de índice do log binário é `binlog.index`. Se você especificar a opção `--log-bin` sem uma string ou uma string vazia, o nome padrão do arquivo de índice do log binário é `host_name-bin.index`, usando o nome da máquina hospedeira.

  Para obter informações sobre o formato e a gestão do log binário, consulte a Seção 7.4.4, “O Log Binário”.

**Opções de seleção de declarações.** As opções na lista a seguir afetam quais declarações são escritas no log binário e, portanto, enviadas por um servidor de origem de replicação para suas réplicas. Há também opções para réplicas que controlam quais declarações recebidas da fonte devem ser executadas ou ignoradas. Para detalhes, consulte a Seção 19.1.6.3, “Opções e variáveis do servidor de réplica”.

- `--binlog-do-db=db_name`

  <table summary="Propriedades para binlog-do-db"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--binlog-do-db=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>

  Esta opção afeta o registro binário de maneira semelhante à forma como o `--replicate-do-db` afeta a replicação.

  Os efeitos desta opção dependem se o formato de registro baseado em declarações ou baseado em linhas está em uso, da mesma forma que os efeitos de `--replicate-do-db` dependem se a replicação baseada em declarações ou baseada em linhas está em uso. Você deve ter em mente que o formato usado para registrar uma determinada declaração pode não ser necessariamente o mesmo que o indicado pelo valor de `binlog_format`. Por exemplo, declarações DDL como `CREATE TABLE` e `ALTER TABLE` são sempre registradas como declarações, independentemente do formato de registro em vigor, portanto, as seguintes regras baseadas em declarações para `--binlog-do-db` sempre se aplicam para determinar se a declaração é registrada ou

  **Registro baseado em declarações.** Apenas aquelas declarações são escritas no log binário onde o banco de dados padrão (ou seja, aquele selecionado por `USE`) é `db_name`. Para especificar mais de um banco de dados, use esta opção várias vezes, uma vez para cada banco de dados; no entanto, fazer isso *não* causa o registro de declarações entre bancos, como `UPDATE some_db.some_table SET foo='bar'`, enquanto um banco de dados diferente (ou nenhum banco de dados) é selecionado.

  Aviso

  Para especificar múltiplas bases de dados, você *deve* usar múltiplas instâncias desta opção. Como os nomes de banco de dados podem conter vírgulas, a lista é tratada como o nome de uma única base de dados se você fornecer uma lista separada por vírgula.

  Um exemplo do que não funciona conforme você pode esperar ao usar o registro baseado em declarações: Se o servidor for iniciado com `--binlog-do-db=sales` e você emitir as seguintes declarações, a declaração `UPDATE` *não* será registrada:

  ```
  USE prices;
  UPDATE sales.january SET amount=amount+1000;
  ```

  A principal razão para esse comportamento de "apenas verifique o banco de dados padrão" é que, a partir da declaração sozinha, é difícil saber se ele deve ser replicado (por exemplo, se você está usando declarações `DELETE` de múltiplas tabelas ou declarações `UPDATE` de múltiplas tabelas que atuam em múltiplos bancos de dados). Também é mais rápido verificar apenas o banco de dados padrão, em vez de todos os bancos de dados, se não houver necessidade.

  Outro caso que pode não ser óbvio ocorre quando um banco de dados específico é replicado, mesmo que isso não tenha sido especificado ao definir a opção. Se o servidor for iniciado com `--binlog-do-db=sales`, a seguinte instrução `UPDATE` será registrada, mesmo que `prices` não tenha sido incluído ao definir `--binlog-do-db`:

  ```
  USE sales;
  UPDATE prices.discounts SET percentage = percentage + 10;
  ```

  Como o `sales` é o banco de dados padrão quando a instrução `UPDATE` é emitida, o `UPDATE` é registrado.

  **Registro baseado em linhas.** O registro é restrito ao banco de dados `db_name`. Apenas as alterações nas tabelas pertencentes a `db_name` são registradas; o banco de dados padrão não tem efeito sobre isso. Suponha que o servidor seja iniciado com `--binlog-do-db=sales` e o registro baseado em linhas esteja em vigor, e então as seguintes instruções sejam executadas:

  ```
  USE prices;
  UPDATE sales.february SET amount=amount+100;
  ```

  As alterações na tabela `february` no banco de dados `sales` são registradas de acordo com a declaração `UPDATE`; isso ocorre independentemente de a declaração `USE` ter sido emitida ou não. No entanto, ao usar o formato de registro baseado em linhas e `--binlog-do-db=sales`, as alterações feitas pelos seguintes `UPDATE` não são registradas:

  ```
  USE prices;
  UPDATE prices.march SET amount=amount-25;
  ```

  Mesmo que a declaração `USE prices` fosse alterada para `USE sales`, os efeitos da declaração `UPDATE` ainda não seriam registrados no log binário.

  Outra diferença importante no tratamento do `--binlog-do-db` para o registro baseado em declarações, em oposição ao registro baseado em linhas, ocorre em relação às declarações que se referem a múltiplas bases de dados. Suponha que o servidor seja iniciado com `--binlog-do-db=db1`, e as seguintes declarações sejam executadas:

  ```
  USE db1;
  UPDATE db1.table1, db2.table2 SET db1.table1.col1 = 10, db2.table2.col2 = 20;
  ```

  Se você estiver usando o registro baseado em declarações, as atualizações em ambas as tabelas são escritas no log binário. No entanto, ao usar o formato baseado em linhas, apenas as alterações em `table1` são registradas; `table2` está em um banco de dados diferente, então não é alterado pelo `UPDATE`. Agora, suponha que, em vez da declaração `USE db1`, tivesse sido usada uma declaração `USE db4`:

  ```
  USE db4;
  UPDATE db1.table1, db2.table2 SET db1.table1.col1 = 10, db2.table2.col2 = 20;
  ```

  Neste caso, a declaração `UPDATE` não é escrita no log binário quando se usa o registro baseado em declarações. No entanto, ao usar o registro baseado em linhas, a mudança para `table1` é registrada, mas não para `table2` — ou seja, apenas as alterações nas tabelas no banco de dados nomeado por `--binlog-do-db` são registradas, e a escolha do banco de dados padrão não tem efeito nesse comportamento.

- `--binlog-ignore-db=db_name`

  <table summary="Propriedades para binlog-ignore-db"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--binlog-ignore-db=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>

  Esta opção afeta o registro binário de maneira semelhante à forma como o `--replicate-ignore-db` afeta a replicação.

  Os efeitos desta opção dependem se o formato de registro baseado em declarações ou baseado em linhas está em uso, da mesma forma que os efeitos de `--replicate-ignore-db` dependem se a replicação baseada em declarações ou baseada em linhas está em uso. Você deve ter em mente que o formato usado para registrar uma determinada declaração pode não ser necessariamente o mesmo que o indicado pelo valor de `binlog_format`. Por exemplo, declarações DDL como `CREATE TABLE` e `ALTER TABLE` são sempre registradas como declarações, independentemente do formato de registro em vigor, portanto, as seguintes regras baseadas em declarações para `--binlog-ignore-db` sempre se aplicam para determinar se a declaração é registrada ou

  **Registro baseado em declarações.** Instrui o servidor a não registrar nenhuma declaração onde o banco de dados padrão (ou seja, o selecionado por `USE`) é `db_name`.

  Quando não há um banco de dados padrão, as opções `--binlog-ignore-db` não são aplicadas e essas declarações são sempre registradas. (Bug #11829838, Bug #60188)

  **Formato baseado em linhas.** Diz ao servidor para não registrar atualizações em nenhuma tabela no banco de dados `db_name`. O banco de dados atual não tem efeito.

  Ao usar o registro baseado em declarações, o exemplo a seguir não funciona conforme o esperado. Suponha que o servidor seja iniciado com `--binlog-ignore-db=sales` e você emitir as seguintes declarações:

  ```
  USE prices;
  UPDATE sales.january SET amount=amount+1000;
  ```

  A declaração `UPDATE` *é* registrada nesse caso, porque `--binlog-ignore-db` se aplica apenas ao banco de dados padrão (determinado pela declaração `USE`). Como o banco de dados `sales` foi especificado explicitamente na declaração, a declaração não foi filtrada. No entanto, ao usar o registro baseado em linhas, os efeitos da declaração `UPDATE` *não* são escritos no log binário, o que significa que nenhuma alteração na tabela `sales.january` é registrada; nesse caso, `--binlog-ignore-db=sales` faz com que *todas* as alterações feitas nas tabelas na cópia da fonte do banco de dados `sales` sejam ignoradas para fins de registro binário.

  Para especificar mais de um banco de dados a ser ignorado, use essa opção várias vezes, uma vez para cada banco de dados. Como os nomes dos bancos de dados podem conter vírgulas, a lista é tratada como o nome de um único banco de dados se você fornecer uma lista separada por vírgula.

  Você não deve usar essa opção se estiver usando atualizações entre bancos de dados e não quiser que essas atualizações sejam registradas.

**Opções de verificação de checksum.** O MySQL suporta a leitura e a escrita de verificações de checksums de log binário. Essas opções são ativadas usando as duas opções listadas aqui:

- `--binlog-checksum={NONE|CRC32}`

  <table summary="Propriedades para binlog-checksum"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--binlog-checksum=type</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>CRC32</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>NONE</code>]]</p><p class="valid-value">[[<code>CRC32</code>]]</p></td> </tr></tbody></table>

  Ativação desta opção faz com que a fonte escreva verificações de integridade para eventos escritos no log binário. Defina para `NONE` para desativar, ou o nome do algoritmo a ser usado para gerar verificações de integridade; atualmente, apenas verificações de integridade CRC32 são suportadas, e CRC32 é o padrão. Você não pode alterar a configuração desta opção dentro de uma transação.

Para controlar a leitura dos checksums pela replica (do log do relé), use a opção `--slave-sql-verify-checksum`.

**Opções de teste e depuração.** As seguintes opções de log binário são usadas no teste e depuração da replicação. Elas não são destinadas ao uso em operações normais.

- `--max-binlog-dump-events=N`

  <table summary="Propriedades para max-binlog-dump-events"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--max-binlog-dump-events=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>0</code>]]</td> </tr></tbody></table>

  Esta opção é usada internamente pelo conjunto de testes do MySQL para testes de replicação e depuração.

- `--sporadic-binlog-dump-fail`

  <table summary="Propriedades para sporadic-binlog-dump-fail"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--sporadic-binlog-dump-fail[={OFF|ON}]</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

  Esta opção é usada internamente pelo conjunto de testes do MySQL para testes de replicação e depuração.

##### Variáveis do sistema usadas com registro binário

A lista a seguir descreve as variáveis de sistema para controlar o registro binário. Elas podem ser definidas na inicialização do servidor e algumas podem ser alteradas em tempo de execução usando `SET`. As opções do servidor usadas para controlar o registro binário estão listadas anteriormente nesta seção.

- `binlog_cache_size`

  <table summary="Propriedades para binlog_cache_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--binlog-cache-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>binlog_cache_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>32768</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>4096</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td>[[<code>18446744073709547520</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td>[[<code>4294963200</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr><tr><th>Tamanho do bloco</th> <td>[[<code>4096</code>]]</td> </tr></tbody></table>

  O tamanho do buffer de memória para armazenar as alterações no log binário durante uma transação.

  Quando o registro binário está habilitado no servidor (com a variável de sistema `log_bin` definida como ON), um cache de log binário é alocado para cada cliente, se o servidor suportar algum mecanismo de armazenamento transacional. Se os dados da transação ultrapassarem o espaço no buffer de memória, os dados excedentes são armazenados em um arquivo temporário. Quando a criptografia do log binário está ativa no servidor, o buffer de memória não é criptografado, mas (a partir do MySQL 8.0.17) qualquer arquivo temporário usado para armazenar o cache do log binário é criptografado. Após cada transação ser confirmada, o cache de log binário é redefinido, limpando o buffer de memória e truncando o arquivo temporário, se usado.

  Se você utiliza frequentemente transações grandes, pode aumentar esse tamanho de cache para obter um melhor desempenho, reduzindo ou eliminando a necessidade de gravar em arquivos temporários. As variáveis de status `Binlog_cache_use` e `Binlog_cache_disk_use` podem ser úteis para ajustar o tamanho dessa variável. Veja a Seção 7.4.4, “O Log Binário”.

  `binlog_cache_size` define o tamanho do cache de transações apenas; o tamanho do cache de instruções é regido pela variável de sistema `binlog_stmt_cache_size`.

- `binlog_checksum`

  <table summary="Propriedades para binlog_checksum"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--binlog-checksum=type</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>binlog_checksum</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>CRC32</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>NONE</code>]]</p><p class="valid-value">[[<code>CRC32</code>]]</p></td> </tr></tbody></table>

  Quando habilitada, essa variável faz com que a fonte escreva um checksum para cada evento no log binário. `binlog_checksum` suporta os valores `NONE` (que desabilita os checksums) e `CRC32`. O padrão é `CRC32`. Quando `binlog_checksum` é desativado (valor `NONE`), o servidor verifica se está escrevendo apenas eventos completos no log binário, escrevendo e verificando o comprimento do evento (em vez de um checksum) para cada evento.

  Definir essa variável na fonte para um valor não reconhecido pela réplica faz com que a réplica defina seu próprio valor `binlog_checksum` para `NONE` e pare a replicação com um erro. Se a compatibilidade reversa com réplicas mais antigas é uma preocupação, você pode querer definir o valor explicitamente para `NONE`.

  Até e incluindo o MySQL 8.0.20, a Replicação por Grupo não pode utilizar verificações de integridade e não suporta sua presença no log binário, portanto, você deve definir `binlog_checksum=NONE` ao configurar uma instância do servidor para se tornar membro do grupo. A partir do MySQL 8.0.21, a Replicação por Grupo suporta verificações de integridade, então os membros do grupo podem usar o ajuste padrão.

  Alterar o valor de `binlog_checksum` faz com que o log binário seja rotado, porque os checksums devem ser escritos para um arquivo de log binário inteiro, e nunca apenas para uma parte dele. Você não pode alterar o valor de `binlog_checksum` dentro de uma transação.

  Quando a compressão de transações de log binário é habilitada usando a variável de sistema `binlog_transaction_compression`, os checksums não são escritos para eventos individuais em um payload de transação comprimida. Em vez disso, um checksum é escrito para o evento GTID e um checksum para o `Transaction_payload_event` comprimido.

- `binlog_direct_non_transactional_updates`

  <table summary="Propriedades para log-bin"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--log-bin=file_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>0

  Devido a problemas de concorrência, uma replica pode se tornar inconsistente quando uma transação contém atualizações tanto em tabelas transacionais quanto não transacionais. O MySQL tenta preservar a causalidade entre essas declarações escrevendo declarações não transacionais no cache de transação, que é descartado após o commit. No entanto, problemas surgem quando as modificações feitas em tabelas não transacionais em nome de uma transação tornam-se imediatamente visíveis para outras conexões, pois essas alterações podem não ser escritas imediatamente no log binário.

  A variável `binlog_direct_non_transactional_updates` oferece uma solução possível para esse problema. Por padrão, essa variável está desabilitada. Ao habilitar `binlog_direct_non_transactional_updates`, as atualizações de tabelas não transacionais são escritas diretamente no log binário, em vez de no cache de transações.

  A partir do MySQL 8.0.14, definir o valor da sessão desta variável de sistema é uma operação restrita. O usuário da sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Consulte a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”.

  *`binlog_direct_non_transactional_updates` funciona apenas para declarações que são replicadas usando o formato de registro binário baseado em declarações*; ou seja, funciona apenas quando o valor de `binlog_format` é `STATEMENT`, ou quando `binlog_format` é `MIXED` e uma determinada declaração está sendo replicada usando o formato baseado em declarações. Esta variável não tem efeito quando o formato de log binário é `ROW`, ou quando `binlog_format` está definido como `MIXED` e uma determinada declaração está sendo replicada usando o formato baseado em linhas.

  Importante

  Antes de habilitar essa variável, você deve garantir que não haja dependências entre tabelas transacionais e não transacionais; um exemplo de tal dependência seria a declaração `INSERT INTO myisam_table SELECT * FROM innodb_table`. Caso contrário, essas declarações provavelmente farão com que a replica se desvie da fonte.

  Essa variável não tem efeito quando o formato de log binário é `ROW` ou `MIXED`.

- `binlog_encryption`

  <table summary="Propriedades para log-bin"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--log-bin=file_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>1

  Habilita a criptografia para arquivos de log binários e arquivos de log de retransmissão neste servidor. `OFF` é o padrão. `ON` habilita a criptografia para arquivos de log binários e arquivos de log de retransmissão. O registro binário não precisa ser habilitado no servidor para habilitar a criptografia, então você pode criptografar os arquivos de log de retransmissão em uma replica que não tenha arquivos de log binários. Para usar a criptografia, um plugin de chaveira deve ser instalado e configurado para fornecer o serviço de chaveira do MySQL Server. Para obter instruções sobre como fazer isso, consulte a Seção 8.4.4, “A Chaveira MySQL”. Qualquer plugin de chaveira suportado pode ser usado para armazenar as chaves de criptografia dos arquivos de log binários.

  Quando você inicia o servidor pela primeira vez com a criptografia do log binário habilitada, uma nova chave de criptografia do log binário é gerada antes que os logs binários e os logs de retransmissão sejam inicializados. Essa chave é usada para criptografar uma senha de arquivo para cada arquivo de log binário (se o servidor tiver o registro binário habilitado) e para o arquivo de log de retransmissão (se o servidor tiver canais de replicação), e as chaves geradas a partir das senhas de arquivo são usadas para criptografar os dados nos arquivos. Os arquivos de log de retransmissão são criptografados para todos os canais, incluindo os canais de aplicação da aplicação de replicação de grupo e novos canais que são criados após a criptografia ser ativada. O arquivo de índice do log binário e o arquivo de índice do log de retransmissão nunca são criptografados.

  Se você ativar o criptografia enquanto o servidor estiver em execução, uma nova chave de criptografia do log binário será gerada naquela época. A exceção é se a criptografia estiver ativa anteriormente no servidor e depois foi desativada, nesse caso, a chave de criptografia do log binário que estava em uso antes é usada novamente. O arquivo de log binário e os arquivos de log de retransmissão são rotados imediatamente, e as senhas dos arquivos são criptografadas usando essa chave de criptografia do log binário. Os arquivos de log binário e os arquivos de log de retransmissão existentes ainda presentes no servidor não são criptografados automaticamente, mas você pode excluí-los se não forem mais necessários.

  Se você desativar a criptografia alterando a variável de sistema `binlog_encryption` para `OFF`, o arquivo de log binário e os arquivos de log de retransmissão são rotados imediatamente e todo o registro subsequente fica não criptografado. Arquivos criptografados anteriormente não são automaticamente descriptografados, mas o servidor ainda consegue lê-los. O privilégio `BINLOG_ENCRYPTION_ADMIN` (ou o privilégio desatualizado `SUPER`) é necessário para ativar ou desativar a criptografia enquanto o servidor estiver em execução. Os canais do aplicativo de replicação de grupo não são incluídos na solicitação de rotação do log de retransmissão, portanto, o registro não criptografado para esses canais não começa até que seus logs sejam rotados no uso normal.

  Para obter mais informações sobre a criptografia de arquivos de log binários e arquivos de log de retransmissão, consulte a Seção 19.3.2, “Criptografar arquivos de log binários e arquivos de log de retransmissão”.

- `binlog_error_action`

  <table summary="Propriedades para log-bin"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--log-bin=file_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>2

  Controla o que acontece quando o servidor encontra um erro, como não conseguir escrever, esvaziar ou sincronizar o log binário, o que pode fazer com que o log binário da fonte se torne inconsistente e as réplicas percam a sincronização.

  Esta variável tem o valor padrão `ABORT_SERVER`, o que faz o servidor parar de registrar e desligar sempre que encontrar esse erro no log binário. Na reinicialização, a recuperação prossegue como no caso de um desligamento inesperado do servidor (consulte a Seção 19.4.2, “Tratamento de um Desligamento Inesperado de uma Replicação”).

  Quando `binlog_error_action` é definido como `IGNORE_ERROR`, se o servidor encontrar esse erro, ele continuará a transação em andamento, registrará o erro e então encerrará o registro, continuando a realizar atualizações. Para reativar o registro binário, `log_bin` deve ser habilitado novamente, o que requer o reinício do servidor. Esta configuração oferece compatibilidade reversa com versões mais antigas do MySQL.

- `binlog_expire_logs_seconds`

  <table summary="Propriedades para log-bin"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--log-bin=file_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>3

  Define o período de validade do log binário em segundos. Após o término do período de validade, os arquivos de log binário podem ser removidos automaticamente. As remoções podem ocorrer automaticamente ao iniciar o servidor ou quando o log binário for descarregado. O descarregamento do log ocorre conforme indicado na Seção 7.4, "Logs do MySQL Server".

  O período padrão de validade do log binário é de 2592000 segundos, o que equivale a 30 dias (30 \* 24 \* 60 \* 60 segundos). O padrão se aplica se nem `binlog_expire_logs_seconds` nem a variável de sistema descontinuada `expire_logs_days` tiverem um valor definido no momento do início. Se um valor diferente de zero para uma das variáveis `binlog_expire_logs_seconds` ou `expire_logs_days` for definido no momento do início, esse valor é usado como período de validade do log binário. Se um valor diferente de zero para ambas as variáveis for definido no momento do início, o valor para `binlog_expire_logs_seconds` é usado como período de validade do log binário, e o valor para `expire_logs_days` é ignorado com uma mensagem de aviso.

  Durante a execução, não é possível definir `binlog_expire_logs_seconds` ou `expire_logs_days` para um valor não nulo se o outro estiver definido para um valor não nulo. Como o valor padrão para `binlog_expire_logs_seconds` é não nulo, você deve definir explicitamente `binlog_expire_logs_seconds` para zero antes de poder definir ou alterar o valor de `expire_logs_days`.

  A partir do MySQL 8.0.29, a limpeza automática do log binário pode ser desativada definindo a variável de sistema `binlog_expire_logs_auto_purge` para `OFF`. Isso tem precedência sobre qualquer configuração para `binlog_expire_logs_seconds`.

  No MySQL 8.0.28 e versões anteriores, para desabilitar a limpeza automática do log binário, especifique explicitamente o valor 0 para `binlog_expire_logs_seconds` e não especifique um valor para `expire_logs_days`. Para compatibilidade com versões anteriores, a limpeza automática também é desativada se você especificar explicitamente o valor 0 para `expire_logs_days` e não especificar um valor para `binlog_expire_logs_seconds`. Nesse caso, o valor padrão para `binlog_expire_logs_seconds` não é aplicado.

  Para remover arquivos de log binários manualmente, use a instrução `PURGE BINARY LOGS`. Veja a Seção 15.4.1.1, “Instrução PURGE BINARY LOGS”.

- `binlog_expire_logs_auto_purge`

  <table summary="Propriedades para log-bin"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--log-bin=file_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>4

  Habilita ou desabilita a limpeza automática de arquivos de log binários. Definir essa variável para `ON` (padrão) habilita a limpeza automática; definí-la para `OFF` desabilita a limpeza automática. O intervalo de espera antes da limpeza é controlado por `binlog_expire_logs_seconds` e `expire_logs_days`.

  Nota

  Mesmo que `binlog_expire_logs_auto_purge` seja `ON`, definir tanto `binlog_expire_logs_seconds` quanto `expire_logs_days` para `0` impede que a limpeza automática ocorra.

  Essa variável não tem efeito em `PURGE BINARY LOGS`.

- `binlog_format`

  <table summary="Propriedades para log-bin"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--log-bin=file_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>5

  Esta variável de sistema define o formato de registro binário e pode ser qualquer uma das opções `STATEMENT`, `ROW` ou `MIXED`. (Consulte a Seção 19.2.1, “Formatos de Registro Binário”.) O ajuste entra em vigor quando o registro binário é habilitado no servidor, o que ocorre quando a variável de sistema `log_bin` é definida como `ON`. No MySQL 8.0, o registro binário é habilitado por padrão e, por padrão, utiliza o formato baseado em linhas.

  Nota

  `binlog_format` está desatualizado a partir do MySQL 8.0.34 e está sujeito à remoção em uma versão futura do MySQL. Isso implica que o suporte para formatos de registro que não sejam baseados em linhas também está sujeito à remoção em uma futura versão. Portanto, apenas o registro baseado em linhas deve ser empregado para quaisquer novas configurações de replicação do MySQL.

  `binlog_format` pode ser definido na inicialização ou durante o runtime, exceto que, sob certas condições, alterar essa variável durante o runtime não é possível ou causa o fracasso da replicação, conforme descrito mais adiante.

  O padrão é `ROW`. *Exceção*: No NDB Cluster, o padrão é `MIXED`; a replicação baseada em declarações não é suportada para o NDB Cluster.

  Definir o valor da sessão desta variável de sistema é uma operação restrita. O usuário da sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Consulte a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”.

  As regras que regem quando as alterações nesta variável entram em vigor e por quanto tempo o efeito dura são as mesmas que para outras variáveis do sistema do servidor MySQL. Para mais informações, consulte a Seção 15.7.6.1, “Sintaxe SET para Atribuição de Variáveis”.

  Quando `MIXED` é especificado, a replicação baseada em declarações é usada, exceto nos casos em que apenas a replicação baseada em linhas garanta resultados adequados. Por exemplo, isso acontece quando as declarações contêm funções carregáveis ou a função `UUID()`.

  Para obter detalhes sobre como os programas armazenados (procedimentos e funções armazenados, gatilhos e eventos) são tratados quando cada formato de registro binário é definido, consulte a Seção 27.7, “Registro Binário de Programas Armazenados”.

  Existem exceções quando você não pode alternar o formato de replicação em tempo de execução:

  - O formato de replicação não pode ser alterado a partir de uma função armazenada ou de um gatilho.

  - Se uma sessão tiver tabelas temporárias abertas, o formato de replicação não pode ser alterado para a sessão (`SET @@SESSION.binlog_format`).

  - Se houver tabelas temporárias abertas em qualquer canal de replicação, o formato de replicação não pode ser alterado globalmente (`SET @@GLOBAL.binlog_format` ou `SET @@PERSIST.binlog_format`).

  - Se qualquer fio do aplicativo do canal de replicação estiver em execução, o formato de replicação não pode ser alterado globalmente (`SET @@GLOBAL.binlog_format` ou `SET @@PERSIST.binlog_format`).

  Tentar alterar o formato de replicação em qualquer um desses casos (ou tentar definir o formato de replicação atual) resulta em um erro. No entanto, você pode usar `PERSIST_ONLY` (`SET @@PERSIST_ONLY.binlog_format`) para alterar o formato de replicação a qualquer momento, pois essa ação não modifica o valor da variável global de sistema em tempo de execução e só entra em vigor após o reinício do servidor.

  Não é recomendado alterar o formato de replicação em tempo de execução quando houver tabelas temporárias, pois essas tabelas são registradas apenas quando a replicação é baseada em instruções, enquanto que, na replicação baseada em linhas e na replicação mista, elas não são registradas.

  Mudar o formato de registro em um servidor de origem de replicação não faz com que uma réplica mude seu formato de registro para combinar. Alterar o formato de replicação enquanto a replicação estiver em andamento pode causar problemas se uma réplica tiver o registro binário habilitado, e a mudança resultar no uso do registro `STATEMENT` pelo formato da réplica enquanto a fonte estiver usando o registro `ROW` ou `MIXED` para registro. Uma réplica não é capaz de converter entradas de log binário recebidas no formato de registro `ROW` para o formato `STATEMENT` para uso em seu próprio log binário, então essa situação pode causar o fracasso da replicação. Para mais informações, consulte a Seção 7.4.4.2, “Definindo o Formato de Registro Binário”.

  O formato de log binário afeta o comportamento das seguintes opções do servidor:

  - `--replicate-do-db`
  - `--replicate-ignore-db`
  - `--binlog-do-db`
  - `--binlog-ignore-db`

  Esses efeitos são discutidos em detalhes nas descrições das opções individuais.

- `binlog_group_commit_sync_delay`

  <table summary="Propriedades para log-bin"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--log-bin=file_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>6

  Controla quantos microsegundos o commit do log binário espera antes de sincronizar o arquivo do log binário com o disco. Por padrão, `binlog_group_commit_sync_delay` está definido como 0, o que significa que não há atraso. Definir `binlog_group_commit_sync_delay` com um atraso em microsegundos permite que mais transações sejam sincronizadas com o disco de uma vez, reduzindo o tempo total para confirmar um grupo de transações, pois os grupos maiores requerem menos unidades de tempo por grupo.

  Quando `sync_binlog=0` ou `sync_binlog=1` está definido, o atraso especificado por `binlog_group_commit_sync_delay` é aplicado para cada grupo de commit do log binário antes da sincronização (ou, no caso de `sync_binlog=0`, antes de prosseguir). Quando `sync_binlog` é definido para um valor *n* maior que 1, o atraso é aplicado após cada *n* grupos de commit do log binário.

  Definir `binlog_group_commit_sync_delay` pode aumentar o número de transações de commit paralelas em qualquer servidor que tenha (ou possa ter após uma falha de replicação) uma replica, e, portanto, pode aumentar a execução paralela nas réplicas. Para se beneficiar desse efeito, os servidores de replica devem ter `replica_parallel_type=LOGICAL_CLOCK` (a partir do MySQL 8.0.26) ou `slave_parallel_type=LOGICAL_CLOCK` definido, e o efeito é mais significativo quando `binlog_transaction_dependency_tracking=COMMIT_ORDER` também está definido. É importante levar em consideração tanto o throughput da fonte quanto o throughput das réplicas ao ajustar o ajuste para `binlog_group_commit_sync_delay`.

  Definir `binlog_group_commit_sync_delay` também pode reduzir o número de chamadas `fsync()` para o log binário em qualquer servidor (fonte ou replica) que tenha um log binário.

  Observe que definir `binlog_group_commit_sync_delay` aumenta a latência das transações no servidor, o que pode afetar as aplicações do cliente. Além disso, em cargas de trabalho altamente concorrentes, é possível que o atraso aumente a concorrência e, portanto, reduza o desempenho. Normalmente, os benefícios de definir um atraso superam os inconvenientes, mas o ajuste deve ser sempre realizado para determinar a configuração ótima.

- `binlog_group_commit_sync_no_delay_count`

  <table summary="Propriedades para log-bin"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--log-bin=file_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>7

  O número máximo de transações a serem esperadas antes de abortar o atraso atual, conforme especificado por `binlog_group_commit_sync_delay`. Se `binlog_group_commit_sync_delay` for definido como 0, essa opção não terá efeito.

- `binlog_max_flush_queue_time`

  <table summary="Propriedades para log-bin"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--log-bin=file_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>8

  `binlog_max_flush_queue_time` está desatualizado e está marcado para eventual remoção em uma futura versão do MySQL. Anteriormente, essa variável de sistema controlava o tempo em microsegundos para continuar lendo transações da fila de esvaziamento antes de prosseguir com o commit do grupo. Ela não tem mais nenhum efeito.

- `binlog_order_commits`

  <table summary="Propriedades para log-bin"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--log-bin=file_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>9

  Quando essa variável é habilitada em um servidor de fonte de replicação (o que é o padrão), as instruções de commit de transações emitidas para os motores de armazenamento são serializadas em um único thread, de modo que as transações são sempre confirmadas na mesma ordem em que são escritas no log binário. Desabilitar essa variável permite que as instruções de commit de transações sejam emitidas usando múltiplos threads. Usada em combinação com o commit de grupo de log binário, isso impede que a taxa de commit de uma única transação seja um gargalo para o desempenho e, portanto, pode produzir uma melhoria no desempenho.

  As transações são escritas no log binário no momento em que todos os motores de armazenamento envolvidos confirmam que a transação está pronta para ser confirmada. A lógica de commit do grupo de log binário então confirma um grupo de transações após a escrita no log binário. Quando o `binlog_order_commits` é desativado, porque múltiplos threads são usados para esse processo, as transações em um grupo de commit podem ser confirmadas em uma ordem diferente da ordem em que estão no log binário. (As transações de um único cliente sempre são confirmadas em ordem cronológica.) Em muitos casos, isso não importa, pois as operações realizadas em transações separadas devem produzir resultados consistentes, e se isso não for o caso, uma única transação deve ser usada.

  Se você deseja garantir que o histórico de transações na fonte e na replica multithread permaneça idêntico, defina `slave_preserve_commit_order=1` na replica.

- `binlog_rotate_encryption_master_key_at_startup`

  <table summary="Propriedades para log-bin-index"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--log-bin-index=file_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>log_bin_index</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>0

  Especifica se a chave mestre do log binário será rotacionada ou não ao iniciar o servidor. A chave mestre do log binário é a chave de criptografia do log binário usada para criptografar as senhas dos arquivos dos arquivos de log binário e dos arquivos de log de retransmissão no servidor. Quando um servidor é iniciado pela primeira vez com a criptografia do log binário habilitada (`binlog_encryption=ON`), uma nova chave de criptografia do log binário é gerada e usada como a chave mestre do log binário. Se a variável de sistema `binlog_rotate_encryption_master_key_at_startup` também for definida como `ON`, sempre que o servidor for reiniciado, uma nova chave de criptografia do log binário é gerada e usada como a chave mestre do log binário para todos os arquivos de log binário e arquivos de log de retransmissão subsequentes. Se a variável de sistema `binlog_rotate_encryption_master_key_at_startup` for definida como `OFF`, que é o padrão, a chave mestre do log binário existente é usada novamente após o servidor ser reiniciado. Para obter mais informações sobre as chaves de criptografia do log binário e a chave mestre do log binário, consulte a Seção 19.3.2, “Criptografando Arquivos de Log Binário e Arquivos de Log de Retransmissão”.

- `binlog_row_event_max_size`

  <table summary="Propriedades para log-bin-index"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--log-bin-index=file_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>log_bin_index</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>1

  Quando o registro binário baseado em linhas é usado, essa configuração é um limite suave para o tamanho máximo de um evento de registro binário baseado em linhas, em bytes. Sempre que possível, as linhas armazenadas no log binário são agrupadas em eventos com um tamanho não superior ao valor dessa configuração. Se um evento não puder ser dividido, o tamanho máximo pode ser excedido. O valor padrão é de 8192 bytes.

  Essa variável de sistema global é de leitura somente e pode ser definida apenas no início do servidor. Seu valor, portanto, só pode ser modificado usando a palavra-chave `PERSIST_ONLY` ou o qualificador `@@persist_only` com a instrução `SET`.

- `binlog_row_image`

  <table summary="Propriedades para log-bin-index"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--log-bin-index=file_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>log_bin_index</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>2

  Para a replicação baseada em linhas do MySQL, essa variável determina como as imagens das linhas são escritas no log binário.

  Definir o valor da sessão desta variável de sistema é uma operação restrita. O usuário da sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Consulte a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”.

  Na replicação baseada em linhas do MySQL, cada evento de mudança de linha contém duas imagens, uma imagem “antes” cujas colunas são comparadas ao buscar a linha a ser atualizada, e uma imagem “depois” que contém as alterações. Normalmente, o MySQL registra linhas completas (ou seja, todas as colunas) tanto para as imagens antes quanto depois. No entanto, não é estritamente necessário incluir todas as colunas em ambas as imagens, e muitas vezes podemos economizar espaço em disco, memória e uso de rede ao registrar apenas as colunas que são realmente necessárias.

  Nota

  Ao excluir uma linha, apenas a imagem anterior é registrada, uma vez que não há valores alterados para serem propagados após a exclusão. Ao inserir uma linha, apenas a imagem posterior é registrada, uma vez que não há uma linha existente para ser correspondida. Somente ao atualizar uma linha, as imagens anterior e posterior são necessárias e ambas são escritas no log binário.

  Para a imagem anterior, é necessário apenas que o conjunto mínimo de colunas necessário para identificar de forma única as linhas seja registrado. Se a tabela que contém a linha tiver uma chave primária, então apenas a(s) coluna(s) da chave primária será(ão) escrita(s) no log binário. Caso contrário, se a tabela tiver uma chave única cujas colunas são todas `NOT NULL`, então apenas as colunas da chave única precisam ser registradas. (Se a tabela não tiver nem uma chave primária nem uma chave única sem quaisquer colunas `NULL`, então todas as colunas devem ser usadas na imagem anterior e registradas.) Na imagem posterior, é necessário registrar apenas as colunas que realmente mudaram.

  Você pode fazer com que o servidor registre linhas completas ou mínimas usando a variável de sistema `binlog_row_image`. Essa variável, na verdade, assume um dos três valores possíveis, conforme mostrado na lista a seguir:

  - `full`: Registre todas as colunas na imagem anterior e na imagem posterior.

  - `minimal`: Registre apenas as colunas da imagem anterior que são necessárias para identificar a linha que será alterada; registre apenas as colunas da imagem final onde um valor foi especificado pelo comando SQL ou gerado por autoincremento.

  - `noblob`: Registre todas as colunas (mesmo que `full`), exceto as colunas `BLOB` e `TEXT`, que não são necessárias para identificar as linhas ou que não foram alteradas.

  Nota

  Esta variável não é suportada pelo NDB Cluster; definir isso não tem efeito na logagem das tabelas `NDB`.

  O valor padrão é `full`.

  Ao usar `minimal` ou `noblob`, as operações de exclusão e atualização são garantidas para funcionar corretamente para uma tabela específica se e somente se as seguintes condições forem verdadeiras tanto para a tabela de origem quanto para a tabela de destino:

  - Todas as colunas devem estar presentes e na mesma ordem; cada coluna deve usar o mesmo tipo de dado que sua contraparte na outra tabela.

  - As tabelas devem ter definições de chave primária idênticas.

  (Em outras palavras, as tabelas devem ser idênticas, com a possível exceção de índices que não fazem parte das chaves primárias das tabelas.)

  Se essas condições não forem atendidas, é possível que os valores das colunas da chave primária na tabela de destino possam não ser suficientes para fornecer uma correspondência única para uma exclusão ou atualização. Nesse caso, nenhum aviso ou erro é emitido; a fonte e a réplica divergem silenciosamente, rompendo assim a consistência.

  Definir essa variável não tem efeito quando o formato de registro binário é `STATEMENT`. Quando `binlog_format` é `MIXED`, o ajuste para `binlog_row_image` é aplicado às alterações registradas usando o formato baseado em linhas, mas esse ajuste não tem efeito nas alterações registradas como instruções.

  Definir `binlog_row_image` no nível global ou de sessão não causa um commit implícito; isso significa que essa variável pode ser alterada enquanto uma transação estiver em andamento sem afetar a transação.

- `binlog_row_metadata`

  <table summary="Propriedades para log-bin-index"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--log-bin-index=file_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>log_bin_index</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>3

  Configura a quantidade de metadados da tabela adicionados ao log binário ao usar o registro baseado em linhas. Quando definido para `MINIMAL`, o padrão, apenas os metadados relacionados aos `SIGNED` flags, conjuntos de caracteres de coluna e tipos de geometria são registrados. Quando definido para `FULL`, metadados completos para tabelas são registrados, como o nome da coluna, valores de string `ENUM` ou `SET`, informações `PRIMARY KEY` e assim por diante.

  Os metadados estendidos servem para os seguintes propósitos:

  - As réplicas utilizam os metadados para transferir dados quando a estrutura da tabela é diferente da do banco de origem.

  - O software externo pode usar os metadados para decodificar eventos de linha e armazenar os dados em bancos de dados externos, como um armazém de dados.

- `binlog_row_value_options`

  <table summary="Propriedades para log-bin-index"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--log-bin-index=file_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>log_bin_index</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>4

  Quando configurado para `PARTIAL_JSON`, isso permite o uso de um formato de log binário eficiente em termos de espaço para atualizações que modificam apenas uma pequena parte de um documento JSON, o que faz com que a replicação baseada em linhas escreva apenas as partes modificadas do documento JSON na imagem posterior para a atualização no log binário, em vez de escrever todo o documento (veja Atualizações Parciais de Valores JSON). Isso funciona para uma declaração `UPDATE` que modifica uma coluna JSON usando qualquer sequência de `JSON_SET()`, `JSON_REPLACE()` e `JSON_REMOVE()`. Se o servidor não conseguir gerar uma atualização parcial, o documento completo é usado.

  O valor padrão é uma string vazia, o que desabilita o uso do formato. Para desativar `binlog_row_value_options` e voltar a escrever o documento JSON completo, defina seu valor para a string vazia.

  Definir o valor da sessão desta variável de sistema é uma operação restrita. O usuário da sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Consulte a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”.

  `binlog_row_value_options=PARTIAL_JSON` entra em vigor apenas quando o registro binário está habilitado e `binlog_format` está definido como `ROW` ou `MIXED`. A replicação baseada em declarações *sempre* registra apenas as partes modificadas do documento JSON, independentemente de qualquer valor definido para `binlog_row_value_options`. Para maximizar a quantidade de espaço economizado, use `binlog_row_image=NOBLOB` ou `binlog_row_image=MINIMAL` junto com esta opção. `binlog_row_image=FULL` economiza menos espaço do que qualquer uma dessas opções, uma vez que o documento JSON completo é armazenado na imagem anterior, e a atualização parcial é armazenada apenas na imagem posterior.

  A saída do **mysqlbinlog** inclui atualizações parciais do JSON na forma de eventos codificados como strings base64 usando as instruções `BINLOG`. Se a opção `--verbose` for especificada, o **mysqlbinlog** exibe as atualizações parciais do JSON como JSON legível usando instruções pseudo-SQL.

  A replicação do MySQL gera um erro se uma modificação não puder ser aplicada ao documento JSON na réplica. Isso inclui a falha em encontrar o caminho. Tenha em mente que, mesmo com essa e outras verificações de segurança, se um documento JSON em uma réplica divergir do documento na fonte e uma atualização parcial for aplicada, ainda é teoricamente possível produzir um documento JSON válido, mas inesperado, na réplica.

- `binlog_rows_query_log_events`

  <table summary="Propriedades para log-bin-index"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--log-bin-index=file_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>log_bin_index</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>5

  Esta variável de sistema afeta apenas o registro baseado em linhas. Quando ativada, faz com que o servidor escreva eventos de registro informativos, como eventos de registro de consultas de linha, em seu log binário. Essas informações podem ser usadas para depuração e fins relacionados, como obter a consulta original emitida na fonte quando não puder ser reconstruída a partir das atualizações da linha.

  Definir o valor da sessão desta variável de sistema é uma operação restrita. O usuário da sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Consulte a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”.

  Esses eventos informativos são normalmente ignorados pelos programas do MySQL que leem o log binário e, portanto, não causam problemas durante a replicação ou restauração a partir de um backup. Para visualizá-los, aumente o nível de verbosidade usando a opção `--verbose` do mysqlbinlog duas vezes, seja como `-vv` ou `--verbose --verbose`.

- `binlog_stmt_cache_size`

  <table summary="Propriedades para log-bin-index"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--log-bin-index=file_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>log_bin_index</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>6

  O tamanho do buffer de memória para o log binário para armazenar declarações não transacionais emitidas durante uma transação.

  Quando o registro binário está habilitado no servidor (com a variável de sistema `log_bin` definida como ON), caches separados para transações e declarações de registro binário são alocados para cada cliente, se o servidor suportar algum mecanismo de armazenamento transacional. Se os dados das declarações não transacionais usadas na transação ultrapassarem o espaço no buffer de memória, os dados em excesso são armazenados em um arquivo temporário. Quando a criptografia do registro binário está ativa no servidor, o buffer de memória não é criptografado, mas (a partir do MySQL 8.0.17) qualquer arquivo temporário usado para armazenar o cache do registro binário é criptografado. Após cada transação ser confirmada, o cache de declarações do registro binário é redefinido, limpando o buffer de memória e truncando o arquivo temporário, se usado.

  Se você usa frequentemente grandes declarações não transacionais durante as transações, pode aumentar esse tamanho de cache para obter um melhor desempenho, reduzindo ou eliminando a necessidade de gravar em arquivos temporários. As variáveis de status `Binlog_stmt_cache_use` e `Binlog_stmt_cache_disk_use` podem ser úteis para ajustar o tamanho dessa variável. Veja a Seção 7.4.4, “O Log Binário”.

  A variável de sistema `binlog_cache_size` define o tamanho do cache de transações.

- `binlog_transaction_compression`

  <table summary="Propriedades para log-bin-index"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--log-bin-index=file_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>log_bin_index</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>7

  Habilita a compressão para transações que são escritas em arquivos de log binários neste servidor. `OFF` é o padrão. Use a variável de sistema `binlog_transaction_compression_level_zstd` para definir o nível do algoritmo `zstd` que é usado para compressão.

  A definição de `binlog_transaction_compression` não tem efeito imediato, mas se aplica a todas as declarações subsequentes de `START REPLICA` (`START SLAVE`).

  Quando a compressão de transações de log binário está habilitada, os payloads das transações são comprimidos e então escritos no arquivo de log binário como um único evento (`Transaction_payload_event`). Os payloads de transações comprimidos permanecem em um estado comprimido enquanto são enviados na corrente de replicação para réplicas, outros membros do grupo de replicação do grupo ou clientes como **mysqlbinlog**, e são escritos no log de retransmissão ainda em seu estado comprimido. A compressão de transações de log binário, portanto, economiza espaço de armazenamento tanto no remetente da transação quanto no destinatário (e para seus backups), e economiza largura de banda de rede quando as transações são enviadas entre instâncias do servidor.

  Para que o `binlog_transaction_compression=ON` tenha um efeito direto, o registro binário deve estar habilitado no servidor. Quando uma instância do servidor MySQL não tem um log binário, se estiver em uma versão anterior do MySQL 8.0.20, ela pode receber, processar e exibir cargas de trabalho de transações compactadas, independentemente de seu valor para `binlog_transaction_compression`. As cargas de trabalho de transações compactadas recebidas por tais instâncias de servidor são escritas em seu estado compactado no log de retransmissão, então elas se beneficiam indiretamente da compressão realizada por outros servidores na topologia de replicação.

  Essa variável de sistema não pode ser alterada no contexto de uma transação. Definir o valor da sessão dessa variável de sistema é uma operação restrita. O usuário da sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Consulte a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”.

  Para obter mais informações sobre a compressão de transações de log binário, incluindo detalhes sobre quais eventos são e não são comprimidos, e sobre as mudanças de comportamento quando a compressão de transações está em uso, consulte a Seção 7.4.4.5, “Compressão de Transações de Log Binário”.

  *Antes da NDB 8.0.31*: Definir essa variável quando o servidor estiver em execução não tem efeito na log de transações nas tabelas `NDB`. A compressão de transações de log binário pode ser habilitada para as tabelas `NDB` iniciando o MySQL com `--binlog-transaction-compression=ON` na linha de comando ou em um arquivo de opção, mas não pode ser habilitada ou desabilitada enquanto o servidor estiver em execução.

  *No NDB 8.0.31 e versões posteriores*: Você pode usar a variável de sistema `ndb_log_transaction_compression` para habilitar este recurso para `NDB`. Além disso, definir `--binlog-transaction-compression=ON` na linha de comando ou em um arquivo `my.cnf` faz com que `ndb_log_transaction_compression` seja habilitado na inicialização do servidor. Consulte a descrição da variável para obter mais informações.

- `binlog_transaction_compression_level_zstd`

  <table summary="Propriedades para log-bin-index"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--log-bin-index=file_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>log_bin_index</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>8

  Define o nível de compressão para a compressão de transações de log binário neste servidor, que é habilitado pela variável de sistema `binlog_transaction_compression`. O valor é um inteiro que determina o esforço de compressão, de 1 (o menor esforço) a 22 (o maior esforço). Se você não especificar essa variável de sistema, o nível de compressão será definido como 3.

  A definição de `binlog_transaction_compression_level_zstd` não tem efeito imediato, mas se aplica a todas as declarações subsequentes de `START REPLICA` (`START SLAVE`).

  À medida que o nível de compressão aumenta, a taxa de compressão dos dados também aumenta, o que reduz o espaço de armazenamento e a largura de banda da rede necessários para o payload da transação. No entanto, o esforço necessário para a compressão dos dados também aumenta, consumindo tempo e recursos de CPU e memória no servidor de origem. O aumento do esforço de compressão não tem uma relação linear com o aumento da taxa de compressão dos dados.

  Essa variável de sistema não pode ser alterada no contexto de uma transação. Definir o valor da sessão dessa variável de sistema é uma operação restrita. O usuário da sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Consulte a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”.

  Essa variável não tem efeito no registro de transações nas tabelas `NDB`; no NDB Cluster 8.0.31 e versões posteriores, você pode usar `ndb_log_transaction_compression_level_zstd` em vez disso.

- `binlog_transaction_dependency_tracking`

  <table summary="Propriedades para log-bin-index"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--log-bin-index=file_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>log_bin_index</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>9

  Para um servidor de origem de replicação que possui réplicas multithread (réplicas nas quais `replica_parallel_workers` ou `slave_parallel_workers` é maior que 0), `binlog_transaction_dependency_tracking` especifica como o **mysqld** da origem gera as informações de dependência que ele escreve no log binário para ajudar as réplicas a determinar quais transações podem ser executadas em paralelo.

  As informações de dependência escritas pela fonte de replicação são representadas por temporizadores lógicos. (Portanto, para definir essa variável, é necessário que `replica_parallel_type` ou `slave_parallel_type` já estejam definidos como `LOGICAL_CLOCK`.) Há dois temporizadores lógicos, listados aqui, para cada transação:

  - `sequence_number`: Este é 1 para a primeira transação em um log binário específico, 2 para a segunda transação, e assim por diante. A numeração reinicia com 1 em cada arquivo de log binário.

  - `last_committed`: Isso se refere ao `sequence_number` da transação mais recentemente realizada que foi encontrada em conflito com a transação atual. Esse valor é sempre menor que `sequence_number`.

  `binlog_transaction_dependency_tracking` controla a escolha do esquema usado para calcular esses timestamps lógicos. As opções disponíveis estão listadas aqui:

  - `COMMIT_ORDER`: Duas transações são consideradas independentes se a janela de tempo de commit da primeira transação sobrepõe-se à janela de tempo de commit da segunda transação. Isso é o padrão.

    A janela de tempo de commit começa imediatamente após a execução da última instrução da transação e termina imediatamente antes do commit do motor de armazenamento terminar. Como as transações mantêm todos os bloqueios de linha entre esses dois pontos no tempo, sabemos que elas não podem atualizar as mesmas linhas.

  - `WRITESET`: Os timestamps lógicos são calculados com base em `COMMIT_ORDER` em combinação com um segundo esquema baseado em conjuntos de escrita para a transação. Cada linha da transação adiciona um conjunto de um ou mais hashes ao conjunto de escrita da transação, um de cada chave única na linha. (Se não houver chaves únicas e não nulas, é usado um hash da linha.) Isso inclui tanto linhas excluídas quanto linhas inseridas; para linhas atualizadas, tanto a linha antiga quanto a nova também são incluídas.

    Duas transações são consideradas conflitantes se seus conjuntos de escrita se sobrepõem — ou seja, se houver algum número (hash) que ocorre nos conjuntos de escrita de ambas as transações. Além disso, devido à maneira como os conjuntos de escrita são calculados, existem pontos de serialização periódicos, de modo que o processo de cálculo do conjunto de escrita considera cada transação após um ponto de serialização como conflitante com cada transação antes do ponto de serialização. Os pontos de serialização afetam apenas as dependências calculadas pelo algoritmo `WRITESET`; transações em lados opostos do ponto de serialização podem ter janelas de commit sobrepostas, e assim podem ser paralelizadas na replica, apesar disso. Os pontos de serialização ocorrem para declarações DDL, para transações que atualizam uma tabela com uma chave estrangeira e para transações em que o valor da sessão de `transaction_write_set_extraction` não é o mesmo que o valor global. Um ponto de serialização também é imposto se as transações comprometidas desde o ponto de serialização anterior geraram um total de pelo menos `binlog_transaction_dependency_history_size` hashes únicos.

    Para que as réplicas multithreads funcionem com a replicação do NDB Cluster (suportada no NDB 8.0.33 e versões posteriores), essa variável deve ser definida como `WRITESET` na fonte. Consulte a Seção 25.7.11, “Replicação do NDB Cluster Usando o Aplicador Multithreads”, para obter mais informações.

  - `WRITESET_SESSION`: Duas transações são consideradas dependentes se uma das seguintes afirmações for verdadeira:

    - As transações dependem de acordo com `WRITESET`.

    - As transações foram realizadas na mesma sessão do usuário.

  No modo `WRITESET` ou `WRITESET_SESSION`, a fonte usa `COMMIT_ORDER` para gerar informações de dependência para transações que têm conjuntos de escrita vazios ou parciais, transações que atualizam tabelas sem chaves primárias ou únicas e transações que atualizam tabelas pai em uma relação de chave estrangeira.

  Para definir `binlog_transaction_dependency_tracking` para `WRITESET` ou `WRITESET_SESSION`, `transaction_write_set_extraction` deve ser definido para um valor diferente de `OFF`; o valor padrão (`XXHASH64`) é suficiente para isso. `transaction_write_set_extraction` não pode ser alterado sempre que o valor de `binlog_transaction_dependency_tracking` for `WRITESET` ou `WRITESET_SESSION`. Qualquer alteração no valor não terá efeito para transações replicadas até que a replica tenha sido parada e reiniciada com `STOP REPLICA` e `START REPLICA`.

  O número de hashes de linha a serem mantidos e verificados para determinar se a última transação alterou uma determinada linha é determinado pelo valor de `binlog_transaction_dependency_history_size`.

  A Replicação em Grupo realiza sua própria paralelização após a certificação ao aplicar transações do log de retransmissão, independentemente de qualquer valor definido para `binlog_transaction_dependency_tracking`, mas essa variável afeta a forma como as transações são escritas nos logs binários dos membros da Replicação em Grupo. As informações de dependência nesses logs são usadas para auxiliar o processo de transferência de estado de um log binário do doador para a recuperação distribuída, que ocorre sempre que um membro se junta ou retorna ao grupo. Para esse processo, definir `binlog_transaction_dependency_tracking` para `WRITESET` pode melhorar o desempenho de um membro do grupo, dependendo da carga de trabalho do grupo.

- `binlog_transaction_dependency_history_size`

  <table summary="Propriedades para binlog-do-db"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--binlog-do-db=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>0

  Define um limite superior para o número de hashes de linha que são mantidos na memória e usados para procurar a transação que modificou a última uma determinada linha. Quando esse número de hashes é atingido, o histórico é apagado.

- `expire_logs_days`

  <table summary="Propriedades para binlog-do-db"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--binlog-do-db=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>1

  Especifica o número de dias antes da remoção automática dos arquivos de log binário. `expire_logs_days` é desatualizado e você deve esperar que ele seja removido em uma futura versão. Em vez disso, use `binlog_expire_logs_seconds`, que define o período de validade do log binário em segundos. Se você não definir um valor para nenhuma das variáveis de sistema, o período de validade padrão é de 30 dias. As remoções possíveis ocorrem ao iniciar o sistema e quando o log binário é esvaziado. O esvaziamento do log ocorre conforme indicado na Seção 7.4, “Logs do MySQL Server”.

  Qualquer valor não nulo que você especificar na inicialização para `expire_logs_days` é ignorado se `binlog_expire_logs_seconds` também for especificado, e o valor de `binlog_expire_logs_seconds` é usado como o período de expiração do log binário. Uma mensagem de aviso é emitida nessa situação. Um valor de inicialização não nulo para `expire_logs_days` só é aplicado como o período de expiração do log binário se `binlog_expire_logs_seconds` não for especificado ou for especificado como 0.

  Durante a execução, não é possível definir `binlog_expire_logs_seconds` ou `expire_logs_days` para um valor não nulo se o outro estiver definido para um valor não nulo. Como o valor padrão para `binlog_expire_logs_seconds` é não nulo, você deve definir explicitamente `binlog_expire_logs_seconds` para zero antes de poder definir ou alterar o valor de `expire_logs_days`.

  Para desabilitar a limpeza automática do log binário, especifique explicitamente o valor 0 para `binlog_expire_logs_seconds` e não especifique um valor para `expire_logs_days`. Para compatibilidade com versões anteriores, a limpeza automática também é desativada se você especificar explicitamente o valor 0 para `expire_logs_days` e não especificar um valor para `binlog_expire_logs_seconds`. Nesse caso, o valor padrão para `binlog_expire_logs_seconds` não é aplicado.

  Para remover arquivos de log binários manualmente, use a instrução `PURGE BINARY LOGS`. Veja a Seção 15.4.1.1, “Instrução PURGE BINARY LOGS”.

- `log_bin`

  <table summary="Propriedades para binlog-do-db"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--binlog-do-db=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>2

  Mostra o status do registro binário no servidor, habilitado (`ON`) ou desabilitado (`OFF`). Com o registro binário habilitado, o servidor registra todas as declarações que alteram dados no log binário, que é usado para backup e replicação. `ON` significa que o log binário está disponível, `OFF` significa que ele não está em uso. A opção `--log-bin` pode ser usada para especificar um nome de base e localização para o log binário.

  Em versões anteriores do MySQL, o registro binário estava desativado por padrão e era ativado se você especificar a opção `--log-bin`. A partir do MySQL 8.0, o registro binário está ativado por padrão, com a variável de sistema `log_bin` definida como `ON`, independentemente de você especificar a opção `--log-bin`. A exceção é se você usar o **mysqld** para inicializar o diretório de dados manualmente, invocando-o com a opção `--initialize` ou `--initialize-insecure`, quando o registro binário está desativado por padrão. É possível ativar o registro binário neste caso, especificando a opção `--log-bin`.

  Se a opção `--skip-log-bin` ou `--disable-log-bin` for especificada na inicialização, o registro binário é desativado, com a variável de sistema `log_bin` definida como `OFF`. Se qualquer uma dessas opções for especificada e `--log-bin` também for especificado, a opção especificada posteriormente terá precedência.

  Para obter informações sobre o formato e a gestão do log binário, consulte a Seção 7.4.4, “O Log Binário”.

- `log_bin_basename`

  <table summary="Propriedades para binlog-do-db"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--binlog-do-db=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>3

  Armazena o nome de base e o caminho dos arquivos de log binários, que podem ser definidos com a opção de servidor `--log-bin`. O comprimento máximo da variável é de 256. No MySQL 8.0, se a opção `--log-bin` não for fornecida, o nome de base padrão é `binlog`. Para compatibilidade com o MySQL 5.7, se a opção `--log-bin` for fornecida sem uma string ou com uma string vazia, o nome de base padrão é `host_name-bin`, usando o nome da máquina do host. A localização padrão é o diretório de dados.

- `log_bin_index`

  <table summary="Propriedades para binlog-do-db"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--binlog-do-db=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>4

  Armazena o nome de base e o caminho do arquivo de índice do log binário, que pode ser definido com a opção de servidor `--log-bin-index`. O comprimento máximo da variável é de 256.

- `log_bin_trust_function_creators`

  <table summary="Propriedades para binlog-do-db"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--binlog-do-db=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>5

  Esta variável é aplicada quando o registro binário está habilitado. Ela controla se os criadores de funções armazenadas podem ser confiáveis para não criar funções armazenadas que possam causar eventos inseguros serem escritos no log binário. Se definida para 0 (o padrão), os usuários não têm permissão para criar ou alterar funções armazenadas, a menos que tenham o privilégio `SUPER` além do privilégio `CREATE ROUTINE` ou `ALTER ROUTINE`. Uma configuração de 0 também impõe a restrição de que uma função deve ser declarada com a característica `DETERMINISTIC`, ou com a característica `READS SQL DATA` ou `NO SQL`. Se a variável for definida para 1, o MySQL não aplica essas restrições à criação de funções armazenadas. Esta variável também se aplica à criação de gatilhos. Veja a Seção 27.7, “Registro Binário de Programas Armazenados”.

- `log_bin_use_v1_row_events`

  <table summary="Propriedades para binlog-do-db"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--binlog-do-db=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>6

  Esta variável de sistema somente de leitura está desatualizada. Definir a variável de sistema para `ON` ao iniciar o servidor habilitou a replicação baseada em linhas com réplicas executando o MySQL Server 5.5 e versões anteriores, escrevendo o log binário usando eventos de linha de log binário da Versão 1, em vez da Versão 2 de log binário de linha, que é o padrão a partir do MySQL 5.6.

- `log_replica_updates`

  <table summary="Propriedades para binlog-do-db"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--binlog-do-db=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>7

  A partir do MySQL 8.0.26, use `log_replica_updates` no lugar de `log_slave_updates`, que foi descontinuado a partir dessa versão. Em versões anteriores ao MySQL 8.0.26, use `log_slave_updates`.

  `log_replica_updates` especifica se as atualizações recebidas por um servidor replica de um servidor de origem de replicação devem ser registradas no log binário próprio da replica.

  Ativação desta variável faz com que a replica escreva as atualizações recebidas de uma fonte e executadas pelo fio de replicação SQL no próprio log binário da replica. O registro binário, que é controlado pela opção `--log-bin` e ativado por padrão, também deve ser ativado na replica para que as atualizações sejam registradas. Veja a Seção 19.1.6, “Opções e Variáveis de Replicação e Registro Binário”. `log_replica_updates` é ativado por padrão, a menos que você especifique `--skip-log-bin` para desativar o registro binário, caso em que o MySQL também desativa o registro de atualização da replica por padrão. Se você precisar desativar o registro de atualização da replica quando o registro binário estiver ativado, especifique `--log-replica-updates=OFF` na inicialização do servidor da replica.

  Ativação de `log_replica_updates` permite que os servidores de replicação sejam encadeados. Por exemplo, você pode querer configurar servidores de replicação usando essa configuração:

  ```
  A -> B -> C
  ```

  Aqui, `A` serve como fonte para a replica `B`, e `B` serve como fonte para a replica `C`. Para que isso funcione, `B` deve ser tanto uma fonte *e* uma replica. Com o registro binário habilitado e `log_replica_updates` habilitado, que são as configurações padrão, as atualizações recebidas de `A` são registradas por `B` em seu log binário e, portanto, podem ser passadas para `C`.

- `log_slave_updates`

  <table summary="Propriedades para binlog-do-db"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--binlog-do-db=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>8

  A partir do MySQL 8.0.26, `log_slave_updates` é descontinuado e o alias `log_replica_updates` deve ser usado em vez disso. Em versões anteriores ao MySQL 8.0.26, use `log_slave_updates`.

  `log_slave_updates` especifica se as atualizações recebidas por um servidor replica de um servidor de origem de replicação devem ser registradas no log binário próprio da replica.

  Ativação desta variável faz com que a replica escreva as atualizações recebidas de uma fonte e executadas pelo fio de replicação SQL no próprio log binário da replica. O registro binário, que é controlado pela opção `--log-bin` e ativado por padrão, também deve ser ativado na replica para que as atualizações sejam registradas. Veja a Seção 19.1.6, “Opções e Variáveis de Replicação e Registro Binário”. `log_slave_updates` é ativado por padrão, a menos que você especifique `--skip-log-bin` para desativar o registro binário, caso em que o MySQL também desativa o registro de atualização da replica por padrão. Se você precisar desativar o registro de atualização da replica quando o registro binário estiver ativado, especifique `--log-slave-updates=OFF` na inicialização do servidor da replica.

  Ativação de `log_slave_updates` permite que os servidores de replicação sejam encadeados. Por exemplo, você pode querer configurar servidores de replicação usando essa configuração:

  ```
  A -> B -> C
  ```

  Aqui, `A` serve como fonte para a replica `B`, e `B` serve como fonte para a replica `C`. Para que isso funcione, `B` deve ser tanto uma fonte *e* uma replica. Com o registro binário habilitado e `log_slave_updates` habilitado, que são as configurações padrão, as atualizações recebidas de `A` são registradas por `B` em seu log binário e, portanto, podem ser passadas para `C`.

- `log_statements_unsafe_for_binlog`

  <table summary="Propriedades para binlog-do-db"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--binlog-do-db=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>9

  Se o erro 1592 for encontrado, controle se os avisos gerados serão adicionados ao log de erros ou

- `master_verify_checksum`

  <table summary="Propriedades para binlog-ignore-db"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--binlog-ignore-db=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>0

  A partir do MySQL 8.0.26, `master_verify_checksum` é descontinuado e o alias `source_verify_checksum` deve ser usado em vez disso. Em versões anteriores ao MySQL 8.0.26, use `master_verify_checksum`.

  Ativação de `master_verify_checksum` faz com que a fonte verifique os eventos lidos do log binário examinando os checksums e para com um erro em caso de discrepância. `master_verify_checksum` é desativado por padrão; nesse caso, a fonte usa o comprimento do evento do log binário para verificar os eventos, de modo que apenas eventos completos sejam lidos do log binário.

- `max_binlog_cache_size`

  <table summary="Propriedades para binlog-ignore-db"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--binlog-ignore-db=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>1

  Se uma transação exigir mais de esse número de bytes, o servidor gera um erro de transação de múltiplos comandos que exige mais de 'max\_binlog\_cache\_size' bytes de armazenamento. Quando `gtid_mode` não é `ON`, o valor máximo recomendado é de 4 GB, devido ao fato de que, neste caso, o MySQL não pode trabalhar com posições de log binário maiores que 4 GB; quando `gtid_mode` é `ON`, essa limitação não se aplica e o servidor pode trabalhar com posições de log binário de tamanho arbitrário.

  Se, por `gtid_mode` não ser `ON` ou por algum outro motivo, você precisar garantir que o log binário não exceda um tamanho dado `maxsize`, você deve definir essa variável de acordo com a fórmula mostrada aqui:

  ```
  max_binlog_cache_size <
    (((maxsize - max_binlog_size) / max_connections) - 1000) / 1.2
  ```

  Esse cálculo leva em consideração as seguintes condições:

  - O servidor escreve no log binário enquanto o tamanho antes de começar a escrever for menor que `max_binlog_size`.

  - O servidor não escreve transações individuais, mas sim grupos de transações. O número máximo de transações em um grupo é igual a `max_connections`.

  - O servidor escreve dados que não estão incluídos no cache. Isso inclui um checksum de 4 bytes para cada evento; embora isso aumente menos de 20% no tamanho da transação, esse valor não é desprezível. Além disso, o servidor escreve um `Gtid_log_event` para cada transação; cada um desses eventos pode adicionar mais 1 KB ao que é escrito no log binário.

  `max_binlog_cache_size` define o tamanho apenas para o cache de transações; o limite superior para o cache de declarações é regido pela variável de sistema `max_binlog_stmt_cache_size`.

  A visibilidade das sessões do `max_binlog_cache_size` é igual à da variável de sistema `binlog_cache_size`; em outras palavras, alterar seu valor afeta apenas as novas sessões iniciadas após a alteração do valor.

- `max_binlog_size`

  <table summary="Propriedades para binlog-ignore-db"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--binlog-ignore-db=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>2

  Se uma escrita no log binário causar que o tamanho atual do arquivo de log exceda o valor desta variável, o servidor rotaciona os logs binários (fecha o arquivo atual e abre o próximo). O valor mínimo é de 4096 bytes. O valor máximo e o valor padrão é de 1 GB. Os arquivos de log binário criptografados têm um cabeçalho adicional de 512 bytes, que está incluído em `max_binlog_size`.

  Uma transação é escrita em um único bloco no log binário, portanto, ela nunca é dividida entre vários logs binários. Portanto, se você tiver transações grandes, você pode ver arquivos de log binário maiores que `max_binlog_size`.

  Se `max_relay_log_size` for 0, o valor de `max_binlog_size` também será aplicado aos registros de relé.

  Com GTIDs em uso no servidor, quando o `max_binlog_size` é alcançado, se a tabela do sistema `mysql.gtid_executed` não puder ser acessada para gravar os GTIDs do arquivo de log binário atual, o log binário não poderá ser rotado. Nessa situação, o servidor responde de acordo com sua configuração `binlog_error_action`. Se o `IGNORE_ERROR` estiver definido, um erro será registrado no servidor e o registro binário será interrompido. Se o `ABORT_SERVER` estiver definido, o servidor será desligado.

- `max_binlog_stmt_cache_size`

  <table summary="Propriedades para binlog-ignore-db"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--binlog-ignore-db=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>3

  Se declarações não transacionais dentro de uma transação exigirem mais de quantos bytes de memória, o servidor gera um erro. O valor mínimo é de 4096. Os valores máximo e padrão são de 4 GB em plataformas de 32 bits e 16 EB (exabytes) em plataformas de 64 bits.

  `max_binlog_stmt_cache_size` define o tamanho apenas para o cache de declarações; o limite superior para o cache de transações é regido exclusivamente pela variável de sistema `max_binlog_cache_size`.

- `original_commit_timestamp`

  <table summary="Propriedades para binlog-ignore-db"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--binlog-ignore-db=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>4

  Para uso interno por replicação. Ao executar novamente uma transação em uma replica, este valor é definido para o momento em que a transação foi confirmada na fonte original, medido em microsegundos a partir da época. Isso permite que o timestamp de confirmação original seja propagado por toda a topologia de replicação.

  Definir o valor da sessão desta variável de sistema é uma operação restrita. O usuário da sessão deve ter o privilégio `REPLICATION_APPLIER` (consulte a Seção 19.3.3, “Verificação de Privilégios de Replicação”) ou privilégios suficientes para definir variáveis de sessão restritas (consulte a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”). No entanto, observe que a variável não é destinada para que os usuários a definam; ela é definida automaticamente pela infraestrutura de replicação.

- `source_verify_checksum`

  <table summary="Propriedades para binlog-ignore-db"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--binlog-ignore-db=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>5

  A partir do MySQL 8.0.26, use `source_verify_checksum` no lugar de `master_verify_checksum`, que foi descontinuado a partir dessa versão. Em versões anteriores ao MySQL 8.0.26, use `master_verify_checksum`.

  Ativação de `source_verify_checksum` faz com que a fonte verifique os eventos lidos do log binário examinando os checksums e para com um erro em caso de discrepância. `source_verify_checksum` é desativado por padrão; nesse caso, a fonte usa o comprimento do evento do log binário para verificar os eventos, de modo que apenas eventos completos sejam lidos do log binário.

- `sql_log_bin`

  <table summary="Propriedades para binlog-ignore-db"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--binlog-ignore-db=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>6

  Essa variável controla se o registro no log binário está habilitado para a sessão atual (assumindo que o próprio log binário esteja habilitado). O valor padrão é `ON`. Para desabilitar ou habilitar o registro binário para a sessão atual, defina a variável da sessão `sql_log_bin` para `OFF` ou `ON`.

  Defina essa variável para `OFF` para uma sessão desativar temporariamente o registro binário enquanto você faz alterações na fonte que você não deseja replicar para a replica.

  Definir o valor da sessão desta variável de sistema é uma operação restrita. O usuário da sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Consulte a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”.

  Não é possível definir o valor da sessão de `sql_log_bin` dentro de uma transação ou subconsulta.

  *Definir essa variável como `OFF` impede que GTIDs sejam atribuídos às transações no log binário*. Se você estiver usando GTIDs para replicação, isso significa que, mesmo quando o registro binário for habilitado novamente, os GTIDs escritos no log a partir desse ponto não considerarão quaisquer transações que ocorreram nesse período, portanto, essas transações serão perdidas.

- `sync_binlog`

  <table summary="Propriedades para binlog-ignore-db"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--binlog-ignore-db=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>7

  Controla a frequência com que o servidor MySQL sincroniza o log binário com o disco.

  - `sync_binlog=0`: Desabilita a sincronização do log binário com o disco pelo servidor MySQL. Em vez disso, o servidor MySQL depende do sistema operacional para esvaziar o log binário para o disco de tempos em tempos, como faz com qualquer outro arquivo. Esta configuração oferece o melhor desempenho, mas, em caso de falha de energia ou falha do sistema operacional, é possível que o servidor tenha comprometido transações que não foram sincronizadas com o log binário.

  - `sync_binlog=1`: Habilita a sincronização do log binário com o disco antes que as transações sejam confirmadas. Esta é a configuração mais segura, mas pode ter um impacto negativo no desempenho devido ao aumento do número de escritas no disco. Em caso de falha de energia ou falha do sistema operacional, as transações que estão ausentes do log binário estão apenas em um estado preparado. Isso permite que a rotina de recuperação automática desfaça as transações, o que garante que nenhuma transação seja perdida do log binário.

  - `sync_binlog=N`, onde `N` é um valor diferente de 0 ou 1: O log binário é sincronizado com o disco após os grupos de commit de log binário `N` terem sido coletados. Em caso de falha de energia ou falha do sistema operacional, é possível que o servidor tenha comprometido transações que não foram descarregadas para o log binário. Esta configuração pode ter um impacto negativo no desempenho devido ao aumento do número de escritas no disco. Um valor maior melhora o desempenho, mas aumenta o risco de perda de dados.

  Para a maior durabilidade e consistência possíveis em uma configuração de replicação que utiliza `InnoDB` com transações, use as seguintes configurações:

  - `sync_binlog=1`.
  - `innodb_flush_log_at_trx_commit=1`.

  Cuidado

  Muitos sistemas operacionais e alguns hardwares de disco enganam a operação de gravação no disco. Eles podem informar ao **mysqld** que a gravação ocorreu, mesmo que não tenha. Nesse caso, a durabilidade das transações não é garantida, mesmo com as configurações recomendadas, e, no pior dos casos, uma queda de energia pode corromper os dados do `InnoDB`. O uso de um cache de disco com bateria no controlador de disco SCSI ou no próprio disco acelera as gravação no disco e torna a operação mais segura. Você também pode tentar desativar o cache de gravação no disco em caches de hardware.

- `transaction_write_set_extraction`

  <table summary="Propriedades para binlog-ignore-db"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--binlog-ignore-db=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>8

  Esta variável de sistema especifica o algoritmo usado para hash os registros extraídos durante uma transação. O padrão é `XXHASH64`. `OFF` significa que os conjuntos de registros não são coletados.

  `transaction_write_set_extraction` está desatualizado a partir do MySQL 8.0.26; espere-se que ele seja removido em uma futura versão do MySQL.

  O ajuste `XXHASH64` é necessário para a Replicação em Grupo, onde o processo de extração das gravações de uma transação é usado para detecção de conflitos e certificação em todos os membros do grupo (veja a Seção 20.3.1, “Requisitos de Replicação em Grupo”). Para um servidor de origem de replicação que possui réplicas multithread (réplicas nas quais `replica_parallel_workers` ou `slave_parallel_workers` está definido para um valor maior que 0), onde `binlog_transaction_dependency_tracking` está definido para `WRITESET` ou `WRITESET_SESSION`, `transaction_write_set_extraction` não deve ser `OFF`. Embora o valor atual de `binlog_transaction_dependency_tracking` seja `WRITESET` ou `WRITESET_SESSION`, você não pode alterar o valor de `transaction_write_set_extraction`.

  A partir do MySQL 8.0.14, definir o valor da variável de sessão desta variável de sistema é uma operação restrita; o usuário da sessão deve ter privilégios suficientes para definir variáveis de sessão restritas (consulte a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”). `binlog_format` deve ser definido como `ROW` para alterar o valor de `transaction_write_set_extraction`. Se você alterar o valor, o novo valor não entrará em vigor em transações replicadas até que a replica tenha sido parada e reiniciada com `STOP REPLICA` e `START REPLICA`.
