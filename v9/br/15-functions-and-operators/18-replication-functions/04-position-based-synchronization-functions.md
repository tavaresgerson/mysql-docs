### 14.18.4 Funções de Sincronização Baseada em Posição

As funções listadas nesta seção são usadas para controlar a sincronização baseada em posição de servidores de origem e réplicas no MySQL Replication.

**Tabela 14.28 Funções de Sincronização Posicional**

<table frame="box" rules="all" summary="Uma referência que lista funções usadas com sincronização baseada em posição de servidores de origem e réplicas de replicação."><col style="width: 25%"/><col style="width: 62%"/><col style="width: 12%"/><thead><tr><th>Nome</th> <th>Descrição</th> <th>Desatualizado</th> </tr></thead><tbody><tr><th><a class="link" href="replication-functions-synchronization.html#function_master-pos-wait"><code>MASTER_POS_WAIT()</code></a></th> <td> Bloqueie até que a réplica tenha lido e aplicado todas as atualizações até a posição especificada </td> <td>Sim</td> </tr><tr><th><a class="link" href="replication-functions-synchronization.html#function_source-pos-wait"><code>SOURCE_POS_WAIT()</code></a></th> <td> Bloqueie até que a réplica tenha lido e aplicado todas as atualizações até a posição especificada </td> <td></td> </tr></tbody></table>

* `MASTER_POS_WAIT(log_name,log_pos[,timeout][,channel])`

  Alias desatualizado para `SOURCE_POS_WAIT()`.

* `SOURCE_POS_WAIT(log_name,log_pos[,timeout][,channel])`

  Esta função é para controle da sincronização de origem-réplica. Ela bloqueia até que a réplica tenha lido e aplicado todas as atualizações até a posição especificada no log binário da origem.

O valor de retorno é o número de eventos de log que a replica teve que esperar para avançar para a posição especificada. A função retorna `NULL` se o thread SQL de replicação não for iniciado, as informações de origem da replica não forem inicializadas, os argumentos estiverem incorretos ou ocorrer um erro. Ela retorna `-1` se o tempo limite for excedido. Se o thread SQL de replicação parar enquanto a `SOURCE_POS_WAIT()` estiver esperando, a função retorna `NULL`. Se a replica estiver além da posição especificada, a função retorna imediatamente.

Se a posição do arquivo de log binário for marcada como inválida, a função aguarda até que uma posição de arquivo válida seja conhecida. A posição do arquivo de log binário pode ser marcada como inválida quando a opção `GTID_ONLY` para o canal de replicação é definida e o servidor é reiniciado ou a replicação é interrompida. A posição do arquivo torna-se válida após uma transação ser aplicada com sucesso além da posição de arquivo especificada. Se o aplicador não alcançar a posição declarada, a função aguarda até o tempo limite. Use uma declaração `SHOW REPLICA STATUS` para verificar se a posição do arquivo de log binário foi marcada como inválida.

Em uma replica multithread, a função aguarda até o vencimento do limite definido pela variável de sistema `replica_checkpoint_group` ou `replica_checkpoint_period`, quando a operação de checkpoint é chamada para atualizar o status da replica. Dependendo da configuração das variáveis de sistema, a função pode, portanto, retornar algum tempo após a posição especificada ter sido alcançada.

Se a compressão de transações de log binário estiver em uso e o payload da transação na posição especificada estiver comprimido (como um `Transaction_payload_event`), a função aguarda até que toda a transação seja lida e aplicada, e as posições sejam atualizadas.

Se um valor de *`timeout`* for especificado, o `SOURCE_POS_WAIT()` para de esperar quando *`timeout`* segundos tiverem decorrido. *`timeout`* deve ser maior ou igual a 0. (Quando o servidor estiver em modo SQL rigoroso, um valor de *`timeout`* negativo é rejeitado imediatamente com `ER_WRONG_ARGUMENTS`; caso contrário, a função retorna `NULL` e emite uma mensagem de aviso.)

O valor opcional *`channel`* permite que você nomeie qual canal de replicação a função aplica. Consulte a Seção 19.2.2, “Canais de Replicação”, para obter mais informações.

Esta função não é segura para a replicação baseada em instruções. Um aviso é registrado se você usar esta função quando o `binlog_format` estiver definido como `STATEMENT`.