### 10.8.6 Examples of the Effect of Collation

**Example 1: Sorting German Umlauts**

Suppose that column `X` in table `T` has these `latin1` column values:

```sql
Muffler
Müller
MX Systems
MySQL
```

Suppose also that the column values are retrieved using the following statement:

```sql
SELECT X FROM T ORDER BY X COLLATE collation_name;
```

The following table shows the resulting order of the values if we use `ORDER BY` with different collations.

<table summary="An example of the effect of collation, as described in the preceding text. The table shows the resulting order of values for three collations (latin1_swedish_ci, latin1_german1_ci, latin1_german2_ci) when using ORDER BY."><col style="width: 30%"/><col style="width: 30%"/><col style="width: 30%"/><thead><tr> <th scope="col"><code>latin1_swedish_ci</code></th> <th scope="col"><code>latin1_german1_ci</code></th> <th scope="col"><code>latin1_german2_ci</code></th> </tr></thead><tbody><tr> <th scope="row">Muffler</th> <td>Muffler</td> <td>Müller</td> </tr><tr> <th scope="row">MX Systems</th> <td>Müller</td> <td>Muffler</td> </tr><tr> <th scope="row">Müller</th> <td>MX Systems</td> <td>MX Systems</td> </tr><tr> <th scope="row">MySQL</th> <td>MySQL</td> <td>MySQL</td> </tr></tbody></table>

The character that causes the different sort orders in this example is the U with two dots over it (`ü`), which the Germans call “U-umlaut.”

* The first column shows the result of the `SELECT` using the Swedish/Finnish collating rule, which says that U-umlaut sorts with Y.

* The second column shows the result of the `SELECT` using the German DIN-1 rule, which says that U-umlaut sorts with U.

* The third column shows the result of the `SELECT` using the German DIN-2 rule, which says that U-umlaut sorts with UE.

**Example 2: Searching for German Umlauts**

Suppose that you have three tables that differ only by the character set and collation used:

```sql
mysql> SET NAMES utf8;
mysql> CREATE TABLE german1 (
         c CHAR(10)
       ) CHARACTER SET latin1 COLLATE latin1_german1_ci;
mysql> CREATE TABLE german2 (
         c CHAR(10)
       ) CHARACTER SET latin1 COLLATE latin1_german2_ci;
mysql> CREATE TABLE germanutf8 (
         c CHAR(10)
       ) CHARACTER SET utf8 COLLATE utf8_unicode_ci;
```

Each table contains two records:

```sql
mysql> INSERT INTO german1 VALUES ('Bar'), ('Bär');
mysql> INSERT INTO german2 VALUES ('Bar'), ('Bär');
mysql> INSERT INTO germanutf8 VALUES ('Bar'), ('Bär');
```

Two of the above collations have an `A = Ä` equality, and one has no such equality (`latin1_german2_ci`). For that reason, you'll get these results in comparisons:

```sql
mysql> SELECT * FROM german1 WHERE c = 'Bär';
+------+
| c    |
+------+
| Bar  |
| Bär  |
+------+
mysql> SELECT * FROM german2 WHERE c = 'Bär';
+------+
| c    |
+------+
| Bär  |
+------+
mysql> SELECT * FROM germanutf8 WHERE c = 'Bär';
+------+
| c    |
+------+
| Bar  |
| Bär  |
+------+
```

This is not a bug but rather a consequence of the sorting properties of `latin1_german1_ci` and `utf8_unicode_ci` (the sorting shown is done according to the German DIN 5007 standard).
