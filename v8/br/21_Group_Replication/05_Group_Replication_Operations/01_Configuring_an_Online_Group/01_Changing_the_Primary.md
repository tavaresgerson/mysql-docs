#### 20.5.1.1 Mudar o primário

Esta seção explica como alterar qual membro de um grupo de único primário é o primário, usando a função `group_replication_set_as_primary()`, que pode ser executada em qualquer membro do grupo. Quando isso é feito, o primário atual se torna um secundário de leitura apenas, e o membro do grupo especificado se torna o primário de leitura e escrita; isso substitui o processo usual de eleição de primário, conforme descrito na Seção 20.1.3.1, “Modo de Primário Único”.

Se um canal de replicação padrão de fonte para réplica estiver em execução no membro primário existente, além dos canais de replicação de grupo, você deve interromper esse canal de replicação antes de poder alterar o membro primário. Você pode identificar o membro primário atual usando a coluna `MEMBER_ROLE` na tabela do Schema de Desempenho `replication_group_members`, ou a variável de status `group_replication_primary_member`.

Se todos os membros não estiverem executando a mesma versão do MySQL Server, você pode especificar um novo membro primário que esteja executando a versão mais baixa do MySQL Server apenas no grupo. Esta proteção é aplicada para garantir que o grupo mantenha a compatibilidade com novas funções. Isso é recomendado para todas as versões do MySQL e é obrigatório a partir do MySQL 8.0.17.

Quaisquer transações não confirmadas que o grupo está aguardando devem ser confirmadas, revertidas ou encerradas antes que a operação possa ser concluída. Antes do MySQL 8.0.29, a função aguarda que todas as transações ativas no primário existente terminem, incluindo as transações recebidas que são iniciadas após o uso da função. A partir do MySQL 8.0.29, você pode especificar um tempo de espera de 1 a 3600 segundos (60 minutos) para as transações que estão em execução quando você usa a função. Para que o tempo de espera funcione, todos os membros do grupo devem estar no MySQL 8.0.29 ou superior. Especifique 0 para sem tempo de espera (ou não especifique um valor de tempo de espera), caso em que o grupo aguarda indefinidamente. Se você não definir o tempo de espera, não há limite superior para o tempo de espera, e novas transações podem começar durante esse tempo.

Quando o tempo limite expira, para quaisquer transações que ainda não atingiram sua fase de commit, a sessão do cliente é desconectada para que a transação não prossiga. As transações que atingiram sua fase de commit podem ser concluídas. Ao definir um tempo limite, ele também impede que novas transações sejam iniciadas no primário a partir desse ponto. Transações explicitamente definidas (com uma declaração `START TRANSACTION` ou `BEGIN`) estão sujeitas ao tempo limite, à desconexão e ao bloqueio de transações recebidas, mesmo que não modifiquem nenhum dado. Para permitir a inspeção do primário enquanto a função estiver em operação, declarações únicas que não modifiquem dados, conforme listadas nas Perguntas Permitidas Sob as Regras de Consistência, são permitidas para prosseguir.

Insira o `server_uuid` do membro que deseja tornar-se o novo principal do grupo, emitindo a seguinte declaração:

```
SELECT group_replication_set_as_primary(member_uuid);
```

No MySQL 8.0.29 e versões posteriores, você pode adicionar um tempo de espera, conforme mostrado aqui:

```
SELECT group_replication_set_as_primary(‘00371d66-3c45-11ea-804b-080027337932’, 300)
```

Para verificar o status do tempo limite, use a coluna `PROCESSLIST_INFO` na tabela do Gerenciamento de Desempenho `threads`, da seguinte maneira:

```
mysql> SELECT NAME, PROCESSLIST_INFO FROM performance_schema.threads
    -> WHERE NAME="thread/group_rpl/THD_transaction_monitor"\G
*************************** 1. row ***************************
            NAME: thread/group_rpl/THD_transaction_monitor
PROCESSLIST_INFO: Group replication transaction monitor: Stopped client connections
```

O status mostra quando o fio de monitoramento de transações foi criado, quando novas transações foram interrompidas, quando as conexões do cliente com transações não confirmadas foram desconectadas e, finalmente, quando o processo está concluído e novas transações são permitidas novamente.

Enquanto a ação estiver em andamento, você pode verificar seu progresso emitindo a declaração mostrada aqui:

```
mysql> SELECT event_name, work_completed, work_estimated
    -> FROM performance_schema.events_stages_current
    -> WHERE event_name LIKE "%stage/group_rpl%"\G
*************************** 1. row ***************************
    EVENT_NAME: stage/group_rpl/Primary Election: Waiting for members to turn on super_read_only
WORK_COMPLETED: 3
WORK_ESTIMATED: 5
```
