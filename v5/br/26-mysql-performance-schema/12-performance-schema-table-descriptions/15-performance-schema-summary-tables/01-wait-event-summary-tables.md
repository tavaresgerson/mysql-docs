#### 25.12.15.1 Tabelas de Resumo de Eventos de Aguardar

O Schema de Desempenho mantém tabelas para coletar eventos de espera atuais e recentes, e agrega essas informações em tabelas resumidas. Seção 25.12.4, “Tabelas de Eventos de Espera do Schema de Desempenho” descreve os eventos sobre os quais os resumos de espera são baseados. Consulte essa discussão para obter informações sobre o conteúdo dos eventos de espera, as tabelas de eventos de espera atuais e recentes, e como controlar a coleta de eventos de espera, que está desativada por padrão.

Exemplo de informações de resumo de evento de espera:

```sql
mysql> SELECT *
       FROM performance_schema.events_waits_summary_global_by_event_name\G
...
*************************** 6. row ***************************
    EVENT_NAME: wait/synch/mutex/sql/BINARY_LOG::LOCK_index
    COUNT_STAR: 8
SUM_TIMER_WAIT: 2119302
MIN_TIMER_WAIT: 196092
AVG_TIMER_WAIT: 264912
MAX_TIMER_WAIT: 569421
...
*************************** 9. row ***************************
    EVENT_NAME: wait/synch/mutex/sql/hash_filo::lock
    COUNT_STAR: 69
SUM_TIMER_WAIT: 16848828
MIN_TIMER_WAIT: 0
AVG_TIMER_WAIT: 244185
MAX_TIMER_WAIT: 735345
...
```

Cada tabela de resumo de eventos de espera tem uma ou mais colunas de agrupamento para indicar como a tabela agrega os eventos. Os nomes dos eventos referem-se aos nomes dos instrumentos de evento na tabela `setup_instruments`:

- O `events_waits_summary_by_account_by_event_name` possui as colunas `EVENT_NAME`, `USER` e `HOST`. Cada linha resume os eventos para uma conta específica (combinação de usuário e host) e nome do evento.

- O `events_waits_summary_by_host_by_event_name` possui as colunas `EVENT_NAME` e `HOST`. Cada linha resume os eventos para um determinado host e nome de evento.

- O `events_waits_summary_by_instance` possui as colunas `EVENT_NAME` e `OBJECT_INSTANCE_BEGIN`. Cada linha resume os eventos para um nome de evento e objeto específicos. Se um instrumento for usado para criar múltiplas instâncias, cada instância terá um valor único de `OBJECT_INSTANCE_BEGIN` e será resumida separadamente nesta tabela.

- `events_waits_summary_by_thread_by_event_name` possui as colunas `THREAD_ID` e `EVENT_NAME`. Cada linha resume os eventos para um determinado thread e nome de evento.

- `events_waits_summary_by_user_by_event_name` tem as colunas `EVENT_NAME` e `USER`. Cada linha resume os eventos para um usuário e um nome de evento específicos.

- O `events_waits_summary_global_by_event_name` possui uma coluna `EVENT_NAME`. Cada linha resume os eventos para um nome de evento específico. Um instrumento pode ser usado para criar múltiplas instâncias do objeto instrumentado. Por exemplo, se houver um instrumento para um mutex que é criado para cada conexão, haverá tantas instâncias quanto conexões. A linha de resumo do instrumento resume todas essas instâncias.

Cada tabela de resumo de evento de espera tem essas colunas de resumo contendo valores agregados:

- `CONTAR_ESTRELAS`

  O número de eventos resumidos. Esse valor inclui todos os eventos, sejam eles cronometrados ou

- `SUM_TIMER_WAIT`

  O tempo total de espera dos eventos cronometrados resumidos. Esse valor é calculado apenas para eventos cronometrados, pois os eventos não cronometrados têm um tempo de espera de `NULL`. O mesmo vale para os outros valores `xxx_TIMER_WAIT`.

- `MIN_TIMER_WAIT`

  O tempo de espera mínimo dos eventos cronometrados resumidos.

- `AVG_TIMER_WAIT`

  O tempo médio de espera dos eventos cronometrados resumidos.

- `MAX_TIMER_WAIT`

  O tempo máximo de espera dos eventos cronometrados resumidos.

A opção `TRUNCATE TABLE` é permitida para tabelas de resumo de espera. Ela tem esses efeitos:

- Para tabelas resumidas que não são agregadas por conta, host ou usuário, o truncamento redefine as colunas resumidas para zero, em vez de remover linhas.

- Para tabelas resumidas agregadas por conta, host ou usuário, o truncamento remove linhas de contas, hosts ou usuários sem conexões e redefiniu as colunas resumidas para zero para as linhas restantes.

Além disso, cada tabela de resumo de espera que é agregada por conta, host, usuário ou thread é implicitamente truncada pela truncagem da tabela de conexão na qual depende, ou pela truncagem de `events_waits_summary_global_by_event_name`. Para obter detalhes, consulte Seção 25.12.8, “Tabelas de Conexão do Schema de Desempenho”.
