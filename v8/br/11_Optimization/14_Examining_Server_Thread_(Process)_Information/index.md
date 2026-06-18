## 10.14 Análise das informações do fio (processo) do servidor

10.14.1 Acessar a Lista de Processos

10.14.2 Valores dos comandos de fio

10.14.3 Estados gerais de fios

10.14.4 Estados de fios de origem de replicação

10.14.5 Estados de threads de I/O de replicação (receptor)

10.14.6 Estados de fila de threads de replicação SQL

10.14.7 Estados de conexão de replicação do fio

10.14.8 Estados de fio do cluster do NDB

10.14.9 Estados de Threads do Agendamento de Eventos

Para verificar o que seu servidor MySQL está fazendo, pode ser útil examinar a lista de processos, que indica as operações atualmente sendo realizadas pelo conjunto de threads que estão executando dentro do servidor. Por exemplo:

```
mysql> SHOW PROCESSLIST\G
*************************** 1. row ***************************
     Id: 5
   User: event_scheduler
   Host: localhost
     db: NULL
Command: Daemon
   Time: 2756681
  State: Waiting on empty queue
   Info: NULL
*************************** 2. row ***************************
     Id: 20
   User: me
   Host: localhost:52943
     db: test
Command: Query
   Time: 0
  State: starting
   Info: SHOW PROCESSLIST
```

Os threads podem ser interrompidos com a instrução `KILL`. Veja a Seção 15.7.8.4, “Instrução KILL”.
