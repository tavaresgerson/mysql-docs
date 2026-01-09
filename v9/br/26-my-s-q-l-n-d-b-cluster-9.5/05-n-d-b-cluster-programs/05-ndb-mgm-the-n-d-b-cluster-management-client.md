### 25.5.5 ndb_mgm — O cliente de gerenciamento do NDB Cluster

O processo do cliente de gerenciamento **ndb_mgm** não é realmente necessário para executar o cluster. Seu valor reside em fornecer um conjunto de comandos para verificar o status do cluster, iniciar backups e realizar outras funções administrativas. O cliente de gerenciamento acessa o servidor de gerenciamento usando uma API C. Usuários avançados também podem usar essa API para programar processos de gerenciamento dedicados para realizar tarefas semelhantes às executadas pelo **ndb_mgm**.

Para iniciar o cliente de gerenciamento, é necessário fornecer o nome do host e o número de porta do servidor de gerenciamento:

```
$> ndb_mgm [host_name [port_num]]
```

Por exemplo:

```
$> ndb_mgm ndb_mgmd.mysql.com 1186
```

O nome do host e o número de porta padrão são `localhost` e 1186, respectivamente.

Todas as opções que podem ser usadas com **ndb_mgm** estão mostradas na tabela a seguir. Descrições adicionais seguem a tabela.

* `--backup-password-from-stdin[=TRUE|FALSE]`

  <table frame="box" rules="all" summary="Propriedades para backup-password-from-stdin"><tbody><tr><th>Formato de linha de comando</th> <td><code>--backup-password-from-stdin</code></td> </tr></tbody></table>

  Esta opção permite a entrada da senha de backup a partir da shell do sistema (`stdin`) ao usar `--execute "START BACKUP"` ou similar para criar um backup. O uso desta opção requer o uso de `--execute`.

* `--character-sets-dir`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td><code>--character-sets-dir=caminho</code></td> </tr></tbody></table>

  Diretório contendo conjuntos de caracteres.

* `--connect-retries=#`

<table frame="box" rules="all" summary="Propriedades para connect-retries">
  <tr><th>Formato de Linha de Comando</th> <td><code>--connect-retries=#</code></td> </tr>
  <tr><th>Tipo</th> <td>Numérico</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>3</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr>
  <tr><th>Valor Máximo</th> <td><code>4294967295</code></td> </tr>
</table>

  Esta opção especifica o número de vezes que o cliente tentará reconectar após a primeira tentativa de conexão antes de desistir (o cliente sempre tenta a conexão pelo menos uma vez). O tempo de espera por tentativa é definido usando `--connect-retry-delay`.

  Esta opção é sinônima da opção `--try-reconnect`, que agora está desatualizada.

* `--connect-retry-delay`

  <table frame="box" rules="all" summary="Propriedades para connect-retry-delay">
    <tr><th>Formato de Linha de Comando</th> <td><code>--connect-retry-delay=#</code></td> </tr>
    <tr><th>Tipo</th> <td>Inteiro</td> </tr>
    <tr><th>Valor Padrão</th> <td><code>5</code></td> </tr>
    <tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr>
    <tr><th>Valor Máximo</th> <td><code>5</code></td> </tr>
  </table>

  Número de segundos para esperar entre tentativas de contato com o servidor de gerenciamento.

* `--connect-string`

<table frame="box" rules="all" summary="Propriedades para connect-string">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code>--connect-string=connection_string</code></td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>String</td>
  </tr>
  <tr>
    <th>Valor padrão</th>
    <td><code>[none]</code></td>
  </tr>
</table>

  O mesmo que `--ndb-connectstring`.

* `--core-file`

  <table frame="box" rules="all" summary="Propriedades para core-file">
    <tr>
      <th>Formato de linha de comando</th>
      <td><code>--core-file</code></td>
    </tr>
  </table>

  Escrever o arquivo de código fonte em caso de erro; usado em depuração.

* `--defaults-extra-file`

  <table frame="box" rules="all" summary="Propriedades para defaults-extra-file">
    <tr>
      <th>Formato de linha de comando</th>
      <td><code>--defaults-extra-file=caminho</code></td>
    </tr>
  </table>

  Ler o arquivo fornecido após a leitura dos arquivos globais.

* `--defaults-file`

  <table frame="box" rules="all" summary="Propriedades para defaults-file">
    <tr>
      <th>Formato de linha de comando</th>
      <td><code>--defaults-file=caminho</code></td>
    </tr>
  </table>

  Ler as opções padrão do arquivo fornecido.

* `--defaults-group-suffix`

<table frame="box" rules="all" summary="Propriedades para defaults-group-suffix">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--defaults-group-suffix=string</code></td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>String</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>[none]</code></td>
  </tr>
</table>

  Leia também grupos com concatenação(grupo, sufixo).

* `--encrypt-backup`

  <table frame="box" rules="all" summary="Propriedades para encrypt-backup">
  <tbody>
    <tr>
      <th>Formato de Linha de Comando</th>
      <td><code>--encrypt-backup</code></td>
    </tr>
  </tbody></table>

  Quando usado, esta opção faz com que todos os backups sejam criptografados. Para que isso aconteça sempre que o **ndb_mgm** for executado, coloque a opção na seção `[ndb_mgm]` do arquivo `my.cnf`.

* `--execute=command`, `-e command`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir">
  <tbody>
    <tr>
      <th>Formato de Linha de Comando</th>
      <td><code>--character-sets-dir=caminho</code></td>
    </tr>
  </tbody></table>

  Esta opção pode ser usada para enviar um comando ao cliente de gerenciamento do NDB Cluster do shell do sistema. Por exemplo, qualquer um dos seguintes é equivalente à execução do `SHOW` no cliente de gerenciamento:

  ```
  $> ndb_mgm -e "SHOW"

  $> ndb_mgm --execute="SHOW"
  ```

  Isso é análogo ao modo como a opção `--execute` ou `-e` funciona com o cliente de linha de comando do **mysql**. Veja a Seção 6.2.2.1, “Usando Opções na Linha de Comando”.

  Nota

Se o comando do cliente de gerenciamento a ser passado usando essa opção contiver caracteres de espaço, então o comando *deve* ser fechado entre aspas. Podem ser usadas aspas simples ou duplas. Se o comando do cliente de gerenciamento não contiver caracteres de espaço, as aspas são opcionais.

* `--help`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td><code>--character-sets-dir=caminho</code></td> </tr></tbody></table>

  Exibir texto de ajuda e sair.

* `--login-path`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td><code>--character-sets-dir=caminho</code></td> </tr></tbody></table>

  Ler o caminho fornecido a partir do arquivo de login.

* `--no-login-paths`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td><code>--character-sets-dir=caminho</code></td> </tr></tbody></table>

  Ignora a leitura de opções a partir do arquivo de caminho de login.

* `--ndb-connectstring`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td><code>--character-sets-dir=caminho</code></td> </tr></tbody></table>

  Definir a string de conexão para se conectar ao **ndb_mgmd**. Sintaxe: [`nodeid=id;`][`host=`]`hostname`[`:port`]. Sobrescreve entradas em `NDB_CONNECTSTRING` e `my.cnf`.

* `--ndb-nodeid`

<table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tr><th style="width: 30%">Formato de linha de comando</th><td><code>--character-sets-dir=caminho</code></td></tr></table>

  Defina o ID do nó para este nó, substituindo qualquer ID definido por `--ndb-connectstring`.

* `--ndb-mgm-tls`

<table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tr><th style="width: 30%">Formato de linha de comando</th><td><code>--character-sets-dir=caminho</code></td></tr></table>

  Define o nível de suporte TLS necessário para se conectar ao servidor de gerenciamento; um dos valores `relaxado` ou `estricto`. `relaxado` (o padrão) significa que uma conexão TLS é tentada, mas o sucesso não é necessário; `estricto` significa que o TLS é necessário para se conectar.

* `--ndb-mgm-host`

<table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tr><th style="width: 30%">Formato de linha de comando</th><td><code>--character-sets-dir=caminho</code></td></tr></table>

  O mesmo que `--ndb-connectstring`.

* `--ndb-optimized-node-selection`

<table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tr><th style="width: 30%">Formato de linha de comando</th><td><code>--character-sets-dir=caminho</code></td></tr></table>

  Ative otimizações para a seleção de nós para transações. Ativado por padrão; use `--skip-ndb-optimized-node-selection` para desativá-lo.

* `--ndb-tls-search-path`

<table frame="box" rules="all" summary="Propriedades para character-sets-dir">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--character-sets-dir=caminho</code></td>
  </tr>
</table>
9

  Especifique uma lista de diretórios para procurar um arquivo CA. Em plataformas Unix, os nomes dos diretórios são separados por colchetes (`:`); em sistemas Windows, o caractere ponto-e-vírgula (`;`) é usado como separador. Uma referência de diretório pode ser relativa ou absoluta; pode conter uma ou mais variáveis de ambiente, cada uma denotada por um sinal de dólar prefixado (`$`), e expandida antes do uso.

  A busca começa com o diretório mais à esquerda nomeado e prossegue de esquerda para direita até que um arquivo seja encontrado. Uma string vazia denota um caminho de busca vazio, o que faz com que todas as buscas falhem. Uma string composta por um único ponto (`.`) indica que o caminho de busca é limitado ao diretório de trabalho atual.

  Se não for fornecido um caminho de busca, o valor padrão embutido é usado. Esse valor depende da plataforma usada: em Windows, é `\ndb-tls`; em outras plataformas (incluindo Linux), é `$HOME/ndb-tls`. Isso pode ser sobreposto compilando o NDB Cluster usando `-DWITH_NDB_TLS_SEARCH_PATH`.

* `--no-defaults`

Não leia as opções padrão de nenhum arquivo de opção, exceto o arquivo de login.

* `--print-defaults`

  <table frame="box" rules="all" summary="Propriedades para connect-retries"><tbody><tr><th>Formato de linha de comando</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td><code>3</code></td> </tr><tr><th>Valor mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor máximo</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Imprima a lista de argumentos do programa e saia.

* `--test-tls`

  <table frame="box" rules="all" summary="Propriedades para connect-retries"><tbody><tr><th>Formato de linha de comando</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td><code>3</code></td> </tr><tr><th>Valor mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor máximo</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Conecte-se usando TLS e, em seguida, saia. A saída, se bem-sucedida, é semelhante à mostrada aqui:

  ```
  >$ ndb_mgm --test-tls
  Connected to Management Server at: sakila:1186
  >$
  ```

  Consulte a Seção 25.6.19.5, “Encriptação de Link TLS para NDB Cluster”, para obter mais informações.

* `--try-reconnect=número`

<table frame="box" rules="all" summary="Propriedades para connect-retries">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code>--connect-retries=#</code></td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Numérico</td>
  </tr>
  <tr>
    <th>Valor padrão</th>
    <td><code>3</code></td>
  </tr>
  <tr>
    <th>Valor mínimo</th>
    <td><code>0</code></td>
  </tr>
  <tr>
    <th>Valor máximo</th>
    <td><code>4294967295</code></td>
  </tr>
</table>

  Se a conexão com o servidor de gerenciamento for interrompida, o nó tenta reconectar a ele a cada 5 segundos até que consiga. Ao usar essa opção, é possível limitar o número de tentativas a *`número`* antes de desistir e reportar um erro.

  Essa opção está desatualizada e sujeita à remoção em uma futura versão. Use `--connect-retries`, em vez disso.

* `--usage`

  <table frame="box" rules="all" summary="Propriedades para connect-retries">
    <tr>
      <th>Formato de linha de comando</th>
      <td><code>--connect-retries=#</code></td>
    </tr>
    <tr>
      <th>Tipo</th>
      <td>Numérico</td>
    </tr>
    <tr>
      <th>Valor padrão</th>
      <td><code>3</code></td>
    </tr>
    <tr>
      <th>Valor mínimo</th>
      <td><code>0</code></td>
    </tr>
    <tr>
      <th>Valor máximo</th>
      <td><code>4294967295</code></td>
    </tr>
  </table>

  Exibir texto de ajuda e sair; o mesmo que `--help`.

* `--version`

<table frame="box" rules="all" summary="Propriedades para connect-retries">
  <tr><th>Formato de Linha de Comando</th> <td><code>--connect-retries=#</code></td> </tr>
  <tr><th>Tipo</th> <td>Numérico</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>3</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr>
  <tr><th>Valor Máximo</th> <td><code>4294967295</code></td> </tr>
</table>

Exibir informações da versão e sair.

Informações adicionais sobre o uso do **ndb_mgm** podem ser encontradas na Seção 25.6.1, “Comandos no Cliente de Gerenciamento do NDB Cluster”.