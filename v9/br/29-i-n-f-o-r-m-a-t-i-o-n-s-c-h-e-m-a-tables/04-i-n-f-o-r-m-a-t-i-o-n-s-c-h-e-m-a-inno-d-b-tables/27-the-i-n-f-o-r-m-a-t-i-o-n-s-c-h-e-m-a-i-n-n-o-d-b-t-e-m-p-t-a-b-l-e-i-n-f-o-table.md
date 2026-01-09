### 28.4.27 A Tabela `INFORMATION_SCHEMA_INNODB_TEMP_TABLE_INFO`

A tabela `INNODB_TEMP_TABLE_INFO` fornece informações sobre as tabelas temporárias `InnoDB` criadas por usuários que estão ativas em uma instância `InnoDB`. Ela não fornece informações sobre as tabelas temporárias `InnoDB` internas usadas pelo otimizador. A tabela `INNODB_TEMP_TABLE_INFO` é criada quando a consulta é realizada pela primeira vez, existe apenas na memória e não é persistida no disco.

Para informações de uso e exemplos, consulte a Seção 17.15.7, “Tabela de Informações de Tabela Temporária `INFORMATION_SCHEMA` InnoDB”.

A tabela `INNODB_TEMP_TABLE_INFO` tem as seguintes colunas:

* `TABLE_ID`

  O ID da tabela temporária.

* `NAME`

  O nome da tabela temporária.

* `N_COLS`

  O número de colunas na tabela temporária. O número inclui três colunas ocultas criadas pelo `InnoDB` (`DB_ROW_ID`, `DB_TRX_ID` e `DB_ROLL_PTR`).

* `SPACE`

  O ID do espaço de tabelas temporárias onde a tabela temporária reside.

#### Exemplo

```
mysql> CREATE TEMPORARY TABLE t1 (c1 INT PRIMARY KEY) ENGINE=INNODB;

mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_TEMP_TABLE_INFO\G
*************************** 1. row ***************************
TABLE_ID: 97
    NAME: #sql8c88_43_0
  N_COLS: 4
   SPACE: 76
```

#### Notas

* Esta tabela é útil principalmente para monitoramento de nível avançado.
* Você deve ter o privilégio `PROCESS` para consultar esta tabela.

* Use a tabela `COLUMNS` do `INFORMATION_SCHEMA` ou a instrução `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores padrão.