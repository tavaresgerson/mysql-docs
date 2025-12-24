#### 1.7.2.4 `'--'` as the Start of a Comment

Standard SQL uses the C syntax `/* this is a comment */` for comments, and MySQL Server supports this syntax as well. MySQL also support extensions to this syntax that enable MySQL-specific SQL to be embedded in the comment; see  Section 11.7, “Comments”.

MySQL Server also uses `#` as the start comment character. This is nonstandard.

Standard SQL also uses “`--`” as a start-comment sequence. MySQL Server supports a variant of the `--` comment style; the `--` start-comment sequence is accepted as such, but must be followed by a whitespace character such as a space or newline. The space is intended to prevent problems with generated SQL queries that use constructs such as the following, which updates the balance to reflect a charge:

```sql
UPDATE account SET balance=balance-charge
WHERE account_id=user_id
```

Consider what happens when `charge` has a negative value such as `-1`, which might be the case when an amount is credited to the account. In this case, the generated statement looks like this:

```sql
UPDATE account SET balance=balance--1
WHERE account_id=5752;
```

`balance--1` is valid standard SQL, but `--` is interpreted as the start of a comment, and part of the expression is discarded. The result is a statement that has a completely different meaning than intended:

```sql
UPDATE account SET balance=balance
WHERE account_id=5752;
```

This statement produces no change in value at all. To keep this from happening, MySQL requires a whitespace character following the `--` for it to be recognized as a start-comment sequence in MySQL Server, so that an expression such as `balance--1` is always safe to use.
