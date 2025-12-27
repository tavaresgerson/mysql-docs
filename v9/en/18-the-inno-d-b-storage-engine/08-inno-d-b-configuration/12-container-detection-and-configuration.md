### 17.8.12 Container Detection and Configuration

If installed in a container, the server automatically reads the container's CPU and memory resource limits. The values for the following system variables are calculated and set based on those resource limits:

* The values of the following are calculated based on the number of logical CPUs:

  + `innodb_buffer_pool_instances`
  + `innodb_page_cleaners`
  + `innodb_purge_threads`
  + `innodb_read_io_threads`
  + `innodb_parallel_read_threads`
  + `innodb_redo_log_capacity` (value set only if `--innodb-dedicated-server` is enabled.)

  + `innodb_log_writer_threads`
* The values of the following are calculated based on the available memory:

  + `temptable_max_ram`
  + `innodb_buffer_pool_size` (value set only if `--innodb-dedicated-server` is enabled.)
