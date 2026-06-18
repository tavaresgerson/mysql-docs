#### 25.6.2.3 Relatório de Buffer de Eventos no Log do Clúster

`NDB` utiliza um ou mais buffers de memória para eventos recebidos dos nós de dados. Há um buffer para cada objeto `Ndb` que se inscreve em eventos de tabela, o que significa que geralmente há dois buffers para cada **mysqld** que realiza registro binário (um buffer para eventos de esquema e outro para eventos de dados). Cada buffer contém épocas compostas por eventos. Esses eventos consistem em tipos de operação (inserção, atualização, exclusão) e dados de linha (imagens antes e depois, além de metadados).

`NDB` gera mensagens no log do clúster para descrever o estado desses buffers. Embora esses relatórios apareçam no log do clúster, eles se referem a buffers nos nós da API (ao contrário da maioria das outras mensagens do log do clúster, que são geradas pelos nós de dados).

Os relatórios de registro de buffer de eventos no log do cluster usam o formato mostrado aqui:

```
Node node_id: Event buffer status (object_id):
used=bytes_used (percent_used% of alloc)
alloc=bytes_allocated (percent_alloc% of max) max=bytes_available
latest_consumed_epoch=latest_consumed_epoch
latest_buffered_epoch=latest_buffered_epoch
report_reason=report_reason
```

Os campos que compõem este relatório estão listados aqui, com descrições:

- `node_id`: ID do nó onde o relatório foi gerado.

- `object_id`: ID do objeto `Ndb` onde o relatório foi gerado.

- `bytes_used`: Número de bytes usados pelo buffer.

- `percent_used`: Porcentagem de bytes alocados utilizados.

- `bytes_allocated`: Número de bytes alocados para este buffer.

- `percent_alloc`: Porcentagem de bytes disponíveis usados; não é impressa se `ndb_eventbuffer_max_alloc` for igual a 0 (sem limite).

- `bytes_available`: Número de bytes disponíveis; este é 0 se `ndb_eventbuffer_max_alloc` for 0 (sem limite).

- `latest_consumed_epoch`: A época mais recentemente consumida até o final. (Em aplicativos da API NDB, isso é feito chamando `nextEvent()`.)

- `latest_buffered_epoch`: A época mais recentemente armazenada (completamente) no buffer de eventos.

- `report_reason`: A razão para a elaboração do relatório. As possíveis razões são mostradas mais adiante nesta seção.

As possíveis razões para a denúncia estão descritas na lista a seguir:

- `ENOUGH_FREE_EVENTBUFFER`: O buffer do evento tem espaço suficiente.

  `LOW_FREE_EVENTBUFFER`: O buffer de eventos está com pouco espaço livre.

  O nível de porcentagem sem limite que desencadeia esses relatórios pode ser ajustado definindo a variável de servidor `ndb_report_thresh_binlog_mem_usage`.

- `BUFFERED_EPOCHS_OVER_THRESHOLD`: Se o número de épocas em buffer ultrapassou o limite configurado. Esse número é a diferença entre a última época que foi recebida na íntegra e a época que foi consumida mais recentemente (nos aplicativos da API NDB, isso é feito chamando `nextEvent()` ou `nextEvent2()`). O relatório é gerado a cada segundo até que o número de épocas em buffer caia abaixo do limite, que pode ser ajustado definindo a variável de servidor `ndb_report_thresh_binlog_epoch_slip`. Você também pode ajustar o limite nos aplicativos da API NDB chamando `setEventBufferQueueEmptyEpoch()`.

- `PARTIALLY_DISCARDING`: A memória de buffer de eventos está esgotada — ou seja, 100% de `ndb_eventbuffer_max_alloc` foi utilizado. Qualquer época parcialmente tamponada é tamponada até o final, mesmo que o uso exceda 100%, mas quaisquer novas épocas recebidas são descartadas. Isso significa que ocorreu uma lacuna no fluxo de eventos.

- `COMPLETELY_DISCARDING`: Nenhuma época está em buffer.

- `PARTIALLY_BUFFERING`: A porcentagem de buffer livre após a lacuna aumentou para o limite, que pode ser definido no cliente **mysql** usando a variável de sistema do sistema de servidor `ndb_eventbuffer_free_percent` ou em aplicativos da API NDB, chamando `set_eventbuffer_free_percent()`. Novos períodos são armazenados em buffer. Períodos que não puderam ser concluídos devido à lacuna são descartados.

- `COMPLETELY_BUFFERING`: Todas as épocas recebidas estão sendo armazenadas em cache, o que significa que há memória de buffer de eventos suficiente. A lacuna no fluxo de eventos foi fechada.
