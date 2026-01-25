### 21.4.1 Configuração Rápida de Teste do NDB Cluster

Para familiarizá-lo com o básico, descrevemos a configuração mais simples possível para um NDB Cluster funcional. Depois disso, você deve ser capaz de projetar a configuração desejada a partir das informações fornecidas nas outras seções relevantes deste capítulo.

Primeiro, você precisa criar um diretório de configuração, como `/var/lib/mysql-cluster`, executando o seguinte comando como usuário `root` do sistema:

```sql
$> mkdir /var/lib/mysql-cluster
```

Neste diretório, crie um arquivo chamado `config.ini` que contenha as seguintes informações. Substitua os valores apropriados para `HostName` e `DataDir`, conforme necessário para o seu sistema.

```sql
# file "config.ini" - showing minimal setup consisting of 1 data node,
# 1 management server, and 3 MySQL servers.
# The empty default sections are not required, and are shown only for
# the sake of completeness.
# Data nodes must provide a hostname but MySQL Servers are not required
# to do so.
# If you do not know the hostname for your machine, use localhost.
# The DataDir parameter also has a default value, but it is recommended to
# set it explicitly.
# [api] and [mgm] are aliases for [mysqld] and [ndb_mgmd], respectively.

[ndbd default]
NoOfReplicas= 1

[mysqld  default]
[ndb_mgmd default]
[tcp default]

[ndb_mgmd]
HostName= myhost.example.com

[ndbd]
HostName= myhost.example.com
DataDir= /var/lib/mysql-cluster

[mysqld]
[mysqld]
[mysqld]
```

Agora você pode iniciar o Management Server [**ndb_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon"). Por padrão, ele tenta ler o arquivo `config.ini` em seu Current Working Directory, então mude a localização para o diretório onde o arquivo está e invoque [**ndb_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon"):

```sql
$> cd /var/lib/mysql-cluster
$> ndb_mgmd
```

Em seguida, inicie um Data Node único executando [**ndbd**](mysql-cluster-programs-ndbd.html "21.5.1 ndbd — The NDB Cluster Data Node Daemon"):

```sql
$> ndbd
```

Por padrão, [**ndbd**](mysql-cluster-programs-ndbd.html "21.5.1 ndbd — The NDB Cluster Data Node Daemon") procura o Management Server em `localhost` na porta 1186.

Nota

Se você instalou o MySQL a partir de um binary tarball, você deve especificar o path dos servidores [**ndb_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon") e [**ndbd**](mysql-cluster-programs-ndbd.html "21.5.1 ndbd — The NDB Cluster Data Node Daemon") explicitamente. (Normalmente, eles podem ser encontrados em `/usr/local/mysql/bin`.)

Finalmente, mude a localização para o MySQL Data Directory (geralmente `/var/lib/mysql` ou `/usr/local/mysql/data`), e certifique-se de que o arquivo `my.cnf` contém a opção necessária para habilitar a NDB Storage Engine:

```sql
[mysqld]
ndbcluster
```

Agora você pode iniciar o MySQL server como de costume:

```sql
$> mysqld_safe --user=mysql &
```

Espere um momento para garantir que o MySQL server esteja em execução corretamente. Se você vir a notificação `mysql ended`, verifique o arquivo `.err` do servidor para descobrir o que deu errado.

Se tudo correu bem até agora, você pode começar a usar o cluster. Conecte-se ao server e verifique se a Storage Engine [`NDBCLUSTER`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") está habilitada:

```sql
$> mysql
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 1 to server version: 5.7.44

Type 'help;' or '\h' for help. Type '\c' to clear the buffer.

mysql> SHOW ENGINES\G
...
*************************** 12. row ***************************
Engine: NDBCLUSTER
Support: YES
Comment: Clustered, fault-tolerant, memory-based tables
*************************** 13. row ***************************
Engine: NDB
Support: YES
Comment: Alias for NDBCLUSTER
...
```

Os números de linhas mostrados na saída do exemplo anterior podem ser diferentes dos mostrados no seu sistema, dependendo de como o seu server está configurado.

Tente criar uma table [`NDBCLUSTER`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"):

```sql
$> mysql
mysql> USE test;
Database changed

mysql> CREATE TABLE ctest (i INT) ENGINE=NDBCLUSTER;
Query OK, 0 rows affected (0.09 sec)

mysql> SHOW CREATE TABLE ctest \G
*************************** 1. row ***************************
       Table: ctest
Create Table: CREATE TABLE `ctest` (
  `i` int(11) default NULL
) ENGINE=ndbcluster DEFAULT CHARSET=latin1
1 row in set (0.00 sec)
```

Para verificar se seus nodes foram configurados corretamente, inicie o Management Client:

```sql
$> ndb_mgm
```

Use o comando **SHOW** dentro do Management Client para obter um relatório sobre o status do cluster:

```sql
ndb_mgm> SHOW
Cluster Configuration
---------------------
[ndbd(NDB)]     1 node(s)
id=2    @127.0.0.1  (Version: 5.7.44-ndb-7.5.36, Nodegroup: 0, *)

[ndb_mgmd(MGM)] 1 node(s)
id=1    @127.0.0.1  (Version: 5.7.44-ndb-7.5.36)

[mysqld(API)]   3 node(s)
id=3    @127.0.0.1  (Version: 5.7.44-ndb-7.5.36)
id=4 (not connected, accepting connect from any host)
id=5 (not connected, accepting connect from any host)
```

Neste ponto, você configurou com sucesso um NDB Cluster funcional. Agora você pode armazenar data no cluster usando qualquer table criada com `ENGINE=NDBCLUSTER` ou seu alias `ENGINE=NDB`.