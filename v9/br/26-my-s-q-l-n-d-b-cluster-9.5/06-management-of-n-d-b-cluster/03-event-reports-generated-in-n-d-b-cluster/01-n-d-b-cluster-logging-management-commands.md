#### 25.6.3.1 Comandos de Gerenciamento de Registro do NDB Cluster

O **ndb\_mgm** suporta vários comandos de gerenciamento relacionados ao registro do cluster e aos logs dos nós. Na lista a seguir, *`node_id`* denota o ID de um nó de armazenamento ou a palavra-chave `ALL`, que indica que o comando deve ser aplicado a todos os nós de dados do cluster.

* `CLUSTERLOG ON`

  Ativa o registro do cluster.

* `CLUSTERLOG OFF`

  Desativa o registro do cluster.

* `CLUSTERLOG INFO`

  Fornece informações sobre as configurações do registro do cluster.

* `node_id CLUSTERLOG categoria=limite`

  Registra eventos de *`categoria`* com prioridade menor ou igual a *`limite`* no registro do cluster.

* `CLUSTERLOG TOGGLE nível_de_gravidade`

  Ativa ou desativa o registro de eventos do cluster do nível de gravidade especificado.

A tabela a seguir descreve o ajuste padrão (para todos os nós de dados) do limite de categoria do registro do cluster. Se um evento tiver uma prioridade com um valor menor ou igual ao limite de prioridade, ele será registrado no registro do cluster.

Observação

Os eventos são registrados por nó de dados e o limite pode ser configurado com valores diferentes em diferentes nós.

**Tabela 25.26 Categorias de registro do cluster, com configuração padrão de limite**

<table><col style="width: 30%"/><col style="width: 70%"/><thead><tr> <th>Categoria</th> <th>Limiar padrão (todos os nós de dados)</th> </tr></thead><tbody><tr> <td><code class="literal">STARTUP</code></td> <td><code class="literal">7</code></td> </tr><tr> <td><code class="literal">SHUTDOWN</code></td> <td><code class="literal">7</code></td> </tr><tr> <td><code class="literal">STATÍSTICAS</code></td> <td><code class="literal">7</code></td> </tr><tr> <td><code class="literal">CHECKPOINT</code></td> <td><code class="literal">7</code></td> </tr><tr> <td><code class="literal">NODERESTART</code></td> <td><code class="literal">7</code></td> </tr><tr> <td><code class="literal">CONEXÃO</code></td> <td><code class="literal">8</code></td> </tr><tr> <td><code class="literal">ERRO</code></td> <td><code class="literal">15</code></td> </tr><tr> <td><code class="literal">INFO</code></td> <td><code class="literal">7</code></td> </tr><tr> <td><code class="literal">BACKUP</code></td> <td><code class="literal">15</code></td> </tr><tr> <td><code class="literal">CONGESTÃO</code></td> <td><code class="literal">7</code></td> </tr><tr> <td><code class="literal">SCHEMA</code></td> <td><code class="literal">7</code></td> </tr></tbody></table>

A categoria <code class="literal">STATÍSTICAS</code> pode fornecer uma grande quantidade de dados úteis. Consulte a Seção 25.6.3.3, “Uso do CLUSTERLOG STATISTICS no Cliente de Gerenciamento de Clusters NDB”, para obter mais informações.

Os limiares são usados para filtrar eventos dentro de cada categoria. Por exemplo, um evento <code class="literal">STARTUP</code> com uma prioridade de 3 não é registrado a menos que o limiar para <code class="literal">STARTUP</code> esteja definido para 3 ou superior. Apenas eventos com prioridade 3 ou inferior são enviados se o limiar for 3.

A tabela a seguir mostra os níveis de gravidade dos eventos.

Nota

Esses correspondem aos níveis de gravidade de eventos do Unix `syslog`, exceto para `LOG_EMERG` e `LOG_NOTICE`, que não são usados ou mapeados.

**Tabela 25.27 Níveis de gravidade de eventos**

<table><col style="width: 20%"/><col style="width: 20%"/><col style="width: 60%"/><thead><tr> <th scope="col">Valor do Nível de Gravidade</th> <th scope="col">Gravidade</th> <th scope="col">Descrição</th> </tr></thead><tbody><tr> <th scope="row">1</th> <td><code class="literal">ALERT</code></td> <td>Condição que deve ser corrigida imediatamente, como um banco de dados do sistema corrompido</td> </tr><tr> <th scope="row">2</th> <td><code class="literal">CRITICAL</code></td> <td>Condições críticas, como erros de dispositivo ou recursos insuficientes</td> </tr><tr> <th scope="row">3</th> <td><code class="literal">ERROR</code></td> <td>Condições que devem ser corrigidas, como erros de configuração</td> </tr><tr> <th scope="row">4</th> <td><code class="literal">WARNING</code></td> <td>Condições que não são erros, mas que podem exigir tratamento especial</td> </tr><tr> <th scope="row">5</th> <td><code class="literal">INFO</code></td> <td>Mensagens informativas</td> </tr><tr> <th scope="row">6</th> <td><code class="literal">DEBUG</code></td> <td>Mensagens de depuração usadas para o desenvolvimento de <a class="link" href="mysql-cluster.html" title="Capítulo 25 MySQL NDB Cluster 9.5"><code class="literal">NDBCLUSTER</code></a></td> </tr></tbody></table>

Os níveis de gravidade de eventos podem ser ativados ou desativados usando `CLUSTERLOG TOGGLE`. Se um nível de gravidade for ativado, então todos os eventos com uma prioridade menor ou igual aos limiares da categoria são registrados. Se o nível de gravidade for desativado, então nenhum evento pertencente a esse nível de gravidade é registrado.

Importante

Os níveis de registro do clúster são definidos por **ndb\_mgmd**, por subscritor. Isso significa que, em um NDB Cluster com múltiplos servidores de gerenciamento, o uso do comando `CLUSTERLOG` em uma instância de **ndb\_mgm** conectada a um servidor de gerenciamento afeta apenas os registros gerados por esse servidor de gerenciamento, mas não por nenhum dos outros. Isso também significa que, se um dos servidores de gerenciamento for reiniciado, apenas os registros gerados por esse servidor de gerenciamento serão afetados pela redefinição dos níveis de registro causada pelo reinício.