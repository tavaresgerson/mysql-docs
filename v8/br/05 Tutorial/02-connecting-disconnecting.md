## 5.1 Conectando-se e Desconectando-se do Servidor

Para se conectar ao servidor, geralmente é necessário fornecer um nome de usuário MySQL ao invocar o `mysql` e, provavelmente, uma senha. Se o servidor estiver em uma máquina diferente daquela em que você faz login, também é necessário especificar um nome de host. Entre em contato com o administrador para descobrir quais parâmetros de conexão você deve usar para se conectar (ou seja, qual host, nome de usuário e senha usar). Uma vez que você saiba os parâmetros corretos, você deve ser capaz de se conectar da seguinte maneira:

```bash
$> mysql -h host -u user -p
Enter password: ********
```

`host` e `user` representam o nome do host onde seu servidor MySQL está em execução e o nome de usuário da sua conta MySQL. Substitua os valores apropriados para sua configuração. O `********` representa sua senha; insira-a quando o `mysql` exibir o prompt `Digite a senha:`.

Se isso funcionar, você deve ver algumas informações introdutórias seguidas por um prompt `mysql>`:

```bash
$> mysql -h host -u user -p
Enter password: ********
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 25338 to server version: 8.4.6-standard

Type 'help;' or '\h' for help. Type '\c' to clear the buffer.

mysql>
```

O prompt `mysql>` informa que o `mysql` está pronto para você inserir instruções SQL.

Se você estiver fazendo login na mesma máquina em que o MySQL está em execução, pode omitir o host e simplesmente usar o seguinte:

```bash
$> mysql -u user -p
```

Se, ao tentar fazer login, você receber uma mensagem de erro como ERRO 2002 (HY000): Não é possível conectar-se ao servidor MySQL local através do soquete `/tmp/mysql.sock` (2), isso significa que o daemon do servidor MySQL (Unix) ou serviço (Windows) não está em execução. Consulte o administrador ou veja a seção do Capítulo 2, Instalando MySQL, que é apropriada para o seu sistema operacional.

Para obter ajuda com outros problemas frequentemente encontrados ao tentar fazer login, consulte a Seção B.3.2, “Erros Comuns ao Usar Programas MySQL”.

Algumas instalações do MySQL permitem que os usuários se conectem como o usuário anônimo (sem nome) ao servidor em execução no host local. Se esse for o caso na sua máquina, você deve ser capaz de se conectar a esse servidor invocando o `mysql` sem nenhuma opção:

```bash
$> mysql
```

Depois de se conectar com sucesso, você pode desconectar a qualquer momento digitando `QUIT` (ou `\q`) no prompt `mysql>`:

```bash
mysql> QUIT
Bye
```

No Unix, você também pode desconectar pressionando `Control+D`.

A maioria dos exemplos nas seções a seguir assume que você está conectado ao servidor. Isso é indicado pelo prompt `mysql>`.