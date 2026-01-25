### 21.5.4 ndb_mgmd — O Daemon do Servidor de Gerenciamento do NDB Cluster

O servidor de gerenciamento é o processo que lê o arquivo de configuração do Cluster e distribui essa informação para todos os nodes no Cluster que a solicitam. Ele também mantém um log das atividades do Cluster. Clientes de gerenciamento podem se conectar ao servidor de gerenciamento e verificar o status do Cluster.

As opções que podem ser usadas com [**ndb_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — O Daemon do Servidor de Gerenciamento do NDB Cluster") são mostradas na tabela a seguir. Descrições adicionais seguem a tabela.

**Tabela 21.24 Opções de linha de comando usadas com o programa ndb_mgmd**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th>Formato</th> <th>Descrição</th> <th>Adicionado, Descontinuado ou Removido</th> </tr></thead><tbody><tr> <th><p> <code> --bind-address=host </code> </p></th> <td>Endereço de bind local</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --character-sets-dir=path </code> </p></th> <td>Diretório contendo conjuntos de caracteres</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --config-cache[=TRUE|FALSE] </code> </p></th> <td>Habilita o cache de configuração do servidor de gerenciamento; verdadeiro por padrão</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--config-file=file</code>, </p><p> <code> -f file </code> </p></th> <td>Especifica o arquivo de configuração do Cluster; também especifique --reload ou --initial para sobrescrever o cache de configuração, se presente</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--configdir=directory</code>, </p><p> <code> --config-dir=directory </code> </p></th> <td>Especifica o diretório de cache de configuração do servidor de gerenciamento do Cluster</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --connect-retries=# </code> </p></th> <td>Número de vezes para tentar a conexão novamente antes de desistir</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --connect-retry-delay=# </code> </p></th> <td>Número de segundos para esperar entre as tentativas de contato com o servidor de gerenciamento</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--connect-string=connection_string</code>, </p><p> <code> -c connection_string </code> </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --core-file </code> </p></th> <td>Escreve um core file em caso de erro; usado em debugging</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--daemon</code>, </p><p> <code> -d </code> </p></th> <td>Executa ndb_mgmd em modo daemon (padrão)</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --defaults-extra-file=path </code> </p></th> <td>Lê o arquivo fornecido após a leitura dos arquivos globais</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --defaults-file=path </code> </p></th> <td>Lê opções padrão apenas do arquivo fornecido</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --defaults-group-suffix=string </code> </p></th> <td>Também lê grupos com concat(grupo, sufixo)</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--help</code>, </p><p> <code> -? </code> </p></th> <td>Exibe o texto de ajuda e sai</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --initial </code> </p></th> <td>Faz com que o servidor de gerenciamento recarregue os dados de configuração do arquivo de configuração, ignorando o cache de configuração</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --install[=name] </code> </p></th> <td>Usado para instalar o processo do servidor de gerenciamento como um serviço Windows; não se aplica a outras plataformas</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --interactive </code> </p></th> <td>Executa ndb_mgmd em modo interativo (não suportado oficialmente em produção; apenas para fins de teste)</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --log-name=name </code> </p></th> <td>Nome a ser usado ao escrever mensagens de log do Cluster aplicáveis a este node</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --login-path=path </code> </p></th> <td>Lê o caminho fornecido a partir do login file</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --mycnf </code> </p></th> <td>Lê dados de configuração do Cluster do arquivo my.cnf</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--ndb-connectstring=connection_string</code>, </p><p> <code> -c connection_string </code> </p></th> <td>Define a connect string para conexão com ndb_mgmd. Sintaxe: "[nodeid=id;][host=]hostname[:port]". Sobrescreve entradas em NDB_CONNECTSTRING e my.cnf</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--ndb-mgmd-host=connection_string</code>, </p><p> <code> -c connection_string </code> </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --ndb-nodeid=# </code> </p></th> <td>Define o ID do node para este node, sobrescrevendo qualquer ID definido por --ndb-connectstring</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --ndb-optimized-node-selection </code> </p></th> <td>Habilita otimizações para a seleção de nodes para Transactions. Habilitado por padrão; use --skip-ndb-optimized-node-selection para desabilitar</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --no-defaults </code> </p></th> <td>Não lê opções padrão de nenhum arquivo de opção além do login file</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --no-nodeid-checks </code> </p></th> <td>Não executa nenhuma verificação de ID de node</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --nodaemon </code> </p></th> <td>Não executa ndb_mgmd como um daemon</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --nowait-nodes=list </code> </p></th> <td>Não espera pelos nodes de gerenciamento especificados ao iniciar este servidor de gerenciamento; requer a opção --ndb-nodeid</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --print-defaults </code> </p></th> <td>Imprime a lista de argumentos do programa e sai</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--print-full-config</code>, </p><p> <code> -P </code> </p></th> <td>Imprime a configuração completa e sai</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --reload </code> </p></th> <td>Faz com que o servidor de gerenciamento compare o arquivo de configuração com o cache de configuração</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --remove[=name] </code> </p></th> <td>Usado para remover o processo do servidor de gerenciamento que foi previamente instalado como serviço Windows, opcionalmente especificando o nome do serviço a ser removido; não se aplica a outras plataformas</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --skip-config-file </code> </p></th> <td>Não usa o arquivo de configuração</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--usage</code>, </p><p> <code> -? </code> </p></th> <td>Exibe o texto de ajuda e sai; o mesmo que --help</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--verbose</code>, </p><p> <code> -v </code> </p></th> <td>Escreve informação adicional no log</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--version</code>, </p><p> <code> -V </code> </p></th> <td>Exibe informação da versão e sai</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody></table>

* `--bind-address=host`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--bind-address=host</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  Faz com que o servidor de gerenciamento faça o bind a uma interface de rede específica (nome do host ou endereço IP). Esta opção não tem valor padrão.

* `--character-sets-dir`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Diretório contendo conjuntos de caracteres.

* `--config-cache`

  <table frame="box" rules="all" summary="Propriedades para config-cache"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--config-cache[=TRUE|FALSE]</code></td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>TRUE</code></td> </tr></tbody></table>

  Esta opção, cujo valor padrão é `1` (ou `TRUE`, ou `ON`), pode ser usada para desabilitar o cache de configuração do servidor de gerenciamento, de modo que ele leia sua configuração de `config.ini` toda vez que iniciar (veja [Seção 21.4.3, “Arquivos de Configuração do NDB Cluster”](mysql-cluster-config-file.html "21.4.3 Arquivos de Configuração do NDB Cluster")). Você pode fazer isso iniciando o processo [**ndb_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — O Daemon do Servidor de Gerenciamento do NDB Cluster") com qualquer uma das seguintes opções:

  + `--config-cache=0`
  + `--config-cache=FALSE`
  + `--config-cache=OFF`
  + `--skip-config-cache`

  Usar uma das opções listadas acima só é eficaz se o servidor de gerenciamento não tiver uma configuração armazenada no momento em que é iniciado. Se o servidor de gerenciamento encontrar quaisquer arquivos de cache de configuração, então a opção `--config-cache` ou a opção `--skip-config-cache` é ignorada. Portanto, para desabilitar o caching de configuração, a opção deve ser usada na *primeira* vez que o servidor de gerenciamento for iniciado. Caso contrário—ou seja, se você deseja desabilitar o caching de configuração para um servidor de gerenciamento que *já* criou um cache de configuração—você deve parar o servidor de gerenciamento, excluir manualmente quaisquer arquivos de cache de configuração existentes e, em seguida, reiniciar o servidor de gerenciamento com `--skip-config-cache` (ou com `--config-cache` definido como 0, `OFF`, ou `FALSE`).

  Os arquivos de cache de configuração são normalmente criados em um diretório chamado `mysql-cluster` sob o diretório de instalação (a menos que este local tenha sido sobrescrito usando a opção [`--configdir`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_configdir)). Cada vez que o servidor de gerenciamento atualiza seus dados de configuração, ele escreve um novo arquivo de cache. Os arquivos são nomeados sequencialmente em ordem de criação usando o seguinte formato:

  ```sql
  ndb_node-id_config.bin.seq-number
  ```

  *`node-id`* é o ID do node do servidor de gerenciamento; *`seq-number`* é um número de sequência, começando em 1. Por exemplo, se o ID do node do servidor de gerenciamento for 5, os três primeiros arquivos de cache de configuração seriam, quando criados, nomeados `ndb_5_config.bin.1`, `ndb_5_config.bin.2` e `ndb_5_config.bin.3`.

  Se sua intenção for limpar ou recarregar o cache de configuração sem realmente desabilitar o caching, você deve iniciar [**ndb_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — O Daemon do Servidor de Gerenciamento do NDB Cluster") com uma das opções [`--reload`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_reload) ou [`--initial`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_initial) em vez de `--skip-config-cache`.

  Para reabilitar o cache de configuração, basta reiniciar o servidor de gerenciamento, mas sem a opção `--config-cache` ou `--skip-config-cache` que foi usada anteriormente para desabilitar o cache de configuração.

  [**ndb_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — O Daemon do Servidor de Gerenciamento do NDB Cluster") não verifica o diretório de configuração ([`--configdir`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_configdir)) nem tenta criá-lo quando `--skip-config-cache` é usado. (Bug #13428853)

* `--config-file=filename`, `-f filename`

  <table frame="box" rules="all" summary="Propriedades para config-file"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--config-file=file</code></td> </tr><tr><th>Desabilitado por</th> <td><code>skip-config-file</code></td> </tr><tr><th>Tipo</th> <td>Nome de Arquivo</td> </tr><tr><th>Valor Padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  Instrui o servidor de gerenciamento sobre qual arquivo ele deve usar como seu arquivo de configuração. Por padrão, o servidor de gerenciamento procura por um arquivo chamado `config.ini` no mesmo diretório que o executável [**ndb_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — O Daemon do Servidor de Gerenciamento do NDB Cluster"); caso contrário, o nome e a localização do arquivo devem ser especificados explicitamente.

  Esta opção não tem valor padrão e é ignorada, a menos que o servidor de gerenciamento seja forçado a ler o arquivo de configuração, seja porque [**ndb_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — O Daemon do Servidor de Gerenciamento do NDB Cluster") foi iniciado com a opção [`--reload`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_reload) ou [`--initial`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_initial), ou porque o servidor de gerenciamento não conseguiu encontrar nenhum cache de configuração.

  A opção [`--config-file`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_config-file) também é lida se [**ndb_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — O Daemon do Servidor de Gerenciamento do NDB Cluster") foi iniciado com [`--config-cache=OFF`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_config-cache). Veja [Seção 21.4.3, “Arquivos de Configuração do NDB Cluster”](mysql-cluster-config-file.html "21.4.3 Arquivos de Configuração do NDB Cluster"), para mais informações.

* `--configdir=dir_name`

  <table frame="box" rules="all" summary="Propriedades para configdir"><tbody><tr><th>Formato da Linha de Comando</th> <td><p><code>--configdir=directory</code></p><p><code>--config-dir=directory</code></p></td> </tr><tr><th>Tipo</th> <td>Nome de Arquivo</td> </tr><tr><th>Valor Padrão</th> <td><code>$INSTALLDIR/mysql-cluster</code></td> </tr></tbody></table>

  Especifica o diretório de cache de configuração do servidor de gerenciamento do Cluster. `--config-dir` é um alias para esta opção.

* `--connect-retries`

  <table frame="box" rules="all" summary="Propriedades para connect-retries"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>12</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>12</code></td> </tr></tbody></table>

  Número de vezes para tentar a conexão novamente antes de desistir.

* `--connect-retry-delay`

  <table frame="box" rules="all" summary="Propriedades para connect-retry-delay"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--connect-retry-delay=#</code></td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>5</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>5</code></td> </tr></tbody></table>

  Número de segundos para esperar entre as tentativas de contato com o servidor de gerenciamento.

* `--connect-string`

  <table frame="box" rules="all" summary="Propriedades para connect-string"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--connect-string=connection_string</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  O mesmo que [`--ndb-connectstring`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_ndb-connectstring).

* `--core-file`

  <table frame="box" rules="all" summary="Propriedades para core-file"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--core-file</code></td> </tr></tbody></table>

  Escreve um core file em caso de erro; usado em debugging.

* `--daemon`, `-d`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--bind-address=host</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  Instrui [**ndb_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — O Daemon do Servidor de Gerenciamento do NDB Cluster") a iniciar como um processo daemon. Este é o comportamento padrão.

  Esta opção não tem efeito ao executar [**ndb_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — O Daemon do Servidor de Gerenciamento do NDB Cluster") em plataformas Windows.

* `--defaults-extra-file`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--bind-address=host</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  Lê o arquivo fornecido após a leitura dos arquivos globais.

* `--defaults-file`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--bind-address=host</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  Lê opções padrão apenas do arquivo fornecido.

* `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--bind-address=host</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  Também lê grupos com concat(grupo, sufixo).

* `--help`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--bind-address=host</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  Exibe o texto de ajuda e sai.

* `--initial`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--bind-address=host</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  Os dados de configuração são armazenados em cache internamente, em vez de serem lidos do arquivo de configuração global do Cluster toda vez que o servidor de gerenciamento é iniciado (veja [Seção 21.4.3, “Arquivos de Configuração do NDB Cluster”](mysql-cluster-config-file.html "21.4.3 Arquivos de Configuração do NDB Cluster")). Usar a opção `--initial` sobrescreve esse comportamento, forçando o servidor de gerenciamento a excluir quaisquer arquivos de cache existentes e, em seguida, reler os dados de configuração do arquivo de configuração do Cluster e construir um novo cache.

  Isso difere de duas maneiras da opção [`--reload`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_reload). Primeiro, `--reload` força o servidor a verificar o arquivo de configuração em relação ao cache e recarregar seus dados apenas se o conteúdo do arquivo for diferente do cache. Segundo, `--reload` não exclui nenhum arquivo de cache existente.

  Se [**ndb_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — O Daemon do Servidor de Gerenciamento do NDB Cluster") for invocado com `--initial`, mas não conseguir encontrar um arquivo de configuração global, o servidor de gerenciamento não poderá iniciar.

  Quando um servidor de gerenciamento inicia, ele verifica a existência de outro servidor de gerenciamento no mesmo NDB Cluster e tenta usar os dados de configuração desse outro servidor de gerenciamento. Este comportamento tem implicações ao realizar uma reinicialização contínua (rolling restart) de um NDB Cluster com múltiplos nodes de gerenciamento. Veja [Seção 21.6.5, “Realizando um Rolling Restart de um NDB Cluster”](mysql-cluster-rolling-restart.html "21.6.5 Realizando um Rolling Restart de um NDB Cluster"), para mais informações.

  Quando usado em conjunto com a opção [`--config-file`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_config-file), o cache é limpo apenas se o arquivo de configuração for realmente encontrado.

* `--install[=name]`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--bind-address=host</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  Faz com que [**ndb_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — O Daemon do Servidor de Gerenciamento do NDB Cluster") seja instalado como um serviço Windows. Opcionalmente, você pode especificar um nome para o serviço; se não for definido, o nome do serviço será padronizado para `ndb_mgmd`. Embora seja preferível especificar outras opções do programa [**ndb_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — O Daemon do Servidor de Gerenciamento do NDB Cluster") em um arquivo de configuração `my.ini` ou `my.cnf`, é possível usá-las juntamente com [`--install`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_install). No entanto, nesses casos, a opção [`--install`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_install) deve ser especificada primeiro, antes de quaisquer outras opções, para que a instalação do serviço Windows seja bem-sucedida.

  Geralmente não é aconselhável usar esta opção juntamente com a opção [`--initial`](mysql-cluster-programs-ndbd.html#option_ndbd_initial), pois isso faz com que o cache de configuração seja apagado e reconstruído toda vez que o serviço é parado e iniciado. Deve-se ter cuidado também se você pretende usar quaisquer outras opções de [**ndb_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — O Daemon do Servidor de Gerenciamento do NDB Cluster") que afetem a inicialização do servidor de gerenciamento, e você deve ter certeza absoluta de que compreende totalmente e considera quaisquer possíveis consequências de fazê-lo.

  A opção [`--install`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_install) não tem efeito em plataformas que não sejam Windows.

* `--interactive`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--bind-address=host</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  Inicia [**ndb_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — O Daemon do Servidor de Gerenciamento do NDB Cluster") em modo interativo; ou seja, uma sessão de cliente [**ndb_mgm**](mysql-cluster-programs-ndb-mgm.html "21.5.5 ndb_mgm — O Cliente de Gerenciamento do NDB Cluster") é iniciada assim que o servidor de gerenciamento está em execução. Esta opção não inicia nenhum outro node do NDB Cluster.

* `--log-name=name`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--bind-address=host</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  Fornece um nome a ser usado para este node no log do Cluster.

* `--login-path`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--bind-address=host</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  Lê o caminho fornecido a partir do login file.

* `--mycnf`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Lê dados de configuração do arquivo `my.cnf`.

* `--ndb-connectstring`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Define a connection string. Sintaxe: `[nodeid=id;][host=]hostname[:port]`. Sobrescreve entradas em `NDB_CONNECTSTRING` e `my.cnf`; ignorada se [`--config-file`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_config-file) for especificada.

* `--ndb-mgmd-host`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  O mesmo que [`--ndb-connectstring`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_ndb-connectstring).

* `--ndb-nodeid`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Define o ID do node para este node, sobrescrevendo qualquer ID definido por [`--ndb-connectstring`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_ndb-connectstring).

* `--ndb-optimized-node-selection`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Habilita otimizações para a seleção de nodes para Transactions. Habilitado por padrão; use `--skip-ndb-optimized-node-selection` para desabilitar.

* `--no-defaults`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Não lê opções padrão de nenhum arquivo de opção além do login file.

* `--no-nodeid-checks`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Não executa nenhuma verificação de IDs de node.

* `--nodaemon`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Instrui [**ndb_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — O Daemon do Servidor de Gerenciamento do NDB Cluster") a não iniciar como um processo daemon.

  O comportamento padrão para [**ndb_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — O Daemon do Servidor de Gerenciamento do NDB Cluster") no Windows é executar em primeiro plano, tornando esta opção desnecessária em plataformas Windows.

* `--nowait-nodes`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Quando um NDB Cluster configurado com dois nodes de gerenciamento está iniciando, cada servidor de gerenciamento normalmente verifica se o outro [**ndb_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — O Daemon do Servidor de Gerenciamento do NDB Cluster") também está operacional e se a configuração do outro servidor de gerenciamento é idêntica à sua. No entanto, às vezes é desejável iniciar o Cluster com apenas um node de gerenciamento (e talvez permitir que o outro [**ndb_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — O Daemon do Servidor de Gerenciamento do NDB Cluster") seja iniciado posteriormente). Esta opção faz com que o node de gerenciamento ignore quaisquer verificações para outros nodes de gerenciamento cujos IDs de node são passados para esta opção, permitindo que o Cluster inicie como se estivesse configurado para usar apenas o node de gerenciamento que foi iniciado.

  Para fins de ilustração, considere a seguinte porção de um arquivo `config.ini` (onde omitimos a maioria dos parâmetros de configuração que não são relevantes para este exemplo):

  ```sql
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

  Suponha que você deseja iniciar este Cluster usando apenas o servidor de gerenciamento com ID de node `10` e em execução no host com endereço IP 198.51.100.150. (Suponha, por exemplo, que o computador host no qual você pretendia executar o outro servidor de gerenciamento esteja temporariamente indisponível devido a uma falha de hardware, e você esteja esperando que ele seja reparado.) Para iniciar o Cluster desta forma, use uma linha de comando na máquina em 198.51.100.150 para inserir o seguinte comando:

  ```sql
  $> ndb_mgmd --ndb-nodeid=10 --nowait-nodes=11
  ```

  Conforme mostrado no exemplo anterior, ao usar [`--nowait-nodes`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_nowait-nodes), você também deve usar a opção [`--ndb-nodeid`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_ndb-nodeid) para especificar o ID do node deste processo [**ndb_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — O Daemon do Servidor de Gerenciamento do NDB Cluster").

  Você pode então iniciar cada um dos data nodes do Cluster da maneira usual. Se você deseja iniciar e usar o segundo servidor de gerenciamento além do primeiro servidor de gerenciamento em um momento posterior sem reiniciar os data nodes, você deve iniciar cada data node com uma connection string que faça referência a ambos os servidores de gerenciamento, assim:

  ```sql
  $> ndbd -c 198.51.100.150,198.51.100.151
  ```

  O mesmo se aplica à connection string usada com quaisquer processos [**mysqld**](mysqld.html "4.3.1 mysqld — O MySQL Server") que você deseja iniciar como SQL nodes do NDB Cluster conectados a este Cluster. Veja [Seção 21.4.3.3, “Connection Strings do NDB Cluster”](mysql-cluster-connection-strings.html "21.4.3.3 Connection Strings do NDB Cluster"), para mais informações.

  Quando usada com [**ndb_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — O Daemon do Servidor de Gerenciamento do NDB Cluster"), esta opção afeta o comportamento do node de gerenciamento apenas em relação a outros nodes de gerenciamento. Não a confunda com a opção [`--nowait-nodes`](mysql-cluster-programs-ndbd.html#option_ndbd_nowait-nodes) usada com [**ndbd**](mysql-cluster-programs-ndbd.html "21.5.1 ndbd — O Daemon do Data Node do NDB Cluster") ou [**ndbmtd**](mysql-cluster-programs-ndbmtd.html "21.5.3 ndbmtd — O Daemon do Data Node do NDB Cluster (Multi-Threaded)") para permitir que um Cluster inicie com menos do que o seu complemento total de data nodes; quando usada com data nodes, esta opção afeta o comportamento deles apenas em relação a outros data nodes.

  Múltiplos IDs de node de gerenciamento podem ser passados para esta opção como uma lista separada por vírgulas. Cada ID de node deve ser não menor que 1 e não maior que 255. Na prática, é bastante raro usar mais de dois servidores de gerenciamento para o mesmo NDB Cluster (ou ter qualquer necessidade de fazê-lo); na maioria dos casos, você só precisa passar para esta opção o ID de node único para o servidor de gerenciamento que você não deseja usar ao iniciar o Cluster.

  Nota

  Quando você iniciar o servidor de gerenciamento "ausente" mais tarde, sua configuração deve corresponder à do servidor de gerenciamento que já está em uso pelo Cluster. Caso contrário, ele falhará na verificação de configuração executada pelo servidor de gerenciamento existente e não será iniciado.

* `--print-defaults`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Imprime a lista de argumentos do programa e sai.

* `--print-full-config`, `-P`

  <table frame="box" rules="all" summary="Propriedades para config-cache"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--config-cache[=TRUE|FALSE]</code></td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>TRUE</code></td> </tr></tbody></table>

  Mostra informações estendidas sobre a configuração do Cluster. Com esta opção na linha de comando, o processo [**ndb_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — O Daemon do Servidor de Gerenciamento do NDB Cluster") imprime informações sobre a configuração do Cluster, incluindo uma extensa lista das seções de configuração do Cluster, bem como parâmetros e seus valores. Normalmente usado em conjunto com a opção [`--config-file`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_config-file) (`-f`).

* `--reload`

  <table frame="box" rules="all" summary="Propriedades para config-cache"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--config-cache[=TRUE|FALSE]</code></td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>TRUE</code></td> </tr></tbody></table>

  Os dados de configuração do NDB Cluster são armazenados internamente em vez de serem lidos do arquivo de configuração global do Cluster toda vez que o servidor de gerenciamento é iniciado (veja [Seção 21.4.3, “Arquivos de Configuração do NDB Cluster”](mysql-cluster-config-file.html "21.4.3 Arquivos de Configuração do NDB Cluster")). Usar esta opção força o servidor de gerenciamento a verificar seu armazenamento de dados interno em relação ao arquivo de configuração do Cluster e recarregar a configuração se descobrir que o arquivo de configuração não corresponde ao cache. Arquivos de cache de configuração existentes são preservados, mas não usados.

  Isso difere de duas maneiras da opção [`--initial`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_initial). Primeiro, `--initial` faz com que todos os arquivos de cache sejam excluídos. Segundo, `--initial` força o servidor de gerenciamento a reler o arquivo de configuração global e construir um novo cache.

  Se o servidor de gerenciamento não conseguir encontrar um arquivo de configuração global, a opção `--reload` é ignorada.

  Quando `--reload` é usado, o servidor de gerenciamento deve ser capaz de se comunicar com os data nodes e quaisquer outros servidores de gerenciamento no Cluster antes de tentar ler o arquivo de configuração global; caso contrário, o servidor de gerenciamento falha ao iniciar. Isso pode acontecer devido a alterações no ambiente de rede, como novos endereços IP para nodes ou uma configuração de firewall alterada. Nesses casos, você deve usar [`--initial`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_initial) em vez disso para forçar o descarte e recarregamento da configuração em cache existente a partir do arquivo. Veja [Seção 21.6.5, “Realizando um Rolling Restart de um NDB Cluster”](mysql-cluster-rolling-restart.html "21.6.5 Realizando um Rolling Restart de um NDB Cluster"), para informações adicionais.

* `--remove[=name]`

  <table frame="box" rules="all" summary="Propriedades para config-cache"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--config-cache[=TRUE|FALSE]</code></td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>TRUE</code></td> </tr></tbody></table>

  Remove um processo de servidor de gerenciamento que foi instalado como um serviço Windows, opcionalmente especificando o nome do serviço a ser removido. Aplica-se apenas a plataformas Windows.

* `--skip-config-file`

  <table frame="box" rules="all" summary="Propriedades para config-cache"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--config-cache[=TRUE|FALSE]</code></td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>TRUE</code></td> </tr></tbody></table>

  Não lê o arquivo de configuração do Cluster; ignora as opções [`--initial`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_initial) e [`--reload`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_reload), se especificadas.

* `--usage`

  <table frame="box" rules="all" summary="Propriedades para config-cache"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--config-cache[=TRUE|FALSE]</code></td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>TRUE</code></td> </tr></tbody></table>

  Exibe o texto de ajuda e sai; o mesmo que [`--help`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_help).

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Propriedades para config-cache"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--config-cache[=TRUE|FALSE]</code></td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>TRUE</code></td> </tr></tbody></table>

  Escreve informação adicional no log.

* `--version`

  <table frame="box" rules="all" summary="Propriedades para config-cache"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--config-cache[=TRUE|FALSE]</code></td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>TRUE</code></td> </tr></tbody></table>

  Exibe informação da versão e sai.

Não é estritamente necessário especificar uma connection string ao iniciar o servidor de gerenciamento. No entanto, se você estiver usando mais de um servidor de gerenciamento, uma connection string deve ser fornecida e cada node no Cluster deve especificar seu ID de node explicitamente.

Veja [Seção 21.4.3.3, “Connection Strings do NDB Cluster”](mysql-cluster-connection-strings.html "21.4.3.3 Connection Strings do NDB Cluster"), para obter informações sobre o uso de connection strings. [Seção 21.5.4, “ndb_mgmd — O Daemon do Servidor de Gerenciamento do NDB Cluster”](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — O Daemon do Servidor de Gerenciamento do NDB Cluster"), descreve outras opções para [**ndb_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — O Daemon do Servidor de Gerenciamento do NDB Cluster").

Os seguintes arquivos são criados ou usados por [**ndb_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — O Daemon do Servidor de Gerenciamento do NDB Cluster") em seu diretório de inicialização e são colocados no [`DataDir`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datadir) conforme especificado no arquivo de configuração `config.ini`. Na lista que se segue, *`node_id`* é o identificador exclusivo do node.

* `config.ini` é o arquivo de configuração para o Cluster como um todo. Este arquivo é criado pelo usuário e lido pelo servidor de gerenciamento. [Seção 21.4, “Configuração do NDB Cluster”](mysql-cluster-configuration.html "21.4 Configuração do NDB Cluster"), discute como configurar este arquivo.

* `ndb_node_id_cluster.log` é o arquivo de log de eventos do Cluster. Exemplos de tais eventos incluem inicialização e conclusão de Checkpoint, eventos de inicialização de node, falhas de node e níveis de uso de memória. Uma lista completa de eventos do Cluster com descrições pode ser encontrada em [Seção 21.6, “Gerenciamento do NDB Cluster”](mysql-cluster-management.html "21.6 Gerenciamento do NDB Cluster").

  Por padrão, quando o tamanho do log do Cluster atinge um milhão de bytes, o arquivo é renomeado para `ndb_node_id_cluster.log.seq_id`, onde *`seq_id`* é o número de sequência do arquivo de log do Cluster. (Por exemplo: Se arquivos com os números de sequência 1, 2 e 3 já existirem, o próximo arquivo de log será nomeado usando o número `4`.) Você pode alterar o tamanho e o número de arquivos, e outras características do log do Cluster, usando o parâmetro de configuração [`LogDestination`](mysql-cluster-mgm-definition.html#ndbparam-mgmd-logdestination).

* `ndb_node_id_out.log` é o arquivo usado para `stdout` e `stderr` ao executar o servidor de gerenciamento como um daemon.

* `ndb_node_id.pid` é o arquivo de ID de processo (`pid`) usado ao executar o servidor de gerenciamento como um daemon.