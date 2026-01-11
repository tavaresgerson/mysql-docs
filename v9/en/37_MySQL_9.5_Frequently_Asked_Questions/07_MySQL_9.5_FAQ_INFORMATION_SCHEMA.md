## A.7 MySQL 9.5 FAQ: INFORMATION\_SCHEMA

A.7.1. Where can I find documentation for the MySQL INFORMATION\_SCHEMA database?

A.7.2. Is there a discussion forum for INFORMATION\_SCHEMA?

A.7.3. Where can I find the ANSI SQL 2003 specification for INFORMATION\_SCHEMA?

A.7.4. What is the difference between the Oracle Data Dictionary and MySQL INFORMATION\_SCHEMA?

A.7.5. Can I add to or otherwise modify the tables found in the INFORMATION\_SCHEMA database?

<table style="width: 100%;"><tbody><tr><td><p><b>A.7.1.</b></p></td><td><p> Where can I find documentation for the MySQL <code>INFORMATION_SCHEMA</code> database? </p></td></tr><tr><td></td><td><p> See Chapter 28, <i>INFORMATION_SCHEMA Tables</i>. </p><p> You may also find the MySQL User Forums to be helpful. </p></td></tr><tr><td><p><b>A.7.2.</b></p></td><td><p> Is there a discussion forum for <code>INFORMATION_SCHEMA</code>? </p></td></tr><tr><td></td><td><p> See the MySQL User Forums. </p></td></tr><tr><td><p><b>A.7.3.</b></p></td><td><p> Where can I find the ANSI SQL 2003 specification for <code>INFORMATION_SCHEMA</code>? </p></td></tr><tr><td></td><td><p> Unfortunately, the official specifications are not freely available. (ANSI makes them available for purchase.) However, there are books available, such as <em>SQL-99 Complete, Really</em> by Peter Gulutzan and Trudy Pelzer, that provide a comprehensive overview of the standard, including <code>INFORMATION_SCHEMA</code>. </p></td></tr><tr><td><p><b>A.7.4.</b></p></td><td><p> What is the difference between the Oracle Data Dictionary and MySQL <code>INFORMATION_SCHEMA</code>? </p></td></tr><tr><td></td><td><p> Both Oracle and MySQL provide metadata in tables. However, Oracle and MySQL use different table names and column names. The MySQL implementation is more similar to those found in DB2 and SQL Server, which also support <code>INFORMATION_SCHEMA</code> as defined in the SQL standard. </p></td></tr><tr><td><p><b>A.7.5.</b></p></td><td><p> Can I add to or otherwise modify the tables found in the <code>INFORMATION_SCHEMA</code> database? </p></td></tr><tr><td></td><td><p> No. Since applications may rely on a certain standard structure, this should not be modified. For this reason, <span><em>we cannot support bugs or other issues which result from modifying <code>INFORMATION_SCHEMA</code> tables or data</em></span>. </p></td></tr></tbody></table>
