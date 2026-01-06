### 17.9.1 Arquitetura do Plugin de Replicação em Grupo

O MySQL Group Replication é um plugin do MySQL e se baseia na infraestrutura de replicação existente do MySQL, aproveitando recursos como o log binário, o registro baseado em linhas e identificadores de transações globais. Ele se integra a frameworks MySQL atuais, como o esquema de desempenho ou infraestruturas de plugins e serviços. A figura a seguir apresenta um diagrama de blocos que ilustra a arquitetura geral do MySQL Group Replication.

**Figura 17.9 Diagrama de Bloco do Plugin de Replicação de Grupo**

![O texto após a figura descreve o conteúdo do diagrama.](images/gr-plugin-blocks.png)

O plugin de replicação em grupo do MySQL inclui um conjunto de APIs para captura, aplicação e ciclo de vida, que controlam como o plugin interage com o MySQL Server. Existem interfaces para fazer o fluxo de informações do servidor para o plugin e vice-versa. Essas interfaces isolam o núcleo do MySQL Server do plugin de replicação em grupo e são, na maioria das vezes, pontos de conexão colocados na pipeline de execução de transações. Em uma direção, do servidor para o plugin, há notificações para eventos como o servidor iniciando, o servidor recuperando, o servidor estando pronto para aceitar conexões e o servidor prestes a comprometer uma transação. Na outra direção, o plugin instrui o servidor a realizar ações como comprometer ou abortar transações em andamento ou agrupar transações no log de retransmissão.

A próxima camada da arquitetura do plugin de replicação em grupo é um conjunto de componentes que reagem quando uma notificação é encaminhada para eles. O componente de captura é responsável por manter o controle do contexto relacionado às transações em execução. O componente aplicável é responsável por executar transações remotas no banco de dados. O componente de recuperação gerencia a recuperação distribuída e é responsável por atualizar um servidor que está se juntando ao grupo, selecionando o doador, orquestrando o procedimento de recuperação e reagindo a falhas do doador.

Continuando na pilha, o módulo do protocolo de replicação contém a lógica específica do protocolo de replicação. Ele lida com a detecção de conflitos e recebe e propaga transações para o grupo.

As duas últimas camadas da arquitetura do plugin de replicação em grupo são o Sistema de Comunicação em Grupo (GCS) API e uma implementação de um motor de comunicação em grupo baseado em Paxos (XCom). A API GCS é uma API de alto nível que abstrai as propriedades necessárias para construir uma máquina de estado replicada (consulte Seção 17.1, “Contexto da Replicação em Grupo”). Portanto, ela desacopla a implementação da camada de mensagens das camadas superiores restantes do plugin. O motor de comunicação em grupo lida com as comunicações com os membros do grupo de replicação.
