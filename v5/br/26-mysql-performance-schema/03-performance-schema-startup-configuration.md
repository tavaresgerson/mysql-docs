## 25.3 Configuração de inicialização do esquema de desempenho

Para usar o Schema de Desempenho do MySQL, ele deve ser habilitado durante a inicialização do servidor para que a coleta de eventos possa ocorrer.

Supondo que o Schema de Desempenho esteja disponível, ele está ativado por padrão. Para ativá-lo ou desativá-lo explicitamente, inicie o servidor com a variável `performance_schema` definida para um valor apropriado. Por exemplo, use essas linhas em seu arquivo `my.cnf`:

```sql
[mysqld]
performance_schema=ON
```

Se o servidor não conseguir alocar nenhum buffer interno durante a inicialização do Schema de Desempenho, o Schema de Desempenho desabilita-se e define `performance_schema` para `OFF`, e o servidor é executado sem instrumentação.

O Schema de Desempenho também permite a configuração de instrumentos e consumidores no início da inicialização do servidor.

Para controlar um instrumento ao iniciar o servidor, use uma opção deste formulário:

```sql
--performance-schema-instrument='instrument_name=value'
```

Aqui, *`instrument_name`* é o nome do instrumento, como `wait/synch/mutex/sql/LOCK_open`, e *`value`* é um desses valores:

- `OFF`, `FALSE` ou `0`: Desativar o instrumento

- `ON`, `TRUE` ou `1`: Ative e cronometre o instrumento

- `COUNTED`: Ative e conte (em vez de medir o tempo) o instrumento

Cada opção `--performance-schema-instrument` pode especificar apenas um nome de instrumento, mas múltiplas instâncias da opção podem ser fornecidas para configurar múltiplos instrumentos. Além disso, padrões são permitidos nos nomes dos instrumentos para configurar instrumentos que correspondem ao padrão. Para configurar todos os instrumentos de sincronização de condições como habilitados e contados, use esta opção:

```sql
--performance-schema-instrument='wait/synch/cond/%=COUNTED'
```

Para desativar todos os instrumentos, use esta opção:

```sql
--performance-schema-instrument='%=OFF'
```

Exceção: Os instrumentos `memory/performance_schema/%` estão integrados e não podem ser desativados durante a inicialização.

Cadeias de nomes de instrumentos mais longas têm precedência sobre nomes de padrões mais curtos, independentemente da ordem. Para obter informações sobre como especificar padrões para selecionar instrumentos, consulte Seção 25.4.9, “Nomeação de Instrumentos ou Consumidores para Operações de Filtragem”.

Um nome de instrumento não reconhecido é ignorado. É possível que um plugin instalado posteriormente crie o instrumento, momento em que o nome é reconhecido e configurado.

Para controlar um consumidor ao iniciar o servidor, use uma opção deste formulário:

```sql
--performance-schema-consumer-consumer_name=value
```

Aqui, *`consumer_name`* é o nome do consumidor, como `events_waits_history`, e *`value`* é um desses valores:

- `OFF`, `FALSE` ou `0`: Não coletar eventos para o consumidor

- `ON`, `TRUE` ou `1`: Colete eventos para o consumidor

Por exemplo, para habilitar o consumidor `events_waits_history`, use esta opção:

```sql
--performance-schema-consumer-events-waits-history=ON
```

Os nomes de consumidores permitidos podem ser encontrados examinando a tabela `setup_consumers`. Padrões não são permitidos. Os nomes de consumidores na tabela `setup_consumers` usam sublinhados, mas para consumidores definidos no momento do início, traços e sublinhados dentro do nome são equivalentes.

O Schema de Desempenho inclui várias variáveis de sistema que fornecem informações de configuração:

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

A variável `performance_schema` está em `ON` ou `OFF` para indicar se o Schema de Desempenho está habilitado ou desabilitado. As outras variáveis indicam os tamanhos das tabelas (número de linhas) ou os valores de alocação de memória.

Nota

Com o Gerenciamento de Desempenho habilitado, o número de instâncias do Gerenciamento de Desempenho afeta a pegada de memória do servidor, talvez em grande medida. O Gerenciamento de Desempenho autoescalona muitos parâmetros para usar a memória apenas quando necessário; veja Seção 25.17, “O Modelo de Alocação de Memória do Gerenciamento de Desempenho”.

Para alterar o valor das variáveis do sistema do Gerenciamento de Desempenho, defina-as durante a inicialização do servidor. Por exemplo, coloque as seguintes linhas em um arquivo `my.cnf` para alterar os tamanhos das tabelas de histórico para eventos de espera:

```sql
[mysqld]
performance_schema
performance_schema_events_waits_history_size=20
performance_schema_events_waits_history_long_size=15000
```

O Schema de Desempenho dimensiona automaticamente os valores de vários de seus parâmetros ao iniciar o servidor, se não forem definidos explicitamente. Por exemplo, ele dimensiona os parâmetros que controlam o tamanho das tabelas de espera de eventos da seguinte maneira. O Schema de Desempenho aloca memória incrementalmente, ajustando seu uso de memória à carga real do servidor, em vez de alocar toda a memória necessária durante o início do servidor. Consequentemente, muitos parâmetros de dimensionamento podem não precisar ser definidos. Para ver quais parâmetros são dimensionados automaticamente ou ajustados automaticamente, use **mysqld --verbose --help** e examine as descrições das opções, ou veja Seção 25.15, “Variáveis do Sistema do Schema de Desempenho”.

Para cada parâmetro autodimensionado que não é definido na inicialização do servidor, o Schema de Desempenho determina como definir seu valor com base no valor dos seguintes valores do sistema, que são considerados como “dicas” sobre como você configurou seu servidor MySQL:

```sql
max_connections
open_files_limit
table_definition_cache
table_open_cache
```

Para substituir o dimensionamento automático ou a escala automática para um determinado parâmetro, defina-o para um valor diferente de -1 ao iniciar. Nesse caso, o Schema de Desempenho atribui o valor especificado.

Durante a execução, `SHOW VARIABLES` (show-variables.html) exibe os valores reais nos quais os parâmetros autodimensionados foram definidos. Os parâmetros autodimensionados são exibidos com um valor de -1.

Se o Schema de Desempenho estiver desativado, seus parâmetros de tamanho automático e escala automática permanecem definidos como -1 e `SHOW VARIABLES` exibe -1.
