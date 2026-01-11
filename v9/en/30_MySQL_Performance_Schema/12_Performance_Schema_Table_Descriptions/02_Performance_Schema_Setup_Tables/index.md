### 29.12.2 Performance Schema Setup Tables

29.12.2.1 The setup\_actors Table

29.12.2.2 The setup\_consumers Table

29.12.2.3 The setup\_instruments Table

29.12.2.4 The setup\_objects Table

29.12.2.5 The setup\_threads Table

The setup tables provide information about the current instrumentation and enable the monitoring configuration to be changed. For this reason, some columns in these tables can be changed if you have the `UPDATE` privilege.

The use of tables rather than individual variables for setup information provides a high degree of flexibility in modifying Performance Schema configuration. For example, you can use a single statement with standard SQL syntax to make multiple simultaneous configuration changes.

These setup tables are available:

* `setup_actors`: How to initialize monitoring for new foreground threads

* `setup_consumers`: The destinations to which event information can be sent and stored

* `setup_instruments`: The classes of instrumented objects for which events can be collected

* `setup_objects`: Which objects should be monitored

* `setup_threads`: Instrumented thread names and attributes
