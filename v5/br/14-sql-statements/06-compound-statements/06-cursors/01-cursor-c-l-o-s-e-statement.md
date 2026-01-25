#### 13.6.6.1 Instrução CLOSE de Cursor

```sql
CLOSE cursor_name
```

Esta instrução fecha um Cursor previamente aberto. Para um exemplo, consulte [Seção 13.6.6, “Cursors”](cursors.html "13.6.6 Cursors").

Ocorre um erro se o Cursor não estiver aberto.

Se não for fechado explicitamente, um Cursor é fechado no final do bloco [`BEGIN ... END`](begin-end.html "13.6.1 Instrução Composta BEGIN ... END") no qual foi declarado.