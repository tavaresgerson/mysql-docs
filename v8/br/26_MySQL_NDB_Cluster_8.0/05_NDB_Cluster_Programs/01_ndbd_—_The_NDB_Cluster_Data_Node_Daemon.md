### 25.5.1 ndbd — O daemon do nó de dados do cluster NDB

O binário **ndbd** fornece a versão de processo de thread única que é usada para lidar com todos os dados nas tabelas que utilizam o mecanismo de armazenamento `NDBCLUSTER`. Esse processo de nó de dados permite que um nó de dados realize o gerenciamento de transações distribuídas, recuperação de nós, checkpointing no disco, backup online e tarefas relacionadas. No NDB 8.0.38 e versões posteriores, quando iniciado, o **ndbd** registra um aviso semelhante ao mostrado aqui:

```
2024-05-28 13:32:16 [ndbd] WARNING  -- Running ndbd with a single thread of
signal execution.  For multi-threaded signal execution run the ndbmtd binary.
```

**ndbmtd**") é a versão multi-threaded deste binário.

Em um NDB Cluster, um conjunto de processos **ndbd** coopera na manipulação de dados. Esses processos podem ser executados no mesmo computador (host) ou em computadores diferentes. As correspondências entre nós de dados e hosts do Cluster são completamente configuráveis.

As opções que podem ser usadas com **ndbd** estão mostradas na tabela a seguir. Descrições adicionais seguem a tabela.

**Tabela 25.24 Opções de linha de comando usadas com o programa ndbd**

<table frame="box" rules="all"><thead><tr> <th scope="col">Formato</th> <th scope="col">Descrição</th> <th scope="col">Adicionado, Descontinuado ou Removido</th> </tr></thead><tbody><tr> <th><p> [[PH_HTML_CODE_<code> --defaults-extra-file=path </code>] </p></th> <td>Endereço de ligação local</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[PH_HTML_CODE_<code> --defaults-extra-file=path </code>] </p></th> <td>Diretório contendo conjuntos de caracteres</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[PH_HTML_CODE_<code> --defaults-group-suffix=string </code>] </p></th> <td>Sinônimo obsoleto para --connect-retry-delay, que deve ser usado em vez desta opção</td> <td><p>REMOvido: NDB 8.0.28</p></td> </tr></tbody><tbody><tr> <th><p> [[PH_HTML_CODE_<code> --filesystem-password=password </code>] </p></th> <td>Defina o número de vezes para tentar novamente uma conexão antes de desistir; 0 significa apenas uma tentativa (e nenhuma tentativa subsequente); -1 significa continuar tentando indefinidamente</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[PH_HTML_CODE_<code> --filesystem-password-from-stdin={TRUE|FALSE} </code>] </p></th> <td>Tempo de espera entre as tentativas de contato com um servidor de gerenciamento, em segundos; 0 significa não esperar entre as tentativas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p>[[PH_HTML_CODE_<code> --foreground </code>],</p><p> [[PH_HTML_CODE_<code>--help</code>] </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[PH_HTML_CODE_<code> -? </code>] </p></th> <td>Escreva o arquivo de núcleo em erro; usado no depuração</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p>[[PH_HTML_CODE_<code> --initial </code>],</p><p> [[PH_HTML_CODE_<code> --initial-start </code>] </p></th> <td>Inicie o ndbd como daemon (padrão); substitua com --nodaemon</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --defaults-extra-file=path </code>]] </p></th> <td>Leia o arquivo fornecido após os arquivos globais terem sido lidos</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --character-sets-dir=path </code><code> --defaults-extra-file=path </code>] </p></th> <td>Ler opções padrão a partir do arquivo fornecido apenas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --defaults-group-suffix=string </code>]] </p></th> <td>Leia também grupos com concatenação(grupo, sufixo)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --filesystem-password=password </code>]] </p></th> <td>Senha para criptografia do sistema de arquivos do nó; pode ser passada a partir do stdin, tty ou arquivo my.cnf</td> <td><p>ADICIONADO: NDB 8.0.31</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --filesystem-password-from-stdin={TRUE|FALSE} </code>]] </p></th> <td>Obtenha a senha para a criptografia do sistema de arquivos do nó, passada do stdin</td> <td><p>ADICIONADO: NDB 8.0.31</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --foreground </code>]] </p></th> <td>Execute o ndbd em primeiro plano, para fins de depuração (implica em --nodaemon)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code>--help</code>]],</p><p> [[<code> -? </code>]] </p></th> <td>Exibir texto de ajuda e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --initial </code>]] </p></th> <td>Realize o início inicial do ndbd, incluindo a limpeza do sistema de arquivos; consulte a documentação antes de usar essa opção</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --initial-start </code>]] </p></th> <td>Realize o início inicial parcial (requer --nowait-nodes)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --connect-delay=# </code><code> --defaults-extra-file=path </code>] </p></th> <td>Usado para instalar o processo do nó de dados como serviço do Windows; não se aplica em outras plataformas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --connect-delay=# </code><code> --defaults-extra-file=path </code>] </p></th> <td>Controle o tamanho do buffer de log; use quando estiver depurando com muitas mensagens de log sendo geradas; o padrão é suficiente para operações normais</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --connect-delay=# </code><code> --defaults-group-suffix=string </code>] </p></th> <td>Leia o caminho fornecido a partir do arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code> --connect-delay=# </code><code> --filesystem-password=password </code>],</p><p> [[<code> --connect-delay=# </code><code> --filesystem-password-from-stdin={TRUE|FALSE} </code>] </p></th> <td>Defina a string de conexão para se conectar ao ndb_mgmd. Sintaxe: "[nodeid=id;][host=]hostname[:por<code> --defaults-extra-file=path </code>". Substitui as entradas no NDB_CONNECTSTRING e no my.cnf</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code> --connect-delay=# </code><code> --foreground </code>],</p><p> [[<code> --connect-delay=# </code><code>--help</code>] </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --connect-delay=# </code><code> -? </code>] </p></th> <td>Defina o ID do nó para este nó, substituindo qualquer ID definida pela opção --ndb-connectstring</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --connect-delay=# </code><code> --initial </code>] </p></th> <td>Não inicie o ndbd como daemon; fornecido para fins de teste</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --connect-delay=# </code><code> --initial-start </code>] </p></th> <td>Não leia as opções padrão de nenhum arquivo de opção, exceto o arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code> --connect-retries=# </code><code> --defaults-extra-file=path </code>],</p><p> [[<code> --connect-retries=# </code><code> --defaults-extra-file=path </code>] </p></th> <td>Não inicie o ndbd imediatamente; o ndbd aguarda o comando para ser iniciado a partir do ndb_mgm</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --connect-retries=# </code><code> --defaults-group-suffix=string </code>] </p></th> <td>Não espere que esses nós de dados comecem (requer uma lista separada por vírgula dos IDs dos nós); requer --ndb-nodeid</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --connect-retries=# </code><code> --filesystem-password=password </code>] </p></th> <td>Ative as otimizações para a seleção de nós para transações. Ativado por padrão; use --skip-ndb-optimized-node-selection para desativá-lo</td> <td><p>REMOvido: 8.0.31</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --connect-retries=# </code><code> --filesystem-password-from-stdin={TRUE|FALSE} </code>] </p></th> <td>Imprimir a lista de argumentos do programa e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --connect-retries=# </code><code> --foreground </code>] </p></th> <td>Usado para remover o processo do nó de dados que foi instalado anteriormente como serviço do Windows; não se aplica em outras plataformas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code> --connect-retries=# </code><code>--help</code>],</p><p> [[<code> --connect-retries=# </code><code> -? </code>] </p></th> <td>Exibir texto de ajuda e sair; o mesmo que --help</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code> --connect-retries=# </code><code> --initial </code>],</p><p> [[<code> --connect-retries=# </code><code> --initial-start </code>] </p></th> <td>Escreva informações de depuração adicionais no log do nó</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code> --connect-retry-delay=# </code><code> --defaults-extra-file=path </code>],</p><p> [[<code> --connect-retry-delay=# </code><code> --defaults-extra-file=path </code>] </p></th> <td>Exibir informações da versão e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody></table>

Nota

Todas essas opções também se aplicam à versão multithread deste programa (\*\*ndbmtd")) e você pode substituir “\*\*ndbmtd””) por “\*\*ndbd”” onde quer que este último ocorra nesta seção.

- `--bind-address`

  <table summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code></code>]]</td> </tr></tbody></table>

  Faz com que o **ndbd** se ligue a uma interface de rede específica (nome de host ou endereço IP). Esta opção não tem um valor padrão.

- `--character-sets-dir`

  <table summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr></tbody></table>

  Diretório contendo conjuntos de caracteres.

- `--connect-delay=#`

  <table summary="Propriedades para delay de conexão"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--connect-delay=#</code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim (removido em 8.0.28-ndb-8.0.28)</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td>[[<code>5</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>3600</code>]]</td> </tr></tbody></table>

  Determina o tempo de espera entre as tentativas de contato com um servidor de gerenciamento ao iniciar (o número de tentativas é controlado pela opção `--connect-retries`). O padrão é de 5 segundos.

  Esta opção está desatualizada e está sujeita à remoção em uma futura versão do NDB Cluster. Use `--connect-retry-delay` em vez disso.

- `--connect-retries=#`

  <table summary="Propriedades para tentativas de conexão de reposição"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--connect-retries=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td>[[<code>12</code>]]</td> </tr><tr><th>Valor mínimo (≥ 8.0.28-ndb-8.0.28)</th> <td>[[<code>-1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>-1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>-1</code>]]</td> </tr><tr><th>Valor mínimo (≤ 8.0.27-ndb-8.0.27)</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>

  Defina o número de vezes para tentar novamente uma conexão antes de desistir; 0 significa apenas uma tentativa (e nenhuma tentativa). O padrão é 12 tentativas. O tempo de espera entre tentativas é controlado pela opção `--connect-retry-delay`.

  A partir da versão 8.0.28 do NDB, você pode definir essa opção para -1, caso em que o processo do nó de dados continuará indefinidamente tentando se conectar.

- `--connect-retry-delay=#`

  <table summary="Propriedades para connect-retry-delay"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--connect-retry-delay=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td>[[<code>5</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>4294967295</code>]]</td> </tr></tbody></table>

  Determina o tempo de espera entre as tentativas de contato com um servidor de gerenciamento ao iniciar (o tempo entre as tentativas é controlado pela opção `--connect-retries`). O padrão é de 5 segundos.

  Esta opção substitui a opção `--connect-delay`, que agora está desatualizada e está sujeita à remoção em uma futura versão do NDB Cluster.

  A forma abreviada `-r` para essa opção foi descontinuada a partir da NDB 8.0.28 e está sujeita à remoção em uma futura versão do NDB Cluster. Use a forma longa em vez disso.

- `--connect-string`

  <table summary="Propriedades para a string de conexão"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--connect-string=connection_string</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>

  O mesmo que `--ndb-connectstring`.

- `--core-file`

  <table summary="Propriedades para arquivo de núcleo"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--core-file</code>]]</td> </tr></tbody></table>

  Escreva o arquivo de núcleo em erro; usado no depuração.

- `--daemon`, `-d`

  <table summary="Propriedades para daemon"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--daemon</code>]]</td> </tr></tbody></table>

  Instrua o **ndbd** ou **ndbmtd**") a ser executado como um processo de daemon. Esse é o comportamento padrão. `--nodaemon` pode ser usado para impedir que o processo seja executado como um daemon.

  Esta opção não tem efeito quando você executa **ndbd** ou **ndbmtd**") em plataformas Windows.

- `--defaults-extra-file`

  <table summary="Propriedades para defaults-extra-file"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--defaults-extra-file=path</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>

  Leia o arquivo fornecido após a leitura dos arquivos globais.

- `--defaults-file`

  <table summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code></code>]]</td> </tr></tbody></table>0

  Leia as opções padrão do arquivo fornecido.

- `--defaults-group-suffix`

  <table summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code></code>]]</td> </tr></tbody></table>1

  Leia também grupos com concatenação (grupo, sufixo).

- `--filesystem-password`

  <table summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code></code>]]</td> </tr></tbody></table>2

  Transmita a senha de criptografia e descriptografia do sistema de arquivos para o processo do nó de dados usando `stdin`, `tty` ou o arquivo `my.cnf`.

  Requer `EncryptedFileSystem = 1`.

  Para obter mais informações, consulte a Seção 25.6.14, “Criptografia do Sistema de Arquivos para NDB Cluster”.

- `--filesystem-password-from-stdin`

  <table summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code></code>]]</td> </tr></tbody></table>3

  Transmita a senha de criptografia e descriptografia do sistema de arquivos para o processo do nó de dados a partir de `stdin` (apenas).

  Requer `EncryptedFileSystem = 1`.

  Para obter mais informações, consulte a Seção 25.6.14, “Criptografia do Sistema de Arquivos para NDB Cluster”.

- `--foreground`

  <table summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code></code>]]</td> </tr></tbody></table>4

  Causas **ndbd** ou \*\*ndbmtd") para executar como um processo em primeiro plano, principalmente para fins de depuração. Esta opção implica na opção `--nodaemon`.

  Esta opção não tem efeito quando você executa **ndbd** ou **ndbmtd**") em plataformas Windows.

- `--help`

  <table summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code></code>]]</td> </tr></tbody></table>5

  Exibir texto de ajuda e sair.

- `--initial`

  <table summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code></code>]]</td> </tr></tbody></table>6

  Instrui o **ndbd** a realizar um início inicial. Um início inicial apaga quaisquer arquivos criados para fins de recuperação por instâncias anteriores do **ndbd**. Também recria os arquivos de log de recuperação. Em alguns sistemas operacionais, esse processo pode levar um tempo substancial.

  Um início `--initial` deve ser usado *apenas* ao iniciar o processo **ndbd** em circunstâncias muito especiais; isso ocorre porque essa opção faz com que todos os arquivos sejam removidos do sistema de arquivos do NDB Cluster e todos os arquivos de log de refazer sejam recriados. Essas circunstâncias estão listadas aqui:

  - Ao realizar uma atualização de software que alterou o conteúdo de quaisquer arquivos.

  - Ao reiniciar o nó com uma nova versão do **ndbd**.

  - Como medida de último recurso quando, por algum motivo, o reinício do nó ou do sistema falha repetidamente. Nesse caso, esteja ciente de que esse nó não pode mais ser usado para restaurar dados devido à destruição dos arquivos de dados.

  Aviso

  Para evitar a possibilidade de perda de dados eventual, recomenda-se que você *não* use a opção `--initial` junto com `StopOnError = 0`. Em vez disso, defina `StopOnError` para 0 em `config.ini` apenas após o clúster ter sido iniciado, e então reinicie os nós de dados normalmente — ou seja, sem a opção `--initial`. Veja a descrição do parâmetro `StopOnError` para uma explicação detalhada sobre esse problema. (Bug
  \#24945638)

  O uso desta opção impede que os parâmetros de configuração `StartPartialTimeout` e `StartPartitionedTimeout` tenham qualquer efeito.

  Importante

  Esta opção *não* afeta os arquivos de backup que já foram criados pelo nó afetado.

  Antes da versão 8.0.21 do NDB, a opção `--initial` também não afetava nenhum arquivo de dados do disco. Na versão 8.0.21 e em versões posteriores, quando usada para realizar um reinício inicial do clúster, a opção causa a remoção de todos os arquivos de dados associados aos tablespaces de dados do disco e os arquivos de log de desfazer associados aos grupos de arquivos de log que existiam anteriormente neste nó de dados (consulte a Seção 25.6.11, “Tables de Dados do Disco do Clúster NDB”).

  Essa opção também não afeta a recuperação de dados por um nó de dados que está apenas começando (ou reiniciando) a partir de nós de dados que já estão em execução (a menos que também tenham sido iniciados com `--initial`, como parte de um reinício inicial). Essa recuperação de dados ocorre automaticamente e não requer intervenção do usuário em um NDB Cluster que está funcionando normalmente.

  É permitido usar essa opção ao iniciar o clúster pela primeira vez (ou seja, antes que quaisquer arquivos de nó de dados tenham sido criados); no entanto, não é *necessário* fazer isso.

- `--initial-start`

  <table summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code></code>]]</td> </tr></tbody></table>7

  Esta opção é usada ao realizar um início inicial parcial do clúster. Cada nó deve ser iniciado com esta opção, bem como `--nowait-nodes`.

  Suponha que você tenha um clúster de 4 nós, cujos nós de dados têm os IDs 2, 3, 4 e 5, e que você queira realizar um início inicial parcial usando apenas os nós 2, 4 e 5 — ou seja, omitindo o nó 3:

  ```
  $> ndbd --ndb-nodeid=2 --nowait-nodes=3 --initial-start
  $> ndbd --ndb-nodeid=4 --nowait-nodes=3 --initial-start
  $> ndbd --ndb-nodeid=5 --nowait-nodes=3 --initial-start
  ```

  Ao usar essa opção, você também deve especificar o ID do nó para o nó de dados que está sendo iniciado com a opção `--ndb-nodeid`.

  Importante

  Não confunda essa opção com a opção `--nowait-nodes` para **ndb\_mgmd**, que pode ser usada para permitir que um clúster configurado com múltiplos servidores de gerenciamento seja iniciado sem que todos os servidores de gerenciamento estejam online.

- `--install[=name]`

  <table summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code></code>]]</td> </tr></tbody></table>8

  Faz com que o **ndbd** seja instalado como um serviço do Windows. Opcionalmente, você pode especificar um nome para o serviço; se não for definido, o nome do serviço será `ndbd`. Embora seja preferível especificar outras opções do programa **ndbd** em um arquivo de configuração `my.ini` ou `my.cnf`, é possível usá-lo junto com `--install`. No entanto, nesses casos, a opção `--install` deve ser especificada primeiro, antes de quaisquer outras opções serem fornecidas, para que a instalação do serviço do Windows seja bem-sucedida.

  Geralmente, não é aconselhável usar essa opção junto com a opção `--initial`, pois isso faz com que o sistema de arquivos do nó de dados seja apagado e reconstruído toda vez que o serviço é parado e reiniciado. Também é necessário tomar extremo cuidado se você pretende usar qualquer uma das outras opções do **ndbd** que afetam o início dos nós de dados — incluindo `--initial-start`, `--nostart` e `--nowait-nodes` — junto com `--install`, e você deve ter certeza absoluta de que entende completamente e permite quaisquer possíveis consequências de fazer isso.

  A opção `--install` não tem efeito em plataformas que não são do Windows.

- `--logbuffer-size=#`

  <table summary="Propriedades para endereço de ligação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code></code>]]</td> </tr></tbody></table>9

  Define o tamanho do buffer de log do nó de dados. Ao depurar com grandes quantidades de registros extras, é possível que o buffer de log fique sem espaço se houver muitas mensagens de log, o que pode resultar na perda de algumas mensagens de log. Isso não deve ocorrer durante operações normais.

- `--login-path`

  <table summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr></tbody></table>0

  Leia o caminho fornecido a partir do arquivo de login.

- `--ndb-connectstring`

  <table summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr></tbody></table>1

  Defina a string de conexão para se conectar ao ndb\_mgmd. Sintaxe: "\[nodeid=id;]\[host=]hostname\[:port]". Oculte entradas no NDB\_CONNECTSTRING e no my.cnf.

- `--ndb-mgmd-host`

  <table summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr></tbody></table>2

  O mesmo que `--ndb-connectstring`.

- `--ndb-nodeid`

  <table summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr></tbody></table>3

  Defina o ID do nó para este nó, substituindo qualquer ID definida pela opção --ndb-connectstring.

- `--ndb-optimized-node-selection`

  <table summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr></tbody></table>4

  Ative as otimizações para a seleção de nós para transações. Ativado por padrão; use `--skip-ndb-optimized-node-selection` para desativá-lo.

- `--nodaemon`

  <table summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr></tbody></table>5

  Previne que **ndbd** ou **ndbmtd**") sejam executados como um processo de daemon. Esta opção substitui a opção `--daemon`. Isso é útil para redirecionar a saída para a tela durante a depuração do binário.

  O comportamento padrão para **ndbd** e **ndbmtd**") no Windows é executar em primeiro plano, tornando essa opção desnecessária nas plataformas do Windows, onde não tem efeito.

- `--no-defaults`

  <table summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr></tbody></table>6

  Não leia as opções padrão de nenhum arquivo de opção, exceto o arquivo de login.

- `--nostart`, `-n`

  <table summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr></tbody></table>7

  Instrui o **ndbd** a não iniciar automaticamente. Quando esta opção é usada, o **ndbd** se conecta ao servidor de gerenciamento, obtém dados de configuração dele e inicializa objetos de comunicação. No entanto, ele não inicia efetivamente o motor de execução até que seja solicitado especificamente pelo servidor de gerenciamento. Isso pode ser feito emitindo o comando apropriado `START` no cliente de gerenciamento (veja a Seção 25.6.1, “Comandos no Cliente de Gerenciamento do NDB Cluster”).

- `--nowait-nodes=node_id_1[, node_id_2[, ...]]`

  <table summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr></tbody></table>8

  Esta opção recebe uma lista de nós de dados para os quais o cluster não espera, antes de começar.

  Isso pode ser usado para iniciar o clúster em um estado particionado. Por exemplo, para iniciar o clúster com apenas metade dos nós de dados (nós 2, 3, 4 e 5) rodando em um clúster de 4 nós, você pode iniciar cada processo **ndbd** com `--nowait-nodes=3,5`. Neste caso, o clúster começa assim que os nós 2 e 4 se conectam e *não* aguarda `StartPartitionedTimeout` milissegundos para que os nós 3 e 5 se conectem, como faria caso contrário.

  Se você quisesse iniciar o mesmo clúster do exemplo anterior sem um **ndbd** (digamos, por exemplo, que a máquina hospedeira do nó 3 sofreu uma falha de hardware), então inicie os nós 2, 4 e 5 com `--nowait-nodes=3`. O clúster começará assim que os nós 2, 4 e 5 se conectarem e não aguardará o início do nó 3.

- `--print-defaults`

  <table summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr></tbody></table>9

  Imprima a lista de argumentos do programa e saia.

- `--remove[=name]`

  <table summary="Propriedades para delay de conexão"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--connect-delay=#</code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim (removido em 8.0.28-ndb-8.0.28)</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td>[[<code>5</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>3600</code>]]</td> </tr></tbody></table>0

  Causa a remoção do processo **ndbd** que foi instalado anteriormente como um serviço do Windows. Opcionalmente, você pode especificar um nome para o serviço que será desinstalado; se não for definido, o nome do serviço será predefinido como `ndbd`.

  A opção `--remove` não tem efeito em plataformas que não são do Windows.

- `--usage`

  <table summary="Propriedades para delay de conexão"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--connect-delay=#</code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim (removido em 8.0.28-ndb-8.0.28)</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td>[[<code>5</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>3600</code>]]</td> </tr></tbody></table>1

  Exibir texto de ajuda e sair; o mesmo que --help.

- `--verbose`, `-v`

  Faz com que a saída de depuração extra seja escrita no log do nó.

  Você também pode usar `NODELOG DEBUG ON` e `NODELOG DEBUG OFF` para habilitar e desabilitar esse registro extra enquanto o nó de dados estiver em execução.

- `--version`

  <table summary="Propriedades para delay de conexão"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--connect-delay=#</code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim (removido em 8.0.28-ndb-8.0.28)</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td>[[<code>5</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>3600</code>]]</td> </tr></tbody></table>2

  Exibir informações da versão e sair.

O **ndbd** gera um conjunto de arquivos de log que são colocados no diretório especificado por `DataDir` no arquivo de configuração `config.ini`.

Esses arquivos de registro estão listados abaixo. `node_id` é o identificador único do nó. Por exemplo, `ndb_2_error.log` é o log de erro gerado pelo nó de dados cujo ID de nó é `2`.

- `ndb_node_id_error.log` é um arquivo que contém registros de todos os travamentos que o processo **ndbd** a que se refere encontrou. Cada registro neste arquivo contém uma breve string de erro e uma referência a um arquivo de registro deste travamento. Uma entrada típica neste arquivo pode aparecer como mostrado aqui:

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

  As listagens dos possíveis códigos de saída do **ndbd** e as mensagens geradas quando um processo do nó de dados é desligado prematuramente podem ser encontradas em Mensagens de Erro do Nó de Dados.

  Importante

  *A última entrada no arquivo de log de erros não é necessariamente a mais recente* (e também não é provável que seja). As entradas no log de erros não estão listadas em ordem cronológica; elas correspondem, em vez disso, à ordem dos arquivos de registro conforme determinado no arquivo `ndb_node_id_trace.log.next` (veja abaixo). As entradas do log de erros são, portanto, sobrescritas de forma cíclica e não sequencial.

- `ndb_node_id_trace.log.trace_id` é um arquivo de registro que descreve exatamente o que aconteceu logo antes do erro ocorrer. Essas informações são úteis para a análise da equipe de desenvolvimento do NDB Cluster.

  É possível configurar o número desses arquivos de registro que são criados antes que os arquivos antigos sejam sobrescritos. `trace_id` é um número que é incrementado para cada arquivo de registro subsequente.

- `ndb_node_id_trace.log.next` é o arquivo que mantém o controle do próximo número de arquivo de rastreamento a ser atribuído.

- `ndb_node_id_out.log` é um arquivo que contém quaisquer dados gerados pelo processo **ndbd**. Esse arquivo é criado apenas se o **ndbd** for iniciado como um daemon, que é o comportamento padrão.

- `ndb_node_id.pid` é um arquivo que contém o ID do processo do **ndbd** quando iniciado como um daemon. Ele também funciona como um arquivo de bloqueio para evitar o início de nós com o mesmo identificador.

- `ndb_node_id_signal.log` é um arquivo usado apenas em versões de depuração do **ndbd**, onde é possível rastrear todas as mensagens recebidas, enviadas e internas com seus dados no processo **ndbd**.

Recomenda-se não usar um diretório montado através do NFS, pois, em alguns ambientes, isso pode causar problemas, onde o bloqueio do arquivo `.pid` permanece em vigor mesmo após o processo ter sido encerrado.

Para iniciar o **ndbd**, também pode ser necessário especificar o nome do host do servidor de gerenciamento e a porta na qual ele está ouvindo. Opcionalmente, também é possível especificar o ID do nó que o processo deve usar.

```
$> ndbd --connect-string="nodeid=2;host=ndb_mgmd.mysql.com:1186"
```

Consulte a Seção 25.4.3.3, “Strings de Conexão de NDB Cluster”, para obter informações adicionais sobre esse problema. Para obter mais informações sobre os parâmetros de configuração dos nós de dados, consulte a Seção 25.4.3.6, “Definindo Nodos de Dados de NDB Cluster”.

Quando o **ndbd** é iniciado, ele realmente inicia dois processos. O primeiro deles é chamado de "processo anjo"; seu único trabalho é descobrir quando o processo de execução foi concluído e, em seguida, reiniciar o processo **ndbd** se ele estiver configurado para fazer isso. Assim, se você tentar matar o **ndbd** usando o comando Unix **kill**, é necessário matar ambos os processos, começando com o processo anjo. O método preferido de término de um processo **ndbd** é usar o cliente de gerenciamento e parar o processo a partir daí.

O processo de execução utiliza um único fio para leitura, escrita e varredura de dados, bem como para todas as outras atividades. Esse fio é implementado de forma assíncrona para que possa facilmente lidar com milhares de ações concorrentes. Além disso, um fio de guarda-costas supervisiona o fio de execução para garantir que ele não fique preso em um loop infinito. Um conjunto de fios lida com o E/S de arquivos, com cada fio capaz de lidar com um arquivo aberto. Os fios também podem ser usados para conexões de transportador pelos transportadores no processo **ndbd**. Em um sistema multi-processador que realiza um grande número de operações (incluindo atualizações), o processo **ndbd** pode consumir até 2 CPUs, se permitido.

Para uma máquina com muitas CPUs, é possível usar vários processos **ndbd** que pertencem a diferentes grupos de nós; no entanto, essa configuração ainda é considerada experimental e não é suportada para o MySQL 8.0 em um ambiente de produção. Veja a Seção 25.2.7, “Limitações Conhecidas do NDB Cluster”.
