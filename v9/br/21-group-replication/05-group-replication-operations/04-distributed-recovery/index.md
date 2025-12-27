### 20.5.4 Recuperação Distribuída

20.5.4.1 Conexões para Recuperação Distribuída

20.5.4.2 Clonagem para Recuperação Distribuída

20.5.4.3 Configuração da Recuperação Distribuída

20.5.4.4 Tolerância a Falhas para Recuperação Distribuída

20.5.4.5 Como Funciona a Recuperação Distribuída

Sempre que um membro se junta ou retorna a um grupo de replicação, ele deve recuperar as transações que foram aplicadas pelos membros do grupo antes de se juntar ou enquanto estava ausente. Esse processo é chamado de recuperação distribuída.

O membro que se junta começa verificando o log de retransmissão de seu canal `group_replication_applier` para quaisquer transações que já recebeu do grupo, mas ainda não aplicou. Se o membro que se junta estava no grupo anteriormente, ele pode encontrar transações não aplicadas antes de sair, e, nesse caso, aplica essas transações como primeiro passo. Um membro novo no grupo não tem nada para aplicar.

Depois disso, o membro que se junta se conecta a um membro existente online para realizar a transferência de estado. O membro que se junta transfere todas as transações que ocorreram no grupo antes de se juntar ou enquanto estava ausente, que são fornecidas pelo membro existente (chamado de *doador*). Em seguida, o membro que se junta aplica as transações que ocorreram no grupo enquanto essa transferência de estado estava em andamento. Quando esse processo estiver concluído, o membro que se junta alcançou o restante dos servidores no grupo e começa a participar normalmente no grupo.

A Replicação de Grupo usa uma combinação desses métodos para transferência de estado durante a recuperação distribuída:

* Uma operação de clonagem remota usando a função do plugin de clonagem. Para habilitar este método de transferência de estado, você deve instalar o plugin de clonagem nos membros do grupo e no membro que está se juntando. A Replicação de Grupo configura automaticamente as configurações necessárias do plugin de clonagem e gerencia a operação de clonagem remota.

* Replicando a partir do log binário de um dador e aplicando as transações no membro que está se juntando. Este método usa um canal de replicação assíncrona padrão chamado `group_replication_recovery` que é estabelecido entre o dador e o membro que está se juntando.

A Replicação de Grupo seleciona automaticamente a melhor combinação desses métodos para a transferência de estado após você emitir `START GROUP_REPLICATION` no membro que está se juntando. Para fazer isso, a Replicação de Grupo verifica quais membros existentes são adequados como dadores, quantos transações o membro que está se juntando precisa de um dador e se alguma transação necessária não está mais presente nos arquivos de log binário de nenhum membro do grupo. Se a lacuna de transação entre o membro que está se juntando e um dador adequado for grande, ou se algumas transações necessárias não estiverem em nenhum arquivo de log binário de nenhum dador, a Replicação de Grupo começa a recuperação distribuída com uma operação de clonagem remota. Se não houver uma grande lacuna de transação, ou se o plugin de clonagem não estiver instalado, a Replicação de Grupo prossegue diretamente para a transferência de estado a partir do log binário de um dador.

* Durante uma operação de clonagem remota, os dados existentes no membro que está se juntando são removidos e substituídos por uma cópia dos dados do dador. Quando a operação de clonagem remota estiver concluída e o membro que está se juntando tiver reiniciado, a transferência de estado a partir do log binário de um dador é realizada para obter as transações que o grupo aplicou enquanto a operação de clonagem remota estava em andamento.

* Durante a transferência de estado de um log binário de um dador, o membro que se junta replica e aplica as transações necessárias do log binário do dador, aplicando as transações conforme recebidas, até o ponto em que o log binário registra que o membro que se junta se juntou ao grupo (um evento de alteração de visão). Enquanto isso está em andamento, o membro que se junta armazena as novas transações que o grupo aplica. Quando a transferência de estado do log binário está concluída, o membro que se junta aplica as transações armazenadas.

Quando o membro que se junta está atualizado com todas as transações do grupo, ele é declarado online e pode participar do grupo como um membro normal, e a recuperação distribuída está concluída.

Dica

A transferência de estado do log binário é o mecanismo básico da Replicação em Grupo para a recuperação distribuída, e se os dadores e os membros que se juntam no seu grupo de replicação não estiverem configurados para suportar o clonamento, essa é a única opção disponível. Como a transferência de estado do log binário é baseada na replicação clássica assíncrona, pode levar muito tempo se o servidor que se junta ao grupo não tiver os dados do grupo, ou tiver dados tirados de uma imagem de backup muito antiga. Nessa situação, portanto, recomenda-se que, antes de adicionar um servidor ao grupo, você o configure com os dados do grupo, transferindo um instantâneo bastante recente de um servidor já no grupo. Isso minimiza o tempo necessário para a recuperação distribuída e reduz o impacto nos servidores do dador, uma vez que eles precisam reter e transferir menos arquivos de log binário.