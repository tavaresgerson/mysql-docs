### 21.5.6 ndb_blob_tool — Verificar e reparar colunas BLOB e TEXT de tabelas de NDB Cluster

Essa ferramenta pode ser usada para verificar e remover partes de colunas BLOB órfãs das tabelas de `NDB`, além de gerar um arquivo listando todas as partes órfãs. Às vezes, é útil para diagnosticar e reparar tabelas `NDB` corrompidas ou danificadas que contêm colunas `BLOB` ou `TEXT`.

A sintaxe básica para o **ndb_blob_tool** é mostrada aqui:

```sql
ndb_blob_tool [options] table [column, ...]
```

A menos que você use a opção `--help` (mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_help), você deve especificar uma ação a ser realizada, incluindo uma ou mais das opções `--check-orphans` (mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_check-orphans), `--delete-orphans` (mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_delete-orphans) ou `--dump-file` (mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_dump-file). Essas opções fazem com que o **ndb_blob_tool** verifique as partes de BLOB órfãs, remova quaisquer partes de BLOB órfãs e gere um arquivo de dump listando as partes de BLOB órfãs, respectivamente, e são descritas com mais detalhes mais adiante nesta seção.

Você também deve especificar o nome de uma tabela ao invocar **ndb_blob_tool**. Além disso, você pode, opcionalmente, seguir o nome da tabela com os nomes (separados por vírgula) de uma ou mais colunas de `BLOB` ou `TEXT` dessa tabela. Se nenhuma coluna estiver listada, a ferramenta funciona em todas as colunas de `BLOB` e `TEXT` da tabela. Se você precisar especificar um banco de dados, use a opção `--database` (`-d`).

A opção `--verbose` fornece informações adicionais na saída sobre o progresso da ferramenta.

As opções que podem ser usadas com **ndb_blob_tool** estão mostradas na tabela a seguir. Descrições adicionais seguem a tabela.

**Tabela 21.26 Opções de linha de comando usadas com o programa ndb_blob_tool**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th>Formato</th> <th>Descrição</th> <th>Adicionado, Descontinuado ou Removido</th> </tr></thead><tbody><tr> <th><p> PH_HTML_CODE_<code> -d name </code>] </p></th> <td>Escreva partes de blobs fictícias para substituir aquelas que estão faltando</td> <td><p>ADICIONADO: NDB 7.5.18, NDB 7.6.14</p></td> </tr></tbody><tbody><tr> <th><p> PH_HTML_CODE_<code> -d name </code>] </p></th> <td>Diretório contendo conjuntos de caracteres</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> PH_HTML_CODE_<code> --defaults-file=path </code>] </p></th> <td>Verifique se há blocos com partes em linha, mas faltando uma ou mais partes da tabela de partes</td> <td><p>ADICIONADO: NDB 7.5.18, NDB 7.6.14</p></td> </tr></tbody><tbody><tr> <th><p> PH_HTML_CODE_<code> --defaults-group-suffix=string </code>] </p></th> <td>Verifique se há partes de blob sem partes correspondentes em linha</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> PH_HTML_CODE_<code> --delete-orphans </code>] </p></th> <td>Número de vezes para tentar a conexão novamente antes de desistir</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> PH_HTML_CODE_<code> --dump-file=file </code>] </p></th> <td>Número de segundos para esperar entre as tentativas de contato com o servidor de gerenciamento</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p>PH_HTML_CODE_<code>--help</code>],</p><p> PH_HTML_CODE_<code> -? </code>] </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> PH_HTML_CODE_<code> --login-path=path </code>] </p></th> <td>Escreva o arquivo de núcleo em erro; usado no depuração</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p>PH_HTML_CODE_<code>--ndb-connectstring=connection_string</code>],</p><p> <code> -d name </code> </p></th> <td>Banco de dados para encontrar a tabela em</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> <code> --character-sets-dir=path </code><code> -d name </code>] </p></th> <td>Leia o arquivo fornecido após os arquivos globais terem sido lidos</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> <code> --defaults-file=path </code> </p></th> <td>Ler opções padrão a partir do arquivo fornecido apenas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> <code> --defaults-group-suffix=string </code> </p></th> <td>Leia também grupos com concatenação(grupo, sufixo)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> <code> --delete-orphans </code> </p></th> <td>Excluir partes de blob sem partes correspondentes em linha</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> <code> --dump-file=file </code> </p></th> <td>Escreva chaves órfãs no arquivo especificado</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p><code>--help</code>,</p><p> <code> -? </code> </p></th> <td>Exibir texto de ajuda e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> <code> --login-path=path </code> </p></th> <td>Leia o caminho fornecido a partir do arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p><code>--ndb-connectstring=connection_string</code>,</p><p> <code> --check-missing </code><code> -d name </code>] </p></th> <td>Defina a string de conexão para se conectar ao ndb_mgmd. Sintaxe: "[nodeid=id;][host=]hostname[:por<code> -d name </code>". Substitui as entradas no NDB_CONNECTSTRING e no my.cnf</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p><code> --check-missing </code><code> -d name </code>],</p><p> <code> --check-missing </code><code> --defaults-file=path </code>] </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> <code> --check-missing </code><code> --defaults-group-suffix=string </code>] </p></th> <td>Defina o ID do nó para este nó, substituindo qualquer ID definida pela opção --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> <code> --check-missing </code><code> --delete-orphans </code>] </p></th> <td>Ative as otimizações para a seleção de nós para transações. Ativado por padrão; use --skip-ndb-optimized-node-selection para desativá-lo</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> <code> --check-missing </code><code> --dump-file=file </code>] </p></th> <td>Não leia as opções padrão de nenhum arquivo de opção, exceto o arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> <code> --check-missing </code><code>--help</code>] </p></th> <td>Imprimir a lista de argumentos do programa e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p><code> --check-missing </code><code> -? </code>],</p><p> <code> --check-missing </code><code> --login-path=path </code>] </p></th> <td>Exibir texto de ajuda e sair; o mesmo que --help</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p><code> --check-missing </code><code>--ndb-connectstring=connection_string</code>],</p><p> <code> --check-orphans </code><code> -d name </code>] </p></th> <td>Saída verborrágica</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p><code> --check-orphans </code><code> -d name </code>],</p><p> <code> --check-orphans </code><code> --defaults-file=path </code>] </p></th> <td>Exibir informações da versão e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody></table>

- `--add-missing`

  <table frame="box" rules="all" summary="Propriedades para adicionar ausentes"><tbody><tr><th>Formato de linha de comando</th> <td><code>--add-missing</code></td> </tr><tr><th>Introduzido</th> <td>5.7.29-ndb-7.6.14</td> </tr></tbody></table>

  Para cada parte em linha nas tabelas do NDB Cluster que não tenha uma parte BLOB correspondente, escreva uma parte BLOB fictícia do comprimento necessário, composta por espaços.

- `--character-sets-dir`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Diretório contendo conjuntos de caracteres.

- `--check-missing`

  <table frame="box" rules="all" summary="Propriedades para falta de verificação"><tbody><tr><th>Formato de linha de comando</th> <td><code>--check-missing</code></td> </tr><tr><th>Introduzido</th> <td>5.7.29-ndb-7.6.14</td> </tr></tbody></table>

  Verifique se há partes em linha nas tabelas do NDB Cluster que não têm partes BLOB correspondentes.

- `--check-orphans`

  <table frame="box" rules="all" summary="Propriedades para órfãos de verificação"><tbody><tr><th>Formato de linha de comando</th> <td><code>--check-orphans</code></td> </tr></tbody></table>

  Verifique se há partes BLOB nas tabelas do NDB Cluster que não têm partes correspondentes em linha.

- `--connect-retries`

  <table frame="box" rules="all" summary="Propriedades para tentativas de conexão de reposição"><tbody><tr><th>Formato de linha de comando</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>12</code></td> </tr><tr><th>Valor mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor máximo</th> <td><code>12</code></td> </tr></tbody></table>

  Número de vezes para tentar a conexão novamente antes de desistir.

- `--connect-retry-delay`

  <table frame="box" rules="all" summary="Propriedades para connect-retry-delay"><tbody><tr><th>Formato de linha de comando</th> <td><code>--connect-retry-delay=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>5</code></td> </tr><tr><th>Valor mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor máximo</th> <td><code>5</code></td> </tr></tbody></table>

  Número de segundos para esperar entre as tentativas de contato com o servidor de gerenciamento.

- `--connect-string`

  <table frame="box" rules="all" summary="Propriedades para a string de conexão"><tbody><tr><th>Formato de linha de comando</th> <td><code>--connect-string=connection_string</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  O mesmo que `--ndb-connectstring`.

- `--core-file`

  <table frame="box" rules="all" summary="Propriedades para arquivo de núcleo"><tbody><tr><th>Formato de linha de comando</th> <td><code>--core-file</code></td> </tr></tbody></table>

  Escreva o arquivo de núcleo em erro; usado no depuração.

- `--database=db_name`, `-d`

  <table frame="box" rules="all" summary="Propriedades para banco de dados"><tbody><tr><th>Formato de linha de comando</th> <td><code>--database=name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  Especifique o banco de dados para encontrar a tabela.

- `--defaults-extra-file`

  <table frame="box" rules="all" summary="Propriedades para adicionar ausentes"><tbody><tr><th>Formato de linha de comando</th> <td><code>--add-missing</code></td> </tr><tr><th>Introduzido</th> <td>5.7.29-ndb-7.6.14</td> </tr></tbody></table>

  Leia o arquivo fornecido após a leitura dos arquivos globais.

- `--defaults-file`

  <table frame="box" rules="all" summary="Propriedades para adicionar ausentes"><tbody><tr><th>Formato de linha de comando</th> <td><code>--add-missing</code></td> </tr><tr><th>Introduzido</th> <td>5.7.29-ndb-7.6.14</td> </tr></tbody></table>

  Leia as opções padrão do arquivo fornecido.

- `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Propriedades para adicionar ausentes"><tbody><tr><th>Formato de linha de comando</th> <td><code>--add-missing</code></td> </tr><tr><th>Introduzido</th> <td>5.7.29-ndb-7.6.14</td> </tr></tbody></table>

  Leia também grupos com concatenação (grupo, sufixo).

- `--delete-orphans`

  <table frame="box" rules="all" summary="Propriedades para adicionar ausentes"><tbody><tr><th>Formato de linha de comando</th> <td><code>--add-missing</code></td> </tr><tr><th>Introduzido</th> <td>5.7.29-ndb-7.6.14</td> </tr></tbody></table>

  Remova partes BLOB das tabelas do NDB Cluster que não tenham partes inline correspondentes.

- `--dump-file=arquivo`

  <table frame="box" rules="all" summary="Propriedades para adicionar ausentes"><tbody><tr><th>Formato de linha de comando</th> <td><code>--add-missing</code></td> </tr><tr><th>Introduzido</th> <td>5.7.29-ndb-7.6.14</td> </tr></tbody></table>

  Escreve uma lista das partes de coluna BLOB órfãs em *`file`*. As informações escritas no arquivo incluem a chave da tabela e o número da parte BLOB para cada parte BLOB órfã.

- `--help`

  <table frame="box" rules="all" summary="Propriedades para adicionar ausentes"><tbody><tr><th>Formato de linha de comando</th> <td><code>--add-missing</code></td> </tr><tr><th>Introduzido</th> <td>5.7.29-ndb-7.6.14</td> </tr></tbody></table>

  Exibir texto de ajuda e sair.

- `--login-path`

  <table frame="box" rules="all" summary="Propriedades para adicionar ausentes"><tbody><tr><th>Formato de linha de comando</th> <td><code>--add-missing</code></td> </tr><tr><th>Introduzido</th> <td>5.7.29-ndb-7.6.14</td> </tr></tbody></table>

  Leia o caminho fornecido a partir do arquivo de login.

- `--ndb-connectstring`

  <table frame="box" rules="all" summary="Propriedades para adicionar ausentes"><tbody><tr><th>Formato de linha de comando</th> <td><code>--add-missing</code></td> </tr><tr><th>Introduzido</th> <td>5.7.29-ndb-7.6.14</td> </tr></tbody></table>

  Defina a string de conexão para se conectar ao ndb_mgmd. Sintaxe: "[nodeid=id;][host=]hostname[:port]". Oculte entradas no NDB_CONNECTSTRING e no my.cnf.

- `--ndb-mgmd-host`

  <table frame="box" rules="all" summary="Propriedades para adicionar ausentes"><tbody><tr><th>Formato de linha de comando</th> <td><code>--add-missing</code></td> </tr><tr><th>Introduzido</th> <td>5.7.29-ndb-7.6.14</td> </tr></tbody></table>

  O mesmo que `--ndb-connectstring`.

- `--ndb-nodeid`

  <table frame="box" rules="all" summary="Propriedades para adicionar ausentes"><tbody><tr><th>Formato de linha de comando</th> <td><code>--add-missing</code></td> </tr><tr><th>Introduzido</th> <td>5.7.29-ndb-7.6.14</td> </tr></tbody></table>

  Defina o ID do nó para este nó, substituindo qualquer ID definida por `--ndb-connectstring`.

- `--ndb-optimized-node-selection`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Ative as otimizações para a seleção de nós para transações. Ativado por padrão; use `--skip-ndb-optimized-node-selection` para desativá-lo.

- `--no-defaults`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Não leia as opções padrão de nenhum arquivo de opção, exceto o arquivo de login.

- `--print-defaults`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Imprima a lista de argumentos do programa e saia.

- `--usage`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Exibir texto de ajuda e sair; o mesmo que `--help`.

- `--verbose`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Forneça informações adicionais na saída da ferramenta sobre seu progresso.

- `--version`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Exibir informações da versão e sair.

#### Exemplo

Primeiro, criamos uma tabela `NDB` no banco de dados `test`, usando a instrução `CREATE TABLE` mostrada aqui: CREATE TABLE

```sql
USE test;

CREATE TABLE btest (
    c0 BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    c1 TEXT,
    c2 BLOB
)   ENGINE=NDB;
```

Em seguida, inserimos algumas linhas nessa tabela, usando uma série de declarações semelhantes a esta:

```sql
INSERT INTO btest VALUES (NULL, 'x', REPEAT('x', 1000));
```

Quando executado com `--check-orphans` contra esta tabela, o **ndb_blob_tool** gera a seguinte saída:

```sql
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

NDBT_ProgramExit: 0 - OK
```

A ferramenta relata que não há partes da coluna `NDB` BLOB associadas à coluna `c1`, embora `c1` seja uma coluna `[TEXT]` (blob.html). Isso ocorre porque, em uma tabela `[NDB]` (mysql-cluster.html), apenas os primeiros 256 bytes do valor de uma coluna `BLOB` ou `TEXT` são armazenados inline, e apenas o excesso, se houver, é armazenado separadamente; assim, se não houver valores que utilizem mais de 256 bytes em uma coluna específica desses tipos, a `NDB` não cria partes da coluna `BLOB` para essa coluna. Consulte Seção 11.7, “Requisitos de Armazenamento de Tipos de Dados” para obter mais informações.
