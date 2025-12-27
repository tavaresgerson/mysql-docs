#### 2.3.3.9 Testando a Instalação do MySQL

Você pode testar se o servidor MySQL está funcionando executando qualquer um dos seguintes comandos:

```bash
C:\> "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysqlshow"
C:\> "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysqlshow" -u root mysql
C:\> "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysqladmin" version status proc
C:\> "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql" test
```

Se o `mysqld` estiver lento para responder a conexões TCP/IP de programas cliente, provavelmente há um problema com o seu DNS. Nesse caso, inicie o `mysqld` com a variável de sistema `skip_name_resolve` habilitada e use apenas `localhost` e endereços IP na coluna `Host` das tabelas de concessão do MySQL. (Certifique-se de que existe uma conta que especifique um endereço IP, caso contrário, você pode não conseguir se conectar.)

Você pode forçar um cliente MySQL a usar uma conexão de pipe nomeada em vez de TCP/IP, especificando a opção `--pipe` ou `--protocol=PIPE`, ou especificando `.` (ponto) como o nome do host. Use a opção `--socket` para especificar o nome do pipe se você não quiser usar o nome de pipe padrão.

Se você definiu uma senha para a conta `root`, excluiu a conta anônima ou criou uma nova conta de usuário, então para se conectar ao servidor MySQL, você deve usar as opções apropriadas `-u` e `-p` com os comandos mostrados anteriormente. Veja a Seção 6.2.4, “Conectando-se ao Servidor MySQL Usando Opções de Comando”.

Para mais informações sobre `mysqlshow`, veja a Seção 6.5.6, “mysqlshow — Exibir Informações de Banco de Dados, Tabela e Coluna”.