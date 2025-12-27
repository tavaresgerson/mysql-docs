### 20.5.1 Configurando um Grupo Online

20.5.1.1 Mudando o Primário

20.5.1.2 Mudando o Modo do Grupo

20.5.1.3 Usando o Consenso de Escrita de Replicação de Grupo

20.5.1.4 Definindo a Versão do Protocolo de Comunicação de um Grupo

20.5.1.5 Configurando Ações de Membros

Você pode configurar um grupo online enquanto a Replicação de Grupo estiver em execução, usando um conjunto de funções, que dependem de um coordenador de ação de grupo. Essas funções são instaladas pelo plugin de Replicação de Grupo. Esta seção descreve como as alterações são feitas em um grupo em execução e as funções disponíveis.

Importante

Para que o coordenador possa configurar ações em todo o grupo em execução, todos os membros devem ter as funções instaladas.

Para usar as funções, conecte-se a um membro do grupo em execução e invocando a função com a instrução `SELECT`. O plugin de Replicação de Grupo processa a ação e seus parâmetros e o coordenador envia-os para todos os membros que são visíveis para o membro onde você invocou a função. Se a ação for aceita, todos os membros executam a ação e enviam uma mensagem de término quando concluída. Uma vez que todos os membros declaram a ação como concluída, o membro que invocou retorna o resultado ao cliente.

Ao configurar um grupo inteiro, a natureza distribuída das operações significa que elas interagem com muitos processos do plugin de Replicação de Grupo, e, portanto, você deve observar o seguinte:

**Você pode emitir operações de configuração em qualquer lugar.** Se você quiser fazer do membro A o novo primário, não precisa invocar a operação no membro A. Todas as operações são enviadas e executadas de maneira coordenada em todos os membros do grupo. Além disso, essa execução distribuída de uma operação tem uma ramificação diferente: se o membro que está invocando morrer, qualquer processo de configuração já em execução continua sendo executado em outros membros. No improvável caso de morte do membro que está invocando, você ainda pode usar as funcionalidades de monitoramento para garantir que outros membros completem a operação com sucesso.

**Todos os membros devem estar online.** Para simplificar os processos de migração ou eleição e garantir que sejam o mais rápidos possível, o grupo não deve conter nenhum membro atualmente no processo de recuperação distribuída, caso contrário, a ação de configuração é rejeitada pelo membro onde você emite a declaração.

**Nenhum membro pode se juntar a um grupo durante uma mudança de configuração.** Qualquer membro que tente se juntar ao grupo durante uma mudança de configuração coordenada deixa o grupo e cancela seu processo de junção.

**Apenas uma configuração de cada vez.** Um grupo que está executando uma mudança de configuração não pode aceitar nenhuma outra mudança de configuração de grupo, porque operações de configuração concorrentes poderiam levar à divergência dos membros.