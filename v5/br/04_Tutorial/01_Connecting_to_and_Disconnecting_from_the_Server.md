## 3.1 Conectando-se e Desconectando-se do Servidor

Para se conectar ao servidor, geralmente é necessário fornecer um nome de usuário do MySQL ao invocar o **mysql** e, provavelmente, uma senha. Se o servidor estiver em uma máquina diferente daquela em que você faz o login, também é necessário especificar um nome de host. Entre em contato com o administrador para descobrir quais parâmetros de conexão você deve usar para se conectar (ou seja, qual host, nome de usuário e senha usar). Uma vez que você saiba os parâmetros adequados, você deve ser capaz de se conectar da seguinte forma:

```sql
$> mysql -h host -u user -p
Enter password: ********
```

*`host`* e *`user`* representam o nome do host onde seu servidor MySQL está em execução e o nome de usuário da sua conta MySQL. Substitua os valores apropriados para sua configuração. O `********` representa sua senha; insira-a quando o **mysql** exibir o prompt `Enter password:`.

Se isso funcionar, você deve ver algumas informações introdutórias seguidas por um prompt `mysql>`:

```sql
$> mysql -h host -u user -p
Enter password: ********
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 25338 to server version: 5.7.44-standard

Type 'help;' or '\h' for help. Type '\c' to clear the buffer.

mysql>
```

O prompt `mysql>` informa que o **mysql** está pronto para que você insira declarações SQL.

Se você está fazendo login na mesma máquina em que o MySQL está sendo executado, pode omitir o host e simplesmente usar o seguinte:

```sql
$> mysql -u user -p
```

Se, ao tentar fazer login, você receber uma mensagem de erro como ERRO 2002 (HY000): Não é possível conectar ao servidor MySQL local através do soquete '/tmp/mysql.sock' (2), isso significa que o daemon (Unix) ou serviço (Windows) do servidor MySQL não está em execução. Consulte o administrador ou consulte a seção do Capítulo 2, *Instalando e Atualizando o MySQL* que é apropriada para o seu sistema operacional.

Para obter ajuda com outros problemas que são frequentemente encontrados ao tentar fazer login, consulte a Seção B.3.2, “Erros comuns ao usar programas MySQL”.

Algumas instalações do MySQL permitem que os usuários se conectem como o usuário anônimo (sem nome) ao servidor que está sendo executado no host local. Se esse for o caso na sua máquina, você deve ser capaz de se conectar a esse servidor invocando **mysql** sem nenhuma opção:

```sql
$> mysql
```

Depois de se conectar com sucesso, você pode desconectar a qualquer momento, digitando `QUIT` (ou `\q`) no prompt `mysql>`:

```sql
mysql> QUIT
Bye
```

Em Unix, você também pode desconectar pressionando Ctrl+D.

A maioria dos exemplos nas seções a seguir assume que você está conectado ao servidor. Eles indicam isso pelo prompt `mysql>`.