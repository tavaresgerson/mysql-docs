### 25.5.29 ndb\_top — Visualizar informações de uso da CPU para os threads do NDB

O **ndb\_top** exibe informações em execução no terminal sobre o uso da CPU por threads do NDB em um nó de dados do NDB Cluster. Cada thread é representada por duas linhas na saída, a primeira mostrando estatísticas do sistema e a segunda mostrando as estatísticas medidas para a thread.

O **ndb\_top** está disponível a partir do MySQL NDB Cluster 7.6.3.

#### Uso

```
ndb_top [-h hostname] [-t port] [-u user] [-p pass] [-n node_id]
```

O **ndb\_top** se conecta a um servidor MySQL que está rodando como um nó SQL do clúster. Por padrão, ele tenta se conectar a um **mysqld** que está rodando no `localhost` e na porta 3306, como usuário `root` do MySQL sem senha especificada. Você pode substituir o host e a porta padrão usando, respectivamente, `--host` (`-h`) e `--port` (`-t`). Para especificar um usuário e senha do MySQL, use as opções `--user` (`-u`) e `--passwd` (`-p`). Esse usuário deve ser capaz de ler tabelas no banco de dados `ndbinfo` (o **ndb\_top** usa informações do `ndbinfo.cpustat` e tabelas relacionadas).

Para obter mais informações sobre contas e senhas de usuários do MySQL, consulte a Seção 8.2, “Controle de Acesso e Gerenciamento de Contas”.

A saída está disponível como texto simples ou um gráfico ASCII; você pode especificar isso usando as opções `--text` (`-x`) e `--graph` (`-g`), respectivamente. Esses dois modos de exibição fornecem as mesmas informações; eles podem ser usados simultaneamente. Pelo menos um modo de exibição deve estar em uso.

A exibição colorida do gráfico é suportada e ativada por padrão (opção `--color` ou `-c`). Com o suporte à cor ativado, a exibição do gráfico mostra o tempo de uso do usuário do SO em azul, o tempo do sistema do SO em verde e o tempo de inatividade como branco. Para a carga medida, o azul é usado para o tempo de execução, o amarelo para o tempo de envio, o vermelho para o tempo gasto em espera de buffer de envio cheio e espaços em branco para o tempo de inatividade. A porcentagem exibida na exibição do gráfico é a soma das porcentagens para todos os threads que não estão inativos. As cores atualmente não são configuráveis; você pode usar tons de cinza ao invés disso usando `--skip-color`.

A visualização ordenada (`--sort`, `-r`) é baseada no máximo da carga medida e na carga reportada pelo SO. A exibição desses valores pode ser habilitada ou desabilitada usando as opções `--measured-load` (`-m`) e `--os-load` (`-o`). A exibição de pelo menos um desses valores deve ser habilitada.

O programa tenta obter estatísticas de um nó de dados com o ID de nó fornecido pela opção `--node-id` (`-n`). Se não for especificado, esse valor é 1. **ndb\_top** não pode fornecer informações sobre outros tipos de nós.

A visualização se ajusta à altura e largura da janela do terminal; a largura mínima suportada é de 76 caracteres.

Uma vez iniciado, o **ndb\_top** funciona continuamente até ser forçado a sair; você pode encerrar o programa usando `Ctrl-C`. A exibição é atualizada uma vez por segundo; para definir um intervalo de atraso diferente, use `--sleep-time` (`-s`).

Nota

O **ndb\_top** está disponível no macOS, Linux e Solaris. Ele não é atualmente suportado nas plataformas Windows.

A tabela a seguir inclui todas as opções específicas do programa NDB Cluster **ndb\_top**. Descrições adicionais seguem a tabela.

**Tabela 25.50 Opções de linha de comando usadas com o programa ndb\_top**

<table frame="box" rules="all"><thead><tr> <th scope="col">Formato</th> <th scope="col">Descrição</th> <th scope="col">Adicionado, Descontinuado ou Removido</th> </tr></thead><tbody><tr> <th><p>[[PH_HTML_CODE_<code> --login-path=path </code>],</p><p> [[PH_HTML_CODE_<code> --login-path=path </code>] </p></th> <td>Mostrar gráficos ASCII coloridos; use --skip-colors para desativá-los</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[PH_HTML_CODE_<code> -m </code>] </p></th> <td>Leia o arquivo fornecido após os arquivos globais terem sido lidos</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[PH_HTML_CODE_<code> --no-defaults </code>] </p></th> <td>Ler opções padrão a partir do arquivo fornecido apenas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[PH_HTML_CODE_<code>--node-id=#</code>] </p></th> <td>Leia também grupos com concatenação(grupo, sufixo)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p>[[PH_HTML_CODE_<code> <a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_node-id">-n
                #</a> </code>],</p><p> [[PH_HTML_CODE_<code>--os-load</code>] </p></th> <td>Exiba os dados usando gráficos; use --skip-graphs para desabilitar</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[PH_HTML_CODE_<code> -o </code>] </p></th> <td>Mostrar informações de uso do programa</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p>[[PH_HTML_CODE_<code>--password=password</code>],</p><p> [[PH_HTML_CODE_<code> -p password </code>] </p></th> <td>Nome do host ou endereço IP do servidor MySQL para se conectar</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --login-path=path </code>]] </p></th> <td>Leia o caminho fornecido a partir do arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code> -c </code><code> --login-path=path </code>],</p><p> [[<code> -m </code>]] </p></th> <td>Mostrar carga medida por fio</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --no-defaults </code>]] </p></th> <td>Não leia as opções padrão de nenhum arquivo de opção, exceto o arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code>--node-id=#</code>]],</p><p> [[<code> <a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_node-id">-n
                #</a> </code>]] </p></th> <td>Nodo de visualização com este ID de nó</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code>--os-load</code>]],</p><p> [[<code> -o </code>]] </p></th> <td>Mostrar a carga medida pelo sistema operacional</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code>--password=password</code>]],</p><p> [[<code> -p password </code>]] </p></th> <td>Conecte-se usando essa senha</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code> --defaults-extra-file=path </code><code> --login-path=path </code>],</p><p>[[<code> --defaults-extra-file=path </code><code> --login-path=path </code>] (&gt;=7.6.6)</p></th> <td>Número de porta a ser usado ao se conectar ao servidor MySQL</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --defaults-extra-file=path </code><code> -m </code>] </p></th> <td>Imprimir a lista de argumentos do programa e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code> --defaults-extra-file=path </code><code> --no-defaults </code>],</p><p> [[<code> --defaults-extra-file=path </code><code>--node-id=#</code>] </p></th> <td>Tempo de espera entre atualizações da tela, em segundos</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code> --defaults-extra-file=path </code><code> <a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_node-id">-n
                #</a> </code>],</p><p> [[<code> --defaults-extra-file=path </code><code>--os-load</code>] </p></th> <td>Arquivo de soquete a ser usado para a conexão</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code> --defaults-extra-file=path </code><code> -o </code>],</p><p> [[<code> --defaults-extra-file=path </code><code>--password=password</code>] </p></th> <td>Classifique os tópicos por uso; use --skip-sort para desativá-lo</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code> --defaults-extra-file=path </code><code> -p password </code>],</p><p>[[<code> --defaults-file=path </code><code> --login-path=path </code>] (&gt;=7.6.6)</p></th> <td>Exibir dados usando texto</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --defaults-file=path </code><code> --login-path=path </code>] </p></th> <td>Mostrar informações de uso do programa; o mesmo que --help</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code> --defaults-file=path </code><code> -m </code>],</p><p> [[<code> --defaults-file=path </code><code> --no-defaults </code>] </p></th> <td>Conecte-se como este usuário do MySQL</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody></table>

#### Opções adicionais

- `--color`, `-c`

  <table summary="Propriedades para cor"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--color</code>]]</td> </tr></tbody></table>

  Mostrar gráficos ASCII coloridos; use `--skip-colors` para desativá-los.

- `--defaults-extra-file`

  <table summary="Propriedades para defaults-extra-file"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--defaults-extra-file=path</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>

  Leia o arquivo fornecido após a leitura dos arquivos globais.

- `--defaults-file`

  <table summary="Propriedades para arquivo de falhas"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--defaults-file=path</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>

  Leia as opções padrão do arquivo fornecido.

- `--defaults-group-suffix`

  <table summary="Propriedades para defaults-group-suffix"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--defaults-group-suffix=string</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>

  Leia também grupos com concatenação (grupo, sufixo).

- `--graph`, `-g`

  <table summary="Propriedades para gráfico"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--graph</code>]]</td> </tr></tbody></table>

  Exiba os dados usando gráficos; use `--skip-graphs` para desabilitar. Esta opção ou `--text` deve ser verdadeira; ambas as opções podem ser verdadeiras.

- `--help`, `-?`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>

  Mostrar informações de uso do programa.

- \[`--host`=`name]`, `-h`

  <table summary="Propriedades para o anfitrião"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--host=string</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>localhost</code>]]</td> </tr></tbody></table>

  Nome do host ou endereço IP do servidor MySQL para se conectar.

- `--login-path`

  <table summary="Propriedades para o caminho de login"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--login-path=path</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>

  Leia o caminho fornecido a partir do arquivo de login.

- `--measured-load`, `-m`

  <table summary="Propriedades para carga medida"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--measured-load</code>]]</td> </tr></tbody></table>

  Mostrar carga medida por fio. Esta opção ou `--os-load` deve ser verdadeira; ambas as opções podem ser verdadeiras.

- `--no-defaults`

  <table summary="Propriedades para cor"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--color</code>]]</td> </tr></tbody></table>0

  Não leia as opções padrão de nenhum arquivo de opção, exceto o arquivo de login.

- \[`--node-id`=`#]`, `-n`

  <table summary="Propriedades para cor"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--color</code>]]</td> </tr></tbody></table>1

  Acompanhe o nó de dados que tem esse ID de nó.

- `--os-load`, `-o`

  <table summary="Propriedades para cor"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--color</code>]]</td> </tr></tbody></table>2

  Mostrar a carga medida pelo sistema operacional. Esta opção ou `--measured-load` deve ser verdadeira; ambas as opções podem ser verdadeiras.

- \[`--password`=`password]`, `-p`

  <table summary="Propriedades para cor"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--color</code>]]</td> </tr></tbody></table>3

  Conecte-se a um servidor MySQL usando essa senha e o usuário MySQL especificado por `--user`.

  Essa senha está associada apenas a uma conta de usuário do MySQL e não está relacionada de nenhuma forma à senha usada com os backups criptografados `NDB`.

- \[`--port`=`#]`, `-P`

  <table summary="Propriedades para cor"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--color</code>]]</td> </tr></tbody></table>4

  Número de porta a ser usado ao se conectar ao servidor MySQL.

  (Anteriormente, a forma abreviada para essa opção era `-t`, que foi reativada como a forma abreviada de `--text`.)

- `--print-defaults`

  <table summary="Propriedades para cor"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--color</code>]]</td> </tr></tbody></table>5

  Imprima a lista de argumentos do programa e saia.

- \[`--sleep-time`=`seconds]`, `-s`

  <table summary="Propriedades para cor"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--color</code>]]</td> </tr></tbody></table>6

  Tempo de espera entre atualizações da tela, em segundos.

- `--socket=path/to/file`, `-S`

  <table summary="Propriedades para cor"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--color</code>]]</td> </tr></tbody></table>7

  Use o arquivo de soquete especificado para a conexão.

- `--sort`, `-r`

  <table summary="Propriedades para cor"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--color</code>]]</td> </tr></tbody></table>8

  Classifique os tópicos por uso; use `--skip-sort` para desabilitar.

- `--text`, `-t`

  <table summary="Propriedades para cor"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--color</code>]]</td> </tr></tbody></table>9

  Exibir dados usando texto. Esta opção ou `--graph` deve ser verdadeira; ambas as opções podem ser verdadeiras.

  (A forma abreviada para essa opção era `-x` nas versões anteriores do NDB Cluster, mas isso não é mais suportado.)

- `--usage`

  <table summary="Propriedades para defaults-extra-file"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--defaults-extra-file=path</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>0

  Exibir texto de ajuda e sair; o mesmo que `--help`.

- \[`--user`=`name]`, `-u`

  <table summary="Propriedades para defaults-extra-file"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--defaults-extra-file=path</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>1

  Conecte-se como este usuário MySQL. Normalmente requer uma senha fornecida pela opção `--password`.

**Saída de exemplo.** A figura a seguir mostra o **ndb\_top** em execução em uma janela de terminal em um sistema Linux com um nó de dados **ndbmtd**") sob uma carga moderada. Aqui, o programa foi invocado usando **ndb\_top** `-n8` `-x` para fornecer saída tanto de texto quanto de gráfico:

**Figura 25.5 ndb\_top Executando no Terminal**

![Display from ndb\_top, running in a terminal window. Shows information for each node, including the utilized resources.](images/ndb-top-1.png)

A partir da versão NDB 8.0.20, o **ndb\_top** também mostra os tempos de rotação dos threads, exibidos em verde.
