### 24.4.19 A tabela INFORMATION\_SCHEMA INNODB\_SYS\_FIELDS

A tabela [`INNODB_SYS_FIELDS`](https://pt.wikipedia.org/wiki/Tabela_SYS_FIELDS) fornece metadados sobre as colunas-chave (campos) dos índices do `InnoDB`, equivalentes às informações da tabela `SYS_FIELDS` no dicionário de dados do `InnoDB`.

Para informações de uso relacionadas e exemplos, consulte Seção 14.16.3, “Tabelas do Sistema InnoDB INFORMATION\_SCHEMA”.

A tabela [`INNODB_SYS_FIELDS`](https://pt.wikipedia.org/wiki/Tabela_information-schema-innodb-sys-fields) tem essas colunas:

- `INDEX_ID`

  Um identificador para o índice associado a este campo chave; o mesmo valor que `INNODB_SYS_INDEXES.INDEX_ID`.

- `NOME`

  O nome da coluna original da tabela; o mesmo valor que `INNODB_SYS_COLUMNS.NAME`.

- `POS`

  A posição ordinal do campo chave dentro do índice, começando de 0 e incrementando sequencialmente. Quando uma coluna é removida, as colunas restantes são reordenadas para que a sequência não tenha lacunas.

#### Exemplo

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_FIELDS WHERE INDEX_ID = 117\G
*************************** 1. row ***************************
INDEX_ID: 117
    NAME: col1
     POS: 0
```

#### Notas

- Você deve ter o privilégio `PROCESSO` para consultar esta tabela.

- Use a tabela `INFORMATION_SCHEMA` `COLUMNS` ou a instrução `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores padrão.
