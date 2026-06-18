### 20.6.4 Permissões de endereço IP de replicação em grupo

Quando e somente quando a pilha de comunicação XCom é usada para estabelecer comunicações em grupo (`group_replication_communication_stack=XCOM`), o plugin de replicação de grupo permite que você especifique uma lista de permissão de hosts a partir dos quais uma conexão de entrada do Sistema de Comunicação em Grupo pode ser aceita. Se você especificar uma lista de permissão em um servidor s1, então, quando o servidor s2 está estabelecendo uma conexão com s1 com o propósito de engajar a comunicação em grupo, s1 verifica primeiro a lista de permissão antes de aceitar a conexão de s2. Se s2 estiver na lista de permissão, então s1 aceita a conexão, caso contrário, s1 rejeita a tentativa de conexão de s2. A partir do MySQL 8.0.22, a variável de sistema `group_replication_ip_allowlist` é usada para especificar a lista de permissão, e para versões anteriores ao MySQL 8.0.22, a variável de sistema `group_replication_ip_whitelist` é usada. A nova variável de sistema funciona da mesma maneira que a antiga variável de sistema, apenas a terminologia mudou.

Nota

Quando a pilha de comunicação MySQL é usada para estabelecer comunicações em grupo (`group_replication_communication_stack=MYSQL`), as configurações para `group_replication_ip_allowlist` e `group_replication_ip_whitelist` são ignoradas. Veja a Seção 20.6.1, “Pilha de Comunicação para Gerenciamento de Segurança de Conexão”.

Se você não especificar explicitamente um allowlist, o motor de comunicação de grupo (XCom) escaneia automaticamente as interfaces ativas no host e identifica aquelas com endereços em sub-redes privadas, juntamente com a máscara de sub-rede configurada para cada interface. Esses endereços, e o endereço IP `localhost` para IPv4 e (a partir do MySQL 8.0.14) IPv6, são usados para criar um allowlist automático de Replicação de Grupo. Portanto, o allowlist automático inclui quaisquer endereços IP encontrados para o host nos seguintes intervalos após a máscara de sub-rede apropriada ter sido aplicada:

```
IPv4 (as defined in RFC 1918)
10/8 prefix       (10.0.0.0 - 10.255.255.255) - Class A
172.16/12 prefix  (172.16.0.0 - 172.31.255.255) - Class B
192.168/16 prefix (192.168.0.0 - 192.168.255.255) - Class C

IPv6 (as defined in RFC 4193 and RFC 5156)
fc00:/7 prefix    - unique-local addresses
fe80::/10 prefix  - link-local unicast addresses

127.0.0.1 - localhost for IPv4
::1       - localhost for IPv6
```

Uma entrada é adicionada ao log de erros, indicando os endereços que foram permitidos automaticamente para o host.

A lista de endereços privados permitidos automaticamente não pode ser usada para conexões de servidores fora da rede privada, portanto, um servidor, mesmo que tenha interfaces em IPs públicos, não permite, por padrão, conexões de Replicação de Grupo de hosts externos. Para conexões de Replicação de Grupo entre instâncias de servidor que estão em máquinas diferentes, você deve fornecer endereços de IP públicos e especificá-los como uma lista de permissão explícita. Se você especificar qualquer entrada na lista de permissão, os endereços privados e `localhost` não são adicionados automaticamente, portanto, se você usar qualquer um desses, você deve especificá-los explicitamente.

Para especificar uma lista de permissões manualmente, use a variável de sistema `group_replication_ip_allowlist` (MySQL 8.0.22 e versões posteriores) ou `group_replication_ip_whitelist`. Antes do MySQL 8.0.24, você não pode alterar a lista de permissões em um servidor enquanto ele estiver sendo um membro ativo de um grupo de replicação. Se o membro estiver ativo, você deve executar `STOP GROUP_REPLICATION` antes de alterar a lista de permissões e `START GROUP_REPLICATION` depois. A partir do MySQL 8.0.24, você pode alterar a lista de permissões enquanto a Replicação por Grupo estiver em execução.

A lista de permissões deve conter o endereço IP ou o nome do host especificado na variável de sistema `group_replication_local_address` de cada membro. Esse endereço não é o mesmo do host e da porta do protocolo SQL do servidor MySQL, e não é especificado na variável de sistema `bind_address` da instância do servidor. Se um nome de host usado como endereço local de replicação de grupo para uma instância do servidor resolver tanto para um endereço IPv4 quanto para um endereço IPv6, o endereço IPv4 é preferido para as conexões de replicação de grupo.

Os endereços IP especificados como pontos finais de recuperação distribuída e o endereço IP da conexão padrão do cliente SQL do membro, se este for usado para recuperação distribuída (o que é o padrão), não precisam ser adicionados à lista de permissão. A lista de permissão é apenas para o endereço especificado por `group_replication_local_address` para cada membro. Um membro que se junta deve ter sua conexão inicial com o grupo permitida pela lista de permissão para recuperar o endereço ou endereços para recuperação distribuída.

Na lista de permissão, você pode especificar qualquer combinação dos seguintes itens:

- Endereços IPv4 (por exemplo, `198.51.100.44`)

- Endereços IPv4 com notação CIDR (por exemplo, `192.0.2.21/24`)

- Endereços IPv6, a partir do MySQL 8.0.14 (por exemplo, `2001:db8:85a3:8d3:1319:8a2e:370:7348`)

- Endereços IPv6 com notação CIDR, a partir do MySQL 8.0.14 (por exemplo, `2001:db8:85a3:8d3::/64`)

- Nomes de hospedagem (por exemplo, `example.org`)

- Nomes de host com notação CIDR (por exemplo, `www.example.com/24`)

Antes do MySQL 8.0.14, os nomes de host só podiam resolver para endereços IPv4. A partir do MySQL 8.0.14, os nomes de host podem resolver para endereços IPv4, endereços IPv6 ou ambos. Se um nome de host resolver para tanto um endereço IPv4 quanto um IPv6, o endereço IPv4 é sempre usado para conexões de Replicação em Grupo. Você pode usar a notação CIDR em combinação com nomes de host ou endereços IP para permitir um bloco de endereços IP com um prefixo de rede específico, mas certifique-se de que todos os endereços IP na sub-rede especificada estejam sob seu controle.

Nota

Quando uma tentativa de conexão de um endereço IP é recusada porque o endereço não está na lista de permissão, a mensagem de recusa sempre imprime o endereço IP no formato IPv6. Os endereços IPv4 são precedidos por `::ffff:` neste formato (um endereço IPv6 mapeado para IPv4). Você não precisa usar este formato para especificar endereços IPv4 na lista de permissão; use o formato IPv4 padrão para eles.

Uma vírgula deve separar cada entrada na allowlist. Por exemplo:

```
mysql> SET GLOBAL group_replication_ip_allowlist="192.0.2.21/24,198.51.100.44,203.0.113.0/24,2001:db8:85a3:8d3:1319:8a2e:370:7348,example.org,www.example.com/24";
```

Para se juntar a um grupo de replicação, é necessário permitir que um servidor esteja no membro inicial, ao qual ele faz o pedido de adesão ao grupo. Tipicamente, este seria o membro de bootstrap para o grupo de replicação, mas pode ser qualquer um dos servidores listados pela opção `group_replication_group_seeds` na configuração do servidor que está se juntando ao grupo. Se algum dos membros iniciais do grupo estiver listado na opção `group_replication_group_seeds` com um endereço IPv6 quando um membro que está se juntando tem um endereço IPv4 `group_replication_local_address`, ou vice-versa, você também deve configurar e permitir um endereço alternativo para o membro que está se juntando para o protocolo oferecido pelo membro inicial (ou um nome de host que resolva para um endereço para esse protocolo). Isso ocorre porque, quando um servidor se junta a um grupo de replicação, ele deve fazer o contato inicial com o membro inicial usando o protocolo que o membro inicial anuncia na opção `group_replication_group_seeds`, seja IPv4 ou IPv6. Se um membro que está se juntando não tiver um endereço permitido para o protocolo apropriado, sua tentativa de conexão é recusada. Para mais informações sobre a gestão de grupos de replicação mistos de IPv4 e IPv6, consulte a Seção 20.5.5, “Suporte para IPv6 e para Grupos Mistas de IPv6 e IPv4”.

Quando um grupo de replicação é reconfigurado (por exemplo, quando um novo primário é eleito ou um membro se junta ou sai), os membros do grupo reestabelecem conexões entre si. Se um membro do grupo só for permitido por servidores que não fazem mais parte do grupo de replicação após a reconfiguração, ele não conseguirá se reconectar aos servidores restantes do grupo de replicação que não o permitem. Para evitar esse cenário completamente, especifique a mesma lista de permissões para todos os servidores que são membros do grupo de replicação.

Nota

É possível configurar diferentes listas de permissões para diferentes membros do grupo de acordo com os requisitos de segurança, por exemplo, para manter sub-redes diferentes separadas. Se você precisar configurar diferentes listas de permissões para atender aos seus requisitos de segurança, certifique-se de que haja uma sobreposição suficiente entre as listas de permissões no grupo de replicação para maximizar a possibilidade de os servidores conseguirem se reconectar na ausência de seu membro original de semente.

Para os nomes de host, a resolução de nomes ocorre apenas quando um pedido de conexão é feito por outro servidor. Um nome de host que não pode ser resolvido não é considerado para validação da lista de permissão, e uma mensagem de aviso é escrita no log de erros. A verificação de DNS reversa confirmada (FCrDNS) é realizada para nomes de host resolvidos.

Aviso

Os nomes de host são inerentemente menos seguros do que os endereços IP em uma lista de permissão. A verificação do FCrDNS oferece um bom nível de proteção, mas pode ser comprometida por certos tipos de ataque. Especifique os nomes de host em sua lista de permissão apenas quando estritamente necessário e garanta que todos os componentes usados para resolução de nomes, como servidores DNS, estejam sob seu controle. Você também pode implementar a resolução de nomes localmente usando o arquivo hosts, para evitar o uso de componentes externos.
