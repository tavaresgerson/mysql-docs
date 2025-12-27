### 28.4.11 A Tabela `INFORMATION_SCHEMA INNODB_FIELDS`

A tabela `INNODB_FIELDS` fornece metadados sobre as colunas-chave (campos) dos índices `InnoDB`.

Para informações de uso relacionadas e exemplos, consulte a Seção 17.15.3, “Objetos de esquema `INFORMATION_SCHEMA` da InnoDB”.

A tabela `INNODB_FIELDS` tem as seguintes colunas:

* `INDEX_ID`

  Um identificador do índice associado a este campo-chave; o mesmo valor que `INNODB_INDEXES.INDEX_ID`.

* `NAME`

  O nome da coluna original da tabela; o mesmo valor que `INNODB_COLUMNS.NAME`.

* `POS`

  A posição ordinal do campo-chave dentro do índice, começando de 0 e incrementando sequencialmente. Quando uma coluna é removida, as colunas restantes são reordenadas para que a sequência não tenha lacunas.

#### Exemplo

```
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_FIELDS WHERE INDEX_ID = 117\G
*************************** 1. row ***************************
INDEX_ID: 117
    NAME: col1
     POS: 0
```

#### Notas

* Você deve ter o privilégio `PROCESS` para consultar esta tabela.

* Use a tabela `COLUMNS` do `INFORMATION_SCHEMA` ou a instrução `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores padrão.