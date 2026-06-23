## 29.3 Configuração de inicialização do esquema de desempenho

Para usar o Schema de Desempenho do MySQL, ele deve ser habilitado na inicialização do servidor para permitir a coleta de eventos.

O Schema de desempenho é ativado por padrão. Para ativá-lo ou desativá-lo explicitamente, inicie o servidor com a variável `performance_schema` definida com um valor apropriado. Por exemplo, use essas linhas no arquivo do servidor `my.cnf`:

```
[mysqld]
performance_schema=ON
```

Se o servidor não conseguir alocar nenhum buffer interno durante a inicialização do Gerador de Desempenho, o Gerador de Desempenho desativa a si mesmo e define `performance_schema` para `OFF`, e o servidor é executado sem instrumentação.

O Schema de Desempenho também permite a configuração de instrumentos e consumidores no início da inicialização do servidor.

Para controlar um instrumento no início da inicialização do servidor, use uma opção deste tipo:

```
--performance-schema-instrument='instrument_name=value'
```

Aqui, *`instrument_name`* é o nome de um instrumento, como `wait/synch/mutex/sql/LOCK_open`, e *`value`* é um desses valores:

* `OFF`, `FALSE` ou `0`: Desative o instrumento

* `ON`, `TRUE` ou `1`: Ative e ajuste o instrumento

* `COUNTED`: Ative e contabilize (em vez de medir) o instrumento

Cada opção `--performance-schema-instrument` pode especificar apenas um nome de instrumento, mas múltiplas instâncias da opção podem ser fornecidas para configurar vários instrumentos. Além disso, padrões são permitidos nos nomes de instrumentos para configurar instrumentos que correspondem ao padrão. Para configurar todos os instrumentos de sincronização de condição como habilitados e contados, use esta opção:

```
--performance-schema-instrument='wait/synch/cond/%=COUNTED'
```

Para desativar todos os instrumentos, use esta opção:

```
--performance-schema-instrument='%=OFF'
```

Exceção: Os instrumentos `memory/performance_schema/%` são construídos internamente e não podem ser desativados na inicialização.

Nomes de strings de instrumentos mais longos têm precedência sobre nomes de padrões mais curtos, independentemente da ordem. Para obter informações sobre a especificação de padrões para selecionar instrumentos, consulte a Seção 29.4.9, “Nomeando instrumentos ou consumidores para operações de filtragem”.

Um nome de instrumento não reconhecido é ignorado. É possível que um plugin instalado posteriormente crie o instrumento, e, nesse momento, o nome é reconhecido e configurado.

Para controlar um consumidor no início da inicialização do servidor, use uma opção deste tipo:

```
--performance-schema-consumer-consumer_name=value
```

Aqui, *`consumer_name`* é um nome de consumidor, como `events_waits_history`, e *`value`* é um desses valores:

* `OFF`, `FALSE` ou `0`: Não colete eventos para o consumidor

* `ON`, `TRUE` ou `1`: Colete eventos para o consumidor

Por exemplo, para habilitar o consumidor `events_waits_history`, use esta opção:

```
--performance-schema-consumer-events-waits-history=ON
```

Os nomes de consumidor permitidos podem ser encontrados examinando a tabela `setup_consumers`. Padrões não são permitidos. Os nomes de consumidor na tabela `setup_consumers` usam sublinhados, mas para consumidores definidos no início, traços e sublinhados dentro do nome são equivalentes.

O Schema de Desempenho inclui várias variáveis do sistema que fornecem informações de configuração:

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

Nota

Com o Schema de desempenho habilitado, o número de instâncias do Schema de desempenho afeta a pegada de memória do servidor, talvez em grande medida. O Schema de desempenho autoescala muitos parâmetros para usar memória apenas conforme necessário; veja a Seção 29.17, “O modelo de alocação de memória do Schema de desempenho”.

Para alterar o valor das variáveis do sistema do Schema de desempenho, defina-as na inicialização do servidor. Por exemplo, coloque as seguintes linhas em um arquivo `my.cnf` para alterar os tamanhos das tabelas de histórico para eventos de espera:

```
[mysqld]
performance_schema
performance_schema_events_waits_history_size=20
performance_schema_events_waits_history_long_size=15000
```

O Schema de Desempenho dimensiona automaticamente os valores de vários de seus parâmetros ao iniciar o servidor, se não forem definidos explicitamente. Por exemplo, ele dimensiona os parâmetros que controlam o tamanho das tabelas de espera dos eventos dessa maneira. O Schema de Desempenho aloca memória incrementalmente, escalando seu uso de memória para a carga real do servidor, em vez de alocar toda a memória que ele precisa durante o início do servidor. Consequentemente, muitos dos parâmetros de dimensionamento não precisam ser definidos. Para ver quais parâmetros são autodimensionados ou autoescalados, use **mysqld --verbose --help** e examine as descrições das opções, ou veja a Seção 29.15, “Variáveis do Sistema do Schema de Desempenho”.

Para cada parâmetro autodimensionado que não é definido na inicialização do servidor, o Schema de Desempenho determina como definir seu valor com base no valor dos seguintes valores do sistema, que são considerados como “dicas” sobre como você configurou seu servidor MySQL:

```
max_connections
open_files_limit
table_definition_cache
table_open_cache
```

Para substituir o dimensionamento automático ou a escalação automática para um parâmetro específico, configure-o para um valor diferente de -1 na inicialização. Nesse caso, o Gerador de Desempenho atribui o valor especificado.

Em tempo de execução, `SHOW VARIABLES` exibe os valores reais nos quais os parâmetros autodimensionados foram definidos. Os parâmetros autodimensionados são exibidos com um valor de -1.

Se o Schema de desempenho estiver desativado, seus parâmetros de tamanho automático e escala automática permanecem definidos como -1 e `SHOW VARIABLES` exibe -1.