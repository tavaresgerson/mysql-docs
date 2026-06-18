### 17.17.3 Monitor padrão InnoDB e Monitor de bloqueio de saída

O Monitor de Bloqueio é o mesmo que o Monitor Padrão, exceto que ele inclui informações adicionais sobre o bloqueio. Ativação de qualquer um dos monitores para saída periódica aciona o mesmo fluxo de saída, mas o fluxo inclui informações extras se o Monitor de Bloqueio estiver ativado. Por exemplo, se você ativar o Monitor Padrão e o Monitor de Bloqueio, isso aciona um único fluxo de saída. O fluxo inclui informações extras sobre o bloqueio até que você desative o Monitor de Bloqueio.

A saída padrão do monitor é limitada a 1 MB quando produzida usando a instrução `SHOW ENGINE INNODB STATUS`. Esse limite não se aplica à saída escrita na saída padrão de erro do servidor (`stderr`).

Exemplo de saída padrão do monitor:

```
mysql> SHOW ENGINE INNODB STATUS\G
*************************** 1. row ***************************
  Type: InnoDB
  Name:
Status:
=====================================
2018-04-12 15:14:08 0x7f971c063700 INNODB MONITOR OUTPUT
=====================================
Per second averages calculated from the last 4 seconds
-----------------
BACKGROUND THREAD
-----------------
srv_master_thread loops: 15 srv_active, 0 srv_shutdown, 1122 srv_idle
srv_master_thread log flush and writes: 0
----------
SEMAPHORES
----------
OS WAIT ARRAY INFO: reservation count 24
OS WAIT ARRAY INFO: signal count 24
RW-shared spins 4, rounds 8, OS waits 4
RW-excl spins 2, rounds 60, OS waits 2
RW-sx spins 0, rounds 0, OS waits 0
Spin rounds per wait: 2.00 RW-shared, 30.00 RW-excl, 0.00 RW-sx
------------------------
LATEST FOREIGN KEY ERROR
------------------------
2018-04-12 14:57:24 0x7f97a9c91700 Transaction:
TRANSACTION 7717, ACTIVE 0 sec inserting
mysql tables in use 1, locked 1
4 lock struct(s), heap size 1136, 3 row lock(s), undo log entries 3
MySQL thread id 8, OS thread handle 140289365317376, query id 14 localhost root update
INSERT INTO child VALUES (NULL, 1), (NULL, 2), (NULL, 3), (NULL, 4), (NULL, 5), (NULL, 6)
Foreign key constraint fails for table `test`.`child`:
,
  CONSTRAINT `child_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `parent` (`id`) ON DELETE
  CASCADE ON UPDATE CASCADE
Trying to add in child table, in index par_ind tuple:
DATA TUPLE: 2 fields;
 0: len 4; hex 80000003; asc     ;;
 1: len 4; hex 80000003; asc     ;;

But in parent table `test`.`parent`, in index PRIMARY,
the closest match we can find is record:
PHYSICAL RECORD: n_fields 3; compact format; info bits 0
 0: len 4; hex 80000004; asc     ;;
 1: len 6; hex 000000001e19; asc       ;;
 2: len 7; hex 81000001110137; asc       7;;

------------
TRANSACTIONS
------------
Trx id counter 7748
Purge done for trx's n:o < 7747 undo n:o < 0 state: running but idle
History list length 19
LIST OF TRANSACTIONS FOR EACH SESSION:
---TRANSACTION 421764459790000, not started
0 lock struct(s), heap size 1136, 0 row lock(s)
---TRANSACTION 7747, ACTIVE 23 sec starting index read
mysql tables in use 1, locked 1
LOCK WAIT 2 lock struct(s), heap size 1136, 1 row lock(s)
MySQL thread id 9, OS thread handle 140286987249408, query id 51 localhost root updating
DELETE FROM t WHERE i = 1
------- TRX HAS BEEN WAITING 23 SEC FOR THIS LOCK TO BE GRANTED:
RECORD LOCKS space id 4 page no 4 n bits 72 index GEN_CLUST_INDEX of table `test`.`t`
trx id 7747 lock_mode X waiting
Record lock, heap no 3 PHYSICAL RECORD: n_fields 4; compact format; info bits 0
 0: len 6; hex 000000000202; asc       ;;
 1: len 6; hex 000000001e41; asc      A;;
 2: len 7; hex 820000008b0110; asc        ;;
 3: len 4; hex 80000001; asc     ;;

------------------
TABLE LOCK table `test`.`t` trx id 7747 lock mode IX
RECORD LOCKS space id 4 page no 4 n bits 72 index GEN_CLUST_INDEX of table `test`.`t`
trx id 7747 lock_mode X waiting
Record lock, heap no 3 PHYSICAL RECORD: n_fields 4; compact format; info bits 0
 0: len 6; hex 000000000202; asc       ;;
 1: len 6; hex 000000001e41; asc      A;;
 2: len 7; hex 820000008b0110; asc        ;;
 3: len 4; hex 80000001; asc     ;;

--------
FILE I/O
--------
I/O thread 0 state: waiting for i/o request (insert buffer thread)
I/O thread 1 state: waiting for i/o request (log thread)
I/O thread 2 state: waiting for i/o request (read thread)
I/O thread 3 state: waiting for i/o request (read thread)
I/O thread 4 state: waiting for i/o request (read thread)
I/O thread 5 state: waiting for i/o request (read thread)
I/O thread 6 state: waiting for i/o request (write thread)
I/O thread 7 state: waiting for i/o request (write thread)
I/O thread 8 state: waiting for i/o request (write thread)
I/O thread 9 state: waiting for i/o request (write thread)
Pending normal aio reads: [0, 0, 0, 0] , aio writes: [0, 0, 0, 0] ,
 ibuf aio reads:, log i/o's:, sync i/o's:
Pending flushes (fsync) log: 0; buffer pool: 0
833 OS file reads, 605 OS file writes, 208 OS fsyncs
0.00 reads/s, 0 avg bytes/read, 0.00 writes/s, 0.00 fsyncs/s
-------------------------------------
INSERT BUFFER AND ADAPTIVE HASH INDEX
-------------------------------------
Ibuf: size 1, free list len 0, seg size 2, 0 merges
merged operations:
 insert 0, delete mark 0, delete 0
discarded operations:
 insert 0, delete mark 0, delete 0
Hash table size 553253, node heap has 0 buffer(s)
Hash table size 553253, node heap has 1 buffer(s)
Hash table size 553253, node heap has 3 buffer(s)
Hash table size 553253, node heap has 0 buffer(s)
Hash table size 553253, node heap has 0 buffer(s)
Hash table size 553253, node heap has 0 buffer(s)
Hash table size 553253, node heap has 0 buffer(s)
Hash table size 553253, node heap has 0 buffer(s)
0.00 hash searches/s, 0.00 non-hash searches/s
---
LOG
---
Log sequence number          19643450
Log buffer assigned up to    19643450
Log buffer completed up to   19643450
Log written up to            19643450
Log flushed up to            19643450
Added dirty pages up to      19643450
Pages flushed up to          19643450
Last checkpoint at           19643450
129 log i/o's done, 0.00 log i/o's/second
----------------------
BUFFER POOL AND MEMORY
----------------------
Total large memory allocated 2198863872
Dictionary memory allocated 409606
Buffer pool size   131072
Free buffers       130095
Database pages     973
Old database pages 0
Modified db pages  0
Pending reads      0
Pending writes: LRU 0, flush list 0, single page 0
Pages made young 0, not young 0
0.00 youngs/s, 0.00 non-youngs/s
Pages read 810, created 163, written 404
0.00 reads/s, 0.00 creates/s, 0.00 writes/s
Buffer pool hit rate 1000 / 1000, young-making rate 0 / 1000 not 0 / 1000
Pages read ahead 0.00/s, evicted without access 0.00/s, Random read ahead 0.00/s
LRU len: 973, unzip_LRU len: 0
I/O sum[0]:cur[0], unzip sum[0]:cur[0]
----------------------
INDIVIDUAL BUFFER POOL INFO
----------------------
---BUFFER POOL 0
Buffer pool size   65536
Free buffers       65043
Database pages     491
Old database pages 0
Modified db pages  0
Pending reads      0
Pending writes: LRU 0, flush list 0, single page 0
Pages made young 0, not young 0
0.00 youngs/s, 0.00 non-youngs/s
Pages read 411, created 80, written 210
0.00 reads/s, 0.00 creates/s, 0.00 writes/s
Buffer pool hit rate 1000 / 1000, young-making rate 0 / 1000 not 0 / 1000
Pages read ahead 0.00/s, evicted without access 0.00/s, Random read ahead 0.00/s
LRU len: 491, unzip_LRU len: 0
I/O sum[0]:cur[0], unzip sum[0]:cur[0]
---BUFFER POOL 1
Buffer pool size   65536
Free buffers       65052
Database pages     482
Old database pages 0
Modified db pages  0
Pending reads      0
Pending writes: LRU 0, flush list 0, single page 0
Pages made young 0, not young 0
0.00 youngs/s, 0.00 non-youngs/s
Pages read 399, created 83, written 194
0.00 reads/s, 0.00 creates/s, 0.00 writes/s
No buffer pool page gets since the last printout
Pages read ahead 0.00/s, evicted without access 0.00/s, Random read ahead 0.00/s
LRU len: 482, unzip_LRU len: 0
I/O sum[0]:cur[0], unzip sum[0]:cur[0]
--------------
ROW OPERATIONS
--------------
0 queries inside InnoDB, 0 queries in queue
0 read views open inside InnoDB
Process ID=5772, Main thread ID=140286437054208 , state=sleeping
Number of rows inserted 57, updated 354, deleted 4, read 4421
0.00 inserts/s, 0.00 updates/s, 0.00 deletes/s, 0.00 reads/s
----------------------------
END OF INNODB MONITOR OUTPUT
============================
```

#### Seções de Saída de Monitor Padrão

Para uma descrição de cada métrica relatada pelo Monitor Padrão, consulte o capítulo Métricos no Guia do Usuário do Oracle Enterprise Manager para Banco de Dados MySQL.

- `Status`

  Esta seção mostra o timestamp, o nome do monitor e o número de segundos com base nos quais as médias por segundo são calculadas. O número de segundos é o tempo decorrido entre a hora atual e a última vez que a saída do Monitor `InnoDB` foi impressa.

- `BACKGROUND THREAD`

  As linhas `srv_master_thread` mostram o trabalho realizado pela principal thread de fundo.

- `SEMAPHORES`

  Esta seção relata os threads que estão aguardando um semaforo e estatísticas sobre quantas vezes os threads precisaram fazer um spin ou esperar por um mutex ou um semaforo de bloqueio de leitura/escrita. Um grande número de threads aguardando semaforos pode ser o resultado de I/O de disco ou problemas de concorrência dentro de `InnoDB`. A concorrência pode ser devido ao alto paralelismo das consultas ou a problemas na escalonagem de threads do sistema operacional. Definir a variável de sistema `innodb_thread_concurrency` menor que o valor padrão pode ajudar nessas situações. A linha `Spin rounds per wait` mostra o número de rodadas de spinlock por espera do sistema operacional por um mutex.

  As métricas do Mutex são relatadas pelo `SHOW ENGINE INNODB MUTEX`.

- `LATEST FOREIGN KEY ERROR`

  Esta seção fornece informações sobre o erro mais recente de restrição de chave estrangeira. Não está presente se nenhum erro desse tipo ocorreu. O conteúdo inclui a declaração que falhou, bem como informações sobre a restrição que falhou e as tabelas referenciadas e referenciadoras.

- `LATEST DETECTED DEADLOCK`

  Esta seção fornece informações sobre o último impasse. Não está presente se nenhum impasse ocorrer. O conteúdo mostra quais transações estão envolvidas, a declaração que cada uma estava tentando executar, os bloqueios que possuem e precisam, e qual transação `InnoDB` decidiu reverter para quebrar o impasse. Os modos de bloqueio relatados nesta seção são explicados na Seção 17.7.1, “Bloqueio InnoDB”.

- `TRANSACTIONS`

  Se esta seção relatar espera de bloqueio, seus aplicativos podem estar enfrentando disputa de bloqueio. A saída também pode ajudar a identificar as razões para deadlocks de transações.

- `FILE I/O`

  Esta seção fornece informações sobre os threads que o `InnoDB` usa para realizar vários tipos de E/S. Os primeiros deles são dedicados ao processamento geral do `InnoDB`. Os conteúdos também exibem informações sobre operações de E/S pendentes e estatísticas sobre o desempenho do E/S.

  O número desses fios é controlado pelos parâmetros `innodb_read_io_threads` e `innodb_write_io_threads`. Veja a Seção 17.14, “Opções de Inicialização do InnoDB e Variáveis de Sistema”.

- `INSERT BUFFER AND ADAPTIVE HASH INDEX`

  Esta seção mostra o status do buffer de inserção `InnoDB` (também conhecido como buffer de alterações) e do índice de hash adaptativo.

  Para informações relacionadas, consulte a Seção 17.5.2, “Alterar Buffer”, e a Seção 17.5.3, “Índice Hash Adaptativo”.

- `LOG`

  Esta seção exibe informações sobre o log `InnoDB`. Os conteúdos incluem o número atual da sequência do log, até onde o log foi descarregado no disco e a posição em que o `InnoDB` fez o último ponto de verificação. (Veja a Seção 17.11.3, “Pontos de Verificação do InnoDB”.) A seção também exibe informações sobre as escritas pendentes e as estatísticas de desempenho das escritas.

- `BUFFER POOL AND MEMORY`

  Esta seção fornece estatísticas sobre as páginas lidas e escritas. Você pode calcular, a partir desses números, quantas operações de E/S de arquivos suas consultas estão realizando atualmente.

  Para obter descrições das estatísticas do pool de tampão, consulte Monitoramento do Pool de Tampão Usando o Monitor Padrão InnoDB. Para obter informações adicionais sobre o funcionamento do pool de tampão, consulte a Seção 17.5.1, “Pool de Tampão”.

- `ROW OPERATIONS`

  Esta seção mostra o que o fio principal está fazendo, incluindo o número e a taxa de desempenho para cada tipo de operação de linha.
