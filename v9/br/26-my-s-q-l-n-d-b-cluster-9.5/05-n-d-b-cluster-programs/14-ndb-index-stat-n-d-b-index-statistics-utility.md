### 25.5.14 ndb_index_stat — Ferramenta de Estatísticas de Índices NDB

O **ndb_index_stat** fornece informações estatísticas por fragmento sobre os índices nas tabelas `NDB`. Isso inclui a versão e a idade do cache, o número de entradas de índice por partição e o consumo de memória pelos índices.

#### Uso

Para obter estatísticas básicas de índices sobre uma tabela `NDB` específica, invocando o **ndb_index_stat** conforme mostrado aqui, com o nome da tabela como primeiro argumento e o nome do banco de dados que contém essa tabela especificado imediatamente após ele, usando a opção `--database` (`-d`):

```
ndb_index_stat table -d database
```

Neste exemplo, usamos o **ndb_index_stat** para obter tais informações sobre uma tabela `NDB` chamada `mytable` no banco de dados `test`:

```
$> ndb_index_stat -d test mytable
table:City index:PRIMARY fragCount:2
sampleVersion:3 loadTime:1399585986 sampleCount:1994 keyBytes:7976
query cache: valid:1 sampleCount:1994 totalBytes:27916
times in ms: save: 7.133 sort: 1.974 sort per sample: 0.000
```

`sampleVersion` é o número de versão do cache a partir do qual os dados estatísticos são obtidos. Executar o **ndb_index_stat** com a opção `--update` faz com que `sampleVersion` seja incrementado.

`loadTime` mostra quando o cache foi atualizado pela última vez. Isso é expresso como segundos desde o Epocal Unix.

`sampleCount` é o número de entradas de índice encontradas por partição. Você pode estimar o número total de entradas multiplicando isso pelo número de fragmentos (mostrado como `fragCount`).

`sampleCount` pode ser comparado com a cardinalidade de `SHOW INDEX` ou `INFORMATION_SCHEMA.STATISTICS`, embora estes dois últimos forneçam uma visão da tabela como um todo, enquanto o **ndb_index_stat** fornece uma média por fragmento.

`keyBytes` é o número de bytes usados pelo índice. Neste exemplo, a chave primária é um inteiro, o que requer quatro bytes para cada índice, então `keyBytes` pode ser calculado neste caso conforme mostrado aqui:

```
    keyBytes = sampleCount * (4 bytes per index) = 1994 * 4 = 7976
```

Essas informações também podem ser obtidas usando as definições correspondentes das colunas de `INFORMATION_SCHEMA.COLUMNS` (isso requer um servidor MySQL e uma aplicação cliente MySQL).

`totalBytes` é o total de memória consumido por todos os índices da tabela, em bytes.

Os tempos mostrados nos exemplos anteriores são específicos para cada invocação do **ndb\_index\_stat**.

A opção `--verbose` fornece uma saída adicional, conforme mostrado aqui:

```
$> ndb_index_stat -d test mytable --verbose
random seed 1337010518
connected
loop 1 of 1
table:mytable index:PRIMARY fragCount:4
sampleVersion:2 loadTime:1336751773 sampleCount:0 keyBytes:0
read stats
query cache created
query cache: valid:1 sampleCount:0 totalBytes:0
times in ms: save: 20.766 sort: 0.001
disconnected

$>
```

Se a saída do programa estiver vazia, isso pode indicar que ainda não existem estatísticas. Para forçar a criação (ou atualização, se já existirem) delas, invocando **ndb\_index\_stat** com a opção `--update`, ou executando `ANALYZE TABLE` na tabela no cliente **mysql**.

#### Opções

A tabela a seguir inclui opções específicas para o utilitário NDB Cluster **ndb\_index\_stat**. Descrições adicionais estão listadas após a tabela.

* `--character-sets-dir`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--character-sets-dir=caminho</code></td> </tr></tbody></table>

  Diretório contendo conjuntos de caracteres.

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

  Escreva o arquivo de código fonte em caso de erro; usado em depuração.

* `--database=name`, `-d name`

<table frame="box" rules="all" summary="Propriedades para o arquivo de banco de dados">
  <tr><th>Formato de linha de comando</th> <td><code class="literal">--database=nome</code></td> </tr>
  <tr><th>Tipo</th> <td>String</td> </tr>
  <tr><th>Valor padrão</th> <td><code class="literal">[nenhum]</code></td> </tr>
  <tr><th>Valor mínimo</th> <td><code class="literal"></code></td> </tr>
  <tr><th>Valor máximo</th> <td><code class="literal"></code></td> </tr>
</table>

  O nome do banco de dados que contém a tabela consultada.

* `--defaults-extra-file`

  <table frame="box" rules="all" summary="Propriedades para o arquivo de defaults-extra-file">
    <tr><th>Formato de linha de comando</th> <td><code class="literal">--defaults-extra-file=caminho</code></td> </tr>
    <tr><th>Tipo</th> <td>String</td> </tr>
    <tr><th>Valor padrão</th> <td><code class="literal">[nenhum]</code></td> </tr>
  </table>

  Leia o arquivo fornecido após a leitura dos arquivos globais.

* `--defaults-file`

  <table frame="box" rules="all" summary="Propriedades para o arquivo de defaults-file">
    <tr><th>Formato de linha de comando</th> <td><code class="literal">--defaults-file=caminho</code></td> </tr>
    <tr><th>Tipo</th> <td>String</td> </tr>
    <tr><th>Valor padrão</th> <td><code class="literal">[nenhum]</code></td> </tr>
  </table>

  Leia as opções padrão do arquivo fornecido apenas.

* `--defaults-group-suffix`

<table frame="box" rules="all" summary="Propriedades para defaults-group-suffix">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code class="literal">--defaults-group-suffix=string</code></td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>String</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code class="literal">[none]</code></td>
  </tr>
</table>

  Leia também grupos com concat(grupo, sufixo).

* `--delete`

  <table frame="box" rules="all" summary="Propriedades para delete">
    <tr>
      <th>Formato de Linha de Comando</th>
      <td><code class="literal">--delete</code></td>
    </tr>
  </table>

  Exclua as estatísticas do índice para a tabela especificada, interrompendo qualquer atualização automática que foi configurada anteriormente.

* `--dump`

  <table frame="box" rules="all" summary="Propriedades para connect-retries">
    <tr>
      <th>Formato de Linha de Comando</th>
      <td><code class="literal">--connect-retries=#</code></td>
    </tr>
    <tr>
      <th>Tipo</th>
      <td>Inteiro</td>
    </tr>
    <tr>
      <th>Valor Padrão</th>
      <td><code class="literal">12</code></td>
    </tr>
    <tr>
      <th>Valor Mínimo</th>
      <td><code class="literal">0</code></td>
    </tr>
    <tr>
      <th>Valor Máximo</th>
      <td><code class="literal">12</code></td>
    </tr>
  </table>0

  Exiba o conteúdo do cache de consultas.

* `--help`

<table frame="box" rules="all" summary="Propriedades para connect-retries">
  <tr><th>Formato de linha de comando</th> <td><code class="literal">--connect-retries=#</code></td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor padrão</th> <td><code class="literal">12</code></td> </tr>
  <tr><th>Valor mínimo</th> <td><code class="literal">0</code></td> </tr>
  <tr><th>Valor máximo</th> <td><code class="literal">12</code></td> </tr>
</table>1

  Exibir texto de ajuda e sair.

* `--login-path`

  <table frame="box" rules="all" summary="Propriedades para connect-retries">
    <tr><th>Formato de linha de comando</th> <td><code class="literal">--connect-retries=#</code></td> </tr>
    <tr><th>Tipo</th> <td>Inteiro</td> </tr>
    <tr><th>Valor padrão</th> <td><code class="literal">12</code></td> </tr>
    <tr><th>Valor mínimo</th> <td><code class="literal">0</code></td> </tr>
    <tr><th>Valor máximo</th> <td><code class="literal">12</code></td> </tr>
  </table>2

  Ler o caminho dado a partir do arquivo de login.

* `--no-login-paths`

  <table frame="box" rules="all" summary="Propriedades para connect-retries">
    <tr><th>Formato de linha de comando</th> <td><code class="literal">--connect-retries=#</code></td> </tr>
    <tr><th>Tipo</th> <td>Inteiro</td> </tr>
    <tr><th>Valor padrão</th> <td><code class="literal">12</code></td> </tr>
    <tr><th>Valor mínimo</th> <td><code class="literal">0</code></td> </tr>
    <tr><th>Valor máximo</th> <td><code class="literal">12</code></td> </tr>
  </table>3

  Ignorar a leitura de opções a partir do arquivo de caminho de login.

* `--loops=#`

<table frame="box" rules="all" summary="Propriedades para connect-retries"><tr><th>Formato de linha de comando</th> <td><code class="literal">--connect-retries=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">12</code></td> </tr><tr><th>Valor mínimo</th> <td><code class="literal">0</code></td> </tr><tr><th>Valor máximo</th> <td><code class="literal">12</code></td> </tr></table>4

Repita os comandos quantas vezes este número (para uso em testes).

* `--ndb-connectstring`

<table frame="box" rules="all" summary="Propriedades para connect-retries"><tr><th>Formato de linha de comando</th> <td><code class="literal">--connect-retries=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">12</code></td> </tr><tr><th>Valor mínimo</th> <td><code class="literal">0</code></td> </tr><tr><th>Valor máximo</th> <td><code class="literal">12</code></td> </tr></table>5

Defina a string de conexão para se conectar ao **ndb\_mgmd**. Sintaxe: `[nodeid=id;][host=]hostname[:port]`. Sobrime entradas em `NDB_CONNECTSTRING` e `my.cnf`.

* `--ndb-mgm-tls`

<table frame="box" rules="all" summary="Propriedades para connect-retries"><tr><th>Formato de linha de comando</th> <td><code class="literal">--connect-retries=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">12</code></td> </tr><tr><th>Valor mínimo</th> <td><code class="literal">0</code></td> </tr><tr><th>Valor máximo</th> <td><code class="literal">12</code></td> </tr></table>6

Define o nível de suporte TLS necessário para se conectar ao servidor de gerenciamento; `relaxed` ou `strict`. `relaxed` (o padrão) significa que uma conexão TLS é tentada, mas o sucesso não é necessário; `strict` significa que o TLS é necessário para se conectar.

* `--ndb-mgmd-host`

  <table frame="box" rules="all" summary="Propriedades para connect-retries"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--connect-retries=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">12</code></td> </tr><tr><th>Valor mínimo</th> <td><code class="literal">0</code></td> </tr><tr><th>Valor máximo</th> <td><code class="literal">12</code></td> </tr></tbody></table>7

  O mesmo que `--ndb-connectstring`.

* `--ndb-nodeid`

  <table frame="box" rules="all" summary="Propriedades para connect-retries"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--connect-retries=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">12</code></td> </tr><tr><th>Valor mínimo</th> <td><code class="literal">0</code></td> </tr><tr><th>Valor máximo</th> <td><code class="literal">12</code></td> </tr></tbody></table>8

  Defina o ID do nó para este nó, substituindo qualquer ID definido por `--ndb-connectstring`.

* `--ndb-optimized-node-selection`

<table frame="box" rules="all" summary="Propriedades para connect-retries">
  <tr><th>Formato de linha de comando</th> <td><code class="literal">--connect-retries=#</code></td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor padrão</th> <td><code class="literal">12</code></td> </tr>
  <tr><th>Valor mínimo</th> <td><code class="literal">0</code></td> </tr>
  <tr><th>Valor máximo</th> <td><code class="literal">12</code></td> </tr>
</table>

  Ative otimizações para a seleção de nós para transações. Ativado por padrão; use `--skip-ndb-optimized-node-selection` para desativá-lo.

* `--ndb-tls-search-path`

  <table frame="box" rules="all" summary="Propriedades para delay-connect-retry">
    <tr><th>Formato de linha de comando</th> <td><code class="literal">--connect-retry-delay=#</code></td> </tr>
    <tr><th>Tipo</th> <td>Inteiro</td> </tr>
    <tr><th>Valor padrão</th> <td><code class="literal">5</code></td> </tr>
    <tr><th>Valor mínimo</th> <td><code class="literal">0</code></td> </tr>
    <tr><th>Valor máximo</th> <td><code class="literal">5</code></td> </tr>
  </table>

  Especifique uma lista de diretórios para pesquisar por um arquivo CA. Em plataformas Unix, os nomes dos diretórios são separados por colchetes (`:`); em sistemas Windows, o caractere ponto e vírgula (`;`) é usado como separador. Uma referência de diretório pode ser relativa ou absoluta; pode conter uma ou mais variáveis de ambiente, cada uma denotada por um sinal de dólar prefixado (`$`), e expandida antes de ser usada.

A busca começa com o diretório nomeado mais à esquerda e prossegue de esquerda para direita até que um arquivo seja encontrado. Uma string vazia indica um caminho de busca vazio, o que faz com que todas as buscas falhem. Uma string composta por um único ponto (`.`) indica que o caminho de busca é limitado ao diretório de trabalho atual.

Se não for fornecido um caminho de busca, o valor padrão integrado é usado. Esse valor depende da plataforma usada: no Windows, é `\ndb-tls`; em outras plataformas (incluindo Linux), é `$HOME/ndb-tls`. Isso pode ser sobreposto compilando o NDB Cluster usando `-DWITH_NDB_TLS_SEARCH_PATH`.

* `--no-defaults`

  <table frame="box" rules="all" summary="Propriedades para connect-retry-delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--connect-retry-delay=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal">5</code></td> </tr><tr><th>Valor Mínima</th> <td><code class="literal">0</code></td> </tr><tr><th>Valor Máximo</th> <td><code class="literal">5</code></td> </tr></tbody></table>1

  Não leia opções padrão de nenhum arquivo de opção que não seja o arquivo de login.

* `--print-defaults`

  <table frame="box" rules="all" summary="Propriedades para connect-retry-delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--connect-retry-delay=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal">5</code></td> </tr><tr><th>Valor Mínima</th> <td><code class="literal">0</code></td> </tr><tr><th>Valor Máximo</th> <td><code class="literal">5</code></td> </tr></tbody></table>2

  Imprima a lista de argumentos do programa e saia.

* `--query=#`

<table frame="box" rules="all" summary="Propriedades para connect-retry-delay"><tr><th>Formato de linha de comando</th> <td><code class="literal">--connect-retry-delay=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">5</code></td> </tr><tr><th>Valor mínimo</th> <td><code class="literal">0</code></td> </tr><tr><th>Valor máximo</th> <td><code class="literal">5</code></td> </tr></table>3

Realize consultas aleatórias em um intervalo de valores na primeira propriedade de chave (deve ser um número inteiro sem sinal).

* `--sys-drop`

<table frame="box" rules="all" summary="Propriedades para connect-retry-delay"><tr><th>Formato de linha de comando</th> <td><code class="literal">--connect-retry-delay=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">5</code></td> </tr><tr><th>Valor mínimo</th> <td><code class="literal">0</code></td> </tr><tr><th>Valor máximo</th> <td><code class="literal">5</code></td> </tr></table>4

Exclua todas as tabelas de estatísticas e eventos no kernel NDB. *Isso faz com que todas as estatísticas sejam perdidas*.

* `--sys-create`

<table frame="box" rules="all" summary="Propriedades para connect-retry-delay"><tr><th>Formato de linha de comando</th> <td><code class="literal">--connect-retry-delay=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">5</code></td> </tr><tr><th>Valor mínimo</th> <td><code class="literal">0</code></td> </tr><tr><th>Valor máximo</th> <td><code class="literal">5</code></td> </tr></table>5

Crie todas as tabelas de estatísticas e eventos no kernel NDB. Isso funciona apenas se nenhuma delas já existir anteriormente.

* `--sys-create-if-not-exist`

  <table frame="box" rules="all" summary="Propriedades para connect-retry-delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--connect-retry-delay=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">5</code></td> </tr><tr><th>Valor mínimo</th> <td><code class="literal">0</code></td> </tr><tr><th>Valor máximo</th> <td><code class="literal">5</code></td> </tr></tbody></table>6

  Crie quaisquer tabelas de estatísticas ou eventos do sistema NDB que ainda não existam quando o programa for invocado.

* `--sys-create-if-not-valid`

  <table frame="box" rules="all" summary="Propriedades para connect-retry-delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--connect-retry-delay=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">5</code></td> </tr><tr><th>Valor mínimo</th> <td><code class="literal">0</code></td> </tr><tr><th>Valor máximo</th> <td><code class="literal">5</code></td> </tr></tbody></table>7

  Crie quaisquer tabelas de estatísticas ou eventos do sistema NDB que ainda não existam, após descartar quaisquer que sejam inválidas.

* `--sys-check`

<table frame="box" rules="all" summary="Propriedades para connect-retry-delay">
  <tr>
    <th>Formato de linha de comando</th> <td><code class="literal">--connect-retry-delay=#</code></td> </tr>
    <th>Tipo</th> <td>Inteiro</td> </tr>
    <tr>
      <th>Valor padrão</th> <td><code class="literal">5</code></td> </tr>
    <tr>
      <th>Valor mínimo</th> <td><code class="literal">0</code></td> </tr>
    <tr>
      <th>Valor máximo</th> <td><code class="literal">5</code></td> </tr>
  </tr>
</table>8

  Verifique se todas as tabelas de estatísticas de sistema necessárias e eventos existem no kernel NDB.

* `--sys-skip-tables`

  <table frame="box" rules="all" summary="Propriedades para connect-retry-delay">
    <tr>
      <th>Formato de linha de comando</th> <td><code class="literal">--connect-retry-delay=#</code></td> </tr>
      <th>Tipo</th> <td>Inteiro</td> </tr>
      <tr>
        <th>Valor padrão</th> <td><code class="literal">5</code></td> </tr>
      <tr>
        <th>Valor mínimo</th> <td><code class="literal">0</code></td> </tr>
      <tr>
        <th>Valor máximo</th> <td><code class="literal">5</code></td> </tr>
    </tr>
  </table>9

  Não aplique nenhuma opção `--sys-*` a nenhuma tabela de estatísticas.

* `--sys-skip-events`

  <table frame="box" rules="all" summary="Propriedades para connect-string">
    <tr>
      <th>Formato de linha de comando</th> <td><code class="literal">--connect-string=connection_string</code></td> </tr>
      <th>Tipo</th> <td>String</td> </tr>
      <tr>
        <th>Valor padrão</th> <td><code class="literal">[none]</code></td> </tr>
    </tr>
  </table>0

  Não aplique nenhuma opção `--sys-*` a nenhum evento.

* `--update`

<table frame="box" rules="all" summary="Propriedades para connect-string">
  <tr><th>Formato de linha de comando</th> <td><code class="literal">--connect-string=connection_string</code></td> </tr>
  <tr><th>Tipo</th> <td>String</td> </tr>
  <tr><th>Valor padrão</th> <td><code class="literal">[none]</code></td> </tr>
</table>1

  Atualize as estatísticas do índice para a tabela fornecida e reinicie qualquer atualização automática que foi configurada anteriormente.

* `--usage`

  <table frame="box" rules="all" summary="Propriedades para connect-string">
    <tr><th>Formato de linha de comando</th> <td><code class="literal">--connect-string=connection_string</code></td> </tr>
    <tr><th>Tipo</th> <td>String</td> </tr>
    <tr><th>Valor padrão</th> <td><code class="literal">[none]</code></td> </tr>
  </table>2

  Exibir texto de ajuda e sair; o mesmo que `--help`.

* `--verbose`

  <table frame="box" rules="all" summary="Propriedades para connect-string">
    <tr><th>Formato de linha de comando</th> <td><code class="literal">--connect-string=connection_string</code></td> </tr>
    <tr><th>Tipo</th> <td>String</td> </tr>
    <tr><th>Valor padrão</th> <td><code class="literal">[none]</code></td> </tr>
  </table>3

  Ative a saída verbose.

* `--version`

  <table frame="box" rules="all" summary="Propriedades para connect-string">
    <tr><th>Formato de linha de comando</th> <td><code class="literal">--connect-string=connection_string</code></td> </tr>
    <tr><th>Tipo</th> <td>String</td> </tr>
    <tr><th>Valor padrão</th> <td><code class="literal">[none]</code></td> </tr>
  </table>4

  Exibir informações da versão e sair.

**Opções do sistema ndb\_index\_stat.** As seguintes opções são usadas para gerar e atualizar as tabelas de estatísticas no kernel NDB. Nenhuma dessas opções pode ser combinada com opções de estatísticas (veja as opções de estatísticas ndb\_index\_stat).

* `--sys-drop`
* `--sys-create`
* `--sys-create-if-not-exist`
* `--sys-create-if-not-valid`
* `--sys-check`
* `--sys-skip-tables`
* `--sys-skip-events`

**Opções de estatísticas ndb\_index\_stat.** As opções listadas aqui são usadas para gerar estatísticas de índice. Elas funcionam com uma tabela e um banco de dados específicos. Não podem ser combinadas com opções de sistema (veja as opções de sistema ndb\_index\_stat).

* `--database`
* `--delete`
* `--update`
* `--dump`
* `--query`