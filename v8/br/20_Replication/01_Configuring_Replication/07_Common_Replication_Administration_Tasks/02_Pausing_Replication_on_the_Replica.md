#### 19.1.7.2 Pausar a replicação na réplica

Você pode parar e iniciar a replicação na replica usando as instruções `STOP REPLICA` e `START REPLICA`. A partir do MySQL 8.0.22, `STOP SLAVE` e `START SLAVE` são desaconselhadas e `STOP REPLICA` e `START REPLICA` estão disponíveis para uso.

Para interromper o processamento do log binário da fonte, use `STOP REPLICA`:

```
mysql> STOP SLAVE;
Or from MySQL 8.0.22:
mysql> STOP REPLICA;
```

Quando a replicação é interrompida, o thread de I/O de recepção (receptor) para de ler eventos do log binário de origem e de escrevê-los no log de retransmissão, e o thread SQL para de ler eventos do log de retransmissão e de executá-los. Você pode pausar o thread de I/O (receptor) ou SQL (aplicador) individualmente, especificando o tipo de thread:

```
mysql> STOP SLAVE IO_THREAD;
mysql> STOP SLAVE SQL_THREAD;
Or from MySQL 8.0.22:
mysql> STOP REPLICA IO_THREAD;
mysql> STOP REPLICA SQL_THREAD;
```

Para reiniciar a execução, use a instrução `START REPLICA`:

```
mysql> START SLAVE;
Or from MySQL 8.0.22:
mysql> START REPLICA;
```

Para iniciar um tópico específico, especifique o tipo de tópico:

```
mysql> START SLAVE IO_THREAD;
mysql> START SLAVE SQL_THREAD;
Or from MySQL 8.0.22:
mysql> START REPLICA IO_THREAD;
mysql> START REPLICA SQL_THREAD;
```

Para uma replica que realiza atualizações apenas processando eventos da fonte, interromper apenas o fio de SQL pode ser útil se você quiser realizar um backup ou outra tarefa. O fio de I/O (receptor) continua lendo eventos da fonte, mas eles não são executados. Isso facilita para a replica se atualizar quando você reiniciar o fio de SQL (aplicador).

Parar apenas o fio do receptor permite que os eventos no log do retransmissor sejam executados pelo fio do aplicável até o ponto em que o log do retransmissor termina. Isso pode ser útil quando você deseja pausar a execução para recuperar eventos já recebidos da fonte, quando deseja realizar administração na replica, mas também garantir que ela tenha processado todas as atualizações até um ponto específico. Esse método também pode ser usado para pausar a recepção de eventos na replica enquanto você realiza a administração na fonte. Parar o fio do receptor, mas permitir que o fio do aplicável continue funcionando, ajuda a garantir que não haja um grande acúmulo de eventos a serem executados quando a replicação for reiniciada.
