## 29.14 Opções de comando do esquema de desempenho

Os parâmetros do Schema de Desempenho podem ser especificados na linha de comando ou em arquivos de opção durante a inicialização do servidor para configurar os instrumentos e consumidores do Schema de Desempenho. A configuração em tempo de execução também é possível em muitos casos (consulte a Seção 29.4, “Configuração em Tempo de Execução do Schema de Desempenho”), mas a configuração de inicialização deve ser usada quando a configuração em tempo de execução é tarde demais para afetar os instrumentos que já foram inicializados durante o processo de inicialização.

Os consumidores e instrumentos do Schema de Desempenho podem ser configurados durante a inicialização usando a seguinte sintaxe. Para obter detalhes adicionais, consulte a Seção 29.3, “Configuração de Inicialização do Schema de Desempenho”.

- `--performance-schema-consumer-consumer_name=value`

  Configure um consumidor do Schema de Desempenho. Os nomes dos consumidores na tabela `setup_consumers` usam sublinhados, mas para consumidores configurados ao iniciar, travessões e sublinhados dentro do nome são equivalentes. As opções para configurar consumidores individuais são detalhadas mais adiante nesta seção.

- `--performance-schema-instrument=instrument_name=value`

  Configure um instrumento do Schema de Desempenho. O nome pode ser fornecido como um padrão para configurar instrumentos que correspondem ao padrão.

Os itens a seguir configuram os consumidores individuais:

- `--performance-schema-consumer-events-stages-current=value`

  Configure o consumidor `events-stages-current`.

- `--performance-schema-consumer-events-stages-history=value`

  Configure o consumidor `events-stages-history`.

- `--performance-schema-consumer-events-stages-history-long=value`

  Configure o consumidor `events-stages-history-long`.

- `--performance-schema-consumer-events-statements-cpu=value`

  Configure o consumidor `events-statements-cpu`.

- `--performance-schema-consumer-events-statements-current=value`

  Configure o consumidor `events-statements-current`.

- `--performance-schema-consumer-events-statements-history=value`

  Configure o consumidor `events-statements-history`.

- `--performance-schema-consumer-events-statements-history-long=value`

  Configure o consumidor `events-statements-history-long`.

- `--performance-schema-consumer-events-transactions-current=value`

  Configure o consumidor do Schema de Desempenho `events-transactions-current`.

- `--performance-schema-consumer-events-transactions-history=value`

  Configure o consumidor do Schema de Desempenho `events-transactions-history`.

- `--performance-schema-consumer-events-transactions-history-long=value`

  Configure o consumidor do Schema de Desempenho `events-transactions-history-long`.

- `--performance-schema-consumer-events-waits-current=value`

  Configure o consumidor `events-waits-current`.

- `--performance-schema-consumer-events-waits-history=value`

  Configure o consumidor `events-waits-history`.

- `--performance-schema-consumer-events-waits-history-long=value`

  Configure o consumidor `events-waits-history-long`.

- `--performance-schema-consumer-global-instrumentation=value`

  Configure o consumidor `global-instrumentation`.

- `--performance-schema-consumer-statements-digest=value`

  Configure o consumidor `statements-digest`.

- `--performance-schema-consumer-thread-instrumentation=value`

  Configure o consumidor `thread-instrumentation`.
