### 10.15.1 Typical Usage

To perform optimizer tracing entails the following steps:

1. Enable tracing by executing
   [`SET`](set-variable.html "15.7.6.1 SET Syntax for Variable Assignment")
   [`optimizer_trace="enabled=ON"`](server-system-variables.html#sysvar_optimizer_trace).

2. Execute the statement to be traced. See
   [Section 10.15.3, “Traceable Statements”](traceable-statements.html "10.15.3 Traceable Statements"), for a listing of
   statements which can be traced.

3. Examine the contents of the
   [`INFORMATION_SCHEMA.OPTIMIZER_TRACE`](information-schema-optimizer-trace-table.html "28.3.24 The INFORMATION_SCHEMA OPTIMIZER_TRACE Table")
   table.

4. To examine traces for multiple queries, repeat the previous
   two steps as needed.

5. To disable tracing after you have finished, execute
   `SET optimizer_trace="enabled=OFF"`.

You can trace only statements which are executed within the
current session; you cannot see traces from other sessions.