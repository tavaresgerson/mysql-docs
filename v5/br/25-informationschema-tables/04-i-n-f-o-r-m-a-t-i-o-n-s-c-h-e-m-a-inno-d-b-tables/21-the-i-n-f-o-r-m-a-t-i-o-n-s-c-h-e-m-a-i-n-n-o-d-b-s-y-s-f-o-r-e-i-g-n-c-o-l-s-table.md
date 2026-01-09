### 24.4.21 A tabela INFORMATION_SCHEMA INNODB_SYS_FOREIGN_COLS

A tabela [`INNODB_SYS_FOREIGN_COLS`](https://pt.wikipedia.org/wiki/Tabela_innodb_sys_foreign_cols) fornece informações de status sobre as colunas das chaves estrangeiras do `InnoDB`, equivalentes às informações da tabela `SYS_FOREIGN_COLS` no dicionário de dados do `InnoDB`.

Para informações de uso relacionadas e exemplos, consulte Seção 14.16.3, “Tabelas do Sistema InnoDB INFORMATION_SCHEMA”.

A tabela [`INNODB_SYS_FOREIGN_COLS`](https://pt.wikipedia.org/wiki/Tabela_information-schema-innodb-sys-foreign-cols) possui as seguintes colunas:

- `ID`

  O índice de chave estrangeira associado a este campo de chave de índice, usando o mesmo valor que `INNODB_SYS_FOREIGN.ID`.

- `FOR_COL_NAME`

  O nome da coluna associada na tabela filha.

- `REF_COL_NAME`

  O nome da coluna associada à tabela principal.

- `POS`

  A posição ordinal deste campo chave dentro do índice de chave estrangeira, a partir de 0.

#### Exemplo

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_FOREIGN_COLS WHERE ID = 'test/fk1'\G
*************************** 1. row ***************************
          ID: test/fk1
FOR_COL_NAME: parent_id
REF_COL_NAME: id
         POS: 0
```

#### Notas

- Você deve ter o privilégio `PROCESSO` para consultar esta tabela.

- Use a tabela `INFORMATION_SCHEMA` `COLUMNS` ou a instrução `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores padrão.
