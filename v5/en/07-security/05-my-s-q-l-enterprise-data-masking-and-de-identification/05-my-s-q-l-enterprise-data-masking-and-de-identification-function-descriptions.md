### 6.5.5 MySQL Enterprise Data Masking and De-Identification Function Descriptions

The MySQL Enterprise Data Masking and De-Identification plugin library includes several functions, which may be grouped into these categories:

* [Data Masking Functions](data-masking-functions.html#data-masking-masking-functions "Data Masking Functions")
* [Random Data Generation Functions](data-masking-functions.html#data-masking-generation-functions "Random Data Generation Functions")
* [Random Data Dictionary-Based Functions](data-masking-functions.html#data-masking-dictionary-functions "Random Data Dictionary-Based Functions")

These functions treat string arguments as binary strings (which means they do not distinguish lettercase), and string return values are binary strings. If a string return value should be in a different character set, convert it. The following example shows how to convert the result of [`gen_rnd_email()`](data-masking-functions.html#function_gen-rnd-email) to the `utf8mb4` character set:

```sql
SET @email = CONVERT(gen_rnd_email() USING utf8mb4);
```

It may also be necessary to convert string arguments, as illustrated in [Using Masked Data for Customer Identification](data-masking-usage.html#data-masking-usage-customer-identification "Using Masked Data for Customer Identification").

If a MySQL Enterprise Data Masking and De-Identification function is invoked from within the [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client, binary string results display using hexadecimal notation, depending on the value of the [`--binary-as-hex`](mysql-command-options.html#option_mysql_binary-as-hex). For more information about that option, see [Section 4.5.1, “mysql — The MySQL Command-Line Client”](mysql.html "4.5.1 mysql — The MySQL Command-Line Client").

#### Data Masking Functions

Each function in this section performs a masking operation on its string argument and returns the masked result.

* [`mask_inner(str, margin1, margin2 [, mask_char])`](data-masking-functions.html#function_mask-inner)

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

* [`mask_outer(str, margin1, margin2 [, mask_char])`](data-masking-functions.html#function_mask-outer)

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

* [`mask_pan(str)`](data-masking-functions.html#function_mask-pan)

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

* [`mask_pan_relaxed(str)`](data-masking-functions.html#function_mask-pan-relaxed)

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

* [`mask_ssn(str)`](data-masking-functions.html#function_mask-ssn)

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

The functions in this section generate random values for different types of data. When possible, generated values have characteristics reserved for demonstration or test values, to avoid having them mistaken for legitimate data. For example, [`gen_rnd_us_phone()`](data-masking-functions.html#function_gen-rnd-us-phone) returns a US phone number that uses the 555 area code, which is not assigned to phone numbers in actual use. Individual function descriptions describe any exceptions to this principle.

* [`gen_range(lower, upper)`](data-masking-functions.html#function_gen-range)

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

* [`gen_rnd_email()`](data-masking-functions.html#function_gen-rnd-email)

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

* [`gen_rnd_pan([size])`](data-masking-functions.html#function_gen-rnd-pan)

  Generates a random payment card Primary Account Number. The number passes the Luhn check (an algorithm that performs a checksum verification against a check digit).

  Warning

  Values returned from [`gen_rnd_pan()`](data-masking-functions.html#function_gen-rnd-pan) should be used only for test purposes, and are not suitable for publication. There is no way to guarantee that a given return value is not assigned to a legitimate payment account. Should it be necessary to publish a [`gen_rnd_pan()`](data-masking-functions.html#function_gen-rnd-pan) result, consider masking it with [`mask_pan()`](data-masking-functions.html#function_mask-pan) or [`mask_pan_relaxed()`](data-masking-functions.html#function_mask-pan-relaxed).

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

* [`gen_rnd_ssn()`](data-masking-functions.html#function_gen-rnd-ssn)

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

* [`gen_rnd_us_phone()`](data-masking-functions.html#function_gen-rnd-us-phone)

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

The functions in this section manipulate dictionaries of terms and perform generation and masking operations based on them. Some of these functions require the [`SUPER`](privileges-provided.html#priv_super) privilege.

When a dictionary is loaded, it becomes part of the dictionary registry and is assigned a name to be used by other dictionary functions. Dictionaries are loaded from plain text files containing one term per line. Empty lines are ignored. To be valid, a dictionary file must contain at least one nonempty line.

* [`gen_blacklist(str, dictionary_name, replacement_dictionary_name)`](data-masking-functions.html#function_gen-blacklist)

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

* [`gen_dictionary(dictionary_name)`](data-masking-functions.html#function_gen-dictionary)

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

* [`gen_dictionary_drop(dictionary_name)`](data-masking-functions.html#function_gen-dictionary-drop)

  Removes a dictionary from the dictionary registry.

  This function requires the [`SUPER`](privileges-provided.html#priv_super) privilege.

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

* [`gen_dictionary_load(dictionary_path, dictionary_name)`](data-masking-functions.html#function_gen-dictionary-load)

  Loads a file into the dictionary registry and assigns the dictionary a name to be used with other functions that require a dictionary name argument.

  This function requires the [`SUPER`](privileges-provided.html#priv_super) privilege.

  Important

  Dictionaries are not persistent. Any dictionary used by applications must be loaded for each server startup.

  Once loaded into the registry, a dictionary is used as is, even if the underlying dictionary file changes. To reload a dictionary, first drop it with [`gen_dictionary_drop()`](data-masking-functions.html#function_gen-dictionary-drop), then load it again with [`gen_dictionary_load()`](data-masking-functions.html#function_gen-dictionary-load).

  Arguments:

  + *`dictionary_path`*: A string that specifies the path name of the dictionary file.

  + *`dictionary_name`*: A string that provides a name for the dictionary.

  Return value:

  A string that indicates whether the load operation succeeded. `Dictionary load success` indicates success. `Dictionary load error` indicates failure. Dictionary load failure can occur for several reasons, including:

  + A dictionary with the given name is already loaded.
  + The dictionary file is not found.
  + The dictionary file contains no terms.
  + The [`secure_file_priv`](server-system-variables.html#sysvar_secure_file_priv) system variable is set and the dictionary file is not located in the directory named by the variable.

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
