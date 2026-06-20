# Chapter 3 Upgrading MySQL

This chapter describes the steps to upgrade a MySQL installation.

Upgrading is a common procedure, as you pick up bug fixes within the
same MySQL release series or significant features between major
MySQL releases. You perform this procedure first on some test
systems to make sure everything works smoothly, and then on the
production systems.

Note

In the following discussion, MySQL commands that must be run using
a MySQL account with administrative privileges include `-u
root`  on the command line to specify
the MySQL `root` user. Commands that require a
password for `root` also include a
`-p` option. Because `-p` is
followed by no option value, such commands prompt for the
password. Type the password when prompted and press Enter.

SQL statements can be executed using the [**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client")
command-line client (connect as `root` to ensure
that you have the necessary privileges).