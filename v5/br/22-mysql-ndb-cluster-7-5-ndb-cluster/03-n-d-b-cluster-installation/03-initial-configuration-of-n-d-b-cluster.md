### 21.3.3 Configuração Inicial do NDB Cluster

Nesta seção, discutimos a configuração manual de um NDB Cluster instalado, criando e editando arquivos de configuração.

Para o nosso cluster NDB de quatro nós e quatro hosts (veja Nodos do cluster e computadores hospedeiros), é necessário escrever quatro arquivos de configuração, um por host do nó.

- Cada nó de dados ou nó SQL requer um arquivo `my.cnf` que fornece duas informações: uma string de conexão que indica ao nó onde encontrar o nó de gerenciamento e uma linha que instrui o servidor MySQL neste host (a máquina que hospeda o nó de dados) a habilitar o mecanismo de armazenamento `NDBCLUSTER`.

  Para obter mais informações sobre as cadeias de conexão, consulte Seção 21.4.3.3, “Cadeias de conexão do NDB Cluster”.

- O nó de gerenciamento precisa de um arquivo `config.ini` que indique quantos repositórios de fragmentos devem ser mantidos, quanto memória deve ser alocada para dados e índices em cada nó de dados, onde encontrar os nós de dados, onde salvar os dados no disco em cada nó de dados e onde encontrar quaisquer nós SQL.

**Configurando os nós de dados e os nós SQL.** O arquivo `my.cnf` necessário para os nós de dados é bastante simples. O arquivo de configuração deve estar localizado no diretório `/etc` e pode ser editado usando qualquer editor de texto. (Crie o arquivo se ele não existir.) Por exemplo:

```sql
$> vi /etc/my.cnf
```

Nota

Mostramos que o **vi** está sendo usado aqui para criar o arquivo, mas qualquer editor de texto deve funcionar da mesma forma.

Para cada nó de dados e nó de SQL no nosso exemplo de configuração, o arquivo `my.cnf` deve ter a seguinte aparência:

```sql
[mysqld]
# Options for mysqld process:
ndbcluster                      # run NDB storage engine

[mysql_cluster]
# Options for NDB Cluster processes:
ndb-connectstring=198.51.100.10  # location of management server
```

Após inserir as informações anteriores, armazene esse arquivo e feche o editor de texto. Faça isso para as máquinas que hospedam o nó de dados "A", o nó de dados "B" e o nó SQL.

Importante

Depois de iniciar um processo **mysqld** com os parâmetros `ndbcluster` e `ndb-connectstring` nas seções `[mysqld]` e `[mysql_cluster]` do arquivo `my.cnf`, conforme mostrado anteriormente, você não pode executar quaisquer instruções `CREATE TABLE` ou `ALTER TABLE` sem ter iniciado o cluster. Caso contrário, essas instruções falharão com um erro. Isso é feito propositalmente.

**Configurando o nó de gerenciamento.** O primeiro passo para configurar o nó de gerenciamento é criar o diretório onde o arquivo de configuração pode ser encontrado e, em seguida, criar o próprio arquivo. Por exemplo (executando como `root`):

```sql
$> mkdir /var/lib/mysql-cluster
$> cd /var/lib/mysql-cluster
$> vi config.ini
```

Para a configuração representativa, o arquivo `config.ini` deve ser lido da seguinte forma:

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

O banco de dados `world` pode ser baixado em https://dev.mysql.com/doc/index-other.html.

Depois que todos os arquivos de configuração forem criados e essas opções mínimas forem especificadas, você estará pronto para iniciar o clúster e verificar se todos os processos estão em execução. Discutimos como isso é feito em Seção 21.3.4, “Inicialização do Clúster NDB”.

Para obter informações mais detalhadas sobre os parâmetros de configuração do NDB Cluster disponíveis e seus usos, consulte Seção 21.4.3, “Arquivos de Configuração do NDB Cluster” e Seção 21.4, “Configuração do NDB Cluster”. Para a configuração do NDB Cluster em relação à realização de backups, consulte Seção 21.6.8.3, “Configuração para Backups do NDB Cluster”.

A porta padrão para os nós de gerenciamento do cluster é 1186. Para os nós de dados, o cluster pode alocar automaticamente portas dos que já estão livres.
