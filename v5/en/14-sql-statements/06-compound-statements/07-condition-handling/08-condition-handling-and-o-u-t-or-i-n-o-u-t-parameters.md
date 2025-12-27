#### 13.6.7.8 Condition Handling and OUT or INOUT Parameters

If a stored procedure exits with an unhandled exception, modified values of `OUT` and `INOUT` parameters are not propogated back to the caller.

If an exception is handled by a `CONTINUE` or `EXIT` handler that contains a [`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement") statement, execution of [`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement") pops the Diagnostics Area stack, thus signalling the exception (that is, the information that existed before entry into the handler). If the exception is an error, the values of `OUT` and `INOUT` parameters are not propogated back to the caller.
