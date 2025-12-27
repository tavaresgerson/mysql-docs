#### 20.5.1.1 Mudando o Primário

Esta seção explica como alterar qual membro de um grupo de primário único é o primário, usando a função `group_replication_set_as_primary()`, que pode ser executada em qualquer membro do grupo. Quando isso é feito, o primário atual se torna um secundário de leitura-only, e o membro do grupo especificado se torna o primário de leitura/escrita; isso substitui o processo usual de eleição do primário (veja a Seção 20.1.3.1, “Modo de Primário Único”).

Se um canal de replicação padrão de fonte para réplica estiver em execução no membro primário existente, além dos canais de Replicação de Grupo, você deve parar esse canal de replicação antes de poder alterar o membro primário. Você pode identificar o primário atual usando a coluna `MEMBER_ROLE` na tabela `replication_group_members` do Gerenciamento de Desempenho.

Se todos os membros não estiverem executando a mesma versão do servidor MySQL, você pode especificar um novo membro primário que esteja executando a versão mais baixa do servidor MySQL no grupo apenas. Essa proteção é aplicada para garantir que o grupo mantenha a compatibilidade com novas funções.

Todas as transações não confirmadas pelas quais o grupo está aguardando devem ser confirmadas, revertidas ou encerradas antes que a operação possa ser concluída. Você pode especificar um tempo limite de 1 a 3600 segundos (60 minutos) para transações que estão em execução quando você usar a função. Especifique 0 para sem tempo limite (ou não especifique um valor de tempo limite), caso em que o grupo aguarda indefinidamente. Se você não definir o tempo limite, não há limite superior para o tempo de espera, e novas transações podem começar durante esse tempo.

Quando o tempo limite expira, para quaisquer transações que ainda não tenham atingido a fase de commit, a sessão do cliente é desconectada para que a transação não prossiga. As transações que atingiram a fase de commit podem ser concluídas. Ao definir um tempo limite, ele também impede que novas transações sejam iniciadas no primário a partir desse ponto. Transações explicitamente definidas (com uma declaração `START TRANSACTION` ou `BEGIN`) estão sujeitas ao tempo limite, à desconexão e ao bloqueio de transações recebidas, mesmo que não modifiquem nenhum dado. Para permitir a inspeção do primário enquanto a função estiver em operação, instruções únicas que não modifiquem dados, conforme listadas nas Perguntas Permitidas Sob as Regras de Consistência, podem prosseguir.

Insira o `server_uuid` do membro que deseja se tornar o novo primário do grupo, emitindo a seguinte declaração:

```
SELECT group_replication_set_as_primary(member_uuid);
```

Você pode adicionar um tempo limite, conforme mostrado aqui:

```
SELECT group_replication_set_as_primary(‘00371d66-3c45-11ea-804b-080027337932’, 300)
```

Para verificar o status do tempo limite, use a coluna `PROCESSLIST_INFO` na tabela `threads` do Schema de Desempenho, assim:

```
mysql> SELECT NAME, PROCESSLIST_INFO FROM performance_schema.threads
    -> WHERE NAME="thread/group_rpl/THD_transaction_monitor"\G
*************************** 1. row ***************************
            NAME: thread/group_rpl/THD_transaction_monitor
PROCESSLIST_INFO: Group replication transaction monitor: Stopped client connections
```

O status mostra quando o thread de monitoramento de transações foi criado, quando novas transações foram interrompidas, quando as conexões do cliente com transações não comprometidas foram desconectadas e, finalmente, quando o processo é concluído e novas transações são permitidas novamente.

Enquanto a ação estiver em execução, você pode verificar seu progresso emitindo a declaração mostrada aqui:

```
mysql> SELECT event_name, work_completed, work_estimated
    -> FROM performance_schema.events_stages_current
    -> WHERE event_name LIKE "%stage/group_rpl%"\G
*************************** 1. row ***************************
    EVENT_NAME: stage/group_rpl/Primary Election: Waiting for members to turn on super_read_only
WORK_COMPLETED: 3
WORK_ESTIMATED: 5
```