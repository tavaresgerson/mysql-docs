### 24.4.26 A Tabela INNODB_SYS_VIRTUAL do INFORMATION_SCHEMA

A tabela [`INNODB_SYS_VIRTUAL`](information-schema-innodb-sys-virtual-table.html "24.4.26 The INFORMATION_SCHEMA INNODB_SYS_VIRTUAL Table") fornece metadata sobre `InnoDB` [virtual generated columns](glossary.html#glos_virtual_generated_column "virtual generated column") e colunas nas quais as virtual generated columns são baseadas, equivalente às informações na tabela `SYS_VIRTUAL` no dicionário de dados do `InnoDB`.

Uma linha aparece na tabela `INNODB_SYS_VIRTUAL` para cada coluna na qual uma virtual generated column é baseada.

A tabela [`INNODB_SYS_VIRTUAL`](information-schema-innodb-sys-virtual-table.html "24.4.26 The INFORMATION_SCHEMA INNODB_SYS_VIRTUAL Table") possui as seguintes colunas:

* `TABLE_ID`

  Um identificador que representa a tabela associada à coluna virtual; o mesmo valor que `INNODB_SYS_TABLES.TABLE_ID`.

* `POS`

  O valor de posição da [virtual generated column](glossary.html#glos_virtual_generated_column "virtual generated column"). O valor é grande porque codifica o número de sequência da coluna e a posição ordinal. A fórmula usada para calcular o valor utiliza uma operação bitwise:

  ```sql
  ((nth virtual generated column for the InnoDB instance + 1) << 16)
  + the ordinal position of the virtual generated column
  ```

  Por exemplo, se a primeira virtual generated column na instância `InnoDB` for a terceira coluna da tabela, a fórmula é `(0 + 1) << 16) + 2`. A primeira virtual generated column na instância `InnoDB` é sempre o número 0. Como é a terceira coluna na tabela, a posição ordinal da virtual generated column é 2. As posições ordinais são contadas a partir de 0.

* `BASE_POS`

  A posição ordinal das colunas nas quais uma virtual generated column é baseada.

#### Exemplo

```sql
mysql> CREATE TABLE `t1` (
         `a` int(11) DEFAULT NULL,
         `b` int(11) DEFAULT NULL,
         `c` int(11) GENERATED ALWAYS AS (a+b) VIRTUAL,
         `h` varchar(10) DEFAULT NULL
       ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_VIRTUAL
       WHERE TABLE_ID IN
         (SELECT TABLE_ID FROM INFORMATION_SCHEMA.INNODB_TABLES
          WHERE NAME LIKE "test/t1");
+----------+-------+----------+
| TABLE_ID | POS   | BASE_POS |
+----------+-------+----------+
|       95 | 65538 |        0 |
|       95 | 65538 |        1 |
+----------+-------+----------+
```

#### Notas

* Se um valor constante for atribuído a uma [virtual generated column](glossary.html#glos_virtual_generated_column "virtual generated column"), como na tabela a seguir, uma entrada para a coluna não aparecerá na tabela `INNODB_SYS_VIRTUAL`. Para que uma entrada apareça, uma virtual generated column deve ter uma coluna base (base column).

  ```sql
  CREATE TABLE `t1` (
    `a` int(11) DEFAULT NULL,
    `b` int(11) DEFAULT NULL,
    `c` int(11) GENERATED ALWAYS AS (5) VIRTUAL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  ```

  No entanto, a metadata para essa coluna aparece na tabela [`INNODB_SYS_COLUMNS`](information-schema-innodb-sys-columns-table.html "24.4.17 The INFORMATION_SCHEMA INNODB_SYS_COLUMNS Table").

* Você deve ter o privilégio [`PROCESS`](privileges-provided.html#priv_process) para consultar esta tabela.

* Use a tabela [`COLUMNS`](information-schema-columns-table.html "24.3.5 The INFORMATION_SCHEMA COLUMNS Table") do `INFORMATION_SCHEMA` ou o comando [`SHOW COLUMNS`](show-columns.html "13.7.5.5 SHOW COLUMNS Statement") para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores padrão.