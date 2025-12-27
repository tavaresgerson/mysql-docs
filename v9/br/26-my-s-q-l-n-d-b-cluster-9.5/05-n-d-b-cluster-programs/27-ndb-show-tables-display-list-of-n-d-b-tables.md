### 25.5.27 ndb\_show\_tables — Exibir Lista de Tabelas NDB

**ndb\_show\_tables** exibe uma lista de todos os objetos de banco de dados `NDB` no cluster. Por padrão, isso inclui não apenas tabelas criadas pelo usuário e tabelas `NDB` do sistema, mas também índices específicos de `NDB`, gatilhos internos e objetos de dados do disco do NDB Cluster.

As opções que podem ser usadas com **ndb\_show\_tables** estão mostradas na tabela a seguir. Descrições adicionais seguem a tabela.

#### Uso

```
ndb_show_tables [-c connection_string]
```

* `--character-sets-dir`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--character-sets-dir=caminho</code></td> </tr></tbody></table>

  Diretório que contém conjuntos de caracteres.

* `--connect-retries`

  <table frame="box" rules="all" summary="Propriedades para connect-retries"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--connect-retries=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal">12</code></td> </tr><tr><th>Valor Mínimo</th> <td><code class="literal">0</code></td> </tr><tr><th>Valor Máximo</th> <td><code class="literal">12</code></td> </tr></tbody></table>

  Número de vezes para tentar a conexão antes de desistir.

* `--connect-retry-delay`

<table frame="box" rules="all" summary="Propriedades para connect-retry-delay">
  <tr><th>Formato de linha de comando</th> <td><code class="literal">--connect-retry-delay=#</code></td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor padrão</th> <td><code class="literal">5</code></td> </tr>
  <tr><th>Valor mínimo</th> <td><code class="literal">0</code></td> </tr>
  <tr><th>Valor máximo</th> <td><code class="literal">5</code></td> </tr>
</table>

Número de segundos para esperar entre as tentativas de contato com o servidor de gerenciamento.

* `--connect-string`

<table frame="box" rules="all" summary="Propriedades para connect-string">
  <tr><th>Formato de linha de comando</th> <td><code class="literal">--connect-string=connection_string</code></td> </tr>
  <tr><th>Tipo</th> <td>String</td> </tr>
  <tr><th>Valor padrão</th> <td><code class="literal">[none]</code></td> </tr>
</table>

O mesmo que `--ndb-connectstring`.

* `--core-file`

<table frame="box" rules="all" summary="Propriedades para core-file">
  <tr><th>Formato de linha de comando</th> <td><code class="literal">--core-file</code></td> </tr>
</table>

Escrever o arquivo de código fonte em caso de erro; usado em depuração.

* `--database`, `-d`

Especifica o nome do banco de dados em que a tabela desejada é encontrada. Se esta opção for fornecida, o nome de uma tabela deve seguir o nome do banco de dados.

Se esta opção não tiver sido especificada e nenhuma tabela for encontrada no banco de dados `TEST_DB`, o **ndb\_show\_tables** emite uma mensagem de aviso.

* `--defaults-extra-file`

Leia o arquivo fornecido após a leitura dos arquivos globais.

* `--defaults-file`

  <table frame="box" rules="all" summary="Propriedades para defaults-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--defaults-file=caminho</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">[nenhum]</code></td> </tr></tbody></table>

  Leia as opções padrão do arquivo fornecido.

* `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Propriedades para defaults-group-suffix"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--defaults-group-suffix=string</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">[nenhum]</code></td> </tr></tbody></table>

  Leia também os grupos com concatenação(grupo, sufixo).

* `--help`

  <table frame="box" rules="all" summary="Propriedades para help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--help</code></td> </tr></tbody></table>

  Exibir texto de ajuda e sair.

* `--login-path`

Leia o caminho de login fornecido a partir do arquivo de login.

* `--no-login-paths`

  <table frame="box" rules="all" summary="Propriedades para connect-retries"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--connect-retries=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">[nenhum]</code></td> </tr><tr><th>Valor mínimo</th> <td><code class="literal">0</code></td> </tr><tr><th>Valor máximo</th> <td><code class="literal">12</code></td> </tr></tbody></table>0

  Ignora a leitura de opções do arquivo de caminho de login.

* `--loops`, `-l`

  Especifica o número de vezes que a utilidade deve ser executada. Isso é 1 quando esta opção não é especificada, mas se você usar a opção, você deve fornecer um argumento inteiro para ela.

* `--ndb-connectstring`

Defina a string de conexão para se conectar ao **ndb\_mgmd**. Sintaxe: `[nodeid=id;][host=]hostname[:port]`. Sobrina as entradas em `NDB_CONNECTSTRING` e `my.cnf`.

* `--ndb-mgm-tls`

  <table frame="box" rules="all" summary="Propriedades para retries de conexão"><tr><th>Formato de linha de comando</th> <td><code class="literal">--connect-retries=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">12</code></td> </tr><tr><th>Valor mínimo</th> <td><code class="literal">0</code></td> </tr><tr><th>Valor máximo</th> <td><code class="literal">12</code></td> </tr></table>2

  Define o nível de suporte TLS necessário para se conectar ao servidor de gerenciamento; um dos `relaxado` ou `estricto`. `relaxado` (o padrão) significa que uma conexão TLS é tentada, mas o sucesso não é necessário; `estricto` significa que TLS é necessário para se conectar.

* `--ndb-mgmd-host`

  <table frame="box" rules="all" summary="Propriedades para retries de conexão"><tr><th>Formato de linha de comando</th> <td><code class="literal">--connect-retries=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">12</code></td> </tr><tr><th>Valor mínimo</th> <td><code class="literal">0</code></td> </tr><tr><th>Valor máximo</th> <td><code class="literal">12</code></td> </tr></table>3

  O mesmo que `--ndb-connectstring`.

* `--ndb-nodeid`

<table frame="box" rules="all" summary="Propriedades para connect-retries">
  <tr><th>Formato de linha de comando</th> <td><code class="literal">--connect-retries=#</code></td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor padrão</th> <td><code class="literal">12</code></td> </tr>
  <tr><th>Valor mínimo</th> <td><code class="literal">0</code></td> </tr>
  <tr><th>Valor máximo</th> <td><code class="literal">12</code></td> </tr>
</table>4

  Defina o ID do nó para este nó, substituindo qualquer ID definido por `--ndb-connectstring`.

* `--ndb-optimized-node-selection`

  <table frame="box" rules="all" summary="Propriedades para connect-retries">
    <tr><th>Formato de linha de comando</th> <td><code class="literal">--connect-retries=#</code></td> </tr>
    <tr><th>Tipo</th> <td>Inteiro</td> </tr>
    <tr><th>Valor padrão</th> <td><code class="literal">12</code></td> </tr>
    <tr><th>Valor mínimo</th> <td><code class="literal">0</code></td> </tr>
    <tr><th>Valor máximo</th> <td><code class="literal">12</code></td> </tr>
  </table>5

  Ative otimizações para a seleção de nós para transações. Ativado por padrão; use `--skip-ndb-optimized-node-selection` para desativá-lo.

* `--ndb-tls-search-path`

  <table frame="box" rules="all" summary="Propriedades para connect-retries">
    <tr><th>Formato de linha de comando</th> <td><code class="literal">--connect-retries=#</code></td> </tr>
    <tr><th>Tipo</th> <td>Inteiro</td> </tr>
    <tr><th>Valor padrão</th> <td><code class="literal">12</code></td> </tr>
    <tr><th>Valor mínimo</th> <td><code class="literal">0</code></td> </tr>
    <tr><th>Valor máximo</th> <td><code class="literal">12</code></td> </tr>
  </table>6

Especifique uma lista de diretórios para procurar um arquivo CA. Em plataformas Unix, os nomes dos diretórios são separados por colchetes (`:`); em sistemas Windows, o caractere ponto e vírgula (`;`) é usado como separador. Uma referência de diretório pode ser relativa ou absoluta; pode conter uma ou mais variáveis de ambiente, cada uma denotada por um sinal de dólar prefixado (`$`), e expandida antes de ser usada.

A busca começa com o diretório mais à esquerda e prossegue de esquerda para direita até que um arquivo seja encontrado. Uma string vazia denota um caminho de busca vazio, o que faz com que todas as buscas falhem. Uma string composta por um único ponto (`.`) indica que o caminho de busca é limitado ao diretório de trabalho atual.

Se não for fornecido um caminho de busca, o valor padrão integrado é usado. Esse valor depende da plataforma usada: em Windows, é `\ndb-tls`; em outras plataformas (incluindo Linux), é `$HOME/ndb-tls`. Isso pode ser substituído compilando o NDB Cluster usando `-DWITH_NDB_TLS_SEARCH_PATH`.

* `--no-defaults`

  <table frame="box" rules="all" summary="Propriedades para connect-retries"><tr><th>Formato de linha de comando</th> <td><code class="literal">--connect-retries=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">12</code></td> </tr><tr><th>Valor mínimo</th> <td><code class="literal">0</code></td> </tr><tr><th>Valor máximo</th> <td><code class="literal">12</code></td> </tr></tbody></table>7

  Não leia opções padrão de nenhum arquivo de opção que não seja o arquivo de login.

* `--parsable`, `-p`

  Usar essa opção faz com que a saída seja em um formato adequado para uso com `LOAD DATA`.

* `--print-defaults`

<table frame="box" rules="all" summary="Propriedades para connect-retries"><tr><th>Formato de linha de comando</th> <td><code class="literal">--connect-retries=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">12</code></td> </tr><tr><th>Valor mínimo</th> <td><code class="literal">0</code></td> </tr><tr><th>Valor máximo</th> <td><code class="literal">12</code></td> </tr></table>9

Imprimir a lista de argumentos do programa e sair.

* `--show-status-de-temp`

  Se especificado, isso faz com que as tabelas temporárias sejam exibidas.

* `--type`, `-t`

  Pode ser usado para restringir a saída a um tipo de objeto, especificado por um código de tipo de inteiro como mostrado aqui:

  + `1`: Tabela do sistema
  + `2`: Tabela criada pelo usuário
  + `3`: Índice de hash único

  Qualquer outro valor faz com que todos os objetos do banco de dados `NDB` sejam listados (o padrão).

* `--unqualified`, `-u`

  Se especificado, isso faz com que os nomes de objetos não qualificados sejam exibidos.

* `--usage`

  <table frame="box" rules="all" summary="Propriedades para connect-retries"><col style="width: 30%"/><col style="width: 70%"/><tr><th>Formato de linha de comando</th> <td><code class="literal">--connect-retries=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">12</code></td> </tr><tr><th>Valor mínimo</th> <td><code class="literal">0</code></td> </tr><tr><th>Valor máximo</th> <td><code class="literal">12</code></td> </tr></table>10

  Exibir texto de ajuda e sair; o mesmo que `--help`.

* `--version`

<table frame="box" rules="all" summary="Propriedades para connect-retry-delay">
  <tr><th>Formato de Linha de Comando</th> <td><code class="literal">--connect-retry-delay=#</code></td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code class="literal">5</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code class="literal">0</code></td> </tr>
  <tr><th>Valor Máximo</th> <td><code class="literal">5</code></td> </tr>
</table>0

Exibir informações da versão e sair.

Observação

Apenas as tabelas do NDB Cluster criadas pelo usuário podem ser acessadas a partir do MySQL; as tabelas do sistema, como `SYSTAB_0`, não são visíveis para o **mysqld**. No entanto, você pode examinar o conteúdo das tabelas do sistema usando aplicativos da API **ndb**, como **ndb\_select\_all** (consulte a Seção 25.5.25, “ndb\_select\_all — Imprimir Linhas de uma Tabela NDB”).