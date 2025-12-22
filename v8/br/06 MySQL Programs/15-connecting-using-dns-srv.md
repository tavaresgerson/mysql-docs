### 6.2.6 Conexão ao servidor usando registos DNS SRV

No Domain Name System (DNS), um registro SRV (record de localização de serviço) é um tipo de registro de recurso que permite a um cliente especificar um nome que indica um serviço, protocolo e domínio.

O MySQL suporta o uso de registros DNS SRV para se conectar a servidores. Um cliente que recebe um resultado de pesquisa DNS SRV tenta se conectar ao servidor MySQL em cada um dos hosts listados em ordem de preferência, com base na prioridade e ponderação atribuídas a cada host pelo administrador do DNS. Uma falha de conexão ocorre apenas se o cliente não puder se conectar a nenhum dos servidores.

Quando várias instâncias do MySQL, como um cluster de servidores, fornecem o mesmo serviço para seus aplicativos, os registros DNS SRV podem ser usados para ajudar com failover, balanceamento de carga e serviços de replicação. É complicado para os aplicativos gerenciar diretamente o conjunto de servidores candidatos para tentativas de conexão, e os registros DNS SRV fornecem uma alternativa:

- Os registros DNS SRV permitem que um administrador de DNS mapeie um único domínio DNS para vários servidores.
- O gerenciamento central de registros DNS SRV elimina a necessidade de clientes individuais identificarem cada possível host em solicitações de conexão, ou para que as conexões sejam tratadas por um componente de software adicional.
- Os registros DNS SRV podem ser usados em combinação com o agrupamento de conexões, caso em que as conexões com hosts que não estão mais na lista atual de registros DNS SRV são removidas do pool quando ficam ociosas.

O MySQL suporta o uso de registros DNS SRV para se conectar a servidores nestes contextos:

- Vários conectores MySQL implementam suporte a DNS SRV; opções específicas do conector permitem solicitar pesquisa de registro DNS SRV tanto para conexões do protocolo X quanto para conexões clássicas do protocolo MySQL.
- A API C fornece uma função `mysql_real_connect_dns_srv()` que é semelhante a `mysql_real_connect()`, exceto que a lista de argumentos não especifica o host específico do servidor MySQL para se conectar. Em vez disso, nomeia um registro DNS SRV que especifica um grupo de servidores.
- O cliente `mysql` tem uma opção `--dns-srv-name` para indicar um registro DNS SRV que especifica um grupo de servidores.

Um nome DNS SRV consiste em um serviço, protocolo e domínio, com o serviço e protocolo cada um prefixado por um sublinhado:

```
_service._protocol.domain
```

O seguinte registro DNS SRV identifica múltiplos servidores candidatos, como os que podem ser usados por clientes para estabelecer conexões de protocolo X:

```
Name                      TTL   Class  Priority Weight Port  Target
_mysqlx._tcp.example.com. 86400 IN SRV 0        5      33060 server1.example.com.
_mysqlx._tcp.example.com. 86400 IN SRV 0        10     33060 server2.example.com.
_mysqlx._tcp.example.com. 86400 IN SRV 10       5      33060 server3.example.com.
_mysqlx._tcp.example.com. 86400 IN SRV 20       5      33060 server4.example.com.
```

Aqui, `mysqlx` indica o serviço do protocolo X e `tcp` indica o protocolo TCP. Um cliente pode solicitar este registro de SRV DNS usando o nome `_mysqlx._tcp.example.com`. A sintaxe específica para especificar o nome na solicitação de conexão depende do tipo de cliente. Por exemplo, um cliente pode suportar especificar o nome dentro de uma string de conexão semelhante a URI ou como um par chave-valor.

Um registro DNS SRV para conexões clássicas de protocolo pode ser assim:

```
Name                     TTL   Class  Priority Weight  Port Target
_mysql._tcp.example.com. 86400 IN SRV 0        5       3306 server1.example.com.
_mysql._tcp.example.com. 86400 IN SRV 0        10      3306 server2.example.com.
_mysql._tcp.example.com. 86400 IN SRV 10       5       3306 server3.example.com.
_mysql._tcp.example.com. 86400 IN SRV 20       5       3306 server4.example.com.
```

Aqui, o nome `mysql` designa o serviço de protocolo MySQL clássico, e a porta é 3306 (a porta padrão do protocolo MySQL clássico) em vez de 33060 (a porta padrão do protocolo X).

Quando a pesquisa de registros DNS SRV é usada, os clientes geralmente devem aplicar estas regras para solicitações de conexão (pode haver exceções específicas do cliente ou do conector):

- O pedido deve especificar o nome completo do registo DNS SRV, com os nomes do serviço e do protocolo precedidos de sublinhados.
- O pedido não deve especificar vários nomes de host.
- O pedido não deve especificar um número de porta.
- Somente conexões TCP são suportadas. Arquivos de soquete Unix, tubos com nome do Windows e memória compartilhada não podem ser usados.

Para obter mais informações sobre o uso de conexões baseadas em DNS SRV no X DevAPI, consulte Conexões usando registros DNS SRV.
