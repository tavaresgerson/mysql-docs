#### 29.12.11.1 A tabela `binary_log_transaction_compression_stats`

Esta tabela mostra informações estatísticas sobre os payloads de transações escritos no log binário e no log de retransmissão, e pode ser usada para calcular os efeitos da ativação da compressão de transações no log binário. Para obter informações sobre a compressão de transações no log binário, consulte a Seção 7.4.4.5, “Compressão de Transações no Log Binário”.

A tabela `binary_log_transaction_compression_stats` é preenchida apenas quando a instância do servidor tem um log binário e a variável de sistema `binlog_transaction_compression` está definida como `ON`. As estatísticas cobrem todas as transações escritas no log binário e no log de retransmissão desde o momento em que o servidor foi iniciado ou a tabela foi truncada. As transações comprimidas são agrupadas pelo algoritmo de compressão usado, e as transações não comprimidas são agrupadas junto com o algoritmo de compressão declarado como `NONE`, para que o índice de compressão possa ser calculado.

A tabela `binary_log_transaction_compression_stats` tem as seguintes colunas:

* `LOG_TYPE`

  Se essas transações foram escritas no log binário ou no log de retransmissão.

* `COMPRESSION_TYPE`

  O algoritmo de compressão usado para comprimir os payloads das transações. `NONE` significa que os payloads dessas transações não foram comprimidos, o que é correto em várias situações (consulte a Seção 7.4.4.5, “Compressão de Transações no Log Binário”).

* `TRANSACTION_COUNTER`

  O número de transações escritas neste tipo de log com este tipo de compressão.

* `COMPRESSED_BYTES`

  O número total de bytes que foram comprimidos e então escritos neste tipo de log com este tipo de compressão, contado após a compressão.

* `UNCOMPRESSED_BYTES`

  O número total de bytes antes da compressão para este tipo de log e este tipo de compressão.

* `COMPRESSION_PERCENTAGE`

A relação de compressão para este tipo de log e este tipo de compressão, expressa como uma porcentagem.

* `FIRST_TRANSACTION_ID`

  O ID da primeira transação que foi escrita neste tipo de log com este tipo de compressão.

* `FIRST_TRANSACTION_COMPRESSED_BYTES`

  O número total de bytes que foram comprimidos e depois escritos no log para a primeira transação, contado após a compressão.

* `FIRST_TRANSACTION_UNCOMPRESSED_BYTES`

  O número total de bytes antes da compressão para a primeira transação.

* `FIRST_TRANSACTION_TIMESTAMP`

  O timestamp quando a primeira transação foi escrita no log.

* `LAST_TRANSACTION_ID`

  O ID da transação mais recente que foi escrita neste tipo de log com este tipo de compressão.

* `LAST_TRANSACTION_COMPRESSED_BYTES`

  O número total de bytes que foram comprimidos e depois escritos no log para a transação mais recente, contado após a compressão.

* `LAST_TRANSACTION_UNCOMPRESSED_BYTES`

  O número total de bytes antes da compressão para a transação mais recente.

* `LAST_TRANSACTION_TIMESTAMP`

  O timestamp quando a transação mais recente foi escrita no log.

A tabela `binary_log_transaction_compression_stats` não tem índices.

O `TRUNCATE TABLE` é permitido para a tabela `binary_log_transaction_compression_stats`.