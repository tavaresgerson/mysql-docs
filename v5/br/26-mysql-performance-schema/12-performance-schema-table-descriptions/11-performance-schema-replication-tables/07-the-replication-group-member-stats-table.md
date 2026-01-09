#### 25.12.11.7 Tabela replication_group_member_stats

Esta tabela mostra informações estatísticas para os membros da replicação em grupo do MySQL. Ela é preenchida apenas quando a replicação em grupo está em execução.

A tabela `replication_group_member_stats` tem as seguintes colunas:

- `NOME_CANAL`

  Nome do canal de replicação em grupo.

- `VIEW_ID`

  Identificador de visualização atual para este grupo.

- `ID_ASSOCIAÇÃO`

  O UUID do servidor membro. Este tem um valor diferente para cada membro do grupo. Ele também serve como uma chave porque é único para cada membro.

- `CONTAR_TRANSACOES_EM_FILA`

  O número de transações na fila aguardando verificações de detecção de conflitos. Uma vez que as transações tenham sido verificadas quanto a conflitos, se passarem na verificação, elas também serão colocadas na fila para serem aplicadas.

- `CONTAR_TRANSACOES_VERIFICADAS`

  Número de transações que foram verificadas quanto a conflitos.

- `CONTAR_CONFLITOS_DESCOBERTOS`

  O número de transações que não passaram na verificação de detecção de conflitos.

- `CONTAR_LINHAS_DE_TRANSACOES_VALIDANDO`

  Número de linhas de transação que podem ser usadas para certificação, mas ainda não foram coletadas como lixo. Pode ser pensado como o tamanho atual do banco de dados de detecção de conflitos contra o qual cada transação é certificada.

- `TRANSACTIONS_COMMITTED_ALL_MEMBERS`

  As transações que foram comprometidas com sucesso em todos os membros do grupo de replicação, mostradas como GTID Sets. Isso é atualizado em um intervalo de tempo fixo.

- `Última transação sem conflito`

  O identificador de transação do último registro de transação livre de conflitos que foi verificado.

A operação `TRUNCATE TABLE` não é permitida para a tabela `replication_group_member_stats`.
