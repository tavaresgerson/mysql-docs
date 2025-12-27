#### 25.6.2.3 Relatório de Blocos de Eventos no Log do Clúster

O `NDB` utiliza um ou mais blocos de memória para eventos recebidos dos nós de dados. Há um bloco de memória para cada objeto `Ndb` que se inscreve em eventos de tabela, o que significa que geralmente há dois blocos para cada **mysqld** que realiza o registro binário (um bloco para eventos de esquema e outro para eventos de dados). Cada bloco contém épocas compostas por eventos. Esses eventos consistem em tipos de operação (inserção, atualização, exclusão) e dados de linha (imagens antes e depois, além de metadados).

O `NDB` gera mensagens no log do clúster para descrever o estado desses blocos. Embora esses relatórios apareçam no log do clúster, eles se referem a blocos em nós da API (ao contrário da maioria das outras mensagens do log do clúster, que são geradas pelos nós de dados).

Os relatórios de registro de blocos de eventos no log do clúster usam o formato mostrado aqui:

```
Node node_id: Event buffer status (object_id):
used=bytes_used (percent_used% of alloc)
alloc=bytes_allocated (percent_alloc% of max) max=bytes_available
latest_consumed_epoch=latest_consumed_epoch
latest_buffered_epoch=latest_buffered_epoch
report_reason=report_reason
```

Os campos que compõem este relatório estão listados aqui, com descrições:

* *`node_id`*: ID do nó onde o relatório foi gerado.

* *`object_id`*: ID do objeto `Ndb` onde o relatório foi gerado.

* *`bytes_used`*: Número de bytes usados pelo bloco.

* *`percent_used`*: Porcentagem de bytes alocados usados.

* *`bytes_allocated`*: Número de bytes alocados para este bloco.

* *`percent_alloc`*: Porcentagem de bytes disponíveis usados; não é impresso se `ndb_eventbuffer_max_alloc` for igual a 0 (sem limite).

* *`bytes_available`*: Número de bytes disponíveis; este é 0 se `ndb_eventbuffer_max_alloc` for 0 (sem limite).

* *`latest_consumed_epoch`*: A época mais recentemente consumida até o término. (Em aplicações da API do NDB, isso é feito chamando `nextEvent()`.)

* *`latest_buffered_epoch`*: A época mais recentemente armazenada (completamente) no bloco de eventos.

* `report_reason`*: O motivo do relatório. Motivos possíveis são mostrados mais adiante nesta seção.

Os motivos possíveis para o relatório são descritos na lista a seguir:

* `ENOUGH_FREE_EVENTBUFFER`: O buffer de eventos tem espaço suficiente.

  `LOW_FREE_EVENTBUFFER`: O buffer de eventos está quase esgotado.

  O nível de porcentagem de espaço livre que desencadeia esses relatórios pode ser ajustado definindo a variável de servidor `ndb_report_thresh_binlog_mem_usage`.

* `BUFFERED_EPOCHS_OVER_THRESHOLD`: Se o número de épocas bufferadas excedeu o limite configurado. Esse número é a diferença entre a última época que foi recebida na íntegra e a época que foi consumida mais recentemente (em aplicativos da API NDB, isso é feito chamando `nextEvent()` ou `nextEvent2()`). O relatório é gerado a cada segundo até que o número de épocas bufferadas vá abaixo do limite, que pode ser ajustado definindo a variável de servidor `ndb_report_thresh_binlog_epoch_slip`. Você também pode ajustar o limite em aplicativos da API NDB chamando `setEventBufferQueueEmptyEpoch()`.

* `PARTIALLY_DISCARDING`: A memória do buffer de eventos está esgotada — ou seja, 100% de `ndb_eventbuffer_max_alloc` foi usado. Qualquer época bufferada parcialmente é bufferada até ser completada, mesmo que o uso exceda 100%, mas quaisquer novas épocas recebidas são descartadas. Isso significa que ocorreu uma lacuna no fluxo de eventos.

* `COMPLETELY_DISCARDING`: Não há épocas bufferadas.

* `PARTIALLY_BUFFERING`: A porcentagem de memória livre do buffer após a lacuna aumentou para o limite, que pode ser definido no cliente **mysql** usando a variável de sistema do servidor `ndb_eventbuffer_free_percent` ou em aplicativos da API NDB, chamando `set_eventbuffer_free_percent()`. Novas épocas são buffereadas. As épocas que não puderam ser concluídas devido à lacuna são descartadas.

* `COMPLETELY_BUFFERING`: Todas as épocas recebidas estão sendo buffereadas, o que significa que há memória de buffer de eventos suficiente. A lacuna no fluxo de eventos foi fechada.