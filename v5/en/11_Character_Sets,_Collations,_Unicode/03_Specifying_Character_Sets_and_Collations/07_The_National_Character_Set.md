### 10.3.7 The National Character Set

Standard SQL defines [`NCHAR`](char.html "11.3.2 The CHAR and VARCHAR Types") or
[`NATIONAL CHAR`](char.html "11.3.2 The CHAR and VARCHAR Types") as a way to
indicate that a [`CHAR`](char.html "11.3.2 The CHAR and VARCHAR Types") column
should use some predefined character set. MySQL uses
`utf8` as this predefined character set. For
example, these data type declarations are equivalent:

```sql
CHAR(10) CHARACTER SET utf8
NATIONAL CHARACTER(10)
NCHAR(10)
```

As are these:

```sql
VARCHAR(10) CHARACTER SET utf8
NATIONAL VARCHAR(10)
NVARCHAR(10)
NCHAR VARCHAR(10)
NATIONAL CHARACTER VARYING(10)
NATIONAL CHAR VARYING(10)
```

You can use
`N'literal'` (or
`n'literal'`) to
create a string in the national character set. These statements
are equivalent:

```sql
SELECT N'some text';
SELECT n'some text';
SELECT _utf8'some text';
```