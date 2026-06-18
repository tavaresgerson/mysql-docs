#### 13.6.5.7 Instrução RETURN

```sql
RETURN expr
```

A instrução `RETURN` encerra a execução de uma função armazenada (*stored function*) e retorna o valor *`expr`* para o chamador da função. Deve haver pelo menos uma instrução `RETURN` em uma função armazenada. Pode haver mais de uma se a função tiver múltiplos pontos de saída.

Esta instrução não é usada em procedimentos armazenados (*stored procedures*), triggers ou events. A instrução `LEAVE` pode ser usada para sair de um programa armazenado desses tipos.