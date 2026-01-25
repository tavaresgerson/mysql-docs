### 16.3.4 Usando Replication para Scale-Out

Você pode usar a Replication como uma solução de *scale-out*; ou seja, onde você deseja dividir a carga de *database queries* entre múltiplos *database servers*, dentro de algumas limitações razoáveis.

Como a Replication funciona através da distribuição de uma *source* para uma ou mais *replicas*, o uso da Replication para *scale-out* funciona melhor em um ambiente onde você tem um alto número de leituras (*reads*) e um baixo número de gravações/atualizações (*writes/updates*). A maioria dos *websites* se enquadra nesta categoria, onde os usuários estão navegando, lendo artigos, posts ou visualizando produtos. As atualizações ocorrem apenas durante o gerenciamento de *session*, ou ao fazer uma compra ou adicionar um comentário/mensagem a um *forum*.

A Replication, nesta situação, permite que você distribua as leituras (*reads*) pelas *replicas*, ao mesmo tempo em que permite que seus *web servers* se comuniquem com a *source* quando uma gravação (*write*) for necessária. Você pode ver um exemplo de layout de *replication* para este cenário na [Figura 16.1, “Usando Replication para Melhorar o Desempenho Durante Scale-Out”](replication-solutions-scaleout.html#figure_replication-scaleout "Figura 16.1 Usando Replication para Melhorar o Desempenho Durante Scale-Out").

**Figura 16.1 Usando Replication para Melhorar o Desempenho Durante Scale-Out**

![Requisições de clientes recebidas são direcionadas a um load balancer, que distribui dados de clientes entre vários clientes web. Gravações (Writes) feitas por clientes web são direcionadas a um único servidor MySQL source, e leituras (reads) feitas por clientes web são direcionadas a um dos três servidores MySQL replica. A replication ocorre do servidor MySQL source para os três servidores MySQL replica.](images/scaleout.png)

Se a parte do seu código responsável pelo acesso ao *database* tiver sido adequadamente abstraída/modularizada, a conversão para ser executada em uma configuração de *replication* deve ser muito tranquila e fácil. Altere a implementação do seu acesso ao *database* para enviar todas as gravações (*writes*) para a *source* e para enviar leituras (*reads*) para a *source* ou para uma *replica*. Se o seu código não tiver esse nível de abstração, configurar um sistema de *replication* oferece a oportunidade e a motivação para organizá-lo. Comece criando uma biblioteca *wrapper* ou um módulo que implemente as seguintes funções:

* `safe_writer_connect()`
* `safe_reader_connect()`
* `safe_reader_statement()`
* `safe_writer_statement()`

O prefixo `safe_` em cada nome de função significa que a função se encarrega de lidar com todas as condições de erro. Você pode usar nomes diferentes para as funções. O importante é ter uma interface unificada para conectar-se para leituras (*reads*), conectar-se para gravações (*writes*), realizar uma leitura e realizar uma gravação.

Em seguida, converta seu código *client* para usar a biblioteca *wrapper*. Isso pode ser um processo doloroso e assustador no início, mas compensa a longo prazo. Todos os aplicativos que usam a abordagem descrita são capazes de tirar proveito de uma configuração *source/replica*, mesmo uma que envolva múltiplas *replicas*. O código é muito mais fácil de manter, e adicionar opções de *troubleshooting* é trivial. Você precisará modificar apenas uma ou duas funções (por exemplo, para registrar quanto tempo cada *statement* levou ou qual *statement* entre os emitidos gerou um erro).

Se você escreveu muito código, talvez queira automatizar a tarefa de conversão usando o utilitário [**replace**](replace-utility.html "4.8.3 replace — Um Utilitário de Substituição de String") que acompanha as distribuições padrão do MySQL, ou escrever seu próprio *script* de conversão. Idealmente, seu código usa convenções de estilo de programação consistentes. Caso contrário, provavelmente será melhor reescrevê-lo de qualquer maneira, ou pelo menos revisá-lo e regularizá-lo manualmente para usar um estilo consistente.