### 25.5.5 ndb\_mgm — O cliente de gerenciamento de cluster NDB

O processo de cliente de gerenciamento **ndb\_mgm** não é realmente necessário para executar o clúster. Seu valor reside em fornecer um conjunto de comandos para verificar o status do clúster, iniciar backups e realizar outras funções administrativas. O cliente de gerenciamento acessa o servidor de gerenciamento usando uma API C. Usuários avançados também podem usar essa API para programar processos de gerenciamento dedicados para realizar tarefas semelhantes às executadas pelo **ndb\_mgm**.

Para iniciar o cliente de gerenciamento, é necessário fornecer o nome do host e o número de porta do servidor de gerenciamento:

```
$> ndb_mgm [host_name [port_num]]
```

Por exemplo:

```
$> ndb_mgm ndb_mgmd.mysql.com 1186
```

O nome de host padrão e o número de porta são `localhost` e 1186, respectivamente.

Todas as opções que podem ser usadas com **ndb\_mgm** estão mostradas na tabela a seguir. Descrições adicionais seguem a tabela.

**Tabela 25.27 Opções de linha de comando usadas com o programa ndb\_mgm**

<table frame="box" rules="all"><thead><tr> <th scope="col">Formato</th> <th scope="col">Descrição</th> <th scope="col">Adicionado, Descontinuado ou Removido</th> </tr></thead><tbody><tr> <th><p> [[PH_HTML_CODE_<code> --encrypt-backup </code>] </p></th> <td>Obtenha a senha de descriptografia de forma segura a partir do STDIN; use junto com a opção --execute e o comando ndb_mgm START BACKUP</td> <td><p>ADICIONADO: NDB 8.0.24</p></td> </tr></tbody><tbody><tr> <th><p> [[PH_HTML_CODE_<code> --encrypt-backup </code>] </p></th> <td>Diretório contendo conjuntos de caracteres</td> <td><p>REMOvido: 8.0.31</p></td> </tr></tbody><tbody><tr> <th><p> [[PH_HTML_CODE_<code> -e command </code>] </p></th> <td>Defina o número de vezes para tentar a conexão novamente antes de desistir; 0 significa apenas uma tentativa (e nenhuma tentativa adicional)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[PH_HTML_CODE_<code>--help</code>] </p></th> <td>Número de segundos para esperar entre as tentativas de contato com o servidor de gerenciamento</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p>[[PH_HTML_CODE_<code> -? </code>],</p><p> [[PH_HTML_CODE_<code> --login-path=path </code>] </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[PH_HTML_CODE_<code>--ndb-connectstring=connection_string</code>] </p></th> <td>Escreva o arquivo de núcleo em erro; usado no depuração</td> <td><p>REMOvido: 8.0.31</p></td> </tr></tbody><tbody><tr> <th><p> [[PH_HTML_CODE_<code> -c connection_string </code>] </p></th> <td>Leia o arquivo fornecido após os arquivos globais terem sido lidos</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[PH_HTML_CODE_<code>--ndb-mgmd-host=connection_string</code>] </p></th> <td>Ler opções padrão a partir do arquivo fornecido apenas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[PH_HTML_CODE_<code> -c connection_string </code>] </p></th> <td>Leia também grupos com concatenação(grupo, sufixo)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --encrypt-backup </code>]] </p></th> <td>Faça com que o BACKUP COMECE a criptografar sempre que fazer um backup, solicitando a senha se não for fornecida pelo usuário</td> <td><p>ADICIONADO: NDB 8.0.24</p></td> </tr></tbody><tbody><tr> <th><p>[[<code> --character-sets-dir=path </code><code> --encrypt-backup </code>],</p><p> [[<code> -e command </code>]] </p></th> <td>Execute o comando e saia</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code>--help</code>]],</p><p> [[<code> -? </code>]] </p></th> <td>Exibir texto de ajuda e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --login-path=path </code>]] </p></th> <td>Leia o caminho fornecido a partir do arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code>--ndb-connectstring=connection_string</code>]],</p><p> [[<code> -c connection_string </code>]] </p></th> <td>Defina a string de conexão para se conectar ao ndb_mgmd. Sintaxe: "[nodeid=id;][host=]hostname[:por<code> --encrypt-backup </code>". Substitui as entradas no NDB_CONNECTSTRING e no my.cnf</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code>--ndb-mgmd-host=connection_string</code>]],</p><p> [[<code> -c connection_string </code>]] </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --connect-retries=# </code><code> --encrypt-backup </code>] </p></th> <td>Defina o ID do nó para este nó, substituindo qualquer ID definida pela opção --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --connect-retries=# </code><code> --encrypt-backup </code>] </p></th> <td>Ative as otimizações para a seleção de nós para transações. Ativado por padrão; use --skip-ndb-optimized-node-selection para desativá-lo</td> <td><p>REMOvido: 8.0.31</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --connect-retries=# </code><code> -e command </code>] </p></th> <td>Não leia as opções padrão de nenhum arquivo de opção, exceto o arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --connect-retries=# </code><code>--help</code>] </p></th> <td>Imprimir a lista de argumentos do programa e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code> --connect-retries=# </code><code> -? </code>],</p><p> [[<code> --connect-retries=# </code><code> --login-path=path </code>] </p></th> <td>Defina o número de vezes para tentar a conexão novamente antes de desistir; sinônimo de --connect-retries</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code> --connect-retries=# </code><code>--ndb-connectstring=connection_string</code>],</p><p> [[<code> --connect-retries=# </code><code> -c connection_string </code>] </p></th> <td>Exibir texto de ajuda e sair; o mesmo que --help</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code> --connect-retries=# </code><code>--ndb-mgmd-host=connection_string</code>],</p><p> [[<code> --connect-retries=# </code><code> -c connection_string </code>] </p></th> <td>Exibir informações da versão e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody></table>

- `--backup-password-from-stdin[=TRUE|FALSE]`

  <table summary="Propriedades para senha de backup a partir de stdin"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--backup-password-from-stdin</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.24-ndb-8.0.24</td> </tr></tbody></table>

  Essa opção permite a entrada da senha de backup a partir da shell do sistema (`stdin`) ao usar `--execute "START BACKUP"` ou algo semelhante para criar um backup. O uso dessa opção também requer o uso de `--execute`.

- `--character-sets-dir`

  <table summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr><tr><th>Removido</th> <td>8.0.31</td> </tr></tbody></table>

  Diretório contendo conjuntos de caracteres.

- `--connect-retries=#`

  <table summary="Propriedades para tentativas de conexão de reposição"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--connect-retries=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td>[[<code>3</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>4294967295</code>]]</td> </tr></tbody></table>

  Esta opção especifica o número de vezes que a conexão será retente após a primeira tentativa de retente (o cliente sempre tenta a conexão pelo menos uma vez). O tempo de espera por tentativa é definido usando `--connect-retry-delay`.

  Esta opção é sinônimo da opção `--try-reconnect`, que agora está desatualizada.

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

- `--encrypt-backup`

  <table summary="Propriedades para senha de backup a partir de stdin"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--backup-password-from-stdin</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.24-ndb-8.0.24</td> </tr></tbody></table>0

  Quando usada, esta opção faz com que todos os backups sejam criptografados. Para que isso aconteça sempre que o **ndb\_mgm** for executado, coloque a opção na seção `[ndb_mgm]` do arquivo `my.cnf`.

- `--execute=command`, `-e command`

  <table summary="Propriedades para senha de backup a partir de stdin"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--backup-password-from-stdin</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.24-ndb-8.0.24</td> </tr></tbody></table>1

  Essa opção pode ser usada para enviar um comando ao cliente de gerenciamento do NDB Cluster a partir do shell do sistema. Por exemplo, qualquer um dos seguintes comandos é equivalente à execução de `SHOW` no cliente de gerenciamento:

  ```
  $> ndb_mgm -e "SHOW"

  $> ndb_mgm --execute="SHOW"
  ```

  Isso é análogo ao funcionamento da opção `--execute` ou `-e` com o cliente de linha de comando **mysql**. Veja a Seção 6.2.2.1, “Usando Opções na Linha de Comando”.

  Nota

  Se o comando do cliente de gerenciamento a ser passado usando essa opção contiver caracteres de espaço, então o comando *deve* ser fechado entre aspas. Pode-se usar aspas simples ou duplas. Se o comando do cliente de gerenciamento não contiver caracteres de espaço, as aspas são opcionais.

- `--help`

  <table summary="Propriedades para senha de backup a partir de stdin"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--backup-password-from-stdin</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.24-ndb-8.0.24</td> </tr></tbody></table>2

  Exibir texto de ajuda e sair.

- `--login-path`

  <table summary="Propriedades para senha de backup a partir de stdin"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--backup-password-from-stdin</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.24-ndb-8.0.24</td> </tr></tbody></table>3

  Leia o caminho fornecido a partir do arquivo de login.

- `--ndb-connectstring`

  <table summary="Propriedades para senha de backup a partir de stdin"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--backup-password-from-stdin</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.24-ndb-8.0.24</td> </tr></tbody></table>4

  Defina a string de conexão para se conectar ao **ndb\_mgmd**. Sintaxe: \[`nodeid=id;`]\[`host=`]`hostname`\[`:port`]. Substitui as entradas em `NDB_CONNECTSTRING` e `my.cnf`.

- `--ndb-nodeid`

  <table summary="Propriedades para senha de backup a partir de stdin"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--backup-password-from-stdin</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.24-ndb-8.0.24</td> </tr></tbody></table>5

  Defina o ID do nó para este nó, substituindo qualquer ID definida por `--ndb-connectstring`.

- `--ndb-mgmd-host`

  <table summary="Propriedades para senha de backup a partir de stdin"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--backup-password-from-stdin</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.24-ndb-8.0.24</td> </tr></tbody></table>6

  O mesmo que `--ndb-connectstring`.

- `--ndb-optimized-node-selection`

  <table summary="Propriedades para senha de backup a partir de stdin"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--backup-password-from-stdin</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.24-ndb-8.0.24</td> </tr></tbody></table>7

  Ative as otimizações para a seleção de nós para transações. Ativado por padrão; use `--skip-ndb-optimized-node-selection` para desativá-lo.

- `--no-defaults`

  <table summary="Propriedades para senha de backup a partir de stdin"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--backup-password-from-stdin</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.24-ndb-8.0.24</td> </tr></tbody></table>8

  Não leia as opções padrão de nenhum arquivo de opção, exceto o arquivo de login.

- `--print-defaults`

  <table summary="Propriedades para senha de backup a partir de stdin"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--backup-password-from-stdin</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.24-ndb-8.0.24</td> </tr></tbody></table>9

  Imprima a lista de argumentos do programa e saia.

- `--try-reconnect=number`

  <table summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr><tr><th>Removido</th> <td>8.0.31</td> </tr></tbody></table>0

  Se a conexão com o servidor de gerenciamento for interrompida, o nó tenta reconectar-se a ele a cada 5 segundos até conseguir. Ao usar essa opção, é possível limitar o número de tentativas a `number` antes de desistir e relatar um erro.

  Esta opção está desatualizada e está sujeita à remoção em uma futura versão. Use `--connect-retries`, em vez disso.

- `--usage`

  <table summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr><tr><th>Removido</th> <td>8.0.31</td> </tr></tbody></table>1

  Exibir texto de ajuda e sair; o mesmo que `--help`.

- `--version`

  <table summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr><tr><th>Removido</th> <td>8.0.31</td> </tr></tbody></table>2

  Exibir informações da versão e sair.

Informações adicionais sobre o uso do **ndb\_mgm** podem ser encontradas na Seção 25.6.1, “Comandos no Cliente de Gerenciamento de NDB Cluster”.
