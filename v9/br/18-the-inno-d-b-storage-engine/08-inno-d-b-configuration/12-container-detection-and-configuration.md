### 17.8.12 Detecção e Configuração de Contêineres

Se instalado em um contêiner, o servidor lê automaticamente os limites de recursos de CPU e memória do contêiner. Os valores das seguintes variáveis de sistema são calculados e definidos com base nesses limites de recursos:

* Os valores dos seguintes são calculados com base no número de CPUs lógicas:

  + `innodb_buffer_pool_instances`
  + `innodb_page_cleaners`
  + `innodb_purge_threads`
  + `innodb_read_io_threads`
  + `innodb_parallel_read_threads`
  + `innodb_redo_log_capacity` (valor definido apenas se `--innodb-dedicated-server` estiver habilitado.)

  + `innodb_log_writer_threads`
* Os valores dos seguintes são calculados com base na memória disponível:

  + `temptable_max_ram`
  + `innodb_buffer_pool_size` (valor definido apenas se `--innodb-dedicated-server` estiver habilitado.)