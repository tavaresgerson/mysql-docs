#### 2.1.4.4 Signature Checking Using RPM

For RPM packages, there is no separate signature. RPM packages have a built-in GPG signature and MD5 checksum. You can verify a package by running the following command:

```
$> rpm --checksig package_name.rpm
```

Example:

```
$> rpm --checksig mysql-community-server-9.5.0-1.el8.x86_64.rpm
mysql-community-server-9.5.0-1.el8.x86_64.rpm: digests signatures OK
```

Note

If you are using RPM 4.1 and it complains about `(GPG) NOT OK (MISSING KEYS: GPG#a8d3785c)`, even though you have imported the MySQL public build key into your own GPG keyring, you need to import the key into the RPM keyring first. RPM 4.1 no longer uses your personal GPG keyring (or GPG itself). Rather, RPM maintains a separate keyring because it is a system-wide application and a user's GPG public keyring is a user-specific file. To import the MySQL public key into the RPM keyring, first obtain the key, then use **rpm --import** to import the key. For example:

```
$> gpg --export -a a8d3785c > a8d3785c.asc
$> rpm --import a8d3785c.asc
```

Alternatively, **rpm** also supports loading the key directly from a URL:

```
$> rpm --import https://repo.mysql.com/RPM-GPG-KEY-mysql-2023
```

You can also obtain the MySQL public key from this manual page: Section 2.1.4.2, “Signature Checking Using GnuPG”.
