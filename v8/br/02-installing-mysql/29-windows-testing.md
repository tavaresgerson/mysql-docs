#### 2.3.3.9 Teste da instalação do MySQL

Você pode testar se o servidor MySQL está funcionando executando qualquer um dos seguintes comandos:

```
C:\> "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysqlshow"
C:\> "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysqlshow" -u root mysql
C:\> "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysqladmin" version status proc
C:\> "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql" test
```

Se **mysqld** é lento para responder a conexões TCP/IP de programas cliente, provavelmente há um problema com o seu DNS. Neste caso, inicie **mysqld** com a variável de sistema `skip_name_resolve` habilitada e use apenas `localhost` e endereços IP na coluna `Host` das tabelas de concessão do MySQL. (Certifique-se de que existe uma conta que especifique um endereço IP ou você pode não ser capaz de se conectar.)

Você pode forçar um cliente MySQL a usar uma conexão de tubo nomeado em vez de TCP/IP especificando a opção `--pipe` ou `--protocol=PIPE`, ou especificando `.` (período) como o nome do host. Use a opção `--socket` para especificar o nome do tubo se você não quiser usar o nome do tubo padrão.

Se você definiu uma senha para a conta `root`, apagou a conta anônima ou criou uma nova conta de usuário, então para se conectar ao servidor MySQL você deve usar as opções apropriadas `-u` e `-p` com os comandos mostrados anteriormente. Veja Seção 6.2.4, Conectando ao Servidor MySQL Usando Opções de Comando.

Para mais informações sobre **mysqlshow**, consulte a Seção 6.5.6, mysqlshow  Display Database, Table, and Column Information.
