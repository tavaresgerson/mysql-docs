#### 16.1.7.2 Pausando a Replication na Replica

Você pode parar e iniciar a Replication na Replica usando as instruções [`STOP SLAVE`](stop-slave.html "13.4.2.6 STOP SLAVE Statement") e [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement").

Para interromper o processamento do Binary Log da Source, use [`STOP SLAVE`](stop-slave.html "13.4.2.6 STOP SLAVE Statement"):

```sql
mysql> STOP SLAVE;
```

Quando a Replication é interrompida, o Replication I/O Thread para de ler eventos do Binary Log da Source e de escrevê-los no Relay Log, e o Replication SQL Thread para de ler eventos do Relay Log e executá-los. Você pode pausar os Replication I/O e SQL Threads individualmente, especificando o tipo de Thread:

```sql
mysql> STOP SLAVE IO_THREAD;
mysql> STOP SLAVE SQL_THREAD;
```

Para iniciar a execução novamente, use a instrução [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement"):

```sql
mysql> START SLAVE;
```

Para iniciar um Thread específico, especifique o tipo de Thread:

```sql
mysql> START SLAVE IO_THREAD;
mysql> START SLAVE SQL_THREAD;
```

Para uma Replica que executa updates apenas processando eventos da Source, parar somente o Replication SQL Thread pode ser útil se você deseja realizar um backup ou outra tarefa. O Replication I/O Thread continua lendo eventos da Source, mas eles não são executados. Isso facilita que a Replica se atualize quando você reiniciar o Replication SQL Thread.

Parar apenas o Replication I/O Thread permite que os eventos no Relay Log sejam executados pelo Replication SQL Thread até o ponto onde o Relay Log termina. Isso pode ser útil quando você deseja pausar a execução para processar os eventos já recebidos da Source, quando você quer realizar a administração na Replica, mas também garantir que ela processou todos os updates até um ponto específico. Este método também pode ser usado para pausar o recebimento de eventos na Replica enquanto você conduz a administração na Source. Parar o I/O Thread, mas permitir que o SQL Thread continue em execução, ajuda a garantir que não haverá um *backlog* massivo de eventos a serem executados quando a Replication for iniciada novamente.