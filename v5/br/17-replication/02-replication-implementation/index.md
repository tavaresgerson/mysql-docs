## 16.2 Implementação da Replicação

[16.2.1 Formatos de Replicação](replication-formats.html)

[16.2.2 Canais de Replicação](replication-channels.html)

[16.2.3 Threads de Replicação](replication-threads.html)

[16.2.4 Relay Log e Repositórios de Metadados de Replicação](replica-logs.html)

[16.2.5 Como Servidores Avaliam Regras de Filtragem de Replicação](replication-rules.html)

A Replicação é baseada no servidor *source* (fonte) de replicação mantendo o controle de todas as alterações em seus Databases (updates, deletes, e assim por diante) em seu binary log. O binary log serve como um registro escrito de todos os eventos que modificam a estrutura ou o conteúdo (dados) do Database a partir do momento em que o servidor foi iniciado. Tipicamente, instruções [`SELECT`](select.html "13.2.9 SELECT Statement") não são registradas porque não modificam nem a estrutura nem o conteúdo do Database.

Cada *replica* (réplica) que se conecta à *source* solicita uma cópia do binary log. Ou seja, ela *puxa* (pulls) os dados da *source*, em vez de a *source* *empurrar* (pushing) os dados para a *replica*. A *replica* também executa os eventos do binary log que recebe. Isso tem o efeito de repetir as alterações originais exatamente como foram feitas na *source*. Tabelas são criadas ou suas estruturas são modificadas, e dados são inseridos, excluídos e atualizados de acordo com as alterações que foram originalmente feitas na *source*.

Como cada *replica* é independente, a repetição das alterações do binary log da *source* ocorre de forma independente em cada *replica* que está conectada à *source*. Além disso, como cada *replica* recebe uma cópia do binary log somente solicitando-o à *source*, a *replica* é capaz de ler e atualizar a cópia do Database em seu próprio ritmo e pode iniciar e parar o processo de replicação à vontade sem afetar a capacidade de atualização para o status mais recente do Database, seja no lado da *source* ou da *replica*.

Para mais informações sobre os detalhes da implementação da replicação, consulte [Seção 16.2.3, “Threads de Replicação”](replication-threads.html "16.2.3 Replication Threads").

*Sources* e *replicas* reportam regularmente seus status em relação ao processo de replicação para que você possa monitorá-los. Consulte [Seção 8.14, “Examinando Informações de Thread (Processo) do Servidor”](thread-information.html "8.14 Examining Server Thread (Process Information)"), para descrições de todos os *states* relacionados à replicação.

O binary log da *source* é escrito em um *relay log* local na *replica* antes de ser processado. A *replica* também registra informações sobre a posição atual no binary log da *source* e no *relay log* da *replica*. Consulte [Seção 16.2.4, “Relay Log e Repositórios de Metadados de Replicação”](replica-logs.html "16.2.4 Relay Log and Replication Metadata Repositories").

As alterações no Database são filtradas na *replica* de acordo com um conjunto de regras que são aplicadas conforme as várias opções de configuração e variáveis que controlam a avaliação de eventos. Para detalhes sobre como essas regras são aplicadas, consulte [Seção 16.2.5, “Como Servidores Avaliam Regras de Filtragem de Replicação”](replication-rules.html "16.2.5 How Servers Evaluate Replication Filtering Rules").