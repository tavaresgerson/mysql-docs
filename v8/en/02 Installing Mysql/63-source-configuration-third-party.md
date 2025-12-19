### 2.8.9 MySQL Configuration and Third-Party Tools

Third-party tools that need to determine the MySQL version from the MySQL source can read the `MYSQL_VERSION` file in the top-level source directory. The file lists the pieces of the version separately. For example, if the version is MySQL 8.4.0, the file looks like this:

```
MYSQL_VERSION_MAJOR=8
MYSQL_VERSION_MINOR=4
MYSQL_VERSION_PATCH=0
MYSQL_VERSION_EXTRA="INNOVATION"
```

To construct a five-digit number from the version components, use this formula:

```
MYSQL_VERSION_MAJOR*10000 + MYSQL_VERSION_MINOR*100 + MYSQL_VERSION_PATCH
```
