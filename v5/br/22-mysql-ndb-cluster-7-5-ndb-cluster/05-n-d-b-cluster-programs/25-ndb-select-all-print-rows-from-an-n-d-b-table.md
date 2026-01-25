### 21.5.25 ndb_select_all — Imprimir Linhas de uma Tabela NDB

[**ndb_select_all**](mysql-cluster-programs-ndb-select-all.html "21.5.25 ndb_select_all — Print Rows from an NDB Table") imprime todas as linhas de uma tabela [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") para o `stdout`.

#### Uso

```sql
ndb_select_all -c connection_string tbl_name -d db_name [> file_name]
```

As opções que podem ser usadas com [**ndb_select_all**](mysql-cluster-programs-ndb-select-all.html "21.5.25 ndb_select_all — Print Rows from an NDB Table") são mostradas na tabela a seguir. Descrições adicionais seguem a tabela.

**Tabela 21.41 Opções de linha de comando usadas com o programa ndb_select_all**

| Formato | Descrição | Adicionado, Obsoleto ou Removido |
|---|---|---|
| ` --character-sets-dir=path ` | Diretório contendo conjuntos de caracteres (character sets) | (Suportado em todas as versões NDB baseadas no MySQL 5.7) |
| ` --connect-retries=# ` | Número de vezes para tentar novamente a conexão antes de desistir | (Suportado em todas as versões NDB baseadas no MySQL 5.7) |
| ` --connect-retry-delay=# ` | Número de segundos a esperar entre as tentativas de contato com o servidor de gerenciamento | (Suportado em todas as versões NDB baseadas no MySQL 5.7) |
| `--connect-string=connection_string`, ` -c connection_string ` | O mesmo que --ndb-connectstring | (Suportado em todas as versões NDB baseadas no MySQL 5.7) |
| ` --core-file ` | Escreve core file em caso de erro; usado em depuração (debugging) | (Suportado em todas as versões NDB baseadas no MySQL 5.7) |
| `--database=name`, ` -d name ` | Nome do Database onde a tabela é encontrada | (Suportado em todas as versões NDB baseadas no MySQL 5.7) |
| ` --defaults-extra-file=path ` | Lê o arquivo fornecido após a leitura dos arquivos globais | (Suportado em todas as versões NDB baseadas no MySQL 5.7) |
| ` --defaults-file=path ` | Lê as opções padrão (default) apenas do arquivo fornecido | (Suportado em todas as versões NDB baseadas no MySQL 5.7) |
| ` --defaults-group-suffix=string ` | Também lê grupos com concat(group, suffix) | (Suportado em todas as versões NDB baseadas no MySQL 5.7) |
| `--delimiter=char`, ` -D char ` | Define o delimitador de coluna (column delimiter) | (Suportado em todas as versões NDB baseadas no MySQL 5.7) |
| `--descending`, ` -z ` | Ordena o conjunto de resultados (resultset) em ordem decrescente (requer --order) | (Suportado em todas as versões NDB baseadas no MySQL 5.7) |
| ` --disk ` | Imprime referências de disco (útil apenas para tabelas Disk Data que possuem colunas sem Index) | (Suportado em todas as versões NDB baseadas no MySQL 5.7) |
| ` --gci ` | Inclui GCI na saída (output) | (Suportado em todas as versões NDB baseadas no MySQL 5.7) |
| ` --gci64 ` | Inclui GCI e row epoch na saída (output) | (Suportado em todas as versões NDB baseadas no MySQL 5.7) |
| `--header[=value]`, ` -h ` | Imprime o cabeçalho (setar para 0|FALSE para desabilitar cabeçalhos na saída) | (Suportado em todas as versões NDB baseadas no MySQL 5.7) |
| `--lock=#`, ` <a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_lock">-l #</a> ` | Tipo de Lock | (Suportado em todas as versões NDB baseadas no MySQL 5.7) |
| ` --login-path=path ` | Lê o caminho fornecido a partir do login file | (Suportado em todas as versões NDB baseadas no MySQL 5.7) |
| `--help`, ` -? ` | Exibe o texto de ajuda (help) e sai | (Suportado em todas as versões NDB baseadas no MySQL 5.7) |
| `--ndb-connectstring=connection_string`, ` -c connection_string ` | Define a connect string para conexão com ndb_mgmd. Sintaxe: "[nodeid=id;][host=]hostname[:port]". Sobrescreve entradas em NDB_CONNECTSTRING e my.cnf | (Suportado em todas as versões NDB baseadas no MySQL 5.7) |
| `--ndb-mgmd-host=connection_string`, ` -c connection_string ` | O mesmo que --ndb-connectstring | (Suportado em todas as versões NDB baseadas no MySQL 5.7) |
| ` --ndb-nodeid=# ` | Define o ID do node para este node, sobrescrevendo qualquer ID definido por --ndb-connectstring | (Suportado em todas as versões NDB baseadas no MySQL 5.7) |
| ` --ndb-optimized-node-selection ` | Habilita otimizações para seleção de nodes para transações. Habilitado por padrão (default); use --skip-ndb-optimized-node-selection para desabilitar | (Suportado em todas as versões NDB baseadas no MySQL 5.7) |
| ` --no-defaults ` | Não lê opções padrão (default) de nenhum arquivo de opções, exceto o login file | (Suportado em todas as versões NDB baseadas no MySQL 5.7) |
| ` --nodata ` | Não imprime os dados da coluna da tabela | (Suportado em todas as versões NDB baseadas no MySQL 5.7) |
| `--order=index`, ` -o index ` | Ordena o conjunto de resultados (resultset) de acordo com o Index que tem este nome | (Suportado em todas as versões NDB baseadas no MySQL 5.7) |
| `--parallelism=#`, ` <a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_parallelism">-p #</a> ` | Grau de paralelismo (Degree of parallelism) | (Suportado em todas as versões NDB baseadas no MySQL 5.7) |
| ` --print-defaults ` | Imprime a lista de argumentos do programa e sai | (Suportado em todas as versões NDB baseadas no MySQL 5.7) |
| ` --rowid ` | Imprime o row ID | (Suportado em todas as versões NDB baseadas no MySQL 5.7) |
| `--tupscan`, ` -t ` | Scan (escaneia) na ordem tup | (Suportado em todas as versões NDB baseadas no MySQL 5.7) |
| `--usage`, ` -? ` | Exibe o texto de ajuda (help) e sai; o mesmo que --help | (Suportado em todas as versões NDB baseadas no MySQL 5.7) |
| `--useHexFormat`, ` -x ` | Gera a saída (output) de números em formato hexadecimal | (Suportado em todas as versões NDB baseadas no MySQL 5.7) |
| `--version`, ` -V ` | Exibe informações da versão e sai | (Suportado em todas as versões NDB baseadas no MySQL 5.7) |

* `--character-sets-dir`

  | Formato de Linha de Comando | ` --character-sets-dir=path ` |
  |---|---|
  Diretório contendo conjuntos de caracteres (character sets).

* `--connect-retries`

  | Formato de Linha de Comando | ` --connect-retries=# ` |
  | Tipo | Integer |
  | Valor Padrão (Default Value) | `12` |
  | Valor Mínimo | `0` |
  | Valor Máximo | `12` |
  Número de vezes para tentar novamente a conexão antes de desistir.

* `--connect-retry-delay`

  | Formato de Linha de Comando | ` --connect-retry-delay=# ` |
  | Tipo | Integer |
  | Valor Padrão (Default Value) | `5` |
  | Valor Mínimo | `0` |
  | Valor Máximo | `5` |
  Número de segundos a esperar entre as tentativas de contato com o servidor de gerenciamento.

* `--connect-string`

  | Formato de Linha de Comando | ` --connect-string=connection_string ` |
  | Tipo | String |
  | Valor Padrão (Default Value) | `[none]` |
  O mesmo que [`--ndb-connectstring`](mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_ndb-connectstring).

* `--core-file`

  | Formato de Linha de Comando | ` --core-file ` |
  |---|---|
  Escreve um core file em caso de erro; usado em depuração (debugging).

* `--database=dbname`, `-d` *`dbname`*

  Nome do Database no qual a tabela é encontrada. O valor padrão (default) é `TEST_DB`.

* `--descending`, `-z`

  Ordena a saída (output) em ordem decrescente. Esta opção só pode ser usada em conjunto com a opção `-o` ([`--order`](mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_order)).

* `--defaults-extra-file`

  | Formato de Linha de Comando | ` --defaults-extra-file=path ` |
  | Tipo | String |
  | Valor Padrão (Default Value) | `[none]` |
  Lê o arquivo fornecido após a leitura dos arquivos globais.

* `--defaults-file`

  | Formato de Linha de Comando | ` --defaults-file=path ` |
  | Tipo | String |
  | Valor Padrão (Default Value) | `[none]` |
  Lê as opções padrão (default options) apenas do arquivo fornecido.

* `--defaults-group-suffix`

  | Formato de Linha de Comando | ` --defaults-group-suffix=string ` |
  | Tipo | String |
  | Valor Padrão (Default Value) | `[none]` |
  Também lê grupos com concat(group, suffix).

* `--delimiter=character`, `-D character`

  Faz com que o *`character`* seja usado como delimitador de coluna (column delimiter). Apenas as colunas de dados da tabela são separadas por este delimitador.

  O delimitador padrão (default) é o caractere de tabulação.

* `--disk`

  Adiciona uma coluna de referência de disco à saída (output). A coluna só estará preenchida (nonempty) para tabelas Disk Data que possuam colunas não indexadas.

* `--gci`

  Adiciona uma coluna `GCI` à saída (output) mostrando o ponto de verificação global (global checkpoint) no qual cada linha foi atualizada pela última vez. Consulte [Section 21.2, “NDB Cluster Overview”](mysql-cluster-overview.html "21.2 NDB Cluster Overview"), e [Section 21.6.3.2, “NDB Cluster Log Events”](mysql-cluster-log-events.html "21.6.3.2 NDB Cluster Log Events"), para mais informações sobre pontos de verificação (checkpoints).

* `--gci64`

  Adiciona uma coluna `ROW$GCI64` à saída (output) mostrando o ponto de verificação global (global checkpoint) no qual cada linha foi atualizada pela última vez, bem como o número da epoch na qual esta atualização ocorreu.

* `--help`

  | Formato de Linha de Comando | ` --help ` |
  |---|---|
  Exibe o texto de ajuda (help) e sai.

* `--lock=lock_type`, `-l lock_type`

  Emprega um Lock ao ler a tabela. Os valores possíveis para *`lock_type`* são:

  + `0`: Read Lock
  + `1`: Read Lock with hold
  + `2`: Exclusive read Lock

  Não há valor padrão (default) para esta opção.

* `--login-path`

  | Formato de Linha de Comando | ` --character-sets-dir=path ` |
  |---|---|
  Lê o caminho fornecido a partir do login file.

* `--header=FALSE`

  Exclui cabeçalhos de coluna da saída (output).

* `--nodata`

  Faz com que quaisquer dados da tabela sejam omitidos.

* `--ndb-connectstring`

  | Formato de Linha de Comando | ` --character-sets-dir=path ` |
  |---|---|
  Define a connect string para conexão com ndb_mgmd. Sintaxe: "[nodeid=id;][host=]hostname[:port]". Sobrescreve entradas em NDB_CONNECTSTRING e my.cnf.

* `--ndb-mgmd-host`

  | Formato de Linha de Comando | ` --character-sets-dir=path ` |
  |---|---|
  O mesmo que [`--ndb-connectstring`](mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_ndb-connectstring).

* `--ndb-nodeid`

  | Formato de Linha de Comando | ` --character-sets-dir=path ` |
  |---|---|
  Define o ID do node para este node, sobrescrevendo qualquer ID definido por [`--ndb-connectstring`](mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_ndb-connectstring).

* `--ndb-optimized-node-selection`

  | Formato de Linha de Comando | ` --character-sets-dir=path ` |
  |---|---|
  Habilita otimizações para a seleção de nodes para transações. Habilitado por padrão (default); use `--skip-ndb-optimized-node-selection` para desabilitar.

* `--no-defaults`

  | Formato de Linha de Comando | ` --character-sets-dir=path ` |
  |---|---|
  Não lê opções padrão (default options) de nenhum arquivo de opções, exceto o login file.

* `--order=index_name`, `-o index_name`

  Ordena a saída (output) de acordo com o Index nomeado *`index_name`*.

  Note

  Este é o nome de um Index, não de uma coluna; o Index deve ter sido nomeado explicitamente quando criado.

* `parallelism=#`, `-p` *`#`*

  Especifica o grau de paralelismo (degree of parallelism).

* `--print-defaults`

  | Formato de Linha de Comando | ` --character-sets-dir=path ` |
  |---|---|
  Imprime a lista de argumentos do programa e sai.

* `--rowid`

  Adiciona uma coluna `ROWID` fornecendo informações sobre os fragmentos nos quais as linhas são armazenadas.

* `--tupscan`, `-t`

  Faz o Scan da tabela na ordem dos tuples.

* `--usage`

  | Formato de Linha de Comando | ` --character-sets-dir=path ` |
  |---|---|
  Exibe o texto de ajuda (help) e sai; o mesmo que [`--help`](mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_help).

* `--useHexFormat` `-x`

  Faz com que todos os valores numéricos sejam exibidos em formato hexadecimal. Isso não afeta a saída (output) de numerais contidos em strings ou valores datetime.

* `--version`

  | Formato de Linha de Comando | ` --character-sets-dir=path ` |
  |---|---|
  Exibe informações da versão e sai.

#### Exemplo de Saída (Sample Output)

Saída (Output) de uma instrução MySQL [`SELECT`](select.html "13.2.9 SELECT Statement"):

```sql
mysql> SELECT * FROM ctest1.fish;
+----+-----------+
| id | name      |
+----+-----------+
|  3 | shark     |
|  6 | puffer    |
|  2 | tuna      |
|  4 | manta ray |
|  5 | grouper   |
|  1 | guppy     |
+----+-----------+
6 rows in set (0.04 sec)
```

Saída (Output) da invocação equivalente de [**ndb_select_all**](mysql-cluster-programs-ndb-select-all.html "21.5.25 ndb_select_all — Print Rows from an NDB Table"):

```sql
$> ./ndb_select_all -c localhost fish -d ctest1
id      name
3       [shark]
6       [puffer]
2       [tuna]
4       [manta ray]
5       [grouper]
1       [guppy]
6 rows returned

NDBT_ProgramExit: 0 - OK
```

Todos os valores de string são delimitados por colchetes (`[`...`]`) na saída de [**ndb_select_all**](mysql-cluster-programs-ndb-select-all.html "21.5.25 ndb_select_all — Print Rows from an NDB Table"). Para outro exemplo, considere a tabela criada e preenchida conforme mostrado aqui:

```sql
CREATE TABLE dogs (
    id INT(11) NOT NULL AUTO_INCREMENT,
    name VARCHAR(25) NOT NULL,
    breed VARCHAR(50) NOT NULL,
    PRIMARY KEY pk (id),
    KEY ix (name)
)
TABLESPACE ts STORAGE DISK
ENGINE=NDBCLUSTER;

INSERT INTO dogs VALUES
    ('', 'Lassie', 'collie'),
    ('', 'Scooby-Doo', 'Great Dane'),
    ('', 'Rin-Tin-Tin', 'Alsatian'),
    ('', 'Rosscoe', 'Mutt');
```

Isso demonstra o uso de várias opções adicionais do [**ndb_select_all**](mysql-cluster-programs-ndb-select-all.html "21.5.25 ndb_select_all — Print Rows from an NDB Table"):

```sql
$> ./ndb_select_all -d ctest1 dogs -o ix -z --gci --disk
GCI     id name          breed        DISK_REF
834461  2  [Scooby-Doo]  [Great Dane] [ m_file_no: 0 m_page: 98 m_page_idx: 0 ]
834878  4  [Rosscoe]     [Mutt]       [ m_file_no: 0 m_page: 98 m_page_idx: 16 ]
834463  3  [Rin-Tin-Tin] [Alsatian]   [ m_file_no: 0 m_page: 34 m_page_idx: 0 ]
835657  1  [Lassie]      [Collie]     [ m_file_no: 0 m_page: 66 m_page_idx: 0 ]
4 rows returned

NDBT_ProgramExit: 0 - OK
```