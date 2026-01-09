### 6.2.6 Conectando ao Servidor Usando Registros DNS SRV

No Sistema de Nomes de Domínio (DNS), um registro DNS SRV (registro de localização de serviço) é um tipo de registro de recurso que permite que um cliente especifique um nome que indica um serviço, protocolo e domínio. Uma pesquisa DNS sobre o nome retorna uma resposta contendo os nomes de vários servidores disponíveis no domínio que fornecem o serviço necessário. Para obter informações sobre DNS SRV, incluindo como um registro define a ordem de preferência dos servidores listados, consulte [RFC 2782](https://tools.ietf.org/html/rfc2782).

O MySQL suporta o uso de registros DNS SRV para conectar-se a servidores. Um cliente que recebe um resultado de pesquisa DNS SRV tenta se conectar ao servidor MySQL em cada um dos hosts listados, na ordem de preferência, com base na prioridade e ponderação atribuídas a cada host pelo administrador do DNS. Uma falha na conexão ocorre apenas se o cliente não conseguir se conectar a nenhum dos servidores.

Quando várias instâncias do MySQL, como um clúster de servidores, fornecem o mesmo serviço para suas aplicações, os registros DNS SRV podem ser usados para auxiliar em serviços de failover, balanceamento de carga e replicação. É trabalhoso para as aplicações gerenciar diretamente o conjunto de servidores candidatos para tentativas de conexão, e os registros DNS SRV fornecem uma alternativa:

* Os registros DNS SRV permitem que um administrador do DNS mapeie um único domínio DNS para múltiplos servidores. Os registros DNS SRV também podem ser atualizados centralmente por administradores quando servidores são adicionados ou removidos da configuração ou quando seus nomes de host são alterados.

* A gestão central dos registros DNS SRV elimina a necessidade de que os clientes individuais identifiquem cada possível hospedeiro nas solicitações de conexão ou que as conexões sejam gerenciadas por um componente de software adicional. Uma aplicação pode usar o registro DNS SRV para obter informações sobre servidores MySQL candidatos, em vez de gerenciar as informações do servidor em si.

* Os registros DNS SRV podem ser usados em combinação com o pooling de conexões, caso em que as conexões a hospedeiros que não estão mais na lista atual de registros DNS SRV são removidas do pool quando ficam inativas.

O MySQL suporta o uso de registros DNS SRV para se conectar a servidores nesses contextos:

* Vários Conectadores MySQL implementam suporte a DNS SRV; as opções específicas do conector permitem solicitar a busca de registro DNS SRV tanto para conexões com o X Protocol quanto para conexões com o protocolo MySQL clássico. Para informações gerais, consulte Conexões Usando Registros DNS SRV. Para detalhes, consulte a documentação dos Conectadores MySQL individuais.

* A API C fornece uma função `mysql_real_connect_dns_srv()` que é semelhante à `mysql_real_connect()`, exceto que a lista de argumentos não especifica o hospedeiro particular do servidor MySQL a ser conectado. Em vez disso, ela nomeia um registro DNS SRV que especifica um grupo de servidores. Veja mysql_real_connect_dns_srv().

* O cliente **mysql** tem uma opção `--dns-srv-name` para indicar um registro DNS SRV que especifica um grupo de servidores. Veja Seção 6.5.1, “mysql — O Cliente de Linha de Comando MySQL”.

O nome DNS SRV consiste em um serviço, protocolo e domínio, com o serviço e o protocolo cada um precedidos por uma sublinha:

```
_service._protocol.domain
```

O seguinte registro DNS SRV identifica vários servidores candidatos, como os que podem ser usados por clientes para estabelecer conexões com o X Protocol:

```
Name                      TTL   Class  Priority Weight Port  Target
_mysqlx._tcp.example.com. 86400 IN SRV 0        5      33060 server1.example.com.
_mysqlx._tcp.example.com. 86400 IN SRV 0        10     33060 server2.example.com.
_mysqlx._tcp.example.com. 86400 IN SRV 10       5      33060 server3.example.com.
_mysqlx._tcp.example.com. 86400 IN SRV 20       5      33060 server4.example.com.
```

Aqui, `mysqlx` indica o serviço X Protocol e `tcp` indica o protocolo TCP. Um cliente pode solicitar esse registro DNS SRV usando o nome `_mysqlx._tcp.example.com`. A sintaxe específica para especificar o nome na solicitação de conexão depende do tipo de cliente. Por exemplo, um cliente pode suportar a especificação do nome dentro de uma string de conexão semelhante a URI ou como um par de chave-valor.

Um registro DNS SRV para conexões de protocolo clássico pode parecer assim:

```
Name                     TTL   Class  Priority Weight  Port Target
_mysql._tcp.example.com. 86400 IN SRV 0        5       3306 server1.example.com.
_mysql._tcp.example.com. 86400 IN SRV 0        10      3306 server2.example.com.
_mysql._tcp.example.com. 86400 IN SRV 10       5       3306 server3.example.com.
_mysql._tcp.example.com. 86400 IN SRV 20       5       3306 server4.example.com.
```

Aqui, o nome `mysql` designa o serviço de protocolo MySQL clássico, e a porta é 3306 (a porta padrão do protocolo MySQL clássico) em vez de 33060 (a porta padrão do X Protocol).

Quando a busca por registro DNS SRV é usada, os clientes geralmente devem aplicar essas regras para solicitações de conexão (pode haver exceções específicas do cliente ou do conector):

* A solicitação deve especificar o nome completo do registro DNS SRV, com os nomes de serviço e protocolo prefixados com underscores.
* A solicitação não deve especificar múltiplos nomes de host.
* A solicitação não deve especificar um número de porta.
* Apenas conexões TCP são suportadas. Arquivos de soquetes Unix, tubos nomeados do Windows e memória compartilhada não podem ser usados.

Para obter mais informações sobre o uso de conexões baseadas em DNS SRV na X DevAPI, consulte Conexões Usando Registros DNS SRV.