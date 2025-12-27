### 25.5.6 ndb\_blob\_tool — Verificar e reparar colunas BLOB e TEXTO de tabelas de NDB Cluster

Essa ferramenta pode ser usada para verificar e remover partes de colunas BLOB e TEXTO de tabelas `NDB`, além de gerar um arquivo listando quaisquer partes órfãs. Às vezes, é útil para diagnosticar e reparar tabelas `NDB` corrompidas ou danificadas que contêm colunas `BLOB` ou `TEXTO`.

A sintaxe básica para **ndb\_blob\_tool** é mostrada aqui:

```
ndb_blob_tool [options] table [column, ...]
```

A menos que você use a opção `--help`, você deve especificar uma ação a ser realizada, incluindo uma ou mais das opções `--check-orphans`, `--delete-orphans` ou `--dump-file`. Essas opções fazem com que **ndb\_blob\_tool** verifique partes de BLOB órfãs, remova quaisquer partes de BLOB órfãs e gere um arquivo de dump listando partes de BLOB órfãs, respectivamente, e são descritas com mais detalhes mais adiante nesta seção.

Você também deve especificar o nome de uma tabela ao invocar **ndb\_blob\_tool**. Além disso, você pode opcionalmente seguir o nome da tabela com os nomes (separados por vírgula) de uma ou mais colunas `BLOB` ou `TEXTO` dessa tabela. Se nenhuma coluna for listada, a ferramenta trabalha em todas as colunas `BLOB` e `TEXTO` da tabela. Se você precisar especificar um banco de dados, use a opção `--database` (`-d`).

A opção `--verbose` fornece informações adicionais na saída sobre o progresso da ferramenta.

Todas as opções que podem ser usadas com **ndb\_mgmd** são mostradas na tabela a seguir. Descrições adicionais seguem a tabela.

* `--add-missing`

  <table frame="box" rules="all" summary="Propriedades para add-missing"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--add-missing</code></td> </tr></tbody></table>

Para cada parte em linha nas tabelas do NDB Cluster que não tenha uma parte BLOB correspondente, escreva uma parte BLOB fictícia do comprimento necessário, composta por espaços.

* `--character-sets-dir`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--character-sets-dir=caminho</code></td> </tr></tbody></table>

  Diretório contendo conjuntos de caracteres.

* `--check-missing`

  <table frame="box" rules="all" summary="Propriedades para check-missing"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--check-missing</code></td> </tr></tbody></table>

  Verifique partes em linha nas tabelas do NDB Cluster que não tenham partes BLOB correspondentes.

* `--check-orphans`

  <table frame="box" rules="all" summary="Propriedades para check-orphans"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--check-orphans</code></td> </tr></tbody></table>

  Verifique partes BLOB nas tabelas do NDB Cluster que não tenham partes em linha correspondentes.

* `--connect-retries`

  <table frame="box" rules="all" summary="Propriedades para connect-retries"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--connect-retries=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">12</code></td> </tr><tr><th>Valor mínimo</th> <td><code class="literal">0</code></td> </tr><tr><th>Valor máximo</th> <td><code class="literal">12</code></td> </tr></tbody></table>

  Número de tentativas para reconectar antes de desistir.

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

Escrever o arquivo de código em caso de erro; usado em depuração.

* `--database=db_name`, `-d`

<table frame="box" rules="all" summary="Propriedades para database">
  <tr><th>Formato de linha de comando</th> <td><code class="literal">--database=name</code></td> </tr>
</table>

Especificar a base de dados para encontrar a tabela.

* `--defaults-extra-file`

Leia o arquivo fornecido após a leitura dos arquivos globais.

* `--defaults-file`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--character-sets-dir=caminho</code></td> </tr></tbody></table>0

  Leia as opções padrão do arquivo fornecido apenas.

* `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--character-sets-dir=caminho</code></td> </tr></tbody></table>1

  Leia também os grupos com concatenação(grupo, sufixo).

* `--delete-orphans`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--character-sets-dir=caminho</code></td> </tr></tbody></table>2

  Remova partes BLOB das tabelas do NDB Cluster que não têm partes correspondentes em linha.

* `--dump-file=arquivo`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--character-sets-dir=caminho</code></td> </tr></tbody></table>3

Escreve uma lista das partes de coluna BLOB órfãs em *`file`*. As informações escritas no arquivo incluem a chave da tabela e o número da parte BLOB para cada parte BLOB órfã.

* `--help`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--character-sets-dir=caminho</code></td> </tr></tbody></table>4

  Exibe texto de ajuda e sai.

* `--login-path`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--character-sets-dir=caminho</code></td> </tr></tbody></table>5

  Leia o caminho fornecido a partir do arquivo de login.

* `--no-login-paths`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--character-sets-dir=caminho</code></td> </tr></tbody></table>6

  Ignora a leitura de opções a partir do arquivo de caminho de login.

* `--ndb-connectstring`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--character-sets-dir=caminho</code></td> </tr></tbody></table>7

  Defina a string de conexão para se conectar ao **ndb\_mgmd**. Sintaxe: `[nodeid=id;][host=]hostname[:port]`. Sobrescreve entradas em `NDB_CONNECTSTRING` e `my.cnf`.

* `--ndb-mgm-tls`

<table frame="box" rules="all" summary="Propriedades para character-sets-dir">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code class="literal">--character-sets-dir=caminho</code></td>
  </tr>
</table>8

  Define o nível de suporte TLS necessário para se conectar ao servidor de gerenciamento; um dos valores `relaxado` ou `estricto`. `relaxado` (o padrão) significa que uma conexão TLS é tentada, mas o sucesso não é necessário; `estricto` significa que a conexão TLS é necessária para se conectar.

* `--ndb-mgmd-host`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir">
    <tr>
      <th>Formato de linha de comando</th>
      <td><code class="literal">--character-sets-dir=caminho</code></td>
    </tr>
  </table>9

  O mesmo que `--ndb-connectstring`.

* `--ndb-nodeid`

  <table frame="box" rules="all" summary="Propriedades para check-missing">
    <tr>
      <th>Formato de linha de comando</th>
      <td><code class="literal">--check-missing</code></td>
    </tr>
  </table>0

  Defina o ID do nó para este nó, substituindo qualquer ID definido por `--ndb-connectstring`.

* `--ndb-optimized-node-selection`

  <table frame="box" rules="all" summary="Propriedades para check-missing">
    <tr>
      <th>Formato de linha de comando</th>
      <td><code class="literal">--check-missing</code></td>
    </tr>
  </table>1

  Ative otimizações para a seleção de nós para transações. Ativado por padrão; use `--skip-ndb-optimized-node-selection` para desativá-lo.

* `--ndb-tls-search-path`

<table frame="box" rules="all" summary="Propriedades para check-missing">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code class="literal">--check-missing</code></td>
  </tr>
</table>2

  Especifique uma lista de diretórios para procurar um arquivo CA. Em plataformas Unix, os nomes dos diretórios são separados por colchetes (`:`); em sistemas Windows, o caractere ponto e vírgula (`;`) é usado como separador. Uma referência de diretório pode ser relativa ou absoluta; pode conter uma ou mais variáveis de ambiente, cada uma denotada por um sinal de dólar prefixado (`$`), e expandida antes de ser usada.

  A busca começa com o diretório mais à esquerda nomeado e prossegue de esquerda para direita até que um arquivo seja encontrado. Uma string vazia denota um caminho de busca vazio, o que faz com que todas as buscas falhem. Uma string composta por um único ponto (`.`) indica que o caminho de busca é limitado ao diretório de trabalho atual.

  Se não for fornecido um caminho de busca, o valor padrão integrado é usado. Esse valor depende da plataforma usada: em Windows, é `\ndb-tls`; em outras plataformas (incluindo Linux), é `$HOME/ndb-tls`. Isso pode ser sobreposto compilando o NDB Cluster usando `-DWITH_NDB_TLS_SEARCH_PATH`.

* `--no-defaults`

  <table frame="box" rules="all" summary="Propriedades para check-missing">
    <tr>
      <th>Formato de linha de comando</th>
      <td><code class="literal">--check-missing</code></td>
    </tr>
  </table>3

  Não leia opções padrão de nenhum arquivo de opção diferente do arquivo de login.

* `--print-defaults`

<table frame="box" rules="all" summary="Propriedades para check-missing">
  <tr><th>Formato de Linha de Comando</th> <td><code class="literal">--check-missing</code></td> </tr>
</table>4

Imprimir a lista de argumentos do programa e sair.

* `--usage`

<table frame="box" rules="all" summary="Propriedades para check-missing">
  <tr><th>Formato de Linha de Comando</th> <td><code class="literal">--check-missing</code></td> </tr>
</table>5

Exibir o texto de ajuda e sair; o mesmo que `--help`.

* `--verbose`

<table frame="box" rules="all" summary="Propriedades para check-missing">
  <tr><th>Formato de Linha de Comando</th> <td><code class="literal">--check-missing</code></td> </tr>
</table>6

Fornecer informações adicionais na saída da ferramenta sobre seu progresso.

* `--version`

<table frame="box" rules="all" summary="Propriedades para check-missing">
  <tr><th>Formato de Linha de Comando</th> <td><code class="literal">--check-missing</code></td> </tr>
</table>7

Exibir informações sobre a versão e sair.

#### Exemplo

Primeiro, criamos uma tabela `NDB` no banco de dados `test`, usando a instrução `CREATE TABLE` mostrada aqui:

```
USE test;

CREATE TABLE btest (
    c0 BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    c1 TEXT,
    c2 BLOB
)   ENGINE=NDB;
```

Em seguida, inserimos algumas linhas nesta tabela, usando uma série de instruções semelhantes a esta:

```
INSERT INTO btest VALUES (NULL, 'x', REPEAT('x', 1000));
```

Quando executado com `--check-orphans` contra esta tabela, **ndb\_blob\_tool** gera a seguinte saída:

```
$> ndb_blob_tool --check-orphans --verbose -d test btest
connected
processing 2 blobs
processing blob #0 c1 NDB$BLOB_19_1
NDB$BLOB_19_1: nextResult: res=1
total parts: 0
orphan parts: 0
processing blob #1 c2 NDB$BLOB_19_2
NDB$BLOB_19_2: nextResult: res=0
NDB$BLOB_19_2: nextResult: res=0
NDB$BLOB_19_2: nextResult: res=0
NDB$BLOB_19_2: nextResult: res=0
NDB$BLOB_19_2: nextResult: res=0
NDB$BLOB_19_2: nextResult: res=0
NDB$BLOB_19_2: nextResult: res=0
NDB$BLOB_19_2: nextResult: res=0
NDB$BLOB_19_2: nextResult: res=0
NDB$BLOB_19_2: nextResult: res=0
NDB$BLOB_19_2: nextResult: res=1
total parts: 10
orphan parts: 0
disconnected
```

A ferramenta relata que não há partes da coluna `NDB` BLOB associadas à coluna `c1`, embora `c1` seja uma coluna `TEXT`. Isso ocorre porque, em uma tabela `NDB`, apenas os primeiros 256 bytes do valor de uma coluna `BLOB` ou `TEXT` são armazenados inline, e apenas o excesso, se houver, é armazenado separadamente; assim, se não houver valores que utilizem mais de 256 bytes em uma coluna específica desses tipos, a `NDB` não cria partes da coluna `BLOB` para essa coluna. Consulte a Seção 13.7, “Requisitos de Armazenamento de Tipo de Dados”, para obter mais informações.