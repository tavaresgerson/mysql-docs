#### 13.7.6.7 Declaração de ENCERRAMENTO

```sql
SHUTDOWN
```

Esta declaração para com o servidor MySQL. Ela requer o privilégio `SHUTDOWN`.

`SHUTDOWN` fornece uma interface de nível SQL para a mesma funcionalidade disponível usando o comando **mysqladmin shutdown** ou a função de API C `mysql_shutdown()`. Uma sequência bem-sucedida de `SHUTDOWN` consiste em verificar os privilégios, validar os argumentos e enviar um pacote OK ao cliente. Em seguida, o servidor é desligado.

A variável de status `Com_shutdown` acompanha o número de instruções `SHUTDOWN`. Como as variáveis de status são inicializadas para cada inicialização do servidor e não persistem em reinicializações, o `Com_shutdown` normalmente tem um valor de zero, mas pode ser diferente de zero se as instruções `SHUTDOWN` tiverem sido executadas, mas falhassem.

Outra maneira de parar o servidor é enviá-lo um sinal `SIGTERM`, que pode ser feito pelo `root` ou pela conta que possui o processo do servidor. `SIGTERM` permite que o desligamento do servidor seja realizado sem precisar se conectar ao servidor. Veja Seção 4.10, “Tratamento de Sinais Unix no MySQL”.
