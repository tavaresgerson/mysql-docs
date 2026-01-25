### 21.6.10 Uso do MySQL Server para NDB Cluster

[**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") é o processo tradicional do MySQL Server. Para ser usado com o NDB Cluster, o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") precisa ser construído com suporte para a storage engine [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"), como ocorre nos binários pré-compilados disponíveis em <https://dev.mysql.com/downloads/>. Se você construir o MySQL a partir do código fonte, você deve invocar o **CMake** com a opção [`-DWITH_NDBCLUSTER=1`](source-configuration-options.html#option_cmake_with_ndbcluster) para incluir o suporte ao `NDB`.

Para mais informações sobre a compilação do NDB Cluster a partir do código fonte, consulte [Section 21.3.1.4, “Construindo o NDB Cluster a Partir do Código Fonte no Linux”](mysql-cluster-install-linux-source.html "21.3.1.4 Building NDB Cluster from Source on Linux"), e [Section 21.3.2.2, “Compilando e Instalando o NDB Cluster a Partir do Código Fonte no Windows”](mysql-cluster-install-windows-source.html "21.3.2.2 Compiling and Installing NDB Cluster from Source on Windows").

(Para informações sobre opções e variáveis do [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server"), além daquelas discutidas nesta seção, que são relevantes para o NDB Cluster, consulte [Section 21.4.3.9, “Opções e Variáveis do MySQL Server para NDB Cluster”](mysql-cluster-options-variables.html "21.4.3.9 MySQL Server Options and Variables for NDB Cluster").)

Se o binário do [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") foi construído com suporte a Cluster, a storage engine [`NDBCLUSTER`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") ainda está desabilitada por padrão. Você pode usar uma destas duas opções possíveis para habilitar esta engine:

* Use [`--ndbcluster`](mysql-cluster-options-variables.html#option_mysqld_ndbcluster) como uma opção de startup na linha de comando ao iniciar o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server").

* Insira uma linha contendo `ndbcluster` na seção `[mysqld]` do seu arquivo `my.cnf`.

Uma maneira fácil de verificar se o seu Server está rodando com a storage engine [`NDBCLUSTER`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") habilitada é executar a instrução [`SHOW ENGINES`](show-engines.html "13.7.5.16 SHOW ENGINES Statement") no MySQL Monitor ([**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client")). Você deve ver o valor `YES` como o valor de `Support` na linha para [`NDBCLUSTER`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"). Se você vir `NO` nesta linha ou se nenhuma linha desse tipo for exibida na saída (output), você não está executando uma versão do MySQL habilitada para [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"). Se você vir `DISABLED` nesta linha, você precisa habilitá-la de uma das duas maneiras acabadas de descrever.

Para ler dados de configuração do Cluster, o MySQL Server requer no mínimo três informações:

* O próprio Cluster Node ID do MySQL Server
* O host name ou IP address para o management server
* O número da porta TCP/IP na qual ele pode se conectar ao management server

Os Node IDs podem ser alocados dinamicamente, portanto não é estritamente necessário especificá-los explicitamente.

O parâmetro [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") `ndb-connectstring` é usado para especificar a connection string, seja na linha de comando ao iniciar o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server"), ou no `my.cnf`. A connection string contém o host name ou IP address onde o management server pode ser encontrado, assim como a porta TCP/IP que ele utiliza.

No exemplo a seguir, `ndb_mgmd.mysql.com` é o host onde o management server reside, e o management server escuta por mensagens do Cluster na porta 1186:

```sql
$> mysqld --ndbcluster --ndb-connectstring=ndb_mgmd.mysql.com:1186
```

Consulte [Section 21.4.3.3, “NDB Cluster Connection Strings”](mysql-cluster-connection-strings.html "21.4.3.3 NDB Cluster Connection Strings"), para mais informações sobre connection strings.

Dadas estas informações, o MySQL Server pode atuar como um participante completo no Cluster. (Frequentemente nos referimos a um processo [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") rodando desta maneira como um SQL node.) Ele está totalmente ciente de todos os data nodes do Cluster, bem como de seu status, e estabelece conexões com todos os data nodes. Neste caso, ele é capaz de usar qualquer data node como um transaction coordinator e para ler e atualizar dados do node.

Você pode ver no client [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") se um MySQL Server está conectado ao Cluster usando [`SHOW PROCESSLIST`](show-processlist.html "13.7.5.29 SHOW PROCESSLIST Statement"). Se o MySQL Server estiver conectado ao Cluster, e você tiver o privilege [`PROCESS`](privileges-provided.html#priv_process), a primeira linha da saída (output) será mostrada aqui:

```sql
mysql> SHOW PROCESSLIST \G
*************************** 1. row ***************************
     Id: 1
   User: system user
   Host:
     db:
Command: Daemon
   Time: 1
  State: Waiting for event from ndbcluster
   Info: NULL
```

Importante

Para participar de um NDB Cluster, o processo [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") deve ser iniciado com *ambas* as opções [`--ndbcluster`](mysql-cluster-options-variables.html#option_mysqld_ndbcluster) e [`--ndb-connectstring`](mysql-cluster-options-variables.html#option_mysqld_ndb-connectstring) (ou seus equivalentes em `my.cnf`). Se o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") for iniciado apenas com a opção [`--ndbcluster`](mysql-cluster-options-variables.html#option_mysqld_ndbcluster), ou se ele não conseguir contatar o Cluster, não será possível trabalhar com tabelas [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"), *nem será possível criar novas tabelas, independentemente da storage engine*. Esta última restrição é uma medida de segurança destinada a evitar a criação de tabelas com os mesmos nomes que tabelas [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") enquanto o SQL node não estiver conectado ao Cluster. Se você deseja criar tabelas usando uma storage engine diferente enquanto o processo [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") não estiver participando de um NDB Cluster, você deve reiniciar o Server *sem* a opção [`--ndbcluster`](mysql-cluster-options-variables.html#option_mysqld_ndbcluster).