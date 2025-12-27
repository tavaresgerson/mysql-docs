## 6.10 Gerenciamento de Sinais no Unix em MySQL

Em sistemas Unix e similares, um processo pode ser o destinatário de sinais enviados por conta da conta `root` ou pela conta do sistema que possui o processo. Sinais podem ser enviados usando o comando **kill**. Alguns interpretadores de comandos associam certas sequências de teclas a sinais, como **Control+C** para enviar um sinal `SIGINT`. Esta seção descreve como o servidor MySQL e os programas cliente respondem a sinais.

* Resposta do Servidor a Sinais
* Resposta do Cliente a Sinais

### Resposta do Servidor a Sinais

O **mysqld** responde a sinais da seguinte forma:

* `SIGTERM` faz o servidor desligar. Isso é como executar uma declaração `SHUTDOWN` sem precisar se conectar ao servidor (o que, para o desligamento, requer uma conta que tenha o privilégio `SHUTDOWN`).

* `SIGHUP` faz o servidor recarregar as tabelas de concessão e esvaziar as tabelas, logs, a cache de threads e a cache de hosts. Essas ações são como várias formas da declaração `FLUSH`. Enviar o sinal permite que as operações de esvaziamento sejam realizadas sem precisar se conectar ao servidor, o que requer uma conta MySQL que tenha privilégios suficientes para essas operações.

Esse comportamento é desatualizado e está sujeito à remoção em uma versão futura do MySQL.

* `SIGUSR1` faz o servidor esvaziar o log de erros, o log de consultas gerais e o log de consultas lentas. Um uso para `SIGUSR1` é implementar a rotação de log sem precisar se conectar ao servidor, o que requer uma conta MySQL que tenha privilégios suficientes para essas operações. Para informações sobre rotação de log, consulte a Seção 7.4.6, “Manutenção do Log do Servidor”.

A resposta do servidor ao `SIGUSR1` é um subconjunto da resposta ao `SIGHUP`, permitindo que o `SIGUSR1` seja usado como um sinal mais "leve" que limpa certos logs sem os outros efeitos do `SIGHUP`, como limpar os caches de threads e hosts e escrever um relatório de status no log de erro.

* O `SIGINT` normalmente é ignorado pelo servidor. Iniciar o servidor com a opção `--gdb` instala um manipulador de interrupção para `SIGINT` para fins de depuração. Veja a Seção 7.9.1.4, “Depuração do mysqld sob o gdb”.

### Resposta do Cliente aos Sinais

Os programas clientes do MySQL respondem aos sinais da seguinte forma:

* O cliente **mysql** interpreta o `SIGINT` (tipicamente o resultado da digitação de **Control+C**) como uma instrução para interromper a declaração atual, se houver uma, ou para cancelar qualquer linha de entrada parcial, caso contrário. Esse comportamento pode ser desativado usando a opção `--sigint-ignore` para ignorar sinais `SIGINT`.

* Os programas clientes que usam a biblioteca do cliente MySQL bloqueiam sinais `SIGPIPE` por padrão. Essas variações são possíveis:

  + O cliente pode instalar seu próprio manipulador `SIGPIPE` para sobrescrever o comportamento padrão. Veja Escrevendo Programas de Cliente em Cadeia com a API C.

  + Os clientes podem impedir a instalação de manipuladores `SIGPIPE` especificando a opção `CLIENT_IGNORE_SIGPIPE` para `mysql_real_connect()` no momento da conexão. Veja mysql\_real\_connect().