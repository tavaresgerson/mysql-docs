#### 13.6.5.4 Instrução LEAVE

```sql
LEAVE label
```

Esta instrução é usada para sair da construção de controle de fluxo que possui o rótulo fornecido. Se o rótulo for para o bloco mais externo do stored program, `LEAVE` encerra o programa.

`LEAVE` pode ser usado dentro de `BEGIN ... END` ou construções de loop (`LOOP`, `REPEAT`, `WHILE`).

Para um exemplo, veja Seção 13.6.5.5, “Instrução LOOP”.