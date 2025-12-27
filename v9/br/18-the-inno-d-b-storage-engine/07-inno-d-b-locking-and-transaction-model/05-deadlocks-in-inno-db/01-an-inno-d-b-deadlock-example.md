#### 17.7.5.1 Um exemplo de deadlock no InnoDB

O exemplo a seguir ilustra como um erro pode ocorrer quando um pedido de bloqueio causa um deadlock. O exemplo envolve dois clientes, A e B.

O status do InnoDB contém detalhes do último deadlock. Para deadlocks frequentes, habilite a variável global `innodb_print_all_deadlocks`. Isso adiciona informações sobre o deadlock ao log de erros.

O cliente A habilita `innodb_print_all_deadlocks`, cria duas tabelas, 'Animais' e 'Pássaros', e insere dados em cada uma. O cliente A inicia uma transação e seleciona uma linha em Animais em modo compartilhado:

```
mysql> SET GLOBAL innodb_print_all_deadlocks = ON;
Query OK, 0 rows affected (0.00 sec)

mysql> CREATE TABLE Animals (name VARCHAR(10) PRIMARY KEY, value INT) ENGINE = InnoDB;
Query OK, 0 rows affected (0.01 sec)

mysql> CREATE TABLE Birds (name VARCHAR(10) PRIMARY KEY, value INT) ENGINE = InnoDB;
Query OK, 0 rows affected (0.01 sec)

mysql> INSERT INTO Animals (name,value) VALUES ("Aardvark",10);
Query OK, 1 row affected (0.00 sec)

mysql> INSERT INTO Birds (name,value) VALUES ("Buzzard",20);
Query OK, 1 row affected (0.00 sec)

mysql> START TRANSACTION;
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT value FROM Animals WHERE name='Aardvark' FOR SHARE;
+-------+
| value |
+-------+
|    10 |
+-------+
1 row in set (0.00 sec)
```

Em seguida, o cliente B inicia uma transação e seleciona uma linha em Pássaros em modo compartilhado:

```
mysql> START TRANSACTION;
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT value FROM Birds WHERE name='Buzzard' FOR SHARE;
+-------+
| value |
+-------+
|    20 |
+-------+
1 row in set (0.00 sec)
```

O Schema de Desempenho mostra os bloqueios após os dois comandos de seleção:

```
mysql> SELECT ENGINE_TRANSACTION_ID as Trx_Id,
    ->     OBJECT_NAME as `Table`,
    ->     INDEX_NAME as `Index`,
    ->     LOCK_DATA as Data,
    ->     LOCK_MODE as Mode,
    ->     LOCK_STATUS as Status,
    ->     LOCK_TYPE as Type
    -> FROM performance_schema.data_locks;
+-----------------+---------+---------+------------+---------------+---------+--------+
| Trx_Id          | Table   | Index   | Data       | Mode          | Status  | Type   |
+-----------------+---------+---------+------------+---------------+---------+--------+
| 421291106147544 | Animals | NULL    | NULL       | IS            | GRANTED | TABLE  |
| 421291106147544 | Animals | PRIMARY | 'Aardvark' | S,REC_NOT_GAP | GRANTED | RECORD |
| 421291106148352 | Birds   | NULL    | NULL       | IS            | GRANTED | TABLE  |
| 421291106148352 | Birds   | PRIMARY | 'Buzzard'  | S,REC_NOT_GAP | GRANTED | RECORD |
+-----------------+---------+---------+------------+---------------+---------+--------+
4 rows in set (0.00 sec)
```

O cliente B então atualiza uma linha em Animais:

```
mysql> UPDATE Animals SET value=30 WHERE name='Aardvark';
```

O cliente B precisa esperar. O Schema de Desempenho mostra a espera por um bloqueio:

```
mysql> SELECT REQUESTING_ENGINE_LOCK_ID as Req_Lock_Id,
    ->     REQUESTING_ENGINE_TRANSACTION_ID as Req_Trx_Id,
    ->     BLOCKING_ENGINE_LOCK_ID as Blk_Lock_Id,
    ->     BLOCKING_ENGINE_TRANSACTION_ID as Blk_Trx_Id
    -> FROM performance_schema.data_lock_waits;
+----------------------------------------+------------+----------------------------------------+-----------------+
| Req_Lock_Id                            | Req_Trx_Id | Blk_Lock_Id                            | Blk_Trx_Id      |
+----------------------------------------+------------+----------------------------------------+-----------------+
| 139816129437696:27:4:2:139816016601240 |      43260 | 139816129436888:27:4:2:139816016594720 | 421291106147544 |
+----------------------------------------+------------+----------------------------------------+-----------------+
1 row in set (0.00 sec)

mysql> SELECT ENGINE_LOCK_ID as Lock_Id,
    ->     ENGINE_TRANSACTION_ID as Trx_id,
    ->     OBJECT_NAME as `Table`,
    ->     INDEX_NAME as `Index`,
    ->     LOCK_DATA as Data,
    ->     LOCK_MODE as Mode,
    ->     LOCK_STATUS as Status,
    ->     LOCK_TYPE as Type
    -> FROM performance_schema.data_locks;
+----------------------------------------+-----------------+---------+---------+------------+---------------+---------+--------+
| Lock_Id                                | Trx_Id          | Table   | Index   | Data       | Mode          | Status  | Type   |
+----------------------------------------+-----------------+---------+---------+------------+---------------+---------+--------+
| 139816129437696:1187:139816016603896   |           43260 | Animals | NULL    | NULL       | IX            | GRANTED | TABLE  |
| 139816129437696:1188:139816016603808   |           43260 | Birds   | NULL    | NULL       | IS            | GRANTED | TABLE  |
| 139816129437696:28:4:2:139816016600896 |           43260 | Birds   | PRIMARY | 'Buzzard'  | S,REC_NOT_GAP | GRANTED | RECORD |
| 139816129437696:27:4:2:139816016601240 |           43260 | Animals | PRIMARY | 'Aardvark' | X,REC_NOT_GAP | WAITING | RECORD |
| 139816129436888:1187:139816016597712   | 421291106147544 | Animals | NULL    | NULL       | IS            | GRANTED | TABLE  |
| 139816129436888:27:4:2:139816016594720 | 421291106147544 | Animals | PRIMARY | 'Aardvark' | S,REC_NOT_GAP | GRANTED | RECORD |
+----------------------------------------+-----------------+---------+---------+------------+---------------+---------+--------+
6 rows in set (0.00 sec)
```

O InnoDB usa apenas IDs de transação sequenciais quando uma transação tenta modificar o banco de dados. Portanto, o ID de transação anterior de leitura muda de 421291106148352 para 43260.

Se o cliente A tentar atualizar uma linha em Pássaros ao mesmo tempo, isso levará a um deadlock:

```
mysql> UPDATE Birds SET value=40 WHERE name='Buzzard';
ERROR 1213 (40001): Deadlock found when trying to get lock; try restarting transaction
```

O InnoDB desfaz a transação que causou o deadlock. A primeira atualização, do cliente B, agora pode prosseguir.

O Schema de Informações contém o número de deadlocks:

```
mysql> SELECT `count` FROM INFORMATION_SCHEMA.INNODB_METRICS
          WHERE NAME="lock_deadlocks";
+-------+
| count |
+-------+
|     1 |
+-------+
1 row in set (0.00 sec)
```

O status do InnoDB contém as seguintes informações sobre o deadlock e as transações. Também mostra que o ID de transação de leitura 421291106147544 muda para o ID de transação sequencial 43261.

```
mysql> SHOW ENGINE INNODB STATUS;
------------------------
LATEST DETECTED DEADLOCK
------------------------
2022-11-25 15:58:22 139815661168384
*** (1) TRANSACTION:
TRANSACTION 43260, ACTIVE 186 sec starting index read
mysql tables in use 1, locked 1
LOCK WAIT 4 lock struct(s), heap size 1128, 2 row lock(s)
MySQL thread id 19, OS thread handle 139815619204864, query id 143 localhost u2 updating
UPDATE Animals SET value=30 WHERE name='Aardvark'

*** (1) HOLDS THE LOCK(S):
RECORD LOCKS space id 28 page no 4 n bits 72 index PRIMARY of table `test`.`Birds` trx id 43260 lock mode S locks rec but not gap
Record lock, heap no 2 PHYSICAL RECORD: n_fields 4; compact format; info bits 0
 0: len 7; hex 42757a7a617264; asc Buzzard;;
 1: len 6; hex 00000000a8fb; asc       ;;
 2: len 7; hex 82000000e40110; asc        ;;
 3: len 4; hex 80000014; asc     ;;


*** (1) WAITING FOR THIS LOCK TO BE GRANTED:
RECORD LOCKS space id 27 page no 4 n bits 72 index PRIMARY of table `test`.`Animals` trx id 43260 lock_mode X locks rec but not gap waiting
Record lock, heap no 2 PHYSICAL RECORD: n_fields 4; compact format; info bits 0
 0: len 8; hex 416172647661726b; asc Aardvark;;
 1: len 6; hex 00000000a8f9; asc       ;;
 2: len 7; hex 82000000e20110; asc        ;;
 3: len 4; hex 8000000a; asc     ;;


*** (2) TRANSACTION:
TRANSACTION 43261, ACTIVE 209 sec starting index read
mysql tables in use 1, locked 1
LOCK WAIT 4 lock struct(s), heap size 1128, 2 row lock(s)
MySQL thread id 18, OS thread handle 139815618148096, query id 146 localhost u1 updating
UPDATE Birds SET value=40 WHERE name='Buzzard'

*** (2) HOLDS THE LOCK(S):
RECORD LOCKS space id 27 page no 4 n bits 72 index PRIMARY of table `test`.`Animals` trx id 43261 lock mode S locks rec but not gap
Record lock, heap no 2 PHYSICAL RECORD: n_fields 4; compact format; info bits 0
 0: len 8; hex 416172647661726b; asc Aardvark;;
 1: len 6; hex 00000000a8f9; asc       ;;
 2: len 7; hex 82000000e20110; asc        ;;
 3: len 4; hex 8000000a; asc     ;;


*** (2) WAITING FOR THIS LOCK TO BE GRANTED:
RECORD LOCKS space id 28 page no 4 n bits 72 index PRIMARY of table `test`.`Birds` trx id 43261 lock_mode X locks rec but not gap waiting
Record lock, heap no 2 PHYSICAL RECORD: n_fields 4; compact format; info bits 0
 0: len 7; hex 42757a7a617264; asc Buzzard;;
 1: len 6; hex 00000000a8fb; asc       ;;
 2: len 7; hex 82000000e40110; asc        ;;
 3: len 4; hex 80000014; asc     ;;

*** WE ROLL BACK TRANSACTION (2)
------------
TRANSACTIONS
------------
Trx id counter 43262
Purge done for trx's n:o < 43256 undo n:o < 0 state: running but idle
History list length 0
LIST OF TRANSACTIONS FOR EACH SESSION:
---TRANSACTION 421291106147544, not started
0 lock struct(s), heap size 1128, 0 row lock(s)
---TRANSACTION 421291106146736, not started
0 lock struct(s), heap size 1128, 0 row lock(s)
---TRANSACTION 421291106145928, not started
0 lock struct(s), heap size 1128, 0 row lock(s)
---TRANSACTION 43260, ACTIVE 219 sec
4 lock struct(s), heap size 1128, 2 row lock(s), undo log entries 1
MySQL thread id 19, OS thread handle 139815619204864, query id 143 localhost u2
```

O log de erros contém essas informações sobre transações e bloqueios:

```
mysql> SELECT @@log_error;
+---------------------+
| @@log_error         |
+---------------------+
| /var/log/mysqld.log |
+---------------------+
1 row in set (0.00 sec)

TRANSACTION 43260, ACTIVE 186 sec starting index read
mysql tables in use 1, locked 1
LOCK WAIT 4 lock struct(s), heap size 1128, 2 row lock(s)
MySQL thread id 19, OS thread handle 139815619204864, query id 143 localhost u2 updating
UPDATE Animals SET value=30 WHERE name='Aardvark'
RECORD LOCKS space id 28 page no 4 n bits 72 index PRIMARY of table `test`.`Birds` trx id 43260 lock mode S locks rec but not gap
Record lock, heap no 2 PHYSICAL RECORD: n_fields 4; compact format; info bits 0
 0: len 7; hex 42757a7a617264; asc Buzzard;;
 1: len 6; hex 00000000a8fb; asc       ;;
 2: len 7; hex 82000000e40110; asc        ;;
 3: len 4; hex 80000014; asc     ;;

RECORD LOCKS space id 27 page no 4 n bits 72 index PRIMARY of table `test`.`Animals` trx id 43260 lock_mode X locks rec but not gap waiting
Record lock, heap no 2 PHYSICAL RECORD: n_fields 4; compact format; info bits 0
 0: len 8; hex 416172647661726b; asc Aardvark;;
 1: len 6; hex 00000000a8f9; asc       ;;
 2: len 7; hex 82000000e20110; asc        ;;
 3: len 4; hex 8000000a; asc     ;;

TRANSACTION 43261, ACTIVE 209 sec starting index read
mysql tables in use 1, locked 1
LOCK WAIT 4 lock struct(s), heap size 1128, 2 row lock(s)
MySQL thread id 18, OS thread handle 139815618148096, query id 146 localhost u1 updating
UPDATE Birds SET value=40 WHERE name='Buzzard'
RECORD LOCKS space id 27 page no 4 n bits 72 index PRIMARY of table `test`.`Animals` trx id 43261 lock mode S locks rec but not gap
Record lock, heap no 2 PHYSICAL RECORD: n_fields 4; compact format; info bits 0
 0: len 8; hex 416172647661726b; asc Aardvark;;
 1: len 6; hex 00000000a8f9; asc       ;;
 2: len 7; hex 82000000e20110; asc        ;;
 3: len 4; hex 8000000a; asc     ;;

RECORD LOCKS space id 28 page no 4 n bits 72 index PRIMARY of table `test`.`Birds` trx id 43261 lock_mode X locks rec but not gap waiting
Record lock, heap no 2 PHYSICAL RECORD: n_fields 4; compact format; info bits 0
 0: len 7; hex 42757a7a617264; asc Buzzard;;
 1: len 6; hex 00000000a8fb; asc       ;;
 2: len 7; hex 82000000e40110; asc        ;;
 3: len 4; hex 80000014; asc     ;;
```