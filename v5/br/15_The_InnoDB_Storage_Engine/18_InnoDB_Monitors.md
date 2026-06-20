## 14.18 Monitoramento do InnoDB

Os monitores `InnoDB` fornecem informações sobre o estado interno do `InnoDB`. Essas informações são úteis para o ajuste de desempenho.

### 14.18.1 Tipos de Monitor InnoDB

Existem dois tipos de monitor `InnoDB`:

* O monitor padrão `InnoDB` exibe os seguintes tipos de informações:

+ Trabalho realizado pelo principal fio de fundo
  + Espera de semaforo
  + Dados sobre a chave estrangeira mais recente e erros de bloqueio
  + Espera de bloqueio para transações
  + Blocos de tabela e registro mantidos por transações ativas
  + Operações de pendência de E/S e estatísticas relacionadas
  + Estatísticas do buffer de inserção e índice de hash adaptativo
  + Dados do log de refazer
  + Estatísticas do pool de buffer
  + Dados de operação de linha * O `InnoDB` Lock Monitor imprime informações adicionais de bloqueio como parte da saída padrão do monitor `InnoDB`.

### 14.18.2 Habilitar monitores InnoDB

Quando os monitores `InnoDB` estão habilitados para saída periódica, o `InnoDB` escreve a saída no padrão de saída de erro do servidor `mysqld` (`stderr`) a cada 15 segundos, aproximadamente.

`InnoDB` envia a saída do monitor para `stderr` em vez de para `stdout` ou buffers de memória de tamanho fixo para evitar possíveis transbordamentos de buffer.

Em Windows, `stderr` é direcionado para o arquivo de registro padrão, a menos que seja configurado de outra forma. Se você deseja direcionar a saída para a janela de console em vez do registro de erro, inicie o servidor a partir de uma janela de prompt de comando em uma janela de console com a opção `--console`. Para mais informações, consulte a Seção 5.4.2.1, “Registro de Erros em Windows”.

Em sistemas Unix e Unix-like, `stderr` é normalmente direcionado para o terminal, a menos que seja configurado de outra forma. Para mais informações, consulte a Seção 5.4.2.2, “Registro de erros em sistemas Unix e Unix-like”.

Os monitores `InnoDB` só devem ser habilitados quando você realmente deseja ver as informações do monitor, pois a geração de saída causa uma certa redução de desempenho. Além disso, se a saída do monitor for direcionada ao log de erro, o log pode se tornar bastante grande se você esquecer de desabilitar o monitor mais tarde.

Nota

Para auxiliar na solução de problemas, o `InnoDB` habilita temporariamente a saída padrão do Monitor `InnoDB` sob certas condições. Para mais informações, consulte a Seção 14.22, “Solução de problemas do InnoDB”.

A saída do monitor `InnoDB` começa com um cabeçalho que contém um timestamp e o nome do monitor. Por exemplo:

```sql
=====================================
2014-10-16 18:37:29 0x7fc2a95c1700 INNODB MONITOR OUTPUT
=====================================
```

O cabeçalho do monitor padrão `InnoDB` (`INNODB MONITOR OUTPUT`) também é usado para o monitor de bloqueio, porque este último produz a mesma saída com a adição de informações adicionais sobre bloqueio.

As variáveis de sistema `innodb_status_output` e `innodb_status_output_locks` são usadas para habilitar o monitor padrão `InnoDB` e o monitor de bloqueio `InnoDB`.

O privilégio `PROCESS` é necessário para habilitar ou desabilitar os monitores `InnoDB`.

#### Habilitando o Monitor padrão InnoDB

Ative o monitor padrão `InnoDB` definindo a variável de sistema `innodb_status_output` como `ON`.

```sql
SET GLOBAL innodb_status_output=ON;
```

Para desabilitar o monitor padrão `InnoDB`, defina `innodb_status_output` como `OFF`.

Quando você desativa o servidor, a variável `innodb_status_output` é definida com o valor padrão de `OFF`.

#### Habilitando o Monitor de Bloqueio InnoDB

Os dados do Monitor de bloqueio são impressos com a saída do Monitor Padrão `InnoDB`. Tanto o Monitor Padrão `InnoDB` quanto o Monitor de bloqueio `InnoDB` devem estar habilitados para que os dados do Monitor de bloqueio `InnoDB` sejam impressos periodicamente.

Para habilitar o Monitor de bloqueio `InnoDB`, defina a variável de sistema `innodb_status_output_locks` para `ON`. Ambos os monitores padrão `InnoDB` e Monitor de bloqueio `InnoDB` devem ser habilitados para que os dados do Monitor de bloqueio `InnoDB` sejam impressos periodicamente:

```sql
SET GLOBAL innodb_status_output=ON;
SET GLOBAL innodb_status_output_locks=ON;
```

Para desativar o Monitor de bloqueio `InnoDB`, defina `innodb_status_output_locks` como `OFF`. Defina `innodb_status_output` como `OFF` para desativar também o Monitor Padrão `InnoDB`.

Quando você desativa o servidor, as variáveis `innodb_status_output` e `innodb_status_output_locks` são definidas com o valor padrão de `OFF`.

Nota

Para habilitar o Monitor de bloqueio `InnoDB` para a saída `SHOW ENGINE INNODB STATUS`, você só precisa habilitar o `innodb_status_output_locks`.

#### Obter a saída padrão do Monitor InnoDB sob demanda

Como alternativa para habilitar o monitor padrão `InnoDB` para saída periódica, você pode obter a saída padrão do monitor `InnoDB` sob demanda usando a instrução SQL `SHOW ENGINE INNODB STATUS`, que recupera a saída para seu programa cliente. Se você estiver usando o cliente interativo **mysql**, a saída será mais legível se você substituir o usual terminator de sentença sem ponto e vírgula com `\G`:

```sql
mysql> SHOW ENGINE INNODB STATUS\G
```

A saída `SHOW ENGINE INNODB STATUS` também inclui os dados do Monitor de bloqueio `InnoDB`, se o Monitor de bloqueio `InnoDB` estiver habilitado.

#### Direcionando a saída padrão do monitor InnoDB para um arquivo de status

A saída do monitor padrão `InnoDB` pode ser habilitada e direcionada a um arquivo de status, especificando a opção `--innodb-status-file` no início. Quando esta opção é usada, `InnoDB` cria um arquivo chamado `innodb_status.pid` no diretório de dados e escreve a saída nele a cada 15 segundos, aproximadamente.

`InnoDB` remove o arquivo de status quando o servidor é desligado normalmente. Se ocorrer um desligamento anormal, o arquivo de status pode ter que ser removido manualmente.

A opção `--innodb-status-file` é destinada ao uso temporário, pois a geração de saída pode afetar o desempenho, e o arquivo `innodb_status.pid` pode se tornar bastante grande com o tempo.

### 14.18.3 Saída do Monitor Padrão InnoDB e do Monitor de Acionamento de Bloqueio

O Monitor de bloqueio é o mesmo que o Monitor Padrão, exceto que ele inclui informações adicionais sobre bloqueio. Ativação de qualquer um dos monitores para saída periódica aciona o mesmo fluxo de saída, mas o fluxo inclui informações extras se o Monitor de bloqueio estiver ativado. Por exemplo, se você ativar o Monitor Padrão e o Monitor de bloqueio, isso ativa um único fluxo de saída. O fluxo inclui informações extras sobre bloqueio até que você desative o Monitor de bloqueio.

A saída padrão do monitor é limitada a 1 MB quando produzida usando a declaração `SHOW ENGINE INNODB STATUS`. Esse limite não se aplica à saída escrita na saída padrão de erro do tserver (`stderr`).

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

#### Seções de saída padrão do monitor

Para uma descrição de cada métrica relatada pelo Monitor Padrão, consulte o capítulo Metricas no Guia do Usuário do Oracle Enterprise Manager para Banco de Dados MySQL.

* `Status`

Esta seção mostra o timestamp, o nome do monitor e o número de segundos com base nos promedios por segundo. O número de segundos é o tempo decorrido entre a hora atual e a última vez que a saída do Monitor `InnoDB` foi impressa.

* `BACKGROUND THREAD`

As linhas `srv_master_thread` mostram o trabalho realizado pelo fio de fundo principal.

* `SEMAPHORES`

Esta seção relata os fios que estão aguardando um semaforo e as estatísticas sobre quantas vezes os fios precisaram de um giro ou uma espera em um semaforo de mutex ou de bloqueio de leitura/escrita. Um grande número de fios aguardando semaforos pode ser o resultado de I/O de disco ou problemas de concorrência dentro de `InnoDB`. A concorrência pode ser devido ao paralelismo pesado de consultas ou problemas na programação de threads do sistema operacional. Definir a variável de sistema `innodb_thread_concurrency` menor que o valor padrão pode ajudar em tais situações. A linha `Spin rounds per wait` mostra o número de rodadas de giro por espera do sistema operacional em um mutex.

As métricas de mutex são relatadas por `SHOW ENGINE INNODB MUTEX`.

* `LATEST FOREIGN KEY ERROR`

Esta seção fornece informações sobre o erro mais recente da restrição de chave estrangeira. Não está presente se nenhum erro desse tipo ocorreu. O conteúdo inclui a declaração que falhou, bem como informações sobre a restrição que falhou e as tabelas referenciadas e as tabelas de referência.

* `LATEST DETECTED DEADLOCK`

Esta seção fornece informações sobre o último ponto morto. Não está presente se nenhum ponto morto tiver ocorrido. O conteúdo mostra quais transações estão envolvidas, a declaração que cada uma estava tentando executar, os bloqueios que eles têm e precisam, e qual transação `InnoDB` decidiu voltar atrás para quebrar o ponto morto. Os modos de bloqueio relatados nesta seção são explicados na Seção 14.7.1, “Bloqueio InnoDB”.

* `TRANSACTIONS`

Se esta seção relatar espera de bloqueio, suas aplicações podem ter disputa de bloqueio. A saída também pode ajudar a rastrear as razões para deadlocks de transação.

* `FILE I/O`

Esta seção fornece informações sobre os threads que o `InnoDB` utiliza para realizar vários tipos de I/O. Os primeiros deles são dedicados ao processamento geral do `InnoDB`. O conteúdo também exibe informações para operações de I/O pendentes e estatísticas para o desempenho do I/O.

O número desses fios é controlado pelos parâmetros `innodb_read_io_threads` e `innodb_write_io_threads`. Veja a Seção 14.15, “Opções de inicialização do InnoDB e variáveis do sistema”.

* `INSERT BUFFER AND ADAPTIVE HASH INDEX`

Esta seção mostra o status do buffer de inserção `InnoDB` (também referido como buffer de mudança) e o índice de hash adaptativo.

Para informações relacionadas, consulte a Seção 14.5.2, “Altere o buffer”, e a Seção 14.5.3, “Índice de hash adaptável”.

* `LOG`

Esta seção exibe informações sobre o log `InnoDB`. O conteúdo inclui o número atual da sequência do log, a distância em que o log foi descarregado no disco e a posição na qual o `InnoDB` fez o último ponto de verificação. (Veja a Seção 14.12.3, “Pontos de verificação InnoDB”.) A seção também exibe informações sobre as escritas pendentes e as estatísticas de desempenho das escritas.

* `BUFFER POOL AND MEMORY`

Esta seção fornece estatísticas sobre páginas lidas e escritas. Você pode calcular a partir desses números quantas operações de E/S de arquivo seus pedidos estão realizando atualmente.

Para descrições das estatísticas do buffer pool, consulte o Monitoramento do buffer pool usando o Monitor padrão InnoDB. Para informações adicionais sobre o funcionamento do buffer pool, consulte a Seção 14.5.1, “Buffer Pool”.

* `ROW OPERATIONS`

Esta seção mostra o que o fio principal está fazendo, incluindo o número e a taxa de desempenho para cada tipo de operação de linha.