#### 29.12.11.18 A tabela `replication_group_members`

Esta tabela exibe informações de rede e status dos membros do grupo de replicação. Os endereços de rede mostrados são os endereços usados para conectar clientes ao grupo e não devem ser confundidos com o endereço de comunicação interno do grupo do membro especificado por `group_replication_local_address`.

A tabela `replication_group_members` tem as seguintes colunas:

* `CHANNEL_NAME`

  Nome do canal de replicação do grupo.

* `MEMBER_ID`

  O UUID do servidor membro. Este tem um valor diferente para cada membro do grupo. Também serve como chave porque é único para cada membro.

* `MEMBER_HOST`

  Endereço de rede deste membro (nome de host ou endereço IP). Obtém-se a partir da variável `hostname` do membro. Este é o endereço ao qual os clientes se conectam, diferentemente do `group_replication_local_address`, que é usado para a comunicação interna do grupo.

* `MEMBER_PORT`

  Porta na qual o servidor está ouvindo. Obtém-se a partir da variável `port` do membro.

* `MEMBER_STATE`

  Estado atual deste membro; pode ser qualquer um dos seguintes:

  + `ONLINE`: O membro está em um estado totalmente funcional.

  + `RECOVERING`: O servidor se juntou a um grupo do qual está recuperando dados.

  + `OFFLINE`: O plugin de replicação do grupo está instalado, mas não foi iniciado.

  + `ERROR`: O membro encontrou um erro, seja durante a aplicação de transações ou durante a fase de recuperação, e não está participando das transações do grupo.

  + `UNREACHABLE`: O processo de detecção de falhas suspeita que este membro não pode ser contatado, porque as mensagens do grupo expiraram.

  Veja a Seção 20.4.2, “Estados do servidor de replicação do grupo”.

* `MEMBER_ROLE`

  Papel do membro no grupo, `PRIMARY` ou `SECONDARY`.

* `MEMBER_VERSION`

Versão do MySQL do membro.

* `MEMBER_COMMUNICATION_STACK`

  A pilha de comunicação usada para o grupo, seja a pilha de comunicação `XCOM` ou a pilha de comunicação `MYSQL`.

A tabela `replication_group_members` não tem índices.

A operação `TRUNCATE TABLE` não é permitida para a tabela `replication_group_members`.