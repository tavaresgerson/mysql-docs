#### 27.3.6.8 Warning Object

`Warning` represents a warning raised by statement execution, and has the following properties:

* `code`: MySQL error code (integer).
* `level`: Warning level. Can be any one of 1 (`NOTE`), 2 (`WARNING`), or 3 (`ERROR`).

* `message`: Text of the warning message; a string.

You can also employ the JavaScript `Error` object, such as obtained from a try-catch block. See Error Handling, for more information.
