### 14.16.2 Informações de transação e bloqueio do esquema de informações InnoDB

14.16.2.1 Usando Informações de Transação e Bloqueio do InnoDB

14.16.2.2 Informações sobre bloqueio e espera de bloqueio do InnoDB

14.16.2.3 Persistência e Consistência das Informações de Transação e Bloqueio do InnoDB

Três tabelas do `INFORMATION_SCHEMA` do `InnoDB` permitem que você monitore as transações e diagnostique potenciais problemas de bloqueio:

- `INNODB_TRX`: Fornece informações sobre cada transação atualmente em execução dentro do `InnoDB`, incluindo o estado da transação (por exemplo, se está em execução ou aguardando um bloqueio), quando a transação começou e o comando SQL específico que a transação está executando.

- `INNODB_LOCKS`: Cada transação no InnoDB que está aguardando que outra transação libere um bloqueio (`INNODB_TRX.TRX_STATE` está em `LOCK WAIT`) é bloqueada por exatamente um pedido de bloqueio. Esse pedido de bloqueio é para um bloqueio de linha ou tabela mantido por outra transação em um modo incompatível. Um bloqueio que bloqueia uma transação é sempre mantido em um modo incompatível com o modo do bloqueio solicitado (leitura vs. escrita, compartilhado vs. exclusivo). A transação bloqueada não pode prosseguir até que a outra transação se comprometer ou reverta, liberando assim o bloqueio solicitado. Para cada transação bloqueada, `INNODB_LOCKS` contém uma linha que descreve cada bloqueio que a transação solicitou e para o qual está aguardando. `INNODB_LOCKS` também contém uma linha para cada bloqueio que está bloqueando outra transação, independentemente do estado da transação que mantém o bloqueio (`INNODB_TRX.TRX_STATE` está em `RUNNING`, `LOCK WAIT`, `ROLLING BACK` ou `COMMITTING`).

- `INNODB_LOCK_WAITS`: Esta tabela indica quais transações estão aguardando um determinado bloqueio ou para qual bloqueio uma determinada transação está aguardando. Esta tabela contém uma ou mais linhas para cada transação bloqueada, indicando o bloqueio que ela solicitou e quaisquer bloqueios que estão impedindo esse pedido. O valor `REQUESTED_LOCK_ID` refere-se ao bloqueio solicitado por uma transação, e o valor `BLOCKING_LOCK_ID` refere-se ao bloqueio (mantido por outra transação) que impede a primeira transação de prosseguir. Para qualquer transação bloqueada dada, todas as linhas em `INNODB_LOCK_WAITS` têm o mesmo valor para `REQUESTED_LOCK_ID` e valores diferentes para `BLOCKING_LOCK_ID`.

Para obter mais informações sobre as tabelas anteriores, consulte a Seção 24.4.28, “A Tabela INFORMATION\_SCHEMA INNODB\_TRX”, a Seção 24.4.14, “A Tabela INFORMATION\_SCHEMA INNODB\_LOCKS” e a Seção 24.4.15, “A Tabela INFORMATION\_SCHEMA INNODB\_LOCK\_WAITS”.
