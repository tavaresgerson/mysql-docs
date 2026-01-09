# Chapter 3 Tutorial

**Table of Contents**

[3.1 Connecting to and Disconnecting from the Server](connecting-disconnecting.html)

[3.2 Entering Queries](entering-queries.html)

[3.3 Creating and Using a Database](database-use.html) :   [3.3.1 Creating and Selecting a Database](creating-database.html)

    [3.3.2 Creating a Table](creating-tables.html)

    [3.3.3 Loading Data into a Table](loading-tables.html)

    [3.3.4 Retrieving Information from a Table](retrieving-data.html)

[3.4 Getting Information About Databases and Tables](getting-information.html)

[3.5 Using mysql in Batch Mode](batch-mode.html)

[3.6 Examples of Common Queries](examples.html) :   [3.6.1 The Maximum Value for a Column](example-maximum-column.html)

    [3.6.2 The Row Holding the Maximum of a Certain Column](example-maximum-row.html)

    [3.6.3 Maximum of Column per Group](example-maximum-column-group.html)

    [3.6.4 The Rows Holding the Group-wise Maximum of a Certain Column](example-maximum-column-group-row.html)

    [3.6.5 Using User-Defined Variables](example-user-variables.html)

    [3.6.6 Using Foreign Keys](example-foreign-keys.html)

    [3.6.7 Searching on Two Keys](searching-on-two-keys.html)

    [3.6.8 Calculating Visits Per Day](calculating-days.html)

    [3.6.9 Using AUTO_INCREMENT](example-auto-increment.html)

[3.7 Using MySQL with Apache](apache.html)

This chapter provides a tutorial introduction to MySQL by showing how to use the [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client program to create and use a simple database. [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") (sometimes referred to as the “terminal monitor” or just “monitor”) is an interactive program that enables you to connect to a MySQL server, run queries, and view the results. [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") may also be used in batch mode: you place your queries in a file beforehand, then tell [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") to execute the contents of the file. Both ways of using [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") are covered here.

To see a list of options provided by [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client"), invoke it with the [`--help`](mysql-command-options.html#option_mysql_help) option:

```sql
$> mysql --help
```

This chapter assumes that [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") is installed on your machine and that a MySQL server is available to which you can connect. If this is not true, contact your MySQL administrator. (If *you* are the administrator, you need to consult the relevant portions of this manual, such as [Chapter 5, *MySQL Server Administration*](server-administration.html "Chapter 5 MySQL Server Administration").)

This chapter describes the entire process of setting up and using a database. If you are interested only in accessing an existing database, you may want to skip the sections that describe how to create the database and the tables it contains.

Because this chapter is tutorial in nature, many details are necessarily omitted. Consult the relevant sections of the manual for more information on the topics covered here.
