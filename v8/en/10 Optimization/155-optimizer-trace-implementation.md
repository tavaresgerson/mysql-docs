### 10.15.16 Optimizer Trace Implementation

See the files `sql/opt_trace*`, starting with `sql/opt_trace.h`. A trace is started by creating an instance of `Opt_trace_start`; information is added to this trace by creating instances of `Opt_trace_object` and `Opt_trace_array`, and by using the `add()` methods of these classes.


