#### 13.6.6.1 Declaração de cursor CLOSE

```sql
CLOSE cursor_name
```

Esta declaração fecha um cursor que estava aberto anteriormente. Para um exemplo, veja Seção 13.6.6, "Cursors".

Um erro ocorre se o cursor não estiver aberto.

Se não for fechado explicitamente, um cursor é fechado no final do bloco `BEGIN ... END` no qual foi declarado.
