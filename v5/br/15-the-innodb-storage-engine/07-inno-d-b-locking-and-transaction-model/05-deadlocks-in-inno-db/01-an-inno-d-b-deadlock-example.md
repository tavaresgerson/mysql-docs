#### 14.7.5.1 Um exemplo de bloqueio de deadlock no InnoDB

O exemplo a seguir ilustra como um erro pode ocorrer quando um pedido de bloqueio causa um impasse. O exemplo envolve dois clientes, A e B.

Primeiro, o cliente A cria uma tabela contendo uma única linha e, em seguida, inicia uma transação. Dentro da transação, A obtém um bloqueio `S` na linha selecionando-a no modo compartilhado:

```sql
mysql> CREATE TABLE t (i INT) ENGINE = InnoDB;
Query OK, 0 rows affected (1.07 sec)

mysql> INSERT INTO t (i) VALUES(1);
Query OK, 1 row affected (0.09 sec)

mysql> START TRANSACTION;
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT * FROM t WHERE i = 1 LOCK IN SHARE MODE;
+------+
| i    |
+------+
|    1 |
+------+
```

Em seguida, o cliente B inicia uma transação e tenta excluir a linha da tabela:

```sql
mysql> START TRANSACTION;
Query OK, 0 rows affected (0.00 sec)

mysql> DELETE FROM t WHERE i = 1;
```

A operação de exclusão requer um bloqueio `X`. O bloqueio não pode ser concedido porque é incompatível com o bloqueio `S` que o cliente A possui, então o pedido fica na fila de pedidos de bloqueio para a linha e o cliente B bloqueia.

Por fim, o cliente A também tenta excluir a linha da tabela:

```sql
mysql> DELETE FROM t WHERE i = 1;
```

O bloqueio ocorre aqui porque o cliente A precisa de um bloqueio `X` para excluir a linha. No entanto, esse pedido de bloqueio não pode ser concedido porque o cliente B já tem um pedido de bloqueio `X` e está aguardando que o cliente A libere seu bloqueio `S`. Além disso, o bloqueio `S` mantido pelo A não pode ser atualizado para um bloqueio `X` devido ao pedido anterior do B por um bloqueio `X`. Como resultado, o `InnoDB` gera um erro para um dos clientes e libera seus bloqueios. O cliente retorna esse erro:

```sql
ERROR 1213 (40001): Deadlock found when trying to get lock;
try restarting transaction
```

Nesse momento, o pedido de bloqueio para o outro cliente pode ser concedido e ele exclui a linha da tabela.
