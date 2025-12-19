--- title: MySQL 8.4 Reference Manual :: 12.13.2 String Collating Support for Complex Character Sets url: https://dev.mysql.com/doc/refman/8.4/en/string-collating.html order: 53 ---



### 12.13.2 String Collating Support for Complex Character Sets

For a simple character set named *`MYSET`*, sorting rules are specified in the `MYSET.xml` configuration file using `<map>` array elements within `<collation>` elements. If the sorting rules for your language are too complex to be handled with simple arrays, you must define string collating functions in the `ctype-MYSET.c` source file in the `strings` directory.

The existing character sets provide the best documentation and examples to show how these functions are implemented. Look at the `ctype-*.c` files in the `strings` directory, such as the files for the `big5`, `czech`, `gbk`, `sjis`, and `tis160` character sets. Take a look at the `MY_COLLATION_HANDLER` structures to see how they are used. See also the `CHARSET_INFO.txt` file in the `strings` directory for additional information.


