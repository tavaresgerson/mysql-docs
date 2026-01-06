### 17.6.1 Permitir a lista de endereços IP de replicação em grupo

O plugin de replicação em grupo tem uma opção de configuração para determinar de quais hosts uma conexão de entrada do Sistema de Comunicação em Grupo pode ser aceita. Esta opção é chamada de [`group_replication_ip_whitelist`](group-replication-system-variables.html#sysvar_group_replication_ip_whitelist). Se você definir esta opção em um servidor s1, então, quando o servidor s2 está estabelecendo uma conexão com s1 com o propósito de participar da comunicação em grupo, s1 verifica primeiro a lista de permissão antes de aceitar a conexão de s2. Se s2 estiver na lista de permissão, então s1 aceita a tentativa de conexão de s2, caso contrário, s1 rejeita a tentativa de conexão de s2.

Se você não especificar explicitamente um allowlist, o motor de comunicação de grupo (XCom) escaneia automaticamente as interfaces ativas no host e identifica aquelas com endereços em sub-redes privadas. Esses endereços e o endereço IP `localhost` para IPv4 são usados para criar um allowlist automático de Replicação de Grupo. Portanto, o allowlist automático inclui quaisquer endereços IP encontrados para o host nos seguintes intervalos:

```sql
10/8 prefix       (10.0.0.0 - 10.255.255.255) - Class A
172.16/12 prefix  (172.16.0.0 - 172.31.255.255) - Class B
192.168/16 prefix (192.168.0.0 - 192.168.255.255) - Class C
127.0.0.1 - localhost for IPv4
```

Uma entrada é adicionada ao log de erros, indicando os endereços que foram automaticamente permitidos para o host.

A lista de endereços privados permitidos automaticamente não pode ser usada para conexões de servidores fora da rede privada, portanto, um servidor, mesmo que tenha interfaces em IPs públicos, não permite, por padrão, conexões de Replicação de Grupo de hosts externos. Para conexões de Replicação de Grupo entre instâncias de servidor em máquinas diferentes, você deve fornecer endereços de IP público e especificá-los como uma lista de permissão explícita. Se você especificar qualquer entrada na lista de permissão, os endereços privados e `localhost` não são adicionados automaticamente, portanto, se você usar qualquer um desses, você deve especificá-los explicitamente.

Para especificar uma lista de permissão manualmente, use a opção [`group_replication_ip_whitelist`](group-replication-system-variables.html#sysvar_group_replication_ip_whitelist). Você não pode alterar a lista de permissão em um servidor enquanto ele estiver sendo um membro ativo de um grupo de replicação. Se o membro estiver ativo, você deve emitir uma declaração [`STOP GROUP_REPLICATION`](stop-group-replication.html) antes de alterar a lista de permissão e uma declaração [`START GROUP_REPLICATION`](start-group-replication.html) depois.

Na lista de permissão, você pode especificar qualquer combinação dos seguintes itens:

- Endereços IPv4 (por exemplo, `198.51.100.44`)

- Endereços IPv4 com notação CIDR (por exemplo, `192.0.2.21/24`)

- Nomes de host, a partir do MySQL 5.7.21 (por exemplo, `example.org`)

- Nomes de host com notação CIDR, a partir do MySQL 5.7.21 (por exemplo, `www.example.com/24`)

Os endereços IPv6 e os nomes de host que resolvem para endereços IPv6 não são suportados no MySQL 5.7. Você pode usar a notação CIDR em combinação com nomes de host ou endereços IP para permitir um bloco de endereços IP com um prefixo de rede específico, mas certifique-se de que todos os endereços IP na sub-rede especificada estejam sob seu controle.

Você deve parar e reiniciar a Replicação em Grupo em um membro para alterar sua lista de permissão. Uma vírgula deve separar cada entrada na lista de permissão. Por exemplo:

```sql
mysql> STOP GROUP_REPLICATION;
mysql> SET GLOBAL group_replication_ip_whitelist="192.0.2.21/24,198.51.100.44,203.0.113.0/24,example.org,www.example.com/24";
mysql> START GROUP_REPLICATION;
```

A lista de permissões deve conter o endereço IP ou o nome do host especificado na variável de sistema [`group_replication_local_address`](group-replication-system-variables.html#sysvar_group_replication_local_address) de cada membro. Esse endereço não é o mesmo do host e porta do protocolo SQL do servidor MySQL, e não é especificado na variável de sistema [`bind_address`](server-system-variables.html#sysvar_bind_address) da instância do servidor.

Quando um grupo de replicação é reconfigurado (por exemplo, quando um novo primário é eleito ou um membro se junta ou sai), os membros do grupo reestabelecem conexões entre si. Se um membro do grupo só for permitido por servidores que não fazem mais parte do grupo de replicação após a reconfiguração, ele não conseguirá se reconectar aos servidores restantes do grupo de replicação que não o permitem. Para evitar esse cenário completamente, especifique a mesma lista de permissões para todos os servidores que são membros do grupo de replicação.

Nota

É possível configurar diferentes listas de permissões para diferentes membros do grupo de acordo com os requisitos de segurança, por exemplo, para manter sub-redes diferentes separadas. Se você precisar configurar diferentes listas de permissões para atender aos seus requisitos de segurança, certifique-se de que haja uma sobreposição suficiente entre as listas de permissões no grupo de replicação para maximizar a possibilidade de os servidores conseguirem se reconectar na ausência de seu membro original de semente.

Para os nomes de host, a resolução de nomes ocorre apenas quando um pedido de conexão é feito por outro servidor. Um nome de host que não pode ser resolvido não é considerado para validação da lista de permissão, e uma mensagem de aviso é escrita no log de erros. A verificação de DNS reversa confirmada (FCrDNS) é realizada para nomes de host resolvidos.

Aviso

Os nomes de host são inerentemente menos seguros do que os endereços IP em uma lista de permissão. A verificação do FCrDNS oferece um bom nível de proteção, mas pode ser comprometida por certos tipos de ataque. Especifique os nomes de host em sua lista de permissão apenas quando estritamente necessário e garanta que todos os componentes usados para resolução de nomes, como servidores DNS, estejam sob seu controle. Você também pode implementar a resolução de nomes localmente usando o arquivo hosts, para evitar o uso de componentes externos.
