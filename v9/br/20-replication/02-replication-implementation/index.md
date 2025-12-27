## 19.2 Implementação da Replicação

19.2.1 Formas de Replicação

19.2.2 Canais de Replicação

19.2.3 Threads de Replicação

19.2.4 Repositórios de Log de Relay e Metadados de Replicação

19.2.5 Como os Servidores Avaliam as Regras de Filtragem de Replicação

A replicação é baseada no fato de o servidor de origem manter um registro de todas as alterações em suas bases de dados (atualizações, exclusões, etc.) em seu log binário. O log binário serve como um registro escrito de todos os eventos que modificam a estrutura ou o conteúdo (dados) da base de dados desde o momento em que o servidor foi iniciado. Tipicamente, as instruções `SELECT` não são registradas porque elas não modificam a estrutura ou o conteúdo da base de dados.

Cada replica que se conecta à origem solicita uma cópia do log binário. Ou seja, ela extrai os dados da origem, em vez de a origem empurrar os dados para a replica. A replica também executa os eventos do log binário que ela recebe. Isso tem o efeito de repetir as alterações originais exatamente como foram feitas na origem. Tabelas são criadas ou sua estrutura é modificada, e dados são inseridos, excluídos e atualizados de acordo com as alterações que foram originalmente feitas na origem.

Como cada replica é independente, a repetição das alterações do log binário da origem ocorre de forma independente em cada replica conectada à origem. Além disso, como cada replica recebe uma cópia do log binário apenas solicitando-a da origem, a replica é capaz de ler e atualizar a cópia da base de dados no seu próprio ritmo e pode iniciar e parar o processo de replicação à vontade sem afetar a capacidade de atualização para o status mais recente da base de dados, seja no lado da origem ou da replica.

Para mais informações sobre os detalhes da implementação da replicação, consulte a Seção 19.2.3, “Threads de Replicação”.

Os servidores de origem e as réplicas relatam regularmente seu status em relação ao processo de replicação para que você possa monitorá-los. Consulte a Seção 10.14, “Examinando Informações de Fuso (Processo) do Servidor” (Informações”), para descrições de todos os estados relacionados à replicação.

O log binário da fonte é escrito em um log de retransmissão local na réplica antes de ser processado. A réplica também registra informações sobre a posição atual com o log binário da fonte e o log de retransmissão local. Consulte a Seção 19.2.4, “Repositórios de Log de Retransmissão e Metadados de Replicação”.

As alterações no banco de dados são filtradas na réplica de acordo com um conjunto de regras que são aplicadas de acordo com as várias opções de configuração e variáveis que controlam a avaliação de eventos. Para obter detalhes sobre como essas regras são aplicadas, consulte a Seção 19.2.5, “Como os Servidores Avaliam as Regras de Filtragem de Replicação”.