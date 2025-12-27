### 25.5.2 ndbinfo_select_all — Selecionar de tabelas ndbinfo

**ndbinfo_select_all** é um programa cliente que seleciona todas as linhas e colunas de uma ou mais tabelas no banco de dados `ndbinfo`

Nem todas as tabelas `ndbinfo` disponíveis no cliente **mysql** podem ser lidas por este programa (veja mais adiante nesta seção). Além disso, **ndbinfo_select_all** pode exibir informações sobre algumas tabelas internas do `ndbinfo` que não podem ser acessadas usando SQL, incluindo as tabelas de metadados `tables` e `columns`.

Para selecionar de uma ou mais tabelas `ndbinfo` usando **ndbinfo_select_all**, é necessário fornecer os nomes das tabelas ao invocar o programa, conforme mostrado aqui:

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

As opções que podem ser usadas com **ndbinfo_select_all** estão mostradas na tabela a seguir. Descrições adicionais seguem a tabela.

* `--character-sets-dir`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--character-sets-dir=caminho</code></td> </tr></tbody></table>

  Diretório contendo conjuntos de caracteres.

* `--core-file`

  <table frame="box" rules="all" summary="Propriedades para core-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--core-file</code></td> </tr></tbody></table>

  Escrever arquivo de núcleo em caso de erro; usado em depuração.

* `--connect-retries`

<table frame="box" rules="all" summary="Propriedades para connect-retries">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code class="literal">--connect-retries=#</code></td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Inteiro</td>
  </tr>
  <tr>
    <th>Valor padrão</th>
    <td><code class="literal">12</code></td>
  </tr>
  <tr>
    <th>Valor mínimo</th>
    <td><code class="literal">0</code></td>
  </tr>
  <tr>
    <th>Valor máximo</th>
    <td><code class="literal">12</code></td>
  </tr>
</table>

  Número de vezes para tentar a conexão novamente antes de desistir.

* `--connect-retry-delay`

  <table frame="box" rules="all" summary="Propriedades para connect-retry-delay">
    <tr>
      <th>Formato de linha de comando</th>
      <td><code class="literal">--connect-retry-delay=#</code></td>
    </tr>
    <tr>
      <th>Tipo</th>
      <td>Inteiro</td>
    </tr>
    <tr>
      <th>Valor padrão</th>
      <td><code class="literal">5</code></td>
    </tr>
    <tr>
      <th>Valor mínimo</th>
      <td><code class="literal">0</code></td>
    </tr>
    <tr>
      <th>Valor máximo</th>
      <td><code class="literal">5</code></td>
    </tr>
  </table>

  Número de segundos para esperar entre as tentativas de contato com o servidor de gerenciamento.

* `--connect-string`

  <table frame="box" rules="all" summary="Propriedades para connect-string">
    <tr>
      <th>Formato de linha de comando</th>
      <td><code class="literal">--connect-string=connection-string</code></td>
    </tr>
    <tr>
      <th>Tipo</th>
      <td>String</td>
    </tr>
    <tr>
      <th>Valor padrão</th>
      <td><code class="literal">[none]</code></td>
    </tr>
  </table>

  O mesmo que `--ndb-connectstring`.

* `--defaults-extra-file`

Leia o arquivo fornecido após a leitura dos arquivos globais.

* `--defaults-file`

  <table frame="box" rules="all" summary="Propriedades para defaults-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--defaults-file=caminho</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">[nenhum]</code></td> </tr></tbody></table>

  Leia as opções padrão do arquivo fornecido.

* `--defaults-grupo-sufixo`

  <table frame="box" rules="all" summary="Propriedades para defaults-grupo-sufixo"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--defaults-grupo-sufixo=string</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">[nenhum]</code></td> </tr></tbody></table>

  Leia também os grupos com concatenação (grupo, sufixo).

* `--delay=segundos`

<table frame="box" rules="all" summary="Propriedades para atraso">
  <tr><th>Formato de Linha de Comando</th> <td><code class="literal">--delay=#</code></td> </tr>
  <tr><th>Tipo</th> <td>Numérico</td> </tr>
  <tr><th>Valor Padrão</th> <td><code class="literal">5</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code class="literal">0</code></td> </tr>
  <tr><th>Valor Máximo</th> <td><code class="literal">MAX_INT</code></td> </tr>
  </tr>
</table>

Esta opção define o número de segundos para esperar entre a execução de loops. Não tem efeito se `--loops` for definido como 0 ou 1.

* `--help`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><col style="width: 30%"/><col style="width: 70%"/><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--help</code></td> </tr></table>

  Exibe texto de ajuda e sai.

* `--login-path`

  <table frame="box" rules="all" summary="Propriedades para arquivo de núcleo"><col style="width: 30%"/><col style="width: 70%"/><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--core-file</code></td> </tr></table>0

  Leia o caminho dado a partir do arquivo de login.

* `--no-login-paths`

  <table frame="box" rules="all" summary="Propriedades para arquivo de núcleo"><col style="width: 30%"/><col style="width: 70%"/><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--core-file</code></td> </tr></table>1

  Ignora a leitura de opções a partir do arquivo de caminho de login.

* `--loops=número`, `-l número`

  <table frame="box" rules="all" summary="Propriedades para arquivo de núcleo"><col style="width: 30%"/><col style="width: 70%"/><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--core-file</code></td> </tr></table>2

Esta opção define o número de vezes que o comando será executado. Use `--delay` para definir o tempo entre os loops.

* `--ndb-connectstring`

  <table frame="box" rules="all" summary="Propriedades para core-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--core-file</code></td> </tr></tbody></table>3

  Defina a string de conexão para se conectar ao **ndb\_mgmd**. Sintaxe: `[nodeid=id;][host=]hostname[:port]`. Sobrime entradas no `NDB_CONNECTSTRING` e `my.cnf`.

* `--ndb-mgmd-host`

  <table frame="box" rules="all" summary="Propriedades para core-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--core-file</code></td> </tr></tbody></table>4

  O mesmo que `--ndb-connectstring`.

* `--ndb-nodeid`

  <table frame="box" rules="all" summary="Propriedades para core-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--core-file</code></td> </tr></tbody></table>5

  Defina o ID do nó para este nó, sobrescrevendo qualquer ID definido por `--ndb-connectstring`.

* `--ndb-optimized-node-selection`

  <table frame="box" rules="all" summary="Propriedades para core-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--core-file</code></td> </tr></tbody></table>6

  Ative otimizações para a seleção de nós para transações. Ativado por padrão; use `--skip-ndb-optimized-node-selection` para desativá-lo.

* `--no-defaults`

  <table frame="box" rules="all" summary="Propriedades para core-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--core-file</code></td> </tr></tbody></table>7

Não leia as opções padrão de nenhum arquivo de opção, exceto o arquivo de login.

* `--print-defaults`

  <table frame="box" rules="all" summary="Propriedades para o arquivo de código-fonte"><tr><th>Formato de linha de comando</th> <td><code class="literal">--core-file</code></td> </tr></table>8

  Imprima a lista de argumentos do programa e saia.

* `--usage`

  <table frame="box" rules="all" summary="Propriedades para o arquivo de tentativas de conexão"><tr><th>Formato de linha de comando</th> <td><code class="literal">--core-file</code></td> </tr></table>9

  Exiba o texto de ajuda e saia; o mesmo que `--help`.

* `--version`

  <table frame="box" rules="all" summary="Propriedades para tentativas de conexão"><tr><th>Formato de linha de comando</th> <td><code class="literal">--connect-retries=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">12</code></td> </tr><tr><th>Valor mínimo</th> <td><code class="literal">0</code></td> </tr><tr><th>Valor máximo</th> <td><code class="literal">12</code></td> </tr></table>0

  Exiba as informações da versão e saia.

**ndbinfo\_select\_all** não consegue ler as seguintes tabelas:

* `arbitrator_validity_detail`
* `arbitrator_validity_summary`
* `cluster_locks`
* `cluster_operations`
* `cluster_transactions`
* `disk_write_speed_aggregate_node`
* `locks_per_fragment`
* `memory_per_fragment`
* `memoryusage`
* `operations_per_fragment`
* `server_locks`
* `server_operations`
* `server_transactions`
* `table_info`