#### 15.7.8.4 Declaração de eliminação

```
KILL [CONNECTION | QUERY] processlist_id
```

Cada conexão com o **mysqld** é executada em um fio de execução separado. Você pode matar um fio com a instrução `KILL processlist_id`.

Os identificadores do processo de thread podem ser determinados a partir da coluna `ID` da tabela `INFORMATION_SCHEMA` `PROCESSLIST`, da coluna `Id` da saída `SHOW PROCESSLIST` e da coluna `PROCESSLIST_ID` da tabela do Schema de Desempenho `threads`. O valor do thread atual é retornado pela função `CONNECTION_ID()`.

`KILL` permite um modificador opcional `CONNECTION` ou `QUERY`:

- `KILL CONNECTION` é o mesmo que `KILL` sem modificador: ele termina a conexão associada ao `processlist_id` fornecido, após encerrar qualquer instrução que a conexão esteja executando.

- `KILL QUERY` encerra a instrução que a conexão está executando atualmente, mas deixa a própria conexão intacta.

A capacidade de ver quais threads estão disponíveis para serem eliminadas depende do privilégio `PROCESS`:

- Sem `PROCESS`, você só pode ver seus próprios tópicos.

- Com `PROCESS`, você pode ver todas as threads.

A capacidade de matar threads e instruções depende do privilégio `CONNECTION_ADMIN` e do privilégio descontinuado `SUPER`:

- Sem `CONNECTION_ADMIN` ou `SUPER`, você pode matar apenas suas próprias threads e instruções.

- Com `CONNECTION_ADMIN` ou `SUPER`, você pode matar todas as threads e instruções, exceto que, para afetar uma thread ou instrução que está sendo executada com o privilégio `SYSTEM_USER`, sua própria sessão deve ter adicionalmente o privilégio `SYSTEM_USER`.

Você também pode usar os comandos **mysqladmin processlist** e **mysqladmin kill** para examinar e matar threads.

Quando você usa `KILL`, uma bandeira de morte específica para o thread é definida. Na maioria dos casos, pode levar algum tempo para o thread morrer, pois a bandeira de morte é verificada apenas em intervalos específicos:

- Durante as operações `SELECT`, para os loops `ORDER BY` e `GROUP BY`, a bandeira é verificada após a leitura de um bloco de linhas. Se a bandeira de exclusão estiver definida, a instrução é interrompida.

- As operações `ALTER TABLE` que fazem uma cópia de tabela verificam periodicamente a bandeira de eliminação para cada algumas linhas copiadas lidas da tabela original. Se a bandeira de eliminação estiver definida, a instrução é interrompida e a tabela temporária é excluída.

  A declaração `KILL` retorna sem esperar confirmação, mas a verificação da bandeira de interrupção interrompe a operação em um período de tempo razoavelmente curto. Interromper a operação para realizar qualquer limpeza necessária também leva algum tempo.

- Durante as operações `UPDATE` ou `DELETE`, a bandeira de exclusão é verificada após cada bloco lido e após cada linha atualizada ou excluída. Se a bandeira de exclusão estiver definida, a instrução é abortada. Se você não estiver usando transações, as alterações não serão revertidas.

- `GET_LOCK()` interrompe e retorna `NULL`.

- Se o fio estiver no manipulador de bloqueio de tabela (estado: `Locked`), o bloqueio da tabela será rapidamente abortado.

- Se o fio estiver aguardando espaço livre no disco em uma chamada de escrita, a escrita será abortada com uma mensagem de erro "disco cheio".

- `EXPLAIN ANALYZE` interrompe e imprime a primeira linha de saída. Isso funciona no MySQL 8.0.20 e versões posteriores.

Aviso

A execução de uma operação `REPAIR TABLE` ou `OPTIMIZE TABLE` em uma tabela `MyISAM` resulta em uma tabela corrompida e inutilizável. Quaisquer leituras ou escritas em uma tabela desse tipo falham até que você a otimize ou a repare novamente (sem interrupção).
