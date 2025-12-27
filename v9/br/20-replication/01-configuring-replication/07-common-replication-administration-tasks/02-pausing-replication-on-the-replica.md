#### 19.1.7.2 Pausar a replicação na réplica

Você pode parar e iniciar a replicação na réplica usando as instruções `STOP REPLICA` e `START REPLICA`.

Para interromper o processamento do log binário da fonte, use `STOP REPLICA`:

```
mysql> STOP REPLICA;
```

Quando a replicação é interrompida, o thread de I/O (receptor) para de ler eventos da fonte no log binário e de escrevê-los no log de retransmissão, e o thread SQL (aplicador) para de ler eventos do log de retransmissão e de executá-los. Você pode pausar o thread de I/O (receptor) ou SQL (aplicador) individualmente, especificando o tipo de thread:

```
mysql> STOP REPLICA IO_THREAD;
mysql> STOP REPLICA SQL_THREAD;
```

Para reiniciar a execução, use a instrução `START REPLICA`:

```
mysql> START REPLICA;
```

Para iniciar um thread específico, especifique o tipo de thread:

```
mysql> START REPLICA IO_THREAD;
mysql> START REPLICA SQL_THREAD;
```

Para uma réplica que realiza atualizações apenas processando eventos da fonte, interromper apenas o thread SQL pode ser útil se você quiser realizar uma cópia de segurança ou outra tarefa. O thread de I/O (receptor) continua a ler eventos da fonte, mas eles não são executados. Isso facilita para a réplica recuperar o ritmo quando você reiniciar o thread SQL (aplicador).

Interromper apenas o thread receptor permite que os eventos no log de retransmissão sejam executados pelo thread aplicador até o ponto em que o log de retransmissão termina. Isso pode ser útil quando você quiser pausar a execução para recuperar eventos já recebidos da fonte, quando você quiser realizar administração na réplica, mas também garantir que ela tenha processado todas as atualizações até um ponto específico. Esse método também pode ser usado para pausar a recepção de eventos na réplica enquanto você realiza administração na fonte. Interromper o thread receptor, mas permitir que o thread aplicador funcione, ajuda a garantir que não haja um grande acúmulo de eventos para serem executados quando a replicação for reiniciada.