### 20.7.2 Controle de Fluxo

20.7.2.1 Sondas e Estatísticas

20.7.2.2 Limitação de Replicação de Grupo

A Replicação de Grupo do MySQL garante que uma transação seja confirmada apenas após a maioria dos membros de um grupo a ter recebido e concordado com a ordem relativa entre todas as transações enviadas simultaneamente. Essa abordagem funciona bem se o número total de escritas no grupo não exceder a capacidade de escrita de qualquer membro do grupo. Se isso ocorrer e alguns membros tiverem um throughput de escrita menor do que outros—particularmente membros escritores—esses membros podem começar a ficar para trás dos escritores.

Quando alguns membros ficam para trás do resto do grupo, as leituras em tais membros podem expor dados muito antigos. Dependendo do motivo pelo qual o membro está ficando para trás, outros membros do grupo podem ter que salvar mais ou menos do contexto de replicação para poder atender a solicitações de transferência de dados potenciais do membro lento.

O protocolo de replicação fornece um mecanismo para evitar uma distância excessiva, em termos de transações aplicadas, entre membros rápidos e lentos. Isso é conhecido como o mecanismo de controle de fluxo, que tem os seguintes objetivos:

1. Manter os membros próximos, para minimizar o bufferamento e a des sincronização entre eles

2. Adaptar-se rapidamente a condições em mudança, como diferentes cargas de trabalho ou mais escritores no grupo

3. Dar a cada membro uma parcela da capacidade de escrita disponível

4. Não reduzir o throughput mais do que estritamente necessário para evitar desperdício de recursos

Dada a concepção da Replicação de Grupo, a decisão de limitar ou não a replicação pode ser tomada levando em consideração duas filas de trabalho, a fila de certificação e a fila de aplicador de log binário. Sempre que o tamanho de uma dessas filas exceder o limiar definido pelo usuário, o mecanismo de limitação é acionado.

O controle de fluxo depende de dois mecanismos básicos:

1. Monitoramento dos membros para coletar estatísticas sobre o desempenho e o tamanho da fila de todos os membros do grupo para fazer suposições informadas sobre a pressão máxima de escrita à qual cada membro deve ser submetido

2. Limitação de membros que estão tentando escrever além de suas quotas de compartilhamento da capacidade disponível em cada momento

Nota

O componente de estatísticas de controle de fluxo de replicação de grupo, disponível como parte da Edição Empresarial do MySQL, suporta variáveis de status que fornecem informações sobre a execução do controle de fluxo de replicação de grupo. Consulte a Seção 7.5.6.2, “Compósito de Estatísticas de Controle de Fluxo de Replicação de Grupo”, para obter mais informações.