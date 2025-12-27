## 11.6 Query Attributes

The most visible part of an SQL statement is the text of the statement. Clients can also define query attributes that apply to the next statement sent to the server for execution:

* Attributes are defined prior to sending the statement.
* Attributes exist until statement execution ends, at which point the attribute set is cleared.
* While attributes exist, they can be accessed on the server side.

Examples of the ways query attributes may be used:

* A web application produces pages that generate database queries, and for each query must track the URL of the page that generated it.
* An application passes extra processing information with each query, for use by a plugin such as an audit plugin or query rewrite plugin.

MySQL supports these capabilities without the use of workarounds such as specially formatted comments included in query strings. The remainder of this section describes how to use query attribute support, including the prerequisites that must be satisfied.

*  Defining and Accessing Query Attributes
*  Prerequisites for Using Query Attributes
*  Query Attribute Loadable Functions

### Defining and Accessing Query Attributes

Applications that use the MySQL C API define query attributes by calling the  `mysql_bind_param()` function. See  mysql\_bind\_param(). Other MySQL connectors may also provide query-attribute support. See the documentation for individual connectors.

The `mysql` client has a `query_attributes` command that enables defining up to 32 pairs of attribute names and values. See Section 6.5.1.2, “mysql Client Commands”.

Query attribute names are transmitted using the character set indicated by the `character_set_client` system variable.

To access query attributes within SQL statements for which attributes have been defined, install the `query_attributes` component as described in Prerequisites for Using Query Attributes. The component implements a `mysql_query_attribute_string()` loadable function that takes an attribute name argument and returns the attribute value as a string, or `NULL` if the attribute does not exist. See Query Attribute Loadable Functions.

The following examples use the `mysql` client `query_attributes` command to define attribute name/value pairs, and the `mysql_query_attribute_string()` function to access attribute values by name.

This example defines two attributes named `n1` and `n2`. The first `SELECT` shows how to retrieve those attributes, and also demonstrates that retrieving a nonexistent attribute (`n3`) returns `NULL`. The second `SELECT` shows that attributes do not persist across statements.

```
mysql> query_attributes n1 v1 n2 v2;
mysql> SELECT
         mysql_query_attribute_string('n1') AS 'attr 1',
         mysql_query_attribute_string('n2') AS 'attr 2',
         mysql_query_attribute_string('n3') AS 'attr 3';
+--------+--------+--------+
| attr 1 | attr 2 | attr 3 |
+--------+--------+--------+
| v1     | v2     | NULL   |
+--------+--------+--------+

mysql> SELECT
         mysql_query_attribute_string('n1') AS 'attr 1',
         mysql_query_attribute_string('n2') AS 'attr 2';
+--------+--------+
| attr 1 | attr 2 |
+--------+--------+
| NULL   | NULL   |
+--------+--------+
```

As shown by the second `SELECT` statement, attributes defined prior to a given statement are available only to that statement and are cleared after the statement executes. To use an attribute value across multiple statements, assign it to a variable. The following example shows how to do this, and illustrates that attribute values are available in subsequent statements by means of the variables, but not by calling `mysql_query_attribute_string()`:

```
mysql> query_attributes n1 v1 n2 v2;
mysql> SET
         @attr1 = mysql_query_attribute_string('n1'),
         @attr2 = mysql_query_attribute_string('n2');

mysql> SELECT
         @attr1, mysql_query_attribute_string('n1') AS 'attr 1',
         @attr2, mysql_query_attribute_string('n2') AS 'attr 2';
+--------+--------+--------+--------+
| @attr1 | attr 1 | @attr2 | attr 2 |
+--------+--------+--------+--------+
| v1     | NULL   | v2     | NULL   |
+--------+--------+--------+--------+
```

Attributes can also be saved for later use by storing them in a table:

```
mysql> CREATE TABLE t1 (c1 CHAR(20), c2 CHAR(20));

mysql> query_attributes n1 v1 n2 v2;
mysql> INSERT INTO t1 (c1, c2) VALUES(
         mysql_query_attribute_string('n1'),
         mysql_query_attribute_string('n2')
       );

mysql> SELECT * FROM t1;
+------+------+
| c1   | c2   |
+------+------+
| v1   | v2   |
+------+------+
```

Query attributes are subject to these limitations and restrictions:

* If multiple attribute-definition operations occur prior to sending a statement to the server for execution, the most recent definition operation applies and replaces attributes defined in earlier operations.
* If multiple attributes are defined with the same name, attempts to retrieve the attribute value have an undefined result.
* An attribute defined with an empty name cannot be retrieved by name.
* Attributes are not available to statements prepared with `PREPARE`.
* The `mysql_query_attribute_string()` function cannot be used in DDL statements.
* Attributes are not replicated. Statements that invoke the `mysql_query_attribute_string()` function will not get the same value on all servers.

### Prerequisites for Using Query Attributes

To access query attributes within SQL statements for which attributes have been defined, the `query_attributes` component must be installed. Do so using this statement:

```
INSTALL COMPONENT "file://component_query_attributes";
```

Component installation is a one-time operation that need not be done per server startup. `INSTALL COMPONENT` loads the component, and also registers it in the `mysql.component` system table to cause it to be loaded during subsequent server startups.

The `query_attributes` component accesses query attributes to implement a `mysql_query_attribute_string()` function. See  Section 7.5.4, “Query Attribute Components”.

To uninstall the `query_attributes` component, use this statement:

```
UNINSTALL COMPONENT "file://component_query_attributes";
```

 `UNINSTALL COMPONENT` unloads the component, and unregisters it from the `mysql.component` system table to cause it not to be loaded during subsequent server startups.

Because installing and uninstalling the `query_attributes` component installs and uninstalls the `mysql_query_attribute_string()` function that the component implements, it is not necessary to use `CREATE FUNCTION` or `DROP FUNCTION` to do so.

### Query Attribute Loadable Functions

*  `mysql_query_attribute_string(name)`

  Applications can define attributes that apply to the next query sent to the server. The `mysql_query_attribute_string()` function returns an attribute value as a string, given the attribute name. This function enables a query to access and incorporate values of the attributes that apply to it.

   `mysql_query_attribute_string()` is installed by installing the `query_attributes` component. See Section 11.6, “Query Attributes”, which also discusses the purpose and use of query attributes.

  Arguments:

  + *`name`*: The attribute name.

  Return value:

  Returns the attribute value as a string for success, or `NULL` if the attribute does not exist.

  Example:

  The following example uses the `mysql` client `query_attributes` command to define query attributes that can be retrieved by `mysql_query_attribute_string()`. The `SELECT` shows that retrieving a nonexistent attribute (`n3`) returns `NULL`.

  ```
  mysql> query_attributes n1 v1 n2 v2;
  mysql> SELECT
      ->   mysql_query_attribute_string('n1') AS 'attr 1',
      ->   mysql_query_attribute_string('n2') AS 'attr 2',
      ->   mysql_query_attribute_string('n3') AS 'attr 3';
  +--------+--------+--------+
  | attr 1 | attr 2 | attr 3 |
  +--------+--------+--------+
  | v1     | v2     | NULL   |
  +--------+--------+--------+
  ```

