#### 29.12.14.1 Performance Schema global_variable_attributes Table

The `global_variable_attributes` table provides information about attributes and their values that have been set by the server for global variables such as `offline_mode` or `read_only`.

More than one attribute-value pair can be assigned to a given global variable. Such attribute-value pairs can be assigned to global variables only, and not to session variables.

Attributes and their values cannot be set by users, nor can they be read by users other than querying this table. Attributes and their values can be set, modified, or removed only by the server.

The `global_variable_attributes` table contains the columns listed here:

* `VARIABLE_NAME`

  Name of the global variable.

* `ATTR_NAME`

  Name of an attribute assigned to the variable named in `VARIABLE_NAME`

* `ATTR_VALUE`

  Value of the attribute named in `ATTR_NAME`.

The `global_variable_attributes` table is read-only, and neither the table nor any rows it contains can be modified by users. For an example of how the server uses system variable attributes, see the description of the `offline_mode` variable.
