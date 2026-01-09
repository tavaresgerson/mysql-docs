## 3.6 Examples of Common Queries

[3.6.1 The Maximum Value for a Column](example-maximum-column.html)

[3.6.2 The Row Holding the Maximum of a Certain Column](example-maximum-row.html)

[3.6.3 Maximum of Column per Group](example-maximum-column-group.html)

[3.6.4 The Rows Holding the Group-wise Maximum of a Certain Column](example-maximum-column-group-row.html)

[3.6.5 Using User-Defined Variables](example-user-variables.html)

[3.6.6 Using Foreign Keys](example-foreign-keys.html)

[3.6.7 Searching on Two Keys](searching-on-two-keys.html)

[3.6.8 Calculating Visits Per Day](calculating-days.html)

[3.6.9 Using AUTO_INCREMENT](example-auto-increment.html)

Here are examples of how to solve some common problems with MySQL.

Some of the examples use the table `shop` to hold the price of each article (item number) for certain traders (dealers). Supposing that each trader has a single fixed price per article, then (`article`, `dealer`) is a primary key for the records.

Start the command-line tool [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") and select a database:

```sql
$> mysql your-database-name
```

To create and populate the example table, use these statements:

```sql
CREATE TABLE shop (
    article INT UNSIGNED  DEFAULT '0000' NOT NULL,
    dealer  CHAR(20)      DEFAULT ''     NOT NULL,
    price   DECIMAL(16,2) DEFAULT '0.00' NOT NULL,
    PRIMARY KEY(article, dealer));
INSERT INTO shop VALUES
    (1,'A',3.45),(1,'B',3.99),(2,'A',10.99),(3,'B',1.45),
    (3,'C',1.69),(3,'D',1.25),(4,'D',19.95);
```

After issuing the statements, the table should have the following contents:

```sql
SELECT * FROM shop ORDER BY article;

+---------+--------+-------+
| article | dealer | price |
+---------+--------+-------+
|       1 | A      |  3.45 |
|       1 | B      |  3.99 |
|       2 | A      | 10.99 |
|       3 | B      |  1.45 |
|       3 | C      |  1.69 |
|       3 | D      |  1.25 |
|       4 | D      | 19.95 |
+---------+--------+-------+
```
