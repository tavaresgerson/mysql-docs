### 15.3.4 Declarações `SAVEPOINT`, `ROLLBACK TO SAVEPOINT` e `RELEASE SAVEPOINT`

```
SAVEPOINT identifier
ROLLBACK [WORK] TO [SAVEPOINT] identifier
RELEASE SAVEPOINT identifier
```

O `InnoDB` suporta as declarações SQL `SAVEPOINT`, `ROLLBACK TO SAVEPOINT`, `RELEASE SAVEPOINT` e a palavra-chave opcional `WORK` para `ROLLBACK`.

A declaração `SAVEPOINT` define um ponto de salvamento de transação nomeado com o nome de *`identificador`*. Se a transação atual tiver um ponto de salvamento com o mesmo nome, o antigo ponto de salvamento é excluído e um novo é definido.

A declaração `ROLLBACK TO SAVEPOINT` desfaz uma transação até o ponto de salvamento nomeado sem encerrar a transação. As modificações que a transação atual fez em linhas após o ponto de salvamento ser definido são desfeitas no rollback, mas o `InnoDB` *não* libera os bloqueios de linha que foram armazenados na memória após o ponto de salvamento. (Para uma nova linha inserida, as informações de bloqueio são carregadas pelo ID de transação armazenado na linha; o bloqueio não é armazenado separadamente na memória. Neste caso, o bloqueio de linha é liberado no undo.) Pontos de salvamento definidos em um momento posterior ao ponto de salvamento nomeado são excluídos.

Se a declaração `ROLLBACK TO SAVEPOINT` retornar o seguinte erro, significa que não existe nenhum ponto de salvamento com o nome especificado:

```
ERROR 1305 (42000): SAVEPOINT identifier does not exist
```

A declaração `RELEASE SAVEPOINT` remove o ponto de salvamento nomeado do conjunto de pontos de salvamento da transação atual. Não ocorre nenhum commit ou rollback. É um erro se o ponto de salvamento não existir.

Todos os pontos de salvamento da transação atual são excluídos se você executar um `COMMIT` ou um `ROLLBACK` que não nomeie um ponto de salvamento.

Um novo nível de ponto de salvamento é criado quando uma função armazenada é invocada ou um gatilho é ativado. Os pontos de salvamento dos níveis anteriores tornam-se indisponíveis e, portanto, não entram em conflito com os pontos de salvamento do novo nível. Quando a função ou o gatilho termina, quaisquer pontos de salvamento que ele criou são liberados e o nível de ponto de salvamento anterior é restaurado.