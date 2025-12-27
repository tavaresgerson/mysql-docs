## Monitoramento do Status do Schema de Desempenho

Existem várias variáveis de status associadas ao Schema de Desempenho:

```
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

As variáveis de status do Schema de Desempenho fornecem informações sobre a instrumentação que não pôde ser carregada ou criada devido a restrições de memória. Os nomes dessas variáveis têm várias formas:

* `Performance_schema_xxx_classes_lost` indica quantos instrumentos do tipo *`xxx`* não puderam ser carregados.

* `Performance_schema_xxx_instances_lost` indica quantos instâncias do tipo objeto *`xxx`* não puderam ser criadas.

* `Performance_schema_xxx_handles_lost` indica quantos instâncias do tipo objeto *`xxx`* não puderam ser abertas.

* `Performance_schema_locker_lost` indica quantos eventos estão "perdidos" ou não registrados.

Por exemplo, se um mutex é instrumentado na fonte do servidor, mas o servidor não consegue alocar memória para a instrumentação no tempo de execução, ele incrementa `Performance_schema_mutex_classes_lost`. O mutex ainda funciona como um objeto de sincronização (ou seja, o servidor continua a funcionar normalmente), mas os dados de desempenho para ele não são coletados. Se o instrumento puder ser alocado, ele pode ser usado para inicializar instâncias de mutex instrumentadas. Para um mutex único, como um mutex global, há apenas uma instância. Outros mutexes têm uma instância por conexão ou por página em vários caches e buffers de dados, então o número de instâncias varia ao longo do tempo. O aumento do número máximo de conexões ou do tamanho máximo de alguns buffers aumenta o número máximo de instâncias que podem ser alocadas de uma vez. Se o servidor não conseguir criar uma instância de mutex instrumentada dada, ele incrementa `Performance_schema_mutex_instances_lost`.

Suponha que as seguintes condições sejam atendidas:

* O servidor foi iniciado com a opção `--performance_schema_max_mutex_classes=200` e, portanto, tem espaço para 200 instrumentos de mutex.

* 150 instrumentos de mutex já foram carregados.
* O plugin chamado `plugin_a` contém 40 instrumentos de mutex.

* O plugin chamado `plugin_b` contém 20 instrumentos de mutex.

O servidor aloca instrumentos de mutex para os plugins dependendo do número que eles precisam e do número disponível, conforme ilustrado pela seguinte sequência de declarações:

```
INSTALL PLUGIN plugin_a
```

O servidor agora tem 150 + 40 = 190 instrumentos de mutex.

```
UNINSTALL PLUGIN plugin_a;
```

O servidor ainda tem 190 instrumentos. Todos os dados históricos gerados pelo código do plugin ainda estão disponíveis, mas novos eventos para os instrumentos não são coletados.

```
INSTALL PLUGIN plugin_a;
```

O servidor detecta que os 40 instrumentos já estão definidos, então nenhum novo instrumento é criado e os buffers de memória interna previamente atribuídos são reutilizados. O servidor ainda tem 190 instrumentos.

```
INSTALL PLUGIN plugin_b;
```

O servidor tem espaço para 200 - 190 = 10 instrumentos (neste caso, classes de mutex), e vê que o plugin contém 20 novos instrumentos. 10 instrumentos são carregados e 10 são descartados ou "perdidos". O `Performance_schema_mutex_classes_lost` indica o número de instrumentos (classes de mutex) perdidos:

```
mysql> SHOW STATUS LIKE "perf%mutex_classes_lost";
+---------------------------------------+-------+
| Variable_name                         | Value |
+---------------------------------------+-------+
| Performance_schema_mutex_classes_lost | 10    |
+---------------------------------------+-------+
1 row in set (0.10 sec)
```

A instrumentação ainda funciona e coleta (dados) parciais para `plugin_b`.

Quando o servidor não consegue criar um instrumento de mutex, esses resultados ocorrem:

* Não é inserida uma linha para o instrumento na tabela `setup_instruments`.

* `Performance_schema_mutex_classes_lost` aumenta em 1.

* `Performance_schema_mutex_instances_lost` não muda. (Quando o instrumento de mutex não é criado, ele não pode ser usado para criar instâncias de mutex instrumentadas mais tarde.)

O padrão descrito acima se aplica a todos os tipos de instrumentos, não apenas a mutexes.

Um valor de `Performance_schema_mutex_classes_lost` maior que 0 pode ocorrer em dois casos:

* Para economizar alguns bytes de memória, você inicia o servidor com `--performance_schema_max_mutex_classes=N`, onde *`N`* é menor que o valor padrão. O valor padrão é escolhido para ser suficiente para carregar todos os plugins fornecidos na distribuição do MySQL, mas isso pode ser reduzido se alguns plugins nunca forem carregados. Por exemplo, você pode optar por não carregar alguns dos motores de armazenamento na distribuição.

* Você carrega um plugin de terceiros que é instrumentado para o Schema de Desempenho, mas não permite que os requisitos de memória de instrumentação do plugin sejam considerados quando você inicia o servidor. Como ele vem de um terceiro, o consumo de memória do instrumento deste motor não é contabilizado no valor padrão escolhido para `performance_schema_max_mutex_classes`.

* Se o servidor tiver recursos insuficientes para os instrumentos do plugin e você não alocar explicitamente mais usando `--performance_schema_max_mutex_classes=N`, o carregamento do plugin leva à fome dos instrumentos.

Se o valor escolhido para `performance_schema_max_mutex_classes` for muito pequeno, nenhum erro é relatado no log de erro e não há falha no runtime. No entanto, o conteúdo das tabelas no banco de dados `performance_schema` perde eventos. A variável de status `Performance_schema_mutex_classes_lost` é o único sinal visível para indicar que alguns eventos foram descartados internamente devido à falha na criação de instrumentos.

Se um instrumento não for perdido, ele é conhecido pelo Schema de Desempenho e é usado ao instrmentar instâncias. Por exemplo, `wait/synch/mutex/sql/LOCK_delete` é o nome de um instrumento de mutex na tabela `setup_instruments`. Esse único instrumento é usado ao criar um mutex no código (em `THD::LOCK_delete`), no entanto, quantos instâncias do mutex forem necessárias à medida que o servidor estiver em execução. Neste caso, `LOCK_delete` é um mutex que é por conexão (`THD`), então, se um servidor tiver 1000 conexões, há 1000 threads e 1000 instâncias instrumentadas de mutex `LOCK_delete` (`THD::LOCK_delete`).

Se o servidor não tiver espaço para todas essas 1000 instâncias instrumentadas (de mutex), alguns mutexes são criados com instrumentação e outros são criados sem instrumentação. Se o servidor puder criar apenas 800 instâncias, 200 instâncias são perdidas. O servidor continua em execução, mas incrementa `Performance_schema_mutex_instances_lost` em 200 para indicar que as instâncias não puderam ser criadas.

Um valor de `Performance_schema_mutex_instances_lost` maior que 0 pode ocorrer quando o código inicializa mais mutexes em tempo de execução do que foram alocados para `--performance_schema_max_mutex_instances=N`.

O ponto final é que, se `SHOW STATUS LIKE 'perf%'` diz que nada foi perdido (todos os valores são zero), os dados do Schema de Desempenho são precisos e podem ser confiáveis. Se algo foi perdido, os dados são incompletos e o Schema de Desempenho não conseguiu registrar tudo devido à quantidade insuficiente de memória que recebeu para usar. Neste caso, a variável específica `Performance_schema_xxx_lost` indica a área do problema.

Em alguns casos, pode ser apropriado causar a escassez deliberada de instrumentos. Por exemplo, se você não se importar com os dados de desempenho do I/O de arquivos, pode iniciar o servidor com todos os parâmetros do Schema de Desempenho relacionados ao I/O de arquivos definidos como 0. Nenhuma memória é alocada para as classes, instâncias ou manipuláveis relacionados aos arquivos, e todos os eventos de arquivo são perdidos.

Use `SHOW ENGINE PERFORMANCE_SCHEMA STATUS` para inspecionar o funcionamento interno do código do Schema de Desempenho:

```
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

Esta declaração destina-se a ajudar o DBA a entender os efeitos que diferentes opções do Schema de Desempenho têm nos requisitos de memória. Para uma descrição dos significados dos campos, consulte a Seção 15.7.7.17, “Declaração SHOW ENGINE”.