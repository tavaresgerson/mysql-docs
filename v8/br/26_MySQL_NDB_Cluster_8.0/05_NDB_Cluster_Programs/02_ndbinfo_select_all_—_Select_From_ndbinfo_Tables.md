### 25.5.2 ndbinfo\_select\_all — Selecionar de tabelas ndbinfo

O **ndbinfo\_select\_all** é um programa cliente que seleciona todas as linhas e colunas de uma ou mais tabelas no banco de dados `ndbinfo`

Nem todas as tabelas `ndbinfo` disponíveis no cliente **mysql** podem ser lidas por este programa (consulte mais tarde nesta seção). Além disso, **ndbinfo\_select\_all** pode exibir informações sobre algumas tabelas internas de `ndbinfo` que não podem ser acessadas usando SQL, incluindo as tabelas de metadados `tables` e `columns`.

Para selecionar uma ou mais tabelas `ndbinfo` usando **ndbinfo\_select\_all**, é necessário fornecer os nomes das tabelas ao invocar o programa, conforme mostrado aqui:

```
$> ndbinfo_select_all table_name1  [table_name2] [...]
```

Por exemplo:

```
$> ndbinfo_select_all logbuffers logspaces
== logbuffers ==
node_id log_type        log_id  log_part        total   used    high
5       0       0       0       33554432        262144  0
6       0       0       0       33554432        262144  0
7       0       0       0       33554432        262144  0
8       0       0       0       33554432        262144  0
== logspaces ==
node_id log_type        log_id  log_part        total   used    high
5       0       0       0       268435456       0       0
5       0       0       1       268435456       0       0
5       0       0       2       268435456       0       0
5       0       0       3       268435456       0       0
6       0       0       0       268435456       0       0
6       0       0       1       268435456       0       0
6       0       0       2       268435456       0       0
6       0       0       3       268435456       0       0
7       0       0       0       268435456       0       0
7       0       0       1       268435456       0       0
7       0       0       2       268435456       0       0
7       0       0       3       268435456       0       0
8       0       0       0       268435456       0       0
8       0       0       1       268435456       0       0
8       0       0       2       268435456       0       0
8       0       0       3       268435456       0       0
$>
```

As opções que podem ser usadas com **ndbinfo\_select\_all** estão mostradas na tabela a seguir. Descrições adicionais seguem a tabela.

**Tabela 25.25 Opções de linha de comando usadas com o programa ndbinfo\_select\_all**

<table frame="box" rules="all"><thead><tr> <th scope="col">Formato</th> <th scope="col">Descrição</th> <th scope="col">Adicionado, Descontinuado ou Removido</th> </tr></thead><tbody><tr> <th><p> [[PH_HTML_CODE_<code> --defaults-group-suffix=string </code>] </p></th> <td>Diretório contendo conjuntos de caracteres</td> <td><p>REMOvido: 8.0.31</p></td> </tr></tbody><tbody><tr> <th><p> [[PH_HTML_CODE_<code> --defaults-group-suffix=string </code>] </p></th> <td>Número de vezes para tentar a conexão novamente antes de desistir</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[PH_HTML_CODE_<code>--help</code>] </p></th> <td>Número de segundos para esperar entre as tentativas de contato com o servidor de gerenciamento</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p>[[PH_HTML_CODE_<code> -? </code>],</p><p> [[PH_HTML_CODE_<code> --login-path=path </code>] </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[PH_HTML_CODE_<code>--loops=#</code>] </p></th> <td>Escreva o arquivo de núcleo em erro; usado no depuração</td> <td><p>REMOvido: 8.0.31</p></td> </tr></tbody><tbody><tr> <th><p>[[PH_HTML_CODE_<code> -l </code>],</p><p> [[PH_HTML_CODE_<code>--ndb-connectstring=connection-string</code>] </p></th> <td>Nome do banco de dados onde a tabela está localizada</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[PH_HTML_CODE_<code> -c </code>] </p></th> <td>Leia o arquivo fornecido após os arquivos globais terem sido lidos</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[PH_HTML_CODE_<code>--ndb-mgmd-host=connection-string</code>] </p></th> <td>Ler opções padrão a partir do arquivo fornecido apenas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --defaults-group-suffix=string </code>]] </p></th> <td>Leia também grupos com concatenação(grupo, sufixo)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --connect-retries=# </code><code> --defaults-group-suffix=string </code>] </p></th> <td>Defina o atraso em segundos entre os loops</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code>--help</code>]],</p><p> [[<code> -? </code>]] </p></th> <td>Exibir texto de ajuda e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --login-path=path </code>]] </p></th> <td>Leia o caminho fornecido a partir do arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code>--loops=#</code>]],</p><p> [[<code> -l </code>]] </p></th> <td>Defina o número de vezes para executar a seleção</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code>--ndb-connectstring=connection-string</code>]],</p><p> [[<code> -c </code>]] </p></th> <td>Defina a string de conexão para se conectar ao ndb_mgmd. Sintaxe: "[nodeid=id;][host=]hostname[:por<code> --defaults-group-suffix=string </code>". Substitui as entradas no NDB_CONNECTSTRING e no my.cnf</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code>--ndb-mgmd-host=connection-string</code>]],</p><p> [[<code> --connect-retry-delay=# </code><code> --defaults-group-suffix=string </code>] </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --connect-retry-delay=# </code><code> --defaults-group-suffix=string </code>] </p></th> <td>Defina o ID do nó para este nó, substituindo qualquer ID definida pela opção --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --connect-retry-delay=# </code><code>--help</code>] </p></th> <td>Não leia as opções padrão de nenhum arquivo de opção, exceto o arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --connect-retry-delay=# </code><code> -? </code>] </p></th> <td>Ative as otimizações para a seleção de nós para transações. Ativado por padrão; use --skip-ndb-optimized-node-selection para desativá-lo</td> <td><p>REMOvido: 8.0.31</p></td> </tr></tbody><tbody><tr> <th><p>[[<code> --connect-retry-delay=# </code><code> --login-path=path </code>],</p><p> [[<code> --connect-retry-delay=# </code><code>--loops=#</code>] </p></th> <td>Definir o grau de paralelismo</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --connect-retry-delay=# </code><code> -l </code>] </p></th> <td>Imprimir a lista de argumentos do programa e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code> --connect-retry-delay=# </code><code>--ndb-connectstring=connection-string</code>],</p><p> [[<code> --connect-retry-delay=# </code><code> -c </code>] </p></th> <td>Exibir texto de ajuda e sair; o mesmo que --help</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code> --connect-retry-delay=# </code><code>--ndb-mgmd-host=connection-string</code>],</p><p> [[<code>--connect-string=connection-string</code><code> --defaults-group-suffix=string </code>] </p></th> <td>Exibir informações da versão e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody></table>

- `--character-sets-dir`

  <table summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr><tr><th>Removido</th> <td>8.0.31</td> </tr></tbody></table>

  Diretório contendo conjuntos de caracteres.

- `--core-file`

  <table summary="Propriedades para arquivo de núcleo"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--core-file</code>]]</td> </tr><tr><th>Removido</th> <td>8.0.31</td> </tr></tbody></table>

  Escreva o arquivo de núcleo em erro; usado no depuração.

- `--connect-retries`

  <table summary="Propriedades para tentativas de conexão de reposição"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--connect-retries=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>12</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>12</code>]]</td> </tr></tbody></table>

  Número de vezes para tentar a conexão novamente antes de desistir.

- `--connect-retry-delay`

  <table summary="Propriedades para connect-retry-delay"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--connect-retry-delay=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>5</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>5</code>]]</td> </tr></tbody></table>

  Número de segundos para esperar entre as tentativas de contato com o servidor de gerenciamento.

- `--connect-string`

  <table summary="Propriedades para a string de conexão"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--connect-string=connection-string</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>

  O mesmo que `--ndb-connectstring`.

- `--defaults-extra-file`

  <table summary="Propriedades para defaults-extra-file"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--defaults-extra-file=path</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>

  Leia o arquivo fornecido após a leitura dos arquivos globais.

- `--defaults-file`

  <table summary="Propriedades para arquivo de falhas"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--defaults-file=path</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>

  Leia as opções padrão do arquivo fornecido.

- `--defaults-group-suffix`

  <table summary="Propriedades para defaults-group-suffix"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--defaults-group-suffix=string</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>

  Leia também grupos com concatenação (grupo, sufixo).

- `--delay=seconds`

  <table summary="Propriedades para atraso"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--delay=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td>[[<code>5</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>MAX_INT</code>]]</td> </tr></tbody></table>

  Esta opção define o número de segundos para esperar entre a execução de loops. Não tem efeito se `--loops` for definido como 0 ou 1.

- `--help`

  <table summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr><tr><th>Removido</th> <td>8.0.31</td> </tr></tbody></table>0

  Exibir texto de ajuda e sair.

- `--login-path`

  <table summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr><tr><th>Removido</th> <td>8.0.31</td> </tr></tbody></table>1

  Leia o caminho fornecido a partir do arquivo de login.

- `--loops=number`, `-l number`

  <table summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr><tr><th>Removido</th> <td>8.0.31</td> </tr></tbody></table>2

  Esta opção define o número de vezes que o select será executado. Use `--delay` para definir o tempo entre os loops.

- `--ndb-connectstring`

  <table summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr><tr><th>Removido</th> <td>8.0.31</td> </tr></tbody></table>3

  Defina a string de conexão para se conectar ao ndb\_mgmd. Sintaxe: "\[nodeid=id;]\[host=]hostname\[:port]". Oculte entradas no NDB\_CONNECTSTRING e no my.cnf.

- `--ndb-mgmd-host`

  <table summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr><tr><th>Removido</th> <td>8.0.31</td> </tr></tbody></table>4

  O mesmo que `--ndb-connectstring`.

- `--ndb-nodeid`

  <table summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr><tr><th>Removido</th> <td>8.0.31</td> </tr></tbody></table>5

  Defina o ID do nó para este nó, substituindo qualquer ID definida pela opção --ndb-connectstring.

- `--ndb-optimized-node-selection`

  <table summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr><tr><th>Removido</th> <td>8.0.31</td> </tr></tbody></table>6

  Ative as otimizações para a seleção de nós para transações. Ativado por padrão; use `--skip-ndb-optimized-node-selection` para desativá-lo.

- `--no-defaults`

  <table summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr><tr><th>Removido</th> <td>8.0.31</td> </tr></tbody></table>7

  Não leia as opções padrão de nenhum arquivo de opção, exceto o arquivo de login.

- `--print-defaults`

  <table summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr><tr><th>Removido</th> <td>8.0.31</td> </tr></tbody></table>8

  Imprima a lista de argumentos do programa e saia.

- `--usage`

  <table summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr><tr><th>Removido</th> <td>8.0.31</td> </tr></tbody></table>9

  Exibir texto de ajuda e sair; o mesmo que --help.

- `--version`

  <table summary="Propriedades para arquivo de núcleo"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--core-file</code>]]</td> </tr><tr><th>Removido</th> <td>8.0.31</td> </tr></tbody></table>0

  Exibir informações da versão e sair.

**ndbinfo\_select\_all** não consegue ler as seguintes tabelas:

- `arbitrator_validity_detail`
- `arbitrator_validity_summary`
- `cluster_locks`
- `cluster_operations`
- `cluster_transactions`
- `disk_write_speed_aggregate_node`
- `locks_per_fragment`
- `memory_per_fragment`
- `memoryusage`
- `operations_per_fragment`
- `server_locks`
- `server_operations`
- `server_transactions`
- `table_info`
