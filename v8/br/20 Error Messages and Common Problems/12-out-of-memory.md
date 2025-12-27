#### B.3.2.6 Sem memória

Se você emitir uma consulta usando o programa cliente `mysql` e receber um erro como o seguinte, isso significa que o `mysql` não tem memória suficiente para armazenar todo o resultado da consulta:

```
mysql: Out of memory at line 42, 'malloc.c'
mysql: needed 8136 byte (8k), memory in use: 12481367 bytes (12189k)
ERROR 2008: MySQL client ran out of memory
```

Para resolver o problema, primeiro verifique se sua consulta está correta. É razoável que ela retorne tantas linhas? Se não for, corrija a consulta e tente novamente. Caso contrário, você pode invocar o `mysql` com a opção `--quick`. Isso faz com que ele use a função C `mysql_use_result()` para recuperar o conjunto de resultados, o que reduz a carga no cliente (mas aumenta na servidor).