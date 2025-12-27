## Opções de Comando do Schema de Desempenho

Os parâmetros do Schema de Desempenho podem ser especificados na inicialização do servidor na linha de comando ou em arquivos de opção para configurar os instrumentos e consumidores do Schema de Desempenho. A configuração dinâmica também é possível em muitos casos (veja a Seção 29.4, “Configuração Dinâmica do Schema de Desempenho”), mas a configuração de inicialização deve ser usada quando a configuração dinâmica é tarde demais para afetar os instrumentos que já foram inicializados durante o processo de inicialização.

Os consumidores e instrumentos do Schema de Desempenho podem ser configurados na inicialização usando a seguinte sintaxe. Para detalhes adicionais, consulte a Seção 29.3, “Configuração de Inicialização do Schema de Desempenho”.

* `--performance-schema-consumer-consumer_name=value`

  Configure um consumidor do Schema de Desempenho. Os nomes dos consumidores na tabela `setup_consumers` usam sublinhados, mas para consumidores configurados na inicialização, hífens e sublinhados dentro do nome são equivalentes. As opções para configurar consumidores individuais são detalhadas mais adiante nesta seção.

* `--performance-schema-instrument=instrument_name=value`

  Configure um instrumento do Schema de Desempenho. O nome pode ser dado como um padrão para configurar instrumentos que correspondem ao padrão.

* `--performance-schema-logger=loggerInstrument_name=Level:LogLevel`

  Configure um instrumento de registro do Schema de Desempenho. O nome pode ser dado como um padrão para configurar instrumentos que correspondem ao padrão.

Os seguintes itens configuram consumidores individuais:

* `--performance-schema-consumer-events-stages-current=value`

  Configure o consumidor `events-stages-current`.

* `--performance-schema-consumer-events-stages-history=value`

  Configure o consumidor `events-stages-history`.

* `--performance-schema-consumer-events-stages-history-long=value`

Configure o consumidor `events-stages-history-long`.

* `--performance-schema-consumer-events-statements-cpu=valor`

  Configure o consumidor `events-statements-cpu`.

* `--performance-schema-consumer-events-statements-current=valor`

  Configure o consumidor `events-statements-current`.

* `--performance-schema-consumer-events-statements-history=valor`

  Configure o consumidor `events-statements-history`.

* `--performance-schema-consumer-events-statements-history-long=valor`

  Configure o consumidor `events-statements-history-long`.

* `--performance-schema-consumer-events-transactions-current=valor`

  Configure o consumidor `events-transactions-current` do Schema de Desempenho.

* `--performance-schema-consumer-events-transactions-history=valor`

  Configure o consumidor `events-transactions-history` do Schema de Desempenho.

* `--performance-schema-consumer-events-transactions-history-long=valor`

  Configure o consumidor `events-transactions-history-long` do Schema de Desempenho.

* `--performance-schema-consumer-events-waits-current=valor`

  Configure o consumidor `events-waits-current`.

* `--performance-schema-consumer-events-waits-history=valor`

  Configure o consumidor `events-waits-history`.

* `--performance-schema-consumer-events-waits-history-long=valor`

  Configure o consumidor `events-waits-history-long`.

* `--performance-schema-consumer-global-instrumentation=valor`

  Configure o consumidor `global-instrumentation`.

* `--performance-schema-consumer-statements-digest=valor`

  Configure o consumidor `statements-digest`.

* `--performance-schema-consumer-thread-instrumentation=valor`

  Configure o consumidor `thread-instrumentation`.