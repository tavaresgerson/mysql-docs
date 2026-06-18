### 14.16.2 Informações de Transação e Locking do INFORMATION_SCHEMA do InnoDB

14.16.2.1 Usando as Informações de Transação e Locking do InnoDB

14.16.2.2 Informações de Lock e Lock-Wait do InnoDB

14.16.2.3 Persistência e Consistência das Informações de Transação e Locking do InnoDB

Três tabelas do `INFORMATION_SCHEMA` do `InnoDB` permitem que você monitore transações e diagnostique potenciais problemas de locking:

* `INNODB_TRX`: Fornece informações sobre cada transação atualmente em execução dentro do `InnoDB`, incluindo o estado da transação (por exemplo, se ela está sendo executada ou esperando por um `Lock`), quando a transação começou e a instrução SQL específica que a transação está executando.

* `INNODB_LOCKS`: Cada transação no `InnoDB` que está esperando que outra transação libere um `Lock` (`INNODB_TRX.TRX_STATE` é `LOCK WAIT`) é bloqueada por exatamente uma solicitação de `Lock` bloqueadora. Essa solicitação de `Lock` bloqueadora é para um `Lock` de linha ou tabela mantido por outra transação em um modo incompatível. Um `Lock` que bloqueia uma transação é sempre mantido em um modo incompatível com o modo do `Lock` solicitado (`read` versus `write`, `shared` versus `exclusive`). A transação bloqueada não pode prosseguir até que a outra transação faça `commit` ou `rollback`, liberando assim o `Lock` solicitado. Para cada transação bloqueada, `INNODB_LOCKS` contém uma linha que descreve cada `Lock` que a transação solicitou e pelo qual está esperando. `INNODB_LOCKS` também contém uma linha para cada `Lock` que está bloqueando outra transação, independentemente do estado da transação que detém o `Lock` (`INNODB_TRX.TRX_STATE` é `RUNNING`, `LOCK WAIT`, `ROLLING BACK` ou `COMMITTING`).

* `INNODB_LOCK_WAITS`: Esta tabela indica quais transações estão esperando por um determinado `Lock`, ou por qual `Lock` uma determinada transação está esperando. Esta tabela contém uma ou mais linhas para cada transação bloqueada, indicando o `Lock` que ela solicitou e quaisquer `Locks` que estejam bloqueando essa solicitação. O valor de `REQUESTED_LOCK_ID` se refere ao `Lock` solicitado por uma transação, e o valor de `BLOCKING_LOCK_ID` se refere ao `Lock` (mantido por outra transação) que impede a primeira transação de prosseguir. Para qualquer transação bloqueada, todas as linhas em `INNODB_LOCK_WAITS` têm o mesmo valor para `REQUESTED_LOCK_ID` e valores diferentes para `BLOCKING_LOCK_ID`.

Para mais informações sobre as tabelas anteriores, consulte a Seção 24.4.28, “The INFORMATION_SCHEMA INNODB_TRX Table”, a Seção 24.4.14, “The INFORMATION_SCHEMA INNODB_LOCKS Table”, e a Seção 24.4.15, “The INFORMATION_SCHEMA INNODB_LOCK_WAITS Table”.