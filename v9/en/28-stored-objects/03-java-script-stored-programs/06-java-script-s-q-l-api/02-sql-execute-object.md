#### 27.3.6.2 SqlExecute Object

`SqlExecute` has the following methods:

* `execute()`: Executes the SQL statement and returns an `SqlResult`.

* `getOption(String optionName)`: Gets the value for the named option to this statement. Supported values are `passResultToClient` and `charsetName`. Returns a string or true/false value, depending on the option's type.
