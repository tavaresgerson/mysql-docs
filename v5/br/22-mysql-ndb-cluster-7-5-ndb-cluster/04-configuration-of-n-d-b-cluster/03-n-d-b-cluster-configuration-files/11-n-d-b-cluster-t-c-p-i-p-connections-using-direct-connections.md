#### 21.4.3.11 Conexões TCP/IP do NDB Cluster Usando Conexões Diretas

Configurar um cluster usando conexões diretas entre data nodes requer a especificação explícita dos IP addresses de crossover dos data nodes conectados dessa forma na seção `[tcp]` do arquivo `config.ini` do cluster.

No exemplo a seguir, visualizamos um cluster com pelo menos quatro hosts, um para cada: um management server, um SQL node e dois data nodes. O cluster, como um todo, reside na subnet `172.23.72.*` de uma LAN. Além das conexões de rede usuais, os dois data nodes são conectados diretamente usando um crossover cable padrão, e se comunicam diretamente entre si usando IP addresses no range de endereços `1.1.0.*`, conforme mostrado:

```sql
# Management Server
[ndb_mgmd]
Id=1
HostName=172.23.72.20

# SQL Node
[mysqld]
Id=2
HostName=172.23.72.21

# Data Nodes
[ndbd]
Id=3
HostName=172.23.72.22

[ndbd]
Id=4
HostName=172.23.72.23

# TCP/IP Connections
[tcp]
NodeId1=3
NodeId2=4
HostName1=1.1.0.1
HostName2=1.1.0.2
```

Os parâmetros [`HostName1`](mysql-cluster-tcp-definition.html#ndbparam-tcp-hostname1) e [`HostName2`](mysql-cluster-tcp-definition.html#ndbparam-tcp-hostname2) são usados somente ao especificar conexões diretas.

O uso de conexões TCP diretas entre data nodes pode melhorar a eficiência geral do cluster, permitindo que os data nodes ignorem um dispositivo Ethernet, como um switch, hub ou router, reduzindo assim a latency do cluster.

Nota

Para aproveitar ao máximo as conexões diretas dessa forma com mais de dois data nodes, você deve ter uma conexão direta entre cada data node e todos os outros data nodes no mesmo node group.