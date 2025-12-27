### 28.4.13 A Tabela INFORMATION_SCHEMA INNODB_FOREIGN_COLS

A tabela `INNODB_FOREIGN_COLS` fornece informações de status sobre as colunas de chave estrangeira `InnoDB`.

Para informações de uso relacionadas e exemplos, consulte a Seção 17.15.3, “Objetos de esquema INFORMATION_SCHEMA do InnoDB”.

A tabela `INNODB_FOREIGN_COLS` tem as seguintes colunas:

* `ID`

  O índice de chave estrangeira associado a este campo de chave primária; o mesmo valor que `INNODB_FOREIGN.ID`.

* `FOR_COL_NAME`

  O nome da coluna associada na tabela filho.

* `REF_COL_NAME`

  O nome da coluna associada na tabela pai.

* `POS`

  A posição ordinal deste campo de chave dentro do índice de chave estrangeira, começando de 0.

#### Exemplo

```
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_FOREIGN_COLS WHERE ID = 'test/fk1'\G
*************************** 1. row ***************************
          ID: test/fk1
FOR_COL_NAME: parent_id
REF_COL_NAME: id
         POS: 0
```

#### Notas

* Você deve ter o privilégio `PROCESS` para consultar esta tabela.

* Use a tabela `COLUMNS` do `INFORMATION_SCHEMA` ou a instrução `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores padrão.