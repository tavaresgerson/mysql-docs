### 28.4.29 A Tabela `INFORMATION_SCHEMA.INNODB_VIRTUAL`

A tabela `INNODB_VIRTUAL` fornece metadados sobre as colunas virtuais geradas por `InnoDB` e sobre as colunas nas quais as colunas geradas virtualmente são baseadas.

Uma linha aparece na tabela `INNODB_VIRTUAL` para cada coluna nas quais uma coluna gerada virtualmente é baseada.

A tabela `INNODB_VIRTUAL` tem as seguintes colunas:

* `TABLE_ID`

  Um identificador que representa a tabela associada à coluna virtual; o mesmo valor que `INNODB_TABLES.TABLE_ID`.

* `POS`

  O valor de posição da coluna gerada virtualmente. O valor é grande porque codifica o número de sequência da coluna e a posição ordinal. A fórmula usada para calcular o valor utiliza uma operação de bits:

  ```
  ((nth virtual generated column for the InnoDB instance + 1) << 16)
  + the ordinal position of the virtual generated column
  ```

  Por exemplo, se a primeira coluna gerada virtualmente na instância `InnoDB` for a terceira coluna da tabela, a fórmula é `(0 + 1) << 16) + 2`. A primeira coluna gerada virtualmente na instância `InnoDB` é sempre o número 0. Como a terceira coluna da tabela, a posição ordinal da coluna gerada virtualmente é 2. As posições ordiais são contadas a partir de 0.

* `BASE_POS`

  A posição ordinal das colunas nas quais uma coluna gerada virtualmente é baseada.

#### Exemplo

```
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
|       98 | 65538 |        0 |
|       98 | 65538 |        1 |
+----------+-------+----------+
```

#### Notas

* Se um valor constante for atribuído a uma coluna gerada virtualmente, como na tabela a seguir, uma entrada para a coluna não aparece na tabela `INNODB_VIRTUAL`. Para que uma entrada apareça, uma coluna virtual deve ter uma coluna base.

  ```
  CREATE TABLE `t1` (
    `a` int(11) DEFAULT NULL,
    `b` int(11) DEFAULT NULL,
    `c` int(11) GENERATED ALWAYS AS (5) VIRTUAL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  ```

  No entanto, os metadados para tal coluna aparecem na tabela `INNODB_COLUMNS`.

* Você deve ter o privilégio `PROCESS` para consultar esta tabela.

* Use a tabela `INFORMATION_SCHEMA` `COLUMNS` ou a instrução `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores padrão.