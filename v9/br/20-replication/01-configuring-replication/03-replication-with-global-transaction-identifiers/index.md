### 19.1.3 Replicação com Identificadores Globais de Transação

19.1.3.1 Formato e Armazenamento do GTID

19.1.3.2 Ciclo de Vida do GTID

19.1.3.3 Autoposicionamento do GTID

19.1.3.4 Configuração da Replicação Usando GTIDs

19.1.3.5 Uso dos GTIDs para Failover e Scaleout

19.1.3.6 Replicação de uma Fonte Sem GTIDs para uma Replicação com GTIDs

19.1.3.7 Restrições na Replicação com GTIDs

19.1.3.8 Exemplos de Funções Armazenadas para Manipular GTIDs

Esta seção explica a replicação baseada em transações usando identificadores globais de transação (GTIDs). Ao usar GTIDs, cada transação pode ser identificada e rastreada à medida que é comprometida no servidor de origem e aplicada por quaisquer réplicas; isso significa que não é necessário, ao usar GTIDs, referir-se a arquivos de log ou posições dentro desses arquivos ao iniciar uma nova replicação ou realizar um failover para uma nova fonte, o que simplifica muito essas tarefas. Como a replicação baseada em GTIDs é completamente baseada em transações, é simples determinar se as fontes e réplicas são consistentes; desde que todas as transações comprometidas em uma fonte também sejam comprometidas em uma replica, a consistência entre as duas é garantida. Você pode usar a replicação baseada em declarações ou baseada em linhas com GTIDs (veja a Seção 19.2.1, “Formatos de Replicação”); no entanto, para melhores resultados, recomendamos que você use o formato baseado em linhas.

Os GTIDs são sempre preservados entre a fonte e a replica. Isso significa que você sempre pode determinar a fonte de qualquer transação aplicada em qualquer replica ao examinar seu log binário. Além disso, uma vez que uma transação com um GTID específico é comprometida em um servidor específico, qualquer transação subsequente com o mesmo GTID é ignorada por esse servidor. Assim, uma transação comprometida na fonte pode ser aplicada no máximo uma vez na replica, o que ajuda a garantir a consistência.

Esta seção discute os seguintes tópicos:

* Como os GTIDs são definidos e criados, e como são representados em um servidor MySQL (veja a Seção 19.1.3.1, “Formato e Armazenamento do GTID”).

* O ciclo de vida de um GTID (veja a Seção 19.1.3.2, “Ciclo de Vida do GTID”).

* A função de autoposicionamento para sincronizar uma replica e uma fonte que usam GTIDs (veja a Seção 19.1.3.3, “Autoposicionamento do GTID”).

* Um procedimento geral para configurar e iniciar a replicação baseada em GTIDs (veja a Seção 19.1.3.4, “Configuração da Replicação Usando GTIDs”).

* Métodos sugeridos para provisionar novos servidores de replicação ao usar GTIDs (veja a Seção 19.1.3.5, “Uso de GTIDs para Failover e Scaleout”).

* Restrições e limitações que você deve estar ciente ao usar a replicação baseada em GTIDs (veja a Seção 19.1.3.7, “Restrições na Replicação com GTIDs”).

* Funções armazenadas que você pode usar para trabalhar com GTIDs (veja a Seção 19.1.3.8, “Exemplos de Funções Armazenadas para Manipular GTIDs”).

Para informações sobre as opções e variáveis do MySQL Server relacionadas à replicação baseada em GTIDs, consulte a Seção 19.1.6.5, “Variáveis do Sistema de Identificador de Transação Global”. Veja também a Seção 14.18.2, “Funções Usadas com Identificadores de Transação Global (GTIDs”)”), que descreve as funções SQL suportadas pelo MySQL 9.5 para uso com GTIDs.