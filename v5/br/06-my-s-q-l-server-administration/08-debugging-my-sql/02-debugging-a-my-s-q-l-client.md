### 5.8.2 Depuração de um cliente MySQL

Para poder depurar um cliente MySQL com o pacote de depuração integrado, você deve configurar o MySQL com `-DWITH_DEBUG=1`. Veja Seção 2.8.7, “Opções de Configuração de Fonte do MySQL”.

Antes de executar um cliente, você deve definir a variável de ambiente `MYSQL_DEBUG`:

```sql
$> MYSQL_DEBUG=d:t:O,/tmp/client.trace
$> export MYSQL_DEBUG
```

Isso faz com que os clientes gerem um arquivo de registro em `/tmp/client.trace`.

Se você tiver problemas com o código do cliente, tente se conectar ao servidor e executar sua consulta usando um cliente que é conhecido por funcionar. Faça isso executando **mysql** no modo depuração (assumindo que você compilou o MySQL com depuração ativada):

```sql
$> mysql --debug=d:t:O,/tmp/client.trace
```

Isso fornece informações úteis caso você envie um relatório de erro por e-mail. Veja Seção 1.5, “Como relatar erros ou problemas”.

Se o seu cliente apresentar um erro em algum código que parece legal, você deve verificar se o arquivo de inclusão `mysql.h` corresponde ao arquivo da biblioteca MySQL. Um erro muito comum é usar um arquivo `mysql.h` antigo de uma instalação antiga do MySQL com a nova biblioteca MySQL.
