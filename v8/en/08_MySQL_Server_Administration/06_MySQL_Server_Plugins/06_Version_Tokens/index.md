### 7.6.6 Version Tokens

7.6.6.1 Version Tokens Elements

7.6.6.2 Installing or Uninstalling Version Tokens

7.6.6.3 Using Version Tokens

7.6.6.4 Version Tokens Reference

MySQL includes Version Tokens, a feature that enables creation of and synchronization around server tokens that applications can use to prevent accessing incorrect or out-of-date data.

The Version Tokens interface has these characteristics:

* Version tokens are pairs consisting of a name that serves as a key or identifier, plus a value.

* Version tokens can be locked. An application can use token locks to indicate to other cooperating applications that tokens are in use and should not be modified.

* Version token lists are established per server (for example, to specify the server assignment or operational state). In addition, an application that communicates with a server can register its own list of tokens that indicate the state it requires the server to be in. An SQL statement sent by the application to a server not in the required state produces an error. This is a signal to the application that it should seek a different server in the required state to receive the SQL statement.

The following sections describe the elements of Version Tokens, discuss how to install and use it, and provide reference information for its elements.
