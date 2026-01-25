### 24.4.27 A Tabela INFORMATION_SCHEMA INNODB_TEMP_TABLE_INFO

A tabela [`INNODB_TEMP_TABLE_INFO`](information-schema-innodb-temp-table-info-table.html "24.4.27 The INFORMATION_SCHEMA INNODB_TEMP_TABLE_INFO Table") fornece informações sobre tabelas temporárias `InnoDB` criadas pelo usuário que estão ativas em uma instância `InnoDB`. Ela não fornece informações sobre tabelas temporárias `InnoDB` internas usadas pelo optimizer. A tabela [`INNODB_TEMP_TABLE_INFO`](information-schema-innodb-temp-table-info-table.html "24.4.27 The INFORMATION_SCHEMA INNODB_TEMP_TABLE_INFO Table") é criada quando consultada pela primeira vez, existe apenas na memória e não é persistida em disco.

Para informações de uso e exemplos, consulte [Seção 14.16.7, “Tabela de Informações de Tabela Temporária do INFORMATION_SCHEMA InnoDB”](innodb-information-schema-temp-table-info.html "14.16.7 InnoDB INFORMATION_SCHEMA Temporary Table Info Table").

A tabela [`INNODB_TEMP_TABLE_INFO`](information-schema-innodb-temp-table-info-table.html "24.4.27 The INFORMATION_SCHEMA INNODB_TEMP_TABLE_INFO Table") possui estas colunas:

* `TABLE_ID`

  O ID da tabela (table ID) da tabela temporária.

* `NAME`

  O nome da tabela temporária.

* `N_COLS`

  O número de colunas na tabela temporária. O número inclui três colunas ocultas criadas pelo `InnoDB` (`DB_ROW_ID`, `DB_TRX_ID` e `DB_ROLL_PTR`).

* `SPACE`

  O ID do tablespace temporário onde a tabela temporária reside. No 5.7, tabelas temporárias `InnoDB` não compactadas residem em um tablespace temporário compartilhado. O arquivo de dados para o tablespace temporário compartilhado é definido pela variável de sistema [`innodb_temp_data_file_path`](innodb-parameters.html#sysvar_innodb_temp_data_file_path). Por default, existe um único arquivo de dados para o tablespace temporário compartilhado chamado `ibtmp1`, que está localizado no diretório de dados. Tabelas temporárias compactadas residem em tablespaces separados (file-per-table), localizados no diretório de arquivos temporários definido por [`tmpdir`](server-system-variables.html#sysvar_tmpdir). O ID do tablespace temporário é um valor diferente de zero que é gerado dinamicamente na reinicialização do server.

* `PER_TABLE_TABLESPACE`

  Um valor `TRUE` indica que a tabela temporária reside em um tablespace separado (file-per-table). Um valor `FALSE` indica que a tabela temporária reside no tablespace temporário compartilhado.

* `IS_COMPRESSED`

  Um valor `TRUE` indica que a tabela temporária está compactada.

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

* Esta tabela é útil principalmente para monitoramento em nível de especialista.
* Você deve ter o privilégio [`PROCESS`](privileges-provided.html#priv_process) para consultar esta tabela.

* Use a tabela [`COLUMNS`](information-schema-columns-table.html "24.3.5 The INFORMATION_SCHEMA COLUMNS Table") do `INFORMATION_SCHEMA` ou a instrução [`SHOW COLUMNS`](show-columns.html "13.7.5.5 SHOW COLUMNS Statement") para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores default.