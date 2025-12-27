## 2.11 Downgrading MySQL

2.11.1 Before You Begin

2.11.2 Downgrade Paths

2.11.3 Downgrade Notes

2.11.4 Downgrading Binary and Package-based Installations on Unix/Linux

2.11.5 Downgrade Troubleshooting

This section describes the steps to downgrade a MySQL installation.

Downgrading is a less common operation than upgrade. Downgrading is typically performed because of a compatibility or performance issue that occurs on a production system, and was not uncovered during initial upgrade verification on the test systems. As with the upgrade procedure Section 2.10, “Upgrading MySQL”), perform and verify the downgrade procedure on some test systems first, before using it on a production system.

Note

In the following discussion, MySQL commands that must be run using a MySQL account with administrative privileges include `-u root` on the command line to specify the MySQL `root` user. Commands that require a password for `root` also include a `-p` option. Because `-p` is followed by no option value, such commands prompt for the password. Type the password when prompted and press Enter.

SQL statements can be executed using the **mysql** command-line client (connect as `root` to ensure that you have the necessary privileges).
