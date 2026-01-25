## 3.1 Conectando-se e Desconectando-se do Servidor

Para conectar-se ao servidor, geralmente você precisa fornecer um *user name* MySQL ao invocar [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") e, muito provavelmente, uma *password*. Se o servidor estiver rodando em uma máquina diferente daquela em que você está logado, você também precisará especificar um *host name*. Entre em contato com seu administrador para descobrir quais parâmetros de conexão você deve usar (ou seja, qual *host*, *user name* e *password* usar). Depois de saber os parâmetros corretos, você deve ser capaz de se conectar assim:

```sql
$> mysql -h host -u user -p
Enter password: ********
```

*`host`* e *`user`* representam o *host name* onde seu servidor MySQL está rodando e o *user name* de sua conta MySQL. Substitua valores apropriados para sua configuração. O `********` representa sua *password*; digite-a quando [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") exibir o *prompt* `Enter password:`.

Se isso funcionar, você deverá ver algumas informações introdutórias seguidas por um *prompt* `mysql>`:

```sql
$> mysql -h host -u user -p
Enter password: ********
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 25338 to server version: 5.7.44-standard

Type 'help;' or '\h' for help. Type '\c' to clear the buffer.

mysql>
```

O *prompt* `mysql>` informa que [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") está pronto para você inserir *SQL statements*.

Se você estiver fazendo *login* na mesma máquina em que o MySQL está rodando, você pode omitir o *host* e simplesmente usar o seguinte:

```sql
$> mysql -u user -p
```

Se, ao tentar fazer *login*, você receber uma mensagem de erro como ERROR 2002 (HY000): Can't connect to local MySQL server through socket '/tmp/mysql.sock' (2), isso significa que o *daemon* do servidor MySQL (Unix) ou *service* (Windows) não está em execução. Consulte o administrador ou veja a seção apropriada ao seu sistema operacional no [Chapter 2, *Installing and Upgrading MySQL*](installing.html "Chapter 2 Installing and Upgrading MySQL").

Para obter ajuda com outros problemas frequentemente encontrados ao tentar fazer *login*, consulte [Section B.3.2, “Common Errors When Using MySQL Programs”](common-errors.html "B.3.2 Common Errors When Using MySQL Programs”).

Algumas instalações MySQL permitem que os usuários se conectem como o usuário *anonymous* (sem nome) ao servidor rodando no *local host*. Se for esse o caso em sua máquina, você deverá conseguir se conectar a esse servidor invocando [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") sem nenhuma opção:

```sql
$> mysql
```

Após se conectar com sucesso, você pode se desconectar a qualquer momento digitando `QUIT` (ou `\q`) no *prompt* `mysql>`:

```sql
mysql> QUIT
Bye
```

No Unix, você também pode se desconectar pressionando Control+D.

A maioria dos exemplos nas seções seguintes pressupõe que você esteja conectado ao servidor. Eles indicam isso através do *prompt* `mysql>`.