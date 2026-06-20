### 10.2.5 Optimizing Data Change Statements

This section explains how to speed up data change statements:
[`INSERT`](insert.html "15.2.7 INSERT Statement"),
[`UPDATE`](update.html "15.2.17 UPDATE Statement"), and
[`DELETE`](delete.html "15.2.2 DELETE Statement"). Traditional OLTP
applications and modern web applications typically do many small
data change operations, where concurrency is vital. Data
analysis and reporting applications typically run data change
operations that affect many rows at once, where the main
considerations is the I/O to write large amounts of data and
keep indexes up-to-date. For inserting and updating large
volumes of data (known in the industry as ETL, for
“extract-transform-load”), sometimes you use other
SQL statements or external commands, that mimic the effects of
[`INSERT`](insert.html "15.2.7 INSERT Statement"),
[`UPDATE`](update.html "15.2.17 UPDATE Statement"), and
[`DELETE`](delete.html "15.2.2 DELETE Statement") statements.