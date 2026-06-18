### 20.5.1 Configurando um Grupo Online

20.5.1.1 Alterar o primário

20.5.1.2 Alterar o Modo de Grupo

20.5.1.3 Uso do Consenso de Escrita de Grupo na Replicação de Grupo

20.5.1.4 Configurar a versão do protocolo de comunicação de um grupo

20.5.1.5 Configurando ações de membros

Você pode configurar um grupo online enquanto a Replicação de Grupo estiver em execução, usando um conjunto de funções, que dependem de um coordenador de ação de grupo. Essas funções são instaladas pelo plugin de Replicação de Grupo na versão 8.0.13 e superior. Esta seção descreve como as alterações são feitas em um grupo em execução e as funções disponíveis.

Importante

Para que o coordenador possa configurar ações em todo o grupo em um grupo em execução, todos os membros devem estar executando o MySQL 8.0.13 ou uma versão superior e ter as funções instaladas.

Para usar as funções, conecte-se a um membro do grupo em execução e invocando a função com a declaração `SELECT`. O plugin de replicação de grupo processa a ação e seus parâmetros e o coordenador envia para todos os membros que são visíveis para o membro onde você invocou a função. Se a ação for aceita, todos os membros executam a ação e enviam uma mensagem de término quando concluída. Uma vez que todos os membros declaram a ação como concluída, o membro que a invocou retorna o resultado ao cliente.

Ao configurar um grupo inteiro, a natureza distribuída das operações significa que elas interagem com muitos processos do plugin de replicação de grupo, e, portanto, você deve observar o seguinte:

**Você pode emitir operações de configuração em qualquer lugar.** Se você quiser tornar o membro A o novo primário, não precisa invocar a operação no membro A. Todas as operações são enviadas e executadas de maneira coordenada em todos os membros do grupo. Além disso, essa execução distribuída de uma operação tem uma ramificação diferente: se o membro que está invocando morrer, qualquer processo de configuração já em execução continua a ser executado em outros membros. No improvável caso de morte do membro que está invocando, você ainda pode usar as funcionalidades de monitoramento para garantir que outros membros completem a operação com sucesso.

**Todos os membros devem estar online.** Para simplificar os processos de migração ou eleição e garantir que sejam o mais rápidos possível, o grupo não deve conter nenhum membro atualmente no processo de recuperação distribuída, caso contrário, a ação de configuração será rejeitada pelo membro onde você emite a declaração.

**Nenhum membro pode se juntar a um grupo durante uma mudança de configuração.** Qualquer membro que tente se juntar ao grupo durante uma mudança de configuração coordenada sai do grupo e cancela seu processo de adesão.

**Apenas uma configuração de cada vez.** Um grupo que está executando uma mudança de configuração não pode aceitar nenhuma outra mudança de configuração do grupo, porque operações de configuração concorrentes podem levar à divergência dos membros.

**Todos os membros devem estar executando o MySQL 8.0.13 ou superior.** Devido à natureza distribuída das ações de configuração, todos os membros devem reconhecê-las para executá-las. Portanto, a operação é rejeitada se houver algum servidor executando a versão 8.0.12 ou inferior do MySQL Server no grupo.
