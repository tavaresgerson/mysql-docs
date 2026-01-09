### 24.4.15 A tabela INFORMATION_SCHEMA INNODB_LOCK_WAITS

A tabela [`INNODB_LOCK_WAITS`](https://pt.wikipedia.org/wiki/Tabela_de_esperas_de_bloqueio_InnoDB) contém uma ou mais linhas para cada transação `InnoDB` bloqueada, indicando o bloqueio que ela solicitou e quaisquer bloqueios que estejam bloqueando essa solicitação.

Nota

Esta tabela é desaconselhada a partir do MySQL 5.7.14 e será removida no MySQL 8.0.

A tabela [`INNODB_LOCK_WAITS`](https://pt.wikipedia.org/wiki/Tabela_innodb_lock_waits) tem as seguintes colunas:

- `REQUESTING_TRX_ID`

  O ID da transação solicitada (bloqueada).

- `REQUESTED_LOCK_ID`

  O ID do bloqueio para o qual uma transação está aguardando. Para obter detalhes sobre o bloqueio, combine esta coluna com a coluna `LOCK_ID` da tabela `[INNODB_LOCKS](https://pt.wikipedia.org/wiki/Tabela_INNODB_LOCKS)`.

- `BLOCKING_TRX_ID`

  O ID da transação que está sendo bloqueada.

- `BLOCKING_LOCK_ID`

  O ID de um bloqueio que impede outra transação de prosseguir. Para obter detalhes sobre o bloqueio, combine esta coluna com a coluna `LOCK_ID` da tabela `[INNODB_LOCKS]` (tabela `information-schema-innodb-locks`).

#### Exemplo

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_LOCK_WAITS\G
*************************** 1. row ***************************
requesting_trx_id: 3396
requested_lock_id: 3396:91:3:2
  blocking_trx_id: 3395
 blocking_lock_id: 3395:91:3:2
```

#### Notas

- Use esta tabela para ajudar a diagnosticar problemas de desempenho que ocorrem durante períodos de alta carga concorrente. Seu conteúdo é atualizado conforme descrito em Seção 14.16.2.3, “Persistência e Consistência das Informações de Transação e Bloqueio do InnoDB”.

- Você deve ter o privilégio `PROCESSO` para consultar esta tabela.

- Use a tabela `INFORMATION_SCHEMA` `COLUMNS` ou a instrução `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores padrão.

- Para informações sobre o uso, consulte Seção 14.16.2.1, “Usando informações de transação e bloqueio do InnoDB”.
