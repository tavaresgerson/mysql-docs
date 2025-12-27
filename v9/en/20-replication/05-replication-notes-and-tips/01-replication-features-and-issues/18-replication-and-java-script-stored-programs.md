#### 19.5.1.18 Replication and JavaScript Stored Programs

MySQL Replication is compatible with JavaScript stored programs, provided that the MLE component is installed on each and every server in the topology, due to the following issues:

* A replica without the component installed accepts `CREATE FUNCTION` and `CREATE PROCEDURE` statements containing JavaScript code from the source, but the replica cannot execute the stored programs thus created.

* A JavaScript stored program created on a server without the component installed is not checked for validity.

* The following SQL statements cannot be executed successfully on a replica that does not have the component installed:

  + `CREATE LIBRARY`
  + `DROP LIBRARY`
  + A `CREATE FUNCTION` or `CREATE PROCEDURE` statement which contains a `USING` clause

  On a server without the MLE component, each of the statements just shown is rejected with a syntax error.

This means that, when a `CREATE FUNCTION` or `CREATE PROCEDURE` statement without `USING`, and which contains invalid JavaScript code, is executed on a server without the MLE component installed, the statement succeeds, and thus is replicated. If the replica has the MLE component installed, an error is raised when the replica attempts to execute such a statement, leading to a break in replication.

In addition, when `CREATE LIBRARY`, `DROP LIBRARY`, `CREATE FUNCTION ... USING`, or `CREATE PROCEDURE ... USING` is executed on a server without the MLE component installed, the statement is always rejected because the server does not support the syntax.

For installing (or uninstalling) the MLE component on MySQL servers used in replication, it recommended that you stop replication, install (or uninstall) the component on every server in the topology, and only then allow replication to resume. Replicating between servers in a mixed setting (that is, in which some servers have the MLE component installed and some do not) is not supported for the reasons stated in the previous paragraph.

For more information about JavaScript stored programs in MySQL, see Section 27.3, “JavaScript Stored Programs”. For information about the MLE component, see Section 7.5.7, “Multilingual Engine Component (MLE)”").
