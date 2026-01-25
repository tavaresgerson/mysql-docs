## 25.3 Configuração de Inicialização do Performance Schema

Para usar o MySQL Performance Schema, ele deve ser habilitado na inicialização do servidor para permitir que a coleta de eventos ocorra.

Assumindo que o Performance Schema esteja disponível, ele é habilitado por padrão. Para habilitá-lo ou desabilitá-lo explicitamente, inicie o servidor com a variável [`performance_schema`](performance-schema-system-variables.html#sysvar_performance_schema) definida com um valor apropriado. Por exemplo, use estas linhas no seu arquivo `my.cnf`:

```sql
[mysqld]
performance_schema=ON
```

Se o servidor for incapaz de alocar qualquer *buffer* interno durante a inicialização do Performance Schema, o Performance Schema se desabilita, define [`performance_schema`](performance-schema-system-variables.html#sysvar_performance_schema) como `OFF`, e o servidor é executado sem *instrumentation*.

O Performance Schema também permite a configuração de *instrument* e *consumer* na inicialização do servidor.

Para controlar um *instrument* na inicialização do servidor, use uma opção neste formato:

```sql
--performance-schema-instrument='instrument_name=value'
```

Aqui, *`instrument_name`* é um nome de *instrument* como `wait/synch/mutex/sql/LOCK_open`, e *`value`* é um destes valores:

* `OFF`, `FALSE`, ou `0`: Desabilita o *instrument*

* `ON`, `TRUE`, ou `1`: Habilita e cronometra (*time*) o *instrument*

* `COUNTED`: Habilita e conta (em vez de cronometrar) o *instrument*

Cada opção [`--performance-schema-instrument`](performance-schema-options.html#option_mysqld_performance-schema-instrument) pode especificar apenas um nome de *instrument*, mas múltiplas instâncias da opção podem ser fornecidas para configurar vários *instruments*. Além disso, *patterns* são permitidos nos nomes dos *instruments* para configurar *instruments* que correspondam ao *pattern*. Para configurar todos os *instruments* de sincronização de condição como habilitados e contados, use esta opção:

```sql
--performance-schema-instrument='wait/synch/cond/%=COUNTED'
```

Para desabilitar todos os *instruments*, use esta opção:

```sql
--performance-schema-instrument='%=OFF'
```

Exceção: Os *instruments* `memory/performance_schema/%` são embutidos e não podem ser desabilitados na inicialização.

*Strings* de nome de *instrument* mais longas têm precedência sobre nomes de *pattern* mais curtos, independentemente da ordem. Para obter informações sobre como especificar *patterns* para selecionar *instruments*, consulte [Section 25.4.9, “Naming Instruments or Consumers for Filtering Operations”](performance-schema-filtering-names.html "25.4.9 Naming Instruments or Consumers for Filtering Operations").

Um nome de *instrument* não reconhecido é ignorado. É possível que um *plugin* instalado posteriormente possa criar o *instrument*, momento em que o nome é reconhecido e configurado.

Para controlar um *consumer* na inicialização do servidor, use uma opção neste formato:

```sql
--performance-schema-consumer-consumer_name=value
```

Aqui, *`consumer_name`* é um nome de *consumer* como `events_waits_history`, e *`value`* é um destes valores:

* `OFF`, `FALSE`, ou `0`: Não coleta eventos para o *consumer*

* `ON`, `TRUE`, ou `1`: Coleta eventos para o *consumer*

Por exemplo, para habilitar o *consumer* `events_waits_history`, use esta opção:

```sql
--performance-schema-consumer-events-waits-history=ON
```

Os nomes de *consumer* permitidos podem ser encontrados examinando a tabela [`setup_consumers`](performance-schema-setup-consumers-table.html "25.12.2.2 The setup_consumers Table"). *Patterns* não são permitidos. Os nomes de *consumer* na tabela [`setup_consumers`](performance-schema-setup-consumers-table.html "25.12.2.2 The setup_consumers Table") usam *underscores*, mas para *consumers* definidos na inicialização, hífens e *underscores* dentro do nome são equivalentes.

O Performance Schema inclui várias variáveis de sistema que fornecem informações de configuração:

```sql
mysql> SHOW VARIABLES LIKE 'perf%';
+--------------------------------------------------------+---------+
| Variable_name                                          | Value   |
+--------------------------------------------------------+---------+
| performance_schema                                     | ON      |
| performance_schema_accounts_size                       | 100     |
| performance_schema_digests_size                        | 200     |
| performance_schema_events_stages_history_long_size     | 10000   |
| performance_schema_events_stages_history_size          | 10      |
| performance_schema_events_statements_history_long_size | 10000   |
| performance_schema_events_statements_history_size      | 10      |
| performance_schema_events_waits_history_long_size      | 10000   |
| performance_schema_events_waits_history_size           | 10      |
| performance_schema_hosts_size                          | 100     |
| performance_schema_max_cond_classes                    | 80      |
| performance_schema_max_cond_instances                  | 1000    |
...
```

A variável [`performance_schema`](performance-schema-system-variables.html#sysvar_performance_schema) é `ON` ou `OFF` para indicar se o Performance Schema está habilitado ou desabilitado. As outras variáveis indicam tamanhos de tabela (número de linhas) ou valores de alocação de memória.

Nota

Com o Performance Schema habilitado, o número de instâncias do Performance Schema afeta a pegada de memória (*memory footprint*) do servidor, talvez em grande escala. O Performance Schema *autoscales* muitos parâmetros para usar memória apenas conforme o necessário; consulte [Section 25.17, “The Performance Schema Memory-Allocation Model”](performance-schema-memory-model.html "25.17 The Performance Schema Memory-Allocation Model").

Para alterar o valor das variáveis de sistema do Performance Schema, defina-as na inicialização do servidor. Por exemplo, coloque as seguintes linhas em um arquivo `my.cnf` para alterar os tamanhos das tabelas de histórico para eventos de *wait*:

```sql
[mysqld]
performance_schema
performance_schema_events_waits_history_size=20
performance_schema_events_waits_history_long_size=15000
```

O Performance Schema dimensiona automaticamente os valores de vários de seus parâmetros na inicialização do servidor se eles não forem definidos explicitamente. Por exemplo, ele dimensiona dessa forma os parâmetros que controlam os tamanhos das tabelas de *events waits*. O Performance Schema aloca memória incrementalmente, escalando seu uso de memória conforme a carga real do servidor, em vez de alocar toda a memória necessária durante a inicialização do servidor. Consequentemente, muitos parâmetros de dimensionamento não precisam ser definidos. Para ver quais parâmetros são *autosized* ou *autoscaled*, use [**mysqld --verbose --help**](mysqld.html "4.3.1 mysqld — The MySQL Server") e examine as descrições das opções, ou consulte [Section 25.15, “Performance Schema System Variables”](performance-schema-system-variables.html "25.15 Performance Schema System Variables").

Para cada parâmetro *autosized* que não é definido na inicialização do servidor, o Performance Schema determina como definir seu valor com base no valor das seguintes variáveis de sistema, que são consideradas como “dicas” sobre como você configurou seu servidor MySQL:

```sql
max_connections
open_files_limit
table_definition_cache
table_open_cache
```

Para substituir (*override*) o *autosizing* ou *autoscaling* de um determinado parâmetro, defina-o com um valor diferente de −1 na inicialização. Neste caso, o Performance Schema atribui-lhe o valor especificado.

Em tempo de execução (*runtime*), [`SHOW VARIABLES`](show-variables.html "13.7.5.39 SHOW VARIABLES Statement") exibe os valores reais para os quais os parâmetros *autosized* foram definidos. Parâmetros *autoscaled* são exibidos com o valor de −1.

Se o Performance Schema estiver desabilitado, seus parâmetros *autosized* e *autoscaled* permanecem definidos como −1 e [`SHOW VARIABLES`](show-variables.html "13.7.5.39 SHOW VARIABLES Statement") exibe −1.