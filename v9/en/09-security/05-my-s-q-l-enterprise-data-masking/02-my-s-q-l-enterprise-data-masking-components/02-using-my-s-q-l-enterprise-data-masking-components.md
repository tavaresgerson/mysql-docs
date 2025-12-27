#### 8.5.2.2 Using MySQL Enterprise Data Masking Components

Before using MySQL Enterprise Data Masking, install it according to the instructions provided at Section 8.5.2.1, “MySQL Enterprise Data Masking Component Installation”.

To use MySQL Enterprise Data Masking in applications, invoke the functions that are appropriate for the operations you wish to perform. For detailed function descriptions, see Section 8.5.2.4, “MySQL Enterprise Data Masking Component Function Descriptions”. This section demonstrates how to use the functions to carry out some representative tasks. It first presents an overview of the available functions, followed by some examples of how the functions might be used in real-world context:

* Masking Data to Remove Identifying Characteristics
* Generating Random Data with Specific Characteristics
* Generating Random Data Using Dictionaries
* Using Masked Data for Customer Identification
* Creating Views that Display Masked Data

##### Masking Data to Remove Identifying Characteristics

MySQL provides general-purpose masking component functions that mask arbitrary strings, and special-purpose masking functions that mask specific types of values.

###### General-Purpose Masking Component Functions

`mask_inner()` and `mask_outer()` are general-purpose functions that mask parts of arbitrary strings based on position within the string. Both functions support an input string that is encoded in any character set:

* `mask_inner()` masks the interior of its string argument, leaving the ends unmasked. Other arguments specify the sizes of the unmasked ends.

  ```
  mysql> SELECT mask_inner('This is a string', 5, 1);
  +--------------------------------------+
  | mask_inner('This is a string', 5, 1) |
  +--------------------------------------+
  | This XXXXXXXXXXg                     |
  +--------------------------------------+
  mysql> SELECT mask_inner('This is a string', 1, 5);
  +--------------------------------------+
  | mask_inner('This is a string', 1, 5) |
  +--------------------------------------+
  | TXXXXXXXXXXtring                     |
  +--------------------------------------+
  mysql> SELECT mask_inner("かすみがうら市", 3, 1);
  +----------------------------------+
  | mask_inner("かすみがうら市", 3, 1) |
  +----------------------------------+
  | かすみXXX市                       |
  +----------------------------------+
  mysql> SELECT mask_inner("かすみがうら市", 1, 3);
  +----------------------------------+
  | mask_inner("かすみがうら市", 1, 3) |
  +----------------------------------+
  | かXXXうら市                       |
  +----------------------------------+
  ```

* `mask_outer()` does the reverse, masking the ends of its string argument, leaving the interior unmasked. Other arguments specify the sizes of the masked ends.

  ```
  mysql> SELECT mask_outer('This is a string', 5, 1);
  +--------------------------------------+
  | mask_outer('This is a string', 5, 1) |
  +--------------------------------------+
  | XXXXXis a strinX                     |
  +--------------------------------------+
  mysql> SELECT mask_outer('This is a string', 1, 5);
  +--------------------------------------+
  | mask_outer('This is a string', 1, 5) |
  +--------------------------------------+
  | Xhis is a sXXXXX                     |
  +--------------------------------------+
  ```

By default, `mask_inner()` and `mask_outer()` use `'X'` as the masking character, but permit an optional masking-character argument:

```
mysql> SELECT mask_inner('This is a string', 5, 1, '*');
+-------------------------------------------+
| mask_inner('This is a string', 5, 1, '*') |
+-------------------------------------------+
| This **********g                          |
+-------------------------------------------+
mysql> SELECT mask_inner("かすみがうら市", 2, 2, "#");
+---------------------------------------+
| mask_inner("かすみがうら市", 2, 2, "#") |
+---------------------------------------+
| かす###ら市                            |
+---------------------------------------+
```

###### Special-Purpose Masking Component Functions

Other masking functions expect a string argument representing a specific type of value and mask it to remove identifying characteristics.

Note

The examples here supply function arguments using the random value generation functions that return the appropriate type of value. For more information about generation functions, see Generating Random Data with Specific Characteristics.

**Payment card Primary Account Number masking.** Masking functions provide strict and relaxed masking of Primary Account numbers.

* `mask_pan()` masks all but the last four digits of the number:

  ```
  mysql> SELECT mask_pan(gen_rnd_pan());
  +-------------------------+
  | mask_pan(gen_rnd_pan()) |
  +-------------------------+
  | XXXXXXXXXXXX2461        |
  +-------------------------+
  ```

* `mask_pan_relaxed()` is similar but does not mask the first six digits that indicate the payment card issuer unmasked:

  ```
  mysql> SELECT mask_pan_relaxed(gen_rnd_pan());
  +---------------------------------+
  | mask_pan_relaxed(gen_rnd_pan()) |
  +---------------------------------+
  | 770630XXXXXX0807                |
  +---------------------------------+
  ```

**International Bank Account Number masking.** `mask_iban()` masks all but the first two letters (denoting the country) of the number:

```
mysql> SELECT mask_iban(gen_rnd_iban());
+---------------------------+
| mask_iban(gen_rnd_iban()) |
+---------------------------+
| ZZ** **** **** ****       |
+---------------------------+
```

**Universally Unique Identifier masking.** `mask_uuid()` masks all meaningful characters:

```
mysql> SELECT mask_uuid(gen_rnd_uuid());
+--------------------------------------+
| mask_uuid(gen_rnd_uuid())            |
+--------------------------------------+
| ********-****-****-****-************ |
+--------------------------------------+
```

**US Social Security Number masking.** `mask_ssn()` masks all but the last four digits of the number:

```
mysql> SELECT mask_ssn(gen_rnd_ssn());
+-------------------------+
| mask_ssn(gen_rnd_ssn()) |
+-------------------------+
| ***-**-1723             |
+-------------------------+
```

**Canada Social Insurance Number masking.** `mask_canada_sin()` masks meaningful digits of the number:

```
mysql> SELECT mask_canada_sin(gen_rnd_canada_sin());
+---------------------------------------+
| mask_canada_sin(gen_rnd_canada_sin()) |
+---------------------------------------+
| XXX-XXX-XXX                           |
+---------------------------------------+
```

**United Kingdom National Insurance Number masking.** `mask_uk_nin()` masks all but the first two digits of the number:

```
mysql> SELECT mask_uk_nin(gen_rnd_uk_nin());
+-------------------------------+
| mask_uk_nin(gen_rnd_uk_nin()) |
+-------------------------------+
| ZH*******                     |
+-------------------------------+
```

##### Generating Random Data with Specific Characteristics

Several component functions generate random values. These values can be used for testing, simulation, and so forth.

`gen_range()` returns a random integer selected from a given range:

```
mysql> SELECT gen_range(1, 10);
+------------------+
| gen_range(1, 10) |
+------------------+
|                6 |
+------------------+
```

`gen_rnd_canada_sin()` returns a random Canadian Social Insurance Number (SIN).

Because it cannot be guaranteed that the number generated has not been assigned, the result of `gen_rnd_canada_sin()` should never be displayed (except possibly in testing). For display in user-facing applications, always employ a masking function such as `mask_canada_sin()`, as shown here:

```
mysql> SELECT mask_canada_sin( gen_rnd_canada_sin() );
+-----------------------------------------+
| mask_canada_sin( gen_rnd_canada_sin() ) |
+-----------------------------------------+
| xxx-xxx-xxx                             |
+-----------------------------------------+
```

`gen_rnd_email()` returns a random email address with a specified number of digits for the name and surname parts in the specified domain, `mynet.com` in the following example:

```
mysql> SELECT gen_rnd_email(6, 8, 'mynet.com');
+----------------------------------+
| gen_rnd_email(6, 8, 'mynet.com') |
+----------------------------------+
| txdona.uamdqvum@mynet.com        |
+----------------------------------+
```

`gen_rnd_iban()` returns a number chosen from a range not used for legitimate numbers:

```
mysql> SELECT gen_rnd_iban('XO', 24);
+-------------------------------+
| gen_rnd_iban('XO', 24)        |
+-------------------------------+
| XO25 SL7A PGQR B9NN 6IVB RFE8 |
+-------------------------------+
```

`gen_rnd_pan()` returns a random payment card Primary Account Number (PAN).

Because it cannot be guaranteed that the number generated is not assigned to a legitimate payment account, the result of `gen_rnd_pan()` should never be displayed, other than for testing purposes. For display in applications, always employ a masking function such as `mask_pan()` or `mask_pan_relaxed()`. We show such use of the latter function with `gen_rnd_pan()` here:

```
mysql> SELECT mask_pan_relaxed( gen_rnd_pan() );
+-----------------------------------+
| mask_pan_relaxed( gen_rnd_pan() ) |
+-----------------------------------+
| 707064XXXXXX4850                  |
+-----------------------------------+
```

`gen_rnd_ssn()` returns a random US Social Security Number whose first part is chosen from a range not used for legitimate numbers:

```
mysql> SELECT gen_rnd_ssn();
+---------------+
| gen_rnd_ssn() |
+---------------+
| 912-45-1615   |
+---------------+
```

`gen_rnd_uk_nin()` returns a random UK National Insurance Number (NIN).

Because it cannot be guaranteed that the number generated has not been assigned, the result of `gen_rnd_uk_nin()` should never be displayed (except possibly in testing). For display in user-facing applications, always employ a masking function such as `mask_uk_nin()`, as shown here:

```
mysql> SELECT mask_uk_nin( gen_rnd_uk_nin() );
+---------------------------------+
| mask_uk_nin( gen_rnd_uk_nin() ) |
+---------------------------------+
| OE*******                       |
+---------------------------------+
```

`gen_rnd_us_phone()` returns a random US phone number in the 555 area code not used for legitimate numbers:

```
mysql> SELECT gen_rnd_us_phone();
+--------------------+
| gen_rnd_us_phone() |
+--------------------+
| 1-555-747-5627     |
+--------------------+
```

`gen_rnd_uuid()` returns a number chosen from a range not used for legitimate identifiers:

```
mysql> SELECT gen_rnd_uuid();
+--------------------------------------+
| gen_rnd_uuid()                       |
+--------------------------------------+
| 68946384-6880-3150-6889-928076732539 |
+--------------------------------------+
```

##### Generating Random Data Using Dictionaries

MySQL Enterprise Data Masking enables dictionaries to be used as sources of random values called *terms*. To use a dictionary, it must first be added to the `masking_dictionaries` system table and given a name. The dictionaries are read from the table and loaded to the cache during initialization of the components (on server startup). Terms then can then be added, removed, and selected from dictionaries and used as random values or as replacements for other values.

Note

Always edit dictionaries using dictionary administration functions rather than modifying the table directly. If you manipulate the table manually, the dictionary cache becomes inconsistent with the table.

A valid `masking_dictionaries` table has these characteristics:

* An administrator created the `masking_dictionaries` system table in the `mysql` schema as follows:

  ```
  CREATE TABLE IF NOT EXISTS
  masking_dictionaries(
      Dictionary VARCHAR(256) NOT NULL,
      Term VARCHAR(256) NOT NULL,
      UNIQUE INDEX dictionary_term_idx (Dictionary, Term),
      INDEX dictionary_idx (Dictionary)
  ) ENGINE = InnoDB DEFAULT CHARSET=utf8mb4;
  ```

* MASKING\_DICTIONARY\_ADMIN privilege is required to add and remove terms, or to remove an entire dictionary.

* The table may contain multiple dictionaries and their terms.

* Any user account can view the dictionaries. Given enough queries, all of the terms in dictionaries are retrievable. Avoid adding sensitive data to the dictionary table.

Suppose that a dictionary named `DE_cities` includes these city names in Germany:

```
Berlin
Munich
Bremen
```

Use `masking_dictionary_term_add()` to assign a dictionary name and one term:

```
mysql> SELECT masking_dictionary_term_add('DE_Cities', 'Berlin');
+----------------------------------------------------+
| masking_dictionary_term_add('DE_Cities', 'Berlin') |
+----------------------------------------------------+
|                                                  1 |
+----------------------------------------------------+
mysql> SELECT masking_dictionary_term_add('DE_Cities', 'Munich');
+----------------------------------------------------+
| masking_dictionary_term_add('DE_Cities', 'Munich') |
+----------------------------------------------------+
|                                                  1 |
+----------------------------------------------------+
mysql> SELECT masking_dictionary_term_add('DE_Cities', 'Bremen');
+----------------------------------------------------+
| masking_dictionary_term_add('DE_Cities', 'Bremen') |
+----------------------------------------------------+
|                                                  1 |
+----------------------------------------------------+
```

Also suppose that a dictionary named `US_Cities` contains these city names in the United States:

```
Houston
Phoenix
Detroit
```

```
mysql> SELECT masking_dictionary_term_add('US_Cities', 'Houston');
+-----------------------------------------------------+
| masking_dictionary_term_add('US_Cities', 'Houston') |
+-----------------------------------------------------+
|                                                   1 |
+-----------------------------------------------------+
mysql> SELECT masking_dictionary_term_add('US_Cities', 'Phoenix');
+-----------------------------------------------------+
| masking_dictionary_term_add('US_Cities', 'Phoenix') |
+-----------------------------------------------------+
|                                                   1 |
+-----------------------------------------------------+
mysql> SELECT masking_dictionary_term_add('US_Cities', 'Detroit');
+-----------------------------------------------------+
| masking_dictionary_term_add('US_Cities', 'Detroit') |
+-----------------------------------------------------+
|                                                   1 |
+-----------------------------------------------------+
```

To select a random term from a dictionary, use `gen_dictionary()`:

```
mysql> SELECT gen_dictionary('DE_Cities');
+-----------------------------+
| gen_dictionary('DE_Cities') |
+-----------------------------+
| Berlin                      |
+-----------------------------+
mysql> SELECT gen_dictionary('US_Cities');
+-----------------------------+
| gen_dictionary('US_Cities') |
+-----------------------------+
| Phoenix                     |
+-----------------------------+
```

To select a random term from multiple dictionaries, randomly select one of the dictionaries, then select a term from it:

```
mysql> SELECT gen_dictionary(ELT(gen_range(1,2), 'DE_Cities', 'US_Cities'));
+---------------------------------------------------------------+
| gen_dictionary(ELT(gen_range(1,2), 'DE_Cities', 'US_Cities')) |
+---------------------------------------------------------------+
| Detroit                                                       |
+---------------------------------------------------------------+
mysql> SELECT gen_dictionary(ELT(gen_range(1,2), 'DE_Cities', 'US_Cities'));
+---------------------------------------------------------------+
| gen_dictionary(ELT(gen_range(1,2), 'DE_Cities', 'US_Cities')) |
+---------------------------------------------------------------+
| Bremen                                                        |
+---------------------------------------------------------------+
```

The `gen_blocklist()` function enables a term from one dictionary to be replaced by a term from another dictionary, which effects masking by substitution. Its arguments are the term to replace, the dictionary in which the term appears, and the dictionary from which to choose a replacement. For example, to substitute a US city for a German city, or vice versa, use `gen_blocklist()` like this:

```
mysql> SELECT gen_blocklist('Munich', 'DE_Cities', 'US_Cities');
+---------------------------------------------------+
| gen_blocklist('Munich', 'DE_Cities', 'US_Cities') |
+---------------------------------------------------+
| Houston                                           |
+---------------------------------------------------+
mysql> SELECT gen_blocklist('El Paso', 'US_Cities', 'DE_Cities');
+----------------------------------------------------+
| gen_blocklist('El Paso', 'US_Cities', 'DE_Cities') |
+----------------------------------------------------+
| Bremen                                             |
+----------------------------------------------------+
```

If the term to replace is not in the first dictionary, `gen_blocklist()` returns it unchanged:

```
mysql> SELECT gen_blocklist('Moscow', 'DE_Cities', 'US_Cities');
+---------------------------------------------------+
| gen_blocklist('Moscow', 'DE_Cities', 'US_Cities') |
+---------------------------------------------------+
| Moscow                                            |
+---------------------------------------------------+
```

##### Using Masked Data for Customer Identification

At customer-service call centers, one common identity verification technique is to ask customers to provide their last four Social Security Number (SSN) digits. For example, a customer might say her name is Joanna Bond and that her last four SSN digits are `0007`.

Suppose that a `customer` table containing customer records has these columns:

* `id`: Customer ID number.
* `first_name`: Customer first name.
* `last_name`: Customer last name.
* `ssn`: Customer Social Security Number.

For example, the table might be defined as follows:

```
CREATE TABLE customer
(
  id         BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(40),
  last_name  VARCHAR(40),
  ssn        VARCHAR(11)
);
```

The application used by customer-service representatives to check the customer SSN might execute a query like this:

```
mysql> SELECT id, ssn
    -> FROM customer
    -> WHERE first_name = 'Joanna' AND last_name = 'Bond';
+-----+-------------+
| id  | ssn         |
+-----+-------------+
| 786 | 906-39-0007 |
+-----+-------------+
```

However, that exposes the SSN to the customer-service representative, who has no need to see anything but the last four digits. Instead, the application can use this query to display only the masked SSN:

```
mysql> SELECT id, mask_ssn(CONVERT(ssn USING binary)) AS masked_ssn
    -> FROM customer
    -> WHERE first_name = 'Joanna' AND last_name = 'Bond';
+-----+-------------+
| id  | masked_ssn  |
+-----+-------------+
| 786 | ***-**-0007 |
+-----+-------------+
```

Now the representative sees only what is necessary, and customer privacy is preserved.

Why was the `CONVERT()` function used for the argument to `mask_ssn()`? Because `mask_ssn()` requires an argument of length 11. Thus, even though `ssn` is defined as `VARCHAR(11)`, if the `ssn` column has a multibyte character set, it may appear to be longer than 11 bytes when passed to a loadable function, and returns `NULL` while logging the error. Converting the value to a binary string ensures that the function sees an argument of length 11.

A similar technique may be needed for other data masking functions when string arguments do not have a single-byte character set.

##### Creating Views that Display Masked Data

If masked data from a table is used for multiple queries, it may be convenient to define a view that produces masked data. That way, applications can select from the view without performing masking in individual queries.

For example, a masking view on the `customer` table from the previous section can be defined like this:

```
CREATE VIEW masked_customer AS
SELECT id, first_name, last_name,
mask_ssn(CONVERT(ssn USING binary)) AS masked_ssn
FROM customer;
```

Then the query to look up a customer becomes simpler but still returns masked data:

```
mysql> SELECT id, masked_ssn
mysql> FROM masked_customer
mysql> WHERE first_name = 'Joanna' AND last_name = 'Bond';
+-----+-------------+
| id  | masked_ssn  |
+-----+-------------+
| 786 | ***-**-0007 |
+-----+-------------+
```
