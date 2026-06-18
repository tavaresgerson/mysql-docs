### 24.4.18 A Tabela INFORMATION_SCHEMA INNODB_SYS_DATAFILES

A tabela `INNODB_SYS_DATAFILES` fornece informações de path de Data File para tablespaces `InnoDB` file-per-table e gerais, sendo equivalente às informações contidas na tabela `SYS_DATAFILES` no dicionário de dados `InnoDB`.

Para informações de uso e exemplos relacionados, consulte Seção 14.16.3, “Tabelas de Sistema INFORMATION_SCHEMA do InnoDB”.

Nota

A tabela `INFORMATION_SCHEMA` `FILES` relata metadados para todos os tipos de tablespace `InnoDB`, incluindo tablespaces file-per-table, tablespaces gerais, o system tablespace, o temporary tablespace e undo tablespaces, se presentes.

A tabela `INNODB_SYS_DATAFILES` possui as seguintes colunas:

* `SPACE`

  O ID do tablespace.

* `PATH`

  O path do Data File do tablespace. Se um tablespace file-per-table for criado em um local fora do diretório de dados do MySQL, o valor do path é um path de diretório totalmente qualificado. Caso contrário, o path é relativo ao diretório de dados.

#### Exemplo

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_DATAFILES WHERE SPACE = 57\G
*************************** 1. row ***************************
SPACE: 57
 PATH: ./test/t1.ibd
```

#### Notas

* Você deve ter o privilégio `PROCESS` para realizar uma Query nesta tabela.

* Use a tabela `INFORMATION_SCHEMA` `COLUMNS` ou a instrução `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores default.