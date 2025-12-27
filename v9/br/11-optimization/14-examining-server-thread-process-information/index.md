## 10.14 Analisando Informações de Fuso de Servidor (Processo)

10.14.1 Acessando a Lista de Processos

10.14.2 Valores de Comando de Fuso

10.14.3 Estados Gerais de Fuso

10.14.4 Estados de Fuso de Fonte de Replicação

10.14.5 Estados de Fuso de E/S (Receptor) de Replicação

10.14.6 Estados de Fuso de SQL de Replicação

10.14.7 Estados de Fuso de Conexão de Replicação

10.14.8 Estados de Fuso do NDB Cluster

10.14.9 Estados de Fuso do Agendamento de Eventos

Para verificar o que seu servidor MySQL está fazendo, pode ser útil examinar a lista de processos, que indica as operações atualmente sendo realizadas pelo conjunto de fuso que está executando dentro do servidor. Por exemplo:

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

Os fusos podem ser interrompidos com a instrução `KILL`. Consulte a Seção 15.7.8.4, “Instrução KILL”.