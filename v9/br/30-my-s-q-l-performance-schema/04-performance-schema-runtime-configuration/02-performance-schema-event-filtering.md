### 29.4.2 Filtragem de Eventos do Schema de Desempenho

Os eventos são processados de forma produtor/consumidor:

* O código instrumentado é a fonte dos eventos e produz eventos para serem coletados. A tabela `setup_instruments` lista os instrumentos para os quais os eventos podem ser coletados, se estão habilitados e (para instrumentos habilitados) se devem ser coletadas informações de temporização:

  ```
  mysql> SELECT NAME, ENABLED, TIMED
         FROM performance_schema.setup_instruments;
  +---------------------------------------------------+---------+-------+
  | NAME                                              | ENABLED | TIMED |
  +---------------------------------------------------+---------+-------+
  ...
  | wait/synch/mutex/sql/LOCK_global_read_lock        | YES     | YES   |
  | wait/synch/mutex/sql/LOCK_global_system_variables | YES     | YES   |
  | wait/synch/mutex/sql/LOCK_lock_db                 | YES     | YES   |
  | wait/synch/mutex/sql/LOCK_manager                 | YES     | YES   |
  ...
  ```

  A tabela `setup_instruments` fornece a forma mais básica de controle sobre a produção de eventos. Para refinar ainda mais a produção de eventos com base no tipo de objeto ou thread que está sendo monitorado, outras tabelas podem ser usadas conforme descrito na Seção 29.4.3, “Pre-Filtragem de Eventos”.

* As tabelas do Schema de Desempenho são os destinos dos eventos e consomem eventos. A tabela `setup_consumers` lista os tipos de consumidores para os quais as informações dos eventos podem ser enviadas e se estão habilitados:

  ```
  mysql> SELECT * FROM performance_schema.setup_consumers;
  +----------------------------------+---------+
  | NAME                             | ENABLED |
  +----------------------------------+---------+
  | events_stages_current            | NO      |
  | events_stages_history            | NO      |
  | events_stages_history_long       | NO      |
  | events_statements_cpu            | NO      |
  | events_statements_current        | YES     |
  | events_statements_history        | YES     |
  | events_statements_history_long   | NO      |
  | events_transactions_current      | YES     |
  | events_transactions_history      | YES     |
  | events_transactions_history_long | NO      |
  | events_waits_current             | NO      |
  | events_waits_history             | NO      |
  | events_waits_history_long        | NO      |
  | global_instrumentation           | YES     |
  | thread_instrumentation           | YES     |
  | statements_digest                | YES     |
  +----------------------------------+---------+
  ```

A filtragem pode ser feita em diferentes estágios do monitoramento de desempenho:

* **Pre-filtragem.** Isso é feito modificando a configuração do Schema de Desempenho para que apenas certos tipos de eventos sejam coletados dos produtores, e os eventos coletados atualizam apenas certos consumidores. Para fazer isso, habilite ou desabilite instrumentos ou consumidores. A pre-filtragem é feita pelo Schema de Desempenho e tem um efeito global que se aplica a todos os usuários.

* **Razões para usar pre-filtragem:**

  + Para reduzir o overhead. O overhead do Schema de Desempenho deve ser mínimo mesmo com todos os instrumentos habilitados, mas talvez você queira reduzi-lo ainda mais. Ou você não se importa com eventos de temporização e deseja desabilitar o código de temporização para eliminar o overhead de temporização.

+ Para evitar encher as tabelas de eventos atuais ou de histórico com eventos nos quais você não tem interesse. O pré-filtro deixa mais "espaço" nessas tabelas para instâncias de linhas de tipos de instrumentos habilitados. Se você habilitar apenas instrumentos de arquivo com pré-filtro, nenhuma linha é coletada para instrumentos não de arquivo. Com o pós-filtro, eventos não de arquivo são coletados, deixando menos linhas para eventos de arquivo.

+ Para evitar manter alguns tipos de tabelas de eventos. Se você desabilitar um consumidor, o servidor não gasta tempo mantendo destinos para esse consumidor. Por exemplo, se você não se importa com as histórias de eventos, pode desabilitar os consumidores das tabelas de histórico para melhorar o desempenho.

* **Pós-filtro.** Isso envolve o uso de cláusulas `WHERE` em consultas que selecionam informações das tabelas do Schema de Desempenho, para especificar quais dos eventos disponíveis você deseja ver. O pós-filtro é realizado por usuário, pois os usuários individuais selecionam quais dos eventos disponíveis são de interesse.

Razões para usar o pós-filtro:

+ Para evitar tomar decisões para usuários individuais sobre quais informações de eventos são de interesse.

+ Para usar o Schema de Desempenho para investigar um problema de desempenho quando as restrições para impor o uso do pré-filtro não são conhecidas antecipadamente.

As seções seguintes fornecem mais detalhes sobre o pré-filtro e fornecem diretrizes para nomear instrumentos ou consumidores em operações de filtragem. Para informações sobre como escrever consultas para recuperar informações (pós-filtro), consulte a Seção 29.5, “Consultas do Schema de Desempenho”.