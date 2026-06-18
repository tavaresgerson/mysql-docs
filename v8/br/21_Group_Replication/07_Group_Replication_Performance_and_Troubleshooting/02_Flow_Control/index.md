### 20.7.2 Controle de fluxo

20.7.2.1 Sondas e Estatísticas

20.7.2.2 Limitação da replicação em grupo

O grupo de replicação do MySQL garante que uma transação só seja confirmada após a maioria dos membros de um grupo a ter recebido e concordado com a ordem relativa entre todas as transações enviadas simultaneamente. Essa abordagem funciona bem se o número total de escritas no grupo não exceder a capacidade de escrita de qualquer membro do grupo. Se isso acontecer e alguns membros tiverem um desempenho de escrita menor do que outros — especialmente os membros que escrevem —, esses membros podem começar a ficar para trás dos escritores.

Quando alguns membros ficam para trás do resto do grupo, as leituras desses membros podem externalizar dados muito antigos. Dependendo da razão pela qual o membro está atrasado, outros membros do grupo podem ter que salvar mais ou menos do contexto de replicação para poder atender a possíveis solicitações de transferência de dados do membro lento.

O protocolo de replicação fornece um mecanismo para evitar uma distância excessiva, em termos de transações aplicadas, entre membros rápidos e lentos. Isso é conhecido como mecanismo de controle de fluxo, que tem os seguintes objetivos:

1. Para manter os membros próximos, minimizar o buffer e a desincronização entre eles

2. Para se adaptar rapidamente a condições em mudança, como diferentes cargas de trabalho ou mais escritores no grupo

3. Para dar a cada membro uma parte da capacidade de escrita disponível

4. Não reduzir a capacidade de processamento mais do que o estritamente necessário para evitar o desperdício de recursos

Dada a configuração da Replicação em Grupo, a decisão de ativar ou não o controle de tráfego pode ser tomada considerando duas filas de trabalho: a fila de certificação e a fila de aplicação do log binário. Sempre que o tamanho de uma dessas filas exceder o limite definido pelo usuário, o mecanismo de controle de tráfego é acionado.

O controle de fluxo depende de dois mecanismos básicos:

1. Monitoramento dos membros para coletar estatísticas sobre o desempenho e o tamanho da fila de todos os membros do grupo para fazer suposições informadas sobre a pressão máxima de escrita a que cada membro deve ser submetido

2. Redução do tráfego de membros que tentam escrever além de suas quotas de capacidade disponível em cada momento
