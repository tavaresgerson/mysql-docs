### 3.3.4 Retrieving Information from a Table

[3.3.4.1 Selecting All Data](selecting-all.html)

[3.3.4.2 Selecting Particular Rows](selecting-rows.html)

[3.3.4.3 Selecting Particular Columns](selecting-columns.html)

[3.3.4.4 Sorting Rows](sorting-rows.html)

[3.3.4.5 Date Calculations](date-calculations.html)

[3.3.4.6 Working with NULL Values](working-with-null.html)

[3.3.4.7 Pattern Matching](pattern-matching.html)

[3.3.4.8 Counting Rows](counting-rows.html)

[3.3.4.9 Using More Than one Table](multiple-tables.html)

The [`SELECT`](select.html "13.2.9 SELECT Statement") statement is used to pull information from a table. The general form of the statement is:

```sql
SELECT what_to_select
FROM which_table
WHERE conditions_to_satisfy;
```

*`what_to_select`* indicates what you want to see. This can be a list of columns, or `*` to indicate “all columns.” *`which_table`* indicates the table from which you want to retrieve data. The `WHERE` clause is optional. If it is present, *`conditions_to_satisfy`* specifies one or more conditions that rows must satisfy to qualify for retrieval.
