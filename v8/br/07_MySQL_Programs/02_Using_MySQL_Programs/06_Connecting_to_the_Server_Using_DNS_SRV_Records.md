### 6.2.6 Conectando ao servidor usando registros DNS SRV

No Sistema de Nomes de Domínio (DNS), um registro SRV (registro de localização de serviço) é um tipo de registro de recurso que permite que um cliente especifique um nome que indica um serviço, protocolo e domínio. Uma pesquisa DNS no nome retorna uma resposta contendo os nomes de vários servidores disponíveis no domínio que fornecem o serviço necessário. Para obter informações sobre o DNS SRV, incluindo como um registro define a ordem de preferência dos servidores listados, consulte o RFC 2782.

O MySQL suporta o uso de registros DNS SRV para conectar-se a servidores. Um cliente que recebe um resultado de pesquisa DNS SRV tenta se conectar ao servidor MySQL em cada um dos hosts listados, na ordem de preferência, com base na prioridade e ponderação atribuídas a cada host pelo administrador do DNS. Uma falha na conexão ocorre apenas se o cliente não conseguir se conectar a nenhum dos servidores.

Quando várias instâncias do MySQL, como um conjunto de servidores, fornecem o mesmo serviço para suas aplicações, os registros DNS SRV podem ser usados para auxiliar no failover, no balanceamento de carga e nos serviços de replicação. É complicado para as aplicações gerenciar diretamente o conjunto de servidores candidatos para tentativas de conexão, e os registros DNS SRV oferecem uma alternativa:

- Os registros DNS SRV permitem que um administrador de DNS mapeie um único domínio DNS para vários servidores. Os registros DNS SRV também podem ser atualizados centralmente por administradores quando servidores são adicionados ou removidos da configuração ou quando seus nomes de host são alterados.

- A gestão central dos registros DNS SRV elimina a necessidade de que os clientes individuais identifiquem cada possível hospedeiro nas solicitações de conexão ou que as conexões sejam gerenciadas por um componente de software adicional. Uma aplicação pode usar o registro DNS SRV para obter informações sobre servidores MySQL candidatos, em vez de gerenciar as informações do servidor em si.

- Os registros DNS SRV podem ser usados em combinação com o agrupamento de conexões, caso em que as conexões aos hosts que não estão mais na lista atual de registros DNS SRV são removidos do grupo quando ficam inativos.

O MySQL suporta o uso de registros DNS SRV para se conectar a servidores nesses contextos:

- Vários Conectores MySQL implementam suporte para DNS SRV; as opções específicas do conector permitem solicitar a busca de registros DNS SRV tanto para conexões com o protocolo X quanto para conexões com o protocolo MySQL clássico. Para informações gerais, consulte Conexões que usam registros DNS SRV. Para detalhes, consulte a documentação dos Conectores MySQL individuais.

- A API C fornece uma função `mysql_real_connect_dns_srv()` que é semelhante à `mysql_real_connect()`, exceto que a lista de argumentos não especifica o host específico do servidor MySQL a ser conectado. Em vez disso, ela nomeia um registro DNS SRV que especifica um grupo de servidores. Veja mysql\_real\_connect\_dns\_srv().

- O cliente **mysql** tem a opção `--dns-srv-name` para indicar um registro DNS SRV que especifica um grupo de servidores. Veja a Seção 6.5.1, “mysql — O Cliente de Linha de Comando MySQL”.

Um nome DNS SRV é composto por um serviço, protocolo e domínio, com o serviço e o protocolo precedidos de um sublinhado:

```
_service._protocol.domain
```

O seguinte registro DNS SRV identifica vários servidores candidatos, como os que podem ser usados pelos clientes para estabelecer conexões com o protocolo X:

```
Name                      TTL   Class  Priority Weight Port  Target
_mysqlx._tcp.example.com. 86400 IN SRV 0        5      33060 server1.example.com.
_mysqlx._tcp.example.com. 86400 IN SRV 0        10     33060 server2.example.com.
_mysqlx._tcp.example.com. 86400 IN SRV 10       5      33060 server3.example.com.
_mysqlx._tcp.example.com. 86400 IN SRV 20       5      33060 server4.example.com.
```

Aqui, `mysqlx` indica o serviço X Protocol e `tcp` indica o protocolo TCP. Um cliente pode solicitar esse registro DNS SRV usando o nome `_mysqlx._tcp.example.com`. A sintaxe específica para especificar o nome na solicitação de conexão depende do tipo de cliente. Por exemplo, um cliente pode suportar a especificação do nome dentro de uma string de conexão semelhante a URI ou como um par chave-valor.

Um registro DNS SRV para conexões de protocolo clássico pode parecer assim:

```
Name                     TTL   Class  Priority Weight  Port Target
_mysql._tcp.example.com. 86400 IN SRV 0        5       3306 server1.example.com.
_mysql._tcp.example.com. 86400 IN SRV 0        10      3306 server2.example.com.
_mysql._tcp.example.com. 86400 IN SRV 10       5       3306 server3.example.com.
_mysql._tcp.example.com. 86400 IN SRV 20       5       3306 server4.example.com.
```

Aqui, o nome `mysql` designa o serviço clássico do protocolo MySQL, e a porta é 3306 (a porta padrão do protocolo MySQL clássico) e não 33060 (a porta padrão do protocolo X).

Quando a pesquisa de registro DNS SRV é usada, os clientes geralmente devem aplicar essas regras para solicitações de conexão (pode haver exceções específicas para clientes ou conectores):

- O pedido deve especificar o nome completo do registro DNS SRV, com os nomes do serviço e do protocolo prefixados com sublinhados.

- O pedido não deve especificar múltiplos nomes de host.

- O pedido não deve especificar um número de porta.

- Apenas as conexões TCP são suportadas. Arquivos de soquetes Unix, tubos nomeados do Windows e memória compartilhada não podem ser usados.

Para obter mais informações sobre o uso de conexões baseadas em DNS SRV no X DevAPI, consulte Conexões que usam registros DNS SRV.
