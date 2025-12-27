#### 7.4.2.4 Types of Error Log Filtering

Error log configuration normally includes one log filter component and one or more log sink components. For error log filtering, MySQL offers a choice of components:

* `log_filter_internal`: This filter component provides error log filtering based on log event priority and error code, in combination with the `log_error_verbosity` and `log_error_suppression_list` system variables. `log_filter_internal` is built in and enabled by default. See Section 7.4.2.5, “Priority-Based Error Log Filtering (`log_filter_internal`)”").
* `log_filter_dragnet`: This filter component provides error log filtering based on user-supplied rules, in combination with the `dragnet.log_error_filter_rules` system variable. See Section 7.4.2.6, “Rule-Based Error Log Filtering (`log_filter_dragnet`)”").
