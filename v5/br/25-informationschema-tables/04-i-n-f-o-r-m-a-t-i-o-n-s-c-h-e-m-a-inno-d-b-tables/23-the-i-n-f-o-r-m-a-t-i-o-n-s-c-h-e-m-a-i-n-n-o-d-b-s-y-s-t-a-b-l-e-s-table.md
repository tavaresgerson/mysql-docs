### 24.4.23 A tabela INFORMATION_SCHEMA INNODB_SYS_TABLES

A tabela [`INNODB_SYS_TABLES`](https://docs.oracle.com/en/database/sql/information-schema/sql/innodb_sys_tables.html) fornece metadados sobre as tabelas `InnoDB`, equivalentes às informações da tabela `SYS_TABLES` no dicionário de dados `InnoDB`.

Para informações de uso relacionadas e exemplos, consulte Seção 14.16.3, “Tabelas do Sistema InnoDB INFORMATION_SCHEMA”.

A tabela [`INNODB_SYS_TABLES`](https://docs.oracle.com/en/database/sql/information-schema/sql/innodb_sys_tables.html) possui as seguintes colunas:

- `TABLE_ID`

  Um identificador para a tabela `InnoDB`. Esse valor é único em todos os bancos de dados da instância.

- `NOME`

  O nome da tabela, precedido pelo nome do esquema (banco de dados), quando aplicável (por exemplo, `test/t1`). Os nomes dos bancos de dados e das tabelas de usuários estão no mesmo caso em que foram originalmente definidos, possivelmente influenciados pela configuração `lower_case_table_names`.

- `FLAG`

  Um valor numérico que representa informações de nível de bits sobre o formato da tabela e as características de armazenamento.

- `N_COLS`

  O número de colunas na tabela. O número reportado inclui três colunas ocultas que são criadas pelo `InnoDB` (`DB_ROW_ID`, `DB_TRX_ID` e `DB_ROLL_PTR`). O número reportado também inclui colunas geradas virtualmente (glossary.html#glos_virtual_generated_column), se estiverem presentes.

- `ESPACO`

  Um identificador para o espaço de tabelas onde a tabela reside. 0 significa o espaço de tabelas `InnoDB` espaço de tabelas do sistema. Qualquer outro número representa um espaço de tabelas `file-per-table` espaço de tabelas por arquivo ou um espaço de tabelas geral. Esse identificador permanece o mesmo após uma instrução `TRUNCATE TABLE`. Para espaços de tabelas por arquivo, esse identificador é único para tabelas em todos os bancos de dados da instância.

- `FORMATO_ARQUIVO`

  O formato de arquivo da tabela (`Antelope` ou `Barracuda`).

- `ROW_FORMAT`

  O formato da linha da tabela (`Compact`, `Redundant`, `Dynamic` ou `Compressed`).

- `ZIP_PAGE_SIZE`

  O tamanho do arquivo ZIP. Aplica-se apenas a tabelas com um formato de linha de `Compressido`.

- `TIPO_ESPACO`

  O tipo de espaço de tabela ao qual a tabela pertence. Os valores possíveis incluem `System` para o espaço de tabela do sistema, `General` para espaços de tabela gerais e `Single` para espaços de tabela por arquivo. As tabelas atribuídas ao espaço de tabela do sistema usando `CREATE TABLE` ou `ALTER TABLE` `TABLESPACE=innodb_system` têm um `SPACE_TYPE` de `General`. Para mais informações, consulte `CREATE TABLESPACE`.

#### Exemplo

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_TABLES WHERE TABLE_ID = 214\G
*************************** 1. row ***************************
     TABLE_ID: 214
         NAME: test/t1
         FLAG: 129
       N_COLS: 4
        SPACE: 233
  FILE_FORMAT: Antelope
   ROW_FORMAT: Compact
ZIP_PAGE_SIZE: 0
   SPACE_TYPE: General
```

#### Notas

- Você deve ter o privilégio `PROCESSO` para consultar esta tabela.

- Use a tabela `INFORMATION_SCHEMA` `COLUMNS` ou a instrução `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores padrão.
