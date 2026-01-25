#### 14.7.2.3 Leituras Consistentes Sem Lock (Nonlocking Reads)

Uma consistent read significa que o `InnoDB` utiliza multi-versionamento para apresentar a uma Query um snapshot do Database em um determinado ponto no tempo. A Query vê as alterações feitas por Transactions que fizeram Commit antes desse ponto no tempo e nenhuma alteração feita por Transactions posteriores ou não commitadas (uncommitted). A exceção a essa regra é que a Query vê as alterações feitas por instruções anteriores dentro da mesma Transaction. Essa exceção causa a seguinte anomalia: Se você atualizar algumas rows em uma tabela, um `SELECT` verá a versão mais recente das rows atualizadas, mas também poderá ver versões mais antigas de quaisquer rows. Se outras sessions atualizarem a mesma tabela simultaneamente, a anomalia significa que você pode ver a tabela em um estado que nunca existiu no Database.

Se o isolation level da Transaction for `REPEATABLE READ` (o nível padrão), todas as consistent reads dentro da mesma Transaction lerão o snapshot estabelecido pela primeira leitura desse tipo naquela Transaction. Você pode obter um snapshot mais atualizado para suas Queries fazendo Commit da Transaction atual e, depois disso, emitindo novas Queries.

Com o isolation level `READ COMMITTED`, cada consistent read dentro de uma Transaction define e lê seu próprio snapshot atualizado.

Consistent read é o modo padrão no qual o `InnoDB` processa instruções `SELECT` nos isolation levels `READ COMMITTED` e `REPEATABLE READ`. Uma consistent read não define nenhum Lock nas tabelas que acessa e, portanto, outras sessions estão livres para modificar essas tabelas ao mesmo tempo em que uma consistent read está sendo executada na tabela.

Suponha que você esteja executando no isolation level padrão `REPEATABLE READ`. Quando você emite uma consistent read (ou seja, uma instrução `SELECT` comum), o `InnoDB` atribui à sua Transaction um timepoint de acordo com o qual sua Query visualiza o Database. Se outra Transaction excluir uma row e fizer Commit após o seu timepoint ter sido atribuído, você não verá a row como excluída. Inserts e Updates são tratados de forma semelhante.

Nota

O snapshot do estado do Database se aplica a instruções `SELECT` dentro de uma Transaction, não necessariamente a instruções DML. Se você inserir ou modificar algumas rows e, em seguida, fizer Commit dessa Transaction, uma instrução `DELETE` ou `UPDATE` emitida a partir de outra Transaction concorrente `REPEATABLE READ` poderá afetar essas rows recém-commitadas, mesmo que a session não pudesse consultá-las. Se uma Transaction atualizar ou excluir rows commitadas por uma Transaction diferente, essas alterações se tornarão visíveis para a Transaction atual. Por exemplo, você pode encontrar uma situação como a seguinte:

```sql
SELECT COUNT(c1) FROM t1 WHERE c1 = 'xyz';
-- Returns 0: no rows match.
DELETE FROM t1 WHERE c1 = 'xyz';
-- Deletes several rows recently committed by other transaction.

SELECT COUNT(c2) FROM t1 WHERE c2 = 'abc';
-- Returns 0: no rows match.
UPDATE t1 SET c2 = 'cba' WHERE c2 = 'abc';
-- Affects 10 rows: another txn just committed 10 rows with 'abc' values.
SELECT COUNT(c2) FROM t1 WHERE c2 = 'cba';
-- Returns 10: this txn can now see the rows it just updated.
```

Você pode avançar seu timepoint fazendo Commit de sua Transaction e, em seguida, executando outro `SELECT` ou `START TRANSACTION WITH CONSISTENT SNAPSHOT`.

Isso é chamado de multi-versioned concurrency control.

No exemplo a seguir, a session A vê a row inserida por B somente quando B fez Commit do Insert e A também fez Commit, de modo que o timepoint é avançado para além do Commit de B.

```sql
             Session A              Session B

           SET autocommit=0;      SET autocommit=0;
time
|          SELECT * FROM t;
|          empty set
|                                 INSERT INTO t VALUES (1, 2);
|
v          SELECT * FROM t;
           empty set
                                  COMMIT;

           SELECT * FROM t;
           empty set

           COMMIT;

           SELECT * FROM t;
           ---------------------
           |    1    |    2    |
           ---------------------
```

Se você deseja ver o estado "mais atualizado" (freshest) do Database, use o isolation level `READ COMMITTED` ou uma locking read:

```sql
SELECT * FROM t LOCK IN SHARE MODE;
```

Com o isolation level `READ COMMITTED`, cada consistent read dentro de uma Transaction define e lê seu próprio snapshot atualizado. Com `LOCK IN SHARE MODE`, ocorre uma locking read: Um `SELECT` é bloqueado até que a Transaction contendo as rows mais atualizadas termine (consulte a Seção 14.7.2.4, “Locking Reads”).

Consistent read não funciona sobre certas instruções DDL:

* Consistent read não funciona sobre `DROP TABLE`, porque o MySQL não pode usar uma tabela que foi descartada (dropped) e o `InnoDB` destrói a tabela.

* Consistent read não funciona sobre operações `ALTER TABLE` que criam uma cópia temporária da tabela original e excluem a tabela original quando a cópia temporária é construída. Quando você reemite uma consistent read dentro de uma Transaction, as rows na nova tabela não são visíveis porque essas rows não existiam quando o snapshot da Transaction foi tirado. Neste caso, a Transaction retorna um erro: `ER_TABLE_DEF_CHANGED`, “Table definition has changed, please retry transaction”.

O tipo de read varia para os selects em cláusulas como `INSERT INTO ... SELECT`, `UPDATE ... (SELECT)` e `CREATE TABLE ... SELECT` que não especificam `FOR UPDATE` ou `LOCK IN SHARE MODE`:

* Por padrão, o `InnoDB` usa Locks mais fortes nessas instruções e a parte `SELECT` atua como `READ COMMITTED`, onde cada consistent read, mesmo dentro da mesma Transaction, define e lê seu próprio snapshot atualizado.

* Para realizar uma nonlocking read nesses casos, ative a opção `innodb_locks_unsafe_for_binlog` e defina o isolation level da Transaction para `READ UNCOMMITTED`, `READ COMMITTED` ou `REPEATABLE READ` para evitar a definição de Locks nas rows lidas da tabela selecionada.