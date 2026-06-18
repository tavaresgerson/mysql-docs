#### 17.15.2.3 Persistência e Consistência das Informações de Transação e Bloqueio do InnoDB

Nota

Esta seção descreve as informações de bloqueio expostas pelas tabelas do Schema de Desempenho `data_locks` e `data_lock_waits`, que substituem as tabelas `INFORMATION_SCHEMA` `INNODB_LOCKS` e `INNODB_LOCK_WAITS` no MySQL 8.0. Para uma discussão semelhante escrita em termos das tabelas mais antigas `INFORMATION_SCHEMA`, consulte a seção Persistência e Consistência de Transações e Informações de Bloqueio do InnoDB, no Manual de Referência do MySQL 5.7.

Os dados expostos pelas tabelas de transação e bloqueio (as tabelas `INFORMATION_SCHEMA` `INNODB_TRX` do Schema de Desempenho `data_locks` e `data_lock_waits` representam um vislumbre de dados em rápida mudança. Isso não é como as tabelas de usuários, onde os dados mudam apenas quando ocorrem atualizações iniciadas pelo aplicativo. Os dados subjacentes são dados gerenciados internamente pelo sistema e podem mudar muito rapidamente:

- Os dados podem não ser consistentes entre as tabelas `INNODB_TRX`, `data_locks` e `data_lock_waits`.

  As tabelas `data_locks` e `data_lock_waits` exibem dados em tempo real do mecanismo de armazenamento `InnoDB`, para fornecer informações de bloqueio sobre as transações na tabela `INNODB_TRX`. Os dados recuperados das tabelas de bloqueio existem quando o `SELECT` é executado, mas podem ter sido apagados ou alterados até que o resultado da consulta seja consumido pelo cliente.

  A combinação de `data_locks` com `data_lock_waits` pode mostrar linhas em `data_lock_waits` que identificam uma linha pai em `data_locks` que já não existe ou ainda não existe.

- Os dados nas tabelas de transação e bloqueio podem não estar consistentes com os dados nas tabelas `INFORMATION_SCHEMA` `PROCESSLIST` ou Performance Schema `threads`.

  Por exemplo, você deve ter cuidado ao comparar dados na transação `InnoDB` e nas tabelas de bloqueio com dados na tabela `PROCESSLIST`. Mesmo que você emita um único `SELECT` (juntando `INNODB_TRX` e `PROCESSLIST`, por exemplo), o conteúdo dessas tabelas geralmente não é consistente. É possível que o `INNODB_TRX` faça referência a linhas que não estão presentes em `PROCESSLIST` ou que a consulta SQL atualmente executada de uma transação mostrada em `INNODB_TRX.TRX_QUERY` difira daquela em `PROCESSLIST.INFO`.
