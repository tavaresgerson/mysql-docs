## 10.2 Optimizing SQL Statements

[10.2.1 Optimizing SELECT Statements](select-optimization.html)

[10.2.2 Optimizing Subqueries, Derived Tables, View References, and Common Table Expressions](subquery-optimization.html)

[10.2.3 Optimizing INFORMATION\_SCHEMA Queries](information-schema-optimization.html)

[10.2.4 Optimizing Performance Schema Queries](performance-schema-optimization.html)

[10.2.5 Optimizing Data Change Statements](data-change-optimization.html)

[10.2.6 Optimizing Database Privileges](permission-optimization.html)

[10.2.7 Other Optimization Tips](miscellaneous-optimization-tips.html)

The core logic of a database application is performed through SQL
statements, whether issued directly through an interpreter or
submitted behind the scenes through an API. The tuning guidelines
in this section help to speed up all kinds of MySQL applications.
The guidelines cover SQL operations that read and write data, the
behind-the-scenes overhead for SQL operations in general, and
operations used in specific scenarios such as database monitoring.