## A.13 MySQL 9.5 FAQ: C API, libmysql

Frequently asked questions about MySQL C API and libmysql.

A.13.1. What is “MySQL Native C API”? What are typical benefits and use cases?

A.13.2. Which version of libmysql should I use?

A.13.3. What if I want to use the “NoSQL” X DevAPI?

A.13.4. How to I download libmysql?

A.13.5. Where is the documentation?

A.13.6. How do I report bugs?

A.13.7. Is it possible to compile the library myself?

<table border="0" style="width: 100%;"><colgroup><col align="left" width="1%"/><col/></colgroup><tbody><tr class="question"><td align="left" valign="top"><p><b>A.13.1.</b></p></td><td align="left" valign="top"><p> What is <span class="quote">“<span class="quote">MySQL Native C API</span>”</span>? What are typical benefits and use cases? </p></td></tr><tr class="answer"><td align="left" valign="top"></td><td align="left" valign="top"><p> libmysql is a C-based API that you can use in C applications to connect with the MySQL database server. It is also itself used as the foundation for drivers for standard database APIs like ODBC, Perl's DBI, and Python's DB API. </p></td></tr><tr class="question"><td align="left" valign="top"><p><b>A.13.2.</b></p></td><td align="left" valign="top"><p> Which version of libmysql should I use? </p></td></tr><tr class="answer"><td align="left" valign="top"></td><td align="left" valign="top"><p> For MySQL 9.1 we recommend libmysql 9.1. </p></td></tr><tr class="question"><td align="left" valign="top"><p><b>A.13.3.</b></p></td><td align="left" valign="top"><p> What if I want to use the <span class="quote">“<span class="quote">NoSQL</span>”</span> X DevAPI? </p></td></tr><tr class="answer"><td align="left" valign="top"></td><td align="left" valign="top"><p> For C-language and X DevApi Document Store for MySQL, we recommend MySQL Connector/C++. Connector/C++ has compatible C headers. (This is not applicable to MySQL 5.7 or before.) </p></td></tr><tr class="question"><td align="left" valign="top"><p><b>A.13.4.</b></p></td><td align="left" valign="top"><p> How to I download libmysql? </p></td></tr><tr class="answer"><td align="left" valign="top"></td><td align="left" valign="top"> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> Linux: The Client Utilities Package is available from the MySQL Community Server download page. </p></li><li class="listitem"><p> Repos: The Client Utilities Package is available from the Yum, APT, SuSE repositories. </p></li><li class="listitem"><p> Windows: The Client Utilities Package is available from Windows Installer. </p></li></ul> </div> </td></tr><tr class="question"><td align="left" valign="top"><p><b>A.13.5.</b></p></td><td align="left" valign="top"><p> Where is the documentation? </p></td></tr><tr class="answer"><td align="left" valign="top"></td><td align="left" valign="top"><p> See MySQL 9.5 C API Developer Guide. </p></td></tr><tr class="question"><td align="left" valign="top"><p><b>A.13.6.</b></p></td><td align="left" valign="top"><p> How do I report bugs? </p></td></tr><tr class="answer"><td align="left" valign="top"></td><td align="left" valign="top"><p> Please report any bugs or inconsistencies you observe to our Bugs Database. Select the C API Client as shown. </p></td></tr><tr class="question"><td align="left" valign="top"><p><b>A.13.7.</b></p></td><td align="left" valign="top"><p> Is it possible to compile the library myself? </p></td></tr><tr class="answer"><td align="left" valign="top"></td><td align="left" valign="top"><p> Compiling MySQL Server also compiles libmysqlclient; there is not a way to only compile libmysqlclient. For related information, see MySQL C API Implementations. </p></td></tr></tbody></table>
