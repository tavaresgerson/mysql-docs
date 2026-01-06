### 24.4.27 A tabela INFORMATION\_SCHEMA INNODB\_TEMP\_TABLE\_INFO

A tabela [`INNODB_TEMP_TABLE_INFO`](https://pt.wikipedia.org/wiki/Tabela_de_informa%C3%A7%C3%A3o_InnoDB_tempor%C3%A1ria) fornece informações sobre as tabelas temporárias `InnoDB` criadas pelo usuário que estão ativas em uma instância `InnoDB`. Ela não fornece informações sobre as tabelas temporárias `InnoDB` internas usadas pelo otimizador. A tabela [`INNODB_TEMP_TABLE_INFO`](https://pt.wikipedia.org/wiki/Tabela_de_informa%C3%A7%C3%A3o_InnoDB_tempor%C3%A1ria) é criada quando consultada pela primeira vez, existe apenas na memória e não é persistida no disco.

Para informações de uso e exemplos, consulte Seção 14.16.7, “Tabela de informações temporárias do InnoDB INFORMATION\_SCHEMA”.

A tabela [`INNODB_TEMP_TABLE_INFO`](https://docs.oracle.com/en/database/sql/information-schema/innodb/innodb-temp-table-info-table.html) possui as seguintes colunas:

- `TABLE_ID`

  O ID da tabela temporária.

- `NOME`

  O nome da tabela temporária.

- `N_COLS`

  O número de colunas na tabela temporária. O número inclui três colunas ocultas criadas pelo `InnoDB` (`DB_ROW_ID`, `DB_TRX_ID` e `DB_ROLL_PTR`).

- `ESPACO`

  O ID do espaço de tabelas temporário onde a tabela temporária reside. Em 5.7, as tabelas temporárias não compactadas do `InnoDB` residem em um espaço de tabelas temporárias compartilhado. O arquivo de dados para o espaço de tabelas temporárias compartilhado é definido pela variável de sistema `innodb_temp_data_file_path`. Por padrão, há um único arquivo de dados para o espaço de tabelas temporárias compartilhado, denominado `ibtmp1`, que está localizado no diretório de dados. As tabelas temporárias compactadas residem em espaços de tabelas separados por arquivo localizados no diretório de arquivos temporários definido por `tmpdir`. O ID do espaço de tabelas temporárias é um valor não nulo que é gerado dinamicamente ao reiniciar o servidor.

- `PER_TABLE_TABLESPACE`

  Um valor de `TRUE` indica que a tabela temporária reside em um espaço de tabelas separado por arquivo. Um valor de `FALSE` indica que a tabela temporária reside no espaço de tabelas temporárias compartilhado.

- `IS_COMPRESSED`

  Um valor de `TRUE` indica que a tabela temporária está comprimida.

#### Exemplo

```sql
mysql> CREATE TEMPORARY TABLE t1 (c1 INT PRIMARY KEY) ENGINE=INNODB;

mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_TEMP_TABLE_INFO\G
*************************** 1. row ***************************
            TABLE_ID: 38
                NAME: #sql26cf_6_0
              N_COLS: 4
               SPACE: 52
PER_TABLE_TABLESPACE: FALSE
       IS_COMPRESSED: FALSE
```

#### Notas

- Esta tabela é útil principalmente para monitoramento de nível de especialista.

- Você deve ter o privilégio `PROCESSO` para consultar esta tabela.

- Use a tabela `INFORMATION_SCHEMA` `COLUMNS` ou a instrução `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores padrão.
