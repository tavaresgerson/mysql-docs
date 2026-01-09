## 10.2 Optimizing SQL Statements

10.2.1 Optimizing SELECT Statements

10.2.2 Optimizing Subqueries, Derived Tables, View References, and Common Table Expressions

10.2.3 Optimizing INFORMATION_SCHEMA Queries

10.2.4 Optimizing Performance Schema Queries

10.2.5 Optimizing Data Change Statements

10.2.6 Optimizing Database Privileges

10.2.7 Other Optimization Tips

The core logic of a database application is performed through SQL statements, whether issued directly through an interpreter or submitted behind the scenes through an API. The tuning guidelines in this section help to speed up all kinds of MySQL applications. The guidelines cover SQL operations that read and write data, the behind-the-scenes overhead for SQL operations in general, and operations used in specific scenarios such as database monitoring.
