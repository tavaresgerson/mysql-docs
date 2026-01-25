### 24.4.15 A Tabela INFORMATION_SCHEMA INNODB_LOCK_WAITS

A tabela [`INNODB_LOCK_WAITS`](information-schema-innodb-lock-waits-table.html "24.4.15 The INFORMATION_SCHEMA INNODB_LOCK_WAITS Table") contém uma ou mais linhas para cada Transaction `InnoDB` bloqueada, indicando o Lock que ela solicitou e quaisquer Locks que estão bloqueando essa solicitação.

Nota

Esta tabela está obsoleta a partir do MySQL 5.7.14 e foi removida no MySQL 8.0.

A tabela [`INNODB_LOCK_WAITS`](information-schema-innodb-lock-waits-table.html "24.4.15 The INFORMATION_SCHEMA INNODB_LOCK_WAITS Table") possui as seguintes colunas:

* `REQUESTING_TRX_ID`

  O ID da Transaction solicitante (bloqueada).

* `REQUESTED_LOCK_ID`

  O ID do Lock pelo qual uma Transaction está esperando. Para obter detalhes sobre o Lock, faça um JOIN desta coluna com a coluna `LOCK_ID` da tabela [`INNODB_LOCKS`](information-schema-innodb-locks-table.html "24.4.14 The INFORMATION_SCHEMA INNODB_LOCKS Table").

* `BLOCKING_TRX_ID`

  O ID da Transaction bloqueadora.

* `BLOCKING_LOCK_ID`

  O ID de um Lock mantido por uma Transaction que está impedindo outra Transaction de prosseguir. Para obter detalhes sobre o Lock, faça um JOIN desta coluna com a coluna `LOCK_ID` da tabela [`INNODB_LOCKS`](information-schema-innodb-locks-table.html "24.4.14 The INFORMATION_SCHEMA INNODB_LOCKS Table").

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

* Use esta tabela para ajudar a diagnosticar problemas de performance que ocorrem durante períodos de alta carga concorrente. Seu conteúdo é atualizado conforme descrito em [Section 14.16.2.3, “Persistence and Consistency of InnoDB Transaction and Locking Information”](innodb-information-schema-internal-data.html "14.16.2.3 Persistence and Consistency of InnoDB Transaction and Locking Information").

* Você deve ter o privilégio [`PROCESS`](privileges-provided.html#priv_process) para fazer Query nesta tabela.

* Use a tabela [`COLUMNS`](information-schema-columns-table.html "24.3.5 The INFORMATION_SCHEMA COLUMNS Table") do `INFORMATION_SCHEMA` ou o Statement [`SHOW COLUMNS`](show-columns.html "13.7.5.5 SHOW COLUMNS Statement") para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores default.

* Para informações de uso, consulte [Section 14.16.2.1, “Using InnoDB Transaction and Locking Information”](innodb-information-schema-examples.html "14.16.2.1 Using InnoDB Transaction and Locking Information").