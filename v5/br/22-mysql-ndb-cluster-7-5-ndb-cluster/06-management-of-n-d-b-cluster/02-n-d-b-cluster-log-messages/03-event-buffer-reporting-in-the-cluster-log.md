#### 21.6.2.3 Relatórios do Event Buffer no Cluster Log

O `NDB` usa um ou mais *memory buffers* para eventos recebidos dos *data nodes*. Existe um *buffer* desse tipo para cada objeto [`Ndb`](/doc/ndbapi/en/ndb-ndb.html) que está subscrito a eventos de tabela, o que significa que geralmente há dois *buffers* para cada [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") realizando *binary logging* (um *buffer* para eventos de esquema e um para eventos de dados). Cada *buffer* contém *epochs* compostas de eventos. Esses eventos consistem em tipos de operação (*insert*, *update*, *delete*) e dados de linha (*row data*) (imagens antes e depois, mais *metadata*).

O `NDB` gera mensagens no *cluster log* para descrever o estado desses *buffers*. Embora esses relatórios apareçam no *cluster log*, eles se referem a *buffers* em *API nodes* (diferentemente da maioria das outras mensagens do *cluster log*, que são geradas pelos *data nodes*). Essas mensagens e as estruturas de dados subjacentes foram alteradas significativamente no NDB 7.5.1, com a adição do tipo de evento `NDB_LE_EventBufferStatus2` e da estrutura de dados `ndb_logevent_EventBufferStatus2` (consulte [The Ndb_logevent_type Type](/doc/ndbapi/en/mgm-types.html#mgm-ndb-logevent-type)). O restante desta discussão se concentra na implementação baseada em `NDB_LE_EventBufferStatus2`.

Os relatórios de *event buffer logging* no *cluster log* usam o formato mostrado aqui:

```sql
Node node_id: Event buffer status (object_id):
used=bytes_used (percent_used% of alloc)
alloc=bytes_allocated (percent_alloc% of max) max=bytes_available
latest_consumed_epoch=latest_consumed_epoch
latest_buffered_epoch=latest_buffered_epoch
report_reason=report_reason
```

Os campos que compõem este relatório estão listados aqui, com suas descrições:

* *`node_id`*: ID do *node* onde o relatório foi originado.

* *`object_id`*: ID do objeto [`Ndb`](/doc/ndbapi/en/ndb-ndb.html) onde o relatório foi originado.

* *`bytes_used`*: Número de *bytes* usados pelo *buffer*.

* *`percent_used`*: Porcentagem de *bytes* alocados usados.

* *`bytes_allocated`*: Número de *bytes* alocados para este *buffer*.

* *`percent_alloc`*: Porcentagem de *bytes* disponíveis usados; não é impresso se [`ndb_eventbuffer_max_alloc`](mysql-cluster-options-variables.html#sysvar_ndb_eventbuffer_max_alloc) for igual a 0 (ilimitado).

* *`bytes_available`*: Número de *bytes* disponíveis; este é 0 se `ndb_eventbuffer_max_alloc` for 0 (ilimitado).

* *`latest_consumed_epoch`*: O *epoch* consumido por completo mais recentemente. (Em aplicações NDB API, isso é feito chamando [`nextEvent()`](/doc/ndbapi/en/ndb-ndb.html#ndb-ndb-nextevent).)

* *`latest_buffered_epoch`*: O *epoch* mais recentemente armazenado em *buffer* (completamente) no *event buffer*.

* *`report_reason`*: O motivo para a geração do relatório. Os possíveis motivos são mostrados posteriormente nesta seção.

Os campos `latest_consumed_epoch` e `latest_buffered_epoch` correspondem, respectivamente, aos campos `apply_gci` e `latest_gci` das mensagens de *event buffer logging* de estilo antigo usadas antes do NDB 7.5.1.

Os possíveis motivos para a emissão de relatórios são descritos na lista a seguir:

* `ENOUGH_FREE_EVENTBUFFER`: O *event buffer* tem espaço suficiente.

  `LOW_FREE_EVENTBUFFER`: O *event buffer* está ficando com pouco espaço livre.

  O nível percentual de espaço livre (*free percentage*) que aciona esses relatórios pode ser ajustado configurando a variável de servidor [`ndb_report_thresh_binlog_mem_usage`](mysql-cluster-options-variables.html#sysvar_ndb_report_thresh_binlog_mem_usage).

* `BUFFERED_EPOCHS_OVER_THRESHOLD`: Indica se o número de *epochs* armazenados em *buffer* excedeu o limite (*threshold*) configurado. Este número é a diferença entre o *epoch* mais recente que foi recebido na sua totalidade e o *epoch* que foi consumido mais recentemente (em aplicações NDB API, isso é feito chamando [`nextEvent()`](/doc/ndbapi/en/ndb-ndb.html#ndb-ndb-nextevent) ou [`nextEvent2()`](/doc/ndbapi/en/ndb-ndb.html#ndb-ndb-nextevent2)). O relatório é gerado a cada segundo até que o número de *epochs* armazenados em *buffer* caia abaixo do *threshold*, o qual pode ser ajustado configurando a variável de servidor [`ndb_report_thresh_binlog_epoch_slip`](mysql-cluster-options-variables.html#sysvar_ndb_report_thresh_binlog_epoch_slip). Você também pode ajustar o *threshold* em aplicações NDB API chamando [`setEventBufferQueueEmptyEpoch()`](/doc/ndbapi/en/ndb-ndb.html#ndb-ndb-seteventbufferqueueemptyepoch).

* `PARTIALLY_DISCARDING`: A memória do *Event Buffer* está esgotada — ou seja, 100% de [`ndb_eventbuffer_max_alloc`](mysql-cluster-options-variables.html#sysvar_ndb_eventbuffer_max_alloc) foi usado. Qualquer *epoch* parcialmente armazenado em *buffer* é armazenado até a conclusão, mesmo que o uso exceda 100%, mas quaisquer novos *epochs* recebidos são descartados. Isso significa que ocorreu uma lacuna (*gap*) no *event stream*.

* `COMPLETELY_DISCARDING`: Nenhum *epoch* é armazenado em *buffer*.

* `PARTIALLY_BUFFERING`: A porcentagem livre (*free percentage*) do *buffer* após a lacuna (*gap*) aumentou para o *threshold*, que pode ser definido no cliente [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") usando a variável de sistema de servidor [`ndb_eventbuffer_free_percent`](mysql-cluster-options-variables.html#sysvar_ndb_eventbuffer_free_percent) ou em aplicações NDB API chamando [`set_eventbuffer_free_percent()`](/doc/ndbapi/en/ndb-ndb.html#ndb-ndb-set-eventbuffer-free-percent). Novos *epochs* são armazenados em *buffer*. Os *epochs* que não puderam ser concluídos devido à lacuna são descartados.

* `COMPLETELY_BUFFERING`: Todos os *epochs* recebidos estão sendo armazenados em *buffer*, o que significa que há memória suficiente no *event buffer*. A lacuna (*gap*) no *event stream* foi fechada.