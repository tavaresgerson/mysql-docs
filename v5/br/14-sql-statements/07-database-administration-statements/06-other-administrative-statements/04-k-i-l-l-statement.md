#### 13.7.6.4 Declaração de eliminação

```sql
KILL [CONNECTION | QUERY] processlist_id
```

Cada conexão com **mysqld** é executada em um fio separado. Você pode matar um fio com a instrução `KILL processlist_id`.

Os identificadores do processo do `PROCESSLIST` podem ser determinados a partir da coluna `ID` da tabela `INFORMATION_SCHEMA `PROCESSLIST``, da coluna `Id` da saída do comando `SHOW PROCESSLIST` e da coluna `PROCESSLIST_ID` da tabela `threads` do Schema de Desempenho. O valor do processo atual é retornado pela função `CONNECTION_ID()` (funções de informações.html#function\_connection-id).

`KILL` permite um modificador opcional `CONNECTION` ou `QUERY`:

- `KILL CONNECTION` é o mesmo que `KILL` sem modificador: ele termina a conexão associada ao *`processlist_id`* fornecido, após encerrar qualquer instrução que a conexão esteja executando.

- `KILL QUERY` (kill.html) termina a instrução que a conexão está executando no momento, mas deixa a própria conexão intacta.

A capacidade de ver quais threads estão disponíveis para serem eliminadas depende do privilégio `PROCESSO`:

- Sem `PROCESSO`, você só pode ver suas próprias threads.

- Com `PROCESSO`, você pode ver todas as threads.

A capacidade de matar threads e instruções depende do privilégio `SUPER`:

- Sem `SUPER`, você pode matar apenas suas próprias threads e instruções.

- Com `SUPER`, você pode matar todas as threads e instruções.

Você também pode usar os comandos **mysqladmin processlist** e **mysqladmin kill** para examinar e matar threads.

Nota

Você não pode usar `KILL` com a biblioteca do Servidor MySQL embutido porque o servidor embutido funciona apenas dentro dos threads da aplicação hospedeira. Ele não cria seus próprios threads de conexão.

Quando você usa `KILL`, uma bandeira de morte específica para a thread é definida. Na maioria dos casos, pode levar algum tempo para a thread morrer, pois a bandeira de morte é verificada apenas em intervalos específicos:

- Durante as operações de `SELECT`, para os loops `ORDER BY` e `GROUP BY`, a bandeira é verificada após a leitura de um bloco de linhas. Se a bandeira de exclusão estiver definida, a instrução é interrompida.

- As operações de alteração de tabela `ALTER TABLE` que fazem uma cópia da tabela verificar a bandeira de exclusão periodicamente para cada algumas linhas copiadas lidas da tabela original. Se a bandeira de exclusão estiver definida, a instrução é interrompida e a tabela temporária é excluída.

  A instrução `KILL` retorna sem esperar confirmação, mas a verificação da bandeira `kill` interrompe a operação em um período de tempo razoavelmente curto. Interromper a operação para realizar a limpeza necessária também leva algum tempo.

- Durante as operações de `UPDATE` ou `DELETE`, a bandeira de exclusão é verificada após cada bloco lido e após cada linha atualizada ou excluída. Se a bandeira de exclusão estiver definida, a instrução é abortada. Se você não estiver usando transações, as alterações não serão revertidas.

- `GET_LOCK()` interrompe e retorna `NULL`.

- Se o fio estiver no manipulador de bloqueio de tabela (estado: `Bloqueado`), o bloqueio de tabela será rapidamente abortado.

- Se o fio estiver aguardando espaço livre no disco em uma chamada de escrita, a escrita será abortada com uma mensagem de erro "disco cheio".

Aviso

A execução de uma operação de `REPAIR TABLE` (reparo de tabela) ou `OPTIMIZE TABLE` (otimização de tabela) em uma tabela `MyISAM` resulta em uma tabela corrompida e inutilizável. Quaisquer leituras ou escritas em uma tabela desse tipo falham até que você a otimize ou repare novamente (sem interrupção).
