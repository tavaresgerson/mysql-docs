## 25.14 Opções de comando do esquema de desempenho

Os parâmetros do Schema de Desempenho podem ser especificados na linha de comando ou em arquivos de opção durante a inicialização do servidor para configurar os instrumentos e consumidores do Schema de Desempenho. A configuração em tempo de execução também é possível em muitos casos (consulte Seção 25.4, “Configuração de Tempo de Execução do Schema de Desempenho”), mas a configuração de inicialização deve ser usada quando a configuração em tempo de execução é tarde demais para afetar os instrumentos que já foram inicializados durante o processo de inicialização.

Os consumidores e instrumentos do Schema de Desempenho podem ser configurados durante a inicialização usando a seguinte sintaxe. Para obter detalhes adicionais, consulte Seção 25.3, “Configuração de Inicialização do Schema de Desempenho”.

- `--performance-schema-consumer-consumer_name=valor`

  Configure um consumidor do Schema de Desempenho. Os nomes dos consumidores na tabela `setup_consumers` usam sublinhados, mas para consumidores configurados ao iniciar, traços e sublinhados dentro do nome são equivalentes. As opções para configurar consumidores individuais são detalhadas mais adiante nesta seção.

- `--performance-schema-instrument=nome_do_instrumento=valor`

  Configure um instrumento do Schema de Desempenho. O nome pode ser fornecido como um padrão para configurar instrumentos que correspondem ao padrão.

Os itens a seguir configuram os consumidores individuais:

- `--performance-schema-consumer-events-stages-current=valor`

  Configure o consumidor `events-stages-current`.

- `--performance-schema-consumer-events-stages-history=valor`

  Configure o consumidor `events-stages-history`.

- `--performance-schema-consumer-events-stages-history-long=valor`

  Configure o consumidor `events-stages-history-long`.

- `--performance-schema-consumer-events-statements-current=valor`

  Configure o consumidor `events-statements-current`.

- `--performance-schema-consumer-events-statements-history=valor`

  Configure o consumidor `events-statements-history`.

- `--performance-schema-consumer-events-statements-history-long=valor`

  Configure o consumidor `events-statements-history-long`.

- `--performance-schema-consumer-events-transactions-current=valor`

  Configure o consumidor do esquema de desempenho `eventos-transações-atual`.

- `--performance-schema-consumer-events-transactions-history=valor`

  Configure o consumidor do esquema de desempenho `eventos-transações-história`.

- `--performance-schema-consumer-events-transactions-history-long=valor`

  Configure o consumidor do esquema de desempenho `eventos-transações-história-long`.

- `--performance-schema-consumer-events-waits-current=valor`

  Configure o consumidor `events-waits-current`.

- `--performance-schema-consumer-events-waits-history=valor`

  Configure o consumidor `events-waits-history`.

- `--performance-schema-consumer-events-waits-history-long=valor`

  Configure o consumidor `events-waits-history-long`.

- `--performance-schema-consumer-global-instrumentation=valor`

  Configure o consumidor `global-instrumentation`.

- `--performance-schema-consumer-statements-digest=valor`

  Configure o consumidor `statements-digest`.

- `--performance-schema-consumer-thread-instrumentation=valor`

  Configure o consumidor `thread-instrumentation`.
