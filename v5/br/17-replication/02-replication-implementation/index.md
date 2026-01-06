## 16.2 Implementação da Replicação

16.2.1 Formatos de replicação

16.2.2 Canais de replicação

16.2.3 Threads de replicação

Repositórios de Log de Relé e Metadados de Replicação

16.2.5 Como os Servidores Avaliam as Regras de Filtragem de Replicação

A replicação baseia-se no servidor de origem da replicação que mantém um registro de todas as alterações em seus bancos de dados (atualizações, exclusões, etc.) em seu log binário. O log binário serve como um registro escrito de todos os eventos que modificam a estrutura ou o conteúdo (dados) do banco de dados a partir do momento em que o servidor foi iniciado. Normalmente, as instruções `SELECT` não são registradas porque elas não modificam a estrutura ou o conteúdo do banco de dados.

Cada réplica que se conecta à fonte solicita uma cópia do log binário. Ou seja, ela extrai os dados da fonte, em vez de a fonte enviar os dados para a réplica. A réplica também executa os eventos do log binário que recebe. Isso tem o efeito de repetir as alterações originais exatamente como foram feitas na fonte. As tabelas são criadas ou sua estrutura é modificada, e os dados são inseridos, excluídos e atualizados de acordo com as alterações que foram feitas originalmente na fonte.

Como cada réplica é independente, a reprodução das alterações do log binário da fonte ocorre de forma independente em cada réplica conectada à fonte. Além disso, como cada réplica recebe uma cópia do log binário apenas solicitando-a à fonte, a réplica pode ler e atualizar a cópia do banco de dados no seu próprio ritmo e pode iniciar e parar o processo de replicação conforme desejar, sem afetar a capacidade de atualizar para o estado mais recente do banco de dados, seja no lado da fonte ou da réplica.

Para mais informações sobre os detalhes da implementação da replicação, consulte Seção 16.2.3, “Threads de replicação”.

As fontes e réplicas relatam seu status em relação ao processo de replicação regularmente, para que você possa monitorá-las. Consulte Seção 8.14, “Examinando Informações de Fuso de Servidor (Processo”) para descrições de todos os estados relacionados à replicação.

O log binário da fonte é escrito em um log de retransmissão local na réplica antes de ser processado. A réplica também registra informações sobre a posição atual com o log binário da fonte e o log de retransmissão da réplica. Veja Seção 16.2.4, “Repositórios de Log de Retransmissão e Metadados de Replicação”.

As alterações no banco de dados são filtradas na replica de acordo com um conjunto de regras que são aplicadas de acordo com as várias opções de configuração e variáveis que controlam a avaliação de eventos. Para obter detalhes sobre como essas regras são aplicadas, consulte Seção 16.2.5, “Como os Servidores Avaliam as Regras de Filtragem de Replicação”.
