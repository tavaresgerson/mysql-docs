### 19.4.5 Usando a Replicação para Expansão

Você pode usar a replicação como uma solução de expansão; ou seja, quando deseja distribuir a carga das consultas de banco de dados entre vários servidores de banco de dados, dentro de algumas limitações razoáveis.

Como a replicação funciona a partir da distribuição de uma fonte para uma ou mais réplicas, usar a replicação para expansão funciona melhor em um ambiente onde você tem um grande número de leituras e um pequeno número de escritas/atualizações. A maioria dos sites se encaixa nessa categoria, onde os usuários estão navegando no site, lendo artigos, posts ou vendo produtos. As atualizações ocorrem apenas durante a gestão de sessões ou ao fazer uma compra ou adicionar um comentário/mensagem a um fórum.

A replicação nessa situação permite que você distribua as leituras pelas réplicas, enquanto ainda permite que seus servidores web se comuniquem com a fonte quando uma escrita é necessária. Você pode ver um layout de replicação de amostra para esse cenário na Figura 19.1, “Usando a Replicação para Melhorar o Desempenho Durante a Expansão”.

**Figura 19.1 Usando a Replicação para Melhorar o Desempenho Durante a Expansão**

![Solicitações recebidas de clientes são direcionadas para um balanceador de carga, que distribui os dados do cliente entre vários clientes web. As escritas feitas pelos clientes web são direcionadas para um único servidor de fonte MySQL, e as leituras feitas pelos clientes web são direcionadas para um dos três servidores de réplica MySQL. A replicação ocorre do servidor de fonte MySQL para os três servidores de réplica MySQL.](images/scaleout.png)

Se a parte do seu código responsável pelo acesso ao banco de dados tiver sido adequadamente abstraída/modularizada, converter para funcionar com uma configuração replicada deve ser muito suave e fácil. Altere a implementação do seu acesso ao banco de dados para enviar todas as escritas para a fonte e ler para a fonte ou uma réplica. Se o seu código não tiver esse nível de abstração, configurar um sistema replicado lhe dá a oportunidade e a motivação para limpá-lo. Comece criando uma biblioteca ou módulo wrapper que implemente as seguintes funções:

* `safe_writer_connect()`
* `safe_reader_connect()`
* `safe_reader_statement()`
* `safe_writer_statement()`

`safe_` em cada nome da função significa que a função cuida de lidar com todas as condições de erro. Você pode usar nomes diferentes para as funções. O importante é ter uma interface unificada para conectar para leituras, conectar para escritas, fazer uma leitura e fazer uma escrita.

Em seguida, converta seu código cliente para usar a biblioteca wrapper. Esse pode ser um processo doloroso e assustador no início, mas compensa a longo prazo. Todas as aplicações que usam a abordagem descrita acima podem aproveitar uma configuração fonte/replica, mesmo uma que envolva múltiplas réplicas. O código é muito mais fácil de manter, e adicionar opções de solução de problemas é trivial. Você precisa modificar apenas uma ou duas funções (por exemplo, para registrar quanto tempo cada declaração levou ou qual declaração entre as emitidas deu um erro).

Se você escreveu muito código, pode querer automatizar a tarefa de conversão escrevendo um script de conversão. Idealmente, seu código usa convenções de estilo de programação consistentes. Se não, então você provavelmente está melhor escrevendo-o de qualquer maneira ou, pelo menos, revisando-o manualmente para regularizá-lo e usar um estilo consistente.