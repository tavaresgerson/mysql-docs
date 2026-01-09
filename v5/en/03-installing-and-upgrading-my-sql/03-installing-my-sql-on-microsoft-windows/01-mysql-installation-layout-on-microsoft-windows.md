### 2.3.1 MySQL Installation Layout on Microsoft Windows

For MySQL 5.7 on Windows, the default installation directory is `C:\Program Files\MySQL\MySQL Server 5.7` for installations performed with MySQL Installer. If you use the ZIP archive method to install MySQL, you may prefer to install in `C:\mysql`. However, the layout of the subdirectories remains the same.

All of the files are located within this parent directory, using the structure shown in the following table.

**Table 2.4 Default MySQL Installation Layout for Microsoft Windows**

<table><col style="width: 30%"/><col style="width: 40%"/><col style="width: 30%"/><thead><tr> <th>Directory</th> <th>Contents of Directory</th> <th>Notes</th> </tr></thead><tbody><tr> <th><code>bin</code></th> <td><span><strong>mysqld</strong></span> server, client and utility programs</td> <td></td> </tr><tr> <th><code>%PROGRAMDATA%\MySQL\MySQL Server 5.7\</code></th> <td>Log files, databases</td> <td>The Windows system variable <code class="varname">%PROGRAMDATA%</code> defaults to <code>C:\ProgramData</code>.</td> </tr><tr> <th><code>docs</code></th> <td>Release documentation</td> <td>With MySQL Installer, use the <code>Modify</code> operation to select this optional folder.</td> </tr><tr> <th><code>include</code></th> <td>Include (header) files</td> <td></td> </tr><tr> <th><code>lib</code></th> <td>Libraries</td> <td></td> </tr><tr> <th><code>share</code></th> <td>Miscellaneous support files, including error messages, character set files, sample configuration files, SQL for database installation</td> <td></td> </tr></tbody></table>
