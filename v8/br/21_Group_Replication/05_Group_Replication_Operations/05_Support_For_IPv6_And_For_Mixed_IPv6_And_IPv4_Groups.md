### 20.5.5 Suporte para IPv6 e para grupos mistos de IPv6 e IPv4

A partir do MySQL 8.0.14, os membros do grupo de replicação de grupo podem usar endereços IPv6 como alternativa aos endereços IPv4 para comunicações dentro do grupo. Para usar endereços IPv6, o sistema operacional do host do servidor e a instância do MySQL Server devem ser configurados para suportar IPv6. Para obter instruções sobre como configurar o suporte IPv6 para uma instância de servidor, consulte a Seção 7.1.13, “Suporte IPv6”.

Os endereços IPv6 ou os nomes de host que os resolvem podem ser especificados como o endereço de rede que o membro fornece na opção `group_replication_local_address` para conexões de outros membros. Quando especificados com um número de porta, um endereço IPv6 deve ser especificado entre colchetes, por exemplo:

```
group_replication_local_address= "[2001:db8:85a3:8d3:1319:8a2e:370:7348]:33061"
```

O endereço de rede ou o nome do host especificado em `group_replication_local_address` é usado pela Replicação em Grupo como identificador único para um membro do grupo dentro do grupo de replicação. Se um nome de host especificado como o endereço local da Replicação em Grupo para uma instância do servidor resolver para um endereço IPv4 e um endereço IPv6, o endereço IPv4 é sempre usado para conexões da Replicação em Grupo. O endereço ou o nome do host especificado como o endereço local da Replicação em Grupo não é o mesmo que o host e a porta do protocolo SQL do servidor MySQL, e não é especificado na variável de sistema `bind_address` para a instância do servidor. Para fins de permissões de endereço IP para a Replicação em Grupo (veja a Seção 20.6.4, “Permissões de Endereço IP da Replicação em Grupo”), o endereço que você especificar para cada membro do grupo em `group_replication_local_address` deve ser adicionado à lista para a variável de sistema `group_replication_ip_allowlist` (a partir do MySQL 8.0.22) ou `group_replication_ip_whitelist` nos outros servidores no grupo de replicação.

Um grupo de replicação pode conter uma combinação de membros que apresentam uma endereço IPv6 como seu endereço local de replicação de grupo e membros que apresentam um endereço IPv4. Quando um servidor se junta a tal grupo misto, ele deve fazer o contato inicial com o membro inicial usando o protocolo que o membro inicial anuncia na opção `group_replication_group_seeds`, seja ele IPv4 ou IPv6. Se algum dos membros iniciais do grupo estiver listado na opção `group_replication_group_seeds` com um endereço IPv6 quando um membro que está se juntando tem um endereço local de replicação de grupo IPv4, ou vice-versa, você também deve configurar e permitir um endereço alternativo para o membro que está se juntando para o protocolo necessário (ou um nome de host que resolva para um endereço para esse protocolo). Se um membro que está se juntando não tiver um endereço permitido para o protocolo apropriado, sua tentativa de conexão é recusada. O endereço alternativo ou o nome de host só precisa ser adicionado à variável de sistema `group_replication_ip_allowlist` (a partir do MySQL 8.0.22) ou `group_replication_ip_whitelist` nos outros servidores no grupo de replicação, não ao valor `group_replication_local_address` para o membro que está se juntando (que só pode conter um único endereço).

Por exemplo, o servidor A é um membro inicial para um grupo e tem as seguintes configurações de configuração para a Replicação de Grupo, de modo que ele esteja anunciando um endereço IPv6 na opção `group_replication_group_seeds`:

```
group_replication_bootstrap_group=on
group_replication_local_address= "[2001:db8:85a3:8d3:1319:8a2e:370:7348]:33061"
group_replication_group_seeds= "[2001:db8:85a3:8d3:1319:8a2e:370:7348]:33061"
```

O servidor B é um membro associado ao grupo e possui as seguintes configurações de configuração para a replicação de grupo, de modo que ele tenha um endereço local de replicação de grupo IPv4:

```
group_replication_bootstrap_group=off
group_replication_local_address= "203.0.113.21:33061"
group_replication_group_seeds= "[2001:db8:85a3:8d3:1319:8a2e:370:7348]:33061"
```

O servidor B também tem um endereço IPv6 alternativo `2001:db8:8b0:40:3d9c:cc43:e006:19e8`. Para que o servidor B se junte ao grupo com sucesso, tanto seu endereço local de replicação de grupo IPv4 quanto seu endereço IPv6 alternativo devem estar listados na allowlist do servidor A, como no exemplo a seguir:

```
group_replication_ip_allowlist=
"203.0.113.0/24,2001:db8:85a3:8d3:1319:8a2e:370:7348,
2001:db8:8b0:40:3d9c:cc43:e006:19e8"
```

Como prática recomendada para permissões de endereços IP de replicação em grupo, o servidor B (e todos os outros membros do grupo) deve ter a mesma lista de permissões do servidor A, a menos que os requisitos de segurança exijam o contrário.

Se algum ou todos os membros de um grupo de replicação estiverem usando uma versão mais antiga do servidor MySQL que não suporte o uso de endereços IPv6 para a replicação de grupo, um membro não poderá participar do grupo usando um endereço IPv6 (ou um nome de host que resolva para um) como seu endereço local de replicação de grupo. Isso se aplica tanto ao caso em que pelo menos um membro existente usa um endereço IPv6 e um novo membro que não suporta isso tenta se juntar, quanto ao caso em que um novo membro tenta se juntar usando um endereço IPv6, mas o grupo inclui pelo menos um membro que não suporta isso. Em cada situação, o novo membro não poderá se juntar. Para fazer com que um membro que está se juntando apresente um endereço IPv4 para as comunicações do grupo, você pode alterar o valor de `group_replication_local_address` para um endereço IPv4 ou configurar seu DNS para resolver o nome de host existente do membro que está se juntando para um endereço IPv4. Após ter atualizado todos os membros do grupo para uma versão do MySQL Server que suporte IPv6 para a replicação de grupo, você pode alterar o valor de `group_replication_local_address` para cada membro para um endereço IPv6 ou configurar seu DNS para apresentar um endereço IPv6. A alteração do valor de `group_replication_local_address` só tem efeito quando você para e reinicia a replicação de grupo.

Os endereços IPv6 também podem ser usados como pontos finais de recuperação distribuída, que podem ser especificados no MySQL 8.0.21 e versões posteriores usando a variável de sistema `group_replication_advertise_recovery_endpoints`. As mesmas regras se aplicam aos endereços usados nesta lista. Veja a Seção 20.5.4.1, “Conexões para Recuperação Distribuída”.
