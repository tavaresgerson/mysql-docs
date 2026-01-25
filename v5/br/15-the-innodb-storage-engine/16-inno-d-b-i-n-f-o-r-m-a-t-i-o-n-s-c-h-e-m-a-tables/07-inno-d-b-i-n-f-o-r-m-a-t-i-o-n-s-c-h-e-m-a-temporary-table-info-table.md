### 14.16.7 Tabela de Informações de Tabelas Temporárias InnoDB no INFORMATION_SCHEMA

`INNODB_TEMP_TABLE_INFO` fornece informações sobre as tabelas temporárias `InnoDB` criadas pelo usuário que estão ativas na instância `InnoDB`. Ela não fornece informações sobre as tabelas temporárias `InnoDB` internas usadas pelo optimizer.

```sql
mysql> SHOW TABLES FROM INFORMATION_SCHEMA LIKE 'INNODB_TEMP%';
+---------------------------------------------+
| Tables_in_INFORMATION_SCHEMA (INNODB_TEMP%) |
+---------------------------------------------+
| INNODB_TEMP_TABLE_INFO                      |
+---------------------------------------------+
```

Para a definição da tabela, consulte a Seção 24.4.27, “A Tabela INNODB_TEMP_TABLE_INFO do INFORMATION_SCHEMA”.

**Exemplo 14.12 INNODB_TEMP_TABLE_INFO**

Este exemplo demonstra as características da tabela `INNODB_TEMP_TABLE_INFO`.

1. Crie uma tabela temporária `InnoDB` simples:

   ```sql
   mysql> CREATE TEMPORARY TABLE t1 (c1 INT PRIMARY KEY) ENGINE=INNODB;
   ```

2. Execute uma Query em `INNODB_TEMP_TABLE_INFO` para visualizar os metadados da tabela temporária.

   ```sql
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_TEMP_TABLE_INFO\G
   *************************** 1. row ***************************
               TABLE_ID: 194
                   NAME: #sql7a79_1_0
                 N_COLS: 4
                  SPACE: 182
   PER_TABLE_TABLESPACE: FALSE
          IS_COMPRESSED: FALSE
   ```

   O `TABLE_ID` é um identificador exclusivo para a tabela temporária. A coluna `NAME` exibe o nome gerado pelo sistema para a tabela temporária, que é prefixado com “#sql”. O número de colunas (`N_COLS`) é 4 em vez de 1 porque o `InnoDB` sempre cria três colunas de tabela ocultas (`DB_ROW_ID`, `DB_TRX_ID` e `DB_ROLL_PTR`). `PER_TABLE_TABLESPACE` e `IS_COMPRESSED` reportam `TRUE` para tabelas temporárias compactadas. Caso contrário, esses campos reportam `FALSE`.

3. Crie uma tabela temporária compactada.

   ```sql
   mysql> CREATE TEMPORARY TABLE t2 (c1 INT) ROW_FORMAT=COMPRESSED ENGINE=INNODB;
   ```

4. Execute uma Query em `INNODB_TEMP_TABLE_INFO` novamente.

   ```sql
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_TEMP_TABLE_INFO\G
   *************************** 1. row ***************************
               TABLE_ID: 195
                   NAME: #sql7a79_1_1
                 N_COLS: 4
                  SPACE: 183
   PER_TABLE_TABLESPACE: TRUE
          IS_COMPRESSED: TRUE
   *************************** 2. row ***************************
               TABLE_ID: 194
                   NAME: #sql7a79_1_0
                 N_COLS: 4
                  SPACE: 182
   PER_TABLE_TABLESPACE: FALSE
          IS_COMPRESSED: FALSE
   ```

   `PER_TABLE_TABLESPACE` e `IS_COMPRESSED` reportam `TRUE` para a tabela temporária compactada. O `SPACE` ID para a tabela temporária compactada é diferente porque as tabelas temporárias compactadas são criadas em tablespaces separados file-per-table. Tabelas temporárias não compactadas são criadas no tablespace temporário compartilhado (`ibtmp1`) e reportam o mesmo `SPACE` ID.

5. Reinicie o MySQL e execute uma Query em `INNODB_TEMP_TABLE_INFO`.

   ```sql
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_TEMP_TABLE_INFO\G
   Empty set (0.00 sec)
   ```

   Um *empty set* (conjunto vazio) é retornado porque `INNODB_TEMP_TABLE_INFO` e seus dados não são persistidos em disco quando o server é desligado.

6. Crie uma nova tabela temporária.

   ```sql
   mysql> CREATE TEMPORARY TABLE t1 (c1 INT PRIMARY KEY) ENGINE=INNODB;
   ```

7. Execute uma Query em `INNODB_TEMP_TABLE_INFO` para visualizar os metadados da tabela temporária.

   ```sql
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_TEMP_TABLE_INFO\G
   *************************** 1. row ***************************
               TABLE_ID: 196
                   NAME: #sql7b0e_1_0
                 N_COLS: 4
                  SPACE: 184
   PER_TABLE_TABLESPACE: FALSE
          IS_COMPRESSED: FALSE
   ```

   O `SPACE` ID pode ser diferente porque é gerado dinamicamente quando o server é iniciado.