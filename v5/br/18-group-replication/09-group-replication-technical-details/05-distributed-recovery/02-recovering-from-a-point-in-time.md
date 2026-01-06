#### 17.9.5.2 Recuperação a partir de um ponto no tempo

Para sincronizar o servidor que está se juntando ao grupo com o doador até um ponto específico no tempo, o servidor que está se juntando ao grupo e o doador utilizam o mecanismo de Identificadores Globais de Transações (GTIDs) do MySQL. Veja Seção 16.1.3, “Replicação com Identificadores Globais de Transações”. No entanto, os GTIDs fornecem apenas um meio para identificar quais transações o servidor que está se juntando ao grupo está faltando, eles não ajudam a marcar um ponto específico no tempo para o qual o servidor que está se juntando ao grupo deve se atualizar, nem ajudam a transmitir informações de certificação. Essa é a função dos marcadores de visualização de log binário, que marcam as mudanças de visualização no fluxo do log binário e também contêm informações de metadados adicionais, fornecendo ao servidor que está se juntando ao grupo os dados de certificação faltantes.

##### Visualizar e Visualizar Alterações

Para explicar o conceito de marcadores de mudança de visualização, é importante entender o que é uma visualização e o que é uma mudança de visualização.

Uma *visão* corresponde a um grupo de membros que estão participando ativamente da configuração atual, ou seja, em um momento específico. Eles estão corretos e online no sistema.

Uma *mudança de visualização* ocorre quando há uma modificação na configuração do grupo, como quando um membro se junta ou sai. Qualquer mudança na associação ao grupo resulta em uma mudança de visualização independente comunicada a todos os membros no mesmo ponto lógico de tempo.

Um *identificador de visualização* identifica de forma única uma visualização. Ele é gerado sempre que uma alteração na visualização ocorre.

Na camada de comunicação de grupo, as alterações de visualização com seus IDs de visualização associados são, então, limites entre os dados trocados antes e depois de um membro se juntar. Esse conceito é implementado por meio de um novo evento de log binário: o "evento de log de alteração de visualização". O ID de visualização, portanto, também se torna um marcador para transações transmitidas antes e depois de alterações ocorrerem na associação do grupo.

O identificador da visualização é composto por duas partes: *(i)* uma gerada aleatoriamente e *(ii)* um número inteiro que aumenta de forma monótona. A primeira parte é gerada quando o grupo é criado e permanece inalterada enquanto houver pelo menos um membro no grupo. A segunda parte é incrementada toda vez que ocorre uma mudança na visualização.

A razão para essa combinação heterogênea que compõe o ID de visualização é a necessidade de marcar de forma inequívoca as mudanças de grupo sempre que um membro se junta ou sai, mas também sempre que todos os membros saem do grupo e não há mais informações sobre em que visualização o grupo estava. De fato, o uso exclusivo de identificadores incrementais poderia levar à reutilização do mesmo ID após o desligamento completo do grupo, destruindo a singularidade dos marcadores de dados do log binário de que depende a recuperação. Para resumir, a primeira parte identifica sempre que o grupo foi iniciado do início e a parte incremental quando o grupo mudou a partir desse ponto.
