### 16.4.2 Compatibilidade de Replication Entre Versões do MySQL

O MySQL suporta replication de uma série de lançamento para a próxima série de lançamento superior. Por exemplo, você pode replicar de um Source executando MySQL 5.6 para uma Replica executando MySQL 5.7, de um Source executando MySQL 5.7 para uma Replica executando MySQL 8.0, e assim por diante. No entanto, você pode encontrar dificuldades ao replicar de um Source mais antigo para uma Replica mais nova se o Source usar instruções ou depender de comportamento que não é mais suportado na versão do MySQL usada na Replica. Por exemplo, nomes de Foreign Key com mais de 64 caracteres não são mais suportados a partir do MySQL 8.0.

O uso de mais de duas versões do MySQL Server não é suportado em configurações de replication que envolvam múltiplos Sources, independentemente do número de servidores MySQL Source ou Replica. Essa restrição se aplica não apenas às séries de lançamento, mas também aos números de versão dentro da mesma série de lançamento. Por exemplo, se você estiver usando uma configuração de replication encadeada ou circular, você não pode usar MySQL 5.7.22, MySQL 5.7.23 e MySQL 5.7.24 concomitantemente, embora você possa usar quaisquer dois desses releases juntos.

Importante

É fortemente recomendado usar o release mais recente disponível dentro de uma determinada série de lançamento do MySQL, pois as capacidades de replication (e outras) estão sendo continuamente aprimoradas. Também é recomendado fazer o upgrade de Sources e Replicas que usam releases iniciais de uma série de lançamento do MySQL para releases GA (production) quando estes se tornarem disponíveis para essa série de lançamento.

Replication de Sources mais novos para Replicas mais antigas pode ser possível, mas geralmente não é suportada. Isso se deve a uma série de fatores:

* **Alterações no formato do Binary Log.** O formato do Binary Log pode mudar entre releases principais. Embora tentemos manter a compatibilidade retroativa, isso nem sempre é possível.

  Isso também tem implicações significativas para o upgrade de servidores de replication; consulte [Seção 16.4.3, “Upgrading de uma Replication Topology”](replication-upgrade.html "16.4.3 Upgrading de uma Replication Topology"), para mais informações.

* Para mais informações sobre row-based replication, consulte [Seção 16.2.1, “Replication Formats”](replication-formats.html "16.2.1 Replication Formats").

* **Incompatibilidades de SQL.** Você não pode replicar de um Source mais novo para uma Replica mais antiga usando statement-based replication se as instruções a serem replicadas usarem recursos SQL disponíveis no Source, mas não na Replica.

  No entanto, se tanto o Source quanto a Replica suportarem row-based replication, e não houver instruções de definição de dados a serem replicadas que dependam de recursos SQL encontrados no Source, mas não na Replica, você pode usar row-based replication para replicar os efeitos das instruções de modificação de dados, mesmo que o DDL executado no Source não seja suportado na Replica.

Para mais informações sobre potenciais problemas de replication, consulte [Seção 16.4.1, “Recursos e Problemas de Replication”](replication-features.html "16.4.1 Recursos e Problemas de Replication").