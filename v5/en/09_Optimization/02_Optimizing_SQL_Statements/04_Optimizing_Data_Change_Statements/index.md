### 8.2.4 Optimizing Data Change Statements

[8.2.4.1 Optimizing INSERT Statements](insert-optimization.html)

[8.2.4.2 Optimizing UPDATE Statements](update-optimization.html)

[8.2.4.3 Optimizing DELETE Statements](delete-optimization.html)

This section explains how to speed up data change statements:
[`INSERT`](insert.html "13.2.5 INSERT Statement"),
[`UPDATE`](update.html "13.2.11 UPDATE Statement"), and
[`DELETE`](delete.html "13.2.2 DELETE Statement"). Traditional OLTP
applications and modern web applications typically do many small
data change operations, where concurrency is vital. Data
analysis and reporting applications typically run data change
operations that affect many rows at once, where the main
considerations is the I/O to write large amounts of data and
keep indexes up-to-date. For inserting and updating large
volumes of data (known in the industry as ETL, for
“extract-transform-load”), sometimes you use other
SQL statements or external commands, that mimic the effects of
[`INSERT`](insert.html "13.2.5 INSERT Statement"),
[`UPDATE`](update.html "13.2.11 UPDATE Statement"), and
[`DELETE`](delete.html "13.2.2 DELETE Statement") statements.