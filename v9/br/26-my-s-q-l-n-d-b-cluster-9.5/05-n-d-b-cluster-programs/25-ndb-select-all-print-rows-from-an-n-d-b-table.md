### 25.5.25 ndb\_select\_all — Imprimir Linhas de uma Tabela NDB

**ndb\_select\_all** imprime todas as linhas de uma tabela `NDB` no `stdout`.

#### Uso

```
ndb_select_all -c connection_string tbl_name -d db_name [> file_name]
```

As opções que podem ser usadas com **ndb\_select\_all** estão mostradas na tabela a seguir. Descrições adicionais seguem a tabela.

* `--character-sets-dir`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--character-sets-dir=caminho</code></td> </tr></tbody></table>

  Diretório que contém conjuntos de caracteres.

* `--connect-retries`

  <table frame="box" rules="all" summary="Propriedades para connect-retries"><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--connect-retries=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal">12</code></td> </tr><tr><th>Valor Mínima</th> <td><code class="literal">0</code></td> </tr><tr><th>Valor Máximo</th> <td><code class="literal">12</code></td> </tr></tbody></table>

  Número de vezes para tentar a conexão novamente antes de desistir.

* `--connect-retry-delay`

  <table frame="box" rules="all" summary="Propriedades para connect-retry-delay"><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--connect-retry-delay=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal">5</code></td> </tr><tr><th>Valor Mínima</th> <td><code class="literal">0</code></td> </tr><tr><th>Valor Máximo</th> <td><code class="literal">5</code></td> </tr></tbody></table>

Número de segundos para esperar entre as tentativas de contato com o servidor de gerenciamento.

* `--connect-string`

  <table frame="box" rules="all" summary="Propriedades para connect-string"><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--connect-string=connection_string</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">[none]</code></td> </tr></tbody></table>

  O mesmo que `--ndb-connectstring`.

* `--core-file`

  <table frame="box" rules="all" summary="Propriedades para core-file"><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--core-file</code></td> </tr></tbody></table>

  Escreva o arquivo de código fonte em caso de erro; usado em depuração.

* `--database=dbname`, `-d` *`dbname`*

  Nome do banco de dados em que a tabela está localizada. O valor padrão é `TEST_DB`.

* `--descending`, `-z`

  Ordena a saída em ordem decrescente. Esta opção só pode ser usada em conjunto com a opção `-o` (`--order`).

* `--defaults-extra-file`

  <table frame="box" rules="all" summary="Propriedades para defaults-extra-file"><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--defaults-extra-file=path</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">[none]</code></td> </tr></tbody></table>

  Leia o arquivo fornecido após a leitura dos arquivos globais.

* `--defaults-file`

Leia opções padrão apenas a partir do arquivo especificado.

* `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Propriedades para defaults-group-suffix"><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--defaults-group-suffix=string</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">[none]</code></td> </tr></tbody></table>

  Leia também grupos com concatenação (grupo, sufixo).

* `--delimiter=character`, `-D character`

  Faz com que o *`character`* seja usado como delimitador de coluna. Apenas as colunas de dados de tabela são separadas por este delimitador.

  O delimitador padrão é o caractere tabulação.

* `--disk`

  Adiciona uma coluna de referência de disco à saída. A coluna é não-vazia apenas para tabelas de dados de disco que possuem colunas não indexadas.

* `--gci`

  Adiciona uma coluna `GCI` à saída, mostrando o ponto de verificação global em que cada linha foi atualizada pela última vez. Consulte a Seção 25.2, “Visão geral do cluster NDB”, e a Seção 25.6.3.2, “Eventos de log do cluster NDB”, para obter mais informações sobre os pontos de verificação.

* `--gci64`

  Adiciona uma coluna `ROW$GCI64` à saída, mostrando o ponto de verificação global em que cada linha foi atualizada pela última vez, além do número da época em que essa atualização ocorreu.

* `--help`

<table frame="box" rules="all" summary="Propriedades para ajuda">
  <tr><th>Formato de linha de comando</th> <td><code class="literal">--help</code></td> </tr>
</table>

  Exibir texto de ajuda e sair.

* `--lock=lock_type`, `-l lock_type`

  Emprega um bloqueio ao ler a tabela. Os valores possíveis para *`lock_type`* são:

  + `0`: Bloqueio de leitura
  + `1`: Bloqueio de leitura com retenção
  + `2`: Bloqueio de leitura exclusivo

  Não há valor padrão para esta opção.

* `--login-path`

  <table frame="box" rules="all" summary="Propriedades para login-path">
    <tr><th>Formato de linha de comando</th> <td><code class="literal">--login-path=caminho</code></td> </tr>
    <tr><th>Tipo</th> <td>String</td> </tr>
    <tr><th>Valor padrão</th> <td><code class="literal">[nenhum]</code></td> </tr>
  </table>

  Ler o caminho fornecido a partir do arquivo de login.

* `--no-login-paths`

  <table frame="box" rules="all" summary="Propriedades para tentativas de conexão">
    <tr><th>Formato de linha de comando</th> <td><code class="literal">--connect-retries=#</code></td> </tr>
    <tr><th>Tipo</th> <td>Inteiro</td> </tr>
    <tr><th>Valor padrão</th> <td><code class="literal">12</code></td> </tr>
    <tr><th>Valor mínimo</th> <td><code class="literal">0</code></td> </tr>
    <tr><th>Valor máximo</th> <td><code class="literal">12</code></td> </tr>
  </table>0

  Ignorar opções de leitura a partir do arquivo de caminho de login.

* `--header=FALSE`

  Exclui os cabeçalhos das colunas da saída.

* `--nodata`

  Faz com que os dados da tabela sejam omitidos.

* `--ndb-connectstring`

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
1

  Defina a string de conexão para se conectar ao **ndb\_mgmd**. Sintaxe: `[nodeid=id;][host=]hostname[:port]`. Sobrina entradas no `NDB_CONNECTSTRING` e `my.cnf`.

* `--ndb-mgm-tls`

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
2

  Define o nível de suporte TLS necessário para se conectar ao servidor de gerenciamento; um dos `relaxado` ou `estricto`. `relaxado` (o padrão) significa que uma conexão TLS é tentada, mas o sucesso não é necessário; `estricto` significa que o TLS é necessário para se conectar.

* `--ndb-mgmd-host`

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
3

  O mesmo que `--ndb-connectstring`.

* `--ndb-nodeid`

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
4

  Defina o ID do nó para este nó, substituindo qualquer ID definido por `--ndb-connectstring`.

* `--ndb-optimized-node-selection`

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
5

Habilitar otimizações para a seleção de nós para transações. Ativado por padrão; use `--skip-ndb-optimized-node-selection` para desativá-lo.

* `--ndb-tls-search-path`

  <table frame="box" rules="all" summary="Propriedades para retries de conexão"><tr><th>Formato de linha de comando</th> <td><code class="literal">--connect-retries=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">12</code></td> </tr><tr><th>Valor mínimo</th> <td><code class="literal">0</code></td> </tr><tr><th>Valor máximo</th> <td><code class="literal">12</code></td> </tr> </tbody></table>6

  Especificar uma lista de diretórios para procurar um arquivo CA. Em plataformas Unix, os nomes dos diretórios são separados por colchetes (`:`); em sistemas Windows, o caractere ponto e vírgula (`;`) é usado como separador. Uma referência de diretório pode ser relativa ou absoluta; pode conter uma ou mais variáveis de ambiente, cada uma denotada por um sinal de dólar prefixado (`$`), e expandida antes de ser usada.

  A busca começa com o diretório mais à esquerda nomeado e prossegue de esquerda para direita até que um arquivo seja encontrado. Uma string vazia denota um caminho de busca vazio, o que faz com que todas as buscas falhem. Uma string composta por um único ponto (`.`) indica que o caminho de busca é limitado ao diretório de trabalho atual.

  Se não for fornecido um caminho de busca, o valor padrão embutido é usado. Esse valor depende da plataforma usada: em Windows, é `\ndb-tls`; em outras plataformas (incluindo Linux), é `$HOME/ndb-tls`. Isso pode ser substituído compilando o NDB Cluster usando `-DWITH_NDB_TLS_SEARCH_PATH`.

* `--no-defaults`

<table frame="box" rules="all" summary="Propriedades para connect-retries">
  <tr><th>Formato de linha de comando</th> <td><code class="literal">--connect-retries=#</code></td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor padrão</th> <td><code class="literal">12</code></td> </tr>
  <tr><th>Valor mínimo</th> <td><code class="literal">0</code></td> </tr>
  <tr><th>Valor máximo</th> <td><code class="literal">12</code></td> </tr>
</table>8

Não leia opções padrão de nenhum arquivo de opção, exceto o arquivo de login.

* `--order=nome_do_índice`, `-o nome_do_índice`

Ordena a saída de acordo com o índice chamado *`nome_do_índice`*.

Nota

Este é o nome de um índice, não de uma coluna; o índice deve ter sido explicitamente nomeado ao ser criado.

* `parallelism=#`, `-p *` *`#`*

Especifica o grau de paralelismo.

* `--print-defaults`

<table frame="box" rules="all" summary="Propriedades para connect-retries"><tr><th>Formato de linha de comando</th> <td><code class="literal">--connect-retries=#</code></td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor padrão</th> <td><code class="literal">12</code></td> </tr>
  <tr><th>Valor mínimo</th> <td><code class="literal">0</code></td> </tr>
  <tr><th>Valor máximo</th> <td><code class="literal">12</code></td> </tr>
</table>8

Imprime a lista de argumentos do programa e encerra.

* `--rowid`

Adiciona uma coluna `ROWID` que fornece informações sobre os fragmentos nos quais as linhas são armazenadas.

* `--tupscan`, `-t`

Analisa a tabela na ordem dos tuplos.

* `--usage`

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

Exibir texto de ajuda e sair; o mesmo que `--help`.

* `--useHexFormat` `-x`

  Faz com que todos os valores numéricos sejam exibidos no formato hexadecimal. Isso não afeta a saída de numerais contidos em strings ou valores de data e hora.

* `--version`

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

0

Exibir informações da versão e sair.

#### Saída de exemplo

Saída de uma instrução `SELECT` do MySQL:

```
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

Saída da invocação equivalente do **ndb\_select\_all**:

```
$> ./ndb_select_all -c localhost fish -d ctest1
id      name
3       [shark]
6       [puffer]
2       [tuna]
4       [manta ray]
5       [grouper]
1       [guppy]
6 rows returned
```

Todos os valores de string são encerrados por colchetes (`[`...`]`) na saída do **ndb\_select\_all**. Para outro exemplo, considere a tabela criada e preenchida como mostrado aqui:

```
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

Isso demonstra o uso de várias opções adicionais do **ndb\_select\_all**:

```
$> ./ndb_select_all -d ctest1 dogs -o ix -z --gci --disk
GCI     id name          breed        DISK_REF
834461  2  [Scooby-Doo]  [Great Dane] [ m_file_no: 0 m_page: 98 m_page_idx: 0 ]
834878  4  [Rosscoe]     [Mutt]       [ m_file_no: 0 m_page: 98 m_page_idx: 16 ]
834463  3  [Rin-Tin-Tin] [Alsatian]   [ m_file_no: 0 m_page: 34 m_page_idx: 0 ]
835657  1  [Lassie]      [Collie]     [ m_file_no: 0 m_page: 66 m_page_idx: 0 ]
4 rows returned
```