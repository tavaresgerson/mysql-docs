#### 19.1.6.3 Opções e variáveis do servidor de replicação

Esta seção explica as opções do servidor e as variáveis do sistema que se aplicam aos servidores replicados e contém o seguinte:

- Opções de inicialização para servidores replicados
- Variáveis do sistema usadas em servidores replicados

Especifique as opções na linha de comando ou em um arquivo de opções. Muitas das opções podem ser definidas enquanto o servidor estiver em execução, usando a instrução `CHANGE REPLICATION SOURCE TO` (a partir do MySQL 8.0.23) ou a instrução `CHANGE MASTER TO` (antes do MySQL 8.0.23). Especifique os valores das variáveis de sistema usando `SET`.

**ID do servidor.** No servidor de origem e em cada réplica, você deve definir a variável de sistema `server_id` para estabelecer um ID de replicação único, no intervalo de 1 a 232 − 1. "Único" significa que cada ID deve ser diferente de todas as outras IDs em uso por qualquer outro servidor de origem ou réplica na topologia de replicação. Exemplo de arquivo `my.cnf`:

```
[mysqld]
server-id=3
```

##### Opções de inicialização para servidores replicados

Esta seção explica as opções de inicialização para controlar os servidores replicados. Muitas dessas opções podem ser definidas enquanto o servidor estiver em execução, usando a instrução `CHANGE REPLICATION SOURCE TO` (a partir do MySQL 8.0.23) ou a instrução `CHANGE MASTER TO` (antes do MySQL 8.0.23). Outras, como as opções `--replicate-*`, só podem ser definidas quando o servidor replicado for iniciado. As variáveis de sistema relacionadas à replicação são discutidas mais adiante nesta seção.

- `--master-info-file=file_name`

  <table summary="Propriedades para master-info-file"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--master-info-file=file_name</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.18</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>master.info</code>]]</td> </tr></tbody></table>

  O uso desta opção já está desaconselhado. Ela era usada para definir o nome do arquivo para o repositório de metadados de conexão da replica se `master_info_repository=FILE` estivesse definido. `--master-info-file` e o uso da variável de sistema `master_info_repository` estão desaconselhados porque o uso de um arquivo para o repositório de metadados de conexão foi substituído por tabelas seguras em caso de falha. Para obter informações sobre o repositório de metadados de conexão, consulte a Seção 19.2.4.2, “Repositórios de Metadados de Replicação”.

- `--master-retry-count=count`

  <table summary="Propriedades para master-retry-count"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--master-retry-count=#</code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>86400</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td>[[<code>18446744073709551615</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td>[[<code>4294967295</code>]]</td> </tr></tbody></table>

  O número de vezes que a replica tenta se reconectar à fonte antes de desistir. O valor padrão é de 86400 vezes. Um valor de 0 significa "infinito", e a replica tenta se conectar para sempre. As tentativas de reconexão são acionadas quando a replica atinge o seu tempo limite de conexão (especificado pela variável de sistema `replica_net_timeout` ou `slave_net_timeout`) sem receber dados ou um sinal de batida de coração da fonte. A reconexão é tentada em intervalos definidos pela opção `SOURCE_CONNECT_RETRY` | `MASTER_CONNECT_RETRY` da declaração `CHANGE REPLICATION SOURCE TO` | `CHANGE MASTER TO` (que tem como padrão a cada 60 segundos).

  Esta opção está desatualizada; espere-se que seja removida em uma futura versão do MySQL. Use a opção `SOURCE_RETRY_COUNT` | `MASTER_RETRY_COUNT` da declaração `CHANGE REPLICATION SOURCE TO` | `CHANGE MASTER TO` em vez disso.

- `--max-relay-log-size=size`

  <table summary="Propriedades para max_relay_log_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--max-relay-log-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>max_relay_log_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1073741824</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr><tr><th>Tamanho do bloco</th> <td>[[<code>4096</code>]]</td> </tr></tbody></table>

  O tamanho em que o servidor roda os arquivos de log do retransmissor automaticamente. Se esse valor for diferente de zero, o log do retransmissor será rodado automaticamente quando seu tamanho exceder esse valor. Se esse valor for zero (o padrão), o tamanho em que a rotação do log do retransmissor ocorre é determinado pelo valor de `max_binlog_size`. Para mais informações, consulte a Seção 19.2.4.1, “O Log do Retransmissor”.

- `--relay-log-purge={0|1}`

  <table summary="Propriedades para relay_log_purge"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--relay-log-purge[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>relay_log_purge</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>

  Desative ou ative a limpeza automática dos logs do relé assim que eles não forem mais necessários. O valor padrão é 1 (ativado). Esta é uma variável global que pode ser alterada dinamicamente com `SET GLOBAL relay_log_purge = N`. Desativar a limpeza dos logs do relé ao habilitar a opção `--relay-log-recovery` arrisca a consistência dos dados e, portanto, não é segura em caso de falha.

- `--relay-log-space-limit=size`

  <table summary="Propriedades para relay_log_space_limit"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--relay-log-space-limit=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>relay_log_space_limit</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>18446744073709551615</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></tbody></table>

  Esta opção estabelece um limite superior para o tamanho total em bytes de todos os logs de retransmissão na replica. Um valor de 0 significa “sem limite”. Isso é útil para um servidor de replica que tem espaço em disco limitado. Quando o limite é atingido, o fio de I/O (receptor) para de ler eventos de log binário do servidor de origem até que o fio de SQL (aplicável) consiga recuperar e excluir alguns logs de retransmissão não utilizados. Observe que esse limite não é absoluto: há casos em que o fio de SQL (aplicável) precisa de mais eventos antes de poder excluir logs de retransmissão. Nesse caso, o fio de receptor excede o limite até que seja possível para o fio de aplicável excluir alguns logs de retransmissão, pois não fazer isso causaria um impasse. Você não deve definir `--relay-log-space-limit` para menos de duas vezes o valor de `--max-relay-log-size` (ou `--max-binlog-size` se `--max-relay-log-size` for 0). Nesse caso, há uma chance de que o fio de receptor espere por espaço livre porque `--relay-log-space-limit` é excedido, mas o fio de aplicável não tem nenhum log de retransmissão para purgar e não consegue satisfazer o fio de receptor. Isso obriga o fio de receptor a ignorar `--relay-log-space-limit` temporariamente.

- `--replicate-do-db=db_name`

  <table summary="Propriedades para replicate-do-db"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--replicate-do-db=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>

  Cria um filtro de replicação usando o nome de um banco de dados. Esses filtros também podem ser criados usando `CHANGE REPLICATION FILTER REPLICATE_DO_DB`.

  Esta opção suporta filtros de replicação específicos de canal, permitindo que réplicas de várias fontes usem filtros específicos para diferentes fontes. Para configurar um filtro de replicação específico de canal em um canal chamado `channel_1`, use `--replicate-do-db:channel_1:db_name`. Neste caso, o primeiro ponto e vírgula é interpretado como um separador e os pontos e vírgulas subsequentes são colchetes. Consulte a Seção 19.2.5.4, “Filtros Baseados em Canais de Replicação” para obter mais informações.

  Nota

  Os filtros de replicação global não podem ser usados em uma instância do servidor MySQL configurada para a Replicação por Grupo, porque filtrar transações em alguns servidores tornaria o grupo incapaz de chegar a um acordo sobre um estado consistente. Filtros de replicação específicos para canais podem ser usados em canais de replicação que não estejam diretamente envolvidos com a Replicação por Grupo, como quando um membro do grupo também atua como replica para uma fonte que está fora do grupo. Eles não podem ser usados nos canais `group_replication_applier` ou `group_replication_recovery`.

  O efeito preciso desse filtro de replicação depende se a replicação baseada em declarações ou baseada em linhas está em uso.

  **Replicação baseada em declarações.** Diga ao fio de SQL de replicação para restringir a replicação a declarações onde o banco de dados padrão (ou seja, aquele selecionado por `USE`) é `db_name`. Para especificar mais de um banco de dados, use esta opção várias vezes, uma vez para cada banco de dados; no entanto, isso *não* replica declarações entre bancos, como `UPDATE some_db.some_table SET foo='bar'`, enquanto um banco de dados diferente (ou nenhum banco de dados) é selecionado.

  Aviso

  Para especificar múltiplas bases de dados, você *deve* usar múltiplas instâncias desta opção. Como os nomes de banco de dados podem conter vírgulas, se você fornecer uma lista separada por vírgula, a lista será tratada como o nome de uma única base de dados.

  Um exemplo do que não funciona conforme você pode esperar ao usar a replicação baseada em declarações: Se a replica for iniciada com `--replicate-do-db=sales` e você emitir as seguintes declarações na fonte, a declaração `UPDATE` *não* será replicada:

  ```
  USE prices;
  UPDATE sales.january SET amount=amount+1000;
  ```

  A principal razão para esse comportamento de "verificar apenas o banco de dados padrão" é que, a partir da declaração sozinha, é difícil saber se ele deve ser replicado (por exemplo, se você estiver usando declarações `DELETE` de múltiplas tabelas ou declarações `UPDATE` de múltiplas tabelas que atuam em múltiplos bancos de dados). Também é mais rápido verificar apenas o banco de dados padrão, em vez de todos os bancos de dados, se não houver necessidade.

  **Replicação baseada em linhas.** Diz ao fio de SQL de replicação para restringir a replicação ao banco de dados `db_name`. Somente as tabelas pertencentes a `db_name` são alteradas; o banco de dados atual não tem efeito sobre isso. Suponha que a replicação seja iniciada com `--replicate-do-db=sales` e a replicação baseada em linhas esteja em vigor, e então as seguintes instruções são executadas na fonte:

  ```
  USE prices;
  UPDATE sales.february SET amount=amount+100;
  ```

  A tabela `february` no banco de dados `sales` na replica é alterada de acordo com a instrução `UPDATE`; isso ocorre independentemente de a instrução `USE` ter sido emitida ou não. No entanto, emitir as seguintes instruções na fonte não tem efeito na replica ao usar a replicação baseada em linhas e `--replicate-do-db=sales`:

  ```
  USE prices;
  UPDATE prices.march SET amount=amount-25;
  ```

  Mesmo que a declaração `USE prices` fosse alterada para `USE sales`, os efeitos da declaração `UPDATE` ainda não seriam replicados.

  Outra diferença importante na forma como o `--replicate-do-db` é tratado na replicação baseada em declarações, em oposição à replicação baseada em linhas, ocorre em relação às declarações que se referem a múltiplas bases de dados. Suponha que a replicação seja iniciada com `--replicate-do-db=db1`, e as seguintes declarações sejam executadas na fonte:

  ```
  USE db1;
  UPDATE db1.table1, db2.table2 SET db1.table1.col1 = 10, db2.table2.col2 = 20;
  ```

  Se você estiver usando a replicação baseada em declarações, ambas as tabelas serão atualizadas na replica. No entanto, ao usar a replicação baseada em linhas, apenas `table1` será afetada na replica; como `table2` está em um banco de dados diferente, `table2` na replica não será alterado pelo `UPDATE`. Agora, suponha que, em vez da declaração `USE db1`, tivesse sido usada uma declaração `USE db4`:

  ```
  USE db4;
  UPDATE db1.table1, db2.table2 SET db1.table1.col1 = 10, db2.table2.col2 = 20;
  ```

  Neste caso, a declaração `UPDATE` não teria efeito na replica quando a replicação for baseada em declarações. No entanto, se você estiver usando a replicação baseada em linhas, a `UPDATE` mudaria `table1` na replica, mas não `table2` — em outras palavras, apenas as tabelas no banco de dados nomeado por `--replicate-do-db` são alteradas, e a escolha do banco de dados padrão não tem efeito nesse comportamento.

  Se você precisar que as atualizações entre bancos de dados funcionem, use `--replicate-wild-do-table=db_name.%` em vez disso. Veja a Seção 19.2.5, “Como os Servidores Avaliam as Regras de Filtragem de Replicação”.

  Nota

  Esta opção afeta a replicação da mesma maneira que o `--binlog-do-db` afeta o registro binário, e os efeitos do formato de replicação sobre como o `--replicate-do-db` afeta o comportamento da replicação são os mesmos que os do formato de registro sobre o comportamento do `--binlog-do-db`.

  Esta opção não tem efeito nas instruções `BEGIN`, `COMMIT` ou `ROLLBACK`.

- `--replicate-ignore-db=db_name`

  <table summary="Propriedades para replicar-ignorar-db"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--replicate-ignore-db=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>

  Cria um filtro de replicação usando o nome de um banco de dados. Esses filtros também podem ser criados usando `CHANGE REPLICATION FILTER REPLICATE_IGNORE_DB`.

  Esta opção suporta filtros de replicação específicos de canal, permitindo que réplicas de várias fontes usem filtros específicos para diferentes fontes. Para configurar um filtro de replicação específico de canal em um canal chamado `channel_1`, use `--replicate-ignore-db:channel_1:db_name`. Neste caso, o primeiro ponto e vírgula é interpretado como um separador e os pontos e vírgulas subsequentes são colchetes. Consulte a Seção 19.2.5.4, “Filtros Baseados em Canais de Replicação” para obter mais informações.

  Nota

  Os filtros de replicação global não podem ser usados em uma instância do servidor MySQL configurada para a Replicação por Grupo, porque filtrar transações em alguns servidores tornaria o grupo incapaz de chegar a um acordo sobre um estado consistente. Filtros de replicação específicos para canais podem ser usados em canais de replicação que não estejam diretamente envolvidos com a Replicação por Grupo, como quando um membro do grupo também atua como replica para uma fonte que está fora do grupo. Eles não podem ser usados nos canais `group_replication_applier` ou `group_replication_recovery`.

  Para especificar mais de um banco de dados a ser ignorado, use essa opção várias vezes, uma vez para cada banco de dados. Como os nomes dos bancos de dados podem conter vírgulas, se você fornecer uma lista separada por vírgula, ela será tratada como o nome de um único banco de dados.

  Assim como no caso de `--replicate-do-db`, o efeito preciso desse filtro depende se a replicação baseada em declarações ou baseada em linhas está sendo usada, e isso é descrito nos próximos parágrafos.

  **Replicação baseada em declarações.** Diz ao fio de SQL de replicação que não replique nenhuma declaração onde o banco de dados padrão (ou seja, aquele selecionado por `USE`) é `db_name`.

  **Replicação baseada em linhas.** Diz ao fio de SQL de replicação para não atualizar nenhuma tabela no banco de dados `db_name`. O banco de dados padrão não tem efeito.

  Ao usar a replicação baseada em declarações, o exemplo a seguir não funciona conforme o esperado. Suponha que a replicação seja iniciada com `--replicate-ignore-db=sales` e você emitir as seguintes declarações na fonte:

  ```
  USE prices;
  UPDATE sales.january SET amount=amount+1000;
  ```

  A declaração `UPDATE` *é* replicada nesse caso, porque `--replicate-ignore-db` se aplica apenas ao banco de dados padrão (determinado pela declaração `USE`). Como o banco de dados `sales` foi especificado explicitamente na declaração, a declaração não foi filtrada. No entanto, ao usar a replicação baseada em linhas, os efeitos da declaração `UPDATE` *não* são propagados à replica, e a cópia da tabela `sales.january` da replica permanece inalterada; nesse caso, `--replicate-ignore-db=sales` faz com que *todas* as alterações feitas nas tabelas na cópia da fonte do banco de dados `sales` sejam ignoradas pela replica.

  Você não deve usar essa opção se estiver usando atualizações entre bancos de dados e não quiser que essas atualizações sejam replicadas. Veja a Seção 19.2.5, “Como os Servidores Avaliam as Regras de Filtragem de Replicação”.

  Se você precisar que as atualizações entre bancos de dados funcionem, use `--replicate-wild-ignore-table=db_name.%` em vez disso. Veja a Seção 19.2.5, “Como os Servidores Avaliam as Regras de Filtragem de Replicação”.

  Nota

  Esta opção afeta a replicação da mesma maneira que o `--binlog-ignore-db` afeta o registro binário, e os efeitos do formato de replicação sobre como o `--replicate-ignore-db` afeta o comportamento da replicação são os mesmos que os do formato de registro sobre o comportamento do `--binlog-ignore-db`.

  Esta opção não tem efeito nas instruções `BEGIN`, `COMMIT` ou `ROLLBACK`.

- `--replicate-do-table=db_name.tbl_name`

  <table summary="Propriedades para replicate-do-table"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--replicate-do-table=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>

  Cria um filtro de replicação, informando ao fio de SQL de replicação para restringir a replicação a uma determinada tabela. Para especificar mais de uma tabela, use essa opção várias vezes, uma vez para cada tabela. Isso funciona tanto para atualizações entre bancos de dados quanto para atualizações no banco de dados padrão, em contraste com `--replicate-do-db`. Veja a Seção 19.2.5, “Como os Servidores Avaliam as Regras de Filtragem de Replicação”. Você também pode criar esse filtro emitindo uma declaração `CHANGE REPLICATION FILTER REPLICATE_DO_TABLE`.

  Esta opção suporta filtros de replicação específicos de canal, permitindo que réplicas de várias fontes usem filtros específicos para diferentes fontes. Para configurar um filtro de replicação específico de canal em um canal chamado `channel_1`, use `--replicate-do-table:channel_1:db_name.tbl_name`. Neste caso, o primeiro ponto e vírgula é interpretado como um separador e os pontos e vírgulas subsequentes são colchetes. Consulte a Seção 19.2.5.4, “Filtros Baseados em Canais de Replicação” para obter mais informações.

  Nota

  Os filtros de replicação global não podem ser usados em uma instância do servidor MySQL configurada para a Replicação por Grupo, porque filtrar transações em alguns servidores tornaria o grupo incapaz de chegar a um acordo sobre um estado consistente. Filtros de replicação específicos para canais podem ser usados em canais de replicação que não estejam diretamente envolvidos com a Replicação por Grupo, como quando um membro do grupo também atua como replica para uma fonte que está fora do grupo. Eles não podem ser usados nos canais `group_replication_applier` ou `group_replication_recovery`.

  Esta opção afeta apenas as declarações que se aplicam a tabelas. Não afeta declarações que se aplicam apenas a outros objetos do banco de dados, como rotinas armazenadas. Para filtrar declarações que operam em rotinas armazenadas, use uma ou mais das opções `--replicate-*-db`.

- `--replicate-ignore-table=db_name.tbl_name`

  <table summary="Propriedades para replicar-ignorar-tabela"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--replicate-ignore-table=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>

  Cria um filtro de replicação dizendo ao fio de SQL de replicação para não replicar qualquer declaração que atualize a tabela especificada, mesmo que outras tabelas possam ser atualizadas pela mesma declaração. Para especificar mais de uma tabela a ser ignorada, use essa opção várias vezes, uma vez para cada tabela. Isso funciona para atualizações entre bancos, em contraste com `--replicate-ignore-db`. Veja a Seção 19.2.5, “Como os Servidores Avaliam as Regras de Filtragem de Replicação”. Você também pode criar tal filtro emitindo uma declaração `CHANGE REPLICATION FILTER REPLICATE_IGNORE_TABLE`.

  Esta opção suporta filtros de replicação específicos de canal, permitindo que réplicas de várias fontes usem filtros específicos para diferentes fontes. Para configurar um filtro de replicação específico de canal em um canal chamado `channel_1`, use `--replicate-ignore-table:channel_1:db_name.tbl_name`. Neste caso, o primeiro ponto e vírgula é interpretado como um separador e os pontos e vírgulas subsequentes são colchetes. Consulte a Seção 19.2.5.4, “Filtros Baseados em Canais de Replicação” para obter mais informações.

  Nota

  Os filtros de replicação global não podem ser usados em uma instância do servidor MySQL configurada para a Replicação por Grupo, porque filtrar transações em alguns servidores tornaria o grupo incapaz de chegar a um acordo sobre um estado consistente. Filtros de replicação específicos para canais podem ser usados em canais de replicação que não estejam diretamente envolvidos com a Replicação por Grupo, como quando um membro do grupo também atua como replica para uma fonte que está fora do grupo. Eles não podem ser usados nos canais `group_replication_applier` ou `group_replication_recovery`.

  Esta opção afeta apenas as declarações que se aplicam a tabelas. Não afeta declarações que se aplicam apenas a outros objetos do banco de dados, como rotinas armazenadas. Para filtrar declarações que operam em rotinas armazenadas, use uma ou mais das opções `--replicate-*-db`.

- `--replicate-rewrite-db=from_name->to_name`

  <table summary="Propriedades para replicar-reescrever-db"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--replicate-rewrite-db=old_name-&gt;new_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>

  Diga à réplica que crie um filtro de replicação que traduza o banco de dados especificado para `to_name` se ele fosse `from_name` na fonte. Apenas as instruções que envolvem tabelas são afetadas, não instruções como `CREATE DATABASE`, `DROP DATABASE` e `ALTER DATABASE`.

  Para especificar múltiplos reescritos, use essa opção várias vezes. O servidor usa o primeiro com um valor `from_name` que corresponda. A tradução do nome do banco de dados é feita *antes* das regras do `--replicate-*` serem testadas. Você também pode criar um filtro desse tipo emitindo uma declaração `CHANGE REPLICATION FILTER REPLICATE_REWRITE_DB`.

  Se você usar a opção `--replicate-rewrite-db` na linha de comando e o caractere `>` for especial para o interpretador de comandos, cite o valor da opção. Por exemplo:

  ```
  $> mysqld --replicate-rewrite-db="olddb->newdb"
  ```

  O efeito da opção `--replicate-rewrite-db` difere dependendo se o formato de registro binário baseado em declarações ou baseado em linhas é usado para a consulta. Com o formato baseado em declarações, as declarações DML são traduzidas com base no banco de dados atual, conforme especificado pela declaração `USE`. Com o formato baseado em linhas, as declarações DML são traduzidas com base no banco de dados onde a tabela modificada existe. As declarações DDL são sempre filtradas com base no banco de dados atual, conforme especificado pela declaração `USE`, independentemente do formato de registro binário.

  Para garantir que a reescrita produza os resultados esperados, especialmente em combinação com outras opções de filtragem de replicação, siga estas recomendações ao usar a opção `--replicate-rewrite-db`:

  - Crie os bancos de dados `from_name` e `to_name` manualmente na fonte e na replica com nomes diferentes.

  - Se você estiver usando o formato de registro binário baseado em declarações ou misto, não use consultas entre bancos de dados e não especifique nomes de bancos de dados nas consultas. Para declarações de DDL e DML, confie na declaração `USE` para especificar o banco de dados atual e use apenas o nome da tabela nas consultas.

  - Se você usar exclusivamente o formato de registro binário baseado em linhas para instruções DDL, confie na instrução `USE` para especificar o banco de dados atual e use apenas o nome da tabela em consultas. Para instruções DML, você pode usar um nome de tabela totalmente qualificado (*`db`.*`table`\*) se desejar.

  Se essas recomendações forem seguidas, é seguro usar a opção `--replicate-rewrite-db` em combinação com opções de filtragem de replicação de nível de tabela, como `--replicate-do-table`.

  Esta opção suporta filtros de replicação específicos de canal, permitindo que réplicas de várias fontes usem filtros específicos para diferentes fontes. Especifique o nome do canal seguido de um ponto e vírgula, seguido da especificação do filtro. O primeiro ponto e vírgula é interpretado como um separador, e quaisquer pontos e vírgulas subsequentes são interpretados como pontos e vírgulas literais. Por exemplo, para configurar um filtro de replicação específico de canal em um canal chamado `channel_1`, use:

  ```
  $> mysqld --replicate-rewrite-db=channel_1:db_name1->db_name2
  ```

  Se você usar um ponto e vírgula, mas não especificar um nome de canal, a opção configura o filtro de replicação para o canal de replicação padrão. Consulte a Seção 19.2.5.4, “Filtros baseados em canais de replicação”, para obter mais informações.

  Nota

  Os filtros de replicação global não podem ser usados em uma instância do servidor MySQL configurada para a Replicação por Grupo, porque filtrar transações em alguns servidores tornaria o grupo incapaz de chegar a um acordo sobre um estado consistente. Filtros de replicação específicos para canais podem ser usados em canais de replicação que não estejam diretamente envolvidos com a Replicação por Grupo, como quando um membro do grupo também atua como replica para uma fonte que está fora do grupo. Eles não podem ser usados nos canais `group_replication_applier` ou `group_replication_recovery`.

- `--replicate-same-server-id`

  <table summary="Propriedades para master-retry-count"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--master-retry-count=#</code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>86400</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td>[[<code>18446744073709551615</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td>[[<code>4294967295</code>]]</td> </tr></tbody></table>0

  Esta opção é para uso em réplicas. O padrão é 0 (`FALSE`). Com esta opção definida para 1 (`TRUE`), a réplica não pula eventos que têm seu próprio ID de servidor. Esta configuração normalmente é útil apenas em configurações raras.

  Quando o registro binário é habilitado em uma replica, a combinação das opções `--replicate-same-server-id` e `--log-slave-updates` na replica pode causar laços infinitos na replicação se o servidor estiver parte de uma topologia de replicação circular. (No MySQL 8.0, o registro binário é habilitado por padrão, e o registro de atualização da replica é o padrão quando o registro binário está habilitado). No entanto, o uso de identificadores globais de transações (GTIDs) previne essa situação, ignorando a execução de transações que já foram aplicadas. Se `gtid_mode=ON` for definido na replica, você pode iniciar o servidor com essa combinação de opções, mas não pode mudar para qualquer outro modo de GTID enquanto o servidor estiver em execução. Se algum outro modo de GTID for definido, o servidor não será iniciado com essa combinação de opções.

  Por padrão, o fio de I/O de replicação (receptor) não escreve eventos de log binário no log de retransmissão se eles tiverem o ID do servidor da replica (esta otimização ajuda a economizar o uso do disco). Se você quiser usar `--replicate-same-server-id`, certifique-se de iniciar a replica com essa opção antes de fazer a replica ler seus próprios eventos que você deseja que o fio de SQL de replicação (aplicável) execute.

- `--replicate-wild-do-table=db_name.tbl_name`

  <table summary="Propriedades para master-retry-count"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--master-retry-count=#</code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>86400</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td>[[<code>18446744073709551615</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td>[[<code>4294967295</code>]]</td> </tr></tbody></table>1

  Cria um filtro de replicação, informando ao fio de aplicação SQL (aplicador) de replicação para restringir a replicação a instruções nas quais qualquer uma das tabelas atualizadas corresponda aos padrões especificados de nome de banco de dados e tabela. Os padrões podem conter os caracteres de substituição `%` e `_`, que têm o mesmo significado que o operador de correspondência de padrões `LIKE`. Para especificar mais de uma tabela, use essa opção várias vezes, uma vez para cada tabela. Isso funciona para atualizações entre bancos. Veja a Seção 19.2.5, “Como os Servidores Avaliam as Regras de Filtragem de Replicação”. Você também pode criar tal filtro emitindo uma instrução `CHANGE REPLICATION FILTER REPLICATE_WILD_DO_TABLE`.

  Esta opção suporta filtros de replicação específicos de canal, permitindo que réplicas de várias fontes usem filtros específicos para diferentes fontes. Para configurar um filtro de replicação específico de canal em um canal chamado `channel_1`, use `--replicate-wild-do-table:channel_1:db_name.tbl_name`. Neste caso, o primeiro ponto e vírgula é interpretado como um separador e os pontos e vírgulas subsequentes são colchetes. Consulte a Seção 19.2.5.4, “Filtros Baseados em Canais de Replicação” para obter mais informações.

  Importante

  Os filtros de replicação global não podem ser usados em uma instância do servidor MySQL configurada para a Replicação por Grupo, porque filtrar transações em alguns servidores tornaria o grupo incapaz de chegar a um acordo sobre um estado consistente. Filtros de replicação específicos para canais podem ser usados em canais de replicação que não estejam diretamente envolvidos com a Replicação por Grupo, como quando um membro do grupo também atua como replica para uma fonte que está fora do grupo. Eles não podem ser usados nos canais `group_replication_applier` ou `group_replication_recovery`.

  O filtro de replicação especificado pela opção `--replicate-wild-do-table` se aplica a tabelas, visualizações e gatilhos. Ele não se aplica a procedimentos armazenados e funções, ou eventos. Para filtrar instruções que operam sobre esses objetos, use uma ou mais das opções `--replicate-*-db`.

  Como exemplo, `--replicate-wild-do-table=foo%.bar%` replica apenas as atualizações que utilizam uma tabela onde o nome do banco de dados começa com `foo` e o nome da tabela começa com `bar`.

  Se o padrão do nome da tabela for `%`, ele corresponderá a qualquer nome de tabela e a opção também se aplicará a instruções de nível de banco de dados (`CREATE DATABASE`, `DROP DATABASE` e `ALTER DATABASE`). Por exemplo, se você usar `--replicate-wild-do-table=foo%.%`, as instruções de nível de banco de dados serão replicadas se o nome do banco de dados corresponder ao padrão `foo%`.

  Importante

  Os filtros de replicação de nível de tabela são aplicados apenas às tabelas que são explicitamente mencionadas e manipuladas na consulta. Eles não se aplicam a tabelas que são atualizadas implicitamente pela consulta. Por exemplo, uma declaração `GRANT`, que atualiza a tabela do sistema `mysql.user`, mas não menciona essa tabela, não é afetada por um filtro que especifica `mysql.%` como o padrão de substituição.

  Para incluir caracteres curinga literais nos padrões de nomes de banco de dados ou tabelas, escape-os com uma barra invertida. Por exemplo, para replicar todas as tabelas de um banco de dados chamado `my_own%db`, mas não replicar tabelas do banco de dados `my1ownAABCdb`, você deve escapar os caracteres `_` e `%` assim: `--replicate-wild-do-table=my_own\%db`. Se você usar a opção na linha de comando, pode ser necessário duplicar as barras invertidas ou citar o valor da opção, dependendo do seu interpretador de comandos. Por exemplo, com o shell **bash**, você precisaria digitar `--replicate-wild-do-table=my\_own\\%db`.

- `--replicate-wild-ignore-table=db_name.tbl_name`

  <table summary="Propriedades para master-retry-count"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--master-retry-count=#</code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>86400</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td>[[<code>18446744073709551615</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td>[[<code>4294967295</code>]]</td> </tr></tbody></table>2

  Cria um filtro de replicação que impede que o fio de SQL de replicação replique uma instrução em que qualquer tabela corresponda ao padrão de caracteres curinga fornecido. Para especificar mais de uma tabela a ser ignorada, use essa opção várias vezes, uma vez para cada tabela. Isso funciona para atualizações entre bancos de dados. Veja a Seção 19.2.5, “Como os Servidores Avaliam as Regras de Filtragem de Replicação”. Você também pode criar tal filtro emitindo uma instrução `CHANGE REPLICATION FILTER REPLICATE_WILD_IGNORE_TABLE`.

  Esta opção suporta filtros de replicação específicos de canal, permitindo que réplicas de várias fontes usem filtros específicos para diferentes fontes. Para configurar um filtro de replicação específico de canal em um canal chamado `channel_1`, use `--replicate-wild-ignore:channel_1:db_name.tbl_name`. Neste caso, o primeiro ponto e vírgula é interpretado como um separador e os pontos e vírgulas subsequentes são colchetes. Consulte a Seção 19.2.5.4, “Filtros Baseados em Canais de Replicação” para obter mais informações.

  Importante

  Os filtros de replicação global não podem ser usados em uma instância do servidor MySQL configurada para a Replicação por Grupo, porque filtrar transações em alguns servidores tornaria o grupo incapaz de chegar a um acordo sobre um estado consistente. Filtros de replicação específicos para canais podem ser usados em canais de replicação que não estejam diretamente envolvidos com a Replicação por Grupo, como quando um membro do grupo também atua como replica para uma fonte que está fora do grupo. Eles não podem ser usados nos canais `group_replication_applier` ou `group_replication_recovery`.

  Como exemplo, `--replicate-wild-ignore-table=foo%.bar%` não replica atualizações que utilizam uma tabela onde o nome do banco de dados começa com `foo` e o nome da tabela começa com `bar`. Para obter informações sobre como o correspondência funciona, consulte a descrição da opção `--replicate-wild-do-table`. As regras para incluir caracteres curinga literais no valor da opção são as mesmas que para `--replicate-wild-ignore-table`.

  Importante

  Os filtros de replicação de nível de tabela são aplicados apenas às tabelas que são explicitamente mencionadas e manipuladas na consulta. Eles não se aplicam a tabelas que são atualizadas implicitamente pela consulta. Por exemplo, uma declaração `GRANT`, que atualiza a tabela do sistema `mysql.user`, mas não menciona essa tabela, não é afetada por um filtro que especifica `mysql.%` como o padrão de substituição.

  Se você precisar filtrar as declarações `GRANT` ou outras declarações administrativas, uma solução possível é usar o filtro `--replicate-ignore-db`. Esse filtro opera no banco de dados padrão que está atualmente em vigor, conforme determinado pela declaração `USE`. Portanto, você pode criar um filtro para ignorar declarações de um banco de dados que não está replicado e, em seguida, emitir a declaração `USE` para alternar o banco de dados padrão para aquele imediatamente antes de emitir quaisquer declarações administrativas que você deseja ignorar. Na declaração administrativa, nomeie o banco de dados real onde a declaração é aplicada.

  Por exemplo, se `--replicate-ignore-db=nonreplicated` estiver configurado no servidor de replicação, a seguinte sequência de instruções faz com que a instrução `GRANT` seja ignorada, porque o banco de dados padrão `nonreplicated` está em vigor:

  ```
  USE nonreplicated;
  GRANT SELECT, INSERT ON replicated.t1 TO 'someuser'@'somehost';
  ```

- `--skip-replica-start`

  <table summary="Propriedades para master-retry-count"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--master-retry-count=#</code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>86400</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td>[[<code>18446744073709551615</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td>[[<code>4294967295</code>]]</td> </tr></tbody></table>3

  A partir do MySQL 8.0.26, use `--skip-replica-start` no lugar de `--skip-slave-start`, que foi descontinuado a partir dessa versão. Em versões anteriores ao MySQL 8.0.26, use `--skip-slave-start`.

  `--skip-replica-start` informa ao servidor de replicação que não deve iniciar as threads de I/O de replicação (receptor) e SQL (aplicador) quando o servidor for iniciado. Para iniciar as threads mais tarde, use uma instrução `START REPLICA`.

  Você pode usar a variável de sistema `skip_replica_start` no lugar da opção de linha de comando para permitir o acesso a este recurso usando a estrutura de privilégios do MySQL Server, para que os administradores de banco de dados não precisem de acesso privilegiado ao sistema operacional.

- `--skip-slave-start`

  <table summary="Propriedades para master-retry-count"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--master-retry-count=#</code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>86400</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td>[[<code>18446744073709551615</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td>[[<code>4294967295</code>]]</td> </tr></tbody></table>4

  A partir do MySQL 8.0.26, `--skip-slave-start` é descontinuado e o alias `--skip-replica-start` deve ser usado em vez disso. Em versões anteriores ao MySQL 8.0.26, use `--skip-slave-start`.

  Diga ao servidor de replicação que não inicie as threads de I/O de replicação (receptor) e SQL (aplicador) quando o servidor for iniciado. Para iniciar as threads mais tarde, use uma instrução `START REPLICA`.

  A partir do MySQL 8.0.24, você pode usar a variável de sistema `skip_slave_start` no lugar da opção de linha de comando para permitir o acesso a esse recurso usando a estrutura de privilégios do MySQL Server, para que os administradores de banco de dados não precisem de acesso privilegiado ao sistema operacional.

- `--slave-skip-errors=[err_code1,err_code2,...|all|ddl_exist_errors]`

  <table summary="Propriedades para master-retry-count"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--master-retry-count=#</code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>86400</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td>[[<code>18446744073709551615</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td>[[<code>4294967295</code>]]</td> </tr></tbody></table>5

  Normalmente, a replicação é interrompida quando ocorre um erro na replica, o que lhe dá a oportunidade de resolver a inconsistência nos dados manualmente. Esta opção faz com que o fio de replicação SQL continue a replicar quando uma instrução retorna qualquer um dos erros listados no valor da opção.

  Não use esta opção a menos que entenda completamente por que está recebendo erros. Se não houver erros na configuração de replicação e nos programas do cliente, e nenhum erro no próprio MySQL, um erro que interrompa a replicação nunca deve ocorrer. O uso indiscriminado desta opção resulta em réplicas ficando desesperadamente fora de sincronia com a fonte, sem que você tenha a menor ideia do porquê isso ocorreu.

  Para códigos de erro, você deve usar os números fornecidos pela mensagem de erro no log de erro da sua réplica e na saída do `SHOW REPLICA STATUS`. O Apêndice B, *Mensagens de Erro e Problemas Comuns*, lista os códigos de erro do servidor.

  O valor abreviado `ddl_exist_errors` é equivalente à lista de códigos de erro `1007,1008,1050,1051,1054,1060,1061,1068,1091,1146`.

  Você também pode (mas não deve) usar o valor muito não recomendado `all` para fazer com que a replica ignore todas as mensagens de erro e continue avançando, independentemente do que aconteça. Sem necessidade de dizer, se você usar `all`, não há garantias quanto à integridade dos seus dados. Por favor, não reclame (ou faça relatórios de bugs) neste caso, se os dados da replica não estiverem nem perto do que estão na fonte. *Você foi avisado*.

  Esta opção não funciona da mesma maneira ao replicar entre NDB Clusters, devido ao mecanismo interno `NDB` para verificar os números de sequência de época; normalmente, assim que o `NDB` detecta um número de época ausente ou fora de sequência, ele interrompe imediatamente o fio do aplicável de réplica. A partir do NDB 8.0.28, você pode sobrepor esse comportamento especificando também `--ndb-applier-allow-skip-epoch` junto com `--slave-skip-errors`; isso faz com que o `NDB` ignore as transações de época ignoradas.

  Exemplos:

  ```
  --slave-skip-errors=1062,1053
  --slave-skip-errors=all
  --slave-skip-errors=ddl_exist_errors
  ```

- `--slave-sql-verify-checksum={0|1}`

  <table summary="Propriedades para master-retry-count"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--master-retry-count=#</code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>86400</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td>[[<code>18446744073709551615</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td>[[<code>4294967295</code>]]</td> </tr></tbody></table>6

  Quando essa opção está habilitada, a replica examina os checksums lidos do log do retransmissor. Em caso de discrepância, a replica para com um erro.

As seguintes opções são usadas internamente pelo conjunto de testes do MySQL para testes de replicação e depuração. Elas não são destinadas ao uso em um ambiente de produção.

- `--abort-slave-event-count`

  <table summary="Propriedades para master-retry-count"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--master-retry-count=#</code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>86400</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td>[[<code>18446744073709551615</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td>[[<code>4294967295</code>]]</td> </tr></tbody></table>7

  Quando esta opção é definida para um número inteiro positivo `value` diferente de 0 (o padrão), ela afeta o comportamento da replicação da seguinte forma: Após o thread de SQL da replicação ter sido iniciado, os eventos de log `value` são permitidos para serem executados; após isso, o thread de SQL da replicação não recebe mais eventos, assim como se a conexão de rede da fonte tivesse sido cortada. O thread de SQL da replicação continua em execução, e a saída de `SHOW REPLICA STATUS` exibe `Yes` nas colunas `Replica_IO_Running` e `Replica_SQL_Running`, mas nenhum evento adicional é lido do log de retransmissão.

  Esta opção é usada internamente pelo conjunto de testes do MySQL para testes de replicação e depuração. Não é destinada ao uso em um ambiente de produção. A partir do MySQL 8.0.29, ela está desatualizada e sujeita à remoção em uma versão futura do MySQL.

- `--disconnect-slave-event-count`

  <table summary="Propriedades para master-retry-count"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--master-retry-count=#</code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>86400</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td>[[<code>18446744073709551615</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td>[[<code>4294967295</code>]]</td> </tr></tbody></table>8

  Esta opção é usada internamente pelo conjunto de testes do MySQL para testes de replicação e depuração. Não é destinada ao uso em um ambiente de produção. A partir do MySQL 8.0.29, ela está desatualizada e sujeita à remoção em uma versão futura do MySQL.

##### Variáveis do sistema usadas em servidores replicados

A lista a seguir descreve as variáveis de sistema para controlar os servidores de replicação. Elas podem ser definidas na inicialização do servidor e algumas podem ser alteradas em tempo de execução usando `SET`. As opções do servidor usadas com réplicas estão listadas anteriormente nesta seção.

- `init_replica`

  <table summary="Propriedades para master-retry-count"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--master-retry-count=#</code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>86400</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td>[[<code>18446744073709551615</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td>[[<code>4294967295</code>]]</td> </tr></tbody></table>9

  A partir do MySQL 8.0.26, use `init_replica` no lugar de `init_slave`, que foi descontinuado a partir dessa versão. Em versões anteriores ao MySQL 8.0.26, use `init_slave`.

  `init_replica` é semelhante a `init_connect`, mas é uma string que deve ser executada por um servidor replicador cada vez que o fio de SQL de replicação for iniciado. O formato da string é o mesmo do da variável `init_connect`. A configuração desta variável tem efeito para as instruções subsequentes de `START REPLICA`.

  Nota

  O fio de replicação SQL envia um reconhecimento ao cliente antes de executar `init_replica`. Portanto, não é garantido que `init_replica` tenha sido executado quando `START REPLICA` retorna. Consulte a Seção 15.4.2.6, “Instrução START REPLICA”, para obter mais informações.

- `init_slave`

  <table summary="Propriedades para max_relay_log_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--max-relay-log-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>max_relay_log_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1073741824</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr><tr><th>Tamanho do bloco</th> <td>[[<code>4096</code>]]</td> </tr></tbody></table>0

  A partir do MySQL 8.0.26, `init_slave` é descontinuado e o alias `init_replica` deve ser usado em vez disso. Em versões anteriores ao MySQL 8.0.26, use `init_slave`.

  `init_slave` é semelhante a `init_connect`, mas é uma string que deve ser executada por um servidor replicador cada vez que o fio de SQL de replicação for iniciado. O formato da string é o mesmo do da variável `init_connect`. A configuração desta variável tem efeito para as instruções subsequentes de `START REPLICA`.

  Nota

  O fio de replicação SQL envia um reconhecimento ao cliente antes de executar `init_slave`. Portanto, não é garantido que `init_slave` tenha sido executado quando `START REPLICA` retorna. Consulte a Seção 15.4.2.6, “Instrução START REPLICA”, para obter mais informações.

- `log_slow_replica_statements`

  <table summary="Propriedades para max_relay_log_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--max-relay-log-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>max_relay_log_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1073741824</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr><tr><th>Tamanho do bloco</th> <td>[[<code>4096</code>]]</td> </tr></tbody></table>1

  A partir do MySQL 8.0.26, use `log_slow_replica_statements` no lugar de `log_slow_slave_statements`, que foi descontinuado a partir dessa versão. Em versões anteriores ao MySQL 8.0.26, use `log_slow_slave_statements`.

  Quando o registro de consultas lentas é habilitado, `log_slow_replica_statements` habilita o registro de consultas que levaram mais de `long_query_time` segundos para serem executadas na replica. Observe que, se a replicação baseada em linhas estiver em uso (`binlog_format=ROW`), `log_slow_replica_statements` não tem efeito. As consultas são adicionadas ao registro de consultas lentas da replica apenas quando são registradas no formato de declaração no log binário, ou seja, quando `binlog_format=STATEMENT` está definido, ou quando `binlog_format=MIXED` está definido e a declaração é registrada no formato de declaração. As consultas lentas que são registradas no formato de linha quando `binlog_format=MIXED` está definido, ou que são registradas quando `binlog_format=ROW` está definido, não são adicionadas ao registro de consultas lentas da replica, mesmo que `log_slow_replica_statements` esteja habilitado.

  A definição de `log_slow_replica_statements` não tem efeito imediato. O estado da variável se aplica a todas as instruções subsequentes de `START REPLICA`. Além disso, observe que o ajuste global para `long_query_time` se aplica durante a vida útil do thread de replicação do SQL. Se você alterar essa configuração, precisará parar e reiniciar o thread de replicação do SQL para implementar a mudança (por exemplo, emitindo as instruções `STOP REPLICA` e `START REPLICA` com a opção `SQL_THREAD`).

- `log_slow_slave_statements`

  <table summary="Propriedades para max_relay_log_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--max-relay-log-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>max_relay_log_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1073741824</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr><tr><th>Tamanho do bloco</th> <td>[[<code>4096</code>]]</td> </tr></tbody></table>2

  A partir do MySQL 8.0.26, `log_slow_slave_statements` é descontinuado e o alias `log_slow_replica_statements` deve ser usado em vez disso. Em versões anteriores ao MySQL 8.0.26, use `log_slow_slave_statements`.

  Quando o registro de consultas lentas é habilitado, `log_slow_slave_statements` habilita o registro de consultas que levaram mais de `long_query_time` segundos para serem executadas na replica. Observe que, se a replicação baseada em linhas estiver em uso (`binlog_format=ROW`), `log_slow_slave_statements` não tem efeito. As consultas são adicionadas ao registro de consultas lentas da replica apenas quando são registradas no formato de declaração no log binário, ou seja, quando `binlog_format=STATEMENT` está definido, ou quando `binlog_format=MIXED` está definido e a declaração é registrada no formato de declaração. As consultas lentas que são registradas no formato de linha quando `binlog_format=MIXED` está definido, ou que são registradas quando `binlog_format=ROW` está definido, não são adicionadas ao registro de consultas lentas da replica, mesmo que `log_slow_slave_statements` esteja habilitado.

  A definição de `log_slow_slave_statements` não tem efeito imediato. O estado da variável se aplica a todas as instruções subsequentes de `START REPLICA`. Além disso, observe que o ajuste global para `long_query_time` se aplica durante a vida útil do thread de replicação do SQL. Se você alterar essa configuração, precisará parar e reiniciar o thread de replicação do SQL para implementar a mudança (por exemplo, emitindo as instruções `STOP REPLICA` e `START REPLICA` com a opção `SQL_THREAD`).

- `master_info_repository`

  <table summary="Propriedades para max_relay_log_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--max-relay-log-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>max_relay_log_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1073741824</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr><tr><th>Tamanho do bloco</th> <td>[[<code>4096</code>]]</td> </tr></tbody></table>3

  O uso desta variável do sistema está sendo desaconselhado. O ajuste `TABLE` é o padrão e é necessário quando vários canais de replicação são configurados. O ajuste alternativo `FILE` foi anteriormente desaconselhado.

  Com a configuração padrão, os registros de replicação armazenam metadados sobre a fonte, consistindo de status e informações de conexão, em uma tabela `InnoDB` no banco de dados do sistema `mysql` chamado `mysql.slave_master_info`. Para obter mais informações sobre o repositório de metadados de conexão, consulte a Seção 19.2.4, “Repositórios de Log de Relógio e Metadados de Replicação”.

  A configuração `FILE` escreveu o repositório de metadados de conexão da réplica em um arquivo, que era chamado de `master.info` por padrão. O nome poderia ser alterado usando a opção `--master-info-file`.

- `max_relay_log_size`

  <table summary="Propriedades para max_relay_log_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--max-relay-log-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>max_relay_log_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1073741824</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr><tr><th>Tamanho do bloco</th> <td>[[<code>4096</code>]]</td> </tr></tbody></table>4

  Se uma escrita de uma replica em seu log de retransmissão causar que o tamanho atual do arquivo de log exceda o valor desta variável, a replica rotaciona os logs de retransmissão (fecha o arquivo atual e abre o próximo). Se `max_relay_log_size` for 0, o servidor usa `max_binlog_size` tanto para o log binário quanto para o log de retransmissão. Se `max_relay_log_size` for maior que 0, ele limita o tamanho do log de retransmissão, o que permite que você tenha tamanhos diferentes para os dois logs. Você deve definir `max_relay_log_size` entre 4096 bytes e 1GB (inclusivo) ou para 0. O valor padrão é 0. Veja a Seção 19.2.3, “Threads de Replicação”.

- `relay_log`

  <table summary="Propriedades para max_relay_log_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--max-relay-log-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>max_relay_log_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1073741824</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr><tr><th>Tamanho do bloco</th> <td>[[<code>4096</code>]]</td> </tr></tbody></table>5

  O nome de base para os arquivos de registro do retransmissor. Para o canal de replicação padrão, o nome de base padrão para os logs do retransmissor é `host_name-relay-bin`. Para canais de replicação não padrão, o nome de base padrão para os logs do retransmissor é `host_name-relay-bin-channel`, onde `channel` é o nome do canal de replicação registrado neste log de retransmissor.

  O servidor escreve o arquivo no diretório de dados, a menos que o nome base seja fornecido com um nome de caminho absoluto no início para especificar um diretório diferente. O servidor cria arquivos de log de retransmissão em sequência, adicionando um sufixo numérico ao nome base.

  O log de relé e o índice de log de relé em um servidor de replicação não podem ter os mesmos nomes que o log binário e o índice de log binário, cujos nomes são especificados pelas opções `--log-bin` e `--log-bin-index`. O servidor emite uma mensagem de erro e não inicia se os nomes de base dos arquivos de log binário e log de relé forem os mesmos.

  Devido à maneira como o MySQL analisa as opções do servidor, se você especificar essa variável na inicialização do servidor, você deve fornecer um valor; *o nome de base padrão é usado apenas se a opção não for especificada realmente*. Se você especificar a variável de sistema `relay_log` na inicialização do servidor sem especificar um valor, é provável que ocorra um comportamento inesperado; esse comportamento depende das outras opções usadas, da ordem em que são especificadas e se são especificadas na linha de comando ou em um arquivo de opção. Para obter mais informações sobre como o MySQL lida com as opções do servidor, consulte a Seção 6.2.2, “Especificação de Opções do Programa”.

  Se você especificar essa variável, o valor especificado também será usado como o nome base do arquivo de índice do log do relé. Você pode substituir esse comportamento especificando um nome de base diferente para o arquivo de índice do log do relé usando a variável de sistema `relay_log_index`.

  Quando o servidor lê uma entrada do arquivo de índice, ele verifica se a entrada contém um caminho relativo. Se estiver presente, a parte relativa do caminho é substituída pelo caminho absoluto definido usando a variável de sistema `relay_log`. Um caminho absoluto permanece inalterado; nesse caso, o índice deve ser editado manualmente para permitir que o novo caminho ou caminhos sejam usados.

  Você pode achar a variável de sistema `relay_log` útil para realizar as seguintes tarefas:

  - Criar logs de retransmissão cujos nomes são independentes dos nomes dos hosts.

  - Se você precisar colocar os logs do retransmissor em uma área diferente do diretório de dados, porque seus logs do retransmissor tendem a ser muito grandes e você não quer diminuir `max_relay_log_size`.

  - Para aumentar a velocidade usando o balanceamento de carga entre discos.

  Você pode obter o nome (e o caminho) do arquivo de registro do retransmissor a partir da variável de sistema `relay_log_basename`.

- `relay_log_basename`

  <table summary="Propriedades para max_relay_log_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--max-relay-log-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>max_relay_log_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1073741824</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr><tr><th>Tamanho do bloco</th> <td>[[<code>4096</code>]]</td> </tr></tbody></table>6

  Contém o nome de base e o caminho completo do arquivo de registro do retransmissor. O comprimento máximo da variável é de 256 caracteres. Esta variável é definida pelo servidor e é somente de leitura.

- `relay_log_index`

  <table summary="Propriedades para max_relay_log_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--max-relay-log-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>max_relay_log_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1073741824</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr><tr><th>Tamanho do bloco</th> <td>[[<code>4096</code>]]</td> </tr></tbody></table>7

  O nome do arquivo de índice do log de retransmissão. O comprimento máximo da variável é de 256 caracteres. Se você não especificar essa variável, mas a variável `relay_log` for especificada, seu valor será usado como o nome padrão do arquivo de índice do log de retransmissão. Se `relay_log` também não for especificado, o nome padrão para o canal de replicação não padrão será `host_name-relay-bin.index`, usando o nome da máquina hospedeira. Para canais de replicação não padrão, o nome padrão é `host_name-relay-bin-channel.index`, onde `channel` é o nome do canal de replicação registrado neste arquivo de índice do log de retransmissão.

  O local padrão para os arquivos de registro do retransmissor é o diretório de dados ou qualquer outro local que foi especificado usando a variável de sistema `relay_log`. Você pode usar a variável de sistema `relay_log_index` para especificar um local alternativo, adicionando um nome de caminho absoluto antes do nome da base para especificar um diretório diferente.

  O log de relé e o índice de log de relé em um servidor de replicação não podem ter os mesmos nomes que o log binário e o índice de log binário, cujos nomes são especificados pelas opções `--log-bin` e `--log-bin-index`. O servidor emite uma mensagem de erro e não inicia se os nomes de base dos arquivos de log binário e log de relé forem os mesmos.

  Devido à maneira como o MySQL analisa as opções do servidor, se você especificar essa variável na inicialização do servidor, você deve fornecer um valor; *o nome de base padrão é usado apenas se a opção não for especificada realmente*. Se você especificar a variável de sistema `relay_log_index` na inicialização do servidor sem especificar um valor, é provável que ocorra um comportamento inesperado; esse comportamento depende das outras opções usadas, da ordem em que são especificadas e se são especificadas na linha de comando ou em um arquivo de opção. Para obter mais informações sobre como o MySQL lida com as opções do servidor, consulte a Seção 6.2.2, “Especificação de Opções do Programa”.

- `relay_log_info_file`

  <table summary="Propriedades para max_relay_log_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--max-relay-log-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>max_relay_log_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1073741824</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr><tr><th>Tamanho do bloco</th> <td>[[<code>4096</code>]]</td> </tr></tbody></table>8

  O uso desta variável de sistema está sendo desaconselhado. Ela era usada para definir o nome do arquivo para o repositório de metadados do aplicador da replica se `relay_log_info_repository=FILE` estivesse definido. `relay_log_info_file` e o uso da variável de sistema `relay_log_info_repository` estão sendo desaconselhados porque o uso de um arquivo para o repositório de metadados do aplicador foi substituído por tabelas seguras em caso de falha. Para obter informações sobre o repositório de metadados do aplicador, consulte a Seção 19.2.4.2, “Repositórios de Metadados de Replicação”.

- `relay_log_info_repository`

  <table summary="Propriedades para max_relay_log_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--max-relay-log-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>max_relay_log_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1073741824</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr><tr><th>Tamanho do bloco</th> <td>[[<code>4096</code>]]</td> </tr></tbody></table>9

  O uso desta variável do sistema está sendo desaconselhado. O ajuste `TABLE` é o padrão e é necessário quando múltiplos canais de replicação são configurados. O ajuste `TABLE` para o repositório de metadados do aplicador da replica também é necessário para tornar a replicação resiliente a interrupções inesperadas. Consulte a Seção 19.4.2, “Tratamento de uma Interrupção Inesperada de uma Replica”, para obter mais informações. O ajuste alternativo `FILE` foi anteriormente desaconselhado.

  Com a configuração padrão, a replica armazena seu repositório de metadados do aplicável como uma tabela `InnoDB` no banco de dados do sistema `mysql` chamado `mysql.slave_relay_log_info`. Para obter mais informações sobre o repositório de metadados do aplicável, consulte a Seção 19.2.4, “Repositórios de Log de Relay e Metadados de Replicação”.

  A configuração `FILE` escreveu o repositório de metadados do aplicativo da réplica em um arquivo, que era chamado de `relay-log.info` por padrão. O nome poderia ser alterado usando a variável de sistema `relay_log_info_file`.

- `relay_log_purge`

  <table summary="Propriedades para relay_log_purge"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--relay-log-purge[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>relay_log_purge</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>0

  Desabilita ou habilita a limpeza automática dos arquivos de registro do relé assim que eles não forem mais necessários. O valor padrão é 1 (`ON`).

- `relay_log_recovery`

  <table summary="Propriedades para relay_log_purge"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--relay-log-purge[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>relay_log_purge</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>1

  Se habilitada, essa variável permite a recuperação automática do log do relé imediatamente após a inicialização do servidor. O processo de recuperação cria um novo arquivo de log do relé, inicializa a posição da thread SQL (aplicador) para esse novo log do relé e inicializa a thread de E/S (receptor) para a posição da thread aplicador. A leitura do log do relé da fonte continua então. Se `SOURCE_AUTO_POSITION=1` foi definido para o canal de replicação usando a opção `CHANGE REPLICATION SOURCE TO`, a posição da fonte usada para iniciar a replicação pode ser a recebida na conexão e não as atribuídas neste processo.

  Essa variável global é somente de leitura durante a execução. Seu valor pode ser definido com a opção `--relay-log-recovery` ao iniciar o servidor de replica, que deve ser usado após uma parada inesperada de uma replica para garantir que nenhum log de retransmissão possivelmente corrompido seja processado, e deve ser usado para garantir uma replica resistente a falhas. O valor padrão é 0 (desativado). Para informações sobre a combinação de configurações em uma replica que é mais resistente a paradas inesperadas, consulte a Seção 19.4.2, “Tratamento de uma Parada Inesperada de uma Replica”.

  Para uma replica multithread (onde `replica_parallel_workers` ou `slave_parallel_workers` é maior que 0), definir `--relay-log-recovery` no início automaticamente lida com quaisquer inconsistências e lacunas na sequência de transações que foram executadas a partir do log de retransmissão. Essas lacunas podem ocorrer quando a replicação baseada em posição de arquivo está em uso. (Para mais detalhes, consulte a Seção 19.5.1.34, “Inconsistências de Replicação e Transações”.) O processo de recuperação do log de retransmissão lida com as lacunas usando o mesmo método que a instrução `START REPLICA UNTIL SQL_AFTER_MTS_GAPS` faria. Quando a replicação baseada em GTID está em uso, a partir do MySQL 8.0.18, uma replica multithread verifica primeiro se `MASTER_AUTO_POSITION` está definido como `ON`, e se estiver, omite o passo de calcular as transações que devem ser ignoradas ou não ignoradas, para que os antigos logs de retransmissão não sejam necessários para o processo de recuperação.

  Nota

  Essa variável não afeta os seguintes canais de replicação em grupo:

  - `group_replication_applier`
  - `group_replication_recovery`

  Qualquer outro canal que esteja sendo executado em um grupo será afetado, como um canal que esteja replicando de uma fonte externa ou de outro grupo.

- `relay_log_space_limit`

  <table summary="Propriedades para relay_log_purge"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--relay-log-purge[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>relay_log_purge</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>2

  O valor máximo de espaço a ser utilizado para todos os logs de retransmissão.

- `replica_checkpoint_group`

  <table summary="Propriedades para relay_log_purge"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--relay-log-purge[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>relay_log_purge</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>3

  A partir do MySQL 8.0.26, use `replica_checkpoint_group` no lugar de `slave_checkpoint_group`, que foi descontinuado a partir dessa versão. Em versões anteriores ao MySQL 8.0.26, use `slave_checkpoint_group`.

  `replica_checkpoint_group` define o número máximo de transações que podem ser processadas por uma replica multithreading antes que uma operação de verificação de ponto seja chamada para atualizar seu status, conforme mostrado por `SHOW REPLICA STATUS`. Definir essa variável não tem efeito em réplicas para as quais a multithreading não está habilitada. Definir essa variável não tem efeito imediato. O estado da variável se aplica a todas as declarações subsequentes de `START REPLICA`.

  Anteriormente, as réplicas multithreads não eram suportadas pelo NDB Cluster, o que ignorava silenciosamente a configuração dessa variável. Essa restrição foi removida no MySQL 8.0.33.

  Essa variável funciona em combinação com a variável de sistema `replica_checkpoint_period` de tal forma que, quando qualquer um dos limites é ultrapassado, o ponto de verificação é executado e os contadores que rastreiam tanto o número de transações quanto o tempo decorrido desde o último ponto de verificação são reiniciados.

  O valor mínimo permitido para essa variável é 32, a menos que o servidor tenha sido construído usando `-DWITH_DEBUG`, nesse caso, o valor mínimo é 1. O valor efetivo é sempre um múltiplo de 8; você pode defini-lo para um valor que não seja um múltiplo desse, mas o servidor arredonda para o próximo múltiplo inferior de 8 antes de armazenar o valor. (*Exceção*: Nenhuma tal arredondamento é realizado pelo servidor de depuração.) Independentemente de como o servidor foi construído, o valor padrão é 512 e o valor máximo permitido é 524280.

- `replica_checkpoint_period`

  <table summary="Propriedades para relay_log_purge"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--relay-log-purge[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>relay_log_purge</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>4

  No MySQL 8.0.26 e versões posteriores, use `replica_checkpoint_period` no lugar de `slave_checkpoint_period`, que foi descontinuado a partir dessa versão; antes do MySQL 8.0.26, use `slave_checkpoint_period`.

  `replica_checkpoint_period` define o tempo máximo (em milissegundos) que pode passar antes que uma operação de ponto de verificação seja chamada para atualizar o status de uma replica multithreading, conforme mostrado por `SHOW REPLICA STATUS`. Definir essa variável não tem efeito em réplicas para as quais a multithreading não está habilitada. Definir essa variável entra em vigor imediatamente para todos os canais de replicação, incluindo canais em execução.

  Anteriormente, as réplicas multithreads não eram suportadas pelo NDB Cluster, o que ignorava silenciosamente a configuração dessa variável. Essa restrição foi removida no MySQL 8.0.33.

  Essa variável funciona em combinação com a variável de sistema `replica_checkpoint_group` de tal forma que, quando qualquer um dos limites é ultrapassado, o ponto de verificação é executado e os contadores que rastreiam tanto o número de transações quanto o tempo decorrido desde o último ponto de verificação são reiniciados.

  O valor mínimo permitido para essa variável é 1, a menos que o servidor tenha sido construído usando `-DWITH_DEBUG`, caso em que o valor mínimo é 0. Independentemente de como o servidor foi construído, o valor padrão é de 300 milissegundos e o valor máximo possível é de 4294967295 milissegundos (aproximadamente 49,7 dias).

- `replica_compressed_protocol`

  <table summary="Propriedades para relay_log_purge"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--relay-log-purge[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>relay_log_purge</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>5

  A partir do MySQL 8.0.26, use `replica_compressed_protocol` no lugar de `slave_compressed_protocol`, que está desatualizado. Em versões anteriores ao MySQL 8.0.26, use `slave_compressed_protocol`.

  `replica_compressed_protocol` especifica se a compressão do protocolo de conexão de origem/replica deve ser usada, se tanto a origem quanto a replica o suportam. Se essa variável estiver desabilitada (o padrão), as conexões não serão comprimidas. As alterações nessa variável entram em vigor nas tentativas de conexão subsequentes; isso inclui após a emissão de uma declaração `START REPLICA`, bem como as reconexões feitas por uma thread de I/O de replicação em execução (receptor).

  A compressão de transações de log binário (disponível a partir do MySQL 8.0.20), que é ativada pela variável de sistema `binlog_transaction_compression`, também pode ser usada para economizar largura de banda. Se você usar a compressão de transações de log binário em combinação com a compressão de protocolo, a compressão de protocolo terá menos oportunidades de agir nos dados, mas ainda poderá comprimir cabeçalhos e aqueles eventos e cargas de trabalho de transações que não estiverem compactados. Para obter mais informações sobre a compressão de transações de log binário, consulte a Seção 7.4.4.5, “Compressão de Transações de Log Binário”.

  Se `replica_compressed_protocol` estiver habilitado, ele terá precedência sobre qualquer opção `SOURCE_COMPRESSION_ALGORITHMS` especificada para a declaração `CHANGE REPLICATION SOURCE TO`. Nesse caso, as conexões à fonte utilizam a compressão `zlib` se tanto a fonte quanto a replica suportam esse algoritmo. Se `replica_compressed_protocol` estiver desativado, o valor de `SOURCE_COMPRESSION_ALGORITHMS` será aplicado. Para mais informações, consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.

- `replica_exec_mode`

  <table summary="Propriedades para relay_log_purge"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--relay-log-purge[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>relay_log_purge</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>6

  A partir do MySQL 8.0.26, use `replica_exec_mode` no lugar de `slave_exec_mode`, que foi descontinuado a partir dessa versão. Em versões anteriores ao MySQL 8.0.26, use `slave_exec_mode`.

  `replica_exec_mode` controla como um fio de replicação resolve conflitos e erros durante a replicação. O modo `IDEMPOTENT` causa a supressão de erros de chave duplicada e sem chave encontrada; `STRICT` significa que essa supressão não ocorre.

  O modo `IDEMPOTENT` é destinado ao uso na replicação de múltiplas fontes, replicação circular e outros cenários de replicação especiais para a replicação do NDB Cluster. (Consulte a Seção 25.7.10, “Replicação do NDB Cluster: Replicação Bidirecional e Circular”, e a Seção 25.7.12, “Resolução de Conflitos na Replicação do NDB Cluster”, para obter mais informações.) O NDB Cluster ignora qualquer valor explicitamente definido para `replica_exec_mode` e sempre o trata como `IDEMPOTENT`.

  No MySQL Server 8.0, o modo `STRICT` é o valor padrão.

  A definição desta variável tem efeito imediato em todos os canais de replicação, incluindo os canais em execução.

  Para motores de armazenamento que não sejam `NDB`, o modo *`IDEMPOTENT` deve ser usado apenas quando você tiver certeza absoluta de que erros de chave duplicada e erros de chave não encontrada podem ser ignorados com segurança*. Ele é destinado a ser usado em cenários de fail-over para NDB Cluster, onde a replicação de múltiplas fontes ou replicação circular é empregada, e não é recomendado para uso em outros casos.

- `replica_load_tmpdir`

  <table summary="Propriedades para relay_log_purge"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--relay-log-purge[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>relay_log_purge</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>7

  A partir do MySQL 8.0.26, use `replica_load_tmpdir` no lugar de `slave_load_tmpdir`, que foi descontinuado a partir dessa versão. Em versões anteriores ao MySQL 8.0.26, use `slave_load_tmpdir`.

  `replica_load_tmpdir` especifica o nome do diretório onde a replica cria arquivos temporários. A definição dessa variável entra em vigor imediatamente para todos os canais de replicação, incluindo os canais em execução. O valor da variável é, por padrão, igual ao valor da variável de sistema `tmpdir`, ou ao valor padrão que se aplica quando essa variável de sistema não é especificada.

  Quando o fio de replicação do SQL replica uma instrução `LOAD DATA`, ele extrai o arquivo a ser carregado do log de retransmissão para arquivos temporários e, em seguida, carrega esses arquivos na tabela. Se o arquivo carregado na fonte for enorme, os arquivos temporários na replica também serão enormes. Portanto, pode ser aconselhável usar essa opção para dizer à replica para colocar os arquivos temporários em um diretório localizado em algum sistema de arquivos que tenha muito espaço disponível. Nesse caso, os logs de retransmissão também serão enormes, então você também pode querer definir a variável de sistema `relay_log` para colocar os logs de retransmissão nesse sistema de arquivos.

  O diretório especificado por esta opção deve estar localizado em um sistema de arquivos baseado em disco (não em um sistema de arquivos baseado em memória) para que os arquivos temporários usados para replicar as instruções `LOAD DATA` possam sobreviver a reinicializações da máquina. O diretório também não deve ser aquele que seja limpo pelo sistema operacional durante o processo de inicialização do sistema. No entanto, a replicação agora pode continuar após um reinício se os arquivos temporários tiverem sido removidos.

- `replica_max_allowed_packet`

  <table summary="Propriedades para relay_log_purge"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--relay-log-purge[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>relay_log_purge</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>8

  A partir do MySQL 8.0.26, use `replica_max_allowed_packet` no lugar de `slave_max_allowed_packet`, que foi descontinuado a partir dessa versão. Em versões anteriores ao MySQL 8.0.26, use `slave_max_allowed_packet`.

  `replica_max_allowed_packet` define o tamanho máximo do pacote em bytes que os threads de aplicação (aplicador) e recepção (receptor) de replicação podem lidar. A definição desta variável entra em vigor imediatamente para todos os canais de replicação, incluindo os canais em execução. É possível que uma fonte escreva eventos de log binário maiores que a definição de `max_allowed_packet` uma vez que o cabeçalho do evento é adicionado. A definição de `replica_max_allowed_packet` deve ser maior que a definição de `max_allowed_packet` na fonte, para que grandes atualizações usando replicação baseada em linhas não causem falha na replicação.

  Essa variável global sempre tem um valor que é um múltiplo inteiro positivo de 1024; se você defini-la para um valor que não seja, o valor é arredondado para o próximo múltiplo mais alto de 1024 para ser armazenado ou usado; definir `replica_max_allowed_packet` para 0 faz com que 1024 seja usado. (Um aviso de truncação é emitido em todos esses casos.) O valor padrão e máximo é 1073741824 (1 GB); o mínimo é 1024.

- `replica_net_timeout`

  <table summary="Propriedades para relay_log_purge"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--relay-log-purge[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>relay_log_purge</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>9

  A partir do MySQL 8.0.26, use `replica_net_timeout` no lugar de `slave_net_timeout`, que foi descontinuado a partir dessa versão. Em versões anteriores ao MySQL 8.0.26, use `slave_net_timeout`.

  `replica_net_timeout` especifica o número de segundos para esperar por mais dados ou um sinal de batida de coração da fonte antes que a replica considere a conexão quebrada, interrompa a leitura e tente reconectar. Definir essa variável não tem efeito imediato. O estado da variável se aplica a todos os comandos subsequentes `START REPLICA`.

  O valor padrão é de 60 segundos (um minuto). O primeiro recomeço ocorre imediatamente após o tempo limite. O intervalo entre os recomeços é controlado pela opção `SOURCE_CONNECT_RETRY` para a instrução `CHANGE REPLICATION SOURCE TO`, e o número de tentativas de reconexão é limitado pela opção `SOURCE_RETRY_COUNT`.

  O intervalo do batimento cardíaco, que interrompe o tempo de espera da conexão se a conexão ainda estiver boa na ausência de dados, é controlado pela opção `SOURCE_HEARTBEAT_PERIOD` para a instrução `CHANGE REPLICATION SOURCE TO`. O intervalo do batimento cardíaco tem como padrão metade do valor de `replica_net_timeout`, e é registrado no repositório de metadados de conexão da replica e exibido na tabela do Schema de Desempenho `replication_connection_configuration`. Observe que uma alteração no valor ou configuração padrão de `replica_net_timeout` não altera automaticamente o intervalo do batimento cardíaco, seja ele definido explicitamente ou esteja usando um padrão calculado anteriormente. Se o tempo de espera da conexão for alterado, você também deve emitir `CHANGE REPLICATION SOURCE TO` para ajustar o intervalo do batimento cardíaco para um valor apropriado, para que ele ocorra antes do tempo de espera da conexão.

- `replica_parallel_type`

  <table summary="Propriedades para relay_log_space_limit"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--relay-log-space-limit=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>relay_log_space_limit</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>18446744073709551615</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></tbody></table>0

  A partir do MySQL 8.0.26, use `replica_parallel_type` no lugar de `slave_parallel_type`, que foi descontinuado a partir dessa versão. Em versões anteriores ao MySQL 8.0.26, use `slave_parallel_type`.

  Para réplicas multithreads (réplicas nas quais `replica_parallel_workers` ou `slave_parallel_workers` está definido para um valor maior que 0), `replica_parallel_type` especifica a política usada para decidir quais transações são permitidas para serem executadas em paralelo na réplica. A variável não tem efeito em réplicas para as quais o multithreading não está habilitado. Os valores possíveis são:

  - `LOGICAL_CLOCK`: As transações são aplicadas em paralelo na replica, com base em timestamps que a fonte de replicação escreve no log binário. As dependências entre as transações são rastreadas com base em seus timestamps para fornecer uma adicionalização paralela, quando possível.

  - `DATABASE`: As transações que atualizam diferentes bancos de dados são aplicadas em paralelo. Esse valor é apropriado apenas se os dados estiverem particionados em múltiplos bancos de dados que estão sendo atualizados de forma independente e simultânea na fonte. Não deve haver restrições entre bancos de dados, pois tais restrições podem ser violadas na replica.

  Quando `replica_preserve_commit_order` ou `slave_preserve_commit_order` está habilitado, você deve usar `LOGICAL_CLOCK`. Antes do MySQL 8.0.27, `DATABASE` é o padrão. A partir do MySQL 8.0.27, o multithreading é habilitado por padrão para servidores replicados (`replica_parallel_workers=4` por padrão) e `LOGICAL_CLOCK` é o padrão. (No MySQL 8.0.27 e versões posteriores, `replica_preserve_commit_order` também está habilitado por padrão.)

  Quando a topologia de replicação usa múltiplos níveis de réplicas, `LOGICAL_CLOCK` pode alcançar menos paralelização para cada nível em que a réplica está distante da fonte. Para compensar esse efeito, você deve definir `binlog_transaction_dependency_tracking` para `WRITESET` ou `WRITESET_SESSION` na fonte *bem como em cada réplica intermediária* para especificar que conjuntos de escrita são usados em vez de timestamps para paralelização sempre que possível.

  Quando a compressão de transações de log binário é habilitada usando a variável de sistema `binlog_transaction_compression`, se `replica_parallel_type` for definido como `DATABASE`, todas as bases de dados afetadas pela transação são mapeadas antes que a transação seja agendada. O uso da compressão de transações de log binário com a política `DATABASE` pode reduzir o paralelismo em comparação com transações não compactadas, que são mapeadas e agendadas para cada evento.

  `replica_parallel_type` está desatualizado a partir do MySQL 8.0.29, assim como o suporte para a paralelização de transações usando a partição do banco de dados. Espera-se que o suporte para esses recursos seja removido em uma futura versão e que `LOGICAL_CLOCK` seja usado exclusivamente a partir daí.

- `replica_parallel_workers`

  <table summary="Propriedades para relay_log_space_limit"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--relay-log-space-limit=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>relay_log_space_limit</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>18446744073709551615</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></tbody></table>1

  A partir do MySQL 8.0.26, `slave_parallel_workers` é descontinuado e você deve usar `replica_parallel_workers` em vez disso. (Antes do MySQL 8.0.26, você deve usar `slave_parallel_workers` para definir o número de threads do aplicável.)

  `replica_parallel_workers` habilita o multithreading na replica e define o número de threads do aplicável para executar transações de replicação em paralelo. Quando o valor é maior ou igual a 1, a replica usa o número especificado de threads de trabalhador para executar transações, mais um thread de coordenador que lê as transações do log de retransmissão e agrupa-as para os trabalhadores. Quando o valor é 0, há apenas um thread que lê e aplica as transações sequencialmente. Se você estiver usando vários canais de replicação, o valor desta variável se aplica aos threads usados por cada canal.

  Antes do MySQL 8.0.27, o valor padrão dessa variável do sistema é 0, então as réplicas usam um único fio de trabalho por padrão. A partir do MySQL 8.0.27, o valor padrão é 4, o que significa que as réplicas são multitramadas por padrão.

  A partir do MySQL 8.0.30, definir essa variável para 0 é desaconselhável, gera uma mensagem de aviso e está sujeito à remoção em uma futura versão do MySQL. Para um único trabalhador, defina `replica_parallel_workers` para 1.

  Quando `replica_preserve_commit_order` (ou `slave_preserve_commit_order`) é definido como `ON` (o padrão no MySQL 8.0.27 e versões posteriores), as transações em uma replica são externalizadas na replica na mesma ordem em que aparecem no log de retransmissão da replica. A forma como as transações são distribuídas entre os threads do aplicável é determinada por `replica_parallel_type` (MySQL 8.0.26 e versões posteriores) ou `slave_parallel_type` (antes do MySQL 8.0.26). A partir do MySQL 8.0.27, essas variáveis de sistema também têm valores padrão apropriados para multithreading.

  Para desabilitar a execução paralela, defina `replica_parallel_workers` para 1, caso contrário, a replica usa uma thread de coordenador que lê as transações e uma thread de trabalhador que as aplica, o que significa que as transações são aplicadas sequencialmente. Quando `replica_parallel_workers` é igual a 1, as variáveis de sistema `replica_parallel_type` (`slave_parallel_type`) e `replica_preserve_commit_order` (`slave_preserve_commit_order`) não têm efeito e são ignoradas. Se `replica_parallel_workers` for igual a 0 enquanto a opção `CHANGE REPLICATION SOURCE TO` `GTID_ONLY` estiver habilitada, a replica tem uma thread de coordenador e uma thread de trabalhador, exatamente como se `replica_parallel_workers` tivesse sido definido para 1. (`GTID_ONLY` está disponível no MySQL 8.0.27 e versões posteriores.) Com um trabalhador paralelo, a variável de sistema `replica_preserve_commit_order` (`slave_preserve_commit_order`) também não tem efeito.

  A definição de `replica_parallel_workers` não tem efeito imediato, mas se aplica a todas as declarações subsequentes de `START REPLICA`.

  As réplicas multitelares são suportadas pelo NDB Cluster a partir do NDB 8.0.33. (Anteriormente, o `NDB` ignorava silenciosamente qualquer configuração para o `replica_parallel_workers`.) Consulte a Seção 25.7.11, “Replicação do NDB Cluster Usando o Aplicador Multitelares”, para obter mais informações.

  Aumentar o número de trabalhadores melhora o potencial de paralelismo. Normalmente, isso melhora o desempenho até um certo ponto, além do qual o aumento do número de trabalhadores reduz o desempenho devido a efeitos de concorrência, como a disputa por recursos de bloqueio. O número ideal depende tanto do hardware quanto da carga de trabalho; pode ser difícil prever e, geralmente, precisa ser encontrado por meio de testes. Tabelas sem chaves primárias, que sempre prejudicam o desempenho, podem ter um impacto negativo ainda maior no desempenho das réplicas que têm `replica_parallel_workers` > 1; portanto, certifique-se de que todas as tabelas tenham chaves primárias antes de habilitar essa opção.

- `replica_pending_jobs_size_max`

  <table summary="Propriedades para relay_log_space_limit"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--relay-log-space-limit=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>relay_log_space_limit</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>18446744073709551615</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></tbody></table>2

  A partir do MySQL 8.0.26, use `replica_pending_jobs_size_max` no lugar de `slave_pending_jobs_size_max`, que foi descontinuado a partir dessa versão. Em versões anteriores ao MySQL 8.0.26, use `slave_pending_jobs_size_max`.

  Para réplicas multithreads, essa variável define a quantidade máxima de memória (em bytes) disponível para as filas de aplicador que estão armazenando eventos ainda não aplicados. Definir essa variável não tem efeito em réplicas para as quais o multithreading não está habilitado. Definir essa variável não tem efeito imediato. O estado da variável se aplica a todas as instruções subsequentes `START REPLICA`.

  O valor mínimo possível para essa variável é de 1024 bytes; o padrão é de 128 MB. O valor máximo possível é de 18.446.744.073.709.551.615 (16 exbibytes). Os valores que não são múltiplos exatos de 1024 bytes são arredondados para o próximo múltiplo inferior de 1024 bytes antes de serem armazenados.

  O valor desta variável é um limite flexível e pode ser ajustado para corresponder à carga de trabalho normal. Se um evento excepcionalmente grande exceder esse tamanho, a transação é suspensa até que todas as threads do trabalhador tenham filas vazias e, em seguida, processada. Todas as transações subsequentes são suspensas até que a grande transação seja concluída.

- `replica_preserve_commit_order`

  <table summary="Propriedades para relay_log_space_limit"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--relay-log-space-limit=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>relay_log_space_limit</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>18446744073709551615</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></tbody></table>3

  A partir do MySQL 8.0.26, use `replica_preserve_commit_order` no lugar de `slave_preserve_commit_order`, que foi descontinuado a partir dessa versão. Em versões anteriores ao MySQL 8.0.26, use `slave_preserve_commit_order`.

  Para réplicas multithreads (réplicas nas quais `replica_parallel_workers` está definido para um valor maior que 0), definir `replica_preserve_commit_order=ON` garante que as transações sejam executadas e confirmadas na replica na mesma ordem em que aparecem no log de retransmissão da replica. Isso previne lacunas na sequência de transações que foram executadas no log de retransmissão da replica e preserva o mesmo histórico de transações na replica como na fonte (com as limitações listadas abaixo). Esta variável não tem efeito em réplicas para as quais o multithreading não está habilitado.

  Antes do MySQL 8.0.27, o valor padrão para essa variável do sistema é `OFF`, o que significa que as transações podem ser confirmadas fora da ordem. A partir do MySQL 8.0.27, o multithreading é ativado por padrão para os servidores replicados (`replica_parallel_workers=4` por padrão), então `replica_preserve_commit_order=ON` é o padrão, e o ajuste `replica_parallel_type=LOGICAL_CLOCK` também é o padrão. Além disso, a partir do MySQL 8.0.27, o ajuste para `replica_preserve_commit_order` é ignorado se `replica_parallel_workers` for definido como 1, porque, nessa situação, a ordem das transações é preservada de qualquer forma.

  O registro binário e o registro de atualização de replica não são necessários na replica para definir `replica_preserve_commit_order=ON`, e podem ser desativados se desejado. Definir `replica_preserve_commit_order=ON` exige que `replica_parallel_type` seja definido como `LOGICAL_CLOCK`, o que *não* é a configuração padrão antes do MySQL 8.0.27. Antes de alterar o valor de `replica_preserve_commit_order` ou `replica_parallel_type`, o fio do aplicável de replicação (para todos os canais de replicação se você estiver usando vários canais de replicação) deve ser parado.

  Quando `replica_preserve_commit_order=OFF` está definido, as transações que uma replica multithreading aplica em paralelo podem ser confirmadas fora de ordem. Portanto, verificar a transação executada mais recentemente não garante que todas as transações anteriores da fonte tenham sido executadas na replica. Há uma chance de lacunas na sequência das transações executadas a partir do log de retransmissão da replica. Isso tem implicações para o registro e a recuperação ao usar uma replica multithreading. Consulte a Seção 19.5.1.34, “Inconsistências de Replicação e Transações”, para obter mais informações.

  Quando `replica_preserve_commit_order=ON` está definido, o thread de trabalhador em execução aguarda até que todas as transações anteriores sejam confirmadas antes de confirmar. Enquanto um determinado thread está aguardando que outros threads de trabalhador confirmem suas transações, ele reporta seu status como `Waiting for preceding transaction to commit`. Com esse modo, uma replica multithread nunca entra em um estado que a fonte não estivesse. Isso suporta o uso da replicação para escala de leitura. Veja a Seção 19.4.5, “Usando a Replicação para Escala de Leitura”.

  Nota

  - `replica_preserve_commit_order=ON` não impede a diferença de posição do log binário de origem, onde `Exec_master_log_pos` está atrás da posição até a qual as transações foram executadas. Veja a Seção 19.5.1.34, “Replicação e Inconsistências de Transações”.

  - `replica_preserve_commit_order=ON` não preserva a ordem de commit e o histórico de transações se a replica usar filtros em seu log binário, como `--binlog-do-db`.

  - `replica_preserve_commit_order=ON` não preserva a ordem das atualizações DML não transacionais. Essas atualizações podem ser confirmadas antes das transações que as precedem no log de retransmissão, o que pode resultar em lacunas na sequência das transações executadas a partir do log de retransmissão da replica.

  - Uma limitação para preservar a ordem de commit na replica pode ocorrer se a replicação baseada em declarações estiver em uso e os motores de armazenamento transacional e não transacional participarem de uma transação não-XA que seja revertida na origem. Normalmente, as transações não-XA que são revertidas na origem não são replicadas para a replica, mas, nesta situação específica, a transação pode ser replicada para a replica. Se isso acontecer, uma replica multisserial sem registro binário não gerencia o rollback da transação, portanto, a ordem de commit na replica diverge da ordem do log de retransmissão das transações nesse caso.

  - *Replicação em grupo — MySQL 9.2.0 e versões posteriores*: Quando um primário de grupo está recebendo e aplicando transações de uma fonte externa por meio de um canal assíncrono e um novo membro se junta ao grupo, `replica_preserve_commit_order=ON` não garante que o pedido de commit de transações não conflitantes seja respeitado. Por isso, pode haver estados temporários no secundário que nunca existiram na fonte; como isso ocorre apenas em relação a transações não conflitantes, não há divergência real.

- `replica_sql_verify_checksum`

  <table summary="Propriedades para relay_log_space_limit"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--relay-log-space-limit=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>relay_log_space_limit</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>18446744073709551615</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></tbody></table>4

  A partir do MySQL 8.0.26, use `replica_sql_verify_checksum` no lugar de `slave_sql_verify_checksum`, que foi descontinuado a partir dessa versão. Em versões anteriores ao MySQL 8.0.26, use `slave_sql_verify_checksum`.

  `slave_sql_verify_checksum` faz com que o fio de replicação SQL (aplicador) verifique os dados usando os checksums lidos do log de retransmissão. Em caso de discrepância, a replica pára com um erro. A definição desta variável entra em vigor imediatamente para todos os canais de replicação, incluindo os canais em execução.

  Nota

  O fio de I/O de replicação (receptor) sempre lê os checksums, se possível, ao aceitar eventos da rede.

- `replica_transaction_retries`

  <table summary="Propriedades para relay_log_space_limit"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--relay-log-space-limit=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>relay_log_space_limit</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>18446744073709551615</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></tbody></table>5

  A partir do MySQL 8.0.26, use `replica_transaction_retries` no lugar de `slave_transaction_retries`, que foi descontinuado a partir dessa versão. Em versões anteriores ao MySQL 8.0.26, use `slave_transaction_retries`.

  `replica_transaction_retries` define o número máximo de vezes para a replicação de threads SQL em uma replica monofilamentar ou multifilamentar para tentar novamente automaticamente as transações falhas antes de parar. A definição desta variável tem efeito imediatamente em todos os canais de replicação, incluindo os canais em execução. O valor padrão é 10. Definir a variável para 0 desabilita o reprocessamento automático de transações.

  Se um fio de SQL de replicação não conseguir executar uma transação devido a um `InnoDB` deadlock ou porque o tempo de execução da transação excedeu o `InnoDB` de `innodb_lock_wait_timeout` ou o `NDB` de `TransactionDeadlockDetectionTimeout` ou o `TransactionInactiveTimeout`, ele tentará novamente `replica_transaction_retries` vezes antes de parar com um erro. As transações com um erro não temporário não são reatadas.

  A tabela do Schema de Desempenho `replication_applier_status` mostra o número de tentativas de recuperação que ocorreram em cada canal de replicação, na coluna `COUNT_TRANSACTIONS_RETRIES`. A tabela do Schema de Desempenho `replication_applier_status_by_worker` mostra informações detalhadas sobre as tentativas de recuperação de transações por threads individuais de aplicável em uma replica de um único ou múltiplos threads, e identifica os erros que causaram a última transação e a transação atualmente em andamento serem reatentadas.

- `replica_type_conversions`

  <table summary="Propriedades para relay_log_space_limit"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--relay-log-space-limit=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>relay_log_space_limit</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>18446744073709551615</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></tbody></table>6

  A partir do MySQL 8.0.26, use `replica_type_conversions` no lugar de `slave_type_conversions`, que foi descontinuado a partir dessa versão. Em versões anteriores ao MySQL 8.0.26, use `slave_type_conversions`.

  `replica_type_conversions` controla o modo de conversão de tipo em vigor na replica quando se usa a replicação baseada em linhas. Seu valor é um conjunto separado por vírgula de zero ou mais elementos da lista: `ALL_LOSSY`, `ALL_NON_LOSSY`, `ALL_SIGNED`, `ALL_UNSIGNED`. Defina essa variável como uma string vazia para impedir conversões de tipo entre a fonte e a replica. A definição dessa variável entra em vigor imediatamente para todos os canais de replicação, incluindo os canais em execução.

  Para obter informações adicionais sobre os modos de conversão de tipo aplicáveis à promoção e à redução de atributos na replicação baseada em linhas, consulte Replicação baseada em linhas: promoção e redução de atributos.

- `replication_optimize_for_static_plugin_config`

  <table summary="Propriedades para relay_log_space_limit"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--relay-log-space-limit=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>relay_log_space_limit</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>18446744073709551615</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></tbody></table>7

  Use bloqueios compartilhados e evite aquisições desnecessárias de bloqueios para melhorar o desempenho da replicação semiesincronizada. Esta configuração e o `replication_sender_observe_commit_only` ajudam quando o número de réplicas aumenta, pois a disputa por bloqueios pode prejudicar o desempenho. Enquanto essa variável de sistema estiver habilitada, o plugin de replicação semiesincronizada não pode ser desinstalado, então você deve desabilitar a variável de sistema antes que a desinstalação possa ser concluída.

  Essa variável de sistema pode ser habilitada antes ou depois de instalar o plugin de replicação semiesincronizada e pode ser habilitada enquanto a replicação estiver em execução. Os servidores de origem da replicação semiesincronizada também podem obter benefícios de desempenho ao habilitar essa variável de sistema, pois usam os mesmos mecanismos de bloqueio que as réplicas.

  O `replication_optimize_for_static_plugin_config` pode ser habilitado quando a Replicação em Grupo estiver em uso em um servidor. Nesse cenário, ele pode beneficiar o desempenho quando há disputa por bloqueios devido a cargas de trabalho elevadas.

- `replication_sender_observe_commit_only`

  <table summary="Propriedades para relay_log_space_limit"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--relay-log-space-limit=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>relay_log_space_limit</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>18446744073709551615</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></tbody></table>8

  Limite os callbacks para melhorar o desempenho da replicação semiesincronizada. Esta configuração e `replication_optimize_for_static_plugin_config` são úteis à medida que o número de réplicas aumenta, pois a disputa por bloqueios pode prejudicar o desempenho.

  Essa variável de sistema pode ser habilitada antes ou depois de instalar o plugin de replicação semiesincronizada e pode ser habilitada enquanto a replicação estiver em execução. Os servidores de origem da replicação semiesincronizada também podem obter benefícios de desempenho ao habilitar essa variável de sistema, pois usam os mesmos mecanismos de bloqueio que as réplicas.

- `report_host`

  <table summary="Propriedades para relay_log_space_limit"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--relay-log-space-limit=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>relay_log_space_limit</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>18446744073709551615</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></tbody></table>9

  O nome do host ou o endereço IP da réplica que será relatado à fonte durante o registro da réplica. Esse valor aparece na saída do `SHOW REPLICAS` no servidor da fonte. Deixe o valor em branco se você não quiser que a réplica se registre com a fonte.

  Nota

  Não é suficiente que a fonte simplesmente leia o endereço IP do servidor replicado a partir da porta TCP/IP após a replica se conectar. Devido à NAT e outros problemas de roteamento, esse IP pode não ser válido para se conectar à replica a partir da fonte ou de outros hosts.

- `report_password`

  <table summary="Propriedades para replicate-do-db"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--replicate-do-db=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>0

  A senha da conta da réplica que será reportada para a fonte durante o registro da réplica. Esse valor aparece na saída do `SHOW REPLICAS` no servidor da fonte se a fonte foi iniciada com `--show-replica-auth-info` ou `--show-slave-auth-info`.

  Embora o nome dessa variável possa sugerir o contrário, `report_password` não está conectado ao sistema de privilégios do usuário do MySQL e, portanto, não é necessariamente (ou até mesmo provável que seja) a mesma senha da conta de usuário de replicação do MySQL.

- `report_port`

  <table summary="Propriedades para replicate-do-db"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--replicate-do-db=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>1

  O número da porta TCP/IP para a conexão com a réplica, que deve ser informado à fonte durante o registro da réplica. Defina apenas se a réplica estiver ouvindo em uma porta não padrão ou se você tiver um túnel especial da fonte ou de outros clientes para a réplica. Se você não tiver certeza, não use essa opção.

  O valor padrão para esta opção é o número de porta realmente usado pela réplica. Este é também o valor padrão exibido pelo `SHOW REPLICAS`.

- `report_user`

  <table summary="Propriedades para replicate-do-db"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--replicate-do-db=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>2

  O nome de usuário da conta da réplica que será relatado à fonte durante o registro da réplica. Esse valor aparece na saída do `SHOW REPLICAS` no servidor da fonte se a fonte foi iniciada com `--show-replica-auth-info` ou `--show-slave-auth-info`.

  Embora o nome desta variável possa sugerir o contrário, `report_user` não está conectado ao sistema de privilégios do usuário do MySQL e, portanto, não é necessariamente (ou até mesmo provável que seja) o mesmo nome da conta de usuário de replicação do MySQL.

- `rpl_read_size`

  <table summary="Propriedades para replicate-do-db"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--replicate-do-db=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>3

  A variável de sistema `rpl_read_size` controla a quantidade mínima de dados em bytes que são lidos dos arquivos de log binários e dos arquivos de log de retransmissão. Se a atividade de E/S de disco intensa para esses arquivos estiver impedindo o desempenho do banco de dados, aumentar o tamanho da leitura pode reduzir as leituras de arquivos e as paradas de E/S quando os dados do arquivo não estiverem atualmente cacheados pelo sistema operacional.

  O valor mínimo e padrão para `rpl_read_size` é de 8192 bytes. O valor deve ser um múltiplo de 4KB. Observe que um buffer do tamanho desse valor é alocado para cada thread que lê os arquivos de log binário e log de retransmissão, incluindo threads de dump em fontes e threads de coordenador em réplicas. Definir um valor grande pode, portanto, afetar o consumo de memória dos servidores.

- `rpl_semi_sync_replica_enabled`

  <table summary="Propriedades para replicate-do-db"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--replicate-do-db=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>4

  `rpl_semi_sync_replica_enabled` está disponível quando o plugin `rpl_semi_sync_replica` (biblioteca `semisync_replica.so`) foi instalado na réplica para configurar a replicação semiesincronizada. Se o plugin `rpl_semi_sync_slave` (biblioteca `semisync_slave.so`) foi instalado, `rpl_semi_sync_slave_enabled` está disponível.

  `rpl_semi_sync_replica_enabled` controla se a replicação semiesincronizada está habilitada no servidor de replicação. Para habilitar ou desabilitar o plugin, defina essa variável para `ON` ou `OFF` (ou 1 ou 0), respectivamente. O padrão é `OFF`.

  Esta variável está disponível apenas se o plugin de replicação semi-sincronizada do lado da replica estiver instalado.

- `rpl_semi_sync_replica_trace_level`

  <table summary="Propriedades para replicate-do-db"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--replicate-do-db=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>5

  `rpl_semi_sync_replica_trace_level` está disponível quando o plugin `rpl_semi_sync_replica` (biblioteca `semisync_replica.so`) foi instalado na réplica para configurar a replicação semiesincronizada. Se o plugin `rpl_semi_sync_slave` (biblioteca `semisync_slave.so`) foi instalado, `rpl_semi_sync_slave_trace_level` está disponível.

  `rpl_semi_sync_replica_trace_level` controla o nível de rastreamento de depuração da replicação semisoincronizada no servidor replica. Consulte `rpl_semi_sync_master_trace_level` para os valores permitidos.

  Esta variável está disponível apenas se o plugin de replicação semi-sincronizada do lado da replica estiver instalado.

- `rpl_semi_sync_slave_enabled`

  <table summary="Propriedades para replicate-do-db"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--replicate-do-db=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>6

  `rpl_semi_sync_slave_enabled` está disponível quando o plugin `rpl_semi_sync_slave` (biblioteca `semisync_slave.so`) foi instalado na réplica para configurar a replicação semiesincronizada. Se o plugin `rpl_semi_sync_replica` (biblioteca `semisync_replica.so`) foi instalado, `rpl_semi_sync_replica_enabled` está disponível.

  `rpl_semi_sync_slave_enabled` controla se a replicação semiesincronizada está habilitada no servidor de replicação. Para habilitar ou desabilitar o plugin, defina essa variável para `ON` ou `OFF` (ou 1 ou 0), respectivamente. O padrão é `OFF`.

  Esta variável está disponível apenas se o plugin de replicação semi-sincronizada do lado da replica estiver instalado.

- `rpl_semi_sync_slave_trace_level`

  <table summary="Propriedades para replicate-do-db"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--replicate-do-db=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>7

  `rpl_semi_sync_slave_trace_level` está disponível quando o plugin `rpl_semi_sync_slave` (biblioteca `semisync_slave.so`) foi instalado na réplica para configurar a replicação semiesincronizada. Se o plugin `rpl_semi_sync_replica` (biblioteca `semisync_replica.so`) foi instalado, `rpl_semi_sync_replica_trace_level` está disponível.

  `rpl_semi_sync_slave_trace_level` controla o nível de rastreamento de depuração da replicação semisoincronizada no servidor replica. Consulte `rpl_semi_sync_master_trace_level` para os valores permitidos.

  Esta variável está disponível apenas se o plugin de replicação semi-sincronizada do lado da replica estiver instalado.

- `rpl_stop_replica_timeout`

  <table summary="Propriedades para replicate-do-db"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--replicate-do-db=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>8

  A partir do MySQL 8.0.26, use `rpl_stop_replica_timeout` no lugar de `rpl_stop_slave_timeout`, que foi descontinuado a partir dessa versão. Em versões anteriores ao MySQL 8.0.26, use `rpl_stop_slave_timeout`.

  Você pode controlar o tempo (em segundos) que o `STOP REPLICA` espera antes de expirar, definindo essa variável. Isso pode ser usado para evitar deadlocks entre o `STOP REPLICA` e outros comandos SQL que utilizam diferentes conexões de cliente para a replica.

  O valor máximo e o valor padrão de `rpl_stop_replica_timeout` é de 31536000 segundos (1 ano). O valor mínimo é de 2 segundos. As alterações nesta variável entram em vigor nas declarações subsequentes de `STOP REPLICA`.

  Essa variável afeta apenas o cliente que emite uma declaração `STOP REPLICA`. Quando o tempo limite é alcançado, o cliente emissor retorna uma mensagem de erro indicando que a execução do comando está incompleta. O cliente então para de esperar que os threads de I/O de replicação (receptor) e SQL (aplicador) parem, mas os threads de replicação continuam tentando parar, e a declaração `STOP REPLICA` permanece em vigor. Uma vez que os threads de replicação deixam de estar ocupados, a declaração `STOP REPLICA` é executada e a replicação para.

- `rpl_stop_slave_timeout`

  <table summary="Propriedades para replicate-do-db"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--replicate-do-db=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>9

  A partir do MySQL 8.0.26, `rpl_stop_slave_timeout` é descontinuado e o alias `rpl_stop_replica_timeout` deve ser usado em vez disso. Em versões anteriores ao MySQL 8.0.26, use `rpl_stop_slave_timeout`.

  Você pode controlar o tempo (em segundos) que o `STOP REPLICA` espera antes de expirar, definindo essa variável. Isso pode ser usado para evitar deadlocks entre o `STOP REPLICA` e outros comandos SQL que utilizam diferentes conexões de cliente para a replica.

  O valor máximo e o valor padrão de `rpl_stop_slave_timeout` é de 31536000 segundos (1 ano). O valor mínimo é de 2 segundos. As alterações nesta variável entram em vigor nas declarações subsequentes de `STOP REPLICA`.

  Essa variável afeta apenas o cliente que emite uma declaração `STOP REPLICA`. Quando o tempo limite é alcançado, o cliente emissor retorna uma mensagem de erro indicando que a execução do comando está incompleta. O cliente então para de esperar que os threads de I/O de replicação (receptor) e SQL (aplicador) parem, mas os threads de replicação continuam tentando parar, e a instrução `STOP REPLICA` permanece em vigor. Uma vez que os threads de replicação deixam de estar ocupados, a declaração `STOP REPLICA` é executada e a replicação para.

- `skip_replica_start`

  <table summary="Propriedades para replicar-ignorar-db"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--replicate-ignore-db=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>0

  A partir do MySQL 8.0.26, use `skip_replica_start` no lugar de `skip_slave_start`, que foi descontinuado a partir dessa versão. Em versões anteriores ao MySQL 8.0.26, use `skip_slave_start`.

  `skip_replica_start` informa ao servidor de replicação que não deve iniciar as threads de I/O de replicação (receptor) e SQL (aplicador) quando o servidor for iniciado. Para iniciar as threads mais tarde, use uma instrução `START REPLICA`.

  Esta variável de sistema é de leitura somente e pode ser definida usando a palavra-chave `PERSIST_ONLY` ou o qualificador `@@persist_only` com a instrução `SET`. A opção de linha de comando `--skip-replica-start` também define essa variável de sistema. Você pode usar a variável de sistema no lugar da opção de linha de comando para permitir o acesso a essa funcionalidade usando a estrutura de privilégio do MySQL Server, para que os administradores de banco de dados não precisem de acesso privilegiado ao sistema operacional.

- `skip_slave_start`

  <table summary="Propriedades para replicar-ignorar-db"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--replicate-ignore-db=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>1

  A partir do MySQL 8.0.26, `skip_slave_start` é descontinuado e o alias `skip_replica_start` deve ser usado em vez disso. Em versões anteriores ao MySQL 8.0.26, use `skip_slave_start`.

  Diga ao servidor de replicação que não inicie as threads de I/O de replicação (receptor) e SQL (aplicador) quando o servidor for iniciado. Para iniciar as threads mais tarde, use uma instrução `START REPLICA`.

  Esta variável de sistema está disponível a partir do MySQL 8.0.24. É de leitura somente e pode ser definida usando a palavra-chave `PERSIST_ONLY` ou o qualificador `@@persist_only` com a instrução `SET`. A opção de linha de comando `--skip-slave-start` também define esta variável de sistema. Você pode usar a variável de sistema em vez da opção de linha de comando para permitir o acesso a este recurso usando a estrutura de privilégios do MySQL Server, para que os administradores de banco de dados não precisem de qualquer acesso privilegiado ao sistema operacional.

- `slave_checkpoint_group`

  <table summary="Propriedades para replicar-ignorar-db"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--replicate-ignore-db=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>2

  A partir do MySQL 8.0.26, `slave_checkpoint_group` é descontinuado e o alias `replica_checkpoint_group` deve ser usado em vez disso. Em versões anteriores ao MySQL 8.0.26, use `slave_checkpoint_group`.

  `slave_checkpoint_group` define o número máximo de transações que podem ser processadas por uma replica multithreading antes que uma operação de verificação de ponto seja chamada para atualizar seu status, conforme mostrado por `SHOW REPLICA STATUS`. Definir essa variável não tem efeito em réplicas para as quais a multithreading não está habilitada. Definir essa variável não tem efeito imediato. O estado da variável se aplica a todas as instruções subsequentes de `START REPLICA`.

  Anteriormente, as réplicas multithreads não eram suportadas pelo NDB Cluster, o que ignorava silenciosamente a configuração dessa variável. Essa restrição foi removida no MySQL 8.0.33.

  Essa variável funciona em combinação com a variável de sistema `slave_checkpoint_period` de tal forma que, quando qualquer um dos limites é ultrapassado, o ponto de verificação é executado e os contadores que rastreiam tanto o número de transações quanto o tempo decorrido desde o último ponto de verificação são reiniciados.

  O valor mínimo permitido para essa variável é 32, a menos que o servidor tenha sido construído usando `-DWITH_DEBUG`, nesse caso, o valor mínimo é 1. O valor efetivo é sempre um múltiplo de 8; você pode defini-lo para um valor que não seja um múltiplo desse, mas o servidor arredonda para o próximo múltiplo inferior de 8 antes de armazenar o valor. (*Exceção*: Nenhuma tal arredondamento é realizado pelo servidor de depuração.) Independentemente de como o servidor foi construído, o valor padrão é 512 e o valor máximo permitido é 524280.

- `slave_checkpoint_period`

  <table summary="Propriedades para replicar-ignorar-db"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--replicate-ignore-db=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>3

  A partir do MySQL 8.0.26, `slave_checkpoint_period` está desatualizado e deve ser substituído por `replica_checkpoint_period`. Antes do MySQL 8.0.26, use `slave_checkpoint_period`.

  `slave_checkpoint_period` define o tempo máximo (em milissegundos) que pode passar antes que uma operação de ponto de verificação seja chamada para atualizar o status de uma replica multithreading, conforme mostrado por `SHOW REPLICA STATUS`. Definir essa variável não tem efeito em réplicas para as quais a multithreading não está habilitada. Definir essa variável entra em vigor imediatamente para todos os canais de replicação, incluindo canais em execução.

  Anteriormente, as réplicas multithreads não eram suportadas pelo NDB Cluster, o que ignorava silenciosamente a configuração dessa variável. Essa restrição foi removida no MySQL 8.0.33.

  Essa variável funciona em combinação com a variável de sistema `slave_checkpoint_group` de tal forma que, quando qualquer um dos limites é ultrapassado, o ponto de verificação é executado e os contadores que rastreiam tanto o número de transações quanto o tempo decorrido desde o último ponto de verificação são reiniciados.

  O valor mínimo permitido para essa variável é 1, a menos que o servidor tenha sido construído usando `-DWITH_DEBUG`, caso em que o valor mínimo é 0. Independentemente de como o servidor foi construído, o valor padrão é de 300 milissegundos e o valor máximo possível é de 4294967295 milissegundos (aproximadamente 49,7 dias).

- `slave_compressed_protocol`

  <table summary="Propriedades para replicar-ignorar-db"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--replicate-ignore-db=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>4

  `slave_compressed_protocol` está desatualizado e, a partir do MySQL 8.0.26, o alias `replica_compressed_protocol` deve ser usado em vez disso. Em versões anteriores ao MySQL 8.0.26, use `slave_compressed_protocol`.

  `slave_compressed_protocol` controla se a compressão do protocolo de conexão de origem/replica deve ser usada, se tanto a origem quanto a replica o suportam. Se essa variável estiver desabilitada (o padrão), as conexões não serão comprimidas. As alterações nessa variável entram em vigor nas tentativas de conexão subsequentes; isso inclui após a emissão de uma declaração `START REPLICA`, bem como as reconexões feitas por uma thread de I/O de replicação em execução (receptor).

  A compressão de transações de log binário (disponível a partir do MySQL 8.0.20), que é ativada pela variável de sistema `binlog_transaction_compression`, também pode ser usada para economizar largura de banda. Se você usar a compressão de transações de log binário em combinação com a compressão de protocolo, a compressão de protocolo terá menos oportunidades de agir nos dados, mas ainda poderá comprimir cabeçalhos e aqueles eventos e cargas de trabalho de transações que não estiverem compactados. Para obter mais informações sobre a compressão de transações de log binário, consulte a Seção 7.4.4.5, “Compressão de Transações de Log Binário”.

  A partir do MySQL 8.0.18, se o `slave_compressed_protocol` estiver habilitado, ele terá precedência sobre qualquer opção `SOURCE_COMPRESSION_ALGORITHMS` | `MASTER_COMPRESSION_ALGORITHMS` especificada para a instrução `CHANGE REPLICATION SOURCE TO` | `CHANGE MASTER TO`. Nesse caso, as conexões à fonte usarão a compressão `zlib` se tanto a fonte quanto a replica suportem esse algoritmo. Se o `slave_compressed_protocol` estiver desativado, o valor de `SOURCE_COMPRESSION_ALGORITHMS` | `MASTER_COMPRESSION_ALGORITHMS` será aplicado. Para mais informações, consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.

  A partir do MySQL 8.0.18, essa variável de sistema está desatualizada. Você deve esperar que ela seja removida em uma versão futura do MySQL. Consulte Configurando a Compressão de Conexão Legado.

- `slave_exec_mode`

  <table summary="Propriedades para replicar-ignorar-db"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--replicate-ignore-db=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>5

  A partir do MySQL 8.0.26, `slave_exec_mode` é descontinuado e o alias `replica_exec_mode` deve ser usado em vez disso. Em versões anteriores ao MySQL 8.0.26, use `slave_exec_mode`.

  `slave_exec_mode` controla como um fio de replicação resolve conflitos e erros durante a replicação. O modo `IDEMPOTENT` causa a supressão de erros de chave duplicada e sem chave encontrada; `STRICT` significa que essa supressão não ocorre.

  O modo `IDEMPOTENT` é destinado ao uso na replicação de múltiplas fontes, replicação circular e outros cenários de replicação especiais para a replicação do NDB Cluster. (Consulte a Seção 25.7.10, “Replicação do NDB Cluster: Replicação Bidirecional e Circular”, e a Seção 25.7.12, “Resolução de Conflitos na Replicação do NDB Cluster”, para obter mais informações.) O NDB Cluster ignora qualquer valor explicitamente definido para `slave_exec_mode` e sempre o trata como `IDEMPOTENT`.

  No MySQL Server 8.0, o modo `STRICT` é o valor padrão.

  A definição desta variável tem efeito imediato em todos os canais de replicação, incluindo os canais em execução.

  Para motores de armazenamento que não sejam `NDB`, o modo *`IDEMPOTENT` deve ser usado apenas quando você tiver certeza absoluta de que erros de chave duplicada e erros de chave não encontrada podem ser ignorados com segurança*. Ele é destinado a ser usado em cenários de fail-over para NDB Cluster, onde a replicação de múltiplas fontes ou replicação circular é empregada, e não é recomendado para uso em outros casos.

- `slave_load_tmpdir`

  <table summary="Propriedades para replicar-ignorar-db"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--replicate-ignore-db=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>6

  A partir do MySQL 8.0.26, `slave_load_tmpdir` é descontinuado e o alias `replica_load_tmpdir` deve ser usado em vez disso. Em versões anteriores ao MySQL 8.0.26, use `slave_load_tmpdir`.

  `slave_load_tmpdir` especifica o nome do diretório onde a replica cria arquivos temporários. A definição dessa variável entra em vigor imediatamente para todos os canais de replicação, incluindo os canais em execução. O valor da variável é, por padrão, igual ao valor da variável de sistema `tmpdir`, ou ao valor padrão que se aplica quando essa variável de sistema não é especificada.

  Quando o fio de replicação do SQL replica uma instrução `LOAD DATA`, ele extrai o arquivo a ser carregado do log de retransmissão para arquivos temporários e, em seguida, carrega esses arquivos na tabela. Se o arquivo carregado na fonte for enorme, os arquivos temporários na replica também serão enormes. Portanto, pode ser aconselhável usar essa opção para dizer à replica para colocar os arquivos temporários em um diretório localizado em algum sistema de arquivos que tenha muito espaço disponível. Nesse caso, os logs de retransmissão também serão enormes, então você também pode querer definir a variável de sistema `relay_log` para colocar os logs de retransmissão nesse sistema de arquivos.

  O diretório especificado por esta opção deve estar localizado em um sistema de arquivos baseado em disco (não em um sistema de arquivos baseado em memória) para que os arquivos temporários usados para replicar as instruções `LOAD DATA` possam sobreviver a reinicializações da máquina. O diretório também não deve ser aquele que seja limpo pelo sistema operacional durante o processo de inicialização do sistema. No entanto, a replicação agora pode continuar após um reinício se os arquivos temporários tiverem sido removidos.

- `slave_max_allowed_packet`

  <table summary="Propriedades para replicar-ignorar-db"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--replicate-ignore-db=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>7

  A partir do MySQL 8.0.26, `slave_max_allowed_packet` é descontinuado e o alias `replica_max_allowed_packet` deve ser usado em vez disso. Em versões anteriores ao MySQL 8.0.26, use `slave_max_allowed_packet`.

  `slave_max_allowed_packet` define o tamanho máximo do pacote em bytes que os threads de replicação SQL (aplicador) e I/O (receptor) podem lidar. A definição desta variável entra em vigor imediatamente para todos os canais de replicação, incluindo os canais em execução. É possível que uma fonte escreva eventos de log binário maiores que a definição de `max_allowed_packet` uma vez que o cabeçalho do evento é adicionado. A definição de `slave_max_allowed_packet` deve ser maior que a definição de `max_allowed_packet` na fonte, para que grandes atualizações usando replicação baseada em linhas não causem falha na replicação.

  Essa variável global sempre tem um valor que é um múltiplo inteiro positivo de 1024; se você defini-la para um valor que não seja, o valor é arredondado para o próximo múltiplo mais alto de 1024 para ser armazenado ou usado; definir `slave_max_allowed_packet` para 0 faz com que 1024 seja usado. (Um aviso de truncação é emitido em todos esses casos.) O valor padrão e máximo é 1073741824 (1 GB); o mínimo é 1024.

- `slave_net_timeout`

  <table summary="Propriedades para replicar-ignorar-db"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--replicate-ignore-db=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>8

  A partir do MySQL 8.0.26, `slave_net_timeout` é descontinuado e o alias `replica_net_timeout` deve ser usado em vez disso. Em versões anteriores ao MySQL 8.0.26, use `slave_net_timeout`.

  `slave_net_timeout` especifica o número de segundos para esperar por mais dados ou um sinal de batida de coração da fonte antes que a replica considere a conexão quebrada, interrompa a leitura e tente reconectar. Definir essa variável não tem efeito imediato. O estado da variável se aplica a todos os comandos subsequentes `START REPLICA`.

  O valor padrão é de 60 segundos (um minuto). O primeiro recomeço ocorre imediatamente após o tempo limite. O intervalo entre os recomeços é controlado pela opção `SOURCE_CONNECT_RETRY` | `MASTER_CONNECT_RETRY` para a declaração `CHANGE REPLICATION SOURCE TO` | `CHANGE MASTER TO` e o número de tentativas de reconexão é limitado pela opção `SOURCE_RETRY_COUNT` | `MASTER_RETRY_COUNT`.

  O intervalo de batida de coração, que interrompe o tempo de espera da conexão na ausência de dados, se a conexão ainda estiver boa, é controlado pela opção `SOURCE_HEARTBEAT_PERIOD` | `MASTER_HEARTBEAT_PERIOD` para a declaração `CHANGE REPLICATION SOURCE TO` | `CHANGE MASTER TO`. O intervalo de batida de coração tem como padrão metade do valor de `slave_net_timeout`, e é registrado no repositório de metadados de conexão da replica e exibido na tabela do `replication_connection_configuration` Schema de Desempenho. Observe que uma alteração no valor ou configuração padrão de `slave_net_timeout` não altera automaticamente o intervalo de batida de coração, seja ele definido explicitamente ou esteja usando um padrão calculado anteriormente. Se o tempo de espera da conexão for alterado, você também deve emitir `CHANGE REPLICATION SOURCE TO` | `CHANGE MASTER TO` para ajustar o intervalo de batida de coração para um valor apropriado, para que ele ocorra antes do tempo de espera da conexão.

- `slave_parallel_type`

  <table summary="Propriedades para replicar-ignorar-db"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--replicate-ignore-db=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>9

  A partir do MySQL 8.0.26, `slave_parallel_type` é descontinuado e o alias `replica_parallel_type` deve ser usado em vez disso. Em versões anteriores ao MySQL 8.0.26, use `slave_parallel_type`.

  Para réplicas multithreads (réplicas nas quais `replica_parallel_workers` ou `slave_parallel_workers` está definido para um valor maior que 0), `slave_parallel_type` especifica a política usada para decidir quais transações são permitidas para serem executadas em paralelo na réplica. A variável não tem efeito em réplicas para as quais o multithreading não está habilitado. Os valores possíveis são:

  - `LOGICAL_CLOCK`: As transações que fazem parte do mesmo grupo de log binário em um ponto de origem são aplicadas em paralelo em uma replica. As dependências entre as transações são rastreadas com base em seus timestamps para fornecer uma paralelização adicional, quando possível. Quando este valor é definido, a variável de sistema `binlog_transaction_dependency_tracking` pode ser usada no ponto de origem para especificar que conjuntos de escrita são usados para a paralelização em vez de timestamps, se um conjunto de escrita estiver disponível para a transação e proporcionar resultados melhores em comparação com os timestamps.

  - `DATABASE`: As transações que atualizam diferentes bancos de dados são aplicadas em paralelo. Esse valor é apropriado apenas se os dados estiverem particionados em múltiplos bancos de dados que estão sendo atualizados de forma independente e simultânea na fonte. Não deve haver restrições entre bancos de dados, pois tais restrições podem ser violadas na replica.

  Quando `replica_preserve_commit_order=ON` ou `slave_preserve_commit_order` é `ON`, você deve usar `LOGICAL_CLOCK`. Antes do MySQL 8.0.27, `DATABASE` é o padrão. A partir do MySQL 8.0.27, o multithreading é ativado por padrão para servidores replicados (`replica_parallel_workers=4` por padrão), então `LOGICAL_CLOCK` é o padrão, e o ajuste `replica_preserve_commit_order=ON` também é o padrão.

  Todas as threads do aplicativo de replicação devem ser interrompidas antes de definir `slave_parallel_type`.

  Quando a topologia de replicação usa múltiplos níveis de réplicas, o `LOGICAL_CLOCK` pode alcançar menos paralelização para cada nível em que a réplica está distante da fonte. Você pode reduzir esse efeito usando o `binlog_transaction_dependency_tracking` na fonte para especificar que conjuntos de escrita são usados em vez de timestamps para paralelização sempre que possível.

  Quando a compressão de transações de log binário é habilitada usando a variável de sistema `binlog_transaction_compression`, se `replica_parallel_type` ou `slave_parallel_type` estiver definido como `DATABASE`, todas as bases de dados afetadas pela transação são mapejadas antes que a transação seja agendada. O uso da compressão de transações de log binário com a política `DATABASE` pode reduzir o paralelismo em comparação com transações não compactadas, que são mapeadas e agendadas para cada evento.

- `slave_parallel_workers`

  <table summary="Propriedades para replicate-do-table"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--replicate-do-table=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>0

  A partir do MySQL 8.0.26, `slave_parallel_workers` é descontinuado e o alias `replica_parallel_workers` deve ser usado em vez disso. Em versões anteriores ao MySQL 8.0.26, use `slave_parallel_workers`.

  `slave_parallel_workers` habilita o multithreading na replica e define o número de threads do aplicável para executar transações de replicação em paralelo. Quando o valor é um número maior que 0, a replica é uma replica multithreading com o número especificado de threads do aplicável, além de um thread de coordenador para gerenciá-los. Se você estiver usando vários canais de replicação, cada canal tem esse número de threads.

  Antes do MySQL 8.0.27, o valor padrão para essa variável do sistema era 0, então as réplicas não eram multithreadadas por padrão. A partir do MySQL 8.0.27, o valor padrão é 4, então as réplicas são multithreadadas por padrão.

  O reprocessamento de transações é suportado quando o multithreading está habilitado em uma replica. Quando `replica_preserve_commit_order=ON` ou `slave_preserve_commit_order=ON` está definido, as transações em uma replica são externalizadas na replica na mesma ordem em que aparecem no log de retransmissão da replica. A forma como as transações são distribuídas entre os threads do aplicável é configurada por `replica_parallel_type` (a partir do MySQL 8.0.26) ou `slave_parallel_type` (antes do MySQL 8.0.26). A partir do MySQL 8.0.27, essas variáveis de sistema também têm valores padrão apropriados para multithreading.

  Para desabilitar a execução paralela, defina `replica_parallel_workers` para 0, o que dá à replica um único fio de aplicador e nenhum fio de coordenador. Com essa configuração, as variáveis de sistema `replica_parallel_type` ou `slave_parallel_type` e `replica_preserve_commit_order` ou `slave_preserve_commit_order` não têm efeito e são ignoradas. A partir do MySQL 8.0.27, se a execução paralela for desativada quando a opção `CHANGE REPLICATION SOURCE TO` `GTID_ONLY` estiver habilitada em uma replica, a replica realmente usa um trabalhador paralelo para aproveitar o método de reexecução de transações sem acessar as posições do arquivo. Com um trabalhador paralelo, a variável de sistema `replica_preserve_commit_order` (`slave_preserve_commit_order`) também não tem efeito.

  A definição de `replica_parallel_workers` não tem efeito imediato. O estado da variável se aplica a todas as instruções subsequentes de `START REPLICA`.

  Anteriormente, as réplicas multithreads não eram suportadas pelo NDB Cluster, o que ignorava silenciosamente a configuração dessa variável. Essa restrição foi removida no MySQL 8.0.33.

- `slave_pending_jobs_size_max`

  <table summary="Propriedades para replicate-do-table"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--replicate-do-table=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>1

  A partir do MySQL 8.0.26, `slave_pending_jobs_size_max` é descontinuado e o alias `replica_pending_jobs_size_max` deve ser usado em vez disso. Em versões anteriores ao MySQL 8.0.26, use `slave_pending_jobs_size_max`.

  Para réplicas multithreads, essa variável define a quantidade máxima de memória (em bytes) disponível para as filas de aplicador que estão armazenando eventos ainda não aplicados. Definir essa variável não tem efeito em réplicas para as quais o multithreading não está habilitado. Definir essa variável não tem efeito imediato. O estado da variável se aplica a todos os comandos subsequentes `START REPLICA`.

  O valor mínimo possível para essa variável é de 1024 bytes; o padrão é de 128 MB. O valor máximo possível é de 18.446.744.073.709.551.615 (16 exbibytes). Os valores que não são múltiplos exatos de 1024 bytes são arredondados para o próximo múltiplo inferior de 1024 bytes antes de serem armazenados.

  O valor desta variável é um limite flexível e pode ser ajustado para corresponder à carga de trabalho normal. Se um evento excepcionalmente grande exceder esse tamanho, a transação é suspensa até que todas as threads do trabalhador tenham filas vazias e, em seguida, processada. Todas as transações subsequentes são suspensas até que a grande transação seja concluída.

- `slave_preserve_commit_order`

  <table summary="Propriedades para replicate-do-table"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--replicate-do-table=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>2

  A partir do MySQL 8.0.26, `slave_preserve_commit_order` é descontinuado e o alias `replica_preserve_commit_order` deve ser usado em vez disso. Em versões anteriores ao MySQL 8.0.26, use `slave_preserve_commit_order`.

  Para réplicas multithreads (réplicas nas quais `replica_parallel_workers` ou `slave_parallel_workers` está definido para um valor maior que 0), definir `slave_preserve_commit_order=1` garante que as transações sejam executadas e confirmadas na replica na mesma ordem em que aparecem no log de retransmissão da replica. Isso previne lacunas na sequência de transações que foram executadas no log de retransmissão da replica e preserva o mesmo histórico de transações na replica como na fonte (com as limitações listadas abaixo). Esta variável não tem efeito em réplicas para as quais o multithreading não está habilitado.

  Antes do MySQL 8.0.27, o valor padrão para essa variável do sistema é `OFF`, o que significa que as transações podem ser confirmadas fora da ordem. A partir do MySQL 8.0.27, o multithreading é ativado por padrão para os servidores replicados (`replica_parallel_workers=4` por padrão), então `slave_preserve_commit_order=ON` é o padrão, e o ajuste `slave_parallel_type=LOGICAL_CLOCK` também é o padrão. Além disso, a partir do MySQL 8.0.27, o ajuste para `slave_preserve_commit_order` é ignorado se `slave_parallel_workers` for definido como 1, porque, nessa situação, a ordem das transações é preservada de qualquer forma.

  Até e incluindo o MySQL 8.0.18, definir `slave_preserve_commit_order=ON` exige que o registro binário (`log_bin`) e o registro de atualização de replica (`log_slave_updates`) estejam habilitados na replica, que são as configurações padrão do MySQL 8.0. A partir do MySQL 8.0.19, o registro binário e o registro de atualização de replica não são necessários na replica para definir `slave_preserve_commit_order=ON`, e podem ser desabilitados se desejado. Em todas as versões, definir `slave_preserve_commit_order=ON` exige que `slave_parallel_type` seja definido como `LOGICAL_CLOCK`, o que *não* é a configuração padrão antes do MySQL 8.0.27. Antes de alterar o valor de `slave_preserve_commit_order` ou `slave_parallel_type`, o fio do aplicável de replicação (para todos os canais de replicação se você estiver usando vários canais de replicação) deve ser parado.

  Quando `slave_preserve_commit_order=OFF` está definido, que é o padrão, as transações que uma replica multithreading aplica em paralelo podem ser confirmadas fora de ordem. Portanto, verificar a transação executada mais recentemente não garante que todas as transações anteriores da fonte tenham sido executadas na replica. Há uma chance de lacunas na sequência das transações executadas a partir do log de retransmissão da replica. Isso tem implicações para o registro e a recuperação ao usar uma replica multithreading. Consulte a Seção 19.5.1.34, “Inconsistências de Replicação e Transações”, para obter mais informações.

  Quando `slave_preserve_commit_order` é `ON`, o fio de trabalho em execução aguarda até que todas as transações anteriores sejam confirmadas antes de confirmar. Enquanto um fio dado está aguardando que outros fios de trabalho confirmem suas transações, ele reporta seu status como `Waiting for preceding transaction to commit`. Com esse modo, uma replica multithread nunca entra em um estado que a fonte não estava. Isso suporta o uso da replicação para escala de leitura. Veja a Seção 19.4.5, “Usando a Replicação para Escala de Leitura”.

  Nota

  - `slave_preserve_commit_order=ON` não impede a diferença de posição do log binário de origem, onde `Exec_master_log_pos` está atrás da posição até a qual as transações foram executadas. Veja a Seção 19.5.1.34, “Replicação e Inconsistências de Transações”.

  - `slave_preserve_commit_order=ON` não preserva a ordem de commit e o histórico de transações se a replica usar filtros em seu log binário, como `--binlog-do-db`.

  - `slave_preserve_commit_order=ON` não preserva a ordem das atualizações DML não transacionais. Essas atualizações podem ser confirmadas antes das transações que as precedem no log de retransmissão, o que pode resultar em lacunas na sequência das transações executadas a partir do log de retransmissão da replica.

  - Em versões anteriores ao MySQL 8.0.19, `slave_preserve_commit_order=ON` não preserva a ordem das instruções com uma cláusula `IF EXISTS` quando o objeto em questão não existe. Essas instruções podem ser confirmadas antes de transações que as precedem no log de retransmissão, o que pode resultar em lacunas na sequência de transações executadas a partir do log de retransmissão da replica.

  - Uma limitação para preservar a ordem de commit na replica pode ocorrer se a replicação baseada em declarações estiver em uso e os motores de armazenamento transacional e não transacional participarem de uma transação não-XA que seja revertida na origem. Normalmente, as transações não-XA que são revertidas na origem não são replicadas para a replica, mas, nesta situação específica, a transação pode ser replicada para a replica. Se isso acontecer, uma replica multisserial sem registro binário não gerencia o rollback da transação, portanto, a ordem de commit na replica diverge da ordem do log de retransmissão das transações nesse caso.

- `slave_rows_search_algorithms`

  <table summary="Propriedades para replicate-do-table"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--replicate-do-table=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>3

  Ao preparar lotes de linhas para registro e replicação baseados em linhas, essa variável de sistema controla como as linhas são pesquisadas para encontrar correspondências, especialmente se são usadas varreduras de hash. O uso dessa variável de sistema já está desaconselhado. O ajuste padrão `INDEX_SCAN,HASH_SCAN` é ótimo para o desempenho e funciona corretamente em todos os cenários. Veja a Seção 19.5.1.27, “Replicação e Pesquisas de Linhas”.

- `slave_skip_errors`

  <table summary="Propriedades para replicate-do-table"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--replicate-do-table=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>4

  A partir do MySQL 8.0.26, `slave_skip_errors` é descontinuado e o alias `replica_skip_errors` deve ser usado em vez disso. Em versões anteriores ao MySQL 8.0.26, use `slave_skip_errors`.

  Normalmente, a replicação é interrompida quando ocorre um erro na replica, o que lhe dá a oportunidade de resolver a inconsistência nos dados manualmente. Esta variável faz com que o fio de replicação SQL continue a replicação quando uma instrução retorna qualquer um dos erros listados no valor da variável.

- `replica_skip_errors`

  <table summary="Propriedades para replicate-do-table"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--replicate-do-table=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>5

  A partir do MySQL 8.0.26, use `replica_skip_errors` no lugar de `slave_skip_errors`, que foi descontinuado a partir dessa versão. Em versões anteriores ao MySQL 8.0.26, use `slave_skip_errors`.

  Normalmente, a replicação é interrompida quando ocorre um erro na replica, o que lhe dá a oportunidade de resolver a inconsistência nos dados manualmente. Esta variável faz com que o fio de replicação SQL continue a replicação quando uma instrução retorna qualquer um dos erros listados no valor da variável.

- `slave_sql_verify_checksum`

  <table summary="Propriedades para replicate-do-table"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--replicate-do-table=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>6

  A partir do MySQL 8.0.26, `slave_sql_verify_checksum` é descontinuado e o alias `replica_sql_verify_checksum` deve ser usado em vez disso. Em versões anteriores ao MySQL 8.0.26, use `slave_sql_verify_checksum`.

  `slave_sql_verify_checksum` faz com que o fio de replicação SQL verifique os dados usando os checksums lidos do log de retransmissão. Em caso de discrepância, a replica pára com um erro. A definição desta variável entra em vigor imediatamente para todos os canais de replicação, incluindo os canais em execução.

  Nota

  A thread de I/O de replicação (receptor) sempre lê os checksums, se possível, ao aceitar eventos da rede.

- `slave_transaction_retries`

  <table summary="Propriedades para replicate-do-table"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--replicate-do-table=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>7

  A partir do MySQL 8.0.26, `slave_transaction_retries` é descontinuado e o alias `replica_transaction_retries` deve ser usado em vez disso. Em versões anteriores ao MySQL 8.0.26, use `slave_transaction_retries`.

  `slave_transaction_retries` define o número máximo de vezes para a replicação de threads SQL em uma replica monofilamentar ou multifilamentar para tentar novamente automaticamente as transações falhas antes de parar. A definição desta variável tem efeito imediatamente em todos os canais de replicação, incluindo os canais em execução. O valor padrão é 10. Definir a variável para 0 desabilita o reprocessamento automático de transações.

  Se um fio de SQL de replicação não conseguir executar uma transação devido a um `InnoDB` deadlock ou porque o tempo de execução da transação excedeu o `InnoDB` de `innodb_lock_wait_timeout` ou o `NDB` de `TransactionDeadlockDetectionTimeout` ou o `TransactionInactiveTimeout`, ele tentará novamente `slave_transaction_retries` vezes antes de parar com um erro. As transações com um erro não temporário não são reatadas.

  A tabela do Schema de Desempenho `replication_applier_status` mostra o número de tentativas de recuperação que ocorreram em cada canal de replicação, na coluna `COUNT_TRANSACTIONS_RETRIES`. A tabela do Schema de Desempenho `replication_applier_status_by_worker` mostra informações detalhadas sobre as tentativas de recuperação de transações por threads individuais de aplicável em uma replica de um único ou múltiplos threads, e identifica os erros que causaram a última transação e a transação atualmente em andamento serem reatentadas.

- `slave_type_conversions`

  <table summary="Propriedades para replicate-do-table"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--replicate-do-table=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>8

  A partir do MySQL 8.0.26, `slave_type_conversions` é descontinuado e o alias `replica_type_conversions` deve ser usado em vez disso. Em versões anteriores ao MySQL 8.0.26, use `slave_type_conversions`.

  `slave_type_conversions` controla o modo de conversão de tipo em vigor na replica quando se usa a replicação baseada em linhas. Seu valor é um conjunto separado por vírgula de zero ou mais elementos da lista: `ALL_LOSSY`, `ALL_NON_LOSSY`, `ALL_SIGNED`, `ALL_UNSIGNED`. Defina essa variável como uma string vazia para impedir conversões de tipo entre a fonte e a replica. A definição dessa variável entra em vigor imediatamente para todos os canais de replicação, incluindo os canais em execução.

  Para obter informações adicionais sobre os modos de conversão de tipo aplicáveis à promoção e à redução de atributos na replicação baseada em linhas, consulte Replicação baseada em linhas: promoção e redução de atributos.

- `sql_replica_skip_counter`

  <table summary="Propriedades para replicate-do-table"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--replicate-do-table=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>9

  A partir do MySQL 8.0.26, use `sql_replica_skip_counter` no lugar de `sql_slave_skip_counter`, que foi descontinuado a partir dessa versão. Em versões anteriores ao MySQL 8.0.26, use `sql_slave_skip_counter`.

  `sql_replica_skip_counter` especifica o número de eventos da fonte que uma réplica deve ignorar. Definir a opção não tem efeito imediato. A variável se aplica à próxima declaração `START REPLICA`; a próxima declaração `START REPLICA` também altera o valor de volta para 0. Quando essa variável é definida para um valor diferente de zero e há vários canais de replicação configurados, a declaração `START REPLICA` só pode ser usada com a cláusula `FOR CHANNEL channel`.

  Esta opção é incompatível com a replicação baseada em GTID e não deve ser definida para um valor não nulo quando o `gtid_mode=ON` estiver definido. Se você precisar pular transações ao usar GTIDs, use o `gtid_executed` da fonte em vez disso. Se você ativou a atribuição de GTID em um canal de replicação usando a opção `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS` da declaração `CHANGE REPLICATION SOURCE TO`, o `sql_replica_skip_counter` está disponível. Veja a Seção 19.1.7.3, “Pular Transações”.

  Importante

  Se o desconsiderar do número de eventos especificado ao definir essa variável causar o início da replicação no meio de um grupo de eventos, a replicação continua a desconsiderar até encontrar o início do próximo grupo de eventos e começar a partir desse ponto. Para mais informações, consulte a Seção 19.1.7.3, “Desconsiderar Transações”.

- `sql_slave_skip_counter`

  <table summary="Propriedades para replicar-ignorar-tabela"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--replicate-ignore-table=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>0

  A partir do MySQL 8.0.26, `sql_slave_skip_counter` é descontinuado e o alias `sql_replica_skip_counter` deve ser usado em vez disso. Em versões anteriores ao MySQL 8.0.26, use `sql_slave_skip_counter`.

  `sql_slave_skip_counter` especifica o número de eventos da fonte que uma réplica deve ignorar. Definir a opção não tem efeito imediato. A variável se aplica à próxima declaração `START REPLICA`; a próxima declaração `START REPLICA` também altera o valor de volta para 0. Quando essa variável é definida para um valor diferente de zero e há vários canais de replicação configurados, a declaração `START REPLICA` só pode ser usada com a cláusula `FOR CHANNEL channel`.

  Esta opção é incompatível com a replicação baseada em GTID e não deve ser definida para um valor não nulo quando o `gtid_mode=ON` estiver definido. Se você precisar pular transações ao usar GTIDs, use o `gtid_executed` da fonte em vez disso. Se você ativou a atribuição de GTID em um canal de replicação usando a opção `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS` da declaração `CHANGE REPLICATION SOURCE TO`, o `sql_slave_skip_counter` está disponível. Veja a Seção 19.1.7.3, “Pular Transações”.

  Importante

  Se o desconsiderar do número de eventos especificado ao definir essa variável causar o início da replicação no meio de um grupo de eventos, a replicação continua a desconsiderar até encontrar o início do próximo grupo de eventos e começar a partir desse ponto. Para mais informações, consulte a Seção 19.1.7.3, “Desconsiderar Transações”.

- `sync_master_info`

  <table summary="Propriedades para replicar-ignorar-tabela"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--replicate-ignore-table=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>1

  A partir do MySQL 8.0.26, `sync_master_info` é descontinuado e o alias `sync_source_info` deve ser usado em vez disso. Em versões anteriores ao MySQL 8.0.26, use `sync_master_info`.

  `sync_master_info` especifica o número de eventos após os quais a replica atualiza o repositório de metadados de conexão. Quando o repositório de metadados de conexão é armazenado como uma tabela `InnoDB`, que é a opção padrão a partir do MySQL 8.0, ele é atualizado após esse número de eventos. Se o repositório de metadados de conexão for armazenado como um arquivo, o que é desaconselhado a partir do MySQL 8.0, a replica sincroniza seu arquivo `master.info` com o disco (usando `fdatasync()`) após esse número de eventos. O valor padrão é 10000, e um valor zero significa que o repositório nunca é atualizado. A configuração desta variável entra em vigor imediatamente para todos os canais de replicação, incluindo os canais em execução.

- `sync_relay_log`

  <table summary="Propriedades para replicar-ignorar-tabela"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--replicate-ignore-table=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>2

  Se o valor desta variável for maior que 0, o servidor MySQL sincroniza seu log de retransmissão no disco (usando `fdatasync()`) após cada `sync_relay_log` eventos serem escritos no log de retransmissão. A definição desta variável entra em vigor imediatamente para todos os canais de replicação, incluindo os canais em execução.

  Definir `sync_relay_log` para 0 faz com que não haja sincronização no disco; nesse caso, o servidor depende do sistema operacional para limpar o conteúdo do log do retransmissor de tempos em tempos, como qualquer outro arquivo.

  Um valor de 1 é a escolha mais segura, pois, em caso de uma parada inesperada, você perde no máximo um evento do log de retransmissão. No entanto, também é a opção mais lenta (a menos que o disco tenha um cache com bateria, o que torna a sincronização muito rápida). Para obter informações sobre a combinação de configurações em uma réplica mais resistente a paradas inesperadas, consulte a Seção 19.4.2, “Tratamento de uma Parada Inesperada de uma Réplica”.

- `sync_relay_log_info`

  <table summary="Propriedades para replicar-ignorar-tabela"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--replicate-ignore-table=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>3

  O número de transações após as quais a réplica atualiza o repositório de metadados do aplicável. Quando o repositório de metadados do aplicável é armazenado como uma tabela `InnoDB` (o padrão no MySQL 8.0 e versões posteriores), ele é atualizado após cada transação e essa variável do sistema é ignorada. Se o repositório de metadados do aplicável for armazenado como um arquivo (desatualizado no MySQL 8.0), a réplica sincroniza seu arquivo `relay-log.info` com o disco (usando `fdatasync()`) após esse número de transações. `0` (zero) significa que o conteúdo do arquivo é descarregado pelo sistema operacional apenas. A definição dessa variável entra em vigor imediatamente para todos os canais de replicação, incluindo os canais em execução.

  Como o armazenamento de metadados do aplicativo como um arquivo foi descontinuado, essa variável também foi descontinuada; a partir do MySQL 8.0.34, o servidor emite uma mensagem de aviso sempre que você a define ou lê seu valor. Você deve esperar que `sync_relay_log_info` seja removido em uma versão futura do MySQL e migrar os aplicativos que dependem dele agora.

- `sync_source_info`

  <table summary="Propriedades para replicar-ignorar-tabela"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--replicate-ignore-table=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>4

  A partir do MySQL 8.0.26, use `sync_source_info` no lugar de `sync_master_info`, que foi descontinuado a partir dessa versão. Em versões anteriores ao MySQL 8.0.26, use `sync_source_info`.

  `sync_source_info` especifica o número de eventos após os quais a replica atualiza o repositório de metadados de conexão. Quando o repositório de metadados de conexão é armazenado como uma tabela `InnoDB`, que é a opção padrão a partir do MySQL 8.0, ele é atualizado após esse número de eventos. Se o repositório de metadados de conexão for armazenado como um arquivo, o que é desaconselhado a partir do MySQL 8.0, a replica sincroniza seu arquivo `master.info` com o disco (usando `fdatasync()`) após esse número de eventos. O valor padrão é 10000, e um valor zero significa que o repositório nunca é atualizado. A configuração desta variável entra em vigor imediatamente para todos os canais de replicação, incluindo os canais em execução.

- `terminology_use_previous`

  <table summary="Propriedades para replicar-ignorar-tabela"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--replicate-ignore-table=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>5

  No MySQL 8.0.26, foram feitas alterações incompatíveis nos nomes de instrumentação que contêm os termos `master`, `slave` e `mts` (para “Multi-Threaded Slave”), que foram alterados, respectivamente, para `source`, `replica` e `mta` (para “Multi-Threaded Applier”). Se essas alterações incompatíveis afetarem seus aplicativos, defina a variável de sistema `terminology_use_previous` para `BEFORE_8_0_26` para fazer com que o MySQL Server use as versões antigas dos nomes para os objetos especificados na lista anterior. Isso permite que as ferramentas de monitoramento que dependem dos nomes antigos continuem funcionando até que possam ser atualizadas para usar os novos nomes.

  Defina a variável de sistema `terminology_use_previous` com escopo de sessão para suportar usuários individuais ou com escopo global para ser a opção padrão para todas as novas sessões. Quando o escopo global é usado, o log de consultas lentas contém as versões antigas dos nomes.

  Os nomes das variáveis de instrumentação afetadas estão listados na seguinte tabela. A variável de sistema `terminology_use_previous` afeta apenas esses itens. Ela não afeta os novos aliases para variáveis de sistema, variáveis de status e opções de linha de comando que também foram introduzidas no MySQL 8.0.26, e esses ainda podem ser usados quando configurados.

  - Lås instrumentados (mutexos), visíveis nas tabelas do esquema de desempenho `mutex_instances` e `events_waits_*` com o prefixo `wait/synch/mutex/`

  - Lås de leitura/escrita, visíveis nas tabelas do esquema de desempenho `rwlock_instances` e `events_waits_*` com o prefixo `wait/synch/rwlock/`

  - Variáveis de condição instrumentadas, visíveis nas tabelas do Schema de Desempenho `cond_instances` e `events_waits_*` com o prefixo `wait/synch/cond/`

  - Alocações de memória instrumentadas, visíveis nas tabelas do Schema de Desempenho `memory_summary_*` com o prefixo `memory/sql/`

  - Nomes de fios, visíveis na tabela `threads` do Schema de Desempenho com o prefixo `thread/sql/`

  - Estágios de execução, visíveis nas tabelas do Schema de Desempenho `events_stages_*` com o prefixo `stage/sql/` e sem o prefixo nas tabelas do Schema de Desempenho `threads` e `processlist`, o resultado da instrução `SHOW PROCESSLIST`, a tabela do Schema de Informações `processlist` e o log de consultas lentas

  - Os comandos de fio, visíveis nas tabelas do Schema de Desempenho `events_statements_history*` e `events_statements_summary_*_by_event_name` com o prefixo `statement/com/`, e sem o prefixo nas tabelas do Schema de Desempenho `threads` e `processlist`, o resultado da instrução `SHOW PROCESSLIST`, a tabela do Schema de Informações `processlist` e o resultado da instrução `SHOW REPLICA STATUS`
