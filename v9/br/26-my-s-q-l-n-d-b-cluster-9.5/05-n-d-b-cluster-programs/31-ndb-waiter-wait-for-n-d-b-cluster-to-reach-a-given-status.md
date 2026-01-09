### 25.5.31 ndb_waiter — Aguarde o NDB Cluster atingir um status específico

O **ndb_waiter** imprime repetidamente (a cada 100 milissegundos) o status de todos os nós de dados do cluster até que o cluster atinja um status específico ou o limite de `--timeout` seja excedido, e então o programa encerra. Por padrão, ele aguarda que o cluster atinja o status `STARTED`, em que todos os nós tenham iniciado e se conectado ao cluster. Isso pode ser desconsiderado usando as opções `--no-contact` e `--not-started`.

Os estados dos nós relatados por esse utilitário são os seguintes:

* `NO_CONTACT`: O nó não pode ser contatado.
* `UNKNOWN`: O nó pode ser contatado, mas seu status ainda não é conhecido. Geralmente, isso significa que o nó recebeu um comando `START` ou `RESTART` do servidor de gerenciamento, mas ainda não agiu sobre ele.

* `NOT_STARTED`: O nó parou, mas permanece em contato com o cluster. Isso é visto ao reiniciar o nó usando o comando `RESTART` do cliente de gerenciamento.

* `STARTING`: O processo **ndbd** do nó começou, mas o nó ainda não se juntou ao cluster.

* `STARTED`: O nó está operacional e se juntou ao cluster.

* `SHUTTING_DOWN`: O nó está desligando.
* `SINGLE USER MODE`: Isso é mostrado para todos os nós de dados do cluster quando o cluster está no modo de usuário único.

As opções que podem ser usadas com **ndb_waiter** estão mostradas na tabela a seguir. Descrições adicionais seguem a tabela.

#### Uso

```
ndb_waiter [-c connection_string]
```

#### Opções Adicionais

* `--character-sets-dir`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--character-sets-dir=caminho</code></td> </tr></tbody></table>

  Diretório contendo conjuntos de caracteres.

* `--connect-retries`

<table frame="box" rules="all" summary="Propriedades para connect-retries">
  <tr><th>Formato de linha de comando</th> <td><code>--connect-retries=#</code></td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor padrão</th> <td><code>12</code></td> </tr>
  <tr><th>Valor mínimo</th> <td><code>0</code></td> </tr>
  <tr><th>Valor máximo</th> <td><code>12</code></td> </tr>
</table>

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

<table frame="box" rules="all" summary="Propriedades para o arquivo de configuração">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code>--arquivo-de-configuração</code></td>
  </tr>
</table>

  Escreva o arquivo de configuração em caso de erro; usado em depuração.

* `--arquivo-extra-de-configurações`

  <table frame="box" rules="all" summary="Propriedades para arquivo-extra-de-configurações">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code>--arquivo-extra-de-configurações=caminho</code></td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>String</td>
  </tr>
  <tr>
    <th>Valor padrão</th>
    <td><code>[nenhum]</code></td>
  </tr>
  </tbody></table>

  Leia o arquivo fornecido após a leitura dos arquivos globais.

* `--arquivo-de-configurações`

  <table frame="box" rules="all" summary="Propriedades para arquivo-de-configurações">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code>--arquivo-de-configurações=caminho</code></td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>String</td>
  </tr>
  <tr>
    <th>Valor padrão</th>
    <td><code>[nenhum]</code></td>
  </tr>
  </tbody></table>

  Leia as opções padrão do arquivo fornecido.

* `--suffix-grupo-de-configurações`

  <table frame="box" rules="all" summary="Propriedades para suffix-grupo-de-configurações">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code>--suffix-grupo-de-configurações=string</code></td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>String</td>
  </tr>
  <tr>
    <th>Valor padrão</th>
    <td><code>[nenhum]</code></td>
  </tr>
  </tbody></table>

  Leia também os grupos com concatenação (grupo, suffix).

* `--caminho-de-login`

Leia o caminho de login do arquivo de login.

* `--no-caminhos-de-login`

  <table frame="box" rules="all" summary="Propriedades para no-caminhos-de-login"><tbody><tr><th>Formato de linha de comando</th> <td><code>--no-login-paths</code></td> </tr></tbody></table>

  Ignora a leitura das opções do arquivo de caminhos de login.

* `--help`

  <table frame="box" rules="all" summary="Propriedades para tentativas-de-conexão"><tbody><tr><th>Formato de linha de comando</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>12</code></td> </tr><tr><th>Valor mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor máximo</th> <td><code>12</code></td> </tr></tbody></table>

  Exibir texto de ajuda e sair.

* `--ndb-connectstring`

  <table frame="box" rules="all" summary="Propriedades para tentativas-de-conexão"><tbody><tr><th>Formato de linha de comando</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>12</code></td> </tr><tr><th>Valor mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor máximo</th> <td><code>12</code></td> </tr></tbody></table>

Defina a string de conexão para se conectar ao **ndb\_mgmd**. Sintaxe: `[nodeid=id;][host=]hostname[:port]`. Sobrina as entradas em `NDB_CONNECTSTRING` e `my.cnf`.

* `--ndb-mgm-tls`

  <table frame="box" rules="all" summary="Propriedades para retries de conexão"><tr><th>Formato de linha de comando</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>12</code></td> </tr><tr><th>Valor mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor máximo</th> <td><code>12</code></td> </tr></table>

  Define o nível de suporte TLS necessário para se conectar ao servidor de gerenciamento; um dos `relaxado` ou `estricto`. `relaxado` (o padrão) significa que uma conexão TLS é tentada, mas o sucesso não é necessário; `estricto` significa que TLS é necessário para se conectar.

* `--ndb-mgm-host`

  <table frame="box" rules="all" summary="Propriedades para retries de conexão"><tr><th>Formato de linha de comando</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>12</code></td> </tr><tr><th>Valor mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor máximo</th> <td><code>12</code></td> </tr></table>

  O mesmo que `--ndb-connectstring`.

* `--ndb-nodeid`

<table frame="box" rules="all" summary="Propriedades para connect-retries"><tr><th>Formato de linha de comando</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>12</code></td> </tr><tr><th>Valor mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor máximo</th> <td><code>12</code></td> </tr></table>

  Defina o ID do nó para este nó, substituindo qualquer ID definido por `--ndb-connectstring`.

* `--ndb-optimized-node-selection`

  <table frame="box" rules="all" summary="Propriedades para connect-retries"><tr><th>Formato de linha de comando</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>12</code></td> </tr><tr><th>Valor mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor máximo</th> <td><code>12</code></td> </tr></table>

  Ative otimizações para a seleção de nós para transações. Ativado por padrão; use `--skip-ndb-optimized-node-selection` para desativá-lo.

* `--ndb-tls-search-path`

Especifique uma lista de diretórios para procurar um arquivo CA. Em plataformas Unix, os nomes dos diretórios são separados por colchetes (`:`); em sistemas Windows, o caractere ponto e vírgula (`;`) é usado como separador. Uma referência de diretório pode ser relativa ou absoluta; pode conter uma ou mais variáveis de ambiente, cada uma denotada por um sinal de dólar prefixado (`$`), e expandida antes do uso.

A busca começa com o diretório mais à esquerda e prossegue de esquerda para direita até que um arquivo seja encontrado. Uma string vazia denota um caminho de busca vazio, o que faz com que todas as buscas falhem. Uma string composta por um único ponto (`.`) indica que o caminho de busca é limitado ao diretório de trabalho atual.

Se não for fornecido um caminho de busca, o valor padrão integrado é usado. Esse valor depende da plataforma usada: em Windows, é `\ndb-tls`; em outras plataformas (incluindo Linux), é `$HOME/ndb-tls`. Isso pode ser sobreposto compilando o NDB Cluster usando `-DWITH_NDB_TLS_SEARCH_PATH`.

* `--no-contact`, `-n`

Em vez de esperar pelo estado `STARTED`, o **ndb\_waiter** continua rodando até que o cluster atinja o estado `NO_CONTACT` antes de sair.

* `--no-defaults`

<table frame="box" rules="all" summary="Propriedades para connect-retries"><tr><th>Formato de Linha de Comando</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>12</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>12</code></td> </tr></tbody></table>

Não leia opções padrão de nenhum arquivo de opção que não seja o arquivo de login.

* `--not-started`

Em vez de esperar pelo estado `STARTED`, o **ndb\_waiter** continua rodando até que o clúster atinja o estado `NOT_STARTED` antes de sair.

* `--nowait-nodes=list`

  Quando esta opção é usada, o **ndb\_waiter** não aguarda pelos nós cujos IDs estão listados. A lista é delimitada por vírgulas; intervalos podem ser indicados por travessões, como mostrado aqui:

  ```
  $> ndb_waiter --nowait-nodes=1,3,7-9
  ```

  Importante

  *Não* use esta opção junto com a opção `--wait-nodes`.

* `--print-defaults`

  <table frame="box" rules="all" summary="Propriedades para connect-retries"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>12</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>12</code></td> </tr></tbody></table>

  Imprima a lista de argumentos do programa e saia.

* `--timeout=seconds`, `-t segundos`

  Tempo de espera. O programa sai se o estado desejado não for alcançado dentro deste número de segundos. O valor padrão é de 120 segundos (1200 ciclos de relatório).

* `--single-user`

  O programa aguarda que o clúster entre no modo de usuário único.

* `--usage`

<table frame="box" rules="all" summary="Propriedades para connect-retries">
  <tr><th>Formato de linha de comando</th> <td><code>--connect-retries=#</code></td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor padrão</th> <td><code>12</code></td> </tr>
  <tr><th>Valor mínimo</th> <td><code>0</code></td> </tr>
  <tr><th>Valor máximo</th> <td><code>12</code></td> </tr>
</table>

  Exibir texto de ajuda e sair; o mesmo que `--help`.

* `--verbose`

  <table frame="box" rules="all" summary="Propriedades para connect-retry-delay">
    <tr><th>Formato de linha de comando</th> <td><code>--connect-retry-delay=#</code></td> </tr>
    <tr><th>Tipo</th> <td>Inteiro</td> </tr>
    <tr><th>Valor padrão</th> <td><code>5</code></td> </tr>
    <tr><th>Valor mínimo</th> <td><code>0</code></td> </tr>
    <tr><th>Valor máximo</th> <td><code>5</code></td> </tr>
  </table>

  Controla o nível de verbosidade da impressão. Os níveis possíveis e seus efeitos estão listados aqui:

  + `0`: Não imprimir (retornar apenas o código de saída; consulte o seguinte para códigos de saída).

  + `1`: Imprimir apenas o status da conexão final.

  + `2`: Imprimir o status cada vez que é verificado.

  Este é o mesmo comportamento das versões do NDB Cluster anteriores à 8.4.

  Os códigos de saída retornados pelo **ndb\_waiter** estão listados aqui, com seus significados:

  + `0`: Sucesso.
  + `1`: O tempo de espera expirou.
  + `2`: Erro de parâmetro, como um ID de nó inválido.

  + `3`: Não foi possível se conectar ao servidor de gerenciamento.

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

* `--wait-nodes=list`, `-w list`

Quando esta opção é usada, o **ndb_waiter** aguarda apenas pelos nós cujos IDs estão listados. A lista é delimitada por vírgulas; intervalos podem ser indicados por traços, como mostrado aqui:

```
  $> ndb_waiter --wait-nodes=2,4-6,10
  ```

Importante

* **Não** use esta opção junto com a opção `--nowait-nodes`.

**Saída de exemplo.** Mostrada aqui é a saída do **ndb_waiter** quando executado contra um clúster de 4 nós em que dois nós foram desligados e depois reiniciados manualmente. Relatórios duplicados (indicados por `...`) são omitidos.

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

Se não for especificado uma string de conexão, o **ndb_waiter** tenta se conectar a um gerenciamento em `localhost`, e relata `Conectando ao mgmsrv em (null)`.