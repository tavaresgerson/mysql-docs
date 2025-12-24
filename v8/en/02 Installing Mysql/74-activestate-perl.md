### 2.10.2 Installing ActiveState Perl on Windows

On Windows, you should do the following to install the MySQL `DBD` module with ActiveState Perl:

1. Get ActiveState Perl from <http://www.activestate.com/Products/ActivePerl/> and install it.
2. Open a console window.
3. If necessary, set the `HTTP_proxy` variable. For example, you might try a setting like this:

   ```
   C:\> set HTTP_proxy=my.proxy.com:3128
   ```
4. Start the PPM program:

   ```
   C:\> C:\perl\bin\ppm.pl
   ```
5. If you have not previously done so, install `DBI`:

   ```
   ppm> install DBI
   ```
6. If this succeeds, run the following command:

   ```
   ppm> install DBD-mysql
   ```

This procedure should work with `ActiveState Perl 5.6` or higher.

If you cannot get the procedure to work, you should install the ODBC driver instead and connect to the MySQL server through ODBC:

```
use DBI;
$dbh= DBI->connect("DBI:ODBC:$dsn",$user,$password) ||
  die "Got error $DBI::errstr when connecting to $dsn\n";
```
