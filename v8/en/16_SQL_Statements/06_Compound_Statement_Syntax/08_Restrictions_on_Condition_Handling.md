### 15.6.8 Restrictions on Condition Handling

[`SIGNAL`](signal.html "15.6.7.5 SIGNAL Statement"),
[`RESIGNAL`](resignal.html "15.6.7.4 RESIGNAL Statement"), and
[`GET DIAGNOSTICS`](get-diagnostics.html "15.6.7.3 GET DIAGNOSTICS Statement") are not permissible
as prepared statements. For example, this statement is invalid:

```
PREPARE stmt1 FROM 'SIGNAL SQLSTATE "02000"';
```

`SQLSTATE` values in class
`'04'` are not treated specially. They are
handled the same as other exceptions.

In standard SQL, the first condition relates to the
`SQLSTATE` value returned for the previous SQL
statement. In MySQL, this is not guaranteed, so to get the main
error, you cannot do this:

```
GET DIAGNOSTICS CONDITION 1 @errno = MYSQL_ERRNO;
```

Instead, do this:

```
GET DIAGNOSTICS @cno = NUMBER;
GET DIAGNOSTICS CONDITION @cno @errno = MYSQL_ERRNO;
```