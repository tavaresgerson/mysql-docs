#### 4.6.7.4 Especificar o ID do servidor mysqlbinlog

Quando invocado com a opção `--read-from-remote-server`, o **mysqlbinlog** se conecta a um servidor MySQL, especifica um ID de servidor para se identificar e solicita arquivos de log binários do servidor. Você pode usar o **mysqlbinlog** para solicitar arquivos de log de vários modos:

- Especifique um conjunto de arquivos com um nome explícito: Para cada arquivo, o **mysqlbinlog** se conecta e emite um comando de `Dump de Binlog`. O servidor envia o arquivo e se desconecta. Há uma conexão por arquivo.

- Especifique o arquivo de início e `--to-last-log`: o **mysqlbinlog** se conecta e emite um comando de `Dump de Binlog` para todos os arquivos. O servidor envia todos os arquivos e se desconecta.

- Especifique o arquivo de início e `--stop-never` (o que implica `--to-last-log`): o **mysqlbinlog** se conecta e emite um comando de `Dump de Binlog` para todos os arquivos. O servidor envia todos os arquivos, mas não se desconecta após enviar o último.

Com apenas `--read-from-remote-server`, o **mysqlbinlog** se conecta usando um ID de servidor de 0, o que indica ao servidor que ele deve se desconectar após enviar o último arquivo de log solicitado.

Com `--read-from-remote-server` e `--stop-never`, o **mysqlbinlog** se conecta usando um ID de servidor não nulo, para que o servidor não se desconecte após enviar o último arquivo de log. O ID de servidor é 65535 por padrão, mas isso pode ser alterado com `--stop-never-slave-server-id`.

Assim, para os dois primeiros métodos de solicitação de arquivos, o servidor se desconecta porque o **mysqlbinlog** especifica um ID de servidor de 0. Ele não se desconecta se o `--stop-never` for fornecido porque o **mysqlbinlog** especifica um ID de servidor não nulo.
