### 21.3.3 Configuração Inicial do NDB Cluster

Nesta seção, discutimos a configuração manual de um NDB Cluster instalado, criando e editando arquivos de configuração.

Para o nosso NDB Cluster de quatro nodes e quatro hosts (consulte [Cluster nodes and host computers](mysql-cluster-installation.html#mysql-cluster-install-nodes-hosts "Cluster nodes and host computers")), é necessário escrever quatro arquivos de configuração, um por host de node.

* Cada data node ou SQL node requer um arquivo `my.cnf` que fornece duas informações: uma connection string que informa ao node onde encontrar o management node e uma linha que instrui o MySQL server neste host (a máquina que hospeda o data node) a habilitar o storage engine [`NDBCLUSTER`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6").

  Para mais informações sobre connection strings, consulte [Section 21.4.3.3, “NDB Cluster Connection Strings”](mysql-cluster-connection-strings.html "21.4.3.3 NDB Cluster Connection Strings").

* O management node precisa de um arquivo `config.ini` que o informe sobre quantas réplicas de fragmentos manter, quanta memória alocar para data e indexes em cada data node, onde encontrar os data nodes, onde salvar os data para disk em cada data node e onde encontrar quaisquer SQL nodes.

**Configurando os data nodes e SQL nodes.** O arquivo `my.cnf` necessário para os data nodes é bastante simples. O arquivo de configuração deve estar localizado no diretório `/etc` e pode ser editado usando qualquer editor de texto. (Crie o arquivo se ele não existir.) Por exemplo:

```sql
$> vi /etc/my.cnf
```

Nota

Mostramos o uso do **vi** aqui para criar o arquivo, mas qualquer editor de texto deve funcionar da mesma forma.

Para cada data node e SQL node em nossa configuração de exemplo, `my.cnf` deve se parecer com isto:

```sql
[mysqld]
# Options for mysqld process:
ndbcluster                      # run NDB storage engine

[mysql_cluster]
# Options for NDB Cluster processes:
ndb-connectstring=198.51.100.10  # location of management server
```

Após inserir as informações precedentes, salve este arquivo e saia do editor de texto. Faça isso para as máquinas que hospedam o data node “A”, o data node “B” e o SQL node.

Importante

Uma vez que você iniciou um processo [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") com os parâmetros `ndbcluster` e `ndb-connectstring` nas seções `[mysqld]` e `[mysql_cluster]` do arquivo `my.cnf`, conforme mostrado anteriormente, você não pode executar nenhuma instrução [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") ou [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") sem ter realmente iniciado o cluster. Caso contrário, essas instruções falharão com um error. Isto é intencional (by design).

**Configurando o management node.** O primeiro passo na configuração do management node é criar o directory onde o arquivo de configuração pode ser encontrado e, em seguida, criar o próprio arquivo. Por exemplo (executando como `root`):

```sql
$> mkdir /var/lib/mysql-cluster
$> cd /var/lib/mysql-cluster
$> vi config.ini
```

Para a nossa configuração representativa, o arquivo `config.ini` deve ter a seguinte leitura:

```sql
[ndbd default]
# Options affecting ndbd processes on all data nodes:
NoOfReplicas=2    # Number of fragment replicas
DataMemory=80M    # How much memory to allocate for data storage
IndexMemory=18M   # How much memory to allocate for index storage
                  # For DataMemory and IndexMemory, we have used the
                  # default values. Since the "world" database takes up
                  # only about 500KB, this should be more than enough for
                  # this example NDB Cluster setup.
                  # NOTE: IndexMemory is deprecated in NDB 7.6 and later; in
                  # these versions, resources for all data and indexes are
                  # allocated by DataMemory and any that are set for IndexMemory
                  # are added to the DataMemory resource pool

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

Nota

O `world` database pode ser baixado em [https://dev.mysql.com/doc/index-other.html](/doc/index-other.html).

Depois que todos os arquivos de configuração forem criados e estas opções mínimas forem especificadas, você estará pronto para prosseguir com a inicialização do cluster e a verificação de que todos os processos estão em execução. Discutimos como isso é feito em [Section 21.3.4, “Initial Startup of NDB Cluster”](mysql-cluster-install-first-start.html "21.3.4 Initial Startup of NDB Cluster").

Para informações mais detalhadas sobre os parâmetros de configuração disponíveis do NDB Cluster e seus usos, consulte [Section 21.4.3, “NDB Cluster Configuration Files”](mysql-cluster-config-file.html "21.4.3 NDB Cluster Configuration Files") e [Section 21.4, “Configuration of NDB Cluster”](mysql-cluster-configuration.html "21.4 Configuration of NDB Cluster"). Para a configuração do NDB Cluster relacionada à realização de backups, consulte [Section 21.6.8.3, “Configuration for NDB Cluster Backups”](mysql-cluster-backup-configuration.html "21.6.8.3 Configuration for NDB Cluster Backups").

A port default para management nodes do Cluster é 1186. Para data nodes, o cluster pode alocar ports automaticamente a partir daquelas que já estão livres.