#### 29.12.4.1 A tabela `events_waits_current`

A tabela `events_waits_current` contém eventos de espera atuais. A tabela armazena uma linha por thread, mostrando o status atual do evento de espera mais recente da thread, portanto, não há uma variável de sistema para configurar o tamanho da tabela.

Das tabelas que contêm linhas de eventos de espera, a `events_waits_current` é a mais fundamental. Outras tabelas que contêm linhas de eventos de espera são derivadas logicamente dos eventos atuais. Por exemplo, as tabelas `events_waits_history` e `events_waits_history_long` são coleções dos eventos de espera mais recentes que terminaram, até um número máximo de linhas por thread e globalmente em todas as threads, respectivamente.

Para mais informações sobre a relação entre as três tabelas de eventos de espera, consulte a Seção 29.9, “Tabelas do Schema de Desempenho para Eventos Atuais e Históricos”.

Para informações sobre como configurar se os eventos de espera devem ser coletados, consulte a Seção 29.12.4, “Tabelas de Eventos de Espera do Schema de Desempenho”.

A tabela `events_waits_current` tem essas colunas:

* `THREAD_ID`, `EVENT_ID`

  O thread associado ao evento e o número do evento atual da thread quando o evento começa. Os valores de `THREAD_ID` e `EVENT_ID` juntos identificam de forma única a linha. Nenhuma linha tem o mesmo par de valores.

* `END_EVENT_ID`

  Esta coluna é definida como `NULL` quando o evento começa e atualizada para o número do evento atual da thread quando o evento termina.

* `EVENT_NAME`

  O nome do instrumento que produziu o evento. Este é um valor `NAME` da tabela `setup_instruments`. Os nomes dos instrumentos podem ter várias partes e formar uma hierarquia, conforme discutido na Seção 29.6, “Convenções de Nomenclatura de Instrumentos do Schema de Desempenho”.

O nome do arquivo fonte que contém o código instrumentado que produziu o evento e o número da linha no arquivo onde a instrumentação ocorre. Isso permite que você verifique a fonte para determinar exatamente qual código está envolvido. Por exemplo, se um mutex ou bloqueio está sendo bloqueado, você pode verificar o contexto em que isso ocorre.

* `TIMER_START`, `TIMER_END`, `TIMER_WAIT`

  Informações de temporização para o evento. A unidade para esses valores é picosegundos (trilhésimos de segundo). Os valores `TIMER_START` e `TIMER_END` indicam quando o temporizador do evento começou e terminou. `TIMER_WAIT` é o tempo decorrido do evento (duração).

  Se um evento não tiver terminado, `TIMER_END` é o valor atual do temporizador e `TIMER_WAIT` é o tempo decorrido até agora (`TIMER_END` − `TIMER_START`).

  Se um evento é produzido a partir de um instrumento que tem `TIMED = NO`, as informações de temporização não são coletadas, e `TIMER_START`, `TIMER_END` e `TIMER_WAIT` são todos `NULL`.

  Para discussão sobre picosegundos como unidade de tempos de eventos e fatores que afetam os valores de tempo, consulte a Seção 29.4.1, “Temporização de Eventos do Schema de Desempenho”.

* `SPINS`

  Para um mutex, o número de rodadas de spin. Se o valor for `NULL`, o código não usa rodadas de spin ou a instrumentação de spin não está registrada.

* `OBJECT_SCHEMA`, `OBJECT_NAME`, `OBJECT_TYPE`, `OBJECT_INSTANCE_BEGIN`

  Essas colunas identificam o objeto “sobre o qual está sendo atuado”. O que isso significa depende do tipo do objeto.

  Para um objeto de sincronização (`cond`, `mutex`, `rwlock`):

  + `OBJECT_SCHEMA`, `OBJECT_NAME` e `OBJECT_TYPE` são `NULL`.

  + `OBJECT_INSTANCE_BEGIN` é o endereço do objeto de sincronização na memória.

  Para um objeto de E/S de arquivo:

  + `OBJECT_SCHEMA` é `NULL`.

  + `OBJECT_NAME` é o nome do arquivo.
  + `OBJECT_TYPE` é `FILE`.

+ `OBJECT_INSTANCE_BEGIN` é um endereço na memória.

  Para um objeto socket:

  + `OBJECT_NAME` é o valor `IP:PORT` do socket.

  + `OBJECT_INSTANCE_BEGIN` é um endereço na memória.

  Para um objeto de I/O de tabela:

  + `OBJECT_SCHEMA` é o nome do esquema que contém a tabela.

  + `OBJECT_NAME` é o nome da tabela.
  + `OBJECT_TYPE` é `TABLE` para uma tabela de base persistente ou `TEMPORARY TABLE` para uma tabela temporária.

  + `OBJECT_INSTANCE_BEGIN` é um endereço na memória.

  Um valor de `OBJECT_INSTANCE_BEGIN` por si só não tem significado, exceto que diferentes valores indicam diferentes objetos. `OBJECT_INSTANCE_BEGIN` pode ser usado para depuração. Por exemplo, pode ser usado com `GROUP BY OBJECT_INSTANCE_BEGIN` para ver se a carga em 1.000 mutexes (que protegem, por exemplo, 1.000 páginas ou blocos de dados) está distribuída uniformemente ou apenas atingindo alguns gargalos. Isso pode ajudá-lo a correlacionar com outras fontes de informações se você vir o mesmo endereço de objeto em um arquivo de log ou em outra ferramenta de depuração ou desempenho.

* `INDEX_NAME`

  O nome do índice usado. `PRIMARY` indica o índice primário da tabela. `NULL` significa que nenhum índice foi usado.

* `NESTING_EVENT_ID`

  O valor `EVENT_ID` do evento dentro do qual este evento está aninhado.

* `NESTING_EVENT_TYPE`

  O tipo de evento de aninhamento. O valor é `TRANSACTION`, `STATEMENT`, `STAGE` ou `WAIT`.

* `OPERATION`

  O tipo de operação realizada, como `lock`, `read` ou `write`.

* `NUMBER_OF_BYTES`

O número de bytes lidos ou escritos pela operação. Para espera de I/O de tabela (eventos para o instrumento `wait/io/table/sql/handler`), `NUMBER_OF_BYTES` indica o número de linhas. Se o valor for maior que 1, o evento é para uma operação de I/O em lote. A discussão a seguir descreve a diferença entre o relatório de apenas uma linha e o relatório que reflete o I/O em lote.

O MySQL executa junções usando uma implementação de loop aninhado. O trabalho da instrumentação do Schema de Desempenho é fornecer o número de linhas e o tempo de execução acumulado por tabela na junção. Suponha uma consulta de junção da seguinte forma que é executada usando uma ordem de junção de tabela de `t1`, `t2`, `t3`:

```
  SELECT ... FROM t1 JOIN t2 ON ... JOIN t3 ON ...
  ```

A tabela “fanout” é o aumento ou diminuição no número de linhas ao adicionar uma tabela durante o processamento da junção. Se o fanout para a tabela `t3` for maior que 1, a maioria das operações de recuperação de linhas é para essa tabela. Suponha que a junção acesse 10 linhas de `t1`, 20 linhas de `t2` por linha de `t1`, e 30 linhas de `t3` por linha da tabela `t2`. Com o relatório de apenas uma linha, o número total de operações instrumentadas é:

```
  10 + (10 * 20) + (10 * 20 * 30) = 6210
  ```

Uma redução significativa no número de operações instrumentadas pode ser alcançada aglomerando-as por varredura (ou seja, por combinação única de linhas de `t1` e `t2`). Com o relatório de I/O em lote, o Schema de Desempenho produz um evento para cada varredura da tabela mais interna `t3`, em vez de para cada linha, e o número de operações de linha instrumentadas reduz para:

```
  10 + (10 * 20) + (10 * 20) = 410
  ```

Isso representa uma redução de 93%, ilustrando como a estratégia de relatórios por lote reduz significativamente o overhead do Schema de Desempenho para o I/O de tabelas, reduzindo o número de chamadas de relatório. A compensação é uma menor precisão para o tempo de eventos. Em vez de tempo para uma operação de linha individual, como no relatório por linha, o tempo de I/O por lote inclui o tempo gasto em operações como bufferização de junção, agregação e retorno de linhas ao cliente.

Para que o relatório de I/O por lote ocorra, essas condições devem ser verdadeiras:

+ A execução da consulta acessa a tabela mais interna de um bloco de consulta (para uma consulta de uma única tabela, essa tabela é considerada a mais interna)

+ A execução da consulta não solicita uma única linha da tabela (por exemplo, o acesso `eq_ref` impede o uso do relatório por lote)

+ A execução da consulta não avalia uma subconsulta que contenha acesso à tabela da tabela

* `FLAGS`

Reservado para uso futuro.

A tabela `events_waits_current` tem esses índices:

* Chave primária em (`THREAD_ID`, `EVENT_ID`)

O `TRUNCATE TABLE` é permitido para a tabela `events_waits_current`. Ele remove as linhas.