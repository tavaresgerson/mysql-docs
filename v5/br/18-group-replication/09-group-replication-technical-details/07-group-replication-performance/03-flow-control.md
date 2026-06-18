#### 17.9.7.3 Controle de Fluxo

O Group Replication garante que uma *transaction* só faça o *commit* depois que a maioria dos membros em um grupo a tenha recebido e concordado com a ordem relativa entre todas as *transactions* que foram enviadas concorrentemente.

Essa abordagem funciona bem se o número total de escritas (*writes*) no grupo não exceder a capacidade de escrita (*write capacity*) de nenhum membro no grupo. Se exceder, e alguns dos membros tiverem menor *write throughput* do que outros, particularmente menor do que os membros escritores (*writers*), esses membros podem começar a ficar atrasados (*lagging behind*) em relação aos *writers*.

Ter alguns membros atrasados em relação ao grupo traz algumas consequências problemáticas; em particular, as leituras nesses membros podem externalizar dados muito antigos. Dependendo do motivo pelo qual o membro está atrasado, outros membros do grupo podem ter que salvar mais ou menos contexto de replicação para poder atender a potenciais solicitações de transferência de dados do membro lento.

Existe, no entanto, um mecanismo no protocolo de replicação para evitar que haja muita distância, em termos de *transactions* aplicadas, entre membros rápidos e lentos. Isso é conhecido como mecanismo de controle de fluxo (*flow control*). Ele tenta atingir vários objetivos:

1. manter os membros próximos o suficiente para que o *buffering* e a dessincronização entre os membros sejam um problema menor;

2. adaptar-se rapidamente a condições variáveis, como diferentes *workloads* ou mais *writers* no grupo;

3. dar a cada membro uma parcela justa da *write capacity* disponível;

4. não reduzir o *throughput* mais do que o estritamente necessário para evitar o desperdício de recursos.

Dado o design do Group Replication, a decisão de aplicar ou não o *throttling* (limitação) pode ser tomada levando em consideração duas filas de trabalho: *(i)* a fila de *certification* (*certifier queue*); e *(ii)* a fila do *applier* do *binary log*. Sempre que o tamanho de uma dessas filas excede o *threshold* (limite) definido pelo usuário, o mecanismo de *throttling* é acionado. Configure apenas: *(i)* se deve aplicar o *flow control* no nível do *certifier* ou no nível do *applier*, ou em ambos; e *(ii)* qual é o *threshold* para cada fila.

O *flow control* depende de dois mecanismos básicos:

1. o monitoramento de membros para coletar algumas estatísticas sobre *throughput* e tamanhos de filas de todos os membros do grupo para fazer estimativas informadas sobre qual é a pressão máxima de escrita (*write pressure*) à qual cada membro deve ser submetido;

2. o *throttling* de membros que estão tentando escrever além da sua parte justa (*fair-share*) da capacidade disponível a cada momento.

##### 17.9.7.3.1 Sondas e Estatísticas

O mecanismo de monitoramento funciona fazendo com que cada membro utilize um conjunto de sondas para coletar informações sobre suas filas de trabalho e *throughput*. Em seguida, ele propaga essa informação para o grupo periodicamente, compartilhando esses dados com os outros membros.

Tais sondas estão dispersas por toda a pilha de *plugins* e permitem estabelecer métricas, como:

* o tamanho da fila do *certifier*;
* o tamanho da fila do *replication applier*;
* o número total de *transactions* certificadas;
* o número total de *transactions* remotas aplicadas no membro;

* o número total de *transactions* locais.

Assim que um membro recebe uma mensagem com estatísticas de outro membro, ele calcula métricas adicionais sobre quantas *transactions* foram certificadas, aplicadas e executadas localmente no último período de monitoramento.

Os dados de monitoramento são compartilhados periodicamente com os outros membros do grupo. O período de monitoramento deve ser alto o suficiente para permitir que os outros membros decidam sobre as solicitações de escrita atuais, mas baixo o suficiente para ter um impacto mínimo na largura de banda do grupo. A informação é compartilhada a cada segundo, e esse período é suficiente para atender a ambas as preocupações.

##### 17.9.7.3.2 Throttling do Group Replication

Com base nas métricas coletadas em todos os servidores do grupo, um mecanismo de *throttling* entra em ação e decide se deve limitar a taxa na qual um membro é capaz de executar/fazer *commit* de novas *transactions*.

Portanto, as métricas adquiridas de todos os membros são a base para calcular a capacidade de cada membro: se um membro tiver uma fila grande (para certificação ou para o *applier thread*), a capacidade de executar novas *transactions* deve ser próxima àquelas certificadas ou aplicadas no último período.

A menor capacidade de todos os membros no grupo determina a capacidade real do grupo, enquanto o número de *transactions* locais determina quantos membros estão escrevendo nele e, consequentemente, com quantos membros essa capacidade disponível deve ser compartilhada.

Isso significa que todo membro tem uma cota de escrita (*write quota*) estabelecida com base na capacidade disponível, ou seja, um número de *transactions* que ele pode emitir com segurança para o próximo período. A *writer quota* é aplicada pelo mecanismo de *throttling* se o tamanho da fila do *certifier* ou do *binary log applier* exceder um *threshold* definido pelo usuário.

A cota é reduzida pelo número de *transactions* que foram atrasadas no último período, e, em seguida, é reduzida em mais 10% para permitir que a fila que desencadeou o problema diminua seu tamanho. Para evitar grandes saltos no *throughput* depois que o tamanho da fila ultrapassa o *threshold*, o *throughput* só pode crescer nos mesmos 10% por período depois disso.

O mecanismo de *throttling* atual não penaliza *transactions* abaixo da cota, mas atrasa a conclusão daquelas *transactions* que a excedem até o final do período de monitoramento. Como consequência, se a cota for muito pequena para as solicitações de escrita emitidas, algumas *transactions* podem ter latências próximas ao período de monitoramento.