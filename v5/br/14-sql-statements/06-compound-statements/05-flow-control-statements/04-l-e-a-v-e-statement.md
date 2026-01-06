#### 13.6.5.4 Declaração LEAVE

```sql
LEAVE label
```

Esta declaração é usada para sair da estrutura de controle de fluxo que tem o rótulo dado. Se o rótulo for para o bloco de programa armazenado mais externo, `LEAVE` sai do programa.

`LEAVE` pode ser usado dentro de estruturas de `BEGIN ... END` (begin-end.html) ou loops (`LOOP`, `REPEAT`, `WHILE`).

Para um exemplo, veja Seção 13.6.5.5, “Instrução LOOP”.
