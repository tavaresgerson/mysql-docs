## 35.3 OpenTelemetry Trace

35.3.1 Configuring Trace Telemetry

35.3.2 Trace Format

Tracing telemetry enables you to visualize the flow of any processing action as it is processed through your server. The data for each action, a span, includes possible error information and timing data. Traces are generated for `COM_QUERY` commands executed, including non-query commands such as `COM_PING`, or `COM_STMT_CLOSE`. Query statement traces also have an associated SQL text attribute.

Telemetry tracing is implemented in:

* MySQL Enterprise Edition Telemetry Component
* MySQL Enterprise Edition Client
* MySQL Connectors
