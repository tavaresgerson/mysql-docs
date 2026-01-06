### 16.3.4 Usar a replicação para expansão em escala

Você pode usar a replicação como uma solução de expansão; ou seja, onde você deseja dividir a carga das consultas do banco de dados em vários servidores de banco de dados, dentro de algumas limitações razoáveis.

Como a replicação funciona a partir da distribuição de uma fonte para uma ou mais réplicas, usar a replicação para expansão é mais eficaz em um ambiente onde você tem um grande número de leituras e um pequeno número de escritas/atualizações. A maioria dos sites se encaixa nessa categoria, onde os usuários navegam pelo site, leem artigos, posts ou visualizam produtos. As atualizações ocorrem apenas durante a gestão de sessões ou ao fazer uma compra ou adicionar um comentário/mensagem a um fórum.

A replicação nessa situação permite que você distribua os leitores pelas réplicas, permitindo que seus servidores da web se comuniquem com a fonte quando for necessário um registro. Você pode ver um layout de replicação de amostra para esse cenário na Figura 16.1, “Usando replicação para melhorar o desempenho durante a escala para fora”.

**Figura 16.1: Uso da replicação para melhorar o desempenho durante a expansão**

![Solicitações recebidas dos clientes são direcionadas para um balanceador de carga, que distribui os dados dos clientes entre vários clientes web. As escritas feitas pelos clientes web são direcionadas para um único servidor de origem MySQL, e as leituras feitas pelos clientes web são direcionadas para um dos três servidores de réplica MySQL. A replicação ocorre do servidor de origem MySQL para os três servidores de réplica MySQL.](images/scaleout.png)

Se a parte do seu código responsável pelo acesso ao banco de dados tiver sido adequadamente abstraída/modularizada, a conversão para funcionar com uma configuração replicada deve ser muito suave e fácil. Altere a implementação do acesso ao banco de dados para enviar todas as escritas para a fonte e ler para a fonte ou uma réplica. Se o seu código não tiver esse nível de abstração, configurar um sistema replicado lhe dá a oportunidade e a motivação para limpá-lo. Comece criando uma biblioteca ou módulo wrapper que implemente as seguintes funções:

- `safe_writer_connect()`
- `safe_reader_connect()`
- `safe_reader_statement()`
- `safe_writer_statement()`

O prefixo `safe_` em cada nome de função significa que a função cuida de lidar com todas as condições de erro. Você pode usar nomes diferentes para as funções. O importante é ter uma interface unificada para conectar para leituras, conectar para escritas, fazer uma leitura e fazer uma escrita.

Em seguida, converta seu código cliente para usar a biblioteca de wrapper. Esse processo pode ser doloroso e assustador no início, mas compensa a longo prazo. Todas as aplicações que usam a abordagem descrita acima podem aproveitar uma configuração de fonte/replica, mesmo uma que envolva múltiplas réplicas. O código é muito mais fácil de manter, e adicionar opções de solução de problemas é trivial. Você precisa modificar apenas uma ou duas funções (por exemplo, para registrar quanto tempo cada declaração levou ou qual declaração entre as emitidas causou um erro).

Se você escreveu muito código, pode querer automatizar a tarefa de conversão usando a ferramenta **replace** que vem com as distribuições padrão do MySQL, ou escrever seu próprio script de conversão. Idealmente, seu código deve seguir convenções consistentes de estilo de programação. Se não, provavelmente é melhor reescrevê-lo ou, pelo menos, revisá-lo manualmente para regularizar o estilo e torná-lo consistente.
