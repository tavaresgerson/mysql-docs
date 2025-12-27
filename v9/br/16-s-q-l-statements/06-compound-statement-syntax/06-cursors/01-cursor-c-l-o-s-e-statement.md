#### 15.6.6.1 Declaração Cursor CLOSE

```
CLOSE cursor_name
```

Esta declaração fecha um cursor que foi aberto anteriormente. Para um exemplo, consulte a Seção 15.6.6, “Cursors”.

Um erro ocorre se o cursor não estiver aberto.

Se não for fechado explicitamente, um cursor é fechado no final do bloco `BEGIN ... END` no qual foi declarado.