## 25.14 Performance Schema Command Options

Performance Schema parameters can be specified at server startup on the command line or in option files to configure Performance Schema instruments and consumers. Runtime configuration is also possible in many cases (see [Section 25.4, “Performance Schema Runtime Configuration”](performance-schema-runtime-configuration.html "25.4 Performance Schema Runtime Configuration")), but startup configuration must be used when runtime configuration is too late to affect instruments that have already been initialized during the startup process.

Performance Schema consumers and instruments can be configured at startup using the following syntax. For additional details, see [Section 25.3, “Performance Schema Startup Configuration”](performance-schema-startup-configuration.html "25.3 Performance Schema Startup Configuration").

* [`--performance-schema-consumer-consumer_name=value`](performance-schema-options.html#option_mysqld_performance-schema-consumer-xxx)

  Configure a Performance Schema consumer. Consumer names in the [`setup_consumers`](performance-schema-setup-consumers-table.html "25.12.2.2 The setup_consumers Table") table use underscores, but for consumers set at startup, dashes and underscores within the name are equivalent. Options for configuring individual consumers are detailed later in this section.

* [`--performance-schema-instrument=instrument_name=value`](performance-schema-options.html#option_mysqld_performance-schema-instrument)

  Configure a Performance Schema instrument. The name may be given as a pattern to configure instruments that match the pattern.

The following items configure individual consumers:

* [`--performance-schema-consumer-events-stages-current=value`](performance-schema-options.html#option_mysqld_performance-schema-consumer-events-stages-current)

  Configure the `events-stages-current` consumer.

* [`--performance-schema-consumer-events-stages-history=value`](performance-schema-options.html#option_mysqld_performance-schema-consumer-events-stages-history)

  Configure the `events-stages-history` consumer.

* [`--performance-schema-consumer-events-stages-history-long=value`](performance-schema-options.html#option_mysqld_performance-schema-consumer-events-stages-history-long)

  Configure the `events-stages-history-long` consumer.

* [`--performance-schema-consumer-events-statements-current=value`](performance-schema-options.html#option_mysqld_performance-schema-consumer-events-statements-current)

  Configure the `events-statements-current` consumer.

* [`--performance-schema-consumer-events-statements-history=value`](performance-schema-options.html#option_mysqld_performance-schema-consumer-events-statements-history)

  Configure the `events-statements-history` consumer.

* [`--performance-schema-consumer-events-statements-history-long=value`](performance-schema-options.html#option_mysqld_performance-schema-consumer-events-statements-history-long)

  Configure the `events-statements-history-long` consumer.

* [`--performance-schema-consumer-events-transactions-current=value`](performance-schema-options.html#option_mysqld_performance-schema-consumer-events-transactions-current)

  Configure the Performance Schema `events-transactions-current` consumer.

* [`--performance-schema-consumer-events-transactions-history=value`](performance-schema-options.html#option_mysqld_performance-schema-consumer-events-transactions-history)

  Configure the Performance Schema `events-transactions-history` consumer.

* [`--performance-schema-consumer-events-transactions-history-long=value`](performance-schema-options.html#option_mysqld_performance-schema-consumer-events-transactions-history-long)

  Configure the Performance Schema `events-transactions-history-long` consumer.

* [`--performance-schema-consumer-events-waits-current=value`](performance-schema-options.html#option_mysqld_performance-schema-consumer-events-waits-current)

  Configure the `events-waits-current` consumer.

* [`--performance-schema-consumer-events-waits-history=value`](performance-schema-options.html#option_mysqld_performance-schema-consumer-events-waits-history)

  Configure the `events-waits-history` consumer.

* [`--performance-schema-consumer-events-waits-history-long=value`](performance-schema-options.html#option_mysqld_performance-schema-consumer-events-waits-history-long)

  Configure the `events-waits-history-long` consumer.

* [`--performance-schema-consumer-global-instrumentation=value`](performance-schema-options.html#option_mysqld_performance-schema-consumer-global-instrumentation)

  Configure the `global-instrumentation` consumer.

* [`--performance-schema-consumer-statements-digest=value`](performance-schema-options.html#option_mysqld_performance-schema-consumer-statements-digest)

  Configure the `statements-digest` consumer.

* [`--performance-schema-consumer-thread-instrumentation=value`](performance-schema-options.html#option_mysqld_performance-schema-consumer-thread-instrumentation)

  Configure the `thread-instrumentation` consumer.
