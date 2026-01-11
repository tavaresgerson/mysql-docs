## 29.14 Performance Schema Command Options

Performance Schema parameters can be specified at server startup on the command line or in option files to configure Performance Schema instruments and consumers. Runtime configuration is also possible in many cases (see Section 29.4, “Performance Schema Runtime Configuration”), but startup configuration must be used when runtime configuration is too late to affect instruments that have already been initialized during the startup process.

Performance Schema consumers and instruments can be configured at startup using the following syntax. For additional details, see Section 29.3, “Performance Schema Startup Configuration”.

* `--performance-schema-consumer-consumer_name=value`

  Configure a Performance Schema consumer. Consumer names in the `setup_consumers` table use underscores, but for consumers set at startup, dashes and underscores within the name are equivalent. Options for configuring individual consumers are detailed later in this section.

* `--performance-schema-instrument=instrument_name=value`

  Configure a Performance Schema instrument. The name may be given as a pattern to configure instruments that match the pattern.

* `--performance-schema-logger=loggerInstrument_name=Level:LogLevel`

  Configure a Performance Schema logger instrument. The name may be given as a pattern to configure instruments that match the pattern.

The following items configure individual consumers:

* `--performance-schema-consumer-events-stages-current=value`

  Configure the `events-stages-current` consumer.

* `--performance-schema-consumer-events-stages-history=value`

  Configure the `events-stages-history` consumer.

* `--performance-schema-consumer-events-stages-history-long=value`

  Configure the `events-stages-history-long` consumer.

* `--performance-schema-consumer-events-statements-cpu=value`

  Configure the `events-statements-cpu` consumer.

* `--performance-schema-consumer-events-statements-current=value`

  Configure the `events-statements-current` consumer.

* `--performance-schema-consumer-events-statements-history=value`

  Configure the `events-statements-history` consumer.

* `--performance-schema-consumer-events-statements-history-long=value`

  Configure the `events-statements-history-long` consumer.

* `--performance-schema-consumer-events-transactions-current=value`

  Configure the Performance Schema `events-transactions-current` consumer.

* `--performance-schema-consumer-events-transactions-history=value`

  Configure the Performance Schema `events-transactions-history` consumer.

* `--performance-schema-consumer-events-transactions-history-long=value`

  Configure the Performance Schema `events-transactions-history-long` consumer.

* `--performance-schema-consumer-events-waits-current=value`

  Configure the `events-waits-current` consumer.

* `--performance-schema-consumer-events-waits-history=value`

  Configure the `events-waits-history` consumer.

* `--performance-schema-consumer-events-waits-history-long=value`

  Configure the `events-waits-history-long` consumer.

* `--performance-schema-consumer-global-instrumentation=value`

  Configure the `global-instrumentation` consumer.

* `--performance-schema-consumer-statements-digest=value`

  Configure the `statements-digest` consumer.

* `--performance-schema-consumer-thread-instrumentation=value`

  Configure the `thread-instrumentation` consumer.
