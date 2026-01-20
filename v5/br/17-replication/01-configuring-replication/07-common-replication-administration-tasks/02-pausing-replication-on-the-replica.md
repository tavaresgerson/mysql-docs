#### 16.1.7.2 Pausar a replicação na réplica

Você pode parar e iniciar a replicação na replica usando as instruções `STOP SLAVE` e `START SLAVE`.

Para interromper o processamento do log binário da fonte, use `STOP SLAVE`:

```sql
mysql> STOP SLAVE;
```

Quando a replicação é interrompida, o thread de E/S de replicação para de ler eventos do log binário da fonte e de escrevê-los no log de retransmissão, e o thread de SQL de replicação para de ler eventos do log de retransmissão e de executá-los. Você pode pausar os fios de E/S e SQL de replicação individualmente, especificando o tipo de thread:

```sql
mysql> STOP SLAVE IO_THREAD;
mysql> STOP SLAVE SQL_THREAD;
```

Para reiniciar a execução, use a instrução `START SLAVE`:

```sql
mysql> START SLAVE;
```

Para iniciar um tópico específico, especifique o tipo de tópico:

```sql
mysql> START SLAVE IO_THREAD;
mysql> START SLAVE SQL_THREAD;
```

Para uma replica que realiza atualizações apenas processando eventos da fonte, interromper apenas o thread de replicação SQL pode ser útil se você quiser realizar um backup ou outra tarefa. O thread de I/O de replicação continua lendo eventos da fonte, mas eles não são executados. Isso facilita para a replica se atualizar quando você reiniciar o thread de replicação SQL.

Parar apenas a thread de I/O de replicação permite que os eventos no log de retransmissão sejam executados pela thread SQL de replicação até o ponto em que o log de retransmissão termina. Isso pode ser útil quando você deseja pausar a execução para recuperar eventos já recebidos da fonte, quando deseja realizar administração na replica, mas também garantir que ela tenha processado todas as atualizações até um ponto específico. Esse método também pode ser usado para pausar a recepção de eventos na replica enquanto você realiza a administração na fonte. Parar a thread de I/O, mas permitir que a thread SQL continue funcionando, ajuda a garantir que não haja um grande acúmulo de eventos a serem executados quando a replicação for reiniciada.
