#### 16.1.6.3 Opções e variáveis do servidor de replicação

Esta seção explica as opções do servidor e as variáveis do sistema que se aplicam às réplicas e contém o seguinte:

- Opções de inicialização para réplicas (replication-options-replica.html#replication-optvars-slaves)
- Opções para registrar o status da replicação em tabelas
- Variáveis de sistema usadas em réplicas

Especifique as opções na linha de comando (command-line-options.html) ou em um arquivo de opções (option-files.html). Muitas das opções podem ser definidas enquanto o servidor estiver em execução, usando a instrução `CHANGE MASTER TO`. Especifique os valores das variáveis de sistema usando `SET`.

**ID do servidor.** No servidor de origem e em cada réplica, você deve definir a variável de sistema `server_id` para estabelecer um ID de replicação único no intervalo de 1 a 232 − 1. "Único" significa que cada ID deve ser diferente de todas as outras IDs em uso por qualquer outra fonte ou réplica na topologia de replicação. Exemplo de arquivo `my.cnf`:

```sql
[mysqld]
server-id=3
```

##### Opções de inicialização para réplicas

Esta seção explica as opções de inicialização para controlar os servidores replicados. Muitas dessas opções podem ser definidas enquanto o servidor estiver em execução, usando a instrução `CHANGE MASTER TO`. Outras, como as opções `--replicate-*`, só podem ser definidas quando o servidor replicado for iniciado. As variáveis de sistema relacionadas à replicação são discutidas mais adiante nesta seção.

- `--log-warnings[=nível]`

  <table frame="box" rules="all" summary="Propriedades para avisos de log"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--log-warnings[=#]</code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="server-system-variables.html#sysvar_log_warnings">log_warnings</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>2</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td>[[<code>18446744073709551615</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td>[[<code>4294967295</code>]]</td> </tr></tbody></table>

  Nota

  A variável de sistema `log_error_verbosity` é preferida e deve ser usada em vez da opção `--log-warnings` ou da variável de sistema `log_warnings`. Para mais informações, consulte as descrições de `log_error_verbosity` e `log_warnings`. A opção de linha de comando `--log-warnings` e a variável de sistema `log_warnings` são desatualizadas; espere-se que sejam removidas em uma futura versão do MySQL.

  Faz com que o servidor registre mais mensagens no log de erro sobre o que está fazendo. Com relação à replicação, o servidor gera avisos de que conseguiu reconectar após uma falha na rede ou na conexão e fornece informações sobre como cada fio de replicação foi iniciado. Esta variável é definida como 2 por padrão. Para desabilitar, defina-a como 0. O servidor registra mensagens sobre instruções que são inseguras para o registro baseado em instruções se o valor for maior que 0. Conexões abortadas e erros de acesso negado para novas tentativas de conexão são registrados se o valor for maior que

  1. Consulte seção B.3.2.9, “Erros de comunicação e conexões interrompidas”.

  Nota

  Os efeitos dessa opção não se limitam à replicação. Ela afeta as mensagens de diagnóstico em uma variedade de atividades do servidor.

- `--master-info-file=nome_do_arquivo`

  <table frame="box" rules="all" summary="Propriedades para master-info-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--master-info-file=file_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>master.info</code>]]</td> </tr></tbody></table>

  O nome a ser usado para o arquivo no qual as gravações da replica armazenam informações sobre a fonte. O nome padrão é `master.info` no diretório de dados. Para obter informações sobre o formato desse arquivo, consulte Seção 16.2.4.2, “Repositórios de Metadados de Replicação”.

- [`--master-retry-count=count`](https://replication-options-replica.html#option_mysqld_master-retry-count)

  <table frame="box" rules="all" summary="Propriedades para master-retry-count"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--master-retry-count=#</code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>86400</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td>[[<code>18446744073709551615</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td>[[<code>4294967295</code>]]</td> </tr></tbody></table>

  O número de vezes que a replica tenta se reconectar à fonte antes de desistir. O valor padrão é de 86400 vezes. Um valor de 0 significa "infinito", e a replica tenta se conectar para sempre. As tentativas de reconexão são acionadas quando a replica atinge o seu tempo limite de conexão (especificado pela variável de sistema `slave_net_timeout`) sem receber dados ou um sinal de batida de coração da fonte. A reconexão é tentada em intervalos definidos pela opção `MASTER_CONNECT_RETRY` da instrução `CHANGE MASTER TO` (que tem como padrão a cada 60 segundos).

  Esta opção está desatualizada; espere que ela seja removida em uma futura versão do MySQL. Use a opção `MASTER_RETRY_COUNT` da instrução `CHANGE MASTER TO` em vez disso.

- `--max-relay-log-size=tamanho`

  <table frame="box" rules="all" summary="Propriedades para max_relay_log_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--max-relay-log-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="replication-options-replica.html#sysvar_max_relay_log_size">max_relay_log_size</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1073741824</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr><tr><th><a class="link" href="server-system-variables.html#system-variables-block-size" title="Nota">Tamanho do bloco</a></th> <td>[[<code>4096</code>]]</td> </tr></tbody></table>

  O tamanho em que o servidor roda os arquivos de log do retransmissor automaticamente. Se esse valor for diferente de zero, o log do retransmissor será rodado automaticamente quando seu tamanho exceder esse valor. Se esse valor for zero (o padrão), o tamanho em que a rotação do log do retransmissor ocorre é determinado pelo valor de `max_binlog_size`. Para mais informações, consulte Seção 16.2.4.1, “O Log do Retransmissor”.

- `--relay-log-purge={0|1}`

  <table frame="box" rules="all" summary="Propriedades para relay_log_purge"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--relay-log-purge[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="replication-options-replica.html#sysvar_relay_log_purge">relay_log_purge</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>

  Desative ou ative a limpeza automática dos logs do relé assim que eles não forem mais necessários. O valor padrão é 1 (ativado). Esta é uma variável global que pode ser alterada dinamicamente com `SET GLOBAL relay_log_purge = N`. A desativação da limpeza dos logs do relé ao habilitar a opção [`--relay-log-recovery`](https://docs.mariadb.org/replication-options-replica.html#sysvar_relay_log_recovery) coloca a consistência dos dados em risco.

- `--relay-log-space-limit=tamanho`

  <table frame="box" rules="all" summary="Propriedades para relay_log_space_limit"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--relay-log-space-limit=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="replication-options-replica.html#sysvar_relay_log_space_limit">relay_log_space_limit</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>18446744073709551615</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></tbody></table>

  Esta opção estabelece um limite superior para o tamanho total em bytes de todos os logs de relevo na replica. Um valor de 0 significa “sem limite”. Isso é útil para um servidor de replica que tem espaço em disco limitado. Quando o limite é atingido, o fio de I/O de replicação para de ler eventos de log binário da fonte até que o fio de SQL de replicação consiga recuperar e excluir alguns logs de relevo não utilizados. Observe que esse limite não é absoluto: há casos em que o fio de SQL precisa de mais eventos antes de poder excluir logs de relevo. Nesse caso, o fio de I/O excede o limite até que seja possível para o fio de SQL excluir alguns logs de relevo, pois não fazer isso causaria um impasse. Você não deve definir `--relay-log-space-limit` para menos que o dobro do valor de `--max-relay-log-size` (ou `--max-binlog-size` se `--max-relay-log-size` for 0). Nesse caso, há uma chance de que o fio de I/O espere por espaço livre porque `--relay-log-space-limit` é excedido, mas o fio de SQL não tem nenhum log de relevo para purgar e não consegue satisfazer o fio de I/O. Isso obriga o fio de I/O a ignorar `--relay-log-space-limit` temporariamente.

- `--replicate-do-db=nome_do_db`

  <table frame="box" rules="all" summary="Propriedades para replicate-do-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--replicate-do-db=name</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Cria um filtro de replicação usando o nome de um banco de dados. Esses filtros também podem ser criados usando `CHANGE REPLICATION FILTER REPLICATE_DO_DB`. O efeito preciso desse filtro depende se a replicação baseada em declarações ou baseada em linhas está em uso, e são descritos nos próximos parágrafos.

  Importante

  Os filtros de replicação não podem ser usados em uma instância do servidor MySQL configurada para replicação por grupo, porque filtrar transações em alguns servidores tornaria o grupo incapaz de chegar a um acordo sobre um estado consistente.

  **Replicação baseada em declarações.** Diga ao fio de SQL de replicação para restringir a replicação a declarações onde o banco de dados padrão (ou seja, aquele selecionado por `USE`) é *`db_name`*. Para especificar mais de um banco de dados, use esta opção várias vezes, uma vez para cada banco de dados; no entanto, isso *não* replica declarações entre bancos, como `UPDATE some_db.some_table SET foo='bar'` enquanto um banco de dados diferente (ou nenhum banco de dados) é selecionado.

  Aviso

  Para especificar múltiplas bases de dados, você *deve* usar múltiplas instâncias desta opção. Como os nomes de banco de dados podem conter vírgulas, se você fornecer uma lista separada por vírgula, a lista será tratada como o nome de uma única base de dados.

  Um exemplo do que não funciona conforme o esperado ao usar a replicação baseada em declarações: Se a replica for iniciada com `--replicate-do-db=sales` e você emitir as seguintes declarações na fonte, a declaração `UPDATE` *não* será replicada:

  ```sql
  USE prices;
  UPDATE sales.january SET amount=amount+1000;
  ```

  A principal razão para esse comportamento de "verificar apenas o banco de dados padrão" é que, a partir da declaração sozinha, é difícil saber se ele deve ser replicado (por exemplo, se você estiver usando várias declarações de `DELETE` (delete.html) ou várias declarações de `UPDATE` (update.html) que atuam em vários bancos de dados). Também é mais rápido verificar apenas o banco de dados padrão em vez de todos os bancos de dados, se não houver necessidade.

  **Replicação baseada em linhas.** Diz ao fio de SQL de replicação para restringir a replicação ao banco de dados *`db_name`*. Somente as tabelas pertencentes a *`db_name`* são alteradas; o banco de dados atual não tem efeito sobre isso. Suponha que a replica seja iniciada com `--replicate-do-db=sales` e a replicação baseada em linhas estiver em vigor, e então as seguintes instruções são executadas na fonte:

  ```sql
  USE prices;
  UPDATE sales.february SET amount=amount+100;
  ```

  A tabela `february` no banco de dados `sales` na replica é alterada de acordo com a instrução `[UPDATE]` (update.html); isso ocorre independentemente de a instrução `[USE]` (use.html) ter sido emitida ou não. No entanto, emitir as seguintes instruções na fonte não tem efeito na replica ao usar a replicação baseada em linhas e `--replicate-do-db=sales` (replication-options-replica.html#option\_mysqld\_replicate-do-db):

  ```sql
  USE prices;
  UPDATE prices.march SET amount=amount-25;
  ```

  Mesmo que a declaração `USE prices` fosse alterada para `USE sales`, os efeitos da declaração `UPDATE` ainda não seriam replicados.

  Outra diferença importante na forma como a replicação baseada em declarações é tratada em relação à replicação baseada em linhas, em comparação com a replicação baseada em declarações, ocorre em relação às declarações que se referem a múltiplas bases de dados. Suponha que a replica seja iniciada com `--replicate-do-db=db1`, e as seguintes declarações forem executadas na fonte:

  ```sql
  USE db1;
  UPDATE db1.table1, db2.table2 SET db1.table1.col1 = 10, db2.table2.col2 = 20;
  ```

  Se você estiver usando a replicação baseada em declarações, ambas as tabelas serão atualizadas na replica. No entanto, ao usar a replicação baseada em linhas, apenas `table1` será afetada na replica; como `table2` está em um banco de dados diferente, `table2` na replica não será alterada pela `UPDATE`. Agora, suponha que, em vez da declaração `USE db1`, tivesse sido usada a declaração `USE db4`:

  ```sql
  USE db4;
  UPDATE db1.table1, db2.table2 SET db1.table1.col1 = 10, db2.table2.col2 = 20;
  ```

  Neste caso, a instrução `UPDATE` não teria efeito na réplica ao usar a replicação baseada em instruções. No entanto, se você estiver usando a replicação baseada em linhas, a instrução `UPDATE` mudaria `table1` na réplica, mas não `table2` — em outras palavras, apenas as tabelas no banco de dados nomeado por `--replicate-do-db` são alteradas, e a escolha do banco de dados padrão não tem efeito nesse comportamento.

  Se você precisar que as atualizações entre bancos de dados funcionem, use `--replicate-wild-do-table=db_name.%` em vez disso. Veja Seção 16.2.5, “Como os servidores avaliam as regras de filtragem de replicação”.

  Nota

  Esta opção afeta a replicação da mesma maneira que `--binlog-do-db` afeta o registro binário, e os efeitos do formato de replicação sobre como `--replicate-do-db` afeta o comportamento da replicação são os mesmos que os do formato de registro sobre o comportamento de `--binlog-do-db`.

  Esta opção não tem efeito nas instruções `BEGIN`, `COMMIT` ou `ROLLBACK`.

- `--replicate-ignore-db=nome_do_db`

  <table frame="box" rules="all" summary="Propriedades para replicar-ignorar-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--replicate-ignore-db=name</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Cria um filtro de replicação usando o nome de um banco de dados. Esses filtros também podem ser criados usando `CHANGE REPLICATION FILTER REPLICATE_IGNORE_DB`. Assim como com `--replicate-do-db`, o efeito preciso desse filtro depende se a replicação baseada em declarações ou baseada em linhas está em uso, e são descritos nos próximos parágrafos.

  Importante

  Os filtros de replicação não podem ser usados em uma instância do servidor MySQL configurada para replicação por grupo, porque filtrar transações em alguns servidores tornaria o grupo incapaz de chegar a um acordo sobre um estado consistente.

  **Replicação baseada em declarações.** Diz ao fio de SQL de replicação que não replique nenhuma declaração onde o banco de dados padrão (ou seja, aquele selecionado por `USE`) é *`db_name`*.

  **Replicação baseada em linhas.** Diz ao fio de SQL de replicação para não atualizar nenhuma tabela no banco de dados *`db_name`*. O banco de dados padrão não tem efeito.

  Ao usar a replicação baseada em declarações, o seguinte exemplo não funciona conforme o esperado. Suponha que a replicação seja iniciada com `--replicate-ignore-db=sales` e você emitir as seguintes declarações na fonte:

  ```sql
  USE prices;
  UPDATE sales.january SET amount=amount+1000;
  ```

  A declaração `UPDATE` *é* replicada nesse caso porque `--replicate-ignore-db` se aplica apenas ao banco de dados padrão (determinado pela declaração `USE`). Como o banco de dados `sales` foi especificado explicitamente na declaração, a declaração não foi filtrada. No entanto, ao usar a replicação baseada em linhas, os efeitos da declaração `UPDATE` *não* são propagados para a replica, e a cópia da tabela `sales.january` da replica permanece inalterada; nesse caso, `--replicate-ignore-db=sales` faz com que *todas* as alterações feitas nas tabelas na cópia do banco de dados `sales` da fonte sejam ignoradas pela replica.

  Para especificar mais de um banco de dados a ser ignorado, use essa opção várias vezes, uma vez para cada banco de dados. Como os nomes dos bancos de dados podem conter vírgulas, se você fornecer uma lista separada por vírgula, a lista será tratada como o nome de um único banco de dados.

  Você não deve usar essa opção se estiver usando atualizações entre bancos de dados e não quiser que essas atualizações sejam replicadas. Veja Seção 16.2.5, “Como os Servidores Avaliam as Regras de Filtragem de Replicação”.

  Se você precisar que as atualizações entre bancos de dados funcionem, use `--replicate-wild-ignore-table=db_name.%` em vez disso. Veja Seção 16.2.5, “Como os servidores avaliam as regras de filtragem de replicação”.

  Nota

  Esta opção afeta a replicação da mesma maneira que [`--binlog-ignore-db`](https://pt.wikipedia.org/wiki/Replicação_\(base_de_dados\)#Op%C3%A7%C3%A3o_mysqld_binlog-ignore-db) afeta o registro binário, e os efeitos do formato de replicação sobre como [`--replicate-ignore-db`](https://pt.wikipedia.org/wiki/Replicação_\(base_de_dados\)#Op%C3%A3o_mysqld_replicate-ignore-db) afeta o comportamento da replicação são os mesmos que os do formato de registro sobre o comportamento de [`--binlog-ignore-db`](https://pt.wikipedia.org/wiki/Replicação_\(base_de_dados\)#Op%C3%A3o_mysqld_binlog-ignore-db).

  Esta opção não tem efeito nas instruções `BEGIN`, `COMMIT` ou `ROLLBACK`.

- [`--replicate-do-table=db_name.tbl_name`](https://replication-options-replica.html#option_mysqld_replicate-do-table)

  <table frame="box" rules="all" summary="Propriedades para replicate-do-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--replicate-do-table=name</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Cria um filtro de replicação, informando ao fio SQL de replicação para restringir a replicação a uma determinada tabela. Para especificar mais de uma tabela, use essa opção várias vezes, uma vez para cada tabela. Isso funciona tanto para atualizações cruzadas entre bancos de dados quanto para atualizações padrão de bancos de dados, em contraste com `--replicate-do-db`. Veja Seção 16.2.5, “Como os Servidores Avaliam as Regras de Filtragem de Replicação”. Você também pode criar tal filtro emitindo uma declaração `CHANGE REPLICATION FILTER REPLICATE_DO_TABLE`.

  Importante

  Os filtros de replicação não podem ser usados em uma instância do servidor MySQL configurada para replicação por grupo, porque filtrar transações em alguns servidores tornaria o grupo incapaz de chegar a um acordo sobre um estado consistente.

  Esta opção afeta apenas as declarações que se aplicam a tabelas. Não afeta declarações que se aplicam apenas a outros objetos do banco de dados, como rotinas armazenadas. Para filtrar declarações que operam em rotinas armazenadas, use uma ou mais das opções `--replicate-*-db`.

- [`--replicate-ignore-table=db_name.tbl_name`](https://replication-options-replica.html#option_mysqld_replicate-ignore-table)

  <table frame="box" rules="all" summary="Propriedades para replicar-ignorar-tabela"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--replicate-ignore-table=name</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Cria um filtro de replicação dizendo ao fio SQL de replicação para não replicar qualquer declaração que atualize a tabela especificada, mesmo que outras tabelas possam ser atualizadas pela mesma declaração. Para especificar mais de uma tabela a ser ignorada, use essa opção várias vezes, uma vez para cada tabela. Isso funciona para atualizações entre bancos de dados, em contraste com `--replicate-ignore-db`. Veja Seção 16.2.5, “Como os Servidores Avaliam as Regras de Filtragem de Replicação”. Você também pode criar tal filtro emitindo uma declaração `CHANGE REPLICATION FILTER REPLICATE_IGNORE_TABLE`.

  Nota

  Os filtros de replicação não podem ser usados em uma instância do servidor MySQL configurada para replicação por grupo, porque filtrar transações em alguns servidores tornaria o grupo incapaz de chegar a um acordo sobre um estado consistente.

  Esta opção afeta apenas as declarações que se aplicam a tabelas. Não afeta declarações que se aplicam apenas a outros objetos do banco de dados, como rotinas armazenadas. Para filtrar declarações que operam em rotinas armazenadas, use uma ou mais das opções `--replicate-*-db`.

- [`--replicate-rewrite-db=from_name->to_name`](https://replication-options-replica.html#option_mysqld_replicate-rewrite-db)

  <table frame="box" rules="all" summary="Propriedades para master-info-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--master-info-file=file_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>master.info</code>]]</td> </tr></tbody></table>0

  Diga à réplica que crie um filtro de replicação que traduza o banco de dados especificado para *`to_name`* se ele estiver em *`from_name`* na fonte. Apenas as instruções que envolvem tabelas são afetadas, não instruções como `CREATE DATABASE`, `DROP DATABASE` e `ALTER DATABASE`.

  Para especificar múltiplas reescritas, use essa opção várias vezes. O servidor usa a primeira com um valor de `from_name` que corresponda. A tradução do nome do banco de dados é feita *antes* das regras `--replicate-*` serem testadas. Você também pode criar um filtro desse tipo emitindo uma declaração `CHANGE REPLICATION FILTER REPLICATE_REWRITE_DB`.

  Se você usar a opção `--replicate-rewrite-db` na linha de comando e o caractere `>` for especial para o interpretador de comandos, cite o valor da opção. Por exemplo:

  ```sql
  $> mysqld --replicate-rewrite-db="olddb->newdb"
  ```

  O efeito da opção `--replicate-rewrite-db` depende se o formato de registro binário baseado em instruções ou baseado em linhas é usado para a consulta. Com o formato baseado em instruções, as instruções DML são traduzidas com base no banco de dados atual, conforme especificado pela instrução `USE`. Com o formato baseado em linhas, as instruções DML são traduzidas com base no banco de dados onde a tabela modificada existe. As instruções DDL são sempre filtradas com base no banco de dados atual, conforme especificado pela instrução `USE`, independentemente do formato de registro binário.

  Para garantir que a reescrita produza os resultados esperados, especialmente em combinação com outras opções de filtragem de replicação, siga estas recomendações ao usar a opção `--replicate-rewrite-db`:

  - Crie os bancos de dados *`from_name`* e *`to_name`* manualmente na fonte e na replica com nomes diferentes.

  - Se você estiver usando o formato de registro binário baseado em declarações ou misto, não use consultas cruzadas entre bancos de dados e não especifique nomes de bancos de dados nas consultas. Para declarações DDL e DML, confie na declaração `USE` para especificar o banco de dados atual e use apenas o nome da tabela nas consultas.

  - Se você usar exclusivamente o formato de registro binário baseado em linhas para instruções DDL, confie na instrução `USE` para especificar o banco de dados atual e use apenas o nome da tabela nas consultas. Para instruções DML, você pode usar um nome de tabela totalmente qualificado (*`db`*.*`table`*) se desejar.

  Se essas recomendações forem seguidas, é seguro usar a opção `--replicate-rewrite-db` em combinação com opções de filtragem de replicação de nível de tabela, como `--replicate-do-table`.

  Nota

  Os filtros de replicação global não podem ser usados em uma instância do servidor MySQL configurada para replicação por grupo, porque filtrar transações em alguns servidores tornaria o grupo incapaz de chegar a um acordo sobre um estado consistente.

- [`--replicate-same-server-id`](https://replication-options-replica.html#option_mysqld_replicate-same-server-id)

  <table frame="box" rules="all" summary="Propriedades para master-info-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--master-info-file=file_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>master.info</code>]]</td> </tr></tbody></table>1

  Para ser usado em servidores replicados. Geralmente, você deve usar a configuração padrão de 0, para evitar loops infinitos causados pela replicação circular. Se definido para 1, a replica não pula eventos que têm seu próprio ID de servidor. Normalmente, isso é útil apenas em configurações raras. Não pode ser definido para 1 se `log_slave_updates` estiver habilitado. Por padrão, o thread de I/O de replicação não escreve eventos de log binário no log de relevo se eles tiverem o ID de servidor da replica (esta otimização ajuda a economizar uso de disco). Se você quiser usar `--replicate-same-server-id`, certifique-se de iniciar a replica com essa opção antes de fazer a replica ler seus próprios eventos que você deseja que o thread de SQL de replicação execute.

- [`--replicate-wild-do-table=db_name.tbl_name`](https://replication-options-replica.html#option_mysqld_replicate-wild-do-table)

  <table frame="box" rules="all" summary="Propriedades para master-info-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--master-info-file=file_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>master.info</code>]]</td> </tr></tbody></table>2

  Cria um filtro de replicação, informando ao fio SQL de replicação para restringir a replicação a instruções nas quais qualquer uma das tabelas atualizadas corresponda aos padrões especificados de nome de banco de dados e tabela. Os padrões podem conter os caracteres `%` e `_` de caractere curinga, que têm o mesmo significado que o operador de correspondência de padrões `LIKE`. Para especificar mais de uma tabela, use essa opção várias vezes, uma vez para cada tabela. Isso funciona para atualizações entre bancos. Veja Seção 16.2.5, “Como os Servidores Avaliam as Regras de Filtragem de Replicação”. Você também pode criar tal filtro emitindo uma declaração `CHANGE REPLICATION FILTER REPLICATE_WILD_DO_TABLE`.

  Nota

  Os filtros de replicação não podem ser usados em uma instância do servidor MySQL configurada para replicação por grupo, porque filtrar transações em alguns servidores tornaria o grupo incapaz de chegar a um acordo sobre um estado consistente.

  Esta opção se aplica a tabelas, visualizações e gatilhos. Não se aplica a procedimentos e funções armazenadas ou eventos. Para filtrar instruções que operam sobre esses objetos, use uma ou mais das opções `--replicate-*-db`.

  Como exemplo, `--replicate-wild-do-table=foo%.bar` replica apenas as atualizações que utilizam uma tabela onde o nome do banco de dados começa com `foo` e o nome da tabela começa com `bar`.

  Se o padrão do nome da tabela for `%`, ele corresponderá a qualquer nome de tabela e a opção também se aplica a instruções de nível de banco de dados (`CREATE DATABASE`, `DROP DATABASE` e `ALTER DATABASE`). Por exemplo, se você usar `--replicate-wild-do-table=foo%.%` (replication-options-replica.html#option\_mysqld\_replicate-wild-do-table), as instruções de nível de banco de dados serão replicadas se o nome do banco de dados corresponder ao padrão `foo%`.

  Importante

  Os filtros de replicação de nível de tabela são aplicados apenas às tabelas que são explicitamente mencionadas e manipuladas na consulta. Eles não se aplicam a tabelas que são atualizadas implicitamente pela consulta. Por exemplo, uma declaração `GRANT`, que atualiza a tabela `mysql.user` do sistema, mas não menciona essa tabela, não é afetada por um filtro que especifica `mysql.%` como o padrão de wildcard.

  Para incluir caracteres curinga literais nos padrões de nomes de banco de dados ou tabelas, escape-os com uma barra invertida. Por exemplo, para replicar todas as tabelas de um banco de dados chamado `my\_own%db`, mas não replicar tabelas do banco de dados `my1ownAABCdb`, você deve escapar os caracteres `_` e `%` da seguinte maneira: `--replicate-wild-do-table=my\_own\%db`. Se você usar a opção na linha de comando, pode ser necessário duplicar as barras invertidas ou citar o valor da opção, dependendo do seu interpretador de comandos. Por exemplo, com o shell **bash**, você precisaria digitar `--replicate-wild-do-table=my\\_own\\%db`.

- [`--replicate-wild-ignore-table=db_name.tbl_name`](https://replication-options-replica.html#option_mysqld_replicate-wild-ignore-table)

  <table frame="box" rules="all" summary="Propriedades para master-info-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--master-info-file=file_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>master.info</code>]]</td> </tr></tbody></table>3

  Cria um filtro de replicação que impede que o fio de SQL de replicação replique uma instrução em que qualquer tabela corresponda ao padrão de caracteres curinga fornecido. Para especificar mais de uma tabela a ser ignorada, use essa opção várias vezes, uma vez para cada tabela. Isso funciona para atualizações entre bancos de dados. Veja Seção 16.2.5, “Como os Servidores Avaliam as Regras de Filtragem de Replicação”. Você também pode criar tal filtro emitindo uma declaração `CHANGE REPLICATION FILTER REPLICATE_WILD_IGNORE_TABLE`.

  Importante

  Os filtros de replicação não podem ser usados em uma instância do servidor MySQL configurada para replicação por grupo, porque filtrar transações em alguns servidores tornaria o grupo incapaz de chegar a um acordo sobre um estado consistente.

  Como exemplo, \`--replicate-wild-ignore-table=foo%.bar% não replica as atualizações que usam uma tabela onde o nome do banco de dados começa com `foo`e o nome da tabela começa com`bar\`.

  Para obter informações sobre como o correspondência funciona, consulte a descrição da opção `--replicate-wild-do-table`. As regras para incluir caracteres curinga literais no valor da opção são as mesmas que para `--replicate-wild-ignore-table`.

  Importante

  Os filtros de replicação de nível de tabela são aplicados apenas às tabelas que são explicitamente mencionadas e manipuladas na consulta. Eles não se aplicam a tabelas que são atualizadas implicitamente pela consulta. Por exemplo, uma declaração `GRANT`, que atualiza a tabela `mysql.user` do sistema, mas não menciona essa tabela, não é afetada por um filtro que especifica `mysql.%` como o padrão de wildcard.

  Se você precisar filtrar declarações de `GRANT` ou outras declarações administrativas, uma solução possível é usar o filtro ``--replicate-ignore-db`. Esse filtro opera no banco de dados padrão que está atualmente em vigor, conforme determinado pela declaração ``USE`. Portanto, você pode criar um filtro para ignorar declarações para um banco de dados que não está replicado, e depois emitir a declaração ``USE\` para alternar o banco de dados padrão para aquele imediatamente antes de emitir quaisquer declarações administrativas que você deseja ignorar. Na declaração administrativa, nomeie o banco de dados real onde a declaração é aplicada.

  Por exemplo, se `--replicate-ignore-db=nonreplicated` estiver configurado no servidor replica, a seguinte sequência de instruções faz com que a instrução `GRANT` seja ignorada, porque o banco de dados padrão `nonreplicated` está em vigor:

  ```sql
  USE nonreplicated;
  GRANT SELECT, INSERT ON replicated.t1 TO 'someuser'@'somehost';
  ```

- [`--skip-slave-start`](https://pt.wikipedia.org/wiki/Op%C3%A9rnia_replication-options-replica.html#op%C3%A3%C3%B5%C3%A7%C3%A3o_mysqld_skip-slave-start)

  <table frame="box" rules="all" summary="Propriedades para master-info-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--master-info-file=file_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>master.info</code>]]</td> </tr></tbody></table>4

  Diz ao servidor replicador que não inicie os threads de replicação quando o servidor for iniciado. Para iniciar os threads mais tarde, use uma instrução `START SLAVE`.

- `--slave-skip-errors=[err_code1,err_code2,...|all|ddl_exist_errors]`

  <table frame="box" rules="all" summary="Propriedades para master-info-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--master-info-file=file_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>master.info</code>]]</td> </tr></tbody></table>5

  Normalmente, a replicação é interrompida quando ocorre um erro na replica, o que lhe dá a oportunidade de resolver a inconsistência nos dados manualmente. Esta opção faz com que o fio de replicação SQL continue a replicar quando uma instrução retorna qualquer um dos erros listados no valor da opção.

  Não use esta opção a menos que entenda completamente por que está recebendo erros. Se não houver erros na configuração de replicação e nos programas do cliente, e nenhum erro no próprio MySQL, um erro que interrompa a replicação nunca deve ocorrer. O uso indiscriminado desta opção resulta em réplicas ficando desesperadamente fora de sincronia com a fonte, sem que você tenha a menor ideia do porquê isso ocorreu.

  Para códigos de erro, você deve usar os números fornecidos pela mensagem de erro no log de erro da réplica e na saída de `SHOW SLAVE STATUS`. Apêndice B, *Mensagens de Erro e Problemas Comuns* lista os códigos de erro do servidor.

  O valor abreviado `ddl_exist_errors` é equivalente à lista de códigos de erro `1007, 1008, 1050, 1051, 1054, 1060, 1061, 1068, 1091, 1146`.

  Você também pode (mas não deve) usar o valor muito não recomendado de `all` para fazer com que a replica ignore todas as mensagens de erro e continue avançando, independentemente do que aconteça. Sem necessidade de dizer, se você usar `all`, não há garantias quanto à integridade dos seus dados. Por favor, não reclame (ou faça relatórios de bugs) neste caso se os dados da replica não estiverem nem perto do que estão na fonte. *Você foi avisado*.

  Esta opção não funciona da mesma maneira ao replicar entre clusters NDB, devido ao mecanismo interno do `NDB` para verificar os números de sequência do epoc; assim que o `NDB` detecta um número de epoc ausente ou fora de sequência, ele interrompe imediatamente o fio do aplicador de réplica.

  Exemplos:

  ```sql
  --slave-skip-errors=1062,1053
  --slave-skip-errors=all
  --slave-skip-errors=ddl_exist_errors
  ```

- `--slave-sql-verify-checksum={0|1}`

  <table frame="box" rules="all" summary="Propriedades para master-info-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--master-info-file=file_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>master.info</code>]]</td> </tr></tbody></table>6

  Quando essa opção estiver habilitada, a replica examina os checksums lidos do log do retransmissor. Em caso de discrepância, a replica pára com um erro.

As seguintes opções são usadas internamente pelo conjunto de testes do MySQL para testes de replicação e depuração. Elas não são destinadas ao uso em um ambiente de produção.

- [`--abort-slave-event-count`](https://replication-options-replica.html#option_mysqld_abort-slave-event-count)

  <table frame="box" rules="all" summary="Propriedades para master-info-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--master-info-file=file_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>master.info</code>]]</td> </tr></tbody></table>7

  Quando essa opção é definida para um número inteiro positivo *`value`* diferente de 0 (o padrão), ela afeta o comportamento da replicação da seguinte forma: Após o thread SQL de replicação ter sido iniciado, os eventos de log *`value`* são permitidos para serem executados; após isso, o thread SQL de replicação não recebe mais eventos, assim como se a conexão de rede da fonte tivesse sido cortada. O thread SQL de replicação continua em execução, e a saída do `SHOW SLAVE STATUS` exibe `Yes` nas colunas `Slave_IO_Running` e `Slave_SQL_Running`, mas nenhum evento adicional é lido do log de retransmissão.

  Esta opção é usada internamente pelo conjunto de testes do MySQL para testes de replicação e depuração. Não é destinada ao uso em um ambiente de produção.

- [`--disconnect-slave-event-count`](https://replication-options-replica.html#option_mysqld_disconnect-slave-event-count)

  <table frame="box" rules="all" summary="Propriedades para master-info-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--master-info-file=file_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>master.info</code>]]</td> </tr></tbody></table>8

  Esta opção é usada internamente pelo conjunto de testes do MySQL para testes de replicação e depuração. Não é destinada ao uso em um ambiente de produção.

##### Opções para registrar o status de replicação em tabelas

O MySQL 5.7 suporta o registro de metadados de replicação em tabelas, em vez de em arquivos. A escrita do repositório de metadados de conexão da replica e do repositório de metadados do aplicador pode ser configurada separadamente usando essas duas variáveis de sistema:

- [`master_info_repository`](https://replication-options-replica.html#sysvar_master_info_repository)
- [`relay_log_info_repository`](https://replication-options-replica.html#sysvar_relay_log_info_repository)

Para obter informações sobre essas variáveis, consulte Seção 16.1.6.3, “Opções e variáveis do servidor de replicação”.

Essas variáveis podem ser usadas para tornar uma réplica resistente a interrupções inesperadas. Consulte Seção 16.3.2, “Tratamento de uma Interrupção Inesperada de uma Réplica” para obter mais informações.

As tabelas do log de informações e seus conteúdos são considerados locais para um determinado servidor MySQL. Elas não são replicadas, e as alterações nelas não são escritas no log binário.

Para obter mais informações, consulte Seção 16.2.4, "Repositórios de Log de Relé e Metadados de Replicação".

##### Variáveis do sistema usadas em réplicas

A lista a seguir descreve as variáveis de sistema para controlar os servidores de replicação. Elas podem ser definidas na inicialização do servidor e algumas podem ser alteradas em tempo de execução usando `SET`. As opções do servidor usadas com replicações estão listadas anteriormente nesta seção.

- [`init_slave`](https://replication-options-replica.html#sysvar_init_slave)

  <table frame="box" rules="all" summary="Propriedades para master-info-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--master-info-file=file_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>master.info</code>]]</td> </tr></tbody></table>9

  Esta variável é semelhante a `init_connect`, mas é uma string que deve ser executada por um servidor replica cada vez que o thread de SQL de replicação for iniciado. O formato da string é o mesmo da variável `init_connect`. A configuração desta variável entra em vigor para as subsequentes instruções `START SLAVE`.

  Nota

  O fio de replicação SQL envia um reconhecimento ao cliente antes de executar `init_slave`. Portanto, não é garantido que `init_slave` tenha sido executado quando o `START SLAVE` retornar. Consulte Seção 13.4.2.5, “Instrução START SLAVE” para obter mais informações.

- [`log_slow_slave_statements`](https://replication-options-replica.html#sysvar_log_slow_slave_statements)

  <table frame="box" rules="all" summary="Propriedades para master-retry-count"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--master-retry-count=#</code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>86400</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td>[[<code>18446744073709551615</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td>[[<code>4294967295</code>]]</td> </tr></tbody></table>0

  Quando o registro de consultas lentas é habilitado, essa variável habilita o registro de consultas que levaram mais de `long_query_time` segundos para serem executadas na replica. Observe que, se a replicação baseada em linhas estiver em uso (`binlog_format=ROW`), `log_slow_slave_statements` não tem efeito. As consultas são adicionadas apenas ao registro de consultas lentas da replica quando são registradas no formato de declaração no log binário, ou seja, quando `binlog_format=STATEMENT` é definido, ou quando `binlog_format=MIXED` é definido e a declaração é registrada no formato de declaração. Consultas lentas que são registradas no formato de linha quando `binlog_format=MIXED` é definido, ou que são registradas quando `binlog_format=ROW` é definido, não são adicionadas ao registro de consultas lentas da replica, mesmo que `log_slow_slave_statements` esteja habilitado.

  A definição de [`log_slow_slave_statements`](https://pt.replication-options-replica.html#sysvar_log_slow_slave_statements) não tem efeito imediato. O estado da variável se aplica a todas as instruções subsequentes de [`START SLAVE`](https://pt.start-slave.html). Além disso, observe que o ajuste global para [`long_query_time`](https://pt.server-system-variables.html#sysvar_long_query_time) se aplica durante a vida útil do thread SQL. Se você alterar essa configuração, você deve parar e reiniciar o thread SQL de replicação para implementar a mudança (por exemplo, emitindo as instruções [`STOP SLAVE`](https://pt.stop-slave.html) e [`START SLAVE`](https://pt.start-slave.html) com a opção `SQL_THREAD`).

- [`master_info_repository`](https://replication-options-replica.html#sysvar_master_info_repository)

  <table frame="box" rules="all" summary="Propriedades para master-retry-count"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--master-retry-count=#</code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>86400</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td>[[<code>18446744073709551615</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td>[[<code>4294967295</code>]]</td> </tr></tbody></table>1

  O valor desta variável determina se os registros da replica gravam metadados sobre a fonte, consistindo de status e informações de conexão, em uma tabela `InnoDB` no banco de dados do sistema `mysql`, ou como um arquivo no diretório de dados. Para mais informações sobre o repositório de metadados de conexão, consulte Seção 16.2.4, “Repositórios de Log de Relay e Metadados de Replicação”.

  O padrão é `FILE`. Como arquivo, o repositório de metadados de conexão do replica é chamado `master.info` por padrão. Você pode alterar esse nome usando a opção [`--master-info-file`](https://pt.mariadb.org/kb/replication-options-replica.html#option_mysqld_master-info-file).

  O ambiente alternativo é `TABLE`. Como uma tabela `InnoDB`, o repositório de metadados de conexão da replica é chamado `mysql.slave_master_info`. O ambiente `TABLE` é necessário quando vários canais de replicação são configurados.

  Esta variável deve ser definida como `TABLE` antes de configurar vários canais de replicação. Se você estiver usando vários canais de replicação, não poderá definir o valor de volta para `FILE`.

  O ambiente para a localização do repositório de metadados de conexão tem uma influência direta no efeito da configuração da variável de sistema `sync_master_info`. Você pode alterar a configuração apenas quando nenhum thread de replicação estiver sendo executado.

- [`max_relay_log_size`](https://replication-options-replica.html#sysvar_max_relay_log_size)

  <table frame="box" rules="all" summary="Propriedades para master-retry-count"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--master-retry-count=#</code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>86400</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td>[[<code>18446744073709551615</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td>[[<code>4294967295</code>]]</td> </tr></tbody></table>2

  Se uma escrita de uma replica em seu log de retransmissão causar que o tamanho atual do arquivo de log exceda o valor desta variável, a replica roda os logs de retransmissão (fecha o arquivo atual e abre o próximo). Se `max_relay_log_size` for 0, o servidor usa `max_binlog_size` tanto para o log binário quanto para o log de retransmissão. Se `max_relay_log_size` for maior que 0, ele limita o tamanho do log de retransmissão, o que permite ter tamanhos diferentes para os dois logs. Você deve definir `max_relay_log_size` entre 4096 bytes e 1GB (inclusivo) ou para 0. O valor padrão é 0. Veja Seção 16.2.3, “Threads de Replicação”.

- [`relay_log`](https://replication-options-replica.html#sysvar_relay_log)

  <table frame="box" rules="all" summary="Propriedades para master-retry-count"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--master-retry-count=#</code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>86400</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td>[[<code>18446744073709551615</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td>[[<code>4294967295</code>]]</td> </tr></tbody></table>3

  O nome de base para os arquivos de registro do retransmissor. Para o canal de replicação padrão, o nome de base padrão para os logs do retransmissor é `nome_do_host-retransmissor-bin`. Para canais de replicação não padrão, o nome de base padrão para os logs do retransmissor é `nome_do_host-retransmissor-bin-canal`, onde *`canal`* é o nome do canal de replicação registrado neste log do retransmissor.

  O servidor escreve o arquivo no diretório de dados, a menos que o nome base seja fornecido com um nome de caminho absoluto no início para especificar um diretório diferente. O servidor cria arquivos de log de retransmissão em sequência, adicionando um sufixo numérico ao nome base.

  Devido à maneira como o MySQL analisa as opções do servidor, se você especificar essa variável na inicialização do servidor, você deve fornecer um valor; *o nome de base padrão é usado apenas se a opção não for especificada realmente*. Se você especificar a variável de sistema `relay_log` na inicialização do servidor sem especificar um valor, é provável que ocorra um comportamento inesperado; esse comportamento depende das outras opções usadas, da ordem em que são especificadas e se são especificadas na linha de comando ou em um arquivo de opção. Para mais informações sobre como o MySQL lida com as opções do servidor, consulte Seção 4.2.2, “Especificação de Opções de Programa”.

  Se você especificar essa variável, o valor especificado também será usado como o nome base do arquivo de índice do log de relé. Você pode substituir esse comportamento especificando um nome de base de arquivo de índice de log de relé diferente usando a variável de sistema [`relay_log_index`](https://docs.mariadb.org/replication-options-replica.html#sysvar_relay_log_index).

  Quando o servidor lê uma entrada do arquivo de índice, ele verifica se a entrada contém um caminho relativo. Se estiver presente, a parte relativa do caminho é substituída pelo caminho absoluto definido usando a variável de sistema `relay_log`. Um caminho absoluto permanece inalterado; nesse caso, o índice deve ser editado manualmente para permitir que o novo caminho ou caminhos sejam usados.

  Você pode achar útil a variável de sistema `relay_log` para realizar as seguintes tarefas:

  - Criar logs de retransmissão cujos nomes são independentes dos nomes dos hosts.

  - Se você precisar colocar os logs do retransmissor em uma área diferente do diretório de dados, porque seus logs do retransmissor tendem a ser muito grandes e você não quer diminuir `max_relay_log_size`.

  - Para aumentar a velocidade usando o balanceamento de carga entre discos.

  Você pode obter o nome (e o caminho) do arquivo de log do retransmissor a partir da variável de sistema [`relay_log_basename`](https://replication-options-replica.html#sysvar_relay_log_basename).

- [`relay_log_basename`](https://replication-options-replica.html#sysvar_relay_log_basename)

  <table frame="box" rules="all" summary="Propriedades para master-retry-count"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--master-retry-count=#</code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>86400</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td>[[<code>18446744073709551615</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td>[[<code>4294967295</code>]]</td> </tr></tbody></table>4

  Contém o nome de base e o caminho completo do arquivo de registro do retransmissor. O comprimento máximo da variável é de 256 caracteres. Esta variável é definida pelo servidor e é somente de leitura.

- [`relay_log_index`](https://replication-options-replica.html#sysvar_relay_log_index)

  <table frame="box" rules="all" summary="Propriedades para master-retry-count"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--master-retry-count=#</code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>86400</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td>[[<code>18446744073709551615</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td>[[<code>4294967295</code>]]</td> </tr></tbody></table>5

  O nome do arquivo de índice do log de retransmissão. O comprimento máximo da variável é de 256 caracteres. Para o canal de replicação padrão, o nome padrão é `host_name-relay-bin.index`. Para canais de replicação não padrão, o nome padrão é `host_name-relay-bin-channel.index`, onde *`channel`* é o nome do canal de replicação registrado neste índice de log de retransmissão.

  O servidor escreve o arquivo no diretório de dados, a menos que o nome seja fornecido com um nome de caminho absoluto no início para especificar um diretório diferente. name.

  Devido à maneira como o MySQL analisa as opções do servidor, se você especificar essa variável na inicialização do servidor, você deve fornecer um valor; *o nome de base padrão é usado apenas se a opção não for especificada realmente*. Se você especificar a variável de sistema `relay_log_index` na inicialização do servidor sem especificar um valor, é provável que ocorra um comportamento inesperado; esse comportamento depende das outras opções usadas, da ordem em que são especificadas e se são especificadas na linha de comando ou em um arquivo de opção. Para mais informações sobre como o MySQL lida com as opções do servidor, consulte Seção 4.2.2, “Especificação de Opções de Programa”.

- [`relay_log_info_file`](https://replication-options-replica.html#sysvar_relay_log_info_file)

  <table frame="box" rules="all" summary="Propriedades para master-retry-count"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--master-retry-count=#</code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>86400</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td>[[<code>18446744073709551615</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td>[[<code>4294967295</code>]]</td> </tr></tbody></table>6

  O nome do arquivo no qual as gravações da replica armazenam informações sobre os logs do retransmissor, quando `relay_log_info_repository=FILE`. Se `relay_log_info_repository=TABLE`, é o nome do arquivo que seria usado caso o repositório fosse alterado para `FILE`). O nome padrão é `relay-log.info` no diretório de dados. Para obter informações sobre o repositório de metadados do aplicativo, consulte Seção 16.2.4.2, “Repositórios de Metadados de Replicação”.

- [`relay_log_info_repository`](https://replication-options-replica.html#sysvar_relay_log_info_repository)

  <table frame="box" rules="all" summary="Propriedades para master-retry-count"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--master-retry-count=#</code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>86400</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td>[[<code>18446744073709551615</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td>[[<code>4294967295</code>]]</td> </tr></tbody></table>7

  O valor desta variável determina se o servidor de replicação armazena o repositório de metadados do aplicável como uma tabela `InnoDB` no banco de dados do sistema `mysql`, ou como um arquivo no diretório de dados. Para obter mais informações sobre o repositório de metadados do aplicável, consulte Seção 16.2.4, “Repositórios de Log de Relógio e Metadados de Replicação”.

  A configuração padrão é `FILE`. Como um arquivo, o repositório de metadados do aplicativo da replica é chamado `relay-log.info` por padrão, e você pode alterar esse nome usando a variável de sistema `relay_log_info_file`.

  Com a configuração `TABLE`, como uma tabela `InnoDB`, o repositório de metadados do aplicável da replica é chamado de `mysql.slave_relay_log_info`. A configuração `TABLE` é necessária quando vários canais de replicação são configurados. A configuração `TABLE` para o repositório de metadados do aplicável da replica também é necessária para tornar a replicação resiliente a interrupções inesperadas. Consulte Seção 16.3.2, “Tratamento de uma Interrupção Inesperada de uma Replica” para obter mais informações.

  Esta variável deve ser definida como `TABLE` antes de configurar vários canais de replicação. Se você estiver usando vários canais de replicação, não poderá definir o valor de volta para `FILE`.

  O ambiente para a localização do repositório de metadados do aplicativo tem uma influência direta no efeito da configuração da variável de sistema `sync_relay_log_info`. Você pode alterar a configuração apenas quando nenhum thread de replicação estiver sendo executado.

- [`relay_log_purge`](https://replication-options-replica.html#sysvar_relay_log_purge)

  <table frame="box" rules="all" summary="Propriedades para master-retry-count"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--master-retry-count=#</code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>86400</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td>[[<code>18446744073709551615</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td>[[<code>4294967295</code>]]</td> </tr></tbody></table>8

  Desabilita ou habilita a limpeza automática dos arquivos de registro do relé assim que eles não forem mais necessários. O valor padrão é 1 (`ON`).

- [`relay_log_recovery`](https://replication-options-replica.html#sysvar_relay_log_recovery)

  <table frame="box" rules="all" summary="Propriedades para master-retry-count"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--master-retry-count=#</code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>86400</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td>[[<code>18446744073709551615</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td>[[<code>4294967295</code>]]</td> </tr></tbody></table>9

  Se habilitada, essa variável permite a recuperação automática do log do relé imediatamente após a inicialização do servidor. O processo de recuperação cria um novo arquivo de log do relé, inicializa a posição do fio SQL para esse novo log do relé e inicializa o fio de E/S para a posição do fio SQL. A leitura do log do relé da fonte continua então.

  Essa variável global é somente de leitura durante a execução. Seu valor pode ser definido com a opção `--relay-log-recovery` no início da inicialização do servidor de replica, que deve ser usada após uma parada inesperada de uma replica para garantir que nenhum log de retransmissão possivelmente corrompido seja processado, e deve ser usada para garantir uma replica resistente a falhas. O valor padrão é 0 (desativado). Para informações sobre a combinação de configurações em uma replica que é mais resistente a paradas inesperadas, consulte Seção 16.3.2, “Tratamento de uma Parada Inesperada de uma Replica”.

  Essa variável também interage com a variável `relay_log_purge`, que controla a purga dos logs quando eles não são mais necessários. Habilitar `relay_log_recovery` quando `relay_log_purge` está desativado pode comprometer a leitura do log do retransmissor a partir de arquivos que não foram purgados, levando à inconsistência dos dados.

  Para uma replica multithread (onde `slave_parallel_workers` é maior que 0), a partir do MySQL 5.7.13, definir `relay_log_recovery = ON` automaticamente lida com quaisquer inconsistências e lacunas na sequência de transações executadas a partir do log de retransmissão. Essas lacunas podem ocorrer quando a replicação baseada em posição de arquivo está em uso. (Para mais detalhes, consulte Seção 16.4.1.32, “Inconsistências de Replicação e Transações”.) O processo de recuperação do log de retransmissão lida com as lacunas usando o mesmo método que a instrução `START SLAVE UNTIL SQL_AFTER_MTS_GAPS` faria. Quando a replica atinge um estado consistente sem lacunas, o processo de recuperação do log de retransmissão continua a buscar transações adicionais a partir da fonte, começando na posição do fio de SQL de retransmissão. Em versões do MySQL anteriores ao MySQL 5.7.13, esse processo não era automático e exigia iniciar o servidor com `relay_log_recovery=0`, iniciar a replica com `START SLAVE UNTIL SQL_AFTER_MTS_GAPS` para corrigir quaisquer inconsistências de transações, e então reiniciar a replica com `relay_log_recovery=1`. Quando a replicação baseada em GTID está em uso, a partir do MySQL 5.7.28, uma replica multithread verifica primeiro se `MASTER_AUTO_POSITION` está definido como `ON`, e se estiver, omite o passo de calcular as transações que devem ser ignoradas ou não ignoradas, para que os antigos logs de retransmissão não sejam necessários para o processo de recuperação.

  Nota

  Essa variável não afeta os seguintes canais de replicação em grupo:

  - `group_replication_applier`
  - `grupo_replication_recovery`

  Qualquer outro canal que esteja sendo executado em um grupo será afetado, como um canal que esteja replicando de uma fonte externa ou de outro grupo.

- [`relay_log_space_limit`](https://replication-options-replica.html#sysvar_relay_log_space_limit)

  <table frame="box" rules="all" summary="Propriedades para max_relay_log_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--max-relay-log-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="replication-options-replica.html#sysvar_max_relay_log_size">max_relay_log_size</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1073741824</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr><tr><th><a class="link" href="server-system-variables.html#system-variables-block-size" title="Nota">Tamanho do bloco</a></th> <td>[[<code>4096</code>]]</td> </tr></tbody></table>0

  O valor máximo de espaço a ser utilizado para todos os logs de retransmissão.

- `replicação_optimizar_para_configuração_de_plugin_estático`

  <table frame="box" rules="all" summary="Propriedades para max_relay_log_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--max-relay-log-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="replication-options-replica.html#sysvar_max_relay_log_size">max_relay_log_size</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1073741824</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr><tr><th><a class="link" href="server-system-variables.html#system-variables-block-size" title="Nota">Tamanho do bloco</a></th> <td>[[<code>4096</code>]]</td> </tr></tbody></table>1

  Use bloqueios compartilhados e evite aquisições desnecessárias de bloqueios para melhorar o desempenho da replicação semiesincronizada. Enquanto essa variável de sistema estiver habilitada, o plugin de replicação semiesincronizada não pode ser desinstalado, então você deve desabilitar a variável de sistema antes que a desinstalação possa ser concluída.

  Essa variável de sistema pode ser habilitada antes ou depois de instalar o plugin de replicação semiesincronizada e pode ser habilitada enquanto a replicação estiver em execução. Os servidores de origem da replicação semiesincronizada também podem obter benefícios de desempenho ao habilitar essa variável de sistema, pois usam os mesmos mecanismos de bloqueio que as réplicas.

  A opção `replication_optimize_for_static_plugin_config` pode ser habilitada quando a Replicação por Grupo estiver em uso em um servidor. Nesse cenário, ela pode melhorar o desempenho quando há disputa por bloqueios devido a cargas de trabalho elevadas.

- `replication_sender_observe_commit_only`

  <table frame="box" rules="all" summary="Propriedades para max_relay_log_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--max-relay-log-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="replication-options-replica.html#sysvar_max_relay_log_size">max_relay_log_size</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1073741824</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr><tr><th><a class="link" href="server-system-variables.html#system-variables-block-size" title="Nota">Tamanho do bloco</a></th> <td>[[<code>4096</code>]]</td> </tr></tbody></table>2

  Limite os chamados de retorno para melhorar o desempenho da replicação semiesincronizada. Essa variável de sistema pode ser habilitada antes ou depois de instalar o plugin de replicação semiesincronizada, e pode ser habilitada enquanto a replicação estiver em execução. Os servidores de origem da replicação semiesincronizada também podem obter benefícios de desempenho ao habilitar essa variável de sistema, pois eles usam os mesmos mecanismos de bloqueio que as réplicas.

- [`report_host`](https://replication-options-replica.html#sysvar_report_host)

  <table frame="box" rules="all" summary="Propriedades para max_relay_log_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--max-relay-log-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="replication-options-replica.html#sysvar_max_relay_log_size">max_relay_log_size</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1073741824</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr><tr><th><a class="link" href="server-system-variables.html#system-variables-block-size" title="Nota">Tamanho do bloco</a></th> <td>[[<code>4096</code>]]</td> </tr></tbody></table>3

  O nome do host ou o endereço IP da réplica que será relatado à fonte durante o registro da réplica. Esse valor aparece na saída do `SHOW SLAVE HOSTS` no servidor da fonte. Deixe o valor sem definir se você não quiser que a réplica se registre com a fonte.

  Nota

  Não é suficiente que a fonte simplesmente leia o endereço IP da réplica do soquete TCP/IP após a réplica se conectar. Devido à NAT e outros problemas de roteamento, esse IP pode não ser válido para se conectar à réplica a partir da fonte ou de outros hosts.

- [`report_password`](https://replication-options-replica.html#sysvar_report_password)

  <table frame="box" rules="all" summary="Propriedades para max_relay_log_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--max-relay-log-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="replication-options-replica.html#sysvar_max_relay_log_size">max_relay_log_size</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1073741824</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr><tr><th><a class="link" href="server-system-variables.html#system-variables-block-size" title="Nota">Tamanho do bloco</a></th> <td>[[<code>4096</code>]]</td> </tr></tbody></table>4

  A senha da conta de usuário de replicação da replica a ser reportada para a fonte durante o registro da replica. Esse valor aparece na saída do `SHOW SLAVE HOSTS` no servidor de origem se a origem foi iniciada com `--show-slave-auth-info`.

  Embora o nome desta variável possa sugerir o contrário, `report_password` não está conectado ao sistema de privilégios do usuário MySQL e, portanto, não é necessariamente (ou até mesmo provavelmente) a mesma senha da conta de usuário de replicação do MySQL.

- `report_port`

  <table frame="box" rules="all" summary="Propriedades para max_relay_log_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--max-relay-log-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="replication-options-replica.html#sysvar_max_relay_log_size">max_relay_log_size</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1073741824</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr><tr><th><a class="link" href="server-system-variables.html#system-variables-block-size" title="Nota">Tamanho do bloco</a></th> <td>[[<code>4096</code>]]</td> </tr></tbody></table>5

  O número da porta TCP/IP para a conexão com a réplica, que deve ser informado à fonte durante o registro da réplica. Defina apenas se a réplica estiver ouvindo em uma porta não padrão ou se você tiver um túnel especial da fonte ou de outros clientes para a réplica. Se você não tiver certeza, não use essa opção.

  O valor padrão para essa opção é o número de porta realmente usado pela replica. Esse é também o valor padrão exibido por `SHOW SLAVE HOSTS` (show-slave-hosts.html).

- [`report_user`](https://replication-options-replica.html#sysvar_report_user)

  <table frame="box" rules="all" summary="Propriedades para max_relay_log_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--max-relay-log-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="replication-options-replica.html#sysvar_max_relay_log_size">max_relay_log_size</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1073741824</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr><tr><th><a class="link" href="server-system-variables.html#system-variables-block-size" title="Nota">Tamanho do bloco</a></th> <td>[[<code>4096</code>]]</td> </tr></tbody></table>6

  O nome de usuário da conta da réplica que será relatado à fonte durante o registro da réplica. Esse valor aparece na saída do `SHOW SLAVE HOSTS` no servidor fonte se a fonte foi iniciada com `--show-slave-auth-info`.

  Embora o nome desta variável possa sugerir o contrário, `report_user` não está conectado ao sistema de privilégios do usuário do MySQL e, portanto, não é necessariamente (ou até mesmo provavelmente) o mesmo que o nome da conta de usuário de replicação do MySQL.

- [`rpl_semi_sync_slave_enabled`](https://replicando-opções-replica.html#sysvar_rpl_semi_sync_slave_enabled)

  <table frame="box" rules="all" summary="Propriedades para max_relay_log_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--max-relay-log-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="replication-options-replica.html#sysvar_max_relay_log_size">max_relay_log_size</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1073741824</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr><tr><th><a class="link" href="server-system-variables.html#system-variables-block-size" title="Nota">Tamanho do bloco</a></th> <td>[[<code>4096</code>]]</td> </tr></tbody></table>7

  Controla se a replicação semisoincronizada está habilitada na replica. Para habilitar ou desabilitar o plugin, defina essa variável para `ON` ou `OFF` (ou 1 ou 0), respectivamente. O padrão é `OFF`.

  Esta variável está disponível apenas se o plugin de replicação semi-sincronizada do lado da replica estiver instalado.

- [`rpl_semi_sync_slave_trace_level`](https://replication-options-replica.html#sysvar_rpl_semi_sync_slave_trace_level)

  <table frame="box" rules="all" summary="Propriedades para max_relay_log_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--max-relay-log-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="replication-options-replica.html#sysvar_max_relay_log_size">max_relay_log_size</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1073741824</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr><tr><th><a class="link" href="server-system-variables.html#system-variables-block-size" title="Nota">Tamanho do bloco</a></th> <td>[[<code>4096</code>]]</td> </tr></tbody></table>8

  O nível de rastreamento de depuração da replicação semisoincronizada. Consulte `rpl_semi_sync_master_trace_level` para os valores permitidos.

  Esta variável está disponível apenas se o plugin de replicação semi-sincronizada do lado da replica estiver instalado.

- [`rpl_stop_slave_timeout`](https://replication-options-replica.html#sysvar_rpl_stop_slave_timeout)

  <table frame="box" rules="all" summary="Propriedades para max_relay_log_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--max-relay-log-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="replication-options-replica.html#sysvar_max_relay_log_size">max_relay_log_size</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1073741824</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr><tr><th><a class="link" href="server-system-variables.html#system-variables-block-size" title="Nota">Tamanho do bloco</a></th> <td>[[<code>4096</code>]]</td> </tr></tbody></table>9

  Você pode controlar o tempo (em segundos) que o `STOP SLAVE` espera antes de expirar, definindo essa variável. Isso pode ser usado para evitar deadlocks entre o `STOP SLAVE` e outros comandos SQL usando diferentes conexões de cliente para a replica.

  O valor máximo e o valor padrão de `rpl_stop_slave_timeout` é de 31536000 segundos (1 ano). O valor mínimo é de 2 segundos. As alterações nesta variável entram em vigor nas declarações subsequentes de `STOP SLAVE` (stop-slave.html).

  Essa variável afeta apenas o cliente que emite uma declaração `STOP SLAVE`. Quando o tempo limite é alcançado, o cliente que emitiu a declaração retorna uma mensagem de erro indicando que a execução do comando está incompleta. O cliente então para de esperar que os threads de replicação parem, mas os threads de replicação continuam tentando parar, e a instrução `STOP SLAVE` permanece em vigor. Uma vez que os threads de replicação deixam de estar ocupados, a declaração `STOP SLAVE` é executada e a replicação para.

- [`slave_checkpoint_group`](https://replication-options-replica.html#sysvar_slave_checkpoint_group)

  <table frame="box" rules="all" summary="Propriedades para relay_log_purge"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--relay-log-purge[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="replication-options-replica.html#sysvar_relay_log_purge">relay_log_purge</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>0

  Define o número máximo de transações que podem ser processadas por uma replica multithreading antes que uma operação de verificação de ponto seja chamada para atualizar seu status, conforme mostrado pelo `SHOW SLAVE STATUS`. Definir essa variável não tem efeito em réplicas para as quais a multithreading não está habilitada. Definir essa variável não tem efeito imediato. O estado da variável se aplica a todos os comandos subsequentes de `START SLAVE`.

  Nota

  As réplicas multithread não são atualmente suportadas pelo NDB Cluster, que ignora silenciosamente a configuração desta variável. Consulte Seção 21.7.3, “Problemas Conhecidos na Replicação do NDB Cluster” para obter mais informações.

  Essa variável funciona em combinação com a variável de sistema `slave_checkpoint_period` de tal forma que, quando qualquer um dos limites é ultrapassado, o ponto de verificação é executado e os contadores que rastreiam tanto o número de transações quanto o tempo decorrido desde o último ponto de verificação são reiniciados.

  O valor mínimo permitido para essa variável é 32, a menos que o servidor tenha sido construído usando `-DWITH_DEBUG`, nesse caso, o valor mínimo é 1. O valor efetivo é sempre um múltiplo de 8; você pode defini-lo para um valor que não seja um múltiplo desse, mas o servidor arredonda para o próximo múltiplo de 8 mais baixo antes de armazenar o valor. (*Exceção*: Nenhuma tal arredondamento é realizado pelo servidor de depuração.) Independentemente de como o servidor foi construído, o valor padrão é 512 e o valor máximo permitido é 524280.

- [`slave_checkpoint_period`](https://replication-options-replica.html#sysvar_slave_checkpoint_period)

  <table frame="box" rules="all" summary="Propriedades para relay_log_purge"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--relay-log-purge[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="replication-options-replica.html#sysvar_relay_log_purge">relay_log_purge</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>1

  Define o tempo máximo (em milissegundos) que pode passar antes que uma operação de ponto de verificação seja chamada para atualizar o status de uma replica multithreading, conforme mostrado por `SHOW SLAVE STATUS`. Definir essa variável não tem efeito em réplicas para as quais a multithreading não está habilitada. Definir essa variável tem efeito em todos os canais de replicação imediatamente, incluindo canais em execução.

  Nota

  As réplicas multithread não são atualmente suportadas pelo NDB Cluster, que ignora silenciosamente a configuração desta variável. Consulte Seção 21.7.3, “Problemas Conhecidos na Replicação do NDB Cluster” para obter mais informações.

  Essa variável funciona em combinação com a variável de sistema `slave_checkpoint_group` de tal forma que, quando qualquer um dos limites é ultrapassado, o ponto de verificação é executado e os contadores que rastreiam tanto o número de transações quanto o tempo decorrido desde o último ponto de verificação são reiniciados.

  O valor mínimo permitido para essa variável é 1, a menos que o servidor tenha sido construído usando `-DWITH_DEBUG`, caso em que o valor mínimo é 0. Independentemente de como o servidor foi construído, o valor padrão é de 300 milissegundos e o valor máximo possível é de 4294967295 milissegundos (aproximadamente 49,7 dias).

- [`slave_compressed_protocol`](https://replication-options-replica.html#sysvar_slave_compressed_protocol)

  <table frame="box" rules="all" summary="Propriedades para relay_log_purge"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--relay-log-purge[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="replication-options-replica.html#sysvar_relay_log_purge">relay_log_purge</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>2

  Se usar a compressão do protocolo de origem/replica, se tanto a origem quanto a replica o suportam. Se essa variável estiver desabilitada (o padrão), as conexões serão descomprimetidas. As alterações nessa variável entram em vigor nas tentativas de conexão subsequentes; isso inclui após a emissão de uma declaração `START SLAVE`, bem como as reconexões feitas por uma thread de E/S de replicação em execução (por exemplo, após a definição da opção `MASTER_RETRY_COUNT` para a declaração `CHANGE MASTER TO`). Veja também Seção 4.2.6, “Controle de Compressão de Conexão”.

- `slave_exec_mode`

  <table frame="box" rules="all" summary="Propriedades para relay_log_purge"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--relay-log-purge[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="replication-options-replica.html#sysvar_relay_log_purge">relay_log_purge</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>3

  Controla como um fio de replicação resolve conflitos e erros durante a replicação. O modo `IDEMPOTENT` causa a supressão de erros de chave duplicada e sem chave encontrada; o modo `STRICT` significa que essa supressão não ocorre.

  O modo `IDEMPOTENT` é destinado ao uso na replicação de múltiplas fontes, replicação circular e outros cenários de replicação especiais para a replicação do NDB Cluster. (Consulte Seção 21.7.10, “Replicação do NDB Cluster: Replicação Bidirecional e Circular” e Seção 21.7.11, “Resolução de Conflitos na Replicação do NDB Cluster” para obter mais informações.) O NDB Cluster ignora qualquer valor explicitamente definido para `slave_exec_mode` e sempre o trata como `IDEMPOTENT`.

  No MySQL Server 5.7, o modo `STRICT` é o valor padrão.

  Para os motores de armazenamento que não são o `NDB`, o modo \*\`IDEMPOTENT\`\` deve ser usado apenas quando você tiver certeza absoluta de que os erros de chave duplicada e os erros de chave não encontrada podem ser ignorados com segurança. Ele é destinado a ser usado em cenários de fail-over para o NDB Cluster, onde a replicação de múltiplas fontes ou a replicação circular é empregada, e não é recomendado para uso em outros casos.

- [`slave_load_tmpdir`](https://replication-options-replica.html#sysvar_slave_load_tmpdir)

  <table frame="box" rules="all" summary="Propriedades para relay_log_purge"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--relay-log-purge[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="replication-options-replica.html#sysvar_relay_log_purge">relay_log_purge</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>4

  O nome do diretório onde a replica cria arquivos temporários. Definir essa variável tem efeito imediatamente em todos os canais de replicação, incluindo os canais em execução. O valor da variável é, por padrão, igual ao valor da variável de sistema `tmpdir`, ou ao valor padrão que se aplica quando essa variável de sistema não é especificada.

  Quando o fio de replicação do SQL replica uma instrução `LOAD DATA`, ele extrai o arquivo a ser carregado do log de retransmissão para arquivos temporários e, em seguida, carrega esses arquivos na tabela. Se o arquivo carregado na fonte for enorme, os arquivos temporários na replica também serão enormes. Portanto, pode ser aconselhável usar essa opção para dizer à replica para colocar os arquivos temporários em um diretório localizado em algum sistema de arquivos que tenha muito espaço disponível. Nesse caso, os logs de retransmissão também serão enormes, então você também pode querer definir a variável de sistema `relay_log` para colocar os logs de retransmissão nesse sistema de arquivos.

  O diretório especificado por esta opção deve estar localizado em um sistema de arquivos baseado em disco (não em um sistema de arquivos baseado em memória) para que os arquivos temporários usados para replicar as instruções de `LOAD DATA` (load-data.html) possam sobreviver a reinicializações da máquina. O diretório também não deve ser aquele que seja limpo pelo sistema operacional durante o processo de inicialização do sistema. No entanto, a replicação agora pode continuar após um reinício se os arquivos temporários tiverem sido removidos.

- `slave_max_allowed_packet`

  <table frame="box" rules="all" summary="Propriedades para relay_log_purge"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--relay-log-purge[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="replication-options-replica.html#sysvar_relay_log_purge">relay_log_purge</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>5

  Essa variável define o tamanho máximo do pacote para as threads de replicação SQL e de E/S, para que grandes atualizações usando replicação baseada em linhas não causem falhas na replicação porque uma atualização excedeu `max_allowed_packet`. A definição dessa variável entra em vigor imediatamente para todos os canais de replicação, incluindo os canais em execução.

  Essa variável global sempre tem um valor que é um múltiplo inteiro positivo de 1024; se você defini-la para um valor que não seja, o valor é arredondado para o próximo múltiplo mais alto de 1024 para ser armazenado ou usado; definir `slave_max_allowed_packet` para 0 faz com que 1024 seja usado. (Um aviso de truncação é emitido em todos esses casos.) O valor padrão e máximo é 1073741824 (1 GB); o mínimo é 1024.

- [`slave_net_timeout`](https://replication-options-replica.html#sysvar_slave_net_timeout)

  <table frame="box" rules="all" summary="Propriedades para relay_log_purge"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--relay-log-purge[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="replication-options-replica.html#sysvar_relay_log_purge">relay_log_purge</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>6

  O número de segundos para esperar por mais dados ou um sinal de batida de coração da fonte antes que a replica considere a conexão quebrada, interrompa a leitura e tente reconectar. Definir essa variável não tem efeito imediato. O estado da variável se aplica a todos os comandos subsequentes de `START SLAVE`.

  O primeiro recomeço ocorre imediatamente após o tempo limite. O intervalo entre os recomeços é controlado pela opção `MASTER_CONNECT_RETRY` da instrução `CHANGE MASTER TO`, e o número de tentativas de reconexão é limitado pela opção `MASTER_RETRY_COUNT` da instrução `CHANGE MASTER TO`.

  O intervalo do batimento cardíaco, que interrompe o tempo de espera da conexão na ausência de dados, se a conexão ainda estiver boa, é controlado pela opção `MASTER_HEARTBEAT_PERIOD` da instrução `CHANGE MASTER TO`. O intervalo do batimento cardíaco tem como padrão metade do valor de `slave_net_timeout`, e é registrado no repositório de metadados de conexão da replica e exibido na tabela do Schema de Desempenho `replication_connection_configuration`]\(performance-schema-replication-connection-configuration-table.html). Observe que uma alteração no valor ou configuração padrão de `slave_net_timeout`]\(replication-options-replica.html#sysvar\_slave\_net\_timeout) não altera automaticamente o intervalo do batimento cardíaco, seja ele definido explicitamente ou esteja usando um padrão calculado anteriormente. Se o tempo de espera da conexão for alterado, você também deve emitir `CHANGE MASTER TO` para ajustar o intervalo do batimento cardíaco para um valor apropriado, de modo que ele ocorra antes do tempo de espera da conexão.

- [`slave_parallel_type`](https://replication-options-replica.html#sysvar_slave_parallel_type)

  <table frame="box" rules="all" summary="Propriedades para relay_log_purge"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--relay-log-purge[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="replication-options-replica.html#sysvar_relay_log_purge">relay_log_purge</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>7

  Ao usar uma replica multithreading (`slave_parallel_workers` é maior que 0), essa variável especifica a política usada para decidir quais transações são permitidas para serem executadas em paralelo na replica. A variável não tem efeito em replicas para as quais o multithreading não está habilitado. Os valores possíveis são:

  - `LOGICAL_CLOCK`: As transações que fazem parte do mesmo grupo de log binário em um ponto de origem são aplicadas em paralelo em uma replica. As dependências entre as transações são rastreadas com base em seus timestamps para fornecer uma paralelização adicional, quando possível. Quando este valor é definido, a variável de sistema `binlog_transaction_dependency_tracking` pode ser usada no ponto de origem para especificar que conjuntos de escrita são usados para a paralelização em vez de timestamps, se um conjunto de escrita estiver disponível para a transação e fornecer resultados melhores em comparação com os timestamps.

  - `DATABASE`: As transações que atualizam diferentes bancos de dados são aplicadas em paralelo. Esse valor é apropriado apenas se os dados estiverem particionados em vários bancos de dados que estão sendo atualizados de forma independente e simultânea na fonte. Não deve haver restrições entre bancos de dados, pois tais restrições podem ser violadas na replica.

  Quando [`slave_preserve_commit_order`](https://pt.wikipedia.org/wiki/Replicação_de_servidor_escravo#sysvar_slave_preserve_commit_order) é `1`, [`slave_parallel_type`](https://pt.wikipedia.org/wiki/Replicação_de_servidor_escravo#sysvar_slave_parallel_type) deve ser `CLOCK_LOGICAL`.

  Todos os threads do aplicativo de replicação devem ser interrompidos antes de definir `slave_parallel_type`.

  Quando a topologia de replicação usa múltiplos níveis de réplicas, o `LOGICAL_CLOCK` pode alcançar menos paralelização para cada nível em que a réplica está distante da fonte. Você pode reduzir esse efeito usando [`binlog_transaction_dependency_tracking`](https://pt.wikipedia.org/wiki/Binlog_transaction_dependency_tracking) na fonte para especificar que conjuntos de escrita são usados em vez de timestamps para paralelização sempre que possível.

- [`slave_parallel_workers`](https://replication-options-replica.html#sysvar_slave_parallel_workers)

  <table frame="box" rules="all" summary="Propriedades para relay_log_purge"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--relay-log-purge[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="replication-options-replica.html#sysvar_relay_log_purge">relay_log_purge</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>8

  Define o número de threads do aplicável para executar transações de replicação em paralelo. Definir essa variável para um número maior que 0 cria uma replica multithread com esse número de threads do aplicável. Quando definido para 0 (o padrão), a execução paralela é desativada e a replica usa um único thread do aplicável. Definir `slave_parallel_workers` não tem efeito imediato. O estado da variável se aplica a todas as instruções subsequentes de `START SLAVE`.

  Nota

  As réplicas multithread não são atualmente suportadas pelo NDB Cluster, que ignora silenciosamente a configuração desta variável. Consulte Seção 21.7.3, “Problemas Conhecidos na Replicação do NDB Cluster” para obter mais informações.

  Uma replica multithreading oferece execução paralela usando um fio coordenador e o número de fios aplicadores configurados por esta variável. A forma como as transações são distribuídas entre os fios aplicadores é configurada por `slave_parallel_type`. As transações que a replica aplica em paralelo podem ser confirmadas fora de ordem, a menos que `slave_preserve_commit_order=1`. Portanto, verificar a transação mais recentemente executada não garante que todas as transações anteriores da fonte tenham sido executadas na replica. Isso tem implicações para o registro e a recuperação ao usar uma replica multithreading. Por exemplo, em uma replica multithreading, a declaração `START SLAVE UNTIL` só suporta o uso de `SQL_AFTER_MTS_GAPS`.

  No MySQL 5.7, o reprocessamento de transações é suportado quando o multithreading está habilitado em uma replica. Em versões anteriores, o `slave_transaction_retries` era tratado como igual a 0 ao usar replicas multithread.

  As réplicas multithread não são atualmente suportadas pelo NDB Cluster. Consulte Seção 21.7.3, “Problemas Conhecidos na Replicação do NDB Cluster” para obter mais informações sobre como o `NDB` lida com as configurações desta variável.

- [`slave_pending_jobs_size_max`](https://replication-options-replica.html#sysvar_slave_pending_jobs_size_max)

  <table frame="box" rules="all" summary="Propriedades para relay_log_purge"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--relay-log-purge[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="replication-options-replica.html#sysvar_relay_log_purge">relay_log_purge</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>9

  Para réplicas multithreads, essa variável define a quantidade máxima de memória (em bytes) disponível para filas de trabalhadores que estão armazenando eventos ainda não aplicados. Definir essa variável não tem efeito em réplicas para as quais a multithreading não está habilitada. Definir essa variável não tem efeito imediato. O estado da variável se aplica a todos os comandos subsequentes de `START SLAVE`.

  O valor mínimo possível para essa variável é 1024; o padrão é 16 MB. O valor máximo possível é 18446744073709551615 (16 exabytes). Os valores que não são múltiplos exatos de 1024 são arredondados para o próximo múltiplo mais alto de 1024 antes de serem armazenados.

  O valor desta variável é um limite flexível e pode ser ajustado para corresponder à carga de trabalho normal. Se um evento excepcionalmente grande exceder esse tamanho, a transação é suspensa até que todas as threads do trabalhador tenham filas vazias e, em seguida, processada. Todas as transações subsequentes são suspensas até que a grande transação seja concluída.

- [`slave_preserve_commit_order`](https://replication-options-replica.html#sysvar_slave_preserve_commit_order)

  <table frame="box" rules="all" summary="Propriedades para relay_log_space_limit"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--relay-log-space-limit=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="replication-options-replica.html#sysvar_relay_log_space_limit">relay_log_space_limit</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>18446744073709551615</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></tbody></table>0

  Para réplicas multithreads, o ajuste 1 para essa variável garante que as transações sejam externalizadas na replica na mesma ordem em que aparecem no log de retransmissão da replica e evita lacunas na sequência de transações que foram executadas no log de retransmissão. Essa variável não tem efeito em réplicas para as quais o multithreading não está habilitado. Note que `slave_preserve_commit_order=1` não preserva a ordem de atualizações DML não transacionais, portanto, essas podem ser concluídas antes das transações que as precedem no log de retransmissão, o que pode resultar em lacunas.

  `slave_preserve_commit_order=1` exige que `--log-bin` e `--log-slave-updates` estejam habilitados na replica, e `slave_parallel_type` esteja definido como `LOGICAL_CLOCK`. Antes de alterar essa variável, todos os threads do aplicador de replicação (para todos os canais de replicação, se você estiver usando vários canais de replicação) devem ser interrompidos.

  Com [`slave_preserve_commit_order`](https://pt.wikipedia.org/wiki/Replicação_\(banco_de_dados\)#Op%C3%A7%C3%B5es_de_replicação.html#sysvar_slave_preserve_commit_order) habilitado, o thread em execução aguarda até que todas as transações anteriores sejam confirmadas antes de confirmar. Enquanto o thread está aguardando que outros trabalhadores confirmem suas transações, ele relata seu status como `Aguardando a confirmação da transação anterior`. (Antes do MySQL 5.7.8, isso era mostrado como `Aguardando sua vez de confirmar`.) Habilitar esse modo em uma replica multithread garante que ele nunca entre em um estado que a fonte não estava. Isso suporta o uso da replicação para escala de leitura. Veja [Seção 16.3.4, “Usando Replicação para Escala de Leitura”](https://pt.wikipedia.org/wiki/Replicação_\(banco_de_dados\)#Solu%C3%A7%C3%B5es_de_escala_out.html).

  Se `slave_preserve_commit_order` for `0`, as transações que a replica aplica em paralelo podem ser confirmadas fora de ordem. Portanto, verificar a transação executada mais recentemente não garante que todas as transações anteriores da fonte tenham sido executadas na replica. Há uma chance de lacunas na sequência das transações executadas a partir do log de retransmissão da replica. Isso tem implicações para o registro e a recuperação ao usar uma replica multithread. Observe que o ajuste `slave_preserve_commit_order=1` previne lacunas, mas não previne o atraso na posição do log binário da fonte (onde `Exec_master_log_pos` está atrasado em relação à posição até a qual as transações foram executadas). Consulte Seção 16.4.1.32, “Inconsistências de Replicação e Transações” para obter mais informações.

- `slave_rows_search_algorithms`

  <table frame="box" rules="all" summary="Propriedades para relay_log_space_limit"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--relay-log-space-limit=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="replication-options-replica.html#sysvar_relay_log_space_limit">relay_log_space_limit</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>18446744073709551615</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></tbody></table>1

  Ao preparar lotes de linhas para o registro e replicação baseados em linhas, essa variável controla como as linhas são pesquisadas para encontrar correspondências, especialmente se são usadas varreduras de hash. A definição dessa variável entra em vigor imediatamente para todos os canais de replicação, incluindo os canais em execução.

  Especifique uma lista separada por vírgula das seguintes combinações de 2 valores da lista `INDEX_SCAN`, `TABLE_SCAN`, `HASH_SCAN`. O valor é esperado como uma string, portanto, se definido em tempo de execução em vez de no início do servidor, o valor deve ser citado. Além disso, o valor não deve conter espaços. As combinações (listas) recomendadas e seus efeitos são mostrados na tabela a seguir:

  <table frame="box" rules="all" summary="Propriedades para relay_log_space_limit"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--relay-log-space-limit=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="replication-options-replica.html#sysvar_relay_log_space_limit">relay_log_space_limit</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>18446744073709551615</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></tbody></table>2

  - O valor padrão é `INDEX_SCAN, TABLE_SCAN`, o que significa que todas as pesquisas que podem usar índices os utilizam, e as pesquisas sem nenhum índice usam varreduras de tabela.

  - Para usar hashing em qualquer pesquisa que não utilize uma chave primária ou única, defina `INDEX_SCAN,HASH_SCAN`. Especificar `INDEX_SCAN,HASH_SCAN` tem o mesmo efeito que especificar `INDEX_SCAN,TABLE_SCAN,HASH_SCAN`, o que é permitido.

  - Não use a combinação `TABLE_SCAN,HASH_SCAN`. Esta configuração força a hash para todas as pesquisas. Não oferece nenhuma vantagem em relação a `INDEX_SCAN,HASH_SCAN`, e pode levar a erros de "registro não encontrado" ou erros de chave duplicada no caso de um único evento que contenha múltiplas atualizações na mesma linha, ou atualizações que dependem da ordem.

  A ordem em que os algoritmos são especificados na lista não faz diferença para a ordem em que são exibidos por uma instrução `SELECT` ou `SHOW VARIABLES`.

  É possível especificar um único valor, mas isso não é ótimo, porque definir um único valor limita as pesquisas a usar apenas esse algoritmo. Em particular, definir apenas `INDEX_SCAN` não é recomendado, pois, nesse caso, as pesquisas não conseguem encontrar linhas de forma alguma se não houver um índice presente.

- `slave_skip_errors`

  <table frame="box" rules="all" summary="Propriedades para relay_log_space_limit"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--relay-log-space-limit=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="replication-options-replica.html#sysvar_relay_log_space_limit">relay_log_space_limit</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>18446744073709551615</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></tbody></table>3

  Normalmente, a replicação é interrompida quando ocorre um erro na replica, o que lhe dá a oportunidade de resolver a inconsistência nos dados manualmente. Esta variável faz com que o fio de replicação SQL continue a replicação quando uma instrução retorna qualquer um dos erros listados no valor da variável.

- [`slave_sql_verify_checksum`](https://replication-options-replica.html#sysvar_slave_sql_verify_checksum)

  <table frame="box" rules="all" summary="Propriedades para relay_log_space_limit"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--relay-log-space-limit=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="replication-options-replica.html#sysvar_relay_log_space_limit">relay_log_space_limit</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>18446744073709551615</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></tbody></table>4

  Faça com que o fio de replicação SQL verifique os dados usando os checksums lidos do log de retransmissão. Em caso de discrepância, a replica pára com um erro. A definição desta variável entra em vigor imediatamente para todos os canais de replicação, incluindo os canais em execução.

  Nota

  A thread de I/O de replicação sempre lê os checksums, se possível, ao aceitar eventos da rede.

- [`slave_transaction_retries`](https://replication-options-replica.html#sysvar_slave_transaction_retries)

  <table frame="box" rules="all" summary="Propriedades para relay_log_space_limit"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--relay-log-space-limit=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="replication-options-replica.html#sysvar_relay_log_space_limit">relay_log_space_limit</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>18446744073709551615</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></tbody></table>5

  Se um fio de SQL de replicação não conseguir executar uma transação devido a um deadlock no motor de armazenamento `[InnoDB]` (innodb-storage-engine.html) ou porque o tempo de execução da transação excedeu o valor de `[InnoDB]` (innodb-storage-engine.html) `innodb_lock_wait_timeout` (innodb-parameters.html#sysvar\_innodb\_lock\_wait\_timeout) ou `NDB` (mysql-cluster.html) `TransactionDeadlockDetectionTimeout` (mysql-cluster-ndbd-definition.html#ndbparam-ndb-transactiondeadlockdetectiontimeout) ou `TransactionInactiveTimeout` (mysql-cluster-ndbd-definition.html#ndbparam-ndb-transactioninactivetimeout), ele tentará novamente `[slave_transaction_retries]` (replication-options-replica.html#sysvar\_slave\_transaction\_retries) vezes antes de parar com um erro. As transações com um erro não temporário não são reatadas.

  O valor padrão para [`slave_transaction_retries`](https://pt.wikipedia.org/wiki/Replicação_\(database\)#Op%C3%A7%C3%B5es_de_replicação) é 10. Definir a variável para 0 desabilita a repetição automática de transações. A definição da variável entra em vigor imediatamente para todos os canais de replicação, incluindo os canais em execução.

  A partir do MySQL 5.7.5, o reprocessamento de transações é suportado quando o multithreading está habilitado em uma replica. Em versões anteriores, o `slave_transaction_retries` era tratado como igual a 0 ao usar replicas com multithreading.

  A tabela do Schema de Desempenho `replication_applier_status` mostra o número de tentativas de retransmissão que ocorreram em cada canal de retransmissão, na coluna `COUNT_TRANSACTIONS_RETRIES`.

- `slave_type_conversions`

  <table frame="box" rules="all" summary="Propriedades para relay_log_space_limit"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--relay-log-space-limit=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="replication-options-replica.html#sysvar_relay_log_space_limit">relay_log_space_limit</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>18446744073709551615</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></tbody></table>6

  Controla o modo de conversão de tipos em vigor na replica quando se usa a replicação baseada em linhas. No MySQL 5.7.2 e versões posteriores, seu valor é um conjunto separado por vírgula de zero ou mais elementos da lista: `ALL_LOSSY`, `ALL_NON_LOSSY`, `ALL_SIGNED`, `ALL_UNSIGNED`. Defina essa variável como uma string vazia para impedir conversões de tipos entre a fonte e a replica. A definição dessa variável entra em vigor imediatamente para todos os canais de replicação, incluindo os canais em execução.

  `ALL_SIGNED` e `ALL_UNSIGNED` foram adicionados no MySQL 5.7.2 (Bug#15831300). Para obter informações adicionais sobre os modos de conversão de tipos aplicáveis à promoção e redução de atributos na replicação baseada em linhas, consulte Replicação baseada em linhas: promoção e redução de atributos.

- [`sql_slave_skip_counter`](https://replication-options-replica.html#sysvar_sql_slave_skip_counter)

  <table frame="box" rules="all" summary="Propriedades para relay_log_space_limit"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--relay-log-space-limit=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="replication-options-replica.html#sysvar_relay_log_space_limit">relay_log_space_limit</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>18446744073709551615</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></tbody></table>7

  O número de eventos da fonte que uma replica deve ignorar. Definir a opção não tem efeito imediato. A variável se aplica à próxima instrução `START SLAVE`; a próxima instrução `START SLAVE` também retorna o valor para 0. Quando essa variável é definida para um valor diferente de zero e há vários canais de replicação configurados, a instrução `START SLAVE` só pode ser usada com a cláusula `FOR CHANNEL channel`.

  Esta opção é incompatível com a replicação baseada em GTID e não deve ser definida para um valor não nulo quando `gtid_mode=ON`. Se você precisar pular transações ao usar GTIDs, use `gtid_executed` da fonte. Veja Seção 16.1.7.3, “Pular Transações”.

  Importante

  Se o desconsiderar do número de eventos especificado ao definir essa variável causar o início da replicação no meio de um grupo de eventos, a replicação continua a desconsiderar até encontrar o início do próximo grupo de eventos e começar a partir desse ponto. Para mais informações, consulte Seção 16.1.7.3, “Desconsiderar Transações”.

- [`sync_master_info`](https://replication-options-replica.html#sysvar_sync_master_info)

  <table frame="box" rules="all" summary="Propriedades para relay_log_space_limit"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--relay-log-space-limit=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="replication-options-replica.html#sysvar_relay_log_space_limit">relay_log_space_limit</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>18446744073709551615</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></tbody></table>8

  Os efeitos dessa variável em uma replica dependem se o `master_info_repository` da replica ([replication-options-replica.html#sysvar\_master\_info\_repository](https://docs.postgresql.org/en/replication/replication-options-replica.html#sysvar-master-info-repository)) está configurado como `FILE` ou `TABLE`, conforme explicado nos parágrafos seguintes.

  **master\_info\_repository = FILE.** Se o valor de `sync_master_info` for maior que 0, a replica sincroniza seu arquivo `master.info` no disco (usando `fdatasync()`) após cada evento `sync_master_info`. Se for 0, o servidor MySQL não realiza nenhuma sincronização do arquivo `master.info` no disco; em vez disso, o servidor depende do sistema operacional para limpar periodicamente seu conteúdo, como qualquer outro arquivo.

  **master\_info\_repository = Tabela.** Se o valor de `sync_master_info` for maior que 0, a replica atualiza sua tabela de repositório de metadados de conexão após cada evento `sync_master_info`. Se for 0, a tabela nunca é atualizada.

  O valor padrão para `sync_master_info` é

  10000. A definição desta variável entra em vigor imediatamente para todos os canais de replicação, incluindo os canais em execução.

- [`sync_relay_log`](https://replication-options-replica.html#sysvar_sync_relay_log)

  <table frame="box" rules="all" summary="Propriedades para relay_log_space_limit"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--relay-log-space-limit=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="replication-options-replica.html#sysvar_relay_log_space_limit">relay_log_space_limit</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>18446744073709551615</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></tbody></table>9

  Se o valor desta variável for maior que 0, o servidor MySQL sincroniza seu log de retransmissão no disco (usando `fdatasync()`) após cada evento `sync_relay_log` ser escrito no log de retransmissão. A definição desta variável entra em vigor imediatamente para todos os canais de replicação, incluindo os canais em execução.

  Definir `sync_relay_log` para 0 faz com que não haja sincronização no disco; nesse caso, o servidor depende do sistema operacional para limpar o conteúdo do log do retransmissor de tempos em tempos, como qualquer outro arquivo.

  Um valor de 1 é a escolha mais segura, pois, em caso de uma parada inesperada, você perde no máximo um evento do log de retransmissão. No entanto, também é a opção mais lenta (a menos que o disco tenha um cache com bateria, o que torna a sincronização muito rápida). Para obter informações sobre a combinação de configurações em uma réplica mais resistente a paradas inesperadas, consulte Seção 16.3.2, “Tratamento de uma Parada Inesperada de uma Réplica”.

- [`sync_relay_log_info`](https://replication-options-replica.html#sysvar_sync_relay_log_info)

  <table frame="box" rules="all" summary="Propriedades para replicate-do-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--replicate-do-db=name</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>0

  O valor padrão para `sync_relay_log_info` é 10000. Definir essa variável terá efeito imediatamente em todos os canais de replicação, incluindo os canais em execução.

  Os efeitos dessa variável na replica dependem da configuração do repositório de informações de log de retransmissão `relay_log_info_repository` do servidor (`FILE` ou `TABLE`). Se a configuração for `TABLE`, os efeitos da variável também dependem se o mecanismo de armazenamento usado pela tabela de informações de log de retransmissão é transacional (como `InnoDB`) ou não transacional (`MyISAM`). Os efeitos desses fatores no comportamento do servidor para valores de `sync_relay_log_info` de zero e maiores que zero são os seguintes:

  `sync_relay_log_info = 0` :   + Se [`relay_log_info_repository`](https://replication-options-replica.html#sysvar_relay_log_info_repository) estiver definido como `FILE`, o servidor MySQL não realiza a sincronização do arquivo `relay-log.info` no disco; em vez disso, o servidor depende do sistema operacional para limpar periodicamente seu conteúdo, como qualquer outro arquivo.

  ```
  + If `relay_log_info_repository` is set to `TABLE`, and the storage engine for that table is transactional, the table is updated after each transaction. (The `sync_relay_log_info` setting is effectively ignored in this case.)

  + If `relay_log_info_repository` is set to `TABLE`, and the storage engine for that table is not transactional, the table is never updated.
  ```

  `sync_relay_log_info = N > 0` :   + Se `relay_log_info_repository` estiver definido como `FILE`, a replica sincroniza seu arquivo `relay-log.info` no disco (usando `fdatasync()` ) após cada *`N`* transações.

  ```
  + If `relay_log_info_repository` is set to `TABLE`, and the storage engine for that table is transactional, the table is updated after each transaction. (The `sync_relay_log_info` setting is effectively ignored in this case.)

  + If `relay_log_info_repository` is set to `TABLE`, and the storage engine for that table is not transactional, the table is updated after every *`N`* events.
  ```
