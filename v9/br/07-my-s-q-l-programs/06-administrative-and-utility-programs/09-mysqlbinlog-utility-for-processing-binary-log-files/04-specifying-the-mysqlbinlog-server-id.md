#### 6.6.9.4 Especificando o ID do servidor mysqlbinlog

Quando invocado com a opção `--read-from-remote-server`, o **mysqlbinlog** se conecta a um servidor MySQL, especifica um ID de servidor para se identificar e solicita arquivos de log binários do servidor. Você pode usar o **mysqlbinlog** para solicitar arquivos de log de vários modos:

* Especifique um conjunto de arquivos com um nome explícito: Para cada arquivo, o **mysqlbinlog** se conecta e emite um comando `Binlog dump`. O servidor envia o arquivo e se desconecta. Há uma conexão por arquivo.

* Especifique o arquivo inicial e `--to-last-log`: O **mysqlbinlog** se conecta e emite um comando `Binlog dump` para todos os arquivos. O servidor envia todos os arquivos e se desconecta.

* Especifique o arquivo inicial e `--stop-never` (o que implica `--to-last-log`): O **mysqlbinlog** se conecta e emite um comando `Binlog dump` para todos os arquivos. O servidor envia todos os arquivos, mas não se desconecta após enviar o último.

Apenas com `--read-from-remote-server`, o **mysqlbinlog** se conecta usando um ID de servidor de 0, o que indica ao servidor que se desconecte após enviar o último arquivo de log solicitado.

Com `--read-from-remote-server` e `--stop-never`, o **mysqlbinlog** se conecta usando um ID de servidor não nulo, então o servidor não se desconecta após enviar o último arquivo de log. O ID de servidor é 1 por padrão, mas isso pode ser alterado com `--connection-server-id`.

Assim, para os dois primeiros modos de solicitar arquivos, o servidor se desconecta porque o **mysqlbinlog** especifica um ID de servidor de 0. Ele não se desconecta se `--stop-never` for fornecido porque o **mysqlbinlog** especifica um ID de servidor não nulo.