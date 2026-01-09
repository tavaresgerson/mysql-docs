### 25.5.11 ndb_drop_table — Deletar uma Tabela NDB

**ndb_drop_table** exclui a tabela especificada `NDB`. (Se você tentar usar isso em uma tabela criada com um motor de armazenamento diferente de `NDB`, a tentativa falhará com o erro 723: Tabela não existe.) Essa operação é extremamente rápida; em alguns casos, pode ser uma ordem de magnitude mais rápida do que usar uma instrução `DROP TABLE` do MySQL em uma tabela `NDB`.

#### Uso

```
ndb_drop_table -c connection_string tbl_name -d db_name
```

As opções que podem ser usadas com **ndb_drop_table** estão mostradas na tabela a seguir. Descrições adicionais seguem a tabela.

* `--character-sets-dir`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--character-sets-dir=caminho</code></td> </tr></tbody></table>

  Diretório contendo conjuntos de caracteres.

* `--connect-retries`

  <table frame="box" rules="all" summary="Propriedades para connect-retries"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>12</code></td> </tr><tr><th>Valor Mínima</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>12</code></td> </tr></tbody></table>

  Número de vezes para tentar a conexão antes de desistir.

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

Nome da base de dados na qual a tabela reside.

* `--defaults-extra-file`

Leia o arquivo fornecido após a leitura dos arquivos globais.

* `--defaults-file`

  <table frame="box" rules="all" summary="Propriedades para defaults-file"><tbody><tr><th>Formato de linha de comando</th> <td><code>--defaults-file=caminho</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>[nenhum]</code></td> </tr></tbody></table>

  Leia as opções padrão do arquivo fornecido.

* `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Propriedades para defaults-group-suffix"><tbody><tr><th>Formato de linha de comando</th> <td><code>--defaults-group-suffix=string</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>[nenhum]</code></td> </tr></tbody></table>

  Leia também os grupos com concatenação(grupo, sufixo).

* `--help`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Formato de linha de comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Exibir texto de ajuda e sair.

* `--login-path`

Leia a rota fornecida a partir do arquivo de login.

* `--no-login-paths`

  <table frame="box" rules="all" summary="Propriedades para connect-retries"><tbody><tr><th>Formato de linha de comando</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>12</code></td> </tr><tr><th>Valor mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor máximo</th> <td><code>12</code></td> </tr></tbody></table>

  Ignora a leitura de opções a partir do arquivo de caminho de login.

* `--ndb-connectstring`

  <table frame="box" rules="all" summary="Propriedades para connect-retries"><tbody><tr><th>Formato de linha de comando</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>12</code></td> </tr><tr><th>Valor mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor máximo</th> <td><code>12</code></td> </tr></tbody></table>

Defina a string de conexão para se conectar ao **ndb_mgmd**. Sintaxe: `[nodeid=id;][host=]hostname[:port]`. Sobrime entradas no `NDB_CONNECTSTRING` e `my.cnf`.

* `--ndb-mgm-tls`

  <table frame="box" rules="all" summary="Propriedades para retries de conexão"><tr><th>Formato de linha de comando</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>12</code></td> </tr><tr><th>Valor mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor máximo</th> <td><code>12</code></td> </tr></table>

  Define o nível de suporte TLS necessário para se conectar ao servidor de gerenciamento; um dos `relaxado` ou `estricto`. `relaxado` (o padrão) significa que uma conexão TLS é tentada, mas o sucesso não é necessário; `estricto` significa que TLS é necessário para se conectar.

* `--ndb-mgmd-host`

  <table frame="box" rules="all" summary="Propriedades para retries de conexão"><tr><th>Formato de linha de comando</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>12</code></td> </tr><tr><th>Valor mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor máximo</th> <td><code>12</code></td> </tr></table>

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

  Ative otimizações para a seleção de nós para transações. Ativado por padrão; use `--skip-ndb-optimized-node-selection` para desativá-lo.

* `--ndb-tls-search-path`

  <table frame="box" rules="all" summary="Propriedades para connect-retries">
    <tr><th>Formato de linha de comando</th> <td><code>--connect-retries=#</code></td> </tr>
    <tr><th>Tipo</th> <td>Inteiro</td> </tr>
    <tr><th>Valor padrão</th> <td><code>12</code></td> </tr>
    <tr><th>Valor mínimo</th> <td><code>0</code></td> </tr>
    <tr><th>Valor máximo</th> <td><code>12</code></td> </tr>
  </table>

Especifique uma lista de diretórios para procurar um arquivo CA. Em plataformas Unix, os nomes dos diretórios são separados por colchetes (`:`); em sistemas Windows, o caractere ponto e vírgula (`;`) é usado como separador. Uma referência de diretório pode ser relativa ou absoluta; pode conter uma ou mais variáveis de ambiente, cada uma denotada por um sinal de dólar prefixado (`$`), e expandida antes do uso.

A busca começa com o diretório mais à esquerda e prossegue de esquerda para direita até que um arquivo seja encontrado. Uma string vazia denota um caminho de busca vazio, o que faz com que todas as buscas falhem. Uma string composta por um único ponto (`.`) indica que o caminho de busca é limitado ao diretório de trabalho atual.

Se não for fornecido um caminho de busca, o valor padrão integrado é usado. Esse valor depende da plataforma usada: em Windows, é `\ndb-tls`; em outras plataformas (incluindo Linux), é `$HOME/ndb-tls`. Isso pode ser sobreposto compilando o NDB Cluster usando `-DWITH_NDB_TLS_SEARCH_PATH`.

* `--no-defaults`

  <table frame="box" rules="all" summary="Propriedades para connect-retries"><tr><th>Formato de Linha de Comando</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>12</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>12</code></td> </tr></tbody></table>

  Não leia opções padrão de nenhum arquivo de opção diferente do arquivo de login.

* `--print-defaults`

<table frame="box" rules="all" summary="Propriedades para connect-retries">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code>--connect-retries=#</code></td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Inteiro</td>
  </tr>
  <tr>
    <th>Valor padrão</th>
    <td><code>12</code></td>
  </tr>
  <tr>
    <th>Valor mínimo</th>
    <td><code>0</code></td>
  </tr>
  <tr>
    <th>Valor máximo</th>
    <td><code>12</code></td>
  </tr>
</table>

  Imprimir a lista de argumentos do programa e sair.

* `--usage`

  <table frame="box" rules="all" summary="Propriedades para connect-retry-delay">
    <tr>
      <th>Formato de linha de comando</th>
      <td><code>--connect-retry-delay=#</code></td>
    </tr>
    <tr>
      <th>Tipo</th>
      <td>Inteiro</td>
    </tr>
    <tr>
      <th>Valor padrão</th>
      <td><code>5</code></td>
    </tr>
    <tr>
      <th>Valor mínimo</th>
      <td><code>0</code></td>
    </tr>
    <tr>
      <th>Valor máximo</th>
      <td><code>5</code></td>
    </tr>
  </table>

  Exibir texto de ajuda e sair; o mesmo que `--help`.

* `--version`

  <table frame="box" rules="all" summary="Propriedades para connect-retry-delay">
    <tr>
      <th>Formato de linha de comando</th>
      <td><code>--connect-retry-delay=#</code></td>
    </tr>
    <tr>
      <th>Tipo</th>
      <td>Inteiro</td>
    </tr>
    <tr>
      <th>Valor padrão</th>
      <td><code>5</code></td>
    </tr>
    <tr>
      <th>Valor mínimo</th>
      <td><code>0</code></td>
    </tr>
    <tr>
      <th>Valor máximo</th>
      <td><code>5</code></td>
    </tr>
  </table>

  Exibir informações da versão e sair.