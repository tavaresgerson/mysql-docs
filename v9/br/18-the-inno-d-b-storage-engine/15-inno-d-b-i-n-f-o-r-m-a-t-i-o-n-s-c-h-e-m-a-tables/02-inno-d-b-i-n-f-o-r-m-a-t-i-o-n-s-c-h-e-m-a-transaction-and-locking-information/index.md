### 17.15.2 Informações sobre Transações e Bloqueios do InnoDB

17.15.2.1 Uso das Informações sobre Transações e Bloqueios do InnoDB

17.15.2.2 Informações sobre Bloqueios e Esperas de Bloqueio do InnoDB

17.15.2.3 Persistência e Consistência das Informações sobre Transações e Bloqueios do InnoDB

Uma tabela do `INFORMATION_SCHEMA` e duas tabelas do Schema de Desempenho permitem que você monitore as transações do `InnoDB` e diagnostique potenciais problemas de bloqueio:

* `INNODB_TRX`: Esta tabela do `INFORMATION_SCHEMA` fornece informações sobre cada transação atualmente em execução no `InnoDB`, incluindo o estado da transação (por exemplo, se está em execução ou aguardando um bloqueio), quando a transação começou e o comando SQL específico que a transação está executando.

* `data_locks`: Esta tabela do Schema de Desempenho contém uma linha para cada bloqueio mantido e cada solicitação de bloqueio que está bloqueada aguardando a liberação de um bloqueio mantido:

  + Há uma linha para cada bloqueio mantido, independentemente do estado da transação que mantém o bloqueio (`INNODB_TRX.TRX_STATE` é `RUNNING`, `LOCK WAIT`, `ROLLING BACK` ou `COMMITTING`).

  + Cada transação no InnoDB que está aguardando que outra transação libere um bloqueio (`INNODB_TRX.TRX_STATE` é `LOCK WAIT`) é bloqueada por exatamente uma solicitação de bloqueio que está bloqueando. Essa solicitação de bloqueio é para um bloqueio de linha ou tabela mantido por outra transação em um modo incompatível. Uma solicitação de bloqueio sempre tem um modo que é incompatível com o modo do bloqueio mantido que bloqueia a solicitação (leitura vs. escrita, compartilhada vs. exclusiva).

    A transação bloqueada não pode prosseguir até que a outra transação se comprometer ou reverta, liberando assim o bloqueio solicitado. Para cada transação bloqueada, `data_locks` contém uma linha que descreve cada bloqueio que a transação solicitou e para o qual está aguardando.

* `data_lock_waits`: Esta tabela do Schema de Desempenho indica quais transações estão aguardando um determinado bloqueio ou para qual bloqueio uma determinada transação está aguardando. Esta tabela contém uma ou mais linhas para cada transação bloqueada, indicando o bloqueio que ela solicitou e quaisquer bloqueadores desse pedido. O valor `REQUESTING_ENGINE_LOCK_ID` refere-se ao bloqueio solicitado por uma transação, e o valor `BLOCKING_ENGINE_LOCK_ID` refere-se ao bloqueio (mantido por outra transação) que impede a primeira transação de prosseguir. Para qualquer transação bloqueada dada, todas as linhas em `data_lock_waits` têm o mesmo valor para `REQUESTING_ENGINE_LOCK_ID` e valores diferentes para `BLOCKING_ENGINE_LOCK_ID`.

Para mais informações sobre as tabelas anteriores, consulte a Seção 28.4.28, “A Tabela INFORMATION_SCHEMA INNODB_TRX”, a Seção 29.12.13.1, “A Tabela data_locks” e a Seção 29.12.13.2, “A Tabela data_lock_waits”.