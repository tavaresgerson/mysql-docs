#### 20.7.7.2 Timeout de Maioridade Inatingível

Por padrão, os membros que se encontram em minoria devido a uma partição de rede não saem automaticamente do grupo. Você pode usar a variável de sistema `group_replication_unreachable_majority_timeout` para definir um número de segundos para que um membro espere após perder o contato com a maioria dos membros do grupo e, em seguida, sair do grupo. Definir um timeout significa que você não precisa monitorar ativamente os servidores que estão em um grupo minoritário após uma partição de rede e pode evitar a possibilidade de criar uma situação de cérebro partido (com duas versões da associação ao grupo) devido a uma intervenção inadequada.

Quando o timeout especificado por `group_replication_unreachable_majority_timeout` expira, todas as transações pendentes que foram processadas pelo membro e pelos outros membros do grupo minoritário são revertidas e os servidores desse grupo passam para o estado `ERROR`. Você pode usar a variável de sistema `group_replication_autorejoin_tries` para forçar o membro a tentar se reiniciar automaticamente neste ponto. Essa funcionalidade está ativa por padrão; o membro faz três tentativas de reinício automático. Se o procedimento de reinício automático não for bem-sucedido ou não for tentado, o membro minoritário então segue a ação de saída especificada por `group_replication_exit_state_action`.

Considere os seguintes pontos ao decidir se deve ou não definir um timeout de maioridade inatingível:

* Em um grupo simétrico, por exemplo, um grupo com dois ou quatro servidores, se ambas as partições contiverem um número igual de servidores, ambos os grupos consideram-se em minoria e entram no estado `ERROR`. Nessa situação, o grupo não tem uma partição funcional.

* Embora exista um grupo minoritário, todas as transações processadas pelo grupo minoritário são aceitas, mas bloqueadas porque os servidores minoritários não conseguem atingir o quórum, até que seja emitido o comando `STOP GROUP_REPLICATION` nesses servidores ou até que o tempo limite de espera da maioria inalcançável seja atingido.

* Se você não definir um tempo limite de espera da maioria inalcançável, os servidores do grupo minoritário nunca entrarão automaticamente no estado `ERROR`, e você precisará pará-los manualmente.

* Definir um tempo limite de espera da maioria inalcançável não tem efeito se for definido nos servidores do grupo minoritário após a detecção da perda da maioria.

Se você não usar a variável de sistema `group_replication_unreachable_majority_timeout`, o processo para a invenção do operador em caso de partição de rede é descrito na Seção 20.7.8, “Tratamento de uma Partição de Rede e Perda de Quórum”. O processo envolve verificar quais servidores estão funcionando e forçar uma nova associação ao grupo, se necessário.