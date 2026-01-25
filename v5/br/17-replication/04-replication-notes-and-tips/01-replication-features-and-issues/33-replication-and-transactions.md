#### 16.4.1.33 Replication e Transactions

**Misturando comandos (statements) transacionais e não transacionais dentro da mesma Transaction.** Em geral, você deve evitar Transactions que atualizem ambas as tabelas, transacionais e não transacionais, em um ambiente de Replication. Você também deve evitar usar qualquer statement que acesse tabelas transacionais (ou temporárias) e não transacionais, e que escreva (write) em qualquer uma delas.

O server utiliza estas regras para o Binary Log:

*   Se os statements iniciais em uma Transaction não forem transacionais, eles são gravados no Binary Log imediatamente. Os statements restantes na Transaction são armazenados em cache e não são gravados no Binary Log até que a Transaction seja committed. (Se a Transaction for rolled back, os statements em cache serão gravados no Binary Log apenas se fizerem alterações não transacionais que não podem ser rolled back. Caso contrário, eles são descartados.)

*   Para Statement-Based Logging, o logging de statements não transacionais é afetado pela variável de sistema [`binlog_direct_non_transactional_updates`](replication-options-binary-log.html#sysvar_binlog_direct_non_transactional_updates). Quando esta variável está `OFF` (o padrão), o logging ocorre conforme descrito acima. Quando esta variável está `ON`, o logging ocorre imediatamente para statements não transacionais que ocorrem em qualquer parte da Transaction (não apenas statements não transacionais iniciais). Outros statements são mantidos no cache de Transaction e logados quando a Transaction faz Commit. [`binlog_direct_non_transactional_updates`](replication-options-binary-log.html#sysvar_binlog_direct_non_transactional_updates) não tem efeito para logging de Binary Log em Row-Format ou Mixed-Format.

**Statements transacionais, não transacionais e mistos.** Para aplicar essas regras, o server considera um statement não transacional se ele alterar apenas tabelas não transacionais, e transacional se alterar apenas tabelas transacionais. Um statement que referencia tabelas não transacionais e transacionais e atualiza *qualquer* uma das tabelas envolvidas, é considerado um statement “misto”. (Em algumas versões antigas do MySQL, apenas um statement que atualizava *ambas* as tabelas, não transacionais e transacionais, era considerado misto.) Statements mistos, assim como statements transacionais, são armazenados em cache e logados quando a Transaction faz Commit.

Um statement misto que atualiza uma tabela transacional é considerado unsafe (não seguro) se o statement também executar qualquer uma das seguintes ações:

*   Atualiza ou lê uma tabela temporária
*   Lê uma tabela não transacional e o nível de isolamento da Transaction é menor que REPEATABLE_READ

Um statement misto que segue a atualização de uma tabela transacional dentro de uma Transaction é considerado unsafe se executar qualquer uma das seguintes ações:

*   Atualiza qualquer tabela e lê a partir de qualquer tabela temporária
*   Atualiza uma tabela não transacional e [`binlog_direct_non_transactional_updates`](replication-options-binary-log.html#sysvar_binlog_direct_non_transactional_updates) está OFF

Para mais informações, veja [Section 16.2.1.3, “Determination of Safe and Unsafe Statements in Binary Logging”](replication-rbr-safe-unsafe.html "16.2.1.3 Determination of Safe and Unsafe Statements in Binary Logging").

**Nota**

Um statement misto não tem relação com o formato de Binary Logging misto (mixed format).

Em situações onde as Transactions misturam updates em tabelas transacionais e não transacionais, a ordem dos statements no Binary Log está correta, e todos os statements necessários são gravados no Binary Log mesmo em caso de um [`ROLLBACK`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements"). No entanto, quando uma segunda conexão atualiza a tabela não transacional antes que a Transaction da primeira conexão seja concluída, os statements podem ser logados fora de ordem porque o update da segunda conexão é gravado imediatamente após ser executado, independentemente do estado da Transaction sendo executada pela primeira conexão.

**Usando diferentes Storage Engines no Source e na Replica.** É possível replicar tabelas transacionais no Source usando tabelas não transacionais na Replica. Por exemplo, você pode replicar uma tabela `InnoDB` do Source como uma tabela `MyISAM` na Replica. No entanto, se você fizer isso, haverá problemas se a Replica for interrompida no meio de um bloco [`BEGIN`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") ... [`COMMIT`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements"), pois a Replica reiniciará no início do bloco [`BEGIN`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements").

Também é seguro replicar Transactions de tabelas [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine") no Source para tabelas transacionais na Replica, como tabelas que usam o Storage Engine [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine"). Nesses casos, um statement [`AUTOCOMMIT=1`](server-system-variables.html#sysvar_autocommit) emitido no Source é replicado, forçando assim o modo `AUTOCOMMIT` na Replica.

Quando o tipo de Storage Engine da Replica é não transacional, as Transactions no Source que misturam updates de tabelas transacionais e não transacionais devem ser evitadas, pois podem causar inconsistência dos dados entre a tabela transacional do Source e a tabela não transacional da Replica. Ou seja, tais Transactions podem levar a um comportamento específico do Storage Engine do Source, com o possível efeito de a Replication sair de sincronia. Atualmente, o MySQL não emite um warning sobre isso, portanto, deve-se tomar cuidado extra ao replicar tabelas transacionais do Source para tabelas não transacionais nas Replicas.

**Alterando o formato do Binary Logging dentro de Transactions.** As variáveis de sistema [`binlog_format`](replication-options-binary-log.html#sysvar_binlog_format) e [`binlog_checksum`](replication-options-binary-log.html#sysvar_binlog_checksum) são read-only enquanto uma Transaction estiver em andamento.

Cada Transaction (incluindo Transactions [`autocommit`](server-system-variables.html#sysvar_autocommit)) é gravada no Binary Log como se começasse com um statement [`BEGIN`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") e terminasse com um statement [`COMMIT`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") ou [`ROLLBACK`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements"). Isso é verdade mesmo para statements que afetam tabelas que usam um Storage Engine não transacional (como [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine")).

**Nota**

Para restrições que se aplicam especificamente a XA Transactions, veja [Section 13.3.7.3, “Restrictions on XA Transactions”](xa-restrictions.html "13.3.7.3 Restrictions on XA Transactions").