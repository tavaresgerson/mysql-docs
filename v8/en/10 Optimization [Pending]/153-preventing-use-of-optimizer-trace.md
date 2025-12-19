--- title: MySQL 8.4 Reference Manual :: 10.15.14 Preventing the Use of Optimizer Trace url: https://dev.mysql.com/doc/refman/8.4/en/preventing-use-of-optimizer-trace.html order: 153 ---



### 10.15.14 Preventing the Use of Optimizer Trace

If, for some reason, you wish to prevent users from seeing traces of their queries, start the server with the options shown here:

```
--maximum-optimizer-trace-max-mem-size=0 --optimizer-trace-max-mem-size=0
```

This sets the maximum size to 0 and prevents users from changing this limit, thus truncating all traces to 0 bytes.


