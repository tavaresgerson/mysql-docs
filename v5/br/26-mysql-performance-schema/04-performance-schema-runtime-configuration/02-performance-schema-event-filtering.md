### 25.4.2 Filtragem de Events no Performance Schema

Events são processados no modelo produtor/consumidor:

* O código instrumentado é a fonte dos events e produz events para serem coletados. A tabela [`setup_instruments`](performance-schema-setup-instruments-table.html "25.12.2.3 The setup_instruments Table") lista os instruments para os quais events podem ser coletados, se estão habilitados e (para instruments habilitados) se devem coletar informações de *timing*:

  ```sql
  mysql> SELECT * FROM performance_schema.setup_instruments;
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

  A tabela [`setup_instruments`](performance-schema-setup-instruments-table.html "25.12.2.3 The setup_instruments Table") fornece a forma mais básica de controle sobre a produção de events. Para refinar ainda mais a produção de events com base no tipo de objeto ou Thread sendo monitorado, outras tabelas podem ser usadas conforme descrito na [Seção 25.4.3, “Pré-Filtragem de Event”](performance-schema-pre-filtering.html "25.4.3 Event Pre-Filtering").

* As tabelas do Performance Schema são os destinos para events e consomem events. A tabela [`setup_consumers`](performance-schema-setup-consumers-table.html "25.12.2.2 The setup_consumers Table") lista os tipos de consumers para os quais as informações de event podem ser enviadas e se estão habilitados:

  ```sql
  mysql> SELECT * FROM performance_schema.setup_consumers;
  +----------------------------------+---------+
  | NAME                             | ENABLED |
  +----------------------------------+---------+
  | events_stages_current            | NO      |
  | events_stages_history            | NO      |
  | events_stages_history_long       | NO      |
  | events_statements_current        | YES     |
  | events_statements_history        | YES     |
  | events_statements_history_long   | NO      |
  | events_transactions_current      | NO      |
  | events_transactions_history      | NO      |
  | events_transactions_history_long | NO      |
  | events_waits_current             | NO      |
  | events_waits_history             | NO      |
  | events_waits_history_long        | NO      |
  | global_instrumentation           | YES     |
  | thread_instrumentation           | YES     |
  | statements_digest                | YES     |
  +----------------------------------+---------+
  ```

A filtragem pode ser realizada em diferentes estágios do monitoramento de performance:

* **Pré-filtragem (Pre-filtering).** Isso é feito modificando a configuração do Performance Schema para que apenas certos tipos de events sejam coletados dos produtores, e os events coletados atualizem apenas certos consumers. Para fazer isso, habilite ou desabilite instruments ou consumers. A pré-filtragem é realizada pelo Performance Schema e tem um efeito global que se aplica a todos os usuários.

  Razões para usar a pré-filtragem:

  + Para reduzir o *overhead*. O *overhead* do Performance Schema deve ser mínimo mesmo com todos os instruments habilitados, mas talvez você queira reduzi-lo ainda mais. Ou você não se importa com *timing events* e quer desabilitar o código de *timing* para eliminar o *timing overhead*.

  + Para evitar o preenchimento das tabelas de *current-events* ou *history* com events nos quais você não tem interesse. A pré-filtragem deixa mais “espaço” nessas tabelas para instâncias de linhas de tipos de instrument habilitados. Se você habilitar apenas *file instruments* com pré-filtragem, nenhuma linha será coletada para *nonfile instruments*. Com a pós-filtragem, *nonfile events* são coletados, deixando menos linhas para *file events*.

  + Para evitar a manutenção de alguns tipos de tabelas de event. Se você desabilitar um consumer, o servidor não gasta tempo mantendo destinos para aquele consumer. Por exemplo, se você não se importa com *event histories*, você pode desabilitar os consumers da tabela *history* para melhorar a performance.

* **Pós-filtragem (Post-filtering).** Isso envolve o uso de cláusulas `WHERE` em Queries que selecionam informações das tabelas do Performance Schema, para especificar quais dos events disponíveis você deseja ver. A pós-filtragem é executada por usuário (*per-user basis*) porque os usuários individuais selecionam quais dos events disponíveis são de interesse.

  Razões para usar a pós-filtragem:

  + Para evitar tomar decisões para usuários individuais sobre quais informações de event são de interesse.

  + Para usar o Performance Schema para investigar um problema de performance quando as restrições a serem impostas usando pré-filtragem não são conhecidas de antemão.

As seções seguintes fornecem mais detalhes sobre a pré-filtragem e diretrizes para nomear instruments ou consumers em operações de filtragem. Para informações sobre como escrever Queries para recuperar informações (pós-filtragem), consulte a [Seção 25.5, “Performance Schema Queries”](performance-schema-queries.html "25.5 Performance Schema Queries").