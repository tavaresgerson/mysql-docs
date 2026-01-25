#### 13.7.6.7 Instrução SHUTDOWN

```sql
SHUTDOWN
```

Esta instrução interrompe o servidor MySQL. Ela requer o privilégio [`SHUTDOWN`](privileges-provided.html#priv_shutdown).

A instrução [`SHUTDOWN`](shutdown.html "13.7.6.7 SHUTDOWN Statement") fornece uma interface de nível SQL para a mesma funcionalidade disponível usando o comando [**mysqladmin shutdown**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program") ou a função C API [`mysql_shutdown()`](/doc/c-api/5.7/en/mysql-shutdown.html). Uma sequência [`SHUTDOWN`](shutdown.html "13.7.6.7 SHUTDOWN Statement") bem-sucedida consiste em verificar os privilégios, validar os argumentos e enviar um pacote OK para o cliente. Em seguida, o servidor é encerrado (shut down).

A variável de status [`Com_shutdown`](server-status-variables.html#statvar_Com_xxx) rastreia o número de instruções [`SHUTDOWN`](shutdown.html "13.7.6.7 SHUTDOWN Statement"). Como as variáveis de status são inicializadas para cada inicialização do servidor (server startup) e não persistem após reinicializações (restarts), `Com_shutdown` normalmente tem um valor zero, mas pode ser diferente de zero se instruções [`SHUTDOWN`](shutdown.html "13.7.6.7 SHUTDOWN Statement") foram executadas, mas falharam.

Outra maneira de interromper o servidor é enviar a ele um signal `SIGTERM`, o que pode ser feito pelo `root` ou pela conta que é proprietária do processo do servidor. O `SIGTERM` permite que o server shutdown seja realizado sem a necessidade de se conectar ao servidor. Consulte [Seção 4.10, “Tratamento de Sinal Unix no MySQL”](unix-signal-response.html "4.10 Unix Signal Handling in MySQL").