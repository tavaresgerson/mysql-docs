### 13.8.3 HELP Statement

```sql
HELP 'search_string'
```

The [`HELP`](help.html "13.8.3 HELP Statement") statement returns online information from the MySQL Reference Manual. Its proper operation requires that the help tables in the `mysql` database be initialized with help topic information (see [Section 5.1.14, “Server-Side Help Support”](server-side-help-support.html "5.1.14 Server-Side Help Support")).

The [`HELP`](help.html "13.8.3 HELP Statement") statement searches the help tables for the given search string and displays the result of the search. The search string is not case-sensitive.

The search string can contain the wildcard characters `%` and `_`. These have the same meaning as for pattern-matching operations performed with the [`LIKE`](string-comparison-functions.html#operator_like) operator. For example, `HELP 'rep%'` returns a list of topics that begin with `rep`.

The `HELP` statement does not require a terminator such as `;` or `\G`.

The HELP statement understands several types of search strings:

* At the most general level, use `contents` to retrieve a list of the top-level help categories:

  ```sql
  HELP 'contents'
  ```

* For a list of topics in a given help category, such as `Data Types`, use the category name:

  ```sql
  HELP 'data types'
  ```

* For help on a specific help topic, such as the [`ASCII()`](string-functions.html#function_ascii) function or the [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") statement, use the associated keyword or keywords:

  ```sql
  HELP 'ascii'
  HELP 'create table'
  ```

In other words, the search string matches a category, many topics, or a single topic. The following descriptions indicate the forms that the result set can take.

* Empty result

  No match could be found for the search string.

  Example: `HELP 'fake'`

  Yields:

  ```sql
  Nothing found
  Please try to run 'help contents' for a list of all accessible topics
  ```

* Result set containing a single row

  This means that the search string yielded a hit for the help topic. The result includes the following items:

  + `name`: The topic name.
  + `description`: Descriptive help text for the topic.

  + `example`: One or more usage examples. (May be empty.)

  Example: `HELP 'log'`

  Yields:

  ```sql
  Name: 'LOG'
  Description:
  Syntax:
  LOG(X), LOG(B,X)

  If called with one parameter, this function returns the natural
  logarithm of X. If X is less than or equal to 0.0E0, the function
  returns NULL and a warning "Invalid argument for logarithm" is
  reported. Returns NULL if X or B is NULL.

  The inverse of this function (when called with a single argument) is
  the EXP() function.

  URL: https://dev.mysql.com/doc/refman/8.0/en/mathematical-functions.html

  Examples:
  mysql> SELECT LOG(2);
          -> 0.69314718055995
  mysql> SELECT LOG(-2);
          -> NULL
  ```

* List of topics.

  This means that the search string matched multiple help topics.

  Example: `HELP 'status'`

  Yields:

  ```sql
  Many help items for your request exist.
  To make a more specific request, please type 'help <item>',
  where <item> is one of the following topics:
     FLUSH
     SHOW
     SHOW ENGINE
     SHOW FUNCTION STATUS
     SHOW MASTER STATUS
     SHOW PROCEDURE STATUS
     SHOW SLAVE STATUS
     SHOW STATUS
     SHOW TABLE STATUS
  ```

* List of topics.

  A list is also displayed if the search string matches a category.

  Example: `HELP 'functions'`

  Yields:

  ```sql
  You asked for help about help category: "Functions"
  For more information, type 'help <item>', where <item> is one of the following
  categories:
     Aggregate Functions and Modifiers
     Bit Functions
     Cast Functions and Operators
     Comparison Operators
     Date and Time Functions
     Encryption Functions
     Enterprise Encryption Functions
     Flow Control Functions
     GROUP BY Functions and Modifiers
     GTID
     Information Functions
     Locking Functions
     Logical Operators
     Miscellaneous Functions
     Numeric Functions
     Spatial Functions
     String Functions
     XML
  ```
