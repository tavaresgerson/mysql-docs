### 16.1.3 Replicação com Global Transaction Identifiers (GTIDs)

[16.1.3.1 Formato e Armazenamento de GTID](replication-gtids-concepts.html)

[16.1.3.2 Ciclo de Vida do GTID](replication-gtids-lifecycle.html)

[16.1.3.3 GTID Auto-Positioning](replication-gtids-auto-positioning.html)

[16.1.3.4 Configurando Replication Usando GTIDs](replication-gtids-howto.html)

[16.1.3.5 Usando GTIDs para Failover e Scaleout](replication-gtids-failover.html)

[16.1.3.6 Restrições na Replication com GTIDs](replication-gtids-restrictions.html)

[16.1.3.7 Exemplos de Stored Function para Manipular GTIDs](replication-gtids-functions.html)

Esta seção explica a Replication baseada em Transaction usando global transaction identifiers (GTIDs). Ao usar GTIDs, cada Transaction pode ser identificada e rastreada à medida que é committed no servidor de origem e aplicada por quaisquer Replicas; isso significa que, ao usar GTIDs, não é necessário consultar arquivos de log ou posições dentro desses arquivos ao iniciar uma nova Replica ou realizar um Failover para um novo Source, o que simplifica muito essas tarefas. Como a Replication baseada em GTID é completamente baseada em Transaction, é simples determinar se os Sources e Replicas estão consistentes; desde que todas as Transactions committed em um Source também sejam committed em uma Replica, a consistência entre os dois é garantida. Você pode usar Replication statement-based ou row-based com GTIDs (consulte [Section 16.2.1, “Replication Formats”](replication-formats.html "16.2.1 Replication Formats")); no entanto, para melhores resultados, recomendamos que você use o formato row-based.

GTIDs são sempre preservados entre Source e Replica. Isso significa que você pode sempre determinar o Source para qualquer Transaction aplicada em qualquer Replica examinando seu Binary Log. Além disso, uma vez que uma Transaction com um GTID específico é committed em um determinado servidor, qualquer Transaction subsequente que tenha o mesmo GTID é ignorada por esse servidor. Dessa forma, uma Transaction committed no Source pode ser aplicada no máximo uma vez na Replica, o que ajuda a garantir a consistência.

Esta seção aborda os seguintes tópicos:

* Como os GTIDs são definidos e criados, e como eles são representados em um servidor MySQL (consulte [Section 16.1.3.1, “Formato e Armazenamento de GTID”](replication-gtids-concepts.html "16.1.3.1 GTID Format and Storage")).

* O ciclo de vida de um GTID (consulte [Section 16.1.3.2, “Ciclo de Vida do GTID”](replication-gtids-lifecycle.html "16.1.3.2 GTID Life Cycle")).

* A função de Auto-Positioning para sincronizar uma Replica e um Source que usam GTIDs (consulte [Section 16.1.3.3, “GTID Auto-Positioning”](replication-gtids-auto-positioning.html "16.1.3.3 GTID Auto-Positioning")).

* Um procedimento geral para configurar e iniciar a Replication baseada em GTID (consulte [Section 16.1.3.4, “Configurando Replication Usando GTIDs”](replication-gtids-howto.html "16.1.3.4 Setting Up Replication Using GTIDs")).

* Métodos sugeridos para provisionar novos servidores de Replication ao usar GTIDs (consulte [Section 16.1.3.5, “Usando GTIDs para Failover e Scaleout”](replication-gtids-failover.html "16.1.3.5 Using GTIDs for Failover and Scaleout")).

* Restrições e limitações que você deve estar ciente ao usar a Replication baseada em GTID (consulte [Section 16.1.3.6, “Restrições na Replication com GTIDs”](replication-gtids-restrictions.html "16.1.3.6 Restrictions on Replication with GTIDs")).

* Stored functions que você pode usar para trabalhar com GTIDs (consulte [Section 16.1.3.7, “Exemplos de Stored Function para Manipular GTIDs”](replication-gtids-functions.html "16.1.3.7 Stored Function Examples to Manipulate GTIDs")).

Para obter informações sobre opções e variáveis do MySQL Server relacionadas à Replication baseada em GTID, consulte [Section 16.1.6.5, “Variáveis de Sistema do Global Transaction ID”](replication-options-gtids.html "16.1.6.5 Global Transaction ID System Variables"). Consulte também [Section 12.18, “Funções Usadas com Global Transaction Identifiers (GTIDs)”](gtid-functions.html "12.18 Functions Used with Global Transaction Identifiers (GTIDs)"), que descreve as funções SQL suportadas pelo MySQL 5.7 para uso com GTIDs.