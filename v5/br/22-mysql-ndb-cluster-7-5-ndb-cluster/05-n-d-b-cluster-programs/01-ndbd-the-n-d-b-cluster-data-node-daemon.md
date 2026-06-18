### 21.5.1 ndbd — O Daemon do Node de Dados (Data Node) do NDB Cluster

O binário [**ndbd**] fornece a versão single-threaded do Process que é usada para lidar com todos os dados em Tables que utilizam o Storage Engine `NDBCLUSTER`. Este Process do Data Node permite que um Data Node realize manipulação de Transações distribuídas, recuperação de Node, Checkpointing para disco, Online Backup e tarefas relacionadas. No NDB 7.6.31 e posterior, ao ser iniciado, [**ndbd**] registra um Warning semelhante ao mostrado aqui:

```sql
2024-05-28 13:32:16 [ndbd] WARNING  -- Running ndbd with a single thread of
signal execution.  For multi-threaded signal execution run the ndbmtd binary.
```

[**ndbmtd**] é a versão multi-threaded deste binário.

Em um NDB Cluster, um conjunto de Processes [**ndbd**] coopera no manuseio dos dados. Esses Processes podem ser executados no mesmo computador (host) ou em computadores diferentes. A correspondência entre Data Nodes e Hosts do Cluster é totalmente configurável.

As Options que podem ser usadas com [**ndbd**] são mostradas na tabela a seguir. Descrições adicionais seguem a tabela.

**Table 21.22 Options de Linha de Comando usadas com o programa ndbd**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th>Formato</th> <th>Descrição</th> <th>Adicionado, Obsoleto (Deprecated) ou Removido</th> </tr></thead><tbody><tr> <th><p> <code> --bind-address=name </code> </p></th> <td>Endereço de bind local</td> <td><p> (Suportado em todos os releases NDB baseados em MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --character-sets-dir=path </code> </p></th> <td>Diretório contendo character sets</td> <td><p> (Suportado em todos os releases NDB baseados em MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --connect-delay=# </code> </p></th> <td>Sinônimo obsoleto para --connect-retry-delay, que deve ser usado em vez desta Option</td> <td><p> REMOVIDO: NDB 7.5.25, NDB 7.6.21 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --connect-retries=# </code> </p></th> <td>Define o número de vezes para tentar novamente uma Connection antes de desistir; 0 significa apenas 1 tentativa (e sem retries); -1 significa continuar tentando indefinidamente</td> <td><p> (Suportado em todos os releases NDB baseados em MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --connect-retry-delay=# </code> </p></th> <td>Tempo de espera entre as tentativas de contato com um management server, em segundos; 0 significa não esperar entre as tentativas</td> <td><p> (Suportado em todos os releases NDB baseados em MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--connect-string=connection_string</code>, </p><p> <code> -c connection_string </code> </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p> (Suportado em todos os releases NDB baseados em MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --core-file </code> </p></th> <td>Grava Core File em caso de erro; usado em Debugging</td> <td><p> (Suportado em todos os releases NDB baseados em MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--daemon</code>, </p><p> <code> -d </code> </p></th> <td>Inicia ndbd como Daemon (padrão); substitua com --nodaemon</td> <td><p> (Suportado em todos os releases NDB baseados em MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --defaults-extra-file=path </code> </p></th> <td>Lê o arquivo fornecido após a leitura dos arquivos globais</td> <td><p> (Suportado em todos os releases NDB baseados em MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --defaults-file=path </code> </p></th> <td>Lê as Options padrão apenas do arquivo fornecido</td> <td><p> (Suportado em todos os releases NDB baseados em MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --defaults-group-suffix=string </code> </p></th> <td>Também lê Groups com concat(group, suffix)</td> <td><p> (Suportado em todos os releases NDB baseados em MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --foreground </code> </p></th> <td>Executa ndbd em Foreground, fornecido para fins de Debugging (implica --nodaemon)</td> <td><p> (Suportado em todos os releases NDB baseados em MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--help</code>, </p><p> <code> -? </code> </p></th> <td>Exibe o texto de ajuda e sai</td> <td><p> (Suportado em todos os releases NDB baseados em MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --initial </code> </p></th> <td>Realiza o Start inicial de ndbd, incluindo a limpeza do File System; consulte a documentação antes de usar esta Option</td> <td><p> (Suportado em todos os releases NDB baseados em MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --initial-start </code> </p></th> <td>Realiza Start inicial parcial (requer --nowait-nodes)</td> <td><p> (Suportado em todos os releases NDB baseados em MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --install[=name] </code> </p></th> <td>Usado para instalar o Process do Data Node como um Windows Service; não se aplica a outras plataformas</td> <td><p> (Suportado em todos os releases NDB baseados em MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --logbuffer-size=# </code> </p></th> <td>Controla o tamanho do Log Buffer; para uso durante Debugging com muitas Log Messages sendo geradas; o padrão é suficiente para operações normais</td> <td><p> ADICIONADO: NDB 7.6.6 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --login-path=path </code> </p></th> <td>Lê o Path fornecido a partir do Login File</td> <td><p> (Suportado em todos os releases NDB baseados em MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--ndb-connectstring=connection_string</code>, </p><p> <code> -c connection_string </code> </p></th> <td>Define a Connect String para conexão com ndb_mgmd. Sintaxe: "[nodeid=id;][host=]hostname[:port]". Sobrescreve entradas em NDB_CONNECTSTRING e my.cnf</td> <td><p> (Suportado em todos os releases NDB baseados em MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--ndb-mgmd-host=connection_string</code>, </p><p> <code> -c connection_string </code> </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p> (Suportado em todos os releases NDB baseados em MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --ndb-nodeid=# </code> </p></th> <td>Define o Node ID para este Node, sobrescrevendo qualquer ID definido por --ndb-connectstring</td> <td><p> (Suportado em todos os releases NDB baseados em MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --nodaemon </code> </p></th> <td>Não inicia ndbd como Daemon; fornecido para fins de testes</td> <td><p> (Suportado em todos os releases NDB baseados em MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --no-defaults </code> </p></th> <td>Não lê Options padrão de nenhum arquivo de Option além do Login File</td> <td><p> (Suportado em todos os releases NDB baseados em MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--nostart</code>, </p><p> <code> -n </code> </p></th> <td>Não inicia ndbd imediatamente; ndbd aguarda o comando para iniciar de ndb_mgm</td> <td><p> (Suportado em todos os releases NDB baseados em MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --nowait-nodes=list </code> </p></th> <td>Não espera por estes Data Nodes para iniciar (aceita lista de Node IDs separada por vírgulas); requer --ndb-nodeid</td> <td><p> (Suportado em todos os releases NDB baseados em MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --ndb-optimized-node-selection </code> </p></th> <td>Habilita otimizações para seleção de Nodes para Transactions. Habilitado por padrão; use --skip-ndb-optimized-node-selection para desabilitar</td> <td><p> (Suportado em todos os releases NDB baseados em MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --print-defaults </code> </p></th> <td>Imprime a lista de argumentos do programa e sai</td> <td><p> (Suportado em todos os releases NDB baseados em MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --remove[=name] </code> </p></th> <td>Usado para remover o Process do Data Node que foi previamente instalado como um Windows Service; não se aplica a outras plataformas</td> <td><p> (Suportado em todos os releases NDB baseados em MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--usage</code>, </p><p> <code> -? </code> </p></th> <td>Exibe o texto de ajuda e sai; o mesmo que --help</td> <td><p> (Suportado em todos os releases NDB baseados em MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--verbose</code>, </p><p> <code> -v </code> </p></th> <td>Grava informações extras de Debugging no Node Log</td> <td><p> (Suportado em todos os releases NDB baseados em MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--version</code>, </p><p> <code> -V </code> </p></th> <td>Exibe informações de Version e sai</td> <td><p> (Suportado em todos os releases NDB baseados em MySQL 5.7) </p></td> </tr></tbody></table>

Nota

Todas estas Options também se aplicam à versão multithreaded deste programa ([**ndbmtd**]) e você pode substituir "[**ndbmtd**]" por "[**ndbd**]" onde quer que o último ocorra nesta seção.

* `--bind-address`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--bind-address=name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code></code></td> </tr></tbody></table>

  Causa [**ndbd**] a realizar bind em uma interface de rede específica (Host Name ou IP address). Esta Option não possui valor Default.

* `--character-sets-dir`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Diretório contendo Character Sets.

* `--connect-delay=#`

  <table frame="box" rules="all" summary="Propriedades para connect-delay"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--connect-delay=#</code></td> </tr><tr><th>Obsoleto (Deprecated)</th> <td>Sim (removido em 5.7.36-ndb-7.6.21)</td> </tr><tr><th>Tipo</th> <td>Numeric</td> </tr><tr><th>Valor Padrão</th> <td><code>5</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>3600</code></td> </tr></tbody></table>

  Determina o tempo de espera entre as tentativas de contato com um management server ao iniciar (o número de tentativas é controlado pela Option [`--connect-retries`]). O Default é 5 segundos.

  Esta Option está Deprecated e sujeita a remoção em um Future Release do NDB Cluster. Use [`--connect-retry-delay`] em vez disso.

* `--connect-retries=#`

  <table frame="box" rules="all" summary="Propriedades para connect-retries"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Tipo</th> <td>Numeric</td> </tr><tr><th>Valor Padrão</th> <td><code>12</code></td> </tr><tr><th>Valor Mínimo (≥ 5.7.36-ndb-7.6.21)</th> <td><code>-1</code></td> </tr><tr><th>Valor Mínimo (≥ 5.7.36-ndb-7.5.25)</th> <td><code>-1</code></td> </tr><tr><th>Valor Mínimo (≤ 5.7.36-ndb-7.5.24)</th> <td><code>0</code></td> </tr><tr><th>Valor Mínimo (≤ 5.7.36-ndb-7.6.20)</th> <td><code>0</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>65535</code></td> </tr></tbody></table>

  Define o número de vezes para tentar novamente uma Connection antes de desistir; 0 significa apenas 1 tentativa (e sem retries). O Default é 12 tentativas. O tempo de espera entre as tentativas é controlado pela Option [`--connect-retry-delay`].

  A partir do NDB 7.5.25 e NDB 7.6.21, você pode definir esta Option para -1, caso em que o Process do Data Node continua indefinidamente a tentar se conectar.

* `--connect-retry-delay=#`

  <table frame="box" rules="all" summary="Propriedades para connect-retry-delay"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--connect-retry-delay=#</code></td> </tr><tr><th>Tipo</th> <td>Numeric</td> </tr><tr><th>Valor Padrão</th> <td><code>5</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Determina o tempo de espera entre as tentativas de contato com um management server ao iniciar (o tempo entre as tentativas é controlado pela Option [`--connect-retries`]). O Default é 5 segundos.

  Esta Option substitui a Option [`--connect-delay`], que agora está Deprecated e sujeita a remoção em um Future Release do NDB Cluster.

  A forma abreviada `-r` para esta Option está Deprecated a partir do NDB 7.5.25 e NDB 7.6.21, e sujeita a remoção em um Future Release do NDB Cluster. Use a forma longa em vez disso.

* `--connect-string`

  <table frame="box" rules="all" summary="Propriedades para connect-string"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--connect-string=connection_string</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  O mesmo que [`--ndb-connectstring`].

* `--core-file`

  <table frame="box" rules="all" summary="Propriedades para core-file"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--core-file</code></td> </tr></tbody></table>

  Grava Core File em caso de erro; usado em Debugging.

* `--daemon`, `-d`

  <table frame="box" rules="all" summary="Propriedades para daemon"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--daemon</code></td> </tr></tbody></table>

  Instruí [**ndbd**] ou [**ndbmtd**] a executar como um Daemon Process. Este é o comportamento Default. [`--nodaemon`] pode ser usado para impedir que o Process seja executado como um Daemon.

  Esta Option não tem efeito ao executar [**ndbd**] ou [**ndbmtd**] em plataformas Windows.

* `--defaults-extra-file`

  <table frame="box" rules="all" summary="Propriedades para defaults-extra-file"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--defaults-extra-file=path</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  Lê o arquivo fornecido após a leitura dos arquivos globais.

* `--defaults-file`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--bind-address=name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code></code></td> </tr></tbody></table>

  Lê as Options padrão apenas do arquivo fornecido.

* `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--bind-address=name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code></code></td> </tr></tbody></table>

  Também lê Groups com concat(group, suffix).

* `--foreground`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--bind-address=name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code></code></td> </tr></tbody></table>

  Causa [**ndbd**] ou [**ndbmtd**] a executar como um Process em Foreground, principalmente para fins de Debugging. Esta Option implica a Option [`--nodaemon`].

  Esta Option não tem efeito ao executar [**ndbd**] ou [**ndbmtd**] em plataformas Windows.

* `--help`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--bind-address=name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code></code></td> </tr></tbody></table>

  Exibe o texto de ajuda e sai.

* `--initial`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--bind-address=name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code></code></td> </tr></tbody></table>

  Instruí [**ndbd**] a realizar um Start inicial. Um Start inicial apaga quaisquer arquivos criados para fins de recovery por instâncias anteriores de [**ndbd**]. Ele também recria os arquivos de Redo Log de recovery. Em alguns sistemas operacionais, este Process pode levar uma quantidade substancial de tempo.

  Um Start [`--initial`] deve ser usado *apenas* ao iniciar o Process [**ndbd**] sob circunstâncias muito especiais; isso ocorre porque esta Option faz com que todos os arquivos sejam removidos do File System do NDB Cluster e todos os arquivos de Redo Log sejam recriados. Estas circunstâncias estão listadas aqui:

  + Ao realizar um Software Upgrade que alterou o conteúdo de quaisquer arquivos.

  + Ao reiniciar o Node com uma nova Version de [**ndbd**].

  + Como uma medida de último recurso quando, por alguma razão, o Node Restart ou System Restart falha repetidamente. Neste caso, esteja ciente de que este Node não pode mais ser usado para restaurar dados devido à destruição dos Data Files.

  Aviso

  Para evitar a possibilidade de eventual perda de dados, é recomendado que você *não* use a Option `--initial` juntamente com `StopOnError = 0`. Em vez disso, defina `StopOnError` como 0 em `config.ini` somente após o Cluster ter sido iniciado, e então reinicie os Data Nodes normalmente — ou seja, sem a Option `--initial`. Consulte a descrição do parâmetro [`StopOnError`] para uma explicação detalhada deste problema. (Bug #24945638)

  O uso desta Option impede que os parâmetros de configuração [`StartPartialTimeout`] e [`StartPartitionedTimeout`] tenham qualquer efeito.

  Importante

  Esta Option *não* afeta nenhum dos seguintes tipos de arquivos:

  + Arquivos de Backup que já foram criados pelo Node afetado.

  + Arquivos NDB Cluster Disk Data (consulte [Section 21.6.11, “NDB Cluster Disk Data Tables”]).

  Esta Option também não tem efeito sobre o recovery de dados por um Data Node que está apenas iniciando (ou reiniciando) a partir de Data Nodes que já estão em execução. Este recovery de dados ocorre automaticamente e não requer intervenção do usuário em um NDB Cluster que esteja funcionando normalmente.

  É permitido usar esta Option ao iniciar o Cluster pela primeira vez (ou seja, antes que quaisquer Data Node Files tenham sido criados); no entanto, *não* é necessário fazê-lo.

* `--initial-start`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--bind-address=name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code></code></td> </tr></tbody></table>

  Esta Option é usada ao realizar um Start inicial parcial do Cluster. Cada Node deve ser iniciado com esta Option, bem como [`--nowait-nodes`].

  Suponha que você tenha um Cluster de 4 Nodes cujos Data Nodes têm os IDs 2, 3, 4 e 5, e você deseja realizar um Start inicial parcial usando apenas os Nodes 2, 4 e 5 — ou seja, omitindo o Node 3:

  ```sql
  $> ndbd --ndb-nodeid=2 --nowait-nodes=3 --initial-start
  $> ndbd --ndb-nodeid=4 --nowait-nodes=3 --initial-start
  $> ndbd --ndb-nodeid=5 --nowait-nodes=3 --initial-start
  ```

  Ao usar esta Option, você também deve especificar o Node ID para o Data Node que está sendo iniciado com a Option [`--ndb-nodeid`].

  Importante

  Não confunda esta Option com a Option [`--nowait-nodes`] para [**ndb_mgmd**], que pode ser usada para permitir que um Cluster configurado com múltiplos Management Servers seja iniciado sem que todos os Management Servers estejam Online.

* `--install[=name]`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--bind-address=name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code></code></td> </tr></tbody></table>

  Causa [**ndbd**] a ser instalado como um Windows Service. Opcionalmente, você pode especificar um Name para o Service; se não for definido, o Service Name assume o Default `ndbd`. Embora seja preferível especificar outras Options do programa [**ndbd**] em um arquivo de configuração `my.ini` ou `my.cnf`, é possível usar junto com `--install`. No entanto, em tais casos, a Option `--install` deve ser especificada primeiro, antes que quaisquer outras Options sejam fornecidas, para que a instalação do Windows Service seja bem-sucedida.

  Geralmente, não é aconselhável usar esta Option junto com a Option [`--initial`], pois isso faz com que o File System do Data Node seja apagado e reconstruído toda vez que o Service é parado e iniciado. Deve-se tomar extremo cuidado se você pretende usar qualquer uma das outras Options de [**ndbd**] que afetam o Start dos Data Nodes — incluindo [`--initial-start`], [`--nostart`], e [`--nowait-nodes`] — juntamente com [`--install`], e você deve ter certeza absoluta de que compreende completamente e leva em conta quaisquer possíveis consequências de fazê-lo.

  A Option [`--install`] não tem efeito em plataformas que não sejam Windows.

* `--logbuffer-size=#`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--bind-address=name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code></code></td> </tr></tbody></table>

  Define o tamanho do Log Buffer do Data Node. Ao depurar com grandes quantidades de Logging extra, é possível que o Log Buffer fique sem espaço se houver muitas Log Messages, caso em que algumas Log Messages podem ser perdidas. Isso não deve ocorrer durante operações normais.

* `--login-path`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--bind-address=name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code></code></td> </tr></tbody></table>

  Lê o Path fornecido a partir do Login File.

* `--ndb-connectstring`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--bind-address=name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code></code></td> </tr></tbody></table>

  Define a Connect String para conexão com ndb_mgmd. Sintaxe: "[nodeid=id;][host=]hostname[:port]". Sobrescreve entradas em NDB_CONNECTSTRING e my.cnf.

* `--ndb-mgmd-host`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  O mesmo que [`--ndb-connectstring`].

* `--ndb-nodeid`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Define o Node ID para este Node, sobrescrevendo qualquer ID definido por [`--ndb-connectstring`].

* `--ndb-optimized-node-selection`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Habilita otimizações para seleção de Nodes para Transactions. Habilitado por Default; use `--skip-ndb-optimized-node-selection` para desabilitar.

* `--nodaemon`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Impede que [**ndbd**] ou [**ndbmtd**] seja executado como um Daemon Process. Esta Option sobrescreve a Option [`--daemon`]. Isto é útil para redirecionar a saída para a tela ao depurar o binário.

  O comportamento Default para [**ndbd**] e [**ndbmtd**] no Windows é executar em Foreground, tornando esta Option desnecessária em plataformas Windows, onde não tem efeito.

* `--no-defaults`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Não lê Options Default de nenhum Option File além do Login File.

* `--nostart`, `-n`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Instruí [**ndbd**] a não iniciar automaticamente. Quando esta Option é usada, [**ndbd**] se conecta ao management server, obtém dados de configuração dele e inicializa objetos de Communication. No entanto, ele não inicia a Execution Engine até que seja especificamente solicitado pelo management server. Isso pode ser realizado emitindo o comando [`START`] apropriado no Management Client (consulte [Section 21.6.1, “Commands in the NDB Cluster Management Client”]).

* `--nowait-nodes=node_id_1[, node_id_2[, ...`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Esta Option aceita uma lista de Data Nodes pelos quais o Cluster não espera antes de iniciar.

  Isso pode ser usado para iniciar o Cluster em um estado partitioned. Por exemplo, para iniciar o Cluster com apenas metade dos Data Nodes (Nodes 2, 3, 4 e 5) em execução em um Cluster de 4 Nodes, você pode iniciar cada Process [**ndbd**] com `--nowait-nodes=3,5`. Neste caso, o Cluster inicia assim que os Nodes 2 e 4 se conectam, e *não* espera [`StartPartitionedTimeout`] milliseconds pelos Nodes 3 e 5 se conectarem, como faria de outra forma.

  Se você quisesse iniciar o mesmo Cluster do exemplo anterior sem um [**ndbd**] (digamos, por exemplo, que a máquina Host para o Node 3 sofreu uma falha de Hardware), então inicie os Nodes 2, 4 e 5 com `--nowait-nodes=3`. O Cluster inicia assim que os Nodes 2, 4 e 5 se conectam e não espera que o Node 3 inicie.

* `--print-defaults`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Imprime a lista de argumentos do programa e sai.

* [`--remove[=name]`]

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Causa a remoção de um Process [**ndbd**] que foi previamente instalado como um Windows Service. Opcionalmente, você pode especificar um Name para o Service a ser desinstalado; se não for definido, o Service Name assume o Default `ndbd`.

  A Option [`--remove`] não tem efeito em plataformas que não sejam Windows.

* `--usage`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Exibe o texto de ajuda e sai; o mesmo que [`--help`].

* `--verbose`, `-v`

  Causa a gravação de Output extra de Debug no Node Log.

  No NDB 7.6, você também pode usar [`NODELOG DEBUG ON`] e [`NODELOG DEBUG OFF`] para habilitar e desabilitar este Logging extra enquanto o Data Node está em execução.

* `--version`

  <table frame="box" rules="all" summary="Propriedades para connect-delay"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--connect-delay=#</code></td> </tr><tr><th>Obsoleto (Deprecated)</th> <td>Sim (removido em 5.7.36-ndb-7.6.21)</td> </tr><tr><th>Tipo</th> <td>Numeric</td> </tr><tr><th>Valor Padrão</th> <td><code>5</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>3600</code></td> </tr></tbody></table>

  Exibe informações de Version e sai.

[**ndbd**] gera um conjunto de Log Files que são colocados no diretório especificado por [`DataDir`] no arquivo de configuração `config.ini`.

Estes Log Files estão listados abaixo. *`node_id`* é e representa o identificador exclusivo do Node. Por exemplo, `ndb_2_error.log` é o Error Log gerado pelo Data Node cujo Node ID é `2`.

* `ndb_node_id_error.log` é um arquivo contendo registros de todas as falhas (crashes) que o Process [**ndbd**] referenciado encontrou. Cada registro neste arquivo contém uma breve String de erro e uma referência a um Trace File para esta falha. Uma entrada típica neste arquivo pode aparecer como mostrado aqui:

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

  Listagens de possíveis códigos de saída de [**ndbd**] e mensagens geradas quando um Process de Data Node é encerrado prematuramente podem ser encontradas em [Data Node Error Messages].

  Importante

  *A última entrada no Error Log File não é necessariamente a mais nova* (nem é provável que seja). As entradas no Error Log *não* estão listadas em ordem cronológica; em vez disso, elas correspondem à ordem dos Trace Files conforme determinado no arquivo `ndb_node_id_trace.log.next` (veja abaixo). As entradas do Error Log são, portanto, sobrescritas de forma cíclica, e não sequencial.

* `ndb_node_id_trace.log.trace_id` é um Trace File que descreve exatamente o que aconteceu pouco antes do erro ocorrer. Esta informação é útil para análise pela equipe de desenvolvimento do NDB Cluster.

  É possível configurar o número destes Trace Files que são criados antes que os arquivos antigos sejam sobrescritos. *`trace_id`* é um número que é incrementado para cada Trace File sucessivo.

* `ndb_node_id_trace.log.next` é o arquivo que rastreia o próximo número de Trace File a ser atribuído.

* `ndb_node_id_out.log` é um arquivo contendo qualquer Output de dados pelo Process [**ndbd**]. Este arquivo é criado somente se [**ndbd**] for iniciado como um Daemon, que é o comportamento Default.

* `ndb_node_id.pid` é um arquivo contendo o Process ID do Process [**ndbd**] quando iniciado como um Daemon. Ele também funciona como um Lock File para evitar o Start de Nodes com o mesmo identificador.

* `ndb_node_id_signal.log` é um arquivo usado apenas em versões de Debug de [**ndbd**], onde é possível rastrear todas as mensagens Incoming, Outgoing e internas com seus dados no Process [**ndbd**].

É recomendado não usar um diretório montado via NFS porque em alguns ambientes isso pode causar problemas onde o Lock no arquivo `.pid` permanece ativo mesmo após o Process ter sido encerrado.

Para iniciar [**ndbd**], também pode ser necessário especificar o Host Name do management server e a Port na qual ele está Listening. Opcionalmente, pode-se também especificar o Node ID que o Process deve usar.

```sql
$> ndbd --connect-string="nodeid=2;host=ndb_mgmd.mysql.com:1186"
```

Consulte [Section 21.4.3.3, “NDB Cluster Connection Strings”], para obter informações adicionais sobre este assunto. Para mais informações sobre parâmetros de configuração de Data Node, consulte [Section 21.4.3.6, “Defining NDB Cluster Data Nodes”].

Quando [**ndbd**] inicia, ele realmente inicia dois Processes. O primeiro deles é chamado de “Angel Process”; seu único trabalho é descobrir quando o Execution Process foi concluído e, em seguida, reiniciar o Process [**ndbd**], se estiver configurado para isso. Assim, se você tentar terminar [**ndbd**] usando o comando Unix [**kill**], é necessário terminar ambos os Processes, começando pelo Angel Process. O método preferido para encerrar um Process [**ndbd**] é usar o Management Client e parar o Process a partir de lá.

O Execution Process usa um Thread para ler, escrever e escanear dados, bem como todas as outras atividades. Este Thread é implementado de forma assíncrona para que possa facilmente lidar com milhares de ações concorrentes. Além disso, um Watch-Dog Thread supervisiona o Execution Thread para garantir que ele não fique preso em um Loop infinito. Um Pool de Threads lida com File I/O, com cada Thread capaz de lidar com um arquivo aberto. Threads também podem ser usados para Transporter Connections pelos Transporters no Process [**ndbd**]. Em um sistema multi-processor executando um grande número de operações (incluindo Updates), o Process [**ndbd**] pode consumir até 2 CPUs se permitido.

Para uma máquina com muitas CPUs, é possível usar vários Processes [**ndbd**] que pertencem a diferentes Node Groups; no entanto, tal configuração ainda é considerada experimental e não é suportada para MySQL 5.7 em um ambiente de produção. Consulte [Section 21.2.7, “Known Limitations of NDB Cluster”].