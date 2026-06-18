#### 14.18.1.1 Função que configura a replicação primária do grupo

A função a seguir permite que você configure um membro de um grupo de replicação de primário único para assumir o papel de primário. O primário atual se torna um secundário de leitura somente e o membro do grupo especificado se torna o primário de leitura/escrita. A função pode ser usada em qualquer membro de um grupo de replicação que esteja em modo de primário único. Esta função substitui o processo usual de eleição do primário; consulte a Seção 20.5.1.1, “Mudando o Primário”, para obter mais informações.

Se um canal de replicação de fonte padrão estiver sendo executado no membro primário existente, além dos canais de replicação de grupo, você deve interromper esse canal de replicação antes de poder alterar o membro primário. Você pode identificar o membro primário atual usando a coluna `MEMBER_ROLE` na tabela do Schema de Desempenho `replication_group_members`, ou a variável de status `group_replication_primary_member`.

Quaisquer transações não confirmadas que o grupo está aguardando devem ser confirmadas, revertidas ou encerradas antes que a operação possa ser concluída. Antes do MySQL 8.0.29, a função aguarda que todas as transações ativas no primário existente terminem, incluindo as transações recebidas que são iniciadas após o uso da função. A partir do MySQL 8.0.29, você pode especificar um tempo limite para as transações em execução ao usar a função. Para que o tempo limite funcione, todos os membros do grupo devem estar no MySQL 8.0.29 ou superior.

Quando o tempo limite expira, para quaisquer transações que ainda não atingiram sua fase de commit, a sessão do cliente é desconectada para que a transação não prossiga. As transações que atingiram sua fase de commit podem ser concluídas. Ao definir um tempo limite, ele também impede que novas transações sejam iniciadas no primário a partir desse ponto. Transações explicitamente definidas (com uma declaração `START TRANSACTION` ou `BEGIN`) estão sujeitas ao tempo limite, à desconexão e ao bloqueio de transações recebidas, mesmo que não modifiquem nenhum dado. Para permitir a inspeção do primário enquanto a função estiver em operação, declarações únicas que não modifiquem dados, conforme listadas nas Perguntas Permitidas Sob as Regras de Consistência, são permitidas para prosseguir.

- `group_replication_set_as_primary()`

  Nomeia um membro específico do grupo como o novo principal, substituindo qualquer processo eleitoral.

  Sintaxe:

  ```
  STRING group_replication_set_as_primary(member_uuid[, timeout])
  ```

  Argumentos:

  - `member_uuid`: Uma string que contém o UUID do membro do grupo que você deseja tornar o novo principal.

  - `timeout`: Um número inteiro que especifica um tempo de espera em segundos para transações que estão em execução no primário existente quando você usa a função. Você pode definir um tempo de espera de 0 segundos (imediatamente) até 3600 segundos (60 minutos). Quando você define um tempo de espera, novas transações não podem ser iniciadas no primário a partir desse ponto. Não há configuração padrão para o tempo de espera, então, se você não definir, não há limite superior para o tempo de espera, e novas transações podem ser iniciadas durante esse tempo. Esta opção está disponível a partir do MySQL 8.0.29.

  Valor de retorno:

  Uma cadeia que contém o resultado da operação, por exemplo, se foi bem-sucedida ou

  Exemplo:

  ```
  SELECT group_replication_set_as_primary(‘00371d66-3c45-11ea-804b-080027337932’, 300);
  ```

  Para obter mais informações, consulte a Seção 20.5.1.1, “Alterar o primário”.
