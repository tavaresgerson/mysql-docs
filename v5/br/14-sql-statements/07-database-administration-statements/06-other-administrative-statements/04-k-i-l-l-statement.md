#### 13.7.6.4 Declaração KILL

```sql
KILL [CONNECTION | QUERY] processlist_id
```

Cada conexão com [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") é executada em um Thread separado. Você pode encerrar (kill) um Thread com a declaração `KILL processlist_id`.

Os identificadores de `processlist` de Thread podem ser determinados a partir da coluna `ID` da tabela `INFORMATION_SCHEMA` [`PROCESSLIST`](information-schema-processlist-table.html "24.3.18 The INFORMATION_SCHEMA PROCESSLIST Table"), da coluna `Id` da saída de [`SHOW PROCESSLIST`](show-processlist.html "13.7.5.29 SHOW PROCESSLIST Statement"), e da coluna `PROCESSLIST_ID` da tabela [`threads`](performance-schema-threads-table.html "25.12.16.4 The threads Table") do Performance Schema. O valor para o Thread atual é retornado pela função [`CONNECTION_ID()`](information-functions.html#function_connection-id).

O [`KILL`](kill.html "13.7.6.4 KILL Statement") permite um modificador opcional `CONNECTION` ou `QUERY`:

* [`KILL CONNECTION`](kill.html "13.7.6.4 KILL Statement") é o mesmo que [`KILL`](kill.html "13.7.6.4 KILL Statement") sem modificador: Ele encerra a conexão associada ao *`processlist_id`* fornecido, após encerrar qualquer statement que a conexão esteja executando.

* [`KILL QUERY`](kill.html "13.7.6.4 KILL Statement") encerra o statement que a conexão está executando no momento, mas mantém a própria conexão intacta.

A capacidade de visualizar quais Threads estão disponíveis para serem encerrados (killed) depende do privilégio [`PROCESS`](privileges-provided.html#priv_process):

* Sem [`PROCESS`](privileges-provided.html#priv_process), você pode ver apenas seus próprios Threads.

* Com [`PROCESS`](privileges-provided.html#priv_process), você pode ver todos os Threads.

A capacidade de encerrar (kill) Threads e statements depende do privilégio [`SUPER`](privileges-provided.html#priv_super):

* Sem [`SUPER`](privileges-provided.html#priv_super), você pode encerrar apenas seus próprios Threads e statements.

* Com [`SUPER`](privileges-provided.html#priv_super), você pode encerrar todos os Threads e statements.

Você também pode usar os comandos [**mysqladmin processlist**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program") e [**mysqladmin kill**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program") para examinar e encerrar Threads.

Note

Você não pode usar [`KILL`](kill.html "13.7.6.4 KILL Statement") com a biblioteca Embedded MySQL Server porque o servidor embarcado simplesmente é executado dentro dos Threads da aplicação host. Ele não cria seus próprios Threads de conexão.

Quando você usa [`KILL`](kill.html "13.7.6.4 KILL Statement"), uma *kill flag* específica do Thread é definida para ele. Na maioria dos casos, pode levar algum tempo para que o Thread morra, porque a *kill flag* é verificada apenas em intervalos específicos:

* Durante operações [`SELECT`](select.html "13.2.9 SELECT Statement"), para loops `ORDER BY` e `GROUP BY`, a flag é verificada após a leitura de um bloco de linhas. Se a *kill flag* estiver definida, o statement é abortado.

* Operações [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") que realizam uma cópia da tabela verificam a *kill flag* periodicamente para cada bloco de poucas linhas copiadas lidas da tabela original. Se a *kill flag* tiver sido definida, o statement é abortado e a tabela temporária é excluída.

  A declaração [`KILL`](kill.html "13.7.6.4 KILL Statement") retorna sem esperar por confirmação, mas a verificação da *kill flag* aborta a operação dentro de um período de tempo razoavelmente pequeno. Abortar a operação para realizar qualquer limpeza necessária também leva algum tempo.

* Durante operações [`UPDATE`](update.html "13.2.11 UPDATE Statement") ou [`DELETE`](delete.html "13.2.2 DELETE Statement"), a *kill flag* é verificada após cada bloco lido e após cada linha atualizada ou excluída. Se a *kill flag* estiver definida, o statement é abortado. Se você não estiver usando transactions, as alterações não são revertidas (rolled back).

* [`GET_LOCK()`](locking-functions.html#function_get-lock) aborta e retorna `NULL`.

* Se o Thread estiver no manipulador de table Lock (estado: `Locked`), o table Lock é rapidamente abortado.

* Se o Thread estiver esperando por espaço livre em disco em uma chamada de escrita (write), a escrita é abortada com uma mensagem de erro de “disk full”.

Warning

Encerrar (Killing) uma operação [`REPAIR TABLE`](repair-table.html "13.7.2.5 REPAIR TABLE Statement") ou [`OPTIMIZE TABLE`](optimize-table.html "13.7.2.4 OPTIMIZE TABLE Statement") em uma tabela `MyISAM` resulta em uma tabela corrompida e inutilizável. Quaisquer leituras ou escritas nessa tabela falharão até que você a otimize ou repare novamente (sem interrupção).