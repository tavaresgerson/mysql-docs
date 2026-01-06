#### 17.9.5.1 Princípios básicos de recuperação distribuída

Sempre que um membro se junta a um grupo de replicação, ele se conecta a um membro existente para realizar a transferência de estado. O servidor que se junta ao grupo transfere todas as transações que ocorreram no grupo antes de sua inclusão, que são fornecidas pelo membro existente (chamado de *doador*). Em seguida, o servidor que se junta ao grupo aplica as transações que ocorreram no grupo enquanto essa transferência de estado estava em andamento. Quando o servidor que se junta ao grupo alcança os servidores restantes no grupo, ele começa a participar normalmente no grupo. Esse processo é chamado de recuperação distribuída.

##### Fase 1

Na primeira fase, o servidor que se junta ao grupo seleciona um dos servidores online do grupo para ser o *doador* do estado que está faltando. O doador é responsável por fornecer ao servidor que se junta ao grupo todos os dados que está faltando até o momento em que se juntou ao grupo. Isso é feito confiando em um canal de replicação assíncrona padrão, estabelecido entre o doador e o servidor que se junta ao grupo, veja Seção 16.2.2, “Canais de Replicação”. Por meio desse canal de replicação, os logs binários do doador são replicados até o ponto em que a mudança de visão ocorreu quando o servidor que se junta ao grupo se tornou parte do grupo. O servidor que se junta ao grupo aplica os logs binários do doador à medida que os recebe.

Enquanto o log binário está sendo replicado, o servidor que está se juntando ao grupo também armazena em cache cada transação que é trocada dentro do grupo. Em outras palavras, ele está ouvindo transações que estão acontecendo depois que ele se juntou ao grupo e enquanto ele está aplicando o estado faltante do doador. Quando a primeira fase termina e o canal de replicação para o doador é fechado, o servidor que está se juntando ao grupo então começa a segunda fase: o término da diferença.

##### Fase 2

Nesta fase, o servidor que se junta ao grupo prossegue com a execução das transações armazenadas na cache. Quando o número de transações em fila para execução finalmente chega a zero, o membro é declarado online.

##### Resiliência

O procedimento de recuperação suporta falhas no doador enquanto o servidor que está se juntando ao grupo está obtendo logs binários dele. Nesse caso, sempre que um doador falha durante a fase 1, o servidor que está se juntando ao grupo passa a ser o novo doador e retoma a partir dele. Quando isso acontece, o servidor que está se juntando ao grupo fecha explicitamente a conexão com o servidor que está falhando e abre uma conexão com um novo doador. Isso acontece automaticamente.
