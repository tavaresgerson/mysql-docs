#### 8.5.2.4 MySQL Enterprise Data Masking and De-Identification Component Function Descriptions

The MySQL Enterprise Data Masking and De-Identification components includes several functions, which may be grouped into these categories:

* Data Masking Component Functions
* Random Data Generation Component Functions
* Dictionary Masking Administration Component Functions
* Dictionary Generating Component Functions

##### Data Masking Component Functions

Each component function in this section performs a masking operation on its string argument and returns the masked result.

* `mask_canada_sin(str [, mask_char])`

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

* `mask_iban(str [, mask_char])`

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

* `mask_inner(str, margin1, margin2 [, mask_char])`

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

* `mask_outer(str, margin1, margin2 [, mask_char])`

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

* `mask_pan(str [, mask_char])`

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

* `mask_ssn(str [, mask_char])`

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

* `mask_uk_nin(str [, mask_char])`

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

* `mask_uuid(str [, mask_char])`

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

* `gen_range(lower, upper)`

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

* `gen_rnd_email(name_size, surname_size, domain)`

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

* `gen_rnd_iban([country, size])`

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

* `masking_dictionary_term_add(dictionary_name, term_name)`

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

* `masking_dictionary_term_remove(dictionary_name, term_name)`

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

* `gen_blocklist(str, from_dictionary_name, to_dictionary_name)`

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
