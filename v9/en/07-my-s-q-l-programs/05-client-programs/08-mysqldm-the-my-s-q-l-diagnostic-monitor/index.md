### 6.5.8 mysqldm — The MySQL Diagnostic Monitor

6.5.8.1 Options

6.5.8.2 Diagnostic Queries

The diagnostics monitor **mysqldm** enables you to collect diagnostic data on your MySQL server. It runs a series of queries and generates JSON files containing the results of those queries.

Two sets of queries are run. The first set of queries is run only once. The second set of queries are run iteratively. The iterative queries are run ten times, by default. The number of iterations is configurable, as is the delay between iterations.

Important

**mysqldm** is delivered with MySQL Enterprise Edition, only.

Invoke **mysqldm** like this:

```
mysqldm [options] [mysqldm-options]
```

For example:

```
$> mysqldm -u root -h localhost -p --iterations=5 --delay=20 --output-dir=mysqldm
```

This example connects to a local server, runs five iterations of diagnostic queries, with a delay of 20 seconds between iterations, and outputs the results to the `mysqldm` directory in the same location as the command was run.

The diagnostic report is generated as a zip file to either the local directory or a specified path.
