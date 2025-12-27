### 25.12.2 Performance Schema Setup Tables

[25.12.2.1 The setup\_actors Table](performance-schema-setup-actors-table.html)

[25.12.2.2 The setup\_consumers Table](performance-schema-setup-consumers-table.html)

[25.12.2.3 The setup\_instruments Table](performance-schema-setup-instruments-table.html)

[25.12.2.4 The setup\_objects Table](performance-schema-setup-objects-table.html)

[25.12.2.5 The setup\_timers Table](performance-schema-setup-timers-table.html)

The setup tables provide information about the current instrumentation and enable the monitoring configuration to be changed. For this reason, some columns in these tables can be changed if you have the [`UPDATE`](privileges-provided.html#priv_update) privilege.

The use of tables rather than individual variables for setup information provides a high degree of flexibility in modifying Performance Schema configuration. For example, you can use a single statement with standard SQL syntax to make multiple simultaneous configuration changes.

These setup tables are available:

* [`setup_actors`](performance-schema-setup-actors-table.html "25.12.2.1 The setup_actors Table"): How to initialize monitoring for new foreground threads

* [`setup_consumers`](performance-schema-setup-consumers-table.html "25.12.2.2 The setup_consumers Table"): The destinations to which event information can be sent and stored

* [`setup_instruments`](performance-schema-setup-instruments-table.html "25.12.2.3 The setup_instruments Table"): The classes of instrumented objects for which events can be collected

* [`setup_objects`](performance-schema-setup-objects-table.html "25.12.2.4 The setup_objects Table"): Which objects should be monitored

* [`setup_timers`](performance-schema-setup-timers-table.html "25.12.2.5 The setup_timers Table"): The current event timer
