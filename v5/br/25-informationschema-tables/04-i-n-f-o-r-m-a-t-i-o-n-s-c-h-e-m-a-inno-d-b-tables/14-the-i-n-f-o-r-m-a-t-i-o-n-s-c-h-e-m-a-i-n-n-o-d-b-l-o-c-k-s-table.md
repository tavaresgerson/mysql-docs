### 24.4.14 A Tabela INNODB_LOCKS do INFORMATION_SCHEMA

A tabela [`INNODB_LOCKS`](information-schema-innodb-locks-table.html "24.4.14 A Tabela INNODB_LOCKS do INFORMATION_SCHEMA") fornece informações sobre cada Lock que uma Transaction `InnoDB` solicitou, mas ainda não adquiriu, e cada Lock que uma Transaction possui e que está bloqueando outra Transaction.

Nota

Esta tabela está obsoleta (deprecated) a partir do MySQL 5.7.14 e foi removida no MySQL 8.0.

A tabela [`INNODB_LOCKS`](information-schema-innodb-locks-table.html "24.4.14 A Tabela INNODB_LOCKS do INFORMATION_SCHEMA") possui as seguintes colunas:

* `LOCK_ID`

  Um número de ID de Lock exclusivo, interno ao `InnoDB`. Trate-o como uma string opaca. Embora o `LOCK_ID` atualmente contenha o `TRX_ID`, o formato dos dados no `LOCK_ID` está sujeito a alterações a qualquer momento. Não escreva aplicações que façam parse do valor de `LOCK_ID`.

* `LOCK_TRX_ID`

  O ID da Transaction que possui o Lock. Para obter detalhes sobre a Transaction, faça um JOIN desta coluna com a coluna `TRX_ID` da tabela [`INNODB_TRX`](information-schema-innodb-trx-table.html "24.4.28 A Tabela INNODB_TRX do INFORMATION_SCHEMA").

* `LOCK_MODE`

  Como o Lock é solicitado. Os descritores de Lock mode permitidos são `S`, `X`, `IS`, `IX`, `GAP`, `AUTO_INC` e `UNKNOWN`. Os descritores de Lock mode podem ser usados em combinação para identificar modos de Lock específicos. Para obter informações sobre os modos de Lock do `InnoDB`, consulte [Section 14.7.1, “InnoDB Locking”](innodb-locking.html "14.7.1 InnoDB Locking").

* `LOCK_TYPE`

  O tipo de Lock. Os valores permitidos são `RECORD` para um Lock no nível de linha (row-level lock), `TABLE` para um Lock no nível de tabela (table-level lock).

* `LOCK_TABLE`

  O nome da tabela que foi bloqueada ou que contém registros bloqueados.

* `LOCK_INDEX`

  O nome do Index, se `LOCK_TYPE` for `RECORD`; caso contrário, `NULL`.

* `LOCK_SPACE`

  O ID do tablespace do registro bloqueado, se `LOCK_TYPE` for `RECORD`; caso contrário, `NULL`.

* `LOCK_PAGE`

  O número da page do registro bloqueado, se `LOCK_TYPE` for `RECORD`; caso contrário, `NULL`.

* `LOCK_REC`

  O número heap do registro bloqueado dentro da page, se `LOCK_TYPE` for `RECORD`; caso contrário, `NULL`.

* `LOCK_DATA`

  Os dados associados ao Lock, se houver. Um valor é exibido se o `LOCK_TYPE` for `RECORD`, caso contrário o valor é `NULL`. Os valores da Primary Key do registro bloqueado são exibidos para um Lock colocado no Primary Key Index. Os valores do Secondary Index do registro bloqueado são exibidos para um Lock colocado em um Secondary Index exclusivo (unique). Os valores do Secondary Index são exibidos com os valores da Primary Key anexados se o Secondary Index não for exclusivo. Se não houver Primary Key, `LOCK_DATA` exibe os valores de chave de um Index exclusivo selecionado ou o número de ID de linha interno exclusivo do `InnoDB`, de acordo com as regras que governam o uso do clustered index do `InnoDB` (consulte [Section 14.6.2.1, “Clustered and Secondary Indexes”](innodb-index-types.html "14.6.2.1 Clustered and Secondary Indexes")). `LOCK_DATA` reporta “supremum pseudo-record” para um Lock aplicado a um pseudo-registro supremum. Se a page contendo o registro bloqueado não estiver no Buffer Pool porque foi escrita no disco enquanto o Lock estava sendo mantido, o `InnoDB` não busca a page do disco. Em vez disso, `LOCK_DATA` reporta `NULL`.

#### Exemplo

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_LOCKS\G
*************************** 1. row ***************************
    lock_id: 3723:72:3:2
lock_trx_id: 3723
  lock_mode: X
  lock_type: RECORD
 lock_table: `mysql`.`t`
 lock_index: PRIMARY
 lock_space: 72
  lock_page: 3
   lock_rec: 2
  lock_data: 1, 9
*************************** 2. row ***************************
    lock_id: 3722:72:3:2
lock_trx_id: 3722
  lock_mode: S
  lock_type: RECORD
 lock_table: `mysql`.`t`
 lock_index: PRIMARY
 lock_space: 72
  lock_page: 3
   lock_rec: 2
  lock_data: 1, 9
```

#### Notas

* Use esta tabela para ajudar a diagnosticar problemas de performance que ocorrem em momentos de alta carga concorrente. Seu conteúdo é atualizado conforme descrito em [Section 14.16.2.3, “Persistence and Consistency of InnoDB Transaction and Locking Information”](innodb-information-schema-internal-data.html "14.16.2.3 Persistence and Consistency of InnoDB Transaction and Locking Information").

* Você deve ter o privilégio [`PROCESS`](privileges-provided.html#priv_process) para realizar Query nesta tabela.

* Use a tabela [`COLUMNS`](information-schema-columns-table.html "24.3.5 The INFORMATION_SCHEMA COLUMNS Table") do `INFORMATION_SCHEMA` ou o comando [`SHOW COLUMNS`](show-columns.html "13.7.5.5 SHOW COLUMNS Statement") para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores default.

* Para informações de uso, consulte [Section 14.16.2.1, “Using InnoDB Transaction and Locking Information”](innodb-information-schema-examples.html "14.16.2.1 Using InnoDB Transaction and Locking Information").