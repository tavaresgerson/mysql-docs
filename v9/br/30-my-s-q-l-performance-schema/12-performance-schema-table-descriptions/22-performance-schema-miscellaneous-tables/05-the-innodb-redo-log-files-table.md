#### 29.12.22.5 Tabela `innodb_redo_log_files`

A tabela `innodb_redo_log_files` contém uma linha para cada arquivo de log de correção `InnoDB` ativo.

A tabela `innodb_redo_log_files` tem as seguintes colunas:

* `FILE_ID`

  O ID do arquivo de log de correção. O valor corresponde ao número do arquivo de log de correção.

* `FILE_NAME`

  O caminho e o nome do arquivo de log de correção.

* `START_LSN`

  O número de sequência de log do primeiro bloco no arquivo de log de correção.

* `END_LSN`

  O número de sequência de log após o último bloco no arquivo de log de correção.

* `SIZE_IN_BYTES`

  O tamanho dos dados do log de correção no arquivo, em bytes. O tamanho dos dados é medido do `END_LSN` até o início `>START_LSN`. O tamanho do arquivo de log de correção no disco é ligeiramente maior devido ao cabeçalho do arquivo (2048 bytes), que não está incluído no valor reportado por esta coluna.

* `IS_FULL`

  Se o arquivo de log de correção está completo. Um valor de 0 indica que há espaço livre no arquivo. Um valor de 1 indica que o arquivo está completo.

* `CONSUMER_LEVEL`

  Reservado para uso futuro.