#### 26.4.3.23 The ps_check_lost_instrumentation View

This view returns information about lost Performance Schema instruments, to indicate whether the Performance Schema is unable to monitor all runtime data.

The `ps_check_lost_instrumentation` view has these columns:

* `variable_name`

  The Performance Schema status variable name indicating which type of instrument was lost.

* `variable_value`

  The number of instruments lost.
