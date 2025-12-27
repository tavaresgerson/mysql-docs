#### 7.5.7.3 MLE Component Memory and Thread Usage

Memory allocation and usage information for the MLE component can be obtained by checking the values of the `mle_heap_status` and `mle_memory_used` status variables. Memory is not allocated until the component is activated by creating or executing a stored program that uses JavaScript. This means that, until the component is active, the value of `mle_heap_status` is `Not Allocated` and `mle_memory_used` is `0`. When the component is active, `mle_heap_status` should be `Allocated`, and `mle_memory_used` should be an integer in the range of 0 to 100 inclusive; the latter variable indicates the memory used by the MLE component as a percentage of the amount allocated to it, rounded up to the nearest whole number. It is also possible for `mle_heap_status` to be `Garbage Collection`, should it become necessary to reclaim memory that is no longer being used.

By default, the amount of memory allocated to the MLE component is calculated using the formula: (0.05) \* (total physical memory in GB), and kept within the range 0.4GB to 32GB. You can adjust this by setting the `mle.memory_max` system variable up to a maximum of 8GB (8589934592 bytes); the minimum possible value is 32MB. When increasing this, you should keep in mind that sufficient memory must remain for other uses by the MySQL server, and for system processes to operate correctly.

Setting `mle.memory_max` to a value that is greater than the total amount of memory on the system causes undefined behavior.

Important

You can change the amount of memory allocated to the MLE component only when the component is inactive. To set the allocation to a non-default value at install time, use a statement such as `INSTALL COMPONENT 'file://component_mle' SET GLOBAL mle.memory_max = 1024*1024*512`, or set it after installing but before making any use of JavaScript stored programs.

You can obtain the number of out of memory errors that have been raised by MLE stored programs by checking the value of the `mle_oom_errors` status variable.

For information about threads used by the Multilingual Engine Component, you can consult the `mle_threads` status variable, which shows the current number of physical threads attached to GraalVM. `mle_threads_max` shows the maximum number of simultaneous physical threads attached to GraalVM at any point in time since the component became active.
