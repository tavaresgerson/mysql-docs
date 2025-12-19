--- title: MySQL 8.4 Reference Manual :: 10.4.3 Optimizing for Many Tables url: https://dev.mysql.com/doc/refman/8.4/en/optimize-multi-tables.html order: 63 ---



### 10.4.3 Optimizing for Many Tables

 10.4.3.1 How MySQL Opens and Closes Tables

 10.4.3.2 Disadvantages of Creating Many Tables in the Same Database

Some techniques for keeping individual queries fast involve splitting data across many tables. When the number of tables runs into the thousands or even millions, the overhead of dealing with all these tables becomes a new performance consideration.


