### 28.4.12 A Tabela `INFORMATION_SCHEMA.INNODB_FOREIGN`

A tabela `INNODB_FOREIGN` fornece metadados sobre as chaves estrangeiras `InnoDB`.

Para informações de uso relacionadas e exemplos, consulte a Seção 17.15.3, “Objetos de Schema do Schema INFORMATION_SCHEMA da InnoDB”.

A tabela `INNODB_FOREIGN` tem as seguintes colunas:

* `ID`

  O nome (não um valor numérico) do índice da chave estrangeira, precedido pelo nome do esquema (banco de dados) (por exemplo, `test/products_fk`).

* `FOR_NAME`

  O nome da tabela filho nesta relação de chave estrangeira.

* `REF_NAME`

  O nome da tabela pai nesta relação de chave estrangeira.

* `N_COLS`

  O número de colunas no índice da chave estrangeira.

* `TYPE`

  Uma coleção de bits com informações sobre a coluna da chave estrangeira, ORada juntas. 0 = `ON DELETE/UPDATE RESTRICT`, 1 = `ON DELETE CASCADE`, 2 = `ON DELETE SET NULL`, 4 = `ON UPDATE CASCADE`, 8 = `ON UPDATE SET NULL`, 16 = `ON DELETE NO ACTION`, 32 = `ON UPDATE NO ACTION`.

#### Exemplo

```
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_FOREIGN\G
*************************** 1. row ***************************
      ID: test/fk1
FOR_NAME: test/child
REF_NAME: test/parent
  N_COLS: 1
    TYPE: 1
```

#### Notas

* Você deve ter o privilégio `PROCESS` para consultar esta tabela.

* Use a tabela `COLUMNS` do `INFORMATION_SCHEMA` ou a instrução `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores padrão.