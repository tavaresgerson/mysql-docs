#### 20.7.2.2 Limitação da replicação em grupo

Com base nas métricas coletadas em todos os servidores do grupo, um mecanismo de controle é ativado e decide se é necessário limitar a taxa na qual um membro pode executar/confirmar novas transações.

Portanto, as métricas adquiridas de todos os membros são a base para calcular a capacidade de cada membro: se um membro tiver uma fila grande (para certificação ou para o fio de solicitação), então a capacidade de executar novas transações deve estar próxima àquelas certificadas ou aplicadas no último período.

A capacidade mais baixa de todos os membros do grupo determina a capacidade real do grupo, enquanto o número de transações locais determina quantos membros estão escrevendo nele e, consequentemente, quantos membros essa capacidade disponível deve ser compartilhada.

Isso significa que cada membro tem uma quota de escrita estabelecida com base na capacidade disponível, ou seja, um número de transações que pode emitir com segurança no próximo período. A quota de escritor é aplicada pelo mecanismo de controle se o tamanho da fila do certificador ou do aplicativo de log binário exceder um limite definido pelo usuário.

A cotas são reduzidas com base no número de transações que foram atrasadas no último período, e depois reduzidas em mais 10% para permitir que a fila que causou o problema diminua de tamanho. Para evitar grandes saltos na taxa de processamento assim que o tamanho da fila ultrapassar o limite, a taxa de processamento só pode crescer em mais 10% por período após isso.

O mecanismo atual de controle não penaliza transações abaixo da cotas, mas retarda o término das transações que excedem essa quantidade até o final do período de monitoramento. Como consequência, se a quota for muito pequena para as solicitações de escrita, algumas transações podem ter latências próximas ao período de monitoramento.
