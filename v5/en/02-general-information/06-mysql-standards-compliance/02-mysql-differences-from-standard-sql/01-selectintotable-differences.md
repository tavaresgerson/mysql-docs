#### 1.6.2.1 Diferenças de SELECT INTO TABLE

O MySQL Server não oferece suporte à extensão SQL `SELECT ... INTO TABLE` do Sybase. Em vez disso, o MySQL Server suporta a sintaxe SQL padrão `INSERT INTO ... SELECT`, que é basicamente a mesma coisa. Consulte a Seção 13.2.5.1, “Instrução INSERT ... SELECT”. Por exemplo:

```sql
INSERT INTO tbl_temp2 (fld_id)
    SELECT tbl_temp1.fld_order_id
    FROM tbl_temp1 WHERE tbl_temp1.fld_order_id > 100;
```

Alternativamente, você pode usar `SELECT ... INTO OUTFILE` ou `CREATE TABLE ... SELECT`.

Você pode usar `SELECT ... INTO` com *user-defined variables* (variáveis definidas pelo usuário). A mesma sintaxe também pode ser usada dentro de *stored routines* (rotinas armazenadas) usando *cursors* e *local variables*. Consulte a Seção 13.2.9.1, “Instrução SELECT ... INTO”.