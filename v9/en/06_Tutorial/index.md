# Chapter 5 Tutorial

**Table of Contents**

5.1 Connecting to and Disconnecting from the Server

5.2 Entering Queries

5.3 Creating and Using a Database :   5.3.1 Creating and Selecting a Database

    5.3.2 Creating a Table

    5.3.3 Loading Data into a Table

    5.3.4 Retrieving Information from a Table

5.4 Getting Information About Databases and Tables

5.5 Using mysql in Batch Mode

5.6 Examples of Common Queries :   5.6.1 The Maximum Value for a Column

    5.6.2 The Row Holding the Maximum of a Certain Column

    5.6.3 Maximum of Column per Group

    5.6.4 The Rows Holding the Group-wise Maximum of a Certain Column

    5.6.5 Using User-Defined Variables

    5.6.6 Using Foreign Keys

    5.6.7 Searching on Two Keys

    5.6.8 Calculating Visits Per Day

    5.6.9 Using AUTO\_INCREMENT

5.7 Using MySQL with Apache

This chapter provides a tutorial introduction to MySQL by showing how to use the **mysql** client program to create and use a simple database. **mysql** (sometimes referred to as the “terminal monitor” or just “monitor”) is an interactive program that enables you to connect to a MySQL server, run queries, and view the results. **mysql** may also be used in batch mode: you place your queries in a file beforehand, then tell **mysql** to execute the contents of the file. Both ways of using **mysql** are covered here.

To see a list of options provided by **mysql**, invoke it with the `--help` option:

```
$> mysql --help
```

This chapter assumes that **mysql** is installed on your machine and that a MySQL server is available to which you can connect. If this is not true, contact your MySQL administrator. (If *you* are the administrator, you need to consult the relevant portions of this manual, such as Chapter 7, *MySQL Server Administration*.)

This chapter describes the entire process of setting up and using a database. If you are interested only in accessing an existing database, you may want to skip the sections that describe how to create the database and the tables it contains.

Because this chapter is tutorial in nature, many details are necessarily omitted. Consult the relevant sections of the manual for more information on the topics covered here.
