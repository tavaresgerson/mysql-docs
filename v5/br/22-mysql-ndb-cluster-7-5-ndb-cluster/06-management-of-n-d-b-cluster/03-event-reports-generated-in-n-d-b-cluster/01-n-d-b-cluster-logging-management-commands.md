#### 21.6.3.1 Comandos de Gerenciamento de Registro de Agrupamento NDB

**ndb_mgm** suporta vários comandos de gerenciamento relacionados ao log do clúster e aos logs dos nós. Na lista a seguir, *`node_id`* denota um ID de nó de armazenamento ou a palavra-chave `ALL`, que indica que o comando deve ser aplicado a todos os nós de dados do clúster.

- `CLUSTERLOG ON`

  Ativa o registro do cluster.

- `CLUSTRELOG OFF`

  Desliga o log do cluster.

- `CLUSTERLOG INFO`

  Fornece informações sobre as configurações do log de clúster.

- `node_id CLUSTERLOG categoria=limite`

  Registra eventos de *`categoria`* com prioridade menor ou igual a *`limite`* no log do clúster.

- `CLUSTERLOG TOGGLE severity_level`

  Habilita ou desabilita o registro de eventos do clúster do nível de gravidade especificado *`severity_level`*.

A tabela a seguir descreve a configuração padrão (para todos os nós de dados) do limiar da categoria de log do clúster. Se um evento tiver uma prioridade com um valor menor ou igual ao limiar de prioridade, ele será relatado no log do clúster.

Nota

Os eventos são relatados por nó de dados, e o limite pode ser definido em valores diferentes em diferentes nós.

**Tabela 21.48 Categorias de log de cluster, com configuração de limite padrão**

<table><thead><tr> <th>Categoria</th> <th>Limiar padrão (todos os nós de dados)</th> </tr></thead><tbody><tr> <td>PH_HTML_CODE_<code>CONNECTION</code>]</td> <td>PH_HTML_CODE_<code>CONNECTION</code>]</td> </tr><tr> <td>PH_HTML_CODE_<code>ERROR</code>]</td> <td>PH_HTML_CODE_<code>15</code>]</td> </tr><tr> <td>PH_HTML_CODE_<code>INFO</code>]</td> <td>PH_HTML_CODE_<code>7</code>]</td> </tr><tr> <td>PH_HTML_CODE_<code>BACKUP</code>]</td> <td>PH_HTML_CODE_<code>15</code>]</td> </tr><tr> <td>PH_HTML_CODE_<code>CONGESTION</code>]</td> <td>PH_HTML_CODE_<code>7</code>]</td> </tr><tr> <td><code>CONNECTION</code></td> <td><code>7</code><code>CONNECTION</code>]</td> </tr><tr> <td><code>ERROR</code></td> <td><code>15</code></td> </tr><tr> <td><code>INFO</code></td> <td><code>7</code></td> </tr><tr> <td><code>BACKUP</code></td> <td><code>15</code></td> </tr><tr> <td><code>CONGESTION</code></td> <td><code>7</code></td> </tr><tr> <td><code>SHUTDOWN</code><code>CONNECTION</code>]</td> <td><code>SHUTDOWN</code><code>CONNECTION</code>]</td> </tr></tbody></table>

A categoria `STATISTICS` pode fornecer uma grande quantidade de dados úteis. Consulte Seção 21.6.3.3, “Usando CLUSTERLOG STATISTICS no NDB Cluster Management Client” para obter mais informações.

Os limites são usados para filtrar eventos dentro de cada categoria. Por exemplo, um evento `STARTUP` com uma prioridade de 3 não é registrado a menos que o limite para `STARTUP` esteja definido como 3 ou superior. Apenas eventos com prioridade 3 ou inferior são enviados se o limite for 3.

A tabela a seguir mostra os níveis de gravidade do evento.

Nota

Estes correspondem aos níveis do `syslog` do Unix, exceto para `LOG_EMERG` e `LOG_NOTICE`, que não são usados ou mapeados.

**Tabela 21.49 Níveis de gravidade dos eventos**

<table><col style="width: 20%"/><col style="width: 20%"/><col style="width: 60%"/><thead><tr> <th>Nível de gravidade Valor</th> <th>Gravidade</th> <th>Descrição</th> </tr></thead><tbody><tr> <th>1</th> <td><code>ALERT</code></td> <td>Uma condição que deve ser corrigida imediatamente, como um banco de dados do sistema corrompido</td> </tr><tr> <th>2</th> <td><code>CRITICAL</code></td> <td>Condições críticas, como erros de dispositivo ou recursos insuficientes</td> </tr><tr> <th>3</th> <td><code>ERROR</code></td> <td>Condições que devem ser corrigidas, como erros de configuração</td> </tr><tr> <th>4</th> <td><code>WARNING</code></td> <td>Condições que não são erros, mas que podem exigir um tratamento especial</td> </tr><tr> <th>5</th> <td><code>INFO</code></td> <td>Mensagens informativas</td> </tr><tr> <th>6</th> <td><code>DEBUG</code></td> <td>Mensagens de depuração usadas para<code>NDBCLUSTER</code>desenvolvimento</td> </tr></tbody></table>

Os níveis de gravidade dos eventos podem ser ativados ou desativados usando `CLUSTERLOG TOGGLE`. Se um nível de gravidade for ativado, todos os eventos com uma prioridade menor ou igual aos limiares da categoria serão registrados. Se o nível de gravidade for desativado, nenhum evento pertencente a esse nível de gravidade será registrado.

Importante

Os níveis de log do cluster são definidos por **ndb_mgmd**, por subscritor. Isso significa que, em um NDB Cluster com múltiplos servidores de gerenciamento, o uso do comando `CLUSTERLOG` em uma instância de **ndb_mgm** conectada a um servidor de gerenciamento afeta apenas os logs gerados por esse servidor de gerenciamento, mas não por nenhum dos outros. Isso também significa que, se um dos servidores de gerenciamento for reiniciado, apenas os logs gerados por esse servidor de gerenciamento serão afetados pela redefinição dos níveis de log causada pelo reinício.
