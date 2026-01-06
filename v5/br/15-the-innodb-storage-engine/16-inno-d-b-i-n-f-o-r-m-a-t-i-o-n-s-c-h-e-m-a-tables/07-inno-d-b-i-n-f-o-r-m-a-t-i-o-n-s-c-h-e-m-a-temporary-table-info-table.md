### 14.16.7 Tabela de informações da tabela temporária do esquema de informações do InnoDB

`INNODB_TEMP_TABLE_INFO` fornece informações sobre as tabelas temporárias `InnoDB` criadas pelo usuário que estão ativas na instância `InnoDB`. Não fornece informações sobre as tabelas temporárias `InnoDB` internas usadas pelo otimizador.

```sql
mysql> SHOW TABLES FROM INFORMATION_SCHEMA LIKE 'INNODB_TEMP%';
+---------------------------------------------+
| Tables_in_INFORMATION_SCHEMA (INNODB_TEMP%) |
+---------------------------------------------+
| INNODB_TEMP_TABLE_INFO                      |
+---------------------------------------------+
```

Para a definição da tabela, consulte a Seção 24.4.27, “A tabela INFORMATION\_SCHEMA INNODB\_TEMP\_TABLE\_INFO”.

**Exemplo 14.12 INNODB\_TEMP\_TABLE\_INFO**

Este exemplo demonstra as características da tabela `INNODB_TEMP_TABLE_INFO`.

1. Crie uma tabela temporária simples do tipo `InnoDB`:

   ```sql
   mysql> CREATE TEMPORARY TABLE t1 (c1 INT PRIMARY KEY) ENGINE=INNODB;
   ```

2. Faça uma consulta `INNODB_TEMP_TABLE_INFO` para visualizar os metadados da tabela temporária.

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

   O `TABLE_ID` é um identificador único para a tabela temporária. A coluna `NAME` exibe o nome gerado pelo sistema para a tabela temporária, que é precedido por “#sql”. O número de colunas (`N_COLS`) é de 4 em vez de 1 porque o `InnoDB` sempre cria três colunas ocultas da tabela (`DB_ROW_ID`, `DB_TRX_ID` e `DB_ROLL_PTR`). `PER_TABLE_TABLESPACE` e `IS_COMPRESSED` retornam `TRUE` para tabelas temporárias compactadas. Caso contrário, esses campos retornam `FALSE`.

3. Crie uma tabela temporária compactada.

   ```sql
   mysql> CREATE TEMPORARY TABLE t2 (c1 INT) ROW_FORMAT=COMPRESSED ENGINE=INNODB;
   ```

4. Pergunte novamente `INNODB_TEMP_TABLE_INFO`.

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

   O relatório `PER_TABLE_TABLESPACE` e `IS_COMPRESSED` indicam `TRUE` para a tabela temporária comprimida. O ID `SPACE` para a tabela temporária comprimida é diferente porque as tabelas temporárias comprimidas são criadas em espaços de tabelas separados por arquivo. As tabelas temporárias não comprimidas são criadas no espaço de tabelas temporárias compartilhadas (`ibtmp1`) e indicam o mesmo ID `SPACE`.

5. Reinicie o MySQL e execute a consulta `INNODB_TEMP_TABLE_INFO`.

   ```sql
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_TEMP_TABLE_INFO\G
   Empty set (0.00 sec)
   ```

   Um conjunto vazio é retornado porque `INNODB_TEMP_TABLE_INFO` e seus dados não são persistidos no disco quando o servidor é desligado.

6. Crie uma nova tabela temporária.

   ```sql
   mysql> CREATE TEMPORARY TABLE t1 (c1 INT PRIMARY KEY) ENGINE=INNODB;
   ```

7. Faça uma consulta `INNODB_TEMP_TABLE_INFO` para visualizar os metadados da tabela temporária.

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

   O ID `SPACE` pode ser diferente porque é gerado dinamicamente quando o servidor é iniciado.
