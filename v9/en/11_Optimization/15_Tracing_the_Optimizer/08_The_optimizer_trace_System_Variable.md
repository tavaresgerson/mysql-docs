### 10.15.8 The optimizer\_trace System Variable

The optimizer\_trace system variable has these on/off switches:

* `enabled`: Enables (`ON`) or disables (`OFF`) tracing

* `one_line`: If set to `ON`, the trace contains no whitespace, thus conserving space. This renders the trace difficult to read for humans, still usable by JSON parsers, since they ignore whitespace.
