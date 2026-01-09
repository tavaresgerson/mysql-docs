#### B.3.2.6 Sem memória

Se você emitir uma consulta usando o programa cliente [**mysql**](mysql.html) e receber um erro como o seguinte, isso significa que o [**mysql**](mysql.html) não tem memória suficiente para armazenar o resultado completo da consulta:

```sql
mysql: Out of memory at line 42, 'malloc.c'
mysql: needed 8136 byte (8k), memory in use: 12481367 bytes (12189k)
ERROR 2008: MySQL client ran out of memory
```

Para corrigir o problema, primeiro verifique se sua consulta está correta. É razoável que ela retorne tantas linhas? Se não for, corrija a consulta e tente novamente. Caso contrário, você pode invocar [**mysql**](mysql.html) com a opção [`--quick`](mysql-command-options.html#option_mysql_quick). Isso faz com que ele use a função C API [`mysql_use_result()`](/doc/c-api/5.7/en/mysql-use-result.html) para recuperar o conjunto de resultados, o que coloca menos carga no cliente (mas mais no servidor).
