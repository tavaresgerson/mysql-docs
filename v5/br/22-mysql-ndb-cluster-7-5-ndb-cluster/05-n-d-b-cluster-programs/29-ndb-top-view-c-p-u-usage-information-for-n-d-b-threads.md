### 21.5.29 ndb\_top — Visualizar informações de uso da CPU para os threads do NDB

**ndb\_top** exibe informações em execução no terminal sobre o uso da CPU por threads do NDB em um nó de dados do NDB Cluster. Cada thread é representada por duas linhas no resultado, a primeira mostrando estatísticas do sistema e a segunda mostrando as estatísticas medidas para a thread.

**ndb\_top** está disponível no MySQL NDB Cluster 7.6 (e versões posteriores).

#### Uso

```sql
ndb_top [-h hostname] [-t port] [-u user] [-p pass] [-n node_id]
```

**ndb\_top** se conecta a um servidor MySQL que está rodando como um nó SQL do clúster. Por padrão, ele tenta se conectar a um **mysqld** rodando em `localhost` e na porta 3306, como o usuário `root` do MySQL sem senha especificada. Você pode substituir o host e a porta padrão usando, respectivamente, as opções `--host` (`-h`) e `--port` (`-t`). Para especificar um usuário e senha do MySQL, use as opções `--user` (`-u`) e `--passwd` (`-p`). Esse usuário deve ser capaz de ler tabelas no banco de dados `ndbinfo` (**ndb\_top** usa informações do `ndbinfo.cpustat` e tabelas relacionadas).

Para obter mais informações sobre contas e senhas de usuários do MySQL, consulte Seção 6.2, “Controle de Acesso e Gerenciamento de Contas”.

A saída está disponível como texto simples ou um gráfico ASCII; você pode especificar isso usando as opções `--text` (`-x`) e `--graph` (`-g`), respectivamente. Esses dois modos de exibição fornecem as mesmas informações; eles podem ser usados simultaneamente. Pelo menos um modo de exibição deve estar em uso.

A exibição colorida do gráfico é suportada e ativada por padrão (`--color` ou opção `-c`). Com o suporte à cor ativado, a exibição do gráfico mostra o tempo de uso do usuário do sistema em azul, o tempo do sistema do sistema em verde e o tempo de inatividade como branco. Para a carga medida, o azul é usado para o tempo de execução, o amarelo para o tempo de envio, o vermelho para o tempo gasto em espera de buffer de envio cheio e espaços em branco para o tempo de inatividade. A porcentagem exibida na exibição do gráfico é a soma das porcentagens para todos os threads que não estão inativos. As cores atualmente não são configuráveis; você pode usar tons de cinza ao invés disso usando `--skip-color`.

A visualização ordenada (`--sort`, `-r`) é baseada no máximo da carga medida e na carga relatada pelo sistema operacional. A exibição dessas cargas pode ser habilitada ou desabilitada usando as opções `--measured-load` (`-m`) e `--os-load` (`-o`) (\[mysql-cluster-programs-ndb-top.html#option\_ndb\_top\_measured-load] e \[mysql-cluster-programs-ndb-top.html#option\_ndb\_top\_os-load]). A exibição de pelo menos uma dessas cargas deve ser habilitada.

O programa tenta obter estatísticas de um nó de dados com o ID de nó fornecido pela opção `--node-id` (mysql-cluster-programs-ndb-top.html#option\_ndb\_top\_node-id) (`-n`); se não for especificado, esse valor é 1. **ndb\_top** não pode fornecer informações sobre outros tipos de nós.

A visualização se ajusta à altura e largura da janela do terminal; a largura mínima suportada é de 76 caracteres.

Uma vez iniciado, **ndb\_top** funciona continuamente até ser forçado a sair; você pode encerrar o programa usando `Ctrl-C`. A exibição é atualizada uma vez por segundo; para definir um intervalo de atraso diferente, use `--sleep-time` (`-s`).

Nota

**ndb\_top** está disponível no macOS, Linux e Solaris. Atualmente, não é suportado nas plataformas Windows.

A tabela a seguir inclui todas as opções específicas do programa NDB Cluster **ndb\_top**. Descrições adicionais seguem a tabela.

**Tabela 21.45 Opções de linha de comando usadas com o programa ndb\_top**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th scope="col">Formato</th> <th scope="col">Descrição</th> <th scope="col">Adicionado, Descontinuado ou Removido</th> </tr></thead><tbody><tr> <th scope="row"><p>[[PH_HTML_CODE_<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_login-path">--login-path=path</a> </code>],</p><p> [[PH_HTML_CODE_<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_login-path">--login-path=path</a> </code>] </p></th> <td>Mostrar gráficos ASCII coloridos; use --skip-colors para desativá-los</td> <td><p>ADICIONADO: NDB 7.6.3</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[PH_HTML_CODE_<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_measured-load">-m</a> </code>] </p></th> <td>Leia o arquivo fornecido após os arquivos globais terem sido lidos</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[PH_HTML_CODE_<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_no-defaults">--no-defaults</a> </code>] </p></th> <td>Ler opções padrão a partir do arquivo fornecido apenas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[PH_HTML_CODE_<code class="option"><a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_node-id">--node-id=#</a></code>] </p></th> <td>Leia também grupos com concatenação(grupo, sufixo)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[PH_HTML_CODE_<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_node-id">-n
                #</a> </code>],</p><p> [[PH_HTML_CODE_<code class="option"><a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_os-load">--os-load</a></code>] </p></th> <td>Exiba os dados usando gráficos; use --skip-graphs para desabilitar</td> <td><p>ADICIONADO: NDB 7.6.3</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[PH_HTML_CODE_<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_os-load">-o</a> </code>] </p></th> <td>Mostrar informações de uso do programa</td> <td><p>ADICIONADO: NDB 7.6.3</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[PH_HTML_CODE_<code class="option"><a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_passwd">--passwd=password</a></code>],</p><p> [[PH_HTML_CODE_<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_passwd">-p password</a> </code>] </p></th> <td>Nome do host ou endereço IP do servidor MySQL para se conectar</td> <td><p>ADICIONADO: NDB 7.6.3</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_login-path">--login-path=path</a> </code>]] </p></th> <td>Leia o caminho fornecido a partir do arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_color">-c</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_login-path">--login-path=path</a> </code>],</p><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_measured-load">-m</a> </code>]] </p></th> <td>Mostrar carga medida por fio</td> <td><p>ADICIONADO: NDB 7.6.3</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_no-defaults">--no-defaults</a> </code>]] </p></th> <td>Não leia as opções padrão de nenhum arquivo de opção, exceto o arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_node-id">--node-id=#</a></code>]],</p><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_node-id">-n
                #</a> </code>]] </p></th> <td>Nodo de visualização com este ID de nó</td> <td><p>ADICIONADO: NDB 7.6.3</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_os-load">--os-load</a></code>]],</p><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_os-load">-o</a> </code>]] </p></th> <td>Mostrar a carga medida pelo sistema operacional</td> <td><p>ADICIONADO: NDB 7.6.3</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_passwd">--passwd=password</a></code>]],</p><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_passwd">-p password</a> </code>]] </p></th> <td>Conecte-se usando essa senha (mesma que a opção --password)</td> <td><p>ADICIONADO: NDB 7.6.3</p><p>REMOvido: NDB 7.6.4</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_defaults-extra-file">--defaults-extra-file=path</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_login-path">--login-path=path</a> </code>],</p><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_defaults-extra-file">--defaults-extra-file=path</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_login-path">--login-path=path</a> </code>] </p></th> <td>Conecte-se usando essa senha</td> <td><p>ADICIONADO: NDB 7.6.6</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_defaults-extra-file">--defaults-extra-file=path</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_measured-load">-m</a> </code>],</p><p>[[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_defaults-extra-file">--defaults-extra-file=path</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_no-defaults">--no-defaults</a> </code>] (&lt;=7.6.5),</p><p>[[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_defaults-extra-file">--defaults-extra-file=path</a> </code><code class="option"><a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_node-id">--node-id=#</a></code>] (&gt;=7.6.6)</p></th> <td>Número de porta a ser usado ao se conectar ao servidor MySQL</td> <td><p>ADICIONADO: NDB 7.6.3</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_defaults-extra-file">--defaults-extra-file=path</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_node-id">-n
                #</a> </code>] </p></th> <td>Imprimir a lista de argumentos do programa e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_defaults-extra-file">--defaults-extra-file=path</a> </code><code class="option"><a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_os-load">--os-load</a></code>],</p><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_defaults-extra-file">--defaults-extra-file=path</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_os-load">-o</a> </code>] </p></th> <td>Tempo de espera entre atualizações da tela, em segundos</td> <td><p>ADICIONADO: NDB 7.6.3</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_defaults-extra-file">--defaults-extra-file=path</a> </code><code class="option"><a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_passwd">--passwd=password</a></code>],</p><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_defaults-extra-file">--defaults-extra-file=path</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_passwd">-p password</a> </code>] </p></th> <td>Arquivo de soquete a ser usado para a conexão</td> <td><p>ADICIONADO: NDB 7.6.6</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_defaults-file">--defaults-file=path</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_login-path">--login-path=path</a> </code>],</p><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_defaults-file">--defaults-file=path</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_login-path">--login-path=path</a> </code>] </p></th> <td>Classifique os tópicos por uso; use --skip-sort para desativá-lo</td> <td><p>ADICIONADO: NDB 7.6.3</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_defaults-file">--defaults-file=path</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_measured-load">-m</a> </code>],</p><p>[[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_defaults-file">--defaults-file=path</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_no-defaults">--no-defaults</a> </code>] (&lt;=7.6.5),</p><p>[[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_defaults-file">--defaults-file=path</a> </code><code class="option"><a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_node-id">--node-id=#</a></code>] (&gt;=7.6.6)</p></th> <td>Exibir dados usando texto</td> <td><p>ADICIONADO: NDB 7.6.3</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_defaults-file">--defaults-file=path</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_node-id">-n
                #</a> </code>] </p></th> <td>Mostrar informações de uso do programa; o mesmo que --help</td> <td><p>ADICIONADO: NDB 7.6.3</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_defaults-file">--defaults-file=path</a> </code><code class="option"><a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_os-load">--os-load</a></code>],</p><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_defaults-file">--defaults-file=path</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_os-load">-o</a> </code>] </p></th> <td>Conecte-se como este usuário do MySQL</td> <td><p>ADICIONADO: NDB 7.6.3</p></td> </tr></tbody></table>

#### Opções adicionais

- `--color`, `-c`

  <table frame="box" rules="all" summary="Propriedades para cor"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--color</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.19-ndb-7.6.3</td> </tr></tbody></table>

  Mostre gráficos ASCII coloridos; use `--skip-colors` para desativá-los.

- `--defaults-extra-file`

  <table frame="box" rules="all" summary="Propriedades para defaults-extra-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--defaults-extra-file=path</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">[none]</code>]]</td> </tr></tbody></table>

  Leia o arquivo fornecido após a leitura dos arquivos globais.

- `--defaults-file`

  <table frame="box" rules="all" summary="Propriedades para arquivo de falhas"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--defaults-file=path</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">[none]</code>]]</td> </tr></tbody></table>

  Leia as opções padrão do arquivo fornecido.

- `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Propriedades para defaults-group-suffix"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--defaults-group-suffix=string</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">[none]</code>]]</td> </tr></tbody></table>

  Leia também grupos com concatenação (grupo, sufixo).

- `--graph`, `-g`

  <table frame="box" rules="all" summary="Propriedades para gráfico"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--graph</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.19-ndb-7.6.3</td> </tr></tbody></table>

  Exibir dados usando gráficos; use `--skip-graphs` para desabilitar. Esta opção ou `--text` deve ser verdadeira; ambas as opções podem ser verdadeiras.

- `--help`, `-?`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--help</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.19-ndb-7.6.3</td> </tr></tbody></table>

  Mostrar informações de uso do programa.

- `--host[`=*`nome]`*, `-h`

  <table frame="box" rules="all" summary="Propriedades para o anfitrião"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--host=string</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.19-ndb-7.6.3</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">localhost</code>]]</td> </tr></tbody></table>

  Nome do host ou endereço IP do servidor MySQL para se conectar.

- `--login-path`

  <table frame="box" rules="all" summary="Propriedades para o caminho de login"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--login-path=path</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">[none]</code>]]</td> </tr></tbody></table>

  Leia o caminho fornecido a partir do arquivo de login.

- `--measured-load`, `-m`

  <table frame="box" rules="all" summary="Propriedades para carga medida"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--measured-load</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.19-ndb-7.6.3</td> </tr></tbody></table>

  Mostre a carga medida por fio. Esta opção ou `--os-load` deve ser verdadeira; ambas as opções podem ser verdadeiras.

- `--no-defaults`

  <table frame="box" rules="all" summary="Propriedades para cor"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--color</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.19-ndb-7.6.3</td> </tr></tbody></table>0

  Não leia as opções padrão de nenhum arquivo de opção, exceto o arquivo de login.

- `--node-id[`=*`#`]*`, `-n\`

  <table frame="box" rules="all" summary="Propriedades para cor"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--color</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.19-ndb-7.6.3</td> </tr></tbody></table>1

  Acompanhe o nó de dados que tem esse ID de nó.

- `--os-load`, `-o`

  <table frame="box" rules="all" summary="Propriedades para cor"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--color</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.19-ndb-7.6.3</td> </tr></tbody></table>2

  Mostrar a carga medida pelo sistema operacional. Esta opção ou `--measured-load` deve ser verdadeira; ambas as opções podem ser verdadeiras.

- `--passwd[`=*`senha]`*, `-p`

  <table frame="box" rules="all" summary="Propriedades para cor"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--color</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.19-ndb-7.6.3</td> </tr></tbody></table>3

  Conecte-se a um servidor MySQL usando essa senha e o usuário MySQL especificado por `--user`. Sinônimo de `--password`.

  Essa senha está associada apenas a uma conta de usuário do MySQL e não está relacionada de nenhuma forma à senha usada com backups criptografados do `NDB`.

- `--password[`=*`senha]`*, `-p`

  <table frame="box" rules="all" summary="Propriedades para cor"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--color</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.19-ndb-7.6.3</td> </tr></tbody></table>4

  Conecte-se a um servidor MySQL usando essa senha e o usuário MySQL especificado por `--user`.

  Essa senha está associada apenas a uma conta de usuário do MySQL e não está relacionada de nenhuma forma à senha usada com backups criptografados do `NDB`.

- `--port[`=*`#]`*, `-P`

  <table frame="box" rules="all" summary="Propriedades para cor"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--color</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.19-ndb-7.6.3</td> </tr></tbody></table>5

  Número de porta a ser usado ao se conectar ao servidor MySQL.

  (Anteriormente, a forma abreviada dessa opção era `-t`, que foi reativada como a forma abreviada de `--text`.)

- `--print-defaults`

  <table frame="box" rules="all" summary="Propriedades para cor"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--color</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.19-ndb-7.6.3</td> </tr></tbody></table>6

  Imprima a lista de argumentos do programa e saia.

- `--sleep-time[`=*`segundos]`*, `-s`

  <table frame="box" rules="all" summary="Propriedades para cor"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--color</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.19-ndb-7.6.3</td> </tr></tbody></table>7

  Tempo de espera entre atualizações da tela, em segundos.

- `--socket=caminho/para/arquivo`, *`-S`*

  <table frame="box" rules="all" summary="Propriedades para cor"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--color</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.19-ndb-7.6.3</td> </tr></tbody></table>8

  Use o arquivo de soquete especificado para a conexão.

- `--sort`, `-r`

  <table frame="box" rules="all" summary="Propriedades para cor"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--color</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.19-ndb-7.6.3</td> </tr></tbody></table>9

  Classifique os tópicos por uso; use `--skip-sort` para desativá-lo.

- `--text`, `-t`

  <table frame="box" rules="all" summary="Propriedades para defaults-extra-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--defaults-extra-file=path</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">[none]</code>]]</td> </tr></tbody></table>0

  Exibir dados usando texto. Esta opção ou `--graph` deve ser verdadeira; ambas as opções podem ser verdadeiras.

  (A forma abreviada dessa opção era `-x` nas versões anteriores do NDB Cluster, mas isso não é mais suportado.)

- `--usage`

  <table frame="box" rules="all" summary="Propriedades para defaults-extra-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--defaults-extra-file=path</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">[none]</code>]]</td> </tr></tbody></table>1

  Exibir texto de ajuda e sair; o mesmo que `--help`.

- `--user[`=*`nome]`*, `-u`

  <table frame="box" rules="all" summary="Propriedades para defaults-extra-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--defaults-extra-file=path</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">[none]</code>]]</td> </tr></tbody></table>2

  Conecte-se como este usuário MySQL. Normalmente requer uma senha fornecida pela opção `--password`.

**Saída de exemplo.** A figura a seguir mostra **ndb\_top** em execução em uma janela de terminal em um sistema Linux com um nó de dados **ndbmtd** sob uma carga moderada. Aqui, o programa foi invocado usando **ndb\_top** `-n8` `-x` para fornecer saída tanto de texto quanto de gráfico:

**Figura 21.7 ndb\_top Executando no Terminal**

![Exibição do ndb\_top, rodando em uma janela de terminal. Mostra informações para cada nó, incluindo os recursos utilizados.](images/ndb-top-1.png)
