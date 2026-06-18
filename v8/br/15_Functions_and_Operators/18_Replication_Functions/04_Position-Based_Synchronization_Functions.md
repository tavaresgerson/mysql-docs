### 14.18.4 Funções de sincronização baseadas em posição

As funções listadas nesta seção são usadas para controlar a sincronização baseada em posição de servidores de origem e réplica no MySQL Replication.

**Tabela 14.28 Funções de Sincronização Posicional**

<table summary="Uma referência que lista as funções usadas com sincronização baseada em posição da fonte de replicação e dos servidores de réplica."><thead><tr><th>Nome</th> <th>Descrição</th> <th>Introduzido</th> <th>Desatualizado</th> </tr></thead><tbody><tr><th>[[<code>MASTER_POS_WAIT()</code>]]</th> <td>Bloquear até que a réplica tenha lido e aplicado todas as atualizações até a posição especificada</td> <td></td> <td>8.0.26</td> </tr><tr><th>[[<code>SOURCE_POS_WAIT()</code>]]</th> <td>Bloquear até que a réplica tenha lido e aplicado todas as atualizações até a posição especificada</td> <td>8.0.26</td> <td></td> </tr></tbody></table>

- `MASTER_POS_WAIT(log_name,log_pos[,timeout][,channel])`

  Esta função é para o controle da sincronização de fonte-replica. Ela bloqueia até que a replica tenha lido e aplicado todas as atualizações até a posição especificada no log binário da fonte. A partir do MySQL 8.0.26, `MASTER_POS_WAIT()` é desatualizado e o alias `SOURCE_POS_WAIT()` deve ser usado em vez disso. Em versões anteriores ao MySQL 8.0.26, use `MASTER_POS_WAIT()`.

  O valor de retorno é o número de eventos de log que a replica teve que esperar para avançar para a posição especificada. A função retorna `NULL` se o thread de SQL de replicação não for iniciado, as informações de origem da replica não forem inicializadas, os argumentos estiverem incorretos ou ocorrer um erro. Ela retorna `-1` se o tempo limite for excedido. Se o thread de SQL de replicação parar enquanto a replica estiver esperando por `MASTER_POS_WAIT()`, a função retorna `NULL`. Se a replica estiver além da posição especificada, a função retorna imediatamente.

  Se a posição do arquivo de log binário tiver sido marcada como inválida, a função aguarda até que uma posição de arquivo válida seja conhecida. A posição do arquivo de log binário pode ser marcada como inválida quando a opção `CHANGE REPLICATION SOURCE TO` `GTID_ONLY` é definida para o canal de replicação e o servidor é reiniciado ou a replicação é interrompida. A posição do arquivo torna-se válida após uma transação ser aplicada com sucesso além da posição de arquivo especificada. Se o aplicador não atingir a posição declarada, a função aguarda até o tempo limite. Use uma declaração `SHOW REPLICA STATUS` para verificar se a posição do arquivo de log binário foi marcada como inválida.

  Em uma replica multithreading, a função aguarda até o vencimento do limite definido pela variável de sistema `replica_checkpoint_group`, `slave_checkpoint_group`, `replica_checkpoint_period` ou `slave_checkpoint_period`, quando a operação de verificação de ponto é chamada para atualizar o status da replica. Dependendo da configuração das variáveis de sistema, a função pode, portanto, retornar algum tempo após a posição especificada ter sido alcançada.

  Se a compressão de transações de log binário estiver em uso e o payload da transação na posição especificada estiver comprimido (como um `Transaction_payload_event`), a função aguarda até que toda a transação seja lida e aplicada, e as posições sejam atualizadas.

  Se um valor de `timeout` for especificado, o `MASTER_POS_WAIT()` para de esperar quando `timeout` segundos tiverem decorrido. `timeout` deve ser maior ou igual a 0. (Quando o servidor estiver em modo SQL rigoroso, um valor negativo de `timeout` é rejeitado imediatamente com `ER_WRONG_ARGUMENTS`; caso contrário, a função retorna `NULL` e emite uma mensagem de aviso.)

  O valor opcional `channel` permite que você nomeie qual canal de replicação a função aplica. Consulte a Seção 19.2.2, “Canais de replicação”, para obter mais informações.

  Essa função não é segura para a replicação baseada em declarações. Um aviso é registrado se você usar essa função quando `binlog_format` estiver definido como `STATEMENT`.

- `SOURCE_POS_WAIT(log_name,log_pos[,timeout][,channel])`

  Esta função é para o controle da sincronização de fonte-replica. Ela bloqueia até que a replica tenha lido e aplicado todas as atualizações até a posição especificada no log binário da fonte. A partir do MySQL 8.0.26, use `SOURCE_POS_WAIT()` no lugar de `MASTER_POS_WAIT()`, que é desatualizado a partir dessa versão. Em versões anteriores ao MySQL 8.0.26, use `MASTER_POS_WAIT()`.

  O valor de retorno é o número de eventos de log que a replica teve que esperar para avançar para a posição especificada. A função retorna `NULL` se o thread de SQL de replicação não for iniciado, as informações de origem da replica não forem inicializadas, os argumentos estiverem incorretos ou ocorrer um erro. Ela retorna `-1` se o tempo limite for excedido. Se o thread de SQL de replicação parar enquanto a replica estiver esperando por `SOURCE_POS_WAIT()`, a função retorna `NULL`. Se a replica estiver além da posição especificada, a função retorna imediatamente.

  Se a posição do arquivo de log binário tiver sido marcada como inválida, a função aguarda até que uma posição de arquivo válida seja conhecida. A posição do arquivo de log binário pode ser marcada como inválida quando a opção `CHANGE REPLICATION SOURCE TO` `GTID_ONLY` é definida para o canal de replicação e o servidor é reiniciado ou a replicação é interrompida. A posição do arquivo torna-se válida após uma transação ser aplicada com sucesso além da posição de arquivo especificada. Se o aplicador não atingir a posição declarada, a função aguarda até o tempo limite. Use uma declaração `SHOW REPLICA STATUS` para verificar se a posição do arquivo de log binário foi marcada como inválida.

  Em uma replica multithreading, a função aguarda até o vencimento do limite definido pela variável de sistema `replica_checkpoint_group` ou `replica_checkpoint_period`, quando a operação de verificação de ponto é chamada para atualizar o status da replica. Dependendo da configuração das variáveis de sistema, a função pode, portanto, retornar algum tempo após a posição especificada ter sido alcançada.

  Se a compressão de transações de log binário estiver em uso e o payload da transação na posição especificada estiver comprimido (como um `Transaction_payload_event`), a função aguarda até que toda a transação seja lida e aplicada, e as posições sejam atualizadas.

  Se um valor de `timeout` for especificado, o `SOURCE_POS_WAIT()` para de esperar quando `timeout` segundos tiverem decorrido. `timeout` deve ser maior ou igual a 0. (No modo SQL estrito, um valor negativo de `timeout` é rejeitado imediatamente com `ER_WRONG_ARGUMENTS`; caso contrário, a função retorna `NULL` e emite uma mensagem de aviso.)

  O valor opcional `channel` permite que você nomeie qual canal de replicação a função aplica. Consulte a Seção 19.2.2, “Canais de replicação”, para obter mais informações.

  Essa função não é segura para a replicação baseada em declarações. Um aviso é registrado se você usar essa função quando `binlog_format` estiver definido como `STATEMENT`.
