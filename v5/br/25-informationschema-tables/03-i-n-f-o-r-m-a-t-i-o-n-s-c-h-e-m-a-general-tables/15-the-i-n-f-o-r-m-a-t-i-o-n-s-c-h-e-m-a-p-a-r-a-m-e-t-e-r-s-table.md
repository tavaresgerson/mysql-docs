### 24.3.15 The INFORMATION_SCHEMA PARAMETERS Table

The [`PARAMETERS`](information-schema-parameters-table.html "24.3.15 The INFORMATION_SCHEMA PARAMETERS Table") table provides information about parameters for stored routines (stored procedures and stored functions), and about return values for stored functions. The [`PARAMETERS`](information-schema-parameters-table.html "24.3.15 The INFORMATION_SCHEMA PARAMETERS Table") table does not include built-in (native) functions or loadable functions. Parameter information is similar to the contents of the `param_list` column in the `mysql.proc` table.

The [`PARAMETERS`](information-schema-parameters-table.html "24.3.15 The INFORMATION_SCHEMA PARAMETERS Table") table has these columns:

* `SPECIFIC_CATALOG`

  The name of the catalog to which the routine containing the parameter belongs. This value is always `def`.

* `SPECIFIC_SCHEMA`

  The name of the schema (database) to which the routine containing the parameter belongs.

* `SPECIFIC_NAME`

  The name of the routine containing the parameter.

* `ORDINAL_POSITION`

  For successive parameters of a stored procedure or function, the `ORDINAL_POSITION` values are 1, 2, 3, and so forth. For a stored function, there is also a row that applies to the function return value (as described by the `RETURNS` clause). The return value is not a true parameter, so the row that describes it has these unique characteristics:

  + The `ORDINAL_POSITION` value is 0.
  + The `PARAMETER_NAME` and `PARAMETER_MODE` values are `NULL` because the return value has no name and the mode does not apply.

* `PARAMETER_MODE`

  The mode of the parameter. This value is one of `IN`, `OUT`, or `INOUT`. For a stored function return value, this value is `NULL`.

* `PARAMETER_NAME`

  The name of the parameter. For a stored function return value, this value is `NULL`.

* `DATA_TYPE`

  The parameter data type.

  The `DATA_TYPE` value is the type name only with no other information. The `DTD_IDENTIFIER` value contains the type name and possibly other information such as the precision or length.

* `CHARACTER_MAXIMUM_LENGTH`

  For string parameters, the maximum length in characters.

* `CHARACTER_OCTET_LENGTH`

  For string parameters, the maximum length in bytes.

* `NUMERIC_PRECISION`

  For numeric parameters, the numeric precision.

* `NUMERIC_SCALE`

  For numeric parameters, the numeric scale.

* `DATETIME_PRECISION`

  For temporal parameters, the fractional seconds precision.

* `CHARACTER_SET_NAME`

  For character string parameters, the character set name.

* `COLLATION_NAME`

  For character string parameters, the collation name.

* `DTD_IDENTIFIER`

  The parameter data type.

  The `DATA_TYPE` value is the type name only with no other information. The `DTD_IDENTIFIER` value contains the type name and possibly other information such as the precision or length.

* `ROUTINE_TYPE`

  `PROCEDURE` for stored procedures, `FUNCTION` for stored functions.
