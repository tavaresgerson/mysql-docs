### 25.5.30 ndb\_waiter — Aguarde o NDB Cluster atingir um status específico

O **ndb\_waiter** imprime repetidamente (a cada 100 milissegundos) o status de todos os nós de dados do cluster até que o cluster atinja um status específico ou o limite `--timeout` seja excedido, e então o processo é encerrado. Por padrão, ele aguarda que o cluster atinja o status `STARTED`, em que todos os nós tenham iniciado e se conectado ao cluster. Isso pode ser alterado usando as opções `--no-contact` e `--not-started`.

Os estados do nó reportados por este utilitário são os seguintes:

- `NO_CONTACT`: O nó não pode ser contatado.

- `UNKNOWN`: O nó pode ser contatado, mas seu status ainda não é conhecido. Normalmente, isso significa que o nó recebeu um comando `START` ou `RESTART` do servidor de gerenciamento, mas ainda não agiu sobre ele.

- `NOT_STARTED`: O nó parou, mas continua em contato com o clúster. Isso é visto ao reiniciar o nó usando o comando `RESTART` do cliente de gerenciamento.

- `STARTING`: O processo **ndbd** do nó começou, mas o nó ainda não se juntou ao clúster.

- `STARTED`: O nó está operacional e se juntou ao clúster.

- `SHUTTING_DOWN`: O nó está sendo desligado.

- `SINGLE USER MODE`: Isso é exibido para todos os nós de dados do clúster quando o clúster está no modo de usuário único.

As opções que podem ser usadas com **ndb\_waiter** estão mostradas na tabela a seguir. Descrições adicionais seguem a tabela.

**Tabela 25.51 Opções de linha de comando usadas com o programa ndb\_waiter**

<table frame="box" rules="all"><thead><tr> <th scope="col">Formato</th> <th scope="col">Descrição</th> <th scope="col">Adicionado, Descontinuado ou Removido</th> </tr></thead><tbody><tr> <th><p> [[PH_HTML_CODE_<code> -? </code>] </p></th> <td>Diretório contendo conjuntos de caracteres</td> <td><p>REMOvido: 8.0.31</p></td> </tr></tbody><tbody><tr> <th><p> [[PH_HTML_CODE_<code> -? </code>] </p></th> <td>Número de vezes para tentar a conexão novamente antes de desistir</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[PH_HTML_CODE_<code>--ndb-connectstring=connection_string</code>] </p></th> <td>Número de segundos para esperar entre as tentativas de contato com o servidor de gerenciamento</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p>[[PH_HTML_CODE_<code> -c connection_string </code>],</p><p> [[PH_HTML_CODE_<code>--ndb-mgmd-host=connection_string</code>] </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[PH_HTML_CODE_<code> -c connection_string </code>] </p></th> <td>Escreva o arquivo de núcleo em erro; usado no depuração</td> <td><p>REMOvido: 8.0.31</p></td> </tr></tbody><tbody><tr> <th><p> [[PH_HTML_CODE_<code> --ndb-nodeid=# </code>] </p></th> <td>Leia o arquivo fornecido após os arquivos globais terem sido lidos</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[PH_HTML_CODE_<code> --ndb-optimized-node-selection </code>] </p></th> <td>Ler opções padrão a partir do arquivo fornecido apenas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[PH_HTML_CODE_<code>--no-contact</code>] </p></th> <td>Leia também grupos com concatenação(grupo, sufixo)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p>[[PH_HTML_CODE_<code> -n </code>],</p><p> [[<code> -? </code>]] </p></th> <td>Exibir texto de ajuda e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --connect-retries=# </code><code> -? </code>] </p></th> <td>Leia o caminho fornecido a partir do arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code>--ndb-connectstring=connection_string</code>]],</p><p> [[<code> -c connection_string </code>]] </p></th> <td>Defina a string de conexão para se conectar ao ndb_mgmd. Sintaxe: "[nodeid=id;][host=]hostname[:por<code> -? </code>". Substitui as entradas no NDB_CONNECTSTRING e no my.cnf</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code>--ndb-mgmd-host=connection_string</code>]],</p><p> [[<code> -c connection_string </code>]] </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --ndb-nodeid=# </code>]] </p></th> <td>Defina o ID do nó para este nó, substituindo qualquer ID definida pela opção --ndb-connectstring</td> <td><p>REMOvido: 8.0.31</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --ndb-optimized-node-selection </code>]] </p></th> <td>Ative as otimizações para a seleção de nós para transações. Ativado por padrão; use --skip-ndb-optimized-node-selection para desativá-lo</td> <td><p>REMOvido: 8.0.31</p></td> </tr></tbody><tbody><tr> <th><p>[[<code>--no-contact</code>]],</p><p> [[<code> -n </code>]] </p></th> <td>Aguarde até o cluster atingir o estado de "sem contato"</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --connect-retry-delay=# </code><code> -? </code>] </p></th> <td>Não leia as opções padrão de nenhum arquivo de opção, exceto o arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --connect-retry-delay=# </code><code> -? </code>] </p></th> <td>Aguarde o cluster atingir o estado NÃO INICIADO</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --connect-retry-delay=# </code><code>--ndb-connectstring=connection_string</code>] </p></th> <td>Lista de nós que não devem ser aguardados</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --connect-retry-delay=# </code><code> -c connection_string </code>] </p></th> <td>Imprimir a lista de argumentos do programa e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --connect-retry-delay=# </code><code>--ndb-mgmd-host=connection_string</code>] </p></th> <td>Aguarde o cluster entrar no modo de usuário único</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code> --connect-retry-delay=# </code><code> -c connection_string </code>],</p><p> [[<code> --connect-retry-delay=# </code><code> --ndb-nodeid=# </code>] </p></th> <td>Aguarde esses segundos e, em seguida, saia, independentemente de o cluster ter atingido o estado desejado ou</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code> --connect-retry-delay=# </code><code> --ndb-optimized-node-selection </code>],</p><p> [[<code> --connect-retry-delay=# </code><code>--no-contact</code>] </p></th> <td>Exibir texto de ajuda e sair; o mesmo que --help</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code> --connect-retry-delay=# </code><code> -n </code>],</p><p> [[<code>--connect-string=connection_string</code><code> -? </code>] </p></th> <td>Defina o nível de verbosidade de saída; veja o texto para os valores de entrada e retorno</td> <td><p>ADICIONADO: 8.0.37</p></td> </tr></tbody><tbody><tr> <th><p>[[<code>--connect-string=connection_string</code><code> -? </code>],</p><p> [[<code>--connect-string=connection_string</code><code>--ndb-connectstring=connection_string</code>] </p></th> <td>Exibir informações da versão e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code>--connect-string=connection_string</code><code> -c connection_string </code>],</p><p> [[<code>--connect-string=connection_string</code><code>--ndb-mgmd-host=connection_string</code>] </p></th> <td>Lista de nós a serem aguardados</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody></table>

#### Uso

```
ndb_waiter [-c connection_string]
```

#### Opções adicionais

- `--character-sets-dir`

  <table summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr><tr><th>Removido</th> <td>8.0.31</td> </tr></tbody></table>

  Diretório contendo conjuntos de caracteres.

- `--connect-retries`

  <table summary="Propriedades para tentativas de conexão de reposição"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--connect-retries=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>12</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>12</code>]]</td> </tr></tbody></table>

  Número de vezes para tentar a conexão novamente antes de desistir.

- `--connect-retry-delay`

  <table summary="Propriedades para connect-retry-delay"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--connect-retry-delay=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>5</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>5</code>]]</td> </tr></tbody></table>

  Número de segundos para esperar entre as tentativas de contato com o servidor de gerenciamento.

- `--connect-string`

  <table summary="Propriedades para a string de conexão"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--connect-string=connection_string</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>

  O mesmo que `--ndb-connectstring`.

- `--core-file`

  <table summary="Propriedades para arquivo de núcleo"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--core-file</code>]]</td> </tr><tr><th>Removido</th> <td>8.0.31</td> </tr></tbody></table>

  Escreva o arquivo de núcleo em erro; usado no depuração.

- `--defaults-extra-file`

  <table summary="Propriedades para defaults-extra-file"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--defaults-extra-file=path</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>

  Leia o arquivo fornecido após a leitura dos arquivos globais.

- `--defaults-file`

  <table summary="Propriedades para arquivo de falhas"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--defaults-file=path</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>

  Leia as opções padrão do arquivo fornecido.

- `--defaults-group-suffix`

  <table summary="Propriedades para defaults-group-suffix"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--defaults-group-suffix=string</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>

  Leia também grupos com concatenação (grupo, sufixo).

- `--login-path`

  <table summary="Propriedades para o caminho de login"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--login-path=path</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>

  Leia o caminho fornecido a partir do arquivo de login.

- `--help`

  <table summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr><tr><th>Removido</th> <td>8.0.31</td> </tr></tbody></table>0

  Exibir texto de ajuda e sair.

- `--ndb-connectstring`

  <table summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr><tr><th>Removido</th> <td>8.0.31</td> </tr></tbody></table>1

  Defina a string de conexão para se conectar ao ndb\_mgmd. Sintaxe: "\[nodeid=id;]\[host=]hostname\[:port]". Oculte entradas no NDB\_CONNECTSTRING e no my.cnf.

- `--ndb-mgmd-host`

  <table summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr><tr><th>Removido</th> <td>8.0.31</td> </tr></tbody></table>2

  O mesmo que --`ndb-connectstring`.

- `--ndb-nodeid`

  <table summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr><tr><th>Removido</th> <td>8.0.31</td> </tr></tbody></table>3

  Defina o ID do nó para este nó, substituindo qualquer ID definida por `--ndb-connectstring`.

- `--ndb-optimized-node-selection`

  <table summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr><tr><th>Removido</th> <td>8.0.31</td> </tr></tbody></table>4

  Ative as otimizações para a seleção de nós para transações. Ativado por padrão; use `--skip-ndb-optimized-node-selection` para desativá-lo.

- `--no-contact`, `-n`

  Em vez de esperar pelo estado `STARTED`, o **ndb\_waiter** continua rodando até que o clúster atinja o status `NO_CONTACT` antes de sair.

- `--no-defaults`

  <table summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr><tr><th>Removido</th> <td>8.0.31</td> </tr></tbody></table>5

  Não leia as opções padrão de nenhum arquivo de opção, exceto o arquivo de login.

- `--not-started`

  Em vez de esperar pelo estado `STARTED`, o **ndb\_waiter** continua rodando até que o clúster atinja o status `NOT_STARTED` antes de sair.

- `--nowait-nodes=list`

  Quando essa opção é usada, o **ndb\_waiter** não aguarda os nós cujos IDs estão listados. A lista é delimitada por vírgulas; os intervalos podem ser indicados por traços, como mostrado aqui:

  ```
  $> ndb_waiter --nowait-nodes=1,3,7-9
  ```

  Importante

  Não use esta opção junto com a opção `--wait-nodes`.

- `--print-defaults`

  <table summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr><tr><th>Removido</th> <td>8.0.31</td> </tr></tbody></table>6

  Imprima a lista de argumentos do programa e saia.

- `--timeout=seconds`, `-t seconds`

  É hora de esperar. O programa sai se o estado desejado não for alcançado dentro deste número de segundos. O padrão é de 120 segundos (1200 ciclos de relatório).

- `--single-user`

  O programa aguarda que o clúster entre no modo de usuário único.

- `--usage`

  <table summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr><tr><th>Removido</th> <td>8.0.31</td> </tr></tbody></table>7

  Exibir texto de ajuda e sair; o mesmo que `--help`.

- `--verbose`

  <table summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr><tr><th>Removido</th> <td>8.0.31</td> </tr></tbody></table>8

  Controla o nível de verbosidade da impressão. Os níveis possíveis e seus efeitos estão listados aqui:

  - `0`: Não imprima (retorne apenas o código de saída; consulte o seguinte para códigos de saída].

  - `1`: Imprimir apenas o status final da conexão.

  - `2`: Imprimir o status cada vez que for verificado.

    Esse é o mesmo comportamento das versões do NDB Cluster anteriores à 8.4.

  Os códigos de saída retornados pelo **ndb\_waiter** estão listados aqui, com seus significados:

  - `0`: Sucesso.

  - `1`: O tempo de espera expirou.

  - `2`: Erro no parâmetro, como um ID de nó inválido.

  - `3`: Não foi possível se conectar ao servidor de gerenciamento.

- `--version`

  <table summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr><tr><th>Removido</th> <td>8.0.31</td> </tr></tbody></table>9

  Exibir informações da versão e sair.

- `--wait-nodes=list`, `-w list`

  Quando essa opção é usada, o **ndb\_waiter** aguarda apenas pelos nós cujos IDs estão listados. A lista é delimitada por vírgulas; os intervalos podem ser indicados por traços, como mostrado aqui:

  ```
  $> ndb_waiter --wait-nodes=2,4-6,10
  ```

  Importante

  Não use esta opção junto com a opção `--nowait-nodes`.

**Saída de exemplo.** Mostrada aqui é a saída do **ndb\_waiter** quando executado em um clúster de 4 nós, nos quais dois nós foram desligados e depois reiniciados manualmente. Relatórios duplicados (indicados por `...`) são omitidos.

```
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

Se nenhuma string de conexão for especificada, o **ndb\_waiter** tenta se conectar a um gerenciamento em `localhost` e reporta `Connecting to mgmsrv at (null)`.

Antes da versão 8.0.20 do NDB, este programa imprimia `NDBT_ProgramExit - status` após a conclusão de sua execução, devido a uma dependência desnecessária da biblioteca de teste `NDBT`. Essa dependência foi removida, eliminando a saída desnecessária.
