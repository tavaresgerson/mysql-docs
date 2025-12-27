#### 29.12.19.1 A tabela clone\_status

A tabela `clone_status` mostra apenas o status da operação de clonagem atual ou da última operação executada. A tabela contém apenas uma linha de dados ou está vazia.

A tabela `clone_status` tem as seguintes colunas:

* `ID`

  Um identificador único da operação de clonagem na instância atual do servidor MySQL.

* `PID`

  O ID da lista de processos da sessão que está executando a operação de clonagem.

* `STATE`

  O estado atual da operação de clonagem. Os valores incluem `Não iniciado`, `Em progresso`, `Concluído` e `Falha`.

* `BEGIN_TIME`

  Um timestamp no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'` que mostra quando a operação de clonagem começou.

* `END_TIME`

  Um timestamp no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'` que mostra quando a operação de clonagem terminou. Retorna NULL se a operação não tiver terminado.

* `SOURCE`

  O endereço do servidor MySQL doador no formato `'`HOST:PORT'`. A coluna exibe ``INSTÂNCIA LOCAL`` para uma operação de clonagem local.

* `DESTINATION`

  O diretório ao qual está sendo clonado.

* `ERROR_NO`

  O número de erro relatado para uma operação de clonagem falha.

* `ERROR_MESSAGE`

  A string de mensagem de erro para uma operação de clonagem falha.

* `BINLOG_FILE`

  O nome do arquivo de log binário até o qual os dados estão sendo clonados.

* `BINLOG_POSITION`

  O deslocamento do arquivo de log binário até o qual os dados estão sendo clonados.

* `GTID_EXECUTED`

  O valor do GTID para a última transação clonada.

A tabela `clone_status` é de leitura somente. DDL, incluindo `TRUNCATE TABLE`, não é permitido.