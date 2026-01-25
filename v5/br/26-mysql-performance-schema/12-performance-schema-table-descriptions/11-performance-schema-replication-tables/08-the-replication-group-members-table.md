#### 25.12.11.8 A Tabela replication_group_members

Esta tabela mostra informações de rede e status para os membros do grupo de replicação. Os endereços de rede exibidos são os endereços usados para conectar clients ao grupo, e não devem ser confundidos com o endereço interno de comunicação do grupo do membro, especificado pela variável [`group_replication_local_address`](group-replication-system-variables.html#sysvar_group_replication_local_address).

A tabela `replication_group_members` possui estas colunas:

* `CHANNEL_NAME`

  Nome do canal do Group Replication.

* `MEMBER_ID`

  Identificador para este membro; o mesmo que o UUID do Server.

* `MEMBER_HOST`

  Endereço de rede deste membro (host name ou endereço IP). Obtido da variável [`hostname`](server-system-variables.html#sysvar_hostname) do membro.

* `MEMBER_PORT`

  Port na qual o Server está ouvindo. Obtido da variável [`port`](server-system-variables.html#sysvar_port) do membro.

* `MEMBER_STATE`

  Estado atual deste membro; pode ser um dos seguintes:

  + `OFFLINE`: O Plugin Group Replication está instalado, mas não foi iniciado.

  + `RECOVERING`: O Server se juntou a um grupo do qual está recuperando dados.

  + `ONLINE`: O membro está em um estado de funcionamento completo.

  + `ERROR`: O membro encontrou um error, seja durante a aplicação de transactions ou durante a fase de recovery, e não está participando das transactions do grupo.

  + `UNREACHABLE`: O processo de detecção de falhas suspeita que este membro não pode ser contatado, pois as mensagens do grupo atingiram o timeout.

O comando [`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") não é permitido para a tabela [`replication_group_members`](performance-schema-replication-group-members-table.html "25.12.11.8 The replication_group_members Table").