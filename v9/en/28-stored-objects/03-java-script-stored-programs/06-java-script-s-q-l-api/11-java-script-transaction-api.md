#### 27.3.6.11 JavaScript Transaction API

MLE supports a JavaScript MySQL transaction API which mimics the actions of most MySQL transactional SQL statements. All of the functions listed here, along with their descriptions and SQL equivalents, are methods of the `Session` object:

* `commit()`: Commit the ongoing transaction.

  Equivalent to `COMMIT`.

* `releaseSavepoint()`: Release a given savepoint from an ongoing transaction. Throw an error if the savepoint name is empty.

  Equivalent to `RELEASE SAVEPOINT`.

* `rollback()`: Roll back the ongoing transaction.

  Equivalent to `ROLLBACK`.

* `rollbackTo()`: Go back to an existing savepoint. Throw an error if the savepoint name is empty.

  Equivalent to `ROLLBACK TO SAVEPOINT`.

* `setSavepoint()`: Create a new savepoint with the given name (and return it). If no savepoint name is provided, one is generated.

  Equivalent to `SAVEPOINT`.

* `startTransaction()`: Begin a new transaction.

  Equivalent to `START TRANSACTION`.

* `autocommit()`: Get or set the value of the `autocommit` system variable: If `session.autocommit()` is called without a value, it returns the current value of `autocommit`; otherwise, it sets the value of `autocommit`.

  Equivalent to `SET AUTOCOMMIT`.
