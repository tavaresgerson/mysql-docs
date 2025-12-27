#### 1.7.2.1 Diferenças entre SELECT INTO TABLE e INSERT INTO TABLE

O MySQL Server não suporta a extensão Sybase SQL `SELECT ... INTO TABLE`. Em vez disso, o MySQL Server suporta a sintaxe SQL padrão `INSERT INTO ... SELECT`, que é basicamente a mesma coisa. Veja a Seção 15.2.7.1, “Instrução INSERT ... SELECT”. Por exemplo:

```
INSERT INTO tbl_temp2 (fld_id)
    SELECT tbl_temp1.fld_order_id
    FROM tbl_temp1 WHERE tbl_temp1.fld_order_id > 100;
```

Alternativamente, você pode usar `SELECT ... INTO OUTFILE` ou `CREATE TABLE ... SELECT`.

Você pode usar `SELECT ... INTO` com variáveis definidas pelo usuário. A mesma sintaxe também pode ser usada dentro de rotinas armazenadas usando cursor e variáveis locais. Veja a Seção 15.2.13.1, “Instrução SELECT ... INTO”.