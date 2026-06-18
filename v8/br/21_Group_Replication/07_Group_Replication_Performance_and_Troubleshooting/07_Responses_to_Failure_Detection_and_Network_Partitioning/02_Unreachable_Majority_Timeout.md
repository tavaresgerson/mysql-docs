#### 20.7.7.2 Timeout de maioria inatingível

Por padrão, os membros que se encontram em minoria devido a uma partição de rede não saem automaticamente do grupo. Você pode usar a variável de sistema `group_replication_unreachable_majority_timeout` para definir um número de segundos para que um membro espere após perder o contato com a maioria dos membros do grupo e, em seguida, sair do grupo. Definir um tempo limite significa que você não precisa monitorar ativamente os servidores que estão em um grupo minoritário após uma partição de rede e pode evitar a possibilidade de criar uma situação de split-brain (com duas versões da associação ao grupo) devido a uma intervenção inadequada.

Quando o tempo limite especificado por `group_replication_unreachable_majority_timeout` expira, todas as transações pendentes que foram processadas pelo membro e pelos outros do grupo minoritário são revertidas, e os servidores desse grupo passam para o estado `ERROR`. Você pode usar a variável de sistema `group_replication_autorejoin_tries`, disponível a partir do MySQL 8.0.16, para fazer com que o membro tente automaticamente se reiniciar no grupo neste ponto. A partir do MySQL 8.0.21, essa funcionalidade é ativada por padrão e o membro faz três tentativas de reinício automático. Se o procedimento de reinício automático não for bem-sucedido ou não for tentado, o membro minoritário então segue a ação de saída especificada por `group_replication_exit_state_action`.

Considere os seguintes pontos ao decidir se deve ou não definir um limite de tempo para a maioria inacessível:

- Em um grupo simétrico, por exemplo, um grupo com dois ou quatro servidores, se ambas as partições contiverem um número igual de servidores, ambos os grupos consideram-se em minoria e entram no estado `ERROR`. Nessa situação, o grupo não tem uma partição funcional.

- Embora exista um grupo minoritário, todas as transações processadas pelo grupo minoritário são aceitas, mas bloqueadas porque os servidores minoritários não conseguem atingir o quórum, até que seja emitido o `STOP GROUP_REPLICATION` nesses servidores ou o tempo limite da maioria inacessível seja atingido.

- Se você não definir um limite de tempo para a maioria inacessível, os servidores do grupo minoritário nunca entrarão no estado `ERROR` automaticamente, e você precisará paralisá-los manualmente.

- Definir um limite de tempo para a maioria inacessível não tem efeito se for definido nos servidores do grupo minoritário após a detecção da perda da maioria.

Se você não usar a variável `group_replication_unreachable_majority_timeout`, o processo para a invenção de um operador em caso de partição da rede é descrito na Seção 20.7.8, “Tratamento de uma Partição da Rede e Perda de Quórum”. O processo envolve verificar quais servidores estão funcionando e, se necessário, forçar uma nova associação ao grupo.
