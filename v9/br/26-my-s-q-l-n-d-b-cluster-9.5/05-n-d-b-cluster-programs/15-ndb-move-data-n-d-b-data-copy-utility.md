### 25.5.15 ndb\_move\_data — Ferramenta de Cópia de Dados NDB

O **ndb\_move\_data** copia dados de uma tabela NDB para outra.

#### Uso

O programa é invocado com os nomes das tabelas de origem e destino; qualquer uma ou ambas podem ser qualificadas opcionalmente com o nome do banco de dados. Ambas as tabelas devem usar o mecanismo de armazenamento NDB.

```
ndb_move_data options source target
```

As opções que podem ser usadas com **ndb\_move\_data** estão mostradas na tabela a seguir. Descrições adicionais seguem a tabela.

* `--abort-on-error`

  <table frame="box" rules="all" summary="Propriedades para abort-on-error"><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--abort-on-error</code></td> </tr></tbody></table>

  Arrume o núcleo em caso de erro permanente (opção de depuração).

* `--character-sets-dir=*``name`*

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--character-sets-dir=caminho</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal">[nenhum]</code></td> </tr></tbody></table>

  Diretório onde os conjuntos de caracteres estão.

* `--connect-retry-delay`

  <table frame="box" rules="all" summary="Propriedades para connect-retry-delay"><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--connect-retry-delay=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal">5</code></td> </tr><tr><th>Valor Mínimo</th> <td><code class="literal">0</code></td> </tr><tr><th>Valor Máximo</th> <td><code class="literal">5</code></td> </tr></tbody></table>

Número de segundos para esperar entre as tentativas de contato com o servidor de gerenciamento.

* `--connect-retries`

  <table frame="box" rules="all" summary="Propriedades para connect-retries"><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--connect-retries=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">12</code></td> </tr><tr><th>Valor mínimo</th> <td><code class="literal">0</code></td> </tr><tr><th>Valor máximo</th> <td><code class="literal">12</code></td> </tr></tbody></table>

  Número de vezes para tentar novamente a conexão antes de desistir.

* `--connect-string`

  <table frame="box" rules="all" summary="Propriedades para connect-string"><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--connect-string=connection_string</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">[none]</code></td> </tr></tbody></table>

  O mesmo que `--ndb-connectstring`.

* `--core-file`

  <table frame="box" rules="all" summary="Propriedades para core-file"><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--core-file</code></td> </tr></tbody></table>

  Escreva o arquivo de código no erro; usado em depuração.

* `--database=*dbname`, `-d`

  <table frame="box" rules="all" summary="Propriedades para database"><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--database=name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">TEST_DB</code></td> </tr></tbody></table>

Nome do banco de dados em que a tabela está localizada.

* `--defaults-extra-file`

  <table frame="box" rules="all" summary="Propriedades para defaults-extra-file"><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--defaults-extra-file=caminho</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">[nenhum]</code></td> </tr></tbody></table>

  Leia o arquivo fornecido após a leitura dos arquivos globais.

* `--defaults-file`

  <table frame="box" rules="all" summary="Propriedades para defaults-file"><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--defaults-file=caminho</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">[nenhum]</code></td> </tr></tbody></table>

  Leia as opções padrão do arquivo fornecido.

* `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Propriedades para defaults-group-suffix"><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--defaults-group-suffix=string</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">[nenhum]</code></td> </tr></tbody></table>

  Leia também os grupos com concatenação(grupo, sufixo).

* `--drop-source`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--character-sets-dir=caminho</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">[nenhum]</code></td> </tr></tbody></table>0

Exclua a tabela de origem após todas as linhas terem sido movidas.

* `--error-insert`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--character-sets-dir=caminho</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">[nenhum]</code></td> </tr></tbody></table>1

  Insira erros temporários aleatórios (opção de teste).

* `--exclude-missing-columns`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--character-sets-dir=caminho</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">[nenhum]</code></td> </tr></tbody></table>2

  Ignore colunas extras na tabela de origem ou destino.

* `--help`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--character-sets-dir=caminho</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">[nenhum]</code></td> </tr></tbody></table>3

  Exibir texto de ajuda e sair.

* `--login-path`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--character-sets-dir=caminho</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">[nenhum]</code></td> </tr></tbody></table>4

  Ler o caminho fornecido a partir do arquivo de login.

* `--no-login-paths`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--character-sets-dir=caminho</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">[nenhum]</code></td> </tr></tbody></table>5

  Ignora opções de leitura do arquivo de caminho de login.

* `--lossy-conversions`, `-l`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--character-sets-dir=caminho</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">[nenhum]</code></td> </tr></tbody></table>6

  Permite que os dados dos atributos sejam truncados ao serem convertidos para um tipo menor.

* `--ndb-connectstring`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--character-sets-dir=caminho</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">[nenhum]</code></td> </tr></tbody></table>7

  Defina a string de conexão para se conectar ao **ndb\_mgmd**. Sintaxe: `[nodeid=id;][host=]hostname[:port]`. Sobrime entradas em `NDB_CONNECTSTRING` e `my.cnf`.

* `--ndb-mgm-tls`

<table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--character-sets-dir=caminho</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">[nenhum]</code></td> </tr></tbody></table>8

  Define o nível de suporte TLS necessário para se conectar ao servidor de gerenciamento; um dos valores `relaxado` ou `estricto`. `relaxado` (o padrão) significa que uma conexão TLS é tentada, mas o sucesso não é necessário; `estricto` significa que a conexão TLS é necessária para se conectar.

* `--ndb-mgmd-host`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--character-sets-dir=caminho</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">[nenhum]</code></td> </tr></tbody></table>9

  O mesmo que `--ndb-connectstring`.

* `--ndb-nodeid`

  <table frame="box" rules="all" summary="Propriedades para connect-retry-delay"><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--connect-retry-delay=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">5</code></td> </tr><tr><th>Valor mínimo</th> <td><code class="literal">0</code></td> </tr><tr><th>Valor máximo</th> <td><code class="literal">5</code></td> </tr></tbody></table>0

  Defina o ID do nó para este nó, substituindo qualquer ID definido por `--ndb-connectstring`.

* `--ndb-optimized-node-selection`

<table frame="box" rules="all" summary="Propriedades para connect-retry-delay">
  <tr><th>Formato de Linha de Comando</th> <td><code class="literal">--connect-retry-delay=#</code></td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code class="literal">5</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code class="literal">0</code></td> </tr>
  <tr><th>Valor Máximo</th> <td><code class="literal">5</code></td> </tr>
</table>1

  Ative otimizações para a seleção de nós para transações. Ativado por padrão; use `--skip-ndb-optimized-node-selection` para desativá-lo.

* `--ndb-tls-search-path`

  <table frame="box" rules="all" summary="Propriedades para connect-retry-delay">
    <tr><th>Formato de Linha de Comando</th> <td><code class="literal">--connect-retry-delay=#</code></td> </tr>
    <tr><th>Tipo</th> <td>Inteiro</td> </tr>
    <tr><th>Valor Padrão</th> <td><code class="literal">5</code></td> </tr>
    <tr><th>Valor Mínimo</th> <td><code class="literal">0</code></td> </tr>
    <tr><th>Valor Máximo</th> <td><code class="literal">5</code></td> </tr>
  </table>2

  Especifique uma lista de diretórios para pesquisar por um arquivo CA. Em plataformas Unix, os nomes dos diretórios são separados por colchetes (`:`); em sistemas Windows, o caractere ponto e vírgula (`;`) é usado como separador. Uma referência de diretório pode ser relativa ou absoluta; pode conter uma ou mais variáveis de ambiente, cada uma denotada por um sinal de dólar prefixado (`$`), e expandida antes de uso.

A busca começa com o diretório nomeado mais à esquerda e prossegue de esquerda para direita até que um arquivo seja encontrado. Uma string vazia indica um caminho de busca vazio, o que faz com que todas as buscas falhem. Uma string composta por um único ponto (`.`) indica que o caminho de busca é limitado ao diretório de trabalho atual.

Se não for fornecido um caminho de busca, o valor padrão integrado é usado. Esse valor depende da plataforma usada: no Windows, é `\ndb-tls`; em outras plataformas (incluindo Linux), é `$HOME/ndb-tls`. Isso pode ser sobreposto compilando o NDB Cluster usando `-DWITH_NDB_TLS_SEARCH_PATH`.

* `--no-defaults`

  <table frame="box" rules="all" summary="Propriedades para connect-retry-delay"><tr><th>Formato de linha de comando</th> <td><code class="literal">--connect-retry-delay=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">5</code></td> </tr><tr><th>Valor mínimo</th> <td><code class="literal">0</code></td> </tr><tr><th>Valor máximo</th> <td><code class="literal">5</code></td> </tr></tbody></table>3

  Não leia opções padrão de nenhum arquivo de opção diferente do arquivo de login.

* `--print-defaults`

  <table frame="box" rules="all" summary="Propriedades para connect-retry-delay"><tr><th>Formato de linha de comando</th> <td><code class="literal">--connect-retry-delay=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">5</code></td> </tr><tr><th>Valor mínimo</th> <td><code class="literal">0</code></td> </tr><tr><th>Valor máximo</th> <td><code class="literal">5</code></td> </tr></tbody></table>4

  Imprima a lista de argumentos do programa e saia.

* `--promover-atributos`, `-A`

  <table frame="box" rules="all" summary="Propriedades para delay-de-tentativa-de-conexão"><tr><th>Formato de linha de comando</th> <td><code class="literal">--connect-retry-delay=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">5</code></td> </tr><tr><th>Valor mínimo</th> <td><code class="literal">0</code></td> </tr><tr><th>Valor máximo</th> <td><code class="literal">5</code></td> </tr></table>5

  Permitir que os dados dos atributos sejam convertidos para um tipo maior.

* `--tentativas-de-estacionamento=*``x[,y[,z]]*

  <table frame="box" rules="all" summary="Propriedades para delay-de-tentativa-de-conexão"><tr><th>Formato de linha de comando</th> <td><code class="literal">--connect-retry-delay=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">5</code></td> </tr><tr><th>Valor mínimo</th> <td><code class="literal">0</code></td> </tr><tr><th>Valor máximo</th> <td><code class="literal">5</code></td> </tr></table>6

  Especificar tentativas em erros temporários. O formato é x[,y[,z]] onde x=max tentativas (0=sem limite), y=delay mínimo (ms), z=delay máximo (ms).

* `--uso`

  <table frame="box" rules="all" summary="Propriedades para delay-de-tentativa-de-conexão"><tr><th>Formato de linha de comando</th> <td><code class="literal">--connect-retry-delay=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">5</code></td> </tr><tr><th>Valor mínimo</th> <td><code class="literal">0</code></td> </tr><tr><th>Valor máximo</th> <td><code class="literal">5</code></td> </tr></table>7

Exibir texto de ajuda e sair; o mesmo que `--help`.

* `--verbose`

  <table frame="box" rules="all" summary="Propriedades para connect-retry-delay"><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--connect-retry-delay=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">5</code></td> </tr><tr><th>Valor mínimo</th> <td><code class="literal">0</code></td> </tr><tr><th>Valor máximo</th> <td><code class="literal">5</code></td> </tr></tbody></table>8

  Ativar mensagens verbais.

* `--version`

  <table frame="box" rules="all" summary="Propriedades para connect-retry-delay"><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--connect-retry-delay=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">5</code></td> </tr><tr><th>Valor mínimo</th> <td><code class="literal">0</code></td> </tr><tr><th>Valor máximo</th> <td><code class="literal">5</code></td> </tr></tbody></table>9

  Exibir informações da versão e sair.