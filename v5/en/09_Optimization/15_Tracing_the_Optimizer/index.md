## 8.15 Tracing the Optimizer

[8.15.1 Typical Usage](optimizer-tracing-typical-usage.html)

[8.15.2 System Variables Controlling Tracing](system-variables-controlling-tracing.html)

[8.15.3 Traceable Statements](traceable-statements.html)

[8.15.4 Tuning Trace Purging](tuning-trace-purging.html)

[8.15.5 Tracing Memory Usage](tracing-memory-usage.html)

[8.15.6 Privilege Checking](privilege-checking.html)

[8.15.7 Interaction with the --debug Option](interaction-with-debug-option.html)

[8.15.8 The optimizer\_trace System Variable](optimizer-trace-system-variable.html)

[8.15.9 The end\_markers\_in\_json System Variable](end-markers-in-json-system-variable.html)

[8.15.10 Selecting Optimizer Features to Trace](optimizer-features-to-trace.html)

[8.15.11 Trace General Structure](trace-general-structure.html)

[8.15.12 Example](tracing-example.html)

[8.15.13 Displaying Traces in Other Applications](displaying-traces.html)

[8.15.14 Preventing the Use of Optimizer Trace](preventing-use-of-optimizer-trace.html)

[8.15.15 Testing Optimizer Trace](optimizer-trace-testing.html)

[8.15.16 Optimizer Trace Implementation](optimizer-trace-implementation.html)

The MySQL optimizer includes the capability to perform tracing; the
interface is provided by a set of
`optimizer_trace_xxx` system variables and the
[`INFORMATION_SCHEMA.OPTIMIZER_TRACE`](information-schema-optimizer-trace-table.html "24.3.14 The INFORMATION_SCHEMA OPTIMIZER_TRACE Table")
table.