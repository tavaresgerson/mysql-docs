### 10.15.2 System Variables Controlling Tracing

The following system variables affect optimizer tracing:

*  `optimizer_trace`: Enables or disables optimizer tracing. See Section 10.15.8, “The optimizer_trace System Variable”.
*  `optimizer_trace_features`: Enables or disables selected features of the MySQL Optimizer, using the syntax shown here:

  ```
  SET optimizer_trace_features=option=value[,option=value][,...]

  option:
    {greedy_search | range_optimizer | dynamic_range | repeated_subselect}

  value:
    {on | off | default}
  ```

  See  Section 10.15.10, “Selecting Optimizer Features to Trace”, for more information on the effects of these.
*  `optimizer_trace_max_mem_size`: Maximum amount of memory that can be used for storing all traces.
*  `optimizer_trace_limit`: The maximum number of optimizer traces to be shown. See Section 10.15.4, “Tuning Trace Purging”, for more information.
*  `optimizer_trace_offset`: Offset of the first trace shown. See Section 10.15.4, “Tuning Trace Purging”.
*  `end_markers_in_json`: If set to `1`, causes the trace to repeat the key (if present) near the closing bracket. This also affects the output of `EXPLAIN FORMAT=JSON` in those versions of MySQL which support this statement. See Section 10.15.9, “The end_markers_in_json System Variable”.

