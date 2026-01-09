### 24.4.20 Tabela INFORMATION_SCHEMA INNODB_SYS_FOREIGN

A tabela `INNODB_SYS_FOREIGN` (<https://dev.mysql.com/doc/refman/8.0/en/innodb-sys-foreign-table.html>) fornece metadados sobre as chaves estrangeiras do `InnoDB` (<https://dev.mysql.com/doc/refman/8.0/pt/glossary.html#glos_foreign_key>), equivalentes às informações da tabela `SYS_FOREIGN` no dicionário de dados do `InnoDB`.

Para informações de uso relacionadas e exemplos, consulte Seção 14.16.3, “Tabelas do Sistema InnoDB INFORMATION_SCHEMA”.

A tabela [`INNODB_SYS_FOREIGN`](https://pt.wikipedia.org/wiki/Tabela_INNODB_SYS_FOREIGN) tem as seguintes colunas:

- `ID`

  O nome (não um valor numérico) do índice da chave estrangeira, precedido pelo nome do esquema (banco de dados) (por exemplo, `test/produtos_fk`).

- `FOR_NAME`

  O nome da tabela child table nesta relação de chave estrangeira.

- `REF_NAME`

  O nome da tabela tabela pai nesta relação de chave estrangeira.

- `N_COLS`

  O número de colunas no índice da chave estrangeira.

- `TIPO`

  Uma coleção de bits com informações sobre a coluna de chave estrangeira, ORed juntas. 0 = `ON DELETE/UPDATE RESTRICT`, 1 = `ON DELETE CASCADE`, 2 = `ON DELETE SET NULL`, 4 = `ON UPDATE CASCADE`, 8 = `ON UPDATE SET NULL`, 16 = `ON DELETE NO ACTION`, 32 = `ON UPDATE NO ACTION`.

#### Exemplo

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_FOREIGN\G
*************************** 1. row ***************************
      ID: test/fk1
FOR_NAME: test/child
REF_NAME: test/parent
  N_COLS: 1
    TYPE: 1
```

#### Notas

- Você deve ter o privilégio `PROCESSO` para consultar esta tabela.

- Use a tabela `INFORMATION_SCHEMA` `COLUMNS` ou a instrução `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores padrão.
