### 21.5.29 ndb_top — Visualizar informações de uso de CPU para NDB threads

[**ndb_top**](mysql-cluster-programs-ndb-top.html "21.5.29 ndb_top — View CPU usage information for NDB threads") exibe informações em tempo de execução no terminal sobre o uso de CPU por NDB threads em um data node do NDB Cluster. Cada thread é representada por duas linhas na saída, a primeira mostrando estatísticas do sistema, e a segunda mostrando as estatísticas medidas para a thread.

[**ndb_top**](mysql-cluster-programs-ndb-top.html "21.5.29 ndb_top — View CPU usage information for NDB threads") está disponível no MySQL NDB Cluster 7.6 (e posterior).

#### Uso

```sql
ndb_top [-h hostname] [-t port] [-u user] [-p pass] [-n node_id]
```

[**ndb_top**](mysql-cluster-programs-ndb-top.html "21.5.29 ndb_top — View CPU usage information for NDB threads") conecta-se a um MySQL Server rodando como um SQL node do Cluster. Por padrão, ele tenta se conectar a um [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") rodando em `localhost` e port 3306, como o MySQL user `root` sem password especificada. Você pode sobrescrever o Host e a Port padrão usando, respectivamente, [`--host`](mysql-cluster-programs-ndb-top.html#option_ndb_top_host) (`-h`) e [`--port`](mysql-cluster-programs-ndb-top.html#option_ndb_top_port) (`-t`). Para especificar um MySQL user e password, use as opções [`--user`](mysql-cluster-programs-ndb-top.html#option_ndb_top_user) (`-u`) e [`--passwd`](mysql-cluster-programs-ndb-top.html#option_ndb_top_passwd) (`-p`). Este user deve ser capaz de ler tables no Database [`ndbinfo`](mysql-cluster-ndbinfo.html "21.6.15 ndbinfo: The NDB Cluster Information Database") ([**ndb_top**](mysql-cluster-programs-ndb-top.html "21.5.29 ndb_top — View CPU usage information for NDB threads") usa informações de [`ndbinfo.cpustat`](mysql-cluster-ndbinfo-cpustat.html "21.6.15.11 The ndbinfo cpustat Table") e tables relacionadas).

Para mais informações sobre contas de MySQL user e passwords, veja [Seção 6.2, “Controle de Acesso e Gerenciamento de Contas”](access-control.html "6.2 Access Control and Account Management").

A saída está disponível como texto simples ou um gráfico ASCII; você pode especificar isso usando as opções [`--text`](mysql-cluster-programs-ndb-top.html#option_ndb_top_text) (`-x`) e [`--graph`](mysql-cluster-programs-ndb-top.html#option_ndb_top_graph) (`-g`), respectivamente. Esses dois modos de exibição fornecem a mesma informação; eles podem ser usados concomitantemente. Pelo menos um modo de exibição deve estar em uso.

A exibição colorida do gráfico é suportada e habilitada por padrão (opção [`--color`](mysql-cluster-programs-ndb-top.html#option_ndb_top_color) ou `-c`). Com o suporte a cores habilitado, a exibição do gráfico mostra o user time do OS em azul, o system time do OS em verde e o idle time como espaços em branco. Para o Load medido, azul é usado para tempo de execution, amarelo para tempo de send, vermelho para tempo gasto em send buffer full waits, e espaços em branco para idle time. A porcentagem mostrada na exibição do gráfico é a soma das porcentagens para todas as threads que não estão idle. As cores não são configuráveis atualmente; você pode usar tons de cinza (grayscale) em vez disso, usando `--skip-color`.

A visualização ordenada ([`--sort`](mysql-cluster-programs-ndb-top.html#option_ndb_top_sort), `-r`) é baseada no máximo do Load medido e do Load reportado pelo OS. A exibição desses pode ser habilitada e desabilitada usando as opções [`--measured-load`](mysql-cluster-programs-ndb-top.html#option_ndb_top_measured-load) (`-m`) e [`--os-load`](mysql-cluster-programs-ndb-top.html#option_ndb_top_os-load) (`-o`). A exibição de pelo menos um desses Loads deve estar habilitada.

O programa tenta obter estatísticas de um data node que tenha o node ID fornecido pela opção [`--node-id`](mysql-cluster-programs-ndb-top.html#option_ndb_top_node-id) (`-n`); se não for especificado, este é 1. [**ndb_top**](mysql-cluster-programs-ndb-top.html "21.5.29 ndb_top — View CPU usage information for NDB threads") não pode fornecer informações sobre outros tipos de nodes.

A visualização se ajusta à altura e largura da janela do terminal; a largura mínima suportada é de 76 caracteres.

Uma vez iniciado, [**ndb_top**](mysql-cluster-programs-ndb-top.html "21.5.29 ndb_top — View CPU usage information for NDB threads") é executado continuamente até ser forçado a sair; você pode encerrar o programa usando `Ctrl-C`. A exibição se atualiza uma vez por segundo; para definir um intervalo de delay diferente, use [`--sleep-time`](mysql-cluster-programs-ndb-top.html#option_ndb_top_sleep-time) (`-s`).

Note

[**ndb_top**](mysql-cluster-programs-ndb-top.html "21.5.29 ndb_top — View CPU usage information for NDB threads") está disponível no macOS, Linux e Solaris. Atualmente, não é suportado em plataformas Windows.

A tabela a seguir inclui todas as opções específicas do programa NDB Cluster [**ndb_top**](mysql-cluster-programs-ndb-top.html "21.5.29 ndb_top — View CPU usage information for NDB threads"). Descrições adicionais seguem a tabela.

**Tabela 21.45 Opções de linha de comando usadas com o programa ndb_top**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th>Formato</th> <th>Descrição</th> <th>Adicionado, Descontinuado ou Removido</th> </tr></thead><tbody><tr> <th><p> <code>--color</code>, </p><p> <code> -c </code> </p></th> <td>Mostrar gráficos ASCII em cores; use --skip-colors para desabilitar</td> <td><p> ADICIONADO: NDB 7.6.3 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --defaults-extra-file=path </code> </p></th> <td>Ler o arquivo fornecido após a leitura dos arquivos globais</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --defaults-file=path </code> </p></th> <td>Ler opções padrão somente do arquivo fornecido</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --defaults-group-suffix=string </code> </p></th> <td>Também ler grupos com concat(group, suffix)</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--graph</code>, </p><p> <code> -g </code> </p></th> <td>Exibir dados usando gráficos; use --skip-graphs para desabilitar</td> <td><p> ADICIONADO: NDB 7.6.3 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --help </code> </p></th> <td>Mostrar informações de uso do programa</td> <td><p> ADICIONADO: NDB 7.6.3 </p></td> </tr></tbody><tbody><tr> <th><p> <code>--host=string</code>, </p><p> <code> -h string </code> </p></th> <td>Host name ou endereço IP do MySQL Server para conectar</td> <td><p> ADICIONADO: NDB 7.6.3 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --login-path=path </code> </p></th> <td>Ler o path fornecido do login file</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--measured-load</code>, </p><p> <code> -m </code> </p></th> <td>Mostrar Load medido por thread</td> <td><p> ADICIONADO: NDB 7.6.3 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --no-defaults </code> </p></th> <td>Não ler opções padrão de nenhum option file além do login file</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--node-id=#</code>, </p><p> <code> <a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_node-id">-n
                #</a> </code> </p></th> <td>Observar o node que possui este node ID</td> <td><p> ADICIONADO: NDB 7.6.3 </p></td> </tr></tbody><tbody><tr> <th><p> <code>--os-load</code>, </p><p> <code> -o </code> </p></th> <td>Mostrar Load medido pelo operating system (OS)</td> <td><p> ADICIONADO: NDB 7.6.3 </p></td> </tr></tbody><tbody><tr> <th><p> <code>--passwd=password</code>, </p><p> <code> -p password </code> </p></th> <td>Conectar usando este password (o mesmo que a opção --password)</td> <td><p> ADICIONADO: NDB 7.6.3 </p><p> REMOVIDO: NDB 7.6.4 </p></td> </tr></tbody><tbody><tr> <th><p> <code>--password=password</code>, </p><p> <code> -p password </code> </p></th> <td>Conectar usando este password</td> <td><p> ADICIONADO: NDB 7.6.6 </p></td> </tr></tbody><tbody><tr> <th><p> <code>--port=#</code>, </p><p> <code><a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_port">-t
                #</a></code> (&lt;=7.6.5), </p><p> <code><a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_port">-P
                #</a></code> (&gt;=7.6.6) </p></th> <td>Número da Port a ser usada ao conectar ao MySQL Server</td> <td><p> ADICIONADO: NDB 7.6.3 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --print-defaults </code> </p></th> <td>Imprimir a lista de argumentos do programa e sair</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--sleep-time=#</code>, </p><p> <code> <a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_sleep-time">-s
                #</a> </code> </p></th> <td>Tempo de espera entre atualizações da exibição, em segundos</td> <td><p> ADICIONADO: NDB 7.6.3 </p></td> </tr></tbody><tbody><tr> <th><p> <code>--socket=path</code>, </p><p> <code> -S path </code> </p></th> <td>Socket file a ser usado para a conexão</td> <td><p> ADICIONADO: NDB 7.6.6 </p></td> </tr></tbody><tbody><tr> <th><p> <code>--sort</code>, </p><p> <code> -r </code> </p></th> <td>Ordenar threads por uso; use --skip-sort para desabilitar</td> <td><p> ADICIONADO: NDB 7.6.3 </p></td> </tr></tbody><tbody><tr> <th><p> <code>--text</code>, </p><p> <code>-x</code> (&lt;=7.6.5), </p><p> <code>-t</code> (&gt;=7.6.6) </p></th> <td>Exibir dados usando texto</td> <td><p> ADICIONADO: NDB 7.6.3 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --usage </code> </p></th> <td>Mostrar informações de uso do programa; o mesmo que --help</td> <td><p> ADICIONADO: NDB 7.6.3 </p></td> </tr></tbody><tbody><tr> <th><p> <code>--user=name</code>, </p><p> <code> -u name </code> </p></th> <td>Conectar como este MySQL user</td> <td><p> ADICIONADO: NDB 7.6.3 </p></td> </tr></tbody></table>

#### Opções Adicionais

* `--color`, `-c`

  <table frame="box" rules="all" summary="Propriedades para color"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--color</code></td> </tr><tr><th>Introduzido</th> <td>5.7.19-ndb-7.6.3</td> </tr></tbody></table>

  Mostrar gráficos ASCII em cores; use `--skip-colors` para desabilitar.

* `--defaults-extra-file`

  <table frame="box" rules="all" summary="Propriedades para defaults-extra-file"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--defaults-extra-file=path</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  Ler o arquivo fornecido após a leitura dos arquivos globais.

* `--defaults-file`

  <table frame="box" rules="all" summary="Propriedades para defaults-file"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--defaults-file=path</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  Ler opções padrão somente do arquivo fornecido.

* `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Propriedades para defaults-group-suffix"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--defaults-group-suffix=string</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  Também ler grupos com concat(group, suffix).

* `--graph`, `-g`

  <table frame="box" rules="all" summary="Propriedades para graph"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--graph</code></td> </tr><tr><th>Introduzido</th> <td>5.7.19-ndb-7.6.3</td> </tr></tbody></table>

  Exibir dados usando gráficos; use `--skip-graphs` para desabilitar. Esta opção ou [`--text`](mysql-cluster-programs-ndb-top.html#option_ndb_top_text) deve ser verdadeira; ambas as opções podem ser verdadeiras.

* `--help`, `-?`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--help</code></td> </tr><tr><th>Introduzido</th> <td>5.7.19-ndb-7.6.3</td> </tr></tbody></table>

  Mostrar informações de uso do programa.

* `--host[`=*`name]`*, `-h`

  <table frame="box" rules="all" summary="Propriedades para host"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--host=string</code></td> </tr><tr><th>Introduzido</th> <td>5.7.19-ndb-7.6.3</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>localhost</code></td> </tr></tbody></table>

  Host name ou endereço IP do MySQL Server para conectar.

* `--login-path`

  <table frame="box" rules="all" summary="Propriedades para login-path"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--login-path=path</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  Ler o path fornecido do login file.

* `--measured-load`, `-m`

  <table frame="box" rules="all" summary="Propriedades para measured-load"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--measured-load</code></td> </tr><tr><th>Introduzido</th> <td>5.7.19-ndb-7.6.3</td> </tr></tbody></table>

  Mostrar Load medido por thread. Esta opção ou [`--os-load`](mysql-cluster-programs-ndb-top.html#option_ndb_top_os-load) deve ser verdadeira; ambas as opções podem ser verdadeiras.

* `--no-defaults`

  <table frame="box" rules="all" summary="Propriedades para color"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--color</code></td> </tr><tr><th>Introduzido</th> <td>5.7.19-ndb-7.6.3</td> </tr></tbody></table>

  Não ler opções padrão de nenhum option file além do login file.

* `--node-id[`=*`#]`*, `-n`

  <table frame="box" rules="all" summary="Propriedades para color"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--color</code></td> </tr><tr><th>Introduzido</th> <td>5.7.19-ndb-7.6.3</td> </tr></tbody></table>

  Observar o data node que possui este node ID.

* `--os-load`, `-o`

  <table frame="box" rules="all" summary="Propriedades para color"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--color</code></td> </tr><tr><th>Introduzido</th> <td>5.7.19-ndb-7.6.3</td> </tr></tbody></table>

  Mostrar Load medido pelo operating system (OS). Esta opção ou [`--measured-load`](mysql-cluster-programs-ndb-top.html#option_ndb_top_measured-load) deve ser verdadeira; ambas as opções podem ser verdadeiras.

* `--passwd[`=*`password]`*, `-p`

  <table frame="box" rules="all" summary="Propriedades para color"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--color</code></td> </tr><tr><th>Introduzido</th> <td>5.7.19-ndb-7.6.3</td> </tr></tbody></table>

  Conectar a um MySQL Server usando este password e o MySQL user especificado por [`--user`](mysql-cluster-programs-ndb-top.html#option_ndb_top_user). Sinônimo para [`--password`](mysql-cluster-programs-ndb-top.html#option_ndb_top_password).

  Este password está associado apenas a uma conta de MySQL user e não está relacionada de forma alguma ao password usado com backups `NDB` criptografados.

* `--password[`=*`password]`*, `-p`

  <table frame="box" rules="all" summary="Propriedades para color"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--color</code></td> </tr><tr><th>Introduzido</th> <td>5.7.19-ndb-7.6.3</td> </tr></tbody></table>

  Conectar a um MySQL Server usando este password e o MySQL user especificado por [`--user`](mysql-cluster-programs-ndb-top.html#option_ndb_top_user).

  Este password está associado apenas a uma conta de MySQL user e não está relacionada de forma alguma ao password usado com backups `NDB` criptografados.

* `--port[`=*`#]`*, `-P`

  <table frame="box" rules="all" summary="Propriedades para color"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--color</code></td> </tr><tr><th>Introduzido</th> <td>5.7.19-ndb-7.6.3</td> </tr></tbody></table>

  Número da Port a ser usada ao conectar ao MySQL Server.

  (Anteriormente, a forma abreviada para esta opção era `-t`, que foi reutilizada como a forma abreviada de [`--text`](mysql-cluster-programs-ndb-top.html#option_ndb_top_text).)

* `--print-defaults`

  <table frame="box" rules="all" summary="Propriedades para color"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--color</code></td> </tr><tr><th>Introduzido</th> <td>5.7.19-ndb-7.6.3</td> </tr></tbody></table>

  Imprimir a lista de argumentos do programa e sair.

* `--sleep-time[`=*`seconds]`*, `-s`

  <table frame="box" rules="all" summary="Propriedades para color"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--color</code></td> </tr><tr><th>Introduzido</th> <td>5.7.19-ndb-7.6.3</td> </tr></tbody></table>

  Tempo de espera entre atualizações da exibição, em segundos.

* `--socket=path/to/file`, *`-S`*

  <table frame="box" rules="all" summary="Propriedades para color"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--color</code></td> </tr><tr><th>Introduzido</th> <td>5.7.19-ndb-7.6.3</td> </tr></tbody></table>

  Usar o socket file especificado para a conexão.

* `--sort`, `-r`

  <table frame="box" rules="all" summary="Propriedades para color"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--color</code></td> </tr><tr><th>Introduzido</th> <td>5.7.19-ndb-7.6.3</td> </tr></tbody></table>

  Ordenar threads por uso; use `--skip-sort` para desabilitar.

* `--text`, `-t`

  <table frame="box" rules="all" summary="Propriedades para defaults-extra-file"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--defaults-extra-file=path</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  Exibir dados usando texto. Esta opção ou [`--graph`](mysql-cluster-programs-ndb-top.html#option_ndb_top_graph) deve ser verdadeira; ambas as opções podem ser verdadeiras.

  (A forma abreviada para esta opção era `-x` em versões anteriores do NDB Cluster, mas não é mais suportada.)

* `--usage`

  <table frame="box" rules="all" summary="Propriedades para defaults-extra-file"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--defaults-extra-file=path</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  Exibir o texto de ajuda e sair; o mesmo que [`--help`](mysql-cluster-programs-ndb-top.html#option_ndb_top_help).

* `--user[`=*`name]`*, `-u`

  <table frame="box" rules="all" summary="Propriedades para defaults-extra-file"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--defaults-extra-file=path</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  Conectar como este MySQL user. Normalmente requer um password fornecido pela opção [`--password`](mysql-cluster-programs-ndb-top.html#option_ndb_top_password).

**Exemplo de Saída.** A figura a seguir mostra [**ndb_top**](mysql-cluster-programs-ndb-top.html "21.5.29 ndb_top — View CPU usage information for NDB threads") rodando em uma janela de terminal em um sistema Linux com um data node [**ndbmtd**](mysql-cluster-programs-ndbmtd.html "21.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)") sob um Load moderado. Aqui, o programa foi invocado usando [**ndb_top**](mysql-cluster-programs-ndb-top.html "21.5.29 ndb_top — View CPU usage information for NDB threads") [`-n8`](mysql-cluster-programs-ndb-top.html#option_ndb_top_node-id) [`-x`](mysql-cluster-programs-ndb-top.html#option_ndb_top_text) para fornecer saída de texto e gráfico:

**Figura 21.7 ndb_top Rodando no Terminal**

![Visualização do ndb_top, rodando em uma janela de terminal. Mostra informações para cada node, incluindo os resources utilizados.](images/ndb-top-1.png)