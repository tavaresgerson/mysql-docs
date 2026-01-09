### 25.5.26 ndb_select_count — Imprimir Contagem de Linhas para Tabelas NDB

**ndb_select_count** imprime o número de linhas em uma ou mais tabelas `NDB`. Com uma única tabela, o resultado é equivalente ao obtido usando a instrução MySQL `SELECT COUNT(*) FROM tbl_name`.

#### Uso

```
ndb_select_count [-c connection_string] -ddb_name tbl_name[, tbl_name2[, ...]]
```

As opções que podem ser usadas com **ndb_select_count** estão mostradas na tabela a seguir. Descrições adicionais seguem a tabela.

* `--character-sets-dir`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--character-sets-dir=caminho</code></td> </tr></tbody></table>

  Diretório que contém conjuntos de caracteres.

* `--connect-retries`

  <table frame="box" rules="all" summary="Propriedades para connect-retries"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>12</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>12</code></td> </tr></tbody></table>

  Número de vezes para tentar a conexão novamente antes de desistir.

* `--connect-retry-delay`

<table frame="box" rules="all" summary="Propriedades para connect-retry-delay">
  <tr><th>Formato de linha de comando</th> <td><code>--connect-retry-delay=#</code></td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor padrão</th> <td><code>5</code></td> </tr>
  <tr><th>Valor mínimo</th> <td><code>0</code></td> </tr>
  <tr><th>Valor máximo</th> <td><code>5</code></td> </tr>
</table>

Número de segundos para esperar entre as tentativas de contato com o servidor de gerenciamento.

* `--connect-string`

<table frame="box" rules="all" summary="Propriedades para connect-string">
  <tr><th>Formato de linha de comando</th> <td><code>--connect-string=connection_string</code></td> </tr>
  <tr><th>Tipo</th> <td>String</td> </tr>
  <tr><th>Valor padrão</th> <td><code>[none]</code></td> </tr>
</table>

O mesmo que `--ndb-connectstring`.

* `--core-file`

<table frame="box" rules="all" summary="Propriedades para core-file">
  <tr><th>Formato de linha de comando</th> <td><code>--core-file</code></td> </tr>
</table>

Escrever o arquivo de código apenas em caso de erro; usado em depuração.

* `--defaults-file`

<table frame="box" rules="all" summary="Propriedades para defaults-file">
  <tr><th>Formato de linha de comando</th> <td><code>--defaults-file=caminho</code></td> </tr>
</table>

Ler as opções padrão do arquivo fornecido.

* `--defaults-extra-file`

Leia o arquivo fornecido após a leitura dos arquivos globais.

* `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Propriedades para defaults-group-suffix"><tbody><tr><th>Formato de linha de comando</th> <td><code>--defaults-group-suffix=string</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  Leia também os grupos com concatenação(grupo, sufixo).

* `--login-path`

  <table frame="box" rules="all" summary="Propriedades para login-path"><tbody><tr><th>Formato de linha de comando</th> <td><code>--login-path=caminho</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  Leia o caminho fornecido a partir do arquivo de login.

* `--no-login-paths`

  <table frame="box" rules="all" summary="Propriedades para no-login-paths"><tbody><tr><th>Formato de linha de comando</th> <td><code>--no-login-paths</code></td> </tr></tbody></table>

  Ignora a leitura das opções do arquivo de caminho de login.

* `--help`

<table frame="box" rules="all" summary="Propriedades para connect-retries">
  <tr><th>Formato de linha de comando</th> <td><code>--connect-retries=#</code></td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor padrão</th> <td><code>12</code></td> </tr>
  <tr><th>Valor mínimo</th> <td><code>0</code></td> </tr>
  <tr><th>Valor máximo</th> <td><code>12</code></td> </tr>
</table>

  Exibir texto de ajuda e sair.

* `--ndb-connectstring`

  <table frame="box" rules="all" summary="Propriedades para connect-retries">
    <tr><th>Formato de linha de comando</th> <td><code>--connect-retries=#</code></td> </tr>
    <tr><th>Tipo</th> <td>Inteiro</td> </tr>
    <tr><th>Valor padrão</th> <td><code>12</code></td> </tr>
    <tr><th>Valor mínimo</th> <td><code>0</code></td> </tr>
    <tr><th>Valor máximo</th> <td><code>12</code></td> </tr>
  </table>

  Definir a string de conexão para conectar-se ao **ndb_mgmd**. Sintaxe: `[nodeid=id;][host=]hostname[:port]`. Sobrina as entradas em `NDB_CONNECTSTRING` e `my.cnf`.

* `--ndb-mgm-tls`

  <table frame="box" rules="all" summary="Propriedades para connect-retries">
    <tr><th>Formato de linha de comando</th> <td><code>--connect-retries=#</code></td> </tr>
    <tr><th>Tipo</th> <td>Inteiro</td> </tr>
    <tr><th>Valor padrão</th> <td><code>12</code></td> </tr>
    <tr><th>Valor mínimo</th> <td><code>0</code></td> </tr>
    <tr><th>Valor máximo</th> <td><code>12</code></td> </tr>
  </table>

Define o nível de suporte TLS necessário para se conectar ao servidor de gerenciamento; `relaxed` ou `strict`. `relaxed` (o padrão) significa que uma conexão TLS é tentada, mas o sucesso não é necessário; `strict` significa que o TLS é necessário para se conectar.

* `--ndb-mgmd-host`

  <table frame="box" rules="all" summary="Propriedades para connect-retries"><tbody><tr><th>Formato de linha de comando</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>12</code></td> </tr><tr><th>Valor mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor máximo</th> <td><code>12</code></td> </tr></tbody></table>

  O mesmo que `--ndb-connectstring`.

* `--ndb-nodeid`

  <table frame="box" rules="all" summary="Propriedades para connect-retries"><tbody><tr><th>Formato de linha de comando</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>12</code></td> </tr><tr><th>Valor mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor máximo</th> <td><code>12</code></td> </tr></tbody></table>

  Defina o ID do nó para este nó, substituindo qualquer ID definido por `--ndb-connectstring`.

* `--ndb-optimized-node-selection`

<table frame="box" rules="all" summary="Propriedades para connect-retries">
  <tr><th>Formato de Linha de Comando</th> <td><code>--connect-retries=#</code></td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>12</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr>
  <tr><th>Valor Máximo</th> <td><code>12</code></td> </tr>
</table>

  Ative otimizações para a seleção de nós para transações. Ativado por padrão; use `--skip-ndb-optimized-node-selection` para desativá-lo.

* `--ndb-tls-search-path`

  <table frame="box" rules="all" summary="Propriedades para connect-retries">
    <tr><th>Formato de Linha de Comando</th> <td><code>--connect-retries=#</code></td> </tr>
    <tr><th>Tipo</th> <td>Inteiro</td> </tr>
    <tr><th>Valor Padrão</th> <td><code>12</code></td> </tr>
    <tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr>
    <tr><th>Valor Máximo</th> <td><code>12</code></td> </tr>
  </table>

  Especifique uma lista de diretórios para pesquisar por um arquivo CA. Em plataformas Unix, os nomes dos diretórios são separados por colchetes (`:`); em sistemas Windows, o caractere ponto e vírgula (`;`) é usado como separador. Uma referência de diretório pode ser relativa ou absoluta; pode conter uma ou mais variáveis de ambiente, cada uma denotada por um sinal de dólar prefixado (`$`), e expandida antes de uso.

A busca começa com o diretório nomeado mais à esquerda e prossegue de esquerda para direita até que um arquivo seja encontrado. Uma string vazia indica um caminho de busca vazio, o que faz com que todas as buscas falhem. Uma string composta por um único ponto (`.`) indica que o caminho de busca é limitado ao diretório de trabalho atual.

Se não for fornecido um caminho de busca, o valor padrão integrado é usado. Esse valor depende da plataforma usada: no Windows, é `\ndb-tls`; em outras plataformas (incluindo Linux), é `$HOME/ndb-tls`. Isso pode ser sobreposto compilando o NDB Cluster usando `-DWITH_NDB_TLS_SEARCH_PATH`.

* `--no-defaults`

  <table frame="box" rules="all" summary="Propriedades para connect-retries"><tbody><tr><th>Formato de linha de comando</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>12</code></td> </tr><tr><th>Valor mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor máximo</th> <td><code>12</code></td> </tr></tbody></table>

  Não leia opções padrão de nenhum arquivo de opção que não seja o arquivo de login.

* `--print-defaults`

  <table frame="box" rules="all" summary="Propriedades para connect-retries"><tbody><tr><th>Formato de linha de comando</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>12</code></td> </tr><tr><th>Valor mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor máximo</th> <td><code>12</code></td> </tr></tbody></table>

  Imprima a lista de argumentos do programa e saia.

* `--usage`

<table frame="box" rules="all" summary="Propriedades para connect-retries">
  <tr><th>Formato de linha de comando</th> <td><code>--connect-retries=#</code></td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor padrão</th> <td><code>12</code></td> </tr>
  <tr><th>Valor mínimo</th> <td><code>0</code></td> </tr>
  <tr><th>Valor máximo</th> <td><code>12</code></td> </tr>
</table>

9 Exibir texto de ajuda e sair; o mesmo que `--help`.

* `--version`

<table frame="box" rules="all" summary="Propriedades para connect-retry-delay">
  <tr><th>Formato de linha de comando</th> <td><code>--connect-retry-delay=#</code></td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor padrão</th> <td><code>5</code></td> </tr>
  <tr><th>Valor mínimo</th> <td><code>0</code></td> </tr>
  <tr><th>Valor máximo</th> <td><code>5</code></td> </tr>
</table>

0 Exibir informações da versão e sair.

Você pode obter contagem de linhas de várias tabelas no mesmo banco de dados listando os nomes das tabelas separados por espaços ao invocar este comando, conforme mostrado na **Saída de exemplo**.

#### Saída de exemplo

```
$> ./ndb_select_count -c localhost -d ctest1 fish dogs
6 records in table fish
4 records in table dogs
```