### 7.9.2 Debug de um cliente MySQL

Para ser capaz de depurar um cliente MySQL com o pacote de depuração integrado, você deve configurar o MySQL com `-DWITH_DEBUG=1`.

Antes de executar um cliente, você deve definir a variável de ambiente `MYSQL_DEBUG`:

```
$> MYSQL_DEBUG=d:t:O,/tmp/client.trace
$> export MYSQL_DEBUG
```

Isso faz com que os clientes gerem um arquivo de rastreamento em `/tmp/client.trace`.

Se você tiver problemas com seu próprio código cliente, você deve tentar se conectar ao servidor e executar sua consulta usando um cliente que é conhecido por funcionar. Faça isso executando \*\* mysql \*\* no modo de depuração (supondo que você tenha compilado o MySQL com depuração ativada):

```
$> mysql --debug=d:t:O,/tmp/client.trace
```

Este fornece informações úteis no caso de enviar um relatório de bugs.

Se o seu cliente falhar em algum código de aparência 'legal', você deve verificar se o seu `mysql.h` incluem arquivo corresponde ao seu arquivo de biblioteca MySQL. Um erro muito comum é usar um arquivo antigo `mysql.h` de uma instalação antiga do MySQL com a nova biblioteca MySQL.
