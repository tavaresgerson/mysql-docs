#### 13.6.5.7 Declaração RETURN

```sql
RETURN expr
```

A instrução `RETURN` termina a execução de uma função armazenada e retorna o valor *`expr`* para o chamador da função. Deve haver pelo menos uma instrução `RETURN` em uma função armazenada. Pode haver mais de uma se a função tiver vários pontos de saída.

Esta declaração não é usada em procedimentos armazenados, gatilhos ou eventos. A declaração `LEAVE` pode ser usada para sair de um programa armazenado desses tipos.
