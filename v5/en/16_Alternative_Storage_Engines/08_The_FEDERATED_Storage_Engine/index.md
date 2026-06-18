## 15.8 The FEDERATED Storage Engine

[15.8.1 FEDERATED Storage Engine Overview](federated-description.html)

[15.8.2 How to Create FEDERATED Tables](federated-create.html)

[15.8.3 FEDERATED Storage Engine Notes and Tips](federated-usagenotes.html)

[15.8.4 FEDERATED Storage Engine Resources](federated-storage-engine-resources.html)

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