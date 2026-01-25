### 21.5.6 ndb_blob_tool — Verificar e Reparar colunas BLOB e TEXT de Tabelas do NDB Cluster

Esta ferramenta pode ser usada para verificar e remover partes órfãs de colunas BLOB de tabelas [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"), além de gerar um arquivo listando quaisquer partes órfãs. Às vezes, ela é útil no diagnóstico e reparo de tabelas `NDB` corrompidas ou danificadas que contêm colunas [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") ou [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types").

A sintaxe básica para [**ndb_blob_tool**](mysql-cluster-programs-ndb-blob-tool.html "21.5.6 ndb_blob_tool — Check and Repair BLOB and TEXT columns of NDB Cluster Tables") é mostrada aqui:

```sql
ndb_blob_tool [options] table [column, ...]
```

A menos que você use a opção [`--help`](mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_help), você deve especificar uma ação a ser executada incluindo uma ou mais das opções [`--check-orphans`](mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_check-orphans), [`--delete-orphans`](mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_delete-orphans) ou [`--dump-file`](mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_dump-file). Essas opções fazem com que [**ndb_blob_tool**](mysql-cluster-programs-ndb-blob-tool.html "21.5.6 ndb_blob_tool — Check and Repair BLOB and TEXT columns of NDB Cluster Tables") verifique a existência de partes BLOB órfãs, remova quaisquer partes BLOB órfãs e gere um dump file listando as partes BLOB órfãs, respectivamente, e são descritas em mais detalhes posteriormente nesta seção.

Você também deve especificar o nome de uma tabela ao invocar [**ndb_blob_tool**](mysql-cluster-programs-ndb-blob-tool.html "21.5.6 ndb_blob_tool — Check and Repair BLOB and TEXT columns of NDB Cluster Tables"). Além disso, você pode, opcionalmente, seguir o nome da tabela com os nomes (separados por vírgulas) de uma ou mais colunas [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") ou [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types") dessa tabela. Se nenhuma coluna for listada, a ferramenta funciona em todas as colunas [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") e [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types") da tabela. Se você precisar especificar um Database, use a opção [`--database`](mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_database) (`-d`).

A opção [`--verbose`](mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_verbose) fornece informações adicionais na saída sobre o progresso da ferramenta.

As opções que podem ser usadas com [**ndb_blob_tool**](mysql-cluster-programs-ndb-blob-tool.html "21.5.6 ndb_blob_tool — Check and Repair BLOB and TEXT columns of NDB Cluster Tables") são mostradas na tabela a seguir. Descrições adicionais seguem a tabela.

**Tabela 21.26 Opções de linha de comando usadas com o programa ndb_blob_tool**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th>Formato</th> <th>Descrição</th> <th>Adicionado, Descontinuado ou Removido</th> </tr></thead><tbody><tr> <th><p> <code> --add-missing </code> </p></th> <td>Escreve partes BLOB fictícias para substituir aquelas que estão faltando</td> <td><p> ADICIONADO: NDB 7.5.18, NDB 7.6.14 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --character-sets-dir=path </code> </p></th> <td>Diretório contendo character sets</td> <td><p> (Suportado em todos os releases NDB baseados em MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --check-missing </code> </p></th> <td>Verifica BLOBs que possuem partes inline, mas estão faltando uma ou mais partes na tabela de partes</td> <td><p> ADICIONADO: NDB 7.5.18, NDB 7.6.14 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --check-orphans </code> </p></th> <td>Verifica partes BLOB que não possuem partes inline correspondentes</td> <td><p> (Suportado em todos os releases NDB baseados em MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --connect-retries=# </code> </p></th> <td>Número de vezes para tentar a conexão novamente antes de desistir</td> <td><p> (Suportado em todos os releases NDB baseados em MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --connect-retry-delay=# </code> </p></th> <td>Número de segundos de espera entre as tentativas de contato com o management server</td> <td><p> (Suportado em todos os releases NDB baseados em MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--connect-string=connection_string</code>, </p><p> <code> -c connection_string </code> </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p> (Suportado em todos os releases NDB baseados em MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --core-file </code> </p></th> <td>Escreve arquivo core em caso de erro; usado em debugging</td> <td><p> (Suportado em todos os releases NDB baseados em MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--database=name</code>, </p><p> <code> -d name </code> </p></th> <td>Database onde procurar a tabela</td> <td><p> (Suportado em todos os releases NDB baseados em MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --defaults-extra-file=path </code> </p></th> <td>Lê o arquivo fornecido após a leitura dos arquivos globais</td> <td><p> (Suportado em todos os releases NDB baseados em MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --defaults-file=path </code> </p></th> <td>Lê opções default somente do arquivo fornecido</td> <td><p> (Suportado em todos os releases NDB baseados em MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --defaults-group-suffix=string </code> </p></th> <td>Também lê grupos com concat(group, suffix)</td> <td><p> (Suportado em todos os releases NDB baseados em MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --delete-orphans </code> </p></th> <td>Exclui partes BLOB que não possuem partes inline correspondentes</td> <td><p> (Suportado em todos os releases NDB baseados em MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --dump-file=file </code> </p></th> <td>Escreve chaves órfãs para o arquivo especificado</td> <td><p> (Suportado em todos os releases NDB baseados em MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--help</code>, </p><p> <code> -? </code> </p></th> <td>Exibe o texto de ajuda e sai</td> <td><p> (Suportado em todos os releases NDB baseados em MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --login-path=path </code> </p></th> <td>Lê o caminho fornecido a partir do arquivo de login</td> <td><p> (Suportado em todos os releases NDB baseados em MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--ndb-connectstring=connection_string</code>, </p><p> <code> -c connection_string </code> </p></th> <td>Define a connect string para conexão com ndb_mgmd. Sintaxe: "[nodeid=id;][host=]hostname[:port]". Sobrescreve entradas em NDB_CONNECTSTRING e my.cnf</td> <td><p> (Suportado em todos os releases NDB baseados em MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--ndb-mgmd-host=connection_string</code>, </p><p> <code> -c connection_string </code> </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p> (Suportado em todos os releases NDB baseados em MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --ndb-nodeid=# </code> </p></th> <td>Define o ID de node para este node, sobrescrevendo qualquer ID definido por --ndb-connectstring</td> <td><p> (Suportado em todos os releases NDB baseados em MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --ndb-optimized-node-selection </code> </p></th> <td>Habilita otimizações para seleção de nodes para transactions. Habilitado por default; use --skip-ndb-optimized-node-selection para desabilitar</td> <td><p> (Suportado em todos os releases NDB baseados em MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --no-defaults </code> </p></th> <td>Não lê opções default de nenhum option file além do arquivo de login</td> <td><p> (Suportado em todos os releases NDB baseados em MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --print-defaults </code> </p></th> <td>Imprime a lista de argumentos do programa e sai</td> <td><p> (Suportado em todos os releases NDB baseados em MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--usage</code>, </p><p> <code> -? </code> </p></th> <td>Exibe o texto de ajuda e sai; o mesmo que --help</td> <td><p> (Suportado em todos os releases NDB baseados em MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--verbose</code>, </p><p> <code> -v </code> </p></th> <td>Saída detalhada (Verbose)</td> <td><p> (Suportado em todos os releases NDB baseados em MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--version</code>, </p><p> <code> -V </code> </p></th> <td>Exibe informações da versão e sai</td> <td><p> (Suportado em todos os releases NDB baseados em MySQL 5.7) </p></td> </tr></tbody></table>

* `--add-missing`

  <table frame="box" rules="all" summary="Properties for add-missing"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--add-missing</code></td> </tr><tr><th>Introduzido</th> <td>5.7.29-ndb-7.6.14</td> </tr></tbody></table>

  Para cada parte inline em tabelas NDB Cluster que não tem uma parte BLOB correspondente, escreve uma parte BLOB fictícia do comprimento exigido, consistindo em espaços.

* `--character-sets-dir`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Diretório contendo character sets.

* `--check-missing`

  <table frame="box" rules="all" summary="Properties for check-missing"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--check-missing</code></td> </tr><tr><th>Introduzido</th> <td>5.7.29-ndb-7.6.14</td> </tr></tbody></table>

  Verifica partes inline em tabelas NDB Cluster que não possuem partes BLOB correspondentes.

* `--check-orphans`

  <table frame="box" rules="all" summary="Properties for check-orphans"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--check-orphans</code></td> </tr></tbody></table>

  Verifica partes BLOB em tabelas NDB Cluster que não possuem partes inline correspondentes.

* `--connect-retries`

  <table frame="box" rules="all" summary="Properties for connect-retries"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Default</th> <td><code>12</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>12</code></td> </tr></tbody></table>

  Número de vezes para tentar a conexão novamente antes de desistir.

* `--connect-retry-delay`

  <table frame="box" rules="all" summary="Properties for connect-retry-delay"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--connect-retry-delay=#</code></td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Default</th> <td><code>5</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>5</code></td> </tr></tbody></table>

  Número de segundos de espera entre as tentativas de contato com o management server.

* `--connect-string`

  <table frame="box" rules="all" summary="Properties for connect-string"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--connect-string=connection_string</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Default</th> <td><code>[nenhum]</code></td> </tr></tbody></table>

  O mesmo que [`--ndb-connectstring`](mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_ndb-connectstring).

* `--core-file`

  <table frame="box" rules="all" summary="Properties for core-file"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--core-file</code></td> </tr></tbody></table>

  Escreve arquivo core em caso de erro; usado em debugging.

* `--database=db_name`, `-d`

  <table frame="box" rules="all" summary="Properties for database"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--database=name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Default</th> <td><code>[nenhum]</code></td> </tr></tbody></table>

  Especifica o Database onde procurar a tabela.

* `--defaults-extra-file`

  <table frame="box" rules="all" summary="Properties for add-missing"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--add-missing</code></td> </tr><tr><th>Introduzido</th> <td>5.7.29-ndb-7.6.14</td> </tr></tbody></table>

  Lê o arquivo fornecido após a leitura dos arquivos globais.

* `--defaults-file`

  <table frame="box" rules="all" summary="Properties for add-missing"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--add-missing</code></td> </tr><tr><th>Introduzido</th> <td>5.7.29-ndb-7.6.14</td> </tr></tbody></table>

  Lê opções default somente do arquivo fornecido.

* `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Properties for add-missing"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--add-missing</code></td> </tr><tr><th>Introduzido</th> <td>5.7.29-ndb-7.6.14</td> </tr></tbody></table>

  Também lê grupos com concat(group, suffix).

* `--delete-orphans`

  <table frame="box" rules="all" summary="Properties for add-missing"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--add-missing</code></td> </tr><tr><th>Introduzido</th> <td>5.7.29-ndb-7.6.14</td> </tr></tbody></table>

  Remove partes BLOB de tabelas NDB Cluster que não possuem partes inline correspondentes.

* `--dump-file=file`

  <table frame="box" rules="all" summary="Properties for add-missing"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--add-missing</code></td> </tr><tr><th>Introduzido</th> <td>5.7.29-ndb-7.6.14</td> </tr></tbody></table>

  Escreve uma lista de partes órfãs de colunas BLOB para *`file`*. A informação escrita no arquivo inclui a chave da tabela (table key) e o número da parte BLOB para cada parte BLOB órfã.

* `--help`

  <table frame="box" rules="all" summary="Properties for add-missing"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--add-missing</code></td> </tr><tr><th>Introduzido</th> <td>5.7.29-ndb-7.6.14</td> </tr></tbody></table>

  Exibe o texto de ajuda e sai.

* `--login-path`

  <table frame="box" rules="all" summary="Properties for add-missing"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--add-missing</code></td> </tr><tr><th>Introduzido</th> <td>5.7.29-ndb-7.6.14</td> </tr></tbody></table>

  Lê o caminho fornecido a partir do arquivo de login.

* `--ndb-connectstring`

  <table frame="box" rules="all" summary="Properties for add-missing"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--add-missing</code></td> </tr><tr><th>Introduzido</th> <td>5.7.29-ndb-7.6.14</td> </tr></tbody></table>

  Define a connect string para conexão com ndb_mgmd. Sintaxe: "[nodeid=id;][host=]hostname[:port]". Sobrescreve entradas em NDB_CONNECTSTRING e my.cnf.

* `--ndb-mgmd-host`

  <table frame="box" rules="all" summary="Properties for add-missing"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--add-missing</code></td> </tr><tr><th>Introduzido</th> <td>5.7.29-ndb-7.6.14</td> </tr></tbody></table>

  O mesmo que [`--ndb-connectstring`](mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_ndb-connectstring).

* `--ndb-nodeid`

  <table frame="box" rules="all" summary="Properties for add-missing"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--add-missing</code></td> </tr><tr><th>Introduzido</th> <td>5.7.29-ndb-7.6.14</td> </tr></tbody></table>

  Define o ID de node para este node, sobrescrevendo qualquer ID definido por [`--ndb-connectstring`](mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_ndb-connectstring).

* `--ndb-optimized-node-selection`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Habilita otimizações para seleção de nodes para transactions. Habilitado por default; use `--skip-ndb-optimized-node-selection` para desabilitar.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Não lê opções default de nenhum option file além do arquivo de login.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Imprime a lista de argumentos do programa e sai.

* `--usage`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Exibe o texto de ajuda e sai; o mesmo que [`--help`](mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_help).

* `--verbose`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Fornece informações extras na saída da ferramenta sobre seu progresso.

* `--version`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Exibe informações da versão e sai.

#### Exemplo

Primeiro criamos uma tabela `NDB` no Database `test`, usando o comando [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") mostrado aqui:

```sql
USE test;

CREATE TABLE btest (
    c0 BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    c1 TEXT,
    c2 BLOB
)   ENGINE=NDB;
```

Em seguida, inserimos algumas linhas nesta tabela, usando uma série de comandos semelhantes a este:

```sql
INSERT INTO btest VALUES (NULL, 'x', REPEAT('x', 1000));
```

Quando executado com [`--check-orphans`](mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_check-orphans) contra esta tabela, [**ndb_blob_tool**](mysql-cluster-programs-ndb-blob-tool.html "21.5.6 ndb_blob_tool — Check and Repair BLOB and TEXT columns of NDB Cluster Tables") gera a seguinte saída:

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

A ferramenta relata que não há partes de coluna BLOB `NDB` associadas à coluna `c1`, embora `c1` seja uma coluna [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types"). Isso se deve ao fato de que, em uma tabela [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"), apenas os primeiros 256 bytes de um valor de coluna [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") ou [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types") são armazenados inline (em linha), e apenas o excesso, se houver, é armazenado separadamente; assim, se não houver valores usando mais de 256 bytes em uma determinada coluna de um desses tipos, nenhuma parte de coluna `BLOB` é criada pelo `NDB` para essa coluna. Consulte [Seção 11.7, “Requisitos de Armazenamento de Tipos de Dados”](storage-requirements.html "11.7 Data Type Storage Requirements"), para mais informações.