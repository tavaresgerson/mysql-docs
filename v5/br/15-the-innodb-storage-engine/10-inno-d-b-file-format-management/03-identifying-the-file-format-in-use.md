### 14.10.3 Identificando o File Format em Uso

Se você habilitar um `file format` diferente usando a opção de configuração `innodb_file_format`, a alteração se aplica apenas a tabelas recém-criadas. Além disso, quando você cria uma nova tabela, o `tablespace` que contém a tabela é marcado com o `file format` “mais antigo” ou “mais simples” que é necessário para suportar os recursos da tabela. Por exemplo, se você habilitar o `file format` `Barracuda` e criar uma nova tabela que não use o `row format` Dynamic ou Compressed, o novo `tablespace` que contém a tabela é marcado como utilizando o `file format` `Antelope`.

É fácil identificar o `file format` usado por uma determinada tabela. A tabela usa o `file format` `Antelope` se o `row format` relatado por `SHOW TABLE STATUS` for `Compact` ou `Redundant`. A tabela usa o `file format` `Barracuda` se o `row format` relatado por `SHOW TABLE STATUS` for `Compressed` ou `Dynamic`.

```sql
mysql> SHOW TABLE STATUS\G
*************************** 1. row ***************************
           Name: t1
         Engine: InnoDB
        Version: 10
     Row_format: Compact
           Rows: 0
 Avg_row_length: 0
    Data_length: 16384
Max_data_length: 0
   Index_length: 16384
      Data_free: 0
 Auto_increment: 1
    Create_time: 2014-11-03 13:32:10
    Update_time: NULL
     Check_time: NULL
      Collation: latin1_swedish_ci
       Checksum: NULL
 Create_options:
        Comment:
```

Você também pode identificar o `file format` usado por uma determinada tabela ou `tablespace` usando as tabelas `INFORMATION_SCHEMA` do `InnoDB`. Por exemplo:

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_TABLES WHERE NAME='test/t1'\G
*************************** 1. row ***************************
     TABLE_ID: 44
         NAME: test/t1
         FLAG: 1
       N_COLS: 6
        SPACE: 30
  FILE_FORMAT: Antelope
   ROW_FORMAT: Compact
ZIP_PAGE_SIZE: 0

mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_TABLESPACES WHERE NAME='test/t1'\G
*************************** 1. row ***************************
        SPACE: 30
         NAME: test/t1
         FLAG: 0
  FILE_FORMAT: Antelope
   ROW_FORMAT: Compact or Redundant
    PAGE_SIZE: 16384
ZIP_PAGE_SIZE: 0
```