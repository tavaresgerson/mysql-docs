#### 14.7.2.2 autocommit, Commit, e Rollback

No `InnoDB`, toda a atividade do usuário ocorre dentro de uma Transaction. Se o modo `autocommit` estiver habilitado, cada instrução SQL forma uma única Transaction por conta própria. Por padrão, o MySQL inicia a session para cada nova conexão com `autocommit` habilitado, de modo que o MySQL executa um Commit após cada instrução SQL, caso essa instrução não retorne um erro. Se uma instrução retornar um erro, o comportamento de Commit ou Rollback dependerá do erro. Consulte a Seção 14.22.4, “Tratamento de Erros do InnoDB”.

Uma session que tem `autocommit` habilitado pode realizar uma Transaction de múltiplas instruções, iniciando-a com uma instrução explícita `START TRANSACTION` ou `BEGIN` e finalizando-a com uma instrução `COMMIT` ou `ROLLBACK`. Consulte a Seção 13.3.1, “Instruções START TRANSACTION, COMMIT e ROLLBACK”.

Se o modo `autocommit` for desabilitado dentro de uma session com `SET autocommit = 0`, a session sempre terá uma Transaction aberta. Uma instrução `COMMIT` ou `ROLLBACK` encerra a Transaction atual e uma nova se inicia.

Se uma session que tem `autocommit` desabilitado terminar sem fazer o Commit explicitamente da Transaction final, o MySQL faz o Rollback dessa Transaction.

Algumas instruções encerram implicitamente uma Transaction, como se você tivesse feito um `COMMIT` antes de executar a instrução. Para detalhes, consulte a Seção 13.3.3, “Instruções que Causam um Commit Implícito”.

Um `COMMIT` significa que as alterações feitas na Transaction atual são tornadas permanentes e se tornam visíveis para outras sessions. Uma instrução `ROLLBACK`, por outro lado, cancela todas as modificações feitas pela Transaction atual. Tanto o `COMMIT` quanto o `ROLLBACK` liberam todos os Locks do `InnoDB` que foram definidos durante a Transaction atual.

##### Agrupando Operações DML com Transactions

Por padrão, a conexão com o MySQL server começa com o modo autocommit habilitado, que automaticamente faz o Commit de cada instrução SQL à medida que você a executa. Este modo de operação pode não ser familiar se você tiver experiência com outros Database systems, onde é prática padrão emitir uma sequência de instruções DML e fazer o Commit ou o Rollback delas em conjunto.

Para usar Transactions de múltiplas instruções, desative o autocommit com a instrução SQL `SET autocommit = 0` e finalize cada Transaction com `COMMIT` ou `ROLLBACK`, conforme apropriado. Para manter o autocommit ativado, comece cada Transaction com `START TRANSACTION` e finalize-a com `COMMIT` ou `ROLLBACK`. O exemplo a seguir mostra duas Transactions. A primeira é committed; a segunda é rolled back.

```sql
$> mysql test
```

```sql
mysql> CREATE TABLE customer (a INT, b CHAR (20), INDEX (a));
Query OK, 0 rows affected (0.00 sec)
mysql> -- Do a transaction with autocommit turned on.
mysql> START TRANSACTION;
Query OK, 0 rows affected (0.00 sec)
mysql> INSERT INTO customer VALUES (10, 'Heikki');
Query OK, 1 row affected (0.00 sec)
mysql> COMMIT;
Query OK, 0 rows affected (0.00 sec)
mysql> -- Do another transaction with autocommit turned off.
mysql> SET autocommit=0;
Query OK, 0 rows affected (0.00 sec)
mysql> INSERT INTO customer VALUES (15, 'John');
Query OK, 1 row affected (0.00 sec)
mysql> INSERT INTO customer VALUES (20, 'Paul');
Query OK, 1 row affected (0.00 sec)
mysql> DELETE FROM customer WHERE b = 'Heikki';
Query OK, 1 row affected (0.00 sec)
mysql> -- Now we undo those last 2 inserts and the delete.
mysql> ROLLBACK;
Query OK, 0 rows affected (0.00 sec)
mysql> SELECT * FROM customer;
+------+--------+
| a    | b      |
+------+--------+
|   10 | Heikki |
+------+--------+
1 row in set (0.00 sec)
mysql>
```

###### Transactions em Linguagens Client-Side

Em APIs como PHP, Perl DBI, JDBC, ODBC, ou na interface de chamada C padrão do MySQL, você pode enviar instruções de controle de Transaction, como `COMMIT`, para o MySQL server como strings, assim como qualquer outra instrução SQL, como `SELECT` ou `INSERT`. Algumas APIs também oferecem funções ou métodos separados e especiais para Commit e Rollback de Transactions.