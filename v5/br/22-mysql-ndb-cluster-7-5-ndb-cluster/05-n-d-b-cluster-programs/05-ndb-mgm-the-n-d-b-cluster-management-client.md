### 21.5.5 ndb_mgm — O cliente de gerenciamento de cluster NDB

O processo do cliente de gerenciamento **ndb_mgm** não é realmente necessário para executar o clúster. Seu valor reside em fornecer um conjunto de comandos para verificar o status do clúster, iniciar backups e realizar outras funções administrativas. O cliente de gerenciamento acessa o servidor de gerenciamento usando uma API C. Usuários avançados também podem usar essa API para programar processos de gerenciamento dedicados para realizar tarefas semelhantes às executadas por **ndb_mgm**.

Para iniciar o cliente de gerenciamento, é necessário fornecer o nome do host e o número de porta do servidor de gerenciamento:

```sql
$> ndb_mgm [host_name [port_num
```

Por exemplo:

```sql
$> ndb_mgm ndb_mgmd.mysql.com 1186
```

O nome de host padrão e o número de porta são `localhost` e 1186, respectivamente.

As opções que podem ser usadas com **ndb_mgm** estão mostradas na tabela a seguir. Descrições adicionais seguem a tabela.

**Tabela 21.25 Opções de linha de comando usadas com o programa ndb_mgm**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th>Formato</th> <th>Descrição</th> <th>Adicionado, Descontinuado ou Removido</th> </tr></thead><tbody><tr> <th><p> PH_HTML_CODE_<code>--help</code>] </p></th> <td>Diretório contendo conjuntos de caracteres</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> PH_HTML_CODE_<code>--help</code>] </p></th> <td>Número de segundos para esperar entre as tentativas de contato com o servidor de gerenciamento</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p>PH_HTML_CODE_<code> --login-path=path </code>],</p><p> PH_HTML_CODE_<code>--ndb-connectstring=connection_string</code>] </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> PH_HTML_CODE_<code> -c connection_string </code>] </p></th> <td>Escreva o arquivo de núcleo em erro; usado no depuração</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> PH_HTML_CODE_<code>--ndb-mgmd-host=connection_string</code>] </p></th> <td>Leia o arquivo fornecido após os arquivos globais terem sido lidos</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> PH_HTML_CODE_<code> -c connection_string </code>] </p></th> <td>Ler opções padrão a partir do arquivo fornecido apenas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> PH_HTML_CODE_<code> --ndb-nodeid=# </code>] </p></th> <td>Leia também grupos com concatenação(grupo, sufixo)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p>PH_HTML_CODE_<code> --ndb-optimized-node-selection </code>],</p><p> PH_HTML_CODE_<code> --no-defaults </code>] </p></th> <td>Execute o comando e saia</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p><code>--help</code>,</p><p> <code> --connect-retry-delay=# </code><code>--help</code>] </p></th> <td>Exibir texto de ajuda e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> <code> --login-path=path </code> </p></th> <td>Leia o caminho fornecido a partir do arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p><code>--ndb-connectstring=connection_string</code>,</p><p> <code> -c connection_string </code> </p></th> <td>Defina a string de conexão para se conectar ao ndb_mgmd. Sintaxe: "[nodeid=id;][host=]hostname[:por<code>--help</code>". Substitui as entradas no NDB_CONNECTSTRING e no my.cnf</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p><code>--ndb-mgmd-host=connection_string</code>,</p><p> <code> -c connection_string </code> </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> <code> --ndb-nodeid=# </code> </p></th> <td>Defina o ID do nó para este nó, substituindo qualquer ID definida pela opção --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> <code> --ndb-optimized-node-selection </code> </p></th> <td>Ative as otimizações para a seleção de nós para transações. Ativado por padrão; use --skip-ndb-optimized-node-selection para desativá-lo</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> <code> --no-defaults </code> </p></th> <td>Não leia as opções padrão de nenhum arquivo de opção, exceto o arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> <code>--connect-string=connection_string</code><code>--help</code>] </p></th> <td>Imprimir a lista de argumentos do programa e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p><code>--connect-string=connection_string</code><code>--help</code>],</p><p> <code>--connect-string=connection_string</code><code> --login-path=path </code>] </p></th> <td>Defina o número de vezes para tentar a conexão novamente antes de desistir; sinônimo de --connect-retries</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p><code>--connect-string=connection_string</code><code>--ndb-connectstring=connection_string</code>],</p><p> <code>--connect-string=connection_string</code><code> -c connection_string </code>] </p></th> <td>Exibir texto de ajuda e sair; o mesmo que --help</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p><code>--connect-string=connection_string</code><code>--ndb-mgmd-host=connection_string</code>],</p><p> <code>--connect-string=connection_string</code><code> -c connection_string </code>] </p></th> <td>Exibir informações da versão e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody></table>

- `--character-sets-dir`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Diretório contendo conjuntos de caracteres.

- `--connect-retries=#`

  <table frame="box" rules="all" summary="Propriedades para tentativas de conexão de reposição"><tbody><tr><th>Formato de linha de comando</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td><code>3</code></td> </tr><tr><th>Valor mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor máximo</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Esta opção especifica o número de vezes que a conexão será retente após a primeira tentativa de conexão antes de ser abandonada (o cliente sempre tenta a conexão pelo menos uma vez). O tempo de espera por tentativa é definido usando `--connect-retry-delay`.

  Esta opção é sinônima da opção `--try-reconnect`, que agora está desatualizada.

- `--connect-retry-delay`

  <table frame="box" rules="all" summary="Propriedades para connect-retry-delay"><tbody><tr><th>Formato de linha de comando</th> <td><code>--connect-retry-delay=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>5</code></td> </tr><tr><th>Valor mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor máximo</th> <td><code>5</code></td> </tr></tbody></table>

  Número de segundos para esperar entre as tentativas de contato com o servidor de gerenciamento.

- `--connect-string`

  <table frame="box" rules="all" summary="Propriedades para a string de conexão"><tbody><tr><th>Formato de linha de comando</th> <td><code>--connect-string=connection_string</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  O mesmo que `--ndb-connectstring`.

- `--core-file`

  <table frame="box" rules="all" summary="Propriedades para arquivo de núcleo"><tbody><tr><th>Formato de linha de comando</th> <td><code>--core-file</code></td> </tr></tbody></table>

  Escreva o arquivo de núcleo em erro; usado no depuração.

- `--defaults-extra-file`

  <table frame="box" rules="all" summary="Propriedades para defaults-extra-file"><tbody><tr><th>Formato de linha de comando</th> <td><code>--defaults-extra-file=path</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  Leia o arquivo fornecido após a leitura dos arquivos globais.

- `--defaults-file`

  <table frame="box" rules="all" summary="Propriedades para arquivo de falhas"><tbody><tr><th>Formato de linha de comando</th> <td><code>--defaults-file=path</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  Leia as opções padrão do arquivo fornecido.

- `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Propriedades para defaults-group-suffix"><tbody><tr><th>Formato de linha de comando</th> <td><code>--defaults-group-suffix=string</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  Leia também grupos com concatenação (grupo, sufixo).

- `--execute=command`, `-e command`

  <table frame="box" rules="all" summary="Propriedades para executar"><tbody><tr><th>Formato de linha de comando</th> <td><code>--execute=command</code></td> </tr></tbody></table>

  Essa opção pode ser usada para enviar um comando ao cliente de gerenciamento do NDB Cluster a partir do shell do sistema. Por exemplo, qualquer uma das seguintes opções é equivalente à execução de `SHOW` no cliente de gerenciamento:

  ```sql
  $> ndb_mgm -e "SHOW"

  $> ndb_mgm --execute="SHOW"
  ```

  Isso é análogo ao modo como a opção `--execute` ou `-e` funciona com o cliente de linha de comando **mysql**. Veja Seção 4.2.2.1, “Usando Opções na Linha de Comando”.

  Nota

  Se o comando do cliente de gerenciamento a ser passado usando essa opção contiver caracteres de espaço, então o comando *deve* ser fechado entre aspas. Pode-se usar aspas simples ou duplas. Se o comando do cliente de gerenciamento não contiver caracteres de espaço, as aspas são opcionais.

- `--help`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Exibir texto de ajuda e sair.

- `--login-path`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Leia o caminho fornecido a partir do arquivo de login.

- `--ndb-connectstring`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Defina a string de conexão para se conectar ao **ndb_mgmd**. Sintaxe: [`nodeid=id;`][`host=`]`hostname`[`:port`]. Substitui as entradas em `NDB_CONNECTSTRING` e `my.cnf`.

- `--ndb-mgmd-host`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  O mesmo que `--ndb-connectstring`.

- `--ndb-nodeid`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Defina o ID do nó para este nó, substituindo qualquer ID definida por `--ndb-connectstring`.

- `--ndb-optimized-node-selection`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Ative as otimizações para a seleção de nós para transações. Ativado por padrão; use `--skip-ndb-optimized-node-selection` para desativá-lo.

- `--no-defaults`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Não leia as opções padrão de nenhum arquivo de opção, exceto o arquivo de login.

- `--print-defaults`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Imprima a lista de argumentos do programa e saia.

- `--try-reconnect=número`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Se a conexão com o servidor de gerenciamento for interrompida, o nó tenta reconectar-se a ele a cada 5 segundos até conseguir. Ao usar essa opção, é possível limitar o número de tentativas a *`número`* antes de desistir e relatar um erro.

  Esta opção está desatualizada e está sujeita à remoção em uma futura versão. Use `--connect-retries`, em vez disso.

- `--usage`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Exibir texto de ajuda e sair; o mesmo que `--help`.

- `--version`

  <table frame="box" rules="all" summary="Propriedades para tentativas de conexão de reposição"><tbody><tr><th>Formato de linha de comando</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td><code>3</code></td> </tr><tr><th>Valor mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor máximo</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Exibir informações da versão e sair.

Informações adicionais sobre o uso do **ndb_mgm** podem ser encontradas em Seção 21.6.1, “Comandos no Cliente de Gerenciamento do NDB Cluster”.
