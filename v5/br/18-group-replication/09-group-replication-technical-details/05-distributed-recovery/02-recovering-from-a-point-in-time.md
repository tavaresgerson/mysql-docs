#### 17.9.5.2 Recuperação a Partir de um Ponto Específico no Tempo

Para sincronizar o servidor que está se juntando ao grupo (*server joining the group*) com o doador (*donor*) até um ponto específico no tempo, o servidor que está se juntando ao grupo e o doador utilizam o mecanismo MySQL Global Transaction Identifiers (GTIDs). Consulte [Section 16.1.3, “Replication with Global Transaction Identifiers”](replication-gtids.html "16.1.3 Replication with Global Transaction Identifiers"). No entanto, os GTIDs apenas fornecem um meio de identificar quais transações estão faltando no servidor que está se juntando ao grupo; eles não ajudam a marcar um ponto específico no tempo que o servidor que está se juntando ao grupo deve alcançar (*catch up*), nem ajudam a transmitir informações de certificação. Essa é a função dos *markers* de *view* do *binary log*, que marcam as mudanças de *view* (*view changes*) no fluxo do *binary log* e também contêm informações adicionais de *metadata*, fornecendo ao servidor que está se juntando ao grupo os dados de certificação ausentes.

##### View e View Changes

Para explicar o conceito de *view change markers*, é importante entender o que são um *view* e um *view change*.

Uma *view* corresponde a um grupo de membros participando ativamente da configuração atual, ou seja, em um ponto específico no tempo. Eles estão corretos e *online* no sistema.

Um *view change* ocorre quando acontece uma modificação na configuração do grupo, como um membro entrando (*joining*) ou saindo (*leaving*). Qualquer mudança na membresia do grupo resulta em um *view change* independente comunicado a todos os membros no mesmo ponto lógico no tempo.

Um *view identifier* identifica unicamente uma *view*. Ele é gerado sempre que ocorre um *view change*.

Na camada de comunicação do grupo, os *view changes* com seus *view ids* associados são, então, fronteiras entre os dados trocados antes e depois de um membro se juntar ao grupo. Este conceito é implementado por meio de um novo evento de *binary log*: o "*view change log event*". O *view id* torna-se assim um *marker* também para transações transmitidas antes e depois que as mudanças ocorrem na membresia do grupo.

O próprio *view identifier* é construído a partir de duas partes: *(i)* uma que é gerada aleatoriamente e *(ii)* um inteiro monotonicamente crescente. A primeira parte é gerada quando o grupo é criado e permanece inalterada enquanto houver pelo menos um membro no grupo. A segunda parte é incrementada toda vez que um *view change* ocorre.

A razão para este par heterogêneo que compõe o *view id* é a necessidade de marcar inequivocamente as mudanças do grupo sempre que um membro entra ou sai, mas também sempre que todos os membros saem do grupo e nenhuma informação restante da *view* em que o grupo estava. Na verdade, o uso exclusivo de identificadores monotonicamente crescentes poderia levar à reutilização do mesmo *id* após *shutdowns* completos do grupo, destruindo a unicidade dos *markers* de dados do *binary log* dos quais a recuperação depende. Para resumir, a primeira parte identifica quando o grupo foi iniciado do zero e a parte incremental identifica quando o grupo mudou a partir desse ponto.