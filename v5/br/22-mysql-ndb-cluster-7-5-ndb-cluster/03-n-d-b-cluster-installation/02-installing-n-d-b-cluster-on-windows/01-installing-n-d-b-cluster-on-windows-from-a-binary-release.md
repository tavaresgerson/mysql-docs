#### 21.3.2.1 Instalando o NDB Cluster no Windows a partir de um Lançamento Binário

Esta seção descreve uma instalação básica do NDB Cluster no Windows usando um lançamento binário do NDB Cluster "sem instalação" (no-install) fornecido pela Oracle, utilizando a mesma configuração de 4 nós descrita no início desta seção (consulte [Section 21.3, “NDB Cluster Installation”](mysql-cluster-installation.html "21.3 NDB Cluster Installation")), conforme mostrado na tabela a seguir:

**Tabela 21.6 Endereços de rede dos nós no Cluster de exemplo**

<table><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Nó</th> <th>Endereço IP</th> </tr></thead><tbody><tr> <td>Management node (<span><strong>mgmd</strong></span>)</td> <td>198.51.100.10</td> </tr><tr> <td>SQL node (<span><strong>mysqld</strong></span>)</td> <td>198.51.100.20</td> </tr><tr> <td>Data node "A" (<span><strong>ndbd</strong></span>)</td> <td>198.51.100.30</td> </tr><tr> <td>Data node "B" (<span><strong>ndbd</strong></span>)</td> <td>198.51.100.40</td> </tr> </tbody></table>

Assim como em outras plataformas, o computador host do NDB Cluster que executa um SQL node deve ter instalado um binário do MySQL Server ([**mysqld.exe**](mysqld.html "4.3.1 mysqld — The MySQL Server")). Você também deve ter o client MySQL ([**mysql.exe**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client")) neste host. Para management nodes e data nodes, não é necessário instalar o binário do MySQL Server; no entanto, cada management node requer o daemon do management server ([**ndb_mgmd.exe**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon")); cada data node requer o data node daemon ([**ndbd.exe**](mysql-cluster-programs-ndbd.html "21.5.1 ndbd — The NDB Cluster Data Node Daemon") ou [**ndbmtd.exe**](mysql-cluster-programs-ndbmtd.html "21.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)")). Para este exemplo, referimo-nos a [**ndbd.exe**](mysql-cluster-programs-ndbd.html "21.5.1 ndbd — The NDB Cluster Data Node Daemon") como o Data node executable, mas você pode instalar [**ndbmtd.exe**](mysql-cluster-programs-ndbmtd.html "21.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)"), a versão multithreaded deste programa, em vez disso, exatamente da mesma maneira. Você também deve instalar o management client ([**ndb_mgm.exe**](mysql-cluster-programs-ndb-mgm.html "21.5.5 ndb_mgm — The NDB Cluster Management Client")) no host do management server. Esta seção cobre os passos necessários para instalar os binários corretos do Windows para cada tipo de nó do NDB Cluster.

Observação

Assim como em outros programas do Windows, os executáveis do NDB Cluster são nomeados com a extensão de arquivo `.exe`. No entanto, não é necessário incluir a extensão `.exe` ao invocar esses programas a partir da linha de comando. Portanto, frequentemente nos referimos a esses programas nesta documentação simplesmente como [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server"), [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client"), [**ndb_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon") e assim por diante. Você deve entender que, quer nos refiramos (por exemplo) a [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") ou [**mysqld.exe**](mysqld.html "4.3.1 mysqld — The MySQL Server"), qualquer um dos nomes significa a mesma coisa (o programa MySQL Server).

Para configurar um NDB Cluster usando os binários `no-install` da Oracle, o primeiro passo no processo de instalação é fazer o download do arquivo binário ZIP mais recente do NDB Cluster Windows em <https://dev.mysql.com/downloads/cluster/>. Este arquivo tem um nome no formato `mysql-cluster-gpl-ver-winarch.zip`, onde *`ver`* é a versão do storage engine `NDB` (como `7.6.35`) e *`arch`* é a architecture (`32` para binários de 32 bits e `64` para binários de 64 bits). Por exemplo, o arquivo NDB Cluster 7.6.35 para sistemas Windows de 64 bits é nomeado `mysql-cluster-gpl-7.6.35-win64.zip`.

Você pode executar binários NDB Cluster de 32 bits em versões de 32 bits e 64 bits do Windows; no entanto, binários NDB Cluster de 64 bits podem ser usados apenas em versões de 64 bits do Windows. Se você estiver usando uma versão de 32 bits do Windows em um computador que possui uma CPU de 64 bits, você deve usar os binários NDB Cluster de 32 bits.

Para minimizar o número de arquivos que precisam ser baixados da Internet ou copiados entre máquinas, começamos com o computador onde você pretende executar o SQL node.

**SQL node.** Presumimos que você colocou uma cópia do archive no diretório `C:\Documents and Settings\username\My Documents\Downloads` no computador com o endereço IP 198.51.100.20, onde *`username`* é o nome do usuário atual. (Você pode obter este nome usando `ECHO %USERNAME%` na linha de comando.) Para instalar e executar executáveis do NDB Cluster como Windows services, este usuário deve ser membro do grupo `Administrators`.

Extraia todos os arquivos do archive. O Extraction Wizard integrado ao Windows Explorer é adequado para esta tarefa. (Se você usar um programa de archive diferente, certifique-se de que ele extraia todos os arquivos e diretórios do archive e que preserve a estrutura de diretórios do archive.) Quando for solicitado um diretório de destino, digite `C:\`, o que faz com que o Extraction Wizard extraia o archive para o diretório `C:\mysql-cluster-gpl-ver-winarch`. Renomeie este diretório para `C:\mysql`.

É possível instalar os binários do NDB Cluster em diretórios diferentes de `C:\mysql\bin`; no entanto, se o fizer, você deve modificar os paths mostrados neste procedimento de acordo. Em particular, se o binário do MySQL Server (SQL node) for instalado em um local diferente de `C:\mysql` ou `C:\Program Files\MySQL\MySQL Server 5.7`, ou se o data directory do SQL node estiver em um local diferente de `C:\mysql\data` ou `C:\Program Files\MySQL\MySQL Server 5.7\data`, opções de configuração extras devem ser usadas na linha de comando ou adicionadas ao arquivo `my.ini` ou `my.cnf` ao iniciar o SQL node. Para obter mais informações sobre como configurar um MySQL Server para rodar em um local não padrão, consulte [Section 2.3.4, “Installing MySQL on Microsoft Windows Using a `noinstall` ZIP Archive”](windows-install-archive.html "2.3.4 Installing MySQL on Microsoft Windows Using a noinstall ZIP Archive").

Para que um MySQL Server com suporte a NDB Cluster funcione como parte de um NDB Cluster, ele deve ser iniciado com as opções [`--ndbcluster`](mysql-cluster-options-variables.html#option_mysqld_ndbcluster) e [`--ndb-connectstring`](mysql-cluster-options-variables.html#option_mysqld_ndb-connectstring). Embora você possa especificar estas opções na linha de comando, geralmente é mais conveniente colocá-las em um option file. Para fazer isso, crie um novo arquivo de texto no Notepad ou em outro editor de texto. Insira as seguintes informações de configuração neste arquivo:

```sql
[mysqld]
# Options for mysqld process:
ndbcluster                       # run NDB storage engine
ndb-connectstring=198.51.100.10  # location of management server
```

Você pode adicionar outras opções usadas por este MySQL Server, se desejar (consulte [Section 2.3.4.2, “Creating an Option File”](windows-create-option-file.html "2.3.4.2 Creating an Option File")), mas o arquivo deve conter no mínimo as opções mostradas. Salve este arquivo como `C:\mysql\my.ini`. Isso conclui a instalação e a configuração para o SQL node.

**Data nodes.** Um data node do NDB Cluster em um host Windows requer apenas um único executable, um dos [**ndbd.exe**](mysql-cluster-programs-ndbd.html "21.5.1 ndbd — The NDB Cluster Data Node Daemon") ou [**ndbmtd.exe**](mysql-cluster-programs-ndbmtd.html "21.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)"). Para este exemplo, presumimos que você está usando [**ndbd.exe**](mysql-cluster-programs-ndbd.html "21.5.1 ndbd — The NDB Cluster Data Node Daemon"), mas as mesmas instruções se aplicam ao usar [**ndbmtd.exe**](mysql-cluster-programs-ndbmtd.html "21.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)"). Em cada computador onde você deseja executar um data node (os computadores com os endereços IP 198.51.100.30 e 198.51.100.40), crie os diretórios `C:\mysql`, `C:\mysql\bin` e `C:\mysql\cluster-data`; em seguida, no computador onde você baixou e extraiu o archive `no-install`, localize `ndbd.exe` no diretório `C:\mysql\bin`. Copie este arquivo para o diretório `C:\mysql\bin` em cada um dos dois data node hosts.

Para funcionar como parte de um NDB Cluster, cada data node deve receber o endereço ou hostname do management server. Você pode fornecer esta informação na linha de comando usando a opção [`--ndb-connectstring`](mysql-cluster-programs-ndb-config.html#option_ndb_config_ndb-connectstring) ou `-c` ao iniciar cada processo do data node. No entanto, geralmente é preferível colocar esta informação em um option file. Para fazer isso, crie um novo arquivo de texto no Notepad ou em outro editor de texto e insira o seguinte texto:

```sql
[mysql_cluster]
# Options for data node process:
ndb-connectstring=198.51.100.10  # location of management server
```

Salve este arquivo como `C:\mysql\my.ini` no host do data node. Crie outro arquivo de texto contendo a mesma informação e salve-o como `C:mysql\my.ini` no outro host do data node, ou copie o arquivo my.ini do primeiro host do data node para o segundo, certificando-se de colocar a cópia no diretório `C:\mysql` do segundo data node. Ambos os data node hosts estão agora prontos para serem usados no NDB Cluster, restando apenas o management node para ser instalado e configurado.

**Management node.** O único programa executable necessário em um computador usado para hospedar um management node do NDB Cluster é o programa do management server [**ndb_mgmd.exe**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon"). No entanto, para administrar o NDB Cluster depois de iniciado, você também deve instalar o programa NDB Cluster management client [**ndb_mgm.exe**](mysql-cluster-programs-ndb-mgm.html "21.5.5 ndb_mgm — The NDB Cluster Management Client") na mesma máquina que o management server. Localize estes dois programas na máquina onde você baixou e extraiu o archive `no-install`; este deve ser o diretório `C:\mysql\bin` no host do SQL node. Crie o diretório `C:\mysql\bin` no computador com o endereço IP 198.51.100.10 e, em seguida, copie ambos os programas para este diretório.

Você deve agora criar dois configuration files para uso por `ndb_mgmd.exe`:

1. Um configuration file local para fornecer dados de configuração específicos para o management node em si. Tipicamente, este arquivo precisa apenas fornecer a localização do global configuration file do NDB Cluster (consulte o item 2).

   Para criar este arquivo, comece um novo arquivo de texto no Notepad ou em outro editor de texto e insira as seguintes informações:

   ```sql
   [mysql_cluster]
   # Options for management node process
   config-file=C:/mysql/bin/config.ini
   ```

   Salve este arquivo como o arquivo de texto `C:\mysql\bin\my.ini`.

2. Um global configuration file a partir do qual o management node pode obter informações de configuração que regem o NDB Cluster como um todo. No mínimo, este arquivo deve conter uma seção para cada nó no NDB Cluster e os endereços IP ou hostnames para o management node e todos os data nodes (parâmetro de configuração `HostName`). Também é aconselhável incluir as seguintes informações adicionais:

   * O endereço IP ou hostname de quaisquer SQL nodes
   * A data memory e index memory alocadas para cada data node (parâmetros de configuração [`DataMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datamemory) e [`IndexMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-indexmemory))

   * O número de fragment replicas, usando o parâmetro de configuração [`NoOfReplicas`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-noofreplicas) (consulte [Section 21.2.2, “NDB Cluster Nodes, Node Groups, Fragment Replicas, and Partitions”](mysql-cluster-nodes-groups.html "21.2.2 NDB Cluster Nodes, Node Groups, Fragment Replicas, and Partitions"))

   * O diretório onde cada data node armazena seus dados e log file, e o diretório onde o management node mantém seus log files (em ambos os casos, o parâmetro de configuração [`DataDir`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datadir))

   Crie um novo arquivo de texto usando um editor de texto como o Notepad e insira as seguintes informações:

   ```sql
   [ndbd default]
   # Options affecting ndbd processes on all data nodes:
   NoOfReplicas=2                      # Number of fragment replicas
   DataDir=C:/mysql/cluster-data       # Directory for each data node's data files
                                       # Forward slashes used in directory path,
                                       # rather than backslashes. This is correct;
                                       # see Important note in text
   DataMemory=80M    # Memory allocated to data storage
   IndexMemory=18M   # Memory allocated to index storage
                     # For DataMemory and IndexMemory, we have used the
                     # default values. Since the "world" database takes up
                     # only about 500KB, this should be more than enough for
                     # this example Cluster setup.

   [ndb_mgmd]
   # Management process options:
   HostName=198.51.100.10              # Hostname or IP address of management node
   DataDir=C:/mysql/bin/cluster-logs   # Directory for management node log files

   [ndbd]
   # Options for data node "A":
                                   # (one [ndbd] section per data node)
   HostName=198.51.100.30          # Hostname or IP address

   [ndbd]
   # Options for data node "B":
   HostName=198.51.100.40          # Hostname or IP address

   [mysqld]
   # SQL node options:
   HostName=198.51.100.20          # Hostname or IP address
   ```

   Salve este arquivo como o arquivo de texto `C:\mysql\bin\config.ini`.

Importante

Uma única barra invertida (`\`) não pode ser usada ao especificar paths de diretório em program options ou configuration files usados pelo NDB Cluster no Windows. Em vez disso, você deve ou escapar cada barra invertida com uma segunda barra invertida (`\\`), ou substituir a barra invertida por uma barra normal (`/`). Por exemplo, a seguinte linha da seção `[ndb_mgmd]` de um arquivo `config.ini` do NDB Cluster não funciona:

```sql
DataDir=C:\mysql\bin\cluster-logs
```

Em vez disso, você pode usar uma das seguintes opções:

```sql
DataDir=C:\\mysql\\bin\\cluster-logs  # Escaped backslashes
```

```sql
DataDir=C:/mysql/bin/cluster-logs     # Forward slashes
```

Por razões de brevidade e legibilidade, recomendamos que você use barras normais em paths de diretório usados em program options e configuration files do NDB Cluster no Windows.