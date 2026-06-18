### 19.1.3 Replicação com Identificadores de Transação Global

19.1.3.1 Formato e Armazenamento do GTID

19.1.3.2 Ciclo de vida do GTID

19.1.3.3 GTID Auto-posicionamento

19.1.3.4 Configurando a replicação usando GTIDs

19.1.3.5 Uso de GTIDs para Failover e Scaleout

19.1.3.6 Replicação de uma Fonte Sem GTIDs para uma Replicação com GTIDs

19.1.3.7 Restrições à replicação com GTIDs

19.1.3.8 Exemplos de funções armazenadas para manipular GTIDs

Esta seção explica a replicação baseada em transações usando identificadores de transação global (GTIDs). Ao usar GTIDs, cada transação pode ser identificada e rastreada quando é comprometida no servidor de origem e aplicada por quaisquer réplicas; isso significa que não é necessário, ao usar GTIDs, referenciar arquivos de log ou posições dentro desses arquivos ao iniciar uma nova replica ou ao fazer uma transição para uma nova fonte, o que simplifica muito essas tarefas. Como a replicação baseada em GTIDs é completamente baseada em transações, é simples determinar se as fontes e réplicas estão consistentes; desde que todas as transações comprometidas em uma fonte também estejam comprometidas em uma replica, a consistência entre as duas é garantida. Você pode usar a replicação baseada em declarações ou baseada em linhas com GTIDs (veja a Seção 19.2.1, “Formatos de Replicação”); no entanto, para obter os melhores resultados, recomendamos que você use o formato baseado em linhas.

Os GTIDs são sempre preservados entre a fonte e a réplica. Isso significa que você sempre pode determinar a fonte de qualquer transação aplicada em qualquer réplica ao examinar seu log binário. Além disso, uma vez que uma transação com um GTID específico seja confirmada em um servidor específico, qualquer transação subsequente com o mesmo GTID será ignorada por esse servidor. Assim, uma transação confirmada na fonte pode ser aplicada no máximo uma vez na réplica, o que ajuda a garantir a consistência.

Esta seção discute os seguintes tópicos:

- Como os GTIDs são definidos e criados, e como são representados em um servidor MySQL (veja a Seção 19.1.3.1, “Formato e Armazenamento de GTID”).

- O ciclo de vida de um GTID (ver Seção 19.1.3.2, “Ciclo de vida do GTID”).

- A função de autoposicionamento para sincronizar uma réplica e uma fonte que utilizam GTIDs (consulte a Seção 19.1.3.3, “Autoposicionamento de GTID”).

- Um procedimento geral para configurar e iniciar a replicação baseada em GTIDs (consulte a Seção 19.1.3.4, “Configurando a Replicação Usando GTIDs”).

- Métodos sugeridos para provisionamento de novos servidores de replicação ao usar GTIDs (consulte a Seção 19.1.3.5, “Uso de GTIDs para Failover e Scaleout”).

- Restrições e limitações que você deve estar ciente ao usar a replicação baseada em GTID (consulte a Seção 19.1.3.7, “Restrições na replicação com GTIDs”).

- Funções armazenadas que você pode usar para trabalhar com GTIDs (veja a Seção 19.1.3.8, “Exemplos de Função Armazenada para Manipular GTIDs”).

Para obter informações sobre as opções e variáveis do MySQL Server relacionadas à replicação baseada em GTID, consulte a Seção 19.1.6.5, “Variáveis do Sistema de ID de Transação Global”. Veja também a Seção 14.18.2, “Funções Usadas com Identificadores de Transação Global (GTIDs)”), que descreve as funções SQL suportadas pelo MySQL 8.0 para uso com GTIDs.
