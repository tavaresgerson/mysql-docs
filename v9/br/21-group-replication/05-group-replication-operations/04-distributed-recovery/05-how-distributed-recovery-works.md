#### 20.5.4.5 Como Funciona a Recuperação Distribuída

Quando o processo de recuperação distribuída da Replicação em Grupo está realizando a transferência de estado do log binário para sincronizar o membro que está se juntando com o doador até um ponto específico no tempo, o membro que está se juntando e o doador utilizam GTIDs (consulte a Seção 19.1.3, “Replicação com Identificadores Globais de Transação”). No entanto, os GTIDs fornecem apenas um meio para identificar quais transações o membro que está se juntando está faltando. Eles não ajudam a marcar um ponto específico no tempo para o qual o servidor que está se juntando ao grupo deve se atualizar, nem transmitem informações de certificação. Essa é a função dos marcadores de visualização do log binário, que marcam as alterações na visualização do fluxo do log binário e também contêm informações de metadados adicionais, fornecendo ao membro que está se juntando os dados relacionados à certificação que estão faltando.

Este tópico explica o papel das alterações de visualização e do identificador de alteração de visualização, e os passos para realizar a transferência de estado do log binário.

##### Visualização e Alterações de Visualização

Uma *visualização* corresponde a um grupo de membros que estão participando ativamente da configuração atual, ou seja, em um ponto específico no tempo. Eles estão funcionando corretamente e online no grupo.

Uma *alteração de visualização* ocorre quando ocorre uma modificação na configuração do grupo, como a adição ou remoção de um membro. Qualquer mudança de associação a um grupo resulta em uma alteração de visualização independente comunicada a todos os membros no mesmo ponto lógico no tempo.

Um *identificador de visualização* identifica de forma única uma visualização. Ele é gerado sempre que ocorre uma alteração de visualização.

Na camada de comunicação do grupo, visualize as alterações de visualização com seus identificadores de visualização associados para marcar as fronteiras entre os dados trocados antes e depois de um membro se juntar. Esse conceito é implementado por meio de um evento de log binário: o "evento de log de alteração de visualização" (VCLE). O identificador de visualização é registrado para demarcar as transações transmitidas antes e depois das alterações ocorrerem na associação do grupo.

O identificador de visualização em si é construído a partir de duas partes: uma parte gerada aleatoriamente e um inteiro monotonamente crescente. A parte gerada aleatoriamente é gerada quando o grupo é criado e permanece inalterada enquanto houver pelo menos um membro no grupo. O inteiro é incrementado toda vez que ocorre uma alteração de visualização. O uso dessas duas partes diferentes permite que o identificador de visualização identifique as alterações incrementais do grupo causadas por membros que se juntam ou deixam, e também identifique a situação em que todos os membros deixam o grupo em um desligamento completo do grupo, de modo que não permanecem informações sobre qual visualização o grupo estava. Gerar aleatoriamente parte do identificador quando o grupo é iniciado do início garante que os marcadores de dados no log binário permaneçam únicos e que um identificador idêntico não seja reutilizado após um desligamento completo do grupo, pois isso causaria problemas com a recuperação distribuída no futuro.

##### Começar: Grupo Estável

Todos os servidores estão online e processando transações recebidas do grupo. Alguns servidores podem estar um pouco atrasados em termos de transações replicadas, mas eventualmente convergem. O grupo atua como uma única base de dados distribuída e replicada.

**Figura 20.8 Grupo Estável**

![Os servidores S1, S2 e S3 são membros do grupo. O item mais recente em todos os seus logs binários é a transação T20.](images/gr-recovery-1.png)

##### Alterações de Visualização: Um Membro Entra
[Translate]

Sempre que um novo membro se junta ao grupo e, portanto, uma alteração de visualização é realizada, cada servidor online enfileira um evento de registro de alteração de visualização para execução. Isso é enfileirado porque, antes da alteração de visualização, várias transações podem ser enfileiradas no servidor para serem aplicadas e, como tal, pertencem à visualização antiga. Enfileirar o evento de alteração de visualização depois deles garante uma marcação correta de quando isso aconteceu.

Enquanto isso, o membro que se junta seleciona um doador adequado da lista de servidores online, conforme declarado pelo serviço de associação através da abstração de visualização. Um membro se junta à visualização 4 e os membros online escrevem um evento de alteração de visualização no log binário.

**Figura 20.9 Um Membro se Junta**

![Servidor S4 se junta ao grupo e procura um doador. Os servidores S1, S2 e S3 enfileiram a entrada de alteração de visualização VC4 para seus logs binários. Enquanto isso, o servidor S1 está recebendo nova transação T21.](images/gr-recovery-2.png)

##### Transferência de Estado: Atingindo o Tempo
Translation of the text:

Se os membros do grupo e o membro que está se juntando estiverem configurados com o plugin de clonagem (consulte a Seção 20.5.4.2, “Clonagem para Recuperação Distribuída”), e a diferença nas transações entre o membro que está se juntando e o grupo exceder o limite definido para uma operação de clonagem remota (`group_replication_clone_threshold`), a Replicação de Grupo começa a recuperação distribuída com uma operação de clonagem remota. Uma operação de clonagem remota também é realizada se as transações necessárias não estiverem mais presentes nos arquivos de log binário de nenhum membro do grupo. Durante uma operação de clonagem remota, os dados existentes no membro que está se juntando são removidos e substituídos por uma cópia dos dados do doador. Quando a operação de clonagem remota estiver concluída e o membro que está se juntando tiver sido reiniciado, a transferência de estado de um log binário de um doador é realizada para obter as transações que o grupo aplicou enquanto a operação de clonagem remota estava em andamento. Se não houver uma grande lacuna de transações ou se o plugin de clonagem não estiver instalado, a Replicação de Grupo prossegue diretamente para a transferência de estado de um log binário de um doador.

Para a transferência de estado de um log binário de um doador, uma conexão é estabelecida entre o membro que está se juntando e o doador e a transferência de estado começa. Essa interação com o doador continua até que o servidor que está se juntando ao fio do aplicador do grupo processe o evento de log de alteração de visualização que corresponde à alteração de visualização acionada quando o servidor que está se juntando ao grupo entrou no grupo. Em outras palavras, o servidor que está se juntando ao grupo replica do doador até chegar ao marcador com o identificador da visualização que corresponde ao marcador da visualização em que ele já está.

**Figura 20.10 Transferência de Estado: Atingindo o Tempo Perdido**

![O servidor S4 escolheu o servidor S2 como doador. A transferência de estado é executada do servidor S2 para o servidor S4 até que a entrada de alteração de visualização VC4 seja alcançada (view_id = VC4). O servidor S4 usa um buffer temporário de aplicação para a transferência de estado, e seu log binário está atualmente vazio.](images/gr-recovery-3.png)

Como os identificadores de visualização são transmitidos a todos os membros do grupo no mesmo momento lógico, o servidor que entra no grupo sabe em qual identificador de visualização deve parar de replicar. Isso evita cálculos complexos de conjuntos de GTID, pois o identificador de visualização marca claramente quais dados pertencem a cada visualização do grupo.

Enquanto o servidor que entra no grupo está replicando do doador, ele também está cacheando transações recebidas do grupo. Eventualmente, ele para de replicar do doador e passa a aplicar as que estão em cache.

**Figura 20.11 Transações em fila**

![A transferência de estado está completa. O servidor S4 aplicou as transações até T20 e as escreveu em seu log binário. O servidor S4 cacheou a transação T21, que chegou após a alteração de visualização, em um buffer temporário de aplicação enquanto se recupera.](images/gr-recovery-4.png)

##### Finalizado: Apanhado

Quando o servidor que entra no grupo reconhece um evento de log de alteração de visualização com o identificador de visualização esperado, a conexão com o doador é encerrada e ele começa a aplicar as transações em cache. Embora atue como um marcador no log binário, delimitando as alterações de visualização, o evento de log de alteração de visualização também desempenha outro papel. Ele transmite as informações de certificação como percebidas por todos os servidores quando o servidor que entra no grupo entrou no grupo, ou seja, a última alteração de visualização. Sem ela, o servidor que entra no grupo não teria as informações necessárias para poder certificar (detectar conflitos) as transações subsequentes.

A duração do acréscimo não é determinística, pois depende da carga de trabalho e da taxa de transações recebidas pelo grupo. Esse processo é completamente online e o servidor que se junta ao grupo não bloqueia nenhum outro servidor do grupo enquanto está realizando o acréscimo. Portanto, o número de transações que o servidor que se junta ao grupo está atrasado ao passar para essa fase pode, por isso, variar e, assim, aumentar ou diminuir de acordo com a carga de trabalho.

Quando o servidor que se junta ao grupo atinge zero transações na fila e seus dados armazenados são iguais aos dos outros membros, seu estado público muda para online.

**Figura 20.12 Instância Online**

![O servidor S4 agora é um membro online do grupo. Ele aplicou a transação em cache T21, então seu log binário mostra os mesmos itens que os logs binários dos outros membros do grupo e não precisa mais do buffer temporário do aplicador. A nova transação recebida T22 é agora recebida e aplicada por todos os membros do grupo.](images/gr-recovery-5.png)