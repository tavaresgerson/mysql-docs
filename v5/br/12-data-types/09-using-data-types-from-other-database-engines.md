## 11.9 Usando Tipos de Dados de Outros Motores de Banco de Dados

Para facilitar o uso de código escrito para implementações SQL de outros fornecedores, o MySQL mapeia os tipos de dados conforme mostrado na tabela a seguir. Esses mapeamentos tornam mais fácil importar definições de tabela de outros sistemas de banco de dados para o MySQL.

<table summary="Mapeamento de tipos de dados MySQL para tipos de dados de outros fornecedores."><col style="width: 35%"/><col style="width: 55%"/><thead><tr> <th>Tipo de Outro Fornecedor</th> <th>Tipo MySQL</th> </tr></thead><tbody><tr> <td><code>BOOL</code></td> <td><code>TINYINT</code></td> </tr><tr> <td><code>BOOLEAN</code></td> <td><code>TINYINT</code></td> </tr><tr> <td><code>CHARACTER VARYING(<em><code>M</code></em>)</code></td> <td><code>VARCHAR(<em><code>M</code></em>)</code></td> </tr><tr> <td><code>FIXED</code></td> <td><code>DECIMAL</code></td> </tr><tr> <td><code>FLOAT4</code></td> <td><code>FLOAT</code></td> </tr><tr> <td><code>FLOAT8</code></td> <td><code>DOUBLE</code></td> </tr><tr> <td><code>INT1</code></td> <td><code>TINYINT</code></td> </tr><tr> <td><code>INT2</code></td> <td><code>SMALLINT</code></td> </tr><tr> <td><code>INT3</code></td> <td><code>MEDIUMINT</code></td> </tr><tr> <td><code>INT4</code></td> <td><code>INT</code></td> </tr><tr> <td><code>INT8</code></td> <td><code>BIGINT</code></td> </tr><tr> <td><code>LONG VARBINARY</code></td> <td><code>MEDIUMBLOB</code></td> </tr><tr> <td><code>LONG VARCHAR</code></td> <td><code>MEDIUMTEXT</code></td> </tr><tr> <td><code>LONG</code></td> <td><code>MEDIUMTEXT</code></td> </tr><tr> <td><code>MIDDLEINT</code></td> <td><code>MEDIUMINT</code></td> </tr><tr> <td><code>NUMERIC</code></td> <td><code>DECIMAL</code></td> </tr></tbody></table>

O mapeamento de tipos de dados ocorre no momento da criação da tabela, após o qual as especificações de tipo originais são descartadas. Se você criar uma tabela com tipos usados por outros fornecedores e então emitir um comando `DESCRIBE tbl_name`, o MySQL reporta a estrutura da tabela usando os tipos MySQL equivalentes. Por exemplo:

```sql
mysql> CREATE TABLE t (a BOOL, b FLOAT8, c LONG VARCHAR, d NUMERIC);
Query OK, 0 rows affected (0.00 sec)

mysql> DESCRIBE t;
+-------+---------------+------+-----+---------+-------+
| Field | Type          | Null | Key | Default | Extra |
+-------+---------------+------+-----+---------+-------+
| a     | tinyint(1)    | YES  |     | NULL    |       |
| b     | double        | YES  |     | NULL    |       |
| c     | mediumtext    | YES  |     | NULL    |       |
| d     | decimal(10,0) | YES  |     | NULL    |       |
+-------+---------------+------+-----+---------+-------+
4 rows in set (0.01 sec)
```