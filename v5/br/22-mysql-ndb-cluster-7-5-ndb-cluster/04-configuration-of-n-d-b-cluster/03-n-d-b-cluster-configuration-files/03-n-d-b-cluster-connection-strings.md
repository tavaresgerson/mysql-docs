#### 21.4.3.3 Connection Strings do NDB Cluster

Com exceção do Management Server do NDB Cluster ([**ndb_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon")), cada Node que faz parte de um NDB Cluster requer uma *Connection String* que aponte para a localização do Management Server. Essa *Connection String* é usada para estabelecer uma conexão com o Management Server, bem como para executar outras tarefas, dependendo da função do Node no Cluster. A sintaxe para uma *Connection String* é a seguinte:

```sql
[nodeid=node_id, ]host-definition[, host-definition[, ...

host-definition:
    host_name[:port_number]
```

`node_id` é um inteiro maior ou igual a 1 que identifica um Node em `config.ini`. *`host_name`* é uma string que representa um nome de Host da Internet válido ou um endereço IP. *`port_number`* é um inteiro que se refere a um número de porta TCP/IP.

```sql
example 1 (long):    "nodeid=2,myhost1:1100,myhost2:1100,198.51.100.3:1200"
example 2 (short):   "myhost1"
```

`localhost:1186` é usado como valor padrão da *Connection String* se nenhum for fornecido. Se *`port_num`* for omitido da *Connection String*, a porta padrão é 1186. Esta porta deve estar sempre disponível na rede porque foi atribuída pela IANA para esse fim (consulte <http://www.iana.org/assignments/port-numbers> para detalhes).

Ao listar múltiplas definições de Host, é possível designar vários Management Servers redundantes. Um Node de dados ou API do NDB Cluster tenta contatar Management Servers sucessivos em cada Host, na ordem especificada, até que uma conexão bem-sucedida seja estabelecida.

Também é possível especificar em uma *Connection String* um ou mais *Bind Addresses* a serem usados por Nodes que possuem múltiplas interfaces de rede para se conectar aos Management Servers. Um *Bind Address* consiste em um *Hostname* ou endereço de rede e um número de porta opcional. Esta sintaxe aprimorada para *Connection Strings* é mostrada aqui:

```sql
[nodeid=node_id, ]
    [bind-address=host-definition, ]
    host-definition[; bind-address=host-definition]
    host-definition[; bind-address=host-definition]
    [, ...

host-definition:
    host_name[:port_number]
```

Se um único *Bind Address* for usado na *Connection String* *antes* de especificar quaisquer Hosts de gerenciamento, esse endereço será usado como padrão para a conexão com qualquer um deles (a menos que seja substituído para um Management Server específico; consulte um exemplo posteriormente nesta seção). Por exemplo, a seguinte *Connection String* faz com que o Node use `198.51.100.242` independentemente do Management Server ao qual ele se conecta:

```sql
bind-address=198.51.100.242, poseidon:1186, perch:1186
```

Se um *Bind Address* for especificado *após* uma definição de Host de gerenciamento, ele será usado apenas para conectar-se àquele Node de gerenciamento. Considere a seguinte *Connection String*:

```sql
poseidon:1186;bind-address=localhost, perch:1186;bind-address=198.51.100.242
```

Neste caso, o Node usa `localhost` para se conectar ao Management Server em execução no Host chamado `poseidon` e `198.51.100.242` para se conectar ao Management Server em execução no Host chamado `perch`.

Você pode especificar um *Bind Address* padrão e, em seguida, substituir esse padrão para um ou mais Hosts de gerenciamento específicos. No exemplo a seguir, `localhost` é usado para conectar-se ao Management Server em execução no Host `poseidon`; como `198.51.100.242` é especificado primeiro (antes de quaisquer definições de Management Server), ele é o *Bind Address* padrão e, portanto, é usado para conectar-se aos Management Servers nos Hosts `perch` e `orca`:

```sql
bind-address=198.51.100.242,poseidon:1186;bind-address=localhost,perch:1186,orca:2200
```

Existem várias maneiras diferentes de especificar a *Connection String*:

*   Cada executável possui sua própria opção de linha de comando que permite especificar o Management Server na inicialização. (Consulte a documentação do respectivo executável.)

*   Também é possível definir a *Connection String* para todos os Nodes no Cluster de uma só vez, colocando-a em uma seção `[mysql_cluster]` no arquivo `my.cnf` do Management Server.

*   Para compatibilidade retroativa, duas outras opções estão disponíveis, usando a mesma sintaxe:

    1.  Defina a variável de ambiente `NDB_CONNECTSTRING` para conter a *Connection String*.

    2.  Escreva a *Connection String* para cada executável em um arquivo de texto chamado `Ndb.cfg` e coloque este arquivo no diretório de inicialização do executável.

Essas opções devem ser consideradas *deprecated* (obsoletas) e não devem ser usadas para novas instalações.

O método recomendado para especificar a *Connection String* é defini-la na linha de comando ou no arquivo `my.cnf` para cada executável.