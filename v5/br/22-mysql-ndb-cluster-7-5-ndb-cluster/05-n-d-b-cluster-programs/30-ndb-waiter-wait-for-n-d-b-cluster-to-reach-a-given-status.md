### 21.5.30 ndb_waiter — Aguardar que o NDB Cluster Alcance um Status Determinado

[**ndb_waiter**](mysql-cluster-programs-ndb-waiter.html "21.5.30 ndb_waiter — Wait for NDB Cluster to Reach a Given Status") imprime repetidamente (a cada 100 milissegundos) o status de todos os Data Nodes do cluster até que o cluster alcance um status determinado ou o limite de [`--timeout`](mysql-cluster-programs-ndb-waiter.html#option_ndb_waiter_timeout) seja excedido, e então é encerrado. Por padrão, ele aguarda que o cluster atinja o status `STARTED`, no qual todos os Nodes foram iniciados e se conectaram ao cluster. Isso pode ser sobrescrito usando as opções [`--no-contact`](mysql-cluster-programs-ndb-waiter.html#option_ndb_waiter_no-contact) e [`--not-started`](mysql-cluster-programs-ndb-waiter.html#option_ndb_waiter_not-started).

Os estados de Node relatados por esta utilidade são os seguintes:

* `NO_CONTACT`: O Node não pode ser contatado.
* `UNKNOWN`: O Node pode ser contatado, mas seu status ainda é desconhecido. Geralmente, isso significa que o Node recebeu um comando [`START`](mysql-cluster-mgm-client-commands.html#ndbclient-start) ou [`RESTART`](mysql-cluster-mgm-client-commands.html#ndbclient-restart) do Management Server, mas ainda não agiu sobre ele.

* `NOT_STARTED`: O Node foi interrompido, mas permanece em contato com o cluster. Isso é observado ao reiniciar o Node usando o comando `RESTART` do Management Client.

* `STARTING`: O processo [**ndbd**](mysql-cluster-programs-ndbd.html "21.5.1 ndbd — The NDB Cluster Data Node Daemon") do Node foi iniciado, mas o Node ainda não se juntou ao cluster.

* `STARTED`: O Node está operacional e se juntou ao cluster.

* `SHUTTING_DOWN`: O Node está sendo encerrado.
* `SINGLE USER MODE`: Isso é exibido para todos os Data Nodes do cluster quando o cluster está em modo de usuário único (`single user mode`).

As opções que podem ser usadas com [**ndb_waiter**](mysql-cluster-programs-ndb-waiter.html "21.5.30 ndb_waiter — Wait for NDB Cluster to Reach a Given Status") são mostradas na tabela a seguir. Descrições adicionais seguem a tabela.

**Tabela 21.46 Opções de linha de comando usadas com o programa ndb_waiter**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th>Formato</th> <th>Descrição</th> <th>Adicionado, Descontinuado ou Removido</th> </tr></thead><tbody><tr> <th><p> <code> --character-sets-dir=path </code> </p></th> <td>Diretório contendo conjuntos de caracteres</td> <td><p> (Suportado em todos os lançamentos NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --connect-retries=# </code> </p></th> <td>Número de vezes para tentar novamente a conexão antes de desistir</td> <td><p> (Suportado em todos os lançamentos NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --connect-retry-delay=# </code> </p></th> <td>Número de segundos para aguardar entre as tentativas de contato com o Management Server</td> <td><p> (Suportado em todos os lançamentos NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--connect-string=connection_string</code>, </p><p> <code> -c connection_string </code> </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p> (Suportado em todos os lançamentos NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --core-file </code> </p></th> <td>Grava Core File em caso de erro; usado em depuração</td> <td><p> (Suportado em todos os lançamentos NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --defaults-extra-file=path </code> </p></th> <td>Lê o arquivo fornecido após a leitura dos arquivos globais</td> <td><p> (Suportado em todos os lançamentos NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --defaults-file=path </code> </p></th> <td>Lê as opções padrão apenas do arquivo fornecido</td> <td><p> (Suportado em todos os lançamentos NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --defaults-group-suffix=string </code> </p></th> <td>Também lê grupos com concat(grupo, sufixo)</td> <td><p> (Suportado em todos os lançamentos NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--help</code>, </p><p> <code> -? </code> </p></th> <td>Exibe o texto de ajuda e sai</td> <td><p> (Suportado em todos os lançamentos NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --login-path=path </code> </p></th> <td>Lê o caminho fornecido a partir do Login File</td> <td><p> (Suportado em todos os lançamentos NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--ndb-connectstring=connection_string</code>, </p><p> <code> -c connection_string </code> </p></th> <td>Define a Connect String para conexão com ndb_mgmd. Sintaxe: "[nodeid=id;][host=]hostname[:port]". Sobrescreve entradas em NDB_CONNECTSTRING e my.cnf</td> <td><p> (Suportado em todos os lançamentos NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--ndb-mgmd-host=connection_string</code>, </p><p> <code> -c connection_string </code> </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p> (Suportado em todos os lançamentos NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --ndb-nodeid=# </code> </p></th> <td>Define o Node ID para este Node, sobrescrevendo qualquer ID definido por --ndb-connectstring</td> <td><p> (Suportado em todos os lançamentos NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --ndb-optimized-node-selection </code> </p></th> <td>Habilita otimizações para seleção de Nodes para Transactions. Habilitado por padrão; use --skip-ndb-optimized-node-selection para desabilitar</td> <td><p> (Suportado em todos os lançamentos NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--no-contact</code>, </p><p> <code> -n </code> </p></th> <td>Aguarda o cluster atingir o estado NO CONTACT</td> <td><p> (Suportado em todos os lançamentos NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --no-defaults </code> </p></th> <td>Não lê opções padrão de nenhum arquivo de opção além do Login File</td> <td><p> (Suportado em todos os lançamentos NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --not-started </code> </p></th> <td>Aguarda o cluster atingir o estado NOT STARTED</td> <td><p> (Suportado em todos os lançamentos NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --nowait-nodes=list </code> </p></th> <td>Lista de Nodes pelos quais não deve esperar</td> <td><p> (Suportado em todos os lançamentos NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --print-defaults </code> </p></th> <td>Imprime a lista de argumentos do programa e sai</td> <td><p> (Suportado em todos os lançamentos NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --single-user </code> </p></th> <td>Aguarda o cluster entrar em modo de usuário único</td> <td><p> (Suportado em todos os lançamentos NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--timeout=#</code>, </p><p> <code> <a class="link" href="mysql-cluster-programs-ndb-waiter.html#option_ndb_waiter_timeout">-t
                #</a> </code> </p></th> <td>Aguarda esta quantidade de segundos e, em seguida, sai, independentemente de o cluster ter alcançado o estado desejado</td> <td><p> (Suportado em todos os lançamentos NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--usage</code>, </p><p> <code> -? </code> </p></th> <td>Exibe o texto de ajuda e sai; o mesmo que --help</td> <td><p> (Suportado em todos os lançamentos NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--version</code>, </p><p> <code> -V </code> </p></th> <td>Exibe informações de versão e sai</td> <td><p> (Suportado em todos os lançamentos NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--wait-nodes=list</code>, </p><p> <code> -w list </code> </p></th> <td>Lista de Nodes pelos quais deve esperar</td> <td><p> (Suportado em todos os lançamentos NDB baseados no MySQL 5.7) </p></td> </tr></tbody></table>

#### Uso

```sql
ndb_waiter [-c connection_string]
```

#### Opções Adicionais

* `--character-sets-dir`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Diretório contendo conjuntos de caracteres.

* `--connect-retries`

  <table frame="box" rules="all" summary="Propriedades para connect-retries"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>12</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>12</code></td> </tr></tbody></table>

  Número de vezes para tentar novamente a conexão antes de desistir.

* `--connect-retry-delay`

  <table frame="box" rules="all" summary="Propriedades para connect-retry-delay"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--connect-retry-delay=#</code></td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>5</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>5</code></td> </tr></tbody></table>

  Número de segundos para aguardar entre as tentativas de contato com o Management Server.

* `--connect-string`

  <table frame="box" rules="all" summary="Propriedades para connect-string"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--connect-string=connection_string</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  O mesmo que [`--ndb-connectstring`](mysql-cluster-programs-ndb-waiter.html#option_ndb_waiter_ndb-connectstring).

* `--core-file`

  <table frame="box" rules="all" summary="Propriedades para core-file"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--core-file</code></td> </tr></tbody></table>

  Grava Core File em caso de erro; usado em depuração.

* `--defaults-extra-file`

  <table frame="box" rules="all" summary="Propriedades para defaults-extra-file"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--defaults-extra-file=path</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  Lê o arquivo fornecido após a leitura dos arquivos globais.

* `--defaults-file`

  <table frame="box" rules="all" summary="Propriedades para defaults-file"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--defaults-file=path</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  Lê as opções padrão apenas do arquivo fornecido.

* `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Propriedades para defaults-group-suffix"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--defaults-group-suffix=string</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  Também lê grupos com concat(grupo, sufixo).

* `--login-path`

  <table frame="box" rules="all" summary="Propriedades para login-path"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--login-path=path</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  Lê o caminho fornecido a partir do Login File.

* `--help`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Exibe o texto de ajuda e sai.

* `--ndb-connectstring`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Define a Connect String para conexão com ndb_mgmd. Sintaxe: "[nodeid=id;][host=]hostname[:port]". Sobrescreve entradas em NDB_CONNECTSTRING e my.cnf.

* `--ndb-mgmd-host`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  O mesmo que --[`ndb-connectstring`](mysql-cluster-programs-ndb-waiter.html#option_ndb_waiter_ndb-connectstring).

* `--ndb-nodeid`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Define o Node ID para este Node, sobrescrevendo qualquer ID definido por [`--ndb-connectstring`](mysql-cluster-programs-ndb-waiter.html#option_ndb_waiter_ndb-connectstring).

* `--ndb-optimized-node-selection`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Habilita otimizações para seleção de Nodes para Transactions. Habilitado por padrão; use `--skip-ndb-optimized-node-selection` para desabilitar.

* `--no-contact`, `-n`

  Em vez de aguardar o estado `STARTED`, [**ndb_waiter**](mysql-cluster-programs-ndb-waiter.html "21.5.30 ndb_waiter — Wait for NDB Cluster to Reach a Given Status") continua em execução até que o cluster atinja o status `NO_CONTACT` antes de ser encerrado.

* `--no-defaults`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Não lê opções padrão de nenhum arquivo de opção além do Login File.

* `--not-started`

  Em vez de aguardar o estado `STARTED`, [**ndb_waiter**](mysql-cluster-programs-ndb-waiter.html "21.5.30 ndb_waiter — Wait for NDB Cluster to Reach a Given Status") continua em execução até que o cluster atinja o status `NOT_STARTED` antes de ser encerrado.

* `--nowait-nodes=list`

  Quando esta opção é usada, [**ndb_waiter**](mysql-cluster-programs-ndb-waiter.html "21.5.30 ndb_waiter — Wait for NDB Cluster to Reach a Given Status") não aguarda pelos Nodes cujos IDs estão listados. A lista é delimitada por vírgulas; *ranges* podem ser indicados por hífens, conforme mostrado aqui:

  ```sql
  $> ndb_waiter --nowait-nodes=1,3,7-9
  ```

  Importante

  *Não* use esta opção em conjunto com a opção [`--wait-nodes`](mysql-cluster-programs-ndb-waiter.html#option_ndb_waiter_wait-nodes).

* `--print-defaults`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Imprime a lista de argumentos do programa e sai.

* `--timeout=seconds`, `-t seconds`

  Tempo de espera. O programa é encerrado se o estado desejado não for alcançado dentro deste número de segundos. O padrão é 120 segundos (1200 ciclos de relatório).

* `--single-user`

  O programa aguarda o cluster entrar em modo de usuário único.

* `--usage`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Exibe o texto de ajuda e sai; o mesmo que [`--help`](mysql-cluster-programs-ndb-waiter.html#option_ndb_waiter_help).

* `--version`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Exibe informações de versão e sai.

* `--wait-nodes=list`, `-w list`

  Quando esta opção é usada, [**ndb_waiter**](mysql-cluster-programs-ndb-waiter.html "21.5.30 ndb_waiter — Wait for NDB Cluster to Reach a Given Status") aguarda apenas pelos Nodes cujos IDs estão listados. A lista é delimitada por vírgulas; *ranges* podem ser indicados por hífens, conforme mostrado aqui:

  ```sql
  $> ndb_waiter --wait-nodes=2,4-6,10
  ```

  Importante

  *Não* use esta opção em conjunto com a opção [`--nowait-nodes`](mysql-cluster-programs-ndb-waiter.html#option_ndb_waiter_nowait-nodes).

**Exemplo de Saída.** É mostrada aqui a saída de [**ndb_waiter**](mysql-cluster-programs-ndb-waiter.html "21.5.30 ndb_waiter — Wait for NDB Cluster to Reach a Given Status") quando executado contra um cluster de 4 Nodes no qual dois Nodes foram encerrados e depois iniciados novamente de forma manual. Relatórios duplicados (indicados por `...`) são omitidos.

```sql
$> ./ndb_waiter -c localhost

Connecting to mgmsrv at (localhost)
State node 1 STARTED
State node 2 NO_CONTACT
State node 3 STARTED
State node 4 NO_CONTACT
Waiting for cluster enter state STARTED

...

State node 1 STARTED
State node 2 UNKNOWN
State node 3 STARTED
State node 4 NO_CONTACT
Waiting for cluster enter state STARTED

...

State node 1 STARTED
State node 2 STARTING
State node 3 STARTED
State node 4 NO_CONTACT
Waiting for cluster enter state STARTED

...

State node 1 STARTED
State node 2 STARTING
State node 3 STARTED
State node 4 UNKNOWN
Waiting for cluster enter state STARTED

...

State node 1 STARTED
State node 2 STARTING
State node 3 STARTED
State node 4 STARTING
Waiting for cluster enter state STARTED

...

State node 1 STARTED
State node 2 STARTED
State node 3 STARTED
State node 4 STARTING
Waiting for cluster enter state STARTED

...

State node 1 STARTED
State node 2 STARTED
State node 3 STARTED
State node 4 STARTED
Waiting for cluster enter state STARTED
```

Nota

Se nenhuma Connect String for especificada, então [**ndb_waiter**](mysql-cluster-programs-ndb-waiter.html "21.5.30 ndb_waiter — Wait for NDB Cluster to Reach a Given Status") tenta se conectar a um Management Server em `localhost` e relata `Connecting to mgmsrv at (null)`.

Antes do NDB 7.5.18 e 7.6.14, este programa imprimia `NDBT_ProgramExit - status` após a conclusão de sua execução, devido a uma dependência desnecessária da biblioteca de testes NDBT. Essa dependência foi removida, eliminando a saída supérflua.