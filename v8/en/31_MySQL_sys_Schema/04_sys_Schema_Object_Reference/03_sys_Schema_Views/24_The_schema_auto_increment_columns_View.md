#### 30.4.3.24 The schema_auto_increment_columns View

This view indicates which tables have `AUTO_INCREMENT` columns and provides information about those columns, such as the current and maximum column values and the usage ratio (ratio of used to possible values). By default, rows are sorted by descending usage ratio and maximum column value.

Tables in these schemas are excluded from view output: `mysql`, `sys`, `INFORMATION_SCHEMA`, `performance_schema`.

The `schema_auto_increment_columns` view has these columns:

* `table_schema`

  The schema that contains the table.

* `table_name`

  The table that contains the `AUTO_INCREMENT` column.

* `column_name`

  The name of the `AUTO_INCREMENT` column.

* `data_type`

  The data type of the column.

* `column_type`

  The column type of the column, which is the data type plus possibly other information. For example, for a column with a `bigint(20) unsigned` column type, the data type is just `bigint`.

* `is_signed`

  Whether the column type is signed.

* `is_unsigned`

  Whether the column type is unsigned.

* `max_value`

  The maximum permitted value for the column.

* `auto_increment`

  The current `AUTO_INCREMENT` value for the column.

* `auto_increment_ratio`

  The ratio of used to permitted values for the column. This indicates how much of the sequence of values is “used up.”
