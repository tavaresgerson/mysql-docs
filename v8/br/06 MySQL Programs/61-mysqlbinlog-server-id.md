#### 6.6.9.4 Especificar o ID do servidor mysqlbinlog

Quando invocado com a opção `--read-from-remote-server`, **mysqlbinlog** se conecta a um servidor MySQL, especifica uma ID de servidor para se identificar e solicita arquivos de log binários do servidor. Você pode usar **mysqlbinlog** para solicitar arquivos de log de um servidor de várias maneiras:

- Especifique um conjunto de arquivos explicitamente nomeado: Para cada arquivo, **mysqlbinlog** se conecta e emite um comando `Binlog dump`. O servidor envia o arquivo e desconecta. Há uma conexão por arquivo.
- Especifique o arquivo inicial e `--to-last-log`: **mysqlbinlog** conecta e emite um comando `Binlog dump` para todos os arquivos. O servidor envia todos os arquivos e desconecta.
- Especifique o arquivo de início e `--stop-never` (que implica `--to-last-log`): **mysqlbinlog** conecta e emite um comando `Binlog dump` para todos os arquivos. O servidor envia todos os arquivos, mas não desconecta após o envio do último.

Apenas com `--read-from-remote-server`, **mysqlbinlog** se conecta usando um ID de servidor de 0, que diz ao servidor para desconectar após o envio do último arquivo de registro solicitado.

Com `--read-from-remote-server` e `--stop-never`, o **mysqlbinlog** se conecta usando um ID de servidor diferente de zero, para que o servidor não se desconecte após o envio do último arquivo de registro. O ID do servidor é 1 por padrão, mas isso pode ser alterado com `--connection-server-id`.

Assim, para as duas primeiras maneiras de solicitar arquivos, o servidor se desconecta porque **mysqlbinlog** especifica uma ID de servidor de 0.
