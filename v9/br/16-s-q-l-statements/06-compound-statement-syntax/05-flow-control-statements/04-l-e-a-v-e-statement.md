#### 15.6.5.4 Declaração `LEAVE`

```
LEAVE label
```

Esta declaração é usada para sair da construção de controle de fluxo que tem o rótulo fornecido. Se o rótulo for para o bloco de programa armazenado mais externo, o `LEAVE` sai do programa.

O `LEAVE` pode ser usado dentro de construções `BEGIN ... END` ou de loops (`LOOP`, `REPEAT`, `WHILE`).

Para um exemplo, veja a Seção 15.6.5.5, “Declaração `LOOP`”.