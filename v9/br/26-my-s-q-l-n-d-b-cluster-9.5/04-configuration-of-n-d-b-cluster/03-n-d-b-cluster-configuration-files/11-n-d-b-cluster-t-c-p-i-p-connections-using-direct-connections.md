#### 25.4.3.11 Conexões TCP/IP em aglomerado NDB usando conexões diretas

Configurar um aglomerado usando conexões diretas entre nós de dados requer especificar explicitamente os endereços IP de crossover dos nós de dados conectados na seção `[tcp]` do arquivo `config.ini` do aglomerado.

No exemplo a seguir, imaginamos um aglomerado com pelo menos quatro hosts, um para cada um de um servidor de gerenciamento, um nó SQL e dois nós de dados. O aglomerado como um todo reside na sub-rede `172.23.72.*` de uma LAN. Além das conexões de rede usuais, os dois nós de dados são conectados diretamente usando um cabo de crossover padrão, e se comunicam diretamente usando endereços IP no intervalo de endereços `1.1.0.*`, conforme mostrado:

```
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

Os parâmetros `HostName1` e `HostName2` são usados apenas ao especificar conexões diretas.

O uso de conexões TCP diretas entre nós de dados pode melhorar a eficiência geral do aglomerado, permitindo que os nós de dados contornem um dispositivo Ethernet, como um switch, hub ou roteador, reduzindo assim a latência do aglomerado.

Nota

Para aproveitar ao máximo as conexões diretas dessa maneira com mais de dois nós de dados, você deve ter uma conexão direta entre cada nó de dados e todos os outros nós de dados no mesmo grupo de nós.