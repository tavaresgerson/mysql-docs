### 24.4.14 A tabela INFORMATION_SCHEMA INNODB_LOCKS

A tabela [`INNODB_LOCKS`](https://pt.wikipedia.org/wiki/Tabela_innodb_locks) fornece informações sobre cada bloqueio que uma transação `InnoDB` solicitou, mas ainda não adquiriu, e sobre cada bloqueio que uma transação mantém e está bloqueando outra transação.

Nota

Esta tabela é desaconselhada a partir do MySQL 5.7.14 e será removida no MySQL 8.0.

A tabela `INNODB_LOCKS` tem as seguintes colunas:

- `LOCK_ID`

  Um número de identificação de bloqueio único, interno ao `InnoDB`. Trate-o como uma string opaca. Embora o `LOCK_ID` atualmente contenha `TRX_ID`, o formato dos dados no `LOCK_ID` está sujeito a alterações a qualquer momento. Não escreva aplicações que parsem o valor do `LOCK_ID`.

- `LOCK_TRX_ID`

  O ID da transação que contém o bloqueio. Para obter detalhes sobre a transação, combine esta coluna com a coluna `TRX_ID` da tabela `[INNODB_TRX]` (information-schema-innodb-trx-table.html).

- `LOCK_MODE`

  Como o bloqueio é solicitado. Os descritores de modo de bloqueio permitidos são `S`, `X`, `IS`, `IX`, `GAP`, `AUTO_INC` e `UNKNOWN`. Os descritores de modo de bloqueio podem ser usados em combinação para identificar modos de bloqueio específicos. Para informações sobre os modos de bloqueio do `InnoDB`, consulte Seção 14.7.1, “Bloqueio do InnoDB”.

- `LOCK_TYPE`

  O tipo de bloqueio. Os valores permitidos são `RECORD` para um bloqueio de nível de linha e `TABLE` para um bloqueio de nível de tabela.

- `LOCK_TABLE`

  O nome da tabela que foi bloqueada ou contém registros bloqueados.

- `LOCK_INDEX`

  O nome do índice, se `LOCK_TYPE` for `RECORD`; caso contrário, `NULL`.

- `LOCK_SPACE`

  O ID do espaço de tabela do registro bloqueado, se `LOCK_TYPE` for `RECORD`; caso contrário, `NULL`.

- `LOCK_PAGE`

  O número da página do registro bloqueado, se `LOCK_TYPE` for `RECORD`; caso contrário, `NULL`.

- `LOCK_REC`

  O número de pilha do registro bloqueado dentro da página, se `LOCK_TYPE` for `RECORD`; caso contrário, `NULL`.

- `LOCK_DATA`

  Os dados associados ao bloqueio, se houver. Um valor é exibido se o `LOCK_TYPE` for `RECORD`, caso contrário, o valor é `NULL`. Os valores da chave primária do registro bloqueado são exibidos para um bloqueio colocado no índice de chave primária. Os valores do índice secundário do registro bloqueado são exibidos para um bloqueio colocado em um índice secundário único. Os valores do índice secundário são exibidos com os valores da chave primária anexados, se o índice secundário não for único. Se não houver chave primária, `LOCK_DATA` exibe os valores da chave de um índice único selecionado ou o número de ID de linha interno `InnoDB` único, de acordo com as regras que regem o uso de índices agrupados `InnoDB` (veja Seção 14.6.2.1, “Indizes Agrupados e Secundários”). `LOCK_DATA` relata “pseudo-registro supremo” para um bloqueio tomado em um pseudo-registro supremo. Se a página contendo o registro bloqueado não estiver no pool de buffers porque foi escrita no disco enquanto o bloqueio estava sendo mantido, o `InnoDB` não carrega a página do disco. Em vez disso, `LOCK_DATA` relata `NULL`.

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

- Use esta tabela para ajudar a diagnosticar problemas de desempenho que ocorrem durante períodos de alta carga concorrente. Seu conteúdo é atualizado conforme descrito em Seção 14.16.2.3, “Persistência e Consistência das Informações de Transação e Bloqueio do InnoDB”.

- Você deve ter o privilégio `PROCESSO` para consultar esta tabela.

- Use a tabela `INFORMATION_SCHEMA` `COLUMNS` ou a instrução `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores padrão.

- Para informações sobre o uso, consulte Seção 14.16.2.1, “Usando informações de transação e bloqueio do InnoDB”.
