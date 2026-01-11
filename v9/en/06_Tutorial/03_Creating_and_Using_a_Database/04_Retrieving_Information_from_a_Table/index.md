### 5.3.4 Retrieving Information from a Table

5.3.4.1 Selecting All Data

5.3.4.2 Selecting Particular Rows

5.3.4.3 Selecting Particular Columns

5.3.4.4 Sorting Rows

5.3.4.5 Date Calculations

5.3.4.6 Working with NULL Values

5.3.4.7 Pattern Matching

5.3.4.8 Counting Rows

5.3.4.9 Using More Than one Table

The `SELECT` statement is used to pull information from a table. The general form of the statement is:

```
SELECT what_to_select
FROM which_table
WHERE conditions_to_satisfy;
```

*`what_to_select`* indicates what you want to see. This can be a list of columns, or `*` to indicate “all columns.” *`which_table`* indicates the table from which you want to retrieve data. The `WHERE` clause is optional. If it is present, *`conditions_to_satisfy`* specifies one or more conditions that rows must satisfy to qualify for retrieval.
