#### 29.12.21.5 Tabela log\_status

A tabela `log_status` fornece informações que permitem que uma ferramenta de backup online copie os arquivos de log necessários sem bloquear esses recursos durante o processo de cópia.

Quando a tabela `log_status` é consultada, o servidor bloqueia o registro e as alterações administrativas relacionadas por um tempo suficiente para preencher a tabela e, em seguida, libera os recursos. A tabela `log_status` informa ao backup online até que ponto ele deve copiar no log binário da fonte e no registro `gtid_executed` e no log de retransmissão para cada canal de replicação. Também fornece informações relevantes para os motores de armazenamento individuais, como o último número de sequência de log (LSN) e o LSN do último ponto de verificação realizado para o motor de armazenamento `InnoDB`.

A tabela `log_status` tem essas colunas:

- `SERVER_UUID`

  O UUID do servidor para esta instância do servidor. Este é o valor único gerado da variável de sistema `server_uuid` de leitura somente.

- `LOCAL`

  As informações de estado da posição de registro da fonte, fornecidas como um único objeto JSON com as seguintes chaves:

  `binary_log_file` :   O nome do arquivo de log binário atual.

  `binary_log_position` : A posição atual do log binário no momento em que a tabela `log_status` foi acessada.

  `gtid_executed` :   O valor atual da variável de servidor global `gtid_executed` no momento em que a tabela `log_status` foi acessada. Esta informação é consistente com as chaves `binary_log_file` e `binary_log_position`.

- `REPLICATION`

  Um array JSON de canais, cada um com as seguintes informações:

  `channel_name` :   O nome do canal de replicação. O nome do canal de replicação padrão é a string vazia (“”).

  `relay_log_file` :   O nome do arquivo de registro atual do relé para o canal de replicação.

  `relay_log_pos` :   A posição atual do log do relé no momento em que a tabela `log_status` foi acessada.

- `STORAGE_ENGINES`

  Informações relevantes de motores de armazenamento individuais, fornecidas como um objeto JSON com uma chave para cada motor de armazenamento aplicável.

A tabela `log_status` não tem índices.

O privilégio `BACKUP_ADMIN` e o privilégio `SELECT` são necessários para acessar a tabela `log_status`.

`TRUNCATE TABLE` não é permitido para a tabela `log_status`.
