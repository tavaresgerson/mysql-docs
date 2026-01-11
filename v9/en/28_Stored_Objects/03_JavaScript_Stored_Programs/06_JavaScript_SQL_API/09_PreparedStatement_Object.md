#### 27.3.6.9 PreparedStatement Object

The `PreparedStatement` object represents a handler for the execution of a prepared statement. It supports the following methods:

* `bind(Value data)`: Registers a list of one or more values to be bound on the execution of the SQL statement. Parameters are bound in the order listed and are type-specific; see Section 27.3.4, “JavaScript Stored Program Data Types and Argument Handling”, for a list of supported data types.

  Prior to a prepared statement's initial execution, all its parameters must be bound to values; failing to do so raises an error when the attempting to call `PreparedStatement.execute()`. Subsequent executions of the prepared statement can be performed using fewer bind parameters than parameter markers in the statement; in this case, the “missing” parameters retain their values from the previous execution.

  Attempting to bind more parameters than parameter markers or to parameters of incorrect types is rejected with an error. Invoking this method after `deallocate()` has been called for this prepared statement also raises an error.

  Returns a reference to the same `PreparedStatement` object on which it was invoked.

* `deallocate()`: Closes the prepared statement and frees associated resources. No `PreparedStatement` or `SqlResult` method calls should be made after this is done.

  Calling this method is equivalent to executing a `DEALLOCATE PREPARE` statement in the **mysql** client.

* `execute()`: Executes the prepared query and returns the corresponding `SqlResult`.

  Calling this method is equivalent to running an `EXECUTE` statement in the **mysql** client.

* `getOption(String optionName)`: get the value of the optionName option for this statement. Only the values `passResultToClient` and `charsetName` are supported.

See Section 27.3.7.2, “Prepared Statements”, for additional information and examples.
