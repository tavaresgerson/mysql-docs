#### 25.3.2.1 Instalação do NDB Cluster no Windows a partir de uma versão binária

Esta seção descreve uma instalação básica do NDB Cluster no Windows usando uma versão binária "sem instalação" do NDB Cluster fornecida pela Oracle, utilizando a mesma configuração de 4 nós descrita no início desta seção (veja a Seção 25.3, “Instalação do NDB Cluster”), conforme mostrado na tabela a seguir:

**Tabela 25.6 Endereços de rede dos nós no cluster de exemplo**

<table><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Nó</th> <th>Endereço IP</th> </tr></thead><tbody><tr> <td>Nó de gerenciamento (<span class="command"><strong>mgmd</strong></span>)</td> <td>198.51.100.10</td> </tr><tr> <td>Nó de SQL (<a class="link" href="mysqld.html" title="6.3.1 mysqld — O Servidor MySQL"><span class="command"><strong>mysqld</strong></span></a>)</td> <td>198.51.100.20</td> </tr><tr> <td>Nó de dados "A" (<a class="link" href="mysql-cluster-programs-ndbd.html" title="25.5.1 ndbd — O Daemon de Nó de Dados do NDB Cluster"><span class="command"><strong>ndbd</strong></span></a>)</td> <td>198.51.100.30</td> </tr><tr> <td>Nó de dados "B" (<a class="link" href="mysql-cluster-programs-ndbd.html" title="25.5.1 ndbd — O Daemon de Nó de Dados do NDB Cluster"><span class="command"><strong>ndbd</strong></span></a>)</td> <td>198.51.100.40</td> </tr></tbody></table>

Como em outras plataformas, o computador hospedeiro do NDB Cluster que executa um nó SQL deve ter instalado nele um binário do Servidor MySQL (**mysqld.exe**). Você também deve ter o cliente MySQL (**mysql.exe**) neste host. Para os nós de gerenciamento e os nós de dados, não é necessário instalar o binário do Servidor MySQL; no entanto, cada nó de gerenciamento requer o daemon do servidor de gerenciamento (**ndb\_mgmd.exe**); cada nó de dados requer o daemon do nó de dados (**ndbd.exe** ou **ndbmtd.exe**")). Para este exemplo, referenciamos **ndbd.exe** como o executável do nó de dados, mas você pode instalar **ndbmtd.exe**"), a versão multithread deste programa, em vez disso, da mesma maneira. Você também deve instalar o cliente de gerenciamento (**ndb\_mgm.exe**) no host do servidor de gerenciamento. Esta seção abrange os passos necessários para instalar os binários corretos do Windows para cada tipo de nó do NDB Cluster.

Nota

Como com outros programas do Windows, os executaveis do NDB Cluster são nomeados com a extensão de arquivo `.exe`. No entanto, não é necessário incluir a extensão `.exe` ao invocar esses programas a partir da linha de comando. Portanto, muitas vezes simplesmente referenciamos esses programas nesta documentação como **mysqld**, **mysql**, **ndb\_mgmd**, e assim por diante. Você deve entender que, seja (por exemplo) referenciando **mysqld** ou **mysqld.exe**, qualquer nome significa a mesma coisa (o programa do Servidor MySQL).

Para configurar um NDB Cluster usando os binários `no-install` da Oracle, o primeiro passo no processo de instalação é baixar o arquivo ZIP de binários do NDB Cluster Windows mais recente em <https://dev.mysql.com/downloads/cluster/>. Este arquivo tem o nome `mysql-cluster-gpl-ver-winarch.zip`, onde *`ver`* é a versão do motor de armazenamento NDB (*`9.4.0`, por exemplo) e *`arch`* é a arquitetura (*`32`* para binários de 32 bits e *`64`* para binários de 64 bits). Por exemplo, o arquivo NDB Cluster 9.4.0 para sistemas Windows de 64 bits é chamado `mysql-cluster-gpl-9.4.0-win64.zip`.

Você pode executar binários do NDB Cluster de 32 bits em versões de 32 bits e 64 bits do Windows; no entanto, os binários do NDB Cluster de 64 bits só podem ser usados em versões de 64 bits do Windows. Se você estiver usando uma versão de 32 bits do Windows em um computador com uma CPU de 64 bits, então você deve usar os binários do NDB Cluster de 32 bits.

Para minimizar o número de arquivos que precisam ser baixados da Internet ou copiados entre máquinas, começamos com o computador onde você pretende executar o nó SQL.

**Nó SQL**. Suponha que você tenha colocado uma cópia do arquivo no diretório `C:\Documentos e Configurações\username\Documentos\Downloads` no computador com o endereço IP 198.51.100.20, onde *`username`* é o nome do usuário atual. (Você pode obter esse nome usando `ECHO %USERNAME%` na linha de comando.) Para instalar e executar os executáveis do NDB Cluster como serviços do Windows, esse usuário deve ser membro do grupo `Administradores`.

Extraia todos os arquivos do arquivo. O Assistente de Extração integrado ao Explorador do Windows é adequado para essa tarefa. (Se você usar um programa de arquivo diferente, certifique-se de que ele extraia todos os arquivos e diretórios do arquivo e que preserve a estrutura de diretórios do arquivo.) Quando você for solicitado um diretório de destino, insira `C:\`, o que faz com que o Assistente de Extração extraia o arquivo para o diretório `C:\mysql-cluster-gpl-ver-winarch`. Renomeie esse diretório para `C:\mysql`.

É possível instalar os binários do NDB Cluster em diretórios diferentes de `C:\mysql\bin`; no entanto, se você fizer isso, deve modificar os caminhos mostrados neste procedimento conforme necessário. Em particular, se o binário do Servidor MySQL (nó SQL) for instalado em um local diferente de `C:\mysql` ou `C:\Program Files\MySQL\MySQL Server 9.5`, ou se o diretório de dados do nó SQL estiver em um local diferente de `C:\mysql\data` ou `C:\Program Files\MySQL\MySQL Server 9.5\data`, opções de configuração adicionais devem ser usadas na linha de comando ou adicionadas ao arquivo `my.ini` ou `my.cnf` ao iniciar o nó SQL. Para obter mais informações sobre como configurar um Servidor MySQL para rodar em um local não padrão, consulte a Seção 2.3.3, “Configuração: Manual”.

Para que um Servidor MySQL com suporte ao NDB Cluster possa ser executado como parte de um NDB Cluster, ele deve ser iniciado com as opções `--ndbcluster` e `--ndb-connectstring`. Embora você possa especificar essas opções na linha de comando, geralmente é mais conveniente colocá-las em um arquivo de opção. Para fazer isso, crie um novo arquivo de texto no Bloco de Notas ou em outro editor de texto. Insira as seguintes informações de configuração neste arquivo:

```
[mysqld]
# Options for mysqld process:
ndbcluster                       # run NDB storage engine
ndb-connectstring=198.51.100.10  # location of management server
```

Você pode adicionar outras opções usadas por este servidor MySQL, se desejar (veja a Seção 2.3.3.2, “Criando um arquivo de opção”), mas o arquivo deve conter, no mínimo, as opções mostradas. Salve este arquivo como `C:\mysql\my.ini`. Isso completa a instalação e configuração para o nó de SQL.

**Nodos de dados.** Um nó de dados do NDB Cluster em um host Windows requer apenas um único executável, sendo um dos **ndbd.exe** ou **ndbmtd.exe**"). Para este exemplo, assumimos que você está usando **ndbd.exe**, mas as mesmas instruções se aplicam ao usar **ndbmtd.exe**"). Em cada computador onde você deseja executar um nó de dados (os computadores com os endereços IP 198.51.100.30 e 198.51.100.40), crie os diretórios `C:\mysql`, `C:\mysql\bin` e `C:\mysql\cluster-data`; então, no computador onde você baixou e extraiu o arquivo `no-install`, localize o **ndbd.exe** no diretório `C:\mysql\bin`. Copie este arquivo para o diretório `C:\mysql\bin` em cada um dos dois hosts de nó de dados.

Para funcionar como parte de um NDB Cluster, cada nó de dados deve receber o endereço ou o nome do host do servidor de gerenciamento. Você pode fornecer essa informação na linha de comando usando a opção `--ndb-connectstring` ou `-c` ao iniciar cada processo de nó de dados. No entanto, geralmente é preferível colocar essa informação em um arquivo de opção. Para fazer isso, crie um novo arquivo de texto no Bloco de Notas ou em outro editor de texto e insira o seguinte texto:

```
[mysql_cluster]
# Options for data node process:
ndb-connectstring=198.51.100.10  # location of management server
```

Salve este arquivo como `C:\mysql\my.ini` no host do nó de dados. Crie outro arquivo de texto contendo as mesmas informações e salve-o como `C:mysql\my.ini` no outro host do nó de dados, ou copie o arquivo my.ini do primeiro host do nó de dados para o segundo, garantindo que a cópia esteja no diretório `C:\mysql` do segundo nó de dados. Ambos os hosts de nó de dados estão agora prontos para serem usados no NDB Cluster, o que deixa apenas o nó de gerenciamento a ser instalado e configurado.

**Nó de gerenciamento.** O único programa executável necessário em um computador usado para hospedar um nó de gerenciamento do NDB Cluster é o programa do servidor de gerenciamento **ndb\_mgmd.exe**. No entanto, para administrar o NDB Cluster uma vez que tenha sido iniciado, você também deve instalar o programa cliente de gerenciamento do NDB Cluster **ndb\_mgm.exe** na mesma máquina que o servidor de gerenciamento. Localize esses dois programas na máquina onde você baixou e extraiu o arquivo `no-install`; isso deve ser o diretório `C:\mysql\bin` no host do nó SQL. Crie o diretório `C:\mysql\bin` no computador com o endereço IP 198.51.100.10, então copie os dois programas para este diretório.

Agora você deve criar dois arquivos de configuração para uso pelo **ndb_mgmd.exe**:

1. Um arquivo de configuração local para fornecer dados de configuração específicos para o próprio nó de gerenciamento. Tipicamente, este arquivo precisa apenas fornecer a localização do arquivo de configuração global do NDB Cluster (veja o item 2).

Para criar este arquivo, inicie um novo arquivo de texto no Bloco de Notas ou em outro editor de texto e insira as seguintes informações:

```
   [mysql_cluster]
   # Options for management node process
   config-file=C:/mysql/bin/config.ini
   ```

Salve este arquivo como o arquivo de texto `C:\mysql\bin\my.ini`.

2. Um arquivo de configuração global a partir do qual o nó de gerenciamento pode obter informações de configuração que regem o NDB Cluster como um todo. No mínimo, este arquivo deve conter uma seção para cada nó no NDB Cluster, e os endereços IP ou nomes de host do nó de gerenciamento e de todos os nós de dados (`parâmetro de configuração HostName`). Também é aconselhável incluir as seguintes informações adicionais:

   * O endereço IP ou o nome de host de quaisquer nós SQL
   * A memória de dados e a memória de índice alocada para cada nó de dados (`parâmetros de configuração DataMemory e IndexMemory`)
   * O número de réplicas de fragmento, usando o parâmetro de configuração `NoOfReplicas` (veja Seção 25.2.2, “Nodos do NDB Cluster, Grupos de Nó, Replicas de Fragmento e Partições”)
   * O diretório onde cada nó de dados armazena seus dados e arquivo de log, e o diretório onde o nó de gerenciamento mantém seus arquivos de log (em ambos os casos, o parâmetro de configuração `DataDir`)

Crie um novo arquivo de texto usando um editor de texto como o Bloco de Notas, e insira as seguintes informações:

```
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

Um único caractere barra invertida (`\`) não pode ser usado ao especificar caminhos de diretório em opções de programa ou arquivos de configuração usados pelo NDB Cluster no Windows. Em vez disso, você deve escapar cada caractere barra invertida com uma segunda barra invertida (`\\`) ou substituir a barra invertida por um caractere barra diagonal (`/`). Por exemplo, a seguinte linha da seção `[ndb_mgmd]` de um arquivo `config.ini` do NDB Cluster não funciona:

```
DataDir=C:\mysql\bin\cluster-logs
```

Em vez disso, você pode usar qualquer uma das seguintes:

```
DataDir=C:\\mysql\\bin\\cluster-logs  # Escaped backslashes
```

```
DataDir=C:/mysql/bin/cluster-logs     # Forward slashes
```

Por razões de brevidade e legibilidade, recomendamos que você use barras inclinadas em caminhos de diretórios usados nas opções do programa NDB Cluster e em arquivos de configuração no Windows.