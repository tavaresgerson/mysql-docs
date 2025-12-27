## 19.3 Quick-Start Guide: MySQL for Visual Studio

This section explains how to use MySQL Shell to script a server using MySQL for Visual Studio.

### Introduction

MySQL for Visual Studio provides access to MySQL objects and data without forcing developers to leave Visual Studio. Designed and developed as a Visual Studio package, MySQL for Visual Studio integrates directly into Server Explorer providing a seamless experience for setting up new connections and working with database objects.

The following MySQL for Visual Studio features are available as of version 2.0.2:

* JavaScript and Python code editors, where scripts in those languages can be executed to query data from a MySQL database.

* Better integration with the Server Explorer to open MySQL, JavaScript, and Python code editors directly from a connected MySQL instance.

* A newer user interface for displaying query results, where different views are presented from result sets returned by a MySQL Server like:

  + Multiple tabs for each result set returned by an executed query.

  + Results view, where the information can be seen in grid, tree, or text representation for JSON results.

  + Field types view, where information about the columns of a result set is shown, such as names, data types, character sets, and more.

  + Query statistics view, displaying information about the executed query such as execution times, processed rows, index and temporary tables usage, and more.

  + Execution plan view, displaying an explanation of the query execution done internally by the MySQL Server.

### Getting Started

The requirements are MySQL for Visual Studio 2.0.2 or higher, and Visual Studio 2010 or higher. X DevAPI support requires MySQL Server 5.7.12 or higher with the X plugin enabled.

### Opening a Code Editor

Before opening a code editor that can execute queries against a MySQL server, a connection needs to be established:

1. Open the Server Explorer pane through the View menu, or with **Control** + **W**, **K**.

2. Right-click on the Data Connections node, select Add Connection....

3. In the Add Connection dialog, make sure the MySQL Data Provider is being used and fill in all the information.

   Note

   To enter the port number, click Advanced... and set the Port among the list of connection properties.

4. Click Test Connection to ensure you have a valid connection, then click OK.

5. Right-click your newly created connection, select New MySQL Script and then the language for the code editor you want to open.

For existing MySQL connections, to create a new editor you need only to do the last step.

### Using the Code Editor

The MySQL script editors have a toolbar at the start where information about the session is displayed, along with the actions that can be executed.

Note

Note the first two buttons in the toolbar represent a way to connect or disconnect from a MySQL server. If the editor was opened from the Server Explorer, the connection should be already established for the new editor window.

The third button is the Run button, the script contained in the editor window is executed by clicking it and results from the script execution are displayed below the script window.

Note

Some commands in the MySQL Shell can be executed without appending **execute()** while in interactive mode. In MySQL for Visual Studio, these commands do require **execute()**. In other words, append ".execute()" to execute commands.
