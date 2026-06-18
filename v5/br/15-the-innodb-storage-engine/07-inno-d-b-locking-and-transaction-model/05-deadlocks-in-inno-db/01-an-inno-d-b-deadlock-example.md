#### 14.7.5.1 Um Exemplo de Deadlock do InnoDB

O exemplo a seguir ilustra como um erro pode ocorrer quando uma solicitação de Lock causa um Deadlock. O exemplo envolve dois Clients, A e B.

Primeiro, o Client A cria uma tabela contendo uma única row e, em seguida, inicia uma Transaction. Dentro da Transaction, A obtém um Lock S na row selecionando-a em modo compartilhado (share mode):

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

Em seguida, o Client B inicia uma Transaction e tenta deletar a row da tabela:

```sql
mysql> START TRANSACTION;
Query OK, 0 rows affected (0.00 sec)

mysql> DELETE FROM t WHERE i = 1;
```

A operação de Delete requer um Lock X. O Lock não pode ser concedido porque é incompatível com o Lock S que o Client A está mantendo, então a solicitação entra na fila de solicitações de Lock para a row e o Client B é bloqueado (blocks).

Finalmente, o Client A também tenta deletar a row da tabela:

```sql
mysql> DELETE FROM t WHERE i = 1;
```

O Deadlock ocorre aqui porque o Client A precisa de um Lock X para deletar a row. No entanto, essa solicitação de Lock não pode ser concedida porque o Client B já tem uma solicitação de Lock X e está esperando que o Client A libere seu Lock S. O Lock S mantido por A também não pode ser atualizado (upgraded) para um Lock X devido à solicitação anterior de Lock X feita por B. Como resultado, o `InnoDB` gera um erro para um dos Clients e libera seus Locks. O Client retorna este erro:

```sql
ERROR 1213 (40001): Deadlock found when trying to get lock;
try restarting transaction
```

Nesse ponto, a solicitação de Lock para o outro Client pode ser concedida, e ele deleta a row da tabela.