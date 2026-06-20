## 25.14 Opções de comando do Schema de desempenho

Os parâmetros do esquema de desempenho podem ser especificados na string de comando ou em arquivos de opção durante a inicialização do servidor para configurar os instrumentos e os consumidores do Performance Schema. A configuração de tempo de execução também é possível em muitos casos (ver Seção 25.4, “Configuração de tempo de execução do Performance Schema”), mas a configuração de inicialização deve ser usada quando a configuração de tempo de execução é tarde demais para afetar os instrumentos que já foram inicializados durante o processo de inicialização.

Os consumidores e instrumentos do Schema de desempenho podem ser configurados na inicialização usando a seguinte sintaxe. Para obter detalhes adicionais, consulte a Seção 25.3, “Configuração de inicialização do Schema de desempenho”.

* `--performance-schema-consumer-consumer_name=value`

Configure um consumidor do Schema de Desempenho. Os nomes dos consumidores na tabela `setup_consumers` usam sublinhados, mas para consumidores definidos no início, traços e sublinhados dentro do nome são equivalentes. As opções para configurar consumidores individuais são detalhadas mais adiante nesta seção.

* `--performance-schema-instrument=instrument_name=value`

Configure um instrumento do Schema de Desempenho. O nome pode ser fornecido como um padrão para configurar instrumentos que correspondam ao padrão.

Os itens a seguir configuram consumidores individuais:

* `--performance-schema-consumer-events-stages-current=value`

Configure o consumidor `events-stages-current`.

* `--performance-schema-consumer-events-stages-history=value`

Configure o consumidor `events-stages-history`.

* `--performance-schema-consumer-events-stages-history-long=value`

Configure o consumidor `events-stages-history-long`.

* `--performance-schema-consumer-events-statements-current=value`

Configure o consumidor `events-statements-current`.

* `--performance-schema-consumer-events-statements-history=value`

Configure o consumidor `events-statements-history`.

* `--performance-schema-consumer-events-statements-history-long=value`

Configure o consumidor `events-statements-history-long`.

* `--performance-schema-consumer-events-transactions-current=value`

Configure o consumidor do Schema de desempenho `events-transactions-current`.

* `--performance-schema-consumer-events-transactions-history=value`

Configure o consumidor do Schema de desempenho `events-transactions-history`.

* `--performance-schema-consumer-events-transactions-history-long=value`

Configure o consumidor do Schema de desempenho `events-transactions-history-long`.

* `--performance-schema-consumer-events-waits-current=value`

Configure o consumidor `events-waits-current`.

* `--performance-schema-consumer-events-waits-history=value`

Configure o consumidor `events-waits-history`.

* `--performance-schema-consumer-events-waits-history-long=value`

Configure o consumidor `events-waits-history-long`.

* `--performance-schema-consumer-global-instrumentation=value`

Configure o consumidor `global-instrumentation`.

* `--performance-schema-consumer-statements-digest=value`

Configure o consumidor `statements-digest`.

* `--performance-schema-consumer-thread-instrumentation=value`

Configure o consumidor `thread-instrumentation`.