## 25.5 Programas de Aglomeração do BNDES

Usar e gerenciar um NDB Cluster requer vários programas especializados, que descrevemos neste capítulo. Discutimos os propósitos desses programas em um NDB Cluster, como usar os programas e quais opções de inicialização estão disponíveis para cada um deles.

Esses programas incluem os processos de dados, gerenciamento e SQL do NDB Cluster (**ndbd**, **ndbmtd**"), **ndb_mgmd** e **mysqld**) e o cliente de gerenciamento (**ndb_mgm**).

Para obter informações sobre o uso do **mysqld** como um processo do NDB Cluster, consulte a Seção 25.6.10, “Uso do servidor MySQL para NDB Cluster”.

Outros programas utilitários, de diagnóstico e exemplos do `NDB` estão incluídos na distribuição do NDB Cluster. Esses programas incluem **ndb_restore**, **ndb_show_tables** e **ndb_config**. Esses programas também são abordados nesta seção.

### 25.5.1 ndbd — O daemon do nó de dados do cluster NDB

O binário **ndbd** fornece a versão de processamento único-thread do processo que é usado para lidar com todos os dados em tabelas que empregam o mecanismo de armazenamento `NDBCLUSTER`. Este processo do nó de dados permite que um nó de dados realize o gerenciamento de transações distribuídas, recuperação de nós, checkpointing em disco, backup online e tarefas relacionadas. No NDB 8.0.38 e versões posteriores, quando iniciado, **ndbd** registra um aviso semelhante ao mostrado aqui:

```
2024-05-28 13:32:16 [ndbd] WARNING  -- Running ndbd with a single thread of
signal execution.  For multi-threaded signal execution run the ndbmtd binary.
```

**ndbmtd**") é a versão multi-threaded deste binário.

Em um NDB Cluster, um conjunto de processos **ndbd** coopera no manuseio de dados. Esses processos podem ser executados no mesmo computador (host) ou em diferentes computadores. As correspondências entre nós de dados e hosts do Cluster são completamente configuráveis.

As opções que podem ser usadas com **ndbd** estão mostradas na tabela a seguir. Descrições adicionais seguem a tabela.

**Tabela 25.24 Opções de linha de comando usadas com o programa ndbd**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th scope="col">Format</th> <th scope="col">Description</th> <th scope="col">Added, Deprecated, or Removed</th> </tr></thead><tbody><tr> <th scope="row"><p> <code class="option"> --bind-address=name </code> </p></th> <td>Endereço de vinculação local</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --character-sets-dir=path </code> </p></th> <td>Diretório contendo conjuntos de caracteres</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --connect-delay=# </code> </p></th> <td>Símbolo obsoleto para --connect-retry-delay, que deve ser usado em vez desta opção</td> <td><p>REMOÇÃO: NDB 8.0.28</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --connect-retries=# </code> </p></th> <td>Defina o número de vezes para tentar uma conexão novamente antes de desistir; 0 significa apenas uma tentativa (e nenhuma tentativa repetida); -1 significa continuar tentando indefinidamente</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --connect-retry-delay=# </code> </p></th> <td>Tempo de espera entre as tentativas de contato com um servidor de gerenciamento, em segundos; 0 significa não esperar entre as tentativas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--connect-string=connection_string</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndbd.html#option_ndbd_connect-string">-c connection_string</a> </code> </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --core-file </code> </p></th> <td>Escreva o arquivo de núcleo em erro; usado em depuração</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--daemon</code>,</p><p> <code class="option"> -d </code> </p></th> <td>Inicie o ndbd como daemon (padrão); substitua com --nodaemon</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --defaults-extra-file=path </code> </p></th> <td>Leia o arquivo fornecido após os arquivos globais terem sido lidos</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --defaults-file=path </code> </p></th> <td>Ler opções padrão a partir do arquivo fornecido apenas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --defaults-group-suffix=string </code> </p></th> <td>Leia também grupos com concat(grupo, sufixo)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --filesystem-password=password </code> </p></th> <td>Senha para criptografia do sistema de arquivos do nó; pode ser passada a partir de stdin, tty ou arquivo my.cnf</td> <td><p>ADICIONADO: NDB 8.0.31</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --filesystem-password-from-stdin={TRUE|FALSE} </code> </p></th> <td>Obtenha a senha para o sistema de criptografia de arquivos do nó, passada do stdin</td> <td><p>ADICIONADO: NDB 8.0.31</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --foreground </code> </p></th> <td>Execute o ndbd em primeiro plano, fornecido para fins de depuração (implica em --nodaemon)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--help</code>,</p><p> <code class="option"> -? </code> </p></th> <td>Exibir texto de ajuda e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --initial </code> </p></th> <td>Realize o início inicial do ndbd, incluindo a limpeza do sistema de arquivos; consulte a documentação antes de usar essa opção</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --initial-start </code> </p></th> <td>Realize o início inicial parcial (requer --nowait-nodes)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --install[=name] </code> </p></th> <td>Usado para instalar o processo do nó de dados como serviço do Windows; não se aplica em outras plataformas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --logbuffer-size=# </code> </p></th> <td>Controle o tamanho do buffer de registro; para uso quando está fazendo depuração com muitas mensagens de registro sendo geradas; o padrão é suficiente para operações normais</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --login-path=path </code> </p></th> <td>Leia o caminho fornecido a partir do arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--ndb-connectstring=connection_string</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndbd.html#option_ndbd_ndb-connectstring">-c connection_string</a> </code> </p></th> <td>Defina a string de conexão para se conectar ao ndb_mgmd. Sintaxe: "[nodeid=id;][host=]hostname[:port]". Supere as entradas em NDB_CONNECTSTRING e my.cnf</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--ndb-mgmd-host=connection_string</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndbd.html#option_ndbd_ndb-mgmd-host">-c connection_string</a> </code> </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --ndb-nodeid=# </code> </p></th> <td>Defina o ID do nó para este nó, substituindo qualquer ID definida pela opção --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --nodaemon </code> </p></th> <td>Não inicie o ndbd como daemon; fornecido para fins de teste</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --no-defaults </code> </p></th> <td>Não leia as opções padrão de qualquer arquivo de opção, exceto o arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--nostart</code>,</p><p> <code class="option"> -n </code> </p></th> <td>Não inicie o ndbd imediatamente; o ndbd aguarda comando para iniciar a partir do ndb_mgm</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --nowait-nodes=list </code> </p></th> <td>Não espere que esses nós de dados comecem (gera uma lista separada por vírgula dos IDs dos nós); requer --ndb-nodeid</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --ndb-optimized-node-selection </code> </p></th> <td>Ative as otimizações para a seleção de nós para transações. Ativado por padrão; use --skip-ndb-optimized-node-selection para desativá-lo</td> <td><p>REMOvido: 8.0.31</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --print-defaults </code> </p></th> <td>Imprimir a lista de argumentos do programa e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --remove[=name] </code> </p></th> <td>Usado para remover o processo do nó de dados que foi instalado anteriormente como serviço do Windows; não se aplica em outras plataformas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--usage</code>,</p><p> <code class="option"> -? </code> </p></th> <td>Exibir texto de ajuda e sair; o mesmo que --help</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--verbose</code>,</p><p> <code class="option"> -v </code> </p></th> <td>Escreva informações de depuração adicionais no log do nó</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--version</code>,</p><p> <code class="option"> -V </code> </p></th> <td>Exibir informações da versão e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody></table>

Nota

Todas essas opções também se aplicam à versão multithread deste programa (**ndbmtd")) e você pode substituir “**ndbmtd””) por “**ndbd”” onde quer que este último ocorra nesta seção.

* `--bind-address`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>

Faz com que o **ndbd** se ligue a uma interface de rede específica (nome de host ou endereço IP). Esta opção não tem valor padrão.

* `--character-sets-dir`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

Diretório contendo conjuntos de caracteres.

* `--connect-delay=#`

  <table frame="box" rules="all" summary="Properties for connect-delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-delay=#</code></td> </tr><tr><th>Desatualizado</th> <td>Sim (removido em 8.0.28-ndb-8.0.28)</td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>5</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>3600</code></td> </tr></tbody></table>

Determina o tempo de espera entre as tentativas de contato com um servidor de gerenciamento ao iniciar (o número de tentativas é controlado pela opção `--connect-retries`). O padrão é 5 segundos.

Essa opção é desatualizada e está sujeita à remoção em uma versão futura do NDB Cluster. Use `--connect-retry-delay` em vez disso.

* `--connect-retries=#`

  <table frame="box" rules="all" summary="Properties for connect-retries"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>12</code></td> </tr><tr><th>Valor mínimo (≥ 8.0.28-ndb-8.0.28)</th> <td><code>-1</code></td> </tr><tr><th>Minimum Value</th> <td><code>-1</code></td> </tr><tr><th>Minimum Value</th> <td><code>-1</code></td> </tr><tr><th>Valor mínimo (≤ 8.0.27-ndb-8.0.27)</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>65535</code></td> </tr></tbody></table>

Defina o número de vezes para tentar uma conexão novamente antes de desistir; 0 significa apenas uma tentativa (e nenhuma tentativa). O padrão é 12 tentativas. O tempo para esperar entre as tentativas é controlado pela opção `--connect-retry-delay`.

A partir do NDB 8.0.28, você pode definir essa opção para -1, caso em que o processo do nó de dados continua indefinidamente tentando se conectar.

* `--connect-retry-delay=#`

  <table frame="box" rules="all" summary="Properties for connect-retry-delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retry-delay=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>5</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>

Determina o tempo de espera entre as tentativas de contato com um servidor de gerenciamento ao iniciar (o tempo entre as tentativas é controlado pela opção `--connect-retries`). O padrão é de 5 segundos.

Esta opção substitui a opção `--connect-delay`, que já está desatualizada e sujeita à remoção em uma versão futura do NDB Cluster.

A forma abreviada `-r` para esta opção é descontinuada a partir do NDB 8.0.28 e está sujeita à remoção em uma versão futura do NDB Cluster. Use a forma longa em vez disso.

* `--connect-string`

  <table frame="box" rules="all" summary="Properties for connect-string"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-string=connection_string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

O mesmo que `--ndb-connectstring`.

* `--core-file`

  <table frame="box" rules="all" summary="Properties for core-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--core-file</code></td> </tr></tbody></table>

Escreva o arquivo de núcleo em erro; usado em depuração.

* `--daemon`, `-d`

  <table frame="box" rules="all" summary="Properties for daemon"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--daemon</code></td> </tr></tbody></table>

Instrua o **ndbd** ou **ndbmtd**") a ser executado como um processo de daemon. Esse é o comportamento padrão. `--nodaemon` pode ser usado para impedir que o processo seja executado como um daemon.

Essa opção não tem efeito ao executar **ndbd** ou **ndbmtd**") em plataformas Windows.

* `--defaults-extra-file`

  <table frame="box" rules="all" summary="Properties for defaults-extra-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-extra-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

Leia o arquivo fornecido após a leitura dos arquivos globais.

* `--defaults-file`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>0

Leia as opções padrão a partir do arquivo fornecido apenas.

* `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>1

Leia também grupos com concatenação(grupo, sufixo).

* `--filesystem-password`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>2

Passe a senha de criptografia e descriptografia do sistema de arquivos para o processo do nó de dados usando `stdin`, `tty` ou o arquivo `my.cnf`.

Requer `EncryptedFileSystem = 1`(mysql-cluster-ndbd-definition.html#ndbparam-ndbd-encryptedfilesystem).

Para mais informações, consulte a Seção 25.6.14, “Encriptação do Sistema de Arquivos para NDB Cluster”.

* `--filesystem-password-from-stdin`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>3

Passe a senha de criptografia e descriptografia do sistema de arquivos para o processo do nó de dados a partir de `stdin` (apenas).

Requer `EncryptedFileSystem = 1`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-encryptedfilesystem).

Para mais informações, consulte a Seção 25.6.14, “Encriptação do Sistema de Arquivos para NDB Cluster”.

* `--foreground`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>4

Causas **ndbd** ou **ndbmtd") para executar como um processo em primeiro plano, principalmente para fins de depuração. Esta opção implica na opção `--nodaemon`.

Essa opção não tem efeito ao executar **ndbd** ou **ndbmtd**") em plataformas Windows.

* `--help`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>5

Exibir texto de ajuda e sair.

* `--initial`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>6

Instrua o **ndbd** a realizar um início inicial. Um início inicial apaga quaisquer arquivos criados para fins de recuperação por instâncias anteriores do **ndbd**. Também recria os arquivos de registro de recuperação. Em alguns sistemas operacionais, esse processo pode levar um tempo substancial.

Um início `--initial` deve ser usado *apenas* quando se inicia o processo **ndbd** em circunstâncias muito especiais; isso ocorre porque essa opção faz com que todos os arquivos sejam removidos do sistema de arquivos do NDB Cluster e todos os arquivos de log de refazer sejam recriados. Essas circunstâncias estão listadas aqui:

+ Ao realizar uma atualização de software que alterou o conteúdo de quaisquer arquivos.

+ Ao reiniciar o nó com uma nova versão do **ndbd**.

+ Como medida de último recurso quando, por algum motivo, o reinício do nó ou o reinício do sistema falha repetidamente. Neste caso, esteja ciente de que este nó não pode mais ser usado para restaurar dados devido à destruição dos arquivos de dados.

Aviso

Para evitar a possibilidade de perda eventual de dados, é recomendável que você *não* use a opção `--initial` junto com `StopOnError = 0`. Em vez disso, defina `StopOnError` para 0 em `config.ini` apenas após o clúster ter sido iniciado, e, em seguida, reinicie os nós de dados normalmente — ou seja, sem a opção `--initial`. Consulte a descrição do parâmetro `StopOnError` para uma explicação detalhada sobre este problema. (Bug #24945638)

O uso desta opção impede que os parâmetros de configuração `StartPartialTimeout` e `StartPartitionedTimeout` tenham qualquer efeito.

Importante

Esta opção *não* afeta os arquivos de backup que já foram criados pelo nó afetado.

Antes da NDB 8.0.21, a opção `--initial` também não afetava nenhum arquivo de dados do disco. Na NDB 8.0.21 e em versões posteriores, quando usada para realizar um reinício inicial do clúster, a opção causa a remoção de todos os arquivos de dados associados aos espaços de tabelas de dados do disco e os arquivos de registro de desfazer associados aos grupos de arquivos de registro que existiam anteriormente neste nó de dados (consulte a Seção 25.6.11, “Tabelas de Dados de Disco do NDB Cluster”).

Essa opção também não afeta a recuperação de dados por um nó de dados que está apenas começando (ou reiniciando) a partir de nós de dados que já estão em execução (a menos que também tenham sido iniciados com `--initial`, como parte de uma reinicialização inicial). Essa recuperação de dados ocorre automaticamente e não requer intervenção do usuário em um NDB Cluster que está em execução normalmente.

É permitido usar essa opção ao iniciar o clúster pela primeira vez (ou seja, antes que quaisquer arquivos de nó de dados tenham sido criados); no entanto, *não é necessário* fazer isso.

* `--initial-start`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>7

Essa opção é usada ao realizar um início inicial parcial do clúster. Cada nó deve ser iniciado com essa opção, assim como `--nowait-nodes`.

Suponha que você tenha um clúster de 4 nós, cujos nós de dados têm os IDs 2, 3, 4 e 5, e que você queira realizar um início inicial parcial usando apenas os nós 2, 4 e 5 — ou seja, omitindo o nó 3:

  ```
  $> ndbd --ndb-nodeid=2 --nowait-nodes=3 --initial-start
  $> ndbd --ndb-nodeid=4 --nowait-nodes=3 --initial-start
  $> ndbd --ndb-nodeid=5 --nowait-nodes=3 --initial-start
  ```

Ao usar essa opção, você também deve especificar o ID do nó para o nó de dados que está sendo iniciado com a opção `--ndb-nodeid`.

Importante

Não confunda esta opção com a opção `--nowait-nodes` para **ndb_mgmd**, que pode ser usada para permitir que um clúster configurado com vários servidores de gerenciamento seja iniciado sem que todos os servidores de gerenciamento estejam online.

* `--install[=name]`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>8

Faça com que o **ndbd** seja instalado como um serviço do Windows. Opcionalmente, você pode especificar um nome para o serviço; se não for definido, o nome do serviço será `ndbd`. Embora seja preferível especificar outras opções do programa **ndbd** em um arquivo de configuração `my.ini` ou `my.cnf`, é possível usá-lo junto com `--install`. No entanto, nesses casos, a opção `--install` deve ser especificada primeiro, antes de quaisquer outras opções serem dadas, para que a instalação do serviço do Windows seja bem-sucedida.

Geralmente, não é aconselhável usar esta opção juntamente com a opção `--initial`, pois isso faz com que o sistema de arquivos do nó de dados seja apagado e reconstruído toda vez que o serviço é parado e iniciado. Também deve-se ter extremo cuidado se você pretender usar qualquer uma das outras opções do **ndbd** que afetam o início dos nós de dados — incluindo `--initial-start`, `--nostart` e `--nowait-nodes` — juntamente com `--install`, e você deve ter certeza absoluta de que entende completamente e permite quaisquer possíveis consequências de fazer isso.

A opção `--install` não tem efeito em plataformas que não são do Windows.

* `--logbuffer-size=#`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>9

Define o tamanho do buffer de registro do nó de dados. Ao depurar com grandes quantidades de registro adicional, é possível que o buffer de registro fique sem espaço se houver muitas mensagens de log, no caso, algumas mensagens de log podem ser perdidas. Isso não deve ocorrer durante operações normais.

* `--login-path`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>0

Leia o caminho fornecido a partir do arquivo de login.

* `--ndb-connectstring`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>1

Defina a string de conexão para se conectar ao ndb_mgmd. Sintaxe: "[nodeid=id;][host=]hostname[:port]". Ocorre entradas em NDB_CONNECTSTRING e my.cnf.

* `--ndb-mgmd-host`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>2

O mesmo que `--ndb-connectstring`.

* `--ndb-nodeid`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>3

Defina o ID do nó para este nó, substituindo qualquer ID definida pela opção --ndb-connectstring.

* `--ndb-optimized-node-selection`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>4

Ative as otimizações para a seleção de nós para transações. Ativado por padrão; use `--skip-ndb-optimized-node-selection` para desativá-lo.

* `--nodaemon`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>5

Previne que **ndbd** ou **ndbmtd**") seja executado como um processo de daemon. Esta opção substitui a opção `--daemon`. Isso é útil para redirecionar a saída para a tela ao depurar o binário.

O comportamento padrão para **ndbd** e **ndbmtd**") no Windows é executar em plano de fundo, tornando essa opção desnecessária em plataformas do Windows, onde não tem efeito.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>6

Não leia as opções padrão de qualquer arquivo de opção, exceto o arquivo de login.

* `--nostart`, `-n`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>7

Instrua o **ndbd** a não iniciar automaticamente. Quando esta opção é usada, o **ndbd** se conecta ao servidor de gerenciamento, obtém dados de configuração dele e inicializa objetos de comunicação. No entanto, ele não inicia realmente o motor de execução até que seja especificamente solicitado a fazer isso pelo servidor de gerenciamento. Isso pode ser feito emitindo o comando apropriado `START` no cliente de gerenciamento (consulte Seção 25.6.1, “Comandos no Cliente de Gerenciamento do NDB Cluster”).

* `--nowait-nodes=node_id_1[, node_id_2[, ...]]`(mysql-cluster-programs-ndbd.html#option_ndbd_nowait-nodes)

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>8

Esta opção recebe uma lista de nós de dados para os quais o clúster não espera, antes de começar.

Isso pode ser usado para iniciar o clúster em um estado particionado. Por exemplo, para iniciar o clúster com apenas metade dos nós de dados (nós 2, 3, 4 e 5) rodando em um clúster de 4 nós, você pode iniciar cada processo **ndbd** com `--nowait-nodes=3,5`. Neste caso, o clúster é iniciado assim que os nós 2 e 4 se conectam e *não* espera `StartPartitionedTimeout` milissegundos para os nós 3 e 5 se conectarem como faria de outra forma.

Se você quisesse iniciar o mesmo clúster do exemplo anterior sem um **ndbd** (digamos, por exemplo, que a máquina hospedeira do nó 3 sofreu uma falha de hardware), então inicie os nós 2, 4 e 5 com `--nowait-nodes=3`. O clúster começa assim que os nós 2, 4 e 5 se conectam e não espera que o nó 3 comece.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>9

Imprimir a lista de argumentos do programa e sair.

* `--remove[=name]`

  <table frame="box" rules="all" summary="Properties for connect-delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-delay=#</code></td> </tr><tr><th>Desatualizado</th> <td>Sim (removido em 8.0.28-ndb-8.0.28)</td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>5</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>3600</code></td> </tr></tbody></table>0

Causa a remoção do processo **ndbd** que foi instalado anteriormente como um serviço do Windows. Opcionalmente, você pode especificar um nome para o serviço que será desinstalado; se não for definido, o nome do serviço será predefinido como `ndbd`.

A opção `--remove` não tem efeito em plataformas que não são do Windows.

* `--usage`

  <table frame="box" rules="all" summary="Properties for connect-delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-delay=#</code></td> </tr><tr><th>Desatualizado</th> <td>Sim (removido em 8.0.28-ndb-8.0.28)</td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>5</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>3600</code></td> </tr></tbody></table>1

Exibir texto de ajuda e sair; o mesmo que --help.

* `--verbose`, `-v`

Faz com que a saída extra de depuração seja escrita no log do nó.

Você também pode usar `NODELOG DEBUG ON` (mysql-cluster-mgm-client-commands.html#ndbclient-nodelog-debug) e `NODELOG DEBUG OFF` (mysql-cluster-mgm-client-commands.html#ndbclient-nodelog-debug) para habilitar e desabilitar esse registro extra enquanto o nó de dados está em execução.

* `--version`

  <table frame="box" rules="all" summary="Properties for connect-delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-delay=#</code></td> </tr><tr><th>Desatualizado</th> <td>Sim (removido em 8.0.28-ndb-8.0.28)</td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>5</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>3600</code></td> </tr></tbody></table>2

Exibir informações da versão e sair.

O **ndbd** gera um conjunto de arquivos de registro que são colocados no diretório especificado por `DataDir` no arquivo de configuração do `config.ini`.

Esses arquivos de registro estão listados abaixo. *`node_id`* é e representa o identificador único do nó. Por exemplo, `ndb_2_error.log` é o log de erro gerado pelo nó de dados cujo ID de nó é `2`.

* `ndb_node_id_error.log` é um arquivo que contém registros de todos os acidentes que o processo **ndbd** mencionado encontrou. Cada registro neste arquivo contém uma breve string de erro e uma referência a um arquivo de rastreamento para este acidente. Uma entrada típica neste arquivo pode aparecer como mostrado aqui:

  ```
  Date/Time: Saturday 30 July 2004 - 00:20:01
  Type of error: error
  Message: Internal program error (failed ndbrequire)
  Fault ID: 2341
  Problem data: DbtupFixAlloc.cpp
  Object of reference: DBTUP (Line: 173)
  ProgramName: NDB Kernel
  ProcessID: 14909
  TraceFile: ndb_2_trace.log.2
  ***EOM***
  ```

As listas de possíveis códigos de saída do **ndbd** e mensagens geradas quando um processo de nó de dados é desligado prematuramente podem ser encontradas em Mensagens de erro do nó de dados.

Importante

*A última entrada no arquivo de registro de erros não é necessariamente a mais recente* (e também não é provável que seja). As entradas no registro de erros não estão listadas em ordem cronológica; em vez disso, correspondem à ordem dos arquivos de rastreamento conforme determinado no arquivo `ndb_node_id_trace.log.next` (veja abaixo). As entradas do registro de erros são, portanto, sobrescritas de forma cíclica e não sequencial.

* `ndb_node_id_trace.log.trace_id` é um arquivo de rastreamento que descreve exatamente o que aconteceu logo antes do erro ocorrer. Essas informações são úteis para análise pela equipe de desenvolvimento do NDB Cluster.

É possível configurar o número desses arquivos de rastreamento que são criados antes que os arquivos antigos sejam sobrescritos. *`trace_id`* é um número que é incrementado para cada arquivo de rastreamento sucessivo.

* `ndb_node_id_trace.log.next` é o arquivo que mantém o controle do próximo número de arquivo de rastreamento a ser atribuído.

* `ndb_node_id_out.log` é um arquivo que contém quaisquer dados gerados pelo processo **ndbd**. Este arquivo é criado apenas se o **ndbd** for iniciado como um daemon, que é o comportamento padrão.

* `ndb_node_id.pid` é um arquivo que contém o ID de processo do processo **ndbd** quando iniciado como um daemon. Também funciona como um arquivo de bloqueio para evitar o início de nós com o mesmo identificador.

* `ndb_node_id_signal.log` é um arquivo usado apenas em versões de depuração do **ndbd**, onde é possível rastrear todas as mensagens recebidas, enviadas e internas com seus dados no processo **ndbd**.

Recomenda-se não usar um diretório montado através do NFS, pois, em alguns ambientes, isso pode causar problemas, onde o bloqueio do arquivo `.pid` permanece em vigor mesmo após o processo ter sido terminado.

Para iniciar o **ndbd**, também pode ser necessário especificar o nome do host do servidor de gerenciamento e a porta na qual ele está ouvindo. Opcionalmente, também é possível especificar o ID do nó que o processo deve usar.

```
$> ndbd --connect-string="nodeid=2;host=ndb_mgmd.mysql.com:1186"
```

Consulte a Seção 25.4.3.3, “Strings de Conexão de NDB Cluster”, para obter informações adicionais sobre este problema. Para mais informações sobre os parâmetros de configuração do nó de dados, consulte a Seção 25.4.3.6, “Definindo Nodos de Dados de NDB Cluster”.

Quando o **ndbd** é iniciado, ele realmente inicia dois processos. O primeiro deles é chamado de "processo anjo"; seu único trabalho é descobrir quando o processo de execução foi concluído e, em seguida, reiniciar o processo **ndbd** se estiver configurado para fazer isso. Assim, se você tentar matar o **ndbd** usando o comando Unix **kill**, é necessário matar ambos os processos, começando com o processo anjo. O método preferido para terminar um processo **ndbd** é usar o cliente de gerenciamento e parar o processo a partir daí.

O processo de execução utiliza um único fio para leitura, escrita e varredura de dados, bem como todas as outras atividades. Esse fio é implementado de forma assíncrona, para que possa facilmente lidar com milhares de ações concorrentes. Além disso, um fio de guarda-costas supervisiona o fio de execução para garantir que ele não fique em um loop infinito. Um grupo de fios lida com o E/S de arquivos, com cada fio podendo lidar com um arquivo aberto. Os fios também podem ser usados para conexões de transportador pelos transportadores no processo **ndbd**. Em um sistema multiprocessador que realiza um grande número de operações (incluindo atualizações), o processo **ndbd** pode consumir até 2 CPUs, se permitido.

Para uma máquina com muitas CPUs, é possível usar vários processos **ndbd** que pertencem a diferentes grupos de nós; no entanto, tal configuração ainda é considerada experimental e não é suportada para o MySQL 8.0 em um ambiente de produção. Veja a Seção 25.2.7, “Limitações conhecidas do NDB Cluster”.

### 25.5.2 ndbinfo_select_all — Selecionar de tabelas ndbinfo

**ndbinfo_select_all** é um programa cliente que seleciona todas as linhas e colunas de uma ou mais tabelas no banco de dados `ndbinfo`

Nem todas as tabelas `ndbinfo` disponíveis no cliente **mysql** podem ser lidas por este programa (consulte mais tarde nesta seção). Além disso, **ndbinfo_select_all** pode mostrar informações sobre algumas tabelas internas de `ndbinfo` que não podem ser acessadas usando SQL, incluindo as tabelas de metadados `tables` e `columns`.

Para selecionar uma ou mais tabelas `ndbinfo` usando **ndbinfo_select_all**, é necessário fornecer os nomes das tabelas ao invocar o programa, conforme mostrado aqui:

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

**Tabela 25.25 Opções de linha de comando usadas com o programa ndbinfo_select_all**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th scope="col">Format</th> <th scope="col">Description</th> <th scope="col">Added, Deprecated, or Removed</th> </tr></thead><tbody><tr> <th scope="row"><p> <code class="option"> --character-sets-dir=path </code> </p></th> <td>Directory containing character sets</td> <td><p> REMOVED: 8.0.31 </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --connect-retries=# </code> </p></th> <td>Número de vezes para tentar a conexão novamente antes de desistir</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --connect-retry-delay=# </code> </p></th> <td>Número de segundos para esperar entre as tentativas de contato com o servidor de gerenciamento</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--connect-string=connection-string</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndbinfo-select-all.html#option_ndbinfo_select_all_connect-string">-c connection_string</a> </code> </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --core-file </code> </p></th> <td>Escreva o arquivo de núcleo em erro; usado em depuração</td> <td><p>REMOvido: 8.0.31</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--database=db_name</code>,</p><p> <code class="option"> -d </code> </p></th> <td>Nome do banco de dados onde a tabela está localizada</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --defaults-extra-file=path </code> </p></th> <td>Leia o arquivo fornecido após os arquivos globais terem sido lidos</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --defaults-file=path </code> </p></th> <td>Ler opções padrão a partir do arquivo fornecido apenas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --defaults-group-suffix=string </code> </p></th> <td>Leia também grupos com concat(grupo, sufixo)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --delay=# </code> </p></th> <td>Defina o atraso em segundos entre os loops</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--help</code>,</p><p> <code class="option"> -? </code> </p></th> <td>Exibir texto de ajuda e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --login-path=path </code> </p></th> <td>Leia o caminho fornecido a partir do arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--loops=#</code>,</p><p> <code class="option"> -l </code> </p></th> <td>Defina o número de vezes para executar a seleção</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--ndb-connectstring=connection-string</code>,</p><p> <code class="option"> -c </code> </p></th> <td>Defina a string de conexão para se conectar ao ndb_mgmd. Sintaxe: "[nodeid=id;][host=]hostname[:port]". Supere as entradas em NDB_CONNECTSTRING e my.cnf</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--ndb-mgmd-host=connection-string</code>,</p><p> <code class="option"> -c </code> </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --ndb-nodeid=# </code> </p></th> <td>Defina o ID do nó para este nó, substituindo qualquer ID definida pela opção --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --no-defaults </code> </p></th> <td>Não leia as opções padrão de qualquer arquivo de opção, exceto o arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --ndb-optimized-node-selection </code> </p></th> <td>Ative as otimizações para a seleção de nós para transações. Ativado por padrão; use --skip-ndb-optimized-node-selection para desativá-lo</td> <td><p>REMOvido: 8.0.31</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--parallelism=#</code>,</p><p> <code class="option"> -p </code> </p></th> <td>Definir o grau de paralelismo</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --print-defaults </code> </p></th> <td>Imprimir a lista de argumentos do programa e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--usage</code>,</p><p> <code class="option"> -? </code> </p></th> <td>Exibir texto de ajuda e sair; o mesmo que --help</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--version</code>,</p><p> <code class="option"> -V </code> </p></th> <td>Exibir informações da versão e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody></table>

* `--character-sets-dir`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>

Diretório contendo conjuntos de caracteres.

* `--core-file`

  <table frame="box" rules="all" summary="Properties for core-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--core-file</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>

Escreva o arquivo de núcleo em erro; usado em depuração.

* `--connect-retries`

  <table frame="box" rules="all" summary="Properties for connect-retries"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>12</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>12</code></td> </tr></tbody></table>

Número de vezes para tentar a conexão novamente antes de desistir.

* `--connect-retry-delay`

  <table frame="box" rules="all" summary="Properties for connect-retry-delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retry-delay=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>5</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>5</code></td> </tr></tbody></table>

Número de segundos para esperar entre as tentativas de contato com o servidor de gerenciamento.

* `--connect-string`

  <table frame="box" rules="all" summary="Properties for connect-string"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-string=connection-string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

O mesmo que `--ndb-connectstring`.

* `--defaults-extra-file`

  <table frame="box" rules="all" summary="Properties for defaults-extra-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-extra-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

Leia o arquivo fornecido após a leitura dos arquivos globais.

* `--defaults-file`

  <table frame="box" rules="all" summary="Properties for defaults-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

Leia as opções padrão a partir do arquivo fornecido apenas.

* `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Properties for defaults-group-suffix"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-group-suffix=string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

Leia também grupos com concatenação(grupo, sufixo).

* `--delay=seconds`

  <table frame="box" rules="all" summary="Properties for delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--delay=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>5</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>MAX_INT</code></td> </tr></tbody></table>

Esta opção define o número de segundos para esperar entre a execução de loops. Não tem efeito se `--loops` estiver definido como 0 ou 1.

* `--help`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>0

Exibir texto de ajuda e sair.

* `--login-path`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>1

Leia o caminho fornecido a partir do arquivo de login.

* `--loops=number`, `-l number`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>2

Esta opção define o número de vezes que o select deve ser executado. Use `--delay` para definir o intervalo entre os ciclos.

* `--ndb-connectstring`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>3

Defina a string de conexão para se conectar ao ndb_mgmd. Sintaxe: "[nodeid=id;][host=]hostname[:port]". Ocorre entradas em NDB_CONNECTSTRING e my.cnf.

* `--ndb-mgmd-host`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>4

O mesmo que `--ndb-connectstring`.

* `--ndb-nodeid`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>5

Defina o ID do nó para este nó, substituindo qualquer ID definida pela opção --ndb-connectstring.

* `--ndb-optimized-node-selection`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>6

Ative as otimizações para a seleção de nós para transações. Ativado por padrão; use `--skip-ndb-optimized-node-selection` para desativá-lo.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>7

Não leia as opções padrão de qualquer arquivo de opção, exceto o arquivo de login.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>8

Imprimir a lista de argumentos do programa e sair.

* `--usage`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>9

Exibir texto de ajuda e sair; o mesmo que --help.

* `--version`

  <table frame="box" rules="all" summary="Properties for core-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--core-file</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>0

Exibir informações da versão e sair.

**ndbinfo_select_all** não consegue ler as seguintes tabelas:

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

### 25.5.3 ndbmtd — O Daemon de Nó de Dados do NDB Cluster (Multi-Thread)

**ndbmtd**") é uma versão multithreading de **ndbd**, o processo que é usado para lidar com todos os dados em tabelas usando o mecanismo de armazenamento `NDBCLUSTER`. **ndbmtd**") é destinado para uso em computadores anfitrião que possuem múltiplos núcleos de CPU. Exceto onde indicado de outra forma, **ndbmtd**") funciona da mesma maneira que **ndbd**. Portanto, nesta seção, concentramos-nos nas maneiras pelas quais **ndbmtd**") difere de **ndbd**, e você deve consultar a Seção 25.5.1, “ndbd — O Daemon do Nó de Dados do NDB Cluster”, para obter informações adicionais sobre a execução de nós de dados do NDB Cluster que se aplicam tanto às versões de thread única quanto multithread do processo do nó de dados.

As opções de linha de comando e os parâmetros de configuração usados com **ndbd** também se aplicam a **ndbmtd)**). Para mais informações sobre essas opções e parâmetros, consulte a Seção 25.5.1, “ndbd — O daemon do nó de dados do cluster NDB”, e a Seção 25.4.3.6, “Definindo nós de dados do cluster NDB”, respectivamente.

**ndbmtd**") também é compatível com o sistema de arquivos do **ndbd**. Em outras palavras, um nó de dados que executa **ndbd** pode ser parado, o binário substituído por **ndbmtd**"), e então reiniciado sem perda de dados. (No entanto, ao fazer isso, você deve garantir que `MaxNoOfExecutionThreads` esteja configurado com um valor apropriado antes de reiniciar o nó, se você deseja que **ndbmtd**") funcione em modo multithread.) Da mesma forma, um binário **ndbmtd**") pode ser substituído por **ndbd** simplesmente parando o nó e então iniciando **ndbd** no lugar do binário multithread. Não é necessário quando você muda entre os dois para iniciar o binário do nó de dados usando `--initial`.

Usar **ndbmtd**") difere do uso de **ndbd** em dois aspectos fundamentais:

1. Como o **ndbmtd**) é executado por padrão no modo de único fio (ou seja, ele se comporta como o **ndbd**), você deve configurá-lo para usar múltiplos fios. Isso pode ser feito definindo um valor apropriado no arquivo `config.ini` para o parâmetro de configuração `MaxNoOfExecutionThreads` ou o parâmetro de configuração `ThreadConfig`. Usar `MaxNoOfExecutionThreads` é mais simples, mas `ThreadConfig` oferece mais flexibilidade. Para mais informações sobre esses parâmetros de configuração e seu uso, consulte Parâmetros de Configuração de Multithreading (ndbmtd)").

2. Arquivos de rastreamento são gerados por erros críticos nos processos **ndbmtd**") de uma maneira um pouco diferente daquela gerada por falhas do **ndbd**. Essas diferenças são discutidas com mais detalhes nos próximos parágrafos.

Assim como o **ndbd**, o **ndbmtd**") gera um conjunto de arquivos de registro que são colocados no diretório especificado por `DataDir` no arquivo de configuração do `config.ini`. Exceto pelos arquivos de rastreamento, esses são gerados da mesma maneira e têm os mesmos nomes que os gerados pelo **ndbd**.

Em caso de um erro crítico, **ndbmtd**") gera arquivos de registro que descrevem o que aconteceu imediatamente antes da ocorrência do erro. Esses arquivos, que podem ser encontrados no nó de dados `DataDir`, são úteis para a análise de problemas pelas equipes de Desenvolvimento e Suporte do NDB Cluster. Um arquivo de registro é gerado para cada **ndbmtd**") thread. Os nomes desses arquivos têm o seguinte padrão:

```
ndb_node_id_trace.log.trace_id_tthread_id,
```

Nesse padrão, *`node_id`* representa o ID único do nó do nó de dados no clúster, *`trace_id`* é um número de sequência de rastreamento e *`thread_id`* é o ID do thread. Por exemplo, em caso de falha de um processo **ndbmtd")** que está sendo executado como um nó de dados do NDB Cluster com o ID de nó 3 e com `MaxNoOfExecutionThreads` igual a 4, quatro arquivos de rastreamento são gerados no diretório de dados do nó de dados. Se for a primeira vez que esse nó falha, esses arquivos são nomeados *`ndb_3_trace.log.1_t1`*, *`ndb_3_trace.log.1_t2`*, *`ndb_3_trace.log.1_t3`* e *`ndb_3_trace.log.1_t4`*. Internamente, esses arquivos de rastreamento seguem o mesmo formato que os arquivos de rastreamento do **ndbd**.

Os códigos de saída e as mensagens do **ndbd** que são gerados quando um processo de nó de dados é desligado prematuramente também são usados pelo **ndbmtd)**). Veja Mensagens de Erro do Nó de Dados, para uma lista dessas.

Nota

É possível usar **ndbd** e **ndbmtd**) simultaneamente em diferentes nós de dados no mesmo NDB Cluster. No entanto, tais configurações não foram testadas extensivamente; portanto, não podemos recomendar fazer isso em um ambiente de produção neste momento.

### 25.5.4 ndb_mgmd — O Daemon do Servidor de Gerenciamento do NDB Cluster

O servidor de gerenciamento é o processo que lê o arquivo de configuração do clúster e distribui essas informações para todos os nós do clúster que o solicitam. Ele também mantém um registro das atividades do clúster. Os clientes de gerenciamento podem se conectar ao servidor de gerenciamento e verificar o status do clúster.

Todas as opções que podem ser usadas com **ndb_mgmd** são mostradas na tabela a seguir. Descrições adicionais seguem a tabela.

**Tabela 25.26 Opções de linha de comando usadas com o programa ndb_mgmd**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th scope="col">Format</th> <th scope="col">Description</th> <th scope="col">Added, Deprecated, or Removed</th> </tr></thead><tbody><tr> <th scope="row"><p> <code class="option"> --bind-address=host </code> </p></th> <td>Endereço de vinculação local</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --character-sets-dir=path </code> </p></th> <td>Directory containing character sets</td> <td><p> REMOVED: 8.0.31 </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --cluster-config-suffix=name </code> </p></th> <td>Supraponha o sufixo do grupo padrão ao ler as seções do cluster_config no arquivo my.cnf; utilizado em testes</td> <td><p>ADICIONADO: 8.0.24</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --config-cache[=TRUE|FALSE] </code> </p></th> <td>Habilitar cache de configuração do servidor de gerenciamento; verdadeiro por padrão</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--config-file=file</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_config-file">-f arquivo</a> </code> </p></th> <td>Especifique o arquivo de configuração do cluster; também especifique --reload ou --initial para substituir o cache de configuração, se estiver presente.</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--configdir=directory</code>,</p><p> <code class="option"> --config-dir=directory </code> </p></th> <td>Especificar o diretório de cache de configuração do servidor de gerenciamento de clúster</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --connect-retries=# </code> </p></th> <td>Número de vezes para tentar a conexão novamente antes de desistir</td> <td><p>REMOvido: 8.0.31</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --connect-retry-delay=# </code> </p></th> <td>Número de segundos para esperar entre as tentativas de contato com o servidor de gerenciamento</td> <td><p>REMOvido: 8.0.31</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--connect-string=connection_string</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_connect-string">-c connection_string</a> </code> </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --core-file </code> </p></th> <td>Escreva o arquivo de núcleo em erro; usado em depuração</td> <td><p>REMOvido: 8.0.31</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--daemon</code>,</p><p> <code class="option"> -d </code> </p></th> <td>Execute ndb_mgmd no modo de daemon (padrão)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --defaults-extra-file=path </code> </p></th> <td>Leia o arquivo fornecido após os arquivos globais terem sido lidos</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --defaults-file=path </code> </p></th> <td>Ler opções padrão a partir do arquivo fornecido apenas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --defaults-group-suffix=string </code> </p></th> <td>Leia também grupos com concat(grupo, sufixo)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--help</code>,</p><p> <code class="option"> -? </code> </p></th> <td>Exibir texto de ajuda e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --initial </code> </p></th> <td>Faz com que o servidor de gerenciamento recarregue os dados de configuração do arquivo de configuração, ignorando o cache de configuração</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --install[=name] </code> </p></th> <td>Usado para instalar o processo do servidor de gerenciamento como serviço do Windows; não se aplica em outras plataformas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --interactive </code> </p></th> <td>Execute ndb_mgmd em modo interativo (não é oficialmente suportado em produção; apenas para fins de teste)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --log-name=name </code> </p></th> <td>Nome a ser usado ao escrever mensagens de registro de cluster que se aplicam a este nó</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --login-path=path </code> </p></th> <td>Leia o caminho fornecido a partir do arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --mycnf </code> </p></th> <td>Leia os dados de configuração do cluster a partir do arquivo my.cnf</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--ndb-connectstring=connection_string</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_ndb-connectstring">-c connection_string</a> </code> </p></th> <td>Defina a string de conexão para se conectar ao ndb_mgmd. Sintaxe: "[nodeid=id;][host=]hostname[:port]". Supere as entradas em NDB_CONNECTSTRING e my.cnf</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--ndb-mgmd-host=connection_string</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_ndb-mgmd-host">-c connection_string</a> </code> </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --ndb-nodeid=# </code> </p></th> <td>Defina o ID do nó para este nó, substituindo qualquer ID definida pela opção --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --ndb-optimized-node-selection </code> </p></th> <td>Ative as otimizações para a seleção de nós para transações. Ativado por padrão; use --skip-ndb-optimized-node-selection para desativá-lo</td> <td><p>REMOvido: 8.0.31</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --no-defaults </code> </p></th> <td>Não leia as opções padrão de qualquer arquivo de opção, exceto o arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --no-nodeid-checks </code> </p></th> <td>Não realize nenhuma verificação de ID de nó</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --nodaemon </code> </p></th> <td>Não execute ndb_mgmd como um daemon</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --nowait-nodes=list </code> </p></th> <td>Não espere por nós de gerenciamento especificados ao iniciar este servidor de gerenciamento; requer a opção --ndb-nodeid</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --print-defaults </code> </p></th> <td>Imprimir a lista de argumentos do programa e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--print-full-config</code>,</p><p> <code class="option"> -P </code> </p></th> <td>Imprimir configuração completa e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --reload </code> </p></th> <td>Faz com que o servidor de gerenciamento compare o arquivo de configuração com o cache de configuração</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --remove[=name] </code> </p></th> <td>Usado para remover o processo do servidor de gerenciamento que foi instalado anteriormente como serviço do Windows, especificando opcionalmente o nome do serviço a ser removido; não se aplica em outras plataformas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --skip-config-file </code> </p></th> <td>Não use o arquivo de configuração</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--usage</code>,</p><p> <code class="option"> -? </code> </p></th> <td>Exibir texto de ajuda e sair; o mesmo que --help</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--verbose</code>,</p><p> <code class="option"> -v </code> </p></th> <td>Escreva informações adicionais para registrar</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--version</code>,</p><p> <code class="option"> -V </code> </p></th> <td>Exibir informações da versão e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody></table>

* `--bind-address=host`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=host</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

Faz com que o servidor de gerenciamento se ligue a uma interface de rede específica (nome de host ou endereço IP). Esta opção não tem valor padrão.

* `--character-sets-dir`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>

Diretório contendo conjuntos de caracteres.

* `cluster-config-suffix`

  <table frame="box" rules="all" summary="Properties for cluster-config-suffix"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--cluster-config-suffix=name</code></td> </tr><tr><th>Introduced</th> <td>8.0.24</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

Supraponha o sufixo padrão do grupo ao ler seções de configuração do cluster em `my.cnf`; utilizado em testes.

* `--config-cache`

  <table frame="box" rules="all" summary="Properties for config-cache"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--config-cache[=TRUE|FALSE]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>TRUE</code></td> </tr></tbody></table>

Esta opção, cujo valor padrão é `1` (ou `TRUE`, ou `ON`), pode ser usada para desabilitar o cache de configuração do servidor de gerenciamento, de modo que ele leia sua configuração a partir de `config.ini` a cada vez que ele é iniciado (consulte Seção 25.4.3, “Arquivos de Configuração do NDB Cluster”). Você pode fazer isso iniciando o processo **ndb_mgmd** com qualquer uma das seguintes opções:

+ `--config-cache=0`
  + `--config-cache=FALSE`
  + `--config-cache=OFF`
  + `--skip-config-cache`

Usar uma das opções listadas acima é eficaz apenas se o servidor de gerenciamento não tiver nenhuma configuração armazenada no momento em que é iniciado. Se o servidor de gerenciamento encontrar quaisquer arquivos de cache de configuração, então a opção `--config-cache` ou a opção `--skip-config-cache` será ignorada. Portanto, para desativar o cache de configuração, a opção deve ser usada *primeiro* quando o servidor de gerenciamento é iniciado. Caso contrário — ou seja, se você deseja desativar o cache de configuração para um servidor de gerenciamento que *já* criou um cache de configuração — você deve parar o servidor de gerenciamento, excluir manualmente quaisquer arquivos de cache de configuração existentes e, em seguida, reiniciar o servidor de gerenciamento com `--skip-config-cache` (ou com `--config-cache` definido igual a 0, `OFF` ou `FALSE`).

Os arquivos de cache de configuração são normalmente criados em um diretório denominado `mysql-cluster` sob o diretório de instalação (a menos que essa localização tenha sido sobrescrita usando a opção `--configdir`). Toda vez que o servidor de gerenciamento atualiza seus dados de configuração, ele escreve um novo arquivo de cache. Os arquivos são nomeados sequencialmente em ordem de criação usando o seguinte formato:

  ```
  ndb_node-id_config.bin.seq-number
  ```

*`node-id`* é o ID do nó do servidor de gerenciamento; *`seq-number`* é um número de sequência, começando com 1. Por exemplo, se o ID do nó do servidor de gerenciamento é 5, então os três primeiros arquivos de cache de configuração seriam, quando criados, nomeados `ndb_5_config.bin.1`, `ndb_5_config.bin.2` e `ndb_5_config.bin.3`.

Se a sua intenção é purgar ou recarregar o cache de configuração sem realmente desabilitar o cache, você deve iniciar o **ndb_mgmd** com uma das opções `--reload` ou `--initial`, em vez de `--skip-config-cache`.

Para reativar o cache de configuração, basta reiniciar o servidor de gerenciamento, mas sem a opção `--config-cache` ou `--skip-config-cache` que foi usada anteriormente para desativar o cache de configuração.

O **ndb_mgmd** não verifica o diretório de configuração (`--configdir`) ou tenta criar um quando o `--skip-config-cache` é usado. (Bug #13428853)

* `--config-file=filename`, `-f filename`

  <table frame="box" rules="all" summary="Properties for config-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--config-file=file</code></td> </tr><tr><th>Disabled by</th> <td><code>skip-config-file</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

Instrua o servidor de gerenciamento sobre qual arquivo deve usar para seu arquivo de configuração. Por padrão, o servidor de gerenciamento procura um arquivo chamado `config.ini` no mesmo diretório que o executável **ndb_mgmd**. Caso contrário, o nome e a localização do arquivo devem ser especificados explicitamente.

Esta opção não tem um valor padrão e é ignorada, a menos que o servidor de gerenciamento seja forçado a ler o arquivo de configuração, seja porque o **ndb_mgmd** foi iniciado com a opção `--reload` ou `--initial`, ou porque o servidor de gerenciamento não conseguiu encontrar nenhum cache de configuração. A partir do NDB 8.0.26, o **ndb_mgmd** se recusa a iniciar se `--config-file` for especificado sem nenhuma das opções `--initial` ou `--reload`.

A opção `--config-file` também é lida se o **ndb_mgmd** foi iniciado com `--config-cache=OFF`. Consulte a Seção 25.4.3, “Arquivos de Configuração do Clúster NDB”, para obter mais informações.

* `--configdir=dir_name`

  <table frame="box" rules="all" summary="Properties for configdir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><p class="valid-value"><code>--configdir=directory</code></p><p class="valid-value"><code>--config-dir=directory</code></p></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>$INSTALLDIR/mysql-cluster</code></td> </tr></tbody></table>

Especifica o diretório de cache de configuração do servidor de gerenciamento de clúster. `--config-dir` é um alias para esta opção.

Em NDB 8.0.27 e versões posteriores, isso deve ser um caminho absoluto. Caso contrário, o servidor de gerenciamento se recusa a iniciar.

* `--connect-retries`

  <table frame="box" rules="all" summary="Properties for connect-retries"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>12</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>12</code></td> </tr></tbody></table>

Número de vezes para tentar a conexão novamente antes de desistir.

* `--connect-retry-delay`

  <table frame="box" rules="all" summary="Properties for connect-retry-delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retry-delay=#</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>5</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>5</code></td> </tr></tbody></table>

Número de segundos para esperar entre as tentativas de contato com o servidor de gerenciamento.

* `--connect-string`

  <table frame="box" rules="all" summary="Properties for connect-string"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-string=connection_string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

O mesmo que --ndb-connectstring.

* `--core-file`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=host</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>0

Escreva o arquivo de núcleo em erro; usado em depuração.

* `--daemon`, `-d`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=host</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>1

Instrua o **ndb_mgmd** a iniciar como um processo de daemon. Esse é o comportamento padrão.

Esta opção não tem efeito quando se executa **ndb_mgmd** em plataformas Windows.

* `--defaults-extra-file`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=host</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>2

Leia o arquivo fornecido após a leitura dos arquivos globais.

* `--defaults-file`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=host</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>3

Leia as opções padrão a partir do arquivo fornecido apenas.

* `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=host</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>4

Leia também grupos com concatenação(grupo, sufixo).

* `--help`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=host</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>5

Exibir texto de ajuda e sair.

* `--initial`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=host</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>6

Os dados de configuração são armazenados em cache internamente, em vez de serem lidos do arquivo de configuração global do clúster a cada vez que o servidor de gerenciamento é iniciado (consulte a Seção 25.4.3, "Arquivos de configuração do clúster NDB"). O uso da opção `--initial` sobrepõe esse comportamento, forçando o servidor de gerenciamento a excluir quaisquer arquivos de cache existentes e, em seguida, a reler os dados de configuração do arquivo de configuração do clúster e a construir um novo cache.

Isso difere de duas maneiras da opção `--reload`. Primeiro, `--reload` obriga o servidor a verificar o arquivo de configuração contra o cache e recarregar seus dados apenas se o conteúdo do arquivo for diferente do cache. Segundo, `--reload` não exclui nenhum arquivo de cache existente.

Se o **ndb_mgmd** for invocado com `--initial`, mas não for possível encontrar um arquivo de configuração global, o servidor de gerenciamento não poderá ser iniciado.

Quando um servidor de gerenciamento é iniciado, ele verifica se há outro servidor de gerenciamento no mesmo NDB Cluster e tenta usar os dados de configuração do outro servidor de gerenciamento. Esse comportamento tem implicações ao realizar um reinício contínuo de um NDB Cluster com vários nós de gerenciamento. Consulte a Seção 25.6.5, “Realizando um Reinício Contínuo de um NDB Cluster”, para obter mais informações.

Quando usado juntamente com a opção `--config-file`, o cache é limpo apenas se o arquivo de configuração for encontrado.

* `--install[=name]`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=host</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>7

Faça com que **ndb_mgmd** seja instalado como um serviço do Windows. Opcionalmente, você pode especificar um nome para o serviço; se não for definido, o nome do serviço será `ndb_mgmd`. Embora seja preferível especificar outras opções do programa **ndb_mgmd** em um arquivo de configuração `my.ini` ou `my.cnf`, é possível usá-las juntamente com `--install`. No entanto, nesses casos, a opção `--install` deve ser especificada primeiro, antes de quaisquer outras opções serem dadas, para que a instalação do serviço do Windows seja bem-sucedida.

Geralmente, não é aconselhável usar esta opção juntamente com a opção `--initial`, pois isso faz com que o cache de configuração seja apagado e reconstruído toda vez que o serviço é parado e iniciado. Também é necessário ter cuidado se você pretende usar outras opções de **ndb_mgmd** que afetam o início do servidor de gerenciamento, e você deve ter certeza absoluta de que entende e permite todas as possíveis consequências de fazer isso.

A opção `--install` não tem efeito em plataformas que não são do Windows.

* `--interactive`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=host</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>8

Começa o **ndb_mgmd** no modo interativo; ou seja, uma sessão do cliente **ndb_mgm** é iniciada assim que o servidor de gerenciamento estiver em execução. Esta opção não inicia nenhum outro nó do NDB Cluster.

* `--log-name=name`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=host</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>9

Fornece um nome a ser usado para este nó no log do clúster.

* `--login-path`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>0

Leia o caminho fornecido a partir do arquivo de login.

* `--mycnf`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>1

Leia os dados de configuração do arquivo `my.cnf`.

* `--ndb-connectstring`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>2

Defina a cadeia de conexão. Sintaxe: `[nodeid=id;][host=]hostname[:port]`. Oprime as entradas em `NDB_CONNECTSTRING` e `my.cnf`. Ignorado se `--config-file` for especificado; a partir do NDB 8.0.27, um aviso é emitido quando ambas as opções são usadas.

* `--ndb-mgmd-host`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>3

O mesmo que --ndb-connectstring.

* `--ndb-nodeid`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>4

Defina o ID do nó para este nó, substituindo qualquer ID definida pela opção --ndb-connectstring.

* `--ndb-optimized-node-selection`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>5

Ative as otimizações para a seleção de nós para transações. Ativado por padrão; use `--skip-ndb-optimized-node-selection` para desativá-lo.

* `--no-nodeid-checks`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>6

Não realize nenhuma verificação dos IDs dos nós.

* `--nodaemon`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>7

Instrua o **ndb_mgmd** a não iniciar como um processo de daemon.

O comportamento padrão para **ndb_mgmd** no Windows é executar em plano de fundo, o que torna essa opção desnecessária nas plataformas do Windows.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>8

Não leia as opções padrão de qualquer arquivo de opção, exceto o arquivo de login.

* `--nowait-nodes`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>9

Ao iniciar um NDB Cluster, ele é configurado com dois nós de gerenciamento, cada servidor de gerenciamento normalmente verifica se o outro **ndb_mgmd** também está operacional e se a configuração do outro servidor de gerenciamento é idêntica à sua própria. No entanto, às vezes é desejável iniciar o cluster com apenas um nó de gerenciamento (e talvez permitir que o outro **ndb_mgmd** seja iniciado mais tarde). Esta opção faz com que o nó de gerenciamento ignore quaisquer verificações para quaisquer outros nós de gerenciamento cujos IDs de nó são passados para esta opção, permitindo que o cluster seja iniciado como se estivesse configurado para usar apenas o nó de gerenciamento que foi iniciado.

Para fins ilustrativos, considere a seguinte porção de um arquivo `config.ini` (onde omitimos a maioria dos parâmetros de configuração que não são relevantes para este exemplo):

  ```
  [ndbd]
  NodeId = 1
  HostName = 198.51.100.101

  [ndbd]
  NodeId = 2
  HostName = 198.51.100.102

  [ndbd]
  NodeId = 3
  HostName = 198.51.100.103

  [ndbd]
  NodeId = 4
  HostName = 198.51.100.104

  [ndb_mgmd]
  NodeId = 10
  HostName = 198.51.100.150

  [ndb_mgmd]
  NodeId = 11
  HostName = 198.51.100.151

  [api]
  NodeId = 20
  HostName = 198.51.100.200

  [api]
  NodeId = 21
  HostName = 198.51.100.201
  ```

Suponha que você queira iniciar este clúster usando apenas o servidor de gerenciamento com o ID de nó `10` e executando no host com o endereço IP 198.51.100.150. (Suponha, por exemplo, que o computador no qual você pretende o outro servidor de gerenciamento esteja temporariamente indisponível devido a uma falha de hardware, e você está esperando para que ele seja reparado.) Para iniciar o clúster dessa maneira, use uma linha de comando na máquina em 198.51.100.150 para inserir o seguinte comando:

  ```
  $> ndb_mgmd --ndb-nodeid=10 --nowait-nodes=11
  ```

Como mostrado no exemplo anterior, ao usar `--nowait-nodes`, você também deve usar a opção `--ndb-nodeid` para especificar o ID do nó deste processo **ndb_mgmd**.

Você pode, então, iniciar cada um dos nós de dados do clúster da maneira usual. Se você deseja iniciar e usar o segundo servidor de gerenciamento, além do primeiro servidor de gerenciamento, em um momento posterior, sem reiniciar os nós de dados, você deve iniciar cada nó de dados com uma cadeia de conexão que faça referência a ambos os servidores de gerenciamento, como este:

  ```
  $> ndbd -c 198.51.100.150,198.51.100.151
  ```

O mesmo vale para a cadeia de conexão usada com quaisquer processos **mysqld** que você deseja iniciar como nós SQL do NDB Cluster conectados a este clúster. Consulte a Seção 25.4.3.3, “Cadeias de conexão do NDB Cluster”, para obter mais informações.

Quando usado com **ndb_mgmd**, esta opção afeta o comportamento do nó de gerenciamento em relação apenas a outros nós de gerenciamento. Não confunda com a opção `--nowait-nodes` usada com **ndbd** ou **ndbmtd**") para permitir que um clúster comece com menos do que seu complemento completo de nós de dados; quando usado com nós de dados, esta opção afeta apenas seu comportamento em relação a outros nós de dados.

Pode-se passar vários IDs de nó de gerenciamento para esta opção como uma lista separada por vírgula. Cada ID de nó deve ser no mínimo 1 e no máximo 255. Na prática, é bastante raro usar mais de dois servidores de gerenciamento para o mesmo NDB Cluster (ou ter qualquer necessidade de fazê-lo); na maioria dos casos, você precisa passar para esta opção apenas o único ID de nó para o único servidor de gerenciamento que você não deseja usar ao iniciar o cluster.

Nota

Quando você iniciar o servidor de gerenciamento "falta" mais tarde, sua configuração deve corresponder à do servidor de gerenciamento que já está sendo usado pelo clúster. Caso contrário, ele falha na verificação de configuração realizada pelo servidor de gerenciamento existente e não inicia.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for cluster-config-suffix"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--cluster-config-suffix=name</code></td> </tr><tr><th>Introduced</th> <td>8.0.24</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>0

Imprimir a lista de argumentos do programa e sair.

* `--print-full-config`, `-P`

  <table frame="box" rules="all" summary="Properties for cluster-config-suffix"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--cluster-config-suffix=name</code></td> </tr><tr><th>Introduced</th> <td>8.0.24</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>1

Mostra informações extensas sobre a configuração do clúster. Com esta opção na linha de comando, o processo **ndb_mgmd** imprime informações sobre a configuração do clúster, incluindo uma extensa lista das seções de configuração do clúster, bem como os parâmetros e seus valores. Normalmente usado em conjunto com a opção `--config-file` (`-f`).

* `--reload`

  <table frame="box" rules="all" summary="Properties for cluster-config-suffix"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--cluster-config-suffix=name</code></td> </tr><tr><th>Introduced</th> <td>8.0.24</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>2

Os dados de configuração do NDBC são armazenados internamente e não são lidos do arquivo de configuração global do cluster a cada vez que o servidor de gerenciamento é iniciado (consulte a Seção 25.4.3, "Arquivos de configuração do NDBC Cluster"). O uso dessa opção obriga o servidor de gerenciamento a verificar seu armazenamento de dados interno contra o arquivo de configuração do cluster e a recarregar a configuração se encontrar que o arquivo de configuração não corresponde ao cache. Os arquivos de cache de configuração existentes são preservados, mas não utilizados.

Isso difere de duas maneiras da opção `--initial`. Primeiro, `--initial` faz com que todos os arquivos de cache sejam excluídos. Em segundo lugar, `--initial` obriga o servidor de gerenciamento a reler o arquivo de configuração global e construir um novo cache.

Se o servidor de gerenciamento não conseguir encontrar um arquivo de configuração global, então a opção `--reload` é ignorada.

Quando o `--reload` é usado, o servidor de gerenciamento deve ser capaz de se comunicar com os nós de dados e qualquer outro servidor de gerenciamento no clúster antes de tentar ler o arquivo de configuração global; caso contrário, o servidor de gerenciamento não consegue iniciar. Isso pode acontecer devido a mudanças no ambiente de rede, como novos endereços IP para os nós ou uma alteração na configuração do firewall. Nesses casos, você deve usar o `--initial` em vez disso para forçar a descarte e recarregar a configuração cache existente do arquivo. Consulte a Seção 25.6.5, “Realizando um Reinício Rotativo de um Clúster NDB”, para obter informações adicionais.

* `--remove[=name]`

  <table frame="box" rules="all" summary="Properties for cluster-config-suffix"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--cluster-config-suffix=name</code></td> </tr><tr><th>Introduced</th> <td>8.0.24</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>3

Remova um processo do servidor de gerenciamento que foi instalado como um serviço do Windows, especificando opcionalmente o nome do serviço a ser removido. Aplica-se apenas a plataformas Windows.

* `--skip-config-file`

  <table frame="box" rules="all" summary="Properties for cluster-config-suffix"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--cluster-config-suffix=name</code></td> </tr><tr><th>Introduced</th> <td>8.0.24</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>4

Não leia o arquivo de configuração do grupo; ignore as opções `--initial` e `--reload`, se especificadas.

* `--usage`

  <table frame="box" rules="all" summary="Properties for cluster-config-suffix"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--cluster-config-suffix=name</code></td> </tr><tr><th>Introduced</th> <td>8.0.24</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>5

Exibir texto de ajuda e sair; o mesmo que --help.

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Properties for cluster-config-suffix"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--cluster-config-suffix=name</code></td> </tr><tr><th>Introduced</th> <td>8.0.24</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>6

Remova um processo do servidor de gerenciamento que foi instalado como um serviço do Windows, especificando opcionalmente o nome do serviço a ser removido. Aplica-se apenas a plataformas Windows.

* `--version`

  <table frame="box" rules="all" summary="Properties for cluster-config-suffix"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--cluster-config-suffix=name</code></td> </tr><tr><th>Introduced</th> <td>8.0.24</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>7

Exibir informações da versão e sair.

Não é estritamente necessário especificar uma cadeia de conexão ao iniciar o servidor de gerenciamento. No entanto, se você estiver usando mais de um servidor de gerenciamento, uma cadeia de conexão deve ser fornecida e cada nó no clúster deve especificar explicitamente seu ID de nó.

Consulte a Seção 25.4.3.3, “Strings de Conexão de Agrupamento NDB”, para obter informações sobre o uso de strings de conexão. A Seção 25.5.4, “ndb_mgmd — O Daemon do Servidor de Gerenciamento do Agrupamento NDB”, descreve outras opções para **ndb_mgmd**.

Os seguintes arquivos são criados ou utilizados pelo **ndb_mgmd** em seu diretório inicial e são colocados no `DataDir` conforme especificado no arquivo de configuração `config.ini`. Na lista a seguir, *`node_id`* é o identificador de nó único.

* `config.ini` é o arquivo de configuração para o clúster como um todo. Este arquivo é criado pelo usuário e lido pelo servidor de gerenciamento. A Seção 25.4, “Configuração do NDB Cluster”, discute como configurar este arquivo.

* `ndb_node_id_cluster.log` é o arquivo de registro de eventos de clúster. Exemplos desses eventos incluem o início e término de verificação de ponto, eventos de inicialização de nós, falhas de nós e níveis de uso de memória. Uma lista completa de eventos de clúster com descrições pode ser encontrada na Seção 25.6, “Gestão do NDB Cluster”.

Por padrão, quando o tamanho do log do clúster atinge um milhão de bytes, o arquivo é renomeado para `ndb_node_id_cluster.log.seq_id`, onde *`seq_id`* é o número de sequência do arquivo do log do clúster. (Por exemplo: Se os arquivos com os números de sequência 1, 2 e 3 já existirem, o próximo arquivo de log é nomeado usando o número `4`. Você pode alterar o tamanho e o número de arquivos, e outras características do log do clúster, usando o parâmetro de configuração `LogDestination`.

* `ndb_node_id_out.log` é o arquivo utilizado para `stdout` e `stderr` ao executar o servidor de gerenciamento como um daemon.

* `ndb_node_id.pid` é o arquivo de ID de processo usado ao executar o servidor de gerenciamento como um daemon.

### 25.5.5 ndb_mgm — O cliente de gerenciamento de cluster NDB

O processo do cliente de gerenciamento **ndb_mgm** na verdade não é necessário para executar o clúster. Seu valor reside em fornecer um conjunto de comandos para verificar o status do clúster, iniciar backups e realizar outras funções administrativas. O cliente de gerenciamento acessa o servidor de gerenciamento usando uma API C. Usuários avançados também podem empregar essa API para programar processos de gerenciamento dedicados para realizar tarefas semelhantes às executadas pelo **ndb_mgm**.

Para iniciar o cliente de gerenciamento, é necessário fornecer o nome do host e o número do port do servidor de gerenciamento:

```
$> ndb_mgm [host_name [port_num]]
```

Por exemplo:

```
$> ndb_mgm ndb_mgmd.mysql.com 1186
```

O nome de host padrão e o número de porta são `localhost`, respectivamente, e 1186.

Todas as opções que podem ser usadas com **ndb_mgm** são mostradas na tabela a seguir. Descrições adicionais seguem a tabela.

**Tabela 25.27 Opções de linha de comando usadas com o programa ndb_mgm**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th scope="col">Format</th> <th scope="col">Description</th> <th scope="col">Added, Deprecated, or Removed</th> </tr></thead><tbody><tr> <th scope="row"><p> <code class="option"> --backup-password-from-stdin </code> </p></th> <td>Obtenha a senha de descriptografia de forma segura a partir de STDIN; use junto com a opção --execute e o comando ndb_mgm START BACKUP</td> <td><p>ADICIONADO: NDB 8.0.24</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --character-sets-dir=path </code> </p></th> <td>Directory containing character sets</td> <td><p> REMOVED: 8.0.31 </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --connect-retries=# </code> </p></th> <td>Defina o número de vezes para tentar a conexão novamente antes de desistir; 0 significa apenas uma tentativa (e nenhuma tentativa adicional)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --connect-retry-delay=# </code> </p></th> <td>Número de segundos para esperar entre as tentativas de contato com o servidor de gerenciamento</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--connect-string=connection_string</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_connect-string">-c connection_string</a> </code> </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --core-file </code> </p></th> <td>Escreva o arquivo de núcleo em erro; usado em depuração</td> <td><p>REMOvido: 8.0.31</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --defaults-extra-file=path </code> </p></th> <td>Leia o arquivo fornecido após os arquivos globais terem sido lidos</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --defaults-file=path </code> </p></th> <td>Ler opções padrão a partir do arquivo fornecido apenas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --defaults-group-suffix=string </code> </p></th> <td>Leia também grupos com concat(grupo, sufixo)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --encrypt-backup </code> </p></th> <td>Faça com que o BACKUP COMEÇE A ENCRISPR quando faça um backup, solicitando uma senha se não for fornecida pelo usuário</td> <td><p>ADICIONADO: NDB 8.0.24</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--execute=command</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_execute">-e comando</a> </code> </p></th> <td>Execute o comando e saia</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--help</code>,</p><p> <code class="option"> -? </code> </p></th> <td>Exibir texto de ajuda e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --login-path=path </code> </p></th> <td>Leia o caminho fornecido a partir do arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--ndb-connectstring=connection_string</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_ndb-connectstring">-c connection_string</a> </code> </p></th> <td>Defina a string de conexão para se conectar ao ndb_mgmd. Sintaxe: "[nodeid=id;][host=]hostname[:port]". Supere as entradas em NDB_CONNECTSTRING e my.cnf</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--ndb-mgmd-host=connection_string</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_ndb-mgmd-host">-c connection_string</a> </code> </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --ndb-nodeid=# </code> </p></th> <td>Defina o ID do nó para este nó, substituindo qualquer ID definida pela opção --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --ndb-optimized-node-selection </code> </p></th> <td>Ative as otimizações para a seleção de nós para transações. Ativado por padrão; use --skip-ndb-optimized-node-selection para desativá-lo</td> <td><p>REMOvido: 8.0.31</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --no-defaults </code> </p></th> <td>Não leia as opções padrão de qualquer arquivo de opção, exceto o arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --print-defaults </code> </p></th> <td>Imprimir a lista de argumentos do programa e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--try-reconnect=#</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_try-reconnect">-t #</a> </code> </p></th> <td>Número de vezes para tentar a conexão novamente antes de desistir; sinônimo de --connect-retries</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--usage</code>,</p><p> <code class="option"> -? </code> </p></th> <td>Exibir texto de ajuda e sair; o mesmo que --help</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--version</code>,</p><p> <code class="option"> -V </code> </p></th> <td>Exibir informações da versão e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody></table>

* `--backup-password-from-stdin[=TRUE|FALSE]`

  <table frame="box" rules="all" summary="Properties for backup-password-from-stdin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backup-password-from-stdin</code></td> </tr><tr><th>Introduced</th> <td>8.0.24-ndb-8.0.24</td> </tr></tbody></table>

Essa opção permite a entrada da senha de backup do shell do sistema (`stdin`) ao usar `--execute "START BACKUP"` ou similar para criar um backup. O uso dessa opção também requer o uso de `--execute`.

* `--character-sets-dir`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>

Diretório contendo conjuntos de caracteres.

* `--connect-retries=#`

  <table frame="box" rules="all" summary="Properties for connect-retries"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>3</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>

Esta opção especifica o número de vezes que se segue à primeira tentativa de refazer uma conexão antes de desistir (o cliente sempre tenta a conexão pelo menos uma vez). O tempo de espera por tentativa é definido usando `--connect-retry-delay`.

Esta opção é sinônimo da opção `--try-reconnect`, que já foi descontinuada.

* `--connect-retry-delay`

  <table frame="box" rules="all" summary="Properties for connect-retry-delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retry-delay=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>5</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>5</code></td> </tr></tbody></table>

Número de segundos para esperar entre as tentativas de contato com o servidor de gerenciamento.

* `--connect-string`

  <table frame="box" rules="all" summary="Properties for connect-string"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-string=connection_string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

O mesmo que `--ndb-connectstring`.

* `--core-file`

  <table frame="box" rules="all" summary="Properties for core-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--core-file</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>

Escreva o arquivo de núcleo em erro; usado em depuração.

* `--defaults-extra-file`

  <table frame="box" rules="all" summary="Properties for defaults-extra-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-extra-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

Leia o arquivo fornecido após a leitura dos arquivos globais.

* `--defaults-file`

  <table frame="box" rules="all" summary="Properties for defaults-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

Leia as opções padrão a partir do arquivo fornecido apenas.

* `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Properties for defaults-group-suffix"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-group-suffix=string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

Leia também grupos com concatenação(grupo, sufixo).

* `--encrypt-backup`

  <table frame="box" rules="all" summary="Properties for backup-password-from-stdin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backup-password-from-stdin</code></td> </tr><tr><th>Introduced</th> <td>8.0.24-ndb-8.0.24</td> </tr></tbody></table>0

Quando usada, esta opção faz com que todos os backups sejam criptografados. Para que isso aconteça sempre que o **ndb_mgm** for executado, coloque a opção na seção `[ndb_mgm]` do arquivo `my.cnf`.

* `--execute=command`, `-e command`

  <table frame="box" rules="all" summary="Properties for backup-password-from-stdin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backup-password-from-stdin</code></td> </tr><tr><th>Introduced</th> <td>8.0.24-ndb-8.0.24</td> </tr></tbody></table>1

Essa opção pode ser usada para enviar um comando ao cliente de gerenciamento do NDB Cluster a partir do shell do sistema. Por exemplo, qualquer um dos seguintes é equivalente à execução de `SHOW` no cliente de gerenciamento:

  ```
  $> ndb_mgm -e "SHOW"

  $> ndb_mgm --execute="SHOW"
  ```

Isso é análogo ao funcionamento da opção `--execute` ou `-e` com o cliente de linha de comando **mysql**. Veja a Seção 6.2.2.1, “Usando opções na linha de comando”.

Nota

Se o comando do cliente de gerenciamento a ser passado usando esta opção contiver caracteres de espaço, então o comando *deve* ser fechado entre aspas. Pode-se usar aspas simples ou duplas. Se o comando do cliente de gerenciamento não contiver caracteres de espaço, as aspas são opcionais.

* `--help`

  <table frame="box" rules="all" summary="Properties for backup-password-from-stdin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backup-password-from-stdin</code></td> </tr><tr><th>Introduced</th> <td>8.0.24-ndb-8.0.24</td> </tr></tbody></table>2

Exibir texto de ajuda e sair.

* `--login-path`

  <table frame="box" rules="all" summary="Properties for backup-password-from-stdin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backup-password-from-stdin</code></td> </tr><tr><th>Introduced</th> <td>8.0.24-ndb-8.0.24</td> </tr></tbody></table>3

Leia o caminho fornecido a partir do arquivo de login.

* `--ndb-connectstring`

  <table frame="box" rules="all" summary="Properties for backup-password-from-stdin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backup-password-from-stdin</code></td> </tr><tr><th>Introduced</th> <td>8.0.24-ndb-8.0.24</td> </tr></tbody></table>4

Defina a string de conexão para se conectar ao **ndb_mgmd**. Sintaxe: [`nodeid=id;`][`host=`]`hostname`[`:port`]. Supere as entradas em `NDB_CONNECTSTRING` e `my.cnf`.

* `--ndb-nodeid`

  <table frame="box" rules="all" summary="Properties for backup-password-from-stdin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backup-password-from-stdin</code></td> </tr><tr><th>Introduced</th> <td>8.0.24-ndb-8.0.24</td> </tr></tbody></table>5

Defina o ID do nó para este nó, substituindo qualquer ID definida por `--ndb-connectstring`.

* `--ndb-mgmd-host`

  <table frame="box" rules="all" summary="Properties for backup-password-from-stdin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backup-password-from-stdin</code></td> </tr><tr><th>Introduced</th> <td>8.0.24-ndb-8.0.24</td> </tr></tbody></table>6

O mesmo que `--ndb-connectstring`.

* `--ndb-optimized-node-selection`

  <table frame="box" rules="all" summary="Properties for backup-password-from-stdin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backup-password-from-stdin</code></td> </tr><tr><th>Introduced</th> <td>8.0.24-ndb-8.0.24</td> </tr></tbody></table>7

Ative as otimizações para a seleção de nós para transações. Ativado por padrão; use `--skip-ndb-optimized-node-selection` para desativá-lo.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for backup-password-from-stdin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backup-password-from-stdin</code></td> </tr><tr><th>Introduced</th> <td>8.0.24-ndb-8.0.24</td> </tr></tbody></table>8

Não leia as opções padrão de qualquer arquivo de opção, exceto o arquivo de login.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for backup-password-from-stdin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backup-password-from-stdin</code></td> </tr><tr><th>Introduced</th> <td>8.0.24-ndb-8.0.24</td> </tr></tbody></table>9

Imprimir a lista de argumentos do programa e sair.

* `--try-reconnect=number`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>0

Se a conexão com o servidor de gerenciamento for interrompida, o nó tenta reconectar-se a ele a cada 5 segundos até que consiga. Ao usar esta opção, é possível limitar o número de tentativas a *`number`* antes de desistir e relatar um erro em vez disso.

Essa opção é desatualizada e está sujeita à remoção em uma versão futura. Use `--connect-retries`, em vez disso.

* `--usage`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>1

Exibir texto de ajuda e sair; o mesmo que `--help`.

* `--version`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>2

Exibir informações da versão e sair.

Informações adicionais sobre o uso do **ndb_mgm** podem ser encontradas na Seção 25.6.1, “Comandos no Cliente de Gerenciamento de NDB Cluster”.

### 25.5.6 ndb_blob_tool — Verificar e reparar colunas BLOB e TEXT de tabelas de NDB Cluster

Essa ferramenta pode ser usada para verificar e remover partes de coluna BLOB órfãs das tabelas `NDB`, além de gerar um arquivo que lista todas as partes órfãs. Às vezes, é útil para diagnosticar e reparar tabelas `NDB` corrompidas ou danificadas que contêm colunas `BLOB` ou `TEXT`.

A sintaxe básica para o **ndb_blob_tool** é mostrada aqui:

```
ndb_blob_tool [options] table [column, ...]
```

A menos que você use a opção `--help`, você deve especificar uma ação a ser realizada, incluindo uma ou mais das opções `--check-orphans`, `--delete-orphans` ou `--dump-file`. Essas opções fazem com que o **ndb_blob_tool** verifique partes de BLOB órfãs, remova quaisquer partes de BLOB órfãs e gere um arquivo de depuração listando as partes de BLOB órfãs, respectivamente, e são descritas com mais detalhes mais adiante nesta seção.

Você também deve especificar o nome de uma tabela ao invocar o **ndb_blob_tool**. Além disso, você pode, opcionalmente, seguir o nome da tabela com os nomes (separados por vírgula) de uma ou mais colunas `BLOB` ou `TEXT` dessa tabela. Se nenhuma coluna estiver listada, a ferramenta trabalha em todas as colunas `BLOB` e `TEXT` da tabela. Se você precisar especificar um banco de dados, use a opção `--database` (`-d`).

A opção `--verbose` fornece informações adicionais no resultado sobre o progresso da ferramenta.

Todas as opções que podem ser usadas com **ndb_mgmd** são mostradas na tabela a seguir. Descrições adicionais seguem a tabela.

**Tabela 25.28 Opções de linha de comando usadas com o programa ndb_blob_tool**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th scope="col">Format</th> <th scope="col">Description</th> <th scope="col">Added, Deprecated, or Removed</th> </tr></thead><tbody><tr> <th scope="row"><p> <code class="option"> --add-missing </code> </p></th> <td>Escreva partes de blob fictícias para substituir as que estão faltando</td> <td><p>ADICIONADO: NDB 8.0.20</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --character-sets-dir=path </code> </p></th> <td>Directory containing character sets</td> <td><p> REMOVED: 8.0.31 </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --check-missing </code> </p></th> <td>Verifique se há blocos com partes em linha, mas faltando uma ou mais partes da tabela de partes</td> <td><p>ADICIONADO: NDB 8.0.20</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --check-orphans </code> </p></th> <td>Verifique se há partes blob sem partes correspondentes em linha</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --connect-retries=# </code> </p></th> <td>Número de vezes para tentar a conexão novamente antes de desistir</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --connect-retry-delay=# </code> </p></th> <td>Número de segundos para esperar entre as tentativas de contato com o servidor de gerenciamento</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--connect-string=connection_string</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_connect-string">-c connection_string</a> </code> </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --core-file </code> </p></th> <td>Escreva o arquivo de núcleo em erro; usado em depuração</td> <td><p>REMOvido: 8.0.31</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--database=name</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_database">-d nome</a> </code> </p></th> <td>Banco de dados para encontrar a tabela em</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --defaults-extra-file=path </code> </p></th> <td>Leia o arquivo fornecido após os arquivos globais terem sido lidos</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --defaults-file=path </code> </p></th> <td>Ler opções padrão a partir do arquivo fornecido apenas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --defaults-group-suffix=string </code> </p></th> <td>Leia também grupos com concat(grupo, sufixo)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --delete-orphans </code> </p></th> <td>Excluir partes de blob que não têm partes correspondentes em linha</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --dump-file=file </code> </p></th> <td>Escreva chaves órfãs no arquivo especificado</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--help</code>,</p><p> <code class="option"> -? </code> </p></th> <td>Exibir texto de ajuda e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --login-path=path </code> </p></th> <td>Leia o caminho fornecido a partir do arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--ndb-connectstring=connection_string</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_ndb-connectstring">-c connection_string</a> </code> </p></th> <td>Defina a string de conexão para se conectar ao ndb_mgmd. Sintaxe: "[nodeid=id;][host=]hostname[:port]". Supere as entradas em NDB_CONNECTSTRING e my.cnf</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--ndb-mgmd-host=connection_string</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_ndb-mgmd-host">-c connection_string</a> </code> </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --ndb-nodeid=# </code> </p></th> <td>Defina o ID do nó para este nó, substituindo qualquer ID definida pela opção --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --ndb-optimized-node-selection </code> </p></th> <td>Ative as otimizações para a seleção de nós para transações. Ativado por padrão; use --skip-ndb-optimized-node-selection para desativá-lo</td> <td><p>REMOvido: 8.0.31</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --no-defaults </code> </p></th> <td>Não leia as opções padrão de qualquer arquivo de opção, exceto o arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --print-defaults </code> </p></th> <td>Imprimir a lista de argumentos do programa e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--usage</code>,</p><p> <code class="option"> -? </code> </p></th> <td>Exibir texto de ajuda e sair; o mesmo que --help</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--verbose</code>,</p><p> <code class="option"> -v </code> </p></th> <td>Saída verbose</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--version</code>,</p><p> <code class="option"> -V </code> </p></th> <td>Exibir informações da versão e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody></table>

* `--add-missing`

  <table frame="box" rules="all" summary="Properties for add-missing"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-missing</code></td> </tr><tr><th>Introduced</th> <td>8.0.20-ndb-8.0.20</td> </tr></tbody></table>

Para cada parte em linha em tabelas do NDB Cluster que não tenha uma parte correspondente BLOB, escreva uma parte BLOB fictícia do comprimento necessário, composta por espaços.

* `--character-sets-dir`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>

Diretório contendo conjuntos de caracteres.

* `--check-missing`

  <table frame="box" rules="all" summary="Properties for check-missing"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--check-missing</code></td> </tr><tr><th>Introduced</th> <td>8.0.20-ndb-8.0.20</td> </tr></tbody></table>

Verifique se há partes em linha em tabelas do NDB Cluster que não possuem partes correspondentes de BLOB.

* `--check-orphans`

  <table frame="box" rules="all" summary="Properties for check-orphans"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--check-orphans</code></td> </tr></tbody></table>

Verifique se há partes BLOB nas tabelas do NDB Cluster que não têm partes correspondentes em linha.

* `--connect-retries`

  <table frame="box" rules="all" summary="Properties for connect-retries"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>12</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>12</code></td> </tr></tbody></table>

Número de vezes para tentar a conexão novamente antes de desistir.

* `--connect-retry-delay`

  <table frame="box" rules="all" summary="Properties for connect-retry-delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retry-delay=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>5</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>5</code></td> </tr></tbody></table>

Número de segundos para esperar entre as tentativas de contato com o servidor de gerenciamento.

* `--connect-string`

  <table frame="box" rules="all" summary="Properties for connect-string"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-string=connection_string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

O mesmo que `--ndb-connectstring`.

* `--core-file`

  <table frame="box" rules="all" summary="Properties for core-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--core-file</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>

Escreva o arquivo de núcleo em erro; usado em depuração.

* `--database=db_name`, `-d`

  <table frame="box" rules="all" summary="Properties for database"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--database=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

Especifique o banco de dados para encontrar a tabela.

* `--defaults-extra-file`

  <table frame="box" rules="all" summary="Properties for add-missing"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-missing</code></td> </tr><tr><th>Introduced</th> <td>8.0.20-ndb-8.0.20</td> </tr></tbody></table>0

Leia o arquivo fornecido após a leitura dos arquivos globais.

* `--defaults-file`

  <table frame="box" rules="all" summary="Properties for add-missing"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-missing</code></td> </tr><tr><th>Introduced</th> <td>8.0.20-ndb-8.0.20</td> </tr></tbody></table>1

Leia as opções padrão a partir do arquivo fornecido apenas.

* `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Properties for add-missing"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-missing</code></td> </tr><tr><th>Introduced</th> <td>8.0.20-ndb-8.0.20</td> </tr></tbody></table>2

Leia também grupos com concatenação(grupo, sufixo).

* `--delete-orphans`

  <table frame="box" rules="all" summary="Properties for add-missing"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-missing</code></td> </tr><tr><th>Introduced</th> <td>8.0.20-ndb-8.0.20</td> </tr></tbody></table>3

Remova partes BLOB das tabelas do NDB Cluster que não possuem partes correspondentes em linha.

* `--dump-file=file`

  <table frame="box" rules="all" summary="Properties for add-missing"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-missing</code></td> </tr><tr><th>Introduced</th> <td>8.0.20-ndb-8.0.20</td> </tr></tbody></table>4

Escreve uma lista de partes de coluna BLOB órfã em *`file`*. As informações escritas no arquivo incluem a chave da tabela e o número da parte BLOB para cada parte de BLOB órfã.

* `--help`

  <table frame="box" rules="all" summary="Properties for add-missing"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-missing</code></td> </tr><tr><th>Introduced</th> <td>8.0.20-ndb-8.0.20</td> </tr></tbody></table>5

Exibir texto de ajuda e sair.

* `--login-path`

  <table frame="box" rules="all" summary="Properties for add-missing"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-missing</code></td> </tr><tr><th>Introduced</th> <td>8.0.20-ndb-8.0.20</td> </tr></tbody></table>6

Leia o caminho fornecido a partir do arquivo de login.

* `--ndb-connectstring`

  <table frame="box" rules="all" summary="Properties for add-missing"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-missing</code></td> </tr><tr><th>Introduced</th> <td>8.0.20-ndb-8.0.20</td> </tr></tbody></table>7

Defina a string de conexão para se conectar ao ndb_mgmd. Sintaxe: "[nodeid=id;][host=]hostname[:port]". Ocorre entradas em NDB_CONNECTSTRING e my.cnf.

* `--ndb-mgmd-host`

  <table frame="box" rules="all" summary="Properties for add-missing"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-missing</code></td> </tr><tr><th>Introduced</th> <td>8.0.20-ndb-8.0.20</td> </tr></tbody></table>8

O mesmo que `--ndb-connectstring`.

* `--ndb-nodeid`

  <table frame="box" rules="all" summary="Properties for add-missing"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-missing</code></td> </tr><tr><th>Introduced</th> <td>8.0.20-ndb-8.0.20</td> </tr></tbody></table>9

Defina o ID do nó para este nó, substituindo qualquer ID definida pela opção --ndb-connectstring.

* `--ndb-optimized-node-selection`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>0

Ative as otimizações para a seleção de nós para transações. Ativado por padrão; use `--skip-ndb-optimized-node-selection` para desativá-lo.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>1

Não leia as opções padrão de qualquer arquivo de opção, exceto o arquivo de login.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>2

Imprimir a lista de argumentos do programa e sair.

* `--usage`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>3

Exibir texto de ajuda e sair; o mesmo que --help.

* `--verbose`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>4

Forneça informações adicionais na saída da ferramenta sobre seu progresso.

* `--version`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>5

Exibir informações da versão e sair.

#### Exemplo

Primeiro, criamos uma tabela `NDB` no banco de dados `test`, usando a declaração `CREATE TABLE` mostrada aqui:

```
USE test;

CREATE TABLE btest (
    c0 BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    c1 TEXT,
    c2 BLOB
)   ENGINE=NDB;
```

Em seguida, inserimos algumas linhas nessa tabela, usando uma série de declarações semelhantes a esta:

```
INSERT INTO btest VALUES (NULL, 'x', REPEAT('x', 1000));
```

Quando executado com `--check-orphans` contra esta tabela, o **ndb_blob_tool** gera a seguinte saída:

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

A ferramenta relata que não há partes da coluna BLOB `NDB` associadas à coluna `c1`, embora `c1` seja uma coluna `TEXT`. Isso ocorre porque, em uma tabela `NDB`, apenas os primeiros 256 bytes de um valor de coluna `BLOB` ou `TEXT` são armazenados inline, e apenas o excesso, se houver, é armazenado separadamente; assim, se não houver valores que utilizem mais de 256 bytes em uma coluna específica desses tipos, não são criadas partes da coluna `BLOB` pelo `NDB` para essa coluna. Consulte a Seção 13.7, “Requisitos de Armazenamento de Tipo de Dados”, para obter mais informações.

### 25.5.7 ndb_config — Extrair informações de configuração do NDB Cluster

Essa ferramenta extrai informações de configuração atuais para nós de dados, nós SQL e nós de API de uma série de fontes: um nó de gerenciamento do NDB Cluster, ou seus arquivos `config.ini` ou `my.cnf`. Por padrão, o nó de gerenciamento é a fonte dos dados de configuração; para sobrescrever o padrão, execute ndb_config com a opção `--config-file` ou `--mycnf`. Também é possível usar um nó de dados como fonte, especificando seu ID de nó com `--config_from_node=node_id`.

O **ndb_config** também pode fornecer um dump offline de todos os parâmetros de configuração que podem ser usados, juntamente com seus valores padrão, máximo e mínimo e outras informações. O dump pode ser produzido em formato de texto ou XML; para mais informações, consulte a discussão das opções `--configinfo` e `--xml` mais adiante nesta seção).

Você pode filtrar os resultados por seção (`DB`, `SYSTEM` ou `CONNECTIONS`) usando uma das opções `--nodes`, `--system` ou `--connections`.

Todas as opções que podem ser usadas com **ndb_config** são mostradas na tabela a seguir. Descrições adicionais seguem a tabela.

**Tabela 25.29 Opções de linha de comando usadas com o programa ndb_config**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th scope="col">Format</th> <th scope="col">Description</th> <th scope="col">Added, Deprecated, or Removed</th> </tr></thead><tbody><tr> <th scope="row"><p> <code class="option"> --character-sets-dir=path </code> </p></th> <td>Directory containing character sets</td> <td><p> REMOVED: 8.0.31 </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --cluster-config-suffix=name </code> </p></th> <td>Supraponha o sufixo do grupo padrão ao ler as seções do cluster_config no arquivo my.cnf; utilizado em testes</td> <td><p>ADICIONADO: NDB 8.0.24</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --config-binary-file=path/to/file </code> </p></th> <td>Leia este arquivo de configuração binário</td> <td><p>ADICIONADO: NDB 8.0.32</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --config-file=file_name </code> </p></th> <td>Defina o caminho para o arquivo config.ini</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --config-from-node=# </code> </p></th> <td>Obtenha os dados de configuração do nó que possui esse ID (deve ser um nó de dados)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --configinfo </code> </p></th> <td>Exibe informações sobre todos os parâmetros de configuração do NDB em formato de texto, com valores padrão, máximo e mínimo. Use com --xml para obter saída em formato XML</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --connections </code> </p></th> <td>Imprima informações apenas sobre as conexões especificadas nas seções [tcp], [tcp default], [sci], [sci default], [shm] ou [shm default] do arquivo de configuração do cluster. Não pode ser usado com --system ou --nodes</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --connect-retries=# </code> </p></th> <td>Número de vezes para tentar a conexão novamente antes de desistir</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --connect-retry-delay=# </code> </p></th> <td>Número de segundos para esperar entre as tentativas de contato com o servidor de gerenciamento</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--connect-string=connection_string</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_connect-string">-c connection_string</a> </code> </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --core-file </code> </p></th> <td>Escreva o arquivo de núcleo em erro; usado em depuração</td> <td><p>REMOvido: 8.0.31</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --defaults-extra-file=path </code> </p></th> <td>Leia o arquivo fornecido após os arquivos globais terem sido lidos</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --defaults-file=path </code> </p></th> <td>Ler opções padrão a partir do arquivo fornecido apenas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --defaults-group-suffix=string </code> </p></th> <td>Leia também grupos com concat(grupo, sufixo)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --diff-default </code> </p></th> <td>Imprima apenas os parâmetros de configuração que têm valores não padrão</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--fields=string</code>,</p><p> <code class="option"> -f </code> </p></th> <td>Separador de campo</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--help</code>,</p><p> <code class="option"> -? </code> </p></th> <td>Exibir texto de ajuda e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --host=name </code> </p></th> <td>Especifique o anfitrião</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --login-path=path </code> </p></th> <td>Leia o caminho fornecido a partir do arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --mycnf </code> </p></th> <td>Leia os dados de configuração do arquivo my.cnf</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--ndb-connectstring=connection_string</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_ndb-connectstring">-c connection_string</a> </code> </p></th> <td>Defina a string de conexão para se conectar ao ndb_mgmd. Sintaxe: "[nodeid=id;][host=]hostname[:port]". Supere as entradas em NDB_CONNECTSTRING e my.cnf</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--ndb-mgmd-host=connection_string</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_ndb-mgmd-host">-c connection_string</a> </code> </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --ndb-nodeid=# </code> </p></th> <td>Defina o ID do nó para este nó, substituindo qualquer ID definida pela opção --ndb-connectstring</td> <td><p>REMOvido: 8.0.31</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --ndb-optimized-node-selection </code> </p></th> <td>Ative as otimizações para a seleção de nós para transações. Ativado por padrão; use --skip-ndb-optimized-node-selection para desativá-lo</td> <td><p>REMOvido: 8.0.31</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --no-defaults </code> </p></th> <td>Não leia as opções padrão de qualquer arquivo de opção, exceto o arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --nodeid=# </code> </p></th> <td>Obtenha a configuração do nó com este ID</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --nodes </code> </p></th> <td>Imprima as informações do nó ([seção ndbd] ou [ndbd padrão] do arquivo de configuração do cluster) apenas. Não pode ser usado com --system ou --connections</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--query=string</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_query">-q string</a> </code> </p></th> <td>Uma ou mais opções de consulta (atributos)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--query-all</code>,</p><p> <code class="option"> -a </code> </p></th> <td>Descarta todos os parâmetros e valores em uma única string delimitada por vírgula</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --print-defaults </code> </p></th> <td>Imprimir a lista de argumentos do programa e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--rows=string</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_rows">-r string</a> </code> </p></th> <td>Separador de linhas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --system </code> </p></th> <td>Imprimir informações da seção SYSTEM (consulte ndb_config --configinfo output). Não pode ser usado com --nodes ou --connections</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --type=name </code> </p></th> <td>Especificar o tipo de nó</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--usage</code>,</p><p> <code class="option"> -? </code> </p></th> <td>Exibir texto de ajuda e sair; o mesmo que --help</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--version</code>,</p><p> <code class="option"> -V </code> </p></th> <td>Exibir informações da versão e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_xml">--configinfo --xml</a> </code> </p></th> <td>Use --xml com --configinfo para obter um dump de todos os parâmetros de configuração do NDB em formato XML, com valores padrão, máximo e mínimo.</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody></table>

* `cluster-config-suffix`

  <table frame="box" rules="all" summary="Properties for cluster-config-suffix"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--cluster-config-suffix=name</code></td> </tr><tr><th>Introduced</th> <td>8.0.24-ndb-8.0.24</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

Supraponha o sufixo padrão do grupo ao ler seções de configuração do cluster em `my.cnf`; utilizado em testes.

* `--configinfo`

A opção `--configinfo` faz com que o **ndb_config** exiba uma lista de cada parâmetro de configuração do NDB Cluster que é suportado pela distribuição do NDB Cluster, da qual o **ndb_config** faz parte, incluindo as seguintes informações:

+ Uma breve descrição do propósito, efeitos e uso de cada parâmetro

+ A seção do arquivo `config.ini` onde o parâmetro pode ser usado

+ O tipo de dados ou unidade de medição do parâmetro
+ Se aplicável, os valores padrão, mínimo e máximo do parâmetro

+ Versão do lançamento do cluster NDB e informações de construção

Por padrão, essa saída é em formato de texto. Parte dessa saída é mostrada aqui:

  ```
  $> ndb_config --configinfo

  ****** SYSTEM ******

  Name (String)
  Name of system (NDB Cluster)
  MANDATORY

  PrimaryMGMNode (Non-negative Integer)
  Node id of Primary ndb_mgmd(MGM) node
  Default: 0 (Min: 0, Max: 4294967039)

  ConfigGenerationNumber (Non-negative Integer)
  Configuration generation number
  Default: 0 (Min: 0, Max: 4294967039)

  ****** DB ******

  MaxNoOfSubscriptions (Non-negative Integer)
  Max no of subscriptions (default 0 == MaxNoOfTables)
  Default: 0 (Min: 0, Max: 4294967039)

  MaxNoOfSubscribers (Non-negative Integer)
  Max no of subscribers (default 0 == 2 * MaxNoOfTables)
  Default: 0 (Min: 0, Max: 4294967039)

  …
  ```

Use esta opção juntamente com a opção `--xml` para obter a saída em formato XML.

* `--config-binary-file=path-to-file`

  <table frame="box" rules="all" summary="Properties for config-binary-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--config-binary-file=path/to/file</code></td> </tr><tr><th>Introduced</th> <td>8.0.32-ndb-8.0.32</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>

Fornece o caminho para o arquivo de configuração binário cache do servidor de gerenciamento (`ndb_nodeID_config.bin.seqno`). Este pode ser um caminho relativo ou absoluto. Se o servidor de gerenciamento e o binário **ndb_config** utilizados residem em hosts diferentes, você deve usar um caminho absoluto.

Este exemplo demonstra a combinação de `--config-binary-file` com outras opções de **ndb_config** para obter uma saída útil:

  ```
  > ndb_config --config-binary-file=ndb_50_config.bin.1 --diff-default --type=ndbd
  config of [DB] node id 5 that is different from default
  CONFIG_PARAMETER,ACTUAL_VALUE,DEFAULT_VALUE
  NodeId,5,(mandatory)
  BackupDataDir,/home/jon/data/8.0,(null)
  DataDir,/home/jon/data/8.0,.
  DataMemory,2G,98M
  FileSystemPath,/home/jon/data/8.0,(null)
  HostName,127.0.0.1,localhost
  Nodegroup,0,(null)
  ThreadConfig,,(null)

  config of [DB] node id 6 that is different from default
  CONFIG_PARAMETER,ACTUAL_VALUE,DEFAULT_VALUE
  NodeId,6,(mandatory)
  BackupDataDir,/home/jon/data/8.0,(null)
  DataDir,/home/jon/data/8.0,.
  DataMemory,2G,98M
  FileSystemPath,/home/jon/data/8.0,(null)
  HostName,127.0.0.1,localhost
  Nodegroup,0,(null)
  ThreadConfig,,(null)

  > ndb_config --config-binary-file=ndb_50_config.bin.1 --diff-default --system
  config of [SYSTEM] system
  CONFIG_PARAMETER,ACTUAL_VALUE,DEFAULT_VALUE
  Name,MC_20220216092809,(mandatory)
  ConfigGenerationNumber,1,0
  PrimaryMGMNode,50,0
  ```

As partes relevantes do arquivo `config.ini` são mostradas aqui:

  ```
  [ndbd default]
  DataMemory= 2G
  NoOfReplicas= 2

  [ndb_mgmd]
  NodeId= 50
  HostName= 127.0.0.1

  [ndbd]
  NodeId= 5
  HostName= 127.0.0.1
  DataDir= /home/jon/data/8.0

  [ndbd]
  NodeId= 6
  HostName= 127.0.0.1
  DataDir= /home/jon/data/8.0
  ```

Ao comparar a saída com o arquivo de configuração, você pode ver que todos os ajustes no arquivo foram escritos pelo servidor de gerenciamento no cache binário e, portanto, aplicados ao clúster.

* `--config-file=path-to-file`

  <table frame="box" rules="all" summary="Properties for config-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--config-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>

Fornece o caminho para o arquivo de configuração do cluster (`config.ini`). Este pode ser um caminho relativo ou absoluto. Se o servidor de gerenciamento e o binário **ndb_config** utilizados residem em hosts diferentes, você deve usar um caminho absoluto.

* `--config_from_node=#`

  <table frame="box" rules="all" summary="Properties for config_from_node"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--config-from-node=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>none</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>48</code></td> </tr></tbody></table>

Obtenha os dados de configuração do cluster do nó de dados que possui esse ID.

Se o nó que possui esse ID não for um nó de dados, o **ndb_config** falha com um erro. (Para obter dados de configuração do nó de gerenciamento, simplesmente omita essa opção.)

* `--connections`

  <table frame="box" rules="all" summary="Properties for connections"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connections</code></td> </tr></tbody></table>

Informe ao **ndb_config** para imprimir apenas as informações do `CONNECTIONS`—ou seja, informações sobre os parâmetros encontrados nas seções `[tcp]`, `[tcp default]`, `[shm]` ou `[shm default]` do arquivo de configuração do clúster (consulte a Seção 25.4.3.10, “Conexões TCP/IP do NDB Cluster”, e a Seção 25.4.3.12, “Conexões de Memória Compartilhada do NDB Cluster”, para mais informações).

Esta opção é mutuamente exclusiva com `--nodes` e `--system`; apenas uma dessas 3 opções pode ser usada.

* `--diff-default`

  <table frame="box" rules="all" summary="Properties for diff-default"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--diff-default</code></td> </tr></tbody></table>

Imprima apenas os parâmetros de configuração que têm valores não padrão.

* `--fields=delimiter`, `-f` *`delimiter`*

  <table frame="box" rules="all" summary="Properties for fields"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--fields=string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>

Especifica uma string *`delimiter`* usada para separar os campos no resultado. O padrão é `,` (o caractere vírgula).

Nota

Se o *`delimiter`* contiver espaços ou escapamentos (como `\n` para o caractere de quebra de linha), então ele deve ser citado.

* `--host=hostname`

  <table frame="box" rules="all" summary="Properties for host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--host=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>

Especifica o nome do host do nó para o qual as informações de configuração devem ser obtidas.

Nota

Embora o nome de domínio `localhost` geralmente resolva para o endereço IP `127.0.0.1`, isso não é necessariamente verdade para todas as plataformas e configurações operacionais. Isso significa que é possível, quando `localhost` é usado em `config.ini`, que [**ndb_config `--host=localhost`**](mysql-cluster-programs-ndb-config.html "25.5.7 ndb_config — Extract NDB Cluster Configuration Information") falhe se **ndb_config** for executado em um host diferente onde `localhost` resolva para um endereço diferente (por exemplo, em algumas versões do SUSE Linux, isso é `127.0.0.2`). Em geral, para obter os melhores resultados, você deve usar endereços IP numéricos para todos os valores de configuração do NDB Cluster relacionados a hosts, ou verificar se todos os hosts do NDB Cluster tratam `localhost` da mesma maneira.

* `--mycnf`

  <table frame="box" rules="all" summary="Properties for mycnf"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--mycnf</code></td> </tr></tbody></table>

Leia os dados de configuração do arquivo `my.cnf`.

* `--ndb-connectstring=connection_string`, `-c connection_string`

  <table frame="box" rules="all" summary="Properties for cluster-config-suffix"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--cluster-config-suffix=name</code></td> </tr><tr><th>Introduced</th> <td>8.0.24-ndb-8.0.24</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>0

Especifica a cadeia de conexão a ser usada na conexão com o servidor de gerenciamento. O formato da cadeia de conexão é o mesmo descrito na Seção 25.4.3.3, "Cadeias de conexão do clúster NDB", e o padrão é `localhost:1186`.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for cluster-config-suffix"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--cluster-config-suffix=name</code></td> </tr><tr><th>Introduced</th> <td>8.0.24-ndb-8.0.24</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>1

Não leia as opções padrão de qualquer arquivo de opção, exceto o arquivo de login.

* `--nodeid=node_id`

  <table frame="box" rules="all" summary="Properties for cluster-config-suffix"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--cluster-config-suffix=name</code></td> </tr><tr><th>Introduced</th> <td>8.0.24-ndb-8.0.24</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>2

Especifique o ID do nó para o qual as informações de configuração devem ser obtidas.

* `--nodes`

  <table frame="box" rules="all" summary="Properties for cluster-config-suffix"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--cluster-config-suffix=name</code></td> </tr><tr><th>Introduced</th> <td>8.0.24-ndb-8.0.24</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>3

Informe ao **ndb_config** para imprimir informações relacionadas apenas aos parâmetros definidos em uma seção `[ndbd]` ou `[ndbd default]` do arquivo de configuração do clúster (consulte Seção 25.4.3.6, “Definindo Nodos de Dados do NDB Cluster”).

Esta opção é mutuamente exclusiva com `--connections` e `--system`; apenas uma dessas 3 opções pode ser usada.

* `--query=query-options`, `-q` *`query-options`*

  <table frame="box" rules="all" summary="Properties for cluster-config-suffix"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--cluster-config-suffix=name</code></td> </tr><tr><th>Introduced</th> <td>8.0.24-ndb-8.0.24</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>4

Esta é uma lista delimitada por vírgula de opções de consulta, ou seja, uma lista de um ou mais atributos do nó a serem retornados. Estes incluem `nodeid` (ID do nó), tipo (tipo de nó — ou seja, `ndbd`, `mysqld` ou `ndb_mgmd`) e quaisquer parâmetros de configuração cujos valores devem ser obtidos.

Por exemplo, `--query=nodeid,type,datamemory,datadir` retorna o ID do nó, o tipo de nó, `DataMemory` e `DataDir` para cada nó.

Nota

Se um parâmetro dado não for aplicável a um determinado tipo de nó, uma string vazia é devolvida para o valor correspondente. Consulte os exemplos mais adiante nesta seção para obter mais informações.

* `--query-all`, `-a`

  <table frame="box" rules="all" summary="Properties for cluster-config-suffix"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--cluster-config-suffix=name</code></td> </tr><tr><th>Introduced</th> <td>8.0.24-ndb-8.0.24</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>5

Retorna uma lista delimitada por vírgula de todas as opções de consulta (atributos do nó; observe que essa lista é uma única string.

* `--rows=separator`, `-r` *`separator`*

  <table frame="box" rules="all" summary="Properties for cluster-config-suffix"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--cluster-config-suffix=name</code></td> </tr><tr><th>Introduced</th> <td>8.0.24-ndb-8.0.24</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>6

Especifica uma cadeia *`separator`* usada para separar as linhas no resultado. O padrão é um caractere de espaço.

Nota

Se o *`separator`* contiver espaços ou escapamentos (como `\n` para o caractere de quebra de linha), então ele deve ser citado.

* `--system`

  <table frame="box" rules="all" summary="Properties for cluster-config-suffix"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--cluster-config-suffix=name</code></td> </tr><tr><th>Introduced</th> <td>8.0.24-ndb-8.0.24</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>7

Informe ao **ndb_config** para imprimir apenas as informações do `SYSTEM`. Isso consiste em variáveis do sistema que não podem ser alteradas no tempo de execução; portanto, não há uma seção correspondente do arquivo de configuração do clúster para elas. Elas podem ser vistas (prefixadas com `****** SYSTEM ******`) na saída do **ndb_config** `--configinfo`.

Esta opção é mutuamente exclusiva com `--nodes` e `--connections`; apenas uma dessas 3 opções pode ser usada.

* `--type=node_type`

  <table frame="box" rules="all" summary="Properties for cluster-config-suffix"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--cluster-config-suffix=name</code></td> </tr><tr><th>Introduced</th> <td>8.0.24-ndb-8.0.24</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>8

Filtre os resultados para que apenas os valores de configuração que se aplicam aos nós do *`node_type`* especificado (`ndbd`, `mysqld` ou `ndb_mgmd`) sejam retornados.

* `--usage`, `--help`, ou `-?`

  <table frame="box" rules="all" summary="Properties for cluster-config-suffix"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--cluster-config-suffix=name</code></td> </tr><tr><th>Introduced</th> <td>8.0.24-ndb-8.0.24</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>9

Faz com que **ndb_config** imprima uma lista de opções disponíveis e, em seguida, saia.

* `--version`, `-V`

  <table frame="box" rules="all" summary="Properties for config-binary-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--config-binary-file=path/to/file</code></td> </tr><tr><th>Introduced</th> <td>8.0.32-ndb-8.0.32</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>0

Faz com que **ndb_config** imprima uma string de informações de versão e, em seguida, saia.

* `--configinfo` `--xml`

  <table frame="box" rules="all" summary="Properties for config-binary-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--config-binary-file=path/to/file</code></td> </tr><tr><th>Introduced</th> <td>8.0.32-ndb-8.0.32</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>1

Se você quiser que o **ndb_config** `--configinfo` forneça saída em formato XML, adicione essa opção. Uma parte dessa saída é mostrada neste exemplo:

  ```
  $> ndb_config --configinfo --xml

  <configvariables protocolversion="1" ndbversionstring="5.7.44-ndb-7.5.36"
                      ndbversion="460032" ndbversionmajor="7" ndbversionminor="5"
                      ndbversionbuild="0">
    <section name="SYSTEM">
      <param name="Name" comment="Name of system (NDB Cluster)" type="string"
                mandatory="true"/>
      <param name="PrimaryMGMNode" comment="Node id of Primary ndb_mgmd(MGM) node"
                type="unsigned" default="0" min="0" max="4294967039"/>
      <param name="ConfigGenerationNumber" comment="Configuration generation number"
                type="unsigned" default="0" min="0" max="4294967039"/>
    </section>
    <section name="MYSQLD" primarykeys="NodeId">
      <param name="wan" comment="Use WAN TCP setting as default" type="bool"
                default="false"/>
      <param name="HostName" comment="Name of computer for this node"
                type="string" default=""/>
      <param name="Id" comment="NodeId" type="unsigned" mandatory="true"
                min="1" max="255" deprecated="true"/>
      <param name="NodeId" comment="Number identifying application node (mysqld(API))"
                type="unsigned" mandatory="true" min="1" max="255"/>
      <param name="ExecuteOnComputer" comment="HostName" type="string"
                deprecated="true"/>

      …

    </section>

    …

  </configvariables>
  ```

Nota

Normalmente, a saída XML produzida pelo **ndb_config** `--configinfo` `--xml` é formatada usando uma linha por elemento; adicionamos espaços extras no exemplo anterior e no próximo, por questões de legibilidade. Isso não deve fazer diferença para as aplicações que utilizam essa saída, uma vez que a maioria dos processadores de XML ignora o espaço em branco não essencial como uma questão de rotina, ou pode ser instruída a fazer isso.

A saída XML também indica quando a alteração de um parâmetro específico exige que os nós de dados sejam reiniciados usando a opção `--initial`. Isso é mostrado pela presença de um atributo `initial="true"` no elemento correspondente `<param>`. Além disso, o tipo de reinício (`system` ou `node`) também é mostrado; se um parâmetro específico requer um reinício do sistema, isso é indicado pela presença de um atributo `restart="system"` no elemento correspondente `<param>`. Por exemplo, alterar o valor definido para o parâmetro `Diskless` requer um reinício inicial do sistema, como mostrado aqui (com os atributos `restart` e `initial` destacados para visibilidade):

  ```
  <param name="Diskless" comment="Run wo/ disk" type="bool" default="false"
            restart="system" initial="true"/>
  ```

Atualmente, nenhum atributo `initial` é incluído na saída XML para os elementos `<param>` correspondentes a parâmetros que não requerem reinício inicial; em outras palavras, `initial="false"` é o padrão, e o valor `false` deve ser assumido se o atributo não estiver presente. Da mesma forma, o tipo de reinício padrão é `node` (ou seja, um reinício online ou "rolling" do clúster), mas o atributo `restart` é incluído apenas se o tipo de reinício for `system` (o que significa que todos os nós do clúster devem ser desligados ao mesmo tempo, em seguida, reiniciados).

Os parâmetros obsoletos são indicados na saída XML pelo atributo `deprecated`, conforme mostrado aqui:

  ```
  <param name="NoOfDiskPagesToDiskAfterRestartACC" comment="DiskCheckpointSpeed"
         type="unsigned" default="20" min="1" max="4294967039" deprecated="true"/>
  ```

Nesses casos, o `comment` se refere a um ou mais parâmetros que substituem o parâmetro descontinuado. Da mesma forma que o `initial`, o atributo `deprecated` é indicado apenas quando o parâmetro é descontinuado, com o `deprecated="true"`, e não aparece em absoluto para os parâmetros que não são descontinuados. (Bug #21127135)

Os parâmetros que são necessários são indicados com `mandatory="true"`, conforme mostrado aqui:

  ```
  <param name="NodeId"
            comment="Number identifying application node (mysqld(API))"
            type="unsigned" mandatory="true" min="1" max="255"/>
  ```

Da mesma forma que o atributo `initial` ou `deprecated` é exibido apenas para um parâmetro que requer um reinício inicial ou que é descontinuado, o atributo `mandatory` é incluído apenas se o parâmetro fornecido é realmente necessário.

Importante

A opção `--xml` só pode ser usada com a opção `--configinfo`. O uso de `--xml` sem `--configinfo` falha com um erro.

Ao contrário das opções usadas com este programa para obter dados de configuração atuais, `--configinfo` e `--xml` utilizam informações obtidas das fontes do NDB Cluster quando o **ndb_config** foi compilado. Por essa razão, não é necessária uma conexão com um NDB Cluster em execução ou acesso a um arquivo `config.ini` ou `my.cnf` para essas duas opções.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for config-binary-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--config-binary-file=path/to/file</code></td> </tr><tr><th>Introduced</th> <td>8.0.32-ndb-8.0.32</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>2

Imprimir a lista de argumentos do programa e sair.

* `--defaults-file`

  <table frame="box" rules="all" summary="Properties for config-binary-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--config-binary-file=path/to/file</code></td> </tr><tr><th>Introduced</th> <td>8.0.32-ndb-8.0.32</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>3

Leia as opções padrão a partir do arquivo fornecido apenas.

* `--defaults-extra-file`

  <table frame="box" rules="all" summary="Properties for config-binary-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--config-binary-file=path/to/file</code></td> </tr><tr><th>Introduced</th> <td>8.0.32-ndb-8.0.32</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>4

Leia o arquivo fornecido após a leitura dos arquivos globais.

* `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Properties for config-binary-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--config-binary-file=path/to/file</code></td> </tr><tr><th>Introduced</th> <td>8.0.32-ndb-8.0.32</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>5

Leia também grupos com concatenação(grupo, sufixo).

* `--login-path`

  <table frame="box" rules="all" summary="Properties for config-binary-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--config-binary-file=path/to/file</code></td> </tr><tr><th>Introduced</th> <td>8.0.32-ndb-8.0.32</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>6

Leia o caminho fornecido a partir do arquivo de login.

* `--help`

  <table frame="box" rules="all" summary="Properties for config-binary-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--config-binary-file=path/to/file</code></td> </tr><tr><th>Introduced</th> <td>8.0.32-ndb-8.0.32</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>7

Exibir texto de ajuda e sair.

* `--connect-string`

  <table frame="box" rules="all" summary="Properties for config-binary-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--config-binary-file=path/to/file</code></td> </tr><tr><th>Introduced</th> <td>8.0.32-ndb-8.0.32</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>8

O mesmo que `--ndb-connectstring`.

* `--ndb-mgmd-host`

  <table frame="box" rules="all" summary="Properties for config-binary-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--config-binary-file=path/to/file</code></td> </tr><tr><th>Introduced</th> <td>8.0.32-ndb-8.0.32</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>9

O mesmo que `--ndb-connectstring`.

* `--ndb-nodeid`

  <table frame="box" rules="all" summary="Properties for config-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--config-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>0

Defina o ID do nó para este nó, substituindo qualquer ID definida por `--ndb-connectstring`.

* `--core-file`

  <table frame="box" rules="all" summary="Properties for config-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--config-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>1

Escreva o arquivo de núcleo em erro; usado em depuração.

* `--character-sets-dir`

  <table frame="box" rules="all" summary="Properties for config-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--config-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>2

Diretório contendo conjuntos de caracteres.

* `--connect-retries`

  <table frame="box" rules="all" summary="Properties for config-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--config-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>3

Número de vezes para tentar a conexão novamente antes de desistir.

* `--connect-retry-delay`

  <table frame="box" rules="all" summary="Properties for config-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--config-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>4

Número de segundos para esperar entre as tentativas de contato com o servidor de gerenciamento.

* `--ndb-optimized-node-selection`

  <table frame="box" rules="all" summary="Properties for config-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--config-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>5

Ative as otimizações para a seleção de nós para transações. Ativado por padrão; use `--skip-ndb-optimized-node-selection` para desativá-lo.

Combinar outras opções de **ndb_config** (como `--query` ou `--type`) com `--configinfo` (com ou sem a opção `--xml` não é suportada. Atualmente, se você tentar fazer isso, o resultado usual é que todas as outras opções, além de `--configinfo` ou `--xml`, são simplesmente ignoradas. *No entanto, esse comportamento não é garantido e está sujeito a mudanças a qualquer momento*. Além disso, uma vez que **ndb_config**, quando usado com a opção `--configinfo`, não acessa o NDB Cluster ou não lê quaisquer arquivos, tentar especificar opções adicionais, como `--ndb-connectstring` ou `--config-file` com `--configinfo`, não serve a nenhum propósito.

#### Exemplos

1. Para obter o ID do nó e o tipo de cada nó no clúster:

   ```
   $> ./ndb_config --query=nodeid,type --fields=':' --rows='\n'
   1:ndbd
   2:ndbd
   3:ndbd
   4:ndbd
   5:ndb_mgmd
   6:mysqld
   7:mysqld
   8:mysqld
   9:mysqld
   ```

Neste exemplo, usamos as opções `--fields` para separar o ID e o tipo de cada nó com um caractere de colon (`:`), e as opções `--rows` para colocar os valores de cada nó em uma nova linha na saída.

2. Para produzir uma cadeia de conexão que possa ser usada por nós de dados, SQL e API para se conectar ao servidor de gerenciamento:

   ```
   $> ./ndb_config --config-file=usr/local/mysql/cluster-data/config.ini \
   --query=hostname,portnumber --fields=: --rows=, --type=ndb_mgmd
   198.51.100.179:1186
   ```

3. Esta invocação do **ndb_config** verifica apenas os nós de dados (usando a opção `--type`), e mostra os valores para o ID de cada nó e o nome do host, bem como os valores definidos para seus parâmetros `DataMemory` e `DataDir`:

   ```
   $> ./ndb_config --type=ndbd --query=nodeid,host,datamemory,datadir -f ' : ' -r '\n'
   1 : 198.51.100.193 : 83886080 : /usr/local/mysql/cluster-data
   2 : 198.51.100.112 : 83886080 : /usr/local/mysql/cluster-data
   3 : 198.51.100.176 : 83886080 : /usr/local/mysql/cluster-data
   4 : 198.51.100.119 : 83886080 : /usr/local/mysql/cluster-data
   ```

Neste exemplo, utilizamos as opções curtas `-f` e `-r` para definir o delimitador de campo e o separador de linha, respectivamente, bem como a opção curta `-q` para passar uma lista de parâmetros a serem obtidos.

4. Para excluir resultados de qualquer anfitrião, exceto um em particular, use a opção `--host`:

   ```
   $> ./ndb_config --host=198.51.100.176 -f : -r '\n' -q id,type
   3:ndbd
   5:ndb_mgmd
   ```

Neste exemplo, também usamos a forma abreviada [[`-q`] para determinar os atributos a serem consultados.

Da mesma forma, você pode limitar os resultados a um nó com um ID específico usando a opção `--nodeid`.

### 25.5.8 ndb_delete_all — Deletar todas as linhas de uma tabela NDB

**ndb_delete_all** exclui todas as linhas da tabela `NDB` fornecida. Em alguns casos, isso pode ser muito mais rápido do que `DELETE` ou até mesmo `TRUNCATE TABLE`.

#### Uso

```
ndb_delete_all -c connection_string tbl_name -d db_name
```

Isso exclui todas as linhas da tabela denominada *`tbl_name`* no banco de dados denominado *`db_name`*. É exatamente equivalente a executar `TRUNCATE db_name.tbl_name` no MySQL.

As opções que podem ser usadas com **ndb_delete_all** são mostradas na tabela a seguir. Descrições adicionais seguem a tabela.

**Tabela 25.30 Opções de linha de comando usadas com o programa ndb_delete_all**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th scope="col">Format</th> <th scope="col">Description</th> <th scope="col">Added, Deprecated, or Removed</th> </tr></thead><tbody><tr> <th scope="row"><p> <code class="option"> --character-sets-dir=path </code> </p></th> <td>Directory containing character sets</td> <td><p> REMOVED: 8.0.31 </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --connect-retries=# </code> </p></th> <td>Número de vezes para tentar a conexão novamente antes de desistir</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --connect-retry-delay=# </code> </p></th> <td>Número de segundos para esperar entre as tentativas de contato com o servidor de gerenciamento</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--connect-string=connection_string</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-delete-all.html#option_ndb_delete_all_connect-string">-c connection_string</a> </code> </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --core-file </code> </p></th> <td>Escreva o arquivo de núcleo em erro; usado em depuração</td> <td><p>REMOvido: 8.0.31</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--database=name</code>,</p><p> <code>-d name</code> </p></th> <td>Nome do banco de dados em que a tabela está localizada</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --defaults-extra-file=path </code> </p></th> <td>Leia o arquivo fornecido após os arquivos globais terem sido lidos</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --defaults-file=path </code> </p></th> <td>Ler opções padrão a partir do arquivo fornecido apenas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --defaults-group-suffix=string </code> </p></th> <td>Leia também grupos com concat(grupo, sufixo)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--diskscan</code> </p></th> <td>Realize uma varredura de disco</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--help</code>,</p><p> <code class="option"> -? </code> </p></th> <td>Exibir texto de ajuda e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --login-path=path </code> </p></th> <td>Leia o caminho fornecido a partir do arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--ndb-connectstring=connection_string</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-delete-all.html#option_ndb_delete_all_ndb-connectstring">-c connection_string</a> </code> </p></th> <td>Defina a string de conexão para se conectar ao ndb_mgmd. Sintaxe: "[nodeid=id;][host=]hostname[:port]". Supere as entradas em NDB_CONNECTSTRING e my.cnf</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--ndb-mgmd-host=connection_string</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-delete-all.html#option_ndb_delete_all_ndb-mgmd-host">-c connection_string</a> </code> </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --ndb-nodeid=# </code> </p></th> <td>Defina o ID do nó para este nó, substituindo qualquer ID definida pela opção --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --ndb-optimized-node-selection </code> </p></th> <td>Ative as otimizações para a seleção de nós para transações. Ativado por padrão; use --skip-ndb-optimized-node-selection para desativá-lo</td> <td><p>REMOvido: 8.0.31</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --no-defaults </code> </p></th> <td>Não leia as opções padrão de qualquer arquivo de opção, exceto o arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --print-defaults </code> </p></th> <td>Imprimir a lista de argumentos do programa e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--transactional</code>,</p><p> <code class="option"> -t </code> </p></th> <td>Realize a exclusão em uma única transação; é possível esgotar as operações quando usado</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--tupscan</code> </p></th> <td>Realize a varredura de tupla</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--usage</code>,</p><p> <code class="option"> -? </code> </p></th> <td>Exibir texto de ajuda e sair; o mesmo que --help</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--version</code>,</p><p> <code class="option"> -V </code> </p></th> <td>Exibir informações da versão e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody></table>

* `--character-sets-dir`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>

Diretório contendo conjuntos de caracteres.

* `--connect-retries`

  <table frame="box" rules="all" summary="Properties for connect-retries"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>12</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>12</code></td> </tr></tbody></table>

Número de vezes para tentar a conexão novamente antes de desistir.

* `--connect-retry-delay`

  <table frame="box" rules="all" summary="Properties for connect-retry-delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retry-delay=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>5</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>5</code></td> </tr></tbody></table>

Número de segundos para esperar entre as tentativas de contato com o servidor de gerenciamento.

* `--connect-string`

  <table frame="box" rules="all" summary="Properties for connect-string"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-string=connection_string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

O mesmo que `--ndb-connectstring`.

* `--core-file`

  <table frame="box" rules="all" summary="Properties for core-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--core-file</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>

Escreva o arquivo de núcleo em erro; usado em depuração.

* `--database`, `-d`

  <table frame="box" rules="all" summary="Properties for database"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--database=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>TEST_DB</code></td> </tr></tbody></table>

Nome do banco de dados que contém a tabela a ser excluída.

* `--defaults-extra-file`

  <table frame="box" rules="all" summary="Properties for defaults-extra-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-extra-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

Leia o arquivo fornecido após a leitura dos arquivos globais.

* `--defaults-file`

  <table frame="box" rules="all" summary="Properties for defaults-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

Leia as opções padrão a partir do arquivo fornecido apenas.

* `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Properties for defaults-group-suffix"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-group-suffix=string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

Leia também grupos com concatenação(grupo, sufixo).

* `--diskscan`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>0

Realize uma varredura de disco.

* `--help`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>1

Exibir texto de ajuda e sair.

* `--login-path`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>2

Leia o caminho fornecido a partir do arquivo de login.

* `--ndb-connectstring`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>3

Defina a string de conexão para se conectar ao ndb_mgmd. Sintaxe: "[nodeid=id;][host=]hostname[:port]". Ocorre entradas em NDB_CONNECTSTRING e my.cnf.

* `--ndb-mgmd-host`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>4

O mesmo que `--ndb-connectstring`.

* `--ndb-nodeid`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>5

Defina o ID do nó para este nó, substituindo qualquer ID definida por `--ndb-connectstring`.

* `--ndb-optimized-node-selection`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>6

Ative as otimizações para a seleção de nós para transações. Ativado por padrão; use `--skip-ndb-optimized-node-selection` para desativá-lo.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>7

Não leia as opções padrão de qualquer arquivo de opção, exceto o arquivo de login.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>8

Imprimir a lista de argumentos do programa e sair.

* `--transactional`, `-t`

O uso desta opção faz com que a operação de exclusão seja realizada como uma única transação.

Aviso

Com tabelas muito grandes, o uso desta opção pode causar o excedente do número de operações disponíveis para o clúster.

* `--tupscan`

Realize uma varredura de tupla.

* `--usage`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>9

Exibir texto de ajuda e sair; o mesmo que `--help`.

* `--version`

  <table frame="box" rules="all" summary="Properties for connect-retries"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>12</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>12</code></td> </tr></tbody></table>0

Exibir informações da versão e sair.

No NDB 7.6 e versões anteriores, este programa imprimia `NDBT_ProgramExit - status` após a conclusão de sua execução, devido a uma dependência desnecessária da biblioteca de teste [[`NDBT`]. Essa dependência foi removida no NDB 8.0, eliminando a saída desnecessária.

### 25.5.9 ndb_desc — Descrever as tabelas NDB

**ndb_desc** fornece uma descrição detalhada de uma ou mais tabelas `NDB`.

#### Uso

```
ndb_desc -c connection_string tbl_name -d db_name [options]

ndb_desc -c connection_string index_name -d db_name -t tbl_name
```

Opções adicionais que podem ser usadas com **ndb_desc** estão listadas mais adiante nesta seção.

#### Saída Exemplo

Declarações de criação e população de tabela MySQL:

```
USE test;

CREATE TABLE fish (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(20) NOT NULL,
    length_mm INT NOT NULL,
    weight_gm INT NOT NULL,

    PRIMARY KEY pk (id),
    UNIQUE KEY uk (name)
) ENGINE=NDB;

INSERT INTO fish VALUES
    (NULL, 'guppy', 35, 2), (NULL, 'tuna', 2500, 150000),
    (NULL, 'shark', 3000, 110000), (NULL, 'manta ray', 1500, 50000),
    (NULL, 'grouper', 900, 125000), (NULL ,'puffer', 250, 2500);
```

Saída de **ndb_desc**:

```
$> ./ndb_desc -c localhost fish -d test -p
-- fish --
Version: 2
Fragment type: HashMapPartition
K Value: 6
Min load factor: 78
Max load factor: 80
Temporary table: no
Number of attributes: 4
Number of primary keys: 1
Length of frm data: 337
Max Rows: 0
Row Checksum: 1
Row GCI: 1
SingleUserMode: 0
ForceVarPart: 1
PartitionCount: 2
FragmentCount: 2
PartitionBalance: FOR_RP_BY_LDM
ExtraRowGciBits: 0
ExtraRowAuthorBits: 0
TableStatus: Retrieved
Table options:
HashMap: DEFAULT-HASHMAP-3840-2
-- Attributes --
id Int PRIMARY KEY DISTRIBUTION KEY AT=FIXED ST=MEMORY AUTO_INCR
name Varchar(20;latin1_swedish_ci) NOT NULL AT=SHORT_VAR ST=MEMORY DYNAMIC
length_mm Int NOT NULL AT=FIXED ST=MEMORY DYNAMIC
weight_gm Int NOT NULL AT=FIXED ST=MEMORY DYNAMIC
-- Indexes --
PRIMARY KEY(id) - UniqueHashIndex
PRIMARY(id) - OrderedIndex
uk(name) - OrderedIndex
uk$unique(name) - UniqueHashIndex
-- Per partition info --
Partition       Row count       Commit count    Frag fixed memory       Frag varsized memory    Extent_space    Free extent_space
0               2               2               32768                   32768                   0               0
1               4               4               32768                   32768                   0               0
```

Informações sobre várias tabelas podem ser obtidas em uma única invocação de **ndb_desc** usando seus nomes, separados por espaços. Todas as tabelas devem estar no mesmo banco de dados.

Você pode obter informações adicionais sobre um índice específico usando a opção `--table` (forma abreviada: `-t`) e fornecendo o nome do índice como o primeiro argumento para **ndb_desc**, conforme mostrado aqui:

```
$> ./ndb_desc uk -d test -t fish
-- uk --
Version: 2
Base table: fish
Number of attributes: 1
Logging: 0
Index type: OrderedIndex
Index status: Retrieved
-- Attributes --
name Varchar(20;latin1_swedish_ci) NOT NULL AT=SHORT_VAR ST=MEMORY
-- IndexTable 10/uk --
Version: 2
Fragment type: FragUndefined
K Value: 6
Min load factor: 78
Max load factor: 80
Temporary table: yes
Number of attributes: 2
Number of primary keys: 1
Length of frm data: 0
Max Rows: 0
Row Checksum: 1
Row GCI: 1
SingleUserMode: 2
ForceVarPart: 0
PartitionCount: 2
FragmentCount: 2
FragmentCountType: ONE_PER_LDM_PER_NODE
ExtraRowGciBits: 0
ExtraRowAuthorBits: 0
TableStatus: Retrieved
Table options:
-- Attributes --
name Varchar(20;latin1_swedish_ci) NOT NULL AT=SHORT_VAR ST=MEMORY
NDB$TNODE Unsigned [64] PRIMARY KEY DISTRIBUTION KEY AT=FIXED ST=MEMORY
-- Indexes --
PRIMARY KEY(NDB$TNODE) - UniqueHashIndex
```

Quando um índice é especificado dessa forma, as opções `--extra-partition-info` e `--extra-node-info` não têm efeito.

A coluna `Version` no resultado contém a versão do objeto do esquema da tabela. Para obter informações sobre a interpretação desse valor, consulte Versões de Objetos do Esquema NDB.

Três das propriedades da tabela que podem ser definidas usando comentários `NDB_TABLE` incorporados nas declarações `CREATE TABLE` e `ALTER TABLE` também são visíveis na saída **ndb_desc**. O `FRAGMENT_COUNT_TYPE` da tabela é sempre mostrado na coluna `FragmentCountType`. Os `READ_ONLY` e `FULLY_REPLICATED`, se definidos como 1, são mostrados na coluna `Table options`. Você pode ver isso após executar a seguinte declaração [`ALTER TABLE`(alter-table.html "15.1.9 ALTER TABLE Statement") no cliente **mysql**:

```
mysql> ALTER TABLE fish COMMENT='NDB_TABLE=READ_ONLY=1,FULLY_REPLICATED=1';
1 row in set, 1 warning (0.00 sec)

mysql> SHOW WARNINGS\G
+---------+------+---------------------------------------------------------------------------------------------------------+
| Level   | Code | Message                                                                                                 |
+---------+------+---------------------------------------------------------------------------------------------------------+
| Warning | 1296 | Got error 4503 'Table property is FRAGMENT_COUNT_TYPE=ONE_PER_LDM_PER_NODE but not in comment' from NDB |
+---------+------+---------------------------------------------------------------------------------------------------------+
1 row in set (0.00 sec)
```

O aviso é emitido porque `READ_ONLY=1` exige que o tipo de fragmentação da tabela seja (ou seja definido como) `ONE_PER_LDM_PER_NODE_GROUP`; `NDB` define isso automaticamente nesses casos. Você pode verificar que a declaração `ALTER TABLE` tem o efeito desejado usando [`SHOW CREATE TABLE`](show-create-table.html "15.7.7.10 SHOW CREATE TABLE Statement"):

```
mysql> SHOW CREATE TABLE fish\G
*************************** 1. row ***************************
       Table: fish
Create Table: CREATE TABLE `fish` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  `length_mm` int(11) NOT NULL,
  `weight_gm` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk` (`name`)
) ENGINE=ndbcluster DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
COMMENT='NDB_TABLE=READ_BACKUP=1,FULLY_REPLICATED=1'
1 row in set (0.01 sec)
```

Como `FRAGMENT_COUNT_TYPE` não foi definido explicitamente, seu valor não é mostrado no texto de comentário impresso por `SHOW CREATE TABLE`. O **ndb_desc**, no entanto, exibe o valor atualizado para este atributo. A coluna `Table options` mostra as propriedades binárias que foram habilitadas. Você pode ver isso na saída mostrada aqui (texto destacado):

```
$> ./ndb_desc -c localhost fish -d test -p
-- fish --
Version: 4
Fragment type: HashMapPartition
K Value: 6
Min load factor: 78
Max load factor: 80
Temporary table: no
Number of attributes: 4
Number of primary keys: 1
Length of frm data: 380
Max Rows: 0
Row Checksum: 1
Row GCI: 1
SingleUserMode: 0
ForceVarPart: 1
PartitionCount: 1
FragmentCount: 1
FragmentCountType: ONE_PER_LDM_PER_NODE_GROUP
ExtraRowGciBits: 0
ExtraRowAuthorBits: 0
TableStatus: Retrieved
Table options: readbackup, fullyreplicated
HashMap: DEFAULT-HASHMAP-3840-1
-- Attributes --
id Int PRIMARY KEY DISTRIBUTION KEY AT=FIXED ST=MEMORY AUTO_INCR
name Varchar(20;latin1_swedish_ci) NOT NULL AT=SHORT_VAR ST=MEMORY DYNAMIC
length_mm Int NOT NULL AT=FIXED ST=MEMORY DYNAMIC
weight_gm Int NOT NULL AT=FIXED ST=MEMORY DYNAMIC
-- Indexes --
PRIMARY KEY(id) - UniqueHashIndex
PRIMARY(id) - OrderedIndex
uk(name) - OrderedIndex
uk$unique(name) - UniqueHashIndex
-- Per partition info --
Partition       Row count       Commit count    Frag fixed memory       Frag varsized memory    Extent_space    Free extent_space
```

Para obter mais informações sobre essas propriedades da tabela, consulte a Seção 15.1.20.12, “Definindo opções de comentário NDB”.

As colunas `Extent_space` e `Free extent_space` são aplicáveis apenas às tabelas `NDB` que possuem colunas em disco; para tabelas que possuem apenas colunas de memória, essas colunas sempre contêm o valor `0`.

Para ilustrar seu uso, modificamos o exemplo anterior. Primeiro, devemos criar os objetos de Dados de disco necessários, conforme mostrado aqui:

```
CREATE LOGFILE GROUP lg_1
    ADD UNDOFILE 'undo_1.log'
    INITIAL_SIZE 16M
    UNDO_BUFFER_SIZE 2M
    ENGINE NDB;

ALTER LOGFILE GROUP lg_1
    ADD UNDOFILE 'undo_2.log'
    INITIAL_SIZE 12M
    ENGINE NDB;

CREATE TABLESPACE ts_1
    ADD DATAFILE 'data_1.dat'
    USE LOGFILE GROUP lg_1
    INITIAL_SIZE 32M
    ENGINE NDB;

ALTER TABLESPACE ts_1
    ADD DATAFILE 'data_2.dat'
    INITIAL_SIZE 48M
    ENGINE NDB;
```

(Para mais informações sobre as declarações mostradas e os objetos criados por elas, consulte a Seção 25.6.11.1, “Objetos de dados de disco de cluster NDB”, bem como a Seção 15.1.16, “Declaração CREATE LOGFILE GROUP”, e a Seção 15.1.21, “Declaração CREATE TABLESPACE”.)

Agora, podemos criar e povoar uma versão da tabela `fish` que armazena 2 de suas colunas no disco (excluindo a versão anterior da tabela, se ela já existir):

```
DROP TABLE IF EXISTS fish;

CREATE TABLE fish (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(20) NOT NULL,
    length_mm INT NOT NULL,
    weight_gm INT NOT NULL,

    PRIMARY KEY pk (id),
    UNIQUE KEY uk (name)
) TABLESPACE ts_1 STORAGE DISK
ENGINE=NDB;

INSERT INTO fish VALUES
    (NULL, 'guppy', 35, 2), (NULL, 'tuna', 2500, 150000),
    (NULL, 'shark', 3000, 110000), (NULL, 'manta ray', 1500, 50000),
    (NULL, 'grouper', 900, 125000), (NULL ,'puffer', 250, 2500);
```

Quando executado contra esta versão da tabela, **ndb_desc** exibe a seguinte saída:

```
$> ./ndb_desc -c localhost fish -d test -p
-- fish --
Version: 1
Fragment type: HashMapPartition
K Value: 6
Min load factor: 78
Max load factor: 80
Temporary table: no
Number of attributes: 4
Number of primary keys: 1
Length of frm data: 1001
Max Rows: 0
Row Checksum: 1
Row GCI: 1
SingleUserMode: 0
ForceVarPart: 1
PartitionCount: 2
FragmentCount: 2
PartitionBalance: FOR_RP_BY_LDM
ExtraRowGciBits: 0
ExtraRowAuthorBits: 0
TableStatus: Retrieved
Table options: readbackup
HashMap: DEFAULT-HASHMAP-3840-2
Tablespace id: 16
Tablespace: ts_1
-- Attributes --
id Int PRIMARY KEY DISTRIBUTION KEY AT=FIXED ST=MEMORY AUTO_INCR
name Varchar(80;utf8mb4_0900_ai_ci) NOT NULL AT=SHORT_VAR ST=MEMORY
length_mm Int NOT NULL AT=FIXED ST=DISK
weight_gm Int NOT NULL AT=FIXED ST=DISK
-- Indexes --
PRIMARY KEY(id) - UniqueHashIndex
PRIMARY(id) - OrderedIndex
uk(name) - OrderedIndex
uk$unique(name) - UniqueHashIndex
-- Per partition info --
Partition       Row count       Commit count    Frag fixed memory       Frag varsized memory    Extent_space    Free extent_space
0               2               2               32768                   32768                   1048576         1044440
1               4               4               32768                   32768                   1048576         1044400
```

Isso significa que 1048576 bytes são alocados dos espaços de tabelas para esta tabela em cada partição, dos quais 1044440 bytes permanecem livres para armazenamento adicional. Em outras palavras, 1048576 - 1044440 = 4136 bytes por partição estão atualmente sendo usados para armazenar os dados das colunas baseadas em disco desta tabela. O número de bytes mostrado como `Free extent_space` está disponível para armazenamento de dados de coluna em disco da tabela `fish`, e por essa razão, não é visível ao selecionar a partir da tabela do Esquema de Informações `FILES`.

`Tablespace id` e `Tablespace` são exibidos para tabelas de dados de disco que começam com NDB 8.0.21.

Para tabelas totalmente replicadas, **ndb_desc** mostra apenas os nós que contêm fragmentos de replicação de partição primária; os nós com cópias de fragmentos de replicação (apenas) são ignorados. Você pode obter essas informações, usando o cliente **mysql**, nas tabelas `table_distribution_status`, `table_fragments`, `table_info` e `table_replicas` no banco de dados `ndbinfo`.

Todas as opções que podem ser usadas com **ndb_desc** são mostradas na tabela a seguir. Descrições adicionais seguem a tabela.

**Tabela 25.31 Opções de linha de comando usadas com o programa ndb_desc**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th scope="col">Format</th> <th scope="col">Description</th> <th scope="col">Added, Deprecated, or Removed</th> </tr></thead><tbody><tr> <th scope="row"><p> <code>--auto-inc</code>,</p><p> <code class="option"> -a </code> </p></th> <td>Mostre o próximo valor para a coluna AUTO_INCREMENT se a tabela tiver uma</td> <td><p>ADICIONADO: NDB 8.0.21</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--blob-info</code>,</p><p> <code class="option"> -b </code> </p></th> <td>Incluir informações de partição para tabelas BLOB no resultado. Requer que a opção -p também seja usada</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --character-sets-dir=path </code> </p></th> <td>Directory containing character sets</td> <td><p> REMOVED: 8.0.31 </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --connect-retries=# </code> </p></th> <td>Número de vezes para tentar a conexão novamente antes de desistir</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --connect-retry-delay=# </code> </p></th> <td>Número de segundos para esperar entre as tentativas de contato com o servidor de gerenciamento</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--connect-string=connection_string</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-desc.html#option_ndb_desc_connect-string">-c connection_string</a> </code> </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--context</code>,</p><p> <code class="option"> -x </code> </p></th> <td>Mostre informações extras para a tabela, como banco de dados, esquema, nome e ID interno</td> <td><p>ADICIONADO: NDB 8.0.21</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --core-file </code> </p></th> <td>Escreva o arquivo de núcleo em erro; usado em depuração</td> <td><p>REMOvido: 8.0.31</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--database=name</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-desc.html#option_ndb_desc_database">-d nome</a> </code> </p></th> <td>Nome do banco de dados que contém a tabela</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --defaults-extra-file=path </code> </p></th> <td>Leia o arquivo fornecido após os arquivos globais terem sido lidos</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --defaults-file=path </code> </p></th> <td>Ler opções padrão a partir do arquivo fornecido apenas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --defaults-group-suffix=string </code> </p></th> <td>Leia também grupos com concat(grupo, sufixo)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--extra-node-info</code>,</p><p> <code class="option"> -n </code> </p></th> <td>Incluir mapeamentos de partição para nó de dados no resultado; requer --extra-partition-info</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--extra-partition-info</code>,</p><p> <code class="option"> -p </code> </p></th> <td>Exibir informações sobre as partições</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--help</code>,</p><p> <code class="option"> -? </code> </p></th> <td>Exibir texto de ajuda e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --login-path=path </code> </p></th> <td>Leia o caminho fornecido a partir do arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--ndb-connectstring=connection_string</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-desc.html#option_ndb_desc_ndb-connectstring">-c connection_string</a> </code> </p></th> <td>Defina a string de conexão para se conectar ao ndb_mgmd. Sintaxe: "[nodeid=id;][host=]hostname[:port]". Supere as entradas em NDB_CONNECTSTRING e my.cnf</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--ndb-mgmd-host=connection_string</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-desc.html#option_ndb_desc_ndb-mgmd-host">-c connection_string</a> </code> </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --ndb-nodeid=# </code> </p></th> <td>Defina o ID do nó para este nó, substituindo qualquer ID definida pela opção --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --ndb-optimized-node-selection </code> </p></th> <td>Ative as otimizações para a seleção de nós para transações. Ativado por padrão; use --skip-ndb-optimized-node-selection para desativá-lo</td> <td><p>REMOvido: 8.0.31</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --no-defaults </code> </p></th> <td>Não leia as opções padrão de qualquer arquivo de opção, exceto o arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --print-defaults </code> </p></th> <td>Imprimir a lista de argumentos do programa e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--retries=#</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-desc.html#option_ndb_desc_retries">-r #</a> </code> </p></th> <td>Número de vezes para tentar a conexão novamente (uma por segundo)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--table=name</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-desc.html#option_ndb_desc_table">-t nome</a> </code> </p></th> <td>Especifique a tabela na qual você deseja encontrar um índice. Quando esta opção é usada, -p e -n não têm efeito e são ignorados.</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--unqualified</code>,</p><p> <code class="option"> -u </code> </p></th> <td>Use nomes de tabela não qualificados</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--usage</code>,</p><p> <code class="option"> -? </code> </p></th> <td>Exibir texto de ajuda e sair; o mesmo que --help</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--version</code>,</p><p> <code class="option"> -V </code> </p></th> <td>Exibir informações da versão e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody></table>

* `--auto-inc`, `-a`

Mostre o próximo valor para a coluna `AUTO_INCREMENT` de uma tabela, se tiver uma.

* `--blob-info`, `-b`

Inclua informações sobre as colunas subordinadas `BLOB` e `TEXT`.

O uso desta opção também requer o uso da opção `--extra-partition-info` (`-p`).

* `--character-sets-dir`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>

Diretório contendo conjuntos de caracteres.

* `--connect-retries`

  <table frame="box" rules="all" summary="Properties for connect-retries"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>12</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>12</code></td> </tr></tbody></table>

Número de vezes para tentar a conexão novamente antes de desistir.

* `--connect-retry-delay`

  <table frame="box" rules="all" summary="Properties for connect-retry-delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retry-delay=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>5</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>5</code></td> </tr></tbody></table>

Número de segundos para esperar entre as tentativas de contato com o servidor de gerenciamento.

* `--connect-string`

  <table frame="box" rules="all" summary="Properties for connect-string"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-string=connection_string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

O mesmo que `--ndb-connectstring`.

* `--context`, `-x`

Mostre informações contextuais adicionais para a tabela, como esquema, nome do banco de dados, nome da tabela e ID interno da tabela.

* `--core-file`

  <table frame="box" rules="all" summary="Properties for core-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--core-file</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>

Escreva o arquivo de núcleo em erro; usado em depuração.

* `--database=db_name`, `-d`

Especifique o banco de dados em que a tabela deve ser encontrada.

* `--defaults-extra-file`

  <table frame="box" rules="all" summary="Properties for defaults-extra-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-extra-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

Leia o arquivo fornecido após a leitura dos arquivos globais.

* `--defaults-file`

  <table frame="box" rules="all" summary="Properties for defaults-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

Leia as opções padrão a partir do arquivo fornecido apenas.

* `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Properties for defaults-group-suffix"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-group-suffix=string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

Leia também grupos com concatenação(grupo, sufixo).

* `--extra-node-info`, `-n`

Inclua informações sobre as mapeamentos entre as partições da tabela e os nós de dados nos quais elas residem. Essas informações podem ser úteis para verificar mecanismos de consciência de distribuição e suportar um acesso de aplicação mais eficiente aos dados armazenados no NDB Cluster.

O uso desta opção também requer o uso da opção `--extra-partition-info` (`-p`).

* `--extra-partition-info`, `-p`

Imprima informações adicionais sobre as partições da tabela.

* `--help`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

Exibir texto de ajuda e sair.

* `--login-path`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>0

Leia o caminho fornecido a partir do arquivo de login.

* `--ndb-connectstring`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>1

Defina a string de conexão para se conectar ao ndb_mgmd. Sintaxe: "[nodeid=id;][host=]hostname[:port]". Ocorre entradas em NDB_CONNECTSTRING e my.cnf.

* `--ndb-mgmd-host`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>2

O mesmo que `--ndb-connectstring`.

* `--ndb-nodeid`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>3

Defina o ID do nó para este nó, substituindo qualquer ID definida por `--ndb-connectstring`.

* `--ndb-optimized-node-selection`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>4

Ative as otimizações para a seleção de nós para transações. Ativado por padrão; use `--skip-ndb-optimized-node-selection` para desativá-lo.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>5

Não leia as opções padrão de qualquer arquivo de opção, exceto o arquivo de login.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>6

Imprimir a lista de argumentos do programa e sair.

* `--retries=#`, `-r`

Tente conectar essa quantidade de vezes antes de desistir. Uma tentativa de conexão é feita por segundo.

* `--table=tbl_name`, `-t`

Especifique a tabela na qual procurar um índice.

* `--unqualified`, `-u`

Use nomes de tabela não qualificados.

* `--usage`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>7

Exibir texto de ajuda e sair; o mesmo que `--help`.

* `--version`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>8

Exibir informações da versão e sair.

Os índices de tabela listados na saída são ordenados por ID.

### 25.5.10 ndb_drop_index — Deixar de Indexar uma Tabela NDB

**ndb_drop_index** descarta o índice especificado de uma tabela [[`NDB`]. *É recomendável que você use este utilitário apenas como exemplo para escrever aplicativos da API NDB*—consulte o Aviso mais adiante nesta seção para obter detalhes.

#### Uso

```
ndb_drop_index -c connection_string table_name index -d db_name
```

A declaração mostrada acima exclui o índice denominado *`index`* do *`table`* no *`database`*.

As opções que podem ser usadas com **ndb_drop_index** estão mostradas na tabela a seguir. Descrições adicionais seguem a tabela.

**Tabela 25.32 Opções de linha de comando usadas com o programa ndb_drop_index**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th scope="col">Format</th> <th scope="col">Description</th> <th scope="col">Added, Deprecated, or Removed</th> </tr></thead><tbody><tr> <th scope="row"><p> <code class="option"> --character-sets-dir=path </code> </p></th> <td>Directory containing character sets</td> <td><p> REMOVED: 8.0.31 </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --connect-retries=# </code> </p></th> <td>Número de vezes para tentar a conexão novamente antes de desistir</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --connect-retry-delay=# </code> </p></th> <td>Número de segundos para esperar entre as tentativas de contato com o servidor de gerenciamento</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--connect-string=connection_string</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-drop-index.html#option_ndb_drop_index_connect-string">-c connection_string</a> </code> </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --core-file </code> </p></th> <td>Escreva o arquivo de núcleo em erro; usado em depuração</td> <td><p>REMOvido: 8.0.31</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--database=name</code>,</p><p> <code>-d name</code> </p></th> <td>Nome do banco de dados em que a tabela está localizada</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --defaults-extra-file=path </code> </p></th> <td>Leia o arquivo fornecido após os arquivos globais terem sido lidos</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --defaults-file=path </code> </p></th> <td>Ler opções padrão a partir do arquivo fornecido apenas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --defaults-group-suffix=string </code> </p></th> <td>Leia também grupos com concat(grupo, sufixo)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--help</code>,</p><p> <code class="option"> -? </code> </p></th> <td>Exibir texto de ajuda e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --login-path=path </code> </p></th> <td>Leia o caminho fornecido a partir do arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--ndb-connectstring=connection_string</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-drop-index.html#option_ndb_drop_index_ndb-connectstring">-c connection_string</a> </code> </p></th> <td>Defina a string de conexão para se conectar ao ndb_mgmd. Sintaxe: "[nodeid=id;][host=]hostname[:port]". Supere as entradas em NDB_CONNECTSTRING e my.cnf</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--ndb-mgmd-host=connection_string</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-drop-index.html#option_ndb_drop_index_ndb-mgmd-host">-c connection_string</a> </code> </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --ndb-nodeid=# </code> </p></th> <td>Defina o ID do nó para este nó, substituindo qualquer ID definida pela opção --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --ndb-optimized-node-selection </code> </p></th> <td>Ative as otimizações para a seleção de nós para transações. Ativado por padrão; use --skip-ndb-optimized-node-selection para desativá-lo</td> <td><p>REMOvido: 8.0.31</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --no-defaults </code> </p></th> <td>Não leia as opções padrão de qualquer arquivo de opção, exceto o arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --print-defaults </code> </p></th> <td>Imprimir a lista de argumentos do programa e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--usage</code>,</p><p> <code class="option"> -? </code> </p></th> <td>Exibir texto de ajuda e sair; o mesmo que --help</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--version</code>,</p><p> <code class="option"> -V </code> </p></th> <td>Exibir informações da versão e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody></table>

* `--character-sets-dir`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>

Diretório contendo conjuntos de caracteres.

* `--connect-retries`

  <table frame="box" rules="all" summary="Properties for connect-retries"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>12</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>12</code></td> </tr></tbody></table>

Número de vezes para tentar a conexão novamente antes de desistir.

* `--connect-retry-delay`

  <table frame="box" rules="all" summary="Properties for connect-retry-delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retry-delay=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>5</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>5</code></td> </tr></tbody></table>

Número de segundos para esperar entre as tentativas de contato com o servidor de gerenciamento.

* `--connect-string`

  <table frame="box" rules="all" summary="Properties for connect-string"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-string=connection_string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

O mesmo que `--ndb-connectstring`.

* `--core-file`

  <table frame="box" rules="all" summary="Properties for core-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--core-file</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>

Escreva o arquivo de núcleo em erro; usado em depuração.

* `--database`, `-d`

  <table frame="box" rules="all" summary="Properties for database"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--database=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>TEST_DB</code></td> </tr></tbody></table>

Nome do banco de dados no qual a tabela reside.

* `--defaults-extra-file`

  <table frame="box" rules="all" summary="Properties for defaults-extra-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-extra-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

Leia o arquivo fornecido após a leitura dos arquivos globais.

* `--defaults-file`

  <table frame="box" rules="all" summary="Properties for defaults-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

Leia as opções padrão a partir do arquivo fornecido apenas.

* `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Properties for defaults-group-suffix"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-group-suffix=string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

Leia também grupos com concatenação(grupo, sufixo).

* `--help`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>0

Exibir texto de ajuda e sair.

* `--login-path`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>1

Leia o caminho fornecido a partir do arquivo de login.

* `--ndb-connectstring`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>2

Defina a string de conexão para se conectar ao ndb_mgmd. Sintaxe: "[nodeid=id;][host=]hostname[:port]". Ocorre entradas em NDB_CONNECTSTRING e my.cnf.

* `--ndb-mgmd-host`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>3

O mesmo que `--ndb-connectstring`.

* `--ndb-nodeid`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>4

Defina o ID do nó para este nó, substituindo qualquer ID definida por `--ndb-connectstring`.

* `--ndb-optimized-node-selection`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>5

Ative as otimizações para a seleção de nós para transações. Ativado por padrão; use `--skip-ndb-optimized-node-selection` para desativá-lo.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>6

Não leia as opções padrão de qualquer arquivo de opção, exceto o arquivo de login.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>7

Imprimir a lista de argumentos do programa e sair.

* `--usage`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>8

Exibir texto de ajuda e sair; o mesmo que `--help`.

* `--version`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>9

Exibir informações da versão e sair.

Aviso

*As operações realizadas em índices de tabelas de Cluster usando a API NDB não são visíveis para o MySQL e tornam a tabela inutilizável por um servidor MySQL*. Se você usar este programa para descartar um índice e, em seguida, tentar acessar a tabela a partir de um nó SQL, um erro resulta, como mostrado aqui:

```
$> ./ndb_drop_index -c localhost dogs ix -d ctest1
Dropping index dogs/idx...OK

$> ./mysql -u jon -p ctest1
Enter password: *******
Reading table information for completion of table and column names
You can turn off this feature to get a quicker startup with -A

Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 7 to server version: 5.7.44-ndb-7.5.36

Type 'help;' or '\h' for help. Type '\c' to clear the buffer.

mysql> SHOW TABLES;
+------------------+
| Tables_in_ctest1 |
+------------------+
| a                |
| bt1              |
| bt2              |
| dogs             |
| employees        |
| fish             |
+------------------+
6 rows in set (0.00 sec)

mysql> SELECT * FROM dogs;
ERROR 1296 (HY000): Got error 4243 'Index not found' from NDBCLUSTER
```

Nesse caso, a *única* opção para tornar a tabela disponível novamente para o MySQL é descartá-la e recriá-la. Você pode usar a instrução SQL `DROP TABLE` ou o utilitário **ndb_drop_table** (consulte Seção 25.5.11, “ndb_drop_table — Descartar uma tabela NDB”) para descartar a tabela.

### 25.5.11 ndb_drop_table — Deixar uma tabela NDB

O **ndb_drop_table** elimina a tabela especificada `NDB`. (Se você tentar usar isso em uma tabela criada com um mecanismo de armazenamento diferente de `NDB`, a tentativa falhará com o erro 723: Não existe tal tabela.) Essa operação é extremamente rápida; em alguns casos, pode ser uma ordem de magnitude mais rápida do que usar uma declaração MySQL `DROP TABLE` em uma tabela `NDB`.

#### Uso

```
ndb_drop_table -c connection_string tbl_name -d db_name
```

As opções que podem ser usadas com **ndb_drop_table** estão mostradas na tabela a seguir. Descrições adicionais seguem a tabela.

**Tabela 25.33 Opções de linha de comando usadas com o programa ndb_drop_table**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th scope="col">Format</th> <th scope="col">Description</th> <th scope="col">Added, Deprecated, or Removed</th> </tr></thead><tbody><tr> <th scope="row"><p> <code class="option"> --character-sets-dir=path </code> </p></th> <td>Directory containing character sets</td> <td><p> REMOVED: 8.0.31 </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --connect-retries=# </code> </p></th> <td>Número de vezes para tentar a conexão novamente antes de desistir</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --connect-retry-delay=# </code> </p></th> <td>Número de segundos para esperar entre as tentativas de contato com o servidor de gerenciamento</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--connect-string=connection_string</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-drop-table.html#option_ndb_drop_table_connect-string">-c connection_string</a> </code> </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --core-file </code> </p></th> <td>Escreva o arquivo de núcleo em erro; usado em depuração</td> <td><p>REMOvido: 8.0.31</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--database=name</code>,</p><p> <code>-d name</code> </p></th> <td>Nome do banco de dados em que a tabela está localizada</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --defaults-extra-file=path </code> </p></th> <td>Leia o arquivo fornecido após os arquivos globais terem sido lidos</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --defaults-file=path </code> </p></th> <td>Ler opções padrão a partir do arquivo fornecido apenas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --defaults-group-suffix=string </code> </p></th> <td>Leia também grupos com concat(grupo, sufixo)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--help</code>,</p><p> <code class="option"> -? </code> </p></th> <td>Exibir texto de ajuda e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --login-path=path </code> </p></th> <td>Leia o caminho fornecido a partir do arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--ndb-connectstring=connection_string</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-drop-table.html#option_ndb_drop_table_ndb-connectstring">-c connection_string</a> </code> </p></th> <td>Defina a string de conexão para se conectar ao ndb_mgmd. Sintaxe: "[nodeid=id;][host=]hostname[:port]". Supere as entradas em NDB_CONNECTSTRING e my.cnf</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--ndb-mgmd-host=connection_string</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-drop-table.html#option_ndb_drop_table_ndb-mgmd-host">-c connection_string</a> </code> </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --ndb-nodeid=# </code> </p></th> <td>Defina o ID do nó para este nó, substituindo qualquer ID definida pela opção --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --ndb-optimized-node-selection </code> </p></th> <td>Ative as otimizações para a seleção de nós para transações. Ativado por padrão; use --skip-ndb-optimized-node-selection para desativá-lo</td> <td><p>REMOvido: 8.0.31</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --no-defaults </code> </p></th> <td>Não leia as opções padrão de qualquer arquivo de opção, exceto o arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --print-defaults </code> </p></th> <td>Imprimir a lista de argumentos do programa e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--usage</code>,</p><p> <code class="option"> -? </code> </p></th> <td>Exibir texto de ajuda e sair; o mesmo que --help</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--version</code>,</p><p> <code class="option"> -V </code> </p></th> <td>Exibir informações da versão e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody></table>

* `--character-sets-dir`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>

Diretório contendo conjuntos de caracteres.

* `--connect-retries`

  <table frame="box" rules="all" summary="Properties for connect-retries"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>12</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>12</code></td> </tr></tbody></table>

Número de vezes para tentar a conexão novamente antes de desistir.

* `--connect-retry-delay`

  <table frame="box" rules="all" summary="Properties for connect-retry-delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retry-delay=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>5</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>5</code></td> </tr></tbody></table>

Número de segundos para esperar entre as tentativas de contato com o servidor de gerenciamento.

* `--connect-string`

  <table frame="box" rules="all" summary="Properties for connect-string"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-string=connection_string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

O mesmo que `--ndb-connectstring`.

* `--core-file`

  <table frame="box" rules="all" summary="Properties for core-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--core-file</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>

Escreva o arquivo de núcleo em erro; usado em depuração.

* `--database`, `-d`

  <table frame="box" rules="all" summary="Properties for database"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--database=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>TEST_DB</code></td> </tr></tbody></table>

Nome do banco de dados no qual a tabela reside.

* `--defaults-extra-file`

  <table frame="box" rules="all" summary="Properties for defaults-extra-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-extra-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

Leia o arquivo fornecido após a leitura dos arquivos globais.

* `--defaults-file`

  <table frame="box" rules="all" summary="Properties for defaults-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

Leia as opções padrão a partir do arquivo fornecido apenas.

* `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Properties for defaults-group-suffix"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-group-suffix=string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

Leia também grupos com concatenação(grupo, sufixo).

* `--help`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>0

Exibir texto de ajuda e sair.

* `--login-path`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>1

Leia o caminho fornecido a partir do arquivo de login.

* `--ndb-connectstring`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>2

Defina a string de conexão para se conectar ao ndb_mgmd. Sintaxe: "[nodeid=id;][host=]hostname[:port]". Ocorre entradas em NDB_CONNECTSTRING e my.cnf.

* `--ndb-mgmd-host`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>3

O mesmo que `--ndb-connectstring`.

* `--ndb-nodeid`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>4

Defina o ID do nó para este nó, substituindo qualquer ID definida por `--ndb-connectstring`.

* `--ndb-optimized-node-selection`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>5

Ative as otimizações para a seleção de nós para transações. Ativado por padrão; use `--skip-ndb-optimized-node-selection` para desativá-lo.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>6

Não leia as opções padrão de qualquer arquivo de opção, exceto o arquivo de login.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>7

Imprimir a lista de argumentos do programa e sair.

* `--usage`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>8

Exibir texto de ajuda e sair; o mesmo que `--help`.

* `--version`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>9

Exibir informações da versão e sair.

### 25.5.12 ndb_error_reporter — Ferramenta de Relatório de Erros NDB

O **ndb_error_reporter** cria um arquivo com os arquivos de log dos nós de dados e de gerenciamento que podem ser usados para ajudar a diagnosticar bugs ou outros problemas em um clúster. *É altamente recomendado que você utilize este utilitário ao relatar bugs no NDB Cluster*.

As opções que podem ser usadas com **ndb_error_reporter** são mostradas na tabela a seguir. Descrições adicionais seguem a tabela.

**Tabela 25.34 Opções de linha de comando usadas com o programa ndb_error_reporter**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th scope="col">Format</th> <th scope="col">Description</th> <th scope="col">Added, Deprecated, or Removed</th> </tr></thead><tbody><tr> <th scope="row"><p> <code class="option"> --connection-timeout=# </code> </p></th> <td>Número de segundos para esperar ao se conectar a nós antes de esgotar o tempo</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --dry-scp </code> </p></th> <td>Desative o scp com hosts remotos; usado apenas em testes</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --fs </code> </p></th> <td>Incluir dados do sistema de arquivos no relatório de erro; pode usar uma grande quantidade de espaço em disco</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--help</code>,</p><p> <code class="option"> -? </code> </p></th> <td>Exibir texto de ajuda e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --skip-nodegroup=# </code> </p></th> <td>Pular todos os nós no grupo de nós que têm este ID</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody></table>

#### Uso

```
ndb_error_reporter path/to/config-file [username] [options]
```

Este utilitário é destinado ao uso em um nó de gerenciamento e requer o caminho para o arquivo de configuração do host de gerenciamento (geralmente denominado `config.ini`). Opcionalmente, você pode fornecer o nome de um usuário que possa acessar os nós de dados do clúster usando SSH, para copiar os arquivos de log do nó de dados. O **ndb_error_reporter** inclui então todos esses arquivos em um arquivo que é criado no mesmo diretório em que é executado. O arquivo é denominado `ndb_error_report_YYYYMMDDhhmmss.tar.bz2`, onde *`YYYYMMDDhhmmss`* é uma string de data e hora.

O **ndb_error_reporter** também aceita as opções listadas aqui:

* `--connection-timeout=timeout`

  <table frame="box" rules="all" summary="Properties for connection-timeout"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connection-timeout=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr></tbody></table>

Aguarde tantos segundos ao tentar se conectar aos nós antes de expirar o tempo.

* `--dry-scp`

  <table frame="box" rules="all" summary="Properties for dry-scp"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--dry-scp</code></td> </tr></tbody></table>

Execute o **ndb_error_reporter** sem usar scp de hosts remotos. Usado apenas para testes.

* `--help`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

Exibir texto de ajuda e sair.

* `--fs`

  <table frame="box" rules="all" summary="Properties for fs"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--fs</code></td> </tr></tbody></table>

Copie os sistemas de arquivos dos nós de dados para o host de gerenciamento e inclua-os no arquivo.

Como os sistemas de arquivos de nós de dados podem ser extremamente grandes, mesmo após serem comprimidos, pedimos que você não envie arquivos criados usando essa opção para a Oracle, a menos que você seja especificamente solicitado a fazer isso.

* `--skip-nodegroup=nodegroup_id`

  <table frame="box" rules="all" summary="Properties for connection-timeout"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connection-timeout=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr></tbody></table>

Ignorar todos os nós que pertencem ao grupo de nós que tem o ID de grupo de nós fornecido.

### 25.5.13 ndb_import — Importar dados CSV no NDB

O **ndb_import** importa dados formatados em CSV, como os produzidos pelo **mysqldump** `--tab`, diretamente para o `NDB` usando a API NDB. O **ndb_import** requer uma conexão a um servidor de gerenciamento NDB (**ndb_mgmd**) para funcionar; ele não requer uma conexão a um servidor MySQL.

#### Uso

```
ndb_import db_name file_name options
```

O **ndb_import** requer dois argumentos. *`db_name`* é o nome do banco de dados onde a tabela na qual os dados serão importados é encontrada; *`file_name`* é o nome do arquivo CSV a partir do qual os dados serão lidos; este deve incluir o caminho para este arquivo, se não estiver no diretório atual. O nome do arquivo deve corresponder ao da tabela; a extensão do arquivo, se houver, não é considerada. As opções suportadas pelo **ndb_import** incluem as especificações de separadores de campo, escapamentos e terminadores de linha, e são descritas mais adiante nesta seção.

Antes da NDB 8.0.30, o **ndb_import** rejeita quaisquer linhas vazias que ele lê do arquivo CSV. A partir da NDB 8.0.30, ao importar uma única coluna, um valor vazio que pode ser usado como o valor da coluna, o ndb_import o trata da mesma maneira que uma declaração `LOAD DATA` faz.

O **ndb_import** deve ser capaz de se conectar a um servidor de gerenciamento do NDB Cluster; por essa razão, deve haver um slot `[api]` não utilizado no arquivo do cluster `config.ini`.

Para duplicar uma tabela existente que utiliza um motor de armazenamento diferente, como `InnoDB`, como uma tabela `NDB`, use o cliente **mysql** para executar uma declaração [`SELECT INTO OUTFILE`](select-into.html "15.2.13.1 SELECT ... INTO Statement") para exportar a tabela existente para um arquivo CSV, em seguida, execute uma declaração [`CREATE TABLE LIKE`](create-table-like.html "15.1.20.3 CREATE TABLE ... LIKE Statement") para criar uma nova tabela com a mesma estrutura da tabela existente, em seguida, realize [`ALTER TABLE ... ENGINE=NDB`](alter-table.html "15.1.9 ALTER TABLE Statement") na nova tabela; após isso, a partir da linha de comando do sistema, invoque **ndb_import** para carregar os dados na nova tabela `NDB`. Por exemplo, uma tabela existente `InnoDB` chamada `myinnodb_table` em um banco de dados chamado `myinnodb` pode ser exportada para uma tabela `NDB` chamada `myndb_table` em um banco de dados chamado `myndb` como mostrado aqui, assumindo que você já está logado como um usuário MySQL com os privilégios apropriados:

1. No cliente **mysql**:

   ```
   mysql> USE myinnodb;

   mysql> SELECT * INTO OUTFILE '/tmp/myndb_table.csv'
        >  FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"' ESCAPED BY '\\'
        >  LINES TERMINATED BY '\n'
        >  FROM myinnodbtable;

   mysql> CREATE DATABASE myndb;

   mysql> USE myndb;

   mysql> CREATE TABLE myndb_table LIKE myinnodb.myinnodb_table;

   mysql> ALTER TABLE myndb_table ENGINE=NDB;

   mysql> EXIT;
   Bye
   $>
   ```

Uma vez que o banco de dados e a tabela de destino tenham sido criados, um **mysqld** em execução não é mais necessário. Você pode interromper-lo usando **mysqladmin shutdown** ou outro método, se desejar.

2. Na janela do sistema:

   ```
   # if you are not already in the MySQL bin directory:
   $> cd path-to-mysql-bin-dir

   $> ndb_import myndb /tmp/myndb_table.csv --fields-optionally-enclosed-by='"' \
       --fields-terminated-by="," --fields-escaped-by='\\'
   ```

A saída deve se assemelhar àquela que é mostrada aqui:

   ```
   job-1 import myndb.myndb_table from /tmp/myndb_table.csv
   job-1 [running] import myndb.myndb_table from /tmp/myndb_table.csv
   job-1 [success] import myndb.myndb_table from /tmp/myndb_table.csv
   job-1 imported 19984 rows in 0h0m9s at 2277 rows/s
   jobs summary: defined: 1 run: 1 with success: 1 with failure: 0
   $>
   ```

Todas as opções que podem ser usadas com **ndb_import** são mostradas na tabela a seguir. Descrições adicionais seguem a tabela.

**Tabela 25.35 Opções de linha de comando usadas com o programa ndb_import**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th scope="col">Format</th> <th scope="col">Description</th> <th scope="col">Added, Deprecated, or Removed</th> </tr></thead><tbody><tr> <th scope="row"><p> <code class="option"> --abort-on-error </code> </p></th> <td>Arrume o núcleo em qualquer erro fatal; usado para depuração</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --ai-increment=# </code> </p></th> <td>Para uma tabela com PK oculto, especifique o incremento de autoincremento. Veja mysqld</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --ai-offset=# </code> </p></th> <td>Para uma tabela com PK oculto, especifique o deslocamento de autoincremento. Veja mysqld</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --ai-prefetch-sz=# </code> </p></th> <td>Para uma tabela com PK oculto, especifique o número de valores de autoincremento que são pré-carregados. Veja mysqld</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --character-sets-dir=path </code> </p></th> <td>Diretório contendo conjuntos de caracteres</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --connect-retries=# </code> </p></th> <td>Número de vezes para tentar a conexão novamente antes de desistir</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --connect-retry-delay=# </code> </p></th> <td>Número de segundos para esperar entre as tentativas de contato com o servidor de gerenciamento</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--connect-string=connection_string</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_connect-string">-c connection_string</a> </code> </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --connections=# </code> </p></th> <td>Número de conexões de cluster a criar</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --continue </code> </p></th> <td>Quando o trabalho falhar, continue para o próximo trabalho</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --core-file </code> </p></th> <td>Escreva o arquivo de núcleo em erro; usado em depuração</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --csvopt=opts </code> </p></th> <td>Opção abreviada para definir valores típicos de opções CSV. Consulte a documentação para obter informações sobre sintaxe e outras informações</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --db-workers=# </code> </p></th> <td>Número de threads, por nó de dados, executando operações de banco de dados</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --defaults-extra-file=path </code> </p></th> <td>Leia o arquivo fornecido após os arquivos globais terem sido lidos</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --defaults-file=path </code> </p></th> <td>Ler opções padrão a partir do arquivo fornecido apenas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --defaults-group-suffix=string </code> </p></th> <td>Leia também grupos com concat(grupo, sufixo)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --errins-type=name </code> </p></th> <td>Tipo de inserção de erro, para fins de teste; use "lista" para obter todos os valores possíveis</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --errins-delay=# </code> </p></th> <td>Atraso de inserção de erro em milissegundos; variação aleatória é adicionada</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --fields-enclosed-by=char </code> </p></th> <td>O mesmo que a opção FIELDS ENCLOSED BY para as instruções LOAD DATA. Para entrada CSV, isso é o mesmo que usar a opção --fields-opcionalmente-enclosed-by</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --fields-escaped-by=char </code> </p></th> <td>Igual à opção FIELDS ESCAPED BY para as instruções LOAD DATA</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --fields-optionally-enclosed-by=char </code> </p></th> <td>O mesmo que as opções de campos opcionais encerradas por opção para as instruções LOAD DATA</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --fields-terminated-by=char </code> </p></th> <td>Assim como a opção TERMINADOS POR CAMPOS para as instruções LOAD DATA</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--help</code>,</p><p> <code class="option"> -? </code> </p></th> <td>Exibir texto de ajuda e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --idlesleep=# </code> </p></th> <td>Número de milissegundos para dormir enquanto espera mais para fazer</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --idlespin=# </code> </p></th> <td>Número de vezes para tentar novamente antes de idlesleep</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --ignore-lines=# </code> </p></th> <td>Ignore as primeiras linhas do arquivo de entrada. Usado para ignorar um cabeçalho não de dados</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --input-type=name </code> </p></th> <td>Tipo de entrada: aleatório ou csv</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --input-workers=# </code> </p></th> <td>Número de threads processando a entrada. Deve ser 2 ou mais se --input-type for csv</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --keep-state </code> </p></th> <td>Os arquivos de estado (exceto arquivos não vazios *.rej) são normalmente removidos após a conclusão do trabalho. Ao usar esta opção, todos os arquivos de estado são preservados em vez disso.</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --lines-terminated-by=char </code> </p></th> <td>O mesmo que a opção LINHAS TERMINADAS POR para as instruções LOAD DATA</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --login-path=path </code> </p></th> <td>Leia o caminho fornecido a partir do arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --max-rows=# </code> </p></th> <td>Importe apenas esse número de linhas de dados de entrada; o padrão é 0, que importa todas as linhas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --missing-ai-column='name' </code> </p></th> <td>Indica que os valores de autoincremento estão ausentes no arquivo CSV a ser importado.</td> <td><p>ADICIONADO: NDB 8.0.30</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --monitor=# </code> </p></th> <td>Imprima periodicamente o status do trabalho em execução se algo tiver mudado (status, linhas rejeitadas, erros temporários). O valor 0 desativa. O valor 1 imprime qualquer mudança observada. Valores mais altos reduzem a impressão do status exponencialmente até um limite pré-definido</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--ndb-connectstring=connection_string</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_ndb-connectstring">-c connection_string</a> </code> </p></th> <td>Defina a string de conexão para se conectar ao ndb_mgmd. Sintaxe: "[nodeid=id;][host=]hostname[:port]". Supere as entradas em NDB_CONNECTSTRING e my.cnf</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--ndb-mgmd-host=connection_string</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_ndb-mgmd-host">-c connection_string</a> </code> </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --ndb-nodeid=# </code> </p></th> <td>Defina o ID do nó para este nó, substituindo qualquer ID definida pela opção --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --ndb-optimized-node-selection </code> </p></th> <td>Ative as otimizações para a seleção de nós para transações. Ativado por padrão; use --skip-ndb-optimized-node-selection para desativá-lo</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --no-asynch </code> </p></th> <td>Execute operações de banco de dados em lotes, em transações únicas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --no-defaults </code> </p></th> <td>Não leia as opções padrão de qualquer arquivo de opção, exceto o arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --no-hint </code> </p></th> <td>Informe ao coordenador de transação que não utilize a dica de chave de distribuição ao selecionar o nó de dados</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --opbatch=# </code> </p></th> <td>Um lote de execução de banco de dados é um conjunto de transações e operações enviadas ao kernel NDB. Esta opção limita as operações do NDB (incluindo operações de blob) em um lote de execução de banco de dados. Portanto, também limita o número de transações assíncronas. O valor 0 não é válido</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --opbytes=# </code> </p></th> <td>Limitar bytes no lote de execução (padrão 0 = sem limite)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --output-type=name </code> </p></th> <td>Tipo de saída: ndb é o padrão, nulo é usado para testes</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --output-workers=# </code> </p></th> <td>Número de threads que processam a saída ou transmitem operações de banco de dados</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --pagesize=# </code> </p></th> <td>Alinhar buffers de I/O ao tamanho especificado</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --pagecnt=# </code> </p></th> <td>Tamanho dos buffers de E/S como múltiplo do tamanho da página. O trabalhador de entrada CSV aloca um buffer de tamanho duplo</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --polltimeout=# </code> </p></th> <td>Tempo de espera por pesquisa para transações assíncronas concluídas; a pesquisa continua até que todas as pesquisas sejam concluídas ou ocorra um erro</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --print-defaults </code> </p></th> <td>Imprimir a lista de argumentos do programa e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --rejects=# </code> </p></th> <td>Limite o número de linhas rejeitadas (linhas com erro permanente) na carga de dados. O padrão é 0, o que significa que qualquer linha rejeitada causa um erro fatal. A linha que excede o limite também é adicionada a *.rej</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --resume </code> </p></th> <td>Se o trabalho for abortado (erro temporário, usuário interrompe), retome com as linhas que ainda não foram processadas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --rowbatch=# </code> </p></th> <td>Limitar filas de linhas (padrão 0 = sem limite); deve ser 1 ou mais se --input-type for aleatório</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --rowbytes=# </code> </p></th> <td>Limitar bytes nas filas de linha (0 = sem limite)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --state-dir=path </code> </p></th> <td>Onde escrever arquivos de estado; o diretório atual é o padrão</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --stats </code> </p></th> <td>Salve as opções relacionadas ao desempenho e as estatísticas internas em arquivos *.sto e *.stt. Esses arquivos são mantidos após a conclusão bem-sucedida, mesmo que a opção --keep-state não seja usada.</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--table=name</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_table">-t nome</a> </code> </p></th> <td>Nome do destino para importar os dados; o nome padrão é o nome da base do arquivo de entrada</td> <td><p>ADICIONADO: NDB 8.0.28</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --tempdelay=# </code> </p></th> <td>Número de milissegundos para dormir entre erros temporários</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --temperrors=# </code> </p></th> <td>Número de vezes que uma transação pode falhar devido a um erro temporário, por lote de execução; 0 significa que qualquer erro temporário é fatal. Esses erros não fazem com que nenhuma linha seja escrita no arquivo .rej</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--usage</code>,</p><p> <code class="option"> -? </code> </p></th> <td>Exibir texto de ajuda e sair; o mesmo que --help</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--verbose[=#]</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_verbose">-v [#]</a> </code> </p></th> <td>Ative a saída detalhada</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--version</code>,</p><p> <code class="option"> -V </code> </p></th> <td>Exibir informações da versão e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody></table>

* `--abort-on-error`

  <table frame="box" rules="all" summary="Properties for abort-on-error"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--abort-on-error</code></td> </tr></tbody></table>

Armazene o núcleo em qualquer erro fatal; usado apenas para depuração.

* `--ai-increment`=*`#`*

  <table frame="box" rules="all" summary="Properties for ai-increment"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ai-increment=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>

Para uma tabela com uma chave primária oculta, especifique o incremento de autoincremento, como a variável de sistema `auto_increment_increment` faz no MySQL Server.

* `--ai-offset`=*`#`*

  <table frame="box" rules="all" summary="Properties for ai-offset"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ai-offset=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>

Para uma tabela com chave primária oculta, especifique o deslocamento de autoincremento. Semelhante à variável de sistema `auto_increment_offset`.

* `--ai-prefetch-sz`=*`#`*

  <table frame="box" rules="all" summary="Properties for ai-prefetch-sz"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ai-prefetch-sz=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1024</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>

Para uma tabela com uma chave primária oculta, especifique o número de valores de autoincremento que são pré-carregados. Comporta-se como a variável do sistema `ndb_autoincrement_prefetch_sz` faz no MySQL Server.

* `--character-sets-dir`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

Diretório contendo conjuntos de caracteres.

* `--connections`=*`#`*

  <table frame="box" rules="all" summary="Properties for connections"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connections=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>

Número de conexões de cluster a serem criadas.

* `--connect-retries`

  <table frame="box" rules="all" summary="Properties for connect-retries"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>12</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>12</code></td> </tr></tbody></table>

Número de vezes para tentar a conexão novamente antes de desistir.

* `--connect-retry-delay`

  <table frame="box" rules="all" summary="Properties for connect-retry-delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retry-delay=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>5</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>5</code></td> </tr></tbody></table>

Número de segundos para esperar entre as tentativas de contato com o servidor de gerenciamento.

* `--connect-string`

  <table frame="box" rules="all" summary="Properties for connect-string"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-string=connection_string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

O mesmo que `--ndb-connectstring`.

* `--continue`

  <table frame="box" rules="all" summary="Properties for abort-on-error"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--abort-on-error</code></td> </tr></tbody></table>0

Quando um trabalho falhar, continue para o próximo trabalho.

* `--core-file`

  <table frame="box" rules="all" summary="Properties for abort-on-error"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--abort-on-error</code></td> </tr></tbody></table>1

Escreva o arquivo de núcleo em erro; usado em depuração.

* `--csvopt`=*`string`*

  <table frame="box" rules="all" summary="Properties for abort-on-error"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--abort-on-error</code></td> </tr></tbody></table>2

Fornece um método de atalho para definir opções típicas de importação de CSV. O argumento desta opção é uma string que consiste em um ou mais dos seguintes parâmetros:

+ `c`: Campos terminados por vírgula
  + `d`: Use os padrões, exceto quando sobrescrito por outro parâmetro

+ `n`: Linhas terminadas por `\n`

+ `q`: Campos opcionalmente encerrados por caracteres de aspas duplas (`"`)

+ `r`: Linha terminada por `\r`

No NDB 8.0.28 e versões posteriores, a ordem dos parâmetros utilizados no argumento desta opção é tratada de forma que o parâmetro mais à direita sempre tem precedência sobre quaisquer parâmetros potencialmente conflitantes que já tenham sido utilizados no mesmo valor do argumento. Isso também se aplica a quaisquer instâncias duplicadas de um parâmetro dado. Antes do NDB 8.0.28, a ordem dos parâmetros não fazia diferença, exceto que, quando `n` e `r` eram especificados, o último (mais à direita) era o parâmetro que realmente tinha efeito.

Esta opção é destinada a ser usada em testes em condições nas quais é difícil transmitir escapamentos ou aspas.

* `--db-workers`=*`#`*

  <table frame="box" rules="all" summary="Properties for abort-on-error"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--abort-on-error</code></td> </tr></tbody></table>3

Número de threads, por nó de dados, executando operações de banco de dados.

* `--defaults-file`

  <table frame="box" rules="all" summary="Properties for abort-on-error"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--abort-on-error</code></td> </tr></tbody></table>4

Leia as opções padrão a partir do arquivo fornecido apenas.

* `--defaults-extra-file`

  <table frame="box" rules="all" summary="Properties for abort-on-error"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--abort-on-error</code></td> </tr></tbody></table>5

Leia o arquivo fornecido após a leitura dos arquivos globais.

* `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Properties for abort-on-error"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--abort-on-error</code></td> </tr></tbody></table>6

Leia também grupos com concatenação(grupo, sufixo).

* `--errins-type`=*`name`*

  <table frame="box" rules="all" summary="Properties for abort-on-error"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--abort-on-error</code></td> </tr></tbody></table>7

Erro do tipo de inserção; use `list` como o valor *`name`* para obter todos os valores possíveis. Esta opção é usada apenas para fins de teste.

* `--errins-delay`=*`#`*

  <table frame="box" rules="all" summary="Properties for abort-on-error"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--abort-on-error</code></td> </tr></tbody></table>8

Atraso de inserção de erro em milissegundos; variação aleatória é adicionada. Esta opção é usada apenas para fins de teste.

* `--fields-enclosed-by`=*`char`*

  <table frame="box" rules="all" summary="Properties for abort-on-error"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--abort-on-error</code></td> </tr></tbody></table>9

Isso funciona da mesma maneira que a opção `FIELDS ENCLOSED BY` para a declaração [[PH_LNK_1617]], especificando um caractere a ser interpretado como campo de citação. Para entrada CSV, isso é o mesmo que `--fields-optionally-enclosed-by`.

* `--fields-escaped-by`=*`name`*

  <table frame="box" rules="all" summary="Properties for ai-increment"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ai-increment=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>0

Especifique um caractere de escape da mesma maneira que a opção `FIELDS ESCAPED BY` faz para a declaração SQL `LOAD DATA`.

* `--fields-optionally-enclosed-by`=*`char`*

  <table frame="box" rules="all" summary="Properties for ai-increment"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ai-increment=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>1

Isso funciona da mesma maneira que a opção `FIELDS OPTIONALLY ENCLOSED BY` para a declaração `LOAD DATA`, especificando um caractere a ser interpretado como citação opcional de valores de campo. Para entrada CSV, isso é o mesmo que `--fields-enclosed-by`.

* `--fields-terminated-by`=*`char`*

  <table frame="box" rules="all" summary="Properties for ai-increment"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ai-increment=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>2

Isso funciona da mesma maneira que a opção `FIELDS TERMINATED BY` para a declaração (load-data.html "15.2.9 LOAD DATA Statement"), especificando um caractere a ser interpretado como o separador de campo.

* `--help`

  <table frame="box" rules="all" summary="Properties for ai-increment"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ai-increment=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>3

Exibir texto de ajuda e sair.

* `--idlesleep`=*`#`*

  <table frame="box" rules="all" summary="Properties for ai-increment"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ai-increment=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>4

Número de milissegundos para dormir enquanto espera para realizar mais trabalho.

* `--idlespin`=*`#`*

  <table frame="box" rules="all" summary="Properties for ai-increment"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ai-increment=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>5

Número de vezes para tentar novamente antes de dormir.

* `--ignore-lines`=*`#`*

  <table frame="box" rules="all" summary="Properties for ai-increment"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ai-increment=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>6

Faça com que ndb_import ignore as primeiras linhas *`#`* do arquivo de entrada. Isso pode ser empregado para ignorar um cabeçalho de arquivo que não contém nenhum dado.

* `--input-type`=*`name`*

  <table frame="box" rules="all" summary="Properties for ai-increment"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ai-increment=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>7

Defina o tipo de tipo de entrada. O padrão é `csv`; `random` é destinado apenas para fins de teste.

* `--input-workers`=*`#`*

  <table frame="box" rules="all" summary="Properties for ai-increment"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ai-increment=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>8

Defina o número de threads que processam a entrada.

* `--keep-state`

  <table frame="box" rules="all" summary="Properties for ai-increment"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ai-increment=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>9

Por padrão, o ndb_import remove todos os arquivos de estado (exceto os arquivos não vazios `*.rej`) quando completa uma tarefa. Especifique esta opção (não é necessário nenhum argumento) para forçar o programa a reter todos os arquivos de estado em vez disso.

* `--lines-terminated-by`=*`name`*

  <table frame="box" rules="all" summary="Properties for ai-offset"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ai-offset=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>0

Isso funciona da mesma maneira que a opção `LINES TERMINATED BY` para a declaração (load-data.html "15.2.9 LOAD DATA Statement"), especificando um caractere a ser interpretado como fim de linha.

* `--log-level`=*`#`*

  <table frame="box" rules="all" summary="Properties for ai-offset"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ai-offset=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>1

Realiza registro interno no nível especificado. Esta opção é destinada principalmente para uso interno e de desenvolvimento.

Apenas nas edições de depuração do NDB, o nível de registro pode ser ajustado usando esta opção, até um máximo de 4.

* `--login-path`

  <table frame="box" rules="all" summary="Properties for ai-offset"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ai-offset=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>2

Leia o caminho fornecido a partir do arquivo de login.

* `--max-rows`=*`#`*

  <table frame="box" rules="all" summary="Properties for ai-offset"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ai-offset=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>3

Importe apenas esse número de linhas de dados de entrada; o padrão é 0, que importa todas as linhas.

* `--missing-ai-column`

  <table frame="box" rules="all" summary="Properties for ai-offset"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ai-offset=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>4

Essa opção pode ser empregada ao importar uma única tabela ou várias tabelas. Quando usada, indica que o arquivo CSV que está sendo importado não contém quaisquer valores para uma coluna `AUTO_INCREMENT`, e que o **ndb_import** deve fornecê-los; se a opção for usada e a coluna `AUTO_INCREMENT` contiver quaisquer valores, a operação de importação não pode prosseguir.

* `--monitor`=*`#`*

  <table frame="box" rules="all" summary="Properties for ai-offset"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ai-offset=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>5

Imprima periodicamente o status de um trabalho em execução se algo tiver mudado (status, linhas rejeitadas, erros temporários). Defina para 0 para desabilitar este relatório. Definir para 1 imprime qualquer mudança que seja vista. Valores mais altos reduzem a frequência deste relatório de status.

* `--ndb-connectstring`

  <table frame="box" rules="all" summary="Properties for ai-offset"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ai-offset=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>6

Defina a string de conexão para se conectar ao ndb_mgmd. Sintaxe: "[nodeid=id;][host=]hostname[:port]". Ocorre entradas em NDB_CONNECTSTRING e my.cnf.

* `--ndb-mgmd-host`

  <table frame="box" rules="all" summary="Properties for ai-offset"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ai-offset=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>7

O mesmo que `--ndb-connectstring`.

* `--ndb-nodeid`

  <table frame="box" rules="all" summary="Properties for ai-offset"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ai-offset=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>8

Defina o ID do nó para este nó, substituindo qualquer ID definida por `--ndb-connectstring`.

* `--ndb-optimized-node-selection`

  <table frame="box" rules="all" summary="Properties for ai-offset"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ai-offset=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>9

Ative as otimizações para a seleção de nós para transações. Ativado por padrão; use `--skip-ndb-optimized-node-selection` para desativá-lo.

* `--no-asynch`

  <table frame="box" rules="all" summary="Properties for ai-prefetch-sz"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ai-prefetch-sz=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1024</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>0

Execute operações de banco de dados em lotes, em transações únicas.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for ai-prefetch-sz"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ai-prefetch-sz=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1024</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>1

Não leia as opções padrão de qualquer arquivo de opção, exceto o arquivo de login.

* `--no-hint`

  <table frame="box" rules="all" summary="Properties for ai-prefetch-sz"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ai-prefetch-sz=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1024</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>2

Não use a chave de distribuição para indicar a seleção de um nó de dados.

* `--opbatch`=*`#`*

  <table frame="box" rules="all" summary="Properties for ai-prefetch-sz"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ai-prefetch-sz=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1024</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>3

Defina um limite para o número de operações (incluindo operações de blob) e, assim, para o número de transações assíncronas por lote de execução.

* `--opbytes`=*`#`*

  <table frame="box" rules="all" summary="Properties for ai-prefetch-sz"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ai-prefetch-sz=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1024</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>4

Defina um limite para o número de bytes por lote de execução. Use 0 para sem limite.

* `--output-type`=*`name`*

  <table frame="box" rules="all" summary="Properties for ai-prefetch-sz"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ai-prefetch-sz=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1024</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>5

Defina o tipo de saída. `ndb` é o padrão. `null` é usado apenas para testes.

* `--output-workers`=*`#`*

  <table frame="box" rules="all" summary="Properties for ai-prefetch-sz"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ai-prefetch-sz=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1024</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>6

Defina o número de threads que processam a saída ou transmitem operações de banco de dados.

* `--pagesize`=*`#`*

  <table frame="box" rules="all" summary="Properties for ai-prefetch-sz"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ai-prefetch-sz=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1024</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>7

Alinhe os buffers de I/O ao tamanho especificado.

* `--pagecnt`=*`#`*

  <table frame="box" rules="all" summary="Properties for ai-prefetch-sz"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ai-prefetch-sz=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1024</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>8

Defina o tamanho dos buffers de E/S como múltiplo do tamanho da página. O trabalhador de entrada CSV aloca um buffer com tamanho dobrado.

* `--polltimeout`=*`#`*

  <table frame="box" rules="all" summary="Properties for ai-prefetch-sz"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ai-prefetch-sz=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1024</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>9

Defina um tempo limite por pesquisa para transações assíncronas concluídas; a pesquisa continua até que todas as pesquisas sejam concluídas ou até que ocorra um erro.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>0

Imprimir a lista de argumentos do programa e sair.

* `--rejects`=*`#`*

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>1

Limite o número de linhas rejeitadas (linhas com erros permanentes) na carga de dados. O padrão é 0, o que significa que qualquer linha rejeitada causa um erro fatal. Quaisquer linhas que excedam o limite são adicionadas ao arquivo `.rej`.

O limite imposto por esta opção é eficaz durante a duração da execução atual. Uma execução reiniciada usando `--resume` é considerada uma "nova" execução para este propósito.

* `--resume`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>2

Se um trabalho for abortado (devido a um erro temporário no banco de dados ou quando interrompido pelo usuário), continue com todas as linhas que ainda não foram processadas.

* `--rowbatch`=*`#`*

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>3

Defina um limite para o número de linhas por fila de linhas. Use 0 para sem limite.

* `--rowbytes`=*`#`*

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>4

Defina um limite para o número de bytes por fila de linha. Use 0 para sem limite.

* `--stats`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>5

Salve as informações sobre as opções relacionadas ao desempenho e outras estatísticas internas em arquivos com os nomes `*.sto` e `*.stt`. Esses arquivos são sempre mantidos após a conclusão bem-sucedida (mesmo que `--keep-state` não seja também especificado).

* `--state-dir`=*`name`*

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>6

Onde escrever os arquivos do estado (`tbl_name.map`, `tbl_name.rej`, `tbl_name.res` e `tbl_name.stt`) produzidos por uma execução do programa; o padrão é o diretório atual.

* `--table=name`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>7

Por padrão, o **ndb_import** tenta importar dados em uma tabela cujo nome é o nome base do arquivo CSV do qual os dados estão sendo lidos. A partir do NDB 8.0.28, você pode sobrepor a escolha do nome da tabela, especificando-a usando a opção `--table` (forma abreviada `-t`).

* `--tempdelay`=*`#`*

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>8

Número de milissegundos para dormir entre erros temporários.

* `--temperrors`=*`#`*

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>9

Número de vezes que uma transação pode falhar devido a um erro temporário, por lote de execução. O padrão é 0, o que significa que qualquer erro temporário é fatal. Erros temporários não fazem com que quaisquer linhas sejam adicionadas ao arquivo `.rej`.

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Properties for connections"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connections=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>0

Ative a saída detalhada.

* `--usage`

  <table frame="box" rules="all" summary="Properties for connections"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connections=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>1

Exibir texto de ajuda e sair; o mesmo que `--help`.

* `--version`

  <table frame="box" rules="all" summary="Properties for connections"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connections=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>2

Exibir informações da versão e sair.

Assim como no caso de `LOAD DATA`, as opções para formatação de campo e linha são muito semelhantes às usadas para criar o arquivo CSV, seja feito isso usando `SELECT INTO ... OUTFILE` ou por algum outro meio. Não há uma opção equivalente à da declaração `LOAD DATA` `STARTING WITH`.

### 25.5.14 ndb_index_stat — Ferramenta de estatísticas de índice NDB

**ndb_index_stat** fornece informações estatísticas por fragmento sobre índices em tabelas `NDB`. Isso inclui a versão e a idade da cache, o número de entradas de índice por partição e o consumo de memória pelos índices.

#### Uso

Para obter estatísticas básicas de índice sobre uma tabela específica `NDB`, invoque **ndb_index_stat** conforme mostrado aqui, com o nome da tabela como o primeiro argumento e o nome do banco de dados que contém essa tabela, especificando-o imediatamente após ele, usando a opção `--database` (`-d`):

```
ndb_index_stat table -d database
```

Neste exemplo, usamos **ndb_index_stat** para obter essas informações sobre uma tabela `NDB` chamada `mytable` no banco de dados `test`:

```
$> ndb_index_stat -d test mytable
table:City index:PRIMARY fragCount:2
sampleVersion:3 loadTime:1399585986 sampleCount:1994 keyBytes:7976
query cache: valid:1 sampleCount:1994 totalBytes:27916
times in ms: save: 7.133 sort: 1.974 sort per sample: 0.000
```

`sampleVersion` é o número de versão do cache a partir do qual os dados estatísticos são obtidos. Executando o **ndb_index_stat** com a opção `--update`, o sampleVersion é incrementado.

`loadTime` mostra quando o cache foi atualizado pela última vez. Isso é expresso em segundos desde o Unix Epoch.

`sampleCount` é o número de entradas de índice encontradas por partição. Você pode estimar o número total de entradas multiplicando esse valor pelo número de fragmentos (mostrado como `fragCount`).

`sampleCount` pode ser comparado com a cardinalidade de `SHOW INDEX` ou `INFORMATION_SCHEMA.STATISTICS`, embora os dois últimos forneçam uma visão da tabela como um todo, enquanto o **ndb_index_stat** fornece uma média por fragmento.

`keyBytes` é o número de bytes utilizados pelo índice. Neste exemplo, a chave primária é um número inteiro, que requer quatro bytes para cada índice, então `keyBytes` pode ser calculado neste caso, conforme mostrado aqui:

```
    keyBytes = sampleCount * (4 bytes per index) = 1994 * 4 = 7976
```

Essa informação também pode ser obtida usando as definições correspondentes das colunas de `INFORMATION_SCHEMA.COLUMNS` (isso requer um servidor MySQL e uma aplicação de cliente MySQL).

`totalBytes` é a memória total consumida por todos os índices na tabela, em bytes.

Os horários mostrados nos exemplos anteriores são específicos para cada invocação do **ndb_index_stat**.

A opção `--verbose` oferece algumas saídas adicionais, conforme mostrado aqui:

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

Se a saída do programa estiver vazia, isso pode indicar que ainda não existem estatísticas. Para forçá-las a serem criadas (ou atualizadas, se já existirem), invoque **ndb_index_stat** com a opção `--update`, ou execute `ANALYZE TABLE` na tabela no cliente **mysql**.

#### Opções

A tabela a seguir inclui opções específicas para o utilitário NDB Cluster **ndb_index_stat**. Descrições adicionais estão listadas após a tabela.

**Tabela 25.36 Opções de linha de comando usadas com o programa ndb_index_stat**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th scope="col">Format</th> <th scope="col">Description</th> <th scope="col">Added, Deprecated, or Removed</th> </tr></thead><tbody><tr> <th scope="row"><p> <code class="option"> --character-sets-dir=path </code> </p></th> <td>Directory containing character sets</td> <td><p> REMOVED: 8.0.31 </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --connect-retries=# </code> </p></th> <td>Número de vezes para tentar a conexão novamente antes de desistir</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --connect-retry-delay=# </code> </p></th> <td>Número de segundos para esperar entre as tentativas de contato com o servidor de gerenciamento</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--connect-string=connection_string</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_connect-string">-c connection_string</a> </code> </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --core-file </code> </p></th> <td>Escreva o arquivo de núcleo em erro; usado em depuração</td> <td><p>REMOvido: 8.0.31</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--database=name</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_database">-d nome</a> </code> </p></th> <td>Nome do banco de dados que contém a tabela</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --defaults-extra-file=path </code> </p></th> <td>Leia o arquivo fornecido após os arquivos globais terem sido lidos</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --defaults-file=path </code> </p></th> <td>Ler opções padrão a partir do arquivo fornecido apenas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --defaults-group-suffix=string </code> </p></th> <td>Leia também grupos com concat(grupo, sufixo)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --delete </code> </p></th> <td>Exclua as estatísticas de índice da tabela, parando qualquer atualização automática configurada anteriormente</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --dump </code> </p></th> <td>Cache de consulta de impressão</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--help</code>,</p><p> <code class="option"> -? </code> </p></th> <td>Exibir texto de ajuda e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --login-path=path </code> </p></th> <td>Leia o caminho fornecido a partir do arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --loops=# </code> </p></th> <td>Defina o número de vezes em que o comando dado deve ser executado; o padrão é 0</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--ndb-connectstring=connection_string</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_ndb-connectstring">-c connection_string</a> </code> </p></th> <td>Defina a string de conexão para se conectar ao ndb_mgmd. Sintaxe: "[nodeid=id;][host=]hostname[:port]". Supere as entradas em NDB_CONNECTSTRING e my.cnf</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--ndb-mgmd-host=connection_string</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_ndb-mgmd-host">-c connection_string</a> </code> </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --ndb-nodeid=# </code> </p></th> <td>Defina o ID do nó para este nó, substituindo qualquer ID definida pela opção --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --ndb-optimized-node-selection </code> </p></th> <td>Ative as otimizações para a seleção de nós para transações. Ativado por padrão; use --skip-ndb-optimized-node-selection para desativá-lo</td> <td><p>REMOvido: 8.0.31</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --no-defaults </code> </p></th> <td>Não leia as opções padrão de qualquer arquivo de opção, exceto o arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --print-defaults </code> </p></th> <td>Imprimir a lista de argumentos do programa e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --query=# </code> </p></th> <td>Realize consultas aleatórias de intervalo na primeira attr de chave (deve ser um número inteiro sem sinal)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --sys-drop </code> </p></th> <td>Deixe de lado quaisquer tabelas de estatísticas e eventos no kernel NDB (todas as estatísticas são perdidas)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --sys-create </code> </p></th> <td>Crie todas as tabelas de estatísticas e eventos no kernel NDB, se nenhuma delas já existir</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --sys-create-if-not-exist </code> </p></th> <td>Crie quaisquer tabelas de estatísticas e eventos no kernel NDB que ainda não existam</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --sys-create-if-not-valid </code> </p></th> <td>Crie quaisquer tabelas de estatísticas ou eventos que não existam já no kernel NDB, após descartar quaisquer que sejam inválidos.</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --sys-check </code> </p></th> <td>Verifique se as estatísticas do índice do sistema NDB e as tabelas de eventos existem</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --sys-skip-tables </code> </p></th> <td>Não aplique opções sys-* às tabelas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --sys-skip-events </code> </p></th> <td>Não aplique opções sys-* a eventos</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --update </code> </p></th> <td>Atualize as estatísticas do índice da tabela, reiniciando qualquer autoatualização configurada anteriormente</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--usage</code>,</p><p> <code class="option"> -? </code> </p></th> <td>Exibir texto de ajuda e sair; o mesmo que --help</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--verbose</code>,</p><p> <code class="option"> -v </code> </p></th> <td>Ative a saída detalhada</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--version</code>,</p><p> <code class="option"> -V </code> </p></th> <td>Exibir informações da versão e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody></table>

* `--character-sets-dir`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>

Diretório contendo conjuntos de caracteres.

* `--connect-retries`

  <table frame="box" rules="all" summary="Properties for connect-retries"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>12</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>12</code></td> </tr></tbody></table>

Número de vezes para tentar a conexão novamente antes de desistir.

* `--connect-retry-delay`

  <table frame="box" rules="all" summary="Properties for connect-retry-delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retry-delay=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>5</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>5</code></td> </tr></tbody></table>

Número de segundos para esperar entre as tentativas de contato com o servidor de gerenciamento.

* `--connect-string`

  <table frame="box" rules="all" summary="Properties for connect-string"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-string=connection_string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

O mesmo que `--ndb-connectstring`.

* `--core-file`

  <table frame="box" rules="all" summary="Properties for core-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--core-file</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>

Escreva o arquivo de núcleo em erro; usado em depuração.

* `--database=name`, `-d name`

  <table frame="box" rules="all" summary="Properties for database"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--database=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr><tr><th>Minimum Value</th> <td><code></code></td> </tr><tr><th>Maximum Value</th> <td><code></code></td> </tr></tbody></table>

O nome do banco de dados que contém a tabela que está sendo consultada.

* `--defaults-extra-file`

  <table frame="box" rules="all" summary="Properties for defaults-extra-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-extra-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

Leia o arquivo fornecido após a leitura dos arquivos globais.

* `--defaults-file`

  <table frame="box" rules="all" summary="Properties for defaults-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

Leia as opções padrão a partir do arquivo fornecido apenas.

* `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Properties for defaults-group-suffix"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-group-suffix=string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

Leia também grupos com concatenação(grupo, sufixo).

* `--delete`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>0

Exclua as estatísticas do índice da tabela fornecida, parando qualquer atualização automática que foi configurada anteriormente.

* `--dump`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>1

Descarte o conteúdo do cache de consulta.

* `--help`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>2

Exibir texto de ajuda e sair.

* `--login-path`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>3

Leia o caminho fornecido a partir do arquivo de login.

* `--loops=#`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>4

Repita os comandos este número de vezes (para uso em testes).

* `--ndb-connectstring`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>5

Defina a string de conexão para se conectar ao ndb_mgmd. Sintaxe: "[nodeid=id;][host=]hostname[:port]". Ocorre entradas em NDB_CONNECTSTRING e my.cnf.

* `--ndb-mgmd-host`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>6

O mesmo que `--ndb-connectstring`.

* `--ndb-nodeid`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>7

Defina o ID do nó para este nó, substituindo qualquer ID definida por `--ndb-connectstring`.

* `--ndb-optimized-node-selection`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>8

Ative as otimizações para a seleção de nós para transações. Ativado por padrão; use `--skip-ndb-optimized-node-selection` para desativá-lo.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>9

Não leia as opções padrão de qualquer arquivo de opção, exceto o arquivo de login.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for connect-retries"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>12</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>12</code></td> </tr></tbody></table>0

Imprimir a lista de argumentos do programa e sair.

* `--query=#`

  <table frame="box" rules="all" summary="Properties for connect-retries"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>12</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>12</code></td> </tr></tbody></table>1

Realize consultas aleatórias de intervalo no primeiro atributo de chave (deve ser um número inteiro sem sinal).

* `--sys-drop`

  <table frame="box" rules="all" summary="Properties for connect-retries"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>12</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>12</code></td> </tr></tbody></table>2

Deixe todas as tabelas de estatísticas e eventos no kernel NDB. *Isso faz com que todas as estatísticas sejam perdidas*.

* `--sys-create`

  <table frame="box" rules="all" summary="Properties for connect-retries"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>12</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>12</code></td> </tr></tbody></table>3

Crie todas as tabelas de estatísticas e eventos no kernel NDB. Isso funciona apenas se nenhuma delas existir anteriormente.

* `--sys-create-if-not-exist`

  <table frame="box" rules="all" summary="Properties for connect-retries"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>12</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>12</code></td> </tr></tbody></table>4

Crie quaisquer tabelas de estatísticas ou eventos do sistema NDB que não existam já quando o programa for invocado.

* `--sys-create-if-not-valid`

  <table frame="box" rules="all" summary="Properties for connect-retries"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>12</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>12</code></td> </tr></tbody></table>5

Crie quaisquer tabelas de estatísticas ou eventos do sistema NDB que ainda não existam, após descartar quaisquer que sejam inválidas.

* `--sys-check`

  <table frame="box" rules="all" summary="Properties for connect-retries"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>12</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>12</code></td> </tr></tbody></table>6

Verifique se todas as tabelas de estatísticas de sistema e eventos necessários existem no kernel NDB.

* `--sys-skip-tables`

  <table frame="box" rules="all" summary="Properties for connect-retries"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>12</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>12</code></td> </tr></tbody></table>7

Não aplique nenhuma opção do `--sys-*` em nenhuma tabela de estatísticas.

* `--sys-skip-events`

  <table frame="box" rules="all" summary="Properties for connect-retries"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>12</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>12</code></td> </tr></tbody></table>8

Não aplique nenhuma opção do `--sys-*` a nenhum evento.

* `--update`

  <table frame="box" rules="all" summary="Properties for connect-retries"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>12</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>12</code></td> </tr></tbody></table>9

Atualize as estatísticas do índice para a tabela fornecida e reinicie qualquer atualização automática que foi configurada anteriormente.

* `--usage`

  <table frame="box" rules="all" summary="Properties for connect-retry-delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retry-delay=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>5</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>5</code></td> </tr></tbody></table>0

Exibir texto de ajuda e sair; o mesmo que `--help`.

* `--verbose`

  <table frame="box" rules="all" summary="Properties for connect-retry-delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retry-delay=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>5</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>5</code></td> </tr></tbody></table>1

Ative a saída detalhada.

* `--version`

  <table frame="box" rules="all" summary="Properties for connect-retry-delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retry-delay=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>5</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>5</code></td> </tr></tbody></table>2

Exibir informações da versão e sair.

**Opções do sistema ndb_index_stat.** As seguintes opções são usadas para gerar e atualizar as tabelas de estatísticas no kernel NDB. Nenhuma dessas opções pode ser usada com opções de estatísticas (veja as opções de estatísticas ndb_index_stat).

* `--sys-drop`
* `--sys-create`
* `--sys-create-if-not-exist`
* `--sys-create-if-not-valid`
* `--sys-check`
* `--sys-skip-tables`
* `--sys-skip-events`

**Opções de estatísticas ndb_index_stat.** As opções listadas aqui são usadas para gerar estatísticas de índice. Elas funcionam com uma tabela e um banco de dados específicos. Não podem ser misturadas com opções do sistema (veja as opções de sistema ndb_index_stat).

* `--database`
* `--delete`
* `--update`
* `--dump`
* `--query`

### 25.5.15 ndb_move_data — Ferramenta de cópia de dados NDB

**ndb_move_data** copia dados de uma tabela NDB para outra.

#### Uso

O programa é invocado com os nomes das tabelas de origem e de destino; um ou ambos podem ser qualificados opcionalmente com o nome do banco de dados. Ambas as tabelas devem usar o motor de armazenamento NDB.

```
ndb_move_data options source target
```

As opções que podem ser usadas com **ndb_move_data** estão mostradas na tabela a seguir. Descrições adicionais seguem a tabela.

**Tabela 25.37 Opções de linha de comando usadas com o programa ndb_move_data**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th scope="col">Format</th> <th scope="col">Description</th> <th scope="col">Added, Deprecated, or Removed</th> </tr></thead><tbody><tr> <th scope="row"><p> <code class="option"> --abort-on-error </code> </p></th> <td>Arraste o núcleo em erro permanente (opção de depuração)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --character-sets-dir=path </code> </p></th> <td>Diretório onde os conjuntos de caracteres estão</td> <td><p>REMOvido: 8.0.31</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --connect-retries=# </code> </p></th> <td>Número de vezes para tentar a conexão novamente antes de desistir</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --connect-retry-delay=# </code> </p></th> <td>Número de segundos para esperar entre as tentativas de contato com o servidor de gerenciamento</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--connect-string=connection_string</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-move-data.html#option_ndb_move_data_connect-string">-c connection_string</a> </code> </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --core-file </code> </p></th> <td>Escreva o arquivo de núcleo em erro; usado em depuração</td> <td><p>REMOvido: 8.0.31</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--database=name</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-move-data.html#option_ndb_move_data_database">-d nome</a> </code> </p></th> <td>Nome do banco de dados em que a tabela está localizada</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --defaults-extra-file=path </code> </p></th> <td>Leia o arquivo fornecido após os arquivos globais terem sido lidos</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --defaults-file=path </code> </p></th> <td>Ler opções padrão a partir do arquivo fornecido apenas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --defaults-group-suffix=string </code> </p></th> <td>Leia também grupos com concat(grupo, sufixo)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --drop-source </code> </p></th> <td>Deixe a tabela de origem após todas as linhas terem sido movidas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --error-insert </code> </p></th> <td>Insira erros temporários aleatórios (utilizados em testes)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --exclude-missing-columns </code> </p></th> <td>Ignore colunas extras na tabela de origem ou de destino</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--help</code>,</p><p> <code class="option"> -? </code> </p></th> <td>Exibir texto de ajuda e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --login-path=path </code> </p></th> <td>Leia o caminho fornecido a partir do arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--lossy-conversions</code>,</p><p> <code class="option"> -l </code> </p></th> <td>Permitir que os dados de atributo sejam truncados ao serem convertidos para um tipo menor</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--ndb-connectstring=connection_string</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-move-data.html#option_ndb_move_data_ndb-connectstring">-c connection_string</a> </code> </p></th> <td>Defina a string de conexão para se conectar ao ndb_mgmd. Sintaxe: "[nodeid=id;][host=]hostname[:port]". Supere as entradas em NDB_CONNECTSTRING e my.cnf</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--ndb-mgmd-host=connection_string</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-move-data.html#option_ndb_move_data_ndb-mgmd-host">-c connection_string</a> </code> </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --ndb-nodeid=# </code> </p></th> <td>Defina o ID do nó para este nó, substituindo qualquer ID definida pela opção --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --ndb-optimized-node-selection </code> </p></th> <td>Ative as otimizações para a seleção de nós para transações. Ativado por padrão; use --skip-ndb-optimized-node-selection para desativá-lo</td> <td><p>REMOvido: 8.0.31</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --no-defaults </code> </p></th> <td>Não leia as opções padrão de qualquer arquivo de opção, exceto o arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --print-defaults </code> </p></th> <td>Imprimir a lista de argumentos do programa e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--promote-attributes</code>,</p><p> <code class="option"> -A </code> </p></th> <td>Permitir que os dados de atributo sejam convertidos para um tipo maior</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --staging-tries=x[,y[,z]] </code> </p></th> <td>Especifique tentativas em erros temporários; o formato é x[, y[, z]] onde x=max tentativas (0=sem limite), y=min atraso (ms), z=max atraso (ms)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--usage</code>,</p><p> <code class="option"> -? </code> </p></th> <td>Exibir texto de ajuda e sair; o mesmo que --help</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --verbose </code> </p></th> <td>Ative mensagens detalhadas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--version</code>,</p><p> <code class="option"> -V </code> </p></th> <td>Exibir informações da versão e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody></table>

* `--abort-on-error`

  <table frame="box" rules="all" summary="Properties for abort-on-error"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--abort-on-error</code></td> </tr></tbody></table>

Arraste o núcleo em erro permanente (opção de depuração).

* `--character-sets-dir`=*`name`*

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

Diretório onde os conjuntos de caracteres estão.

* `--connect-retry-delay`

  <table frame="box" rules="all" summary="Properties for connect-retry-delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retry-delay=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>5</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>5</code></td> </tr></tbody></table>

Número de segundos para esperar entre as tentativas de contato com o servidor de gerenciamento.

* `--connect-retries`

  <table frame="box" rules="all" summary="Properties for connect-retries"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>12</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>12</code></td> </tr></tbody></table>

Número de vezes para tentar a conexão novamente antes de desistir.

* `--connect-string`

  <table frame="box" rules="all" summary="Properties for connect-string"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-string=connection_string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

O mesmo que `--ndb-connectstring`.

* `--core-file`

  <table frame="box" rules="all" summary="Properties for core-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--core-file</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>

Escreva o arquivo de núcleo em erro; usado em depuração.

* `--database`=*`dbname`*, `-d`

  <table frame="box" rules="all" summary="Properties for database"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--database=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>TEST_DB</code></td> </tr></tbody></table>

Nome do banco de dados em que a tabela está localizada.

* `--defaults-extra-file`

  <table frame="box" rules="all" summary="Properties for defaults-extra-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-extra-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

Leia o arquivo fornecido após a leitura dos arquivos globais.

* `--defaults-file`

  <table frame="box" rules="all" summary="Properties for defaults-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

Leia as opções padrão a partir do arquivo fornecido apenas.

* `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Properties for abort-on-error"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--abort-on-error</code></td> </tr></tbody></table>0

Leia também grupos com concatenação(grupo, sufixo).

* `--drop-source`

  <table frame="box" rules="all" summary="Properties for abort-on-error"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--abort-on-error</code></td> </tr></tbody></table>1

Deixe a tabela de origem após todas as linhas terem sido movidas.

* `--error-insert`

  <table frame="box" rules="all" summary="Properties for abort-on-error"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--abort-on-error</code></td> </tr></tbody></table>2

Insira erros temporários aleatórios (opção de teste).

* `--exclude-missing-columns`

  <table frame="box" rules="all" summary="Properties for abort-on-error"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--abort-on-error</code></td> </tr></tbody></table>3

Ignore colunas extras na tabela de origem ou de destino.

* `--help`

  <table frame="box" rules="all" summary="Properties for abort-on-error"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--abort-on-error</code></td> </tr></tbody></table>4

Exibir texto de ajuda e sair.

* `--login-path`

  <table frame="box" rules="all" summary="Properties for abort-on-error"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--abort-on-error</code></td> </tr></tbody></table>5

Leia o caminho fornecido a partir do arquivo de login.

* `--lossy-conversions`, `-l`

  <table frame="box" rules="all" summary="Properties for abort-on-error"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--abort-on-error</code></td> </tr></tbody></table>6

Permitir que os dados do atributo sejam truncados quando convertidos para um tipo menor.

* `--ndb-connectstring`

  <table frame="box" rules="all" summary="Properties for abort-on-error"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--abort-on-error</code></td> </tr></tbody></table>7

Defina a string de conexão para se conectar ao ndb_mgmd. Sintaxe: "[nodeid=id;][host=]hostname[:port]". Ocorre entradas em NDB_CONNECTSTRING e my.cnf.

* `--ndb-mgmd-host`

  <table frame="box" rules="all" summary="Properties for abort-on-error"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--abort-on-error</code></td> </tr></tbody></table>8

O mesmo que `--ndb-connectstring`.

* `--ndb-nodeid`

  <table frame="box" rules="all" summary="Properties for abort-on-error"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--abort-on-error</code></td> </tr></tbody></table>9

Defina o ID do nó para este nó, substituindo qualquer ID definida por `--ndb-connectstring`.

* `--ndb-optimized-node-selection`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>0

Ative as otimizações para a seleção de nós para transações. Ativado por padrão; use `--skip-ndb-optimized-node-selection` para desativá-lo.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>1

Não leia as opções padrão de qualquer arquivo de opção, exceto o arquivo de login.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>2

Imprimir a lista de argumentos do programa e sair.

* `--promote-attributes`, `-A`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>3

Permitir que os dados do atributo sejam convertidos para um tipo maior.

* `--staging-tries`=*`x[,y[,z]]`*

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>4

Especifique tentativas em erros temporários. O formato é x[, y[, z]] onde x=max tentativas (0=sem limite), y=min atraso (ms), z=max atraso (ms).

* `--usage`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>5

Exibir texto de ajuda e sair; o mesmo que `--help`.

* `--verbose`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>6

Ative mensagens detalhadas.

* `--version`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>7

Exibir informações da versão e sair.

### 25.5.16 ndb_perror — Obtenha informações sobre mensagem de erro NDB

**ndb_perror** exibe informações sobre um erro NDB, dado seu código de erro. Isso inclui a mensagem de erro, o tipo de erro e se o erro é permanente ou temporário. Isso é destinado como um substituto de **perror** `--ndb`, que não é mais suportado.

#### Uso

```
ndb_perror [options] error_code
```

O **ndb_perror** não precisa acessar um NDB Cluster em execução, ou qualquer nó (incluindo nós SQL). Para visualizar informações sobre um erro específico do NDB, invoque o programa, usando o código de erro como argumento, da seguinte forma:

```
$> ndb_perror 323
NDB error code 323: Invalid nodegroup id, nodegroup already existing: Permanent error: Application error
```

Para exibir apenas a mensagem de erro, invoque **ndb_perror** com a opção `--silent` (forma abreviada `-s`), conforme mostrado aqui:

```
$> ndb_perror -s 323
Invalid nodegroup id, nodegroup already existing: Permanent error: Application error
```

Assim como o **perror**, o **ndb_perror** aceita vários códigos de erro:

```
$> ndb_perror 321 1001
NDB error code 321: Invalid nodegroup id: Permanent error: Application error
NDB error code 1001: Illegal connect string
```

Outras opções de programa para **ndb_perror** são descritas mais adiante nesta seção.

**ndb_perror** substitui **perror** `--ndb`, que não é mais suportado pelo NDB Cluster. Para facilitar a substituição em scripts e outras aplicações que possam depender de **perror** para obter informações de erro do NDB, **ndb_perror** suporta sua própria opção “falsa” `--ndb`, que não faz nada.

A tabela a seguir inclui todas as opções específicas do programa NDB Cluster **ndb_perror**. Descrições adicionais seguem a tabela.

**Tabela 25.38 Opções de linha de comando usadas com o programa ndb_perror**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th scope="col">Format</th> <th scope="col">Description</th> <th scope="col">Added, Deprecated, or Removed</th> </tr></thead><tbody><tr> <th scope="row"><p> <code class="option"> --defaults-extra-file=path </code> </p></th> <td>Leia o arquivo fornecido após os arquivos globais terem sido lidos</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --defaults-file=path </code> </p></th> <td>Ler opções padrão a partir do arquivo fornecido apenas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --defaults-group-suffix=string </code> </p></th> <td>Leia também grupos com concat(grupo, sufixo)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--help</code>,</p><p> <code class="option"> -? </code> </p></th> <td>Exibir texto de ajuda</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --login-path=path </code> </p></th> <td>Leia o caminho fornecido a partir do arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --ndb </code> </p></th> <td>Para compatibilidade com aplicativos que dependem de versões antigas de perror; não faz nada</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --no-defaults </code> </p></th> <td>Não leia as opções padrão de qualquer arquivo de opção, exceto o arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --print-defaults </code> </p></th> <td>Imprimir a lista de argumentos do programa e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--silent</code>,</p><p> <code class="option"> -s </code> </p></th> <td>Mostrar mensagem de erro apenas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--version</code>,</p><p> <code class="option"> -V </code> </p></th> <td>Imprimir informações da versão do programa e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--verbose</code>,</p><p> <code class="option"> -v </code> </p></th> <td>Saída verbose; desative com --silent</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody></table>

#### Opções Adicionais

* `--defaults-extra-file`

  <table frame="box" rules="all" summary="Properties for defaults-extra-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-extra-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

Leia o arquivo fornecido após a leitura dos arquivos globais.

* `--defaults-file`

  <table frame="box" rules="all" summary="Properties for defaults-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

Leia as opções padrão a partir do arquivo fornecido apenas.

* `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Properties for defaults-group-suffix"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-group-suffix=string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

Leia também grupos com concatenação(grupo, sufixo).

* `--help`, `-?`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

Exibir texto de ajuda do programa e sair.

* `--login-path`

  <table frame="box" rules="all" summary="Properties for login-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--login-path=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

Leia o caminho fornecido a partir do arquivo de login.

* `--ndb`

  <table frame="box" rules="all" summary="Properties for ndb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb</code></td> </tr></tbody></table>

Para compatibilidade com aplicativos que dependem de versões antigas do **perror** que utilizam a opção `--ndb` desse programa. A opção, quando usada com **ndb_perror**, não faz nada e é ignorada por ela.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for no-defaults"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--no-defaults</code></td> </tr></tbody></table>

Não leia as opções padrão de qualquer arquivo de opção, exceto o arquivo de login.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for print-defaults"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--print-defaults</code></td> </tr></tbody></table>

Imprimir a lista de argumentos do programa e sair.

* `--silent`, `-s`

  <table frame="box" rules="all" summary="Properties for silent"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--silent</code></td> </tr></tbody></table>

Mostrar apenas a mensagem de erro.

* `--version`, `-V`

  <table frame="box" rules="all" summary="Properties for defaults-extra-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-extra-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>0

Imprimir as informações da versão do programa e sair.

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Properties for defaults-extra-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-extra-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>1

Saída detalhada; desative com `--silent`.

### 25.5.17 ndb_print_backup_file — Imprimir conteúdo do arquivo de backup NDB

**ndb_print_backup_file** obtém informações de diagnóstico de um arquivo de backup de cluster.

**Tabela 25.39 Opções de linha de comando usadas com o programa ndb_print_backup_file**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th scope="col">Format</th> <th scope="col">Description</th> <th scope="col">Added, Deprecated, or Removed</th> </tr></thead><tbody><tr> <th scope="row"><p> <code>--backup-key=key</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-print-backup-file.html#option_ndb_print_backup_file_backup-key">- Senha K</a> </code> </p></th> <td>Use esta senha para descriptografar o arquivo</td> <td><p>ADICIONADO: NDB 8.0.31</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --backup-key-from-stdin </code> </p></th> <td>Obtenha a chave de descriptografia de forma segura a partir de STDIN</td> <td><p>ADICIONADO: NDB 8.0.31</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--backup-password=password</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-print-backup-file.html#option_ndb_print_backup_file_backup-password">- Senha P</a> </code> </p></th> <td>Use esta senha para descriptografar o arquivo</td> <td><p>ADICIONADO: NDB 8.0.22</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --backup-password-from-stdin </code> </p></th> <td>Obtenha a senha de descriptografia de forma segura a partir de STDIN</td> <td><p>ADICIONADO: NDB 8.0.24</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--control-directory-number=#</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-print-backup-file.html#option_ndb_print_backup_file_control-directory-number">-c #</a> </code> </p></th> <td>Número do diretório de controle</td> <td><p>ADICIONADO: NDB 8.0.24</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --defaults-extra-file=path </code> </p></th> <td>Leia o arquivo fornecido após os arquivos globais terem sido lidos</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --defaults-file=path </code> </p></th> <td>Ler opções padrão a partir do arquivo fornecido apenas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --defaults-group-suffix=string </code> </p></th> <td>Leia também grupos com concat(grupo, sufixo)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--fragment-id=#</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-print-backup-file.html#option_ndb_print_backup_file_fragment-id">-f #</a> </code> </p></th> <td>ID do fragmento</td> <td><p>ADICIONADO: NDB 8.0.24</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--help</code>,</p><p> <code>--usage</code>,</p><p> <code>-h</code>,</p><p> <code class="option"> -? </code> </p></th> <td>Informações sobre o uso da impressão</td> <td><p>ADICIONADO: NDB 8.0.24</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --login-path=path </code> </p></th> <td>Leia o caminho fornecido a partir do arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --no-defaults </code> </p></th> <td>Não leia as opções padrão de qualquer arquivo de opção, exceto o arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--no-print-rows</code>,</p><p> <code class="option"> -u </code> </p></th> <td>Não imprima linhas</td> <td><p>ADICIONADO: NDB 8.0.24</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --print-defaults </code> </p></th> <td>Imprimir a lista de argumentos do programa e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--print-header-words</code>,</p><p> <code class="option"> -h </code> </p></th> <td>Imprimir palavras de cabeçalho</td> <td><p>ADICIONADO: NDB 8.0.24</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --print-restored-rows </code> </p></th> <td>Print restored rows</td> <td><p> ADDED: NDB 8.0.24 </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--print-rows</code>,</p><p> <code class="option"> -U </code> </p></th> <td>Imprimir linhas. Ativado por padrão; desative com --no-print-rows</td> <td><p>ADICIONADO: NDB 8.0.24</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --print-rows-per-page </code> </p></th> <td>Imprimir linhas por página</td> <td><p>ADICIONADO: NDB 8.0.24</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--rowid-file=path</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-print-backup-file.html#option_ndb_print_backup_file_rowid-file">-n caminho</a> </code> </p></th> <td>Arquivo contendo o ID da linha para verificar</td> <td><p>ADICIONADO: NDB 8.0.24</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--show-ignored-rows</code>,</p><p> <code class="option"> -i </code> </p></th> <td>Mostrar linhas ignoradas</td> <td><p>ADICIONADO: NDB 8.0.24</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--table-id=#</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-print-backup-file.html#option_ndb_print_backup_file_table-id">-t #</a> </code> </p></th> <td>ID da tabela; usado com --print-restored rows</td> <td><p>ADICIONADO: NDB 8.0.24</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--usage</code>,</p><p> <code class="option"> -? </code> </p></th> <td>Exibir texto de ajuda e sair; o mesmo que --help</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--verbose[=#]</code>,</p><p> <code class="option"> -v </code> </p></th> <td>Nível de verbosidade</td> <td><p>ADICIONADO: NDB 8.0.24</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--version</code>,</p><p> <code class="option"> -V </code> </p></th> <td>Exibir informações da versão e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody></table>

#### Uso

```
ndb_print_backup_file [-P password] file_name
```

*`file_name`* é o nome de um arquivo de backup de cluster. Este pode ser qualquer um dos arquivos (`.Data`, `.ctl` ou `.log`) encontrados em um diretório de backup de cluster. Esses arquivos são encontrados no diretório de backup do nó de dados sob o subdiretório `BACKUP-#`, onde *`#`* é o número de sequência para o backup. Para mais informações sobre arquivos de backup de cluster e seus conteúdos, consulte a Seção 25.6.8.1, “Conceitos de Backup de Cluster NDB”.

Assim como **ndb_print_schema_file** e **ndb_print_sys_file** (e ao contrário da maioria das outras ferramentas do `NDB` que são destinadas a serem executadas em um servidor de gerenciamento ou para se conectar a um servidor de gerenciamento), **ndb_print_backup_file** deve ser executado em um nó de dados de cluster, pois ele acessa diretamente o sistema de arquivos do nó de dados. Como ele não faz uso do servidor de gerenciamento, essa ferramenta pode ser usada quando o servidor de gerenciamento não está em execução e até mesmo quando o cluster foi completamente desligado.

No NDB 8.0, este programa também pode ser usado para ler arquivos de registro de desfazer.

#### Opções

Antes da versão 8.0.24 do NDB, o **ndb_print_backup_file** só suportava a opção `-P`. A partir da versão 8.0.24 do NDB, o programa suporta uma série de opções, que são descritas na lista a seguir.

* `--backup-key`, `-K`

  <table frame="box" rules="all" summary="Properties for backup-key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backup-key=key</code></td> </tr><tr><th>Introduced</th> <td>8.0.31-ndb-8.0.31</td> </tr></tbody></table>

Especifique a chave necessária para descriptografar um backup criptografado.

* `--backup-key-from-stdin`

  <table frame="box" rules="all" summary="Properties for backup-key-from-stdin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backup-key-from-stdin</code></td> </tr><tr><th>Introduced</th> <td>8.0.31-ndb-8.0.31</td> </tr></tbody></table>

Permitir a entrada da chave de descriptografia do padrão de entrada, semelhante ao digitar uma senha após invocar o **mysql** `--password` sem senha fornecida.

* `--backup-password`

  <table frame="box" rules="all" summary="Properties for backup-password"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backup-password=password</code></td> </tr><tr><th>Introduced</th> <td>8.0.22-ndb-8.0.22</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

Especifique a senha necessária para descriptografar um backup criptografado.

A versão longa desta opção está disponível a partir do NDB 8.0.24.

* `--backup-password-from-stdin`

  <table frame="box" rules="all" summary="Properties for backup-password-from-stdin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backup-password-from-stdin</code></td> </tr><tr><th>Introduced</th> <td>8.0.24-ndb-8.0.24</td> </tr></tbody></table>

Permitir a entrada da senha do padrão de entrada, semelhante à entrada de uma senha após a invocação de **mysql** `--password` sem senha fornecida.

* `--control-directory-number`

  <table frame="box" rules="all" summary="Properties for control-directory-number"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--control-directory-number=#</code></td> </tr><tr><th>Introduced</th> <td>8.0.24-ndb-8.0.24</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr></tbody></table>

Número do diretório do arquivo de controle. Usado juntamente com `--print-restored-rows`.

* `--defaults-extra-file`

  <table frame="box" rules="all" summary="Properties for defaults-extra-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-extra-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

Leia o arquivo fornecido após a leitura dos arquivos globais.

* `--defaults-file`

  <table frame="box" rules="all" summary="Properties for defaults-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

Leia as opções padrão a partir do arquivo fornecido apenas.

* `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Properties for defaults-group-suffix"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-group-suffix=string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

Leia também grupos com concatenação(grupo, sufixo).

* `--fragment-id`

  <table frame="box" rules="all" summary="Properties for fragment-id"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--fragment-id=#</code></td> </tr><tr><th>Introduced</th> <td>8.0.24-ndb-8.0.24</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr></tbody></table>

ID de fragmento. Usado juntamente com `--print-restored-rows`.

* `--help`

  <table frame="box" rules="all" summary="Properties for backup-key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backup-key=key</code></td> </tr><tr><th>Introduced</th> <td>8.0.31-ndb-8.0.31</td> </tr></tbody></table>0

Imprimir informações sobre o uso do programa.

* `--login-path`

  <table frame="box" rules="all" summary="Properties for backup-key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backup-key=key</code></td> </tr><tr><th>Introduced</th> <td>8.0.31-ndb-8.0.31</td> </tr></tbody></table>1

Leia o caminho fornecido a partir do arquivo de login.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for backup-key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backup-key=key</code></td> </tr><tr><th>Introduced</th> <td>8.0.31-ndb-8.0.31</td> </tr></tbody></table>2

Não leia as opções padrão de qualquer arquivo de opção, exceto o arquivo de login.

* `--no-print-rows`

  <table frame="box" rules="all" summary="Properties for backup-key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backup-key=key</code></td> </tr><tr><th>Introduced</th> <td>8.0.31-ndb-8.0.31</td> </tr></tbody></table>3

Não inclua linhas no resultado.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for backup-key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backup-key=key</code></td> </tr><tr><th>Introduced</th> <td>8.0.31-ndb-8.0.31</td> </tr></tbody></table>4

Imprimir a lista de argumentos do programa e sair.

* `--print-header-words`

  <table frame="box" rules="all" summary="Properties for backup-key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backup-key=key</code></td> </tr><tr><th>Introduced</th> <td>8.0.31-ndb-8.0.31</td> </tr></tbody></table>5

Incluir palavras de cabeçalho no resultado.

* `--print-restored-rows`

  <table frame="box" rules="all" summary="Properties for backup-key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backup-key=key</code></td> </tr><tr><th>Introduced</th> <td>8.0.31-ndb-8.0.31</td> </tr></tbody></table>6

Incluir as linhas restauradas no resultado, usando o arquivo `LCP/c/TtFf.ctl`, para o qual os valores são definidos da seguinte forma:

+ *`c`* é o número do arquivo de controle definido usando `--control-directory-number`

+ *`t`* é o conjunto de IDs de tabela utilizado por `--table-id`

+ *`f`* é o conjunto de ID de fragmento utilizado com `--fragment-id`

* `--print-rows`

  <table frame="box" rules="all" summary="Properties for backup-key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backup-key=key</code></td> </tr><tr><th>Introduced</th> <td>8.0.31-ndb-8.0.31</td> </tr></tbody></table>7

Imprimir linhas. Esta opção é ativada por padrão; para desativá-la, use `--no-print-rows`.

* `--print-rows-per-page`

  <table frame="box" rules="all" summary="Properties for backup-key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backup-key=key</code></td> </tr><tr><th>Introduced</th> <td>8.0.31-ndb-8.0.31</td> </tr></tbody></table>8

Imprimir linhas por página.

* `--rowid-file`

  <table frame="box" rules="all" summary="Properties for backup-key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backup-key=key</code></td> </tr><tr><th>Introduced</th> <td>8.0.31-ndb-8.0.31</td> </tr></tbody></table>9

Arquivo para verificar o ID da linha.

* `--show-ignored-rows`

  <table frame="box" rules="all" summary="Properties for backup-key-from-stdin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backup-key-from-stdin</code></td> </tr><tr><th>Introduced</th> <td>8.0.31-ndb-8.0.31</td> </tr></tbody></table>0

Mostrar linhas ignoradas.

* `--table-id`

  <table frame="box" rules="all" summary="Properties for backup-key-from-stdin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backup-key-from-stdin</code></td> </tr><tr><th>Introduced</th> <td>8.0.31-ndb-8.0.31</td> </tr></tbody></table>1

Tabela ID. Usada em conjunto com `--print-restored-rows`.

* `--usage`

  <table frame="box" rules="all" summary="Properties for backup-key-from-stdin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backup-key-from-stdin</code></td> </tr><tr><th>Introduced</th> <td>8.0.31-ndb-8.0.31</td> </tr></tbody></table>2

Exibir texto de ajuda e sair; o mesmo que `--help`.

* `--verbose`

  <table frame="box" rules="all" summary="Properties for backup-key-from-stdin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backup-key-from-stdin</code></td> </tr><tr><th>Introduced</th> <td>8.0.31-ndb-8.0.31</td> </tr></tbody></table>3

Nível de verbosidade da saída. Um valor maior indica maior verbosidade.

* `--version`

  <table frame="box" rules="all" summary="Properties for backup-key-from-stdin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backup-key-from-stdin</code></td> </tr><tr><th>Introduced</th> <td>8.0.31-ndb-8.0.31</td> </tr></tbody></table>4

Exibir informações da versão e sair.

### 25.5.18 ndb_print_file — Imprimir conteúdo do arquivo de dados do disco NDB

**ndb_print_file** obtém informações de um arquivo de dados de disco do NDB Cluster.

#### Uso

```
ndb_print_file [-v] [-q] file_name+
```

*`file_name`* é o nome de um arquivo de dados de disco de cluster NDB. Múltiplos nomes de arquivo são aceitos, separados por espaços.

Assim como **ndb_print_schema_file** e **ndb_print_sys_file** (e ao contrário da maioria das outras ferramentas do `NDB` que são destinadas a serem executadas em um servidor de gerenciamento ou para se conectar a um servidor de gerenciamento), **ndb_print_file** deve ser executado em um nó de dados do NDB Cluster, pois ele acessa diretamente o sistema de arquivos do nó de dados. Como ele não faz uso do servidor de gerenciamento, essa ferramenta pode ser usada quando o servidor de gerenciamento não está em execução e até mesmo quando o clúster foi completamente desligado.

#### Opções

**Tabela 25.40 Opções de linha de comando usadas com o programa ndb_print_file**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th scope="col">Format</th> <th scope="col">Description</th> <th scope="col">Added, Deprecated, or Removed</th> </tr></thead><tbody><tr> <th scope="row"><p> <code>--file-key=hex_data</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-print-file.html#option_ndb_print_file_file-key">-K hex_data</a> </code> </p></th> <td>Forneça a chave de criptografia usando stdin, tty ou arquivo my.cnf</td> <td><p>ADICIONADO: NDB 8.0.31</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --file-key-from-stdin </code> </p></th> <td>Forneça a chave de criptografia usando stdin</td> <td><p>ADICIONADO: NDB 8.0.31</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--help</code>,</p><p> <code class="option"> -? </code> </p></th> <td>Exibir texto de ajuda e sair; o mesmo que --usage</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--quiet</code>,</p><p> <code class="option"> -q </code> </p></th> <td>Reduza a verbosidade do resultado</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--usage</code>,</p><p> <code class="option"> -? </code> </p></th> <td>Exibir texto de ajuda e sair; o mesmo que --help</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--verbose</code>,</p><p> <code class="option"> -v </code> </p></th> <td>Aumente a verbosidade da saída</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--version</code>,</p><p> <code class="option"> -V </code> </p></th> <td>Exibir informações da versão e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody></table>

**ndb_print_file** suporta as seguintes opções:

* `--file-key`, `-K`

  <table frame="box" rules="all" summary="Properties for file-key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--file-key=hex_data</code></td> </tr><tr><th>Introduced</th> <td>8.0.31-ndb-8.0.31</td> </tr></tbody></table>

Forneça a chave de criptografia ou descriptografia do sistema de arquivos a partir de `stdin`, `tty` ou um arquivo `my.cnf`.

* `--file-key-from-stdin`

  <table frame="box" rules="all" summary="Properties for file-key-from-stdin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--file-key-from-stdin</code></td> </tr><tr><th>Introduced</th> <td>8.0.31-ndb-8.0.31</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr><tr><th>Valid Values</th> <td><code>TRUE</code></td> </tr></tbody></table>

Forneça a chave de criptografia ou descriptografia do sistema de arquivos a partir de `stdin`.

* `--help`, `-h`, `-?`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

Imprimir mensagem de ajuda e sair.

* `--quiet`, `-q`

  <table frame="box" rules="all" summary="Properties for quiet"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--quiet</code></td> </tr></tbody></table>

Suprima a saída (modo silencioso).

* `--usage`, `-?`

  <table frame="box" rules="all" summary="Properties for usage"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--usage</code></td> </tr></tbody></table>

Imprimir mensagem de ajuda e sair.

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Properties for verbose"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--verbose</code></td> </tr></tbody></table>

Faça a saída mais detalhada.

* `--version`, `-v`

  <table frame="box" rules="all" summary="Properties for version"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--version</code></td> </tr></tbody></table>

Informações da versão impressa e saída.

Para mais informações, consulte a Seção 25.6.11, “Tabelas de dados de disco do cluster NDB”.

### 25.5.19 ndb_print_frag_file — Imprimir conteúdo do arquivo de lista de fragmentos NDB

O **ndb_print_frag_file** obtém informações de um arquivo de lista de fragmentos de clúster. É destinado ao uso para ajudar a diagnosticar problemas com reinicializações de nós de dados.

#### Uso

```
ndb_print_frag_file file_name
```

*`file_name`* é o nome de um arquivo de lista de fragmentos de grupo, que corresponde ao padrão `SX.FragList`, onde *`X`* é um dígito no intervalo de 2 a 9, inclusive, e são encontrados no sistema de arquivos do nó de dados do nó que tem o ID de nó *`nodeid`*, em diretórios com o nome `ndb_nodeid_fs/DN/DBDIH/`, onde *`N`* é `1` ou `2`. Cada arquivo de fragmento contém registros dos fragmentos pertencentes a cada tabela `NDB`. Para mais informações sobre arquivos de fragmentos de grupo, consulte o Diretório do Sistema de Arquivos de Nó de Dados do NDB Cluster.

Assim como **ndb_print_backup_file**, **ndb_print_sys_file** e **ndb_print_schema_file** (e ao contrário da maioria das outras ferramentas do `NDB` que são destinadas a serem executadas em um servidor de gerenciamento ou para se conectar a um servidor de gerenciamento), **ndb_print_frag_file** deve ser executado em um nó de dados de cluster, pois ele acessa diretamente o sistema de arquivos do nó de dados. Como ele não faz uso do servidor de gerenciamento, essa ferramenta pode ser usada quando o servidor de gerenciamento não está em execução e até mesmo quando o cluster foi completamente desligado.

#### Opções Adicionais

None.

#### Saída Exemplo

```
$> ndb_print_frag_file /usr/local/mysqld/data/ndb_3_fs/D1/DBDIH/S2.FragList
Filename: /usr/local/mysqld/data/ndb_3_fs/D1/DBDIH/S2.FragList with size 8192
noOfPages = 1 noOfWords = 182
Table Data
----------
Num Frags: 2 NoOfReplicas: 2 hashpointer: 4294967040
kvalue: 6 mask: 0x00000000 method: HashMap
Storage is on Logged and checkpointed, survives SR
------ Fragment with FragId: 0 --------
Preferred Primary: 2 numStoredReplicas: 2 numOldStoredReplicas: 0 distKey: 0 LogPartId: 0
-------Stored Replica----------
Replica node is: 2 initialGci: 2 numCrashedReplicas = 0 nextLcpNo = 1
LcpNo[0]: maxGciCompleted: 1 maxGciStarted: 2 lcpId: 1 lcpStatus: valid
LcpNo[1]: maxGciCompleted: 0 maxGciStarted: 0 lcpId: 0 lcpStatus: invalid
-------Stored Replica----------
Replica node is: 3 initialGci: 2 numCrashedReplicas = 0 nextLcpNo = 1
LcpNo[0]: maxGciCompleted: 1 maxGciStarted: 2 lcpId: 1 lcpStatus: valid
LcpNo[1]: maxGciCompleted: 0 maxGciStarted: 0 lcpId: 0 lcpStatus: invalid
------ Fragment with FragId: 1 --------
Preferred Primary: 3 numStoredReplicas: 2 numOldStoredReplicas: 0 distKey: 0 LogPartId: 1
-------Stored Replica----------
Replica node is: 3 initialGci: 2 numCrashedReplicas = 0 nextLcpNo = 1
LcpNo[0]: maxGciCompleted: 1 maxGciStarted: 2 lcpId: 1 lcpStatus: valid
LcpNo[1]: maxGciCompleted: 0 maxGciStarted: 0 lcpId: 0 lcpStatus: invalid
-------Stored Replica----------
Replica node is: 2 initialGci: 2 numCrashedReplicas = 0 nextLcpNo = 1
LcpNo[0]: maxGciCompleted: 1 maxGciStarted: 2 lcpId: 1 lcpStatus: valid
LcpNo[1]: maxGciCompleted: 0 maxGciStarted: 0 lcpId: 0 lcpStatus: invalid
```

### 25.5.20 ndb_print_schema_file — Imprimir conteúdos do arquivo de esquema NDB

**ndb_print_schema_file** obtém informações de diagnóstico de um arquivo de esquema de cluster.

#### Uso

```
ndb_print_schema_file file_name
```

*`file_name`* é o nome de um arquivo de esquema de cluster. Para mais informações sobre arquivos de esquema de cluster, consulte o diretório do sistema de arquivos de nó de dados do NDB Cluster.

Assim como **ndb_print_backup_file** e **ndb_print_sys_file** (e ao contrário da maioria das outras ferramentas do `NDB` que são destinadas a serem executadas em um servidor de gerenciamento ou para se conectar a um servidor de gerenciamento), **ndb_print_schema_file** deve ser executado em um nó de dados de cluster, pois ele acessa diretamente o sistema de arquivos do nó de dados. Como ele não faz uso do servidor de gerenciamento, essa ferramenta pode ser usada quando o servidor de gerenciamento não está em execução e até mesmo quando o cluster foi completamente desligado.

#### Opções Adicionais

None.

### 25.5.21 ndb_print_sys_file — Imprimir conteúdos do arquivo do sistema NDB

**ndb_print_sys_file** obtém informações de diagnóstico de um arquivo do sistema do NDB Cluster.

#### Uso

```
ndb_print_sys_file file_name
```

*`file_name`* é o nome de um arquivo de sistema de cluster (sysfile). Arquivos de sistema de cluster estão localizados no diretório de dados de um nó de dados (`DataDir`); o caminho sob este diretório para arquivos de sistema corresponde ao padrão `ndb_#_fs/D#/DBDIH/P#.sysfile`. Em cada caso, o *`#`* representa um número (não necessariamente o mesmo número). Para mais informações, consulte o diretório do sistema de arquivos de nó de dados do NDB Cluster.

Assim como **ndb_print_backup_file** e **ndb_print_schema_file** (e ao contrário da maioria das outras ferramentas do `NDB` que são destinadas a serem executadas em um servidor de gerenciamento ou para se conectar a um servidor de gerenciamento), **ndb_print_backup_file** deve ser executado em um nó de dados de cluster, pois ele acessa diretamente o sistema de arquivos do nó de dados. Como ele não faz uso do servidor de gerenciamento, essa ferramenta pode ser usada quando o servidor de gerenciamento não está em execução e até mesmo quando o cluster foi completamente desligado.

#### Opções Adicionais

None.

### 25.5.22 ndb_redo_log_reader — Verificar e imprimir o conteúdo do log de refazer do cluster

Leitura de um arquivo de registro de refazer, verificando-o quanto a erros, imprimindo seu conteúdo em um formato legível para humanos, ou ambos. **ndb_redo_log_reader** é destinado principalmente para uso por desenvolvedores do NDB Cluster e pessoal de suporte na depuração e diagnóstico de problemas.

Esse utilitário permanece em desenvolvimento e sua sintaxe e comportamento estão sujeitos a mudanças nas próximas versões do NDB Cluster.

Os arquivos de código fonte em C++ para **ndb_redo_log_reader** podem ser encontrados no diretório `/storage/ndb/src/kernel/blocks/dblqh/redoLogReader`.

As opções que podem ser usadas com **ndb_redo_log_reader** estão mostradas na tabela a seguir. Descrições adicionais seguem a tabela.

**Tabela 25.41 Opções de linha de comando usadas com o programa ndb_redo_log_reader**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th scope="col">Format</th> <th scope="col">Description</th> <th scope="col">Added, Deprecated, or Removed</th> </tr></thead><tbody><tr> <th scope="row"><p> <code class="option"> -dump </code> </p></th> <td>Imprimir informações de varredura</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--file-key=key</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-redo-log-reader.html#option_ndb_redo_log_reader_file-key">- tecla K</a> </code> </p></th> <td>Forneça a chave de descriptografia</td> <td><p>ADICIONADO: NDB 8.0.31</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --file-key-from-stdin </code> </p></th> <td>Forneça a chave de descriptografia usando stdin</td> <td><p>ADICIONADO: NDB 8.0.31</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> -filedescriptors </code> </p></th> <td>Imprimir descritores de arquivo apenas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --help </code> </p></th> <td>Informações sobre o uso da impressão (não tem forma abreviada)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> -lap </code> </p></th> <td>Forneça informações sobre a volta, com o máximo de GCI iniciado e concluído</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-redo-log-reader.html#option_ndb_redo_log_reader_mbyte">- mbyte #</a> </code> </p></th> <td>Começando em megabyte</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> -mbyteheaders </code> </p></th> <td>Mostrar apenas o cabeçalho da primeira página de cada megabyte no arquivo</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> -nocheck </code> </p></th> <td>Não verifique os registros quanto a erros</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> -noprint </code> </p></th> <td>Não imprima registros</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-redo-log-reader.html#option_ndb_redo_log_reader_page">-página #</a> </code> </p></th> <td>Comece por esta página</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> -pageheaders </code> </p></th> <td>Mostrar apenas os cabeçalhos da página</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-redo-log-reader.html#option_ndb_redo_log_reader_pageindex">-pageindex #</a> </code> </p></th> <td>Comece com este índice da página</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> -twiddle </code> </p></th> <td>Dump com deslocamento de bits</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody></table>

#### Uso

```
ndb_redo_log_reader file_name [options]
```

*`file_name`* é o nome de um arquivo de registro de redo de um grupo. os arquivos de registro de redo estão localizados nos diretórios numerados sob o diretório de dados do nó de dados (`DataDir`); o caminho sob este diretório para os arquivos de registro de redo corresponde ao padrão `ndb_nodeid_fs/D#/DBLQH/S#.FragLog`. *`nodeid`* é o ID do nó de dados. As duas instâncias de *`#`* representam cada uma um número (não necessariamente o mesmo número); o número que segue `D` está no intervalo de 8 a 39, inclusive; o intervalo do número que segue `S` varia de acordo com o valor do parâmetro de configuração `NoOfFragmentLogFiles`, cujo valor padrão é 16; assim, o intervalo padrão do número no nome do arquivo é de 0 a 15, inclusive. Para mais informações, consulte o diretório do sistema de arquivos de nó de dados do NDB Cluster.

O nome do arquivo a ser lido pode ser seguido por uma ou mais das opções listadas aqui:

* `-dump`

  <table frame="box" rules="all" summary="Properties for dump"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>-dump</code></td> </tr></tbody></table>

Imprimir informações de dump.

* `--file-key`, `-K`

  <table frame="box" rules="all" summary="Properties for file-key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--file-key=key</code></td> </tr><tr><th>Introduced</th> <td>8.0.31-ndb-8.0.31</td> </tr></tbody></table>

Forneça a chave de descriptografia do arquivo usando `stdin`, `tty` ou um arquivo `my.cnf`.

* `--file-key-from-stdin`

  <table frame="box" rules="all" summary="Properties for file-key-from-stdin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--file-key-from-stdin</code></td> </tr><tr><th>Introduced</th> <td>8.0.31-ndb-8.0.31</td> </tr></tbody></table>

Forneça a chave de descriptografia do arquivo usando `stdin`.

* <table frame="box" rules="all" summary="Properties for filedescriptors"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>-filedescriptors</code></td> </tr></tbody></table>

`-filedescriptors`: Imprima descritores de arquivo apenas.

* <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

`--help`: Imprimir informações de uso.

* `-lap`

  <table frame="box" rules="all" summary="Properties for lap"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>-lap</code></td> </tr></tbody></table>

Forneça informações sobre a volta, com o máximo de GCI iniciado e concluído.

* <table frame="box" rules="all" summary="Properties for mbyte"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>-mbyte #</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>15</code></td> </tr></tbody></table>

`-mbyte #`(mysql-cluster-programs-ndb-redo-log-reader.html#option_ndb_redo_log_reader_mbyte): Início em megabyte.

*`#`* é um número inteiro na faixa de 0 a 15, inclusive.

* <table frame="box" rules="all" summary="Properties for mbyteheaders"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>-mbyteheaders</code></td> </tr></tbody></table>

`-mbyteheaders`: Mostrar apenas o cabeçalho da primeira página de cada megabyte no arquivo.

* <table frame="box" rules="all" summary="Properties for noprint"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>-noprint</code></td> </tr></tbody></table>

`-noprint`: Não imprima o conteúdo do arquivo de registro.

* <table frame="box" rules="all" summary="Properties for dump"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>-dump</code></td> </tr></tbody></table>0

`-nocheck`: Não verifique o arquivo de registro em busca de erros.

* <table frame="box" rules="all" summary="Properties for dump"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>-dump</code></td> </tr></tbody></table>1

`-page #`(mysql-cluster-programs-ndb-redo-log-reader.html#option_ndb_redo_log_reader_page): Comece nesta página.

*`#`* é um número inteiro na faixa de 0 a 31, inclusive.

* <table frame="box" rules="all" summary="Properties for dump"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>-dump</code></td> </tr></tbody></table>2

`-pageheaders`: Mostrar apenas cabeçalhos de página.

* <table frame="box" rules="all" summary="Properties for dump"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>-dump</code></td> </tr></tbody></table>3

`-pageindex #`(mysql-cluster-programs-ndb-redo-log-reader.html#option_ndb_redo_log_reader_pageindex): Comece nesta página de índice.

*`#`* é um número inteiro entre 12 e 8191, inclusive.

* `-twiddle`

  <table frame="box" rules="all" summary="Properties for dump"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>-dump</code></td> </tr></tbody></table>4

Dump com deslocamento de bits.

Assim como **ndb_print_backup_file** e **ndb_print_schema_file** (e ao contrário da maioria das ferramentas do `NDB` que são destinadas a serem executadas em um servidor de gerenciamento ou para se conectar a um servidor de gerenciamento), **ndb_redo_log_reader** deve ser executado em um nó de dados do cluster, pois ele acessa diretamente o sistema de arquivos do nó de dados. Como ele não faz uso do servidor de gerenciamento, essa ferramenta pode ser usada quando o servidor de gerenciamento não está em execução e até mesmo quando o cluster foi completamente desligado.

### 25.5.23 ndb_restore — Restaurar um backup de um NDB Cluster

O programa de restauração do NDB Cluster é implementado como um utilitário separado de linha de comando **ndb_restore**, que normalmente pode ser encontrado no diretório `bin` do MySQL. Este programa lê os arquivos criados como resultado do backup e insere as informações armazenadas no banco de dados.

No NDB 7.6 e versões anteriores, este programa imprimia `NDBT_ProgramExit - status` após a conclusão de sua execução, devido a uma dependência desnecessária da biblioteca de teste [[`NDBT`]. Essa dependência foi removida no NDB 8.0, eliminando a saída desnecessária.

O **ndb_restore** deve ser executado uma vez para cada um dos arquivos de backup que foram criados pelo comando `START BACKUP` usado para criar o backup (consulte a Seção 25.6.8.2, “Usando o Cliente de Gerenciamento do NDB Cluster para Criar um Backup”). Isso é igual ao número de nós de dados no cluster no momento em que o backup foi criado.

Nota

Antes de usar o **ndb_restore**, é recomendável que o clúster esteja em modo de usuário único, a menos que você esteja restaurando vários nós de dados em paralelo. Consulte a Seção 25.6.6, “Modo de usuário único do clúster NDB”, para obter mais informações.

As opções que podem ser usadas com **ndb_restore** estão mostradas na tabela a seguir. Descrições adicionais seguem a tabela.

**Tabela 25.42 Opções de linha de comando usadas com o programa ndb_restore**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th scope="col">Format</th> <th scope="col">Description</th> <th scope="col">Added, Deprecated, or Removed</th> </tr></thead><tbody><tr> <th scope="row"><p> <code class="option"> --allow-pk-changes[=0|1] </code> </p></th> <td>Permitir alterações no conjunto de colunas que compõem a chave primária da tabela</td> <td><p>ADICIONADO: NDB 8.0.21</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --append </code> </p></th> <td>Adicione dados a um arquivo delimitado por tabulação</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --backup-password=password </code> </p></th> <td>Forneça uma senha para descriptografar um backup criptografado com --decrypt; consulte a documentação para os valores permitidos</td> <td><p>ADICIONADO: NDB 8.0.22</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --backup-password-from-stdin </code> </p></th> <td>Obtenha a senha de descriptografia de forma segura a partir de STDIN; use junto com a opção --decrypt</td> <td><p>ADICIONADO: NDB 8.0.24</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --backup-path=path </code> </p></th> <td>Caminho para o diretório dos arquivos de backup</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--backupid=#</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_backupid">-b #</a> </code> </p></th> <td>Restaurar a partir do backup com este ID</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --character-sets-dir=path </code> </p></th> <td>Directory containing character sets</td> <td><p> REMOVED: 8.0.31 </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--connect=connection_string</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_connect">-c connection_string</a> </code> </p></th> <td>Alias para --connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --connect-retries=# </code> </p></th> <td>Número de vezes para tentar a conexão novamente antes de desistir</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --connect-retry-delay=# </code> </p></th> <td>Número de segundos para esperar entre as tentativas de contato com o servidor de gerenciamento</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--connect-string=connection_string</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_connect-string">-c connection_string</a> </code> </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --core-file </code> </p></th> <td>Escreva o arquivo de núcleo em erro; usado em depuração</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --decrypt </code> </p></th> <td>Descubra um backup criptografado; requer --backup-password</td> <td><p>ADICIONADO: NDB 8.0.22</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --defaults-extra-file=path </code> </p></th> <td>Leia o arquivo fornecido após os arquivos globais terem sido lidos</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --defaults-file=path </code> </p></th> <td>Ler opções padrão a partir do arquivo fornecido apenas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --defaults-group-suffix=string </code> </p></th> <td>Leia também grupos com concat(grupo, sufixo)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --disable-indexes </code> </p></th> <td>Ignocia índices de backup; pode diminuir o tempo necessário para restaurar os dados</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--dont-ignore-systab-0</code>,</p><p> <code class="option"> -f </code> </p></th> <td>Não ignore a tabela do sistema durante o restabelecimento; experimental; não para uso de produção</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --exclude-databases=list </code> </p></th> <td>Lista de uma ou mais bases de dados a serem excluídas (inclui as que não estão nomeadas)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --exclude-intermediate-sql-tables[=TRUE|FALSE] </code> </p></th> <td>Não restaure nenhuma tabela intermediária (com nomes prefixados com '#sql-') que foram deixadas de operações de ALTER TABLE; especifique FALSO para restaurar tais tabelas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --exclude-missing-columns </code> </p></th> <td>As colunas das versões de backup da tabela que estão faltando na versão da tabela no banco de dados devem ser ignoradas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --exclude-missing-tables </code> </p></th> <td>As tabelas dos backups que estão faltando no banco de dados são ignoradas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --exclude-tables=list </code> </p></th> <td>Lista de uma ou mais tabelas a serem excluídas (inclui aquelas na mesma base de dados que não têm nome); cada referência de tabela deve incluir o nome da base de dados</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --fields-enclosed-by=char </code> </p></th> <td>Campos são delimitados por este caractere</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --fields-optionally-enclosed-by </code> </p></th> <td>Os campos são opcionalmente encerrados por este caractere</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --fields-terminated-by=char </code> </p></th> <td>Os campos são terminados por este caractere</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--help</code>,</p><p> <code class="option"> -? </code> </p></th> <td>Exibir texto de ajuda e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --hex </code> </p></th> <td>Imprimir tipos binários no formato hexadecimal</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --ignore-extended-pk-updates[=0|1] </code> </p></th> <td>Ignorar entradas de registro que contenham atualizações em colunas agora incluídas na chave primária estendida</td> <td><p>ADICIONADO: NDB 8.0.21</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --include-databases=list </code> </p></th> <td>Lista de uma ou mais bancos de dados para restaurar (excluindo aqueles que não estão nomeados)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --include-stored-grants </code> </p></th> <td>Restaure usuários compartilhados e concessões para a tabela ndb_sql_metadata</td> <td><p>ADICIONADO: NDB 8.0.19</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --include-tables=list </code> </p></th> <td>Lista de uma ou mais tabelas a serem restauradas (excluindo aquelas na mesma base de dados que não têm nome); cada referência de tabela deve incluir o nome da base de dados</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --lines-terminated-by=char </code> </p></th> <td>As linhas são terminadas por este caractere</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --login-path=path </code> </p></th> <td>Leia o caminho fornecido a partir do arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--lossy-conversions</code>,</p><p> <code class="option"> -L </code> </p></th> <td>Permitir conversões com perda de dados de valores de coluna (tipo redução ou mudança de sinal) ao restaurar dados de backup</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --no-binlog </code> </p></th> <td>Se o mysqld estiver conectado e usando registro binário, não registre os dados restaurados</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --no-defaults </code> </p></th> <td>Não leia as opções padrão de qualquer arquivo de opção, exceto o arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--no-restore-disk-objects</code>,</p><p> <code class="option"> -d </code> </p></th> <td>Não restaure objetos relacionados aos dados do disco</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--no-upgrade</code>,</p><p> <code class="option"> -u </code> </p></th> <td>Não atualize o tipo de matriz para atributos varsize que não redimensionem os dados VAR e não mude os atributos de coluna</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--ndb-connectstring=connection_string</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_ndb-connectstring">-c connection_string</a> </code> </p></th> <td>Defina a string de conexão para se conectar ao ndb_mgmd. Sintaxe: "[nodeid=id;][host=]hostname[:port]". Supere as entradas em NDB_CONNECTSTRING e my.cnf</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--ndb-mgmd-host=connection_string</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_ndb-mgmd-host">-c connection_string</a> </code> </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--ndb-nodegroup-map=map</code>,</p><p> <code class="option"> -z </code> </p></th> <td>Especifique o mapa do grupo de nós; não utilizado, não suportado</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --ndb-nodeid=# </code> </p></th> <td>Defina o ID do nó para este nó, substituindo qualquer ID definida pela opção --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --ndb-optimized-node-selection </code> </p></th> <td>Ative as otimizações para a seleção de nós para transações. Ativado por padrão; use --skip-ndb-optimized-node-selection para desativá-lo</td> <td><p>REMOvido: 8.0.31</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--nodeid=#</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_nodeid">- n #</a> </code> </p></th> <td>ID do nó onde o backup foi feito</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --num-slices=# </code> </p></th> <td>Número de fatias a aplicar ao restaurar por fatia</td> <td><p>ADICIONADO: NDB 8.0.20</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--parallelism=#</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_parallelism">-p #</a> </code> </p></th> <td>Número de transações paralelas a serem usadas durante a restauração dos dados</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--preserve-trailing-spaces</code>,</p><p> <code class="option"> -P </code> </p></th> <td>Permitir a preservação de espaços finais (incluindo preenchimento) ao promover tipos de string de largura fixa para tipos de largura variável</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --print </code> </p></th> <td>Imprima metadados, dados e log no stdout (equivalente a --print-meta --print-data --print-log)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --print-data </code> </p></th> <td>Imprimir dados no stdout</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --print-defaults </code> </p></th> <td>Imprimir a lista de argumentos do programa e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --print-log </code> </p></th> <td>Imprimir o log no stdout</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --print-meta </code> </p></th> <td>Imprimir metadados no stdout</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --print-sql-log </code> </p></th> <td>Escreva o log SQL no stdout</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --progress-frequency=# </code> </p></th> <td>Status de impressão do restabelecimento de cada número de segundos fornecido</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--promote-attributes</code>,</p><p> <code class="option"> -A </code> </p></th> <td>Permitir que atributos sejam promovidos ao restaurar dados de backup</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --rebuild-indexes </code> </p></th> <td>Causa a reconstrução multithreading de índices ordenados encontrados em backup; o número de threads utilizadas é determinado pela definição de BuildIndexThreads</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --remap-column=string </code> </p></th> <td>Aplicar deslocamento ao valor da coluna especificada usando a função e os argumentos indicados. O formato é [db].[tbl].[col]:[fn]:[args]; consulte a documentação para detalhes</td> <td><p>ADICIONADO: NDB 8.0.21</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--restore-data</code>,</p><p> <code class="option"> -r </code> </p></th> <td>Restaure os dados e os registros da tabela no NDB Cluster usando a API NDB</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--restore-epoch</code>,</p><p> <code class="option"> -e </code> </p></th> <td>Restaure as informações da época na tabela de status; útil em um clúster de replicação para iniciar a replicação; atualize ou insira uma linha no mysql.ndb_apply_status com ID 0</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--restore-meta</code>,</p><p> <code class="option"> -m </code> </p></th> <td>Restaure metadados no NDB Cluster usando a API NDB</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --restore-privilege-tables </code> </p></th> <td>Restaure as tabelas de privilégios do MySQL que foram anteriormente movidas para NDB</td> <td><p>DESAPROVADO: NDB 8.0.16</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --rewrite-database=string </code> </p></th> <td>Restaure para um banco de dados com nomes diferentes; o formato é olddb, newdb</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --skip-broken-objects </code> </p></th> <td>Ignorar tabelas de blobs ausentes no arquivo de backup</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--skip-table-check</code>,</p><p> <code class="option"> -s </code> </p></th> <td>Ignorar a verificação da estrutura da tabela durante o restauro</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --skip-unknown-objects </code> </p></th> <td>As causas de objetos do esquema não reconhecidos pelo ndb_restore serem ignorados ao restaurar um backup feito de uma versão mais nova do NDB para uma versão mais antiga.</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --slice-id=# </code> </p></th> <td>Slice ID, ao restaurar por fatias</td> <td><p>ADICIONADO: NDB 8.0.20</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--tab=path</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_tab">-T path</a> </code> </p></th> <td>Cria um arquivo .txt separado por tabulação para cada tabela no caminho fornecido</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --timestamp-printouts{=true|false} </code> </p></th> <td>Prefixe todas as informações, mensagens de erro e logs de depuração com timestamps</td> <td><p>ADICIONADO: NDB 8.0.33</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--usage</code>,</p><p> <code class="option"> -? </code> </p></th> <td>Exibir texto de ajuda e sair; o mesmo que --help</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --verbose=# </code> </p></th> <td>Nível de verbosidade na saída</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--version</code>,</p><p> <code class="option"> -V </code> </p></th> <td>Exibir informações da versão e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --with-apply-status </code> </p></th> <td>Restaure a tabela ndb_apply_status. Requer --restore-data</td> <td><p>ADICIONADO: NDB 8.0.29</p></td> </tr></tbody></table>

* `--allow-pk-changes`

  <table frame="box" rules="all" summary="Properties for allow-pk-changes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--allow-pk-changes[=0|1]</code></td> </tr><tr><th>Introduced</th> <td>8.0.21-ndb-8.0.21</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1</code></td> </tr></tbody></table>

Quando esta opção é definida como `1`, o **ndb_restore** permite que as chaves primárias em uma definição de tabela diferem daquela da mesma tabela no backup. Isso pode ser desejável ao fazer backup e restaurar entre diferentes versões do esquema com mudanças na chave primária em uma ou mais tabelas, e parece que realizar a operação de restauração usando o ndb_restore é mais simples ou mais eficiente do que emitir muitas declarações `ALTER TABLE` após restaurar os esquemas e dados das tabelas.

As seguintes mudanças nas definições de chave primária são suportadas por `--allow-pk-changes`:

+ **Extensão da chave primária**: Uma coluna não nula que existe no esquema da tabela no backup se torna parte da chave primária da tabela no banco de dados.

Importante

Ao estender a chave primária de uma tabela, quaisquer colunas que se tornem parte da chave primária não devem ser atualizadas enquanto o backup estiver sendo realizado; quaisquer atualizações desse tipo descobertas pelo **ndb_restore** causam o fracasso da operação de restauração, mesmo quando não ocorre nenhuma mudança no valor. Em alguns casos, pode ser possível sobrepor esse comportamento usando a opção [[`--ignore-extended-pk-updates`]; consulte a descrição dessa opção para mais informações.

+ **Contratar a chave primária (1)**: Uma coluna que já faz parte da chave primária da tabela no esquema de backup não faz mais parte da chave primária, mas permanece na tabela.

+ **Contatar a chave primária (2)**: Uma coluna que já faz parte da chave primária da tabela no esquema de backup é removida completamente da tabela.

Essas diferenças podem ser combinadas com outras diferenças de esquema suportadas pelo **ndb_restore**, incluindo alterações em colunas de blob e texto que exigem o uso de tabelas de preparação.

Os passos básicos em um cenário típico que envolve mudanças no esquema de chave primária estão listados aqui:

1. Restaure os esquemas de tabela usando **ndb_restore** `--restore-meta`

2. Altere o esquema para o desejado ou crie-o.
3. Faça um backup do esquema desejado.
4. Execute **ndb_restore** `--disable-indexes` usando o backup do passo anterior, para descartar índices e restrições.

5. Execute **ndb_restore** `--allow-pk-changes` (possivelmente junto com `--ignore-extended-pk-updates`, `--disable-indexes` e, possivelmente, outras opções conforme necessário) para restaurar todos os dados

6. Execute o **ndb_restore** `--rebuild-indexes` usando o backup feito com o esquema desejado, para reconstruir índices e restrições

Ao estender a chave primária, pode ser necessário que o **ndb_restore** use um índice secundário único temporário durante a operação de restauração para mapear a chave primária antiga para a nova. Esse índice é criado apenas quando necessário para aplicar eventos do log de backup a uma tabela que tenha uma chave primária estendida. Esse índice é denominado `NDB$RESTORE_PK_MAPPING` e é criado em cada tabela que o requer; ele pode ser compartilhado, se necessário, por múltiplas instâncias do **ndb_restore** que estão em paralelo. (Executar **ndb_restore** `--rebuild-indexes` no final do processo de restauração faz com que esse índice seja descartado.)

* `--append`

  <table frame="box" rules="all" summary="Properties for append"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--append</code></td> </tr></tbody></table>

Quando usado com as opções `--tab` e `--print-data`, isso faz com que os dados sejam anexados a quaisquer arquivos existentes que tenham os mesmos nomes.

* `--backup-path`=*`dir_name`*

  <table frame="box" rules="all" summary="Properties for backup-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backup-path=path</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>./</code></td> </tr></tbody></table>

O caminho para o diretório de backup é necessário; este é fornecido ao **ndb_restore** usando a opção `--backup-path`, e deve incluir o subdiretório correspondente ao backup de ID do backup a ser restaurado. Por exemplo, se o `DataDir` do nó de dados é `/var/lib/mysql-cluster`, então o diretório de backup é `/var/lib/mysql-cluster/BACKUP`, e os arquivos de backup do backup com o ID 3 podem ser encontrados em `/var/lib/mysql-cluster/BACKUP/BACKUP-3`. O caminho pode ser absoluto ou relativo ao diretório em que o executável **ndb_restore** está localizado, e pode ser opcionalmente prefixado com `backup-path=`.

É possível restaurar um backup para um banco de dados com uma configuração diferente daquela em que foi criado. Por exemplo, suponha que um backup com o ID de backup `12`, criado em um clúster com dois nós de armazenamento com os IDs de nó `2` e `3`, deva ser restaurado para um clúster com quatro nós. Então, **ndb_restore** deve ser executado duas vezes — uma vez para cada nó de armazenamento no clúster onde o backup foi feito. No entanto, **ndb_restore** nem sempre pode restaurar backups feitos de um clúster que executa uma versão do MySQL para um clúster que executa uma versão diferente do MySQL. Consulte a Seção 25.3.7, “Atualização e Downgrading do NDB Cluster”, para obter mais informações.

Importante

Não é possível restaurar um backup feito a partir de uma versão mais recente do NDB Cluster usando uma versão mais antiga do **ndb_restore**. Você pode restaurar um backup feito a partir de uma versão mais recente do MySQL para um cluster mais antigo, mas você deve usar uma cópia do **ndb_restore** da versão mais recente do NDB Cluster para fazer isso.

Por exemplo, para restaurar um backup de cluster tirado de um cluster que está executando NDB Cluster 8.0.44 a um cluster que está executando NDB Cluster 7.6.36, você deve usar o **ndb_restore** que vem com a distribuição do NDB Cluster 7.6.36.

Para uma restauração mais rápida, os dados podem ser restaurados em paralelo, desde que haja um número suficiente de conexões de clúster disponíveis. Ou seja, ao restaurar para múltiplos nós em paralelo, você deve ter uma seção `[api]` ou `[mysqld]` no arquivo de clúster `config.ini` disponível para cada processo **ndb_restore** concorrente. No entanto, os arquivos de dados devem sempre ser aplicados antes dos logs.

* `--backup-password=password`

  <table frame="box" rules="all" summary="Properties for backup-password"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backup-password=password</code></td> </tr><tr><th>Introduced</th> <td>8.0.22-ndb-8.0.22</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

Esta opção especifica uma senha a ser usada ao descriptografar um backup criptografado com a opção `--decrypt`. Esta senha deve ser a mesma que foi usada para criptografar o backup.

A senha deve ter de 1 a 256 caracteres e deve ser encerrada por aspas simples ou duplas. Ela pode conter qualquer um dos caracteres ASCII com códigos de caracteres 32, 35, 38, 40-91, 93, 95 e 97-126; em outras palavras, pode usar qualquer caractere ASCII imprimível, exceto `!`, `'`, `"`, `$`, `%`, `\` e `^`.

Em MySQL 8.0.24 e versões posteriores, é possível omitir a senha, nesse caso, o **ndb_restore** espera que ela seja fornecida pelo `stdin`, como ao usar o `--backup-password-from-stdin`.

* `--backup-password-from-stdin[=TRUE|FALSE]`

  <table frame="box" rules="all" summary="Properties for backup-password-from-stdin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backup-password-from-stdin</code></td> </tr><tr><th>Introduced</th> <td>8.0.24-ndb-8.0.24</td> </tr></tbody></table>

Quando usado no lugar de `--backup-password`, esta opção permite a entrada da senha de backup a partir da concha do sistema (`stdin`), de forma semelhante à maneira como isso é feito ao fornecer a senha interativamente ao **mysql** ao usar o `--password` sem fornecer a senha na linha de comando.

* `--backupid`=*`#`*, `-b`

  <table frame="box" rules="all" summary="Properties for backupid"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backupid=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>none</code></td> </tr></tbody></table>

Esta opção é usada para especificar o ID ou número de sequência do backup e é o mesmo número mostrado pelo cliente de gerenciamento na mensagem `Backup backup_id completed` exibida após a conclusão de um backup. (Veja a Seção 25.6.8.2, “Usando o Cliente de Gerenciamento do NDB Cluster para Criar um Backup”.)

Importante

Ao restaurar backups de clúster, você deve ter certeza de que todos os nós de dados são restaurados a partir de backups com o mesmo ID de backup. O uso de arquivos de backups diferentes resulta, no máximo, na restauração do clúster a um estado inconsistente e, provavelmente, falhará completamente.

Em NDB 8.0, essa opção é necessária.

* `--character-sets-dir`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>

Diretório contendo conjuntos de caracteres.

* `--connect`, `-c`

  <table frame="box" rules="all" summary="Properties for connect"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect=connection_string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>localhost:1186</code></td> </tr></tbody></table>

Alias para `--ndb-connectstring`.

* `--connect-retries`

  <table frame="box" rules="all" summary="Properties for connect-retries"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>12</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>12</code></td> </tr></tbody></table>

Número de vezes para tentar a conexão novamente antes de desistir.

* `--connect-retry-delay`

  <table frame="box" rules="all" summary="Properties for allow-pk-changes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--allow-pk-changes[=0|1]</code></td> </tr><tr><th>Introduced</th> <td>8.0.21-ndb-8.0.21</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1</code></td> </tr></tbody></table>0

Número de segundos para esperar entre as tentativas de contato com o servidor de gerenciamento.

* `--connect-string`

  <table frame="box" rules="all" summary="Properties for allow-pk-changes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--allow-pk-changes[=0|1]</code></td> </tr><tr><th>Introduced</th> <td>8.0.21-ndb-8.0.21</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1</code></td> </tr></tbody></table>1

O mesmo que `--ndb-connectstring`.

* `--core-file`

  <table frame="box" rules="all" summary="Properties for allow-pk-changes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--allow-pk-changes[=0|1]</code></td> </tr><tr><th>Introduced</th> <td>8.0.21-ndb-8.0.21</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1</code></td> </tr></tbody></table>2

Escreva o arquivo de núcleo em erro; usado em depuração.

* `--decrypt`

  <table frame="box" rules="all" summary="Properties for allow-pk-changes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--allow-pk-changes[=0|1]</code></td> </tr><tr><th>Introduced</th> <td>8.0.21-ndb-8.0.21</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1</code></td> </tr></tbody></table>3

Descubra um backup criptografado usando a senha fornecida pela opção `--backup-password`.

* `--defaults-extra-file`

  <table frame="box" rules="all" summary="Properties for allow-pk-changes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--allow-pk-changes[=0|1]</code></td> </tr><tr><th>Introduced</th> <td>8.0.21-ndb-8.0.21</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1</code></td> </tr></tbody></table>4

Leia o arquivo fornecido após a leitura dos arquivos globais.

* `--defaults-file`

  <table frame="box" rules="all" summary="Properties for allow-pk-changes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--allow-pk-changes[=0|1]</code></td> </tr><tr><th>Introduced</th> <td>8.0.21-ndb-8.0.21</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1</code></td> </tr></tbody></table>5

Leia as opções padrão a partir do arquivo fornecido apenas.

* `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Properties for allow-pk-changes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--allow-pk-changes[=0|1]</code></td> </tr><tr><th>Introduced</th> <td>8.0.21-ndb-8.0.21</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1</code></td> </tr></tbody></table>6

Leia também grupos com concatenação(grupo, sufixo).

* `--disable-indexes`

  <table frame="box" rules="all" summary="Properties for allow-pk-changes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--allow-pk-changes[=0|1]</code></td> </tr><tr><th>Introduced</th> <td>8.0.21-ndb-8.0.21</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1</code></td> </tr></tbody></table>7

Desative a restauração de índices durante a restauração dos dados de um backup nativo do `NDB`. Posteriormente, você pode restaurar índices para todas as tabelas de uma vez com a construção de índices multithread usando o `--rebuild-indexes`, que deve ser mais rápido do que reconstruir índices simultaneamente para tabelas muito grandes.

Em NDB 8.0.27 e versões posteriores, essa opção também exclui quaisquer chaves estrangeiras especificadas no backup.

Antes da NDB 8.0.29, tentar acessar a tabela `NDB` a partir do MySQL para a qual um ou mais índices não puderam ser encontrados sempre foi rejeitado com o erro `4243` Índice não encontrado. A partir da NDB 8.0.29, é possível para o MySQL abrir tal tabela, desde que a consulta não utilize nenhum dos índices afetados; caso contrário, a consulta é rejeitada com `ER_NOT_KEYFILE`. No último caso, você pode trabalhar temporariamente em torno do problema executando uma declaração `ALTER TABLE` como esta:

  ```
  ALTER TABLE tbl ALTER INDEX idx INVISIBLE;
  ```

Isso faz com que o MySQL ignore o índice `idx` na tabela `tbl`. Consulte Chave Primária e Índices, para mais informações.

* `--dont-ignore-systab-0`, `-f`

  <table frame="box" rules="all" summary="Properties for allow-pk-changes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--allow-pk-changes[=0|1]</code></td> </tr><tr><th>Introduced</th> <td>8.0.21-ndb-8.0.21</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1</code></td> </tr></tbody></table>8

Normalmente, ao restaurar dados de tabela e metadados, o **ndb_restore** ignora a cópia da tabela do sistema `NDB` que está presente no backup. `--dont-ignore-systab-0` faz com que a tabela do sistema seja restaurada. *Esta opção é destinada apenas para uso experimental e de desenvolvimento, e não é recomendada em um ambiente de produção*.

* `--exclude-databases`=*`db-list`*

  <table frame="box" rules="all" summary="Properties for allow-pk-changes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--allow-pk-changes[=0|1]</code></td> </tr><tr><th>Introduced</th> <td>8.0.21-ndb-8.0.21</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1</code></td> </tr></tbody></table>9

Lista delimitada por vírgula de um ou mais bancos de dados que não devem ser restaurados.

Essa opção é frequentemente usada em combinação com `--exclude-tables`; consulte a descrição dessa opção para obter mais informações e exemplos.

* `--exclude-intermediate-sql-tables`=*`TRUE|FALSE]`*

  <table frame="box" rules="all" summary="Properties for append"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--append</code></td> </tr></tbody></table>0

Ao realizar operações de cópia `ALTER TABLE`(alter-table.html "15.1.9 ALTER TABLE Statement"), o **mysqld** cria tabelas intermediárias (cujos nomes são prefixados com `#sql-`). Quando a opção `TRUE` é ativada, o **ndb_restore** não restaura essas tabelas que podem ter sido deixadas para trás nessas operações. Esta opção é a padrão `TRUE`.

* `--exclude-missing-columns`

  <table frame="box" rules="all" summary="Properties for append"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--append</code></td> </tr></tbody></table>1

É possível restaurar apenas as colunas selecionadas da tabela usando esta opção, o que faz com que o **ndb_restore** ignore quaisquer colunas ausentes das tabelas que estão sendo restauradas em comparação com as versões dessas tabelas encontradas no backup. Esta opção se aplica a todas as tabelas que estão sendo restauradas. Se você deseja aplicar esta opção apenas a tabelas ou bancos selecionados, pode usá-la em combinação com uma ou mais das opções `--include-*` ou `--exclude-*` descritas em outras partes desta seção para fazer isso, e depois restaurar dados para as tabelas restantes usando um conjunto complementar dessas opções.

* `--exclude-missing-tables`

  <table frame="box" rules="all" summary="Properties for append"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--append</code></td> </tr></tbody></table>2

É possível restaurar apenas as tabelas selecionadas usando essa opção, o que faz com que o **ndb_restore** ignore quaisquer tabelas do backup que não sejam encontradas no banco de dados de destino.

* `--exclude-tables`=*`table-list`*

  <table frame="box" rules="all" summary="Properties for append"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--append</code></td> </tr></tbody></table>3

Lista de uma ou mais tabelas a serem excluídas; cada referência de tabela deve incluir o nome do banco de dados. Frequentemente usada em conjunto com `--exclude-databases`.

Quando o `--exclude-databases` ou o `--exclude-tables` é usado, apenas as bases de dados ou tabelas nomeadas pela opção são excluídas; todas as outras bases de dados e tabelas são restauradas pelo **ndb_restore**.

Esta tabela mostra várias invocações do **ndb_restore** usando as opções `--exclude-*` (outras opções que possivelmente são necessárias foram omitidas por questões de clareza), e os efeitos que essas opções têm na restauração a partir de um backup de NDB Cluster:

**Tabela 25.43 Várias invocatórias do ndb_restore usando opções --exclude-\*, e os efeitos que essas opções têm na restauração a partir de um backup de NDB Cluster.**

  <table frame="box" rules="all" summary="Properties for append"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--append</code></td> </tr></tbody></table>4

Você pode usar essas duas opções juntas. Por exemplo, as seguintes causas fazem com que todas as tabelas em todos os bancos de dados *exceto* os bancos de dados `db1` e `db2`, e as tabelas `t1` e `t2` no banco de dados `db3`, sejam restauradas:

  ```
  $> ndb_restore [...] --exclude-databases=db1,db2 --exclude-tables=db3.t1,db3.t2
  ```

(Novamente, omitimos outras opções que podem ser necessárias, por questões de clareza e brevidade, do exemplo que foi mostrado anteriormente.)

Você pode usar as opções `--include-*` e `--exclude-*` juntas, sujeito às seguintes regras:

+ As ações de todas as opções de `--include-*` e `--exclude-*` são cumulativas.

Todas as opções de `--include-*` e `--exclude-*` são avaliadas na ordem passada para ndb_restore, de direita para esquerda.

+ Em caso de opções conflitantes, a primeira (a mais à direita) tem precedência. Em outras palavras, a primeira opção (da direita para a esquerda) que corresponde a um banco de dados ou tabela específica "vence".

Por exemplo, o seguinte conjunto de opções faz com que o **ndb_restore** restaure todas as tabelas do banco de dados `db1`, exceto `db1.t1`, sem restaurar outras tabelas de quaisquer outros bancos de dados:

  ```
  --include-databases=db1 --exclude-tables=db1.t1
  ```

No entanto, simplesmente reverter a ordem das opções fornecidas acima faz com que todas as tabelas do banco de dados `db1` sejam restauradas (incluindo `db1.t1`, mas sem tabelas de qualquer outro banco de dados), porque a opção `--include-databases`, sendo a mais à direita, é a primeira correspondência contra o banco de dados `db1` e, portanto, tem precedência sobre qualquer outra opção que corresponda a `db1` ou qualquer tabela em `db1`:

  ```
  --exclude-tables=db1.t1 --include-databases=db1
  ```

* `--fields-enclosed-by`=*`char`*

  <table frame="box" rules="all" summary="Properties for append"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--append</code></td> </tr></tbody></table>5

Cada valor da coluna é encerrado pela string passada para esta opção (sem importar o tipo de dados; veja a descrição de `--fields-optionally-enclosed-by`).

* `--fields-optionally-enclosed-by`

  <table frame="box" rules="all" summary="Properties for append"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--append</code></td> </tr></tbody></table>6

A cadeia de caracteres passada para esta opção é usada para encerrar os valores das colunas que contêm dados de caracteres (como `CHAR`, `VARCHAR`, `BINARY`, `TEXT` ou `ENUM`).

* `--fields-terminated-by`=*`char`*

  <table frame="box" rules="all" summary="Properties for append"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--append</code></td> </tr></tbody></table>7

A cadeia de caracteres passada para esta opção é usada para separar os valores das colunas. O valor padrão é um caractere de tabulação (`\t`).

* `--help`

  <table frame="box" rules="all" summary="Properties for append"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--append</code></td> </tr></tbody></table>8

Exibir texto de ajuda e sair.

* `--hex`

  <table frame="box" rules="all" summary="Properties for append"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--append</code></td> </tr></tbody></table>9

Se esta opção for usada, todos os valores binários serão exibidos no formato hexadecimal.

* `--ignore-extended-pk-updates`

  <table frame="box" rules="all" summary="Properties for backup-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backup-path=path</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>./</code></td> </tr></tbody></table>0

Ao usar `--allow-pk-changes`, as colunas que se tornam parte da chave primária de uma tabela não devem ser atualizadas enquanto o backup está sendo feito; essas colunas devem manter os mesmos valores do momento em que os valores são inseridos nelas até que as linhas que contêm os valores sejam excluídas. Se o **ndb_restore** encontrar atualizações nessas colunas ao restaurar um backup, o restauro falha. Como algumas aplicações podem definir valores para todas as colunas ao atualizar uma linha, mesmo quando alguns valores das colunas não são alterados, o backup pode incluir eventos de log que parecem atualizar colunas que, na verdade, não são modificadas. Nesses casos, você pode configurar `--ignore-extended-pk-updates` para `1`, forçando o **ndb_restore** a ignorar tais atualizações.

Importante

Ao fazer com que essas atualizações sejam ignoradas, o usuário é responsável por garantir que não haja atualizações nos valores de quaisquer colunas que se tornem parte da chave primária.

Para mais informações, consulte a descrição de `--allow-pk-changes`.

* `--include-databases`=*`db-list`*

  <table frame="box" rules="all" summary="Properties for backup-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backup-path=path</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>./</code></td> </tr></tbody></table>1

Lista delimitada por vírgula de um ou mais bancos de dados a serem restaurados. Frequentemente usada em conjunto com `--include-tables`; consulte a descrição daquela opção para obter mais informações e exemplos.

* `--include-stored-grants`

  <table frame="box" rules="all" summary="Properties for backup-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backup-path=path</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>./</code></td> </tr></tbody></table>2

No NDB 8.0, o **ndb_restore** não restaura, por padrão, usuários compartilhados e concessões (consulte a Seção 25.6.13, “Sincronização de privilégios e NDB_STORED_USER”) na tabela `ndb_sql_metadata`. Especificar essa opção faz com que ele faça isso.

* `--include-tables`=*`table-list`*

  <table frame="box" rules="all" summary="Properties for backup-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backup-path=path</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>./</code></td> </tr></tbody></table>3

Lista de tabelas separadas por vírgula a serem restauradas; cada referência de tabela deve incluir o nome do banco de dados.

Quando o `--include-databases` ou o `--include-tables` é usado, apenas as bases de dados ou tabelas nomeadas pela opção são restauradas; todas as outras bases de dados e tabelas são excluídas pelo **ndb_restore** e não são restauradas.

A tabela a seguir mostra várias invocações do **ndb_restore** usando as opções `--include-*` (outras opções que podem ser necessárias foram omitidas por questões de clareza), e os efeitos que elas têm na restauração a partir de um backup de NDB Cluster:

**Tabela 25.44 Várias invocatórias do ndb_restore usando opções --include-\* e seus efeitos na restauração a partir de um backup de NDB Cluster.**

  <table frame="box" rules="all" summary="Properties for backup-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backup-path=path</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>./</code></td> </tr></tbody></table>4

Você também pode usar essas duas opções juntas. Por exemplo, o seguinte faz com que todas as tabelas nos bancos de dados `db1` e `db2`, juntamente com as tabelas `t1` e `t2` no banco de dados `db3`, sejam restauradas (e nenhuma outra base de dados ou tabela):

  ```
  $> ndb_restore [...] --include-databases=db1,db2 --include-tables=db3.t1,db3.t2
  ```

(Novamente, omitimos outras opções, possivelmente necessárias, no exemplo mostrado anteriormente.)

Também é possível restaurar apenas bancos de dados selecionados ou tabelas selecionadas de um único banco de dados, sem quaisquer opções de `--include-*` (ou `--exclude-*`), usando a sintaxe mostrada aqui:

  ```
  ndb_restore other_options db_name,[db_name[,...] | tbl_name[,tbl_name][,...]]
  ```

Em outras palavras, você pode especificar qualquer uma das seguintes opções para ser restaurada:

+ Todas as tabelas de um ou mais bancos de dados
+ Uma ou mais tabelas de um único banco de dados
* `--lines-terminated-by`=*`char`*

  <table frame="box" rules="all" summary="Properties for backup-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backup-path=path</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>./</code></td> </tr></tbody></table>5

Especifica a string usada para finalizar cada linha de saída. O padrão é um caractere de nova linha (`\n`).

* `--login-path`

  <table frame="box" rules="all" summary="Properties for backup-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backup-path=path</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>./</code></td> </tr></tbody></table>6

Leia o caminho fornecido a partir do arquivo de login.

* `--lossy-conversions`, `-L`

  <table frame="box" rules="all" summary="Properties for backup-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backup-path=path</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>./</code></td> </tr></tbody></table>7

Esta opção é destinada a complementar a opção `--promote-attributes`. O uso de `--lossy-conversions` permite conversões com perda de dados dos valores das colunas (tipos redução ou mudança de sinal) ao restaurar dados de backup. Com algumas exceções, as regras que regem a redução são as mesmas para a replicação do MySQL; consulte a Seção 19.5.1.9.2, “Replicação de Colunas com Diferentes Tipos de Dados”, para informações sobre as conversões de tipos específicos atualmente suportadas pela redução de atributos.

A partir do NDB 8.0.26, essa opção também permite restaurar uma coluna `NULL` como `NOT NULL`. A coluna não deve conter nenhuma entrada `NULL`; caso contrário, o **ndb_restore** pára com um erro.

**ndb_restore** relata qualquer truncamento de dados que ele realiza durante as conversões não-lossy uma vez por atributo e coluna.

* `--no-binlog`

  <table frame="box" rules="all" summary="Properties for backup-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backup-path=path</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>./</code></td> </tr></tbody></table>8

Essa opção impede que quaisquer nós SQL conectados escrevam dados restaurados pelo **ndb_restore** em seus registros binários.

* `--no-restore-disk-objects`, `-d`

  <table frame="box" rules="all" summary="Properties for backup-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backup-path=path</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>./</code></td> </tr></tbody></table>9

Essa opção impede que o **ndb_restore** restaure quaisquer objetos de dados do disco do NDB Cluster, como espaços de tabela e grupos de arquivos de registro; consulte a Seção 25.6.11, “Tabelas de dados de disco do NDB Cluster”, para obter mais informações sobre esses dados.

* `--no-upgrade`, `-u`

  <table frame="box" rules="all" summary="Properties for backup-password"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backup-password=password</code></td> </tr><tr><th>Introduced</th> <td>8.0.22-ndb-8.0.22</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>0

Ao usar o **ndb_restore** para restaurar um backup, as colunas `VARCHAR` criadas usando o antigo formato fixo são redimensionadas e recriadas usando o formato de largura variável que agora é empregado. Esse comportamento pode ser ignorado especificando `--no-upgrade`.

* `--ndb-connectstring`

  <table frame="box" rules="all" summary="Properties for backup-password"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backup-password=password</code></td> </tr><tr><th>Introduced</th> <td>8.0.22-ndb-8.0.22</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>1

Defina a string de conexão para se conectar ao ndb_mgmd. Sintaxe: "[nodeid=id;][host=]hostname[:port]". Ocorre entradas em NDB_CONNECTSTRING e my.cnf.

* `--ndb-mgmd-host`

  <table frame="box" rules="all" summary="Properties for backup-password"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backup-password=password</code></td> </tr><tr><th>Introduced</th> <td>8.0.22-ndb-8.0.22</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>2

O mesmo que `--ndb-connectstring`.

* `--ndb-nodegroup-map`=*`map`*, `-z`

  <table frame="box" rules="all" summary="Properties for backup-password"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backup-password=password</code></td> </tr><tr><th>Introduced</th> <td>8.0.22-ndb-8.0.22</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>3

Destinado a restaurar um backup tirado de um grupo de nós para um grupo de nós diferente, mas nunca completamente implementado; não é suportado.

Todo o código que suporta essa opção foi removido no NDB 8.0.27; nessa e em versões posteriores, qualquer valor definido para ela é ignorado, e a própria opção não faz nada.

* `--ndb-nodeid`

  <table frame="box" rules="all" summary="Properties for backup-password"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backup-password=password</code></td> </tr><tr><th>Introduced</th> <td>8.0.22-ndb-8.0.22</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>4

Defina o ID do nó para este nó, substituindo qualquer ID definida por `--ndb-connectstring`.

* `--ndb-optimized-node-selection`

  <table frame="box" rules="all" summary="Properties for backup-password"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backup-password=password</code></td> </tr><tr><th>Introduced</th> <td>8.0.22-ndb-8.0.22</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>5

Ative as otimizações para a seleção de nós para transações. Ativado por padrão; use `--skip-ndb-optimized-node-selection` para desativá-lo.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for backup-password"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backup-password=password</code></td> </tr><tr><th>Introduced</th> <td>8.0.22-ndb-8.0.22</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>6

Não leia as opções padrão de qualquer arquivo de opção, exceto o arquivo de login.

* `--nodeid`=*`#`*, `-n`

  <table frame="box" rules="all" summary="Properties for backup-password"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backup-password=password</code></td> </tr><tr><th>Introduced</th> <td>8.0.22-ndb-8.0.22</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>7

Especifique o ID do nó do nó de dados em que o backup foi feito.

Ao restaurar em um clúster com um número diferente de nós de dados daquele em que o backup foi feito, essas informações ajudam a identificar o conjunto ou conjuntos de arquivos corretos a serem restaurados em um nó específico. (Nesses casos, geralmente é necessário restaurar vários arquivos para um único nó de dados.) Consulte a Seção 25.5.23.2, “Restauração em um número diferente de nós de dados”, para obter informações adicionais e exemplos.

Em NDB 8.0, essa opção é necessária.

* `--num-slices`=*`#`*

  <table frame="box" rules="all" summary="Properties for backup-password"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backup-password=password</code></td> </tr><tr><th>Introduced</th> <td>8.0.22-ndb-8.0.22</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>8

Ao restaurar um backup por fatias, esta opção define o número de fatias em que o backup será dividido. Isso permite que múltiplas instâncias do **ndb_restore** restaurem subconjuntos disjuntos em paralelo, reduzindo potencialmente o tempo necessário para realizar a operação de restauração.

Um *slice* é um subconjunto dos dados em um backup dado; ou seja, é um conjunto de fragmentos que possuem o mesmo ID de slice, especificado usando a opção `--slice-id`. As duas opções devem ser sempre usadas juntas, e o valor definido por `--slice-id` deve sempre ser menor que o número de slices.

**ndb_restore** encontra fragmentos e atribui a cada um um contador de fragmento. Ao restaurar por fatias, um ID de fatia é atribuído a cada fragmento; esse ID de fatia está na faixa de 0 a 1 menos que o número de fatias. Para uma tabela que não é uma tabela `BLOB`, a fatia à qual um fragmento dado pertence é determinada usando a fórmula mostrada aqui:

  ```
  [slice_ID] = [fragment_counter] % [number_of_slices]
  ```

Para uma tabela `BLOB`, um contador de fragmentos não é usado; o número do fragmento é usado em vez disso, juntamente com o ID da tabela principal para a tabela `BLOB` (recorra-se ao fato de que `NDB` armazena valores de *`BLOB`* em uma tabela separada internamente). Neste caso, o ID do corte para um fragmento dado é calculado como mostrado aqui:

  ```
  [slice_ID] =
  ([main_table_ID] + [fragment_ID]) % [number_of_slices]
  ```

Assim, restaurar por *`N`* fatias significa executar *`N`* instâncias de **ndb_restore**, todas com `--num-slices=N` (junto com quaisquer outras opções necessárias) e uma cada com `--slice-id=1`, `--slice-id=2`, `--slice-id=3`, e assim por diante até `slice-id=N-1`.

**Exemplo.** Suponha que você queira restaurar um backup chamado `BACKUP-1`, encontrado no diretório padrão `/var/lib/mysql-cluster/BACKUP/BACKUP-3` no sistema de arquivos do nó em cada nó de dados, para um clúster com quatro nós de dados com os IDs de nó 1, 2, 3 e 4. Para realizar essa operação usando cinco fatias, execute os conjuntos de comandos mostrados na lista a seguir:

1. Restaure os metadados do cluster usando **ndb_restore** como mostrado aqui:

     ```
     $> ndb_restore -b 1 -n 1 -m --disable-indexes --backup-path=/home/ndbuser/backups
     ```

2. Restaure os dados do cluster nos nós de dados invocando **ndb_restore** como mostrado aqui:

     ```
     $> ndb_restore -b 1 -n 1 -r --num-slices=5 --slice-id=0 --backup-path=/var/lib/mysql-cluster/BACKUP/BACKUP-1
     $> ndb_restore -b 1 -n 1 -r --num-slices=5 --slice-id=1 --backup-path=/var/lib/mysql-cluster/BACKUP/BACKUP-1
     $> ndb_restore -b 1 -n 1 -r --num-slices=5 --slice-id=2 --backup-path=/var/lib/mysql-cluster/BACKUP/BACKUP-1
     $> ndb_restore -b 1 -n 1 -r --num-slices=5 --slice-id=3 --backup-path=/var/lib/mysql-cluster/BACKUP/BACKUP-1
     $> ndb_restore -b 1 -n 1 -r --num-slices=5 --slice-id=4 --backup-path=/var/lib/mysql-cluster/BACKUP/BACKUP-1

     $> ndb_restore -b 1 -n 2 -r --num-slices=5 --slice-id=0 --backup-path=/var/lib/mysql-cluster/BACKUP/BACKUP-1
     $> ndb_restore -b 1 -n 2 -r --num-slices=5 --slice-id=1 --backup-path=/var/lib/mysql-cluster/BACKUP/BACKUP-1
     $> ndb_restore -b 1 -n 2 -r --num-slices=5 --slice-id=2 --backup-path=/var/lib/mysql-cluster/BACKUP/BACKUP-1
     $> ndb_restore -b 1 -n 2 -r --num-slices=5 --slice-id=3 --backup-path=/var/lib/mysql-cluster/BACKUP/BACKUP-1
     $> ndb_restore -b 1 -n 2 -r --num-slices=5 --slice-id=4 --backup-path=/var/lib/mysql-cluster/BACKUP/BACKUP-1

     $> ndb_restore -b 1 -n 3 -r --num-slices=5 --slice-id=0 --backup-path=/var/lib/mysql-cluster/BACKUP/BACKUP-1
     $> ndb_restore -b 1 -n 3 -r --num-slices=5 --slice-id=1 --backup-path=/var/lib/mysql-cluster/BACKUP/BACKUP-1
     $> ndb_restore -b 1 -n 3 -r --num-slices=5 --slice-id=2 --backup-path=/var/lib/mysql-cluster/BACKUP/BACKUP-1
     $> ndb_restore -b 1 -n 3 -r --num-slices=5 --slice-id=3 --backup-path=/var/lib/mysql-cluster/BACKUP/BACKUP-1
     $> ndb_restore -b 1 -n 3 -r --num-slices=5 --slice-id=4 --backup-path=/var/lib/mysql-cluster/BACKUP/BACKUP-1

     $> ndb_restore -b 1 -n 4 -r --num-slices=5 --slice-id=0 --backup-path=/var/lib/mysql-cluster/BACKUP/BACKUP-1
     $> ndb_restore -b 1 -n 4 -r --num-slices=5 --slice-id=1 --backup-path=/var/lib/mysql-cluster/BACKUP/BACKUP-1
     $> ndb_restore -b 1 -n 4 -r --num-slices=5 --slice-id=2 --backup-path=/var/lib/mysql-cluster/BACKUP/BACKUP-1
     $> ndb_restore -b 1 -n 4 -r --num-slices=5 --slice-id=3 --backup-path=/var/lib/mysql-cluster/BACKUP/BACKUP-1
     $> ndb_restore -b 1 -n 4 -r --num-slices=5 --slice-id=4 --backup-path=/var/lib/mysql-cluster/BACKUP/BACKUP-1
     ```

Todos os comandos que acabamos de mostrar neste passo podem ser executados em paralelo, desde que haja espaço suficiente para conexões no clúster (consulte a descrição da opção `--backup-path`).

3. Restaure os índices como de costume, conforme mostrado aqui:

     ```
     $> ndb_restore -b 1 -n 1 --rebuild-indexes --backup-path=/var/lib/mysql-cluster/BACKUP/BACKUP-1
     ```

4. Por fim, restaure a época, usando o comando mostrado aqui:

     ```
     $> ndb_restore -b 1 -n 1 --restore-epoch --backup-path=/var/lib/mysql-cluster/BACKUP/BACKUP-1
     ```

Você deve usar o fatiamento para restaurar apenas os dados do cluster; não é necessário empregar `--num-slices` ou `--slice-id` ao restaurar os metadados, índices ou informações de época. Se uma ou ambas essas opções forem usadas com as opções **ndb_restore** controlando a restauração desses, o programa as ignora.

Os efeitos de usar a opção `--parallelism` na velocidade de restauração são independentes daqueles produzidos por fatiamento ou restauração paralela usando múltiplas instâncias de **ndb_restore** (`--parallelism` especifica o número de transações paralelas executadas por um único **ndb_restore** thread), mas pode ser usado junto com qualquer uma ou ambas. Você deve estar ciente de que aumentar `--parallelism` faz com que **ndb_restore** imposições uma carga maior no clúster; se o sistema pode lidar com isso, a restauração deve ser concluída ainda mais rapidamente.

O valor de `--num-slices` não depende diretamente de valores relacionados ao hardware, como número de CPUs ou núcleos de CPU, quantidade de RAM, etc., e tampouco depende do número de LDMs.

É possível utilizar diferentes valores para esta opção em diferentes nós de dados como parte da mesma restauração; isso não deve, por si só, produzir quaisquer efeitos negativos.

* `--parallelism`=*`#`*, `-p`

  <table frame="box" rules="all" summary="Properties for backup-password"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backup-password=password</code></td> </tr><tr><th>Introduced</th> <td>8.0.22-ndb-8.0.22</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>9

**ndb_restore** utiliza transações de uma única linha para aplicar muitas linhas simultaneamente. Este parâmetro determina o número de transações paralelas (linhas concorrentes) que uma instância de **ndb_restore** tenta usar. Por padrão, este é 128; o mínimo é 1 e o máximo é 1024.

O trabalho de execução das inserções é paraleloizado em todas as threads nos nós de dados envolvidos. Esse mecanismo é empregado para restaurar dados em massa a partir do arquivo `.Data`, ou seja, o instantâneo borrado dos dados; ele não é usado para construir ou reconstruir índices. O log de alterações é aplicado seriamente; as operações de queda e construção de índices são operações DDL e são manipuladas separadamente. Não há paralelismo em nível de thread no lado do cliente do restauro.

* `--preserve-trailing-spaces`, `-P`

  <table frame="box" rules="all" summary="Properties for backup-password-from-stdin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backup-password-from-stdin</code></td> </tr><tr><th>Introduced</th> <td>8.0.24-ndb-8.0.24</td> </tr></tbody></table>0

Fazer com que os espaços finais sejam preservados ao promover um tipo de dados de caracteres de largura fixa para seu equivalente de largura variável — ou seja, ao promover um valor da coluna `CHAR` para `VARCHAR`, ou um valor da coluna `BINARY` para `VARBINARY`. Caso contrário, quaisquer espaços finais são descartados desses valores de coluna quando eles são inseridos nas novas colunas.

Nota

Embora você possa promover as colunas `CHAR` para as colunas `VARCHAR` e `BINARY` para as colunas `VARBINARY`, você não pode promover as colunas `VARCHAR` para as colunas `CHAR` ou `VARBINARY` para as colunas `BINARY`.

* `--print`

  <table frame="box" rules="all" summary="Properties for backup-password-from-stdin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backup-password-from-stdin</code></td> </tr><tr><th>Introduced</th> <td>8.0.24-ndb-8.0.24</td> </tr></tbody></table>1

Faz com que **ndb_restore** imprima todos os dados, metadados e registros em `stdout`. É equivalente ao uso das opções `--print-data`, `--print-meta` e `--print-log` juntas.

Nota

O uso de `--print` ou qualquer uma das opções `--print_*` está, de fato, realizando um ensaio. Incluir uma ou mais dessas opções faz com que qualquer saída seja redirecionada para `stdout`; nesses casos, **ndb_restore** não faz qualquer tentativa de restaurar dados ou metadados em um NDB Cluster.

* `--print-data`

  <table frame="box" rules="all" summary="Properties for backup-password-from-stdin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backup-password-from-stdin</code></td> </tr><tr><th>Introduced</th> <td>8.0.24-ndb-8.0.24</td> </tr></tbody></table>2

Faça com que **ndb_restore** direcione sua saída para `stdout`. Frequentemente usado em conjunto com um ou mais dos `--tab`, `--fields-enclosed-by`, `--fields-optionally-enclosed-by`, `--fields-terminated-by`, `--hex` e `--append`.

Os valores das colunas `TEXT` e `BLOB` são sempre truncados. Esses valores são truncados para os primeiros 256 bytes na saída. Isso atualmente não pode ser sobrescrito ao usar `--print-data`.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for backup-password-from-stdin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backup-password-from-stdin</code></td> </tr><tr><th>Introduced</th> <td>8.0.24-ndb-8.0.24</td> </tr></tbody></table>3

Imprimir a lista de argumentos do programa e sair.

* `--print-log`

  <table frame="box" rules="all" summary="Properties for backup-password-from-stdin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backup-password-from-stdin</code></td> </tr><tr><th>Introduced</th> <td>8.0.24-ndb-8.0.24</td> </tr></tbody></table>4

Faça com que o **ndb_restore** exiba seu log em `stdout`.

* `--print-meta`

  <table frame="box" rules="all" summary="Properties for backup-password-from-stdin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backup-password-from-stdin</code></td> </tr><tr><th>Introduced</th> <td>8.0.24-ndb-8.0.24</td> </tr></tbody></table>5

Imprima todos os metadados para `stdout`.

* `print-sql-log`

  <table frame="box" rules="all" summary="Properties for backup-password-from-stdin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backup-password-from-stdin</code></td> </tr><tr><th>Introduced</th> <td>8.0.24-ndb-8.0.24</td> </tr></tbody></table>6

Registre as declarações SQL em `stdout`. Use a opção para habilitar; normalmente, esse comportamento é desativado. A opção verifica antes de tentar registrar se todas as tabelas que estão sendo restauradas têm chaves primárias explicitamente definidas; consultas em uma tabela que tem apenas a chave primária oculta implementada por `NDB` não podem ser convertidas em SQL válido.

Esta opção não funciona com tabelas que possuem colunas `BLOB`.

* `--progress-frequency`=*`N`*

  <table frame="box" rules="all" summary="Properties for backup-password-from-stdin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backup-password-from-stdin</code></td> </tr><tr><th>Introduced</th> <td>8.0.24-ndb-8.0.24</td> </tr></tbody></table>7

Imprima um relatório de status a cada *`N`* segundos enquanto o backup estiver em andamento. 0 (o padrão) não imprime relatórios de status. O máximo é 65535.

* `--promote-attributes`, `-A`

  <table frame="box" rules="all" summary="Properties for backup-password-from-stdin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backup-password-from-stdin</code></td> </tr><tr><th>Introduced</th> <td>8.0.24-ndb-8.0.24</td> </tr></tbody></table>8

O **ndb_restore** suporta promoção de atributos limitada da mesma maneira que é suportada pela replicação do MySQL; ou seja, os dados respaldados a partir de uma coluna de um tipo dado podem, geralmente, ser restaurados a uma coluna usando um tipo “maior, semelhante”. Por exemplo, os dados de uma coluna `CHAR(20)` podem ser restaurados a uma coluna declarada como `VARCHAR(20)`, `VARCHAR(30)` ou `CHAR(30)`; os dados de uma coluna `MEDIUMINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") podem ser restaurados a uma coluna do tipo `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") ou `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"). Veja a Seção 19.5.1.9.2, “Replicação de Colunas com Diferentes Tipos de Dados”, para uma tabela de conversão de tipos atualmente suportada pela promoção de atributos.

A partir do NDB 8.0.26, essa opção também permite restaurar uma coluna `NOT NULL` como `NULL`.

A atribuição de promoção por **ndb_restore** deve ser habilitada explicitamente, conforme segue:

1. Prepare a tabela para a qual o backup deve ser restaurado. O **ndb_restore** não pode ser usado para recriar a tabela com uma definição diferente da original; isso significa que você deve criar a tabela manualmente ou alterar as colunas que deseja promover usando `ALTER TABLE` após restaurar os metadados da tabela, mas antes de restaurar os dados.

2. Invoque **ndb_restore** com a opção `--promote-attributes` (forma abreviada `-A`) ao restaurar os dados da tabela. A promoção de atributo não ocorre se essa opção não for usada; em vez disso, a operação de restauração falha com um erro.

Ao converter entre tipos de dados de caracteres e `TEXT` ou `BLOB`, apenas as conversões entre tipos de caracteres (`CHAR` e `VARCHAR`) e tipos binários (`BINARY` e `VARBINARY`) podem ser realizadas ao mesmo tempo. Por exemplo, não é possível promover uma coluna `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") para `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") enquanto se promove uma coluna `VARCHAR` para `TEXT` na mesma invocação de **ndb_restore**.

A conversão entre as colunas `TEXT` usando diferentes conjuntos de caracteres não é suportada e é expressamente proibida.

Ao realizar conversões de tipos de caracteres ou binários para `TEXT` ou `BLOB` com **ndb_restore**, você pode notar que ele cria e usa uma ou mais tabelas de preparação com o nome `table_name$STnode_id`. Essas tabelas não são necessárias posteriormente e, normalmente, são excluídas pelo **ndb_restore** após uma restauração bem-sucedida.

* `--rebuild-indexes`

  <table frame="box" rules="all" summary="Properties for backup-password-from-stdin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backup-password-from-stdin</code></td> </tr><tr><th>Introduced</th> <td>8.0.24-ndb-8.0.24</td> </tr></tbody></table>9

Ative a reconstrução multithreading dos índices ordenados ao restaurar um backup nativo do `NDB`. O número de threads usado para construir índices ordenados pelo **ndb_restore** com esta opção é controlado pelo parâmetro de configuração do nó de dados `BuildIndexThreads` e pelo número de LDMs.

É necessário usar essa opção apenas na primeira execução do **ndb_restore**. Isso faz com que todos os índices ordenados sejam reconstruídos sem usar novamente `--rebuild-indexes` ao restaurar nós subsequentes. Você deve usar essa opção antes de inserir novas linhas no banco de dados; caso contrário, é possível inserir uma linha que, posteriormente, cause uma violação de restrição única ao tentar reconstruir os índices.

A construção de índices ordenados é paralela ao número de LDMs por padrão. A construção de índices off-line realizada durante o reinício do nó e do sistema pode ser feita mais rapidamente usando o parâmetro de configuração do nó de dados `BuildIndexThreads`; este parâmetro não tem efeito na eliminação e reconstrução de índices pelo **ndb_restore**, que é realizado online.

A reconstrução de índices únicos utiliza largura de banda de escrita em disco para registro de redo e verificação de ponto local. Uma quantidade insuficiente dessa largura de banda pode levar a sobrecarga do buffer de redo ou erros de sobrecarga de log. Nesses casos, você pode executar novamente **ndb_restore** `--rebuild-indexes` novamente; o processo é retomado no ponto onde o erro ocorreu. Você também pode fazer isso quando encontrou erros temporários. Você pode repetir a execução de **ndb_restore** `--rebuild-indexes` indefinidamente; você pode ser capaz de parar tais erros reduzindo o valor de `--parallelism`. Se o problema for espaço insuficiente, você pode aumentar o tamanho do log de redo (parâmetro de configuração do nó `FragmentLogFileSize`), ou você pode aumentar a velocidade com que os LCPs são realizados (`MaxDiskWriteSpeed` e parâmetros relacionados), a fim de liberar espaço mais rapidamente.

* `--remap-column=db.tbl.col:fn:args`

  <table frame="box" rules="all" summary="Properties for backupid"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backupid=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>none</code></td> </tr></tbody></table>0

Quando usado juntamente com `--restore-data`, esta opção aplica uma função ao valor da coluna indicada. Os valores na string de argumento são listados aqui:

+ *`db`*: Nome do banco de dados, após quaisquer renomeações realizadas por `--rewrite-database`.

+ *`tbl`*: Nome da tabela.  
  + *`col`*: Nome da coluna a ser atualizado. Esta coluna deve ser do tipo `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") ou `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"). A coluna também pode ser, mas não é obrigatória, `UNSIGNED`.

+ *`fn`*: Nome da função; atualmente, o único nome suportado é `offset`.

+ *`args`*: Argumentos fornecidos à função. Atualmente, apenas um único argumento, o tamanho do deslocamento a ser adicionado pela função `offset`, é suportado. Valores negativos são suportados. O tamanho do argumento não pode exceder o da variante assinada do tipo da coluna; por exemplo, se *`col`* é uma coluna `INT`, então o intervalo permitido do argumento passado para a função `offset` é `-2147483648` a `2147483647` (ver [Seção 13.1.2, “Tipos de Inteiro (Valor Exato) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT”](integer-types.html "13.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT)).

Se a aplicação do valor de deslocamento na coluna causar um excesso ou falta, a operação de restauração falha. Isso pode acontecer, por exemplo, se a coluna for uma `BIGINT`, e a opção tente aplicar um valor de deslocamento de 8 em uma linha na qual o valor da coluna é 4294967291, pois `4294967291 + 8 = 4294967299 > 4294967295`.

Esta opção pode ser útil quando você deseja combinar dados armazenados em múltiplas instâncias de origem do NDB Cluster (todas usando o mesmo esquema) em um único NDB Cluster de destino, usando o backup nativo do NDB (consulte a Seção 25.6.8.2, “Usando o Cliente de Gerenciamento do NDB Cluster para Criar um Backup”) e **ndb_restore** para combinar os dados, onde os valores primários e exclusivos da chave estão sobrepostos entre os clusters de origem, e é necessário como parte do processo remapea-los para intervalos que não se sobreponham. Também pode ser necessário preservar outras relações entre as tabelas. Para atender a tais requisitos, é possível usar a opção várias vezes na mesma invocação de **ndb_restore** para remapea-las colunas de diferentes tabelas, como mostrado aqui:

  ```
  $> ndb_restore --restore-data --remap-column=hr.employee.id:offset:1000 \
      --remap-column=hr.manager.id:offset:1000 --remap-column=hr.firstaiders.id:offset:1000
  ```

(Outras opções não mostradas aqui também podem ser usadas.)

`--remap-column` também pode ser usado para atualizar várias colunas da mesma tabela. Combinações de várias tabelas e colunas são possíveis. Diferentes valores de deslocamento também podem ser usados para diferentes colunas da mesma tabela, como este:

  ```
  $> ndb_restore --restore-data --remap-column=hr.employee.salary:offset:10000 \
      --remap-column=hr.employee.hours:offset:-10
  ```

Quando os backups de origem contêm tabelas duplicadas que não devem ser reunidas, você pode lidar com isso usando `--exclude-tables`, `--exclude-databases`, ou por outros meios em sua aplicação.

Informações sobre a estrutura e outras características das tabelas a serem reunidas podem ser obtidas usando `SHOW CREATE TABLE`; a ferramenta **ndb_desc** e `MAX()`, `MIN()`, `LAST_INSERT_ID()` e outras funções do MySQL.

A replicação de alterações de tabelas mescladas para tabelas não mescladas, ou de tabelas não mescladas para tabelas mescladas, em instâncias separadas do NDB Cluster, não é suportada.

* `--restore-data`, `-r`

  <table frame="box" rules="all" summary="Properties for backupid"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backupid=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>none</code></td> </tr></tbody></table>1

Tabela de dados e registros de saída `NDB`.

* `--restore-epoch`, `-e`

  <table frame="box" rules="all" summary="Properties for backupid"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backupid=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>none</code></td> </tr></tbody></table>2

Adicione (ou restaure) informações de época à tabela de status da replicação do clúster. Isso é útil para iniciar a replicação em uma réplica do NDB Cluster. Quando esta opção é usada, a linha no `mysql.ndb_apply_status` que tem `0` na coluna `id` é atualizada se já existir; uma tal linha é inserida se não existir. (Veja a Seção 25.7.9, “Resumos de NDB Cluster com Replicação do NDB Cluster”.)

* `--restore-meta`, `-m`

  <table frame="box" rules="all" summary="Properties for backupid"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backupid=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>none</code></td> </tr></tbody></table>3

Essa opção faz com que o **ndb_restore** imprima os metadados da tabela `NDB`.

A primeira vez que você executar o programa de restauração **ndb_restore**, também é necessário restaurar os metadados. Em outras palavras, você deve recriar as tabelas do banco de dados — isso pode ser feito executando-o com a opção `--restore-meta` (`-m`). A restauração dos metadados precisa ser feita apenas em um único nó de dados; isso é suficiente para restaurá-lo para todo o clúster.

Em versões mais antigas do NDB Cluster, as tabelas cujos esquemas foram restaurados usando essa opção usavam o mesmo número de partições que tinham no cluster original, mesmo que tivesse um número diferente de nós de dados do novo cluster. No NDB 8.0, ao restaurar os metadados, isso não é mais um problema; **ndb_restore** agora usa o número padrão de partições para o cluster alvo, a menos que o número de threads do gerente de dados local também seja alterado do que era para os nós de dados no cluster original.

Ao usar essa opção no NDB 8.0, é recomendável desabilitar a auto-sincronização definindo `ndb_metadata_check=OFF` até que o **ndb_restore** tenha concluído a restauração dos metadados, após o que pode ser ativado novamente para sincronizar os objetos recém-criados no dicionário NDB.

Nota

O grupo deve ter um banco de dados vazio ao começar a restaurar um backup. (Em outras palavras, você deve iniciar os nós de dados com `--initial` antes de realizar a restauração.)

* `--restore-privilege-tables`

  <table frame="box" rules="all" summary="Properties for backupid"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backupid=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>none</code></td> </tr></tbody></table>4

O **ndb_restore** não restaura, por padrão, as tabelas de privilégios distribuídos do MySQL criadas em versões do NDB Cluster anteriores à versão 8.0, que não suporta privilégios distribuídos como implementados no NDB 7.6 e versões anteriores. Esta opção faz com que o **ndb_restore** as restaure.

No NDB 8.0, essas tabelas não são usadas para controle de acesso; como parte do processo de atualização do servidor MySQL, o servidor cria cópias `InnoDB` dessas tabelas locais para si mesmo. Para mais informações, consulte a Seção 25.3.7, “Atualização e Downgrading do NDB Cluster”, bem como a Seção 8.2.3, “Tabelas de Concessão”.

* `--rewrite-database`=*`olddb,newdb`*

  <table frame="box" rules="all" summary="Properties for backupid"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backupid=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>none</code></td> </tr></tbody></table>5

Essa opção permite restaurar um banco de dados com um nome diferente do usado no backup. Por exemplo, se um backup for feito de um banco de dados com o nome `products`, você pode restaurar os dados que ele contém em um banco de dados com o nome `inventory`, usando essa opção conforme mostrado aqui (omitido qualquer outra opção que possa ser necessária):

  ```
  $> ndb_restore --rewrite-database=product,inventory
  ```

A opção pode ser empregada várias vezes em uma única invocação de **ndb_restore**. Assim, é possível restaurar simultaneamente de um banco de dados denominado `db1` para um banco de dados denominado `db2` e de um banco de dados denominado `db3` para um denominado `db4` usando `--rewrite-database=db1,db2 --rewrite-database=db3,db4`. Outras opções de **ndb_restore** podem ser usadas entre múltiplas ocorrências de `--rewrite-database`.

Em caso de conflitos entre várias opções do `--rewrite-database`, a última opção do `--rewrite-database` usada, lendo da esquerda para a direita, é a que se aplica. Por exemplo, se o `--rewrite-database=db1,db2 --rewrite-database=db1,db3` for usado, apenas o `--rewrite-database=db1,db3` é atendido, e o `--rewrite-database=db1,db2` é ignorado. Também é possível restaurar a partir de várias bases de dados para uma única base de dados, de modo que o `--rewrite-database=db1,db3 --rewrite-database=db2,db3` restaure todas as tabelas e dados das bases de dados `db1` e `db2` para a base de dados `db3`.

Importante

Ao restaurar de múltiplos bancos de dados de backup para um único banco de dados de destino usando `--rewrite-database`, não é feita verificação de colisões entre nomes de tabelas ou outros objetos, e a ordem em que as linhas são restauradas não é garantida. Isso significa que, nesses casos, é possível que as linhas sejam sobrescritas e as atualizações sejam perdidas.

* `--skip-broken-objects`

  <table frame="box" rules="all" summary="Properties for backupid"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backupid=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>none</code></td> </tr></tbody></table>6

Essa opção faz com que o **ndb_restore** ignore tabelas corrompidas ao ler um backup nativo do `NDB` e continue a restaurar quaisquer tabelas restantes (que também não estejam corrompidas). Atualmente, a opção `--skip-broken-objects` funciona apenas no caso de tabelas de partes de blob ausentes.

* `--skip-table-check`, `-s`

  <table frame="box" rules="all" summary="Properties for backupid"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backupid=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>none</code></td> </tr></tbody></table>7

É possível restaurar dados sem restaurar os metadados da tabela. Por padrão, ao fazer isso, o **ndb_restore** falha com um erro se for encontrado um desajuste entre os dados da tabela e o esquema da tabela; essa opção substitui esse comportamento.

Algumas das restrições sobre desalinhamentos nas definições das colunas ao restaurar dados usando **ndb_restore** são relaxadas; quando um desses tipos de desalinhamentos é encontrado, **ndb_restore** não para com um erro como fazia anteriormente, mas sim aceita os dados e os insere na tabela de destino, emitindo um aviso ao usuário de que isso está sendo feito. Esse comportamento ocorre independentemente de uma das opções `--skip-table-check` ou `--promote-attributes` estar em uso. Essas diferenças nas definições das colunas são dos seguintes tipos:

+ Diferentes configurações de `COLUMN_FORMAT` (`FIXED`, `DYNAMIC`, `DEFAULT`)

+ Diferentes configurações de `STORAGE` (`MEMORY`, `DISK`)

+ Diferentes valores padrão
  + Diferentes configurações da chave de distribuição
* `--skip-unknown-objects`

  <table frame="box" rules="all" summary="Properties for backupid"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backupid=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>none</code></td> </tr></tbody></table>8

Essa opção faz com que o **ndb_restore** ignore quaisquer objetos do esquema que não reconheça ao ler um backup nativo `NDB`. Isso pode ser usado para restaurar um backup feito de um clúster que executa (por exemplo) NDB 7.6 para um clúster que executa NDB Cluster 7.5.

* `--slice-id`=*`#`*

  <table frame="box" rules="all" summary="Properties for backupid"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backupid=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>none</code></td> </tr></tbody></table>9

Ao restaurar por fatias, este é o ID da fatia a ser restaurada. Esta opção é sempre usada juntamente com `--num-slices`, e seu valor deve sempre ser menor que o de `--num-slices`.

Para mais informações, consulte a descrição do `--num-slices` em outro lugar nesta seção.

* `--tab`=*`dir_name`*, `-T` *`dir_name`*

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>0

Faz com que `--print-data` crie arquivos de depuração, um por tabela, cada um com o nome `tbl_name.txt`. Requer como argumento o caminho do diretório onde os arquivos devem ser salvos; use `.` para o diretório atual.

* `--timestamp-printouts`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>1

As informações sobre as causas, erros e mensagens de registro de depuração são prefixadas com marcações de tempo.

Essa opção é ativada por padrão no NDB 8.0. Desative-a com `--timestamp-printouts=false`.

* `--usage`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>2

Exibir texto de ajuda e sair; o mesmo que `--help`.

* `--verbose`=*`#`*

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>3

Define o nível de verbosidade da saída. O mínimo é 0; o máximo é 255. O valor padrão é 1.

* `--version`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>4

Exibir informações da versão e sair.

* `--with-apply-status`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>5

Restaure todas as linhas da tabela `ndb_apply_status` do backup (exceto a linha que tem `server_id = 0`, que é gerada usando `--restore-epoch`). Esta opção exige que `--restore-data` também seja usada.

Se a tabela `ndb_apply_status` do backup já contiver uma linha com `server_id = 0`, o **ndb_restore** `--with-apply-status` a exclui. Por essa razão, recomendamos que você use o **ndb_restore** `--restore-epoch` após invocar o **ndb_restore** com a opção `--with-apply-status`. Você também pode usar o **ndb_restore** `--restore-epoch` simultaneamente com o último de quaisquer invocações do **ndb_restore** `--with-apply-status` usado para restaurar o clúster.

Para mais informações, consulte a tabela ndb_apply_status.

As opções típicas para este utilitário são mostradas aqui:

```
ndb_restore [-c connection_string] -n node_id -b backup_id \
      [-m] -r --backup-path=/path/to/backup/files
```

Normalmente, ao restaurar de um backup de um NDB Cluster, o **ndb_restore** requer, no mínimo, as opções `--nodeid` (forma abreviada: `-n`), `--backupid` (forma abreviada: `-b`), e `--backup-path`.

A opção `-c` é usada para especificar uma cadeia de conexão que indica ao `ndb_restore` onde localizar o servidor de gerenciamento de clúster (ver Seção 25.4.3.3, “Cadeias de Conexão de NDB Cluster”). Se esta opção não for usada, então o **ndb_restore** tenta se conectar a um servidor de gerenciamento em `localhost:1186`. Este utilitário atua como um nó de API de clúster e, portanto, requer um “slot” de conexão livre para se conectar ao servidor de gerenciamento de clúster. Isso significa que deve haver pelo menos uma seção `[api]` ou `[mysqld]` que possa ser usada por ele no arquivo de clúster `config.ini`. É uma boa ideia manter pelo menos uma seção `[api]` ou `[mysqld]` vazia em `config.ini` que não está sendo usada por um servidor MySQL ou outra aplicação por esse motivo (ver Seção 25.4.3.7, “Definindo SQL e Outros Nodos de API em um Clúster NDB”).

No NDB 8.0.22 e versões posteriores, o **ndb_restore** pode descriptografar um backup criptografado usando `--decrypt` e `--backup-password`. Ambas as opções devem ser especificadas para realizar a descriptografia. Consulte o comando do cliente de gerenciamento `START BACKUP` (mysql-cluster-backup-using-management-client.html "25.6.8.2 Using The NDB Cluster Management Client to Create a Backup") na documentação para obter informações sobre a criação de backups criptografados.

Você pode verificar que o **ndb_restore** está conectado ao clúster usando o comando `SHOW` no cliente de gerenciamento **ndb_mgm**. Você também pode realizar isso a partir de uma linha de comando do sistema, como mostrado aqui:

```
$> ndb_mgm -e "SHOW"
```

**Relatando erros.** O **ndb_restore** reporta tanto erros temporários quanto permanentes. No caso de erros temporários, ele pode recuperá-los e reporta `Restore successful, but encountered temporary error, please look at configuration` nesses casos.

Importante

Após usar o **ndb_restore** para inicializar um NDB Cluster para uso em replicação circular, os registros binários no nó SQL que atua como replica não são criados automaticamente, e você deve criar-os manualmente. Para criar os registros binários, execute uma declaração `SHOW TABLES` nesse nó SQL antes de executar `START SLAVE`](start-slave.html "15.4.2.7 START SLAVE Statement"). Esse é um problema conhecido no NDB Cluster.

#### 25.5.23.1 Restaurando um backup do NDB para uma versão diferente do NDB Cluster

As duas seções a seguir fornecem informações sobre a restauração de um backup nativo do NDB para uma versão diferente do NDB Cluster, em relação à versão na qual o backup foi feito.

Além disso, consulte a Seção 25.3.7, “Atualização e Downgrading do NDB Cluster”, para outras questões que você pode encontrar ao tentar restaurar um backup do NDB em um cluster que executa uma versão diferente do software NDB.

Também é recomendável revisar o que há de novo no NDB Cluster 8.0, bem como a Seção 3.5, “Alterações no MySQL 8.0”, para outras alterações entre o NDB 8.0 e as versões anteriores do NDB Cluster que possam ser relevantes para suas circunstâncias específicas.

##### 25.5.23.1.1 Restaurando um backup do NDB para uma versão anterior do NDB Cluster

Você pode encontrar problemas ao restaurar um backup feito a partir de uma versão mais recente do NDB Cluster para uma versão anterior, devido ao uso de recursos que não existem na versão anterior. Alguns desses problemas estão listados aqui:

* **conjunto de caracteres utf8mb4_ai_ci.** As tabelas criadas no NDB 8.0, por padrão, usam o conjunto de caracteres `utf8mb4_ai_ci`, que não está disponível no NDB 7.6 e versões anteriores, e, portanto, não podem ser lidas por um **ndb_restore** binário de uma dessas versões anteriores. Nesses casos, é necessário alterar quaisquer tabelas usando `utf8mb4_ai_ci` para que elas usem um conjunto de caracteres compatível com a versão anterior antes de realizar o backup.

* **Formato de metadados da tabela.** Devido às mudanças na forma como o MySQL Server e o NDB gerenciam os metadados das tabelas, as tabelas criadas ou alteradas usando o binário do servidor MySQL incluído no NDB 8.0 não podem ser restauradas usando **ndb_restore** para NDB 7.6 ou uma versão anterior do NDB Cluster. Tais tabelas utilizam arquivos `.sdi` que não são compreendidos por versões mais antigas do **mysqld**.

Um backup realizado no NDB 8.0 de tabelas que foram criadas no NDB 7.6 ou versões anteriores e que não foram alteradas desde a atualização para o NDB 8.0, deve ser restaurado para versões anteriores do NDB Cluster.

Como é possível restaurar os metadados e os dados da tabela separadamente, você pode, nesses casos, restaurar os esquemas da tabela a partir de um dump feito usando o **mysqldump**, ou executando as declarações necessárias `CREATE TABLE` manualmente, e, em seguida, importar apenas os dados da tabela usando o **ndb_restore** com a opção `--restore-data`.

* **Backup multi-threaded.** Os backups multi-threaded realizados no NDB 8.0 podem ser restaurados em um clúster que executa uma versão anterior do `NDB` de uma das seguintes duas maneiras:

+ Usando um binário **ndb_restore** do NDB 8.0, realize uma restauração paralela. Veja a Seção 25.5.23.3.1, “Restauração de um backup paralelo em paralelo”.

+ Restaure os backups em série; neste caso, não é necessário uma versão posterior do **ndb_restore**. Veja a Seção 25.5.23.3.2, “Restauração de um backup paralelo em série”.

* **Backup criptografado.** Os backups criptografados criados no NDB 8.0.22 e versões posteriores não podem ser restaurados usando **ndb_restore** do NDB 8.0.21 ou versões anteriores.

* **Privilegio NDB_STORED_USER.** O privilégio `NDB_STORED_USER` é suportado apenas no NDB 8.0.

* **Número máximo de nós de dados.** O NDB Cluster 8.0 suporta até 144 nós de dados, enquanto versões anteriores suportam um máximo de apenas 48 nós de dados. Consulte a Seção 25.5.23.2.1, “Restauração com menos nós do que o original”, para informações sobre situações em que essa incompatibilidade causa um problema.

##### 25.5.23.1.2 Restaurando um backup do NDB para uma versão posterior do NDB Cluster

Em geral, deve ser possível restaurar um backup criado usando o comando do cliente **ndb_mgm** `START BACKUP` em uma versão mais antiga do NDB para uma versão mais recente, desde que você use o binário **ndb_restore** que vem com a versão mais recente. (É possível usar a versão mais antiga do **ndb_restore**, mas isso não é recomendado.) Problemas adicionais potenciais estão listados aqui:

* Ao restaurar os metadados de um backup (opção `--restore-meta`), o **ndb_restore** normalmente tenta reproduzir o esquema da tabela capturado exatamente como estava quando o backup foi feito.

As tabelas criadas em versões do NDB anteriores à 8.0 utilizam arquivos `.frm` para seus metadados. Esses arquivos podem ser lidos pelo **mysqld** no NDB 8.0, que pode usar as informações contidas neles para criar os arquivos `.sdi` usados pelo dicionário de dados MySQL em versões posteriores.

* Ao restaurar um backup mais antigo para uma versão mais recente do NDB, pode não ser possível aproveitar recursos mais recentes, como partição de hashmap, maior número de buckets de hashmap, backup de leitura e diferentes layouts de partição. Por essa razão, pode ser preferível restaurar esquemas mais antigos usando **mysqldump** e o cliente **mysql**, o que permite que o NDB utilize os novos recursos do esquema.

* As tabelas que utilizam os antigos tipos temporais que não suportam segundos fracionários (usados antes do MySQL 5.6.4 e NDB 7.3.31) não podem ser restauradas para o NDB 8.0 usando **ndb_restore**. Você pode verificar essas tabelas usando `CHECK TABLE`, e depois atualizá-las para o novo formato de coluna temporal, se necessário, usando `REPAIR TABLE` e (repair-table.html "15.7.3.5 REPAIR TABLE Statement") no cliente **mysql**. Isso deve ser feito antes de fazer o backup. Consulte a Seção 3.6, “Preparando sua instalação para atualização”, para obter mais informações.

Você também pode restaurar essas tabelas usando um dump criado com o **mysqldump**.

* As tabelas de concessão distribuídas criadas no NDB 7.6 e versões anteriores não são suportadas no NDB 8.0. Essas tabelas podem ser restauradas em um clúster NDB 8.0, mas não têm efeito no controle de acesso.

#### 25.5.23.2 Restabelecendo um número diferente de nós de dados

É possível restaurar um backup do NDB para um clúster que tenha um número diferente de nós de dados em relação ao original do qual o backup foi feito. As duas seções a seguir discutem, respectivamente, os casos em que o clúster de destino tem um número menor ou maior de nós de dados em relação à fonte do backup.

##### 25.5.23.2.1 Restabelecendo menos nós do que o original

Você pode restaurar para um clúster que tenha menos nós de dados do que o original, desde que o número maior de nós seja um múltiplo par do número menor. No exemplo a seguir, usamos um backup feito em um clúster com quatro nós de dados para um clúster com dois nós de dados.

1. O servidor de gerenciamento do clúster original está no host `host10`. O clúster original tem quatro nós de dados, com os IDs de nó e nomes de host mostrados no seguinte extrato do arquivo `config.ini` do servidor de gerenciamento:

   ```
   [ndbd]
   NodeId=2
   HostName=host2

   [ndbd]
   NodeId=4
   HostName=host4

   [ndbd]
   NodeId=6
   HostName=host6

   [ndbd]
   NodeId=8
   HostName=host8
   ```

Suponhamos que cada nó de dados tenha sido originalmente iniciado com **ndbmtd**") `--ndb-connectstring=host10` ou equivalente.

2. Realize um backup da maneira normal. Consulte a Seção 25.6.8.2, “Usando o Cliente de Gerenciamento de NDB Cluster para Criar um Backup”, para obter informações sobre como fazer isso.

3. Os arquivos criados pelo backup em cada nó de dados estão listados aqui, onde *`N`* é o ID do nó e *`B`* é o ID do backup.

* `BACKUP-B-0.N.Data`
* `BACKUP-B.N.ctl`
* `BACKUP-B.N.log`

Esses arquivos são encontrados em `BackupDataDir` e `/BACKUP/BACKUP-B`, em cada nó de dados. Para o resto deste exemplo, assumimos que o ID de backup é 1.

Todos esses arquivos devem estar disponíveis para posterior cópia para os novos nós de dados (onde eles podem ser acessados no sistema de arquivos local do nó de dados pelo **ndb_restore**). É mais simples copiá-los todos para um único local; assumimos que você fez isso.

4. O servidor de gerenciamento do clúster alvo está no host `host20`, e o alvo tem dois nós de dados, com os IDs de nó e nomes de host mostrados, a partir do arquivo do servidor de gerenciamento `config.ini` em `host20`:

   ```
   [ndbd]
   NodeId=3
   hostname=host3

   [ndbd]
   NodeId=5
   hostname=host5
   ```

Cada um dos processos de nó de dados em `host3` e `host5` deve ser iniciado com **ndbmtd**") `-c host20` `--initial` ou equivalente, para que o novo (alvo) cluster comece com sistemas de arquivos de nó de dados limpos.

5. Copie dois conjuntos diferentes de dois arquivos de backup para cada um dos nós de dados de destino. Para este exemplo, copie os arquivos de backup dos nós 2 e 4 do clúster original para o nó 3 no clúster de destino. Esses arquivos estão listados aqui:

* `BACKUP-1-0.2.Data`
* `BACKUP-1.2.ctl`
* `BACKUP-1.2.log`
* `BACKUP-1-0.4.Data`
* `BACKUP-1.4.ctl`
* `BACKUP-1.4.log`

Em seguida, copie os arquivos de backup dos nós 6 e 8 para o nó 5; esses arquivos estão mostrados na lista a seguir:

* `BACKUP-1-0.6.Data`
* `BACKUP-1.6.ctl`
* `BACKUP-1.6.log`
* `BACKUP-1-0.8.Data`
* `BACKUP-1.8.ctl`
* `BACKUP-1.8.log`

Para o restante deste exemplo, assumimos que os respectivos arquivos de backup foram salvos no diretório `/BACKUP-1` em cada um dos nós 3 e 5.

6. Em cada um dos dois nós de dados de destino, você deve restaurar ambos os conjuntos de backups. Primeiro, restaure os backups dos nós 2 e 4 para o nó 3, invocando **ndb_restore** no `host3` como mostrado aqui:

   ```
   $> ndb_restore -c host20 --nodeid=2 --backupid=1 --restore-data --backup-path=/BACKUP-1

   $> ndb_restore -c host20 --nodeid=4 --backupid=1 --restore-data --backup-path=/BACKUP-1
   ```

Em seguida, restaure os backups dos nós 6 e 8 para o nó 5, invocando **ndb_restore** no `host5`, da seguinte forma:

   ```
   $> ndb_restore -c host20 --nodeid=6 --backupid=1 --restore-data --backup-path=/BACKUP-1

   $> ndb_restore -c host20 --nodeid=8 --backupid=1 --restore-data --backup-path=/BACKUP-1
   ```

##### 25.5.23.2.2 Restabelecendo mais nós do que o original

O ID do nó especificado para um comando **ndb_restore** dado é o do nó no backup original e não o do nó de dados para o qual se deseja restaurá-lo. Ao realizar um backup usando o método descrito nesta seção, **ndb_restore** se conecta ao servidor de gerenciamento e obtém uma lista de nós de dados no clúster para o qual o backup está sendo restaurado. Os dados restaurados são distribuídos de acordo, de modo que o número de nós no clúster de destino não precisa ser conhecido ou calculado ao realizar o backup.

Nota

Ao alterar o número total de threads LCP ou threads LQH por grupo de nós, você deve recriar o esquema a partir do backup criado usando **mysqldump**.

1. *Crie o backup dos dados*. Você pode fazer isso invocando o comando do cliente **ndb_mgm** `START BACKUP` no shell do sistema, da seguinte forma:

   ```
   $> ndb_mgm -e "START BACKUP 1"
   ```

Isso pressupõe que o ID de backup desejado é 1.

2. Crie um backup do esquema. Este passo é necessário apenas se o número total de threads LCP ou threads LQH por grupo de nós for alterado.

   ```
   $> mysqldump --no-data --routines --events --triggers --databases > myschema.sql
   ```

Importante

Uma vez que você criou o backup nativo `NDB` usando **ndb_mgm**, você não deve fazer quaisquer alterações no esquema antes de criar o backup do esquema, se você fizer isso.

3. Copie o diretório de backup para o novo clúster. Por exemplo, se o backup que você deseja restaurar tem o ID 1 e `BackupDataDir` = `/backups/node_nodeid`, então o caminho para o backup neste nó é `/backups/node_1/BACKUP/BACKUP-1`. Dentro deste diretório, há três arquivos, listados aqui:

* `BACKUP-1-0.1.Data`
* `BACKUP-1.1.ctl`
* `BACKUP-1.1.log`

Você deve copiar todo o diretório para o novo nó.

Se você precisasse criar um arquivo de esquema, copie-o para um local em um nó SQL onde ele pode ser lido pelo **mysqld**.

Não há necessidade de restaurar o backup a partir de um ou mais nós específicos.

Para restaurar a partir do backup criado recentemente, realize as etapas a seguir:

1. *Restaure o esquema*.

* Se você criou um arquivo de backup de esquema separado usando **mysqldump**, importe este arquivo usando o cliente **mysql**, semelhante ao que é mostrado aqui:

     ```
     $> mysql < myschema.sql
     ```

Ao importar o arquivo do esquema, você pode precisar especificar as opções `--user` e `--password` (e possivelmente outras) além do que é mostrado, para que o cliente **mysql** possa se conectar ao servidor MySQL.

* Se você não precisasse criar um arquivo de esquema, você pode recriar o esquema usando **ndb_restore** `--restore-meta` (forma abreviada `-m`), semelhante ao que é mostrado aqui:

     ```
     $> ndb_restore --nodeid=1 --backupid=1 --restore-meta --backup-path=/backups/node_1/BACKUP/BACKUP-1
     ```

O **ndb_restore** deve ser capaz de entrar em contato com o servidor de gerenciamento; adicione a opção `--ndb-connectstring` se e quando necessário para tornar isso possível.

2. *Restaure os dados*. Isso precisa ser feito uma vez para cada nó de dados no clúster original, cada vez usando o ID do nó do nó de dados. Supondo que originalmente houvesse 4 nós de dados, o conjunto de comandos necessários ficaria algo assim:

   ```
   ndb_restore --nodeid=1 --backupid=1 --restore-data --backup-path=/backups/node_1/BACKUP/BACKUP-1 --disable-indexes
   ndb_restore --nodeid=2 --backupid=1 --restore-data --backup-path=/backups/node_2/BACKUP/BACKUP-1 --disable-indexes
   ndb_restore --nodeid=3 --backupid=1 --restore-data --backup-path=/backups/node_3/BACKUP/BACKUP-1 --disable-indexes
   ndb_restore --nodeid=4 --backupid=1 --restore-data --backup-path=/backups/node_4/BACKUP/BACKUP-1 --disable-indexes
   ```

Esses podem ser executados em paralelo.

Certifique-se de adicionar a opção `--ndb-connectstring` conforme necessário.

3. *Recompile os índices*. Estes foram desativados pela opção `--disable-indexes` usada nos comandos mostrados anteriormente. Recriar os índices evita erros devido ao fato de o restore não ser consistente em todos os pontos. Recompilar os índices também pode melhorar o desempenho em alguns casos. Para recompilar os índices, execute o seguinte comando uma vez, em um único nó:

   ```
   $> ndb_restore --nodeid=1 --backupid=1 --backup-path=/backups/node_1/BACKUP/BACKUP-1 --rebuild-indexes
   ```

Como mencionado anteriormente, você pode precisar adicionar a opção `--ndb-connectstring`, para que o **ndb_restore** possa entrar em contato com o servidor de gerenciamento.

#### 25.5.23.3 Restauração a partir de um backup realizado em paralelo

O NDB Cluster 8.0 suporta backups paralelos em cada nó de dados usando **ndbmtd**") com vários LDMs (consulte a Seção 25.6.8.5, "Realizando um backup NDB com nós de dados paralelos"). As duas próximas seções descrevem como restaurar backups que foram feitos dessa maneira.

##### 25.5.23.3.1 Restaurando um backup paralelo em paralelo

Restaurar um backup paralelo em paralelo requer um binário **ndb_restore** de uma distribuição NDB 8.0. O processo não é substancialmente diferente do que está descrito na seção de uso geral sob a descrição do programa **ndb_restore**, e consiste em executar **ndb_restore** duas vezes, de forma semelhante à que é mostrada aqui:

```
$> ndb_restore -n 1 -b 1 -m --backup-path=path/to/backup_dir/BACKUP/BACKUP-backup_id
$> ndb_restore -n 1 -b 1 -r --backup-path=path/to/backup_dir/BACKUP/BACKUP-backup_id
```

*`backup_id`* é o ID do backup a ser restaurado. No caso geral, não são necessários argumentos especiais adicionais; **ndb_restore** sempre verifica a existência de subdiretórios paralelos sob o diretório indicado pela opção `--backup-path` e restaura os metadados (sequencialmente) e, em seguida, os dados da tabela (em paralelo).

##### 25.5.23.3.2 Restaurando um backup paralelo em série

É possível restaurar um backup que foi feito usando paralelismo nos nós de dados de forma serial. Para fazer isso, invoque **ndb_restore** com `--backup-path` apontando para os subdiretórios criados por cada LDM sob o diretório de backup principal, uma vez para qualquer um dos subdiretórios para restaurar os metadados (não importa qual, uma vez que cada subdiretório contém uma cópia completa dos metadados), em seguida, para cada um dos subdiretórios, em ordem, para restaurar os dados. Suponha que queira restaurar o backup com ID de backup 100 que foi feito com quatro LDMs, e que o `BackupDataDir` seja `/opt`. Para restaurar os metadados neste caso, podemos invocar **ndb_restore** da seguinte forma:

```
$> ndb_restore -n 1 -b 1 -m --backup-path=opt/BACKUP/BACKUP-100/BACKUP-100-PART-1-OF-4
```

Para restaurar os dados da tabela, execute **ndb_restore** quatro vezes, cada vez usando um dos subdiretórios em ordem, conforme mostrado aqui:

```
$> ndb_restore -n 1 -b 1 -r --backup-path=opt/BACKUP/BACKUP-100/BACKUP-100-PART-1-OF-4
$> ndb_restore -n 1 -b 1 -r --backup-path=opt/BACKUP/BACKUP-100/BACKUP-100-PART-2-OF-4
$> ndb_restore -n 1 -b 1 -r --backup-path=opt/BACKUP/BACKUP-100/BACKUP-100-PART-3-OF-4
$> ndb_restore -n 1 -b 1 -r --backup-path=opt/BACKUP/BACKUP-100/BACKUP-100-PART-4-OF-4
```

Você pode empregar a mesma técnica para restaurar uma cópia de segurança paralela para uma versão mais antiga do NDB Cluster (7.6 ou anterior) que não suporte cópias de segurança paralelas, usando o binário **ndb_restore** fornecido com a versão mais antiga do software NDB Cluster.

### 25.5.24 ndb_secretsfile_reader — Obter informações-chave de um arquivo de dados criptografado do NDB

O **ndb_secretsfile_reader** obtém a chave de criptografia de um arquivo de segredos de criptografia `NDB`, dado a senha.

#### Uso

```
ndb_secretsfile_reader options file
```

O *`options` deve incluir um dos `--filesystem-password` ou `--filesystem-password-from-stdin`, e a senha de criptografia deve ser fornecida, conforme mostrado aqui:

```
> ndb_secretsfile_reader --filesystem-password=54kl14 ndb_5_fs/D1/NDBCNTR/S0.sysfile
ndb_secretsfile_reader: [Warning] Using a password on the command line interface can be insecure.
cac256e18b2ddf6b5ef82d99a72f18e864b78453cc7fa40bfaf0c40b91122d18
```

Essas e outras opções que podem ser usadas com **ndb_secretsfile_reader** são mostradas na tabela a seguir. Descrições adicionais seguem a tabela.

**Tabela 25.45 Opções de linha de comando usadas com o programa ndb_secretsfile_reader**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th scope="col">Format</th> <th scope="col">Description</th> <th scope="col">Added, Deprecated, or Removed</th> </tr></thead><tbody><tr> <th scope="row"><p> <code class="option"> --defaults-extra-file=path </code> </p></th> <td>Leia o arquivo fornecido após os arquivos globais terem sido lidos</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --defaults-file=path </code> </p></th> <td>Ler opções padrão a partir do arquivo fornecido apenas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --defaults-group-suffix=string </code> </p></th> <td>Leia também grupos com concat(grupo, sufixo)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --filesystem-password=password </code> </p></th> <td>Senha para criptografia do sistema de arquivos do nó; pode ser passada a partir de stdin, tty ou arquivo my.cnf</td> <td><p>ADICIONADO: 8.0.31</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --filesystem-password-from-stdin={TRUE|FALSE} </code> </p></th> <td>Obtenha a senha de criptografia do stdin</td> <td><p>ADICIONADO: 8.0.31</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--help</code>,</p><p> <code class="option"> -? </code> </p></th> <td>Exibir texto de ajuda e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --login-path=path </code> </p></th> <td>Leia o caminho fornecido a partir do arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --no-defaults </code> </p></th> <td>Não leia as opções padrão de qualquer arquivo de opção, exceto o arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --print-defaults </code> </p></th> <td>Imprimir a lista de argumentos do programa e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--usage</code>,</p><p> <code class="option"> -? </code> </p></th> <td>Exibir texto de ajuda e sair; o mesmo que --help</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--version</code>,</p><p> <code class="option"> -V </code> </p></th> <td>Exibir informações da versão e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody></table>

* `--defaults-extra-file`

  <table frame="box" rules="all" summary="Properties for defaults-extra-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-extra-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

Leia o arquivo fornecido após a leitura dos arquivos globais.

* `--defaults-file`

  <table frame="box" rules="all" summary="Properties for defaults-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

Leia as opções padrão a partir do arquivo fornecido apenas.

* `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Properties for defaults-group-suffix"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-group-suffix=string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

Leia também grupos com concatenação(grupo, sufixo).

* `--filesystem-password`

  <table frame="box" rules="all" summary="Properties for filesystem-password"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--filesystem-password=password</code></td> </tr><tr><th>Introduced</th> <td>8.0.31</td> </tr></tbody></table>

Passe a senha de criptografia e descriptografia do sistema de arquivos para o **ndb_secretsfile_reader** usando `stdin`, `tty` ou o arquivo `my.cnf`.

* `--filesystem-password-from-stdin`

  <table frame="box" rules="all" summary="Properties for filesystem-password-from-stdin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--filesystem-password-from-stdin={TRUE|FALSE}</code></td> </tr><tr><th>Introduced</th> <td>8.0.31</td> </tr></tbody></table>

Passe a senha de criptografia e descriptografia do sistema de arquivos para **ndb_secretsfile_reader** a partir de `stdin` (apenas).

* `--help`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

Exibir texto de ajuda e sair.

* `--login-path`

  <table frame="box" rules="all" summary="Properties for login-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--login-path=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

Leia o caminho fornecido a partir do arquivo de login.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for no-defaults"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--no-defaults</code></td> </tr></tbody></table>

Não leia as opções padrão de qualquer arquivo de opção, exceto o arquivo de login.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for print-defaults"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--print-defaults</code></td> </tr></tbody></table>

Imprimir a lista de argumentos do programa e sair.

* `--usage`

  <table frame="box" rules="all" summary="Properties for defaults-extra-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-extra-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>0

Exibir texto de ajuda e sair; o mesmo que --help.

* `--version`

  <table frame="box" rules="all" summary="Properties for defaults-extra-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-extra-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>1

Exibir informações da versão e sair.

**ndb_secretsfile_reader** foi adicionado no NDB 8.0.31.

### 25.5.25 ndb_select_all — Imprimir linhas de uma tabela NDB

**ndb_select_all** imprime todas as linhas de uma tabela `NDB` para `stdout`.

#### Uso

```
ndb_select_all -c connection_string tbl_name -d db_name [> file_name]
```

As opções que podem ser usadas com **ndb_select_all** estão mostradas na tabela a seguir. Descrições adicionais seguem a tabela.

**Tabela 25.46 Opções de linha de comando usadas com o programa ndb_select_all**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th scope="col">Format</th> <th scope="col">Description</th> <th scope="col">Added, Deprecated, or Removed</th> </tr></thead><tbody><tr> <th scope="row"><p> <code class="option"> --character-sets-dir=path </code> </p></th> <td>Directory containing character sets</td> <td><p> REMOVED: 8.0.31 </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --connect-retries=# </code> </p></th> <td>Número de vezes para tentar a conexão novamente antes de desistir</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --connect-retry-delay=# </code> </p></th> <td>Número de segundos para esperar entre as tentativas de contato com o servidor de gerenciamento</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--connect-string=connection_string</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_connect-string">-c connection_string</a> </code> </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --core-file </code> </p></th> <td>Escreva o arquivo de núcleo em erro; usado em depuração</td> <td><p>REMOvido: 8.0.31</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--database=name</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_database">-d nome</a> </code> </p></th> <td>Nome do banco de dados em que a tabela está localizada</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --defaults-extra-file=path </code> </p></th> <td>Leia o arquivo fornecido após os arquivos globais terem sido lidos</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --defaults-file=path </code> </p></th> <td>Ler opções padrão a partir do arquivo fornecido apenas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --defaults-group-suffix=string </code> </p></th> <td>Leia também grupos com concat(grupo, sufixo)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--delimiter=char</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_delimiter">-D char</a> </code> </p></th> <td>Definir delimitador de coluna</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--descending</code>,</p><p> <code class="option"> -z </code> </p></th> <td>Ordenar o conjunto de resultados em ordem decrescente (requer --order)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --disk </code> </p></th> <td>Imprimir referências de disco (útil apenas para tabelas de Dados de disco que possuem colunas não indexadas)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --gci </code> </p></th> <td>Incluir o GCI no resultado</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --gci64 </code> </p></th> <td>Incluir GCI e época da linha no resultado</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--header[=value]</code>,</p><p> <code class="option"> -h </code> </p></th> <td>Imprimir cabeçalho (definir como 0|FALSO para desativar cabeçalhos na saída)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--lock=#</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_lock">-l #</a> </code> </p></th> <td>Tipo de bloqueio</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --login-path=path </code> </p></th> <td>Leia o caminho fornecido a partir do arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--help</code>,</p><p> <code class="option"> -? </code> </p></th> <td>Exibir texto de ajuda e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--ndb-connectstring=connection_string</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_ndb-connectstring">-c connection_string</a> </code> </p></th> <td>Defina a string de conexão para se conectar ao ndb_mgmd. Sintaxe: "[nodeid=id;][host=]hostname[:port]". Supere as entradas em NDB_CONNECTSTRING e my.cnf</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--ndb-mgmd-host=connection_string</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_ndb-mgmd-host">-c connection_string</a> </code> </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --ndb-nodeid=# </code> </p></th> <td>Defina o ID do nó para este nó, substituindo qualquer ID definida pela opção --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --ndb-optimized-node-selection </code> </p></th> <td>Ative as otimizações para a seleção de nós para transações. Ativado por padrão; use --skip-ndb-optimized-node-selection para desativá-lo</td> <td><p>REMOvido: 8.0.31</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --no-defaults </code> </p></th> <td>Não leia as opções padrão de qualquer arquivo de opção, exceto o arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --nodata </code> </p></th> <td>Não imprima dados de coluna de tabela</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--order=index</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_order">-o índice</a> </code> </p></th> <td>Classificar o conjunto de resultados de acordo com o índice que tem esse nome</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--parallelism=#</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_parallelism">-p #</a> </code> </p></th> <td>Grau de paralelismo</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --print-defaults </code> </p></th> <td>Imprimir a lista de argumentos do programa e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --rowid </code> </p></th> <td>Imprimir ID da linha</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--tupscan</code>,</p><p> <code class="option"> -t </code> </p></th> <td>Escanear em duplas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--usage</code>,</p><p> <code class="option"> -? </code> </p></th> <td>Exibir texto de ajuda e sair; o mesmo que --help</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--useHexFormat</code>,</p><p> <code class="option"> -x </code> </p></th> <td>Números de saída no formato hexadecimal</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--version</code>,</p><p> <code class="option"> -V </code> </p></th> <td>Exibir informações da versão e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody></table>

* `--character-sets-dir`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>

Diretório contendo conjuntos de caracteres.

* `--connect-retries`

  <table frame="box" rules="all" summary="Properties for connect-retries"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>12</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>12</code></td> </tr></tbody></table>

Número de vezes para tentar a conexão novamente antes de desistir.

* `--connect-retry-delay`

  <table frame="box" rules="all" summary="Properties for connect-retry-delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retry-delay=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>5</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>5</code></td> </tr></tbody></table>

Número de segundos para esperar entre as tentativas de contato com o servidor de gerenciamento.

* `--connect-string`

  <table frame="box" rules="all" summary="Properties for connect-string"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-string=connection_string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

O mesmo que `--ndb-connectstring`.

* `--core-file`

  <table frame="box" rules="all" summary="Properties for core-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--core-file</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>

Escreva o arquivo de núcleo em erro; usado em depuração.

* `--database=dbname`, `-d` *`dbname`*

Nome do banco de dados em que a tabela está localizada. O valor padrão é `TEST_DB`.

* `--descending`, `-z`

Ordena a saída em ordem decrescente. Esta opção só pode ser usada em conjunto com a opção `-o` (`--order`).

* `--defaults-extra-file`

  <table frame="box" rules="all" summary="Properties for defaults-extra-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-extra-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

Leia o arquivo fornecido após a leitura dos arquivos globais.

* `--defaults-file`

  <table frame="box" rules="all" summary="Properties for defaults-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

Leia as opções padrão a partir do arquivo fornecido apenas.

* `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Properties for defaults-group-suffix"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-group-suffix=string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

Leia também grupos com concatenação(grupo, sufixo).

* `--delimiter=character`, `-D character`

Faz com que o *`character`* seja usado como delimitador de coluna. Apenas as colunas de dados de tabela são separadas por este delimitador.

O delimitador padrão é o caractere de tabulação.

* `--disk`

Adiciona uma coluna de referência de disco ao resultado. A coluna não está vazia apenas para tabelas de Dados de disco que possuem colunas não indexadas.

* `--gci`

Adiciona uma coluna `GCI` ao resultado, mostrando o ponto de verificação global em que cada linha foi atualizada pela última vez. Consulte a Seção 25.2, “Visão Geral do NDB Cluster”, e a Seção 25.6.3.2, “Eventos de Registro do NDB Cluster”, para obter mais informações sobre os pontos de verificação.

* `--gci64`

Adiciona uma coluna `ROW$GCI64` ao resultado, mostrando o ponto de verificação global em que cada linha foi atualizada pela última vez, bem como o número da época em que essa atualização ocorreu.

* `--help`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

Exibir texto de ajuda e sair.

* `--lock=lock_type`, `-l lock_type`

Emprega um bloqueio ao ler a tabela. Os valores possíveis para *`lock_type`* são:

+ `0`: Bloqueio de leitura

Não há um valor padrão para esta opção.

* `--login-path`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>0

Leia o caminho fornecido a partir do arquivo de login.

* `--header=FALSE`

Exclui os cabeçalhos das colunas do resultado.

* `--nodata`

Faz com que os dados da tabela sejam omitidos.

* `--ndb-connectstring`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>1

Defina a string de conexão para se conectar ao ndb_mgmd. Sintaxe: "[nodeid=id;][host=]hostname[:port]". Ocorre entradas em NDB_CONNECTSTRING e my.cnf.

* `--ndb-mgmd-host`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>2

O mesmo que `--ndb-connectstring`.

* `--ndb-nodeid`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>3

Defina o ID do nó para este nó, substituindo qualquer ID definida por `--ndb-connectstring`.

* `--ndb-optimized-node-selection`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>4

Ative as otimizações para a seleção de nós para transações. Ativado por padrão; use `--skip-ndb-optimized-node-selection` para desativá-lo.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>5

Não leia as opções padrão de qualquer arquivo de opção, exceto o arquivo de login.

* `--order=index_name`, `-o index_name`

Ordene a saída de acordo com o índice denominado *`index_name`*.

Nota

Este é o nome de um índice, não de uma coluna; o índice deve ter sido explicitamente nomeado quando criado.

* `parallelism=#`, `-p` *`#`*

Especifica o grau de paralelismo.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>6

Imprimir a lista de argumentos do programa e sair.

* `--rowid`

Adiciona uma coluna `ROWID` que fornece informações sobre os fragmentos nos quais as linhas são armazenadas.

* `--tupscan`, `-t`

Escanear a tabela na ordem dos tuplos.

* `--usage`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>7

Exibir texto de ajuda e sair; o mesmo que `--help`.

* `--useHexFormat` `-x`

Torna todos os valores numéricos exibidos no formato hexadecimal. Isso não afeta a saída de numerais contidos em strings ou valores de data e hora.

* `--version`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>8

Exibir informações da versão e sair.

#### Saída Exemplo

Saída de uma declaração MySQL `SELECT`:

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

Saída da invocação equivalente de **ndb_select_all**:

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

Todos os valores de string são fechados entre colchetes quadrados (`[`...`]`) na saída do **ndb_select_all**. Para outro exemplo, considere a tabela criada e preenchida conforme mostrado aqui:

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

Isso demonstra o uso de várias opções adicionais do **ndb_select_all**:

```
$> ./ndb_select_all -d ctest1 dogs -o ix -z --gci --disk
GCI     id name          breed        DISK_REF
834461  2  [Scooby-Doo]  [Great Dane] [ m_file_no: 0 m_page: 98 m_page_idx: 0 ]
834878  4  [Rosscoe]     [Mutt]       [ m_file_no: 0 m_page: 98 m_page_idx: 16 ]
834463  3  [Rin-Tin-Tin] [Alsatian]   [ m_file_no: 0 m_page: 34 m_page_idx: 0 ]
835657  1  [Lassie]      [Collie]     [ m_file_no: 0 m_page: 66 m_page_idx: 0 ]
4 rows returned
```

### 25.5.26 ndb_select_count — Imprimir contagem de linhas para tabelas NDB

**ndb_select_count** imprime o número de linhas em uma ou mais tabelas `NDB`. Com uma única tabela, o resultado é equivalente ao obtido usando a declaração MySQL `SELECT COUNT(*) FROM tbl_name`.

#### Uso

```
ndb_select_count [-c connection_string] -ddb_name tbl_name[, tbl_name2[, ...]]
```

As opções que podem ser usadas com **ndb_select_count** estão mostradas na tabela a seguir. Descrições adicionais seguem a tabela.

**Tabela 25.47 Opções de linha de comando usadas com o programa ndb_select_count**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th scope="col">Format</th> <th scope="col">Description</th> <th scope="col">Added, Deprecated, or Removed</th> </tr></thead><tbody><tr> <th scope="row"><p> <code class="option"> --character-sets-dir=path </code> </p></th> <td>Directory containing character sets</td> <td><p> REMOVED: 8.0.31 </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --connect-retries=# </code> </p></th> <td>Número de vezes para tentar a conexão novamente antes de desistir</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --connect-retry-delay=# </code> </p></th> <td>Número de segundos para esperar entre as tentativas de contato com o servidor de gerenciamento</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--connect-string=connection_string</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-select-count.html#option_ndb_select_count_connect-string">-c connection_string</a> </code> </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --core-file </code> </p></th> <td>Escreva o arquivo de núcleo em erro; usado em depuração</td> <td><p>REMOvido: 8.0.31</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--database=name</code>,</p><p> <code>-d name</code> </p></th> <td>Nome do banco de dados em que a tabela está localizada</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --defaults-extra-file=path </code> </p></th> <td>Leia o arquivo fornecido após os arquivos globais terem sido lidos</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --defaults-file=path </code> </p></th> <td>Ler opções padrão a partir do arquivo fornecido apenas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --defaults-group-suffix=string </code> </p></th> <td>Leia também grupos com concat(grupo, sufixo)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--help</code>,</p><p> <code class="option"> -? </code> </p></th> <td>Exibir texto de ajuda e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--lock=#</code>,</p><p> <code>-l #</code> </p></th> <td>Tipo de bloqueio</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --login-path=path </code> </p></th> <td>Leia o caminho fornecido a partir do arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--ndb-connectstring=connection_string</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-select-count.html#option_ndb_select_count_ndb-connectstring">-c connection_string</a> </code> </p></th> <td>Defina a string de conexão para se conectar ao ndb_mgmd. Sintaxe: "[nodeid=id;][host=]hostname[:port]". Supere as entradas em NDB_CONNECTSTRING e my.cnf</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--ndb-mgmd-host=connection_string</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-select-count.html#option_ndb_select_count_ndb-mgmd-host">-c connection_string</a> </code> </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --ndb-nodeid=# </code> </p></th> <td>Defina o ID do nó para este nó, substituindo qualquer ID definida pela opção --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --ndb-optimized-node-selection </code> </p></th> <td>Ative as otimizações para a seleção de nós para transações. Ativado por padrão; use --skip-ndb-optimized-node-selection para desativá-lo</td> <td><p>REMOvido: 8.0.31</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --no-defaults </code> </p></th> <td>Não leia as opções padrão de qualquer arquivo de opção, exceto o arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--parallelism=#</code>,</p><p> <code>-p #</code> </p></th> <td>Grau de paralelismo</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --print-defaults </code> </p></th> <td>Imprimir a lista de argumentos do programa e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--usage</code>,</p><p> <code class="option"> -? </code> </p></th> <td>Exibir texto de ajuda e sair; o mesmo que --help</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--version</code>,</p><p> <code class="option"> -V </code> </p></th> <td>Exibir informações da versão e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody></table>

* `--character-sets-dir`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>

Diretório contendo conjuntos de caracteres.

* `--connect-retries`

  <table frame="box" rules="all" summary="Properties for connect-retries"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>12</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>12</code></td> </tr></tbody></table>

Número de vezes para tentar a conexão novamente antes de desistir.

* `--connect-retry-delay`

  <table frame="box" rules="all" summary="Properties for connect-retry-delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retry-delay=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>5</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>5</code></td> </tr></tbody></table>

Número de segundos para esperar entre as tentativas de contato com o servidor de gerenciamento.

* `--connect-string`

  <table frame="box" rules="all" summary="Properties for connect-string"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-string=connection_string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

O mesmo que `--ndb-connectstring`.

* `--core-file`

  <table frame="box" rules="all" summary="Properties for core-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--core-file</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>

Escreva o arquivo de núcleo em erro; usado em depuração.

* `--defaults-file`

  <table frame="box" rules="all" summary="Properties for defaults-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

Leia as opções padrão a partir do arquivo fornecido apenas.

* `--defaults-extra-file`

  <table frame="box" rules="all" summary="Properties for defaults-extra-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-extra-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

Leia o arquivo fornecido após a leitura dos arquivos globais.

* `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Properties for defaults-group-suffix"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-group-suffix=string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

Leia também grupos com concatenação(grupo, sufixo).

* `--login-path`

  <table frame="box" rules="all" summary="Properties for login-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--login-path=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

Leia o caminho fornecido a partir do arquivo de login.

* `--help`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>0

Exibir texto de ajuda e sair.

* `--ndb-connectstring`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>1

Defina a string de conexão para se conectar ao ndb_mgmd. Sintaxe: "[nodeid=id;][host=]hostname[:port]". Ocorre entradas em NDB_CONNECTSTRING e my.cnf.

* `--ndb-mgmd-host`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>2

O mesmo que `--ndb-connectstring`.

* `--ndb-optimized-node-selection`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>3

Ative as otimizações para a seleção de nós para transações. Ativado por padrão; use `--skip-ndb-optimized-node-selection` para desativá-lo.

* `--ndb-nodeid`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>4

Defina o ID do nó para este nó, substituindo qualquer ID definida por `--ndb-connectstring`.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>5

Não leia as opções padrão de qualquer arquivo de opção, exceto o arquivo de login.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>6

Imprimir a lista de argumentos do programa e sair.

* `--usage`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>7

Exibir texto de ajuda e sair; o mesmo que `--help`.

* `--version`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>8

Exibir informações da versão e sair.

Você pode obter contagem de linhas de várias tabelas no mesmo banco de dados, listando os nomes das tabelas separados por espaços ao invocar este comando, conforme mostrado em **Saída de amostra**.

#### Saída Exemplo

```
$> ./ndb_select_count -c localhost -d ctest1 fish dogs
6 records in table fish
4 records in table dogs
```

### 25.5.27 ndb_show_tables — Exibir Lista de Tabelas NDB

**ndb_show_tables** exibe uma lista de todos os objetos do banco de dados `NDB` no clúster. Por padrão, isso inclui não apenas as tabelas criadas pelo usuário e as tabelas do sistema `NDB`, mas também índices específicos do `NDB`, gatilhos internos e objetos de dados do disco do NDB Cluster.

As opções que podem ser usadas com **ndb_show_tables** são mostradas na tabela a seguir. Descrições adicionais seguem a tabela.

**Tabela 25.48 Opções de linha de comando usadas com o programa ndb_show_tables**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th scope="col">Format</th> <th scope="col">Description</th> <th scope="col">Added, Deprecated, or Removed</th> </tr></thead><tbody><tr> <th scope="row"><p> <code class="option"> --character-sets-dir=path </code> </p></th> <td>Directory containing character sets</td> <td><p> REMOVED: 8.0.31 </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --connect-retries=# </code> </p></th> <td>Número de vezes para tentar a conexão novamente antes de desistir</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --connect-retry-delay=# </code> </p></th> <td>Número de segundos para esperar entre as tentativas de contato com o servidor de gerenciamento</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--connect-string=connection_string</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_connect-string">-c connection_string</a> </code> </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --core-file </code> </p></th> <td>Escreva o arquivo de núcleo em erro; usado em depuração</td> <td><p>REMOvido: 8.0.31</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--database=name</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_database">-d nome</a> </code> </p></th> <td>Especifica o banco de dados em que a tabela está localizada; o nome do banco de dados deve ser seguido pelo nome da tabela.</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --defaults-extra-file=path </code> </p></th> <td>Leia o arquivo fornecido após os arquivos globais terem sido lidos</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --defaults-file=path </code> </p></th> <td>Ler opções padrão a partir do arquivo fornecido apenas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --defaults-group-suffix=string </code> </p></th> <td>Leia também grupos com concat(grupo, sufixo)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --login-path=path </code> </p></th> <td>Leia o caminho fornecido a partir do arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--loops=#</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_loops">-l #</a> </code> </p></th> <td>Número de vezes para repetir a saída</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--help</code>,</p><p> <code class="option"> -? </code> </p></th> <td>Exibir texto de ajuda e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--ndb-connectstring=connection_string</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_ndb-connectstring">-c connection_string</a> </code> </p></th> <td>Defina a string de conexão para se conectar ao ndb_mgmd. Sintaxe: "[nodeid=id;][host=]hostname[:port]". Supere as entradas em NDB_CONNECTSTRING e my.cnf</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--ndb-mgmd-host=connection_string</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_ndb-mgmd-host">-c connection_string</a> </code> </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --ndb-nodeid=# </code> </p></th> <td>Defina o ID do nó para este nó, substituindo qualquer ID definida pela opção --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --ndb-optimized-node-selection </code> </p></th> <td>Ative as otimizações para a seleção de nós para transações. Ativado por padrão; use --skip-ndb-optimized-node-selection para desativá-lo</td> <td><p>REMOvido: 8.0.31</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --no-defaults </code> </p></th> <td>Não leia as opções padrão de qualquer arquivo de opção, exceto o arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--parsable</code>,</p><p> <code class="option"> -p </code> </p></th> <td>Retorno de saída adequada para a instrução LOAD DATA do MySQL</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --print-defaults </code> </p></th> <td>Imprimir a lista de argumentos do programa e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --show-temp-status </code> </p></th> <td>Mostrar bandeira temporária da tabela</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--type=#</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_type">-t #</a> </code> </p></th> <td>Limite a saída para objetos deste tipo</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--unqualified</code>,</p><p> <code class="option"> -u </code> </p></th> <td>Não qualifique os nomes das tabelas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--usage</code>,</p><p> <code class="option"> -? </code> </p></th> <td>Exibir texto de ajuda e sair; o mesmo que --help</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--version</code>,</p><p> <code class="option"> -V </code> </p></th> <td>Exibir informações da versão e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody></table>

#### Uso

```
ndb_show_tables [-c connection_string]
```

* `--character-sets-dir`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>

Diretório contendo conjuntos de caracteres.

* `--connect-retries`

  <table frame="box" rules="all" summary="Properties for connect-retries"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>12</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>12</code></td> </tr></tbody></table>

Número de vezes para tentar a conexão novamente antes de desistir.

* `--connect-retry-delay`

  <table frame="box" rules="all" summary="Properties for connect-retry-delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retry-delay=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>5</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>5</code></td> </tr></tbody></table>

Número de segundos para esperar entre as tentativas de contato com o servidor de gerenciamento.

* `--connect-string`

  <table frame="box" rules="all" summary="Properties for connect-string"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-string=connection_string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

O mesmo que `--ndb-connectstring`.

* `--core-file`

  <table frame="box" rules="all" summary="Properties for core-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--core-file</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>

Escreva o arquivo de núcleo em erro; usado em depuração.

* `--database`, `-d`

Especifica o nome do banco de dados em que a tabela desejada é encontrada. Se esta opção for dada, o nome de uma tabela deve seguir o nome do banco de dados.

Se esta opção não tiver sido especificada e não forem encontradas tabelas no banco de dados `TEST_DB`, o **ndb_show_tables** emite um aviso.

* `--defaults-extra-file`

  <table frame="box" rules="all" summary="Properties for defaults-extra-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-extra-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

Leia o arquivo fornecido após a leitura dos arquivos globais.

* `--defaults-file`

  <table frame="box" rules="all" summary="Properties for defaults-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

Leia as opções padrão a partir do arquivo fornecido apenas.

* `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Properties for defaults-group-suffix"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-group-suffix=string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

Leia também grupos com concatenação(grupo, sufixo).

* `--help`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

Exibir texto de ajuda e sair.

* `--login-path`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>0

Leia o caminho fornecido a partir do arquivo de login.

* `--loops`, `-l`

Especifica o número de vezes que a utilidade deve ser executada. Isso é 1 quando esta opção não é especificada, mas se você usar a opção, você deve fornecer um argumento inteiro para ela.

* `--ndb-connectstring`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>1

Defina a string de conexão para se conectar ao ndb_mgmd. Sintaxe: "[nodeid=id;][host=]hostname[:port]". Ocorre entradas em NDB_CONNECTSTRING e my.cnf.

* `--ndb-mgmd-host`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>2

O mesmo que `--ndb-connectstring`.

* `--ndb-nodeid`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>3

Defina o ID do nó para este nó, substituindo qualquer ID definida por `--ndb-connectstring`.

* `--ndb-optimized-node-selection`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>4

Ative as otimizações para a seleção de nós para transações. Ativado por padrão; use `--skip-ndb-optimized-node-selection` para desativá-lo.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>5

Não leia as opções padrão de qualquer arquivo de opção, exceto o arquivo de login.

* `--parsable`, `-p`

Usar essa opção faz com que a saída seja em um formato adequado para uso com `LOAD DATA`](load-data.html "15.2.9 LOAD DATA Statement").

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>6

Imprimir a lista de argumentos do programa e sair.

* `--show-temp-status`

Se especificado, isso faz com que as tabelas temporárias sejam exibidas.

* `--type`, `-t`

Pode ser usado para restringir a saída a um tipo de objeto, especificado por um código de tipo numérico, conforme mostrado aqui:

+ `1`: Tabela do sistema  
  + `2`: Tabela criada pelo usuário  
  + `3`: Índice de hash único

Qualquer outro valor faz com que todos os objetos do banco de dados `NDB` sejam listados (o padrão).

* `--unqualified`, `-u`

Se especificado, isso faz com que os nomes de objetos não qualificados sejam exibidos.

* `--usage`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>7

Exibir texto de ajuda e sair; o mesmo que `--help`.

* `--version`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>8

Exibir informações da versão e sair.

Nota

Somente as tabelas do NDB Cluster criadas pelo usuário podem ser acessadas pelo MySQL; as tabelas do sistema, como `SYSTAB_0`, não são visíveis para o **mysqld**. No entanto, você pode examinar o conteúdo das tabelas do sistema usando aplicativos da API `NDB`, como **ndb_select_all** (consulte Seção 25.5.25, “ndb_select_all — Imprimir linhas de uma tabela NDB”).

Antes da NDB 8.0.20, este programa imprimia `NDBT_ProgramExit - status` após a conclusão de sua execução, devido a uma dependência desnecessária da biblioteca de teste `NDBT`. Essa dependência foi removida, eliminando a saída desnecessária.

### 25.5.28 ndb_size.pl — Estimatore de Requisito de Tamanho NDBCLUSTER

Este é um script Perl que pode ser usado para estimar a quantidade de espaço que seria necessária para um banco de dados MySQL se fosse convertido para usar o mecanismo de armazenamento `NDBCLUSTER`. Ao contrário das outras ferramentas discutidas nesta seção, ele não requer acesso a um NDB Cluster (de fato, não há motivo para isso). No entanto, ele precisa acessar o servidor MySQL no qual o banco de dados a ser testado reside.

Nota

O **ndb_size.pl** é desatualizado e não é mais suportado no NDB 8.0.40 e versões posteriores. Você deve esperar que ele seja removido de uma versão futura da distribuição do NDB Cluster e modificar as aplicações dependentes conforme necessário.

#### Requisitos

* Um servidor MySQL em execução. A instância do servidor não precisa fornecer suporte para o NDB Cluster.

* Uma instalação funcional do Perl. * O módulo `DBI`, que pode ser obtido do CPAN, se ainda não faz parte da sua instalação do Perl. (Muitas distribuições de Linux e outras distribuições de sistemas operacionais fornecem seus próprios pacotes para esta biblioteca.)

* Uma conta de usuário do MySQL com os privilégios necessários. Se você não deseja usar uma conta existente, então criar uma usando `GRANT USAGE ON db_name.*`—onde *`db_name`* é o nome do banco de dados a ser examinado—é suficiente para esse propósito.

`ndb_size.pl` também pode ser encontrado nas fontes do MySQL em `storage/ndb/tools`.

As opções que podem ser usadas com **ndb_size.pl** estão mostradas na tabela a seguir. Descrições adicionais seguem a tabela.

**Tabela 25.49 Opções de linha de comando usadas com o programa ndb_size.pl**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th scope="col">Format</th> <th scope="col">Description</th> <th scope="col">Added, Deprecated, or Removed</th> </tr></thead><tbody><tr> <th scope="row"><p> <code class="option"> --database=string </code> </p></th> <td>Banco de dados ou bancos de dados a examinar; uma lista delimitada por vírgula; o padrão é TODOS (use todos os bancos de dados encontrados no servidor)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --hostname=string </code> </p></th> <td>Especifique o host e o port opcional no formato host[:port]</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --socket=path </code> </p></th> <td>Especifique a tomada para se conectar</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --user=string </code> </p></th> <td>Especifique o nome do usuário do MySQL</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --password=password </code> </p></th> <td>Especifique a senha do usuário do MySQL</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --format=string </code> </p></th> <td>Defina o formato de saída (texto ou HTML)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --excludetables=list </code> </p></th> <td>Pule qualquer tabela em lista separada por vírgula</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --excludedbs=list </code> </p></th> <td>Pule quaisquer bancos de dados em lista separada por vírgula</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --savequeries=path </code> </p></th> <td>Salva todas as consultas no banco de dados em um arquivo especificado</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --loadqueries=path </code> </p></th> <td>Carrega todas as consultas do arquivo especificado; não se conecta ao banco de dados</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --real_table_name=string </code> </p></th> <td>Designa a tabela para lidar com cálculos de tamanho de índice único</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody></table>

#### Uso

```
perl ndb_size.pl [--database={db_name|ALL}] [--hostname=host[:port]] [--socket=socket] \
      [--user=user] [--password=password]  \
      [--help|-h] [--format={html|text}] \
      [--loadqueries=file_name] [--savequeries=file_name]
```

Por padrão, este utilitário tenta analisar todos os bancos de dados no servidor. Você pode especificar um único banco de dados usando a opção `--database`; o comportamento padrão pode ser explicitado usando `ALL` para o nome do banco de dados. Você também pode excluir um ou mais bancos de dados usando a opção `--excludedbs` com uma lista de separação por vírgula dos nomes dos bancos de dados a serem ignorados. Da mesma forma, você pode fazer com que tabelas específicas sejam ignoradas, listando seus nomes, separados por vírgulas, seguindo a opção opcional `--excludetables`. Um nome de host pode ser especificado usando `--hostname`; o padrão é `localhost`. Você pode especificar uma porta além do host usando o formato *`host`:*`port`* para o valor de `--hostname`. O número de porta padrão é 3306. Se necessário, você também pode especificar um socket; o padrão é `/var/lib/mysql.sock`. Um nome de usuário e senha do MySQL podem ser especificados nas opções correspondentes mostradas. Também é possível controlar o formato da saída usando a opção `--format`; isso pode ter qualquer um dos valores `html` ou `text`, com `text` sendo o padrão. Um exemplo do texto de saída é mostrado aqui:

```
$> ndb_size.pl --database=test --socket=/tmp/mysql.sock
ndb_size.pl report for database: 'test' (1 tables)
--------------------------------------------------
Connected to: DBI:mysql:host=localhost;mysql_socket=/tmp/mysql.sock

Including information for versions: 4.1, 5.0, 5.1

test.t1
-------

DataMemory for Columns (* means varsized DataMemory):
         Column Name            Type  Varsized   Key  4.1  5.0   5.1
     HIDDEN_NDB_PKEY          bigint             PRI    8    8     8
                  c2     varchar(50)         Y         52   52    4*
                  c1         int(11)                    4    4     4
                                                       --   --    --
Fixed Size Columns DM/Row                              64   64    12
   Varsize Columns DM/Row                               0    0     4

DataMemory for Indexes:
   Index Name                 Type        4.1        5.0        5.1
      PRIMARY                BTREE         16         16         16
                                           --         --         --
       Total Index DM/Row                  16         16         16

IndexMemory for Indexes:
               Index Name        4.1        5.0        5.1
                  PRIMARY         33         16         16
                                  --         --         --
           Indexes IM/Row         33         16         16

Summary (for THIS table):
                                 4.1        5.0        5.1
    Fixed Overhead DM/Row         12         12         16
           NULL Bytes/Row          4          4          4
           DataMemory/Row         96         96         48
                    (Includes overhead, bitmap and indexes)

  Varsize Overhead DM/Row          0          0          8
   Varsize NULL Bytes/Row          0          0          4
       Avg Varside DM/Row          0          0         16

                 No. Rows          0          0          0

        Rows/32kb DM Page        340        340        680
Fixedsize DataMemory (KB)          0          0          0

Rows/32kb Varsize DM Page          0          0       2040
  Varsize DataMemory (KB)          0          0          0

         Rows/8kb IM Page        248        512        512
         IndexMemory (KB)          0          0          0

Parameter Minimum Requirements
------------------------------
* indicates greater than default

                Parameter     Default        4.1         5.0         5.1
          DataMemory (KB)       81920          0           0           0
       NoOfOrderedIndexes         128          1           1           1
               NoOfTables         128          1           1           1
         IndexMemory (KB)       18432          0           0           0
    NoOfUniqueHashIndexes          64          0           0           0
           NoOfAttributes        1000          3           3           3
             NoOfTriggers         768          5           5           5
```

Para fins de depuração, os arrays do Perl que contêm as consultas executadas por este script podem ser lidos a partir do arquivo especificado usando `--savequeries`; um arquivo contendo tais arrays que serão lidos durante a execução do script pode ser especificado usando `--loadqueries`. Nenhuma dessas opções tem um valor padrão.

Para produzir saída em formato HTML, use a opção `--format` e redireccione a saída para um arquivo, conforme mostrado aqui:

```
$> ndb_size.pl --database=test --socket=/tmp/mysql.sock --format=html > ndb_size.html
```

(Sem a redirecionamento, a saída é enviada para `stdout`.)

A saída deste script inclui as seguintes informações:

* Valores mínimos para os parâmetros de configuração `DataMemory`, `IndexMemory`, `MaxNoOfTables`, `MaxNoOfAttributes`, `MaxNoOfOrderedIndexes` e `MaxNoOfTriggers` necessários para acomodar as tabelas analisadas.

* Requisitos de memória para todas as tabelas, atributos, índices ordenados e índices hash únicos definidos no banco de dados.

* O `IndexMemory` e `DataMemory` são necessários por tabela e linha de tabela.

### 25.5.29 ndb_top — Ver informações de uso de CPU para os NDB threads

**ndb_top** exibe informações em execução no terminal sobre o uso da CPU por threads do NDB em um nó de dados de um NDB Cluster. Cada thread é representada por duas linhas no resultado, a primeira mostrando estatísticas do sistema e a segunda mostrando as estatísticas medidas para a thread.

O **ndb_top** está disponível a partir do MySQL NDB Cluster 7.6.3.

#### Uso

```
ndb_top [-h hostname] [-t port] [-u user] [-p pass] [-n node_id]
```

**ndb_top** se conecta a um servidor MySQL que está sendo executado como um nó SQL do clúster. Por padrão, ele tenta se conectar a um **mysqld** que está sendo executado no `localhost` e na porta 3306, como o usuário **ndb_top** do MySQL sem senha especificada. Você pode substituir o host e a porta padrão usando, respectivamente, `--host` (`-h`) e `--port` (`-t`). Para especificar um usuário e senha do MySQL, use as opções `--user` (`-u`) e `--passwd` (`-p`). Esse usuário deve ser capaz de ler tabelas no banco de dados `ndbinfo` (**ndb_top** usa informações do `ndbinfo.cpustat` e tabelas relacionadas).

Para mais informações sobre contas e senhas de usuários do MySQL, consulte a Seção 8.2, “Controle de acesso e gerenciamento de contas”.

A saída está disponível como texto simples ou um gráfico ASCII; você pode especificar isso usando as opções `--text` (`-x`) e `--graph` (`-g`), respectivamente. Esses dois modos de exibição fornecem as mesmas informações; eles podem ser usados simultaneamente. Pelo menos um modo de exibição deve estar em uso.

O display colorido do gráfico é suportado e ativado por padrão (opção `--color` ou `-c`). Com o suporte ao colorido ativado, o display do gráfico mostra o tempo do usuário do sistema em azul, o tempo do sistema do sistema em verde e o tempo de inatividade como em branco. Para a carga medida, o azul é usado para o tempo de execução, o amarelo para o tempo de envio, o vermelho para o tempo gasto em espera de buffer de envio cheio e espaços em branco para o tempo de inatividade. A porcentagem mostrada no display do gráfico é a soma das porcentagens para todos os threads que não estão inativos. As cores atualmente não são configuráveis; você pode usar escala de cinza em vez disso, usando `--skip-color`.

A visualização ordenada (`--sort`, `-r`) é baseada no máximo da carga medida e na carga relatada pelo sistema operacional. A exibição dessas cargas pode ser habilitada e desabilitada usando as opções `--measured-load` (`-m`) e `--os-load` (`-o`). A exibição de pelo menos uma dessas cargas deve ser habilitada.

O programa tenta obter estatísticas de um nó de dados que tenha o ID de nó fornecido pela opção `--node-id` (`-n`); se não especificado, este é 1. **ndb_top** não pode fornecer informações sobre outros tipos de nós.

A visualização se ajusta à altura e à largura da janela do terminal; a largura mínima suportada é de 76 caracteres.

Uma vez iniciado, o **ndb_top** funciona continuamente até ser forçado a sair; você pode encerrar o programa usando `Ctrl-C`. O display é atualizado uma vez por segundo; para definir um intervalo de atraso diferente, use `--sleep-time` (`-s`).

Nota

O **ndb_top** está disponível no macOS, Linux e Solaris. Atualmente, não é suportado em plataformas Windows.

A tabela a seguir inclui todas as opções específicas do programa NDB Cluster **ndb_top**. Descrições adicionais seguem a tabela.

**Tabela 25.50 Opções de linha de comando usadas com o programa ndb_top**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th scope="col">Format</th> <th scope="col">Description</th> <th scope="col">Added, Deprecated, or Removed</th> </tr></thead><tbody><tr> <th scope="row"><p> <code>--color</code>,</p><p> <code class="option"> -c </code> </p></th> <td>Mostrar gráficos ASCII coloridos; use --skip-colors para desabilitar</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --defaults-extra-file=path </code> </p></th> <td>Leia o arquivo fornecido após os arquivos globais terem sido lidos</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --defaults-file=path </code> </p></th> <td>Ler opções padrão a partir do arquivo fornecido apenas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --defaults-group-suffix=string </code> </p></th> <td>Leia também grupos com concat(grupo, sufixo)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--graph</code>,</p><p> <code class="option"> -g </code> </p></th> <td>Exibir dados usando gráficos; use --skip-graphs para desabilitar</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --help </code> </p></th> <td>Mostrar informações de uso do programa</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--host=string</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_host">-h string</a> </code> </p></th> <td>Nome do host ou endereço IP do servidor MySQL para se conectar</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --login-path=path </code> </p></th> <td>Leia o caminho fornecido a partir do arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--measured-load</code>,</p><p> <code class="option"> -m </code> </p></th> <td>Mostre carga medida por fio</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --no-defaults </code> </p></th> <td>Não leia as opções padrão de qualquer arquivo de opção, exceto o arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--node-id=#</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_node-id">- n #</a> </code> </p></th> <td>Nodo de observação com este ID de nó</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--os-load</code>,</p><p> <code class="option"> -o </code> </p></th> <td>Mostrar carga medida pelo sistema operacional</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--password=password</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_password">-p senha</a> </code> </p></th> <td>Conecte-se usando esta senha</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--port=#</code>,</p><p> <code class="option"><a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_port">-P #</a></code> (&gt;=7.6.6) </p></th> <td>Número do porto a ser usado ao se conectar ao servidor MySQL</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --print-defaults </code> </p></th> <td>Imprimir a lista de argumentos do programa e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--sleep-time=#</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_sleep-time">-s #</a> </code> </p></th> <td>Tempo de espera entre os refrescos da tela, em segundos</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--socket=path</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_socket">-S path</a> </code> </p></th> <td>Arquivo de soquete a ser usado para a conexão</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--sort</code>,</p><p> <code class="option"> -r </code> </p></th> <td>Classifique os tópicos por uso; use --skip-sort para desabilitar</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--text</code>,</p><p> <code>-t</code> (&gt;=7.6.6) </p></th> <td>Exibir dados usando texto</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --usage </code> </p></th> <td>Mostrar informações de uso do programa; o mesmo que --help</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--user=name</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_user">-u nome</a> </code> </p></th> <td>Conecte-se como este usuário MySQL</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody></table>

#### Opções Adicionais

* `--color`, `-c`

  <table frame="box" rules="all" summary="Properties for color"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--color</code></td> </tr></tbody></table>

Mostrar gráficos ASCII coloridos; use `--skip-colors` para desativá-los.

* `--defaults-extra-file`

  <table frame="box" rules="all" summary="Properties for defaults-extra-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-extra-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

Leia o arquivo fornecido após a leitura dos arquivos globais.

* `--defaults-file`

  <table frame="box" rules="all" summary="Properties for defaults-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

Leia as opções padrão a partir do arquivo fornecido apenas.

* `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Properties for defaults-group-suffix"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-group-suffix=string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

Leia também grupos com concatenação(grupo, sufixo).

* `--graph`, `-g`

  <table frame="box" rules="all" summary="Properties for graph"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--graph</code></td> </tr></tbody></table>

Exibir dados usando gráficos; use `--skip-graphs` para desabilitar. Esta opção ou `--text` deve ser verdadeira; ambas as opções podem ser verdadeiras.

* `--help`, `-?`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

Mostrar informações de uso do programa.

* `--host`=*`name]`*, `-h`

  <table frame="box" rules="all" summary="Properties for host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--host=string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>localhost</code></td> </tr></tbody></table>

Nome do host ou endereço IP do servidor MySQL para se conectar.

* `--login-path`

  <table frame="box" rules="all" summary="Properties for login-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--login-path=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

Leia o caminho fornecido a partir do arquivo de login.

* `--measured-load`, `-m`

  <table frame="box" rules="all" summary="Properties for measured-load"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--measured-load</code></td> </tr></tbody></table>

Mostrar carga medida por fio. Esta opção ou `--os-load` deve ser verdadeira; ambas as opções podem ser verdadeiras.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for color"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--color</code></td> </tr></tbody></table>0

Não leia as opções padrão de qualquer arquivo de opção, exceto o arquivo de login.

* `--node-id`=*`#]`*, `-n`

  <table frame="box" rules="all" summary="Properties for color"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--color</code></td> </tr></tbody></table>1

Assista ao nó de dados que tem esse ID de nó.

* `--os-load`, `-o`

  <table frame="box" rules="all" summary="Properties for color"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--color</code></td> </tr></tbody></table>2

Mostrar carga medida pelo sistema operacional. Esta opção ou `--measured-load` deve ser verdadeira; ambas as opções podem ser verdadeiras.

* `--password`=*`password]`*, `-p`

  <table frame="box" rules="all" summary="Properties for color"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--color</code></td> </tr></tbody></table>3

Conecte-se a um servidor MySQL usando esta senha e o usuário MySQL especificado por `--user`.

Essa senha está associada apenas a uma conta de usuário do MySQL e não está relacionada de nenhuma maneira à senha usada com os backups criptografados do `NDB`.

* `--port`=*`#]`*, `-P`

  <table frame="box" rules="all" summary="Properties for color"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--color</code></td> </tr></tbody></table>4

Número do porto a ser usado ao se conectar ao servidor MySQL.

(Anteriormente, a forma abreviada para essa opção era `-t`, que foi revertida como a forma abreviada de `--text`.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for color"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--color</code></td> </tr></tbody></table>5

Imprimir a lista de argumentos do programa e sair.

* `--sleep-time`=*`seconds]`*, `-s`

  <table frame="box" rules="all" summary="Properties for color"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--color</code></td> </tr></tbody></table>6

Tempo de espera entre os refrescos da tela, em segundos.

* `--socket=path/to/file`, `-S`

  <table frame="box" rules="all" summary="Properties for color"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--color</code></td> </tr></tbody></table>7

Use o arquivo de soquete especificado para a conexão.

* `--sort`, `-r`

  <table frame="box" rules="all" summary="Properties for color"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--color</code></td> </tr></tbody></table>8

Classifique os tópicos por uso; use `--skip-sort` para desativá-los.

* `--text`, `-t`

  <table frame="box" rules="all" summary="Properties for color"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--color</code></td> </tr></tbody></table>9

Exibir dados usando texto. Esta opção ou `--graph` deve ser verdadeira; ambas as opções podem ser verdadeiras.

(A forma abreviada para essa opção era `-x` nas versões anteriores do NDB Cluster, mas isso não é mais suportado.)

* `--usage`

  <table frame="box" rules="all" summary="Properties for defaults-extra-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-extra-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>0

Exibir texto de ajuda e sair; o mesmo que `--help`.

* `--user`=*`name]`*, `-u`

  <table frame="box" rules="all" summary="Properties for defaults-extra-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-extra-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>1

Conecte-se como este usuário MySQL. Normalmente requer uma senha fornecida pela opção `--password`.

**Saída de exemplo.** A figura a seguir mostra o **ndb_top** em execução em uma janela de terminal em um sistema Linux com um nó de dados **ndbmtd**") sob uma carga moderada. Aqui, o programa foi invocado usando **ndb_top** `-n8` `-x` para fornecer saída de texto e gráfico:

**Figura 25.5 ndb_top Executando no Terminal**

![Display from ndb_top, running in a terminal window. Shows information for each node, including the utilized resources.](images/ndb-top-1.png)

A partir do NDB 8.0.20, o **ndb_top** também exibe os tempos de rotação dos threads, exibidos em verde.

### 25.5.30 ndb_waiter — Aguarde o NDB Cluster atingir um determinado status

O **ndb_waiter** imprime repetidamente (a cada 100 milissegundos) o status de todos os nós de dados do cluster até que o cluster atinja um determinado status ou o limite `--timeout` seja excedido, e então sai. Por padrão, ele espera que o cluster atinja o status `STARTED`, no qual todos os nós tenham começado e se conectado ao cluster. Isso pode ser sobreposto usando as opções `--no-contact` e `--not-started`.

Os estados dos nós reportados por este utilitário são os seguintes:

* `NO_CONTACT`: O nó não pode ser contatado.
* `UNKNOWN`: O nó pode ser contatado, mas seu status ainda não é conhecido. Geralmente, isso significa que o nó recebeu um comando `START` ou `RESTART` do servidor de gerenciamento, mas ainda não agiu sobre ele.

* `NOT_STARTED`: O nó parou, mas permanece em contato com o clúster. Isso é visto quando o nó é reiniciado usando o comando `RESTART` do cliente de gerenciamento.

* `STARTING`: O processo do **ndbd** do nó começou, mas o nó ainda não se juntou ao clúster.

* `STARTED`: O nó está operacional e se juntou ao clúster.

* `SHUTTING_DOWN`: O nó está sendo desligado.
* `SINGLE USER MODE`: Isso é mostrado para todos os nós de dados do clúster quando o clúster está no modo de usuário único.

As opções que podem ser usadas com **ndb_waiter** estão mostradas na tabela a seguir. Descrições adicionais seguem a tabela.

**Tabela 25.51 Opções de linha de comando usadas com o programa ndb_waiter**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th scope="col">Format</th> <th scope="col">Description</th> <th scope="col">Added, Deprecated, or Removed</th> </tr></thead><tbody><tr> <th scope="row"><p> <code class="option"> --character-sets-dir=path </code> </p></th> <td>Directory containing character sets</td> <td><p> REMOVED: 8.0.31 </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --connect-retries=# </code> </p></th> <td>Número de vezes para tentar a conexão novamente antes de desistir</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --connect-retry-delay=# </code> </p></th> <td>Número de segundos para esperar entre as tentativas de contato com o servidor de gerenciamento</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--connect-string=connection_string</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-waiter.html#option_ndb_waiter_connect-string">-c connection_string</a> </code> </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --core-file </code> </p></th> <td>Escreva o arquivo de núcleo em erro; usado em depuração</td> <td><p>REMOvido: 8.0.31</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --defaults-extra-file=path </code> </p></th> <td>Leia o arquivo fornecido após os arquivos globais terem sido lidos</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --defaults-file=path </code> </p></th> <td>Ler opções padrão a partir do arquivo fornecido apenas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --defaults-group-suffix=string </code> </p></th> <td>Leia também grupos com concat(grupo, sufixo)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--help</code>,</p><p> <code class="option"> -? </code> </p></th> <td>Exibir texto de ajuda e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --login-path=path </code> </p></th> <td>Leia o caminho fornecido a partir do arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--ndb-connectstring=connection_string</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-waiter.html#option_ndb_waiter_ndb-connectstring">-c connection_string</a> </code> </p></th> <td>Defina a string de conexão para se conectar ao ndb_mgmd. Sintaxe: "[nodeid=id;][host=]hostname[:port]". Supere as entradas em NDB_CONNECTSTRING e my.cnf</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--ndb-mgmd-host=connection_string</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-waiter.html#option_ndb_waiter_ndb-mgmd-host">-c connection_string</a> </code> </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --ndb-nodeid=# </code> </p></th> <td>Defina o ID do nó para este nó, substituindo qualquer ID definida pela opção --ndb-connectstring</td> <td><p>REMOvido: 8.0.31</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --ndb-optimized-node-selection </code> </p></th> <td>Ative as otimizações para a seleção de nós para transações. Ativado por padrão; use --skip-ndb-optimized-node-selection para desativá-lo</td> <td><p>REMOvido: 8.0.31</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--no-contact</code>,</p><p> <code class="option"> -n </code> </p></th> <td>Aguarde até que o clúster atinja o estado de NULO CONTATO</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --no-defaults </code> </p></th> <td>Não leia as opções padrão de qualquer arquivo de opção, exceto o arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --not-started </code> </p></th> <td>Aguarde o cluster atingir o estado NÃO INICIADO</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --nowait-nodes=list </code> </p></th> <td>Lista de nós que não devem ser esperados</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --print-defaults </code> </p></th> <td>Imprimir a lista de argumentos do programa e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --single-user </code> </p></th> <td>Aguarde o cluster entrar no modo de usuário único</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--timeout=#</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-waiter.html#option_ndb_waiter_timeout">-t #</a> </code> </p></th> <td>Aguarde esses segundos, e então saia, independentemente de o cluster ter alcançado o estado desejado ou</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--usage</code>,</p><p> <code class="option"> -? </code> </p></th> <td>Exibir texto de ajuda e sair; o mesmo que --help</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--verbose=#</code>,</p><p> <code class="option"> -v </code> </p></th> <td>Defina o nível de verbosidade de saída; veja o texto para os valores de entrada e retorno</td> <td><p>ADICIONADO: 8.0.37</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--version</code>,</p><p> <code class="option"> -V </code> </p></th> <td>Exibir informações da versão e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--wait-nodes=list</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-waiter.html#option_ndb_waiter_wait-nodes">-w lista</a> </code> </p></th> <td>Lista de nós a serem esperados</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody></table>

#### Uso

```
ndb_waiter [-c connection_string]
```

#### Opções Adicionais

* `--character-sets-dir`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>

Diretório contendo conjuntos de caracteres.

* `--connect-retries`

  <table frame="box" rules="all" summary="Properties for connect-retries"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>12</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>12</code></td> </tr></tbody></table>

Número de vezes para tentar a conexão novamente antes de desistir.

* `--connect-retry-delay`

  <table frame="box" rules="all" summary="Properties for connect-retry-delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retry-delay=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>5</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>5</code></td> </tr></tbody></table>

Número de segundos para esperar entre as tentativas de contato com o servidor de gerenciamento.

* `--connect-string`

  <table frame="box" rules="all" summary="Properties for connect-string"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-string=connection_string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

O mesmo que `--ndb-connectstring`.

* `--core-file`

  <table frame="box" rules="all" summary="Properties for core-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--core-file</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>

Escreva o arquivo de núcleo em erro; usado em depuração.

* `--defaults-extra-file`

  <table frame="box" rules="all" summary="Properties for defaults-extra-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-extra-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

Leia o arquivo fornecido após a leitura dos arquivos globais.

* `--defaults-file`

  <table frame="box" rules="all" summary="Properties for defaults-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

Leia as opções padrão a partir do arquivo fornecido apenas.

* `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Properties for defaults-group-suffix"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-group-suffix=string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

Leia também grupos com concatenação(grupo, sufixo).

* `--login-path`

  <table frame="box" rules="all" summary="Properties for login-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--login-path=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

Leia o caminho fornecido a partir do arquivo de login.

* `--help`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>0

Exibir texto de ajuda e sair.

* `--ndb-connectstring`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>1

Defina a string de conexão para se conectar ao ndb_mgmd. Sintaxe: "[nodeid=id;][host=]hostname[:port]". Ocorre entradas em NDB_CONNECTSTRING e my.cnf.

* `--ndb-mgmd-host`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>2

O mesmo que --`ndb-connectstring`.

* `--ndb-nodeid`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>3

Defina o ID do nó para este nó, substituindo qualquer ID definida por `--ndb-connectstring`.

* `--ndb-optimized-node-selection`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>4

Ative as otimizações para a seleção de nós para transações. Ativado por padrão; use `--skip-ndb-optimized-node-selection` para desativá-lo.

* `--no-contact`, `-n`

Em vez de esperar pelo estado `STARTED`, o **ndb_waiter** continua em execução até que o clúster atinja o estado `NO_CONTACT` antes de sair.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>5

Não leia as opções padrão de qualquer arquivo de opção, exceto o arquivo de login.

* `--not-started`

Em vez de esperar pelo estado `STARTED`, o **ndb_waiter** continua em execução até que o clúster atinja o estado `NOT_STARTED` antes de sair.

* `--nowait-nodes=list`

Quando esta opção é usada, o **ndb_waiter** não aguarda os nós cujos IDs estão listados. A lista é delimitada por vírgulas; os intervalos podem ser indicados por traços, como mostrado aqui:

  ```
  $> ndb_waiter --nowait-nodes=1,3,7-9
  ```

Importante

Não use esta opção em conjunto com a opção `--wait-nodes`.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>6

Imprimir a lista de argumentos do programa e sair.

* `--timeout=seconds`, `-t seconds`

É hora de esperar. O programa sai se o estado desejado não for alcançado dentro deste número de segundos. O padrão é 120 segundos (1200 ciclos de relatório).

* `--single-user`

O programa aguarda que o clúster entre no modo de usuário único.

* `--usage`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>7

Exibir texto de ajuda e sair; o mesmo que `--help`.

* `--verbose`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>8

Controles do nível de verbosidade da impressão. Os níveis possíveis e seus efeitos estão listados aqui:

+ `0`: Não imprima (retorne apenas o código de saída; veja o que segue para códigos de saída).

+ `1`: Imprimir apenas o status final da conexão.

+ `2`: Imprimir o status a cada vez que é verificado.

Esse é o mesmo comportamento das versões do NDB Cluster anteriores à 8.4.

Os códigos de saída retornados pelo **ndb_waiter** estão listados aqui, com seus significados:

+ `0`: Sucesso.  
  + `1`: O tempo de espera expirou.  
  + `2`: Erro no parâmetro, como um ID de nó inválido.

+ `3`: Não conseguiu se conectar ao servidor de gerenciamento.

* `--version`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>9

Exibir informações da versão e sair.

* `--wait-nodes=list`, `-w list`

Quando esta opção é usada, o **ndb_waiter** aguarda apenas pelos nós cujos IDs estão listados. A lista é delimitada por vírgulas; os intervalos podem ser indicados por traços, como mostrado aqui:

  ```
  $> ndb_waiter --wait-nodes=2,4-6,10
  ```

Importante

Não use esta opção em conjunto com a opção `--nowait-nodes`.

**Saída de exemplo.** Mostrada aqui é a saída do **ndb_waiter** quando executado em um clúster de 4 nós, nos quais dois nós foram desligados e depois reiniciados manualmente. Relatórios duplicados (indicados por `...`) são omitidos.

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

Se nenhuma string de conexão for especificada, o **ndb_waiter** tenta se conectar a uma gestão em `localhost`, e reporta `Connecting to mgmsrv at (null)`.

Antes da NDB 8.0.20, este programa imprimia `NDBT_ProgramExit - status` após a conclusão de sua execução, devido a uma dependência desnecessária da biblioteca de teste `NDBT`. Essa dependência foi removida, eliminando a saída desnecessária.

### 25.5.31 ndbxfrm — Compressar, descomprimir, criptografar e descriptografar arquivos criados pelo NDB Cluster

O utilitário **ndbxfrm**, introduzido no NDB 8.0.22, pode ser usado para descomprimir, descriptografar e exibir informações sobre arquivos criados pelo NDB Cluster que estão comprimidos, criptografados ou ambos. Também pode ser usado para comprimir ou criptografar arquivos.

**Tabela 25.52 Opções de linha de comando usadas com o programa ndbxfrm**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th scope="col">Format</th> <th scope="col">Description</th> <th scope="col">Added, Deprecated, or Removed</th> </tr></thead><tbody><tr> <th scope="row"><p> <code>--compress</code>,</p><p> <code class="option"> -c </code> </p></th> <td>Compressar o arquivo</td> <td><p>ADICIONADO: NDB 8.0.22</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --decrypt-key=key </code> </p></th> <td>Forneça a chave de descriptografia do arquivo</td> <td><p>ADICIONADO: NDB 8.0.31</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --decrypt-key-from-stdin </code> </p></th> <td>Forneça a chave de descriptografia do arquivo a partir do stdin</td> <td><p>ADICIONADO: NDB 8.0.31</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --decrypt-password=password </code> </p></th> <td>Use esta senha para descriptografar o arquivo</td> <td><p>ADICIONADO: NDB 8.0.22</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --decrypt-password-from-stdin </code> </p></th> <td>Obtenha a senha de descriptografia de forma segura a partir de STDIN</td> <td><p>ADICIONADO: NDB 8.0.24</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --defaults-extra-file=path </code> </p></th> <td>Leia o arquivo fornecido após os arquivos globais terem sido lidos</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --defaults-group-suffix=string </code> </p></th> <td>Leia também grupos com concat(grupo, sufixo)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --defaults-file=path </code> </p></th> <td>Ler opções padrão a partir do arquivo fornecido apenas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --encrypt-block-size=# </code> </p></th> <td>Imprimir informações sobre o arquivo, incluindo o cabeçalho e o trailer do arquivo</td> <td><p>ADICIONADO: NDB 8.0.31</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --encrypt-block-size=# </code> </p></th> <td>Tamanho dos blocos de dados de entrada criptografados como uma unidade. Usado com XTS, definido como zero para o modo CBC</td> <td><p>ADICIONADO: NDB 8.0.29</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --encrypt-cipher=# </code> </p></th> <td>Cifra de criptografia: 1 para CBC, 2 para XTS</td> <td><p>ADICIONADO: NDB 8.0.29</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--encrypt-kdf-iter-count=#</code>,</p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndbxfrm.html#option_ndbxfrm_encrypt-kdf-iter-count">-k #</a> </code> </p></th> <td>Número de iterações utilizadas na definição da chave</td> <td><p>ADICIONADO: NDB 8.0.22</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --encrypt-key=key </code> </p></th> <td>Use esta chave para criptografar o arquivo</td> <td><p>ADICIONADO: NDB 8.0.31</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --encrypt-key-from-stdin </code> </p></th> <td>Use a chave fornecida pelo stdin para criptografar o arquivo</td> <td><p>ADICIONADO: NDB 8.0.31</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --encrypt-password=password </code> </p></th> <td>Use esta senha para criptografar o arquivo</td> <td><p>ADICIONADO: NDB 8.0.22</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --encrypt-password-from-stdin </code> </p></th> <td>Obtenha a senha de criptografia de forma segura a partir de STDIN</td> <td><p>ADICIONADO: NDB 8.0.24</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--help</code>,</p><p> <code class="option"> -? </code> </p></th> <td>Informações sobre o uso da impressão</td> <td><p>ADICIONADO: NDB 8.0.22</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--info</code>,</p><p> <code class="option"> -i </code> </p></th> <td>Imprimir informações do arquivo</td> <td><p>ADICIONADO: NDB 8.0.22</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --login-path=path </code> </p></th> <td>Leia o caminho fornecido a partir do arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --no-defaults </code> </p></th> <td>Não leia as opções padrão de qualquer arquivo de opção, exceto o arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --print-defaults </code> </p></th> <td>Imprimir a lista de argumentos do programa e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--usage</code>,</p><p> <code class="option"> -? </code> </p></th> <td>Imprime informações de uso; sinônimo de --help</td> <td><p>ADICIONADO: NDB 8.0.22</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--version</code>,</p><p> <code class="option"> -V </code> </p></th> <td>Informações sobre a versão de saída</td> <td><p>ADICIONADO: NDB 8.0.22</p></td> </tr></tbody></table>

#### Uso

```
ndbxfrm --info file[ file ...]

ndbxfrm --compress input_file output_file

ndbxfrm --decrypt-password=password input_file output_file

ndbxfrm [--encrypt-ldf-iter-count=#] --encrypt-password=password input_file output_file
```

*`input_file`* e *`output_file`* não podem ser o mesmo arquivo.

#### Opções

* `--compress`, `-c`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress</code></td> </tr><tr><th>Introduced</th> <td>8.0.22-ndb-8.0.22</td> </tr></tbody></table>

Compreende o arquivo de entrada, usando o mesmo método de compressão que é usado para comprometer backups do NDB Cluster, e escreve a saída em um arquivo de saída. Para descomprimir um arquivo de backup `NDB` comprimido que não está criptografado, é necessário apenas invocar **ndbxfrm** usando os nomes do arquivo comprimido e um arquivo de saída (sem opções necessárias).

* `--decrypt-key=key`, `-K` *`key`*

  <table frame="box" rules="all" summary="Properties for decrypt-key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--decrypt-key=key</code></td> </tr><tr><th>Introduced</th> <td>8.0.31-ndb-8.0.31</td> </tr></tbody></table>

Descodifica um arquivo criptografado por `NDB` usando a chave fornecida.

Nota

Esta opção não pode ser usada em conjunto com `--decrypt-password`.

* `--decrypt-key-from-stdin`

  <table frame="box" rules="all" summary="Properties for decrypt-key-from-stdin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--decrypt-key-from-stdin</code></td> </tr><tr><th>Introduced</th> <td>8.0.31-ndb-8.0.31</td> </tr></tbody></table>

Descodifica um arquivo criptografado por `NDB` usando a chave fornecida por `stdin`.

* `--decrypt-password=password`

  <table frame="box" rules="all" summary="Properties for decrypt-password"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--decrypt-password=password</code></td> </tr><tr><th>Introduced</th> <td>8.0.22-ndb-8.0.22</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

Descodifica um arquivo criptografado por `NDB` usando a senha fornecida.

Nota

Esta opção não pode ser usada em conjunto com `--decrypt-key`.

* `--decrypt-password-from-stdin[=TRUE|FALSE]`

  <table frame="box" rules="all" summary="Properties for decrypt-password-from-stdin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--decrypt-password-from-stdin</code></td> </tr><tr><th>Introduced</th> <td>8.0.24-ndb-8.0.24</td> </tr></tbody></table>

Descodifica um arquivo criptografado por `NDB`, usando uma senha fornecida pelo padrão de entrada. Isso é semelhante a inserir uma senha após invocar **mysql** `--password` sem senha após a opção.

* `--defaults-extra-file`

  <table frame="box" rules="all" summary="Properties for defaults-extra-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-extra-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

Leia o arquivo fornecido após a leitura dos arquivos globais.

* `--defaults-file`

  <table frame="box" rules="all" summary="Properties for defaults-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

Leia as opções padrão a partir do arquivo fornecido apenas.

* `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Properties for defaults-group-suffix"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-group-suffix=string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

Leia também grupos com `CONCAT(group, suffix)`.

* `--detailed-info`

  <table frame="box" rules="all" summary="Properties for detailed-info"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--encrypt-block-size=#</code></td> </tr><tr><th>Introduced</th> <td>8.0.31-ndb-8.0.31</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

Imprima as informações do arquivo, como `--info`, mas inclua o cabeçalho e o trailer do arquivo.

Exemplo:

  ```
  $> ndbxfrm --detailed-info S0.sysfile
  File=/var/lib/cluster-data/ndb_7_fs/D1/NDBCNTR/S0.sysfile, compression=no, encryption=yes
  header: {
    fixed_header: {
      magic: {
        magic: { 78, 68, 66, 88, 70, 82, 77, 49 },
        endian: 18364758544493064720,
        header_size: 32768,
        fixed_header_size: 160,
        zeros: { 0, 0 }
      },
      flags: 73728,
      flag_extended: 0,
      flag_zeros: 0,
      flag_file_checksum: 0,
      flag_data_checksum: 0,
      flag_compress: 0,
      flag_compress_method: 0,
      flag_compress_padding: 0,
      flag_encrypt: 18,
      flag_encrypt_cipher: 2,
      flag_encrypt_krm: 1,
      flag_encrypt_padding: 0,
      flag_encrypt_key_selection_mode: 0,
      dbg_writer_ndb_version: 524320,
      octets_size: 32,
      file_block_size: 32768,
      trailer_max_size: 80,
      file_checksum: { 0, 0, 0, 0 },
      data_checksum: { 0, 0, 0, 0 },
      zeros01: { 0 },
      compress_dbg_writer_header_version: { ... },
      compress_dbg_writer_library_version: { ... },
      encrypt_dbg_writer_header_version: { ... },
      encrypt_dbg_writer_library_version: { ... },
      encrypt_key_definition_iterator_count: 100000,
      encrypt_krm_keying_material_size: 32,
      encrypt_krm_keying_material_count: 1,
      encrypt_key_data_unit_size: 32768,
      encrypt_krm_keying_material_position_in_octets: 0,
    },
    octets: {
       102, 68, 56, 125, 78, 217, 110, 94, 145, 121, 203, 234, 26, 164, 137, 180,
       100, 224, 7, 88, 173, 123, 209, 110, 185, 227, 85, 174, 109, 123, 96, 156,
    }
  }
  trailer: {
    fixed_trailer: {
      flags: 48,
      flag_extended: 0,
      flag_zeros: 0,
      flag_file_checksum: 0,
      flag_data_checksum: 3,
      data_size: 512,
      file_checksum: { 0, 0, 0, 0 },
      data_checksum: { 226, 223, 102, 207 },
      magic: {
        zeros: { 0, 0 }
        fixed_trailer_size: 56,
        trailer_size: 32256,
        endian: 18364758544493064720,
        magic: { 78, 68, 66, 88, 70, 82, 77, 49 },
      },
    }
  }
  ```

* `--encrypt-block-size=#`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress</code></td> </tr><tr><th>Introduced</th> <td>8.0.22-ndb-8.0.22</td> </tr></tbody></table>0

Tamanho dos blocos de dados de entrada que são criptografados como uma unidade. Utilizado com XTS; definido para `0` (o padrão) para o modo CBC.

* `--encrypt-cipher=#`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress</code></td> </tr><tr><th>Introduced</th> <td>8.0.22-ndb-8.0.22</td> </tr></tbody></table>1

Cifra usada para criptografia. Definida em `1` para o modo CBC (padrão), ou `2` para XTS.

* `--encrypt-kdf-iter-count=#`, `-k #`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress</code></td> </tr><tr><th>Introduced</th> <td>8.0.22-ndb-8.0.22</td> </tr></tbody></table>2

Ao criptografar um arquivo, especifique o número de iterações a serem usadas para a chave de criptografia. Requer a opção `--encrypt-password`.

* `--encrypt-key=key`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress</code></td> </tr><tr><th>Introduced</th> <td>8.0.22-ndb-8.0.22</td> </tr></tbody></table>3

Encripta um arquivo usando a chave fornecida.

Nota

Esta opção não pode ser usada em conjunto com `--encrypt-password`.

* `--encrypt-key-from-stdin`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress</code></td> </tr><tr><th>Introduced</th> <td>8.0.22-ndb-8.0.22</td> </tr></tbody></table>4

Criptografar um arquivo usando a chave fornecida a partir de `stdin`.

* `--encrypt-password=password`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress</code></td> </tr><tr><th>Introduced</th> <td>8.0.22-ndb-8.0.22</td> </tr></tbody></table>5

Encripta o arquivo de backup usando a senha fornecida pela opção. A senha deve atender aos requisitos listados aqui:

+ Usa qualquer um dos caracteres ASCII imprimíveis, exceto `!`, `'`, `"`, `$`, `%`, `\`, `` ` ``, and `^`

+ Tem no máximo 256 caracteres de comprimento  
+ Está encerrado entre aspas simples ou duplas

Nota

Esta opção não pode ser usada em conjunto com `--encrypt-key`.

* `--encrypt-password-from-stdin[=TRUE|FALSE]`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress</code></td> </tr><tr><th>Introduced</th> <td>8.0.22-ndb-8.0.22</td> </tr></tbody></table>6

Encripta um arquivo usando uma senha fornecida pelo padrão de entrada. Isso é semelhante a digitar uma senha que é inserida após invocar o **mysql** `--password` sem senha após a opção.

* `--help`, `-?`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress</code></td> </tr><tr><th>Introduced</th> <td>8.0.22-ndb-8.0.22</td> </tr></tbody></table>7

Informações de uso dos impressos para o programa.

* `--info`, `-i`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress</code></td> </tr><tr><th>Introduced</th> <td>8.0.22-ndb-8.0.22</td> </tr></tbody></table>8

Imprime as seguintes informações sobre um ou mais arquivos de entrada:

+ O nome do arquivo
  + Se o arquivo está comprimido (`compression=yes` ou `compression=no`)

+ Se o arquivo está criptografado (`encryption=yes` ou `encryption=no`)

Exemplo:

  ```
  $> ndbxfrm -i BACKUP-10-0.5.Data BACKUP-10.5.ctl BACKUP-10.5.log
  File=BACKUP-10-0.5.Data, compression=no, encryption=yes
  File=BACKUP-10.5.ctl, compression=no, encryption=yes
  File=BACKUP-10.5.log, compression=no, encryption=yes
  ```

A partir do NDB 8.0.31, você também pode ver o cabeçalho e o trailer do arquivo usando a opção `--detailed-info`.

* `--login-path`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress</code></td> </tr><tr><th>Introduced</th> <td>8.0.22-ndb-8.0.22</td> </tr></tbody></table>9

Leia o caminho fornecido a partir do arquivo de login.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for decrypt-key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--decrypt-key=key</code></td> </tr><tr><th>Introduced</th> <td>8.0.31-ndb-8.0.31</td> </tr></tbody></table>0

Não leia as opções padrão de qualquer arquivo de opção, exceto o arquivo de login.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for decrypt-key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--decrypt-key=key</code></td> </tr><tr><th>Introduced</th> <td>8.0.31-ndb-8.0.31</td> </tr></tbody></table>1

Imprimir a lista de argumentos do programa e sair.

* `--usage`, `-?`

  <table frame="box" rules="all" summary="Properties for decrypt-key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--decrypt-key=key</code></td> </tr><tr><th>Introduced</th> <td>8.0.31-ndb-8.0.31</td> </tr></tbody></table>2

Sinônimo de `--help`.

* `--version`, `-V`

  <table frame="box" rules="all" summary="Properties for decrypt-key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--decrypt-key=key</code></td> </tr><tr><th>Introduced</th> <td>8.0.31-ndb-8.0.31</td> </tr></tbody></table>3

Imprime informações sobre a versão.

O **ndbxfrm** pode criptografar backups criados por qualquer versão do NDB Cluster. Os arquivos `.Data`, `.ctl` e `.log` que compõem o backup devem ser criptografados separadamente, e esses arquivos devem ser criptografados separadamente para cada nó de dados. Uma vez criptografados, tais backups só podem ser descriptografados pelo **ndbxfrm**, **ndb_restore** ou **ndb_print_backup** do NDB Cluster 8.0.22 ou posterior.

Um arquivo criptografado pode ser re-criptografado com uma nova senha usando as opções `--encrypt-password` e `--decrypt-password` juntas, como este:

```
ndbxfrm --decrypt-password=old --encrypt-password=new input_file output_file
```

No exemplo que acabou de ser mostrado, *`old`* e *`new`* são as senhas antigas e novas, respectivamente; ambas devem ser citadas. O arquivo de entrada é descriptografado e, em seguida, criptografado como o arquivo de saída. O próprio arquivo de entrada não é alterado; se você não quiser que ele seja acessível usando a senha antiga, deve remover o arquivo de entrada manualmente.