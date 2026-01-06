### 27.6.2 Restrições ao usar o servidor MySQL integrado

O servidor integrado tem as seguintes limitações:

- Nenhuma função carregável.

- Nenhum traço de pilha no core dump.

- Você não pode configurá-lo como uma fonte ou uma réplica (sem replicação).

- Conjunto de resultados muito grande pode não ser utilizável em sistemas com memória baixa.

- Você não pode se conectar a um servidor integrado a partir de um processo externo com soquetes ou TCP/IP. No entanto, você pode se conectar a uma aplicação intermediária, que, por sua vez, pode se conectar a um servidor integrado em nome de um cliente remoto ou de um processo externo.

- O `libmysqld` não suporta conexões criptografadas. Isso implica que, se um aplicativo vinculado ao `libmysqld` estabelecer uma conexão com um servidor remoto, a conexão não poderá ser criptografada.

- O `InnoDB` não é reentrante no servidor integrado e não pode ser usado para múltiplas conexões, seja sucessivamente ou simultaneamente.

- O Agendamento de Eventos não está disponível. Por isso, a variável de sistema `event_scheduler` está desativada.

- O Schema de Desempenho não está disponível.

- O servidor integrado não pode compartilhar o mesmo diretório `secure_file_priv` com outro servidor. A partir do MySQL 5.7.8, o valor padrão para este diretório pode ser definido no momento da construção com a opção **CMake** `INSTALL_SECURE_FILE_PRIV_EMBEDDEDDIR`.

Algumas dessas limitações podem ser alteradas editando o arquivo de inclusão `mysql_embed.h` e recompilando o MySQL.
