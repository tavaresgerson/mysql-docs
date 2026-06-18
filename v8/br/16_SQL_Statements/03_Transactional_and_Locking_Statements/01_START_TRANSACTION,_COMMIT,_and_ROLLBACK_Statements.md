### 15.3.1 Declarações START TRANSACTION, COMMIT e ROLLBACK

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

Essas declarações fornecem controle sobre o uso das transações:

- `START TRANSACTION` ou `BEGIN` inicia uma nova transação.

- `COMMIT` registra a transação atual, tornando suas alterações permanentes.

- `ROLLBACK` desfaz a transação atual, cancelando suas alterações.

- `SET autocommit` desabilita ou habilita o modo de autocommit padrão para a sessão atual.

Por padrão, o MySQL é executado com o modo de autocommit ativado. Isso significa que, quando não estiver dentro de uma transação, cada instrução é atômica, como se estivesse cercada por `START TRANSACTION` e `COMMIT`. Você não pode usar `ROLLBACK` para desfazer o efeito; no entanto, se ocorrer um erro durante a execução da instrução, a instrução é revertida.

Para desabilitar o modo de autocommit implicitamente para uma única série de instruções, use a instrução `START TRANSACTION`:

```
START TRANSACTION;
SELECT @A:=SUM(salary) FROM table1 WHERE type=1;
UPDATE table2 SET summary=@A WHERE type=1;
COMMIT;
```

Com `START TRANSACTION`, o autocommit permanece desativado até que você encerre a transação com `COMMIT` ou `ROLLBACK`. O modo de autocommit então retorna ao seu estado anterior.

`START TRANSACTION` permite vários modificadores que controlam as características da transação. Para especificar vários modificadores, separe-os por vírgulas.

- O modificador `WITH CONSISTENT SNAPSHOT` inicia uma leitura consistente para os motores de armazenamento que são capazes disso. Isso se aplica apenas ao `InnoDB`. O efeito é o mesmo de emitir um `START TRANSACTION` seguido de um `SELECT` de qualquer tabela `InnoDB`. Veja a Seção 17.7.2.3, “Leitura Não Bloqueada Consistente”. O modificador `WITH CONSISTENT SNAPSHOT` não altera o nível de isolamento de transação atual, portanto, fornece uma instantânea consistente apenas se o nível de isolamento atual for um que permita uma leitura consistente. O único nível de isolamento que permite uma leitura consistente é `REPEATABLE READ`. Para todos os outros níveis de isolamento, a cláusula `WITH CONSISTENT SNAPSHOT` é ignorada. Um aviso é gerado quando a cláusula `WITH CONSISTENT SNAPSHOT` é ignorada.

- Os modificadores `READ WRITE` e `READ ONLY` definem o modo de acesso à transação. Eles permitem ou proíbem alterações em tabelas usadas na transação. A restrição `READ ONLY` impede que a transação modifique ou bloqueie tabelas tanto transacionais quanto não transacionais que sejam visíveis para outras transações; a transação ainda pode modificar ou bloquear tabelas temporárias.

  O MySQL permite otimizações adicionais para consultas em tabelas `InnoDB` quando a transação é conhecida como somente leitura. Especificar `READ ONLY` garante que essas otimizações sejam aplicadas em casos em que o status de somente leitura não pode ser determinado automaticamente. Consulte a Seção 10.5.3, “Otimizando Transações InnoDB de Leitura Somente”, para obter mais informações.

  Se nenhum modo de acesso for especificado, o modo padrão será aplicado. A menos que o padrão tenha sido alterado, ele é de leitura/escrita. Não é permitido especificar tanto `READ WRITE` quanto `READ ONLY` na mesma declaração.

  No modo de leitura somente, ainda é possível alterar tabelas criadas com a palavra-chave `TEMPORARY` usando instruções DML. As alterações feitas com instruções DDL não são permitidas, assim como com tabelas permanentes.

  Para obter informações adicionais sobre o modo de acesso à transação, incluindo maneiras de alterar o modo padrão, consulte a Seção 15.3.7, “Instrução SET TRANSACTION”.

  Se a variável de sistema `read_only` estiver habilitada, para iniciar explicitamente uma transação com `START TRANSACTION READ WRITE`, é necessário o privilégio `CONNECTION_ADMIN` (ou o privilégio desatualizado `SUPER`).

Importante

Muitas APIs usadas para escrever aplicativos de cliente do MySQL (como o JDBC) fornecem seus próprios métodos para iniciar transações que podem (e às vezes devem) ser usados em vez de enviar uma declaração `START TRANSACTION` do cliente. Consulte o Capítulo 31, *Conectivos e APIs*, ou a documentação da sua API, para obter mais informações.

Para desabilitar o modo de autocommit explicitamente, use a seguinte declaração:

```
SET autocommit=0;
```

Depois de desabilitar o modo de autocommit, definindo a variável `autocommit` para zero, as alterações em tabelas seguras para transações (como as para `InnoDB` ou `NDB`) não são feitas permanentemente imediatamente. Você deve usar `COMMIT` para armazenar suas alterações no disco ou `ROLLBACK` para ignorar as alterações.

`autocommit` é uma variável de sessão e deve ser definida para cada sessão. Para desabilitar o modo de autocommit para cada nova conexão, consulte a descrição da variável de sistema `autocommit` na Seção 7.1.8, “Variáveis do Sistema do Servidor”.

`BEGIN` e `BEGIN WORK` são suportados como aliases de `START TRANSACTION` para iniciar uma transação. `START TRANSACTION` é a sintaxe SQL padrão, é a maneira recomendada para iniciar uma transação ad-hoc e permite modificadores que `BEGIN` não permite.

A declaração `BEGIN` difere do uso da palavra-chave `BEGIN` que inicia uma declaração composta `BEGIN ... END`. Esta última não inicia uma transação. Veja a Seção 15.6.1, “Declaração Composta BEGIN ... END”.

Nota

Dentro de todos os programas armazenados (procedimentos e funções armazenados, gatilhos e eventos), o analisador trata `BEGIN [WORK]` como o início de um bloco `BEGIN ... END`. Comece uma transação neste contexto com `START TRANSACTION` em vez disso.

A palavra-chave opcional `WORK` é suportada para `COMMIT` e `ROLLBACK`, assim como as cláusulas `CHAIN` e `RELEASE`. `CHAIN` e `RELEASE` podem ser usadas para controle adicional sobre o comportamento de conclusão da transação. O valor da variável de sistema `completion_type` determina o comportamento padrão de conclusão. Consulte a Seção 7.1.8, “Variáveis de Sistema do Servidor”.

A cláusula `AND CHAIN` faz com que uma nova transação comece assim que a transação atual termina, e a nova transação tem o mesmo nível de isolamento que a transação que acabou de ser encerrada. A nova transação também usa o mesmo modo de acesso (`READ WRITE` ou `READ ONLY`) que a transação que acabou de ser encerrada. A cláusula `RELEASE` faz com que o servidor desconecte a sessão do cliente atual após o término da transação atual. A inclusão da palavra-chave `NO` suprime a conclusão de `CHAIN` ou `RELEASE`, o que pode ser útil se a variável de sistema `completion_type` estiver definida para causar a conclusão em cadeia ou liberação por padrão.

Iniciar uma transação faz com que qualquer transação pendente seja comprometida. Consulte a Seção 15.3.3, “Declarações que causam um compromisso implícito”, para obter mais informações.

Iniciar uma transação também faz com que as bloqueadas de tabela adquiridas com `LOCK TABLES` sejam liberadas, como se você tivesse executado `UNLOCK TABLES`. Iniciar uma transação não libera uma bloqueadora de leitura global adquirida com `FLUSH TABLES WITH READ LOCK`.

Para obter os melhores resultados, as transações devem ser realizadas usando apenas tabelas gerenciadas por um único mecanismo de armazenamento seguro para transações. Caso contrário, os seguintes problemas podem ocorrer:

- Se você usar tabelas de mais de um mecanismo de armazenamento seguro para transações (como `InnoDB`), e o nível de isolamento de transação não for `SERIALIZABLE`, é possível que, quando uma transação é confirmada, outra transação em andamento que usa as mesmas tabelas veja apenas algumas das alterações feitas pela primeira transação. Ou seja, a atomicidade das transações não é garantida com motores mistos e inconsistências podem resultar. (Se as transações com motores mistos forem raras, você pode usar `SET TRANSACTION ISOLATION LEVEL` para definir o nível de isolamento para `SERIALIZABLE` em uma base por transação, conforme necessário.)

- Se você usar tabelas que não são seguras para transações dentro de uma transação, as alterações nessas tabelas são armazenadas de uma vez, independentemente do status do modo de autocommit.

- Se você emitir uma declaração `ROLLBACK` após atualizar uma tabela não transacional dentro de uma transação, um aviso `ER_WARNING_NOT_COMPLETE_ROLLBACK` será exibido. As alterações em tabelas seguras para transações serão revertidas, mas não as alterações em tabelas não seguras para transações.

Cada transação é armazenada no log binário em um único bloco, após `COMMIT`. As transações que são revertidas não são registradas. (**Exceção**: As modificações em tabelas não transacionais não podem ser revertidas. Se uma transação que é revertida incluir modificações em tabelas não transacionais, toda a transação é registrada com uma declaração `ROLLBACK` no final para garantir que as modificações nas tabelas não transacionais sejam replicadas.) Veja a Seção 7.4.4, “O Log Binário”.

Você pode alterar o nível de isolamento ou o modo de acesso para transações com a instrução `SET TRANSACTION`. Veja a Seção 15.3.7, “Instrução SET TRANSACTION”.

O recuo pode ser uma operação lenta que pode ocorrer implicitamente sem que o usuário tenha solicitado explicitamente (por exemplo, quando ocorre um erro). Por isso, `SHOW PROCESSLIST` exibe `Rolling back` na coluna `State` para a sessão, não apenas para recuos explícitos realizados com a instrução `ROLLBACK`, mas também para recuos implícitos.

Nota

No MySQL 8.0, `BEGIN`, `COMMIT` e `ROLLBACK` não são afetados pelas regras de `--replicate-do-db` ou `--replicate-ignore-db`.

Quando o `InnoDB` realiza um rollback completo de uma transação, todos os bloqueios definidos pela transação são liberados. Se uma única instrução SQL dentro de uma transação for revertida como resultado de um erro, como um erro de chave duplicada, os bloqueios definidos pela instrução são preservados enquanto a transação permanece ativa. Isso acontece porque o `InnoDB` armazena os bloqueios de linha em um formato de tal forma que não pode saber depois qual bloqueio foi definido por qual instrução.

Se uma declaração `SELECT` dentro de uma transação chamar uma função armazenada, e uma declaração dentro da função armazenada falhar, essa declaração será revertida. Se `ROLLBACK` for executada para a transação subsequente, toda a transação será revertida.
