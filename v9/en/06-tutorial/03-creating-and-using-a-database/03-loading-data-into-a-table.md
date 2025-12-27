### 5.3.3 Loading Data into a Table

After creating your table, you need to populate it. The `LOAD DATA` and `INSERT` statements are useful for this.

Suppose that your pet records can be described as shown here. (Observe that MySQL expects dates in `'YYYY-MM-DD'` format; this may differ from what you are used to.)

<table summary="Example of pet records mentioned in the preceding text."><col style="width: 10%"/><col style="width: 10%"/><col style="width: 10%"/><col style="width: 05%"/><col style="width: 20%"/><col style="width: 20%"/><thead><tr> <th scope="col">name</th> <th scope="col">owner</th> <th scope="col">species</th> <th scope="col">sex</th> <th scope="col">birth</th> <th scope="col">death</th> </tr></thead><tbody><tr> <th scope="row">Fluffy</th> <td>Harold</td> <td>cat</td> <td>f</td> <td>1993-02-04</td> <td></td> </tr><tr> <th scope="row">Claws</th> <td>Gwen</td> <td>cat</td> <td>m</td> <td>1994-03-17</td> <td></td> </tr><tr> <th scope="row">Buffy</th> <td>Harold</td> <td>dog</td> <td>f</td> <td>1989-05-13</td> <td></td> </tr><tr> <th scope="row">Fang</th> <td>Benny</td> <td>dog</td> <td>m</td> <td>1990-08-27</td> <td></td> </tr><tr> <th scope="row">Bowser</th> <td>Diane</td> <td>dog</td> <td>m</td> <td>1979-08-31</td> <td>1995-07-29</td> </tr><tr> <th scope="row">Chirpy</th> <td>Gwen</td> <td>bird</td> <td>f</td> <td>1998-09-11</td> <td></td> </tr><tr> <th scope="row">Whistler</th> <td>Gwen</td> <td>bird</td> <td></td> <td>1997-12-09</td> <td></td> </tr><tr> <th scope="row">Slim</th> <td>Benny</td> <td>snake</td> <td>m</td> <td>1996-04-29</td> <td></td> </tr></tbody></table>

Because you are beginning with an empty table, an easy way to populate it is to create a text file containing a row for each of your animals, then load the contents of the file into the table with a single statement.

You could create a text file `pet.txt` containing one record per line, with values separated by tabs, and given in the order in which the columns were listed in the `CREATE TABLE` statement. For missing values (such as unknown sexes or death dates for animals that are still living), you can use `NULL` values. To represent these in your text file, use `\N` (backslash, capital-N). For example, the record for Whistler the bird would look like this (where the whitespace between values is a single tab character):

```
Whistler        Gwen    bird    \N      1997-12-09      \N
```

To load the text file `pet.txt` into the `pet` table, use this statement:

```
mysql> LOAD DATA LOCAL INFILE '/path/pet.txt' INTO TABLE pet;
```

If you created the file on Windows with an editor that uses `\r\n` as a line terminator, you should use this statement instead:

```
mysql> LOAD DATA LOCAL INFILE '/path/pet.txt' INTO TABLE pet
       LINES TERMINATED BY '\r\n';
```

(On an Apple machine running macOS, you would likely want to use `LINES TERMINATED BY '\r'`.)

You can specify the column value separator and end of line marker explicitly in the `LOAD DATA` statement if you wish, but the defaults are tab and linefeed. These are sufficient for the statement to read the file `pet.txt` properly.

If the statement fails, it is likely that your MySQL installation does not have local file capability enabled by default. See Section 8.1.6, “Security Considerations for LOAD DATA LOCAL”, for information on how to change this.

When you want to add new records one at a time, the `INSERT` statement is useful. In its simplest form, you supply values for each column, in the order in which the columns were listed in the `CREATE TABLE` statement. Suppose that Diane gets a new hamster named “Puffball.” You could add a new record using an `INSERT` statement like this:

```
mysql> INSERT INTO pet
       VALUES ('Puffball','Diane','hamster','f','1999-03-30',NULL);
```

String and date values are specified as quoted strings here. Also, with `INSERT`, you can insert `NULL` directly to represent a missing value. You do not use `\N` like you do with `LOAD DATA`.

From this example, you should be able to see that there would be a lot more typing involved to load your records initially using several `INSERT` statements rather than a single `LOAD DATA` statement.
