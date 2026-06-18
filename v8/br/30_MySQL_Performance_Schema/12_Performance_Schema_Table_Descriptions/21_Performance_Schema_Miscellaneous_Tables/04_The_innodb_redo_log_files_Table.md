#### 29.12.21.4 Tabela innodb\_redo\_log\_files

A tabela `innodb_redo_log_files` contém uma linha para cada arquivo de registro de reverso `InnoDB` ativo. Esta tabela foi introduzida no MySQL 8.0.30.

A tabela `innodb_redo_log_files` tem as seguintes colunas:

- `FILE_ID`

  O ID do arquivo de registro de reversão. O valor corresponde ao número do arquivo de registro de reversão.

- `FILE_NAME`

  O caminho e o nome do arquivo do log de refazer.

- `START_LSN`

  O número de sequência do log do primeiro bloco no arquivo de log de recuperação.

- `END_LSN`

  O número de sequência do log após o último bloco no arquivo do log de recuperação.

- `SIZE_IN_BYTES`

  O tamanho dos dados do log de retificação no arquivo, em bytes. O tamanho dos dados é medido a partir do `END_LSN` até o início do `>START_LSN`. O tamanho do arquivo de log de retificação no disco é ligeiramente maior devido ao cabeçalho do arquivo (2048 bytes), que não está incluído no valor reportado por esta coluna.

- `IS_FULL`

  Se o arquivo de log de refazer está cheio. Um valor de 0 indica que há espaço livre no arquivo. Um valor de 1 indica que o arquivo está cheio.

- `CONSUMER_LEVEL`

  Reservado para uso futuro.
