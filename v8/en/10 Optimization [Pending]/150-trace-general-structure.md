--- title: MySQL 8.4 Reference Manual :: 10.15.11 Trace General Structure url: https://dev.mysql.com/doc/refman/8.4/en/trace-general-structure.html order: 150 ---



### 10.15.11 Trace General Structure

A trace follows the actual execution path very closely; for each join, there is a join preparation object, a join optimization object, and a join execution object. Query transformations (`IN` to `EXISTS`, outer join to inner join, and so on), simplifications (elimination of clauses), and equality propagation are shown in subobjects. Calls to the range optimizer, cost evaluations, reasons why an access path is chosen over another one, or why a sorting method is chosen over another one, are shown as well.


