#### 4.6.7.4 Especificando o Server ID do mysqlbinlog

Quando invocado com a opção `--read-from-remote-server`, o **mysqlbinlog** se conecta a um servidor MySQL, especifica um Server ID para se identificar e solicita arquivos de log binário do servidor. Você pode usar o **mysqlbinlog** para solicitar arquivos de log de um servidor de várias maneiras:

*   Especificar um conjunto de arquivos nomeados explicitamente: Para cada arquivo, o **mysqlbinlog** se conecta e emite um comando `Binlog dump`. O servidor envia o arquivo e se desconecta. Há uma conexão por arquivo.

*   Especificar o arquivo inicial e `--to-last-log`: O **mysqlbinlog** se conecta e emite um comando `Binlog dump` para todos os arquivos. O servidor envia todos os arquivos e se desconecta.

*   Especificar o arquivo inicial e `--stop-never` (o que implica `--to-last-log`): O **mysqlbinlog** se conecta e emite um comando `Binlog dump` para todos os arquivos. O servidor envia todos os arquivos, mas não se desconecta após enviar o último.

Apenas com `--read-from-remote-server`, o **mysqlbinlog** se conecta usando um Server ID de 0, o que instrui o servidor a se desconectar após enviar o último arquivo de log solicitado.

Com `--read-from-remote-server` e `--stop-never`, o **mysqlbinlog** se conecta usando um Server ID diferente de zero, para que o servidor não se desconecte após enviar o último arquivo de log. O Server ID é 65535 por padrão, mas isso pode ser alterado com `--stop-never-slave-server-id`.

Portanto, para as duas primeiras formas de solicitar arquivos, o servidor se desconecta porque o **mysqlbinlog** especifica um Server ID de 0. Ele não se desconecta se `--stop-never` for fornecido, pois o **mysqlbinlog** especifica um Server ID diferente de zero.