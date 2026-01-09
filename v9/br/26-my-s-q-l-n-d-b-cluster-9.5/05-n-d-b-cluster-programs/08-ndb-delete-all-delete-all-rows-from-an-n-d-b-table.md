### 25.5.8 ndb_delete_all — Deletar Todas as Linhas de uma Tabela NDB

**ndb_delete_all** exclui todas as linhas da tabela `NDB` especificada. Em alguns casos, isso pode ser muito mais rápido do que `DELETE` ou até mesmo `TRUNCATE TABLE`.

#### Uso

```
ndb_delete_all -c connection_string tbl_name -d db_name
```

Isso exclui todas as linhas da tabela chamada *`tbl_name`* no banco de dados chamado *`db_name`*. É exatamente equivalente a executar `TRUNCATE db_name.tbl_name` no MySQL.

As opções que podem ser usadas com **ndb_delete_all** estão mostradas na tabela a seguir. Descrições adicionais seguem a tabela.

* `--character-sets-dir`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--character-sets-dir=caminho</code></td> </tr></tbody></table>

  Diretório que contém conjuntos de caracteres.

* `--connect-retries`

  <table frame="box" rules="all" summary="Propriedades para connect-retries"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>12</code></td> </tr><tr><th>Valor Mínima</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>12</code></td> </tr></tbody></table>

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

Escrever o arquivo de código fonte em caso de erro; usado em depuração.

* `--database`, `-d`

<table frame="box" rules="all" summary="Propriedades para database">
  <tr><th>Formato de linha de comando</th> <td><code>--database=name</code></td> </tr>
  <tr><th>Tipo</th> <td>String</td> </tr>
  <tr><th>Valor padrão</th> <td><code>TEST_DB</code></td> </tr>
</table>

Nome do banco de dados que contém a tabela a ser excluída.

* `--defaults-extra-file`

Leia o arquivo fornecido após a leitura dos arquivos globais.

* `--defaults-file`

  <table frame="box" rules="all" summary="Propriedades para defaults-file"><tbody><tr><th>Formato de linha de comando</th> <td><code>--defaults-file=caminho</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>[nenhum]</code></td> </tr></tbody></table>

  Leia as opções padrão do arquivo fornecido.

* `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Propriedades para defaults-group-suffix"><tbody><tr><th>Formato de linha de comando</th> <td><code>--defaults-group-suffix=string</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>[nenhum]</code></td> </tr></tbody></table>

  Leia também os grupos com concatenação(grupo, sufixo).

* `--diskscan`

  <table frame="box" rules="all" summary="Propriedades para diskscan"><tbody><tr><th>Formato de linha de comando</th> <td><code>--diskscan</code></td> </tr></tbody></table>

  Execute uma varredura de disco.

* `--help`

<table frame="box" rules="all" summary="Propriedades para connect-retries">
  <tr>
    <th>Formato de linha de comando</th> <td><code>--connect-retries=#</code></td> </tr>
    <th>Tipo</th> <td>Inteiro</td> </tr>
    <tr>
      <th>Valor padrão</th> <td><code>12</code></td> </tr>
    <tr>
      <th>Valor mínimo</th> <td><code>0</code></td> </tr>
    <tr>
      <th>Valor máximo</th> <td><code>12</code></td> </tr>
  </tr>
</table>

  Exibir texto de ajuda e sair.

* `--login-path`

  <table frame="box" rules="all" summary="Propriedades para connect-retries">
    <tr>
      <th>Formato de linha de comando</th> <td><code>--connect-retries=#</code></td> </tr>
      <th>Tipo</th> <td>Inteiro</td> </tr>
      <tr>
        <th>Valor padrão</th> <td><code>12</code></td> </tr>
      <tr>
        <th>Valor mínimo</th> <td><code>0</code></td> </tr>
      <tr>
        <th>Valor máximo</th> <td><code>12</code></td> </tr>
    </tr>
  </table>

  Ler o caminho dado a partir do arquivo de login.

* `--no-login-paths`

  <table frame="box" rules="all" summary="Propriedades para connect-retries">
    <tr>
      <th>Formato de linha de comando</th> <td><code>--connect-retries=#</code></td> </tr>
      <th>Tipo</th> <td>Inteiro</td> </tr>
      <tr>
        <th>Valor padrão</th> <td><code>12</code></td> </tr>
      <tr>
        <th>Valor mínimo</th> <td><code>0</code></td> </tr>
      <tr>
        <th>Valor máximo</th> <td><code>12</code></td> </tr>
    </tr>
  </table>

  Ignorar a leitura de opções a partir do arquivo de caminho de login.

* `--ndb-connectstring`

<table frame="box" rules="all" summary="Propriedades para connect-retries">
  <tr><th>Formato de linha de comando</th> <td><code>--connect-retries=#</code></td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor padrão</th> <td><code>12</code></td> </tr>
  <tr><th>Valor mínimo</th> <td><code>0</code></td> </tr>
  <tr><th>Valor máximo</th> <td><code>12</code></td> </tr>
</table>

  Defina a string de conexão para se conectar ao **ndb_mgmd**. Sintaxe: `[nodeid=id;][host=]hostname[:port]`. Sobrina entradas no `NDB_CONNECTSTRING` e `my.cnf`.

* `--ndb-mgm-tls`

  <table frame="box" rules="all" summary="Propriedades para connect-retries">
    <tr><th>Formato de linha de comando</th> <td><code>--connect-retries=#</code></td> </tr>
    <tr><th>Tipo</th> <td>Inteiro</td> </tr>
    <tr><th>Valor padrão</th> <td><code>12</code></td> </tr>
    <tr><th>Valor mínimo</th> <td><code>0</code></td> </tr>
    <tr><th>Valor máximo</th> <td><code>12</code></td> </tr>
  </table>

  Define o nível de suporte TLS necessário para se conectar ao servidor de gerenciamento; um dos `relaxado` ou `estricto`. `relaxado` (o padrão) significa que uma conexão TLS é tentada, mas o sucesso não é necessário; `estricto` significa que TLS é necessário para se conectar.

* `--ndb-mgmd-host`

<table frame="box" rules="all" summary="Propriedades para connect-retries">
  <tr><th>Formato de linha de comando</th> <td><code>--connect-retries=#</code></td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor padrão</th> <td><code>12</code></td> </tr>
  <tr><th>Valor mínimo</th> <td><code>0</code></td> </tr>
  <tr><th>Valor máximo</th> <td><code>12</code></td> </tr>
</table>

  O mesmo que `--ndb-connectstring`.

* `--ndb-nodeid`

  <table frame="box" rules="all" summary="Propriedades para connect-retries">
    <tr><th>Formato de linha de comando</th> <td><code>--connect-retries=#</code></td> </tr>
    <tr><th>Tipo</th> <td>Inteiro</td> </tr>
    <tr><th>Valor padrão</th> <td><code>12</code></td> </tr>
    <tr><th>Valor mínimo</th> <td><code>0</code></td> </tr>
    <tr><th>Valor máximo</th> <td><code>12</code></td> </tr>
  </table>

  Defina o ID do nó para este nó, substituindo qualquer ID definido por `--ndb-connectstring`.

* `--ndb-optimized-node-selection`

  <table frame="box" rules="all" summary="Propriedades para connect-retries">
    <tr><th>Formato de linha de comando</th> <td><code>--connect-retries=#</code></td> </tr>
    <tr><th>Tipo</th> <td>Inteiro</td> </tr>
    <tr><th>Valor padrão</th> <td><code>12</code></td> </tr>
    <tr><th>Valor mínimo</th> <td><code>0</code></td> </tr>
    <tr><th>Valor máximo</th> <td><code>12</code></td> </tr>
  </table>

Habilitar otimizações para a seleção de nós para transações. Ativado por padrão; use `--skip-ndb-optimized-node-selection` para desativá-lo.

* `--ndb-tls-search-path`

  <table frame="box" rules="all" summary="Propriedades para retries de conexão"><tr><th>Formato de linha de comando</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>12</code></td> </tr><tr><th>Valor mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor máximo</th> <td><code>12</code></td> </tr> </tbody></table>

  Especificar uma lista de diretórios para procurar um arquivo CA. Em plataformas Unix, os nomes dos diretórios são separados por colchetes (`:`); em sistemas Windows, o caractere ponto e vírgula (`;`) é usado como separador. Uma referência de diretório pode ser relativa ou absoluta; pode conter uma ou mais variáveis de ambiente, cada uma denotada por um sinal de dólar prefixado (`$`), e expandida antes de ser usada.

  A busca começa com o diretório mais à esquerda nomeado e prossegue de esquerda para direita até que um arquivo seja encontrado. Uma string vazia denota um caminho de busca vazio, o que faz com que todas as buscas falhem. Uma string composta por um único ponto (`.`) indica que o caminho de busca é limitado ao diretório de trabalho atual.

  Se não for fornecido um caminho de busca, o valor padrão embutido é usado. Esse valor depende da plataforma usada: em Windows, é `\ndb-tls`; em outras plataformas (incluindo Linux), é `$HOME/ndb-tls`. Isso pode ser substituído compilando o NDB Cluster usando `-DWITH_NDB_TLS_SEARCH_PATH`.

* `--no-defaults`

<table frame="box" rules="all" summary="Propriedades para connect-retries">
  <tr><th>Formato de linha de comando</th> <td><code>--connect-retries=#</code></td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor padrão</th> <td><code>12</code></td> </tr>
  <tr><th>Valor mínimo</th> <td><code>0</code></td> </tr>
  <tr><th>Valor máximo</th> <td><code>12</code></td> </tr>
</table>

  Não leia opções padrão de nenhum arquivo de opção, exceto o arquivo de login.

* `--print-defaults`

  <table frame="box" rules="all" summary="Propriedades para connect-retry-delay">
    <tr><th>Formato de linha de comando</th> <td><code>--connect-retry-delay=#</code></td> </tr>
    <tr><th>Tipo</th> <td>Inteiro</td> </tr>
    <tr><th>Valor padrão</th> <td><code>5</code></td> </tr>
    <tr><th>Valor mínimo</th> <td><code>0</code></td> </tr>
    <tr><th>Valor máximo</th> <td><code>5</code></td> </tr>
  </table>

  Imprima a lista de argumentos do programa e saia.

* `--transactional`, `-t`

  O uso desta opção faz com que a operação de exclusão seja realizada como uma única transação.

  Aviso

  Com tabelas muito grandes, o uso desta opção pode fazer com que o número de operações disponíveis para o clúster seja excedido.

* `--tupscan`

  Execute uma varredura de tuplas.

* `--usage`

<table frame="box" rules="all" summary="Propriedades para connect-retry-delay">
  <tr><th>Formato de linha de comando</th> <td><code>--connect-retry-delay=#</code></td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor padrão</th> <td><code>5</code></td> </tr>
  <tr><th>Valor mínimo</th> <td><code>0</code></td> </tr>
  <tr><th>Valor máximo</th> <td><code>5</code></td> </tr>
</table>

  Exibir texto de ajuda e sair; o mesmo que `--help`.

* `--version`

  <table frame="box" rules="all" summary="Propriedades para connect-retry-delay">
    <tr><th>Formato de linha de comando</th> <td><code>--connect-retry-delay=#</code></td> </tr>
    <tr><th>Tipo</th> <td>Inteiro</td> </tr>
    <tr><th>Valor padrão</th> <td><code>5</code></td> </tr>
    <tr><th>Valor mínimo</th> <td><code>0</code></td> </tr>
    <tr><th>Valor máximo</th> <td><code>5</code></td> </tr>
  </table>

  Exibir informações da versão e sair.