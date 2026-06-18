## 25.14 Opções de Comando do Performance Schema

Os parâmetros do Performance Schema podem ser especificados na inicialização do servidor (startup), na linha de comando ou em arquivos de opções, para configurar os instruments e consumers do Performance Schema. A configuração em tempo de execução (runtime) também é possível em muitos casos (veja Seção 25.4, “Configuração em Runtime do Performance Schema”), mas a configuração de startup deve ser usada quando a configuração em runtime for tardia demais para afetar instruments que já foram inicializados durante o processo de startup.

Os consumers e instruments do Performance Schema podem ser configurados no startup usando a seguinte sintaxe. Para detalhes adicionais, veja Seção 25.3, “Configuração de Startup do Performance Schema”.

* `--performance-schema-consumer-consumer_name=value`

  Configura um consumer do Performance Schema. Os nomes dos consumers na tabela `setup_consumers` usam underscores (sublinhados), mas para consumers definidos no startup, hifens (dashes) e underscores dentro do nome são equivalentes. As opções para configurar consumers individuais são detalhadas posteriormente nesta seção.

* `--performance-schema-instrument=instrument_name=value`

  Configura um instrument do Performance Schema. O nome pode ser fornecido como um pattern (padrão) para configurar instruments que correspondam a esse pattern.

Os seguintes itens configuram consumers individuais:

* `--performance-schema-consumer-events-stages-current=value`

  Configura o consumer `events-stages-current`.

* `--performance-schema-consumer-events-stages-history=value`

  Configura o consumer `events-stages-history`.

* `--performance-schema-consumer-events-stages-history-long=value`

  Configura o consumer `events-stages-history-long`.

* `--performance-schema-consumer-events-statements-current=value`

  Configura o consumer `events-statements-current`.

* `--performance-schema-consumer-events-statements-history=value`

  Configura o consumer `events-statements-history`.

* `--performance-schema-consumer-events-statements-history-long=value`

  Configura o consumer `events-statements-history-long`.

* `--performance-schema-consumer-events-transactions-current=value`

  Configura o consumer `events-transactions-current` do Performance Schema.

* `--performance-schema-consumer-events-transactions-history=value`

  Configura o consumer `events-transactions-history` do Performance Schema.

* `--performance-schema-consumer-events-transactions-history-long=value`

  Configura o consumer `events-transactions-history-long` do Performance Schema.

* `--performance-schema-consumer-events-waits-current=value`

  Configura o consumer `events-waits-current`.

* `--performance-schema-consumer-events-waits-history=value`

  Configura o consumer `events-waits-history`.

* `--performance-schema-consumer-events-waits-history-long=value`

  Configura o consumer `events-waits-history-long`.

* `--performance-schema-consumer-global-instrumentation=value`

  Configura o consumer `global-instrumentation`.

* `--performance-schema-consumer-statements-digest=value`

  Configura o consumer `statements-digest`.

* `--performance-schema-consumer-thread-instrumentation=value`

  Configura o consumer `thread-instrumentation`.