#### 29.12.19.1 A tabela clone\_status

Nota

A tabela Schema de Desempenho descrita aqui está disponível a partir do MySQL 8.0.17.

A tabela `clone_status` mostra o status da operação de clonagem atual ou da última operação executada. A tabela contém apenas uma linha de dados ou está vazia.

A tabela `clone_status` tem essas colunas:

- `ID`

  Um identificador único de operação de clonagem na instância atual do servidor MySQL.

- `PID`

  Lista de ID do processo da sessão que está executando a operação de clonagem.

- `STATE`

  Estado atual da operação de clonagem. Os valores incluem `Not Started`, `In Progress`, `Completed` e `Failed`.

- `BEGIN_TIME`

  Um marcador de tempo no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'` que mostra quando a operação de clonagem começou.

- `END_TIME`

  Um timestamp no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'` que mostra quando a operação de clonagem terminou. Representa NULL se a operação não tiver terminado.

- `SOURCE`

  O endereço do servidor MySQL do doador no formato '`HOST:PORT`'. A coluna exibe '`LOCAL INSTANCE`' para uma operação de clonagem local.

- `DESTINATION`

  O diretório que está sendo clonado para.

- `ERROR_NO`

  O número de erro relatado para uma operação de clonagem falha.

- `ERROR_MESSAGE`

  A string de mensagem de erro para uma operação de clonagem falha.

- `BINLOG_FILE`

  O nome do arquivo de log binário até o qual os dados são clonados.

- `BINLOG_POSITION`

  O deslocamento do arquivo de log binário até o qual os dados são clonados.

- `GTID_EXECUTED`

  O valor GTID para a última transação clonada.

A tabela `clone_status` é de leitura somente. DDL, incluindo `TRUNCATE TABLE`, não é permitido.
