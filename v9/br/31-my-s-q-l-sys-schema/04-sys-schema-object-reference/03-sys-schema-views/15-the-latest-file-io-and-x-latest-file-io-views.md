#### 30.4.3.15 As vistas `latest_file_io` e `x$latest_file_io`

Essas vistas resumem a atividade de E/S de arquivos, agrupadas por arquivo e thread. Por padrão, as linhas são ordenadas com o I/O mais recente em primeiro lugar.

As vistas `latest_file_io` e `x$latest_file_io` têm essas colunas:

* `thread`

  Para threads em primeiro plano, o nome da conta associada ao thread (e o número de porta para conexões TCP/IP). Para threads em segundo plano, o nome do thread e o ID do thread

* `file`

  O nome do caminho do arquivo.

* `latency`

  O tempo de espera do evento de E/S de arquivo.

* `operation`

  O tipo de operação.

* `requested`

  O número de bytes de dados solicitados para o evento de E/S de arquivo.