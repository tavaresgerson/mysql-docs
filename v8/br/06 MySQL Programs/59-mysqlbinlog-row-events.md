#### 6.6.9.2 mysqlbinlog Apresentação de eventos de linha

Os exemplos a seguir ilustram como **mysqlbinlog** exibe eventos de linha que especificam modificações de dados. Estes correspondem a eventos com os códigos de tipo `WRITE_ROWS_EVENT`, `UPDATE_ROWS_EVENT`, e `DELETE_ROWS_EVENT`. As opções `--base64-output=DECODE-ROWS` e `--verbose` podem ser usadas para afetar a saída de eventos de linha.

Suponha que o servidor está usando registro binário baseado em linhas e que você executa a seguinte sequência de instruções:

```
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

Por padrão, **mysqlbinlog** exibe eventos de linha codificados como strings base-64 usando instruções `BINLOG`.

```
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

Para ver os eventos de linha como comentários na forma de instruções pseudo-SQL, execute **mysqlbinlog** com a opção `--verbose` ou `-v`.

```
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

Especifique `--verbose` ou `-v` duas vezes para também exibir tipos de dados e alguns metadados para cada coluna, e eventos de registro de informações, como eventos de registro de consulta de linha, se a variável de sistema `binlog_rows_query_log_events` for definida como `TRUE`. A saída contém um comentário adicional após cada mudança de coluna:

```
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

Você pode dizer ao **mysqlbinlog** para suprimir as instruções `BINLOG` para eventos de linha usando a opção `--base64-output=DECODE-ROWS`. Isto é semelhante ao `--base64-output=NEVER` mas não sai com um erro se um evento de linha for encontrado. A combinação de `--base64-output=DECODE-ROWS` e `--verbose` fornece uma maneira conveniente de ver eventos de linha apenas como instruções SQL:

```
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

::: info Note

Você não deve suprimir as instruções `BINLOG` se você pretende re-executar a saída **mysqlbinlog**.

:::

As instruções SQL produzidas por `--verbose` para eventos de linha são muito mais legíveis do que as instruções correspondentes `BINLOG`. No entanto, elas não correspondem exatamente às instruções SQL originais que geraram os eventos. Aplicam-se as seguintes limitações:

- Os nomes originais das colunas são perdidos e substituídos por `@N`, onde `N` é um número de coluna.
- Informações sobre conjuntos de caracteres não estão disponíveis no log binário, o que afeta a exibição da coluna de cadeia:

  - Não há distinção feita entre os tipos de string binários e não binários correspondentes (`BINARY` e `CHAR`, `VARBINARY` e `VARCHAR`, `BLOB` e `TEXT`). A saída usa um tipo de dados de `STRING` para strings de comprimento fixo e `VARSTRING` para strings de comprimento variável.
  - Para conjuntos de caracteres multibyte, o número máximo de bytes por caractere não está presente no log binário, então o comprimento para tipos de string é exibido em bytes em vez de em caracteres. Por exemplo, `STRING(4)` é usado como o tipo de dados para valores de qualquer um desses tipos de coluna:

    ```
    CHAR(4) CHARACTER SET latin1
    CHAR(2) CHARACTER SET ucs2
    ```
  - Devido ao formato de armazenamento para eventos do tipo `UPDATE_ROWS_EVENT`, as instruções `UPDATE` são exibidas com a cláusula `WHERE` precedendo a cláusula `SET`.

A interpretação correta de eventos de linha requer a informação do evento de descrição de formato no início do log binário. Como **mysqlbinlog** não sabe antecipadamente se o resto do log contém eventos de linha, por padrão ele exibe o evento de descrição de formato usando uma instrução `BINLOG` na parte inicial da saída.

Se o log binário for conhecido por não conter nenhum evento que exija uma instrução `BINLOG` (ou seja, nenhum evento de linha), a opção `--base64-output=NEVER` pode ser usada para evitar que este cabeçalho seja escrito.
