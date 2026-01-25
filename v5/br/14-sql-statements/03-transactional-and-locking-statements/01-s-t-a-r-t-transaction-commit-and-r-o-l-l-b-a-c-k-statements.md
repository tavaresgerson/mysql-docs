### 13.3.1 Declarações START TRANSACTION, COMMIT e ROLLBACK

```sql
START TRANSACTION
    [transaction_characteristic [, transaction_characteristic] ...]

transaction_characteristic: {
    WITH CONSISTENT SNAPSHOT
  | READ WRITE
  | READ ONLY
}

BEGIN [WORK]
COMMIT [WORK] [AND [NO] CHAIN] NO] RELEASE]
ROLLBACK [WORK] [AND [NO] CHAIN] NO] RELEASE]
SET autocommit = {0 | 1}
```

Estas declarações fornecem controle sobre o uso de [transactions](glossary.html#glos_transaction "transaction"):

*   `START TRANSACTION` ou `BEGIN` iniciam uma nova transaction.

*   `COMMIT` confirma a transaction atual, tornando suas alterações permanentes.

*   `ROLLBACK` reverte (rolls back) a transaction atual, cancelando suas alterações.

*   `SET autocommit` desabilita ou habilita o modo autocommit padrão para a sessão atual.

Por padrão, o MySQL é executado com o modo [autocommit](glossary.html#glos_autocommit "autocommit") habilitado. Isso significa que, quando não está explicitamente dentro de uma transaction, cada declaração é atômica, como se estivesse envolvida por `START TRANSACTION` e `COMMIT`. Você não pode usar `ROLLBACK` para desfazer o efeito; no entanto, se ocorrer um erro durante a execução da declaração, a declaração é revertida (rolled back).

Para desabilitar o modo autocommit implicitamente para uma única série de declarações, use a declaração `START TRANSACTION`:

```sql
START TRANSACTION;
SELECT @A:=SUM(salary) FROM table1 WHERE type=1;
UPDATE table2 SET summary=@A WHERE type=1;
COMMIT;
```

Com `START TRANSACTION`, o autocommit permanece desabilitado até que você encerre a transaction com `COMMIT` ou `ROLLBACK`. O modo autocommit então reverte para seu estado anterior.

`START TRANSACTION` permite vários modificadores que controlam as características da transaction. Para especificar múltiplos modificadores, separe-os por vírgulas.

*   O modificador `WITH CONSISTENT SNAPSHOT` inicia uma [consistent read](glossary.html#glos_consistent_read "consistent read") para storage engines que são capazes disso. Isso se aplica apenas ao `InnoDB`. O efeito é o mesmo que emitir um `START TRANSACTION` seguido por um [`SELECT`](select.html "13.2.9 SELECT Statement") de qualquer tabela `InnoDB`. Consulte [Seção 14.7.2.3, “Consistent Nonlocking Reads”](innodb-consistent-read.html "14.7.2.3 Consistent Nonlocking Reads"). O modificador `WITH CONSISTENT SNAPSHOT` não altera o [isolation level](glossary.html#glos_isolation_level "isolation level") da transaction atual, portanto, ele fornece um consistent snapshot apenas se o isolation level atual for um que permita uma consistent read. O único isolation level que permite uma consistent read é [`REPEATABLE READ`](innodb-transaction-isolation-levels.html#isolevel_repeatable-read). Para todos os outros isolation levels, a cláusula `WITH CONSISTENT SNAPSHOT` é ignorada. A partir do MySQL 5.7.2, um aviso é gerado quando a cláusula `WITH CONSISTENT SNAPSHOT` é ignorada.

*   Os modificadores `READ WRITE` e `READ ONLY` definem o modo de acesso da transaction. Eles permitem ou proíbem alterações em tabelas usadas na transaction. A restrição `READ ONLY` impede que a transaction modifique ou aplique Lock em tabelas transactionais e não transactionais que são visíveis para outras transactions; a transaction ainda pode modificar ou aplicar Lock em temporary tables.

    O MySQL habilita otimizações extras para Queries em tabelas `InnoDB` quando a transaction é conhecida como read-only. Especificar `READ ONLY` garante que essas otimizações sejam aplicadas em casos em que o status read-only não possa ser determinado automaticamente. Consulte [Seção 8.5.3, “Optimizing InnoDB Read-Only Transactions”](innodb-performance-ro-txn.html "8.5.3 Optimizing InnoDB Read-Only Transactions") para mais informações.

    Se nenhum modo de acesso for especificado, o modo padrão se aplica. A menos que o padrão tenha sido alterado, ele é read/write. Não é permitido especificar `READ WRITE` e `READ ONLY` na mesma declaração.

    No modo read-only, ainda é possível alterar tabelas criadas com a palavra-chave `TEMPORARY` usando declarações DML. Alterações feitas com declarações DDL não são permitidas, assim como ocorre com tabelas permanentes.

    Para informações adicionais sobre o modo de acesso da transaction, incluindo maneiras de alterar o modo padrão, consulte [Seção 13.3.6, “SET TRANSACTION Statement”](set-transaction.html "13.3.6 SET TRANSACTION Statement").

    Se a variável de sistema [`read_only`](server-system-variables.html#sysvar_read_only) estiver habilitada, iniciar explicitamente uma transaction com `START TRANSACTION READ WRITE` requer o privilégio [`SUPER`](privileges-provided.html#priv_super).

Importante

Muitas APIs usadas para escrever aplicações cliente MySQL (como JDBC) fornecem seus próprios métodos para iniciar transactions que podem (e às vezes devem) ser usados em vez de enviar uma declaração `START TRANSACTION` do cliente. Consulte [Capítulo 27, *Connectors and APIs*](connectors-apis.html "Chapter 27 Connectors and APIs"), ou a documentação de sua API, para mais informações.

Para desabilitar o modo autocommit explicitamente, use a seguinte declaração:

```sql
SET autocommit=0;
```

Após desabilitar o modo autocommit definindo a variável [`autocommit`](server-system-variables.html#sysvar_autocommit) como zero, as alterações em tabelas transaction-safe (como aquelas para [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") ou [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6")) não se tornam permanentes imediatamente. Você deve usar [`COMMIT`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") para armazenar suas alterações no disco ou `ROLLBACK` para ignorar as alterações.

[`autocommit`](server-system-variables.html#sysvar_autocommit) é uma session variable e deve ser definida para cada sessão. Para desabilitar o modo autocommit para cada nova conexão, consulte a descrição da variável de sistema [`autocommit`](server-system-variables.html#sysvar_autocommit) em [Seção 5.1.7, “Server System Variables”](server-system-variables.html "5.1.7 Server System Variables").

`BEGIN` e `BEGIN WORK` são suportados como aliases de `START TRANSACTION` para iniciar uma transaction. `START TRANSACTION` é a sintaxe SQL padrão, é a forma recomendada de iniciar uma transaction *ad-hoc*, e permite modificadores que `BEGIN` não permite.

A declaração `BEGIN` difere do uso da palavra-chave `BEGIN` que inicia uma declaração composta [`BEGIN ... END`](begin-end.html "13.6.1 BEGIN ... END Compound Statement"). Esta última não inicia uma transaction. Consulte [Seção 13.6.1, “BEGIN ... END Compound Statement”](begin-end.html "13.6.1 BEGIN ... END Compound Statement").

Nota

Dentro de todos os stored programs (stored procedures e functions, triggers e events), o parser trata `BEGIN [WORK]` como o início de um bloco [`BEGIN ... END`](begin-end.html "13.6.1 BEGIN ... END Compound Statement"). Inicie uma transaction neste contexto com [`START TRANSACTION`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements").

A palavra-chave opcional `WORK` é suportada para `COMMIT` e `ROLLBACK`, assim como as cláusulas `CHAIN` e `RELEASE`. `CHAIN` e `RELEASE` podem ser usadas para controle adicional sobre a conclusão da transaction. O valor da variável de sistema [`completion_type`](server-system-variables.html#sysvar_completion_type) determina o comportamento de conclusão padrão. Consulte [Seção 5.1.7, “Server System Variables”](server-system-variables.html "5.1.7 Server System Variables").

A cláusula `AND CHAIN` faz com que uma nova transaction comece assim que a atual termina, e a nova transaction tem o mesmo isolation level da transaction recém-terminada. A nova transaction também usa o mesmo modo de acesso (`READ WRITE` ou `READ ONLY`) da transaction recém-terminada. A cláusula `RELEASE` faz com que o servidor desconecte a sessão cliente atual após encerrar a transaction atual. A inclusão da palavra-chave `NO` suprime a conclusão `CHAIN` ou `RELEASE`, o que pode ser útil se a variável de sistema [`completion_type`](server-system-variables.html#sysvar_completion_type) estiver configurada para causar encadeamento (chaining) ou conclusão de liberação (release completion) por padrão.

O início de uma transaction faz com que qualquer transaction pendente seja confirmada (committed). Consulte [Seção 13.3.3, “Statements That Cause an Implicit Commit”](implicit-commit.html "13.3.3 Statements That Cause an Implicit Commit"), para mais informações.

O início de uma transaction também faz com que Locks de tabela adquiridos com [`LOCK TABLES`](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements") sejam liberados, como se você tivesse executado [`UNLOCK TABLES`](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements"). O início de uma transaction não libera um global read lock adquirido com [`FLUSH TABLES WITH READ LOCK`](flush.html#flush-tables-with-read-lock).

Para melhores resultados, as transactions devem ser realizadas usando apenas tabelas gerenciadas por um único storage engine transaction-safe. Caso contrário, os seguintes problemas podem ocorrer:

*   Se você usar tabelas de mais de um storage engine transaction-safe (como `InnoDB`), e o transaction isolation level não for [`SERIALIZABLE`](innodb-transaction-isolation-levels.html#isolevel_serializable), é possível que, quando uma transaction for committed, outra transaction em curso que usa as mesmas tabelas veja apenas algumas das alterações feitas pela primeira transaction. Ou seja, a atomicity das transactions não é garantida com engines mistos, e inconsistências podem resultar. (Se as transactions de engine misto forem pouco frequentes, você pode usar [`SET TRANSACTION ISOLATION LEVEL`](set-transaction.html "13.3.6 SET TRANSACTION Statement") para definir o isolation level como [`SERIALIZABLE`](innodb-transaction-isolation-levels.html#isolevel_serializable) conforme necessário, por transaction.)

*   Se você usar tabelas que não são transaction-safe dentro de uma transaction, as alterações nessas tabelas são armazenadas imediatamente, independentemente do status do modo autocommit.

*   Se você emitir uma declaração [`ROLLBACK`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") após atualizar uma tabela não-transactional dentro de uma transaction, um aviso [`ER_WARNING_NOT_COMPLETE_ROLLBACK`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_warning_not_complete_rollback) ocorre. As alterações em tabelas transaction-safe são revertidas (rolled back), mas não as alterações em tabelas non-transaction-safe.

Cada transaction é armazenada no binary log em um único bloco (*chunk*), após o [`COMMIT`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements"). Transactions que são revertidas (rolled back) não são logadas. (**Exceção**: Modificações em tabelas não-transactionais não podem ser revertidas. Se uma transaction que é revertida incluir modificações em tabelas não-transactionais, a transaction inteira é logada com uma declaração [`ROLLBACK`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") no final para garantir que as modificações nas tabelas não-transactionais sejam replicadas.) Consulte [Seção 5.4.4, “The Binary Log”](binary-log.html "5.4.4 The Binary Log").

Você pode alterar o isolation level ou o modo de acesso para transactions com a declaração [`SET TRANSACTION`](set-transaction.html "13.3.6 SET TRANSACTION Statement"). Consulte [Seção 13.3.6, “SET TRANSACTION Statement”](set-transaction.html "13.3.6 SET TRANSACTION Statement").

O Rolling back pode ser uma operação lenta que pode ocorrer implicitamente sem que o usuário a tenha solicitado explicitamente (por exemplo, quando ocorre um erro). Por causa disso, [`SHOW PROCESSLIST`](show-processlist.html "13.7.5.29 SHOW PROCESSLIST Statement") exibe `Rolling back` na coluna `State` para a sessão, não apenas para rollbacks explícitos realizados com a declaração [`ROLLBACK`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements"), mas também para rollbacks implícitos.

Nota

No MySQL 5.7, `BEGIN`, `COMMIT` e `ROLLBACK` não são afetados pelas regras [`--replicate-do-db`](replication-options-replica.html#option_mysqld_replicate-do-db) ou [`--replicate-ignore-db`](replication-options-replica.html#option_mysqld_replicate-ignore-db).

Quando o `InnoDB` realiza um rollback completo de uma transaction, todos os Locks definidos pela transaction são liberados. Se uma única declaração SQL dentro de uma transaction é revertida (rolls back) como resultado de um erro, como um erro de chave duplicada (duplicate key error), os Locks definidos pela declaração são preservados enquanto a transaction permanece ativa. Isso acontece porque o `InnoDB` armazena os row Locks em um formato que não permite saber posteriormente qual Lock foi definido por qual declaração.

Se uma declaração [`SELECT`](select.html "13.2.9 SELECT Statement") dentro de uma transaction chama uma stored function, e uma declaração dentro da stored function falha, essa declaração é revertida (rolls back). Se o [`ROLLBACK`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") for executado para a transaction subsequentemente, a transaction inteira é revertida.