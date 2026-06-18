### 17.15.7 Tabela de informações da tabela temporária do esquema de informações do InnoDB

`INNODB_TEMP_TABLE_INFO` fornece informações sobre tabelas temporárias `InnoDB` criadas pelo usuário que estão ativas na instância `InnoDB`. Não fornece informações sobre tabelas temporárias internas `InnoDB` usadas pelo otimizador.

```
mysql> SHOW TABLES FROM INFORMATION_SCHEMA LIKE 'INNODB_TEMP%';
+---------------------------------------------+
| Tables_in_INFORMATION_SCHEMA (INNODB_TEMP%) |
+---------------------------------------------+
| INNODB_TEMP_TABLE_INFO                      |
+---------------------------------------------+
```

Para a definição da tabela, consulte a Seção 28.4.27, “A tabela INFORMATION\_SCHEMA INNODB\_TEMP\_TABLE\_INFO”.

**Exemplo 17.12 INNODB\_TEMP\_TABLE\_INFO**

Este exemplo demonstra as características da tabela `INNODB_TEMP_TABLE_INFO`.

1. Crie uma tabela temporária simples `InnoDB`:

   ```
   mysql> CREATE TEMPORARY TABLE t1 (c1 INT PRIMARY KEY) ENGINE=INNODB;
   ```

2. Faça uma consulta `INNODB_TEMP_TABLE_INFO` para visualizar os metadados da tabela temporária.

   ```
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_TEMP_TABLE_INFO\G
   *************************** 1. row ***************************
               TABLE_ID: 194
                   NAME: #sql7a79_1_0
                 N_COLS: 4
                  SPACE: 182
   ```

   O `TABLE_ID` é um identificador único para a tabela temporária. A coluna `NAME` exibe o nome gerado pelo sistema para a tabela temporária, que é precedido por “#sql”. O número de colunas (`N_COLS`) é de 4 em vez de 1 porque o `InnoDB` sempre cria três colunas ocultas da tabela (`DB_ROW_ID`, `DB_TRX_ID` e `DB_ROLL_PTR`).

3. Reinicie o MySQL e execute a consulta `INNODB_TEMP_TABLE_INFO`.

   ```
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_TEMP_TABLE_INFO\G
   ```

   Um conjunto vazio é retornado porque `INNODB_TEMP_TABLE_INFO` e seus dados não são persistidos no disco quando o servidor é desligado.

4. Crie uma nova tabela temporária.

   ```
   mysql> CREATE TEMPORARY TABLE t1 (c1 INT PRIMARY KEY) ENGINE=INNODB;
   ```

5. Faça uma consulta `INNODB_TEMP_TABLE_INFO` para visualizar os metadados da tabela temporária.

   ```
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_TEMP_TABLE_INFO\G
   *************************** 1. row ***************************
               TABLE_ID: 196
                   NAME: #sql7b0e_1_0
                 N_COLS: 4
                  SPACE: 184
   ```

   O ID `SPACE` pode ser diferente porque é gerado dinamicamente quando o servidor é iniciado.
