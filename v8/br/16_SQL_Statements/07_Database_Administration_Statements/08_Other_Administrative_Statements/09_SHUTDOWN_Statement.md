#### 15.7.8.9 Declaração de ENCERRAMENTO

```
SHUTDOWN
```

Esta declaração para com o servidor MySQL. Ela requer o privilégio `SHUTDOWN`.

`SHUTDOWN` fornece uma interface de nível SQL para a mesma funcionalidade disponível usando o comando **mysqladmin shutdown** ou a função da API C `mysql_shutdown()`. Uma sequência `SHUTDOWN` bem-sucedida consiste em verificar os privilégios, validar os argumentos e enviar um pacote OK ao cliente. Em seguida, o servidor é desligado.

A variável de status `Com_shutdown` acompanha o número de instruções `SHUTDOWN`. Como as variáveis de status são inicializadas para cada inicialização do servidor e não persistem em reinicializações, `Com_shutdown` normalmente tem um valor de zero, mas pode ser diferente de zero se as instruções `SHUTDOWN` forem executadas, mas falharem.

Outra maneira de parar o servidor é enviá-lo um sinal `SIGTERM`, que pode ser feito por `root` ou pela conta que possui o processo do servidor. `SIGTERM` permite que o desligamento do servidor seja realizado sem precisar se conectar ao servidor. Veja a Seção 6.10, “Tratamento de Sinais Unix no MySQL”.
