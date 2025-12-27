### 25.3.3 Configuração Inicial do NDB Cluster

Nesta seção, discutimos a configuração manual de um NDB Cluster instalado, criando e editando arquivos de configuração.

Para nosso NDB Cluster de quatro nós e quatro hosts (veja Nodos do cluster e computadores hospedeiros), é necessário escrever quatro arquivos de configuração, um por host do nó.

* Cada nó de dados ou nó SQL requer um arquivo `my.cnf` que fornece duas informações: uma string de conexão que indica ao nó onde encontrar o nó de gerenciamento e uma linha que informa ao servidor MySQL neste host (a máquina que hospeda o nó de dados) para habilitar o mecanismo de armazenamento `NDBCLUSTER`.

Para mais informações sobre strings de conexão, consulte a Seção 25.4.3.3, “Strings de conexão do NDB Cluster”.

* O nó de gerenciamento precisa de um arquivo `config.ini` que indique quantos replicas de fragmento devem ser mantidas, quanto memória deve ser alocada para dados e índices em cada nó de dados, onde encontrar os nós de dados, onde salvar dados no disco em cada nó de dados e onde encontrar quaisquer nós SQL.

**Configurando os nós de dados e SQL.** O arquivo `my.cnf` necessário para os nós de dados é bastante simples. O arquivo de configuração deve estar localizado no diretório `/etc` e pode ser editado usando qualquer editor de texto. (Crie o arquivo se ele não existir.) Por exemplo:

```
$> vi /etc/my.cnf
```

Observação

Mostramos que o **vi** está sendo usado aqui para criar o arquivo, mas qualquer editor de texto deve funcionar tão bem.

Para cada nó de dados e nó SQL em nossa configuração de exemplo, o `my.cnf` deve parecer assim:

```
[mysqld]
# Options for mysqld process:
ndbcluster                      # run NDB storage engine

[mysql_cluster]
# Options for NDB Cluster processes:
ndb-connectstring=198.51.100.10  # location of management server
```

Após inserir as informações anteriores, salve este arquivo e saia do editor de texto. Faça isso para as máquinas que hospedam o nó de dados “A”, o nó de dados “B” e o nó SQL.

Importante

Depois de iniciar um processo **mysqld** com os parâmetros `ndbcluster` e `ndb-connectstring` nas seções `[mysqld]` e `[mysql_cluster]` do arquivo `my.cnf`, conforme mostrado anteriormente, você não pode executar quaisquer instruções `CREATE TABLE` ou `ALTER TABLE` sem ter iniciado o cluster. Caso contrário, essas instruções falharão com um erro. Isso é por design.

**Configurando o nó de gerenciamento.** O primeiro passo para configurar o nó de gerenciamento é criar o diretório onde o arquivo de configuração pode ser encontrado e, em seguida, criar o próprio arquivo. Por exemplo (executando como `root`):

```
$> mkdir /var/lib/mysql-cluster
$> cd /var/lib/mysql-cluster
$> vi config.ini
```

Para a configuração representativa, o arquivo `config.ini` deve ser lido da seguinte forma:

```
[ndbd default]
# Options affecting ndbd processes on all data nodes:
NoOfReplicas=2    # Number of fragment replicas
DataMemory=98M    # How much memory to allocate for data storage

[ndb_mgmd]
# Management process options:
HostName=198.51.100.10          # Hostname or IP address of management node
DataDir=/var/lib/mysql-cluster  # Directory for management node log files

[ndbd]
# Options for data node "A":
                                # (one [ndbd] section per data node)
HostName=198.51.100.30          # Hostname or IP address
NodeId=2                        # Node ID for this data node
DataDir=/usr/local/mysql/data   # Directory for this data node's data files

[ndbd]
# Options for data node "B":
HostName=198.51.100.40          # Hostname or IP address
NodeId=3                        # Node ID for this data node
DataDir=/usr/local/mysql/data   # Directory for this data node's data files

[mysqld]
# SQL node options:
HostName=198.51.100.20          # Hostname or IP address
                                # (additional mysqld connections can be
                                # specified for this node for various
                                # purposes such as running ndb_restore)
```

Observação

O banco de dados `world` pode ser baixado de https://dev.mysql.com/doc/index-other.html.

Após a criação de todos os arquivos de configuração e a especificação dessas opções mínimas, você está pronto para prosseguir com o início do cluster e verificar se todos os processos estão em execução. Discutimos como isso é feito na Seção 25.3.4, “Início Inicial do NDB Cluster”.

Para informações mais detalhadas sobre os parâmetros de configuração do NDB Cluster disponíveis e seus usos, consulte a Seção 25.4.3, “Arquivos de Configuração do NDB Cluster”, e a Seção 25.4, “Configuração do NDB Cluster”. Para a configuração do NDB Cluster relacionada à realização de backups, consulte a Seção 25.6.8.3, “Configuração para Backups do NDB Cluster”.

A porta padrão para os nós de gerenciamento do Cluster é 1186. Para os nós de dados, o cluster pode alocar automaticamente portas das que já estão disponíveis.