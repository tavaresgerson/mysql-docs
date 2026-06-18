#### 25.6.3.1 Comandos de Gerenciamento de Registro de Agrupamento do NDB

O **ndb\_mgm** suporta vários comandos de gerenciamento relacionados ao log do clúster e aos logs dos nós. Na lista a seguir, `node_id` denota o ID de um nó de armazenamento ou a palavra-chave `ALL`, que indica que o comando deve ser aplicado a todos os nós de dados do clúster.

- `CLUSTERLOG ON`

  Ativa o registro do cluster.

- `CLUSTERLOG OFF`

  Desliga o log do cluster.

- `CLUSTERLOG INFO`

  Fornece informações sobre as configurações do log de clúster.

- `node_id CLUSTERLOG category=threshold`

  Registra eventos `category` com prioridade igual a ou menor que `threshold` no log do clúster.

- `CLUSTERLOG TOGGLE severity_level`

  Habilita ou desabilita o registro em cluster de eventos do `severity_level` especificado.

A tabela a seguir descreve a configuração padrão (para todos os nós de dados) do limiar da categoria de log do clúster. Se um evento tiver uma prioridade com um valor menor ou igual ao limiar de prioridade, ele será relatado no log do clúster.

Nota

Os eventos são relatados por nó de dados, e o limite pode ser definido em valores diferentes em diferentes nós.

**Tabela 25.54 Categorias de registro de clúster, com configuração de limite padrão**

<table><thead><tr> <th>Categoria</th> <th>Limiar padrão (todos os nós de dados)</th> </tr></thead><tbody><tr> <td>[[PH_HTML_CODE_<code>CONNECTION</code>]</td> <td>[[PH_HTML_CODE_<code>CONNECTION</code>]</td> </tr><tr> <td>[[PH_HTML_CODE_<code>ERROR</code>]</td> <td>[[PH_HTML_CODE_<code>15</code>]</td> </tr><tr> <td>[[PH_HTML_CODE_<code>INFO</code>]</td> <td>[[PH_HTML_CODE_<code>7</code>]</td> </tr><tr> <td>[[PH_HTML_CODE_<code>BACKUP</code>]</td> <td>[[PH_HTML_CODE_<code>15</code>]</td> </tr><tr> <td>[[PH_HTML_CODE_<code>CONGESTION</code>]</td> <td>[[PH_HTML_CODE_<code>7</code>]</td> </tr><tr> <td>[[<code>CONNECTION</code>]]</td> <td>[[<code>7</code><code>CONNECTION</code>]</td> </tr><tr> <td>[[<code>ERROR</code>]]</td> <td>[[<code>15</code>]]</td> </tr><tr> <td>[[<code>INFO</code>]]</td> <td>[[<code>7</code>]]</td> </tr><tr> <td>[[<code>BACKUP</code>]]</td> <td>[[<code>15</code>]]</td> </tr><tr> <td>[[<code>CONGESTION</code>]]</td> <td>[[<code>7</code>]]</td> </tr><tr> <td>[[<code>SHUTDOWN</code><code>CONNECTION</code>]</td> <td>[[<code>SHUTDOWN</code><code>CONNECTION</code>]</td> </tr></tbody></table>

A categoria `STATISTICS` pode fornecer uma grande quantidade de dados úteis. Consulte a Seção 25.6.3.3, “Usando estatísticas CLUSTERLOG no cliente de gerenciamento de clusters NDB”, para obter mais informações.

Os limites são usados para filtrar eventos dentro de cada categoria. Por exemplo, um evento `STARTUP` com uma prioridade de 3 não é registrado a menos que o limite para `STARTUP` esteja definido como 3 ou superior. Apenas eventos com prioridade 3 ou inferior são enviados se o limite for 3.

A tabela a seguir mostra os níveis de gravidade do evento.

Nota

Estes correspondem aos níveis Unix `syslog`, exceto para `LOG_EMERG` e `LOG_NOTICE`, que não são usados ou mapeados.

**Tabela 25.55 Níveis de gravidade dos eventos**

<table><thead><tr> <th scope="col">Nível de gravidade Valor</th> <th scope="col">Gravidade</th> <th scope="col">Descrição</th> </tr></thead><tbody><tr> <th>1</th> <td>[[<code>ALERT</code>]]</td> <td>Uma condição que deve ser corrigida imediatamente, como um banco de dados do sistema corrompido</td> </tr><tr> <th>2</th> <td>[[<code>CRITICAL</code>]]</td> <td>Condições críticas, como erros de dispositivo ou recursos insuficientes</td> </tr><tr> <th>3</th> <td>[[<code>ERROR</code>]]</td> <td>Condições que devem ser corrigidas, como erros de configuração</td> </tr><tr> <th>4</th> <td>[[<code>WARNING</code>]]</td> <td>Condições que não são erros, mas que podem exigir um tratamento especial</td> </tr><tr> <th>5</th> <td>[[<code>INFO</code>]]</td> <td>Mensagens informativas</td> </tr><tr> <th>6</th> <td>[[<code>DEBUG</code>]]</td> <td>Mensagens de depuração usadas para o desenvolvimento do [[<code>NDBCLUSTER</code>]]</td> </tr></tbody></table>

Os níveis de gravidade dos eventos podem ser ativados ou desativados usando `CLUSTERLOG TOGGLE`. Se um nível de gravidade for ativado, todos os eventos com uma prioridade menor ou igual aos limiares da categoria serão registrados. Se o nível de gravidade for desativado, nenhum evento pertencente a esse nível de gravidade será registrado.

Importante

Os níveis de registro do clúster são definidos por **ndb\_mgmd**, por subscritor. Isso significa que, em um NDB Cluster com múltiplos servidores de gerenciamento, o uso de um comando `CLUSTERLOG` em uma instância de **ndb\_mgm** conectada a um servidor de gerenciamento afeta apenas os logs gerados por esse servidor de gerenciamento, mas não por nenhum dos outros. Isso também significa que, se um dos servidores de gerenciamento for reiniciado, apenas os logs gerados por esse servidor de gerenciamento serão afetados pela redefinição dos níveis de registro causada pelo reinício.
