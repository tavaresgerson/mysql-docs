### 8.4.3 Optimizing for Many Tables

[8.4.3.1 How MySQL Opens and Closes Tables](table-cache.html)

[8.4.3.2 Disadvantages of Creating Many Tables in the Same Database](creating-many-tables.html)

Some techniques for keeping individual queries fast involve
splitting data across many tables. When the number of tables
runs into the thousands or even millions, the overhead of
dealing with all these tables becomes a new performance
consideration.