#### 27.7.2.2 JSON Duality Views—Concurrency

DML operations for JSON duality views in MySQL Enterprise Edition support lockless optimistic concurrency control (LOCC).

The use of LOCC safeguards against conflicts and data inconsistencies for concurrent operations. This is especially important for read and write operations that use separate stateless calls, such as REST requests.

Consider the following example:

* A user accesses data in a mobile application with a `REST GET` request, and then later on decides to update some information with a `REST PUT` request.

* If another user updates the underlying data with another `REST PUT` request between the time of the previous `REST GET` and `REST PUT` requests, the second `REST PUT` request will overwrite the data, making it inconsistent.

This situation occurs because the resources cannot be locked down for a non-deteministic time between the two REST requests. More importantly, REST calls are stateless, and there is no guarantee that the calls will use the same connection with the database where the transaction started.

To address this, LOCC checks at the point of update whether the data has changed since it was last read. If the data was changed, the update is rejected, which allows the application to handle the conflict appropriately.

LOCC uses built-in `ETAG()` computation support, and uses `ETAG()` values stored in the `etag` field of the `_metadata` sub-object in the JSON documents. The `etag` field represents a hash of the document's current state excluding (by default) `_metadata`. It serves as a signature that uniquely identifies the object.

Note

`BLOB` types are stored as binary but represented in base64-encoded format when projected as `SELECT` output. This means that the `etag` value can be different when run with the same input as a `BLOB`, and as hand-crafted base64-formatted string.

Concurrency is handled as follows:

1. The user reads data (using `SELECT`), storing it locally.

2. The user modifies the local copy of the data, leaving the generated `etag` value unchanged.

3. Execution of an `UPDATE` statement reconstructs the object (including metadata) using `SELECT` and persists any changes only if the reconstructed state (that is, the result of `ETAG()` on the reconstructed object) matches the state last read.

4. If the `etag` values do not match, MySQL raises an error, which applications can handle by re-reading the data and retrying the operation if desired.

The `etag` value serves as a control value only, and is not stored; it is generated at `SELECT` or `UPDATE` execution time.
