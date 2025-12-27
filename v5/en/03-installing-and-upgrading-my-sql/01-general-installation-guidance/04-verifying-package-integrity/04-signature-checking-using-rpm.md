#### 2.1.4.4 Signature Checking Using RPM

For RPM packages, there is no separate signature. RPM packages have a built-in GPG signature and MD5 checksum. You can verify a package by running the following command:

```sql
$> rpm --checksig package_name.rpm
```

Example:

```sql
$> rpm --checksig mysql-community-server-5.7.44-1.el8.x86_64.rpm
MySQL-server-5.7.44-1.el8.x86_64.rpm: digests signatures OK
```

Note

If you are using RPM 4.1 and it complains about `(GPG) NOT OK (MISSING KEYS: GPG#3a79bd29)`, even though you have imported the MySQL public build key into your own GPG keyring, you need to import the key into the RPM keyring first. RPM 4.1 no longer uses your personal GPG keyring (or GPG itself). Rather, RPM maintains a separate keyring because it is a system-wide application and a user's GPG public keyring is a user-specific file. To import the MySQL public key into the RPM keyring, first obtain the key, then use **rpm --import** to import the key. For example:

```sql
$> gpg --export -a 3a79bd29 > 3a79bd29.asc
$> rpm --import 3a79bd29.asc
```

Alternatively, **rpm** also supports loading the key directly from a URL:

```sql
$> rpm --import https://repo.mysql.com/RPM-GPG-KEY-mysql-2022
```

You can also obtain the MySQL public key from this manual page: Section 2.1.4.2, “Signature Checking Using GnuPG”.
