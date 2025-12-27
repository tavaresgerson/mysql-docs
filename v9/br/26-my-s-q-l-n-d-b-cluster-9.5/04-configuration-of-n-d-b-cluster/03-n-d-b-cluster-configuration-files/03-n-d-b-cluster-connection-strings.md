#### 25.4.3.3 Strings de Conexão de NDB Cluster

Com exceção do servidor de gerenciamento do NDB Cluster (**ndb\_mgmd**), cada nó que faz parte de um NDB Cluster requer uma string de conexão que aponta para a localização do servidor de gerenciamento. Essa string de conexão é usada para estabelecer uma conexão com o servidor de gerenciamento, bem como para realizar outras tarefas, dependendo do papel do nó no cluster. A sintaxe para uma string de conexão é a seguinte:

```
[nodeid=node_id, ]host-definition[, host-definition[, ...]]

host-definition:
    host_name[:port_number]
```

`node_id` é um número inteiro maior ou igual a 1 que identifica um nó em `config.ini`. *`host_name`* é uma string representando um nome de host válido da Internet ou endereço IP. *`port_number`* é um número inteiro que se refere a um número de porta TCP/IP.

```
example 1 (long):    "nodeid=2,myhost1:1100,myhost2:1100,198.51.100.3:1200"
example 2 (short):   "myhost1"
```

`localhost:1186` é usado como o valor padrão da string de conexão se nenhuma for fornecida. Se *`port_num`* for omitido da string de conexão, a porta padrão é 1186. Essa porta deve estar sempre disponível na rede, pois foi atribuída pela IANA para esse propósito (consulte <http://www.iana.org/assignments/port-numbers> para detalhes).

Ao listar várias definições de host, é possível designar vários servidores de gerenciamento redundantes. Um nó de dados ou API de NDB Cluster tenta contatar servidores de gerenciamento sucessivos em cada host na ordem especificada, até que uma conexão bem-sucedida seja estabelecida.

Também é possível especificar em uma string de conexão uma ou mais endereços de vinculação a serem usados por nós com múltiplas interfaces de rede para se conectarem aos servidores de gerenciamento. Um endereço de vinculação consiste em um nome de host ou endereço de rede e um número de porta opcional. Esta sintaxe aprimorada para strings de conexão é mostrada aqui:

```
[nodeid=node_id, ]
    [bind-address=host-definition, ]
    host-definition[; bind-address=host-definition]
    host-definition[; bind-address=host-definition]
    [, ...]]

host-definition:
    host_name[:port_number]
```

Se um endereço de vinculação for usado na string de conexão *antes* de especificar quaisquer hosts de gerenciamento, então esse endereço é usado como padrão para se conectar a qualquer um deles (a menos que seja sobrescrito para um servidor de gerenciamento específico; veja mais adiante nesta seção para um exemplo). Por exemplo, a seguinte string de conexão faz com que o nó use `198.51.100.242` independentemente do servidor de gerenciamento ao qual ele se conecta:

```
bind-address=198.51.100.242, poseidon:1186, perch:1186
```

Se um endereço de vinculação for especificado *depois* de uma definição de host de gerenciamento, então ele é usado apenas para se conectar a esse nó de gerenciamento. Considere a seguinte string de conexão:

```
poseidon:1186;bind-address=localhost, perch:1186;bind-address=198.51.100.242
```

Neste caso, o nó usa `localhost` para se conectar ao servidor de gerenciamento que está rodando no host chamado `poseidon` e `198.51.100.242` para se conectar ao servidor de gerenciamento que está rodando no host chamado `perch`.

Você pode especificar um endereço de vinculação padrão e depois sobrescrever esse padrão para um ou mais hosts de gerenciamento específicos. No exemplo seguinte, `localhost` é usado para se conectar ao servidor de gerenciamento que está rodando no host `poseidon`; como `198.51.100.242` é especificado primeiro (antes de quaisquer definições de servidores de gerenciamento), ele é o endereço de vinculação padrão e, portanto, é usado para se conectar aos servidores de gerenciamento nos hosts `perch` e `orca`:

```
bind-address=198.51.100.242,poseidon:1186;bind-address=localhost,perch:1186,orca:2200
```

Existem várias maneiras diferentes de especificar a string de conexão:

* Cada executável tem sua própria opção de linha de comando que permite especificar o servidor de gerenciamento no momento do início. (Veja a documentação do respectivo executável.)

* Também é possível definir a string de conexão para todos os nós no clúster de uma vez, colocando-a em uma seção `[mysql_cluster]` no arquivo `my.cnf` do servidor de gerenciamento.

* Para compatibilidade com versões anteriores, duas outras opções estão disponíveis, usando a mesma sintaxe:

1. Defina a variável de ambiente `NDB_CONNECTSTRING` para conter a string de conexão.

Isso deve ser considerado desatualizado e não deve ser usado em novas instalações.

No entanto, esses métodos estão agora desatualizados e não devem ser usados em novas instalações.

O método recomendado para especificar a string de conexão é defini-la na linha de comando ou no arquivo `my.cnf` para cada executável.