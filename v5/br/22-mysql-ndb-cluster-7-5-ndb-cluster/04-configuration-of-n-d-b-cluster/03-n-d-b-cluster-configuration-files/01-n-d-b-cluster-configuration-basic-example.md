#### 21.4.3.1 Configuração do NDB Cluster: Exemplo Básico

Para suportar o NDB Cluster, você deve atualizar o `my.cnf` conforme mostrado no exemplo a seguir. Você também pode especificar esses parâmetros na linha de comando ao invocar os executáveis.

Nota

As opções mostradas aqui não devem ser confundidas com aquelas usadas nos arquivos de configuração global `config.ini`. As opções de configuração global são discutidas mais adiante nesta seção.

```sql
# my.cnf
# example additions to my.cnf for NDB Cluster
# (valid in MySQL 5.7)

# enable ndbcluster storage engine, and provide connection string for
# management server host (default port is 1186)
[mysqld]
ndbcluster
ndb-connectstring=ndb_mgmd.mysql.com


# provide connection string for management server host (default port: 1186)
[ndbd]
connect-string=ndb_mgmd.mysql.com

# provide connection string for management server host (default port: 1186)
[ndb_mgm]
connect-string=ndb_mgmd.mysql.com

# provide location of cluster configuration file
# IMPORTANT: When starting the management server with this option in the
# configuration file, the use of --initial or --reload on the command line when
# invoking ndb_mgmd is also required.
[ndb_mgmd]
config-file=/etc/config.ini
```

(Para mais informações sobre *connection strings*, consulte [Section 21.4.3.3, “NDB Cluster Connection Strings”](mysql-cluster-connection-strings.html "21.4.3.3 NDB Cluster Connection Strings").)

```sql
# my.cnf
# example additions to my.cnf for NDB Cluster
# (works on all versions)

# enable ndbcluster storage engine, and provide connection string for management
# server host to the default port 1186
[mysqld]
ndbcluster
ndb-connectstring=ndb_mgmd.mysql.com:1186
```

Importante

Depois de iniciar um processo [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") com os parâmetros [`NDBCLUSTER`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") e `ndb-connectstring` na seção `[mysqld]` do arquivo `my.cnf`, conforme mostrado anteriormente, você não poderá executar nenhuma instrução [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") ou [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") sem que o Cluster tenha sido realmente iniciado. Caso contrário, essas instruções falharão com um erro. *Isto é intencional*.

Você também pode usar uma seção separada `[mysql_cluster]` no arquivo `my.cnf` do Cluster para configurações a serem lidas e usadas por todos os executáveis:

```sql
# cluster-specific settings
[mysql_cluster]
ndb-connectstring=ndb_mgmd.mysql.com:1186
```

Para variáveis [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") adicionais que podem ser definidas no arquivo `my.cnf`, consulte [Section 21.4.3.9.2, “NDB Cluster System Variables”](mysql-cluster-options-variables.html#mysql-cluster-system-variables "21.4.3.9.2 NDB Cluster System Variables").

O arquivo de configuração global para o NDB Cluster é, por convenção, denominado `config.ini` (mas isso não é obrigatório). Se necessário, ele é lido pelo [**ndb_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon") na inicialização e pode ser colocado em qualquer local que possa ser lido por ele. O local e o nome da configuração são especificados usando [`--config-file=path_name`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_config-file) com [**ndb_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon") na linha de comando. Esta opção não tem valor *default*, e é ignorada se o [**ndb_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon") usar o cache de configuração.

O arquivo de configuração global para o NDB Cluster usa o formato INI, que consiste em seções precedidas por cabeçalhos de seção (envolvidos por colchetes), seguidos pelos nomes e valores apropriados dos parâmetros. Um desvio do formato INI padrão é que o nome e o valor do parâmetro podem ser separados por dois pontos (`:`) ou pelo sinal de igual (`=`); no entanto, o sinal de igual é o preferido. Outro desvio é que as seções não são identificadas unicamente pelo nome da seção. Em vez disso, seções únicas (como dois *Nodes* diferentes do mesmo tipo) são identificadas por um ID único especificado como um parâmetro dentro da seção.

Valores *default* são definidos para a maioria dos parâmetros e também podem ser especificados no `config.ini`. Para criar uma seção de valor *default*, basta adicionar a palavra `default` ao nome da seção. Por exemplo, uma seção `[ndbd]` contém parâmetros que se aplicam a um *Data Node* particular, enquanto uma seção `[ndbd default]` contém parâmetros que se aplicam a todos os *Data Nodes*. Suponha que todos os *Data Nodes* devam usar o mesmo tamanho de memória de dados. Para configurar todos eles, crie uma seção `[ndbd default]` que contenha uma linha [`DataMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datamemory) para especificar o tamanho da memória de dados.

Se usada, a seção `[ndbd default]` deve preceder quaisquer seções `[ndbd]` no arquivo de configuração. Isto também é verdade para seções `default` de qualquer outro tipo.

Nota

Em algumas versões mais antigas do NDB Cluster, não havia um valor *default* para [`NoOfReplicas`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-noofreplicas), que sempre precisava ser especificado explicitamente na seção `[ndbd default]`. Embora este parâmetro agora tenha um valor *default* de 2, que é a configuração recomendada na maioria dos cenários de uso comum, ainda é uma prática recomendada definir este parâmetro explicitamente.

O arquivo de configuração global deve definir os computadores e *nodes* envolvidos no Cluster e em quais computadores esses *nodes* estão localizados. Um exemplo de um arquivo de configuração simples para um Cluster consistindo de um servidor de gerenciamento, dois *Data Nodes* e dois MySQL Servers é mostrado aqui:

```sql
# file "config.ini" - 2 data nodes and 2 SQL nodes
# This file is placed in the startup directory of ndb_mgmd (the
# management server)
# The first MySQL Server can be started from any host. The second
# can be started only on the host mysqld_5.mysql.com

[ndbd default]
NoOfReplicas= 2
DataDir= /var/lib/mysql-cluster

[ndb_mgmd]
Hostname= ndb_mgmd.mysql.com
DataDir= /var/lib/mysql-cluster

[ndbd]
HostName= ndbd_2.mysql.com

[ndbd]
HostName= ndbd_3.mysql.com

[mysqld]
[mysqld]
HostName= mysqld_5.mysql.com
```

Nota

O exemplo anterior destina-se a ser uma configuração inicial mínima para fins de familiarização com o NDB Cluster e é quase certo que não será suficiente para ambientes de produção. Consulte [Section 21.4.3.2, “Recommended Starting Configuration for NDB Cluster”](mysql-cluster-config-starting.html "21.4.3.2 Recommended Starting Configuration for NDB Cluster"), que fornece um exemplo de configuração inicial mais completo.

Cada *Node* possui sua própria seção no arquivo `config.ini`. Por exemplo, este Cluster possui dois *Data Nodes*, portanto, o arquivo de configuração anterior contém duas seções `[ndbd]` definindo esses *nodes*.

Nota

Não coloque comentários na mesma linha que um cabeçalho de seção no arquivo `config.ini`; isso faz com que o servidor de gerenciamento não inicie, pois ele não consegue analisar o arquivo de configuração em tais casos.

##### Seções do Arquivo config.ini

Existem seis seções diferentes que você pode usar no arquivo de configuração `config.ini`, conforme descrito na lista a seguir:

* `[computer]`: Define os hosts do Cluster. Isto não é obrigatório para configurar um NDB Cluster viável, mas pode ser usado como uma conveniência ao configurar um Cluster grande. Consulte [Section 21.4.3.4, “Defining Computers in an NDB Cluster”](mysql-cluster-computer-definition.html "21.4.3.4 Defining Computers in an NDB Cluster"), para mais informações.

* `[ndbd]`: Define um *Data Node* do Cluster (processo [**ndbd**](mysql-cluster-programs-ndbd.html "21.5.1 ndbd — The NDB Cluster Data Node Daemon")). Consulte [Section 21.4.3.6, “Defining NDB Cluster Data Nodes”](mysql-cluster-ndbd-definition.html "21.4.3.6 Defining NDB Cluster Data Nodes"), para obter detalhes.

* `[mysqld]`: Define os *Nodes* do MySQL Server do Cluster (também chamados de *SQL Nodes* ou *API Nodes*). Para uma discussão sobre a configuração de *SQL Nodes*, consulte [Section 21.4.3.7, “Defining SQL and Other API Nodes in an NDB Cluster”](mysql-cluster-api-definition.html "21.4.3.7 Defining SQL and Other API Nodes in an NDB Cluster").

* `[mgm]` ou `[ndb_mgmd]`: Define um *Node* do servidor de gerenciamento do Cluster (*MGM* Node). Para informações sobre a configuração de *Management Nodes*, consulte [Section 21.4.3.5, “Defining an NDB Cluster Management Server”](mysql-cluster-mgm-definition.html "21.4.3.5 Defining an NDB Cluster Management Server").

* `[tcp]`: Define uma conexão TCP/IP entre os *Nodes* do Cluster, sendo TCP/IP o protocolo de transporte *default*. Normalmente, as seções `[tcp]` ou `[tcp default]` não são necessárias para configurar um NDB Cluster, pois o Cluster trata disso automaticamente; no entanto, pode ser necessário em algumas situações substituir os *defaults* fornecidos pelo Cluster. Consulte [Section 21.4.3.10, “NDB Cluster TCP/IP Connections”](mysql-cluster-tcp-definition.html "21.4.3.10 NDB Cluster TCP/IP Connections"), para obter informações sobre os parâmetros de configuração TCP/IP disponíveis e como usá-los. (Você também pode achar [Section 21.4.3.11, “NDB Cluster TCP/IP Connections Using Direct Connections”](mysql-cluster-tcp-definition-direct.html "21.4.3.11 NDB Cluster TCP/IP Connections Using Direct Connections") interessante em alguns casos.)

* `[shm]`: Define conexões de memória compartilhada (*shared-memory*) entre *nodes*. No MySQL 5.7, ele está ativado por *default*, mas ainda deve ser considerado experimental. Para uma discussão sobre interconexões SHM, consulte [Section 21.4.3.12, “NDB Cluster Shared Memory Connections”](mysql-cluster-shm-definition.html "21.4.3.12 NDB Cluster Shared Memory Connections").

* `[sci]`: Define conexões Scalable Coherent Interface entre *Data Nodes* do Cluster. Não é suportado no NDB 7.5 ou 7.6.

Você pode definir valores `default` para cada seção. Se usada, uma seção `default` deve vir antes de quaisquer outras seções desse tipo. Por exemplo, uma seção `[ndbd default]` deve aparecer no arquivo de configuração antes de quaisquer seções `[ndbd]`.

Os nomes dos parâmetros do NDB Cluster não diferenciam maiúsculas de minúsculas (*case-insensitive*), a menos que especificados nos arquivos `my.cnf` ou `my.ini` do MySQL Server.