#### B.3.4.7 Solving Problems with No Matching Rows

If you have a complicated query that uses many tables but that returns no rows, you should use the following procedure to find out what is wrong:

1. Test the query with [`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement") to check whether you can find something that is obviously wrong. See [Section 13.8.2, “EXPLAIN Statement”](explain.html "13.8.2 EXPLAIN Statement").

2. Select only those columns that are used in the `WHERE` clause.

3. Remove one table at a time from the query until it returns some rows. If the tables are large, it is a good idea to use `LIMIT 10` with the query.

4. Issue a [`SELECT`](select.html "13.2.9 SELECT Statement") for the column that should have matched a row against the table that was last removed from the query.

5. If you are comparing [`FLOAT`](floating-point-types.html "11.1.4 Floating-Point Types (Approximate Value) - FLOAT, DOUBLE") or [`DOUBLE`](floating-point-types.html "11.1.4 Floating-Point Types (Approximate Value) - FLOAT, DOUBLE") columns with numbers that have decimals, you cannot use equality (`=`) comparisons. This problem is common in most computer languages because not all floating-point values can be stored with exact precision. In some cases, changing the [`FLOAT`](floating-point-types.html "11.1.4 Floating-Point Types (Approximate Value) - FLOAT, DOUBLE") to a [`DOUBLE`](floating-point-types.html "11.1.4 Floating-Point Types (Approximate Value) - FLOAT, DOUBLE") fixes this. See [Section B.3.4.8, “Problems with Floating-Point Values”](problems-with-float.html "B.3.4.8 Problems with Floating-Point Values").

6. If you still cannot figure out what is wrong, create a minimal test that can be run with `mysql test < query.sql` that shows your problems. You can create a test file by dumping the tables with [**mysqldump --quick db\_name *`tbl_name_1`* ... *`tbl_name_n`* > query.sql**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program"). Open the file in an editor, remove some insert lines (if there are more than needed to demonstrate the problem), and add your [`SELECT`](select.html "13.2.9 SELECT Statement") statement at the end of the file.

   Verify that the test file demonstrates the problem by executing these commands:

   ```sql
   $> mysqladmin create test2
   $> mysql test2 < query.sql
   ```

   Attach the test file to a bug report, which you can file using the instructions in [Section 1.5, “How to Report Bugs or Problems”](bug-reports.html "1.5 How to Report Bugs or Problems").
