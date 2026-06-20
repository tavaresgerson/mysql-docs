## 8.5 MySQL Enterprise Data Masking and De-Identification

Note

MySQL Enterprise Data Masking and De-Identification is an extension included in MySQL Enterprise Edition, a commercial product. To learn more about commercial products, <https://www.mysql.com/products/>.

MySQL Enterprise Edition provides data masking and de-identification capabilities:

* Transformation of existing data to mask it and remove identifying characteristics, such as changing all digits of a credit card number but the last four to `'X'` characters.

* Generation of random data, such as email addresses and payment card numbers.

* Substitution of data by data from dictionaries stored in the database. The dictionaries are easily replicated in a standard way. Administration is restricted to authorized users who are granted special privileges so that only they can create and modify the dictionaries.

Note

MySQL Enterprise Data Masking and De-Identification was implemented originally in MySQL 8.0.13 as a plugin library. As of MySQL 8.0.33, MySQL Enterprise Edition also provides components to access data masking and de-identification capabilities. For information about the similarities and differences, see Table 8.45, “Comparison Between Data-Masking Components and Plugin Elements”.

If you are using MySQL Enterprise Data Masking and De-Identification for the first time, consider installing the components for access to the ongoing enhancements only available with component infrastructure.

The way that applications use these capabilities depends on the purpose for which the data is used and who accesses it:

* Applications that use sensitive data may protect it by performing data masking and permitting use of partially masked data for client identification. Example: A call center may ask for clients to provide their last four Social Security Number digits.

* Applications that require properly formatted data, but not necessarily the original data, can synthesize sample data. Example: An application developer who is testing data validators but has no access to original data may synthesize random data with the same format.

* Applications that must substitute a real name with a dictionary term to protect to protect sensitive information, but still provide realistic content to application users. Example: A user in training who is restricted from viewing addresses gets a random term from dictionary `city names` instead of the real city name. A variant of this scenario may be that the real city name is replaced only if it exists in `usa_city_names`.

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


### 8.5.1 Data-Masking Components Versus the Data-Masking Plugin

Prior to 8.0.33, MySQL enabled masking and de-identification capabilities using a server-side plugin, but transitioned to use the component infrastructure in MySQL 8.0.33. The following table briefly compares MySQL Enterprise Data Masking and De-Identification components and the plugin library to provide an overview of their differences. It may assist you in making the transition from the plugin to components.

Note

Only the data-masking components or the plugin should be enabled at a time. Enabling both components and the plugin is unsupported and results may not be as anticipated.

**Table 8.45 Comparison Between Data-Masking Components and Plugin Elements**

<table><col width="50%"/><col width="25%"/><col width="25%"/><thead><tr> <th scope="col">Category</th> <th scope="col">Components</th> <th scope="col">Plugin</th> </tr></thead><tbody><tr> <th scope="row">Interface</th> <td>Service functions, loadable functions</td> <td>Loadable functions</td> </tr><tr> <th scope="row">Support for multibyte character sets</th> <td>Yes, for general-purpose masking functions</td> <td>No</td> </tr><tr> <th scope="row">General-purpose masking functions</th> <td><code>mask_inner()</code>, <code>mask_outer()</code></td> <td><code>mask_inner()</code>, <code>mask_outer()</code></td> </tr><tr> <th scope="row">Masking of specific types</th> <td>PAN, SSN, IBAN, UUID, Canada SIN, UK NIN</td> <td>PAN, SSN</td> </tr><tr> <th scope="row">Random generation, specific types</th> <td>email, US phone, PAN, SSN, IBAN, UUID, Canada SIN, UK NIN</td> <td>email, US phone, PAN, SSN</td> </tr><tr> <th scope="row">Random generation of integer from given range</th> <td>Yes</td> <td>Yes</td> </tr><tr> <th scope="row">Persisting substitution dictionaries</th> <td>Database</td> <td>File</td> </tr><tr> <th scope="row">Privilege to manage dictionaries</th> <td>Dedicated privilege</td> <td>FILE</td> </tr><tr> <th scope="row">Automated loadable-function registration/deregistration during installation/uninstallation</th> <td>Yes</td> <td>No</td> </tr><tr> <th scope="row">Enhancements to existing functions</th> <td>More arguments added to the <code>gen_rnd_email()</code> function</td> <td>N/A</td> </tr></tbody></table>


### 8.5.2 MySQL Enterprise Data Masking and De-Identification Components

MySQL Enterprise Data Masking and De-Identification implements these elements:

* A table in the `mysql` system database for persistent storage of dictionaries and terms.

* A component named `component_masking` that implements masking functionality and exposes it as service interface for developers.

  Developers who wish to incorporate the same service functions used by `component_masking` should consult the `internal\components\masking\component_masking.h` file in a MySQL source distribution or https://dev.mysql.com/doc/dev/mysql-server/latest.

* A component named `component_masking_functions` that provides loadable functions.

  The set of loadable functions enables an SQL-level API for performing masking and de-identification operations. Some of the functions require the `MASKING_DICTIONARIES_ADMIN` dynamic privilege.


#### 8.5.2.1 MySQL Enterprise Data Masking and De-Identification Component Installation

As of MySQL 8.0.33, components provide access to MySQL Enterprise Data Masking and De-Identification functionality. Previously, MySQL implemented masking and de-identification capabilities as a plugin library file containing a plugin and several loadable functions. Before you begin the component installation, remove the `data_masking` plugin and all of its loadable functions to avoid conflicts. For instructions, see Section 8.5.3.1, “MySQL Enterprise Data Masking and De-Identification Plugin Installation”.

MySQL Enterprise Data Masking and De-Identification database table and components are:

* `masking_dictionaries` table

  Purpose: A table in the `mysql` system schema that provides persistent storage of dictionaries and terms.

* `component_masking` component

  Purpose: The component implements the core of the masking functionality and exposes it as services.

  URN: `file://component_masking`

* `component_masking_functions` component

  Purpose: The component exposes all functionality of the `component_masking` component as loadable functions. Some of the functions require the `MASKING_DICTIONARIES_ADMIN` dynamic privilege.

  URN: `file://component_masking_functions`

To set up MySQL Enterprise Data Masking and De-Identification, do the following:

1. Create the `masking_dictionaries` table.

   ```
   CREATE TABLE IF NOT EXISTS
   mysql.masking_dictionaries(
       Dictionary VARCHAR(256) NOT NULL,
       Term VARCHAR(256) NOT NULL,
       UNIQUE INDEX dictionary_term_idx (Dictionary, Term),
       INDEX dictionary_idx (Dictionary)
   ) ENGINE = InnoDB DEFAULT CHARSET=utf8mb4;
   ```

2. Use the `INSTALL COMPONENT` SQL statement to install data masking components.

   ```
   INSTALL COMPONENT 'file://component_masking';
   INSTALL COMPONENT 'file://component_masking_functions';
   ```

   If the components and functions are used on a replication source server, install them on all replica servers as well to avoid replication issues. While the components are loaded, information about them is available as described in Section 7.5.2, “Obtaining Component Information”.

To remove MySQL Enterprise Data Masking and De-Identification, do the following:

1. Use the `UNINSTALL COMPONENT` SQL statement to uninstall the data masking components.

   ```
   UNINSTALL COMPONENT 'file://component_masking_functions';
   UNINSTALL COMPONENT 'file://component_masking';
   ```

2. Drop the `masking_dictionaries` table.

   ```
   DROP TABLE mysql.masking_dictionaries;
   ```

`component_masking_functions` installs all of the related loadable functions automatically. Similarly, the component when uninstalled also automatically uninstalls those functions. For general information about installing or uninstalling components, see Section 7.5.1, “Installing and Uninstalling Components”.


#### 8.5.2.2 Using MySQL Enterprise Data Masking and De-Identification Components

Before using MySQL Enterprise Data Masking and De-Identification, install it according to the instructions provided at Section 8.5.2.1, “MySQL Enterprise Data Masking and De-Identification Component Installation”.

To use MySQL Enterprise Data Masking and De-Identification in applications, invoke the functions that are appropriate for the operations you wish to perform. For detailed function descriptions, see Section 8.5.2.4, “MySQL Enterprise Data Masking and De-Identification Component Function Descriptions”. This section demonstrates how to use the functions to carry out some representative tasks. It first presents an overview of the available functions, followed by some examples of how the functions might be used in real-world context:

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

MySQL Enterprise Data Masking and De-Identification enables dictionaries to be used as sources of random values called *terms*. To use a dictionary, it must first be added to the `masking_dictionaries` system table and given a name. The dictionaries are read from the table and loaded to the cache during initialization of the components (on server startup). Terms then can then be added, removed, and selected from dictionaries and used as random values or as replacements for other values.

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

* MASKING_DICTIONARY_ADMIN privilege is required to add and remove terms, or to remove an entire dictionary.

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


#### 8.5.2.3 MySQL Enterprise Data Masking and De-Identification Component Function Reference

**Table 8.46 MySQL Enterprise Data Masking and De-Identification Component Functions**

<table frame="box" rules="all" summary="A reference that lists MySQL Enterprise Data Masking and De-Identification functions."><col style="width: 25%"/><col style="width: 62%"/><col style="width: 12%"/><thead><tr><th>Name</th> <th>Description</th> <th>Introduced</th> </tr></thead><tbody><tr><th scope="row"><code>gen_blocklist()</code></th> <td> Perform dictionary term replacement </td> <td>8.0.33</td> </tr><tr><th scope="row"><code>gen_dictionary()</code></th> <td> Return random term from dictionary </td> <td>8.0.33</td> </tr><tr><th scope="row"><code>gen_range()</code></th> <td> Generate random number within range </td> <td>8.0.33</td> </tr><tr><th scope="row"><code>gen_rnd_canada_sin()</code></th> <td> Generate random Canada Social Insurance Number </td> <td>8.0.33</td> </tr><tr><th scope="row"><code>gen_rnd_email()</code></th> <td> Generate random email address </td> <td>8.0.33</td> </tr><tr><th scope="row"><code>gen_rnd_iban()</code></th> <td> Generate random International Bank Account Number </td> <td>8.0.33</td> </tr><tr><th scope="row"><code>gen_rnd_pan()</code></th> <td> Generate random payment card Primary Account Number </td> <td>8.0.33</td> </tr><tr><th scope="row"><code>gen_rnd_ssn()</code></th> <td> Generate random US Social Security Number </td> <td>8.0.33</td> </tr><tr><th scope="row"><code>gen_rnd_uk_nin()</code></th> <td> Generate random United Kingdom National Insurance Number </td> <td>8.0.33</td> </tr><tr><th scope="row"><code>gen_rnd_us_phone()</code></th> <td> Generate random US phone number </td> <td>8.0.33</td> </tr><tr><th scope="row"><code>gen_rnd_uuid()</code></th> <td> Generate random Universally Unique Identifier </td> <td>8.0.33</td> </tr><tr><th scope="row"><code>mask_canada_sin()</code></th> <td> Mask Canada Social Insurance Number </td> <td>8.0.33</td> </tr><tr><th scope="row"><code>mask_iban()</code></th> <td> Mask International Bank Account Number </td> <td>8.0.33</td> </tr><tr><th scope="row"><code>mask_inner()</code></th> <td> Mask interior part of string </td> <td>8.0.33</td> </tr><tr><th scope="row"><code>mask_outer()</code></th> <td> Mask left and right parts of string </td> <td>8.0.33</td> </tr><tr><th scope="row"><code>mask_pan()</code></th> <td> Mask payment card Primary Account Number part of string </td> <td>8.0.33</td> </tr><tr><th scope="row"><code>mask_pan_relaxed()</code></th> <td> Mask payment card Primary Account Number part of string </td> <td>8.0.33</td> </tr><tr><th scope="row"><code>mask_ssn()</code></th> <td> Mask US Social Security Number </td> <td>8.0.33</td> </tr><tr><th scope="row"><code>mask_uk_nin()</code></th> <td> Mask United Kingdom National Insurance Number </td> <td>8.0.33</td> </tr><tr><th scope="row"><code>mask_uuid()</code></th> <td> Mask Universally Unique Identifier part of string </td> <td>8.0.33</td> </tr><tr><th scope="row"><code>masking_dictionary_remove()</code></th> <td> Remove dictionary from the database table </td> <td>8.0.33</td> </tr><tr><th scope="row"><code>masking_dictionary_term_add()</code></th> <td> Add new term to the dictionary </td> <td>8.0.33</td> </tr><tr><th scope="row"><code>masking_dictionary_term_remove()</code></th> <td> Remove existing term from the dictionary </td> <td>8.0.33</td> </tr></tbody></table>


#### 8.5.2.4 MySQL Enterprise Data Masking and De-Identification Component Function Descriptions

The MySQL Enterprise Data Masking and De-Identification components includes several functions, which may be grouped into these categories:

* Data Masking Component Functions
* Random Data Generation Component Functions
* Dictionary Masking Administration Component Functions
* Dictionary Generating Component Functions

##### Data Masking Component Functions

Each component function in this section performs a masking operation on its string argument and returns the masked result.

* [`mask_canada_sin(str [, mask_char])`](data-masking-component-functions.html#function_mask-canada-sin)

  Masks a Canada Social Insurance Number (SIN) and returns the number with all meaningful digits replaced by `'X'` characters. An optional masking character can be specified.

  Arguments:

  + *`str`*: The string to mask. The accepted formats are:

    - Nine non-separated digits.
    - Nine digits grouped in pattern: `xxx-xxx-xxx` ('`-`' is any separator character).

    This argument is converted to the `utf8mb4` character set.

  + *`mask_char`*: (Optional) The single character to use for masking. The default is `'X'` if *`mask_char`* is not given.

  Return value:

  The masked Canada SIN as a string encoded in the `utf8mb4` character set, an error if the argument is not the correct length, or `NULL` if *`str`* is in incorrect format or contains a multibyte character.

  Example:

  ```
  mysql> SELECT mask_canada_sin('046-454-286'), mask_canada_sin('abcdefijk');
  +--------------------------------+------------------------------+
  | mask_canada_sin('046-454-286') | mask_canada_sin('abcdefijk') |
  +--------------------------------+------------------------------+
  | XXX-XXX-XXX                    | XXXXXXXXX                    |
  +--------------------------------+------------------------------+
  mysql> SELECT mask_canada_sin('909');
  ERROR 1123 (HY000): Can't initialize function 'mask_canada_sin'; Argument 0 is too short.
  mysql> SELECT mask_canada_sin('046-454-286-909');
  ERROR 1123 (HY000): Can't initialize function 'mask_canada_sin'; Argument 0 is too long.
  ```

* [`mask_iban(str [, mask_char])`](data-masking-component-functions.html#function_mask-iban)

  Masks an International Bank Account Number (IBAN) and returns the number with all but the first two letters (denoting the country) replaced by `'*'` characters. An optional masking character can be specified.

  Arguments:

  + *`str`*: The string to mask. Each country can have a different national routing or account numbering system, with a minimum of 13 and a maximum of 34 alphanumeric ASCII characters. The accepted formats are:

    - Non-separated characters.
    - Character grouped by four, except the last group, and separated by space or any other separator character (for example: `xxxx-xxxx-xxxx-xx`).

    This argument is converted to the `utf8mb4` character set.

  + *`mask_char`*: (Optional) The single character to use for masking. The default is `'*'` if *`mask_char`* is not given.

  Return value:

  The masked International Bank Account Number as a string encoded in the `utf8mb4` character set, an error if the argument is not the correct length, or `NULL` if *`str`* is in incorrect format or contains a multibyte character.

  Example:

  ```
  mysql> SELECT mask_iban('IE12 BOFI 9000 0112 3456 78'), mask_iban('abcdefghijk');
  +------------------------------------------+--------------------------+
  | mask_iban('IE12 BOFI 9000 0112 3456 78') | mask_iban('abcdefghijk') |
  +------------------------------------------+--------------------------+
  | IE** **** **** **** **** **              | ab*********              |
  +------------------------------------------+--------------------------+
  mysql> SELECT mask_iban('909');
  ERROR 1123 (HY000): Can't initialize function 'mask_iban'; Argument 0 is too short.
  mysql> SELECT mask_iban('IE12 BOFI 9000 0112 3456 78 IE12 BOFI 9000 0112 3456 78');
  ERROR 1123 (HY000): Can't initialize function 'mask_iban'; Argument 0 is too long.
  ```

* [`mask_inner(str, margin1, margin2 [, mask_char])`](data-masking-component-functions.html#function_mask-inner)

  Masks the interior part of a string, leaving the ends untouched, and returns the result. An optional masking character can be specified.

  `mask_inner` supports all character sets.

  Arguments:

  + *`str`*: The string to mask. This argument is converted to the `utf8mb4` character set.

  + *`margin1`*: A nonnegative integer that specifies the number of characters on the left end of the string to remain unmasked. If the value is 0, no left end characters remain unmasked.

  + *`margin2`*: A nonnegative integer that specifies the number of characters on the right end of the string to remain unmasked. If the value is 0, no right end characters remain unmasked.

  + *`mask_char`*: (Optional) The single character to use for masking. The default is `'X'` if *`mask_char`* is not given.

  Return value:

  The masked string encoded in the same character set used for *`str`*, or an error if either margin is negative.

  If the sum of the margin values is larger than the argument length, no masking occurs and the argument is returned unchanged.

  Note

  The function is optimized to work faster for single byte strings (having equal byte length and character length). For example, the `utf8mb4` character set uses only one byte for ASCII characters, so the function processes strings containing only ASCII characters as single-byte character strings.

  Example:

  ```
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

* [`mask_outer(str, margin1, margin2 [, mask_char])`](data-masking-component-functions.html#function_mask-outer)

  Masks the left and right ends of a string, leaving the interior unmasked, and returns the result. An optional masking character can be specified.

  `mask_outer` supports all character sets.

  Arguments:

  + *`str`*: The string to mask. This argument is converted to the `utf8mb4` character set.

  + *`margin1`*: A nonnegative integer that specifies the number of characters on the left end of the string to mask. If the value is 0, no left end characters are masked.

  + *`margin2`*: A nonnegative integer that specifies the number of characters on the right end of the string to mask. If the value is 0, no right end characters are masked.

  + *`mask_char`*: (Optional) The single character to use for masking. The default is `'X'` if *`mask_char`* is not given.

  Return value:

  The masked string encoded in the same character set used for *`str`*, or an error if either margin is negative.

  If the sum of the margin values is larger than the argument length, the entire argument is masked.

  Note

  The function is optimized to work faster for single byte strings (having equal byte length and character length). For example, the `utf8mb4` character set uses only one byte for ASCII characters, so the function processes strings containing only ASCII characters as single-byte character strings.

  Example:

  ```
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

* [`mask_pan(str [, mask_char])`](data-masking-component-functions.html#function_mask-pan)

  Masks a payment card Primary Account Number (PAN) and returns the number with all but the last four digits replaced by `'X'` characters. An optional masking character can be specified.

  Arguments:

  + *`str`*: The string to mask. The string must contain a minimum of 14 and a maximum of 19 alphanumeric characters. This argument is converted to the `utf8mb4` character set.

  + *`mask_char`*: (Optional) The single character to use for masking. The default is `'X'` if *`mask_char`* is not given.

  Return value:

  The masked payment number as a string encoded in the `utf8mb4` character set, an error if the argument is not the correct length, or `NULL` if *`str`* is in incorrect format or contains a multibyte character.

  Example:

  ```
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
  ERROR 1123 (HY000): Can't initialize function 'mask_pan'; Argument 0 is too short.
  ```

* `mask_pan_relaxed(str)`

  Masks a payment card Primary Account Number and returns the number with all but the first six and last four digits replaced by `'X'` characters. The first six digits indicate the payment card issuer. An optional masking character can be specified.

  Arguments:

  + *`str`*: The string to mask. The string must be a suitable length for the Primary Account Number, but is not otherwise checked. This argument is converted to the `utf8mb4` character set.

  + *`mask_char`*: (Optional) The single character to use for masking. The default is `'X'` if *`mask_char`* is not given.

  Return value:

  The masked payment number as a string encoded in the `utf8mb4` character set, an error if the argument is not the correct length, or `NULL` if *`str`* is in incorrect format or contains a multibyte character.

  Example:

  ```
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
  ERROR 1123 (HY000): Can't initialize function 'mask_pan_relaxed'; Argument 0 is too short.
  ```

* [`mask_ssn(str [, mask_char])`](data-masking-component-functions.html#function_mask-ssn)

  Masks a US Social Security Number (SSN) and returns the number with all but the last four digits replaced by `'*'` characters. An optional masking character can be specified.

  Arguments:

  + *`str`*: The string to mask. The accepted formats are:

    - Nine non-separated digits.
    - Nine digits grouped in pattern: `xxx-xx-xxxx` ('`-`' is any separator character).

    This argument is converted to the `utf8mb4` character set.

  + *`mask_char`*: (Optional) The single character to use for masking. The default is `'*'` if *`mask_char`* is not given.

  Return value:

  The masked Social Security Number as a string encoded in the `utf8mb4` character set, an error if the argument is not the correct length, or `NULL` if *`str`* is in incorrect format or contains a multibyte character.

  Example:

  ```
  mysql> SELECT mask_ssn('909-63-6922'), mask_ssn('cdefghijk');
  +-------------------------+-------------------------+
  | mask_ssn('909-63-6922') | mask_ssn('cdefghijk')   |
  +-------------------------+-------------------------+
  | ***-**-6922             | *******hijk             |
  +-------------------------+-------------------------+
  mysql> SELECT mask_ssn('909');
  ERROR 1123 (HY000): Can't initialize function 'mask_ssn'; Argument 0 is too short.
  mysql> SELECT mask_ssn('123456789123456789');
  ERROR 1123 (HY000): Can't initialize function 'mask_ssn'; Argument 0 is too long.
  ```

* [`mask_uk_nin(str [, mask_char])`](data-masking-component-functions.html#function_mask-uk-nin)

  Masks a United Kingdom National Insurance Number (UK NIN) and returns the number with all but the first two digits replaced by `'*'` characters. An optional masking character can be specified.

  Arguments:

  + *`str`*: The string to mask. The accepted formats are:

    - Nine non-separated digits.
    - Nine digits grouped in pattern: `xxx-xx-xxxx` ('`-`' is any separator character).

    - Nine digits grouped in pattern: `xx-xxxxxx-x` ('`-`' is any separator character).

    This argument is converted to the `utf8mb4` character set.

  + *`mask_char`*: (Optional) The single character to use for masking. The default is `'*'` if *`mask_char`* is not given.

  Return value:

  The masked UK NIN as a string encoded in the `utf8mb4` character set, an error if the argument is not the correct length, or `NULL` if *`str`* is in incorrect format or contains a multibyte character.

  Example:

  ```
  mysql> SELECT mask_uk_nin('QQ 12 34 56 C'), mask_uk_nin('abcdefghi');
  +------------------------------+--------------------------+
  | mask_uk_nin('QQ 12 34 56 C') | mask_uk_nin('abcdefghi') |
  +------------------------------+--------------------------+
  | QQ ** ** ** *                | ab*******                |
  +------------------------------+--------------------------+
  mysql> SELECT mask_uk_nin('909');
  ERROR 1123 (HY000): Can't initialize function 'mask_uk_nin'; Argument 0 is too short.
  mysql> SELECT mask_uk_nin('abcdefghijk');
  ERROR 1123 (HY000): Can't initialize function 'mask_uk_nin'; Argument 0 is too long.
  ```

* [`mask_uuid(str [, mask_char])`](data-masking-component-functions.html#function_mask-uuid)

  Masks a Universally Unique Identifier (UUID) and returns the number with all meaningful characters replaced by `'*'` characters. An optional masking character can be specified.

  Arguments:

  + *`str`*: The string to mask. The accepted format is `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` in which '`X`' is any digit and '`-`' is any separator character This argument is converted to the `utf8mb4` character set.

  + *`mask_char`*: (Optional) The single character to use for masking. The default is `'*'` if *`mask_char`* is not given.

  Return value:

  The masked UUID as a string encoded in the `utf8mb4` character set, an error if the argument is not the correct length, or `NULL` if *`str`* is in incorrect format or contains a multibyte character.

  Example:

  ```
  mysql> SELECT mask_uuid(gen_rnd_uuid());
  +--------------------------------------+
  | mask_uuid(gen_rnd_uuid())            |
  +--------------------------------------+
  | ********-****-****-****-************ |
  +--------------------------------------+
  mysql> SELECT mask_uuid('909');
  ERROR 1123 (HY000): Can't initialize function 'mask_uuid'; Argument 0 is too short.
  mysql> SELECT mask_uuid('123e4567-e89b-12d3-a456-426614174000-123e4567-e89b-12d3');
  ERROR 1123 (HY000): Can't initialize function 'mask_uuid'; Argument 0 is too long.
  ```

##### Random Data Generation Component Functions

The component functions in this section generate random values for different types of data. When possible, generated values have characteristics reserved for demonstration or test values, to avoid having them mistaken for legitimate data. For example, `gen_rnd_us_phone()` returns a US phone number that uses the 555 area code, which is not assigned to phone numbers in actual use. Individual function descriptions describe any exceptions to this principle.

* [`gen_range(lower, upper)`](data-masking-component-functions.html#function_gen-range)

  Generates a random number chosen from a specified range.

  Arguments:

  + *`lower`*: An integer that specifies the lower boundary of the range.

  + *`upper`*: An integer that specifies the upper boundary of the range, which must not be less than the lower boundary.

  Return value:

  A random integer (encoded in the `utf8mb4` character set) in the range from *`lower`* to *`upper`*, inclusive, or `NULL` if the *`upper`* argument is less than *`lower`*.

  Note

  For better quality of random values, use `RAND()` instead of this function.

  Example:

  ```
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

* `gen_rnd_canada_sin()`

  Generates a random Canada Social Insurance Number (SIN) in `AAA-BBB-CCC` format. The generated number passes the Luhn check algorithm, which ensures the consistency of this number.

  Warning

  Values returned from `gen_rnd_canada_sin()` should be used only for test purposes, and are not suitable for publication. There is no way to guarantee that a given return value is not assigned to a legitimate Canada SIN. Should it be necessary to publish a `gen_rnd_canada_sin()` result, consider masking it with `mask_canada_sin()`.

  Arguments:

  None.

  Return value:

  A random Canada SIN as a string encoded in the `utf8mb4` character set.

  Example:

  ```
  mysql> SELECT mask_canada_sin( gen_rnd_canada_sin() );
  +-----------------------------------------+
  | mask_canada_sin( gen_rnd_canada_sin() ) |
  +-----------------------------------------+
  | xxx-xxx-xxx                             |
  +-----------------------------------------+
  ```

* [`gen_rnd_email(name_size, surname_size, domain)`](data-masking-component-functions.html#function_gen-rnd-email)

  Generates a random email address in the form of *`random_name`*.*`random_surname`*@*`domain`*.

  Arguments:

  + *`name_size`*: (Optional) An integer that specifies the number of characters in the name part of an address. The default is five if *`name_size`* is not given.

  + *`surname_size`*: (Optional) An integer that specifies the number of characters in the surname part of an address. The default is seven if *`surname_size`* is not given.

  + *`domain`*: (Optional) A string that specifies the domain part of the address. The default is `example.com` if *`domain`* is not given.

  Return value:

  A random email address as a string encoded in the `utf8mb4` character set.

  Example:

  ```
  mysql> SELECT gen_rnd_email(name_size = 4, surname_size = 5, domain = 'mynet.com');
  +----------------------------------------------------------------------+
  | gen_rnd_email(name_size = 4, surname_size = 5, domain = 'mynet.com') |
  +----------------------------------------------------------------------+
  | lsoy.qwupp@mynet.com                                                 |
  +----------------------------------------------------------------------+
  mysql> SELECT gen_rnd_email();
  +---------------------------+
  | gen_rnd_email()           |
  +---------------------------+
  | ijocv.mwvhhuf@example.com |
  +---------------------------+
  ```

* [`gen_rnd_iban([country, size])`](data-masking-component-functions.html#function_gen-rnd-iban)

  Generates a random International Bank Account Number (IBAN) in `AAAA BBBB CCCC DDDD` format. The generated string starts with a two-character country code, two check digits computed according to the IBAN specification and random alphanumeric characters up to the required size.

  Warning

  Values returned from `gen_rnd_iban()` should be used only for test purposes, and are not suitable for publication if used with a valid country code. There is no way to guarantee that a given return value is not assigned to a legitimate bank account. Should it be necessary to publish a `gen_rnd_iban()` result, consider masking it with `mask_iban()`.

  Arguments:

  + *`country`*: (Optional) Two-character country code; default value is `ZZ`

  + *`size`*: (Optional) Number of meaningful characters; default 16, minimum 15, maximum 34

  Return value:

  A random IBAN as a string encoded in the `utf8mb4` character set.

  Example:

  ```
  mysql> SELECT gen_rnd_iban();
  +-----------------------------+
  | gen_rnd_iban()              |
  +-----------------------------+
  | ZZ79 3K2J WNH9 1V0DI        |
  +-----------------------------+
  ```

* `gen_rnd_pan([size])`

  Generates a random payment card Primary Account Number. The number passes the Luhn check (an algorithm that performs a checksum verification against a check digit).

  Warning

  Values returned from `gen_rnd_pan()` should be used only for test purposes, and are not suitable for publication. There is no way to guarantee that a given return value is not assigned to a legitimate payment account. Should it be necessary to publish a `gen_rnd_pan()` result, consider masking it with `mask_pan()` or `mask_pan_relaxed()`.

  Arguments:

  + *`size`*: (Optional) An integer that specifies the size of the result. The default is 16 if *`size`* is not given. If given, *`size`* must be an integer in the range from 12 to 19.

  Return value:

  A random payment number as a string, or an error if a *`size`* argument outside the permitted range is given.

  Example:

  ```
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
  mysql> SELECT gen_rnd_pan(20);
  ERROR 1123 (HY000): Can't initialize function 'gen_rnd_pan'; Maximal value of
  argument 0 is 20.
  ```

* `gen_rnd_ssn()`

  Generates a random US Social Security Number in `AAA-BB-CCCC` format. The *`AAA`* part is greater than 900, which is outside the range used for legitimate social security numbers.

  Arguments:

  None.

  Return value:

  A random Social Security Number as a string encoded in the `utf8mb4` character set.

  Example:

  ```
  mysql> SELECT gen_rnd_ssn();
  +---------------+
  | gen_rnd_ssn() |
  +---------------+
  | 951-26-0058   |
  +---------------+
  ```

* `gen_rnd_uk_nin()`

  Generates a random United Kingdom National Insurance Number (UK NIN) in nine-character format. NIN starts with two character prefix randomly selected from the set of valid prefixes, six random numbers, and one character suffix randomly selected from the set of valid suffixes.

  Warning

  Values returned from `gen_rnd_uk_nin()` should be used only for test purposes, and are not suitable for publication. There is no way to guarantee that a given return value is not assigned to a legitimate NIN. Should it be necessary to publish a `gen_rnd_uk_nin()` result, consider masking it with `mask_uk_nin()`.

  Arguments:

  None.

  Return value:

  A random UK NIN as a string encoded in the `utf8mb4` character set.

  Example:

  ```
  mysql> SELECT mask_uk_nin( gen_rnd_uk_nin() );
  +---------------------------------+
  | mask_uk_nin( gen_rnd_uk_nin() ) |
  +---------------------------------+
  | JE*******                       |
  +---------------------------------+
  ```

* `gen_rnd_us_phone()`

  Generates a random US phone number in `1-555-AAA-BBBB` format. The 555 area code is not used for legitimate phone numbers.

  Arguments:

  None.

  Return value:

  A random US phone number as a string encoded in the `utf8mb4` character set.

  Example:

  ```
  mysql> SELECT gen_rnd_us_phone();
  +--------------------+
  | gen_rnd_us_phone() |
  +--------------------+
  | 1-555-682-5423     |
  +--------------------+
  ```

* `gen_rnd_uuid()`

  Generates a random Universally Unique Identifier (UUID) segmented with dashes.

  Arguments:

  None.

  Return value:

  A random UUID as a string encoded in the `utf8mb4` character set.

  Example:

  ```
  mysql> SELECT gen_rnd_uuid();
  +--------------------------------------+
  | gen_rnd_uuid()                       |
  +--------------------------------------+
  | 123e4567-e89b-12d3-a456-426614174000 |
  +--------------------------------------+
  ```

##### Dictionary Masking Administration Component Functions

The component functions in this section manipulate dictionaries of terms and perform administrative masking operations based on them. All of these functions require the `MASKING_DICTIONARIES_ADMIN` privilege.

When a dictionary of terms is created, it becomes part of the dictionary registry and is assigned a name to be used by other dictionary functions.

* `masking_dictionary_remove(dictionary_name)`

  Removes a dictionary and all of its terms from the dictionary registry. This function requires the `MASKING_DICTIONARIES_ADMIN` privilege.

  Arguments:

  + *`dictionary_name`*: A string that names the dictionary to remove from the dictionary table. This argument is converted to the `utf8mb4` character set.

  Return value:

  A string that indicates whether the remove operation succeeded. `1` indicates success. `NULL` indicates the dictionary name is not found.

  Example:

  ```
  mysql> SELECT masking_dictionary_remove('mydict');
  +-------------------------------------+
  | masking_dictionary_remove('mydict') |
  +-------------------------------------+
  |                                   1 |
  +-------------------------------------+
  mysql> SELECT masking_dictionary_remove('no-such-dict');
  +-------------------------------------------+
  | masking_dictionary_remove('no-such-dict') |
  +-------------------------------------------+
  |                                      NULL |
  +-------------------------------------------+
  ```

* [`masking_dictionary_term_add(dictionary_name, term_name)`](data-masking-component-functions.html#function_masking-dictionary-term-add)

  Adds one term to the named dictionary. This function requires the `MASKING_DICTIONARIES_ADMIN` privilege.

  Important

  Dictionaries and their terms are persisted to a table in the `mysql` schema. All of the terms in a dictionary are accessible to any user account if that user executes `gen_dictionary()` repeatedly. Avoid adding sensitive information to dictionaries.

  Each term is defined by a named dictionary. `masking_dictionary_term_add()` permits you to add one dictionary term at a time.

  Arguments:

  + *`dictionary_name`*: A string that provides a name for the dictionary. This argument is converted to the `utf8mb4` character set.

  + *`term_name`*: A string that specifies the term name in the dictionary table. This argument is converted to the `utf8mb4` character set.

  Return value:

  A string that indicates whether the add term operation succeeded. `1` indicates success. `NULL` indicates failure. Term add failure can occur for several reasons, including:

  + A term with the given name is already added.
  + The dictionary name is not found.

  Example:

  ```
  mysql> SELECT masking_dictionary_term_add('mydict','newterm');
  +-------------------------------------------------+
  | masking_dictionary_term_add('mydict','newterm') |
  +-------------------------------------------------+
  |                                               1 |
  +-------------------------------------------------+
  mysql> SELECT masking_dictionary_term_add('mydict','');
  +------------------------------------------+
  | masking_dictionary_term_add('mydict','') |
  +------------------------------------------+
  |                                     NULL |
  +------------------------------------------+
  ```

* [`masking_dictionary_term_remove(dictionary_name, term_name)`](data-masking-component-functions.html#function_masking-dictionary-term-remove)

  Removes one term from the named dictionary. This function requires the `MASKING_DICTIONARIES_ADMIN` privilege.

  Arguments:

  + *`dictionary_name`*: A string that provides a name for the dictionary. This argument is converted to the `utf8mb4` character set.

  + *`term_name`*: A string that specifies the term name in the dictionary table. This argument is converted to the `utf8mb4` character set.

  Return value:

  A string that indicates whether the remove term operation succeeded. `1` indicates success. `NULL` indicates failure. Term remove failure can occur for several reasons, including:

  + A term with the given name is not found.
  + The dictionary name is not found.

  Example:

  ```
  mysql> SELECT masking_dictionary_term_add('mydict','newterm');
  +-------------------------------------------------+
  | masking_dictionary_term_add('mydict','newterm') |
  +-------------------------------------------------+
  |                                               1 |
  +-------------------------------------------------+
  mysql> SELECT masking_dictionary_term_remove('mydict','');
  +---------------------------------------------+
  | masking_dictionary_term_remove('mydict','') |
  +---------------------------------------------+
  |                                        NULL |
  +---------------------------------------------+
  ```

##### Dictionary Generating Component Functions

The component functions in this section manipulate dictionaries of terms and perform generating operations based on them.

When a dictionary of terms is created, it becomes part of the dictionary registry and is assigned a name to be used by other dictionary functions.

* [`gen_blocklist(str, from_dictionary_name, to_dictionary_name)`](data-masking-component-functions.html#function_gen-blocklist)

  Replaces a term present in one dictionary with a term from a second dictionary and returns the replacement term. This masks the original term by substitution.

  Arguments:

  + *`term`*: A string that indicates the term to replace. This argument is converted to the `utf8mb4` character set.

  + *`from_dictionary_name`*: A string that names the dictionary containing the term to replace. This argument is converted to the `utf8mb4` character set.

  + *`to_dictionary_name`*: A string that names the dictionary from which to choose the replacement term. This argument is converted to the `utf8mb4` character set.

  Return value:

  A string encoded in the `utf8mb4` character set randomly chosen from *`to_dictionary_name`* as a replacement for *`term`*, or *`term`* if it does not appear in *`from_dictionary_name`*, or an error if either dictionary name is not in the dictionary registry.

  Note

  If the term to replace appears in both dictionaries, it is possible for the return value to be the same term.

  Example:

  ```
  mysql> SELECT gen_blocklist('Berlin', 'DE_Cities', 'US_Cities');
  +---------------------------------------------------+
  | gen_blocklist('Berlin', 'DE_Cities', 'US_Cities') |
  +---------------------------------------------------+
  | Phoenix                                           |
  +---------------------------------------------------+
  ```

* `gen_dictionary(dictionary_name)`

  Returns a random term from a dictionary.

  Arguments:

  + *`dictionary_name`*: A string that names the dictionary from which to choose the term. This argument is converted to the `utf8mb4` character set.

  Return value:

  A random term from the dictionary as a string encoded in the `utf8mb4` character set, or `NULL` if the dictionary name is not in the dictionary registry.

  Example:

  ```
  mysql> SELECT gen_dictionary('mydict');
  +--------------------------+
  | gen_dictionary('mydict') |
  +--------------------------+
  | My term                  |
  +--------------------------+
  mysql> SELECT gen_dictionary('no-such-dict');
  ERROR 1123 (HY000): Can't initialize function 'gen_dictionary'; Cannot access
  dictionary, check if dictionary name is valid.
  ```


### 8.5.3 MySQL Enterprise Data Masking and De-Identification Plugin

MySQL Enterprise Data Masking and De-Identification is based on a plugin library that implements these elements:

* A server-side plugin named `data_masking`.
* A set of loadable functions provides an SQL-level API for performing masking and de-identification operations. Some of these functions require the `SUPER` privilege.


#### 8.5.3.1 MySQL Enterprise Data Masking and De-Identification Plugin Installation

This section describes how to install or uninstall MySQL Enterprise Data Masking and De-Identification, which is implemented as a plugin library file containing a plugin and several loadable functions. For general information about installing or uninstalling plugins and loadable functions, see Section 7.6.1, “Installing and Uninstalling Plugins”, and Section 7.7.1, “Installing and Uninstalling Loadable Functions”.

To be usable by the server, the plugin library file must be located in the MySQL plugin directory (the directory named by the `plugin_dir` system variable). If necessary, configure the plugin directory location by setting the value of `plugin_dir` at server startup.

The plugin library file base name is `data_masking`. The file name suffix differs per platform (for example, `.so` for Unix and Unix-like systems, `.dll` for Windows).

To install the MySQL Enterprise Data Masking and De-Identification plugin and functions, use the `INSTALL PLUGIN` and `CREATE FUNCTION` statements, adjusting the `.so` suffix for your platform as necessary:

```
INSTALL PLUGIN data_masking SONAME 'data_masking.so';
CREATE FUNCTION gen_blocklist RETURNS STRING
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

```
UNINSTALL PLUGIN data_masking;
DROP FUNCTION gen_blocklist;
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


#### 8.5.3.2 Using the MySQL Enterprise Data Masking and De-Identification Plugin

Before using MySQL Enterprise Data Masking and De-Identification, install it according to the instructions provided at Section 8.5.3.1, “MySQL Enterprise Data Masking and De-Identification Plugin Installation”.

To use MySQL Enterprise Data Masking and De-Identification in applications, invoke the functions that are appropriate for the operations you wish to perform. For detailed function descriptions, see Section 8.5.3.4, “MySQL Enterprise Data Masking and De-Identification Plugin Function Descriptions”. This section demonstrates how to use the functions to carry out some representative tasks. It first presents an overview of the available functions, followed by some examples of how the functions might be used in real-world context:

* Masking Data to Remove Identifying Characteristics
* Generating Random Data with Specific Characteristics
* Generating Random Data Using Dictionaries
* Using Masked Data for Customer Identification
* Creating Views that Display Masked Data

##### Masking Data to Remove Identifying Characteristics

MySQL provides general-purpose masking functions that mask arbitrary strings, and special-purpose masking functions that mask specific types of values.

###### General-Purpose Masking Functions

`mask_inner()` and `mask_outer()` are general-purpose functions that mask parts of arbitrary strings based on position within the string:

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
mysql> SELECT mask_outer('This is a string', 5, 1, '#');
+-------------------------------------------+
| mask_outer('This is a string', 5, 1, '#') |
+-------------------------------------------+
| #####is a strin#                          |
+-------------------------------------------+
```

###### Special-Purpose Masking Functions

Other masking functions expect a string argument representing a specific type of value and mask it to remove identifying characteristics.

Note

The examples here supply function arguments using the random value generation functions that return the appropriate type of value. For more information about generation functions, see Generating Random Data with Specific Characteristics.

**Payment card Primary Account Number masking.** Masking functions provide strict and relaxed masking of Primary Account Numbers.

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

**US Social Security number masking.** `mask_ssn()` masks all but the last four digits of the number:

```
mysql> SELECT mask_ssn(gen_rnd_ssn());
+-------------------------+
| mask_ssn(gen_rnd_ssn()) |
+-------------------------+
| XXX-XX-1723             |
+-------------------------+
```

##### Generating Random Data with Specific Characteristics

Several functions generate random values. These values can be used for testing, simulation, and so forth.

`gen_range()` returns a random integer selected from a given range:

```
mysql> SELECT gen_range(1, 10);
+------------------+
| gen_range(1, 10) |
+------------------+
|                6 |
+------------------+
```

`gen_rnd_email()` returns a random email address in the `example.com` domain:

```
mysql> SELECT gen_rnd_email();
+---------------------------+
| gen_rnd_email()           |
+---------------------------+
| ayxnq.xmkpvvy@example.com |
+---------------------------+
```

`gen_rnd_pan()` returns a random payment card Primary Account Number:

```
mysql> SELECT gen_rnd_pan();
```

(The `gen_rnd_pan()` function result is not shown because its return values should be used only for testing purposes, and not for publication. It cannot be guaranteed the number is not assigned to a legitimate payment account.)

`gen_rnd_ssn()` returns a random US Social Security number with the first and second parts each chosen from a range not used for legitimate numbers:

```
mysql> SELECT gen_rnd_ssn();
+---------------+
| gen_rnd_ssn() |
+---------------+
| 912-45-1615   |
+---------------+
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

##### Generating Random Data Using Dictionaries

MySQL Enterprise Data Masking and De-Identification enables dictionaries to be used as sources of random values. To use a dictionary, it must first be loaded from a file and given a name. Each loaded dictionary becomes part of the dictionary registry. Items then can be selected from registered dictionaries and used as random values or as replacements for other values.

A valid dictionary file has these characteristics:

* The file contents are plain text, one term per line.
* Empty lines are ignored.
* The file must contain at least one term.

Suppose that a file named `de_cities.txt` contains these city names in Germany:

```
Berlin
Munich
Bremen
```

Also suppose that a file named `us_cities.txt` contains these city names in the United States:

```
Chicago
Houston
Phoenix
El Paso
Detroit
```

Assume that the `secure_file_priv` system variable is set to `/usr/local/mysql/mysql-files`. In that case, copy the dictionary files to that directory so that the MySQL server can access them. Then use `gen_dictionary_load()` to load the dictionaries into the dictionary registry and assign them names:

```
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

At customer-service call centers, one common identity verification technique is to ask customers to provide their last four Social Security number (SSN) digits. For example, a customer might say her name is Joanna Bond and that her last four SSN digits are `0007`.

Suppose that a `customer` table containing customer records has these columns:

* `id`: Customer ID number.
* `first_name`: Customer first name.
* `last_name`: Customer last name.
* `ssn`: Customer Social Security number.

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
mysql> FROM customer
mysql> WHERE first_name = 'Joanna' AND last_name = 'Bond';
+-----+-------------+
| id  | masked_ssn  |
+-----+-------------+
| 786 | XXX-XX-0007 |
+-----+-------------+
```

Now the representative sees only what is necessary, and customer privacy is preserved.

Why was the `CONVERT()` function used for the argument to `mask_ssn()`? Because `mask_ssn()` requires an argument of length 11. Thus, even though `ssn` is defined as `VARCHAR(11)`, if the `ssn` column has a multibyte character set, it may appear to be longer than 11 bytes when passed to a loadable function, and an error occurs. Converting the value to a binary string ensures that the function sees an argument of length 11.

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
| 786 | XXX-XX-0007 |
+-----+-------------+
```


#### 8.5.3.3 MySQL Enterprise Data Masking and De-Identification Plugin Function Reference

**Table 8.47 MySQL Enterprise Data Masking and De-Identification Plugin Functions**

<table frame="box" rules="all" summary="A reference that lists MySQL Enterprise Data Masking and De-Identification plugin functions."><col style="width: 22%"/><col style="width: 55%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th>Name</th> <th>Description</th> <th>Introduced</th> <th>Deprecated</th> </tr></thead><tbody><tr><th scope="row"><code>gen_blacklist()</code></th> <td> Perform dictionary term replacement </td> <td></td> <td>8.0.23</td> </tr><tr><th scope="row"><code>gen_blocklist()</code></th> <td> Perform dictionary term replacement </td> <td>8.0.23</td> <td></td> </tr><tr><th scope="row"><code>gen_dictionary_drop()</code></th> <td> Remove dictionary from registry </td> <td></td> <td></td> </tr><tr><th scope="row"><code>gen_dictionary_load()</code></th> <td> Load dictionary into registry </td> <td></td> <td></td> </tr><tr><th scope="row"><code>gen_dictionary()</code></th> <td> Return random term from dictionary </td> <td></td> <td></td> </tr><tr><th scope="row"><code>gen_range()</code></th> <td> Generate random number within range </td> <td></td> <td></td> </tr><tr><th scope="row"><code>gen_rnd_email()</code></th> <td> Generate random email address </td> <td></td> <td></td> </tr><tr><th scope="row"><code>gen_rnd_pan()</code></th> <td> Generate random payment card Primary Account Number </td> <td></td> <td></td> </tr><tr><th scope="row"><code>gen_rnd_ssn()</code></th> <td> Generate random US Social Security Number </td> <td></td> <td></td> </tr><tr><th scope="row"><code>gen_rnd_us_phone()</code></th> <td> Generate random US phone number </td> <td></td> <td></td> </tr><tr><th scope="row"><code>mask_inner()</code></th> <td> Mask interior part of string </td> <td></td> <td></td> </tr><tr><th scope="row"><code>mask_outer()</code></th> <td> Mask left and right parts of string </td> <td></td> <td></td> </tr><tr><th scope="row"><code>mask_pan()</code></th> <td> Mask payment card Primary Account Number part of string </td> <td></td> <td></td> </tr><tr><th scope="row"><code>mask_pan_relaxed()</code></th> <td> Mask payment card Primary Account Number part of string </td> <td></td> <td></td> </tr><tr><th scope="row"><code>mask_ssn()</code></th> <td> Mask US Social Security Number </td> <td></td> <td></td> </tr></tbody></table>


#### 8.5.3.4 MySQL Enterprise Data Masking and De-Identification Plugin Function Descriptions

The MySQL Enterprise Data Masking and De-Identification plugin library includes several functions, which may be grouped into these categories:

* Data Masking Plugin Functions
* Random Data Generation Plugin Functions
* Random Data Dictionary-Based Plugin Functions

As of MySQL 8.0.19, these functions support the single-byte `latin1` character set for string arguments and return values. Prior to MySQL 8.0.19, the functions treat string arguments as binary strings (which means they do not distinguish lettercase), and string return values are binary strings. You can see the difference in return value character set as follows:

MySQL 8.0.19 and higher:

```
mysql> SELECT CHARSET(gen_rnd_email());
+--------------------------+
| CHARSET(gen_rnd_email()) |
+--------------------------+
| latin1                   |
+--------------------------+
```

Prior to MySQL 8.0.19:

```
mysql> SELECT CHARSET(gen_rnd_email());
+--------------------------+
| CHARSET(gen_rnd_email()) |
+--------------------------+
| binary                   |
+--------------------------+
```

For any version, if a string return value should be in a different character set, convert it. The following example shows how to convert the result of `gen_rnd_email()` to the `utf8mb4` character set:

```
SET @email = CONVERT(gen_rnd_email() USING utf8mb4);
```

To explicitly produce a binary string (for example, to produce a result like that for MySQL versions prior to 8.0.19), do this:

```
SET @email = CONVERT(gen_rnd_email() USING binary);
```

It may also be necessary to convert string arguments, as illustrated in Using Masked Data for Customer Identification.

If a MySQL Enterprise Data Masking and De-Identification function is invoked from within the **mysql** client, binary string results display using hexadecimal notation, depending on the value of the `--binary-as-hex`. For more information about that option, see Section 6.5.1, “mysql — The MySQL Command-Line Client”.

##### Data Masking Plugin Functions

Each plugin function in this section performs a masking operation on its string argument and returns the masked result.

* [`mask_inner(str, margin1, margin2 [, mask_char])`](data-masking-plugin-functions.html#function_mask-inner-plugin)

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

  ```
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

* [`mask_outer(str, margin1, margin2 [, mask_char])`](data-masking-plugin-functions.html#function_mask-outer-plugin)

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

  ```
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

  ```
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

  ```
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

  + *`str`*: The string to mask. The string must be 11 characters long.

  Return value:

  The masked Social Security number as a string, or an error if the argument is not the correct length.

  Example:

  ```
  mysql> SELECT mask_ssn('909-63-6922'), mask_ssn('abcdefghijk');
  +-------------------------+-------------------------+
  | mask_ssn('909-63-6922') | mask_ssn('abcdefghijk') |
  +-------------------------+-------------------------+
  | XXX-XX-6922             | XXX-XX-hijk             |
  +-------------------------+-------------------------+
  mysql> SELECT mask_ssn('909');
  ERROR 1123 (HY000): Can't initialize function 'mask_ssn'; MASK_SSN: Error:
  String argument width too small
  mysql> SELECT mask_ssn('123456789123456789');
  ERROR 1123 (HY000): Can't initialize function 'mask_ssn'; MASK_SSN: Error:
  String argument width too large
  ```

##### Random Data Generation Plugin Functions

The plugin functions in this section generate random values for different types of data. When possible, generated values have characteristics reserved for demonstration or test values, to avoid having them mistaken for legitimate data. For example, `gen_rnd_us_phone()` returns a US phone number that uses the 555 area code, which is not assigned to phone numbers in actual use. Individual function descriptions describe any exceptions to this principle.

* [`gen_range(lower, upper)`](data-masking-plugin-functions.html#function_gen-range-plugin)

  Generates a random number chosen from a specified range.

  Arguments:

  + *`lower`*: An integer that specifies the lower boundary of the range.

  + *`upper`*: An integer that specifies the upper boundary of the range, which must not be less than the lower boundary.

  Return value:

  A random integer in the range from *`lower`* to *`upper`*, inclusive, or `NULL` if the *`upper`* argument is less than *`lower`*.

  Example:

  ```
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

  ```
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

  ```
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

  Generates a random US Social Security number in `AAA-BB-CCCC` format. The *`AAA`* part is greater than 900 and the *`BB`* part is less than 70, which are characteristics not used for legitimate Social Security numbers.

  Arguments:

  None.

  Return value:

  A random Social Security number as a string.

  Example:

  ```
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

  ```
  mysql> SELECT gen_rnd_us_phone();
  +--------------------+
  | gen_rnd_us_phone() |
  +--------------------+
  | 1-555-682-5423     |
  +--------------------+
  ```

##### Random Data Dictionary-Based Plugin Functions

The plugin functions in this section manipulate dictionaries of terms and perform generation and masking operations based on them. Some of these functions require the `SUPER` privilege.

When a dictionary is loaded, it becomes part of the dictionary registry and is assigned a name to be used by other dictionary functions. Dictionaries are loaded from plain text files containing one term per line. Empty lines are ignored. To be valid, a dictionary file must contain at least one nonempty line.

* [`gen_blacklist(str, dictionary_name, replacement_dictionary_name)`](data-masking-plugin-functions.html#function_gen-blacklist-plugin)

  Replaces a term present in one dictionary with a term from a second dictionary and returns the replacement term. This masks the original term by substitution. This function is deprecated in MySQL 8.0.23; use `gen_blocklist()` instead.

* [`gen_blocklist(str, dictionary_name, replacement_dictionary_name)`](data-masking-plugin-functions.html#function_gen-blocklist-plugin)

  Replaces a term present in one dictionary with a term from a second dictionary and returns the replacement term. This masks the original term by substitution. This function was added in MySQL 8.0.23; use it instead of `gen_blacklist()`.

  Arguments:

  + *`str`*: A string that indicates the term to replace.

  + *`dictionary_name`*: A string that names the dictionary containing the term to replace.

  + *`replacement_dictionary_name`*: A string that names the dictionary from which to choose the replacement term.

  Return value:

  A string randomly chosen from *`replacement_dictionary_name`* as a replacement for *`str`*, or *`str`* if it does not appear in *`dictionary_name`*, or `NULL` if either dictionary name is not in the dictionary registry.

  If the term to replace appears in both dictionaries, it is possible for the return value to be the same term.

  Example:

  ```
  mysql> SELECT gen_blocklist('Berlin', 'DE_Cities', 'US_Cities');
  +---------------------------------------------------+
  | gen_blocklist('Berlin', 'DE_Cities', 'US_Cities') |
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

  ```
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

  ```
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

* [`gen_dictionary_load(dictionary_path, dictionary_name)`](data-masking-plugin-functions.html#function_gen-dictionary-load-plugin)

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

  ```
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
