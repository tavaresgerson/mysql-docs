### 8.5.2 MySQL Enterprise Data Masking and De-Identification Components

8.5.2.1 MySQL Enterprise Data Masking and De-Identification Component Installation

8.5.2.2 Using MySQL Enterprise Data Masking and De-Identification Components

8.5.2.3 MySQL Enterprise Data Masking and De-Identification Component Function Reference

8.5.2.4 MySQL Enterprise Data Masking and De-Identification Component Function Descriptions

MySQL Enterprise Data Masking and De-Identification implements these elements:

* A table in the `mysql` system database for persistent storage of dictionaries and terms.

* A component named `component_masking` that implements masking functionality and exposes it as service interface for developers.

  Developers who wish to incorporate the same service functions used by `component_masking` should consult the `internal\components\masking\component_masking.h` file in a MySQL source distribution or https://dev.mysql.com/doc/dev/mysql-server/latest.

* A component named `component_masking_functions` that provides loadable functions.

  The set of loadable functions enables an SQL-level API for performing masking and de-identification operations. Some of the functions require the `MASKING_DICTIONARIES_ADMIN` dynamic privilege.
