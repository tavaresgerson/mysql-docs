### 21.5.1 ndbd — O daemon do nó de dados do clúster NDB

O binário **ndbd** fornece a versão de fluxo único do processo que é usada para lidar com todos os dados nas tabelas que utilizam o mecanismo de armazenamento `NDBCLUSTER`. Esse processo de nó de dados permite que um nó de dados realize o gerenciamento de transações distribuídas, recuperação de nós, checkpointing em disco, backup online e tarefas relacionadas. No NDB 7.6.31 e versões posteriores, quando iniciado, o **ndbd** registra um aviso semelhante ao mostrado aqui:

```sql
2024-05-28 13:32:16 [ndbd] WARNING  -- Running ndbd with a single thread of
signal execution.  For multi-threaded signal execution run the ndbmtd binary.
```

**ndbmtd** é a versão multi-threaded deste binário.

Em um NDB Cluster, um conjunto de processos **ndbd** coopera na manipulação de dados. Esses processos podem ser executados no mesmo computador (host) ou em computadores diferentes. As correspondências entre nós de dados e hosts do Cluster são completamente configuráveis.

As opções que podem ser usadas com **ndbd** estão mostradas na tabela a seguir. Descrições adicionais seguem a tabela.

**Tabela 21.22 Opções de linha de comando usadas com o programa ndbd**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th>Formato</th> <th>Descrição</th> <th>Adicionado, Descontinuado ou Removido</th> </tr></thead><tbody><tr> <th><p> [[PH_HTML_CODE_<code> --defaults-extra-file=path </code>] </p></th> <td>Endereço de ligação local</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> [[PH_HTML_CODE_<code> --defaults-extra-file=path </code>] </p></th> <td>Diretório contendo conjuntos de caracteres</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> [[PH_HTML_CODE_<code> --defaults-group-suffix=string </code>] </p></th> <td>Sinônimo obsoleto para --connect-retry-delay, que deve ser usado em vez desta opção</td> <td><p>REMOÇÃO: NDB 7.5.25, NDB 7.6.21</p></td> </tr></tbody><tbody><tr> <th><p> [[PH_HTML_CODE_<code> --foreground </code>] </p></th> <td>Defina o número de vezes para tentar novamente uma conexão antes de desistir; 0 significa apenas uma tentativa (e nenhuma tentativa subsequente); -1 significa continuar tentando indefinidamente</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> [[PH_HTML_CODE_<code>--help</code>] </p></th> <td>Tempo de espera entre as tentativas de contato com um servidor de gerenciamento, em segundos; 0 significa não esperar entre as tentativas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p>[[PH_HTML_CODE_<code> -? </code>],</p><p> [[PH_HTML_CODE_<code> --initial </code>] </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> [[PH_HTML_CODE_<code> --initial-start </code>] </p></th> <td>Escreva o arquivo de núcleo em erro; usado no depuração</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p>[[PH_HTML_CODE_<code> --install[=nam<code> <a class="link" href="mysql-cluster-programs-ndbd.html#option_ndbd_logbuffer-size">--logbuffer-size=# </code></a> </code>],</p><p> [[PH_HTML_CODE_<code> --logbuffer-size=# </code>] </p></th> <td>Inicie o ndbd como daemon (padrão); substitua com --nodaemon</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --defaults-extra-file=path </code>]] </p></th> <td>Leia o arquivo fornecido após os arquivos globais terem sido lidos</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --character-sets-dir=path </code><code> --defaults-extra-file=path </code>] </p></th> <td>Ler opções padrão a partir do arquivo fornecido apenas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --defaults-group-suffix=string </code>]] </p></th> <td>Leia também grupos com concatenação(grupo, sufixo)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --foreground </code>]] </p></th> <td>Execute o ndbd em primeiro plano, para fins de depuração (implica em --nodaemon)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code>--help</code>]],</p><p> [[<code> -? </code>]] </p></th> <td>Exibir texto de ajuda e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --initial </code>]] </p></th> <td>Realize o início inicial do ndbd, incluindo a limpeza do sistema de arquivos; consulte a documentação antes de usar essa opção</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --initial-start </code>]] </p></th> <td>Realize o início inicial parcial (requer --nowait-nodes)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --install[=nam<code> <a class="link" href="mysql-cluster-programs-ndbd.html#option_ndbd_logbuffer-size">--logbuffer-size=# </code></a> </code>]] </p></th> <td>Usado para instalar o processo do nó de dados como serviço do Windows; não se aplica em outras plataformas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --logbuffer-size=# </code>]] </p></th> <td>Controle o tamanho do buffer de log; use quando estiver depurando com muitas mensagens de log sendo geradas; o padrão é suficiente para operações normais</td> <td><p>ADICIONADO: NDB 7.6.6</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --connect-delay=# </code><code> --defaults-extra-file=path </code>] </p></th> <td>Leia o caminho fornecido a partir do arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code> --connect-delay=# </code><code> --defaults-extra-file=path </code>],</p><p> [[<code> --connect-delay=# </code><code> --defaults-group-suffix=string </code>] </p></th> <td>Defina a string de conexão para se conectar ao ndb_mgmd. Sintaxe: "[nodeid=id;][host=]hostname[:por<code> --defaults-extra-file=path </code>". Substitui as entradas no NDB_CONNECTSTRING e no my.cnf</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code> --connect-delay=# </code><code> --foreground </code>],</p><p> [[<code> --connect-delay=# </code><code>--help</code>] </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --connect-delay=# </code><code> -? </code>] </p></th> <td>Defina o ID do nó para este nó, substituindo qualquer ID definida pela opção --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --connect-delay=# </code><code> --initial </code>] </p></th> <td>Não inicie o ndbd como daemon; fornecido para fins de teste</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --connect-delay=# </code><code> --initial-start </code>] </p></th> <td>Não leia as opções padrão de nenhum arquivo de opção, exceto o arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code> --connect-delay=# </code><code> --install[=nam<code> <a class="link" href="mysql-cluster-programs-ndbd.html#option_ndbd_logbuffer-size">--logbuffer-size=# </code></a> </code>],</p><p> [[<code> --connect-delay=# </code><code> --logbuffer-size=# </code>] </p></th> <td>Não inicie o ndbd imediatamente; o ndbd aguarda o comando para ser iniciado a partir do ndb_mgm</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --connect-retries=# </code><code> --defaults-extra-file=path </code>] </p></th> <td>Não espere que esses nós de dados comecem (requer uma lista separada por vírgula dos IDs dos nós); requer --ndb-nodeid</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --connect-retries=# </code><code> --defaults-extra-file=path </code>] </p></th> <td>Ative as otimizações para a seleção de nós para transações. Ativado por padrão; use --skip-ndb-optimized-node-selection para desativá-lo</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --connect-retries=# </code><code> --defaults-group-suffix=string </code>] </p></th> <td>Imprimir a lista de argumentos do programa e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --connect-retries=# </code><code> --foreground </code>] </p></th> <td>Usado para remover o processo do nó de dados que foi instalado anteriormente como serviço do Windows; não se aplica em outras plataformas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code> --connect-retries=# </code><code>--help</code>],</p><p> [[<code> --connect-retries=# </code><code> -? </code>] </p></th> <td>Exibir texto de ajuda e sair; o mesmo que --help</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code> --connect-retries=# </code><code> --initial </code>],</p><p> [[<code> --connect-retries=# </code><code> --initial-start </code>] </p></th> <td>Escreva informações de depuração adicionais no log do nó</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code> --connect-retries=# </code><code> --install[=nam<code> <a class="link" href="mysql-cluster-programs-ndbd.html#option_ndbd_logbuffer-size">--logbuffer-size=# </code></a> </code>],</p><p> [[<code> --connect-retries=# </code><code> --logbuffer-size=# </code>] </p></th> <td>Exibir informações da versão e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody></table>

Nota

Todas essas opções também se aplicam à versão multithread deste programa (**ndbmtd**) e você pode substituir “**ndbmtd**” por “**ndbd**” sempre que este último ocorrer nesta seção.

- `--bind-address`

  <table frame="box" rules="all" summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=name</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code></code>]]</td> </tr></tbody></table>

  Faz com que **ndbd** se ligue a uma interface de rede específica (nome de host ou endereço IP). Esta opção não tem um valor padrão.

- `--character-sets-dir`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr></tbody></table>

  Diretório contendo conjuntos de caracteres.

- `--connect-delay=#`

  <table frame="box" rules="all" summary="Propriedades para delay de conexão"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--connect-delay=#</code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim (removido em 5.7.36-ndb-7.6.21)</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td>[[<code>5</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>3600</code>]]</td> </tr></tbody></table>

  Determina o tempo de espera entre as tentativas de contato com um servidor de gerenciamento ao iniciar (o número de tentativas é controlado pela opção `--connect-retries`). O valor padrão é de 5 segundos.

  Esta opção está desatualizada e está sujeita à remoção em uma futura versão do NDB Cluster. Use `--connect-retry-delay` em vez disso.

- `--connect-retries=#`

  <table frame="box" rules="all" summary="Propriedades para tentativas de conexão de reposição"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--connect-retries=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td>[[<code>12</code>]]</td> </tr><tr><th>Valor mínimo (≥ 5.7.36-ndb-7.6.21)</th> <td>[[<code>-1</code>]]</td> </tr><tr><th>Valor mínimo (≥ 5.7.36-ndb-7.5.25)</th> <td>[[<code>-1</code>]]</td> </tr><tr><th>Valor mínimo (≤ 5.7.36-ndb-7.5.24)</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo (≤ 5.7.36-ndb-7.6.20)</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>

  Defina o número de vezes para tentar uma conexão novamente antes de desistir; 0 significa apenas uma tentativa (e nenhuma tentativa adicional). O padrão é 12 tentativas. O tempo de espera entre as tentativas é controlado pela opção `--connect-retry-delay`.

  A partir do NDB 7.5.25 e do NDB 7.6.21, você pode definir essa opção para -1, caso em que o processo do nó de dados continua indefinidamente tentando se conectar.

- `--connect-retry-delay=#`

  <table frame="box" rules="all" summary="Propriedades para connect-retry-delay"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--connect-retry-delay=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td>[[<code>5</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>4294967295</code>]]</td> </tr></tbody></table>

  Determina o tempo de espera entre as tentativas de contato com um servidor de gerenciamento ao iniciar (o tempo entre as tentativas é controlado pela opção `--connect-retries`). O valor padrão é de 5 segundos.

  Esta opção substitui a opção `--connect-delay`, que já está desatualizada e está sujeita à remoção em uma futura versão do NDB Cluster.

  A forma abreviada `-r` para essa opção foi descontinuada a partir da NDB 7.5.25 e NDB 7.6.21 e está sujeita à remoção em uma futura versão do NDB Cluster. Use a forma longa em vez disso.

- `--connect-string`

  <table frame="box" rules="all" summary="Propriedades para a string de conexão"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--connect-string=connection_string</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>

  O mesmo que `--ndb-connectstring`.

- `--core-file`

  <table frame="box" rules="all" summary="Propriedades para arquivo de núcleo"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--core-file</code>]]</td> </tr></tbody></table>

  Escreva o arquivo de núcleo em erro; usado no depuração.

- `--daemon`, `-d`

  <table frame="box" rules="all" summary="Propriedades para daemon"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon</code>]]</td> </tr></tbody></table>

  Instrua o **ndbd** ou o **ndbmtd** a executar como um processo de daemon. Esse é o comportamento padrão. A opção `--nodaemon` (mysql-cluster-programs-ndbd.html#option_ndbd_nodaemon) pode ser usada para impedir que o processo seja executado como um daemon.

  Esta opção não tem efeito quando você executa **ndbd** ou **ndbmtd** em plataformas Windows.

- `--defaults-extra-file`

  <table frame="box" rules="all" summary="Propriedades para defaults-extra-file"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--defaults-extra-file=path</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>

  Leia o arquivo fornecido após a leitura dos arquivos globais.

- `--defaults-file`

  <table frame="box" rules="all" summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=name</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code></code>]]</td> </tr></tbody></table>

  Leia as opções padrão do arquivo fornecido.

- `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=name</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code></code>]]</td> </tr></tbody></table>

  Leia também grupos com concatenação (grupo, sufixo).

- `--foreground`

  <table frame="box" rules="all" summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=name</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code></code>]]</td> </tr></tbody></table>

  Faça com que **ndbd** ou **ndbmtd** sejam executados como um processo em primeiro plano, principalmente para fins de depuração. Esta opção implica na opção `--nodaemon`.

  Esta opção não tem efeito quando você executa **ndbd** ou **ndbmtd** em plataformas Windows.

- `--help`

  <table frame="box" rules="all" summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=name</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code></code>]]</td> </tr></tbody></table>

  Exibir texto de ajuda e sair.

- `--initial`

  <table frame="box" rules="all" summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=name</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code></code>]]</td> </tr></tbody></table>

  Instrui o **ndbd** a realizar um início inicial. Um início inicial apaga quaisquer arquivos criados para fins de recuperação por instâncias anteriores do **ndbd**. Também recria os arquivos de log de recuperação. Em alguns sistemas operacionais, esse processo pode levar um tempo substancial.

  Um início `--initial` deve ser usado *apenas* quando iniciar o processo **ndbd** em circunstâncias muito especiais; isso ocorre porque essa opção faz com que todos os arquivos sejam removidos do sistema de arquivos do NDB Cluster e todos os arquivos de log de refazer sejam recriados. Essas circunstâncias estão listadas aqui:

  - Ao realizar uma atualização de software que alterou o conteúdo de quaisquer arquivos.

  - Ao reiniciar o nó com uma nova versão de **ndbd**.

  - Como medida de último recurso quando, por algum motivo, o reinício do nó ou do sistema falha repetidamente. Nesse caso, esteja ciente de que esse nó não pode mais ser usado para restaurar dados devido à destruição dos arquivos de dados.

  Aviso

  Para evitar a possibilidade de perda de dados eventual, recomenda-se que você *não* use a opção `--initial` junto com `StopOnError = 0`. Em vez disso, defina `StopOnError` para 0 em `config.ini` apenas após o clúster ter sido iniciado, e então reinicie os nós de dados normalmente — ou seja, sem a opção `--initial`. Consulte a descrição do parâmetro `[StopOnError]` (mysql-cluster-ndbd-definition.html#ndbparam-ndb-stoponerror) para uma explicação detalhada sobre esse problema. (Bug
  \#24945638)

  O uso desta opção impede que os parâmetros de configuração `StartPartialTimeout` e `StartPartitionedTimeout` tenham qualquer efeito.

  Importante

  Esta opção *não* afeta nenhum dos seguintes tipos de arquivos:

  - Arquivos de backup que já foram criados pelo nó afetado

  - Arquivos de dados do disco do NDB Cluster (consulte Seção 21.6.11, “Tabelas de dados do disco do NDB Cluster”).

  Essa opção também não afeta a recuperação de dados por um nó de dados que está apenas começando (ou reiniciando) a partir de nós de dados que já estão em execução. Essa recuperação de dados ocorre automaticamente e não requer intervenção do usuário em um NDB Cluster que está funcionando normalmente.

  É permitido usar essa opção ao iniciar o clúster pela primeira vez (ou seja, antes que quaisquer arquivos de nó de dados tenham sido criados); no entanto, não é *necessário* fazer isso.

- `--initial-start`

  <table frame="box" rules="all" summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=name</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code></code>]]</td> </tr></tbody></table>

  Esta opção é usada ao realizar um início inicial parcial do clúster. Cada nó deve ser iniciado com esta opção, bem como com `--nowait-nodes`.

  Suponha que você tenha um clúster de 4 nós, cujos nós de dados têm os IDs 2, 3, 4 e 5, e que você queira realizar um início inicial parcial usando apenas os nós 2, 4 e 5 — ou seja, omitindo o nó 3:

  ```sql
  $> ndbd --ndb-nodeid=2 --nowait-nodes=3 --initial-start
  $> ndbd --ndb-nodeid=4 --nowait-nodes=3 --initial-start
  $> ndbd --ndb-nodeid=5 --nowait-nodes=3 --initial-start
  ```

  Ao usar essa opção, você também deve especificar o ID do nó para o nó de dados que está sendo iniciado com a opção `--ndb-nodeid` (mysql-cluster-programs-ndbd.html#option_ndbd_ndb-nodeid).

  Importante

  Não confunda essa opção com a opção `--nowait-nodes` para **ndb_mgmd**, que pode ser usada para permitir que um clúster configurado com múltiplos servidores de gerenciamento seja iniciado sem que todos os servidores de gerenciamento estejam online.

- `--install[=nome]`

  <table frame="box" rules="all" summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=name</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code></code>]]</td> </tr></tbody></table>

  Faça com que o **ndbd** seja instalado como um serviço do Windows. Opcionalmente, você pode especificar um nome para o serviço; se não for definido, o nome do serviço será `ndbd`. Embora seja preferível especificar outras opções do programa **ndbd** em um arquivo de configuração `my.ini` ou `my.cnf`, é possível usá-lo junto com `--install`. No entanto, nesse caso, a opção `--install` deve ser especificada primeiro, antes de quaisquer outras opções, para que a instalação do serviço do Windows seja bem-sucedida.

  Geralmente, não é aconselhável usar essa opção junto com a opção `--initial`, pois isso faz com que o sistema de arquivos do nó de dados seja apagado e reconstruído toda vez que o serviço é parado e reiniciado. Também é necessário tomar extremo cuidado se você pretende usar qualquer uma das outras opções de **ndbd** que afetam o início dos nós de dados — incluindo `--initial-start`, `--nostart` e `--nowait-nodes` — junto com `--install`, e você deve ter certeza absoluta de que entende completamente e permite quaisquer possíveis consequências de fazer isso.

  A opção `--install` não tem efeito em plataformas que não são do Windows.

- `--logbuffer-size=#`

  <table frame="box" rules="all" summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=name</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code></code>]]</td> </tr></tbody></table>

  Define o tamanho do buffer de log do nó de dados. Ao depurar com grandes quantidades de registros extras, é possível que o buffer de log fique sem espaço se houver muitas mensagens de log, o que pode resultar na perda de algumas mensagens de log. Isso não deve ocorrer durante operações normais.

- `--login-path`

  <table frame="box" rules="all" summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=name</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code></code>]]</td> </tr></tbody></table>

  Leia o caminho fornecido a partir do arquivo de login.

- `--ndb-connectstring`

  <table frame="box" rules="all" summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=name</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code></code>]]</td> </tr></tbody></table>

  Defina a string de conexão para se conectar ao ndb_mgmd. Sintaxe: "[nodeid=id;][host=]hostname[:port]". Oculte entradas no NDB_CONNECTSTRING e no my.cnf.

- `--ndb-mgmd-host`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr></tbody></table>

  O mesmo que `--ndb-connectstring`.

- `--ndb-nodeid`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr></tbody></table>

  Defina o ID do nó para este nó, substituindo qualquer ID definida por `--ndb-connectstring`.

- `--ndb-optimized-node-selection`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr></tbody></table>

  Ative as otimizações para a seleção de nós para transações. Ativado por padrão; use `--skip-ndb-optimized-node-selection` para desativá-lo.

- `--nodaemon`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr></tbody></table>

  impede que **ndbd** ou **ndbmtd** sejam executados como um processo de daemon. Esta opção substitui a opção `--daemon`. Isso é útil para redirecionar a saída para a tela durante a depuração do binário.

  O comportamento padrão para **ndbd** e **ndbmtd** no Windows é executar em primeiro plano, tornando essa opção desnecessária nas plataformas Windows, onde ela não tem efeito.

- `--no-defaults`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr></tbody></table>

  Não leia as opções padrão de nenhum arquivo de opção, exceto o arquivo de login.

- `--nostart`, `-n`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr></tbody></table>

  Instrua o **ndbd** a não iniciar automaticamente. Quando essa opção é usada, o **ndbd** se conecta ao servidor de gerenciamento, obtém dados de configuração dele e inicializa objetos de comunicação. No entanto, ele não inicia efetivamente o motor de execução até que seja especificamente solicitado a fazer isso pelo servidor de gerenciamento. Isso pode ser feito emitindo o comando apropriado `START` no cliente de gerenciamento (veja Seção 21.6.1, “Comandos no Cliente de Gerenciamento do NDB Cluster”).

- `--nowait-nodes=node_id_1[, node_id_2[, ...]]`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr></tbody></table>

  Esta opção recebe uma lista de nós de dados para os quais o cluster não espera antes de começar.

  Isso pode ser usado para iniciar o clúster em um estado particionado. Por exemplo, para iniciar o clúster com apenas metade dos nós de dados (nós 2, 3, 4 e 5) rodando em um clúster de 4 nós, você pode iniciar cada processo **ndbd** com `--nowait-nodes=3,5`. Neste caso, o clúster começa assim que os nós 2 e 4 se conectam e *não* aguarda [`StartPartitionedTimeout`]\(mysql-cluster-ndbd-definition.html#ndbparam-ndbd-startpartitionedtimeout] milissegundos para os nós 3 e 5 se conectarem como faria de outra forma.

  Se você quisesse iniciar o mesmo clúster do exemplo anterior sem um **ndbd** (digamos, por exemplo, que a máquina hospedeira do nó 3 sofreu uma falha de hardware), então inicie os nós 2, 4 e 5 com `--nowait-nodes=3`. Então o clúster começa assim que os nós 2, 4 e 5 se conectam e não espera que o nó 3 seja iniciado.

- `--print-defaults`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr></tbody></table>

  Imprima a lista de argumentos do programa e saia.

- `--remove[=nome]`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr></tbody></table>

  Faz com que o processo **ndbd** que foi instalado anteriormente como um serviço do Windows seja removido. Opcionalmente, você pode especificar um nome para o serviço que será desinstalado; se não for definido, o nome do serviço será `ndbd` por padrão.

  A opção `--remove` não tem efeito em plataformas que não são do Windows.

- `--usage`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr></tbody></table>

  Exibir texto de ajuda e sair; o mesmo que `--help`.

- `--verbose`, `-v`

  Faz com que a saída de depuração extra seja escrita no log do nó.

  No NDB 7.6, você também pode usar `NODELOG DEBUG ON` e `NODELOG DEBUG OFF` para habilitar e desabilitar esse registro extra enquanto o nó de dados estiver em execução.

- `--version`

  <table frame="box" rules="all" summary="Propriedades para delay de conexão"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--connect-delay=#</code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim (removido em 5.7.36-ndb-7.6.21)</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td>[[<code>5</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>3600</code>]]</td> </tr></tbody></table>

  Exibir informações da versão e sair.

**ndbd** gera um conjunto de arquivos de log que são colocados no diretório especificado por `DataDir` no arquivo de configuração `config.ini`.

Esses arquivos de registro estão listados abaixo. *`node_id`* é o identificador único do nó. Por exemplo, `ndb_2_error.log` é o log de erros gerado pelo nó de dados cujo ID de nó é `2`.

- `ndb_node_id_error.log` é um arquivo que contém registros de todos os travamentos que o processo **ndbd** referenciado encontrou. Cada registro neste arquivo contém uma breve string de erro e uma referência a um arquivo de registro para esse travamento. Uma entrada típica neste arquivo pode aparecer como mostrado aqui:

  ```sql
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

  As listagens dos possíveis códigos de saída e mensagens de erro **ndbd** gerados quando um processo de nó de dados é desligado prematuramente podem ser encontradas em Mensagens de Erro do Nó de Dados.

  Importante

  *A última entrada no arquivo de log de erros não é necessariamente a mais recente* (e também não é provável que seja). As entradas no log de erros não estão listadas em ordem cronológica; elas correspondem ao arquivo de arquivos de registro conforme determinado no arquivo `ndb_node_id_trace.log.next` (veja abaixo). As entradas do log de erros são, portanto, sobrescritas de forma cíclica e não sequencial.

- `ndb_node_id_trace.log.trace_id` é um arquivo de registro que descreve exatamente o que aconteceu logo antes do erro ocorrer. Essas informações são úteis para análise pela equipe de desenvolvimento do NDB Cluster.

  É possível configurar o número desses arquivos de registro que são criados antes que os arquivos antigos sejam sobrescritos. *`trace_id`* é um número que é incrementado para cada arquivo de registro subsequente.

- `ndb_node_id_trace.log.next` é o arquivo que mantém o controle do próximo número de arquivo de rastreamento a ser atribuído.

- `ndb_node_id_out.log` é um arquivo que contém quaisquer dados emitidos pelo processo **ndbd**. Esse arquivo é criado apenas se o **ndbd** for iniciado como um daemon, que é o comportamento padrão.

- `ndb_node_id.pid` é um arquivo que contém o ID do processo do **ndbd** quando iniciado como um daemon. Ele também funciona como um arquivo de bloqueio para evitar o início de nós com o mesmo identificador.

- `ndb_node_id_signal.log` é um arquivo usado apenas em versões de depuração do **ndbd**, onde é possível rastrear todas as mensagens de entrada, saída e internas com seus dados no processo **ndbd**.

Recomenda-se não usar um diretório montado através do NFS, pois, em alguns ambientes, isso pode causar problemas, onde o bloqueio do arquivo `.pid` permanece em vigor mesmo após o processo ter sido encerrado.

Para iniciar o **ndbd**, também pode ser necessário especificar o nome do host do servidor de gerenciamento e a porta na qual ele está ouvindo. Opcionalmente, também é possível especificar o ID do nó que o processo deve usar.

```sql
$> ndbd --connect-string="nodeid=2;host=ndb_mgmd.mysql.com:1186"
```

Consulte Seção 21.4.3.3, "Cadeias de Conexão do NDB Cluster" para obter informações adicionais sobre esse problema. Para mais informações sobre os parâmetros de configuração dos nós de dados, consulte Seção 21.4.3.6, "Definindo Nodos de Dados do NDB Cluster".

Quando o **ndbd** é iniciado, ele realmente inicia dois processos. O primeiro deles é chamado de "processo anjo"; seu único trabalho é descobrir quando o processo de execução foi concluído e, em seguida, reiniciar o processo **ndbd** se estiver configurado para isso. Assim, se você tentar matar **ndbd** usando o comando Unix **kill**, é necessário matar ambos os processos, começando com o processo anjo. O método preferido de término de um processo **ndbd** é usar o cliente de gerenciamento e parar o processo a partir daí.

O processo de execução utiliza um único fio para leitura, escrita e varredura de dados, bem como para todas as outras atividades. Esse fio é implementado de forma assíncrona para que possa lidar facilmente com milhares de ações concorrentes. Além disso, um fio de guarda-costas supervisiona o fio de execução para garantir que ele não fique preso em um loop infinito. Um conjunto de fios lida com o E/S de arquivos, com cada fio capaz de lidar com um arquivo aberto. Os fios também podem ser usados para conexões de transportador pelos transportadores no processo **ndbd**. Em um sistema multi-processador que realiza um grande número de operações (incluindo atualizações), o processo **ndbd** pode consumir até 2 CPUs, se permitido.

Para uma máquina com muitas CPUs, é possível usar vários processos **ndbd** que pertencem a diferentes grupos de nós; no entanto, essa configuração ainda é considerada experimental e não é suportada para o MySQL 5.7 em um ambiente de produção. Veja Seção 21.2.7, “Limitações Conhecidas do NDB Cluster”.
