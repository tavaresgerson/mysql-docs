#### 27.3.6.12 MySQL Functions

The following SQL built-in functions can be called directly from
the `mysql` namespace. These are described in
the following list, along with their analogous SQL functions:

* `rand()` (MySQL
  [`RAND()`](mathematical-functions.html#function_rand)): Returns a random
  floating-point value *`v`* in the
  range 0 <= *`v`* < 1.0.

* `sleep(seconds)`
  (MySQL [`SLEEP()`](miscellaneous-functions.html#function_sleep)): Pauses for
  *`seconds`* seconds, then returns 0.

* `uuid()` (MySQL
  [`UUID()`](miscellaneous-functions.html#function_uuid)): Returns a Universal
  Unique Identifier (UUID).

* `isUUID(argument)`
  (MySQL [`IS_UUID()`](miscellaneous-functions.html#function_is-uuid)): Returns 1
  if the *`argument`* is a valid
  string-format UUID, 0 if it is not a valid UUID, and
  `NULL` if the argument is
  `NULL`.