#### 29.12.22.6 A tabela `log_status`

A tabela `log_status` fornece informações que permitem que uma ferramenta de backup online copie os arquivos de log necessários sem bloquear esses recursos durante o processo de cópia.

Quando a tabela `log_status` é consultada, o servidor bloqueia o registro de log e alterações administrativas relacionadas por um tempo suficiente para preencher a tabela e, em seguida, libera os recursos. A tabela `log_status` informa ao backup online até que ponto ele deve copiar no log binário da fonte e no registro `gtid_executed`, além do log de retransmissão para cada canal de replicação. Ela também fornece informações relevantes para os motores de armazenamento individuais, como o último número de sequência de log (LSN) e o LSN do último ponto de verificação realizado para o motor de armazenamento `InnoDB`.

A tabela `log_status` tem as seguintes colunas:

* `SERVER_UUID`

  O UUID do servidor para essa instância do servidor. Esse é o valor gerado de forma única da variável de sistema de leitura `server_uuid`.

* `LOCAL`

  As informações de estado da posição de log da fonte, fornecidas como um único objeto JSON com as seguintes chaves:

  `binary_log_file` :   O nome do arquivo de log binário atual.

  `binary_log_position` :   A posição atual do log binário no momento em que a tabela `log_status` foi acessada.

  `gtid_executed` :   O valor atual da variável global do servidor `gtid_executed` no momento em que a tabela `log_status` foi acessada. Essas informações são consistentes com as chaves `binary_log_file` e `binary_log_position`.

* `REPLICATION`

  Um array JSON de canais, cada um com as seguintes informações:

  `channel_name` :   O nome do canal de replicação. O nome padrão do canal de replicação é a string vazia (“”).

  `relay_log_file` :   O nome do arquivo de log de retransmissão atual para o canal de replicação.

`relay_log_pos`: A posição atual do log do relé no momento em que a tabela `log_status` foi acessada.

* `STORAGE_ENGINES`: Informações relevantes de motores de armazenamento individuais, fornecidas como um objeto JSON com uma chave para cada motor de armazenamento aplicável.

A tabela `log_status` não tem índices.

O privilégio `BACKUP_ADMIN`, bem como o privilégio `SELECT`, é necessário para acessar a tabela `log_status`.

O `TRUNCATE TABLE` não é permitido para a tabela `log_status`.