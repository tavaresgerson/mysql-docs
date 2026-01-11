### 7.5.7 Multilingual Engine Component (MLE)

7.5.7.1 MLE Component Option and Variable Reference

7.5.7.2 MLE Component Status and Session Information

7.5.7.3 MLE Component Memory and Thread Usage

7.5.7.4 MLE Component Stored Program Usage

The Multilingual Engine component (MLE) provides support for languages other than SQL in MySQL stored procedures and functions. The MLE Component is available as part of MySQL Enterprise Edition.

With the MLE component in MySQL 9.5, you can create and execute MySQL stored programs written in JavaScript. For more information about these, see Section 27.3, “JavaScript Stored Programs”. For general information about MySQL stored routines, see Section 27.2, “Using Stored Routines”.

* Purpose: Provide support for languages other than SQL in stored functions and stored procedures. In MySQL 9.5, only JavaScript (ECMAScript) is supported by MLE.

* URN: `file://component_mle`

For installation instructions, see Section 7.5.1, “Installing and Uninstalling Components”.

The MLE component is available on all platforms supported by MySQL Enterprise Edition, except for Solaris. See Supported Platforms for more information.

Note

You should be aware that not all MySQL 9.5 installations support removal of the MLE component. If your installation supports it, you can remove the component using `UNINSTALL COMPONENT`. See Section 7.5.1, “Installing and Uninstalling Components”, for information about how to do this.

For MySQL installations supporting the uninstallation of the MLE component, you should be aware that it is not possible to perform the uninstallation from within a user session that has created or executed any JavaScript stored procedures. For this reason, we recommend that you create and execute JavaScript stored procedures in a session separate from that used to install the MLE component; in this case it is possible, after exiting the session in which JavaScript stored procedures were created or used, to uninstall the component in a separate session.
