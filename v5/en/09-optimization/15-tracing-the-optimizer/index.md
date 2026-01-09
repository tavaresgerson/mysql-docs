## 8.15 Tracing the Optimizer

8.15.1 Typical Usage

8.15.2 System Variables Controlling Tracing

8.15.3 Traceable Statements

8.15.4 Tuning Trace Purging

8.15.5 Tracing Memory Usage

8.15.6 Privilege Checking

8.15.7 Interaction with the --debug Option

8.15.8 The optimizer_trace System Variable

8.15.9 The end_markers_in_json System Variable

8.15.10 Selecting Optimizer Features to Trace

8.15.11 Trace General Structure

8.15.12 Example

8.15.13 Displaying Traces in Other Applications

8.15.14 Preventing the Use of Optimizer Trace

8.15.15 Testing Optimizer Trace

8.15.16 Optimizer Trace Implementation

The MySQL optimizer includes the capability to perform tracing; the interface is provided by a set of `optimizer_trace_xxx` system variables and the `INFORMATION_SCHEMA.OPTIMIZER_TRACE` table.
