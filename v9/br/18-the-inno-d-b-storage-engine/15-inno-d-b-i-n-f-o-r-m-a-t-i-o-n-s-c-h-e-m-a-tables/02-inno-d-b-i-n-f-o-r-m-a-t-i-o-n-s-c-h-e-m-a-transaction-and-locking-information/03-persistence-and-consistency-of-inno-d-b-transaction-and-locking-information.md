#### 17.15.2.3 Persistência e Consistência das Informações de Transação e Bloqueio do InnoDB

Os dados expostos pelas tabelas de transação e bloqueio (`INFORMATION_SCHEMA` tabela `INNODB_TRX`, Schema de Desempenho `data_locks` e `data_lock_waits` tabelas) representam um vislumbre de dados em rápida mudança. Isso não é como as tabelas de usuários, onde os dados mudam apenas quando ocorrem atualizações iniciadas pela aplicação. Os dados subjacentes são dados gerenciados internamente pelo sistema e podem mudar muito rapidamente:

* Os dados podem não ser consistentes entre as tabelas `INNODB_TRX`, `data_locks` e `data_lock_waits`.

  As tabelas `data_locks` e `data_lock_waits` exibem dados em tempo real do motor de armazenamento `InnoDB`, para fornecer informações de bloqueio sobre as transações na tabela `INNODB_TRX`. Os dados recuperados das tabelas de bloqueio existem quando o `SELECT` é executado, mas podem ter desaparecido ou sido alterados até que o resultado da consulta seja consumido pelo cliente.

  A junção de `data_locks` com `data_lock_waits` pode mostrar linhas em `data_lock_waits` que identificam uma linha pai em `data_locks` que não existe mais ou ainda não existe.

* Os dados nas tabelas de transação e bloqueio podem não ser consistentes com os dados na tabela `INFORMATION_SCHEMA` `PROCESSLIST` ou na tabela `threads` do Schema de Desempenho.

  Por exemplo, você deve ter cuidado ao comparar dados nas tabelas de transação e bloqueio do `InnoDB` com dados na tabela `PROCESSLIST`. Mesmo que você execute um único `SELECT` (junção de `INNODB_TRX` e `PROCESSLIST`, por exemplo), o conteúdo dessas tabelas geralmente não é consistente. É possível que `INNODB_TRX` refira linhas que não estão presentes em `PROCESSLIST` ou que a consulta SQL atualmente em execução de uma transação mostrada em `INNODB_TRX.TRX_QUERY` difira daquela em `PROCESSLIST.INFO`.