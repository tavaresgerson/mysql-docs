#### 15.7.8.4 Declaração `KILL`

```
KILL [CONNECTION | QUERY] processlist_id
```

Cada conexão com o **mysqld** é executada em um thread separado. Você pode matar um thread com a declaração `KILL processlist_id`.

Os identificadores de processos do thread podem ser determinados a partir da coluna `ID` da tabela `PROCESSLIST` do `INFORMATION_SCHEMA`, da coluna `Id` da saída `SHOW PROCESSLIST` e da coluna `PROCESSLIST_ID` da tabela `threads` do Schema de Desempenho. O valor do thread atual é retornado pela função `CONNECTION_ID()`.

O `KILL` permite um modificador opcional `CONNECTION` ou `QUERY`:

* `KILL CONNECTION` é o mesmo que `KILL` sem modificador: Ele termina a conexão associada ao *`processlist_id`` fornecido, após terminar qualquer declaração que a conexão esteja executando.

* `KILL QUERY` termina a declaração que a conexão está atualmente executando, mas deixa a própria conexão intacta.

A capacidade de ver quais threads estão disponíveis para serem mortos depende do privilégio `PROCESS`:

* Sem `PROCESS`, você pode ver apenas seus próprios threads.

* Com `PROCESS`, você pode ver todos os threads.

A capacidade de matar threads e declarações depende dos privilégios `CONNECTION_ADMIN` e do privilégio desatualizado `SUPER`:

* Sem `CONNECTION_ADMIN` ou `SUPER`, você pode matar apenas seus próprios threads e declarações.

* Com `CONNECTION_ADMIN` ou `SUPER`, você pode matar todos os threads e declarações, exceto que para afetar um thread ou declaração que esteja executando com o privilégio `SYSTEM_USER`, sua própria sessão deve ter adicionalmente o privilégio `SYSTEM_USER`.

Você também pode usar os comandos **mysqladmin processlist** e **mysqladmin kill** para examinar e matar threads.

Quando você usa `KILL`, uma bandeira de morte específica da thread é definida para a thread. Na maioria dos casos, pode levar algum tempo para a thread morrer, pois a bandeira de morte é verificada apenas em intervalos específicos:

* Durante operações `SELECT`, para loops de `ORDER BY` e `GROUP BY`, a bandeira é verificada após a leitura de um bloco de linhas. Se a bandeira de morte estiver definida, a instrução é abortada.

* Operações `ALTER TABLE` que fazem uma cópia da tabela verificam a bandeira de morte periodicamente para cada poucas linhas copiadas lidas da tabela original. Se a bandeira de morte estiver definida, a instrução é abortada e a tabela temporária é excluída.

A instrução `KILL` retorna sem esperar por confirmação, mas a verificação da bandeira de morte aborta a operação em um período de tempo razoavelmente curto. Abortar a operação para realizar qualquer limpeza necessária também leva algum tempo.

* Durante operações `UPDATE` ou `DELETE`, a bandeira de morte é verificada após cada bloco lido e após cada linha atualizada ou excluída. Se a bandeira de morte estiver definida, a instrução é abortada. Se você não estiver usando transações, as alterações não são revertidas.

* `GET_LOCK()` aborta e retorna `NULL`.

* Se a thread estiver no manipulador de bloqueio da tabela (estado: `Locked`), o bloqueio da tabela é rapidamente abortado.

* Se a thread estiver esperando por espaço livre no disco em uma chamada de escrita, a escrita é abortada com uma mensagem de erro "disco cheio".

* `EXPLAIN ANALYZE` aborta e imprime a primeira linha de saída.

Aviso

A execução de uma operação `REPAIR TABLE` ou `OPTIMIZE TABLE` em uma tabela `MyISAM` resulta em uma tabela corrompida e inutilizável. Quaisquer leituras ou escritas em tal tabela falham até que você otimize ou a repare novamente (sem interrupção).