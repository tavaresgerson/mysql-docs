#### 20.7.2.2 Limitação de Replicação em Grupo

Com base nas métricas coletadas em todos os servidores do grupo, um mecanismo de limitação é ativado e decide se deve limitar a taxa na qual um membro pode executar/confirmar novas transações.

Portanto, as métricas adquiridas de todos os membros são a base para calcular a capacidade de cada membro: se um membro tem uma fila grande (para certificação ou o fio de aplicação), então a capacidade de executar novas transações deve estar próxima àquelas certificadas ou aplicadas no último período.

A menor capacidade de todos os membros do grupo determina a capacidade real do grupo, enquanto o número de transações locais determina quantos membros estão escrevendo para ele, e, consequentemente, quantos membros essa capacidade disponível deve ser compartilhada.

Isso significa que cada membro tem uma cotas de escrita estabelecidas com base na capacidade disponível, ou seja, um número de transações que ele pode emitir com segurança para o próximo período. A cotas de escritor são aplicadas pelo mecanismo de limitação se o tamanho da fila do certificador ou do aplicável do log binário exceder um limite definido pelo usuário.

A cota é reduzida pelo número de transações que foram atrasadas no último período, e então ainda mais reduzida em 10% para permitir que a fila que causou o problema reduza seu tamanho. Para evitar grandes saltos no desempenho assim que o tamanho da fila ultrapassar o limite, o desempenho só é permitido crescer em 10% por período após isso.

O mecanismo de limitação atual não penaliza transações abaixo da cota, mas atrasa o término dessas transações que a excedem até o final do período de monitoramento. Como consequência, se a cota for muito pequena para as solicitações de escrita, algumas transações podem ter latências próximas ao período de monitoramento.