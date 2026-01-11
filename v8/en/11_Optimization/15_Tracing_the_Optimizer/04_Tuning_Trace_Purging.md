### 10.15.4 Tuning Trace Purging

By default, each new trace overwrites the previous trace. Thus, if a statement contains substatements (such as invoking stored procedures, stored functions, or triggers), the topmost statement and substatements each generate one trace, but at the end of execution, the trace for only the last substatement is visible.

A user who wants to see the trace of a different substatement can enable or disable tracing for the desired substatement, but this requires editing the routine code, which may not always be possible. Another solution is to tune trace purging. This is done by setting the `optimizer_trace_offset` and `optimizer_trace_limit` system variables, like this:

```
SET optimizer_trace_offset=offset, optimizer_trace_limit=limit;
```

*`offset`* is a signed integer (default `-1`); *`limit`* is a positive integer (default `1`). Such a `SET` statement has the following effects:

* All traces previously stored are cleared from memory.
* A subsequent `SELECT` from the `OPTIMIZER_TRACE` table returns the first *`limit`* traces of the *`offset`* oldest stored traces (if *`offset`* >= 0), or the first *`limit`* traces of the *`-offset`* newest stored traces (if *`offset`* < 0).

Examples:

* `SET optimizer_trace_offset=-1, optimizer_trace_limit=1`: The most recent trace is shown (the default).

* `SET optimizer_trace_offset=-2, optimizer_trace_limit=1`: The next-to-last trace is shown.

* `SET optimizer_trace_offset=-5, optimizer_trace_limit=5`: The last five traces are shown.

Negative values for *`offset`* can thus prove useful when the substatements of interest are the last few in a stored routine. For example:

```
SET optimizer_trace_offset=-5, optimizer_trace_limit=5;

CALL stored_routine(); # more than 5 substatements in this routine

SELECT * FROM information_schema.OPTIMIZER_TRACE; # see only the last 5 traces
```

A positive *`offset`* can be useful when one knows that the interesting substatements are the first few in a stored routine.

The more accurately these two variables are set, the less memory is used. For example, `SET optimizer_trace_offset=0, optimizer_trace_limit=5` requires sufficient memory to store five traces, so if only the three first are needed, is is better to use `SET optimizer_trace_offset=0, optimizer_trace_limit=3`, since tracing stops after *`limit`* traces. A stored routine may have a loop which executes many substatements and thus generates many traces, which can use a lot of memory; in such cases, choosing appropriate values for *`offset`* and *`limit`* can restrict tracing to, for example, a single iteration of the loop. This also decreases the impact of tracing on execution speed.

If *`offset`* is greater than or equal to 0, only *`limit`* traces are kept in memory. If *`offset`* is less than 0, that is not true: instead, *`-offset`* traces are kept in memory. Even if *`limit`* is smaller than *`-offset`*, excluding the last statement, the last statement must still be traced because it will be within the limit after executing one more statement. Since an offset less than 0 is counted from the end, the “window” moves as more statements execute.

Using `optimizer_trace_offset` and `optimizer_trace_limit`, which are restrictions at the trace producer level, provide better (greater) speed and (less) memory usage than setting offsets or limits at the trace consumer (SQL) level with `SELECT * FROM OPTIMIZER_TRACE LIMIT limit OFFSET offset`, which saves almost nothing.
