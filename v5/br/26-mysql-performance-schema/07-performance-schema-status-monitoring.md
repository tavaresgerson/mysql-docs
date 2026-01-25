## 25.7 Monitoramento de Status do Performance Schema

Existem diversas variáveis de status associadas ao Performance Schema:

```sql
mysql> SHOW STATUS LIKE 'perf%';
+-----------------------------------------------+-------+
| Variable_name                                 | Value |
+-----------------------------------------------+-------+
| Performance_schema_accounts_lost              | 0     |
| Performance_schema_cond_classes_lost          | 0     |
| Performance_schema_cond_instances_lost        | 0     |
| Performance_schema_digest_lost                | 0     |
| Performance_schema_file_classes_lost          | 0     |
| Performance_schema_file_handles_lost          | 0     |
| Performance_schema_file_instances_lost        | 0     |
| Performance_schema_hosts_lost                 | 0     |
| Performance_schema_locker_lost                | 0     |
| Performance_schema_memory_classes_lost        | 0     |
| Performance_schema_metadata_lock_lost         | 0     |
| Performance_schema_mutex_classes_lost         | 0     |
| Performance_schema_mutex_instances_lost       | 0     |
| Performance_schema_nested_statement_lost      | 0     |
| Performance_schema_program_lost               | 0     |
| Performance_schema_rwlock_classes_lost        | 0     |
| Performance_schema_rwlock_instances_lost      | 0     |
| Performance_schema_session_connect_attrs_lost | 0     |
| Performance_schema_socket_classes_lost        | 0     |
| Performance_schema_socket_instances_lost      | 0     |
| Performance_schema_stage_classes_lost         | 0     |
| Performance_schema_statement_classes_lost     | 0     |
| Performance_schema_table_handles_lost         | 0     |
| Performance_schema_table_instances_lost       | 0     |
| Performance_schema_thread_classes_lost        | 0     |
| Performance_schema_thread_instances_lost      | 0     |
| Performance_schema_users_lost                 | 0     |
+-----------------------------------------------+-------+
```

As variáveis de status do Performance Schema fornecem informações sobre a instrumentação que não pôde ser carregada ou criada devido a restrições de memória. Os nomes dessas variáveis têm diversas formas:

* `Performance_schema_xxx_classes_lost` indica quantos instrumentos do tipo *`xxx`* não puderam ser carregados.

* `Performance_schema_xxx_instances_lost` indica quantas instâncias (Instances) do tipo de objeto *`xxx`* não puderam ser criadas.

* `Performance_schema_xxx_handles_lost` indica quantos Handles do tipo de objeto *`xxx`* não puderam ser abertos.

* `Performance_schema_locker_lost` indica quantos eventos foram “perdidos” (lost) ou não registrados.

Por exemplo, se um Mutex é instrumentado no código fonte do servidor, mas o servidor não consegue alocar memória para a instrumentação em tempo de execução (runtime), ele incrementa [`Performance_schema_mutex_classes_lost`](performance-schema-status-variables.html#statvar_Performance_schema_mutex_classes_lost). O Mutex ainda funciona como um objeto de sincronização (ou seja, o servidor continua a funcionar normalmente), mas os dados de performance para ele não são coletados. Se o instrumento puder ser alocado, ele pode ser usado para inicializar instâncias de Mutex instrumentadas. Para um Mutex singleton, como um Mutex global, há apenas uma instância. Outros Mutexes têm uma instância por conexão, ou por página em vários Caches e Data Buffers, portanto, o número de instâncias varia ao longo do tempo. Aumentar o número máximo de conexões ou o tamanho máximo de alguns Buffers aumenta o número máximo de instâncias que podem ser alocadas de uma vez. Se o servidor não puder criar uma determinada instância de Mutex instrumentada, ele incrementa [`Performance_schema_mutex_instances_lost`](performance-schema-status-variables.html#statvar_Performance_schema_mutex_instances_lost).

Suponha que as seguintes condições se apliquem:

* O servidor foi iniciado com a opção [`--performance_schema_max_mutex_classes=200`](performance-schema-system-variables.html#sysvar_performance_schema_max_mutex_classes) e, portanto, tem espaço para 200 instrumentos Mutex.

* 150 instrumentos Mutex já foram carregados.
* O Plugin chamado `plugin_a` contém 40 instrumentos Mutex.

* O Plugin chamado `plugin_b` contém 20 instrumentos Mutex.

O servidor aloca instrumentos Mutex para os Plugins dependendo de quantos eles precisam e quantos estão disponíveis, conforme ilustrado pela seguinte sequência de comandos:

```sql
INSTALL PLUGIN plugin_a
```

O servidor agora tem 150+40 = 190 instrumentos Mutex.

```sql
UNINSTALL PLUGIN plugin_a;
```

O servidor ainda tem 190 instrumentos. Todos os dados históricos gerados pelo código do Plugin ainda estão disponíveis, mas novos eventos para os instrumentos não são coletados.

```sql
INSTALL PLUGIN plugin_a;
```

O servidor detecta que os 40 instrumentos já estão definidos, portanto, nenhum novo instrumento é criado, e os Buffers de memória internos previamente atribuídos são reutilizados. O servidor ainda tem 190 instrumentos.

```sql
INSTALL PLUGIN plugin_b;
```

O servidor tem espaço para 200-190 = 10 instrumentos (neste caso, Mutex Classes), e vê que o Plugin contém 20 novos instrumentos. 10 instrumentos são carregados e 10 são descartados ou “perdidos” (lost). A variável [`Performance_schema_mutex_classes_lost`](performance-schema-status-variables.html#statvar_Performance_schema_mutex_classes_lost) indica o número de instrumentos (Mutex Classes) perdidos:

```sql
mysql> SHOW STATUS LIKE "perf%mutex_classes_lost";
+---------------------------------------+-------+
| Variable_name                         | Value |
+---------------------------------------+-------+
| Performance_schema_mutex_classes_lost | 10    |
+---------------------------------------+-------+
1 row in set (0.10 sec)
```

A instrumentação ainda funciona e coleta dados (parciais) para o `plugin_b`.

Quando o servidor não consegue criar um instrumento Mutex, ocorrem os seguintes resultados:

* Nenhuma linha para o instrumento é inserida na tabela [`setup_instruments`](performance-schema-setup-instruments-table.html "25.12.2.3 The setup_instruments Table").

* [`Performance_schema_mutex_classes_lost`](performance-schema-status-variables.html#statvar_Performance_schema_mutex_classes_lost) aumenta em 1.

* [`Performance_schema_mutex_instances_lost`](performance-schema-status-variables.html#statvar_Performance_schema_mutex_instances_lost) não muda. (Quando o instrumento Mutex não é criado, ele não pode ser usado para criar instâncias de Mutex instrumentadas posteriormente.)

O padrão que acabamos de descrever se aplica a todos os tipos de instrumentos, não apenas aos Mutexes.

Um valor para [`Performance_schema_mutex_classes_lost`](performance-schema-status-variables.html#statvar_Performance_schema_mutex_classes_lost) maior que 0 pode ocorrer em dois casos:

* Para economizar alguns bytes de memória, você inicia o servidor com [`--performance_schema_max_mutex_classes=N`](performance-schema-system-variables.html#sysvar_performance_schema_max_mutex_classes), onde *`N`* é menor que o valor padrão. O valor padrão é escolhido para ser suficiente para carregar todos os Plugins fornecidos na distribuição do MySQL, mas isso pode ser reduzido se alguns Plugins nunca forem carregados. Por exemplo, você pode optar por não carregar alguns dos Storage Engines (Mecanismos de Armazenamento) na distribuição.

* Você carrega um Plugin de terceiros que é instrumentado para o Performance Schema, mas não considera os requisitos de memória de instrumentação do Plugin ao iniciar o servidor. Como ele vem de terceiros, o consumo de memória de instrumento deste Engine não é contabilizado no valor padrão escolhido para [`performance_schema_max_mutex_classes`](performance-schema-system-variables.html#sysvar_performance_schema_max_mutex_classes). Se o servidor tiver recursos insuficientes para os instrumentos do Plugin e você não alocar explicitamente mais usando [`--performance_schema_max_mutex_classes=N`](performance-schema-system-variables.html#sysvar_performance_schema_max_mutex_classes), o carregamento do Plugin leva à exaustão (starvation) de instrumentos.

Se o valor escolhido para [`performance_schema_max_mutex_classes`](performance-schema-system-variables.html#sysvar_performance_schema_max_mutex_classes) for muito pequeno, nenhum erro é relatado no Error Log e não há falha em tempo de execução (runtime). No entanto, o conteúdo das tabelas no Database `performance_schema` perde eventos. A variável de status [`Performance_schema_mutex_classes_lost`](performance-schema-status-variables.html#statvar_Performance_schema_mutex_classes_lost) é o único sinal visível para indicar que alguns eventos foram descartados internamente devido à falha na criação de instrumentos.

Se um instrumento não for perdido, ele é conhecido pelo Performance Schema e é usado ao instrumentar instâncias. Por exemplo, `wait/synch/mutex/sql/LOCK_delete` é o nome de um instrumento Mutex na tabela [`setup_instruments`](performance-schema-setup-instruments-table.html "25.12.2.3 The setup_instruments Table"). Este único instrumento é usado ao criar um Mutex no código (em `THD::LOCK_delete`), independentemente de quantas instâncias do Mutex sejam necessárias enquanto o servidor é executado. Neste caso, `LOCK_delete` é um Mutex que é por conexão (`THD`), então se um servidor tem 1000 conexões, há 1000 Threads e 1000 instâncias de Mutex `LOCK_delete` instrumentadas (`THD::LOCK_delete`).

Se o servidor não tiver espaço para todos esses 1000 Mutexes instrumentados (instâncias), alguns Mutexes são criados com instrumentação, e alguns são criados sem instrumentação. Se o servidor puder criar apenas 800 instâncias, 200 instâncias são perdidas. O servidor continua a ser executado, mas incrementa [`Performance_schema_mutex_instances_lost`](performance-schema-status-variables.html#statvar_Performance_schema_mutex_instances_lost) em 200 para indicar que as instâncias não puderam ser criadas.

Um valor para [`Performance_schema_mutex_instances_lost`](performance-schema-status-variables.html#statvar_Performance_schema_mutex_instances_lost) maior que 0 pode ocorrer quando o código inicializa mais Mutexes em tempo de execução (runtime) do que foi alocado para [`--performance_schema_max_mutex_instances=N`](performance-schema-system-variables.html#sysvar_performance_schema_max_mutex_instances).

A conclusão é que, se [`SHOW STATUS LIKE 'perf%'`](show-status.html "13.7.5.35 SHOW STATUS Statement") indicar que nada foi perdido (todos os valores são zero), os dados do Performance Schema são precisos e confiáveis. Se algo foi perdido, os dados estão incompletos, e o Performance Schema não pôde registrar tudo devido à quantidade insuficiente de memória que lhe foi designada para uso. Neste caso, a variável específica `Performance_schema_xxx_lost` indica a área do problema.

Em alguns casos, pode ser apropriado causar uma exaustão deliberada (starvation) de instrumentos. Por exemplo, se você não se importa com os dados de performance para I/O de arquivos, você pode iniciar o servidor com todos os parâmetros do Performance Schema relacionados ao I/O de arquivos definidos como 0. Nenhuma memória é alocada para Classes, instâncias ou Handles relacionados a arquivos, e todos os eventos de arquivo são perdidos.

Use [`SHOW ENGINE PERFORMANCE_SCHEMA STATUS`](show-engine.html "13.7.5.15 SHOW ENGINE Statement") para inspecionar a operação interna do código do Performance Schema:

```sql
mysql> SHOW ENGINE PERFORMANCE_SCHEMA STATUS\G
...
*************************** 3. row ***************************
  Type: performance_schema
  Name: events_waits_history.size
Status: 76
*************************** 4. row ***************************
  Type: performance_schema
  Name: events_waits_history.count
Status: 10000
*************************** 5. row ***************************
  Type: performance_schema
  Name: events_waits_history.memory
Status: 760000
...
*************************** 57. row ***************************
  Type: performance_schema
  Name: performance_schema.memory
Status: 26459600
...
```

Este comando tem como objetivo ajudar o DBA a entender os efeitos que diferentes opções do Performance Schema têm nos requisitos de memória. Para uma descrição dos significados dos campos, consulte [Seção 13.7.5.15, “SHOW ENGINE Statement”](show-engine.html "13.7.5.15 SHOW ENGINE Statement").