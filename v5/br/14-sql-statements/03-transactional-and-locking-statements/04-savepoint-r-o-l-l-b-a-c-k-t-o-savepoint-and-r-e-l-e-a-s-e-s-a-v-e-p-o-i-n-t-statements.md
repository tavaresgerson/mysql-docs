### 13.3.4 Instruções SAVEPOINT, ROLLBACK TO SAVEPOINT e RELEASE SAVEPOINT

```sql
SAVEPOINT identifier
ROLLBACK [WORK] TO [SAVEPOINT] identifier
RELEASE SAVEPOINT identifier
```

O `InnoDB` suporta as instruções SQL [`SAVEPOINT`](savepoint.html "13.3.4 SAVEPOINT, ROLLBACK TO SAVEPOINT, and RELEASE SAVEPOINT Statements"), [`ROLLBACK TO SAVEPOINT`](savepoint.html "13.3.4 SAVEPOINT, ROLLBACK TO SAVEPOINT, and RELEASE SAVEPOINT Statements"), [`RELEASE SAVEPOINT`](savepoint.html "13.3.4 SAVEPOINT, ROLLBACK TO SAVEPOINT, and RELEASE SAVEPOINT Statements") e a palavra-chave opcional `WORK` para [`ROLLBACK`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements").

A instrução [`SAVEPOINT`](savepoint.html "13.3.4 SAVEPOINT, ROLLBACK TO SAVEPOINT, and RELEASE SAVEPOINT Statements") define um SAVEPOINT de TRANSACTION nomeado com o nome *`identifier`*. Se a TRANSACTION atual tiver um SAVEPOINT com o mesmo nome, o SAVEPOINT antigo é excluído e um novo é definido.

A instrução [`ROLLBACK TO SAVEPOINT`](savepoint.html "13.3.4 SAVEPOINT, ROLLBACK TO SAVEPOINT, and RELEASE SAVEPOINT Statements") reverte (ROLLBACK) uma TRANSACTION para o SAVEPOINT nomeado sem encerrar a TRANSACTION. As modificações que a TRANSACTION atual fez nas linhas após o SAVEPOINT ter sido definido são desfeitas no ROLLBACK, mas o `InnoDB` *não* libera os row Locks que foram armazenados na memória após o SAVEPOINT. (Para uma nova linha inserida, a informação do Lock é carregada pelo ID da TRANSACTION armazenado na linha; o Lock não é armazenado separadamente na memória. Neste caso, o row Lock é liberado no undo.) SAVEPOINTs que foram definidos posteriormente ao SAVEPOINT nomeado são excluídos.

Se a instrução [`ROLLBACK TO SAVEPOINT`](savepoint.html "13.3.4 SAVEPOINT, ROLLBACK TO SAVEPOINT, and RELEASE SAVEPOINT Statements") retornar o seguinte erro, isso significa que não existe SAVEPOINT com o nome especificado:

```sql
ERROR 1305 (42000): SAVEPOINT identifier does not exist
```

A instrução [`RELEASE SAVEPOINT`](savepoint.html "13.3.4 SAVEPOINT, ROLLBACK TO SAVEPOINT, and RELEASE SAVEPOINT Statements") remove o SAVEPOINT nomeado do conjunto de SAVEPOINTs da TRANSACTION atual. Nenhum COMMIT ou ROLLBACK ocorre. É um erro se o SAVEPOINT não existir.

Todos os SAVEPOINTs da TRANSACTION atual são excluídos se você executar um [`COMMIT`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements"), ou um [`ROLLBACK`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") que não nomeie um SAVEPOINT.

Um novo nível de SAVEPOINT é criado quando uma stored function é invocada ou um trigger é ativado. Os SAVEPOINTs nos níveis anteriores tornam-se indisponíveis e, portanto, não entram em conflito com os SAVEPOINTs no novo nível. Quando a function ou o trigger é encerrado, quaisquer SAVEPOINTs que ele tenha criado são liberados e o nível de SAVEPOINT anterior é restaurado.