### 21.5.5 ndb_mgm — O Client de Gerenciamento do NDB Cluster

O processo do Client de gerenciamento [**ndb_mgm**](mysql-cluster-programs-ndb-mgm.html "21.5.5 ndb_mgm — O Client de Gerenciamento do NDB Cluster") não é estritamente necessário para executar o cluster. Seu valor reside em fornecer um conjunto de comandos para verificar o status do cluster, iniciar Backups e executar outras funções administrativas. O management client acessa o management server usando uma API C. Usuários avançados também podem empregar essa API para programar processos de gerenciamento dedicados para executar tarefas semelhantes às realizadas por [**ndb_mgm**](mysql-cluster-programs-ndb-mgm.html "21.5.5 ndb_mgm — O Client de Gerenciamento do NDB Cluster").

Para iniciar o management client, é necessário fornecer o Host Name e o Port Number do management server:

```sql
$> ndb_mgm [host_name [port_num
```

Por exemplo:

```sql
$> ndb_mgm ndb_mgmd.mysql.com 1186
```

O Host Name e Port Number padrão são `localhost` e 1186, respectivamente.

As opções que podem ser usadas com [**ndb_mgm**](mysql-cluster-programs-ndb-mgm.html "21.5.5 ndb_mgm — O Client de Gerenciamento do NDB Cluster") são mostradas na tabela a seguir. Descrições adicionais seguem a tabela.

**Tabela 21.25 Opções de linha de comando usadas com o programa ndb_mgm**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th>Formato</th> <th>Descrição</th> <th>Adicionado, Descontinuado ou Removido</th> </tr></thead><tbody><tr> <th><p> <code> --character-sets-dir=path </code> </p></th> <td>Diretório contendo character sets</td> <td><p> (Suportado em todas as releases NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --connect-retry-delay=# </code> </p></th> <td>Número de segundos para esperar entre as tentativas de contato com o management server</td> <td><p> (Suportado em todas as releases NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--connect-string=connection_string</code>, </p><p> <code> -c connection_string </code> </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p> (Suportado em todas as releases NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --core-file </code> </p></th> <td>Escrever core file em caso de erro; usado em debugging</td> <td><p> (Suportado em todas as releases NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --defaults-extra-file=path </code> </p></th> <td>Ler arquivo fornecido após a leitura dos arquivos globais</td> <td><p> (Suportado em todas as releases NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --defaults-file=path </code> </p></th> <td>Ler opções padrão somente do arquivo fornecido</td> <td><p> (Suportado em todas as releases NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --defaults-group-suffix=string </code> </p></th> <td>Também lê grupos com concat(group, sufixo)</td> <td><p> (Suportado em todas as releases NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--execute=command</code>, </p><p> <code> -e command </code> </p></th> <td>Executa o command e sai</td> <td><p> (Suportado em todas as releases NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--help</code>, </p><p> <code> -? </code> </p></th> <td>Exibe o texto de ajuda e sai</td> <td><p> (Suportado em todas as releases NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --login-path=path </code> </p></th> <td>Lê o caminho fornecido a partir do login file</td> <td><p> (Suportado em todas as releases NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--ndb-connectstring=connection_string</code>, </p><p> <code> -c connection_string </code> </p></th> <td>Define a connect string para conexão com o ndb_mgmd. Sintaxe: "[nodeid=id;][host=]hostname[:port]". Sobrescreve entradas em NDB_CONNECTSTRING e my.cnf</td> <td><p> (Suportado em todas as releases NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--ndb-mgmd-host=connection_string</code>, </p><p> <code> -c connection_string </code> </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p> (Suportado em todas as releases NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --ndb-nodeid=# </code> </p></th> <td>Define o Node ID para este node, sobrescrevendo qualquer ID definido por --ndb-connectstring</td> <td><p> (Suportado em todas as releases NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --ndb-optimized-node-selection </code> </p></th> <td>Habilita otimizações para seleção de nodes para transactions. Habilitado por padrão; use --skip-ndb-optimized-node-selection para desabilitar</td> <td><p> (Suportado em todas as releases NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --no-defaults </code> </p></th> <td>Não lê opções padrão de nenhum option file além do login file</td> <td><p> (Suportado em todas as releases NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --print-defaults </code> </p></th> <td>Imprime a lista de argumentos do programa e sai</td> <td><p> (Suportado em todas as releases NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--try-reconnect=#</code>, </p><p> <code> <a class="link" href="mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_try-reconnect">-t
                #</a> </code> </p></th> <td>Define o número de vezes para tentar reconectar antes de desistir; sinônimo de --connect-retries</td> <td><p> (Suportado em todas as releases NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--usage</code>, </p><p> <code> -? </code> </p></th> <td>Exibe o texto de ajuda e sai; o mesmo que --help</td> <td><p> (Suportado em todas as releases NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--version</code>, </p><p> <code> -V </code> </p></th> <td>Exibe as informações de versão e sai</td> <td><p> (Suportado em todas as releases NDB baseadas no MySQL 5.7) </p></td> </tr></tbody></table>

* `--character-sets-dir`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Diretório contendo character sets.

* `--connect-retries=#`

  <table frame="box" rules="all" summary="Properties for connect-retries"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor Padrão</th> <td><code>3</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Esta opção especifica o número de vezes, após a primeira tentativa, que a conexão deve ser repetida antes de desistir (o Client sempre tenta a conexão pelo menos uma vez). O tempo de espera por tentativa é definido usando [`--connect-retry-delay`](mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_connect-retry-delay).

  Esta opção é sinônima da opção [`--try-reconnect`](mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_try-reconnect), que agora está descontinuada.

* `--connect-retry-delay`

  <table frame="box" rules="all" summary="Properties for connect-retry-delay"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--connect-retry-delay=#</code></td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>5</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>5</code></td> </tr></tbody></table>

  Número de segundos para esperar entre as tentativas de contato com o management server.

* `--connect-string`

  <table frame="box" rules="all" summary="Properties for connect-string"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--connect-string=connection_string</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  O mesmo que [`--ndb-connectstring`](mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_ndb-connectstring).

* `--core-file`

  <table frame="box" rules="all" summary="Properties for core-file"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--core-file</code></td> </tr></tbody></table>

  Escreve core file em caso de erro; usado em debugging.

* `--defaults-extra-file`

  <table frame="box" rules="all" summary="Properties for defaults-extra-file"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--defaults-extra-file=path</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  Lê o arquivo fornecido após a leitura dos arquivos globais.

* `--defaults-file`

  <table frame="box" rules="all" summary="Properties for defaults-file"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--defaults-file=path</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  Lê as opções padrão somente do arquivo fornecido.

* `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Properties for defaults-group-suffix"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--defaults-group-suffix=string</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  Também lê grupos com concat(group, suffix).

* `--execute=command`, `-e command`

  <table frame="box" rules="all" summary="Properties for execute"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--execute=command</code></td> </tr></tbody></table>

  Esta opção pode ser usada para enviar um command para o NDB Cluster management client a partir do shell do sistema. Por exemplo, qualquer um dos comandos a seguir é equivalente à execução de [`SHOW`](mysql-cluster-mgm-client-commands.html#ndbclient-show) no management client:

  ```sql
  $> ndb_mgm -e "SHOW"

  $> ndb_mgm --execute="SHOW"
  ```

  Isso é análogo a como a opção [`--execute`](mysql-command-options.html#option_mysql_execute) ou `-e` funciona com o Client de linha de comando [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client"). Consulte [Section 4.2.2.1, “Using Options on the Command Line”](command-line-options.html "4.2.2.1 Using Options on the Command Line").

  Nota

  Se o command do management client a ser passado usando esta opção contiver qualquer caractere de espaço, o command *deve* ser colocado entre aspas. Podem ser usadas aspas simples ou duplas. Se o command do management client não contiver caracteres de espaço, as aspas são opcionais.

* `--help`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Exibe o texto de ajuda e sai.

* `--login-path`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Lê o caminho fornecido a partir do login file.

* `--ndb-connectstring`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Define a connect string para conexão com [**ndb_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon"). Sintaxe: [`nodeid=id;`][`host=`]`hostname`[`:port`]. Sobrescreve entradas em `NDB_CONNECTSTRING` e `my.cnf`.

* `--ndb-mgmd-host`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  O mesmo que [`--ndb-connectstring`](mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_ndb-connectstring).

* `--ndb-nodeid`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Define o Node ID para este node, sobrescrevendo qualquer ID definido por [`--ndb-connectstring`](mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_ndb-connectstring).

* `--ndb-optimized-node-selection`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Habilita otimizações para seleção de nodes para transactions. Habilitado por padrão; use `--skip-ndb-optimized-node-selection` para desabilitar.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Não lê opções padrão de nenhum option file além do login file.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Imprime a lista de argumentos do programa e sai.

* `--try-reconnect=number`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Se a conexão com o management server for interrompida, o node tenta reconectar a ele a cada 5 segundos até ter sucesso. Ao usar esta opção, é possível limitar o número de tentativas para *`number`* antes de desistir e reportar um erro.

  Esta opção está descontinuada e sujeita à remoção em um release futuro. Use [`--connect-retries`](mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_connect-retries) em vez disso.

* `--usage`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Exibe o texto de ajuda e sai; o mesmo que [`--help`](mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_help).

* `--version`

  <table frame="box" rules="all" summary="Properties for connect-retries"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor Padrão</th> <td><code>3</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Exibe as informações de versão e sai.

Informações adicionais sobre o uso de [**ndb_mgm**](mysql-cluster-programs-ndb-mgm.html "21.5.5 ndb_mgm — O Client de Gerenciamento do NDB Cluster") podem ser encontradas em [Section 21.6.1, “Commands in the NDB Cluster Management Client”](mysql-cluster-mgm-client-commands.html "21.6.1 Commands in the NDB Cluster Management Client").