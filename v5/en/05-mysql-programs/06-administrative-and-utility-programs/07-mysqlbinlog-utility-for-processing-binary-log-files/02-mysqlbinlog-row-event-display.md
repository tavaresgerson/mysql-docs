#### 4.6.7.2 Exibição de Row Event pelo mysqlbinlog

Os exemplos a seguir ilustram como o **mysqlbinlog** exibe os row events que especificam modificações de dados. Estes correspondem a eventos com os códigos de tipo `WRITE_ROWS_EVENT`, `UPDATE_ROWS_EVENT` e `DELETE_ROWS_EVENT`. As opções `--base64-output=DECODE-ROWS` e `--verbose` podem ser usadas para afetar a saída de row event.

Suponha que o server esteja usando logging binário baseado em Row e que você execute a seguinte sequência de statements:

```sql
CREATE TABLE t
(
  id   INT NOT NULL,
  name VARCHAR(20) NOT NULL,
  date DATE NULL
) ENGINE = InnoDB;

START TRANSACTION;
INSERT INTO t VALUES(1, 'apple', NULL);
UPDATE t SET name = 'pear', date = '2009-01-01' WHERE id = 1;
DELETE FROM t WHERE id = 1;
COMMIT;
```

Por padrão, o **mysqlbinlog** exibe os row events codificados como strings base-64 usando statements `BINLOG`. Omitindo linhas irrelevantes, a saída para os row events produzidos pela sequência de statements precedente é a seguinte:

```sql
$> mysqlbinlog log_file
...
# at 218
#080828 15:03:08 server id 1  end_log_pos 258   Write_rows: table id 17 flags: STMT_END_F

BINLOG '
fAS3SBMBAAAALAAAANoAAAAAABEAAAAAAAAABHRlc3QAAXQAAwMPCgIUAAQ=
fAS3SBcBAAAAKAAAAAIBAAAQABEAAAAAAAEAA//8AQAAAAVhcHBsZQ==
'/*!*/;
...
# at 302
#080828 15:03:08 server id 1  end_log_pos 356   Update_rows: table id 17 flags: STMT_END_F

BINLOG '
fAS3SBMBAAAALAAAAC4BAAAAABEAAAAAAAAABHRlc3QAAXQAAwMPCgIUAAQ=
fAS3SBgBAAAANgAAAGQBAAAQABEAAAAAAAEAA////AEAAAAFYXBwbGX4AQAAAARwZWFyIbIP
'/*!*/;
...
# at 400
#080828 15:03:08 server id 1  end_log_pos 442   Delete_rows: table id 17 flags: STMT_END_F

BINLOG '
fAS3SBMBAAAALAAAAJABAAAAABEAAAAAAAAABHRlc3QAAXQAAwMPCgIUAAQ=
fAS3SBkBAAAAKgAAALoBAAAQABEAAAAAAAEAA//4AQAAAARwZWFyIbIP
'/*!*/;
```

Para visualizar os row events como comentários na forma de statements “pseudo-SQL”, execute o **mysqlbinlog** com a opção `--verbose` ou `-v`. A saída contém linhas que começam com `###`:

```sql
$> mysqlbinlog -v log_file
...
# at 218
#080828 15:03:08 server id 1  end_log_pos 258   Write_rows: table id 17 flags: STMT_END_F

BINLOG '
fAS3SBMBAAAALAAAANoAAAAAABEAAAAAAAAABHRlc3QAAXQAAwMPCgIUAAQ=
fAS3SBcBAAAAKAAAAAIBAAAQABEAAAAAAAEAA//8AQAAAAVhcHBsZQ==
'/*!*/;
### INSERT INTO test.t
### SET
###   @1=1
###   @2='apple'
###   @3=NULL
...
# at 302
#080828 15:03:08 server id 1  end_log_pos 356   Update_rows: table id 17 flags: STMT_END_F

BINLOG '
fAS3SBMBAAAALAAAAC4BAAAAABEAAAAAAAAABHRlc3QAAXQAAwMPCgIUAAQ=
fAS3SBgBAAAANgAAAGQBAAAQABEAAAAAAAEAA////AEAAAAFYXBwbGX4AQAAAARwZWFyIbIP
'/*!*/;
### UPDATE test.t
### WHERE
###   @1=1
###   @2='apple'
###   @3=NULL
### SET
###   @1=1
###   @2='pear'
###   @3='2009:01:01'
...
# at 400
#080828 15:03:08 server id 1  end_log_pos 442   Delete_rows: table id 17 flags: STMT_END_F

BINLOG '
fAS3SBMBAAAALAAAAJABAAAAABEAAAAAAAAABHRlc3QAAXQAAwMPCgIUAAQ=
fAS3SBkBAAAAKgAAALoBAAAQABEAAAAAAAEAA//4AQAAAARwZWFyIbIP
'/*!*/;
### DELETE FROM test.t
### WHERE
###   @1=1
###   @2='pear'
###   @3='2009:01:01'
```

Especifique `--verbose` ou `-v` duas vezes para também exibir os data types e alguns metadados para cada column. A saída contém um comentário adicional seguindo cada alteração de column:

```sql
$> mysqlbinlog -vv log_file
...
# at 218
#080828 15:03:08 server id 1  end_log_pos 258   Write_rows: table id 17 flags: STMT_END_F

BINLOG '
fAS3SBMBAAAALAAAANoAAAAAABEAAAAAAAAABHRlc3QAAXQAAwMPCgIUAAQ=
fAS3SBcBAAAAKAAAAAIBAAAQABEAAAAAAAEAA//8AQAAAAVhcHBsZQ==
'/*!*/;
### INSERT INTO test.t
### SET
###   @1=1 /* INT meta=0 nullable=0 is_null=0 */
###   @2='apple' /* VARSTRING(20) meta=20 nullable=0 is_null=0 */
###   @3=NULL /* VARSTRING(20) meta=0 nullable=1 is_null=1 */
...
# at 302
#080828 15:03:08 server id 1  end_log_pos 356   Update_rows: table id 17 flags: STMT_END_F

BINLOG '
fAS3SBMBAAAALAAAAC4BAAAAABEAAAAAAAAABHRlc3QAAXQAAwMPCgIUAAQ=
fAS3SBgBAAAANgAAAGQBAAAQABEAAAAAAAEAA////AEAAAAFYXBwbGX4AQAAAARwZWFyIbIP
'/*!*/;
### UPDATE test.t
### WHERE
###   @1=1 /* INT meta=0 nullable=0 is_null=0 */
###   @2='apple' /* VARSTRING(20) meta=20 nullable=0 is_null=0 */
###   @3=NULL /* VARSTRING(20) meta=0 nullable=1 is_null=1 */
### SET
###   @1=1 /* INT meta=0 nullable=0 is_null=0 */
###   @2='pear' /* VARSTRING(20) meta=20 nullable=0 is_null=0 */
###   @3='2009:01:01' /* DATE meta=0 nullable=1 is_null=0 */
...
# at 400
#080828 15:03:08 server id 1  end_log_pos 442   Delete_rows: table id 17 flags: STMT_END_F

BINLOG '
fAS3SBMBAAAALAAAAJABAAAAABEAAAAAAAAABHRlc3QAAXQAAwMPCgIUAAQ=
fAS3SBkBAAAAKgAAALoBAAAQABEAAAAAAAEAA//4AQAAAARwZWFyIbIP
'/*!*/;
### DELETE FROM test.t
### WHERE
###   @1=1 /* INT meta=0 nullable=0 is_null=0 */
###   @2='pear' /* VARSTRING(20) meta=20 nullable=0 is_null=0 */
###   @3='2009:01:01' /* DATE meta=0 nullable=1 is_null=0 */
```

Você pode instruir o **mysqlbinlog** a suprimir os statements `BINLOG` para row events usando a opção `--base64-output=DECODE-ROWS`. Isso é similar a `--base64-output=NEVER`, mas não encerra com um error caso um row event seja encontrado. A combinação de `--base64-output=DECODE-ROWS` e `--verbose` fornece uma maneira conveniente de ver os row events apenas como statements SQL:

```sql
$> mysqlbinlog -v --base64-output=DECODE-ROWS log_file
...
# at 218
#080828 15:03:08 server id 1  end_log_pos 258   Write_rows: table id 17 flags: STMT_END_F
### INSERT INTO test.t
### SET
###   @1=1
###   @2='apple'
###   @3=NULL
...
# at 302
#080828 15:03:08 server id 1  end_log_pos 356   Update_rows: table id 17 flags: STMT_END_F
### UPDATE test.t
### WHERE
###   @1=1
###   @2='apple'
###   @3=NULL
### SET
###   @1=1
###   @2='pear'
###   @3='2009:01:01'
...
# at 400
#080828 15:03:08 server id 1  end_log_pos 442   Delete_rows: table id 17 flags: STMT_END_F
### DELETE FROM test.t
### WHERE
###   @1=1
###   @2='pear'
###   @3='2009:01:01'
```

Nota

Você não deve suprimir os statements `BINLOG` se pretender re-executar a saída do **mysqlbinlog**.

Os statements SQL produzidos por `--verbose` para row events são muito mais legíveis do que os statements `BINLOG` correspondentes. No entanto, eles não correspondem exatamente aos statements SQL originais que geraram os events. As seguintes limitações se aplicam:

* Os nomes de column originais são perdidos e substituídos por `@N`, onde *`N`* é um número de column.

* A informação de Character Set não está disponível no log binário, o que afeta a exibição de string column:

  + Não há distinção feita entre os tipos de string binários e não binários correspondentes (`BINARY` e `CHAR`, `VARBINARY` e `VARCHAR`, `BLOB` e `TEXT`). A saída usa um data type de `STRING` para strings de tamanho fixo e `VARSTRING` para strings de tamanho variável.

  + Para Character Sets multibyte, o número máximo de bytes por caractere não está presente no log binário, portanto, o length (comprimento) para os tipos de string é exibido em bytes em vez de em caracteres. Por exemplo, `STRING(4)` é usado como o data type para valores de qualquer um destes tipos de column:

    ```sql
    CHAR(4) CHARACTER SET latin1
    CHAR(2) CHARACTER SET ucs2
    ```

  + Devido ao formato de armazenamento para events do tipo `UPDATE_ROWS_EVENT`, os statements `UPDATE` são exibidos com a cláusula `WHERE` precedendo a cláusula `SET`.

A interpretação adequada dos row events exige as informações do *format description event* no início do log binário. Como o **mysqlbinlog** não sabe antecipadamente se o restante do log contém row events, por padrão, ele exibe o *format description event* usando um statement `BINLOG` na parte inicial da saída.

Se for conhecido que o log binário não contém nenhum event que exija um statement `BINLOG` (ou seja, nenhum row event), a opção `--base64-output=NEVER` pode ser usada para evitar que este cabeçalho seja escrito.