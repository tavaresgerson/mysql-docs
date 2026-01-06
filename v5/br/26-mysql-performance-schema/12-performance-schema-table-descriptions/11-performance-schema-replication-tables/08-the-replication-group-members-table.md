#### 25.12.11.8 A tabela replication\_group\_members

Esta tabela mostra informações de rede e status dos membros do grupo de replicação. Os endereços de rede mostrados são os endereços usados para conectar os clientes ao grupo e não devem ser confundidos com o endereço interno de comunicação do grupo do membro especificado por `group_replication_local_address`.

A tabela `replication_group_members` tem as seguintes colunas:

- `NOME_CANAL`

  Nome do canal de replicação em grupo.

- `ID_ASSOCIAÇÃO`

  Identificador deste membro; o mesmo que o UUID do servidor.

- `MEMBER_HOST`

  Endereço de rede deste membro (nome de host ou endereço IP). Obtendo a partir da variável do membro `hostname`.

- `MEMBER_PORT`

  Porto em que o servidor está ouvindo. Obtendo a partir da variável do membro `port`.

- `MEMBER_STATE`

  Estado atual deste membro; pode ser qualquer um dos seguintes:

  - `OFFLINE`: O plugin de replicação em grupo está instalado, mas não foi iniciado.

  - `RECOVERING`: O servidor se juntou a um grupo do qual está recuperando dados.

  - `ONLINE`: O membro está em um estado totalmente funcional.

  - `ERRO`: O membro encontrou um erro, seja durante a aplicação de transações ou durante a fase de recuperação, e não está participando das transações do grupo.

  - `INCONTECCÍVEL`: O processo de detecção de falhas suspeita que este membro não pode ser contatado, porque as mensagens do grupo expiraram.

A operação `TRUNCATE TABLE` não é permitida para a tabela `replication_group_members`.
