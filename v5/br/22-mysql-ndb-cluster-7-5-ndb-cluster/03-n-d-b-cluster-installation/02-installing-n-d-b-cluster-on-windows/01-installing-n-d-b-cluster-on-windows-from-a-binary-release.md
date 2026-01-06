#### 21.3.2.1 Instalação do NDB Cluster no Windows a partir de uma versão binária

Esta seção descreve uma instalação básica do NDB Cluster no Windows usando uma versão binária “sem instalação” do NDB Cluster fornecida pela Oracle, utilizando a mesma configuração de 4 nós descrita no início desta seção (consulte Seção 21.3, “Instalação do NDB Cluster”), conforme mostrado na tabela a seguir:

**Tabela 21.6 Endereços de rede dos nós no cluster de exemplo**

<table><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Nó</th> <th>Endereço IP</th> </tr></thead><tbody><tr> <td>Núcleo de gestão (<span class="command"><strong>mgmd</strong></span>)</td> <td>198.51.100.10</td> </tr><tr> <td>nó SQL (<a class="link" href="mysqld.html" title="4.3.1 mysqld — O Servidor MySQL"><span class="command"><strong>mysqld</strong></span></a>)</td> <td>198.51.100.20</td> </tr><tr> <td>Núcleo de dados "A" (<a class="link" href="mysql-cluster-programs-ndbd.html" title="21.5.1 ndbd — O daemon do nó de dados do clúster NDB"><span class="command"><strong>ndbd</strong></span></a>)</td> <td>198.51.100.30</td> </tr><tr> <td>Nodo de dados "B" (<a class="link" href="mysql-cluster-programs-ndbd.html" title="21.5.1 ndbd — O daemon do nó de dados do clúster NDB"><span class="command"><strong>ndbd</strong></span></a>)</td> <td>198.51.100.40</td> </tr></tbody></table>

Como em outras plataformas, o computador hospedeiro do NDB Cluster que executa um nó SQL deve ter instalado nele um binário do Servidor MySQL (**mysqld.exe**). Você também deve ter o cliente MySQL (**mysql.exe**) neste host. Para os nós de gerenciamento e os nós de dados, não é necessário instalar o binário do Servidor MySQL; no entanto, cada nó de gerenciamento requer o daemon do servidor de gerenciamento (**ndb\_mgmd.exe**); cada nó de dados requer o daemon de nó de dados (**ndbd.exe** ou **ndbmtd.exe**). Para este exemplo, referenciamos **ndbd.exe** como o executável do nó de dados, mas você pode instalar **ndbmtd.exe**, a versão multithread deste programa, da mesma maneira. Você também deve instalar o cliente de gerenciamento (**ndb\_mgm.exe**) no host do servidor de gerenciamento. Esta seção abrange os passos necessários para instalar os binários corretos do Windows para cada tipo de nó do NDB Cluster.

Nota

Assim como outros programas do Windows, os executáveis do NDB Cluster têm a extensão de arquivo `.exe`. No entanto, não é necessário incluir a extensão `.exe` ao invocar esses programas a partir da linha de comando. Portanto, frequentemente nos referimos a esses programas nesta documentação como **mysqld**, **mysql**, **ndb\_mgmd** e assim por diante. Você deve entender que, seja qual for o nome que usamos (por exemplo, **mysqld** ou **mysqld.exe**, ambos significam a mesma coisa - o programa do Servidor MySQL).

Para configurar um NDB Cluster usando os binários `no-install` da Oracle, o primeiro passo no processo de instalação é baixar o arquivo ZIP de binário mais recente do NDB Cluster para Windows a partir de <https://dev.mysql.com/downloads/cluster/>. Este arquivo tem um nome de arquivo de `mysql-cluster-gpl-ver-winarch.zip`, onde *`ver`* é a versão do motor de armazenamento `NDB` (como `7.6.35`) e *`arch`* é a arquitetura (`32` para binários de 32 bits e `64` para binários de 64 bits). Por exemplo, o arquivo NDB Cluster 7.6.35 para sistemas Windows de 64 bits é chamado `mysql-cluster-gpl-7.6.35-win64.zip`.

Você pode executar os binários do NDB Cluster de 32 bits em versões de 32 bits e 64 bits do Windows; no entanto, os binários do NDB Cluster de 64 bits só podem ser usados em versões de 64 bits do Windows. Se você estiver usando uma versão de 32 bits do Windows em um computador com uma CPU de 64 bits, então você deve usar os binários do NDB Cluster de 32 bits.

Para minimizar o número de arquivos que precisam ser baixados da Internet ou copiados entre máquinas, começamos pelo computador onde você pretende executar o nó SQL.

**Núcleo do SQL.** Suponhamos que você tenha colocado uma cópia do arquivo no diretório `C:\Documentos e Configurações\nome_do_usuário\Meus Documentos\Downloads` no computador com o endereço IP 198.51.100.20, onde *`nome_do_usuário`* é o nome do usuário atual. (Você pode obter esse nome usando `ECHO %USERNAME%` na linha de comando.) Para instalar e executar os executáveis do NDB Cluster como serviços do Windows, esse usuário deve ser membro do grupo `Administradores`.

Extraia todos os arquivos do arquivo. O Assistente de Extração integrado ao Explorador do Windows é adequado para essa tarefa. (Se você usar um programa de arquivo diferente, certifique-se de que ele extraia todos os arquivos e diretórios do arquivo e que preserve a estrutura de diretórios do arquivo.) Quando você for solicitado um diretório de destino, insira `C:\`, o que faz com que o Assistente de Extração extraia o arquivo para o diretório `C:\mysql-cluster-gpl-ver-winarch`. Renomeie esse diretório para `C:\mysql`.

É possível instalar os binários do NDB Cluster em diretórios diferentes de `C:\mysql\bin`; no entanto, se você fizer isso, deve modificar os caminhos mostrados neste procedimento conforme necessário. Em particular, se o binário do Servidor MySQL (nó SQL) estiver instalado em um local diferente de `C:\mysql` ou `C:\Program Files\MySQL\MySQL Server 5.7`, ou se o diretório de dados do nó SQL estiver em um local diferente de `C:\mysql\data` ou `C:\Program Files\MySQL\MySQL Server 5.7\data`, opções de configuração adicionais devem ser usadas na linha de comando ou adicionadas ao arquivo `my.ini` ou `my.cnf` ao iniciar o nó SQL. Para obter mais informações sobre como configurar um Servidor MySQL para rodar em um local não padrão, consulte Seção 2.3.4, “Instalando o MySQL no Microsoft Windows usando um arquivo ZIP `noinstall`”.

Para que um servidor MySQL com suporte ao NDB Cluster funcione como parte de um NDB Cluster, ele deve ser iniciado com as opções `--ndbcluster` e `--ndb-connectstring`. Embora você possa especificar essas opções na linha de comando, geralmente é mais conveniente colocá-las em um arquivo de opções. Para fazer isso, crie um novo arquivo de texto no Bloco de Notas ou em outro editor de texto. Insira as seguintes informações de configuração neste arquivo:

```sql
[mysqld]
# Options for mysqld process:
ndbcluster                       # run NDB storage engine
ndb-connectstring=198.51.100.10  # location of management server
```

Você pode adicionar outras opções usadas por este servidor MySQL, se desejar (consulte Seção 2.3.4.2, “Criando um arquivo de opção”), mas o arquivo deve conter, no mínimo, as opções mostradas. Salve este arquivo como `C:\mysql\my.ini`. Isso completa a instalação e configuração do nó SQL.

**Nodos de dados.** Um nó de dados de um NDB Cluster em um host Windows requer apenas um único executável, sendo um dos arquivos **ndbd.exe** ou **ndbmtd.exe**. Para este exemplo, assumimos que você está usando **ndbd.exe**, mas as mesmas instruções se aplicam ao uso de **ndbmtd.exe**. Em cada computador onde você deseja executar um nó de dados (os computadores com os endereços IP 198.51.100.30 e 198.51.100.40), crie os diretórios `C:\mysql`, `C:\mysql\bin` e `C:\mysql\cluster-data`; em seguida, no computador onde você baixou e extraiu o arquivo `no-install`, localize o arquivo **ndbd.exe** no diretório `C:\mysql\bin`. Copie este arquivo para o diretório `C:\mysql\bin` em cada um dos dois hosts dos nós de dados.

Para funcionar como parte de um NDB Cluster, cada nó de dados deve receber o endereço ou o nome de host do servidor de gerenciamento. Você pode fornecer essas informações na linha de comando usando a opção `--ndb-connectstring` ou a opção `-c` ao iniciar cada processo do nó de dados. No entanto, geralmente é preferível colocar essas informações em um arquivo de opção. Para fazer isso, crie um novo arquivo de texto no Bloco de Notas ou em outro editor de texto e insira o seguinte texto:

```sql
[mysql_cluster]
# Options for data node process:
ndb-connectstring=198.51.100.10  # location of management server
```

Salve esse arquivo como `C:\mysql\my.ini` no host do nó de dados. Crie outro arquivo de texto contendo as mesmas informações e salve-o como `C:mysql\my.ini` no outro host do nó de dados, ou copie o arquivo my.ini do primeiro host do nó de dados para o segundo, garantindo que a cópia esteja no diretório `C:\mysql` do segundo nó de dados. Ambos os hosts dos nós de dados estão agora prontos para serem usados no NDB Cluster, o que deixa apenas o nó de gerenciamento a ser instalado e configurado.

**Núcleo de gerenciamento.** O único programa executável necessário em um computador usado para hospedar um nó de gerenciamento de NDB Cluster é o programa do servidor de gerenciamento **ndb\_mgmd.exe**. No entanto, para administrar o NDB Cluster uma vez que ele tenha sido iniciado, você também deve instalar o programa cliente de gerenciamento do NDB Cluster **ndb\_mgm.exe** na mesma máquina que o servidor de gerenciamento. Localize esses dois programas na máquina onde você baixou e extraiu o arquivo `no-install`; esse deve ser o diretório `C:\mysql\bin` no host do nó SQL. Crie o diretório `C:\mysql\bin` no computador com o endereço IP 198.51.100.10, depois copie os dois programas para esse diretório.

Agora, você deve criar dois arquivos de configuração para uso pelo `ndb_mgmd.exe`:

1. Um arquivo de configuração local para fornecer dados de configuração específicos para o próprio nó de gerenciamento. Normalmente, esse arquivo precisa apenas fornecer a localização do arquivo de configuração global do NDB Cluster (veja o item 2).

   Para criar esse arquivo, abra um novo arquivo de texto no Bloco de Notas ou em outro editor de texto e insira as seguintes informações:

   ```sql
   [mysql_cluster]
   # Options for management node process
   config-file=C:/mysql/bin/config.ini
   ```

   Salve este arquivo como o arquivo de texto `C:\mysql\bin\my.ini`.

2. Um arquivo de configuração global a partir do qual o nó de gerenciamento pode obter informações de configuração que regem o NDB Cluster como um todo. No mínimo, este arquivo deve conter uma seção para cada nó no NDB Cluster, e os endereços IP ou nomes de host do nó de gerenciamento e de todos os nós de dados (`parâmetro de configuração HostName`). Também é aconselhável incluir as seguintes informações adicionais:

   - O endereço IP ou o nome do host de quaisquer nós SQL

   - A memória de dados e a memória de índice alocados para cada nó de dados (`DataMemory` e `IndexMemory` parâmetros de configuração)

   - O número de réplicas de fragmentos, usando o parâmetro de configuração `NoOfReplicas` (veja Seção 21.2.2, "Nodos do Clúster NDB, Grupos de Nó, Réplicas de Fragmentos e Partições")

   - O diretório onde cada nó de dados armazena seus dados e arquivos de log, e o diretório onde o nó de gerenciamento mantém seus arquivos de log (em ambos os casos, o parâmetro de configuração `DataDir`)

   Crie um novo arquivo de texto usando um editor de texto como o Bloco de Notas e insira as seguintes informações:

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

   Salve esse arquivo como o arquivo de texto `C:\mysql\bin\config.ini`.

Importante

Um único caractere barra invertida (`\`) não pode ser usado ao especificar caminhos de diretório em opções de programas ou arquivos de configuração usados pelo NDB Cluster no Windows. Em vez disso, você deve escapar cada caractere barra invertida com uma segunda barra invertida (`\\`) ou substituir a barra invertida por um caractere barra diagonal (`/`). Por exemplo, a seguinte linha da seção `[ndb_mgmd]` de um arquivo `config.ini` do NDB Cluster não funciona:

```sql
DataDir=C:\mysql\bin\cluster-logs
```

Em vez disso, você pode usar qualquer um dos seguintes:

```sql
DataDir=C:\\mysql\\bin\\cluster-logs  # Escaped backslashes
```

```sql
DataDir=C:/mysql/bin/cluster-logs     # Forward slashes
```

Por razões de brevidade e legibilidade, recomendamos que você use barras inclinadas em caminhos de diretórios usados nas opções do programa NDB Cluster e em arquivos de configuração no Windows.
