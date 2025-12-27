### 7.9.2 Depuração de um cliente MySQL

Para poder depurar um cliente MySQL com o pacote de depuração integrado, você deve configurar o MySQL com `-DWITH_DEBUG=1`. Veja a Seção 2.8.7, “Opções de configuração de fonte do MySQL”.

Antes de executar um cliente, você deve definir a variável de ambiente `MYSQL_DEBUG`:

```
$> MYSQL_DEBUG=d:t:O,/tmp/client.trace
$> export MYSQL_DEBUG
```

Isso faz com que os clientes gerem um arquivo de registro em `/tmp/client.trace`.

Se você tiver problemas com o código do seu próprio cliente, tente se conectar ao servidor e executar sua consulta usando um cliente que é conhecido por funcionar. Faça isso executando **mysql** no modo de depuração (assumindo que você compilou o MySQL com depuração ativada):

```
$> mysql --debug=d:t:O,/tmp/client.trace
```

Isso fornece informações úteis caso você envie um relatório de erro. Veja a Seção 1.6, “Como relatar erros ou problemas”.

Se o seu cliente falhar em algum código que parece legal, você deve verificar se o arquivo de inclusão `mysql.h` corresponde ao arquivo da biblioteca MySQL. Um erro muito comum é usar um arquivo `mysql.h` antigo de uma instalação antiga do MySQL com a nova biblioteca MySQL.