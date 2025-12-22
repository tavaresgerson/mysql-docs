## 6.10 Manipulação de sinais Unix no MySQL

Em sistemas Unix e Unix-like, um processo pode ser o destinatário de sinais enviados para ele pela conta do sistema `root` ou pela conta do sistema que possui o processo. Os sinais podem ser enviados usando o comando **kill**. Alguns interpretadores de comandos associam certas sequências de chaves a sinais, como **Control+C** para enviar um sinal `SIGINT`. Esta seção descreve como o servidor MySQL e os programas do cliente respondem aos sinais.

- Resposta do servidor aos sinais
- Resposta do cliente aos sinais

### Resposta do servidor aos sinais

`mysqld` responde aos sinais da seguinte forma:

- `SIGTERM` faz com que o servidor seja desligado. Isso é como executar uma instrução `SHUTDOWN` sem ter que se conectar ao servidor (que para o desligamento requer uma conta que tenha o privilégio `SHUTDOWN`).
- \[`SIGHUP`] faz com que o servidor recarregue as tabelas de concessão e limpe tabelas, registros, cache de thread e cache de host. Estas ações são como várias formas da instrução \[`FLUSH`]. O envio do sinal permite que as operações de limpeza sejam executadas sem ter que se conectar ao servidor, o que requer uma conta MySQL que tenha privilégios suficientes para essas operações.
- `SIGUSR1` faz com que o servidor limpe o log de erros, o log de consultas gerais e o log de consultas lentas. Um uso para `SIGUSR1` é implementar a rotação de log sem ter que se conectar ao servidor, o que requer uma conta MySQL que tenha privilégios suficientes para essas operações.

  A resposta do servidor para `SIGUSR1` é um subconjunto da resposta para `SIGHUP`, permitindo que `SIGUSR1` seja usado como um sinal mais "leve" que limpa certos logs sem os outros efeitos `SIGHUP` como limpar o thread e os caches do host e escrever um relatório de status para o log de erros.
- \[`SIGINT`]] normalmente é ignorado pelo servidor. Iniciar o servidor com a opção \[`--gdb`]] instala um manipulador de interrupção para \[`SIGINT`]] para fins de depuração.

### Resposta do cliente aos sinais

Os programas cliente do MySQL respondem aos sinais da seguinte forma:

- O cliente `mysql` interpreta `SIGINT` (tipicamente o resultado da digitação de **Control+C**) como instrução para interromper a instrução atual se houver uma, ou para cancelar qualquer linha de entrada parcial de outra forma.
- Programas cliente que usam a biblioteca cliente MySQL bloqueiam sinais de `SIGPIPE` por padrão. Estas variações são possíveis:

  - O cliente pode instalar seu próprio manipulador `SIGPIPE` para substituir o comportamento padrão. Veja Writing C API Threaded Client Programs.
  - Os clientes podem impedir a instalação de manipuladores `SIGPIPE` especificando a opção `CLIENT_IGNORE_SIGPIPE` em `mysql_real_connect()` no momento da conexão. Veja mysql\_real\_connect ().
