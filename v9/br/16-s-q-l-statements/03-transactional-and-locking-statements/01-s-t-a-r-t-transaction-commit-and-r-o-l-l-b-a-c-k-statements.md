### 15.3.1 Declarações `START TRANSACTION`, `COMMIT` e `ROLLBACK`

```
START TRANSACTION
    [transaction_characteristic [, transaction_characteristic] ...]

transaction_characteristic: {
    WITH CONSISTENT SNAPSHOT
  | READ WRITE
  | READ ONLY
}

BEGIN [WORK]
COMMIT [WORK] [AND [NO] CHAIN] [[NO] RELEASE]
ROLLBACK [WORK] [AND [NO] CHAIN] [[NO] RELEASE]
SET autocommit = {0 | 1}
```

Essas declarações fornecem controle sobre o uso de transações:

* `START TRANSACTION` ou `BEGIN` inicia uma nova transação.

* `COMMIT` compromete a transação atual, tornando suas alterações permanentes.

* `ROLLBACK` desfaz a transação atual, cancelando suas alterações.

* `SET autocommit` desabilita ou habilita o modo de autocomprometimento padrão para a sessão atual.

Por padrão, o MySQL executa com o modo de autocomprometimento habilitado. Isso significa que, quando não estiver dentro de uma transação, cada declaração é atômica, como se estivesse cercada por `START TRANSACTION` e `COMMIT`. Você não pode usar `ROLLBACK` para desfazer o efeito; no entanto, se ocorrer um erro durante a execução da declaração, a declaração é desfeita.

Para desabilitar o modo de autocomprometimento implicitamente para uma única série de declarações, use a declaração `START TRANSACTION`:

```
START TRANSACTION;
SELECT @A:=SUM(salary) FROM table1 WHERE type=1;
UPDATE table2 SET summary=@A WHERE type=1;
COMMIT;
```

Com `START TRANSACTION`, o autocomprometimento permanece desativado até que você termine a transação com `COMMIT` ou `ROLLBACK`. O modo de autocomprometimento então retorna ao seu estado anterior.

`START TRANSACTION` permite vários modificadores que controlam as características da transação. Para especificar vários modificadores, separe-os por vírgulas.

O modificador `COM SNAPSHOT CONSISTENTE` inicia uma leitura consistente para os motores de armazenamento que são capazes disso. Isso se aplica apenas ao `InnoDB`. O efeito é o mesmo de emitir um `START TRANSACTION` seguido de um `SELECT` de qualquer tabela `InnoDB`. Veja a Seção 17.7.2.3, “Leitura Não Bloqueada Consistente”. O modificador `COM SNAPSHOT CONSISTENTE` não altera o nível de isolamento de transação atual, portanto, fornece uma instantânea consistente apenas se o nível de isolamento atual for um que permita uma leitura consistente. O único nível de isolamento que permite uma leitura consistente é `REPEATABLE READ`. Para todos os outros níveis de isolamento, a cláusula `COM SNAPSHOT CONSISTENTE` é ignorada. Um aviso é gerado quando a cláusula `COM SNAPSHOT CONSISTENTE` é ignorada.

* Os modificadores `LEIA-ESCREVA` e `LEIA-APENAS` definem o modo de acesso da transação. Eles permitem ou proíbem alterações em tabelas usadas na transação. A restrição `LEIA-APENAS` impede que a transação modifique ou bloqueie tabelas tanto transacionais quanto não transacionais que são visíveis para outras transações; a transação ainda pode modificar ou bloquear tabelas temporárias.

  O MySQL habilita otimizações extras para consultas em tabelas `InnoDB` quando a transação é conhecida como de leitura-apenas. Especificar `LEIA-APENAS` garante que essas otimizações sejam aplicadas em casos em que o status de leitura-apenas não pode ser determinado automaticamente. Veja a Seção 10.5.3, “Otimizando Transações de Leitura-APENAS `InnoDB`” para mais informações.

  Se nenhum modo de acesso for especificado, o modo padrão é aplicado. A menos que o padrão tenha sido alterado, é leitura/escrita. Não é permitido especificar tanto `LEIA-ESCREVA` quanto `LEIA-APENAS` na mesma declaração.

No modo de leitura somente, ainda é possível alterar tabelas criadas com a palavra-chave `TEMPORARY` usando instruções DML. As alterações feitas com instruções DDL não são permitidas, assim como com tabelas permanentes.

Para obter informações adicionais sobre o modo de acesso à transação, incluindo maneiras de alterar o modo padrão, consulte a Seção 15.3.7, “Instrução SET TRANSACTION”.

Se a variável de sistema `read_only` estiver habilitada, iniciar explicitamente uma transação com `START TRANSACTION READ WRITE` requer o privilégio `CONNECTION_ADMIN` (ou o desatualizado privilégio `SUPER`).

Importante

Muitas APIs usadas para escrever aplicativos cliente MySQL (como JDBC) fornecem seus próprios métodos para iniciar transações que podem (e às vezes devem) ser usados em vez de enviar uma instrução `START TRANSACTION` do cliente. Consulte o Capítulo 31, *Conectadores e APIs*, ou a documentação da sua API, para obter mais informações.

Para desabilitar o modo de autocommit explicitamente, use a seguinte instrução:

```
SET autocommit=0;
```

Após desabilitar o modo de autocommit configurando a variável `autocommit` para zero, as alterações em tabelas seguras para transações (como as de `InnoDB` ou `NDB`) não são tornadas permanentes imediatamente. Você deve usar `COMMIT` para armazenar suas alterações no disco ou `ROLLBACK` para ignorar as alterações.

`autocommit` é uma variável de sessão e deve ser definida para cada sessão. Para desabilitar o modo de autocommit para cada nova conexão, consulte a descrição da variável de sistema `autocommit` na Seção 7.1.8, “Variáveis de sistema do servidor”.

`BEGIN` e `BEGIN WORK` são suportados como aliases de `START TRANSACTION` para iniciar uma transação. `START TRANSACTION` é a sintaxe SQL padrão, é a maneira recomendada de iniciar uma transação ad-hoc e permite modificadores que `BEGIN` não permite.

A instrução `BEGIN` difere do uso da palavra-chave `BEGIN` que inicia uma instrução composta `BEGIN ... END`. Esta última não inicia uma transação. Veja a Seção 15.6.1, “Instrução Composta `BEGIN ... END`”.

Observação

Em todos os programas armazenados (procedimentos e funções armazenados, gatilhos e eventos), o analisador trata `BEGIN [WORK]` como o início de um bloco `BEGIN ... END`. Inicie uma transação neste contexto com `START TRANSACTION` em vez disso.

A palavra-chave opcional `WORK` é suportada para `COMMIT` e `ROLLBACK`, assim como as cláusulas `CHAIN` e `RELEASE`. `CHAIN` e `RELEASE` podem ser usadas para controle adicional sobre o término da transação. O valor da variável de sistema `completion_type` determina o comportamento padrão de término. Veja a Seção 7.1.8, “Variáveis de Sistema do Servidor”.

A cláusula `AND CHAIN` faz com que uma nova transação comece assim que a atual termina, e a nova transação tem o mesmo nível de isolamento que a transação que acabou de ser terminada. A nova transação também usa o mesmo modo de acesso (`READ WRITE` ou `READ ONLY`) que a transação que acabou de ser terminada. A cláusula `RELEASE` faz com que o servidor desconecte a sessão do cliente atual após o término da transação atual. Incluir a palavra-chave `NO` suprime o término de `CHAIN` ou `RELEASE`, o que pode ser útil se a variável de sistema `completion_type` for definida para causar o término por chaining ou release por padrão.

Iniciar uma transação faz com que qualquer transação pendente seja concluída. Veja a Seção 15.3.3, “Instruções que Causam um Término Implícito”, para mais informações.

O início de uma transação também faz com que os bloqueios de tabela adquiridos com `LOCK TABLES` sejam liberados, como se você tivesse executado `UNLOCK TABLES`. O início de uma transação não libera um bloqueio de leitura global adquirido com `FLUSH TABLES WITH READ LOCK`.

Para obter os melhores resultados, as transações devem ser realizadas usando apenas tabelas gerenciadas por um único motor de armazenamento seguro para transações. Caso contrário, os seguintes problemas podem ocorrer:

* Se você usar tabelas de mais de um motor de armazenamento seguro para transações (como `InnoDB`) e o nível de isolamento da transação não for `SERIALIZABLE`, é possível que, quando uma transação seja confirmada, outra transação em andamento que use as mesmas tabelas veja apenas algumas das alterações feitas pela primeira transação. Ou seja, a atomicidade das transações não é garantida com motores mistos e inconsistências podem resultar. (Se as transações com motores mistos forem raras, você pode usar `SET TRANSACTION ISOLATION LEVEL` para definir o nível de isolamento para `SERIALIZABLE` em uma base por transação, conforme necessário.)

* Se você usar tabelas que não são seguras para transações dentro de uma transação, as alterações nessas tabelas são armazenadas de uma vez, independentemente do status do modo de autoconfirmação.

* Se você emitir uma declaração `ROLLBACK` após atualizar uma tabela não transacional dentro de uma transação, uma mensagem de aviso `ER_WARNING_NOT_COMPLETE_ROLLBACK` é exibida. As alterações em tabelas seguras para transações são revertidas, mas não as alterações em tabelas não seguras para transações.

Cada transação é armazenada no log binário em um único bloco, após o `COMMIT`. Transações que são revertidas não são registradas. (**Exceção**: Modificações em tabelas não transacionais não podem ser revertidas. Se uma transação que é revertida inclui modificações em tabelas não transacionais, toda a transação é registrada com uma declaração `ROLLBACK` no final para garantir que as modificações nas tabelas não transacionais sejam replicadas.) Veja a Seção 7.4.4, “O Log Binário”.

Você pode alterar o nível de isolamento ou o modo de acesso para transações com a declaração `SET TRANSACTION`. Veja a Seção 15.3.7, “Declaração SET TRANSACTION”.

Reverter uma transação pode ser uma operação lenta que pode ocorrer implicitamente sem que o usuário tenha solicitado explicitamente (por exemplo, quando ocorre um erro). Por isso, `SHOW PROCESSLIST` exibe `Reverter` na coluna `Estado` para a sessão, não apenas para revertidas explícitas realizadas com a declaração `ROLLBACK`, mas também para revertidas implícitas.

Nota

No MySQL 9.5, `BEGIN`, `COMMIT` e `ROLLBACK` não são afetados pelas regras `--replicate-do-db` ou `--replicate-ignore-db`.

Quando o `InnoDB` realiza um rollback completo de uma transação, todos os bloqueios definidos pela transação são liberados. Se uma única declaração SQL dentro de uma transação for revertida como resultado de um erro, como um erro de chave duplicada, os bloqueios definidos pela declaração são preservados enquanto a transação permanece ativa. Isso acontece porque o `InnoDB` armazena bloqueios de linha em um formato de tal forma que não pode saber depois qual bloqueio foi definido por qual declaração.

Se uma declaração `SELECT` dentro de uma transação chamar uma função armazenada, e uma declaração dentro da função armazenada falhar, essa declaração é revertida. Se `ROLLBACK` for executado para a transação subsequentemente, toda a transação é revertida.