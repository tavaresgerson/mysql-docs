### 25.5.4 ndb\_mgmd — O Daemon do Servidor de Gerenciamento de Clúster NDB

O servidor de gerenciamento é o processo que lê o arquivo de configuração do clúster e distribui essas informações para todos os nós do clúster que solicitarem. Ele também mantém um registro das atividades do clúster. Os clientes de gerenciamento podem se conectar ao servidor de gerenciamento e verificar o status do clúster.

Todas as opções que podem ser usadas com **ndb\_mgmd** estão mostradas na tabela a seguir. Descrições adicionais seguem a tabela.

* `--bind-address=host`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--bind-address=host</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  Faz com que o servidor de gerenciamento se ligue a uma interface de rede específica (nome de host ou endereço IP). Esta opção não tem valor padrão.

* `--character-sets-dir`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--character-sets-dir=caminho</code></td> </tr></tbody></table>

  Diretório que contém conjuntos de caracteres.

* `cluster-config-suffix`

  <table frame="box" rules="all" summary="Propriedades para cluster-config-suffix"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--cluster-config-suffix=nome</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

Suprar o sufixo padrão do grupo de grupos de configuração quando ler seções de configuração de clusters no `my.cnf`; usado em testes.

* `--config-cache`

  <table frame="box" rules="all" summary="Propriedades para config-cache"><tbody><tr><th>Formato de linha de comando</th> <td><code>--config-cache[=TRUE|FALSE]</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>TRUE</code></td> </tr></tbody></table>

  Esta opção, cujo valor padrão é `1` (ou `TRUE`, ou `ON`), pode ser usada para desativar o cache de configuração do servidor de gerenciamento, para que ele leia sua configuração do `config.ini` toda vez que for iniciado (veja a Seção 25.4.3, “Arquivos de configuração de clusters NDB”). Você pode fazer isso iniciando o processo **ndb\_mgmd** com qualquer uma das seguintes opções:

  + `--config-cache=0`
  + `--config-cache=FALSE`
  + `--config-cache=OFF`
  + `--skip-config-cache`

  Usar uma das opções listadas acima só é eficaz se o servidor de gerenciamento não tiver nenhuma configuração armazenada no momento em que for iniciado. Se o servidor de gerenciamento encontrar algum arquivo de cache de configuração, a opção `--config-cache` ou a opção `--skip-config-cache` será ignorada. Portanto, para desativar o cache de configuração, a opção deve ser usada *primeiramente* quando o servidor de gerenciamento for iniciado. Caso contrário — ou seja, se você desejar desativar o cache de configuração para um servidor de gerenciamento que já criou um cache de configuração — você deve parar o servidor de gerenciamento, excluir manualmente quaisquer arquivos de cache de configuração existentes e, em seguida, reiniciar o servidor de gerenciamento com `--skip-config-cache` (ou com `--config-cache` definido como 0, `OFF` ou `FALSE`).

Os arquivos de cache de configuração são normalmente criados em um diretório chamado `mysql-cluster` sob o diretório de instalação (a menos que essa localização tenha sido sobrescrita usando a opção `--configdir`). Cada vez que o servidor de gerenciamento atualiza seus dados de configuração, ele escreve um novo arquivo de cache. Os arquivos são nomeados sequencialmente na ordem de criação usando o seguinte formato:

```
  ndb_node-id_config.bin.seq-number
  ```ydZIYOUMDr```
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
  ```hdyP5E2nyd```
  $> ndb_mgmd --ndb-nodeid=10 --nowait-nodes=11
  ```LZnKW7c2O8```

  O mesmo vale para a string de conexão usada com quaisquer processos **mysqld** que você deseje iniciar como nós SQL do NDB Cluster conectados a este clúster. Consulte a Seção 25.4.3.3, “Strings de conexão do NDB Cluster”, para obter mais informações.

  Quando usado com **ndb\_mgmd**, esta opção afeta o comportamento do nó de gerenciamento em relação a outros nós de gerenciamento. Não confunda com a opção `--nowait-nodes` usada com **ndbd** ou **ndbmtd**") para permitir que um clúster seja iniciado com menos do que seu complemento completo de nós de dados; quando usado com nós de dados, esta opção afeta seu comportamento apenas em relação a outros nós de dados.

  Vários IDs de nó de gerenciamento podem ser passados a esta opção como uma lista separada por vírgula. Cada ID de nó deve ser no mínimo 1 e no máximo 255. Na prática, é bastante raro usar mais de dois servidores de gerenciamento para o mesmo NDB Cluster (ou ter qualquer necessidade de fazê-lo); na maioria dos casos, você precisa passar a esta opção apenas o ID de nó único para o servidor de gerenciamento que você não deseja usar ao iniciar o clúster.

  Nota

  Quando você iniciar mais tarde o servidor de gerenciamento “falta”, sua configuração deve corresponder à do servidor de gerenciamento que já está em uso pelo clúster. Caso contrário, ele falhará na verificação de configuração realizada pelo servidor de gerenciamento existente e não será iniciado.

* `--print-defaults`

<table frame="box" rules="all" summary="Propriedades para config-cache">
  <tr><th>Formato de Linha de Comando</th> <td><code>--config-cache[=TRUE|FALSE]</code></td> </tr>
  <tr><th>Tipo</th> <td>Booleano</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>TRUE</code></td> </tr>
</table>

  Imprime a lista de argumentos do programa e encerra.

* `--print-full-config`, `-P`

  <table frame="box" rules="all" summary="Propriedades para config-cache">
    <tr><th>Formato de Linha de Comando</th> <td><code>--config-cache[=TRUE|FALSE]</code></td> </tr>
    <tr><th>Tipo</th> <td>Booleano</td> </tr>
    <tr><th>Valor Padrão</th> <td><code>TRUE</code></td> </tr>
  </table>

  Mostra informações extensas sobre a configuração do cluster. Com esta opção na linha de comando, o processo **ndb\_mgmd** imprime informações sobre a configuração do cluster, incluindo uma extensa lista das seções de configuração do cluster, bem como os parâmetros e seus valores. Normalmente usado junto com a opção `--config-file` (`-f`).

* `--reload`

Os dados de configuração do NDB Cluster são armazenados internamente, em vez de serem lidos do arquivo de configuração global do cluster toda vez que o servidor de gerenciamento é iniciado (veja a Seção 25.4.3, “Arquivos de Configuração do NDB Cluster”). A utilização desta opção obriga o servidor de gerenciamento a verificar seu armazenamento de dados interno contra o arquivo de configuração do cluster e a recarregar a configuração se encontrar que o arquivo de configuração não corresponde ao cache. Os arquivos de cache de configuração existentes são preservados, mas não utilizados.

Isso difere de duas maneiras da opção `--initial`. Primeiro, `--initial` faz com que todos os arquivos de cache sejam excluídos. Segundo, `--initial` obriga o servidor de gerenciamento a reler o arquivo de configuração global e a construir um novo cache.

Se o servidor de gerenciamento não encontrar um arquivo de configuração global, a opção `--reload` é ignorada.

Quando `--reload` é usado, o servidor de gerenciamento deve ser capaz de se comunicar com os nós de dados e qualquer outro servidor de gerenciamento no cluster antes de tentar ler o arquivo de configuração global; caso contrário, o servidor de gerenciamento falha ao iniciar. Isso pode acontecer devido a mudanças no ambiente de rede, como novos endereços IP para nós ou uma alteração na configuração do firewall. Nesses casos, você deve usar `--initial` em vez disso para forçar a descarte e recarga da configuração cache existente do arquivo. Consulte a Seção 25.6.5, “Realizando um Reinício Rotativo de um NDB Cluster”, para obter informações adicionais.

* `--remove[=name]`

<table frame="box" rules="all" summary="Propriedades para config-cache"><tbody><tr><th>Formato de linha de comando</th> <td><code>--config-cache[=TRUE|FALSE]</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>TRUE</code></td> </tr></tbody></table>

  Remova um processo do servidor de gerenciamento que foi instalado como um serviço do Windows, especificando opcionalmente o nome do serviço a ser removido. Aplica-se apenas a plataformas Windows.

* `--skip-config-file`

  <table frame="box" rules="all" summary="Propriedades para config-cache"><tbody><tr><th>Formato de linha de comando</th> <td><code>--config-cache[=TRUE|FALSE]</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>TRUE</code></td> </tr></tbody></table>

  Não leia o arquivo de configuração do cluster; ignore as opções `--initial` e `--reload` se especificadas.

* `--usage`

  <table frame="box" rules="all" summary="Propriedades para config-cache"><tbody><tr><th>Formato de linha de comando</th> <td><code>--config-cache[=TRUE|FALSE]</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>TRUE</code></td> </tr></tbody></table>

  Exibir texto de ajuda e sair; o mesmo que --help.

* `--verbose`, `-v`

<table frame="box" rules="all" summary="Propriedades para config-cache"><tbody><tr><th>Formato de linha de comando</th> <td><code>--config-cache[=TRUE|FALSE]</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>TRUE</code></td> </tr></tbody></table>

  Remova um processo do servidor de gerenciamento que foi instalado como um serviço do Windows, especificando opcionalmente o nome do serviço a ser removido. Aplica-se apenas a plataformas Windows.

* `--version`

  <table frame="box" rules="all" summary="Propriedades para config-file"><tbody><tr><th>Formato de linha de comando</th> <td><code>--config-file=file</code></td> </tr><tr><th>Desabilitado por</th> <td><code>skip-config-file</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  Exiba informações de versão e saia.

Não é estritamente necessário especificar uma string de conexão ao iniciar o servidor de gerenciamento. No entanto, se você estiver usando mais de um servidor de gerenciamento, uma string de conexão deve ser fornecida e cada nó no clúster deve especificar seu ID de nó explicitamente.

Consulte a Seção 25.4.3.3, “Strings de conexão do clúster NDB”, para obter informações sobre o uso de strings de conexão. A Seção 25.5.4, “ndb\_mgmd — O daemon do servidor de gerenciamento do clúster NDB”, descreve outras opções para **ndb\_mgmd**.

Os seguintes arquivos são criados ou usados por **ndb\_mgmd** em seu diretório de início e são colocados no `DataDir` conforme especificado no arquivo de configuração `config.ini`. Na lista que segue, *`node_id`* é o identificador de nó único.

* `config.ini` é o arquivo de configuração para o clúster como um todo. Esse arquivo é criado pelo usuário e lido pelo servidor de gerenciamento. A seção 25.4, “Configuração do NDB Cluster”, discute como configurar esse arquivo.

* `ndb_node_id_cluster.log` é o arquivo de registro de eventos do clúster. Exemplos de tais eventos incluem o início e o término do checkpoint, eventos de inicialização de nós, falhas de nós e níveis de uso de memória. Uma lista completa dos eventos do clúster com descrições pode ser encontrada na Seção 25.6, “Gerenciamento do NDB Cluster”.

Por padrão, quando o tamanho do log do clúster atinge um milhão de bytes, o arquivo é renomeado para `ndb_node_id_cluster.log.seq_id`, onde *`seq_id`* é o número de sequência do arquivo de log do clúster. (Por exemplo: Se os arquivos com os números de sequência 1, 2 e 3 já existirem, o próximo arquivo de log é nomeado usando o número `4`.) Você pode alterar o tamanho e o número de arquivos, bem como outras características do log do clúster, usando o parâmetro de configuração `LogDestination`.

* `ndb_node_id_out.log` é o arquivo usado para `stdout` e `stderr` ao executar o servidor de gerenciamento como um daemon.

* `ndb_node_id.pid` é o arquivo de ID de processo usado ao executar o servidor de gerenciamento como um daemon.