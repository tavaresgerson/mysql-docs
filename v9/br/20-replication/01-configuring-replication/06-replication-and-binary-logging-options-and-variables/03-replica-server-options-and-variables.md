#### 19.1.6.3 Opções e variáveis do servidor de replicação

Esta seção explica as opções do servidor e as variáveis do sistema que se aplicam aos servidores de replicação e contém o seguinte:

* Opções de inicialização para servidores de replicação
* Variáveis do sistema usadas em servidores de replicação

Especifique as opções na linha de comando ou em um arquivo de opções. Muitas das opções podem ser definidas enquanto o servidor está em execução usando a instrução `CHANGE REPLICATION SOURCE TO`. Especifique os valores das variáveis do sistema usando `SET`.

**ID do servidor.** No servidor de origem e em cada replica, você deve definir a variável do sistema `server_id` para estabelecer um ID de replicação único no intervalo de 1 a 232 − 1. "Único" significa que cada ID deve ser diferente de todos os outros IDs em uso por qualquer outro servidor de origem ou replica na topologia de replicação. Exemplo de arquivo `my.cnf`:

```
[mysqld]
server-id=3
```

##### Opções de inicialização para servidores de replicação

Esta seção explica as opções de inicialização para controlar servidores de replicação. Muitas dessas opções podem ser definidas enquanto o servidor está em execução usando a instrução `CHANGE REPLICATION SOURCE TO`. Outras, como as opções `--replicate-*`, podem ser definidas apenas quando o servidor de replicação começa. As variáveis do sistema relacionadas à replicação são discutidas mais adiante nesta seção.

* `--master-retry-count=count`

<table frame="box" rules="all" summary="Propriedades para master-retry-count">
  <tr><th>Formato de linha de comando</th> <td><code>--master-retry-count=#</code></td> </tr>
  <tr><th>Desatualizado</th> <td>Sim</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor padrão</th> <td><code>10</code></td> </tr>
  <tr><th>Valor mínimo</th> <td><code>0</code></td> </tr>
  <tr><th>Valor máximo (plataformas de 64 bits)</th> <td><code>18446744073709551615</code></td> </tr>
  <tr><th>Valor máximo (plataformas de 32 bits)</th> <td><code>4294967295</code></td> </tr>
</table>

* `--max-relay-log-size=size`
* A opção está desatualizada; espere-se que seja removida em uma futura versão do MySQL. Use, em vez disso, a opção `SOURCE_RETRY_COUNT` da instrução `CHANGE REPLICATION SOURCE TO`.

<table frame="box" rules="all" summary="Propriedades para max_relay_log_size">
  <tr><th>Formato de Linha de Comando</th> <td><code>--max-relay-log-size=#</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code><a class="link" href="replication-options-replica.html#sysvar_max_relay_log_size">max_relay_log_size</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Dica de Sintaxe para Configuração de Variável</th> <td><code>SET_VAR</code></td> </tr>
  <tr><th>Aplica Dicas</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>0</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr>
  <tr><th>Valor Máximo</th> <td><code>1073741824</code></td> </tr>
  <tr><th>Unidade</th> <td>bytes</td> </tr>
  <tr><th>Tamanho do Bloco</th> <td><code>4096</code></td> </tr>
</table>

  O tamanho em que o servidor rotação de arquivos de log de relé é rotacionado automaticamente. Se esse valor for diferente de zero, o log de relé é rotacionado automaticamente quando seu tamanho exceder esse valor. Se esse valor for zero (o padrão), o tamanho em que a rotação do log de relé ocorre é determinado pelo valor de `max_binlog_size`. Para mais informações, consulte a Seção 19.2.4.1, “O Log de Relé”.

* `--relay-log-purge={0|1}`

<table frame="box" rules="all" summary="Propriedades para relay_log_purge">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--relay-log-purge[={OFF|ON}]</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code><a class="link" href="replication-options-replica.html#sysvar_relay_log_purge">relay_log_purge</a></code></td>
  </tr>
  <tr>
    <th>Alcance</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmico</th>
    <td>Sim</td>
  </tr>
  <tr>
    <th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de Hinta de Configuração de Variável"><code>SET_VAR</a></code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Booleano</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>ON</code></td>
  </tr>
</table>

  Desative ou ative a purga automática dos logs do relay assim que eles não forem mais necessários. O valor padrão é 1 (ativado). Esta é uma variável global que pode ser alterada dinamicamente com `SET GLOBAL relay_log_purge = N`. Desativar a purga dos logs do relay ao habilitar a opção `--relay-log-recovery` arrisca a consistência dos dados e, portanto, não é segura em caso de falha.

* `--relay-log-space-limit=size`

<table frame="box" rules="all" summary="Propriedades para relay_log_space_limit">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--relay-log-space-limit=#</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code><a class="link" href="replication-options-replica.html#sysvar_relay_log_space_limit">relay_log_space_limit</a></code></td>
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
    <th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variáveis"><code>SET_VAR</a></code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Inteiro</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>0</code></td>
  </tr>
  <tr>
    <th>Valor Mínimo</th>
    <td><code>0</code></td>
  </tr>
  <tr>
    <th>Valor Máximo</th>
    <td><code>18446744073709551615</code></td>
  </tr>
  <tr>
    <th>Unidade</th>
    <td>bytes</td>
  </tr>
</table>

Esta opção define um limite superior para o tamanho total em bytes de todos os logs de retransmissão na replica. Um valor de 0 significa “sem limite”. Isso é útil para um servidor de replica que tem espaço em disco limitado. Quando o limite é atingido, o thread de I/O (receptor) para de ler eventos de log binário do servidor de origem até que o thread SQL (aplicável) consiga recuperar e excluir alguns logs de retransmissão não utilizados. Note que esse limite não é absoluto: há casos em que o thread SQL (aplicável) precisa de mais eventos antes de poder excluir logs de retransmissão. Nesse caso, o thread receptor excede o limite até que seja possível para o thread aplicável excluir alguns logs de retransmissão, pois não fazer isso causaria um impasse. Você não deve definir `--relay-log-space-limit` para menos de duas vezes o valor de `--max-relay-log-size` (ou `--max-binlog-size` se `--max-relay-log-size` for 0). Nesse caso, há a chance de que o thread receptor espere por espaço livre porque `--relay-log-space-limit` é excedido, mas o thread aplicável não tem nenhum log de retransmissão para purgar e não consegue satisfazer o thread receptor. Isso obriga o thread receptor a ignorar `--relay-log-space-limit` temporariamente.

* `--replicate-do-db=db_name`

  <table frame="box" rules="all" summary="Propriedades para replicate-do-db"><tr><th>Formato de linha de comando</th> <td><code>--replicate-do-db=name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Cria um filtro de replicação usando o nome de um banco de dados. Esses filtros também podem ser criados usando `ALTERAR FILTRO DE REPLICA REPLICATE_DO_DB`.

Esta opção suporta filtros de replicação específicos de canal, permitindo que réplicas de várias fontes usem filtros específicos para diferentes fontes. Para configurar um filtro de replicação específico de canal em um canal chamado *`canal_1`*, use `--replicate-do-db:canal_1:nome_do_banco`. Neste caso, o primeiro ponto-e-vírgula é interpretado como um separador e os pontos-e-vírgulas subsequentes são colchetes. Consulte a Seção 19.2.5.4, “Filtros Baseados em Canais de Replicação” para obter mais informações.

Nota

Filtros de replicação globais não podem ser usados em uma instância do servidor MySQL configurada para Replicação por Grupo, porque filtrar transações em alguns servidores tornaria o grupo incapaz de chegar a um acordo sobre um estado consistente. Filtros de replicação específicos de canal podem ser usados em canais de replicação que não estejam diretamente envolvidos com a Replicação por Grupo, como quando um membro do grupo também atua como uma réplica para uma fonte que está fora do grupo. Eles não podem ser usados nos canais `group_replication_applier` ou `group_replication_recovery`.

O efeito preciso deste filtro de replicação depende se a replicação baseada em declarações ou baseada em linhas está em uso.

**Replicação baseada em declarações.** Diga ao thread SQL de replicação para restringir a replicação a declarações onde o banco de dados padrão (ou seja, o selecionado por `USE`) é *`nome_do_banco`*. Para especificar mais de um banco de dados, use esta opção várias vezes, uma vez para cada banco de dados; no entanto, fazer isso *não* replica declarações entre bancos, como `UPDATE some_db.some_table SET foo='bar'` enquanto um banco de dados diferente (ou nenhum banco de dados) é selecionado.

Aviso

Para especificar múltiplas bases de dados, você *deve* usar múltiplas instâncias desta opção. Como os nomes de banco de dados podem conter vírgulas, se você fornecer uma lista separada por vírgula, a lista é tratada como o nome de uma única base de dados.

Um exemplo do que não funciona conforme você espera ao usar a replicação baseada em declarações: Se a replica for iniciada com `--replicate-do-db=sales` e você emitir as seguintes declarações na fonte, a declaração `UPDATE` *não* será replicada:

```
  USE prices;
  UPDATE sales.january SET amount=amount+1000;
  ```

A principal razão para esse comportamento "verifique apenas a base de dados padrão" é que, a partir da declaração sozinha, é difícil saber se ela deve ser replicada (por exemplo, se você está usando declarações `DELETE` de múltiplas tabelas ou declarações `UPDATE` de múltiplas tabelas que atuam em múltiplas bases de dados). Também é mais rápido verificar apenas a base de dados padrão em vez de todas as bases de dados, se não houver necessidade.

**Replicação baseada em linhas.** Diz ao thread de SQL da replicação para restringir a replicação à *`db_name`*. Apenas as tabelas pertencentes a *`db_name`* são alteradas; o banco de dados atual não tem efeito sobre isso. Suponha que a replica seja iniciada com `--replicate-do-db=sales` e a replicação baseada em linhas esteja em vigor, e então as seguintes declarações sejam executadas na fonte:

```
  USE prices;
  UPDATE sales.february SET amount=amount+100;
  ```

A tabela `february` no banco de dados `sales` na replica é alterada de acordo com a declaração `UPDATE`; isso ocorre independentemente de a declaração `USE` ter sido emitida. No entanto, emitir as seguintes declarações na fonte não tem efeito na replica quando a replicação baseada em linhas e `--replicate-do-db=sales` estão em uso:

```
  USE prices;
  UPDATE prices.march SET amount=amount-25;
  ```

Mesmo que a declaração `USE prices` seja alterada para `USE sales`, os efeitos da declaração `UPDATE` ainda não serão replicados.

Outra diferença importante na forma como `--replicate-do-db` é tratada na replicação baseada em declarações, em oposição à replicação baseada em linhas, ocorre em relação às declarações que se referem a múltiplas bases de dados. Suponha que a replica seja iniciada com `--replicate-do-db=db1`, e as seguintes declarações sejam executadas na fonte:

  ```
  USE db1;
  UPDATE db1.table1, db2.table2 SET db1.table1.col1 = 10, db2.table2.col2 = 20;
  ```

  Se você estiver usando a replicação baseada em declarações, então ambas as tabelas são atualizadas na replica. No entanto, ao usar a replicação baseada em linhas, apenas `table1` é afetada na replica; como `table2` está em uma base de dados diferente, `table2` na replica não é alterada pelo `UPDATE`. Agora, suponha que, em vez da declaração `USE db1`, tivesse sido usada uma declaração `USE db4`:

  ```
  USE db4;
  UPDATE db1.table1, db2.table2 SET db1.table1.col1 = 10, db2.table2.col2 = 20;
  ```

  Neste caso, o `UPDATE` não teria efeito na replica quando usando a replicação baseada em declarações. No entanto, se você estiver usando a replicação baseada em linhas, o `UPDATE` mudaria `table1` na replica, mas não `table2`—ou seja, apenas as tabelas na base de dados nomeada por `--replicate-do-db` são alteradas, e a escolha da base de dados padrão não tem efeito nesse comportamento.

  Se você precisar de atualizações entre bases de dados para funcionar, use `--replicate-wild-do-table=db_name.%` em vez disso. Veja a Seção 19.2.5, “Como os Servidores Avaliam as Regras de Filtro de Replicação”.

  Nota

  Esta opção afeta a replicação da mesma maneira que `--binlog-do-db` afeta o registro binário, e os efeitos do formato de replicação sobre como `--replicate-do-db` afeta o comportamento da replicação são os mesmos que o formato de registro tem sobre o comportamento de `--binlog-do-db`.

  Esta opção não tem efeito em declarações `BEGIN`, `COMMIT` ou `ROLLBACK`.

* `--replicate-ignore-db=db_name`

<table frame="box" rules="all" summary="Propriedades para replicar-ignorar-db">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--replicate-ignore-db=nome</code></td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>String</td>
  </tr>
  </tbody>
</table>

  Cria um filtro de replicação usando o nome de um banco de dados. Esses filtros também podem ser criados usando `ALTERAR FILTRO DE REPLICAÇÃO REPLICAR_IGNORAR`.

  Esta opção suporta filtros de replicação específicos de canal, permitindo que réplicas de múltiplas fontes usem filtros específicos para diferentes fontes. Para configurar um filtro de replicação específico de canal em um canal chamado *`canal_1`*, use `--replicate-ignore-db:canal_1:nome_do_banco`. Neste caso, o primeiro ponto-e-vírgula é interpretado como um separador e os pontos-e-vírgulas subsequentes são colchetes literais. Veja a Seção 19.2.5.4, “Filtros Baseados em Canais de Replicação” para mais informações.

  Nota

  Filtros de replicação globais não podem ser usados em uma instância do servidor MySQL configurada para Replicação em Grupo, porque filtrar transações em alguns servidores tornaria o grupo incapaz de chegar a um acordo sobre um estado consistente. Filtros de replicação específicos de canal podem ser usados em canais de replicação que não estão diretamente envolvidos com a Replicação em Grupo, como quando um membro do grupo também atua como uma réplica para uma fonte que está fora do grupo. Eles não podem ser usados nos canais `group_replication_applier` ou `group_replication_recovery`.

  Para especificar mais de um banco de dados a ser ignorado, use esta opção várias vezes, uma vez para cada banco de dados. Como os nomes de banco de dados podem conter vírgulas, se você fornecer uma lista separada por vírgula, ela é tratada como o nome de um único banco de dados.

Assim como `--replicate-do-db`, o efeito preciso desse filtro depende se a replicação baseada em declarações ou baseada em linhas está em uso, e são descritos nos próximos parágrafos.

**Replicação baseada em declarações.** Diz ao thread de replicação SQL que não deve replicar nenhuma declaração onde o banco de dados padrão (ou seja, aquele selecionado por `USE`) é *`db_name`*.

**Replicação baseada em linhas.** Diz ao thread de replicação SQL que não deve atualizar nenhuma tabela no banco de dados *`db_name`*. O banco de dados padrão não tem efeito.

Ao usar a replicação baseada em declarações, o exemplo a seguir não funciona como você pode esperar. Suponha que a replica seja iniciada com `--replicate-ignore-db=sales` e você emitir as seguintes declarações na fonte:

```
  USE prices;
  UPDATE sales.january SET amount=amount+1000;
  ```

A declaração `UPDATE` *é* replicada nesse caso, porque `--replicate-ignore-db` se aplica apenas ao banco de dados padrão (determinado pela declaração `USE`). Como o banco de dados `sales` foi especificado explicitamente na declaração, a declaração não foi filtrada. No entanto, ao usar a replicação baseada em linhas, os efeitos da declaração `UPDATE` *não* são propagados para a replica, e a cópia da replica da tabela `sales.january` permanece inalterada; nesse caso, `--replicate-ignore-db=sales` faz com que *todas* as alterações feitas em tabelas na cópia da fonte do banco de dados `sales` sejam ignoradas pela replica.

Você não deve usar essa opção se estiver usando atualizações entre bancos e não quiser que essas atualizações sejam replicadas. Veja a Seção 19.2.5, “Como os Servidores Avaliam as Regras de Filtro de Replicação”.

Se você precisar de atualizações entre bancos para funcionar, use `--replicate-wild-ignore-table=db_name.%` em vez disso. Veja a Seção 19.2.5, “Como os Servidores Avaliam as Regras de Filtro de Replicação”.

Nota

Esta opção afeta a replicação da mesma maneira que `--binlog-ignore-db` afeta o registro binário, e os efeitos do formato de replicação sobre como `--replicate-ignore-db` afeta o comportamento da replicação são os mesmos que o formato de registro tem sobre o comportamento de `--binlog-ignore-db`.

Esta opção não tem efeito sobre as instruções `BEGIN`, `COMMIT` ou `ROLLBACK`.

* `--replicate-do-table=db_name.tbl_name`

  <table frame="box" rules="all" summary="Propriedades para replicate-do-table"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--replicate-do-table=name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Cria um filtro de replicação, informando ao thread de SQL de replicação para restringir a replicação a uma tabela específica. Para especificar mais de uma tabela, use esta opção várias vezes, uma vez para cada tabela. Isso funciona tanto para atualizações cruzadas de bancos de dados quanto para atualizações padrão de bancos de dados, em contraste com `--replicate-do-db`. Veja a Seção 19.2.5, “Como os Servidores Avaliam as Regras de Filtragem de Replicação”. Você também pode criar tal filtro emitindo uma instrução `CHANGE REPLICATION FILTER REPLICATE_DO_TABLE`.

  Esta opção suporta filtros de replicação específicos de canal, permitindo que réplicas de múltiplas fontes usem filtros específicos para diferentes fontes. Para configurar um filtro de replicação específico de canal em um canal chamado *`channel_1`*, use `--replicate-do-table:channel_1:db_name.tbl_name`. Neste caso, o primeiro ponto e vírgula é interpretado como um separador e os pontos e vírgulas subsequentes são colchetes literais. Veja a Seção 19.2.5.4, “Filtros Baseados em Canais de Replicação” para mais informações.

  Nota

Os filtros de replicação global não podem ser usados em uma instância do servidor MySQL configurada para Replicação por Grupo, porque filtrar transações em alguns servidores tornaria o grupo incapaz de chegar a um acordo sobre um estado consistente. Filtros de replicação específicos para canais podem ser usados em canais de replicação que não estejam diretamente envolvidos com a Replicação por Grupo, como quando um membro do grupo também atua como replica para uma fonte que está fora do grupo. Eles não podem ser usados nos canais `group_replication_applier` ou `group_replication_recovery`.

Esta opção afeta apenas declarações que se aplicam a tabelas. Não afeta declarações que se aplicam apenas a outros objetos do banco de dados, como rotinas armazenadas. Para filtrar declarações que operam em rotinas armazenadas, use uma ou mais das opções `--replicate-*-db`.

* `--replicate-ignore-table=db_name.tbl_name`

  <table frame="box" rules="all" summary="Propriedades para replicate-ignore-table"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--replicate-ignore-table=name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Cria um filtro de replicação dizendo ao thread SQL de replicação para não replicar nenhuma declaração que atualize a tabela especificada, mesmo que outras tabelas possam ser atualizadas pela mesma declaração. Para especificar mais de uma tabela a ser ignorada, use esta opção várias vezes, uma vez para cada tabela. Isso funciona para atualizações entre bancos, em contraste com `--replicate-ignore-db`. Veja a Seção 19.2.5, “Como os Servidores Avaliam as Regras de Filtragem de Replicação”. Você também pode criar tal filtro emitindo uma declaração `CHANGE REPLICATION FILTER REPLICATE_IGNORE_TABLE`.

Esta opção suporta filtros de replicação específicos de canal, permitindo que réplicas de várias fontes usem filtros específicos para diferentes fontes. Para configurar um filtro de replicação específico de canal em um canal chamado *`canal_1`*, use `--replicate-ignore-table:canal_1:nome_do_banco.nome_da_tabela`. Neste caso, o primeiro ponto-e-vírgula é interpretado como um separador e os pontos-e-vírgulas subsequentes são colchetes. Consulte a Seção 19.2.5.4, “Filtros Baseados em Canais de Replicação” para obter mais informações.

Nota

Filtros de replicação globais não podem ser usados em uma instância do servidor MySQL configurada para Replicação por Grupo, porque filtrar transações em alguns servidores tornaria o grupo incapaz de chegar a um acordo sobre um estado consistente. Filtros de replicação específicos de canal podem ser usados em canais de replicação que não estejam diretamente envolvidos com a Replicação por Grupo, como quando um membro do grupo também atua como uma réplica para uma fonte que está fora do grupo. Eles não podem ser usados nos canais `group_replication_applier` ou `group_replication_recovery`.

Esta opção afeta apenas declarações que se aplicam a tabelas. Não afeta declarações que se aplicam apenas a outros objetos do banco de dados, como rotinas armazenadas. Para filtrar declarações que operam em rotinas armazenadas, use uma ou mais das opções `--replicate-*-db`.

* `--replicate-rewrite-db=de_nome_antigo-&gt;para_nome_novo`

<table frame="box" rules="all" summary="Propriedades para replicate-rewrite-db"><tr><th>Formato de Linha de Comando</th> <td><code>--replicate-rewrite-db=nome_antigo-&gt;nome_novo</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

Diz ao replica que crie um filtro de replicação que traduza o banco de dados especificado para *`to_name`* se ele fosse *`from_name`* na fonte. Apenas as instruções que envolvem tabelas são afetadas, não instruções como `CREATE DATABASE`, `DROP DATABASE` e `ALTER DATABASE`.

Para especificar múltiplas reescritas, use essa opção várias vezes. O servidor usa a primeira com um valor de *`from_name`* que corresponda. A tradução do nome do banco de dados é feita *antes* das regras `--replicate-*` serem testadas. Você também pode criar um filtro assim emitindo uma instrução `CHANGE REPLICATION FILTER REPLICATE_REWRITE_DB`.

Se você usar a opção `--replicate-rewrite-db` na linha de comando e o caractere `>` for especial para o interpretador de comandos, cite o valor da opção. Por exemplo:

```
  $> mysqld --replicate-rewrite-db="olddb->newdb"
  ```

O efeito da opção `--replicate-rewrite-db` difere dependendo se o formato de registro binário baseado em instruções ou baseado em linhas é usado para a consulta. Com o formato baseado em instruções, as instruções DML são traduzidas com base no banco de dados atual, conforme especificado pela instrução `USE`. Com o formato baseado em linhas, as instruções DML são traduzidas com base no banco de dados onde a tabela modificada existe. As instruções DDL são sempre filtradas com base no banco de dados atual, conforme especificado pela instrução `USE`, independentemente do formato de registro binário.

Para garantir que a reescrita produza os resultados esperados, particularmente em combinação com outras opções de filtragem de replicação, siga essas recomendações ao usar a opção `--replicate-rewrite-db`:

+ Crie os bancos de dados *`from_name`* e *`to_name`* manualmente na fonte e na replica com nomes diferentes.

+ Se você usar o formato de registro binário baseado em declarações ou misto, não use consultas entre bancos e não especifique nomes de bancos nas consultas. Para declarações de DDL e DML, confie na declaração `USE` para especificar o banco atual e use apenas o nome da tabela nas consultas.

+ Se você usar exclusivamente o formato de registro binário baseado em linhas, para declarações de DDL, confie na declaração `USE` para especificar o banco atual e use apenas o nome da tabela nas consultas. Para declarações DML, você pode usar um nome de tabela totalmente qualificado (*`db`*.*`table`*) se desejar.

+ Se essas recomendações forem seguidas, é seguro usar a opção `--replicate-rewrite-db` em combinação com opções de filtragem de replicação em nível de tabela, como `--replicate-do-table`.

+ Esta opção suporta filtros de replicação específicos de canal, permitindo que réplicas de várias fontes usem filtros específicos para diferentes fontes. Especifique o nome do canal seguido de um colon, seguido da especificação do filtro. O primeiro colon é interpretado como um separador e quaisquer colons subsequentes são interpretados como colons literais. Por exemplo, para configurar um filtro de replicação específico de canal em um canal chamado *`channel_1`*, use:

  ```
  $> mysqld --replicate-rewrite-db=channel_1:db_name1->db_name2
  ```

+ Se você usar um colon, mas não especificar um nome de canal, a opção configura o filtro de replicação para o canal de replicação padrão. Consulte a Seção 19.2.5.4, “Filtros Baseados em Canal de Replicação” para mais informações.

+ Nota

Os filtros de replicação global não podem ser usados em uma instância do servidor MySQL configurada para a replicação em grupo, porque filtrar transações em alguns servidores tornaria o grupo incapaz de chegar a um acordo sobre um estado consistente. Os filtros de replicação específicos de canal podem ser usados em canais de replicação que não estejam diretamente envolvidos com a replicação em grupo, como quando um membro do grupo também atua como replica para uma fonte que está fora do grupo. Eles não podem ser usados nos canais `group_replication_applier` ou `group_replication_recovery`.

* `--replicate-same-server-id`

  <table frame="box" rules="all" summary="Propriedades para replicate-same-server-id"><tbody><tr><th>Formato de linha de comando</th> <td><code>--replicate-same-server-id[={OFF|ON}]</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Esta opção é para uso em réplicas. O valor padrão é 0 (`FALSE`). Com esta opção definida para 1 (`TRUE`), a replica não pula eventos que têm seu próprio ID de servidor. Esta configuração normalmente é útil apenas em configurações raras.

Quando o registro binário é habilitado em uma replica, a combinação das opções `--replicate-same-server-id` e `--log-replica-updates` na replica pode causar loops infinitos na replicação se o servidor fazer parte de uma topologia de replicação circular. (No MySQL 9.5, o registro binário é habilitado por padrão, e o registro de atualizações da replica é o padrão quando o registro binário está habilitado). No entanto, o uso de identificadores de transações globais (GTIDs) previne essa situação, ignorando a execução de transações que já foram aplicadas. Se `gtid_mode=ON` for definido na replica, você pode iniciar o servidor com essa combinação de opções, mas não pode mudar para qualquer outro modo de GTID enquanto o servidor estiver em execução. Se algum outro modo de GTID for definido, o servidor não será iniciado com essa combinação de opções.

Por padrão, o thread de I/O de replicação (receptor) não escreve eventos de log binário no log de relevo se eles tiverem o ID do servidor da replica (esta otimização ajuda a economizar o uso do disco). Se você quiser usar `--replicate-same-server-id`, certifique-se de iniciar a replica com essa opção antes de fazer a replica ler seus próprios eventos que você deseja que o thread de SQL de replicação (aplicador) execute.

* `--replicate-wild-do-table=db_name.tbl_name`

<table frame="box" rules="all" summary="Propriedades para max_relay_log_size">
  <tr><th>Formato de Linha de Comando</th> <td><code>--max-relay-log-size=#</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code><a class="link" href="replication-options-replica.html#sysvar_max_relay_log_size">max_relay_log_size</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>0</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr>
  <tr><th>Valor Máximo</th> <td><code>1073741824</code></td> </tr>
  <tr><th>Unidade</th> <td>bytes</td> </tr>
  <tr><th>Tamanho do Bloco</th> <td><code>4096</code></td> </tr>
</table>

Cria um filtro de replicação, informando ao thread SQL (aplicador) de replicação para restringir a replicação a declarações onde qualquer uma das tabelas atualizadas corresponder aos padrões especificados de nomes de banco de dados e tabelas. Os padrões podem conter os caracteres curinga `%` e `_`, que têm o mesmo significado que o operador de correspondência de padrões `LIKE`. Para especificar mais de uma tabela, use esta opção várias vezes, uma vez para cada tabela. Isso funciona para atualizações entre bancos de dados. Veja a Seção 19.2.5, “Como os Servidores Avaliam as Regras de Filtragem de Replicação”. Você também pode criar tal filtro emitindo uma declaração `CHANGE REPLICATION FILTER REPLICATE_WILD_DO_TABLE`.

Esta opção suporta filtros de replicação específicos de canal, permitindo que réplicas de múltiplas fontes usem filtros específicos para diferentes fontes. Para configurar um filtro de replicação específico de canal em um canal chamado *`channel_1`*, use `--replicate-wild-do-table:channel_1:db_name.tbl_name`. Neste caso, o primeiro dois-pontos é interpretado como um separador e os dois-pontos subsequentes são colchetes literais. Veja a Seção 19.2.5.4, “Filtros Baseados em Canais de Replicação” para mais informações.

Importante

Filtros de replicação globais não podem ser usados em uma instância do servidor MySQL configurada para Replicação por Grupo, porque filtrar transações em alguns servidores tornaria o grupo incapaz de chegar a um acordo sobre um estado consistente. Filtros de replicação específicos de canal podem ser usados em canais de replicação que não estão diretamente envolvidos com a Replicação por Grupo, como quando um membro do grupo também atua como uma réplica para uma fonte que está fora do grupo. Eles não podem ser usados nos canais `group_replication_applier` ou `group_replication_recovery`.

O filtro de replicação especificado pela opção `--replicate-wild-do-table` se aplica a tabelas, visualizações e gatilhos. Ele não se aplica a procedimentos armazenados e funções, ou eventos. Para filtrar instruções que operam sobre esses objetos, use uma ou mais das opções `--replicate-*-db`.

Como exemplo, `--replicate-wild-do-table=foo%.bar` replica apenas as atualizações que usam uma tabela onde o nome do banco de dados começa com `foo` e o nome da tabela começa com `bar`.

Se o padrão do nome da tabela for `%`, ele corresponde a qualquer nome de tabela e a opção também se aplica a instruções de nível de banco de dados (`CREATE DATABASE`, `DROP DATABASE` e `ALTER DATABASE`). Por exemplo, se você usar `--replicate-wild-do-table=foo%.%`, as instruções de nível de banco de dados são replicadas se o nome do banco de dados corresponder ao padrão `foo%`.

Importante

Os filtros de replicação de nível de tabela são aplicados apenas a tabelas que são explicitamente mencionadas e operadas na consulta. Eles não se aplicam a tabelas que são atualizadas implicitamente pela consulta. Por exemplo, uma instrução `GRANT`, que atualiza a tabela `mysql.user` do sistema, mas não menciona essa tabela, não é afetada por um filtro que especifica `mysql.%` como o padrão de wildcard.

Para incluir caracteres wildcard literais nos padrões de nomes de banco de dados ou tabelas, escape-os com uma barra invertida. Por exemplo, para replicar todas as tabelas de um banco de dados chamado `my_own%db`, mas não replicar tabelas do banco de dados `my1ownAABCdb`, você deve escapar os caracteres `_` e `%` assim: `--replicate-wild-do-table=my\_own\%db`. Se você usar a opção na linha de comando, pode ser necessário duplicar as barras invertidas ou cobrir o valor da opção, dependendo do interpretador de comandos. Por exemplo, com o shell **bash**, você precisaria digitar `--replicate-wild-do-table=my\\_own\\%db`.

* `--replicate-wild-ignore-table=db_name.tbl_name`

  <table frame="box" rules="all" summary="Propriedades para max_relay_log_size"><tr><th>Formato de linha de comando</th> <td><code>--max-relay-log-size=#</code></td> </tr><tr><th>Variável do sistema</th> <td><code><a class="link" href="replication-options-replica.html#sysvar_max_relay_log_size">max_relay_log_size</a></code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></code> Dicas de configuração</a> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>0</code></td> </tr><tr><th>Valor mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor máximo</th> <td><code>1073741824</code></td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr><tr><th><a class="link" href="server-system-variables.html#system-variables-block-size" title="Nota">Tamanho do bloco</a></th> <td><code>4096</code></td> </tr></table>

  Cria um filtro de replicação que impede que o thread SQL de replicação replique uma instrução na qual qualquer tabela corresponda ao padrão de wildcard fornecido. Para especificar mais de uma tabela a ser ignorada, use esta opção várias vezes, uma vez para cada tabela. Isso funciona para atualizações entre bancos de dados. Veja a Seção 19.2.5, “Como os servidores avaliam as regras de filtragem de replicação”. Você também pode criar tal filtro emitindo uma declaração `CHANGE REPLICATION FILTER REPLICATE_WILD_IGNORE_TABLE`.

Esta opção suporta filtros de replicação específicos de canal, permitindo que réplicas de várias fontes usem filtros específicos para diferentes fontes. Para configurar um filtro de replicação específico de canal em um canal chamado *`canal_1`*, use `--replicate-wild-ignore:canal_1:nome_do_banco.nome_da_tabela`. Neste caso, o primeiro ponto-e-vírgula é interpretado como um separador e os pontos-e-vírgulas subsequentes são colchetes. Consulte a Seção 19.2.5.4, “Filtros Baseados em Canais de Replicação”, para obter mais informações.

Importante

Filtros de replicação globais não podem ser usados em uma instância do servidor MySQL configurada para Replicação por Grupo, porque filtrar transações em alguns servidores tornaria o grupo incapaz de chegar a um acordo sobre um estado consistente. Filtros de replicação específicos de canal podem ser usados em canais de replicação que não estão diretamente envolvidos com a Replicação por Grupo, como quando um membro do grupo também atua como uma réplica para uma fonte que está fora do grupo. Eles não podem ser usados nos canais `group_replication_applier` ou `group_replication_recovery`.

Como exemplo, `--replicate-wild-ignore-table=foo%.bar%` não replica atualizações que usam uma tabela onde o nome do banco de dados começa com `foo` e o nome da tabela começa com `bar`. Para obter informações sobre como o correspondência funciona, consulte a descrição da opção `--replicate-wild-do-table`. As regras para incluir caracteres curinga literais no valor da opção são as mesmas que para `--replicate-wild-ignore-table`.

Importante

Os filtros de replicação de nível de tabela são aplicados apenas às tabelas que são explicitamente mencionadas e manipuladas na consulta. Eles não se aplicam a tabelas que são atualizadas implicitamente pela consulta. Por exemplo, uma declaração `GRANT`, que atualiza a tabela de sistema `mysql.user`, mas não menciona essa tabela, não é afetada por um filtro que especifica `mysql.%` como o padrão de substituição.

Se você precisar filtrar declarações `GRANT` ou outras declarações administrativas, uma solução possível é usar o filtro `--replicate-ignore-db`. Esse filtro opera na base de dados padrão que está atualmente em vigor, conforme determinado pela declaração `USE`. Portanto, você pode criar um filtro para ignorar declarações para uma base de dados que não é replicada, e então emitir a declaração `USE` para alternar imediatamente para a base de dados padrão antes de emitir quaisquer declarações administrativas que você deseja ignorar. Na declaração administrativa, nomeie a base de dados real onde a declaração é aplicada.

Por exemplo, se `--replicate-ignore-db=nonreplicated` estiver configurado no servidor replica, a seguinte sequência de declarações faz com que a declaração `GRANT` seja ignorada, porque a base de dados padrão `nonreplicated` está em vigor:

```
  USE nonreplicated;
  GRANT SELECT, INSERT ON replicated.t1 TO 'someuser'@'somehost';
  ```4qb9AGdMTz
* `slave_sql_verify_checksum`

<table frame="box" rules="all" summary="Propriedades para replicate-do-table"><tbody><tr><th>Formato de linha de comando</th> <td><code>--replicate-do-table=nome</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

Alias desatualizado para `replica_sql_verify_checksum`.

* `slave_transaction_retries`

<table frame="box" rules="all" summary="Propriedades para replicate-do-table"><tbody><tr><th>Formato de linha de comando</th> <td><code>--replicate-do-table=nome</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

Alias desatualizado para `replica_transaction_retries`.

* `slave_type_conversions`

<table frame="box" rules="all" summary="Propriedades para replicate-do-table">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--replicate-do-table=nome</code></td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>String</td>
  </tr>
  </tbody>
</table>

9

Alias desatualizado para `replica_type_conversions`.

* `sql_replica_skip_counter`

  <table frame="box" rules="all" summary="Propriedades para replicate-ignore-table">
    <tr>
      <th>Formato de Linha de Comando</th>
      <td><code>--replicate-ignore-table=nome</code></td>
    </tr>
    <tr>
      <th>Tipo</th>
      <td>String</td>
    </tr>
  </tbody>
  </table>

0

`sql_replica_skip_counter` especifica o número de eventos da fonte que uma replica deve ignorar. A configuração da opção não tem efeito imediato. A variável aplica-se à próxima instrução `START REPLICA`; a próxima instrução `START REPLICA` também altera o valor de volta para 0. Quando essa variável é configurada para um valor diferente de zero e há vários canais de replicação configurados, a instrução `START REPLICA` só pode ser usada com a cláusula `FOR CHANNEL channel`.

Esta opção é incompatível com a replicação baseada em GTID e não deve ser configurada para um valor diferente de zero quando `gtid_mode=ON` estiver configurado. Se você precisar ignorar transações ao usar GTIDs, use `gtid_executed` da fonte. Se você habilitou a atribuição de GTIDs a transações anônimas usando a opção `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS` da instrução `CHANGE REPLICATION SOURCE TO`, `sql_replica_skip_counter` está disponível. Consulte a Seção 19.1.7.3, “Ignorar Transações”.

Importante

Se ignorar o número de eventos especificados ao definir essa variável causaria que a replica começasse no meio de um grupo de eventos, a replica continua ignorando até encontrar o início do próximo grupo de eventos e começa a partir desse ponto. Para obter mais informações, consulte a Seção 19.1.7.3, “Ignorar Transações”.

* `sql_slave_skip_counter`

  <table frame="box" rules="all" summary="Propriedades para replicate-ignore-table"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--replicate-ignore-table=nome</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Alias desatualizado para `sql_replica_skip_counter`.

* `sync_master_info`

  <table frame="box" rules="all" summary="Propriedades para replicate-ignore-table"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--replicate-ignore-table=nome</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Alias desatualizado para `sync_source_info`.

* `sync_relay_log`

  <table frame="box" rules="all" summary="Propriedades para replicate-ignore-table"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--replicate-ignore-table=nome</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Se o valor dessa variável for maior que 0, o servidor MySQL sincroniza seu log de retransmissão no disco (usando `fdatasync()`) após cada evento `sync_relay_log` ser escrito no log de retransmissão. Definir essa variável tem efeito imediatamente em todos os canais de replicação, incluindo os canais em execução.

Definir `sync_relay_log` para 0 faz com que não haja sincronização no disco; nesse caso, o servidor depende do sistema operacional para limpar o conteúdo do log do retransmissor de tempos em tempos, como qualquer outro arquivo.

Um valor de 1 é a escolha mais segura, pois, em caso de uma parada inesperada, você perde no máximo um evento do log do retransmissor. No entanto, também é a escolha mais lenta (a menos que o disco tenha um cache com bateria, o que torna a sincronização muito rápida). Para obter informações sobre a combinação de configurações em uma replica que é mais resistente a paradas inesperadas, consulte a Seção 19.4.2, “Tratamento de uma Parada Inesperada de uma Replica”.

* `sync_relay_log_info`

  <table frame="box" rules="all" summary="Propriedades para replicate-ignore-table"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--replicate-ignore-table=nome</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  O número de transações após as quais a replica atualiza o repositório de metadados do aplicável. Quando o repositório de metadados do aplicável é armazenado como uma tabela `InnoDB`, que é o padrão, ela é atualizada após cada transação e essa variável do sistema é ignorada. Se o repositório de metadados do aplicável for armazenado como um arquivo (desatualizado), a replica sincroniza seu arquivo `relay-log.info` no disco (usando `fdatasync()`) após esse número de transações. `0` (zero) significa que o conteúdo do arquivo é limpo pelo sistema operacional apenas. A definição dessa variável entra em vigor para todos os canais de replicação imediatamente, incluindo canais em execução.

Como o armazenamento de metadados do aplicador como um arquivo foi descontinuado, essa variável também foi descontinuada, e o servidor emite uma mensagem de alerta sempre que você a define ou lê seu valor. Você deve esperar que `sync_relay_log_info` seja removido em uma versão futura do MySQL e migrar aplicativos que possam depender dela agora.

* `sync_source_info`

  <table frame="box" rules="all" summary="Propriedades para replicate-ignore-table"><tbody><tr><th>Formato de linha de comando</th> <td><code>--replicate-ignore-table=nome</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  `sync_source_info` especifica o número de eventos após os quais a replica atualiza o repositório de metadados de conexão. Quando o repositório de metadados de conexão é armazenado como uma tabela `InnoDB` (o padrão, ela é atualizada após esse número de eventos. Se o repositório de metadados de conexão for armazenado como um arquivo (descontinuado), a replica sincroniza seu arquivo `master.info` no disco (usando `fdatasync()`) após esse número de eventos. O valor padrão é 10000, e um valor zero significa que o repositório nunca é atualizado. Definir essa variável tem efeito imediatamente para todos os canais de replicação, incluindo canais em execução.

* `terminology_use_previous`

  <table frame="box" rules="all" summary="Propriedades para replicate-ignore-table"><tbody><tr><th>Formato de linha de comando</th> <td><code>--replicate-ignore-table=nome</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

Alterações incompatíveis foram feitas no MySQL 8.0 para os nomes de instrumentação que contêm os termos `master`, `slave` e `mts` (para “Multi-Threaded Slave”), que foram alterados, respectivamente, para `source`, `replica` e `mta` (para “Multi-Threaded Applier”). Se essas alterações incompatíveis afetarem suas aplicações, defina `terminology_use_previous` para `BEFORE_8_0_26` para fazer o servidor MySQL usar as versões antigas dos nomes para os objetos especificados na lista anterior. Isso permite que as ferramentas de monitoramento que dependem dos nomes antigos continuem funcionando até que possam ser atualizadas para usar os novos nomes.

O MySQL 9.5 normalmente exibe `REPLICA_SIDE_DISABLED` em vez de `SLAVESIDE_DISABLED` na saída do `SHOW CREATE EVENT`, `SHOW EVENTS` e consultas contra a tabela do Schema de Informações `EVENTS`. Você pode fazer com que `SLAVESIDE_DISABLED` seja exibido em vez disso, definindo `terminology_use_previous` para `BEFORE_8_0_26` ou `BEFORE_8_2_0`.

Defina a variável de sistema `terminology_use_previous` com escopo de sessão para suportar usuários individuais ou com escopo global para ser a padrão para todas as novas sessões. Quando o escopo global é usado, o log de consultas lentas contém as versões antigas dos nomes.

Os nomes de instrumentação afetados estão listados na seguinte tabela. A variável de sistema `terminology_use_previous` afeta apenas esses itens. Não afeta os novos aliases para variáveis de sistema, variáveis de status e opções de linha de comando que também foram introduzidas no MySQL 8.0, e esses ainda podem ser usados quando habilitados.

+ Lâminas instrumentadas (mutexos), visíveis nas tabelas `mutex_instances` e `events_waits_*` do Schema de Desempenho com o prefixo `wait/synch/mutex/`

+ Lâminas de leitura/escrita, visíveis nas tabelas `rwlock_instances` e `events_waits_*` do Schema de Desempenho com o prefixo `wait/synch/rwlock/`

+ Variáveis de condição instrumentadas, visíveis nas tabelas `cond_instances` e `events_waits_*` do Schema de Desempenho com o prefixo `wait/synch/cond/`

+ Alocações de memória instrumentadas, visíveis nas tabelas `memory_summary_*` do Schema de Desempenho com o prefixo `memory/sql/`

+ Nomes de threads, visíveis na tabela `threads` do Schema de Desempenho com o prefixo `thread/sql/`

+ Etapas de threads, visíveis nas tabelas `events_stages_*` do Schema de Desempenho com o prefixo `stage/sql/`, e sem o prefixo nas tabelas `threads` e `processlist` do Schema de Desempenho, o resultado da instrução `SHOW PROCESSLIST`, a tabela `processlist` do Schema de Informação e o log de consultas lentas

+ Comandos de thread, visíveis nas tabelas `events_statements_history*` e `events_statements_summary_*_by_event_name` do Schema de Desempenho com o prefixo `statement/com/`, e sem o prefixo nas tabelas `threads` e `processlist` do Schema de Desempenho, o resultado da instrução `SHOW PROCESSLIST`, a tabela `processlist` do Schema de Informação e o resultado da instrução `SHOW REPLICA STATUS`