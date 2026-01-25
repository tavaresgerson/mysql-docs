#### 26.4.3.15 As Views latest_file_io e x$latest_file_io

Essas views resumem a atividade de I/O de arquivos, agrupada por arquivo e Thread. Por padrão, as linhas são ordenadas com o I/O mais recente primeiro.

As views `latest_file_io` e `x$latest_file_io` possuem as seguintes colunas:

* `thread`

  Para Threads em primeiro plano (foreground), a conta associada ao Thread (e número da porta para conexões TCP/IP). Para Threads em segundo plano (background), o nome e o ID do Thread.

* `file`

  O nome do caminho do arquivo (file path name).

* `latency`

  O tempo de espera (wait time) do evento de I/O de arquivo.

* `operation`

  O tipo de operação.

* `requested`

  O número de bytes de dados solicitados para o evento de I/O de arquivo.