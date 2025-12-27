### 5.1.2 Server Configuration Defaults

The MySQL server has many operating parameters, which you can change at server startup using command-line options or configuration files (option files). It is also possible to change many parameters at runtime. For general instructions on setting parameters at startup or runtime, see [Section 5.1.6, “Server Command Options”](server-options.html "5.1.6 Server Command Options"), and [Section 5.1.7, “Server System Variables”](server-system-variables.html "5.1.7 Server System Variables").

On Windows, MySQL Installer interacts with the user and creates a file named `my.ini` in the base installation directory as the default option file. If you install on Windows from a Zip archive, you can copy the `my-default.ini` template file in the base installation directory to `my.ini` and use the latter as the default option file.

Note

As of MySQL 5.7.18, `my-default.ini` is no longer included in or installed by distribution packages.

Note

On Windows, the `.ini` or `.cnf` option file extension might not be displayed.

After completing the installation process, you can edit the default option file at any time to modify the parameters used by the server. For example, to use a parameter setting in the file that is commented with a `#` character at the beginning of the line, remove the `#`, and modify the parameter value if necessary. To disable a setting, either add a `#` to the beginning of the line or remove it.

For non-Windows platforms, no default option file is created during either the server installation or the data directory initialization process. Create your option file by following the instructions given in [Section 4.2.2.2, “Using Option Files”](option-files.html "4.2.2.2 Using Option Files"). Without an option file, the server just starts with its default settings—see [Section 5.1.2, “Server Configuration Defaults”](server-configuration-defaults.html "5.1.2 Server Configuration Defaults") on how to check those settings.

For additional information about option file format and syntax, see [Section 4.2.2.2, “Using Option Files”](option-files.html "4.2.2.2 Using Option Files").
