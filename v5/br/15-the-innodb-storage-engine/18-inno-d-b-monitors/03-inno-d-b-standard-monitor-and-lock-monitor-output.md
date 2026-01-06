### 14.18.3 Monitor padrão InnoDB e Monitor de bloqueio de saída

O Monitor de Bloqueio é o mesmo que o Monitor Padrão, exceto que ele inclui informações adicionais sobre o bloqueio. Ativação de qualquer um dos monitores para saída periódica aciona o mesmo fluxo de saída, mas o fluxo inclui informações extras se o Monitor de Bloqueio estiver ativado. Por exemplo, se você ativar o Monitor Padrão e o Monitor de Bloqueio, isso aciona um único fluxo de saída. O fluxo inclui informações extras sobre o bloqueio até que você desative o Monitor de Bloqueio.

A saída padrão do Monitor é limitada a 1 MB quando produzida usando a instrução `SHOW ENGINE INNODB STATUS`. Esse limite não se aplica à saída escrita na saída padrão de erro do tserver (`stderr`).

Exemplo de saída padrão do monitor:

```sql
mysql> SHOW ENGINE INNODB STATUS\G
*************************** 1. row ***************************
  Type: InnoDB
  Name:
Status:
=====================================
2014-10-16 18:37:29 0x7fc2a95c1700 INNODB MONITOR OUTPUT
=====================================
Per second averages calculated from the last 20 seconds
-----------------
BACKGROUND THREAD
-----------------
srv_master_thread loops: 38 srv_active, 0 srv_shutdown, 252 srv_idle
srv_master_thread log flush and writes: 290
----------
SEMAPHORES
----------
OS WAIT ARRAY INFO: reservation count 119
OS WAIT ARRAY INFO: signal count 103
Mutex spin waits 0, rounds 0, OS waits 0
RW-shared spins 38, rounds 76, OS waits 38
RW-excl spins 2, rounds 9383715, OS waits 3
RW-sx spins 0, rounds 0, OS waits 0
Spin rounds per wait: 0.00 mutex, 2.00 RW-shared, 4691857.50 RW-excl,
0.00 RW-sx
------------------------
LATEST FOREIGN KEY ERROR
------------------------
2014-10-16 18:35:18 0x7fc2a95c1700 Transaction:
TRANSACTION 1814, ACTIVE 0 sec inserting
mysql tables in use 1, locked 1
4 lock struct(s), heap size 1136, 3 row lock(s), undo log entries 3
MySQL thread id 2, OS thread handle 140474041767680, query id 74 localhost
root update
INSERT INTO child VALUES
    (NULL, 1)
    , (NULL, 2)
    , (NULL, 3)
    , (NULL, 4)
    , (NULL, 5)
    , (NULL, 6)
Foreign key constraint fails for table `mysql`.`child`:
,
  CONSTRAINT `child_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `parent`
  (`id`) ON DELETE CASCADE ON UPDATE CASCADE
Trying to add in child table, in index par_ind tuple:
DATA TUPLE: 2 fields;
 0: len 4; hex 80000003; asc     ;;
 1: len 4; hex 80000003; asc     ;;

But in parent table `mysql`.`parent`, in index PRIMARY,
the closest match we can find is record:
PHYSICAL RECORD: n_fields 3; compact format; info bits 0
 0: len 4; hex 80000004; asc     ;;
 1: len 6; hex 00000000070a; asc       ;;
 2: len 7; hex aa0000011d0134; asc       4;;

------------------------
LATEST DETECTED DEADLOCK
------------------------
2014-10-16 18:36:30 0x7fc2a95c1700
*** (1) TRANSACTION:
TRANSACTION 1824, ACTIVE 9 sec starting index read
mysql tables in use 1, locked 1
LOCK WAIT 2 lock struct(s), heap size 1136, 1 row lock(s)
MySQL thread id 3, OS thread handle 140474041501440, query id 80 localhost
root updating
DELETE FROM t WHERE i = 1
*** (1) WAITING FOR THIS LOCK TO BE GRANTED:
RECORD LOCKS space id 35 page no 3 n bits 72 index GEN_CLUST_INDEX of table
`mysql`.`t` trx id 1824 lock_mode X waiting
Record lock, heap no 2 PHYSICAL RECORD: n_fields 4; compact format; info
bits 0
 0: len 6; hex 000000000200; asc       ;;
 1: len 6; hex 00000000071f; asc       ;;
 2: len 7; hex b80000012b0110; asc     +  ;;
 3: len 4; hex 80000001; asc     ;;

*** (2) TRANSACTION:
TRANSACTION 1825, ACTIVE 29 sec starting index read
mysql tables in use 1, locked 1
4 lock struct(s), heap size 1136, 3 row lock(s)
MySQL thread id 2, OS thread handle 140474041767680, query id 81 localhost
root updating
DELETE FROM t WHERE i = 1
*** (2) HOLDS THE LOCK(S):
RECORD LOCKS space id 35 page no 3 n bits 72 index GEN_CLUST_INDEX of table
`mysql`.`t` trx id 1825 lock mode S
Record lock, heap no 1 PHYSICAL RECORD: n_fields 1; compact format; info
bits 0
 0: len 8; hex 73757072656d756d; asc supremum;;

Record lock, heap no 2 PHYSICAL RECORD: n_fields 4; compact format; info bits 0
 0: len 6; hex 000000000200; asc       ;;
 1: len 6; hex 00000000071f; asc       ;;
 2: len 7; hex b80000012b0110; asc     +  ;;
 3: len 4; hex 80000001; asc     ;;

*** (2) WAITING FOR THIS LOCK TO BE GRANTED:
RECORD LOCKS space id 35 page no 3 n bits 72 index GEN_CLUST_INDEX of table
`mysql`.`t` trx id 1825 lock_mode X waiting
Record lock, heap no 2 PHYSICAL RECORD: n_fields 4; compact format; info
bits 0
 0: len 6; hex 000000000200; asc       ;;
 1: len 6; hex 00000000071f; asc       ;;
 2: len 7; hex b80000012b0110; asc     +  ;;
 3: len 4; hex 80000001; asc     ;;

*** WE ROLL BACK TRANSACTION (1)
------------
TRANSACTIONS
------------
Trx id counter 1950
Purge done for trx's n:o < 1933 undo n:o < 0 state: running but idle
History list length 23
LIST OF TRANSACTIONS FOR EACH SESSION:
---TRANSACTION 421949033065200, not started
0 lock struct(s), heap size 1136, 0 row lock(s)
---TRANSACTION 421949033064280, not started
0 lock struct(s), heap size 1136, 0 row lock(s)
---TRANSACTION 1949, ACTIVE 0 sec inserting
mysql tables in use 1, locked 1
8 lock struct(s), heap size 1136, 1850 row lock(s), undo log entries 17415
MySQL thread id 4, OS thread handle 140474041235200, query id 176 localhost
root update
INSERT INTO `salaries` VALUES (55723,39746,'1997-02-25','1998-02-25'),
(55723,40758,'1998-02-25','1999-02-25'),(55723,44559,'1999-02-25','2000-02-25'),
(55723,44081,'2000-02-25','2001-02-24'),(55723,44112,'2001-02-24','2001-08-16'),
(55724,46461,'1996-12-06','1997-12-06'),(55724,48916,'1997-12-06','1998-12-06'),
(55724,51269,'1998-12-06','1999-12-06'),(55724,51932,'1999-12-06','2000-12-05'),
(55724,52617,'2000-12-05','2001-12-05'),(55724,56658,'2001-12-05','9999-01-01'),
(55725,40000,'1993-01-30','1994-01-30'),(55725,41472,'1994-01-30','1995-01-30'),
(55725,45293,'1995-01-30','1996-01-30'),(55725,473
--------
FILE I/O
--------
I/O thread 0 state: waiting for completed aio requests (insert buffer thread)
I/O thread 1 state: waiting for completed aio requests (log thread)
I/O thread 2 state: waiting for completed aio requests (read thread)
I/O thread 3 state: waiting for completed aio requests (read thread)
I/O thread 4 state: waiting for completed aio requests (read thread)
I/O thread 5 state: waiting for completed aio requests (read thread)
I/O thread 6 state: waiting for completed aio requests (write thread)
I/O thread 7 state: waiting for completed aio requests (write thread)
I/O thread 8 state: waiting for completed aio requests (write thread)
I/O thread 9 state: waiting for completed aio requests (write thread)
Pending normal aio reads: 0 [0, 0, 0, 0] , aio writes: 0 [0, 0, 0, 0] ,
 ibuf aio reads: 0, log i/o's: 0, sync i/o's: 0
Pending flushes (fsync) log: 0; buffer pool: 0
224 OS file reads, 5770 OS file writes, 803 OS fsyncs
0.00 reads/s, 0 avg bytes/read, 264.84 writes/s, 23.05 fsyncs/s
-------------------------------------
INSERT BUFFER AND ADAPTIVE HASH INDEX
-------------------------------------
Ibuf: size 1, free list len 0, seg size 2, 0 merges
merged operations:
 insert 0, delete mark 0, delete 0
discarded operations:
 insert 0, delete mark 0, delete 0
Hash table size 4425293, node heap has 444 buffer(s)
68015.25 hash searches/s, 106259.24 non-hash searches/s
---
LOG
---
Log sequence number 165913808
Log flushed up to   164814979
Pages flushed up to 141544038
Last checkpoint at  130503656
0 pending log flushes, 0 pending chkp writes
258 log i/o's done, 6.65 log i/o's/second
----------------------
BUFFER POOL AND MEMORY
----------------------
Total large memory allocated 2198863872
Dictionary memory allocated 776332
Buffer pool size   131072
Free buffers       124908
Database pages     5720
Old database pages 2071
Modified db pages  910
Pending reads 0
Pending writes: LRU 0, flush list 0, single page 0
Pages made young 4, not young 0
0.10 youngs/s, 0.00 non-youngs/s
Pages read 197, created 5523, written 5060
0.00 reads/s, 190.89 creates/s, 244.94 writes/s
Buffer pool hit rate 1000 / 1000, young-making rate 0 / 1000 not
0 / 1000
Pages read ahead 0.00/s, evicted without access 0.00/s, Random read
ahead 0.00/s
LRU len: 5720, unzip_LRU len: 0
I/O sum[0]:cur[0], unzip sum[0]:cur[0]
----------------------
INDIVIDUAL BUFFER POOL INFO
----------------------
---BUFFER POOL 0
Buffer pool size   65536
Free buffers       62412
Database pages     2899
Old database pages 1050
Modified db pages  449
Pending reads 0
Pending writes: LRU 0, flush list 0, single page 0
Pages made young 3, not young 0
0.05 youngs/s, 0.00 non-youngs/s
Pages read 107, created 2792, written 2586
0.00 reads/s, 92.65 creates/s, 122.89 writes/s
Buffer pool hit rate 1000 / 1000, young-making rate 0 / 1000 not 0 / 1000
Pages read ahead 0.00/s, evicted without access 0.00/s, Random read ahead
0.00/s
LRU len: 2899, unzip_LRU len: 0
I/O sum[0]:cur[0], unzip sum[0]:cur[0]
---BUFFER POOL 1
Buffer pool size   65536
Free buffers       62496
Database pages     2821
Old database pages 1021
Modified db pages  461
Pending reads 0
Pending writes: LRU 0, flush list 0, single page 0
Pages made young 1, not young 0
0.05 youngs/s, 0.00 non-youngs/s
Pages read 90, created 2731, written 2474
0.00 reads/s, 98.25 creates/s, 122.04 writes/s
Buffer pool hit rate 1000 / 1000, young-making rate 0 / 1000 not 0 / 1000
Pages read ahead 0.00/s, evicted without access 0.00/s, Random read ahead
0.00/s
LRU len: 2821, unzip_LRU len: 0
I/O sum[0]:cur[0], unzip sum[0]:cur[0]
--------------
ROW OPERATIONS
--------------
0 queries inside InnoDB, 0 queries in queue
0 read views open inside InnoDB
Process ID=35909, Main thread ID=140471692396288, state: sleeping
Number of rows inserted 1526363, updated 0, deleted 3, read 11
52671.72 inserts/s, 0.00 updates/s, 0.00 deletes/s, 0.00 reads/s
----------------------------
END OF INNODB MONITOR OUTPUT
============================
```

#### Seções de Saída de Monitor Padrão

Para uma descrição de cada métrica relatada pelo Monitor Padrão, consulte o capítulo Métricos no Guia do Usuário do Oracle Enterprise Manager para Banco de Dados MySQL.

- `Status`

  Esta seção mostra o timestamp, o nome do monitor e o número de segundos com base nos quais as médias por segundo são calculadas. O número de segundos é o tempo decorrido entre a hora atual e a última vez que a saída do Monitor do InnoDB foi impressa.

- `CORRENTE DE FOCO`

  As linhas `srv_master_thread` mostram o trabalho realizado pelo principal thread de segundo plano.

- `SEMAPHORES`

  Esta seção relata os threads que estão aguardando um semaforo e estatísticas sobre quantas vezes os threads precisaram girar ou esperar em um semaforo de mutex ou de bloqueio de escrita/leitura. Um grande número de threads aguardando semaforos pode ser o resultado de I/O em disco ou problemas de concorrência dentro do `InnoDB`. A concorrência pode ser devido ao alto paralelismo das consultas ou a problemas na escalonagem de threads do sistema operacional. Definir a variável de sistema `innodb_thread_concurrency` menor que o valor padrão pode ajudar nessas situações. A linha `Rotas de giro por espera` mostra o número de rotações de spinlock por espera do sistema operacional em um mutex.

  As métricas do Mutex são relatadas pelo comando `SHOW ENGINE INNODB MUTEX`.

- `ERRO MAIS RECENTE DE CHAVE ESTÁVEL`

  Esta seção fornece informações sobre o erro mais recente de restrição de chave estrangeira. Não está presente se nenhum erro desse tipo ocorreu. O conteúdo inclui a declaração que falhou, bem como informações sobre a restrição que falhou e as tabelas referenciadas e referenciadoras.

- `DETERMINADO MAIS RECENTE DE BLOQUEIO`

  Esta seção fornece informações sobre o impasse mais recente. Não está presente se nenhum impasse ocorrer. O conteúdo mostra quais transações estão envolvidas, a declaração que cada uma estava tentando executar, os bloqueios que possuem e precisam e qual transação `InnoDB` decidiu reverter para quebrar o impasse. Os modos de bloqueio relatados nesta seção são explicados na Seção 14.7.1, “Bloqueio InnoDB”.

- `TRANSACOES`

  Se esta seção relatar espera de bloqueio, seus aplicativos podem estar enfrentando disputa de bloqueio. A saída também pode ajudar a identificar as razões para deadlocks de transações.

- `FILE I/O`

  Esta seção fornece informações sobre os threads que o `InnoDB` usa para realizar vários tipos de E/S. Os primeiros deles são dedicados ao processamento geral do `InnoDB`. O conteúdo também exibe informações sobre operações de E/S pendentes e estatísticas sobre o desempenho do E/S.

  O número desses threads é controlado pelos parâmetros `innodb_read_io_threads` e `innodb_write_io_threads`. Consulte a Seção 14.15, “Opções de inicialização do InnoDB e variáveis de sistema”.

- `INSERIR BUFFER E ÍNDICE HASH ADAPTATIVO`

  Esta seção mostra o status do buffer de inserção do InnoDB (também conhecido como buffer de alterações) e do índice de hash adaptativo.

  Para informações relacionadas, consulte a Seção 14.5.2, “Alterar Buffer”, e a Seção 14.5.3, “Índice Hash Adaptativo”.

- `LOG`

  Esta seção exibe informações sobre o log do `InnoDB`. Os conteúdos incluem o número atual da sequência do log, até onde o log foi descarregado no disco e a posição em que o `InnoDB` fez o último ponto de verificação. (Veja a Seção 14.12.3, “Pontos de Verificação do InnoDB”.) A seção também exibe informações sobre as escritas pendentes e as estatísticas de desempenho das escritas.

- `POOL DE BUFFER E MEMÓRIA`

  Esta seção fornece estatísticas sobre as páginas lidas e escritas. Você pode calcular, a partir desses números, quantas operações de E/S de arquivos suas consultas estão realizando atualmente.

  Para obter descrições das estatísticas do pool de tampão, consulte Monitoramento do Pool de Tampão Usando o Monitor Padrão InnoDB. Para obter informações adicionais sobre o funcionamento do pool de tampão, consulte a Seção 14.5.1, “Pool de Tampão”.

- `OPERACOES EM LINHAS`

  Esta seção mostra o que o fio principal está fazendo, incluindo o número e a taxa de desempenho para cada tipo de operação de linha.
