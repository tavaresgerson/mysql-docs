#### 15.6.6.1 Declaração de cursor CLOSE

```
CLOSE cursor_name
```

Essa declaração fecha um cursor que estava aberto anteriormente. Para um exemplo, veja a Seção 15.6.6, “Cursors”.

Um erro ocorre se o cursor não estiver aberto.

Se não for fechado explicitamente, o cursor é fechado no final do bloco `BEGIN ... END` no qual foi declarado.
