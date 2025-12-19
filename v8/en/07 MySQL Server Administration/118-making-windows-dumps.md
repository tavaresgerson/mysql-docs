#### 7.9.1.3 Using WER with PDB to create a Windows crashdump

Program Database files (with suffix `pdb`) are included in the **ZIP Archive Debug Binaries & Test Suite** distribution of MySQL. These files provide information for debugging your MySQL installation in the event of a problem. This is a separate download from the standard MSI or Zip file.

::: info Note

The PDB files are available in a separate file labeled "ZIP Archive Debug Binaries & Test Suite".


:::

The PDB file contains more detailed information about `mysqld` and other tools that enables more detailed trace and dump files to be created. You can use these with **WinDbg** or Visual Studio to debug **mysqld**.

For more information on PDB files and the debugging options available, see [Debugging Tools for Windows](https://learn.microsoft.com/en-us/windows-hardware/drivers/debugger/).

To use WinDbg, either install the full Windows Driver Kit (WDK) or install the standalone version.

Important

The `.exe` and `.pdb` files must be an exact match (both version number and MySQL server edition); otherwise, or WinDBG complains while attempting to load the symbols.

1. To generate a minidump `mysqld.dmp`, enable the  `core-file` option under the [mysqld] section in `my.ini`. Restart the MySQL server after making these changes.
2. Create a directory to store the generated files, such as `c:\symbols`
3. Determine the path to your **windbg.exe** executable using the Find GUI or from the command line, for example: `dir /s /b windbg.exe` -- a common default is *C:\Program Files\Debugging Tools for Windows (x64)\windbg.exe*
4. Launch `windbg.exe` giving it the paths to `mysqld.exe`, `mysqld.pdb`, `mysqld.dmp`, and the source code. Alternatively, pass in each path from the WinDbg GUI. For example:

   ```
   windbg.exe -i "C:\mysql-8.4.6-winx64\bin\"^
    -z "C:\mysql-8.4.6-winx64\data\mysqld.dmp"^
    -srcpath "E:\ade\mysql_archives\8.4\8.4.6\mysql-8.4.6"^
    -y "C:\mysql-8.4.6-winx64\bin;SRV*c:\symbols*http://msdl.microsoft.com/download/symbols"^
    -v -n -c "!analyze -vvvvv"
   ```

   ::: info Note

   The `^` character and newline are removed by the Windows command line processor, so be sure the spaces remain intact.

   :::
