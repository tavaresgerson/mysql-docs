### 11.2.1 Identifier Length Limits

The following table describes the maximum length for each type of identifier.

<table summary="The maximum length for each type of MySQL object identifier."><thead><tr> <th>Identifier Type</th> <th>Maximum Length (characters)</th> </tr></thead><tbody><tr> <td>Database</td> <td>64 (includes NDB Cluster 8.0.18 and later)</td> </tr><tr> <td>Table</td> <td>64 (includes NDB Cluster 8.0.18 and later)</td> </tr><tr> <td>Column</td> <td>64</td> </tr><tr> <td>Index</td> <td>64</td> </tr><tr> <td>Constraint</td> <td>64</td> </tr><tr> <td>Stored Program</td> <td>64</td> </tr><tr> <td>View</td> <td>64</td> </tr><tr> <td>Tablespace</td> <td>64</td> </tr><tr> <td>Server</td> <td>64</td> </tr><tr> <td>Log File Group</td> <td>64</td> </tr><tr> <td>Alias</td> <td>256 (see exception following table)</td> </tr><tr> <td>Compound Statement Label</td> <td>16</td> </tr><tr> <td>User-Defined Variable</td> <td>64</td> </tr><tr> <td>Resource Group</td> <td>64</td> </tr></tbody></table>

Aliases for column names in `CREATE VIEW` statements are checked against the maximum column length of 64 characters (not the maximum alias length of 256 characters).

For constraint definitions that include no constraint name, the server internally generates a name derived from the associated table name. For example, internally generated foreign key and `CHECK` constraint names consist of the table name plus `_ibfk_` or `_chk_` and a number. If the table name is close to the length limit for constraint names, the additional characters required for the constraint name may cause that name to exceed the limit, resulting in an error.

Identifiers are stored using Unicode (UTF-8). This applies to identifiers in table definitions and to identifiers stored in the grant tables in the `mysql` database. The sizes of the identifier string columns in the grant tables are measured in characters. You can use multibyte characters without reducing the number of characters permitted for values stored in these columns.

Prior to NDB 8.0.18, NDB Cluster imposed a maximum length of 63 characters for names of databases and tables. As of NDB 8.0.18, this limitation is removed. See Section 25.2.7.11, “Previous NDB Cluster Issues Resolved in NDB Cluster 8.0”.

Values such as user name and host names in MySQL account names are strings rather than identifiers. For information about the maximum length of such values as stored in grant tables, see Grant Table Scope Column Properties.
