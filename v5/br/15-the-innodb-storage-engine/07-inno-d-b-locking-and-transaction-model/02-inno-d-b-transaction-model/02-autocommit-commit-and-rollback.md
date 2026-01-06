#### 14.7.2.2 autocommit, Commit e Rollback

No `InnoDB`, toda a atividade do usuário ocorre dentro de uma transação. Se o modo `autocommit` estiver habilitado, cada instrução SQL forma uma única transação por si só. Por padrão, o MySQL inicia a sessão para cada nova conexão com `autocommit` habilitado, então o MySQL realiza um commit após cada instrução SQL se essa instrução não retornar um erro. Se uma instrução retornar um erro, o comportamento de commit ou rollback depende do erro. Veja a Seção 14.22.4, “Manipulação de Erros do InnoDB”.

Uma sessão que tenha o `autocommit` habilitado pode realizar uma transação de múltiplos comandos iniciando-a com uma declaração explícita `START TRANSACTION` ou `BEGIN` e encerrando-a com uma declaração `COMMIT` ou `ROLLBACK`. Veja a Seção 13.3.1, “Declarações `START TRANSACTION`, `COMMIT` e `ROLLBACK`”.

Se o modo `autocommit` for desativado em uma sessão com `SET autocommit = 0`, a sessão sempre terá uma transação aberta. Uma instrução `COMMIT` ou `ROLLBACK` termina a transação atual e inicia uma nova.

Se uma sessão que tem `autocommit` desativado termina sem comprometer explicitamente a transação final, o MySQL desfaz essa transação.

Algumas declarações implicitamente encerram uma transação, como se você tivesse executado um `COMMIT` antes de executar a declaração. Para obter detalhes, consulte a Seção 13.3.3, “Declarações que causam um commit implícito”.

Um `COMMIT` significa que as alterações feitas na transação atual são tornadas permanentes e tornam-se visíveis para outras sessões. Uma declaração `ROLLBACK`, por outro lado, cancela todas as modificações feitas pela transação atual. Tanto o `COMMIT` quanto o `ROLLBACK` liberam todos os bloqueios do `InnoDB` que foram definidos durante a transação atual.

##### Agrupamento de operações DML com transações

Por padrão, a conexão com o servidor MySQL começa com o modo de autocommit ativado, que automaticamente confirma cada instrução SQL conforme você a executa. Esse modo de operação pode ser desconhecido se você tiver experiência com outros sistemas de banco de dados, onde é prática padrão emitir uma sequência de instruções DML e confirmar ou reverter todas juntas.

Para usar transações com múltiplas instruções, desative o autocommit com a instrução SQL `SET autocommit = 0` e termine cada transação com `COMMIT` ou `ROLLBACK`, conforme apropriado. Para deixar o autocommit ativado, comece cada transação com `START TRANSACTION` e termine com `COMMIT` ou `ROLLBACK`. O exemplo a seguir mostra duas transações. A primeira é confirmada; a segunda é revertida.

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

###### Transações em linguagens do lado do cliente

Em APIs como PHP, Perl DBI, JDBC, ODBC ou a interface de chamada padrão em C do MySQL, você pode enviar instruções de controle de transações, como `COMMIT`, para o servidor MySQL como strings, assim como qualquer outra instrução SQL, como `SELECT` ou `INSERT`. Algumas APIs também oferecem funções ou métodos separados para o commit e rollback de transações especiais.
