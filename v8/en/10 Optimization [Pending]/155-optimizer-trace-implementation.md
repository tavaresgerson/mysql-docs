--- title: MySQL 8.4 Reference Manual :: 10.15.16 Optimizer Trace Implementation url: https://dev.mysql.com/doc/refman/8.4/en/optimizer-trace-implementation.html order: 155 ---



### 10.15.16 Optimizer Trace Implementation

See the files `sql/opt_trace*`, starting with `sql/opt_trace.h`. A trace is started by creating an instance of `Opt_trace_start`; information is added to this trace by creating instances of `Opt_trace_object` and `Opt_trace_array`, and by using the `add()` methods of these classes.


