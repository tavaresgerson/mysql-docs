## 31.9 MySQL Perl API

The Perl `DBI` module provides a generic interface for database access. You can write a DBI script that works with many different database engines without change. To use DBI with MySQL, install the following:

1. The `DBI` module.
2. The `DBD::mysql` module. This is the DataBase Driver (DBD) module for Perl.
3. Optionally, the DBD module for any other type of database server you want to access.

Perl DBI is the recommended Perl interface. It replaces an older interface called `mysqlperl`, which should be considered obsolete.

These sections contain information about using Perl with MySQL and writing MySQL applications in Perl:

* For installation instructions for Perl DBI support, see  Section 2.10, “Perl Installation Notes”.
* For an example of reading options from option files, see  Section 7.8.4, “Using Client Programs in a Multiple-Server Environment”.
* For secure coding tips, see  Section 8.1.1, “Security Guidelines”.
* For debugging tips, see  Section 7.9.1.4, “Debugging mysqld under gdb”.
* For some Perl-specific environment variables, see  Section 6.9, “Environment Variables”.
* For considerations for running on macOS, see  Section 2.4, “Installing MySQL on macOS”.
* For ways to quote string literals, see  Section 11.1.1, “String Literals”.

DBI information is available at the command line, online, or in printed form:

* Once you have the `DBI` and `DBD::mysql` modules installed, you can get information about them at the command line with the `perldoc` command:

  ```
  $> perldoc DBI
  $> perldoc DBI::FAQ
  $> perldoc DBD::mysql
  ```

  You can also use `pod2man`, `pod2html`, and so on to translate this information into other formats.
* For online information about Perl DBI, visit the DBI website, <http://dbi.perl.org/>. That site hosts a general DBI mailing list.
* For printed information, the official DBI book is *Programming the Perl DBI* (Alligator Descartes and Tim Bunce, O'Reilly & Associates, 2000). Information about the book is available at the DBI website, <http://dbi.perl.org/>.

