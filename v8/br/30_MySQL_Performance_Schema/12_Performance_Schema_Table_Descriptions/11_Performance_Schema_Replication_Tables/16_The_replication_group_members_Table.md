#### 29.12.11.16 A tabela replication\_group\_members

Esta tabela mostra informações de rede e status dos membros do grupo de replicação. Os endereços de rede mostrados são os endereços usados para conectar os clientes ao grupo e não devem ser confundidos com o endereço de comunicação interna do grupo do membro especificado por `group_replication_local_address`.

A tabela `replication_group_members` tem essas colunas:

- `CHANNEL_NAME`

  Nome do canal de replicação em grupo.

- `MEMBER_ID`

  O UUID do servidor membro. Este tem um valor diferente para cada membro do grupo. Ele também serve como uma chave porque é único para cada membro.

- `MEMBER_HOST`

  Endereço de rede deste membro (nome de host ou endereço IP). Obtém-se a partir da variável `hostname` do membro. Este é o endereço ao qual os clientes se conectam, diferentemente do grupo\_replication\_local\_address, que é usado para comunicação interna do grupo.

- `MEMBER_PORT`

  Porto em que o servidor está ouvindo. Obtendo a partir da variável `port` do membro.

- `MEMBER_STATE`

  Estado atual deste membro; pode ser qualquer um dos seguintes:

  - `ONLINE`: O membro está em um estado totalmente funcional.

  - `RECOVERING`: O servidor se juntou a um grupo do qual está obtendo dados.

  - `OFFLINE`: O plugin de replicação de grupo está instalado, mas não foi iniciado.

  - `ERROR`: O membro encontrou um erro, seja durante a aplicação de transações ou durante a fase de recuperação, e não está participando das transações do grupo.

  - `UNREACHABLE`: O processo de detecção de falhas suspeita que este membro não pode ser contatado, porque as mensagens de grupo expiraram.

  Consulte a Seção 20.4.2, “Estados do Servidor de Replicação em Grupo”.

- `MEMBER_ROLE`

  Papel do membro no grupo, seja `PRIMARY` ou `SECONDARY`.

- `MEMBER_VERSION`

  Versão MySQL do membro.

- `MEMBER_COMMUNICATION_STACK`

  A pilha de comunicação usada para o grupo, seja a pilha de comunicação `XCOM` ou a pilha de comunicação `MYSQL`.

  Esta coluna foi adicionada no MySQL 8.0.27.

A tabela `replication_group_members` não tem índices.

`TRUNCATE TABLE` não é permitido para a tabela `replication_group_members`.
