#### 17.9.7.3 Controle de fluxo

A replicação em grupo garante que uma transação só seja confirmada após a maioria dos membros de um grupo a ter recebido e concordado com a ordem relativa entre todas as transações enviadas simultaneamente.

Essa abordagem funciona bem se o número total de escritas no grupo não exceder a capacidade de escrita de qualquer membro do grupo. Se isso acontecer e alguns dos membros tiverem um desempenho de escrita menor do que outros, especialmente menor do que os membros que escrevem, esses membros podem começar a ficar para trás dos escritores.

Ter alguns membros atrasados em relação ao grupo traz algumas consequências problemáticas, especialmente, as leituras desses membros podem externalizar dados muito antigos. Dependendo da razão pela qual o membro está atrasado, outros membros do grupo podem ter que salvar mais ou menos contexto de replicação para poder atender a solicitações potenciais de transferência de dados do membro lento.

No entanto, há um mecanismo no protocolo de replicação para evitar que haja uma distância excessiva, em termos de transações aplicadas, entre membros rápidos e lentos. Isso é conhecido como mecanismo de controle de fluxo. Ele tenta atender a vários objetivos:

1. para manter os membros próximos o suficiente para tornar o buffer e a des-sincronização entre os membros um pequeno problema;

2. adaptar-se rapidamente às condições em mudança, como diferentes cargas de trabalho ou mais escritores no grupo;

3. para dar a cada membro uma parte justa da capacidade de escrita disponível;

4. não reduzir o desempenho mais do que o estritamente necessário para evitar o desperdício de recursos.

Dada a estrutura da Replicação em Grupo, a decisão de ativar ou não o controle de fluxo pode ser tomada considerando duas filas de trabalho: *(i)* a fila de *certificação* e *(ii)* a fila de *aplicador* do log binário. Sempre que o tamanho de uma dessas filas exceder o limite definido pelo usuário, o mecanismo de controle de fluxo é acionado. Configure apenas: *(i)* se o controle de fluxo deve ser feito no nível do certificador ou do aplicador, ou em ambos; e *(ii)* qual é o limite para cada fila.

O controle de fluxo depende de dois mecanismos básicos:

1. o monitoramento dos membros para coletar algumas estatísticas sobre o desempenho e o tamanho da fila de todos os membros do grupo para fazer suposições informadas sobre qual é a pressão máxima de escrita que cada membro deve ser submetido;

2. o controle dos membros que tentam escrever além de sua parte justa da capacidade disponível em cada momento.

##### 17.9.7.3.1 Sondas e Estatísticas

O mecanismo de monitoramento funciona com cada membro enviando um conjunto de sondas para coletar informações sobre suas filas de trabalho e desempenho. Em seguida, ele propaga essas informações periodicamente para o grupo para compartilhar esses dados com os outros membros.

Essas sondagens estão espalhadas por toda a pilha de plugins e permitem estabelecer métricas, como:

- o tamanho da fila de certificadores;

- tamanho da fila de aplicador de replicação;

- o número total de transações certificadas;

- o número total de transações remotas aplicadas no membro;

- o número total de transações locais.

Quando um membro recebe uma mensagem com estatísticas de outro membro, ele calcula métricas adicionais sobre quantas transações foram certificadas, aplicadas e executadas localmente no último período de monitoramento.

Os dados de monitoramento são compartilhados com outros membros do grupo periodicamente. O período de monitoramento deve ser suficientemente longo para permitir que os outros membros decidam sobre as solicitações de escrita atuais, mas suficientemente curto para que tenha um impacto mínimo na largura de banda do grupo. As informações são compartilhadas a cada segundo, e esse período é suficiente para atender a ambas as preocupações.

##### 17.9.7.3.2 Limitação da replicação em grupo

Com base nas métricas coletadas em todos os servidores do grupo, um mecanismo de controle é ativado e decide se é necessário limitar a taxa na qual um membro pode executar/confirmar novas transações.

Portanto, as métricas adquiridas de todos os membros são a base para calcular a capacidade de cada membro: se um membro tiver uma fila grande (para certificação ou para o thread de solicitação), então a capacidade de executar novas transações deve estar próxima àquelas certificadas ou aplicadas no último período.

A capacidade mais baixa de todos os membros do grupo determina a capacidade real do grupo, enquanto o número de transações locais determina quantos membros estão escrevendo nele e, consequentemente, quantos membros essa capacidade disponível deve ser compartilhada.

Isso significa que cada membro tem uma quota de escrita estabelecida com base na capacidade disponível, ou seja, um número de transações que pode emitir com segurança no próximo período. A quota de escritor é aplicada pelo mecanismo de controle se o tamanho da fila do certificador ou do aplicativo do log binário exceder um limite definido pelo usuário.

A cotas são reduzidas com base no número de transações que foram atrasadas no último período, e depois reduzidas em mais 10% para permitir que a fila que causou o problema diminua de tamanho. Para evitar grandes saltos na taxa de processamento assim que o tamanho da fila ultrapassar o limite, a taxa de processamento só pode crescer em mais 10% por período após isso.

O mecanismo atual de controle não penaliza transações abaixo da cotas, mas retarda o término das transações que excedem essa quantidade até o final do período de monitoramento. Como consequência, se a quota for muito pequena para as solicitações de escrita, algumas transações podem ter latências próximas ao período de monitoramento.
