### 21.5.4 ndb\_mgmd — O daemon do servidor de gerenciamento de cluster NDB

O servidor de gerenciamento é o processo que lê o arquivo de configuração do clúster e distribui essas informações para todos os nós do clúster que solicitarem. Ele também mantém um registro das atividades do clúster. Os clientes de gerenciamento podem se conectar ao servidor de gerenciamento e verificar o status do clúster.

As opções que podem ser usadas com **ndb\_mgmd** estão mostradas na tabela a seguir. Descrições adicionais seguem a tabela.

**Tabela 21.24 Opções de linha de comando usadas com o programa ndb\_mgmd**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th scope="col">Formato</th> <th scope="col">Descrição</th> <th scope="col">Adicionado, Descontinuado ou Removido</th> </tr></thead><tbody><tr> <th scope="row"><p> [[PH_HTML_CODE_<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_connect-string">-c connection_string</a> </code>] </p></th> <td>Endereço de ligação local</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[PH_HTML_CODE_<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_connect-string">-c connection_string</a> </code>] </p></th> <td>Diretório contendo conjuntos de caracteres</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[PH_HTML_CODE_<code class="option"><a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_daemon">--daemon</a></code>] </p></th> <td>Habilitar o cache de configuração do servidor de gerenciamento; verdadeiro por padrão</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[PH_HTML_CODE_<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_daemon">-d</a> </code>],</p><p> [[PH_HTML_CODE_<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_defaults-extra-file">--defaults-extra-file=path</a> </code>] </p></th> <td>Especifique o arquivo de configuração do cluster; também especifique --reload ou --initial para substituir o cache de configuração, se estiver presente</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[PH_HTML_CODE_<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_defaults-file">--defaults-file=path</a> </code>],</p><p> [[PH_HTML_CODE_<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_defaults-group-suffix">--defaults-group-suffix=string</a> </code>] </p></th> <td>Especifique o diretório de cache de configuração do servidor de gerenciamento de clúster</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[PH_HTML_CODE_<code class="option"><a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_help">--help</a></code>] </p></th> <td>Número de vezes para tentar a conexão novamente antes de desistir</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[PH_HTML_CODE_<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_help">-?</a> </code>] </p></th> <td>Número de segundos para esperar entre as tentativas de contato com o servidor de gerenciamento</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[PH_HTML_CODE_<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_initial">--initial</a> </code>],</p><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_connect-string">-c connection_string</a> </code>]] </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_character-sets-dir">--character-sets-dir=path</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_connect-string">-c connection_string</a> </code>] </p></th> <td>Escreva o arquivo de núcleo em erro; usado no depuração</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_daemon">--daemon</a></code>]],</p><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_daemon">-d</a> </code>]] </p></th> <td>Execute ndb_mgmd no modo daemon (padrão)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_defaults-extra-file">--defaults-extra-file=path</a> </code>]] </p></th> <td>Leia o arquivo fornecido após os arquivos globais terem sido lidos</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_defaults-file">--defaults-file=path</a> </code>]] </p></th> <td>Ler opções padrão a partir do arquivo fornecido apenas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_defaults-group-suffix">--defaults-group-suffix=string</a> </code>]] </p></th> <td>Leia também grupos com concatenação(grupo, sufixo)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_help">--help</a></code>]],</p><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_help">-?</a> </code>]] </p></th> <td>Exibir texto de ajuda e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_initial">--initial</a> </code>]] </p></th> <td>Faz com que o servidor de gerenciamento recarregue os dados de configuração do arquivo de configuração, ignorando o cache de configuração</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_config-cache">--config-cache[=TRUE|FALS<code class="option"><a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_config-file">--config-file=file</a></code></a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_connect-string">-c connection_string</a> </code>] </p></th> <td>Usado para instalar o processo do servidor de gerenciamento como serviço do Windows; não se aplica em outras plataformas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_config-cache">--config-cache[=TRUE|FALS<code class="option"><a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_config-file">--config-file=file</a></code></a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_connect-string">-c connection_string</a> </code>] </p></th> <td>Execute o ndb_mgmd no modo interativo (não é oficialmente suportado na produção; apenas para fins de teste)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_config-cache">--config-cache[=TRUE|FALS<code class="option"><a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_config-file">--config-file=file</a></code></a> </code><code class="option"><a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_daemon">--daemon</a></code>] </p></th> <td>Nome a ser usado ao escrever mensagens de log de cluster que se aplicam a este nó</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_config-cache">--config-cache[=TRUE|FALS<code class="option"><a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_config-file">--config-file=file</a></code></a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_daemon">-d</a> </code>] </p></th> <td>Leia o caminho fornecido a partir do arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_config-cache">--config-cache[=TRUE|FALS<code class="option"><a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_config-file">--config-file=file</a></code></a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_defaults-extra-file">--defaults-extra-file=path</a> </code>] </p></th> <td>Ler dados de configuração de cluster a partir do arquivo my.cnf</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_config-cache">--config-cache[=TRUE|FALS<code class="option"><a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_config-file">--config-file=file</a></code></a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_defaults-file">--defaults-file=path</a> </code>],</p><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_config-cache">--config-cache[=TRUE|FALS<code class="option"><a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_config-file">--config-file=file</a></code></a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_defaults-group-suffix">--defaults-group-suffix=string</a> </code>] </p></th> <td>Defina a string de conexão para se conectar ao ndb_mgmd. Sintaxe: "[nodeid=id;][host=]hostname[:por<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_connect-string">-c connection_string</a> </code>". Substitui as entradas no NDB_CONNECTSTRING e no my.cnf</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_config-cache">--config-cache[=TRUE|FALS<code class="option"><a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_config-file">--config-file=file</a></code></a> </code><code class="option"><a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_help">--help</a></code>],</p><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_config-cache">--config-cache[=TRUE|FALS<code class="option"><a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_config-file">--config-file=file</a></code></a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_help">-?</a> </code>] </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_config-cache">--config-cache[=TRUE|FALS<code class="option"><a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_config-file">--config-file=file</a></code></a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_initial">--initial</a> </code>] </p></th> <td>Defina o ID do nó para este nó, substituindo qualquer ID definida pela opção --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_config-file">--config-file=file</a></code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_connect-string">-c connection_string</a> </code>] </p></th> <td>Ative as otimizações para a seleção de nós para transações. Ativado por padrão; use --skip-ndb-optimized-node-selection para desativá-lo</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_config-file">--config-file=file</a></code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_connect-string">-c connection_string</a> </code>] </p></th> <td>Não leia as opções padrão de nenhum arquivo de opção, exceto o arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_config-file">--config-file=file</a></code><code class="option"><a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_daemon">--daemon</a></code>] </p></th> <td>Não realize nenhuma verificação de ID de nó</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_config-file">--config-file=file</a></code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_daemon">-d</a> </code>] </p></th> <td>Não execute o ndb_mgmd como um daemon</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_config-file">--config-file=file</a></code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_defaults-extra-file">--defaults-extra-file=path</a> </code>] </p></th> <td>Não espere por nós de gerenciamento especificados ao iniciar este servidor de gerenciamento; requer a opção --ndb-nodeid</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_config-file">--config-file=file</a></code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_defaults-file">--defaults-file=path</a> </code>] </p></th> <td>Imprimir a lista de argumentos do programa e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_config-file">--config-file=file</a></code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_defaults-group-suffix">--defaults-group-suffix=string</a> </code>],</p><p> [[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_config-file">--config-file=file</a></code><code class="option"><a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_help">--help</a></code>] </p></th> <td>Imprimir configuração completa e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_config-file">--config-file=file</a></code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_help">-?</a> </code>] </p></th> <td>Faz com que o servidor de gerenciamento compare o arquivo de configuração com o cache de configuração</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_config-file">--config-file=file</a></code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_initial">--initial</a> </code>] </p></th> <td>Usado para remover o processo do servidor de gerenciamento que foi instalado anteriormente como serviço do Windows, especificando opcionalmente o nome do serviço a ser removido; não se aplica em outras plataformas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_config-file">-f file</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_connect-string">-c connection_string</a> </code>] </p></th> <td>Não use o arquivo de configuração</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_config-file">-f file</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_connect-string">-c connection_string</a> </code>],</p><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_config-file">-f file</a> </code><code class="option"><a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_daemon">--daemon</a></code>] </p></th> <td>Exibir texto de ajuda e sair; o mesmo que --help</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_config-file">-f file</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_daemon">-d</a> </code>],</p><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_config-file">-f file</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_defaults-extra-file">--defaults-extra-file=path</a> </code>] </p></th> <td>Escreva informações adicionais para registrar</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_config-file">-f file</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_defaults-file">--defaults-file=path</a> </code>],</p><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_config-file">-f file</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_defaults-group-suffix">--defaults-group-suffix=string</a> </code>] </p></th> <td>Exibir informações da versão e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody></table>

- `--bind-address=host`

  <table frame="box" rules="all" summary="Propriedades para endereço de ligação"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--bind-address=host</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">[none]</code>]]</td> </tr></tbody></table>

  Faz com que o servidor de gerenciamento se ligue a uma interface de rede específica (nome de host ou endereço IP). Esta opção não tem um valor padrão.

- `--character-sets-dir`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr></tbody></table>

  Diretório contendo conjuntos de caracteres.

- `--config-cache`

  <table frame="box" rules="all" summary="Propriedades para config-cache"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--config-cache[=TRUE|FALS<code class="literal">TRUE</code></code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">TRUE</code>]]</td> </tr></tbody></table>

  Esta opção, cujo valor padrão é `1` (ou `TRUE`, ou `ON`), pode ser usada para desabilitar o cache de configuração do servidor de gerenciamento, para que ele leia sua configuração do `config.ini` toda vez que for iniciado (veja Seção 21.4.3, “Arquivos de Configuração do NDB Cluster”). Você pode fazer isso iniciando o processo **ndb\_mgmd** com qualquer uma das seguintes opções:

  - `--config-cache=0`
  - `--config-cache=FALSE`
  - `--config-cache=OFF`
  - `--skip-config-cache`

  Usar uma das opções listadas acima é eficaz apenas se o servidor de gerenciamento não tiver nenhum arquivo de cache de configuração no momento em que ele for iniciado. Se o servidor de gerenciamento encontrar algum arquivo de cache de configuração, a opção `--config-cache` ou a opção `--skip-config-cache` será ignorada. Portanto, para desativar o cache de configuração, a opção deve ser usada *primeiramente* quando o servidor de gerenciamento for iniciado. Caso contrário — ou seja, se você deseja desativar o cache de configuração para um servidor de gerenciamento que *já* criou um cache de configuração — você deve parar o servidor de gerenciamento, excluir manualmente quaisquer arquivos de cache de configuração existentes e, em seguida, reiniciar o servidor de gerenciamento com `--skip-config-cache` (ou com `--config-cache` definido como 0, `OFF` ou `FALSE`).

  Os arquivos de cache de configuração são normalmente criados em um diretório chamado `mysql-cluster` sob o diretório de instalação (a menos que essa localização tenha sido sobrescrita usando a opção `--configdir`). Toda vez que o servidor de gerenciamento atualiza seus dados de configuração, ele escreve um novo arquivo de cache. Os arquivos são nomeados sequencialmente em ordem de criação usando o seguinte formato:

  ```sql
  ndb_node-id_config.bin.seq-number
  ```

  *`node-id`* é o ID do nó do servidor de gerenciamento; *`seq-number`* é um número de sequência, começando com 1. Por exemplo, se o ID do nó do servidor de gerenciamento for 5, os três primeiros arquivos de cache de configuração serão, quando criados, chamados de `ndb_5_config.bin.1`, `ndb_5_config.bin.2` e `ndb_5_config.bin.3`.

  Se a sua intenção é limpar ou recarregar o cache de configuração sem realmente desativar o cache, você deve iniciar **ndb\_mgmd** com uma das opções `--reload` ou `--initial` em vez de `--skip-config-cache`.

  Para reativar o cache de configuração, basta reiniciar o servidor de gerenciamento, mas sem a opção `--config-cache` ou `--skip-config-cache` que foi usada anteriormente para desativar o cache de configuração.

  **ndb\_mgmd** não verifica o diretório de configuração (`--configdir`) ou tenta criá-lo quando o `--skip-config-cache` é usado. (Bug #13428853)

- `--config-file=nome_do_arquivo`, `-f nome_do_arquivo`

  <table frame="box" rules="all" summary="Propriedades para arquivo de configuração"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--config-file=file</code>]]</td> </tr><tr><th>Incapaz de</th> <td>[[<code class="literal">skip-config-file</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">[none]</code>]]</td> </tr></tbody></table>

  Instrui o servidor de gerenciamento sobre qual arquivo deve usar para seu arquivo de configuração. Por padrão, o servidor de gerenciamento procura por um arquivo chamado `config.ini` no mesmo diretório que o executável **ndb\_mgmd**; caso contrário, o nome e a localização do arquivo devem ser especificados explicitamente.

  Esta opção não tem um valor padrão e é ignorada, a menos que o servidor de gerenciamento seja forçado a ler o arquivo de configuração, seja porque o **ndb\_mgmd** foi iniciado com a opção `--reload` ou `--initial`, ou porque o servidor de gerenciamento não conseguiu encontrar nenhum cache de configuração.

  A opção `--config-file` também é lida se o **ndb\_mgmd** foi iniciado com `--config-cache=OFF`. Consulte Seção 21.4.3, “Arquivos de Configuração do NDB Cluster” para obter mais informações.

- `--configdir=dir_name`

  <table frame="box" rules="all" summary="Propriedades para configdir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><p class="valid-value">[[<code class="literal">--configdir=directory</code>]]</p><p class="valid-value">[[<code class="literal">--config-dir=directory</code>]]</p></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">$INSTALLDIR/mysql-cluster</code>]]</td> </tr></tbody></table>

  Especifica o diretório de cache de configuração do servidor de gerenciamento de clúster. `--config-dir` é um alias para esta opção.

- `--connect-retries`

  <table frame="box" rules="all" summary="Propriedades para tentativas de conexão de reposição"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--connect-retries=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">12</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">12</code>]]</td> </tr></tbody></table>

  Número de vezes para tentar a conexão novamente antes de desistir.

- `--connect-retry-delay`

  <table frame="box" rules="all" summary="Propriedades para connect-retry-delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--connect-retry-delay=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">5</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">5</code>]]</td> </tr></tbody></table>

  Número de segundos para esperar entre as tentativas de contato com o servidor de gerenciamento.

- `--connect-string`

  <table frame="box" rules="all" summary="Propriedades para a string de conexão"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--connect-string=connection_string</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">[none]</code>]]</td> </tr></tbody></table>

  O mesmo que `--ndb-connectstring`.

- `--core-file`

  <table frame="box" rules="all" summary="Propriedades para arquivo de núcleo"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--core-file</code>]]</td> </tr></tbody></table>

  Escreva o arquivo de núcleo em erro; usado no depuração.

- `--daemon`, `-d`

  <table frame="box" rules="all" summary="Propriedades para endereço de ligação"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--bind-address=host</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">[none]</code>]]</td> </tr></tbody></table>0

  Instrui **ndb\_mgmd** para iniciar como um processo de daemon. Esse é o comportamento padrão.

  Esta opção não tem efeito ao executar **ndb\_mgmd** em plataformas Windows.

- `--defaults-extra-file`

  <table frame="box" rules="all" summary="Propriedades para endereço de ligação"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--bind-address=host</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">[none]</code>]]</td> </tr></tbody></table>1

  Leia o arquivo fornecido após a leitura dos arquivos globais.

- `--defaults-file`

  <table frame="box" rules="all" summary="Propriedades para endereço de ligação"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--bind-address=host</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">[none]</code>]]</td> </tr></tbody></table>2

  Leia as opções padrão do arquivo fornecido.

- `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Propriedades para endereço de ligação"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--bind-address=host</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">[none]</code>]]</td> </tr></tbody></table>3

  Leia também grupos com concatenação (grupo, sufixo).

- `--help`

  <table frame="box" rules="all" summary="Propriedades para endereço de ligação"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--bind-address=host</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">[none]</code>]]</td> </tr></tbody></table>4

  Exibir texto de ajuda e sair.

- `--initial`

  <table frame="box" rules="all" summary="Propriedades para endereço de ligação"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--bind-address=host</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">[none]</code>]]</td> </tr></tbody></table>5

  Os dados de configuração são armazenados em cache internamente, em vez de serem lidos do arquivo de configuração global do cluster cada vez que o servidor de gerenciamento é iniciado (consulte Seção 21.4.3, “Arquivos de Configuração do Cluster NDB”). A opção `--initial` substitui esse comportamento, forçando o servidor de gerenciamento a excluir quaisquer arquivos de cache existentes e, em seguida, a reler os dados de configuração do arquivo de configuração do cluster e a construir um novo cache.

  Isso difere de duas maneiras da opção `--reload`. Primeiro, `--reload` obriga o servidor a verificar o arquivo de configuração contra o cache e recarregar seus dados apenas se o conteúdo do arquivo for diferente do cache. Segundo, `--reload` não exclui nenhum arquivo de cache existente.

  Se o **ndb\_mgmd** for invocado com `--initial` (inicial) e não conseguir encontrar um arquivo de configuração global, o servidor de gerenciamento não poderá ser iniciado.

  Quando um servidor de gerenciamento é iniciado, ele verifica se há outro servidor de gerenciamento no mesmo NDB Cluster e tenta usar os dados de configuração do outro servidor de gerenciamento. Esse comportamento tem implicações ao realizar um reinício contínuo de um NDB Cluster com vários nós de gerenciamento. Consulte Seção 21.6.5, “Realizando um Reinício Contínuo de um NDB Cluster” para obter mais informações.

  Quando usado juntamente com a opção `--config-file`, o cache é limpo apenas se o arquivo de configuração for encontrado.

- `--install[=nome]`

  <table frame="box" rules="all" summary="Propriedades para endereço de ligação"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--bind-address=host</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">[none]</code>]]</td> </tr></tbody></table>6

  Faça com que o **ndb\_mgmd** seja instalado como um serviço do Windows. Opcionalmente, você pode especificar um nome para o serviço; se não for definido, o nome do serviço será `ndb_mgmd`. Embora seja preferível especificar outras opções do programa **ndb\_mgmd** em um arquivo de configuração `my.ini` ou `my.cnf`, é possível usá-las junto com `--install`. No entanto, nesses casos, a opção `--install` deve ser especificada primeiro, antes de quaisquer outras opções serem fornecidas, para que a instalação do serviço do Windows seja bem-sucedida.

  Geralmente, não é aconselhável usar essa opção junto com a opção `--initial`, pois isso faz com que o cache de configuração seja apagado e reconstruído toda vez que o serviço é parado e reiniciado. Também é preciso ter cuidado se você pretende usar outras opções de **ndb\_mgmd** que afetam o início do servidor de gerenciamento, e você deve ter certeza absoluta de que entende completamente e permite quaisquer possíveis consequências de fazer isso.

  A opção `--install` não tem efeito em plataformas que não são do Windows.

- `--interactive`

  <table frame="box" rules="all" summary="Propriedades para endereço de ligação"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--bind-address=host</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">[none]</code>]]</td> </tr></tbody></table>7

  Inicia **ndb\_mgmd** no modo interativo; ou seja, uma sessão de cliente **ndb\_mgm** é iniciada assim que o servidor de gerenciamento estiver em execução. Esta opção não inicia nenhum outro nó do NDB Cluster.

- `--login-path`

  <table frame="box" rules="all" summary="Propriedades para endereço de ligação"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--bind-address=host</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">[none]</code>]]</td> </tr></tbody></table>8

  Leia o caminho fornecido a partir do arquivo de login.

- `--log-name=nome`

  <table frame="box" rules="all" summary="Propriedades para endereço de ligação"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--bind-address=host</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">[none]</code>]]</td> </tr></tbody></table>9

  Fornece um nome a ser usado para este nó no log do cluster.

- `--mycnf`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr></tbody></table>0

  Leia os dados de configuração do arquivo `my.cnf`.

- `--ndb-connectstring`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr></tbody></table>1

  Defina a string de conexão. Sintaxe: `[nodeid=id;][host=]hostname[:port]`. Substitui as entradas no `NDB_CONNECTSTRING` e `my.cnf`; é ignorado se a opção `--config-file` (mysql-cluster-programs-ndb-mgmd.html#option\_ndb\_mgmd\_config-file) for especificada.

- `--ndb-mgmd-host`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr></tbody></table>2

  O mesmo que `--ndb-connectstring`.

- `--ndb-nodeid`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr></tbody></table>3

  Defina o ID do nó para este nó, substituindo qualquer ID definida por `--ndb-connectstring`.

- `--ndb-optimized-node-selection`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr></tbody></table>4

  Ative as otimizações para a seleção de nós para transações. Ativado por padrão; use `--skip-ndb-optimized-node-selection` para desativá-lo.

- `--no-defaults`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr></tbody></table>5

  Não leia as opções padrão de nenhum arquivo de opção, exceto o arquivo de login.

- `--no-nodeid-checks`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr></tbody></table>6

  Não realize nenhuma verificação dos IDs dos nós.

- `--nodaemon`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr></tbody></table>7

  Instrua o **ndb\_mgmd** a não iniciar como um processo de daemon.

  O comportamento padrão do **ndb\_mgmd** no Windows é executar em primeiro plano, tornando essa opção desnecessária nas plataformas Windows.

- `--nowait-nodes`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr></tbody></table>8

  Ao iniciar um NDB Cluster, ele é configurado com dois nós de gerenciamento. Normalmente, cada servidor de gerenciamento verifica se o outro **ndb\_mgmd** também está operacional e se a configuração do outro servidor de gerenciamento é idêntica à do próprio. No entanto, às vezes é desejável iniciar o cluster com apenas um nó de gerenciamento (e talvez permitir que o outro **ndb\_mgmd** seja iniciado mais tarde). Esta opção faz com que o nó de gerenciamento ignore quaisquer verificações para quaisquer outros nós de gerenciamento cujos IDs de nó são passados para esta opção, permitindo que o cluster seja iniciado como se estivesse configurado para usar apenas o nó de gerenciamento que foi iniciado.

  Para fins ilustrativos, considere a seguinte parte de um arquivo `config.ini` (onde omitimos a maioria dos parâmetros de configuração que não são relevantes para este exemplo):

  ```sql
  [ndbd]
  NodeId = 1
  HostName = 198.51.100.101

  [ndbd]
  NodeId = 2
  HostName = 198.51.100.102

  [ndbd]
  NodeId = 3
  HostName = 198.51.100.103

  [ndbd]
  NodeId = 4
  HostName = 198.51.100.104

  [ndb_mgmd]
  NodeId = 10
  HostName = 198.51.100.150

  [ndb_mgmd]
  NodeId = 11
  HostName = 198.51.100.151

  [api]
  NodeId = 20
  HostName = 198.51.100.200

  [api]
  NodeId = 21
  HostName = 198.51.100.201
  ```

  Suponha que você queira iniciar esse clúster usando apenas o servidor de gerenciamento com o ID de nó `10` e executando no host com o endereço IP 198.51.100.150. (Suponha, por exemplo, que o computador do host no qual você pretende o outro servidor de gerenciamento esteja temporariamente indisponível devido a uma falha de hardware, e você esteja esperando para que ele seja reparado.) Para iniciar o clúster dessa maneira, use uma linha de comando na máquina em 198.51.100.150 para inserir o seguinte comando:

  ```sql
  $> ndb_mgmd --ndb-nodeid=10 --nowait-nodes=11
  ```

  Como mostrado no exemplo anterior, ao usar `--nowait-nodes`, você também deve usar a opção `--ndb-nodeid` para especificar o ID do nó deste processo **ndb\_mgmd**.

  Em seguida, você pode iniciar cada um dos nós de dados do clúster da maneira usual. Se você quiser iniciar e usar o segundo servidor de gerenciamento, além do primeiro servidor de gerenciamento, mais tarde, sem reiniciar os nós de dados, você deve iniciar cada nó de dados com uma cadeia de conexão que faça referência a ambos os servidores de gerenciamento, da seguinte maneira:

  ```sql
  $> ndbd -c 198.51.100.150,198.51.100.151
  ```

  O mesmo vale para a string de conexão usada com quaisquer processos **mysqld** que você deseja iniciar como nós SQL do NDB Cluster conectados a este cluster. Consulte Seção 21.4.3.3, “Strings de Conexão do NDB Cluster” para obter mais informações.

  Quando usado com **ndb\_mgmd**, essa opção afeta o comportamento do nó de gerenciamento em relação a outros nós de gerenciamento. Não confunda com a opção `--nowait-nodes` usada com **ndbd** ou **ndbmtd** para permitir que um clúster comece com menos do que seu complemento total de nós de dados; quando usado com nós de dados, essa opção afeta seu comportamento apenas em relação a outros nós de dados.

  Pode-se passar vários IDs de nó de gerenciamento para esta opção como uma lista separada por vírgula. Cada ID de nó deve ser maior ou igual a 1 e menor ou igual a 255. Na prática, é bastante raro usar mais de dois servidores de gerenciamento para o mesmo NDB Cluster (ou ter a necessidade de fazê-lo); na maioria dos casos, é necessário passar para esta opção apenas o ID de nó único para o servidor de gerenciamento que você não deseja usar ao iniciar o cluster.

  Nota

  Quando você iniciar o servidor de gerenciamento "falta" mais tarde, sua configuração deve corresponder à do servidor de gerenciamento que já está sendo usado pelo clúster. Caso contrário, ele falhará na verificação de configuração realizada pelo servidor de gerenciamento existente e não iniciará.

- `--print-defaults`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr></tbody></table>9

  Imprima a lista de argumentos do programa e saia.

- `--print-full-config`, `-P`

  <table frame="box" rules="all" summary="Propriedades para config-cache"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--config-cache[=TRUE|FALS<code class="literal">TRUE</code></code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">TRUE</code>]]</td> </tr></tbody></table>0

  Mostra informações detalhadas sobre a configuração do clúster. Com esta opção na linha de comando, o processo **ndb\_mgmd** imprime informações sobre a configuração do clúster, incluindo uma lista extensa das seções de configuração do clúster, bem como os parâmetros e seus valores. Normalmente usado em conjunto com a opção `--config-file` (`-f`).

- `--reload`

  <table frame="box" rules="all" summary="Propriedades para config-cache"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--config-cache[=TRUE|FALS<code class="literal">TRUE</code></code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">TRUE</code>]]</td> </tr></tbody></table>1

  Os dados de configuração do NDB Cluster são armazenados internamente, em vez de serem lidos do arquivo de configuração global do cluster a cada vez que o servidor de gerenciamento é iniciado (consulte Seção 21.4.3, “Arquivos de Configuração do NDB Cluster”). A utilização desta opção obriga o servidor de gerenciamento a verificar seu armazenamento de dados interno contra o arquivo de configuração do cluster e a recarregar a configuração se encontrar que o arquivo de configuração não corresponde ao cache. Os arquivos de cache de configuração existentes são preservados, mas não utilizados.

  Isso difere de duas maneiras da opção `--initial`. Primeiro, `--initial` faz com que todos os arquivos de cache sejam excluídos. Segundo, `--initial` obriga o servidor de gerenciamento a reler o arquivo de configuração global e construir um novo cache.

  Se o servidor de gerenciamento não conseguir encontrar um arquivo de configuração global, a opção `--reload` será ignorada.

  Quando o `--reload` é usado, o servidor de gerenciamento deve ser capaz de se comunicar com os nós de dados e quaisquer outros servidores de gerenciamento no clúster antes de tentar ler o arquivo de configuração global; caso contrário, o servidor de gerenciamento não consegue iniciar. Isso pode acontecer devido a mudanças no ambiente de rede, como novos endereços IP para os nós ou uma configuração de firewall alterada. Nesses casos, você deve usar `--initial` para forçar o descarte e recarregar a configuração armazenada em cache do arquivo. Consulte Seção 21.6.5, “Realizando um Reinício Rotativo de um Clúster NDB” para obter informações adicionais.

- `--remove{=nome}`

  <table frame="box" rules="all" summary="Propriedades para config-cache"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--config-cache[=TRUE|FALS<code class="literal">TRUE</code></code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">TRUE</code>]]</td> </tr></tbody></table>2

  Remova um processo do servidor de gerenciamento que foi instalado como um serviço do Windows, especificando opcionalmente o nome do serviço a ser removido. Aplica-se apenas a plataformas Windows.

- `--skip-config-file`

  <table frame="box" rules="all" summary="Propriedades para config-cache"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--config-cache[=TRUE|FALS<code class="literal">TRUE</code></code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">TRUE</code>]]</td> </tr></tbody></table>3

  Não leia o arquivo de configuração do cluster; ignore as opções `--initial` e `--reload` se especificadas.

- `--usage`

  <table frame="box" rules="all" summary="Propriedades para config-cache"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--config-cache[=TRUE|FALS<code class="literal">TRUE</code></code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">TRUE</code>]]</td> </tr></tbody></table>4

  Exibir texto de ajuda e sair; o mesmo que `--help`.

- `--verbose`, `-v`

  <table frame="box" rules="all" summary="Propriedades para config-cache"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--config-cache[=TRUE|FALS<code class="literal">TRUE</code></code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">TRUE</code>]]</td> </tr></tbody></table>5

  Remova um processo do servidor de gerenciamento que foi instalado como um serviço do Windows, especificando opcionalmente o nome do serviço a ser removido. Aplica-se apenas a plataformas Windows.

- `--version`

  <table frame="box" rules="all" summary="Propriedades para config-cache"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--config-cache[=TRUE|FALS<code class="literal">TRUE</code></code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">TRUE</code>]]</td> </tr></tbody></table>6

  Exibir informações da versão e sair.

Não é estritamente necessário especificar uma cadeia de conexão ao iniciar o servidor de gerenciamento. No entanto, se você estiver usando mais de um servidor de gerenciamento, uma cadeia de conexão deve ser fornecida e cada nó no clúster deve especificar seu ID de nó explicitamente.

Consulte a Seção 21.4.3.3, "Cadeias de Conexão do NDB Cluster" para obter informações sobre o uso de cadeias de conexão. Seção 21.5.4, "ndb\_mgmd — O Daemon do Servidor de Gerenciamento do NDB Cluster" descreve outras opções para **ndb\_mgmd**.

Os seguintes arquivos são criados ou usados pelo **ndb\_mgmd** em seu diretório inicial e são colocados no `DataDir` conforme especificado no arquivo de configuração `config.ini`. Na lista a seguir, *`node_id`* é o identificador único do nó.

- O arquivo `config.ini` é o arquivo de configuração para o clúster como um todo. Este arquivo é criado pelo usuário e lido pelo servidor de gerenciamento. Seção 21.4, “Configuração do NDB Cluster”, discute como configurar este arquivo.

- `ndb_node_id_cluster.log` é o arquivo de registro de eventos do cluster. Exemplos desses eventos incluem o início e o término do ponto de verificação, eventos de inicialização do nó, falhas no nó e níveis de uso de memória. Uma lista completa dos eventos do cluster com descrições pode ser encontrada em Seção 21.6, “Gestão do NDB Cluster”.

  Por padrão, quando o tamanho do log do cluster atinge um milhão de bytes, o arquivo é renomeado para `ndb_node_id_cluster.log.seq_id`, onde *`seq_id`* é o número de sequência do arquivo de log do cluster. (Por exemplo: Se os arquivos com os números de sequência 1, 2 e 3 já existirem, o próximo arquivo de log é nomeado usando o número `4`.) Você pode alterar o tamanho e o número de arquivos, bem como outras características do log do cluster, usando o parâmetro de configuração `LogDestination`.

- `ndb_node_id_out.log` é o arquivo usado para `stdout` e `stderr` ao executar o servidor de gerenciamento como um daemon.

- `ndb_node_id.pid` é o arquivo de ID de processo usado ao executar o servidor de gerenciamento como um daemon.
