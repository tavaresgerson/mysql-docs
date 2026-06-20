## 18.8 The FEDERATED Storage Engine

The `FEDERATED` storage engine lets you access data
from a remote MySQL database without using replication or cluster
technology. Querying a local `FEDERATED` table
automatically pulls the data from the remote (federated) tables. No
data is stored on the local tables.

To include the `FEDERATED` storage engine if you
build MySQL from source, invoke **CMake** with the
[`-DWITH_FEDERATED_STORAGE_ENGINE`](source-configuration-options.html#option_cmake_storage_engine_options "Storage Engine Options")
option.

The `FEDERATED` storage engine is not enabled by
default in the running server; to enable
`FEDERATED`, you must start the MySQL server binary
using the `--federated` option.

To examine the source for the `FEDERATED` engine,
look in the `storage/federated` directory of a
MySQL source distribution.