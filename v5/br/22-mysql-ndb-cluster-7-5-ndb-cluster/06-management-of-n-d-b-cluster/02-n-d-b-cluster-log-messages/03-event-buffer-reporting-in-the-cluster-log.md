#### 21.6.2.3 Relatório de Buffer de Eventos no Log do Clúster

O `NDB` utiliza um ou mais buffers de memória para eventos recebidos dos nós de dados. Há um buffer para cada objeto `[Ndb]` (/doc/ndbapi/pt-BR/ndb-ndb.html) que se inscreve em eventos de tabela, o que significa que geralmente há dois buffers para cada **mysqld** que realiza o registro binário (um buffer para eventos de esquema e outro para eventos de dados). Cada buffer contém épocas compostas por eventos. Esses eventos consistem em tipos de operação (inserção, atualização, exclusão) e dados de linha (imagens antes e depois, além de metadados).

O `NDB` gera mensagens no log do clúster para descrever o estado desses buffers. Embora esses relatórios apareçam no log do clúster, eles se referem a buffers em nós da API (ao contrário da maioria das outras mensagens do log do clúster, que são geradas por nós de dados). Essas mensagens e as estruturas de dados subjacentes a elas foram significativamente alteradas no NDB 7.5.1, com a adição do tipo de evento `NDB_LE_EventBufferStatus2` e da estrutura de dados `ndb_logevent_EventBufferStatus2` (veja O tipo de evento Ndb_logevent_type). O restante desta discussão foca na implementação baseada em `NDB_LE_EventBufferStatus2`.

Os relatórios de registro de buffer de eventos no log do cluster usam o formato mostrado aqui:

```sql
Node node_id: Event buffer status (object_id):
used=bytes_used (percent_used% of alloc)
alloc=bytes_allocated (percent_alloc% of max) max=bytes_available
latest_consumed_epoch=latest_consumed_epoch
latest_buffered_epoch=latest_buffered_epoch
report_reason=report_reason
```

Os campos que compõem este relatório estão listados aqui, com descrições:

- *`node_id`*: ID do nó onde o relatório foi gerado.

- *`object_id`*: ID do objeto `Ndb` onde o relatório foi gerado.

- *`bytes_used`*: Número de bytes usados pelo buffer.

- *`percent_used`*: Porcentagem de bytes alocados usados.

- *`bytes_allocated`*: Número de bytes alocados para este buffer.

- *`percent_alloc`*: Porcentagem de bytes disponíveis usados; não é impressa se `ndb_eventbuffer_max_alloc` for igual a 0 (sem limite).

- *`bytes_available`*: Número de bytes disponíveis; este é 0 se `ndb_eventbuffer_max_alloc` for 0 (sem limite).

- *`latest_consumed_epoch`*: A época mais recentemente consumida até o final. (Em aplicativos da API NDB, isso é feito chamando `nextEvent()`.)

- *`último_epócio_bufferado`*: O epócio mais recentemente bufferado (completamente) no buffer de eventos.

- *`report_reason`*: A razão para fazer o relatório. As razões possíveis são mostradas mais adiante nesta seção.

Os campos `latest_consumed_epoch` e `latest_buffered_epoch` correspondem, respectivamente, aos campos `apply_gci` e `latest_gci` das mensagens de registro de buffer de eventos do estilo antigo usadas antes do NDB 7.5.1.

As possíveis razões para a denúncia estão descritas na lista a seguir:

- `ENOUGH_FREE_EVENTBUFFER`: O buffer de eventos tem espaço suficiente.

  `LOW_FREE_EVENTBUFFER`: O buffer de eventos está com pouco espaço livre.

  O nível de porcentagem sem limite que desencadeia esses relatórios pode ser ajustado definindo a variável de servidor `ndb_report_thresh_binlog_mem_usage`.

- `BUFFERED_EPOCHS_OVER_THRESHOLD`: Se o número de épocas em buffer ultrapassou o limite configurado. Esse número é a diferença entre a última época que foi recebida na íntegra e a época que foi consumida mais recentemente (em aplicações da API NDB, isso é feito chamando `nextEvent()` ou `nextEvent2()`). O relatório é gerado a cada segundo até que o número de épocas em buffer caia abaixo do limite, que pode ser ajustado definindo a variável de servidor `ndb_report_thresh_binlog_epoch_slip`. Você também pode ajustar o limite em aplicações da API NDB, chamando `setEventBufferQueueEmptyEpoch()`.

- `PARTIALLY_DISCARDING`: A memória de buffer de eventos está esgotada, ou seja, 100% de `ndb_eventbuffer_max_alloc` foi utilizado. Qualquer epoca parcialmente tamponada é tamponada até ser concluída, mesmo que o uso exceda 100%, mas quaisquer novas epocas recebidas são descartadas. Isso significa que ocorreu uma lacuna no fluxo de eventos.

- `COMPLETEMENTE_DESCARREGANDO`: Nenhuma época é armazenada em cache.

- `PARTIALLY_BUFFERING`: A porcentagem de buffer livre após a lacuna aumentou para o limite, que pode ser definido no cliente **mysql** usando a variável de sistema `**ndb_eventbuffer_free_percent** ou em aplicativos da API NDB, chamando `**set_eventbuffer_free_percent()**\`. Novas épocas são buffereadas. As épocas que não puderam ser concluídas devido à lacuna são descartadas.

- `COMPLETEMENTE_BUFFERANDO`: Todos os eixos recebidos estão sendo armazenados em cache, o que significa que há memória de buffer de eventos suficiente. A lacuna no fluxo de eventos foi fechada.
