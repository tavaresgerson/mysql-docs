#### 30.4.3.15 As vistas latest\_file\_io e x$latest\_file\_io

Esses pontos de vista resumem a atividade de E/S de arquivos, agrupados por arquivo e thread. Por padrão, as linhas são ordenadas com a I/O mais recente em primeiro lugar.

As visualizações `latest_file_io` e `x$latest_file_io` possuem essas colunas:

- `thread`

  Para os threads de primeiro plano, a conta associada ao thread (e o número de porta para conexões TCP/IP). Para os threads de segundo plano, o nome do thread e o ID do thread

- `file`

  O nome do caminho do arquivo.

- `latency`

  O tempo de espera do evento de E/S de arquivo.

- `operation`

  O tipo de operação.

- `requested`

  O número de bytes de dados solicitados para o evento de E/S de arquivo.
