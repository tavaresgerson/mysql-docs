### 17.6.1 Allowlisting de Endereços IP no Group Replication

O *plugin* Group Replication possui uma opção de configuração para determinar de quais *hosts* uma conexão de entrada do Sistema de Comunicação em Grupo (*Group Communication System*) pode ser aceita. Esta opção é chamada [`group_replication_ip_whitelist`](group-replication-system-variables.html#sysvar_group_replication_ip_whitelist). Se você definir esta opção em um *server* s1, quando o *server* s2 estiver estabelecendo uma conexão com s1 com a finalidade de engajar a comunicação em grupo, s1 primeiro verifica a *allowlist* (lista de permissões) antes de aceitar a conexão de s2. Se s2 estiver na *allowlist*, s1 aceita a conexão; caso contrário, s1 rejeita a tentativa de conexão de s2.

Se você não especificar uma *allowlist* explicitamente, o motor de comunicação em grupo (XCom) varre automaticamente as interfaces ativas no *host* e identifica aquelas com endereços em sub-redes privadas. Esses endereços e o endereço IP `localhost` para IPv4 são usados para criar uma *allowlist* automática do Group Replication. A *allowlist* automática, portanto, inclui quaisquer endereços IP encontrados para o *host* nos seguintes intervalos:

```sql
10/8 prefix       (10.0.0.0 - 10.255.255.255) - Class A
172.16/12 prefix  (172.16.0.0 - 172.31.255.255) - Class B
192.168/16 prefix (192.168.0.0 - 192.168.255.255) - Class C
127.0.0.1 - localhost for IPv4
```

Uma entrada é adicionada ao *error log* informando os endereços que foram permitidos (*allowlisted*) automaticamente para o *host*.

A *allowlist* automática de endereços privados não pode ser usada para conexões de *servers* fora da rede privada, portanto, um *server*, mesmo que tenha interfaces em IPs públicos, por padrão não permite conexões do Group Replication de *hosts* externos. Para conexões do Group Replication entre instâncias de *server* que estão em máquinas diferentes, você deve fornecer endereços IP públicos e especificá-los como uma *allowlist* explícita. Se você especificar quaisquer entradas para a *allowlist*, os endereços privados e de `localhost` não são adicionados automaticamente, portanto, se você usar algum deles, deve especificá-los explicitamente.

Para especificar uma *allowlist* manualmente, use a opção [`group_replication_ip_whitelist`](group-replication-system-variables.html#sysvar_group_replication_ip_whitelist). Você não pode alterar a *allowlist* em um *server* enquanto ele for um membro ativo de um grupo de replicação. Se o membro estiver ativo, você deve emitir uma instrução [`STOP GROUP_REPLICATION`](stop-group-replication.html "13.4.3.2 STOP GROUP_REPLICATION Statement") antes de alterar a *allowlist*, e uma instrução [`START GROUP_REPLICATION`](start-group-replication.html "13.4.3.1 START GROUP_REPLICATION Statement") depois.

Na *allowlist*, você pode especificar qualquer combinação do seguinte:

*   Endereços IPv4 (por exemplo, `198.51.100.44`)
*   Endereços IPv4 com notação CIDR (por exemplo, `192.0.2.21/24`)

*   Nomes de *host*, a partir do MySQL 5.7.21 (por exemplo, `example.org`)

*   Nomes de *host* com notação CIDR, a partir do MySQL 5.7.21 (por exemplo, `www.example.com/24`)

Endereços IPv6 e nomes de *host* que se resolvem para endereços IPv6 não são suportados no MySQL 5.7. Você pode usar a notação CIDR em combinação com nomes de *host* ou endereços IP para permitir (*allowlist*) um bloco de endereços IP com um prefixo de rede específico, mas garanta que todos os endereços IP na *subnet* especificada estejam sob seu controle.

Você deve parar e reiniciar o Group Replication em um membro para alterar sua *allowlist*. Uma vírgula deve separar cada entrada na *allowlist*. Por exemplo:

```sql
mysql> STOP GROUP_REPLICATION;
mysql> SET GLOBAL group_replication_ip_whitelist="192.0.2.21/24,198.51.100.44,203.0.113.0/24,example.org,www.example.com/24";
mysql> START GROUP_REPLICATION;
```

A *allowlist* deve conter o endereço IP ou nome de *host* que é especificado na variável de sistema [`group_replication_local_address`](group-replication-system-variables.html#sysvar_group_replication_local_address) de cada membro. Este endereço não é o mesmo que o *host* e *port* do protocolo SQL do *server* MySQL, e não é especificado na variável de sistema [`bind_address`](server-system-variables.html#sysvar_bind_address) para a instância do *server*.

Quando um grupo de replicação é reconfigurado (por exemplo, quando um novo *primary* é eleito ou um membro entra ou sai), os membros do grupo restabelecem as conexões entre si. Se um membro do grupo for permitido (*allowlisted*) apenas por *servers* que não fazem mais parte do grupo de replicação após a reconfiguração, ele não conseguirá reconectar-se aos *servers* restantes no grupo de replicação que não o permitirem. Para evitar este cenário completamente, especifique a mesma *allowlist* para todos os *servers* que são membros do grupo de replicação.

Nota

É possível configurar diferentes *allowlists* em diferentes membros do grupo de acordo com seus requisitos de segurança, por exemplo, para manter diferentes *subnets* separadas. Se você precisar configurar diferentes *allowlists* para atender aos seus requisitos de segurança, garanta que haja sobreposição suficiente entre as *allowlists* no grupo de replicação para maximizar a possibilidade de os *servers* conseguirem se reconectar na ausência de seu membro *seed* original.

Para nomes de *host*, a resolução de nomes ocorre apenas quando uma solicitação de conexão é feita por outro *server*. Um nome de *host* que não pode ser resolvido não é considerado para validação da *allowlist*, e uma mensagem de aviso é gravada no *error log*. A verificação FCrDNS (*Forward-confirmed reverse DNS*) é realizada para nomes de *host* resolvidos.

Aviso

Nomes de *host* são inerentemente menos seguros do que endereços IP em uma *allowlist*. A verificação FCrDNS fornece um bom nível de proteção, mas pode ser comprometida por certos tipos de ataque. Especifique nomes de *host* em sua *allowlist* apenas quando estritamente necessário e garanta que todos os componentes usados para resolução de nomes, como *servers* DNS, sejam mantidos sob seu controle. Você também pode implementar a resolução de nomes localmente usando o arquivo *hosts*, para evitar o uso de componentes externos.