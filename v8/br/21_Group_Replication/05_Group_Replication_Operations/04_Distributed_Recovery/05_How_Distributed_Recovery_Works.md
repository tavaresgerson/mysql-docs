#### 20.5.4.5 Como funciona a recuperação distribuída

Quando o processo de recuperação distribuída da Replicação em Grupo está realizando a transferência de estado do log binário para sincronizar o membro que está se juntando com o doador até um ponto específico no tempo, o membro que está se juntando e o doador utilizam GTIDs (consulte a Seção 19.1.3, “Replicação com Identificadores Globais de Transação”). No entanto, os GTIDs apenas fornecem um meio para identificar quais transações o membro que está se juntando está faltando. Eles não ajudam a marcar um ponto específico no tempo para o qual o servidor que está se juntando ao grupo deve se atualizar, nem transmitem informações de certificação. Esse é o trabalho dos marcadores de visualização do log binário, que marcam as alterações na visualização do fluxo do log binário e também contêm informações de metadados adicionais, fornecendo ao membro que está se juntando os dados de certificação faltantes.

Este tópico explica o papel das alterações de visualização e do identificador de alteração de visualização, além das etapas para realizar a transferência de estado a partir do log binário.

##### Visualizar e Visualizar Alterações

Uma *visão* corresponde a um grupo de membros que participam ativamente da configuração atual, ou seja, em um momento específico. Eles estão funcionando corretamente e online no grupo.

Uma *mudança de visualização* ocorre quando há uma modificação na configuração do grupo, como quando um membro se junta ou sai. Qualquer mudança na associação ao grupo resulta em uma mudança de visualização independente comunicada a todos os membros no mesmo ponto lógico de tempo.

Um *identificador de visualização* identifica de forma única uma visualização. Ele é gerado sempre que uma alteração na visualização ocorre.

Na camada de comunicação de grupo, as alterações de visualização com seus identificadores de visualização associados marcam as fronteiras entre os dados trocados antes e depois de um membro se juntar. Esse conceito é implementado por meio de um evento de registro binário: o "evento de registro de alteração de visualização" (VCLE). O identificador de visualização é registrado para demarcar as transações transmitidas antes e depois das alterações ocorrerem na associação do grupo.

O identificador de visualização em si é construído a partir de duas partes: uma parte gerada aleatoriamente e um número inteiro que aumenta de forma monótona. A parte gerada aleatoriamente é gerada quando o grupo é criado e permanece inalterada enquanto houver pelo menos um membro no grupo. O número inteiro é incrementado toda vez que ocorre uma mudança de visualização. O uso dessas duas partes diferentes permite que o identificador de visualização identifique mudanças incrementais no grupo causadas por membros que se juntam ou deixam, e também identifique a situação em que todos os membros deixam o grupo em um desligamento completo do grupo, de modo que nenhuma informação sobre a visualização do grupo permanece. Gerar aleatoriamente parte do identificador quando o grupo é iniciado do início garante que os marcadores de dados no log binário permaneçam únicos e que um identificador idêntico não seja reutilizado após um desligamento completo do grupo, pois isso causaria problemas com a recuperação distribuída no futuro.

##### Comece: Grupo estável

Todos os servidores estão online e processando as transações recebidas do grupo. Alguns servidores podem estar um pouco atrasados em termos de transações replicadas, mas eventualmente eles convergem. O grupo atua como um banco de dados distribuído e replicado.

**Figura 20.8 Grupo estável**

![Servers S1, S2, and S3 are members of the group. The most recent item in all of their binary logs is transaction T20.](images/gr-recovery-1.png)

##### Visualizar Alteração: um Membro se junta

Sempre que um novo membro se junta ao grupo e, portanto, uma alteração de visualização é realizada, cada servidor online enfileira um evento de registro de alteração de visualização para execução. Isso é enfileirado porque, antes da alteração de visualização, várias transações podem ser enfileiradas no servidor para serem aplicadas e, como tal, pertencem à visualização antiga. Enfileirar o evento de alteração de visualização depois deles garante uma marcação correta de quando isso aconteceu.

Enquanto isso, o membro associado seleciona um doador adequado da lista de servidores online, conforme indicado pelo serviço de associação através da abstração de visualização. Um membro se associa na visualização 4 e os membros online escrevem um evento de alteração de visualização no log binário.

**Figura 20.9 Um Membro se Junta**

![Server S4 joins the group and looks for a donor. Servers S1, S2, and S3 each queue the view change entry VC4 for their binary logs. Meanwhile, server S1 is receiving new transaction T21.](images/gr-recovery-2.png)

##### Transferência de Estado: Atingindo o Desempenho

Se os membros do grupo e o membro que está se juntando estiverem configurados com o plugin de clonagem (consulte a Seção 20.5.4.2, “Clonagem para Recuperação Distribuída”), e a diferença nas transações entre o membro que está se juntando e o grupo exceder o limite definido para uma operação de clonagem remota (`group_replication_clone_threshold`), a Replicação em Grupo começa a recuperação distribuída com uma operação de clonagem remota. Uma operação de clonagem remota também é realizada se as transações necessárias não estiverem mais presentes nos arquivos de log binário de nenhum membro do grupo. Durante uma operação de clonagem remota, os dados existentes no membro que está se juntando são removidos e substituídos por uma cópia dos dados do doador. Quando a operação de clonagem remota estiver concluída e o membro que está se juntando tiver sido reiniciado, a transferência de estado de um log binário de um doador é realizada para obter as transações que o grupo aplicou enquanto a operação de clonagem remota estava em andamento. Se não houver uma grande lacuna de transações ou se o plugin de clonagem não estiver instalado, a Replicação em Grupo prossegue diretamente para a transferência de estado de um log binário de um doador.

Para a transferência de estado a partir do log binário de um membro doador, uma conexão é estabelecida entre o membro que está se juntando e o doador, e a transferência de estado começa. Essa interação com o doador continua até que o servidor que está se juntando ao fio de aplicação do grupo processe o evento do log de alteração de visualização que corresponde à alteração de visualização acionada quando o servidor que está se juntando ao grupo entrou no grupo. Em outras palavras, o servidor que está se juntando ao grupo replica a partir do doador, até chegar ao marcador com o identificador da visualização que corresponde ao marcador de visualização em que ele já está.

**Figura 20.10: Transferência de Estado: Atingindo o Tempo**

![Server S4 has chosen server S2 as the donor. State transfer is executed from server S2 to server S4 until the view change entry VC4 is reached (view\_id = VC4). Server S4 uses a temporary applier buffer for state transfer, and its binary log is currently empty.](images/gr-recovery-3.png)

Como os identificadores de visualização são transmitidos a todos os membros do grupo no mesmo momento lógico, o servidor que se junta ao grupo sabe em qual identificador de visualização deve parar de replicar. Isso evita cálculos complexos de conjuntos de GTID, pois o identificador de visualização marca claramente quais dados pertencem a cada visualização do grupo.

Enquanto o servidor que está se juntando ao grupo está replicando do doador, ele também está armazenando transações recebidas do grupo. Eventualmente, ele para de replicar do doador e passa a aplicar as que estão armazenadas.

**Figura 20.11 Transações em fila**

![State transfer is complete. Server S4 has applied the transactions up to T20 and written them to its binary log. Server S4 has cached transaction T21, which arrived after the view change, in a temporary applier buffer while recovering.](images/gr-recovery-4.png)

##### Finalizado: Pego no meio

Quando o servidor que está se juntando ao grupo reconhece um evento de registro de alterações de visualização com o identificador de visualização esperado, a conexão com o doador é encerrada e ele começa a aplicar as transações armazenadas. Embora atue como um marcador no log binário, delimitando as alterações de visualização, o evento de registro de alterações de visualização também desempenha outro papel. Ele transmite as informações de certificação percebidas por todos os servidores quando o servidor que está se juntando ao grupo entrou no grupo, ou seja, a última alteração de visualização. Sem ele, o servidor que está se juntando ao grupo não teria as informações necessárias para poder certificar (detectar conflitos) as transações subsequentes.

A duração do processo de recuperação não é determinística, pois depende da carga de trabalho e da taxa de transações recebidas pelo grupo. Esse processo é totalmente online e o servidor que se junta ao grupo não bloqueia nenhum outro servidor do grupo enquanto está realizando a recuperação. Portanto, o número de transações que o servidor que se junta ao grupo está atrasado ao passar para essa fase pode, por isso, variar e, assim, aumentar ou diminuir de acordo com a carga de trabalho.

Quando o servidor que está se juntando ao grupo atingir zero transações em fila e seus dados armazenados forem iguais aos dos outros membros, seu estado público será alterado para online.

**Figura 20.12 Instância Online**

![Server S4 is now an online member of the group. It has applied cached transaction T21, so its binary log shows the same items as the binary logs of the other group members, and it no longer needs the temporary applier buffer. New incoming transaction T22 is now received and applied by all group members.](images/gr-recovery-5.png)
