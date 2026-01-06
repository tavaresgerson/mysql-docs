## 8.14 Análise das informações do fio (processo) do servidor

8.14.1 Acessar a Lista de Processos

8.14.2 Valores dos comandos de fio

8.14.3 Estados gerais de fios

8.14.4 Estados de threads do cache de consultas

8.14.5 Estados de fios de origem de replicação

8.14.6 Estados de Threads de E/S de Replicação

8.14.7 Replicação Estados de Fila de Tarefas SQL do Replicando

8.14.8 Replicação Estados de Conexão de Fila de Conexão da Replica

8.14.9 Estados de fios de clúster do NDB

8.14.10 Estados de threads do Agendamento de Eventos

Para verificar o que seu servidor MySQL está fazendo, pode ser útil examinar a lista de processos, que indica as operações atualmente sendo realizadas pelo conjunto de threads que estão executando dentro do servidor. Por exemplo:

```sql
mysql> SHOW PROCESSLIST\G
*************************** 1. row ***************************
     Id: 1
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

Os threads podem ser interrompidos com a instrução `KILL`. Consulte a Seção 13.7.6.4, “Instrução KILL”.
