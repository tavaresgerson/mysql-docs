### 13.3.1 Declarações START TRANSACTION, COMMIT e ROLLBACK

```sql
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

- `START TRANSACTION` ou `BEGIN` inicia uma nova transação.

- `COMMIT` compromete a transação atual, tornando suas alterações permanentes.

- O comando `ROLLBACK` desfaz a transação atual, cancelando suas alterações.

- `SET autocommit` desabilita ou habilita o modo de autocommit padrão para a sessão atual.

Por padrão, o MySQL funciona com o modo autocommit ativado. Isso significa que, quando não estiver dentro de uma transação, cada instrução é atômica, como se estivesse cercada por `START TRANSACTION` e `COMMIT`. Você não pode usar `ROLLBACK` para desfazer o efeito; no entanto, se ocorrer um erro durante a execução da instrução, a instrução será desfeita.

Para desabilitar o modo de commit automático implicitamente para uma única série de instruções, use a instrução `START TRANSACTION`:

```sql
START TRANSACTION;
SELECT @A:=SUM(salary) FROM table1 WHERE type=1;
UPDATE table2 SET summary=@A WHERE type=1;
COMMIT;
```

Com `START TRANSACTION`, o autocommit permanece desativado até que você encerre a transação com `COMMIT` ou `ROLLBACK`. O modo autocommit então retorna ao seu estado anterior.

`START TRANSACTION` permite vários modificadores que controlam as características da transação. Para especificar vários modificadores, separe-os por vírgulas.

- O modificador `WITH CONSISTENT SNAPSHOT` inicia uma leitura consistente para os motores de armazenamento que são capazes disso. Isso se aplica apenas ao `InnoDB`. O efeito é o mesmo de emitir uma `START TRANSACTION` seguida de uma `SELECT` de qualquer tabela `InnoDB`. Veja Seção 14.7.2.3, “Leitura Não Bloqueada Consistente”. O modificador `WITH CONSISTENT SNAPSHOT` não altera o nível de isolamento da transação atual (glossary.html#glos_isolation_level), portanto, fornece uma instantânea consistente apenas se o nível de isolamento atual for um que permita uma leitura consistente. O único nível de isolamento que permite uma leitura consistente é `REPEATABLE READ`. Para todos os outros níveis de isolamento, a cláusula `WITH CONSISTENT SNAPSHOT` é ignorada. A partir do MySQL 5.7.2, uma mensagem de aviso é gerada quando a cláusula `WITH CONSISTENT SNAPSHOT` é ignorada.

- Os modificadores `LEIA ESCRITA` e `LEIA SOMENTE` definem o modo de acesso à transação. Eles permitem ou proíbem alterações em tabelas usadas na transação. A restrição `LEIA SOMENTE` impede que a transação modifique ou bloqueie tabelas tanto transacionais quanto não transacionais que sejam visíveis para outras transações; a transação ainda pode modificar ou bloquear tabelas temporárias.

  O MySQL permite otimizações adicionais para consultas em tabelas `InnoDB` quando a transação é conhecida como somente leitura. Especificar `READ ONLY` garante que essas otimizações sejam aplicadas em casos em que o status de somente leitura não pode ser determinado automaticamente. Consulte Seção 8.5.3, “Otimizando Transações InnoDB de Leitura Somente” para obter mais informações.

  Se nenhum modo de acesso for especificado, o modo padrão será aplicado. A menos que o padrão tenha sido alterado, ele é de leitura/escrita. Não é permitido especificar `LEIA/ESCRITA` e `LEITURA ÚNICA` na mesma declaração.

  No modo de leitura somente, ainda é possível alterar tabelas criadas com a palavra-chave `TEMPORARY` usando instruções DML. As alterações feitas com instruções DDL não são permitidas, assim como com tabelas permanentes.

  Para obter informações adicionais sobre o modo de acesso de transações, incluindo maneiras de alterar o modo padrão, consulte Seção 13.3.6, “Instrução SET TRANSACTION”.

  Se a variável de sistema `read_only` estiver habilitada, iniciar explicitamente uma transação com `START TRANSACTION READ WRITE` requer o privilégio `SUPER`.

Importante

Muitas APIs usadas para escrever aplicativos de cliente do MySQL (como o JDBC) fornecem seus próprios métodos para iniciar transações que podem (e às vezes devem) ser usados em vez de enviar uma declaração `START TRANSACTION` do cliente. Consulte [Capítulo 27, *Conectivos e APIs*] (connectors-apis.html), ou a documentação da sua API, para obter mais informações.

Para desabilitar o modo de autocommit explicitamente, use a seguinte declaração:

```sql
SET autocommit=0;
```

Depois de desabilitar o modo de autocommit, definindo a variável `autocommit` para zero, as alterações em tabelas seguras para transações (como as para `InnoDB` ou `NDB`) não são feitas permanentemente imediatamente. Você deve usar `COMMIT` para armazenar suas alterações no disco ou `ROLLBACK` para ignorar as alterações.

`autocommit` é uma variável de sessão e deve ser definida para cada sessão. Para desabilitar o modo de autocommit para cada nova conexão, consulte a descrição da variável de sistema `autocommit` na Seção 5.1.7, “Variáveis de Sistema do Servidor”.

`BEGIN` e `BEGIN WORK` são suportados como sinônimos de `START TRANSACTION` para iniciar uma transação. `START TRANSACTION` é a sintaxe padrão do SQL, é a maneira recomendada para iniciar uma transação ad-hoc e permite modificadores que `BEGIN` não permite.

A instrução `BEGIN` difere do uso da palavra-chave `BEGIN` que inicia uma instrução composta `BEGIN ... END` (begin-end.html). Esta última não inicia uma transação. Veja Seção 13.6.1, “Instrução Composta BEGIN ... END”.

Nota

Em todos os programas armazenados (procedimentos e funções armazenados, gatilhos e eventos), o analisador trata `BEGIN [WORK]` como o início de um bloco `BEGIN ... END` (begin-end.html). Comece uma transação neste contexto com `START TRANSACTION` (commit.html) em vez disso.

A palavra-chave opcional `WORK` é suportada para `COMMIT` e `ROLLBACK`, assim como as cláusulas `CHAIN` e `RELEASE`. `CHAIN` e `RELEASE` podem ser usadas para controle adicional sobre o término da transação. O valor da variável de sistema `completion_type` determina o comportamento padrão de conclusão. Veja Seção 5.1.7, “Variáveis de Sistema do Servidor”.

A cláusula `AND CHAIN` faz com que uma nova transação comece assim que a atual terminar, e a nova transação tem o mesmo nível de isolamento que a transação que acabou de ser encerrada. A nova transação também usa o mesmo modo de acesso (`READ WRITE` ou `READ ONLY`) que a transação que acabou de ser encerrada. A cláusula `RELEASE` faz com que o servidor desconecte a sessão do cliente atual após o término da transação atual. A inclusão da palavra-chave `NO` suprime a conclusão da `CHAIN` ou `RELEASE`, o que pode ser útil se a variável de sistema `completion_type` estiver definida para causar a conclusão da cadeia ou liberação por padrão.

Iniciar uma transação faz com que qualquer transação pendente seja comprometida. Consulte Seção 13.3.3, “Declarações que causam um compromisso implícito” para obter mais informações.

Iniciar uma transação também faz com que as bloqueadas de tabela adquiridas com `LOCK TABLES` sejam liberadas, como se você tivesse executado `UNLOCK TABLES`. Iniciar uma transação não libera uma bloqueadora de leitura global adquirida com `FLUSH TABLES WITH READ LOCK`.

Para obter os melhores resultados, as transações devem ser realizadas usando apenas tabelas gerenciadas por um único mecanismo de armazenamento seguro para transações. Caso contrário, os seguintes problemas podem ocorrer:

- Se você usar tabelas de mais de um motor de armazenamento seguro para transações (como `InnoDB`) e o nível de isolamento de transação não for `SERIALIZABLE`, é possível que, quando uma transação é confirmada, outra transação em andamento que usa as mesmas tabelas veja apenas algumas das alterações feitas pela primeira transação. Ou seja, a atomicidade das transações não é garantida com motores mistos e inconsistências podem resultar. (Se as transações com motores mistos forem raras, você pode usar `SET TRANSACTION ISOLATION LEVEL` para definir o nível de isolamento para `SERIALIZABLE` em uma base por transação, conforme necessário.)

- Se você usar tabelas que não são seguras para transações dentro de uma transação, as alterações nessas tabelas são armazenadas de uma vez, independentemente do status do modo de autocommit.

- Se você emitir uma declaração de `ROLLBACK` após atualizar uma tabela não transacional dentro de uma transação, uma mensagem de aviso de `ER_WARNING_NOT_COMPLETE_ROLLBACK` ocorre. As alterações em tabelas seguras para transações são revertidas, mas não as alterações em tabelas não seguras para transações.

Cada transação é armazenada no log binário em um único bloco, após o `COMMIT`. As transações que são revertidas não são registradas. (**Exceção**: As modificações em tabelas não transacionais não podem ser revertidas. Se uma transação que é revertida incluir modificações em tabelas não transacionais, toda a transação é registrada com uma declaração de `ROLLBACK` no final para garantir que as modificações nas tabelas não transacionais sejam replicadas.) Veja Seção 5.4.4, “O Log Binário”.

Você pode alterar o nível de isolamento ou o modo de acesso para transações com a instrução `SET TRANSACTION`. Veja Seção 13.3.6, “Instrução SET TRANSACTION”.

O recuo pode ser uma operação lenta que pode ocorrer implicitamente sem que o usuário tenha solicitado explicitamente (por exemplo, quando ocorre um erro). Por isso, o `SHOW PROCESSLIST` exibe `Recuo` na coluna `Estado` para a sessão, não apenas para recuos explícitos realizados com a instrução `ROLLBACK`, mas também para recuos implícitos.

Nota

No MySQL 5.7, `BEGIN`, `COMMIT` e `ROLLBACK` não são afetados pelas regras de `--replicate-do-db` (replication-options-replica.html#option_mysqld_replicate-do-db) ou `--replicate-ignore-db` (replication-options-replica.html#option_mysqld_replicate-ignore-db).

Quando o `InnoDB` realiza um rollback completo de uma transação, todos os bloqueios definidos pela transação são liberados. Se uma única instrução SQL dentro de uma transação for revertida como resultado de um erro, como um erro de chave duplicada, os bloqueios definidos pela instrução são preservados enquanto a transação permanece ativa. Isso acontece porque o `InnoDB` armazena os bloqueios de linha em um formato de tal forma que não pode saber depois qual bloqueio foi definido por qual instrução.

Se uma instrução `SELECT` dentro de uma transação chamar uma função armazenada, e uma instrução dentro da função armazenada falhar, essa instrução será revertida. Se a instrução `ROLLBACK` for executada para a transação posteriormente, toda a transação será revertida.
