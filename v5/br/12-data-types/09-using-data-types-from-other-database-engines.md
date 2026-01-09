## 11.9 Usando Tipos de Dados de Outros Motores de Banco de Dados

Para facilitar o uso de códigos escritos para implementações SQL de outros fornecedores, o MySQL mapeia os tipos de dados conforme mostrado na tabela a seguir. Essas mapeiações facilitam a importação de definições de tabelas de outros sistemas de banco de dados para o MySQL.

<table summary="Mapeamento dos tipos de dados do MySQL aos tipos de dados de outros fornecedores."><col style="width: 35%"/><col style="width: 55%"/><thead><tr> <th>Outro tipo de fornecedor</th> <th>MySQL Tipo</th> </tr></thead><tbody><tr> <td>[[PH_HTML_CODE_<code>FLOAT8</code>]</td> <td>[[PH_HTML_CODE_<code>FLOAT8</code>]</td> </tr><tr> <td>[[PH_HTML_CODE_<code>INT1</code>]</td> <td>[[PH_HTML_CODE_<code>TINYINT</code>]</td> </tr><tr> <td>[[PH_HTML_CODE_<code>INT2</code>]</em>)</code></td> <td>[[PH_HTML_CODE_<code>SMALLINT</code>]</em>)</code></td> </tr><tr> <td>[[PH_HTML_CODE_<code>INT3</code>]</td> <td>[[PH_HTML_CODE_<code>MEDIUMINT</code>]</td> </tr><tr> <td>[[PH_HTML_CODE_<code>INT4</code>]</td> <td>[[PH_HTML_CODE_<code>INT</code>]</td> </tr><tr> <td>[[<code>FLOAT8</code>]]</td> <td>[[<code>TINYINT</code><code>FLOAT8</code>]</td> </tr><tr> <td>[[<code>INT1</code>]]</td> <td>[[<code>TINYINT</code>]]</td> </tr><tr> <td>[[<code>INT2</code>]]</td> <td>[[<code>SMALLINT</code>]]</td> </tr><tr> <td>[[<code>INT3</code>]]</td> <td>[[<code>MEDIUMINT</code>]]</td> </tr><tr> <td>[[<code>INT4</code>]]</td> <td>[[<code>INT</code>]]</td> </tr><tr> <td>[[<code>BOOLEAN</code><code>FLOAT8</code>]</td> <td>[[<code>BOOLEAN</code><code>FLOAT8</code>]</td> </tr><tr> <td>[[<code>BOOLEAN</code><code>INT1</code>]</td> <td>[[<code>BOOLEAN</code><code>TINYINT</code>]</td> </tr><tr> <td>[[<code>BOOLEAN</code><code>INT2</code>]</td> <td>[[<code>BOOLEAN</code><code>SMALLINT</code>]</td> </tr><tr> <td>[[<code>BOOLEAN</code><code>INT3</code>]</td> <td>[[<code>BOOLEAN</code><code>MEDIUMINT</code>]</td> </tr><tr> <td>[[<code>BOOLEAN</code><code>INT4</code>]</td> <td>[[<code>BOOLEAN</code><code>INT</code>]</td> </tr><tr> <td>[[<code>TINYINT</code><code>FLOAT8</code>]</td> <td>[[<code>TINYINT</code><code>FLOAT8</code>]</td> </tr></tbody></table>

A mapeiagem do tipo de dados ocorre no momento da criação da tabela, após o que as especificações originais do tipo são descartadas. Se você criar uma tabela com tipos usados por outros fornecedores e, em seguida, emitir uma declaração `DESCRIBE tbl_name`, o MySQL relata a estrutura da tabela usando os tipos equivalentes do MySQL. Por exemplo:

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
