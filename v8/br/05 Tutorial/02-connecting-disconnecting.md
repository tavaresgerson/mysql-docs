## 5.1 Conexão e desconexão do servidor

Para se conectar ao servidor, você geralmente precisa fornecer um nome de usuário do MySQL quando invoca `mysql` e, provavelmente, uma senha. Se o servidor estiver em execução em uma máquina diferente da que você faz login, você também deve especificar um nome de host. Contacte o seu administrador para descobrir quais parâmetros de conexão você deve usar para se conectar (ou seja, qual host, nome de usuário e senha usar). Uma vez que você conheça os parâmetros adequados, você deve ser capaz de se conectar assim:

```bash
$> mysql -h host -u user -p
Enter password: ********
```

O `host` e o `user` representam o nome do host onde o seu servidor MySQL está sendo executado e o nome do usuário da sua conta MySQL. Substitua os valores apropriados para a sua configuração. O `********` representa a sua senha; insira-a quando o `mysql` exibe o prompt `Enter password:`.

Se isso funcionar, você deve ver algumas informações introdutórias seguidas de um prompt `mysql>`:

```bash
$> mysql -h host -u user -p
Enter password: ********
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 25338 to server version: 8.4.6-standard

Type 'help;' or '\h' for help. Type '\c' to clear the buffer.

mysql>
```

O prompt `mysql>` informa que `mysql` está pronto para você inserir instruções SQL.

Se você está fazendo login na mesma máquina em que o MySQL está sendo executado, você pode omitir o host, e simplesmente usar o seguinte:

```bash
$> mysql -u user -p
```

Se, ao tentar fazer login, você receber uma mensagem de erro como ERROR 2002 (HY000): Não é possível se conectar ao servidor MySQL local através do soquete `/tmp/mysql.sock` (2), isso significa que o demônio do servidor MySQL (Unix) ou serviço (Windows) não está sendo executado. Consulte o administrador ou consulte a seção do Capítulo 2, Instalar o MySQL que é apropriado para o seu sistema operacional.

Para obter ajuda com outros problemas frequentemente encontrados ao tentar fazer login, consulte a Seção B.3.2, "Erros Comuns Ao Usar Programas MySQL".

Algumas instalações do MySQL permitem que os usuários se conectem como usuário anônimo (sem nome) ao servidor em execução no host local. Se este for o caso em sua máquina, você deve ser capaz de se conectar a esse servidor invocando `mysql` sem nenhuma opção:

```bash
$> mysql
```

Depois de se conectar com sucesso, você pode se desconectar a qualquer momento digitando `QUIT` (ou `\q`) no prompt `mysql>`:

```bash
mysql> QUIT
Bye
```

No Unix, você também pode desconectar pressionando `Control+D`.

A maioria dos exemplos nas seções seguintes assume que você está conectado ao servidor. Eles indicam isso pelo prompt `mysql>`.
