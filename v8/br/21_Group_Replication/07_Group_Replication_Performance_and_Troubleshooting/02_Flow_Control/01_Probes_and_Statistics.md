#### 20.7.2.1 Sondas e Estatísticas

O mecanismo de monitoramento funciona com cada membro enviando um conjunto de sondas para coletar informações sobre suas filas de trabalho e desempenho. Em seguida, ele propaga essas informações periodicamente para o grupo para compartilhar esses dados com os outros membros.

Essas sondagens estão espalhadas por toda a pilha de plugins e permitem estabelecer métricas, como:

- o tamanho da fila de certificadores;

- tamanho da fila de aplicador de replicação;

- o número total de transações certificadas;

- o número total de transações remotas aplicadas no membro;

- o número total de transações locais.

Quando um membro recebe uma mensagem com estatísticas de outro membro, ele calcula métricas adicionais sobre quantas transações foram certificadas, aplicadas e executadas localmente no último período de monitoramento.

Os dados de monitoramento são compartilhados com outros membros do grupo periodicamente. O período de monitoramento deve ser suficientemente longo para permitir que os outros membros decidam sobre as solicitações de escrita atuais, mas suficientemente curto para que tenha um impacto mínimo na largura de banda do grupo. As informações são compartilhadas a cada segundo, e esse período é suficiente para atender a ambas as preocupações.
