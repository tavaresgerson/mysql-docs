### 25.4.1 Configuração Rápida do NDB Cluster

Para familiarizar-se com os conceitos básicos, descrevemos a configuração mais simples possível para um NDB Cluster funcional. Após isso, você deve ser capaz de projetar a configuração desejada com base nas informações fornecidas nas outras seções relevantes deste capítulo.

Primeiro, você precisa criar um diretório de configuração, como `/var/lib/mysql-cluster`, executando o seguinte comando como usuário `root` do sistema:

```
$> mkdir /var/lib/mysql-cluster
```

Neste diretório, crie um arquivo chamado `config.ini` que contenha as seguintes informações. Substitua os valores apropriados para `HostName` e `DataDir` conforme necessário para o seu sistema.

```
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

Agora você pode iniciar o servidor de gerenciamento **ndb_mgmd**. Por padrão, ele tenta ler o arquivo `config.ini` em seu diretório de trabalho atual, então mude a localização para o diretório onde o arquivo está localizado e então inicie o **ndb_mgmd**:

```
$> cd /var/lib/mysql-cluster
$> ndb_mgmd
```

Em seguida, inicie um único nó de dados executando o **ndbd**:

```
$> ndbd
```

Por padrão, o **ndbd** procura o servidor de gerenciamento em `localhost` na porta 1186.

Observação

Se você instalou o MySQL a partir de um tarball binário, você deve especificar o caminho dos servidores **ndb_mgmd** e **ndbd** explicitamente. (Normalmente, esses podem ser encontrados em `/usr/local/mysql/bin`.)

Finalmente, mude a localização para o diretório de dados do MySQL (normalmente `/var/lib/mysql` ou `/usr/local/mysql/data`), e certifique-se de que o arquivo `my.cnf` contenha a opção necessária para habilitar o motor de armazenamento NDB:

```
[mysqld]
ndbcluster
```

Agora você pode iniciar o servidor MySQL como de costume:

```
$> mysqld_safe --user=mysql &
```

Aguarde um momento para garantir que o servidor MySQL esteja funcionando corretamente. Se você vir a notificação `mysql ended`, verifique o arquivo `.err` do servidor para descobrir o que deu errado.

Se tudo correr bem até agora, agora você pode começar a usar o cluster. Conecte-se ao servidor e verifique se o mecanismo de armazenamento `NDBCLUSTER` está habilitado:

```
$> mysql
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 1 to server version: 9.5.0

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

Os números de linha mostrados na saída do exemplo anterior podem ser diferentes dos mostrados no seu sistema, dependendo da configuração do seu servidor.

Tente criar uma tabela `NDBCLUSTER`:

```
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
) ENGINE=ndbcluster DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
1 row in set (0.00 sec)
```

Para verificar se seus nós foram configurados corretamente, inicie o cliente de gerenciamento:

```
$> ndb_mgm
```

Use o comando **SHOW** dentro do cliente de gerenciamento para obter um relatório sobre o status do cluster:

```
ndb_mgm> SHOW
Cluster Configuration
---------------------
[ndbd(NDB)]     1 node(s)
id=2    @127.0.0.1  (Version: 9.4.0-ndb-9.4.0, Nodegroup: 0, *)

[ndb_mgmd(MGM)] 1 node(s)
id=1    @127.0.0.1  (Version: 9.4.0-ndb-9.4.0)

[mysqld(API)]   3 node(s)
id=3    @127.0.0.1  (Version: 9.4.0-ndb-9.4.0)
id=4 (not connected, accepting connect from any host)
id=5 (not connected, accepting connect from any host)
```

Neste ponto, você configurou com sucesso um NDB Cluster funcional. Agora, você pode armazenar dados no cluster usando qualquer tabela criada com `ENGINE=NDBCLUSTER` ou seu alias `ENGINE=NDB`.