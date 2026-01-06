## 3.1 Conectar e desconectar do servidor

Para se conectar ao servidor, você geralmente precisa fornecer um nome de usuário MySQL ao invocar **mysql** e, provavelmente, uma senha. Se o servidor estiver em uma máquina diferente daquela em que você faz login, você também precisa especificar um nome de host. Entre em contato com o administrador para descobrir quais parâmetros de conexão você deve usar para se conectar (ou seja, qual host, nome de usuário e senha usar). Uma vez que você saiba os parâmetros corretos, você deve ser capaz de se conectar da seguinte maneira:

```sh
$> mysql -h host -u user -p
Enter password: ********
```

*`host`* e *`user`* representam o nome do host onde seu servidor MySQL está em execução e o nome de usuário da sua conta MySQL. Substitua os valores apropriados para sua configuração. O `********` representa sua senha; insira-a quando o **mysql** exibir o prompt `Digite a senha:`.

Se isso funcionar, você deve ver algumas informações introdutórias seguidas pelo prompt `mysql>`.

```sh
$> mysql -h host -u user -p
Enter password: ********
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 25338 to server version: 5.7.44-standard

Type 'help;' or '\h' for help. Type '\c' to clear the buffer.

mysql>
```

O prompt `mysql>` informa que o **mysql** está pronto para você inserir instruções SQL.

Se você estiver fazendo login na mesma máquina em que o MySQL está rodando, pode omitir o host e simplesmente usar o seguinte:

```sh
$> mysql -u user -p
```

Se, ao tentar fazer login, você receber uma mensagem de erro como ERRO 2002 (HY000): Não é possível se conectar ao servidor MySQL local através do soquete '/tmp/mysql.sock' (2), isso significa que o daemon do servidor MySQL (Unix) ou serviço (Windows) não está em execução. Consulte o administrador ou consulte a seção de \[Capítulo 2, *Instalando e Atualizando o MySQL*] (installing.html) que é apropriada para o seu sistema operacional.

Para obter ajuda com outros problemas frequentemente encontrados ao tentar fazer login, consulte Seção B.3.2, “Erros Comuns ao Usar Programas MySQL”.

Algumas instalações do MySQL permitem que os usuários se conectem como o usuário anônimo (sem nome) ao servidor que está rodando no host local. Se esse for o caso na sua máquina, você deve ser capaz de se conectar ao servidor invocando **mysql** sem nenhuma opção:

```sh
$> mysql
```

Depois de se conectar com sucesso, você pode desconectar a qualquer momento digitando `QUIT` (ou `\q`) no prompt `mysql>`:

```sh
mysql> QUIT
Bye
```

No Unix, você também pode desconectar pressionando Control+D.

A maioria dos exemplos nas seções a seguir assume que você está conectado ao servidor. Eles indicam isso pelo prompt `mysql>`.
