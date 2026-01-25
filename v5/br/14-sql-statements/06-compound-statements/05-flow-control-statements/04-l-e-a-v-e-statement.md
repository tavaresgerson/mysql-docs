#### 13.6.5.4 Instrução LEAVE

```sql
LEAVE label
```

Esta instrução é usada para sair da construção de controle de fluxo que possui o rótulo fornecido. Se o rótulo for para o bloco mais externo do stored program, [`LEAVE`](leave.html "13.6.5.4 LEAVE Statement") encerra o programa.

[`LEAVE`](leave.html "13.6.5.4 LEAVE Statement") pode ser usado dentro de [`BEGIN ... END`](begin-end.html "13.6.1 BEGIN ... END Compound Statement") ou construções de loop ([`LOOP`](loop.html "13.6.5.5 LOOP Statement"), [`REPEAT`](repeat.html "13.6.5.6 REPEAT Statement"), [`WHILE`](while.html "13.6.5.8 WHILE Statement")).

Para um exemplo, veja [Seção 13.6.5.5, “Instrução LOOP”](loop.html "13.6.5.5 LOOP Statement").