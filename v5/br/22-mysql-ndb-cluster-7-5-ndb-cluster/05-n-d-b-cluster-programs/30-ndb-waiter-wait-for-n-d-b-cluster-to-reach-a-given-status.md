### 21.5.30 ndb_waiter — Aguarde o NDB Cluster atingir um status específico

**ndb_waiter** imprime repetidamente (a cada 100 milissegundos) o status de todos os nós de dados do cluster até que o cluster atinja um status específico ou o limite da opção `--timeout` seja excedido, e então o programa saia. Por padrão, ele aguarda que o cluster atinja o status `STARTED`, em que todos os nós tenham iniciado e se conectado ao cluster. Isso pode ser desconsiderado usando as opções `--no-contact` e `--not-started`.

Os estados do nó reportados por este utilitário são os seguintes:

- `NO_CONTACT`: O nó não pode ser contatado.

- `DESCONHECIDO`: O nó pode ser contatado, mas seu status ainda não é conhecido. Geralmente, isso significa que o nó recebeu o comando `START` ou `RESTART` do servidor de gerenciamento, mas ainda não agiu sobre ele.

- `NOT_STARTED`: O nó parou, mas continua em contato com o clúster. Isso é observado ao reiniciar o nó usando o comando `RESTART` do cliente de gerenciamento.

- `INICIANDO`: O processo do nó **ndbd** foi iniciado, mas o nó ainda não se juntou ao clúster.

- `INICIADO`: O nó está operacional e se juntou ao clúster.

- `SHUTTING_DOWN`: O nó está sendo desligado.

- `MODO DE ÚLTIMO USUÁRIO`: Isso é exibido para todos os nós de dados do clúster quando o clúster estiver no modo de único usuário.

As opções que podem ser usadas com **ndb_waiter** estão mostradas na tabela a seguir. Descrições adicionais seguem a tabela.

**Tabela 21.46 Opções de linha de comando usadas com o programa ndb_waiter**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th>Formato</th> <th>Descrição</th> <th>Adicionado, Descontinuado ou Removido</th> </tr></thead><tbody><tr> <th><p> [[PH_HTML_CODE_<code> -? </code>] </p></th> <td>Diretório contendo conjuntos de caracteres</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> [[PH_HTML_CODE_<code> -? </code>] </p></th> <td>Número de vezes para tentar a conexão novamente antes de desistir</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> [[PH_HTML_CODE_<code>--ndb-connectstring=connection_string</code>] </p></th> <td>Número de segundos para esperar entre as tentativas de contato com o servidor de gerenciamento</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p>[[PH_HTML_CODE_<code> -c connection_string </code>],</p><p> [[PH_HTML_CODE_<code>--ndb-mgmd-host=connection_string</code>] </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> [[PH_HTML_CODE_<code> -c connection_string </code>] </p></th> <td>Escreva o arquivo de núcleo em erro; usado no depuração</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> [[PH_HTML_CODE_<code> --ndb-nodeid=# </code>] </p></th> <td>Leia o arquivo fornecido após os arquivos globais terem sido lidos</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> [[PH_HTML_CODE_<code> --ndb-optimized-node-selection </code>] </p></th> <td>Ler opções padrão a partir do arquivo fornecido apenas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> [[PH_HTML_CODE_<code>--no-contact</code>] </p></th> <td>Leia também grupos com concatenação(grupo, sufixo)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p>[[PH_HTML_CODE_<code> -n </code>],</p><p> [[<code> -? </code>]] </p></th> <td>Exibir texto de ajuda e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --connect-retries=# </code><code> -? </code>] </p></th> <td>Leia o caminho fornecido a partir do arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code>--ndb-connectstring=connection_string</code>]],</p><p> [[<code> -c connection_string </code>]] </p></th> <td>Defina a string de conexão para se conectar ao ndb_mgmd. Sintaxe: "[nodeid=id;][host=]hostname[:por<code> -? </code>". Substitui as entradas no NDB_CONNECTSTRING e no my.cnf</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code>--ndb-mgmd-host=connection_string</code>]],</p><p> [[<code> -c connection_string </code>]] </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --ndb-nodeid=# </code>]] </p></th> <td>Defina o ID do nó para este nó, substituindo qualquer ID definida pela opção --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --ndb-optimized-node-selection </code>]] </p></th> <td>Ative as otimizações para a seleção de nós para transações. Ativado por padrão; use --skip-ndb-optimized-node-selection para desativá-lo</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code>--no-contact</code>]],</p><p> [[<code> -n </code>]] </p></th> <td>Aguarde até o cluster atingir o estado de "sem contato"</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --connect-retry-delay=# </code><code> -? </code>] </p></th> <td>Não leia as opções padrão de nenhum arquivo de opção, exceto o arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --connect-retry-delay=# </code><code> -? </code>] </p></th> <td>Aguarde o cluster atingir o estado NÃO INICIADO</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --connect-retry-delay=# </code><code>--ndb-connectstring=connection_string</code>] </p></th> <td>Lista de nós que não devem ser aguardados</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --connect-retry-delay=# </code><code> -c connection_string </code>] </p></th> <td>Imprimir a lista de argumentos do programa e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --connect-retry-delay=# </code><code>--ndb-mgmd-host=connection_string</code>] </p></th> <td>Aguarde o cluster entrar no modo de usuário único</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code> --connect-retry-delay=# </code><code> -c connection_string </code>],</p><p> [[<code> --connect-retry-delay=# </code><code> --ndb-nodeid=# </code>] </p></th> <td>Aguarde esses segundos e, em seguida, saia, independentemente de o cluster ter atingido o estado desejado ou</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code> --connect-retry-delay=# </code><code> --ndb-optimized-node-selection </code>],</p><p> [[<code> --connect-retry-delay=# </code><code>--no-contact</code>] </p></th> <td>Exibir texto de ajuda e sair; o mesmo que --help</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code> --connect-retry-delay=# </code><code> -n </code>],</p><p> [[<code>--connect-string=connection_string</code><code> -? </code>] </p></th> <td>Exibir informações da versão e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code>--connect-string=connection_string</code><code> -? </code>],</p><p> [[<code>--connect-string=connection_string</code><code>--ndb-connectstring=connection_string</code>] </p></th> <td>Lista de nós a serem aguardados</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody></table>

#### Uso

```sql
ndb_waiter [-c connection_string]
```

#### Opções adicionais

- `--character-sets-dir`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr></tbody></table>

  Diretório contendo conjuntos de caracteres.

- `--connect-retries`

  <table frame="box" rules="all" summary="Propriedades para tentativas de conexão de reposição"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--connect-retries=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>12</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>12</code>]]</td> </tr></tbody></table>

  Número de vezes para tentar a conexão novamente antes de desistir.

- `--connect-retry-delay`

  <table frame="box" rules="all" summary="Propriedades para connect-retry-delay"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--connect-retry-delay=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>5</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>5</code>]]</td> </tr></tbody></table>

  Número de segundos para esperar entre as tentativas de contato com o servidor de gerenciamento.

- `--connect-string`

  <table frame="box" rules="all" summary="Propriedades para a string de conexão"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--connect-string=connection_string</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>

  O mesmo que `--ndb-connectstring`.

- `--core-file`

  <table frame="box" rules="all" summary="Propriedades para arquivo de núcleo"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--core-file</code>]]</td> </tr></tbody></table>

  Escreva o arquivo de núcleo em erro; usado no depuração.

- `--defaults-extra-file`

  <table frame="box" rules="all" summary="Propriedades para defaults-extra-file"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--defaults-extra-file=path</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>

  Leia o arquivo fornecido após a leitura dos arquivos globais.

- `--defaults-file`

  <table frame="box" rules="all" summary="Propriedades para arquivo de falhas"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--defaults-file=path</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>

  Leia as opções padrão do arquivo fornecido.

- `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Propriedades para defaults-group-suffix"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--defaults-group-suffix=string</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>

  Leia também grupos com concatenação (grupo, sufixo).

- `--login-path`

  <table frame="box" rules="all" summary="Propriedades para o caminho de login"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--login-path=path</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>

  Leia o caminho fornecido a partir do arquivo de login.

- `--help`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr></tbody></table>

  Exibir texto de ajuda e sair.

- `--ndb-connectstring`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr></tbody></table>

  Defina a string de conexão para se conectar ao ndb_mgmd. Sintaxe: "[nodeid=id;][host=]hostname[:port]". Oculte entradas no NDB_CONNECTSTRING e no my.cnf.

- `--ndb-mgmd-host`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr></tbody></table>

  O mesmo que --`ndb-connectstring`.

- `--ndb-nodeid`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr></tbody></table>

  Defina o ID do nó para este nó, substituindo qualquer ID definida por `--ndb-connectstring`.

- `--ndb-optimized-node-selection`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr></tbody></table>

  Ative as otimizações para a seleção de nós para transações. Ativado por padrão; use `--skip-ndb-optimized-node-selection` para desativá-lo.

- `--no-contact`, `-n`

  Em vez de esperar pelo estado `STARTED`, o **ndb_waiter** continua rodando até que o clúster atinja o status `NO_CONTACT` antes de sair.

- `--no-defaults`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr></tbody></table>

  Não leia as opções padrão de nenhum arquivo de opção, exceto o arquivo de login.

- `--not-started`

  Em vez de esperar pelo estado `STARTED`, o **ndb_waiter** continua rodando até que o clúster atinja o status `NOT_STARTED` antes de sair.

- `--nowait-nodes=list`

  Quando esta opção é usada, o **ndb_waiter** não aguarda os nós cujos IDs estão listados. A lista é delimitada por vírgulas; os intervalos podem ser indicados por traços, como mostrado aqui:

  ```sql
  $> ndb_waiter --nowait-nodes=1,3,7-9
  ```

  Importante

  Não use esta opção junto com a opção `--wait-nodes`.

- `--print-defaults`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr></tbody></table>

  Imprima a lista de argumentos do programa e saia.

- `--timeout=segundos`, `-t segundos`

  É hora de esperar. O programa sai se o estado desejado não for alcançado dentro deste número de segundos. O padrão é de 120 segundos (1200 ciclos de relatório).

- `--single-user`

  O programa aguarda que o clúster entre no modo de usuário único.

- `--usage`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr></tbody></table>

  Exibir texto de ajuda e sair; o mesmo que `--help`.

- `--version`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr></tbody></table>

  Exibir informações da versão e sair.

- `--wait-nodes=list`, `-w list`

  Quando essa opção é usada, o **ndb_waiter** aguarda apenas pelos nós cujos IDs estão listados. A lista é delimitada por vírgulas; os intervalos podem ser indicados por traços, como mostrado aqui:

  ```sql
  $> ndb_waiter --wait-nodes=2,4-6,10
  ```

  Importante

  Não use esta opção junto com a opção `--nowait-nodes`.

**Saída de exemplo.** A saída do **ndb_waiter** é mostrada aqui quando executado em um clúster de 4 nós, nos quais dois nós foram desligados e depois reiniciados manualmente. Os relatórios duplicados (indicados por `...`) são omitidos.

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

Se nenhuma string de conexão for especificada, o **ndb_waiter** tenta se conectar a um gerenciamento em `localhost` e relata `Conectando ao mgmsrv em (null)`.

Antes das versões 7.5.18 e 7.6.14 do NDB, este programa imprimia `NDBT_ProgramExit - status` após o término de sua execução, devido a uma dependência desnecessária da biblioteca de testes `NDBT`. Essa dependência foi removida, eliminando a saída desnecessária.
