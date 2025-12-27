## Configuração de Inicialização do Schema de Desempenho

Para usar o Schema de Desempenho MySQL, ele deve ser habilitado durante a inicialização do servidor para permitir a coleta de eventos.

O Schema de Desempenho é habilitado por padrão. Para habilitá-lo ou desabilitá-lo explicitamente, inicie o servidor com a variável `performance_schema` definida para um valor apropriado. Por exemplo, use essas linhas no arquivo `my.cnf` do servidor:

```
[mysqld]
performance_schema=ON
```

Se o servidor não conseguir alocar nenhum buffer interno durante a inicialização do Schema de Desempenho, o Schema de Desempenho desabilita-se e define `performance_schema` para `OFF`, e o servidor é executado sem instrumentação.

O Schema de Desempenho também permite a configuração de instrumentos e consumidores durante a inicialização do servidor.

Para controlar um instrumento durante a inicialização do servidor, use uma opção da seguinte forma:

```
--performance-schema-instrument='instrument_name=value'
```

Aqui, *`instrument_name`* é o nome de um instrumento, como `wait/synch/mutex/sql/LOCK_open`, e *`value`* é um desses valores:

* `OFF`, `FALSE`, ou `0`: Desabilitar o instrumento

* `ON`, `TRUE`, ou `1`: Habilitar e medir o tempo do instrumento

* `COUNTED`: Habilitar e contar (em vez de medir o tempo) o instrumento

Cada opção `--performance-schema-instrument` pode especificar apenas um nome de instrumento, mas múltiplas instâncias da opção podem ser fornecidas para configurar vários instrumentos. Além disso, padrões são permitidos nos nomes de instrumentos para configurar instrumentos que correspondem ao padrão. Para configurar todos os instrumentos de sincronização de condições como habilitados e contados, use esta opção:

```
--performance-schema-instrument='wait/synch/cond/%=COUNTED'
```

Para desabilitar todos os instrumentos, use esta opção:

```
--performance-schema-instrument='%=OFF'
```

Exceção: Os instrumentos `memory/performance_schema/%` são pré-construídos e não podem ser desabilitados durante a inicialização.

Cadeias de nomes de instrumentos mais longas têm precedência sobre nomes de padrões mais curtos, independentemente da ordem. Para obter informações sobre como especificar padrões para selecionar instrumentos, consulte a Seção 29.4.9, “Nomeação de Instrumentos ou Consumidores para Operações de Filtragem”.

Um nome de instrumento não reconhecido é ignorado. É possível que um plugin instalado posteriormente crie o instrumento, momento em que o nome é reconhecido e configurado.

Para controlar um consumidor ao iniciar o servidor, use uma opção da seguinte forma:

```
--performance-schema-consumer-consumer_name=value
```

Aqui, *`consumer_name`* é um nome de consumidor, como `events_waits_history`, e *`value`* é um desses valores:

* `OFF`, `FALSE` ou `0`: Não coletar eventos para o consumidor
* `ON`, `TRUE` ou `1`: Coletar eventos para o consumidor

Por exemplo, para habilitar o consumidor `events_waits_history`, use esta opção:

```
--performance-schema-consumer-events-waits-history=ON
```

Os nomes de consumidores permitidos podem ser encontrados examinando a tabela `setup_consumers`. Padrões não são permitidos. Os nomes de consumidores na tabela `setup_consumers` usam sublinhados, mas para consumidores configurados ao iniciar, sublinhados e sublinhados dentro do nome são equivalentes.

O Schema de Desempenho inclui várias variáveis de sistema que fornecem informações de configuração:

```
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

A variável `performance_schema` é `ON` ou `OFF` para indicar se o Schema de Desempenho está habilitado ou desabilitado. As outras variáveis indicam tamanhos de tabela (número de linhas) ou valores de alocação de memória.

Observação

Com o Schema de Desempenho habilitado, o número de instâncias do Schema de Desempenho afeta a pegada de memória do servidor, talvez em grande medida. O Schema de Desempenho autoescala muitos parâmetros para usar memória apenas conforme necessário; consulte a Seção 29.17, “O Modelo de Alocação de Memória do Schema de Desempenho”.

Para alterar o valor das variáveis do sistema do Schema de Desempenho, defina-as na inicialização do servidor. Por exemplo, coloque as seguintes linhas em um arquivo `my.cnf` para alterar os tamanhos das tabelas de histórico para eventos de espera:

```
[mysqld]
performance_schema
performance_schema_events_waits_history_size=20
performance_schema_events_waits_history_long_size=15000
```

O Schema de Desempenho define automaticamente os valores de vários de seus parâmetros na inicialização do servidor, se não forem definidos explicitamente. Por exemplo, define os parâmetros que controlam os tamanhos das tabelas de espera de eventos dessa maneira. O Schema de Desempenho aloca memória incrementalmente, escalando seu uso de memória para a carga real do servidor, em vez de alocar toda a memória necessária durante a inicialização do servidor. Consequentemente, muitos parâmetros de dimensionamento podem não precisar ser definidos. Para ver quais parâmetros são dimensionados automaticamente ou escalados, use **mysqld --verbose --help** e examine as descrições das opções, ou veja a Seção 29.15, “Variáveis do Sistema do Schema de Desempenho”.

Para cada parâmetro dimensionado automaticamente que não é definido na inicialização do servidor, o Schema de Desempenho determina como definir seu valor com base no valor dos seguintes valores do sistema, que são considerados como “dicas” sobre como você configurou seu servidor MySQL:

```
max_connections
open_files_limit
table_definition_cache
table_open_cache
```

Para sobrescrever o dimensionamento automático ou a escala automática para um determinado parâmetro, defina-o para um valor diferente de −1 na inicialização. Nesse caso, o Schema de Desempenho atribui o valor especificado.

No tempo de execução, `SHOW VARIABLES` exibe os valores reais para os quais os parâmetros dimensionados automaticamente foram definidos. Os parâmetros escalados são exibidos com um valor de −1.

Se o Schema de Desempenho estiver desativado, seus parâmetros dimensionados automaticamente e escalados permanecem definidos para −1 e `SHOW VARIABLES` exibe −1.