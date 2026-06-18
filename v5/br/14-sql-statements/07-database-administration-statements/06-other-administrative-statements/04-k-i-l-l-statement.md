#### 13.7.6.4 Declaração KILL

```sql
KILL [CONNECTION | QUERY] processlist_id
```

Cada conexão com **mysqld** é executada em um Thread separado. Você pode encerrar (kill) um Thread com a declaração `KILL processlist_id`.

Os identificadores de `processlist` de Thread podem ser determinados a partir da coluna `ID` da tabela `INFORMATION_SCHEMA` `PROCESSLIST`, da coluna `Id` da saída de `SHOW PROCESSLIST`, e da coluna `PROCESSLIST_ID` da tabela `threads` do Performance Schema. O valor para o Thread atual é retornado pela função `CONNECTION_ID()`.

O `KILL` permite um modificador opcional `CONNECTION` ou `QUERY`:

* `KILL CONNECTION` é o mesmo que `KILL` sem modificador: Ele encerra a conexão associada ao *`processlist_id`* fornecido, após encerrar qualquer statement que a conexão esteja executando.

* `KILL QUERY` encerra o statement que a conexão está executando no momento, mas mantém a própria conexão intacta.

A capacidade de visualizar quais Threads estão disponíveis para serem encerrados (killed) depende do privilégio `PROCESS`:

* Sem `PROCESS`, você pode ver apenas seus próprios Threads.

* Com `PROCESS`, você pode ver todos os Threads.

A capacidade de encerrar (kill) Threads e statements depende do privilégio `SUPER`:

* Sem `SUPER`, você pode encerrar apenas seus próprios Threads e statements.

* Com `SUPER`, você pode encerrar todos os Threads e statements.

Você também pode usar os comandos **mysqladmin processlist** e **mysqladmin kill** para examinar e encerrar Threads.

Note

Você não pode usar `KILL` com a biblioteca Embedded MySQL Server porque o servidor embarcado simplesmente é executado dentro dos Threads da aplicação host. Ele não cria seus próprios Threads de conexão.

Quando você usa `KILL`, uma *kill flag* específica do Thread é definida para ele. Na maioria dos casos, pode levar algum tempo para que o Thread morra, porque a *kill flag* é verificada apenas em intervalos específicos:

* Durante operações `SELECT`, para loops `ORDER BY` e `GROUP BY`, a flag é verificada após a leitura de um bloco de linhas. Se a *kill flag* estiver definida, o statement é abortado.

* Operações `ALTER TABLE` que realizam uma cópia da tabela verificam a *kill flag* periodicamente para cada bloco de poucas linhas copiadas lidas da tabela original. Se a *kill flag* tiver sido definida, o statement é abortado e a tabela temporária é excluída.

  A declaração `KILL` retorna sem esperar por confirmação, mas a verificação da *kill flag* aborta a operação dentro de um período de tempo razoavelmente pequeno. Abortar a operação para realizar qualquer limpeza necessária também leva algum tempo.

* Durante operações `UPDATE` ou `DELETE`, a *kill flag* é verificada após cada bloco lido e após cada linha atualizada ou excluída. Se a *kill flag* estiver definida, o statement é abortado. Se você não estiver usando transactions, as alterações não são revertidas (rolled back).

* `GET_LOCK()` aborta e retorna `NULL`.

* Se o Thread estiver no manipulador de table Lock (estado: `Locked`), o table Lock é rapidamente abortado.

* Se o Thread estiver esperando por espaço livre em disco em uma chamada de escrita (write), a escrita é abortada com uma mensagem de erro de “disk full”.

Warning

Encerrar (Killing) uma operação `REPAIR TABLE` ou `OPTIMIZE TABLE` em uma tabela `MyISAM` resulta em uma tabela corrompida e inutilizável. Quaisquer leituras ou escritas nessa tabela falharão até que você a otimize ou repare novamente (sem interrupção).