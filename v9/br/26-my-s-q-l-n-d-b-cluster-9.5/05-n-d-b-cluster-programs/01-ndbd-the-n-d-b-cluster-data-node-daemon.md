### 25.5.1 ndbd — O Daemon de Nó de Dados do NDB Cluster

O binário **ndbd** fornece a versão de thread único do processo que é usado para lidar com todos os dados nas tabelas que utilizam o mecanismo de armazenamento `NDBCLUSTER`. Este processo de nó de dados permite que um nó de dados realize o gerenciamento de transações distribuídas, recuperação de nós, checkpointing no disco, backup online e tarefas relacionadas. Ao ser iniciado, **ndbd** registra um aviso semelhante ao mostrado aqui:

```
2024-05-28 13:32:16 [ndbd] WARNING  -- Running ndbd with a single thread of
signal execution.  For multi-threaded signal execution run the ndbmtd binary.
```

Defina o número de vezes para tentar uma conexão novamente antes de desistir; 0 significa apenas uma tentativa (e nenhuma tentativa adicional). O valor padrão é 12 tentativas. O tempo de espera entre as tentativas é controlado pela opção `--connect-retry-delay`.

Também é possível definir essa opção para -1, caso em que o processo do nó de dados continua indefinidamente tentando se conectar.

* `--connect-retry-delay=#`

  <table frame="box" rules="all" summary="Propriedades para connect-retry-delay"><tbody><tr><th>Formato de linha de comando</th> <td><code>--connect-retry-delay=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td><code>5</code></td> </tr><tr><th>Valor mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor máximo</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Determina o tempo de espera entre as tentativas para contatar um servidor de gerenciamento ao iniciar (o tempo entre as tentativas é controlado pela opção `--connect-retries`). O valor padrão é 5 segundos.

  Esta opção substitui a opção `--connect-delay`, que agora está desatualizada e sujeita à remoção em uma futura versão do NDB Cluster.

  A forma abreviada `-r` para esta opção também está desatualizada e, portanto, sujeita à remoção. Use a forma longa em vez disso.

* `--connect-string`

  <table frame="box" rules="all" summary="Propriedades para connect-string"><tbody><tr><th>Formato de linha de comando</th> <td><code>--connect-string=connection_string</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  O mesmo que `--ndb-connectstring`.

* `--core-file`

  <table frame="box" rules="all" summary="Propriedades para core-file"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--core-file</code></td> </tr></tbody></table>

  Escreva o arquivo de código apenas em caso de erro; usado em depuração.

* `--daemon`, `-d`

  <table frame="box" rules="all" summary="Propriedades para daemon"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--daemon</code></td> </tr></tbody></table>

  Instrui **ndbd** ou **ndbmtd**") a ser executado como um processo de daemon. Esse é o comportamento padrão. `--nodaemon` pode ser usado para impedir que o processo seja executado como um daemon.

  Esta opção não tem efeito ao executar **ndbd** ou **ndbmtd**") em plataformas Windows.

* `--defaults-extra-file`

  <table frame="box" rules="all" summary="Propriedades para defaults-extra-file"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--defaults-extra-file=caminho</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[nenhum]</code></td> </tr></tbody></table>

  Leia o arquivo fornecido após a leitura dos arquivos globais.

* `--defaults-file`

  <table frame="box" rules="all" summary="Propriedades para defaults-file"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--defaults-file=caminho</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[nenhum]</code></td> </tr></tbody></table>

  Leia as opções padrão do arquivo fornecido apenas.

* `--defaults-group-suffix`

<table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tr><th>Formato de linha de comando</th><td><code>--character-sets-dir=caminho</code></td> </tr></table>

  Leia também grupos com concatenação(grupo, sufixo).

* `--filesystem-password`

<table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td><code>--character-sets-dir=caminho</code></td> </tr></tbody></table>

  Transmita a senha de criptografia e descriptografia do sistema de arquivos para o processo do nó de dados usando `stdin`, `tty` ou o arquivo `my.cnf`.

  Requer `EncryptedFileSystem = 1`.

  Para mais informações, consulte a Seção 25.6.19.4, “Criptografia de Sistema de Arquivos para NDB Cluster”.

* `--filesystem-password-from-stdin`

<table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td><code>--character-sets-dir=caminho</code></td> </tr></tbody></table>

  Transmita a senha de criptografia e descriptografia do sistema de arquivos para o processo do nó de dados a partir de `stdin` (apenas).

  Requer `EncryptedFileSystem = 1`.

  Para mais informações, consulte a Seção 25.6.19.4, “Criptografia de Sistema de Arquivos para NDB Cluster”.

* `--foreground`

<table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td><code>--character-sets-dir=caminho</code></td> </tr></tbody></table>

  Faz com que **ndbd** ou **ndbmtd**`) seja executado como um processo em primeiro plano, principalmente para fins de depuração. Esta opção implica na opção `--nodaemon`.

Esta opção não tem efeito ao executar **ndbd** ou **ndbmtd** em plataformas Windows).

* `--help`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--character-sets-dir=caminho</code></td> </tr></tbody></table>

  Exibir texto de ajuda e sair.

* `--initial`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--character-sets-dir=caminho</code></td> </tr></tbody></table>

  Instrui o **ndbd** a realizar um início inicial. Um início inicial apaga quaisquer arquivos criados para fins de recuperação por instâncias anteriores do **ndbd**. Também recria os arquivos de log de recuperação. Em alguns sistemas operacionais, esse processo pode levar um tempo substancial.

  A opção também causa a remoção de todos os arquivos de dados associados aos tablespaces de dados do NDB Cluster e os arquivos de log de desfazer associados aos grupos de arquivos de log que existiam anteriormente neste nó de dados (veja a Seção 25.6.11, “NDB Cluster Disk Data Tables”).

  Um início `--initial` deve ser usado *apenas* ao iniciar o processo **ndbd** em circunstâncias muito especiais; isso ocorre porque essa opção faz com que todos os arquivos sejam removidos do sistema de arquivos do NDB Cluster e todos os arquivos de log de redo sejam recriados. Essas circunstâncias estão listadas aqui:

  + Ao realizar uma atualização de software que alterou o conteúdo de quaisquer arquivos.

  + Ao reiniciar o nó com uma nova versão do **ndbd**.

+ Como medida de último recurso quando, por algum motivo, o reinício do nó ou o reinício do sistema falha repetidamente. Neste caso, esteja ciente de que este nó não pode mais ser usado para restaurar dados devido à destruição dos arquivos de dados.

Aviso

Para evitar a possibilidade de eventual perda de dados, é recomendável que você *não* use a opção `--initial` junto com `StopOnError = 0`. Em vez disso, defina `StopOnError` para 0 em `config.ini` apenas após o clúster ter sido iniciado, e então reinicie os nós de dados normalmente — ou seja, sem a opção `--initial`. Veja a descrição do parâmetro `StopOnError` para uma explicação detalhada sobre este problema. (Bug
#24945638)

O uso desta opção impede que os parâmetros de configuração `StartPartialTimeout` e `StartPartitionedTimeout` tenham qualquer efeito.

Importante

Esta opção *não* afeta os arquivos de backup que já foram criados pelo nó afetado.

Esta opção também não tem efeito na recuperação de dados por um nó de dados que está apenas começando (ou reiniciando) a partir de nós de dados que já estão em execução (a menos que também tenham sido iniciados com `--initial`, como parte de um reinício inicial). Esta recuperação de dados ocorre automaticamente e não requer intervenção do usuário em um NDB Cluster que está funcionando normalmente.

É permitido usar esta opção ao iniciar o clúster pela primeira vez (ou seja, antes que quaisquer arquivos de nó de dados tenham sido criados); no entanto, não é necessário fazê-lo.
* `--initial-start`

<table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tr><th>Formato de Linha de Comando</th><td><code>--character-sets-dir=caminho</code></td> </tr></tbody></table>

Esta opção é usada ao realizar um início inicial parcial do clúster. Cada nó deve ser iniciado com esta opção, assim como com a opção `--nowait-nodes`.

Suponha que você tenha um clúster de 4 nós cujos nós de dados têm os IDs 2, 3, 4 e 5, e que você deseja realizar um início inicial parcial usando apenas os nós 2, 4 e 5 — ou seja, omitindo o nó 3:

```
  $> ndbd --ndb-nodeid=2 --nowait-nodes=3 --initial-start
  $> ndbd --ndb-nodeid=4 --nowait-nodes=3 --initial-start
  $> ndbd --ndb-nodeid=5 --nowait-nodes=3 --initial-start
  ```

Ao usar esta opção, você também deve especificar o ID do nó para o nó de dados sendo iniciado com a opção `--ndb-nodeid`.

Importante

Não confunda esta opção com a opção `--nowait-nodes` para **ndb_mgmd**, que pode ser usada para habilitar o início de um clúster configurado com múltiplos servidores de gerenciamento sem que todos os servidores de gerenciamento estejam online.

* `--install[=name]`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--character-sets-dir=caminho</code></td> </tr></tbody></table>

  Faz com que o **ndbd** seja instalado como um serviço do Windows. Opcionalmente, você pode especificar um nome para o serviço; se não definido, o nome do serviço será `ndbd`. Embora seja preferível especificar outras opções do programa **ndbd** em um arquivo de configuração `my.ini` ou `my.cnf`, é possível usá-lo junto com `--install`. No entanto, nesse caso, a opção `--install` deve ser especificada primeiro, antes de quaisquer outras opções serem fornecidas, para que a instalação do serviço do Windows seja bem-sucedida.

Geralmente, não é aconselhável usar essa opção junto com a opção `--initial`, pois isso faz com que o sistema de arquivos do nó de dados seja apagado e reconstruído toda vez que o serviço é parado e reiniciado. Também é necessário tomar extremo cuidado se você pretende usar qualquer uma das outras opções do **ndbd** que afetam o início dos nós de dados — incluindo `--initial-start`, `--nostart` e `--nowait-nodes` — junto com `--install`, e você deve ter certeza absoluta de que entende completamente e permite quaisquer possíveis consequências de fazer isso.

A opção `--install` não tem efeito em plataformas que não são do Windows.

* `--logbuffer-size=#`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--character-sets-dir=caminho</code></td> </tr></tbody></table>

  Define o tamanho do buffer de log do nó de dados. Ao depurar com grandes quantidades de registro extra, é possível que o buffer de log fique sem espaço se houver muitos mensagens de log, caso em que algumas mensagens de log podem ser perdidas. Isso não deve ocorrer durante operações normais.

* `--login-path`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--character-sets-dir=caminho</code></td> </tr></tbody></table>

  Leia o caminho dado do arquivo de login.

* `--no-login-paths`

<table frame="box" rules="all" summary="Propriedades para connect-delay">
  <tr><th>Formato de linha de comando</th> <td><code>--connect-delay=#</code></td> </tr>
  <tr><th>Desatualizado</th> <td>Sim</td> </tr>
  <tr><th>Tipo</th> <td>Numérico</td> </tr>
  <tr><th>Valor padrão</th> <td><code>5</code></td> </tr>
  <tr><th>Valor mínimo</th> <td><code>0</code></td> </tr>
  <tr><th>Valor máximo</th> <td><code>3600</code></td> </tr>
</table>

Ignora opções de leitura do arquivo de caminho de login.

* `--ndb-connectstring`

<table frame="box" rules="all" summary="Propriedades para connect-delay">
  <tr><th>Formato de linha de comando</th> <td><code>--connect-delay=#</code></td> </tr>
  <tr><th>Desatualizado</th> <td>Sim</td> </tr>
  <tr><th>Tipo</th> <td>Numérico</td> </tr>
  <tr><th>Valor padrão</th> <td><code>5</code></td> </tr>
  <tr><th>Valor mínimo</th> <td><code>0</code></td> </tr>
  <tr><th>Valor máximo</th> <td><code>3600</code></td> </tr>
</table>

Define a string de conexão para conectar-se ao **ndb_mgmd**. Sintaxe: `[nodeid=id;][host=]hostname[:port]`. Sobrime entradas em `NDB_CONNECTSTRING` e `my.cnf`.

* `--ndb-log-timestamps`

<table frame="box" rules="all" summary="Propriedades para connect-delay">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code>--connect-delay=#</code></td>
  </tr>
  <tr>
    <th>Desatualizado</th>
    <td>Sim</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Numérico</td>
  </tr>
  <tr>
    <th>Valor padrão</th>
    <td><code>5</code></td>
  </tr>
  <tr>
    <th>Valor mínimo</th>
    <td><code>0</code></td>
  </tr>
  <tr>
    <th>Valor máximo</th>
    <td><code>3600</code></td>
  </tr>
  </table>
2

Define o formato usado para timestamps nos logs do nó. Este é um dos seguintes valores:

+ `LEGACY`: O fuso horário do sistema, com resolução em segundos.

Formato `RFC 3339`, com resolução em microsegundos.

+ `SYSTEM`: Formato `RFC 3339`.

`UTC` é o valor padrão no MySQL 9.5.

* `--ndb-mgmd-host`

<table frame="box" rules="all" summary="Propriedades para connect-delay">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code>--connect-delay=#</code></td>
  </tr>
  <tr>
    <th>Desatualizado</th>
    <td>Sim</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Numérico</td>
  </tr>
  <tr>
    <th>Valor padrão</th>
    <td><code>5</code></td>
  </tr>
  <tr>
    <th>Valor mínimo</th>
    <td><code>0</code></td>
  </tr>
  <tr>
    <th>Valor máximo</th>
    <td><code>3600</code></td>
  </tr>
  </table>
3

O mesmo que `--ndb-connectstring`.

* `--ndb-mgm-tls`

<table frame="box" rules="all" summary="Propriedades para connect-delay">
  <tr><th>Formato de Linha de Comando</th> <td><code>--connect-delay=#</code></td> </tr>
  <tr><th>Desatualizado</th> <td>Sim</td> </tr>
  <tr><th>Tipo</th> <td>Numérico</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>5</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr>
  <tr><th>Valor Máximo</th> <td><code>3600</code></td> </tr>
</table>

Define o nível de suporte TLS necessário para se conectar ao servidor de gerenciamento; um dos valores `relaxado` ou `estricto`. `relaxado` (o padrão) significa que uma conexão TLS é tentada, mas o sucesso não é necessário; `estricto` significa que a conexão TLS é necessária.

* `--ndb-nodeid`

<table frame="box" rules="all" summary="Propriedades para connect-delay">
  <tr><th>Formato de Linha de Comando</th> <td><code>--connect-delay=#</code></td> </tr>
  <tr><th>Desatualizado</th> <td>Sim</td> </tr>
  <tr><th>Tipo</th> <td>Numérico</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>5</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr>
  <tr><th>Valor Máximo</th> <td><code>3600</code></td> </tr>
</table>

Define o ID do nó para este nó, substituindo qualquer ID definido por `--ndb-connectstring`.

* `--ndb-optimized-node-selection`

<table frame="box" rules="all" summary="Propriedades para connect-delay">
  <tr><th>Formato de Linha de Comando</th> <td><code>--connect-delay=#</code></td> </tr>
  <tr><th>Desatualizado</th> <td>Sim</td> </tr>
  <tr><th>Tipo</th> <td>Numérico</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>5</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr>
  <tr><th>Valor Máximo</th> <td><code>3600</code></td> </tr>
</table>

  Ative otimizações para a seleção de nós para transações. Ativado por padrão; use `--skip-ndb-optimized-node-selection` para desativá-lo.

* `--ndb-tls-search-path`

  <table frame="box" rules="all" summary="Propriedades para connect-delay">
    <tr><th>Formato de Linha de Comando</th> <td><code>--connect-delay=#</code></td> </tr>
    <tr><th>Desatualizado</th> <td>Sim</td> </tr>
    <tr><th>Tipo</th> <td>Numérico</td> </tr>
    <tr><th>Valor Padrão</th> <td><code>5</code></td> </tr>
    <tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr>
    <tr><th>Valor Máximo</th> <td><code>3600</code></td> </tr>
  </table>

  Especifique uma lista de diretórios para pesquisar um arquivo CA. Em plataformas Unix, os nomes dos diretórios são separados por colchetes (`:`); em sistemas Windows, o caractere ponto e vírgula (`;`) é usado como separador. Uma referência de diretório pode ser relativa ou absoluta; pode conter uma ou mais variáveis de ambiente, cada uma denotada por um sinal de dólar prefixado (`$`), e expandida antes de uso.

A busca começa com o diretório nomeado mais à esquerda e prossegue da esquerda para a direita até que um arquivo seja encontrado. Uma string vazia indica um caminho de busca vazio, o que faz com que todas as buscas falhem. Uma string composta por um ponto único (`.`) indica que o caminho de busca é limitado ao diretório de trabalho atual.

Se não for fornecido um caminho de busca, o valor padrão integrado é usado. Esse valor depende da plataforma usada: no Windows, é `\ndb-tls`; em outras plataformas (incluindo Linux), é `$HOME/ndb-tls`. Isso pode ser substituído compilando o NDB Cluster usando `-DWITH_NDB_TLS_SEARCH_PATH`.

* `--nodaemon`

  <table frame="box" rules="all" summary="Propriedades para connect-delay"><tr><th>Formato de Linha de Comando</th> <td><code>--connect-delay=#</code></td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor Padrão</th> <td><code>5</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>3600</code></td> </tr></tbody></table>

  Previne que **ndbd** ou **ndbmtd**") sejam executados como um processo daemon. Esta opção substitui a opção `--daemon`. Isso é útil para redirecionar a saída para a tela ao depurar o binário.

  O comportamento padrão para **ndbd** e **ndbmtd**") no Windows é executar em primeiro plano, tornando esta opção desnecessária em plataformas Windows, onde não tem efeito.

* `--no-defaults`

<table frame="box" rules="all" summary="Propriedades para connect-delay">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code>--connect-delay=#</code></td>
  </tr>
  <tr>
    <th>Desativado</th>
    <td>Sim</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Numérico</td>
  </tr>
  <tr>
    <th>Valor padrão</th>
    <td><code>5</code></td>
  </tr>
  <tr>
    <th>Valor mínimo</th>
    <td><code>0</code></td>
  </tr>
  <tr>
    <th>Valor máximo</th>
    <td><code>3600</code></td>
  </tr>
</table>

9

Não leia opções padrão de nenhum arquivo de opção, exceto o arquivo de login.

* `--nostart`, `-n`

<table frame="box" rules="all" summary="Propriedades para connect-retries">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code>--connect-retries=#</code></td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Numérico</td>
  </tr>
  <tr>
    <th>Valor padrão</th>
    <td><code>12</code></td>
  </tr>
  <tr>
    <th>Valor mínimo</th>
    <td><code>-1</code></td>
  </tr>
  <tr>
    <th>Valor máximo</th>
    <td><code>65535</code></td>
  </tr>
</table>

0

Instrui o **ndbd** a não iniciar automaticamente. Quando esta opção é usada, o **ndbd** se conecta ao servidor de gerenciamento, obtém dados de configuração dele e inicializa objetos de comunicação. No entanto, ele não inicia o motor de execução até que seja solicitado especificamente pelo servidor de gerenciamento. Isso pode ser feito emitindo o comando apropriado `START` no cliente de gerenciamento (consulte a Seção 25.6.1, “Comandos no Cliente de Gerenciamento do NDB Cluster”).

[`--nowait-nodes=node_id_1[, node_id_2[, ...]]`](mysql-cluster-programs-ndbd.html#option_ndbd_nowait-nodes)

<table frame="box" rules="all" summary="Propriedades para connect-retries">
  <tr><th>Formato de Linha de Comando</th> <td><code>--connect-retries=#</code></td> </tr>
  <tr><th>Tipo</th> <td>Numérico</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>12</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>-1</code></td> </tr>
  <tr><th>Valor Máximo</th> <td><code>65535</code></td> </tr>
</table>

  Esta opção recebe uma lista de nós de dados para os quais o cluster não espera, antes de começar.

  Isso pode ser usado para iniciar o cluster em um estado particionado. Por exemplo, para iniciar o cluster com apenas metade dos nós de dados (nós 2, 3, 4 e 5) rodando em um cluster de 4 nós, você pode iniciar cada processo **ndbd** com `--nowait-nodes=3,5`. Neste caso, o cluster começa assim que os nós 2 e 4 se conectam e *não* espera `StartPartitionedTimeout` milissegundos para que os nós 3 e 5 se conectem, como faria caso contrário.

  Se você quisesse iniciar o mesmo cluster do exemplo anterior sem um **ndbd** (digamos, por exemplo, que a máquina do host do nó 3 sofreu uma falha de hardware), então inicie os nós 2, 4 e 5 com `--nowait-nodes=3`. Então o cluster começa assim que os nós 2, 4 e 5 se conectam e não espera que o nó 3 comece.

* `--print-defaults`

<table frame="box" rules="all" summary="Propriedades para connect-retries"><tr><th>Formato de linha de comando</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td><code>12</code></td> </tr><tr><th>Valor mínimo</th> <td><code>-1</code></td> </tr><tr><th>Valor máximo</th> <td><code>65535</code></td> </tr></table>

  Imprime a lista de argumentos do programa e encerra.

* `--remove[=nome]`

  <table frame="box" rules="all" summary="Propriedades para connect-retries"><tr><th>Formato de linha de comando</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td><code>12</code></td> </tr><tr><th>Valor mínimo</th> <td><code>-1</code></td> </tr><tr><th>Valor máximo</th> <td><code>65535</code></td> </tr></table>

  Faz com que o processo **ndbd** que foi instalado anteriormente como um serviço do Windows seja removido. Opcionalmente, você pode especificar um nome para o serviço a ser desinstalado; se não for definido, o nome do serviço será `ndbd`.

  A opção `--remove` não tem efeito em plataformas que não são do Windows.

* `--usage`

<table frame="box" rules="all" summary="Propriedades para connect-retries">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code>--connect-retries=#</code></td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Numérico</td>
  </tr>
  <tr>
    <th>Valor padrão</th>
    <td><code>12</code></td>
  </tr>
  <tr>
    <th>Valor mínimo</th>
    <td><code>-1</code></td>
  </tr>
  <tr>
    <th>Valor máximo</th>
    <td><code>65535</code></td>
  </tr>
</table>

  Exibir texto de ajuda e sair; o mesmo que --help.

* `--verbose`, `-v`

  Faz com que a saída de depuração extra seja escrita no log do nó.

  Você também pode usar `NODELOG DEBUG ON` e `NODELOG DEBUG OFF` para habilitar e desabilitar essa logagem extra enquanto o nó de dados estiver em execução.

* `--version`

  <table frame="box" rules="all" summary="Propriedades para connect-retries">
    <tr>
      <th>Formato de linha de comando</th>
      <td><code>--connect-retries=#</code></td>
    </tr>
    <tr>
      <th>Tipo</th>
      <td>Numérico</td>
    </tr>
    <tr>
      <th>Valor padrão</th>
      <td><code>12</code></td>
    </tr>
    <tr>
      <th>Valor mínimo</th>
      <td><code>-1</code></td>
    </tr>
    <tr>
      <th>Valor máximo</th>
      <td><code>65535</code></td>
    </tr>
  </table>

  Exibir informações da versão e sair.

**ndbd** gera um conjunto de arquivos de log que são colocados no diretório especificado por `DataDir` no arquivo de configuração `config.ini`.

Esses arquivos de log estão listados abaixo. *`node_id`* é e representa o identificador único do nó. Por exemplo, `ndb_2_error.log` é o log de erro gerado pelo nó de dados cujo ID de nó é `2`.

* `ndb_node_id_error.log` é um arquivo que contém registros de todos os travamentos que o processo **ndbd** a que se refere encontrou. Cada registro neste arquivo contém uma breve string de erro e uma referência a um arquivo de registro para esse travamento. Uma entrada típica neste arquivo pode aparecer como mostrado aqui:

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

  As listagens dos possíveis códigos de saída e mensagens de erro geradas quando um processo de nó de dados é desligado prematuramente podem ser encontradas em Mensagens de Erro do Nó de Dados.

  Importante

  *A última entrada no arquivo de log de erro não é necessariamente a mais recente* (nem é provável que seja). As entradas no log de erro não são listadas em ordem cronológica; elas correspondem ao ordem dos arquivos de registro conforme determinado no arquivo `ndb_node_id_trace.log.next` (veja abaixo). As entradas do log de erro são, portanto, sobrescritas de forma cíclica e não sequencial.

* `ndb_node_id_trace.log.trace_id` é um arquivo de registro que descreve exatamente o que aconteceu logo antes do erro ocorrer. Esta informação é útil para análise pela equipe de desenvolvimento do NDB Cluster.

É possível configurar o número desses arquivos de registro que são criados antes que os arquivos antigos sejam sobrescritos. *`trace_id`* é um número que é incrementado para cada arquivo de registro sucessivo.

* `ndb_node_id_trace.log.next` é o arquivo que mantém o controle do próximo número de arquivo de registro a ser atribuído.

* `ndb_node_id_out.log` é um arquivo que contém qualquer saída de dados gerada pelo processo **ndbd**. Este arquivo é criado apenas se **ndbd** for iniciado como um daemon, que é o comportamento padrão.

* `ndb_node_id.pid` é um arquivo que contém o ID de processo do processo **ndbd** quando iniciado como um daemon. Ele também funciona como um arquivo de bloqueio para evitar o início de nós com o mesmo identificador.

* `ndb_node_id_signal.log` é um arquivo usado apenas em versões de depuração do **ndbd**, onde é possível rastrear todas as mensagens de entrada, saída e internas com seus dados no processo **ndbd**.

Recomenda-se não usar um diretório montado através do NFS, pois, em alguns ambientes, isso pode causar problemas, onde o bloqueio no arquivo `.pid` permanece em vigor mesmo após o processo ter sido encerrado.

Para iniciar o **ndbd**, também pode ser necessário especificar o nome do host do servidor de gerenciamento e a porta na qual ele está ouvindo. Opcionalmente, também é possível especificar o ID do nó que o processo deve usar.

```
$> ndbd --connect-string="nodeid=2;host=ndb_mgmd.mysql.com:1186"
```

Consulte a Seção 25.4.3.3, “Strings de Conexão de NDB Cluster”, para obter informações adicionais sobre esse problema. Para mais informações sobre os parâmetros de configuração dos nós de dados, consulte a Seção 25.4.3.6, “Definindo Nodos de Dados de NDB Cluster”.

Quando o **ndbd** é iniciado, ele realmente inicia dois processos. O primeiro deles é chamado de “processo anjo”; seu único trabalho é descobrir quando o processo de execução foi concluído e, em seguida, reiniciar o processo **ndbd** se estiver configurado para fazer isso. Assim, se você tentar matar o **ndbd** usando o comando Unix **kill**, é necessário matar ambos os processos, começando com o processo anjo. O método preferido de término de um processo **ndbd** é usar o cliente de gerenciamento e parar o processo a partir daí.

O processo de execução utiliza um único fio para leitura, escrita e varredura de dados, bem como para todas as outras atividades. Esse fio é implementado de forma assíncrona para que possa lidar facilmente com milhares de ações concorrentes. Além disso, um fio de guarda-costas supervisiona o fio de execução para garantir que ele não fique preso em um loop infinito. Um conjunto de fios lida com o E/S de arquivos, com cada fio capaz de lidar com um arquivo aberto. Os fios também podem ser usados para conexões de transportador pelos transportadores no processo **ndbd**. Em um sistema multi-processador que realiza um grande número de operações (incluindo atualizações), o processo **ndbd** pode consumir até 2 CPUs, se permitido.

Para uma máquina com muitos CPUs, é possível usar vários processos **ndbd** que pertencem a diferentes grupos de nós; no entanto, tal configuração ainda é considerada experimental e não é suportada para o MySQL 9.5 em um ambiente de produção. Veja a Seção 25.2.7, “Limitações Conhecidas do NDB Cluster”.