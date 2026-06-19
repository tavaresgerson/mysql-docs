## 6.5 MySQL Enterprise Data Masking and De-Identification

Note

MySQL Enterprise Data Masking and De-Identification is an extension included in MySQL Enterprise Edition, a commercial product. To learn more about commercial products, <https://www.mysql.com/products/>.

As of MySQL 5.7.24, MySQL Enterprise Edition provides data masking and de-identification capabilities:

* Transformation of existing data to mask it and remove identifying characteristics, such as changing all digits of a credit card number but the last four to `'X'` characters.

* Generation of random data, such as email addresses and payment card numbers.

The way that applications use these capabilities depends on the purpose for which the data is used and who accesses it:

* Applications that use sensitive data may protect it by performing data masking and permitting use of partially masked data for client identification. Example: A call center may ask for clients to provide their last four Social Security number digits.

* Applications that require properly formatted data, but not necessarily the original data, can synthesize sample data. Example: An application developer who is testing data validators but has no access to original data may synthesize random data with the same format.

Example 1:

Medical research facilities can hold patient data that comprises a mix of personal and medical data. This may include genetic sequences (long strings), test results stored in JSON format, and other data types. Although the data may be used mostly by automated analysis software, access to genome data or test results of particular patients is still possible. In such cases, data masking should be used to render this information not personally identifiable.

Example 2:

A credit card processor company provides a set of services using sensitive data, such as:

* Processing a large number of financial transactions per second.
* Storing a large amount of transaction-related data.
* Protecting transaction-related data with strict requirements for personal data.

* Handling client complaints about transactions using reversible or partially masked data.

A typical transaction may include many types of sensitive information, including:

* Credit card number.
* Transaction type and amount.
* Merchant type.
* Transaction cryptogram (to confirm transaction legitimacy).
* Geolocation of GPS-equipped terminal (for fraud detection).

Those types of information may then be joined within a bank or other card-issuing financial institution with client personal data, such as:

* Full client name (either person or company).
* Address.
* Date of birth.
* Social Security number.
* Email address.
* Phone number.

Various employee roles within both the card processing company and the financial institution require access to that data. Some of these roles may require access only to masked data. Other roles may require access to the original data on a case-to-case basis, which is recorded in audit logs.

Masking and de-identification are core to regulatory compliance, so MySQL Enterprise Data Masking and De-Identification can help application developers satisfy privacy requirements:

* PCI – DSS: Payment Card Data.
* HIPAA: Privacy of Health Data, Health Information Technology for Economic and Clinical Health Act (HITECH Act).

* EU General Data Protection Directive (GDPR): Protection of Personal Data.

* Data Protection Act (UK): Protection of Personal Data.
* Sarbanes Oxley, GLBA, The USA Patriot Act, Identity Theft and Assumption Deterrence Act of 1998.

* FERPA – Student Data, NASD, CA SB1386 and AB 1950, State Data Protection Laws, Basel II.

The following sections describe the elements of MySQL Enterprise Data Masking and De-Identification, discuss how to install and use it, and provide reference information for its elements.


### 6.5.1 MySQL Enterprise Data Masking and De-Identification Elements

MySQL Enterprise Data Masking and De-Identification is based on a plugin library that implements these elements:

* A server-side plugin named `data_masking`.
* A set of loadable functions provides an SQL-level API for performing masking and de-identification operations. Some of these functions require the `SUPER` privilege.


### 6.5.2 Installing or Uninstalling MySQL Enterprise Data Masking and De-Identification

This section describes how to install or uninstall MySQL Enterprise Data Masking and De-Identification, which is implemented as a plugin library file containing a plugin and several loadable functions. For general information about installing or uninstalling plugins and loadable functions, see Section 5.5.1, “Installing and Uninstalling Plugins”, and Section 5.6.1, “Installing and Uninstalling Loadable Functions”.

To be usable by the server, the plugin library file must be located in the MySQL plugin directory (the directory named by the `plugin_dir` system variable). If necessary, configure the plugin directory location by setting the value of `plugin_dir` at server startup.

The plugin library file base name is `data_masking`. The file name suffix differs per platform (for example, `.so` for Unix and Unix-like systems, `.dll` for Windows).

To install the MySQL Enterprise Data Masking and De-Identification plugin and functions, use the `INSTALL PLUGIN` and `CREATE FUNCTION` statements, adjusting the `.so` suffix for your platform as necessary:

```sql
INSTALL PLUGIN data_masking SONAME 'data_masking.so';
CREATE FUNCTION gen_blacklist RETURNS STRING
  SONAME 'data_masking.so';
CREATE FUNCTION gen_dictionary RETURNS STRING
  SONAME 'data_masking.so';
CREATE FUNCTION gen_dictionary_drop RETURNS STRING
  SONAME 'data_masking.so';
CREATE FUNCTION gen_dictionary_load RETURNS STRING
  SONAME 'data_masking.so';
CREATE FUNCTION gen_range RETURNS INTEGER
  SONAME 'data_masking.so';
CREATE FUNCTION gen_rnd_email RETURNS STRING
  SONAME 'data_masking.so';
CREATE FUNCTION gen_rnd_pan RETURNS STRING
  SONAME 'data_masking.so';
CREATE FUNCTION gen_rnd_ssn RETURNS STRING
  SONAME 'data_masking.so';
CREATE FUNCTION gen_rnd_us_phone RETURNS STRING
  SONAME 'data_masking.so';
CREATE FUNCTION mask_inner RETURNS STRING
  SONAME 'data_masking.so';
CREATE FUNCTION mask_outer RETURNS STRING
  SONAME 'data_masking.so';
CREATE FUNCTION mask_pan RETURNS STRING
  SONAME 'data_masking.so';
CREATE FUNCTION mask_pan_relaxed RETURNS STRING
  SONAME 'data_masking.so';
CREATE FUNCTION mask_ssn RETURNS STRING
  SONAME 'data_masking.so';
```

If the plugin and functions are used on a replication source server, install them on all replica servers as well to avoid replication issues.

Once installed as just described, the plugin and functions remain installed until uninstalled. To remove them, use the `UNINSTALL PLUGIN` and `DROP FUNCTION` statements:

```sql
UNINSTALL PLUGIN data_masking;
DROP FUNCTION gen_blacklist;
DROP FUNCTION gen_dictionary;
DROP FUNCTION gen_dictionary_drop;
DROP FUNCTION gen_dictionary_load;
DROP FUNCTION gen_range;
DROP FUNCTION gen_rnd_email;
DROP FUNCTION gen_rnd_pan;
DROP FUNCTION gen_rnd_ssn;
DROP FUNCTION gen_rnd_us_phone;
DROP FUNCTION mask_inner;
DROP FUNCTION mask_outer;
DROP FUNCTION mask_pan;
DROP FUNCTION mask_pan_relaxed;
DROP FUNCTION mask_ssn;
```


### 6.5.3 Using MySQL Enterprise Data Masking and De-Identification

Before using MySQL Enterprise Data Masking and De-Identification, install it according to the instructions provided at Section 6.5.2, “Installing or Uninstalling MySQL Enterprise Data Masking and De-Identification”.

To use MySQL Enterprise Data Masking and De-Identification in applications, invoke the functions that are appropriate for the operations you wish to perform. For detailed function descriptions, see Section 6.5.5, “MySQL Enterprise Data Masking and De-Identification Function Descriptions”. This section demonstrates how to use the functions to carry out some representative tasks. It first presents an overview of the available functions, followed by some examples of how the functions might be used in real-world context:

* Masking Data to Remove Identifying Characteristics
* Generating Random Data with Specific Characteristics
* Generating Random Data Using Dictionaries
* Using Masked Data for Customer Identification
* Creating Views that Display Masked Data

#### Masking Data to Remove Identifying Characteristics

MySQL provides general-purpose masking functions that mask arbitrary strings, and special-purpose masking functions that mask specific types of values.

##### General-Purpose Masking Functions

`mask_inner()` and `mask_outer()` are general-purpose functions that mask parts of arbitrary strings based on position within the string:

* `mask_inner()` masks the interior of its string argument, leaving the ends unmasked. Other arguments specify the sizes of the unmasked ends.

  ```sql
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
  ```

* `mask_outer()` does the reverse, masking the ends of its string argument, leaving the interior unmasked. Other arguments specify the sizes of the masked ends.

  ```sql
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

```sql
mysql> SELECT mask_inner('This is a string', 5, 1, '*');
+-------------------------------------------+
| mask_inner('This is a string', 5, 1, '*') |
+-------------------------------------------+
| This **********g                          |
+-------------------------------------------+
mysql> SELECT mask_outer('This is a string', 5, 1, '#');
+-------------------------------------------+
| mask_outer('This is a string', 5, 1, '#') |
+-------------------------------------------+
| #####is a strin#                          |
+-------------------------------------------+
```

##### Special-Purpose Masking Functions

Other masking functions expect a string argument representing a specific type of value and mask it to remove identifying characteristics.

Note

The examples here supply function arguments using the random value generation functions that return the appropriate type of value. For more information about generation functions, see Generating Random Data with Specific Characteristics.

**Payment card Primary Account Number masking.** Masking functions provide strict and relaxed masking of Primary Account Numbers.

* `mask_pan()` masks all but the last four digits of the number:

  ```sql
  mysql> SELECT mask_pan(gen_rnd_pan());
  +-------------------------+
  | mask_pan(gen_rnd_pan()) |
  +-------------------------+
  | XXXXXXXXXXXX2461        |
  +-------------------------+
  ```

* `mask_pan_relaxed()` is similar but does not mask the first six digits that indicate the payment card issuer unmasked:

  ```sql
  mysql> SELECT mask_pan_relaxed(gen_rnd_pan());
  +---------------------------------+
  | mask_pan_relaxed(gen_rnd_pan()) |
  +---------------------------------+
  | 770630XXXXXX0807                |
  +---------------------------------+
  ```

**US Social Security number masking.** `mask_ssn()` masks all but the last four digits of the number:

```sql
mysql> SELECT mask_ssn(gen_rnd_ssn());
+-------------------------+
| mask_ssn(gen_rnd_ssn()) |
+-------------------------+
| XXX-XX-1723             |
+-------------------------+
```

#### Generating Random Data with Specific Characteristics

Several functions generate random values. These values can be used for testing, simulation, and so forth.

`gen_range()` returns a random integer selected from a given range:

```sql
mysql> SELECT gen_range(1, 10);
+------------------+
| gen_range(1, 10) |
+------------------+
|                6 |
+------------------+
```

`gen_rnd_email()` returns a random email address in the `example.com` domain:

```sql
mysql> SELECT gen_rnd_email();
+---------------------------+
| gen_rnd_email()           |
+---------------------------+
| ayxnq.xmkpvvy@example.com |
+---------------------------+
```

`gen_rnd_pan()` returns a random payment card Primary Account Number (PAN).

Because it cannot be guaranteed that the number generated is not assigned to a legitimate payment account, the result of `gen_rnd_pan()` should never be displayed, other than for testing purposes. For display in applications, always employ a masking function such as `mask_pan()` or `mask_pan_relaxed()`. We show such use of the latter function with `gen_rnd_pan()` here:

```sql
mysql> SELECT mask_pan_relaxed( gen_rnd_pan() );
+-----------------------------------+
| mask_pan_relaxed( gen_rnd_pan() ) |
+-----------------------------------+
| 707064XXXXXX4850                  |
+-----------------------------------+
```

`gen_rnd_ssn()` returns a random US Social Security number whose first and second parts are each chosen from a range not used for legitimate numbers:

```sql
mysql> SELECT gen_rnd_ssn();
+---------------+
| gen_rnd_ssn() |
+---------------+
| 912-45-1615   |
+---------------+
```

`gen_rnd_us_phone()` returns a random US phone number in the 555 area code not used for legitimate numbers:

```sql
mysql> SELECT gen_rnd_us_phone();
+--------------------+
| gen_rnd_us_phone() |
+--------------------+
| 1-555-747-5627     |
+--------------------+
```

#### Generating Random Data Using Dictionaries

MySQL Enterprise Data Masking and De-Identification enables dictionaries to be used as sources of random values. To use a dictionary, it must first be loaded from a file and given a name. Each loaded dictionary becomes part of the dictionary registry. Items then can be selected from registered dictionaries and used as random values or as replacements for other values.

A valid dictionary file has these characteristics:

* The file contents are plain text, one term per line.
* Empty lines are ignored.
* The file must contain at least one term.

Suppose that a file named `de_cities.txt` contains these city names in Germany:

```sql
Berlin
Munich
Bremen
```

Also suppose that a file named `us_cities.txt` contains these city names in the United States:

```sql
Chicago
Houston
Phoenix
El Paso
Detroit
```

Assume that the `secure_file_priv` system variable is set to `/usr/local/mysql/mysql-files`. In that case, copy the dictionary files to that directory so that the MySQL server can access them. Then use `gen_dictionary_load()` to load the dictionaries into the dictionary registry and assign them names:

```sql
mysql> SELECT gen_dictionary_load('/usr/local/mysql/mysql-files/de_cities.txt', 'DE_Cities');
+--------------------------------------------------------------------------------+
| gen_dictionary_load('/usr/local/mysql/mysql-files/de_cities.txt', 'DE_Cities') |
+--------------------------------------------------------------------------------+
| Dictionary load success                                                        |
+--------------------------------------------------------------------------------+
mysql> SELECT gen_dictionary_load('/usr/local/mysql/mysql-files/us_cities.txt', 'US_Cities');
+--------------------------------------------------------------------------------+
| gen_dictionary_load('/usr/local/mysql/mysql-files/us_cities.txt', 'US_Cities') |
+--------------------------------------------------------------------------------+
| Dictionary load success                                                        |
+--------------------------------------------------------------------------------+
```

To select a random term from a dictionary, use `gen_dictionary()`:

```sql
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

```sql
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

The `gen_blacklist()` function enables a term from one dictionary to be replaced by a term from another dictionary, which effects masking by substitution. Its arguments are the term to replace, the dictionary in which the term appears, and the dictionary from which to choose a replacement. For example, to substitute a US city for a German city, or vice versa, use `gen_blacklist()` like this:

```sql
mysql> SELECT gen_blacklist('Munich', 'DE_Cities', 'US_Cities');
+---------------------------------------------------+
| gen_blacklist('Munich', 'DE_Cities', 'US_Cities') |
+---------------------------------------------------+
| Houston                                           |
+---------------------------------------------------+
mysql> SELECT gen_blacklist('El Paso', 'US_Cities', 'DE_Cities');
+----------------------------------------------------+
| gen_blacklist('El Paso', 'US_Cities', 'DE_Cities') |
+----------------------------------------------------+
| Bremen                                             |
+----------------------------------------------------+
```

If the term to replace is not in the first dictionary, `gen_blacklist()` returns it unchanged:

```sql
mysql> SELECT gen_blacklist('Moscow', 'DE_Cities', 'US_Cities');
+---------------------------------------------------+
| gen_blacklist('Moscow', 'DE_Cities', 'US_Cities') |
+---------------------------------------------------+
| Moscow                                            |
+---------------------------------------------------+
```

#### Using Masked Data for Customer Identification

At customer-service call centers, one common identity verification technique is to ask customers to provide their last four Social Security number (SSN) digits. For example, a customer might say her name is Joanna Bond and that her last four SSN digits are `0007`.

Suppose that a `customer` table containing customer records has these columns:

* `id`: Customer ID number.
* `first_name`: Customer first name.
* `last_name`: Customer last name.
* `ssn`: Customer Social Security number.

For example, the table might be defined as follows:

```sql
CREATE TABLE customer
(
  id         BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(40),
  last_name  VARCHAR(40),
  ssn        VARCHAR(11)
);
```

The application used by customer-service representatives to check the customer SSN might execute a query like this:

```sql
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

```sql
mysql> SELECT id, mask_ssn(CONVERT(ssn USING binary)) AS masked_ssn
    -> FROM customer
    -> WHERE first_name = 'Joanna' AND last_name = 'Bond';
+-----+-------------+
| id  | masked_ssn  |
+-----+-------------+
| 786 | XXX-XX-0007 |
+-----+-------------+
```

Now the representative sees only what is necessary, and customer privacy is preserved.

Why was the `CONVERT()` function used for the argument to `mask_ssn()`? Because `mask_ssn()` requires an argument of length 11. Thus, even though `ssn` is defined as `VARCHAR(11)`, if the `ssn` column has a multibyte character set, it may appear to be longer than 11 bytes when passed to a loadable function, and an error occurs. Converting the value to a binary string ensures that the function sees an argument of length 11.

A similar technique may be needed for other data masking functions when string arguments do not have a single-byte character set.

#### Creating Views that Display Masked Data

If masked data from a table is used for multiple queries, it may be convenient to define a view that produces masked data. That way, applications can select from the view without performing masking in individual queries.

For example, a masking view on the `customer` table from the previous section can be defined like this:

```sql
CREATE VIEW masked_customer AS
SELECT id, first_name, last_name,
mask_ssn(CONVERT(ssn USING binary)) AS masked_ssn
FROM customer;
```

Then the query to look up a customer becomes simpler but still returns masked data:

```sql
mysql> SELECT id, masked_ssn
mysql> FROM masked_customer
mysql> WHERE first_name = 'Joanna' AND last_name = 'Bond';
+-----+-------------+
| id  | masked_ssn  |
+-----+-------------+
| 786 | XXX-XX-0007 |
+-----+-------------+
```


### 6.5.4 MySQL Enterprise Data Masking and De-Identification Function Reference

**Table 6.35 MySQL Enterprise Data Masking and De-Identification Functions**

<table frame="box" rules="all" summary="A reference that lists MySQL Enterprise Data Masking and De-Identification functions."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Name*</th> <th>Description</th> </tr></thead><tbody><tr><td><code>gen_blacklist()</code></td> <td> Perform dictionary term replacement </td> </tr><tr><td><code>gen_dictionary_drop()</code></td> <td> Remove dictionary from registry </td> </tr><tr><td><code>gen_dictionary_load()</code></td> <td> Load dictionary into registry </td> </tr><tr><td><code>gen_dictionary()</code></td> <td> Return random term from dictionary </td> </tr><tr><td><code>gen_range()</code></td> <td> Generate random number within range </td> </tr><tr><td><code>gen_rnd_email()</code></td> <td> Generate random email address </td> </tr><tr><td><code>gen_rnd_pan()</code></td> <td> Generate random payment card Primary Account Number </td> </tr><tr><td><code>gen_rnd_ssn()</code></td> <td> Generate random US Social Security Number </td> </tr><tr><td><code>gen_rnd_us_phone()</code></td> <td> Generate random US phone number </td> </tr><tr><td><code>mask_inner()</code></td> <td> Mask interior part of string </td> </tr><tr><td><code>mask_outer()</code></td> <td> Mask left and right parts of string </td> </tr><tr><td><code>mask_pan()</code></td> <td> Mask payment card Primary Account Number part of string </td> </tr><tr><td><code>mask_pan_relaxed()</code></td> <td> Mask payment card Primary Account Number part of string </td> </tr><tr><td><code>mask_ssn()</code></td> <td> Mask US Social Security Number </td> </tr></tbody></table>


### 6.5.5 MySQL Enterprise Data Masking and De-Identification Function Descriptions

The MySQL Enterprise Data Masking and De-Identification plugin library includes several functions, which may be grouped into these categories:

* Data Masking Functions
* Random Data Generation Functions
* Random Data Dictionary-Based Functions

These functions treat string arguments as binary strings (which means they do not distinguish lettercase), and string return values are binary strings. If a string return value should be in a different character set, convert it. The following example shows how to convert the result of `gen_rnd_email()` to the `utf8mb4` character set:

```sql
SET @email = CONVERT(gen_rnd_email() USING utf8mb4);
```

It may also be necessary to convert string arguments, as illustrated in Using Masked Data for Customer Identification.

If a MySQL Enterprise Data Masking and De-Identification function is invoked from within the **mysql** client, binary string results display using hexadecimal notation, depending on the value of the `--binary-as-hex`. For more information about that option, see Section 4.5.1, “mysql — The MySQL Command-Line Client”.

#### Data Masking Functions

Each function in this section performs a masking operation on its string argument and returns the masked result.

* `mask_inner(str, margin1, margin2 [, mask_char])`

  Masks the interior part of a string, leaving the ends untouched, and returns the result. An optional masking character can be specified.

  Arguments:

  + *`str`*: The string to mask.
  + *`margin1`*: A nonnegative integer that specifies the number of characters on the left end of the string to remain unmasked. If the value is 0, no left end characters remain unmasked.

  + *`margin2`*: A nonnegative integer that specifies the number of characters on the right end of the string to remain unmasked. If the value is 0, no right end characters remain unmasked.

  + *`mask_char`*: (Optional) The single character to use for masking. The default is `'X'` if *`mask_char`* is not given.

    The masking character must be a single-byte character. Attempts to use a multibyte character produce an error.

  Return value:

  The masked string, or `NULL` if either margin is negative.

  If the sum of the margin values is larger than the argument length, no masking occurs and the argument is returned unchanged.

  Example:

  ```sql
  mysql> SELECT mask_inner('abcdef', 1, 2), mask_inner('abcdef',0, 5);
  +----------------------------+---------------------------+
  | mask_inner('abcdef', 1, 2) | mask_inner('abcdef',0, 5) |
  +----------------------------+---------------------------+
  | aXXXef                     | Xbcdef                    |
  +----------------------------+---------------------------+
  mysql> SELECT mask_inner('abcdef', 1, 2, '*'), mask_inner('abcdef',0, 5, '#');
  +---------------------------------+--------------------------------+
  | mask_inner('abcdef', 1, 2, '*') | mask_inner('abcdef',0, 5, '#') |
  +---------------------------------+--------------------------------+
  | a***ef                          | #bcdef                         |
  +---------------------------------+--------------------------------+
  ```

* `mask_outer(str, margin1, margin2 [, mask_char])`

  Masks the left and right ends of a string, leaving the interior unmasked, and returns the result. An optional masking character can be specified.

  Arguments:

  + *`str`*: The string to mask.
  + *`margin1`*: A nonnegative integer that specifies the number of characters on the left end of the string to mask. If the value is 0, no left end characters are masked.

  + *`margin2`*: A nonnegative integer that specifies the number of characters on the right end of the string to mask. If the value is 0, no right end characters are masked.

  + *`mask_char`*: (Optional) The single character to use for masking. The default is `'X'` if *`mask_char`* is not given.

    The masking character must be a single-byte character. Attempts to use a multibyte character produce an error.

  Return value:

  The masked string, or `NULL` if either margin is negative.

  If the sum of the margin values is larger than the argument length, the entire argument is masked.

  Example:

  ```sql
  mysql> SELECT mask_outer('abcdef', 1, 2), mask_outer('abcdef',0, 5);
  +----------------------------+---------------------------+
  | mask_outer('abcdef', 1, 2) | mask_outer('abcdef',0, 5) |
  +----------------------------+---------------------------+
  | XbcdXX                     | aXXXXX                    |
  +----------------------------+---------------------------+
  mysql> SELECT mask_outer('abcdef', 1, 2, '*'), mask_outer('abcdef',0, 5, '#');
  +---------------------------------+--------------------------------+
  | mask_outer('abcdef', 1, 2, '*') | mask_outer('abcdef',0, 5, '#') |
  +---------------------------------+--------------------------------+
  | *bcd**                          | a#####                         |
  +---------------------------------+--------------------------------+
  ```

* `mask_pan(str)`

  Masks a payment card Primary Account Number and returns the number with all but the last four digits replaced by `'X'` characters.

  Arguments:

  + *`str`*: The string to mask. The string must be a suitable length for the Primary Account Number, but is not otherwise checked.

  Return value:

  The masked payment number as a string. If the argument is shorter than required, it is returned unchanged.

  Example:

  ```sql
  mysql> SELECT mask_pan(gen_rnd_pan());
  +-------------------------+
  | mask_pan(gen_rnd_pan()) |
  +-------------------------+
  | XXXXXXXXXXXX9102        |
  +-------------------------+
  mysql> SELECT mask_pan(gen_rnd_pan(19));
  +---------------------------+
  | mask_pan(gen_rnd_pan(19)) |
  +---------------------------+
  | XXXXXXXXXXXXXXX8268       |
  +---------------------------+
  mysql> SELECT mask_pan('a*Z');
  +-----------------+
  | mask_pan('a*Z') |
  +-----------------+
  | a*Z             |
  +-----------------+
  ```

* `mask_pan_relaxed(str)`

  Masks a payment card Primary Account Number and returns the number with all but the first six and last four digits replaced by `'X'` characters. The first six digits indicate the payment card issuer.

  Arguments:

  + *`str`*: The string to mask. The string must be a suitable length for the Primary Account Number, but is not otherwise checked.

  Return value:

  The masked payment number as a string. If the argument is shorter than required, it is returned unchanged.

  Example:

  ```sql
  mysql> SELECT mask_pan_relaxed(gen_rnd_pan());
  +---------------------------------+
  | mask_pan_relaxed(gen_rnd_pan()) |
  +---------------------------------+
  | 551279XXXXXX3108                |
  +---------------------------------+
  mysql> SELECT mask_pan_relaxed(gen_rnd_pan(19));
  +-----------------------------------+
  | mask_pan_relaxed(gen_rnd_pan(19)) |
  +-----------------------------------+
  | 462634XXXXXXXXX6739               |
  +-----------------------------------+
  mysql> SELECT mask_pan_relaxed('a*Z');
  +-------------------------+
  | mask_pan_relaxed('a*Z') |
  +-------------------------+
  | a*Z                     |
  +-------------------------+
  ```

* `mask_ssn(str)`

  Masks a US Social Security number and returns the number with all but the last four digits replaced by `'X'` characters.

  Arguments:

  + *`str`*: The string to mask. The string must be 11 characters long, but is not otherwise checked.

  Return value:

  The masked Social Security number as a string, or `NULL` if the argument is not the correct length.

  Example:

  ```sql
  mysql> SELECT mask_ssn('909-63-6922'), mask_ssn('abcdefghijk');
  +-------------------------+-------------------------+
  | mask_ssn('909-63-6922') | mask_ssn('abcdefghijk') |
  +-------------------------+-------------------------+
  | XXX-XX-6922             | XXX-XX-hijk             |
  +-------------------------+-------------------------+
  mysql> SELECT mask_ssn('909');
  +-----------------+
  | mask_ssn('909') |
  +-----------------+
  | NULL            |
  +-----------------+
  ```

#### Random Data Generation Functions

The functions in this section generate random values for different types of data. When possible, generated values have characteristics reserved for demonstration or test values, to avoid having them mistaken for legitimate data. For example, `gen_rnd_us_phone()` returns a US phone number that uses the 555 area code, which is not assigned to phone numbers in actual use. Individual function descriptions describe any exceptions to this principle.

* `gen_range(lower, upper)`

  Generates a random number chosen from a specified range.

  Arguments:

  + *`lower`*: An integer that specifies the lower boundary of the range.

  + *`upper`*: An integer that specifies the upper boundary of the range, which must not be less than the lower boundary.

  Return value:

  A random integer in the range from *`lower`* to *`upper`*, inclusive, or `NULL` if the *`upper`* argument is less than *`lower`*.

  Example:

  ```sql
  mysql> SELECT gen_range(100, 200), gen_range(-1000, -800);
  +---------------------+------------------------+
  | gen_range(100, 200) | gen_range(-1000, -800) |
  +---------------------+------------------------+
  |                 177 |                   -917 |
  +---------------------+------------------------+
  mysql> SELECT gen_range(1, 0);
  +-----------------+
  | gen_range(1, 0) |
  +-----------------+
  |            NULL |
  +-----------------+
  ```

* `gen_rnd_email()`

  Generates a random email address in the `example.com` domain.

  Arguments:

  None.

  Return value:

  A random email address as a string.

  Example:

  ```sql
  mysql> SELECT gen_rnd_email();
  +---------------------------+
  | gen_rnd_email()           |
  +---------------------------+
  | ijocv.mwvhhuf@example.com |
  +---------------------------+
  ```

* `gen_rnd_pan([size])`

  Generates a random payment card Primary Account Number. The number passes the Luhn check (an algorithm that performs a checksum verification against a check digit).

  Warning

  Values returned from `gen_rnd_pan()` should be used only for test purposes, and are not suitable for publication. There is no way to guarantee that a given return value is not assigned to a legitimate payment account. Should it be necessary to publish a `gen_rnd_pan()` result, consider masking it with `mask_pan()` or `mask_pan_relaxed()`.

  Arguments:

  + *`size`*: (Optional) An integer that specifies the size of the result. The default is 16 if *`size`* is not given. If given, *`size`* must be an integer in the range from 12 to 19.

  Return value:

  A random payment number as a string, or `NULL` if a *`size`* argument outside the permitted range is given.

  Example:

  ```sql
  mysql> SELECT mask_pan(gen_rnd_pan());
  +-------------------------+
  | mask_pan(gen_rnd_pan()) |
  +-------------------------+
  | XXXXXXXXXXXX5805        |
  +-------------------------+
  mysql> SELECT mask_pan(gen_rnd_pan(19));
  +---------------------------+
  | mask_pan(gen_rnd_pan(19)) |
  +---------------------------+
  | XXXXXXXXXXXXXXX5067       |
  +---------------------------+
  mysql> SELECT mask_pan_relaxed(gen_rnd_pan());
  +---------------------------------+
  | mask_pan_relaxed(gen_rnd_pan()) |
  +---------------------------------+
  | 398403XXXXXX9547                |
  +---------------------------------+
  mysql> SELECT mask_pan_relaxed(gen_rnd_pan(19));
  +-----------------------------------+
  | mask_pan_relaxed(gen_rnd_pan(19)) |
  +-----------------------------------+
  | 578416XXXXXXXXX6509               |
  +-----------------------------------+
  mysql> SELECT gen_rnd_pan(11), gen_rnd_pan(20);
  +-----------------+-----------------+
  | gen_rnd_pan(11) | gen_rnd_pan(20) |
  +-----------------+-----------------+
  | NULL            | NULL            |
  +-----------------+-----------------+
  ```

* `gen_rnd_ssn()`

  Generates a random US Social Security number in `AAA-BB-CCCC` format. The *`AAA`* part is greater than 900 and the *`BB`* part is less than 70; these values are outside the ranges used for legitimate Social Security numbers.

  Arguments:

  None.

  Return value:

  A random Social Security number as a string.

  Example:

  ```sql
  mysql> SELECT gen_rnd_ssn();
  +---------------+
  | gen_rnd_ssn() |
  +---------------+
  | 951-26-0058   |
  +---------------+
  ```

* `gen_rnd_us_phone()`

  Generates a random US phone number in `1-555-AAA-BBBB` format. The 555 area code is not used for legitimate phone numbers.

  Arguments:

  None.

  Return value:

  A random US phone number as a string.

  Example:

  ```sql
  mysql> SELECT gen_rnd_us_phone();
  +--------------------+
  | gen_rnd_us_phone() |
  +--------------------+
  | 1-555-682-5423     |
  +--------------------+
  ```

#### Random Data Dictionary-Based Functions

The functions in this section manipulate dictionaries of terms and perform generation and masking operations based on them. Some of these functions require the `SUPER` privilege.

When a dictionary is loaded, it becomes part of the dictionary registry and is assigned a name to be used by other dictionary functions. Dictionaries are loaded from plain text files containing one term per line. Empty lines are ignored. To be valid, a dictionary file must contain at least one nonempty line.

* `gen_blacklist(str, dictionary_name, replacement_dictionary_name)`

  Replaces a term present in one dictionary with a term from a second dictionary and returns the replacement term. This masks the original term by substitution.

  Arguments:

  + *`str`*: A string that indicates the term to replace.

  + *`dictionary_name`*: A string that names the dictionary containing the term to replace.

  + *`replacement_dictionary_name`*: A string that names the dictionary from which to choose the replacement term.

  Return value:

  A string randomly chosen from *`replacement_dictionary_name`* as a replacement for *`str`*, or *`str`* if it does not appear in *`dictionary_name`*, or `NULL` if either dictionary name is not in the dictionary registry.

  If the term to replace appears in both dictionaries, it is possible for the return value to be the same term.

  Example:

  ```sql
  mysql> SELECT gen_blacklist('Berlin', 'DE_Cities', 'US_Cities');
  +---------------------------------------------------+
  | gen_blacklist('Berlin', 'DE_Cities', 'US_Cities') |
  +---------------------------------------------------+
  | Phoenix                                           |
  +---------------------------------------------------+
  ```

* `gen_dictionary(dictionary_name)`

  Returns a random term from a dictionary.

  Arguments:

  + *`dictionary_name`*: A string that names the dictionary from which to choose the term.

  Return value:

  A random term from the dictionary as a string, or `NULL` if the dictionary name is not in the dictionary registry.

  Example:

  ```sql
  mysql> SELECT gen_dictionary('mydict');
  +--------------------------+
  | gen_dictionary('mydict') |
  +--------------------------+
  | My term                  |
  +--------------------------+
  mysql> SELECT gen_dictionary('no-such-dict');
  +--------------------------------+
  | gen_dictionary('no-such-dict') |
  +--------------------------------+
  | NULL                           |
  +--------------------------------+
  ```

* `gen_dictionary_drop(dictionary_name)`

  Removes a dictionary from the dictionary registry.

  This function requires the `SUPER` privilege.

  Arguments:

  + *`dictionary_name`*: A string that names the dictionary to remove from the dictionary registry.

  Return value:

  A string that indicates whether the drop operation succeeded. `Dictionary removed` indicates success. `Dictionary removal error` indicates failure.

  Example:

  ```sql
  mysql> SELECT gen_dictionary_drop('mydict');
  +-------------------------------+
  | gen_dictionary_drop('mydict') |
  +-------------------------------+
  | Dictionary removed            |
  +-------------------------------+
  mysql> SELECT gen_dictionary_drop('no-such-dict');
  +-------------------------------------+
  | gen_dictionary_drop('no-such-dict') |
  +-------------------------------------+
  | Dictionary removal error            |
  +-------------------------------------+
  ```

* `gen_dictionary_load(dictionary_path, dictionary_name)`

  Loads a file into the dictionary registry and assigns the dictionary a name to be used with other functions that require a dictionary name argument.

  This function requires the `SUPER` privilege.

  Important

  Dictionaries are not persistent. Any dictionary used by applications must be loaded for each server startup.

  Once loaded into the registry, a dictionary is used as is, even if the underlying dictionary file changes. To reload a dictionary, first drop it with `gen_dictionary_drop()`, then load it again with `gen_dictionary_load()`.

  Arguments:

  + *`dictionary_path`*: A string that specifies the path name of the dictionary file.

  + *`dictionary_name`*: A string that provides a name for the dictionary.

  Return value:

  A string that indicates whether the load operation succeeded. `Dictionary load success` indicates success. `Dictionary load error` indicates failure. Dictionary load failure can occur for several reasons, including:

  + A dictionary with the given name is already loaded.
  + The dictionary file is not found.
  + The dictionary file contains no terms.
  + The `secure_file_priv` system variable is set and the dictionary file is not located in the directory named by the variable.

  Example:

  ```sql
  mysql> SELECT gen_dictionary_load('/usr/local/mysql/mysql-files/mydict','mydict');
  +---------------------------------------------------------------------+
  | gen_dictionary_load('/usr/local/mysql/mysql-files/mydict','mydict') |
  +---------------------------------------------------------------------+
  | Dictionary load success                                             |
  +---------------------------------------------------------------------+
  mysql> SELECT gen_dictionary_load('/dev/null','null');
  +-----------------------------------------+
  | gen_dictionary_load('/dev/null','null') |
  +-----------------------------------------+
  | Dictionary load error                   |
  +-----------------------------------------+
  ```
