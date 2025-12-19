--- title: MySQL 8.4 Reference Manual :: 14.20 Window Functions url: https://dev.mysql.com/doc/refman/8.4/en/window-functions.html order: 80 ---



## 14.20 Window Functions

 14.20.1 Window Function Descriptions

 14.20.2 Window Function Concepts and Syntax

 14.20.3 Window Function Frame Specification

 14.20.4 Named Windows

 14.20.5 Window Function Restrictions

MySQL supports window functions that, for each row from a query, perform a calculation using rows related to that row. The following sections discuss how to use window functions, including descriptions of the `OVER` and `WINDOW` clauses. The first section provides descriptions of the nonaggregate window functions. For descriptions of the aggregate window functions, see Section 14.19.1, “Aggregate Function Descriptions”.

For information about optimization and window functions, see Section 10.2.1.21, “Window Function Optimization”.


