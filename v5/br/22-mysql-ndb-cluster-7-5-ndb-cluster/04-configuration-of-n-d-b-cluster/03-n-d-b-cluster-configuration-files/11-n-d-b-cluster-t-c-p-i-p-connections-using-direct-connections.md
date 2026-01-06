#### 21.4.3.11 Conexões de cluster NDB TCP/IP usando conexões diretas

Para configurar um clúster usando conexões diretas entre os nós de dados, é necessário especificar explicitamente os endereços IP de crossover dos nós de dados conectados na seção `[tcp]` do arquivo `config.ini` do clúster.

No exemplo a seguir, imaginamos um clúster com pelo menos quatro hosts, um para cada um dos seguintes: um servidor de gerenciamento, um nó SQL e dois nós de dados. O clúster como um todo reside na sub-rede `172.23.72.*` de uma LAN. Além das conexões de rede usuais, os dois nós de dados estão conectados diretamente usando um cabo crossover padrão e se comunicam diretamente usando endereços IP na faixa de endereços `1.1.0.*`, conforme mostrado:

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

Os parâmetros `HostName1` e `HostName2` são usados apenas ao especificar conexões diretas.

O uso de conexões TCP diretas entre os nós de dados pode melhorar a eficiência geral do clúster, permitindo que os nós de dados contornem um dispositivo Ethernet, como um switch, hub ou roteador, reduzindo assim a latência do clúster.

Nota

Para aproveitar ao máximo as conexões diretas dessa maneira com mais de dois nós de dados, você deve ter uma conexão direta entre cada nó de dados e todos os outros nós de dados do mesmo grupo de nós.
