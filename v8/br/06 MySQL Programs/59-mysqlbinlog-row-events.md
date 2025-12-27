#### 6.6.9.2 Exibição de Eventos de Linha `mysqlbinlog`

Os exemplos seguintes ilustram como o `mysqlbinlog` exibe eventos de linha que especificam modificações de dados. Estes correspondem a eventos com os códigos de tipo `WRITE_ROWS_EVENT`, `UPDATE_ROWS_EVENT` e `DELETE_ROWS_EVENT`. As opções `--base64-output=DECODE-ROWS` e `--verbose` podem ser usadas para afetar a saída dos eventos de linha.

Suponha que o servidor esteja usando o registro binário baseado em linha e que você execute a seguinte sequência de instruções:

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

Por padrão, o `mysqlbinlog` exibe eventos de linha codificados como strings base64 usando as instruções `BINLOG`. Omitindo linhas desnecessárias, a saída para os eventos de linha produzidos pela sequência de instruções anteriores parece assim:

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

Para ver os eventos de linha como comentários na forma de instruções de “pseudo-SQL”, execute o `mysqlbinlog` com a opção `--verbose` ou `-v`. Este nível de saída também mostra informações sobre a partição da tabela, quando aplicável. A saída contém linhas que começam com `###`:

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
### @1=1
### @2='apple'
### @3=NULL
...
# at 302
#080828 15:03:08 server id 1  end_log_pos 356   Update_rows: table id 17 flags: STMT_END_F

BINLOG '
fAS3SBMBAAAALAAAAC4BAAAAABEAAAAAAAAABHRlc3QAAXQAAwMPCgIUAAQ=
fAS3SBgBAAAANgAAAGQBAAAQABEAAAAAAAEAA////AEAAAAFYXBwbGX4AQAAAARwZWFyIbIP
'/*!*/;
### UPDATE test.t
### WHERE
### @1=1
### @2='apple'
### @3=NULL
### SET
### @1=1
### @2='pear'
### @3='2009:01:01'
...
# at 400
#080828 15:03:08 server id 1  end_log_pos 442   Delete_rows: table id 17 flags: STMT_END_F

BINLOG '
fAS3SBMBAAAALAAAAJABAAAAABEAAAAAAAAABHRlc3QAAXQAAwMPCgIUAAQ=
fAS3SBkBAAAAKgAAALoBAAAQABEAAAAAAAEAA//4AQAAAARwZWFyIbIP
'/*!*/;
### DELETE FROM test.t
### WHERE
### @1=1
### @2='pear'
### @3='2009:01:01'
```

Especifique `--verbose` ou `-v` duas vezes para exibir também os tipos de dados e alguns metadados para cada coluna, e eventos de log informativos, como eventos de consulta de linha de log, se a variável de sistema `binlog_rows_query_log_events` estiver definida como `TRUE`. A saída contém um comentário adicional após cada mudança de coluna:

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
### @1=1 /* INT meta=0 nullable=0 is_null=0 */
### @2='apple' /* VARSTRING(20) meta=20 nullable=0 is_null=0 */
### @3=NULL /* VARSTRING(20) meta=0 nullable=1 is_null=1 */
...
# at 302
#080828 15:03:08 server id 1  end_log_pos 356   Update_rows: table id 17 flags: STMT_END_F

BINLOG '
fAS3SBMBAAAALAAAAC4BAAAAABEAAAAAAAAABHRlc3QAAXQAAwMPCgIUAAQ=
fAS3SBgBAAAANgAAAGQBAAAQABEAAAAAAAEAA////AEAAAAFYXBwbGX4AQAAAARwZWFyIbIP
'/*!*/;
### UPDATE test.t
### WHERE
### @1=1 /* INT meta=0 nullable=0 is_null=0 */
### @2='apple' /* VARSTRING(20) meta=20 nullable=0 is_null=0 */
### @3=NULL /* VARSTRING(20) meta=0 nullable=1 is_null=1 */
### SET
### @1=1 /* INT meta=0 nullable=0 is_null=0 */
### @2='pear' /* VARSTRING(20) meta=20 nullable=0 is_null=0 */
### @3='2009:01:01' /* DATE meta=0 nullable=1 is_null=0 */
...
# at 400
#080828 15:03:08 server id 1  end_log_pos 442   Delete_rows: table id 17 flags: STMT_END_F

BINLOG '
fAS3SBMBAAAALAAAAJABAAAAABEAAAAAAAAABHRlc3QAAXQAAwMPCgIUAAQ=
fAS3SBkBAAAAKgAAALoBAAAQABEAAAAAAAEAA//4AQAAAARwZWFyIbIP
'/*!*/;
### DELETE FROM test.t
### WHERE
### @1=1 /* INT meta=0 nullable=0 is_null=0 */
### @2='pear' /* VARSTRING(20) meta=20 nullable=0 is_null=0 */
### @3='2009:01:01' /* DATE meta=0 nullable=1 is_null=0 */
```

Você pode informar ao `mysqlbinlog` para suprimir as instruções `BINLOG` para eventos de linha usando a opção `--base64-output=DECODE-ROWS`. Isso é semelhante a `--base64-output=NEVER`, mas não sai com um erro se um evento de linha for encontrado. A combinação de `--base64-output=DECODE-ROWS` e `--verbose` fornece uma maneira conveniente de ver os eventos de linha apenas como instruções SQL:

```
$> mysqlbinlog -v --base64-output=DECODE-ROWS log_file
...
# at 218
#080828 15:03:08 server id 1  end_log_pos 258   Write_rows: table id 17 flags: STMT_END_F
### INSERT INTO test.t
### SET
### @1=1
### @2='apple'
### @3=NULL
...
# at 302
#080828 15:03:08 server id 1  end_log_pos 356   Update_rows: table id 17 flags: STMT_END_F
### UPDATE test.t
### WHERE
### @1=1
### @2='apple'
### @3=NULL
### SET
### @1=1
### @2='pear'
### @3='2009:01:01'
...
# at 400
#080828 15:03:08 server id 1  end_log_pos 442   Delete_rows: table id 17 flags: STMT_END_F
### DELETE FROM test.t
### WHERE
### @1=1
### @2='pear'
### @3='2009:01:01'
```

::: info Nota

Você não deve suprimir as instruções `BINLOG` se pretende reexecutar a saída do `mysqlbinlog`.

:::

As instruções SQL produzidas por `--verbose` para eventos de linha são muito mais legíveis do que as instruções correspondentes `BINLOG`. No entanto, elas não correspondem exatamente às instruções SQL originais que geraram os eventos. As seguintes limitações se aplicam:

* Os nomes originais das colunas são perdidos e substituídos por `@N`, onde *`N`* é um número de coluna.
* As informações sobre o conjunto de caracteres não estão disponíveis no log binário, o que afeta a exibição das colunas de texto:

  + Não há distinção entre os tipos de texto binário e não binário correspondentes ( `BINARY` e `CHAR`, `VARBINARY` e `VARCHAR`, `BLOB` e `TEXT`). A saída usa um tipo de dado de `STRING` para strings de comprimento fixo e `VARSTRING` para strings de comprimento variável.
  + Para conjuntos de caracteres multibyte, o número máximo de bytes por caractere não está presente no log binário, então o comprimento para os tipos de texto é exibido em bytes em vez de em caracteres. Por exemplo, `STRING(4)` é usado como tipo de dado para valores de qualquer um desses tipos de coluna:

    ```5bAVFrsXkV
  + Devido ao formato de armazenamento para eventos do tipo `UPDATE_ROWS_EVENT`, as instruções `UPDATE` são exibidas com a cláusula `WHERE` antecedendo a cláusula `SET`.

A interpretação correta dos eventos de linha requer as informações da descrição do formato no início do log binário. Como o `mysqlbinlog` não sabe antecipadamente se o resto do log contém eventos de linha, por padrão, ele exibe o evento de descrição de formato usando uma instrução `BINLOG` na parte inicial da saída.

Se o log binário for conhecido por não conter nenhum evento que exija uma instrução `BINLOG` (ou seja, nenhum evento de linha), a opção `--base64-output=NEVER` pode ser usada para impedir que esse cabeçalho seja escrito.