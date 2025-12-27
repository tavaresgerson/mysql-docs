#### 21.6.15.21 The ndbinfo error\_messages Table

The `error_messages` table provides information about

The `error_messages` table contains the following columns:

* `error_code`

  Numeric error code

* `error_description`

  Description of error

* `error_status`

  Error status code

* `error_classification`

  Error classification code

##### Notes

`error_code` is a numeric NDB error code. This is the same error code that can be supplied to [**ndb\_perror**](mysql-cluster-programs-ndb-perror.html "21.5.17 ndb_perror — Obtain NDB Error Message Information") or [**perror**](perror.html "4.8.2 perror — Display MySQL Error Message Information") [`--ndb`](perror.html#option_perror_ndb).

`error_description` provides a basic description of the condition causing the error.

The `error_status` column provides status information relating to the error. Possible values for this column are listed here:

* `No error`
* `Illegal connect string`
* `Illegal server handle`
* `Illegal reply from server`
* `Illegal number of nodes`
* `Illegal node status`
* `Out of memory`
* `Management server not connected`
* `Could not connect to socket`
* `Start failed`
* `Stop failed`
* `Restart failed`
* `Could not start backup`
* `Could not abort backup`
* `Could not enter single user mode`
* `Could not exit single user mode`
* `Failed to complete configuration change`
* `Failed to get configuration`
* `Usage error`
* `Success`
* `Permanent error`
* `Temporary error`
* `Unknown result`
* `Temporary error, restart node`
* `Permanent error, external action needed`
* `Ndbd file system error, restart node initial`

* `Unknown`

The error\_classification column shows the error classification. See [NDB Error Classifications](/doc/ndbapi/en/ndb-error-classifications.html), for information about classification codes and their meanings.

The `error_messages` table was added in NDB 7.6.
