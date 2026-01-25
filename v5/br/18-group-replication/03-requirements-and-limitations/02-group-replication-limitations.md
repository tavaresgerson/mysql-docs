### 17.3.2 Limitações do Group Replication

Existem as seguintes limitações conhecidas para o Group Replication. Note que as limitações e problemas descritos para grupos no modo multi-primary também podem se aplicar a clusters no modo single-primary durante um evento de failover, enquanto o novo primary eleito esvazia sua applier queue (fila de aplicador) do primary antigo.

Dica

O Group Replication é construído sobre replicação baseada em GTID; portanto, você também deve estar ciente da [Seção 16.1.3.6, “Restrictions on Replication with GTIDs”](replication-gtids-restrictions.html "16.1.3.6 Restrictions on Replication with GTIDs").

* **Gap Locks.** O processo de certificação do Group Replication para transações concorrentes não leva em consideração os [gap locks], pois as informações sobre gap locks não estão disponíveis fora do [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine"). Veja [Gap Locks](innodb-locking.html#innodb-gap-locks "Gap Locks") para mais informações.

  Note

  Para um grupo no modo multi-primary, a menos que você dependa da semântica `REPEATABLE READ` em suas aplicações, recomendamos usar o nível de isolamento `READ COMMITTED` com o Group Replication. O InnoDB não usa gap locks em `READ COMMITTED`, o que alinha a detecção de conflitos local dentro do InnoDB com a detecção de conflitos distribuída realizada pelo Group Replication. Para um grupo no modo single-primary, apenas o primary aceita escritas, então o nível de isolamento `READ COMMITTED` não é importante para o Group Replication.

* **Table Locks and Named Locks.** O processo de certificação não leva em consideração os table locks (veja [Seção 13.3.5, “LOCK TABLES and UNLOCK TABLES Statements”](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements")) ou named locks (veja [`GET_LOCK()`](locking-functions.html#function_get-lock)).

* **Replication Event Checksums.** Devido a uma limitação de design dos checksums de eventos de replicação, o Group Replication atualmente não pode utilizá-los. Portanto, defina [`--binlog-checksum=NONE`](replication-options-binary-log.html#sysvar_binlog_checksum).

* **SERIALIZABLE Isolation Level.** O nível de isolamento `SERIALIZABLE` não é suportado por padrão em grupos multi-primary. Definir o nível de isolamento de uma transação como `SERIALIZABLE` configura o Group Replication para recusar o COMMIT da transação.

* **Concurrent DDL versus DML Operations.** Operações concorrentes de data definition statements (DDL) versus data manipulation statements (DML) executadas contra o mesmo objeto, mas em servidores diferentes, não são suportadas ao usar o modo multi-primary. Durante a execução de DDL em um objeto, a execução de DML concorrente no mesmo objeto, mas em uma instância de servidor diferente, apresenta o risco de DDLs conflitantes executadas em instâncias diferentes não serem detectadas.

* **Foreign Keys with Cascading Constraints.** Grupos no modo multi-primary (membros todos configurados com [`group_replication_single_primary_mode=OFF`](group-replication-system-variables.html#sysvar_group_replication_single_primary_mode)) não suportam tabelas com dependências de foreign key de múltiplos níveis, especificamente tabelas que definiram [foreign key constraints] `CASCADING`. Isso ocorre porque foreign key constraints que resultam em operações em cascata executadas por um grupo no modo multi-primary podem levar a conflitos não detectados e resultar em dados inconsistentes entre os membros do grupo. Portanto, recomendamos definir [`group_replication_enforce_update_everywhere_checks=ON`](group-replication-system-variables.html#sysvar_group_replication_enforce_update_everywhere_checks) em instâncias de servidor usadas em grupos no modo multi-primary para evitar conflitos não detectados.

  No modo single-primary, isso não é um problema, pois ele não permite escritas concorrentes em vários membros do grupo e, portanto, não há risco de conflitos não detectados.

* **MySQL Enterprise Audit and MySQL Enterprise Firewall.** Anteriormente à versão 5.7.21, o MySQL Enterprise Audit e o MySQL Enterprise Firewall usavam tabelas `MyISAM` no database de sistema `mysql`. O Group Replication não suporta tabelas `MyISAM`.

* **Multi-primary Mode Deadlock.** Quando um grupo está operando no modo multi-primary, as instruções `SELECT .. FOR UPDATE` podem resultar em um Deadlock. Isso ocorre porque o Lock não é compartilhado entre os membros do grupo; portanto, a expectativa para tal instrução pode não ser alcançada.

* **Replication Filters.** Replication filters não podem ser usados em uma instância de servidor MySQL configurada para Group Replication, porque filtrar transações em alguns servidores tornaria o grupo incapaz de chegar a um acordo sobre um estado consistente.

#### Limite de Tamanho do Grupo

O número máximo de servidores MySQL que podem ser membros de um único grupo de replicação é 9. Se membros adicionais tentarem JOIN ao grupo, a solicitação será recusada. Esse limite foi identificado por testes e benchmarking como um limite seguro onde o grupo funciona de forma confiável em uma rede local (LAN) estável.

#### Limites no Tamanho da Transação

Se uma transação individual resultar em um conteúdo de mensagem grande o suficiente para que a mensagem não possa ser copiada entre os membros do grupo pela rede em uma janela de 5 segundos, os membros podem ser suspeitos de falha e, em seguida, expulsos, apenas por estarem ocupados processando a transação. Transações grandes também podem fazer com que o sistema desacelere devido a problemas com a alocação de memória. Para evitar esses problemas, use as seguintes mitigações:

* Sempre que possível, tente limitar o tamanho de suas transações. Por exemplo, divida os arquivos usados com `LOAD DATA` em partes menores.

* Use a variável de sistema [`group_replication_transaction_size_limit`](group-replication-system-variables.html#sysvar_group_replication_transaction_size_limit) para especificar o tamanho máximo de transação que o grupo aceita. Nas versões até e incluindo o MySQL 5.7.37, esta variável de sistema assume o valor zero por padrão, mas a partir do MySQL 5.7.38, e no MySQL 8.0, o padrão é um tamanho máximo de transação de 150000000 bytes (aproximadamente 143 MB). Transações acima deste limite sofrem ROLLBACK e não são enviadas ao Group Communication System (GCS) do Group Replication para distribuição ao grupo. Ajuste o valor desta variável dependendo do tamanho máximo de mensagem que você precisa que o grupo tolere, lembrando que o tempo necessário para processar uma transação é proporcional ao seu tamanho.

  Note

  Ao fazer o upgrade do MySQL 5.7.37 ou anterior para o MySQL 5.7.38 ou posterior, se seus servidores Group Replication anteriormente aceitavam transações maiores do que o novo limite padrão, e você estava permitindo que [`group_replication_transaction_size_limit`](group-replication-system-variables.html#sysvar_group_replication_transaction_size_limit) usasse o antigo limite padrão zero, essas transações começarão a falhar após o upgrade para o novo padrão. Você deve especificar um limite de tamanho apropriado que permita o tamanho máximo de mensagem que você precisa que o grupo tolere (que é a solução recomendada) ou especificar uma configuração zero para restaurar o comportamento anterior.

* Use a variável de sistema [`group_replication_compression_threshold`](group-replication-system-variables.html#sysvar_group_replication_compression_threshold) para especificar um tamanho de mensagem acima do qual a compressão é aplicada. Esta variável de sistema tem o padrão de 1000000 bytes (1 MB), então mensagens grandes são automaticamente comprimidas. A compressão é realizada pelo Group Communication System (GCS) do Group Replication quando ele recebe uma mensagem que foi permitida pela configuração [`group_replication_transaction_size_limit`](group-replication-system-variables.html#sysvar_group_replication_transaction_size_limit), mas excede a configuração [`group_replication_compression_threshold`](group-replication-system-variables.html#sysvar_group_replication_compression_threshold). Se você definir o valor da variável de sistema como zero, a compressão será desativada. Para mais informações, consulte [Section 17.9.7.2, “Message Compression”](group-replication-message-compression.html "17.9.7.2 Message Compression").

Se você desativou a compressão de mensagens e não especificou um tamanho máximo de transação, o limite superior de tamanho para uma mensagem que pode ser tratada pela applier thread em um membro de um grupo de replicação é o valor da variável de sistema [`slave_max_allowed_packet`](replication-options-replica.html#sysvar_slave_max_allowed_packet) do membro, que tem um valor padrão e máximo de 1073741824 bytes (1 GB). Uma mensagem que excede este limite falha quando o membro receptor tenta processá-la. O limite superior de tamanho para uma mensagem que um membro do grupo pode originar e tentar transmitir ao grupo é de 4294967295 bytes (aproximadamente 4 GB). Este é um limite rígido para o tamanho do pacote que é aceito pelo mecanismo de comunicação do grupo para Group Replication (XCom, uma variante Paxos), que recebe as mensagens depois que o GCS as processa. Uma mensagem que excede este limite falha quando o membro de origem tenta transmiti-la.