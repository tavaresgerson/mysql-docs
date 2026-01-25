#### B.3.2.6 Out of memory

Se você emitir uma Query usando o programa Client [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") e receber um erro como o seguinte, isso significa que o [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") não possui memória suficiente para armazenar o resultado inteiro da Query:

```sql
mysql: Out of memory at line 42, 'malloc.c'
mysql: needed 8136 byte (8k), memory in use: 12481367 bytes (12189k)
ERROR 2008: MySQL client ran out of memory
```

Para solucionar o problema, primeiro verifique se sua Query está correta. É razoável que ela deva retornar tantas linhas? Caso contrário, corrija a Query e tente novamente. Caso contrário, você pode invocar o [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") com a opção [`--quick`](mysql-command-options.html#option_mysql_quick). Isso faz com que ele utilize a função C API [`mysql_use_result()`](/doc/c-api/5.7/en/mysql-use-result.html) para recuperar o Result Set, o que impõe menos carga no Client (mas mais no Server).