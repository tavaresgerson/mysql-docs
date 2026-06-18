### 24.4.20 A Tabela INNODB_SYS_FOREIGN do INFORMATION_SCHEMA

A tabela `INNODB_SYS_FOREIGN` fornece metadados sobre foreign keys do `InnoDB`, equivalente às informações da tabela `SYS_FOREIGN` no data dictionary do `InnoDB`.

Para informações de uso e exemplos relacionados, consulte Seção 14.16.3, “Tabelas do Sistema INFORMATION_SCHEMA do InnoDB”.

A tabela `INNODB_SYS_FOREIGN` possui as seguintes colunas:

* `ID`

  O nome (não um valor numérico) do Index da foreign key, precedido pelo nome do schema (Database) (por exemplo, `test/products_fk`).

* `FOR_NAME`

  O nome da child table neste relacionamento de foreign key.

* `REF_NAME`

  O nome da parent table neste relacionamento de foreign key.

* `N_COLS`

  O número de colunas no Index da foreign key.

* `TYPE`

  Uma coleção de bit flags com informações sobre a coluna da foreign key, combinadas com OR. 0 = `ON DELETE/UPDATE RESTRICT`, 1 = `ON DELETE CASCADE`, 2 = `ON DELETE SET NULL`, 4 = `ON UPDATE CASCADE`, 8 = `ON UPDATE SET NULL`, 16 = `ON DELETE NO ACTION`, 32 = `ON UPDATE NO ACTION`.

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

* Você deve ter o privilege `PROCESS` para realizar Query nesta tabela.

* Use a tabela `COLUMNS` do `INFORMATION_SCHEMA` ou o statement `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas desta tabela, incluindo data types e default values.