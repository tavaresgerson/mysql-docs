### 6.4.3 mysql\_tzinfo\_to\_sql — Load the Time Zone Tables

The **mysql\_tzinfo\_to\_sql** program loads the time zone tables in the `mysql` database. It is used on systems that have a zoneinfo database (the set of files describing time zones). Examples of such systems are Linux, FreeBSD, Solaris, and macOS. One likely location for these files is the `/usr/share/zoneinfo` directory (`/usr/share/lib/zoneinfo` on Solaris). If your system does not have a zoneinfo database, you can use the downloadable package described in Section 7.1.15, “MySQL Server Time Zone Support”.

**mysql\_tzinfo\_to\_sql** can be invoked several ways:

```
mysql_tzinfo_to_sql tz_dir
mysql_tzinfo_to_sql tz_file tz_name
mysql_tzinfo_to_sql --leap tz_file
```

For the first invocation syntax, pass the zoneinfo directory path name to **mysql\_tzinfo\_to\_sql** and send the output into the **mysql** program. For example:

```
mysql_tzinfo_to_sql /usr/share/zoneinfo | mysql -u root mysql
```

**mysql\_tzinfo\_to\_sql** reads your system's time zone files and generates SQL statements from them. **mysql** processes those statements to load the time zone tables.

The second syntax causes **mysql\_tzinfo\_to\_sql** to load a single time zone file *`tz_file`* that corresponds to a time zone name *`tz_name`*:

```
mysql_tzinfo_to_sql tz_file tz_name | mysql -u root mysql
```

If your time zone needs to account for leap seconds, invoke **mysql\_tzinfo\_to\_sql** using the third syntax, which initializes the leap second information. *`tz_file`* is the name of your time zone file:

```
mysql_tzinfo_to_sql --leap tz_file | mysql -u root mysql
```

After running **mysql\_tzinfo\_to\_sql**, it is best to restart the server so that it does not continue to use any previously cached time zone data.
