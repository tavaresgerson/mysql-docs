### 24.4.26 A tabela INFORMATION_SCHEMA INNODB_SYS_VIRTUAL

A tabela `INNODB_SYS_VIRTUAL` fornece metadados sobre as colunas `virtual geradas` do InnoDB e sobre as colunas nas quais essas colunas virtualizadas são baseadas, equivalentes às informações na tabela `SYS_VIRTUAL` do dicionário de dados do InnoDB.

Uma linha aparece na tabela `INNODB_SYS_VIRTUAL` para cada coluna sobre a qual uma coluna virtual gerada é baseada.

A tabela [`INNODB_SYS_VIRTUAL`](https://pt.wikipedia.org/wiki/Tabela_de_informa%C3%A7%C3%A3o-schema-innodb-sys-virtual) possui as seguintes colunas:

- `TABLE_ID`

  Um identificador que representa a tabela associada à coluna virtual; o mesmo valor que `INNODB_SYS_TABLES.TABLE_ID`.

- `POS`

  O valor da posição da coluna gerada virtualmente. O valor é grande porque codifica o número de sequência da coluna e a posição ordinal. A fórmula usada para calcular o valor utiliza uma operação de bits:

  ```sql
  ((nth virtual generated column for the InnoDB instance + 1) << 16)
  + the ordinal position of the virtual generated column
  ```

  Por exemplo, se a primeira coluna virtual gerada na instância `InnoDB` for a terceira coluna da tabela, a fórmula é `(0 + 1) << 16) + 2`. A primeira coluna virtual gerada na instância `InnoDB` é sempre o número 0. Como a terceira coluna na tabela, a posição ordinal da coluna virtual gerada é 2. As posições ordinais são contadas a partir de 0.

- `BASE_POS`

  A posição ordinal das colunas sobre as quais uma coluna gerada virtualmente é baseada.

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

- Se um valor constante for atribuído a uma coluna gerada virtualmente, como na tabela a seguir, uma entrada para a coluna não aparecerá na tabela `INNODB_SYS_VIRTUAL`. Para que uma entrada apareça, uma coluna gerada virtualmente deve ter uma coluna base.

  ```sql
  CREATE TABLE `t1` (
    `a` int(11) DEFAULT NULL,
    `b` int(11) DEFAULT NULL,
    `c` int(11) GENERATED ALWAYS AS (5) VIRTUAL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  ```

  No entanto, os metadados para essa coluna aparecem na tabela \`[INNODB_SYS_COLUMNS](https://pt.wikipedia.org/wiki/Tabela_INNODB_SYS_COLUMNS) do esquema de informações.

- Você deve ter o privilégio `PROCESSO` para consultar esta tabela.

- Use a tabela `INFORMATION_SCHEMA` `COLUMNS` ou a instrução `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores padrão.
